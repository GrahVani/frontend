import type { LearnerProfile } from "./profile-service";
import { ALL_LESSONS, LESSON_TITLES, LESSON_TOPICS } from "./profile-service";
import type { LearnerMemory } from "./memory-service";
import type { AdaptiveRecommendation, LearningPathStep } from "./recommendation-engine";
import { runtimeCache } from "./cache";
import { getActiveRuntimeConfiguration } from "./runtime-config";
import { getFallbackStudyPlan, getFallbackLearningRisks } from "./runtime-fallback";

export interface StudyTask {
  lesson: string;
  lessonSlug: string;
  section?: string;
  sectionId?: string;
  estimatedDuration: number; // in minutes
  priority: "high" | "medium" | "low";
  reason: string;
  expectedOutcome: string;
  type: "continue" | "retry_quiz" | "simulation" | "reinforcement" | "revision" | "next";
}

export interface WeeklyGoal {
  id: string;
  title: string;
  targetMinutes: number;
  completedMinutes: number;
  progressPct: number; // 0 to 100
  status: "completed" | "in_progress" | "not_started";
}

export interface StudyPlan {
  todayTasks: StudyTask[];
  tomorrowTasks: StudyTask[];
  weeklyGoals: WeeklyGoal[];
  estimatedStudyTime: number; // total today in minutes
  completionForecast: number; // days until curriculum completion
  burnoutRisk: "low" | "medium" | "high";
  confidence: number;
  generatedAt: number;
}

export interface LearningRisk {
  type: "burnout" | "stagnation" | "low_confidence" | "poor_revision" | "quiz_decline";
  severity: "low" | "medium" | "high";
  message: string;
  recommendation: string;
}

/**
 * Detects potential learning risks deterministically based on profile, memory, and progress state.
 */
function _computeDetectLearningRisks(
  learnerProfile: LearnerProfile,
  learnerMemory: LearnerMemory,
  progressState: any
): LearningRisk[] {
  const risks: LearningRisk[] = [];
  const lessons = progressState?.lessons || {};

  // 1. Burnout Risk (Excessive study time or long sessions without break)
  const totalMinutes = Math.round((progressState?.totalTimeMs || 0) / 60000);
  if (totalMinutes > 120 || learnerMemory.averageSessionMinutes >= 60) {
    risks.push({
      type: "burnout",
      severity: "high",
      message: "Excessive study duration detected without adequate rest intervals.",
      recommendation: "Take a 15-minute break or switch to a light revision exercise to prevent cognitive fatigue.",
    });
  } else if (totalMinutes > 60 || learnerMemory.averageSessionMinutes >= 40) {
    risks.push({
      type: "burnout",
      severity: "medium",
      message: "Extended continuous study session detected.",
      recommendation: "Pace your study sessions in 25-minute Pomodoro blocks.",
    });
  }

  // 2. Quiz Decline Risk
  if (learnerMemory.quizTrend === "declining") {
    risks.push({
      type: "quiz_decline",
      severity: "high",
      message: "Declining performance observed across recent quiz attempts.",
      recommendation: "Re-read the lesson summaries and review wrong answers before retrying quizzes.",
    });
  }

  // 3. Stagnation Risk (Multiple unfinished lessons or inactive streak after progress)
  const inProgressCount = Object.values(lessons).filter((l: any) => l.masteryStatus === "InProgress").length;
  const hasStreakDrop = progressState?.streakDays === 0 && learnerProfile.completedLessons > 0;
  if (inProgressCount >= 2 || hasStreakDrop) {
    risks.push({
      type: "stagnation",
      severity: "medium",
      message: inProgressCount >= 2 
        ? "Multiple lessons currently started without reaching mastery." 
        : "Learning streak interrupted after making solid progress.",
      recommendation: "Focus on mastering one active lesson before starting new curriculum chapters.",
    });
  }

  // 4. Low Confidence Risk
  if (learnerProfile.confidenceScore < 60 || learnerMemory.averageConfidence < 60) {
    risks.push({
      type: "low_confidence",
      severity: "high",
      message: "Low conceptual confidence score recorded across assessments.",
      recommendation: "Use interactive visual simulations and step-by-step explanations to reinforce core ideas.",
    });
  }

  // 5. Poor Revision Risk
  if (learnerProfile.completedLessons >= 2 && learnerMemory.revisionCount === 0) {
    risks.push({
      type: "poor_revision",
      severity: "medium",
      message: "No revision sessions recorded despite mastering multiple lessons.",
      recommendation: "Schedule a 10-minute review session for previously mastered topics to prevent memory decay.",
    });
  }

  return risks;
}

export function detectLearningRisks(
  learnerProfile: LearnerProfile,
  learnerMemory: LearnerMemory,
  progressState: any
): LearningRisk[] {
  if (!getActiveRuntimeConfiguration().studyPlanner) {
    return getFallbackLearningRisks();
  }
  return runtimeCache.memoize("analytics", [learnerProfile, learnerMemory, progressState, "risks"], () => _computeDetectLearningRisks(learnerProfile, learnerMemory, progressState));
}

function _computeStudyPlan(
  learnerProfile: LearnerProfile,
  learnerMemory: LearnerMemory,
  adaptiveRecommendations: AdaptiveRecommendation[],
  learningPath: LearningPathStep[],
  progressState: any
): StudyPlan {
  const lessons = progressState?.lessons || {};
  const allTasks: StudyTask[] = [];
  const addedSlugs = new Set<string>();

  // Helper to add unique task by slug & type
  const addTask = (task: StudyTask) => {
    const key = `${task.lessonSlug}-${task.type}`;
    if (!addedSlugs.has(key)) {
      addedSlugs.add(key);
      allTasks.push(task);
    }
  };

  // Rule 1: Continue current lesson
  ALL_LESSONS.forEach((slug) => {
    const prog = lessons[slug];
    const hasFailed = prog?.attempts?.some((a: any) => !a.passed);
    if (prog && prog.masteryStatus === "InProgress" && !hasFailed) {
      addTask({
        lesson: LESSON_TITLES[slug] || slug,
        lessonSlug: slug,
        section: `Section ${Math.min(8, (prog.sectionsViewed?.length || 0) + 1)}`,
        estimatedDuration: 15,
        priority: "high",
        reason: "You have an active in-progress lesson. Continuing builds momentum.",
        expectedOutcome: "Complete remaining sections and progress towards lesson mastery.",
        type: "continue",
      });
    }
  });

  // Rule 2: Retry failed quiz
  ALL_LESSONS.forEach((slug) => {
    const prog = lessons[slug];
    const hasFailed = prog?.attempts?.some((a: any) => !a.passed);
    if (prog && hasFailed && prog.masteryStatus !== "Mastered") {
      addTask({
        lesson: LESSON_TITLES[slug] || slug,
        lessonSlug: slug,
        section: "Section 8 (Assessment)",
        estimatedDuration: 10,
        priority: "high",
        reason: "You recently attempted this assessment without reaching the 80% passing threshold.",
        expectedOutcome: "Solidify core concepts and pass the quiz assessment.",
        type: "retry_quiz",
      });
    }
  });

  // Rule 3: Finish unfinished simulation
  ALL_LESSONS.forEach((slug) => {
    const prog = lessons[slug];
    if (prog && prog.sectionsViewed?.length >= 5 && !prog.sectionsViewed?.includes("7")) {
      addTask({
        lesson: LESSON_TITLES[slug] || slug,
        lessonSlug: slug,
        section: "Section 7 (Simulation)",
        estimatedDuration: 15,
        priority: "medium",
        reason: "Interactive planetary simulation not yet completed.",
        expectedOutcome: "Gain hands-on understanding through interactive visual modeling.",
        type: "simulation",
      });
    }
  });

  // Rule 4: Weak-topic reinforcement
  const weakTopics = Array.from(new Set([...learnerProfile.weakTopics, ...learnerMemory.weakestTopics]));
  weakTopics.forEach((topic) => {
    // find lesson containing topic
    const slug = ALL_LESSONS.find((s) => LESSON_TOPICS[s]?.includes(topic)) || ALL_LESSONS[0];
    addTask({
      lesson: LESSON_TITLES[slug] || slug,
      lessonSlug: slug,
      estimatedDuration: 15,
      priority: "medium",
      reason: `Reinforce weak concept identified in recent activity: ${topic}.`,
      expectedOutcome: "Improve conceptual clarity and eliminate knowledge gaps.",
      type: "reinforcement",
    });
  });

  // Rule 5: Revision
  const masteredSlugs = ALL_LESSONS.filter((slug) => lessons[slug]?.masteryStatus === "Mastered");
  if (masteredSlugs.length > 0) {
    const revSlug = masteredSlugs[0];
    addTask({
      lesson: LESSON_TITLES[revSlug] || revSlug,
      lessonSlug: revSlug,
      estimatedDuration: 10,
      priority: "low",
      reason: "Periodic revision strengthens long-term memory retention and recall.",
      expectedOutcome: "Maintain 100% recall of foundational Vedic astrology doctrines.",
      type: "revision",
    });
  }

  // Rule 6: Next lesson
  const nextSlug = ALL_LESSONS.find((slug) => !lessons[slug] || lessons[slug]?.masteryStatus === "NotStarted") || ALL_LESSONS[0];
  addTask({
    lesson: LESSON_TITLES[nextSlug] || nextSlug,
    lessonSlug: nextSlug,
    section: "Section 1 (Introduction)",
    estimatedDuration: 20,
    priority: "medium",
    reason: "Advance your curriculum progression to new foundational doctrines.",
    expectedOutcome: "Expand your Vedic astrology knowledge base with new principles.",
    type: "next",
  });

  // Split tasks between today and tomorrow
  const todayTasks = allTasks.slice(0, Math.max(1, Math.ceil(allTasks.length / 2)));
  const tomorrowTasks = allTasks.slice(todayTasks.length);
  if (tomorrowTasks.length === 0 && allTasks.length > 0) {
    // ensure tomorrow has at least one forward-looking task
    tomorrowTasks.push({
      ...allTasks[allTasks.length - 1],
      reason: "Scheduled follow-up study session for tomorrow.",
    });
  }

  // Calculate estimated study time today
  const estimatedStudyTime = todayTasks.reduce((sum, t) => sum + t.estimatedDuration, 0);

  // Calculate completion forecast (days)
  const unmasteredCount = ALL_LESSONS.length - learnerProfile.completedLessons;
  const completionForecast = unmasteredCount === 0 
    ? 0 
    : Math.max(1, Math.ceil(unmasteredCount * (learnerProfile.learningVelocity > 0 ? Math.min(4, 1 / learnerProfile.learningVelocity) : 2)));

  // Weekly goals
  const totalMinutesLogged = Math.round((progressState?.totalTimeMs || 0) / 60000);
  const weeklyGoals: WeeklyGoal[] = [
    {
      id: "goal-time",
      title: "Weekly Study Target",
      targetMinutes: 120,
      completedMinutes: Math.min(120, totalMinutesLogged),
      progressPct: Math.min(100, Math.round((totalMinutesLogged / 120) * 100)),
      status: totalMinutesLogged >= 120 ? "completed" : totalMinutesLogged > 0 ? "in_progress" : "not_started",
    },
    {
      id: "goal-quiz",
      title: "Quiz Mastery Average",
      targetMinutes: 80, // represents target score %
      completedMinutes: Math.round(learnerProfile.averageQuizScore),
      progressPct: Math.min(100, Math.round((learnerProfile.averageQuizScore / 80) * 100)),
      status: learnerProfile.averageQuizScore >= 80 ? "completed" : learnerProfile.averageQuizScore > 0 ? "in_progress" : "not_started",
    },
    {
      id: "goal-streak",
      title: "Consistency Streak",
      targetMinutes: 5, // 5 days target
      completedMinutes: Math.min(5, progressState?.streakDays || 0),
      progressPct: Math.min(100, Math.round(((progressState?.streakDays || 0) / 5) * 100)),
      status: (progressState?.streakDays || 0) >= 5 ? "completed" : (progressState?.streakDays || 0) > 0 ? "in_progress" : "not_started",
    },
  ];

  // Evaluate Burnout Risk from detected risks
  const risks = detectLearningRisks(learnerProfile, learnerMemory, progressState);
  const burnoutRiskObj = risks.find((r) => r.type === "burnout");
  const burnoutRisk: "low" | "medium" | "high" = burnoutRiskObj ? burnoutRiskObj.severity : "low";

  return {
    todayTasks,
    tomorrowTasks,
    weeklyGoals,
    estimatedStudyTime,
    completionForecast,
    burnoutRisk,
    confidence: learnerProfile.confidenceScore,
    generatedAt: Date.now(),
  };
}

export function generateStudyPlan(
  learnerProfile: LearnerProfile,
  learnerMemory: LearnerMemory,
  adaptiveRecommendations: AdaptiveRecommendation[],
  learningPath: LearningPathStep[],
  progressState: any
): StudyPlan {
  if (!getActiveRuntimeConfiguration().studyPlanner) {
    return getFallbackStudyPlan();
  }
  return runtimeCache.memoize("analytics", [learnerProfile, learnerMemory, adaptiveRecommendations, learningPath, progressState, "studyPlan"], () => _computeStudyPlan(learnerProfile, learnerMemory, adaptiveRecommendations, learningPath, progressState));
}

