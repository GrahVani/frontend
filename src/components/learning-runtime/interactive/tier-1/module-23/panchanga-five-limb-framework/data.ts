export type LimbKey = "tithi" | "vara" | "nakshatra" | "yoga" | "karana";
export type CandidateKey = "candidateA" | "candidateB" | "candidateC";
export type LimbQuality = "strong" | "usable" | "weak";

export interface Option<T extends string> {
  key: T;
  label: string;
  note: string;
}

export interface Limb extends Option<LimbKey> {
  devanagari: string;
  count: string;
  derivation: string;
  role: string;
  formulaCue: string;
}

export interface Candidate extends Option<CandidateKey> {
  limbs: Record<LimbKey, LimbQuality>;
  summary: string;
}

export const LIMBS: Limb[] = [
  {
    key: "tithi",
    label: "Tithi",
    devanagari: "तिथि",
    note: "Lunar day, 1-30 across the synodic month.",
    count: "30",
    derivation: "Moon minus Sun longitude.",
    role: "Shows lunar phase-quality for the action.",
    formulaCue: "12 degrees of Moon-Sun separation per tithi.",
  },
  {
    key: "vara",
    label: "Vāra",
    devanagari: "वार",
    note: "Weekday ruled by the seven visible grahas.",
    count: "7",
    derivation: "Calendar weekday.",
    role: "Adds planetary day-lord tone.",
    formulaCue: "Calendar-fixed; not derived from Sun-Moon angle.",
  },
  {
    key: "nakshatra",
    label: "Nakṣatra",
    devanagari: "नक्षत्र",
    note: "Moon's sidereal mansion.",
    count: "27",
    derivation: "Moon's absolute sidereal longitude.",
    role: "Carries the Moon's event-field quality.",
    formulaCue: "13 degrees 20 minutes per lunar mansion.",
  },
  {
    key: "yoga",
    label: "Yoga",
    devanagari: "योग",
    note: "Sun-Moon angular sum.",
    count: "27",
    derivation: "Sun plus Moon longitude.",
    role: "Gives combined solar-lunar condition.",
    formulaCue: "13 degrees 20 minutes per yoga from longitude sum.",
  },
  {
    key: "karana",
    label: "Karaṇa",
    devanagari: "करण",
    note: "Half-tithi unit; 7 movable and 4 fixed types.",
    count: "11",
    derivation: "Tithi divided into two halves.",
    role: "Refines the immediate action texture.",
    formulaCue: "6 degrees of Moon-Sun separation per karaṇa.",
  },
];

export const CANDIDATES: Candidate[] = [
  {
    key: "candidateA",
    label: "Candidate A",
    note: "Excellent tithi, mixed nakṣatra.",
    summary: "Strong start but not flawless; good if tithi is weighted heavily.",
    limbs: {
      tithi: "strong",
      vara: "usable",
      nakshatra: "weak",
      yoga: "usable",
      karana: "strong",
    },
  },
  {
    key: "candidateB",
    label: "Candidate B",
    note: "Balanced but no standout limb.",
    summary: "Best compromise when the client needs a steady, explainable choice.",
    limbs: {
      tithi: "usable",
      vara: "usable",
      nakshatra: "usable",
      yoga: "usable",
      karana: "usable",
    },
  },
  {
    key: "candidateC",
    label: "Candidate C",
    note: "Strong nakṣatra, weak yoga.",
    summary: "Attractive lunar mansion, but trade-off must be named clearly.",
    limbs: {
      tithi: "usable",
      vara: "strong",
      nakshatra: "strong",
      yoga: "weak",
      karana: "usable",
    },
  },
];

export function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

export function findLimb(key: LimbKey): Limb {
  return LIMBS.find((item) => item.key === key) ?? LIMBS[0];
}

export function qualityScore(quality: LimbQuality) {
  if (quality === "strong") return 2;
  if (quality === "usable") return 1;
  return 0;
}

export function qualityLabel(quality: LimbQuality) {
  if (quality === "strong") return "Strong";
  if (quality === "usable") return "Usable";
  return "Weak";
}

export function candidateScore(candidate: Candidate) {
  return Object.values(candidate.limbs).reduce((sum, quality) => sum + qualityScore(quality), 0);
}

export function bestCandidate() {
  return [...CANDIDATES].sort((a, b) => candidateScore(b) - candidateScore(a))[0];
}
