import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type TriadKey = "saturn" | "rahu" | "ketu";

export interface TriadProfile {
  key: TriadKey;
  label: string;
  iast: string;
  devanagari: string;
  grahaSlug: GrahaSlug;
  color: string;
  tint: string;
  readableColor: string;
  cluster: string;
  concreteHook: string;
  debtFrame: string;
  items: string[];
}

export interface SortItem {
  id: string;
  label: string;
  belongsTo: TriadKey;
  reason: string;
}

export const TRIAD: Record<TriadKey, TriadProfile> = {
  saturn: {
    key: "saturn",
    label: "Saturn",
    iast: "Śani",
    devanagari: grahas.shani.devanagari,
    grahaSlug: "shani",
    color: grahas.shani.primary,
    tint: grahas.shani.secondaryTint,
    readableColor: "#3B3D58",
    cluster: "Hard work, iron, oil, longevity, servants",
    concreteHook: "Iron and oil make Saturn's remedy logic physical.",
    debtFrame: "Accumulated consequence, service, labour, and repayment.",
    items: ["hard work", "iron", "oil", "longevity", "servants"],
  },
  rahu: {
    key: "rahu",
    label: "Rahu",
    iast: "Rāhu",
    devanagari: grahas.rahu.devanagari,
    grahaSlug: "rahu",
    color: grahas.rahu.primary,
    tint: grahas.rahu.secondaryTint,
    readableColor: "#4F5364",
    cluster: "Maternal in-laws, poisons, foreign things, electricity",
    concreteHook: "Electricity is the modern, context-bound Lal Kitab entry.",
    debtFrame: "Foreign, sudden, unseen, and karmically tangled currents.",
    items: ["maternal in-laws", "poisons", "foreign things", "electricity"],
  },
  ketu: {
    key: "ketu",
    label: "Ketu",
    iast: "Ketu",
    devanagari: grahas.ketu.devanagari,
    grahaSlug: "ketu",
    color: grahas.ketu.primary,
    tint: grahas.ketu.secondaryTint,
    readableColor: "#7A3E4A",
    cluster: "Children-specific issues, dogs, ascetics, occult, signal-fires",
    concreteHook: "Dogs and signal-fires make Ketu's detached symbolism tangible.",
    debtFrame: "Headless marker, renunciation, occult residue, and remedy through care.",
    items: ["children-specific issues", "dogs", "ascetics", "occult", "signal-fires"],
  },
};

export const SORT_ITEMS: SortItem[] = [
  { id: "iron", label: "Iron", belongsTo: "saturn", reason: "Iron is Saturn's distinctive Lal Kitab material." },
  { id: "oil", label: "Oil", belongsTo: "saturn", reason: "Oil sits with Saturn and explains classic Saturn remedy hooks." },
  { id: "electricity", label: "Electricity", belongsTo: "rahu", reason: "Electricity is the modern Rahu object: unseen current, sudden power." },
  { id: "foreign-things", label: "Foreign things", belongsTo: "rahu", reason: "Foreignness belongs to Rahu's outward and alien cluster." },
  { id: "dogs", label: "Dogs", belongsTo: "ketu", reason: "Dogs are Ketu's concrete animal signification in Lal Kitab." },
  { id: "signal-fires", label: "Signal-fires", belongsTo: "ketu", reason: "Ketu raises the signal; Rahu runs the current." },
  { id: "servants", label: "Servants", belongsTo: "saturn", reason: "Servants and labour stay in Saturn's endurance field." },
  { id: "maternal-in-laws", label: "Maternal in-laws", belongsTo: "rahu", reason: "Rahu's relation is maternal in-laws, not the mother herself." },
  { id: "ascetics", label: "Ascetics", belongsTo: "ketu", reason: "Ascetics match Ketu's renunciate and detached nature." },
];

export const GUARDS = [
  { label: "Mother", belongsTo: "Moon", correction: "Do not collapse Rahu's maternal in-laws into the mother; mother remains Candra." },
  { label: "Mars good/bad toggle", belongsTo: "Mars only", correction: "The sign-keyed nek/bad split belongs to Mars, not Saturn, Rahu, or Ketu." },
  { label: "Gold and sons", belongsTo: "Jupiter", correction: "Gold and sons were Jupiter's concrete benefic additions." },
  { label: "Sweet-foods and vehicles", belongsTo: "Venus", correction: "These stay with Venus, not the shadow triad." },
];

export function getTriad(key: TriadKey) {
  return TRIAD[key];
}
