/* ─── Cosmic Scale Data ─── */

export interface TierData {
  key: string;
  name: string;
  devanagari: string;
  color: string;
  humanYears: number;
  divyaYears: number;
  composition: string;
  description: string;
}

export const TIERS: TierData[] = [
  {
    key: "mahayuga",
    name: "Mahā-Yuga",
    devanagari: "महायुग",
    color: "#C28220",
    humanYears: 4_320_000,
    divyaYears: 12_000,
    composition: "4 yugas (Satya + Tretā + Dvāpara + Kali)",
    description: "The complete four-yuga unit — the foundational building block of cosmic time.",
  },
  {
    key: "manvantara",
    name: "Manvantara",
    devanagari: "मन्वन्तर",
    color: "#4A6FA5",
    humanYears: 308_448_000,
    divyaYears: 856_800,
    composition: "71 Mahā-Yugas + 1 saṁdhi (1 Kṛta-yuga)",
    description: "The rule of one Manu — 71 complete Mahā-Yuga cycles plus a transitional twilight.",
  },
  {
    key: "kalpa",
    name: "Kalpa",
    devanagari: "कल्प",
    color: "#A23A1E",
    humanYears: 4_320_000_000,
    divyaYears: 12_000_000,
    composition: "14 Manvantaras + 15 saṁdhi = 1,000 Mahā-Yugas",
    description: "One Day of Brahmā — the period of cosmic creation and existence.",
  },
  {
    key: "brahma",
    name: "Brahmā-life",
    devanagari: "ब्रह्मायुस्",
    color: "#4A4A5A",
    humanYears: 311_040_000_000_000,
    divyaYears: 864_000_000_000,
    composition: "100 Brahmā-years (each = 360 days + 360 nights)",
    description: "The lifespan of the creator-deity — the largest unit in Vedic cosmology.",
  },
];

export interface ManuData {
  n: number;
  name: string;
  devanagari: string;
  status: "past" | "current" | "future";
}

export const MANUS: ManuData[] = [
  { n: 1, name: "Svāyambhuva", devanagari: "स्वायम्भुव", status: "past" },
  { n: 2, name: "Svārociṣa", devanagari: "स्वारोचिष", status: "past" },
  { n: 3, name: "Uttama (Auttami)", devanagari: "उत्तम", status: "past" },
  { n: 4, name: "Tāmasa", devanagari: "तामस", status: "past" },
  { n: 5, name: "Raivata", devanagari: "रैवत", status: "past" },
  { n: 6, name: "Cākṣuṣa", devanagari: "चाक्षुष", status: "past" },
  { n: 7, name: "Vaivasvata", devanagari: "वैवस्वत", status: "current" },
  { n: 8, name: "Sāvarṇi", devanagari: "सावर्णि", status: "future" },
  { n: 9, name: "Dakṣa-sāvarṇi", devanagari: "दक्षसावर्णि", status: "future" },
  { n: 10, name: "Brahma-sāvarṇi", devanagari: "ब्रह्मसावर्णि", status: "future" },
  { n: 11, name: "Dharma-sāvarṇi", devanagari: "धर्मसावर्णि", status: "future" },
  { n: 12, name: "Rudra-sāvarṇi", devanagari: "रुद्रसावर्णि", status: "future" },
  { n: 13, name: "Deva-sāvarṇi", devanagari: "देवसावर्णि", status: "future" },
  { n: 14, name: "Indra-sāvarṇi", devanagari: "इन्द्रसावर्णि", status: "future" },
];

export const BRAHMA_LIFE = {
  day: 4_320_000_000,
  night: 4_320_000_000,
  year: 3_110_400_000_000,
  life: 311_040_000_000_000,
};

export function fmt(n: number): string {
  if (n >= 1_000_000_000_000_000) return `${(n / 1_000_000_000_000_000).toFixed(2)} quadrillion`;
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(2)} trillion`;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} billion`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} million`;
  return n.toLocaleString();
}

export function fmtCompact(n: number): string {
  if (n >= 1_000_000_000_000_000) return `${(n / 1_000_000_000_000_000).toFixed(1)}Q`;
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}T`;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  return n.toLocaleString();
}

export const CHECKPOINTS = [
  {
    question: "How many Mahā-Yugas are in one Manvantara?",
    answerKey: "manvantara",
    hint: "71 Mahā-Yugas = one Manvantara (the rule of one Manu).",
  },
  {
    question: "Which Manu is the current one?",
    answerKey: "vaivasvata",
    hint: "Vaivasvata is the 7th of 14 Manus — the midpoint of the Kalpa.",
  },
  {
    question: "How many Mahā-Yugas make one Kalpa (Day of Brahmā)?",
    answerKey: "kalpa",
    hint: "1,000 Mahā-Yugas = one Kalpa. That's 14 Manvantaras × 71 + 15 saṁdhi periods.",
  },
];

/* ─── SVG helpers ─── */
export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
