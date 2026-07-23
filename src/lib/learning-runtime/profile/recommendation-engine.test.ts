import { describe, it, expect } from "vitest";
import { generateAdaptiveRecommendations, generateLearningPath } from "./recommendation-engine";
import { aggregateLearnerProfile } from "./profile-service";

describe("Adaptive Recommendation Engine", () => {
  it("should calculate adaptive recommendations in strict priority order", () => {
    const progressState = {
      streakDays: 4,
      totalTimeMs: 1800000,
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "InProgress",
          attempts: [],
          sectionsViewed: ["1", "2"],
        },
        "the-six-vedangas-and-their-relationship": {
          masteryStatus: "InProgress",
          attempts: [
            { scorePct: 0.50, passed: false, wrongQuestionIds: ["q2"], attemptedAt: Date.now() }
          ],
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7", "8"],
        }
      }
    };

    const profile = aggregateLearnerProfile(progressState);
    const recs = generateAdaptiveRecommendations(profile, progressState);

    // Verify recommendations list
    expect(recs.length).toBeGreaterThan(0);

    // 1. Incomplete lesson continue recommendation exists
    const continueRec = recs.find((r) => r.recommendationType === "continue");
    expect(continueRec).toBeDefined();
    expect(continueRec?.lessonSlug).toBe("jyotisha-as-vedanga");

    // 2. Failed quiz retry recommendation exists
    const retryRec = recs.find((r) => r.recommendationType === "retry_quiz");
    expect(retryRec).toBeDefined();
    expect(retryRec?.lessonSlug).toBe("the-six-vedangas-and-their-relationship");
  });

  it("should generate learning path timeline with correct statuses", () => {
    const progressState = {
      streakDays: 2,
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          attempts: [{ scorePct: 0.90, passed: true, wrongQuestionIds: [], attemptedAt: Date.now() }],
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7"],
        },
        "the-six-vedangas-and-their-relationship": {
          masteryStatus: "InProgress",
          attempts: [],
          sectionsViewed: ["1", "2"],
        }
      }
    };

    const profile = aggregateLearnerProfile(progressState);
    const path = generateLearningPath(profile, progressState);

    expect(path.length).toBe(10); // total 10 lessons in ALL_LESSONS
    expect(path[0].status).toBe("completed"); // first lesson is mastered
    expect(path[1].status).toBe("current"); // second lesson is in progress
    expect(path[2].status).toBe("next"); // third lesson is next uncompleted
    expect(path[3].status).toBe("future"); // fourth is future
  });
});
