/**
 * Learning Template
 *
 * Reusable layout for lesson and concept pages.
 * Purpose: guide the learner through a concept from introduction to mastery.
 *
 * Structure:
 * 1. Concept
 * 2. Explanation
 * 3. Visualization
 * 4. Interactive Element
 * 5. Practice
 * 6. Summary
 */

import { layoutSpacing } from '@/design-system/foundations/spacing';

export interface LearningTemplate {
  /** 1. The concept being taught. */
  concept: {
    title: string;
    description?: string;
    children?: React.ReactNode;
  };

  /** 2. Detailed explanation. */
  explanation: {
    children: React.ReactNode;
  };

  /** 3. Visual representation. */
  visualization?: {
    children: React.ReactNode;
  };

  /** 4. Interactive simulator, quiz, or exploration. */
  interactive?: {
    children: React.ReactNode;
  };

  /** 5. Practice exercise or worked example. */
  practice?: {
    children: React.ReactNode;
  };

  /** 6. Lesson summary and continuation. */
  summary: {
    children: React.ReactNode;
  };
}

export const learningTemplateClasses = {
  root: `space-y-${layoutSpacing.section.contentGap.value}`,
  conceptArea: `space-y-${layoutSpacing.content.tightGap.value}`,
  explanationArea: `space-y-${layoutSpacing.content.tightGap.value}`,
  visualizationArea: `space-y-${layoutSpacing.content.tightGap.value}`,
  interactiveArea: `space-y-${layoutSpacing.content.tightGap.value}`,
  practiceArea: `space-y-${layoutSpacing.content.tightGap.value}`,
  summaryArea: `space-y-${layoutSpacing.content.tightGap.value}`,
};

/**
 * The Learning Template enforces a pedagogical progression:
 * concept → explanation → visualization → interaction → practice → summary.
 *
 * Not every lesson needs every section, but the order must be preserved.
 */
