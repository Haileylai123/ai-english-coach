// services/scenarios.ts — Scene definitions ported from web version
// Business · IELTS · Daily · Restaurant · Interview · Dating · Doctor

export interface ScenarioPrompt {
  zh: string;
  en: string;
}

export interface Scenario {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  prompts: Record<'beginner' | 'intermediate' | 'advanced', ScenarioPrompt[]>;
  keyVocab: string[];
  usefulPhrases: { zh: string; en: string }[];
  pronFocus: string[];
}

export type SceneId = 'business' | 'ielts' | 'daily' | 'restaurant' | 'interview' | 'dating' | 'doctor' | 'ted';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export const SCENARIOS: Record<SceneId, Scenario> = {
  business: {
    id: 'business', name: '商務英語', nameEn: 'Business English', icon: '💼',
    prompts: {
      beginner: [
        { zh: '請介紹一下你的工作內容。', en: 'Please introduce what you do at work.' },
        { zh: '描述你的一天工作流程。', en: 'Describe your daily work routine.' },
        { zh: '你為什麼選擇現在這份工作？', en: 'Why did you choose your current job?' },
        { zh: '說說你擅長的專業技能。', en: 'Tell me about your professional skills.' },
      ],
      intermediate: [
        { zh: '請用英文做一個 2 分鐘的自我介紹，包含你的經歷和目標。', en: 'Give a 2-minute self-introduction including your experience and goals.' },
        { zh: '描述一次你解決工作中的困難的經驗。', en: 'Describe a time you solved a difficult problem at work.' },
        { zh: '如何向客戶推銷一個新產品？請現場演示。', en: 'How would you pitch a new product to a client? Demonstrate.' },
        { zh: '談談你對行業趨勢的看法。', en: 'Share your thoughts on current industry trends.' },
        { zh: '主持一個小型團隊會議，討論項目進度。', en: 'Lead a small team meeting to discuss project progress.' },
      ],
      advanced: [
        { zh: '進行一次全英文的商務談判：你要說服對方接受你的報價。', en: 'Conduct a business negotiation: convince the other party to accept your offer.' },
        { zh: '做一個關於市場策略的 3 分鐘演講，包含數據分析。', en: 'Give a 3-minute presentation on market strategy with data analysis.' },
        { zh: '模擬一次跨文化團隊衝突，你如何用英文調解？', en: 'Simulate resolving a cross-cultural team conflict in English.' },
        { zh: '對董事會做季度報告：包含成果、挑戰和下一步計劃。', en: 'Present a quarterly report to the board: results, challenges, next steps.' },
        { zh: '討論一個併購案：分析優缺點並給出建議。', en: 'Discuss an M&A case: analyze pros and cons and make recommendations.' },
      ],
    },
    keyVocab: ['strategic', 'implementation', 'stakeholder', 'leverage', 'optimize', 'collaboration', 'initiative', 'revenue', 'milestone', 'deliverable', 'synergy', 'scalable', 'budget', 'forecast', 'proposal', 'negotiation', 'partnership', 'benchmark', 'streamline', 'deadline', 'presentation', 'quarterly', 'client', 'contract', 'investment', 'acquisition'],
    usefulPhrases: [
      { zh: '我想提出一個建議...', en: "I'd like to propose that..." },
      { zh: '從我的角度來看...', en: 'From my perspective...' },
      { zh: '讓我們總結一下重點。', en: "Let's recap the key points." },
      { zh: '我跟進一下這個問題。', en: 'Let me follow up on this issue.' },
      { zh: '我們達成共識了嗎？', en: 'Are we in agreement on this?' },
      { zh: '能詳細說明一下嗎？', en: 'Could you elaborate on that?' },
      { zh: '我建議我們優先考慮...', en: 'I suggest we prioritize...' },
    ],
    pronFocus: ['th sound', 'schwa sound', 'word stress in multi-syllable terms'],
  },

  ielts: {
    id: 'ielts', name: '雅思考試', nameEn: 'IELTS Speaking', icon: '📝',
    prompts: {
      beginner: [
        { zh: '請介紹你的家鄉。', en: 'Please describe your hometown.' },
        { zh: '你最喜歡的愛好是什麼？為什麼？', en: 'What is your favorite hobby and why?' },
        { zh: '描述你最好的朋友。', en: 'Describe your best friend.' },
        { zh: '你喜歡什麼類型的音樂？', en: 'What type of music do you like?' },
      ],
      intermediate: [
        { zh: 'IELTS Part 2: 描述一個你難忘的旅行經歷。', en: 'IELTS Part 2: Describe an unforgettable trip. Where, what, why?' },
        { zh: 'IELTS Part 2: 描述一個對你有重大影響的人。', en: 'IELTS Part 2: Describe a person who had a significant influence on you.' },
        { zh: 'IELTS Part 3: 你認為科技如何改變了人們的溝通方式？', en: 'IELTS Part 3: How has technology changed the way people communicate?' },
        { zh: 'IELTS Part 3: 城市生活和鄉村生活哪個更好？為什麼？', en: 'IELTS Part 3: Is city life or country life better? Why?' },
      ],
      advanced: [
        { zh: 'IELTS Part 3: 討論全球化對文化的影響。', en: 'IELTS Part 3: Discuss the impact of globalization on culture.' },
        { zh: 'IELTS Part 3: 你認為教育體系應該如何改革？', en: 'IELTS Part 3: How should the education system be reformed?' },
        { zh: 'IELTS Part 3: 討論氣候變遷的解決方案。', en: 'IELTS Part 3: Discuss solutions to climate change.' },
        { zh: '模擬完整 IELTS Speaking Test (Part 1-3)', en: 'Full mock IELTS Speaking Test (Parts 1-3).' },
      ],
    },
    keyVocab: ['describe', 'explain', 'compare', 'contrast', 'analyze', 'evaluate', 'justify', 'illustrate', 'demonstrate', 'significant', 'fundamental', 'essential', 'crucial', 'beneficial', 'detrimental', 'perspective', 'consequence', 'implication', 'alternative', 'priority', 'trend', 'phenomenon', 'development'],
    usefulPhrases: [
      { zh: '在我看來...', en: 'In my opinion...' },
      { zh: '從某種程度上來說...', en: 'To some extent...' },
      { zh: '這是一個複雜的問題...', en: 'This is a complex issue...' },
      { zh: '一方面...另一方面...', en: 'On one hand... on the other hand...' },
      { zh: '總結來說...', en: 'To sum up...' },
      { zh: '我想補充一點...', en: 'I would add that...' },
    ],
    pronFocus: ['linking words', 'intonation patterns', 'stress timing'],
  },

  daily: {
    id: 'daily', name: '日常聊天', nameEn: 'Daily Chat', icon: '☕',
    prompts: {
      beginner: [
        { zh: '今天過得怎麼樣？', en: "How was your day?" },
        { zh: '你週末通常做什麼？', en: 'What do you usually do on weekends?' },
        { zh: '你最喜歡的食物是什麼？', en: "What's your favorite food?" },
        { zh: '你有養寵物嗎？', en: 'Do you have any pets?' },
      ],
      intermediate: [
        { zh: '聊聊你最近看的一部電影或影集。', en: 'Tell me about a movie or show you watched recently.' },
        { zh: '如果你可以去任何地方旅行，你會去哪裡？為什麼？', en: 'If you could travel anywhere, where and why?' },
        { zh: '分享一個有趣的故事或經歷。', en: 'Share an interesting story or experience.' },
        { zh: '你認為什麼是幸福的秘訣？', en: "What do you think is the secret to happiness?" },
      ],
      advanced: [
        { zh: '辯論：社交媒體對人際關係的影響是好還是壞？', en: 'Debate: Is social media good or bad for relationships?' },
        { zh: '如果你可以改變世界上一件事，你會改變什麼？', en: 'If you could change one thing in the world, what would it be?' },
        { zh: '聊聊你的人生哲學和價值觀。', en: 'Share your life philosophy and values.' },
        { zh: '自由發揮：講一個 2 分鐘的即興故事。', en: 'Freestyle: Tell a 2-minute improvised story.' },
      ],
    },
    keyVocab: ['hobby', 'weekend', 'favorite', 'interesting', 'experience', 'opinion', 'relationship', 'lifestyle', 'culture', 'entertainment', 'fashion', 'technology', 'social media', 'environment', 'community', 'volunteer', 'celebrate', 'tradition', 'memory', 'dream'],
    usefulPhrases: [
      { zh: '說真的...', en: 'To be honest...' },
      { zh: '其實...', en: 'Actually...' },
      { zh: '你知道嗎...', en: 'You know what...' },
      { zh: '我的意思是...', en: 'I mean...' },
      { zh: '太有趣了！', en: "That's so interesting!" },
      { zh: '你覺得呢？', en: 'What do you think?' },
    ],
    pronFocus: ['casual contractions', 'natural rhythm', 'linking sounds'],
  },

  restaurant: {
    id: 'restaurant', name: '餐廳訂位', nameEn: 'Restaurant', icon: '🍽️',
    prompts: {
      beginner: [
        { zh: '請用英文訂一個兩人桌。', en: 'Book a table for two, please.' },
        { zh: '詢問今天的特色菜是什麼。', en: "Ask what today's special is." },
        { zh: '點一道主菜和一杯飲料。', en: 'Order a main dish and a drink.' },
        { zh: '請結帳。', en: 'Ask for the bill, please.' },
      ],
      intermediate: [
        { zh: '你對某些食物過敏，請向服務生說明。', en: 'Tell the waiter about your food allergies.' },
        { zh: '點餐時要求客製化（少鹽、全熟、不加蔥等）。', en: 'Customize your order (less salt, well-done, no onions).' },
        { zh: '對餐點不滿意，禮貌地反映問題。', en: "You're unhappy with your meal — complain politely." },
        { zh: '和朋友討論菜單，分享你的推薦。', en: 'Discuss the menu with a friend and share recommendations.' },
      ],
      advanced: [
        { zh: '模擬一次完整的 fine dining 體驗（從訂位到離開）。', en: 'Simulate a complete fine dining experience (reservation to departure).' },
        { zh: '和主廚討論一道菜的食材和烹飪方式。', en: 'Discuss ingredients and cooking methods with the chef.' },
        { zh: '主持一個小型聚餐，招呼客人點餐。', en: 'Host a small dinner party and take orders from guests.' },
      ],
    },
    keyVocab: ['reservation', 'appetizer', 'entree', 'dessert', 'beverage', 'medium-rare', 'well-done', 'gluten-free', 'vegetarian', 'vegan', 'allergy', 'ingredient', 'seasoning', 'flavor', 'portion', 'service', 'tip', 'compliment', 'complaint', 'menu'],
    usefulPhrases: [
      { zh: '請問有訂位嗎？', en: 'Do you have a reservation?' },
      { zh: '今天的特色菜是什麼？', en: "What's today's special?" },
      { zh: '我要點...', en: 'I would like to order...' },
      { zh: '請幫我結帳。', en: 'Could I have the bill, please?' },
      { zh: '這道菜很好吃！', en: 'This dish is delicious!' },
    ],
    pronFocus: ['food vocabulary stress', 'polite intonation', 'clear requests'],
  },

  interview: {
    id: 'interview', name: '面試', nameEn: 'Interview', icon: '🤵',
    prompts: {
      beginner: [
        { zh: '請自我介紹。', en: 'Tell me about yourself.' },
        { zh: '你為什麼想應徵這個職位？', en: 'Why do you want this position?' },
        { zh: '說說你的優點和缺點。', en: 'What are your strengths and weaknesses?' },
      ],
      intermediate: [
        { zh: '描述一次你領導團隊的經驗。', en: 'Describe a time you led a team.' },
        { zh: '你如何處理工作中的壓力和截止日期？', en: 'How do you handle work pressure and deadlines?' },
        { zh: '你對未來的職業規劃是什麼？', en: 'What are your career goals for the future?' },
        { zh: '為什麼我們應該錄用你？', en: 'Why should we hire you?' },
      ],
      advanced: [
        { zh: '模擬一次完整的行為面試（STAR method）。', en: 'Complete behavioral interview simulation (STAR method).' },
        { zh: '你對這家公司的發展有什麼建議？', en: 'What suggestions do you have for our company\'s growth?' },
        { zh: '談判薪資和福利。', en: 'Negotiate salary and benefits.' },
      ],
    },
    keyVocab: ['qualification', 'experience', 'achievement', 'leadership', 'teamwork', 'initiative', 'problem-solving', 'communication', 'deadline', 'priority', 'goal-oriented', 'adaptable', 'proactive', 'collaborative', 'innovative', 'detail-oriented', 'motivated', 'passionate'],
    usefulPhrases: [
      { zh: '我的優勢是...', en: 'My strength is...' },
      { zh: '我曾經負責...', en: 'I was responsible for...' },
      { zh: '我在...方面有豐富經驗。', en: 'I have extensive experience in...' },
      { zh: '我期待為貴公司貢獻...', en: 'I look forward to contributing...' },
      { zh: '請問這個職位的下一步是什麼？', en: 'What are the next steps for this position?' },
    ],
    pronFocus: ['confident tone', 'clear articulation', 'professional vocabulary'],
  },

  dating: {
    id: 'dating', name: '約會', nameEn: 'Dating', icon: '💕',
    prompts: {
      beginner: [
        { zh: '用英文自我介紹並打招呼。', en: 'Introduce yourself and say hi.' },
        { zh: '聊聊你的興趣愛好。', en: 'Talk about your hobbies and interests.' },
        { zh: '你喜歡什麼類型的電影/音樂？', en: 'What kind of movies/music do you like?' },
      ],
      intermediate: [
        { zh: '描述你的理想型。', en: 'Describe your ideal type.' },
        { zh: '聊聊你對感情的看法。', en: 'Share your views on relationships.' },
        { zh: '計劃一次完美的第一次約會。', en: 'Plan a perfect first date.' },
        { zh: '如何優雅地拒絕不適合的人？', en: 'How to politely decline someone who isn\'t a match?' },
      ],
      advanced: [
        { zh: '討論跨文化關係的挑戰和樂趣。', en: 'Discuss the challenges and joys of cross-cultural relationships.' },
        { zh: '模擬一次深入的互相了解對話。', en: 'Simulate a deep getting-to-know-you conversation.' },
      ],
    },
    keyVocab: ['personality', 'chemistry', 'compatible', 'attraction', 'relationship', 'commitment', 'affection', 'appreciate', 'genuine', 'sincere', 'spontaneous', 'adventurous', 'romantic', 'thoughtful', 'charming'],
    usefulPhrases: [
      { zh: '很高興認識你。', en: 'Nice to meet you.' },
      { zh: '你週末通常做什麼？', en: 'What do you usually do on weekends?' },
      { zh: '我覺得你很...', en: 'I think you\'re...' },
      { zh: '要不要一起喝杯咖啡？', en: 'Would you like to grab a coffee?' },
    ],
    pronFocus: ['friendly tone', 'natural pauses', 'emotional expression'],
  },

  doctor: {
    id: 'doctor', name: '睇醫生', nameEn: 'Doctor', icon: '🩺',
    prompts: {
      beginner: [
        { zh: '向醫生描述你的症狀。', en: 'Describe your symptoms to the doctor.' },
        { zh: '掛號並說明你要看什麼科。', en: 'Register and say which department you need.' },
        { zh: '告訴醫生你的過敏史。', en: 'Tell the doctor about your allergies.' },
      ],
      intermediate: [
        { zh: '詳細描述你的疼痛（位置、程度、持續時間）。', en: 'Describe your pain in detail (location, intensity, duration).' },
        { zh: '和醫生討論檢查結果。', en: 'Discuss test results with the doctor.' },
        { zh: '預約下一次覆診。', en: 'Schedule a follow-up appointment.' },
      ],
      advanced: [
        { zh: '模擬急診室場景。', en: 'Simulate an emergency room visit.' },
        { zh: '和專科醫生討論複雜的治療方案。', en: 'Discuss complex treatment options with a specialist.' },
        { zh: '解釋你的家族病史和生活方式。', en: 'Explain your family history and lifestyle.' },
      ],
    },
    keyVocab: ['symptom', 'diagnosis', 'prescription', 'appointment', 'allergy', 'chronic', 'acute', 'infection', 'inflammation', 'treatment', 'medication', 'dosage', 'side effect', 'recovery', 'surgery', 'therapy', 'vaccination', 'insurance', 'referral', 'specialist'],
    usefulPhrases: [
      { zh: '我感覺不舒服。', en: "I'm not feeling well." },
      { zh: '這裡痛。', en: 'It hurts here.' },
      { zh: '這種情況持續多久了？', en: 'How long has this been going on?' },
      { zh: '我對...過敏。', en: "I'm allergic to..." },
      { zh: '一天吃幾次？', en: 'How many times a day should I take it?' },
    ],
    pronFocus: ['clear symptom description', 'medical terms pronunciation', 'calm tone'],
  },
  ted: {
    id: 'ted',
    name: 'TED 演講',
    nameEn: 'TED Talk',
    icon: '🎤',
    prompts: {
      beginner: [
        { zh: '介紹一個你喜歡的習慣，說說為什麼重要。', en: 'Introduce a habit you enjoy and explain why it matters to you.' },
        { zh: '描述一個改變你想法的時刻。', en: 'Describe a moment that changed the way you think.' },
        { zh: '分享一個對你有特殊意義的地方。', en: 'Share a place that has special meaning to you.' },
        { zh: '談談你最欣賞的人以及為什麼。', en: 'Talk about someone you admire and why.' },
      ],
      intermediate: [
        { zh: '用一個小故事說明一個大道理。', en: 'Use a small story to illustrate a big idea.' },
        { zh: '解釋一個複雜的概念，用簡單的例子。', en: 'Explain a complex idea using a simple example.' },
        { zh: '談一個你認為被誤解的話題。', en: 'Talk about a topic you think is misunderstood.' },
        { zh: '描述一個你想解決的問題。', en: 'Describe a problem you would like to solve.' },
      ],
      advanced: [
        { zh: '提出一個改變世界的小改變。', en: 'Propose one small change that could transform the world.' },
        { zh: '論證一個違反直覺的觀點。', en: 'Make the case for a counterintuitive idea.' },
        { zh: '用一個失敗的故事帶出深刻的教訓。', en: 'Use a story of failure to teach a powerful lesson.' },
        { zh: '重新定義一個被濫用的概念。', en: 'Reframe a concept that has been overused or misunderstood.' },
      ],
    },
    keyVocab: ['idea', 'passion', 'curiosity', 'inspire', 'imagine', 'change', 'future', 'possibility', 'courage', 'journey', 'discovery', 'perspective', 'audience', 'message', 'belief', 'challenge', 'opportunity', 'story', 'lesson', 'impact', 'vision', 'innovation', 'connection', 'meaning', 'purpose'],
    usefulPhrases: [
      { zh: '我想跟大家分享一個想法。', en: 'I want to share an idea with you.' },
      { zh: '想像一下，如果...', en: 'Imagine, for a moment, if...' },
      { zh: '讓我告訴你一個故事。', en: 'Let me tell you a story.' },
      { zh: '這對我來說意義重大。', en: 'This means a great deal to me.' },
      { zh: '今天我想談談...', en: 'Today, I want to talk about...' },
      { zh: '這改變了我對...的看法。', en: 'This changed my perspective on...' },
    ],
    pronFocus: ['clear pauses between ideas', 'emphasis on key words', 'engaging tone for audience'],
  },
};

export function getRandomPrompt(sceneId: SceneId, difficulty: Difficulty): ScenarioPrompt {
  const scene = SCENARIOS[sceneId];
  if (!scene) return { zh: '請用英文自由發言。', en: 'Please speak freely in English.' };
  const prompts = scene.prompts[difficulty];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  const map: Record<Difficulty, string> = {
    beginner: '初級 Beginner',
    intermediate: '中級 Intermediate',
    advanced: '高級 Advanced',
  };
  return map[difficulty];
}
