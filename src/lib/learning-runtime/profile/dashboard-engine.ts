import type { LearnerProfile } from "./profile-service";
import { LESSON_TITLES, generateLearnerRecommendation, generateAdaptiveRecommendations, generateLearningPath } from "./profile-service";
import type { LearnerMemory } from "./memory-service";
import { aggregateLearnerMemory } from "./memory-service";
import type { StudyPlan } from "./study-planner";
import { generateStudyPlan } from "./study-planner";
import type { MentorGoal, Achievement, LearningMomentum } from "./mentor-engine";
import { generateMentorGoals, generateAchievements, calculateMomentum } from "./mentor-engine";
import type { WeeklyLearningReport, LearningPrediction } from "./analytics-engine";
import { generateWeeklyLearningReport, predictLearningOutcome } from "./analytics-engine";
import type { LearningPathStep } from "./recommendation-engine";
import { runtimeCache } from "./cache";
import { getActiveRuntimeConfiguration } from "./runtime-config";
import { getFallbackDashboard } from "./runtime-fallback";

export interface DashboardOverview {
  completion: number;
  streak: number;
  momentum: number;
  mastery: number;
  confidence: number;
  burnout: number;
}

export interface DashboardFocus {
  lesson: string;
  section: string;
  recommendation: string;
  priority: string;
}

export interface WeeklySnapshot {
  studyMinutes: number;
  completedLessons: number;
  quizzes: number;
  revisionSessions: number;
  achievements: number;
}

export interface CoachingSummary {
  title: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  nextWeekGoal: string;
}

export interface MentorTimelineItem {
  id: string;
  type: "lesson" | "quiz" | "revision" | "achievement" | "study" | "recommendation";
  title: string;
  description: string;
  timestamp: number;
  status: "completed" | "active" | "upcoming";
}

export interface MentorDashboard {
  overview: DashboardOverview;
  timeline: MentorTimelineItem[];
  currentFocus: DashboardFocus;
  weeklySnapshot: WeeklySnapshot;
  coachingSummary: CoachingSummary;
  generatedAt: number;
}

function _computeMentorDashboard(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  studyPlan?: StudyPlan,
  mentorGoals?: MentorGoal[],
  achievements?: Achievement[],
  momentum?: LearningMomentum,
  weeklyReport?: WeeklyLearningReport,
  prediction?: LearningPrediction,
  learningPath?: LearningPathStep[]
): MentorDashboard {
  const sp = studyPlan || generateStudyPlan(
    profile,
    memory,
    generateAdaptiveRecommendations(profile, progressState),
    generateLearningPath(profile, progressState),
    progressState
  );
  const mg = mentorGoals || generateMentorGoals(profile, memory, progressState);
  const ach = achievements || generateAchievements(profile, memory, progressState);
  const mom = momentum || calculateMomentum(profile, memory, progressState);
  const wr = weeklyReport || generateWeeklyLearningReport(profile, memory, progressState);
  const pred = prediction || predictLearningOutcome(profile, memory, progressState, sp, mom);
  const path = learningPath || generateLearningPath(profile, progressState);

  // 1. Overview
  const overview: DashboardOverview = {
    completion: profile.completionPercentage,
    streak: profile.streak,
    momentum: mom.score,
    mastery: pred.masteryProbability,
    confidence: profile.confidenceScore,
    burnout: pred.burnoutProbability,
  };

  // 2. Current Focus
  let currentFocus: DashboardFocus;
  if (sp.todayTasks.length > 0) {
    const task = sp.todayTasks[0];
    currentFocus = {
      lesson: task.lesson,
      section: task.section || "Key Section Focus",
      recommendation: task.reason || task.expectedOutcome,
      priority: task.priority,
    };
  } else {
    const rec = generateLearnerRecommendation(profile, progressState);
    const lessonSlug = rec.recommendedNextLesson || "jyotisha-as-vedanga";
    currentFocus = {
      lesson: LESSON_TITLES[lessonSlug] || lessonSlug,
      section: "Concept Study & Mastery",
      recommendation: rec.reason,
      priority: rec.priority,
    };
  }

  // 3. Weekly Snapshot
  const unlockedAchievementsCount = ach.filter((a) => a.unlocked).length;
  const weeklySnapshot: WeeklySnapshot = {
    studyMinutes: wr.totalStudyMinutes,
    completedLessons: wr.completedLessons,
    quizzes: wr.quizzesTaken,
    revisionSessions: wr.revisionSessions,
    achievements: unlockedAchievementsCount,
  };

  // 4. Coaching Summary
  let coachingTitle = "Steady Progress & Consolidation";
  if (mom.trend === "rising") {
    coachingTitle = "Exemplary Learning Rhythm";
  } else if (mom.trend === "declining") {
    coachingTitle = "Needs Focus & Active Revision";
  }

  const strengths = (memory.strongestTopics.length > 0
    ? memory.strongestTopics
    : profile.masteredTopics.length > 0
    ? profile.masteredTopics
    : ["Consistent Daily Engagement", "Foundational Concepts"]).slice(0, 3);

  const improvements = (memory.weakestTopics.length > 0
    ? memory.weakestTopics
    : profile.weakTopics.length > 0
    ? profile.weakTopics
    : ["Regular Assessment Practice", "Section Summaries"]).slice(0, 3);

  const nextWeekGoal = mg.find((g) => g.type === "weekly")?.title || "Complete 2 lessons and score >80% on section assessments.";

  const coachingSummary: CoachingSummary = {
    title: coachingTitle,
    summary: `You have maintained a ${profile.streak}-day streak with a learning momentum of ${mom.score}%. Based on your current trajectory, completion is estimated in ${pred.expectedCompletionDays} days.`,
    strengths,
    improvements,
    nextWeekGoal,
  };

  // 5. Timeline
  const timeline: MentorTimelineItem[] = [];
  const now = Date.now();
  const lessonsMap = progressState?.lessons || {};

  // Add completed items
  ach.filter((a) => a.unlocked).forEach((a, idx) => {
    timeline.push({
      id: `ach-${a.id}`,
      type: "achievement",
      title: `Milestone Unlocked: ${a.title}`,
      description: a.description,
      timestamp: now - (idx + 1) * 3600000 * 6,
      status: "completed",
    });
  });

  Object.keys(lessonsMap).forEach((slug, idx) => {
    const l = lessonsMap[slug];
    const lessonTitle = LESSON_TITLES[slug] || slug;
    if (l.masteryStatus === "Mastered") {
      timeline.push({
        id: `completed-${slug}`,
        type: "lesson",
        title: `Completed: ${lessonTitle}`,
        description: "Lesson mastered with verified comprehension and assessment success.",
        timestamp: l.lessonCompletedAt || now - (idx + 1) * 86400000,
        status: "completed",
      });
    } else if (l.sectionsViewed && l.sectionsViewed.length > 0) {
      timeline.push({
        id: `active-${slug}`,
        type: "study",
        title: `Active Study: ${lessonTitle}`,
        description: `Progressing steadily: ${l.sectionsViewed.length} sections explored.`,
        timestamp: now,
        status: "active",
      });
    }
  });

  // Ensure at least one active item exists if none matched
  if (!timeline.some((t) => t.status === "active")) {
    timeline.push({
      id: "active-focus",
      type: "recommendation",
      title: `Current Priority: ${currentFocus.lesson}`,
      description: currentFocus.recommendation,
      timestamp: now,
      status: "active",
    });
  }

  // Add upcoming items from learning path
  const activeAndCompletedSlugs = new Set(
    Object.keys(lessonsMap).filter((s) => lessonsMap[s].sectionsViewed?.length > 0)
  );

  let upcomingCount = 0;
  for (const step of path) {
    if (!activeAndCompletedSlugs.has(step.lessonSlug) && upcomingCount < 3) {
      timeline.push({
        id: `upcoming-${step.lessonSlug}`,
        type: "lesson",
        title: `Upcoming: ${step.title}`,
        description: step.reason || "Scheduled next in your personalized Vedic astrology curriculum.",
        timestamp: now + (upcomingCount + 1) * 86400000,
        status: "upcoming",
      });
      upcomingCount++;
    }
  }

  // Fallback upcoming if path is exhausted or all active
  if (upcomingCount === 0) {
    timeline.push({
      id: "upcoming-advanced-review",
      type: "revision",
      title: "Upcoming: Comprehensive Synthesis & Review",
      description: "Review cross-module concepts across all mastered Vedāṅga principles.",
      timestamp: now + 86400000,
      status: "upcoming",
    });
  }

  // Sort timeline chronologically (completed -> active -> upcoming)
  const statusOrder: Record<MentorTimelineItem["status"], number> = {
    completed: 1,
    active: 2,
    upcoming: 3,
  };

  timeline.sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return b.timestamp - a.timestamp;
  });

  return {
    overview,
    timeline,
    currentFocus,
    weeklySnapshot,
    coachingSummary,
    generatedAt: now,
  };
}

export function generateMentorDashboard(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any,
  studyPlan?: StudyPlan,
  mentorGoals?: MentorGoal[],
  achievements?: Achievement[],
  momentum?: LearningMomentum,
  weeklyReport?: WeeklyLearningReport,
  prediction?: LearningPrediction,
  learningPath?: LearningPathStep[]
): MentorDashboard {
  if (!getActiveRuntimeConfiguration().dashboard) {
    return getFallbackDashboard();
  }
  return runtimeCache.memoize(
    "dashboard",
    [profile, memory, progressState, studyPlan, mentorGoals, achievements, momentum, weeklyReport, prediction, learningPath],
    () => _computeMentorDashboard(profile, memory, progressState, studyPlan, mentorGoals, achievements, momentum, weeklyReport, prediction, learningPath)
  );
}

