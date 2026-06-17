// services/store.tsx — Global state management with React Context
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SceneId, Difficulty } from './scenarios';
import { Achievement, ACHIEVEMENTS, checkAchievements } from './emotions';
import { AnalysisResult } from './analyzer';

export interface AppState {
  // Scene & difficulty
  scene: SceneId;
  difficulty: Difficulty;

  // Session
  sessionCount: number;
  totalSpeeches: number;
  totalWords: number;

  // Scene-specific counts
  businessCount: number;
  ieltsCount: number;
  dailyCount: number;
  restaurantCount: number;
  interviewCount: number;
  datingCount: number;
  doctorCount: number;

  // Progress
  analysisHistory: AnalysisResult[];
  bestScores: {
    overall: number;
    fluency: number;
    vocabulary: number;
    pronunciation: number;
    grammar: number;
  };
  maxUniqueWords: number;
  bestFluency: number;
  bestPronunciation: number;
  streak: number;
  lastPracticeDate: string | null;

  // Achievements
  unlockedAchievements: string[];

  // XP / Level
  xp: number;
  level: number;

  // Persona
  persona: string;
  voiceSpeed: number;

  // Pet system
  activePet: string;
  petName: string;
  petOutfit: string | null;
  petBackground: string | null;
  petFurniture: string[];
  petCoins: number;
  petHunger: number;
  petIntimacy: number;
  ownedPets: string[];
  ownedItems: string[];

  // UI
  currentChallenge: string | null;
  isRecording: boolean;

  // Personal vocabulary (user-saved words)
  customVocab: VocabItem[];

  // Course progress — tracks completed lessons per course
  courseProgress: { [courseId: string]: { completed: string[]; current: string | null } };

  // Locale (UI language)
  locale: string;
}

export interface VocabItem {
  en: string;
  zh: string;
  context?: string;
  source: 'chat' | 'manual';
  addedAt: number;
}

type Action =
  | { type: 'SET_SCENE'; payload: SceneId }
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'ADD_ANALYSIS'; payload: AnalysisResult }
  | { type: 'SET_RECORDING'; payload: boolean }
  | { type: 'SET_CHALLENGE'; payload: string | null }
  | { type: 'SET_PERSONA'; payload: string }
  | { type: 'SET_VOICE_SPEED'; payload: number }
  | { type: 'SET_XP'; payload: number }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'SELECT_PET'; payload: string }
  | { type: 'SET_PET_NAME'; payload: string }
  | { type: 'BUY_ITEM'; payload: { id: string; cost: number } }
  | { type: 'EQUIP_OUTFIT'; payload: string | null }
  | { type: 'EQUIP_BG'; payload: string | null }
  | { type: 'ADD_FURNITURE'; payload: string }
  | { type: 'ADD_PET_COINS'; payload: number }
  | { type: 'FEED_PET' }
  | { type: 'PLAY_PET' }
  | { type: 'SLEEP_PET' }
  | { type: 'PET_DECAY' }
  | { type: 'ADD_CUSTOM_VOCAB'; payload: { en: string; zh?: string; context?: string; source: 'chat' | 'manual' } }
  | { type: 'REMOVE_CUSTOM_VOCAB'; payload: string }
  | { type: 'COMPLETE_LESSON'; payload: { courseId: string; lessonId: string } }
  | { type: 'SET_CURRENT_LESSON'; payload: { courseId: string; lessonId: string | null } }
  | { type: 'SET_LOCALE'; payload: string }
  | { type: 'RESTORE_STATE'; payload: Partial<AppState> };

const initialState: AppState = {
  scene: 'daily',
  difficulty: 'beginner',
  sessionCount: 0,
  totalSpeeches: 0,
  totalWords: 0,
  businessCount: 0, ieltsCount: 0, dailyCount: 0,
  restaurantCount: 0, interviewCount: 0, datingCount: 0, doctorCount: 0,
  analysisHistory: [],
  bestScores: { overall: 0, fluency: 0, vocabulary: 0, pronunciation: 0, grammar: 0 },
  maxUniqueWords: 0, bestFluency: 0, bestPronunciation: 0,
  streak: 0, lastPracticeDate: null,
  unlockedAchievements: [],
  xp: 0, level: 1,
  persona: 'sarah',
  voiceSpeed: 1.0,
  activePet: 'cat',
  petName: 'Mimi',
  petOutfit: null,
  petBackground: 'garden',
  petFurniture: [],
  petCoins: 100,
  petHunger: 80,
  petIntimacy: 50,
  ownedPets: ['cat'],
  ownedItems: [],
  currentChallenge: null,
  isRecording: false,
  customVocab: [],
  courseProgress: {},
  locale: 'zh-HK',
};

const STORAGE_KEY = '@english_buddy_state';

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SCENE':
      return { ...state, scene: action.payload };
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'SET_CHALLENGE':
      return { ...state, currentChallenge: action.payload };
    case 'SET_PERSONA':
      return { ...state, persona: action.payload };
    case 'SET_VOICE_SPEED':
      return { ...state, voiceSpeed: action.payload };
    case 'ADD_XP': {
      const newXp = state.xp + action.payload;
      const newLevel = Math.floor(newXp / 100) + 1;
      return { ...state, xp: newXp, level: newLevel };
    }
    case 'ADD_ANALYSIS': {
      const a = action.payload;
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = state.lastPracticeDate !== today;
      const newStreak = isNewDay
        ? (state.lastPracticeDate === yesterday(today) ? state.streak + 1 : 1)
        : state.streak;

      const newState = {
        ...state,
        sessionCount: state.sessionCount + 1,
        totalSpeeches: state.totalSpeeches + 1,
        totalWords: state.totalWords + a.vocabulary.totalWords,
        analysisHistory: [...state.analysisHistory.slice(-49), a],
        bestScores: {
          overall: Math.max(state.bestScores.overall, a.overall.score),
          fluency: Math.max(state.bestScores.fluency, a.fluency.score),
          vocabulary: Math.max(state.bestScores.vocabulary, a.vocabulary.score),
          pronunciation: Math.max(state.bestScores.pronunciation, a.pronunciation.score),
          grammar: Math.max(state.bestScores.grammar, a.grammar.score),
        },
        maxUniqueWords: Math.max(state.maxUniqueWords, a.vocabulary.uniqueWords),
        bestFluency: Math.max(state.bestFluency, a.fluency.score),
        bestPronunciation: Math.max(state.bestPronunciation, a.pronunciation.score),
        streak: newStreak,
        lastPracticeDate: today,
        xp: state.xp + 10 + Math.floor(a.overall.score / 10),
      };

      // Check new achievements
      const unlocked = checkAchievements({
        totalSpeeches: newState.totalSpeeches,
        businessCount: state.businessCount,
        ieltsCount: state.ieltsCount,
        dailyCount: state.dailyCount,
        restaurantCount: state.restaurantCount,
        interviewCount: state.interviewCount,
        datingCount: state.datingCount,
        doctorCount: state.doctorCount,
        maxUniqueWords: newState.maxUniqueWords,
        bestFluency: newState.bestFluency,
        bestPronunciation: newState.bestPronunciation,
        streak: newStreak,
      });
      newState.unlockedAchievements = [...new Set([...state.unlockedAchievements, ...unlocked.map(a => a.id)])];

      // Increment scene count
      const sceneKey = state.scene + 'Count' as keyof AppState;
      if (typeof newState[sceneKey] === 'number') {
        (newState as any)[sceneKey] = (state[sceneKey] as number) + 1;
      }

      // Update level
      newState.level = Math.floor(newState.xp / 100) + 1;

      return newState;
    }
    case 'SELECT_PET':
      return { ...state, activePet: action.payload };
    case 'SET_PET_NAME':
      return { ...state, petName: action.payload };
    case 'BUY_ITEM':
      return { ...state, petCoins: state.petCoins - action.payload.cost, ownedItems: [...state.ownedItems, action.payload.id] };
    case 'EQUIP_OUTFIT':
      return { ...state, petOutfit: action.payload };
    case 'EQUIP_BG':
      return { ...state, petBackground: action.payload };
    case 'ADD_FURNITURE':
      return { ...state, petFurniture: [...state.petFurniture, action.payload] };
    case 'ADD_PET_COINS':
      return { ...state, petCoins: Math.max(0, state.petCoins + action.payload) };
    case 'FEED_PET': {
      // Cost 1 coin, +25 hunger (cap 100), +5 intimacy, -10 energy
      return {
        ...state,
        petCoins: Math.max(0, state.petCoins - 1),
        petHunger: Math.min(100, state.petHunger + 25),
        petIntimacy: Math.min(100, state.petIntimacy + 5),
      };
    }
    case 'PLAY_PET': {
      // Cost 1 coin, +15 intimacy, -10 hunger, -5 energy
      return {
        ...state,
        petCoins: Math.max(0, state.petCoins - 1),
        petIntimacy: Math.min(100, state.petIntimacy + 15),
        petHunger: Math.max(0, state.petHunger - 10),
      };
    }
    case 'SLEEP_PET': {
      // Cost 0, restore energy proxy by +20 hunger (energy is derived)
      return {
        ...state,
        petHunger: Math.min(100, state.petHunger + 20),
        petIntimacy: Math.min(100, state.petIntimacy + 2),
      };
    }
    case 'PET_DECAY': {
      // Slow decay: hunger -2, intimacy -1
      return {
        ...state,
        petHunger: Math.max(0, state.petHunger - 2),
        petIntimacy: Math.max(0, state.petIntimacy - 1),
      };
    }
    case 'ADD_CUSTOM_VOCAB': {
      const en = action.payload.en.trim().toLowerCase();
      if (!en) return state;
      // Skip if already in list
      if (state.customVocab.some(v => v.en.toLowerCase() === en)) return state;
      const item: VocabItem = {
        en,
        zh: action.payload.zh || '',
        context: action.payload.context,
        source: action.payload.source,
        addedAt: Date.now(),
      };
      return { ...state, customVocab: [item, ...state.customVocab] };
    }
    case 'REMOVE_CUSTOM_VOCAB':
      return { ...state, customVocab: state.customVocab.filter(v => v.en.toLowerCase() !== action.payload.toLowerCase()) };
    case 'COMPLETE_LESSON': {
      const { courseId, lessonId } = action.payload;
      const existing = state.courseProgress[courseId] || { completed: [], current: null };
      if (existing.completed.includes(lessonId)) return state;
      return {
        ...state,
        courseProgress: {
          ...state.courseProgress,
          [courseId]: {
            completed: [...existing.completed, lessonId],
            current: lessonId,
          },
        },
        xp: state.xp + 5,
      };
    }
    case 'SET_CURRENT_LESSON': {
      const { courseId, lessonId } = action.payload;
      const existing = state.courseProgress[courseId] || { completed: [], current: null };
      return {
        ...state,
        courseProgress: {
          ...state.courseProgress,
          [courseId]: { ...existing, current: lessonId },
        },
      };
    }
    case 'SET_LOCALE':
      return { ...state, locale: action.payload };
    case 'RESTORE_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function yesterday(today: string): string {
  const d = new Date(today);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

const StoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          dispatch({ type: 'RESTORE_STATE', payload: parsed });
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
