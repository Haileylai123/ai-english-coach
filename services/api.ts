// services/api.ts — Centralized API client for DeepSeek, Whisper, MiniMax
// All real AI calls go through here. Graceful fallback if keys not configured.

import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Config — set via app.json `expo.extra` or hardcode for dev (never commit keys)
// ---------------------------------------------------------------------------
let DEEPSEEK_KEY = '';
let OPENAI_KEY = '';   // for Whisper STT
let MINIMAX_KEY = '';  // for TTS (optional, expo-speech is fallback)

try {
  const Constants = require('expo-constants');
  const extra = Constants.default?.expoConfig?.extra ?? Constants.default?.manifest?.extra ?? {};
  DEEPSEEK_KEY = extra.DEEPSEEK_API_KEY ?? '';
  OPENAI_KEY   = extra.OPENAI_API_KEY ?? '';
  MINIMAX_KEY  = extra.MINIMAX_API_KEY ?? '';
} catch {}

export function hasAI(): boolean { return !!DEEPSEEK_KEY; }
export function hasSTT(): boolean { return !!OPENAI_KEY; }

export function setKeys(deepseek?: string, openai?: string, minimax?: string) {
  if (deepseek) DEEPSEEK_KEY = deepseek;
  if (openai)   OPENAI_KEY   = openai;
  if (minimax)  MINIMAX_KEY  = minimax;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AIAnalysis {
  overall: { score: number; level: string; detail: string };
  fluency: { score: number; detail: string };
  vocabulary: { score: number; detail: string; highlighted: string[] };
  grammar: { score: number; detail: string; corrections: { original: string; correction: string; explain: string }[] };
  pronunciation: { score: number; detail: string };
}

export interface AIChatResponse {
  reply: string;               // natural AI response
  followUpPrompt: string;      // next practice question
  corrections: { original: string; suggestion: string }[];
  encouragement: string;       // short motivational note (zh + en)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function deepseekChat(
  systemPrompt: string,
  userMessage: string,
  opts?: { json?: boolean; temperature?: number; maxTokens?: number },
): Promise<string> {
  if (!DEEPSEEK_KEY) throw new Error('DeepSeek API key not configured');

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DEEPSEEK_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: opts?.temperature ?? 0.7,
      max_tokens: opts?.maxTokens ?? 1024,
      ...(opts?.json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

async function callWhisper(audioUri: string): Promise<string> {
  if (!OPENAI_KEY) throw new Error('OpenAI API key not configured for Whisper');

  const form = new FormData();
  const ext = audioUri.split('.').pop() || 'm4a';
  const mimeMap: Record<string, string> = { m4a: 'audio/mp4', mp4: 'audio/mp4', wav: 'audio/wav', webm: 'audio/webm', mp3: 'audio/mpeg' };
  form.append('file', {
    uri: audioUri,
    type: mimeMap[ext] || 'audio/mp4',
    name: `recording.${ext}`,
  } as any);
  form.append('model', 'whisper-1');
  form.append('language', 'en');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_KEY}` },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Whisper API error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.text ?? '';
}

// ---------------------------------------------------------------------------
// 1. Speech Analysis — replaces analyzer.ts fake scores
// ---------------------------------------------------------------------------

const ANALYSIS_SYSTEM = `You are an expert English speaking coach evaluating a learner's spoken English.
Analyze the transcript and return a JSON object with this exact structure:
{
  "overall": { "score": <0-100>, "level": "<CEFR A1-C2>", "detail": "<1-sentence overall feedback>" },
  "fluency": { "score": <0-100>, "detail": "<feedback on pace, filler words, naturalness>" },
  "vocabulary": { "score": <0-100>, "detail": "<feedback on word variety & level>", "highlighted": ["<3-5 noteworthy words used>"] },
  "grammar": { "score": <0-100>, "detail": "<feedback>", "corrections": [{"original":"...","correction":"...","explain":"..."}] },
  "pronunciation": { "score": <0-100>, "detail": "<gentle note: pronunciation can't be fully assessed from text, but based on vocabulary choice and sentence structure...>" }
}
Be encouraging but honest. The user is an Asian learner (Cantonese/Japanese/Korean speaker).
Score realistically — not everything should be 80+. If the text is very short or simple, score lower.
Only include up to 3 grammar corrections if needed. Return ONLY valid JSON, no other text.`;

export async function analyzeTranscript(transcript: string): Promise<AIAnalysis> {
  if (!DEEPSEEK_KEY) {
    // Fallback to local analysis if no API key
    const { analyzeSpeech } = require('./analyzer');
    const local = analyzeSpeech(transcript);
    return {
      overall: { ...local.overall, detail: local.overall.detail + ' (offline)' },
      fluency: { score: local.fluency.score, detail: local.fluency.detail },
      vocabulary: { score: local.vocabulary.score, detail: local.vocabulary.detail, highlighted: [] },
      grammar: { score: local.grammar.score, detail: local.grammar.detail, corrections: [] },
      pronunciation: { score: local.pronunciation.score, detail: 'Offline mode — approximate score' },
    };
  }

  const text = await deepseekChat(ANALYSIS_SYSTEM, `Analyze this English speech transcript:\n\n"${transcript}"`, { json: true, temperature: 0.3 });
  return JSON.parse(text);
}

// ---------------------------------------------------------------------------
// 2. AI Chat — real dialogue responses
// ---------------------------------------------------------------------------

const CHAT_SYSTEM = `You are a friendly, encouraging English tutor. You are chatting with an English learner from Asia.
Your job:
1. Reply naturally to what they said — like a real conversation partner
2. If they make grammar mistakes, gently note 1-2 corrections
3. Give a follow-up question or prompt to keep the conversation going
4. Be warm, positive, and speak at their level

Return a JSON object:
{
  "reply": "<your natural conversational response, 1-3 sentences>",
  "corrections": [{"original":"<what they wrote>", "suggestion":"<better version>"}],
  "followUpPrompt": "<a next question or topic to continue practice>",
  "encouragement": "<short encouraging note, bilingual if possible e.g. 'Nice work! 加油！'>"
}
Keep replies concise and natural — like WhatsApp messages, not essays.
Return ONLY valid JSON.`;

export async function chatWithAI(
  userText: string,
  context?: { scene?: string; difficulty?: string; history?: string[] },
): Promise<AIChatResponse> {
  let userMsg = userText;
  if (context?.scene) userMsg = `[Scene: ${context.scene}, Level: ${context.difficulty || 'intermediate'}]\n\n${userText}`;

  if (!DEEPSEEK_KEY) {
    return {
      reply: `Great! I heard: "${userText.slice(0, 80)}..." — keep practicing! (AI offline)`,
      corrections: [],
      followUpPrompt: 'Can you tell me more about that?',
      encouragement: 'Keep going! 繼續努力！💪',
    };
  }

  const text = await deepseekChat(CHAT_SYSTEM, userMsg, { json: true, temperature: 0.8 });
  return JSON.parse(text);
}

// ---------------------------------------------------------------------------
// 3. Speech-to-Text via Whisper API
// ---------------------------------------------------------------------------

export async function transcribeAudio(audioUri: string): Promise<string> {
  if (!OPENAI_KEY) throw new Error('STT not configured — please set OPENAI_API_KEY');
  return callWhisper(audioUri);
}

// ---------------------------------------------------------------------------
// 4. TTS via MiniMax (optional — expo-speech is default)
// ---------------------------------------------------------------------------

export async function speakViaMiniMax(text: string, voiceId?: string): Promise<string | null> {
  if (!MINIMAX_KEY) return null;

  const res = await fetch('https://api.minimax.chat/v1/t2a_v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${MINIMAX_KEY}` },
    body: JSON.stringify({
      model: 'speech-01',
      text,
      stream: false,
      voice_setting: { voice_id: voiceId || 'female-qn-qingse', speed: 1.0, vol: 1.0 },
      audio_setting: { sample_rate: 24000, format: 'mp3' },
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.audio_base64 ?? data.data?.audio ?? null;
}

// ---------------------------------------------------------------------------
// 5. Content Generation — AI-generated course lessons
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 6. Auth stubs — real backend integration later
// ---------------------------------------------------------------------------

export async function login(email: string, password: string): Promise<{ id: string; email: string; display_name: string; tier: string }> {
  // TODO: Replace with real auth backend (Supabase / Firebase / custom)
  if (!email || !password) throw new Error('Email and password required');
  // Simulated response for dev
  return { id: 'local-' + Date.now(), email, display_name: email.split('@')[0], tier: 'free' };
}

export async function register(email: string, password: string, displayName?: string): Promise<{ id: string; email: string; display_name: string; tier: string }> {
  // TODO: Replace with real auth backend
  if (!email || !password) throw new Error('Email and password required');
  if (password.length < 6) throw new Error('Password must be at least 6 characters');
  return { id: 'local-' + Date.now(), email, display_name: displayName || email.split('@')[0], tier: 'free' };
}

// ---------------------------------------------------------------------------
// 7. Call/Meeting Analysis — Fluently-style deep analysis
// ---------------------------------------------------------------------------

export interface CallAnalysis {
  transcript: string;
  duration: number; // seconds
  stats: {
    totalWords: number;
    uniqueWords: number;
    wpm: number;           // words per minute
    fillerCount: number;
    fillerWords: string[];
    longestPause: number;  // seconds (estimated)
    sentenceCount: number;
    avgSentenceLength: number;
  };
  fluency: { score: number; detail: string };
  vocabulary: { score: number; detail: string; highlighted: string[] };
  grammar: { score: number; detail: string; corrections: { original: string; correction: string; explain: string }[] };
  overall: { score: number; level: string; summary: string };
  suggestions: string[];    // 3-5 actionable improvement tips
  strengths: string[];      // what they did well
}

const CALL_ANALYSIS_SYSTEM = `You are an expert English communication coach analyzing a real meeting or call transcript.
The speaker is an English learner from Asia. They recorded their side of a meeting/call.

Analyze the transcript and return a JSON object:
{
  "transcript": "<cleaned transcript>",
  "stats": {
    "totalWords": <number>,
    "uniqueWords": <number>,
    "wpm": <number, estimate from text length assuming normal pace>,
    "fillerCount": <number of filler words like um, uh, like, you know, so, actually, basically>,
    "fillerWords": ["<list of filler words found>"],
    "sentenceCount": <number>,
    "avgSentenceLength": <number>
  },
  "fluency": { "score": <0-100>, "detail": "<feedback on pace, flow, filler words>" },
  "vocabulary": { "score": <0-100>, "detail": "<feedback>", "highlighted": ["<3-5 strong words used>"] },
  "grammar": { "score": <0-100>, "detail": "<feedback>", "corrections": [{"original":"...","correction":"...","explain":"..."}] },
  "overall": { "score": <0-100>, "level": "<CEFR A1-C2>", "summary": "<2-3 sentence overall assessment>" },
  "suggestions": ["<3-5 specific, actionable things to work on for next meeting>"],
  "strengths": ["<2-3 things they did well>"]
}
Be specific and actionable. Reference exact phrases from their transcript.
If the transcript is very short (<30 words), note that more data would give better analysis.
Return ONLY valid JSON.`;

export async function analyzeCallTranscript(transcript: string, durationSec: number = 60): Promise<CallAnalysis> {
  if (!DEEPSEEK_KEY) {
    const words = transcript.split(/\s+/).length;
    const unique = new Set(transcript.toLowerCase().match(/\b[a-z]+\b/g) || []).size;
    return {
      transcript,
      duration: durationSec,
      stats: { totalWords: words, uniqueWords: unique, wpm: Math.round(words / (durationSec / 60)), fillerCount: 0, fillerWords: [], longestPause: 0, sentenceCount: transcript.split(/[.!?]+/).length, avgSentenceLength: Math.round(words / Math.max(1, transcript.split(/[.!?]+/).length)) },
      fluency: { score: 60, detail: 'Offline mode — basic stats only.' },
      vocabulary: { score: 60, detail: 'Offline mode.', highlighted: [] },
      grammar: { score: 60, detail: 'Offline mode.', corrections: [] },
      overall: { score: 60, level: 'B1', summary: 'Offline analysis. Connect API for AI feedback.' },
      suggestions: ['Set DEEPSEEK_API_KEY for AI-powered feedback', 'Record more meetings for better analysis'],
      strengths: ['You completed a recording session!'],
    };
  }

  const prompt = `Transcript (duration ~${Math.round(durationSec / 60)} min):\n\n"${transcript}"`;
  const text = await deepseekChat(CALL_ANALYSIS_SYSTEM, prompt, { json: true, temperature: 0.3, maxTokens: 2048 });
  return JSON.parse(text);
}

/** Analyze a meeting from an audio file — full pipeline */
export async function analyzeMeeting(audioUri: string): Promise<CallAnalysis> {
  const transcript = await transcribeAudio(audioUri);
  // Rough duration estimate from audio file — use 60s default if unknown
  return analyzeCallTranscript(transcript, 60);
}

// ---------------------------------------------------------------------------
// 8. Content Generation — AI-generated course lessons
// ---------------------------------------------------------------------------

export async function generateLessonContent(
  topic: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  targetLanguage: string, // e.g. "Japanese", "Korean", "Cantonese"
): Promise<{
  title: string;
  content: string;
  vocab: { en: string; native: string; example: string }[];
  practicePrompt: string;
  quizQuestions: { q: string; opts: string[]; ans: number; explain: string }[];
}> {
  const system = `You create English learning content for ${targetLanguage} speakers at ${level} level.
Topic: ${topic}. Return JSON:
{
  "title": "<lesson title>",
  "content": "<lesson body in markdown, 3-5 paragraphs, bilingual explanations where helpful>",
  "vocab": [{"en":"...","native":"...","example":"..."}],
  "practicePrompt": "<a speaking or writing prompt for the learner>",
  "quizQuestions": [{"q":"...","opts":["...","...","...","..."],"ans":<0-3>,"explain":"..."}]
}
Return ONLY valid JSON.`;

  const text = await deepseekChat(system, `Create a lesson about: ${topic}`, { json: true, temperature: 0.7, maxTokens: 2048 });
  return JSON.parse(text);
}
