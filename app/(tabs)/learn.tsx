import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
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

const TYPE_ICON: Record<string, string> = {
  reading: '',
  speaking: '',
  vocab: '',
  quiz: '',
  listening: '',
};

const TYPE_LABEL: Record<string, string> = {
  reading: '閱讀',
  speaking: '口說',
  vocab: '詞彙',
  quiz: '測驗',
  listening: '聽力',
};

type View = 'list' | 'course' | 'lesson';

export default function LearnScreen() {
  const { state, dispatch } = useStore();
  const [view, setView] = useState<View>('list');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

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
    if (view === 'lesson') setView('course');
    else if (view === 'course') { setView('list'); setActiveCourse(null); }
  };
  const completeLesson = () => {
    if (activeCourse && activeLesson) {
      dispatch({ type: 'COMPLETE_LESSON', payload: { courseId: activeCourse.id, lessonId: activeLesson.id } });
    }
  };

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
            {/* Title */}
            <View style={s.titleRow}>
              <View style={s.titleIcon}>
                <Image source={LEARN_ICON} style={{ width: 32, height: 32 }} resizeMode="contain" />
              </View>
              <Text style={[s.title, FX]}>Learn</Text>
            </View>

            {/* Progress summary */}
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

            {/* Course list */}
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
                    {c.icon ? (
                      <View style={s.courseIcon}>
                        <Text style={s.courseIconTxt}>{c.icon}</Text>
                      </View>
                    ) : null}
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
                  {/* Progress bar */}
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
              {activeCourse.icon ? (
                <Text style={s.heroIcon}>{activeCourse.icon}</Text>
              ) : null}
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
                {TYPE_ICON[activeLesson.type] ? (
                  <Text style={s.heroIcon}>{TYPE_ICON[activeLesson.type]}</Text>
                ) : null}
                <View style={{ flex: 1 }}>
                  <Text style={s.lessonBreadcrumb}>
                    {activeCourse.titleEn} · {TYPE_LABEL[activeLesson.type]} · {activeLesson.minutes} 分鐘
                  </Text>
                  <Text style={[s.heroTitle, FX]}>{activeLesson.title}</Text>
                </View>
              </View>
            </View>

            {/* Content */}
            <View style={s.contentCard}>
              <Text style={s.contentTxt}>{activeLesson.content}</Text>
            </View>

            {/* Vocab */}
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

            {/* Practice */}
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

            {/* Complete button */}
            <TouchableOpacity
              style={[
                s.completeBtn,
                state.courseProgress[activeCourse.id]?.completed.includes(activeLesson.id) && s.completeBtnDone
              ]}
              onPress={completeLesson}
              activeOpacity={0.85}
            >
              <Text style={s.completeBtnTxt}>
                {state.courseProgress[activeCourse.id]?.completed.includes(activeLesson.id) ? '已完成 +5 XP' : '標記為完成 +5 XP'}
              </Text>
            </TouchableOpacity>
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
  courseIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: PINK_SOFT,
    alignItems: 'center', justifyContent: 'center',
  },
  courseIconTxt: { fontSize: 26 },
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
  heroIcon: { fontSize: 56, marginBottom: 10 },
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
  lessonCheck: { fontSize: 14, color: '#7ec48b', fontWeight: '800' },
  lessonNow: { fontSize: 9, color: PINK, fontWeight: '800', backgroundColor: PINK_SOFT, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lessonType: { fontSize: 11, color: SUBINK, fontWeight: '600' },
  lessonTime: { fontSize: 11, color: MUTED, fontWeight: '500' },

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

  completeBtn: {
    backgroundColor: PINK,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  completeBtnDone: { backgroundColor: '#7ec48b' },
  completeBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
