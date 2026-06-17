import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { analyzeMeeting, CallAnalysis, hasAI, hasSTT, analyzeCallTranscript, transcribeAudio } from '../services/api';
import { useStore } from '../services/store';

const { width: W } = Dimensions.get('window');
const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#ffffff';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';
const GREEN = '#7ec48b';
const RED = '#e57373';

export default function CallAnalyzerScreen() {
  const router = useRouter();
  const { dispatch } = useStore();
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CallAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const recRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulse = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (recording) {
      Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])).start();
    } else {
      pulse.setValue(1);
    }
  }, [recording]);

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const startRecording = async () => {
    setError(null); setResult(null);
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      recRef.current = rec;
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } catch (e: any) {
      setError(`Mic error: ${e.message?.slice(0, 60)}`);
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
    if (!recRef.current) return;

    try {
      await recRef.current.stopAndUnloadAsync();
      const uri = recRef.current.getURI();
      recRef.current = null;

      if (uri && hasSTT()) {
        setLoading(true);
        const r = await analyzeMeeting(uri);
        setResult(r);
        dispatch({ type: 'ADD_XP', payload: 20 + Math.floor(r.overall.score / 10) });
      } else if (textInput.trim()) {
        // fallback via manual text
        setLoading(true);
        const r = await analyzeCallTranscript(textInput.trim(), Math.max(30, elapsed));
        setResult(r);
        dispatch({ type: 'ADD_XP', payload: 20 });
      } else {
        setShowTextInput(true);
      }
    } catch (e: any) {
      setError(e.message?.slice(0, 80));
      setShowTextInput(true);
    } finally {
      setLoading(false);
    }
  };

  const analyzeText = async () => {
    if (!textInput.trim()) return;
    setLoading(true); setError(null);
    try {
      const r = await analyzeCallTranscript(textInput.trim(), Math.max(30, elapsed || 60));
      setResult(r);
      setShowTextInput(false);
      dispatch({ type: 'ADD_XP', payload: 20 + Math.floor(r.overall.score / 10) });
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    } catch (e: any) { setError(e.message?.slice(0, 80)); }
    finally { setLoading(false); }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <View style={s.root}>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
        <Text style={s.backTxt}>← 返回</Text>
      </TouchableOpacity>

      <ScrollView ref={scrollRef} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={[s.title, FX]}>Call Analyzer</Text>
        <Text style={s.subtitle}>錄低你嘅 meeting / call，AI 幫你分析英文表現</Text>

        {/* Recording area */}
        {!result && !loading && (
          <View style={s.recArea}>
            {!recording ? (
              <>
                <TouchableOpacity style={s.recBtn} onPress={startRecording} activeOpacity={0.85}>
                  <Animated.View style={[s.recInner, { transform: [{ scale: pulse }] }]}>
                    <Text style={s.recIcon}>🎙️</Text>
                  </Animated.View>
                </TouchableOpacity>
                <Text style={s.recHint}>撳掣開始錄音 · 放喺電腦喇叭旁邊錄 meeting</Text>
                <TouchableOpacity style={s.textFallback} onPress={() => { setShowTextInput(true); setElapsed(60); }}>
                  <Text style={s.textFallbackTxt}>✍️ 或者直接貼上 transcript</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={[s.recBtn, s.recBtnOn]} onPress={stopRecording} activeOpacity={0.85}>
                  <Animated.View style={[s.recInner, s.recInnerOn, { transform: [{ scale: pulse }] }]}>
                    <Text style={s.recIcon}>⏹️</Text>
                  </Animated.View>
                </TouchableOpacity>
                <Text style={[s.timer, FX]}>{formatTime(elapsed)}</Text>
                <Text style={s.recHint}>錄音中... 撳停嚟分析</Text>
              </>
            )}
          </View>
        )}

        {/* Text input fallback */}
        {showTextInput && !result && !loading && (
          <View style={s.textCard}>
            <Text style={s.textCardTitle}>📝 貼上你嘅 meeting transcript</Text>
            <Text style={s.textCardHint}>錄音唔成功？直接貼上你講過嘅英文內容</Text>
            <TextInput
              style={[s.textInput, { minHeight: 100 }]}
              value={textInput}
              onChangeText={setTextInput}
              placeholder="貼上你講過嘅英文 transcript..."
              placeholderTextColor={MUTED}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity style={[s.analyzeBtn, !textInput.trim() && s.analyzeOff]} onPress={analyzeText} disabled={!textInput.trim()}>
              <Text style={s.analyzeBtnTxt}>🔍 分析 Analyze</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View style={s.loadCard}>
            <ActivityIndicator size="large" color={PINK} />
            <Text style={s.loadTxt}>AI 分析緊你嘅 meeting...</Text>
            <Text style={s.loadSub}>Transcribing + Analyzing</Text>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={s.errCard}>
            <Text style={s.errTxt}>{error}</Text>
            <TouchableOpacity onPress={() => { setError(null); setShowTextInput(true); }}>
              <Text style={s.errLink}>改用文字輸入 →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Overall score card */}
            <View style={s.scoreCard}>
              <Text style={s.scoreLabel}>Overall</Text>
              <Text style={[s.scoreBig, FX, { color: result.overall.score >= 80 ? GREEN : result.overall.score >= 60 ? '#f0a96e' : RED }]}>
                {result.overall.score}
              </Text>
              <Text style={s.scoreLevel}>CEFR {result.overall.level}</Text>
              <Text style={s.scoreSummary}>{result.overall.summary}</Text>
            </View>

            {/* Quick stats */}
            <View style={s.statsGrid}>
              <StatBox label="Words" value={result.stats.totalWords} />
              <StatBox label="Unique" value={result.stats.uniqueWords} />
              <StatBox label="WPM" value={result.stats.wpm} />
              <StatBox label="Fillers" value={result.stats.fillerCount} color={result.stats.fillerCount > 5 ? RED : INK} />
            </View>

            {/* Fluency + Vocab + Grammar bars */}
            {(['fluency', 'vocabulary', 'grammar'] as const).map(cat => {
              const d = result[cat];
              return (
                <View key={cat} style={s.barCard}>
                  <View style={s.barHead}>
                    <Text style={[s.barLabel, FB]}>{cat === 'fluency' ? '💨 Fluency' : cat === 'vocabulary' ? '📚 Vocabulary' : '📐 Grammar'}</Text>
                    <Text style={[s.barScore, FB]}>{d.score}/100</Text>
                  </View>
                  <View style={s.barBg}><View style={[s.barFill, { width: `${d.score}%`, backgroundColor: d.score >= 80 ? GREEN : d.score >= 60 ? '#f0a96e' : RED }]} /></View>
                  <Text style={s.barDetail}>{d.detail}</Text>
                </View>
              );
            })}

            {/* Filler words */}
            {result.stats.fillerWords.length > 0 && (
              <View style={s.fillerCard}>
                <Text style={[s.secTitle, FB]}>🗣️ Filler words 填充詞</Text>
                <View style={s.chipRow}>
                  {result.stats.fillerWords.map((w, i) => (
                    <View key={i} style={s.fillerChip}><Text style={s.fillerChipTxt}>{w}</Text></View>
                  ))}
                </View>
                <Text style={s.fillerTip}>💡 減少 filler words 令你聽落更自信。試下用 pause 代替 "um"。</Text>
              </View>
            )}

            {/* Grammar corrections */}
            {result.grammar.corrections.length > 0 && (
              <View style={s.correctCard}>
                <Text style={[s.secTitle, FB]}>✏️ Grammar suggestions</Text>
                {result.grammar.corrections.map((c, i) => (
                  <View key={i} style={s.correctItem}>
                    <Text style={s.correctOrig}>「{c.original}」</Text>
                    <Text style={s.correctArrow}>→</Text>
                    <Text style={s.correctNew}>{c.correction}</Text>
                    <Text style={s.correctExplain}>{c.explain}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Strengths */}
            <View style={s.strengthCard}>
              <Text style={[s.secTitle, FB]}>✅ Strengths 做得好</Text>
              {result.strengths.map((sx, i) => (
                <Text key={i} style={s.strengthItem}>• {sx}</Text>
              ))}
            </View>

            {/* Suggestions */}
            <View style={s.suggestCard}>
              <Text style={[s.secTitle, FB]}>🎯 下次改進</Text>
              {result.suggestions.map((sg, i) => (
                <Text key={i} style={s.suggestItem}>• {sg}</Text>
              ))}
            </View>

            {/* Transcript preview */}
            <View style={s.transCard}>
              <Text style={[s.secTitle, FB]}>📜 Transcript</Text>
              <Text style={s.transText}>{result.transcript.slice(0, 500)}{result.transcript.length > 500 ? '...' : ''}</Text>
            </View>

            {/* Actions */}
            <TouchableOpacity style={s.newBtn} onPress={() => { setResult(null); setTextInput(''); setShowTextInput(false); setElapsed(0); }}>
              <Text style={s.newBtnTxt}>🔄 分析另一個 meeting</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <View style={stb.box}>
      <Text style={[stb.val, FX, color ? { color } : {}]}>{value}</Text>
      <Text style={stb.lab}>{label}</Text>
    </View>
  );
}

const stb = StyleSheet.create({
  box: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 12, alignItems: 'center' },
  val: { fontSize: 22, color: INK },
  lab: { fontSize: 10, color: MUTED, marginTop: 2, fontWeight: '600' },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { position: 'absolute', top: 60, left: 16, zIndex: 10, padding: 8 },
  backTxt: { fontSize: 15, color: PINK, fontWeight: '700' },
  title: { fontSize: 28, color: PINK, textAlign: 'center', marginTop: 20 },
  subtitle: { fontSize: 13, color: SUBINK, textAlign: 'center', marginBottom: 24, fontWeight: '500' },

  // Recording
  recArea: { alignItems: 'center', paddingVertical: 30 },
  recBtn: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: PINK,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: PINK, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
  recBtnOn: { backgroundColor: RED },
  recInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  recInnerOn: { backgroundColor: '#fff' },
  recIcon: { fontSize: 32 },
  timer: { fontSize: 48, color: RED, marginTop: 16 },
  recHint: { fontSize: 13, color: MUTED, marginTop: 12, textAlign: 'center', fontWeight: '500' },
  textFallback: { marginTop: 20, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#fff' },
  textFallbackTxt: { fontSize: 13, color: PINK, fontWeight: '700' },

  // Text input
  textCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 16 },
  textCardTitle: { fontSize: 15, color: INK, fontWeight: '800', marginBottom: 4 },
  textCardHint: { fontSize: 11, color: MUTED, marginBottom: 10 },
  textInputWrap: { backgroundColor: CREAM, borderRadius: 12, padding: 14, minHeight: 100, borderWidth: 1, borderColor: '#f0e0d0' },
  textInput: { fontSize: 14, color: INK, lineHeight: 22 },
  analyzeBtn: { backgroundColor: PINK, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  analyzeOff: { opacity: 0.4 },
  analyzeBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // Loading / Error
  loadCard: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#fff', borderRadius: 18 },
  loadTxt: { fontSize: 15, color: INK, fontWeight: '700', marginTop: 12 },
  loadSub: { fontSize: 12, color: MUTED, marginTop: 4 },
  errCard: { backgroundColor: '#fff0f0', borderRadius: 14, padding: 14, marginBottom: 14, alignItems: 'center' },
  errTxt: { fontSize: 13, color: RED, textAlign: 'center' },
  errLink: { fontSize: 13, color: PINK, fontWeight: '700', marginTop: 8 },

  // Score card
  scoreCard: { backgroundColor: '#fff', borderRadius: 22, padding: 24, alignItems: 'center', marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  scoreLabel: { fontSize: 12, color: MUTED, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' },
  scoreBig: { fontSize: 64 },
  scoreLevel: { fontSize: 14, color: PINK, fontWeight: '800', backgroundColor: PINK_SOFT, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 4, overflow: 'hidden' },
  scoreSummary: { fontSize: 13, color: SUBINK, marginTop: 10, textAlign: 'center', lineHeight: 19, fontWeight: '500' },

  // Stats grid
  statsGrid: { flexDirection: 'row', gap: 8, marginBottom: 14 },

  // Bars
  barCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 8 },
  barHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { fontSize: 13, color: INK },
  barScore: { fontSize: 14, color: PINK },
  barBg: { height: 8, backgroundColor: PINK_SOFT, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barDetail: { fontSize: 11, color: SUBINK, marginTop: 6, lineHeight: 16, fontWeight: '500' },

  // Filler words
  fillerCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 8 },
  secTitle: { fontSize: 14, color: INK, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  fillerChip: { backgroundColor: '#fff0f0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  fillerChipTxt: { fontSize: 12, color: RED, fontWeight: '600' },
  fillerTip: { fontSize: 11, color: SUBINK, fontStyle: 'italic', fontWeight: '500' },

  // Grammar corrections
  correctCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 8 },
  correctItem: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#faf0eb' },
  correctOrig: { fontSize: 12, color: RED, fontWeight: '600' },
  correctArrow: { fontSize: 14, color: MUTED, marginVertical: 2 },
  correctNew: { fontSize: 13, color: GREEN, fontWeight: '700' },
  correctExplain: { fontSize: 10, color: SUBINK, marginTop: 2 },

  // Strengths
  strengthCard: { backgroundColor: '#e8f5e9', borderRadius: 16, padding: 14, marginBottom: 8 },
  strengthItem: { fontSize: 12, color: '#2e7d32', lineHeight: 20, fontWeight: '500' },

  // Suggestions
  suggestCard: { backgroundColor: '#fff8e1', borderRadius: 16, padding: 14, marginBottom: 8 },
  suggestItem: { fontSize: 12, color: '#e65100', lineHeight: 20, fontWeight: '500' },

  // Transcript
  transCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 8 },
  transText: { fontSize: 12, color: SUBINK, lineHeight: 18, fontStyle: 'italic' },

  // New analysis
  newBtn: { backgroundColor: PINK, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  newBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
