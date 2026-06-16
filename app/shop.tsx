import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Image, Modal, Pressable } from 'react-native';
import { useStore } from '../services/store';

const PET_CAT_SRC = require('../assets/icons/pet-cat.png');

const ICON_SRC: Record<string, any> = {
  'flower-crown': require('../assets/icons/acc-flowercrown-v2.png'),
  'crown': require('../assets/icons/acc-crown.png'),
  'fluffy-hat': require('../assets/icons/acc-hat-v2.png'),
  'ocean-hug': require('../assets/icons/acc-scarf-v2.png'),
  'glasses': require('../assets/icons/acc-glasses-v2.png'),
  'yarn-ball': require('../assets/icons/acc-backpack-v2.png'),
  'collar': require('../assets/icons/acc-collar-v2.png'),
  'bow-tie': require('../assets/icons/acc-bowtie-v2.png'),
  'backpack': require('../assets/icons/acc-backpack.png'),
  'ball': require('../assets/icons/fur-ball-v2.png'),
  'bowl': require('../assets/icons/fur-bowl-v2.png'),
  'rug': require('../assets/icons/fur-rug-v2.png'),
  'plant': require('../assets/icons/fur-plant.png'),
  'bed': require('../assets/icons/fur-bed-v2.png'),
  'bed-orig': require('../assets/icons/fur-smallbed.png'),
  'tree': require('../assets/icons/fur-cattree-v2.png'),
  'bookshelf': require('../assets/icons/fur-bookshelf-v2.png'),
  'garden': require('../assets/icons/bg-garden.png'),
  'cozy': require('../assets/icons/bg-cozy.png'),
  'beach': require('../assets/icons/bg-beach.png'),
  'forest': require('../assets/icons/bg-forest.png'),
};

const COIN_SRC = require('../assets/icons/nav-shop.png');

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

interface Item { id: string; name: string; nameEn: string; icon: string; price: number; category: 'outfit' | 'background' | 'furniture'; }

// Updated items to mirror the design — pricing at 150 across the board
const ITEMS: Item[] = [
  // Outfits (clothing) — order matches the design
  { id: 'flower-crown', name: '花冠', nameEn: 'Pipsqueak Petal', icon: 'flower-crown', price: 150, category: 'outfit' },
  { id: 'crown', name: '小皇冠', nameEn: 'Crown', icon: 'crown', price: 150, category: 'outfit' },
  { id: 'fluffy-hat', name: '毛絨帽', nameEn: 'Fluffy Hat', icon: 'fluffy-hat', price: 150, category: 'outfit' },
  { id: 'ocean-hug', name: '海洋圍巾', nameEn: 'Ocean Hug', icon: 'ocean-hug', price: 150, category: 'outfit' },
  { id: 'glasses', name: '眼鏡', nameEn: 'Glasses', icon: 'glasses', price: 150, category: 'outfit' },
  { id: 'yarn-ball', name: '毛線球', nameEn: 'Yarn Ball Toy', icon: 'yarn-ball', price: 150, category: 'outfit' },
  { id: 'collar', name: '頸圈', nameEn: 'Collar', icon: 'collar', price: 150, category: 'outfit' },
  // Backgrounds
  { id: 'garden', name: '花園', nameEn: 'Garden', icon: 'garden', price: 150, category: 'background' },
  { id: 'cozy', name: '溫馨小屋', nameEn: 'Cozy Room', icon: 'cozy', price: 150, category: 'background' },
  { id: 'beach', name: '海灘', nameEn: 'Beach', icon: 'beach', price: 150, category: 'background' },
  { id: 'forest', name: '森林', nameEn: 'Forest', icon: 'forest', price: 150, category: 'background' },
  // Furniture
  { id: 'ball', name: '玩具球', nameEn: 'Toy Ball', icon: 'ball', price: 150, category: 'furniture' },
  { id: 'bowl', name: '食物碗', nameEn: 'Food Bowl', icon: 'bowl', price: 150, category: 'furniture' },
  { id: 'rug', name: '小地毯', nameEn: 'Small Rug', icon: 'rug', price: 150, category: 'furniture' },
  { id: 'bed', name: '粉紅貓床', nameEn: 'Pink Cat Bed', icon: 'bed', price: 150, category: 'furniture' },
  { id: 'bed-orig', name: '貓床', nameEn: 'Cat Bed', icon: 'bed-orig', price: 150, category: 'furniture' },
  { id: 'plant', name: '小植物', nameEn: 'Plant', icon: 'plant', price: 150, category: 'furniture' },
  { id: 'tree', name: '貓樹', nameEn: 'Cat Tree', icon: 'tree', price: 150, category: 'furniture' },
  { id: 'bookshelf', name: '書櫃', nameEn: 'Bookshelf', icon: 'bookshelf', price: 150, category: 'furniture' },
];

type Cat = 'all' | 'outfit' | 'background' | 'furniture';

export default function ShopScreen() {
  const { state, dispatch } = useStore();
  const [cat, setCat] = useState<Cat>('all');
  const [insufficientItem, setInsufficientItem] = useState<Item | null>(null);

  const filtered = cat === 'all' ? ITEMS : ITEMS.filter(i => i.category === cat);
  const cats: { key: Cat; label: string }[] = [
    { key: 'all', label: 'all' },
    { key: 'outfit', label: 'clothing' },
    { key: 'furniture', label: 'furniture' },
    { key: 'background', label: 'background' },
  ];

  const handleBuy = (item: Item) => {
    if (state.ownedItems.includes(item.id)) {
      // Already owned — equip or use it
      if (item.category === 'outfit') {
        dispatch({ type: 'EQUIP_OUTFIT', payload: state.petOutfit === item.id ? null : item.id });
        Alert.alert(state.petOutfit === item.id ? '已卸下' : '已裝備！', `${item.icon} ${item.name}`);
      } else if (item.category === 'background') {
        dispatch({ type: 'EQUIP_BG', payload: state.petBackground === item.id ? null : item.id });
        Alert.alert(state.petBackground === item.id ? '已移除' : '已設定！', `${item.icon} ${item.name}`);
      } else {
        if (!state.petFurniture.includes(item.id)) {
          dispatch({ type: 'ADD_FURNITURE', payload: item.id });
          Alert.alert('已放置！', `${item.icon} ${item.name}`);
        } else {
          Alert.alert('已放置', '呢個家具已經放咗喺房入面');
        }
      }
      return;
    }
    if (state.petCoins < item.price) {
      setInsufficientItem(item);
      return;
    }
    dispatch({ type: 'BUY_ITEM', payload: { id: item.id, cost: item.price } });
    // Auto-equip
    if (item.category === 'outfit') dispatch({ type: 'EQUIP_OUTFIT', payload: item.id });
    else if (item.category === 'background') dispatch({ type: 'EQUIP_BG', payload: item.id });
    else dispatch({ type: 'ADD_FURNITURE', payload: item.id });
    dispatch({ type: 'ADD_PET_COINS', payload: Math.floor(item.price * 0.1) });
    Alert.alert('購買成功！🎉', `你獲得咗 ${item.icon} ${item.name}！`);
  };

  const isEquipped = (item: Item) => {
    if (item.category === 'outfit') return state.petOutfit === item.id;
    if (item.category === 'background') return state.petBackground === item.id;
    return state.petFurniture.includes(item.id);
  };

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={[s.title, FX]}>Shop</Text>

        {/* Coin bar */}
        <View style={s.coinBar}>
          <Text style={[s.coinLab, FB]}>coins</Text>
          <View style={s.coinRight}>
            <Text style={[s.coinVal, FB]}>{state.petCoins}</Text>
            <View style={s.starChip}>
              <Image source={COIN_SRC} style={{ width: 22, height: 22 }} resizeMode="contain" />
            </View>
          </View>
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.catScroll}
          contentContainerStyle={s.catRow}
        >
          {cats.map(c => (
            <TouchableOpacity
              key={c.key}
              style={[s.catBtn, cat === c.key && s.catBtnOn]}
              onPress={() => setCat(c.key)}
              activeOpacity={0.85}
            >
              <Text style={[s.catText, FB, cat === c.key && s.catTextOn]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Items grid */}
        <View style={s.grid}>
          {filtered.map(item => {
            const owned = state.ownedItems.includes(item.id);
            const equipped = isEquipped(item);
            return (
              <TouchableOpacity
                key={item.id}
                style={[s.card, equipped && s.cardEq]}
                onPress={() => handleBuy(item)}
                activeOpacity={0.85}
              >
                <View style={s.iconWrap}>
                  <Image
                    source={ICON_SRC[item.icon] || ICON_SRC['flower-crown']}
                    style={{ width: item.category === 'background' ? 88 : 64, height: item.category === 'background' ? 88 : 64 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[s.itemName, F]} numberOfLines={1}>{item.nameEn}</Text>
                <View style={[s.priceTag, equipped && s.priceTagEq, owned && !equipped && s.priceTagOwned]}>
                  <Text style={s.starSm}>⭐</Text>
                  <Text style={[s.priceVal, FB]}>
                    {equipped ? 'In use' : owned ? 'Owned' : item.price}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Insufficient coins modal */}
      <Modal visible={!!insufficientItem} transparent animationType="fade" onRequestClose={() => setInsufficientItem(null)}>
        <Pressable style={s.modalBackdrop} onPress={() => setInsufficientItem(null)}>
          <Pressable style={s.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={s.modalCatWrap}>
              <Image source={PET_CAT_SRC} style={s.modalCatImg} resizeMode="contain" />
            </View>
            <Text style={[s.modalTitle, FB]}>金幣不足！</Text>
            <Text style={[s.modalMsg, F]}>
              你需要 <Text style={s.modalCoin}>🪙{insufficientItem?.price}</Text>，{'\n'}
              但只有 <Text style={s.modalCoin}>🪙{state.petCoins}</Text>。{'\n'}
              去練習賺金幣啦！
            </Text>
            <TouchableOpacity style={s.modalBtn} onPress={() => setInsufficientItem(null)} activeOpacity={0.85}>
              <Text style={[s.modalBtnT, FB]}>知道啦</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const CARD_GAP = 12;
const SIDE_PAD = 20;
const CARD_W = (W - SIDE_PAD * 2 - CARD_GAP) / 2;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  content: { paddingTop: 60, paddingHorizontal: SIDE_PAD, paddingBottom: 20 },
  title: {
    fontSize: 38,
    color: PINK,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  coinBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  coinLab: { fontSize: 16, color: INK },
  coinRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  coinVal: { fontSize: 18, color: INK },
  starChip: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#fff4dc',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#f3d998',
  },
  starTxt: { fontSize: 16 },

  catScroll: { marginBottom: 18 },
  catRow: { gap: 8, paddingRight: 4 },
  catBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f5e8de',
  },
  catBtnOn: { backgroundColor: '#e8a07a', borderColor: '#e8a07a' },
  catText: { fontSize: 13, color: SUBINK },
  catTextOn: { color: '#fff' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP },
  card: {
    width: CARD_W,
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardEq: {
    borderWidth: 2,
    borderColor: '#5cb85c',
  },
  iconWrap: {
    width: 72, height: 72,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  itemIcon: { fontSize: 50 },
  itemName: {
    fontSize: 13,
    color: INK,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: PINK_SOFT,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 14,
    alignSelf: 'stretch',
  },
  priceTagOwned: { backgroundColor: '#fdf5ec' },
  priceTagEq: { backgroundColor: '#e8f5e9' },
  starSm: { fontSize: 11 },
  priceVal: { fontSize: 13, color: PINK },

  // Insufficient coins modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  modalCard: { width: '100%', maxWidth: 340, backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center' },
  modalCatWrap: { width: 110, height: 110, borderRadius: 55, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center', marginBottom: 14, marginTop: -56 },
  modalCatImg: { width: 100, height: 100 },
  modalTitle: { fontSize: 20, color: PINK, marginBottom: 10 },
  modalMsg: { fontSize: 14, color: INK, textAlign: 'center', lineHeight: 22, marginBottom: 18 },
  modalCoin: { color: PINK, fontWeight: '700' },
  modalBtn: { backgroundColor: PINK, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 18 },
  modalBtnT: { color: '#fff', fontSize: 15 },
});
