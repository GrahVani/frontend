/**
 * Three Skandha Curriculum Map — static data.
 *
 * The three skandhas (Gaṇita, Horā, Saṁhitā) with their operational coverage,
 * foundational texts, curriculum module mappings, and stream-specific emphasis.
 *
 * Per Lesson 1.3.1 §4.1–4.7. Sources: BPHS Adhyāya 1.1-3,
 * Bṛhat Saṁhitā, Pañcasiddhāntikā, Sūrya Siddhānta, Siddhānta Śiromaṇi.
 */

export interface FoundationalText {
  title: string;
  author: string;
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
  primaryTexts: string[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
}

export interface SkandhaNode {
  slug: "ganita" | "hora" | "samhita";
  iast: string;
  devanagari: string;
  /** One-line functional definition. */
  function: string;
  /** Longer operational coverage paragraph. */
  coverage: string;
  /** Foundational classical texts for this skandha. */
  foundationalTexts: FoundationalText[];
  /** Curriculum modules that map primarily to this skandha. */
  curriculumModules: CurriculumModule[];
  /** Why this skandha occupies its structural role. */
  structuralRole: string;
  /** Stream-specific emphasis data. */
  streamEmphasis: StreamEmphasis[];
  /** Position label for the triangular diagram. */
  positionLabel: string;
  /** Colour token for the triangular node (derived from palette). */
  nodeColor: string;
  /** Deep colour for emphasis text. */
  nodeColorDeep: string;
  /** Sub-topics within this skandha. */
  topics: Topic[];
}

export const SKANDHA_NODES: SkandhaNode[] = [
  {
    slug: "ganita",
    iast: "Gaṇita",
    devanagari: "गणित",
    function: "Mathematical-astronomy + chart-erection mathematics + calendrical computation",
    coverage:
      "Gaṇita is the foundational substrate of Jyotiṣa. It covers the computation of planetary positions, lagna and bhāva-cusps, varga (divisional) charts, eclipse paths, saṅkrāntis, and the full calendrical machinery on which both Horā and Saṁhitā depend. Modern computational engines discharge most manual gaṇita work, but understanding the substrate remains essential.",
    foundationalTexts: [
      { title: "Sūrya Siddhānta", author: "Traditional (pre-Varāhamihira)", note: "Pre-classical foundational gaṇita text" },
      { title: "Pañcasiddhāntikā", author: "Varāhamihira", note: "Summary of five prior siddhāntas" },
      { title: "Siddhānta Śiromaṇi", author: "Bhāskara II (~1150 CE)", note: "Medieval gaṇita synthesis" },
    ],
    curriculumModules: [
      { code: "T1-03", name: "Gaṇita Foundations", tier: "Tier 1" },
      { code: "T1-13", name: "Pañcāṅga", tier: "Tier 1" },
      { code: "T1-17", name: "Time and Calendar Systems", tier: "Tier 1" },
      { code: "T2-15", name: "Astronomical Foundations", tier: "Tier 2" },
    ],
    structuralRole:
      "Foundational substrate — both Horā and Saṁhitā depend on gaṇita-computed data (planetary positions, cusps, eclipse paths). Without gaṇita, the predictive skandhas have no chart-data to operate on.",
    streamEmphasis: [
      {
        stream: "Parāśari",
        emphasis: "Deep classical gaṇita corpus",
        primaryTexts: ["Pañcasiddhāntikā", "Sūrya Siddhānta", "Siddhānta Śiromaṇi"],
      },
      { stream: "Jaiminī", emphasis: "Uses standard classical gaṇita", primaryTexts: ["No distinctively-Jaiminī gaṇita corpus"] },
      { stream: "KP", emphasis: "Standard computation + Placidus cusps", primaryTexts: ["Standard classical gaṇita + Western-imported house-cusp extension"] },
      { stream: "Lal Kitab", emphasis: "Uses standard classical gaṇita", primaryTexts: ["Standard classical gaṇita"] },
    ],
    positionLabel: "Foundational substrate",
    nodeColor: "#4F6FA8",
    nodeColorDeep: "#2F4778",
    topics: [
      { id: "astronomy", name: "Mathematical Astronomy", description: "Computation of planetary positions and eclipse paths." },
      { id: "chart-math", name: "Chart-erection Mathematics", description: "Calculation of lagna, bhāva-cusps, and divisional charts." },
      { id: "calendar", name: "Calendrical Computation", description: "Pañcāṅga generation and saṅkrānti timings." }
    ],
  },
  {
    slug: "hora",
    iast: "Horā",
    devanagari: "होरा",
    function: "Natal-and-predictive astrology + daśā analysis + cross-life-domain prediction",
    coverage:
      "Horā is the centre-of-gravity skandha for modern Vedic-astrology practice. It covers natal-chart reading, predictive timing (daśā systems), praśna (horary), muhūrta (electional), and all cross-life-domain interpretation (career, marriage, health, wealth, spirituality). It is the most operationalised skandha because individual-natal-chart prediction is the dominant client-facing use-case.",
    foundationalTexts: [
      { title: "Bṛhat Parāśara Horā Śāstra (BPHS)", author: "Parāśara (traditional) / medieval recension", note: "Most-cited classical horā text" },
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
      { code: "T1-18", name: "Muhūrta Intro", tier: "Tier 1" },
      { code: "T1-19", name: "Praśna Intro", tier: "Tier 1" },
      { code: "T1-20", name: "Remedial Astrology Intro", tier: "Tier 1" },
      { code: "T2-01–T2-12", name: "Predictive Methodology + Use-case modules", tier: "Tier 2" },
    ],
    structuralRole:
      "Most operationalised in modern practice — the centre-of-gravity skandha. Individual-natal-chart prediction is the dominant client-facing application; gaṇita is machine-discharged; saṁhitā is more specialised.",
    streamEmphasis: [
      {
        stream: "Parāśari",
        emphasis: "Encyclopaedic horā corpus — centre-of-gravity",
        primaryTexts: ["BPHS", "Bṛhat Jātaka", "Saravali", "Phaladīpikā", "Jātaka Pārijāta"],
      },
      {
        stream: "Jaiminī",
        emphasis: "Distinctive horā-centric framework",
        primaryTexts: ["Jaiminī Sūtra — cara-rāśi-daśās, ārūḍha, rāśi-aspects, cara-kārakas, Jaiminī yogas"],
      },
      {
        stream: "KP",
        emphasis: "Horā-centric with distinctive stellar methodology",
        primaryTexts: ["KP Reader — sub-lord, CSL, Ruling Planets, KP horary 1-249"],
      },
      {
        stream: "Lal Kitab",
        emphasis: "Horā-centric with distinctive remedy framework",
        primaryTexts: ["Lal Kitab — 108 remedies, debt-of-ancestors, andha-planets, fixed-house"],
      },
    ],
    positionLabel: "Centre of modern practice",
    nodeColor: "#A23A1E",
    nodeColorDeep: "#7A2A14",
    topics: [
      { id: "natal", name: "Natal Astrology (Jātaka)", description: "Reading individual life-patterns from the birth chart." },
      { id: "timing", name: "Predictive Timing (Daśās)", description: "Applying planetary periods to time events." },
      { id: "horary", name: "Horary Astrology (Praśna)", description: "Answering specific questions from a chart for the moment." },
      { id: "electional", name: "Electional Astrology (Muhūrta)", description: "Selecting auspicious times for actions." }
    ],
  },
  {
    slug: "samhita",
    iast: "Saṁhitā",
    devanagari: "संहिता",
    function: "Mundane astrology + omens + civic events + adjacent encyclopaedic disciplines",
    coverage:
      "Saṁhitā is the most encyclopaedic skandha. It covers mundane astrology (rāṣṭra-jyotiṣa), omens and portents (utpāta-nimitta), eclipse interpretation, comet observation, weather prediction, architecture (vāstu-śāstra), iconography, gemology (ratna-parīkṣā), perfumery, agriculture, and more. Its breadth is historically real (Bṛhat Saṁhitā's 106 chapters) but modern operational distribution has fragmented many topics into separate specialisations.",
    foundationalTexts: [
      { title: "Bṛhat Saṁhitā", author: "Varāhamihira (~575 CE)", note: "The dominant classical saṁhitā text — 106 chapters" },
    ],
    curriculumModules: [
      { code: "T1-22", name: "Vāstu Intro", tier: "Tier 1" },
      { code: "T2-19", name: "Mundane Astrology", tier: "Tier 2" },
      { code: "T2-21", name: "Saṁhitā Topics Mastery", tier: "Tier 2" },
    ],
    structuralRole:
      "Most encyclopaedic — the broadest topical scope. Covers everything from mundane prediction to gemology to weather to architecture to perfumery. Modern operational distribution has fragmented many saṁhitā topics into separate modern specialisations (Vāstu, gemology, etc.).",
    streamEmphasis: [
      {
        stream: "Parāśari",
        emphasis: "Dominant classical saṁhitā text",
        primaryTexts: ["Bṛhat Saṁhitā (Varāhamihira) — the encyclopaedic standard"],
      },
      { stream: "Jaiminī", emphasis: "Rare in distinctively-Jaiminī form", primaryTexts: ["Uses standard classical saṁhitā material"] },
      { stream: "KP", emphasis: "No distinctively-KP saṁhitā", primaryTexts: ["Uses standard classical saṁhitā material"] },
      { stream: "Lal Kitab", emphasis: "Some remedial overlap", primaryTexts: ["Remedial-application overlap with classical saṁhitā gemology / perfumery / charity material"] },
    ],
    positionLabel: "Encyclopaedic breadth",
    nodeColor: "#3A8C5A",
    nodeColorDeep: "#2A6A40",
    topics: [
      { id: "mundane", name: "Mundane Astrology", description: "Predictions for nations, leaders, and civic events." },
      { id: "omens", name: "Omens & Portents", description: "Interpretation of terrestrial and atmospheric signs." },
      { id: "vastu", name: "Architecture (Vāstu)", description: "Spatial arrangement and structural auspiciousness." },
      { id: "weather", name: "Weather Prediction", description: "Forecasting rainfall and agricultural cycles." }
    ],
  },
];

/** Canonical order for rendering rows. */
export const ROW_ORDER: SkandhaNode["slug"][] = ["ganita", "hora", "samhita"];
