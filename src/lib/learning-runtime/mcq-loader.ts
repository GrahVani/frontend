/**
 * Grahvani Learning Runtime — MCQ bank loader (server-side).
 *
 * Reads MCQ JSON from `curriculum/assessment-bank/tier-X-mcq-bank/<slug>.json`
 * and normalises snake_case → camelCase to match the typed McqBank.
 *
 * Server-component only — uses Node fs APIs.
 */

import { promises as fs } from "fs";
import path from "path";
import type { McqBank, McqOption, McqQuestion, SpacedRepetitionCard, QuestionType, Difficulty } from "./mcq-types";
import type { BloomLevel, SourceRef } from "./types";

const CURRICULUM_ROOT = path.resolve(process.cwd(), "..", "curriculum");

function asSourceRefs(raw: unknown): SourceRef[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry): SourceRef | null => {
      if (typeof entry === "string") return { ref: entry };
      if (entry && typeof entry === "object") {
        const o = entry as Record<string, unknown>;
        if (typeof o.ref === "string") {
          return { ref: o.ref, note: typeof o.note === "string" ? o.note : undefined };
        }
      }
      return null;
    })
    .filter((x): x is SourceRef => x !== null);
}

function normaliseOption(raw: unknown): McqOption {
  const o = raw as Record<string, unknown>;
  return {
    id: String(o.id ?? ""),
    text: String(o.text ?? ""),
    isCorrect: Boolean(o.is_correct ?? o.isCorrect ?? false),
    explanation: String(o.explanation ?? ""),
  };
}

function normaliseQuestion(raw: unknown): McqQuestion {
  const q = raw as Record<string, unknown>;
  const sr = q.spaced_repetition as Record<string, unknown> | undefined;
  const spacedRepetition: SpacedRepetitionCard | undefined = sr
    ? {
        includeInSrDeck: Boolean(sr.include_in_sr_deck ?? false),
        srCardFront: String(sr.sr_card_front ?? ""),
        srCardBack: String(sr.sr_card_back ?? ""),
      }
    : undefined;

  return {
    id: String(q.id ?? ""),
    stem: String(q.stem ?? q.question_text ?? ""),
    stemDevanagari: typeof q.stem_devanagari === "string" ? q.stem_devanagari : null,
    questionType: (String(q.question_type ?? "single-best") as QuestionType),
    bloomLevel: (String(q.bloom_level ?? "Remember") as BloomLevel),
    difficulty: (String(q.difficulty ?? "easy") as Difficulty),
    options: Array.isArray(q.options) ? q.options.map(normaliseOption) : [],
    primarySources: asSourceRefs(q.primary_sources),
    modernSources: asSourceRefs(q.modern_sources),
    tags: Array.isArray(q.tags) ? (q.tags as string[]) : undefined,
    spacedRepetition,
  };
}

/**
 * Load an MCQ bank by its file path relative to `curriculum/`.
 * Example: `assessment-bank/tier-1-mcq-bank/jyotisha-as-vedanga.json`
 */
export async function loadMcqBank(relativePath: string): Promise<McqBank | null> {
  const absolute = path.join(CURRICULUM_ROOT, relativePath);
  try {
    const raw = await fs.readFile(absolute, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      lessonSlug: String(parsed.lesson_slug ?? ""),
      lessonCanonicalPath: String(parsed.lesson_canonical_path ?? ""),
      moduleSlug: String(parsed.module_slug ?? ""),
      tier: Number(parsed.tier ?? 0),
      schemaVersion: String(parsed.schema_version ?? "1.0"),
      questions: Array.isArray(parsed.questions) ? parsed.questions.map(normaliseQuestion) : [],
    };
  } catch (err) {
    if (typeof console !== "undefined") {
      console.warn(`[mcq-loader] could not read ${absolute}:`, err);
    }
    return null;
  }
}
