import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type PmpySlug = "ruchaka" | "bhadra" | "hamsa" | "malavya" | "shasha";
export type ReckoningSource = "lagna" | "moon";

export interface PmpyArchetype {
  slug: PmpySlug;
  yoga: string;
  iast: string;
  devanagari: string;
  planet: GrahaSlug;
  planetLabel: string;
  ownSigns: string[];
  exaltation: string;
  archetype: string;
  temperament: string;
  bodyCue: string;
  aptitudes: string[];
  reading: string;
  color: string;
}

export interface PmpyCheck {
  planet: string;
  eligible: boolean;
  reason: string;
}

export const PMPY_ARCHETYPES: PmpyArchetype[] = [
  {
    slug: "ruchaka",
    yoga: "Ruchaka",
    iast: "Rucaka Yoga",
    devanagari: "रुचक",
    planet: "mangala",
    planetLabel: "Mars",
    ownSigns: ["Aries", "Scorpio"],
    exaltation: "Capricorn",
    archetype: "Warrior",
    temperament: "Courage, command, decisiveness, physical force.",
    bodyCue: "Robust, athletic, action-ready.",
    aptitudes: ["Military", "Surgery", "Engineering", "Athletics", "Command"],
    reading: "Mars becomes a disciplined action archetype: brave, competitive, technical, and able to command under pressure.",
    color: grahas.mangala.primary,
  },
  {
    slug: "bhadra",
    yoga: "Bhadra",
    iast: "Bhadra Yoga",
    devanagari: "भद्र",
    planet: "budha",
    planetLabel: "Mercury",
    ownSigns: ["Gemini", "Virgo"],
    exaltation: "Virgo",
    archetype: "Scholar",
    temperament: "Intellect, analysis, adaptability, speech.",
    bodyCue: "Alert, refined, quick in gesture and mind.",
    aptitudes: ["Writing", "Commerce", "Analytics", "Communication", "Strategy"],
    reading: "Mercury becomes a lucid intelligence archetype: articulate, commercial, mathematically alert, and skilled with systems.",
    color: grahas.budha.primary,
  },
  {
    slug: "hamsa",
    yoga: "Hamsa",
    iast: "Haṁsa Yoga",
    devanagari: "हंस",
    planet: "guru",
    planetLabel: "Jupiter",
    ownSigns: ["Sagittarius", "Pisces"],
    exaltation: "Cancer",
    archetype: "Sage",
    temperament: "Wisdom, counsel, dharma, benevolence.",
    bodyCue: "Composed, noble, teacherly presence.",
    aptitudes: ["Teaching", "Counsel", "Spirituality", "Law", "Dharmic leadership"],
    reading: "Jupiter becomes a guide archetype: protective, principled, generous, and able to transmit wisdom.",
    color: grahas.guru.primary,
  },
  {
    slug: "malavya",
    yoga: "Malavya",
    iast: "Mālavya Yoga",
    devanagari: "मालव्य",
    planet: "shukra",
    planetLabel: "Venus",
    ownSigns: ["Taurus", "Libra"],
    exaltation: "Pisces",
    archetype: "Aesthete",
    temperament: "Beauty, diplomacy, refinement, pleasure, harmony.",
    bodyCue: "Graceful, attractive, polished.",
    aptitudes: ["Art", "Design", "Diplomacy", "Luxury", "Relationship counsel"],
    reading: "Venus becomes a culture-and-refinement archetype: artistic, attractive, socially graceful, and pleasure-aware.",
    color: grahas.shukra.primary,
  },
  {
    slug: "shasha",
    yoga: "Shasha",
    iast: "Śaśa Yoga",
    devanagari: "शश",
    planet: "shani",
    planetLabel: "Saturn",
    ownSigns: ["Capricorn", "Aquarius"],
    exaltation: "Libra",
    archetype: "Disciplinarian",
    temperament: "Endurance, realism, organisation, service, restraint.",
    bodyCue: "Lean, serious, durable.",
    aptitudes: ["Administration", "Labour systems", "Governance", "Logistics", "Long projects"],
    reading: "Saturn becomes an authority-through-endurance archetype: patient, organised, dutiful, and able to govern difficult systems.",
    color: grahas.shani.primary,
  },
];

export const EXCLUSION_CHECKS: PmpyCheck[] = [
  { planet: "Sun", eligible: false, reason: "Luminary: even exalted in a kendra, it is not a Pancha Mahapurusha planet." },
  { planet: "Moon", eligible: false, reason: "Luminary: important, but excluded from the five tara-graha PMPY set." },
  { planet: "Rahu/Ketu", eligible: false, reason: "Nodes are excluded from the five classical PMPY planets." },
  { planet: "Mars/Mercury/Jupiter/Venus/Saturn", eligible: true, reason: "These five tara-grahas can form the yogas when own/exalted in a kendra." },
];

export const KENDRA_HOUSES = [1, 4, 7, 10];

export function getPmpy(slug: PmpySlug) {
  return PMPY_ARCHETYPES.find((item) => item.slug === slug) ?? PMPY_ARCHETYPES[0];
}
