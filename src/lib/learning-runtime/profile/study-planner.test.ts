import { describe, it, expect } from "vitest";
import { generateStudyPlan, detectLearningRisks } from "./study-planner";
import { aggregateLearnerProfile, generateAdaptiveRecommendations, generateLearningPath, aggregateLearnerMemory } from "./profile-service";

describe("Study Planner & Proactive Learning Coach", () => {
  it("should generate study plan tasks in strict priority order", () => {
    const progressState = {
      streakDays: 3,
      totalTimeMs: 1800000, // 30 mins
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "InProgress",
          sectionsViewed: ["1", "2"],
          attempts: [],
        },
        "the-six-vedangas-and-their-relationship": {
          masteryStatus: "InProgress",
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7", "8"],
          attempts: [{ scorePct: 0.50, passed: false, attemptedAt: Date.now() }],
        },
      },
    };

    const profile = aggregateLearnerProfile(progressState);
    const memory = aggregateLearnerMemory(progressState);
    const adaptiveRecs = generateAdaptiveRecommendations(profile, progressState);
    const learningPath = generateLearningPath(profile, progressState);

    const plan = generateStudyPlan(profile, memory, adaptiveRecs, learningPath, progressState);

    // Verify task generation and priority ordering
    expect(plan.todayTasks.length).toBeGreaterThan(0);
    expect(plan.todayTasks[0].type).toBe("continue"); // continue lesson has highest priority
    expect(plan.todayTasks[0].lessonSlug).toBe("jyotisha-as-vedanga");

    const quizTask = [...plan.todayTasks, ...plan.tomorrowTasks].find((t) => t.type === "retry_quiz");
    expect(quizTask).toBeDefined();
    expect(quizTask?.lessonSlug).toBe("the-six-vedangas-and-their-relationship");
  });

  it("should calculate estimated duration and completion forecast accurately", () => {
    const progressState = {
      streakDays: 4,
      totalTimeMs: 3600000,
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
    const adaptiveRecs = generateAdaptiveRecommendations(profile, progressState);
    const learningPath = generateLearningPath(profile, progressState);

    const plan = generateStudyPlan(profile, memory, adaptiveRecs, learningPath, progressState);

    expect(plan.estimatedStudyTime).toBeGreaterThan(0);
    expect(plan.completionForecast).toBeGreaterThan(0);
  });

  it("should track weekly goals with proper status and percentage", () => {
    const progressState = {
      streakDays: 5,
      totalTimeMs: 7200000, // 120 mins
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          attempts: [{ scorePct: 0.85, passed: true, attemptedAt: Date.now() }],
        },
      },
    };

    const profile = aggregateLearnerProfile(progressState);
    const memory = aggregateLearnerMemory(progressState);
    const adaptiveRecs = generateAdaptiveRecommendations(profile, progressState);
    const learningPath = generateLearningPath(profile, progressState);

    const plan = generateStudyPlan(profile, memory, adaptiveRecs, learningPath, progressState);

    expect(plan.weeklyGoals.length).toBe(3);
    const timeGoal = plan.weeklyGoals.find((g) => g.id === "goal-time");
    expect(timeGoal?.status).toBe("completed");
    expect(timeGoal?.progressPct).toBe(100);

    const streakGoal = plan.weeklyGoals.find((g) => g.id === "goal-streak");
    expect(streakGoal?.status).toBe("completed");
  });

  it("should calculate burnout risk and detect learning risks deterministically", () => {
    // High burnout risk state
    const burnoutState = {
      streakDays: 10,
      totalTimeMs: 10800000, // 180 mins (> 120m)
      lessons: {},
    };

    const profile = aggregateLearnerProfile(burnoutState);
    const memory = aggregateLearnerMemory(burnoutState);
    const adaptiveRecs = generateAdaptiveRecommendations(profile, burnoutState);
    const learningPath = generateLearningPath(profile, burnoutState);

    const plan = generateStudyPlan(profile, memory, adaptiveRecs, learningPath, burnoutState);
    const risks = detectLearningRisks(profile, memory, burnoutState);

    expect(plan.burnoutRisk).toBe("high");
    expect(risks.some((r) => r.type === "burnout" && r.severity === "high")).toBe(true);
  });

  it("should detect quiz decline and low confidence risks", () => {
    const declineState = {
      averageConfidence: 50,
      lessons: {
        "jyotisha-as-vedanga": {
          attempts: [
            { scorePct: 0.90, attemptedAt: 1000 },
            { scorePct: 0.70, attemptedAt: 2000 },
            { scorePct: 0.40, attemptedAt: 3000 },
          ],
        },
      },
    };



    const profile = aggregateLearnerProfile(declineState);
    const memory = aggregateLearnerMemory(declineState);
    const risks = detectLearningRisks(profile, memory, declineState);

    expect(risks.some((r) => r.type === "quiz_decline")).toBe(true);
    expect(risks.some((r) => r.type === "low_confidence")).toBe(true);
  });
});
