/**
 * Engine for Lesson 23.2.3 — 27 Nakṣatras Categorized.
 *
 * Provides the seven-category nakṣatra-classification framework (Cara, Sthira,
 * Ugra, Mṛdu, Tīkṣṇa, Miśra, Laghu), member nakṣatras, event-type affinities,
 * Puṣya universal-favourability, Tīkṣṇa-exception contexts, Mūla-doṣa distinction,
 * and scenario-based screener drills.
 */

export type CategoryKey =
  | "cara"
  | "sthira"
  | "ugra"
  | "mrdu"
  | "tikshna"
  | "mishra"
  | "laghu";

export type EventTypeKey =
  | "wedding"
  | "griha-pravesha"
  | "foundation-stone"
  | "travel"
  | "surgical-procedure"
  | "education-initiation"
  | "business-launch"
  | "aesthetic-event"
  | "pitri-tarpana"
  | "quick-completion";

export type IssueKey =
  | "single-limb-dominance"
  | "tikshna-over-application"
  | "tikshna-under-application"
  | "ugra-under-application"
  | "mula-dosha-conflation"
  | "pushya-variance-ignored"
  | "none";

export type Verdict = "favourable" | "avoid" | "exception-applies" | "needs-context";

export interface NakshatraCategory {
  key: CategoryKey;
  number: number;
  name: string;
  devanagari: string;
  meaning: string;
  color: string;
  memberCount: number;
  members: string[];
  character: string;
  affinities: string[];
  aversions: string[];
  exceptionNote?: string;
}

export interface NakshatraDef {
  name: string;
  category: CategoryKey;
  specialNote?: string;
}

export interface EventType {
  key: EventTypeKey;
  label: string;
  favourableCategories: CategoryKey[];
  avoidCategories: CategoryKey[];
  specialNakshatra?: string;
  specialNote?: string;
  explanation: string;
}

export interface Scenario {
  id: number;
  title: string;
  event: string;
  nakshatra: string;
  category: CategoryKey;
  situation: string;
  expectedIssue: IssueKey;
  expectedVerdict: Verdict;
  explanation: string;
  response: string;
}

export const CATEGORIES: NakshatraCategory[] = [
  {
    key: "cara",
    number: 1,
    name: "Cara",
    devanagari: "चर",
    meaning: "Movable",
    color: "#356CAB",
    memberCount: 5,
    members: ["Svātī", "Punarvasu", "Śravaṇa", "Dhaniṣṭhā", "Śatabhiṣā"],
    character: "Movable, momentum-oriented",
    affinities: ["Travel-commencement", "Vehicle-related initiations", "Momentum-actions", "Transit-related events"],
    aversions: ["Events requiring fixed permanence"],
  },
  {
    key: "sthira",
    number: 2,
    name: "Sthira",
    devanagari: "स्थिर",
    meaning: "Fixed / Stable",
    color: "#2F7D55",
    memberCount: 4,
    members: ["Rohiṇī", "Uttaraphalgunī", "Uttarāṣāḍhā", "Uttarabhādrapadā"],
    character: "Fixed, stable, foundational; long-duration permanence",
    affinities: ["Foundation-stone-laying", "Long-duration installations", "Marriages (Rohiṇī especially)", "Long-term commitments"],
    aversions: ["Quick transient actions without permanence"],
  },
  {
    key: "ugra",
    number: 3,
    name: "Ugra",
    devanagari: "उग्र",
    meaning: "Fierce / Severe",
    color: "#A23A1E",
    memberCount: 5,
    members: ["Bharaṇī", "Maghā", "Pūrvaphalgunī", "Pūrvāṣāḍhā", "Pūrvabhādrapadā"],
    character: "Fierce, severe, intense",
    affinities: ["Pitṛ-tarpaṇa and ancestor-related observances (Maghā)", "Specific dharma-tradition observances"],
    aversions: ["Most auspicious-initiations", "Weddings", "Gṛha-praveśa", "Joyful-initiations"],
    exceptionNote: "Maghā for pitṛ-tarpaṇa; specific deity-context observances for other Ugra nakṣatras.",
  },
  {
    key: "mrdu",
    number: 4,
    name: "Mṛdu",
    devanagari: "मृदु",
    meaning: "Mild / Soft",
    color: "#C1549A",
    memberCount: 4,
    members: ["Mṛgaśīrṣā", "Citrā", "Anurādhā", "Revatī"],
    character: "Mild, soft, gentle, aesthetic",
    affinities: ["Aesthetic actions", "Art-and-music initiations", "Soft-character ceremonies", "Relationship-oriented events"],
    aversions: ["Harsh or incisive actions where soft-character conflicts"],
  },
  {
    key: "tikshna",
    number: 5,
    name: "Tīkṣṇa",
    devanagari: "तीक्ष्ण",
    meaning: "Sharp / Incisive",
    color: "#8B0000",
    memberCount: 4,
    members: ["Ārdrā", "Āśleṣā", "Jyeṣṭhā", "Mūla"],
    character: "Sharp, incisive, decisive",
    affinities: ["Surgical procedures", "Certain tantric-tradition observances", "Boundary-establishment / cutting-actions"],
    aversions: ["Most auspicious-initiations", "Weddings", "Gṛha-praveśa", "Joyful-initiations"],
    exceptionNote: "Mūla-doṣa is a natal-context concern (birth-Moon-in-Mūla), distinct from muhūrta-context Mūla-window evaluation.",
  },
  {
    key: "mishra",
    number: 6,
    name: "Miśra",
    devanagari: "मिश्र",
    meaning: "Mixed",
    color: "#B88421",
    memberCount: 2,
    members: ["Kṛttikā", "Viśākhā"],
    character: "Mixed-character; both auspicious and challenging dimensions",
    affinities: ["Mixed-character event-types requiring careful fit", "Purification-and-refinement (Kṛttikā)", "Decisive multi-direction actions (Viśākhā)"],
    aversions: ["Events where unambiguous favourability is required without assessment"],
  },
  {
    key: "laghu",
    number: 7,
    name: "Laghu",
    devanagari: "लघु",
    meaning: "Light / Quick",
    color: "#2E7D7B",
    memberCount: 4,
    members: ["Aśvinī", "Puṣya", "Hasta", "Abhijit (or Citrā-3rd-pāda per tradition-variant)"],
    character: "Light, quick, swift; quick-completion",
    affinities: ["Quick-completion actions", "Initiations across many event-types", "Medical-initiations (Aśvinī)", "Craft-and-skill (Hasta)"],
    aversions: ["Events where slowness/permanence is required over lightness"],
    exceptionNote: "Puṣya is classically the most universally-favourable nakṣatra (nakṣatra-rāja), with a wedding-muhūrta regional-tradition variance.",
  },
];

export const NAKSHATRAS: NakshatraDef[] = [
  { name: "Aśvinī", category: "laghu", specialNote: "Swift-healing-and-initiation character" },
  { name: "Bharaṇī", category: "ugra" },
  { name: "Kṛttikā", category: "mishra", specialNote: "Burning/cutting/refinement character (Agni)" },
  { name: "Rohiṇī", category: "sthira", specialNote: "Moon's exaltation; favoured for wedding" },
  { name: "Mṛgaśīrṣā", category: "mrdu" },
  { name: "Ārdrā", category: "tikshna" },
  { name: "Punarvasu", category: "cara" },
  { name: "Puṣya", category: "laghu", specialNote: "Universally-favourable; nakṣatra-rāja; Bṛhaspati deity" },
  { name: "Āśleṣā", category: "tikshna" },
  { name: "Maghā", category: "ugra", specialNote: "Pitṛ-tarpaṇa exception-context" },
  { name: "Pūrvaphalgunī", category: "ugra" },
  { name: "Uttaraphalgunī", category: "sthira" },
  { name: "Hasta", category: "laghu", specialNote: "Handcraft-and-skill character" },
  { name: "Citrā", category: "mrdu" },
  { name: "Svātī", category: "cara" },
  { name: "Viśākhā", category: "mishra", specialNote: "Branching/dual-direction character (Indrāgni)" },
  { name: "Anurādhā", category: "mrdu" },
  { name: "Jyeṣṭhā", category: "tikshna" },
  { name: "Mūla", category: "tikshna", specialNote: "Mūla-doṣa is natal-context, distinct from muhūrta-window" },
  { name: "Pūrvāṣāḍhā", category: "ugra" },
  { name: "Uttarāṣāḍhā", category: "sthira" },
  { name: "Śravaṇa", category: "cara" },
  { name: "Dhaniṣṭhā", category: "cara" },
  { name: "Śatabhiṣā", category: "cara" },
  { name: "Pūrvabhādrapadā", category: "ugra" },
  { name: "Uttarabhādrapadā", category: "sthira" },
  { name: "Revatī", category: "mrdu", specialNote: "Prosperous-completion; favourable for many events" },
];

export const EVENT_TYPES: EventType[] = [
  {
    key: "wedding",
    label: "Wedding-muhūrta",
    favourableCategories: ["sthira", "mrdu", "laghu"],
    avoidCategories: ["ugra", "tikshna"],
    specialNakshatra: "Puṣya",
    specialNote: "Puṣya is generally favourable but has a wedding-specific regional-tradition variance (Bṛhaspati-Tārā narrative).",
    explanation:
      "Wedding favours Sthira (Rohiṇī especially; Uttaras for permanence), Mṛdu (Revatī, Anurādhā for relationship-softness), and Laghu (Puṣya with regional caveat). Ugra and Tīkṣṇa are avoided.",
  },
  {
    key: "griha-pravesha",
    label: "Gṛha-praveśa (house-warming)",
    favourableCategories: ["sthira", "mrdu", "laghu"],
    avoidCategories: ["ugra", "tikshna"],
    specialNakshatra: "Puṣya",
    explanation:
      "House-warming favours Sthira (foundational), Mṛdu (domestic-softness), and Laghu (Puṣya universal). Ugra and Tīkṣṇa avoided.",
  },
  {
    key: "foundation-stone",
    label: "Foundation-stone-laying",
    favourableCategories: ["sthira", "laghu"],
    avoidCategories: ["ugra", "tikshna"],
    explanation:
      "Foundation-stone-laying matches Sthira's fixed-stable character most directly. Laghu (Puṣya, Hasta) supports. Ugra and Tīkṣṇa avoided.",
  },
  {
    key: "travel",
    label: "Travel-commencement",
    favourableCategories: ["cara", "laghu"],
    avoidCategories: ["sthira"],
    explanation:
      "Travel favours Cara (movable/momentum) and Laghu (quick/light). Sthira is the least aligned because it resists movement.",
  },
  {
    key: "surgical-procedure",
    label: "Surgical procedure",
    favourableCategories: ["tikshna", "laghu"],
    avoidCategories: ["ugra", "mrdu", "mishra"],
    specialNakshatra: "Mūla / Āśleṣā / Jyeṣṭhā / Ārdrā",
    specialNote: "Tīkṣṇa nakṣatras are the exception-context for surgery — their sharp-incisive character matches surgical action.",
    explanation:
      "Surgery is the canonical Tīkṣṇa-exception-context. Laghu (Aśvinī swift-healing) also supports. Ugra, Mṛdu, and Miśra are avoided.",
  },
  {
    key: "education-initiation",
    label: "Education initiation / Upanayana",
    favourableCategories: ["laghu", "mrdu", "sthira"],
    avoidCategories: ["ugra", "tikshna"],
    specialNakshatra: "Puṣya",
    explanation:
      "Education-initiation favours Laghu (Puṣya nourishment + Aśvinī initiation), Mṛdu (gentle learning), and Sthira (long-term foundation). Ugra and Tīkṣṇa avoided.",
  },
  {
    key: "business-launch",
    label: "Business-launch / Major venture",
    favourableCategories: ["laghu", "sthira", "mrdu"],
    avoidCategories: ["ugra", "tikshna"],
    specialNakshatra: "Puṣya",
    explanation:
      "Business-launch favours Laghu (Puṣya prosperity), Sthira (long-duration foundation), and Mṛdu (relationship/commerce). Ugra and Tīkṣṇa avoided.",
  },
  {
    key: "aesthetic-event",
    label: "Aesthetic / Art / Music event",
    favourableCategories: ["mrdu", "laghu"],
    avoidCategories: ["ugra", "tikshna"],
    explanation:
      "Aesthetic events favour Mṛdu (Citrā, Revatī, Mṛgaśīrṣā) and Laghu (Hasta craft). Ugra and Tīkṣṇa avoided.",
  },
  {
    key: "pitri-tarpana",
    label: "Pitṛ-tarpaṇa / Ancestor observance",
    favourableCategories: ["ugra"],
    avoidCategories: ["cara", "sthira", "mrdu", "laghu"],
    specialNakshatra: "Maghā",
    specialNote: "Maghā (Ugra) is the specific exception-context for pitṛ-tarpaṇa and ancestor-related observances.",
    explanation:
      "Ancestor observances are the exception-context where Ugra (specifically Maghā) is appropriate. The other categories are not aligned with ancestor-context.",
  },
  {
    key: "quick-completion",
    label: "Quick-completion action",
    favourableCategories: ["laghu", "cara"],
    avoidCategories: ["sthira"],
    explanation:
      "Quick-completion actions favour Laghu (light/quick) and Cara (momentum). Sthira (fixed/slow) is least aligned.",
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Wedding on Rohiṇī but Riktā tithi",
    event: "Wedding-muhūrta",
    nakshatra: "Rohiṇī",
    category: "sthira",
    situation:
      "A practitioner recommends a wedding-muhūrta because the Moon is in Rohiṇī (Sthira — one of the most favourable wedding nakṣatras). They did not check the tithi, which is Caturthī (Riktā).",
    expectedIssue: "single-limb-dominance",
    expectedVerdict: "avoid",
    explanation:
      "Rohiṇī is extremely favourable for wedding, but the Riktā tithi rules out the candidate. Single-limb dominance (nakṣatra-only) would produce a wrong recommendation. The integration-discipline requires all limbs.",
    response:
      "Reject this candidate. Rohiṇī is excellent, but Caturthī Riktā is classically avoided for wedding-muhūrta and overrides the nakṣatra-strength. Select a candidate with favourable tithi + vāra + nakṣatra together.",
  },
  {
    id: 2,
    title: "Surgery scheduled on Mūla nakṣatra",
    event: "Surgical procedure",
    nakshatra: "Mūla",
    category: "tikshna",
    situation:
      "A client asks whether Mūla nakṣatra is appropriate for an elective surgery. They have heard Mūla is 'bad' because of Mūla-doṣa.",
    expectedIssue: "tikshna-over-application",
    expectedVerdict: "exception-applies",
    explanation:
      "Mūla is Tīkṣṇa and generally avoided for auspicious-initiations, but surgical-procedure is the canonical exception-context. The client is conflating Mūla-doṣa (natal-context) with muhūrta-context Mūla-window.",
    response:
      "For surgery, Mūla's sharp-incisive character is appropriate (Tīkṣṇa-exception). Distinguish this from Mūla-doṣa, which is a natal-chart concern. Combined with Maṅgala-vāra, a Mūla surgical-muhūrta is particularly strong.",
  },
  {
    id: 3,
    title: "Wedding on Puṣya with regional-tradition objection",
    event: "Wedding-muhūrta",
    nakshatra: "Puṣya",
    category: "laghu",
    situation:
      "One family wants a wedding on Puṣya because it is universally-favourable. The other family objects, citing their regional tradition that Puṣya is less-favourable for marriage due to the Bṛhaspati-Tārā narrative.",
    expectedIssue: "pushya-variance-ignored",
    expectedVerdict: "needs-context",
    explanation:
      "Puṣya is generally universally-favourable, but there is a genuine regional-tradition variance for wedding-muhūrta. The practitioner must acknowledge the variance and let the families align on which tradition-treatment to honour.",
    response:
      "Explain both classical positions honestly. If the families align on the Puṣya-favourable tradition, proceed; if they align on the Puṣya-wedding-avoidance tradition, select another date. Do not override the regional-tradition variance.",
  },
  {
    id: 4,
    title: "Mūla-doṣa conflation in wedding-muhūrta",
    event: "Wedding-muhūrta",
    nakshatra: "Mūla",
    category: "tikshna",
    situation:
      "A client says: 'My daughter was born with Mūla-doṣa. Should we select a Mūla nakṣatra for her wedding-muhūrta to balance it?'",
    expectedIssue: "mula-dosha-conflation",
    expectedVerdict: "avoid",
    explanation:
      "The client is conflating natal-context Mūla-doṣa (jātaka-domain) with muhūrta-context Mūla-window. Mūla is Tīkṣṇa and avoided for wedding-muhūrta regardless of the actor's birth-Moon-in-Mūla.",
    response:
      "Clarify that Mūla-doṣa is a natal-context concern addressed through natal remedial observances. The wedding-muhūrta selection operates in muhūrta-domain and avoids Mūla for weddings. Select Sthira or Mṛdu nakṣatras instead.",
  },
  {
    id: 5,
    title: "Wedding on Pūrvāṣāḍhā ignoring Ugra-avoidance",
    event: "Wedding-muhūrta",
    nakshatra: "Pūrvāṣāḍhā",
    category: "ugra",
    situation:
      "A practitioner recommends a wedding-muhūrta on Pūrvāṣāḍhā because the tithi and vāra are favourable, arguing that 'all nakṣatras have something to recommend them.'",
    expectedIssue: "ugra-under-application",
    expectedVerdict: "avoid",
    explanation:
      "Pūrvāṣāḍhā is Ugra (fierce) and classically avoided for wedding-muhūrta. The Pūrva-prefixed nakṣatras are in Ugra while their Uttara counterparts are Sthira. Under-applying Ugra-avoidance is a discipline-failure.",
    response:
      "Reject Pūrvāṣāḍhā for wedding. Explain the Pūrva/Uttara distinction: Uttarāṣāḍhā (Sthira) would be favourable, but Pūrvāṣāḍhā (Ugra) is not. Favourable tithi/vāra do not override Ugra-nakṣatra weakness for weddings.",
  },
  {
    id: 6,
    title: "Education initiation on Puṣya with integrated assessment",
    event: "Education initiation / Upanayana",
    nakshatra: "Puṣya",
    category: "laghu",
    situation:
      "A family schedules a vidyā-ārambha on Puṣya nakṣatra, with favourable tithi (Pūrṇā), favourable vāra (Thursday), and favourable chart-correspondence.",
    expectedIssue: "none",
    expectedVerdict: "favourable",
    explanation:
      "Puṣya is universally-favourable and especially strong for education-initiation (Bṛhaspati deity). The family checked tithi, vāra, and chart-correspondence, avoiding single-limb dominance.",
    response:
      "This is discipline-compliant: Puṣya's nourishment + Bṛhaspati character strongly supports education-initiation, and the integrated limb-checks confirm the overall quality.",
  },
];

export const INTEGRATION_STEPS = [
  {
    title: "Step 1 — Identify the event-type",
    text: "Wedding, gṛha-praveśa, foundation-stone, travel, surgery, education, business, aesthetic, ancestor observance, or quick-completion.",
  },
  {
    title: "Step 2 — Map nakṣatra to seven-category framework",
    text: "Determine whether the candidate nakṣatra is Cara, Sthira, Ugra, Mṛdu, Tīkṣṇa, Miśra, or Laghu.",
  },
  {
    title: "Step 3 — Apply event-type-specific affinity/aversion",
    text: "Sthira for foundational/marriage; Cara for travel; Mṛdu for aesthetic/soft; Laghu for quick-completion + Puṣya universal; Ugra generally avoided; Tīkṣṇa avoided except surgery; Miśra assessed carefully.",
  },
  {
    title: "Step 4 — Check exception-contexts",
    text: "Puṣya universal-favourability (with wedding regional variance); Tīkṣṇa for surgery/tantric/decisive-action; Maghā/Ugra for pitṛ-tarpaṇa; Mūla-doṣa stays in natal-context.",
  },
  {
    title: "Step 5 — Integrate with tithi + vāra",
    text: "Combine nakṣatra-component with tithi-classification (Lesson 23.2.1) and vāra-lord-effects (Lesson 23.2.2). A strong nakṣatra does not override a ruling-out tithi.",
  },
  {
    title: "Step 6 — Add yoga + karaṇa + chart-correspondence",
    text: "Complete the pañcāṅga-aggregation with yoga, karaṇa (M23 Chapter 3) and synergy-with-natal-chart analysis including tārā-bala (M23 Chapter 3).",
  },
];

export function getCategory(key: CategoryKey): NakshatraCategory | undefined {
  return CATEGORIES.find((c) => c.key === key);
}

export function getEventType(key: EventTypeKey): EventType | undefined {
  return EVENT_TYPES.find((e) => e.key === key);
}

export function issueLabel(key: IssueKey): string {
  switch (key) {
    case "single-limb-dominance":
      return "Single-limb dominance";
    case "tikshna-over-application":
      return "Tīkṣṇa over-application";
    case "tikshna-under-application":
      return "Tīkṣṇa under-application";
    case "ugra-under-application":
      return "Ugra under-application";
    case "mula-dosha-conflation":
      return "Mūla-doṣa natal/muhūrta conflation";
    case "pushya-variance-ignored":
      return "Puṣya regional-tradition variance ignored";
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
      return "Valid nakṣatra-component — needs contextual resolution";
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
  "tikshna-over-application",
  "tikshna-under-application",
  "ugra-under-application",
  "mula-dosha-conflation",
  "pushya-variance-ignored",
];
