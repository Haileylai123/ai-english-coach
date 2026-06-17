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

  // ===== 日常 Daily =====
  {
    id: 'small-talk', icon: '💬', title: '鄰居寒暄', scene: 'daily', difficulty: 'beginner',
    roles: { A: { name: 'Neighbour', icon: '👋' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Hi there! You just moved in, right?' },
      { role: 'B', text: "Yes! I moved in last weekend. The area looks lovely." },
      { role: 'A', text: 'Welcome! How are you finding it so far?' },
      { role: 'B', text: "It's great — really quiet and friendly." },
      { role: 'A', text: "There's a great coffee shop on the corner. You should try it!" },
      { role: 'B', text: "Oh, I love coffee. I'll check it out tomorrow." },
      { role: 'A', text: 'Lovely! Let me know if you need anything at all.' },
      { role: 'B', text: "Thanks so much! That's really kind of you." },
    ],
    vocab: [{ en: 'neighbour', zh: '鄰居' }, { en: 'lovely', zh: '可愛' }, { en: 'corner', zh: '街角' }],
  },
  {
    id: 'weekend-plan', icon: '🌳', title: '週末計劃', scene: 'daily', difficulty: 'beginner',
    roles: { A: { name: 'Friend', icon: '🧑‍🦰' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'What are you up to this weekend?' },
      { role: 'B', text: "Not much yet. Any ideas?" },
      { role: 'A', text: "How about a hike? The weather's supposed to be great." },
      { role: 'B', text: "I love that! Which trail were you thinking?" },
      { role: 'A', text: 'The one by the lake — it has an amazing view.' },
      { role: 'B', text: 'Perfect. Should I bring anything?' },
      { role: 'A', text: 'Just water and snacks. I\'ll handle lunch!' },
      { role: 'B', text: 'Sounds great! What time should I pick you up?' },
    ],
    vocab: [{ en: 'hike', zh: '遠足' }, { en: 'trail', zh: '小徑' }, { en: 'snack', zh: '零食' }],
  },
  {
    id: 'weekend-errands', icon: '🛒', title: '週末任務', scene: 'daily', difficulty: 'intermediate',
    roles: { A: { name: 'Partner', icon: '🧑‍🤝‍🧑' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'I made a list of things to do today. Want to split them?' },
      { role: 'B', text: 'Sure! What do we need to get done?' },
      { role: 'A', text: "I can do the grocery shopping and pick up the dry cleaning." },
      { role: 'B', text: "Then I'll take the car to the car wash and grab the parcel." },
      { role: 'A', text: 'Perfect. Should we grab lunch after?' },
      { role: 'B', text: 'Yes please. That new ramen place is supposed to be good.' },
      { role: 'A', text: 'Great. Let\'s meet back here at noon.' },
      { role: 'B', text: 'Deal. See you in a bit!' },
    ],
    vocab: [{ en: 'errand', zh: '差事' }, { en: 'dry cleaning', zh: '乾洗' }, { en: 'parcel', zh: '包裹' }],
  },

  // ===== 商務 Business =====
  {
    id: 'standup', icon: '📊', title: '每朝 stand-up', scene: 'business', difficulty: 'intermediate',
    roles: { A: { name: 'Manager', icon: '👩‍💼' }, B: { name: 'You', icon: '🧑‍💻' } },
    lines: [
      { role: 'A', text: 'Morning, team! Quick round of updates — what did you finish yesterday?' },
      { role: 'B', text: 'I wrapped up the user research report and shared it in the channel.' },
      { role: 'A', text: 'Awesome. What are you focusing on today?' },
      { role: 'B', text: "I'll start on the design proposal and pair with Mia on the prototype." },
      { role: 'A', text: 'Any blockers?' },
      { role: 'B', text: 'I\'m waiting on feedback from the legal team, otherwise all good.' },
      { role: 'A', text: "I'll chase that for you. Thanks, everyone — back to work!" },
    ],
    vocab: [{ en: 'stand-up', zh: '站會' }, { en: 'blocker', zh: '障礙' }, { en: 'prototype', zh: '原型' }],
  },
  {
    id: 'client-call', icon: '📞', title: '客戶電話', scene: 'business', difficulty: 'advanced',
    roles: { A: { name: 'Client', icon: '🧑‍💼' }, B: { name: 'You', icon: '🧑‍💼' } },
    lines: [
      { role: 'A', text: "Hi, I'm calling about the new feature rollout timeline." },
      { role: 'B', text: "Of course! We're aiming to launch in Q2 — around late May." },
      { role: 'A', text: 'Can we push it earlier? Our peak season starts in April.' },
      { role: 'B', text: "It's tight, but I can reprioritise the team. Mid-April is feasible." },
      { role: 'A', text: "That would be ideal. What do you need from us?" },
      { role: 'B', text: 'Final content by the end of March, and a quick review of the design.' },
      { role: 'A', text: 'Noted. I\'ll get sign-off this week and confirm.' },
      { role: 'B', text: "Appreciate it. I'll send a revised timeline by tomorrow." },
    ],
    vocab: [{ en: 'rollout', zh: '推出' }, { en: 'reprioritise', zh: '重新排優次' }, { en: 'sign-off', zh: '批准' }],
  },
  {
    id: 'feedback', icon: '💡', title: '給同事反饋', scene: 'business', difficulty: 'intermediate',
    roles: { A: { name: 'Manager', icon: '👩‍🏫' }, B: { name: 'You', icon: '🧑‍💻' } },
    lines: [
      { role: 'A', text: 'Do you have a minute? I want to share some feedback on the last project.' },
      { role: 'B', text: 'Of course. Good or bad?' },
      { role: 'A', text: "Mostly good. Your presentation was clear, but the data could go deeper." },
      { role: 'B', text: 'Fair point. I was rushing to meet the deadline.' },
      { role: 'A', text: 'I get it. Next time, flag it earlier and we can re-scope.' },
      { role: 'B', text: 'Will do. Could you point me to any examples of stronger decks?' },
      { role: 'A', text: "Sure, I'll share a couple after this call." },
      { role: 'B', text: "Thanks — really appreciate the honest feedback." },
    ],
    vocab: [{ en: 'feedback', zh: '反饋' }, { en: 're-scope', zh: '重訂範圍' }, { en: 'deck', zh: '簡報' }],
  },

  // ===== 餐廳 Restaurant =====
  {
    id: 'reservation', icon: '📅', title: '電話訂位', scene: 'restaurant', difficulty: 'beginner',
    roles: { A: { name: 'Host', icon: '🎩' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Good afternoon, Bella\'s Restaurant. How can I help?' },
      { role: 'B', text: "Hi, I'd like to book a table for four this Saturday at 7 PM." },
      { role: 'A', text: 'Let me check… yes, that works. May I have your name?' },
      { role: 'B', text: 'Under Chan, please.' },
      { role: 'A', text: 'Got it. Any special occasion?' },
      { role: 'B', text: "It's my mum's birthday — could we have a quiet corner table?" },
      { role: 'A', text: 'Of course. We\'ll prepare a small dessert on the house!' },
      { role: 'B', text: "That's so thoughtful. Thank you!" },
    ],
    vocab: [{ en: 'reservation', zh: '訂位' }, { en: 'occasion', zh: '場合' }, { en: 'on the house', zh: '餐廳招待' }],
  },
  {
    id: 'order-complain', icon: '😕', title: '投訴食物', scene: 'restaurant', difficulty: 'intermediate',
    roles: { A: { name: 'Server', icon: '🍽️' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'How is everything tasting?' },
      { role: 'B', text: "Honestly, my steak is a bit overcooked. I asked for medium." },
      { role: 'A', text: "I'm so sorry to hear that. Let me take it back to the kitchen." },
      { role: 'B', text: "Thanks. I don't want to send it back twice — is this ok to swap?" },
      { role: 'A', text: "Of course, and I'll bring a fresh one out in ten minutes." },
      { role: 'B', text: "Appreciate it. The pasta is excellent, by the way!" },
      { role: 'A', text: "Glad to hear. I'll make sure the new steak is just right." },
    ],
    vocab: [{ en: 'overcooked', zh: '過熟' }, { en: 'medium', zh: '五分熟' }, { en: 'swap', zh: '更換' }],
  },
  {
    id: 'pay-bill', icon: '💳', title: '結帳分賬', scene: 'restaurant', difficulty: 'intermediate',
    roles: { A: { name: 'Server', icon: '🧾' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Are you ready for the bill?' },
      { role: 'B', text: "Yes please. Can we split it three ways?" },
      { role: 'A', text: "Sure thing. I'll print separate receipts." },
      { role: 'B', text: 'Great. Do you take Apple Pay?' },
      { role: 'A', text: "We do, no problem." },
      { role: 'B', text: 'Lovely. Please include the tip for the service.' },
      { role: 'A', text: 'Of course. The total comes to $42 per person, plus tip.' },
      { role: 'B', text: "Perfect. Thanks so much — service was great." },
    ],
    vocab: [{ en: 'split', zh: '分攤' }, { en: 'receipt', zh: '收據' }, { en: 'tip', zh: '小費' }],
  },

  // ===== 面試 Interview =====
  {
    id: 'phone-screen', icon: '📱', title: '電話面試', scene: 'interview', difficulty: 'beginner',
    roles: { A: { name: 'Recruiter', icon: '👩‍💼' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: "Hi! Thanks for taking my call. Do you have a few minutes?" },
      { role: 'B', text: "Yes, of course. Thanks for reaching out." },
      { role: 'A', text: "Great. Could you briefly walk me through your background?" },
      { role: 'B', text: "Sure — I've been a product designer for the past four years." },
      { role: 'A', text: 'What kind of products have you worked on?' },
      { role: 'B', text: "Mostly B2B SaaS tools, especially in fintech." },
      { role: 'A', text: "Excellent. We'd love to invite you to a full interview. Are you available next week?" },
      { role: 'B', text: "Yes, I'd be happy to. Please send the details." },
    ],
    vocab: [{ en: 'recruiter', zh: '招聘者' }, { en: 'background', zh: '背景' }, { en: 'B2B SaaS', zh: '企業軟件' }],
  },
  {
    id: 'behavioural', icon: '⭐', title: '行為面試 STAR', scene: 'interview', difficulty: 'advanced',
    roles: { A: { name: 'Interviewer', icon: '🧑‍💼' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Tell me about a time you handled a major conflict at work.' },
      { role: 'B', text: 'Sure. Two engineers disagreed on a critical architecture decision.' },
      { role: 'A', text: 'What did you do?' },
      { role: 'B', text: "I set up a meeting, let each person explain, and we mapped pros and cons." },
      { role: 'A', text: 'What was the outcome?' },
      { role: 'B', text: "We picked a hybrid approach, and both felt heard." },
      { role: 'A', text: 'Great. What did you learn from it?' },
      { role: 'B', text: "That structure and empathy go a long way in resolving disagreements." },
    ],
    vocab: [{ en: 'conflict', zh: '衝突' }, { en: 'architecture', zh: '架構' }, { en: 'hybrid', zh: '混合' }],
  },
  {
    id: 'salary-talk', icon: '💰', title: '談薪水福利', scene: 'interview', difficulty: 'advanced',
    roles: { A: { name: 'Hiring Manager', icon: '👔' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Do you have a salary expectation in mind?' },
      { role: 'B', text: "Based on my research, I'm targeting around $95k plus equity." },
      { role: 'A', text: "That's at the top of the range, but the equity package is generous." },
      { role: 'B', text: "I appreciate that. The growth opportunity is a real draw for me." },
      { role: 'A', text: "We can do 90k base, 0.1% equity, plus a $5k sign-on bonus." },
      { role: 'B', text: "That's close — could we meet in the middle at 92.5k?" },
      { role: 'A', text: "I think we can make that work. I'll send the offer tomorrow." },
      { role: 'B', text: "Sounds great. Looking forward to joining the team!" },
    ],
    vocab: [{ en: 'expectation', zh: '期望' }, { en: 'equity', zh: '股權' }, { en: 'sign-on bonus', zh: '入職獎金' }],
  },

  // ===== 約會 Dating =====
  {
    id: 'first-date', icon: '💕', title: '第一次約會', scene: 'dating', difficulty: 'beginner',
    roles: { A: { name: 'Alex', icon: '😊' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: "Hi! It's lovely to finally meet you in person." },
      { role: 'B', text: "You too! This café is such a cute choice." },
      { role: 'A', text: "Thanks! Have you been here before?" },
      { role: 'B', text: "First time. I love the warm vibe." },
      { role: 'A', text: 'Me too. So, tell me a little about yourself?' },
      { role: 'B', text: "I'm a graphic designer, and I love weekend hikes." },
      { role: 'A', text: "No way — I love hiking too! Where's your favourite trail?" },
      { role: 'B', text: "Dragon's Back. Have you tried it?" },
    ],
    vocab: [{ en: 'vibe', zh: '氣氛' }, { en: 'cute', zh: '可愛' }, { en: 'trail', zh: '小徑' }],
  },
  {
    id: 'phone-relationship', icon: '📞', title: '傾電話感情', scene: 'dating', difficulty: 'intermediate',
    roles: { A: { name: 'Partner', icon: '💑' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: "I've been thinking about us a lot lately." },
      { role: 'B', text: "Yeah? What have you been thinking?" },
      { role: 'A', text: "I really value what we have. I want to make it official." },
      { role: 'B', text: "I feel the same. I've never been this comfortable with anyone." },
      { role: 'A', text: "Would you like to be my girlfriend?" },
      { role: 'B', text: "Yes — I'd love that." },
      { role: 'A', text: "I'm so happy. Should we tell our friends?" },
      { role: 'B', text: "Let's keep it between us for a little while." },
    ],
    vocab: [{ en: 'comfortable', zh: '自在' }, { en: 'official', zh: '正式的' }, { en: 'girlfriend', zh: '女朋友' }],
  },
  {
    id: 'anniversary', icon: '🎉', title: '慶祝紀念日', scene: 'dating', difficulty: 'intermediate',
    roles: { A: { name: 'Partner', icon: '💖' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Happy anniversary! Can you believe it\'s been three years?' },
      { role: 'B', text: "I know! Time flies when you're having fun." },
      { role: 'A', text: 'I planned a little surprise for tonight — dress comfortably!' },
      { role: 'B', text: "Ooh, I love surprises. Where are we going?" },
      { role: 'A', text: "It's a rooftop dinner with a view of the harbour." },
      { role: 'B', text: "That sounds magical. And I have a gift for you too." },
      { role: 'A', text: "Can't wait. Ready when you are!" },
    ],
    vocab: [{ en: 'anniversary', zh: '紀念日' }, { en: 'rooftop', zh: '天台' }, { en: 'harbour', zh: '海港' }],
  },

  // ===== 醫生 Doctor =====
  {
    id: 'pharmacy', icon: '💊', title: '藥房配藥', scene: 'doctor', difficulty: 'beginner',
    roles: { A: { name: 'Pharmacist', icon: '👩‍⚕️' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Good morning. How can I help you today?' },
      { role: 'B', text: "Hi, I'd like to pick up a prescription, please." },
      { role: 'A', text: "Of course. May I see your ID and the doctor's note?" },
      { role: 'B', text: "Sure, here you go." },
      { role: 'A', text: 'Thanks. Are you allergic to any medication?' },
      { role: 'B', text: 'Yes, penicillin makes me break out in a rash.' },
      { role: 'A', text: "Got it, that's noted. Take this twice a day, with food." },
      { role: 'B', text: "Perfect. Thank you so much!" },
    ],
    vocab: [{ en: 'prescription', zh: '處方' }, { en: 'penicillin', zh: '盤尼西林' }, { en: 'rash', zh: '紅疹' }],
  },
  {
    id: 'dentist', icon: '🦷', title: '睇牙醫', scene: 'doctor', difficulty: 'intermediate',
    roles: { A: { name: 'Dentist', icon: '🦷' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: "Have a seat. So, what seems to be the problem?" },
      { role: 'B', text: "I have a sharp pain in my upper right molar." },
      { role: 'A', text: 'How long has it been hurting?' },
      { role: 'B', text: 'About a week. It gets worse when I drink cold water.' },
      { role: 'A', text: "Let me take a look. Open wide, please… I see a small cavity." },
      { role: 'B', text: "Oh no. Will it need a filling?" },
      { role: 'A', text: "Yes, a quick one. We can do it right now if you have time." },
      { role: 'B', text: "Yes please — I want to get it over with!" },
    ],
    vocab: [{ en: 'molar', zh: '大牙' }, { en: 'cavity', zh: '蛀洞' }, { en: 'filling', zh: '補牙' }],
  },
  {
    id: 'mental-health', icon: '🧠', title: '傾健康焦慮', scene: 'doctor', difficulty: 'advanced',
    roles: { A: { name: 'Therapist', icon: '🧑‍⚕️' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Thanks for coming in. What\'s been on your mind lately?' },
      { role: 'B', text: "I've been feeling really anxious and can't sleep well." },
      { role: 'A', text: "I'm sorry to hear that. How long has this been going on?" },
      { role: 'B', text: 'About two months, especially after I started a new job.' },
      { role: 'A', text: 'That\'s a big transition. Are there specific triggers?' },
      { role: 'B', text: "Mostly Sunday nights. I dread the workweek." },
      { role: 'A', text: 'Have you tried anything to help so far?' },
      { role: 'B', text: "Meditation helps a little, but not enough." },
    ],
    vocab: [{ en: 'anxious', zh: '焦慮' }, { en: 'trigger', zh: '觸發' }, { en: 'meditation', zh: '冥想' }],
  },

  // ===== IELTS =====
  {
    id: 'ielts-hometown', icon: '🏙️', title: 'IELTS - 介紹家鄉', scene: 'ielts', difficulty: 'beginner',
    roles: { A: { name: 'Examiner', icon: '🧑‍🏫' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: "Let's talk about your hometown. Where are you from?" },
      { role: 'B', text: "I'm from a small coastal city in the south of China." },
      { role: 'A', text: "What do you like most about it?" },
      { role: 'B', text: "The seafood is amazing, and the people are very friendly." },
      { role: 'A', text: "Has it changed much since you were a child?" },
      { role: 'B', text: "Yes, there's been a lot of new development — modern malls and a new subway." },
      { role: 'A', text: "Would you recommend it as a place to visit?" },
      { role: 'B', text: "Definitely! It's peaceful, beautiful, and very affordable." },
    ],
    vocab: [{ en: 'coastal', zh: '沿海' }, { en: 'development', zh: '發展' }, { en: 'affordable', zh: '廉宜' }],
  },
  {
    id: 'ielts-hobby', icon: '🎨', title: 'IELTS - 講興趣', scene: 'ielts', difficulty: 'intermediate',
    roles: { A: { name: 'Examiner', icon: '🧑‍🏫' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: 'Do you have any hobbies you do in your free time?' },
      { role: 'B', text: "Yes, I love photography. I shoot mostly street scenes." },
      { role: 'A', text: "How did you get into it?" },
      { role: 'B', text: "My dad gave me his old camera when I was fifteen, and I was hooked." },
      { role: 'A', text: "What do you enjoy most about it?" },
      { role: 'B', text: "Capturing small moments that people usually overlook." },
      { role: 'A', text: "Do you think hobbies are important?" },
      { role: 'B', text: "Absolutely. They keep you balanced and creative." },
    ],
    vocab: [{ en: 'hobby', zh: '興趣' }, { en: 'hooked', zh: '上癮' }, { en: 'overlook', zh: '忽略' }],
  },

  // ===== TED =====
  {
    id: 'ted-passion', icon: '🎤', title: 'TED - 講熱情', scene: 'ted', difficulty: 'intermediate',
    roles: { A: { name: 'Host', icon: '🎙️' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: "Welcome to the stage. Could you start by telling us who you are?" },
      { role: 'B', text: "I'm a software engineer, but my real passion is teaching kids to code." },
      { role: 'A', text: "What inspired that passion?" },
      { role: 'B', text: "I noticed my niece was afraid of math, so I taught her to code instead." },
      { role: 'A', text: "And how did that go?" },
      { role: 'B', text: "Within a year, she was top of her class. Coding gave her confidence." },
      { role: 'A', text: "That's a powerful story. What's next for you?" },
      { role: 'B', text: "I'm building a free platform so any child can learn." },
    ],
    vocab: [{ en: 'passion', zh: '熱情' }, { en: 'inspire', zh: '啟發' }, { en: 'confidence', zh: '信心' }],
  },
  {
    id: 'ted-failure', icon: '🌱', title: 'TED - 失敗學到咩', scene: 'ted', difficulty: 'advanced',
    roles: { A: { name: 'Host', icon: '🎙️' }, B: { name: 'You', icon: '🧑' } },
    lines: [
      { role: 'A', text: "Today we're talking about failure. Tell us about yours." },
      { role: 'B', text: "Five years ago, my first startup shut down after eight months." },
      { role: 'A', text: "That must have been tough. How did you cope?" },
      { role: 'B', text: "Honestly, I grieved for a while. Then I wrote down what I learned." },
      { role: 'A', text: "What was the biggest lesson?" },
      { role: 'B', text: "I was building a product nobody actually needed." },
      { role: 'A', text: "So what changed in your next venture?" },
      { role: 'B', text: "I spent three months talking to users before writing a single line of code." },
    ],
    vocab: [{ en: 'failure', zh: '失敗' }, { en: 'cope', zh: '應對' }, { en: 'venture', zh: '事業' }],
  },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
