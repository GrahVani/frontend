/**
 * Seven Sub-Branches Explorer — static data.
 *
 * The seven sub-branches of Jyotiṣa with their skandha placement,
 * operational scope, foundational texts, curriculum modules, and stream emphasis.
 *
 * Per Lesson 1.3.2 §4.1–4.10.
 */

export interface FoundationalText {
  title: string;
  author?: string;
  note?: string;
}

export interface CurriculumModule {
  code: string;
  name: string;
  tier: string;
}

export interface StreamEmphasis {
  stream: string;
  emphasis: string;
}

export interface SubBranchNode {
  slug: string;
  iast: string;
  devanagari: string;
  skandha: "Horā" | "Saṁhitā" | "Cross-cutting";
  function: string;
  coverage: string;
  operationalScope: string[];
  foundationalTexts: FoundationalText[];
  curriculumModules: CurriculumModule[];
  streamEmphasis: StreamEmphasis[];
  nodeColor: string;
  nodeColorDeep: string;
}

export const SUBBRANCH_NODES: SubBranchNode[] = [
  {
    slug: "jataka",
    iast: "Jātaka",
    devanagari: "जातक",
    skandha: "Horā",
    function: "Natal astrology — predictive analysis from birth-chart",
    coverage:
      "The largest and most-elaborated sub-branch. Covers natal-chart erection, per-graha analysis, per-bhāva analysis, yoga analysis, daśā analysis, cross-life-domain prediction (career, marriage, health, wealth, longevity), and synthesis-and-judgement. Almost every major classical text is primarily-or-substantially Jātaka.",
    operationalScope: [
      "Natal-chart erection from birth date/time/place",
      "Per-graha analysis — 9 grahas in the natal chart",
      "Per-bhāva analysis — 12 bhāvas and their predictive contributions",
      "Yoga analysis — planetary combinations (Pañcamahāpuruṣa, Rāja, Dhana, Kemadruma, etc.)",
      "Daśā analysis — time-cycle systems for event-timing",
      "Cross-life-domain prediction — career, marriage, health, wealth, longevity, progeny, education",
      "Synthesis-and-judgement — integrating all factors into operational predictive judgements",
    ],
    foundationalTexts: [
      { title: "BPHS", author: "Parāśara (traditional)", note: "Most-cited classical horā text" },
      { title: "Bṛhat Jātaka", author: "Varāhamihira", note: "Systematic horā codification" },
      { title: "Saravali", author: "Kalyāṇavarmā", note: "Yoga catalogue + practitioner pedagogy" },
      { title: "Phaladīpikā", author: "Mantreśvara", note: "Comprehensive horā synthesis" },
      { title: "Jātaka Pārijāta", author: "Vaidyanātha Dīkṣita", note: "Late-medieval horā compendium" },
      { title: "Jaiminī Sūtra", author: "Maharṣi Jaiminī", note: "Distinctive Jaiminī horā framework" },
      { title: "KP Reader I-VI", author: "K.S. Krishnamurti", note: "Modern-primary KP horā system" },
      { title: "Lal Kitab", author: "Pandit Roop Chand Joshi", note: "Modern-primary Lal Kitab horā + remedies" },
    ],
    curriculumModules: [
      { code: "T1-04", name: "Grahas (Planets)", tier: "Tier 1" },
      { code: "T1-05", name: "Rāśis (Signs)", tier: "Tier 1" },
      { code: "T1-06", name: "Vargas (Divisional Charts)", tier: "Tier 1" },
      { code: "T1-07", name: "Nakṣatras (Lunar Mansions)", tier: "Tier 1" },
      { code: "T1-08", name: "Aspects and Intro Yogas", tier: "Tier 1" },
      { code: "T1-09", name: "Bhāvas (Houses)", tier: "Tier 1" },
      { code: "T1-10", name: "Daśā Systems", tier: "Tier 1" },
      { code: "T1-11", name: "Strength Calculations (Ṣaḍbala)", tier: "Tier 1" },
      { code: "T1-12", name: "Aṣṭakavarga", tier: "Tier 1" },
      { code: "T1-14", name: "Yoga Catalogue", tier: "Tier 1" },
      { code: "T1-15", name: "Doṣas and Special Conditions", tier: "Tier 1" },
      { code: "T1-16", name: "Chart Reading Procedure", tier: "Tier 1" },
      { code: "T2-01–T2-02", name: "Predictive Methodology", tier: "Tier 2" },
      { code: "T2-03–T2-12", name: "Use-case modules (career, marriage, etc.)", tier: "Tier 2" },
      { code: "T2-13", name: "Multi-Domain Synthesis", tier: "Tier 2" },
    ],
    streamEmphasis: [
      { stream: "Parāśari", emphasis: "Deep — encyclopaedic horā corpus across BPHS + Bṛhat Jātaka + medieval codifiers" },
      { stream: "Jaiminī", emphasis: "Deep — cara-rāśi-daśās + ārūḍha + rāśi-aspects + cara-kārakas + Jaiminī yogas" },
      { stream: "KP", emphasis: "Deep — sub-lord theory + CSL methodology + stellar centre" },
      { stream: "Lal Kitab", emphasis: "Deep — fixed-house framework + 108 remedies + distinctive bhāva-significations" },
    ],
    nodeColor: "#A23A1E",
    nodeColorDeep: "#7A2A14",
  },
  {
    slug: "prashna",
    iast: "Praśna",
    devanagari: "प्रश्न",
    skandha: "Horā",
    function: "Horary astrology — predictive analysis from question-moment",
    coverage:
      "Predictive analysis from the moment a question is asked rather than from a birth-chart. The praśna chart is erected for the question-moment, with the querent's question providing the analytical focus. Moderate curriculum coverage — substantially less than Jātaka but more than smaller saṁhitā sub-branches.",
    operationalScope: [
      "Praśna chart erection for the question-moment",
      "Significator identification — which graha/bhāva represents the question-subject",
      "Yes/no analysis — will the question-event occur?",
      "Timing analysis — when will it occur if it occurs?",
      "Quality analysis — what is the nature/character of the outcome?",
      "Praśna-specific techniques — ārūḍha, KP horary 1-249, classical Sanskrit praśna doctrines",
    ],
    foundationalTexts: [
      { title: "Praśna Tantra", author: "Nīlakaṇṭha (~16th c. CE)", note: "Foundational classical Praśna text" },
      { title: "Praśna Mārga", author: "(~17th c. CE Kerala)", note: "Dominant medieval-to-modern Praśna text" },
      { title: "KP horary methodology", author: "K.S. Krishnamurti", note: "Distinctive 1-249 number-based praśna system" },
    ],
    curriculumModules: [
      { code: "T1-19", name: "Praśna Intro", tier: "Tier 1" },
      { code: "T2-20", name: "Praśna Predictive Mastery", tier: "Tier 2" },
    ],
    streamEmphasis: [
      { stream: "Parāśari", emphasis: "Moderate — classical Praśna Tantra, Praśna Mārga material" },
      { stream: "Jaiminī", emphasis: "Moderate — classical praśna methodology" },
      { stream: "KP", emphasis: "Distinctive deep — KP horary 1-249 system, uniquely KP modern primary" },
      { stream: "Lal Kitab", emphasis: "Light — no distinctively-Lal-Kitab praśna" },
    ],
    nodeColor: "#A23A1E",
    nodeColorDeep: "#7A2A14",
  },
  {
    slug: "muhurta",
    iast: "Muhūrta",
    devanagari: "मुहूर्त",
    skandha: "Horā",
    function: "Electional astrology — selecting auspicious moments for important actions",
    coverage:
      "Selecting auspicious moments for important actions (marriage, business launch, travel, surgery, etc.). The practitioner is given an action-context and computes/identifies a moment with favourable astrological conditions. Moderate curriculum coverage, comparable to Praśna.",
    operationalScope: [
      "Action-specific muhūrta selection — different actions have different evaluation criteria",
      "Pañcāṅga-based muhūrta filtering — tithi, vāra, nakṣatra, yoga, karaṇa auspicious/inauspicious flags",
      "Mahādoṣas avoidance — 21 major astrological doṣas that disqualify a muhūrta",
      "Ṣaḍbala-based confirmation — strength assessment of relevant grahas",
      "Muhūrta synthesis — integrating multiple criteria into operational selection",
    ],
    foundationalTexts: [
      { title: "Muhūrta-Cintāmaṇi", author: "Rāma Daivajña (~16th c. CE)", note: "Standard Muhūrta primary; comprehensive medieval synthesis" },
      { title: "Yogayātrā", author: "Varāhamihira (~575 CE)", note: "Muhūrta for war and journey contexts" },
    ],
    curriculumModules: [
      { code: "T1-18", name: "Muhūrta Intro", tier: "Tier 1" },
      { code: "T2-18", name: "Muhūrta Predictive Mastery", tier: "Tier 2" },
    ],
    streamEmphasis: [
      { stream: "Parāśari", emphasis: "Moderate — Muhūrta-Cintāmaṇi, Yogayātrā, BPHS muhūrta material" },
      { stream: "Jaiminī", emphasis: "Light — no distinctively-Jaiminī muhūrta material" },
      { stream: "KP", emphasis: "Moderate — KP muhūrta cross-references with KP techniques" },
      { stream: "Lal Kitab", emphasis: "Light — no distinctively-Lal-Kitab muhūrta" },
    ],
    nodeColor: "#A23A1E",
    nodeColorDeep: "#7A2A14",
  },
  {
    slug: "nimitta",
    iast: "Nimitta",
    devanagari: "निमित्त",
    skandha: "Saṁhitā",
    function: "Omens and signs — predictive interpretation of natural and bodily portents",
    coverage:
      "The omens-and-signs sub-branch. The practitioner reads omens (events not directly chart-derived but interpreted as predictive-significant) for predictive insight. Moderate curriculum coverage; more specialised in modern context.",
    operationalScope: [
      "Natural omens — unusual weather, animal behaviour, bird-flight directions, sudden storms",
      "Bodily omens — twitches in specific body-parts (eye, lip, palm) with predictive significance",
      "Dream interpretation — predictive significance of dreams (classical dream-omen correlation)",
      "Object/event omens — encountering specific objects/animals/situations at specific times",
      "Astronomical omens — eclipses, comets, unusual planetary configurations",
    ],
    foundationalTexts: [
      { title: "Bṛhat Saṁhitā utpāta-darśana sections", author: "Varāhamihira", note: "Dominant classical Nimitta primary" },
      { title: "Adbhuta-sāgara", author: "Ballāla Sena (~12th c. CE)", note: "Comprehensive medieval omens/portents compilation" },
    ],
    curriculumModules: [
      { code: "T2-19", name: "Mundane Astrology", tier: "Tier 2" },
      { code: "T2-21", name: "Saṁhitā Topics Mastery", tier: "Tier 2" },
    ],
    streamEmphasis: [
      { stream: "Parāśari", emphasis: "Moderate — Bṛhat Saṁhitā utpāta-darśana sections" },
      { stream: "Jaiminī", emphasis: "Light — no distinctively-Jaiminī nimitta material" },
      { stream: "KP", emphasis: "Light — no distinctively-KP nimitta material" },
      { stream: "Lal Kitab", emphasis: "Moderate — includes some omen-reading material (partial overlap)" },
    ],
    nodeColor: "#3A8C5A",
    nodeColorDeep: "#2A6A40",
  },
  {
    slug: "ayurveda-jyotisha",
    iast: "Āyurveda-Jyotiṣa",
    devanagari: "आयुर्वेद-ज्योतिष",
    skandha: "Cross-cutting",
    function: "Medical astrology — cross-cutting horā + saṁhitā, integrating with Āyurveda",
    coverage:
      "Cross-cutting horā and saṁhitā by integrating natal-chart-based health analysis (horā) with omens-and-event-timing (saṁhitā) and explicitly integrating with Āyurveda (the parallel classical Indian medical śāstra). Moderate curriculum coverage as a cross-cutting sub-branch.",
    operationalScope: [
      "Natal disease prediction — chart-based identification of disease predispositions",
      "Disease-timing analysis — daśā-based prediction of when disease events will occur",
      "Diagnosis support — using chart-data to support Āyurvedic diagnosis",
      "Treatment-timing optimisation — selecting muhūrta for surgery, beginning treatment courses",
      "Prognosis assessment — predictive analysis of treatment-outcome likelihood",
      "Āyurveda-integration — relating astrological factors to Āyurvedic prakṛti (vāta/pitta/kapha)",
    ],
    foundationalTexts: [
      { title: "Bṛhat Saṁhitā disease chapters", author: "Varāhamihira", note: "Classical Jyotiṣa-internal disease-prediction material" },
      { title: "Caraka Saṁhitā + Suśruta Saṁhitā", note: "Āyurveda primaries that Jyotiṣa medical-astrology integrates with" },
    ],
    curriculumModules: [
      { code: "T1-09", name: "Bhāvas (Houses — 6th house disease)", tier: "Tier 1" },
      { code: "T1-15", name: "Doṣas and Special Conditions", tier: "Tier 1" },
      { code: "T2-09", name: "Health Use-Case", tier: "Tier 2" },
      { code: "T2-22", name: "Remedial Astrology Mastery", tier: "Tier 2" },
    ],
    streamEmphasis: [
      { stream: "Parāśari", emphasis: "Moderate — Bṛhat Saṁhitā disease chapters + classical Āyurveda integration" },
      { stream: "Jaiminī", emphasis: "Light" },
      { stream: "KP", emphasis: "Light" },
      { stream: "Lal Kitab", emphasis: "Distinctive moderate — health-and-remedy material with Āyurveda-adjacent framing" },
    ],
    nodeColor: "#7A5E1E",
    nodeColorDeep: "#5A4514",
  },
  {
    slug: "vastu",
    iast: "Vāstu",
    devanagari: "वास्तु",
    skandha: "Saṁhitā",
    function: "Architectural astrology — astrological-architectural principles for buildings, spaces, sites",
    coverage:
      "Architectural astrology — astrological-architectural principles for buildings, spaces, and sites. Integrates astronomical-directional principles, sacred-geometry, and predictive-astrological evaluation of architectural designs. Moderate-to-light curriculum coverage as a Jyotiṣa-adjacent specialisation.",
    operationalScope: [
      "Site selection — astrological-architectural evaluation of land/sites for building suitability",
      "Building-orientation — directional principles (facing direction, room placement)",
      "Plot-and-room layout — geometric principles for room placement, traffic flow, sacred-spaces",
      "Vāstu doṣas analysis — identifying problematic configurations in existing buildings",
      "Vāstu remediation — corrective measures for vāstu doṣas",
      "Muhūrta integration — auspicious moments for groundbreaking, foundation-laying, occupation",
    ],
    foundationalTexts: [
      { title: "Bṛhat Saṁhitā Vāstu chapters", author: "Varāhamihira", note: "Foundational Vāstu material within classical Jyotiṣa corpus" },
      { title: "Mayamatam", note: "Comprehensive medieval Vāstu-Śāstra primary" },
      { title: "Mānasāra", note: "Comprehensive medieval Vāstu-Śāstra primary" },
      { title: "Samarāṅgaṇa-Sūtradhāra", author: "Bhoja (~11th c. CE)", note: "Architecture + sacred geometry + iconography" },
    ],
    curriculumModules: [
      { code: "T1-22", name: "Vāstu Intro", tier: "Tier 1" },
      { code: "T2-21", name: "Saṁhitā Topics Mastery", tier: "Tier 2" },
      { code: "T2-22", name: "Remedial Astrology Mastery", tier: "Tier 2" },
    ],
    streamEmphasis: [
      { stream: "Parāśari", emphasis: "Moderate — Bṛhat Saṁhitā Vāstu chapters + Mayamatam/Mānasāra/Samarāṅgaṇa-Sūtradhāra" },
      { stream: "Jaiminī", emphasis: "Light" },
      { stream: "KP", emphasis: "Light" },
      { stream: "Lal Kitab", emphasis: "Light" },
    ],
    nodeColor: "#3A8C5A",
    nodeColorDeep: "#2A6A40",
  },
  {
    slug: "samhita-detailed",
    iast: "Saṁhitā-Detailed",
    devanagari: "संहिता-विस्तृत",
    skandha: "Saṁhitā",
    function: "Encyclopaedic saṁhitā topics — gemology, perfumery, agriculture, weather, mundane events, civic-event prediction",
    coverage:
      "The encyclopaedic saṁhitā sub-branch covering the full breadth of saṁhitā topics: gemology (ratna-parīkṣā), perfumery (gandhayukti), agriculture (kṛṣi-jyotiṣa), weather prediction, mundane events (rāṣṭra-jyotiṣa), civic-event prediction, iconography (mūrti-vidhāna), water-divining, animal husbandry. Moderate curriculum coverage with deep opt-in via T2-21.",
    operationalScope: [
      "Mundane astrology — predictions for nations, governments, communities",
      "Eclipse interpretation — predictive significance (distinct from gaṇita's eclipse computation)",
      "Comet interpretation — ketu-darśana predictive significance",
      "Weather prediction — astrological weather and rainfall prediction",
      "Civic-event astrology — rājyābhiṣeka, war/peace predictions",
      "Gemology — gem identification, quality assessment, predictive-significance",
      "Perfumery — astrological perfumery for planetary remediation",
      "Agriculture — agricultural timing per astrological framework",
      "Iconography — astrological-iconographic principles for sacred imagery",
      "Water-divining and other adjacent topics",
    ],
    foundationalTexts: [
      { title: "Bṛhat Saṁhitā", author: "Varāhamihira (~575 CE)", note: "The comprehensive primary — 106 chapters covering full Saṁhitā-Detailed breadth" },
    ],
    curriculumModules: [
      { code: "T2-19", name: "Mundane Astrology", tier: "Tier 2" },
      { code: "T2-21", name: "Saṁhitā Topics Mastery", tier: "Tier 2" },
    ],
    streamEmphasis: [
      { stream: "Parāśari", emphasis: "Deep — Bṛhat Saṁhitā as comprehensive primary; dominant Saṁhitā-Detailed corpus" },
      { stream: "Jaiminī", emphasis: "Light" },
      { stream: "KP", emphasis: "Light" },
      { stream: "Lal Kitab", emphasis: "Light" },
    ],
    nodeColor: "#3A8C5A",
    nodeColorDeep: "#2A6A40",
  },
];

/** Canonical order for rendering rows. */
export const ROW_ORDER: SubBranchNode["slug"][] = [
  "jataka",
  "prashna",
  "muhurta",
  "nimitta",
  "ayurveda-jyotisha",
  "vastu",
  "samhita-detailed",
];
