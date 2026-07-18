import type { LearnerProfile } from "./profile-service";
import { ALL_LESSONS, LESSON_TITLES, LESSON_TOPICS } from "./profile-service";
import { runtimeCache } from "./cache";
import { getActiveRuntimeConfiguration } from "./runtime-config";
import { getFallbackAdaptiveRecommendations, getFallbackLearningPath } from "./runtime-fallback";

export interface AdaptiveRecommendation {
  recommendationId: string;
  title: string;
  description: string;
  lessonSlug: string;
  section: string | null;
  recommendationType: "continue" | "retry_quiz" | "complete_simulation" | "review_prerequisite" | "revise" | "move_next";
  priority: "high" | "medium" | "low";
  confidence: number;
  estimatedTime: number; // in minutes
  reasoning: string;
  prerequisiteLessons: string[];
  generatedAt: number;
}

export interface LearningPathStep {
  id: string;
  title: string;
  type: "lesson" | "quiz" | "simulation" | "revision" | "future";
  lessonSlug: string;
  status: "current" | "remaining" | "suggested" | "next" | "locked" | "future" | "completed";
  reason: string;
  estimatedDuration: number; // minutes
  priority: "high" | "medium" | "low";
}

function _computeAdaptiveRecommendations(profile: LearnerProfile, progressState: any): AdaptiveRecommendation[] {
  const lessons = progressState?.lessons || {};
  const recommendations: AdaptiveRecommendation[] = [];
  const now = Date.now();

  // 1. Incomplete active lessons
  ALL_LESSONS.forEach((slug) => {
    const progress = lessons[slug];
    const hasFailed = progress?.attempts?.some((a: any) => !a.passed);
    if (progress && progress.sectionsViewed?.length > 0 && progress.masteryStatus !== "Mastered" && !hasFailed) {
      const remainingCount = 8 - (progress.sectionsViewed?.length || 0); // assume 8 sections total
      const estTime = Math.max(5, remainingCount * 3);
      recommendations.push({
        recommendationId: `rec-continue-${slug}-${now}`,
        title: `Continue Lesson: ${LESSON_TITLES[slug] || slug}`,
        description: `Pick up where you left off. You have read ${progress.sectionsViewed?.length} sections.`,
        lessonSlug: slug,
        section: String((progress.sectionsViewed?.length || 0) + 1),
        recommendationType: "continue",
        priority: "high",
        confidence: profile.confidenceScore,
        estimatedTime: estTime,
        reasoning: `You have an active reading session in progress on "${LESSON_TITLES[slug] || slug}". Retaining continuity accelerates learning.`,
        prerequisiteLessons: [],
        generatedAt: now,
      });
    }
  });

  // 2. Failed quizzes
  ALL_LESSONS.forEach((slug) => {
    const progress = lessons[slug];
    if (progress) {
      const lastAttempt = progress.attempts?.[progress.attempts.length - 1];
      if (progress.masteryStatus === "OnCooldown" || (lastAttempt && !lastAttempt.passed)) {
        recommendations.push({
          recommendationId: `rec-retry-quiz-${slug}-${now}`,
          title: `Retry Quiz: ${LESSON_TITLES[slug] || slug}`,
          description: `You have unresolved incorrect answers in this lesson's quiz.`,
          lessonSlug: slug,
          section: "8", // Quiz section is typically §8
          recommendationType: "retry_quiz",
          priority: "high",
          confidence: Math.max(50, profile.confidenceScore - 10),
          estimatedTime: 10,
          reasoning: `Incorrect answers are valuable signposts. Retrying the quiz reinforces correct concepts.`,
          prerequisiteLessons: [],
          generatedAt: now,
        });
      }
    }
  });

  // 3. Incomplete simulations
  ALL_LESSONS.forEach((slug) => {
    const progress = lessons[slug];
    if (progress) {
      const hasSimViewed = progress.sectionsViewed?.includes("7");
      if (hasSimViewed && progress.masteryStatus !== "Mastered") {
        recommendations.push({
          recommendationId: `rec-sim-${slug}-${now}`,
          title: `Repeat Simulation: ${LESSON_TITLES[slug] || slug}`,
          description: `Interact with the visual map / simulator to cement your understanding.`,
          lessonSlug: slug,
          section: "7",
          recommendationType: "complete_simulation",
          priority: "medium",
          confidence: profile.confidenceScore,
          estimatedTime: 15,
          reasoning: `Visual learning improves retention. Completing this simulation unlocks deeper insights.`,
          prerequisiteLessons: [],
          generatedAt: now,
        });
      }
    }
  });

  // 4. Weak topics suggestions
  if (profile.weakTopics.length > 0) {
    // Find lessons matching weak topics
    ALL_LESSONS.forEach((slug) => {
      const topics = LESSON_TOPICS[slug] || [];
      const hasWeakTopic = topics.some((t) => profile.weakTopics.includes(t));
      if (hasWeakTopic) {
        recommendations.push({
          recommendationId: `rec-weak-${slug}-${now}`,
          title: `Reinforce Topic: ${LESSON_TITLES[slug] || slug}`,
          description: `Review this lesson to strengthen your grasp of: ${profile.weakTopics.join(", ")}.`,
          lessonSlug: slug,
          section: null,
          recommendationType: "revise",
          priority: "medium",
          confidence: Math.max(60, profile.confidenceScore - 5),
          estimatedTime: 20,
          reasoning: `We detected some confusion in topics covered by this lesson. A quick review will build confidence.`,
          prerequisiteLessons: [],
          generatedAt: now,
        });
      }
    });
  }

  // 5. Revision of stale mastered lessons
  ALL_LESSONS.forEach((slug) => {
    const progress = lessons[slug];
    if (progress && progress.masteryStatus === "Mastered") {
      // suggest revising if completed
      const alreadyRecommended = recommendations.some((r) => r.lessonSlug === slug);
      if (!alreadyRecommended) {
        recommendations.push({
          recommendationId: `rec-revise-${slug}-${now}`,
          title: `Revise: ${LESSON_TITLES[slug] || slug}`,
          description: `Maintain long-term recall of this mastered topic.`,
          lessonSlug: slug,
          section: null,
          recommendationType: "revise",
          priority: "low",
          confidence: 90,
          estimatedTime: 15,
          reasoning: `Periodic revision keeps core concepts active in your working memory.`,
          prerequisiteLessons: [],
          generatedAt: now,
        });
      }
    }
  });

  // 6. Next sequential lesson
  const nextSlug = ALL_LESSONS.find((slug) => {
    const progress = lessons[slug];
    return !progress || progress.masteryStatus !== "Mastered";
  });

  if (nextSlug) {
    const alreadyRecommended = recommendations.some((r) => r.lessonSlug === nextSlug);
    if (!alreadyRecommended) {
      recommendations.push({
        recommendationId: `rec-next-${nextSlug}-${now}`,
        title: `Next Up: ${LESSON_TITLES[nextSlug] || nextSlug}`,
        description: `Proceed to the next sequential chapter in your curriculum map.`,
        lessonSlug: nextSlug,
        section: "1",
        recommendationType: "move_next",
        priority: "medium",
        confidence: profile.confidenceScore,
        estimatedTime: 25,
        reasoning: `Ready for progression? Unlock new insights on the path of Jyotiṣa.`,
        prerequisiteLessons: [],
        generatedAt: now,
      });
    }
  }

  return recommendations;
}

export function generateAdaptiveRecommendations(profile: LearnerProfile, progressState: any): AdaptiveRecommendation[] {
  if (!getActiveRuntimeConfiguration().recommendation) {
    return getFallbackAdaptiveRecommendations();
  }
  return runtimeCache.memoize("recommendation", [profile, progressState, "recs"], () => _computeAdaptiveRecommendations(profile, progressState));
}

function _computeLearningPath(profile: LearnerProfile, progressState: any): LearningPathStep[] {
  const lessons = progressState?.lessons || {};
  const pathSteps: LearningPathStep[] = [];

  const currentFocusIdx = ALL_LESSONS.findIndex((slug) => {
    const progress = lessons[slug];
    return !progress || progress.masteryStatus !== "Mastered";
  });

  ALL_LESSONS.forEach((slug, index) => {
    const progress = lessons[slug];
    const title = LESSON_TITLES[slug] || slug;

    if (currentFocusIdx === -1 || index < currentFocusIdx) {
      pathSteps.push({
        id: `path-step-${slug}`,
        title,
        type: "lesson",
        lessonSlug: slug,
        status: "completed",
        reason: "Lesson fully mastered",
        estimatedDuration: 15,
        priority: "low",
      });
    } else if (index === currentFocusIdx) {
      // In progress or retry quiz
      const lastAttempt = progress?.attempts?.[progress.attempts.length - 1];
      const quizFailed = lastAttempt && !lastAttempt.passed;

      if (quizFailed) {
        pathSteps.push({
          id: `path-step-${slug}-quiz`,
          title: `Retry Quiz: ${title}`,
          type: "quiz",
          lessonSlug: slug,
          status: "suggested",
          reason: "Resolve incorrect answers",
          estimatedDuration: 10,
          priority: "high",
        });
      } else {
        pathSteps.push({
          id: `path-step-${slug}-continue`,
          title: `Continue: ${title}`,
          type: "lesson",
          lessonSlug: slug,
          status: "current",
          reason: "Absorb remaining sections",
          estimatedDuration: 15,
          priority: "high",
        });
      }
    } else if (index === currentFocusIdx + 1) {
      pathSteps.push({
        id: `path-step-${slug}`,
        title,
        type: "lesson",
        lessonSlug: slug,
        status: "next",
        reason: "Unlock next concepts",
        estimatedDuration: 25,
        priority: "medium",
      });
    } else {
      pathSteps.push({
        id: `path-step-${slug}`,
        title,
        type: "lesson",
        lessonSlug: slug,
        status: "future",
        reason: "Prerequisites required",
        estimatedDuration: 25,
        priority: "low",
      });
    }
  });

  return pathSteps;
}

export function generateLearningPath(profile: LearnerProfile, progressState: any): LearningPathStep[] {
  if (!getActiveRuntimeConfiguration().recommendation || !getActiveRuntimeConfiguration().roadmap) {
    return getFallbackLearningPath();
  }
  return runtimeCache.memoize("recommendation", [profile, progressState, "path"], () => _computeLearningPath(profile, progressState));
}

