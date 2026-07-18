import type { LearnerProfile } from "./profile-service";
import type { LearnerMemory } from "./memory-service";
import type { CoachingIntervention } from "./coaching-engine";
import { runtimeCache } from "./cache";
import { getActiveRuntimeConfiguration } from "./runtime-config";
import { getFallbackSessionSummary, getFallbackCoachingEffectiveness, getFallbackAdaptiveReflection, getFallbackLearningConsistency } from "./runtime-fallback";

export interface SessionSummary {
  sessionId: string;
  durationMinutes: number;
  lessonsVisited: number;
  sectionsCompleted: number;
  quizzesAttempted: number;
  quizAverage: number;
  interactions: number;
  engagement: "low" | "medium" | "high";
  productivity: number;
  summary: string;
}

export interface CoachingEffectiveness {
  score: number;
  previousScore: number;
  improvement: number;
  interventionSuccess: number;
  recommendationAcceptance: number;
  confidence: number;
}

export interface AdaptiveReflection {
  title: string;
  reflection: string;
  strengths: string[];
  improvements: string[];
  nextFocus: string[];
  encouragement: string;
}

export interface LearningConsistency {
  consistency: number;
  trend: "improving" | "stable" | "declining";
  attendance: number;
  focusScore: number;
  discipline: number;
}

/**
 * Generates a deterministic summary of the learner's current or accumulated study session.
 */
function _computeSessionSummary(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  currentSessionId?: string
): SessionSummary {
  const sessionId = currentSessionId || `session-default-${Math.abs(1700000000000 % 100000)}`;
  const durationMinutes = Math.max(12, Math.round(memory.averageSessionMinutes || 25));

  const lessonsMap = progressState?.lessons || {};
  const lessonSlugs = Object.keys(lessonsMap);
  const lessonsVisited = Math.max(lessonSlugs.length, profile.completedLessons + (profile.completionPercentage > 0 ? 1 : 0));

  let sectionsCompleted = 0;
  let quizzesAttempted = 0;

  for (const slug of lessonSlugs) {
    const lessonData = lessonsMap[slug];
    if (lessonData) {
      if (Array.isArray(lessonData.sectionsViewed)) {
        sectionsCompleted += lessonData.sectionsViewed.length;
      }
      if (Array.isArray(lessonData.attempts)) {
        quizzesAttempted += lessonData.attempts.length;
      }
    }
  }

  if (sectionsCompleted === 0 && profile.completionPercentage > 0) {
    sectionsCompleted = Math.max(2, Math.round(profile.completedLessons * 4));
  }
  if (quizzesAttempted === 0 && profile.averageQuizScore > 0) {
    quizzesAttempted = Math.max(1, profile.completedLessons);
  }

  const quizAverage = Math.round(profile.averageQuizScore || 0);
  const interactions = Math.max(5, sectionsCompleted * 3 + quizzesAttempted * 4 + (profile.streak > 0 ? 3 : 0));

  let engagement: "low" | "medium" | "high" = "medium";
  if (durationMinutes >= 25 || interactions >= 18) {
    engagement = "high";
  } else if (durationMinutes < 15 && interactions < 8) {
    engagement = "low";
  }

  const baseProductivity = Math.round(
    (sectionsCompleted * 15 + quizzesAttempted * 20 + quizAverage * 0.45) / Math.max(1, durationMinutes / 15)
  );
  const productivity = Math.min(100, Math.max(35, baseProductivity || Math.round(profile.confidenceScore || 75)));

  const summary = `Engaged in ${durationMinutes} minutes of study across ${lessonsVisited} lesson(s), viewing ${sectionsCompleted} section(s) and completing ${quizzesAttempted} quiz assessment(s) with an average score of ${quizAverage}%. Overall productivity index is ${productivity}% (${engagement} engagement).`;

  return {
    sessionId,
    durationMinutes,
    lessonsVisited,
    sectionsCompleted,
    quizzesAttempted,
    quizAverage,
    interactions,
    engagement,
    productivity,
    summary,
  };
}

export function generateSessionSummary(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  currentSessionId?: string
): SessionSummary {
  if (!getActiveRuntimeConfiguration().sessionIntelligence) {
    return getFallbackSessionSummary();
  }
  return runtimeCache.memoize("session", [profile, memory, progressState, currentSessionId, "summary"], () => _computeSessionSummary(profile, memory, progressState, currentSessionId));
}

function _computeCoachingEffectiveness(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  interventions?: CoachingIntervention[]
): CoachingEffectiveness {
  const lessonsMap = progressState?.lessons || {};
  const hasActivity = Object.keys(lessonsMap).length > 0 || profile.completedLessons > 0 || profile.streak > 0;

  const baseAcceptance = hasActivity
    ? Math.min(98, Math.max(65, Math.round(profile.completedLessons * 12 + memory.revisionCount * 10 + (profile.streak > 0 ? 45 : 30))))
    : 60;
  const recommendationAcceptance = Math.round(baseAcceptance);

  const quizFactor = profile.averageQuizScore > 0 ? profile.averageQuizScore : 75;
  const interventionSuccess = Math.min(100, Math.max(50, Math.round(quizFactor * 0.55 + recommendationAcceptance * 0.45)));

  const score = Math.min(
    100,
    Math.max(45, Math.round(interventionSuccess * 0.45 + recommendationAcceptance * 0.35 + profile.confidenceScore * 0.20))
  );

  let previousScore = Math.round(score * 0.92);
  if (memory.quizTrend === "declining") {
    previousScore = Math.min(100, Math.round(score * 1.08));
  } else if (memory.quizTrend === "improving" || profile.streak >= 3) {
    previousScore = Math.max(30, Math.round(score * 0.86));
  }

  const improvement = Math.round(score - previousScore);
  const confidence = Math.min(98, Math.max(70, Math.round(profile.completedLessons * 8 + profile.streak * 4 + 72)));

  return {
    score,
    previousScore,
    improvement,
    interventionSuccess,
    recommendationAcceptance,
    confidence,
  };
}

export function evaluateCoachingEffectiveness(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  interventions?: CoachingIntervention[]
): CoachingEffectiveness {
  if (!getActiveRuntimeConfiguration().sessionIntelligence) {
    return getFallbackCoachingEffectiveness();
  }
  return runtimeCache.memoize("session", [profile, memory, progressState, interventions, "effectiveness"], () => _computeCoachingEffectiveness(profile, memory, progressState, interventions));
}

function _computeAdaptiveReflection(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  effectiveness?: CoachingEffectiveness
): AdaptiveReflection {
  let title = "Building Foundation across the Six Vedāṅgas";
  if (profile.streak >= 3) {
    title = "Deepening Vedic Insight and Habitual Mastery";
  } else if (memory.quizTrend === "improving") {
    title = "Accelerating Conceptual Clarity and Precision";
  } else if (memory.quizTrend === "declining") {
    title = "Refocusing on Core Definitions and Spaced Review";
  }

  const strengths: string[] = [];
  if (memory.strongestTopics && memory.strongestTopics.length > 0) {
    strengths.push(...memory.strongestTopics.slice(0, 3));
  } else if (profile.completedLessons > 0 || profile.streak > 0) {
    strengths.push(
      "Consistent progression through curriculum sections",
      "Sustained engagement with interactive visualizations",
      "Solid recall of basic astronomical foundations"
    );
  } else {
    strengths.push(
      "Initial onboarding enthusiasm and structured curiosity",
      "Active navigation through lesson modules",
      "Willingness to engage with diagnostic assessments"
    );
  }

  const improvements: string[] = [];
  if (memory.weakestTopics && memory.weakestTopics.length > 0) {
    improvements.push(...memory.weakestTopics.slice(0, 3));
  } else if (memory.quizTrend === "declining" || profile.averageQuizScore < 65) {
    improvements.push(
      "Reading section breakdowns completely before attempting quizzes",
      "Taking cooldown intervals to consolidate newly learned Sanskrit terms",
      "Revisiting incorrect options to understand underlying mechanics"
    );
  } else {
    improvements.push(
      "Expanding spaced repetition intervals for foundational terms",
      "Connecting individual limb mechanics to full astrological synthesis",
      "Synthesizing planetary attributes across multiple conceptual domains"
    );
  }

  const nextFocus: string[] = [
    `Advance to or master: ${(profile as any).recommendedNextLesson || "Jyotiṣa as a Vedāṅga"}`,
    "Interact with dynamic orbital visualizations to solidify conceptual mapping",
    "Complete structured section checks to maintain high recall velocity",
  ];

  const effScore = effectiveness ? effectiveness.score : 82;
  const topStrength = strengths[0] || "disciplined focus";
  const topImprovement = improvements[0] || "core terminology retention";

  const reflection = `Your learning profile demonstrates steady upward growth with a coaching effectiveness rating of ${effScore}%. You have established remarkable strength in ${topStrength}. To elevate your mastery toward advanced chart synthesis, focus your analytical attention on ${topImprovement}. Every interaction with your AI Mentor strengthens your personalized learning loop.`;

  const encouragement = "In Vedic tradition, consistency is the true vessel of wisdom. Trust your disciplined daily rhythm—every conceptual connection built today illuminates the entire cosmic architecture.";

  return {
    title,
    reflection,
    strengths,
    improvements,
    nextFocus,
    encouragement,
  };
}

export function generateAdaptiveReflection(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  effectiveness?: CoachingEffectiveness
): AdaptiveReflection {
  if (!getActiveRuntimeConfiguration().sessionIntelligence) {
    return getFallbackAdaptiveReflection();
  }
  return runtimeCache.memoize("session", [profile, memory, progressState, effectiveness, "reflection"], () => _computeAdaptiveReflection(profile, memory, progressState, effectiveness));
}

function _computeLearningConsistency(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): LearningConsistency {
  const lessonsMap = progressState?.lessons || {};
  const hasLessons = Object.keys(lessonsMap).length > 0 || profile.completedLessons > 0;

  const attendance = Math.min(100, Math.max(35, Math.round(profile.streak * 14 + (hasLessons ? 48 : 25))));
  const focusScore = Math.min(100, Math.max(40, Math.round(profile.confidenceScore * 0.55 + profile.averageQuizScore * 0.45 || 75)));
  const discipline = Math.min(100, Math.max(45, Math.round(attendance * 0.40 + focusScore * 0.45 + (memory.revisionCount > 0 ? 15 : 10))));

  const consistency = Math.min(100, Math.max(40, Math.round(attendance * 0.35 + focusScore * 0.35 + discipline * 0.30)));

  let trend: "improving" | "stable" | "declining" = "stable";
  if (profile.streak >= 3 || memory.quizTrend === "improving") {
    trend = "improving";
  } else if (memory.quizTrend === "declining") {
    trend = "declining";
  }

  return {
    consistency,
    trend,
    attendance,
    focusScore,
    discipline,
  };
}

export function calculateLearningConsistency(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): LearningConsistency {
  if (!getActiveRuntimeConfiguration().sessionIntelligence) {
    return getFallbackLearningConsistency();
  }
  return runtimeCache.memoize("session", [profile, memory, progressState, "consistency"], () => _computeLearningConsistency(profile, memory, progressState));
}

