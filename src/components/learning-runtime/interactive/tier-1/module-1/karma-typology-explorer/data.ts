/**
 * Karma Typology Explorer — static data for L4 §4.
 *
 * Four karma types from classical Vedānta (especially Advaita commentarial
 * literature): saṁcita / prārabdha / āgāmī / kriyamāṇa. Each maps onto a
 * specific predictive scope for Jyotiṣa.
 *
 * Sources cited in lesson §4.2 + §4.4: Bhagavad Gītā 4.17 + 8.6 + 18.59-60,
 * Vivekacūḍāmaṇi (attributed to Śaṅkara), BPHS scattered references.
 */

export type KarmaSlug = "samcita" | "prarabdha" | "agami" | "kriyamana";

/** Where Jyotiṣa's predictive gaze reaches for this karma type. */
export type PredictiveScope =
  | "indirect" // saṁcita
  | "primary" // prārabdha
  | "partial" // āgāmī
  | "invisible"; // kriyamāṇa

/** How much direct agency the agent has over this karma type. */
export type AgentControl =
  | "none" // saṁcita — already accumulated
  | "fixed" // prārabdha — committed, must play out
  | "partial" // āgāmī — depends on action-pattern choices
  | "direct"; // kriyamāṇa — current real-time agency

export interface KarmaNode {
  slug: KarmaSlug;
  iast: string;
  devanagari: string;
  /** Literal meaning of the Sanskrit term. */
  etymology: string;
  /** One-line gloss for cards and chips. */
  shortGloss: string;
  /** 2-3 line description of what this karma type is. */
  definition: string;
  /** 3-4 key properties (bullet-list-ready). */
  properties: string[];
  /** What the natal chart actually reads for this karma type. */
  jyotishaSees: string;
  /** Predictive scope (with display label). */
  scope: PredictiveScope;
  scopeLabel: string;
  /** Agent-control level (with display label). */
  agentControl: AgentControl;
  agentControlLabel: string;
  /** Position on the cycle diagram (viewBox 0 0 500 500, centre 250,250). */
  position: { x: number; y: number };
  /** Anchor angle on the cycle (degrees, 0 = top, clockwise). */
  cycleAngle: number;
}

export const KARMA_NODES: KarmaNode[] = [
  {
    slug: "samcita",
    iast: "Saṁcita",
    devanagari: "सञ्चित",
    etymology: "\"accumulated\" / \"collected\"",
    shortGloss: "the vast accumulated stock from all prior actions",
    definition:
      "The total stock of all karmic consequences the agent has accumulated from all prior actions across all prior lives. Vast in scope, largely latent — most of it sits stored, not yet manifesting.",
    properties: [
      "Vast — far larger than what can bear fruit in a single lifetime",
      "Mostly latent — stored, not currently active",
      "Source from which prārabdha emerges",
      "Receives back the unmanifested āgāmī across lifetimes",
    ],
    jyotishaSees:
      "Background substrate — too vast for full representation. The chart reflects only the portions of saṁcita that are currently becoming prārabdha; the rest of saṁcita is not directly visible to any chart.",
    scope: "indirect",
    scopeLabel: "Indirect",
    agentControl: "none",
    agentControlLabel: "None — already accumulated",
    position: { x: 250, y: 80 },
    cycleAngle: 0,
  },
  {
    slug: "prarabdha",
    iast: "Prārabdha",
    devanagari: "प्रारब्ध",
    etymology: "\"begun\" / \"set in motion\"",
    shortGloss: "the operative portion of saṁcita allocated to this life",
    definition:
      "The portion of saṁcita that has been allocated to the current life and is currently bearing fruit. Fixed — the agent cannot avoid it; it will play out across this lifetime.",
    properties: [
      "Fixed in scope — committed to manifesting in this life",
      "Currently operative — actively shaping circumstances",
      "Primary subject matter of natal-chart reading",
      "What daśās and transits most directly read",
    ],
    jyotishaSees:
      "The committed-and-currently-bearing-fruit portion. When the chart shows \"marriage probable in 24-36 months\" or \"career change in late-30s\", it is reading prārabdha-allocated event windows. This is what natal chart-reading is primarily ABOUT.",
    scope: "primary",
    scopeLabel: "Primary — directly read",
    agentControl: "fixed",
    agentControlLabel: "Fixed — must play out",
    position: { x: 80, y: 250 },
    cycleAngle: 270,
  },
  {
    slug: "kriyamana",
    iast: "Kriyamāṇa",
    devanagari: "क्रियमाण",
    etymology: "\"being done\" / \"being made\"",
    shortGloss: "karma being generated right now by current choices",
    definition:
      "The karma being generated in this very moment — by every choice and every action the agent takes right now. Under direct agent control; the agency window of the framework.",
    properties: [
      "Real-time generation — happening right now",
      "Under direct agent agency — choices are free here",
      "Generates āgāmī as its longer-arc consequence",
      "What the chart CANNOT predict",
    ],
    jyotishaSees:
      "Largely invisible. The chart was drawn from a birth-moment that pre-dates the agent's current real-time choices by years or decades. Any practitioner who claims to foreclose kriyamāṇa misunderstands the framework.",
    scope: "invisible",
    scopeLabel: "Invisible — agency window",
    agentControl: "direct",
    agentControlLabel: "Direct — free choice",
    position: { x: 420, y: 250 },
    cycleAngle: 90,
  },
  {
    slug: "agami",
    iast: "Āgāmī",
    devanagari: "आगामी",
    etymology: "\"coming\" / \"arriving\"",
    shortGloss: "karmic consequences in formation, awaiting future manifestation",
    definition:
      "The karmic consequences being generated by current actions that will bear fruit at some future point — either later in this life or in future lives. In the generation phase, not yet bearing fruit.",
    properties: [
      "Generated by current kriyamāṇa action",
      "Not yet manifesting — in the formation phase",
      "Partially visible to the chart as formation-patterns",
      "Unmanifested āgāmī adds back to saṁcita at lifetime's end",
    ],
    jyotishaSees:
      "Tendencies and directions of formation, not specific outcomes. A chart with strong-Mars indications reflects the disposition under which the agent's current actions tend to generate Mars-flavoured āgāmī — but the SPECIFICS depend on the agent's actual choices going forward.",
    scope: "partial",
    scopeLabel: "Partial — formation patterns only",
    agentControl: "partial",
    agentControlLabel: "Partial — depends on action-patterns",
    position: { x: 250, y: 420 },
    cycleAngle: 180,
  },
];

/** Flow arrows between karma types (the cycle structure). */
export interface CycleFlow {
  from: KarmaSlug;
  to: KarmaSlug;
  label: string;
  description: string;
}

export const CYCLE_FLOWS: CycleFlow[] = [
  {
    from: "samcita",
    to: "prarabdha",
    label: "allocation",
    description:
      "Saṁcita → Prārabdha. Each life's prārabdha is drawn from the agent's saṁcita stock. Which portion gets allocated is a doctrinal question; the flow direction is consensus.",
  },
  {
    from: "prarabdha",
    to: "kriyamana",
    label: "operation",
    description:
      "Prārabdha shapes the substrate within which kriyamāṇa choices happen. Prārabdha doesn't determine kriyamāṇa — it sets the situational field the agent's free choices respond to.",
  },
  {
    from: "kriyamana",
    to: "agami",
    label: "generation",
    description:
      "Kriyamāṇa → Āgāmī. Every intentional action generates karmic consequences. The immediate consequences manifest immediately; the longer-arc consequences become āgāmī, awaiting future manifestation.",
  },
  {
    from: "agami",
    to: "samcita",
    label: "feedback",
    description:
      "Āgāmī → Saṁcita. Āgāmī that does not manifest in the current life adds back to the saṁcita stock — increasing the total accumulated karma for future lives (in the framework that includes rebirth).",
  },
];

/** The Bhagavad Gītā 4.17 closing reference — for the §4.6 śloka context.
 * NOT rendered inside the interactive (constitution §32.4 rule 1).
 */
export const KARMA_UNFATHOMABILITY_NOTE =
  "Bhagavad Gītā 4.17 declares: gahanā karmaṇo gatiḥ — \"unfathomable is the course of karma.\" The framework explicitly acknowledges its own limit. See §5 of the lesson for the full śloka in three registers.";
