/**
 * Engine for Lesson 18.3.3 — Burning Planet (jalit) explorer.
 *
 * Supplies comparison data, cause cards, and recognition scenarios
 * for the scorched-state interactive.
 */

export const SHORT_SIGNS = [
  "Ar", "Ta", "Ge", "Cn", "Le", "Vi",
  "Li", "Sc", "Sg", "Cp", "Aq", "Pi",
];

export type PlanetState = "blind" | "sleeping" | "burning" | "awake";

export interface StateRow {
  state: PlanetState;
  label: string;
  sanskrit: string;
  condition: string;
  experience: string;
  remedyLogic: string;
  color: string;
}

export const FOUR_STATE_ROWS: StateRow[] = [
  {
    state: "blind",
    label: "Blind",
    sanskrit: "andhā",
    condition: "Inactive / obstructed — the planet cannot see or influence",
    experience: "Affairs absent or stalled; the planet 'gives nothing'",
    remedyLogic: "Address the obstruction",
    color: "#7A5212",
  },
  {
    state: "sleeping",
    label: "Sleeping",
    sanskrit: "sutela",
    condition: "Dormant — results lie latent",
    experience: "Affairs quiet, waiting; nothing manifests yet",
    remedyLogic: "Awaken via upāya (add energy)",
    color: "#356CAB",
  },
  {
    state: "burning",
    label: "Burning",
    sanskrit: "jalit",
    condition: "Destructive — significations scorched, over-intense",
    experience: "Affairs actively going wrong, hot and damaging",
    remedyLogic: "Cool via careful upāya (temper energy)",
    color: "#A23A1E",
  },
  {
    state: "awake",
    label: "Awake",
    sanskrit: "jāgta",
    condition: "Healthy — delivering normally",
    experience: "Results manifesting as the placement indicates",
    remedyLogic: "None needed (baseline)",
    color: "#2F7D55",
  },
];

export interface BurningCharacteristic {
  title: string;
  text: string;
  color: string;
}

export const BURNING_CHARACTERISTICS: BurningCharacteristic[] = [
  {
    title: "Harmful presence",
    text: "The planet is not inactive or dormant — it is emphatically active. But its activity damages the very affairs it governs.",
    color: "#A23A1E",
  },
  {
    title: "Over-intense delivery",
    text: "Results arrive demanding, exhausting, and hot. The native's effort is high, yet outcomes are strained and costly.",
    color: "#B88421",
  },
  {
    title: "Destructive output",
    text: "At its sharpest, the planet actively damages its own significations. Even apparent gains carry a hidden cost.",
    color: "#A23A1E",
  },
];

export interface CauseCard {
  title: string;
  text: string;
  color: string;
}

export const BURNING_CAUSES: CauseCard[] = [
  {
    title: "Combustion — proximity to the Sun",
    text: "When a planet sits very close to the Sun, the Sun's heat overwhelms it. The planet's capacity to deliver clean results is consumed by solar intensity.",
    color: "#A23A1E",
  },
  {
    title: "Damaging relationship in the Ṭevā",
    text: "A planet may burn when it falls into an afflicting placement or association that heats its significations — even without literal nearness to the Sun.",
    color: "#B88421",
  },
];

export interface ScenarioItem {
  id: number;
  planet: string;
  description: string;
  tevaBox: number;
  sunProximity: boolean;
  damagingRelation: boolean;
  symptom: "absent" | "destructive" | "normal";
  verdict: PlanetState;
  explanation: string;
}

export const SCENARIOS: ScenarioItem[] = [
  {
    id: 1,
    planet: "Saturn",
    description:
      "A native's career is relentlessly turbulent. They work harder than anyone, yet every promotion arrives soured by conflict, every success followed by setback. The tenth-house significator sits 2 degrees from the Sun.",
    tevaBox: 10,
    sunProximity: true,
    damagingRelation: false,
    symptom: "destructive",
    verdict: "burning",
    explanation:
      "The area is actively going wrong — not absent, not dormant. The planet is scorched by combustion (2 deg from Sun). This is the burning (jalit) state: harmful presence caused by over-intensity.",
  },
  {
    id: 2,
    planet: "Venus",
    description:
      "A native's marriage prospects look excellent by chart, yet year after year no match materialises. The planet is far from the Sun and its Teva placement matches an andhā entry.",
    tevaBox: 7,
    sunProximity: false,
    damagingRelation: false,
    symptom: "absent",
    verdict: "blind",
    explanation:
      "Results are absent, not destructive. The planet is far from the Sun (no combustion) and its placement matches an andhā entry. This is the blind state — present but unable to see.",
  },
  {
    id: 3,
    planet: "Moon",
    description:
      "A native's emotional wellbeing is a persistent source of quiet disappointment — a muted, 'not yet' quality. During the Moon's own daśā, matters begin to improve noticeably.",
    tevaBox: 4,
    sunProximity: false,
    damagingRelation: false,
    symptom: "absent",
    verdict: "sleeping",
    explanation:
      "Results are withheld and quiet (not destructive). The daśā triggers improvement, confirming reversibility. This is the sleeping state — dormant, awaiting a trigger.",
  },
  {
    id: 4,
    planet: "Mars",
    description:
      "A native enjoys strong physical vitality, decisive action, and steady career progress. The planet's significations flow without obstruction.",
    tevaBox: 1,
    sunProximity: false,
    damagingRelation: false,
    symptom: "normal",
    verdict: "awake",
    explanation:
      "The planet is active and delivering normally. No dormancy, no obstruction, no excess. This is the awake (jāgta) state — the healthy baseline.",
  },
  {
    id: 5,
    planet: "Jupiter",
    description:
      "A native's relationships are heated, draining, and conflict-ridden despite sincere effort. The significator is not near the Sun, but sits in a damaging placement within the Ṭevā.",
    tevaBox: 7,
    sunProximity: false,
    damagingRelation: true,
    symptom: "destructive",
    verdict: "burning",
    explanation:
      "The area is actively going wrong — harmful presence, not absence. Combustion is absent, so the other cause applies: a damaging relationship in the Ṭevā. Still burning (jalit); the remedy is cooling.",
  },
  {
    id: 6,
    planet: "Mercury",
    description:
      "A planet governing communication has never delivered in the native's life. Multiple transits, daśā periods, and remedies have produced no change at all.",
    tevaBox: 3,
    sunProximity: false,
    damagingRelation: false,
    symptom: "absent",
    verdict: "blind",
    explanation:
      "Results are absent, and crucially no trigger has ever moved the planet. The condition appears permanent — the signature of the blind (andhā) state, not sleeping.",
  },
];
