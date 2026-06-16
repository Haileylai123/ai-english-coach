import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ALL_SKITS, Skit } from '../services/game-data';
import { SCENARIOS } from '../services/scenarios';
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

const DIFF_COLOR: Record<string, string> = {
  beginner: '#7ec48b',
  intermediate: '#f0a96e',
  advanced: '#a888e0',
};

const DIFF_LABEL: Record<string, string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '高級',
};

export default function SkitsScreen() {
  const router = useRouter();
  const [active, setActive] = useState<Skit | null>(null);
  const [userRole, setUserRole] = useState<'A' | 'B' | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [playedLines, setPlayedLines] = useState<Set<number>>(new Set());

  useEffect(() => {
    return () => {
      try { Speech.stop(); } catch {}
    };
  }, []);

  const speak = (text: string, lineIdx: number) => {
    try {
      Speech.stop();
      setSpeaking(true);
      Speech.speak(text, {
        language: 'en',
        rate: 0.9,
        onDone: () => {
          setSpeaking(false);
          setPlayedLines(prev => new Set(prev).add(lineIdx));
        },
        onError: () => setSpeaking(false),
      });
    } catch (e) {
      setSpeaking(false);
    }
  };

  const speakFullSkit = () => {
    if (!active) return;
    try { Speech.stop(); } catch {}
    setSpeaking(true);
    let i = 0;
    const next = () => {
      if (i >= active.lines.length) {
        setSpeaking(false);
        return;
      }
      const line = active.lines[i];
      Speech.speak(line.text, {
        language: 'en',
        rate: 0.9,
        onDone: () => {
          setPlayedLines(prev => new Set(prev).add(i));
          i++;
          setTimeout(next, 400);
        },
        onError: () => { setSpeaking(false); },
      });
    };
    next();
  };

  const stop = () => {
    try { Speech.stop(); } catch {}
    setSpeaking(false);
  };

  // Skit list view
  if (!active) {
    return (
      <View style={s.root}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <Text style={s.backTxt}>← 返回</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <Text style={[s.title, FX]}>短劇</Text>
          <Text style={s.subtitle}>Role-play Skits</Text>

          <Text style={s.desc}>揀一個場景，揀一個角色，跟住大聲讀出嚟</Text>

          {ALL_SKITS.map(skit => {
            const scene = SCENARIOS[skit.scene as keyof typeof SCENARIOS];
            return (
              <TouchableOpacity
                key={skit.id}
                style={s.skitCard}
                onPress={() => { setActive(skit); setUserRole(null); setPlayedLines(new Set()); }}
                activeOpacity={0.85}
              >
                <View style={s.skitHead}>
                  <View style={s.skitIconBox}>
                    <Text style={s.skitIconTxt}>{skit.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={s.skitTitleRow}>
                      <Text style={[s.skitTitle, FB]}>{skit.title}</Text>
                      <View style={[s.diffPill, { backgroundColor: DIFF_COLOR[skit.difficulty] + '22' }]}>
                        <Text style={[s.diffTxt, { color: DIFF_COLOR[skit.difficulty] }]}>{DIFF_LABEL[skit.difficulty]}</Text>
                      </View>
                    </View>
                    <Text style={s.skitMeta}>
                      {scene?.nameEn || skit.scene} · {skit.lines.length} 句 · {skit.roles.A.name} + {skit.roles.B.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 80 }} />
        </ScrollView>
      </View>
    );
  }

  // Active skit view
  return (
    <View style={s.root}>
      <TouchableOpacity style={s.backBtn} onPress={() => { stop(); setActive(null); }} activeOpacity={0.85}>
        <Text style={s.backTxt}>← 返回</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.skitHero}>
          <Text style={s.heroIcon}>{active.icon}</Text>
          <Text style={[s.heroTitle, FX]}>{active.title}</Text>
          <View style={s.heroMetaRow}>
            <View style={[s.diffPill, { backgroundColor: DIFF_COLOR[active.difficulty] + '22' }]}>
              <Text style={[s.diffTxt, { color: DIFF_COLOR[active.difficulty] }]}>{DIFF_LABEL[active.difficulty]}</Text>
            </View>
          </View>
        </View>

        {/* Role selector */}
        <Text style={s.section}>揀你嘅角色</Text>
        <View style={s.roleRow}>
          <TouchableOpacity
            style={[s.roleCard, userRole === 'A' && s.roleCardOnA]}
            onPress={() => setUserRole('A')}
            activeOpacity={0.85}
          >
            <Text style={s.roleIcon}>{active.roles.A.icon}</Text>
            <Text style={[s.roleName, FB]}>{active.roles.A.name}</Text>
            {userRole === 'A' && <Text style={s.roleOn}>已選</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.roleCard, userRole === 'B' && s.roleCardOnB]}
            onPress={() => setUserRole('B')}
            activeOpacity={0.85}
          >
            <Text style={s.roleIcon}>{active.roles.B.icon}</Text>
            <Text style={[s.roleName, FB]}>{active.roles.B.name}</Text>
            {userRole === 'B' && <Text style={s.roleOn}>已選</Text>}
          </TouchableOpacity>
        </View>

        {/* Controls */}
        <View style={s.controlsRow}>
          <TouchableOpacity
            style={[s.ctrlBtn, speaking && s.ctrlBtnOn]}
            onPress={speaking ? stop : speakFullSkit}
            activeOpacity={0.85}
          >
            <Text style={s.ctrlBtnTxt}>{speaking ? '⏸ 停止' : '▶️ 全部播一次'}</Text>
          </TouchableOpacity>
        </View>

        {/* Lines */}
        <Text style={s.section}>對話 Lines</Text>
        {active.lines.map((line, i) => {
          const isA = line.role === 'A';
          const roleName = isA ? active.roles.A : active.roles.B;
          const roleIcon = isA ? active.roles.A.icon : active.roles.B.icon;
          const isUser = userRole === line.role;
          const played = playedLines.has(i);
          return (
            <TouchableOpacity
              key={i}
              style={[
                s.lineRow,
                isA ? s.lineRowA : s.lineRowB,
                isUser && s.lineRowUser,
              ]}
              onPress={() => speak(line.text, i)}
              activeOpacity={0.85}
            >
              <View style={s.lineAvatar}>
                <Text style={s.lineAvatarTxt}>{roleIcon}</Text>
              </View>
              <View style={[s.lineBubble, isUser && s.lineBubbleUser]}>
                <View style={s.lineNameRow}>
                  <Text style={s.lineName}>{roleName.name}</Text>
                  {isUser && <View style={s.youTag}><Text style={s.youTagTxt}>你</Text></View>}
                  {played && <Text style={s.playedTag}>✓</Text>}
                </View>
                <Text style={[s.lineTxt, isUser && s.lineTxtUser]}>{line.text}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Vocab */}
        {active.vocab && active.vocab.length > 0 && (
          <>
            <Text style={s.section}>📚 詞彙 Vocab</Text>
            <View style={s.vocabBox}>
              {active.vocab.map((v, i) => (
                <View key={i} style={s.vocabRow}>
                  <Text style={s.vocabEn}>{v.en}</Text>
                  <Text style={s.vocabZh}>{v.zh}</Text>
                </View>
              ))}
            </View>
          </>
        )}

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

  title: {
    fontSize: 30, color: PINK, textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13, color: MUTED, textAlign: 'center',
    marginBottom: 8, fontWeight: '600',
  },
  desc: {
    fontSize: 13, color: SUBINK, textAlign: 'center',
    marginBottom: 18, fontWeight: '500', lineHeight: 19,
  },
  section: {
    fontSize: 16, color: PINK, marginBottom: 10, marginTop: 8, fontWeight: '800',
  },

  // Skit card
  skitCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  skitHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  skitIconBox: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: PINK_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  skitIconTxt: { fontSize: 28 },
  skitTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' },
  skitTitle: { fontSize: 15, color: INK },
  diffPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  diffTxt: { fontSize: 10, fontWeight: '800' },
  skitMeta: { fontSize: 11, color: SUBINK, fontWeight: '500' },

  // Active skit
  skitHero: { alignItems: 'center', marginBottom: 16 },
  heroIcon: { fontSize: 50, marginBottom: 8 },
  heroTitle: { fontSize: 22, color: INK, textAlign: 'center', marginBottom: 8 },
  heroMetaRow: { flexDirection: 'row', gap: 6 },

  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  roleCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f0e0d0',
  },
  roleCardOnA: { borderColor: '#7e8cc4', backgroundColor: '#f1f3fb' },
  roleCardOnB: { borderColor: PINK, backgroundColor: PINK_SOFT },
  roleIcon: { fontSize: 32, marginBottom: 4 },
  roleName: { fontSize: 14, color: INK },
  roleOn: { fontSize: 10, color: PINK, fontWeight: '800', marginTop: 4 },

  controlsRow: { marginBottom: 14 },
  ctrlBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PINK,
  },
  ctrlBtnOn: { backgroundColor: PINK_SOFT },
  ctrlBtnTxt: { color: PINK, fontSize: 14, fontWeight: '800' },

  // Lines
  lineRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  lineRowA: { justifyContent: 'flex-start' },
  lineRowB: { justifyContent: 'flex-end' },
  lineRowUser: { opacity: 1 },
  lineAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#f0e0d0',
  },
  lineAvatarTxt: { fontSize: 20 },
  lineBubble: {
    maxWidth: '78%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 6,
    borderTopLeftRadius: 4,
  },
  lineBubbleUser: { backgroundColor: PINK_SOFT, borderTopLeftRadius: 16, borderTopRightRadius: 4 },
  lineNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 },
  lineName: { fontSize: 11, color: MUTED, fontWeight: '700' },
  youTag: { backgroundColor: PINK, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 5 },
  youTagTxt: { fontSize: 9, color: '#fff', fontWeight: '800' },
  playedTag: { fontSize: 10, color: '#7ec48b', fontWeight: '800' },
  lineTxt: { fontSize: 13, color: INK, lineHeight: 19, fontWeight: '500' },
  lineTxtUser: { color: INK },

  // Vocab
  vocabBox: { backgroundColor: '#fff', borderRadius: 14, padding: 12 },
  vocabRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f5e8de' },
  vocabEn: { fontSize: 13, color: INK, fontWeight: '700' },
  vocabZh: { fontSize: 13, color: PINK, fontWeight: '700' },
});
