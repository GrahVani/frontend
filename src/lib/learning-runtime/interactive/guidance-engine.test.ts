import { describe, it, expect } from "vitest";
import { generateRecommendation } from "./guidance-engine";

describe("generateRecommendation Guidance Engine", () => {
  const sections = [
    { number: "1", title: "Introduction" },
    { number: "2", title: "Six Limbs" },
    { number: "3", title: "Visual Map" },
  ] as any[];

  it("should prioritize unfinished quiz", () => {
    const lessonContext = { slug: "slug", title: "Title" };
    const interactiveContext = { componentId: "quiz-1", componentType: "quiz", componentTitle: "Limb Quiz" };
    const interactionState = {
      quizState: {
        totalQuestions: 5,
        completedQuestions: 2,
      },
    };
    const completed = ["1"];
    const current = "2";

    const result = generateRecommendation(lessonContext, interactiveContext, interactionState, completed, current, sections);
    expect(result.type).toBe("retry_quiz");
    expect(result.recommendation).toBe("Finish the Quiz Activity");
    expect(result.priority).toBe("high");
  });

  it("should prioritize unfinished simulation over prerequisites and sections", () => {
    const lessonContext = { slug: "slug", title: "Title", prerequisites: ["Prereq 1"] };
    const interactiveContext = { componentId: "sim-1", componentType: "simulation", componentTitle: "Orbital View" };
    const interactionState = {
      simulationProgress: 45,
    };
    const completed: string[] = [];
    const current = "2";

    const result = generateRecommendation(lessonContext, interactiveContext, interactionState, completed, current, sections);
    expect(result.type).toBe("complete_simulation");
    expect(result.recommendation).toBe("Complete the Active Simulation");
    expect(result.priority).toBe("high");
  });

  it("should suggest prerequisite review if lesson is untouched", () => {
    const lessonContext = { slug: "slug", title: "Title", prerequisites: ["Prereq 1", "Prereq 2"] };
    const interactiveContext = null;
    const interactionState = null;
    const completed: string[] = [];
    const current = "1";

    const result = generateRecommendation(lessonContext, interactiveContext, interactionState, completed, current, sections);
    expect(result.type).toBe("review_prerequisite");
    expect(result.recommendation).toBe("Review Prerequisite Concepts");
    expect(result.priority).toBe("medium");
    expect(result.whySuggested).toContain("Prereq 1, Prereq 2");
  });

  it("should suggest continuing current activity if active section is not completed", () => {
    const lessonContext = { slug: "slug", title: "Title" };
    const interactiveContext = null;
    const interactionState = null;
    const completed = ["1"];
    const current = "2";

    const result = generateRecommendation(lessonContext, interactiveContext, interactionState, completed, current, sections);
    expect(result.type).toBe("continue");
    expect(result.recommendation).toBe("Absorb Section 2");
    expect(result.priority).toBe("low");
  });

  it("should suggest moving to next section if current section is viewed", () => {
    const lessonContext = { slug: "slug", title: "Title" };
    const interactiveContext = null;
    const interactionState = null;
    const completed = ["1", "2"];
    const current = "2";

    const result = generateRecommendation(lessonContext, interactiveContext, interactionState, completed, current, sections);
    expect(result.type).toBe("move_next");
    expect(result.recommendation).toBe("Proceed to Section 3");
    expect(result.priority).toBe("medium");
  });

  it("should suggest revising previous topics if all sections are completed and we are revising", () => {
    const lessonContext = { slug: "slug", title: "Title" };
    const interactiveContext = null;
    const interactionState = null;
    const completed = ["1", "2", "3"];
    const current = "3";

    const result = generateRecommendation(lessonContext, interactiveContext, interactionState, completed, current, sections);
    expect(result.type).toBe("revise");
    expect(result.recommendation).toBe("Revise Previous Concepts");
    expect(result.priority).toBe("low");
  });
});
