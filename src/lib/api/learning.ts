/**
 * Learning-service API client — VERIFIED contracts (smoke-tested 2026-05-22).
 *
 * Endpoint shapes match the live `learning-service` running at :3013.
 * Routes proxied via api-gateway in production at /api/v1/learn/*.
 *
 *   GET  /learn/dashboard?userId=...                  → DashboardPayload
 *   GET  /learn/lessons/:slug/quiz                    → QuizPayload
 *   POST /learn/lessons/:slug/submit                  → SubmitResult
 *        body: { userId, answers: [{ questionId, answer, timeSpentSeconds }] }
 *   POST /learn/lessons/:slug/section-view            → LessonProgressRow
 *        body: { userId, sectionId: number }
 *   GET  /learn/sr/today?userId=...                   → { cards, stats }
 *   POST /learn/sr/:cardId/review                     → { nextDueAt, intervalDays }
 *   GET  /learn/gamification/streak/:userId           → StreakPayload
 *   GET  /learn/gamification/badges/:userId           → BadgesPayload
 *   GET  /learn/gamification/profile/:userId          → GamificationProfile
 *   POST /learn/gamification/daily/login/:userId      → DailyLoginResult
 */

import { apiFetch } from "./core";

const LEARNING_BASE =
  process.env.NEXT_PUBLIC_LEARNING_SERVICE_URL ||
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ||
  "http://localhost:3013/api/v1";

/* ─────────────────────────  Type contracts (verified)  ───────────────── */

export interface DashboardPayload {
  lessonsCompleted: number;
  attemptedLessons: number;
  totalLessons: number;
  averageScore: number;
  overallProgress: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  skillScore: number;
  currentTier: number;
  title: string;
  nextTierProgress: number;
  nextTierThreshold: number;
  prevTierThreshold: number;
  pointsToNextTier: number;
  totalModulesCompleted: number;
  perfectLessons: number;
  tierThresholds: number[];
  tierNames: Record<string, string>;
  badges: { earned: BadgeRecord[]; upcoming: BadgeRecord[] };
  progress: LessonProgressRow[];
}

export interface BadgeRecord {
  id?: string;
  code?: string;
  slug?: string;
  name: string;
  description?: string;
  rarity?: string;
  iconUrl?: string | null;
  earnedAt?: string | null;
  progress?: number; // 0-100 for upcoming
  requirement?: string;
}

export interface LessonProgressRow {
  id?: string;
  userId?: string;
  lessonId: string;
  lessonSlug?: string;
  moduleId?: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "MASTERED";
  completionPercentage?: number;
  score?: number;
  questionsAttempted?: number;
  questionsCorrect?: number;
  questionsCorrectFirstTry?: number;
  pointsEarned?: number;
  startedAt?: string | null;
  completedAt?: string | null;
  lastAttemptedAt?: string | null;
  cooldownUntil?: string | null;
  sectionsViewedJson?: number[];
}

export interface QuizPayload {
  lessonId: string;
  lessonSlug: string;
  totalQuestions: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  questionId: string;
  stem: string;
  question_type: "single-best" | "multi-select" | string;
  bloom_level: string;
  difficulty: string;
  options: Array<{ id: string; text: string }>;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  timeSpentSeconds: number;
}

export interface SubmitResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  mastered: boolean;
  canMaster: boolean;
  masteryRequirements: {
    quizMastered: boolean;
    allSectionsViewed: boolean;
    interactiveInteracted: boolean;
  };
  pointsEarned: number;
  newStreak: number;
  newBadges: BadgeRecord[];
  status: "IN_PROGRESS" | "COMPLETED" | "MASTERED";
  questionResults: Array<{
    questionId: string;
    isCorrect: boolean;
    correctAnswer?: string | string[];
    explanation?: string;
    pointsEarned?: number;
  }>;
}

export interface StreakPayload {
  currentStreak: number;
  longestStreak: number;
  todayActivity: {
    hadLogin: boolean;
    hadLessonActivity: boolean;
    hadPanchangaCheck: boolean;
    pointsEarnedToday: number;
  };
}

export interface BadgesPayload {
  earned: BadgeRecord[];
  upcoming: BadgeRecord[];
}

export interface GamificationProfile {
  skillScore: number;
  currentTier: number;
  currentLevel: string;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  totalLessonsCompleted: number;
  totalModulesCompleted: number;
  title: string;
}

export interface DailyLoginResult {
  pointsEarned: number;
  newBalance: number;
  streakUpdated: boolean;
  newStreak: number;
  streakContinued: boolean;
}

export interface ReviewDeckPayload {
  cards: ReviewCard[];
  stats: {
    dueToday: number;
    totalCards: number;
    todayReviewed: number;
    todayCorrect: number;
  };
}

export interface ReviewCard {
  cardId: string;
  lessonSlug: string;
  lessonId: string;
  dueAt: string;
  intervalDays: number;
  lastQuality?: number;
  front?: string;
  back?: string;
}

/* ─────────────────────────  HTTP wrappers  ───────────────────────────── */

function url(path: string): string {
  return `${LEARNING_BASE}${path}`;
}

function unwrap<T>(resp: unknown): T {
  if (
    resp &&
    typeof resp === "object" &&
    "success" in resp &&
    (resp as { success?: boolean }).success === true &&
    "data" in resp
  ) {
    return (resp as { data: T }).data;
  }
  return resp as T;
}

export async function fetchDashboard(userId: string): Promise<DashboardPayload> {
  return apiFetch<{ success: true; data: DashboardPayload } | DashboardPayload>(
    url(`/learn/dashboard?userId=${encodeURIComponent(userId)}`),
  ).then(unwrap<DashboardPayload>);
}

export async function fetchLessonQuiz(slug: string): Promise<QuizPayload> {
  return apiFetch<{ success: true; data: QuizPayload } | QuizPayload>(
    url(`/learn/lessons/${encodeURIComponent(slug)}/quiz`),
  ).then(unwrap<QuizPayload>);
}

export async function submitLessonQuiz(slug: string, payload: { userId: string; answers: QuizAnswer[] }): Promise<SubmitResult> {
  return apiFetch<{ success: true; data: SubmitResult } | SubmitResult>(
    url(`/learn/lessons/${encodeURIComponent(slug)}/submit`),
    { method: "POST", body: JSON.stringify(payload) },
  ).then(unwrap<SubmitResult>);
}

export async function postSectionView(slug: string, userId: string, sectionId: number): Promise<LessonProgressRow> {
  return apiFetch<{ success: true; data: LessonProgressRow } | LessonProgressRow>(
    url(`/learn/lessons/${encodeURIComponent(slug)}/section-view`),
    { method: "POST", body: JSON.stringify({ userId, sectionId }) },
  ).then(unwrap<LessonProgressRow>);
}

export async function fetchReviewDeck(userId: string): Promise<ReviewDeckPayload> {
  return apiFetch<{ success: true; data: ReviewDeckPayload } | ReviewDeckPayload>(
    url(`/learn/sr/today?userId=${encodeURIComponent(userId)}`),
  ).then(unwrap<ReviewDeckPayload>);
}

export async function submitReviewCard(cardId: string, payload: { userId: string; quality: number }): Promise<{ nextDueAt: string; intervalDays: number }> {
  return apiFetch<{ success: true; data: { nextDueAt: string; intervalDays: number } } | { nextDueAt: string; intervalDays: number }>(
    url(`/learn/sr/${encodeURIComponent(cardId)}/review`),
    { method: "POST", body: JSON.stringify(payload) },
  ).then(unwrap<{ nextDueAt: string; intervalDays: number }>);
}

export async function fetchStreak(userId: string): Promise<StreakPayload> {
  return apiFetch<{ success: true; data: StreakPayload } | StreakPayload>(
    url(`/learn/gamification/streak/${encodeURIComponent(userId)}`),
  ).then(unwrap<StreakPayload>);
}

export async function fetchBadges(userId: string): Promise<BadgesPayload> {
  return apiFetch<{ success: true; data: BadgesPayload } | BadgesPayload>(
    url(`/learn/gamification/badges/${encodeURIComponent(userId)}`),
  ).then(unwrap<BadgesPayload>);
}

export async function fetchGamificationProfile(userId: string): Promise<GamificationProfile> {
  return apiFetch<{ success: true; data: GamificationProfile } | GamificationProfile>(
    url(`/learn/gamification/profile/${encodeURIComponent(userId)}`),
  ).then(unwrap<GamificationProfile>);
}

export async function postDailyLogin(userId: string): Promise<DailyLoginResult> {
  return apiFetch<{ success: true; data: DailyLoginResult } | DailyLoginResult>(
    url(`/learn/gamification/daily/login/${encodeURIComponent(userId)}`),
    { method: "POST" },
  ).then(unwrap<DailyLoginResult>);
}
