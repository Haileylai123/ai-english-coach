import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../services/store';
import { useI18n } from '../services/i18n';

const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';

type LbType = 'xp' | 'streak' | 'speeches' | 'score';

const TYPES: { key: LbType; label: string; icon: string; from: keyof { xp: number; streak: number; speeches: number; score: number } }[] = [
  { key: 'xp', label: '總 XP', icon: '⭐', from: 'xp' },
  { key: 'streak', label: '連續日數', icon: '🔥', from: 'streak' },
  { key: 'speeches', label: '練習次數', icon: '🎤', from: 'speeches' },
  { key: 'score', label: '最高分', icon: '🏆', from: 'score' },
];

const LB_STORAGE = '@english_coach_leaderboard';

interface RankEntry { name: string; avatar: string; xp: number; streak: number; speeches: number; score: number }

export default function LeaderboardScreen() {
  const router = useRouter();
  const { state } = useStore();
  const { t } = useI18n();
  const [type, setType] = useState<LbType>('xp');
  const [saved, setSaved] = useState<RankEntry[]>([]);

  // Load persisted leaderboard
  useEffect(() => {
    AsyncStorage.getItem(LB_STORAGE).then(data => {
      if (data) {
        try { setSaved(JSON.parse(data)); } catch {}
      }
    });
  }, []);

  // Your entry
  const you: RankEntry = useMemo(() => ({
    name: state.petName || 'You',
    avatar: '😊',
    xp: state.xp,
    streak: state.streak,
    speeches: state.totalSpeeches,
    score: state.bestScores.overall,
  }), [state]);

  // Merge + rank
  const board = useMemo(() => {
    const all = [...saved.filter(s => s.name !== (state.petName || 'You')), you];
    const key = TYPES.find(t => t.key === type)!.from;
    all.sort((a, b) => (b[key] as number) - (a[key] as number));
    return all;
  }, [saved, you, type]);

  const yourRank = board.findIndex(e => e.name === (state.petName || 'You')) + 1;
  const meta = TYPES.find(t => t.key === type)!;

  const saveYourEntry = async () => {
    const updated = saved.filter(s => s.name !== (state.petName || 'You'));
    updated.push(you);
    setSaved(updated);
    await AsyncStorage.setItem(LB_STORAGE, JSON.stringify(updated));
  };

  return (
    <View style={s.root}>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
        <Text style={s.backTxt}>{t('common.back')}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={[s.title, FX]}>{t('lb.title')}</Text>
        <Text style={s.subtitle}>{t('lb.subtitle')}</Text>

        {/* Your rank */}
        <View style={s.rankCard}>
          <View style={s.rankNumBox}>
            <Text style={[s.rankNum, FX]}>第 {yourRank}</Text>
            <Text style={s.rankOf}>/ {Math.max(board.length, 1)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.rankLab}>{t('lb.yourRank')}</Text>
            <Text style={s.rankDetail}>
              {meta.icon} {meta.label}：{you[meta.from]}
            </Text>
          </View>
          <TouchableOpacity style={s.saveBtn} onPress={saveYourEntry} activeOpacity={0.85}>
            <Text style={s.saveBtnTxt}>↻ Update</Text>
          </TouchableOpacity>
        </View>

        {/* Type chips */}
        <Text style={s.section}>{t('lb.type')}</Text>
        <View style={s.chipsRow}>
          {TYPES.map(tt => (
            <TouchableOpacity
              key={tt.key}
              style={[s.chip, type === tt.key && s.chipOn]}
              onPress={() => setType(tt.key)}
              activeOpacity={0.85}
            >
              <Text style={s.chipIcon}>{tt.icon}</Text>
              <Text style={[s.chipTxt, type === tt.key && s.chipTxtOn, FB]}>{tt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Podium (top 3) */}
        {board.length >= 3 ? (
          <View style={s.podium}>
            {[1, 0, 2].map(i => {
              const e = board[i];
              if (!e) return <View key={i} style={{ flex: 1 }} />;
              return (
                <View key={i} style={[s.podiumCol, i === 1 && s.podiumColTall]}>
                  <View style={[s.podiumAvatar, i === 1 && s.podiumAvatarGold]}>
                    <Text style={s.podiumAvatarTxt}>{e.avatar}</Text>
                  </View>
                  <Text style={s.podiumName} numberOfLines={1}>{e.name}</Text>
                  <Text style={[s.podiumScore, FB]}>{e[meta.from]}</Text>
                  <View style={[s.podiumBar, i === 1 && s.podiumBarGold]}>
                    <Text style={s.podiumPos}>第 {i + 1}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={s.emptyPodium}>
            <Text style={s.emptyPodiumIcon}>🏆</Text>
            <Text style={[s.emptyPodiumTxt, FB]}>練習多啲，上排行榜！</Text>
            <Text style={[s.emptyPodiumSub, F]}>每次練習撳 "Update" 紀錄你嘅成績</Text>
          </View>
        )}

        {/* Full ranking */}
        <Text style={s.section}>{t('lb.full')}</Text>
        {board.length > 0 ? (
          board.slice(3).map((e, i) => {
            const rank = i + 4;
            const isYou = e.name === (state.petName || 'You');
            return (
              <View key={i} style={[s.row, isYou && s.rowYou]}>
                <View style={s.rowRank}><Text style={[s.rowRankTxt, FB]}>{rank}</Text></View>
                <View style={s.rowAvatar}><Text style={s.rowAvatarTxt}>{e.avatar}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.rowName, isYou && s.rowNameYou, FB]}>
                    {e.name}{isYou ? ` (${t('common.you')})` : ''}
                  </Text>
                </View>
                <View style={s.rowScoreBox}>
                  <Text style={[s.rowScore, FB]}>{e[meta.from]}</Text>
                  <Text style={s.rowScoreLab}>{meta.label}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={s.emptyRow}>
            <Text style={[s.emptyTxt, F]}>未有記錄 — 去 Chat 練習，返嚟撳 "Update"！</Text>
          </View>
        )}

        <View style={s.note}>
          <Text style={s.noteTxt}>
            ℹ️ 排行榜係本地儲存。朋友對戰功能即將推出！
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
  backBtn: { position: 'absolute', top: 18, left: 16, zIndex: 10, padding: 8 },
  backTxt: { fontSize: 15, color: PINK, fontWeight: '700' },
  title: { fontSize: 30, color: PINK, textAlign: 'center', letterSpacing: 0.3 },
  subtitle: { fontSize: 13, color: MUTED, textAlign: 'center', marginBottom: 18, fontWeight: '600' },

  rankCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: PINK, borderRadius: 18, padding: 16, marginBottom: 18, gap: 14,
  },
  rankNumBox: { width: 70, height: 70, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  rankNum: { fontSize: 18, color: PINK },
  rankOf: { fontSize: 10, color: PINK, fontWeight: '700', marginTop: -4 },
  rankLab: { fontSize: 11, color: '#fff', fontWeight: '700', marginBottom: 4 },
  rankDetail: { fontSize: 14, color: '#fff', fontWeight: '600' },
  saveBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  saveBtnTxt: { color: '#fff', fontSize: 11, fontWeight: '800' },

  section: { fontSize: 16, color: PINK, marginBottom: 10, marginTop: 4, fontWeight: '800' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f5e8de', gap: 4 },
  chipOn: { backgroundColor: PINK, borderColor: PINK },
  chipIcon: { fontSize: 12 },
  chipTxt: { fontSize: 11, color: SUBINK },
  chipTxtOn: { color: '#fff' },

  // Podium
  podium: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 18, gap: 8, height: 160 },
  podiumCol: { flex: 1, alignItems: 'center' },
  podiumColTall: {},
  podiumAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#e0e0e0', marginBottom: 6 },
  podiumAvatarGold: { borderColor: '#f0c44e', width: 70, height: 70, borderRadius: 35 },
  podiumAvatarTxt: { fontSize: 30 },
  podiumName: { fontSize: 12, color: INK, fontWeight: '700', marginBottom: 2 },
  podiumScore: { fontSize: 16, color: PINK, marginBottom: 4 },
  podiumBar: { backgroundColor: '#c0c0c0', paddingVertical: 6, borderRadius: 8, alignItems: 'center', width: '100%' },
  podiumBarGold: { backgroundColor: '#f0c44e' },
  podiumPos: { fontSize: 11, color: '#fff', fontWeight: '800' },
  emptyPodium: { backgroundColor: '#fff', borderRadius: 18, padding: 24, alignItems: 'center', marginBottom: 18 },
  emptyPodiumIcon: { fontSize: 48, marginBottom: 8 },
  emptyPodiumTxt: { fontSize: 15, color: INK },
  emptyPodiumSub: { fontSize: 12, color: MUTED, marginTop: 4 },

  // Row
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 8, gap: 10 },
  rowYou: { backgroundColor: PINK_SOFT, borderWidth: 1.5, borderColor: PINK },
  rowRank: { width: 28, alignItems: 'center' },
  rowRankTxt: { fontSize: 14, color: MUTED },
  rowAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' },
  rowAvatarTxt: { fontSize: 22 },
  rowName: { fontSize: 14, color: INK },
  rowNameYou: { color: PINK },
  rowScoreBox: { alignItems: 'flex-end' },
  rowScore: { fontSize: 16, color: INK },
  rowScoreLab: { fontSize: 9, color: MUTED, fontWeight: '600' },
  emptyRow: { backgroundColor: '#fff', borderRadius: 14, padding: 20, alignItems: 'center' },
  emptyTxt: { fontSize: 13, color: MUTED, textAlign: 'center' },

  note: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 12 },
  noteTxt: { fontSize: 11, color: MUTED, lineHeight: 17, textAlign: 'center' },
});
