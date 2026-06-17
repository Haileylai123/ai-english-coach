import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
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
const GREEN = '#7ec48b';

export default function CatCharityScreen() {
  const router = useRouter();

  return (
    <View style={s.root}>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
        <Text style={s.backTxt}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.heroEmoji}>🐱</Text>
          <Text style={[s.heroTitle, FX]}>學英文 · 救貓咪</Text>
          <Text style={s.heroSub}>Learn English. Save Cats.</Text>
          <Text style={s.heroDesc}>
            每筆訂閱嘅 10% 會直接捐俾貓保護團體{'\n'}
            你學英文嘅同時，幫助真實嘅貓咪
          </Text>
        </View>

        {/* How it works */}
        <View style={s.card}>
          <Text style={[s.cardTitle, FB]}>點樣運作？</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 10 }}>
            <Step icon="📱" title="你訂閱" desc="揀任何 plan，自動成為貓咪守護者" />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 10 }}>
            <Step icon="💰" title="10% 捐出" desc="每個月自動捐款俾合作貓舍" />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 10 }}>
            <Step icon="🐱" title="救貓" desc="你嘅練習直接變成貓糧、醫療、絕育" />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 10 }}>
            <Step icon="📊" title="睇報告" desc="App 入面睇到你救咗幾多貓、捐咗幾多" />
          </View>
        </View>

        {/* Impact tracker */}
        <View style={[s.card, s.impactCard]}>
          <Text style={[s.cardTitle, FB, { color: PINK }]}>💖 你嘅影響力</Text>
          <View style={s.impactGrid}>
            <ImpactBox icon="🍽️" label="貓糧" value="50 餐" />
            <ImpactBox icon="💉" label="疫苗" value="3 針" />
            <ImpactBox icon="🏥" label="絕育" value="1 隻" />
            <ImpactBox icon="🏠" label="暫託" value="2 星期" />
          </View>
          <Text style={s.impactNote}>
            * 以上為每月 $12.99 訂閱嘅估算影響。{'\n'}實際數字因合作貓舍而異。
          </Text>
        </View>

        {/* Partner cats preview */}
        <View style={s.card}>
          <Text style={[s.cardTitle, FB]}>🏠 合作貓舍嘅貓咪</Text>
          <Text style={s.comingSoon}>
            即將登場 — 真實貓咪 profile{'\n'}
            你會睇到你幫助緊嘅貓咪嘅相片同近況更新
          </Text>
          <View style={s.catPreviewRow}>
            {['🐱', '😺', '😸', '😻'].map((cat, i) => (
              <View key={i} style={s.catPreview}>
                <Text style={s.catPreviewEmoji}>{cat}</Text>
                <Text style={s.catPreviewLabel}>Coming soon</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Donation transparency */}
        <View style={s.card}>
          <Text style={[s.cardTitle, FB]}>🔍 透明捐款</Text>
          <Text style={s.transText}>
            我哋承諾：{'\n\n'}
            • 每月公開捐款金額同收據{'\n'}
            • 合作貓舍經過審核{'\n'}
            • 你可以直接捐款俾貓舍（唔經我哋）{'\n'}
            • 10% = 收入嘅 10%，唔係利潤嘅 10%{'\n\n'}
            因為信任係一切嘅基礎。
          </Text>
        </View>

        {/* Partners */}
        <View style={s.card}>
          <Text style={[s.cardTitle, FB]}>🤝 合作夥伴</Text>
          <Text style={s.comingSoon}>
            我哋正在聯繫以下地區嘅貓保護團體：{'\n\n'}
            🇯🇵 日本 — 東京・大阪貓カフェ聯盟{'\n'}
            🇰🇷 韓國 — Seoul Cat Shelter Network{'\n'}
            🇹🇼 台灣 — 貓中途之家協會{'\n'}
            🇭🇰 香港 — 愛護動物協會 (SPCA){'\n\n'}
            想推薦你認識嘅貓舍？Email 我哋！
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity style={s.cta} activeOpacity={0.85}>
          <Text style={[s.ctaTxt, FB]}>🐱 開始救貓 · 揀 Plan</Text>
        </TouchableOpacity>

        <Text style={s.footer}>
          每一個訂閱 = 一隻貓嘅希望{'\n'}
          Every subscription = hope for a cat 🐱
        </Text>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

function Step({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <View style={stp.row}>
      <Text style={stp.icon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[stp.title, FB]}>{title}</Text>
        <Text style={stp.desc}>{desc}</Text>
      </View>
    </View>
  );
}
const stp = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10 },
  icon: { fontSize: 28, width: 44, textAlign: 'center' },
  title: { fontSize: 14, color: INK },
  desc: { fontSize: 12, color: SUBINK, marginTop: 2, fontWeight: '500' },
});

function ImpactBox({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={sib.box}>
      <Text style={sib.icon}>{icon}</Text>
      <Text style={[sib.val, FX]}>{value}</Text>
      <Text style={sib.lab}>{label}</Text>
    </View>
  );
}
const sib = StyleSheet.create({
  box: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: PINK_SOFT },
  icon: { fontSize: 24, marginBottom: 4 },
  val: { fontSize: 16, color: PINK },
  lab: { fontSize: 10, color: SUBINK, marginTop: 2, fontWeight: '600' },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { position: 'absolute', top: 60, left: 16, zIndex: 10, padding: 8 },
  backTxt: { fontSize: 22, color: PINK, fontWeight: '700' },

  hero: { alignItems: 'center', paddingVertical: 30 },
  heroEmoji: { fontSize: 72, marginBottom: 12 },
  heroTitle: { fontSize: 28, color: PINK, textAlign: 'center' },
  heroSub: { fontSize: 15, color: SUBINK, marginTop: 4, fontWeight: '600' },
  heroDesc: { fontSize: 13, color: SUBINK, textAlign: 'center', marginTop: 12, lineHeight: 20, fontWeight: '500' },

  card: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  cardTitle: { fontSize: 16, color: INK, marginBottom: 12 },

  impactCard: { backgroundColor: PINK_SOFT, borderWidth: 1.5, borderColor: PINK },
  impactGrid: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  impactNote: { fontSize: 10, color: MUTED, textAlign: 'center', fontStyle: 'italic', fontWeight: '500' },

  comingSoon: { fontSize: 13, color: SUBINK, textAlign: 'center', lineHeight: 20, fontWeight: '500' },
  catPreviewRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 14 },
  catPreview: { backgroundColor: PINK_SOFT, borderRadius: 16, padding: 14, alignItems: 'center', width: (W - 72) / 4 },
  catPreviewEmoji: { fontSize: 36 },
  catPreviewLabel: { fontSize: 10, color: MUTED, marginTop: 6, fontWeight: '600' },

  transText: { fontSize: 13, color: INK, lineHeight: 22, fontWeight: '500' },

  cta: { backgroundColor: PINK, paddingVertical: 16, borderRadius: 18, alignItems: 'center', marginTop: 4,
    shadowColor: PINK, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  ctaTxt: { color: '#fff', fontSize: 17 },

  footer: { fontSize: 13, color: PINK, textAlign: 'center', marginTop: 20, lineHeight: 22, fontWeight: '700' },
});
