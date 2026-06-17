// services/backend.ts — Cloudflare Workers backend API client
// Handles auth tokens, retry, refresh, and offline queue

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://english-coach-backend.workers.dev';

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

const KEY_ACCESS = 'auth_access_token';
const KEY_REFRESH = 'auth_refresh_token';
const KEY_USER = 'auth_user';

export interface AuthUser {
  id: string;
  email: string;
  display_name?: string;
  tier?: string;
  xp?: number;
  level?: number;
  streak?: number;
}

export async function initAuth(): Promise<{ user: AuthUser | null; loggedIn: boolean }> {
  accessToken = await AsyncStorage.getItem(KEY_ACCESS);
  refreshToken = await AsyncStorage.getItem(KEY_REFRESH);
  const userJson = await AsyncStorage.getItem(KEY_USER);
  const user = userJson ? JSON.parse(userJson) : null;
  return { user, loggedIn: !!accessToken };
}

export function isLoggedIn(): boolean {
  return !!accessToken;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export async function register(email: string, password: string, displayName?: string): Promise<AuthUser> {
  const res = await request<{ accessToken: string; refreshToken: string }>('/api/auth/register', {
    method: 'POST',
    body: { email, password, displayName },
    auth: false,
  });
  await saveTokens(res.accessToken, res.refreshToken);
  return await fetchMe();
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await request<{ accessToken: string; refreshToken: string }>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  await saveTokens(res.accessToken, res.refreshToken);
  return await fetchMe();
}

export async function logout(): Promise<void> {
  try {
    if (refreshToken) {
      await request('/api/auth/logout', { method: 'POST', body: { refreshToken } });
    }
  } catch {}
  accessToken = null;
  refreshToken = null;
  await AsyncStorage.multiRemove([KEY_ACCESS, KEY_REFRESH, KEY_USER]);
}

export async function fetchMe(): Promise<AuthUser> {
  const user = await request<AuthUser>('/api/user/me');
  await AsyncStorage.setItem(KEY_USER, JSON.stringify(user));
  return user;
}

// ── Sync helpers ──

export async function syncState(state: {
  vocab?: any[];
  customVocab?: any[];
  analyses?: any[];
  achievements?: any[];
  progress?: any[];
  practice?: any[];
  sceneCount?: Record<string, number>;
}): Promise<{ ok: boolean; syncedAt: number }> {
  return await request('/api/sync/state', { method: 'POST', body: state });
}

export async function getSyncState(): Promise<any> {
  return await request('/api/sync/state');
}

export async function getAiUsage(): Promise<{ used: number; limit: number; remaining: number }> {
  return await request('/api/ai/usage');
}

export async function aiAnalyze(payload: {
  transcript: string;
  scene: string;
  scores: any;
  locale?: string;
}): Promise<{ content: string; usage: { input: number; output: number } }> {
  return await request('/api/ai/analyze', { method: 'POST', body: payload });
}

export async function aiChat(payload: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  scene: string;
  locale?: string;
  level?: string;
}): Promise<{ content: string }> {
  return await request('/api/ai/chat', { method: 'POST', body: payload });
}

export async function aiExplain(payload: {
  word: string;
  sentence?: string;
  locale?: string;
}): Promise<{ content: string }> {
  return await request('/api/ai/explain', { method: 'POST', body: payload });
}

export async function getSubscription(): Promise<{ tier: string; features: string[]; expiresAt?: number }> {
  return await request('/api/subscription');
}

// ── Push notifications ──

export async function registerPushToken(token: string, platform?: string): Promise<void> {
  await request('/api/notifications/register', {
    method: 'POST',
    body: { token, platform },
  });
}

export async function unregisterPushToken(token: string): Promise<void> {
  try {
    await request('/api/notifications/unregister', {
      method: 'POST',
      body: { token },
    });
  } catch {}
}

export async function sendTestPush(): Promise<{ sent: number; errors: number }> {
  return await request('/api/notifications/test', { method: 'POST', body: {} });
}

// ── High-level sync (called from practice flow) ──

/** Build a sync payload from the in-memory AppState. */
export function buildSyncPayload(state: any): {
  vocab: any[];
  customVocab: any[];
  analyses: any[];
  achievements: any[];
  progress: any[];
  sceneCount: Record<string, number>;
} {
  // Convert SRS map to vocab rows
  const vocab = Object.entries(state.srs || {}).map(([word, srs]: [string, any]) => ({
    en: word,
    srsEf: srs.ef,
    srsInterval: srs.interval,
    srsReps: srs.reps,
    srsDue: srs.due,
    lastReview: srs.lastReview ? new Date(srs.lastReview).toISOString().split('T')[0] : null,
    source: 'manual',
  }));

  // Convert customVocab to expected format
  const customVocab = (state.customVocab || []).map((w: any) => ({
    en: w.en,
    zh: w.zh,
    context: w.context,
    createdAt: w.addedAt,
  }));

  // Convert analyses
  const analyses = (state.analysisHistory || []).map((a: any) => ({
    scene: a.scene || state.scene,
    transcript: a.transcript,
    overallScore: a.overall?.score,
    fluencyScore: a.fluency?.score,
    vocabScore: a.vocabulary?.score,
    pronScore: a.pronunciation?.score,
    grammarScore: a.grammar?.score,
    cefrLevel: a.overall?.level,
    wordCount: a.vocabulary?.totalWords,
    aiFeedback: a.aiFeedback,
    createdAt: a.timestamp || Date.now(),
  }));

  // Convert achievements
  const achievements = (state.unlockedAchievements || []).map((key: string) => ({
    key,
    unlockedAt: Date.now(),
  }));

  // Convert course progress
  const progress: any[] = [];
  Object.entries(state.courseProgress || {}).forEach(([courseId, cp]: [string, any]) => {
    (cp.completed || []).forEach((lessonId: string) => {
      progress.push({ courseId, lessonId, completed: true, completedAt: Date.now() });
    });
  });

  // Scene counts
  const sceneCount: Record<string, number> = {};
  if (state.businessCount) sceneCount.business = state.businessCount;
  if (state.ieltsCount) sceneCount.ielts = state.ieltsCount;
  if (state.dailyCount) sceneCount.daily = state.dailyCount;
  if (state.restaurantCount) sceneCount.restaurant = state.restaurantCount;
  if (state.interviewCount) sceneCount.interview = state.interviewCount;
  if (state.datingCount) sceneCount.dating = state.datingCount;
  if (state.doctorCount) sceneCount.doctor = state.doctorCount;

  return { vocab, customVocab, analyses, achievements, progress, sceneCount };
}

/** Sync current state to backend. If fails, queues for later. */
export async function syncUserState(state: any): Promise<{ ok: boolean; synced: boolean; error?: string }> {
  if (!isLoggedIn()) return { ok: false, synced: false, error: 'Not logged in' };
  const payload = buildSyncPayload(state);
  try {
    await syncState(payload);
    await flushOfflineQueue();
    return { ok: true, synced: true };
  } catch (e: any) {
    // Queue the bulk sync for later
    await enqueueOffline('/api/sync/state', 'POST', payload);
    return { ok: false, synced: false, error: e.message };
  }
}

/** Full restore from backend — replace local state. */
export async function restoreUserState(): Promise<any | null> {
  if (!isLoggedIn()) return null;
  try {
    return await getSyncState();
  } catch {
    return null;
  }
}

// ── Core request with auto-refresh + retry ──

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: any;
  auth?: boolean;
  retries?: number;
}

async function request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, retries = 1 } = options;
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (auth && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e: any) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return request(path, { ...options, retries: retries - 1 });
    }
    throw new Error('Network error — check connection');
  }

  if (res.status === 401 && auth && refreshToken && retries > 0) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request(path, { ...options, retries: 0 });
    }
    throw new Error('Session expired — please log in again');
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null as T;
  return await res.json() as T;
}

async function tryRefresh(): Promise<boolean> {
  if (!refreshToken) return false;
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      await saveTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

async function saveTokens(access: string, refresh: string): Promise<void> {
  accessToken = access;
  refreshToken = refresh;
  await AsyncStorage.multiSet([
    [KEY_ACCESS, access],
    [KEY_REFRESH, refresh],
  ]);
}

// ── Offline queue (best-effort, sends later) ──

const QUEUE_KEY = 'api_offline_queue';
let flushing = false;

export async function enqueueOffline(path: string, method: string, body: any): Promise<void> {
  const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
  const queue = queueJson ? JSON.parse(queueJson) : [];
  queue.push({ path, method, body, ts: Date.now() });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function flushOfflineQueue(): Promise<number> {
  if (flushing || !accessToken) return 0;
  flushing = true;
  let flushed = 0;
  try {
    const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
    if (!queueJson) return 0;
    const queue = JSON.parse(queueJson);
    const remaining: any[] = [];
    for (const item of queue) {
      try {
        await request(item.path, { method: item.method, body: item.body, retries: 0 });
        flushed++;
      } catch {
        remaining.push(item);
      }
    }
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  } finally {
    flushing = false;
  }
  return flushed;
}
