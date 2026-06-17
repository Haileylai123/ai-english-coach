// components/OverflowMenu.tsx — Top-right "···" menu
// Slide-up action sheet listing all secondary screens (Learn, Vocab, Games,
// Daily Challenge, Leaderboard, Settings, About).
//
// Usage:
//   const [open, setOpen] = useState(false);
//   <TouchableOpacity onPress={() => setOpen(true)}><Text>···</Text></TouchableOpacity>
//   <OverflowMenu visible={open} onClose={() => setOpen(false)} />

import React from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity,
  TouchableWithoutFeedback, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useI18n } from '../services/i18n';

const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';
const BORDER = '#f0e0d0';

const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };

interface MenuItem {
  key: string;
  icon: string;
  labelKey: string;
  route: string;
  badge?: 'NEW' | 'PRO' | null;
  proOnly?: boolean;
}

const ITEMS: MenuItem[] = [
  { key: 'learn',       icon: '📚', labelKey: 'menu.learn',       route: '/learn' },
  { key: 'vocab',       icon: '📖', labelKey: 'menu.vocab',       route: '/vocab' },
  { key: 'games',       icon: '🎮', labelKey: 'menu.games',       route: '/games' },
  { key: 'daily',       icon: '🎯', labelKey: 'menu.daily',       route: '/daily-challenge', badge: 'NEW' },
  { key: 'leaderboard', icon: '🏆', labelKey: 'menu.leaderboard', route: '/leaderboard' },
  { key: 'settings',    icon: '⚙️', labelKey: 'menu.settings',    route: '/settings' },
  { key: 'about',       icon: '🐱', labelKey: 'menu.about',       route: '/modal' },
];

interface OverflowMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function OverflowMenu({ visible, onClose }: OverflowMenuProps) {
  const router = useRouter();
  const { t, locale } = useI18n();

  const go = (route: string) => {
    onClose();
    // Small delay so the modal close animation doesn't fight the route push
    setTimeout(() => router.push(route as any), 80);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={s.backdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={s.sheet}>
              {/* Drag handle */}
              <View style={s.handle} />

              {/* Header */}
              <View style={s.header}>
                <Text style={s.headerTitle}>{t('menu.title') || '更多 More'}</Text>
                <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
                  <Text style={s.closeTxt}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Items */}
              <ScrollView
                style={s.list}
                contentContainerStyle={s.listContent}
                showsVerticalScrollIndicator={false}
              >
                {ITEMS.map((item, idx) => (
                  <View key={item.key}>
                    <TouchableOpacity
                      style={s.row}
                      onPress={() => go(item.route)}
                      activeOpacity={0.7}
                    >
                      <View style={s.iconBox}>
                        <Text style={s.iconTxt}>{item.icon}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.rowLabel}>
                          {t(item.labelKey) || item.key}
                        </Text>
                      </View>
                      {item.badge && (
                        <View style={s.badge}>
                          <Text style={s.badgeTxt}>{item.badge}</Text>
                        </View>
                      )}
                      <Text style={s.chev}>›</Text>
                    </TouchableOpacity>
                    {idx < ITEMS.length - 1 && <View style={s.sep} />}
                  </View>
                ))}

                <View style={{ height: 16 }} />
                <Text style={s.foot}>English Coach · v1.0</Text>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(45, 30, 25, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  handle: {
    width: 42, height: 5, borderRadius: 3,
    backgroundColor: MUTED,
    alignSelf: 'center',
    marginTop: 8, marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerTitle: {
    fontSize: 17, color: INK, fontWeight: '800', ...FB,
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: PINK_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  closeTxt: { fontSize: 14, color: PINK, fontWeight: '800' },

  list: { flexGrow: 0 },
  listContent: { paddingHorizontal: 8, paddingTop: 4 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: 12,
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: CREAM,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  iconTxt: { fontSize: 22 },
  rowLabel: { fontSize: 15, color: INK, fontWeight: '700', ...FB },
  chev: { fontSize: 22, color: MUTED, marginLeft: 4, fontWeight: '300' },

  badge: {
    backgroundColor: PINK,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 8, marginRight: 8,
  },
  badgeTxt: { color: '#fff', fontSize: 9, fontWeight: '800' },

  sep: { height: 1, backgroundColor: '#faf3ee', marginLeft: 66 },

  foot: {
    textAlign: 'center', color: MUTED,
    fontSize: 11, fontWeight: '600', marginTop: 4, ...F,
  },
});
