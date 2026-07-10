/**
 * Four-Stream Landscape Explorer — static data for L2.6 §4.
 *
 * Closes Chapter 2 by completing the multi-stream landscape:
 * Parāśari + Jaiminī + KP + Lal Kitab. Two foundational classical streams +
 * two modern-primaries. The §4 explorer establishes the modern-primary
 * doctrine (vs modern-revival), profiles each founder, enumerates their
 * distinctive contributions, and stages the three modern-primary criteria.
 */

export interface ModernAuthorshipKind {
  slug: "modern-primary" | "modern-revival";
  label: string;
  definition: string;
  example: string;
  citationDiscipline: string;
  authorityBasis: string;
}

export const MODERN_AUTHORSHIP_KINDS: ModernAuthorshipKind[] = [
  {
    slug: "modern-revival",
    label: "Modern Revival",
    definition:
      "A modern author who RECOVERS an existing classical tradition into mainstream operational practice. The doctrinal frameworks taught are classically founded; the modern reviver's contribution is making the classical material operationally accessible — translating, commenting, teaching — not originating new frameworks.",
    example:
      "Sanjay Rath (SJC) · K.N. Rao (BVB) · Iranganti Rangacharya — Jaiminī-tradition modern revivers (cara/sthira-rāśi-daśās, ārūḍha lagna, rāśi-aspects all classically founded in Jaiminī Sūtra)",
    citationDiscipline:
      "Cite the classical antecedent + the reviver's commentary: \"Jaiminī Sūtra [Adhyāya.Pāda.Sūtra] (Rath 2015 recension)\" — three-layer engagement (Sūtra + classical Sanskrit commentary + modern revival commentary)",
    authorityBasis:
      "Recovering-classical-foundation + commentary-quality. Classical authority is independently real; reviver provides operational accessibility.",
  },
  {
    slug: "modern-primary",
    label: "Modern Primary",
    definition:
      "A modern author who ORIGINATES a foundational doctrinal framework NOT derivable from earlier classical sources. The doctrinal framework is first-party authoritative within its stream — cited directly to the modern author, not relative-dated against classical anchors.",
    example:
      "K.S. Krishnamurti (KP) · Pandit Roop Chand Joshi (Lal Kitab) — both originated foundational frameworks (sub-lord theory, CSL methodology; 108 remedies, debt-of-ancestors framework) NOT derivable from BPHS, Bṛhat Jātaka, Saravali, Phaladīpikā, or any earlier classical source",
    citationDiscipline:
      "Cite the modern author's primary corpus directly: \"K.S. Krishnamurti, KP Reader [Volume:Chapter]\" — two-layer engagement (primary corpus + second-generation commentary)",
    authorityBasis:
      "Originating-author + active-practitioner-lineage. The framework works empirically per practitioner testimony; the author's corpus is THE foundational reference.",
  },
];

/** Three required criteria for modern-primary status. */
export interface ModernPrimaryCriterion {
  number: 1 | 2 | 3;
  name: string;
  shortName: string;
  description: string;
  kpEvidence: string;
  lalKitabEvidence: string;
}

export const MODERN_PRIMARY_CRITERIA: ModernPrimaryCriterion[] = [
  {
    number: 1,
    name: "Original framework origination",
    shortName: "Origination",
    description:
      "The author originates doctrinal frameworks NOT derivable from earlier classical sources. Mere refinements, restatements, or compilations of classical material do not qualify.",
    kpEvidence:
      "Sub-lord theory + CSL methodology + 1-249 horary number system are nowhere in BPHS, Bṛhat Jātaka, Saravali, Phaladīpikā, or any classical Sanskrit Jyotiṣa source. Originated through K.S. Krishnamurti's 1963-1972 empirical-testing program.",
    lalKitabEvidence:
      "108 remedies system + fixed-house framework + andha planet rules are nowhere in classical śānti material or classical Vedic-astrology. Originated by Pandit Roop Chand Joshi in 1939-1952 Urdu corpus.",
  },
  {
    number: 2,
    name: "Substantial active practitioner lineage",
    shortName: "Practitioner Lineage",
    description:
      "The framework has acquired a real practitioner community that operates the framework and teaches it forward. Solo theoretical proposals without active practitioner uptake do not qualify.",
    kpEvidence:
      "Second-generation commentary tradition (Subramaniam, Hariharan, Tin Win) + global KP practitioner community across South India, North America, UK + active KP horary practice + ongoing pedagogical-extension literature.",
    lalKitabEvidence:
      "Active Punjabi/North-Indian practitioner lineage + Hindi/English translation tradition (Krishnan Ashant, Beni Madhav Goswami) + sustained remedial-astrology practice in Punjab and adjacent regions + Lal Kitab seminar/teaching tradition.",
  },
  {
    number: 3,
    name: "Empirical predictive results",
    shortName: "Empirical Results",
    description:
      "The framework produces real predictive results within its operational scope per practitioner testimony. Untested theoretical frameworks do not qualify.",
    kpEvidence:
      "Documented event-timing precision through sub-lord/CSL/RP analysis per practitioner testimony — KP particularly celebrated for horary timing precision exceeding what classical Praśna alone delivers.",
    lalKitabEvidence:
      "Documented remedial efficacy through the 108-remedies system per practitioner testimony — Lal Kitab particularly celebrated for accessible, behavior-and-practical-action remedies that produce observable life-event shifts.",
  },
];

/** Stream founder biographical anchor. */
export interface StreamFounder {
  streamSlug: "kp" | "lal-kitab";
  streamLabel: string;
  streamDevanagari: string;
  founderName: string;
  founderDevanagari: string;
  born: string;
  died: string;
  ageAtDeath: number;
  primaryLocation: string;
  primaryCorpus: string;
  publicationArc: string;
  language: string;
  meaningOfName: string;
}

export const STREAM_FOUNDERS: StreamFounder[] = [
  {
    streamSlug: "kp",
    streamLabel: "KP (Krishnamurti Paddhati)",
    streamDevanagari: "कृष्णमूर्ति पद्धति",
    founderName: "K.S. Krishnamurti",
    founderDevanagari: "के.एस. कृष्णमूर्ति",
    born: "1908, Tamil Nadu, South India",
    died: "1972 (age 64)",
    ageAtDeath: 64,
    primaryLocation: "Chennai (Madras), Tamil Nadu",
    primaryCorpus: "KP Reader I-VI (six volumes), originally Tamil + English; published Krishnamurti Publications, Chennai",
    publicationArc:
      "Primary works 1963-1972. KP Reader I-VI established the foundational corpus; subsequent works developed specific technique-applications.",
    language: "Tamil + English (20th-century)",
    meaningOfName: "Paddhati = doctrinal approach / methodology; literally \"Krishnamurti's [doctrinal] approach\"",
  },
  {
    streamSlug: "lal-kitab",
    streamLabel: "Lal Kitab",
    streamDevanagari: "लाल किताब",
    founderName: "Pandit Roop Chand Joshi",
    founderDevanagari: "पण्डित रूप चन्द जोशी",
    born: "1898, Pharwala village, pre-Partition Punjab (now in Pakistan)",
    died: "1982 (age 84)",
    ageAtDeath: 84,
    primaryLocation: "Various Punjab locations across his lifetime",
    primaryCorpus: "Lal Kitab — 5 volumes in Urdu, originally Lahore (pre-Partition) and later Punjab (1939-1952)",
    publicationArc:
      "Primary works 1939-1952 in Urdu (5 volumes). Original Urdu corpus remains first-party authoritative; modern Hindi and English translations provide accessibility for non-Urdu readers.",
    language: "Urdu (20th-century, scholarly language of pre-Partition Punjab)",
    meaningOfName: "Lal Kitab = \"Red Book\" — named for the colour of the original Urdu book covers",
  },
];

/** Distinctive doctrinal contribution within a modern-primary stream. */
export interface StreamContribution {
  slug: string;
  streamSlug: "kp" | "lal-kitab";
  number: number;
  name: string;
  sanskritOrDevanagari?: string;
  shortDescription: string;
  fullDescription: string;
  classicalAntecedent: string;
}

export const KP_CONTRIBUTIONS: StreamContribution[] = [
  {
    slug: "sub-lord-theory",
    streamSlug: "kp",
    number: 1,
    name: "Sub-Lord Theory",
    sanskritOrDevanagari: "उप-स्वामी सिद्धान्त",
    shortDescription:
      "The centre-of-gravity contribution. Each Vimśottarī period's 800-minute nakṣatra-span is subdivided PROPORTIONALLY into 9 sub-lord regions; every degree of the zodiac falls within a specific sub-lord that determines event-likelihood and direction.",
    fullDescription:
      "A nakṣatra spans 13°20' (800') of arc. The 9 Vimśottarī period planets divide the 800' proportionally per their period-shares (Sun 6yr = 40' / Moon 10yr = 66.67' / Mars 7yr = 46.67' / Rahu 18yr = 120' / Jupiter 16yr = 106.67' / Saturn 19yr = 126.67' / Mercury 17yr = 113.33' / Ketu 7yr = 46.67' / Venus 20yr = 133.33', totalling 800'). Each sub-division is governed by its proportion-planet. A planet's star lord tells you the HOUSE from where the result will come; the sub-lord tells you WHETHER the event will or won't happen and its positive/negative direction.",
    classicalAntecedent:
      "NO classical antecedent. Nowhere in BPHS, Bṛhat Jātaka, Saravali, Phaladīpikā, Jātaka Pārijāta, or any other classical Sanskrit Jyotiṣa source is the sub-lord-of-each-degree-position-via-Vimśottarī-proportional-subdivision doctrine articulated. Originated by K.S. Krishnamurti.",
  },
  {
    slug: "cuspal-sub-lord",
    streamSlug: "kp",
    number: 2,
    name: "Cuspal Sub-Lord (CSL) Theory",
    shortDescription:
      "KP's signature methodological innovation. Each house cusp (computed in Placidus) has a sub-lord. The CSL determines outcomes for that house's matters — moving the analytical centre from grahas-in-rāśi-and-bhāva to sub-lord-of-cusp.",
    fullDescription:
      "The house cusp — the precise degree where each house begins, computed using Placidus house-system rather than equal-house or whole-sign — has a sub-lord. The CSL of each house determines outcomes for that house's matters. Operational consequence: KP analysis routinely begins with computing the 12 house cusps in Placidus, identifying the 12 CSLs, and reading the predictive significations for each house PRIMARILY through its CSL — not primarily through traditional graha-in-house or graha-aspecting-cusp logic.",
    classicalAntecedent:
      "NO classical antecedent. Classical Vedic uses whole-sign houses (1st house = rising rāśi); KP uses Placidus cusps + sub-lord-as-determinant. Originated by K.S. Krishnamurti.",
  },
  {
    slug: "ruling-planets",
    streamSlug: "kp",
    number: 3,
    name: "Ruling Planets (RP)",
    shortDescription:
      "Planets governing the MOMENT of query or chart-cast. RP set: day-lord + lagna-lord + lagna-star-lord + lagna-sub-lord + Moon-lord + Moon-star-lord + Moon-sub-lord. Events tend to occur during periods of planets appearing in RP.",
    fullDescription:
      "The Ruling Planets are the planets governing the moment a question is asked or a chart is taken. Standard RP set computed at the moment of query: Day-lord (Sunday=Sun, Monday=Moon, etc.) + Lagna-lord (sign-lord of rising sign at query moment) + Lagna-star-lord (nakṣatra-lord of rising sign) + Lagna-sub-lord + Moon-lord + Moon-star-lord + Moon-sub-lord. The Ruling Planets PARTICIPATE in event-timing — events tend to occur during periods/sub-periods of planets appearing in the RP list, particularly when reinforced by transit and progression alignment. This is the KP horary timing engine.",
    classicalAntecedent:
      "PARTIAL antecedent. Classical Praśna uses moment-of-query but does NOT use the specific day-lord + lagna-lord/star-lord/sub-lord + Moon-lord/star-lord/sub-lord RP-set formulation. KP's specific RP framework originated by K.S. Krishnamurti.",
  },
  {
    slug: "kp-horary-249",
    streamSlug: "kp",
    number: 4,
    name: "KP Horary 1-249 Number System",
    shortDescription:
      "Uniquely KP horary methodology. The querent picks a number 1-249; this number maps to a SPECIFIC sub-lord position in the zodiac (the horary lagna). No classical horary tradition (Praśna, Tājika) uses a 1-249 number system.",
    fullDescription:
      "KP horary (predictive astrology from a question rather than from birth) uses a distinctive 1-to-249 number-mapping system. The querent picks a number 1-249; this number maps to a specific sub-lord position in the zodiac (the number indicates which of the 249 sub-lord-divisions to use as the horary lagna). The horary chart is then erected using this position as the lagna and the moment of the query as the chart time.",
    classicalAntecedent:
      "NO classical antecedent. No classical horary tradition uses a 1-249 number system. Originated by K.S. Krishnamurti.",
  },
  {
    slug: "stellar-centre-of-gravity",
    streamSlug: "kp",
    number: 5,
    name: "Stellar (Nakṣatra-and-Sub-Lord) Centre-of-Gravity",
    shortDescription:
      "KP's overall doctrinal orientation: \"planet → star → sub\" — nakṣatra and its sub-lord are the PRIMARY analytical units; rāśi is secondary contextual frame. Contrasts with Parāśari's rāśi-and-bhāva-centric analysis.",
    fullDescription:
      "KP's overall doctrinal orientation is STELLAR rather than rāśi-centric: the nakṣatra (lunar mansion, 27 divisions of 13°20' each) and its sub-lord are the primary analytical units, with rāśi (sign) treated as secondary contextual frame. Practitioners describe KP analysis as \"planet → star → sub\" — the analytical hierarchy moves from planet (the agent) to star/nakṣatra (the dispositor) to sub-lord (the directional/event-likelihood-determinant). Contrasts with Parāśari analysis (rāśi-and-bhāva-centric with nakṣatra as supplementary).",
    classicalAntecedent:
      "PARTIAL antecedent. Aligns more closely with the nakṣatra-emphasis of pre-classical Vedic astrological observation than Parāśari rāśi-and-bhāva-centric analysis. The specific sub-lord refinement is uniquely KP.",
  },
];

export const LAL_KITAB_CONTRIBUTIONS: StreamContribution[] = [
  {
    slug: "108-remedies",
    streamSlug: "lal-kitab",
    number: 1,
    name: "The 108 Remedies System",
    sanskritOrDevanagari: "१०८ उपाय",
    shortDescription:
      "The MOST distinctive Lal Kitab contribution. ~108 practical actions — donating specific items, behavioural modifications, wearing/carrying items, simple ritual acts, relationship modifications — that mitigate predicted outcomes. \"Remedies a poor person can perform with no priest required.\"",
    fullDescription:
      "Lal Kitab provides approximately 108 remedies (upāya) — practical actions a person can take to mitigate predicted negative outcomes or strengthen positive ones. Examples: Donating specific items (jaggery, sugar, rice, salt, mustard oil, coconuts) on specific days for specific planetary mitigations · Behavioural modifications (avoiding alcohol, dietary discipline, charitable acts) · Wearing/carrying specific items (silver, copper, specific cloth colours) · Simple ritual acts (lighting specific lamps, feeding specific creatures, planting specific trees) · Relationship modifications (treating specific family members in specific ways).",
    classicalAntecedent:
      "NOT derivable from classical Parāśari śānti material, which prescribes mantras, yantras, gemstones, more elaborate ritual. Lal Kitab remedies emphasise simplicity, accessibility, and behavioural-and-practical action. Originated by Pandit Roop Chand Joshi.",
  },
  {
    slug: "pitr-rina",
    streamSlug: "lal-kitab",
    number: 2,
    name: "Debt-of-Ancestors Framework (Pitṛ Ṛṇa)",
    sanskritOrDevanagari: "पितृ ऋण",
    shortDescription:
      "The doctrine that the native carries karmic debts inherited from ancestors (typically 3-5 generations back), manifesting in chart-readable patterns. Provides specific indicators + specific remedies + predictive frameworks for ancestral-debt resolution.",
    fullDescription:
      "Lal Kitab uniquely emphasises the debt-of-ancestors (pitṛ ṛṇa) framework — the doctrine that the present native carries karmic debts inherited from ancestors (typically 3-5 generations back), and that these ancestral debts manifest in chart-readable patterns and require specific remedial action to resolve. Provides: Indicators in the chart of which ancestor-debt patterns are active · Specific remedies targeted to ancestor-debt resolution (often involving treatment of living elders, specific charitable acts toward father's-or-mother's-side relatives) · Predictive frameworks showing how unresolved ancestral debts manifest in life-events.",
    classicalAntecedent:
      "PARTIAL antecedent. Classical Parāśari discusses pitṛ-doṣa in pre-existing material, but the Lal Kitab framework is significantly more developed and operationally specific. The systematic operational framework is Joshi's origination.",
  },
  {
    slug: "andha-planets",
    streamSlug: "lal-kitab",
    number: 3,
    name: "Andha (Blind) Planet Rules",
    sanskritOrDevanagari: "अन्धा",
    shortDescription:
      "Lal Kitab uniquely categorises certain planets in certain positions as andha (\"blind\") — they cannot give results in their normal capacity until specific remedial action is taken. Specific signifying rules + specific remedy-prescriptions.",
    fullDescription:
      "Lal Kitab uniquely categorises certain planets in certain positions as andha (अन्धा, \"blind\") — meaning they cannot give results in their normal capacity until specific remedial action is taken. The andha condition has specific signifying rules and specific remedy-prescriptions in the Lal Kitab framework.",
    classicalAntecedent:
      "NO classical antecedent matches the andha doctrine exactly. Originated by Pandit Roop Chand Joshi.",
  },
  {
    slug: "fixed-house-framework",
    streamSlug: "lal-kitab",
    number: 4,
    name: "Fixed-House Framework",
    shortDescription:
      "Houses always correspond to fixed signs: 1st = Aries, 2nd = Taurus, 3rd = Gemini ... 12th = Pisces. INDEPENDENT of natal lagna. Produces a uniform analytical canvas across all charts.",
    fullDescription:
      "Lal Kitab uses a fixed-house framework where houses always correspond to fixed signs: 1st house always = Aries (Mesha) · 2nd = Taurus (Vṛṣabha) · 3rd = Gemini (Mithuna) ... through all 12 houses. Contrasts with Parāśari (and KP) where the 1st house = the rising rāśi at birth (variable per chart). Lal Kitab's fixed-house framework produces a uniform analytical canvas across all charts, with the planets' actual rāśi positions and the natal-rising-rāśi providing the variable input. The doctrinal-and-operational consequences cascade through the entire Lal Kitab predictive framework.",
    classicalAntecedent:
      "NO classical antecedent. Classical Vedic-astrology uses whole-sign houses keyed to rising rāśi (variable per chart). Originated by Pandit Roop Chand Joshi.",
  },
  {
    slug: "distinctive-bhava-significations",
    streamSlug: "lal-kitab",
    number: 5,
    name: "Distinctive Bhāva-Significations",
    shortDescription:
      "Lal Kitab assigns partially-different bhāva significations vs Parāśari. Certain bhāvas are uniquely \"blind\" or \"asleep\" in certain conditions. Not contradictory to Parāśari — operates at a different layer with overlap.",
    fullDescription:
      "Lal Kitab assigns partially-different bhāva significations compared to Parāśari. Lal Kitab emphasises certain bhāva-meanings (e.g., 4th house: mother, ancestors, real estate, treasury) that overlap with but extend Parāśari significations. Introduces unique bhāva-relationships (specific houses are uniquely \"blind\" or \"asleep\" in certain conditions; certain inter-house relationships create unique Lal Kitab predictive patterns). Combined with the fixed-house framework, produces a fundamentally different reading of the same chart-data. NOT contradictory to Parāśari — operates at a different layer with overlap.",
    classicalAntecedent:
      "PARTIAL overlap. Many bhāva-significations overlap with Parāśari; the unique extensions and \"blind/asleep\" conditions are Lal Kitab's origination.",
  },
  {
    slug: "kundali-chart-style",
    streamSlug: "lal-kitab",
    number: 6,
    name: "Distinctive Lal Kitab Kuṇḍalī Chart-Construction Style",
    sanskritOrDevanagari: "लाल किताब कुण्डली",
    shortDescription:
      "Visual chart-construction differs from standard North-Indian or South-Indian Vedic-astrology chart styles. Fixed-house representation with specific cell-layouts, planet-placement conventions, and reading-order.",
    fullDescription:
      "The visual chart-construction of Lal Kitab kuṇḍalī differs from standard North-Indian or South-Indian Vedic-astrology chart styles. The Lal Kitab kuṇḍalī uses a fixed-house representation with specific cell-layouts, planet-placement conventions, and reading-order — producing a visually distinctive chart that supports the fixed-house framework's analytical patterns.",
    classicalAntecedent:
      "NO classical antecedent for this specific visual convention. Originated by Pandit Roop Chand Joshi alongside the fixed-house framework.",
  },
];

/** Four-stream comparison row (for use in §7 dojo Tab 1). */
export interface StreamProfile {
  slug: "parashari" | "jaimini" | "kp" | "lal-kitab";
  label: string;
  devanagari: string;
  color: string;
  colorDeep: string;
  era: string;
  foundationalText: string;
  primaryDistinctive: string;
  analyticalUnit: string;
  citationDiscipline: string;
  classification: "classical-foundational" | "modern-primary";
  foundationalLanguage: string;
}

export const FOUR_STREAM_PROFILES: StreamProfile[] = [
  {
    slug: "parashari",
    label: "Parāśari",
    devanagari: "पाराशरी",
    color: "#9C7A2F",
    colorDeep: "#7A5E1E",
    era: "Pre-classical core + medieval recension + continuous mainstream practice",
    foundationalText:
      "BPHS (Parāśara) · Bṛhat Jātaka (Varāhamihira) · Saravali, Phaladīpikā, Jātaka Pārijāta, Praśna Tantra (medieval codifiers)",
    primaryDistinctive:
      "Encyclopaedic horā-bhāva-graha-varga-daśā-yoga framework with Vimśottarī (nakṣatra-based) as primary time-cycle",
    analyticalUnit: "Rāśi-and-bhāva-centric with nakṣatra as supplementary",
    citationDiscipline:
      "Classical-Sanskrit primary text + modern translator + recension specification (BPHS adhyāya, Bṛhat Jātaka chapter, etc.)",
    classification: "classical-foundational",
    foundationalLanguage: "Classical Sanskrit (verse + sūtra)",
  },
  {
    slug: "jaimini",
    label: "Jaiminī",
    devanagari: "जैमिनि",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
    era:
      "Pre-classical core + medieval recension + 16th-19th c. marginalisation + late-20th c. revival",
    foundationalText:
      "Jaiminī Sūtra (Upadeśa Sūtra) by Maharṣi Jaiminī · medieval commentary tradition · modern revival corpus (Rath/Rao/Rangacharya)",
    primaryDistinctive:
      "Cara/sthira-rāśi-daśās · ārūḍha lagna · rāśi-aspects · cara kārakas · Jaiminī yogas — sūtra-style genre requiring commentary",
    analyticalUnit: "Rāśi-aspect-and-cara-derivative-centric",
    citationDiscipline:
      "Jaiminī Sūtra [Adhyāya.Pāda.Sūtra] + classical Sanskrit commentary + modern revival commentary (three-layer engagement)",
    classification: "classical-foundational",
    foundationalLanguage: "Classical Sanskrit (sūtra-style)",
  },
  {
    slug: "kp",
    label: "KP (Krishnamurti Paddhati)",
    devanagari: "कृष्णमूर्ति पद्धति",
    color: "#3A8C5A",
    colorDeep: "#1F5A37",
    era: "Modern primary — 1908-1972 founder; active practitioner lineage",
    foundationalText: "KP Reader I-VI by K.S. Krishnamurti (1963-1972) — six-volume primary corpus",
    primaryDistinctive:
      "Sub-lord theory · CSL methodology · Ruling Planets · KP horary 1-249 system · stellar (nakṣatra-and-sub-lord) centre-of-gravity",
    analyticalUnit: "Nakṣatra-and-sub-lord-centric (\"planet → star → sub\")",
    citationDiscipline:
      "K.S. Krishnamurti's primary corpus directly (KP Reader [Volume:Chapter]) + second-generation commentary (Subramaniam, Hariharan, Tin Win)",
    classification: "modern-primary",
    foundationalLanguage: "Tamil + English (20th-century)",
  },
  {
    slug: "lal-kitab",
    label: "Lal Kitab",
    devanagari: "लाल किताब",
    color: "#8B2D4E",
    colorDeep: "#5E1A33",
    era: "Modern primary — 1898-1982 founder; active Punjabi/North-Indian practitioner lineage",
    foundationalText: "Lal Kitab — 5 volumes by Pandit Roop Chand Joshi (1939-1952, Urdu)",
    primaryDistinctive:
      "108 remedies system · debt-of-ancestors framework · andha planet rules · fixed-house framework · distinctive bhāva-significations + chart-construction",
    analyticalUnit: "Fixed-house-and-remedy-centric",
    citationDiscipline:
      "Pandit Roop Chand Joshi's Urdu primary (1939-1952 corpus) + named modern commentator (Krishnan Ashant, Beni Madhav Goswami) when using their extensions",
    classification: "modern-primary",
    foundationalLanguage: "Urdu (20th-century, scholarly language of pre-Partition Punjab)",
  },
];

export const FRAMEWORK_SUMMARY = {
  headline:
    "Four streams. Two classical-foundational + two modern-primary. All real classical-equivalents within their own framework.",
  body:
    "The four-stream classical landscape — Parāśari + Jaiminī + KP + Lal Kitab — is the curriculum's operationalisation of multi-stream-honesty at its most consequential. All four streams are real classical-equivalents within their own framework; they are COMPLEMENTARY, not competing — operating at different doctrinal-layers and emphasising different analytical units. Serious modern practice may use one as primary or draw from multiple per practitioner lineage and predictive context. Citation discipline distinguishes per stream; cross-stream evaluation requires within-stream fluency in the stream being evaluated.",
};
