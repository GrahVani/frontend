/**
 * Engine for Lesson 23.3.3 — Muhūrta Lagna: Lagna-Śuddhi Evaluator.
 *
 * Provides the 12-rāśi database with event-type-specific lagna-affinity per §4.5,
 * three-criterion lagna-śuddhi evaluation logic per §4.3,
 * upachaya-malefic exception per §4.6,
 * sign-synergy relationship calculator per §4.4,
 * diagnostic scenarios from §6 + §8, and
 * four-pillar capstone integration data per §4.7.
 */

/* ── Types ────────────────────────────────────────────────── */

export type Modality = "cara" | "sthira" | "dvi-svabhava";
export type Element = "agni" | "prithvi" | "vayu" | "jala";
export type Gender = "masculine" | "feminine";

export type EventTypeKey =
  | "wedding"
  | "griha-pravesha"
  | "business-launch"
  | "travel"
  | "education"
  | "foundation-stone"
  | "surgery";

export type Dignity = "own" | "exalted" | "moola-trikona" | "friendly" | "neutral" | "enemy" | "debilitated";
export type HouseQuality = "kendra" | "trikona" | "upachaya" | "dusthana" | "maraka" | "neutral-house";

export type Verdict = "strong" | "moderate" | "weak" | "poor";
export type SignRelation =
  | "same"
  | "kendra"
  | "trikona"
  | "3rd-11th"
  | "2nd-12th"
  | "6th-8th"
  | "7th";

export type IssueKey =
  | "single-pillar-dominance"
  | "upachaya-exception-refused"
  | "sign-affinity-misidentified"
  | "synergy-ignored"
  | "malefic-all-bad"
  | "none";

export type ScenarioVerdict = "favourable" | "avoid" | "exception-applies" | "mixed" | "needs-adjustment";

/* ── 12-Rāśi Database ─────────────────────────────────────── */

export interface RashiData {
  number: number;
  name: string;
  devanagari: string;
  english: string;
  ruler: string;
  rulerDevanagari: string;
  modality: Modality;
  element: Element;
  gender: Gender;
  /** Event types for which this lagna is classically favoured */
  favouredFor: EventTypeKey[];
  /** Character description for event-type matching */
  character: string;
}

export const RASHI_DB: RashiData[] = [
  {
    number: 1, name: "Meṣa", devanagari: "मेष", english: "Aries",
    ruler: "Maṅgala", rulerDevanagari: "मङ्गल",
    modality: "cara", element: "agni", gender: "masculine",
    favouredFor: ["travel", "surgery"],
    character: "Initiative, courage, momentum — Mars-ruled cara-rāśi for action-events",
  },
  {
    number: 2, name: "Vṛṣabha", devanagari: "वृषभ", english: "Taurus",
    ruler: "Śukra", rulerDevanagari: "शुक्र",
    modality: "sthira", element: "prithvi", gender: "feminine",
    favouredFor: ["wedding", "griha-pravesha", "business-launch", "foundation-stone"],
    character: "Material prosperity, Venus-ruled stability — ideal for foundational + partnership events",
  },
  {
    number: 3, name: "Mithuna", devanagari: "मिथुन", english: "Gemini",
    ruler: "Budha", rulerDevanagari: "बुध",
    modality: "dvi-svabhava", element: "vayu", gender: "masculine",
    favouredFor: ["wedding", "business-launch", "education", "travel"],
    character: "Communication, commerce, adaptability — Mercury-ruled dvi-svabhāva for dual-character events",
  },
  {
    number: 4, name: "Karkaṭa", devanagari: "कर्कट", english: "Cancer",
    ruler: "Candra", rulerDevanagari: "चन्द्र",
    modality: "cara", element: "jala", gender: "feminine",
    favouredFor: ["griha-pravesha", "travel"],
    character: "Domesticity, nurturing, emotional security — Moon-ruled cara-rāśi for home + travel",
  },
  {
    number: 5, name: "Siṁha", devanagari: "सिंह", english: "Leo",
    ruler: "Sūrya", rulerDevanagari: "सूर्य",
    modality: "sthira", element: "agni", gender: "masculine",
    favouredFor: ["business-launch", "foundation-stone"],
    character: "Authority, leadership, regal presence — Sun-ruled sthira-rāśi for leadership events",
  },
  {
    number: 6, name: "Kanyā", devanagari: "कन्या", english: "Virgo",
    ruler: "Budha", rulerDevanagari: "बुध",
    modality: "dvi-svabhava", element: "prithvi", gender: "feminine",
    favouredFor: ["business-launch", "education"],
    character: "Analysis, precision, commerce — Mercury-ruled dvi-svabhāva for analytical undertakings",
  },
  {
    number: 7, name: "Tulā", devanagari: "तुला", english: "Libra",
    ruler: "Śukra", rulerDevanagari: "शुक्र",
    modality: "cara", element: "vayu", gender: "masculine",
    favouredFor: ["wedding", "travel"],
    character: "Partnership, aesthetics, balance — Venus-ruled cara-rāśi for partnership + travel",
  },
  {
    number: 8, name: "Vṛścika", devanagari: "वृश्चिक", english: "Scorpio",
    ruler: "Maṅgala", rulerDevanagari: "मङ्गल",
    modality: "sthira", element: "jala", gender: "feminine",
    favouredFor: ["foundation-stone", "surgery"],
    character: "Depth, transformation, intensity — Mars-ruled sthira-rāśi for transformative + surgical events",
  },
  {
    number: 9, name: "Dhanu", devanagari: "धनु", english: "Sagittarius",
    ruler: "Guru", rulerDevanagari: "गुरु",
    modality: "dvi-svabhava", element: "agni", gender: "masculine",
    favouredFor: ["education"],
    character: "Wisdom, dharma, expansive learning — Jupiter-ruled dvi-svabhāva for knowledge-tradition",
  },
  {
    number: 10, name: "Makara", devanagari: "मकर", english: "Capricorn",
    ruler: "Śani", rulerDevanagari: "शनि",
    modality: "cara", element: "prithvi", gender: "feminine",
    favouredFor: ["travel"],
    character: "Discipline, structured ambition — Saturn-ruled cara-rāśi for momentum events",
  },
  {
    number: 11, name: "Kumbha", devanagari: "कुम्भ", english: "Aquarius",
    ruler: "Śani", rulerDevanagari: "शनि",
    modality: "sthira", element: "vayu", gender: "masculine",
    favouredFor: ["foundation-stone"],
    character: "Long-duration, humanitarian vision — Saturn-ruled sthira-rāśi for enduring foundations",
  },
  {
    number: 12, name: "Mīna", devanagari: "मीन", english: "Pisces",
    ruler: "Guru", rulerDevanagari: "गुरु",
    modality: "dvi-svabhava", element: "jala", gender: "feminine",
    favouredFor: ["wedding", "education"],
    character: "Spiritual, devotional, compassionate — Jupiter-ruled dvi-svabhāva for sacred events",
  },
];

/* ── Event-Type Database (§4.5) ───────────────────────────── */

export interface EventType {
  key: EventTypeKey;
  label: string;
  devanagari: string;
  favouredSignNumbers: number[];
  grounding: string;
  modalityPreference: Modality | null;
}

export const EVENT_TYPES: EventType[] = [
  {
    key: "wedding", label: "Wedding Muhūrta", devanagari: "विवाह-मुहूर्त",
    favouredSignNumbers: [2, 3, 7, 12],
    grounding: "Venus-ruled/friendly signs for partnership-aesthetics character matching",
    modalityPreference: null,
  },
  {
    key: "griha-pravesha", label: "Gṛha-Praveśa", devanagari: "गृह-प्रवेश",
    favouredSignNumbers: [2, 4, 5, 8, 11],
    grounding: "Sthira-rāśi + Cancer for foundational-permanence and domesticity character",
    modalityPreference: "sthira",
  },
  {
    key: "business-launch", label: "Business Launch", devanagari: "व्यवसाय-आरम्भ",
    favouredSignNumbers: [2, 3, 5, 6],
    grounding: "Mercury for commerce, Venus for prosperity, Sun for leadership authority",
    modalityPreference: null,
  },
  {
    key: "travel", label: "Travel Muhūrta", devanagari: "यात्रा-मुहूर्त",
    favouredSignNumbers: [1, 3, 4, 7, 10],
    grounding: "Cara-rāśi for momentum-character matching travel's movement nature",
    modalityPreference: "cara",
  },
  {
    key: "education", label: "Education Initiation", devanagari: "विद्या-आरम्भ",
    favouredSignNumbers: [3, 6, 9, 12],
    grounding: "Mercury for learning/communication, Jupiter for wisdom-tradition",
    modalityPreference: null,
  },
  {
    key: "foundation-stone", label: "Foundation Stone", devanagari: "शिलान्यास",
    favouredSignNumbers: [2, 5, 8, 11],
    grounding: "Sthira-rāśi strongly favoured for foundational-permanence character",
    modalityPreference: "sthira",
  },
  {
    key: "surgery", label: "Surgical Procedure", devanagari: "शल्य-क्रिया",
    favouredSignNumbers: [1, 8],
    grounding: "Tīkṣṇa-character-paired lagnas for decisive incisive action; cara for action-character",
    modalityPreference: "cara",
  },
];

/* ── Modality / House / Dignity Metadata ──────────────────── */

export const MODALITY_META: Record<Modality, { label: string; devanagari: string; color: string }> = {
  cara:          { label: "Cara (Movable)",  devanagari: "चर",       color: "#2E7D7B" },
  sthira:        { label: "Sthira (Fixed)",  devanagari: "स्थिर",    color: "#2F7D55" },
  "dvi-svabhava": { label: "Dvi-svabhāva (Dual)", devanagari: "द्वि-स्वभाव", color: "#B88421" },
};

export const UPACHAYA_HOUSES = [3, 6, 10, 11] as const;
export const DUSTHANA_HOUSES = [6, 8, 12] as const;
export const KENDRA_HOUSES = [1, 4, 7, 10] as const;
export const TRIKONA_HOUSES = [1, 5, 9] as const;
export const GOOD_HOUSES = [1, 4, 5, 7, 9, 10, 11] as const;

export function getHouseQuality(house: number): HouseQuality {
  if ([1, 4, 7, 10].includes(house)) return "kendra";
  if ([5, 9].includes(house)) return "trikona";
  if ([3, 6, 11].includes(house)) return "upachaya";
  if ([8, 12].includes(house)) return "dusthana";
  if ([2, 7].includes(house)) return "maraka";
  return "neutral-house";
}

export function isUpachaya(house: number): boolean {
  return (UPACHAYA_HOUSES as readonly number[]).includes(house);
}

export function isGoodHouse(house: number): boolean {
  return (GOOD_HOUSES as readonly number[]).includes(house);
}

export function isDusthana(house: number): boolean {
  return (DUSTHANA_HOUSES as readonly number[]).includes(house);
}

/* ── Dignity Strength ─────────────────────────────────────── */

export const DIGNITY_META: Record<Dignity, { label: string; strength: number; color: string }> = {
  exalted:       { label: "Uccha (Exalted)",       strength: 5, color: "#2F7D55" },
  "moola-trikona": { label: "Mūla-trikoṇa",       strength: 4, color: "#356CAB" },
  own:           { label: "Svakṣetra (Own Sign)",  strength: 4, color: "#2E7D7B" },
  friendly:      { label: "Mitra (Friendly)",      strength: 3, color: "#6B8E23" },
  neutral:       { label: "Sama (Neutral)",        strength: 2, color: "#B88421" },
  enemy:         { label: "Śatru (Enemy)",         strength: 1, color: "#C06030" },
  debilitated:   { label: "Nīca (Debilitated)",    strength: 0, color: "#A23A1E" },
};

/* ── Three-Criterion Evaluation Logic (§4.3) ──────────────── */

export interface CriterionResult {
  criterion: 1 | 2 | 3;
  label: string;
  verdict: Verdict;
  explanation: string;
}

/** Criterion 1: Lagna-sign event-type-affinity */
export function evaluateCriterion1(rashiNumber: number, eventKey: EventTypeKey): CriterionResult {
  const evt = EVENT_TYPES.find(e => e.key === eventKey);
  const rashi = RASHI_DB.find(r => r.number === rashiNumber);
  if (!evt || !rashi) {
    return { criterion: 1, label: "Sign Affinity", verdict: "poor", explanation: "Invalid input" };
  }
  const isFavoured = evt.favouredSignNumbers.includes(rashiNumber);
  const modalityMatch = evt.modalityPreference ? rashi.modality === evt.modalityPreference : false;

  if (isFavoured) {
    return {
      criterion: 1, label: "Sign Affinity", verdict: "strong",
      explanation: `${rashi.name}/${rashi.english} is classically favoured for ${evt.label}. ${evt.grounding}.`,
    };
  }
  if (modalityMatch) {
    return {
      criterion: 1, label: "Sign Affinity", verdict: "moderate",
      explanation: `${rashi.name} has ${MODALITY_META[rashi.modality].label} modality matching ${evt.label}'s preference, though not on the primary-favoured list.`,
    };
  }
  return {
    criterion: 1, label: "Sign Affinity", verdict: "weak",
    explanation: `${rashi.name}/${rashi.english} is not classically favoured for ${evt.label}. ${rashi.character}.`,
  };
}

/** Criterion 2: Lagna-lord strength + placement */
export function evaluateCriterion2(dignity: Dignity, house: number): CriterionResult {
  const digMeta = DIGNITY_META[dignity];
  const goodHouse = isGoodHouse(house);
  const dusthana = isDusthana(house);

  let verdict: Verdict;
  let explanation: string;

  if (digMeta.strength >= 4 && goodHouse) {
    verdict = "strong";
    explanation = `Lagna-lord in ${digMeta.label} and in House ${house} (${getHouseQuality(house)}) — strong placement and strong dignity.`;
  } else if (digMeta.strength >= 3 && goodHouse) {
    verdict = "moderate";
    explanation = `Lagna-lord in ${digMeta.label} with House ${house} (${getHouseQuality(house)}) — acceptable.`;
  } else if (digMeta.strength >= 3 && !dusthana) {
    verdict = "moderate";
    explanation = `Lagna-lord in ${digMeta.label} — dignity supports, though House ${house} is not a kendra/trikoṇa/11th.`;
  } else if (dusthana) {
    verdict = "weak";
    explanation = `Lagna-lord in House ${house} (duḥsthāna — 6th/8th/12th trika) weakens. Dignity: ${digMeta.label}.`;
  } else {
    verdict = digMeta.strength <= 1 ? "poor" : "weak";
    explanation = `Lagna-lord in ${digMeta.label} (${digMeta.strength <= 1 ? "afflicted" : "challenged"}) dignity in House ${house}.`;
  }

  return { criterion: 2, label: "Lord Strength", verdict, explanation };
}

/** Criterion 3: Lagna freedom from malefic-affliction with §4.6 upachaya-exception */
export function evaluateCriterion3(maleficHouses: number[]): CriterionResult {
  if (maleficHouses.length === 0) {
    return {
      criterion: 3, label: "Malefic Freedom", verdict: "strong",
      explanation: "No malefic planets reported — lagna free from malefic affliction.",
    };
  }

  const maleficIn1 = maleficHouses.includes(1);
  const maleficIn7 = maleficHouses.includes(7);
  const nonUpachayaMalefics = maleficHouses.filter(h => !isUpachaya(h) && h !== 1);
  const upachayaMalefics = maleficHouses.filter(h => isUpachaya(h));
  const lagnaAfflicted = maleficIn1 || maleficIn7;

  const parts: string[] = [];

  if (maleficIn1) parts.push("Malefic in 1st house directly afflicts lagna.");
  if (maleficIn7) parts.push("Malefic in 7th house creates 7th-aspect to lagna (weakening).");
  if (upachayaMalefics.length > 0)
    parts.push(`Malefic in house(s) ${upachayaMalefics.join(", ")} — upachaya-exception (§4.6): FAVOURABLE, not weakening.`);
  if (nonUpachayaMalefics.length > 0)
    parts.push(`Malefic in house(s) ${nonUpachayaMalefics.join(", ")} — non-upachaya: challenging per general rule.`);

  let verdict: Verdict;
  if (maleficIn1 && maleficIn7) verdict = "poor";
  else if (maleficIn1 || maleficIn7) verdict = "weak";
  else if (nonUpachayaMalefics.length > 0) verdict = "moderate";
  else verdict = "strong"; // Only upachaya malefics

  return {
    criterion: 3, label: "Malefic Freedom", verdict,
    explanation: parts.join(" "),
  };
}

/** Aggregate three criteria into overall lagna-śuddhi verdict */
export function aggregateLagnaSuddhi(c1: CriterionResult, c2: CriterionResult, c3: CriterionResult): Verdict {
  const scores: Record<Verdict, number> = { strong: 3, moderate: 2, weak: 1, poor: 0 };
  const total = scores[c1.verdict] + scores[c2.verdict] + scores[c3.verdict];
  if (total >= 8) return "strong";
  if (total >= 5) return "moderate";
  if (total >= 3) return "weak";
  return "poor";
}

export const VERDICT_META: Record<Verdict, { label: string; color: string; emoji: string }> = {
  strong:   { label: "Strong",   color: "#2F7D55", emoji: "✓" },
  moderate: { label: "Moderate", color: "#356CAB", emoji: "~" },
  weak:     { label: "Weak",     color: "#C06030", emoji: "!" },
  poor:     { label: "Poor",     color: "#A23A1E", emoji: "✗" },
};

/* ── Sign-Synergy Relationship Calculator (§4.4) ──────────── */

export function signRelation(muhurtaSign: number, natalSign: number): SignRelation {
  const diff = ((muhurtaSign - natalSign) % 12 + 12) % 12;
  if (diff === 0) return "same";
  if ([3, 9].includes(diff)) return "kendra"; // 4th and 10th from
  if ([4, 8].includes(diff)) return "trikona"; // 5th and 9th from
  if ([2, 10].includes(diff)) return "3rd-11th";
  if ([1, 11].includes(diff)) return "2nd-12th";
  if ([5, 7].includes(diff)) return "6th-8th";
  if (diff === 6) return "7th";
  return "3rd-11th"; // fallback
}

export const RELATION_META: Record<SignRelation, { label: string; quality: "favourable" | "acceptable" | "challenging"; color: string; description: string }> = {
  same:       { label: "Same Sign (1st)", quality: "favourable",  color: "#2F7D55", description: "High resonance — muhūrta-lagna = natal-lagna" },
  kendra:     { label: "Kendra (4th/10th)", quality: "favourable",  color: "#356CAB", description: "Kendra relationship — stability and foundational support" },
  trikona:    { label: "Trikoṇa (5th/9th)", quality: "favourable",  color: "#2E7D7B", description: "Trikoṇa relationship — auspicious dharma-support" },
  "3rd-11th": { label: "3rd/11th",          quality: "acceptable",  color: "#6B8E23", description: "Acceptable for momentum-events; growth-character" },
  "7th":      { label: "7th (Partnership)", quality: "acceptable",  color: "#B88421", description: "Acceptable for partnership-events; relational character" },
  "2nd-12th": { label: "2nd/12th",          quality: "challenging", color: "#C06030", description: "Challenging — 12th-from is trika position; 2nd is neutral" },
  "6th-8th":  { label: "6th/8th (Trika)",   quality: "challenging", color: "#A23A1E", description: "Challenging — trika positions; avoid for auspicious initiations" },
};

/* ── Diagnostic Scenarios (§6 + §8) ───────────────────────── */

export interface Scenario {
  id: number;
  title: string;
  situation: string;
  muhurtaLagna: string;
  muhurtaLagnaNumber: number;
  eventType: EventTypeKey;
  details: string;
  expectedIssue: IssueKey;
  expectedVerdict: ScenarioVerdict;
  explanation: string;
  clientQuote: string;
}

export const ISSUE_LABELS: Record<IssueKey, string> = {
  "single-pillar-dominance": "Single-Pillar Dominance (Common Mistake #1)",
  "upachaya-exception-refused": "Upachaya-Exception Refused (Common Mistake #2)",
  "sign-affinity-misidentified": "Sign-Affinity Misidentified (Common Mistake #3)",
  "synergy-ignored": "Synergy-with-Natal-Chart Ignored",
  "malefic-all-bad": "Treating All Malefics as Challenging",
  none: "No Issue — Discipline-Compliant",
};

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Wedding — Capricorn Lagna, Strong Pañcāṅga",
    situation: "Nov 8, ~4 PM IST wedding candidate. Lagna: Makara/Capricorn (Saturn-ruled).",
    muhurtaLagna: "Makara", muhurtaLagnaNumber: 10, eventType: "wedding",
    details: "Pañcāṅga aggregate STRONG (Daśamī Pūrṇā + Revatī Mṛdu + Vṛddhi + Vaṇija). Saturn in own-sign Kumbha in 2nd house. Mars in 7th house creating 7th-aspect to lagna.",
    expectedIssue: "sign-affinity-misidentified",
    expectedVerdict: "needs-adjustment",
    explanation: "Capricorn is Saturn-ruled — less favoured for wedding (Venus-ruled Vṛṣabha/Mithuna/Tulā preferred per §4.5). Strong pañcāṅga does NOT guarantee strong lagna-śuddhi. Mars 7th-aspect weakens Criterion 3. Time-window shift to different lagna recommended.",
    clientQuote: "The pañcāṅga looks great — can we still use this time even if the lagna isn't ideal for a wedding?",
  },
  {
    id: 2,
    title: "Wedding — Gemini Lagna, Mars in 11th (Upachaya)",
    situation: "Muhūrta-chart lagna: Mithuna/Gemini (Mercury-ruled). Mars in 11th house Meṣa.",
    muhurtaLagna: "Mithuna", muhurtaLagnaNumber: 3, eventType: "wedding",
    details: "Mercury (lagna-lord) in own-sign Kanyā in 4th house (strong). Mars in 11th house Meṣa (own-sign).",
    expectedIssue: "none",
    expectedVerdict: "favourable",
    explanation: "Mithuna favoured for wedding per §4.5. Mercury strong in own-sign in 4th-kendra. Mars in 11th = upachaya-exception (§4.6) — favourable, not weakening. All three criteria strong.",
    clientQuote: "I see Mars in the chart — should we be worried?",
  },
  {
    id: 3,
    title: "Griha-Praveśa — Leo Lagna, Only Lagna Strong",
    situation: "House-warming candidate: Siṁha lagna, Sun exalted, no malefics afflicting lagna.",
    muhurtaLagna: "Siṁha", muhurtaLagnaNumber: 5, eventType: "griha-pravesha",
    details: "Lagna-śuddhi: STRONG across all 3 criteria. However, pañcāṅga is weak (Riktā-tithi, Vaidhṛti-yoga cancellation-grade doṣa).",
    expectedIssue: "single-pillar-dominance",
    expectedVerdict: "avoid",
    explanation: "Strong lagna-śuddhi but Vaidhṛti-yoga is cancellation-grade (first-pass exclusion per Lesson 23.3.1 §4.6). Single-pillar dominance failure — cannot recommend on lagna strength alone when pañcāṅga has cancellation-grade defect.",
    clientQuote: "The chart looks powerful — Sun exalted in lagna. This must be a great time!",
  },
  {
    id: 4,
    title: "Travel — Aries Lagna, Malefic in 3rd + 6th",
    situation: "Travel muhūrta: Meṣa/Aries lagna. Saturn in 3rd house, Rāhu in 6th house.",
    muhurtaLagna: "Meṣa", muhurtaLagnaNumber: 1, eventType: "travel",
    details: "Mars (lagna-lord) in Siṁha in 5th house (friendly sign, trikoṇa). Saturn in 3rd, Rāhu in 6th.",
    expectedIssue: "upachaya-exception-refused",
    expectedVerdict: "favourable",
    explanation: "Meṣa favoured for travel (cara-rāśi per §4.5). Mars in 5th-trikoṇa in friendly sign = Criterion 2 moderate-strong. Saturn in 3rd + Rāhu in 6th — BOTH are upachaya houses. §4.6 exception: favourable, not weakening. All three criteria met.",
    clientQuote: "There are two malefics in the chart! Saturn and Rahu — isn't that terrible?",
  },
  {
    id: 5,
    title: "Wedding — Multi-Actor Synergy Challenge",
    situation: "Wedding: Tulā lagna (Venus-ruled, favoured). Bride's natal-lagna: Meṣa. Groom's natal-lagna: Vṛṣabha.",
    muhurtaLagna: "Tulā", muhurtaLagnaNumber: 7, eventType: "wedding",
    details: "Tulā muhūrta-lagna. Bride (Meṣa natal-lagna): Tulā is 7th-from Meṣa = partnership-axis. Groom (Vṛṣabha natal-lagna): Tulā is 6th-from Vṛṣabha = trika challenge.",
    expectedIssue: "synergy-ignored",
    expectedVerdict: "mixed",
    explanation: "Tulā is favoured for wedding lagna (§4.5). Sign-level synergy: 7th-from for bride (acceptable for partnership); but 6th-from for groom (trika — challenging). Multi-actor synergy (§4.4) requires BOTH actors; groom's 6th-from relationship is a concern.",
    clientQuote: "Libra is Venus-ruled — perfect for our wedding, right? Do we really need to check both charts?",
  },
  {
    id: 6,
    title: "Business Launch — Malefic in 7th, Treated as Decorative",
    situation: "Business launch: Mithuna lagna. Saturn in 7th house Dhanu. Mercury in Kanyā in 4th.",
    muhurtaLagna: "Mithuna", muhurtaLagnaNumber: 3, eventType: "business-launch",
    details: "Mercury strong (own sign, 4th kendra). Saturn in 7th house creates 7th-aspect to lagna. Practitioner ignores the malefic-affliction entirely.",
    expectedIssue: "malefic-all-bad",
    expectedVerdict: "needs-adjustment",
    explanation: "Saturn in 7th is NOT an upachaya house (7th is not 3/6/10/11). The upachaya-exception does NOT apply. Saturn's 7th-aspect to lagna weakens Criterion 3. Ignoring this entirely is under-application — the opposite error of refusing the exception.",
    clientQuote: "The astrologer said Saturn in the 7th is fine because Saturn is natural benefic for business. Is that right?",
  },
];

/* ── Four-Pillar Capstone Data (§4.7) ─────────────────────── */

export interface Pillar {
  number: number;
  name: string;
  devanagari: string;
  iast: string;
  status: "operational" | "partially-operational" | "this-lesson";
  lessons: string;
  description: string;
}

export const FOUR_PILLARS: Pillar[] = [
  {
    number: 1, name: "Pañcāṅga-Śuddhi", devanagari: "पञ्चाङ्ग-शुद्धि", iast: "pañcāṅga-śuddhi",
    status: "operational",
    lessons: "M23 Ch2 (Tithi + Vāra + Nakṣatra) + Ch3 L1-L2 (Yoga + Karaṇa)",
    description: "Five pañcāṅga-limb evaluation: tithi classification, vāra-lord effects, nakṣatra-categorisation with pāda, yoga assessment with cancellation-doṣa, karaṇa evaluation with Bhadrā-avoidance.",
  },
  {
    number: 2, name: "Candra-Bala", devanagari: "चन्द्र-बल", iast: "candra-bala",
    status: "partially-operational",
    lessons: "Partially via Nakṣatra + Tithi; Lesson 23.3.4 completes",
    description: "Lunar strength: Moon's placement in muhūrta-chart, Moon's relationship to actor's natal-Moon. Partially operational through nakṣatra (Moon-position-derived) and tithi (Moon-Sun-relation-derived).",
  },
  {
    number: 3, name: "Tārā-Bala", devanagari: "तारा-बल", iast: "tārā-bala",
    status: "partially-operational",
    lessons: "Partially via Nakṣatra evaluation; Lesson 23.3.4 completes",
    description: "Nakṣatra-compatibility-strength relative to actor's birth-nakṣatra. The 9-fold tārā framework (janma/sampat/vipat/kṣema/pratyari/sādhaka/vadha/mitra/ati-mitra).",
  },
  {
    number: 4, name: "Lagna-Śuddhi", devanagari: "लग्न-शुद्धि", iast: "lagna-śuddhi",
    status: "this-lesson",
    lessons: "THIS lesson — M23 Ch3 L3",
    description: "Lagna-purity: three-criterion discipline (sign-affinity + lord-strength + malefic-freedom with upachaya-exception) + synergy-with-natal-chart at lagna-level + multi-actor synergy.",
  },
];

export const INTEGRATION_STEPS = [
  { step: 1, label: "First-Pass Cancellation Exclusion", description: "Exclude Vyatīpāta/Vaidhṛti-yoga, Bhadrā-mukha, Riktā-without-exception" },
  { step: 2, label: "Pañcāṅga-Śuddhi Aggregate", description: "Evaluate 5-limb aggregate (tithi + vāra + nakṣatra + yoga + karaṇa)" },
  { step: 3, label: "Candra-Bala Assessment", description: "Moon's placement + relationship to actor's natal-Moon" },
  { step: 4, label: "Tārā-Bala Assessment", description: "Nakṣatra-compatibility via 9-fold tārā framework with actor's birth-nakṣatra" },
  { step: 5, label: "Lagna-Śuddhi Evaluation", description: "3-criterion discipline + synergy-with-natal-chart + multi-actor synergy" },
  { step: 6, label: "Integrated Four-Pillar Recommendation", description: "Honest trade-off articulation across all four pillars per MC Ch24-vicinity capstone" },
];

/* ── Helper Getters ───────────────────────────────────────── */

export function getRashi(num: number): RashiData | undefined {
  return RASHI_DB.find(r => r.number === num);
}

export function getEventType(key: EventTypeKey): EventType | undefined {
  return EVENT_TYPES.find(e => e.key === key);
}
