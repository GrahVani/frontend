export type CorpusTextKey =
  | "brihatSamhita"
  | "muhurtaCintamani"
  | "muhurtaMartanda"
  | "horaRatnam"
  | "vyavaharaKalaNirnaya"
  | "regionalPanchanga"
  | "modernExposition";

export type CorpusLayerKey = "all" | "attestation" | "standalone" | "civil" | "operational" | "modern";

export interface CorpusLayer {
  key: CorpusLayerKey;
  label: string;
  note: string;
}

export interface CorpusText {
  key: CorpusTextKey;
  shortLabel: string;
  title: string;
  devanagari: string;
  author: string;
  period: string;
  layer: Exclude<CorpusLayerKey, "all">;
  role: string;
  contribution: string;
  recommendedUse: string;
  attributionGuard: string;
  sequenceStep: number;
}

export interface PracticeCase {
  label: string;
  prompt: string;
  answer: string;
}

export const CORPUS_LAYERS: CorpusLayer[] = [
  {
    key: "all",
    label: "All layers",
    note: "See the whole muhūrta source stack.",
  },
  {
    key: "attestation",
    label: "Early attestation",
    note: "Where muhūrta is classically witnessed before stand-alone manuals.",
  },
  {
    key: "standalone",
    label: "Stand-alone manuals",
    note: "The mature textbook layer for event rules and method.",
  },
  {
    key: "civil",
    label: "Civil timing",
    note: "Dharmaśāstra application for social and legal action.",
  },
  {
    key: "operational",
    label: "Pañcāṅga practice",
    note: "Daily computation traditions used by working practitioners.",
  },
  {
    key: "modern",
    label: "Modern exposition",
    note: "Pedagogical access, not a substitute for primary sources.",
  },
];

export const CORPUS_TEXTS: CorpusText[] = [
  {
    key: "brihatSamhita",
    shortLabel: "BS",
    title: "Bṛhat Saṁhitā, Adhyāya 99",
    devanagari: "बृहत्संहिता",
    author: "Varāhamihira",
    period: "6th c. CE",
    layer: "attestation",
    role: "Foundational pre-stand-alone attestation",
    contribution: "Shows muhūrta as a jyotiṣa domain before the later dedicated manuals.",
    recommendedUse: "Read with Bhat translation as an early root and cross-check for classical grounding.",
    attributionGuard: "Do not treat later manual detail as if every refinement is already explicit here.",
    sequenceStep: 1,
  },
  {
    key: "muhurtaCintamani",
    shortLabel: "MC",
    title: "Muhūrta-Cintāmaṇi",
    devanagari: "मुहूर्तचिन्तामणि",
    author: "Rāma Daivajña",
    period: "16th c. CE",
    layer: "standalone",
    role: "Reference-standard stand-alone text",
    contribution: "Gives the comprehensive 24-chapter spine for pañcāṅga, event rules, and integrated method.",
    recommendedUse: "Make this the main long-term study text, commonly through Sharma's translation.",
    attributionGuard: "Separate MC source content from translator notes or modern commentary additions.",
    sequenceStep: 2,
  },
  {
    key: "muhurtaMartanda",
    shortLabel: "MM",
    title: "Muhūrta-Mārtaṇḍa",
    devanagari: "मुहूर्तमार्तण्ड",
    author: "Nārāyaṇa Daivajña",
    period: "16th c. CE",
    layer: "standalone",
    role: "Companion stand-alone treatment",
    contribution: "Triangulates the same discipline through a complementary classical manual.",
    recommendedUse: "Use after MC foundations to notice variant emphases without flattening them.",
    attributionGuard: "Do not merge MC and MM as one undifferentiated rule-source.",
    sequenceStep: 3,
  },
  {
    key: "horaRatnam",
    shortLabel: "HR",
    title: "Hora-Ratnam",
    devanagari: "होरारत्नम्",
    author: "Bāḷabhadra",
    period: "17th c. CE",
    layer: "standalone",
    role: "Tājika-adjacent extended treatment",
    contribution: "Adds stream breadth and shows muhūrta reasoning in a wider jyotiṣa environment.",
    recommendedUse: "Consult after MC and MM when comparing cross-stream style and extended applications.",
    attributionGuard: "Name the Tājika-adjacent context instead of citing it as generic muhūrta consensus.",
    sequenceStep: 4,
  },
  {
    key: "vyavaharaKalaNirnaya",
    shortLabel: "VKN",
    title: "Vyavahāra-Kāla-Nirṇaya",
    devanagari: "व्यवहारकालनिर्णय",
    author: "Dharmaśāstra tradition",
    period: "varied",
    layer: "civil",
    role: "Civil-action timing application",
    contribution: "Shows muhūrta applied to social, legal, and practical action within dharmaśāstra concerns.",
    recommendedUse: "Use for application breadth when timing civil or social undertakings.",
    attributionGuard: "Do not cite civil-action handling as though it were identical to wedding or ritual rules.",
    sequenceStep: 5,
  },
  {
    key: "regionalPanchanga",
    shortLabel: "PK",
    title: "Regional pañcāṅga traditions",
    devanagari: "पञ्चाङ्गपरम्परा",
    author: "Drik, Vakya, Tamil, Bengali, and related lineages",
    period: "continuous",
    layer: "operational",
    role: "Operational daily computation",
    contribution: "Supplies the actual limb values, local convention, and calendar basis used in practice.",
    recommendedUse: "Name the computational tradition when results differ by ayanāṁśa or method.",
    attributionGuard: "Do not mistake computational variance for classical-tradition contradiction.",
    sequenceStep: 6,
  },
  {
    key: "modernExposition",
    shortLabel: "ME",
    title: "Modern practitioner exposition",
    devanagari: "आधुनिकव्याख्या",
    author: "B.V. Raman, K.N. Rao, Defouw/Svoboda, and others",
    period: "20th-21st c.",
    layer: "modern",
    role: "Pedagogical access and synthesis",
    contribution: "Makes the classical corpus teachable for modern learners and working consultations.",
    recommendedUse: "Use as a guide while verifying classical-source claims against primary texts.",
    attributionGuard: "Do not substitute modern exposition for classical source engagement.",
    sequenceStep: 7,
  },
];

export const PRACTICE_CASES: PracticeCase[] = [
  {
    label: "A rule from Raman",
    prompt: "You learned a wedding rule in Raman's Muhurtha.",
    answer: "Cite Raman as modern exposition, then verify whether MC or Bṛhat Saṁhitā also carries the rule.",
  },
  {
    label: "Different pañcāṅgas",
    prompt: "Drik and Vakya give slightly different windows.",
    answer: "Call it computational-tradition variance, name both values when it affects the recommendation.",
  },
  {
    label: "Advanced reading",
    prompt: "You want Hora-Ratnam before mastering MC.",
    answer: "Use it as breadth, but keep MC as the reference-standard spine until the basics are fluent.",
  },
];

export function findCorpusText(key: CorpusTextKey): CorpusText {
  return CORPUS_TEXTS.find((text) => text.key === key) ?? CORPUS_TEXTS[0];
}

export function textsForLayer(layer: CorpusLayerKey): CorpusText[] {
  if (layer === "all") return CORPUS_TEXTS;
  return CORPUS_TEXTS.filter((text) => text.layer === layer);
}
