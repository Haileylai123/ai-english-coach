import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../services/store';
import { useI18n, Locale } from '../services/i18n';

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';

const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };

const LOCALES: { key: Locale; label: string; flag: string }[] = [
  { key: 'zh-HK', label: '繁體中文（廣東話）', flag: '🇭🇰' },
  { key: 'en', label: 'English', flag: '🇺🇸' },
  { key: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const { t, locale, setLocale } = useI18n();

  const pickLocale = (l: Locale) => {
    setLocale(l);
    Alert.alert(
      l === 'en' ? 'Language updated' : l === 'zh-CN' ? '语言已更新' : '語言已更新',
      l === 'en' ? 'UI switched to English' : l === 'zh-CN' ? '界面已切换到简体中文' : '界面已切換到繁體中文',
    );
  };

  const resetData = () => {
    Alert.alert(
      locale === 'en' ? 'Reset all data?' : locale === 'zh-CN' ? '重置所有数据？' : '重設所有數據？',
      locale === 'en'
        ? 'This will erase XP, history, custom vocabulary and pet items.'
        : locale === 'zh-CN'
        ? '这会清除 XP、记录、单词库和宠物物品。'
        : '咁會清除晒你嘅 XP、記錄、單詞庫同寵物嘢。',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: locale === 'en' ? 'Reset' : locale === 'zh-CN' ? '重置' : '重設',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'RESTORE_STATE', payload: {
              scene: 'daily',
              difficulty: 'beginner',
              sessionCount: 0,
              totalSpeeches: 0,
              totalWords: 0,
              businessCount: 0, ieltsCount: 0, dailyCount: 0,
              restaurantCount: 0, interviewCount: 0, datingCount: 0, doctorCount: 0,
              analysisHistory: [],
              bestScores: { overall: 0, fluency: 0, vocabulary: 0, pronunciation: 0, grammar: 0 },
              maxUniqueWords: 0, bestFluency: 0, bestPronunciation: 0,
              streak: 0, lastPracticeDate: null,
              unlockedAchievements: [],
              xp: 0, level: 1,
              activePet: 'cat',
              petName: 'Mimi',
              petOutfit: null,
              petBackground: 'garden',
              petCoins: 100,
              petHunger: 80, petIntimacy: 50,
              ownedPets: ['cat'], ownedItems: [],
              petFurniture: [],
              customVocab: [],
              courseProgress: {},
              locale: state.locale,
            } });
            Alert.alert(
              locale === 'en' ? 'Done' : locale === 'zh-CN' ? '完成' : '完成',
              locale === 'en' ? 'All data has been reset' : locale === 'zh-CN' ? '所有数据已重置' : '所有數據已重設',
            );
          },
        },
      ],
    );
  };

  return (
    <View style={s.root}>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
        <Text style={s.backTxt}>{t('common.back')}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={[s.title, FX]}>{t('settings.title')}</Text>
        <Text style={s.subtitle}>Settings</Text>

        {/* Language */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>🌐 {t('settings.language')}</Text>
          {LOCALES.map(opt => {
            const active = locale === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[s.row, active && s.rowOn]}
                onPress={() => pickLocale(opt.key)}
                activeOpacity={0.85}
              >
                <Text style={s.rowFlag}>{opt.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.rowLabel, active && s.rowLabelOn, FB]}>{opt.label}</Text>
                  <Text style={s.rowSub}>
                    {opt.key === 'zh-HK' ? '繁體中文' : opt.key === 'en' ? 'English' : '简体中文'}
                  </Text>
                </View>
                {active && <Text style={s.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Pet */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>🐱 {locale === 'en' ? 'Pet' : locale === 'zh-CN' ? '宠物' : '寵物'}</Text>
          <View style={s.petInfo}>
            <View style={s.petInfoRow}>
              <Text style={s.petInfoLab}>{locale === 'en' ? 'Name' : locale === 'zh-CN' ? '名字' : '名'}</Text>
              <Text style={s.petInfoVal}>{state.petName}</Text>
            </View>
            <View style={s.petInfoRow}>
              <Text style={s.petInfoLab}>{locale === 'en' ? 'Coins' : locale === 'zh-CN' ? '金币' : '金幣'}</Text>
              <Text style={s.petInfoVal}>🪙 {state.petCoins}</Text>
            </View>
            <View style={s.petInfoRow}>
              <Text style={s.petInfoLab}>{locale === 'en' ? 'XP' : 'XP'}</Text>
              <Text style={s.petInfoVal}>⭐ {state.xp}</Text>
            </View>
            <View style={s.petInfoRow}>
              <Text style={s.petInfoLab}>{locale === 'en' ? 'Level' : locale === 'zh-CN' ? '等级' : '等級'}</Text>
              <Text style={s.petInfoVal}>Lv.{state.level}</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>ℹ️ {t('settings.about')}</Text>
          <View style={s.aboutCard}>
            <Text style={s.aboutTitle}>English Coach</Text>
            <Text style={s.aboutVersion}>v1.0.0 · Expo SDK 54</Text>
            <Text style={s.aboutBody}>
              {locale === 'en'
                ? 'Practice English with AI chat, scenarios, and lessons. Track your progress and unlock achievements.'
                : locale === 'zh-CN'
                ? '通过 AI 聊天、场景和课程练习英语。追踪你的进度并解锁成就。'
                : '同 AI 傾偈、唔同場景練習、同埋睇住自己嘅進度。'}
            </Text>
          </View>
        </View>

        {/* Danger zone */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>⚠️ {locale === 'en' ? 'Danger Zone' : locale === 'zh-CN' ? '危险区' : '危險區'}</Text>
          <TouchableOpacity style={s.dangerBtn} onPress={resetData} activeOpacity={0.85}>
            <Text style={s.dangerBtnTxt}>
              {locale === 'en' ? '🗑️ Reset all data' : locale === 'zh-CN' ? '🗑️ 重置所有数据' : '🗑️ 重設所有數據'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { position: 'absolute', top: 18, left: 16, zIndex: 10, padding: 8 },
  backTxt: { fontSize: 15, color: PINK, fontWeight: '700' },

  title: { fontSize: 30, color: PINK, textAlign: 'center', letterSpacing: 0.3 },
  subtitle: { fontSize: 13, color: MUTED, textAlign: 'center', marginBottom: 22, fontWeight: '600' },

  section: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: PINK,
    fontWeight: '800',
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: CREAM,
  },
  rowOn: { backgroundColor: PINK_SOFT, borderWidth: 1.5, borderColor: PINK },
  rowFlag: { fontSize: 28, marginRight: 12 },
  rowLabel: { fontSize: 14, color: INK, marginBottom: 2 },
  rowLabelOn: { color: PINK },
  rowSub: { fontSize: 11, color: SUBINK },
  check: { fontSize: 18, color: PINK, fontWeight: '800' },

  petInfo: {},
  petInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5e8de',
  },
  petInfoLab: { fontSize: 13, color: SUBINK, fontWeight: '500' },
  petInfoVal: { fontSize: 13, color: INK, fontWeight: '800' },

  aboutCard: { alignItems: 'center', paddingVertical: 8 },
  aboutTitle: { fontSize: 18, color: INK, fontWeight: '800', marginBottom: 4 },
  aboutVersion: { fontSize: 11, color: MUTED, marginBottom: 12, fontWeight: '600' },
  aboutBody: { fontSize: 12, color: SUBINK, lineHeight: 18, textAlign: 'center' },

  dangerBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e8927f',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  dangerBtnTxt: { color: PINK, fontSize: 13, fontWeight: '800' },
});
