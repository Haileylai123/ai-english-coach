// services/courses.ts — Structured learning courses with lessons

export type LessonType = 'reading' | 'speaking' | 'vocab' | 'quiz' | 'listening';

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
