/**
 * Jyotiṣa vs Western Tropical vs Sun-Sign Pop — comparison data (L3 §4).
 *
 * Six discriminating dimensions × three tradition-categories. Per L3 §4.2
 * and §4.3 of the lesson markdown — the disambiguation discipline:
 * recognition + respect, not dismissal.
 *
 * Tradition colours match the Grahvani chapter-accent palette: gold
 * (Vedic), indigo (Western tropical), muted bronze (sun-sign pop —
 * lower-tier intentionally, reflecting the categorically-different
 * entertainment-format status, not a moral judgment).
 */

export type TraditionSlug = "vedic" | "western" | "pop";

export interface Tradition {
  slug: TraditionSlug;
  name: string;
  longName: string;
  color: string;
  colorDeep: string;
  tagline: string;
  /** What this tradition is FOR, in one phrase. */
  function: string;
}

export const TRADITIONS: Tradition[] = [
  {
    slug: "vedic",
    name: "Vedic Jyotiṣa",
    longName: "Classical Vedic Jyotiṣa",
    color: "#9C7A2F",
    colorDeep: "#7A5E1E",
    tagline: "Per-individual classical-tradition astrology",
    function: "Consultation, decision-support, life-orientation grounded in karma doctrine",
  },
  {
    slug: "western",
    name: "Western Tropical",
    longName: "Western Tropical Astrology",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
    tagline: "Hellenistic-lineage tropical-frame astrology",
    function: "Per-individual chart reading using tropical zodiac + Western methodology",
  },
  {
    slug: "pop",
    name: "Sun-Sign Pop",
    longName: "Sun-Sign Popular Astrology",
    color: "#A87830",
    colorDeep: "#7A5212",
    tagline: "Generalised entertainment-format astrology",
    function: "Mass-media entertainment, conversation-starter, lifestyle reference",
  },
];

export type DimensionSlug =
  | "zodiac-frame"
  | "methodology"
  | "predictive-vocabulary"
  | "per-individual-depth"
  | "indication-vs-determination"
  | "format-purpose";

export interface DimensionRow {
  slug: DimensionSlug;
  label: string;
  /** One-line teaser for the dimension chip. */
  teaser: string;
  values: Record<
    TraditionSlug,
    {
      headline: string;
      detail: string;
    }
  >;
  /** What two or more traditions share on this dimension. */
  convergence: string;
  /** Where they diverge most sharply. */
  divergence: string;
}

export const DIMENSIONS: DimensionRow[] = [
  {
    slug: "zodiac-frame",
    label: "Zodiac frame",
    teaser: "Which 0° Aries are we talking about?",
    values: {
      vedic: {
        headline: "Sidereal (fixed-star anchor)",
        detail:
          "0° Mesha anchored to a specific point in the actual constellation Aries. Lahiri ayanāṁśa is the Indian-government standard, with B.V. Raman and Krishnamurti (KP) ayanāṁśa variants also in use.",
      },
      western: {
        headline: "Tropical (seasonal anchor)",
        detail:
          "0° Aries defined by the vernal equinox — the Sun crossing the celestial equator northward in the Northern Hemisphere's spring. The frame moves with the seasons, not with the stars.",
      },
      pop: {
        headline: "Tropical (inherited, unexamined)",
        detail:
          "Operates within the tropical frame inherited from Western astrology but never engages the underlying frame-choice doctrinally — sun-sign columns simply assume the tropical Sun-sign without articulating why.",
      },
    },
    convergence:
      "Both Vedic and Western use a 12-sign zodiac with the same naming and structural qualities — the disagreement is purely about which celestial point is 0° Aries / 0° Mesha.",
    divergence:
      "~24° of current drift between tropical and sidereal frames (precession of the equinoxes, ~50.3 arc-sec/year). A planet 'in tropical Aries' by Western reading is often in *sidereal Pisces* by Vedic reading — shifting the rāśi entirely for almost the first 24° of every Western sign.",
  },
  {
    slug: "methodology",
    label: "Methodology",
    teaser: "How many legitimate streams of interpretation?",
    values: {
      vedic: {
        headline: "Multi-stream (5 major)",
        detail:
          "Parāśara, KP, Jaimini, Lal Kitab, Tājika coexist as legitimate interpretive frames, each with classical authority. The full multi-stream synthesis discipline (T2-13) treats all five as coordinated equals.",
      },
      western: {
        headline: "Single-stream (with modern variants)",
        detail:
          "One Western tropical methodology with internal variants — classical/traditional Western (Hellenistic lineage) vs psychological/modern Western (Linda Goodman, Liz Greene, Steven Forrest) — but no equivalent of Jyotiṣa's coordinated multi-stream synthesis.",
      },
      pop: {
        headline: "No methodology — sun-sign templating",
        detail:
          "Sun-sign popular astrology uses no methodology in the technical sense. Content is templated per zodiac sign and varied by author voice; there is no underlying interpretive framework with classical authority.",
      },
    },
    convergence:
      "Vedic and Western both treat astrology as a coherent interpretive discipline with classical lineage — both have authoritative texts, named lineages of teachers, and technical apparatus.",
    divergence:
      "A Western practitioner produces one reading per chart; a Vedic practitioner produces *five readings* (one per stream) plus a synthesis statement naming convergences and divergences honestly. Categorically different cognitive structures.",
  },
  {
    slug: "predictive-vocabulary",
    label: "Predictive vocabulary",
    teaser: "What time-engine does each tradition use?",
    values: {
      vedic: {
        headline: "Daśās (planetary periods)",
        detail:
          "Daśā systems — Vimśottarī (120-year cycle, beginning from Moon's nakṣatra at birth per BPHS Daśākramaprakaraṇa, chs. 46–48), Yoginī, Aṣṭottarī, etc. — are the primary time-engine. Transits serve as a secondary trigger layer.",
      },
      western: {
        headline: "Progressions + transits + solar arcs",
        detail:
          "Secondary progressions (day-for-a-year), transits (planets' current sky positions), and solar arcs (Sun's progressed position as a directional engine). No structural analogue to a 16-year planetary period assigned by Moon's nakṣatra.",
      },
      pop: {
        headline: "Today's forecast by Sun-sign",
        detail:
          "Predictive content scoped to the day, week, or month — generalised across one-twelfth of the world's population sharing the Sun-sign. No precise time-engine; the forecast windows are templated to the editorial cycle.",
      },
    },
    convergence:
      "Vedic and Western both have technical predictive vocabularies anchored to chart computation — both use planetary positions over time to derive predictive content.",
    divergence:
      "Vimśottarī mahādaśā has no Western equivalent; secondary progressions have no direct Vedic equivalent. The two predictive vocabularies are not translations of each other.",
  },
  {
    slug: "per-individual-depth",
    label: "Per-individual depth",
    teaser: "How much per-individual data is required?",
    values: {
      vedic: {
        headline: "Maximum — precise time + place + ayanāṁśa",
        detail:
          "Requires precise birth date + birth time (often to the minute) + latitude/longitude + ayanāṁśa choice + Moon's nakṣatra at birth + Lagna at birth, plus many other per-individual computational specifics.",
      },
      western: {
        headline: "High — precise time + place required",
        detail:
          "Requires precise birth date + birth time + latitude/longitude. Less computational specifics than Vedic (no ayanāṁśa choice, no Moon-nakṣatra-based daśā lord), but still operates at per-individual level.",
      },
      pop: {
        headline: "Minimum — birth date only",
        detail:
          "Requires only the birth date. The Sun-sign is then deterministic across the ~30-day window. Approximately one-twelfth of the world's population (~600 million people) shares any given Sun-sign.",
      },
    },
    convergence:
      "Vedic and Western both treat each person as a unique chart with computational specifics — pop astrology does not.",
    divergence:
      "Vedic requires ayanāṁśa choice + Moon's nakṣatra + many other specifics that Western doesn't; pop astrology requires only the birth date and speaks to 600 million people simultaneously.",
  },
  {
    slug: "indication-vs-determination",
    label: "Indication vs determination",
    teaser: "What does the tradition actually claim it can deliver?",
    values: {
      vedic: {
        headline: "Indications with confidence-tier framing",
        detail:
          "Classical doctrine produces statements like 'strong indication of marriage in the 24-36 month window' or 'moderate indication of career change in 2026-2027' — bounded by the karma philosophy (saṁcita / prārabdha / āgāmī / kriyamāṇa) covered next lesson.",
      },
      western: {
        headline: "Varied — depends on practitioner school",
        detail:
          "Psychological-Western tends toward archetypal interpretation rather than concrete prediction; traditional-Hellenistic Western retains more concrete predictive claims. Practitioner-dependent rather than tradition-uniform.",
      },
      pop: {
        headline: "Deterministic-concrete-and-soon",
        detail:
          "Sun-sign columns often promise specific outcomes within short windows — 'you will meet someone special this week', 'Friday will be your lucky day'. The framing is deterministic-concrete, scaled to the editorial cycle.",
      },
    },
    convergence:
      "Vedic and traditional-Hellenistic Western both produce predictive claims; both have classical authority frameworks bounding what can honestly be claimed.",
    divergence:
      "Vedic *indication framing* is incoherent with pop astrology's deterministic specifics; the two have categorically different epistemic structures. Indication framing is *more honest*, not weaker.",
  },
  {
    slug: "format-purpose",
    label: "Format / purpose",
    teaser: "What is each tradition actually for?",
    values: {
      vedic: {
        headline: "Consultation + decision-support",
        detail:
          "Intended for serious individual application — life-orientation, marriage timing, career inflection points, spiritual orientation. Held to the per-individual computational discipline the application requires.",
      },
      western: {
        headline: "Consultation + self-knowledge",
        detail:
          "Modern psychological Western especially serves self-knowledge / archetypal reflection; traditional Western retains more decision-support function. Held to per-individual chart-reading discipline.",
      },
      pop: {
        headline: "Entertainment + lifestyle reference",
        detail:
          "Mass-media entertainment, conversation-starter, broad lifestyle reference. Not intended for, and not held to, the per-individual computational discipline of serious astrology. Not 'evil' — a different format serving a different purpose.",
      },
    },
    convergence:
      "Vedic and Western traditions both serve serious individual application; both have practitioner-discipline frameworks for consultation work.",
    divergence:
      "Pop astrology serves an entertainment / mass-media function — categorically different from consultation work. Confusing the two (in either direction) is the practitioner-discipline error this lesson disarms.",
  },
];

/** Indo-Hellenistic transmission — the shared lineage between Vedic and Western. */
export const SHARED_CONCEPTS = [
  { vedic: "12 rāśis", western: "12 zodiac signs", note: "Same naming and structural qualities at the conceptual level." },
  { vedic: "7 grahas + Rāhu/Ketu", western: "7 classical planets + nodes", note: "Vedic adds Rāhu and Ketu (lunar nodes) as full grahas; Western traditionally treats them as significant points." },
  { vedic: "12 bhāvas", western: "12 houses", note: "Substantial overlap in significations, with some Vedic-specific elaborations (e.g., Bhāva chalitā chart)." },
  { vedic: "Graha-dṛṣṭi", western: "Planetary aspects", note: "Structural similarity; aspect distances differ — Vedic uses full-sign + special aspects; Western uses arc-distance + orb." },
];
