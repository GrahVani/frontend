/**
 * Engine for Lesson 23.2.1 — Tithi Classification.
 *
 * Provides the Nandā-Bhadrā-Jayā-Riktā-Pūrṇā five-fold framework,
 * event-type-specific affinities, pakṣa-modulation notes, Riktā-exception
 * contexts, and scenario-based screener drills.
 */

export type CategoryKey = "nanda" | "bhadra" | "jaya" | "rikta" | "purna";
export type PakshaKey = "shukla" | "krishna";
export type EventTypeKey =
  | "wedding"
  | "griha-pravesha"
  | "foundation-stone"
  | "legal-action"
  | "festival-celebration"
  | "business-launch"
  | "ganesha-caturthi"
  | "devi-navami"
  | "shiva-chaturdashi"
  | "spiritual-initiation";

export type IssueKey =
  | "single-limb-dominance"
  | "rikta-over-application"
  | "rikta-under-application"
  | "special-status-ignored"
  | "vrata-modulation-ignored"
  | "none";

export type Verdict = "favourable" | "avoid" | "exception-applies" | "needs-context";

export interface TithiCategory {
  key: CategoryKey;
  number: number;
  name: string;
  devanagari: string;
  meaning: string;
  color: string;
  positions: number[];
  character: string;
  affinities: string[];
  aversions: string[];
  pakshaNote: string;
  specialTithiNotes: { tithi: number; note: string }[];
}

export interface EventType {
  key: EventTypeKey;
  label: string;
  categoryRank: CategoryKey[];
  avoid: CategoryKey[];
  exceptionContext?: string;
  pakshaPreference?: PakshaKey | "either";
  explanation: string;
}

export interface TithiDef {
  number: number;
  paksha: PakshaKey;
  category: CategoryKey;
  name: string;
  specialStatus?: "purnima" | "amavasya" | "vrata" | "mixed";
}

export interface Scenario {
  id: number;
  title: string;
  event: string;
  tithiNumber: number;
  paksha: PakshaKey;
  tithiName: string;
  situation: string;
  expectedCategory: CategoryKey;
  expectedIssue: IssueKey;
  expectedVerdict: Verdict;
  explanation: string;
  response: string;
}

export const CATEGORIES: TithiCategory[] = [
  {
    key: "nanda",
    number: 1,
    name: "Nandā",
    devanagari: "नन्दा",
    meaning: "Joyful / Delight",
    color: "#2F7D55",
    positions: [1, 6, 11],
    character: "Ānanda-character; joyful, celebratory, light",
    affinities: ["Festivals", "Celebrations", "Joyful ceremonies", "Art-and-music initiations", "Birth-related observances"],
    aversions: ["Heavy material-initiations where solemnity is required"],
    pakshaNote: "Stronger for growth-oriented celebration in śukla-pakṣa; completion-joy in kṛṣṇa-pakṣa.",
    specialTithiNotes: [
      { tithi: 11, note: "Ekādaśī is Nandā-categorised but also a vrata-day; less favourable for material-initiations, favourable for spiritual-initiations." },
    ],
  },
  {
    key: "bhadra",
    number: 2,
    name: "Bhadrā",
    devanagari: "भद्रा",
    meaning: "Noble / Auspicious / Foundational",
    color: "#356CAB",
    positions: [2, 7, 12],
    character: "Bhadra-character; noble, foundational, dharmic",
    affinities: ["Foundation-stone-laying", "Governance-actions", "Dharma initiations", "Weddings", "Long-term commitments"],
    aversions: ["Quick speculative ventures without foundation"],
    pakshaNote: "Excellent in both pakṣas; śukla-pakṣa supports new foundational starts, kṛṣṇa-pakṣa supports foundational completions.",
    specialTithiNotes: [
      { tithi: 12, note: "Dvādaśī is favourable for completions-with-initiation-character." },
    ],
  },
  {
    key: "jaya",
    number: 3,
    name: "Jayā",
    devanagari: "जया",
    meaning: "Victorious / Triumphant",
    color: "#B88421",
    positions: [3, 8, 13],
    character: "Jaya-character; victory, success-in-contest",
    affinities: ["Legal-case filing", "Competitive ventures", "Leadership onset", "Contest-oriented actions"],
    aversions: ["Events where cooperation rather than contest is central"],
    pakshaNote: "Stronger in śukla-pakṣa for growth-oriented competition; kṛṣṇa-pakṣa for concluding a contest.",
    specialTithiNotes: [
      { tithi: 8, note: "Aṣṭamī is Jayā-categorised but also associated with Devī-observances; some traditions find it mixed for material-initiations." },
      { tithi: 13, note: "Trayodaśī is Jayā-categorised but also Pradoṣa-vrata day; modulation applies for material-initiations." },
    ],
  },
  {
    key: "rikta",
    number: 4,
    name: "Riktā",
    devanagari: "रिक्ता",
    meaning: "Empty / Depleted",
    color: "#A23A1E",
    positions: [4, 9, 14],
    character: "Rikta-character; empty, depleted, generally avoided",
    affinities: ["Specific tradition-grounded observances only", "Cleansing / completion-rites", "Dissolution-themed observances"],
    aversions: ["Most material-initiations", "Weddings", "Gṛha-praveśa", "Business launches"],
    pakshaNote: "Avoided in both pakṣas for material-initiations; exception-contexts operate by event-type, not pakṣa.",
    specialTithiNotes: [
      { tithi: 4, note: "Caturthī: Gaṇeśa-related observances (Saṅkaṣṭa-Hara Caturthī) override Riktā-avoidance." },
      { tithi: 9, note: "Navamī: Devī-related observances (Rāma-Navamī, Sītā-Navamī) override Riktā-avoidance." },
      { tithi: 14, note: "Caturdaśī: Śiva-related observances (Pradoṣa, Mahā-Śivarātri) override Riktā-avoidance." },
    ],
  },
  {
    key: "purna",
    number: 5,
    name: "Pūrṇā",
    devanagari: "पूर्णा",
    meaning: "Full / Complete",
    color: "#6B4C9A",
    positions: [5, 10, 15],
    character: "Pūrṇa-character; full, complete, integrative",
    affinities: ["Weddings", "Major launches", "Integrative ceremonies", "Cycle-completion rites"],
    aversions: ["Minor actions where completion-character is excessive"],
    pakshaNote: "Śukla-pakṣa Pūrṇā favours growth-through-completion; kṛṣṇa-pakṣa Pūrṇā favours conclusion.",
    specialTithiNotes: [
      { tithi: 15, note: "Pūrṇimā (śukla-15) is classically auspicious for most initiations; Amāvasyā (kṛṣṇa-15) is classically challenging for most material-initiations." },
    ],
  },
];

export const EVENT_TYPES: EventType[] = [
  {
    key: "wedding",
    label: "Wedding-muhūrta",
    categoryRank: ["purna", "bhadra", "nanda", "jaya"],
    avoid: ["rikta"],
    pakshaPreference: "either",
    explanation:
      "Wedding favours Pūrṇā (completion-and-integration of two families) and Bhadrā (noble-foundational character). Nandā adds joy; Jayā is acceptable but less central. Riktā is avoided (no wedding exception).",
  },
  {
    key: "griha-pravesha",
    label: "Gṛha-praveśa (house-warming)",
    categoryRank: ["bhadra", "purna", "nanda"],
    avoid: ["rikta"],
    pakshaPreference: "either",
    explanation:
      "House-warming is a foundational-and-completion event; Bhadrā and Pūrṇā are strongest. Nandā brings celebratory joy. Riktā is avoided.",
  },
  {
    key: "foundation-stone",
    label: "Foundation-stone-laying / Śīlā-nyāsa",
    categoryRank: ["bhadra", "purna"],
    avoid: ["rikta"],
    pakshaPreference: "shukla",
    explanation:
      "Foundation-laying matches Bhadrā's noble-foundational character most directly. Pūrṇā supports. Śukla-pakṣa growth-energy is preferred. Riktā avoided.",
  },
  {
    key: "legal-action",
    label: "Legal-case filing / Competitive action",
    categoryRank: ["jaya", "bhadra", "purna"],
    avoid: ["rikta"],
    pakshaPreference: "shukla",
    explanation:
      "Legal and competitive contexts favour Jayā (victory). Bhadrā adds nobility/dharmic grounding; Pūrṇā supports completion. Riktā avoided.",
  },
  {
    key: "festival-celebration",
    label: "Festival celebration / Joyful ceremony",
    categoryRank: ["nanda", "purna", "bhadra"],
    avoid: ["rikta"],
    pakshaPreference: "either",
    explanation:
      "Joyful events favour Nandā. Pūrṇā supports full-moon and completion-festivals; Bhadrā supports dharmic-festival character. Riktā avoided unless the festival itself is the exception-context.",
  },
  {
    key: "business-launch",
    label: "Business-launch / Major venture",
    categoryRank: ["purna", "bhadra", "jaya"],
    avoid: ["rikta"],
    pakshaPreference: "shukla",
    explanation:
      "Launches favour Pūrṇā (fullness/major start), Bhadrā (foundation), and Jayā (competitive success). Śukla-pakṣa growth-energy is preferred. Riktā avoided.",
  },
  {
    key: "ganesha-caturthi",
    label: "Gaṇeśa-Caturthī observance",
    categoryRank: ["rikta"],
    avoid: [],
    exceptionContext: "Riktā Caturthī exception: Gaṇeśa-related observances override general Riktā-avoidance.",
    pakshaPreference: "either",
    explanation:
      "Although Caturthī is Riktā-categorised, Gaṇeśa-related observances are the canonical exception-context. The exception is event-type-specific, not a general override.",
  },
  {
    key: "devi-navami",
    label: "Devī-Navamī observance",
    categoryRank: ["rikta"],
    avoid: [],
    exceptionContext: "Riktā Navamī exception: Devī-related observances override general Riktā-avoidance.",
    pakshaPreference: "either",
    explanation:
      "Although Navamī is Riktā-categorised, Devī-related observances (Rāma-Navamī, Sītā-Navamī) are the canonical exception-context.",
  },
  {
    key: "shiva-chaturdashi",
    label: "Śiva-Caturdaśī observance",
    categoryRank: ["rikta"],
    avoid: [],
    exceptionContext: "Riktā Caturdaśī exception: Śiva-related observances override general Riktā-avoidance.",
    pakshaPreference: "either",
    explanation:
      "Although Caturdaśī is Riktā-categorised, Śiva-related observances (Pradoṣa, Mahā-Śivarātri) are the canonical exception-context.",
  },
  {
    key: "spiritual-initiation",
    label: "Spiritual initiation / Vrata",
    categoryRank: ["nanda", "purna"],
    avoid: ["rikta"],
    exceptionContext: "Ekādaśī (Nandā) is favourable for spiritual-initiations despite its vrata-day modulation for material-initiations.",
    pakshaPreference: "either",
    explanation:
      "Spiritual initiations and vratas favour Nandā (Ekādaśī's joy) and Pūrṇā (Pūrṇimā fullness). The vrata-day modulation that limits Ekādaśī for material-initiations does not apply to spiritual-initiations.",
  },
];

export const TITHIS: TithiDef[] = [
  { number: 1, paksha: "shukla", category: "nanda", name: "Pratipadā" },
  { number: 2, paksha: "shukla", category: "bhadra", name: "Dvitīyā" },
  { number: 3, paksha: "shukla", category: "jaya", name: "Tṛtīyā" },
  { number: 4, paksha: "shukla", category: "rikta", name: "Caturthī" },
  { number: 5, paksha: "shukla", category: "purna", name: "Pañcamī" },
  { number: 6, paksha: "shukla", category: "nanda", name: "Ṣaṣṭhī" },
  { number: 7, paksha: "shukla", category: "bhadra", name: "Saptamī" },
  { number: 8, paksha: "shukla", category: "jaya", name: "Aṣṭamī" },
  { number: 9, paksha: "shukla", category: "rikta", name: "Navamī" },
  { number: 10, paksha: "shukla", category: "purna", name: "Daśamī" },
  { number: 11, paksha: "shukla", category: "nanda", name: "Ekādaśī", specialStatus: "vrata" },
  { number: 12, paksha: "shukla", category: "bhadra", name: "Dvādaśī" },
  { number: 13, paksha: "shukla", category: "jaya", name: "Trayodaśī" },
  { number: 14, paksha: "shukla", category: "rikta", name: "Caturdaśī" },
  { number: 15, paksha: "shukla", category: "purna", name: "Pūrṇimā", specialStatus: "purnima" },
  { number: 1, paksha: "krishna", category: "nanda", name: "Pratipadā" },
  { number: 2, paksha: "krishna", category: "bhadra", name: "Dvitīyā" },
  { number: 3, paksha: "krishna", category: "jaya", name: "Tṛtīyā" },
  { number: 4, paksha: "krishna", category: "rikta", name: "Caturthī" },
  { number: 5, paksha: "krishna", category: "purna", name: "Pañcamī" },
  { number: 6, paksha: "krishna", category: "nanda", name: "Ṣaṣṭhī" },
  { number: 7, paksha: "krishna", category: "bhadra", name: "Saptamī" },
  { number: 8, paksha: "krishna", category: "jaya", name: "Aṣṭamī" },
  { number: 9, paksha: "krishna", category: "rikta", name: "Navamī" },
  { number: 10, paksha: "krishna", category: "purna", name: "Daśamī" },
  { number: 11, paksha: "krishna", category: "nanda", name: "Ekādaśī", specialStatus: "vrata" },
  { number: 12, paksha: "krishna", category: "bhadra", name: "Dvādaśī" },
  { number: 13, paksha: "krishna", category: "jaya", name: "Trayodaśī" },
  { number: 14, paksha: "krishna", category: "rikta", name: "Caturdaśī" },
  { number: 15, paksha: "krishna", category: "purna", name: "Amāvasyā", specialStatus: "amavasya" },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Wedding on Daśamī with single-limb dominance",
    event: "Wedding-muhūrta",
    tithiNumber: 10,
    paksha: "shukla",
    tithiName: "Śukla-Daśamī",
    situation:
      "A practitioner-in-training recommends a wedding-muhūrta solely because the tithi is Daśamī (Pūrṇā). They did not evaluate vāra, nakṣatra, yoga, karaṇa, or chart-correspondence.",
    expectedCategory: "purna",
    expectedIssue: "single-limb-dominance",
    expectedVerdict: "needs-context",
    explanation:
      "Daśamī Pūrṇā is genuinely favourable for wedding-muhūrta, but the recommendation is premature. Tithi is one of five pañcāṅga-limbs; the pañcāṅga itself is one input alongside chart-correspondence. The candidate needs integrated assessment before it becomes a recommendation.",
    response:
      "Add vāra, nakṣatra, yoga, karaṇa evaluation and chart-correspondence analysis. Only recommend after integrated assessment. Daśamī is a strong tithi-component, not a sufficient condition.",
  },
  {
    id: 2,
    title: "Wedding on Caturthī — Riktā, no exception",
    event: "Wedding-muhūrta",
    tithiNumber: 4,
    paksha: "shukla",
    tithiName: "Śukla-Caturthī",
    situation:
      "A family insists on a wedding date that falls on śukla-Caturthī because it is the only weekend that works for relatives. The practitioner is asked whether the tithi is acceptable.",
    expectedCategory: "rikta",
    expectedIssue: "rikta-over-application",
    expectedVerdict: "avoid",
    explanation:
      "Caturthī is Riktā-categorised. The general Riktā-avoidance applies to weddings; the Gaṇeśa-Caturthī exception does not apply. A Riktā tithi receives strong negative-weighting for wedding-muhūrta.",
    response:
      "Explain that Caturthī is classically avoided for wedding-muhūrta because it is Riktā. Offer alternative dates if possible. Do not invoke the Gaṇeśa-Caturthī exception for a wedding.",
  },
  {
    id: 3,
    title: "Gaṇeśa-Caturthī vrata — exception applies",
    event: "Gaṇeśa-Caturthī observance",
    tithiNumber: 4,
    paksha: "krishna",
    tithiName: "Kṛṣṇa-Caturthī",
    situation:
      "A client asks whether a Saṅkaṣṭa-Hara Gaṇeśa-vrata can be initiated on kṛṣṇa-Caturthī. They have heard that Caturthī is Riktā and therefore inauspicious.",
    expectedCategory: "rikta",
    expectedIssue: "rikta-under-application",
    expectedVerdict: "exception-applies",
    explanation:
      "Caturthī is Riktā in the general framework, but Gaṇeśa-related observances are the canonical exception-context. Refusing this date would be over-application of Riktā-avoidance.",
    response:
      "For a Gaṇeśa-related observance, Caturthī is the appropriate tithi. Apply the general rule for general events; recognise the specific exception for this event-type. Still evaluate the other limbs and the specific muhūrta-window.",
  },
  {
    id: 4,
    title: "Business launch on Amāvasyā — special-status ignored",
    event: "Business-launch",
    tithiNumber: 15,
    paksha: "krishna",
    tithiName: "Amāvasyā",
    situation:
      "A practitioner recommends a major business-launch on kṛṣṇa-pakṣa 15, arguing that it is Pūrṇā-categorised and therefore favourable.",
    expectedCategory: "purna",
    expectedIssue: "special-status-ignored",
    expectedVerdict: "avoid",
    explanation:
      "Amāvasyā is technically in the Pūrṇā category, but it carries special-status: classically challenging for most material-initiations. Treating it as automatically favourable because of the Pūrṇā label ignores the §4.8 special-status discipline.",
    response:
      "Amāvasyā is Pūrṇā-categorised but classically challenging for material-initiations. For a business-launch, choose a different Pūrṇā tithi (e.g., Pañcamī or Daśamī) or a Bhadrā tithi.",
  },
  {
    id: 5,
    title: "Material wedding on Ekādaśī — vrata modulation ignored",
    event: "Wedding-muhūrta",
    tithiNumber: 11,
    paksha: "shukla",
    tithiName: "Śukla-Ekādaśī",
    situation:
      "A practitioner recommends a material wedding-muhūrta on śukla-Ekādaśī, citing its Nandā-categorisation as joyful and therefore favourable.",
    expectedCategory: "nanda",
    expectedIssue: "vrata-modulation-ignored",
    expectedVerdict: "avoid",
    explanation:
      "Ekādaśī is Nandā-categorised, but its vrata-day-character makes it less favourable for material-initiations. It is favourable for spiritual-initiations, not for a material wedding.",
    response:
      "Ekādaśī's Nandā-categorisation is real, but the vrata-day modulation limits its applicability to material-initiations. For a material wedding, choose Pūrṇā or Bhadrā tithis instead.",
  },
  {
    id: 6,
    title: "Legal case filing on Tṛtīyā — appropriate Jayā use",
    event: "Legal-case filing",
    tithiNumber: 3,
    paksha: "shukla",
    tithiName: "Śukla-Tṛtīyā",
    situation:
      "A practitioner files a court-case on śukla-Tṛtīyā, noting it is Jayā-categorised and favourable for competitive/legal contexts. They also evaluated vāra and nakṣatra.",
    expectedCategory: "jaya",
    expectedIssue: "none",
    expectedVerdict: "favourable",
    explanation:
      "Tṛtīyā is Jayā-categorised and favourable for legal/competitive actions. Śukla-pakṣa supports growth-oriented contest. The practitioner also checked other limbs, avoiding single-limb dominance.",
    response:
      "This is discipline-compliant: Jayā tithi chosen for a victory-oriented event, with other pañcāṅga-limbs evaluated, and no misapplication of Riktā or special-status rules.",
  },
];

export const INTEGRATION_STEPS = [
  {
    title: "Step 1 — Identify the event-type",
    text: "Wedding, gṛha-praveśa, foundation-stone, legal/competitive, festival, business-launch, or tradition-specific observance (Gaṇeśa/Devī/Śiva).",
  },
  {
    title: "Step 2 — Apply the five-fold tithi-classification",
    text: "Map the candidate tithi to Nandā/Bhadrā/Jayā/Riktā/Pūrṇā and check event-type affinity/aversion.",
  },
  {
    title: "Step 3 — Apply pakṣa-modulation",
    text: "Śukla-pakṣa favours growth-and-expansion; kṛṣṇa-pakṣa favours completion-and-conclusion. Note Pūrṇimā/Amāvasyā special-status.",
  },
  {
    title: "Step 4 — Check Riktā-avoidance and exception-contexts",
    text: "Riktā tithis are generally avoided; Gaṇeśa-Caturthī, Devī-Navamī, and Śiva-Caturdaśī are specific exception-contexts only.",
  },
  {
    title: "Step 5 — Apply vrata-day and special-tithi modulations",
    text: "Ekādaśī is Nandā but vrata-day; Aṣṭamī/Trayodaśī have Devī/Śiva associations; Pūrṇimā auspicious; Amāvasyā challenging for material-initiations.",
  },
  {
    title: "Step 6 — Integrate with other limbs and chart-correspondence",
    text: "Tithi is one pañcāṅga-limb. Combine with vāra, nakṣatra, yoga, karaṇa and synergy-with-natal-chart before final recommendation.",
  },
];

export function getCategory(key: CategoryKey): TithiCategory | undefined {
  return CATEGORIES.find((c) => c.key === key);
}

export function getEventType(key: EventTypeKey): EventType | undefined {
  return EVENT_TYPES.find((e) => e.key === key);
}

export function categoryFor(tithiNumber: number): CategoryKey {
  const cat = CATEGORIES.find((c) => c.positions.includes(tithiNumber));
  return cat?.key ?? "rikta";
}

export function issueLabel(key: IssueKey): string {
  switch (key) {
    case "single-limb-dominance":
      return "Single-limb dominance";
    case "rikta-over-application":
      return "Riktā over-application";
    case "rikta-under-application":
      return "Riktā under-application";
    case "special-status-ignored":
      return "Special-status tithi ignored";
    case "vrata-modulation-ignored":
      return "Vrata-day modulation ignored";
    case "none":
      return "No issue";
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
      return "Valid tithi-component — needs integrated context";
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

export const ISSUE_OPTIONS: IssueKey[] = [
  "none",
  "single-limb-dominance",
  "rikta-over-application",
  "rikta-under-application",
  "special-status-ignored",
  "vrata-modulation-ignored",
];
