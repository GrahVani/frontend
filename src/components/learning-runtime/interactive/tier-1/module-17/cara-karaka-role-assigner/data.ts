import { type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import { CARA_ROLES, SAMPLE_CARA_PLANETS, rankCaraPlanets, type CaraPlanet } from "../cara-karaka-ranker/data";

export type RoleAssignerPlanet = CaraPlanet & {
  house: number;
  owns: string;
  reading: string;
};

export type NaturalComparison = {
  roleShort: string;
  naturalPlanet: string;
  reminder: string;
};

export const ROLE_ASSIGNER_PLANETS: RoleAssignerPlanet[] = SAMPLE_CARA_PLANETS.filter((planet) => planet.includeInSeven).map((planet) => {
  const extras: Record<GrahaSlug, Pick<RoleAssignerPlanet, "house" | "owns" | "reading">> = {
    surya: {
      house: 5,
      owns: "Leo / 5th emphasis",
      reading: "Authority, visibility, and judgement colour whichever cara role Surya receives.",
    },
    candra: {
      house: 2,
      owns: "Cancer / 4th emphasis",
      reading: "Memory, care, food, and emotional continuity become the voice of the assigned role.",
    },
    mangala: {
      house: 11,
      owns: "Aries and Scorpio",
      reading: "Effort, courage, and friction make this role active and sometimes confrontational.",
    },
    budha: {
      house: 5,
      owns: "Gemini and Virgo",
      reading: "Analysis, speech, trade, and learning become the role's working style.",
    },
    guru: {
      house: 9,
      owns: "Sagittarius and Pisces",
      reading: "Counsel, dharma, children, and wisdom give the role a protective tone.",
    },
    shukra: {
      house: 7,
      owns: "Taurus and Libra",
      reading: "Agreement, pleasure, relationship, and refinement soften the role's expression.",
    },
    shani: {
      house: 10,
      owns: "Capricorn and Aquarius",
      reading: "Delay, labour, endurance, and duty make the role concrete over time.",
    },
    rahu: {
      house: 6,
      owns: "node, no classical sign ownership",
      reading: "Rahu is not used in this seven-role lesson.",
    },
    ketu: {
      house: 12,
      owns: "node, no classical sign ownership",
      reading: "Ketu is not used in this seven-role lesson.",
    },
  };

  return {
    ...planet,
    ...extras[planet.slug],
  };
});

export const ROLE_COMPARISONS: NaturalComparison[] = [
  {
    roleShort: "AK",
    naturalPlanet: "Sun",
    reminder: "Self is role-based here; the Sun remains a natural self/authority indicator.",
  },
  {
    roleShort: "MK",
    naturalPlanet: "Moon",
    reminder: "Mother is read through the Matṛkāraka planet and also through the Moon.",
  },
  {
    roleShort: "PK",
    naturalPlanet: "Jupiter",
    reminder: "Children are read through the Putrakāraka planet and the fixed Jupiter testimony.",
  },
  {
    roleShort: "DK",
    naturalPlanet: "Venus",
    reminder: "Spouse is read through the Dārakāraka planet and Venus alongside it.",
  },
];

export const ROLE_SEQUENCE = CARA_ROLES.slice(0, 7);

export function rankRoleAssignerPlanets(planets: RoleAssignerPlanet[]) {
  return rankCaraPlanets(planets, "seven").map((item) => ({
    ...item,
    planet: item.planet as RoleAssignerPlanet,
  }));
}
