// services/courses-fill.ts — Fills thin courses up to 5+ lessons each
// Merged into ALL_COURSES in courses.ts
import { Lesson } from './courses';

/** Extra lessons keyed by course ID. All thin courses get filled to 5+. */
export const EXTRA_LESSONS: Record<string, Lesson[]> = {

  // ===== eng-basics: 3→5 (+2) =====
  'eng-basics': [
    {
      id: 'eng-basics-4', title: '顏色、天氣、情感', titleZh: '顏色天氣', type: 'vocab', minutes: 7,
      content: '基本形容詞令你嘅英文即刻豐富。\n\n顏色：red, blue, green, yellow, black, white, pink, purple, orange, brown, gray\n\n天氣：\n• "It\'s sunny / rainy / cloudy / windy today."\n• "What\'s the weather like?" → "It\'s hot and humid."\n\n情感：\n• happy, sad, angry, tired, excited, nervous, bored, surprised\n• "I feel ___ because ___."',
      vocab: [
        { en: 'sunny', zh: '晴天', example: 'It\'s sunny today!' },
        { en: 'humid', zh: '潮濕', example: 'Hong Kong is very humid.' },
        { en: 'excited', zh: '興奮', example: 'I\'m excited about the trip!' },
        { en: 'nervous', zh: '緊張', example: 'I\'m nervous about the interview.' },
      ],
      practice: { prompt: 'Describe today\'s weather and how you feel in 3 sentences.', zh: '用 3 句描述今日天氣同你嘅心情。' },
      quiz: [
        { q: '"It\'s raining" 點樣講？', qZh: '', opts: ['It\'s sunny', 'It\'s rainy', 'It\'s windy', 'It\'s snowy'], ans: 1 },
        { q: '"humid" 點解？', qZh: '', opts: ['乾燥', '潮濕', '寒冷', '炎熱'], ans: 1 },
      ],
    },
    {
      id: 'eng-basics-5', title: '問路、購物基本句', titleZh: '問路購物', type: 'speaking', minutes: 8,
      content: '日常生活最常用嘅兩大場景。\n\n問路：\n• "Excuse me, where is the ___?"\n• "How do I get to ___?"\n• "Is it far?" / "Can I walk there?"\n• "Turn left / right / Go straight."\n\n購物：\n• "How much is this?"\n• "Do you have this in a different size?"\n• "Can I try this on?"\n• "I\'ll take it!" / "Just looking, thanks."',
      vocab: [
        { en: 'straight', zh: '直行', example: 'Go straight for two blocks.' },
        { en: 'corner', zh: '街角', example: 'It\'s on the corner.' },
        { en: 'size', zh: '尺寸', example: 'Do you have a larger size?' },
        { en: 'try on', zh: '試穿', example: 'Can I try this on?' },
      ],
      practice: { prompt: 'You\'re looking for the nearest MTR station. Ask for directions.', zh: '你想去最近嘅地鐵站。用英文問路。' },
      quiz: [
        { q: '"How much is this?" 點解？', qZh: '', opts: ['幾多件', '幾錢', '幾重', '幾遠'], ans: 1 },
        { q: '"Go straight" 點解？', qZh: '', opts: ['轉左', '轉右', '直行', '停低'], ans: 2 },
      ],
    },
  ],

  // ===== business-101: 3→5 (+2) =====
  'business-101': [
    {
      id: 'business-101-4', title: '談判技巧', titleZh: '談判', type: 'speaking', minutes: 10,
      content: '商務談判必備句型。\n\n開價：\n• "Our initial proposal is..."\n• "We\'re looking at around..."\n\n讓步：\n• "If you can ___, we can ___."\n• "That\'s workable if we adjust the timeline."\n\n堅持底線：\n• "I\'m afraid that\'s the best we can do."\n• "That\'s our final offer."\n\n達成協議：\n• "I think we have a deal."\n• "Let\'s put this in writing."',
      vocab: [
        { en: 'proposal', zh: '提案', example: 'Here is our proposal.' },
        { en: 'compromise', zh: '妥協', example: 'Let\'s find a compromise.' },
        { en: 'deadlock', zh: '僵局', example: 'We\'ve reached a deadlock.' },
        { en: 'mutual', zh: '互相', example: 'We need a mutually beneficial solution.' },
      ],
      practice: { prompt: 'Negotiate a price: you\'re selling software, they want 20% off. Find a middle ground.', zh: '談判：你賣軟件，對方要求 8 折。搵共識。' },
      quiz: [
        { q: '"I\'m afraid that\'s the best we can do" 係咩意思？', qZh: '', opts: ['可以再傾', '已經係底線', '我唔知', '隨便你'], ans: 1 },
        { q: '"mutually beneficial" 點解？', qZh: '', opts: ['對一方有利', '對雙方有利', '冇人有利', '有害'], ans: 1 },
      ],
    },
    {
      id: 'business-101-5', title: '跨文化溝通', titleZh: '跨文化', type: 'reading', minutes: 8,
      content: '同外國同事/客戶合作嘅文化差異。\n\n🇺🇸 美國：直接、效率優先\n• "Let\'s get straight to the point."\n• 反對上司係正常（constructive disagreement）\n\n🇬🇧 英國：間接、有禮、幽默\n• "That\'s an interesting idea..."（可能係反對）\n• Understatement：好嘢話 "not bad"\n\n🇯🇵 日本：階級、共識、讀空氣\n• 明確 Yes/No 好少見 → "We\'ll consider it."\n• 名刺交換好重要\n\n通用 tips：觀察、模仿、問問題。',
      vocab: [
        { en: 'direct', zh: '直接', example: 'Americans tend to be more direct.' },
        { en: 'indirect', zh: '間接', example: 'British communication is often indirect.' },
        { en: 'hierarchy', zh: '階級', example: 'Hierarchy matters in many Asian cultures.' },
        { en: 'context', zh: '語境', example: 'High-context vs low-context cultures.' },
      ],
      quiz: [
        { q: '美國職場文化係？', qZh: '', opts: ['絕對服從', '直接溝通、可以反對上司', '唔可以出聲', '一定要送禮'], ans: 1 },
        { q: '"That\'s an interesting idea" 喺英國可能係咩意思？', qZh: '', opts: ['真心讚賞', '禮貌反對', '冇意見', '想繼續傾'], ans: 1 },
      ],
    },
  ],

  // ===== ielts-speaking: 2→5 (+3) =====
  'ielts-speaking': [
    {
      id: 'ielts-3', title: 'Part 3: 深度討論策略', titleZh: 'Part3策略', type: 'speaking', minutes: 10,
      content: 'IELTS Part 3 係雙向討論，考官會追問。\n\n技巧：\n① 用 "It depends" 展示批判思考\n② 舉具體例子支持論點\n③ 用 compare & contrast（比較對比）\n\n常見追問：\n• "Why do you think that?"\n• "Can you give me an example?"\n• "Do you think it\'s the same everywhere?"\n\n結構：Opinion → Reason → Example → Compare',
      vocab: [
        { en: 'it depends', zh: '視乎情況', example: 'It depends on the context.' },
        { en: 'factor', zh: '因素', example: 'There are several factors.' },
        { en: 'generation', zh: '世代', example: 'The younger generation thinks differently.' },
      ],
      practice: { prompt: 'Answer: "Do you think technology makes people more or less social?"', zh: '回答：科技令人更社交定更孤獨？' },
      quiz: [
        { q: 'Part 3 最佳開頭？', qZh: '', opts: ['Yes/No', '"It depends..."', 'I don\'t know', 'Silence'], ans: 1 },
        { q: '追問時考官想睇咩？', qZh: '', opts: ['背誦答案', '批判思考+舉例', '快答完', '轉話題'], ans: 1 },
      ],
    },
    {
      id: 'ielts-4', title: 'Band 7+ 必備詞彙', titleZh: '高分詞彙', type: 'vocab', minutes: 10,
      content: 'IELTS 攞 Band 7+ 嘅關鍵詞彙。考官想聽到呢啲：\n\n代替 "good"：beneficial, advantageous, favorable\n代替 "bad"：detrimental, harmful, adverse\n代替 "important"：crucial, essential, vital, paramount\n代替 "I think"：In my view, From my perspective, I believe\n\n加分句型：\n• "It is widely believed that..."\n• "There is a growing concern that..."\n• "A case in point is..."',
      vocab: [
        { en: 'crucial', zh: '關鍵', example: 'Education is crucial for development.' },
        { en: 'detrimental', zh: '有害', example: 'Pollution is detrimental to health.' },
        { en: 'paramount', zh: '最重要', example: 'Safety is paramount.' },
        { en: 'consensus', zh: '共識', example: 'There is a consensus that...' },
      ],
      quiz: [
        { q: '"good" 嘅高階替換？', qZh: '', opts: ['bad', 'beneficial', 'ugly', 'small'], ans: 1 },
        { q: '"I think" 嘅 formal 替換？', qZh: '', opts: ['I guess', 'From my perspective', 'Maybe', 'Dunno'], ans: 1 },
      ],
    },
    {
      id: 'ielts-5', title: '完整模擬試', titleZh: '模擬試', type: 'speaking', minutes: 15,
      content: '完整 IELTS Speaking 模擬流程。\n\nPart 1 (4-5 min)：自我介紹 + 熟悉話題\nPart 2 (3-4 min)：Cue card + 1 min prep + 2 min speak\nPart 3 (4-5 min)：雙向討論\n\n今日練習題目：Describe a skill you want to learn.\n• What skill?\n• Why you want to learn it?\n• How you plan to learn it?\n• How it will benefit you?',
      vocab: [
        { en: 'aspiration', zh: '志向', example: 'My aspiration is to...' },
        { en: 'acquire', zh: '獲得', example: 'I want to acquire this skill.' },
        { en: 'motivation', zh: '動機', example: 'My main motivation is...' },
      ],
      practice: { prompt: 'Complete a full IELTS Speaking mock: Part 1 (2 questions), Part 2 (cue card 2 min), Part 3 (1 discussion).', zh: '完整模擬 IELTS 口試。' },
      quiz: [
        { q: 'Part 2 有幾多分鐘準備？', qZh: '', opts: ['0', '30秒', '1分鐘', '5分鐘'], ans: 2 },
        { q: 'Part 2 要講幾耐？', qZh: '', opts: ['30秒', '1分鐘', '1-2分鐘', '5分鐘'], ans: 2 },
      ],
    },
  ],

  // ===== travel-english: 2→5 (+3) =====
  'travel-english': [
    {
      id: 'travel-3', title: '交通工具', titleZh: '交通', type: 'speaking', minutes: 6,
      content: '機場以外嘅交通 English。\n\n火車/地鐵：\n• "Which line goes to Central?"\n• "Is this the right platform for ___?"\n• "How many stops to ___?"\n\n巴士：\n• "Does this bus go to ___?"\n• "Could you tell me when we get to ___?"\n\n的士：\n• "To the airport, please."\n• "Could you take me to this address?"\n• "Keep the change."',
      vocab: [
        { en: 'platform', zh: '月台', example: 'The train leaves from platform 3.' },
        { en: 'fare', zh: '車費', example: 'How much is the fare?' },
        { en: 'transfer', zh: '轉車', example: 'Do I need to transfer?' },
        { en: 'rush hour', zh: '繁忙時間', example: 'Avoid rush hour if you can.' },
      ],
      quiz: [
        { q: '"Which line goes to ___?" 係問咩？', qZh: '', opts: ['邊條線去___', '幾錢', '幾點開', '邊度買飛'], ans: 0 },
        { q: '"Keep the change" 點解？', qZh: '', opts: ['找錢', '唔使找', '換散紙', '俾貼士'], ans: 1 },
      ],
    },
    {
      id: 'travel-4', title: '緊急情況', titleZh: '緊急', type: 'speaking', minutes: 7,
      content: '旅行中出事點算？呢啲句子要識。\n\n求救：\n• "Help! I need a doctor!"\n• "Call an ambulance!"\n• "Where is the nearest hospital?"\n\n遺失物品：\n• "I lost my passport."\n• "My wallet was stolen."\n• "I need to contact my embassy."\n\n藥房：\n• "I have a headache / fever / stomachache."\n• "Do you have something for ___?"\n• "I\'m allergic to penicillin."',
      vocab: [
        { en: 'emergency', zh: '緊急', example: 'It\'s an emergency!' },
        { en: 'embassy', zh: '大使館', example: 'Contact your embassy.' },
        { en: 'allergic', zh: '過敏', example: 'I\'m allergic to nuts.' },
        { en: 'prescription', zh: '處方', example: 'I need this prescription filled.' },
      ],
      quiz: [
        { q: '"I lost my passport" — 跟住應該去邊？', qZh: '', opts: ['餐廳', '大使館', '商場', '沙灘'], ans: 1 },
        { q: '"allergic" 點解？', qZh: '', opts: ['過敏', '感冒', '頭痛', '肚痛'], ans: 0 },
      ],
    },
    {
      id: 'travel-5', title: '同當地人傾計', titleZh: '文化交流', type: 'speaking', minutes: 7,
      content: '旅行最珍貴嘅係同當地人交流。\n\n打開話題：\n• "I\'m visiting from Hong Kong. Have you been there?"\n• "What\'s your favorite thing about living here?"\n• "Any hidden gems you\'d recommend?"\n\n分享自己：\n• "In my country, we usually..."\n• "This reminds me of home because..."\n\n結束對話：\n• "Thanks for the chat! Enjoy your day."\n• "It was really nice meeting you."',
      vocab: [
        { en: 'hidden gem', zh: '隱世景點', example: 'Know any hidden gems?' },
        { en: 'recommend', zh: '推薦', example: 'What do you recommend?' },
        { en: 'local', zh: '當地', example: 'Where do locals eat?' },
        { en: 'culture', zh: '文化', example: 'I love learning about local culture.' },
      ],
      quiz: [
        { q: '"hidden gem" 係咩？', qZh: '', opts: ['寶石', '隱世好地方', '地圖', '酒店'], ans: 1 },
        { q: '同當地人傾計第一句可以講咩？', qZh: '', opts: ['你幾歲', '你搵幾錢', '你住呢度最鍾意咩', '你結咗婚未'], ans: 2 },
      ],
    },
  ],

  // ===== pronunciation: 2→5 (+3) =====
  'pronunciation': [
    {
      id: 'pron-3', title: '母音長短', titleZh: '母音長短', type: 'listening', minutes: 7,
      content: '英文母音有長短之分，影響意思！\n\n短母音 vs 長母音：\n• ship /ɪ/ vs sheep /i:/\n• pull /ʊ/ vs pool /u:/\n• bed /e/ vs bad /æ/\n• cut /ʌ/ vs cart /ɑ:/\n\n練習句子：\n• "The sheep is on the ship."\n• "Don\'t pull me into the pool."\n• "My bed is bad."',
      vocab: [
        { en: 'vowel', zh: '母音', example: 'English has 12 vowel sounds.' },
        { en: 'short', zh: '短', example: 'Short vowel sounds are quick.' },
        { en: 'long', zh: '長', example: 'Long vowels are held longer.' },
      ],
      quiz: [
        { q: '"ship" 同 "sheep" 嘅分別係？', qZh: '', opts: ['意思一樣', '母音長短唔同', '子音唔同', '冇分別'], ans: 1 },
        { q: '"pull" 嘅母音係？', qZh: '', opts: ['長', '短', '冇母音', '雙母音'], ans: 1 },
      ],
    },
    {
      id: 'pron-4', title: '連音 Linking', titleZh: '連音', type: 'listening', minutes: 7,
      content: '英文唔係逐個字讀，係連住讀。\n\n連音規則：\n① 子音+母音：\n• "an apple" → "a-napple"\n• "get up" → "ge-tup"\n\n② 相同子音合併：\n• "big game" → "bi-game"\n• "good day" → "goo-day"\n\n③ Flap T（美式）：\n• "water" → "wader"\n• "better" → "bedder"\n\n練習："Put it on the table" → "Pu-di-don the table"',
      vocab: [
        { en: 'linking', zh: '連音', example: 'Linking makes you sound natural.' },
        { en: 'flap T', zh: '彈舌 T', example: 'Americans use the flap T.' },
        { en: 'blend', zh: '混合', example: 'Blend the words together.' },
      ],
      quiz: [
        { q: '"get up" 連讀點讀？', qZh: '', opts: ['get-up', 'ge-tup', 'get-up-p', '分開讀'], ans: 1 },
        { q: '"water" 美式發音係？', qZh: '', opts: ['wa-ter', 'wa-der', 'wa-tah', 'wo-ter'], ans: 1 },
      ],
    },
    {
      id: 'pron-5', title: '語調同節奏', titleZh: '語調節奏', type: 'listening', minutes: 8,
      content: '英文係 stress-timed language — 重音節奏決定自然度。\n\n內容字要重讀（Content Words）：\n• 名詞、動詞、形容詞、副詞\n\n功能字要輕讀（Function Words）：\n• a, the, in, on, is, are, can, will\n\n例句："I will MEET you at the STAtion at SIX."\n（大階 = 重音）\n\n語調：\n• 陳述句：下降 ↗↘ "I\'m going home."\n• Yes/No 問題：上升 ↗ "Are you coming?"\n• Wh- 問題：下降 ↘ "Where are you going?"',
      vocab: [
        { en: 'stress', zh: '重音', example: 'Put stress on the content words.' },
        { en: 'rhythm', zh: '節奏', example: 'English has a natural rhythm.' },
        { en: 'intonation', zh: '語調', example: 'Intonation conveys meaning.' },
        { en: 'rise', zh: '上升', example: 'Your voice should rise for questions.' },
      ],
      quiz: [
        { q: '英文嘅節奏係 based on 咩？', qZh: '', opts: ['每個音節', '重音', '速度', '大細聲'], ans: 1 },
        { q: 'Yes/No 問題嘅語調係？', qZh: '', opts: ['下降', '上升', '平', '冇所謂'], ans: 1 },
      ],
    },
  ],

  // ===== daily-deep: 3→5 (+2) =====
  'daily-deep': [
    {
      id: 'daily-deep-4', title: '講故仔技巧', titleZh: '講故', type: 'speaking', minutes: 8,
      content: '點樣用英文講一個引人入勝嘅故仔？\n\n結構：\n① Setting（時間地點氣氛）\n② Build-up（事件發展）\n③ Climax（最精彩部分）\n④ Resolution（結局+感受）\n\n時態 tips：\n• 故仔主體用過去式\n• 對話可以用現在式增加臨場感\n• "So he says to me, \'You won\'t believe this!\'"\n\n生動技巧：\n• 用擬聲詞："Boom! The door slammed shut."\n• 用誇張："I waited for like, a million years."',
      vocab: [
        { en: 'suddenly', zh: '突然', example: 'Suddenly, I heard a noise.' },
        { en: 'eventually', zh: '最後', example: 'Eventually, we found our way.' },
        { en: 'climax', zh: '高潮', example: 'The climax was unbelievable.' },
        { en: 'relieved', zh: '鬆一口氣', example: 'I was so relieved!' },
      ],
      practice: { prompt: 'Tell a story about the best or worst day of your life in 1-2 minutes.', zh: '用 1-2 分鐘講你人生最好或最差嘅一日。' },
      quiz: [
        { q: '講故仔主要用咩時態？', qZh: '', opts: ['現在式', '過去式', '未來式', '進行式'], ans: 1 },
        { q: '對話部分點樣令佢更生動？', qZh: '', opts: ['背書', '用現在式+語氣模仿', '全部刪除', '用書面語'], ans: 1 },
      ],
    },
    {
      id: 'daily-deep-5', title: '發表意見', titleZh: '發表意見', type: 'speaking', minutes: 7,
      content: '日常 conversation 入面點樣自然咁發表意見。\n\n同意：\n• "Totally!" / "100%!"（casual）\n• "I couldn\'t agree more."（有說服力）\n• "You took the words right out of my mouth!"\n\n部分同意：\n• "I see what you mean, but..."\n• "That\'s true, although..."\n\n唔同意（保持友好）：\n• "I\'m not sure I agree."\n• "I see it differently, actually."\n• "That\'s one way to look at it."\n\n改變話題：\n• "Speaking of which..."\n• "That reminds me..."\n• "On a completely different note..."',
      vocab: [
        { en: 'totally', zh: '完全', example: 'I totally agree!' },
        { en: 'actually', zh: '其實', example: 'Actually, I think differently.' },
        { en: 'speaking of', zh: '講起', example: 'Speaking of food, are you hungry?' },
      ],
      practice: { prompt: 'Discuss: "Is it better to work from home or in an office?" Give your opinion with agree/disagree phrases.', zh: '討論：在家工作定返公司好？用同意/反對句型。' },
      quiz: [
        { q: '最強烈嘅同意？', qZh: '', opts: ['OK', 'I couldn\'t agree more', 'Maybe', 'Whatever'], ans: 1 },
        { q: '點樣禮貌咁改話題？', qZh: '', opts: ['閉嘴', 'Speaking of which...', '你錯', '唔好講'], ans: 1 },
      ],
    },
  ],

  // ===== idiom-mastery: 2→5 (+3) =====
  'idiom-mastery': [
    {
      id: 'idiom-3', title: '食物俚語', titleZh: '食物俚語', type: 'vocab', minutes: 6,
      content: '英文好多俚語同食物有關！\n\n• "Piece of cake" — 好容易\n  "The exam was a piece of cake!"\n\n• "Spill the beans" — 爆料\n  "Come on, spill the beans! What happened?"\n\n• "Butter someone up" — 擦鞋/討好\n  "He\'s just buttering up the boss."\n\n• "Couch potato" — 電視精/成日坐梳化嘅人\n• "Apple of my eye" — 心肝寶貝\n• "Bring home the bacon" — 賺錢養家',
      vocab: [
        { en: 'piece of cake', zh: '好容易', example: 'That test was a piece of cake.' },
        { en: 'spill the beans', zh: '爆料', example: 'Who spilled the beans?' },
        { en: 'butter up', zh: '討好', example: 'Stop buttering me up.' },
        { en: 'couch potato', zh: '電視精', example: 'I\'ve been a couch potato all weekend.' },
      ],
      quiz: [
        { q: '"Piece of cake" 點解？', qZh: '', opts: ['一件蛋糕', '好容易', '好困難', '好味道'], ans: 1 },
        { q: '"Spill the beans" 點解？', qZh: '', opts: ['倒瀉豆', '爆料/講秘密', '煮飯', '食飯'], ans: 1 },
        { q: '"Butter someone up" 點解？', qZh: '', opts: ['煮餸', '討好/擦鞋', '鬧人', '請食飯'], ans: 1 },
      ],
    },
    {
      id: 'idiom-4', title: '運動俚語', titleZh: '運動俚語', type: 'vocab', minutes: 6,
      content: '運動俚語喺商務英文好常見！\n\n• "Ball is in your court" — 輪到你做決定\n• "Call the shots" — 話事/做決定\n• "Drop the ball" — 犯錯/搞砸\n• "Game changer" — 改變遊戲規則嘅嘢\n• "Hit it out of the park" — 做得好出色\n• "Level playing field" — 公平競爭環境\n• "Take one for the team" — 為團隊犧牲',
      vocab: [
        { en: 'ball is in your court', zh: '到你出手', example: 'I\'ve done my part — ball is in your court.' },
        { en: 'game changer', zh: '革命性改變', example: 'AI is a game changer.' },
        { en: 'drop the ball', zh: '搞砸', example: 'I really dropped the ball on that project.' },
        { en: 'call the shots', zh: '話事', example: 'Who calls the shots here?' },
      ],
      quiz: [
        { q: '"Ball is in your court" 喺商務上點解？', qZh: '', opts: ['打波', '輪到你做決定', '我贏咗', '比賽開始'], ans: 1 },
        { q: '"Drop the ball" 點解？', qZh: '', opts: ['跌咗個波', '犯錯/搞砸', '入球', '放棄'], ans: 1 },
        { q: '"Game changer" 點解？', qZh: '', opts: ['選手交換', '改變遊戲規則嘅嘢', '遊戲結束', '新遊戲'], ans: 1 },
      ],
    },
    {
      id: 'idiom-5', title: '顏色俚語', titleZh: '顏色俚語', type: 'vocab', minutes: 6,
      content: '顏色喺英文俚語入面有特殊意思！\n\n• "Green light" — 批准/開綠燈\n• "Red flag" — 警號/危險信號\n• "White lie" — 善意謊言\n• "Out of the blue" — 突然/無預警\n• "Once in a blue moon" — 好罕見\n• "Golden opportunity" — 黃金機會\n• "Black and white" — 清楚明確\n• "Grey area" — 灰色地帶',
      vocab: [
        { en: 'green light', zh: '批准', example: 'We got the green light to start.' },
        { en: 'red flag', zh: '警號', example: 'That\'s a major red flag.' },
        { en: 'white lie', zh: '善意謊言', example: 'I told a white lie to spare her feelings.' },
        { en: 'out of the blue', zh: '突然', example: 'He called me out of the blue.' },
      ],
      quiz: [
        { q: '"Green light" 喺商務上點解？', qZh: '', opts: ['交通燈', '批准/開綠燈', '環保', '開始'], ans: 1 },
        { q: '"Red flag" 點解？', qZh: '', opts: ['紅旗', '警號/危險信號', '國旗', '獎勵'], ans: 1 },
        { q: '"Once in a blue moon" 點解？', qZh: '', opts: ['成日發生', '好罕見', '藍色月亮', '每個月'], ans: 1 },
      ],
    },
  ],

  // ===== writing-skills: 2→5 (+3) =====
  'writing-skills': [
    {
      id: 'writing-3', title: 'Formal vs Informal', titleZh: '正式vs非正式', type: 'reading', minutes: 8,
      content: '同一意思，formal 同 informal 可以好唔同。\n\n請求：\n• Informal: "Can you send me the file?"\n• Formal: "I would appreciate it if you could forward the document at your earliest convenience."\n\n道歉：\n• Informal: "Sorry!"\n• Formal: "I sincerely apologize for any inconvenience this may have caused."\n\n拒絕：\n• Informal: "I can\'t make it."\n• Formal: "Unfortunately, I will be unable to attend due to a prior commitment."\n\nRule of thumb: 睇對象決定。對老細/客戶要 formal，對同事可以 informal。',
      vocab: [
        { en: 'formal', zh: '正式', example: 'Use formal language for business.' },
        { en: 'informal', zh: '非正式', example: 'Informal is fine with friends.' },
        { en: 'appropriate', zh: '合適', example: 'Choose the appropriate tone.' },
        { en: 'convenience', zh: '方便', example: 'At your earliest convenience.' },
      ],
      quiz: [
        { q: '"At your earliest convenience" 係 formal 定 informal？', qZh: '', opts: ['Formal', 'Informal', '兩個都唔係', 'Slang'], ans: 0 },
        { q: '對客戶應該用咩語氣？', qZh: '', opts: ['Casual slang', 'Formal 有禮', '亂咁寫', 'Emoji 一堆'], ans: 1 },
      ],
    },
    {
      id: 'writing-4', title: 'Essay 結構', titleZh: 'Essay結構', type: 'reading', minutes: 10,
      content: '學術 Essay 萬能五段式：\n\n① Introduction（導入）\n• Hook + Background + Thesis statement\n\n② Body 1（第一個論點）\n• Topic sentence + Evidence + Explanation + Link\n\n③ Body 2（第二個論點）\n• 同上結構\n\n④ Body 3（第三個論點 / 反駁）\n• Counter-argument + Rebuttal\n\n⑤ Conclusion（結論）\n• Restate thesis + Summarize + Final thought\n\n⚠️ 唔好：新論點放結論 / 只用個人經歷冇 evidence',
      vocab: [
        { en: 'thesis', zh: '論點', example: 'Your thesis should be clear.' },
        { en: 'evidence', zh: '證據', example: 'Support your claims with evidence.' },
        { en: 'counterargument', zh: '反駁', example: 'Address the counterargument.' },
        { en: 'conclude', zh: '總結', example: 'Conclude with a strong statement.' },
      ],
      quiz: [
        { q: 'Essay 第一段叫咩？', qZh: '', opts: ['Conclusion', 'Body', 'Introduction', 'Title'], ans: 2 },
        { q: 'Thesis statement 放喺邊？', qZh: '', opts: ['最後一段', '第一段尾', '中間', '任何地方'], ans: 1 },
      ],
    },
    {
      id: 'writing-5', title: 'CV / Resume 寫作', titleZh: 'CV寫作', type: 'reading', minutes: 8,
      content: 'CV 寫作黃金法則：用 action verbs + 量化成果！\n\n弱：\n• "I was responsible for social media."\n• "I helped with customer service."\n\n強：\n• "Managed social media accounts, growing followers by 40% in 6 months."\n• "Resolved 50+ customer inquiries daily with a 98% satisfaction rate."\n\nAction Verbs：\n• Led, Managed, Developed, Implemented, Optimized\n• Designed, Launched, Increased, Reduced, Streamlined\n• Coordinated, Spearheaded, Mentored, Achieved',
      vocab: [
        { en: 'achieved', zh: '達成', example: 'Achieved 120% of sales target.' },
        { en: 'spearheaded', zh: '帶領', example: 'Spearheaded the rebranding project.' },
        { en: 'optimized', zh: '優化', example: 'Optimized workflow, saving 10 hours/week.' },
        { en: 'mentored', zh: '指導', example: 'Mentored 3 junior designers.' },
      ],
      practice: { prompt: 'Rewrite this CV bullet: "I helped with marketing and made more people visit the website."', zh: '改寫："I helped with marketing and made more people visit the website."' },
      quiz: [
        { q: 'CV 應該多用咩？', qZh: '', opts: ['被動語態', 'Action verbs + 量化成果', '"I helped"', '長篇大論'], ans: 1 },
        { q: '"Spearheaded" 點解？', qZh: '', opts: ['用矛', '帶領/主導', '跟隨', '放棄'], ans: 1 },
      ],
    },
  ],

  // ===== interview-pro: 2→5 (+3) =====
  'interview-pro': [
    {
      id: 'interview-pro-3', title: '常見面試問題', titleZh: '常見問題', type: 'speaking', minutes: 10,
      content: '面試 10 大必問問題 + 答題框架。\n\n① "Tell me about yourself." → Past-Present-Future formula\n② "What are your strengths?" → Skill + Example + Result\n③ "What are your weaknesses?" → Weakness + What you\'re doing about it\n④ "Why do you want to work here?" → Research + Alignment\n⑤ "Where do you see yourself in 5 years?" → Realistic + Ambitious\n⑥ "Why did you leave your last job?" → Positive framing\n⑦ "Tell me about a challenge you faced." → STAR\n⑧ "How do you handle pressure?" → Specific strategy\n⑨ "What\'s your expected salary?" → Research-based range\n⑩ "Do you have any questions for us?" → Always YES!',
      vocab: [
        { en: 'strength', zh: '優點', example: 'My greatest strength is...' },
        { en: 'weakness', zh: '弱點', example: 'One area I\'m working on is...' },
        { en: 'align', zh: '符合', example: 'My values align with the company.' },
        { en: 'ambitious', zh: '有抱負', example: 'I\'m ambitious but realistic.' },
      ],
      quiz: [
        { q: '"Tell me about yourself" 應該點答？', qZh: '', opts: ['淨講名', 'Past-Present-Future', '講人生故仔', '一句起兩句止'], ans: 1 },
        { q: '"Do you have any questions?" 應該答？', qZh: '', opts: ['No', 'Yes, 準備 2-3 個問題', 'Maybe', 'I don\'t know'], ans: 1 },
      ],
    },
    {
      id: 'interview-pro-4', title: 'Video Interview 技巧', titleZh: 'Video面試', type: 'speaking', minutes: 7,
      content: '而家好多公司用 video interview（Zoom/Teams）。\n\n技術：\n• 測試 camera + mic  beforehand\n• 背景簡潔（或 virtual background）\n• 光源喺你面前，唔係背後\n\n表現：\n• 望鏡頭（唔係螢幕）→ 效果似眼神接觸\n• 點頭 + 微笑（鏡頭會放大你嘅表情）\n• 慢 10% 講嘢（網絡 delay 會 cut 字）\n\n⚠️ 常見錯誤：\n• 睇住自己個樣（distracting）→ hide self-view\n• 準備咗 notes 但照讀（好明顯）→ 用 bullet points',
      vocab: [
        { en: 'virtual', zh: '虛擬', example: 'It\'s a virtual interview.' },
        { en: 'background', zh: '背景', example: 'Use a clean background.' },
        { en: 'lighting', zh: '燈光', example: 'Good lighting makes a difference.' },
        { en: 'stable', zh: '穩定', example: 'Make sure your internet is stable.' },
      ],
      quiz: [
        { q: 'Video interview 應該望邊度？', qZh: '', opts: ['自己個樣', '鏡頭', '地下', '旁邊'], ans: 1 },
        { q: '背景應該？', qZh: '', opts: ['好亂', '簡潔乾淨', '有其他人', '全黑'], ans: 1 },
      ],
    },
    {
      id: 'interview-pro-5', title: 'Follow-up 同感謝信', titleZh: '感謝信', type: 'reading', minutes: 6,
      content: '面試後 24 小時內 send thank-you email！好多人唔做，你做就即刻突出。\n\nTemplate：\n\nSubject: Thank you — [Position] interview\n\nDear [Name],\n\nThank you for taking the time to meet with me today. I really enjoyed learning about [specific thing you discussed].\n\nOur conversation reinforced my interest in the role. I\'m particularly excited about [specific project/challenge they mentioned].\n\nPlease don\'t hesitate to reach out if you need any additional information.\n\nBest regards,\n[Your name]',
      vocab: [
        { en: 'reinforce', zh: '加強', example: 'This reinforced my interest.' },
        { en: 'particularly', zh: '特別', example: 'I\'m particularly interested in...' },
        { en: 'hesitate', zh: '猶豫', example: 'Don\'t hesitate to contact me.' },
      ],
      quiz: [
        { q: 'Thank-you email 應該幾時 send？', qZh: '', opts: ['一個月後', '24 小時內', '唔使 send', '一個星期後'], ans: 1 },
        { q: 'Thank-you email 最緊要提及咩？', qZh: '', opts: ['你嘅要求', '面試中傾過嘅具體內容', '你幾多歲', '你住邊'], ans: 1 },
      ],
    },
  ],

  // ===== tourism-phrases: 2→5 (+3) =====
  'tourism-phrases': [
    {
      id: 'tour-3', title: '住宿問題', titleZh: '住宿', type: 'speaking', minutes: 6,
      content: '酒店/Airbnb 常見情況。\n\nCheck-in：\n• "I have a reservation under ___."\n• "What time is check-out?"\n• "Is breakfast included?"\n\n房間問題：\n• "The air conditioning isn\'t working."\n• "Could I have extra towels, please?"\n• "The Wi-Fi password, please?"\n\n要求：\n• "Could I have a late check-out?"\n• "Can you recommend a good restaurant nearby?"\n• "Could you call a taxi for me?"',
      vocab: [
        { en: 'check-out', zh: '退房', example: 'Check-out is at 11am.' },
        { en: 'amenities', zh: '設施', example: 'What amenities do you have?' },
        { en: 'complimentary', zh: '免費提供', example: 'Is breakfast complimentary?' },
        { en: 'maintenance', zh: '維修', example: 'We need maintenance in room 302.' },
      ],
      quiz: [
        { q: '"complimentary breakfast" 點解？', qZh: '', opts: ['好食早餐', '免費早餐', '貴早餐', '冇早餐'], ans: 1 },
        { q: '冷氣壞咗點講？', qZh: '', opts: ['AC broken', 'The air conditioning isn\'t working', 'Cold broken', 'No air'], ans: 1 },
      ],
    },
    {
      id: 'tour-4', title: '當地體驗', titleZh: '當地體驗', type: 'speaking', minutes: 7,
      content: '跟團定自由行都要識呢啲。\n\n報團/買飛：\n• "What time does the tour start?"\n• "Is there an English audio guide?"\n• "Are there any discounts for students?"\n\n博物館/景點：\n• "Is photography allowed?"\n• "What time do you close?"\n• "Where are the restrooms?"\n\n當地團：\n• "How long is the tour?"\n• "What\'s included in the price?"\n• "Do we need to book in advance?"',
      vocab: [
        { en: 'audio guide', zh: '語音導覽', example: 'Do you have an English audio guide?' },
        { en: 'admission', zh: '入場費', example: 'How much is admission?' },
        { en: 'discount', zh: '折扣', example: 'Any student discounts?' },
        { en: 'souvenir', zh: '手信', example: 'Where can I buy souvenirs?' },
      ],
      quiz: [
        { q: '"audio guide" 係咩？', qZh: '', opts: ['真人導遊', '語音導覽機', '地圖', '書'], ans: 1 },
        { q: '"admission fee" 點解？', qZh: '', opts: ['入場費', '酒店費', '車費', '貼士'], ans: 0 },
      ],
    },
    {
      id: 'tour-5', title: '飲食特殊要求', titleZh: '飲食要求', type: 'speaking', minutes: 6,
      content: '旅行中嘅 dietary restrictions 點表達？\n\n過敏：\n• "I\'m allergic to peanuts / shellfish / dairy."\n• "Does this contain any nuts?"\n\n飲食選擇：\n• "I\'m vegetarian / vegan."\n• "I don\'t eat pork / beef."\n• "Can you make this without meat?"\n\n要求：\n• "Less salt, please."\n• "No MSG, please."\n• "Can I have the sauce on the side?"\n\n緊急：\n• "I need a doctor. I think I ate something I\'m allergic to."',
      vocab: [
        { en: 'allergic', zh: '過敏', example: 'I\'m allergic to shrimp.' },
        { en: 'vegetarian', zh: '素食', example: 'I\'m vegetarian — no meat or fish.' },
        { en: 'shellfish', zh: '貝殼類', example: 'Allergic to shellfish.' },
        { en: 'dairy', zh: '奶類', example: 'I can\'t have dairy.' },
      ],
      quiz: [
        { q: '"I\'m allergic to peanuts" 點解？', qZh: '', opts: ['我鍾意花生', '我對花生過敏', '我唔食花生', '花生好食'], ans: 1 },
        { q: '"Can I have the sauce on the side?" 點解？', qZh: '', opts: ['走汁', '汁分開上', '多汁', '唔要'], ans: 1 },
      ],
    },
  ],
};
