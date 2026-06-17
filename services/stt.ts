// services/stt.ts — Cross-platform Speech-to-Text
// Web: uses browser's built-in webkitSpeechRecognition (free, instant)
// Native: posts audio to backend Whisper endpoint

import { Platform } from 'react-native';
import { transcribeViaBackend } from './backend';

export interface SttOptions {
  language?: string; // 'en-US', 'zh-HK', etc.
  onInterim?: (text: string) => void;
  onFinal?: (text: string) => void;
  onError?: (e: Error) => void;
}

/** Start a STT session. Returns a stop() function. */
export async function startSttSession(opts: SttOptions = {}): Promise<{ stop: () => Promise<string>; isWeb: boolean }> {
  const lang = opts.language || 'en-US';

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return startWebStt(lang, opts);
  }
  return startNativeSttViaBackend(opts);
}

function startWebStt(
  lang: string,
  opts: SttOptions,
): { stop: () => Promise<string>; isWeb: true } {
  // @ts-ignore — webkitSpeechRecognition is non-standard but widely supported
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) {
    opts.onError?.(new Error('Browser does not support Speech Recognition. Try Chrome/Safari.'));
    return { stop: async () => '', isWeb: true };
  }

  const recog = new SR();
  recog.lang = lang;
  recog.interimResults = true;
  recog.continuous = true;

  let finalText = '';

  recog.onresult = (ev: any) => {
    let interim = '';
    for (let i = ev.resultIndex; i < ev.results.length; i++) {
      const r = ev.results[i];
      if (r.isFinal) {
        finalText += r[0].transcript + ' ';
        opts.onFinal?.(r[0].transcript.trim());
      } else {
        interim += r[0].transcript;
      }
    }
    if (interim) opts.onInterim?.(interim);
  };

  recog.onerror = (ev: any) => {
    opts.onError?.(new Error(`Speech recognition: ${ev.error || 'unknown'}`));
  };

  recog.start();

  return {
    isWeb: true,
    stop: async () => {
      try { recog.stop(); } catch {}
      // Give onresult a moment to flush
      await new Promise(r => setTimeout(r, 200));
      return finalText.trim();
    },
  };
}

async function startNativeSttViaBackend(
  opts: SttOptions,
): Promise<{ stop: () => Promise<string>; isWeb: false }> {
  // Native flow handled by chat.tsx (which records audio then POSTs).
  // This fallback shouldn't normally run on web.
  opts.onError?.(new Error('Native STT requires expo-av flow — see chat.tsx'));
  return { stop: async () => '', isWeb: false };
}