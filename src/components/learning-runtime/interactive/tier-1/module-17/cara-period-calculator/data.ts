import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export interface CaraPeriodRashi {
  index: number;
  name: string;
  iast: string;
  devanagari: string;
  parity: "odd" | "even";
  primaryLord: GrahaSlug;
  coLord?: GrahaSlug;
  color: string;
}

export const CARA_PERIOD_RASHIS: CaraPeriodRashi[] = [
  { index: 0, name: "Aries", iast: "Meṣa", devanagari: "मेष", parity: "odd", primaryLord: "mangala", color: grahas.mangala.primary },
  { index: 1, name: "Taurus", iast: "Vṛṣabha", devanagari: "वृषभ", parity: "even", primaryLord: "shukra", color: grahas.shukra.primary },
  { index: 2, name: "Gemini", iast: "Mithuna", devanagari: "मिथुन", parity: "odd", primaryLord: "budha", color: grahas.budha.primary },
  { index: 3, name: "Cancer", iast: "Karka", devanagari: "कर्क", parity: "even", primaryLord: "candra", color: grahas.candra.primary },
  { index: 4, name: "Leo", iast: "Siṃha", devanagari: "सिंह", parity: "odd", primaryLord: "surya", color: grahas.surya.primary },
  { index: 5, name: "Virgo", iast: "Kanyā", devanagari: "कन्या", parity: "even", primaryLord: "budha", color: grahas.budha.primary },
  { index: 6, name: "Libra", iast: "Tulā", devanagari: "तुला", parity: "odd", primaryLord: "shukra", color: grahas.shukra.primary },
  { index: 7, name: "Scorpio", iast: "Vṛścika", devanagari: "वृश्चिक", parity: "even", primaryLord: "mangala", coLord: "ketu", color: grahas.mangala.primary },
  { index: 8, name: "Sagittarius", iast: "Dhanus", devanagari: "धनुस", parity: "odd", primaryLord: "guru", color: grahas.guru.primary },
  { index: 9, name: "Capricorn", iast: "Makara", devanagari: "मकर", parity: "even", primaryLord: "shani", color: grahas.shani.primary },
  { index: 10, name: "Aquarius", iast: "Kumbha", devanagari: "कुम्भ", parity: "odd", primaryLord: "shani", coLord: "rahu", color: grahas.shani.primary },
  { index: 11, name: "Pisces", iast: "Mīna", devanagari: "मीन", parity: "even", primaryLord: "guru", color: grahas.guru.primary },
];

export const WORKED_PRESETS = [
  { slug: "mesha-karka", label: "Mesha: Mars in Karka", signIndex: 0, lordSignIndex: 3, lord: "mangala" as GrahaSlug },
  { slug: "vrishabha-mina", label: "Vṛṣabha: Venus in Mīna", signIndex: 1, lordSignIndex: 11, lord: "shukra" as GrahaSlug },
  { slug: "own-sign", label: "Own-sign exception", signIndex: 0, lordSignIndex: 0, lord: "mangala" as GrahaSlug },
  { slug: "kumbha-rahu", label: "Kumbha: co-lord Rahu", signIndex: 10, lordSignIndex: 8, lord: "rahu" as GrahaSlug },
];

export function getPeriodRashi(index: number) {
  return CARA_PERIOD_RASHIS[((index % 12) + 12) % 12];
}

export function directionForSign(sign: CaraPeriodRashi) {
  return sign.parity === "odd" ? "forward" : "backward";
}

export function buildCountPath(signIndex: number, lordSignIndex: number) {
  const sign = getPeriodRashi(signIndex);
  const direction = directionForSign(sign);
  const path: CaraPeriodRashi[] = [];
  let current = signIndex;
  while (true) {
    path.push(getPeriodRashi(current));
    if (current === lordSignIndex) break;
    current = direction === "forward" ? (current + 1) % 12 : (current + 11) % 12;
  }
  return path;
}

export function computeCaraPeriod(signIndex: number, lordSignIndex: number) {
  const sign = getPeriodRashi(signIndex);
  const direction = directionForSign(sign);
  const ownSign = signIndex === lordSignIndex;
  const path = buildCountPath(signIndex, lordSignIndex);
  return {
    sign,
    lordSign: getPeriodRashi(lordSignIndex),
    direction,
    path,
    inclusiveCount: path.length,
    ownSign,
    years: ownSign ? 12 : path.length - 1,
  };
}
