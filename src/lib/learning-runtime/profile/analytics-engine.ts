import type { LearnerProfile } from "./profile-service";
import type { LearnerMemory } from "./memory-service";
import type { StudyPlan } from "./study-planner";
import type { LearningMomentum } from "./mentor-engine";
import { runtimeCache } from "./cache";
import { getActiveRuntimeConfiguration } from "./runtime-config";
import { getFallbackLearningInsights, getFallbackWeeklyAnalytics, getFallbackLearningPredictions } from "./runtime-fallback";

export interface LearningInsight {
  id: string;
  title: string;
  description: string;
  category: "performance" | "engagement" | "quiz" | "memory" | "revision" | "streak";
  severity: "positive" | "warning" | "critical";
  recommendation: string;
  generatedAt: number;
}

export interface WeeklyLearningReport {
  totalStudyMinutes: number;
  completedLessons: number;
  completedSections: number;
  quizzesTaken: number;
  averageQuizScore: number;
  strongestTopic: string | null;
  weakestTopic: string | null;
  streak: number;
  revisionSessions: number;
  overallRating: "excellent" | "good" | "average" | "needs_attention";
}

export interface LearningPrediction {
  completionProbability: number;
  masteryProbability: number;
  burnoutProbability: number;
  expectedCompletionDays: number;
  confidence: number;
}

/**
 * Helper to calculate total completed sections and quizzes taken from progressState.
 */
function getProgressMetrics(progressState: any) {
  let completedSections = 0;
  let quizzesTaken = 0;
  Object.values(progressState?.lessons || {}).forEach((l: any) => {
    completedSections += l?.sectionsViewed?.length || 0;
    quizzesTaken += l?.attempts?.length || 0;
  });
  return { completedSections, quizzesTaken };
}

/**
 * Generates actionable learning insights by analyzing long-term learner behavior.
 */
function _computeLearningInsights(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): LearningInsight[] {
  const insights: LearningInsight[] = [];
  const now = Date.now();
  const streak = progressState?.streakDays || 0;
  const { completedSections, quizzesTaken } = getProgressMetrics(progressState);

  // 1. Quiz Performance Insight
  if (quizzesTaken > 0) {
    if (profile.averageQuizScore >= 75) {
      insights.push({
        id: "insight-quiz-improving",
        title: "Quiz accuracy improving",
        description: `Your average assessment score is a strong ${profile.averageQuizScore}%, showing excellent mastery of Vedic principles.`,
        category: "quiz",
        severity: "positive",
        recommendation: "Maintain your analytical approach and challenge yourself with advanced interactive exercises.",
        generatedAt: now,
      });
    } else if (profile.averageQuizScore < 60) {
      insights.push({
        id: "insight-quiz-needs-review",
        title: "Quiz accuracy needs support",
        description: `Your average quiz score is ${profile.averageQuizScore}%. Foundational concepts may need reinforcement.`,
        category: "quiz",
        severity: "warning",
        recommendation: "Review section summaries and interactive diagrams before attempting quiz retries.",
        generatedAt: now,
      });
    }
  }

  // 2. Revision Frequency Insight
  if (memory.revisionCount < 2 && profile.completedLessons >= 1) {
    insights.push({
      id: "insight-low-revision",
      title: "Revision frequency low",
      description: "You are advancing through lessons without frequently revisiting earlier foundational concepts.",
      category: "revision",
      severity: "warning",
      recommendation: "Schedule a short review session of earlier topics to reinforce long-term memory retention.",
      generatedAt: now,
    });
  } else if (memory.revisionCount >= 3) {
    insights.push({
      id: "insight-strong-revision",
      title: "Excellent revision habits",
      description: `You have completed ${memory.revisionCount} revision sessions, cementing key Vedic astrological rules.`,
      category: "revision",
      severity: "positive",
      recommendation: "Continue balancing new lesson intake with periodic reviews of mastered material.",
      generatedAt: now,
    });
  }

  // 3. Consistency / Streak Insight
  if (streak >= 3) {
    insights.push({
      id: "insight-excellent-consistency",
      title: "Excellent consistency",
      description: `You have maintained an active study rhythm for ${streak} consecutive days.`,
      category: "streak",
      severity: "positive",
      recommendation: "Your daily study routine is building strong cognitive retention and steady momentum.",
      generatedAt: now,
    });
  } else if (streak === 0 && completedSections > 0) {
    insights.push({
      id: "insight-inactive-period",
      title: "Long inactive period",
      description: "You have not completed any study sessions recently. Consistent daily practice is vital in Jyotiṣa.",
      category: "engagement",
      severity: "critical",
      recommendation: "Resume your Vedic astrology journey today with a quick 5-minute refresher.",
      generatedAt: now,
    });
  }

  // 4. Topic Concentration Insight
  if (memory.weakestTopics && memory.weakestTopics.length > 0) {
    insights.push({
      id: "insight-weak-topic",
      title: "Weak topic concentration",
      description: `Assessment data shows recurring difficulties in: ${memory.weakestTopics.slice(0, 2).join(", ")}.`,
      category: "performance",
      severity: "warning",
      recommendation: `Focus on reviewing ${memory.weakestTopics[0]} before advancing to more complex planetary calculations.`,
      generatedAt: now,
    });
  } else if (memory.strongestTopics && memory.strongestTopics.length > 0) {
    insights.push({
      id: "insight-strong-topic",
      title: "Strong concept mastery",
      description: `You demonstrate exceptional competence in: ${memory.strongestTopics.slice(0, 2).join(", ")}.`,
      category: "memory",
      severity: "positive",
      recommendation: "Leverage this strong foundation as you explore synthesizing multiple astrological rules.",
      generatedAt: now,
    });
  }

  // Ensure at least one baseline insight if list is empty
  if (insights.length === 0) {
    insights.push({
      id: "insight-baseline-momentum",
      title: "Strong momentum",
      description: "You are making steady progress through the curriculum with balanced reading and exploration.",
      category: "performance",
      severity: "positive",
      recommendation: "Keep up the great pace and explore interactive visualizations to deepen understanding.",
      generatedAt: now,
    });
  }

  return insights;
}

export function generateLearningInsights(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): LearningInsight[] {
  if (!getActiveRuntimeConfiguration().analytics) {
    return getFallbackLearningInsights();
  }
  return runtimeCache.memoize("analytics", [profile, memory, progressState, "insights"], () => _computeLearningInsights(profile, memory, progressState));
}

function _computeWeeklyLearningReport(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): WeeklyLearningReport {
  const totalStudyMinutes = Math.round((progressState?.totalTimeMs || 0) / (60 * 1000));
  const streak = progressState?.streakDays || 0;
  const { completedSections, quizzesTaken } = getProgressMetrics(progressState);
  const averageQuizScore = profile.averageQuizScore || 0;

  let overallRating: "excellent" | "good" | "average" | "needs_attention" = "average";
  if (quizzesTaken > 0 && averageQuizScore < 50) {
    overallRating = "needs_attention";
  } else if (averageQuizScore >= 80 && streak >= 3) {
    overallRating = "excellent";
  } else if (averageQuizScore >= 65 || streak >= 2 || completedSections >= 3) {
    overallRating = "good";
  } else if (completedSections === 0 && quizzesTaken === 0) {
    overallRating = "needs_attention";
  }

  return {
    totalStudyMinutes,
    completedLessons: profile.completedLessons || 0,
    completedSections,
    quizzesTaken,
    averageQuizScore,
    strongestTopic: memory.strongestTopics?.[0] || null,
    weakestTopic: memory.weakestTopics?.[0] || null,
    streak,
    revisionSessions: memory.revisionCount || 0,
    overallRating,
  };
}

export function generateWeeklyLearningReport(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): WeeklyLearningReport {
  if (!getActiveRuntimeConfiguration().analytics) {
    return getFallbackWeeklyAnalytics();
  }
  return runtimeCache.memoize("analytics", [profile, memory, progressState, "weeklyReport"], () => _computeWeeklyLearningReport(profile, memory, progressState));
}

function _computePredictLearningOutcome(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  studyPlan?: StudyPlan,
  momentum?: LearningMomentum
): LearningPrediction {
  const streak = progressState?.streakDays || 0;
  const totalStudyMinutes = Math.round((progressState?.totalTimeMs || 0) / (60 * 1000));
  const { quizzesTaken } = getProgressMetrics(progressState);

  // 1. Completion Probability (10 - 98)
  let completionProb = 50;
  const lessonProgressRatio = profile.totalLessons > 0 ? profile.completedLessons / profile.totalLessons : 0;
  completionProb += Math.round(lessonProgressRatio * 35);
  completionProb += Math.min(15, streak * 3);
  if (studyPlan?.burnoutRisk === "high") completionProb -= 15;
  if (momentum?.trend === "rising") completionProb += 10;
  if (momentum?.trend === "declining") completionProb -= 10;
  completionProb = Math.max(10, Math.min(98, completionProb));

  // 2. Mastery Probability (15 - 95)
  let masteryProb = quizzesTaken > 0 ? profile.averageQuizScore : 65;
  masteryProb += Math.min(15, (memory.revisionCount || 0) * 4);
  masteryProb -= Math.min(20, (memory.weakestTopics?.length || 0) * 5);
  if (momentum?.score && momentum.score >= 80) masteryProb += 10;
  masteryProb = Math.max(15, Math.min(95, masteryProb));

  // 3. Burnout Probability (5 - 90)
  let burnoutProb = 20;
  if (studyPlan?.burnoutRisk === "high") {
    burnoutProb = 75;
  } else if (studyPlan?.burnoutRisk === "medium") {
    burnoutProb = 45;
  } else if (totalStudyMinutes > 150) {
    burnoutProb = 60;
  }
  if (streak > 14 && memory.revisionCount === 0) burnoutProb += 15;
  burnoutProb = Math.max(5, Math.min(90, burnoutProb));

  // 4. Expected Completion Days
  let expectedDays = studyPlan?.completionForecast || Math.max(1, (profile.totalLessons - profile.completedLessons) * 2);
  if (streak >= 5) expectedDays = Math.max(1, expectedDays - 2);

  // 5. Confidence Score (20 - 99)
  let confidence = memory.averageConfidence > 0 ? memory.averageConfidence : 75;
  if (profile.averageQuizScore >= 80) confidence = Math.max(confidence, 85);
  confidence = Math.max(20, Math.min(99, confidence));

  return {
    completionProbability: completionProb,
    masteryProbability: masteryProb,
    burnoutProbability: burnoutProb,
    expectedCompletionDays: expectedDays,
    confidence,
  };
}

export function predictLearningOutcome(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  studyPlan?: StudyPlan,
  momentum?: LearningMomentum
): LearningPrediction {
  if (!getActiveRuntimeConfiguration().analytics || !getActiveRuntimeConfiguration().predictions) {
    return getFallbackLearningPredictions();
  }
  return runtimeCache.memoize("analytics", [profile, memory, progressState, studyPlan, momentum, "prediction"], () => _computePredictLearningOutcome(profile, memory, progressState, studyPlan, momentum));
}


