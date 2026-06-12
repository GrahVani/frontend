import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type JaiminiOrientationSlug = "author" | "form" | "date" | "parallel" | "methods";
export type JaiminiMisreadSlug = "wrong-author" | "short-bphs" | "modern-text";

export interface JaiminiOrientationNode {
  slug: JaiminiOrientationSlug;
  label: string;
  iast: string;
  devanagari: string;
  headline: string;
  teaching: string;
  avoid: string;
  color: string;
}

export interface JaiminiMisread {
  slug: JaiminiMisreadSlug;
  claim: string;
  correction: string;
  anchor: JaiminiOrientationSlug;
}

export const JAIMINI_ORIENTATION_NODES: JaiminiOrientationNode[] = [
  {
    slug: "author",
    label: "Author",
    iast: "Jaimini Maharishi",
    devanagari: "जैमिनिः",
    headline: "Sage Jaimini is the attributed author of the Jaimini Sutras.",
    teaching: "Keep the one-to-one map clear: Jaimini to Jaiminisutra; Parashara to BPHS; Varahamihira and Lagadha are separate authorities.",
    avoid: "Do not credit the Jaimini Sutras to Parashara, Varahamihira, or Lagadha.",
    color: grahas.guru.primary,
  },
  {
    slug: "form",
    label: "Sutra form",
    iast: "Sutra, not shloka",
    devanagari: "सूत्रम्",
    headline: "The text is aphoristic and compressed.",
    teaching: "A sutra is a short rule-thread designed for expansion by teacher or commentary. Its terseness is the point.",
    avoid: "Do not read it as continuous metrical verse or as a self-explanatory table.",
    color: grahas.budha.primary,
  },
  {
    slug: "date",
    label: "Dating",
    iast: "Classical period",
    devanagari: "कालः",
    headline: "Traditional dating places the text around the 2nd-3rd century CE.",
    teaching: "Modern teachers explain the text; they did not author it. Lagadha belongs to a much earlier Vedic timekeeping layer.",
    avoid: "Do not push Jaimini into the modern era or all the way back to Vedanga Jyotisha.",
    color: grahas.surya.primary,
  },
  {
    slug: "parallel",
    label: "Relation",
    iast: "Parallel to Parashari",
    devanagari: "सम्प्रदायः",
    headline: "Jaimini and Parashari are distinct yet contemporaneous-classical.",
    teaching: "The two streams read the same sky through different machinery. Distinct does not mean superior or inferior.",
    avoid: "Do not call Jaimini a shorter BPHS or a derivative shortcut.",
    color: grahas.shani.primary,
  },
  {
    slug: "methods",
    label: "Signatures",
    iast: "Rashi dasha, karakas, argala, arudha",
    devanagari: "लक्षणानि",
    headline: "Jaimini has recognizable methodological signatures.",
    teaching: "Later lessons unpack sign-based dashas, movable karakas, argala, and arudha padas.",
    avoid: "Do not import Parashari rules as if they were Jaimini rules.",
    color: grahas.mangala.primary,
  },
];

export const JAIMINI_MISREADS: JaiminiMisread[] = [
  {
    slug: "wrong-author",
    claim: "Jaimini Sutras were written by Parashara or Varahamihira.",
    correction: "No. The foundational text is attributed to Sage Jaimini; the other authors have their own texts.",
    anchor: "author",
  },
  {
    slug: "short-bphs",
    claim: "Jaimini is just BPHS written more briefly.",
    correction: "No. Its brevity is sutra form; its content is a distinct system.",
    anchor: "parallel",
  },
  {
    slug: "modern-text",
    claim: "Jaimini is a modern reconstruction by Raman, Rath, or Rao.",
    correction: "No. Those are modern commentators on a classical text.",
    anchor: "date",
  },
];

export function getJaiminiOrientationNode(slug: JaiminiOrientationSlug) {
  return JAIMINI_ORIENTATION_NODES.find((node) => node.slug === slug) ?? JAIMINI_ORIENTATION_NODES[0];
}
