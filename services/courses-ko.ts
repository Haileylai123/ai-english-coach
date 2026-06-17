// services/courses-ko.ts — Korean learner courses (한국어 화자용 영어 코스)
import { Course } from './courses';

export const KO_COURSES: Course[] = [
  // =====================================================================
  // 1. 영어 기초 — English Basics for Koreans
  // =====================================================================
  {
    id: 'ko-basics',
    icon: '',
    title: '영어 기초',
    titleEn: 'English Basics',
    desc: '영어 왕초보 탈출 — 발음, 문법, 기초 단어를 차근차근',
    level: 'beginner',
    category: 'basics',
    lessons: [
      {
        id: 'ko-basics-1', title: '자기소개', titleZh: '自我介紹', type: 'speaking', minutes: 5,
        content: '영어로 자기소개는 3문장이면 충분합니다.\n\n패턴:\n• "Hi, I\'m [name]."\n• "I\'m from [place]."\n• "I work as a [job]."\n\n한국어 "잘 부탁드립니다"에 해당하는 표현:\n• "Nice to meet you."\n• "It\'s great to meet you!"\n\n⚠️ "I am a student." — 직업 앞에는 항상 a/an!',
        vocab: [
          { en: 'introduce', zh: '소개하다', example: 'Let me introduce myself.' },
          { en: 'originally', zh: '원래', example: 'I\'m originally from Busan.' },
          { en: 'currently', zh: '현재', example: 'I currently live in Seoul.' },
        ],
        practice: { prompt: 'Introduce yourself in 3 sentences — name, where you\'re from, and your job.', zh: '3문장으로 자기소개.' },
        quiz: [
          { q: '"Nice to meet you"는?', qZh: '', opts: ['안녕히 가세요', '반갑습니다', '감사합니다', '죄송합니다'], ans: 1 },
          { q: '"I\'m from ___" — 빈칸에 들어갈 말은?', qZh: '', opts: ['학교', '출신지', '나이', '음식'], ans: 1 },
        ],
      },
      {
        id: 'ko-basics-2', title: '숫자·시간·날짜', titleZh: '數字時間', type: 'reading', minutes: 6,
        content: '영어 날짜는 한국과 순서가 다릅니다!\n\n날짜 (미국식):\n• June 17 → "June seventeenth"\n\n시간:\n• 3:00 → "three o\'clock"\n• 3:15 → "three fifteen" / "quarter past three"\n• 3:30 → "three thirty" / "half past three"\n\n⚠️ 한국인이 자주 틀리는 것:\n• fifteen(15) ≠ fifty(50)\n• thirteen(13) ≠ thirty(30)',
        vocab: [
          { en: 'o\'clock', zh: '~시', example: 'It\'s 7 o\'clock.' },
          { en: 'quarter', zh: '15분', example: 'A quarter past two.' },
          { en: 'half', zh: '30분', example: 'Half past ten.' },
        ],
        quiz: [
          { q: '"3:15"를 영어로?', qZh: '', opts: ['Three fifty', 'Three fifteen', 'Fifteen three', 'Quarter three'], ans: 1 },
          { q: '"Half past seven" = ?', qZh: '', opts: ['6:30', '7:00', '7:30', '8:00'], ans: 2 },
        ],
      },
      {
        id: 'ko-basics-3', title: 'R과 L 발음', titleZh: '發音 R/L', type: 'listening', minutes: 8,
        content: '한국인에게 가장 어려운 R과 L 구분.\n\nR:\n• 혀를 입천장에 대지 않는다\n• 혀를 뒤로 말고 입을 오므린다\n\nL:\n• 혀끝을 윗니 뒤에 댄다\n\n연습:\n• right vs light\n• rice vs lice\n• pray vs play\n• road vs load',
        vocab: [
          { en: 'right', zh: '오른쪽·옳은', example: 'Turn right here.' },
          { en: 'light', zh: '빛·가벼운', example: 'This bag is light.' },
          { en: 'rice', zh: '밥', example: 'I eat rice every meal.' },
        ],
        practice: { prompt: 'Read aloud: right, light, rice, road, pray, play. 5 times each.', zh: 'right, light, rice, road를 5번씩 소리내서 읽기.' },
        quiz: [
          { q: 'R 발음에서 혀는?', qZh: '', opts: ['윗니 뒤에 댄다', '입천장에 닿지 않는다', '아랫입술에 댄다', '목으로 간다'], ans: 1 },
        ],
      },
      {
        id: 'ko-basics-4', title: 'TH 발음', titleZh: 'TH音', type: 'listening', minutes: 7,
        content: 'TH는 한국어에 없는 소리. 혀를 앞니 사이에 살짝 물고 발음.\n\n무성음 /θ/: think, thank, three\n유성음 /ð/: this, that, the, mother\n\n연습 문장:\n• "I think that this is the best."\n• "Thank you for the three things."',
        vocab: [
          { en: 'think', zh: '생각하다', example: 'I think so too.' },
          { en: 'thank', zh: '감사하다', example: 'Thank you so much.' },
          { en: 'this', zh: '이것', example: 'This is delicious.' },
        ],
        practice: { prompt: '"I think that this is the best thing." — 5번 반복.', zh: '"I think that this is the best thing." 5회 반복.' },
        quiz: [
          { q: 'TH 무성음 /θ/은?', qZh: '', opts: ['this', 'that', 'think', 'the'], ans: 2 },
        ],
      },
      {
        id: 'ko-basics-5', title: '필수 동사 TOP 10', titleZh: '動詞', type: 'vocab', minutes: 8,
        content: '이 10개 동사로 일상회화 80% 커버.\n\nbe, have, do, say, get, make, go, know, take, see\n\n예문:\n• I am a student.\n• I have a question.\n• I get up at 7.\n• Let\'s go!\n• I don\'t know.\n• See you later!',
        vocab: [
          { en: 'be', zh: '~이다', example: 'I am Korean.' },
          { en: 'have', zh: '가지다', example: 'I have two cats.' },
          { en: 'get', zh: '얻다·되다', example: 'I got a new job.' },
          { en: 'take', zh: '가지다·타다', example: 'I take the subway.' },
        ],
        practice: { prompt: 'Use 5 verbs above to describe your daily routine.', zh: '위 동사 5개로 하루 일과 설명.' },
        quiz: [
          { q: '"get up"의 의미는?', qZh: '', opts: ['자다', '일어나다', '먹다', '걷다'], ans: 1 },
          { q: 'Which verb means "알다"?', qZh: '', opts: ['go', 'see', 'know', 'make'], ans: 2 },
        ],
      },
    ],
  },

  // =====================================================================
  // 2. 비즈니스 영어 — Business for Koreans
  // =====================================================================
  {
    id: 'ko-business',
    icon: '',
    title: '비즈니스 영어',
    titleEn: 'Business English',
    desc: '면접·이메일·프레젠테이션·회의 — 취준생과 직장인을 위한 실전 영어',
    level: 'intermediate',
    category: 'business',
    lessons: [
      {
        id: 'ko-business-1', title: '영어 이메일 작성법', titleZh: '商務Email', type: 'reading', minutes: 8,
        content: '비즈니스 이메일 기본 구조:\n\n① 제목: 간결하게\n• "Meeting request: Q3 Review"\n\n② 수신인:\n• Dear Mr. Kim,\n• Hi Team,\n\n③ 본문: 결론을 먼저\n• "I\'m writing to..."\n• "This is regarding..."\n\n④ 맺음말:\n• "Best regards,"\n• "Thank you,"\n\n⚠️ "수고하셨습니다" → 영어에 없음!\n대신: "Thank you for your hard work."',
        vocab: [
          { en: 'regarding', zh: '~에 관하여', example: 'Regarding our meeting...' },
          { en: 'attached', zh: '첨부', example: 'Please see attached.' },
          { en: 'appreciate', zh: '감사하다', example: 'I appreciate your reply.' },
        ],
        quiz: [
          { q: '가장 격식 있는 이메일 첫인사?', qZh: '', opts: ['Hey!', 'Dear Mr. Kim,', 'Hi,', 'Yo'], ans: 1 },
          { q: '"attached"의 의미는?', qZh: '', opts: ['공격', '첨부', '출석', '연결'], ans: 1 },
        ],
      },
      {
        id: 'ko-business-2', title: '회의 영어', titleZh: '會議', type: 'speaking', minutes: 10,
        content: '영어 회의에서는 침묵 ≠ 동의. 적극적으로 발언하세요.\n\n시작:\n• "Let\'s get started."\n\n의견:\n• "In my opinion..."\n• "I\'d like to add..."\n\n정중한 반대:\n• "I see your point, but..."\n• "That\'s one perspective. Another is..."\n\n질문:\n• "Could you elaborate?"',
        vocab: [
          { en: 'agenda', zh: '의제', example: 'Let\'s check the agenda.' },
          { en: 'consensus', zh: '합의', example: 'We reached a consensus.' },
          { en: 'proposal', zh: '제안', example: 'I have a proposal.' },
        ],
        practice: { prompt: 'Lead a 2-minute meeting about a new project.', zh: '신규 프로젝트에 관한 2분 회의 리드.' },
        quiz: [
          { q: '정중하게 반대할 때?', qZh: '', opts: ['No!', 'You\'re wrong', 'I see your point, but...', 'Whatever'], ans: 2 },
          { q: '"Could you elaborate?" 의미는?', qZh: '', opts: ['간단히 말해', '자세히 설명해 주세요', '나중에', '무시해'], ans: 1 },
        ],
      },
      {
        id: 'ko-business-3', title: '영어 면접 — STAR 기법', titleZh: '面試STAR', type: 'speaking', minutes: 9,
        content: '한국 대기업 영어 면접에서 꼭 나오는 STAR:\n\n• Situation: 배경\n• Task: 과제\n• Action: 행동\n• Result: 결과\n\n예시 "팀 갈등 해결":\nS — 두 개발자가 아키텍처로 충돌\nT — 합의 도출이 내 역할\nA — 회의 주선, 각자 의견 청취, 장단점 정리\nR — 하이브리드 방식 채택, 양측 만족',
        vocab: [
          { en: 'situation', zh: '상황', example: 'The situation was challenging.' },
          { en: 'resolve', zh: '해결하다', example: 'I resolved the conflict.' },
          { en: 'outcome', zh: '결과', example: 'The outcome was positive.' },
        ],
        practice: { prompt: 'Use STAR to describe a time you solved a problem.', zh: 'STAR로 문제 해결 경험 설명.' },
        quiz: [
          { q: 'STAR의 "A"는?', qZh: '', opts: ['Answer', 'Action', 'Attempt', 'Argument'], ans: 1 },
        ],
      },
      {
        id: 'ko-business-4', title: '영어 프레젠테이션', titleZh: 'Presentation', type: 'speaking', minutes: 10,
        content: '영어 발표 "Tell them" 법칙:\n\n① 도입: "Today, I\'d like to talk about..."\n② 본론: "First... Next... Finally..."\n③ 결론: "To sum up..."\n④ Q&A: "I\'d be happy to take questions."\n\n⚠️ 한국인 주의:\n• 서론이 너무 길다 → 결론 먼저!\n• 목소리가 작다 → 맨 뒷자리까지 들리게!',
        vocab: [
          { en: 'overview', zh: '개요', example: 'Here\'s a quick overview.' },
          { en: 'key point', zh: '핵심', example: 'The key point is...' },
          { en: 'summary', zh: '요약', example: 'In summary...' },
        ],
        practice: { prompt: '2-minute presentation: "Why I recommend my favorite app."', zh: '2분 발표: "내가 추천하는 앱".' },
        quiz: [
          { q: '발표 시작할 때 할 말은?', qZh: '', opts: ['취미 얘기', '오늘 다룰 내용 개요', '날씨 얘기', '긴 서론'], ans: 1 },
        ],
      },
      {
        id: 'ko-business-5', title: '해외 출장 & 화상회의', titleZh: '出差', type: 'speaking', minutes: 8,
        content: '해외 출장과 줌/팀즈 회의 필수 표현.\n\n공항:\n• "I\'d like to check in."\n\n화상회의:\n• "Can everyone hear me?"\n• "You\'re on mute!"\n• "Let me share my screen."\n\n스몰토크 (한국인이 약한 부분):\n• "How was your weekend?"\n• "Did you watch the game?"\n\n⚠️ 바로 본론 들어가지 말고 30초 스몰토크 먼저!',
        vocab: [
          { en: 'check in', zh: '체크인', example: 'I checked in online.' },
          { en: 'mute', zh: '음소거', example: 'You\'re on mute!' },
          { en: 'time zone', zh: '시간대', example: 'What time zone are you in?' },
        ],
        quiz: [
          { q: '"You\'re on mute!" 의미는?', qZh: '', opts: ['조용히 해', '음소거 상태예요', '끊겼어요', '잘 들려요'], ans: 1 },
        ],
      },
    ],
  },

  // =====================================================================
  // 3. 일상 영어 — Daily English
  // =====================================================================
  {
    id: 'ko-daily',
    icon: '',
    title: '일상 영어',
    titleEn: 'Daily English',
    desc: '친구와의 대화·데이트·SNS·취미 — 진짜 쓰는 영어',
    level: 'beginner',
    category: 'basics',
    lessons: [
      {
        id: 'ko-daily-1', title: '친구와 가벼운 대화', titleZh: 'Chat', type: 'speaking', minutes: 6,
        content: '원어민 친구와 자연스럽게 대화하기.\n\n인사:\n• "Hey, what\'s up?"\n• "How\'s it going?"\n\n대답:\n• "Pretty good!"\n• "Not much, you?"\n\n작별:\n• "See you later!"\n• "Take care!"',
        vocab: [
          { en: 'what\'s up', zh: '왓츠업·안녕', example: 'Hey, what\'s up?' },
          { en: 'hang out', zh: '놀다', example: 'Want to hang out?' },
          { en: 'awesome', zh: '최고', example: 'That\'s awesome!' },
        ],
        practice: { prompt: '1-minute casual chat: greet → ask how they are → suggest meeting up.', zh: '1분 캐주얼 대화.' },
        quiz: [
          { q: '"What\'s up?"의 자연스러운 대답?', qZh: '', opts: ['I am fine thank you', 'Not much, you?', 'Yes I do', 'Goodbye'], ans: 1 },
        ],
      },
      {
        id: 'ko-daily-2', title: '식당 영어', titleZh: '餐廳', type: 'speaking', minutes: 7,
        content: '해외 식당에서 자신 있게 주문하기.\n\n예약: "I have a reservation under Kim."\n주문: "I\'ll have the steak, please."\n요청: "Could I get this without onions?"\n계산: "Could we get the check, please?"\n\n팁 문화:\n• 미국: 15-20%\n• 유럽: 서비스료 포함된 경우 많음',
        vocab: [
          { en: 'reservation', zh: '예약', example: 'Do you have a reservation?' },
          { en: 'check', zh: '계산서', example: 'Could we get the check?' },
          { en: 'medium rare', zh: '미디엄 레어', example: 'I\'d like my steak medium rare.' },
        ],
        quiz: [
          { q: '"I\'ll have the ___"는 언제 사용?', qZh: '', opts: ['주문할 때', '계산할 때', '들어갈 때', '나갈 때'], ans: 0 },
          { q: '미국 팁은 보통?', qZh: '', opts: ['0%', '5%', '15-20%', '50%'], ans: 2 },
        ],
      },
      {
        id: 'ko-daily-3', title: '취미·덕질 영어', titleZh: '興趣', type: 'speaking', minutes: 7,
        content: '덕질은 최고의 아이스브레이킹!\n\n질문:\n• "What are you into lately?"\n• "Are you a fan of BTS?"\n\n내 취미:\n• "I\'m really into K-dramas."\n• "I\'ve been learning guitar."\n\n공감:\n• "No way, me too!"\n• "That\'s so cool!"',
        vocab: [
          { en: 'into', zh: '~에 빠지다', example: 'I\'m really into cooking.' },
          { en: 'fan', zh: '팬', example: 'I\'m a huge fan.' },
          { en: 'recommend', zh: '추천하다', example: 'I highly recommend it.' },
          { en: 'obsessed', zh: '집착하다', example: 'I\'m obsessed with this drama.' },
        ],
        practice: { prompt: 'Talk about your favorite hobby for 1 minute.', zh: '가장 좋아하는 취미 1분간 설명.' },
        quiz: [
          { q: '"I\'m into ___" 의미는?', qZh: '', opts: ['들어가다', '빠져 있다', '싫어하다', '버리다'], ans: 1 },
        ],
      },
      {
        id: 'ko-daily-4', title: 'SNS·채팅 영어', titleZh: 'SNS', type: 'reading', minutes: 6,
        content: 'SNS에서 많이 쓰는 줄임말과 슬랭.\n\n• LOL = Laugh Out Loud (ㅋㅋㅋ)\n• OMG = Oh My God (헐)\n• TBH = To Be Honest (솔직히)\n• IDK = I don\'t know (몰라)\n• BRB = Be Right Back (곧 돌아올게)\n• DM = Direct Message (쪽지)\n\n요즘 슬랭:\n• "That\'s fire!" = 대박!\n• "Slay!" = 끝내준다!',
        vocab: [
          { en: 'LOL', zh: 'ㅋㅋㅋ', example: 'That was so funny LOL.' },
          { en: 'DM', zh: '쪽지', example: 'DM me!' },
          { en: 'vibe', zh: '분위기', example: 'Good vibes only.' },
        ],
        quiz: [
          { q: '"LOL"은?', qZh: '', opts: ['Lots of Love', 'Laugh Out Loud', 'Live On Line', 'Lemon'], ans: 1 },
          { q: '"That\'s fire!" 의미는?', qZh: '', opts: ['불이야!', '대박!', '더워!', '위험해!'], ans: 1 },
        ],
      },
      {
        id: 'ko-daily-5', title: '여행 영어', titleZh: '旅遊', type: 'speaking', minutes: 7,
        content: '해외여행 필수 표현.\n\n길 묻기:\n• "Excuse me, how do I get to ___?"\n• "Is it far from here?"\n\n사진 부탁:\n• "Could you take a picture of us?"\n\n쇼핑:\n• "How much is this?"\n• "I\'m just looking, thank you."\n\n비상시:\n• "I need help."\n• "I lost my passport."',
        vocab: [
          { en: 'direction', zh: '방향', example: 'Can you give me directions?' },
          { en: 'recommend', zh: '추천', example: 'What do you recommend?' },
          { en: 'receipt', zh: '영수증', example: 'Can I have a receipt?' },
        ],
        practice: { prompt: 'Ask for directions to the nearest subway station.', zh: '가장 가까운 지하철역 물어보기.' },
        quiz: [
          { q: '"How do I get to ___?" 의미는?', qZh: '', opts: ['어디서 사?', '어떻게 가?', '얼마?', '몇 시?'], ans: 1 },
        ],
      },
    ],
  },

  // =====================================================================
  // 4. OPIC 대비 — OPIC Speaking Prep
  // =====================================================================
  {
    id: 'ko-opic',
    icon: '',
    title: 'OPIC 대비',
    titleEn: 'OPIC Prep',
    desc: 'OPIC IM3~AL 목표 — 돌발 주제·롤플레이·서베이 완벽 대비',
    level: 'intermediate',
    category: 'ielts',
    lessons: [
      {
        id: 'ko-opic-1', title: 'OPIC 자기소개', titleZh: 'OPIC自我介紹', type: 'speaking', minutes: 7,
        content: 'OPIC 첫 관문 자기소개. 너무 길지 않게, 자연스럽게.\n\n구성:\n• 이름, 사는 곳, 직업/전공\n• 취미 1-2개\n• 영어 공부 이유\n\n예시:\n"Hi, my name is Jiwon. I live in Seoul and I\'m a university student majoring in business. In my free time, I enjoy watching movies and hiking. I\'m studying English because I want to work for a global company."',
        vocab: [
          { en: 'major', zh: '전공', example: 'I\'m majoring in computer science.' },
          { en: 'currently', zh: '현재', example: 'I\'m currently a junior.' },
          { en: 'goal', zh: '목표', example: 'My goal is to study abroad.' },
        ],
        practice: { prompt: 'OPIC self-introduction: name, where you live, what you do, 1 hobby, why English.', zh: 'OPIC 자기소개 30-40초.' },
        quiz: [
          { q: 'OPIC 자기소개 적정 길이?', qZh: '', opts: ['10초', '30-40초', '2분', '5분'], ans: 1 },
        ],
      },
      {
        id: 'ko-opic-2', title: '돌발 주제 대비', titleZh: '突發話題', type: 'speaking', minutes: 8,
        content: 'OPIC 돌발 주제 공략법.\n\n자주 나오는 돌발 주제:\n• 재활용 (Recycling)\n• 건강 (Health)\n• 날씨 (Weather)\n• 교통 (Transportation)\n• 기술 (Technology)\n\n공략법:\n① 질문 다시 말하기 (paraphrasing)\n② "There are several reasons..."\n③ 개인 경험 + 일반적 의견\n④ "In conclusion..."\n\n⚠️ 모르는 주제? "That\'s an interesting question. I haven\'t thought about it much, but..."',
        vocab: [
          { en: 'recycling', zh: '재활용', example: 'Recycling is important for the environment.' },
          { en: 'commute', zh: '통근', example: 'My commute takes about 40 minutes.' },
          { en: 'impact', zh: '영향', example: 'Technology has a huge impact on our lives.' },
        ],
        practice: { prompt: 'Answer: "What do you think about recycling in your country?"', zh: '"한국의 재활용에 대해 어떻게 생각하나요?" 답변.' },
        quiz: [
          { q: '모르는 주제가 나왔을 때?', qZh: '', opts: ['침묵', '"I haven\'t thought about it much, but..."', '"I don\'t know" 하고 끝', '화제를 바꾼다'], ans: 1 },
        ],
      },
      {
        id: 'ko-opic-3', title: '롤플레이 — 전화/예약', titleZh: 'RolePlay', type: 'speaking', minutes: 8,
        content: 'OPIC 롤플레이 유형.\n\n전화 예약:\n• "I\'d like to make a reservation."\n• "For how many people?"\n• "What time would you like?"\n\n문제 해결:\n• "I have a problem with my order."\n• "I\'d like to speak to the manager."\n• "How can we resolve this?"',
        vocab: [
          { en: 'reservation', zh: '예약', example: 'I\'d like to make a reservation.' },
          { en: 'available', zh: '가능한', example: 'Is 7pm available?' },
          { en: 'refund', zh: '환불', example: 'Can I get a refund?' },
        ],
        practice: { prompt: 'Role-play: Call a restaurant to book a table for 4 at 7pm.', zh: '레스토랑에 4명 7시 예약 전화.' },
        quiz: [
          { q: '레스토랑 예약할 때 첫마디?', qZh: '', opts: ['Give me a table', 'I\'d like to make a reservation', 'I want food', 'Hello food'], ans: 1 },
        ],
      },
      {
        id: 'ko-opic-4', title: '서베이 질문 — 과거 경험', titleZh: '經驗描述', type: 'speaking', minutes: 8,
        content: 'OPIC에서 가장 긴 답변이 필요한 유형.\n\n질문 패턴:\n• "Tell me about a memorable trip."\n• "Describe a challenge you overcame."\n\n구성:\n① When/Where/Who\n② What happened — 구체적으로\n③ How you felt\n④ What you learned\n\n⏰ 목표: 1분 30초~2분',
        vocab: [
          { en: 'memorable', zh: '기억에 남는', example: 'It was the most memorable trip.' },
          { en: 'experience', zh: '경험', example: 'It was a valuable experience.' },
          { en: 'overcome', zh: '극복하다', example: 'I overcame my fear.' },
        ],
        practice: { prompt: 'Describe a memorable trip — when, where, what happened, how you felt.', zh: '기억에 남는 여행 1분 30초 설명.' },
        quiz: [
          { q: '과거 경험 질문에 포함해야 할 것?', qZh: '', opts: ['이름만', '언제·어디·무슨 일·느낌·배운 점', '날씨만', '음식만'], ans: 1 },
        ],
      },
      {
        id: 'ko-opic-5', title: 'OPIC 고득점 표현', titleZh: 'OPIC高分', type: 'vocab', minutes: 10,
        content: 'IM3~AL 받는 고급 표현들.\n\n의견 표현력 UP:\n• "From my perspective..."\n• "It depends on the situation."\n• "There are pros and cons."\n\n시간 끌기 (crutch phrases):\n• "That\'s a good question."\n• "Let me think for a moment."\n• "I\'ve never really thought about that, but..."\n\n연결어 필수:\n• First of all / Moreover / In addition\n• On the other hand / However\n• For example / In conclusion',
        vocab: [
          { en: 'perspective', zh: '관점', example: 'From my perspective, it\'s a good idea.' },
          { en: 'moreover', zh: '게다가', example: 'Moreover, it saves time.' },
          { en: 'nevertheless', zh: '그럼에도 불구하고', example: 'It\'s difficult. Nevertheless, it\'s worth trying.' },
          { en: 'specifically', zh: '구체적으로', example: 'Specifically, we need more data.' },
        ],
        quiz: [
          { q: '"From my perspective" 의미는?', qZh: '', opts: ['절대적으로', '내 관점에서는', '반대로', '예를 들어'], ans: 1 },
          { q: '시간을 벌 때 쓸 수 있는 표현?', qZh: '', opts: ['Yes/No', '"That\'s a good question. Let me think."', 'Silence', 'Bye'], ans: 1 },
        ],
      },
    ],
  },

  // =====================================================================
  // 5. 고양이 영어 🐱 — Cat Lover's English
  // =====================================================================
  {
    id: 'ko-cat',
    icon: '🐱',
    title: '고양이 영어 🐱',
    titleEn: 'Cat Lover\'s English',
    desc: '집사들을 위한 영어 — 고양이 카페·길냥이 구조·고양이 자랑을 영어로!',
    level: 'beginner',
    category: 'travel',
    lessons: [
      {
        id: 'ko-cat-1', title: '고양이 카페 영어', titleZh: '貓Cafe', type: 'speaking', minutes: 5,
        content: '한국 고양이 카페를 외국인 친구에게 소개해 보세요.\n\n설명:\n• "It\'s a cafe where you can pet cats."\n• "You pay by the hour."\n\n고양이 칭찬:\n• "This one is so fluffy!"\n• "She\'s purring!" (골골송)\n• "Look at those beans!" (젤리 발바닥)',
        vocab: [
          { en: 'purr', zh: '골골송', example: 'The cat is purring.' },
          { en: 'fluffy', zh: '복슬복슬', example: 'So fluffy!' },
          { en: 'rescue cat', zh: '구조된 고양이', example: 'She\'s a rescue cat.' },
          { en: 'paw', zh: '발', example: 'Look at those paws!' },
        ],
        practice: { prompt: 'Describe a cat cafe experience to your English-speaking friend.', zh: '고양이 카페 경험을 영어로 설명.' },
        quiz: [
          { q: '"purr"는 어떤 소리?', qZh: '', opts: ['야옹', '골골', '하악', '멍멍'], ans: 1 },
          { q: '"rescue cat"의 의미는?', qZh: '', opts: ['구조 고양이', '길고양이', '품종묘', '새끼 고양이'], ans: 0 },
        ],
      },
      {
        id: 'ko-cat-2', title: '길냥이 구조 영어', titleZh: '貓保護', type: 'speaking', minutes: 6,
        content: 'TNR과 길고양이 보호 활동 설명하기.\n\nTNR = Trap, Neuter, Return\n• "We do TNR to help stray cats."\n\n입양:\n• "This kitten is up for adoption."\n• "We\'re looking for foster homes." (임보)\n\n기부:\n• "Every dollar helps save a cat."\n• "We rely on donations."',
        vocab: [
          { en: 'TNR', zh: 'TNR', example: 'TNR is the most humane way.' },
          { en: 'foster', zh: '임시보호', example: 'We need foster families.' },
          { en: 'adopt', zh: '입양하다', example: 'We adopted two cats.' },
          { en: 'stray', zh: '길고양이', example: 'There are many strays here.' },
        ],
        quiz: [
          { q: '"TNR"의 "N"은?', qZh: '', opts: ['New', 'Neuter(중성화)', 'Nice', 'Next'], ans: 1 },
          { q: '"up for adoption"은?', qZh: '', opts: ['입양 완료', '입양 진행 중', '도망감', '아픔'], ans: 1 },
        ],
      },
      {
        id: 'ko-cat-3', title: '고양이 자랑 영어', titleZh: '曬貓', type: 'speaking', minutes: 5,
        content: '인스타에 우리 고양이 영어로 자랑하기!\n\n소개:\n• "This is Nabi. She\'s a 2-year-old calico."\n• "I rescued her from a parking lot."\n\n성격:\n• "She\'s shy but super sweet once she trusts you."\n• "He\'s a total troublemaker!"\n\n고양이あるある:\n• "He wakes me up at 5am for food."\n• "She sits on my laptop while I work."',
        vocab: [
          { en: 'calico', zh: '삼색이', example: 'My calico is beautiful.' },
          { en: 'affectionate', zh: '애교 많은', example: 'He\'s very affectionate.' },
          { en: 'mischievous', zh: '장난꾸러기', example: 'My kitten is so mischievous!' },
          { en: 'cuddle', zh: '껴안다', example: 'She loves to cuddle.' },
        ],
        practice: { prompt: 'Write an Instagram caption in English about your cat.', zh: '고양이 인스타 영어 캡션 쓰기.' },
        quiz: [
          { q: '"calico"는 어떤 고양이?', qZh: '', opts: ['흰 고양이', '검은 고양이', '삼색 고양이', '줄무늬 고양이'], ans: 2 },
        ],
      },
      {
        id: 'ko-cat-4', title: '동물병원 영어', titleZh: '獸醫', type: 'speaking', minutes: 7,
        content: '해외에서 고양이 키울 때 병원 영어는 필수!\n\n증상:\n• "She hasn\'t eaten for two days."\n• "He\'s been vomiting."\n• "She seems lethargic." (기운 없음)\n\n예방접종:\n• "What vaccinations does she need?"\n\n중성화:\n• "When should I get him neutered?"',
        vocab: [
          { en: 'veterinarian', zh: '수의사', example: 'We need to see a vet.' },
          { en: 'vaccination', zh: '예방접종', example: 'Vaccinations are up to date.' },
          { en: 'appetite', zh: '식욕', example: 'He lost his appetite.' },
          { en: 'symptom', zh: '증상', example: 'What symptoms is she showing?' },
        ],
        quiz: [
          { q: '"lethargic" 의미는?', qZh: '', opts: ['활발한', '기운 없는', '화난', '뛰어다니는'], ans: 1 },
        ],
      },
      {
        id: 'ko-cat-5', title: '고양이 커뮤니티 영어', titleZh: '貓社群', type: 'speaking', minutes: 6,
        content: '글로벌 고양이 커뮤니티에서 활동하기.\n\n입양 행사:\n• "I\'m interested in adopting."\n• "Do you have any senior cats?"\n\n자원봉사:\n• "I\'d like to volunteer."\n• "I can help with photography."\n\n해시태그:\n#catsofinstagram #adoptdontshop #tnr #fosteringsaveslives',
        vocab: [
          { en: 'adoption event', zh: '입양 행사', example: 'There\'s an adoption event Saturday.' },
          { en: 'volunteer', zh: '자원봉사자', example: 'We need volunteers.' },
          { en: 'shelter', zh: '보호소', example: 'The shelter helps 100+ cats.' },
          { en: 'foster fail', zh: '임보 실패(입양)', example: 'We had a foster fail — kept all three!' },
        ],
        quiz: [
          { q: '"foster fail"의 긍정적 의미는?', qZh: '', opts: ['임보 실패(돌려보냄)', '임보 실패(결국 입양함)', '고양이가 도망감', '병에 걸림'], ans: 1 },
        ],
      },
    ],
  },
];
