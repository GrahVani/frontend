import type { LessonProgress } from "../progress-store";
import { runtimeCache } from "./cache";
import { getActiveRuntimeConfiguration } from "./runtime-config";
import { getFallbackProfile, getFallbackRecommendation } from "./runtime-fallback";

export interface LearnerProfile {
  completionPercentage: number;
  completedLessons: number;
  totalLessons: number;
  streak: number;
  averageQuizScore: number;
  masteredTopics: string[];
  weakTopics: string[];
  recentlyViewedLessons: string[];
  learningVelocity: number; // lessons completed per hour
  confidenceScore: number;
}

export interface LearnerRecommendation {
  recommendedNextLesson: string | null;
  recommendedRevision: string | null;
  recommendedQuizRetry: string | null;
  reason: string;
  confidence: number;
  priority: "high" | "medium" | "low";
  type: "continue" | "retry_quiz" | "complete_simulation" | "review_prerequisite" | "revise" | "move_next";
}

export const LESSON_TOPICS: Record<string, string[]> = {
  "jyotisha-as-vedanga": ["Vedāṅga", "Ecosystem of Veda", "Limbs of Veda"],
  "the-six-vedangas-and-their-relationship": ["Vedāṅgas Relationship", "Sāṅga Habit", "Coupled Disciplines"],
  "jyotisha-vs-western-astrology-vs-pop-astrology": ["Zodiac Systems", "Tropical vs Sidereal", "Pop Astrology traps"],
  "philosophy-of-karma-and-prediction": ["Karma Types", "Sanchita & Prarabdha", "Destiny vs Free Will"],
  "the-historical-timeline-of-jyotisha": ["Vedic Chronology", "Academic Dating", "Dating Recensions"],
  "parashara-the-foundational-rishi": ["Parāśara Tradition", "BPHS Recensions", "Foundational Doctrines"],
  "varahamihira-the-systematic-codifier": ["Varāhamihira Canon", "Bṛhat Saṁhitā", "Chronological Anchor"],
  "medieval-codifiers-kalyanavarma-mantresvara": ["Phaladīpikā", "Medieval Digests", "Transmission Chains"],
  "jaimini-and-the-second-tradition": ["Jaimini Sūtras", "Aspect Systems", "Attribution Discipline"],
  "modern-founders-krishnamurti-and-joshi": ["Krishnamurti Paddhati", "Sub-Lord Doctrine", "Modern Streams"],
};

export const LESSON_TITLES: Record<string, string> = {
  "jyotisha-as-vedanga": "Jyotiṣa as a Vedāṅga",
  "the-six-vedangas-and-their-relationship": "The Six Vedāṅgas and Their Relationship",
  "jyotisha-vs-western-astrology-vs-pop-astrology": "Jyotiṣa vs Western vs Pop Astrology",
  "philosophy-of-karma-and-prediction": "Philosophy of Karma and Prediction",
  "the-historical-timeline-of-jyotisha": "The Historical Timeline of Jyotiṣa",
  "parashara-the-foundational-rishi": "Parāśara: The Foundational Ṛṣi",
  "varahamihira-the-systematic-codifier": "Varāhamihira: The Systematic Codifier",
  "medieval-codifiers-kalyanavarma-mantresvara": "Medieval Codifiers: Kalyāṇavarmā & Mantreśvara",
  "jaimini-and-the-second-tradition": "Jaimini and the Second Tradition",
  "modern-founders-krishnamurti-and-joshi": "Modern Founders: Krishnamurti and Joshi",
};

export const ALL_LESSONS = Object.keys(LESSON_TOPICS);

function _computeLearnerProfile(progressState: any): LearnerProfile {
  const lessons = progressState?.lessons || {};
  const streak = progressState?.streakDays || 0;
  const totalTimeMs = progressState?.totalTimeMs || 0;

  const totalLessons = ALL_LESSONS.length;
  let completedLessons = 0;
  let totalAttemptsCount = 0;
  let attemptsScoreSum = 0;

  const masteredTopicsSet = new Set<string>();
  const weakTopicsSet = new Set<string>();
  const recentlyViewed: string[] = [];

  ALL_LESSONS.forEach((slug) => {
    const progress = lessons[slug];
    if (!progress) return;

    if (progress.masteryStatus === "Mastered") {
      completedLessons++;
      (LESSON_TOPICS[slug] || []).forEach((t) => masteredTopicsSet.add(t));
    } else {
      // If quiz failed or wrong answer logs exist, mark as weak
      const hasFailedAttempt = progress.attempts?.some((a: any) => !a.passed);
      const lastAttempt = progress.attempts?.[progress.attempts.length - 1];
      const lastFailed = lastAttempt && !lastAttempt.passed;
      if (hasFailedAttempt || lastFailed || (progress.attempts?.length > 0 && progress.masteryStatus !== "Mastered")) {
        (LESSON_TOPICS[slug] || []).forEach((t) => weakTopicsSet.add(t));
      }
    }

    if (progress.sectionsViewed?.length > 0) {
      recentlyViewed.push(slug);
    }

    // Accumulate quiz scores
    (progress.attempts || []).forEach((attempt: any) => {
      totalAttemptsCount++;
      attemptsScoreSum += attempt.scorePct * 100; // convert 0-1 to percentage
    });
  });

  // Filter weak topics that are already mastered in other modules
  masteredTopicsSet.forEach((t) => weakTopicsSet.delete(t));

  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const averageQuizScore = totalAttemptsCount > 0 ? Math.round(attemptsScoreSum / totalAttemptsCount) : 0;

  const studyHours = totalTimeMs / (1000 * 60 * 60);
  const learningVelocity = studyHours > 0 ? Number((completedLessons / studyHours).toFixed(2)) : 0;

  // Confidence calculation
  let confidenceScore = 60; // base score
  if (streak > 2) confidenceScore += 5;
  if (streak > 5) confidenceScore += 10;
  if (averageQuizScore > 85) confidenceScore += 15;
  if (completionPercentage > 50) confidenceScore += 10;
  confidenceScore = Math.min(99, Math.max(50, confidenceScore));

  return {
    completionPercentage,
    completedLessons,
    totalLessons,
    streak,
    averageQuizScore,
    masteredTopics: Array.from(masteredTopicsSet),
    weakTopics: Array.from(weakTopicsSet),
    recentlyViewedLessons: recentlyViewed,
    learningVelocity,
    confidenceScore,
  };
}

export function aggregateLearnerProfile(progressState: any): LearnerProfile {
  if (!getActiveRuntimeConfiguration().profile) {
    return getFallbackProfile();
  }
  return runtimeCache.memoize("profile", [progressState], () => _computeLearnerProfile(progressState));
}

function _computeLearnerRecommendation(profile: LearnerProfile, progressState: any): LearnerRecommendation {
  const lessons = progressState?.lessons || {};

  // 1. Check for incomplete lessons in progress (touched but not mastered, and no failed attempts)
  const incompleteLessonSlug = ALL_LESSONS.find((slug) => {
    const progress = lessons[slug];
    const hasFailed = progress?.attempts?.some((a: any) => !a.passed);
    return progress && progress.sectionsViewed?.length > 0 && progress.masteryStatus !== "Mastered" && !hasFailed;
  });

  if (incompleteLessonSlug) {
    const title = LESSON_TITLES[incompleteLessonSlug] || incompleteLessonSlug;
    return {
      recommendedNextLesson: incompleteLessonSlug,
      recommendedRevision: null,
      recommendedQuizRetry: null,
      reason: `You have an active session in progress on "${title}". Focus on absorbing this lesson's core concepts.`,
      confidence: profile.confidenceScore,
      priority: "high",
      type: "continue",
    };
  }

  // 2. Check for failed quiz or quiz on cooldown
  const failedQuizSlug = ALL_LESSONS.find((slug) => {
    const progress = lessons[slug];
    if (!progress) return false;
    const lastAttempt = progress.attempts?.[progress.attempts.length - 1];
    return progress.masteryStatus === "OnCooldown" || (lastAttempt && !lastAttempt.passed);
  });

  if (failedQuizSlug) {
    const title = LESSON_TITLES[failedQuizSlug] || failedQuizSlug;
    return {
      recommendedNextLesson: null,
      recommendedRevision: null,
      recommendedQuizRetry: failedQuizSlug,
      reason: `You have unresolved wrong answers in "${title}". Retrying this quiz will solidify your grasp.`,
      confidence: Math.max(50, profile.confidenceScore - 10),
      priority: "high",
      type: "retry_quiz",
    };
  }

  // 3. Check for unfinished simulations (section 7 viewed but lesson not mastered)
  const unfinishedSimSlug = ALL_LESSONS.find((slug) => {
    const progress = lessons[slug];
    if (!progress) return false;
    const hasSimViewed = progress.sectionsViewed?.includes("7");
    return hasSimViewed && progress.masteryStatus !== "Mastered";
  });

  if (unfinishedSimSlug) {
    const title = LESSON_TITLES[unfinishedSimSlug] || unfinishedSimSlug;
    return {
      recommendedNextLesson: unfinishedSimSlug,
      recommendedRevision: null,
      recommendedQuizRetry: null,
      reason: `You have viewed the visual simulation in "${title}" but haven't mastered it. Complete the visual step.`,
      confidence: profile.confidenceScore,
      priority: "medium",
      type: "complete_simulation",
    };
  }

  // 4. Next lesson recommendation (first lesson in sequence that is not mastered)
  const nextLessonSlug = ALL_LESSONS.find((slug) => {
    const progress = lessons[slug];
    return !progress || progress.masteryStatus !== "Mastered";
  });

  if (nextLessonSlug) {
    const title = LESSON_TITLES[nextLessonSlug] || nextLessonSlug;
    return {
      recommendedNextLesson: nextLessonSlug,
      recommendedRevision: null,
      recommendedQuizRetry: null,
      reason: `Ready for new concepts? Proceed to "${title}" to continue your Vedic journey.`,
      confidence: profile.confidenceScore,
      priority: "medium",
      type: "move_next",
    };
  }

  // 5. Revision recommendation (if all lessons are mastered)
  const revisionSlug = ALL_LESSONS[0];
  const title = LESSON_TITLES[revisionSlug] || revisionSlug;
  return {
    recommendedNextLesson: null,
    recommendedRevision: revisionSlug,
    recommendedQuizRetry: null,
    reason: `All lessons mastered! We recommend revising "${title}" to maintain recall of fundamental concepts.`,
    confidence: 95,
    priority: "low",
    type: "revise",
  };
}

export function generateLearnerRecommendation(profile: LearnerProfile, progressState: any): LearnerRecommendation {
  if (!getActiveRuntimeConfiguration().recommendation) {
    return getFallbackRecommendation();
  }
  return runtimeCache.memoize("recommendation", [profile, progressState], () => _computeLearnerRecommendation(profile, progressState));
}

export { generateAdaptiveRecommendations, generateLearningPath } from "./recommendation-engine";
export type { AdaptiveRecommendation, LearningPathStep } from "./recommendation-engine";
export { aggregateLearnerMemory } from "./memory-service";
export type { LearnerMemory } from "./memory-service";
export { generateStudyPlan, detectLearningRisks } from "./study-planner";
export type { StudyPlan, StudyTask, WeeklyGoal, LearningRisk } from "./study-planner";
export { generateMentorGoals, generateAchievements, calculateMomentum } from "./mentor-engine";
export type { MentorGoal, Achievement, LearningMomentum } from "./mentor-engine";
export { generateLearningInsights, generateWeeklyLearningReport, predictLearningOutcome } from "./analytics-engine";
export type { LearningInsight, WeeklyLearningReport, LearningPrediction } from "./analytics-engine";
export { generateMentorDashboard } from "./dashboard-engine";
export type { MentorDashboard, DashboardOverview, DashboardFocus, WeeklySnapshot, CoachingSummary, MentorTimelineItem } from "./dashboard-engine";
export { generateCoachingInterventions, generateDailyCoachSummary, generateLearningAlerts } from "./coaching-engine";
export type { CoachingIntervention, DailyCoachSummary, LearningAlert } from "./coaching-engine";
export { generateSessionSummary, evaluateCoachingEffectiveness, generateAdaptiveReflection, calculateLearningConsistency } from "./session-intelligence";
export type { SessionSummary, CoachingEffectiveness, AdaptiveReflection, LearningConsistency } from "./session-intelligence";
export { calculateRuntimeMetrics, generateCacheStatistics, generateOptimizationReport } from "./performance-engine";
export type { RuntimeMetrics, CacheStatistics, RuntimeOptimizationReport } from "./performance-engine";
export { createRuntimeEvent, createRuntimeTrace, calculateRuntimeHealth } from "./observability-engine";
export type { RuntimeEvent, RuntimeTrace, RuntimeHealth } from "./observability-engine";
export { recordRuntimeEvent, getRuntimeEvents, clearRuntimeEvents, recordRuntimeTrace, getLatestTrace, getTraces } from "./telemetry";
export { runtimeCache } from "./cache";





