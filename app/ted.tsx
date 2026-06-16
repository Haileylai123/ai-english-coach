import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SCENARIOS, getRandomPrompt, Difficulty } from '../services/scenarios';
import { analyzeSpeech, AnalysisResult } from '../services/analyzer';
import { useStore } from '../services/store';
import { getRandomEmotion } from '../services/emotions';
import * as Speech from 'expo-speech';

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

const DIFF_COLOR: Record<Difficulty, string> = {
  beginner: '#7ec48b',
  intermediate: '#f0a96e',
  advanced: '#a888e0',
};

const DIFF_LABEL: Record<Difficulty, string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '高級',
};

const TED_TIPS = [
  '💡 開始用一個故事或問題',
  '💡 一個信息只講一次',
  '💡 用簡單嘅詞同短句子',
  '💡 加少少停頓，等觀眾吸收',
  '💡 結尾要有 memorable 嘅一句',
  '💡 Keep eye contact (鏡頭)',
  '💡 唔好趕住講完',
  '💡 真誠比完美重要',
];

export default function TedScreen() {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const ted = SCENARIOS.ted;
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    return () => { try { Speech.stop(); } catch {} };
  }, []);

  const prompts = ted.prompts[difficulty];

  const startPrompt = (idx: number) => {
    setActiveIdx(idx);
    setTranscript('');
    setAnalysis(null);
    setText('');
  };

  const listenPrompt = () => {
    if (activeIdx === null) return;
    const p = prompts[activeIdx];
    try { Speech.stop(); } catch {}
    setSpeaking(true);
    Speech.speak(p.en, {
      language: 'en',
      rate: 0.85,
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const analyze = () => {
    const input = text.trim();
    if (!input) return;
    setTranscript(input);
    const r = analyzeSpeech(input, input.split(' ').map(() => 0.7 + Math.random() * 0.25), ted.keyVocab);
    setAnalysis(r);
    dispatch({ type: 'ADD_ANALYSIS', payload: r });
    dispatch({ type: 'ADD_XP', payload: 10 + Math.floor(r.overall.score / 10) });
    Speech.speak(r.overall.detail, { language: 'en', rate: 0.85 });
  };

  const close = () => {
    try { Speech.stop(); } catch {}
    setActiveIdx(null);
    setAnalysis(null);
    setTranscript('');
    setText('');
  };

  // Active practice view
  if (activeIdx !== null) {
    const p = prompts[activeIdx];
    return (
      <View style={s.root}>
        <TouchableOpacity style={s.backBtn} onPress={close} activeOpacity={0.85}>
          <Text style={s.backTxt}>← 換題</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.tedHero}>
            <Text style={s.heroIcon}>🎤</Text>
            <Text style={s.heroLabel}>TED 演講 · {DIFF_LABEL[difficulty]}</Text>
          </View>

          {/* Prompt */}
          <View style={s.promptCard}>
            <Text style={s.promptLab}>📋 講題 Topic</Text>
            <Text style={[s.promptEn, FX]}>{p.en}</Text>
            <Text style={s.promptZh}>{p.zh}</Text>
            <View style={s.promptRow}>
              <TouchableOpacity style={s.listenBtn} onPress={listenPrompt} activeOpacity={0.85}>
                <Text style={s.listenBtnTxt}>{speaking ? '⏸ 播放中' : '🔊 聽題目'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tips */}
          <View style={s.tipsCard}>
            <Text style={s.tipsTitle}>💡 TED Tips</Text>
            {TED_TIPS.map((t, i) => (
              <Text key={i} style={s.tipTxt}>{t}</Text>
            ))}
          </View>

          {/* Practice */}
          {!analysis && (
            <View style={s.practiceCard}>
              <Text style={s.practLab}>🎤 你嘅演講 Your Talk</Text>
              <TextInput
                style={s.input}
                value={text}
                onChangeText={setText}
                placeholder="用英文寫出或貼上你嘅演講內容..."
                placeholderTextColor={MUTED}
                multiline
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[s.analyzeBtn, !text.trim() && s.analyzeBtnOff]}
                onPress={analyze}
                disabled={!text.trim()}
                activeOpacity={0.85}
              >
                <Text style={s.analyzeBtnTxt}>🔍 分析 Analyze</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Analysis result */}
          {analysis && (
            <View style={s.analysisCard}>
              <View style={s.analysisHead}>
                <View style={s.analysisScoreBox}>
                  <Text style={[s.analysisScore, FX]}>{analysis.overall.score}</Text>
                  <Text style={s.analysisScoreMax}>/100</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.analysisLevel}>{analysis.overall.level}</Text>
                  <Text style={s.analysisDetail}>{analysis.overall.detail}</Text>
                </View>
              </View>

              <View style={s.subRow}>
                <SubItem label="Fluency" score={analysis.fluency.score} />
                <SubItem label="Vocab" score={analysis.vocabulary.score} />
                <SubItem label="Pronun" score={analysis.pronunciation.score} />
                <SubItem label="Grammar" score={analysis.grammar.score} />
              </View>

              {analysis.vocabulary.usedKeyVocab && analysis.vocabulary.usedKeyVocab.length > 0 && (
                <View style={s.usedBox}>
                  <Text style={s.usedLab}>✓ TED 詞彙用到：</Text>
                  <View style={s.usedChips}>
                    {analysis.vocabulary.usedKeyVocab.map((w, i) => (
                      <View key={i} style={s.usedChip}>
                        <Text style={s.usedChipTxt}>{w}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <TouchableOpacity style={s.againBtn} onPress={() => { setAnalysis(null); setText(''); setTranscript(''); }} activeOpacity={0.85}>
                <Text style={s.againBtnTxt}>🔄 再講一次</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 80 }} />
        </ScrollView>
      </View>
    );
  }

  // List view
  return (
    <View style={s.root}>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
        <Text style={s.backTxt}>← 返回</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.heroHead}>
          <Text style={s.heroEmoji}>🎤</Text>
          <Text style={[s.title, FX]}>TED 演講</Text>
          <Text style={s.subtitle}>Practice TED-style Talks</Text>
        </View>

        <Text style={s.desc}>揀一個講題，發表你嘅意見。改善你嘅演講能力同自信。</Text>

        {/* Difficulty chips */}
        <View style={s.chipsRow}>
          {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(d => (
            <TouchableOpacity
              key={d}
              style={[s.chip, difficulty === d && s.chipOn, difficulty === d && { backgroundColor: DIFF_COLOR[d] }]}
              onPress={() => setDifficulty(d)}
              activeOpacity={0.85}
            >
              <Text style={[s.chipTxt, difficulty === d && s.chipTxtOn, FB]}>{DIFF_LABEL[d]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TED tips */}
        <View style={s.tipsCard}>
          <Text style={s.tipsTitle}>💡 TED Tips</Text>
          {TED_TIPS.map((t, i) => (
            <Text key={i} style={s.tipTxt}>{t}</Text>
          ))}
        </View>

        {/* Prompts list */}
        <Text style={s.section}>講題 Topics</Text>
        {prompts.map((p, i) => (
          <TouchableOpacity
            key={i}
            style={s.pCard}
            onPress={() => startPrompt(i)}
            activeOpacity={0.85}
          >
            <View style={s.pNum}>
              <Text style={s.pNumTxt}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.pEn} numberOfLines={2}>{p.en}</Text>
              <Text style={s.pZh} numberOfLines={1}>{p.zh}</Text>
            </View>
            <Text style={s.pArrow}>→</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

function SubItem({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? '#7ec48b' : score >= 60 ? PINK : '#e88c5a';
  return (
    <View style={s.subItem}>
      <Text style={[s.subNum, FB, { color }]}>{score}</Text>
      <Text style={s.subLab}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: {
    position: 'absolute',
    top: 18, left: 16,
    zIndex: 10,
    padding: 8,
  },
  backTxt: { fontSize: 15, color: PINK, fontWeight: '700' },

  heroHead: { alignItems: 'center', marginBottom: 10 },
  heroEmoji: { fontSize: 50, marginBottom: 8 },
  title: { fontSize: 30, color: PINK, textAlign: 'center', letterSpacing: 0.3 },
  subtitle: { fontSize: 13, color: MUTED, textAlign: 'center', fontWeight: '600' },
  desc: { fontSize: 13, color: SUBINK, textAlign: 'center', marginVertical: 14, lineHeight: 19, fontWeight: '500' },

  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 14, justifyContent: 'center' },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#f5e8de',
  },
  chipOn: { borderColor: 'transparent' },
  chipTxt: { fontSize: 12, color: SUBINK },
  chipTxtOn: { color: '#fff' },

  tipsCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 16,
  },
  tipsTitle: { fontSize: 13, color: PINK, fontWeight: '800', marginBottom: 8 },
  tipTxt: { fontSize: 12, color: INK, lineHeight: 20, fontWeight: '500' },

  section: { fontSize: 16, color: PINK, marginBottom: 10, marginTop: 4, fontWeight: '800' },

  pCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 8, gap: 12,
  },
  pNum: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: PINK_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  pNumTxt: { fontSize: 14, color: PINK, fontWeight: '800' },
  pEn: { fontSize: 14, color: INK, fontWeight: '700', marginBottom: 4, lineHeight: 20 },
  pZh: { fontSize: 12, color: SUBINK, fontWeight: '500' },
  pArrow: { fontSize: 16, color: PINK, fontWeight: '700' },

  // Active view
  tedHero: { alignItems: 'center', marginBottom: 12 },
  heroIcon: { fontSize: 50, marginBottom: 6 },
  heroLabel: { fontSize: 12, color: MUTED, fontWeight: '700' },

  promptCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14,
    borderWidth: 2, borderColor: PINK,
  },
  promptLab: { fontSize: 11, color: PINK, fontWeight: '800', marginBottom: 6 },
  promptEn: { fontSize: 20, color: INK, lineHeight: 28, marginBottom: 8 },
  promptZh: { fontSize: 13, color: SUBINK, lineHeight: 20, fontWeight: '500', marginBottom: 12 },
  promptRow: { flexDirection: 'row' },
  listenBtn: {
    backgroundColor: PINK_SOFT, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10,
  },
  listenBtnTxt: { color: PINK, fontSize: 12, fontWeight: '800' },

  practiceCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14 },
  practLab: { fontSize: 14, color: PINK, fontWeight: '800', marginBottom: 10 },
  input: {
    backgroundColor: CREAM, borderRadius: 12, padding: 12, fontSize: 14,
    color: INK, minHeight: 120, borderWidth: 1, borderColor: '#f0e0d0',
    textAlignVertical: 'top',
  },
  analyzeBtn: {
    backgroundColor: PINK, paddingVertical: 12, borderRadius: 14, alignItems: 'center', marginTop: 10,
  },
  analyzeBtnOff: { backgroundColor: MUTED, opacity: 0.5 },
  analyzeBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '800' },

  analysisCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14,
    borderWidth: 2, borderColor: PINK,
  },
  analysisHead: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  analysisScoreBox: {
    width: 70, height: 70, borderRadius: 18, backgroundColor: PINK_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  analysisScore: { fontSize: 26, color: PINK },
  analysisScoreMax: { fontSize: 9, color: PINK, fontWeight: '800' },
  analysisLevel: { fontSize: 16, color: INK, fontWeight: '800', marginBottom: 4 },
  analysisDetail: { fontSize: 12, color: SUBINK, lineHeight: 18 },

  subRow: {
    flexDirection: 'row', backgroundColor: CREAM, borderRadius: 10, padding: 10, marginBottom: 12,
  },
  subItem: { flex: 1, alignItems: 'center' },
  subNum: { fontSize: 16, marginBottom: 2 },
  subLab: { fontSize: 9, color: MUTED, fontWeight: '700' },

  usedBox: { marginBottom: 10 },
  usedLab: { fontSize: 11, color: PINK, fontWeight: '800', marginBottom: 6 },
  usedChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  usedChip: { backgroundColor: PINK_SOFT, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  usedChipTxt: { fontSize: 10, color: PINK, fontWeight: '700' },

  againBtn: { backgroundColor: PINK, paddingVertical: 12, borderRadius: 14, alignItems: 'center', marginTop: 4 },
  againBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
