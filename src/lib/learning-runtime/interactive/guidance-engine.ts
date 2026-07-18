import type { InteractiveContext, InteractionState } from "./types";
import type { LessonContextPayload } from "@/store/useTutorStore";
import type { LessonSection } from "@/lib/learning-runtime/types";

export interface TutorRecommendation {
  recommendation: string;
  whySuggested: string;
  nextAction: string;
  type: "continue" | "complete_simulation" | "retry_quiz" | "review_prerequisite" | "move_next" | "revise";
  priority: "low" | "medium" | "high";
  timestamp: number;
}

export function generateRecommendation(
  lessonContext: LessonContextPayload | null,
  interactiveContext: InteractiveContext | null,
  interactionState: InteractionState | null,
  completedSections: string[],
  currentSection: string | null,
  sections: LessonSection[]
): TutorRecommendation {
  const now = Date.now();

  // 1. Unfinished Quiz
  if (
    interactiveContext?.componentType === "quiz" &&
    interactionState?.quizState &&
    interactionState.quizState.completedQuestions < interactionState.quizState.totalQuestions
  ) {
    return {
      type: "retry_quiz",
      recommendation: "Finish the Quiz Activity",
      whySuggested: `You have completed ${interactionState.quizState.completedQuestions} of ${interactionState.quizState.totalQuestions} questions. Answering all questions reinforces concept recall.`,
      nextAction: "Complete the remaining quiz questions to test your understanding.",
      priority: "high",
      timestamp: now,
    };
  }

  // 2. Unfinished Simulation
  if (
    interactiveContext?.componentType === "simulation" &&
    interactionState?.simulationProgress !== undefined &&
    interactionState.simulationProgress < 100
  ) {
    return {
      type: "complete_simulation",
      recommendation: "Complete the Active Simulation",
      whySuggested: `You are currently exploring the ${interactiveContext.componentTitle} simulation (${interactionState.simulationProgress}% complete). Finishing it ensures full interactive mastery.`,
      nextAction: "Continue interacting with the simulator until it is complete.",
      priority: "high",
      timestamp: now,
    };
  }

  // 3. Prerequisite Review
  if (
    lessonContext?.prerequisites &&
    lessonContext.prerequisites.length > 0 &&
    completedSections.length === 0
  ) {
    return {
      type: "review_prerequisite",
      recommendation: "Review Prerequisite Concepts",
      whySuggested: `Before diving into ${lessonContext.title || "this lesson"}, check if you feel comfortable with: ${lessonContext.prerequisites.join(", ")}.`,
      nextAction: "Read the prerequisite summary or ask Gyaneshwara about them.",
      priority: "medium",
      timestamp: now,
    };
  }

  // 4. Continue Current Activity
  if (currentSection && !completedSections.includes(currentSection)) {
    return {
      type: "continue",
      recommendation: `Absorb Section ${currentSection}`,
      whySuggested: `You are currently reading Section ${currentSection}. Take your time to review the slokas and explanations.`,
      nextAction: "Read this section or ask Gyaneshwara to clarify the terms.",
      priority: "low",
      timestamp: now,
    };
  }

  // 5. Move to Next Section
  if (sections && sections.length > 0) {
    const nextSec = sections.find((s) => !completedSections.includes(s.number));
    if (nextSec) {
      return {
        type: "move_next",
        recommendation: `Proceed to Section ${nextSec.number}`,
        whySuggested: "You have successfully completed reading the active section. Moving to the next section keeps your learning momentum going.",
        nextAction: `Scroll down to Section ${nextSec.number}: ${nextSec.title}.`,
        priority: "medium",
        timestamp: now,
      };
    }
  }

  // 6. Revise Previous Topic
  if (completedSections.length >= sections.length && sections.length > 0) {
    const firstSec = sections[0];
    return {
      type: "revise",
      recommendation: "Revise Previous Concepts",
      whySuggested: "A quick revision of the introductory sections will build confidence in advanced concepts.",
      nextAction: `Read Section ${firstSec.number}: ${firstSec.title} or ask Gyaneshwara for a summary.`,
      priority: "low",
      timestamp: now,
    };
  }

  // Fallback
  return {
    type: "continue",
    recommendation: "Explore the Lesson Curricula",
    whySuggested: "Exploring sections and interacting with visuals helps cement conceptual understanding of Jyotiṣa.",
    nextAction: "Start reading the first section.",
    priority: "low",
    timestamp: now,
  };
}
