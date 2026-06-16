import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Animated, Easing, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../services/store';

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

const COIN_SRC = require('../../assets/icons/nav-shop.png');
const PET_ROOM_SRC = require('../../assets/icons/pet-room.png');
const PET_CAT_SRC = require('../../assets/icons/pet-cat.png');
const PET_PENGUIN_SRC = require('../../assets/icons/pet-penguin.png');
const PET_FOX_SRC = require('../../assets/icons/pet-fox.png');
const PET_DOG_SRC = require('../../assets/icons/pet-dog.png');
const PET_RABBIT_SRC = require('../../assets/icons/pet-rabbit.png');
const PET_HAMSTER_SRC = require('../../assets/icons/pet-hamster.png');

const FEED_BOWL_SRC = require('../../assets/icons/feed-bowl.png');
const PLAY_YARN_SRC = require('../../assets/icons/play-yarn.png');
const SLEEP_BED_SRC = require('../../assets/icons/sleep-bed.png');

const PET_IMG: Record<string, any> = {
  cat: PET_CAT_SRC,
  penguin: PET_PENGUIN_SRC,
  fox: PET_FOX_SRC,
  dog: PET_DOG_SRC,
  rabbit: PET_RABBIT_SRC,
  hamster: PET_HAMSTER_SRC,
};

const PETS = [
  { id: 'cat', icon: '🐱', name: '小貓', nameEn: 'Cat', defaultName: 'Mimi', price: 0 },
  { id: 'dog', icon: '🐕', name: '小狗', nameEn: 'Dog', defaultName: 'Buddy', price: 2500 },
  { id: 'rabbit', icon: '🐰', name: '小兔', nameEn: 'Rabbit', defaultName: 'Bunny', price: 2500 },
  { id: 'hamster', icon: '🐹', name: '倉鼠', nameEn: 'Hamster', defaultName: 'Nibbles', price: 6000 },
  { id: 'fox', icon: '🦊', name: '狐狸', nameEn: 'Fox', defaultName: 'Foxy', price: 4000 },
  { id: 'penguin', icon: '🐧', name: '企鵝', nameEn: 'Penguin', defaultName: 'Pingu', price: 4000 },
];

const OUTFITS: Record<string, string> = {
  'bow-tie': '🎀', 'scarf': '🧣', 'flower-crown': '🌸',
  'hat': '🎩', 'glasses': '👓', 'collar': '🔔',
  'backpack': '🎒', 'crown': '👑',
};

const BG_COLORS: Record<string, { bg: string; wall: string; floor: string; icon: string; name: string }> = {
  garden: { bg: '#e8f5e9', wall: '#c8e6c9', floor: '#a5d6a7', icon: '🌻', name: '花園 Garden' },
  cozy: { bg: '#fff3e0', wall: '#ffe0b2', floor: '#ffcc80', icon: '🏠', name: '溫馨小屋 Cozy Room' },
  beach: { bg: '#e0f7fa', wall: '#b2ebf2', floor: '#ffe082', icon: '🏖️', name: '海灘 Beach' },
  forest: { bg: '#e8f5e9', wall: '#a5d6a7', floor: '#795548', icon: '🌲', name: '森林 Forest' },
  space: { bg: '#1a1a2e', wall: '#16213e', floor: '#0f3460', icon: '🌌', name: '太空 Space' },
};

const FURN_MAP: Record<string, string> = {
  'ball': '⚽', 'bowl': '🥣', 'rug': '🟫', 'plant': '🪴', 'bed': '🛏️', 'tree': '🌳', 'bookshelf': '📚',
};

type Tab = 'pets' | 'trophies' | 'history';

export default function WorldScreen() {
  const { state, dispatch } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('pets');
  const [showPets, setShowPets] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(state.petName);

  // Floating animation for the cat
  const floatY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const bob = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -8, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    bob.start();
    return () => bob.stop();
  }, [floatY]);

  const pet = PETS.find(p => p.id === state.activePet) || PETS[0];
  const bg = BG_COLORS[state.petBackground || 'garden'];

  const commitName = () => {
    const next = nameDraft.trim();
    if (next && next !== state.petName) {
      dispatch({ type: 'SET_PET_NAME', payload: next });
    } else {
      setNameDraft(state.petName);
    }
    setEditingName(false);
  };

  const selectPet = (petId: string) => {
    const p = PETS.find(pp => pp.id === petId);
    if (!p) return;
    if (!state.ownedPets.includes(petId) && p.price > 0) {
      if (state.petCoins >= p.price) {
        dispatch({ type: 'SELECT_PET', payload: petId });
        dispatch({ type: 'BUY_ITEM', payload: { id: petId, cost: p.price } });
      }
    } else {
      dispatch({ type: 'SELECT_PET', payload: petId });
    }
  };

  const hungerPercent = state.petHunger;
  const intimacyPercent = state.petIntimacy;
  const energy = Math.min(100, Math.max(20, 100 - hungerPercent + 20));
  const happy = Math.min(100, Math.round((hungerPercent + intimacyPercent) / 2));

  const mood = intimacyPercent >= 80 ? { emoji: '😻', label: '開心 Happy' }
    : intimacyPercent >= 50 ? { emoji: '😸', label: '滿足 Content' }
    : hungerPercent < 30 ? { emoji: '😿', label: '肚餓 Hungry' }
    : { emoji: '🐱', label: '期待 Waiting' };

  const recentHistory = [...state.analysisHistory].reverse().slice(0, 5);

  return (
    <View style={st.root}>
      {/* Title row */}
      <View style={st.titleRow}>
        <Text style={[st.title, FX]}>My Pet World</Text>
        <View style={st.coinChip}>
          <Image source={COIN_SRC} style={{ width: 18, height: 18 }} resizeMode="contain" />
          <Text style={[st.coinVal, FB]}>{state.petCoins}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={st.body} showsVerticalScrollIndicator={false}>
        {tab === 'pets' && (
          <>
            {/* Pet house background */}
            <View style={st.house}>
              <Image source={PET_ROOM_SRC} style={st.roomImg} resizeMode="cover" />
              <View style={st.brightOverlay} />
              <Animated.View style={[st.petInHouse, { transform: [{ translateY: floatY }] }]}>
                {PET_IMG[pet.id] ? (
                  <Image source={PET_IMG[pet.id]} style={st.petImg} resizeMode="contain" />
                ) : (
                  <Text style={st.petEmoji}>{pet.icon}</Text>
                )}
                {state.petOutfit && <Text style={st.outfit}>{OUTFITS[state.petOutfit]}</Text>}
              </Animated.View>
              <View style={st.furnLayer}>
                {state.petFurniture.slice(0, 3).map((f, i) => (
                  <Text key={i} style={[st.furn, { left: 12 + i * 38, bottom: 8 }]}>{FURN_MAP[f] || '✨'}</Text>
                ))}
              </View>
            </View>

            {/* Pet name + mood */}
            <View style={st.nameRow}>
              <View style={{ flex: 1 }}>
                {editingName ? (
                  <TextInput
                    value={nameDraft}
                    onChangeText={setNameDraft}
                    onSubmitEditing={commitName}
                    onBlur={commitName}
                    autoFocus
                    maxLength={16}
                    style={[st.petNameInput, FX]}
                    placeholder={state.petName}
                    placeholderTextColor={MUTED}
                  />
                ) : (
                  <TouchableOpacity onPress={() => { setNameDraft(state.petName); setEditingName(true); }} activeOpacity={0.7}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[st.petName, FX]}>{state.petName}</Text>
                      <Text style={st.editIcon}>✏️</Text>
                    </View>
                  </TouchableOpacity>
                )}
                <Text style={[st.petSpecies, F]}>{pet.name} · {pet.nameEn}</Text>
              </View>
              <View style={st.moodPill}>
                <Text style={st.moodEmoji}>{mood.emoji}</Text>
                <Text style={[st.moodT, FB]}>{mood.label}</Text>
              </View>
            </View>

            {/* Status bars (4 bars as in design) */}
            <View style={st.barsCard}>
              <StatBar label="Health" value={Math.min(100, hungerPercent + 30)} color="#ff8a80" />
              <StatBar label="Energy" value={energy} color="#ffc107" />
              <StatBar label="Happiness" value={happy} color="#9ccc65" />
              <StatBar label="Love" value={intimacyPercent} color="#b39ddb" />
            </View>

            {/* Action buttons (3 buttons) */}
            <View style={st.actionsRow}>
              <ActionBtn label="Feed" img={FEED_BOWL_SRC} sub="+Hunger" onPress={() => dispatch({ type: 'ADD_PET_COINS', payload: -1 })} />
              <ActionBtn label="Play" img={PLAY_YARN_SRC} sub="+Happy" onPress={() => dispatch({ type: 'ADD_PET_COINS', payload: -1 })} />
              <ActionBtn label="Sleep" img={SLEEP_BED_SRC} sub="+Energy" onPress={() => dispatch({ type: 'ADD_PET_COINS', payload: -1 })} />
            </View>

            {/* Pet selector toggle */}
            <TouchableOpacity style={st.selectBtn} onPress={() => setShowPets(!showPets)}>
              <Text style={[st.selectT, FB]}>{showPets ? '▲ 收起' : '▼ 切換寵物 Choose Pet'}</Text>
            </TouchableOpacity>

            {showPets && (
              <View style={st.petGrid}>
                {PETS.map(p => {
                  const owned = state.ownedPets.includes(p.id) || p.price === 0;
                  const active = state.activePet === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[st.petCard, active && st.petCardOn, !owned && st.petCardOff]}
                      onPress={() => selectPet(p.id)}
                    >
                      {PET_IMG[p.id] ? (
                        <Image
                          source={PET_IMG[p.id]}
                          style={[st.petCardIconImg, p.id === 'hamster' && { width: 24, height: 24 }]}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={st.petCardIcon}>{p.icon}</Text>
                      )}
                      <Text style={[st.petCardName, F]}>{p.name}</Text>
                      {!owned ? <Text style={[st.petPrice, F]}>💰{p.price}</Text>
                        : <Text style={[st.petOwned, F]}>{active ? '✅ 使用中' : '擁有'}</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <View style={st.coinBar}>
              <Image source={COIN_SRC} style={{ width: 22, height: 22 }} resizeMode="contain" />
              <Text style={[st.coinVal, FB]}>{state.petCoins}</Text>
              <Text style={[st.coinLab, F]}>寵物金幣 · 每次練習賺取</Text>
            </View>

            {/* Shop button */}
            <TouchableOpacity style={st.shopBtn} onPress={() => router.push('/shop')} activeOpacity={0.85}>
              <View style={st.shopBtnLeft}>
                <View style={st.shopBtnIconWrap}>
                  <Image source={COIN_SRC} style={st.shopBtnIcon} resizeMode="contain" />
                </View>
                <View>
                  <Text style={[st.shopBtnTitle, FB]}>去商店</Text>
                  <Text style={[st.shopBtnSub, F]}>買衫、家具、背景</Text>
                </View>
              </View>
              <Text style={st.shopBtnArrow}>→</Text>
            </TouchableOpacity>
          </>
        )}

        {tab === 'trophies' && (
          <View style={st.trophyCard}>
            <Text style={[st.secTitle, FB]}>🏆 成就徽章</Text>
            {['🌸 初次開口', '💪 十句達人', '💼 商務精英', '🎯 雅思達人', '💬 聊天高手', '📚 詞彙大師', '💨 流利達人', '🔊 發音之星', '🔥 三天連續', '🌟 七日王者'].map((a, i) => (
              <View key={i} style={st.trophyRow}>
                <Text style={st.trophyIcon}>{state.unlockedAchievements.length > i ? '🏆' : '🔒'}</Text>
                <Text style={[st.trophyText, F, state.unlockedAchievements.length <= i && st.trophyLocked]}>{a}</Text>
              </View>
            ))}
          </View>
        )}

        {tab === 'history' && (
          <View style={st.histCard}>
            <Text style={[st.secTitle, FB]}>📋 最近練習紀錄</Text>
            {recentHistory.length === 0 ? (
              <Text style={[st.empty, F]}>尚無紀錄，去 Chat 練習吧！</Text>
            ) : (
              recentHistory.map((r, i) => (
                <View key={i} style={st.histRow}>
                  <Text style={[st.histScore, FB]}>{r.overall.score}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[st.histText, F]} numberOfLines={1}>{r.transcript || '(no text)'}</Text>
                    <Text style={[st.histMeta, F]}>{r.overall.level} · {r.vocabulary.uniqueWords} unique words</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={st.statRow}>
      <Text style={[st.statLab, FB]}>{label}</Text>
      <View style={st.barBg}>
        <View style={[st.barFill, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }]} />
      </View>
      <Text style={[st.statVal, FB]}>{value}%</Text>
    </View>
  );
}

function ActionBtn({ label, img, sub, onPress }: { label: string; img?: any; emoji?: string; sub: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={st.actionBtn} onPress={onPress} activeOpacity={0.85}>
      {img ? <Image source={img} style={st.actionImg} resizeMode="contain" /> : <Text style={st.actionEmoji}>{emoji}</Text>}
      <Text style={[st.actionLab, FB]}>{label}</Text>
      <Text style={[st.actionSub, F]}>{sub}</Text>
    </TouchableOpacity>
  );
}

const SIDE_PAD = 20;
const ACT_W = (W - SIDE_PAD * 2 - 8 * 2) / 3;

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  titleRow: {
    paddingTop: 60,
    paddingHorizontal: SIDE_PAD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: { fontSize: 24, color: PINK, lineHeight: 28 },
  coinChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14,
  },
  coinVal: { fontSize: 14, color: INK },
  body: { paddingHorizontal: SIDE_PAD, paddingBottom: 20 },

  // House / pet area
  house: {
    width: '100%', height: 258, borderRadius: 22, overflow: 'hidden',
    backgroundColor: '#ffe4d6', marginBottom: 14, position: 'relative',
  },
  roomImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  brightOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.35)' },
  petInHouse: { position: 'absolute', bottom: 28, left: 0, right: 0, alignItems: 'center' },
  petImg: { width: 100, height: 100 },
  petEmoji: { fontSize: 64 },
  outfit: { fontSize: 22, position: 'absolute', top: -14, right: -28 },
  furnLayer: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 40 },
  furn: { position: 'absolute', fontSize: 18, opacity: 0.85 },

  // Name + mood
  nameRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 14,
  },
  petName: { fontSize: 22, color: INK },
  petNameInput: { fontSize: 22, color: INK, padding: 0, minWidth: 100, borderBottomWidth: 1, borderColor: PINK },
  editIcon: { fontSize: 14, opacity: 0.55 },
  petSpecies: { fontSize: 12, color: SUBINK, marginTop: 2 },
  moodPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: PINK_SOFT, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14,
  },
  moodEmoji: { fontSize: 16 },
  moodT: { fontSize: 12, color: PINK },

  // Status bars
  barsCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 14,
  },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  statLab: { fontSize: 12, color: INK, width: 78 },
  barBg: { flex: 1, height: 10, backgroundColor: PINK_SOFT, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  statVal: { fontSize: 12, color: INK, width: 44, textAlign: 'right' },

  // Action buttons
  actionsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  actionBtn: {
    width: ACT_W, backgroundColor: '#fff', borderRadius: 18, padding: 12,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  actionEmoji: { fontSize: 30, marginBottom: 4 },
  actionImg: { width: 54, height: 54, marginBottom: 4 },
  actionLab: { fontSize: 14, color: INK },
  actionSub: { fontSize: 10, color: MUTED, marginTop: 2 },

  // Pet selector
  selectBtn: { backgroundColor: '#fff', borderRadius: 14, padding: 12, alignItems: 'center' },
  selectT: { fontSize: 13, color: INK },
  petGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  petCard: { width: (W - 48) / 3 - 5, backgroundColor: '#fff', borderRadius: 14, padding: 10, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  petCardOn: { borderColor: PINK, backgroundColor: PINK_SOFT },
  petCardOff: { opacity: 0.6 },
  petCardIcon: { fontSize: 36 },
  petCardIconImg: { width: 32, height: 32, marginBottom: 2 },
  petCardName: { fontSize: 11, color: INK, marginTop: 4 },
  petPrice: { fontSize: 10, color: PINK, marginTop: 2 },
  petOwned: { fontSize: 9, color: '#4caf50', marginTop: 2 },

  coinBar: {
    backgroundColor: '#fffde8', borderRadius: 14, padding: 12, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10,
  },
  coinLab: { fontSize: 11, color: MUTED },

  // Shop button
  shopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: PINK,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  shopBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  shopBtnIconWrap: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: PINK_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  shopBtnIcon: { width: 34, height: 34 },
  shopBtnTitle: { fontSize: 16, color: PINK, fontWeight: '800', marginBottom: 2 },
  shopBtnSub: { fontSize: 11, color: SUBINK },
  shopBtnArrow: { fontSize: 22, color: PINK, fontWeight: '800' },

  // Trophies
  trophyCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16 },
  secTitle: { fontSize: 15, color: INK, marginBottom: 12 },
  trophyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  trophyIcon: { fontSize: 18 },
  trophyText: { fontSize: 13, color: INK },
  trophyLocked: { color: '#ccc' },

  // History
  histCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16 },
  empty: { fontSize: 13, color: MUTED, textAlign: 'center', paddingVertical: 20 },
  histRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f8f0ea' },
  histScore: { fontSize: 18, color: PINK, width: 36 },
  histText: { fontSize: 13, color: INK },
  histMeta: { fontSize: 10, color: MUTED, marginTop: 2 },
});
