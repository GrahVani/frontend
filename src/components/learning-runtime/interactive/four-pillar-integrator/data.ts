/**
 * Engine for Lesson 23.3.4 — Four-Pillar Integrator.
 *
 * Provides databases, math, and scenario clinical files for Candra-Bala,
 * Tārā-Bala, and Event-Specific House-Bala integration.
 */

import { NAKSHATRAS, type NakshatraData } from "../nakshatra-data";

export interface TaraDetail {
  position: number;
  name: string;
  nameDevanagari: string;
  quality: "favourable" | "challenging" | "mixed";
  description: string;
  mitigation: string;
  color: string;
}

export const TARA_DB: Record<number, TaraDetail> = {
  1: {
    position: 1,
    name: "Janma",
    nameDevanagari: "जन्म",
    quality: "mixed",
    description: "Represents birth, self, and physical body. Resonant but carries mixed indications per regional classical strands.",
    mitigation: "Acknowledge trade-off or perform standard Śaṅkalpa. Avoid for highly sensitive initiations.",
    color: "#DAA520", // Amber/Gold
  },
  2: {
    position: 2,
    name: "Sampat",
    nameDevanagari: "सम्पत्",
    quality: "favourable",
    description: "Represents wealth, prosperity, and achievements. Highly supportive for all auspicious initiations.",
    mitigation: "No mitigation needed. Excellent timing.",
    color: "#2F7D55", // Green
  },
  3: {
    position: 3,
    name: "Vipat",
    nameDevanagari: "विपत",
    quality: "challenging",
    description: "Represents obstacles, danger, and unexpected crises. Generally avoided for new undertakings.",
    mitigation: "Offer jaggery (guda-dāna) to Brahmins or do Saṅkalpa if forced by structural constraints.",
    color: "#A23A1E", // Vermilion
  },
  4: {
    position: 4,
    name: "Kṣema",
    nameDevanagari: "क्षेम",
    quality: "favourable",
    description: "Represents well-being, protection, and security. Provides a stable foundation.",
    mitigation: "No mitigation needed. Favourable.",
    color: "#2F7D55",
  },
  5: {
    position: 5,
    name: "Pratyari",
    nameDevanagari: "प्रत्यरि",
    quality: "challenging",
    description: "Represents adversaries, conflict, and opposition. Hinders partnership and alignment.",
    mitigation: "Perform salt donation (lavaṇa-dāna) or adjust the sub-window to change the active lagna/pāda.",
    color: "#A23A1E",
  },
  6: {
    position: 6,
    name: "Sādhaka",
    nameDevanagari: "साधक",
    quality: "favourable",
    description: "Represents accomplishments, spiritual progress, and target achievement. Highly productive.",
    mitigation: "No mitigation needed. Excellent.",
    color: "#2F7D55",
  },
  7: {
    position: 7,
    name: "Vadha",
    nameDevanagari: "वध",
    quality: "challenging",
    description: "Represents destruction, severe affliction, and termination. The most critical tārā-doṣa; avoided.",
    mitigation: "Strictly avoid if possible. If mandatory, perform gold/til-dāna and seek strong lagna-cancellation.",
    color: "#A23A1E",
  },
  8: {
    position: 8,
    name: "Mitra",
    nameDevanagari: "मित्र",
    quality: "favourable",
    description: "Represents friendship, companionship, and helpful alliances. Smooths social and family friction.",
    mitigation: "No mitigation needed. Favourable.",
    color: "#2F7D55",
  },
  9: {
    position: 9,
    name: "Ati-Mitra",
    nameDevanagari: "अति-मित्र",
    quality: "favourable",
    description: "Represents intimate friendship and deep harmony. Promotes long-term spiritual and emotional synergy.",
    mitigation: "No mitigation needed. Favourable.",
    color: "#2F7D55",
  },
};

export interface RashiData {
  number: number;
  name: string;
  english: string;
  devanagari: string;
  ruler: string;
}

export const RASHI_DB: RashiData[] = [
  { number: 1,  name: "Meṣa",       english: "Aries",       devanagari: "मेष",       ruler: "Mars" },
  { number: 2,  name: "Vṛṣabha",    english: "Taurus",      devanagari: "वृषभ",      ruler: "Venus" },
  { number: 3,  name: "Mithuna",    english: "Gemini",      devanagari: "मिथुन",     ruler: "Mercury" },
  { number: 4,  name: "Karkaṭa",    english: "Cancer",      devanagari: "कर्कट",     ruler: "Moon" },
  { number: 5,  name: "Siṁha",      english: "Leo",         devanagari: "सिंह",      ruler: "Sun" },
  { number: 6,  name: "Kanyā",      english: "Virgo",       devanagari: "कन्या",     ruler: "Mercury" },
  { number: 7,  name: "Tulā",       english: "Libra",       devanagari: "तुला",      ruler: "Venus" },
  { number: 8,  name: "Vṛścika",    english: "Scorpio",     devanagari: "वृश्चिक",    ruler: "Mars" },
  { number: 9,  name: "Dhanus",     english: "Sagittarius", devanagari: "धनु",       ruler: "Jupiter" },
  { number: 10, name: "Makara",     english: "Capricorn",   devanagari: "मकर",       ruler: "Saturn" },
  { number: 11, name: "Kumbha",     english: "Aquarius",    devanagari: "कुम्भ",     ruler: "Saturn" },
  { number: 12, name: "Mīna",       english: "Pisces",      devanagari: "मीन",       ruler: "Jupiter" },
];

export type EventTypeKey =
  | "wedding"
  | "business-launch"
  | "griha-pravesha"
  | "education"
  | "travel"
  | "surgery";

export interface EventTypeData {
  key: EventTypeKey;
  label: string;
  primaryHouses: number[];
  houseRationales: Record<number, string>;
  grounding: string;
}

export const EVENT_TYPES: EventTypeData[] = [
  {
    key: "wedding",
    label: "Wedding (Vivāha)",
    primaryHouses: [1, 2, 7, 8, 11],
    houseRationales: {
      1: "Self/Actor — vitality and health of the partners.",
      2: "Family (Kuṭumba) — domestic growth and lineage harmony.",
      7: "Partnership (Spouse) — the central marriage house of union.",
      8: "Marital Longevity (Maṅgalya) — shared resources and health.",
      11: "Gains (Fulfillment) — marital gains and mutual joy.",
    },
    grounding: "Vivāha-muhūrta centers on the 7th house (union) and 8th house (longevity) per MC Chapter 8.",
  },
  {
    key: "business-launch",
    label: "Business Launch (Vyāvasāya)",
    primaryHouses: [1, 2, 10, 11],
    houseRationales: {
      1: "Founder/Entity — launch viability and recognition.",
      2: "Wealth (Finances) — revenue generation and assets.",
      10: "Career/Action (Karma) — business activities and standing.",
      11: "Gains (Profit) — commercial success and target gains.",
    },
    grounding: "Vyāvasāya-ārambha prioritizes the active 10th house of occupation and 11th house of profit.",
  },
  {
    key: "griha-pravesha",
    label: "Home Entry (Gṛha-Praveśa)",
    primaryHouses: [1, 2, 4, 11],
    houseRationales: {
      1: "Inhabitants — health and energy of the residents.",
      2: "Wealth/Lineage — stability of savings and family growth.",
      4: "Home/Happiness — the central house of domestic peace.",
      11: "Gains — overall prosperity and protection of assets.",
    },
    grounding: "Gṛha-praveśa requires a clean 4th house (sukha-sthāna) representing the dwelling space.",
  },
  {
    key: "education",
    label: "Education (Vidyā-ārambha)",
    primaryHouses: [1, 4, 5, 9],
    houseRationales: {
      1: "Student — mental absorption and focus.",
      4: "Formal Learning — academic environment and basic education.",
      5: "Intelligence (Buddhi) — comprehension, retention, memory.",
      9: "Wisdom (Guru) — higher learning and guide alignment.",
    },
    grounding: "Vidyā-ārambha requires a strong 5th house of intellect and 4th house of study.",
  },
  {
    key: "travel",
    label: "Travel (Yātrā)",
    primaryHouses: [1, 3, 9, 12],
    houseRationales: {
      1: "Traveller — personal safety and dynamic movement.",
      3: "Short Journey — quick transit and message exchange.",
      9: "Long Journey — purpose, wisdom, and pilgrimage.",
      12: "Distant Lands — foreign stay, exit, and expenditure.",
    },
    grounding: "Yātrā-muhūrta prioritizes the 3rd, 9th, and 12th houses of relocation per Bṛhat Saṁhitā.",
  },
  {
    key: "surgery",
    label: "Surgery (Śastra-Karma)",
    primaryHouses: [1, 6, 8, 12],
    houseRationales: {
      1: "Patient — physical threshold and recovery force.",
      6: "Disease/Cutting — the pathology target and surgical action.",
      8: "Vulnerability/Longevity — critical stakes and anesthetic safety.",
      12: "Hospitalization — recovery environment and exit from crisis.",
    },
    grounding: "Śastra-karma targets the 6th house of disease and the 8th house of life-force.",
  },
];

export interface Scenario {
  id: number;
  title: string;
  situation: string;
  details: string;
  clientQuote: string;
  expectedIssue: IssueKey;
  expectedVerdict: ScenarioVerdict;
  explanation: string;
}

export type IssueKey =
  | "single-pillar"
  | "tara-mismatch"
  | "candra-mismatch"
  | "house-afflicted"
  | "rikta-dosa"
  | "saturday-wedding"
  | "upachaya-exception";

export type ScenarioVerdict =
  | "favourable"
  | "avoid"
  | "exception-applies"
  | "mixed"
  | "needs-adjustment";

export const ISSUE_LABELS: Record<IssueKey, string> = {
  "single-pillar": "Single-pillar dominance shortcut",
  "tara-mismatch": "Ignored/mis-computed tārā doṣa",
  "candra-mismatch": "Ignored/mis-computed candra doṣa",
  "house-afflicted": "Afflicted event-specific house",
  "rikta-dosa": "Ignored Riktā tithi cancellation",
  "saturday-wedding": "Ignored Saturday-vāra doṣa",
  "upachaya-exception": "Upachaya exception correctly applied",
};

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "The §1 Hook Capstone (Nov 8)",
    situation: "A wedding date is set for Nov 8 ~4 PM IST. Pañcāṅga is clean (strong Daśamī tithi, Vṛddhi yoga, Vaṇija karaṇa). Lagna is Capricorn (Saturn-ruled). Moon is in Revatī (Pisces).",
    details: "Bride birth-nakṣatra: Rohiṇī (4). Groom birth-nakṣatra: Mṛgaśīrṣā (5). Muhūrta Moon in Revatī (27) calculates to Bride = 24 mod 9 = 6 (Sādhaka - favourable); Groom = 23 mod 9 = 5 (Pratyari - challenging). In Capricorn lagna chart, Mars is debilitated in the 7th house (central wedding house).",
    clientQuote: "The priest said Nov 8 has excellent pañcāṅga-purity! But my groom is worried about his Pratyari tārā, and Capricorn isn't a Venus sign. Can we proceed?",
    expectedIssue: "tara-mismatch",
    expectedVerdict: "needs-adjustment",
    explanation: "This is the flagship §1 hook scenario. Although Pillar 1 (pañcāṅga-śuddhi) is strong, Pillar 3 (tārā-bala) is mixed (groom in Pratyari), the lagna (Pillar 4) is Capricorn (non-Venus sign mismatch), and the 7th house of marriage contains debilitated Mars. It requires sub-window adjustment (Option 2) or alternative candidate dates (e.g., Nov 1 which provides friendly tārās for both).",
  },
  {
    id: 2,
    title: "Taurus Business Launch with Moon in 9th",
    situation: "A commercial launch candidate is set for Wednesday morning. Lagna is Taurus (sthira sign, Venus-ruled, excellent for stability). Venus (lagna-lord) is strong and well-placed in the 1st house. Founder birth-nakṣatra is Bharaṇī (2), and transiting Moon is in Uttarāṣāḍhā (21) (Sampat tārā, highly favourable).",
    details: "However, Moon occupies the 9th house (Capricorn) from the Taurus lagna. While classically the 9th house is a trikoṇa, for Moon placement in muhūrta, B.V. Raman and MC class the 9th house as less-favourable (tending to weaken candra-bala). No malefics aspect the Moon.",
    clientQuote: "We want our business to stand the test of time, and Taurus lagna is perfect. But a consultant said the Moon in the 9th house is weak. Is it still usable?",
    expectedIssue: "candra-mismatch",
    expectedVerdict: "mixed",
    explanation: "Since the lagna is strong (sthira, lord in 1st), tārā-bala is excellent (Sampat), and vāra is auspicious (Wednesday), the weak candra-bala (Moon in 9th house) is a minor trade-off. In business launches, a strong sthira lagna and gains-complex (10th/11th houses clean) take precedence, so this is a 'Mixed' or acceptable trade-off case.",
  },
  {
    id: 3,
    title: "Saturday Wedding Dilemma",
    situation: "A couple wants to wed on Saturday because it is convenient for guests. The lagna is Libra (Venus-ruled, partnership character). Venus (lagna-lord) is exalted in Pisces. Bride and groom both have friendly tārā-balas.",
    details: "However, Saturday is Saturn-vāra. Saturn is generally avoided for wedding initiations unless specific planetary/nakṣatra combinations compensate. No such compensation is active in this window, and the 7th house contains Saturn.",
    clientQuote: "Saturday is the only day our relatives can travel. The Libra ascendant is perfect for us. Can we just ignore the Saturday rule since the lagna is Venus-ruled?",
    expectedIssue: "saturday-wedding",
    expectedVerdict: "avoid",
    explanation: "Saturday is classified as a challenging vāra for marriage (vivāha) per MC Chapter 8. Placing the vāra lord (Saturn) in the 7th house of marriage violates house-bala rules. Recommending this window based on lagna-strength alone is a single-pillar shortcut. This must be avoided or rescheduled.",
  },
  {
    id: 4,
    title: "Emergency Surgery & Nodal Afflictions",
    situation: "An urgent surgery is scheduled. Patient birth-nakṣatra is Āśleṣā (9). Muhūrta Moon is in Citrā (14) (Vadha tārā - destructive!). Lagna is Scorpio (Mars-ruled).",
    details: "Mars (lagna-lord) is in Leo (10th house, upachaya - strong). In the chart, Mars and Saturn occupy the 6th house (Aries). The surgery is urgent to remove an acute infection.",
    clientQuote: "The patient is in pain, but the moon is in Vadha tārā! The local astrologer wants us to wait 3 days. Can we do the surgery now?",
    expectedIssue: "upachaya-exception",
    expectedVerdict: "exception-applies",
    explanation: "Surgery is a sharp-action procedure (śastra-karma). Classical texts permit major exceptions for health emergencies. Furthermore, Mars and Saturn (malefics) in the 6th house (upachaya from Scorpio lagna) act favourably to defeat the disease, and the lagna-lord is strong. The urgent need overrides the Vadha tārā, which can be mitigated post-op.",
  },
  {
    id: 5,
    title: "Gṛha-Praveśa under Riktā Tithi",
    situation: "A housewarming is proposed on a Thursday. Lagna is Aquarius (sthira). The Moon is in Rohiṇī (favourable tārā). However, the tithi is Chaturthī (4th - Riktā).",
    details: "Riktā tithis (4, 9, 14) represent emptiness and are generally barred for initiations. No specific cancellation exception (such as Gaṇeśa-worship on Chaturthī for specific non-residential tasks) applies to this Gṛha-Praveśa.",
    clientQuote: "Thursday is Jupiter's day, and the Moon is in Rohiṇī which is my Kṣema tārā! The housewarming is just for our family. Does the 4th tithi really block us?",
    expectedIssue: "rikta-dosa",
    expectedVerdict: "avoid",
    explanation: "Gṛha-Praveśa (house warming) is a major residential initiation that strictly requires a clean tithi (Pillar 1). Riktā tithi cancels the day's auspiciousness for home entry, and there is no applicable exception for this event-type. Relying on Thursday (vāra) or Rohiṇī (tārā) is a single-pillar shortcut. Avoid.",
  },
  {
    id: 6,
    title: "Education Initiation with afflicted 5th House",
    situation: "A child's education ceremony (Vidyā-ārambha) is scheduled. Lagna is Gemini (Mercury-ruled). Moon is in Hasta (Sādhaka tārā). Jupiter is in the 4th house (Virgo - strong occupant).",
    details: "However, Rāhu (malefic) occupies the 5th house (Libra - the primary house of intellect and retention for education). The 5th lord (Venus) is combust.",
    clientQuote: "Our child is starting preschool. Gemini is Mercury-ruled, and Jupiter in the 4th is excellent for learning. But someone mentioned Rāhu in the 5th house. Will it affect their concentration?",
    expectedIssue: "house-afflicted",
    expectedVerdict: "needs-adjustment",
    explanation: "For Vidyā-ārambha, the 5th house (intellect and comprehension) is a primary event house. Rāhu occupying the 5th house and the 5th lord being combust severely afflicts this house. Despite a strong 4th house (formal school) and Sādhaka tārā, this window should be adjusted to clear the 5th house or strengthen the 5th lord.",
  },
];

/* ── Calculations ────────────────────────────────────────── */

/**
 * Computes the tārā position from birth nakṣatra to target nakṣatra.
 * 1-indexed, returns 1 to 9.
 */
export function getTaraPosition(birthNum: number, targetNum: number): number {
  let count = targetNum - birthNum + 1;
  if (count <= 0) count += 27;
  let pos = count % 9;
  return pos === 0 ? 9 : pos;
}

/**
 * Gets the relationship details for a specific tārā position.
 */
export function getTaraDetail(pos: number): TaraDetail {
  return TARA_DB[pos];
}

/**
 * Calculates Moon's position from Natal Moon.
 * Returns the house difference (1 to 12).
 */
export function getMoonFromNatalPosition(natalRashi: number, muhurtaRashi: number): number {
  let diff = muhurtaRashi - natalRashi + 1;
  if (diff <= 0) diff += 12;
  return diff;
}

/**
 * Checks if a house is an Upachaya house (3, 6, 10, 11).
 */
export function isUpachaya(house: number): boolean {
  return [3, 6, 10, 11].includes(house);
}

/**
 * Evaluates the Candra-Bala components.
 */
export function evaluateCandraBala(
  muhurtaLagna: number,
  muhurtaRashi: number,
  natalRashi1: number,
  natalRashi2: number | null,
  maleficsAspectingMoon: boolean
) {
  // 1. House placement from Lagna
  let lagnaDiff = muhurtaRashi - muhurtaLagna + 1;
  if (lagnaDiff <= 0) lagnaDiff += 12;
  const isPlacementFav = [1, 2, 3, 6, 7, 10, 11].includes(lagnaDiff);

  // 2. Natal Moon 1
  const natal1Diff = getMoonFromNatalPosition(natalRashi1, muhurtaRashi);
  const isNatal1Fav = ![4, 8, 12].includes(natal1Diff);

  // 3. Natal Moon 2 (if present)
  let isNatal2Fav = true;
  let natal2Diff = null;
  if (natalRashi2 !== null) {
    natal2Diff = getMoonFromNatalPosition(natalRashi2, muhurtaRashi);
    isNatal2Fav = ![4, 8, 12].includes(natal2Diff);
  }

  // 4. Aspect environment
  const isAspectFav = !maleficsAspectingMoon;

  // Verdict aggregation
  let score = 0;
  if (isPlacementFav) score++;
  if (isNatal1Fav) score++;
  if (natalRashi2 === null || isNatal2Fav) score++;
  if (isAspectFav) score++;

  let verdict: "strong" | "moderate" | "weak" = "weak";
  if (score >= 3) verdict = "strong";
  else if (score === 2) verdict = "moderate";

  return {
    moonHouseFromLagna: lagnaDiff,
    isPlacementFav,
    natal1Diff,
    isNatal1Fav,
    natal2Diff,
    isNatal2Fav,
    isAspectFav,
    verdict,
  };
}

/**
 * Evaluates House-Bala for a given event type and current placements.
 */
export function evaluateHouseBala(
  eventType: EventTypeKey,
  muhurtaLagna: number,
  maleficHouses: number[],
  beneficHouses: number[],
  combustLords: number[]
) {
  const evt = EVENT_TYPES.find(e => e.key === eventType)!;
  const houseResults = evt.primaryHouses.map(house => {
    // Determine the absolute sign of the house in the chart
    let absoluteSign = muhurtaLagna + house - 1;
    if (absoluteSign > 12) absoluteSign -= 12;

    const hasMalefic = maleficHouses.includes(house);
    const hasBenefic = beneficHouses.includes(house);
    const isLordCombust = combustLords.includes(absoluteSign);
    const isUp = isUpachaya(house);

    // Malefics in Upachaya are favorable, otherwise challenging
    let maleficImpact: "none" | "favourable" | "challenging" = "none";
    if (hasMalefic) {
      maleficImpact = isUp ? "favourable" : "challenging";
    }

    let strength: "strong" | "mixed" | "weak" = "mixed";
    if (hasBenefic && !isLordCombust && maleficImpact !== "challenging") {
      strength = "strong";
    } else if (isLordCombust || maleficImpact === "challenging") {
      strength = "weak";
    } else if (maleficImpact === "favourable") {
      strength = "strong";
    }

    return {
      house,
      signNumber: absoluteSign,
      hasMalefic,
      hasBenefic,
      isLordCombust,
      isUp,
      maleficImpact,
      strength,
      rationale: evt.houseRationales[house] || "",
    };
  });

  const weakCount = houseResults.filter(r => r.strength === "weak").length;
  const strongCount = houseResults.filter(r => r.strength === "strong").length;

  let aggregate: "favourable" | "mixed" | "challenging" = "mixed";
  if (weakCount === 0 && strongCount >= 2) aggregate = "favourable";
  else if (weakCount > 1) aggregate = "challenging";

  return {
    houseResults,
    aggregate,
  };
}
