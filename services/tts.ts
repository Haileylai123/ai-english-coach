// services/tts.ts — Play TTS audio cross-platform (Web + iOS/Android)
// Uses native <audio> element on web, expo-av on native. Falls back to expo-speech.

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTtsAudio, type TtsVoiceKey, TTS_VOICES } from './backend';

const VOICE_KEY = 'tts_voice_pref';

// Single global HTML <audio> element on web — Safari/Chrome both support it natively
let webAudioEl: HTMLAudioElement | null = null;

// expo-av Audio.Sound (native only)
let nativeSound: any = null;

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
  console.log('[TTS] speak — text length:', text.length, 'voice:', voice, 'platform:', Platform.OS);

  try {
    const audioUri = await fetchTtsAudio(text, voice, opts?.speed ?? 1.0);
    console.log('[TTS] got audio:', audioUri.slice(0, 60));
    await playAudioUri(audioUri, opts);
    console.log('[TTS] playing ✅');
  } catch (e: any) {
    console.warn('[TTS] backend failed, falling back to expo-speech:', e?.message);
    if (opts?.onError) opts.onError(e);
    try {
      const Speech = await import('expo-speech');
      Speech.stop();
      Speech.speak(text, {
        language: 'en-US',
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
  await stopAll();

  if (Platform.OS === 'web') {
    // Use native <audio> element — works on iOS Safari, Chrome, Firefox
    await playViaWebAudio(uri, opts);
  } else {
    // Native (iOS/Android) — use expo-av
    await playViaNativeAudio(uri, opts);
  }
}

async function playViaWebAudio(
  uri: string,
  opts?: { onStart?: () => void; onDone?: () => void; onError?: (e: Error) => void },
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const audio = new window.Audio();
      audio.preload = 'auto';
      audio.src = uri;
      webAudioEl = audio;

      audio.onloadedmetadata = () => {
        opts?.onStart?.();
        audio.play().catch((playErr) => {
          console.warn('[TTS] audio.play() rejected:', playErr?.message);
          if (opts?.onError) opts.onError(new Error('Audio play was blocked. Tap Test voice again.'));
          reject(playErr);
        });
      };
      audio.onended = () => {
        opts?.onDone?.();
        webAudioEl = null;
        resolve();
      };
      audio.onerror = (ev) => {
        const msg = `Audio error: ${audio.error?.message || 'unknown'}`;
        console.warn('[TTS]', msg);
        if (opts?.onError) opts.onError(new Error(msg));
        reject(new Error(msg));
      };
    } catch (err: any) {
      if (opts?.onError) opts.onError(err);
      reject(err);
    }
  });
}

async function playViaNativeAudio(
  uri: string,
  opts?: { onStart?: () => void; onDone?: () => void; onError?: (e: Error) => void },
): Promise<void> {
  try {
    const { Audio } = await import('expo-av');
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, shouldDuckAndroid: true });
    } catch {}

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true },
      (status: any) => {
        if (status.isLoaded && status.didJustFinish) {
          opts?.onDone?.();
          sound.unloadAsync().catch(() => {});
        }
      },
    );
    nativeSound = sound;
    opts?.onStart?.();
  } catch (err: any) {
    if (opts?.onError) opts.onError(err);
    throw err;
  }
}

export async function stopAll(): Promise<void> {
  if (webAudioEl) {
    try { webAudioEl.pause(); webAudioEl.src = ''; } catch {}
    webAudioEl = null;
  }
  if (nativeSound) {
    try { await nativeSound.stopAsync(); await nativeSound.unloadAsync(); } catch {}
    nativeSound = null;
  }
}

export async function pause(): Promise<void> {
  if (webAudioEl) try { webAudioEl.pause(); } catch {}
  if (nativeSound) try { await nativeSound.pauseAsync(); } catch {}
}

export async function resume(): Promise<void> {
  if (webAudioEl) try { await webAudioEl.play(); } catch {}
  if (nativeSound) try { await nativeSound.playAsync(); } catch {}
}

export function isSpeaking(): boolean {
  return !!webAudioEl || !!nativeSound;
}