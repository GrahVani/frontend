import { describe, it, expect } from "vitest";
import {
  generateSessionSummary,
  evaluateCoachingEffectiveness,
  generateAdaptiveReflection,
  calculateLearningConsistency,
} from "./session-intelligence";
import { aggregateLearnerProfile } from "./profile-service";
import { aggregateLearnerMemory } from "./memory-service";
import { generateCoachingInterventions } from "./coaching-engine";

describe("SessionIntelligenceEngine", () => {
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

  it("generates deterministic session summary with productivity index and engagement metrics", () => {
    const profile = aggregateLearnerProfile(sampleProgressState);
    const memory = aggregateLearnerMemory(sampleProgressState);

    const summary1 = generateSessionSummary(profile, memory, sampleProgressState, "test-session-123");
    const summary2 = generateSessionSummary(profile, memory, sampleProgressState, "test-session-123");

    expect(summary1).toEqual(summary2);
    expect(summary1.sessionId).toBe("test-session-123");
    expect(summary1.durationMinutes).toBeGreaterThan(0);
    expect(summary1.lessonsVisited).toBeGreaterThanOrEqual(2);
    expect(summary1.sectionsCompleted).toBe(5);
    expect(summary1.quizzesAttempted).toBe(3);
    expect(summary1.engagement).toBeTypeOf("string");
    expect(summary1.productivity).toBeGreaterThanOrEqual(0);
    expect(summary1.productivity).toBeLessThanOrEqual(100);
    expect(summary1.summary).toContain("minutes of study across");
  });

  it("evaluates coaching effectiveness with quantitative success and recommendation acceptance scores", () => {
    const profile = aggregateLearnerProfile(sampleProgressState);
    const memory = aggregateLearnerMemory(sampleProgressState);
    const interventions = generateCoachingInterventions(profile, memory, sampleProgressState);

    const eff1 = evaluateCoachingEffectiveness(profile, memory, sampleProgressState, interventions);
    const eff2 = evaluateCoachingEffectiveness(profile, memory, sampleProgressState, interventions);

    expect(eff1).toEqual(eff2);
    expect(eff1.score).toBeGreaterThanOrEqual(0);
    expect(eff1.score).toBeLessThanOrEqual(100);
    expect(eff1.previousScore).toBeGreaterThanOrEqual(0);
    expect(eff1.previousScore).toBeLessThanOrEqual(100);
    expect(typeof eff1.improvement).toBe("number");
    expect(eff1.interventionSuccess).toBeGreaterThanOrEqual(0);
    expect(eff1.recommendationAcceptance).toBeGreaterThanOrEqual(0);
    expect(eff1.confidence).toBeGreaterThanOrEqual(65);
  });

  it("generates adaptive reflection synthesizing strengths, improvements, next focus points, and Vedic encouragement", () => {
    const profile = aggregateLearnerProfile(sampleProgressState);
    const memory = aggregateLearnerMemory(sampleProgressState);
    const eff = evaluateCoachingEffectiveness(profile, memory, sampleProgressState);

    const ref1 = generateAdaptiveReflection(profile, memory, sampleProgressState, eff);
    const ref2 = generateAdaptiveReflection(profile, memory, sampleProgressState, eff);

    expect(ref1).toEqual(ref2);
    expect(ref1.title).toBeTypeOf("string");
    expect(ref1.reflection).toContain("coaching effectiveness rating of");
    expect(Array.isArray(ref1.strengths)).toBe(true);
    expect(ref1.strengths.length).toBeGreaterThan(0);
    expect(Array.isArray(ref1.improvements)).toBe(true);
    expect(ref1.improvements.length).toBeGreaterThan(0);
    expect(Array.isArray(ref1.nextFocus)).toBe(true);
    expect(ref1.nextFocus.length).toBeGreaterThan(0);
    expect(ref1.encouragement).toContain("Vedic");
  });

  it("calculates learning consistency, attendance, focus score, discipline, and trend deterministically", () => {
    const profile = aggregateLearnerProfile(sampleProgressState);
    const memory = aggregateLearnerMemory(sampleProgressState);

    const cons1 = calculateLearningConsistency(profile, memory, sampleProgressState);
    const cons2 = calculateLearningConsistency(profile, memory, sampleProgressState);

    expect(cons1).toEqual(cons2);
    expect(cons1.consistency).toBeGreaterThanOrEqual(0);
    expect(cons1.consistency).toBeLessThanOrEqual(100);
    expect(["improving", "stable", "declining"]).toContain(cons1.trend);
    expect(cons1.attendance).toBeGreaterThanOrEqual(0);
    expect(cons1.attendance).toBeLessThanOrEqual(100);
    expect(cons1.focusScore).toBeGreaterThanOrEqual(0);
    expect(cons1.focusScore).toBeLessThanOrEqual(100);
    expect(cons1.discipline).toBeGreaterThanOrEqual(0);
    expect(cons1.discipline).toBeLessThanOrEqual(100);
  });
});
