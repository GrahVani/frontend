/**
 * Medieval Codifier Relative-Dating Explorer — static data for L2.4 §4.
 *
 * Four major medieval codifiers of the Parāśari tradition, each dated
 * RELATIVE TO Varāhamihira's 575 CE anchor via citation-network bracketing.
 * Dating uncertainty COMPOUNDS along the citation chain — Kalyāṇavarmā
 * (post-Varāhamihira only, ±100 yr) → Mantreśvara (post-both, ±300 yr) →
 * Vaidyanātha (post-three, ±50 yr because shorter chain to a 17th-c.
 * attestation) → Nīlakaṇṭha (post-three + Kerala-school references).
 *
 * Per L2.4 §4.1-§4.5.
 */

export interface MedievalCodifier {
  slug: string;
  author: string;
  authorDevanagari: string;
  text: string;
  textDevanagari: string;
  englishLabel: string;
  /** Bracketed dating range. */
  dateRange: string;
  /** Central year (academic best-estimate midpoint). */
  centralYear: number;
  /** Half-width of the dating bracket in years (uncertainty radius). */
  bracketYears: number;
  /** Distinctive contribution — what this codifier added beyond just transmitting. */
  contribution: string;
  /** Citation evidence: who they CITE (pre-them) and who CITES them (post-them). */
  citesAsPredecessor: string[];
  citedBy: string[];
  /** Full detail prose. */
  detail: string;
  /** Modern default edition. */
  defaultEdition: string;
  /** Curriculum cross-references. */
  curriculumCites: string;
  /** Stream/tradition affiliation color. */
  color: string;
  colorDeep: string;
}

export const MEDIEVAL_CODIFIERS: MedievalCodifier[] = [
  {
    slug: "kalyanavarma-saravali",
    author: "Kalyāṇavarmā",
    authorDevanagari: "कल्याणवर्मा",
    text: "Saravali",
    textDevanagari: "सारावली",
    englishLabel: "Essence Collection",
    dateRange: "~7th-9th century CE",
    centralYear: 800,
    bracketYears: 100,
    contribution: "Yoga-cataloguing emphasis — extensive enumeration of planetary combinations beyond what BPHS catalogues.",
    citesAsPredecessor: ["Varāhamihira (Bṛhat Jātaka, Bṛhat Saṁhitā)"],
    citedBy: ["Mantreśvara (Phaladīpikā)", "Vaidyanātha (Jātaka Pārijāta)", "9th-10th-c. astrological compilations"],
    detail:
      "Saravali (\"Essence Collection\") is a major post-Varāhamihira horā synthesis with a distinctive yoga-cataloguing emphasis. Kalyāṇavarmā extends and refines the yoga material from Bṛhat Jātaka, presenting hundreds of additional planetary combinations and their predicted results. Recension-stable across major editions. Dating: ~7th-9th c. CE — POST-Varāhamihira (he cites Varāhamihira); CITED BY 9th-10th-c. astrological compilations and later codifiers. Bracket ~±100 years; tighter than Mantreśvara because the citation chain to a dated anchor is shorter.",
    defaultEdition: "Santhanam, R. (1983), 2 vols, Ranjan Publications — ISBN 81-7110-088-6 / 089-4",
    curriculumCites: "T1-08 (Yogas — heavy citation for the extended yoga catalogue), T1-14 (Yoga Catalogue)",
    color: "#9C7A2F",
    colorDeep: "#7A5E1E",
  },
  {
    slug: "mantresvara-phaladipika",
    author: "Mantreśvara",
    authorDevanagari: "मन्त्रेश्वर",
    text: "Phaladīpikā",
    textDevanagari: "फलदीपिका",
    englishLabel: "The Lamp of Results",
    dateRange: "~12th-15th century CE",
    centralYear: 1350,
    bracketYears: 300,
    contribution: "Practitioner-oriented synthesis — compact, pedagogically structured selection from BPHS + Bṛhat Jātaka + Saravali. Designed for working astrologers, not encyclopaedic reference.",
    citesAsPredecessor: ["Varāhamihira (Bṛhat Jātaka)", "Kalyāṇavarmā (Saravali)", "BPHS (Parāśara)"],
    citedBy: ["Vaidyanātha (Jātaka Pārijāta)", "15th-c. and later authors"],
    detail:
      "Phaladīpikā (\"Lamp of Results\") is a compact practitioner-oriented horā synthesis. Where Saravali is encyclopaedic and BPHS is comprehensive-everything, Phaladīpikā is selective and pedagogical — designed for the working astrologer to learn from and apply. Distinctive features: systematic bhāva-results delineation, practical predictive procedures, selective integration of prior sources. Dating bracket: ~±300 years — wider than Kalyāṇavarmā because Mantreśvara is POST-Kalyāṇavarmā (whose own dating is already ±100 yr), so the uncertainty compounds.",
    defaultEdition: "Santhanam, R. (1991), Ranjan Publications",
    curriculumCites: "T1-09 (Bhāvas — heavy citation for practitioner-oriented bhāva delineation), T2 use-case modules",
    color: "#A23A1E",
    colorDeep: "#7A2A14",
  },
  {
    slug: "vaidyanatha-jataka-parijata",
    author: "Vaidyanātha Dīkṣita",
    authorDevanagari: "वैद्यनाथ दीक्षित",
    text: "Jātaka Pārijāta",
    textDevanagari: "जातकपारिजात",
    englishLabel: "The Wish-fulfilling Tree of Natal Astrology",
    dateRange: "~16th century CE",
    centralYear: 1550,
    bracketYears: 50,
    contribution: "Late-medieval comprehensive synthesis — integrates BPHS + Bṛhat Jātaka + Saravali + Phaladīpikā into one large compilation. End-state of medieval Parāśari codification.",
    citesAsPredecessor: ["Varāhamihira", "Kalyāṇavarmā", "Mantreśvara", "BPHS"],
    citedBy: ["17th-c. and later authors", "South Indian teaching lineages"],
    detail:
      "Jātaka Pārijāta (\"Wish-fulfilling Tree of Natal Astrology\") is the late-medieval comprehensive synthesis — Vaidyanātha integrates material from all four prior major sources into one large 18-chapter compilation. It represents the end-state of medieval Parāśari codification before the modern era. Particularly influential in South Indian teaching lineages. Dating: ~16th c. CE with ±50 yr bracket — tighter than Mantreśvara because the citation chain to a 17th-c. attestation is shorter.",
    defaultEdition: "Sharma, V. Subrahmanya (2003), 3 vols, Ranjan Publications",
    curriculumCites: "T1-08 (Yogas — extended catalogue), T1-14 (Yoga Catalogue), T2 advanced use-cases",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
  },
  {
    slug: "nilakantha-prasna-tantra",
    author: "Nīlakaṇṭha",
    authorDevanagari: "नीलकण्ठ",
    text: "Praśna Tantra",
    textDevanagari: "प्रश्नतन्त्र",
    englishLabel: "The Treatise on Questions",
    dateRange: "~16th century CE",
    centralYear: 1575,
    bracketYears: 50,
    contribution: "Praśna-tradition foundation — the medieval foundation that the 17th-c. Kerala school's Praśna Mārga later builds upon. Establishes praśna (horary) as a parallel discipline to natal chart-reading.",
    citesAsPredecessor: ["Varāhamihira", "earlier Praśna fragments", "BPHS"],
    citedBy: ["Praśna Mārga (17th c.)", "Kerala-school praśna teaching lineages"],
    detail:
      "Praśna Tantra (\"Treatise on Questions\") is the medieval foundational text for the praśna (horary) discipline. While natal chart-reading addresses lifelong questions, praśna addresses specific questions cast at the moment of inquiry. Nīlakaṇṭha's text establishes the praśna methodology that the 17th-c. Kerala school's Praśna Mārga later expands and refines. Dating: ~16th c. CE; CITED BY the 17th-c. Praśna Mārga which gives a tighter dating bracket than Mantreśvara's. ±50 yr.",
    defaultEdition: "Raman, B.V. (1988), UBSPD",
    curriculumCites: "T1-19 (Introduction to Praśna), T2-20 (Praśna Predictive Mastery)",
    color: "#3A8C5A",
    colorDeep: "#1F5A37",
  },
];

/** Three-layer Parāśari-tradition lineage structure. */
export interface LineageLayer {
  slug: string;
  label: string;
  description: string;
  members: string;
  color: string;
  colorDeep: string;
  authorityKind: string;
}

export const LINEAGE_LAYERS: LineageLayer[] = [
  {
    slug: "foundational-rsi",
    label: "Foundational ṛṣi-core",
    description:
      "The pre-classical Parāśara figure (per tradition) + the medieval-recensional BPHS we read — together the lineage-authoritative substrate.",
    members: "Maharṣi Parāśara · Bṛhat Parāśara Horā Śāstra",
    color: "#9C7A2F",
    colorDeep: "#7A5E1E",
    authorityKind: "Lineage authority",
  },
  {
    slug: "systematic-codifier",
    label: "Systematic codifier (date-anchor)",
    description:
      "The 6th-century historical scholar whose secure dating anchors all classical Jyotiṣa chronology — three-skandha-spanning.",
    members: "Varāhamihira · Bṛhat Jātaka + Bṛhat Saṁhitā + Pañcasiddhāntikā",
    color: "#A23A1E",
    colorDeep: "#7A2A14",
    authorityKind: "Evidence authority (astronomical anchor)",
  },
  {
    slug: "medieval-codifiers",
    label: "Medieval codifiers (synthesis layer)",
    description:
      "The 7th-16th c. CE refiners and synthesizers — each working from the Parāśara + Varāhamihira foundation, each contributing distinctive emphasis.",
    members: "Kalyāṇavarmā · Mantreśvara · Vaidyanātha Dīkṣita · Nīlakaṇṭha",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
    authorityKind: "Codifier authority (post-Varāhamihira citation network)",
  },
];

/** Compounding uncertainty along the citation chain. */
export interface UncertaintyBand {
  author: string;
  citationChainLength: string;
  uncertaintyBracket: string;
  description: string;
}

export const UNCERTAINTY_BANDS: UncertaintyBand[] = [
  {
    author: "Varāhamihira",
    citationChainLength: "Anchor (internally dateable)",
    uncertaintyBracket: "±30 years",
    description: "Astronomical-position evidence — Pañcasiddhāntikā internally dateable.",
  },
  {
    author: "Kalyāṇavarmā",
    citationChainLength: "1-hop from anchor",
    uncertaintyBracket: "±100 years",
    description: "Post-Varāhamihira (1 citation step) + cited-by 9th-10th-c. sources.",
  },
  {
    author: "Mantreśvara",
    citationChainLength: "2-hops from anchor",
    uncertaintyBracket: "±300 years",
    description: "Post-Kalyāṇavarmā (whose own date is ±100) + 15th-c. attestation. Uncertainty compounds across the chain.",
  },
  {
    author: "Vaidyanātha",
    citationChainLength: "3-hops + tight ceiling",
    uncertaintyBracket: "±50 years",
    description: "Post-three predecessors BUT cited by 17th-c. authors. The tight ceiling compensates for chain length.",
  },
];

export const FRAMEWORK_SUMMARY = {
  headline: "Codifier authority — refining, not originating.",
  body: "The four medieval codifiers each add distinctive emphasis to the Parāśara + Varāhamihira foundation: Kalyāṇavarmā's yoga catalogue, Mantreśvara's practitioner pedagogy, Vaidyanātha's comprehensive synthesis, Nīlakaṇṭha's praśna foundation. None claims to originate new doctrinal frameworks; each refines and selects from prior material. This is what the codifier role looks like in classical Jyotiṣa — and it is genuinely authoritative, distinct from both the foundational ṛṣi layer and the date-anchor systematic codifier layer.",
};
