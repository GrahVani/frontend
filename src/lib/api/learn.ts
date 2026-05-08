import { apiFetch, AUTH_URL } from './core';

const LEARN_BASE = `${AUTH_URL}/learn`;

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  thumbnailUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  lessons: LessonSummary[];
  // Dynamic progress fields (populated when userId is provided)
  completedLessons?: number;
  totalLessons?: number;
  progressPercentage?: number;
  averageScore?: number;
  status?: string;
  moduleNumber?: number;
}

export interface LessonSummary {
  id: string;
  title: string;
  sequenceOrder: number;
  lessonType: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  sequenceOrder: number;
  lessonType: string;
  contentJson: LessonContent;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LessonSection {
  id: number;
  type: string;
  title: string;
  content: string;
}

export interface LessonContent {
  intro: string;
  sections?: LessonSection[];
  concepts: Concept[];
  quiz: QuizQuestion[];
}

export interface Concept {
  id: number;
  title: string;
  description: string;
  icon?: string;
  keyTakeaway?: string;
  proTip?: string;
  commonMistake?: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface SubQuestion {
  questionId: number;
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation: string;
  whyWrong?: Record<string, string>;
}

export type QuizQuestion =
  | { questionId: number; type: "multiple_choice"; question: string; options: Record<string, string>; correctAnswer: string; explanation: string; whyWrong?: Record<string, string>; conceptRef?: number; memoryAid?: string; hint?: string; difficulty?: string }
  | { questionId: number; type: "true_false"; question: string; correctAnswer: "true" | "false"; explanation: string; conceptRef?: number; memoryAid?: string; hint?: string; difficulty?: string }
  | { questionId: number; type: "matching"; question: string; pairs: MatchingPair[]; conceptRef?: number; memoryAid?: string; difficulty?: string }
  | { questionId: number; type: "fill_blank"; question: string; correctAnswer: string; acceptableAnswers?: string[]; explanation: string; conceptRef?: number; memoryAid?: string; hint?: string; difficulty?: string }
  | { questionId: number; type: "case_study"; question: string; scenario: string; subQuestions: SubQuestion[]; conceptRef?: number; memoryAid?: string; difficulty?: string };

export interface QuizAnswer {
  questionId: number;
  answer: string;
  timeSpentSeconds?: number;
}

export interface SubmitResponse {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  status: string;
}

export interface BadgeItem {
  badgeCode: string;
  name: string;
  description: string;
  rarity: string;
  iconUrl: string | null;
  earnedAt?: string;
  pointsReward?: number;
  progress?: { current: number; target: number; percent: number };
}

export interface LessonProgressData {
  lessonId: string;
  courseId: string;
  status: string;
  completionPercentage: number;
  score: number;
  sectionProgressPercentage: number;
  sectionsViewed: number[];
  totalSections: number;
  quizAttempts: Array<{
    id: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    pointsEarned: number;
    completedAt: string | null;
  }>;
  bestScore: number;
  attemptsCount: number;
}

export interface DashboardData {
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
  tierNames: Record<number, string>;
  badges: {
    earned: BadgeItem[];
    upcoming: BadgeItem[];
  };
  progress: ProgressItem[];
}

export interface ProgressItem {
  id: string;
  lessonId: string;
  status: string;
  score: number | null;
  completedAt: string | null;
  lesson: { title: string; courseId: string };
}

export const learnApi = {
  getCourses: (userId?: string): Promise<{ success: boolean; data: Course[] }> =>
    apiFetch(`${LEARN_BASE}/courses${userId ? `?userId=${userId}` : ""}`),

  getCourse: (id: string): Promise<{ success: boolean; data: Course }> =>
    apiFetch(`${LEARN_BASE}/courses/${id}`),

  getLesson: (id: string): Promise<{ success: boolean; data: Lesson }> =>
    apiFetch(`${LEARN_BASE}/lessons/${id}`),

  getLessonProgress: (lessonId: string, userId: string): Promise<{ success: boolean; data: LessonProgressData }> =>
    apiFetch(`${LEARN_BASE}/lessons/${lessonId}/progress?userId=${userId}`),

  trackSectionView: (lessonId: string, userId: string, sectionId: number): Promise<{ success: boolean; data: any }> =>
    apiFetch(`${LEARN_BASE}/lessons/${lessonId}/section-view`, {
      method: 'POST',
      body: JSON.stringify({ userId, sectionId }),
    }),

  submitLesson: (lessonId: string, userId: string, answers: QuizAnswer[]): Promise<{ success: boolean; data: SubmitResponse }> =>
    apiFetch(`${LEARN_BASE}/lessons/${lessonId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ userId, answers }),
    }),

  getDashboard: (userId: string): Promise<{ success: boolean; data: DashboardData }> =>
    apiFetch(`${LEARN_BASE}/dashboard?userId=${userId}`),

  getLeaderboard: (period: string, userId?: string): Promise<{ success: boolean; data: { period: string; myRank: number | null; totalParticipants: number; topUsers: Array<{ rank: number; userId: string; displayName: string; points: number; score?: number; tier?: string; avatar?: string }> } }> =>
    apiFetch(`${LEARN_BASE}/gamification/leaderboard?period=${period}${userId ? `&userId=${userId}` : ''}`),

  getProfile: (userId: string): Promise<{ success: boolean; data: { skillScore: number; currentTier: number; currentLevel: string; currentStreak: number; longestStreak: number; totalPoints: number; totalLessonsCompleted: number; totalModulesCompleted: number; title: string; nextTierProgress: number; weakAreas: string[]; strongAreas: string[] } }> =>
    apiFetch(`${LEARN_BASE}/gamification/profile/${userId}`),

  getModuleProgress: (userId: string): Promise<{ success: boolean; data: { modules: Array<{ moduleId: string; title: string; status: string; progressPercentage: number; lessonsCompleted: number; totalLessons: number; averageScore: number }> } }> =>
    apiFetch(`${LEARN_BASE}/gamification/modules/${userId}`),
};
