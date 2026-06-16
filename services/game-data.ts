// services/game-data.ts — All game content ported from web version
// Word Match · Fill Blank · Scramble · Quick Fire · Speed Challenge · Skits

export interface WordPair {
  en: string; zh: string;
}

export interface FillSentence {
  en: string; blank: string; opts: string[]; zh: string;
}

export interface SkitLine { role: string; text: string; }
export interface Skit {
  id: string; icon: string; title: string; scene: string; difficulty: string;
  roles: { A: { name: string; icon: string }; B: { name: string; icon: string } };
  lines: SkitLine[];
  vocab: { en: string; zh: string }[];
}

// ---- Word Bank ----
export const WORD_BANK: Record<string, WordPair[]> = {
  beginner: [
    { en: 'apple', zh: '蘋果' },{ en: 'happy', zh: '快樂的' },{ en: 'family', zh: '家庭' },{ en: 'water', zh: '水' },
    { en: 'friend', zh: '朋友' },{ en: 'school', zh: '學校' },{ en: 'music', zh: '音樂' },{ en: 'food', zh: '食物' },
    { en: 'travel', zh: '旅行' },{ en: 'beautiful', zh: '美麗的' },{ en: 'morning', zh: '早上' },{ en: 'dream', zh: '夢想' },
    { en: 'weather', zh: '天氣' },{ en: 'color', zh: '顏色' },{ en: 'story', zh: '故事' },{ en: 'smile', zh: '微笑' },
    { en: 'animal', zh: '動物' },{ en: 'garden', zh: '花園' },{ en: 'dinner', zh: '晚餐' },{ en: 'summer', zh: '夏天' },
    { en: 'coffee', zh: '咖啡' },{ en: 'phone', zh: '手機' },{ en: 'window', zh: '窗戶' },{ en: 'mountain', zh: '山' },
    { en: 'river', zh: '河流' },{ en: 'forest', zh: '森林' },{ en: 'ocean', zh: '海洋' },{ en: 'bridge', zh: '橋' },
    { en: 'market', zh: '市場' },{ en: 'kitchen', zh: '廚房' },{ en: 'airport', zh: '機場' },{ en: 'hospital', zh: '醫院' },
    { en: 'library', zh: '圖書館' },{ en: 'birthday', zh: '生日' },{ en: 'weekend', zh: '周末' },{ en: 'holiday', zh: '假期' },
    { en: 'picture', zh: '照片' },{ en: 'message', zh: '消息' },{ en: 'future', zh: '未來' },{ en: 'memory', zh: '回憶' },
    { en: 'nature', zh: '自然' },{ en: 'health', zh: '健康' },{ en: 'energy', zh: '能量' },{ en: 'freedom', zh: '自由' },
    { en: 'adventure', zh: '冒險' },{ en: 'courage', zh: '勇氣' },{ en: 'kindness', zh: '善良' },
  ],
  intermediate: [
    { en: 'opportunity', zh: '機會' },{ en: 'experience', zh: '經驗' },{ en: 'important', zh: '重要的' },{ en: 'decide', zh: '決定' },
    { en: 'environment', zh: '環境' },{ en: 'knowledge', zh: '知識' },{ en: 'different', zh: '不同的' },{ en: 'celebrate', zh: '慶祝' },
    { en: 'challenge', zh: '挑戰' },{ en: 'communicate', zh: '溝通' },{ en: 'discover', zh: '發現' },{ en: 'imagine', zh: '想像' },
    { en: 'solution', zh: '解決方案' },{ en: 'improve', zh: '改善' },{ en: 'schedule', zh: '行程' },{ en: 'confident', zh: '自信的' },
    { en: 'necessary', zh: '必要的' },{ en: 'volunteer', zh: '志願者' },{ en: 'influence', zh: '影響' },{ en: 'tradition', zh: '傳統' },
    { en: 'negotiate', zh: '談判' },{ en: 'perspective', zh: '觀點' },{ en: 'efficient', zh: '高效的' },{ en: 'responsibility', zh: '責任' },
    { en: 'independent', zh: '獨立的' },{ en: 'fascinating', zh: '迷人的' },{ en: 'contribute', zh: '貢獻' },{ en: 'recognize', zh: '認出' },
    { en: 'recommend', zh: '推薦' },{ en: 'appreciate', zh: '欣賞' },{ en: 'participate', zh: '參與' },{ en: 'significant', zh: '重大的' },
    { en: 'alternative', zh: '替代方案' },{ en: 'consider', zh: '考慮' },{ en: 'maintain', zh: '維持' },
  ],
  advanced: [
    { en: 'phenomenon', zh: '現象' },{ en: 'sophisticated', zh: '複雜精密的' },{ en: 'fundamental', zh: '基本的' },
    { en: 'controversial', zh: '有爭議的' },{ en: 'substantial', zh: '大量的' },{ en: 'comprehensive', zh: '全面的' },
    { en: 'inevitable', zh: '不可避免的' },{ en: 'extraordinary', zh: '非凡的' },{ en: 'simultaneously', zh: '同時地' },
    { en: 'predominantly', zh: '主要地' },{ en: 'consequently', zh: '因此' },{ en: 'nevertheless', zh: '儘管如此' },
    { en: 'acknowledge', zh: '承認' },{ en: 'demonstrate', zh: '展示' },{ en: 'implement', zh: '實施' },
    { en: 'juxtaposition', zh: '並列' },{ en: 'unprecedented', zh: '史無前例的' },{ en: 'exacerbate', zh: '加劇' },
    { en: 'ubiquitous', zh: '無處不在的' },{ en: 'quintessential', zh: '典型的' },{ en: 'ameliorate', zh: '改善' },
    { en: 'ephemeral', zh: '短暫的' },{ en: 'pragmatic', zh: '務實的' },{ en: 'conundrum', zh: '難題' },{ en: 'dichotomy', zh: '二分法' },
  ],
};

// ---- Fill in the Blank ----
export const FILL_SENTENCES: FillSentence[] = [
  { en: 'I ___ to the store every weekend.', blank: 'go', opts: ['go', 'goes', 'went', 'going'], zh: '我每個週末都去商店。' },
  { en: 'She ___ a beautiful voice.', blank: 'has', opts: ['have', 'has', 'had', 'having'], zh: '她有一副美妙的嗓音。' },
  { en: 'They ___ been working here since 2019.', blank: 'have', opts: ['has', 'have', 'had', 'having'], zh: '他們從2019年就在這裡工作了。' },
  { en: 'The meeting will ___ at 3 PM.', blank: 'start', opts: ['starts', 'started', 'start', 'starting'], zh: '會議將在下午3點開始。' },
  { en: 'I wish I ___ more time.', blank: 'had', opts: ['have', 'has', 'had', 'having'], zh: '我希望我有更多時間。' },
  { en: 'If it ___, we will stay home.', blank: 'rains', opts: ['rain', 'rains', 'rained', 'raining'], zh: '如果下雨，我們就待在家。' },
  { en: 'Could you ___ me a favor?', blank: 'do', opts: ['make', 'do', 'give', 'take'], zh: '你可以幫我個忙嗎？' },
  { en: "I'm looking forward ___ meeting you.", blank: 'to', opts: ['for', 'to', 'at', 'on'], zh: '我期待見到你。' },
  { en: 'Neither of them ___ ready.', blank: 'is', opts: ['is', 'are', 'was', 'were'], zh: '他們倆都沒準備好。' },
  { en: 'She suggested ___ early.', blank: 'leaving', opts: ['leave', 'leaves', 'leaving', 'left'], zh: '她建議早點離開。' },
  { en: 'It depends ___ the weather.', blank: 'on', opts: ['on', 'in', 'at', 'for'], zh: '取決於天氣。' },
  { en: "I'm not used ___ getting up early.", blank: 'to', opts: ['to', 'for', 'at', 'with'], zh: '我不習慣早起。' },
  { en: 'She insisted ___ paying for dinner.', blank: 'on', opts: ['on', 'in', 'at', 'to'], zh: '她堅持要付晚餐錢。' },
  { en: 'The more you practice, ___ better you become.', blank: 'the', opts: ['the', 'a', 'more', 'most'], zh: '練習越多，你就越好。' },
  { en: 'Hardly ___ I closed my eyes when the phone rang.', blank: 'had', opts: ['had', 'have', 'did', 'was'], zh: '我剛閉上眼睛電話就響了。' },
  { en: "I'd rather you ___ here tomorrow.", blank: 'came', opts: ['come', 'came', 'coming', 'comes'], zh: '我希望你明天來。' },
  { en: 'Not until he arrived ___ we start the meeting.', blank: 'did', opts: ['did', 'we', 'that', 'had'], zh: '直到他到了我們才開始會議。' },
  { en: "It's high time you ___ looking for a job.", blank: 'started', opts: ['start', 'starts', 'started', 'starting'], zh: '你該開始找工作了。' },
  { en: '___ it not been for your help, I would have failed.', blank: 'Had', opts: ['Had', 'Have', 'If', 'Was'], zh: '要不是你的幫助，我就失敗了。' },
  { en: 'He talks as if he ___ everything.', blank: 'knew', opts: ['knows', 'knew', 'known', 'knowing'], zh: '他說得好像什麼都知道。' },
  { en: 'I object ___ being treated like a child.', blank: 'to', opts: ['to', 'for', 'at', 'against'], zh: '我反對被當小孩對待。' },
  { en: 'She devoted her life ___ helping others.', blank: 'to', opts: ['to', 'for', 'in', 'on'], zh: '她把一生奉獻給幫助他人。' },
  { en: 'No sooner had we left ___ it started raining.', blank: 'than', opts: ['than', 'when', 'then', 'that'], zh: '我們剛走就下雨了。' },
];

// ---- Skits ----
export const ALL_SKITS: Skit[] = [
  {
    id: 'cafe', icon: '☕', title: '咖啡廳相遇', scene: 'daily', difficulty: 'beginner',
    roles: { A: { name: 'Barista', icon: '☕' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Good morning! What can I get for you today?' },
      { role: 'B', text: "Hi! I'd like a latte please, and maybe a croissant." },
      { role: 'A', text: 'Sure! Would you like that hot or iced?' },
      { role: 'B', text: "Hot, please. It's a bit chilly outside." },
      { role: 'A', text: "Good choice! That'll be $8.50. Cash or card?" },
      { role: 'B', text: 'Card, please. Here you go.' },
      { role: 'A', text: 'Thank you! Your order will be ready in just a moment.' },
      { role: 'B', text: 'Thanks so much! Have a great day!' },
    ],
    vocab: [{ en: 'latte', zh: '拿鐵' }, { en: 'croissant', zh: '牛角包' }, { en: 'chilly', zh: '寒冷' }],
  },
  {
    id: 'interview', icon: '💼', title: '工作面試', scene: 'business', difficulty: 'intermediate',
    roles: { A: { name: 'Interviewer', icon: '👔' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Thank you for coming in today. Tell me a bit about yourself.' },
      { role: 'B', text: "Thank you for having me! I've been working in marketing for five years." },
      { role: 'A', text: 'What would you say is your greatest strength?' },
      { role: 'B', text: "I'd say my ability to adapt quickly and lead teams under pressure." },
      { role: 'A', text: 'And how do you handle tight deadlines?' },
      { role: 'B', text: "I prioritize tasks and communicate proactively. I've never missed a deadline." },
      { role: 'A', text: 'Great answer. Do you have any questions for us?' },
      { role: 'B', text: 'Yes — what does success look like in this role after six months?' },
    ],
    vocab: [{ en: 'strength', zh: '優勢' }, { en: 'deadline', zh: '截止日期' }, { en: 'prioritize', zh: '優先處理' }],
  },
  {
    id: 'doctor', icon: '🏥', title: '看醫生', scene: 'daily', difficulty: 'beginner',
    roles: { A: { name: 'Doctor', icon: '🩺' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Hello, what brings you in today?' },
      { role: 'B', text: "Hi doctor, I've had a sore throat and a fever since yesterday." },
      { role: 'A', text: "Let me take your temperature. ... 38.2°C — a mild fever." },
      { role: 'B', text: 'I also have a headache and feel quite tired.' },
      { role: 'A', text: 'It looks like a common cold. Get plenty of rest and drink water.' },
      { role: 'B', text: 'Thank you. How often should I take the medicine?' },
      { role: 'A', text: 'Twice a day, after meals. Come back in three days if not better.' },
    ],
    vocab: [{ en: 'sore throat', zh: '喉嚨痛' }, { en: 'fever', zh: '發燒' }, { en: 'medicine', zh: '藥物' }],
  },
  {
    id: 'restaurant', icon: '🍽️', title: '餐廳點餐', scene: 'daily', difficulty: 'beginner',
    roles: { A: { name: 'Waiter', icon: '🍽️' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Good evening! Do you have a reservation?' },
      { role: 'B', text: "Yes, it's under the name Smith." },
      { role: 'A', text: 'Right this way. Can I start you off with some drinks?' },
      { role: 'B', text: "I'll have a glass of red wine, please." },
      { role: 'A', text: 'Are you ready to order?' },
      { role: 'B', text: "Yes — I'll have the grilled salmon with vegetables." },
      { role: 'A', text: 'Excellent choice! Anything for dessert?' },
      { role: 'B', text: "Let's see after the main course. Thank you!" },
    ],
    vocab: [{ en: 'reservation', zh: '預約' }, { en: 'grilled', zh: '烤的' }, { en: 'main course', zh: '主菜' }],
  },
  {
    id: 'negotiation', icon: '🤝', title: '商務談判', scene: 'business', difficulty: 'advanced',
    roles: { A: { name: 'Supplier', icon: '🏢' }, B: { name: 'You', icon: '💼' } },
    lines: [
      { role: 'A', text: "We've reviewed your proposal. The pricing is higher than expected." },
      { role: 'B', text: 'I understand. Our pricing reflects premium quality and support.' },
      { role: 'A', text: 'Can you offer a discount for a larger volume?' },
      { role: 'B', text: 'If you increase the order by 20%, we can offer a 10% discount.' },
      { role: 'A', text: 'That sounds reasonable. What about the delivery timeline?' },
      { role: 'B', text: 'We guarantee delivery within two weeks for the initial batch.' },
      { role: 'A', text: 'Alright, I think we have a deal. Let me draft the contract.' },
      { role: 'B', text: 'Excellent! I look forward to a productive partnership.' },
    ],
    vocab: [{ en: 'proposal', zh: '提案' }, { en: 'discount', zh: '折扣' }, { en: 'partnership', zh: '合作關係' }],
  },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
