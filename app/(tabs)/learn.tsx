import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import { COURSES, Course, Lesson } from '../../services/courses';
import { useStore } from '../../services/store';

const LEARN_ICON = require('../../assets/icons/stat-medal.png');

const { width: W } = Dimensions.get('window');
const F = { fontFamily: 'Nunito_400Regular' };
const FB = { fontFamily: 'Nunito_700Bold' };
const FX = { fontFamily: 'Nunito_800ExtraBold' };

// Pink / coral palette
const PINK = '#e8927f';
const PINK_SOFT = '#fbe4dc';
const CREAM = '#fdf2ec';
const INK = '#3d3028';
const SUBINK = '#7a6a5e';
const MUTED = '#b8a89a';
const GREEN = '#7ec48b';

const LEVEL_COLOR: Record<string, string> = {
  beginner: '#7ec48b',
  intermediate: '#f0a96e',
  advanced: '#a888e0',
};

const LEVEL_LABEL: Record<string, string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '高級',
};

const TYPE_LABEL: Record<string, string> = {
  reading: '閱讀',
  speaking: '口說',
  vocab: '詞彙',
  quiz: '測驗',
  listening: '聽力',
};

type LearnView = 'list' | 'course' | 'lesson' | 'quiz' | 'quizResult';

export default function LearnScreen() {
  const { state, dispatch } = useStore();
  const [view, setView] = useState<LearnView>('list');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Stats
  const totalCourses = COURSES.length;
  const totalLessons = COURSES.reduce((sum, c) => sum + c.lessons.length, 0);
  const completedLessons = Object.values(state.courseProgress).reduce((s, p) => s + p.completed.length, 0);

  const goToCourse = (c: Course) => {
    setActiveCourse(c);
    setView('course');
  };
  const goToLesson = (l: Lesson) => {
    setActiveLesson(l);
    setView('lesson');
    if (activeCourse) {
      dispatch({ type: 'SET_CURRENT_LESSON', payload: { courseId: activeCourse.id, lessonId: l.id } });
    }
  };
  const back = () => {
    if (view === 'quiz' || view === 'quizResult') {
      setView('lesson');
      setQuizAnswers([]);
      setQuizSubmitted(false);
    } else if (view === 'lesson') setView('course');
    else if (view === 'course') { setView('list'); setActiveCourse(null); }
  };
  const completeLesson = () => {
    if (activeCourse && activeLesson) {
      dispatch({ type: 'COMPLETE_LESSON', payload: { courseId: activeCourse.id, lessonId: activeLesson.id } });
    }
  };

  const startQuiz = () => {
    if (!activeLesson) return;
    setQuizAnswers(new Array(activeLesson.quiz.length).fill(-1));
    setQuizSubmitted(false);
    setView('quiz');
  };

  const submitQuiz = () => {
    if (!activeLesson) return;
    if (quizAnswers.some(a => a < 0)) {
      Alert.alert('請答晒所有題', '答完所有問題先交卷');
      return;
    }
    setQuizSubmitted(true);
    setView('quizResult');
  };

  const quizScore = useMemo(() => {
    if (!activeLesson || !quizSubmitted) return 0;
    return activeLesson.quiz.reduce((s, q, i) => s + (quizAnswers[i] === q.ans ? 1 : 0), 0);
  }, [activeLesson, quizAnswers, quizSubmitted]);

  const quizPass = quizSubmitted && activeLesson ? quizScore >= Math.ceil(activeLesson.quiz.length * 0.6) : false;

  return (
    <View style={s.root}>
      {view !== 'list' && (
        <TouchableOpacity style={s.backBtn} onPress={back} activeOpacity={0.85}>
          <Text style={s.backTxt}>← 返回</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {view === 'list' && (
          <>
            <View style={s.titleRow}>
              <View style={s.titleIcon}>
                <Image source={LEARN_ICON} style={{ width: 32, height: 32 }} resizeMode="contain" />
              </View>
              <Text style={[s.title, FX]}>Learn</Text>
            </View>

            <View style={s.summaryCard}>
              <View style={s.summaryItem}>
                <Text style={[s.summaryNum, FX]}>{totalCourses}</Text>
                <Text style={s.summaryLab}>課程</Text>
              </View>
              <View style={s.summaryDiv} />
              <View style={s.summaryItem}>
                <Text style={[s.summaryNum, FX]}>{totalLessons}</Text>
                <Text style={s.summaryLab}>課堂</Text>
              </View>
              <View style={s.summaryDiv} />
              <View style={s.summaryItem}>
                <Text style={[s.summaryNum, FX, { color: PINK }]}>{completedLessons}</Text>
                <Text style={s.summaryLab}>完成</Text>
              </View>
            </View>

            <Text style={s.section}>所有課程</Text>
            {COURSES.map(c => {
              const prog = state.courseProgress[c.id] || { completed: [], current: null };
              const pct = Math.round((prog.completed.length / c.lessons.length) * 100);
              return (
                <TouchableOpacity
                  key={c.id}
                  style={s.courseCard}
                  onPress={() => goToCourse(c)}
                  activeOpacity={0.85}
                >
                  <View style={s.courseHead}>
                    <View style={{ flex: 1 }}>
                      <View style={s.courseTitleRow}>
                        <Text style={[s.courseTitle, FB]}>{c.titleEn}</Text>
                        <View style={[s.levelPill, { backgroundColor: LEVEL_COLOR[c.level] + '22' }]}>
                          <Text style={[s.levelTxt, { color: LEVEL_COLOR[c.level] }]}>{LEVEL_LABEL[c.level]}</Text>
                        </View>
                      </View>
                      <Text style={s.courseDesc} numberOfLines={2}>{c.desc}</Text>
                    </View>
                  </View>
                  <View style={s.progBarBg}>
                    <View style={[s.progBarFill, { width: `${pct}%` }]} />
                  </View>
                  <View style={s.courseFoot}>
                    <Text style={s.courseFootTxt}>{c.lessons.length} 課堂 · {prog.completed.length} 已完成</Text>
                    {prog.current && pct < 100 && (
                      <Text style={s.continueTxt}>繼續</Text>
                    )}
                    {pct === 100 && <Text style={s.doneTxt}>完成</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {view === 'course' && activeCourse && (
          <>
            <View style={s.courseHero}>
              <Text style={[s.heroTitle, FX]}>{activeCourse.titleEn}</Text>
              <Text style={s.heroDesc}>{activeCourse.desc}</Text>
              <View style={[s.levelPill, { backgroundColor: LEVEL_COLOR[activeCourse.level] + '22', alignSelf: 'center', marginTop: 8 }]}>
                <Text style={[s.levelTxt, { color: LEVEL_COLOR[activeCourse.level] }]}>{LEVEL_LABEL[activeCourse.level]}</Text>
              </View>
            </View>

            <Text style={s.section}>課堂列表</Text>
            {activeCourse.lessons.map((l, i) => {
              const prog = state.courseProgress[activeCourse.id] || { completed: [], current: null };
              const done = prog.completed.includes(l.id);
              const current = prog.current === l.id && !done;
              return (
                <TouchableOpacity
                  key={l.id}
                  style={[s.lessonCard, done && s.lessonDone]}
                  onPress={() => goToLesson(l)}
                  activeOpacity={0.85}
                >
                  <View style={s.lessonNum}>
                    <Text style={s.lessonNumTxt}>{i + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={s.lessonTitleRow}>
                      <Text style={[s.lessonTitle, FB]} numberOfLines={1}>{l.title}</Text>
                      {current && <Text style={s.lessonNow}>進行中</Text>}
                    </View>
                    <View style={s.lessonMeta}>
                      <Text style={s.lessonType}>{TYPE_LABEL[l.type]}</Text>
                      <Text style={s.lessonTime}>· {l.minutes} 分鐘</Text>
                      {l.quiz.length > 0 && <Text style={s.lessonQuiz}>· 測驗 {l.quiz.length} 題</Text>}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {view === 'lesson' && activeLesson && activeCourse && (
          <>
            <View style={s.lessonHero}>
              <View style={s.lessonHeroTop}>
                <View style={{ flex: 1 }}>
                  <Text style={s.lessonBreadcrumb}>
                    {activeCourse.titleEn} · {TYPE_LABEL[activeLesson.type]} · {activeLesson.minutes} 分鐘
                  </Text>
                  <Text style={[s.heroTitle, FX]}>{activeLesson.title}</Text>
                </View>
              </View>
            </View>

            <View style={s.contentCard}>
              <Text style={s.contentTxt}>{activeLesson.content}</Text>
            </View>

            {activeLesson.vocab.length > 0 && (
              <View style={s.vocabCard}>
                <Text style={s.vocabTitle}>關鍵詞彙</Text>
                {activeLesson.vocab.map((v, i) => (
                  <View key={i} style={s.vocabRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.vocabEn}>{v.en}</Text>
                      {v.example && <Text style={s.vocabEx}>"{v.example}"</Text>}
                    </View>
                    <Text style={s.vocabZh}>{v.zh}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeLesson.practice && (
              <View style={s.practiceCard}>
                <Text style={s.practiceTitle}>練習 Practice</Text>
                <Text style={s.practicePrompt}>{activeLesson.practice.prompt}</Text>
                <Text style={s.practiceZh}>{activeLesson.practice.zh}</Text>
                {activeLesson.practice.hint && (
                  <View style={s.hintBox}>
                    <Text style={s.hintLab}>提示 Hint：</Text>
                    <Text style={s.hintTxt}>{activeLesson.practice.hint}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Quiz prompt — required before complete */}
            {activeLesson.quiz.length > 0 && (() => {
              const isDone = state.courseProgress[activeCourse.id]?.completed.includes(activeLesson.id);
              return (
                <View style={s.quizPromptCard}>
                  <View style={s.quizPromptHead}>
                    <Text style={s.quizPromptIcon}>📝</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={s.quizPromptTitle}>課堂測驗</Text>
                      <Text style={s.quizPromptDesc}>{activeLesson.quiz.length} 題選擇題 · 答對 60% 先可以完成</Text>
                    </View>
                  </View>
                  {isDone ? (
                    <View style={s.quizPassedRow}>
                      <Text style={s.quizPassedTxt}>已通過測驗</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={s.quizStartBtn} onPress={startQuiz} activeOpacity={0.85}>
                      <Text style={s.quizStartBtnTxt}>開始測驗</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })()}

            {/* Complete button — only enabled if lesson is already completed */}
            {state.courseProgress[activeCourse.id]?.completed.includes(activeLesson.id) && (
              <View style={s.completeBtnDoneRow}>
                <Text style={s.completeBtnDoneTxt}>已通過 +5 XP</Text>
              </View>
            )}
          </>
        )}

        {/* QUIZ IN PROGRESS */}
        {view === 'quiz' && activeLesson && (
          <>
            <View style={s.quizHeader}>
              <Text style={s.quizEyebrow}>課堂測驗</Text>
              <Text style={[s.quizTitle, FX]}>{activeLesson.title}</Text>
              <Text style={s.quizSub}>共 {activeLesson.quiz.length} 題 · 答對 60% 先可以完成</Text>
            </View>
            {activeLesson.quiz.map((q, i) => (
              <View key={i} style={s.qCard}>
                <View style={s.qHead}>
                  <View style={s.qNum}><Text style={s.qNumTxt}>{i + 1}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.qTxt}>{q.q}</Text>
                    <Text style={s.qZh}>{q.qZh}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 10 }}>
                  {q.opts.map((opt, j) => {
                    const sel = quizAnswers[i] === j;
                    return (
                      <TouchableOpacity
                        key={j}
                        style={[s.optRow, sel && s.optRowOn]}
                        onPress={() => {
                          setQuizAnswers(prev => prev.map((v, k) => k === i ? j : v));
                        }}
                        activeOpacity={0.85}
                      >
                        <View style={[s.optDot, sel && s.optDotOn]}>
                          {sel && <Text style={s.optDotCheck}>✓</Text>}
                        </View>
                        <Text style={[s.optTxt, sel && s.optTxtOn]}>{opt}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
            <TouchableOpacity style={s.submitBtn} onPress={submitQuiz} activeOpacity={0.85}>
              <Text style={s.submitBtnTxt}>交卷</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </>
        )}

        {/* QUIZ RESULT */}
        {view === 'quizResult' && activeLesson && (
          <>
            <View style={s.resultCard}>
              <Text style={s.resultIcon}>{quizPass ? '🎉' : '😅'}</Text>
              <Text style={[s.resultTitle, FX]}>
                {quizPass ? '恭喜通過！' : '未通過'}
              </Text>
              <Text style={s.resultScore}>
                {quizScore} / {activeLesson.quiz.length}
              </Text>
              <Text style={s.resultMsg}>
                {quizPass
                  ? `你答對咗 ${Math.round((quizScore / activeLesson.quiz.length) * 100)}% ，可以拎到 5 XP`
                  : `需要答對至少 ${Math.ceil(activeLesson.quiz.length * 0.6)} 題先可以通過`}
              </Text>
            </View>

            {/* Show review */}
            <Text style={s.section}>答案解析</Text>
            {activeLesson.quiz.map((q, i) => {
              const userAns = quizAnswers[i];
              const correct = userAns === q.ans;
              return (
                <View key={i} style={[s.reviewCard, correct ? s.reviewOk : s.reviewBad]}>
                  <View style={s.reviewHead}>
                    <Text style={s.reviewNum}>{i + 1}</Text>
                    <Text style={s.reviewIcon}>{correct ? '✅' : '❌'}</Text>
                    <Text style={s.reviewQ}>{q.q}</Text>
                  </View>
                  {!correct && (
                    <Text style={s.reviewUser}>你揀咗：{q.opts[userAns] ?? '—'}</Text>
                  )}
                  <Text style={s.reviewAns}>正確：{q.opts[q.ans]}</Text>
                  {q.explain && <Text style={s.reviewExplain}>💡 {q.explain}</Text>}
                </View>
              );
            })}

            {quizPass ? (
              <TouchableOpacity
                style={s.claimBtn}
                onPress={() => { completeLesson(); back(); }}
                activeOpacity={0.85}
              >
                <Text style={s.claimBtnTxt}>拎 5 XP ✓</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={s.retryBtn}
                onPress={startQuiz}
                activeOpacity={0.85}
              >
                <Text style={s.retryBtnTxt}>再試一次</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={s.backLinkBtn} onPress={back} activeOpacity={0.85}>
              <Text style={s.backLinkTxt}>返去課堂</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const SIDE_PAD = 20;
const CARD_GAP = 12;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  content: { paddingTop: 60, paddingHorizontal: SIDE_PAD, paddingBottom: 20 },
  backBtn: {
    position: 'absolute',
    top: 18, left: 16,
    zIndex: 10,
    padding: 8,
  },
  backTxt: { fontSize: 15, color: PINK, fontWeight: '700' },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 10,
  },
  titleIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: PINK_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 30, color: PINK, letterSpacing: 0.3 },

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    alignItems: 'center',
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDiv: { width: 1, height: 30, backgroundColor: '#f0e0d0' },
  summaryNum: { fontSize: 24, color: INK, marginBottom: 2 },
  summaryLab: { fontSize: 11, color: MUTED, fontWeight: '600' },

  section: {
    fontSize: 18,
    color: PINK,
    marginBottom: 12,
    marginTop: 4,
    fontWeight: '800',
  },

  // Course card
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  courseHead: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
  courseTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8, flexWrap: 'wrap' },
  courseTitle: { fontSize: 16, color: INK },
  levelPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  levelTxt: { fontSize: 10, fontWeight: '800' },
  courseDesc: { fontSize: 12, color: SUBINK, lineHeight: 17 },
  progBarBg: { height: 6, backgroundColor: '#f0e0d0', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progBarFill: { height: '100%', backgroundColor: PINK, borderRadius: 3 },
  courseFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courseFootTxt: { fontSize: 11, color: MUTED, fontWeight: '600' },
  continueTxt: { fontSize: 12, color: PINK, fontWeight: '800' },
  doneTxt: { fontSize: 12, color: '#7ec48b', fontWeight: '800' },

  // Course hero
  courseHero: { alignItems: 'center', marginBottom: 18 },
  heroTitle: { fontSize: 24, color: INK, textAlign: 'center', marginBottom: 6 },
  heroDesc: { fontSize: 13, color: SUBINK, textAlign: 'center', lineHeight: 19, paddingHorizontal: 12 },

  // Lesson card
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  lessonDone: { backgroundColor: '#f0f9f1', borderWidth: 1, borderColor: '#c8e6c9' },
  lessonNum: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: PINK_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  lessonNumTxt: { fontSize: 14, color: PINK, fontWeight: '800' },
  lessonTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' },
  lessonTitle: { fontSize: 14, color: INK, flex: 1 },
  lessonNow: { fontSize: 9, color: PINK, fontWeight: '800', backgroundColor: PINK_SOFT, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  lessonType: { fontSize: 11, color: SUBINK, fontWeight: '600' },
  lessonTime: { fontSize: 11, color: MUTED, fontWeight: '500' },
  lessonQuiz: { fontSize: 11, color: PINK, fontWeight: '700' },

  // Lesson view
  lessonHero: { marginBottom: 14 },
  lessonHeroTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lessonBreadcrumb: { fontSize: 11, color: MUTED, fontWeight: '600', marginBottom: 4 },

  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  contentTxt: { fontSize: 14, color: INK, lineHeight: 23, fontWeight: '500' },

  vocabCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  vocabTitle: { fontSize: 14, color: PINK, fontWeight: '800', marginBottom: 10 },
  vocabRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5e8de',
    gap: 8,
  },
  vocabEn: { fontSize: 14, color: INK, fontWeight: '700', marginBottom: 2 },
  vocabEx: { fontSize: 11, color: SUBINK, fontStyle: 'italic' },
  vocabZh: { fontSize: 13, color: PINK, fontWeight: '700' },

  practiceCard: {
    backgroundColor: PINK_SOFT,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  practiceTitle: { fontSize: 14, color: PINK, fontWeight: '800', marginBottom: 8 },
  practicePrompt: { fontSize: 14, color: INK, lineHeight: 21, fontWeight: '600', marginBottom: 6 },
  practiceZh: { fontSize: 12, color: SUBINK, lineHeight: 18, marginBottom: 10 },
  hintBox: { backgroundColor: '#fff', borderRadius: 10, padding: 10 },
  hintLab: { fontSize: 11, color: PINK, fontWeight: '800', marginBottom: 2 },
  hintTxt: { fontSize: 12, color: INK, fontStyle: 'italic', lineHeight: 18 },

  // Quiz prompt card (on lesson view)
  quizPromptCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: PINK_SOFT,
  },
  quizPromptHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  quizPromptIcon: { fontSize: 24 },
  quizPromptTitle: { fontSize: 15, color: INK, fontWeight: '800' },
  quizPromptDesc: { fontSize: 12, color: SUBINK, fontWeight: '500', marginTop: 2 },
  quizStartBtn: {
    backgroundColor: PINK,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  quizStartBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '800' },
  quizPassedRow: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  quizPassedTxt: { color: GREEN, fontSize: 13, fontWeight: '800' },

  completeBtnDoneRow: {
    backgroundColor: '#e8f5e9',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  completeBtnDoneTxt: { color: GREEN, fontSize: 14, fontWeight: '800' },

  // QUIZ
  quizHeader: { marginBottom: 16, alignItems: 'center' },
  quizEyebrow: { fontSize: 11, color: MUTED, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  quizTitle: { fontSize: 22, color: INK, textAlign: 'center', marginBottom: 6 },
  quizSub: { fontSize: 12, color: SUBINK, fontWeight: '600' },

  qCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  qHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  qNum: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: PINK, alignItems: 'center', justifyContent: 'center',
  },
  qNumTxt: { color: '#fff', fontSize: 13, fontWeight: '800' },
  qTxt: { fontSize: 14, color: INK, fontWeight: '700', lineHeight: 20 },
  qZh: { fontSize: 12, color: SUBINK, fontWeight: '500', marginTop: 2 },

  optRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fdf6f1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 10,
  },
  optRowOn: { backgroundColor: PINK_SOFT, borderColor: PINK },
  optDot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#fff', borderWidth: 2, borderColor: '#e0d0c0',
    alignItems: 'center', justifyContent: 'center',
  },
  optDotOn: { backgroundColor: PINK, borderColor: PINK },
  optDotCheck: { color: '#fff', fontSize: 13, fontWeight: '800' },
  optTxt: { flex: 1, fontSize: 14, color: INK, fontWeight: '500' },
  optTxtOn: { color: PINK, fontWeight: '700' },

  submitBtn: {
    backgroundColor: PINK,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // QUIZ RESULT
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  resultIcon: { fontSize: 50, marginBottom: 8 },
  resultTitle: { fontSize: 22, color: INK, marginBottom: 4 },
  resultScore: { fontSize: 36, color: PINK, fontWeight: '800', marginBottom: 6 },
  resultMsg: { fontSize: 13, color: SUBINK, textAlign: 'center', lineHeight: 19 },

  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  reviewOk: { borderLeftColor: GREEN },
  reviewBad: { borderLeftColor: '#e57373' },
  reviewHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 4 },
  reviewNum: { fontSize: 12, color: PINK, fontWeight: '800' },
  reviewIcon: { fontSize: 12 },
  reviewQ: { flex: 1, fontSize: 13, color: INK, fontWeight: '600' },
  reviewUser: { fontSize: 12, color: '#e57373', fontWeight: '600', marginTop: 4 },
  reviewAns: { fontSize: 12, color: GREEN, fontWeight: '700', marginTop: 2 },
  reviewExplain: { fontSize: 12, color: SUBINK, fontStyle: 'italic', marginTop: 4 },

  claimBtn: {
    backgroundColor: GREEN,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  claimBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },
  retryBtn: {
    backgroundColor: PINK,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  retryBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },
  backLinkBtn: { paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  backLinkTxt: { color: MUTED, fontSize: 13, fontWeight: '700' },
});
