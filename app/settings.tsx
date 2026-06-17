import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../services/store';
import { useI18n, Locale } from '../services/i18n';
import { initNotifications, scheduleStreakReminder, cancelAll, isAvailable } from '../services/notifications';
import * as backend from '../services/backend';
import { TTS_VOICES, type TtsVoiceKey } from '../services/backend';
import { getPreferredVoice, setPreferredVoice, speak as ttsSpeak } from '../services/tts';

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#ffffff';
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
  { key: 'ja', label: '日本語', flag: '🇯🇵' },
  { key: 'ko', label: '한국어', flag: '🇰🇷' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const { t, locale, setLocale } = useI18n();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [aiUsage, setAiUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null);
  const [subInfo, setSubInfo] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);
  const [ttsVoice, setTtsVoice] = useState<TtsVoiceKey>('en_warm_woman');
  const [ttsTesting, setTtsTesting] = useState(false);
  const notifAvailable = isAvailable();

  useEffect(() => {
    initNotifications().then(granted => {
      if (granted) setNotifEnabled(true);
    });
    getPreferredVoice().then(setTtsVoice);
    if (state.account.loggedIn) {
      backend.getAiUsage().then(setAiUsage).catch(() => {});
      backend.getSubscription().then(setSubInfo).catch(() => {});
    }
  }, [state.account.loggedIn]);

  const handleTestTts = async () => {
    setTtsTesting(true);
    try {
      const sample = locale === 'en'
        ? 'Hello! Welcome to English Coach. I am your AI speaking partner.'
        : locale === 'zh-CN'
          ? '你好！欢迎来到英语教练。我是你的AI口语伙伴。'
          : '你好！歡迎嚟到 English Coach。我係你嘅 AI 會話伙伴。';
      await ttsSpeak(sample, ttsVoice, { speed: 1.0 });
      Alert.alert('TTS OK ✅', `Played voice: ${ttsVoice}`);
    } catch (e: any) {
      Alert.alert('TTS Error ❌', `${e?.message || 'Failed'}\n\nPlatform: ${(window as any)?.navigator?.userAgent?.includes('Safari') ? 'Safari' : 'Other'}`);
    } finally {
      setTtsTesting(false);
    }
  };

  const handleSelectVoice = async (key: TtsVoiceKey) => {
    setTtsVoice(key);
    await setPreferredVoice(key);
    // Auto-play sample so user hears the change immediately
    setTtsTesting(true);
    try {
      const sample = 'Hi! This is ' + key.replace(/_/g, ' ') + '.';
      await ttsSpeak(sample, key, { speed: 1.0 });
    } catch (e: any) {
      Alert.alert('Voice change failed', e?.message || 'Try again');
    } finally {
      setTtsTesting(false);
    }
  };

  const handleSync = async () => {
    if (!state.account.loggedIn) return;
    setSyncing(true);
    dispatch({ type: 'SET_SYNCING', payload: true });
    try {
      const r = await backend.syncUserState(state);
      if (r.ok) {
        dispatch({ type: 'SET_LAST_SYNC', payload: Date.now() });
        Alert.alert(locale === 'en' ? 'Synced ✓' : locale === 'zh-CN' ? '已同步 ✓' : '已同步 ✓');
        // Refresh AI usage
        backend.getAiUsage().then(setAiUsage).catch(() => {});
      } else {
        Alert.alert(locale === 'en' ? 'Sync failed' : locale === 'zh-CN' ? '同步失败' : '同步失敗', r.error || '');
      }
    } finally {
      setSyncing(false);
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

  const handleTestPush = async () => {
    try {
      const r = await backend.sendTestPush();
      Alert.alert(
        locale === 'en' ? 'Sent!' : locale === 'zh-CN' ? '已发送！' : '已送出！',
        `${r.sent} sent, ${r.errors} errors`
      );
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      locale === 'en' ? 'Log out?' : locale === 'zh-CN' ? '退出登录？' : '登出?',
      locale === 'en' ? 'Your local data stays on this device.' : locale === 'zh-CN' ? '本地数据会保留在此设备。' : '本地資料會保留喺呢部機。',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: locale === 'en' ? 'Log out' : locale === 'zh-CN' ? '退出' : '登出',
          style: 'destructive',
          onPress: async () => {
            await backend.logout();
            dispatch({ type: 'SET_ACCOUNT', payload: { loggedIn: false, user: null } });
          },
        },
      ],
    );
  };

  const toggleNotif = async (val: boolean) => {
    if (val) {
      const granted = await initNotifications();
      if (granted) {
        await scheduleStreakReminder(20, 0); // 8 PM
        setNotifEnabled(true);
      } else {
        Alert.alert(
          locale === 'en' ? 'Permission needed' : '需要權限',
          locale === 'en' ? 'Please enable notifications in system settings' : '請去系統設定開啟通知',
        );
      }
    } else {
      await cancelAll();
      setNotifEnabled(false);
    }
  };

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
              tedCount: 0, keigoCount: 0, izakayaCount: 0, toeicCount: 0, jobHuntJpCount: 0, jobHuntKrCount: 0,
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

        {/* Notifications */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>🔔 {locale === 'en' ? 'Notifications' : locale === 'zh-CN' ? '通知' : '通知'}</Text>
          {!notifAvailable && (
            <Text style={s.notifHint}>
              {locale === 'en' ? '⚠️ Run `npx expo install expo-notifications` to enable' : '⚠️ 跑 `npx expo install expo-notifications` 開啟'}
            </Text>
          )}
          {notifAvailable && (
            <View style={s.notifRow}>
              <View style={{ flex: 1 }}>
                <Text style={[s.rowLabel, FB]}>
                  {locale === 'en' ? 'Daily streak reminder' : locale === 'zh-CN' ? '每日打卡提醒' : '每日打卡提醒'}
                </Text>
                <Text style={s.rowSub}>
                  {locale === 'en' ? 'At 8:00 PM every day' : locale === 'zh-CN' ? '每晚 8 点' : '每晚 8 點'}
                </Text>
              </View>
              <Switch
                value={notifEnabled}
                onValueChange={toggleNotif}
                trackColor={{ false: '#e0d0c0', true: PINK }}
                thumbColor="#fff"
              />
            </View>
          )}
        </View>

        {/* TTS Voice (Minimax) */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>🔊 {locale === 'en' ? 'AI Voice' : locale === 'zh-CN' ? 'AI 语音' : 'AI 語音'}</Text>
          <Text style={{ fontSize: 12, color: SUBINK, marginBottom: 12 }}>
            {locale === 'en' ? 'Choose a voice for AI responses' : locale === 'zh-CN' ? '选择 AI 回复使用的语音' : '選擇 AI 回覆使用嘅聲音'}
          </Text>
          {TTS_VOICES.map(v => (
            <TouchableOpacity
              key={v.key}
              style={[s.row, ttsVoice === v.key && s.rowOn]}
              onPress={() => handleSelectVoice(v.key)}
              disabled={ttsTesting}
            >
              <Text style={s.rowFlag}>🎙️</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.rowLabel, ttsVoice === v.key && s.rowLabelOn]}>
                  {v.label}
                </Text>
              </View>
              {ttsVoice === v.key && <Text style={s.check}>✓</Text>}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[s.upgradeBtn, ttsTesting && { opacity: 0.5 }]}
            onPress={handleTestTts}
            disabled={ttsTesting}
          >
            <Text style={s.upgradeBtnTxt}>
              {ttsTesting ? '...' : (locale === 'en' ? '▶ Test voice' : locale === 'zh-CN' ? '▶ 测试语音' : '▶ 試聽聲音')}
            </Text>
            <Text style={s.upgradeBtnSub}>Minimax</Text>
          </TouchableOpacity>
        </View>

        {/* Account (Cloudflare backend) */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>☁️ {locale === 'en' ? 'Account' : locale === 'zh-CN' ? '账户' : '帳戶'}</Text>
          {!state.account.loggedIn && (
            <TouchableOpacity
              style={[s.upgradeBtn, { backgroundColor: PINK }]}
              onPress={() => router.push('/auth')}
              activeOpacity={0.85}
            >
              <Text style={s.upgradeBtnTxt}>
                {locale === 'en' ? '🔐 Login / Sign up' : locale === 'zh-CN' ? '🔐 登录 / 注册' : '🔐 登入 / 開新帳號'}
              </Text>
              <Text style={s.upgradeBtnSub}>
                {locale === 'en' ? 'Required for AI voice + chat' : locale === 'zh-CN' ? '使用 AI 语音和聊天' : '用 AI 語音同傾偈'}
              </Text>
            </TouchableOpacity>
          )}
          {state.account.loggedIn ? (
            <>
              <View style={s.petInfoRow}>
                <Text style={s.petInfoLab}>{locale === 'en' ? 'Email' : locale === 'zh-CN' ? '邮箱' : '電郵'}</Text>
                <Text style={s.petInfoVal}>{state.account.email}</Text>
              </View>
              <View style={s.petInfoRow}>
                <Text style={s.petInfoLab}>{locale === 'en' ? 'Plan' : locale === 'zh-CN' ? '方案' : '方案'}</Text>
                <Text style={s.petInfoVal}>
                  {state.account.tier === 'premium' ? '👑 Premium' : state.account.tier === 'pro' ? '⭐ Pro' : '🆓 Free'}
                  {state.account.tier === 'free' && subInfo?.pricing?.pro && (
                    <Text style={{ color: MUTED, fontSize: 11 }}>
                      {' · '}{locale === 'ja' ? 'Pro' : locale === 'ko' ? '프로' : locale === 'zh-CN' ? '专业版' : 'Pro'}: {subInfo.pricing.pro.symbol}{subInfo.pricing.pro.monthly}/{locale === 'ja' ? '月' : locale === 'ko' ? '월' : 'mo'}
                    </Text>
                  )}
                </Text>
              </View>
              {state.account.tier === 'free' && (
                <TouchableOpacity
                  style={s.upgradeBtn}
                  onPress={() => router.push('/paywall')}
                  activeOpacity={0.85}
                >
                  <Text style={s.upgradeBtnTxt}>🚀 {locale === 'en' ? 'Upgrade to Pro' : locale === 'zh-CN' ? '升级 Pro' : '升級 Pro'}</Text>
                  {subInfo?.pricing?.pro && (
                    <Text style={s.upgradeBtnSub}>
                      {subInfo.pricing.pro.symbol}{subInfo.pricing.pro.monthly}/{locale === 'ja' ? '月' : locale === 'ko' ? '월' : locale === 'en' ? 'mo' : '月'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              {aiUsage && (
                <View style={s.petInfoRow}>
                  <Text style={s.petInfoLab}>{locale === 'en' ? 'AI today' : locale === 'zh-CN' ? '今日 AI' : '今日 AI'}</Text>
                  <Text style={s.petInfoVal}>
                    {aiUsage.used} / {aiUsage.limit === Infinity ? '∞' : aiUsage.limit}
                  </Text>
                </View>
              )}
              {state.lastSyncAt && (
                <View style={s.petInfoRow}>
                  <Text style={s.petInfoLab}>{locale === 'en' ? 'Last sync' : locale === 'zh-CN' ? '上次同步' : '上次同步'}</Text>
                  <Text style={s.petInfoVal}>{new Date(state.lastSyncAt).toLocaleTimeString()}</Text>
                </View>
              )}
              <TouchableOpacity
                style={[s.row, syncing && { opacity: 0.6 }]}
                onPress={handleSync}
                disabled={syncing}
                activeOpacity={0.85}
              >
                <Text style={s.rowFlag}>🔄</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.rowLabel, FB]}>
                    {syncing
                      ? (locale === 'en' ? 'Syncing...' : locale === 'zh-CN' ? '同步中...' : '同步緊...')
                      : (locale === 'en' ? 'Sync now' : locale === 'zh-CN' ? '立即同步' : '即刻同步')}
                  </Text>
                  <Text style={s.rowSub}>
                    {locale === 'en' ? 'Push your progress to the cloud' : locale === 'zh-CN' ? '将进度推送到云端' : '將進度推送去雲端'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={s.row} onPress={handleTestPush} activeOpacity={0.85}>
                <Text style={s.rowFlag}>🔔</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.rowLabel, FB]}>
                    {locale === 'en' ? 'Send test push' : locale === 'zh-CN' ? '发送测试推送' : '送測試推播'}
                  </Text>
                  <Text style={s.rowSub}>
                    {locale === 'en' ? 'Verify notifications work' : locale === 'zh-CN' ? '验证通知功能' : '測試推播收到未'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={s.dangerBtn} onPress={handleLogout} activeOpacity={0.85}>
                <Text style={s.dangerBtnTxt}>
                  {locale === 'en' ? '🚪 Log out' : locale === 'zh-CN' ? '🚪 退出登录' : '🚪 登出'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={s.row}
              onPress={() => router.push('/auth')}
              activeOpacity={0.85}
            >
              <Text style={s.rowFlag}>☁️</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.rowLabel, FB]}>
                  {locale === 'en' ? 'Log in / Sign up' : locale === 'zh-CN' ? '登录 / 注册' : '登入 / 註冊'}
                </Text>
                <Text style={s.rowSub}>
                  {locale === 'en' ? 'Sync your progress across devices' : locale === 'zh-CN' ? '跨设备同步你的进度' : '跨設備同步你嘅進度'}
                </Text>
              </View>
              <Text style={s.check}>›</Text>
            </TouchableOpacity>
          )}
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
  backBtn: { position: 'absolute', top: 60, left: 16, zIndex: 10, padding: 8 },
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

  upgradeBtn: { backgroundColor: PINK, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 14, marginTop: 10, marginBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: PINK, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 3 },
  upgradeBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },
  upgradeBtnSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700' },

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

  notifRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  notifHint: { fontSize: 12, color: SUBINK, lineHeight: 18, fontWeight: '500' },

  // TTS voice selector (aliases of row/rowOn styles for clarity)
  langRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, marginBottom: 6, backgroundColor: CREAM },
  langFlag: { fontSize: 24, marginRight: 12 },
  langLabel: { fontSize: 14, color: INK, fontWeight: '500' },
  langLabelOn: { color: PINK, fontWeight: '800' },
  btn: { backgroundColor: PINK, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
