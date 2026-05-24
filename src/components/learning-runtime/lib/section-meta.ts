/**
 * Section presentation metadata — per Phase C-Reformed.
 *
 * Each canonical §-section has an embodied rail label (the learner-facing
 * name) + an eyebrow ("Before we begin", "From the source", etc.) + an
 * accent graha hue per the design constitution v0.3 Reform-2.
 */

import type { LessonSection, SectionType } from "@/lib/learning-runtime/types";

export type SectionRole =
  | "hook"
  | "orientation-prereq"
  | "orientation-outcomes"
  | "body"
  | "sloka"
  | "worked-example"
  | "interactive"
  | "mistakes"
  | "anchors"
  | "practice"
  | "summary"
  | "continuation";

export interface SectionPresentation {
  role: SectionRole;
  /** Learner-facing label for the rail. */
  railLabel: string;
  /** Short eyebrow line that sits above the section title. */
  eyebrow: string;
  /** Section's embodied title (what learner sees as h2). */
  embodiedTitle: string;
  /** Graha hue accent per the design constitution v0.3 §C-Reform-2. */
  accentHex: string;
  accentName: string;
  /** Reading time bucket in minutes, before section-content scaling. */
  baseMinutes: number;
}

const ROLE_PRESENTATION: Record<SectionRole, Omit<SectionPresentation, "role">> = {
  hook: {
    railLabel: "Begin",
    eyebrow: "Open the door",
    embodiedTitle: "",
    accentHex: "#E8B845", // Sūrya gold
    accentName: "surya",
    baseMinutes: 2,
  },
  "orientation-prereq": {
    railLabel: "Before we begin",
    eyebrow: "Before we begin",
    embodiedTitle: "What you should know first",
    accentHex: "#3A8C5A", // Budha green
    accentName: "budha",
    baseMinutes: 1,
  },
  "orientation-outcomes": {
    railLabel: "By the end",
    eyebrow: "By the end you will",
    embodiedTitle: "Be able to:",
    accentHex: "#3A8C5A", // Budha green
    accentName: "budha",
    baseMinutes: 1,
  },
  body: {
    railLabel: "The core teaching",
    eyebrow: "The teaching",
    embodiedTitle: "",
    accentHex: "#E89E2A", // Guru saffron
    accentName: "guru",
    baseMinutes: 8,
  },
  sloka: {
    railLabel: "From the source",
    eyebrow: "From the source",
    embodiedTitle: "Pāṇinīya Śikṣā · 41–42",
    accentHex: "#A23A1E", // deeper vermilion
    accentName: "vermilion",
    baseMinutes: 3,
  },
  "worked-example": {
    railLabel: "In practice",
    eyebrow: "In practice",
    embodiedTitle: "Worked through, step by step",
    accentHex: "#A8C8E8", // Śukra
    accentName: "shukra",
    baseMinutes: 4,
  },
  interactive: {
    railLabel: "Explore",
    eyebrow: "Explore",
    embodiedTitle: "Move through history, see the ecosystem",
    accentHex: "#D8DBE8", // Candra pearl
    accentName: "candra",
    baseMinutes: 5,
  },
  mistakes: {
    railLabel: "Traps to avoid",
    eyebrow: "Watch out",
    embodiedTitle: "Traps to avoid",
    accentHex: "#C8412E", // Maṅgala coral
    accentName: "mangala",
    baseMinutes: 3,
  },
  anchors: {
    railLabel: "Remember",
    eyebrow: "Carry forward",
    embodiedTitle: "Remember these",
    accentHex: "#E89E2A", // Guru saffron deeper
    accentName: "guru",
    baseMinutes: 2,
  },
  practice: {
    railLabel: "Practice",
    eyebrow: "Practice",
    embodiedTitle: "Test what you know",
    accentHex: "#2C2C3E", // Śani discipline
    accentName: "shani",
    baseMinutes: 4,
  },
  summary: {
    railLabel: "Compressed",
    eyebrow: "Compressed",
    embodiedTitle: "The whole lesson in 90 seconds",
    accentHex: "#C9A24D", // gold-primary
    accentName: "gold",
    baseMinutes: 2,
  },
  continuation: {
    railLabel: "Where this came from",
    eyebrow: "Where this came from",
    embodiedTitle: "Sources & further reading",
    accentHex: "#A8C8E8", // Śukra connection
    accentName: "shukra",
    baseMinutes: 1,
  },
};

const SECTION_TYPE_TO_ROLE: Record<SectionType, SectionRole> = {
  hook: "hook",
  prerequisites: "orientation-prereq",
  outcomes: "orientation-outcomes",
  body: "body",
  sloka: "sloka",
  "worked-example": "worked-example",
  interactive: "interactive",
  "common-mistakes": "mistakes",
  "things-to-remember": "anchors",
  mcq: "practice",
  summary: "summary",
  continuation: "continuation",
  unknown: "body",
};

export function presentationFor(section: LessonSection): SectionPresentation {
  const role = SECTION_TYPE_TO_ROLE[section.type];
  return { role, ...ROLE_PRESENTATION[role] };
}

/** Rough reading-time estimate from section body length. ~240 wpm baseline. */
export function estimateReadingMinutes(section: LessonSection): number {
  const words = (section.body.match(/\S+/g) ?? []).length;
  const base = ROLE_PRESENTATION[SECTION_TYPE_TO_ROLE[section.type]].baseMinutes;
  const fromWords = Math.round(words / 240);
  // Blend: heavier weight to actual word count, base as a floor for very short sections.
  return Math.max(base, fromWords);
}
