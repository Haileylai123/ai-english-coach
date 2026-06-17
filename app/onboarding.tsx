import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Animated, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../services/store';
import { useI18n } from '../services/i18n';

const { width: W, height: H } = Dimensions.get('window');
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };
const F = { fontFamily: 'Nunito_400Regular' };

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';
const GREEN = '#7ec48b';

const PET_CAT = require('../assets/icons/pet-cat.png');
const PET_DOG = require('../assets/icons/pet-dog.png');
const PET_FOX = require('../assets/icons/pet-fox.png');
const PET_HAMSTER = require('../assets/icons/pet-hamster.png');
const PET_PENGUIN = require('../assets/icons/pet-penguin.png');
const PET_RABBIT = require('../assets/icons/pet-rabbit.png');

const PETS = [
  { id: 'cat', name: 'Cat', zh: '貓咪', img: PET_CAT },
  { id: 'dog', name: 'Dog', zh: '狗狗', img: PET_DOG },
  { id: 'fox', name: 'Fox', zh: '狐狸', img: PET_FOX },
  { id: 'rabbit', name: 'Rabbit', zh: '兔仔', img: PET_RABBIT },
  { id: 'penguin', name: 'Penguin', zh: '企鵝', img: PET_PENGUIN },
  { id: 'hamster', name: 'Hamster', zh: '倉鼠', img: PET_HAMSTER },
];

const DIFFS = [
  { id: 'beginner', name: 'Beginner', zh: '初級', emoji: '🌱', color: '#7ec48b', desc: '由零開始' },
  { id: 'intermediate', name: 'Intermediate', zh: '中級', emoji: '🌿', color: '#f0a96e', desc: '有一定基礎' },
  { id: 'advanced', name: 'Advanced', zh: '高級', emoji: '🌳', color: '#a888e0', desc: '挑戰高難度' },
];

const TABS = [
  { name: 'Chat',       desc: 'AI 對話', emoji: '💬', route: '/(tabs)/chat' },
  { name: 'World',      desc: '養寵物', emoji: '🐱', route: '/(tabs)/world' },
  { name: 'Learn',      desc: '課程',   emoji: '📚', route: '/learn' },
  { name: 'Vocab',      desc: '生字庫', emoji: '📖', route: '/vocab' },
  { name: 'Games',      desc: '遊戲',   emoji: '🎮', route: '/games' },
  { name: 'Stats',      desc: '進度',   emoji: '📊', route: '/(tabs)/stats' },
];

// 2 rows × 3 cols layout for oval preview boxes
const TAB_ROWS = [TABS.slice(0, 3), TABS.slice(3, 6)];

export default function OnboardingScreen() {
  const router = useRouter();
  const { dispatch } = useStore();
  const { locale, setLocale } = useI18n();
  const [step, setStep] = useState(0);
  const [petId, setPetId] = useState('cat');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [pickedLocale, setPickedLocale] = useState(locale);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const next = () => {
    if (step < 3) {
      const newStep = step + 1;
      setStep(newStep);
      Animated.spring(slideAnim, { toValue: -newStep * W, useNativeDriver: true, friction: 9 }).start();
    } else {
      // Finish — apply chosen locale
      if (pickedLocale !== locale) setLocale(pickedLocale);
      dispatch({ type: 'SELECT_PET', payload: petId });
      dispatch({ type: 'SET_PET_NAME', payload: PETS.find(p => p.id === petId)?.name || 'Mimi' });
      dispatch({ type: 'ONBOARDING_COMPLETE' });
      dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
      // Aha moment first — show user's first success, then enter app
      router.replace('/aha');
    }
  };
  const back = () => {
    if (step > 0) {
      const newStep = step - 1;
      setStep(newStep);
      Animated.spring(slideAnim, { toValue: -newStep * W, useNativeDriver: true, friction: 9 }).start();
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={CREAM} />

      {/* Top bar: skip + dots */}
      <View style={s.topBar}>
        {step > 0 ? (
          <TouchableOpacity onPress={back} style={s.backBtn} activeOpacity={0.85}>
            <Text style={s.backTxt}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={s.backBtn} />
        )}
        <View style={s.dotsRow}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={[s.dot, i === step && s.dotOn]} />
          ))}
        </View>
        <TouchableOpacity onPress={() => { dispatch({ type: 'SELECT_PET', payload: petId }); dispatch({ type: 'ONBOARDING_COMPLETE' }); router.replace('/(tabs)/chat'); }} style={s.skipBtn} activeOpacity={0.85}>
          <Text style={s.skipTxt}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <Animated.View style={[s.slidesRow, { transform: [{ translateX: slideAnim }] }]}>
        {/* Step 0: Welcome */}
        <View style={[s.slide, { width: W }]}>
          <View style={s.welcomeIcon}>
            <Text style={s.welcomeEmoji}>👋</Text>
          </View>
          <Text style={[s.title, FX]}>Welcome to</Text>
          <Text style={[s.titlePink, FX]}>English Coach</Text>
          <Text style={s.subtitle}>用廣東話學好英文</Text>
          <Text style={s.desc}>
            結合 AI 對話、課程、遊戲、寵物世界{'\n'}陪你由零到流利
          </Text>
        </View>

        {/* Step 1: Pick language */}
        <View style={[s.slide, { width: W }]}>
          <Text style={s.stepEyebrow}>STEP 1</Text>
          <Text style={[s.title, FX]}>揀你嘅語言</Text>
          <Text style={s.subtitle}>Choose your language · 言語選択 · 언어 선택</Text>
          <View style={s.langBox}>
            <LangBtn id="zh-HK" label="繁體中文" sub="廣東話 🇭🇰" active={pickedLocale === 'zh-HK'} onPress={() => setPickedLocale('zh-HK')} />
            <LangBtn id="en" label="English" sub="English 🇺🇸" active={pickedLocale === 'en'} onPress={() => setPickedLocale('en')} />
            <LangBtn id="zh-CN" label="简体中文" sub="簡體 🇨🇳" active={pickedLocale === 'zh-CN'} onPress={() => setPickedLocale('zh-CN')} />
            <LangBtn id="ja" label="日本語" sub="Japanese 🇯🇵" active={pickedLocale === 'ja'} onPress={() => setPickedLocale('ja')} />
            <LangBtn id="ko" label="한국어" sub="Korean 🇰🇷" active={pickedLocale === 'ko'} onPress={() => setPickedLocale('ko')} />
          </View>
        </View>

        {/* Step 2: Pick pet */}
        <View style={[s.slide, { width: W }]}>
          <Text style={s.stepEyebrow}>STEP 2</Text>
          <Text style={[s.title, FX]}>揀你嘅同伴</Text>
          <Text style={s.subtitle}>Pick your buddy</Text>
          <View style={s.petsRow}>
            {PETS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={[s.petCard, petId === p.id && s.petCardOn]}
                onPress={() => setPetId(p.id)}
                activeOpacity={0.85}
              >
                <Image source={p.img} style={s.petImg} resizeMode="contain" />
                <Text style={[s.petName, FB]}>{p.zh}</Text>
                <Text style={s.petNameEn}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={s.tipBox}>
            <Text style={s.tipTxt}>💡 用練習賺金幣，餵佢、扮靚、買傢俬</Text>
          </View>
        </View>

        {/* Step 3: Difficulty + tabs preview */}
        <View style={[s.slide, { width: W }]}>
          <Text style={s.stepEyebrow}>STEP 3</Text>
          <Text style={[s.title, FX]}>你嘅程度？</Text>
          <Text style={s.subtitle}>Your level</Text>
          <View style={s.diffCol}>
            {DIFFS.map(d => (
              <TouchableOpacity
                key={d.id}
                style={[s.diffCard, difficulty === d.id && s.diffCardOn, difficulty === d.id && { borderColor: d.color }]}
                onPress={() => setDifficulty(d.id as any)}
                activeOpacity={0.85}
              >
                <Text style={s.diffEmoji}>{d.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.diffName, FB]}>{d.zh}</Text>
                  <Text style={s.diffDesc}>{d.name} · {d.desc}</Text>
                </View>
                {difficulty === d.id && <Text style={s.diffCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.previewLab}>之後你會用到：</Text>
          <View style={s.tabsPreview}>
            {TAB_ROWS.map((row, ri) => (
              <View key={ri} style={s.tabRow}>
                {row.map(t => (
                  <TouchableOpacity
                    key={t.name}
                    style={s.tabOval}
                    onPress={() => {
                      if (pickedLocale !== locale) setLocale(pickedLocale);
                      dispatch({ type: 'SELECT_PET', payload: petId });
                      dispatch({ type: 'ONBOARDING_COMPLETE' });
                      dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
                      router.replace(t.route as any);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={s.tabEmoji}>{t.emoji}</Text>
                    <Text style={s.tabOvalName}>{t.name}</Text>
                    <Text style={s.tabOvalDesc}>{t.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Bottom CTA */}
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.ctaBtn} onPress={next} activeOpacity={0.85}>
          <Text style={s.ctaTxt}>{step === 3 ? '開始學習 🚀' : '下一步'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function LangBtn({ id, label, sub, active, onPress }: { id: string; label: string; sub: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[s.langCard, active && s.langCardOn]} onPress={onPress} activeOpacity={0.85}>
      <View style={[s.langRadio, active && s.langRadioOn]}>{active && <Text style={s.langCheck}>✓</Text>}</View>
      <View style={{ flex: 1 }}>
        <Text style={[s.langName, FB]}>{label}</Text>
        <Text style={s.langSub}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 8, zIndex: 5 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 22, color: PINK, fontWeight: '800' },
  dotsRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e0d0c0' },
  dotOn: { width: 22, backgroundColor: PINK },
  skipBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  skipTxt: { fontSize: 14, color: MUTED, fontWeight: '700' },

  slidesRow: { flex: 1, flexDirection: 'row', width: W * 4 },
  slide: { width: W, paddingHorizontal: 28, paddingTop: 12, alignItems: 'center' },

  stepEyebrow: { fontSize: 12, color: PINK, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  title: { fontSize: 32, color: INK, textAlign: 'center', marginBottom: 4, fontWeight: '800' },
  titlePink: { fontSize: 32, color: PINK, textAlign: 'center', marginBottom: 12, fontWeight: '800' },
  subtitle: { fontSize: 14, color: MUTED, textAlign: 'center', marginBottom: 24, fontWeight: '600' },
  desc: { fontSize: 14, color: SUBINK, textAlign: 'center', lineHeight: 22, fontWeight: '500' },

  welcomeIcon: {
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, marginTop: 30,
  },
  welcomeEmoji: { fontSize: 70 },

  // Lang
  langBox: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8, justifyContent: 'center' },
  langCard: {
    width: '46%', flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 16, padding: 12,
    borderWidth: 2, borderColor: 'transparent',
  },
  langCardOn: { borderColor: PINK, backgroundColor: PINK_SOFT },
  langRadio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#e0d0c0',
    alignItems: 'center', justifyContent: 'center',
  },
  langRadioOn: { backgroundColor: PINK, borderColor: PINK },
  langCheck: { color: '#fff', fontSize: 12, fontWeight: '800' },
  langName: { fontSize: 14, color: INK },
  langSub: { fontSize: 11, color: MUTED, fontWeight: '600', marginTop: 1 },

  // Pets
  petsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 18, justifyContent: 'center' },
  petCard: {
    width: '46%', backgroundColor: '#fff', borderRadius: 18, padding: 14,
    alignItems: 'center', borderWidth: 2, borderColor: 'transparent',
  },
  petCardOn: { borderColor: PINK, backgroundColor: PINK_SOFT },
  petImg: { width: 80, height: 80, marginBottom: 8 },
  petName: { fontSize: 14, color: INK },
  petNameEn: { fontSize: 12, color: MUTED, fontWeight: '600', marginTop: 2 },
  tipBox: { backgroundColor: PINK_SOFT, borderRadius: 12, padding: 12, marginTop: 8, width: '100%' },
  tipTxt: { fontSize: 13, color: INK, textAlign: 'center', fontWeight: '500', lineHeight: 19 },

  // Difficulty
  diffCol: { width: '100%', gap: 10, marginBottom: 18 },
  diffCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    borderWidth: 2, borderColor: 'transparent',
  },
  diffCardOn: { borderColor: PINK, backgroundColor: PINK_SOFT },
  diffEmoji: { fontSize: 28 },
  diffName: { fontSize: 15, color: INK },
  diffDesc: { fontSize: 12, color: MUTED, fontWeight: '600', marginTop: 2 },
  diffCheck: { fontSize: 18, color: PINK, fontWeight: '800' },

  previewLab: { fontSize: 12, color: MUTED, fontWeight: '700', marginBottom: 8, alignSelf: 'flex-start' },
  tabsPreview: { width: '100%', flexDirection: 'column', gap: 8, alignSelf: 'flex-start' },
  tabRow: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  tabOval: {
    flex: 1,
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingVertical: 10, paddingHorizontal: 6,
    borderWidth: 2, borderColor: PINK_SOFT,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  tabEmoji: { fontSize: 20, marginBottom: 2 },
  tabOvalName: { fontSize: 11, color: INK, fontWeight: '800' },
  tabOvalDesc: { fontSize: 9, color: MUTED, fontWeight: '600', marginTop: 1 },

  bottomBar: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 28, backgroundColor: CREAM, borderTopWidth: 1, borderTopColor: '#f5e8de' },
  ctaBtn: { backgroundColor: PINK, paddingVertical: 16, borderRadius: 18, alignItems: 'center', shadowColor: PINK, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 },
  ctaTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
