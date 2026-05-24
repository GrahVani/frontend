/**
 * Grahvani Learning Runtime — typed lesson data structures.
 *
 * The shape that `lesson-loader.ts` produces and that every chrome primitive
 * consumes. Matches `curriculum/02-lesson-authoring-standard.md` §3 (front
 * matter schema) and §4 (twelve-section body).
 */

export type LessonType =
  | "conceptual"
  | "calculative"
  | "interpretive"
  | "synthesis"
  | "prose-essay"
  | "case-study"
  | string; // accept future types without code changes

export type BloomLevel =
  | "Remember"
  | "Understand"
  | "Apply"
  | "Analyze"
  | "Evaluate"
  | "Create";

export type SectionGroup = "Start" | "Learn" | "Practice" | "Finish";

export interface SourceRef {
  ref: string;
  note?: string;
}

export interface InteractiveDescriptor {
  enabled: boolean;
  componentType?: string;
  specFile?: string;
  astroEngineEndpoints?: string[];
  fallbackIfOffline?: string;
  justification?: string;
}

export interface LessonFrontMatter {
  /** Identity */
  slug: string;
  title: string;
  titleDevanagari?: string;
  subtitle?: string;

  /** Placement */
  tier: number;
  module: number;
  moduleSlug?: string;
  chapter: number;
  chapterSlug?: string;
  sequence: number;
  canonicalPath: string;

  /** Pedagogical metadata */
  lessonType: LessonType;
  bloomLevels: BloomLevel[];
  targetMinutesReading?: number;
  targetMinutesTotal?: number;

  /** Stream coverage */
  streams: string[];
  streamNeutrality?: boolean;

  /** Dependencies */
  prerequisites: string[];
  postrequisites: string[];

  /** Learning outcomes (3–7) */
  learningOutcomes: string[];

  /** Sources */
  primarySources: SourceRef[];
  modernSources: SourceRef[];

  /** Interactive */
  interactive?: InteractiveDescriptor;

  /** Assessment */
  mcqCount?: number;
  mcqBankFile?: string;

  /** Audit + versioning */
  authoringStatus?: string;
  version?: string | number;
  authors?: string[];
  technicalReviewer?: string;
  pedagogicalReviewer?: string;

  /** Accessibility */
  hasDevanagari?: boolean;
  hasDiagrams?: boolean;
  hasAudioPronunciation?: boolean;
  estimatedReadingGrade?: number;
}

/**
 * One §-section of a lesson body. Section numbers are strings ("1", "2", …,
 * or sub-sections like "3.1") so the natural sort is by major.minor.
 */
export interface LessonSection {
  /** "1" through "12", or sub-sections like "4.1", "4.2" if the lesson uses them. */
  number: string;
  /** Heading after the section marker — e.g., "Hook" or "Body — the core teaching". */
  title: string;
  /** Raw markdown body of the section, without the `# §N` heading line itself. */
  body: string;
  /** Pedagogical 7E-derived grouping per `01-pedagogical-framework.md` §3. */
  group: SectionGroup;
  /** Section type for visual treatment (definition, overview, mechanics, …). */
  type: SectionType;
}

export type SectionType =
  | "hook"
  | "prerequisites"
  | "outcomes"
  | "body"
  | "sloka"
  | "worked-example"
  | "interactive"
  | "common-mistakes"
  | "things-to-remember"
  | "mcq"
  | "summary"
  | "continuation"
  | "unknown";

export interface ParsedLesson {
  frontMatter: LessonFrontMatter;
  sections: LessonSection[];
  /** The raw markdown body after the front matter (whole body, ungrouped). */
  rawBody: string;
  /** Source file path for debugging / authoring tools. */
  filePath: string;
}

/**
 * Map of section number → pedagogical group + type. Derived from the curriculum
 * standard's 12-section template per `02-lesson-authoring-standard.md` §4 and
 * `00-design-constitution.md` §9.1 (group classification).
 */
export const SECTION_METADATA: Record<string, { group: SectionGroup; type: SectionType }> = {
  "1": { group: "Start", type: "hook" },
  "2": { group: "Start", type: "prerequisites" },
  "3": { group: "Start", type: "outcomes" },
  "4": { group: "Learn", type: "body" },
  "5": { group: "Learn", type: "sloka" },
  "6": { group: "Learn", type: "worked-example" },
  "7": { group: "Learn", type: "interactive" },
  "8": { group: "Practice", type: "common-mistakes" },
  "9": { group: "Practice", type: "things-to-remember" },
  "10": { group: "Practice", type: "mcq" },
  "11": { group: "Finish", type: "summary" },
  "12": { group: "Finish", type: "continuation" },
};

export function classifySection(number: string): { group: SectionGroup; type: SectionType } {
  // Sub-sections (e.g., "3.1") inherit from their parent major.
  const major = number.split(".")[0];
  return SECTION_METADATA[major] ?? { group: "Learn", type: "unknown" };
}
