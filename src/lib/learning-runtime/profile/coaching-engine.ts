import type { LearnerProfile, LESSON_TITLES } from "./profile-service";
import type { LearnerMemory } from "./memory-service";
import type { StudyPlan } from "./study-planner";
import type { LearningRisk } from "./study-planner";
import type { Achievement, LearningMomentum } from "./mentor-engine";
import { detectLearningRisks } from "./study-planner";
import { calculateMomentum, generateAchievements } from "./mentor-engine";
import { generateStudyPlan } from "./study-planner";
import { runtimeCache } from "./cache";
import { getActiveRuntimeConfiguration } from "./runtime-config";
import { getFallbackCoachingInterventions, getFallbackDailyCoachSummary, getFallbackLearningAlerts } from "./runtime-fallback";

export interface CoachingIntervention {
  id: string;
  type:
    | "motivation"
    | "warning"
    | "celebration"
    | "reminder"
    | "recovery"
    | "achievement"
    | "study_tip";
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  message: string;
  action: string;
  reason: string;
  confidence: number;
  expiresAt: number | null;
  generatedAt: number;
}

export interface DailyCoachSummary {
  headline: string;
  message: string;
  focusToday: string[];
  avoidToday: string[];
  estimatedStudyMinutes: number;
  motivation: string;
}

export interface LearningAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  recommendation: string;
}

function _computeCoachingInterventions(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  studyPlan?: StudyPlan,
  momentum?: LearningMomentum,
  achievements?: Achievement[]
): CoachingIntervention[] {
  const interventions: CoachingIntervention[] = [];
  const now = 1700000000000; // Deterministic anchor timestamp for evaluations
  const oneDay = 86400000;

  const actualMomentum = momentum || calculateMomentum(profile, memory, progressState);
  const actualAchievements = achievements || generateAchievements(profile, memory, progressState);
  const risks = detectLearningRisks(profile, memory, progressState);

  // 1. Declining quiz trend
  if (memory.quizTrend === "declining" || profile.averageQuizScore < 60) {
    interventions.push({
      id: "coach-declining-quiz",
      type: "warning",
      priority: "high",
      title: "Quiz Performance Declining",
      message: "Your recent quiz scores show a downward trajectory. Let's stabilize foundational concepts before rushing forward.",
      action: "Take a targeted practice quiz on recent weak sections.",
      reason: "Detected declining trend in historical quiz evaluation.",
      confidence: 88,
      expiresAt: now + oneDay * 2,
      generatedAt: now,
    });
  }

  // 2. Burnout probability or fatigue risk
  const burnoutRisk = risks.find((r) => r.type === "burnout");
  if (burnoutRisk || memory.averageSessionMinutes > 50 || profile.learningVelocity > 2.5) {
    interventions.push({
      id: "coach-burnout-prevention",
      type: "recovery",
      priority: "critical",
      title: "Active Burnout Protection",
      message: burnoutRisk?.message || "You have been studying with high intensity. Cognitive overload impairs long-term retention of Vedic principles.",
      action: burnoutRisk?.recommendation || "Take a 15-minute contemplative break or switch to light audio revision.",
      reason: "High session duration or learning velocity exceeds optimal cognitive pacing.",
      confidence: 94,
      expiresAt: now + oneDay,
      generatedAt: now,
    });
  }

  // 3. Missed streak / recovery
  if (profile.streak === 0 && progressState?.lessons && Object.keys(progressState.lessons).length > 0) {
    interventions.push({
      id: "coach-streak-recovery",
      type: "recovery",
      priority: "high",
      title: "Restart Your Learning Habit",
      message: "Your daily streak was interrupted, but regular practice is the key to mastering Vedāṅga Jyotiṣa.",
      action: "Complete a quick 5-minute section today to reignite your streak.",
      reason: "Daily practice streak lapsed after prior active engagement.",
      confidence: 90,
      expiresAt: now + oneDay,
      generatedAt: now,
    });
  }

  // 4. Weak topics remediation
  if (profile.weakTopics.length > 0 || memory.weakestTopics.length > 0) {
    const weakList = profile.weakTopics.length > 0 ? profile.weakTopics : memory.weakestTopics;
    interventions.push({
      id: "coach-weak-topic-remediation",
      type: "study_tip",
      priority: "medium",
      title: `Reinforce ${weakList[0]}`,
      message: `Analysis indicates extra clarity is needed on "${weakList.slice(0, 2).join(", ")}".`,
      action: "Review conceptual summaries and interactive diagrams for this topic.",
      reason: `Identified "${weakList[0]}" below mastery thresholds.`,
      confidence: 85,
      expiresAt: now + oneDay * 3,
      generatedAt: now,
    });
  }

  // 5. Unfinished lesson reminder
  const lessons = progressState?.lessons || {};
  for (const slug of Object.keys(lessons)) {
    const l = lessons[slug];
    if (l && !l.lessonCompletedAt && l.sectionsViewed && l.sectionsViewed.length > 0 && l.masteryStatus !== "Mastered") {
      interventions.push({
        id: `coach-unfinished-${slug}`,
        type: "reminder",
        priority: "medium",
        title: "Continue In-Progress Lesson",
        message: `You started "${slug}" and completed ${l.sectionsViewed.length} sections. Finish it to lock in your understanding.`,
        action: `Resume lesson "${slug}".`,
        reason: "Active partial completion detected in progress state.",
        confidence: 92,
        expiresAt: now + oneDay * 2,
        generatedAt: now,
      });
      break; // Only surface the most recent/first unfinished lesson
    }
  }

  // 6. Revision frequency optimization
  if (memory.revisionCount < 2 && profile.completedLessons > 1) {
    interventions.push({
      id: "coach-revision-frequency",
      type: "study_tip",
      priority: "medium",
      title: "Spaced Revision Habit",
      message: `You have only completed ${memory.revisionCount} revision session across ${profile.completedLessons} completed lessons. Regular spaced repetition is critical for retaining Sanskrit terminology.`,
      action: "Begin the next unattempted lesson in your recommended path.",
      reason: `Total revisions (${memory.revisionCount}) high compared to uncompleted curriculum.`,
      confidence: 82,
      expiresAt: now + oneDay * 3,
      generatedAt: now,
    });
  }

  // 7. Achievement unlocked / celebration
  const recentlyUnlocked = actualAchievements.filter((a) => a.unlockedAt !== null);
  if (recentlyUnlocked.length > 0 && profile.streak > 0) {
    const latest = recentlyUnlocked[0];
    interventions.push({
      id: `coach-achievement-${latest.id}`,
      type: "achievement",
      priority: "low",
      title: `Milestone Unlocked: ${latest.title}`,
      message: `${latest.description} Your consistency is compounding into genuine Vedic mastery!`,
      action: "View your achievements board in the Mentor Dashboard.",
      reason: `Recently unlocked achievement badge "${latest.title}".`,
      confidence: 96,
      expiresAt: now + oneDay * 4,
      generatedAt: now,
    });
  }

  // 8. Low momentum coaching boost
  if (actualMomentum && actualMomentum.score < 40 && actualMomentum.trend === "declining") {
    interventions.push({
      id: "coach-momentum-boost",
      type: "recovery",
      priority: "high",
      title: "Momentum Recovery Plan",
      message: `Your current learning momentum score is ${actualMomentum.score}%. Let's reignite your curiosity with an interactive visualization attempt.`,
      action: "Tackle a challenging analytical quiz or advanced section.",
      reason: "Calculated momentum index exceeds peak threshold.",
      confidence: 95,
      expiresAt: now + oneDay,
      generatedAt: now,
    });
  } else if (interventions.length === 0) {
    // Default fallback motivation if no other intervention triggered
    interventions.push({
      id: "coach-daily-motivation",
      type: "motivation",
      priority: "low",
      title: "Steady Vedic Progress",
      message: "Every section studied builds an unbreakable foundation of astrological wisdom.",
      action: "Explore today's recommended study plan.",
      reason: "Routine daily coaching encouragement.",
      confidence: 80,
      expiresAt: now + oneDay,
      generatedAt: now,
    });
  }

  // Sort by priority order: critical > high > medium > low
  const priorityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  interventions.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

  return interventions;
}

export function generateCoachingInterventions(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  studyPlan?: StudyPlan,
  momentum?: LearningMomentum,
  achievements?: Achievement[]
): CoachingIntervention[] {
  if (!getActiveRuntimeConfiguration().coaching || !getActiveRuntimeConfiguration().interventions) {
    return getFallbackCoachingInterventions();
  }
  return runtimeCache.memoize("analytics", [profile, memory, progressState, studyPlan, momentum, achievements, "interventions"], () => _computeCoachingInterventions(profile, memory, progressState, studyPlan, momentum, achievements));
}

function _computeDailyCoachSummary(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  studyPlan?: StudyPlan
): DailyCoachSummary {
  const plan = studyPlan || generateStudyPlan(profile, memory, [], [], progressState);
  const todayTasks = plan.todayTasks || [];

  const focusToday: string[] = todayTasks.slice(0, 3).map((t) => t.lesson);
  if (focusToday.length === 0) {
    focusToday.push("Explore foundational concepts in Jyotiṣa as a Vedāṅga");
  }

  const avoidToday: string[] = [];
  if (memory.quizTrend === "declining") {
    avoidToday.push("Rushing through quizzes without reading explanations");
  }
  if (memory.averageSessionMinutes > 45 || profile.learningVelocity > 2) {
    avoidToday.push("Cramming multiple lessons back-to-back without breaks");
  }
  if (avoidToday.length === 0) {
    avoidToday.push("Multitasking or skipping foundational Sanskrit terminology");
  }

  const estimatedMinutes = todayTasks.reduce((sum, t) => sum + (t.estimatedDuration || 15), 0) || 20;

  let headline = "Maintain Steady Progress";
  let message = "Your personal AI Coach has optimized today's focus tasks to reinforce conceptual retention.";
  let motivation = "Patience and structured consistency reveal the deepest truths of Vedic astrology.";

  if (profile.streak >= 5) {
    headline = "Peak Learning Velocity";
    message = `Your ${profile.streak}-day streak demonstrates disciplined dedication. Today's target focuses on mastering complex synthesis.`;
    motivation = "Excellence is not an act, but a habit. Keep up your remarkable pace!";
  } else if (profile.completionPercentage === 0) {
    headline = "Welcome to Your AI Coaching Journey";
    message = "Let's establish a healthy daily study rhythm starting with core principles and definitions.";
    motivation = "A journey of a thousand leagues begins with understanding your first Vedāṅga.";
  } else if (memory.quizTrend === "declining") {

    headline = "Targeted Remediation & Recovery";
    message = "We are adjusting today's plan to fortify weak areas and ensure high confidence before advancing.";
    motivation = "Every mistake explored with curiosity is a stepping stone to permanent understanding.";
  }

  return {
    headline,
    message,
    focusToday,
    avoidToday,
    estimatedStudyMinutes: estimatedMinutes,
    motivation,
  };
}

export function generateDailyCoachSummary(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  studyPlan?: StudyPlan
): DailyCoachSummary {
  if (!getActiveRuntimeConfiguration().coaching) {
    return getFallbackDailyCoachSummary();
  }
  return runtimeCache.memoize("analytics", [profile, memory, progressState, studyPlan, "dailySummary"], () => _computeDailyCoachSummary(profile, memory, progressState, studyPlan));
}

function _computeLearningAlerts(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): LearningAlert[] {
  const alerts: LearningAlert[] = [];
  const risks = detectLearningRisks(profile, memory, progressState);

  for (const risk of risks) {
    let severity: "info" | "warning" | "critical" = "warning";
    if (risk.severity === "high") severity = "critical";
    else if (risk.severity === "low") severity = "info";

    alerts.push({
      id: `alert-risk-${risk.type}`,
      severity,
      title: risk.type === "burnout" ? "Burnout Prevention Alert" : risk.type === "stagnation" ? "Learning Stagnation Alert" : risk.type === "quiz_decline" ? "Declining Accuracy Alert" : "Learning Health Alert",
      description: risk.message || "Learning behavior requires optimization.",
      recommendation: risk.recommendation || "Review recent concepts and adjust pacing.",
    });
  }

  if (memory.quizTrend === "declining" && !alerts.some((a) => a.id.includes("declining"))) {

    alerts.push({
      id: "alert-declining-quiz",
      severity: "warning",
      title: "Declining Quiz Accuracy",
      description: "Average quiz scores over your last 3 sessions have dropped below your historical average.",
      recommendation: "Review the wrong question explanations carefully before retaking section quizzes.",
    });
  }

  if (profile.weakTopics.length > 0) {
    alerts.push({
      id: "alert-weak-topics",
      severity: "info",
      title: "Active Improvement Opportunity",
      description: `Concepts in "${profile.weakTopics.slice(0, 2).join(", ")}" have recorded lower retention scores.`,
      recommendation: "Utilize interactive Vedāṅga tools or review section flashcards.",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "alert-optimal-health",
      severity: "info",
      title: "Optimal Learning Health",
      description: "No significant learning risks, cognitive fatigue, or accuracy drops detected.",
      recommendation: "Continue following your personalized study roadmap at your current pace.",
    });
  }

  return alerts;
}

export function generateLearningAlerts(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): LearningAlert[] {
  if (!getActiveRuntimeConfiguration().coaching) {
    return getFallbackLearningAlerts();
  }
  return runtimeCache.memoize("analytics", [profile, memory, progressState, "alerts"], () => _computeLearningAlerts(profile, memory, progressState));
}

