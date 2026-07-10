/**
 * Ṣaḍbala–Bhāva Bala Synthesis — Data Engine
 *
 * §7 interactive for Lesson 13.6.2.
 *
 * Provides domain-to-house/planet mappings, the four-cell synthesis
 * definitions, and scenario presets for the integrative interactive.
 */

import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

/* ─── Domains with leading house + kāraka planet ─────────────────────────── */

export interface Domain {
  key: string;
  label: string;
  houseNumber: number;
  houseIAST: string;
  houseDevanagari: string;
  planetSlug: GrahaSlug;
  planetIAST: string;
  planetDevanagari: string;
  leadingLens: "house" | "planet" | "both";
  note: string;
}

export const DOMAINS: Domain[] = [
  {
    key: "career",
    label: "Career / Status",
    houseNumber: 10,
    houseIAST: "Karma",
    houseDevanagari: "कर्म",
    planetSlug: "surya",
    planetIAST: "Sūrya",
    planetDevanagari: "सूर्य",
    leadingLens: "both",
    note: "10th house domain + Sun (authority) as kāraka",
  },
  {
    key: "home",
    label: "Home / Property",
    houseNumber: 4,
    houseIAST: "Bandhu",
    houseDevanagari: "बन्धु",
    planetSlug: "candra",
    planetIAST: "Candra",
    planetDevanagari: "चन्द्र",
    leadingLens: "both",
    note: "4th house domain + Moon (mind/comfort) as kāraka",
  },
  {
    key: "partnership",
    label: "Partnership / Marriage",
    houseNumber: 7,
    houseIAST: "Jāyā",
    houseDevanagari: "जाया",
    planetSlug: "shukra",
    planetIAST: "Śukra",
    planetDevanagari: "शुक्र",
    leadingLens: "both",
    note: "7th house domain + Venus (relationship) as kāraka",
  },
  {
    key: "children",
    label: "Children / Progeny",
    houseNumber: 5,
    houseIAST: "Suta",
    houseDevanagari: "सुत",
    planetSlug: "guru",
    planetIAST: "Guru",
    planetDevanagari: "गुरु",
    leadingLens: "both",
    note: "5th house domain + Jupiter (children) as kāraka",
  },
  {
    key: "health",
    label: "Health / Vitality",
    houseNumber: 1,
    houseIAST: "Tanu",
    houseDevanagari: "तनु",
    planetSlug: "surya",
    planetIAST: "Sūrya",
    planetDevanagari: "सूर्य",
    leadingLens: "planet",
    note: "1st house (body) + Sun (vitality) — planet often leads",
  },
  {
    key: "wealth",
    label: "Wealth / Income",
    houseNumber: 2,
    houseIAST: "Dhana",
    houseDevanagari: "धन",
    planetSlug: "guru",
    planetIAST: "Guru",
    planetDevanagari: "गुरु",
    leadingLens: "both",
    note: "2nd house domain + Jupiter (wealth) as kāraka",
  },
];

/* ─── Four-cell synthesis ────────────────────────────────────────────────── */

export type StrengthLevel = "strong" | "weak";

export interface SynthesisCell {
  houseLevel: StrengthLevel;
  planetLevel: StrengthLevel;
  verdict: string;
  verdictColor: string;
  confidencePercent: number;
  guidance: string;
  action: string;
}

export const SYNTHESIS_CELLS: SynthesisCell[] = [
  {
    houseLevel: "strong",
    planetLevel: "strong",
    verdict: "Reliable",
    verdictColor: "#2F7D55",
    confidencePercent: 90,
    guidance: "Both domain and agent are strong. Read with confidence.",
    action: "Lead the reading with this pairing.",
  },
  {
    houseLevel: "strong",
    planetLevel: "weak",
    verdict: "Mixed",
    verdictColor: "#C8841E",
    confidencePercent: 50,
    guidance: "Domain supported, but the significator falters.",
    action: "Cross-validate with daśā and transit before asserting.",
  },
  {
    houseLevel: "weak",
    planetLevel: "strong",
    verdict: "Mixed",
    verdictColor: "#C8841E",
    confidencePercent: 50,
    guidance: "Agent able, but the domain is fragile.",
    action: "Cross-validate with daśā and transit before asserting.",
  },
  {
    houseLevel: "weak",
    planetLevel: "weak",
    verdict: "Unreliable",
    verdictColor: "#A23A1E",
    confidencePercent: 15,
    guidance: "Neither domain nor agent has strength to deliver.",
    action: "Withhold firm claims or qualify heavily.",
  },
];

export function getCell(house: StrengthLevel, planet: StrengthLevel): SynthesisCell {
  return SYNTHESIS_CELLS.find(
    (c) => c.houseLevel === house && c.planetLevel === planet
  )!;
}

/* ─── Presets (worked examples from §6) ──────────────────────────────────── */

export interface Preset {
  label: string;
  description: string;
  domainKey: string;
  houseStrong: boolean;
  planetStrong: boolean;
  takeaway: string;
}

export const PRESETS: Preset[] = [
  {
    label: "Career — Strong-Strong",
    description: "10th house strong + Sun strong → reliable.",
    domainKey: "career",
    houseStrong: true,
    planetStrong: true,
    takeaway: "Read career with confidence.",
  },
  {
    label: "Home — Mixed",
    description: "4th house strong but Moon weak → cross-validate.",
    domainKey: "home",
    houseStrong: true,
    planetStrong: false,
    takeaway: "Domain OK, agent falters → check daśā/transit.",
  },
  {
    label: "Partnership — Weak-Weak",
    description: "7th house weak + Venus weak → unreliable.",
    domainKey: "partnership",
    houseStrong: false,
    planetStrong: false,
    takeaway: "Withhold firm claims; qualify heavily.",
  },
];
