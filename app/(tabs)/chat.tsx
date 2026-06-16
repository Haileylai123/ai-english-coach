import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Pressable, Animated, TextInput, Dimensions, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../services/store';
import { SCENARIOS, SceneId, Difficulty, getRandomPrompt, getDifficultyLabel } from '../../services/scenarios';
import { analyzeSpeech, AnalysisResult } from '../../services/analyzer';
import { getRandomEmotion } from '../../services/emotions';
import WordPickerModal from '../../components/WordPickerModal';
import * as Speech from 'expo-speech';

const STAT_FLASH_ICON = require('../../assets/icons/stat-fluency.png');

const { width: W } = Dimensions.get('window');
const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };

// Pink / coral palette
const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';

const SCENES: { id: SceneId; icon: string; name: string; nameEn: string }[] = [
  { id: 'business', icon: '💼', name: '商務 Business', nameEn: 'Business English' },
  { id: 'ielts', icon: '📝', name: '雅思 IELTS', nameEn: 'IELTS' },
  { id: 'daily', icon: '☕', name: '日常 Daily', nameEn: 'Daily English' },
  { id: 'restaurant', icon: '🍽️', name: '餐廳 Restaurant', nameEn: 'Restaurant' },
  { id: 'interview', icon: '🤵', name: '面試 Interview', nameEn: 'Interview' },
  { id: 'dating', icon: '💕', name: '約會 Dating', nameEn: 'Dating' },
  { id: 'doctor', icon: '🩺', name: '醫生 Doctor', nameEn: 'Doctor' },
  { id: 'ted', icon: '🎤', name: 'TED 演講', nameEn: 'TED Talk' },
];

const DIFFS: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const DIFF_L: Record<Difficulty, string> = { beginner: '初級', intermediate: '中級', advanced: '高級' };

export default function ChatScreen() {
  const { state, dispatch } = useStore();
  const router = useRouter();
  const [picker, setPicker] = useState(false);
  const [prompt, setPrompt] = useState(() => getRandomPrompt(state.scene, state.difficulty));
  const [text, setText] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [emotion, setEmotion] = useState<{ zh: string; en: string } | null>(null);
  const [msg, setMsg] = useState('');
  const [transcript, setTranscript] = useState('');
  const [wordContext, setWordContext] = useState<string | null>(null);
  const pulse = useRef(new Animated.Value(1)).current;
  const scroll = useRef<ScrollView>(null);
  const initialMount = useRef(true);
  const scene = SCENARIOS[state.scene];

  // Only auto-scroll to end AFTER user interacts (sends a message / starts speaking)
  // — not on initial mount, otherwise the top conversation bubbles are scrolled off screen.
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    if (speaking || showInput || analysis || transcript) {
      setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [speaking, showInput, analysis, transcript]);

  useEffect(() => {
    if (speaking) {
      const a = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.12, duration: 400, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      );
      a.start();
      return () => a.stop();
    }
    pulse.setValue(1);
  }, [speaking]);

  const pick = (s: SceneId) => { dispatch({ type: 'SET_SCENE', payload: s }); setPicker(false); reset(); };
  const diff = (d: Difficulty) => { dispatch({ type: 'SET_DIFFICULTY', payload: d }); reset(); };
  const reset = () => {
    setText(''); setAnalysis(null); setEmotion(null); setMsg(''); setShowInput(false); setTranscript('');
    setPrompt(getRandomPrompt(state.scene, state.difficulty));
  };

  const analyze = () => {
    const input = text.trim() || transcript.trim();
    if (!input) return;
    setTranscript(input);
    const r = analyzeSpeech(input, input.split(' ').map(() => 0.7 + Math.random() * 0.25), scene.keyVocab);
    setAnalysis(r); setShowInput(false);
    dispatch({ type: 'ADD_ANALYSIS', payload: r });
    dispatch({ type: 'ADD_XP', payload: 10 + Math.floor(r.overall.score / 10) });
    setEmotion(getRandomEmotion('complete'));
    const e = r.overall.score >= 80 ? '🌟' : r.overall.score >= 60 ? '👍' : '💪';
    setMsg(`${e} ${r.overall.score}/100 · ${r.overall.level}`);
    Speech.speak(r.overall.detail, { language: 'en', rate: 0.85 });
  };

  const start = useCallback(() => {
    setSpeaking(true); setText(''); setAnalysis(null); setShowInput(false);
    setEmotion(getRandomEmotion('start'));
    setMsg('🎤 大聲說出來！Speak out loud!');
  }, []);

  const stop = useCallback(() => {
    setSpeaking(false); setShowInput(true);
    setMsg('📝 把你剛說的打出嚟');
    setEmotion(getRandomEmotion('during'));
  }, []);

  return (
    <KeyboardAvoidingView style={st.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={st.head}>
        <Text style={[st.title, FX]}>English Coach</Text>
      </View>

      {/* Scene pill */}
      <View style={st.sceneWrap}>
        <TouchableOpacity style={st.scenePill} onPress={() => setPicker(!picker)} activeOpacity={0.85}>
          <Text style={[st.sceneT, FB]}>{scene.nameEn}</Text>
          <Text style={st.arr}>{picker ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {picker && (
          <View style={st.drop}>
            {SCENES.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[st.dItem, state.scene === s.id && st.dItemOn]}
                onPress={() => pick(s.id)}
              >
                <Text style={[st.dText, FB, state.scene === s.id && st.dTextOn]}>{s.icon}  {s.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView
        ref={scroll}
        style={st.body}
        contentContainerStyle={st.bodyC}
      >
        {/* AI greeting */}
        <View style={st.row}>
          <View style={st.avCo}><Text style={st.avEmoji}>🤖</Text></View>
          <View style={st.bubbleAI}>
            <Pressable onLongPress={() => setWordContext("Hello! I'm your AI English tutor. Let's practice " + scene.nameEn.toLowerCase() + ' together. How can I help you today?')} delayLongPress={400}>
              <Text style={[st.bubbleT, FB]}>
                Hello! I'm your AI English tutor.{"\n"}Let's practice {scene.nameEn.toLowerCase()} together. How can I help you today?
              </Text>
            </Pressable>
          </View>
        </View>

        {/* User response (example from design) */}
        <View style={[st.row, st.rowRight]}>
          <View style={st.bubbleUser}>
            <Pressable onLongPress={() => setWordContext('I have a meeting with a client this afternoon.')} delayLongPress={400}>
              <Text style={[st.bubbleT, FB, st.bubbleTUser]}>
                I have a meeting with a client this afternoon.
              </Text>
            </Pressable>
          </View>
          <View style={st.avCoUser}><Text style={st.avEmoji}>😊</Text></View>
        </View>

        {/* AI follow-up */}
        <View style={st.row}>
          <View style={st.avCo}><Text style={st.avEmoji}>🤖</Text></View>
          <View style={st.bubbleAI}>
            <Pressable onLongPress={() => setWordContext('Great! What would you like to focus on in your meeting?')} delayLongPress={400}>
              <Text style={[st.bubbleT, FB]}>
                Great! What would you like to focus on in your meeting?
              </Text>
            </Pressable>
          </View>
        </View>

        {/* User response 2 */}
        <View style={[st.row, st.rowRight]}>
          <View style={st.bubbleUser}>
            <Pressable onLongPress={() => setWordContext('I want to practice greeting and introducing our service.')} delayLongPress={400}>
              <Text style={[st.bubbleT, FB, st.bubbleTUser]}>
                I want to practice greeting and introducing our service.
              </Text>
            </Pressable>
          </View>
          <View style={st.avCoUser}><Text style={st.avEmoji}>😊</Text></View>
        </View>

        {/* AI response 3 */}
        <View style={st.row}>
          <View style={st.avCo}><Text style={st.avEmoji}>🤖</Text></View>
          <View style={st.bubbleAI}>
            <Pressable onLongPress={() => setWordContext("Excellent choice. Let's start with a natural greeting!")} delayLongPress={400}>
              <Text style={[st.bubbleT, FB]}>
                Excellent choice. Let's start with a natural greeting!
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Practice prompt */}
        <View style={st.row}>
          <View style={st.avCo}><Text style={st.avEmoji}>🤖</Text></View>
          <View style={st.bubbleAI}>
            <Text style={[st.bubbleLabel, FB]}>📋 練習題 Practice</Text>
            <Pressable onLongPress={() => setWordContext(prompt.en)} delayLongPress={400}>
              <Text style={[st.promptEn, FX]}>{prompt.en}</Text>
            </Pressable>
            <Text style={[st.promptZh, F]}>{prompt.zh}</Text>
            <TouchableOpacity style={st.refreshBtn} onPress={reset}>
              <Text style={[st.refreshT, FB]}>🔄 換題</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Useful phrases */}
        <View style={st.row}>
          <View style={st.avCo}><Text style={st.avEmoji}>🤖</Text></View>
          <View style={st.bubbleAI}>
            <Text style={[st.bubbleLabel, FB]}>📖 實用句型</Text>
            {scene.usefulPhrases.slice(0, 3).map((p, i) => (
              <TouchableOpacity
                key={i}
                style={st.phRow}
                onPress={() => { setText(prev => prev + (prev ? ' ' : '') + p.en); if (!showInput) setShowInput(true); }}
                onLongPress={() => setWordContext(p.en)}
                delayLongPress={400}
              >
                <Text style={[st.phEn, FB]}>{p.en}</Text>
                <Text style={[st.phZh, F]}>{p.zh}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status message */}
        {msg ? (
          <View style={st.statusCard}>
            <Text style={[st.statusT, FB]}>{msg}</Text>
          </View>
        ) : null}

        {/* Speaking indicator */}
        {speaking && (
          <View style={st.speakCard}>
            <Animated.View style={{ transform: [{ scale: pulse }] }}>
              <Text style={st.micBig}>🎤</Text>
            </Animated.View>
            <Text style={[st.speakT, FB]}>Listening...</Text>
            <Text style={[st.speakSub, F]}>放開按鈕後輸入你講嘅內容</Text>
          </View>
        )}

        {/* Input area */}
        {showInput && !speaking && (
          <View style={st.inputCard}>
            <Text style={[st.bubbleLabel, FB]}>📝 輸入你講嘅內容</Text>
            <TextInput
              style={[st.input, F]}
              value={text}
              onChangeText={setText}
              placeholder="Type what you just said..."
              placeholderTextColor={MUTED}
              multiline
              autoFocus
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[st.analyzeBtn, !text.trim() && st.analyzeOff]}
              onPress={analyze}
              disabled={!text.trim()}
            >
              <Text style={[st.analyzeT, FB]}>🔍 分析 Analyze</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* User transcript card */}
        {transcript && !showInput ? (
          <View style={[st.row, st.rowRight]}>
            <View style={st.bubbleUser}>
              <Pressable onLongPress={() => setWordContext(transcript)} delayLongPress={400}>
                <Text style={[st.bubbleT, FB, st.bubbleTUser]}>{transcript}</Text>
              </Pressable>
            </View>
            <View style={st.avCoUser}><Text style={st.avEmoji}>😊</Text></View>
          </View>
        ) : null}

        {/* Analysis */}
        {analysis && (
          <View style={st.row}>
            <View style={st.avCo}><Text style={st.avEmoji}>🤖</Text></View>
            <View style={st.bubbleAI}>
              <Text style={[st.bubbleLabel, FB]}>📊 分析結果</Text>
              <View style={st.overallRow}>
                <Text style={[st.bigScore, FX]}>{analysis.overall.score}</Text>
                <View>
                  <Text style={[st.lvlBadge, FB]}>CEFR {analysis.overall.level}</Text>
                  <Text style={[st.sub, F]}>總分 Overall</Text>
                </View>
              </View>
              {(['fluency', 'vocabulary', 'pronunciation', 'grammar'] as const).map(c => {
                const d = analysis[c];
                const ico = { fluency: '💨', vocabulary: '📚', pronunciation: '🔊', grammar: '📐' };
                return (
                  <View key={c} style={st.met}>
                    <Text style={st.metI}>{ico[c]}</Text>
                    <View style={st.metB}>
                      <View style={[st.metF, { width: `${d.score}%` }]} />
                    </View>
                    <Text style={[st.metV, FB]}>{d.score}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Emotion */}
        {emotion && (
          <View style={st.emoRow}>
            <Text style={st.emoI}>💖</Text>
            <View style={{ flex: 1 }}>
              <Text style={[st.emoEn, FB]}>{emotion.en}</Text>
              <Text style={[st.emoZh, F]}>{emotion.zh}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Bottom mic */}
      {!showInput && (
        <View style={st.bottom}>
          <View style={st.diffRow}>
            {DIFFS.map(d => (
              <TouchableOpacity
                key={d}
                style={[st.dBtn, state.difficulty === d && st.dBtnOn]}
                onPress={() => diff(d)}
              >
                <Text style={[st.dT, FB, state.difficulty === d && st.dTOn]}>{DIFF_L[d]}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Pressable
            style={[st.recOut, speaking && st.recOutOn]}
            onPressIn={start}
            onPressOut={stop}
          >
            <Animated.View style={[st.recIn, { transform: [{ scale: pulse }] }]}>
              <Text style={st.recIcon}>{speaking ? '🔴' : '🎤'}</Text>
            </Animated.View>
          </Pressable>
          <Text style={[st.recHint, F]}>按住說話 · Hold to speak</Text>
        </View>
      )}

      <WordPickerModal
        visible={wordContext !== null}
        context={wordContext || undefined}
        onClose={() => setWordContext(null)}
      />
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  head: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 8 },
  title: { fontSize: 32, color: PINK, letterSpacing: 0.5 },
  sceneWrap: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8, zIndex: 10 },
  scenePill: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sceneT: { fontSize: 14, color: INK },
  arr: { fontSize: 10, color: MUTED },
  drop: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 8,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  dItem: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  dItemOn: { backgroundColor: PINK_SOFT },
  dText: { fontSize: 14, color: INK },
  dTextOn: { color: PINK },

  body: { flex: 1 },
  bodyC: { padding: 20, gap: 14 },

  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  rowRight: { justifyContent: 'flex-end' },
  avCo: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: PINK_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  avCoUser: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: PINK_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  avEmoji: { fontSize: 20 },

  bubbleAI: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 22,
    borderBottomLeftRadius: 6,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: PINK,
    borderRadius: 22,
    borderBottomRightRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 18,
    maxWidth: '78%',
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bubbleT: { fontSize: 14, color: INK, lineHeight: 22 },
  bubbleTUser: { color: '#fff' },
  bubbleLabel: { fontSize: 11, color: PINK, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },

  promptEn: { fontSize: 16, color: INK, lineHeight: 24, marginBottom: 4 },
  promptZh: { fontSize: 12, color: SUBINK, lineHeight: 18 },
  refreshBtn: { alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: PINK_SOFT, borderRadius: 8 },
  refreshT: { fontSize: 11, color: PINK },

  phRow: { paddingVertical: 8, borderTopWidth: 1, borderColor: '#faf0eb' },
  phEn: { fontSize: 14, color: INK },
  phZh: { fontSize: 11, color: MUTED, marginTop: 2 },

  statusCard: {
    backgroundColor: PINK_SOFT,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginLeft: 50,
  },
  statusT: { fontSize: 14, color: PINK },

  speakCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PINK,
    marginLeft: 50,
  },
  micBig: { fontSize: 56 },
  speakT: { fontSize: 18, color: PINK, marginTop: 8 },
  speakSub: { fontSize: 12, color: MUTED, marginTop: 4 },

  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginLeft: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    backgroundColor: CREAM,
    borderRadius: 14,
    padding: 14,
    minHeight: 80,
    fontSize: 15,
    color: INK,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: '#f5e8de',
  },
  analyzeBtn: {
    backgroundColor: PINK,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  analyzeOff: { opacity: 0.4 },
  analyzeT: { color: '#fff', fontSize: 15 },

  overallRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#faf0eb' },
  bigScore: { fontSize: 48, color: PINK },
  lvlBadge: { fontSize: 13, color: '#4caf50', backgroundColor: '#e8f5e9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  sub: { fontSize: 11, color: MUTED, marginTop: 4 },
  met: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  metI: { fontSize: 16, width: 24 },
  metB: { flex: 1, height: 8, backgroundColor: PINK_SOFT, borderRadius: 4, overflow: 'hidden' },
  metF: { height: '100%', backgroundColor: PINK, borderRadius: 4 },
  metV: { fontSize: 14, color: INK, width: 32, textAlign: 'right' },

  emoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff0f0',
    borderRadius: 18,
    padding: 14,
    marginLeft: 50,
  },
  emoI: { fontSize: 26 },
  emoEn: { fontSize: 13, color: '#d4446a' },
  emoZh: { fontSize: 11, color: '#c07a8a', marginTop: 2 },

  bottom: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 30,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#f0e0d0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 12,
  },
  diffRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  dBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, backgroundColor: CREAM, borderWidth: 1, borderColor: '#f5e8de' },
  dBtnOn: { backgroundColor: PINK, borderColor: PINK },
  dT: { fontSize: 12, color: SUBINK },
  dTOn: { color: '#fff' },

  recOut: {
    width: 78, height: 78, borderRadius: 39,
    backgroundColor: PINK,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  recOutOn: { backgroundColor: '#ff5e5e' },
  recIn: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  recIcon: { fontSize: 28 },
  recHint: { fontSize: 12, color: MUTED, marginTop: 8 },
});
