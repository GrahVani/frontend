import { describe, it, expect } from "vitest";
import { generateMentorDashboard } from "./dashboard-engine";
import { aggregateLearnerProfile, aggregateLearnerMemory } from "./profile-service";

describe("AI Mentor Dashboard Engine", () => {
  it("should deterministically generate dashboard overview and weekly snapshot metrics", () => {
    const progressState = {
      streakDays: 5,
      totalTimeMs: 7200000, // 120 minutes
      lessons: {
        "jyotisha-as-vedanga": {
          lessonSlug: "jyotisha-as-vedanga",
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7", "8"],
          lessonCompletedAt: Date.now() - 86400000,
          attempts: [{ scorePct: 0.9, passed: true, attemptedAt: Date.now() - 86400000 }],
        },
      },
    };

    const profile = aggregateLearnerProfile(progressState);
    const memory = aggregateLearnerMemory(progressState);
    const dashboard = generateMentorDashboard(profile, memory, progressState);

    expect(dashboard.overview.streak).toBe(5);
    expect(dashboard.overview.completion).toBeGreaterThanOrEqual(10);
    expect(dashboard.overview.confidence).toBeGreaterThan(0);
    expect(dashboard.weeklySnapshot.studyMinutes).toBe(120);
    expect(dashboard.weeklySnapshot.completedLessons).toBe(1);
    expect(dashboard.weeklySnapshot.quizzes).toBe(1);
  });

  it("should deterministically construct vertical timeline with completed, active, and upcoming items sorted by status and timestamp", () => {
    const progressState = {
      streakDays: 7,
      totalTimeMs: 10800000,
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3", "4", "5", "6", "7", "8"],
          lessonCompletedAt: Date.now() - 172800000,
          attempts: [{ scorePct: 0.95, passed: true, attemptedAt: Date.now() - 172800000 }],
        },
        "the-six-vedangas-and-their-relationship": {
          masteryStatus: "InProgress",
          sectionsViewed: ["1", "2", "3"],
          attempts: [],
        },
      },
    };

    const profile = aggregateLearnerProfile(progressState);
    const memory = aggregateLearnerMemory(progressState);
    const dashboard = generateMentorDashboard(profile, memory, progressState);

    expect(dashboard.timeline.length).toBeGreaterThan(0);

    const completedItems = dashboard.timeline.filter((t) => t.status === "completed");
    const activeItems = dashboard.timeline.filter((t) => t.status === "active");
    const upcomingItems = dashboard.timeline.filter((t) => t.status === "upcoming");

    expect(completedItems.length).toBeGreaterThanOrEqual(1);
    expect(activeItems.length).toBeGreaterThanOrEqual(1);
    expect(upcomingItems.length).toBeGreaterThanOrEqual(1);

    // Verify ordering: completed come first, then active, then upcoming
    const firstActiveIndex = dashboard.timeline.findIndex((t) => t.status === "active");
    const firstUpcomingIndex = dashboard.timeline.findIndex((t) => t.status === "upcoming");
    expect(firstActiveIndex).toBeGreaterThanOrEqual(completedItems.length);
    expect(firstUpcomingIndex).toBeGreaterThanOrEqual(firstActiveIndex);
  });

  it("should generate tailored coaching summary reflecting momentum and learner profile strengths/improvements", () => {
    const progressState = {
      streakDays: 3,
      totalTimeMs: 5400000,
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3", "4", "5", "6"],
          attempts: [{ scorePct: 0.88, passed: true, attemptedAt: Date.now() }],
        },
      },
    };

    const profile = aggregateLearnerProfile(progressState);
    const memory = aggregateLearnerMemory(progressState);
    const dashboard = generateMentorDashboard(profile, memory, progressState);

    expect(dashboard.coachingSummary.title).toBeDefined();
    expect(dashboard.coachingSummary.summary).toContain("3-day streak");
    expect(dashboard.coachingSummary.strengths.length).toBeGreaterThan(0);
    expect(dashboard.coachingSummary.improvements.length).toBeGreaterThan(0);
    expect(dashboard.coachingSummary.nextWeekGoal).toBeDefined();
  });

  it("should maintain complete determinism across multiple invocations with identical state", () => {
    const progressState = {
      streakDays: 2,
      totalTimeMs: 3600000,
      lessons: {
        "jyotisha-as-vedanga": {
          masteryStatus: "Mastered",
          sectionsViewed: ["1", "2", "3", "4"],
          attempts: [{ scorePct: 0.8, passed: true, attemptedAt: 1000000 }],
        },
      },
    };

    const profile = aggregateLearnerProfile(progressState);
    const memory = aggregateLearnerMemory(progressState);

    const dashboard1 = generateMentorDashboard(profile, memory, progressState);
    const dashboard2 = generateMentorDashboard(profile, memory, progressState);

    // generatedAt will differ slightly or be same if fast, compare fields ignoring generatedAt
    expect(dashboard1.overview).toEqual(dashboard2.overview);
    expect(dashboard1.currentFocus).toEqual(dashboard2.currentFocus);
    expect(dashboard1.weeklySnapshot).toEqual(dashboard2.weeklySnapshot);
    expect(dashboard1.coachingSummary).toEqual(dashboard2.coachingSummary);
    expect(dashboard1.timeline.map((t) => ({ ...t, timestamp: 0 }))).toEqual(
      dashboard2.timeline.map((t) => ({ ...t, timestamp: 0 }))
    );
  });
});
