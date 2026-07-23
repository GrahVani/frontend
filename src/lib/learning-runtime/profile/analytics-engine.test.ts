import { describe, it, expect } from "vitest";
import { generateLearningInsights, generateWeeklyLearningReport, predictLearningOutcome } from "./analytics-engine";
import { aggregateLearnerProfile, aggregateLearnerMemory, generateStudyPlan, calculateMomentum, generateAdaptiveRecommendations, generateLearningPath } from "./profile-service";

describe("AI Mentor Analytics, Insights & Intervention Engine", () => {
  it("should generate actionable learning insights based on quiz accuracy, revision habits, and consistency", () => {
    const progressState = {
      streakDays: 4,
      totalTimeMs: 3600000,
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7", "8"],
          attempts: [{ scorePct: 0.85, passed: true, attemptedAt: Date.now() }],
        },
      },
    };

    const profile = aggregateLearnerProfile(progressState);
    const memory = aggregateLearnerMemory(progressState);
    const insights = generateLearningInsights(profile, memory, progressState);

    expect(insights.length).toBeGreaterThan(0);
    expect(insights.some((i) => i.id === "insight-quiz-improving")).toBe(true);
    expect(insights.some((i) => i.id === "insight-low-revision")).toBe(true);
    expect(insights.some((i) => i.id === "insight-excellent-consistency")).toBe(true);
  });

  it("should generate critical inactive period insight when streak is 0 after starting curriculum", () => {
    const inactiveState = {
      streakDays: 0,
      lessons: {
        "jyotisha-as-vedanga": {
          sectionsViewed: ["1", "2"],
          masteryStatus: "InProgress",
        },
      },
    };

    const profile = aggregateLearnerProfile(inactiveState);
    const memory = aggregateLearnerMemory(inactiveState);
    const insights = generateLearningInsights(profile, memory, inactiveState);

    expect(insights.some((i) => i.id === "insight-inactive-period" && i.severity === "critical")).toBe(true);
  });

  it("should compile a comprehensive weekly learning report with accurate overall rating", () => {
    const progressState = {
      streakDays: 5,
      totalTimeMs: 7200000, // 120 minutes
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7", "8"],
          attempts: [{ scorePct: 0.90, passed: true, attemptedAt: Date.now() }],
        },
      },
    };

    const profile = aggregateLearnerProfile(progressState);
    const memory = aggregateLearnerMemory(progressState);
    const report = generateWeeklyLearningReport(profile, memory, progressState);

    expect(report.totalStudyMinutes).toBe(120);
    expect(report.completedLessons).toBe(1);
    expect(report.completedSections).toBe(8);
    expect(report.quizzesTaken).toBe(1);
    expect(report.averageQuizScore).toBe(90);
    expect(report.streak).toBe(5);
    expect(report.overallRating).toBe("excellent");
  });

  it("should predict learning outcomes deterministically with clamped probability bounds", () => {
    const progressState = {
      streakDays: 6,
      totalTimeMs: 5400000, // 90 minutes
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7", "8"],
          attempts: [{ scorePct: 0.88, passed: true, attemptedAt: Date.now() }],
        },
      },
    };

    const profile = aggregateLearnerProfile(progressState);
    const memory = aggregateLearnerMemory(progressState);
    const adaptiveRecs = generateAdaptiveRecommendations(profile, progressState);
    const learningPath = generateLearningPath(profile, progressState);
    const studyPlan = generateStudyPlan(profile, memory, adaptiveRecs, learningPath, progressState);
    const momentum = calculateMomentum(profile, memory, progressState);

    const prediction = predictLearningOutcome(profile, memory, progressState, studyPlan, momentum);

    expect(prediction.completionProbability).toBeGreaterThanOrEqual(10);
    expect(prediction.completionProbability).toBeLessThanOrEqual(98);
    expect(prediction.masteryProbability).toBeGreaterThanOrEqual(15);
    expect(prediction.masteryProbability).toBeLessThanOrEqual(95);
    expect(prediction.burnoutProbability).toBeGreaterThanOrEqual(5);
    expect(prediction.burnoutProbability).toBeLessThanOrEqual(90);
    expect(prediction.expectedCompletionDays).toBeGreaterThan(0);
    expect(prediction.confidence).toBeGreaterThanOrEqual(20);
    expect(prediction.confidence).toBeLessThanOrEqual(99);
  });
});
