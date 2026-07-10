/**
 * Disambiguation Dojo — L3 §7 flagship data.
 *
 * Two views' data:
 *   1. LINEAGE: Indo-Hellenistic transmission timeline + shared concepts +
 *      ayanāṁśa drift slider data. Per Pingree (1978, 1981).
 *   2. DRILL: Five real-world scenarios where the practitioner must identify
 *      which astrology tradition is being referenced. Tests the
 *      disambiguation discipline of L3 §4.4 viscerally.
 */

export type TraditionSlug = "vedic" | "western-traditional" | "western-modern" | "pop";

export interface TimelineEvent {
  /** Historical date (BCE/CE marked). */
  date: string;
  /** Sort key for chronological ordering. */
  year: number;
  title: string;
  description: string;
  /** Which side of the transmission lineage this event belongs to. */
  side: "west" | "east" | "shared";
  /** Source citation (Pingree, Defouw, BPHS, etc.). */
  source?: string;
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    date: "~500 BCE",
    year: -500,
    title: "Babylonian astronomical foundations",
    description:
      "Babylonian astronomers develop the mathematical framework for tracking planetary positions and the zodiac concept. This work flows westward to Greece and eastward over later centuries.",
    side: "west",
  },
  {
    date: "~300 BCE",
    year: -300,
    title: "Hellenistic synthesis begins in Alexandria",
    description:
      "Greek astrologers in Alexandria synthesise Babylonian computation with Greek philosophy and Egyptian decanal symbolism. The Hellenistic astrological tradition flowers.",
    side: "west",
    source: "Pingree (1981) HIL Vol VI",
  },
  {
    date: "~150 CE",
    year: 150,
    title: "Ptolemy's Tetrabiblos",
    description:
      "The Hellenistic tradition is consolidated in Ptolemy's foundational text — the cornerstone of subsequent Western astrological lineage.",
    side: "west",
  },
  {
    date: "~100 BCE – 200 CE",
    year: 0,
    title: "Indo-Greek contact in Gandhara",
    description:
      "Indo-Greek and Indo-Scythian kingdoms in north-west India serve as the bridge through which Hellenistic astrological concepts enter Indian intellectual culture. Bilateral exchange begins.",
    side: "shared",
    source: "Pingree (1978) Yavanajātaka Vol 1 Introduction",
  },
  {
    date: "269 CE",
    year: 269,
    title: "Yavanajātaka translated by Sphujidhvaja",
    description:
      "The Greek astrological text is rendered into Sanskrit. 'Yavana' means 'Greek'. This is the canonical documented moment of Hellenistic-to-Indian transmission — the source text Pingree's modern edition translates and analyses.",
    side: "shared",
    source: "Pingree (1978) Yavanajātaka",
  },
  {
    date: "~500 CE",
    year: 500,
    title: "Varāhamihira's Bṛhat Saṁhitā + Bṛhat Jātaka",
    description:
      "Indian astrologer Varāhamihira absorbs Hellenistic material, transforms it through Indian philosophical and computational frameworks, and produces the foundational classical Jyotiṣa corpus that is still studied today.",
    side: "east",
  },
  {
    date: "~700 CE",
    year: 700,
    title: "BPHS attributed to Parāśara codified",
    description:
      "Bṛhat Parāśara Horā Śāstra emerges as the definitive Vedic Jyotiṣa text. The Parāśarī stream — the largest of the five — is codified. Indian Jyotiṣa now operates fully on its own terms.",
    side: "east",
  },
  {
    date: "~1200 – 1600 CE",
    year: 1400,
    title: "Medieval / Renaissance Western lineage",
    description:
      "Western tropical astrology continues independently through Arabic translation, Medieval European synthesis, and the Renaissance — culminating in the traditional Western lineage that modern psychological Western later transforms.",
    side: "west",
  },
  {
    date: "1930",
    year: 1930,
    title: "Newspaper sun-sign astrology born",
    description:
      "R.H. Naylor's Sunday Express column 'What the Stars Foretell' (24 August 1930) is the canonical origin point of the sun-sign popular-astrology format. This is a recent invention — categorically different from both Vedic and traditional Western lineages.",
    side: "west",
  },
];

export interface SharedConcept {
  vedic: string;
  western: string;
  note: string;
}

export const SHARED_CONCEPTS: SharedConcept[] = [
  {
    vedic: "12 rāśis",
    western: "12 zodiac signs",
    note: "Same naming and structural qualities at the conceptual level; ayanāṁśa drift produces different boundary points.",
  },
  {
    vedic: "7 grahas + Rāhu/Ketu",
    western: "7 classical planets + nodes",
    note: "Vedic treats Rāhu and Ketu (lunar nodes) as full grahas with their own significations; Western traditionally treats them as significant points.",
  },
  {
    vedic: "12 bhāvas",
    western: "12 houses",
    note: "Substantial overlap in significations. Vedic adds the bhāva-chalita chart for refined house cusps.",
  },
  {
    vedic: "Graha-dṛṣṭi",
    western: "Planetary aspects",
    note: "Structural similarity. Aspect distances differ — Vedic uses full-sign + special aspects; Western uses arc-distance + orb.",
  },
  {
    vedic: "Lagna",
    western: "Ascendant",
    note: "Same concept — the eastern horizon at birth. Both traditions treat it as a foundational chart-anchor.",
  },
];

/** Ayanāṁśa drift values at historical dates (Lahiri ayanāṁśa, approximate). */
export interface DriftPoint {
  year: number;
  driftDegrees: number;
  label: string;
}

export const DRIFT_TIMELINE: DriftPoint[] = [
  { year: 285, driftDegrees: 0, label: "Citrā-pakṣa zero point — sidereal and tropical aligned." },
  { year: 500, driftDegrees: 3, label: "Varāhamihira's era — drift just beginning." },
  { year: 1000, driftDegrees: 10.1, label: "Medieval period." },
  { year: 1500, driftDegrees: 17.1, label: "Renaissance Europe." },
  { year: 2000, driftDegrees: 23.85, label: "Year 2000." },
  { year: 2026, driftDegrees: 24.21, label: "Current — 2026." },
];

export interface DrillScenario {
  id: string;
  /** Short title for the scenarios-at-a-glance mini-list (≤7 words). */
  title: string;
  prompt: string;
  /** All four options shown to the user. Exactly one is correct. */
  options: { slug: TraditionSlug | "needs-clarification"; label: string }[];
  correctSlug: TraditionSlug | "needs-clarification";
  rationale: string;
  /** Cross-reference to the §4.4 practitioner-discipline move that applies. */
  disciplineMove: string;
}

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    id: "s1",
    title: "Friend's daily horoscope",
    prompt:
      "A friend says, casually: \"I read my horoscope this morning — apparently it's a good day for Tauruses.\" Which tradition are they referencing?",
    options: [
      { slug: "vedic", label: "Vedic Jyotiṣa" },
      { slug: "western-traditional", label: "Traditional Western astrology" },
      { slug: "pop", label: "Sun-sign popular astrology" },
      { slug: "needs-clarification", label: "Need to clarify before answering" },
    ],
    correctSlug: "pop",
    rationale:
      "\"Reading my horoscope\" + a one-word Sun-sign identifier (\"Tauruses\") + a daily-window forecast is the canonical signature of sun-sign popular astrology. No birth time, no chart, no per-individual data — just the Sun-sign and the day. Engaging substantively requires recognising this format and not assuming classical Jyotiṣa is being referenced.",
    disciplineMove:
      "Recognise the format (sun-sign daily) and engage at the appropriate register — entertainment / conversation-starter, not chart-reading.",
  },
  {
    id: "s2",
    title: "Liz Greene & archetypal Saturn return",
    prompt:
      "A colleague says: \"I've been getting into Western astrology — I find Liz Greene's archetypal work fascinating. She does this incredible analysis of Saturn return.\" Which tradition are they referencing?",
    options: [
      { slug: "vedic", label: "Vedic Jyotiṣa" },
      { slug: "western-traditional", label: "Traditional / Hellenistic Western astrology" },
      { slug: "western-modern", label: "Modern psychological Western astrology" },
      { slug: "pop", label: "Sun-sign popular astrology" },
    ],
    correctSlug: "western-modern",
    rationale:
      "Liz Greene is a foundational figure of modern psychological Western astrology — the post-Jungian archetypal lineage distinct from both traditional Hellenistic Western (Ptolemy → medieval/Renaissance) and from pop-format sun-sign astrology. \"Saturn return\" framing + \"archetypal\" + per-individual chart work locates this clearly. A learner with Vedic background would not silently translate \"Saturn return\" into a Vedic doctrine — these are different traditions with shared planet names but different predictive vocabularies.",
    disciplineMove:
      "Distinguish modern psychological Western from traditional Western from Vedic. Each has its own classical authority and serves its own consultation function.",
  },
  {
    id: "s3",
    title: "Deterministic promotion forecast request",
    prompt:
      "A client emails: \"I want to know if I'll get the promotion this Friday. Yes or no, definitively. I've heard astrology can tell me.\" What's the practitioner's correct response?",
    options: [
      { slug: "pop", label: "Yes — this is what astrology is for. Give them the yes-or-no." },
      { slug: "vedic", label: "Reframe — explain that classical Jyotiṣa produces indications with confidence-tier framing, not deterministic yes-or-no." },
      { slug: "western-traditional", label: "Yes if you use traditional Western methods; deterministic forecasts are possible there." },
      { slug: "needs-clarification", label: "Refuse the consultation entirely; deterministic prediction is unethical." },
    ],
    correctSlug: "vedic",
    rationale:
      "The client is operating on the sun-sign-pop epistemic structure (deterministic-concrete-and-soon) and assuming classical Jyotiṣa shares that structure. Classical doctrine produces *indications with confidence-tier framing* — bounded by the karma philosophy (saṁcita / prārabdha / āgāmī / kriyamāṇa, covered next lesson). The practitioner's correct move is to reframe expectations honestly: \"there is a [strong / moderate / weak] indication of career advancement in the [time window]\" rather than yes-or-no by Friday. The client may then choose whether the framing matches their need.",
    disciplineMove:
      "Reframe deterministic-specifics requests into indication-with-confidence-tier framing. This is consultation discipline (T2-23 Chapter 1), not a polite refusal — it is what classical Jyotiṣa actually delivers.",
  },
  {
    id: "s4",
    title: "\"Pluto retrograde for all Cancers\"",
    prompt:
      "A blog post reads: \"Pluto retrograde is going to be brutal for all Cancers this season — expect emotional upheaval and unexpected confrontations.\" Which tradition is operating here?",
    options: [
      { slug: "vedic", label: "Vedic Jyotiṣa — Cancer = Karka rāśi, Pluto as a graha indication" },
      { slug: "western-traditional", label: "Traditional Western — Pluto-Cancer transit interpretation" },
      { slug: "western-modern", label: "Modern psychological Western — Pluto archetypal framing" },
      { slug: "pop", label: "Sun-sign popular astrology — using Western planet names at sun-sign-pop depth" },
    ],
    correctSlug: "pop",
    rationale:
      "Two giveaways: (a) generalisation across \"all Cancers\" — one-twelfth of the population, no per-individual data; (b) deterministic-concrete-and-soon framing (\"will be brutal\", \"expect upheaval\"). The use of Pluto (a Western tropical planet, not a Vedic graha) and \"Cancer\" (Western/English naming) doesn't make this serious Western astrology — it makes it sun-sign popular astrology *using Western terminology* at pop-format depth. A traditional-Western practitioner would not write this; Liz Greene would not write this. The format is what classifies it.",
    disciplineMove:
      "Tradition is classified by format and depth, not just by terminology. Western planet names appearing in pop-format content does NOT make the content traditional or modern Western — it makes it pop-format using Western vocabulary.",
  },
  {
    id: "s5",
    title: "Vedic chart with daśā analysis",
    prompt:
      "A new client says: \"I have my birth time precise to the minute — 4:47 AM in Chennai on 12 March 1988. I want a full chart reading with daśā analysis and a Parāśarī interpretation of my career arc.\" Which tradition?",
    options: [
      { slug: "vedic", label: "Classical Vedic Jyotiṣa" },
      { slug: "western-traditional", label: "Traditional Hellenistic Western astrology" },
      { slug: "western-modern", label: "Modern psychological Western astrology" },
      { slug: "pop", label: "Sun-sign popular astrology" },
    ],
    correctSlug: "vedic",
    rationale:
      "Precise birth time + birth location + the request for *daśā analysis* and *Parāśarī interpretation* unambiguously locates this in classical Vedic Jyotiṣa. Daśā is the Vedic time-engine (Vimśottarī begins from Moon's nakṣatra at birth per BPHS Daśākramaprakaraṇa, chs. 46–48); Parāśarī is the largest of the five Vedic streams. This client knows what they're asking for — the practitioner can proceed directly into chart-reading discipline rather than disambiguation conversation.",
    disciplineMove:
      "When the client uses Vedic technical vocabulary (daśā, Parāśarī, nakṣatra, ayanāṁśa) and supplies precise per-individual data, the disambiguation work is already done — proceed to consultation. This is the ideal client-encounter shape.",
  },
];

/** Honest-framing summary — appears as a callout in the Lineage tab. */
export const HONEST_FRAMING = {
  title: "Disambiguation with respect",
  body: "Vedic Jyotiṣa and Western tropical astrology are *cousins* with substantive shared lineage (Indo-Hellenistic transmission, ~100 BCE – 700 CE) and meaningful structural divergences (sidereal vs tropical frame, multi-stream vs single-stream methodology, daśā vs progression time-engine). Sun-sign popular astrology is *categorically different* — generalised entertainment-format rather than per-individual classical-tradition, born in 1930 with R.H. Naylor's newspaper column. The practitioner-discipline move is *recognition + respect*, not dismissal — but also not conflation.",
};
