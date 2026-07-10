/**
 * Strength-Quality Matrix — Data Engine
 *
 * §7 interactive for Lesson 13.6.4 (Module 13 capstone).
 *
 * Provides the 2×2 judgement matrix, preset scenarios, and
 * discipline rules that fuse quantitative strength with qualitative reading.
 */

export interface MatrixCell {
  key: "sb" | "sm" | "wb" | "wm";
  strength: "strong" | "weak";
  quality: "benefic" | "malefic";
  label: string;
  subtitle: string;
  color: string;
  bgHex: string;
  borderHex: string;
  reading: string;
  danger: boolean;
  icon: "star" | "bolt" | "feather" | "alert";
}

export const MATRIX_CELLS: MatrixCell[] = [
  {
    key: "sb",
    strength: "strong",
    quality: "benefic",
    label: "Best",
    subtitle: "Forceful and favourable",
    color: "#2F7D55",
    bgHex: "#2F7D55",
    borderHex: "#2F7D55",
    reading:
      "High ṣaḍbala in a benefic context (good dignity, benefic aspects, supportive yogas) is the ideal. The planet has both the will and the way — it delivers its significations forcefully and favourably.",
    danger: false,
    icon: "star",
  },
  {
    key: "sm",
    strength: "strong",
    quality: "malefic",
    label: "Power with difficulty",
    subtitle: "Delivers hard results firmly",
    color: "#A23A1E",
    bgHex: "#A23A1E",
    borderHex: "#A23A1E",
    reading:
      "High ṣaḍbala in a malefic context (poor dignity, malefic aspects, obstructive yogas) is dangerous. Strength amplifies the difficulty — the planet delivers hardship with full force. This is the 'strong = good' misreading.",
    danger: true,
    icon: "bolt",
  },
  {
    key: "wb",
    strength: "weak",
    quality: "benefic",
    label: "Limited but favourable",
    subtitle: "Good-natured but underpowered",
    color: "#C8841E",
    bgHex: "#C8841E",
    borderHex: "#C8841E",
    reading:
      "Low ṣaḍbala in a benefic context is kindly but underpowered. The planet wants to help but lacks the force to deliver fully. Results may be delayed, partial, or require assistance from other planets.",
    danger: false,
    icon: "feather",
  },
  {
    key: "wm",
    strength: "weak",
    quality: "malefic",
    label: "Worst",
    subtitle: "Weak and unfavourable",
    color: "#5A4E2E",
    bgHex: "#5A4E2E",
    borderHex: "#5A4E2E",
    reading:
      "Low ṣaḍbala in a malefic context is the most challenging. The planet is both unfavourable and unable to act with force. While the harm is limited, so is any potential redemption. Watch for activation by transit or daśā.",
    danger: true,
    icon: "alert",
  },
];

export interface Scenario {
  key: string;
  planetIAST: string;
  planetDevanagari: string;
  strengthLabel: string;
  qualityLabel: string;
  cellKey: MatrixCell["key"];
  setup: string;
  takeaway: string;
}

export const SCENARIOS: Scenario[] = [
  {
    key: "jupiter-best",
    planetIAST: "Guru",
    planetDevanagari: "गुरु",
    strengthLabel: "High ṣaḍbala",
    qualityLabel: "Exalted, well-aspected",
    cellKey: "sb",
    setup: "Exalted Jupiter, well-aspected by Venus and Mercury, high ṣaḍbala in rūpas.",
    takeaway: "The ideal — wisdom, wealth, and guidance delivered with full force.",
  },
  {
    key: "saturn-difficult",
    planetIAST: "Śani",
    planetDevanagari: "शनि",
    strengthLabel: "High ṣaḍbala",
    qualityLabel: "Debilitated, afflicted",
    cellKey: "sm",
    setup: "Strong ṣaḍbala but debilitated in Aries, aspected by Mars and Rāhu.",
    takeaway: "Strength ≠ goodness — Saturn delivers restriction and delay with full force.",
  },
  {
    key: "venus-limited",
    planetIAST: "Śukra",
    planetDevanagari: "शुक्र",
    strengthLabel: "Low ṣaḍbala",
    qualityLabel: "Dignified in own sign",
    cellKey: "wb",
    setup: "Venus in Libra (own sign) but low ṣaḍbala due to weak dig-bala and kāl-bala.",
    takeaway: "Kindly but underpowered — relationships and artistry are favoured but faint.",
  },
];

export interface DisciplineRule {
  num: number;
  title: string;
  warning: string;
  correction: string;
}

export const DISCIPLINE_RULES: DisciplineRule[] = [
  {
    num: 1,
    title: "Never trust the quantitative alone",
    warning: "A planet with high ṣaḍbala but poor dignity/aspect is not 'good'.",
    correction: "Always check dignity, aspect, and yoga before celebrating strength.",
  },
  {
    num: 2,
    title: "Never trust the qualitative alone",
    warning: "A well-dignified planet with negligible ṣaḍbala cannot deliver fully.",
    correction: "Always ask: does this favourable quality have enough force behind it?",
  },
  {
    num: 3,
    title: "Always synthesise both",
    warning: "Reading one axis in isolation produces half-truths.",
    correction: "The 2×2 matrix is your minimum checklist for every planet.",
  },
];
