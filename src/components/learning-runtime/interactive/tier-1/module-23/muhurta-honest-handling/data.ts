export type ConvergenceFactorKey =
  | "panchanga"
  | "chartPillars"
  | "houseBala"
  | "eventPlanets"
  | "cancellations"
  | "subDayFilters";

export type TradeOffKey =
  | "strongPanchangaWeakLagna"
  | "multiActorSynergy"
  | "favourableVaraSubWindow";

export type ScenarioKey =
  | "awaitPerfect"
  | "marriageFails"
  | "cumulativeSynthesis";

export type DaivajnaKey =
  | "satya"
  | "daya"
  | "nirlobha"
  | "jnanin"
  | "sastravit";

export type InstanceCategory =
  | "attribution"
  | "articulation"
  | "tradeOff"
  | "variance"
  | "ethics"
  | "cancellation"
  | "scope";

export type MistakeKey =
  | "promisePerfect"
  | "postponeVital"
  | "predeterminedPrescription";

export interface Option<T extends string> {
  key: T;
  label: string;
  note: string;
}

export interface ConvergenceFactor extends Option<ConvergenceFactorKey> {
  fullLabel: string;
  description: string;
  typicalState: string;
}

export interface TradeOff extends Option<TradeOffKey> {
  example: string;
  lessonRef: string;
  honestResponse: string;
}

export interface ClientScenario extends Option<ScenarioKey> {
  clientQuote: string;
  practitionerAnswer: string[];
  keyDisciplines: string[];
  verdict: string;
}

export interface DaivajnaQualification extends Option<DaivajnaKey> {
  devanagari: string;
  meaning: string;
  honestHandlingRole: string;
}

export interface HonestHandlingInstance {
  id: number;
  lesson: string;
  category: InstanceCategory;
  label: string;
  content: string;
}

export interface CommonMistake extends Option<MistakeKey> {
  warning: string;
  remedy: string;
}

export const CONVERGENCE_FACTORS: ConvergenceFactor[] = [
  {
    key: "panchanga",
    label: "Pañcāṅga 5 limbs",
    fullLabel: "All five pañcāṅga limbs favourable",
    note: "Tithi + Vāra + Nakṣatra + Yoga + Karaṇa",
    description: "Each limb must be favourable for the event type. In practice one or more limbs are mixed.",
    typicalState: "Mixed — one or more limbs acceptable but not ideal.",
  },
  {
    key: "chartPillars",
    label: "Four chart pillars",
    fullLabel: "Four chart-correspondence pillars favourable",
    note: "Lagna + Moon + Tārā-bala + House-bala",
    description: "Lagna-śuddhi, lunar strength, nakṣatra synergy, and house strength must all align.",
    typicalState: "Mixed — strong on some pillars, weak on others.",
  },
  {
    key: "houseBala",
    label: "Event house-bala",
    fullLabel: "Event-specific house-bala favourable",
    note: "Relevant bhāva for the event",
    description: "The house governing the event must be strong and free from affliction.",
    typicalState: "Context-dependent — rarely perfect for all actors.",
  },
  {
    key: "eventPlanets",
    label: "Event planets",
    fullLabel: "Event-type-specific planetary importance favourable",
    note: "Key grahas for the event",
    description: "Wedding needs strong Jupiter-Venus; commerce needs strong Mercury-Jupiter, etc.",
    typicalState: "Mixed — some dignified, some ordinary.",
  },
  {
    key: "cancellations",
    label: "Cancellations cleared",
    fullLabel: "All cancellation-doṣas cleared",
    note: "Parigha, Bhadrā, Pañcaka, etc.",
    description: "Every doṣa must be absent or legitimately cancelled per the tradition.",
    typicalState: "Often cleared, but requires explicit verification.",
  },
  {
    key: "subDayFilters",
    label: "Sub-day filters",
    fullLabel: "All sub-day filters cleared",
    note: "Rāhu-Kāla, Yamagaṇḍa, Gulika, Brahma-muhūrta",
    description: "Inauspicious sub-day windows must be avoided or shifted around.",
    typicalState: "Often requires a sub-window shift.",
  },
];

export const TRADE_OFFS: TradeOff[] = [
  {
    key: "strongPanchangaWeakLagna",
    label: "Strong pañcāṅga, weak lagna",
    note: "Five limbs look good but the rising sign conflicts with the event.",
    example: "Nov 8 Capricorn lagna mismatch in wedding-muhūrta.",
    lessonRef: "Lesson 23.4.1 §6 Example 3",
    honestResponse: "Articulate the lagna-śuddhi mismatch explicitly; offer a sub-window or explain the trade-off.",
  },
  {
    key: "multiActorSynergy",
    label: "Multi-actor synergy split",
    note: "Favourable for one actor, challenging for another.",
    example: "Bride sādhaka tārā + groom pratyari tārā.",
    lessonRef: "Lessons 23.3.4 & 23.4.1 §6 Example 3",
    honestResponse: "Show both tārā readings; let the family decide per empowerment principle.",
  },
  {
    key: "favourableVaraSubWindow",
    label: "Favourable vāra, shifted sub-window",
    note: "Good weekday but an inauspicious sub-period overlaps the first choice.",
    example: "4 PM → 2 PM shift to clear sub-day filters.",
    lessonRef: "Lessons 23.5.2 §6 Example 1 & 23.5.3 §6 Example 3",
    honestResponse: "Recommend the shifted sub-window; explain why the original time was not best-available.",
  },
];

export const CLIENT_SCENARIOS: ClientScenario[] = [
  {
    key: "awaitPerfect",
    label: "Await a perfect muhūrta?",
    note: "Client wants to delay until all factors are ideal.",
    clientQuote: "This recommendation is NOT perfect. Can we await a perfect muhūrta?",
    practitionerAnswer: [
      "Perfect muhūrta is rare — 6-factor convergence at one moment rarely occurs.",
      "The Nov 8 ~2 PM candidate is best-available: strong pañcāṅga + favourable Jupiter-Venus + cleared sub-day filters.",
      "Trade-offs are typical: mixed lagna-śuddhi + mixed groom-tārā.",
      "Awaiting perfect may harm the wedding — family pressure, logistical disruption.",
      "Free-will + actor-quality outweigh muhūrta-optimisation.",
      "Recommendation: proceed with best-available; do NOT postpone vital events for marginal improvement.",
    ],
    keyDisciplines: ["perfect-muhūrta-is-rare", "compromise-required", "effort-tradeoff", "free-will-outweighs"],
    verdict: "Best-available is the discipline; extended delay is not recommended.",
  },
  {
    key: "marriageFails",
    label: "What if marriage fails?",
    note: "Client worries that a non-perfect muhūrta dooms the outcome.",
    clientQuote: "You said this muhūrta is best-available, not perfect. What if my marriage fails?",
    practitionerAnswer: [
      "Muhūrta supports favourable initiation-conditions; it does NOT determine marriage-outcome.",
      "Marriage trajectory depends on couple-compatibility, decision-quality, commitment, family-support, and broader-context.",
      "A favourable muhūrta is one input among many.",
      "Marriages can encounter difficulties despite favourable muhūrta — other factors operate.",
      "Honest position: cannot guarantee success; can recommend best-available + articulate honest context.",
    ],
    keyDisciplines: ["free-will-outweighs", "honest-attribution", "satya-vādī", "dayā-yutaḥ"],
    verdict: "Muhūrta optimises conditions; actor-quality and context decide the outcome.",
  },
  {
    key: "cumulativeSynthesis",
    label: "Cumulative discipline synthesis",
    note: "Practitioner reviews the whole M23 honest-handling framework.",
    clientQuote: "How do all these honest-handling rules fit together?",
    practitionerAnswer: [
      "M23 operationalises 19+ distinct honest-handling instances across 18 prior lessons.",
      "Integrated four-pillar capstone (Chapters 1-3) needs trade-off + attribution + cancellation honesty.",
      "Event-type applications (Chapter 4) need event-specific extensions: saptapadī, nirlobha, family empowerment, safety priority.",
      "Cancellation-and-sub-day-filter discipline (Chapter 5) needs variance + heuristic-vs-method distinction honesty.",
      "This lesson adds perfect-is-rare, compromise-required, effort-tradeoff, and free-will disciplines.",
      "M24 ethics grounds it all in Bṛhat Saṁhitā Adhyāya 2 daivajña qualifications.",
    ],
    keyDisciplines: ["cumulative-framework", "M24-ethics-integration", "19+ instances"],
    verdict: "A systematic practitioner-discipline framework, not a single rule.",
  },
];

export const DAIVAJNA_QUALIFICATIONS: DaivajnaQualification[] = [
  {
    key: "satya",
    label: "Satya-vādī",
    devanagari: "सत्य-वादी",
    meaning: "Truthful speech",
    note: "Honest-attribution + honest-articulation + trade-off-honesty.",
    honestHandlingRole: "Cite sources, name trade-offs, and never promise a perfect or guaranteed outcome.",
  },
  {
    key: "daya",
    label: "Dayā-yutaḥ",
    devanagari: "दया-युतः",
    meaning: "Compassionate",
    note: "Compassion for client stakes.",
    honestHandlingRole: "Support the client's decision-capacity with language that reduces anxiety, not fear.",
  },
  {
    key: "nirlobha",
    label: "Nirlobha",
    devanagari: "निर्लोभ",
    meaning: "Without greed",
    note: "Standard fees regardless of stakes; no life-coach-mode overreach.",
    honestHandlingRole: "Do not inflate fees or scope because the event is high-stakes.",
  },
  {
    key: "jnanin",
    label: "Jñānin",
    devanagari: "ज्ञानिन्",
    meaning: "One of knowledge",
    note: "Integrated analytical capacity.",
    honestHandlingRole: "Apply the cumulative integrated method end-to-end rather than relying on single-factor shortcuts.",
  },
  {
    key: "sastravit",
    label: "Śāstra-vit",
    devanagari: "शास्त्र-वित्",
    meaning: "Knower of the śāstra",
    note: "Classical-source-grounded analysis.",
    honestHandlingRole: "Ground recommendations in Muhūrta-Cintāmaṇi + Bṛhat Saṁhitā + stream-specific sources.",
  },
];

export const HONEST_HANDLING_INSTANCES: HonestHandlingInstance[] = [
  { id: 1, lesson: "23.1.1 §4.5", category: "attribution", label: "Agentive-time-selection premise", content: "Muhūrta = one input among several to action-outcome; not sole determinant." },
  { id: 2, lesson: "23.1.2 §4.9", category: "tradeOff", label: "Trade-off-honesty", content: "No candidate perfect across all 5 limbs; articulate trade-offs explicitly." },
  { id: 3, lesson: "23.1.3 §4.9-4.10", category: "attribution", label: "Honest-attribution discipline", content: "Cite primary classical-source with chapter + translator; distinguish modern-exposition; acknowledge regional-tradition variance." },
  { id: 4, lesson: "23.1.4 §4.9", category: "variance", label: "Cross-stream-shared-foundational-principles", content: "Within-tradition variance is technique-variance within shared-principles, not disagreement." },
  { id: 5, lesson: "23.2.1 §4.9", category: "articulation", label: "Riktā-exception-context", content: "Discipline-compliant middle between over-application + under-application." },
  { id: 6, lesson: "23.2.2 §4.10", category: "articulation", label: "Vāra-avoidance + structural-constraint", content: "Honest when Thursday/Friday unavailable in candidate-window." },
  { id: 7, lesson: "23.2.3 §4.10-4.12", category: "variance", label: "Puṣya + Tīkṣṇa + Mūla-doṣa distinctions", content: "Multiple honest-attribution applications across regional traditions and exceptions." },
  { id: 8, lesson: "23.2.4 §4.5-4.6", category: "articulation", label: "High-stakes calibration + pāda-precision", content: "Honest pāda-precision calibration + factual correction of timing errors." },
  { id: 9, lesson: "23.3.1 §4.6", category: "cancellation", label: "Cancellation-doṣa Parigha variance", content: "Within-tradition variance on Parigha; grounded exception articulation." },
  { id: 10, lesson: "23.3.2 §4.6", category: "cancellation", label: "Bhadrā-mukha/puccha refinement", content: "Three-criterion limited-application framework." },
  { id: 11, lesson: "23.3.3 §4.6", category: "tradeOff", label: "Lagna-śuddhi mixed-evaluation", content: "Strong-pañcāṅga ≠ strong-four-pillar-aggregate observation." },
  { id: 12, lesson: "23.3.4 §4.6", category: "tradeOff", label: "Integrated four-pillar capstone completion", content: "Honest mixed-evaluation across four pillars + multi-actor synergy." },
  { id: 13, lesson: "23.4.1 §4.8", category: "ethics", label: "Wedding-muhūrta M24-ethics-integration", content: "Honest articulation with family-decision-empowerment + three options." },
  { id: 14, lesson: "23.4.2 §4.6", category: "ethics", label: "Nirlobha commerce-context extension", content: "No fee-inflation per business-stakes-magnitude; no commercial-success-guarantee." },
  { id: 15, lesson: "23.4.3 §4.4-4.6", category: "variance", label: "Seasonal-calendar doṣa articulation", content: "Three options with within-tradition variance honest-articulation + family empowerment." },
  { id: 16, lesson: "23.4.4 §4.5-4.7", category: "scope", label: "Brahma-muhūrta-override + safety priority", content: "Within-tradition variance + medical-emergency safety-context priority." },
  { id: 17, lesson: "23.5.1 §4.3-4.4", category: "cancellation", label: "Pañcaka regional-tradition variant", content: "5th forbidden action variance + activity-specific vs cross-activity distinction." },
  { id: 18, lesson: "23.5.2 §4.5-4.6", category: "variance", label: "Seasonal-duration + Brahma-muhūrta variance", content: "Ephemeris-precise computation + within-tradition variance." },
  { id: 19, lesson: "23.5.3 §4.7", category: "scope", label: "Practical-heuristic-vs-integrated-method", content: "Chowghadiya supplements; does NOT substitute for high-stakes events." },
];

export const COMMON_MISTAKES: CommonMistake[] = [
  {
    key: "promisePerfect",
    label: "Promising perfect muhūrta",
    note: "Practitioner asserts perfect-muhūrta achievable + guaranteed event-success.",
    warning: "Catastrophic over-promising failure.",
    remedy: "Use §4.3 perfect-is-rare + §4.6 free-will-outweighs; articulate best-available and trade-offs.",
  },
  {
    key: "postponeVital",
    label: "Postponing vital events",
    note: "Recommending extended-delay (months+) for marginal muhūrta-improvement.",
    warning: "Delay can harm the event: marriage-arrangement falling apart, business-window missed, occupancy postponed.",
    remedy: "Apply §4.5 effort-tradeoff + Lesson 24.3.4 samatvam; recommend within feasible-window.",
  },
  {
    key: "predeterminedPrescription",
    label: "Pre-determined prescription",
    note: "Delivering muhūrta-recommendation without trade-off-articulation + empowerment.",
    warning: "Treats recommendation as deterministic order rather than analysis supporting client decision.",
    remedy: "Apply cumulative honest-handling framework + Lesson 24.3.1 empowerment-principle.",
  },
];

export const CATEGORY_META: Record<InstanceCategory, { label: string; color: string }> = {
  attribution: { label: "Attribution", color: "#2F6F9F" },
  articulation: { label: "Articulation", color: "#8A6424" },
  tradeOff: { label: "Trade-off", color: "#2F7D52" },
  variance: { label: "Tradition Variance", color: "#7A4A8A" },
  ethics: { label: "Ethics", color: "#A23A1E" },
  cancellation: { label: "Cancellation", color: "#B9801E" },
  scope: { label: "Scope", color: "#4A6B8A" },
};

export function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

export function findScenario(key: ScenarioKey): ClientScenario {
  return CLIENT_SCENARIOS.find((item) => item.key === key) ?? CLIENT_SCENARIOS[0];
}

export function findConvergenceFactor(key: ConvergenceFactorKey): ConvergenceFactor {
  return CONVERGENCE_FACTORS.find((item) => item.key === key) ?? CONVERGENCE_FACTORS[0];
}

export function findTradeOff(key: TradeOffKey): TradeOff {
  return TRADE_OFFS.find((item) => item.key === key) ?? TRADE_OFFS[0];
}

export function findDaivajna(key: DaivajnaKey): DaivajnaQualification {
  return DAIVAJNA_QUALIFICATIONS.find((item) => item.key === key) ?? DAIVAJNA_QUALIFICATIONS[0];
}
