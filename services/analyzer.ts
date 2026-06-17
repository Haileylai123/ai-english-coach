// services/analyzer.ts — Speech analysis engine
// Local heuristics + optional Claude API for deep analysis

export interface AnalysisResult {
  overall: { score: number; level: string; detail?: string };
  fluency: { score: number; wpm: number; fillerRatio: number; detail: string };
  vocabulary: { score: number; totalWords: number; uniqueWords: number; ttr: number; cefrLevels: Record<string, number>; sceneVocabUsed: number; usedKeyVocab?: string[]; detail: string };
  pronunciation: { score: number; avgConfidence: number; detail: string };
  grammar: { score: number; avgSentenceLength: number; sentenceCount: number; errorCount: number; passiveCount: number; detail: string };
  timestamp: number;
  transcript: string;
  /** AI-generated feedback (if Claude API key set) */
  aiFeedback?: {
    overall_comment: string;
    strengths: string[];
    improvements: string[];
    next_practice: string;
  };
}

// CEFR vocabulary levels (simplified)
const CEFR: Record<string, Set<string>> = {
  A1: new Set(['the','a','an','is','are','am','i','you','he','she','it','we','they','this','that','these','those','my','your','his','her','its','our','their','what','where','when','why','how','who','which','be','have','do','can','will','would','could','should','may','might','go','come','see','know','think','want','like','need','get','make','say','tell','ask','give','take','use','find','work','live','love','good','bad','big','small','hot','cold','new','old','yes','no','please','sorry','thank','hello','hi','bye','one','two','three','today','tomorrow','now','later','always','never','here','there','in','on','at','to','for','with','eat','drink','sleep','read','write','speak','listen','play','man','woman','child','friend','family','house','home','school','work','time','day','night','water','food','money','book','name','happy','sad','walk','talk','buy','help','try']),
  A2: new Set(['about','also','another','around','because','before','behind','between','both','bring','build','change','check','choose','clean','clear','close','country','course','culture','decide','different','difficult','draw','dream','during','each','early','easy','enough','even','every','example','explain','face','fact','fail','fall','fast','feel','fill','final','finish','follow','foreign','forget','free','fresh','full','future','game','garden','grow','guess','half','happen','hard','head','health','heavy','history','hold','hope','however','human','hundred','idea','important','include','inside','interesting','join','journey','just','kind','language','large','learn','leave','lesson','level','light','little','local','main','matter','mean','meet','member','message','middle','million','mind','minute','miss','moment','move','museum','music','natural','near','necessary','never','normal','notice','number','offer','often','only','open','order','outside','page','pair','paper','parent','part','party','pass','past','person','phone','photo','plan','plant','point','popular','possible','power','practice','prepare','present','price','problem','product','program','project','proud','public','question','quick','quiet','quite','reach','reason','receive','recent','remember','report','result','return','right','round','rule','safe','save','season','sense','serious','serve','service','several','share','short','show','side','sign','simple','since','size','skill','smart','smile','social','soft','someone','something','sometimes','special','spend','sport','stand','star','start','state','step','still','stop','story','street','strong','student','study','subject','suggest','support','sure','surprise','system','table','teach','team','test','than','thing','think','though','through','together','tomorrow','town','travel','tree','trip','true','trust','try','turn','type','under','understand','until','useful','usual','value','variety','various','view','visit','voice','wait','walk','want','warm','wash','watch','water','way','wear','weather','week','welcome','well','west','whole','wide','will','win','window','wish','within','without','wonder','world','worry','worth','wrong']),
  B1: new Set(['ability','abroad','accept','achieve','act','action','active','actual','add','address','admit','advantage','advertise','advice','affect','afford','agree','aim','allow','although','among','amount','ancient','announce','annoy','appear','apply','approach','argue','arrange','arrival','article','artist','aspect','assume','attend','attitude','attract','audience','author','available','average','avoid','award','balance','base','basic','battle','bear','beat','beauty','believe','belong','benefit','beyond','bitter','blame','block','board','border','bother','brain','brand','brave','breath','brief','bright','broadcast','burn','campaign','capable','capital','capture','career','careful','carry','case','catch','cause','celebrate','center','central','certain','challenge','chance','character','charge','charity','chief','choice','church','citizen','claim','classic','climate','climb','club','coach','collect','combine','comfort','command','comment','commercial','common','communicate','community','company','compare','compete','complain','complete','concern','condition','confirm','connect','consider','contain','content','continue','control','convince','cool','correct','cost','couple','cover','create','crime','criminal','crisis','criticize','crowd','cure','current','damage','danger','deal','debate','decade','decision','declare','decline','defend','define','degree','delay','deliver','demand','deny','department','depend','describe','design','desire','despite','destroy','detail','determine','develop','device','direct','discover','discuss','disease','display','distance','distribute','divide','document','double','doubt','drama','drop','due','duty','earn','economy','edge','editor','educate','effect','effort','elect','element','elsewhere','emerge','emotion','employ','enable','encourage','energy','engage','engine','enjoy','enormous','ensure','enter','entire','environment','equal','escape','especially','essential','establish','event','eventually','evidence','exact','examine','excellent','exchange','exist','expect','experiment','expert','explore','express','extend','extreme','facility','factor','fair','faith','familiar','famous','fear','feature','field','figure','file','film','finance','firm','fix','flat','focus','force','former','fortune','forward','founder','frame','frequently','fuel','function','fund','gain','gap','gather','generate','generation','global','goal','govern','grab','grant','ground','group','growth','guarantee','guide','handle','harm','heat','heavily','highlight','highly','host','household','huge','hunt','identify','ignore','illustrate','image','imagine','immediate','impact','implement','imply','import','impose','impress','improve','incident','increase','indicate','individual','industry','influence','inform','initial','injury','inner','innovation','insist','install','instance','instead','institution','instrument','insurance','intend','intention','interest','internal','interpret','introduce','invest','investigate','involve','island','issue','item','joint','judge','justice','justify','key','kill','knowledge','labor','lack','land','launch','lead','league','legal','limit','link','literature','loan','locate','logical','loss','lower','machine','magazine','maintain','major','manage','manufacture','mark','market','mass','master','material','measure','media','mental','mention','mere','method','military','minor','mission','mistake','mix','model','modern','monitor','moral','mostly','motor','mount','movement','multiple','muscle','narrow','nation','native','nature','negative','network','nevertheless','none','nor','note','notion','novel','nowhere','nuclear','object','obtain','obvious','occur','offense','official','operate','opinion','oppose','opposite','option','organize','original','otherwise','ought','outcome','overall','overcome','owner','pace','pain','paint','participate','particular','partly','partner','passion','patient','pattern','pause','peace','peak','peer','perform','period','permit','personality','persuade','phenomenon','philosophy','phrase','physical','pile','pitch','platform','pleasure','plenty','plot','plus','poem','poet','policy','politician','politics','pollution','pool','pop','population','portion','portrait','pose','position','positive','possess','potential','pour','poverty','predict','prefer','preserve','president','press','pressure','prevent','previous','pride','primary','principle','priority','prison','private','probably','procedure','proceed','process','produce','profession','profit','progress','promise','promote','proof','proper','property','propose','protect','protest','prove','provide','publish','purchase','pursue','qualify','quarter','quit','quote','race','radical','raise','range','rank','rapid','rare','rate','rather','react','realize','recommend','recover','reduce','refer','reflect','reform','refuse','regard','region','register','regret','relate','release','relief','rely','remain','remark','remind','remote','remove','replace','represent','reputation','request','require','research','reserve','resign','resist','resolve','resource','respond','responsible','restore','restrict','retain','retire','reveal','revenue','review','revolution','risk','role','root','route','ruin','rural','rush','sample','satisfy','scale','scene','schedule','scheme','scholar','score','screen','search','secure','seek','select','senior','separate','sequence','settle','severe','shadow','shake','shape','shelter','shift','shock','shoot','shore','signal','significance','silence','similar','sink','site','situation','slight','slip','smooth','soil','solution','solve','somehow','sort','soul','source','speaker','specific','speech','split','spot','spread','stable','staff','stage','stake','standard','stare','status','steady','steal','stick','stock','storage','strategy','strength','stress','stretch','structure','struggle','stuff','submit','substantial','succeed','sufficient','sum','summit','supply','surround','survey','survive','suspect','sustain','switch','symbol','sympathy','tackle','target','task','technique','technology','temporary','tend','territory','theme','theory','therefore','threat','throughout','thus','tip','tone','tool','top','tough','track','tradition','transfer','transform','transition','transport','treat','trend','trial','troop','trust','typical','ultimately','undertake','unfortunately','unique','universe','unless','unlike','unusual','upper','upset','urban','urge','utilize','valid','vehicle','version','victim','violence','visible','vision','vital','volume','volunteer','vote','vulnerable','warn','wealth','weapon','welcome','welfare','whereas','widespread','willing','winner','witness','worry','yield']),
  B2: new Set(['abandon','absolute','absorb','abstract','abuse','academic','accelerate','accommodate','accompany','accomplish','account','accumulate','accurate','acknowledge','acquire','adapt','adequate','adjust','administration','advance','aggressive','allocate','alter','alternative','ambiguous','amend','anticipate','apparent','appreciate','appropriate','approve','arise','artificial','assemble','assess','asset','assign','associate','assume','assure','attain','attribute','authority','automatically','aware','backup','barrier','beam','behalf','behave','bias','bind','boom','bound','boundary','breakdown','breed','broad','bubble','bulk','burden','burst','cable','capability','capacity','capture','cast','catalog','category','cease','chain','chairman','chamber','chart','chase','chemical','circumstance','civil','clarify','classic','clause','collapse','colleague','commence','commission','commit','commodity','compelling','compensate','competent','compile','compose','comprehensive','comprise','conceive','concentrate','concept','conclude','concrete','conduct','conference','confine','conflict','conscience','conscious','consist','consolidate','constitute','constrain','construct','consult','consume','contemporary','contradict','contribute','controversy','convention','convey','convince','cooperate','coordinate','core','corporate','correspond','counsel','counterpart','crack','craft','crash','crew','criteria','crucial','crude','curriculum','curve','database','declaration','dedicate','deem','defect','deficit','delegate','deliberate','demonstrate','dense','depict','deposit','depressed','derive','desperate','detect','deteriorate','devastate','devote','differ','dimension','diminish','dip','diplomatic','discharge','discipline','disclose','discount','discretion','discrimination','dismiss','disorder','dispute','dissolve','distinct','distinguish','distort','diverse','domain','domestic','dominant','dominate','donate','draft','drain','dramatic','drift','duration','dynamic','echo','ecological','elaborate','eliminate','embrace','encounter','enforce','enhance','enormous','enterprise','enthusiasm','entity','envision','equip','equivalent','era','erode','essence','establish','estate','estimate','ethic','evaluate','evolve','exceed','exception','exclusive','execute','exempt','exert','exhibit','expand','expertise','explicit','exploit','exponential','external','extract','extraordinary','fabric','facilitate','fade','fatal','feasible','feedback','fiction','flaw','flee','flexible','flourish','fluctuate','forbid','formation','formula','forthcoming','foundation','fraction','framework','frequency','fulfill','fundamental','gender','genuine','gesture','governance','grand','graphic','grasp','grave','guideline','harsh','hazard','hence','heritage','hierarchy','hint','horizon','humanity','hypothesis','identical','ideology','ignorance','illuminate','immense','immigrant','immune','impair','imperative','implement','implicit','impression','inadequate','incentive','incidence','incorporate','incredible','incur','independence','indigenous','inevitable','infrastructure','inherent','inhibit','insight','inspection','inspiration','instant','intact','integrate','intellectual','intelligence','intense','interact','interfere','interim','intermediate','intervention','intimate','invade','inventory','investigation','irony','isolate','judicial','jurisdiction','justification','keen','label','landscape','largely','latter','legislation','legitimate','liability','liberal','likewise','linger','logic','lucrative','magnitude','mainstream','mandate','manifest','manipulate','marginal','massive','mechanism','memorandum','mentor','merchant','merge','metaphor','migration','minimize','minority','moderate','modify','momentum','monopoly','motion','motivate','multiple','narrative','negotiate','neutral','nonetheless','norm','notable','notion','numerous','objective','obligation','observation','obstacle','occupation','offensive','operational','opponent','opt','organic','orientation','origin','outlet','output','overlap','oversight','paradigm','parameter','partial','participation','passive','perceive','perception','permanent','perpetual','persist','petition','philosophical','pledge','polarize','portfolio','portray','postpone','practitioner','precise','predominantly','prejudice','preliminary','premium','prescribe','presume','prevail','probe','profile','profitability','profound','prohibit','projection','prominent','prompt','propaganda','proportion','prosecute','prospect','protocol','provision','psychological','pursuit','quest','rational','realm','rebel','recognition','recruit','redundant','refine','regime','regulate','rehabilitation','reinforce','reject','reluctant','remedy','render','renowned','replacement','reproduction','reputation','resemble','reside','resistance','resolution','restraint','retain','retrospect','revelation','rhetoric','rigid','ritual','robust','sanction','saturated','savings','scope','scrutiny','sector','segment','seminar','sentiment','simulate','sketch','slogan','sophisticated','sovereign','span','specimen','spectrum','speculation','sphere','squeeze','stability','statistics','steer','stimulus','stipulate','strategic','subordinate','subscribe','subsidy','substitute','subtle','superior','supervision','supplement','surgery','surplus','suspension','symptom','synthesis','tangible','taxation','technique','tension','textile','theoretical','therapy','thereby','threshold','tolerance','trajectory','transaction','tremendous','trigger','triumph','tuition','turnover','undergo','undermine','unified','upcoming','upgrade','validity','vendor','venture','versus','vertical','via','viable','vigorous','violation','virtual','vulnerability','warrant','whereby','wholesale','withstand','workforce','worthwhile']),
  C1: new Set(['abbreviation','abolish','absurd','abundance','academia','accentuate','accessibility','accountability','accredit','accumulation','acquaint','acquisition','activism','adjacent','administer','aesthetic','aggregate','agitation','albeit','alienation','allegation','allegiance','allocate','allude','amass','ambiguity','amend','analogy','ancestor','anecdote','animosity','annex','anomaly','anthropology','antibiotic','apparatus','appease','arbitrary','archive','articulate','artifact','aspiration','assassinate','assembly','assert','assimilate','atrocity','attainable','attentive','audit','authenticate','authoritarian','autonomy','aversion','backlash','ballot','bankruptcy','barren','beacon','belligerent','benevolent','besiege','biodiversity','bipartisan','blatant','blueprint','bolster','bourgeois','bureaucracy','bypass','calibrate','catalyst','censor','certify','charismatic','chronicle','citizenship','civic','clampdown','classify','cliché','coerce','coherent','coincide','collaborative','collateral','collective','colloquial','colonial','combatant','commemorate','communal','compassion','compendium','complacent','complement','compliance','concede','conceptual','condemn','condone','confederate','confide','confiscate','conglomerate','connotation','conscientious','consecutive','consensus','consortium','conspicuous','conspiracy','constituency','constitutional','contemplate','contempt','contend','contention','contextual','contingent','contradiction','contrary','convene','converge','conviction','cordially','correlate','corrosion','cosmopolitan','counterfeit','coup','courteous','credential','credibility','criterion','culminate','cultivate','cumulative','curator','curtail','custody','cynical','de facto','decentralize','decipher','decisive','decree','deduce','defamation','deference','defiance','delegate','deliberation','delineate','demographic','denounce','depict','deploy','depreciate','deprivation','deregulation','designate','deter','detract','detrimental','deviate','devolution','diagnose','dictator','differentiate','diplomacy','disarmament','discern','discourse','disdain','disenfranchise','disillusion','dismantle','disparity','disposition','disproportionate','disseminate','dissent','dissertation','distill','distinctive','distort','divert','doctrine','dormant','drastically','drawback','drought','dual','dubious','dynamics','eccentric','eclipse','egalitarian','elaboration','elicit','elite','eloquent','emancipation','embargo','embed','embody','embryonic','empathy','empirical','empower','enact','encompass','endeavor','endorsement','engrave','enlighten','ensue','entail','entitlement','entrepreneur','enumerate','envisage','epitome','equilibrium','eradicate','erratic','escalate','espionage','esteem','ethnography','etiquette','evident','evoke','exaggerate','exceedingly','excavate','excerpt','exemplify','exhaustive','exile','existential','exorbitant','expedition','expenditure','expire','explanatory','exploitation','exquisite','extensively','extinguish','extravagant','fabrication','facet','famine','fascism','feat','federalism','feminism','ferocious','fertility','feudal','fiasco','fiscal','flagship','flawed','foe','forefront','foremost','forfeit','forge','formidable','foster','fragile','fragment','fraudulent','frivolous','frontier','fundamentalism','furnish','futile','generalize','genesis','genocide','geopolitical','glamorous','globalization','grassroots','gratitude','grievance','guerrilla','habitat','harassment','haven','heighten','henceforth','hereditary','heroism','heterogeneous','hinder','hitherto','homogeneous','humanitarian','hybrid','hypothetical','iconic','illicit','illiterate','immerse','immortal','impartial','implement','impoverish','impulsive','inaugural','incessant','inclination','inclusive','indictment','indignation','indispensable','induce','inequality','infancy','infiltrate','inflict','influential','informant','inhabit','inheritance','injection','inmate','innate','innumerable','inquisitive','insane','inseparable','instigate','insurgent','integral','integrity','intercept','interim','interplay','interrogation','intersection','intricate','intrinsic','intuition','invaluable','invoke','irreversible','itinerary','jeopardize','jurisdiction','justifiable','juxtapose','landmark','latent','legacy','legislative','legitimacy','lenient','leverage','liaison','liberate','linguistic','lobbyist','locomotive','loophole','lucrative','magnitude','malicious','mandate','manifesto','marginalize','materialize','mediate','medieval','memorandum','mercantile','meritocracy','metropolitan','militant','mobilize','monarchy','monopoly','moratorium','morbid','multilateral','municipal','mythology','nationalism','neglect','negotiable','nominally','nonetheless','notion','novice','nuance','nurture','obedience','obscure','obsession','offspring','oligarchy','ominous','onset','operational','oppression','organizational','orthodox','oscillate','ostensibly','oust','outcry','outrage','overarching','overhaul','overlap','overthrow','overturn','pacifist','paradox','parenthetical','parliamentary','partisan','patriarchal','patronage','peculiar','pedagogy','peerage','peninsula','peripheral','permeate','perpetrate','perpetuate','persevere','persist','pervasive','petition','philanthropy','pinnacle','plagiarism','plaintiff','plausible','pluralism','polarize','populist','posterity','pragmatic','precedent','precipitate','preclude','predecessor','predicament','predominantly','preemptive','premise','prerogative','prestigious','presumption','prevail','privatization','proactive','proclamation','procurement','proliferation','prolific','propel','proposition','prosecution','prosperity','protracted','provincial','provisional','provocative','proxy','pseudonym','purport','quota','radicalism','ramification','ratification','rationalize','reaffirm','realignment','rebellion','rebuke','recession','reciprocal','reconciliation','recur','redundant','referendum','regenerate','regime','regression','rehabilitation','reiterate','relinquish','reminiscent','renaissance','reparation','repercussion','replicate','repression','reprimand','republicanism','repudiate','requisite','resentment','resilience','resistance','respectively','restoration','restraint','restructure','retaliation','revelation','revolt','rhetoric','righteous','rigorous','robust','sanctity','sarcastic','saturation','scapegoat','scrutinize','secession','secular','sediment','segregation','seize','sensational','separatism','sequel','shrewd','simultaneously','skepticism','solidarity','sovereignty','speculative','spontaneously','stagnation','statistical','stereotype','stigma','stipend','strategic','subjective','subordinate','subsequent','subsidize','substantiate','subversive','suffrage','superficial','supersede','suppress','supremacy','surge','susceptibility','sustainable','sympathetic','synthesize','tacit','taxonomy','tenacious','territorial','theorem','therapeutic','tolerate','totalitarian','trafficking','transcend','transcribe','transformation','transgression','transparency','traverse','treason','treatise','trivial','turbulent','tyranny','undercut','underestimate','unilateral','universally','unprecedented','upheaval','usurp','utilitarian','utmost','utopian','validate','vanguard','vengeance','ventilate','verdict','viability','vigilante','vindicate','visceral','vociferous','volatile','vouch','waiver','whistleblower','widespread','wither','workforce','zealous']),
};

const CEFR_ORDER = ['C1', 'B2', 'B1', 'A2', 'A1'];

function getCEFRLevel(word: string): string {
  const lower = word.toLowerCase();
  for (const level of CEFR_ORDER) {
    if (CEFR[level]?.has(lower)) return level;
  }
  return 'unknown';
}

// Filler words
const FILLERS = new Set(['um', 'uh', 'er', 'ah', 'like', 'you know', 'i mean', 'so', 'well', 'actually', 'basically', 'literally', 'right', 'okay', 'hmm']);

// Common grammar error patterns
const GRAMMAR_ERRORS = [
  { pattern: /\bi\s+is\b/gi, type: 'subject-verb' },
  { pattern: /\bhe\s+have\b/gi, type: 'subject-verb' },
  { pattern: /\bshe\s+have\b/gi, type: 'subject-verb' },
  { pattern: /\bthey\s+is\b/gi, type: 'subject-verb' },
  { pattern: /\bwe\s+is\b/gi, type: 'subject-verb' },
  { pattern: /\bme\s+and\s+\w+\s+(is|are|was|were)\b/gi, type: 'pronoun' },
  { pattern: /\bdid\s+(\w+)ed\b/gi, type: 'tense' },
  { pattern: /\bmuch\s+(people|things|friends|books)\b/gi, type: 'countable' },
  { pattern: /\bless\s+(people|things|friends|books)\b/gi, type: 'countable' },
  { pattern: /\bmore\s+better\b/gi, type: 'comparative' },
  { pattern: /\bmore\s+easier\b/gi, type: 'comparative' },
  { pattern: /\bthe\s+[bcdfghjklmnpqrstvwxz]+\s+[aeiou]/gi, type: 'article' }, // crude a/an detector
  { pattern: /\ba\s+[aeiou]\w+/gi, type: 'article-a-an' },
  { pattern: /\ban\s+[bcdfghjklmnpqrstvwxyz]\w+/gi, type: 'article-a-an' },
  { pattern: /\bi\s+have\s+go\b/gi, type: 'tense' },
  { pattern: /\bi\s+am\s+go\b/gi, type: 'verb-form' },
];

function detectGrammarErrors(transcript: string): number {
  let count = 0;
  for (const err of GRAMMAR_ERRORS) {
    const matches = transcript.match(err.pattern);
    if (matches) count += matches.length;
  }
  return count;
}

export function analyzeSpeech(
  transcript: string,
  confidenceValues: number[] = [],
  sceneVocab: string[] = [],
): AnalysisResult {
  const words: string[] = transcript.toLowerCase().match(/\b[a-z]+\b/g) || [];
  const wordCount = words.length;
  const uniqueWords = new Set(words);
  const uniqueCount = uniqueWords.size;
  const ttr = wordCount > 0 ? uniqueCount / wordCount : 0;

  // --- Fluency ---
  const avgWPM = wordCount > 0 ? wordCount / 0.75 : 0; // assume 45s avg speech
  const fillerCount = words.filter(w => FILLERS.has(w)).length;
  const fillerRatio = wordCount > 0 ? fillerCount / wordCount : 0;
  const fluencyScore = Math.min(100, Math.round(
    (Math.min(avgWPM, 180) / 180 * 60) +
    ((1 - fillerRatio) * 40)
  ));

  // --- Vocabulary ---
  const cefrLevels: Record<string, number> = {};
  let highLevelCount = 0;
  words.forEach(w => {
    const lvl = getCEFRLevel(w);
    cefrLevels[lvl] = (cefrLevels[lvl] || 0) + 1;
    if (['B2', 'C1'].includes(lvl)) highLevelCount++;
  });
  const sceneVocabUsed = sceneVocab.filter(v => words.includes(v.toLowerCase())).length;
  const vocabScore = Math.min(100, Math.round(
    (Math.min(uniqueCount, 50) / 50 * 30) +
    (ttr * 30) +
    (Math.min(sceneVocabUsed, 5) / 5 * 20) +
    (Math.min(highLevelCount, 10) / 10 * 20)
  ));

  // --- Pronunciation ---
  const avgConfidence = confidenceValues.length > 0
    ? confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length
    : 0.75;
  const pronScore = Math.min(100, Math.round(avgConfidence * 100));

  // --- Grammar ---
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const passiveCount = (transcript.match(/\b(is|are|was|were|been|being)\s+\w+(ed|en|d)\b/gi) || []).length;
  const errorCount = detectGrammarErrors(transcript);
  // Deduct 5 per error, but cap so it doesn't go to 0
  const errorPenalty = Math.min(40, errorCount * 5);
  const grammarScore = Math.max(0, Math.min(100, Math.round(
    (Math.min(avgSentenceLength, 25) / 25 * 35) +
    (sentenceCount >= 2 ? 25 : sentenceCount * 12) +
    (passiveCount > 0 ? Math.min(passiveCount, 3) / 3 * 20 : 10) +
    (10 - errorPenalty / 4)
  )));

  // --- Overall ---
  const overallScore = Math.round(
    fluencyScore * 0.25 + vocabScore * 0.3 + pronScore * 0.25 + grammarScore * 0.2
  );

  const overallLevel = overallScore >= 90 ? 'C2' : overallScore >= 80 ? 'C1' :
    overallScore >= 65 ? 'B2' : overallScore >= 50 ? 'B1' :
    overallScore >= 35 ? 'A2' : 'A1';

  return {
    overall: { score: overallScore, level: overallLevel },
    fluency: {
      score: fluencyScore,
      wpm: Math.round(avgWPM),
      fillerRatio: Math.round(fillerRatio * 100),
      detail: fluencyScore >= 80 ? 'Excellent fluency!' : fluencyScore >= 60 ? 'Good pace, keep it up.' : 'Try slowing down and speaking clearly.',
    },
    vocabulary: {
      score: vocabScore,
      totalWords: wordCount,
      uniqueWords: uniqueCount,
      ttr: Math.round(ttr * 100),
      cefrLevels,
      sceneVocabUsed,
      detail: vocabScore >= 80 ? 'Rich vocabulary!' : vocabScore >= 50 ? 'Good variety of words.' : 'Try using more diverse vocabulary.',
    },
    pronunciation: {
      score: pronScore,
      avgConfidence: Math.round(avgConfidence * 100),
      detail: pronScore >= 90 ? 'Crystal clear!' : pronScore >= 70 ? 'Clear enough for native speakers.' : 'Keep practicing the sounds.',
    },
    grammar: {
      score: grammarScore,
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      sentenceCount,
      errorCount,
      passiveCount,
      detail: grammarScore >= 80 ? 'Strong grammar structure!' : grammarScore >= 60 ? 'Good sentence construction.' : errorCount > 5 ? 'Several grammar errors detected. Try reviewing basics.' : 'Try forming more complete sentences.',
    },
    timestamp: Date.now(),
    transcript,
  };
}

/**
 * Optional: enrich with Claude API for real AI feedback.
 * Requires user to have set apiKey in settings.
 * If fails or no key, returns the basic result.
 */
export async function enrichWithClaude(
  base: AnalysisResult,
  apiKey: string | null,
  scene: string,
): Promise<AnalysisResult> {
  if (!apiKey) return base;
  try {
    const prompt = `You are a friendly English tutor. The user just practiced ${scene} scene. Analyze their transcript and give specific, encouraging feedback in JSON format.

TRANSCRIPT: "${base.transcript}"

LOCAL SCORES:
- Overall: ${base.overall.score}/100 (${base.overall.level})
- Fluency: ${base.fluency.score}/100 (${base.fluency.wpm} wpm, ${base.fluency.fillerRatio}% fillers)
- Vocabulary: ${base.vocabulary.score}/100 (${base.vocabulary.uniqueWords} unique / ${base.vocabulary.totalWords} total)
- Grammar: ${base.grammar.score}/100 (${base.grammar.sentenceCount} sentences, ${base.grammar.errorCount} errors detected)

Respond ONLY with this exact JSON (no markdown):
{"overall_comment":"...","strengths":["...","..."],"improvements":["...","..."],"next_practice":"..."}

Be encouraging, specific, and brief. Reply in ${scene === 'business' || scene === 'interview' ? 'English' : 'the same language as the user\'s transcript (likely English with possible Chinese mix)'}.`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) return base;
    const data = await res.json();
    const text = data.content?.[0]?.text || '';
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      base.aiFeedback = {
        overall_comment: parsed.overall_comment || '',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        next_practice: parsed.next_practice || '',
      };
    }
  } catch (e) {
    // Silently fail — return base result
  }
  return base;
}
