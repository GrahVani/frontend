/**
 * Grahvani Learning Runtime — progress store (Zustand + persist).
 *
 * Persists per-lesson:
 *  - attempt history (timestamps + scores)
 *  - the next-attempt-allowed-at timestamp (cooldown enforcement)
 *  - mastery status (Mastered | NotYet | Untouched)
 *  - section-completion state (which §-sections the learner has touched)
 *
 * Persists per-learner (cross-lesson):
 *  - streak day count + last-completed date
 *  - longest streak ever
 *  - total reading-time milliseconds (and per-lesson breakdown)
 *
 * Derives:
 *  - mastered-count, current rank, review deck eligibility
 *
 * Per v0.2 §12.6, cooldown is enforced both client-side (this store) and
 * eventually server-side via learning-service. The client-side enforcement
 * here prevents accidental immediate retries; tampering with localStorage
 * is a non-goal threat model — the server-side check is the real gate.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRankFor, type RankResolution } from "./rank";

export interface AttemptRecord {
  attemptedAt: number;
  scorePct: number;
  passed: boolean;
  wrongQuestionIds: string[];
}

export type MasteryStatus = "Untouched" | "InProgress" | "Mastered" | "OnCooldown";

export interface LessonProgress {
  lessonSlug: string;
  attempts: AttemptRecord[];
  cooldownUntil: number | null;
  masteryStatus: MasteryStatus;
  sectionsViewed: string[];
  lessonCompletedAt: number | null;
}

export interface ReviewDeckItem {
  slug: string;
  lastAttemptedAt: number;
  stalenessMs: number;
  /** Optional href if the caller has it; otherwise the slug is enough to route. */
}

const COOLDOWN_HOURS = 24;
const PASS_THRESHOLD = 0.80;
const REVIEW_STALENESS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface ProgressState {
  // — Per-lesson state —
  lessons: Record<string, LessonProgress>;

  // — Cross-lesson scalar state —
  streakDays: number;
  longestStreak: number;
  /** YYYY-MM-DD of last day a lesson was passed; null if no pass yet. */
  lastCompletedDate: string | null;
  totalTimeMs: number;
  perLessonTimeMs: Record<string, number>;

  // — Selectors —
  getLesson: (slug: string) => LessonProgress | undefined;
  isOnCooldown: (slug: string) => boolean;
  cooldownRemainingMs: (slug: string) => number;
  getMasteredCount: () => number;
  getRank: () => RankResolution;
  getReviewDeck: () => ReviewDeckItem[];
  getReviewDeckCount: () => number;
  getModuleTimeMs: (lessonSlugs: string[]) => number;
  getTotalTimeMs: () => number;
  isLessonLocked: (prerequisiteSlugs: string[]) => boolean;

  // — Actions —
  recordAttempt: (slug: string, scorePct: number, wrongQuestionIds: string[]) => AttemptRecord;
  markSectionViewed: (slug: string, sectionNumber: string) => void;
  accumulateTime: (slug: string, deltaMs: number) => void;
  resetLesson: (slug: string) => void;

  // — Server hydration —
  hydrateFromServer: (payload: ServerHydrationPayload) => void;
}

export interface ServerHydrationPayload {
  lessons: Record<string, LessonProgress>;
  streakDays: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  totalTimeMs: number;
  perLessonTimeMs: Record<string, number>;
}

function ensureLesson(state: ProgressState["lessons"], slug: string): LessonProgress {
  if (!state[slug]) {
    state[slug] = {
      lessonSlug: slug,
      attempts: [],
      cooldownUntil: null,
      masteryStatus: "Untouched",
      sectionsViewed: [],
      lessonCompletedAt: null,
    };
  }
  return state[slug];
}

function todayKey(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function isConsecutiveDay(prevKey: string, todayK: string): boolean {
  const prev = new Date(prevKey + "T00:00:00");
  const today = new Date(todayK + "T00:00:00");
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.round((today.getTime() - prev.getTime()) / dayMs) === 1;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessons: {},
      streakDays: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      totalTimeMs: 0,
      perLessonTimeMs: {},

      getLesson: (slug) => get().lessons[slug],

      isOnCooldown: (slug) => {
        const l = get().lessons[slug];
        if (!l || !l.cooldownUntil) return false;
        return Date.now() < l.cooldownUntil;
      },

      cooldownRemainingMs: (slug) => {
        const l = get().lessons[slug];
        if (!l || !l.cooldownUntil) return 0;
        return Math.max(0, l.cooldownUntil - Date.now());
      },

      getMasteredCount: () => {
        const lessons = get().lessons;
        let n = 0;
        for (const key in lessons) {
          if (lessons[key]?.masteryStatus === "Mastered") n++;
        }
        return n;
      },

      getRank: () => getRankFor(get().getMasteredCount()),

      getReviewDeck: () => {
        const now = Date.now();
        const out: ReviewDeckItem[] = [];
        const lessons = get().lessons;
        for (const slug in lessons) {
          const l = lessons[slug];
          if (!l || l.masteryStatus !== "Mastered" || l.attempts.length === 0) continue;
          const lastAt = l.attempts[l.attempts.length - 1].attemptedAt;
          const staleness = now - lastAt;
          if (staleness >= REVIEW_STALENESS_MS) {
            out.push({ slug, lastAttemptedAt: lastAt, stalenessMs: staleness });
          }
        }
        // Stalest first
        out.sort((a, b) => b.stalenessMs - a.stalenessMs);
        return out;
      },

      getReviewDeckCount: () => get().getReviewDeck().length,

      getModuleTimeMs: (lessonSlugs) => {
        const map = get().perLessonTimeMs;
        let sum = 0;
        for (const slug of lessonSlugs) {
          sum += map[slug] ?? 0;
        }
        return sum;
      },

      getTotalTimeMs: () => get().totalTimeMs,

      isLessonLocked: (prerequisiteSlugs) => {
        // [TEMPORARILY DISABLED FOR TESTING]
        // Uncomment the logic below to re-enable lesson locking.
        return false;
        
        /*
        if (!prerequisiteSlugs || prerequisiteSlugs.length === 0) return false;
        const lessons = get().lessons;
        // If ANY prerequisite is NOT Mastered, the lesson is locked.
        return prerequisiteSlugs.some(slug => {
          const l = lessons[slug];
          return !l || l.masteryStatus !== "Mastered";
        });
        */
      },

      recordAttempt: (slug, scorePct, wrongQuestionIds) => {
        const passed = scorePct >= PASS_THRESHOLD * 100;
        const now = Date.now();
        const record: AttemptRecord = {
          attemptedAt: now,
          scorePct,
          passed,
          wrongQuestionIds,
        };
        set((state) => {
          const lessons = { ...state.lessons };
          const lesson = { ...ensureLesson(lessons, slug) };
          lesson.attempts = [...lesson.attempts, record];

          let { streakDays, longestStreak, lastCompletedDate } = state;

          if (passed) {
            lesson.masteryStatus = "Mastered";
            lesson.cooldownUntil = null;
            lesson.lessonCompletedAt = lesson.lessonCompletedAt ?? now;

            // Streak update — only on a successful pass.
            const today = todayKey();
            if (lastCompletedDate === today) {
              // Same day; nothing changes.
            } else if (lastCompletedDate && isConsecutiveDay(lastCompletedDate, today)) {
              streakDays = streakDays + 1;
            } else {
              streakDays = 1;
            }
            longestStreak = Math.max(longestStreak, streakDays);
            lastCompletedDate = today;
          } else {
            // If already mastered, don't penalize practice attempts
            if (lesson.masteryStatus !== "Mastered") {
              lesson.masteryStatus = "OnCooldown";
              
              const failCount = lesson.attempts.filter(a => !a.passed).length;
              let cooldownMs = 15 * 60 * 1000; // 15 mins
              if (failCount === 2) {
                cooldownMs = 8 * 60 * 60 * 1000; // 8 hours
              } else if (failCount >= 3) {
                cooldownMs = 24 * 60 * 60 * 1000; // 24 hours
              }
              
              lesson.cooldownUntil = now + cooldownMs;
            }
          }
          lessons[slug] = lesson;
          return { lessons, streakDays, longestStreak, lastCompletedDate };
        });
        return record;
      },

      markSectionViewed: (slug, sectionNumber) => {
        set((state) => {
          const lessons = { ...state.lessons };
          const lesson = { ...ensureLesson(lessons, slug) };
          if (!lesson.sectionsViewed.includes(sectionNumber)) {
            lesson.sectionsViewed = [...lesson.sectionsViewed, sectionNumber];
            if (lesson.masteryStatus === "Untouched") {
              lesson.masteryStatus = "InProgress";
            }
          }
          lessons[slug] = lesson;
          return { lessons };
        });
      },

      accumulateTime: (slug, deltaMs) => {
        if (!Number.isFinite(deltaMs) || deltaMs <= 0) return;
        set((state) => {
          const perLessonTimeMs = { ...state.perLessonTimeMs };
          perLessonTimeMs[slug] = (perLessonTimeMs[slug] ?? 0) + deltaMs;
          return {
            perLessonTimeMs,
            totalTimeMs: state.totalTimeMs + deltaMs,
          };
        });
      },

      resetLesson: (slug) => {
        set((state) => {
          const lessons = { ...state.lessons };
          delete lessons[slug];
          const perLessonTimeMs = { ...state.perLessonTimeMs };
          const subtract = perLessonTimeMs[slug] ?? 0;
          delete perLessonTimeMs[slug];
          return {
            lessons,
            perLessonTimeMs,
            totalTimeMs: Math.max(0, state.totalTimeMs - subtract),
          };
        });
      },

      hydrateFromServer: (payload) => {
        // Server is source of truth — but we preserve any locally-pending writes
        // for lessons whose local lastAttempt is more recent than the server's.
        // (For lessons present only locally, we keep them — they'll flush on next mutation.)
        set((state) => {
          const merged: Record<string, LessonProgress> = { ...payload.lessons };
          for (const slug in state.lessons) {
            const local = state.lessons[slug];
            const server = merged[slug];
            if (!server) {
              merged[slug] = local;
              continue;
            }
            const localLast = local.attempts.length ? local.attempts[local.attempts.length - 1].attemptedAt : 0;
            const serverLast = server.attempts.length ? Number(server.attempts[server.attempts.length - 1].attemptedAt) : 0;
            if (localLast > serverLast) {
              // Local has a newer attempt the server hasn't recorded yet — keep local.
              merged[slug] = local;
            }
          }
          // Time is additive — take max of local and server per lesson so we never
          // lose dwell time accumulated offline.
          const perLessonTimeMs: Record<string, number> = { ...payload.perLessonTimeMs };
          for (const slug in state.perLessonTimeMs) {
            const local = state.perLessonTimeMs[slug] ?? 0;
            const server = perLessonTimeMs[slug] ?? 0;
            perLessonTimeMs[slug] = Math.max(local, server);
          }
          const totalTimeMs = Math.max(payload.totalTimeMs, state.totalTimeMs);
          return {
            lessons: merged,
            streakDays: payload.streakDays,
            longestStreak: Math.max(payload.longestStreak, state.longestStreak),
            lastCompletedDate: payload.lastCompletedDate,
            totalTimeMs,
            perLessonTimeMs,
          };
        });
      },
    }),
    {
      name: "grahvani-learning-progress",
      version: 2,
      // Migrate v1 → v2: hydrate the new fields if they aren't present.
      migrate: (persistedState: unknown, version: number) => {
        if (version < 2 && persistedState && typeof persistedState === "object") {
          const s = persistedState as Partial<ProgressState> & Record<string, unknown>;
          return {
            ...s,
            streakDays: typeof s.streakDays === "number" ? s.streakDays : 0,
            longestStreak: typeof s.longestStreak === "number" ? s.longestStreak : 0,
            lastCompletedDate: typeof s.lastCompletedDate === "string" ? s.lastCompletedDate : null,
            totalTimeMs: typeof s.totalTimeMs === "number" ? s.totalTimeMs : 0,
            perLessonTimeMs: (s.perLessonTimeMs && typeof s.perLessonTimeMs === "object" ? s.perLessonTimeMs : {}) as Record<string, number>,
          };
        }
        return persistedState as ProgressState;
      },
    },
  ),
);

export { COOLDOWN_HOURS, PASS_THRESHOLD, REVIEW_STALENESS_MS };
