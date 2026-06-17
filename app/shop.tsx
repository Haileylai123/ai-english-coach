// app/shop.tsx — Pet shop with category tabs
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Image, Modal, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../services/store';
import { FURNITURE_SPECS, FurnitureSlot, ALL_SLOTS, SLOT_LABELS } from '../services/furniture';

const PET_CAT_SRC = require('../assets/icons/pet-cat.png');
const COIN_SRC = require('../assets/icons/nav-shop.png');
const STAR_SRC = require('../assets/icons/stat-star.png');

const ICON_SRC: Record<string, any> = {
  'flower-crown': require('../assets/icons/acc-flowercrown-v2.png'),
  'crown':        require('../assets/icons/acc-crown.png'),
  'fluffy-hat':   require('../assets/icons/acc-hat-v2.png'),
  'ocean-hug':    require('../assets/icons/acc-scarf-v2.png'),
  'glasses':      require('../assets/icons/acc-glasses-v2.png'),
  'yarn-ball':    require('../assets/icons/acc-backpack-v2.png'),
  'collar':       require('../assets/icons/acc-collar-v2.png'),
  'bow-tie':      require('../assets/icons/acc-bowtie-v2.png'),
  'backpack':     require('../assets/icons/acc-backpack.png'),
  'ball':         require('../assets/icons/fur-ball-v2.png'),
  'bowl':         require('../assets/icons/fur-bowl-v2.png'),
  'rug':          require('../assets/icons/fur-rug-v2.png'),
  'plant':        require('../assets/icons/fur-plant.png'),
  'bed':          require('../assets/icons/fur-bed-v2.png'),
  'bed-orig':     require('../assets/icons/fur-smallbed.png'),
  'tree':         require('../assets/icons/fur-cattree-v2.png'),
  'bookshelf':    require('../assets/icons/fur-bookshelf-v2.png'),
  'garden':       require('../assets/icons/bg-garden.png'),
  'cozy':         require('../assets/icons/bg-cozy.png'),
  'beach':        require('../assets/icons/bg-beach.png'),
  'forest':       require('../assets/icons/bg-forest.png'),
  'default':      require('../assets/icons/pet-room.png'),
};

const { width: W } = Dimensions.get('window');
const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';
const GREEN = '#7ec48b';

type Cat = 'all' | 'clothing' | 'background' | 'furniture';

interface Item { id: string; name: string; nameEn: string; icon: string; price: number; category: 'outfit' | 'background' | 'furniture'; }

const ITEMS: Item[] = [
  // Clothing
  { id: 'flower-crown', name: '花冠',     nameEn: 'Flower Crown', icon: 'flower-crown', price: 150, category: 'outfit' },
  { id: 'crown',        name: '小皇冠',   nameEn: 'Crown',        icon: 'crown',        price: 150, category: 'outfit' },
  { id: 'fluffy-hat',   name: '毛絨帽',   nameEn: 'Fluffy Hat',   icon: 'fluffy-hat',   price: 150, category: 'outfit' },
  { id: 'ocean-hug',    name: '海洋圍巾', nameEn: 'Ocean Hug',    icon: 'ocean-hug',    price: 150, category: 'outfit' },
  { id: 'glasses',      name: '眼鏡',     nameEn: 'Glasses',      icon: 'glasses',      price: 150, category: 'outfit' },
  { id: 'yarn-ball',    name: '背包',     nameEn: 'Backpack',     icon: 'yarn-ball',    price: 150, category: 'outfit' },
  { id: 'collar',       name: '頸圈',     nameEn: 'Collar',       icon: 'collar',       price: 150, category: 'outfit' },
  { id: 'bow-tie',      name: '蝴蝶結',   nameEn: 'Bow Tie',      icon: 'bow-tie',      price: 150, category: 'outfit' },
  // Background
  { id: 'default', name: '原本房', nameEn: 'Default Room', icon: 'default', price: 0,  category: 'background' },
  { id: 'garden',  name: '花園',     nameEn: 'Garden',     icon: 'garden',  price: 150, category: 'background' },
  { id: 'cozy',    name: '溫馨小屋', nameEn: 'Cozy Room',  icon: 'cozy',    price: 150, category: 'background' },
  { id: 'beach',   name: '海灘',     nameEn: 'Beach',      icon: 'beach',   price: 150, category: 'background' },
  { id: 'forest',  name: '森林',     nameEn: 'Forest',     icon: 'forest',  price: 150, category: 'background' },
  // Furniture
  { id: 'ball',      name: '玩具球',   nameEn: 'Toy Ball',      icon: 'ball',      price: 150, category: 'furniture' },
  { id: 'bowl',      name: '食物碗',   nameEn: 'Food Bowl',     icon: 'bowl',      price: 150, category: 'furniture' },
  { id: 'rug',       name: '小地毯',   nameEn: 'Small Rug',     icon: 'rug',       price: 150, category: 'furniture' },
  { id: 'bed',       name: '貓床',     nameEn: 'Cat Bed',       icon: 'bed',       price: 150, category: 'furniture' },
  { id: 'plant',     name: '小植物',   nameEn: 'Plant',         icon: 'plant',     price: 150, category: 'furniture' },
  { id: 'tree',      name: '貓樹',     nameEn: 'Cat Tree',      icon: 'tree',      price: 150, category: 'furniture' },
  { id: 'bookshelf', name: '書櫃',     nameEn: 'Bookshelf',     icon: 'bookshelf', price: 150, category: 'furniture' },
];

const CATS: { key: Cat; label: string }[] = [
  { key: 'all',        label: 'all' },
  { key: 'clothing',   label: 'clothing' },
  { key: 'furniture',  label: 'furniture' },
  { key: 'background', label: 'background' },
];

const GAP = 8;
const CARD_W = (W - 40 - GAP) / 2; // 2-column grid

export default function ShopScreen() {
  const { state, dispatch } = useStore();
  const router = useRouter();
  const [cat, setCat] = useState<Cat>('all');
  const [justBought, setJustBought] = useState<Item | null>(null);
  // Long-press preview for backgrounds
  const [previewItem, setPreviewItem] = useState<Item | null>(null);
  // When buying furniture, ask user which slot to place it in
  const [slotPickerItem, setSlotPickerItem] = useState<Item | null>(null);
  // Confetti anim values (12 dots)
  const confetti = useRef(Array.from({ length: 14 }, () => new Animated.Value(0))).current;

  useEffect(() => {
    if (!justBought) return;
    // Reset all dots
    confetti.forEach(v => v.setValue(0));
    Animated.stagger(35,
      confetti.map(v =>
        Animated.timing(v, { toValue: 1, duration: 900, useNativeDriver: true })
      )
    ).start();
  }, [justBought]);

  const filtered = cat === 'all' ? ITEMS
    : cat === 'clothing' ? ITEMS.filter(i => i.category === 'outfit')
    : cat === 'background' ? ITEMS.filter(i => i.category === 'background')
    : ITEMS.filter(i => i.category === 'furniture');

  const handleItem = (item: Item) => {
    // Furniture: free for all! Owned → toggle. Not owned → ask user which slot to place in.
    if (item.category === 'furniture') {
      const owned = state.ownedItems.includes(item.id);
      if (owned) {
        // Already owned — toggle: if placed anywhere, remove; otherwise auto-place in first empty
        const placedSlot = (Object.keys(state.petRoom) as Array<keyof typeof state.petRoom>).find(
          s => state.petRoom[s] === item.id
        ) as FurnitureSlot | undefined;
        if (placedSlot) {
          dispatch({ type: 'CLEAR_ROOM_SLOT', payload: placedSlot });
        } else {
          const emptySlot = (Object.keys(state.petRoom) as FurnitureSlot[]).find(s => !state.petRoom[s]);
          if (emptySlot) dispatch({ type: 'PLACE_ROOM_ITEM', payload: { slot: emptySlot, itemId: item.id } });
        }
        return;
      }
      // New furniture — open slot picker sheet
      setSlotPickerItem(item);
      return;
    }

    if (state.ownedItems.includes(item.id)) {
      if (item.category === 'outfit') {
        dispatch({ type: 'EQUIP_OUTFIT', payload: state.petOutfit === item.id ? null : item.id });
      } else if (item.category === 'background') {
        dispatch({ type: 'EQUIP_BG', payload: state.petBackground === item.id ? null : item.id });
      }
      return;
    }
    // Free shop (testing): skip coin check, just mark owned + auto-equip
    dispatch({ type: 'BUY_ITEM', payload: { id: item.id, cost: 0 } });
    if (item.category === 'outfit') dispatch({ type: 'EQUIP_OUTFIT', payload: item.id });
    else if (item.category === 'background') dispatch({ type: 'EQUIP_BG', payload: item.id });
    Alert.alert('已著上身！🎉', `${item.name} ready ✨`);
  };

  const isEquipped = (item: Item) => {
    if (item.category === 'outfit') return state.petOutfit === item.id;
    if (item.category === 'background') return state.petBackground === item.id;
    // Furniture "equipped" = placed in any slot
    return (Object.keys(state.petRoom) as Array<keyof typeof state.petRoom>)
      .some(s => state.petRoom[s] === item.id);
  };

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Shop</Text>

        {/* Coin bar */}
        <View style={s.coinBar}>
          <Text style={s.coinLabel}>coins</Text>
          <View style={s.coinRight}>
            <Text style={s.coinVal}>{state.petCoins}</Text>
            <Image source={COIN_SRC} style={{ width: 26, height: 26 }} resizeMode="contain" />
          </View>
        </View>

        {/* Category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabRow}
        >
          {CATS.map(c => (
            <TouchableOpacity
              key={c.key}
              style={[s.tab, cat === c.key && s.tabOn]}
              onPress={() => setCat(c.key)}
              activeOpacity={0.85}
            >
              <Text style={[s.tabTxt, cat === c.key && s.tabTxtOn]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Item grid */}
        <View style={s.grid}>
          {filtered.map(item => {
            const owned = state.ownedItems.includes(item.id);
            const equipped = isEquipped(item);
            return (
              <TouchableOpacity
                key={item.id}
                style={[s.card, equipped && s.cardOn]}
                onPress={() => handleItem(item)}
                onLongPress={() => item.category === 'background' && setPreviewItem(item)}
                delayLongPress={350}
                activeOpacity={0.85}
              >
                <Image source={ICON_SRC[item.icon]} style={s.cardImg} resizeMode="contain" />
                <Text style={s.cardName}>{item.nameEn}</Text>
                {equipped ? (
                  <View style={s.badgeOn}>
                    <Text style={s.badgeOnTxt}>
                      ✓ {item.category === 'furniture' ? 'Placed' : 'Equipped'}
                    </Text>
                  </View>
                ) : (
                  <View style={s.badgeFree}>
                    <Text style={s.badgeFreeTxt}>
                      FREE {item.category === 'furniture' ? '擺啦' : '拎啦'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Furniture slot picker — "where do you want to put it?" */}
      <Modal visible={!!slotPickerItem} transparent animationType="slide" onRequestClose={() => setSlotPickerItem(null)}>
        <Pressable style={s.modalBackdrop} onPress={() => setSlotPickerItem(null)}>
          <Pressable style={s.slotPickerSheet} onPress={(e) => e.stopPropagation()}>
            <View style={s.handle} />
            <View style={s.slotPickerHeader}>
              <View style={s.slotPickerIconBox}>
                {slotPickerItem && ICON_SRC[slotPickerItem.icon] && (
                  <Image source={ICON_SRC[slotPickerItem.icon]} style={s.slotPickerIcon} resizeMode="contain" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.slotPickerTitle, { fontFamily: 'Nunito_800ExtraBold' }]}>擺去邊？</Text>
                <Text style={s.slotPickerSub}>{slotPickerItem?.nameEn} · 撳下面揀個位</Text>
              </View>
              <TouchableOpacity onPress={() => setSlotPickerItem(null)} style={s.sheetClose} activeOpacity={0.7}>
                <Text style={s.sheetCloseTxt}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Preferred slot pinned at top */}
            {slotPickerItem && (() => {
              const preferred = FURNITURE_SPECS[slotPickerItem.id]?.slot;
              return (
                <>
                  {preferred && (
                    <TouchableOpacity
                      style={[s.slotOption, s.slotOptionPreferred]}
                      onPress={() => {
                        dispatch({ type: 'BUY_ITEM', payload: { id: slotPickerItem.id, cost: 0 } });
                        dispatch({ type: 'PLACE_ROOM_ITEM', payload: { slot: preferred, itemId: slotPickerItem.id } });
                        setSlotPickerItem(null);
                        setJustBought(slotPickerItem);
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={s.slotOptionEmoji}>⭐</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[s.slotOptionName, { fontFamily: 'Nunito_700Bold' }]}>推薦：{SLOT_LABELS[preferred]}</Text>
                        <Text style={s.slotOptionNameEn}>呢個位最啱呢件嘢</Text>
                      </View>
                      <Text style={s.slotOptionArrow}>›</Text>
                    </TouchableOpacity>
                  )}
                  <Text style={s.slotSectionLab}>或者揀其他位</Text>
                  <View style={s.slotGrid}>
                    {(ALL_SLOTS.filter(s => s !== preferred)).map(slot => {
                      const occupied = !!state.petRoom[slot];
                      return (
                        <TouchableOpacity
                          key={slot}
                          style={[s.slotGridItem, occupied && s.slotGridItemOff]}
                          onPress={() => {
                            if (occupied) {
                              Alert.alert('個位有嘢', `個位已經擺咗「${state.petRoom[slot]}」，拎走先啦`);
                              return;
                            }
                            dispatch({ type: 'BUY_ITEM', payload: { id: slotPickerItem.id, cost: 0 } });
                            dispatch({ type: 'PLACE_ROOM_ITEM', payload: { slot, itemId: slotPickerItem.id } });
                            setSlotPickerItem(null);
                            setJustBought(slotPickerItem);
                          }}
                          activeOpacity={0.85}
                        >
                          <Text style={s.slotGridEmoji}>
                            {slot === 'bed' ? '🛏️' : slot === 'floor' ? '🟫' : slot === 'table' ? '📚' :
                             slot === 'topLeft' ? '↖️' : slot === 'topRight' ? '↗️' :
                             slot === 'bottomLeft' ? '↙️' : '↘️'}
                          </Text>
                          <Text style={s.slotGridLab} numberOfLines={1}>
                            {slot === 'bed' ? '下中' : slot === 'floor' ? '地板' : slot === 'table' ? '桌面' :
                             slot === 'topLeft' ? '左上' : slot === 'topRight' ? '右上' :
                             slot === 'bottomLeft' ? '左下' : '右下'}
                          </Text>
                          {occupied && <Text style={s.slotGridOff}>已佔</Text>}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              );
            })()}
            <View style={{ height: 16 }} />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Long-press background preview */}
      <Modal visible={!!previewItem} transparent animationType="fade" onRequestClose={() => setPreviewItem(null)}>
        <Pressable style={s.modalBackdrop} onPress={() => setPreviewItem(null)}>
          <Pressable style={s.previewCard} onPress={(e) => e.stopPropagation()}>
            <Text style={s.previewEyebrow}>房仔預覽</Text>
            <Text style={s.previewTitle}>{previewItem?.nameEn}</Text>
            <View style={s.previewRoom}>
              {previewItem && ICON_SRC[previewItem.icon] && (
                <Image source={ICON_SRC[previewItem.icon]} style={s.previewRoomImg} resizeMode="cover" />
              )}
              <View style={s.previewRoomOverlay}>
                <Text style={s.previewRoomPet}>🐱</Text>
              </View>
            </View>
            <View style={s.celebRow}>
              <TouchableOpacity style={s.celebBtnGhost} onPress={() => setPreviewItem(null)} activeOpacity={0.85}>
                <Text style={s.celebBtnGhostTxt}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.celebBtn}
                onPress={() => {
                  if (previewItem) handleItem(previewItem);
                  setPreviewItem(null);
                }}
                activeOpacity={0.85}
              >
                <Text style={s.celebBtnTxt}>用呢個房 →</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Confetti + go-see modal — only fires after furniture buy */}
      <Modal visible={!!justBought} transparent animationType="fade" onRequestClose={() => setJustBought(null)}>
        <Pressable style={s.modalBackdrop} onPress={() => setJustBought(null)}>
          <Pressable style={s.celebCard} onPress={(e) => e.stopPropagation()}>
            {/* Confetti layer (absolute, behind content) */}
            <View style={s.confettiLayer} pointerEvents="none">
              {confetti.map((v, i) => {
                const angle = (i / confetti.length) * Math.PI * 2;
                const radius = 90 + (i % 3) * 30;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const rotate = (i * 37) % 360;
                const colors = [PINK, GREEN, '#fdd56b', '#a888e0', '#7ec4d6', '#f0a96e'];
                return (
                  <Animated.View
                    key={i}
                    style={[
                      s.confettiDot,
                      {
                        backgroundColor: colors[i % colors.length],
                        transform: [
                          { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, x] }) },
                          { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, y] }) },
                          { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${rotate}deg`] }) },
                          { scale: v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 1.2, 0.6] }) },
                        ],
                        opacity: v.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
                      },
                    ]}
                  />
                );
              })}
            </View>

            <View style={s.celebItem}>
              {justBought && ICON_SRC[justBought.icon] && (
                <Image source={ICON_SRC[justBought.icon]} style={s.celebImg} resizeMode="contain" />
              )}
            </View>
            <Text style={s.celebTitle}>🎉 攞到啦！</Text>
            <Text style={s.celebName}>{justBought?.name}</Text>
            <Text style={s.celebSub}>擺咗喺你間屋仔啦 🏠</Text>
            <View style={s.celebRow}>
              <TouchableOpacity style={s.celebBtnGhost} onPress={() => setJustBought(null)} activeOpacity={0.85}>
                <Text style={s.celebBtnGhostTxt}>遲啲先</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.celebBtn}
                onPress={() => { setJustBought(null); router.push('/(tabs)/world' as any); }}
                activeOpacity={0.85}
              >
                <Text style={s.celebBtnTxt}>去屋仔睇下 →</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fdf2ec' },
  content: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 20 },
  title: { fontSize: 36, fontFamily: 'Nunito_800ExtraBold', color: PINK, textAlign: 'center', marginBottom: 16 },

  // Coin bar
  coinBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 18, paddingHorizontal: 20, paddingVertical: 14, marginBottom: 16,
  },
  coinLabel: { fontSize: 16, color: INK, fontWeight: '600' },
  coinRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  coinVal: { fontSize: 20, fontFamily: 'Nunito_800ExtraBold', color: INK },

  // Tabs (horizontal scroll)
  tabRow: { gap: 10, paddingRight: 16, paddingVertical: 2, marginBottom: 16 },
  tab: {
    paddingHorizontal: 22, paddingVertical: 10, borderRadius: 22,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    minWidth: 70,
  },
  tabOn: { backgroundColor: PINK },
  tabTxt: { fontSize: 14, fontWeight: '600', color: INK },
  tabTxtOn: { color: '#fff' },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, justifyContent: 'space-between' },
  card: {
    width: CARD_W, backgroundColor: '#fff', borderRadius: 18, paddingTop: 18, paddingBottom: 14,
    paddingHorizontal: 14, alignItems: 'center', marginBottom: GAP,
  },
  cardOn: { borderColor: GREEN, borderWidth: 2, backgroundColor: '#f1f9f3' },
  cardImg: { width: 64, height: 64, marginBottom: 10 },
  cardName: { fontSize: 14, fontWeight: '600', color: INK, textAlign: 'center', marginBottom: 10 },

  pricePill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: PINK_SOFT,
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'stretch',
  },
  pricePillStar: { width: 16, height: 16 },
  pricePillTxt: { fontSize: 14, color: PINK, fontWeight: '700' },

  badgeOn: {
    backgroundColor: GREEN, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    alignSelf: 'stretch', alignItems: 'center',
  },
  badgeOnTxt: { fontSize: 12, color: '#fff', fontWeight: '700' },
  badgeOwned: {
    backgroundColor: '#f0e8e0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    alignSelf: 'stretch', alignItems: 'center',
  },
  badgeOwnedTxt: { fontSize: 12, color: SUBINK, fontWeight: '700' },
  badgeFree: {
    backgroundColor: PINK, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    alignSelf: 'stretch', alignItems: 'center',
  },
  badgeFreeTxt: { fontSize: 12, color: '#fff', fontWeight: '800', letterSpacing: 0.3 },

  // Confetti celebration modal
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28,
  },
  celebCard: {
    width: '100%', maxWidth: 320,
    backgroundColor: '#fff', borderRadius: 28, paddingVertical: 28, paddingHorizontal: 24,
    alignItems: 'center', overflow: 'visible',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8,
  },
  confettiLayer: {
    position: 'absolute', top: 90, left: 0, right: 0, height: 1, alignItems: 'center', justifyContent: 'center',
  },
  confettiDot: {
    position: 'absolute', width: 10, height: 10, borderRadius: 5,
  },
  celebItem: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center',
    marginBottom: 14, marginTop: -10,
  },
  celebImg: { width: 80, height: 80 },
  celebTitle: { fontSize: 22, fontFamily: 'Nunito_800ExtraBold', color: PINK, marginBottom: 4 },
  celebName: { fontSize: 17, fontFamily: 'Nunito_700Bold', color: INK, marginBottom: 4 },
  celebSub: { fontSize: 13, color: SUBINK, marginBottom: 22, fontWeight: '500' },
  celebRow: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  celebBtnGhost: {
    flex: 1, paddingVertical: 13, borderRadius: 18,
    backgroundColor: '#f5e8de', alignItems: 'center', justifyContent: 'center',
  },
  celebBtnGhostTxt: { fontSize: 14, fontFamily: 'Nunito_700Bold', color: SUBINK },
  celebBtn: {
    flex: 1.4, paddingVertical: 13, borderRadius: 18,
    backgroundColor: PINK, alignItems: 'center', justifyContent: 'center',
    shadowColor: PINK, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  celebBtnTxt: { fontSize: 14, fontFamily: 'Nunito_800ExtraBold', color: '#fff' },

  // Background preview modal
  previewCard: {
    width: '100%', maxWidth: 340,
    backgroundColor: '#fff', borderRadius: 24, padding: 20, alignItems: 'center',
  },
  previewEyebrow: { fontSize: 11, color: PINK, fontWeight: '800', letterSpacing: 1.2, marginBottom: 4 },
  previewTitle: { fontSize: 18, fontFamily: 'Nunito_800ExtraBold', color: INK, marginBottom: 14 },
  previewRoom: {
    width: '100%', aspectRatio: 1.4, borderRadius: 16, overflow: 'hidden',
    backgroundColor: '#ffe4d6', marginBottom: 18, position: 'relative',
  },
  previewRoomImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  previewRoomOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  previewRoomPet: { fontSize: 64 },

  // Slot picker (where do you want to put it?)
  slotPickerSheet: {
    width: '100%', backgroundColor: '#fff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 10, paddingBottom: 24, paddingHorizontal: 18,
  },
  slotPickerHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5e8de', marginBottom: 12,
  },
  slotPickerIconBox: {
    width: 56, height: 56, borderRadius: 14, backgroundColor: PINK_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  slotPickerIcon: { width: 48, height: 48 },
  slotPickerTitle: { fontSize: 18, color: INK },
  slotPickerSub: { fontSize: 12, color: MUTED, fontWeight: '600', marginTop: 2 },
  slotOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fdf2ec', borderRadius: 16, padding: 14, marginBottom: 8,
  },
  slotOptionPreferred: { backgroundColor: PINK_SOFT, borderWidth: 2, borderColor: PINK },
  slotOptionEmoji: { fontSize: 28 },
  slotOptionName: { fontSize: 14, color: INK },
  slotOptionNameEn: { fontSize: 11, color: MUTED, fontWeight: '600', marginTop: 1 },
  slotOptionArrow: { fontSize: 26, color: PINK, fontWeight: '800' },
  slotSectionLab: { fontSize: 11, color: MUTED, fontWeight: '700', letterSpacing: 1, marginTop: 8, marginBottom: 10 },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotGridItem: {
    width: '23%', aspectRatio: 1, backgroundColor: '#fff',
    borderRadius: 14, padding: 6, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#f5e8de',
  },
  slotGridItemOff: { opacity: 0.45, backgroundColor: '#fdf2ec' },
  slotGridEmoji: { fontSize: 24 },
  slotGridLab: { fontSize: 10, color: INK, fontWeight: '700', marginTop: 2 },
  slotGridOff: { fontSize: 8, color: MUTED, fontWeight: '700', marginTop: 1 },

  // Shared modal bits (handle, close)
  handle: { width: 42, height: 5, borderRadius: 3, backgroundColor: MUTED, alignSelf: 'center', marginTop: 4, marginBottom: 8 },
  sheetClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center' },
  sheetCloseTxt: { fontSize: 14, color: PINK, fontWeight: '800' },
});
