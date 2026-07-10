/**
 * BPHS Recension Comparator — static data for L2.2 §4.
 *
 * The 10 major prakaraṇa-divisions of the Bṛhat Parāśara Horā Śāstra,
 * indexed by the Santhanam (1996) recension's adhyāya numbering — the
 * curriculum's default. Per L2.2 §4.2 + §4.4.
 *
 * Three recensions in modern circulation:
 *   1. Santhanam (1996) — English, Ranjan Publications. CURRICULUM DEFAULT.
 *   2. Sitaram Jha — Sanskrit + Hindi commentary, Chaukhamba.
 *   3. Devacandra Jha — Sanskrit + extensive Hindi commentary, Chaukhamba.
 *
 * The recensions agree on CORE DOCTRINE but differ in chapter numbering,
 * verse counts, and occasional word-choices. Citation discipline requires
 * recension specification — this data set helps the learner see WHY.
 */

export type RecensionSlug = "santhanam" | "sitaram-jha" | "devacandra-jha";

export interface RecensionConfig {
  slug: RecensionSlug;
  label: string;
  shortLabel: string;
  language: string;
  year: string;
  color: string;
  colorDeep: string;
  curriculumDefault: boolean;
}

export const RECENSIONS: RecensionConfig[] = [
  {
    slug: "santhanam",
    label: "Santhanam (1996)",
    shortLabel: "Santhanam",
    language: "English (Sanskrit en face)",
    year: "1996",
    color: "#9C7A2F",
    colorDeep: "#7A5E1E",
    curriculumDefault: true,
  },
  {
    slug: "sitaram-jha",
    label: "Sitaram Jha",
    shortLabel: "Sitaram Jha",
    language: "Sanskrit + Hindi",
    year: "—",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
    curriculumDefault: false,
  },
  {
    slug: "devacandra-jha",
    label: "Devacandra Jha",
    shortLabel: "Devacandra Jha",
    language: "Sanskrit + Hindi commentary",
    year: "—",
    color: "#A23A1E",
    colorDeep: "#7A2A14",
    curriculumDefault: false,
  },
];

export interface PrakaranaPlate {
  slug: string;
  /** Sanskrit name in Devanāgarī. */
  devanagari: string;
  /** Transliterated name. */
  iast: string;
  /** Human-readable English topic. */
  englishLabel: string;
  /** Santhanam-numbered adhyāya range. */
  santhanamRange: string;
  /** Brief topic summary (1 sentence). */
  summary: string;
  /** Detailed description (2-3 sentences). */
  detail: string;
  /** Curriculum cross-references (T1/T2 modules that cite this prakaraṇa). */
  curriculumCites: string;
  /** Whether this prakaraṇa is HIGH-VALUE for citation discipline (most-cited in modern practice). */
  isMostCited: boolean;
  /** Note on recension variation for this specific prakaraṇa (if significant). */
  recensionNote: string;
}

export const PRAKARANA_PLATES: PrakaranaPlate[] = [
  {
    slug: "introduction",
    devanagari: "उपोद्घात",
    iast: "Upodghāta",
    englishLabel: "Introduction",
    santhanamRange: "Adhyāya 1-2",
    summary: "The Parāśara-Maitreya dialogue frame; nature and classification of Jyotiṣa.",
    detail:
      "The opening chapters establish the dialogue frame — Maharṣi Parāśara speaking to his disciple Maitreya. The opening Sūtra (Adhyāya 1.1) is the canonical citation establishing BPHS's self-attribution. The classification of disciplines (skandha-traya: Saṁhitā, Horā, Gaṇita) sits here.",
    curriculumCites: "T1-01 (Jyotiṣa as Vedāṅga, Sub-branches overview)",
    isMostCited: false,
    recensionNote: "Chapter numbering consistent across recensions.",
  },
  {
    slug: "grahas-rashis",
    devanagari: "ग्रहगुणस्वरूप · राशिप्रकरण",
    iast: "Grahaguṇasvarūpa · Rāśiprakaraṇa",
    englishLabel: "Planets + Signs",
    santhanamRange: "Adhyāya 3-5",
    summary: "The 9 grahas (planets) and 12 rāśis (signs) — attributes, dignities, friendships.",
    detail:
      "Foundational vocabulary chapters. Defines the nine grahas (Sūrya, Candra, Maṅgala, Budha, Guru, Śukra, Śani, Rāhu, Ketu) with their physical, character-temperament, and karmic attributes. Defines the twelve rāśis with their element, modality, gender, deity, and graha-rulership. Establishes the exaltation, debilitation, mūlatrikoṇa, and friendship-enmity tables.",
    curriculumCites: "T1-04 (Grahas), T1-05 (Rāśis) — heavy citation throughout",
    isMostCited: true,
    recensionNote: "Chapter numbering largely consistent; some verse-count variations.",
  },
  {
    slug: "vargas-bhavas",
    devanagari: "षोडशवर्गाध्याय · भावविवेकाध्याय",
    iast: "Ṣoḍaśavargādhyāya · Bhāvavivekādhyāya",
    englishLabel: "Divisional Charts + Houses",
    santhanamRange: "Adhyāya 6-7",
    summary: "The 16 vargas (divisional charts) and the 12 bhāvas (houses) — definitions, computation, significations.",
    detail:
      "The 16 vargas — D-1 through D-60 — are introduced with computation rules. Each varga has a specific life-area focus (Navāṁśa = marriage, Daśāṁśa = career, etc.). The 12 bhāvas are defined with their primary significations, kāraka-graha assignments, and the bhāva-pati (lordship) rules.",
    curriculumCites: "T1-06 (Divisional Charts), T1-09 (Bhāvas) — primary source",
    isMostCited: true,
    recensionNote: "Some recensions split Ṣoḍaśavargādhyāya into multiple adhyāyas.",
  },
  {
    slug: "nakshatras",
    devanagari: "नक्षत्राध्याय",
    iast: "Nakṣatrādhyāya",
    englishLabel: "Nakṣatras",
    santhanamRange: "Adhyāya 8",
    summary: "The 27 nakṣatras (lunar mansions) — attributes, deities, gaṇa, varṇa, yoni, nāḍī.",
    detail:
      "The 27 nakṣatras span 360° (each 13°20'). Each carries: deity (devatā), gaṇa (deva/manuṣya/rākṣasa), varṇa (caste-association for marriage compatibility), yoni (animal-association), nāḍī (subtle constitutional grouping), graha-rulership (Vimśottarī mahā-daśā lord). This single chapter is referenced by both natal-chart and muhūrta lessons.",
    curriculumCites: "T1-07 (Nakṣatras), T1-10 (Daśās), Muhūrta modules",
    isMostCited: false,
    recensionNote: "Chapter numbering consistent.",
  },
  {
    slug: "bhava-extended",
    devanagari: "भावविवेकाध्याय विस्तार",
    iast: "Bhāvavivekādhyāya (extended)",
    englishLabel: "Per-Bhāva Treatment",
    santhanamRange: "Adhyāya 12-23",
    summary: "Detailed per-bhāva treatment — significations, permutations, life-area mappings.",
    detail:
      "Twelve chapters, one per bhāva, with detailed permutations: what does each graha in each bhāva indicate? What does each bhāva-pati placement indicate? This is the deepest single block of natal-chart interpretive content in BPHS. The verse-count is large (hundreds of verses per chapter).",
    curriculumCites: "T1-06 (Bhāvas), T2-03 through T2-12 (life-area use cases)",
    isMostCited: true,
    recensionNote: "Most affected by recension variation — verse counts differ; some recensions reorganise.",
  },
  {
    slug: "yogas",
    devanagari: "योगाध्याय",
    iast: "Yogādhyāya",
    englishLabel: "Yogas",
    santhanamRange: "Adhyāya 36-43",
    summary: "The major planetary combinations — Pañcamahāpuruṣa, Rāja, Dhana, Lakṣmī, Sarasvatī, etc.",
    detail:
      "The yoga chapters define hundreds of specific planetary combinations — Pañcamahāpuruṣa (5 great-person yogas: Ruchaka, Bhadra, Haṁsa, Mālavya, Śaśa); Rāja yogas (kingship-conferring combinations); Dhana yogas (wealth-conferring); Lakṣmī yoga; Sarasvatī yoga; Akhanḍa Sāmrājya yoga; and many more. Citation-heavy in advanced predictive work.",
    curriculumCites: "T1-08 (Yogas), T1-14 (Predictive Synthesis)",
    isMostCited: true,
    recensionNote: "Verse-count variation moderate; chapter-numbering consistent.",
  },
  {
    slug: "dashas",
    devanagari: "दशाक्रमप्रकरण",
    iast: "Daśākramaprakaraṇa",
    englishLabel: "Daśā Systems",
    santhanamRange: "Adhyāya 46-58",
    summary: "THE time-engine — Vimśottarī (most-cited), Aṣṭottarī, Yoginī, Cara, Sthira, Kālacakra, conditional daśās.",
    detail:
      "The most-cited block of BPHS for modern predictive practice. Adhyāya 46.1 — the canonical citation for Vimśottarī's starting daśā lord (from Moon's nakṣatra at birth) — sits here. The Vimśottarī cycle (120 years across the 9 grahas in fixed sequence) is the time-engine the entire Tier 1 and Tier 2 predictive curriculum depends on. Conditional daśās (Yoginī, Aṣṭottarī, Cara, Sthira, Kālacakra) are activated under specific natal-chart conditions defined in these chapters.",
    curriculumCites: "T1-10 (Daśās — primary source), T2 ALL predictive modules",
    isMostCited: true,
    recensionNote: "MOST consequentially varying for citation — Santhanam 46.1 = Sitaram Jha 48.1 in some manuscript families.",
  },
  {
    slug: "ayurdaya",
    devanagari: "आयुर्दायाध्याय",
    iast: "Āyurdāyādhyāya",
    englishLabel: "Longevity Computation",
    santhanamRange: "Adhyāya 49-51",
    summary: "Piṇḍa, Aṁśa, Naisargika āyur computation; Bālāriṣṭa (childhood-death indicators).",
    detail:
      "Longevity computation methods — three primary techniques (Piṇḍa, Aṁśa, Naisargika) and the Bālāriṣṭa (childhood-mortality-risk indicators). Modern practice handles this content with extreme care: Tier 2 longevity lessons (T2-07) frame these techniques with explicit ethical guardrails — what to compute, what to report, what to leave un-spoken.",
    curriculumCites: "T2-07 (Longevity, with ethical framing — handle with care)",
    isMostCited: false,
    recensionNote: "Overlaps with Daśā chapters in some recensions.",
  },
  {
    slug: "ashtakavarga",
    devanagari: "अष्टकवर्गप्रकरण",
    iast: "Aṣṭakavargaprakaraṇa",
    englishLabel: "Aṣṭakavarga",
    santhanamRange: "Adhyāya 65-67",
    summary: "The 8-fold strength system — sarvāṣṭakavarga, bhinnāṣṭakavarga, reduction techniques.",
    detail:
      "Aṣṭakavarga is a computational system assigning bindus (points) to each of 8 reference points (7 grahas + Lagna) across the 12 bhāvas. The bindu-counts produce a numerical strength assessment per bhāva-per-graha. Sarvāṣṭakavarga aggregates; bhinnāṣṭakavarga is per-graha; reduction techniques (trikoṇa-śodhana, ekādhipatya-śodhana) refine the totals before interpretive use.",
    curriculumCites: "T1-12 (Aṣṭakavarga), advanced predictive modules",
    isMostCited: false,
    recensionNote: "Chapter numbering consistent.",
  },
  {
    slug: "shanti",
    devanagari: "शान्त्यध्याय",
    iast: "Śāntyādhyāya",
    englishLabel: "Remedial Measures",
    santhanamRange: "Adhyāya 73-84",
    summary: "Mantras, yantras, gemstones, charity, fasting — śānti for malefic graha-effects.",
    detail:
      "The remedial chapters prescribe specific interventions for malefic graha-effects: mantras (japa), yantras (sacred geometric diagrams), gemstones (with precise weight, metal, and finger specifications), charitable acts (dāna), fasting practices (vrata). Modern practice (T1-15 + T2-21) frames these with prescription-discipline guardrails — what's recommended, what's culturally bounded, what's not actually in the text.",
    curriculumCites: "T1-15 (Remedies overview), T2-21 (Prescription discipline)",
    isMostCited: false,
    recensionNote: "Verse-count varies; some recensions include material others omit.",
  },
];

/** The Parāśara duality framing — the lesson's central pedagogy. */
export const PARASHARA_DUALITY = {
  preClassical: {
    label: "Pre-classical ṛṣi-figure",
    description:
      "Maharṣi Parāśara as he appears in tradition — a Mahābhārata-era ṛṣi, often traditionally dated ~3000 BCE. Attested across Indian classical literature beyond Jyotiṣa (the Mahābhārata's Śānti Parva / Parāśara-Gītā, and Purāṇic genealogies). The TRADITIONAL chronology treats him as the historical author of BPHS's core doctrine.",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
  },
  medievalRecension: {
    label: "Medieval-recension BPHS",
    description:
      "The TEXT as we have it — preserved in multiple manuscript families dated by Pingree (1981) to the 10th-14th century CE. Three modern editions (Santhanam, Sitaram Jha, Devacandra Jha) work from different manuscript traditions and number chapters differently. The text-form is medieval; the core doctrine is likely older.",
    color: "#A23A1E",
    colorDeep: "#7A2A14",
  },
};

/** Citation-discipline summary specific to BPHS. */
export const BPHS_CITATION_FRAMING =
  "When citing BPHS in modern practice, name four things: (1) BPHS, (2) the prakaraṇa-division by name, (3) chapter:verse in Santhanam-numbering (the curriculum default), (4) the page in Santhanam Vol I or II where the English appears. A citation that names only \"BPHS 46.1\" — without recension or translator — is vague over-claim. The four-move citation discipline of L2.1 §4.6, applied to BPHS specifically.";
