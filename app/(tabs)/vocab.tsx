import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { WORD_BANK } from '../../services/game-data';
import { SCENARIOS } from '../../services/scenarios';
import { useStore } from '../../services/store';
import { todayStr, isDue } from '../../services/srs';
import WordPickerModal from '../../components/WordPickerModal';

const VOCAB_ICON = require('../../assets/icons/stat-vocabulary.png');

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

type Diff = 'all' | 'beginner' | 'intermediate' | 'advanced';

const DIFF_LABEL: Record<Diff, string> = {
  all: '全部',
  beginner: '初級',
  intermediate: '中級',
  advanced: '高級',
};

const DIFF_COLOR: Record<Diff, string> = {
  all: PINK,
  beginner: '#7ec48b',
  intermediate: '#f0a96e',
  advanced: '#a888e0',
};

const DIFF_BG: Record<Diff, string> = {
  all: '#fff',
  beginner: '#e8f5e9',
  intermediate: '#fdf0e3',
  advanced: '#f1ebfb',
};

// Build a set of words the user has "encountered" via scenario keyVocab
const SCENARIO_WORDS = new Set<string>();
Object.values(SCENARIOS).forEach(sc => {
  sc.keyVocab.forEach(w => SCENARIO_WORDS.add(w.toLowerCase()));
});

export default function VocabScreen() {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const [diff, setDiff] = useState<Diff>('all');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showAdd, setShowAdd] = useState(false);

  // Count due today for review button badge
  const dueCount = useMemo(() => {
    const today = todayStr();
    let count = 0;
    state.customVocab.forEach(w => {
      const e = state.srs[w.en];
      if (!e || isDue(e, today)) count++;
    });
    Object.keys(state.srs).forEach(word => {
      if (state.customVocab.some(v => v.en === word)) return;
      if (isDue(state.srs[word], today)) count++;
    });
    return count;
  }, [state.customVocab, state.srs]);

  const toggleFav = (en: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(en)) next.delete(en);
      else next.add(en);
      return next;
    });
  };

  // Combine all words with their difficulty tag
  const allWords = useMemo(() => {
    const list: { en: string; zh: string; level: 'beginner' | 'intermediate' | 'advanced' }[] = [];
    (['beginner', 'intermediate', 'advanced'] as const).forEach(level => {
      WORD_BANK[level].forEach(w => list.push({ ...w, level }));
    });
    return list;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allWords.filter(w => {
      if (diff !== 'all' && w.level !== diff) return false;
      if (q && !w.en.toLowerCase().includes(q) && !w.zh.includes(q)) return false;
      return true;
    });
  }, [allWords, diff, query]);

  // Dictionary lookup state
  const [dictLoading, setDictLoading] = useState(false);
  const [dictResult, setDictResult] = useState<null | {
    word: string;
    phonetic?: string;
    meanings: { partOfSpeech: string; definitions: { definition: string; example?: string }[] }[];
    zh: string;
    source: 'static' | 'api';
  }>(null);
  const [dictError, setDictError] = useState<string | null>(null);

  const lookupWord = async (rawWord: string) => {
    const word = rawWord.trim().toLowerCase().replace(/[^a-z\s'-]/g, '');
    if (!word || word.length < 2) {
      setDictResult(null);
      setDictError(null);
      return;
    }
    setDictLoading(true);
    setDictError(null);
    setDictResult(null);

    try {
      // 1) Check static WORD_BANK first for Chinese
      const allBank = [
        ...WORD_BANK.beginner,
        ...WORD_BANK.intermediate,
        ...WORD_BANK.advanced,
      ];
      const bankHit = allBank.find(w => w.en.toLowerCase() === word);
      let zh = bankHit?.zh || '';

      // 2) Fetch English definitions from free dictionary API
      const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      let meanings: { partOfSpeech: string; definitions: { definition: string; example?: string }[] }[] = [];
      let phonetic: string | undefined;

      if (dictRes.ok) {
        const data = await dictRes.json();
        if (Array.isArray(data) && data[0]) {
          phonetic = data[0].phonetic || data[0].phonetics?.find((p: any) => p.text)?.text;
          for (const m of data[0].meanings || []) {
            const defs = (m.definitions || []).slice(0, 3).map((d: any) => ({
              definition: d.definition,
              example: d.example,
            }));
            if (defs.length) meanings.push({ partOfSpeech: m.partOfSpeech, definitions: defs });
          }
        }
      }

      // 3) If no Chinese in WORD_BANK, fetch from Google Translate
      if (!zh) {
        try {
          const tRes = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURIComponent(word)}`
          );
          if (tRes.ok) {
            const tData = await tRes.json();
            if (tData && tData[0] && tData[0][0] && tData[0][0][0]) {
              zh = tData[0][0][0];
            }
          }
        } catch {}
      }

      if (!meanings.length && !zh) {
        setDictError('搵唔到呢個字，可能拼錯或者字典未有');
        return;
      }
      setDictResult({
        word,
        phonetic,
        meanings,
        zh: zh || '(無中文翻譯)',
        source: bankHit ? 'static' : 'api',
      });
    } catch (e) {
      setDictError('網絡錯誤，請檢查連線');
    } finally {
      setDictLoading(false);
    }
  };

  // Debounce lookup
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setDictResult(null);
      setDictError(null);
      return;
    }
    const t = setTimeout(() => lookupWord(q), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Group by level for section display when "all" is selected
  const grouped = useMemo(() => {
    const g: Record<string, typeof filtered> = { beginner: [], intermediate: [], advanced: [] };
    filtered.forEach(w => g[w.level].push(w));
    return g;
  }, [filtered]);

  const totalCount = allWords.length;
  const seenCount = allWords.filter(w => SCENARIO_WORDS.has(w.en.toLowerCase())).length;

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={s.titleRow}>
          <View style={s.titleIcon}>
            <Image source={VOCAB_ICON} style={{ width: 32, height: 32 }} resizeMode="contain" />
          </View>
          <Text style={[s.title, FX]}>Vocabulary</Text>
        </View>

        {/* Stats summary */}
        <View style={s.summaryRow}>
          <View style={s.summaryCard}>
            <Text style={[s.summaryNum, FX]}>{state.customVocab.length}</Text>
            <Text style={s.summaryLab}>我的單詞</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={[s.summaryNum, FX, { color: PINK }]}>{seenCount}</Text>
            <Text style={s.summaryLab}>已學過</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={[s.summaryNum, FX, { color: '#f0a96e' }]}>{favorites.size}</Text>
            <Text style={s.summaryLab}>收藏</Text>
          </View>
        </View>

        {/* Add button */}
        <TouchableOpacity style={s.addBtn} onPress={() => setShowAdd(true)} activeOpacity={0.85}>
          <Text style={s.addBtnTxt}>+ 手動加生字</Text>
        </TouchableOpacity>

        {/* SRS Review button */}
        <TouchableOpacity style={s.reviewBtn} onPress={() => router.push('/srs')} activeOpacity={0.85}>
          <View style={{ flex: 1 }}>
            <Text style={s.reviewBtnTitle}>🧠 SRS 智能複習</Text>
            <Text style={s.reviewBtnSub}>{dueCount > 0 ? `${dueCount} 個生字到期` : '冇嘢要複習'}</Text>
          </View>
          {dueCount > 0 && (
            <View style={s.reviewBadge}>
              <Text style={s.reviewBadgeTxt}>{dueCount}</Text>
            </View>
          )}
          <Text style={s.reviewArrow}>→</Text>
        </TouchableOpacity>

        {/* My Words (from chat) */}
        {state.customVocab.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={[s.sectionDot, { backgroundColor: PINK }]} />
              <Text style={[s.sectionTitle, FB]}>我的單詞 My Words</Text>
              <Text style={s.sectionCount}>{state.customVocab.length} 個</Text>
            </View>
            <View style={s.wordsGrid}>
              {state.customVocab
                .filter(w => {
                  if (!query.trim()) return true;
                  const q = query.toLowerCase();
                  return w.en.toLowerCase().includes(q) || w.zh.includes(q);
                })
                .map((w, i) => (
                <View key={w.en} style={s.wordCard}>
                  <View style={s.wordTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.wordEn} numberOfLines={1}>{w.en}</Text>
                      <Text style={s.wordZh} numberOfLines={1}>{w.zh || '—'}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert('刪除單字', `確定要刪除「${w.en}」？`, [
                          { text: '取消', style: 'cancel' },
                          { text: '刪除', style: 'destructive', onPress: () => dispatch({ type: 'REMOVE_CUSTOM_VOCAB', payload: w.en }) },
                        ]);
                      }}
                      style={s.favBtn}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={s.delIcon}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  {w.context && (
                    <View style={s.ctxTag}>
                      <Text style={s.ctxTxt} numberOfLines={1}>"{w.context}"</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Search */}
        <View style={s.searchBar}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="搜尋英文或中文..."
            placeholderTextColor={MUTED}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={s.clearBtn}>
              <Text style={s.clearTxt}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Difficulty chips */}
        {(dictResult || dictLoading || dictError) && (
          <View style={s.dictCard}>
            {dictLoading && (
              <Text style={s.dictLoading}>🔍 查緊字典...</Text>
            )}
            {dictError && !dictLoading && (
              <Text style={s.dictError}>{dictError}</Text>
            )}
            {dictResult && !dictLoading && (
              <>
                <View style={s.dictHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.dictWord}>{dictResult.word}</Text>
                    {dictResult.phonetic && (
                      <Text style={s.dictPhonetic}>/{dictResult.phonetic}/</Text>
                    )}
                  </View>
                  <View style={s.dictZhBox}>
                    <Text style={s.dictZh}>{dictResult.zh}</Text>
                    <Text style={s.dictSource}>
                      {dictResult.source === 'static' ? '📚 內建' : '🌐 翻譯'}
                    </Text>
                  </View>
                </View>
                {dictResult.meanings.map((m, i) => (
                  <View key={i} style={s.dictMeaning}>
                    <Text style={s.dictPOS}>{m.partOfSpeech}</Text>
                    {m.definitions.map((d, j) => (
                      <View key={j} style={s.dictDef}>
                        <Text style={s.dictDefTxt}>{j + 1}. {d.definition}</Text>
                        {d.example && (
                          <Text style={s.dictEx}>e.g. "{d.example}"</Text>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
                <TouchableOpacity
                  style={s.dictAddBtn}
                  onPress={() => {
                    if (state.customVocab.some(v => v.en.toLowerCase() === dictResult.word)) {
                      Alert.alert('已經加咗', `「${dictResult.word}」已經喺你嘅單詞庫入面`);
                      return;
                    }
                    dispatch({
                      type: 'ADD_CUSTOM_VOCAB',
                      payload: { en: dictResult.word, zh: dictResult.zh, source: 'manual' },
                    });
                    Alert.alert('已加入！⭐', `「${dictResult.word}」已加入單詞庫`);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={s.dictAddBtnTxt}>⭐ 加到我嘅單詞</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        <View style={s.chipsRow}>
          {(['all', 'beginner', 'intermediate', 'advanced'] as Diff[]).map(d => (
            <TouchableOpacity
              key={d}
              style={[s.chip, diff === d && s.chipOn, diff === d && { backgroundColor: DIFF_COLOR[d] }]}
              onPress={() => setDiff(d)}
              activeOpacity={0.85}
            >
              <Text style={[s.chipTxt, diff === d && s.chipTxtOn, FB]}>{DIFF_LABEL[d]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Word list */}
        {diff === 'all' ? (
          (['beginner', 'intermediate', 'advanced'] as const).map(level => {
            const list = grouped[level];
            if (list.length === 0) return null;
            return (
              <View key={level} style={s.section}>
                <View style={s.sectionHeader}>
                  <View style={[s.sectionDot, { backgroundColor: DIFF_COLOR[level] }]} />
                  <Text style={[s.sectionTitle, FB]}>{DIFF_LABEL[level]}</Text>
                  <Text style={s.sectionCount}>{list.length} 個</Text>
                </View>
                <View style={s.wordsGrid}>
                  {list.map((w, i) => (
                    <WordCard
                      key={`${level}-${i}`}
                      en={w.en}
                      zh={w.zh}
                      seen={SCENARIO_WORDS.has(w.en.toLowerCase())}
                      fav={favorites.has(w.en)}
                      onToggleFav={() => toggleFav(w.en)}
                    />
                  ))}
                </View>
              </View>
            );
          })
        ) : (
          <View style={s.wordsGrid}>
            {filtered.map((w, i) => (
              <WordCard
                key={`${diff}-${i}`}
                en={w.en}
                zh={w.zh}
                seen={SCENARIO_WORDS.has(w.en.toLowerCase())}
                fav={favorites.has(w.en)}
                onToggleFav={() => toggleFav(w.en)}
              />
            ))}
          </View>
        )}

        {filtered.length === 0 && state.customVocab.length === 0 && (
          <View style={s.empty}>
            <Text style={s.emptyTxt}>搵唔到相關詞彙 😿</Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <WordPickerModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        context={undefined}
      />
    </View>
  );
}

function WordCard({ en, zh, seen, fav, onToggleFav }: { en: string; zh: string; seen: boolean; fav: boolean; onToggleFav: () => void }) {
  return (
    <View style={s.wordCard}>
      <View style={s.wordTop}>
        <View style={{ flex: 1 }}>
          <Text style={s.wordEn} numberOfLines={1}>{en}</Text>
          <Text style={s.wordZh} numberOfLines={1}>{zh}</Text>
        </View>
        <TouchableOpacity onPress={onToggleFav} style={s.favBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[s.favIcon, fav && s.favIconOn]}>{fav ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>
      {seen && (
        <View style={s.seenTag}>
          <Text style={s.seenTxt}>場景已用過</Text>
        </View>
      )}
    </View>
  );
}

const SIDE_PAD = 20;
const CARD_GAP = 10;
const CARD_W = (W - SIDE_PAD * 2 - CARD_GAP) / 2;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  content: { paddingTop: 60, paddingHorizontal: SIDE_PAD, paddingBottom: 20 },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 10,
  },
  titleIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: PINK_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 30, color: PINK, letterSpacing: 0.3 },

  summaryRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
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

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f5e8de',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: INK, padding: 0 },
  clearBtn: { padding: 4 },
  clearTxt: { fontSize: 14, color: MUTED, fontWeight: '700' },

  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f5e8de',
  },
  chipOn: { borderColor: 'transparent' },
  chipTxt: { fontSize: 12, color: SUBINK },
  chipTxtOn: { color: '#fff' },

  section: { marginBottom: 18 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sectionDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { fontSize: 16, color: INK },
  sectionCount: { fontSize: 12, color: MUTED, fontWeight: '600', marginLeft: 'auto' },

  wordsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP },
  wordCard: {
    width: CARD_W,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  wordTop: { flexDirection: 'row', alignItems: 'flex-start' },
  wordEn: { fontSize: 16, color: INK, fontWeight: '700', marginBottom: 2 },
  wordZh: { fontSize: 12, color: SUBINK, fontWeight: '500' },
  favBtn: { padding: 2 },
  favIcon: { fontSize: 18, color: MUTED },
  favIconOn: { color: '#f0a96e' },
  seenTag: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: PINK_SOFT,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  seenTxt: { fontSize: 9, color: PINK, fontWeight: '700' },

  empty: { paddingVertical: 40, alignItems: 'center' },
  emptyTxt: { fontSize: 14, color: MUTED, fontWeight: '600' },

  // Dictionary card
  dictCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: PINK,
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  dictLoading: { fontSize: 14, color: SUBINK, textAlign: 'center', paddingVertical: 8 },
  dictError: { fontSize: 14, color: MUTED, textAlign: 'center', paddingVertical: 8 },
  dictHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
  dictWord: { fontSize: 26, color: INK, fontWeight: '800' },
  dictPhonetic: { fontSize: 13, color: SUBINK, fontStyle: 'italic', marginTop: 2 },
  dictZhBox: { alignItems: 'flex-end' },
  dictZh: { fontSize: 18, color: PINK, fontWeight: '800' },
  dictSource: { fontSize: 9, color: MUTED, fontWeight: '600', marginTop: 2 },
  dictMeaning: { marginBottom: 10 },
  dictPOS: { fontSize: 12, color: '#a888e0', fontStyle: 'italic', fontWeight: '700', marginBottom: 4 },
  dictDef: { marginBottom: 6, paddingLeft: 8 },
  dictDefTxt: { fontSize: 13, color: INK, lineHeight: 19, fontWeight: '500' },
  dictEx: { fontSize: 12, color: SUBINK, fontStyle: 'italic', marginTop: 2, lineHeight: 17 },
  dictAddBtn: {
    backgroundColor: PINK,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  dictAddBtnTxt: { color: '#fff', fontSize: 13, fontWeight: '800' },

  addBtn: {
    backgroundColor: PINK,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  addBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },

  reviewBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12,
    borderWidth: 2, borderColor: PINK_SOFT,
  },
  reviewBtnTitle: { fontSize: 14, color: INK, fontWeight: '800' },
  reviewBtnSub: { fontSize: 12, color: MUTED, fontWeight: '600', marginTop: 2 },
  reviewBadge: {
    backgroundColor: PINK, borderRadius: 14, paddingHorizontal: 8, paddingVertical: 3,
    marginRight: 6,
  },
  reviewBadgeTxt: { color: '#fff', fontSize: 12, fontWeight: '800' },
  reviewArrow: { fontSize: 20, color: PINK, fontWeight: '800' },
  delIcon: { fontSize: 14, color: MUTED, fontWeight: '700' },
  ctxTag: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: CREAM,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    maxWidth: '100%',
  },
  ctxTxt: { fontSize: 9, color: SUBINK, fontStyle: 'italic' },
});
