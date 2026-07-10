/**
 * Engine for Lesson 23.3.1 — 27 Yogas Categorized.
 *
 * Provides the 27-yoga database, nature classifications (Auspicious, Inauspicious,
 * Cancellation-Doṣa), event-type specific affinities, cancellation-doṣa rules,
 * regional variance triggers, and case scenarios.
 */

export type YogaNature = "auspicious" | "inauspicious" | "cancellation-dosa";

export type EventTypeKey =
  | "wedding"
  | "griha-pravesha"
  | "foundation-stone"
  | "travel"
  | "education-initiation"
  | "business-launch"
  | "samskara-ceremony";

export type IssueKey =
  | "single-limb-dominance"
  | "cancellation-dosa-ignored"
  | "parigha-variance-ignored"
  | "challenging-yoga-underapplied"
  | "none";

export type Verdict = "favourable" | "avoid" | "exception-applies" | "needs-context";

export interface YogaData {
  number: number;
  name: string;
  devanagari: string;
  nature: YogaNature;
  ruler: string;
  deity: string;
  lord: string;
  effects: string;
  specialNote?: string;
}

export interface EventType {
  key: EventTypeKey;
  label: string;
  favourableNatures: YogaNature[];
  avoidNatures: YogaNature[];
  specialYoga?: string;
  specialNote?: string;
  explanation: string;
}

export interface Scenario {
  id: number;
  title: string;
  event: string;
  yoga: string;
  yogaNumber: number;
  nature: YogaNature;
  situation: string;
  expectedIssue: IssueKey;
  expectedVerdict: Verdict;
  explanation: string;
  response: string;
}

export const YOGA_DB: YogaData[] = [
  { number: 1, name: "Viṣkambha", devanagari: "विष्कम्भ", nature: "inauspicious", ruler: "Indra", deity: "Vāyu", lord: "Saturn", effects: "Obstacles overcome with effort; generally inauspicious. Cautiously avoided for major auspicious commencements." },
  { number: 2, name: "Prīti", devanagari: "प्रीति", nature: "auspicious", ruler: "Viśvedevā", deity: "Śiva", lord: "Mercury", effects: "Love, friendship, affection, and mutual joy. Highly aligned with relational and partnership initiations." },
  { number: 3, name: "Āyuṣmān", devanagari: "आयुष्मान्", nature: "auspicious", ruler: "Vāyu", deity: "Pavana", lord: "Jupiter", effects: "Longevity, health, and sustained vitality. Strongly supports events requiring long-term durability." },
  { number: 4, name: "Saubhāgya", devanagari: "सौभाग्य", nature: "auspicious", ruler: "Brahmā", deity: "Brahmā", lord: "Venus", effects: "Marital blessing, good fortune, and prosperity. Classically the premier choice for weddings." },
  { number: 5, name: "Śobhana", devanagari: "शोभन", nature: "auspicious", ruler: "Indra", deity: "Śakra", lord: "Sun", effects: "Splendour, beauty, and auspicious brightness. Supports aesthetic launches and travel commencements." },
  { number: 6, name: "Atigaṇḍa", devanagari: "अतिगण्ड", nature: "inauspicious", ruler: "Śiva", deity: "Rudra", lord: "Mars", effects: "Obstruction and danger. Classically avoided for new ventures due to high risk of initial friction." },
  { number: 7, name: "Sukarmā", devanagari: "सुकर्मा", nature: "auspicious", ruler: "Viśvedevā", deity: "Viśvedevā", lord: "Jupiter", effects: "Righteous action, merit, and success. Excellent for active work commencements and ceremonies." },
  { number: 8, name: "Dhṛti", devanagari: "धृति", nature: "auspicious", ruler: "Varuṇa", deity: "Jala", lord: "Saturn", effects: "Steadiness, patience, and resolve. Favourable for permanent installations and agreements." },
  { number: 9, name: "Śūla", devanagari: "शूल", nature: "inauspicious", ruler: "Āditya", deity: "Nirṛti", lord: "Sun", effects: "Piercing conflict or pain. Classically avoided for auspicious-initiations; conflicts with smooth event progress." },
  { number: 10, name: "Gaṇḍa", devanagari: "गण्ड", nature: "inauspicious", ruler: "Soma", deity: "Yama", lord: "Moon", effects: "Obstructive nodes and sudden challenges. Avoided for major commencements." },
  { number: 11, name: "Vṛddhi", devanagari: "वृद्धि", nature: "auspicious", ruler: "Viśvedevā", deity: "Viṣṇu", lord: "Mercury", effects: "Prosperity, growth, expansion, and learning. Excellent for commercial launches and business events." },
  { number: 12, name: "Dhruva", devanagari: "ध्रुव", nature: "auspicious", ruler: "Pṛthivī", deity: "Pṛthivī", lord: "Ketu", effects: "Stability, permanence, firm success", specialNote: "Stability, permanence, firm success" },
  { number: 13, name: "Vyāghāta", devanagari: "व्याघात", nature: "inauspicious", ruler: "Vāyu", deity: "Vāyu", lord: "Rahu", effects: "Disruption or sudden blow. Classically avoided for major auspicious commencements." },
  { number: 14, name: "Harṣaṇa", devanagari: "हर्षण", nature: "auspicious", ruler: "Brahmā", deity: "Brahmā", lord: "Jupiter", effects: "Delight, exhilaration, joy, success" },
  { number: 15, name: "Vajra", devanagari: "वज्र", nature: "inauspicious", ruler: "Indra", deity: "Indra", lord: "Saturn", effects: "Forceful impact or thunderbolt. Avoided for soft, auspicious initiations; suits sharp, boundary-cutting actions." },
  { number: 16, name: "Siddhi", devanagari: "सिद्धि", nature: "auspicious", ruler: "Mitra", deity: "Mitra", lord: "Mars", effects: "Perfection, accomplishment, and successful attainment. Heavily favoured for accomplishment-oriented launches." },
  { number: 17, name: "Vyatīpāta", devanagari: "व्यतीपात", nature: "cancellation-dosa", ruler: "Ravi", deity: "Rudra", lord: "Rahu", effects: "Crossing disruption. Rules out auspicious commencements regardless of other-limbs-strength.", specialNote: "Universal cancellation-grade doṣa. Classic first-pass exclusion rule." },
  { number: 18, name: "Varīyān", devanagari: "वरीयान्", nature: "auspicious", ruler: "Viśvedevā", deity: "Viśvedevā", lord: "Jupiter", effects: "Excellence, nobility, and choosing the best. Supports leadership and high-prestige events." },
  { number: 19, name: "Parigha", devanagari: "परिघ", nature: "cancellation-dosa", ruler: "Indra", deity: "Varuṇa", lord: "Venus", effects: "Blocking iron bar or obstruction. Challenging; classes as cancellation-grade in some traditions.", specialNote: "Cancellation-grade doṣa in some regional-traditions, but challenging-only in others." },
  { number: 20, name: "Śiva", devanagari: "शिव", nature: "auspicious", ruler: "Pṛthivī", deity: "Śiva", lord: "Sun", effects: "Benevolence, auspiciousness, and grace. Highly favourable across most auspicious initiations." },
  { number: 21, name: "Siddha", devanagari: "सिद्ध", nature: "auspicious", ruler: "Pitṛ", deity: "Pitṛ", lord: "Mercury", effects: "Proven success, completion, and fruition. Perfect for completing projects and major launches." },
  { number: 22, name: "Sādhya", devanagari: "साध्य", nature: "auspicious", ruler: "Brahmā", deity: "Śiva", lord: "Saturn", effects: "Feasible, achievable, and within reach. Highly supportive for goal-oriented commencements." },
  { number: 23, name: "Śubha", devanagari: "शुभ", nature: "auspicious", ruler: "Lakṣmī", deity: "Viṣṇu", lord: "Jupiter", effects: "Radiance, purity, and beauty. Strongly supports marriages, housewarmings, and religious commencements." },
  { number: 24, name: "Śukla", devanagari: "शुक्ल", nature: "auspicious", ruler: "Brahmā", deity: "Parameṣṭhī", lord: "Moon", effects: "Purity and brightness. Supportive of spiritual studies, purification, and initiations." },
  { number: 25, name: "Brahma", devanagari: "ब्रह्म", nature: "auspicious", ruler: "Indra", deity: "Brahmā", lord: "Mars", effects: "Divine wisdom, study, and expansive growth. Highly supportive for education and upanayana." },
  { number: 26, name: "Aindra", devanagari: "ऐन्द्र", nature: "auspicious", ruler: "Śiva", deity: "Indra", lord: "Venus", effects: "Royal power, victory, and leadership. Excellent for starting businesses and assuming office." },
  { number: 27, name: "Vaidhṛti", devanagari: "वैधृति", nature: "cancellation-dosa", ruler: "Dharma", deity: "Dharma", lord: "Sun", effects: "Contrary holding or disturbance. Rules out auspicious commencements regardless of other-limbs-strength.", specialNote: "Universal cancellation-grade doṣa. Classic first-pass exclusion rule." },
];

export const NATURE_META: Record<
  YogaNature,
  { label: string; color: string; bg: string; border: string; desc: string }
> = {
  auspicious: {
    label: "Auspicious",
    color: "#2F7D55",
    bg: "#E8F5EE",
    border: "#A8D4B8",
    desc: "Supports and enhances auspicious-initiations; event-type-specific weighting refines selection.",
  },
  inauspicious: {
    label: "Challenging (Non-Cancellation)",
    color: "#B88421",
    bg: "#FDF6E3",
    border: "#E8D5A3",
    desc: "Reduces overall quality score but does NOT automatically rule out if other-limbs are extremely strong.",
  },
  "cancellation-dosa": {
    label: "Cancellation-Grade Doṣa",
    color: "#A23A1E",
    bg: "#FDE8E5",
    border: "#E8AFA8",
    desc: " क्लासिकली RULES OUT candidate windows for auspicious-initiations regardless of other-limbs-strength.",
  },
};

export const EVENT_TYPES: EventType[] = [
  {
    key: "wedding",
    label: "Wedding-muhūrta",
    favourableNatures: ["auspicious"],
    avoidNatures: ["inauspicious", "cancellation-dosa"],
    specialYoga: "Saubhāgya",
    specialNote: "Saubhāgya (marital-blessing) is the most-specifically affined yoga. Vyatīpāta & Vaidhṛti act as absolute cancellations.",
    explanation:
      "Marriage requires relational-growth. Favours Saubhāgya specifically; Prīti, Harṣaṇa, Śubha also support. Avoids inauspicious and cancels absolutely on Vyatīpāta, Vaidhṛti, and (regional-tradition) Parigha.",
  },
  {
    key: "griha-pravesha",
    label: "Gṛha-praveśa (house-warming)",
    favourableNatures: ["auspicious"],
    avoidNatures: ["inauspicious", "cancellation-dosa"],
    specialYoga: "Dhruva",
    explanation:
      "Housewarming seeks domestic permanence. Favours Dhruva (firmness) and generally auspicious yogas. Vyatīpāta and Vaidhṛti cancel.",
  },
  {
    key: "foundation-stone",
    label: "Foundation-stone-laying",
    favourableNatures: ["auspicious"],
    avoidNatures: ["inauspicious", "cancellation-dosa"],
    specialYoga: "Dhruva",
    explanation:
      "Foundation-laying aligns directly with Dhruva's stable, permanent nature. Inauspicious yogas are avoided, while Vyatīpāta/Vaidhṛti cancel.",
  },
  {
    key: "travel",
    label: "Travel-commencement",
    favourableNatures: ["auspicious"],
    avoidNatures: ["inauspicious", "cancellation-dosa"],
    specialYoga: "Siddha",
    explanation:
      "Travel commencements favour Siddha (accomplishment) or Sukarmā (good action) to ensure safe return. Vyatīpāta and Vaidhṛti cancel.",
  },
  {
    key: "education-initiation",
    label: "Education / Upanayana",
    favourableNatures: ["auspicious"],
    avoidNatures: ["inauspicious", "cancellation-dosa"],
    specialYoga: "Brahma",
    explanation:
      "Education initiation directly matches Brahma (wisdom/priestly-learning) and Siddhi (achievement). Vyatīpāta/Vaidhṛti cancel.",
  },
  {
    key: "business-launch",
    label: "Business-launch / Venture",
    favourableNatures: ["auspicious"],
    avoidNatures: ["inauspicious", "cancellation-dosa"],
    specialYoga: "Siddhi",
    explanation:
      "Commercial launches strongly favour Siddhi (accomplishment) and Vṛddhi (expansion). Vyatīpāta and Vaidhṛti cancel absolutely.",
  },
  {
    key: "samskara-ceremony",
    label: "Samskāra ceremony",
    favourableNatures: ["auspicious"],
    avoidNatures: ["inauspicious", "cancellation-dosa"],
    explanation:
      "Standard saṁskāras require a clean baseline. Supports all auspicious yogas. Vyatīpāta/Vaidhṛti must be avoided.",
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Wedding on Saubhāgya but Vyatīpāta yoga",
    event: "Wedding-muhūrta",
    yoga: "Vyatīpāta",
    yogaNumber: 17,
    nature: "cancellation-dosa",
    situation:
      "A peer practitioner claims a candidate date is auspicious for a wedding because the Moon falls in Rohiṇī (Sthira) and the tithi is Nandā. However, Sun-Moon sum reveals Vyatīpāta yoga is active.",
    expectedIssue: "cancellation-dosa-ignored",
    expectedVerdict: "avoid",
    explanation:
      "Vyatīpāta is a cancellation-grade doṣa. It rules out the candidate window for auspicious-initiations, overriding any individual limb strengths like Rohiṇī nakṣatra. This is a first-pass rule.",
    response:
      "Reject this candidate. Although Rohiṇī is extremely favourable, Vyatīpāta yoga carries absolute cancellation-grade doṣa status and overrides all other limbs. We must seek another date.",
  },
  {
    id: 2,
    title: "Vaidhṛti cancellation-doṣa in business launch",
    event: "Business-launch / Venture",
    yoga: "Vaidhṛti",
    yogaNumber: 27,
    nature: "cancellation-dosa",
    situation:
      "A client wants to launch a new software product on a Thursday (Guru-vāra) under Puṣya nakṣatra. The yoga at that time is Vaidhṛti.",
    expectedIssue: "cancellation-dosa-ignored",
    expectedVerdict: "avoid",
    explanation:
      "Vaidhṛti (27) is universally classes as a cancellation-grade doṣa. No other limbs (even Thursday + Puṣya nakṣatra) can save a Vaidhṛti window for an auspicious initiation.",
    response:
      "Avoid this window. Vaidhṛti yoga is a cancellation-grade doṣa that rules out auspicious initiations. Recommend rescheduling to a date where the yoga limb is favourable, like Siddhi or Vṛddhi.",
  },
  {
    id: 3,
    title: "Parigha yoga with regional-tradition variance",
    event: "Wedding-muhūrta",
    yoga: "Parigha",
    yogaNumber: 19,
    nature: "cancellation-dosa",
    situation:
      "A couple's family asks about a wedding date falling on Parigha yoga. One family's priest treats Parigha as challenging but acceptable, while the other's treats it as an absolute cancellation.",
    expectedIssue: "parigha-variance-ignored",
    expectedVerdict: "needs-context",
    explanation:
      "Parigha (19) carries genuine regional-tradition variance. Some lineages class it as cancellation-grade (like Vyatīpāta), while others treat it as challenging-only. The practitioner must honestly explain this variance.",
    response:
      "Both viewpoints are classically grounded in regional traditions. If you align with the tradition treating Parigha as a cancellation, select another date. For safety in major life events, we default to conservative avoidance.",
  },
  {
    id: 4,
    title: "Wedding on Saubhāgya but Saturday + Riktā tithi",
    event: "Wedding-muhūrta",
    yoga: "Saubhāgya",
    yogaNumber: 4,
    nature: "auspicious",
    situation:
      "An astrologer recommends a wedding-muhūrta because it features Saubhāgya yoga (the premier marriage yoga), completely overlooking that the vāra is Saturday (Śani) and the tithi is Caturthī (Riktā).",
    expectedIssue: "single-limb-dominance",
    expectedVerdict: "avoid",
    explanation:
      "Favourable Saubhāgya yoga does not save a candidate where other limbs are ruled out. Caturthī Riktā is excluded for weddings. Single-limb-dominance shortcut is a key discipline-failure.",
    response:
      "Reject this date. While Saubhāgya yoga is excellent, the Riktā tithi rules out the wedding candidate. An integrated assessment requires all limbs to support the initiation, not just one.",
  },
  {
    id: 5,
    title: "Under-applying challenging Atigaṇḍa yoga",
    event: "Gṛha-praveśa (house-warming)",
    yoga: "Atigaṇḍa",
    yogaNumber: 6,
    nature: "inauspicious",
    situation:
      "A client is in a rush to move in and suggests a date under Atigaṇḍa yoga. The practitioner notes tithi and vāra are moderately favourable and thinks 'it is only Atigaṇḍa, not Vyatīpāta, so it is fine.'",
    expectedIssue: "challenging-yoga-underapplied",
    expectedVerdict: "avoid",
    explanation:
      "Atigaṇḍa is highly challenging and classically avoided for major initiations like housewarming. Under-applying the warnings of non-cancellation challenging yogas leads to problematic recommendations.",
    response:
      "We advise avoiding this date. Atigaṇḍa indicates severe obstruction and is classically avoided for Gṛha-praveśa. RESCHEDULE to a date with a stable, supportive yoga like Dhruva or Śubha.",
  },
  {
    id: 6,
    title: "Integrated education launch on Siddhi yoga",
    event: "Education / Upanayana",
    yoga: "Siddhi",
    yogaNumber: 16,
    nature: "auspicious",
    situation:
      "A family schedules an Upanayana ceremony under Siddhi yoga (accomplishment) on Thursday (Guru-vāra), with a favourable Nandā tithi and Aśvinī nakṣatra, and strong chart compatibility.",
    expectedIssue: "none",
    expectedVerdict: "favourable",
    explanation:
      "This represents perfect integrated assessment. The yoga is favourable (Siddhi), all other limbs are strong, and there is no cancellation-doṣa active. The election is fully discipline-compliant.",
    response:
      "This window is highly favourable and discipline-compliant: Siddhi yoga's accomplishment energy supports education, backed by strong tithi, vāra, and nakṣatra inputs.",
  },
];

export const DANGEROUS_YOGAS = [1, 6, 9, 10, 13, 15, 17, 19, 27]; // 1-based indices of dangerous/challenging yogas

export function getYoga(num: number): YogaData | undefined {
  return YOGA_DB.find((y) => y.number === num);
}

export function getEventType(key: EventTypeKey): EventType | undefined {
  return EVENT_TYPES.find((e) => e.key === key);
}

export function issueLabel(key: IssueKey): string {
  switch (key) {
    case "single-limb-dominance":
      return "Single-limb dominance shortcut";
    case "cancellation-dosa-ignored":
      return "Cancellation-doṣa ignored (Vyatīpāta/Vaidhṛti)";
    case "parigha-variance-ignored":
      return "Parigha regional-tradition variance ignored";
    case "challenging-yoga-underapplied":
      return "Challenging yoga warnings under-applied";
    case "none":
      return "No issue (compliant)";
  }
}

export function verdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case "favourable":
      return "Favourable";
    case "avoid":
      return "Avoid";
    case "exception-applies":
      return "Exception applies — favourable for this event-type";
    case "needs-context":
      return "Valid component — needs contextual resolution";
  }
}

export function verdictColor(verdict: Verdict): string {
  switch (verdict) {
    case "favourable":
      return "#2F7D55";
    case "avoid":
      return "#A23A1E";
    case "exception-applies":
      return "#2E7D7B";
    case "needs-context":
      return "#B88421";
  }
}
