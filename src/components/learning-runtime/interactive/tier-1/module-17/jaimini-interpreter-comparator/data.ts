import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type InterpreterSlug = "raman" | "rath" | "rao";
export type DivergenceSlug = "karaka-count" | "cara-dasha" | "arudha";

export interface JaiminiInterpreter {
  slug: InterpreterSlug;
  label: string;
  fullName: string;
  devanagari: string;
  signatureWork: string;
  emphasis: string;
  contribution: string;
  discipline: string;
  color: string;
}

export interface DivergencePoint {
  slug: DivergenceSlug;
  label: string;
  question: string;
  whyItMatters: string;
  raman: string;
  rath: string;
  rao: string;
}

export const JAIMINI_INTERPRETERS: JaiminiInterpreter[] = [
  {
    slug: "raman",
    label: "Raman",
    fullName: "B. V. Raman",
    devanagari: "रामन्",
    signatureWork: "Studies in Jaimini Astrology",
    emphasis: "Foundational modern English study; classical-text-faithful exposition.",
    contribution: "He made the Jaimini territory readable for the modern English learner.",
    discipline: "Use Raman as a clear foundational map, and label his conventions when rules vary.",
    color: grahas.guru.primary,
  },
  {
    slug: "rath",
    label: "Rath",
    fullName: "Sanjay Rath",
    devanagari: "राठ",
    signatureWork: "SJC / PJC Jaimini teaching tradition",
    emphasis: "Comprehensive parampara-based teaching system with internally consistent conventions.",
    contribution: "He gives students a full curriculum and a lineage-framed method.",
    discipline: "Use Rath/SJC as a coherent framework; avoid silently mixing it with other variants.",
    color: grahas.budha.primary,
  },
  {
    slug: "rao",
    label: "Rao",
    fullName: "K. N. Rao",
    devanagari: "राव",
    signatureWork: "Predicting Through Jaimini's Cara Dasha",
    emphasis: "Empirical, case-based research focused on predictive reliability.",
    contribution: "He foregrounds tested cara-dasha application through documented charts.",
    discipline: "Use Rao when emphasizing case-tested timing, and name the computation variant.",
    color: grahas.shani.primary,
  },
];

export const JAIMINI_DIVERGENCES: DivergencePoint[] = [
  {
    slug: "karaka-count",
    label: "Cara-karaka count",
    question: "Seven karakas or eight?",
    whyItMatters: "The choice can change the Atmakaraka and therefore the reading center.",
    raman: "Typically taught through the seven-karaka convention.",
    rath: "Uses an eight-karaka convention including Rahu in the SJC/PJC framework.",
    rao: "Discusses karakas within his applied framework, with emphasis on predictive use.",
  },
  {
    slug: "cara-dasha",
    label: "Cara-dasha variant",
    question: "Which counting rule and exception set?",
    whyItMatters: "Two valid variants can produce different period sequences for the same chart.",
    raman: "Presents a foundational cara-dasha map for modern learners.",
    rath: "Teaches a lineage-specific variant within a complete Jaimini curriculum.",
    rao: "Foregrounds cara-dasha through empirical case testing.",
  },
  {
    slug: "arudha",
    label: "Arudha exceptions",
    question: "How are special landing cases handled?",
    whyItMatters: "Exception handling can shift the derived pada and change public-manifestation reading.",
    raman: "Gives the student a usable traditional outline.",
    rath: "Develops detailed pada conventions within his teaching lineage.",
    rao: "Uses practical handling in applied chart analysis.",
  },
];

export function getJaiminiInterpreter(slug: InterpreterSlug) {
  return JAIMINI_INTERPRETERS.find((interpreter) => interpreter.slug === slug) ?? JAIMINI_INTERPRETERS[0];
}

export function getJaiminiDivergence(slug: DivergenceSlug) {
  return JAIMINI_DIVERGENCES.find((point) => point.slug === slug) ?? JAIMINI_DIVERGENCES[0];
}
