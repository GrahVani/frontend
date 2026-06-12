/**
 * Lal Kitab vs Classical Comparator — data engine for Lesson 18.1.3.
 *
 * Static content for side-by-side comparison, two-readings scenarios,
 * feature-detector quiz, and frame-guard honesty checks.
 */

export interface ComparisonRow {
  aspect: string;
  lalKitab: string;
  classical: string;
  lalKitabDetail: string;
  classicalDetail: string;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    aspect: "House chart",
    lalKitab: 'Fixed-Aries Teva — Meṣa is always the 1st house, regardless of Lagna',
    classical: "Lagna-based — the rising sign defines the 1st house",
    lalKitabDetail:
      "The Teva never moves. Aries = 1st, Taurus = 2nd, ... Pisces = 12th for everyone. Two people with different Lagnas get identical house frames; only planetary placements vary.",
    classicalDetail:
      "The Lagna (rising sign) rotates the entire house wheel. Two people born minutes apart can have completely different 1st-house signs and therefore different house meanings for every planet.",
  },
  {
    aspect: "Planetary significations",
    lalKitab: "Redefined in Lal Kitab's own folk vocabulary; its own karakatva",
    classical: "Standard śāstra karakatva tables",
    lalKitabDetail:
      "Planets keep their names but acquire Lal-Kitab-specific meanings, often through vivid folk imagery and household associations. You cannot import classical karaka tables into a Teva.",
    classicalDetail:
      "Universal significator tables (Sun = ātmā, Jupiter = guru/children/wisdom, etc.) applied consistently across charts, modified by dignity, aspect, and yoga.",
  },
  {
    aspect: "Reading of affliction",
    lalKitab: "Ṛṇa (karmic-debt) framework — e.g. pitṛ-ṛṇa",
    classical: "Dignity, combustion, malefic association, aspect",
    lalKitabDetail:
      "Afflictions are ledger entries: debts owed and repayable. The interpretive task is diagnosing which debt; the remedy is settling it. A moral-practical model.",
    classicalDetail:
      "Affliction is assessed through a planet's dignity (exaltation, debilitation, mūlatrikona), combustion proximity to the Sun, association with malefics, and aspect geometry.",
  },
  {
    aspect: "Remedies (upāya)",
    lalKitab: "Cheap, practical household ṭoṭke — feeding animals, floating/donating objects",
    classical: "Gemstones, mantra japa, elaborate yajña rites",
    lalKitabDetail:
      "Deliberately inexpensive and physical. A remedy for afflicted Saturn might be feeding black dogs or floating mustard oil. No priest, no certified stone, no fee.",
    classicalDetail:
      "May require a certified gemstone (blue sapphire for Saturn), sustained mantra recitation (japa), or a fire ritual (yajña/homa) performed by a priest. Often costly.",
  },
  {
    aspect: "Aspect system",
    lalKitab: "No classical graha-dṛṣṭi in its Parāśarī form",
    classical: "Fixed aspect rules + special aspects of Mars/Jupiter/Saturn",
    lalKitabDetail:
      "Reads through fixed-house placements and debt logic rather than the classical aspect web. A different toolkit, not a missing tool.",
    classicalDetail:
      "Each planet aspects the 7th house from itself; Mars, Jupiter, and Saturn have additional special aspects (3rd/10th, 5th/9th, 3rd/10th respectively).",
  },
  {
    aspect: "Yoga doctrine",
    lalKitab: "No Parāśarī yoga catalogue as such",
    classical: "Extensive named-yoga catalogue (Rāja, Dhana, etc.)",
    lalKitabDetail:
      "Reads charts through its own house-based rules, not through named combinations. The concept of a 'yoga' in the Parāśarī sense does not carry over.",
    classicalDetail:
      "Hundreds of named yogas catalogued (Rāja-yoga, Dhana-yoga, Gaja-keśarī, etc.) that combine planets, houses, and lords in specific patterns.",
  },
  {
    aspect: "Timing (daśā)",
    lalKitab: "No Vimśottarī; uses a Varṣphala-like annual chart",
    classical: "120-year Vimśottarī daśā as the central timing system",
    lalKitabDetail:
      "Reaches for an annual-chart (Varṣphala-like) reading to time the year ahead. Not a gap waiting for Vimśottarī — a different timing apparatus entirely.",
    classicalDetail:
      "The 120-year mahādaśā system with planetary periods in a fixed sequence (Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury).",
  },
  {
    aspect: "Epistemic basis",
    lalKitab: "Empirical-folk — observed, practical Punjabi-folk patterns",
    classical: "Scriptural-classical — derived from Sanskrit śāstra",
    lalKitabDetail:
      "Built from observed rules-of-thumb codified in 1939–1952. Authority is the Farmān text; no claim of ancient sage transmission.",
    classicalDetail:
      "Derived from and justified by Sanskrit śāstra (Bṛhat Parāśara Horā Śāstra, Jaiminī Sūtras, etc.) with claimed ancient ṛṣi authorship.",
  },
];

export interface TwoReadingScenario {
  id: number;
  title: string;
  sharedContext: string;
  lalKitabReading: string;
  classicalReading: string;
  disciplineNote: string;
}

export const TWO_READING_SCENARIOS: TwoReadingScenario[] = [
  {
    id: 1,
    title: "Afflicted Saturn in the 8th house",
    sharedContext:
      "Saturn sits in the 8th house and is classically afflicted (enemy sign, aspected by Mars). Both traditions look at the identical placement.",
    lalKitabReading:
      "In the Teva, the 8th house is permanently Scorpio's house. The affliction is read as an active ṛṇa (karmic debt) — possibly pitṛ-ṛṇa or another named debt. The remedy is a cheap household ṭoṭka: feeding black dogs, floating a specified iron object, or donating on Saturday. No gemstone, no mantra.",
    classicalReading:
      "Assess Saturn's dignity (enemy sign = weak), its aspect situation (Mars's aspect adds malefic pressure), and 8th-house significations (longevity, obstacles, sudden events). Remedy: gemstone (blue sapphire), Saturn mantra japa, or a yajña rite.",
    disciplineNote:
      "Same Saturn, same 8th house. Each reading is internally consistent within its own framework. The point is to see the two dialects, not to crown a winner.",
  },
  {
    id: 2,
    title: 'A client asks "when will this difficult period ease?"',
    sharedContext:
      "The client wants timing for relief from an ongoing difficult period.",
    lalKitabReading:
      "Lal Kitab does not use Vimśottarī at all. It reaches for a Varṣphala-like annual chart, reading the year ahead through that annual lens. The practitioner interprets the coming year's fixed-Aries frame.",
    classicalReading:
      "The classical practitioner runs Vimśottarī daśā — locating the active mahādaśā and antardaśā lord periods. The timing is read through the 120-year planetary sequence.",
    disciplineNote:
      "Not 'different answer to the same calculation' — it is a different timing apparatus entirely. Mapping one onto the other is a category error.",
  },
];

export interface FeatureDetectorItem {
  id: number;
  statement: string;
  feature: string;
  explanation: string;
}

export const FEATURE_DETECTOR_ITEMS: FeatureDetectorItem[] = [
  {
    id: 1,
    statement: "The 1st house is always Aries, no matter what sign was rising at birth.",
    feature: "Fixed-Aries Teva chart",
    explanation:
      "This is the signature structural feature of Lal Kitab. Classical astrology keys the 1st house to the Lagna.",
  },
  {
    id: 2,
    statement:
      "A hard Mars placement is read as an outstanding debt to ancestors that must be acknowledged and repaid.",
    feature: "Ṛṇa (karmic-debt) framework",
    explanation:
      "The debt framework reframes affliction as something owed and repayable, not merely a weak planet.",
  },
  {
    id: 3,
    statement:
      "The remedy prescription is: feed black dogs on Saturday and float mustard oil in running water.",
    feature: "Cheap, practical upāyas (totke)",
    explanation:
      "Household-friendly, inexpensive actions are the signature Lal Kitab remedy style. Classical remedies would more likely be gemstones or mantra.",
  },
  {
    id: 4,
    statement:
      "Jupiter here signifies teaching, children, and wisdom according to the standard karaka tables.",
    feature: "Classical Parāśarī method",
    explanation:
      "Using standard śāstra karakatva tables is classical, not Lal Kitab. Lal Kitab redefines significations in its own vocabulary.",
  },
  {
    id: 5,
    statement:
      "There is no 3rd/10th special aspect from Saturn to consider; the reading relies on house placement and debt logic instead.",
    feature: "No classical graha-dṛṣṭi",
    explanation:
      "Lal Kitab does not use the classical aspect system. Saturn's special aspects (3rd and 10th) are a classical tool.",
  },
  {
    id: 6,
    statement:
      "This combination of Venus, Mercury, and the 10th lord in the 10th house forms a Rāja-yoga.",
    feature: "Classical Parāśarī method",
    explanation:
      "Named-yoga analysis (Rāja-yoga, Dhana-yoga, etc.) is classical. Lal Kitab has no Parāśarī yoga catalogue.",
  },
];

export interface FrameGuardItem {
  id: number;
  statement: string;
  isFair: boolean;
  feedback: string;
}

export const FRAME_GUARD_ITEMS: FrameGuardItem[] = [
  {
    id: 1,
    statement:
      "Lal Kitab is a different tradition with its own internally consistent framework; it is neither a corrupted Parāśarī nor a shortcut.",
    isFair: true,
    feedback:
      "Correct. This is the honest framing: different tradition, valid within its own framework.",
  },
  {
    id: 2,
    statement:
      "Lal Kitab is just a simplified version of classical astrology for people who cannot afford gemstones.",
    isFair: false,
    feedback:
      "Category error. Lal Kitab is a different tradition with its own fixed Teva, debt framework, and annual timing — not a simplified Parāśarī.",
  },
  {
    id: 3,
    statement:
      "You should never apply classical graha-dṛṣṭi to a Lal Kitab Teva chart.",
    isFair: true,
    feedback:
      "Correct. Mixing classical aspects into a Lal Kitab reading imports a tool from another tradition's toolkit.",
  },
  {
    id: 4,
    statement:
      "Since Lal Kitab has no Vimśottarī, it is incomplete and needs a classical daśā added to it.",
    isFair: false,
    feedback:
      "Category error. Lal Kitab uses a Varṣphala-like annual chart for timing. Its absence of Vimśottarī is not a gap — it is a different method.",
  },
  {
    id: 5,
    statement:
      "A Lal Kitab practitioner and a classical Parāśarī practitioner can both be competent; studying one does not invalidate the other.",
    isFair: true,
    feedback:
      "Correct. Both-legitimate-within-own-framework is the disciplined posture.",
  },
  {
    id: 6,
    statement:
      "Lal Kitab remedies are unscientific because they do not use certified gemstones or laboratory-tested materials.",
    isFair: false,
    feedback:
      "Category error. Judging Lal Kitab by classical/commercial remedial standards is a frame mismatch. Its cheap household totke are part of its folk-empirical method, not a failure to be classical.",
  },
];
