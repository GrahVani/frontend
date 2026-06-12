import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type ClockMode = "cara" | "vimshottari";

export interface MechanismRashi {
  index: number;
  name: string;
  iast: string;
  devanagari: string;
  lord: GrahaSlug;
  occupant: GrahaSlug;
  aspectCue: string;
  durationCue: string;
  color: string;
}

export const MECHANISM_RASHIS: MechanismRashi[] = [
  { index: 0, name: "Aries", iast: "Meṣa", devanagari: "मेष", lord: "mangala", occupant: "surya", aspectCue: "activates fire signs by sign logic", durationCue: "length comes from Mars placement", color: grahas.mangala.primary },
  { index: 1, name: "Taurus", iast: "Vṛṣabha", devanagari: "वृषभ", lord: "shukra", occupant: "candra", aspectCue: "holds resources and continuity", durationCue: "length comes from Venus placement", color: grahas.shukra.primary },
  { index: 2, name: "Gemini", iast: "Mithuna", devanagari: "मिथुन", lord: "budha", occupant: "budha", aspectCue: "links speech, trade, and calculation", durationCue: "length comes from Mercury placement", color: grahas.budha.primary },
  { index: 3, name: "Cancer", iast: "Karka", devanagari: "कर्क", lord: "candra", occupant: "guru", aspectCue: "nourishes the running sign field", durationCue: "length comes from Moon placement", color: grahas.candra.primary },
  { index: 4, name: "Leo", iast: "Siṃha", devanagari: "सिंह", lord: "surya", occupant: "mangala", aspectCue: "makes authority visible", durationCue: "length comes from Sun placement", color: grahas.surya.primary },
  { index: 5, name: "Virgo", iast: "Kanyā", devanagari: "कन्या", lord: "budha", occupant: "shukra", aspectCue: "refines practical outcomes", durationCue: "length comes from Mercury placement", color: grahas.budha.primary },
  { index: 6, name: "Libra", iast: "Tulā", devanagari: "तुला", lord: "shukra", occupant: "shani", aspectCue: "tests balance and agreement", durationCue: "length comes from Venus placement", color: grahas.shukra.primary },
  { index: 7, name: "Scorpio", iast: "Vṛścika", devanagari: "वृश्चिक", lord: "mangala", occupant: "ketu", aspectCue: "deepens hidden transformations", durationCue: "length comes from Mars placement", color: grahas.mangala.primary },
  { index: 8, name: "Sagittarius", iast: "Dhanus", devanagari: "धनुस्", lord: "guru", occupant: "rahu", aspectCue: "stretches doctrine and direction", durationCue: "length comes from Jupiter placement", color: grahas.guru.primary },
  { index: 9, name: "Capricorn", iast: "Makara", devanagari: "मकर", lord: "shani", occupant: "mangala", aspectCue: "structures effort and duty", durationCue: "length comes from Saturn placement", color: grahas.shani.primary },
  { index: 10, name: "Aquarius", iast: "Kumbha", devanagari: "कुम्भ", lord: "shani", occupant: "guru", aspectCue: "extends collective networks", durationCue: "length comes from Saturn placement", color: grahas.shani.primary },
  { index: 11, name: "Pisces", iast: "Mīna", devanagari: "मीन", lord: "guru", occupant: "shukra", aspectCue: "dissolves into devotion", durationCue: "length comes from Jupiter placement", color: grahas.guru.primary },
];

export const VIMSHOTTARI_ARCHITECTURE = [
  { label: "Period-holder", value: "Planet", note: "Ketu, Venus, Sun..." },
  { label: "Cycle", value: "9 lords", note: "Seven planets plus nodes" },
  { label: "Length", value: "Fixed", note: "Traditional constants" },
  { label: "Total", value: "120 years", note: "Same in every chart" },
];

export const CARA_ARCHITECTURE = [
  { label: "Period-holder", value: "Sign", note: "Meṣa, Vṛṣabha..." },
  { label: "Cycle", value: "12 rāśis", note: "Signs, not planets" },
  { label: "Length", value: "Variable", note: "From sign-to-lord count" },
  { label: "Total", value: "~84-96 years", note: "Chart-dependent" },
];

export function getRashi(index: number) {
  return MECHANISM_RASHIS[((index % 12) + 12) % 12];
}

export function buildRashiSequence(startIndex: number) {
  return Array.from({ length: 12 }, (_, step) => getRashi(startIndex + step));
}
