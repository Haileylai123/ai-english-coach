// services/srs.ts — Spaced Repetition System helpers
// SuperMemo SM-2 algorithm — quality scale 0-5

export interface SRSEntry {
  ef: number;       // ease factor (default 2.5, min 1.3)
  interval: number; // days until next review
  reps: number;     // successful reviews in a row
  due: string;      // YYYY-MM-DD
  lastReview: number | null;
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isDue(entry: SRSEntry, now: string = todayStr()): boolean {
  return entry.due <= now;
}

export function isOverdue(entry: SRSEntry, now: string = todayStr()): boolean {
  return entry.due < now;
}

export function daysOverdue(entry: SRSEntry, now: string = todayStr()): number {
  const a = new Date(entry.due).getTime();
  const b = new Date(now).getTime();
  return Math.max(0, Math.floor((b - a) / (1000 * 60 * 60 * 24)));
}

export function nextReviewDate(ef: number, interval: number, reps: number, quality: number): { newInterval: number; newEf: number; newReps: number; due: string } {
  let newEf = ef;
  let newInterval: number;
  let newReps: number;
  if (quality < 3) {
    newReps = 0;
    newInterval = 1;
  } else {
    if (reps === 0) newInterval = 1;
    else if (reps === 1) newInterval = 6;
    else newInterval = Math.round(interval * ef);
    newReps = reps + 1;
  }
  newEf = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  const d = new Date();
  d.setDate(d.getDate() + newInterval);
  return { newInterval, newEf, newReps, due: d.toISOString().slice(0, 10) };
}

/** Quality scale mapping from button taps */
export const QUALITY = {
  AGAIN: 1,   // forgot
  HARD: 3,    // remembered with effort
  GOOD: 4,    // remembered correctly
  EASY: 5,    // remembered easily
} as const;
