import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type SutraLayerSlug = "surface" | "code" | "commentary" | "plurality" | "contrast";
export type CommentarySlug = "raman" | "rath" | "rao";

export interface SutraLayer {
  slug: SutraLayerSlug;
  label: string;
  iast: string;
  devanagari: string;
  headline: string;
  teaching: string;
  caution: string;
  color: string;
}

export interface CommentaryReading {
  slug: CommentarySlug;
  label: string;
  lineage: string;
  emphasis: string;
  sampleReading: string;
  color: string;
}

export const SUTRA_LAYERS: SutraLayer[] = [
  {
    slug: "surface",
    label: "Surface",
    iast: "Sutra surface",
    devanagari: "सूत्रम्",
    headline: "A few syllables carry the mnemonic thread.",
    teaching: "The visible text is intentionally terse: no worked example, few connectives, and many supplied assumptions.",
    caution: "Do not treat the bare line as a self-contained finished paragraph.",
    color: grahas.guru.primary,
  },
  {
    slug: "code",
    label: "Code",
    iast: "Katapayadi / akshara",
    devanagari: "अक्षर-सङ्ख्या",
    headline: "Some syllables function as number or sign pointers.",
    teaching: "A commentary may flag a syllable as a letter-number code, turning sound into a count, sign, pada, or year value.",
    caution: "Do not decide alone which syllables are ordinary words and which are coded numbers.",
    color: grahas.budha.primary,
  },
  {
    slug: "commentary",
    label: "Commentary",
    iast: "Bhashya / tika",
    devanagari: "व्याख्या",
    headline: "The commentary supplies omitted scope and conditions.",
    teaching: "A tradition-trained reading tells you the reference point, rule boundary, and cross-sutra context.",
    caution: "Do not decode without naming the commentary or teacher-line you follow.",
    color: grahas.surya.primary,
  },
  {
    slug: "plurality",
    label: "Plurality",
    iast: "Disciplined plurality",
    devanagari: "बहुव्याख्या",
    headline: "More than one defensible decoding can exist.",
    teaching: "Interpretive plurality is constrained by commentary, neighbouring sutras, and system logic. It is not arbitrary.",
    caution: "Do not flatten plurality into false certainty or inflate it into anything-goes.",
    color: grahas.shani.primary,
  },
  {
    slug: "contrast",
    label: "BPHS contrast",
    iast: "Sutra vs shloka",
    devanagari: "सूत्र-श्लोक",
    headline: "Sutra style trades surface clarity for density.",
    teaching: "BPHS verse often says more on the surface; Jaimini sutra preserves portability through compression.",
    caution: "Do not expect a Jaimini sutra to read like a discursive BPHS verse.",
    color: grahas.mangala.primary,
  },
];

export const COMMENTARY_READINGS: CommentaryReading[] = [
  {
    slug: "raman",
    label: "Raman",
    lineage: "B. V. Raman reading",
    emphasis: "Clear English exposition and practical synthesis.",
    sampleReading: "The coded value is read after the commentary fixes the counting frame.",
    color: grahas.guru.primary,
  },
  {
    slug: "rath",
    label: "Rath",
    lineage: "Sanjay Rath reading",
    emphasis: "Lineage-specific unpacking of terse source language.",
    sampleReading: "The same compression may be opened through a different traditional scope.",
    color: grahas.budha.primary,
  },
  {
    slug: "rao",
    label: "Rao",
    lineage: "K. N. Rao / school reading",
    emphasis: "Pedagogical cross-checking through worked interpretive practice.",
    sampleReading: "A reading is stated as a school-guided decoding, not as context-free syllables.",
    color: grahas.shani.primary,
  },
];

export function getSutraLayer(slug: SutraLayerSlug) {
  return SUTRA_LAYERS.find((layer) => layer.slug === slug) ?? SUTRA_LAYERS[0];
}

export function getCommentaryReading(slug: CommentarySlug) {
  return COMMENTARY_READINGS.find((reading) => reading.slug === slug) ?? COMMENTARY_READINGS[0];
}
