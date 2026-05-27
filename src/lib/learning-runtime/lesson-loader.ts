/**
 * Grahvani Learning Runtime — lesson loader (server-side).
 *
 * For B2: reads lesson markdown directly from the curriculum/ directory via
 * Node's fs API. This is the hybrid model's "filesystem source" for content
 * per `00-design-constitution.md` §21.1 — body markdown lives in curriculum/,
 * state lives in DB.
 *
 * Lesson 1 path resolution example:
 *   URL: /learn/tier-1/module-1/chapter-1/lesson-1
 *   File: ../curriculum/tier-1-foundation/module-01-introduction-to-jyotisha/
 *         chapter-01-what-jyotisha-is/lesson-01-jyotisha-as-vedanga.md
 *
 * The mapping uses two heuristics:
 *  1. URL segment "tier-N" matches directory starting with "tier-N-".
 *  2. URL segment "module-N" / "chapter-N" / "lesson-N" matches a directory
 *     or file starting with the same slug but with N zero-padded to two digits
 *     (e.g., "module-1" → "module-01-…").
 *
 * Server-component only — uses Node fs APIs and must not be imported from
 * client components.
 */

import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { splitSections } from "./markdown-parser";
import type { LessonFrontMatter, ParsedLesson } from "./types";

const CURRICULUM_ROOT = path.resolve(process.cwd(), "..", "curriculum");

/**
 * Pad a URL number to two digits. "1" → "01", "12" → "12".
 * Extracts the leading numeric portion, ignoring any non-digit prefix
 * and anything after the first number. This prevents filenames that
 * contain numbers in their descriptive slug (e.g.
 * "lesson-04-the-23-degree-gap...") from concatenating extra digits.
 */
function padTwo(segment: string): string {
  const match = segment.match(/^\D*(\d+)/);
  const num = match ? match[1] : segment;
  return num.padStart(2, "0");
}

/**
 * Strip a known segment prefix from a URL fragment.
 * "tier-1" → "1", "module-12" → "12".
 */
function stripPrefix(segment: string, prefix: string): string {
  return segment.startsWith(prefix + "-") ? segment.slice(prefix.length + 1) : segment;
}

/**
 * Find a directory inside `parent` whose name starts with `prefix`.
 * Used to resolve "tier-1" → "tier-1-foundation", "module-01" → "module-01-introduction-to-jyotisha".
 */
async function findDirByPrefix(parent: string, prefix: string): Promise<string> {
  const entries = await fs.readdir(parent, { withFileTypes: true });
  const match = entries.find(
    (entry) => entry.isDirectory() && entry.name.startsWith(prefix),
  );
  if (!match) {
    throw new Error(
      `[lesson-loader] No directory matching prefix "${prefix}" in ${parent}`,
    );
  }
  return path.join(parent, match.name);
}

/**
 * Find a markdown file inside `parent` whose name starts with `prefix` and ends with `.md`.
 * "lesson-01" → "lesson-01-jyotisha-as-vedanga.md".
 */
async function findFileByPrefix(parent: string, prefix: string): Promise<string> {
  const entries = await fs.readdir(parent, { withFileTypes: true });
  const match = entries.find(
    (entry) =>
      entry.isFile() &&
      entry.name.startsWith(prefix) &&
      entry.name.endsWith(".md"),
  );
  if (!match) {
    throw new Error(
      `[lesson-loader] No file matching prefix "${prefix}" (.md) in ${parent}`,
    );
  }
  return path.join(parent, match.name);
}

/**
 * Resolve URL segments to an absolute filesystem path.
 */
export async function resolveLessonPath(
  tier: string,
  module: string,
  chapter: string,
  lesson: string,
): Promise<string> {
  const tierN = stripPrefix(tier, "tier");
  const moduleN = padTwo(module);
  const chapterN = padTwo(chapter);
  const lessonN = padTwo(lesson);

  const tierDir = await findDirByPrefix(CURRICULUM_ROOT, `tier-${tierN}-`);
  const moduleDir = await findDirByPrefix(tierDir, `module-${moduleN}-`);
  const chapterDir = await findDirByPrefix(moduleDir, `chapter-${chapterN}-`);
  const lessonFile = await findFileByPrefix(chapterDir, `lesson-${lessonN}-`);

  return lessonFile;
}

/**
 * Normalize gray-matter's raw front-matter object into our typed schema.
 * Gray-matter returns snake_case keys; we convert to camelCase and apply
 * sensible defaults for optional fields.
 */
function normalizeFrontMatter(raw: Record<string, unknown>): LessonFrontMatter {
  const f = raw as Record<string, unknown>;

  // Helper for safe array access
  const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
  const asStringArray = (v: unknown): string[] =>
    asArray(v).filter((x): x is string => typeof x === "string");
  const asSourceRefArray = (v: unknown) =>
    asArray(v).map((entry) => {
      if (typeof entry === "string") return { ref: entry, note: "" };
      if (entry && typeof entry === "object") {
        const o = entry as Record<string, unknown>;
        return {
          ref: typeof o.ref === "string" ? o.ref : "",
          note: typeof o.note === "string" ? o.note : undefined,
        };
      }
      return { ref: "" };
    });

  // The lesson's interactive descriptor — gray-matter parses nested YAML.
  const rawInteractive = f.interactive as Record<string, unknown> | undefined;
  const interactive = rawInteractive
    ? {
        enabled: Boolean(rawInteractive.enabled),
        componentType:
          typeof rawInteractive.component_type === "string"
            ? rawInteractive.component_type
            : typeof rawInteractive.component === "string"
              ? rawInteractive.component
              : undefined,
        specFile:
          typeof rawInteractive.spec_file === "string"
            ? rawInteractive.spec_file
            : undefined,
        astroEngineEndpoints: asStringArray(rawInteractive.astro_engine_endpoints),
        fallbackIfOffline:
          typeof rawInteractive.fallback_if_offline === "string"
            ? rawInteractive.fallback_if_offline
            : undefined,
        justification:
          typeof rawInteractive.justification === "string"
            ? rawInteractive.justification
            : undefined,
      }
    : undefined;

  return {
    slug: String(f.slug ?? ""),
    title: String(f.title ?? ""),
    titleDevanagari: typeof f.title_devanagari === "string" ? f.title_devanagari : undefined,
    subtitle: typeof f.subtitle === "string" ? f.subtitle : undefined,
    tier: Number(f.tier ?? 0),
    module: Number(f.module ?? 0),
    moduleSlug: typeof f.module_slug === "string" ? f.module_slug : undefined,
    chapter: Number(f.chapter ?? 0),
    chapterSlug: typeof f.chapter_slug === "string" ? f.chapter_slug : undefined,
    sequence: Number(f.sequence ?? 0),
    canonicalPath: String(f.canonical_path ?? ""),
    lessonType: String(f.lesson_type ?? "conceptual"),
    bloomLevels: asStringArray(f.bloom_levels) as LessonFrontMatter["bloomLevels"],
    targetMinutesReading:
      typeof f.target_minutes_reading === "number" ? f.target_minutes_reading : undefined,
    targetMinutesTotal:
      typeof f.target_minutes_total === "number" ? f.target_minutes_total : undefined,
    streams: asStringArray(f.streams),
    streamNeutrality: typeof f.stream_neutrality === "boolean" ? f.stream_neutrality : undefined,
    prerequisites: asStringArray(f.prerequisites),
    postrequisites: asStringArray(f.postrequisites),
    learningOutcomes: asStringArray(f.learning_outcomes),
    primarySources: asSourceRefArray(f.primary_sources),
    modernSources: asSourceRefArray(f.modern_sources),
    interactive,
    mcqCount: typeof f.mcq_count === "number" ? f.mcq_count : undefined,
    mcqBankFile: typeof f.mcq_bank_file === "string" ? f.mcq_bank_file : undefined,
    authoringStatus:
      typeof f.authoring_status === "string"
        ? f.authoring_status
        : typeof f.status === "string"
          ? f.status
          : undefined,
    version: (f.version as string | number | undefined),
    authors: asStringArray(f.authors),
    technicalReviewer:
      typeof f.technical_reviewer === "string" ? f.technical_reviewer : undefined,
    pedagogicalReviewer:
      typeof f.pedagogical_reviewer === "string" ? f.pedagogical_reviewer : undefined,
    hasDevanagari: typeof f.has_devanagari === "boolean" ? f.has_devanagari : undefined,
    hasDiagrams: typeof f.has_diagrams === "boolean" ? f.has_diagrams : undefined,
    hasAudioPronunciation:
      typeof f.has_audio_pronunciation === "boolean" ? f.has_audio_pronunciation : undefined,
    estimatedReadingGrade:
      typeof f.estimated_reading_grade === "number" ? f.estimated_reading_grade : undefined,
  };
}

/**
 * Load and parse a lesson by URL segments.
 *
 * @throws when the lesson file cannot be located in the curriculum tree.
 */
export async function loadLesson(
  tier: string,
  module: string,
  chapter: string,
  lesson: string,
): Promise<ParsedLesson> {
  const filePath = await resolveLessonPath(tier, module, chapter, lesson);
  const raw = await fs.readFile(filePath, "utf-8");

  const parsed = matter(raw);
  const frontMatter = normalizeFrontMatter(parsed.data);
  const sections = splitSections(parsed.content);

  return {
    frontMatter,
    sections,
    rawBody: parsed.content,
    filePath,
  };
}
