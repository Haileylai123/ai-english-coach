// services/backend.ts — Cloudflare Workers backend API client
// Handles auth tokens, retry, refresh, and offline queue

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://hailey-admin.techforliving.net';

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

export async function getSubscription(): Promise<{
  tier: string;
  features: string[];
  expiresAt?: number;
  pricing?: { pro: { monthly: number; currency: string; symbol: string }; premium: { monthly: number; currency: string; symbol: string } };
}> {
  return await request('/api/subscription');
}

export async function startCheckout(payload: { tier: 'pro' | 'premium'; period?: 'monthly' | 'yearly' }): Promise<{
  checkoutUrl: string;
  sessionId: string;
  note?: string;
}> {
  return await request('/api/subscription/checkout', { method: 'POST', body: payload });
}

export async function devUpgrade(tier: 'pro' | 'premium'): Promise<{ ok: boolean; tier: string; expiresAt: number }> {
  return await request('/api/subscription/dev-upgrade', { method: 'POST', body: { tier } });
}

export async function cancelSubscription(): Promise<{ ok: boolean; note?: string }> {
  return await request('/api/subscription/cancel', { method: 'POST', body: {} });
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

// ── Text-to-Speech (Minimax via backend) ──

export type TtsVoiceKey =
  | 'en_warm_man'
  | 'en_warm_woman'
  | 'en_excited_man'
  | 'zh_male'
  | 'zh_female'
  | 'zh_business';

export interface TtsVoice {
  key: TtsVoiceKey;
  id: string;
  label: string;
  language: 'en' | 'zh';
}

export const TTS_VOICES: TtsVoice[] = [
  { key: 'en_warm_woman', id: 'English_Graceful_Lady', label: 'Grace (English, warm woman)', language: 'en' },
  { key: 'en_warm_man', id: 'English_Trustworth_Man', label: 'Caleb (English, warm man)', language: 'en' },
  { key: 'en_excited_man', id: 'English_PassionateWarrior', label: 'Marcus (English, energetic)', language: 'en' },
  { key: 'zh_female', id: 'female-shaonv', label: '小柔 (廣東話/中文, 女)', language: 'zh' },
  { key: 'zh_male', id: 'male-qn-qingse', label: '小青 (中文, 男)', language: 'zh' },
  { key: 'zh_business', id: 'presenter_male', label: '主播 (中文, 專業)', language: 'zh' },
];

export async function listTtsVoices(): Promise<TtsVoice[]> {
  try {
    const data = await request<{ voices: { key: TtsVoiceKey; id: string }[] }>(
      '/api/tts/voices',
      { auth: true },
    );
    return TTS_VOICES.filter(v => data.voices.some(dv => dv.key === v.key));
  } catch {
    return TTS_VOICES;
  }
}

/**
 * Synthesise text via backend → returns an R2-cached MP3 URL (no auth needed for fetch).
 * The URL is cacheable for 24h by the backend.
 */
export async function synthesiseSpeech(
  text: string,
  voiceKey: TtsVoiceKey = 'en_warm_woman',
  speed = 1.0,
): Promise<string> {
  const path = `/api/tts/speak`;
  const qs = new URLSearchParams({ text, voice: voiceKey, speed: String(speed) });
  // Return URL pointing to backend — auth header is not required since we have token
  // But R2 cache returns audio/mpeg; mobile fetches via fetch with bearer header.
  // For simple playback we encode token in URL — but that's not secure. Better: caller
  // uses speakWithAudio() which fetches the bytes via fetch with auth.
  return `${API_BASE}${path}?${qs.toString()}`;
}

/**
 * Fetch TTS audio bytes with authentication.
 * Returns local file:// URI ready for expo-av.
 */
export async function fetchTtsAudio(
  text: string,
  voiceKey: TtsVoiceKey = 'en_warm_woman',
  speed = 1.0,
): Promise<string> {
  const res = await fetch(`${API_BASE}/api/tts/speak`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ text, voice: voiceKey, speed }),
  });
  if (!res.ok) {
    throw new Error(`TTS failed (${res.status})`);
  }
  const blob = await res.blob();
  // Convert blob to base64 data URI (expo-av can play file:// URIs and remote URLs)
  return await blobToBase64(blob);
}

async function blobToBase64(blob: Blob): Promise<string> {
  // React Native's Blob doesn't support FileReader; use expo-file-system to write
  // to cache dir and return the file:// URI.
  const FileSystem = require('expo-file-system/legacy');
  const path = `${FileSystem.cacheDirectory}tts-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.mp3`;
  const reader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      FileSystem.writeAsStringAsync(path, base64, { encoding: 'base64' })
        .then(() => resolve(`file://${path}`))
        .catch(reject);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ── Daily Challenge ──

export interface DailyPrompt {
  scene: string;
  prompt_en: string;
  prompt_zh_HK: string;
  prompt_zh_CN: string;
  prompt_ja: string;
  prompt_ko: string;
}

export interface DailyChallenge {
  date: string;
  scene: string;
  prompt: DailyPrompt;
  promptLocalized: string;
  myCompletion: { score: number; shared: number } | null;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  locale: string | null;
  score: number;
  market: string | null;
  scene: string;
}

export interface MarketStat {
  market: string;
  count: number;
  avg_score: number;
  top_score: number;
}

export interface DailyStreak {
  current: number;
  longest: number;
  lastCompleted: string | null;
  totalDays: number;
}

export async function getDailyChallenge(locale?: string): Promise<DailyChallenge> {
  return await request(
    `/api/daily-challenge/today${locale ? `?locale=${encodeURIComponent(locale)}` : ''}`,
    { auth: false },
  );
}

export async function submitDailyChallenge(payload: {
  score: number;
  scene?: string;
  date?: string;
  durationMs?: number;
  transcript?: string;
  audioUrl?: string;
}): Promise<{ ok: boolean; score: number; rank: number; totalToday: number }> {
  return await request('/api/daily-challenge/complete', { method: 'POST', body: payload });
}

export async function getLeaderboard(params: {
  date?: string;
  scope?: 'global' | 'market';
  market?: string;
  limit?: number;
}): Promise<{
  date: string;
  scope: string;
  market: string;
  leaderboard: LeaderboardEntry[];
  marketStats: MarketStat[];
}> {
  const qs = new URLSearchParams();
  if (params.date) qs.set('date', params.date);
  if (params.scope) qs.set('scope', params.scope);
  if (params.market) qs.set('market', params.market);
  if (params.limit) qs.set('limit', String(params.limit));
  return await request(`/api/daily-challenge/leaderboard?${qs}`, { auth: false });
}

export async function getDailyStreak(): Promise<DailyStreak> {
  return await request('/api/daily-challenge/streak');
}

export async function getDailyHistory(): Promise<{ history: Array<{ challenge_date: string; scene: string; score: number; market: string; shared: number; created_at: number }> }> {
  return await request('/api/daily-challenge/my-history');
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
