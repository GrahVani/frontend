import { describe, it, expect } from "vitest";
import { generateCoachingInterventions, generateDailyCoachSummary, generateLearningAlerts } from "./coaching-engine";
import { aggregateLearnerProfile } from "./profile-service";
import { aggregateLearnerMemory } from "./memory-service";

describe("CoachingEngine", () => {
  const sampleProgressState = {
    streakDays: 4,
    totalTimeMs: 7200000,
    lessons: {
      "jyotisha-as-vedanga": {
        lessonSlug: "jyotisha-as-vedanga",
        attempts: [
          { scorePct: 0.6, passed: false, wrongQuestionIds: ["q1", "q2"], attemptedAt: 1000 },
          { scorePct: 0.5, passed: false, wrongQuestionIds: ["q1", "q2", "q3"], attemptedAt: 2000 },
        ],
        masteryStatus: "Needs Review",
        sectionsViewed: ["1", "2", "3"],
        cooldownUntil: null,
        lessonCompletedAt: null,
      },
      "the-six-vedangas-and-their-relationship": {
        lessonSlug: "the-six-vedangas-and-their-relationship",
        attempts: [
          { scorePct: 0.9, passed: true, wrongQuestionIds: [], attemptedAt: 1500 },
        ],
        masteryStatus: "Mastered",
        sectionsViewed: ["1", "2"],
        cooldownUntil: null,
        lessonCompletedAt: 1600,
      },
    },
  };

  it("should generate coaching interventions with priority ordering and deterministic evaluation", () => {
    const profile = aggregateLearnerProfile(sampleProgressState);
    const memory = aggregateLearnerMemory(sampleProgressState);

    const interventions = generateCoachingInterventions(profile, memory, sampleProgressState);

    expect(interventions).toBeDefined();
    expect(Array.isArray(interventions)).toBe(true);
    expect(interventions.length).toBeGreaterThan(0);

    // Verify priorities are sorted descending (e.g. critical/high before medium/low)
    const priorityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    for (let i = 0; i < interventions.length - 1; i++) {
      expect(priorityOrder[interventions[i].priority]).toBeGreaterThanOrEqual(priorityOrder[interventions[i + 1].priority]);
    }

    // Check specific fields exist on intervention items
    const first = interventions[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("type");
    expect(first).toHaveProperty("priority");
    expect(first).toHaveProperty("title");
    expect(first).toHaveProperty("message");
    expect(first).toHaveProperty("action");
    expect(first).toHaveProperty("confidence");
  });

  it("should deterministically generate daily coach summary with focus and avoidance lists", () => {
    const profile = aggregateLearnerProfile(sampleProgressState);
    const memory = aggregateLearnerMemory(sampleProgressState);

    const summary = generateDailyCoachSummary(profile, memory, sampleProgressState);

    expect(summary).toBeDefined();
    expect(summary.headline).toBeTruthy();
    expect(summary.message).toBeTruthy();
    expect(summary.motivation).toBeTruthy();
    expect(Array.isArray(summary.focusToday)).toBe(true);
    expect(Array.isArray(summary.avoidToday)).toBe(true);
    expect(summary.focusToday.length).toBeGreaterThan(0);
    expect(summary.avoidToday.length).toBeGreaterThan(0);
    expect(summary.estimatedStudyMinutes).toBeGreaterThan(0);
  });

  it("should generate learning alerts reflecting severity categories and actionable recommendations", () => {
    const profile = aggregateLearnerProfile(sampleProgressState);
    const memory = aggregateLearnerMemory(sampleProgressState);

    const alerts = generateLearningAlerts(profile, memory, sampleProgressState);

    expect(alerts).toBeDefined();
    expect(Array.isArray(alerts)).toBe(true);
    expect(alerts.length).toBeGreaterThan(0);

    const firstAlert = alerts[0];
    expect(["info", "warning", "critical"]).toContain(firstAlert.severity);
    expect(firstAlert.title).toBeTruthy();
    expect(firstAlert.description).toBeTruthy();
    expect(firstAlert.recommendation).toBeTruthy();
  });

  it("should maintain complete determinism across multiple invocations with identical state", () => {
    const profile = aggregateLearnerProfile(sampleProgressState);
    const memory = aggregateLearnerMemory(sampleProgressState);

    const interventions1 = generateCoachingInterventions(profile, memory, sampleProgressState);
    const interventions2 = generateCoachingInterventions(profile, memory, sampleProgressState);
    expect(interventions1).toEqual(interventions2);

    const summary1 = generateDailyCoachSummary(profile, memory, sampleProgressState);
    const summary2 = generateDailyCoachSummary(profile, memory, sampleProgressState);
    expect(summary1).toEqual(summary2);

    const alerts1 = generateLearningAlerts(profile, memory, sampleProgressState);
    const alerts2 = generateLearningAlerts(profile, memory, sampleProgressState);
    expect(alerts1).toEqual(alerts2);
  });
});
