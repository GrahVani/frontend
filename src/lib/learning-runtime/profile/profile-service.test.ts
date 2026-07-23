import { describe, it, expect } from "vitest";
import { aggregateLearnerProfile, generateLearnerRecommendation } from "./profile-service";

describe("Profile Service", () => {
  it("should aggregate basic learner stats when empty progress", () => {
    const progressState = {
      lessons: {},
      streakDays: 0,
      longestStreak: 0,
      totalTimeMs: 0,
    };

    const profile = aggregateLearnerProfile(progressState);
    expect(profile.completionPercentage).toBe(0);
    expect(profile.completedLessons).toBe(0);
    expect(profile.streak).toBe(0);
    expect(profile.averageQuizScore).toBe(0);
    expect(profile.masteredTopics).toEqual([]);
    expect(profile.weakTopics).toEqual([]);
  });

  it("should calculate mastery and detect strong/weak topics", () => {
    const progressState = {
      streakDays: 3,
      totalTimeMs: 2 * 60 * 60 * 1000, // 2 hours
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          attempts: [
            { scorePct: 0.90, passed: true, wrongQuestionIds: [] }
          ],
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7"],
        },
        "the-six-vedangas-and-their-relationship": {
          masteryStatus: "InProgress",
          attempts: [
            { scorePct: 0.60, passed: false, wrongQuestionIds: ["q1"] }
          ],
          sectionsViewed: ["1", "2"],
        }
      }
    };

    const profile = aggregateLearnerProfile(progressState);
    expect(profile.completedLessons).toBe(1);
    expect(profile.streak).toBe(3);
    expect(profile.averageQuizScore).toBe(75); // (90 + 60) / 2
    expect(profile.masteredTopics).toContain("Vedāṅga");
    expect(profile.weakTopics).toContain("Sāṅga Habit");
    expect(profile.weakTopics).not.toContain("Vedāṅga"); // mastered topics take precedence
    expect(profile.learningVelocity).toBe(0.5); // 1 lesson / 2 hours
    expect(profile.confidenceScore).toBe(65); // 60 + 5 (streak)
  });

  it("should prioritize incomplete lesson continue recommendation", () => {
    const progressState = {
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "InProgress",
          attempts: [],
          sectionsViewed: ["1", "2"],
        }
      }
    };
    const profile = aggregateLearnerProfile(progressState);
    const rec = generateLearnerRecommendation(profile, progressState);

    expect(rec.type).toBe("continue");
    expect(rec.recommendedNextLesson).toBe("jyotisha-as-vedanga");
    expect(rec.priority).toBe("high");
    expect(rec.reason).toContain("active session");
  });

  it("should prioritize quiz retry if latest attempt failed", () => {
    const progressState = {
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "InProgress",
          attempts: [
            { scorePct: 0.50, passed: false, wrongQuestionIds: ["q1"] }
          ],
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7"],
        }
      }
    };
    const profile = aggregateLearnerProfile(progressState);
    const rec = generateLearnerRecommendation(profile, progressState);

    expect(rec.type).toBe("retry_quiz");
    expect(rec.recommendedQuizRetry).toBe("jyotisha-as-vedanga");
    expect(rec.priority).toBe("high");
  });

  it("should suggest next lesson if previous is mastered", () => {
    const progressState = {
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          attempts: [
            { scorePct: 1.0, passed: true, wrongQuestionIds: [] }
          ],
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7"],
        }
      }
    };
    const profile = aggregateLearnerProfile(progressState);
    const rec = generateLearnerRecommendation(profile, progressState);

    expect(rec.type).toBe("move_next");
    expect(rec.recommendedNextLesson).toBe("the-six-vedangas-and-their-relationship");
    expect(rec.priority).toBe("medium");
  });
});
