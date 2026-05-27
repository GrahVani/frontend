/**
 * Section presentation metadata — per Phase C-Reformed.
 *
 * Each canonical §-section has an embodied rail label (the learner-facing
 * name) + an eyebrow ("Before we begin", "From the source", etc.) + an
 * accent graha hue per the design constitution v0.3 Reform-2.
 */

import type { LessonSection, LessonFrontMatter, SectionType } from "@/lib/learning-runtime/types";

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

/**
 * Lesson-specific embodied-title / eyebrow overrides.
 *
 * `ROLE_PRESENTATION` carries the section-ROLE defaults (every lesson's §7
 * has `railLabel: "Explore"` — that's by design). But the embodied titles
 * MUST be lesson-specific because each lesson's §5 cites a different śloka,
 * each lesson's §7 hosts a different interactive, each lesson's §8 disarms
 * a different confusion. Generic embodied titles leak L1's framing onto
 * every other lesson — exactly the rot the founder caught.
 *
 * Add a lesson's slug → section-number → partial override here whenever
 * the section's specific subject differs from the role default.
 */
const LESSON_SECTION_OVERRIDES: Record<
  string,
  Record<string, Partial<SectionPresentation>>
> = {
  "jyotisha-as-vedanga": {
    "5": { embodiedTitle: "Pāṇinīya Śikṣā · 41 — the six-limbed Veda" },
    "7": { embodiedTitle: "Move through history, see the ecosystem" },
    "8": { embodiedTitle: "Vedāṅga is not Vedānta — and three more traps" },
  },
  "the-six-vedangas-and-their-relationship": {
    "5": { embodiedTitle: "Pāṇinīya Śikṣā · 42 + Vedāṅga Jyotiṣa opening" },
    "7": { embodiedTitle: "Hub the interlocks, then drill the sāṅga habit" },
    "8": { embodiedTitle: "Sāṅga is not modular — and the missed couplings" },
  },
  "jyotisha-vs-western-astrology-vs-pop-astrology": {
    "5": { embodiedTitle: "Vedāṅga Jyotiṣa — the tradition's own opening" },
    "7": { embodiedTitle: "Trace the Indo-Hellenistic lineage, drill the disambiguation" },
    "8": { embodiedTitle: "Conflations that misread the tradition" },
  },
  "philosophy-of-karma-and-prediction": {
    "5": { embodiedTitle: "Bhagavad Gītā 4.17 — gahanā karmaṇo gatiḥ" },
    "7": { embodiedTitle: "See visibility vs agency, drill the indication translation" },
    "8": { embodiedTitle: "Deterministic-specifics — the framework-incoherent trap" },
  },
  "the-historical-timeline-of-jyotisha": {
    "5": { embodiedTitle: "Pingree (1981) — on the academic chronology" },
    "7": { embodiedTitle: "Trace the dating divergences, drill the citation discipline" },
    "8": { embodiedTitle: "Recension blindness, dating mixing, translator elision" },
  },
  "parashara-the-foundational-rishi": {
    "5": { embodiedTitle: "BPHS Adhyāya 1.1 — the Parāśara-Maitreya dialogue frame" },
    "7": { embodiedTitle: "Walk one canonical verse across recensions, drill BPHS citation" },
    "8": { embodiedTitle: "Collapsing the duality, over-attributing antiquity, vague \"per BPHS\"" },
  },
  "varahamihira-the-systematic-codifier": {
    "5": { embodiedTitle: "Bṛhat Saṁhitā 1.1 — the encyclopaedic project's self-declaration" },
    "7": { embodiedTitle: "See the chronological anchor at work, drill the both-anchors framework" },
    "8": { embodiedTitle: "Over-applying BPHS-style recension worry, mis-using citation networks" },
  },
  "medieval-codifiers-kalyanavarma-mantresvara": {
    "5": { embodiedTitle: "Phaladīpikā 1.1 — Mantreśvara's pedagogical declaration" },
    "7": { embodiedTitle: "Drill the codifier discipline — 5 scenarios on dating + citation" },
    "8": { embodiedTitle: "Flattening the three layers, dismissing codifier authority, ignoring chain length" },
  },
  "jaimini-and-the-second-tradition": {
    "5": { embodiedTitle: "Jaiminī Sūtra 1.1.1 — the second tradition's opening verse" },
    "7": { embodiedTitle: "Pair the doctrines, then drill the tradition-attribution discipline" },
    "8": { embodiedTitle: "Subordinating Jaiminī, mixing aspect-systems, collapsing the cross-text identity" },
  },
  "modern-founders-krishnamurti-and-joshi": {
    "5": { embodiedTitle: "KP Reader Vol I — K.S. Krishnamurti's foundational sub-lord doctrine" },
    "7": { embodiedTitle: "Survey the four-stream matrix, then drill the chapter-capstone Bloom-Evaluate" },
    "8": { embodiedTitle: "Mere-innovations, competing-schools, Sanskrit-criterion, cross-stream-critique-without-fluency" },
  },
  "tithi-as-12-degrees-of-sun-moon-angle": {
    "7": { embodiedTitle: "Sūrya Siddhānta Spaṣṭādhyāya — true-longitude computational mechanics" },
    "8": { embodiedTitle: "Mean vs true longitudes, pañcāṅga vs instantaneous, premature muhūrta judgment, forgetting tithi-first status" },
  },
  "the-15-shukla-tithis": {
    "7": { embodiedTitle: "Bṛhat Saṁhitā Adhyāya 100 — the 30-tithi deity-quality wheel" },
    "8": { embodiedTitle: "Name-number confusion, forgetting special names, misattributing deities, treating correspondences as faith claims" },
  },
  "the-15-krishna-tithis": {
    "7": { embodiedTitle: "Bṛhat Saṁhitā Adhyāya 100 — the 30-tithi deity-quality wheel (kṛṣṇa pakṣa focus)" },
    "8": { embodiedTitle: "Universal inauspiciousness fallacy, Mahā-Śivarātri vs monthly confusion, Pitṛ Pakṣa overgeneralisation, Amāvāsyā darkness bias" },
  },
};

export function presentationFor(
  section: LessonSection,
  frontMatter?: LessonFrontMatter,
): SectionPresentation {
  const role = SECTION_TYPE_TO_ROLE[section.type];
  const base = { role, ...ROLE_PRESENTATION[role] };
  if (frontMatter) {
    const override = LESSON_SECTION_OVERRIDES[frontMatter.slug]?.[section.number];
    if (override) return { ...base, ...override };
  }
  return base;
}

/** Rough reading-time estimate from section body length. ~240 wpm baseline. */
export function estimateReadingMinutes(section: LessonSection): number {
  const words = (section.body.match(/\S+/g) ?? []).length;
  const base = ROLE_PRESENTATION[SECTION_TYPE_TO_ROLE[section.type]].baseMinutes;
  const fromWords = Math.round(words / 240);
  // Blend: heavier weight to actual word count, base as a floor for very short sections.
  return Math.max(base, fromWords);
}
