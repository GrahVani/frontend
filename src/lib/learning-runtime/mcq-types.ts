/**
 * Grahvani Learning Runtime — MCQ data structures.
 * Mirrors the schema in `curriculum/assessment-bank/tier-1-mcq-bank/<slug>.json`
 * (informal; the curriculum's `06-assessment-design-standard.md` is authoritative).
 */

import type { BloomLevel, SourceRef } from "./types";

export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "single-best" | "multi-select";

export interface McqOption {
  id: string; // "A" | "B" | "C" | "D"
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface SpacedRepetitionCard {
  includeInSrDeck: boolean;
  srCardFront: string;
  srCardBack: string;
}

export interface McqQuestion {
  id: string;
  stem: string;
  stemDevanagari?: string | null;
  questionType: QuestionType;
  bloomLevel: BloomLevel;
  difficulty: Difficulty;
  options: McqOption[];
  primarySources: SourceRef[];
  modernSources: SourceRef[];
  tags?: string[];
  spacedRepetition?: SpacedRepetitionCard;
}

export interface McqBank {
  lessonSlug: string;
  lessonCanonicalPath: string;
  moduleSlug: string;
  tier: number;
  schemaVersion: string;
  questions: McqQuestion[];
}
