import { ink } from "@/design-tokens/grahvani-learning/colors";

export type ChapterId = "origins" | "teva" | "states" | "grahas" | "varshphala" | "upaya";
export type DisciplineId = "multiStream" | "disclose" | "honestRemedy";
export type StreamId = "parashari" | "kp" | "jaimini" | "lalKitab" | "tajika";
export type PipelineStepId = "frame" | "build" | "state" | "meaning" | "year" | "integrate" | "boundary";

export interface ChapterArc {
  id: ChapterId;
  chapter: number;
  title: string;
  shortTitle: string;
  devanagari: string;
  establishes: string;
  practiceQuestion: string;
  color: string;
}

export interface Discipline {
  id: DisciplineId;
  label: string;
  cue: string;
  action: string;
  color: string;
}

export interface StreamLens {
  id: StreamId;
  label: string;
  role: string;
  bestUse: string;
  color: string;
}

export interface PipelineStep {
  id: PipelineStepId;
  label: string;
  chapterId: ChapterId;
  instruction: string;
  boundary: "read" | "recognise" | "defer";
}

export const CHAPTER_ARC: ChapterArc[] = [
  {
    id: "origins",
    chapter: 1,
    title: "Origins and farmans",
    shortTitle: "Origins",
    devanagari: "परम्परा",
    establishes: "Joshi, the five farmans, Punjabi-Urdu lineage, and folk-empirical status.",
    practiceQuestion: "Which tradition is being used, and how should it be disclosed?",
    color: "#8F6C1F",
  },
  {
    id: "teva",
    chapter: 2,
    title: "Fixed-Aries Teva",
    shortTitle: "Teva",
    devanagari: "टेवा",
    establishes: "Aries stays in house 1; houses become fixed life-domain registers.",
    practiceQuestion: "What does the chart look like when read through fixed houses?",
    color: "#2F7D52",
  },
  {
    id: "states",
    chapter: 3,
    title: "Planetary states",
    shortTitle: "States",
    devanagari: "अवस्था",
    establishes: "Blind, sleeping, burning, and awake conditions on the Teva.",
    practiceQuestion: "Which planet is active, blocked, dormant, or distressed?",
    color: "#B0442E",
  },
  {
    id: "grahas",
    chapter: 4,
    title: "Redefined grahas",
    shortTitle: "Grahas",
    devanagari: "ग्रह",
    establishes: "Lal Kitab planetary meanings, including split Mars and situational Mercury.",
    practiceQuestion: "What does this planet mean in Lal Kitab language?",
    color: "#356C96",
  },
  {
    id: "varshphala",
    chapter: 5,
    title: "Lal Kitab Varshphala",
    shortTitle: "Year",
    devanagari: "वर्षफल",
    establishes: "Annual timing in Lal Kitab style, distinct from Tajika Varshaphala.",
    practiceQuestion: "Is the natal pattern live in this year?",
    color: "#7A3E4A",
  },
  {
    id: "upaya",
    chapter: 6,
    title: "Upaya and synthesis",
    shortTitle: "Upaya",
    devanagari: "उपाय",
    establishes: "Remedy-family recognition, empirical disclosure, and cross-stream integration.",
    practiceQuestion: "Which remedy family is recognised, and where must Tier 1 stop?",
    color: ink.goldAccent,
  },
];

export const DISCIPLINES: Discipline[] = [
  {
    id: "multiStream",
    label: "Multi-streams-valid",
    cue: "No one lens owns every question.",
    action: "Use Lal Kitab beside Parashari, KP, Jaimini, and Tajika instead of replacing them.",
    color: "#356C96",
  },
  {
    id: "disclose",
    label: "Disclose the tradition",
    cue: "Name the Teva and the Lal Kitab source.",
    action: "Tell the client when the judgement comes from Joshi's folk-empirical stream.",
    color: "#2F7D52",
  },
  {
    id: "honestRemedy",
    label: "Honest-remedy",
    cue: "Recognise without overclaiming.",
    action: "At Tier 1, identify remedy families and defer full prescription to advanced training.",
    color: "#B0442E",
  },
];

export const STREAMS: StreamLens[] = [
  {
    id: "parashari",
    label: "Parashari",
    role: "Foundation",
    bestUse: "Deep diagnosis by graha, rashi, house, lordship, and strength.",
    color: "#8F6C1F",
  },
  {
    id: "kp",
    label: "KP",
    role: "Precision",
    bestUse: "Sharp event judgement through sub-lord refinement.",
    color: "#356C96",
  },
  {
    id: "jaimini",
    label: "Jaimini",
    role: "Karaka-darshana",
    bestUse: "Soul, sign, and degree-ranked significator perspectives.",
    color: "#6B5C8A",
  },
  {
    id: "lalKitab",
    label: "Lal Kitab",
    role: "Folk remedy",
    bestUse: "House-centric Teva diagnosis leading to simple, disclosed upaya recognition.",
    color: "#2F7D52",
  },
  {
    id: "tajika",
    label: "Tajika",
    role: "Annual and prashna",
    bestUse: "Year charts and question charts developed in the next module.",
    color: ink.goldAccent,
  },
];

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "frame",
    label: "Frame",
    chapterId: "origins",
    instruction: "State that this is a Lal Kitab layer: documented, practical, and folk-empirical.",
    boundary: "read",
  },
  {
    id: "build",
    label: "Build Teva",
    chapterId: "teva",
    instruction: "Place Aries in house 1 and read fixed houses as life-domain registers.",
    boundary: "read",
  },
  {
    id: "state",
    label: "Find state",
    chapterId: "states",
    instruction: "Mark whether the relevant planet is blind, sleeping, burning, or awake.",
    boundary: "read",
  },
  {
    id: "meaning",
    label: "Translate graha",
    chapterId: "grahas",
    instruction: "Use Lal Kitab signification, not imported Parashari habit.",
    boundary: "read",
  },
  {
    id: "year",
    label: "Check year",
    chapterId: "varshphala",
    instruction: "Use Lal Kitab Varshphala to see whether the pattern is live now.",
    boundary: "read",
  },
  {
    id: "integrate",
    label: "Cross-check",
    chapterId: "upaya",
    instruction: "Compare with diagnosis-deep streams before deciding that Lal Kitab is useful here.",
    boundary: "recognise",
  },
  {
    id: "boundary",
    label: "Stop line",
    chapterId: "upaya",
    instruction: "Recognise the upaya family, disclose limits, and defer exact prescription.",
    boundary: "defer",
  },
];

export function getChapter(id: ChapterId) {
  return CHAPTER_ARC.find((chapter) => chapter.id === id) ?? CHAPTER_ARC[0];
}
