/**
 * Parāśarī-Jaimini Chooser — Data Layer
 *
 * §7 interactive for Lesson 10.6.4 (Vimśottarī vs Jaimini: Which, When?).
 *
 * Holds the choice matrix, situation definitions, and cross-validation
 * scenarios. Vimśottarī is always the anchored default.
 */

export interface Situation {
  id: string;
  label: string;
  description: string;
  primaryDasha: string;
  primaryDashaIAST: string;
  addOn?: string;
  addOnIAST?: string;
  rationale: string;
  practitionerLevel: string;
}

export interface CrossValidationScenario {
  id: string;
  label: string;
  systemA: string;
  systemB: string;
  outcome: "converge" | "diverge";
  reading: string;
  note: string;
}

/* ─── Situations / choice matrix ───────────────────────────────────────── */

export const SITUATIONS: Situation[] = [
  {
    id: "general",
    label: "General-purpose reading",
    description: "Typical life-event timing — career, marriage, health, finance.",
    primaryDasha: "Vimśottarī",
    primaryDashaIAST: "Vimśottarī",
    rationale:
      "Vimśottarī is the universal default. Every practitioner learns it first; it applies to all charts and all questions.",
    practitionerLevel: "All practitioners",
  },
  {
    id: "jaimini-trained",
    label: "Jaimini-tradition practitioner",
    description: "A practitioner trained in the Jaimini system seeking a second lens.",
    primaryDasha: "Vimśottarī",
    primaryDashaIAST: "Vimśottarī",
    addOn: "Cara / Sthira",
    addOnIAST: "Cara / Sthira",
    rationale:
      "Vimśottarī remains the anchor. The Jaimini-trained practitioner adds Cara or Sthira for cross-validation and rāśi-based nuance.",
    practitionerLevel: "Jaimini-trained",
  },
  {
    id: "spiritual",
    label: "Spiritual / mokṣa question",
    description: "Questions about spiritual growth, renunciation, or liberation.",
    primaryDasha: "Vimśottarī",
    primaryDashaIAST: "Vimśottarī",
    addOn: "Yoginī",
    addOnIAST: "Yoginī",
    rationale:
      "Vimśottarī covers the base. Yoginī daśā (a conditional 8-lord system) is consulted by specialists for spiritual-depth timing.",
    practitionerLevel: "Specialist",
  },
  {
    id: "rahu-strong",
    label: "Rāhu-strong chart",
    description: "Chart where Rāhu is prominently placed or dominant.",
    primaryDasha: "Vimśottarī",
    primaryDashaIAST: "Vimśottarī",
    addOn: "Aṣṭottarī",
    addOnIAST: "Aṣṭottarī",
    rationale:
      "Vimśottarī is always run. Aṣṭottarī (108-year, 8-lord conditional daśā) activates when Rāhu-strong conditions are met.",
    practitionerLevel: "Condition-dependent",
  },
  {
    id: "cross-check",
    label: "High-stakes decision",
    description: "A major life decision where confidence needs to be maximised.",
    primaryDasha: "Vimśottarī",
    primaryDashaIAST: "Vimśottarī",
    addOn: "Cara / Sthira / Aṣṭottarī",
    addOnIAST: "Cara / Sthira / Aṣṭottarī",
    rationale:
      "Vimśottarī anchors. One or more secondary daśās are consulted for convergence-checking. Agreement raises confidence; divergence flags nuance.",
    practitionerLevel: "Advanced",
  },
];

/* ─── Cross-validation scenarios ───────────────────────────────────────── */

export const CROSS_VALIDATION_SCENARIOS: CrossValidationScenario[] = [
  {
    id: "career-converge",
    label: "Career rise — both agree",
    systemA: "Vimśottarī",
    systemB: "Cara",
    outcome: "converge",
    reading:
      "Vimśottarī Saturn MD (10th-lord) AND Cara Capricorn daśā (Saturn's sign) both point to career elevation.",
    note: "Convergence → high-confidence prediction.",
  },
  {
    id: "marriage-diverge",
    label: "Marriage timing — they differ",
    systemA: "Vimśottarī",
    systemB: "Cara",
    outcome: "diverge",
    reading:
      "Vimśottarī shows a Venus-Jupiter window in 2 years; Cara shows a Libra period (Venus-sign) in 4 years.",
    note: "Divergence → report as nuanced timing, not contradiction. Both may be partially true.",
  },
  {
    id: "health-converge",
    label: "Health caution — both agree",
    systemA: "Vimśottarī",
    systemB: "Aṣṭottarī",
    outcome: "converge",
    reading:
      "Vimśottarī Mars-MD (6th-lord) AND Aṣṭottarī Mars-period both flag the same health interval.",
    note: "Convergence → strong signal to advise care during that window.",
  },
  {
    id: "spiritual-diverge",
    label: "Spiritual growth — different emphases",
    systemA: "Vimśottarī",
    systemB: "Yoginī",
    outcome: "diverge",
    reading:
      "Vimśottarī highlights Jupiter (dharma) while Yoginī highlights Śiva-yoginī (detachment). Different facets of the same path.",
    note: "Divergence → richer, multi-layered reading rather than conflict.",
  },
];

/* ─── Stream family data ───────────────────────────────────────────────── */

export const STREAM_FAMILIES = [
  {
    name: "Parāśarī",
    nameIAST: "Pārāśarī",
    leader: "Vimśottarī",
    tools: ["Vimśottarī", "Aṣṭottarī", "Yoginī"],
    basis: "Planet-based (graha)",
    color: "#B88421",
  },
  {
    name: "Jaimini",
    nameIAST: "Jaiminī",
    leader: "Cara daśā",
    tools: ["Cara daśā", "Sthira daśā", "Rāśi-dṛṣṭi", "Argalā"],
    basis: "Sign-based (rāśi)",
    color: "#6B5AA8",
  },
];
