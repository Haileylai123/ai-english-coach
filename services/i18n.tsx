import React, { createContext, useContext, useMemo, useCallback, ReactNode } from 'react';
import { useStore } from './store';

export type Locale = 'zh-HK' | 'en' | 'zh-CN';

const ZH_HK: Record<string, string> = {
  // Common
  'common.back': '← 返回',
  'common.next': '下一步',
  'common.start': '開始',
  'common.continue': '繼續',
  'common.cancel': '取消',
  'common.save': '儲存',
  'common.close': '關閉',
  'common.delete': '刪除',
  'common.add': '新增',
  'common.search': '搜尋',
  'common.loading': '載入中...',
  'common.you': '你',

  // Tabs
  'tab.chat': '傾偈',
  'tab.world': '世界',
  'tab.learn': '學習',
  'tab.vocab': '詞彙',
  'tab.games': '遊戲',
  'tab.stats': '統計',
  'tab.shop': '商店',

  // Chat
  'chat.title': '傾偈練習',
  'chat.subtitle': '同 AI 朋友練英文',
  'chat.input.placeholder': '用英文打一句...',
  'chat.send': '送出',
  'chat.tapToVocab': '長按句子可以加入單詞庫',

  // Stats
  'stats.title': 'My Progress',
  'stats.bestScores': 'Best Scores',
  'stats.stats': 'Stats',
  'stats.recent': 'Recent',
  'stats.achievements': '🏆 Achievements',
  'stats.viewAll': '查看全部 →',
  'stats.leaderboard': '查看排行榜',
  'stats.leaderboardSub': '睇下你同其他朋友嘅排名',

  // Leaderboard
  'lb.title': '排行榜',
  'lb.subtitle': 'Leaderboard',
  'lb.yourRank': '你嘅排名 Your Rank',
  'lb.type': '排行類別',
  'lb.full': '完整排名',
  'lb.allTime': '📅 全部時間',
  'lb.thisWeek': '📆 本週',
  'lb.note': 'ℹ️ 排行榜用本地 demo 朋友數據。\n之後會加入 backend 支援真正嘅朋友比拼。',

  // Vocab
  'vocab.title': '單詞庫',
  'vocab.search.placeholder': '搜尋英文或中文...',
  'vocab.myWords': 'My Words',
  'vocab.addWord': '➕ 加單詞',
  'vocab.dict.lookup': '字典',
  'vocab.dict.empty': '搜尋一個英文生字查看解釋...',
  'vocab.dict.loading': '搵緊字典...',
  'vocab.dict.error': '搵唔到呢個字',

  // Learn
  'learn.title': '學習課程',
  'learn.subtitle': '跟住課程循序漸進',
  'learn.continue': '繼續學習',
  'learn.start': '開始',
  'learn.complete': '✅ 完成 +5 XP',

  // Games
  'games.title': '遊戲',

  // Shop
  'shop.title': '商店',

  // History
  'history.title': '學習記錄',
  'history.all': '全部',
  'history.high': '高分 (80+)',
  'history.low': '低分 (<60)',
  'history.empty': '未有記錄，去練習啦！',

  // Skits
  'skits.title': '短劇',
  'skits.roleA': '角色 A',
  'skits.roleB': '角色 B',
  'skits.playAll': '▶️ 播放成段',
  'skits.youAre': '你係',

  // TED
  'ted.title': 'TED 演講',
  'ted.subtitle': 'Practice TED-style Talks',
  'ted.analyze': '🔍 分析 Analyze',
  'ted.listen': '🔊 聽題目',
  'ted.again': '🔄 再講一次',

  // Settings
  'settings.title': '設定',
  'settings.language': '語言 Language',
  'settings.zh-HK': '繁體中文（廣東話）',
  'settings.en': 'English',
  'settings.zh-CN': '简体中文',
  'settings.theme': '主題',
  'settings.about': '關於',

  // Picker modal
  'picker.title': '揀一個生字',
  'picker.placeholder': '中文解釋（可選）',
  'picker.save': '加入單詞庫',
};

const EN: Record<string, string> = {
  'common.back': '← Back',
  'common.next': 'Next',
  'common.start': 'Start',
  'common.continue': 'Continue',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.close': 'Close',
  'common.delete': 'Delete',
  'common.add': 'Add',
  'common.search': 'Search',
  'common.loading': 'Loading...',
  'common.you': 'You',

  'tab.chat': 'Chat',
  'tab.world': 'World',
  'tab.learn': 'Learn',
  'tab.vocab': 'Vocab',
  'tab.games': 'Games',
  'tab.stats': 'Stats',
  'tab.shop': 'Shop',

  'chat.title': 'Chat Practice',
  'chat.subtitle': 'Practice English with your AI friend',
  'chat.input.placeholder': 'Type a sentence in English...',
  'chat.send': 'Send',
  'chat.tapToVocab': 'Long-press a sentence to save words',

  'stats.title': 'My Progress',
  'stats.bestScores': 'Best Scores',
  'stats.stats': 'Stats',
  'stats.recent': 'Recent',
  'stats.achievements': '🏆 Achievements',
  'stats.viewAll': 'View all →',
  'stats.leaderboard': 'View Leaderboard',
  'stats.leaderboardSub': 'See how you rank with friends',

  'lb.title': 'Leaderboard',
  'lb.subtitle': 'Leaderboard',
  'lb.yourRank': 'Your Rank',
  'lb.type': 'Category',
  'lb.full': 'Full Ranking',
  'lb.allTime': '📅 All Time',
  'lb.thisWeek': '📆 This Week',
  'lb.note': 'ℹ️ Leaderboard uses local demo friends data.\nA real backend will be added later.',

  'vocab.title': 'Vocabulary',
  'vocab.search.placeholder': 'Search English or Chinese...',
  'vocab.myWords': 'My Words',
  'vocab.addWord': '➕ Add Word',
  'vocab.dict.lookup': 'Dictionary',
  'vocab.dict.empty': 'Search an English word to see its definition...',
  'vocab.dict.loading': 'Looking up dictionary...',
  'vocab.dict.error': 'Word not found',

  'learn.title': 'Learning Courses',
  'learn.subtitle': 'Step-by-step lessons',
  'learn.continue': 'Continue',
  'learn.start': 'Start',
  'learn.complete': '✅ Complete +5 XP',

  'games.title': 'Games',

  'shop.title': 'Shop',

  'history.title': 'Learning History',
  'history.all': 'All',
  'history.high': 'High (80+)',
  'history.low': 'Low (<60)',
  'history.empty': 'No records yet. Let\'s practice!',

  'skits.title': 'Skits',
  'skits.roleA': 'Role A',
  'skits.roleB': 'Role B',
  'skits.playAll': '▶️ Play All',
  'skits.youAre': 'You are',

  'ted.title': 'TED Talks',
  'ted.subtitle': 'Practice TED-style Talks',
  'ted.analyze': '🔍 Analyze',
  'ted.listen': '🔊 Listen',
  'ted.again': '🔄 Try Again',

  'settings.title': 'Settings',
  'settings.language': 'Language 語言',
  'settings.zh-HK': '繁體中文（廣東話）',
  'settings.en': 'English',
  'settings.zh-CN': '简体中文',
  'settings.theme': 'Theme',
  'settings.about': 'About',

  'picker.title': 'Pick a word',
  'picker.placeholder': 'Chinese meaning (optional)',
  'picker.save': 'Add to My Words',
};

const ZH_CN: Record<string, string> = {
  'common.back': '← 返回',
  'common.next': '下一步',
  'common.start': '开始',
  'common.continue': '继续',
  'common.cancel': '取消',
  'common.save': '保存',
  'common.close': '关闭',
  'common.delete': '删除',
  'common.add': '新增',
  'common.search': '搜索',
  'common.loading': '加载中...',
  'common.you': '你',

  'tab.chat': '聊天',
  'tab.world': '世界',
  'tab.learn': '学习',
  'tab.vocab': '词汇',
  'tab.games': '游戏',
  'tab.stats': '统计',
  'tab.shop': '商店',

  'chat.title': '聊天练习',
  'chat.subtitle': '和 AI 朋友练英语',
  'chat.input.placeholder': '用英文打一句...',
  'chat.send': '发送',
  'chat.tapToVocab': '长按句子可以加入单词库',

  'stats.title': 'My Progress',
  'stats.bestScores': 'Best Scores',
  'stats.stats': 'Stats',
  'stats.recent': 'Recent',
  'stats.achievements': '🏆 Achievements',
  'stats.viewAll': '查看全部 →',
  'stats.leaderboard': '查看排行榜',
  'stats.leaderboardSub': '看看你和其他朋友的排名',

  'lb.title': '排行榜',
  'lb.subtitle': 'Leaderboard',
  'lb.yourRank': '你的排名',
  'lb.type': '排行类别',
  'lb.full': '完整排名',
  'lb.allTime': '📅 全部时间',
  'lb.thisWeek': '📆 本周',
  'lb.note': 'ℹ️ 排行榜使用本地 demo 朋友数据。\n之后会加入 backend 支持真正的朋友比拼。',

  'vocab.title': '单词库',
  'vocab.search.placeholder': '搜索英文或中文...',
  'vocab.myWords': 'My Words',
  'vocab.addWord': '➕ 加单词',
  'vocab.dict.lookup': '字典',
  'vocab.dict.empty': '搜索一个英文生字查看解释...',
  'vocab.dict.loading': '正在查找字典...',
  'vocab.dict.error': '找不到这个字',

  'learn.title': '学习课程',
  'learn.subtitle': '按课程循序渐进',
  'learn.continue': '继续学习',
  'learn.start': '开始',
  'learn.complete': '✅ 完成 +5 XP',

  'games.title': '游戏',

  'shop.title': '商店',

  'history.title': '学习记录',
  'history.all': '全部',
  'history.high': '高分 (80+)',
  'history.low': '低分 (<60)',
  'history.empty': '暂无记录，去练习吧！',

  'skits.title': '短剧',
  'skits.roleA': '角色 A',
  'skits.roleB': '角色 B',
  'skits.playAll': '▶️ 播放整段',
  'skits.youAre': '你是',

  'ted.title': 'TED 演讲',
  'ted.subtitle': 'Practice TED-style Talks',
  'ted.analyze': '🔍 分析',
  'ted.listen': '🔊 听题目',
  'ted.again': '🔄 再讲一次',

  'settings.title': '设置',
  'settings.language': '语言 Language',
  'settings.zh-HK': '繁體中文（廣東話）',
  'settings.en': 'English',
  'settings.zh-CN': '简体中文',
  'settings.theme': '主题',
  'settings.about': '关于',

  'picker.title': '选一个生字',
  'picker.placeholder': '中文释义（可选）',
  'picker.save': '加入单词库',
};

const LOCALES: Record<Locale, Record<string, string>> = {
  'zh-HK': ZH_HK,
  'en': EN,
  'zh-CN': ZH_CN,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { state, dispatch } = useStore();
  const locale: Locale = (state.locale as Locale) || 'zh-HK';

  const setLocale = useCallback((l: Locale) => {
    dispatch({ type: 'SET_LOCALE', payload: l });
  }, [dispatch]);

  const t = useCallback((key: string) => {
    return LOCALES[locale]?.[key] ?? LOCALES['en'][key] ?? key;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback for screens not wrapped in provider
    return {
      locale: 'zh-HK' as Locale,
      setLocale: () => {},
      t: (k: string) => LOCALES['en'][k] ?? k,
    };
  }
  return ctx;
}
