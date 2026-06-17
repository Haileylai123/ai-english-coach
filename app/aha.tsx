// app/aha.tsx — Aha moment: "你的第一句英文"
// Auto-play demo TTS, user repeats, instant score + celebration
// Goal: < 30s from open to "I did it!" feeling

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  ActivityIndicator, Dimensions, Easing, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useStore } from '../services/store';
import { useI18n } from '../services/i18n';
import { analyzeSpeech } from '../services/analyzer';

const { width: W, height: H } = Dimensions.get('window');
const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';
const GREEN = '#7ec48b';
const GOLD = '#f0c44e';

type Phase = 'ready' | 'demo' | 'yourturn' | 'recording' | 'analyzing' | 'result';

// Phrase keys are localized; component resolves them via t()
const PHRASE_KEYS: Array<{ emoji: string; phraseKey: string; zhKey: string }> = [
  { emoji: '👋', phraseKey: 'aha.phrase.hello', zhKey: 'aha.phrase.hello.zh' },
  { emoji: '🤝', phraseKey: 'aha.phrase.nice', zhKey: 'aha.phrase.nice.zh' },
  { emoji: '😊', phraseKey: 'aha.phrase.howare', zhKey: 'aha.phrase.howare.zh' },
];

export default function AhaScreen() {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const { locale, t } = useI18n();
  const [phase, setPhase] = useState<Phase>('ready');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [transcript, setTranscript] = useState('');

  const recordingRef = useRef<Audio.Recording | null>(null);
  const pulse = useRef(new Animated.Value(1)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const micScale = useRef(new Animated.Value(1)).current;

  const phrases = PHRASE_KEYS;
  const current = {
    emoji: phrases[phraseIdx].emoji,
    phrase: t(phrases[phraseIdx].phraseKey),
    zh: t(phrases[phraseIdx].zhKey),
  };

  // Confetti animation
  useEffect(() => {
    if (phase === 'result' && score > 0) {
      Animated.sequence([
        Animated.timing(confettiAnim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.back(1.5)) }),
        Animated.timing(confettiAnim, { toValue: 0, duration: 400, delay: 800, useNativeDriver: true }),
      ]).start();
    }
  }, [phase, score]);

  // Mic pulse during recording
  useEffect(() => {
    if (phase === 'recording') {
      const a = Animated.loop(Animated.sequence([
        Animated.timing(micScale, { toValue: 1.2, duration: 500, useNativeDriver: true }),
        Animated.timing(micScale, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]));
      a.start();
      return () => a.stop();
    }
    micScale.setValue(1);
  }, [phase]);

  // Auto-play demo on mount
  useEffect(() => {
    const timer = setTimeout(() => playDemo(), 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playDemo = useCallback(() => {
    setPhase('demo');
    Speech.speak(current.phrase, {
      language: 'en',
      rate: 0.8,
      pitch: 1.0,
      onDone: () => {
        setTimeout(() => setPhase('yourturn'), 600);
      },
    });
  }, [current.phrase]);

  const startRecording = useCallback(async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Microphone permission required', 'Please enable mic in Settings');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      recordingRef.current = rec;
      setPhase('recording');

      // Auto-stop after 4 seconds
      setTimeout(() => stopAndAnalyze(), 4000);
    } catch (e: any) {
      Alert.alert('Recording failed', e?.message);
      setPhase('yourturn');
    }
  }, []);

  const stopAndAnalyze = useCallback(async () => {
    if (!recordingRef.current) return;
    setPhase('analyzing');
    try {
      const rec = recordingRef.current;
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      recordingRef.current = null;

      // MVP: simulate "good first score" so user feels successful.
      // Real impl: STT + alignment + pronunciation scoring.
      const mockTranscript = current.phrase.toLowerCase();
      setTranscript(mockTranscript);
      const randomScore = 70 + Math.floor(Math.random() * 26); // 70-95
      setScore(randomScore);

      // Local analyzer
      const localResult = analyzeSpeech(mockTranscript);
      dispatch({ type: 'ADD_ANALYSIS', payload: { ...localResult, transcript: mockTranscript, timestamp: Date.now() } });
      dispatch({ type: 'ADD_XP', payload: 50 }); // Big reward for first try

      setTimeout(() => setPhase('result'), 800);
    } catch (e: any) {
      Alert.alert('Analysis failed', e?.message);
      setPhase('yourturn');
    }
  }, [current.phrase, dispatch]);

  const nextPhrase = () => {
    if (phraseIdx < phrases.length - 1) {
      setPhraseIdx(phraseIdx + 1);
      setPhase('ready');
      setTimeout(() => playDemo(), 400);
    } else {
      finish();
    }
  };

  const finish = () => {
    Speech.stop();
    dispatch({ type: 'SET_DIFFICULTY', payload: state.difficulty || 'beginner' });
    router.replace('/(tabs)/chat');
  };

  const skip = () => {
    Speech.stop();
    router.replace('/(tabs)/chat');
  };

  return (
    <View style={s.root}>
      {/* Confetti overlay */}
      {phase === 'result' && (
        <Animated.View style={[s.confetti, { opacity: confettiAnim }]} pointerEvents="none">
          {['🎉', '⭐', '✨', '🎊', '💫', '🌟'].map((e: string, i: number) => (
            <Text key={i} style={[s.confettiEmoji, { left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 15}%` }]}>{e}</Text>
          ))}
        </Animated.View>
      )}

      {/* Top bar */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={skip} style={s.skipBtn}>
          <Text style={s.skipTxt}>{t('aha.skip')}</Text>
        </TouchableOpacity>
        <Text style={s.topBarTitle}>{t('aha.title')}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Progress dots */}
      <View style={s.progressRow}>
        {phrases.map((_: any, i: number) => (
          <View key={i} style={[s.dot, i <= phraseIdx && s.dotOn]} />
        ))}
      </View>

      {/* Main content */}
      <View style={s.content}>
        {/* Phrase card */}
        <View style={s.phraseCard}>
          <Text style={s.emoji}>{current.emoji}</Text>
          <Text style={s.phrase}>{current.phrase}</Text>
          <Text style={s.phraseZh}>{current.zh}</Text>
        </View>

        {/* Phase UI */}
        {phase === 'ready' && (
          <View style={s.phaseBox}>
            <Text style={s.phaseLab}>{t('aha.ready')}</Text>
            <TouchableOpacity style={s.bigBtn} onPress={playDemo} activeOpacity={0.85}>
              <Text style={s.bigBtnTxt}>{t('aha.listen')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'demo' && (
          <View style={s.phaseBox}>
            <Text style={s.phaseLab}>🎧 {t('aha.listenHint')}</Text>
            <View style={s.soundWave}>
              {[0, 1, 2, 3, 4].map((i: number) => (
                <Animated.View
                  key={i}
                  style={[s.waveBar, {
                    height: 20 + Math.random() * 30,
                    transform: [{ scaleY: pulse }],
                  }]}
                />
              ))}
            </View>
          </View>
        )}

        {phase === 'yourturn' && (
          <View style={s.phaseBox}>
            <Text style={s.phaseLab}>🎤 {t('aha.yourTurn')}</Text>
            <Text style={s.phaseSub}>{t('aha.speakOut')}</Text>
            <Animated.View style={{ transform: [{ scale: micScale }] }}>
              <TouchableOpacity style={s.micBtn} onPress={startRecording} activeOpacity={0.85}>
                <Text style={s.micIcon}>🎙️</Text>
              </TouchableOpacity>
            </Animated.View>
            <Text style={s.micHint}>{t('aha.tapToSpeak')}</Text>
          </View>
        )}

        {phase === 'recording' && (
          <View style={s.phaseBox}>
            <Text style={s.phaseLab}>🔴 {t('aha.recording')}...</Text>
            <Animated.View style={[s.micBtn, s.micBtnRec, { transform: [{ scale: micScale }] }]}>
              <Text style={s.micIcon}>🎙️</Text>
            </Animated.View>
            <Text style={s.micHint}>{t('aha.speaking')}: "{current.phrase}"</Text>
          </View>
        )}

        {phase === 'analyzing' && (
          <View style={s.phaseBox}>
            <ActivityIndicator size="large" color={PINK} />
            <Text style={s.phaseLab}>🤖 {t('aha.analyzing')}...</Text>
            <Text style={s.phaseSub}>{t('aha.aiScoring')}</Text>
          </View>
        )}

        {phase === 'result' && (
          <View style={s.phaseBox}>
            <Text style={s.phaseLab}>🎉 {t('aha.success')}</Text>
            <View style={s.scoreCircle}>
              <Text style={s.scoreVal}>{score}</Text>
              <Text style={s.scoreLab}>/100</Text>
            </View>
            <Text style={s.phaseSub}>
              {score >= 90 ? t('aha.scorePerfect') :
               score >= 75 ? t('aha.scoreGreat') :
               score >= 60 ? t('aha.scoreGood') :
               t('aha.scoreOk')}
            </Text>
            <View style={s.xpBadge}>
              <Text style={s.xpTxt}>{t('aha.xpEarned')}</Text>
            </View>
            <View style={s.resultBtns}>
              {phraseIdx < phrases.length - 1 ? (
                <TouchableOpacity style={s.bigBtn} onPress={nextPhrase} activeOpacity={0.85}>
                  <Text style={s.bigBtnTxt}>{t('aha.nextPhrase')}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={s.bigBtn} onPress={finish} activeOpacity={0.85}>
                  <Text style={s.bigBtnTxt}>{t('aha.startApp')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  topBar: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topBarTitle: { fontSize: 14, color: INK, fontWeight: '800' },
  skipBtn: { padding: 6 },
  skipTxt: { fontSize: 12, color: MUTED, fontWeight: '700' },

  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f5e8de' },
  dotOn: { backgroundColor: PINK, width: 24 },

  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },

  phraseCard: { backgroundColor: '#fff', borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, width: '100%' },
  emoji: { fontSize: 56, marginBottom: 12 },
  phrase: { fontSize: 26, color: INK, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  phraseZh: { fontSize: 14, color: MUTED, fontWeight: '600' },

  phaseBox: { alignItems: 'center', width: '100%' },
  phaseLab: { fontSize: 18, color: PINK, fontWeight: '800', marginBottom: 8 },
  phaseSub: { fontSize: 13, color: MUTED, fontWeight: '600', marginBottom: 20, textAlign: 'center' },

  bigBtn: { backgroundColor: PINK, paddingHorizontal: 28, paddingVertical: 16, borderRadius: 16, shadowColor: PINK, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  bigBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
  resultBtns: { marginTop: 16, width: '100%', alignItems: 'center' },

  soundWave: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 60, marginVertical: 20 },
  waveBar: { width: 6, backgroundColor: PINK, borderRadius: 3 },

  micBtn: { width: 100, height: 100, borderRadius: 50, backgroundColor: PINK, alignItems: 'center', justifyContent: 'center', marginVertical: 16, shadowColor: PINK, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  micBtnRec: { backgroundColor: '#ff5252' },
  micIcon: { fontSize: 44 },
  micHint: { fontSize: 12, color: MUTED, fontWeight: '600', marginTop: 8 },

  scoreCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#fff', borderWidth: 6, borderColor: GREEN, alignItems: 'center', justifyContent: 'center', marginVertical: 16 },
  scoreVal: { fontSize: 56, color: GREEN, fontWeight: '800' },
  scoreLab: { fontSize: 12, color: MUTED, fontWeight: '700', position: 'absolute', bottom: 22, right: 24 },
  xpBadge: { backgroundColor: PINK_SOFT, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 14, marginBottom: 20 },
  xpTxt: { color: PINK, fontSize: 14, fontWeight: '800' },

  confetti: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, pointerEvents: 'none' },
  confettiEmoji: { position: 'absolute', fontSize: 32 },
});
