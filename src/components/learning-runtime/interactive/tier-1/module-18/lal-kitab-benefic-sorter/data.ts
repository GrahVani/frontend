import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type BeneficKey = "jupiter" | "venus";

export interface BeneficProfile {
  key: BeneficKey;
  label: string;
  iast: string;
  devanagari: string;
  grahaSlug: GrahaSlug;
  color: string;
  tint: string;
  readableColor: string;
  core: string;
  lalKitabAddition: string;
  remedyFrame: string;
  items: string[];
}

export interface SortItem {
  id: string;
  label: string;
  belongsTo: BeneficKey;
  reason: string;
}

export const BENEFICS: Record<BeneficKey, BeneficProfile> = {
  jupiter: {
    key: "jupiter",
    label: "Jupiter",
    iast: "Bṛhaspati",
    devanagari: grahas.guru.devanagari,
    grahaSlug: "guru",
    color: grahas.guru.primary,
    tint: grahas.guru.secondaryTint,
    readableColor: "#9C6418",
    core: "Wisdom, dharma, guru-principle, sons",
    lalKitabAddition: "Paternal uncle and gold become concrete remedy hooks.",
    remedyFrame: "Honour teachers and elders; protect the paternal-uncle line; handle gold/saffron cues carefully.",
    items: ["wisdom", "dharma", "paternal uncle", "gold", "sons"],
  },
  venus: {
    key: "venus",
    label: "Venus",
    iast: "Śukra",
    devanagari: grahas.shukra.devanagari,
    grahaSlug: "shukra",
    color: grahas.shukra.primary,
    tint: grahas.shukra.secondaryTint,
    readableColor: "#356C96",
    core: "Wife, comforts, refinement, pleasure",
    lalKitabAddition: "Sweet-foods and vehicles become concrete household remedy hooks.",
    remedyFrame: "Care for spouse and household comforts; read sweets, fragrance, and vehicle matters through Venus.",
    items: ["wife", "comforts", "luxury", "sweet-foods", "vehicles"],
  },
};

export const SORT_ITEMS: SortItem[] = [
  { id: "gold", label: "Gold", belongsTo: "jupiter", reason: "Gold is Jupiter's concrete noble-metal hook in this Lal Kitab pairing." },
  { id: "vehicles", label: "Vehicles", belongsTo: "venus", reason: "Vehicles sit with Venus as a concrete comfort and luxury object." },
  { id: "paternal-uncle", label: "Paternal uncle", belongsTo: "jupiter", reason: "The father's brother is the distinctive family relation attached to Jupiter." },
  { id: "sweet-foods", label: "Sweet-foods", belongsTo: "venus", reason: "Sweet-foods belong to Venus as tangible pleasure and household comfort." },
  { id: "sons", label: "Sons", belongsTo: "jupiter", reason: "Sons remain in Jupiter's progeny portfolio." },
  { id: "wife", label: "Wife", belongsTo: "venus", reason: "The wife stays with Venus; Lal Kitab does not reverse the benefics." },
];

export const DISTRACTOR_GUARDS = [
  { label: "Mother, mind, milk", belongsTo: "Moon", correction: "Do not import Candra's maternal cluster into Jupiter or Venus." },
  { label: "Father and government", belongsTo: "Sun", correction: "This stays with Surya; Jupiter's relation here is the paternal uncle." },
  { label: "Sister and in-laws", belongsTo: "Mercury", correction: "This was Budha's family net in the previous lesson." },
  { label: "Brothers, courage, land", belongsTo: "Mars", correction: "This is the Maṅgala cluster, not Jupiter's gold or Venus's vehicle field." },
];

export function getBenefic(key: BeneficKey) {
  return BENEFICS[key];
}
