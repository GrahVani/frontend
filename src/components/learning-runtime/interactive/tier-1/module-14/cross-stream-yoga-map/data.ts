import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type YogaStreamSlug = "parashari" | "jaimini" | "kp" | "lal-kitab";

export interface YogaStreamConcept {
  slug: YogaStreamSlug;
  label: string;
  iast: string;
  devanagari: string;
  mechanism: string;
  combinationIdea: string;
  notThis: string;
  deepModule: string;
  tierOneAction: string;
  color: string;
}

export const YOGA_STREAMS: YogaStreamConcept[] = [
  {
    slug: "parashari",
    label: "Parashari",
    iast: "Parāśarī",
    devanagari: "पराशरी",
    mechanism: "Systematic named-yoga corpus",
    combinationIdea: "Raja, dhana, Pancha Mahapurusha, special yogas, Vipareeta, and dosha logic.",
    notThis: "Do not assume every stream uses named yoga catalogues.",
    deepModule: "This module",
    tierOneAction: "Use as the named-yoga core.",
    color: grahas.guru.primary,
  },
  {
    slug: "jaimini",
    label: "Jaimini",
    iast: "Jaimini",
    devanagari: "जैमिनि",
    mechanism: "Chara-karakas, Atmakaraka, Karaka-Kendradi, Argala",
    combinationIdea: "Raja-yoga-like results are read through karaka relationships and intervention patterns.",
    notThis: "Do not import Parashari kendra-trikona lord rules as if they were Jaimini rules.",
    deepModule: "Jaimini deep module",
    tierOneAction: "Recognise the machinery; do not practise it here.",
    color: grahas.surya.primary,
  },
  {
    slug: "kp",
    label: "KP",
    iast: "KP",
    devanagari: "के.पी.",
    mechanism: "Significator clusters and sub-lord judgement",
    combinationIdea: "Promise is judged through what planets signify, especially through the sub-lord.",
    notThis: "Do not hunt for a named raja-yoga catalogue in KP.",
    deepModule: "KP deep module",
    tierOneAction: "Name it as cluster logic, not named-yoga logic.",
    color: grahas.budha.primary,
  },
  {
    slug: "lal-kitab",
    label: "Lal Kitab",
    iast: "Lāl Kitāb",
    devanagari: "लाल किताब",
    mechanism: "Own yoga formulations plus rna karmic-debt framework",
    combinationIdea: "Combinations are read through Lal Kitab house/planet formulations and debt-remedy logic.",
    notThis: "Do not translate Lal Kitab combinations into Parashari yoga labels.",
    deepModule: "Lal Kitab deep module",
    tierOneAction: "Recognise its independent language and remedy orientation.",
    color: grahas.mangala.primary,
  },
];

export function getYogaStream(slug: YogaStreamSlug) {
  return YOGA_STREAMS.find((stream) => stream.slug === slug) ?? YOGA_STREAMS[0];
}
