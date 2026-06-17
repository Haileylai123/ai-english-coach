// app/daily-challenge.tsx — Daily Challenge + Cross-market Leaderboard
// Viral engine: one prompt/day, score, share image

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Image, Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useStore } from '../services/store';
import { useI18n } from '../services/i18n';
import {
  getDailyChallenge, submitDailyChallenge, getLeaderboard,
  getDailyStreak, type DailyChallenge, type DailyStreak, type LeaderboardEntry, type MarketStat,
} from '../services/backend';

const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#ffffff';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';
const GOLD = '#f0c44e';

const MARKET_FLAGS: Record<string, string> = {
  JP: '🇯🇵', KR: '🇰🇷', HK: '🇭🇰', CN: '🇨🇳', INTL: '🌏', OTHER: '🌐',
};
const MARKET_KEYS: Record<string, string> = {
  JP: 'market.JP', KR: 'market.KR', HK: 'market.HK', CN: 'market.CN',
  INTL: 'market.INTL', OTHER: 'market.OTHER',
};
const SCENE_ICONS: Record<string, string> = {
  daily: '☀️', business: '💼', ielts: '🎓', interview: '💼', dating: '💕',
  keigo: '🎌', izakaya: '🍺', toeic: '📝', 'job-hunt-kr': '👔',
};

export default function DailyChallengeScreen() {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const { t, locale } = useI18n();
  const viewShotRef = useRef<ViewShot>(null);

  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [streak, setStreak] = useState<DailyStreak | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStat[]>([]);
  const [scope, setScope] = useState<'global' | 'market'>('global');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<{ score: number; rank: number; totalToday: number } | null>(null);
  const [sharing, setSharing] = useState(false);

  const myMarket = inferMarket(state.locale);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dc, lb] = await Promise.all([
        getDailyChallenge(locale),
        getLeaderboard({ scope: 'global', limit: 50 }),
      ]);
      setChallenge(dc);
      setLeaderboard(lb.leaderboard);
      setMarketStats(lb.marketStats);
      if (dc.myCompletion) {
        setLastResult({ score: dc.myCompletion.score, rank: 0, totalToday: 0 });
      }
      try {
        const st = await getDailyStreak();
        setStreak(st);
      } catch {}
    } catch (e: any) {
      // Even on error, show a local challenge
      console.warn('[daily-challenge] load failed', e?.message);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => { load(); }, [load]);

  const filteredLeaderboard = scope === 'market'
    ? leaderboard.filter(e => e.market === myMarket)
    : leaderboard;

  const handleSubmit = async (score: number) => {
    if (!challenge) return;
    setSubmitting(true);
    try {
      const res = await submitDailyChallenge({
        score,
        scene: challenge.scene,
        date: challenge.date,
        durationMs: 30000,
      });
      setLastResult({ score: res.score, rank: res.rank, totalToday: res.totalToday });
      dispatch({ type: 'ADD_XP', payload: Math.round(res.score * 0.5) });
      // Reload leaderboard
      const lb = await getLeaderboard({ scope: 'global', limit: 50 });
      setLeaderboard(lb.leaderboard);
      setMarketStats(lb.marketStats);
      try {
        const st = await getDailyStreak();
        setStreak(st);
      } catch {}
      Alert.alert(
        t('dc.submitted') || '已提交!',
        `${t('dc.rank') || '排名'}: ${res.rank} / ${res.totalToday}\n${t('dc.score') || '分數'}: ${res.score}`,
      );
    } catch (e: any) {
      Alert.alert(t('common.error'), e?.message || t('dc.submitFail'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (!viewShotRef.current?.capture) return;
    setSharing(true);
    try {
      const uri = await viewShotRef.current.capture();
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Daily Challenge',
        });
      } else {
        await Share.share({ url: uri, message: 'My Daily Challenge score!' });
      }
    } catch (e: any) {
      Alert.alert('Share failed', e?.message || '');
    } finally {
      setSharing(false);
    }
  };

  // Quick practice mode: pick a scene from the daily challenge, do a 30s practice,
  // and submit a score. For MVP, allow user to input score manually.
  const [practiceMode, setPracticeMode] = useState(false);
  const [pendingScore, setPendingScore] = useState<number | null>(null);

  if (loading) {
    return (
      <View style={[s.root, s.center]}>
        <ActivityIndicator size="large" color={PINK} />
        <Text style={[s.loadingTxt, F]}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={[s.root, s.center]}>
        <Text style={[s.errorTxt, FB]}>{t('dc.error')}</Text>
        <TouchableOpacity style={s.retryBtn} onPress={load}><Text style={s.retryTxt}>{t('common.retry')}</Text></TouchableOpacity>
        <TouchableOpacity style={s.backBtnAbsolute} onPress={() => router.back()}>
          <Text style={s.backTxt}>{t('common.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const promptText = challenge.promptLocalized;
  const isDone = !!challenge.myCompletion || !!lastResult;
  const displayScore = lastResult?.score ?? challenge.myCompletion?.score ?? 0;

  return (
    <View style={s.root}>
      <TouchableOpacity style={s.backBtnAbsolute} onPress={() => router.back()}>
        <Text style={s.backTxt}>{t('common.back')}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Hero card */}
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={s.shareCard}>
          <View style={s.shareInner}>
            <Text style={[s.shareDate, FB]}>{challenge.date}</Text>
            <Text style={[s.shareTitle, FX]}>
              {SCENE_ICONS[challenge.scene] || '🎯'} {t('dc.title') || '今日挑戰'}
            </Text>
            <Text style={s.sharePrompt}>{promptText}</Text>
            <View style={s.shareScoreRow}>
              <Text style={[s.shareScore, FX]}>{displayScore}</Text>
              <Text style={s.shareScoreLab}>/ 100</Text>
            </View>
            {streak && streak.current > 0 && (
              <View style={s.shareStreakRow}>
                <Text style={s.shareStreak}>🔥 {streak.current} {t('dc.streak') || '連續'}</Text>
              </View>
            )}
            <Text style={s.shareFooter}>English Coach · {t('dc.shareFooter')}</Text>
          </View>
        </ViewShot>

        {/* Scene + streak bar */}
        <View style={s.metaRow}>
          <View style={s.metaChip}>
            <Text style={s.metaChipIcon}>{SCENE_ICONS[challenge.scene] || '🎯'}</Text>
            <Text style={[s.metaChipTxt, FB]}>{challenge.scene}</Text>
          </View>
          <View style={s.metaChip}>
            <Text style={s.metaChipIcon}>{MARKET_FLAGS[myMarket]}</Text>
            <Text style={[s.metaChipTxt, FB]}>{t(MARKET_KEYS[myMarket]) || myMarket}</Text>
          </View>
          {streak && (
            <View style={[s.metaChip, s.metaChipGold]}>
              <Text style={s.metaChipIcon}>🔥</Text>
              <Text style={[s.metaChipTxt, FB]}>{streak.current}</Text>
            </View>
          )}
        </View>

        {/* Prompt */}
        <View style={s.promptCard}>
          <Text style={s.promptLab}>{t('dc.todaysPrompt') || '今日題目'}</Text>
          <Text style={s.promptText}>{promptText}</Text>
        </View>

        {/* Action area */}
        {isDone ? (
          <View style={s.doneCard}>
            <Text style={s.doneIcon}>✅</Text>
            <Text style={[s.doneTitle, FX]}>{t('dc.completed') || '今日已完成!'}</Text>
            <Text style={s.doneScore}>
              {t('dc.score') || '分數'}: <Text style={s.doneScoreVal}>{displayScore}</Text> / 100
            </Text>
            {lastResult && lastResult.rank > 0 && (
              <Text style={s.doneRank}>
                {t('dc.rank') || '排名'}: {lastResult.rank} / {lastResult.totalToday}
              </Text>
            )}
            <View style={s.doneBtns}>
              <TouchableOpacity style={s.shareBtn} onPress={handleShare} disabled={sharing} activeOpacity={0.85}>
                <Text style={s.shareBtnTxt}>{sharing ? '...' : t('dc.shareBtn')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.practiceBtn} onPress={() => setPracticeMode(!practiceMode)} activeOpacity={0.85}>
                <Text style={s.practiceBtnTxt}>{t('dc.retake')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={s.actionCard}>
            <Text style={s.actionTitle}>{t('dc.howTo') || '點樣玩?'}</Text>
            <Text style={s.actionStep}>{t('dc.howToStep')}</Text>
            <TouchableOpacity style={s.practiceBtn} onPress={() => setPracticeMode(!practiceMode)} activeOpacity={0.85}>
              <Text style={s.practiceBtnTxt}>{t('dc.startPractice')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Practice mode (manual score entry for MVP) */}
        {practiceMode && (
          <View style={s.scoreCard}>
            <Text style={[s.scoreTitle, FB]}>{t('dc.inputScore')}</Text>
            <Text style={s.scoreHint}>{t('dc.inputScoreHint')}</Text>
            <View style={s.scoreRow}>
              {[60, 70, 80, 90, 100].map(v => (
                <TouchableOpacity
                  key={v}
                  style={[s.scoreBtn, pendingScore === v && s.scoreBtnOn]}
                  onPress={() => setPendingScore(v)}
                  activeOpacity={0.85}
                >
                  <Text style={[s.scoreBtnTxt, pendingScore === v && s.scoreBtnTxtOn, FB]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[s.submitBtn, !pendingScore && s.submitBtnDisabled]}
              onPress={() => pendingScore && handleSubmit(pendingScore)}
              disabled={!pendingScore || submitting}
              activeOpacity={0.85}
            >
              <Text style={s.submitBtnTxt}>
                {submitting ? t('dc.submitting') : t('dc.submit', { score: pendingScore || '?' })}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Market stats */}
        {marketStats.length > 0 && (
          <>
            <Text style={s.section}>🌏 {t('dc.markets')}</Text>
            <View style={s.marketRow}>
              {marketStats.map(m => (
                <View key={m.market} style={s.marketCard}>
                  <Text style={s.marketFlag}>{MARKET_FLAGS[m.market] || '🌐'}</Text>
                  <Text style={[s.marketName, FB]}>{t(MARKET_KEYS[m.market]) || m.market}</Text>
                  <Text style={s.marketTop}>👑 {Math.round(m.top_score)}</Text>
                  <Text style={s.marketAvg}>avg {Math.round(m.avg_score)}</Text>
                  <Text style={s.marketCount}>{m.count} {t('market.unit')}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Leaderboard */}
        <Text style={s.section}>🏆 {t('dc.leaderboard')}</Text>
        <View style={s.chipsRow}>
          <TouchableOpacity
            style={[s.chip, scope === 'global' && s.chipOn]}
            onPress={() => setScope('global')}
            activeOpacity={0.85}
          >
            <Text style={s.chipIcon}>🌏</Text>
            <Text style={[s.chipTxt, scope === 'global' && s.chipTxtOn, FB]}>{t('dc.global')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.chip, scope === 'market' && s.chipOn]}
            onPress={() => setScope('market')}
            activeOpacity={0.85}
          >
            <Text style={s.chipIcon}>{MARKET_FLAGS[myMarket]}</Text>
            <Text style={[s.chipTxt, scope === 'market' && s.chipTxtOn, FB]}>{t(MARKET_KEYS[myMarket])}</Text>
          </TouchableOpacity>
        </View>

        {filteredLeaderboard.length > 0 ? (
          filteredLeaderboard.slice(0, 20).map((e, i) => {
            const rank = i + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            return (
              <View key={e.user_id + i} style={s.row}>
                <View style={s.rowRank}><Text style={[s.rowRankTxt, FB]}>{medal}</Text></View>
                <View style={s.rowAvatar}>
                  <Text style={s.rowAvatarTxt}>{MARKET_FLAGS[e.market || 'OTHER']}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowName} numberOfLines={1}>{e.display_name || 'Anonymous'}</Text>
                  <Text style={s.rowMeta}>{t(MARKET_KEYS[e.market || 'OTHER'])} · {e.scene}</Text>
                </View>
                <View style={s.rowScoreBox}>
                  <Text style={[s.rowScore, FB]}>{e.score}</Text>
                  <Text style={s.rowScoreLab}>{t('dc.pts')}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={s.emptyRow}>
            <Text style={[s.emptyTxt, F]}>{t('dc.empty')}</Text>
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

function inferMarket(loc?: string): string {
  if (!loc) return 'OTHER';
  if (loc === 'ja') return 'JP';
  if (loc === 'ko') return 'KR';
  if (loc === 'zh-HK') return 'HK';
  if (loc === 'zh-CN') return 'CN';
  if (loc === 'en') return 'INTL';
  return 'OTHER';
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backBtnAbsolute: { position: 'absolute', top: 60, left: 16, zIndex: 10, padding: 8 },
  backTxt: { fontSize: 15, color: PINK, fontWeight: '700' },
  loadingTxt: { fontSize: 14, color: MUTED, marginTop: 12 },
  errorTxt: { fontSize: 16, color: INK, marginBottom: 12 },
  retryBtn: { backgroundColor: PINK, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  retryTxt: { color: '#fff', fontWeight: '800' },

  // Share card
  shareCard: { backgroundColor: PINK, borderRadius: 22, marginBottom: 18, overflow: 'hidden' },
  shareInner: { padding: 22, alignItems: 'center' },
  shareDate: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginBottom: 6 },
  shareTitle: { fontSize: 22, color: '#fff', marginBottom: 14 },
  sharePrompt: { fontSize: 15, color: '#fff', textAlign: 'center', lineHeight: 22, marginBottom: 18, paddingHorizontal: 6 },
  shareScoreRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 },
  shareScore: { fontSize: 64, color: '#fff' },
  shareScoreLab: { fontSize: 16, color: 'rgba(255,255,255,0.7)', fontWeight: '700', marginLeft: 4 },
  shareStreakRow: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, marginBottom: 8 },
  shareStreak: { fontSize: 13, color: '#fff', fontWeight: '800' },
  shareFooter: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '700', marginTop: 6, letterSpacing: 1 },

  // Meta chips
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  metaChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f5e8de', gap: 4 },
  metaChipGold: { backgroundColor: '#fff7e0', borderColor: GOLD },
  metaChipIcon: { fontSize: 12 },
  metaChipTxt: { fontSize: 11, color: INK },

  // Prompt
  promptCard: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 18, borderWidth: 1, borderColor: '#f5e8de' },
  promptLab: { fontSize: 11, color: MUTED, fontWeight: '800', marginBottom: 6, letterSpacing: 1 },
  promptText: { fontSize: 17, color: INK, lineHeight: 26, fontWeight: '600' },

  // Done card
  doneCard: { backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 18, alignItems: 'center', borderWidth: 2, borderColor: PINK },
  doneIcon: { fontSize: 36, marginBottom: 4 },
  doneTitle: { fontSize: 18, color: PINK, marginBottom: 10 },
  doneScore: { fontSize: 14, color: SUBINK, marginBottom: 4 },
  doneScoreVal: { fontSize: 22, color: PINK, fontWeight: '800' },
  doneRank: { fontSize: 13, color: MUTED, marginBottom: 14 },
  doneBtns: { flexDirection: 'row', gap: 10 },
  shareBtn: { backgroundColor: PINK, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12 },
  shareBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '800' },
  practiceBtn: { backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: PINK },
  practiceBtnTxt: { color: PINK, fontSize: 14, fontWeight: '800' },

  // Action card
  actionCard: { backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 18, borderWidth: 1, borderColor: '#f5e8de' },
  actionTitle: { fontSize: 15, color: INK, fontWeight: '800', marginBottom: 10 },
  actionStep: { fontSize: 13, color: SUBINK, lineHeight: 22, marginBottom: 14 },

  // Score picker
  scoreCard: { backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 18, borderWidth: 1, borderColor: PINK },
  scoreTitle: { fontSize: 15, color: INK, marginBottom: 4 },
  scoreHint: { fontSize: 12, color: MUTED, marginBottom: 14 },
  scoreRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  scoreBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: CREAM, alignItems: 'center', borderWidth: 1.5, borderColor: '#f5e8de' },
  scoreBtnOn: { backgroundColor: PINK, borderColor: PINK },
  scoreBtnTxt: { fontSize: 16, color: SUBINK },
  scoreBtnTxtOn: { color: '#fff' },
  submitBtn: { backgroundColor: PINK, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: MUTED },
  submitBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // Market stats
  section: { fontSize: 16, color: PINK, marginBottom: 10, marginTop: 6, fontWeight: '800' },
  marketRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  marketCard: { width: '48%', backgroundColor: '#fff', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#f5e8de' },
  marketFlag: { fontSize: 24, marginBottom: 4 },
  marketName: { fontSize: 12, color: INK, marginBottom: 6 },
  marketTop: { fontSize: 13, color: PINK, fontWeight: '800' },
  marketAvg: { fontSize: 10, color: MUTED, marginBottom: 4 },
  marketCount: { fontSize: 10, color: MUTED, fontWeight: '600' },

  // Chips
  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f5e8de', gap: 4 },
  chipOn: { backgroundColor: PINK, borderColor: PINK },
  chipIcon: { fontSize: 12 },
  chipTxt: { fontSize: 12, color: SUBINK },
  chipTxtOn: { color: '#fff' },

  // Row
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 8, gap: 10 },
  rowRank: { width: 36, alignItems: 'center' },
  rowRankTxt: { fontSize: 14, color: PINK },
  rowAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' },
  rowAvatarTxt: { fontSize: 20 },
  rowName: { fontSize: 14, color: INK, fontWeight: '700' },
  rowMeta: { fontSize: 10, color: MUTED, fontWeight: '600', marginTop: 2 },
  rowScoreBox: { alignItems: 'flex-end' },
  rowScore: { fontSize: 16, color: INK },
  rowScoreLab: { fontSize: 9, color: MUTED, fontWeight: '600' },
  emptyRow: { backgroundColor: '#fff', borderRadius: 14, padding: 20, alignItems: 'center' },
  emptyTxt: { fontSize: 13, color: MUTED, textAlign: 'center' },
});
