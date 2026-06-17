// services/courses-extra.ts — Additional courses to bulk up content
import { Course } from './courses';

export const EXTRA_COURSES: Course[] = [
  // =====================================================================
  // 文法精讀 — Grammar Deep Dive
  // =====================================================================
  {
    id: 'grammar-deep', icon: '', title: '文法精讀', titleEn: 'Grammar Deep Dive',
    desc: '時態、語態、條件句、關係子句 — 徹底搞掂英文文法', level: 'intermediate', category: 'basics',
    lessons: [
      { id: 'gram-1', title: '12 種時態一次過', titleZh: '時態總覽', type: 'reading', minutes: 12,
        content: '英文有 12 種時態，但常用嘅得 6-7 種。\n\n🔥 最常用：\n• Simple Present: I work\n• Present Continuous: I am working\n• Simple Past: I worked\n• Present Perfect: I have worked\n• Future (will/going to): I will work\n\n📌 香港人常錯：\n• "I am work" ❌ → "I work" / "I am working"\n• "I have went" ❌ → "I have gone"\n• "Yesterday I go" ❌ → "Yesterday I went"',
        vocab: [
          { en: 'tense', zh: '時態', example: 'Which tense should I use?' },
          { en: 'continuous', zh: '進行式', example: 'Use continuous for ongoing actions.' },
          { en: 'perfect', zh: '完成式', example: 'Present perfect connects past to present.' },
        ],
        quiz: [
          { q: '"I am working" 係咩時態？', qZh: '', opts: ['Simple Present', 'Present Continuous', 'Past Simple', 'Future'], ans: 1 },
          { q: '"I have gone" 定 "I have went"？', qZh: '', opts: ['have went', 'have gone', '兩個都得', 'has go'], ans: 1 },
          { q: 'Present Perfect 嘅用法係？', qZh: '', opts: ['過去一點', '過去連接到現在', '未來', '習慣'], ans: 1 },
        ],
      },
      { id: 'gram-2', title: '被動語態', titleZh: '被動式', type: 'reading', minutes: 8,
        content: '被動語態 = be + 過去分詞 (past participle)\n\n結構：\n• Active: The cat ate the fish.\n• Passive: The fish was eaten by the cat.\n\n幾時用被動？\n① 唔知邊個做：My wallet was stolen!\n② 唔重要邊個做：The building was built in 1990.\n③ 想強調受事者：English is spoken worldwide.',
        vocab: [
          { en: 'passive', zh: '被動', example: 'Use passive when the doer is unknown.' },
          { en: 'active', zh: '主動', example: 'Active voice is more direct.' },
          { en: 'by', zh: '被（某人）', example: 'It was written by Shakespeare.' },
        ],
        quiz: [
          { q: '"The book was written by her" — 邊個係主語？', qZh: '', opts: ['The book', 'was written', 'by', 'her'], ans: 0 },
          { q: '被動語態嘅基本結構係？', qZh: '', opts: ['be + -ing', 'be + past participle', 'have + past participle', 'will + verb'], ans: 1 },
        ],
      },
      { id: 'gram-3', title: '條件句 If', titleZh: '條件句', type: 'reading', minutes: 10,
        content: '三種條件句，三種意思：\n\n① Zero Conditional（事實）：\nIf you heat ice, it melts.\n→ 100% 一定發生\n\n② First Conditional（可能）：\nIf it rains tomorrow, I will stay home.\n→ 有可能發生\n\n③ Second Conditional（假設/唔可能）：\nIf I were rich, I would travel the world.\n→ 同現實相反 / 好唔可能\n\n⚠️ "If I was" ❌ 正式 → "If I were"',
        vocab: [
          { en: 'condition', zh: '條件', example: 'What\'s the condition?' },
          { en: 'unless', zh: '除非', example: 'Unless it rains, I\'ll go.' },
          { en: 'hypothetical', zh: '假設', example: 'This is a hypothetical situation.' },
        ],
        quiz: [
          { q: '"If I ___ rich, I would travel" — 空格係？', qZh: '', opts: ['am', 'was', 'were', 'will be'], ans: 2, explain: 'Second conditional 用 were（唔係 was）。' },
          { q: 'Zero conditional 用嚟表達咩？', qZh: '', opts: ['假設', '100%事實', '未來可能', '過去'], ans: 1 },
        ],
      },
      { id: 'gram-4', title: '關係子句', titleZh: '關係子句', type: 'reading', minutes: 8,
        content: 'Who / Which / That / Whose / Where / When\n\n• who = 人：The woman who lives next door\n• which = 事物：The book which I bought\n• that = 人/事物（口語最常用）\n• whose = 擁有的：The girl whose cat is missing\n• where = 地方：The cafe where we met\n\n📌 幾時可以省略？\n• The book (that) I bought ← 受格，可以省\n• The woman who called ← 主格，唔可以省',
        vocab: [
          { en: 'relative clause', zh: '關係子句', example: 'Add a relative clause for more detail.' },
          { en: 'omit', zh: '省略', example: 'You can omit "that" in some cases.' },
        ],
        quiz: [
          { q: '"The man ___ called" — 空格係？', qZh: '', opts: ['which', 'who', 'where', 'whose'], ans: 1 },
          { q: '"The cafe ___ we met" — 空格係？', qZh: '', opts: ['who', 'which', 'where', 'whose'], ans: 2 },
        ],
      },
      { id: 'gram-5', title: '常見文法錯誤 TOP 10', titleZh: '常見錯誤', type: 'reading', minutes: 8,
        content: '香港人/亞洲人最常犯嘅英文文法錯誤：\n\n① 漏咗 -s/-es（第三人稱單數）\n"He go" ❌ → "He goes"\n\n② Countable/Uncountable 唔分\n"many money" ❌ → "much money"\n\n③ Preposition 用錯\n"depend on" ✓ "depend of" ❌\n\n④ "Although... but..."（雙重連接詞）\n"Although it rains, but I go" ❌ → 只用一個\n\n⑤ Article 漏咗\n"I am student" ❌ → "I am a student"',
        vocab: [
          { en: 'countable', zh: '可數', example: 'Apples are countable.' },
          { en: 'uncountable', zh: '不可數', example: 'Water is uncountable.' },
          { en: 'article', zh: '冠詞', example: 'Don\'t forget the article a/an/the.' },
          { en: 'preposition', zh: '介詞', example: 'Prepositions are tricky!' },
        ],
        quiz: [
          { q: '"He ___ to school" — 空格？', qZh: '', opts: ['go', 'gos', 'goes', 'going'], ans: 2 },
          { q: '"many money" 啱唔啱？', qZh: '', opts: ['啱', '錯，應該 much money', '兩個都得', '睇情況'], ans: 1 },
          { q: 'Although 同 but 可唔可以一齊用？', qZh: '', opts: ['可以', '唔可以，只用一個', '有時可以', '一定要一齊用'], ans: 1 },
        ],
      },
    ],
  },

  // =====================================================================
  // 高階會話 — Advanced Conversation
  // =====================================================================
  {
    id: 'adv-convo', icon: '', title: '高階會話', titleEn: 'Advanced Conversation',
    desc: '辯論、說服、閒聊、講笑話 — 唔止「溝通到」，係「傾得好」', level: 'advanced', category: 'basics',
    lessons: [
      { id: 'adv-1', title: '辯論技巧', titleZh: '辯論', type: 'speaking', minutes: 10,
        content: '英文辯論嘅基本結構：\n\n① 陳述立場："I believe that..."\n② 理由 1："First of all..."\n③ 理由 2："Moreover..."\n④ 反駁預期反對："Some may argue that... However..."\n⑤ 總結："Therefore, I strongly believe..."\n\n實用句型：\n• "That\'s a valid point, but..."\n• "I see where you\'re coming from, however..."\n• "The evidence suggests that..."',
        vocab: [
          { en: 'argue', zh: '論證', example: 'I would argue that...' },
          { en: 'evidence', zh: '證據', example: 'The evidence shows...' },
          { en: 'counterargument', zh: '反駁', example: 'A common counterargument is...' },
          { en: 'therefore', zh: '因此', example: 'Therefore, I conclude...' },
        ],
        practice: { prompt: 'Debate: "Social media does more harm than good." Take a side and argue for 1 minute.', zh: '辯論：社交媒體弊大於利。揀一邊，1 分鐘論證。' },
        quiz: [
          { q: '辯論反駁時用咩開頭？', qZh: '', opts: ['You\'re wrong!', 'That\'s a valid point, but...', 'No!', 'Whatever'], ans: 1 },
        ],
      },
      { id: 'adv-2', title: '說服技巧', titleZh: '說服', type: 'speaking', minutes: 8,
        content: '說服人嘅三個關鍵：Ethos, Pathos, Logos\n\nEthos（信譽）："As someone who has worked in this field for 10 years..."\nPathos（情感）："Imagine how this would feel..."\nLogos（邏輯）："The data clearly shows..."\n\n實戰技巧：\n• 用 "we" 唔係 "you" → 建立共同感\n• 先認同，後提出建議\n• 俾對方一個「台階」',
        vocab: [
          { en: 'persuade', zh: '說服', example: 'How can I persuade them?' },
          { en: 'compromise', zh: '妥協', example: 'Let\'s find a compromise.' },
          { en: 'benefit', zh: '好處', example: 'The main benefit is...' },
        ],
        practice: { prompt: 'Persuade someone to try your favorite hobby. Use at least one personal story.', zh: '說服人試你嘅興趣。用最少一個親身故仔。' },
        quiz: [
          { q: 'Ethos 係講咩？', qZh: '', opts: ['邏輯數據', '感情', '信譽/可信度', '笑話'], ans: 2 },
        ],
      },
      { id: 'adv-3', title: 'Small Talk 進階', titleZh: '閒聊進階', type: 'speaking', minutes: 7,
        content: '外國職場嘅 Small Talk 好緊要 — 佢決定咗人哋對你嘅第一印象。\n\n安全話題：\n• 週末做咗咩\n• 最近嘅旅行\n• 劇集/電影推薦\n• 天氣（英國人最愛）\n\n避開話題：\n• 政治、宗教\n• 人工、年齡\n• 太私人嘅嘢\n\n技巧：\n• 開放式問題（唔好淨係 Yes/No）\n• 真心聆聽，唔係等緊自己講\n• 適當嘅 follow-up 問題',
        vocab: [
          { en: 'small talk', zh: '閒聊', example: 'I\'m terrible at small talk.' },
          { en: 'icebreaker', zh: '破冰', example: 'What\'s a good icebreaker?' },
          { en: 'genuinely', zh: '真心', example: 'I\'m genuinely curious.' },
        ],
        practice: { prompt: 'You meet a colleague at a conference coffee break. Start and maintain a 1-minute small talk conversation.', zh: '會議茶歇遇到同事。維持 1 分鐘 small talk。' },
        quiz: [
          { q: 'Small talk 最安全嘅話題係？', qZh: '', opts: ['政治', '人工', '週末做咗咩', '宗教'], ans: 2 },
        ],
      },
      { id: 'adv-4', title: '講笑話同幽默', titleZh: '幽默', type: 'speaking', minutes: 7,
        content: '英文幽默同廣東話好唔同。\n\n自嘲（最安全）：\n• "I tried cooking... let\'s just say the fire alarm went off."\n\n誇張法：\n• "I\'ve had so much coffee today I can hear colors."\n\n輕微諷刺：\n• "Oh great, another meeting. My favorite."\n\n唔好做：\n• 種族/性別笑話\n• 太複雜嘅 pun（雙關語）\n• 嘲笑其他人',
        vocab: [
          { en: 'self-deprecating', zh: '自嘲', example: 'Self-deprecating humor is safe.' },
          { en: 'sarcasm', zh: '諷刺', example: 'British people love sarcasm.' },
          { en: 'punchline', zh: '笑點', example: 'You ruined the punchline!' },
        ],
        practice: { prompt: 'Tell a funny (or mildly embarrassing) story about yourself in English.', zh: '用英文講一個關於自己嘅好笑/尷尬故仔。' },
        quiz: [
          { q: '最安全嘅幽默方式係？', qZh: '', opts: ['自嘲', '嘲笑人哋', '種族笑話', '好複雜嘅 pun'], ans: 0 },
        ],
      },
      { id: 'adv-5', title: 'Difficult Conversations', titleZh: '難搞對話', type: 'speaking', minutes: 10,
        content: '真實世界唔止 small talk。呢啲場景你要識：\n\n① 俾負面 feedback：\n• "I want to share some feedback. Is now a good time?"\n• "I noticed that... Can we talk about it?"\n• "I\'m bringing this up because I care about your growth."\n\n② 拒絕人：\n• "I really appreciate the offer, but I can\'t commit right now."\n• "That sounds great, but it\'s not the right fit for me."\n\n③ 道歉：\n• "I want to apologize for... It was my mistake."\n• "What can I do to make this right?"',
        vocab: [
          { en: 'feedback', zh: '回饋', example: 'Can I give you some feedback?' },
          { en: 'apologize', zh: '道歉', example: 'I sincerely apologize.' },
          { en: 'decline', zh: '婉拒', example: 'I have to decline this time.' },
          { en: 'confrontation', zh: '對質', example: 'I want to avoid confrontation.' },
        ],
        practice: { prompt: 'Role-play: Give constructive feedback to a colleague who keeps missing deadlines.', zh: '情境：同事成日遲 deadline，俾 constructive feedback。' },
        quiz: [
          { q: '俾負面 feedback 時第一句應該？', qZh: '', opts: ['You suck!', 'Is now a good time to share some feedback?', 'You\'re fired', 'Whatever'], ans: 1 },
          { q: '拒絕人最禮貌嘅方式？', qZh: '', opts: ['No', 'I appreciate the offer, but I can\'t commit right now', 'Maybe', 'Silence'], ans: 1 },
        ],
      },
    ],
  },

  // =====================================================================
  // 睇片學英文 — Learn with Videos
  // =====================================================================
  {
    id: 'video-english', icon: '', title: '睇片學英文', titleEn: 'Learn with Videos',
    desc: 'Netflix、YouTube、TED — 用真實影片學地道英文', level: 'intermediate', category: 'basics',
    lessons: [
      { id: 'vid-1', title: '點樣用 Netflix 學英文', titleZh: 'Netflix學英文', type: 'listening', minutes: 7,
        content: '煲劇學英文嘅正確方法：\n\n① 第一次：英文字幕 ON，睇故仔\n② 第二次：英文字幕 ON，留意新單字同句型\n③ 第三次：字幕 OFF，淨聽\n④ Shadowing：跟住角色讀，模仿語氣同速度\n\n推薦劇集：\n• Friends（生活英語經典）\n• The Office（職場英語+幽默）\n• Queer Eye（正面+多元主題）',
        vocab: [
          { en: 'subtitle', zh: '字幕', example: 'Turn on English subtitles.' },
          { en: 'shadowing', zh: '跟讀', example: 'Shadowing helps with pronunciation.' },
          { en: 'dialogue', zh: '對話', example: 'The dialogue is very natural.' },
        ],
        quiz: [
          { q: 'Shadowing 係咩？', qZh: '', opts: ['睇字幕', '跟住角色讀', '跳過對話', '淨聽'], ans: 1 },
          { q: '第一次睇應該？', qZh: '', opts: ['冇字幕', '英文字幕 ON', '中文字幕', '靜音'], ans: 1 },
        ],
      },
      { id: 'vid-2', title: 'TED Talk 逐句拆解', titleZh: 'TED拆解', type: 'listening', minutes: 10,
        content: 'TED Talk 係學英文嘅黃金資源。點樣最大化？\n\n① 揀 5-10 分鐘嘅 talk\n② 開 transcript（TED 官網有）\n③ 逐段聽 + 睇 transcript\n④ Mark 低唔識嘅 vocab\n⑤ 模仿 speaker 嘅 intonation\n\n推薦初學者 TED Talks：\n• "The Power of Vulnerability" — Brené Brown\n• "Do Schools Kill Creativity?" — Ken Robinson\n• "Inside the Mind of a Master Procrastinator" — Tim Urban',
        vocab: [
          { en: 'transcript', zh: '文字稿', example: 'Read the transcript while listening.' },
          { en: 'intonation', zh: '語調', example: 'Pay attention to intonation.' },
          { en: 'vulnerability', zh: '脆弱', example: 'Vulnerability is strength.' },
        ],
        quiz: [
          { q: 'TED 學英文第一步？', qZh: '', opts: ['亂聽', '揀短 talk + 開 transcript', '背晒佢', '快轉'], ans: 1 },
        ],
      },
      { id: 'vid-3', title: '歌詞學英文', titleZh: '歌詞學英文', type: 'listening', minutes: 6,
        content: '聽歌學英文 — 但要揀啱歌！\n\n好嘅學英文歌曲條件：\n① 歌詞清楚、唔太快\n② 用日常詞彙\n③ 有故仔性\n\n推薦：\n• The Beatles（簡單直接）\n• Ed Sheeran（故仔性強）\n• Taylor Swift（詞彙豐富）\n• Coldplay（容易理解）\n\n方法：\n① 睇 lyrics video\n② 查唔識嘅字\n③ 跟住唱（練習發音+流暢度）',
        vocab: [
          { en: 'lyrics', zh: '歌詞', example: 'Look up the lyrics online.' },
          { en: 'chorus', zh: '副歌', example: 'The chorus is easy to remember.' },
          { en: 'verse', zh: '主歌', example: 'The first verse tells a story.' },
        ],
        quiz: [
          { q: '揀學英文嘅歌最重要係？', qZh: '', opts: ['好快', '歌詞清楚+日常詞彙', '純音樂', '愈難愈好'], ans: 1 },
        ],
      },
      { id: 'vid-4', title: 'YouTube 學英文頻道推薦', titleZh: 'YouTube學英文', type: 'listening', minutes: 6,
        content: '唔使錢嘅頂級英文學習 YouTube 頻道：\n\n• English with Lucy（英國英文，發音+文法）\n• Rachel\'s English（美式發音專家）\n• Learn English with TV Series（用劇集教英文）\n• mmmEnglish（澳洲英文，自然對話）\n• VOA Learning English（慢速新聞英文）\n\n建議：\n• 每日睇 10-15 分鐘\n• 跟住講（唔好淨係睇）\n• 訂閱 2-3 個最鍾意嘅',
        vocab: [
          { en: 'subscribe', zh: '訂閱', example: 'Subscribe to their channel.' },
          { en: 'pronunciation', zh: '發音', example: 'Focus on pronunciation.' },
          { en: 'accent', zh: '口音', example: 'Which accent do you prefer?' },
        ],
        quiz: [
          { q: '每日建議睇幾耐英文 YouTube？', qZh: '', opts: ['5 小時', '10-15 分鐘', '1 分鐘', '唔使睇'], ans: 1 },
        ],
      },
      { id: 'vid-5', title: 'Podcast 學英文', titleZh: 'Podcast學英文', type: 'listening', minutes: 7,
        content: 'Podcast 係通勤/做運動時學英文嘅最佳工具。\n\n初學者：\n• 6 Minute English (BBC) — 6 分鐘一集\n• ESL Pod — 慢速清晰\n\n中級：\n• This American Life — 真實故仔\n• Stuff You Should Know — 有趣知識\n\n高級：\n• The Daily (New York Times)\n• How I Built This — 創業故仔\n\n技巧：\n• 聽兩次 — 第一次淨聽，第二次睇 transcript\n• 口語總結每集內容',
        vocab: [
          { en: 'podcast', zh: '播客', example: 'I listen to podcasts on my commute.' },
          { en: 'episode', zh: '集', example: 'This episode was great.' },
          { en: 'summarize', zh: '總結', example: 'Can you summarize what you heard?' },
        ],
        quiz: [
          { q: '初學者最適合嘅 podcast？', qZh: '', opts: ['The Daily', '6 Minute English', 'How I Built This', 'Hardcore History'], ans: 1 },
        ],
      },
    ],
  },
];
