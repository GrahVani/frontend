/**
 * Chowghadiya data aligned with:
 * curriculum/tier-1-foundation/module-23-muhurta-foundations/
 *   chapter-05-muhurta-cancellations-and-chowghadiya/lesson-03-chowghadiya.md
 *
 * Notes on orthography:
 *  - The lesson lists both "Cala" (favourable, movable) and "Char" (variable)
 *    as named characters. In most classical-tradition cycles these are regional
 *    variants of the same movable/variable segment. The canonical 7-name cycle
 *    below uses "Char" (matching the lesson's rotation in §4.4); the metadata
 *    records the alternate spelling "Cala" so the UI can surface the regional
 *    variance honestly.
 *  - "Udveg" is used (lesson §4.4), replacing the older component spelling
 *    "Udvega".
 */

export type DayKey =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type Classification = "favourable" | "unfavourable" | "variable";

export interface ChowghadiyaCharacter {
  /** Canonical cycle name used in weekday rotation. */
  name: string;
  /** Alternate spellings / regional names (e.g. Cala ↔ Char). */
  aliases: string[];
  /** IAST Sanskrit form for display. */
  sanskrit: string;
  /** Devanāgarī form for display. */
  devanagari: string;
  classification: Classification;
  /** Short meaning shown in badges. */
  meaning: string;
  /** Longer guidance shown in detail cards. */
  guidance: string;
  /** When is this character especially useful? */
  bestFor: string[];
  /** When should it be avoided? */
  avoidFor: string[];
  /** Colour token keyed to the classification framework. */
  color: string;
  /** Soft background tint. */
  bg: string;
}

export const DAYS: DayKey[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Canonical 7-name cycle. The 8th segment of each half-day repeats the start. */
export const CHOWGHADIYA_CYCLE: readonly string[] = [
  "Udveg",
  "Char",
  "Lābha",
  "Amṛta",
  "Kāla",
  "Śubha",
  "Roga",
];

export const CHOWGHADIYA_CHARACTERS: ChowghadiyaCharacter[] = [
  {
    name: "Amṛta",
    aliases: [],
    sanskrit: "Amṛta",
    devanagari: "अमृत",
    classification: "favourable",
    meaning: "Nectar — most favourable",
    guidance:
      "Universally favourable across event-types. Best segment for auspicious initiations when it can be matched.",
    bestFor: [
      "auspicious initiations",
      "document-signing",
      "new beginnings",
      "wedding muhūrta (as one input)",
    ],
    avoidFor: [],
    color: "#2d7d46",
    bg: "#E8F5EE",
  },
  {
    name: "Śubha",
    aliases: [],
    sanskrit: "Śubha",
    devanagari: "शुभ",
    classification: "favourable",
    meaning: "Auspicious — general success",
    guidance:
      "Favourable across many event-types; a reliable, broadly beneficial window.",
    bestFor: ["general beginnings", "meetings", "advice", "worship"],
    avoidFor: [],
    color: "#2d7d46",
    bg: "#E8F5EE",
  },
  {
    name: "Lābha",
    aliases: [],
    sanskrit: "Lābha",
    devanagari: "लाभ",
    classification: "favourable",
    meaning: "Gain / profit",
    guidance:
      "Favourable for financial, commercial and acquisition contexts.",
    bestFor: ["business calls", "commerce", "purchases", "investment talks"],
    avoidFor: [],
    color: "#2d7d46",
    bg: "#E8F5EE",
  },
  {
    name: "Char",
    aliases: ["Cala"],
    sanskrit: "Cala",
    devanagari: "चल",
    classification: "variable",
    meaning: "Movable / variable",
    guidance:
      "Context-dependent per regional tradition. Favoured where movement itself is the point — travel, shopping, momentum-actions. Some traditions treat it as neutral.",
    bestFor: ["travel", "shopping trips", "momentum-actions", "movement"],
    avoidFor: ["high-stakes fixed initiations without cross-check"],
    color: "#B8860B",
    bg: "#FDF6E3",
  },
  {
    name: "Roga",
    aliases: [],
    sanskrit: "Roga",
    devanagari: "रोग",
    classification: "unfavourable",
    meaning: "Illness / disease",
    guidance: "Inauspicious — avoid for auspicious initiations.",
    bestFor: [],
    avoidFor: ["new ventures", "auspicious beginnings", "important decisions"],
    color: "#A23A1E",
    bg: "#FDE8E5",
  },
  {
    name: "Udveg",
    aliases: ["Udvega"],
    sanskrit: "Udvega",
    devanagari: "उद्वेग",
    classification: "unfavourable",
    meaning: "Agitation / anxiety",
    guidance: "Inauspicious — creates restlessness. Avoid for new ventures.",
    bestFor: [],
    avoidFor: ["new ventures", "negotiations", "calm decisions"],
    color: "#A23A1E",
    bg: "#FDE8E5",
  },
  {
    name: "Kāla",
    aliases: [],
    sanskrit: "Kāla",
    devanagari: "काल",
    classification: "unfavourable",
    meaning: "Death / destruction",
    guidance: "Inauspicious — time as destroyer. Avoid for auspicious works.",
    bestFor: [],
    avoidFor: ["new ventures", "auspicious initiations", "travel"],
    color: "#A23A1E",
    bg: "#FDE8E5",
  },
];

/** Maps a canonical cycle name back to its metadata. */
export function getCharacterMeta(name: string): ChowghadiyaCharacter {
  const direct = CHOWGHADIYA_CHARACTERS.find((c) => c.name === name);
  if (direct) return direct;
  const alias = CHOWGHADIYA_CHARACTERS.find(
    (c) => c.aliases.includes(name) || name.toLowerCase() === c.name.toLowerCase()
  );
  return alias ?? CHOWGHADIYA_CHARACTERS[0];
}

/**
 * Per-vāra index into CHOWGHADIYA_CYCLE for the first DAY chowghadiya.
 * Lesson §4.4: Sun-Udveg, Mon-Amṛta, Tue-Roga, Wed-Lābha, Thu-Śubha,
 * Fri-Cala/Char, Sat-Kāla.
 */
export const DAY_START_INDEX: Record<DayKey, number> = {
  Sunday: 0, // Udveg
  Monday: 3, // Amṛta
  Tuesday: 6, // Roga
  Wednesday: 2, // Lābha
  Thursday: 5, // Śubha
  Friday: 1, // Char/Cala
  Saturday: 4, // Kāla
};

/** Rāhu-Kālam day-part (1–8 of the daytime) per weekday. Lesson §4.4 / standard tables. */
export const RAHU_KALAM_PART: Record<DayKey, number> = {
  Sunday: 8,
  Monday: 2,
  Tuesday: 7,
  Wednesday: 5,
  Thursday: 6,
  Friday: 4,
  Saturday: 3,
};

/** Yamagaṇḍa day-part (1–8) per weekday — standard sequence 4,3,2,1,7,6,5. */
export const YAMAGANDA_PART: Record<DayKey, number> = {
  Sunday: 4,
  Monday: 3,
  Tuesday: 2,
  Wednesday: 1,
  Thursday: 7,
  Friday: 6,
  Saturday: 5,
};

/** Sunrise/sunset presets to illustrate seasonal variation. */
export const SEASON_PRESETS: {
  label: string;
  sunrise: string;
  sunset: string;
}[] = [
  { label: "Equinox", sunrise: "06:00", sunset: "18:00" },
  { label: "Summer", sunrise: "05:30", sunset: "19:00" },
  { label: "Winter", sunrise: "07:00", sunset: "17:00" },
];

/** The śloka block from lesson §5. */
export const SLOKA = {
  devanagari:
    "अष्ट-भागः कृतो रात्राव् अह्नो 'पि पण्डितैः स्मृतः। षोडश-खण्डाः काल-प्रकार-विभागतः॥",
  iast: "aṣṭa-bhāgaḥ kṛto rātrāv ahno 'pi paṇḍitaiḥ smṛtaḥ | ṣoḍaśa-khaṇḍāḥ kāla-prakāra-vibhāgataḥ ||",
  english:
    "Eight portions made of night and day each per the learned; sixteen segments per the time-classification division.",
  source: "Muhūrta-Cintāmaṇi Chapter 7",
};

export interface CaseFile {
  id: string;
  /** Routine-day vs high-stakes — drives the envelope colour. */
  kind: "routine" | "high-stakes";
  /** Short headline. */
  title: string;
  /** The scenario text. */
  scenario: string;
  /** Day of the week for the example. */
  day: DayKey;
  /** The question posed to the learner. */
  question: string;
  /** Options the learner can pick. */
  options: {
    id: string;
    label: string;
    detail: string;
  }[];
  /** Correct option id. */
  correctOptionId: string;
  /** Verdict shown after answering. */
  verdict: {
    headline: string;
    body: string;
    chowghadiyaNote?: string;
  };
}

export const CASE_FILES: CaseFile[] = [
  {
    id: "routine-business-call",
    kind: "routine",
    title: "Wednesday business call",
    scenario:
      "A client wants a routine sub-day window for a business call on Wednesday morning.",
    day: "Wednesday",
    question: "Which Chowghadiya guidance is discipline-compliant?",
    options: [
      {
        id: "a",
        label: "Use the first ~90 min post-sunrise (Lābha)",
        detail: "Lābha is favourable for commerce and acquisition contexts.",
      },
      {
        id: "b",
        label: "Wait until the Kāla segment for a power move",
        detail: "Kāla is unfavourable for new ventures and should be avoided.",
      },
      {
        id: "c",
        label: "Schedule the call without checking Chowghadiya",
        detail: "For a routine decision this is acceptable, but Lābha is better.",
      },
    ],
    correctOptionId: "a",
    verdict: {
      headline: "Correct — Lābha supports commerce",
      body: "Wednesday sunrise starts Lābha. For a routine business call, this is an ideal practical-heuristic window. No integrated-method evaluation is required for such low-stakes decisions.",
      chowghadiyaNote: "Lābha · Gain / profit · Favourable",
    },
  },
  {
    id: "monday-document-signing",
    kind: "routine",
    title: "Monday document signing",
    scenario:
      "A client wants to sign a routine document on Monday. They ask for the simplest favourable window.",
    day: "Monday",
    question: "What is the best practical-heuristic recommendation?",
    options: [
      {
        id: "a",
        label: "First ~90 min post-sunrise (Amṛta)",
        detail: "Amṛta is the most favourable Chowghadiya across event types.",
      },
      {
        id: "b",
        label: "Afternoon Roga segment",
        detail: "Roga is unfavourable and should be avoided for signing.",
      },
      {
        id: "c",
        label: "Any time is fine for a routine document",
        detail: "True, but Amṛta is the strongest practical choice when feasible.",
      },
    ],
    correctOptionId: "a",
    verdict: {
      headline: "Correct — Amṛta is most favourable",
      body: "Monday sunrise starts Amṛta. For routine document-signing, the first post-sunrise window is excellent. This remains a practical heuristic, not a substitute for integrated method on high-stakes contracts.",
      chowghadiyaNote: "Amṛta · Nectar · Most favourable",
    },
  },
  {
    id: "wedding-muhurta",
    kind: "high-stakes",
    title: "Wedding muhūrta question",
    scenario:
      "A client asks: 'Can I just use Chowghadiya for my daughter's wedding-muhūrta? Amṛta Chowghadiya falls on Sunday afternoon — can I use that?'",
    day: "Sunday",
    question: "What is the discipline-compliant response?",
    options: [
      {
        id: "a",
        label: "Yes — Amṛta Chowghadiya is enough for a wedding",
        detail: "This is the practical-heuristic-substitution failure mode.",
      },
      {
        id: "b",
        label:
          "Amṛta is one input; wedding requires integrated four-pillar capstone + event-specific application",
        detail: "High-stakes events need the integrated method, not Chowghadiya alone.",
      },
      {
        id: "c",
        label: "Avoid Sunday entirely because it starts with Udveg",
        detail: "The sunrise-start is only the first segment; Sunday still contains favourable segments.",
      },
    ],
    correctOptionId: "b",
    verdict: {
      headline: "Correct — integrated method required",
      body: "Amṛta Chowghadiya is favourable, but wedding-muhūrta is high-stakes. It requires the integrated four-pillar capstone, event-type-specific wedding rules, and cumulative sub-day filters. Chowghadiya supplements; it does not substitute.",
      chowghadiyaNote: "Amṛta is one input among many — not the sole determinant.",
    },
  },
  {
    id: "cumulative-filter",
    kind: "high-stakes",
    title: "Sunday 2:00 PM convergence check",
    scenario:
      "A recommendation has converged on Sunday 2:00 PM. Check the cumulative sub-day filters for this moment.",
    day: "Sunday",
    question: "Does Sunday 2:00 PM satisfy the cumulative sub-day filter?",
    options: [
      {
        id: "a",
        label: "Yes — clears Rāhu/Yama/Gulika and falls in Śubha Chowghadiya",
        detail: "2:00 PM is in the 6th day segment (Śubha) and outside the daily inauspicious windows.",
      },
      {
        id: "b",
        label: "No — it overlaps Rāhu-Kāla",
        detail: "Sunday Rāhu-Kāla is 4:30–6:00 PM; 2:00 PM clears it.",
      },
      {
        id: "c",
        label: "No — it falls in Udveg",
        detail: "Sunday starts with Udveg; by 2:00 PM the cycle has moved to Śubha.",
      },
    ],
    correctOptionId: "a",
    verdict: {
      headline: "Correct — all three filters converge",
      body: "At Sunday 2:00 PM: Rāhu-Kāla (4:30–6 PM) is clear, Yamagaṇḍa (12–1:30 PM) is clear, Gulika-Kāla (3–4:30 PM) is clear, and the Chowghadiya is Śubha (favourable). This is cumulative sub-day filter convergence.",
      chowghadiyaNote: "Śubha · Auspicious · Favourable",
    },
  },
];

/** Helpers for time arithmetic. */
export function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
}

export function formatTime(decimal: number): string {
  const h = Math.floor(decimal) % 24;
  const m = Math.round((decimal - Math.floor(decimal)) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export interface Segment {
  quality: string;
  start: number;
  end: number;
  isDay: boolean;
  index: number;
}

/** Build the 8 day segments for a given weekday and sunrise/sunset. */
export function buildDaySegments(
  day: DayKey,
  sunriseDec: number,
  sunsetDec: number
): Segment[] {
  const dayLength = sunsetDec - sunriseDec;
  const segmentLen = dayLength / 8;
  const startIdx = DAY_START_INDEX[day];
  return Array.from({ length: 8 }, (_, i) => ({
    quality: CHOWGHADIYA_CYCLE[(startIdx + i) % CHOWGHADIYA_CYCLE.length],
    start: sunriseDec + i * segmentLen,
    end: sunriseDec + (i + 1) * segmentLen,
    isDay: true,
    index: i + 1,
  }));
}

/** Build the 8 night segments. Night start sits +5 places ahead of day start. */
export function buildNightSegments(
  day: DayKey,
  sunsetDec: number,
  sunriseDec: number
): Segment[] {
  const nightLength = 24 - (sunsetDec - sunriseDec);
  const segmentLen = nightLength / 8;
  const startIdx = (DAY_START_INDEX[day] + 5) % CHOWGHADIYA_CYCLE.length;
  return Array.from({ length: 8 }, (_, i) => ({
    quality: CHOWGHADIYA_CYCLE[(startIdx + i) % CHOWGHADIYA_CYCLE.length],
    start: sunsetDec + i * segmentLen,
    end: sunsetDec + (i + 1) * segmentLen,
    isDay: false,
    index: i + 1,
  }));
}

/** Whether two intervals overlap. */
export function intervalsOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): boolean {
  return aStart < bEnd && aEnd > bStart;
}
