/**
 * Varāhamihira Skandha Coverage Explorer — static data for L2.3 §4.
 *
 * Varāhamihira (505-587 CE) is the only classical Jyotiṣa author to
 * produce major texts across all three skandhas — horā, saṁhitā, gaṇita.
 * Plus the both-anchors framework comparing him with Parāśara.
 */

export type SkandhaSlug = "hora" | "samhita" | "ganita";

export interface SkandhaText {
  slug: string;
  skandha: SkandhaSlug;
  skandhaLabel: string;
  skandhaDescription: string;
  textName: string;
  textNameDevanagari: string;
  englishLabel: string;
  chapterCount: string;
  /** One-line summary. */
  summary: string;
  /** Major content areas (3-5 bullet items). */
  coverage: string[];
  /** Curriculum cross-references. */
  curriculumCites: string;
  /** Default modern edition / translator. */
  defaultEdition: string;
  /** Per-skandha tradition color. */
  color: string;
  colorDeep: string;
  /** Detail prose for inline expansion. */
  detail: string;
}

export const SKANDHA_TEXTS: SkandhaText[] = [
  {
    slug: "brhat-jataka",
    skandha: "hora",
    skandhaLabel: "Horā",
    skandhaDescription: "Natal + predictive astrology",
    textName: "Bṛhat Jātaka",
    textNameDevanagari: "बृहत् जातक",
    englishLabel: "The Great Natal Treatise",
    chapterCount: "28 chapters",
    summary:
      "The most influential pre-BPHS-dominance natal astrology text — comprehensive single-author treatise on chart interpretation.",
    coverage: [
      "Grahas, rāśis, bhāvas — foundational definitions",
      "Vargas (divisional charts) — D-1 through D-60",
      "Daśās — Vimśottarī + alternative systems",
      "Yogas, doṣas — major planetary combinations",
      "Longevity (āyurdāya) computation with ethical framing",
    ],
    curriculumCites: "T1-04 through T1-15 (heavy citation); most T2 use-case modules",
    defaultEdition: "Bhat, M. Ramakrishna (1981), 2 vols, Motilal Banarsidass — ISBN 81-208-0010-3 / 0011-1",
    color: "#9C7A2F",
    colorDeep: "#7A5E1E",
    detail:
      "Bṛhat Jātaka is the most influential pre-BPHS-dominance natal astrology text. Single-author, 28 chapters, doctrinally tight. The text predates BPHS's medieval recension by ~500 years (Varāhamihira's 6th-c. composition vs BPHS's 10th-14th-c. recension), and it carries the same core doctrine that BPHS later expanded — vargas, daśās, yogas, doṣas all appear here in their established classical forms. Bhat's 1981 Motilal Banarsidass edition is the curriculum's default and is recension-stable.",
  },
  {
    slug: "brhat-samhita",
    skandha: "samhita",
    skandhaLabel: "Saṁhitā",
    skandhaDescription: "Mundane astrology + omens + encyclopaedic civic knowledge",
    textName: "Bṛhat Saṁhitā",
    textNameDevanagari: "बृहत् संहिता",
    englishLabel: "The Great Compilation",
    chapterCount: "106 chapters",
    summary:
      "The most encyclopaedic surviving classical saṁhitā text — omens, civic events, gemology, perfumery, architecture, agriculture.",
    coverage: [
      "Utpāta (omens) + caraṇa (planetary movements) + grahaṇa (eclipses)",
      "Rājyābhiṣeka (civic events: coronations, treaties)",
      "Ratna-parīkṣā (gemology), architecture, iconography",
      "Agriculture, water-divining, animal husbandry",
      "Perfumery, fragrance composition (gāndhayukti)",
    ],
    curriculumCites: "T2-19 (Mundane), T2-21 (Saṁhitā topics); gemology/architecture/iconography subsections",
    defaultEdition: "Bhat, M. Ramakrishna (1981), 2 vols, Motilal Banarsidass",
    color: "#A23A1E",
    colorDeep: "#7A2A14",
    detail:
      "Bṛhat Saṁhitā is genuinely encyclopaedic — 106 chapters covering everything from planetary movements and eclipses to gemology, perfumery, architecture, iconography, and agricultural omenology. It is the most comprehensive surviving classical saṁhitā (mundane-astrology) text. Modern practice draws on it for civic-event interpretation, gemstone evaluation, and Vāstu/iconographic prescription. The breadth signals Varāhamihira's polymathic range; almost no other classical author covers this much non-natal material in a single work.",
  },
  {
    slug: "pancasiddhantika",
    skandha: "ganita",
    skandhaLabel: "Gaṇita",
    skandhaDescription: "Mathematical astronomy + computational astronomy",
    textName: "Pañcasiddhāntikā",
    textNameDevanagari: "पञ्चसिद्धान्तिका",
    englishLabel: "The Five-Siddhānta Treatise",
    chapterCount: "18 chapters",
    summary:
      "Summary and comparative analysis of five prior siddhāntas (mathematical astronomy systems) — and the source of the astronomical-position dating that anchors Varāhamihira to ~575 CE.",
    coverage: [
      "Paitāmaha siddhānta — Brahmā-attributed astronomy",
      "Vāsiṣṭha siddhānta — Vasiṣṭha-attributed",
      "Romaka siddhānta — Indo-Roman/Greek mathematical-astronomy synthesis",
      "Pauliśa siddhānta — possibly linked to Paulus of Alexandria",
      "Sūrya siddhānta — solar-tradition astronomy (the most influential of the five)",
    ],
    curriculumCites: "T1-03 (Gaṇita), T1-13 (Pañcāṅga), T2-15 (Astronomical Foundations), historical methodology",
    defaultEdition: "Neugebauer & Pingree (1970-1971), Royal Danish Academy — the definitive academic critical edition",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
    detail:
      "Pañcasiddhāntikā summarises and comparatively analyses five prior siddhāntas — Paitāmaha, Vāsiṣṭha, Romaka, Pauliśa, Sūrya. It is the critical primary source for tracking pre-Varāhamihira mathematical-astronomy tradition. CRUCIALLY: this text contains dateable astronomical observations (recorded planetary positions, calendrical reckonings in Śaka era) which Neugebauer & Pingree (1970-1971) back-calculated against modern ephemerides to establish Varāhamihira's central activity at ~575 CE. This is the evidence-quality that anchors classical Jyotiṣa chronology.",
  },
];

/** The 5 siddhāntas Pañcasiddhāntikā summarises. */
export interface PriorSiddhanta {
  slug: string;
  name: string;
  nameDevanagari: string;
  origin: string;
  influence: string;
}

export const PRIOR_SIDDHANTAS: PriorSiddhanta[] = [
  {
    slug: "paitamaha",
    name: "Paitāmaha",
    nameDevanagari: "पैतामह",
    origin: "Brahmā-attributed (mythic origin)",
    influence: "Foundational; primarily preserved via Varāhamihira's summary",
  },
  {
    slug: "vasishtha",
    name: "Vāsiṣṭha",
    nameDevanagari: "वासिष्ठ",
    origin: "Vasiṣṭha-attributed (ṛṣi-figure)",
    influence: "Important ritual-timing applications; survives in fragments",
  },
  {
    slug: "romaka",
    name: "Romaka",
    nameDevanagari: "रोमक",
    origin: "Indo-Roman/Greek synthesis",
    influence: "Documents Indo-Hellenistic astronomical exchange",
  },
  {
    slug: "paulisha",
    name: "Pauliśa",
    nameDevanagari: "पौलिश",
    origin: "Possibly linked to Paulus of Alexandria (Greek astronomer)",
    influence: "Hellenistic computational techniques in Sanskrit dress",
  },
  {
    slug: "surya",
    name: "Sūrya",
    nameDevanagari: "सूर्य",
    origin: "Solar-tradition astronomy",
    influence: "Most influential of the five; later expanded into the canonical Sūrya Siddhānta",
  },
];

/** The both-anchors framework comparison dimensions. */
export interface BothAnchorsDimension {
  slug: string;
  label: string;
  parashara: string;
  varahamihira: string;
}

export const BOTH_ANCHORS: BothAnchorsDimension[] = [
  {
    slug: "historical-certainty",
    label: "Historical certainty",
    parashara: "Pre-classical ṛṣi-figure; Vedic-tradition attested (Mahābhārata, Purāṇas); attribution-uncertain for specific texts",
    varahamihira: "Real, dateable 6th-century historical scholar; attribution-certain across all three primary texts",
  },
  {
    slug: "dating",
    label: "Dating",
    parashara: "Tradition: ~3000 BCE (Mahābhārata-era); Academic: pre-classical doctrinal core + medieval recension",
    varahamihira: "505-587 CE (±30 years); astronomical-observation anchor at ~575 CE",
  },
  {
    slug: "authority-basis",
    label: "Authority basis",
    parashara: "Lineage authority — descendant of Vasiṣṭha; father of Vyāsa; Vedic-tradition recognition",
    varahamihira: "Evidence authority — internally-checkable astronomical observations; cross-referenced citation network",
  },
  {
    slug: "recension",
    label: "Recension status",
    parashara: "Most-recension-affected major text (BPHS); curriculum default = Santhanam 1996",
    varahamihira: "Recension-stable; curriculum defaults = Bhat 1981 (Bṛhat Jātaka, Bṛhat Saṁhitā), Neugebauer-Pingree (Pañcasiddhāntikā)",
  },
  {
    slug: "skandha-coverage",
    label: "Skandha coverage",
    parashara: "Horā only (BPHS)",
    varahamihira: "All three: horā (Bṛhat Jātaka), saṁhitā (Bṛhat Saṁhitā), gaṇita (Pañcasiddhāntikā)",
  },
  {
    slug: "curriculum-role",
    label: "Curriculum role",
    parashara: "Foundational ṛṣi — most-cited classical author; encyclopaedic horā coverage",
    varahamihira: "Systematic codifier — date-anchor for chronology; three-skandha-spanning author",
  },
];

/** Astronomical-position dating methodology — 4 steps. */
export const DATING_METHOD_STEPS = [
  {
    step: 1,
    label: "Extract the calendrical anchor",
    description:
      "Identify the Śaka-era date referenced in Pañcasiddhāntikā. The text gives Śaka 427 = 505 CE as one anchor point in the calendrical-reckoning sections.",
  },
  {
    step: 2,
    label: "Extract the recorded planetary position",
    description:
      "Identify the planetary position Varāhamihira records for that anchor date — specific graha longitudes, conjunctions, or eclipse data.",
  },
  {
    step: 3,
    label: "Back-calculate from modern ephemerides",
    description:
      "Use modern accurate planetary-position software (or pre-computed historical ephemerides) to determine what actual planetary position occurred on the equivalent calendar date.",
  },
  {
    step: 4,
    label: "Compare and refine",
    description:
      "If Varāhamihira's recorded position matches the modern back-calculation, the calendrical anchor is confirmed. Across Pañcasiddhāntikā, the match is closest for ~575 CE — Varāhamihira's central activity year.",
  },
];

export const FRAMEWORK_SUMMARY = {
  headline: "Two anchors, complementary authorities.",
  body: "Parāśara stands at the origin-tradition end (lineage authority — descendant of Vasiṣṭha, father of Vyāsa, ṛṣi-attribution); Varāhamihira stands at the historical-codification end (evidence authority — astronomically dated, three-skandha-spanning, recension-stable). Both anchors are real; neither displaces the other. Classical Jyotiṣa's authority structure rests on this dual foundation — and the citation discipline differs by anchor type. Honour both.",
};
