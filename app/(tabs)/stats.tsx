import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../services/store';
import { ACHIEVEMENTS } from '../../services/emotions';
import OverflowMenu from '../../components/OverflowMenu';

const STAT_MEDAL = require('../../assets/icons/stat-medal.png');
const STAT_FLUENCY = require('../../assets/icons/stat-fluency.png');
const STAT_VOCAB = require('../../assets/icons/stat-vocabulary.png');
const STAT_PRONUNCIATION = require('../../assets/icons/stat-pronunciation.png');
const STAT_GRAMMAR = require('../../assets/icons/stat-grammar.png');
const STAT_PRACTICE = require('../../assets/icons/stat-practice.png');
const STAT_SPEECH = require('../../assets/icons/stat-speech.png');
const STAT_WORDS = require('../../assets/icons/stat-words.png');
const STAT_LEVEL = require('../../assets/icons/stat-level.png');
const STAT_STREAK = require('../../assets/icons/stat-streak.png');
const STAT_XP = require('../../assets/icons/stat-xp.png');
const STAT_STAR = require('../../assets/icons/stat-star.png');
const COIN_SRC = require('../../assets/icons/nav-shop.png');

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

export default function StatsScreen() {
  const { state } = useStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const bests = [
    { label: 'overall', value: state.bestScores.overall, src: STAT_MEDAL },
    { label: 'fluency', value: state.bestScores.fluency, src: STAT_FLUENCY },
    { label: 'vocabulary', value: state.bestScores.vocabulary, src: STAT_VOCAB },
    { label: 'pronunciation', value: state.bestScores.pronunciation, src: STAT_PRONUNCIATION },
    { label: 'grammar', value: state.bestScores.grammar, src: STAT_GRAMMAR },
  ];

  const stats = [
    { label: 'Practice\nCount', value: state.sessionCount, src: STAT_PRACTICE },
    { label: 'Total\nSpeeches', value: state.totalSpeeches, src: STAT_SPEECH },
    { label: 'Total\nWords Count', value: state.totalWords, src: STAT_WORDS },
    { label: 'Streak', value: state.streak, src: STAT_STREAK },
    { label: 'Level', value: state.level, src: STAT_LEVEL },
    { label: 'Experience\nPoints', value: state.xp, src: STAT_XP },
  ];

  const unlockedAchs = ACHIEVEMENTS.filter(a => state.unlockedAchievements.includes(a.id));
  const recentHistory = [...state.analysisHistory].reverse().slice(0, 3);
  const xpProgress = Math.max(0, Math.min(100, state.xp % 100));

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Title row */}
        <View style={s.titleRow}>
          <Text style={[s.title, FX]}>My Progress</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={s.titleStar}>
              <Image source={COIN_SRC} style={{ width: 32, height: 32 }} resizeMode="contain" />
            </View>
            <TouchableOpacity style={s.menuBtn} onPress={() => setMenuOpen(true)} activeOpacity={0.7}>
              <Text style={s.menuBtnTxt}>⋯</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings link */}
        <TouchableOpacity style={s.settingsLink} onPress={() => router.push('/settings')} activeOpacity={0.85}>
          <Text style={s.settingsLinkIcon}>⚙️</Text>
          <Text style={s.settingsLinkTxt}>設定 Settings · 🌐 語言</Text>
          <Text style={s.settingsLinkArrow}>→</Text>
        </TouchableOpacity>

        {/* XP / Level card */}
        <View style={s.xpCard}>
          <View style={s.xpRow}>
            <View style={s.levelPill}>
              <Image source={STAT_STAR} style={{ width: 60, height: 60, marginLeft: -8, marginRight: -4, marginVertical: -4 }} resizeMode="contain" />
              <Text style={[s.levelT, FX]}>Lv.{state.level}</Text>
            </View>
            <Text style={s.xpMeta}>{xpProgress}/100 XP -{'>'} LV.{state.level + 1}</Text>
          </View>
          <View style={s.xpBar}>
            <View style={[s.xpFill, { width: `${xpProgress}%` }]} />
          </View>
        </View>

        {/* Call Analyzer CTA */}
        <TouchableOpacity style={s.callCta} onPress={() => router.push('/call-analyzer')} activeOpacity={0.85}>
          <View style={s.lbCtaLeft}>
            <Text style={s.lbCtaEmoji}>🎙️</Text>
            <View>
              <Text style={[s.lbCtaTitle, { color: INK }]}>Call Analyzer</Text>
              <Text style={s.lbCtaSub}>錄低 meeting · AI 幫你分析英文</Text>
            </View>
          </View>
          <Text style={[s.lbCtaArrow, { color: PINK }]}>→</Text>
        </TouchableOpacity>

        {/* Leaderboard CTA */}
        <TouchableOpacity style={s.lbCta} onPress={() => router.push('/leaderboard')} activeOpacity={0.85}>
          <View style={s.lbCtaLeft}>
            <Text style={s.lbCtaEmoji}>🏆</Text>
            <View>
              <Text style={s.lbCtaTitle}>查看排行榜</Text>
              <Text style={s.lbCtaSub}>睇下你同其他朋友嘅排名</Text>
            </View>
          </View>
          <Text style={s.lbCtaArrow}>→</Text>
        </TouchableOpacity>

        {/* Best Scores */}
        <Text style={s.section}>Best Scores</Text>
        <View style={s.bestRow}>
          {bests.map((b, i) => (
            <View key={i} style={s.bestItem}>
              <View style={s.bestIconWrap}>
                <Image source={b.src} style={{ width: 50, height: 50 }} resizeMode="contain" />
              </View>
              <Text style={s.bestVal}>{b.value}<Text style={s.bestMax}>/100</Text></Text>
              <Text style={s.bestLab}>{b.label}</Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <Text style={s.section}>Stats</Text>
        <View style={s.statsRow}>
          {stats.slice(0, 3).map((st, i) => (
            <View key={i} style={s.statItem}>
              <View style={[s.statIconWrap, st.label === 'Total\nSpeeches' && s.statIconWrapLg]}>
                <Image source={st.src} style={{ width: st.label === 'Total\nSpeeches' ? 76 : 62, height: st.label === 'Total\nSpeeches' ? 76 : 62 }} resizeMode="contain" />
              </View>
              <Text style={s.statVal}>{st.value}</Text>
              <Text style={s.statLab}>{st.label}</Text>
            </View>
          ))}
        </View>
        <View style={s.statsRow}>
          {stats.slice(3, 6).map((st, i) => (
            <View key={i + 3} style={s.statItem}>
              <View style={[s.statIconWrap, st.label === 'Total\nSpeeches' && s.statIconWrapLg]}>
                <Image source={st.src} style={{ width: st.label === 'Total\nSpeeches' ? 76 : 62, height: st.label === 'Total\nSpeeches' ? 76 : 62 }} resizeMode="contain" />
              </View>
              <Text style={s.statVal}>{st.value}</Text>
              <Text style={s.statLab}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent */}
        <View style={s.recentHead}>
          <Text style={s.section}>Recent</Text>
          {state.analysisHistory.length > 0 && (
            <TouchableOpacity onPress={() => router.push('/history')} activeOpacity={0.85}>
              <Text style={s.viewAllTxt}>查看全部 →</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={s.recentCard}>
          {recentHistory.length === 0 ? (
            <Text style={s.recentSub}>未有練習，去 Chat tab 開始第一次啦！</Text>
          ) : (
            recentHistory.map((r, i) => (
              <Text key={i} style={s.recentSub} numberOfLines={1}>
                {r.transcript || `Score: ${r.overall.score} · ${r.overall.level}`}
              </Text>
            ))
          )}
        </View>

        {/* Achievements */}
        {unlockedAchs.length > 0 && (
          <>
            <Text style={s.section}>🏆 Achievements</Text>
            <View style={s.achGrid}>
              {unlockedAchs.map(a => (
                <View key={a.id} style={s.achUnlocked}>
                  <Text style={s.achIcon}>{a.icon}</Text>
                  <Text style={s.achName} numberOfLines={1}>{a.name}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <OverflowMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const SIDE_PAD = 20;
const CARD_GAP = 10;
const STAT_W = ((W - SIDE_PAD * 2) - CARD_GAP * 2) / 3;
const BEST_W = (W - SIDE_PAD * 2 - CARD_GAP * 4) / 5;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  content: { paddingTop: 60, paddingHorizontal: SIDE_PAD, paddingBottom: 20 },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 8,
  },
  title: {
    fontSize: 30,
    color: PINK,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  settingsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f5e8de',
  },
  settingsLinkIcon: { fontSize: 16, marginRight: 8 },
  settingsLinkTxt: { flex: 1, fontSize: 12, color: SUBINK, fontWeight: '700' },
  settingsLinkArrow: { fontSize: 14, color: PINK, fontWeight: '800' },
  titleStar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  menuBtnTxt: { fontSize: 22, color: INK, fontWeight: '800', lineHeight: 24 },

  // XP / Level
  xpCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    backgroundColor: PINK_SOFT,
    paddingHorizontal: 4,
    paddingVertical: 0,
    borderRadius: 10,
  },
  levelStar: { fontSize: 14 },
  levelT: { fontSize: 12, color: PINK },
  xpMeta: { fontSize: 12, color: SUBINK },
  xpBar: { height: 10, backgroundColor: PINK_SOFT, borderRadius: 5, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: PINK, borderRadius: 5 },

  // Sections
  section: {
    fontSize: 18,
    color: PINK,
    marginBottom: 12,
    marginTop: 4,
    fontWeight: '800',
  },

  // Best scores
  bestRow: { flexDirection: 'row', gap: CARD_GAP, marginBottom: 24 },

  // Leaderboard CTA
  callCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12,
    borderWidth: 1.5, borderColor: PINK,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  lbCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PINK,
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
  },
  lbCtaLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lbCtaEmoji: { fontSize: 32 },
  lbCtaTitle: { fontSize: 15, color: '#fff', fontWeight: '800', marginBottom: 2 },
  lbCtaSub: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  lbCtaArrow: { fontSize: 20, color: '#fff', fontWeight: '800' },
  bestItem: {
    width: BEST_W,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  bestIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'transparent',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  bestIcon: { fontSize: 18 },
  bestVal: { fontSize: 16, color: INK, fontWeight: '800' },
  bestMax: { fontSize: 10, color: MUTED, fontWeight: '500' },
  bestLab: { fontSize: 9, color: MUTED, textAlign: 'center', marginTop: 2 },

  // Stats
  statsRow: { flexDirection: 'row', gap: CARD_GAP, marginBottom: 10 },
  statItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  statIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  statIconWrapLg: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'transparent',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  statIcon: { fontSize: 20 },
  statVal: { fontSize: 18, color: INK, fontWeight: '800', marginBottom: 2 },
  statLab: { fontSize: 9, color: MUTED, textAlign: 'center', lineHeight: 11, fontWeight: '500', minHeight: 22 },

  // Recent
  recentCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  recentHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 4 },
  viewAllTxt: { fontSize: 12, color: PINK, fontWeight: '800' },
  recentLine: { fontSize: 13, color: INK, fontWeight: '700', marginBottom: 8, lineHeight: 19 },
  recentSub: { fontSize: 12, color: SUBINK, lineHeight: 18, marginBottom: 4, fontWeight: '500' },

  // Achievements
  achGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  achUnlocked: {
    width: (W - SIDE_PAD * 2 - 24) / 4,
    backgroundColor: '#fffde8',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1, borderColor: '#f5e6b8',
  },
  achIcon: { fontSize: 24 },
  achName: { fontSize: 9, fontWeight: '600', color: INK, textAlign: 'center', marginTop: 4 },
});
