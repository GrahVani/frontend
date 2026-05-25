/**
 * Historical Timeline — static data for L2.1 §4.
 *
 * 12 major Jyotiṣa authors/texts placed on a chronological axis spanning
 * pre-classical (Lagadha) through modern primaries (KP, 1972). Each entry
 * carries BOTH academic-Indology dating (primary curriculum default) AND
 * traditional dating (cultural-religious authority) — per L4.3's "hold
 * both honestly" discipline.
 *
 * Academic dating per Pingree (1981), Plofker (2009), Mak (2014+), Sferra
 * — the modern academic-Indology consensus. Traditional dating per the
 * lineage texts' own self-attributions and the commentarial literature.
 */

export type StreamSlug =
  | "pre-classical"
  | "parashari"
  | "jaimini"
  | "tajika"
  | "prasna"
  | "kp"
  | "lal-kitab";

export type RecensionLevel = "low" | "moderate" | "major";

export interface StreamConfig {
  slug: StreamSlug;
  label: string;
  color: string;
  colorDeep: string;
  description: string;
}

export const STREAMS: StreamConfig[] = [
  {
    slug: "pre-classical",
    label: "Pre-classical",
    color: "#7A5E1E",
    colorDeep: "#5C4818",
    description: "Vedāṅga-era foundations, ritual-timing focus",
  },
  {
    slug: "parashari",
    label: "Parāśarī",
    color: "#9C7A2F",
    colorDeep: "#7A5E1E",
    description: "Largest stream — BPHS lineage, full natal-chart discipline",
  },
  {
    slug: "jaimini",
    label: "Jaimini",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
    description: "Aphoristic sūtra-style, second-largest stream",
  },
  {
    slug: "tajika",
    label: "Tājika",
    color: "#A23A1E",
    colorDeep: "#7A2A14",
    description: "Persian-Vedic synthesis, annual-chart specialist",
  },
  {
    slug: "prasna",
    label: "Praśna",
    color: "#C28220",
    colorDeep: "#7A5212",
    description: "Horary tradition, Kerala school",
  },
  {
    slug: "kp",
    label: "KP",
    color: "#3A8C5A",
    colorDeep: "#1F5A37",
    description: "Krishnamurti Paddhati — modern primary, 1963-1972",
  },
  {
    slug: "lal-kitab",
    label: "Lal Kitab",
    color: "#A87830",
    colorDeep: "#7A5212",
    description: "Joshi's remedial-focused tradition — modern primary",
  },
];

export interface TimelineEntry {
  slug: string;
  /** Display name of the author (or "Anonymous" / "Tradition" if no individual). */
  author: string;
  /** Display name of the primary text/work. */
  text: string;
  /** IAST form of the author's name (for h4 display). */
  authorIast: string;
  /** Anchor year on the timeline (academic-dating midpoint, used for positioning). */
  academicYear: number;
  /** Academic-dating range as a human-readable label. */
  academicDateLabel: string;
  /** Traditional-dating anchor year (if significantly different from academic). */
  traditionalYear?: number;
  /** Traditional-dating range as a human-readable label. */
  traditionalDateLabel?: string;
  /** Tradition / stream this entry belongs to. */
  stream: StreamSlug;
  /** How severe the recension problem is for this text. */
  recension: RecensionLevel;
  /** One-line characterisation for the timeline marker tooltip / side panel header. */
  oneLiner: string;
  /** Full description revealed in the active-detail panel. */
  detail: string;
  /** Where the Grahvani curriculum cites this work (cross-reference note). */
  curriculumCites: string;
}

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    slug: "lagadha-vedanga-jyotisha",
    author: "Lagadha",
    authorIast: "Lagadha",
    text: "Vedāṅga Jyotiṣa",
    academicYear: -800,
    academicDateLabel: "~1200 BCE to ~400 BCE",
    traditionalYear: -1300,
    traditionalDateLabel: "~1400-1200 BCE (Vedic era)",
    stream: "pre-classical",
    recension: "major",
    oneLiner: "The earliest surviving Indian Jyotiṣa text — ritual-timing focus",
    detail:
      "Lagadha's Vedāṅga Jyotiṣa is the foundational anchor for the entire Indian astronomical-astrological tradition. It is a Vedic-era text concerned with RITUAL TIMING (when to perform Vedic sacrifices), NOT with natal chart-reading. The natal-chart discipline emerges much later. Traditional dating places it in the late Vedic period (~1400 BCE); academic-Indology dating, based on internal astronomical references and linguistic analysis, ranges from ~1200 BCE down to as late as ~400 BCE depending on which scholar you consult. The disagreement spans nearly a millennium.",
    curriculumCites:
      "L1.1.1 (Jyotiṣa as Vedāṅga) §5 śloka block + L1.2.2 (Why Jyotiṣa Uses Sidereal Zodiac) for the astronomical-data dating debate",
  },
  {
    slug: "parashara-bphs",
    author: "Maharṣi Parāśara",
    authorIast: "Maharṣi Parāśara",
    text: "Bṛhat Parāśara Horā Śāstra",
    academicYear: 1200,
    academicDateLabel: "10th-14th c. CE (recensional)",
    traditionalYear: -3000,
    traditionalDateLabel: "Pre-classical Vedic ṛṣi (~3000 BCE traditional)",
    stream: "parashari",
    recension: "major",
    oneLiner: "Most-cited classical source — but with the deepest recension problem",
    detail:
      "BPHS is the foundational text of the largest Vedic stream (Parāśarī). The author — Maharṣi Parāśara — is a pre-classical Vedic ṛṣi-figure within tradition (Mahābhārata-era, often dated ~3000 BCE traditionally). The TEXT as we have it, however, exists only in MEDIEVAL RECENSIONS (10th-14th c. CE per Pingree) — the same text is preserved in multiple manuscript families with substantial variations. The CORE DOCTRINE is likely much older than the recensional form; teasing apart 'genuinely Parāśara' from 'medieval-compiler accretion' is one of the recurring scholarly problems in Indian-astrology textual studies.",
    curriculumCites:
      "Every Parāśarī lesson across Tier 1 + Tier 2 — most heavily L1.2.3 (Vimśottarī Daśā) and T2-13 (Multi-Stream Synthesis)",
  },
  {
    slug: "jaimini-sutras",
    author: "Maharṣi Jaiminī",
    authorIast: "Maharṣi Jaiminī",
    text: "Jaiminī Sūtras",
    academicYear: 200,
    academicDateLabel: "Classical composition; commentaries medieval",
    traditionalYear: -2800,
    traditionalDateLabel: "Pre-classical ṛṣi-figure, contemporary of Parāśara",
    stream: "jaimini",
    recension: "moderate",
    oneLiner: "Aphoristic sūtra-style; the second Vedic stream",
    detail:
      "Jaimini's sūtras are pithy aphorisms — extremely terse, requiring commentary-based unpacking. Traditional dating places Maharṣi Jaiminī as a pre-classical ṛṣi (often as a contemporary of Parāśara). Academic dating treats the composition as classical-era with extensive medieval commentary supplementing the original sūtras. Pedagogically, Jaimini's chart-reading methodology — chara kārakas, Ārūḍha lagna, special yogas — operates quite differently from Parāśarī conventions.",
    curriculumCites: "T1-17 (Jaimini stream introduction) + T2-13 multi-stream synthesis",
  },
  {
    slug: "sphujidhvaja-yavanajataka",
    author: "Sphujidhvaja",
    authorIast: "Sphujidhvaja",
    text: "Yavanajātaka",
    academicYear: 269,
    academicDateLabel: "269 CE (colophon)",
    stream: "pre-classical",
    recension: "low",
    oneLiner: "The Indo-Hellenistic transmission — most-reliably-dateable early text",
    detail:
      "The Yavanajātaka ('Greek horoscopy') is the canonical documented moment of Hellenistic-to-Indian astrological transmission. The COLOPHON gives an explicit date — 269 CE — making this one of the most reliably-dateable early Indian astrology texts. The work's name (yavana = 'Greek') openly acknowledges the Indo-Hellenistic synthesis. This is the text academic-Indology scholars (especially Pingree) treat as the dating-anchor for the entire pre-classical Indian-astrology corpus.",
    curriculumCites: "L1.1.3 (Jyotiṣa vs Western) §4.2 — the Indo-Hellenistic lineage discussion",
  },
  {
    slug: "varahamihira-corpus",
    author: "Varāhamihira",
    authorIast: "Varāhamihira",
    text: "Bṛhat Saṁhitā / Bṛhat Jātaka / Pañca-siddhāntikā",
    academicYear: 546,
    academicDateLabel: "505-587 CE",
    stream: "parashari",
    recension: "low",
    oneLiner: "The most-reliably-dateable classical author + systematic codifier",
    detail:
      "Varāhamihira is the keystone of classical-era Indian astrology. His three major works codify the field across all three skandhas: Bṛhat Saṁhitā (saṁhitā / omenology), Bṛhat Jātaka (horoscopy), and Pañca-siddhāntikā (siddhānta / mathematical astronomy). Academic dating places him 505-587 CE with high confidence. He explicitly cites earlier authors (Lagadha, Garga, Maharṣis), giving us an UPPER BOUND for those earlier works. This is the reliable-date anchor that calibrates everything else.",
    curriculumCites: "Cited across the curriculum — most heavily in T1-04 (Bhāva), T2 muhūrta lessons, and the Saṁhitā introduction",
  },
  {
    slug: "kalyanavarma-saravali",
    author: "Kalyāṇavarmā",
    authorIast: "Kalyāṇavarmā",
    text: "Saravali",
    academicYear: 900,
    academicDateLabel: "8th-10th c. CE",
    stream: "parashari",
    recension: "moderate",
    oneLiner: "Comprehensive Parāśarī compilation, expanding Varāhamihira's framework",
    detail:
      "Saravali ('Best of the Excellent') is a comprehensive Parāśarī treatise that compiles, expands, and refines material from earlier classical sources — especially Varāhamihira. It is foundational for many medieval-era Parāśarī teaching lineages. Academic dating places it in the 8th-10th century CE window with reasonable confidence. The recension problem is moderate (multiple manuscript families exist, but the variations are less severe than for BPHS).",
    curriculumCites: "T1-06 (Yogas), T1-07 (Aspects), T2 Parāśarī synthesis lessons",
  },
  {
    slug: "mantresvara-phaladipika",
    author: "Mantreśvara",
    authorIast: "Mantreśvara",
    text: "Phaladīpikā",
    academicYear: 1350,
    academicDateLabel: "14th c. CE (Kerala school)",
    stream: "parashari",
    recension: "low",
    oneLiner: "The clearest pedagogically-organised classical text",
    detail:
      "Phaladīpikā ('Lamp of Results') is among the most pedagogically-organised classical texts. It synthesises Parāśarī doctrine with Kerala-school refinements, presented in a structured chapter-by-chapter format that has made it a favorite teaching-text for the modern era. Academic dating places it firmly in the 14th century CE; the recension problem is low (the manuscript family is relatively stable).",
    curriculumCites: "T1-05 (Bhāva phala), T1-08 (Yogas), T2 predictive-discipline lessons",
  },
  {
    slug: "vaidyanatha-jataka-parijata",
    author: "Vaidyanātha Dīkṣita",
    authorIast: "Vaidyanātha Dīkṣita",
    text: "Jātaka Pārijāta",
    academicYear: 1550,
    academicDateLabel: "15th-16th c. CE",
    stream: "parashari",
    recension: "moderate",
    oneLiner: "Comprehensive Parāśarī treatise of the early modern era",
    detail:
      "Jātaka Pārijāta ('The Wish-Granting Tree of Natal Astrology') is a comprehensive late-medieval Parāśarī work. Academic dating places it in the 15th-16th century CE — early modern era. Pedagogically it sits between Phaladīpikā's accessibility and BPHS's depth.",
    curriculumCites: "T1-08 (Yogas), T2 advanced-Parāśarī lessons",
  },
  {
    slug: "nilakantha-tajika-nilakanthi",
    author: "Nīlakaṇṭha",
    authorIast: "Nīlakaṇṭha",
    text: "Tājika Nīlakaṇṭhī",
    academicYear: 1575,
    academicDateLabel: "16th c. CE",
    stream: "tajika",
    recension: "low",
    oneLiner: "The codifier of Tājika (Persian-Vedic synthesis)",
    detail:
      "Nīlakaṇṭha's Tājika Nīlakaṇṭhī is the foundational text of the Tājika stream — the Persian-Vedic synthesis that emerged from Indo-Persian cultural contact. Tājika brings ANNUAL-CHART (varṣaphala) techniques and certain aspect-distance refinements into Vedic astrology. Academic dating places it firmly in the 16th century CE; the recension problem is low.",
    curriculumCites: "T1-19 (Tājika stream introduction), T2 varṣaphala lessons",
  },
  {
    slug: "panchanana-prasna-marga",
    author: "Pañcānana Brahmaśrī",
    authorIast: "Pañcānana Brahmaśrī",
    text: "Praśna Mārga",
    academicYear: 1650,
    academicDateLabel: "17th c. CE (Kerala school)",
    stream: "prasna",
    recension: "low",
    oneLiner: "The foundational horary (Praśna) text — Kerala school",
    detail:
      "Praśna Mārga ('The Path of Praśna') is the foundational text of the Praśna (horary) discipline within Vedic astrology. The Kerala school refined Praśna into a sophisticated parallel discipline to natal chart-reading — answering specific questions from the chart cast at the moment of the question. Academic dating: 17th century CE.",
    curriculumCites: "T2-09 (Praśna methodology), T2 horary lessons",
  },
  {
    slug: "joshi-lal-kitab",
    author: "Pandit Roop Chand Joshi",
    authorIast: "Pandit Roop Chand Joshi",
    text: "Lal Kitab",
    academicYear: 1945,
    academicDateLabel: "1939-1952 (five primary editions)",
    stream: "lal-kitab",
    recension: "low",
    oneLiner: "Modern primary — remedial-focused, NOT modern derivative",
    detail:
      "Lal Kitab is a MODERN PRIMARY tradition — authored by Pandit Roop Chand Joshi between 1939 and 1952 across five primary editions. It is NOT a derivative simplification of classical astrology; it is a real, independent tradition with its own remedial-focused methodology and a substantial practitioner community in North India. Academic dating is uncontested (the publication record is clear). Critical distinction: when a learner encounters Lal Kitab, they should NOT mistake it for either 'modern derivative' OR 'ancient classical' — it is a 20th-century primary tradition.",
    curriculumCites: "T1-18 (Lal Kitab stream introduction), T2 remedies discipline",
  },
  {
    slug: "krishnamurti-kp-reader",
    author: "K.S. Krishnamurti",
    authorIast: "K.S. Krishnamurti",
    text: "KP Reader I-VI",
    academicYear: 1968,
    academicDateLabel: "1963-1972",
    stream: "kp",
    recension: "low",
    oneLiner: "Modern primary — Krishnamurti Paddhati, the second 20th-c. founding",
    detail:
      "Krishnamurti Paddhati (KP) is the second MODERN PRIMARY tradition — codified by K.S. Krishnamurti through his KP Reader I-VI series (1963-1972). KP introduces the sub-lord, sub-sub-lord, and significator methodology that differs substantially from Parāśarī conventions. It has a large global practitioner community and is treated as a serious primary stream — not a derivative. Academic dating is uncontested (the publication record is clear).",
    curriculumCites: "T1-16 (KP stream introduction), T2 KP-discipline lessons",
  },
];

/** Recension-severity display config. */
export const RECENSION_DISPLAY: Record<RecensionLevel, { label: string; color: string; note: string }> = {
  low: {
    label: "Recension: low",
    color: "#3A8C5A",
    note: "Text family is relatively stable; reliably attributable to its named author.",
  },
  moderate: {
    label: "Recension: moderate",
    color: "#C28220",
    note: "Multiple manuscript families exist; variations present but core text is identifiable.",
  },
  major: {
    label: "Recension: major",
    color: "#A23A1E",
    note: "Text exists in significantly-varying recensional forms; the named author's specific contribution is partly entangled with medieval compiler accretion.",
  },
};

/** Honest-citation discipline — appears in the side panel + the §7 dojo. */
export const CITATION_DISCIPLINE_MOVES = [
  "Which classical source? Name the specific text, not vague 'classical tradition'.",
  "What date? Cite the academic dating; note traditional dating where it differs significantly.",
  "What recension? Especially for BPHS, name which recensional form the citation reads.",
  "What modern translator? When citing in English, name the translator-edition — different translations carry different interpretive choices.",
];
