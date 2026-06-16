import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../services/store';
import { useI18n } from '../services/i18n';

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

type LbType = 'xp' | 'streak' | 'speeches' | 'score';

const TYPES: { key: LbType; label: string; icon: string; from: keyof any }[] = [
  { key: 'xp', label: '總 XP', icon: '⭐', from: 'xp' },
  { key: 'streak', label: '連續日數', icon: '🔥', from: 'streak' },
  { key: 'speeches', label: '練習次數', icon: '🎤', from: 'totalSpeeches' },
  { key: 'score', label: '最高分', icon: '🏆', from: 'bestOverall' },
];

interface FriendEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  totalSpeeches: number;
  bestOverall: number;
  isYou?: boolean;
}

// Demo friends list (synthetic — to demonstrate ranking concept)
const DEMO_FRIENDS_BASE: Omit<FriendEntry, 'xp' | 'streak' | 'totalSpeeches' | 'bestOverall'>[] = [
  { id: 'f1', name: 'Vivian', avatar: '🦊' },
  { id: 'f2', name: 'Jason', avatar: '🐱' },
  { id: 'f3', name: 'Mei', avatar: '🐰' },
  { id: 'f4', name: 'Brian', avatar: '🐼' },
  { id: 'f5', name: 'Sarah', avatar: '🦄' },
  { id: 'f6', name: 'David', avatar: '🐯' },
  { id: 'f7', name: 'Kelly', avatar: '🐶' },
  { id: 'f8', name: '阿明', avatar: '🐻' },
  { id: 'f9', name: 'Tina', avatar: '🐨' },
  { id: 'f10', name: 'Kevin', avatar: '🦁' },
];

// Stable demo values (don't change between renders)
const DEMO_STATS: Record<string, { xp: number; streak: number; totalSpeeches: number; bestOverall: number }> = {
  f1: { xp: 1280, streak: 14, totalSpeeches: 87, bestOverall: 92 },
  f2: { xp: 950, streak: 7, totalSpeeches: 62, bestOverall: 88 },
  f3: { xp: 1100, streak: 10, totalSpeeches: 71, bestOverall: 85 },
  f4: { xp: 720, streak: 5, totalSpeeches: 48, bestOverall: 78 },
  f5: { xp: 1450, streak: 21, totalSpeeches: 102, bestOverall: 95 },
  f6: { xp: 580, streak: 3, totalSpeeches: 39, bestOverall: 72 },
  f7: { xp: 890, streak: 8, totalSpeeches: 55, bestOverall: 81 },
  f8: { xp: 1340, streak: 16, totalSpeeches: 91, bestOverall: 90 },
  f9: { xp: 760, streak: 6, totalSpeeches: 50, bestOverall: 76 },
  f10: { xp: 1020, streak: 9, totalSpeeches: 67, bestOverall: 84 },
};

export default function LeaderboardScreen() {
  const router = useRouter();
  const { state } = useStore();
  const { t } = useI18n();
  const [type, setType] = useState<LbType>('xp');
  const [period, setPeriod] = useState<'all' | 'week'>('all');

  // Build leaderboard
  const board = useMemo(() => {
    const you: FriendEntry = {
      id: 'you',
      name: state.petName || t('common.you'),
      avatar: '😊',
      xp: state.xp,
      streak: state.streak,
      totalSpeeches: state.totalSpeeches,
      bestOverall: state.bestScores.overall,
      isYou: true,
    };

    // Adjust demo friends for "this week"
    const list: FriendEntry[] = DEMO_FRIENDS_BASE.map(f => {
      const base = DEMO_STATS[f.id];
      const mult = period === 'week' ? 0.3 : 1;
      return {
        ...f,
        xp: Math.floor(base.xp * mult),
        streak: Math.min(base.streak, 7),
        totalSpeeches: Math.floor(base.totalSpeeches * mult),
        bestOverall: base.bestOverall,
      };
    });
    list.push(you);
    // Sort by selected type
    const key = TYPES.find(t => t.key === type)!.from as keyof FriendEntry;
    list.sort((a, b) => (b[key] as number) - (a[key] as number));
    return list;
  }, [state, type, period]);

  const yourRank = board.findIndex(e => e.isYou) + 1;
  const meta = TYPES.find(t => t.key === type)!;

  return (
    <View style={s.root}>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
        <Text style={s.backTxt}>{t('common.back')}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={[s.title, FX]}>{t('lb.title')}</Text>
        <Text style={s.subtitle}>{t('lb.subtitle')}</Text>

        {/* Your rank highlight */}
        <View style={s.rankCard}>
          <View style={s.rankNumBox}>
            <Text style={[s.rankNum, FX]}>第 {yourRank}</Text>
            <Text style={s.rankOf}>/ {board.length}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.rankLab}>{t('lb.yourRank')}</Text>
            <Text style={s.rankDetail}>
              {meta.icon} {meta.label}：<Text style={s.rankVal}>
                {(board.find(e => e.isYou) as any)[meta.from]}
              </Text>
            </Text>
          </View>
        </View>

        {/* Type chips */}
        <Text style={s.section}>{t('lb.type')}</Text>
        <View style={s.chipsRow}>
          {TYPES.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[s.chip, type === t.key && s.chipOn]}
              onPress={() => setType(t.key)}
              activeOpacity={0.85}
            >
              <Text style={[s.chipIcon]}>{t.icon}</Text>
              <Text style={[s.chipTxt, type === t.key && s.chipTxtOn, FB]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Period */}
        <View style={s.periodRow}>
          {(['all', 'week'] as const).map(p => (
            <TouchableOpacity
              key={p}
              style={[s.periodBtn, period === p && s.periodBtnOn]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.85}
            >
              <Text style={[s.periodTxt, period === p && s.periodTxtOn, FB]}>
                {p === 'all' ? t('lb.allTime') : t('lb.thisWeek')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top 3 podium */}
        <View style={s.podium}>
          {[1, 0, 2].map(i => {
            const e = board[i];
            if (!e) return <View key={i} style={{ flex: 1 }} />;
            const isFirst = i === 1;
            return (
              <View key={e.id} style={[s.podiumCol, isFirst && s.podiumColTall]}>
                <View style={[s.podiumAvatar, isFirst && s.podiumAvatarGold]}>
                  <Text style={s.podiumAvatarTxt}>{e.avatar}</Text>
                </View>
                <Text style={s.podiumName} numberOfLines={1}>{e.name}</Text>
                <Text style={[s.podiumScore, FB]}>{(e as any)[meta.from]}</Text>
                <View style={[s.podiumBar, isFirst && s.podiumBarGold]}>
                  <Text style={s.podiumPos}>第 {i + 1}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Rest of leaderboard */}
        <Text style={s.section}>{t('lb.full')}</Text>
        {board.slice(3).map((e, i) => {
          const rank = i + 4;
          return (
            <View
              key={e.id}
              style={[s.row, e.isYou && s.rowYou]}
            >
              <View style={s.rowRank}>
                <Text style={[s.rowRankTxt, FB]}>{rank}</Text>
              </View>
              <View style={s.rowAvatar}>
                <Text style={s.rowAvatarTxt}>{e.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.rowName, e.isYou && s.rowNameYou, FB]}>{e.name}{e.isYou ? ` (${t('common.you')})` : ''}</Text>
              </View>
              <View style={s.rowScoreBox}>
                <Text style={[s.rowScore, FB]}>{(e as any)[meta.from]}</Text>
                <Text style={s.rowScoreLab}>{meta.label}</Text>
              </View>
            </View>
          );
        })}

        <View style={s.note}>
          <Text style={s.noteTxt}>
            {t('lb.note')}
          </Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
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

  title: { fontSize: 30, color: PINK, textAlign: 'center', letterSpacing: 0.3 },
  subtitle: { fontSize: 13, color: MUTED, textAlign: 'center', marginBottom: 18, fontWeight: '600' },

  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PINK,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    gap: 14,
  },
  rankNumBox: {
    width: 70, height: 70, borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  rankNum: { fontSize: 18, color: PINK },
  rankOf: { fontSize: 10, color: PINK, fontWeight: '700', marginTop: -4 },
  rankLab: { fontSize: 11, color: '#fff', fontWeight: '700', marginBottom: 4 },
  rankDetail: { fontSize: 14, color: '#fff', fontWeight: '600' },
  rankVal: { fontWeight: '800' },

  section: { fontSize: 16, color: PINK, marginBottom: 10, marginTop: 4, fontWeight: '800' },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#f5e8de', gap: 4,
  },
  chipOn: { backgroundColor: PINK, borderColor: PINK },
  chipIcon: { fontSize: 12 },
  chipTxt: { fontSize: 11, color: SUBINK },
  chipTxtOn: { color: '#fff' },

  periodRow: { flexDirection: 'row', gap: 8, marginBottom: 16, backgroundColor: '#fff', borderRadius: 12, padding: 4 },
  periodBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  periodBtnOn: { backgroundColor: PINK },
  periodTxt: { fontSize: 12, color: SUBINK },
  periodTxtOn: { color: '#fff' },

  // Podium
  podium: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 18, gap: 8, height: 160 },
  podiumCol: { flex: 1, alignItems: 'center' },
  podiumColTall: {},
  podiumAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#e0e0e0',
    marginBottom: 6,
  },
  podiumAvatarGold: { borderColor: '#f0c44e', width: 70, height: 70, borderRadius: 35 },
  podiumAvatarTxt: { fontSize: 30 },
  podiumName: { fontSize: 12, color: INK, fontWeight: '700', marginBottom: 2 },
  podiumScore: { fontSize: 16, color: PINK, marginBottom: 4 },
  podiumBar: {
    backgroundColor: '#c0c0c0', paddingVertical: 6, borderRadius: 8, alignItems: 'center',
    width: '100%',
  },
  podiumBarGold: { backgroundColor: '#f0c44e' },
  podiumPos: { fontSize: 11, color: '#fff', fontWeight: '800' },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  rowYou: { backgroundColor: PINK_SOFT, borderWidth: 1.5, borderColor: PINK },
  rowRank: { width: 28, alignItems: 'center' },
  rowRankTxt: { fontSize: 14, color: MUTED },
  rowAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: CREAM,
    alignItems: 'center', justifyContent: 'center',
  },
  rowAvatarTxt: { fontSize: 22 },
  rowName: { fontSize: 14, color: INK },
  rowNameYou: { color: PINK },
  rowScoreBox: { alignItems: 'flex-end' },
  rowScore: { fontSize: 16, color: INK },
  rowScoreLab: { fontSize: 9, color: MUTED, fontWeight: '600' },

  note: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 12,
  },
  noteTxt: { fontSize: 11, color: MUTED, lineHeight: 17, textAlign: 'center' },
});
