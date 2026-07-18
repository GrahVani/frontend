import { describe, it, expect } from "vitest";
import { generateMentorGoals, generateAchievements, calculateMomentum } from "./mentor-engine";
import { aggregateLearnerProfile, aggregateLearnerMemory } from "./profile-service";

describe("AI Mentor Goals, Milestones & Achievement System", () => {
  it("should generate mentor goals across daily, weekly, quiz, mastery, revision, and streak types", () => {
    const progressState = {
      streakDays: 4,
      totalTimeMs: 3600000, // 60 mins
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "InProgress",
          sectionsViewed: ["1", "2", "3", "4"],
          attempts: [],
        },
      },
    };

    const profile = aggregateLearnerProfile(progressState);
    const memory = aggregateLearnerMemory(progressState);
    const goals = generateMentorGoals(profile, memory, progressState);

    expect(goals.length).toBe(6);
    expect(goals.some((g) => g.type === "daily")).toBe(true);
    expect(goals.some((g) => g.type === "streak")).toBe(true);
    expect(goals.some((g) => g.type === "weekly")).toBe(true);
    expect(goals.some((g) => g.type === "quiz")).toBe(true);
    expect(goals.some((g) => g.type === "mastery")).toBe(true);
    expect(goals.some((g) => g.type === "revision")).toBe(true);

    const dailyGoal = goals.find((g) => g.type === "daily");
    expect(dailyGoal?.progress).toBe(50); // 4/8 sections viewed = 50%
  });

  it("should unlock achievements deterministically based on learner milestones", () => {
    const progressState = {
      streakDays: 7,
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7", "8"],
          lessonCompletedAt: 123456789,
          attempts: [{ scorePct: 1, passed: true, attemptedAt: Date.now() }],
        },
      },
    };

    const profile = aggregateLearnerProfile(progressState);
    const memory = aggregateLearnerMemory(progressState);
    const achievements = generateAchievements(profile, memory, progressState);

    expect(achievements.length).toBe(6);

    const firstLesson = achievements.find((a) => a.id === "ach-first-lesson");
    expect(firstLesson?.unlocked).toBe(true);
    expect(firstLesson?.unlockedAt).toBe(123456789);

    const quizMaster = achievements.find((a) => a.id === "ach-quiz-master");
    expect(quizMaster?.unlocked).toBe(true);

    const streak7 = achievements.find((a) => a.id === "ach-7-day-streak");
    expect(streak7?.unlocked).toBe(true);
  });

  it("should calculate momentum score and trend accurately", () => {
    // Rising momentum state
    const risingState = {
      streakDays: 8,
      totalTimeMs: 7200000,
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7", "8"],
          attempts: [
            { scorePct: 0.70, attemptedAt: 1000 },
            { scorePct: 0.85, attemptedAt: 2000 },
            { scorePct: 0.95, attemptedAt: 3000 },
          ],
        },
        "the-six-vedangas-and-their-relationship": {
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7", "8"],
          attempts: [{ scorePct: 0.90, attemptedAt: 4000 }],
        },
      },
    };

    const profile = aggregateLearnerProfile(risingState);
    const memory = aggregateLearnerMemory(risingState);
    const momentum = calculateMomentum(profile, memory, risingState);

    expect(momentum.score).toBeGreaterThanOrEqual(70);
    expect(momentum.trend).toBe("rising");
    expect(momentum.explanation).toContain("trending upwards");
  });

  it("should detect declining momentum when quiz trend or streak dips", () => {
    const decliningState = {
      streakDays: 0,
      lessons: {
        "jyotisha-as-vedanga": {
          attempts: [
            { scorePct: 0.90, attemptedAt: 1000 },
            { scorePct: 0.60, attemptedAt: 2000 },
            { scorePct: 0.40, attemptedAt: 3000 },
          ],
        },
      },
    };

    const profile = aggregateLearnerProfile(decliningState);
    const memory = aggregateLearnerMemory(decliningState);
    const momentum = calculateMomentum(profile, memory, decliningState);

    expect(momentum.trend).toBe("declining");
    expect(momentum.explanation).toContain("show a slight dip");
  });
});
