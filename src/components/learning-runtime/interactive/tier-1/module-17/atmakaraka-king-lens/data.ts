import { type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type AkScenarioSlug = "saturn-hardship" | "moon-devotion" | "sun-natural-trap";

export interface AkPlanet {
  slug: GrahaSlug;
  label: string;
  iast: string;
  sign: string;
  house: number;
  dignity: string;
  degree: number;
  condition: string;
  soulCue: string;
}

export interface AkScenario {
  slug: AkScenarioSlug;
  label: string;
  headline: string;
  teaching: string;
  karakamsa: string;
  planets: AkPlanet[];
}

export const AK_SCENARIOS: AkScenario[] = [
  {
    slug: "saturn-hardship",
    label: "Debilitated Saturn wins",
    headline: "Degree selects the king, not dignity.",
    teaching: "Saturn is under hardship, but 28°51' makes it the Atmakaraka. Jupiter may be exalted, yet it does not become AK at 5°10'.",
    karakamsa: "Saturn's Navamsha sign would anchor the later Karakamsa reading.",
    planets: [
      { slug: "shani", label: "Saturn", iast: "Shani", sign: "Aries", house: 10, dignity: "Debilitated", degree: 28.85, condition: "king under hardship", soulCue: "discipline, endurance, karmic labour" },
      { slug: "candra", label: "Moon", iast: "Candra", sign: "Pisces", house: 9, dignity: "Friendly", degree: 27.67, condition: "minister close to the throne", soulCue: "faith, memory, devotion" },
      { slug: "mangala", label: "Mars", iast: "Mangala", sign: "Scorpio", house: 6, dignity: "Own sign", degree: 24.03, condition: "strong minister", soulCue: "courage, contest, repair" },
      { slug: "surya", label: "Sun", iast: "Surya", sign: "Leo", house: 5, dignity: "Own sign", degree: 19.55, condition: "natural soul karaka, not cara AK", soulCue: "authority, visibility, confidence" },
      { slug: "budha", label: "Mercury", iast: "Budha", sign: "Virgo", house: 6, dignity: "Exalted", degree: 14.3, condition: "sharp minister", soulCue: "analysis, service, precision" },
      { slug: "shukra", label: "Venus", iast: "Shukra", sign: "Libra", house: 7, dignity: "Own sign", degree: 9.78, condition: "relationship minister", soulCue: "agreement, refinement, desire" },
      { slug: "guru", label: "Jupiter", iast: "Guru", sign: "Cancer", house: 4, dignity: "Exalted", degree: 5.17, condition: "exalted, but lowest degree", soulCue: "wisdom, protection, children" },
    ],
  },
  {
    slug: "moon-devotion",
    label: "Moon in Pisces",
    headline: "After selection, read sign, house, and dignity.",
    teaching: "Moon becomes AK by degree, then Pisces, the 9th house, and its dignity describe the soul agenda's flavour, arena, and ease.",
    karakamsa: "The Moon's D-9 sign becomes the Karakamsa reference point later.",
    planets: [
      { slug: "candra", label: "Moon", iast: "Candra", sign: "Pisces", house: 9, dignity: "Exalted teaching example", degree: 27.67, condition: "devotional king", soulCue: "dharma, surrender, compassion" },
      { slug: "guru", label: "Jupiter", iast: "Guru", sign: "Sagittarius", house: 6, dignity: "Own sign", degree: 25.25, condition: "wise minister", soulCue: "learning, protection, ethics" },
      { slug: "mangala", label: "Mars", iast: "Mangala", sign: "Leo", house: 3, dignity: "Friendly", degree: 23.4, condition: "effort minister", soulCue: "initiative and courage" },
      { slug: "budha", label: "Mercury", iast: "Budha", sign: "Gemini", house: 12, dignity: "Own sign", degree: 18.8, condition: "subtle minister", soulCue: "study, language, retreat" },
      { slug: "surya", label: "Sun", iast: "Surya", sign: "Aquarius", house: 8, dignity: "Enemy sign", degree: 13.2, condition: "natural soul karaka, not cara AK", soulCue: "identity through transformation" },
      { slug: "shani", label: "Saturn", iast: "Shani", sign: "Capricorn", house: 7, dignity: "Own sign", degree: 10.65, condition: "enduring minister", soulCue: "duty and contract" },
      { slug: "shukra", label: "Venus", iast: "Shukra", sign: "Taurus", house: 11, dignity: "Own sign", degree: 3.85, condition: "lowest minister", soulCue: "pleasure, network, support" },
    ],
  },
  {
    slug: "sun-natural-trap",
    label: "Sun is not automatic",
    headline: "Cara Atmakaraka is not the fixed Sun.",
    teaching: "The Sun remains the naisargika soul indicator, but the cara AK belongs to the highest-degree planet in this chart.",
    karakamsa: "The highest-degree planet's Navamsha sign, not the Sun's by default, becomes the Karakamsa anchor.",
    planets: [
      { slug: "budha", label: "Mercury", iast: "Budha", sign: "Virgo", house: 1, dignity: "Exalted", degree: 29.1, condition: "analytical king", soulCue: "discernment, learning, craft" },
      { slug: "shani", label: "Saturn", iast: "Shani", sign: "Aquarius", house: 6, dignity: "Own sign", degree: 24.45, condition: "duty minister", soulCue: "service, structure, endurance" },
      { slug: "surya", label: "Sun", iast: "Surya", sign: "Leo", house: 12, dignity: "Own sign", degree: 18.75, condition: "natural soul karaka", soulCue: "authority, vitality, father" },
      { slug: "guru", label: "Jupiter", iast: "Guru", sign: "Pisces", house: 7, dignity: "Own sign", degree: 17.2, condition: "counsel minister", soulCue: "wisdom and guidance" },
      { slug: "candra", label: "Moon", iast: "Candra", sign: "Taurus", house: 9, dignity: "Exalted", degree: 16.3, condition: "gentle minister", soulCue: "devotion and memory" },
      { slug: "mangala", label: "Mars", iast: "Mangala", sign: "Cancer", house: 11, dignity: "Debilitated", degree: 8.1, condition: "challenged minister", soulCue: "heated effort" },
      { slug: "shukra", label: "Venus", iast: "Shukra", sign: "Scorpio", house: 3, dignity: "Neutral", degree: 2.25, condition: "lowest minister", soulCue: "desire and negotiation" },
    ],
  },
];

export function formatAkDegree(value: number) {
  const degrees = Math.floor(value);
  const minutes = Math.round((value - degrees) * 60);
  return `${degrees}°${String(minutes).padStart(2, "0")}'`;
}

export function rankAkPlanets(planets: AkPlanet[]) {
  return [...planets].sort((a, b) => b.degree - a.degree);
}

export function getAkScenario(slug: AkScenarioSlug) {
  return AK_SCENARIOS.find((scenario) => scenario.slug === slug) ?? AK_SCENARIOS[0];
}
