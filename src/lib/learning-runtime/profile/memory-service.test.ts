import { describe, it, expect } from "vitest";
import { aggregateLearnerMemory } from "./memory-service";

describe("Learner Memory Service", () => {
  it("should calculate explanation style correctly based on simulations viewed and scores", () => {
    // 1. Visual style when simulation section 7 is viewed
    const visualState = {
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "InProgress",
          sectionsViewed: ["1", "2", "7"],
          attempts: [{ scorePct: 0.8, passed: true, attemptedAt: Date.now() }],
        },
      },
    };
    expect(aggregateLearnerMemory(visualState).preferredExplanation).toBe("visual");

    // 2. Detailed style when avg score >= 85 and no sims viewed
    const detailedState = {
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3"],
          attempts: [{ scorePct: 0.90, passed: true, attemptedAt: Date.now() }],
        },
      },
    };
    expect(aggregateLearnerMemory(detailedState).preferredExplanation).toBe("detailed");

    // 3. Short style when avg score < 60
    const shortState = {
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "InProgress",
          sectionsViewed: ["1", "2"],
          attempts: [{ scorePct: 0.40, passed: false, attemptedAt: Date.now() }],
        },
      },
    };
    expect(aggregateLearnerMemory(shortState).preferredExplanation).toBe("short");

    // 4. Step by step default
    const stepState = {
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "InProgress",
          sectionsViewed: ["1", "2"],
          attempts: [{ scorePct: 0.75, passed: true, attemptedAt: Date.now() }],
        },
      },
    };
    expect(aggregateLearnerMemory(stepState).preferredExplanation).toBe("step_by_step");
  });

  it("should calculate difficulty preference based on performance and streak", () => {
    // 1. Advanced when score >= 80 and streak >= 2
    const advancedState = {
      streakDays: 3,
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          attempts: [{ scorePct: 0.85, passed: true, attemptedAt: Date.now() }],
        },
      },
    };
    expect(aggregateLearnerMemory(advancedState).preferredDifficulty).toBe("advanced");

    // 2. Medium when moderate score or streak
    const mediumState = {
      streakDays: 1,
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "InProgress",
          attempts: [{ scorePct: 0.70, passed: true, attemptedAt: Date.now() }],
        },
      },
    };
    expect(aggregateLearnerMemory(mediumState).preferredDifficulty).toBe("medium");

    // 3. Easy when starting out or low score
    const easyState = {
      streakDays: 0,
      lessons: {},
    };
    expect(aggregateLearnerMemory(easyState).preferredDifficulty).toBe("easy");
  });

  it("should evaluate quiz trend chronologically across all attempts", () => {
    // Improving trend
    const improvingState = {
      lessons: {
        "jyotisha-as-vedanga": {
          attempts: [
            { scorePct: 0.50, attemptedAt: 1000 },
            { scorePct: 0.60, attemptedAt: 2000 },
            { scorePct: 0.85, attemptedAt: 3000 },
            { scorePct: 0.90, attemptedAt: 4000 },
          ],
        },
      },
    };
    expect(aggregateLearnerMemory(improvingState).quizTrend).toBe("improving");

    // Declining trend
    const decliningState = {
      lessons: {
        "jyotisha-as-vedanga": {
          attempts: [
            { scorePct: 0.90, attemptedAt: 1000 },
            { scorePct: 0.85, attemptedAt: 2000 },
            { scorePct: 0.60, attemptedAt: 3000 },
            { scorePct: 0.50, attemptedAt: 4000 },
          ],
        },
      },
    };
    expect(aggregateLearnerMemory(decliningState).quizTrend).toBe("declining");

    // Stable trend
    const stableState = {
      lessons: {
        "jyotisha-as-vedanga": {
          attempts: [
            { scorePct: 0.80, attemptedAt: 1000 },
            { scorePct: 0.82, attemptedAt: 2000 },
          ],
        },
      },
    };
    expect(aggregateLearnerMemory(stableState).quizTrend).toBe("stable");
  });

  it("should calculate revision count from repeat attempts and mastered reviews", () => {
    const state = {
      lessons: {
        "jyotisha-as-vedanga": {
          attempts: [
            { scorePct: 0.60, attemptedAt: 1000 },
            { scorePct: 0.80, attemptedAt: 2000 },
            { scorePct: 0.90, attemptedAt: 3000 }, // 2 revisions here
          ],
        },
        "the-six-vedangas-and-their-relationship": {
          attempts: [
            { scorePct: 0.70, attemptedAt: 4000 },
            { scorePct: 0.85, attemptedAt: 5000 }, // 1 revision here
          ],
        },
      },
    };
    const memory = aggregateLearnerMemory(state);
    expect(memory.revisionCount).toBe(3);
  });

  it("should determine favourite interactive based on engagement and simulation viewing", () => {
    const state = {
      lessons: {
        "the-six-vedangas-and-their-relationship": {
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3", "7"],
          attempts: [{ scorePct: 0.90, attemptedAt: 1000 }],
        },
      },
    };
    const memory = aggregateLearnerMemory(state);
    expect(memory.favoriteInteractive).toBe("Six Vedangas Relational Matrix");
    expect(memory.favouriteInteractive).toBe("Six Vedangas Relational Matrix");
  });

  it("should track strongest and weakest topics and average confidence", () => {
    const state = {
      streakDays: 3,
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7", "8"],
          attempts: [{ scorePct: 0.90, passed: true, attemptedAt: 1000 }],
        },
        "philosophy-of-karma-and-prediction": {
          masteryStatus: "InProgress",
          sectionsViewed: ["1", "2"],
          attempts: [{ scorePct: 0.40, passed: false, attemptedAt: 2000 }],
        },
      },
    };
    const memory = aggregateLearnerMemory(state);
    expect(memory.strongestTopics).toContain("Vedāṅga");
    expect(memory.weakestTopics).toContain("Karma Types");
    expect(memory.averageConfidence).toBeGreaterThan(50);
  });

  it("should calculate average session duration in minutes accurately", () => {
    const stateWithTime = {
      totalTimeMs: 3600000, // 60 minutes
      sessionCount: 3,
      lessons: {
        "jyotisha-as-vedanga": { masteryStatus: "InProgress" },
      },
    };
    const memory = aggregateLearnerMemory(stateWithTime);
    expect(memory.averageSessionMinutes).toBe(20);
    expect(memory.averageSessionDuration).toBe(20);

    // Default when active lessons exist but time is unlogged
    const stateNoTime = {
      totalTimeMs: 0,
      lessons: {
        "jyotisha-as-vedanga": { masteryStatus: "InProgress" },
      },
    };
    expect(aggregateLearnerMemory(stateNoTime).averageSessionMinutes).toBe(18);
  });
});
