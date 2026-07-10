/**
 * Engine for Lesson 18.3.1 — Blind Planet (andhā) explorer.
 *
 * Supplies comparison data, scenario drills, and example andhā placements
 * for the blind-vs-combust recognition interactive.
 */

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const SHORT_SIGNS = [
  "Ar", "Ta", "Ge", "Cn", "Le", "Vi",
  "Li", "Sc", "Sg", "Cp", "Aq", "Pi",
];

export const PLANETS = [
  { key: "Sun", name: "Sun", abbr: "Su" },
  { key: "Moon", name: "Moon", abbr: "Mo" },
  { key: "Mars", name: "Mars", abbr: "Ma" },
  { key: "Mercury", name: "Mercury", abbr: "Me" },
  { key: "Jupiter", name: "Jupiter", abbr: "Ju" },
  { key: "Venus", name: "Venus", abbr: "Ve" },
  { key: "Saturn", name: "Saturn", abbr: "Sa" },
  { key: "Rahu", name: "Rāhu", abbr: "Ra" },
  { key: "Ketu", name: "Ketu", abbr: "Ke" },
];

export type StateVerdict = "blind" | "combust" | "active";

export interface ComparisonRow {
  aspect: string;
  blind: string;
  combust: string;
}

export const BLIND_VS_COMBUST_ROWS: ComparisonRow[] = [
  {
    aspect: "Cause",
    blind: "Placement in the Teva, per Lal Kitab condition-state tables",
    combust: "Proximity to the Sun (within combustion orb)",
  },
  {
    aspect: "Stream",
    blind: "Lal Kitab condition-state doctrine",
    combust: "Classical Parāśarī dignity / affliction",
  },
  {
    aspect: "Read from",
    blind: "Where the planet sits in the Teva chart",
    combust: "How near the planet is to the Sun in longitude",
  },
  {
    aspect: "Status",
    blind: "Reversible condition — upāya can 'open the eyes'",
    combust: "Natal affliction handled by classical remedial logic",
  },
];

export interface ScenarioItem {
  id: number;
  planet: string;
  tevaBox: number; // 1-12
  sunSign: number; // 0-11
  planetSign: number; // 0-11
  sunDegrees: number;
  planetDegrees: number;
  isAndhaPlacement: boolean; // does this placement match an andhā entry
  verdict: StateVerdict;
  explanation: string;
}

/**
 * Scenarios for the recognition drill.
 * Degrees are simplified for pedagogical clarity.
 */
export const SCENARIOS: ScenarioItem[] = [
  {
    id: 1,
    planet: "Venus",
    tevaBox: 7,
    sunSign: 6,
    planetSign: 6,
    sunDegrees: 15,
    planetDegrees: 18,
    isAndhaPlacement: false,
    verdict: "combust",
    explanation:
      "Venus sits in the same sign as the Sun (Libra) and only 3 degrees apart. This is classical combustion (astaṅgata) — a Parāśarī cause, not a Lal Kitab blind state.",
  },
  {
    id: 2,
    planet: "Jupiter",
    tevaBox: 4,
    sunSign: 0,
    planetSign: 3,
    sunDegrees: 10,
    planetDegrees: 22,
    isAndhaPlacement: true,
    verdict: "blind",
    explanation:
      "Jupiter sits far from the Sun (Aries vs Cancer, 12+ degrees apart) so combustion is ruled out. Its placement in Teva box 4 matches an andhā entry in the Lal Kitab tables — this is the blind state (andhā).",
  },
  {
    id: 3,
    planet: "Saturn",
    tevaBox: 10,
    sunSign: 8,
    planetSign: 9,
    sunDegrees: 5,
    planetDegrees: 28,
    isAndhaPlacement: false,
    verdict: "active",
    explanation:
      "Saturn is well-separated from the Sun (Sagittarius vs Capricorn, ~23 degrees) and its Teva placement does not match an andhā entry. The planet is awake and active, delivering its significations normally.",
  },
  {
    id: 4,
    planet: "Mercury",
    tevaBox: 1,
    sunSign: 0,
    planetSign: 0,
    sunDegrees: 12,
    planetDegrees: 14,
    isAndhaPlacement: false,
    verdict: "combust",
    explanation:
      "Mercury is only 2 degrees from the Sun in Aries. This is combustion — the planet is too close to the Sun to deliver its results. A Parāśarī diagnosis, not Lal Kitab blindness.",
  },
  {
    id: 5,
    planet: "Moon",
    tevaBox: 12,
    sunSign: 4,
    planetSign: 11,
    sunDegrees: 20,
    planetDegrees: 8,
    isAndhaPlacement: true,
    verdict: "blind",
    explanation:
      "The Moon is far from the Sun (Leo vs Pisces). Its Teva box 12 placement matches an andhā entry. The Moon is present and intact but cannot see to deliver — the blind state.",
  },
  {
    id: 6,
    planet: "Mars",
    tevaBox: 8,
    sunSign: 10,
    planetSign: 7,
    sunDegrees: 3,
    planetDegrees: 19,
    isAndhaPlacement: false,
    verdict: "active",
    explanation:
      "Mars in Libra is far from the Sun in Aquarius. No andhā placement matches. Mars is active and delivering its significations.",
  },
];

export interface CharacteristicCard {
  title: string;
  text: string;
  color: string;
}

export const BLIND_CHARACTERISTICS: CharacteristicCard[] = [
  {
    title: "Present, not absent",
    text: "The planet still sits in its placement; its lordships and natural character are intact. It is not destroyed.",
    color: "#356CAB",
  },
  {
    title: "Inactive in result-giving",
    text: "Although present, it does not 'give' — the matters it should produce are experienced as missing or muted.",
    color: "#A87830",
  },
  {
    title: "Obstructed, not weak",
    text: "The planet may be strong by ordinary dignity. Blindness is a separate verdict about whether it can act on that strength.",
    color: "#2F7D55",
  },
];

export const WORKED_EXAMPLE = {
  planet: "Jupiter",
  tevaBox: 4,
  sign: "Cancer",
  sunSign: "Aries",
  sunDeg: 10,
  planetDeg: 22,
  andhā: true,
  steps: [
    "Assess by ordinary measures: Jupiter is well-placed by sign (Cancer, its exaltation). Not obviously afflicted.",
    "Check for combustion: Jupiter sits far from the Sun (12+ degrees apart). Combustion is ruled out.",
    "Consult Lal Kitab condition-state: Teva box 4 matches an andhā entry in the tables.",
    "Interpret: Jupiter is present and intact, but blind — it cannot see to deliver its results.",
    "Point toward remedy: The blind state is reversible. A prescribed upāya aims to 'open the planet's eyes.'",
  ],
};
