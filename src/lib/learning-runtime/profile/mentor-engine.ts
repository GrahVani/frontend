import type { LearnerProfile } from "./profile-service";
import type { LearnerMemory } from "./memory-service";
import { ALL_LESSONS } from "./profile-service";
import { runtimeCache } from "./cache";
import { getActiveRuntimeConfiguration } from "./runtime-config";
import { getFallbackMentorGoals, getFallbackAchievements, getFallbackMomentum } from "./runtime-fallback";

export interface MentorGoal {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "mastery" | "revision" | "quiz" | "streak";
  progress: number;
  target: number;
  status: "not_started" | "in_progress" | "completed";
  priority: "high" | "medium" | "low";
  estimatedCompletion: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt: number | null;
  icon: string;
  category: "progress" | "quiz" | "streak" | "mastery" | "revision";
}

export interface LearningMomentum {
  score: number;
  trend: "rising" | "stable" | "declining";
  explanation: string;
}

/**
 * Generates personalized learning goals for the AI Mentor based on profile and memory.
 */
function _computeMentorGoals(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): MentorGoal[] {
  const goals: MentorGoal[] = [];
  const lessons = progressState?.lessons || {};
  const totalTimeMinutes = Math.round((progressState?.totalTimeMs || 0) / (60 * 1000));

  // 1. Finish Lesson Goal (daily)
  let currentLessonProgressPct = 0;
  const activeLessonSlug = ALL_LESSONS.find((slug) => {
    const progress = lessons[slug];
    return progress && progress.sectionsViewed?.length > 0 && progress.masteryStatus !== "Mastered";
  });

  if (activeLessonSlug) {
    const progress = lessons[activeLessonSlug];
    const viewedCount = progress.sectionsViewed?.length || 0;
    currentLessonProgressPct = Math.min(100, Math.round((viewedCount / 8) * 100));
  } else if (profile.completedLessons > 0 && profile.completedLessons < profile.totalLessons) {
    currentLessonProgressPct = 25;
  }

  goals.push({
    id: "goal-finish-lesson",
    title: "Complete Current Lesson",
    description: "Finish reading all sections and pass the assessment of your active module",
    type: "daily",
    progress: currentLessonProgressPct,
    target: 100,
    status: currentLessonProgressPct >= 100 ? "completed" : currentLessonProgressPct > 0 ? "in_progress" : "not_started",
    priority: "high",
    estimatedCompletion: 1,
  });

  // 2. Maintain Streak Goal (streak)
  const streakProgress = Math.min(7, profile.streak);
  goals.push({
    id: "goal-maintain-streak",
    title: "7-Day Learning Streak",
    description: "Maintain a daily learning streak of 7 consecutive days",
    type: "streak",
    progress: streakProgress,
    target: 7,
    status: profile.streak >= 7 ? "completed" : profile.streak > 0 ? "in_progress" : "not_started",
    priority: "high",
    estimatedCompletion: Math.max(0, 7 - profile.streak),
  });

  // 3. Weekly Study Time Goal (weekly)
  const weeklyTimeProgress = Math.min(120, totalTimeMinutes);
  goals.push({
    id: "goal-weekly-time",
    title: "120 Minutes Weekly Study",
    description: "Dedicate 120 minutes to Vedic astrology study this week",
    type: "weekly",
    progress: weeklyTimeProgress,
    target: 120,
    status: weeklyTimeProgress >= 120 ? "completed" : weeklyTimeProgress > 0 ? "in_progress" : "not_started",
    priority: "medium",
    estimatedCompletion: Math.ceil(Math.max(0, 120 - weeklyTimeProgress) / 30),
  });

  // 4. Quiz Score Goal (quiz)
  goals.push({
    id: "goal-quiz-score",
    title: "85% Average Quiz Accuracy",
    description: "Achieve an average score of 85% or higher across all module quizzes",
    type: "quiz",
    progress: profile.averageQuizScore,
    target: 85,
    status: profile.averageQuizScore >= 85 && profile.completedLessons > 0 ? "completed" : profile.averageQuizScore > 0 ? "in_progress" : "not_started",
    priority: profile.averageQuizScore < 70 && profile.completedLessons > 0 ? "high" : "medium",
    estimatedCompletion: 2,
  });

  // 5. Mastery Goal (mastery)
  const masteryProgress = Math.min(5, profile.completedLessons);
  goals.push({
    id: "goal-mastery",
    title: "Master 5 Core Lessons",
    description: "Successfully master 5 Vedic astrology curriculum modules",
    type: "mastery",
    progress: masteryProgress,
    target: 5,
    status: profile.completedLessons >= 5 ? "completed" : profile.completedLessons > 0 ? "in_progress" : "not_started",
    priority: "medium",
    estimatedCompletion: Math.max(0, 5 - profile.completedLessons) * 2,
  });

  // 6. Revision Goal (revision)
  const revisionProgress = Math.min(3, memory.revisionCount);
  goals.push({
    id: "goal-revision",
    title: "Complete 3 Revision Sessions",
    description: "Review foundational summaries and retry quizzes to reinforce memory",
    type: "revision",
    progress: revisionProgress,
    target: 3,
    status: memory.revisionCount >= 3 ? "completed" : memory.revisionCount > 0 ? "in_progress" : "not_started",
    priority: "low",
    estimatedCompletion: Math.max(0, 3 - memory.revisionCount),
  });

  return goals;
}

export function generateMentorGoals(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): MentorGoal[] {
  if (!getActiveRuntimeConfiguration().mentor) {
    return getFallbackMentorGoals();
  }
  return runtimeCache.memoize("analytics", [profile, memory, progressState, "mentorGoals"], () => _computeMentorGoals(profile, memory, progressState));
}

function _computeAchievements(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): Achievement[] {
  const lessons = progressState?.lessons || {};
  const allAttempts: { scorePct: number; attemptedAt: number }[] = [];
  let simCount = 0;

  Object.values(lessons).forEach((l: any) => {
    if (l.attempts && Array.isArray(l.attempts)) {
      l.attempts.forEach((a: any) => {
        allAttempts.push({
          scorePct: typeof a.scorePct === "number" ? a.scorePct : 0,
          attemptedAt: typeof a.attemptedAt === "number" ? a.attemptedAt : Date.now(),
        });
      });
    }
    if (l.sectionsViewed && Array.isArray(l.sectionsViewed) && l.sectionsViewed.includes("7")) {
      simCount++;
    }
  });

  const hasPerfectQuiz = allAttempts.some((a) => a.scorePct >= 0.99 || a.scorePct === 100);
  const firstCompletedLesson = Object.values(lessons).find((l: any) => l.masteryStatus === "Mastered");
  const firstCompletedAt = firstCompletedLesson ? ((firstCompletedLesson as any).lessonCompletedAt || Date.now()) : null;

  return [
    {
      id: "ach-first-lesson",
      title: "First Lesson",
      description: "Complete your very first Vedic astrology lesson",
      unlocked: profile.completedLessons >= 1,
      unlockedAt: profile.completedLessons >= 1 ? firstCompletedAt : null,
      icon: "BookOpen",
      category: "progress",
    },
    {
      id: "ach-quiz-master",
      title: "Quiz Master",
      description: "Achieve a perfect 100% score on any module assessment",
      unlocked: hasPerfectQuiz,
      unlockedAt: hasPerfectQuiz ? Date.now() : null,
      icon: "Award",
      category: "quiz",
    },
    {
      id: "ach-7-day-streak",
      title: "7 Day Streak",
      description: "Maintain a 7-day continuous study streak",
      unlocked: profile.streak >= 7,
      unlockedAt: profile.streak >= 7 ? Date.now() : null,
      icon: "Flame",
      category: "streak",
    },
    {
      id: "ach-100-module",
      title: "100% Module",
      description: "Fully master all sections and quizzes of an entire module",
      unlocked: profile.completedLessons >= 1,
      unlockedAt: profile.completedLessons >= 1 ? firstCompletedAt : null,
      icon: "Target",
      category: "mastery",
    },
    {
      id: "ach-revision-expert",
      title: "Revision Expert",
      description: "Complete 5 or more revision sessions across your studies",
      unlocked: memory.revisionCount >= 5,
      unlockedAt: memory.revisionCount >= 5 ? Date.now() : null,
      icon: "Repeat",
      category: "revision",
    },
    {
      id: "ach-sim-champion",
      title: "Simulation Champion",
      description: "Engage with visual interactive tools and simulations across 3+ lessons",
      unlocked: simCount >= 3 || (memory.favoriteInteractive !== null && profile.completedLessons >= 2),
      unlockedAt: (simCount >= 3 || (memory.favoriteInteractive !== null && profile.completedLessons >= 2)) ? Date.now() : null,
      icon: "Sparkles",
      category: "progress",
    },
  ];
}

export function generateAchievements(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): Achievement[] {
  if (!getActiveRuntimeConfiguration().mentor || !getActiveRuntimeConfiguration().achievements) {
    return getFallbackAchievements();
  }
  return runtimeCache.memoize("analytics", [profile, memory, progressState, "achievements"], () => _computeAchievements(profile, memory, progressState));
}

function _computeMomentum(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): LearningMomentum {
  let rawScore = 50;

  // Streak contribution
  if (profile.streak >= 7) rawScore += 20;
  else if (profile.streak >= 3) rawScore += 15;
  else if (profile.streak >= 1) rawScore += 10;
  else rawScore -= 10;

  // Recent activity
  if (profile.recentlyViewedLessons.length >= 2) rawScore += 10;
  else if (profile.recentlyViewedLessons.length === 1) rawScore += 5;

  // Quiz trend contribution
  if (memory.quizTrend === "improving") rawScore += 15;
  else if (memory.quizTrend === "stable") rawScore += 5;
  else if (memory.quizTrend === "declining") rawScore -= 15;

  // Completion velocity
  if (profile.learningVelocity > 1) rawScore += 10;
  else if (profile.learningVelocity > 0.5) rawScore += 5;

  // Revision consistency
  if (memory.revisionCount >= 3) rawScore += 5;
  else if (memory.revisionCount > 0) rawScore += 2;

  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let trend: "rising" | "stable" | "declining" = "stable";
  if (memory.quizTrend === "improving" && profile.streak >= 2) {
    trend = "rising";
  } else if (memory.quizTrend === "declining" || profile.streak === 0 || score < 40) {
    trend = "declining";
  } else if (score >= 70) {
    trend = "rising";
  }

  let explanation = "You are maintaining a steady, reliable pace through the Vedic astrology curriculum.";
  if (trend === "rising") {
    explanation = "Your learning velocity and quiz scores are trending upwards. Exceptional dedication and momentum!";
  } else if (trend === "declining") {
    explanation = "Recent assessment scores or study intervals show a slight dip. Try a quick revision session to rebuild momentum.";
  }

  return {
    score,
    trend,
    explanation,
  };
}

export function calculateMomentum(
  profile: LearnerProfile,
  memory: LearnerMemory,
  progressState: any
): LearningMomentum {
  if (!getActiveRuntimeConfiguration().mentor) {
    return getFallbackMomentum();
  }
  return runtimeCache.memoize("analytics", [profile, memory, progressState, "momentum"], () => _computeMomentum(profile, memory, progressState));
}

