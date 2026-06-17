// services/emotions.ts — Emotion value system & achievements
// Ported from web version emotions.js

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  nameEn: string;
  desc: string;
  descEn: string;
}

export interface EmotionMessage {
  zh: string;
  en: string;
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', icon: '🌸', name: '初次開口', nameEn: 'First Words', desc: '完成第一次發言', descEn: 'Completed your first speech' },
  { id: 'ten', icon: '💪', name: '十句達人', nameEn: 'Ten Sentences', desc: '累計 10 次發言', descEn: 'Accumulated 10 speeches' },
  { id: 'fifty', icon: '🔥', name: '五十句勇士', nameEn: 'Fifty Speeches', desc: '累計 50 次發言', descEn: 'Accumulated 50 speeches' },
  { id: 'hundred', icon: '👑', name: '百句大師', nameEn: 'Century Master', desc: '累計 100 次發言', descEn: 'Accumulated 100 speeches' },
  { id: 'business5', icon: '💼', name: '商務精英', nameEn: 'Business Pro', desc: '商務場景練習 5 次', descEn: '5 business practices' },
  { id: 'ielts5', icon: '🎯', name: '雅思達人', nameEn: 'IELTS Master', desc: '雅思場景練習 5 次', descEn: '5 IELTS practices' },
  { id: 'daily5', icon: '💬', name: '聊天高手', nameEn: 'Chat Expert', desc: '日常場景練習 5 次', descEn: '5 daily chat practices' },
  { id: 'vocab20', icon: '📚', name: '詞彙大師', nameEn: 'Vocab Master', desc: '單次使用 20+ 獨特單詞', descEn: 'Used 20+ unique words in one session' },
  { id: 'fluency80', icon: '💨', name: '流利達人', nameEn: 'Fluency Pro', desc: '流利度達 80%+', descEn: 'Fluency score 80%+' },
  { id: 'pron90', icon: '🔊', name: '發音之星', nameEn: 'Pronunciation Star', desc: '發音準確度達 90%+', descEn: 'Pronunciation accuracy 90%+' },
  { id: 'streak3', icon: '🔥', name: '三天連續', nameEn: '3-Day Streak', desc: '連續練習 3 天', descEn: 'Practiced 3 days in a row' },
  { id: 'streak7', icon: '🌟', name: '七日王者', nameEn: '7-Day Champion', desc: '連續練習 7 天', descEn: 'Practiced 7 days in a row' },
  { id: 'restaurant', icon: '🍽️', name: '美食家', nameEn: 'Foodie', desc: '餐廳場景練習 3 次', descEn: '3 restaurant practices' },
  { id: 'interview', icon: '🤵', name: '面試達人', nameEn: 'Interview Pro', desc: '面試場景練習 3 次', descEn: '3 interview practices' },
  { id: 'dating', icon: '💕', name: '社交之星', nameEn: 'Social Star', desc: '約會場景練習 3 次', descEn: '3 dating practices' },
  { id: 'doctor', icon: '🩺', name: '健康達人', nameEn: 'Health Pro', desc: '醫生場景練習 3 次', descEn: '3 doctor visit practices' },
];

// Encouragement messages by category
export const ENCOURAGEMENT: Record<string, EmotionMessage[]> = {
  start: [
    { zh: '你已經踏出了最重要的一步！讚！', en: "You've taken the most important step — amazing!" },
    { zh: '每一次開口都是勇氣的表現！', en: 'Every word you speak shows courage!' },
    { zh: '別怕犯錯，錯誤是最好的老師！', en: "Don't fear mistakes — they're the best teachers!" },
    { zh: '今天又比昨天更進步了一點！', en: "Today you're already better than yesterday!" },
    { zh: '準備好了嗎？讓我們開始吧！', en: "Ready? Let's do this!" },
  ],
  during: [
    { zh: '說得很好！保持這個節奏！', en: 'Well said! Keep that rhythm!' },
    { zh: '你看，你比上一句更流利了！', en: "See? You're more fluent than your last sentence!" },
    { zh: '太棒了！這個詞用得很到位！', en: 'Excellent! That word was perfect in context!' },
    { zh: '哇，這個句子結構很漂亮！', en: 'Wow, that sentence structure is beautiful!' },
    { zh: '聽起來非常自然！', en: 'That sounds very natural!' },
  ],
  struggle: [
    { zh: '每個人都有卡住的時候，這很正常！', en: 'Everyone gets stuck sometimes — totally normal!' },
    { zh: '深呼吸，慢慢來，不著急。', en: 'Take a deep breath, slow down, no rush.' },
    { zh: '不是你不會，只是你還沒學會而已。', en: "It's not that you can't — you just haven't learned it yet." },
    { zh: '挫折是進步的必經之路。', en: 'Frustration is part of the path to progress.' },
    { zh: '我在這裡陪著你，我們一起來。', en: "I'm right here with you. Let's do this together." },
  ],
  complete: [
    { zh: '太棒了！今天的練習完成了！', en: "Excellent! Today's practice is complete!" },
    { zh: '你為自己的進步感到驕傲嗎？你應該！', en: 'Are you proud of your progress? You should be!' },
    { zh: '每一次練習都讓你離目標更近一步！', en: 'Every session brings you closer to your goal!' },
    { zh: '給自己一個掌聲！你值得的！', en: 'Give yourself a round of applause — you deserve it!' },
  ],
};

// Inspirational quotes
export const QUOTES: EmotionMessage[] = [
  { zh: '千里之行，始於足下。', en: 'A journey of a thousand miles begins with a single step.' },
  { zh: '最大的敵人是昨天的自己。', en: 'Your biggest competition is who you were yesterday.' },
  { zh: '語言是通往世界的橋樑。', en: 'Language is the bridge to the world.' },
  { zh: '成功是從失敗到失敗而不減熱情。', en: 'Success is going from failure to failure without losing enthusiasm.' },
  { zh: '學習永遠不嫌晚。', en: "It's never too late to learn." },
  { zh: '每一次錯誤都是邁向成功的必經之路。', en: 'Every mistake is a stepping stone to success.' },
];

export function getRandomEmotion(category: string): EmotionMessage {
  const msgs = ENCOURAGEMENT[category];
  if (!msgs || msgs.length === 0) return { zh: '加油！', en: 'Keep it up!' };
  return msgs[Math.floor(Math.random() * msgs.length)];
}

export function getRandomQuote(): EmotionMessage {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export function checkAchievements(stats: {
  totalSpeeches: number;
  businessCount: number;
  ieltsCount: number;
  dailyCount: number;
  restaurantCount: number;
  interviewCount: number;
  datingCount: number;
  doctorCount: number;
  maxUniqueWords: number;
  bestFluency: number;
  bestPronunciation: number;
  streak: number;
  tedCount?: number;
  keigoCount?: number;
  izakayaCount?: number;
  toeicCount?: number;
  jobHuntJpCount?: number;
  jobHuntKrCount?: number;
}): Achievement[] {
  const unlocked: Achievement[] = [];

  if (stats.totalSpeeches >= 1) unlocked.push(ACHIEVEMENTS[0]);
  if (stats.totalSpeeches >= 10) unlocked.push(ACHIEVEMENTS[1]);
  if (stats.totalSpeeches >= 50) unlocked.push(ACHIEVEMENTS[2]);
  if (stats.totalSpeeches >= 100) unlocked.push(ACHIEVEMENTS[3]);
  if (stats.businessCount >= 5) unlocked.push(ACHIEVEMENTS[4]);
  if (stats.ieltsCount >= 5) unlocked.push(ACHIEVEMENTS[5]);
  if (stats.dailyCount >= 5) unlocked.push(ACHIEVEMENTS[6]);
  if (stats.maxUniqueWords >= 20) unlocked.push(ACHIEVEMENTS[7]);
  if (stats.bestFluency >= 80) unlocked.push(ACHIEVEMENTS[8]);
  if (stats.bestPronunciation >= 90) unlocked.push(ACHIEVEMENTS[9]);
  if (stats.streak >= 3) unlocked.push(ACHIEVEMENTS[10]);
  if (stats.streak >= 7) unlocked.push(ACHIEVEMENTS[11]);
  if (stats.restaurantCount >= 3) unlocked.push(ACHIEVEMENTS[12]);
  if (stats.interviewCount >= 3) unlocked.push(ACHIEVEMENTS[13]);
  if (stats.datingCount >= 3) unlocked.push(ACHIEVEMENTS[14]);
  if (stats.doctorCount >= 3) unlocked.push(ACHIEVEMENTS[15]);

  return unlocked;
}
