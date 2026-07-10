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
  component?: string;
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

export function classifySection(number: string, title?: string): { group: SectionGroup; type: SectionType } {
  // Sub-sections (e.g., "3.1") inherit from their parent major.
  const major = number.split(".")[0];
  const meta = SECTION_METADATA[major];

  // Title-based heuristics for curriculum files that use different § numbering
  // (e.g., M3 uses §1-§14 with different semantics than M1's §1-§12).
  if (title && meta) {
    const lower = title.toLowerCase();
    // Sloka detection: classical citation, śloka, source, authority
    if (
      lower.includes("śloka") ||
      lower.includes("sloka") ||
      lower.includes("source") ||
      lower.includes("authority") ||
      lower.includes("classical citation") ||
      lower.includes("sūrya siddhānta") ||
      lower.includes("muhūrta cintāmaṇi")
    ) {
      return { group: "Learn", type: "sloka" };
    }
    // Interactive detection
    if (
      lower.includes("interactive") ||
      lower.includes("pancanga-builder") ||
      lower.includes("calculator") ||
      lower.includes("explorer") ||
      lower.includes("visualizer")
    ) {
      return { group: "Learn", type: "interactive" };
    }
    // Mistakes detection
    if (lower.includes("mistake") || lower.includes("trap") || lower.includes("watch out")) {
      return { group: "Practice", type: "common-mistakes" };
    }
    // Remember detection
    if (lower.includes("remember") || lower.includes("things to remember") || lower.includes("anchor")) {
      return { group: "Practice", type: "things-to-remember" };
    }
    // MCQ / practice detection
    if (
      lower.includes("test yourself") ||
      lower.includes("mcq") ||
      lower.includes("self-check") ||
      lower.includes("mastery checkpoint") ||
      lower.includes("practice")
    ) {
      return { group: "Practice", type: "mcq" };
    }
    // Summary detection
    if (lower.includes("summary") || lower.includes("90 seconds") || lower.includes("recap")) {
      return { group: "Finish", type: "summary" };
    }
    // Continuation / bibliography detection
    if (
      lower.includes("citation") ||
      lower.includes("bibliography") ||
      lower.includes("further reading") ||
      lower.includes("cross-reference") ||
      lower.includes("next-lesson")
    ) {
      return { group: "Finish", type: "continuation" };
    }
    // Hook detection
    if (
      lower.includes("hook") ||
      lower.includes("why this lesson matters") ||
      lower.includes("why this matters")
    ) {
      return { group: "Start", type: "hook" };
    }
    // Outcomes detection
    if (
      lower.includes("outcome") ||
      lower.includes("able to do") ||
      lower.includes("you will be able")
    ) {
      return { group: "Start", type: "outcomes" };
    }
    // Prerequisites detection
    if (lower.includes("prereq") || lower.includes("should know") || lower.includes("before")) {
      return { group: "Start", type: "prerequisites" };
    }
    // Worked example detection
    if (lower.includes("worked") || lower.includes("example") || lower.includes("recognition")) {
      return { group: "Learn", type: "worked-example" };
    }
    // Body detection (fallback for teaching sections)
    if (
      lower.includes("body") ||
      lower.includes("teaching") ||
      lower.includes("core") ||
      lower.includes("formula") ||
      lower.includes("workflow") ||
      lower.includes("computation")
    ) {
      return { group: "Learn", type: "body" };
    }
  }

  return meta ?? { group: "Learn", type: "unknown" };
}
