import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions, Alert, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../services/store';
import {
  WORD_BANK, FILL_SENTENCES, ALL_SKITS, shuffle,
  WordPair, FillSentence, Skit,
} from '../../services/game-data';

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

const QUIZ_SRC = require('../../assets/icons/game-quickquiz.png');
const MATCH_SRC = require('../../assets/icons/game-wordmatch.png');
const SCRAMBLE_SRC = require('../../assets/icons/game-wordscramble-v2.png');
const SPEED_SRC = require('../../assets/icons/game-speedchallenge.png');
const FILL_SRC = require('../../assets/icons/game-fillblank.png');

const GAME_ICONS: Record<GameType, any> = {
  match: MATCH_SRC,
  fill: FILL_SRC,
  scramble: SCRAMBLE_SRC,
  quickfire: SPEED_SRC,
  skits: QUIZ_SRC,
  menu: QUIZ_SRC,
};

const GAME_LABELS: Record<string, string> = {
  match: 'Word Match',
  fill: 'Fill in the blank',
  scramble: 'Word Scramble',
  quickfire: 'Speed Challenge',
  skits: 'Quick Quiz',
  menu: 'Menu',
};

type GameType = 'menu' | 'match' | 'fill' | 'scramble' | 'quickfire' | 'skits';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export default function GamesScreen() {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const [game, setGame] = useState<GameType>('menu');
  const [diff, setDiff] = useState<Difficulty>('beginner');

  // Match game state
  const [matchCards, setMatchCards] = useState<any[]>([]);
  const [matchSelected, setMatchSelected] = useState<any[]>([]);
  const [matchMatched, setMatchMatched] = useState<Set<string>>(new Set());
  const [matchScore, setMatchScore] = useState(0);
  const [matchAttempts, setMatchAttempts] = useState(0);

  // Fill game state
  const [fillRounds, setFillRounds] = useState<FillSentence[]>([]);
  const [fillIdx, setFillIdx] = useState(0);
  const [fillScore, setFillScore] = useState(0);
  const [fillFeedback, setFillFeedback] = useState('');

  // Scramble state
  const [scrambleWords, setScrambleWords] = useState<{ word: string; answer: string; hint: string }[]>([]);
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambleScore, setScrambleScore] = useState(0);
  const [scrambleInput, setScrambleInput] = useState('');
  const [scrambleFB, setScrambleFB] = useState('');

  // Quick Fire state
  const [qfRounds, setQfRounds] = useState<{ prompt: string; answer: string; dir: string }[]>([]);
  const [qfIdx, setQfIdx] = useState(0);
  const [qfScore, setQfScore] = useState(0);
  const [qfInput, setQfInput] = useState('');
  const [qfFB, setQfFB] = useState('');

  // Skits state
  const [skitList, setSkitList] = useState<Skit[]>(ALL_SKITS);
  const [activeSkit, setActiveSkit] = useState<Skit | null>(null);
  const [skitLine, setSkitLine] = useState(0);
  const [skitDone, setSkitDone] = useState(false);
  const [skitScore, setSkitScore] = useState(0);

  const startGame = (g: GameType) => {
    setGame(g);
    if (g === 'match') startMatch();
    else if (g === 'fill') startFill();
    else if (g === 'scramble') startScramble();
    else if (g === 'quickfire') startQuickFire();
    else if (g === 'skits') { setSkitList(ALL_SKITS); setActiveSkit(null); }
  };

  // --- Match Game ---
  const startMatch = () => {
    const bank = WORD_BANK[diff] || WORD_BANK.beginner;
    const pool = shuffle(bank).slice(0, 6);
    const cards: any[] = [];
    pool.forEach(p => {
      cards.push({ id: 'en_' + p.en, text: p.en, type: 'en', key: p.en });
      cards.push({ id: 'zh_' + p.en, text: p.zh, type: 'zh', key: p.en });
    });
    setMatchCards(shuffle(cards)); setMatchSelected([]); setMatchMatched(new Set());
    setMatchScore(0); setMatchAttempts(0);
  };

  const tapMatchCard = (card: any) => {
    if (matchMatched.has(card.id) || matchSelected.length >= 2) return;
    const sel = [...matchSelected, card];
    setMatchSelected(sel);
    if (sel.length === 2) {
      setMatchAttempts(a => a + 1);
      const [a, b] = sel;
      if (a.type !== b.type && a.key === b.key) {
        setMatchMatched(prev => {
          const next = new Set([...prev, a.id, b.id]);
          if (next.size >= matchCards.length) {
            setMatchScore(s => {
              dispatch({ type: 'ADD_XP', payload: s + 10 });
              return s + 10;
            });
          }
          return next;
        });
        setMatchScore(s => s + 10);
        setMatchSelected([]);
      } else {
        setTimeout(() => setMatchSelected([]), 600);
      }
    }
  };

  // --- Fill Game ---
  const startFill = () => {
    const pool = shuffle(FILL_SENTENCES).slice(0, 5);
    setFillRounds(pool); setFillIdx(0); setFillScore(0); setFillFeedback('');
  };
  const tapFillOption = (opt: string) => {
    const r = fillRounds[fillIdx];
    if (!r) return;
    const ok = opt === r.blank;
    if (ok) setFillScore(s => s + 10);
    setFillFeedback(ok ? '✅ 正確！' : `❌ 答案：${r.blank}`);
    setTimeout(() => {
      if (fillIdx >= fillRounds.length - 1) {
        dispatch({ type: 'ADD_XP', payload: fillScore + (ok ? 10 : 0) });
        Alert.alert('遊戲結束！', `得分: ${fillScore + (ok ? 10 : 0)}`);
        setGame('menu');
      } else {
        setFillIdx(i => i + 1); setFillFeedback('');
      }
    }, 1000);
  };

  // --- Scramble ---
  const startScramble = () => {
    const bank = WORD_BANK[diff] || WORD_BANK.beginner;
    const pool = shuffle(bank).slice(0, 6);
    const words = pool.map(p => ({ word: scramble(p.en), answer: p.en, hint: p.zh }));
    setScrambleWords(words); setScrambleIdx(0); setScrambleScore(0); setScrambleInput(''); setScrambleFB('');
  };
  const checkScramble = () => {
    const w = scrambleWords[scrambleIdx];
    if (!w) return;
    const ok = scrambleInput.toLowerCase().trim() === w.answer;
    const delta = ok ? 15 : -5;
    setScrambleScore(s => s + delta);
    setScrambleFB(ok ? '✅ 正確！' : `❌ 答案：${w.answer}`);
    setTimeout(() => {
      if (scrambleIdx >= scrambleWords.length - 1) {
        setScrambleScore(final => {
          dispatch({ type: 'ADD_XP', payload: final + delta });
          Alert.alert('遊戲結束！', `得分: ${final + delta}`);
          return final;
        });
        setGame('menu');
      } else {
        setScrambleIdx(i => i + 1); setScrambleInput(''); setScrambleFB('');
      }
    }, 1200);
  };

  // --- Quick Fire ---
  const startQuickFire = () => {
    const bank = WORD_BANK[diff] || WORD_BANK.beginner;
    const pool = shuffle(bank).slice(0, 8);
    const rounds = pool.map(p => {
      const enFirst = Math.random() > 0.5;
      return { prompt: enFirst ? p.en : p.zh, answer: enFirst ? p.zh : p.en, dir: enFirst ? 'en→zh' : 'zh→en' };
    });
    setQfRounds(rounds); setQfIdx(0); setQfScore(0); setQfInput(''); setQfFB('');
  };
  const checkQuickFire = () => {
    const r = qfRounds[qfIdx];
    if (!r) return;
    const ok = qfInput.toLowerCase().trim() === r.answer.toLowerCase().trim();
    const delta = ok ? 10 : 0;
    if (ok) setQfScore(s => s + delta);
    setQfFB(ok ? '✅ 正確！' : `❌ 答案：${r.answer}`);
    setTimeout(() => {
      if (qfIdx >= qfRounds.length - 1) {
        setQfScore(final => {
          dispatch({ type: 'ADD_XP', payload: final + delta });
          Alert.alert('遊戲結束！', `得分: ${final + delta}`);
          return final;
        });
        setGame('menu');
      } else {
        setQfIdx(i => i + 1); setQfInput(''); setQfFB('');
      }
    }, 1200);
  };

  // --- Skits ---
  const startSkit = (skit: Skit) => {
    setActiveSkit(skit); setSkitLine(0); setSkitDone(false); setSkitScore(0);
  };
  const nextSkitLine = () => {
    if (!activeSkit) return;
    if (skitLine >= activeSkit.lines.length - 1) {
      setSkitDone(true);
      setSkitScore(activeSkit.lines.filter(l => l.role === 'B').length * 10);
      dispatch({ type: 'ADD_XP', payload: activeSkit.lines.filter(l => l.role === 'B').length * 10 });
    } else {
      setSkitLine(l => l + 1);
    }
  };

  const back = () => setGame('menu');

  return (
    <View style={st.root}>
      <ScrollView contentContainerStyle={st.body}>
        <View style={st.hRow}>
          <Text style={st.hEmoji}>📚</Text>
          <Text style={[st.h, FX]}>Learning center</Text>
        </View>

        {game === 'menu' && (
          <>
            {/* Skits entry */}
            <TouchableOpacity
              style={[st.card, { backgroundColor: PINK_SOFT, borderWidth: 1.5, borderColor: PINK }]}
              onPress={() => router.push('/skits')}
              activeOpacity={0.85}
            >
              <View style={st.gIconWrap}>
                <Text style={{ fontSize: 40 }}>🎭</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[st.gName, { color: PINK }]}>短劇 Skits</Text>
                <Text style={st.gDesc}>揀角色，跟住讀 · 5 個場景</Text>
              </View>
              <Text style={{ fontSize: 18, color: PINK }}>→</Text>
            </TouchableOpacity>

            {([
              { src: QUIZ_SRC, name: 'Quick Quiz', desc: '', g: 'skits' as GameType },
              { src: MATCH_SRC, name: 'Word Match', desc: '', g: 'match' as GameType },
              { src: SCRAMBLE_SRC, name: 'Word Scramble', desc: '', g: 'scramble' as GameType },
              { src: SPEED_SRC, name: 'Speed Challenge', desc: '', g: 'quickfire' as GameType },
              { src: FILL_SRC, name: 'Fill in the blank', desc: '', g: 'fill' as GameType },
            ]).map((g, i) => (
              <TouchableOpacity key={i} style={st.card} onPress={() => startGame(g.g)}>
                <View style={st.gIconWrap}>
                  <Image source={g.src} style={{ width: 72, height: 72 }} resizeMode="contain" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[st.gName, FB]}>{g.name}</Text>
                </View>
                <Text style={st.gArrow}>›</Text>
              </TouchableOpacity>
            ))}

            {/* Difficulty selector */}
            <View style={st.diffCard}>
              <Text style={[st.diffLabel, F]}>難度 Difficulty</Text>
              <View style={st.diffRow}>
                {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(d => (
                  <TouchableOpacity key={d} style={[st.diffBtn, diff === d && st.diffBtnOn]} onPress={() => setDiff(d)}>
                    <Text style={[st.diffT, FB, diff === d && st.diffTOn]}>
                      {d === 'beginner' ? '⭐ 初級' : d === 'intermediate' ? '⭐⭐ 中級' : '⭐⭐⭐ 高級'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Match Game */}
        {game === 'match' && (
          <View>
            <View style={st.gameHead}>
              <TouchableOpacity onPress={back}><Text style={[st.back, FB]}>← 返回</Text></TouchableOpacity>
              <Text style={[st.gameTitle, FB]}>🔤 Word Match</Text>
              <Text style={[st.gameMeta, F]}>{matchMatched.size / 2}/6 · ⭐{matchScore}</Text>
            </View>
            <View style={st.matchGrid}>
              {matchCards.map(card => {
                const selected = matchSelected.some(s => s.id === card.id);
                const matched = matchMatched.has(card.id);
                return (
                  <TouchableOpacity
                    key={card.id}
                    style={[st.mCard, matched && st.mCardDone, selected && st.mCardSel, card.type === 'en' && st.mCardEn]}
                    onPress={() => tapMatchCard(card)}
                    disabled={matched}
                  >
                    <Text style={[st.mText, FB, card.type === 'en' && st.mTextEn]}>{card.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Fill Game */}
        {game === 'fill' && fillRounds.length > 0 && (
          <View>
            <View style={st.gameHead}>
              <TouchableOpacity onPress={back}><Text style={[st.back, FB]}>← 返回</Text></TouchableOpacity>
              <Text style={[st.gameTitle, FB]}>✏️ Fill Blank</Text>
              <Text style={[st.gameMeta, F]}>{fillIdx + 1}/{fillRounds.length} · ⭐{fillScore}</Text>
            </View>
            <View style={st.fillCard}>
              <Text style={[st.fillS, FB]}>{fillRounds[fillIdx].en.replace('___', '_____')}</Text>
              <Text style={[st.fillHint, F]}>{fillRounds[fillIdx].zh}</Text>
            </View>
            <View style={st.optGrid}>
              {fillRounds[fillIdx].opts.map((opt, i) => (
                <TouchableOpacity key={i} style={st.optBtn} onPress={() => tapFillOption(opt)} disabled={!!fillFeedback}>
                  <Text style={[st.optT, FB]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {fillFeedback ? <Text style={[st.fb, F, fillFeedback.startsWith('✅') ? st.fbGood : st.fbBad]}>{fillFeedback}</Text> : null}
          </View>
        )}

        {/* Scramble */}
        {game === 'scramble' && scrambleWords.length > 0 && (
          <View>
            <View style={st.gameHead}>
              <TouchableOpacity onPress={back}><Text style={[st.back, FB]}>← 返回</Text></TouchableOpacity>
              <Text style={[st.gameTitle, FB]}>🧩 Scramble</Text>
              <Text style={[st.gameMeta, F]}>{scrambleIdx + 1}/{scrambleWords.length} · ⭐{scrambleScore}</Text>
            </View>
            <View style={st.fillCard}>
              <Text style={[st.scrambleWord, FX]}>{scrambleWords[scrambleIdx].word}</Text>
              <Text style={[st.fillHint, F]}>提示: {scrambleWords[scrambleIdx].hint}</Text>
            </View>
            <TextInput style={[st.input, F]} value={scrambleInput} onChangeText={setScrambleInput}
              placeholder="輸入正確單詞..." placeholderTextColor="#c0b0a0" autoCapitalize="none" />
            <TouchableOpacity style={st.checkBtn} onPress={checkScramble} disabled={!!scrambleFB}>
              <Text style={[st.checkT, FB]}>確認 Check</Text>
            </TouchableOpacity>
            {scrambleFB ? <Text style={[st.fb, F, scrambleFB.startsWith('✅') ? st.fbGood : st.fbBad]}>{scrambleFB}</Text> : null}
          </View>
        )}

        {/* Quick Fire */}
        {game === 'quickfire' && qfRounds.length > 0 && (
          <View>
            <View style={st.gameHead}>
              <TouchableOpacity onPress={back}><Text style={[st.back, FB]}>← 返回</Text></TouchableOpacity>
              <Text style={[st.gameTitle, FB]}>⚡ Quick Fire</Text>
              <Text style={[st.gameMeta, F]}>{qfIdx + 1}/{qfRounds.length} · ⭐{qfScore}</Text>
            </View>
            <View style={st.fillCard}>
              <Text style={[st.qfDir, F]}>{qfRounds[qfIdx].dir === 'en→zh' ? '🔤 翻譯成中文' : '🇨🇳 翻譯成英文'}</Text>
              <Text style={[st.qfPrompt, FX]}>{qfRounds[qfIdx].prompt}</Text>
            </View>
            <TextInput style={[st.input, F]} value={qfInput} onChangeText={setQfInput}
              placeholder="輸入翻譯..." placeholderTextColor="#c0b0a0" autoCapitalize="none" />
            <TouchableOpacity style={st.checkBtn} onPress={checkQuickFire} disabled={!!qfFB}>
              <Text style={[st.checkT, FB]}>確認 Check</Text>
            </TouchableOpacity>
            {qfFB ? <Text style={[st.fb, F, qfFB.startsWith('✅') ? st.fbGood : st.fbBad]}>{qfFB}</Text> : null}
          </View>
        )}

        {/* Skits */}
        {game === 'skits' && (
          <View>
            <View style={st.gameHead}>
              <TouchableOpacity onPress={back}><Text style={[st.back, FB]}>← 返回</Text></TouchableOpacity>
              <Text style={[st.gameTitle, FB]}>🎭 Skits</Text>
            </View>
            {!activeSkit ? (
              skitList.map((skit, i) => (
                <TouchableOpacity key={i} style={st.skitCard} onPress={() => startSkit(skit)}>
                  <Text style={st.skitIcon}>{skit.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[st.skitName, FB]}>{skit.title}</Text>
                    <Text style={[st.skitMeta, F]}>{skit.roles.A.name} & {skit.roles.B.name} · {skit.difficulty}</Text>
                  </View>
                  <Text style={st.gArrow}>▶</Text>
                </TouchableOpacity>
              ))
            ) : skitDone ? (
              <View style={st.skitDone}>
                <Text style={st.skitDoneIcon}>🎉</Text>
                <Text style={[st.skitDoneT, FB]}>劇本完成！</Text>
                <Text style={[st.skitDoneS, F]}>得分: {skitScore}</Text>
                <Text style={[st.skitVocab, F]}>📚 詞彙: {activeSkit.vocab.map(v => `${v.en}(${v.zh})`).join(', ')}</Text>
                <TouchableOpacity style={st.checkBtn} onPress={() => { setActiveSkit(null); setSkitDone(false); }}>
                  <Text style={[st.checkT, FB]}>🔄 再玩一次</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View style={st.skitRole}>
                  <Text style={st.skitRoleIcon}>{activeSkit.lines[skitLine].role === 'A' ? activeSkit.roles.A.icon : activeSkit.roles.B.icon}</Text>
                  <Text style={[st.skitRoleName, FB]}>
                    {activeSkit.lines[skitLine].role === 'A' ? activeSkit.roles.A.name : activeSkit.roles.B.name}
                  </Text>
                  <Text style={[st.skitRoleTag, F]}>{activeSkit.lines[skitLine].role === 'A' ? 'AI' : 'YOU'}</Text>
                </View>
                <View style={st.skitBubble}>
                  <Text style={[st.skitText, F]}>{activeSkit.lines[skitLine].text}</Text>
                </View>
                <Text style={[st.skitProgress, F]}>{skitLine + 1} / {activeSkit.lines.length}</Text>
                <TouchableOpacity style={st.checkBtn} onPress={nextSkitLine}>
                  <Text style={[st.checkT, FB]}>{activeSkit.lines[skitLine].role === 'B' ? '🙋 我讀完了 I read it' : '▶ 下一句 Next'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function scramble(w: string): string {
  const c = w.split('');
  for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
  const r = c.join('');
  return r === w ? w.split('').reverse().join('') : r;
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff8f4' },
  body: { padding: 16, paddingTop: 60 },
  h: { fontSize: 26, color: '#3d3028', textAlign: 'left' },
  hRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  hEmoji: { fontSize: 26 },
  sub: { fontSize: 13, color: '#b8a89a', textAlign: 'center', marginTop: 4, marginBottom: 18 },

  // Menu
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  gIconWrap: { width: 88, height: 88, borderRadius: 18, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  gIcon: { fontSize: 36 },
  gName: { fontSize: 16, color: '#3d3028' },
  gDesc: { fontSize: 12, color: '#b8a89a', marginTop: 4 },
  gArrow: { fontSize: 22, color: '#e8927f', fontWeight: '700' },

  // Difficulty
  diffCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginTop: 8 },
  diffLabel: { fontSize: 14, color: '#3d3028', marginBottom: 10 },
  diffRow: { flexDirection: 'row', gap: 8 },
  diffBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fdf5ec', alignItems: 'center' },
  diffBtnOn: { backgroundColor: '#e8845c' },
  diffT: { fontSize: 12, color: '#8b7a6e' },
  diffTOn: { color: '#fff' },

  // Game header
  gameHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  back: { fontSize: 14, color: '#e8845c' },
  gameTitle: { fontSize: 18, color: '#3d3028', flex: 1 },
  gameMeta: { fontSize: 13, color: '#b8a89a' },

  // Match
  matchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mCard: { width: (W - 48) / 3 - 5, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 14, alignItems: 'center', borderWidth: 2, borderColor: '#f0e0d0' },
  mCardEn: { backgroundColor: '#fdf5ec', borderColor: '#f0dcc0' },
  mCardSel: { borderColor: '#e8845c', backgroundColor: '#fff0e8' },
  mCardDone: { opacity: 0.3 },
  mText: { fontSize: 14, color: '#5c4a3a' },
  mTextEn: { fontSize: 16 },

  // Fill
  fillCard: { backgroundColor: '#fff', borderRadius: 18, padding: 24, alignItems: 'center', marginBottom: 14 },
  fillS: { fontSize: 20, color: '#3d3028', lineHeight: 30, textAlign: 'center' },
  fillHint: { fontSize: 13, color: '#b8a89a', marginTop: 8 },
  scrambleWord: { fontSize: 32, color: '#3d3028', letterSpacing: 6 },
  qfDir: { fontSize: 12, color: '#b8a89a', marginBottom: 8 },
  qfPrompt: { fontSize: 28, color: '#3d3028' },
  optGrid: { gap: 6 },
  optBtn: { backgroundColor: '#fff', paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#f0e0d0' },
  optT: { fontSize: 16, color: '#5c4a3a' },

  // Input
  input: { backgroundColor: '#fff', borderRadius: 14, padding: 16, fontSize: 18, color: '#3d3028', marginTop: 12, borderWidth: 1, borderColor: '#f0e0d0' },
  checkBtn: { backgroundColor: '#e8845c', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  checkT: { color: '#fff', fontSize: 16 },

  // Feedback
  fb: { fontSize: 16, textAlign: 'center', marginTop: 12, fontWeight: '700' as any },
  fbGood: { color: '#4caf50' },
  fbBad: { color: '#ff4444' },

  // Skits
  skitCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 8, gap: 12 },
  skitIcon: { fontSize: 32 },
  skitName: { fontSize: 15, color: '#3d3028' },
  skitMeta: { fontSize: 11, color: '#b8a89a', marginTop: 4 },
  skitRole: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  skitRoleIcon: { fontSize: 28 },
  skitRoleName: { fontSize: 16, color: '#3d3028' },
  skitRoleTag: { fontSize: 11, color: '#e8845c', backgroundColor: '#fff0e8', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  skitBubble: { backgroundColor: '#fff', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#f0e0d0' },
  skitText: { fontSize: 16, color: '#3d3028', lineHeight: 26 },
  skitProgress: { fontSize: 12, color: '#b8a89a', textAlign: 'center', marginTop: 8 },
  skitDone: { alignItems: 'center', paddingVertical: 20 },
  skitDoneIcon: { fontSize: 64 },
  skitDoneT: { fontSize: 22, color: '#3d3028', marginTop: 8 },
  skitDoneS: { fontSize: 16, color: '#8b7a6e', marginTop: 4 },
  skitVocab: { fontSize: 13, color: '#b8a89a', marginTop: 8, textAlign: 'center' },
});
