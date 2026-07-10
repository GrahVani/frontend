/**
 * Bhāva Bala Calculator — Data Engine
 *
 * §7 interactive for Lesson 13.6.1.
 *
 * Provides the 12 houses, the three bhāva-bala components, and
 * illustrative presets. Exact figures are engine-dependent.
 */

import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

/* ─── The 12 houses ──────────────────────────────────────────────────────── */

export interface Bhava {
  number: number;
  nameIAST: string;
  nameDevanagari: string;
  english: string;
  significations: string;
  lordSlug: GrahaSlug;
  direction: string;
}

export const BHAVAS: Bhava[] = [
  { number: 1, nameIAST: "Tanu", nameDevanagari: "तनु", english: "Body / Ascendant", significations: "self, body, personality", lordSlug: "mangala", direction: "East" },
  { number: 2, nameIAST: "Dhana", nameDevanagari: "धन", english: "Wealth", significations: "wealth, family, speech", lordSlug: "shukra", direction: "East-South" },
  { number: 3, nameIAST: "Sahaja", nameDevanagari: "सहज", english: "Siblings", significations: "siblings, courage, effort", lordSlug: "budha", direction: "South" },
  { number: 4, nameIAST: "Bandhu", nameDevanagari: "बन्धु", english: "Home", significations: "home, mother, vehicles", lordSlug: "candra", direction: "North" },
  { number: 5, nameIAST: "Suta", nameDevanagari: "सुत", english: "Children", significations: "children, intellect, past merit", lordSlug: "surya", direction: "North" },
  { number: 6, nameIAST: "Ripu", nameDevanagari: "रिपु", english: "Enemies", significations: "disease, enemies, service", lordSlug: "budha", direction: "South" },
  { number: 7, nameIAST: "Jāyā", nameDevanagari: "जाया", english: "Spouse", significations: "marriage, partnerships", lordSlug: "shukra", direction: "West" },
  { number: 8, nameIAST: "Mṛtyu", nameDevanagari: "मृत्यु", english: "Longevity", significations: "longevity, obstacles, occult", lordSlug: "mangala", direction: "North" },
  { number: 9, nameIAST: "Dharma", nameDevanagari: "धर्म", english: "Fortune", significations: "fortune, father, dharma", lordSlug: "guru", direction: "East" },
  { number: 10, nameIAST: "Karma", nameDevanagari: "कर्म", english: "Career", significations: "career, status, authority", lordSlug: "shani", direction: "South" },
  { number: 11, nameIAST: "Lābha", nameDevanagari: "लाभ", english: "Gains", significations: "gains, elder siblings, income", lordSlug: "shani", direction: "West" },
  { number: 12, nameIAST: "Vyaya", nameDevanagari: "व्यय", english: "Loss", significations: "loss, liberation, foreign", lordSlug: "guru", direction: "North" },
];

/* ─── The three bhāva-bala components ────────────────────────────────────── */

export interface BhavaComponent {
  key: string;
  nameIAST: string;
  nameDevanagari: string;
  english: string;
  description: string;
  parallels: string;
  example: string;
}

export const BHAVA_COMPONENTS: BhavaComponent[] = [
  {
    key: "adhipati",
    nameIAST: "Bhāvādhipati Bala",
    nameDevanagari: "भावाधिपतिबलम्",
    english: "Lord's Strength",
    description: "The strength of the house's lord — typically the lord's own ṣaḍbala total.",
    parallels: "Parallel to ṣaḍbala as a whole — the planet's six-fold strength.",
    example: "10th lord with high ṣaḍbala → strong career house.",
  },
  {
    key: "drishti",
    nameIAST: "Bhāva-dṛṣṭi Bala",
    nameDevanagari: "भावदृग्बलम्",
    english: "Aspectual Strength",
    description: "Net aspectual strength on the house — benefic aspects add, malefic aspects subtract.",
    parallels: "Mirrors Dṛk Bala — same signed-net logic applied to a house.",
    example: "4th house aspected by Jupiter → positive; by Saturn → negative.",
  },
  {
    key: "digbala",
    nameIAST: "Bhāva-digbala",
    nameDevanagari: "भावदिग्बलम्",
    english: "Directional Strength",
    description: "The house's directional strength based on its angular position.",
    parallels: "Mirrors Dik Bala — directional strength transposed to houses.",
    example: "Kendra (angular) houses gain directional strength.",
  },
];

/* ─── Ṣaḍbala parallel components (for comparison) ───────────────────────── */

export interface ShadbalaParallel {
  bhavaKey: string;
  shadbalaIAST: string;
  shadbalaEnglish: string;
}

export const PARALLELS: ShadbalaParallel[] = [
  { bhavaKey: "adhipati", shadbalaIAST: "Ṣaḍbala (total)", shadbalaEnglish: "The lord's full six-fold strength" },
  { bhavaKey: "drishti", shadbalaIAST: "Dṛk Bala", shadbalaEnglish: "Net aspectual strength on a planet" },
  { bhavaKey: "digbala", shadbalaIAST: "Dik Bala", shadbalaEnglish: "Directional strength of a planet" },
];

/* ─── Presets ────────────────────────────────────────────────────────────── */

export interface ComponentValues {
  adhipati: number;
  drishti: number;
  digbala: number;
}

export interface Preset {
  label: string;
  description: string;
  houseNumber: number;
  values: ComponentValues;
  takeaway: string;
}

export const PRESETS: Preset[] = [
  {
    label: "Strong Lord",
    description: "10th house lord has high ṣaḍbala → bhāvādhipati rises.",
    houseNumber: 10,
    values: { adhipati: 180, drishti: 30, digbala: 40 },
    takeaway: "A strong lord strengthens its house.",
  },
  {
    label: "Benefic Aspect",
    description: "4th house aspected by Jupiter → positive bhāva-dṛṣṭi.",
    houseNumber: 4,
    values: { adhipati: 100, drishti: 60, digbala: 30 },
    takeaway: "Benefic aspects add; malefic aspects subtract.",
  },
  {
    label: "The Sum",
    description: "Add three components (virūpas) ÷ 60 → house's bhāva bala in rūpas.",
    houseNumber: 1,
    values: { adhipati: 120, drishti: 45, digbala: 55 },
    takeaway: "220 virūpas ÷ 60 = 3.67 rūpas.",
  },
];
