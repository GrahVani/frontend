import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type LuminaryKey = "sun" | "moon";

export interface LuminaryProfile {
  key: LuminaryKey;
  grahaSlug: GrahaSlug;
  label: string;
  iast: string;
  devanagari: string;
  axis: string;
  classicalCore: string;
  lalKitabDistinctive: string;
  significations: string[];
  remedies: string[];
  houseTendencies: string[];
  color: string;
}

export interface ClusterGuard {
  label: string;
  belongsTo: string;
  correction: string;
}

export const LUMINARY_PROFILES: Record<LuminaryKey, LuminaryProfile> = {
  sun: {
    key: "sun",
    grahaSlug: "surya",
    label: "Sun",
    iast: "Surya",
    devanagari: grahas.surya.devanagari,
    axis: "Paternal authority",
    classicalCore: "Keeps the father and authority core from classical karakatva.",
    lalKitabDistinctive: "House tendency and upaya turn the core into a practical father-authority reading.",
    significations: ["father", "government and authority", "headship of household"],
    remedies: ["honour father and elders", "offer water to the rising Sun", "keep conduct clean with authority"],
    houseTendencies: [
      "Self-command and visibility",
      "Family authority and speech",
      "Courage in official dealings",
      "Domestic command tested",
      "Status and father-line visible",
      "Authority through service",
      "Public relationship pressure",
      "Authority debt or vulnerability",
      "Father-dharma and fortune",
      "Government and career visibility",
      "Gains through authority",
      "Expense or distance from authority",
    ],
    color: grahas.surya.primary,
  },
  moon: {
    key: "moon",
    grahaSlug: "candra",
    label: "Moon",
    iast: "Candra",
    devanagari: grahas.candra.devanagari,
    axis: "Maternal nurture and mind",
    classicalCore: "Keeps the mother and mind core from classical karakatva.",
    lalKitabDistinctive: "Adds concrete milk-water remedy logic and Teva house tendencies.",
    significations: ["mother", "mind and mental states", "milk-related products"],
    remedies: ["serve or honour mother", "use milk-family remedies correctly", "work with water or cooling conduct"],
    houseTendencies: [
      "Mind and body sensitivity",
      "Family nourishment and food",
      "Mental courage and siblings",
      "Mother-home axis strengthened",
      "Children and emotional intelligence",
      "Mental disturbance through conflict",
      "Nurture through partnership",
      "Emotional vulnerability",
      "Mother-blessing and dharma",
      "Public mind and reputation",
      "Gains through care networks",
      "Sleep, distance, and inner release",
    ],
    color: grahas.candra.primary,
  },
};

export const CLUSTER_GUARDS: ClusterGuard[] = [
  { label: "wife, comforts, luxuries", belongsTo: "Venus", correction: "Not a luminary cluster; keep it with Shukra." },
  { label: "younger brothers, courage, land", belongsTo: "Mars", correction: "This is the Mangala cluster, not Sun or Moon." },
  { label: "business, communication, sister", belongsTo: "Mercury", correction: "This belongs to Budha in the Lal Kitab list." },
  { label: "iron, oil, labour, servants", belongsTo: "Saturn", correction: "This is Shani territory, not the Moon." },
  { label: "father, government, household head", belongsTo: "Sun", correction: "Correct: paternal-authority axis." },
  { label: "mother, mind, milk", belongsTo: "Moon", correction: "Correct: maternal-nurture axis." },
];

export const HOUSE_NUMBERS = Array.from({ length: 12 }, (_, index) => index + 1);

export function getLuminary(key: LuminaryKey) {
  return LUMINARY_PROFILES[key];
}

export function otherLuminary(key: LuminaryKey): LuminaryKey {
  return key === "sun" ? "moon" : "sun";
}

