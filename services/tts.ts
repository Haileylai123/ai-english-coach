// services/tts.ts — Play TTS audio via expo-av with cache + queue
// Falls back to expo-speech if backend unreachable

import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTtsAudio, type TtsVoiceKey, TTS_VOICES } from './backend';

let sound: Audio.Sound | null = null;
let queue: string[] = [];
let isPlaying = false;

const QUEUE_KEY = 'tts_pending_queue';
const VOICE_KEY = 'tts_voice_pref';

export async function getPreferredVoice(): Promise<TtsVoiceKey> {
  try {
    const v = await AsyncStorage.getItem(VOICE_KEY);
    if (v && TTS_VOICES.some(x => x.key === v)) return v as TtsVoiceKey;
  } catch {}
  return 'en_warm_woman';
}

export async function setPreferredVoice(key: TtsVoiceKey): Promise<void> {
  await AsyncStorage.setItem(VOICE_KEY, key);
}

/** Speak text via Minimax TTS through backend. */
export async function speak(
  text: string,
  voiceKey?: TtsVoiceKey,
  opts?: { speed?: number; onStart?: () => void; onDone?: () => void; onError?: (e: Error) => void },
): Promise<void> {
  if (!text || !text.trim()) return;
  const voice = voiceKey || (await getPreferredVoice());
  console.log('[TTS] speak called — text length:', text.length, 'voice:', voice);

  try {
    const audioUri = await fetchTtsAudio(text, voice, opts?.speed ?? 1.0);
    console.log('[TTS] got audio URI from backend:', audioUri.slice(0, 60));
    await playAudioUri(audioUri, opts);
    console.log('[TTS] playing Minimax audio ✅');
  } catch (e: any) {
    console.warn('[TTS] backend failed, falling back to expo-speech:', e?.message);
    if (opts?.onError) opts.onError(e);
    try {
      const Speech = await import('expo-speech');
      Speech.stop();
      Speech.speak(text, {
        language: voice.startsWith('zh') ? 'zh-HK' : 'en-US',
        rate: opts?.speed ?? 1.0,
        onDone: opts?.onDone,
        onError: () => opts?.onError?.(e),
      });
      opts?.onStart?.();
    } catch {
      throw e;
    }
  }
}

async function playAudioUri(
  uri: string,
  opts?: { onStart?: () => void; onDone?: () => void; onError?: (e: Error) => void },
): Promise<void> {
  // Stop any current playback
  await stopAll();

  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  } catch {}

  const { sound: newSound } = await Audio.Sound.createAsync(
    { uri },
    { shouldPlay: true, progressUpdateIntervalMillis: 200 },
    (status) => {
      if (status.isLoaded && status.didJustFinish) {
        opts?.onDone?.();
        newSound.unloadAsync().catch(() => {});
      }
    },
  );
  sound = newSound;
  opts?.onStart?.();
}

export async function stopAll(): Promise<void> {
  if (sound) {
    try { await sound.stopAsync(); await sound.unloadAsync(); } catch {}
    sound = null;
  }
}

export async function pause(): Promise<void> {
  if (sound) {
    try { await sound.pauseAsync(); } catch {}
  }
}

export async function resume(): Promise<void> {
  if (sound) {
    try { await sound.playAsync(); } catch {}
  }
}

export function isSpeaking(): boolean {
  return !!sound;
}

/** Queue text for sequential playback (used for multi-paragraph reads). */
export function enqueue(text: string): void {
  queue.push(text);
  if (!isPlaying) playQueue();
}

async function playQueue(): Promise<void> {
  if (!queue.length) { isPlaying = false; return; }
  isPlaying = true;
  const next = queue.shift()!;
  await speak(next, undefined, {
    onDone: () => playQueue(),
    onError: () => playQueue(),
  });
}