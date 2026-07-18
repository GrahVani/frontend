/**
 * Grahvani Learning Runtime — AI Tutor Runtime Fallback Layer (runtime-fallback.ts)
 *
 * Provides safe, deterministic, zero-dependency fallback values for all intelligence engines
 * to guarantee graceful UI degradation if an engine fails during runtime computation.
 */

import type { LearnerProfile, LearnerRecommendation } from "./profile-service";
import type { AdaptiveRecommendation, LearningPathStep } from "./recommendation-engine";
import type { LearningInsight, WeeklyLearningReport, LearningPrediction } from "./analytics-engine";
import type { MentorDashboard, DashboardOverview, DashboardFocus, WeeklySnapshot, CoachingSummary, MentorTimelineItem } from "./dashboard-engine";
import type { CoachingIntervention, DailyCoachSummary, LearningAlert } from "./coaching-engine";
import type { SessionSummary, CoachingEffectiveness, AdaptiveReflection, LearningConsistency } from "./session-intelligence";
import type { MentorGoal, Achievement, LearningMomentum } from "./mentor-engine";
import type { StudyTask, WeeklyGoal, StudyPlan, LearningRisk } from "./study-planner";
import type { LearnerMemory } from "./memory-service";

export function getFallbackProfile(): LearnerProfile {
  return {
    completionPercentage: 0,
    completedLessons: 0,
    totalLessons: 0,
    streak: 0,
    averageQuizScore: 0,
    masteredTopics: [],
    weakTopics: [],
    recentlyViewedLessons: [],
    learningVelocity: 0,
    confidenceScore: 0,
  };
}

export function getFallbackRecommendation(): LearnerRecommendation {
  return {
    recommendedNextLesson: "jyotisha-as-vedanga",
    recommendedRevision: null,
    recommendedQuizRetry: null,
    reason: "Fallback recommendation generated due to engine unavailability.",
    confidence: 50,
    priority: "medium",
    type: "continue"
  };
}

export function getFallbackAdaptiveRecommendations(): AdaptiveRecommendation[] {
  return [
    {
      recommendationId: "fallback_rec_1",
      title: "Continue Learning",
      description: "Fallback recommendation generated due to engine unavailability.",
      lessonSlug: "jyotisha-as-vedanga",
      section: null,
      recommendationType: "continue",
      priority: "medium",
      confidence: 50,
      estimatedTime: 15,
      reasoning: "Safe fallback recommendation.",
      prerequisiteLessons: [],
      generatedAt: Date.now()
    }
  ];
}

export function getFallbackLearningPath(): LearningPathStep[] {
  return [
    {
      id: "fallback_path_1",
      title: "Introduction",
      type: "lesson",
      lessonSlug: "jyotisha-as-vedanga",
      status: "locked",
      reason: "Safe fallback.",
      estimatedDuration: 15,
      priority: "medium"
    }
  ];
}

export function getFallbackLearningInsights(): LearningInsight[] {
  return [
    {
      id: "fallback_insight_1",
      title: "Learning Runtime Recovered",
      description: "Engine running in safe fallback mode.",
      category: "engagement",
      severity: "positive",
      recommendation: "Continue studying at your own pace.",
      generatedAt: Date.now()
    }
  ];
}

export function getFallbackWeeklyAnalytics(): WeeklyLearningReport {
  return {
    totalStudyMinutes: 0,
    completedLessons: 0,
    completedSections: 0,
    quizzesTaken: 0,
    averageQuizScore: 0,
    strongestTopic: null,
    weakestTopic: null,
    streak: 0,
    revisionSessions: 0,
    overallRating: "average"
  };
}

export function getFallbackLearningPredictions(): LearningPrediction {
  return {
    completionProbability: 50,
    masteryProbability: 50,
    burnoutProbability: 0,
    expectedCompletionDays: 30,
    confidence: 50
  };
}

export function getFallbackDashboard(): MentorDashboard {
  return {
    overview: {
      completion: 0,
      streak: 0,
      momentum: 0,
      mastery: 0,
      confidence: 0,
      burnout: 0
    },
    currentFocus: {
      lesson: "",
      section: "",
      priority: "medium",
      recommendation: "System Recovery Mode"
    },
    weeklySnapshot: {
      studyMinutes: 0,
      completedLessons: 0,
      quizzes: 0,
      revisionSessions: 0,
      achievements: 0
    },
    coachingSummary: {
      title: "System Fallback",
      summary: "System running in safe mode.",
      strengths: [],
      improvements: [],
      nextWeekGoal: "Continue learning."
    },
    timeline: [],
    generatedAt: Date.now()
  };
}

export function getFallbackCoachingInterventions(): CoachingIntervention[] {
  return [];
}

export function getFallbackDailyCoachSummary(): DailyCoachSummary {
  return {
    headline: "Keep Learning",
    message: "Continue your learning journey.",
    focusToday: [],
    avoidToday: [],
    estimatedStudyMinutes: 15,
    motivation: "You are doing great."
  };
}

export function getFallbackLearningAlerts(): LearningAlert[] {
  return [];
}

export function getFallbackSessionSummary(): SessionSummary {
  return {
    sessionId: "fallback_session",
    durationMinutes: 0,
    lessonsVisited: 0,
    sectionsCompleted: 0,
    quizzesAttempted: 0,
    quizAverage: 0,
    interactions: 0,
    engagement: "medium",
    productivity: 0,
    summary: "Fallback session."
  };
}

export function getFallbackCoachingEffectiveness(): CoachingEffectiveness {
  return {
    score: 0,
    previousScore: 0,
    improvement: 0,
    interventionSuccess: 0,
    recommendationAcceptance: 0,
    confidence: 0
  };
}

export function getFallbackAdaptiveReflection(): AdaptiveReflection {
  return {
    title: "Reflection",
    reflection: "No active reflection.",
    strengths: [],
    improvements: [],
    nextFocus: [],
    encouragement: "Keep going."
  };
}

export function getFallbackLearningConsistency(): LearningConsistency {
  return {
    consistency: 0,
    trend: "stable",
    attendance: 0,
    focusScore: 0,
    discipline: 0
  };
}

export function getFallbackTotalStudyTime(): number {
  return 0;
}

export function getFallbackMentorGoals(): MentorGoal[] {
  return [];
}

export function getFallbackAchievements(): Achievement[] {
  return [];
}

export function getFallbackMomentum(): LearningMomentum {
  return {
    score: 0,
    trend: "stable",
    explanation: "Fallback momentum."
  };
}

export function getFallbackStudyPlan(): StudyPlan {
  return {
    todayTasks: [],
    tomorrowTasks: [],
    weeklyGoals: [],
    estimatedStudyTime: 0,
    completionForecast: 30,
    burnoutRisk: "low",
    confidence: 0,
    generatedAt: Date.now()
  };
}

export function getFallbackLearningRisks(): LearningRisk[] {
  return [];
}

export function getFallbackMemory(): LearnerMemory {
  return {
    preferredExplanation: "detailed",
    preferredDifficulty: "medium",
    strongestTopics: [],
    weakestTopics: [],
    averageConfidence: 50,
    revisionCount: 0,
    quizTrend: "stable",
    favoriteInteractive: null,
    favouriteInteractive: null,
    averageSessionMinutes: 0,
    averageSessionDuration: 0,
    lastLesson: null,
    generatedAt: Date.now()
  };
}
