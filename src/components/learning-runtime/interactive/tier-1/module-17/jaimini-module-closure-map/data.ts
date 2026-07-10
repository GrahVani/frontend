/**
 * Jaimini Module Closure Map engine -- Lesson 17.7.5
 *
 * Seven-chapter arc visualiser, pipeline tracer, Tier-1-vs-Tier-2 map,
 * and discipline checklist for the Module 17 capstone.
 */

export interface ChapterArc {
  num: number;
  title: string;
  slug: string;
  tool: string;
  lessons: string;
  establishes: string;
  consumes: string[];
  produces: string[];
  color: string;
}

export const CHAPTER_ARC: ChapterArc[] = [
  {
    num: 1,
    title: "Lineage & Sūtra-Style",
    slug: "jaimini-the-author-and-the-tradition",
    tool: "Textual foundation",
    lessons: "17.1.1–17.1.3",
    establishes: "Maharṣi Jaimini and the terse Upadeśa-sūtra; the interpreter-dependent nature of the tradition.",
    consumes: [],
    produces: ["Jaimini lineage", "Sūtra-style awareness", "Disclose-your-interpreter discipline"],
    color: "#9C7A2F",
  },
  {
    num: 2,
    title: "Cara-Kārakas",
    slug: "the-eight-cara-karakas",
    tool: "Variable significators",
    lessons: "17.2.1–17.2.5",
    establishes: "Seven grahas ranked by within-sign longitude; the Ātmakāraka as soul-significator.",
    consumes: ["Jaimini lineage"],
    produces: ["Seven cara-kāraka roles", "Ātmakāraka (AK)", "Cara-vs-naisargika cross-validation"],
    color: "#3B82F6",
  },
  {
    num: 3,
    title: "Argala",
    slug: "the-argala-concept",
    tool: "Sign-based intervention",
    lessons: "17.3.1–17.3.4",
    establishes: "Houses that help (argala) and block (virodhārgala) a target house.",
    consumes: ["Cara-kāraka roles"],
    produces: ["Intervention map", "Support / obstruction reading"],
    color: "#2F7D55",
  },
  {
    num: 4,
    title: "Arūḍha Padas",
    slug: "the-arudha-pada-doctrine",
    tool: "Image / perception layer",
    lessons: "17.4.1–17.4.5",
    establishes: "Ārūḍha Lagna (AL) and Upapada (UL) — how matters appear vs their source.",
    consumes: ["Cara-kāraka roles", "Argala logic"],
    produces: ["AL (perceived self)", "UL (spouse image)", "Reality-vs-perception gap"],
    color: "#D97706",
  },
  {
    num: 5,
    title: "Rāśi-Dṛṣṭi",
    slug: "rashi-drishti-rule-recap",
    tool: "Sign-to-sign aspects",
    lessons: "17.5.1–17.5.3",
    establishes: "Movable/fixed/dual sign-aspect rule; the relational web between signs.",
    consumes: ["Cara-kāraka roles"],
    produces: ["Aspecting sign list", "Benefic/malefic qualification"],
    color: "#8B5CF6",
  },
  {
    num: 6,
    title: "Cara-Daśā",
    slug: "cara-dasha-mechanism",
    tool: "Sign-based timing",
    lessons: "17.6.1–17.6.5",
    establishes: "Rāśi-advancing daśā with odd/even durations; no Moon nakṣatra required.",
    consumes: ["Cara-kāraka roles", "Kārakāṁśa frame", "Argala / rāśi-dṛṣṭi / padas"],
    produces: ["Activation windows", "Cara-daśā periods", "Vimśottarī cross-check"],
    color: "#A23A1E",
  },
  {
    num: 7,
    title: "Kārakāṁśa & Iṣṭa-Devatā",
    slug: "atmakaraka-karakamsha-synthesis",
    tool: "Soul synthesis",
    lessons: "17.7.1–17.7.5",
    establishes: "AK's navāṁśa sign as KL; soul-purpose read; 12th-from-KL gives iṣṭa-devatā.",
    consumes: ["Cara-kāraka roles (AK)", "Rāśi-dṛṣṭi", "Argala", "Padas"],
    produces: ["Kārakāṁśa Lagna", "Iṣṭa-devatā", "Integrated workflow", "Soul-agenda reading"],
    color: "#9C7A2F",
  },
];

export interface PipelineQuestion {
  label: string;
  steps: { chapter: number; action: string }[];
}

export const PIPELINE_QUESTIONS: PipelineQuestion[] = [
  {
    label: "What is my soul's deeper purpose?",
    steps: [
      { chapter: 2, action: "Identify the Ātmakāraka (highest-degree planet)" },
      { chapter: 7, action: "Set the Kārakāṁśa (AK's D9 sign as lagna)" },
      { chapter: 5, action: "Apply rāśi-dṛṣṭi to the Kārakāṁśa" },
      { chapter: 3, action: "Check argala on the KL and its key houses" },
      { chapter: 7, action: "Read soul-purpose from occupants + aspects" },
      { chapter: 7, action: "Read iṣṭa-devatā from 12th-from-KL" },
    ],
  },
  {
    label: "When will my career advance?",
    steps: [
      { chapter: 2, action: "Compute cara-kārakas; note the Amātyakāraka" },
      { chapter: 7, action: "Set the Kārakāṁśa as reference frame" },
      { chapter: 5, action: "Rāśi-dṛṣṭi onto 10th-from-KL and AmK sign" },
      { chapter: 3, action: "Argala on the career house" },
      { chapter: 4, action: "Read AL for professional image" },
      { chapter: 6, action: "Cara-daśā period activating AmK / 10th" },
    ],
  },
  {
    label: "When will I marry?",
    steps: [
      { chapter: 2, action: "Compute cara-kārakas; note the Dārakāraka" },
      { chapter: 7, action: "Set the Kārakāṁśa" },
      { chapter: 5, action: "Rāśi-dṛṣṭi onto Upapada (UL) and 7th-from-KL" },
      { chapter: 3, action: "Argala on the UL" },
      { chapter: 4, action: "Read AL + UL together" },
      { chapter: 6, action: "Cara-daśā period activating UL and DK" },
    ],
  },
  {
    label: "What is my spiritual direction?",
    steps: [
      { chapter: 2, action: "Identify the Ātmakāraka" },
      { chapter: 7, action: "Set Kārakāṁśa; read 9th and 12th from KL" },
      { chapter: 5, action: "Rāśi-dṛṣṭi onto 9th/12th-from-KL" },
      { chapter: 3, action: "Argala on the 12th (mokṣa) house" },
      { chapter: 7, action: "Read iṣṭa-devatā from 12th-from-KL" },
      { chapter: 6, action: "Cara-daśā activating KL or 9th/12th" },
    ],
  },
];

export const TIER_COMPARISON = [
  {
    area: "Foundation",
    tier1: "Lineage, seven cara-kārakas, Ātmakāraka, argala, arūḍha padas, rāśi-dṛṣṭi",
    tier2: "Same machinery applied at speed and depth across many charts",
  },
  {
    area: "Timing",
    tier1: "Introductory cara-daśā — mechanism, odd/even durations, 12-rāśi sequence",
    tier2: "Advanced daśās — sthira, śūla, brahma, niryāṇa, antar-daśā judgement",
  },
  {
    area: "Soul layer",
    tier1: "Kārakāṁśa lagna, soul-purpose, iṣṭa-devatā from 12th",
    tier2: "Full graha-from-kārakāṁśa significations, combinations across vargas",
  },
  {
    area: "Yogas",
    tier1: "Recognition that Jaimini has its own yoga logic",
    tier2: "Jaimini rāja-yogas and conditional combinations for power, wealth, longevity",
  },
];

export const DISCIPLINES = [
  {
    key: "both-layers",
    title: "Both-layers cross-validation",
    text: "Jaimini conclusions are trustworthy when sign-layer and planet-layer agree. Cross-check cara-kārakas against naisargika significators, and cara-daśā against Vimśottarī.",
    lessons: "17.2.5, 17.6.5",
  },
  {
    key: "multi-streams",
    title: "Multi-streams-valid",
    text: "Jaimini does not retire Parāśara, and Parāśara does not invalidate Jaimini. They are parallel lenses on one chart. Use one per judgement, or read both side-by-side.",
    lessons: "19.6.1",
  },
  {
    key: "disclose",
    title: "Disclose-your-interpreter",
    text: "The Jaiminisūtra is terse; Raman, Rath, and Rao reconstruct rules differently. Name which interpreter's scheme you follow so the reading can be checked.",
    lessons: "17.1.2",
  },
];
