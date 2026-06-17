import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width: W } = Dimensions.get('window');
const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#ffffff';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';
const GOLD = '#f0c44e';

interface Plan {
  id: string; name: string; nameJa: string; price: string; priceJa: string;
  color: string; bg: string; border: string; popular?: boolean;
  features: { text: string; included: boolean }[];
  catImpact: string;
}

const PLANS: Plan[] = [
  {
    id: 'basic', name: 'Basic', nameJa: 'ベーシック', price: '$7.99/mo', priceJa: '¥980/月',
    color: INK, bg: '#fff', border: '#e0e0e0',
    features: [
      { text: 'AI 對話練習 · 8 場景', included: true },
      { text: '基礎語音分析', included: true },
      { text: '精選課程 (20 堂)', included: true },
      { text: '5 種學習遊戲', included: true },
      { text: '基本寵物系統', included: true },
      { text: 'Call Analyzer', included: false },
      { text: '全部 130+ 堂課程', included: false },
      { text: 'SRS 智能複習', included: false },
      { text: '獨家貓咪內容', included: false },
      { text: '🐱 真實貓咪更新 + 捐款證書', included: false },
    ],
    catImpact: '🍽️ 每月捐出 ~$0.80 = 2 餐貓糧',
  },
  {
    id: 'premium', name: 'Premium', nameJa: 'プレミアム', price: '$12.99/mo', priceJa: '¥1,600/月',
    color: PINK, bg: PINK_SOFT, border: PINK, popular: true,
    features: [
      { text: 'AI 對話練習 · 8 場景', included: true },
      { text: '進階 AI 語音分析', included: true },
      { text: '全部 130+ 堂課程', included: true },
      { text: '5 種學習遊戲 + 35 短劇', included: true },
      { text: '完整寵物系統 + 商店', included: true },
      { text: 'Call Analyzer · 會議分析', included: true },
      { text: 'SRS 智能複習', included: true },
      { text: '獨家貓咪內容', included: true },
      { text: '🐱 真實貓咪更新 + 捐款證書', included: false },
    ],
    catImpact: '🐱 每月捐出 ~$1.30 = 5 餐貓糧 + 疫苗',
  },
  {
    id: 'cat-lover', name: 'Cat Lover', nameJa: 'キャットラバー', price: '$14.99/mo', priceJa: '¥1,850/月',
    color: GOLD, bg: '#fffde8', border: GOLD,
    features: [
      { text: 'AI 對話練習 · 8 場景', included: true },
      { text: '進階 AI 語音分析', included: true },
      { text: '全部 130+ 堂課程', included: true },
      { text: '5 種學習遊戲 + 35 短劇', included: true },
      { text: '完整寵物系統 + 商店', included: true },
      { text: 'Call Analyzer · 會議分析', included: true },
      { text: 'SRS 智能複習', included: true },
      { text: '獨家貓咪內容', included: true },
      { text: '🐱 真實貓咪更新 + 捐款證書', included: true },
    ],
    catImpact: '🐱🏠 每月捐出 ~$1.50 = 絕育手術 + 暫託',
  },
];

export default function PaywallScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>('premium');

  return (
    <View style={s.root}>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
        <Text style={s.backTxt}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.headerEmoji}>🐱</Text>
          <Text style={[s.title, FX]}>揀你嘅 Plan</Text>
          <Text style={s.subtitle}>學英文 · 救貓咪 · 每月一杯咖啡嘅價錢</Text>
        </View>

        {PLANS.map(plan => {
          const isSelected = selected === plan.id;
          return (
            <TouchableOpacity
              key={plan.id}
              style={[s.planCard, { backgroundColor: plan.bg, borderColor: isSelected ? plan.border : plan.border }, isSelected && s.planSelected]}
              onPress={() => setSelected(plan.id)}
              activeOpacity={0.85}
            >
              {plan.popular && (
                <View style={s.popularBadge}><Text style={s.popularTxt}>🔥 最受歡迎</Text></View>
              )}
              <View style={s.planHead}>
                <View>
                  <Text style={[s.planName, FB]}>{plan.name}</Text>
                  <Text style={s.planNameJa}>{plan.nameJa}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[s.planPrice, FX, { color: plan.color }]}>{plan.price}</Text>
                  <Text style={s.planPriceJa}>{plan.priceJa}</Text>
                </View>
              </View>
              <View style={[s.catImpact, { backgroundColor: plan.bg === '#fff' ? PINK_SOFT : '#fff' }]}>
                <Text style={s.catImpactTxt}>{plan.catImpact}</Text>
              </View>
              {plan.features.map((f, i) => (
                <View key={i} style={s.featRow}>
                  <Text style={s.featCheck}>{f.included ? '✅' : '—'}</Text>
                  <Text style={[s.featTxt, !f.included && s.featOff]}>{f.text}</Text>
                </View>
              ))}
              {isSelected && (
                <View style={[s.selectIndicator, { backgroundColor: plan.color }]}>
                  <Text style={s.selectTxt}>✓ 已選擇</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={s.cta} activeOpacity={0.85}>
          <Text style={[s.ctaTxt, FB]}>
            {selected === 'premium' ? '🚀 開始 Premium 免費試用' : selected === 'cat-lover' ? '🐱 成為 Cat Lover' : '🌱 開始 Basic'}
          </Text>
          <Text style={s.ctaSub}>7 天免費 · 隨時取消</Text>
        </TouchableOpacity>

        <View style={s.trustRow}>
          <Text style={s.trustItem}>🔒 安全支付</Text>
          <Text style={s.trustItem}>📅 隨時取消</Text>
          <Text style={s.trustItem}>🐱 10% 捐貓</Text>
        </View>

        <TouchableOpacity style={s.charityLink} onPress={() => router.push('/cat-charity')}>
          <Text style={s.charityLinkTxt}>💖 了解我哋嘅貓慈善承諾 →</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { position: 'absolute', top: 60, left: 16, zIndex: 10, padding: 8 },
  backTxt: { fontSize: 22, color: PINK, fontWeight: '700' },
  header: { alignItems: 'center', paddingVertical: 24 },
  headerEmoji: { fontSize: 56, marginBottom: 8 },
  title: { fontSize: 28, color: PINK },
  subtitle: { fontSize: 13, color: SUBINK, marginTop: 6, textAlign: 'center', fontWeight: '500' },
  planCard: { borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 2 },
  planSelected: { borderWidth: 2.5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  popularBadge: { position: 'absolute', top: -12, right: 16, backgroundColor: PINK, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 10 },
  popularTxt: { color: '#fff', fontSize: 11, fontWeight: '800' },
  planHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  planName: { fontSize: 20, color: INK },
  planNameJa: { fontSize: 11, color: MUTED, marginTop: 2 },
  planPrice: { fontSize: 24 },
  planPriceJa: { fontSize: 10, color: MUTED, marginTop: 2 },
  catImpact: { borderRadius: 12, padding: 10, marginBottom: 12, alignItems: 'center' },
  catImpactTxt: { fontSize: 11, color: PINK, fontWeight: '700', textAlign: 'center' },
  featRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  featCheck: { fontSize: 12, width: 22, textAlign: 'center' },
  featTxt: { fontSize: 13, color: INK, fontWeight: '500', flex: 1 },
  featOff: { color: MUTED, textDecorationLine: 'line-through' as any },
  selectIndicator: { paddingVertical: 8, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  selectTxt: { color: '#fff', fontSize: 12, fontWeight: '800' },
  cta: { backgroundColor: PINK, paddingVertical: 18, borderRadius: 18, alignItems: 'center', marginTop: 4, shadowColor: PINK, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  ctaTxt: { color: '#fff', fontSize: 17 },
  ctaSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 4, fontWeight: '600' },
  trustRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 14 },
  trustItem: { fontSize: 11, color: SUBINK, fontWeight: '600' },
  charityLink: { alignItems: 'center', marginTop: 16 },
  charityLinkTxt: { fontSize: 13, color: PINK, fontWeight: '700' },
});
