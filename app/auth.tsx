// app/auth.tsx — Login / Register screen
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../services/store';
import * as api from '../services/api';
import { useI18n } from '../services/i18n';

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';

const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };

export default function AuthScreen() {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const { t, locale } = useI18n();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const isEn = locale === 'en';
  const isCn = locale === 'zh-CN';

  const submit = async () => {
    if (!email || !password) {
      Alert.alert('...', isEn ? 'Please enter email and password' : isCn ? '请输入邮箱和密码' : '請輸入電郵同密碼');
      return;
    }
    if (password.length < 6) {
      Alert.alert('...', isEn ? 'Password must be at least 6 characters' : isCn ? '密码至少6位' : '密碼至少6位');
      return;
    }
    setLoading(true);
    try {
      const user = mode === 'login' ? await api.login(email, password) : await api.register(email, password, displayName || undefined);
      dispatch({ type: 'SET_ACCOUNT', payload: { loggedIn: true, user: { id: user.id, email: user.email, displayName: user.display_name, tier: user.tier || 'free' } } });
      Alert.alert(
        isEn ? 'Welcome!' : isCn ? '欢迎！' : '歡迎！',
        isEn ? `Hello, ${user.display_name || user.email}` : isCn ? `你好,${user.display_name || user.email}` : `你好,${user.display_name || user.email}`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/chat') }]
      );
    } catch (e: any) {
      Alert.alert(isEn ? 'Error' : isCn ? '出错' : '出咗事', e.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.85}>
          <Text style={s.backTxt}>{t('common.back')}</Text>
        </TouchableOpacity>

        <View style={s.header}>
          <Text style={s.emoji}>☁️</Text>
          <Text style={[s.title, FX]}>
            {mode === 'login' ? (isEn ? 'Welcome Back' : isCn ? '欢迎回来' : '歡迎返嚟') : (isEn ? 'Create Account' : isCn ? '创建账号' : '開新帳號')}
          </Text>
          <Text style={s.subtitle}>
            {mode === 'login'
              ? (isEn ? 'Log in to sync your progress' : isCn ? '登录以同步你的进度' : '登入嚟同步你嘅進度')
              : (isEn ? 'Save XP, vocab, and pet across devices' : isCn ? '跨设备保存 XP、词汇和宠物' : '跨設備保存 XP、詞彙同埋寵物')}
          </Text>
        </View>

        <View style={s.form}>
          {mode === 'register' && (
            <View style={s.field}>
              <Text style={s.label}>{isEn ? 'Display Name' : isCn ? '昵称' : '稱呼'}</Text>
              <TextInput
                style={s.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder={isEn ? 'Optional' : isCn ? '可选' : '可選'}
                placeholderTextColor={MUTED}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={s.field}>
            <Text style={s.label}>📧 Email</Text>
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={MUTED}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>

          <View style={s.field}>
            <Text style={s.label}>🔒 {isEn ? 'Password' : isCn ? '密码' : '密碼'}</Text>
            <TextInput
              style={s.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              placeholderTextColor={MUTED}
              secureTextEntry
              autoCapitalize="none"
            />
            {mode === 'register' && (
              <Text style={s.hint}>{isEn ? 'At least 6 characters' : isCn ? '至少 6 位' : '至少 6 位'}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[s.submit, loading && s.submitDisabled]}
            onPress={submit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.submitTxt}>
                {mode === 'login' ? (isEn ? 'Log In' : isCn ? '登录' : '登入') : (isEn ? 'Sign Up' : isCn ? '注册' : '註冊')}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={s.switchBtn}
            onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
            activeOpacity={0.85}
          >
            <Text style={s.switchTxt}>
              {mode === 'login'
                ? (isEn ? "Don't have an account? Sign up" : isCn ? '没有账号？注册' : '未有帳號?註冊')
                : (isEn ? 'Already have an account? Log in' : isCn ? '已有账号?登录' : '已經有帳號?登入')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={s.privacyBox}>
          <Text style={s.privacyTxt}>
            🔒 {isEn
              ? 'Your data is encrypted. We never share your email.'
              : isCn
              ? '你的数据已加密。我们永不分享你的邮箱。'
              : '你嘅資料已加密。我哋永遠唔會分享你嘅電郵。'}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  content: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 },
  backBtn: { position: 'absolute', top: 18, left: 16, zIndex: 10, padding: 8 },
  backTxt: { fontSize: 15, color: PINK, fontWeight: '700' },

  header: { alignItems: 'center', marginTop: 24, marginBottom: 32 },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 28, color: PINK, marginBottom: 8 },
  subtitle: { fontSize: 14, color: SUBINK, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },

  form: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, color: INK, fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: CREAM,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: INK,
    borderWidth: 1,
    borderColor: '#f0e0d0',
  },
  hint: { fontSize: 11, color: MUTED, marginTop: 4 },

  submit: { backgroundColor: PINK, paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 4 },
  submitDisabled: { opacity: 0.6 },
  submitTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },

  switchBtn: { paddingVertical: 14, alignItems: 'center' },
  switchTxt: { color: PINK, fontSize: 13, fontWeight: '700' },

  privacyBox: { backgroundColor: PINK_SOFT, borderRadius: 12, padding: 12, marginTop: 16 },
  privacyTxt: { fontSize: 11, color: SUBINK, textAlign: 'center', lineHeight: 16, fontWeight: '500' },
});
