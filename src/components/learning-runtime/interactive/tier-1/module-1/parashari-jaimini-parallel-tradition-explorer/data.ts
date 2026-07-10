/**
 * Parāśari ⇄ Jaiminī Parallel-Tradition Explorer — static data for L2.5 §4.
 *
 * Two traditions, structurally parallel, doctrinally complementary.
 * Side-by-side comparison across four layers + sūtra-vs-verse style +
 * the five distinctive Jaiminī contributions.
 */

export interface TraditionLayer {
  slug: string;
  label: string;
  parashari: { authors: string[]; signature: string };
  jaimini: { authors: string[]; signature: string };
}

export const TRADITION_LAYERS: TraditionLayer[] = [
  {
    slug: "foundational",
    label: "Foundational ṛṣi-core",
    parashari: {
      authors: ["Maharṣi Parāśara"],
      signature: "BPHS — encyclopaedic-verse natal foundation",
    },
    jaimini: {
      authors: ["Maharṣi Jaiminī"],
      signature: "Jaiminī Sūtra (Upadeśa Sūtra) — sūtra-style natal foundation",
    },
  },
  {
    slug: "systematic-codifier",
    label: "Systematic codifier (date-anchor)",
    parashari: {
      authors: ["Varāhamihira (505-587 CE)"],
      signature: "Bṛhat Jātaka — secure 6th-c. CE dating; three-skandha-spanning",
    },
    jaimini: {
      authors: ["No single secure-dated codifier"],
      signature: "Jaiminī tradition lacks a Varāhamihira-equivalent; this is a structural asymmetry the tradition compensates for via robust commentary literature",
    },
  },
  {
    slug: "medieval-codifiers",
    label: "Medieval codifiers (synthesis layer)",
    parashari: {
      authors: ["Kalyāṇavarmā", "Mantreśvara", "Vaidyanātha Dīkṣita", "Nīlakaṇṭha"],
      signature: "7th-16th c. CE codifiers refining the Parāśara foundation",
    },
    jaimini: {
      authors: ["Nīlakaṇṭha (Jaiminī Sutramṛta)", "Somanātha (Kalpalatā)"],
      signature: "Medieval commentary tradition — unpacking the terse sūtras into operationally-interpretable prose",
    },
  },
  {
    slug: "modern-revival",
    label: "Modern revival",
    parashari: {
      authors: ["Santhanam, Bhat, Sharma (translator-editors, 20th c.)"],
      signature: "20th-c. translation + commentary work bringing classical Parāśari into modern accessibility",
    },
    jaimini: {
      authors: ["Sanjay Rath (SJC)", "K.N. Rao (BVB)", "Iranganti Rangacharya"],
      signature: "Late-20th and early-21st c. revival — bringing Jaiminī material back into mainstream practice after centuries of relative neglect",
    },
  },
];

/** Sūtra-style vs encyclopaedic-verse comparison. */
export const GENRE_COMPARISON = {
  jaimini: {
    label: "Sūtra-style",
    sanskrit: "सूत्र-शैली",
    description:
      "Terse aphorisms — typically 5-15 Sanskrit words compressed into the minimum-words form. Six classical characteristics: alpākṣaram (minimal syllables), asaṁdigdham (unambiguous within tradition), sāravat (essence-laden), viśvatomukham (universally applicable), astobham (without redundancy), anavadyam (without flaw). REQUIRES bhāṣya commentary to unpack — designed for guru-śiṣya oral transmission with detailed exegesis.",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
    examples: "Pāṇini Aṣṭādhyāyī, Yoga Sūtra of Patañjali, Pūrva-Mīmāṁsā Sūtra — same genre family",
  },
  parashari: {
    label: "Encyclopaedic-verse",
    sanskrit: "श्लोक-शैली",
    description:
      "Self-contained verses, typically in anuṣṭubh meter (32 syllables across 4 quarter-pādas), each a doctrinal statement readable individually. Trades terseness for accessibility — verses are internally interpretable WITHOUT commentary, though commentary aids depth. Broadly-teachable systematic exposition.",
    color: "#9C7A2F",
    colorDeep: "#7A5E1E",
    examples: "BPHS, Bṛhat Jātaka, Saravali, Phaladīpikā — all share this genre",
  },
};

/** Five distinctive Jaiminī doctrinal contributions. */
export interface DoctrineDistinctive {
  slug: string;
  jaiminiTerm: string;
  jaiminiDevanagari: string;
  parashariCounterpart: string;
  description: string;
  operationalNote: string;
}

export const JAIMINI_DOCTRINES: DoctrineDistinctive[] = [
  {
    slug: "cara-rashi-dasha",
    jaiminiTerm: "Cara / Sthira Rāśi Daśās",
    jaiminiDevanagari: "चर / स्थिर राशि दशा",
    parashariCounterpart: "Vimśottarī (nakṣatra-based)",
    description:
      "Rāśi-based time-cycle systems — daśās computed from rāśi-positions and rāśi-aspects rather than nakṣatra-lord assignments. Cara daśā is the most-cited; Sthira and other conditional rāśi-daśās activate under specific chart conditions.",
    operationalNote:
      "Parāśari uses Vimśottarī's nakṣatra-lord-from-Moon (120-year cycle assigned by Moon's nakṣatra). Jaiminī uses rāśi-based cycles — different time-engine entirely. Modern practice draws on BOTH, with practitioners choosing which time-engine suits which predictive question.",
  },
  {
    slug: "arudha-lagna",
    jaiminiTerm: "Ārūḍha Lagna",
    jaiminiDevanagari: "आरूढ लग्न",
    parashariCounterpart: "(no direct equivalent in Parāśari)",
    description:
      "The \"image-of-self\" projection — computed from the lagna and its lord. Reflects how the native is PERCEIVED by the world, distinct from how the lagna itself indicates the native's actual constitution and life-direction.",
    operationalNote:
      "Uniquely Jaiminī. Parāśari has no direct equivalent — the closest Parāśari analogue is the bhāva-arudha pattern but it appears as a derivative rather than a foundational interpretive lens. Modern practice draws on ārūḍha for reputation / public-image questions.",
  },
  {
    slug: "rashi-aspects",
    jaiminiTerm: "Jaiminī Rāśi-Aspects",
    jaiminiDevanagari: "जैमिनि राशि-दृष्टि",
    parashariCounterpart: "Graha-aspects (Parāśarī)",
    description:
      "Rāśis (signs) cast aspects on other rāśis based on movability-classification — cara rāśis aspect sthira rāśis (and vice-versa) at specific angular distances. Fundamentally different aspect logic from Parāśari graha-aspects.",
    operationalNote:
      "Parāśari graha-dṛṣṭi is GRAHA-based (Mars aspects the 4th, 7th, 8th from itself). Jaiminī rāśi-dṛṣṭi is SIGN-based (rāśis aspect rāśis by movability class). Different aspect-system entirely. Multi-stream synthesis uses both as complementary lenses.",
  },
  {
    slug: "cara-karakas",
    jaiminiTerm: "Cara Kārakas",
    jaiminiDevanagari: "चर कारक",
    parashariCounterpart: "Fixed naisargika kārakas (Parāśarī)",
    description:
      "Variable significators — kārakas (e.g., for mother, spouse, brother) computed from the grahas' degree-positions in the chart. The graha with the highest degrees becomes the Ātma-kāraka (significator of the soul); the next highest the Amātya-kāraka; and so on through 7 (or 8) levels.",
    operationalNote:
      "Parāśari kārakas are FIXED: Sun = soul/father, Moon = mother, Mars = brother, etc. Jaiminī cara kārakas are VARIABLE per chart based on degrees. The Ātma-kāraka in particular is a uniquely Jaiminī interpretive lens with no direct Parāśari equivalent.",
  },
  {
    slug: "jaimini-yogas",
    jaiminiTerm: "Jaiminī Yogas",
    jaiminiDevanagari: "जैमिनि योग",
    parashariCounterpart: "Pañcamahāpuruṣa + Rāja yogas (Parāśarī)",
    description:
      "Distinctive yoga catalogue derived from rāśi-aspect logic and cara-kāraka positions. Includes yogas not present in BPHS / Bṛhat Jātaka — distinct interpretive lens for specific life-area indications.",
    operationalNote:
      "Parāśari yogas are graha-position-based (Mars in a kendra + own-sign = Ruchaka, etc.). Jaiminī yogas are rāśi-aspect-and-kāraka-based. Modern practice often consults both yoga catalogues for the same chart.",
  },
];

/** Cross-text identity question — same Jaiminī or different? */
export const IDENTITY_QUESTION = {
  question: "Is the Jaiminī of Jyotiṣa the same as the Jaiminī of Pūrva-Mīmāṁsā?",
  framing:
    "Maharṣi Jaiminī appears as the author of two foundational classical Sanskrit works: (1) the Jaiminī Sūtra of Jyotiṣa, and (2) the Pūrva-Mīmāṁsā Sūtra — the foundational text of one of the six classical Indian philosophical systems. Tradition treats these as the same Jaiminī (Vyāsa's disciple); academic-Indology scholarship treats the same-author question as unresolved, with some scholars arguing single authorship and others arguing two different authors of the same name. The curriculum's framing: hold the question open, cite both texts as Jaiminī-attributed, acknowledge the academic uncertainty.",
};

export const FRAMEWORK_SUMMARY = {
  headline: "Two traditions, parallel not subordinate.",
  body: "Parāśari and Jaiminī run alongside each other throughout classical Jyotiṣa history. They are STRUCTURALLY PARALLEL at the foundational and codifier layers; they are DOCTRINALLY COMPLEMENTARY (graha-level vs rāśi-level; nakṣatra-cycles vs rāśi-cycles; fixed significators vs variable). Neither subordinates the other — both honoured per the multi-stream-honesty doctrine. Serious modern practice draws from both, recognising each as a legitimate classical lineage with its own foundational ṛṣi, its own canonical text, its own commentary tradition, and its own distinctive interpretive contributions.",
};
