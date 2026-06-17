// services/courses.ts — Structured learning courses with lessons

export type LessonType = 'reading' | 'speaking' | 'vocab' | 'quiz' | 'listening';

export interface QuizQuestion {
  q: string;
  qZh: string;
  opts: string[];
  /** index of the correct answer in opts */
  ans: number;
  explain?: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleZh: string;
  type: LessonType;
  /** Main lesson content — paragraphs separated by \n\n */
  content: string;
  /** Key vocabulary to learn */
  vocab: { en: string; zh: string; example?: string }[];
  /** Optional practice prompt */
  practice?: {
    prompt: string;
    zh: string;
    hint?: string;
  };
  /** Quiz — must pass to mark lesson complete */
  quiz: QuizQuestion[];
  /** Estimated minutes */
  minutes: number;
}

export interface Course {
  id: string;
  icon: string;
  title: string;
  titleEn: string;
  desc: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'basics' | 'business' | 'ielts' | 'travel' | 'pronunciation';
  lessons: Lesson[];
}

export const COURSES: Course[] = [
  {
    id: 'eng-basics',
    icon: '',
    title: '基礎英語',
    titleEn: 'English Basics',
    desc: '從零開始學英文，打好發音、文法同詞彙基礎',
    level: 'beginner',
    category: 'basics',
    lessons: [
      {
        id: 'eng-basics-1',
        title: '打招呼與自我介紹',
        titleZh: '打招呼',
        type: 'speaking',
        minutes: 5,
        content: '學習基本打招呼同自我介紹。\n\n打招呼係人與人溝通嘅第一步。喺英文入面，最常見嘅打招呼方式包括 "Hello"、"Hi"、"Good morning"、"Good afternoon"、"Good evening"。\n\n正式場合可以用 "How do you do?"，比較輕鬆嘅場合用 "Hey" 或 "Hi there"。',
        vocab: [
          { en: 'hello', zh: '你好', example: 'Hello, how are you?' },
          { en: 'morning', zh: '早上', example: 'Good morning, everyone!' },
          { en: 'introduce', zh: '介紹', example: 'Let me introduce myself.' },
          { en: 'name', zh: '名字', example: 'My name is Casey.' },
        ],
        practice: {
          prompt: 'Please introduce yourself briefly — your name and what you do.',
          zh: '請簡單自我介紹 — 你嘅名同工作。',
          hint: 'Hi, my name is ___ and I work as a ___.',
        },
        quiz: [
          { q: 'How do you say "你好" in English?', qZh: '"你好" 點講？', opts: ['Goodbye', 'Hello', 'Thanks', 'Sorry'], ans: 1, explain: '"Hello" 係最常見嘅打招呼。' },
          { q: 'Which is a formal greeting?', qZh: '邊個係正式打招呼？', opts: ['Hey', 'Yo', 'How do you do?', 'Sup'], ans: 2, explain: '"How do you do?" 係正式場合用。' },
          { q: 'What does "introduce" mean?', qZh: '"introduce" 咩意思？', opts: ['介紹', '邀請', '投資', '指示'], ans: 0 },
        ],
      },
      {
        id: 'eng-basics-2',
        title: '數字、時間與日期',
        titleZh: '數字時間',
        type: 'reading',
        minutes: 6,
        content: '學識講數字、時間同日期係日常英文嘅基礎。\n\n時間：\n• 3:00 → three o\'clock\n• 3:15 → quarter past three / three fifteen\n• 3:30 → half past three / three thirty\n• 3:45 → quarter to four / three forty-five\n\n日期：\n• 2026-06-17 → June 17, 2026 (讀：June seventeenth, twenty twenty-six)',
        vocab: [
          { en: 'o\'clock', zh: '點鐘', example: 'It is 9 o\'clock.' },
          { en: 'quarter', zh: '四分之一', example: 'A quarter past two.' },
          { en: 'half', zh: '一半', example: 'Half past seven.' },
          { en: 'date', zh: '日期', example: 'What is today\'s date?' },
        ],
        quiz: [
          { q: 'How do you say 3:15 in English?', qZh: '3:15 點講？', opts: ['Three fifteen', 'Fifteen three', 'Half three', 'Quarter three'], ans: 0, explain: '3:15 = three fifteen / quarter past three。' },
          { q: 'What does "half past seven" mean?', qZh: '"half past seven" 咩時間？', opts: ['6:30', '7:00', '7:30', '8:00'], ans: 2, explain: '"half past" = 30 分鐘之後。' },
          { q: 'Read 2026 in English', qZh: '2026 點讀？', opts: ['Two thousand twenty-six', 'Twenty twenty-six', 'Both are correct', 'Two zero two six'], ans: 2 },
        ],
      },
      {
        id: 'eng-basics-3',
        title: '常用動詞',
        titleZh: '常用動詞',
        type: 'vocab',
        minutes: 8,
        content: '動詞係句子嘅核心。學識以下 10 個最常用嘅英文動詞，你可以表達 80% 嘅日常對話。\n\nbe, have, do, say, get, make, go, know, take, see\n\n例句：\n• I am happy.\n• She has a cat.\n• We do homework together.',
        vocab: [
          { en: 'be', zh: '是', example: 'I am a student.' },
          { en: 'have', zh: '有', example: 'I have two brothers.' },
          { en: 'do', zh: '做', example: 'What do you do?' },
          { en: 'get', zh: '得到', example: 'I get up at 7.' },
          { en: 'make', zh: '製作', example: 'She makes coffee.' },
        ],
        practice: {
          prompt: 'Use 3 of the verbs above to describe your morning routine.',
          zh: '用以上 3 個動詞描述你嘅早晨。',
        },
        quiz: [
          { q: 'Which verb means "得到 / 獲得"?', qZh: '邊個動詞係 "得到"？', opts: ['be', 'have', 'do', 'get'], ans: 3 },
          { q: '"She ___ a cat" — fill the blank', qZh: '"She ___ a cat" 填咩？', opts: ['have', 'has', 'is', 'do'], ans: 1, explain: '第三人稱單數用 has。' },
          { q: 'What does "make" mean in "She makes coffee"?', qZh: '"She makes coffee" 嘅 make 咩意思？', opts: ['沖', '買', '飲', '賣'], ans: 0 },
        ],
      },
    ],
  },
  {
    id: 'business-101',
    icon: '',
    title: '商務英語入門',
    titleEn: 'Business English 101',
    desc: '面試、開會、email 用得到嘅商務詞彙同句型',
    level: 'intermediate',
    category: 'business',
    lessons: [
      {
        id: 'business-101-1',
        title: '自我介紹與電梯演講',
        titleZh: '電梯演講',
        type: 'speaking',
        minutes: 8,
        content: '電梯演講 (Elevator Pitch) 係用 30-60 秒簡介你自己、你嘅工作同價值嘅方法。\n\n結構：\n1. 你係邊個 (身份)\n2. 你做咩 (工作內容)\n3. 你點樣幫到人 (價值)\n4. 你想點 (目標)',
        vocab: [
          { en: 'pitch', zh: '推銷話術', example: 'I gave my elevator pitch at the meeting.' },
          { en: 'background', zh: '背景', example: 'I have 5 years of marketing background.' },
          { en: 'expertise', zh: '專業知識', example: 'My expertise is in data analysis.' },
          { en: 'passionate', zh: '有熱誠', example: 'I am passionate about education.' },
        ],
        practice: {
          prompt: 'Prepare a 30-second elevator pitch about yourself.',
          zh: '準備一段 30 秒嘅自我介紹。',
          hint: 'Hi, I am ___ and I work as a ___. I specialize in ___ and I help ___ to ___.',
        },
        quiz: [
          { q: 'What is an "elevator pitch"?', qZh: '"Elevator pitch" 係咩？', opts: ['一段短電梯廣告', '30-60 秒自我介紹', '一個電梯保養合約', '公司宣傳片'], ans: 1 },
          { q: 'What should an elevator pitch include?', qZh: '電梯演講應該包括咩？', opts: ['只講你嘅興趣', '身份 + 工作 + 價值 + 目標', '只講你嘅夢想', '長篇大論'], ans: 1 },
          { q: '"My expertise is in ___" means', qZh: '"My expertise is in ___" 咩意思？', opts: ['我嘅專業係…', '我嘅經驗喺…', '我嘅經歷…', '我嘅實驗…'], ans: 0 },
        ],
      },
      {
        id: 'business-101-2',
        title: '寫專業 Email',
        titleZh: '寫 Email',
        type: 'reading',
        minutes: 7,
        content: '一封好嘅商務 email 應該簡潔、清楚、有禮貌。\n\n開頭：\n• Dear Mr. / Ms. [Name],\n• Hi [Name],\n• Hello,\n\n結尾：\n• Best regards,\n• Kind regards,\n• Thanks,\n• Best,',
        vocab: [
          { en: 'regarding', zh: '關於', example: 'Regarding our meeting tomorrow...' },
          { en: 'attached', zh: '附件', example: 'Please see the attached file.' },
          { en: 'appreciate', zh: '感謝', example: 'I appreciate your prompt reply.' },
          { en: 'follow up', zh: '跟進', example: 'I will follow up next week.' },
        ],
        quiz: [
          { q: 'Which is the most formal email greeting?', qZh: '邊個係最正式嘅 email 開頭？', opts: ['Hey!', 'Dear Mr. Lee,', 'Yo,', 'Hi dude,'], ans: 1 },
          { q: '"Please see the attached file" — what does "attached" mean?', qZh: '"attached" 喺 email 係咩意思？', opts: ['連住', '附件', '攻擊', '出席'], ans: 1 },
          { q: 'A polite sign-off is:', qZh: '邊個係禮貌嘅 email 結尾？', opts: ['Bye lol', 'See ya', 'Best regards,', 'Whatever'], ans: 2 },
        ],
      },
      {
        id: 'business-101-3',
        title: '會議常用句',
        titleZh: '會議句型',
        type: 'speaking',
        minutes: 10,
        content: '會議入面常用嘅句型幫你表達得更專業：\n\n開始會議：\n• Let\'s get started.\n• Thank you all for joining.\n\n表達意見：\n• In my opinion...\n• I\'d like to suggest...\n• I see your point, but...',
        vocab: [
          { en: 'agenda', zh: '議程', example: 'Let\'s look at the agenda.' },
          { en: 'minutes', zh: '會議記錄', example: 'I will take the minutes.' },
          { en: 'proposal', zh: '提案', example: 'I have a proposal.' },
          { en: 'consensus', zh: '共識', example: 'We reached a consensus.' },
        ],
        practice: {
          prompt: 'Role-play: lead a 2-minute team meeting introducing a new project.',
          zh: '情境演練：主持一個 2 分鐘嘅團隊會議介紹新項目。',
        },
        quiz: [
          { q: 'What is an "agenda"?', qZh: '"agenda" 係咩？', opts: ['議程', '緊急', '代理', '年代'], ans: 0 },
          { q: 'How do you start a meeting politely?', qZh: '點樣禮貌咁開始會議？', opts: ['Shut up everyone', "Let's get started", 'Whatever', 'Get lost'], ans: 1 },
          { q: '"I see your point, but ___" is used to', qZh: '"I see your point, but ___" 用嚟…', opts: ['認同 + 提出唔同意見', '完全同意', '離開會議', '叫靜啲'], ans: 0 },
        ],
      },
    ],
  },
  {
    id: 'ielts-speaking',
    icon: '',
    title: '雅思口說備考',
    titleEn: 'IELTS Speaking Prep',
    desc: '雅思口說 Part 1, 2, 3 練習策略同高頻題目',
    level: 'advanced',
    category: 'ielts',
    lessons: [
      {
        id: 'ielts-1',
        title: 'Part 1: 自我介紹題',
        titleZh: 'Part 1',
        type: 'speaking',
        minutes: 10,
        content: '雅思口說 Part 1 係自我介紹同熟悉話題。時間 4-5 分鐘。\n\n常見題目：\n• Hometown (家鄉)\n• Work / Study (工作或讀書)\n• Hobbies (興趣)\n• Daily routine (日常)\n\n回答技巧：回答 2-3 句，給一個理由加一個例子。',
        vocab: [
          { en: 'hometown', zh: '家鄉', example: 'My hometown is Hong Kong.' },
          { en: 'commute', zh: '通勤', example: 'I commute 30 minutes to work.' },
          { en: 'leisure', zh: '休閒', example: 'I enjoy leisure activities on weekends.' },
          { en: 'dwell', zh: '居住', example: 'I dwell in a small apartment.' },
        ],
        practice: {
          prompt: 'Describe your hometown in 1-2 minutes.',
          zh: '用 1-2 分鐘描述你嘅家鄉。',
        },
        quiz: [
          { q: 'How long is IELTS Speaking Part 1?', qZh: 'IELTS 口說 Part 1 幾耐？', opts: ['1-2 分鐘', '4-5 分鐘', '10 分鐘', '15 分鐘'], ans: 1 },
          { q: 'Common Part 1 topics include:', qZh: 'Part 1 常見題目包括：', opts: ['Hometown, hobbies, work', 'Quantum physics', 'Astrology', 'Stock market'], ans: 0 },
          { q: 'A good Part 1 answer should be:', qZh: '好嘅 Part 1 答案應該：', opts: ['一個字', '2-3 句 + 理由 + 例子', '一篇論文', '唱歌'], ans: 1 },
        ],
      },
      {
        id: 'ielts-2',
        title: 'Part 2: 卡片題 (Cue Card)',
        titleZh: 'Part 2',
        type: 'speaking',
        minutes: 12,
        content: 'Part 2 考官會俾一張 cue card，你要有 1 分鐘準備然後講 2 分鐘。\n\n結構：\n1. 講咩 (what)\n2. 喺邊 (where)\n3. 幾時 (when)\n4. 點解特別 (why special)\n5. 感受 (how you felt)',
        vocab: [
          { en: 'cue card', zh: '題目卡', example: 'The cue card asks me to describe a person.' },
          { en: 'memorable', zh: '難忘嘅', example: 'It was a memorable event.' },
          { en: 'significant', zh: '重要嘅', example: 'A significant moment in my life.' },
        ],
        practice: {
          prompt: 'Cue card: Describe a skill you learned that you find useful. You should say: what it is, when you learned it, how you learned it, and explain why it is useful.',
          zh: '題目卡：描述一個你學到有用嘅技能。',
        },
        quiz: [
          { q: 'How long is Part 2 speaking?', qZh: 'Part 2 講幾耐？', opts: ['30 秒', '1 分鐘', '2 分鐘', '5 分鐘'], ans: 2 },
          { q: 'How much prep time do you get for Part 2?', qZh: 'Part 2 有幾多時間準備？', opts: ['0', '30 秒', '1 分鐘', '5 分鐘'], ans: 2 },
          { q: 'A good Part 2 structure includes:', qZh: '好嘅 Part 2 結構包括：', opts: ['What, where, when, why, how', 'Just one sentence', 'A list of words', 'A song'], ans: 0 },
        ],
      },
    ],
  },
  {
    id: 'travel-english',
    icon: '',
    title: '旅遊英語',
    titleEn: 'Travel English',
    desc: '機場、酒店、餐廳、問路 — 去旅行用到嘅句子',
    level: 'beginner',
    category: 'travel',
    lessons: [
      {
        id: 'travel-1',
        title: '機場 check-in',
        titleZh: '機場',
        type: 'speaking',
        minutes: 6,
        content: '去旅行第一步就係過機場。識講以下句子就唔使驚。\n\nCheck-in 櫃台：\n• "I have a reservation under the name __."\n• "Can I have a window seat, please?"\n• "How many bags can I check in?"',
        vocab: [
          { en: 'check-in', zh: '登機手續', example: 'The check-in counter is on the left.' },
          { en: 'boarding pass', zh: '登機證', example: 'Here is your boarding pass.' },
          { en: 'carry-on', zh: '手提行李', example: 'You can take one carry-on bag.' },
          { en: 'departure', zh: '出發', example: 'The departure gate is B12.' },
        ],
        practice: {
          prompt: 'You are at the airport check-in counter. Ask 2 questions about your flight.',
          zh: '你喺機場 check-in 櫃台。問 2 條關於你班機嘅問題。',
        },
        quiz: [
          { q: 'What is a "boarding pass"?', qZh: '"boarding pass" 係咩？', opts: ['登機證', '機票', '行李牌', '信用卡'], ans: 0 },
          { q: '"A window seat, please" means', qZh: '"A window seat" 係咩位？', opts: ['靠窗', '靠走廊', '中間', '企位'], ans: 0 },
          { q: 'A "carry-on" bag is:', qZh: '"carry-on" 係咩？', opts: ['手提行李', '寄艙行李', '書包', '紙袋'], ans: 0 },
        ],
      },
      {
        id: 'travel-2',
        title: '酒店入住',
        titleZh: '酒店',
        type: 'reading',
        minutes: 5,
        content: 'Check-in 酒店時常用句子：\n\n• "I have a reservation."\n• "Could I have an extra towel?"\n• "What time is checkout?"\n• "Is breakfast included?"',
        vocab: [
          { en: 'reservation', zh: '預訂', example: 'I have a reservation for 3 nights.' },
          { en: 'checkout', zh: '退房', example: 'Checkout is at 11 AM.' },
          { en: 'amenities', zh: '設施', example: 'The hotel has many amenities.' },
        ],
        quiz: [
          { q: '"I have a reservation" means:', qZh: '"I have a reservation" 咩意思？', opts: ['我有預訂', '我有問題', '我有投訴', '我有鎖'], ans: 0 },
          { q: '"What time is checkout?" is asking about:', qZh: '"checkout" 問咩？', opts: ['早餐時間', '退房時間', '入住時間', '關門時間'], ans: 1 },
          { q: '"Amenities" means:', qZh: '"amenities" 咩意思？', opts: ['敵人', '設施', '補習', '動畫'], ans: 1 },
        ],
      },
    ],
  },
  {
    id: 'pronunciation',
    icon: '',
    title: '發音矯正',
    titleEn: 'Pronunciation',
    desc: '常見發音錯誤同改善方法',
    level: 'intermediate',
    category: 'pronunciation',
    lessons: [
      {
        id: 'pron-1',
        title: 'th 音 /θ/ 同 /ð/',
        titleZh: 'th 音',
        type: 'listening',
        minutes: 7,
        content: '好多中文母語者 th 音讀唔好。以下練習：\n\n舌尖輕輕放喺上排牙齒之間，唔好太大力。\n• think /θɪŋk/ - 舌尖突出\n• this /ðɪs/ - 舌尖突出但有聲\n• three, thank, the, that, mother',
        vocab: [
          { en: 'think', zh: '諗', example: 'I think so.' },
          { en: 'thank', zh: '感謝', example: 'Thank you very much.' },
          { en: 'this', zh: '呢個', example: 'This is my friend.' },
          { en: 'that', zh: '嗰個', example: 'That looks good.' },
        ],
        practice: {
          prompt: 'Read these words aloud, focusing on th sound: think, thank, this, that, mother, brother, the, three.',
          zh: '大聲讀出以下字，專注 th 音：think, thank, this, that, mother, brother, the, three。',
        },
        quiz: [
          { q: 'How do you pronounce "think"?', qZh: '"think" 點讀？', opts: ['/tɪŋk/', '/θɪŋk/', '/ðɪŋk/', '/sɪŋk/'], ans: 1, explain: 'th 喺 think 係 /θ/ 冇聲。' },
          { q: '"This" starts with which sound?', qZh: '"this" 開頭係咩音？', opts: ['/θ/ (voiceless)', '/ð/ (voiced)', '/d/', '/z/'], ans: 1, explain: 'th 喺 this 係 /ð/ 有聲。' },
          { q: 'To make the th sound, your tongue should touch:', qZh: '讀 th 音時舌尖要掂到邊度？', opts: ['下唇', '上排牙齒', '上顎中間', '鼻'], ans: 1 },
        ],
      },
      {
        id: 'pron-2',
        title: 'r 同 l 嘅分別',
        titleZh: 'r vs l',
        type: 'listening',
        minutes: 6,
        content: '中文母語者成日 r 同 l 唔分。\n\n• right /raɪt/ (r 捲舌)\n• light /laɪt/ (l 舌尖頂上牙齦)\n• rice vs lice\n• road vs load',
        vocab: [
          { en: 'right', zh: '右邊 / 啱', example: 'You are right.' },
          { en: 'light', zh: '光', example: 'Turn on the light.' },
          { en: 'rice', zh: '米飯', example: 'I eat rice every day.' },
        ],
        practice: {
          prompt: 'Repeat: right, light, rice, lice, road, load, red, led, pray, play.',
          zh: '重複：right, light, rice, lice, road, load, red, led, pray, play。',
        },
        quiz: [
          { q: '"Right" and "light" differ in:', qZh: '"right" 同 "light" 唔同喺邊個音？', opts: ['r vs l', 'a vs e', 't vs k', 'silent letter'], ans: 0 },
          { q: '"Rice" vs "lice" differ in:', qZh: '"rice" 同 "lice" 唔同喺邊？', opts: ['r vs l', 'i vs a', 's vs t', 'c vs e'], ans: 0 },
          { q: 'To make /r/ sound, you should:', qZh: '讀 /r/ 音應該：', opts: ['舌尖頂牙齦', '捲舌', '合埋嘴唇', '唔郁'], ans: 1 },
        ],
      },
    ],
  },

  // Daily Conversation Deep Dive
  {
    id: 'daily-deep',
    icon: '',
    title: '深度日常會話',
    titleEn: 'Daily Conversation Deep Dive',
    desc: '深入日常對話 — 電話、投訴、道謝、敘事',
    level: 'intermediate',
    category: 'basics',
    lessons: [
      {
        id: 'daily-deep-1',
        title: '打電話禮儀',
        titleZh: '打電話',
        type: 'speaking',
        minutes: 7,
        content: '打電話同傳 message 唔同，冇 body language 幫你，所以要更清楚。\n\n開場白：\n• "Hello, this is [name] calling from [company]."\n• "Hi, may I speak to [name], please?"\n• "Is this a good time to talk?"\n\n結束：\n• "Thanks for your time."\n• "I\'ll follow up with an email."\n• "Have a great day!"',
        vocab: [
          { en: 'available', zh: '有空', example: 'Are you available now?' },
          { en: 'hold on', zh: '等一陣', example: 'Please hold on for a moment.' },
          { en: 'callback', zh: '回撥', example: 'I\'ll give you a callback.' },
          { en: 'reach', zh: '聯絡到', example: 'Can I reach you tomorrow?' },
        ],
        quiz: [
          { q: 'How to ask "may I speak to X"?', qZh: '點樣問 "可唔可以同 X 傾"？', opts: ['Hello X', 'May I speak to X, please?', 'X now', 'Give X'], ans: 1 },
          { q: '"Hold on" means:', qZh: '"hold on" 咩意思？', opts: ['掛住電話', '等一陣', '繼續講', '再嚟多次'], ans: 1 },
          { q: 'Polite way to end a call:', qZh: '禮貌結束電話：', opts: ['Bye', 'I\'m done', 'Thanks for your time', 'Whatever'], ans: 2 },
        ],
      },
      {
        id: 'daily-deep-2',
        title: '禮貌投訴',
        titleZh: '投訴',
        type: 'speaking',
        minutes: 8,
        content: '投訴嘅藝術：清楚講咩事 + 講你感受 + 提出解決方案。\n\n句型：\n• "I\'m sorry to bother you, but..."\n• "I\'m afraid there\'s a problem with..."\n• "I would appreciate it if..."\n• "Could you please...?"\n\n永遠保持冷靜，唔好人身攻擊。',
        vocab: [
          { en: 'complaint', zh: '投訴', example: 'I have a complaint.' },
          { en: 'apologize', zh: '道歉', example: 'I apologize for the inconvenience.' },
          { en: 'refund', zh: '退款', example: 'I would like a refund.' },
          { en: 'resolve', zh: '解決', example: 'How can we resolve this?' },
        ],
        quiz: [
          { q: 'Polite complaint opener:', qZh: '禮貌嘅投訴開場：', opts: ['You suck!', 'I\'m sorry to bother you, but...', 'Whatever', 'This is bad'], ans: 1 },
          { q: '"Refund" means:', qZh: '"refund" 咩意思？', opts: ['退款', '換貨', '投訴', '優惠'], ans: 0 },
          { q: 'Best way to complain:', qZh: '投訴最佳方法：', opts: ['大聲鬧', '清楚講 + 提出解決方案', '起底', '投訴到朋友'], ans: 1 },
        ],
      },
      {
        id: 'daily-deep-3',
        title: '真誠道謝',
        titleZh: '道謝',
        type: 'speaking',
        minutes: 5,
        content: '道謝唔單止講 "Thank you"。更真誠嘅講法：\n\n• "I really appreciate it."\n• "That means a lot to me."\n• "I can\'t thank you enough."\n• "You\'ve been incredibly helpful."\n• "I owe you one."\n\n回應：\n• "My pleasure."\n• "Anytime!"\n• "Glad to help."\n• "Don\'t mention it."',
        vocab: [
          { en: 'appreciate', zh: '感激', example: 'I really appreciate your help.' },
          { en: 'grateful', zh: '感恩', example: 'I\'m so grateful for this.' },
          { en: 'kindness', zh: '善意', example: 'Thank you for your kindness.' },
        ],
        quiz: [
          { q: 'Most sincere "thank you":', qZh: '最真誠嘅多謝：', opts: ['Thanks', 'I really appreciate it', 'Bye', 'OK'], ans: 1 },
          { q: 'Polite response to "thank you":', qZh: '回應多謝嘅禮貌講法：', opts: ['Whatever', 'No', 'My pleasure', 'So what'], ans: 2 },
          { q: '"I owe you one" means:', qZh: '"I owe you one" 咩意思？', opts: ['我欠你錢', '下次我幫返你', '我見你一次', '我哋撞咗'], ans: 1 },
        ],
      },
    ],
  },

  // Idiom Mastery
  {
    id: 'idiom-mastery',
    icon: '',
    title: '英文俚語精通',
    titleEn: 'Idiom Mastery',
    desc: '常用英文俚語，講嘢生動啲',
    level: 'advanced',
    category: 'basics',
    lessons: [
      {
        id: 'idiom-1',
        title: '動物俚語',
        titleZh: '動物',
        type: 'vocab',
        minutes: 6,
        content: '英文好多俚語用動物：\n\n• "Let the cat out of the bag" — 不小心說出秘密\n• "Break a leg" — 祝你好運（表演前用）\n• "It\'s raining cats and dogs" — 落大雨\n• "Hold your horses" — 唔好咁急\n• "Kill two birds with one stone" — 一石二鳥',
        vocab: [
          { en: 'cat', zh: '貓', example: 'The cat is out of the bag.' },
          { en: 'horse', zh: '馬', example: 'Hold your horses!' },
          { en: 'bird', zh: '鳥', example: 'Kill two birds with one stone.' },
        ],
        quiz: [
          { q: '"Break a leg" means:', qZh: '"Break a leg" 咩意思？', opts: ['真係跌倒', '祝你好運', '小心啲', '跑快啲'], ans: 1 },
          { q: '"Raining cats and dogs" means:', qZh: '"Raining cats and dogs" 咩意思？', opts: ['動物跌落嚟', '落大雨', '好凍', '有彩虹'], ans: 1 },
          { q: '"Hold your horses" means:', qZh: '"Hold your horses" 咩意思？', opts: ['照顧馬', '唔好咁急', '騎快啲', '去瞓覺'], ans: 1 },
        ],
      },
      {
        id: 'idiom-2',
        title: '身體俚語',
        titleZh: '身體',
        type: 'vocab',
        minutes: 6,
        content: '身體部位嘅俚語：\n\n• "Cost an arm and a leg" — 好貴\n• "Keep an eye on" — 留意\n• "Get cold feet" — 臨陣退縮\n• "Pull someone\'s leg" — 開玩笑\n• "Have a chip on your shoulder" — 對人唔住氣',
        vocab: [
          { en: 'arm', zh: '手臂', example: 'It cost an arm and a leg.' },
          { en: 'eye', zh: '眼', example: 'Keep an eye on the door.' },
          { en: 'shoulder', zh: '膊頭', example: 'He has a chip on his shoulder.' },
        ],
        quiz: [
          { q: '"Cost an arm and a leg" means:', qZh: '"Cost an arm and a leg" 咩意思？', opts: ['要捐器官', '好貴', '好平', '好食'], ans: 1 },
          { q: '"Keep an eye on" means:', qZh: '"Keep an eye on" 咩意思？', opts: ['眨吓眼', '留意', '扮睇唔到', '瞓覺'], ans: 1 },
          { q: '"Get cold feet" means:', qZh: '"Get cold feet" 咩意思？', opts: ['凍親', '臨陣退縮', '跑步快', '跳舞'], ans: 1 },
        ],
      },
    ],
  },

  // Writing Skills
  {
    id: 'writing-skills',
    icon: '',
    title: '英文寫作',
    titleEn: 'Writing Skills',
    desc: '由完整句子到段落、Essay 結構',
    level: 'intermediate',
    category: 'basics',
    lessons: [
      {
        id: 'writing-1',
        title: '完整句子',
        titleZh: '完整句',
        type: 'reading',
        minutes: 7,
        content: '一個完整英文句子要有 Subject + Verb：\n\n基本結構：\n• S + V: "She runs."\n• S + V + O: "I love coffee."\n• S + V + C: "He is happy."\n• S + V + IO + DO: "She gave me a book."\n\n常見錯誤：fragment（冇動詞）、run-on（兩個句子黐埋）',
        vocab: [
          { en: 'subject', zh: '主詞', example: '"She" is the subject.' },
          { en: 'verb', zh: '動詞', example: 'Every sentence needs a verb.' },
          { en: 'object', zh: '受詞', example: 'The dog is the object.' },
          { en: 'fragment', zh: '殘句', example: 'Avoid sentence fragments.' },
        ],
        quiz: [
          { q: 'A complete sentence needs:', qZh: '完整句子需要：', opts: ['S + V', 'only a noun', 'just an emoji', 'a photo'], ans: 0 },
          { q: 'Which is a complete sentence?', qZh: '邊個係完整句子？', opts: ['Running fast', 'She runs fast', 'The happy', 'Yesterday'], ans: 1 },
          { q: 'What is a sentence fragment?', qZh: 'Sentence fragment 係咩？', opts: ['長篇大論', '冇完整 S+V 嘅殘句', '一個問題', '對話'], ans: 1 },
        ],
      },
      {
        id: 'writing-2',
        title: '段落結構',
        titleZh: '段落',
        type: 'reading',
        minutes: 8,
        content: '好嘅段落要有：\n\n1. Topic Sentence（主題句）— 段首講段旨\n2. Supporting Sentences（支持句）— 2-3 句解釋/舉例\n3. Concluding Sentence（總結句）— 段尾重點\n\n段落之間用 transition words 連接：\n• "However", "Moreover", "In addition", "On the other hand"',
        vocab: [
          { en: 'topic sentence', zh: '主題句', example: 'Start with a topic sentence.' },
          { en: 'transition', zh: '過渡詞', example: 'Use transitions between paragraphs.' },
          { en: 'conclude', zh: '總結', example: 'Conclude with a strong point.' },
        ],
        quiz: [
          { q: 'First sentence of a paragraph is the:', qZh: '段落第一句通常係：', opts: ['Conclusion', 'Topic sentence', 'Question', 'Example'], ans: 1 },
          { q: 'Which is a transition word?', qZh: '邊個係過渡詞？', opts: ['Apple', 'However', 'Hello', '5'], ans: 1 },
          { q: 'Good paragraph has:', qZh: '好嘅段落包括：', opts: ['Just one sentence', 'Topic + supporting + conclusion', 'Just a question', 'A photo'], ans: 1 },
        ],
      },
    ],
  },

  // Job Interview Deep Dive
  {
    id: 'interview-pro',
    icon: '',
    title: '面試高手',
    titleEn: 'Job Interview Pro',
    desc: '由自我介紹到行為題、薪酬談判全套',
    level: 'advanced',
    category: 'business',
    lessons: [
      {
        id: 'interview-pro-1',
        title: 'STAR 法則',
        titleZh: 'STAR',
        type: 'speaking',
        minutes: 9,
        content: '行為題必用 STAR framework：\n\n• S (Situation) — 背景情境\n• T (Task) — 你嘅任務\n• A (Action) — 你做咗咩\n• R (Result) — 結果點\n\n例題："Tell me about a time you solved a conflict."\n答：\nS — 兩個 engineer 對架構有爭議\nT — 我要搵個共識\nA — 安排會議、聆聽、列出 pros and cons\nR — 揀咗 hybrid approach，兩人都滿意',
        vocab: [
          { en: 'situation', zh: '情境', example: 'Describe the situation.' },
          { en: 'task', zh: '任務', example: 'What was your task?' },
          { en: 'action', zh: '行動', example: 'What actions did you take?' },
          { en: 'result', zh: '結果', example: 'What was the result?' },
        ],
        quiz: [
          { q: 'STAR means:', qZh: 'STAR 係咩？', opts: ['Situation, Task, Action, Result', 'Sample, Test, Ask, Read', 'Strong, Tough, Active, Real', 'Start To Answer Right'], ans: 0 },
          { q: 'In STAR, "A" stands for:', qZh: 'STAR 嘅 A 係咩？', opts: ['Answer', 'Action', 'Attempt', 'Argument'], ans: 1 },
          { q: 'A good STAR answer should be:', qZh: '好嘅 STAR 答案：', opts: ['One word', '2-3 minutes with all 4 parts', 'A song', 'Just a list'], ans: 1 },
        ],
      },
      {
        id: 'interview-pro-2',
        title: '問面試官嘅問題',
        titleZh: '反問',
        type: 'speaking',
        minutes: 6,
        content: '面試尾聲一定問問題！展示你有做功課：\n\n• "What does success look like in this role?"\n• "What\'s the team culture like?"\n• "How do you measure performance?"\n• "What\'s the biggest challenge the team is facing?"\n• "What are the next steps in the process?"\n\n唔好問：salary（第一次 interview 唔好問）、vacation（太早）',
        vocab: [
          { en: 'role', zh: '職位', example: 'What does this role involve?' },
          { en: 'culture', zh: '文化', example: 'Tell me about the team culture.' },
          { en: 'measure', zh: '衡量', example: 'How do you measure performance?' },
        ],
        quiz: [
          { q: 'Best question to ask at end of interview:', qZh: '面試尾聲最好問：', opts: ['How much money?', 'What does success look like?', 'When is lunch?', 'Can I leave?'], ans: 1 },
          { q: 'Should you ask about salary in first interview?', qZh: '第一次面試應唔應該問人工？', opts: ['Yes, always', 'No, save for later', 'Ask 5 times', 'Demand a number'], ans: 1 },
          { q: '"Team culture" refers to:', qZh: '"Team culture" 係咩？', opts: ['食物', '團隊嘅工作方式同價值觀', '制服', '建築'], ans: 1 },
        ],
      },
    ],
  },

  // Tourism Phrases
  {
    id: 'tourism-phrases',
    icon: '',
    title: '旅遊萬用句',
    titleEn: 'Tourism Phrases',
    desc: '問路、買嘢、急症、影相 — 旅行必備',
    level: 'beginner',
    category: 'travel',
    lessons: [
      {
        id: 'tour-1',
        title: '問路',
        titleZh: '問路',
        type: 'speaking',
        minutes: 5,
        content: '問路必備句：\n\n• "Excuse me, how do I get to ___?"\n• "Is it far from here?"\n• "Can I walk there?"\n• "Which bus goes to ___?"\n• "Could you show me on the map?"\n\n聽指示：\n• "Go straight" — 一直行\n• "Turn left/right" — 轉左/右\n• "It\'s on your left/right" — 你左手/右手邊',
        vocab: [
          { en: 'straight', zh: '直行', example: 'Go straight for two blocks.' },
          { en: 'block', zh: '街區', example: 'It\'s three blocks away.' },
          { en: 'corner', zh: '街角', example: 'It\'s on the corner.' },
        ],
        quiz: [
          { q: '"How do I get to the station?" is asking for:', qZh: '"How do I get to the station?" 問緊咩？', opts: ['車票', '路線', '時間', '價錢'], ans: 1 },
          { q: '"Turn left" means:', qZh: '"Turn left" 咩意思？', opts: ['轉右', '轉左', '直行', '停'], ans: 1 },
          { q: 'Polite way to ask directions:', qZh: '禮貌問路：', opts: ['Hey you!', 'Excuse me, could you...?', 'Where?', 'Lost.'], ans: 1 },
        ],
      },
      {
        id: 'tour-2',
        title: '購物退稅',
        titleZh: '購物',
        type: 'speaking',
        minutes: 6,
        content: '購物 + 退稅：\n\n• "How much is this?" — 幾錢\n• "Do you have a smaller/bigger size?" — 有冇細啲/大啲碼\n• "Can I try it on?" — 我可以試吓嗎\n• "Do you accept credit cards?" — 收唔收信用卡\n• "Can I get a tax refund?" — 可以退稅嗎',
        vocab: [
          { en: 'size', zh: '尺碼', example: 'What size do you need?' },
          { en: 'discount', zh: '折扣', example: 'Is there a discount?' },
          { en: 'receipt', zh: '收據', example: 'Keep your receipt for the refund.' },
          { en: 'refund', zh: '退款', example: 'I want a refund.' },
        ],
        quiz: [
          { q: '"How much is this?" means:', qZh: '"How much is this?" 咩意思？', opts: ['幾多件', '幾錢', '幾重', '幾遠'], ans: 1 },
          { q: 'A "tax refund" is:', qZh: '"tax refund" 係咩？', opts: ['加稅', '退稅', '免稅店', '折扣'], ans: 1 },
          { q: 'Polite way to try on clothes:', qZh: '試身嘅禮貌講法：', opts: ['Give me', 'Can I try it on?', 'I want', 'Now'], ans: 1 },
        ],
      },
    ],
  },
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find(c => c.id === id);
}

export function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  return getCourse(courseId)?.lessons.find(l => l.id === lessonId);
}
