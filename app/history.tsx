import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../services/store';
import { SCENARIOS } from '../services/scenarios';

const { width: W } = Dimensions.get('window');
const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };

// Pink / coral palette
const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#ffffff';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';

type Filter = 'all' | 'high' | 'low';

export default function HistoryScreen() {
  const { state } = useStore();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  // Sort by most recent first
  const sorted = useMemo(() => {
    return [...state.analysisHistory].reverse();
  }, [state.analysisHistory]);

  const filtered = useMemo(() => {
    if (filter === 'all') return sorted;
    if (filter === 'high') return sorted.filter(r => r.overall.score >= 80);
    if (filter === 'low') return sorted.filter(r => r.overall.score < 60);
    return sorted;
  }, [sorted, filter]);

  // Stats
  const total = state.analysisHistory.length;
  const avg = total > 0
    ? Math.round(state.analysisHistory.reduce((s, r) => s + r.overall.score, 0) / total)
    : 0;
  const high = state.analysisHistory.filter(r => r.overall.score >= 80).length;

  return (
    <View style={s.root}>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
        <Text style={s.backTxt}>← 返回</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={[s.title, FX]}>學習記錄</Text>
        <Text style={s.subtitle}>Learning History</Text>

        {/* Summary */}
        <View style={s.summaryRow}>
          <View style={s.summaryCard}>
            <Text style={[s.summaryNum, FX]}>{total}</Text>
            <Text style={s.summaryLab}>總練習</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={[s.summaryNum, FX, { color: PINK }]}>{avg}</Text>
            <Text style={s.summaryLab}>平均分</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={[s.summaryNum, FX, { color: '#7ec48b' }]}>{high}</Text>
            <Text style={s.summaryLab}>高分次</Text>
          </View>
        </View>

        {/* Filter chips */}
        <View style={s.chipsRow}>
          {[
            { k: 'all' as Filter, l: '全部' },
            { k: 'high' as Filter, l: '高分 80+' },
            { k: 'low' as Filter, l: '需加強 <60' },
          ].map(c => (
            <TouchableOpacity
              key={c.k}
              style={[s.chip, filter === c.k && s.chipOn]}
              onPress={() => setFilter(c.k)}
              activeOpacity={0.85}
            >
              <Text style={[s.chipTxt, filter === c.k && s.chipTxtOn, FB]}>{c.l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* History list */}
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyEmoji}>📝</Text>
            <Text style={s.emptyTxt}>未有練習記錄</Text>
            <Text style={s.emptySub}>去 Chat tab 開始第一次練習啦！</Text>
          </View>
        ) : (
          filtered.map((r, i) => {
            const isOpen = expanded === `r-${i}`;
            const scoreColor = r.overall.score >= 80 ? '#7ec48b' : r.overall.score >= 60 ? PINK : '#e88c5a';
            return (
              <TouchableOpacity
                key={i}
                style={s.histCard}
                onPress={() => setExpanded(isOpen ? null : `r-${i}`)}
                activeOpacity={0.85}
              >
                <View style={s.histHead}>
                  <View style={[s.scoreBox, { backgroundColor: scoreColor + '22' }]}>
                    <Text style={[s.scoreNum, FX, { color: scoreColor }]}>{r.overall.score}</Text>
                    <Text style={[s.scoreMax, { color: scoreColor }]}>/100</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.histLevel, FB]}>{r.overall.level}</Text>
                    <Text style={s.histDetail} numberOfLines={isOpen ? undefined : 2}>{r.overall.detail}</Text>
                  </View>
                  <Text style={s.histArrow}>{isOpen ? '▲' : '▼'}</Text>
                </View>

                {isOpen && (
                  <View style={s.histBody}>
                    {/* Sub-scores */}
                    <View style={s.subScoreRow}>
                      <SubScore label="Fluency" score={r.fluency.score} />
                      <SubScore label="Vocab" score={r.vocabulary.score} />
                      <SubScore label="Pronun" score={r.pronunciation.score} />
                      <SubScore label="Grammar" score={r.grammar.score} />
                    </View>

                    {/* Transcript */}
                    {r.transcript && (
                      <View style={s.transBox}>
                        <Text style={s.transLab}>📝 內容</Text>
                        <Text style={s.transTxt}>{r.transcript}</Text>
                      </View>
                    )}

                    {/* Vocab highlights */}
                    {r.vocabulary.usedKeyVocab && r.vocabulary.usedKeyVocab.length > 0 && (
                      <View style={s.vocabBox}>
                        <Text style={s.transLab}>📚 場景詞彙用到：</Text>
                        <View style={s.vocabChips}>
                          {r.vocabulary.usedKeyVocab.slice(0, 6).map((w, j) => (
                            <View key={j} style={s.vocabChip}>
                              <Text style={s.vocabChipTxt}>{w}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

function SubScore({ label, score }: { label: string; score: number }) {
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
    top: 60, left: 16,
    zIndex: 10,
    padding: 12,
  },
  backTxt: { fontSize: 15, color: PINK, fontWeight: '700' },

  title: {
    fontSize: 30,
    color: PINK,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: MUTED,
    textAlign: 'center',
    marginBottom: 18,
    fontWeight: '600',
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryNum: { fontSize: 22, color: INK, marginBottom: 2 },
  summaryLab: { fontSize: 11, color: MUTED, fontWeight: '600' },

  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f5e8de',
  },
  chipOn: { backgroundColor: PINK, borderColor: PINK },
  chipTxt: { fontSize: 12, color: SUBINK },
  chipTxtOn: { color: '#fff' },

  empty: { paddingVertical: 60, alignItems: 'center' },
  emptyEmoji: { fontSize: 60, marginBottom: 12 },
  emptyTxt: { fontSize: 16, color: INK, fontWeight: '700', marginBottom: 4 },
  emptySub: { fontSize: 13, color: MUTED, fontWeight: '500' },

  histCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  histHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  scoreBox: {
    width: 56, height: 56, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  scoreNum: { fontSize: 20 },
  scoreMax: { fontSize: 9, fontWeight: '700', marginTop: -2 },
  histLevel: { fontSize: 14, color: INK, marginBottom: 4 },
  histDetail: { fontSize: 12, color: SUBINK, lineHeight: 18 },
  histArrow: { fontSize: 12, color: MUTED, padding: 4 },

  histBody: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f5e8de' },
  subScoreRow: {
    flexDirection: 'row',
    backgroundColor: CREAM,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  subItem: { flex: 1, alignItems: 'center' },
  subNum: { fontSize: 16, marginBottom: 2 },
  subLab: { fontSize: 9, color: MUTED, fontWeight: '700' },

  transBox: { marginBottom: 10 },
  transLab: { fontSize: 11, color: PINK, fontWeight: '800', marginBottom: 4 },
  transTxt: { fontSize: 12, color: INK, lineHeight: 18 },

  vocabBox: {},
  vocabChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 4 },
  vocabChip: { backgroundColor: PINK_SOFT, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  vocabChipTxt: { fontSize: 10, color: PINK, fontWeight: '700' },
});
