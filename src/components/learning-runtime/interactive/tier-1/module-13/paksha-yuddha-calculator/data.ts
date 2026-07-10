/**
 * Pakṣa-Yuddha Calculator — Data Engine
 *
 * §7 interactive for Lesson 13.3.3.
 *
 * Provides planet classifications, pakṣabala rules, yuddha rules,
 * and worked scenarios for the two most consequential kāla-bala sub-components.
 */

export interface Planet {
  key: string;
  nameIAST: string;
  nameDevanagari: string;
  nature: "benefic" | "malefic" | "neutral";
  isTaraGraha: boolean; // eligible for graha-yuddha
  color: string;
}

export const PLANETS: Planet[] = [
  { key: "sun", nameIAST: "Sūrya", nameDevanagari: "सूर्य", nature: "malefic", isTaraGraha: false, color: "#D99622" },
  { key: "moon", nameIAST: "Candra", nameDevanagari: "चन्द्र", nature: "benefic", isTaraGraha: false, color: "#6D7FA8" },
  { key: "mars", nameIAST: "Maṅgala", nameDevanagari: "मङ्गल", nature: "malefic", isTaraGraha: true, color: "#A23A1E" },
  { key: "mercury", nameIAST: "Budha", nameDevanagari: "बुध", nature: "benefic", isTaraGraha: true, color: "#2F7D55" },
  { key: "jupiter", nameIAST: "Guru", nameDevanagari: "गुरु", nature: "benefic", isTaraGraha: true, color: "#C8841E" },
  { key: "venus", nameIAST: "Śukra", nameDevanagari: "शुक्र", nature: "benefic", isTaraGraha: true, color: "#8B5A9F" },
  { key: "saturn", nameIAST: "Śani", nameDevanagari: "शनि", nature: "malefic", isTaraGraha: true, color: "#5A4E2E" },
];

export const TARA_GRAHAS = PLANETS.filter((p) => p.isTaraGraha);

export type Paksha = "shukla" | "krishna";

export interface PakshaRule {
  paksha: Paksha;
  label: string;
  labelDevanagari: string;
  description: string;
  beneficLabel: string;
  maleficLabel: string;
}

export const PAKSHA_RULES: Record<Paksha, PakshaRule> = {
  shukla: {
    paksha: "shukla",
    label: "Śukla-pakṣa (waxing)",
    labelDevanagari: "शुक्लपक्षः",
    description: "The bright fortnight — Moon waxing from new to full.",
    beneficLabel: "Strong — benefics thrive in the bright half",
    maleficLabel: "Weak — malefics fade in the bright half",
  },
  krishna: {
    paksha: "krishna",
    label: "Kṛṣṇa-pakṣa (waning)",
    labelDevanagari: "कृष्णपक्षः",
    description: "The dark fortnight — Moon waning from full to new.",
    beneficLabel: "Weak — benefics fade in the dark half",
    maleficLabel: "Strong — malefics thrive in the dark half",
  },
};

export interface YuddhaRule {
  title: string;
  condition: string;
  winner: string;
  loser: string;
  exemption: string;
}

export const YUDDHA_RULES: YuddhaRule = {
  title: "Graha-yuddha (planetary war)",
  condition: "Two tārā-grahas within ~1° in the same sign",
  winner: "The planet further north (higher celestial latitude) or brighter",
  loser: "Loses kāla bala sharply — can override other strengths",
  exemption: "Sun and Moon are exempt; war is among Mars, Mercury, Jupiter, Venus, Saturn only",
};

export interface Scenario {
  key: string;
  title: string;
  paksha?: Paksha;
  yuddhaPlanet1?: string;
  yuddhaPlanet2?: string;
  separation?: number;
  winner?: string;
  setup: string;
  takeaway: string;
}

export const SCENARIOS: Scenario[] = [
  {
    key: "jupiter-waxing",
    title: "Benefic in waxing",
    paksha: "shukla",
    setup: "Jupiter in a waxing-Moon chart — benefic in the bright fortnight.",
    takeaway: "Jupiter's pakṣabala is strong. Benefics love śukla-pakṣa.",
  },
  {
    key: "saturn-waning",
    title: "Malefic in waning",
    paksha: "krishna",
    setup: "Saturn in a waning-Moon chart — malefic in the dark fortnight.",
    takeaway: "Saturn's pakṣabala is strong. Malefics love kṛṣṇa-pakṣa.",
  },
  {
    key: "mars-saturn-war",
    title: "Planetary war",
    yuddhaPlanet1: "mars",
    yuddhaPlanet2: "saturn",
    separation: 0.7,
    winner: "mars",
    setup: "Mars and Saturn within 0.7° in the same sign. Mars is further north.",
    takeaway: "Mars wins, Saturn loses kāla bala sharply. War can change a verdict.",
  },
];
