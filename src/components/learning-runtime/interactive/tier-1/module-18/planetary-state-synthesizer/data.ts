/**
 * Engine for Lesson 18.3.4 — Planetary State Synthesizer (Chapter 3 capstone).
 *
 * Supplies the four-state framework, lamp metaphor, remedy-goal mappings,
 * and capstone recognition scenarios.
 */

export type PlanetState = "blind" | "sleeping" | "burning" | "awake";

export interface StateRow {
  state: PlanetState;
  label: string;
  sanskrit: string;
  condition: string;
  experience: string;
  remedyGoal: string;
  lampMetaphor: string;
  color: string;
}

export const FOUR_STATES: StateRow[] = [
  {
    state: "awake",
    label: "Awake",
    sanskrit: "jāgta",
    condition: "Functional — manifests significations normally",
    experience: "Results manifesting as the placement indicates",
    remedyGoal: "None needed — already at destination",
    lampMetaphor: "A lamp burning steadily at the right brightness",
    color: "#2F7D55",
  },
  {
    state: "blind",
    label: "Blind",
    sanskrit: "andhā",
    condition: "Obstructed — cannot 'see' or influence",
    experience: "Affairs absent or stalled; the planet 'gives nothing'",
    remedyGoal: "Restore its capacity to act",
    lampMetaphor: "A lamp with its glass blacked out — lit, but light cannot get out",
    color: "#7A5212",
  },
  {
    state: "sleeping",
    label: "Sleeping",
    sanskrit: "sutela",
    condition: "Dormant — present but unmanifesting until roused",
    experience: "Affairs quiet, waiting; nothing manifests yet",
    remedyGoal: "Awaken via upāya (add energy)",
    lampMetaphor: "A lamp switched off, waiting for someone to flip it on",
    color: "#356CAB",
  },
  {
    state: "burning",
    label: "Burning",
    sanskrit: "jalit",
    condition: "Destructive — significations scorched, over-intense",
    experience: "Affairs actively going wrong, hot and damaging",
    remedyGoal: "Cool and carefully contain",
    lampMetaphor: "A lamp whose flame has flared out of control",
    color: "#A23A1E",
  },
];

export interface EliminationStep {
  check: string;
  ifYes: string;
  state: PlanetState;
  color: string;
}

export const ELIMINATION_STEPS: EliminationStep[] = [
  {
    check: "Is the planet obstructed — present but unable to see or influence?",
    ifYes: "Blind (andhā)",
    state: "blind",
    color: "#7A5212",
  },
  {
    check: "Is the planet dormant — its affairs quiet and waiting, not manifesting?",
    ifYes: "Sleeping (sutela)",
    state: "sleeping",
    color: "#356CAB",
  },
  {
    check: "Is the planet over-active — its affairs going wrong in a hot, damaging way?",
    ifYes: "Burning (jalit)",
    state: "burning",
    color: "#A23A1E",
  },
  {
    check: "If none of the above, is it delivering steadily and normally?",
    ifYes: "Awake (jāgta)",
    state: "awake",
    color: "#2F7D55",
  },
];

export interface ScenarioItem {
  id: number;
  planet: string;
  description: string;
  tevaBox: number;
  checks: {
    blind: boolean;
    sleeping: boolean;
    burning: boolean;
    awake: boolean;
  };
  verdict: PlanetState;
  explanation: string;
}

export const SCENARIOS: ScenarioItem[] = [
  {
    id: 1,
    planet: "Jupiter",
    description:
      "A native enjoys steady spiritual guidance, educational success, and teacher support. The planet's affairs unfold without obstruction, dormancy, or excess.",
    tevaBox: 9,
    checks: { blind: false, sleeping: false, burning: false, awake: true },
    verdict: "awake",
    explanation:
      "Not blind (affairs are present), not sleeping (they are manifesting now), not burning (no destructive excess). Delivering normally. This is the awake (jāgta) state — no remedy needed.",
  },
  {
    id: 2,
    planet: "Venus",
    description:
      "A native's marriage prospects look excellent by chart, yet year after year no match materialises. The planet is far from the Sun and its Teva placement matches an andhā entry.",
    tevaBox: 7,
    checks: { blind: true, sleeping: false, burning: false, awake: false },
    verdict: "blind",
    explanation:
      "The planet is obstructed — present but unable to see or influence. This is the blind (andhā) state. The remedy aims to restore its capacity to act.",
  },
  {
    id: 3,
    planet: "Moon",
    description:
      "A native's emotional wellbeing is a persistent source of quiet disappointment — a muted, 'not yet' quality. During the Moon's own daśā, matters begin to improve noticeably.",
    tevaBox: 4,
    checks: { blind: false, sleeping: true, burning: false, awake: false },
    verdict: "sleeping",
    explanation:
      "The planet is not obstructed (not blind) and not destructive (not burning). Its affairs are quiet and waiting — dormant until roused. This is the sleeping (sutela) state. The remedy aims to awaken it.",
  },
  {
    id: 4,
    planet: "Saturn",
    description:
      "A native's career is relentlessly turbulent. Every promotion arrives soured by conflict; the harder they try, the more it costs them. The tenth-house significator sits 2 degrees from the Sun.",
    tevaBox: 10,
    checks: { blind: false, sleeping: false, burning: true, awake: false },
    verdict: "burning",
    explanation:
      "The planet is not obstructed (results are present, not absent) and not dormant (results are manifesting, just destructively). The affairs are going wrong in a hot, damaging way. This is the burning (jalit) state. The remedy aims to cool and contain.",
  },
  {
    id: 5,
    planet: "Mars",
    description:
      "A native has strong physical vitality and decisive action, but every success is followed by sudden conflict or injury. The significator is not near the Sun but sits in a damaging placement within the Ṭevā.",
    tevaBox: 1,
    checks: { blind: false, sleeping: false, burning: true, awake: false },
    verdict: "burning",
    explanation:
      "Results are present (not blind) and manifesting (not sleeping), but they are destructive and harmful. A damaging relationship in the Ṭevā heats the significations. This is burning (jalit) — the remedy is cooling.",
  },
  {
    id: 6,
    planet: "Mercury",
    description:
      "A native's communication skills and business acumen are evident in daily life. Negotiations flow smoothly, learning comes easily, and no remedial intervention is indicated.",
    tevaBox: 3,
    checks: { blind: false, sleeping: false, burning: false, awake: true },
    verdict: "awake",
    explanation:
      "Not blind, not sleeping, not burning. The planet's affairs show up steadily and as expected. This is the awake (jāgta) state — the healthy baseline requiring no upāya.",
  },
];
