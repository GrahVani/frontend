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
}

export interface SubmitResponse {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  status: string;
}

export interface DashboardData {
  lessonsCompleted: number;
  averageScore: number;
  progress: ProgressItem[];
}

export interface ProgressItem {
  id: string;
  status: string;
  score: number | null;
  completedAt: string | null;
  lesson: { title: string; courseId: string };
}

export const learnApi = {
  getCourses: (): Promise<{ success: boolean; data: Course[] }> =>
    apiFetch(`${LEARN_BASE}/courses`),

  getCourse: (id: string): Promise<{ success: boolean; data: Course }> =>
    apiFetch(`${LEARN_BASE}/courses/${id}`),

  getLesson: (id: string): Promise<{ success: boolean; data: Lesson }> =>
    apiFetch(`${LEARN_BASE}/lessons/${id}`),

  submitLesson: (lessonId: string, userId: string, answers: QuizAnswer[]): Promise<{ success: boolean; data: SubmitResponse }> =>
    apiFetch(`${LEARN_BASE}/lessons/${lessonId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ userId, answers }),
    }),

  getDashboard: (userId: string): Promise<{ success: boolean; data: DashboardData }> =>
    apiFetch(`${LEARN_BASE}/dashboard?userId=${userId}`),
};
