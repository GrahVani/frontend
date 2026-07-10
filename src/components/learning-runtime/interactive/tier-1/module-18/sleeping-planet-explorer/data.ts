/**
 * Engine for Lesson 18.3.2 — Sleeping Planet (sutela) explorer.
 *
 * Supplies comparison data, awakening mechanisms, and recognition scenarios
 * for the dormant-state interactive.
 */

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const SHORT_SIGNS = [
  "Ar", "Ta", "Ge", "Cn", "Le", "Vi",
  "Li", "Sc", "Sg", "Cp", "Aq", "Pi",
];

export type PlanetState = "blind" | "sleeping" | "burning" | "awake";

export interface StateRow {
  state: PlanetState;
  label: string;
  active: string;
  reversible: string;
  experience: string;
  color: string;
}

export const STATE_COMPARISON_ROWS: StateRow[] = [
  {
    state: "blind",
    label: "Blind (andhā)",
    active: "No — inactive",
    reversible: "No — treated as irreversible",
    experience: "Results withheld, not expected to return by remedy in the same way",
    color: "#7A5212",
  },
  {
    state: "sleeping",
    label: "Sleeping (sutela)",
    active: "No — dormant, but rousable",
    reversible: "Yes — awakened by trigger or upāya",
    experience: "Results withheld for now, but recoverable",
    color: "#356CAB",
  },
  {
    state: "awake",
    label: "Awake (jāgta)",
    active: "Yes — delivering normally",
    reversible: "n/a (already active)",
    experience: "Results manifesting as the placement indicates",
    color: "#2F7D55",
  },
];

export interface AwakeningCard {
  title: string;
  text: string;
  color: string;
}

export const AWAKENING_CARDS: AwakeningCard[] = [
  {
    title: "Transit",
    text: "A moving planet passes over the sleeping planet or its house, acting like a hand on the shoulder — stirring the dormant significator into temporary activity.",
    color: "#B88421",
  },
  {
    title: "Daśā",
    text: "When the sleeping planet's own period (or a related sub-period) becomes operative, the timeline itself calls on the planet, and the dormant capacity may begin to express.",
    color: "#356CAB",
  },
  {
    title: "Upāya (remedy)",
    text: "The distinctively Lal Kitab trigger. A prescribed remedial act is the one awakening the practitioner can deliberately apply, rather than waiting for the sky.",
    color: "#2F7D55",
  },
];

export interface SleepingCharacteristic {
  title: string;
  text: string;
  color: string;
}

export const SLEEPING_CHARACTERISTICS: SleepingCharacteristic[] = [
  {
    title: "Latency, not loss",
    text: "The planet's full capacity is intact. It simply does not exercise it while asleep — the potential is present but not manifesting.",
    color: "#356CAB",
  },
  {
    title: "Reversible by trigger",
    text: "A transit, daśā, or upāya can rouse the planet. The dormancy is not permanent — it is a waiting state that can end.",
    color: "#2F7D55",
  },
  {
    title: "Under-delivery",
    text: "While asleep, the planet gives reduced or withheld results. It is the opposite of burning, which gives intensified, destructive results.",
    color: "#B88421",
  },
];

export interface ScenarioItem {
  id: number;
  planet: string;
  description: string;
  tevaBox: number;
  symptom: "absent" | "destructive" | "normal";
  reversible: boolean;
  triggerResponse?: boolean;
  verdict: PlanetState;
  explanation: string;
}

export const SCENARIOS: ScenarioItem[] = [
  {
    id: 1,
    planet: "Venus",
    description:
      "A native's marriage prospects look excellent by chart, yet year after year no match materialises. A prescribed upāya is performed, and within months a suitable alliance appears.",
    tevaBox: 7,
    symptom: "absent",
    reversible: true,
    triggerResponse: true,
    verdict: "sleeping",
    explanation:
      "Results were absent (withheld, not destructive). The condition proved reversible — the upāya triggered manifestation. This is the sleeping state: dormant, awaiting a trigger.",
  },
  {
    id: 2,
    planet: "Saturn",
    description:
      "A planet that should govern career stability sits well by sign, yet the native has experienced only repeated job losses and workplace conflict. The results are not absent — they are harmful and excessive.",
    tevaBox: 10,
    symptom: "destructive",
    reversible: false,
    triggerResponse: false,
    verdict: "burning",
    explanation:
      "The planet is delivering results, but they are intensified and destructive — not withheld. This is the burning (jalit) state, the opposite of dormancy. Lesson 18.3.3 covers this in detail.",
  },
  {
    id: 3,
    planet: "Jupiter",
    description:
      "A native enjoys consistent spiritual guidance, educational success, and the support of teachers. The planet's significations flow steadily without obstruction.",
    tevaBox: 9,
    symptom: "normal",
    reversible: true,
    triggerResponse: true,
    verdict: "awake",
    explanation:
      "The planet is delivering its results normally and fully. No dormancy, no obstruction, no excess. This is the awake (jāgta) state — the healthy baseline.",
  },
  {
    id: 4,
    planet: "Mercury",
    description:
      "A planet governing communication and business acumen has never delivered in the native's life. Multiple transits, daśā periods, and remedies have produced no change. The condition appears permanent.",
    tevaBox: 3,
    symptom: "absent",
    reversible: false,
    triggerResponse: false,
    verdict: "blind",
    explanation:
      "Results are absent, but crucially the condition has not responded to any trigger — transits, daśā, and upāya all failed to move the planet. This permanence marks the blind (andhā) state, not sleeping.",
  },
  {
    id: 5,
    planet: "Moon",
    description:
      "A native's emotional wellbeing and maternal relationships are a persistent source of quiet disappointment — not crisis, just a muted, 'not yet' quality. During the Moon's own daśā, these matters begin to improve noticeably.",
    tevaBox: 4,
    symptom: "absent",
    reversible: true,
    triggerResponse: true,
    verdict: "sleeping",
    explanation:
      "Results were withheld and quiet (not destructive). The onset of the planet's own daśā triggered improvement — the dormancy lifted. This confirms the sleeping state.",
  },
  {
    id: 6,
    planet: "Mars",
    description:
      "A planet governing courage and initiative delivers strongly in the native's life — promotions, physical vitality, and decisive action all flow without issue.",
    tevaBox: 1,
    symptom: "normal",
    reversible: true,
    triggerResponse: true,
    verdict: "awake",
    explanation:
      "The planet is active and delivering normally. No dormancy, no obstruction. This is the awake (jāgta) state.",
  },
];
