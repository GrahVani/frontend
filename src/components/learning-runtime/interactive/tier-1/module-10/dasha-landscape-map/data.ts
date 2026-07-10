/**
 * Daśā Landscape Map — Data Layer
 *
 * §7 interactive for Lesson 10.7.5 (The Honest State of Daśās: Doctrinal Pluralism).
 *
 * Holds the ~14 daśā systems grouped by class, the five-point discipline,
 * and honest-framing sentence templates.
 */

export type DashaClass = "default" | "alternative" | "conditional";

export interface DashaSystem {
  id: string;
  name: string;
  nameIAST: string;
  class: DashaClass;
  basis: string;
  totalYears?: string;
  note: string;
  stream: "parashari" | "jaimini" | "kp" | "multiple";
}

export interface DisciplineStep {
  step: number;
  title: string;
  titleIAST: string;
  description: string;
}

export interface HonestFrame {
  id: string;
  template: string;
  systems: string[];
  example: string;
}

/* ─── The ~14 daśā systems ─────────────────────────────────────────────── */

export const DASHA_SYSTEMS: DashaSystem[] = [
  // Default
  {
    id: "vimshottari",
    name: "Vimśottarī",
    nameIAST: "Vimśottarī",
    class: "default",
    basis: "Planet-based (nakṣatra-lord)",
    totalYears: "120",
    note: "The universal default. Always run first.",
    stream: "parashari",
  },
  // Alternatives (6)
  {
    id: "ashtottari",
    name: "Aṣṭottarī",
    nameIAST: "Aṣṭottarī",
    class: "alternative",
    basis: "Planet-based (8 lords, conditional)",
    totalYears: "108",
    note: "Conditional — activates for Rāhu-strong or specific birth conditions.",
    stream: "parashari",
  },
  {
    id: "yogini",
    name: "Yoginī",
    nameIAST: "Yoginī",
    class: "alternative",
    basis: "Yoginī-based (8 lords)",
    totalYears: "36",
    note: "Specialist use, often for spiritual questions.",
    stream: "parashari",
  },
  {
    id: "cara",
    name: "Cara",
    nameIAST: "Cara",
    class: "alternative",
    basis: "Sign-based (rāśi)",
    totalYears: "~84–96",
    note: "Jaimini primary timing tool. Variable durations.",
    stream: "jaimini",
  },
  {
    id: "sthira",
    name: "Sthira",
    nameIAST: "Sthira",
    class: "alternative",
    basis: "Sign-based (rāśi)",
    totalYears: "Variable",
    note: "Jaimini alternative to Cara. Different fixed-pattern rules.",
    stream: "jaimini",
  },
  {
    id: "kalachakra",
    name: "Kālacakra",
    nameIAST: "Kālacakra",
    class: "alternative",
    basis: "Sign-based (pāda-derived)",
    totalYears: "Variable",
    note: "Most intricate classical system. 108 pāda starting points.",
    stream: "parashari",
  },
  {
    id: "kp-vimshottari",
    name: "KP-modified Vimśottarī",
    nameIAST: "Kāśyapa-vimśottarī",
    class: "alternative",
    basis: "Planet-based (sub-lord subdivision)",
    totalYears: "120",
    note: "KP stream. Adds sub-lord and cuspal precision.",
    stream: "kp",
  },
  // Conditionals (7)
  {
    id: "shula",
    name: "Ṣūla",
    nameIAST: "Ṣūla",
    class: "conditional",
    basis: "Planet-based (conditional)",
    note: "Rarely used in modern practice. Preserved in classical texts.",
    stream: "parashari",
  },
  {
    id: "manduka",
    name: "Maṇḍūka",
    nameIAST: "Maṇḍūka",
    class: "conditional",
    basis: "Sign-based (conditional)",
    note: "Frog-jump sequence. Highly conditional activation.",
    stream: "parashari",
  },
  {
    id: "chakra",
    name: "Cakra",
    nameIAST: "Cakra",
    class: "conditional",
    basis: "Sign-based (wheel)",
    note: "Wheel-based progression. Specific chart conditions required.",
    stream: "parashari",
  },
  {
    id: "chaturashiti",
    name: "Caturāśīti-Sama",
    nameIAST: "Caturāśīti-sama",
    class: "conditional",
    basis: "Sign-based (84 years)",
    totalYears: "84",
    note: "Fixed 84-year cycle. Conditional on longevity indications.",
    stream: "parashari",
  },
  {
    id: "dvadashottari",
    name: "Dvādaśottarī",
    nameIAST: "Dvādaśottarī",
    class: "conditional",
    basis: "Planet-based (12 lords)",
    note: "Twelve-lord system. Specific nakṣatra conditions.",
    stream: "parashari",
  },
  {
    id: "dashottari",
    name: "Daśottarī",
    nameIAST: "Daśottarī",
    class: "conditional",
    basis: "Planet-based (10 lords)",
    note: "Ten-lord conditional. Preserved in classical corpus.",
    stream: "parashari",
  },
  {
    id: "shashti-hayani",
    name: "Ṣaṣṭi-hāyanī",
    nameIAST: "Ṣaṣṭi-hāyanī",
    class: "conditional",
    basis: "Planet-based (60 years)",
    totalYears: "60",
    note: "Sixty-year cycle. Used in specific regional traditions.",
    stream: "parashari",
  },
];

/* ─── Five-point discipline ────────────────────────────────────────────── */

export const DISCIPLINE_STEPS: DisciplineStep[] = [
  {
    step: 1,
    title: "Vimśottarī baseline",
    titleIAST: "Vimśottarī ādhāra",
    description: "Always run Vimśottarī first. It is the default for every chart and every practitioner.",
  },
  {
    step: 2,
    title: "Apply selection criteria",
    titleIAST: "Vicāra-kalpanā",
    description: "Check chart conditions that trigger conditional daśās (Rāhu-strong, specific nakṣatras, etc.).",
  },
  {
    step: 3,
    title: "Cross-validation",
    titleIAST: "Dvisammati",
    description: "Run a second daśā (Jaimini Cara/Sthira, or a triggered conditional) alongside Vimśottarī.",
  },
  {
    step: 4,
    title: "Two-yes principle",
    titleIAST: "Dvisammati-siddhānta",
    description: "Convergence = confidence. Divergence = nuance. One yes alone = uncertain.",
  },
  {
    step: 5,
    title: "Honest framing",
    titleIAST: "Satya-vyavahāra",
    description: "Name the systems used: 'Vimśottarī suggests X; Cara confirms.' No false authority.",
  },
];

/* ─── Honest framing templates ─────────────────────────────────────────── */

export const HONEST_FRAMES: HonestFrame[] = [
  {
    id: "single",
    template: "[System] suggests [outcome] in [timeframe].",
    systems: ["Vimśottarī"],
    example: "Vimśottarī suggests a career rise in the Saturn mahādaśā.",
  },
  {
    id: "confirm",
    template: "[System A] suggests [outcome]; [System B] confirms.",
    systems: ["Vimśottarī", "Cara"],
    example: "Vimśottarī suggests marriage; Cara daśā confirms the Libra period.",
  },
  {
    id: "nuance",
    template: "[System A] suggests [outcome]; [System B] offers a nuanced timing of [variant].",
    systems: ["Vimśottarī", "Cara"],
    example: "Vimśottarī suggests career change; Cara offers a nuanced timing via Capricorn period.",
  },
  {
    id: "conditional",
    template: "[System A] is the baseline; [System B] activates because [condition].",
    systems: ["Vimśottarī", "Aṣṭottarī"],
    example: "Vimśottarī is the baseline; Aṣṭottarī activates because Rāhu is strong in this chart.",
  },
  {
    id: "triple",
    template: "[System A] suggests [outcome]; [System B] confirms; [System C] refines the timing.",
    systems: ["Vimśottarī", "Cara", "KP"],
    example: "Vimśottarī suggests marriage; Cara confirms; KP sub-lord refines the exact sub-period.",
  },
];

/* ─── Class metadata ───────────────────────────────────────────────────── */

export const CLASS_META: Record<DashaClass, { label: string; color: string; bg: string; description: string }> = {
  default: {
    label: "Default",
    color: "#2F7D55",
    bg: "rgba(47,125,85,0.12)",
    description: "The universal baseline — always run first.",
  },
  alternative: {
    label: "Alternative",
    color: "#356CAB",
    bg: "rgba(53,108,171,0.12)",
    description: "Six major alternatives used for cross-validation or specialist depth.",
  },
  conditional: {
    label: "Conditional",
    color: "#887A42",
    bg: "rgba(136,122,66,0.12)",
    description: "Seven classical systems that activate only under specific chart conditions.",
  },
};
