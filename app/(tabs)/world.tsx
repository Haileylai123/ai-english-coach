import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Animated, Easing, TextInput, Alert, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../services/store';
import { useI18n } from '../../services/i18n';
import { ACHIEVEMENTS } from '../../services/emotions';
import { FURNITURE_SPECS, FurnitureSlot, itemsForSlot, slotPickerTitle } from '../../services/furniture';
import OverflowMenu from '../../components/OverflowMenu';

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
const BG_GARDEN_SRC = require('../../assets/icons/bg-garden.png');
const BG_COZY_SRC = require('../../assets/icons/bg-cozy.png');
const BG_BEACH_SRC = require('../../assets/icons/bg-beach.png');
const BG_FOREST_SRC = require('../../assets/icons/bg-forest.png');
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

const BG_COLORS: Record<string, { bg: string; wall: string; floor: string; name: string }> = {
  default: { bg: '#ffe4d6', wall: '#ffd0b8', floor: '#ffb89a', name: 'Default Room' },
  garden:  { bg: '#e8f5e9', wall: '#c8e6c9', floor: '#a5d6a7', name: 'Garden' },
  cozy:    { bg: '#fff3e0', wall: '#ffe0b2', floor: '#ffcc80', name: 'Cozy Room' },
  beach:   { bg: '#e0f7fa', wall: '#b2ebf2', floor: '#ffe082', name: 'Beach' },
  forest:  { bg: '#e8f5e9', wall: '#a5d6a7', floor: '#795548', name: 'Forest' },
};

const BG_IMG: Record<string, any> = {
  default: PET_ROOM_SRC,    // original pinkish room
  garden:  BG_GARDEN_SRC,
  cozy:    BG_COZY_SRC,
  beach:   BG_BEACH_SRC,
  forest:  BG_FOREST_SRC,
};

const FURN_IMG: Record<string, any> = {
  'ball': require('../../assets/icons/fur-ball-v2.png'),
  'bowl': require('../../assets/icons/fur-bowl-v2.png'),
  'rug': require('../../assets/icons/fur-rug-v2.png'),
  'plant': require('../../assets/icons/fur-plant.png'),
  'bed': require('../../assets/icons/fur-bed-v2.png'),
  'bed-orig': require('../../assets/icons/fur-smallbed.png'),
  'tree': require('../../assets/icons/fur-cattree-v2.png'),
  'bookshelf': require('../../assets/icons/fur-bookshelf-v2.png'),
};

type Tab = 'pets' | 'trophies' | 'history';

export default function WorldScreen() {
  const { state, dispatch } = useStore();
  const router = useRouter();
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('pets');
  const [showPets, setShowPets] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(state.petName);
  const [menuOpen, setMenuOpen] = useState(false);
  // Which slot is the user currently picking an item for? null = closed
  const [slotPickerFor, setSlotPickerFor] = useState<FurnitureSlot | null>(null);

  // Pet decay every 60s
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'PET_DECAY' });
    }, 60000);
    return () => clearInterval(id);
  }, [dispatch]);

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
  const bg = BG_COLORS[state.petBackground || 'default'];

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

  // Pet sits 4px above the bed (when bed is placed), otherwise on the floor
  const bedItemId = state.petRoom.bed;
  const bedSpec = bedItemId ? FURNITURE_SPECS[bedItemId] : null;
  const bedFit = bedSpec
    ? Math.min(bedSpec.height * (SLOT_SCALE.bed ?? 1), SLOT_MAX.bed.h)
    : 0;
  const petBottom = bedSpec ? 14 + bedFit + 4 : 60;

  return (
    <View style={st.root}>
      {/* Title row */}
      <View style={st.titleRow}>
        <Text style={[st.title, FX]}>My Pet World</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={st.coinChip}>
            <Image source={COIN_SRC} style={{ width: 18, height: 18 }} resizeMode="contain" />
            <Text style={[st.coinVal, FB]}>{state.petCoins}</Text>
          </View>
          <TouchableOpacity style={st.menuBtn} onPress={() => setMenuOpen(true)} activeOpacity={0.7}>
            <Text style={st.menuBtnTxt}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab switcher */}
      <View style={st.tabSwitcher}>
        {(['pets', 'trophies', 'history'] as Tab[]).map(tk => (
          <TouchableOpacity
            key={tk}
            style={[st.tabBtn, tab === tk && st.tabBtnOn]}
            onPress={() => setTab(tk)}
            activeOpacity={0.85}
          >
            <Text style={[st.tabBtnTxt, tab === tk && st.tabBtnTxtOn, FB]}>
              {tk === 'pets' ? 'Pets' : tk === 'trophies' ? 'Trophies' : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={st.body} showsVerticalScrollIndicator={false}>
        {tab === 'pets' && (
          <>
            {/* Pet house background — driven by state.petBackground */}
            <View style={st.house}>
              <Image
                source={BG_IMG[state.petBackground || 'default'] || PET_ROOM_SRC}
                style={st.roomImg}
                resizeMode="cover"
              />
              <View style={st.brightOverlay} />
              <Animated.View style={[st.petInHouse, { bottom: petBottom, transform: [{ translateY: floatY }] }]}>
                {PET_IMG[pet.id] ? (
                  <Image source={PET_IMG[pet.id]} style={st.petImg} resizeMode="contain" />
                ) : (
                  <Text style={st.petEmoji}>{pet.icon}</Text>
                )}
                {state.petOutfit && <Text style={st.outfit}>{OUTFITS[state.petOutfit]}</Text>}
              </Animated.View>
              <View style={st.furnLayer} pointerEvents="box-none">
                {/* Slot: floor (full-width rug) — rendered first so bed sits on top */}
                <RoomSlot slotId="floor" onPick={(id) => setSlotPickerFor(id)} />
                {/* Slot: bed (big bottom-center, sits on top of rug) */}
                <RoomSlot slotId="bed" onPick={(id) => setSlotPickerFor(id)} />
                {/* Slot: table (mid-height surface) */}
                <RoomSlot slotId="table" onPick={(id) => setSlotPickerFor(id)} />
                {/* Four corner slots — user picks which corner */}
                <RoomSlot slotId="topLeft" onPick={(id) => setSlotPickerFor(id)} />
                <RoomSlot slotId="topRight" onPick={(id) => setSlotPickerFor(id)} />
                <RoomSlot slotId="bottomLeft" onPick={(id) => setSlotPickerFor(id)} />
                <RoomSlot slotId="bottomRight" onPick={(id) => setSlotPickerFor(id)} />
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
                    placeholder="Pet name"
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
              <ActionBtn label="Feed" img={FEED_BOWL_SRC} sub="+Hunger" onPress={() => dispatch({ type: 'FEED_PET' })} />
              <ActionBtn label="Play" img={PLAY_YARN_SRC} sub="+Love" onPress={() => dispatch({ type: 'PLAY_PET' })} />
              <ActionBtn label="Sleep" img={SLEEP_BED_SRC} sub="+Energy" onPress={() => dispatch({ type: 'SLEEP_PET' })} />
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
            <Text style={[st.secTitle, FB]}>Trophies · 成就</Text>
            {ACHIEVEMENTS.map(a => {
              const unlocked = state.unlockedAchievements.includes(a.id);
              return (
                <View key={a.id} style={st.trophyRow}>
                  <Text style={st.trophyIcon}>{unlocked ? a.icon : '🔒'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[st.trophyText, F, !unlocked && st.trophyLocked]}>{a.name}</Text>
                    <Text style={[st.trophyDesc, F, !unlocked && st.trophyLocked]}>{a.desc}</Text>
                  </View>
                </View>
              );
            })}
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

      <OverflowMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Room slot picker sheet */}
      <Modal visible={!!slotPickerFor} transparent animationType="slide" onRequestClose={() => setSlotPickerFor(null)} statusBarTranslucent>
        <Pressable style={st.slotSheetBackdrop} onPress={() => setSlotPickerFor(null)}>
          <Pressable style={st.slotSheet} onPress={(e) => e.stopPropagation()}>
            <View style={st.slotSheetHandle} />
            <View style={st.slotSheetHeader}>
              <View>
                <Text style={[st.slotSheetTitle, FB]}>
                  {slotPickerFor && slotPickerTitle(slotPickerFor)}
                </Text>
                <Text style={st.slotSheetSub}>撳下面揀一件 · 或揀「清空」</Text>
              </View>
              <TouchableOpacity onPress={() => setSlotPickerFor(null)} style={st.slotSheetClose} activeOpacity={0.7}>
                <Text style={st.slotSheetCloseTxt}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flexGrow: 0 }}>
              {/* Empty option — clear slot */}
              <TouchableOpacity
                style={[st.slotOption, st.slotOptionEmpty]}
                onPress={() => {
                  if (slotPickerFor) dispatch({ type: 'CLEAR_ROOM_SLOT', payload: slotPickerFor });
                  setSlotPickerFor(null);
                }}
                activeOpacity={0.85}
              >
                <View style={[st.slotOptionImg, { backgroundColor: '#f5e8de' }]}>
                  <Text style={{ fontSize: 22 }}>🗑️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[st.slotOptionEmptyTxt, FB]}>清空</Text>
                  <Text style={st.slotOptionNameEn}>Empty slot</Text>
                </View>
              </TouchableOpacity>

              {/* Items for this slot (owned only) */}
              {slotPickerFor && itemsForSlot(slotPickerFor).map(itemId => {
                const owned = state.ownedItems.includes(itemId);
                const spec = FURNITURE_SPECS[itemId];
                return (
                  <TouchableOpacity
                    key={itemId}
                    style={st.slotOption}
                    onPress={() => {
                      if (!owned) {
                        Alert.alert('未擁有', '去 Shop 免費拎呢件啦！');
                        return;
                      }
                      dispatch({ type: 'PLACE_ROOM_ITEM', payload: { slot: slotPickerFor, itemId } });
                      setSlotPickerFor(null);
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={st.slotOptionImg}>
                      {FURN_IMG[itemId] ? (
                        <Image source={FURN_IMG[itemId]} style={st.slotOptionImgInner} resizeMode="contain" />
                      ) : (
                        <Text style={{ fontSize: 22 }}>{spec?.emoji || '📦'}</Text>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[st.slotOptionName, FB]}>
                        {itemId} {owned ? '' : '🔒'}
                      </Text>
                      <Text style={st.slotOptionNameEn}>
                        {owned ? '已擁有 · 撳即擺' : '未擁有 · 去 Shop 拎'}
                      </Text>
                    </View>
                    {owned && state.petRoom[slotPickerFor] === itemId && (
                      <Text style={{ color: '#7ec48b', fontWeight: '800' }}>✓ 用緊</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
              <View style={{ height: 16 }} />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/** Auto-scale items to fit the slot they ended up in */
const SLOT_SCALE: Record<string, number> = {
  bed: 1.0,        // bed slot is big, render at full size
  floor: 1.0,      // floor is widest, full size
  table: 0.8,      // table mid-height, slight down-scale
  topLeft: 0.65, topRight: 0.65,
  bottomLeft: 0.65, bottomRight: 0.65,
};
const SLOT_MAX: Record<string, { w: number; h: number }> = {
  bed:         { w: 320, h: 175 },
  floor:       { w: 320, h: 95 },
  table:       { w: 64,  h: 72 },
  topLeft:     { w: 50,  h: 50 },
  topRight:    { w: 50,  h: 50 },
  bottomLeft:  { w: 50,  h: 50 },
  bottomRight: { w: 50,  h: 50 },
};

/** Renders one room slot at fixed position. Tap empty → open picker; tap filled → also open picker (swap). */
function RoomSlot({ slotId, onPick }: { slotId: FurnitureSlot; onPick: (id: FurnitureSlot) => void }) {
  const { state } = useStore();
  const itemId = state.petRoom[slotId];
  const spec = itemId ? FURNITURE_SPECS[itemId] : null;

  const slotStyle =
    slotId === 'bed' ? st.slotBed :
    slotId === 'floor' ? st.slotFloor :
    slotId === 'table' ? st.slotTable :
    slotId === 'topLeft' ? st.slotTopLeft :
    slotId === 'topRight' ? st.slotTopRight :
    slotId === 'bottomLeft' ? st.slotBottomLeft :
    st.slotBottomRight;

  if (!itemId) {
    const { w, h } = SLOT_MAX[slotId] || { w: 44, h: 44 };
    return (
      <TouchableOpacity
        style={[st.roomSlot, slotStyle, st.slotEmpty, { width: w, height: h, borderRadius: 10 }]}
        onPress={() => onPick(slotId)}
        activeOpacity={0.7}
      >
        <Text style={st.slotEmptyPlus}>+</Text>
      </TouchableOpacity>
    );
  }

  // Filled slot — auto-fit item into slot's max size
  const scale = SLOT_SCALE[slotId] ?? 1;
  const max = SLOT_MAX[slotId] || { w: 50, h: 50 };
  const naturalW = spec?.width || 40;
  const naturalH = spec?.height || 40;
  const fitW = Math.min(naturalW * scale, max.w);
  const fitH = Math.min(naturalH * scale, max.h);

  return (
    <TouchableOpacity
      style={[st.roomSlot, slotStyle, { width: max.w, height: max.h }]}
      onPress={() => onPick(slotId)}
      activeOpacity={0.85}
    >
      {FURN_IMG[itemId] ? (
        <Image
          source={FURN_IMG[itemId]}
          style={{ width: fitW, height: fitH }}
          resizeMode="contain"
        />
      ) : (
        <Text style={{ fontSize: 24 }}>{spec?.emoji || '📦'}</Text>
      )}
    </TouchableOpacity>
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

function ActionBtn({ label, img, sub, onPress }: { label: string; img?: any; sub: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={st.actionBtn} onPress={onPress} activeOpacity={0.85}>
      {img ? <Image source={img} style={st.actionImg} resizeMode="contain" /> : <Text style={st.actionEmoji}>🎯</Text>}
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
  menuBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  menuBtnTxt: { fontSize: 22, color: INK, fontWeight: '800', lineHeight: 24 },
  body: { paddingHorizontal: SIDE_PAD, paddingBottom: 20 },

  // House / pet area
  house: {
    width: '100%', height: 270, borderRadius: 22, overflow: 'hidden',
    backgroundColor: '#ffe4d6', marginBottom: 14, position: 'relative',
  },
  roomImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  brightOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.35)' },
  petInHouse: { position: 'absolute', bottom: 60, left: 0, right: 0, alignItems: 'center' },
  petImg: { width: 96, height: 96 },
  petEmoji: { fontSize: 64 },
  outfit: { fontSize: 22, position: 'absolute', top: -14, right: -28 },
  furnLayer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },

  // Room slot system
  roomSlot: {
    position: 'absolute',
    alignItems: 'center', justifyContent: 'center',
  },
  slotBed:         { bottom: 14, left: 0, right: 0, alignItems: 'center' },
  slotFloor:       { bottom: 0, left: 6, right: 6, alignItems: 'center', justifyContent: 'flex-end' },
  slotTable:       { bottom: 60, left: 0, right: 0, alignItems: 'center' },
  slotTopLeft:     { top: 8, left: 12 },
  slotTopRight:    { top: 8, right: 12 },
  slotBottomLeft:  { bottom: 14, left: 14 },
  slotBottomRight: { bottom: 14, right: 14 },
  slotEmpty: {
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.55)', borderStyle: 'dashed',
    borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)',
  },
  slotEmptyPlus: { fontSize: 20, color: 'rgba(255,255,255,0.8)', fontWeight: '800' },

  // Slot picker sheet (bottom)
  slotSheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  slotSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 10, paddingBottom: 30, maxHeight: '70%',
  },
  slotSheetHandle: { width: 42, height: 5, borderRadius: 3, backgroundColor: MUTED, alignSelf: 'center', marginTop: 6, marginBottom: 6 },
  slotSheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  slotSheetTitle: { fontSize: 17, color: INK },
  slotSheetSub: { fontSize: 12, color: MUTED, fontWeight: '600', marginTop: 2 },
  slotSheetClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center' },
  slotSheetCloseTxt: { fontSize: 14, color: PINK, fontWeight: '800' },
  slotOption: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 12, marginHorizontal: 12, borderRadius: 14, marginBottom: 6, backgroundColor: '#fdf2ec' },
  slotOptionEmpty: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#f5e8de' },
  slotOptionImg: { width: 44, height: 44, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  slotOptionImgInner: { width: 38, height: 38 },
  slotOptionName: { fontSize: 14, color: INK },
  slotOptionNameEn: { fontSize: 11, color: MUTED, fontWeight: '600', marginTop: 1 },
  slotOptionEmptyTxt: { fontSize: 13, color: SUBINK, fontWeight: '600' },

  furn: { position: 'absolute', fontSize: 18, opacity: 0.85 },
  furnImg: { position: 'absolute', width: 36, height: 36 },

  // Tab switcher
  tabSwitcher: {
    flexDirection: 'row',
    marginHorizontal: SIDE_PAD,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabBtnOn: { backgroundColor: PINK },
  tabBtnTxt: { fontSize: 12, color: SUBINK },
  tabBtnTxtOn: { color: '#fff' },

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
  trophyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f5e8de' },
  trophyIcon: { fontSize: 24 },
  trophyText: { fontSize: 13, color: INK, fontWeight: '700', marginBottom: 2 },
  trophyDesc: { fontSize: 11, color: SUBINK },
  trophyLocked: { color: '#ccc' },

  // History
  histCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16 },
  empty: { fontSize: 13, color: MUTED, textAlign: 'center', paddingVertical: 20 },
  histRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f8f0ea' },
  histScore: { fontSize: 18, color: PINK, width: 36 },
  histText: { fontSize: 13, color: INK },
  histMeta: { fontSize: 10, color: MUTED, marginTop: 2 },
});
