import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../services/store';
import { todayStr, isDue, QUALITY } from '../services/srs';
import { WORD_BANK } from '../services/game-data';

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
const ORANGE = '#f0a96e';
const RED = '#e57373';

export default function SRSScreen() {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const [revealed, setRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Build review queue: due customVocab + due srs from word bank
  const today = todayStr();
  const allWords = useMemo(() => {
    const list: { en: string; zh: string }[] = [];
    (['beginner', 'intermediate', 'advanced'] as const).forEach(level => {
      WORD_BANK[level].forEach(w => list.push(w));
    });
    return list;
  }, []);

  // Combine custom vocab and word bank words with SRS state
  const reviewQueue = useMemo(() => {
    const queue: { en: string; zh: string; srsKey: string }[] = [];
    // Custom vocab
    state.customVocab.forEach(w => {
      const srsEntry = state.srs[w.en];
      if (!srsEntry || isDue(srsEntry, today)) {
        queue.push({ en: w.en, zh: w.zh || '—', srsKey: w.en });
      }
    });
    // Word bank (only if explicitly added to srs)
    Object.keys(state.srs).forEach(word => {
      if (state.customVocab.some(v => v.en === word)) return; // already added
      const srsEntry = state.srs[word];
      if (isDue(srsEntry, today)) {
        const bank = allWords.find(w => w.en.toLowerCase() === word.toLowerCase());
        queue.push({ en: word, zh: bank?.zh || '—', srsKey: word });
      }
    });
    return queue;
  }, [state.customVocab, state.srs, today, allWords]);

  const current = reviewQueue[0];
  const isEmpty = reviewQueue.length === 0;
  const isDone = isEmpty || reviewedCount >= reviewQueue.length;

  const startSession = () => {
    if (reviewQueue.length === 0) return;
    // Initialize SRS for any words that don't have entries
    reviewQueue.forEach(item => {
      if (!state.srs[item.srsKey]) {
        dispatch({ type: 'SRS_INIT_WORD', payload: { word: item.srsKey } });
      }
    });
  };

  React.useEffect(() => {
    startSession();
  }, [reviewQueue.length]);

  const handleReview = (quality: number) => {
    if (!current) return;
    dispatch({ type: 'SRS_UPDATE', payload: { word: current.srsKey, quality } });
    if (quality >= 3) setCorrectCount(c => c + 1);
    setReviewedCount(c => c + 1);
    setRevealed(false);
  };

  if (isDone && reviewedCount > 0) {
    return (
      <View style={s.root}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <Text style={s.backTxt}>← 返回</Text>
        </TouchableOpacity>
        <View style={s.doneWrap}>
          <Text style={s.doneEmoji}>🎉</Text>
          <Text style={[s.doneTitle, FX]}>完成！</Text>
          <Text style={s.doneMsg}>
            今日完成咗 {reviewedCount} 個生字{'\n'}
            答對 {correctCount} 個 ({Math.round((correctCount / reviewedCount) * 100)}%)
          </Text>
          <TouchableOpacity style={s.doneBtn} onPress={() => router.back()} activeOpacity={0.85}>
            <Text style={s.doneBtnTxt}>返去 Vocab</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={s.root}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <Text style={s.backTxt}>← 返回</Text>
        </TouchableOpacity>
        <View style={s.emptyWrap}>
          <Text style={s.emptyEmoji}>✨</Text>
          <Text style={[s.emptyTitle, FX]}>冇嘢要複習</Text>
          <Text style={s.emptyMsg}>所有生字都仲未到期！{'\n'}聽日再嚟</Text>
          <TouchableOpacity style={s.emptyBtn} onPress={() => router.back()} activeOpacity={0.85}>
            <Text style={s.emptyBtnTxt}>返去</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
        <Text style={s.backTxt}>← 返回</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${(reviewedCount / reviewQueue.length) * 100}%` }]} />
        </View>
        <Text style={s.progressTxt}>
          {reviewedCount + 1} / {reviewQueue.length}
        </Text>

        {/* Card */}
        <View style={s.card}>
          <Text style={s.cardLabel}>睇英文 · 諗中文</Text>
          <Text style={[s.cardEn, FX]}>{current.en}</Text>
          {revealed ? (
            <Text style={[s.cardZh, FB]}>{current.zh}</Text>
          ) : (
            <TouchableOpacity style={s.revealBtn} onPress={() => setRevealed(true)} activeOpacity={0.85}>
              <Text style={s.revealBtnTxt}>睇答案</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Review buttons */}
        {revealed ? (
          <View style={s.reviewRow}>
            <TouchableOpacity
              style={[s.reviewBtn, { backgroundColor: RED }]}
              onPress={() => handleReview(QUALITY.AGAIN)}
              activeOpacity={0.85}
            >
              <Text style={s.reviewBtnTxt}>😕 唔識</Text>
              <Text style={s.reviewSub}>1 分鐘後再</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.reviewBtn, { backgroundColor: ORANGE }]}
              onPress={() => handleReview(QUALITY.HARD)}
              activeOpacity={0.85}
            >
              <Text style={s.reviewBtnTxt}>🤔 好難</Text>
              <Text style={s.reviewSub}>3 日後</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.reviewBtn, { backgroundColor: GREEN }]}
              onPress={() => handleReview(QUALITY.GOOD)}
              activeOpacity={0.85}
            >
              <Text style={s.reviewBtnTxt}>😊 記得</Text>
              <Text style={s.reviewSub}>7 日後</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.reviewBtn, { backgroundColor: '#5cb85c' }]}
              onPress={() => handleReview(QUALITY.EASY)}
              activeOpacity={0.85}
            >
              <Text style={s.reviewBtnTxt}>💪 簡單</Text>
              <Text style={s.reviewSub}>14+ 日後</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={s.tipBox}>
          <Text style={s.tipTitle}>💡 SRS 智能複習</Text>
          <Text style={s.tipTxt}>
            用 SuperMemo SM-2 算法：你記得越好，下次複習越耐。{'\n'}
            唔識嘅會即刻重複，記得嘅會 6 日、然後 14+ 日後先再。
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { position: 'absolute', top: 60, left: 16, zIndex: 10, padding: 8 },
  backTxt: { fontSize: 15, color: PINK, fontWeight: '700' },

  progressBar: { height: 6, backgroundColor: '#f0e0d0', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: PINK, borderRadius: 3 },
  progressTxt: { fontSize: 12, color: MUTED, fontWeight: '700', textAlign: 'right', marginBottom: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 240,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: { fontSize: 11, color: MUTED, fontWeight: '700', letterSpacing: 1, marginBottom: 20 },
  cardEn: { fontSize: 38, color: INK, textAlign: 'center', marginBottom: 24, fontWeight: '800' },
  cardZh: { fontSize: 24, color: PINK, textAlign: 'center', fontWeight: '700' },
  revealBtn: { backgroundColor: PINK_SOFT, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 16 },
  revealBtnTxt: { color: PINK, fontSize: 14, fontWeight: '800' },

  reviewRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  reviewBtn: { flexBasis: '48%', flexGrow: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  reviewBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '800', marginBottom: 2 },
  reviewSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' },

  tipBox: { backgroundColor: PINK_SOFT, borderRadius: 12, padding: 14 },
  tipTitle: { fontSize: 13, color: PINK, fontWeight: '800', marginBottom: 4 },
  tipTxt: { fontSize: 12, color: SUBINK, lineHeight: 18, fontWeight: '500' },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyEmoji: { fontSize: 60, marginBottom: 12 },
  emptyTitle: { fontSize: 24, color: INK, marginBottom: 8 },
  emptyMsg: { fontSize: 14, color: SUBINK, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  emptyBtn: { backgroundColor: PINK, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16 },
  emptyBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '800' },

  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  doneEmoji: { fontSize: 70, marginBottom: 12 },
  doneTitle: { fontSize: 28, color: INK, marginBottom: 12 },
  doneMsg: { fontSize: 15, color: SUBINK, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  doneBtn: { backgroundColor: PINK, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16 },
  doneBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
