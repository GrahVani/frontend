/**
 * Three-Lineage Comparison Chart Analyzer — static data.
 *
 * Three lineage approaches applied to the same demonstration chart
 * per Lesson 1.4.3 §4.2–4.4.
 */

export interface LineageApproach {
  slug: string;
  name: string;
  shortName: string;
  color: string;
  colorDeep: string;
  lineageContext: string;
  chartConventions: string[];
  primaryLens: string;
  analyticalDetails: {
    title: string;
    items: string[];
  }[];
  predictiveJudgments: {
    area: string;
    judgment: string;
  }[];
  crossReferences: string[];
  remedialDefaults: string;
}

export const APPROACHES: LineageApproach[] = [
  {
    slug: "tamil-nadu-kp",
    name: "Tamil Nadu KP Teaching Lineage",
    shortName: "KP",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
    lineageContext: "Descends from K.S. Krishnamurti's direct-disciples + second-generation teachers. This example follows the K.M. Subramaniam school commentary tradition + K. Hariharan textbook methodology — the most-widely-engaged KP teaching approach in modern global practice.",
    chartConventions: [
      "Sidereal zodiac (Vedic) with Lahiri ayanamsha",
      "Placidus house cusps (KP-distinctive — different from Parāśari whole-sign or equal-house systems)",
      "Ruling Planets (RP) set computed for the chart-cast moment",
    ],
    primaryLens: "Sub-lord and CSL (Cuspal Sub-Lord) methodology — each degree falls within a specific sub-lord; each house cusp has a sub-lord; the CSL of each house determines outcomes for that house's matters.",
    analyticalDetails: [
      {
        title: "Stellar centre-of-gravity",
        items: [
          "Planet → star → sub hierarchy operates throughout",
          "Each planet's analysis flows from its own significations → nakṣatra dispositor's significations → sub-lord's significations",
        ],
      },
      {
        title: "KP-distinctive analytical moves",
        items: [
          "Marriage: 7th-cusp-CSL primary; 2nd-cusp-CSL (family) + 11th-cusp-CSL (fulfilment) cross-check",
          "Career: 10th-cusp-CSL + 6th-cusp-CSL (employment vs business) + 7th-cusp-CSL (partnerships) + 11th-cusp-CSL (income)",
          "Event timing: Vimśottarī daśā with stellar (nakṣatra-and-sub-lord) refinement + Ruling Planets at query moment + transit reinforcement",
        ],
      },
    ],
    predictiveJudgments: [
      { area: "Marriage prospects", judgment: "7th-cusp-CSL analysis flags difficulty. Jupiter-debilitated-in-7th — which Parāśari weights heavily — is secondary in KP; what matters is what sub-lord the 7th cusp falls within." },
      { area: "Career trajectory", judgment: "10th-cusp-CSL + supporting cusp-CSLs determine outcome. 10th-lord-Mars-in-9th (dharma-aligned career per Parāśari) is secondary in KP." },
      { area: "Event timing", judgment: "KP's signature strength — stellar refinement + Ruling Planets + transit reinforcement produces precise timing." },
    ],
    crossReferences: [
      "K.S. Krishnamurti's KP Reader I-VI (foundational)",
      "K.M. Subramaniam commentary corpus",
      "K. Hariharan textbooks (KP Astro Publications)",
      "KP horary 1-249 system for specific questions",
    ],
    remedialDefaults: "KP-tradition gemstone + mantra + ritual prescriptions per CSL analysis findings; focused on CSL-significator-strengthening; less elaborate than Lal Kitab 108-remedies.",
  },
  {
    slug: "bvb-delhi",
    name: "BVB Delhi Parāśari + Jaiminī Revival",
    shortName: "BVB",
    color: "#C8412E",
    colorDeep: "#7A2A14",
    lineageContext: "Descends from K.N. Rao's leadership of the Bharatiya Vidya Bhavan Vedic-astrology faculty. Classical Parāśari foundational analysis + substantial Jaiminī revival cross-references.",
    chartConventions: [
      "Sidereal zodiac with Lahiri ayanamsha",
      "Whole-sign house system (Parāśari standard) — each rāśi = one bhāva",
      "Vargas (divisional charts) per BPHS standard — D-1 (rāśi), D-9 (Navāmśa), D-10 (Daśāmśa), D-7 (Saptāmśa), etc.",
      "Cara kārakas computed per Jaiminī methodology (planetary degrees in descending order)",
    ],
    primaryLens: "Graha-bhāva-varga + Vimśottarī daśā + Jaiminī cross-references — classical Parāśari foundational layer with Jaiminī revival analytical overlay.",
    analyticalDetails: [
      {
        title: "Parāśari foundational layer",
        items: [
          "Graha analysis: dignity (own/exalted/debilitated/friendly/neutral/inimical), placement bhāva, lordships, aspects",
          "Bhāva analysis: lord's placement and dignity, occupying planets, aspecting planets, bhāva significations",
          "Yoga analysis: named configurations per Saravali + Phaladīpikā + Jātaka Pārijāta catalogue",
          "Vimśottarī daśā: starting lord from Moon's nakṣatra (Puṣya = Saturn mahā-daśā at birth)",
          "Varga reinforcement: D-9 for marriage, D-10 for career — cross-referenced against rāśi-strength",
        ],
      },
      {
        title: "Jaiminī revival cross-reference layer",
        items: [
          "Cara kāraka: Saturn at 29°50' = highest degree → Ātma Kāraka (AK) = Saturn",
          "Ārūḍha lagna: computed from lagna-to-lagna-lord distance projected forward — image-of-self-in-the-world",
          "Cara daśā: rāśi-based periods providing additional time-cycle layer alongside Vimśottarī",
          "Jaiminī rāśi-aspects: cara/sthira/dvisvabhāva aspect graph different from Parāśari graha-aspects",
        ],
      },
    ],
    predictiveJudgments: [
      { area: "Marriage prospects", judgment: "Saturn-7th-lord-in-6th + Jupiter-debilitated-in-7th-house = substantial marriage-challenge configuration. AK-Saturn adds delayed-then-stabilised relationship pattern." },
      { area: "Career trajectory", judgment: "10th-lord-Mars-in-9th = strong career-and-dharma alignment. AK-Saturn supports long-term + structured + responsibility-oriented trajectory." },
      { area: "Event timing", judgment: "Vimśottarī mahā-daśā/antar-daśā/pratyantar-daśā primary + Cara daśā secondary cross-reference. Convergent timings strengthen confidence; divergent timings indicate complexity." },
    ],
    crossReferences: [
      "BPHS + Bṛhat Jātaka + Saravali + Phaladīpikā + Jātaka Pārijāta (classical Parāśari corpus)",
      "Jaiminī Sūtra + K.N. Rao's BVB-published Jaiminī revival works",
    ],
    remedialDefaults: "Classical Parāśari śānti (mantras, yantras, gemstones per findings) + Jaiminī AK-strengthening practices; BVB-tradition emphasis on practical-and-empirically-tested remedies.",
  },
  {
    slug: "western-vedic-fusion",
    name: "Western-Vedic-fusion (SJC/AIVS-style)",
    shortName: "Western",
    color: "#3A8C5A",
    colorDeep: "#2A6A40",
    lineageContext: "Western-Vedic-fusion lineages emphasise English-medium teaching with substantial Western-cultural-context-accessibility framing. Combined SJC Parāśari + Jaiminī revival + AIVS broader-Vedic-tradition-integration approach.",
    chartConventions: [
      "Sidereal zodiac with Lahiri ayanamsha (or selective alternative ayanamshas per teacher)",
      "Whole-sign house system (Parāśari standard) — same as BVB Delhi",
      "Cara kārakas computed per Jaiminī methodology",
      "Cross-cultural framing applied for non-Indian-cultural-context accessibility",
    ],
    primaryLens: "Parāśari foundations + substantial Jaiminī revival + broader Vedic-tradition integration (Āyurveda + Yoga + Vedic philosophy alongside astrology).",
    analyticalDetails: [
      {
        title: "Parāśari foundational (same as BVB, English-medium framing)",
        items: [
          "Same graha-bhāva-varga + Vimśottarī daśā analysis as BVB Delhi — Parāśari corpus is invariant across regional schools",
          "English-medium framing: concepts explained in cross-cultural-translation form (kāraka → 'significator'; doṣa → 'challenging configuration')",
          "Practical-applicability emphasis: findings framed as life-themes the practitioner can engage",
        ],
      },
      {
        title: "Jaiminī revival cross-reference (substantial — same as BVB)",
        items: [
          "Same Cara kāraka analysis identifying Saturn as AK",
          "Same Cara daśā analysis providing additional time-cycle layer",
          "Same ārūḍha + rāśi-aspect cross-references as BVB Delhi",
        ],
      },
      {
        title: "Distinctive Western-Vedic-fusion contributions",
        items: [
          "Āyurvedic prakṛti correlation: chart-based doṣa (vāta/pitta/kapha) assessment + dietary/lifestyle recommendations",
          "Yoga-tradition correlation: chart-based recommendations for āsana + prāṇāyāma + meditation styles",
          "Vedic philosophy integration: interpretations framed within dharma + karma + mokṣa framework",
          "Cross-cultural-context translation bridging Indian-cultural-context and Western-cultural-context accessibility",
        ],
      },
    ],
    predictiveJudgments: [
      { area: "Marriage prospects", judgment: "Same Parāśari + Jaiminī foundational analysis as BVB (substantial marriage-challenge). Adds psychological-developmental framing — challenges as opportunities for personal-development and inner-work." },
      { area: "Career trajectory", judgment: "Same Parāśari + Jaiminī foundational analysis. Adds life-purpose-and-dharma-integration framing — career as expression of life-purpose aligned with dharma." },
      { area: "Event timing", judgment: "Same Vimśottarī + Cara daśā as BVB. May add Āyurvedic seasonal-and-doṣa cycles as additional context." },
    ],
    crossReferences: [
      "BPHS + Bṛhat Jātaka (English translations — Santhanam 1996 + Bhat 1981)",
      "Jaiminī Sūtra (Rath 2015, Sagittarius Publications)",
      "Defouw-Svoboda Light on Life + David Frawley AIVS materials + Sanjay Rath SJC course materials",
      "Āyurveda primaries + Yoga-tradition primaries cross-references",
    ],
    remedialDefaults: "Classical Parāśari śānti + Jaiminī ārūḍha-strengthening + Āyurvedic dietary-and-lifestyle integration + yoga-practice integration + meditation-and-spiritual-practice recommendations. Broader than astrology-only.",
  },
];

export const CONVERGENCE_FINDINGS = [
  { theme: "Marriage-challenge", kp: "7th-cusp-CSL flags difficulty", bvb: "Saturn-7th-lord-in-6th + Jupiter-debilitated-7th", western: "Same Parāśari + Jaiminī foundational as BVB" },
  { theme: "Strong career-and-dharma alignment", kp: "10th-cusp-CSL (assuming sub-lord supports)", bvb: "10th-lord Mars in 9th = strong alignment", western: "Same Parāśari foundational analysis" },
  { theme: "Strong lagna foundation", kp: "Lagna-strength via lagna-cusp-CSL", bvb: "Moon-own-sign-in-1st = strong lagna", western: "Same Parāśari foundational analysis" },
];

export const DIVERGENCE_DIMENSIONS = [
  { dimension: "Primary analytical lens", kp: "Sub-lord + CSL of house cusps", bvb: "Graha-bhāva-varga + Vimśottarī + Jaiminī cross-ref", western: "Same as BVB + broader Vedic-tradition integration" },
  { dimension: "Marriage-analysis methodology", kp: "7th-cusp-CSL primary; Jupiter-in-7th secondary", bvb: "Jupiter-7th + Saturn-7th-lord-in-6th + D-9 navāmśa", western: "Same as BVB + psychological-developmental framing" },
  { dimension: "Event-timing precision", kp: "Stellar centre + Ruling Planets + transit reinforcement", bvb: "Vimśottarī mahā/antar/pratyantar-daśā + Cara daśā", western: "Same as BVB + Āyurvedic seasonal cycles" },
  { dimension: "Remedial defaults", kp: "KP gemstone + mantra + CSL-significator-strengthening", bvb: "Parāśari śānti + Jaiminī AK-strengthening", western: "Parāśari + Jaiminī + Āyurveda + Yoga + meditation" },
  { dimension: "Cultural framing", kp: "Tamil Nadu cultural-religious context", bvb: "North Indian Hindu-tradition context", western: "Cross-cultural translation for Western accessibility" },
];

export const UNIQUE_CONTRIBUTIONS = [
  { lineage: "Tamil Nadu KP", contribution: "Event-timing precision via sub-lord + CSL + Ruling Planets unmatched by others; KP horary capability (1-249); stellar (nakṣatra-and-sub-lord) centre-of-gravity detail." },
  { lineage: "BVB Delhi", contribution: "Deepest classical Parāśari foundational engagement (BPHS + Bṛhat Jātaka + medieval codifiers); substantial Jaiminī revival (cara kāraka + ārūḍha + Cara daśā + Jaiminī yogas); practical-empirical emphasis via K.N. Rao's tradition." },
  { lineage: "Western-Vedic-fusion", contribution: "Cross-cultural-context translation for non-Indian learners; broader Vedic-tradition integration (Āyurveda + Yoga + Vedic philosophy); psychological-developmental framing; English-medium global accessibility." },
];
