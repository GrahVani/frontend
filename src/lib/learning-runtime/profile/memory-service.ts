import type { LearnerProfile } from "./profile-service";
import { ALL_LESSONS, LESSON_TITLES, LESSON_TOPICS, aggregateLearnerProfile } from "./profile-service";
import { runtimeCache } from "./cache";
import { getActiveRuntimeConfiguration } from "./runtime-config";
import { getFallbackMemory } from "./runtime-fallback";

export interface LearnerMemory {
  preferredExplanation: "visual" | "step_by_step" | "short" | "detailed";
  preferredDifficulty: "easy" | "medium" | "advanced";
  strongestTopics: string[];
  weakestTopics: string[];
  revisionCount: number;
  averageConfidence: number;
  quizTrend: "improving" | "stable" | "declining";
  lastLesson: string | null;
  favoriteInteractive: string | null;
  favouriteInteractive: string | null; // British English spelling alias
  averageSessionMinutes: number;
  averageSessionDuration: number; // alias
  generatedAt: number;
}

const INTERACTIVE_MAP: Record<string, string> = {
  "jyotisha-as-vedanga": "Vedanga Body Map",
  "the-six-vedangas-and-their-relationship": "Six Vedangas Relational Matrix",
  "jyotisha-vs-western-astrology-vs-pop-astrology": "Zodiac Comparison Explorer",
  "philosophy-of-karma-and-prediction": "Karma & Destiny Simulation",
  "the-historical-timeline-of-jyotisha": "Chronological Lineage Interactive",
  "parashara-the-foundational-rishi": "Parashara Doctrine Simulator",
  "varahamihira-the-systematic-codifier": "Varahamihira Canon Explorer",
  "medieval-codifiers-kalyanavarma-mantresvara": "Medieval Digest Comparator",
  "jaimini-and-the-second-tradition": "Jaimini Sūtra Aspect Calculator",
  "modern-founders-krishnamurti-and-joshi": "KP Sub-Lord Matrix",
};

function _computeLearnerMemory(progressState: any): LearnerMemory {
  const profile = aggregateLearnerProfile(progressState);
  const lessons = progressState?.lessons || {};
  const now = Date.now();

  // 1. Preferred Explanation Style
  let preferredExplanation: "visual" | "step_by_step" | "short" | "detailed" = "step_by_step";
  if (typeof progressState?.preferredExplanation === "string") {
    preferredExplanation = progressState.preferredExplanation;
  } else {
    const simCount = ALL_LESSONS.filter((slug) => lessons[slug]?.sectionsViewed?.includes("7")).length;
    if (simCount > 0) {
      preferredExplanation = "visual";
    } else if (profile.averageQuizScore >= 85) {
      preferredExplanation = "detailed";
    } else if (profile.averageQuizScore > 0 && profile.averageQuizScore < 60) {
      preferredExplanation = "short";
    } else {
      preferredExplanation = "step_by_step";
    }
  }

  // 2. Preferred Difficulty
  let preferredDifficulty: "easy" | "medium" | "advanced" = "easy";
  if (typeof progressState?.preferredDifficulty === "string") {
    preferredDifficulty = progressState.preferredDifficulty;
  } else {
    if (profile.averageQuizScore >= 85 || (profile.averageQuizScore >= 80 && profile.streak >= 2)) {
      preferredDifficulty = "advanced";
    } else if (profile.averageQuizScore >= 60 || profile.confidenceScore >= 70 || profile.completedLessons > 0) {
      preferredDifficulty = "medium";
    } else {
      preferredDifficulty = "easy";
    }
  }

  // 3. Strongest & Weakest Topics
  const strongestTopics = Array.isArray(progressState?.strongestTopics) ? progressState.strongestTopics : [...profile.masteredTopics];
  const weakestTopics = Array.isArray(progressState?.weakestTopics) ? progressState.weakestTopics : [...profile.weakTopics];

  // 4. Revision Count
  let revisionCount = 0;
  if (typeof progressState?.revisionCount === "number") {
    revisionCount = progressState.revisionCount;
  } else {
    ALL_LESSONS.forEach((slug) => {
      const progress = lessons[slug];
      if (!progress) return;
      const attemptsCount = progress.attempts?.length || 0;
      if (attemptsCount > 1) {
        revisionCount += (attemptsCount - 1);
      }
    });
  }

  // 5. Average Confidence
  const averageConfidence = typeof progressState?.averageConfidence === "number" ? progressState.averageConfidence : profile.confidenceScore;

  // 6. Quiz Trend
  let quizTrend: "improving" | "stable" | "declining" = "stable";
  if (typeof progressState?.quizTrend === "string") {
    quizTrend = progressState.quizTrend;
  } else {
    const allAttempts: { scorePct: number; timestamp: number }[] = [];
    ALL_LESSONS.forEach((slug) => {
      const progress = lessons[slug];
      if (!progress || !progress.attempts) return;
      progress.attempts.forEach((attempt: any, idx: number) => {
        allAttempts.push({
          scorePct: typeof attempt.scorePct === "number" ? attempt.scorePct : 0,
          timestamp: typeof attempt.attemptedAt === "number" ? attempt.attemptedAt : idx,
        });
      });
    });
    allAttempts.sort((a, b) => a.timestamp - b.timestamp);

    if (allAttempts.length >= 2) {
      const mid = Math.floor(allAttempts.length / 2);
      const firstHalf = allAttempts.slice(0, mid);
      const secondHalf = allAttempts.slice(mid);
      const avgFirst = firstHalf.reduce((sum, a) => sum + a.scorePct, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((sum, a) => sum + a.scorePct, 0) / secondHalf.length;
      if (avgSecond - avgFirst > 0.05) {
        quizTrend = "improving";
      } else if (avgFirst - avgSecond > 0.05) {
        quizTrend = "declining";
      } else {
        quizTrend = "stable";
      }
    }
  }

  // 7. Favorite / Favourite Interactive
  let favoriteInteractive: string | null = null;
  if (typeof progressState?.favoriteInteractive !== "undefined") {
    favoriteInteractive = progressState.favoriteInteractive;
  } else if (typeof progressState?.favouriteInteractive !== "undefined") {
    favoriteInteractive = progressState.favouriteInteractive;
  } else {
    let maxScore = -1;
    ALL_LESSONS.forEach((slug) => {
      const progress = lessons[slug];
      if (!progress) return;
      let score = 0;
      if (progress.sectionsViewed?.includes("7")) score += 10;
      if (progress.masteryStatus === "Mastered") score += 5;
      score += (progress.sectionsViewed?.length || 0);
      score += (progress.attempts?.length || 0) * 2;
      if (score > maxScore && score > 0) {
        maxScore = score;
        favoriteInteractive = INTERACTIVE_MAP[slug] || "Vedanga Body Map";
      }
    });
    if (!favoriteInteractive && (profile.completedLessons > 0 || profile.recentlyViewedLessons.length > 0)) {
      const slug = profile.recentlyViewedLessons[0] || ALL_LESSONS[0];
      favoriteInteractive = INTERACTIVE_MAP[slug] || "Vedanga Body Map";
    }
  }

  // 8. Average Session Minutes / Duration
  let averageSessionMinutes = 0;
  if (typeof progressState?.averageSessionMinutes === "number") {
    averageSessionMinutes = progressState.averageSessionMinutes;
  } else if (typeof progressState?.averageSessionDuration === "number") {
    averageSessionMinutes = progressState.averageSessionDuration;
  } else {
    const totalMin = Math.round((progressState?.totalTimeMs || 0) / 60000);
    if (totalMin > 0) {
      const sessions = progressState?.sessionCount || Math.max(1, progressState?.streakDays || 1, Object.keys(lessons).length || 1);
      averageSessionMinutes = Math.max(1, Math.round(totalMin / sessions));
    } else if (Object.keys(lessons).length > 0) {
      averageSessionMinutes = 18; // Default realistic study duration when lessons are active
    } else {
      averageSessionMinutes = 0;
    }
  }

  // 9. Last Lesson
  let lastLesson: string | null = progressState?.lastLesson !== undefined ? progressState.lastLesson : null;
  if (!lastLesson && progressState?.lastLesson !== null) {
    let latestTime = -1;
    ALL_LESSONS.forEach((slug) => {
      const progress = lessons[slug];
      if (!progress) return;
      const accessed = progress.lastAccessedAt || progress.completedAt || 0;
      const lastAttempt = progress.attempts?.[progress.attempts.length - 1]?.attemptedAt || 0;
      const time = Math.max(accessed, lastAttempt);
      if (time > latestTime && time > 0) {
        latestTime = time;
        lastLesson = slug;
      }
    });
    if (!lastLesson && profile.recentlyViewedLessons.length > 0) {
      lastLesson = profile.recentlyViewedLessons[profile.recentlyViewedLessons.length - 1];
    }
  }

  return {
    preferredExplanation,
    preferredDifficulty,
    strongestTopics,
    weakestTopics,
    revisionCount,
    averageConfidence,
    quizTrend,
    lastLesson,
    favoriteInteractive,
    favouriteInteractive: favoriteInteractive,
    averageSessionMinutes,
    averageSessionDuration: averageSessionMinutes,
    generatedAt: now,
  };
}

export function aggregateLearnerMemory(progressState: any): LearnerMemory {
  if (!getActiveRuntimeConfiguration().memory) {
    return getFallbackMemory();
  }
  return runtimeCache.memoize("memory", [progressState], () => _computeLearnerMemory(progressState));
}

