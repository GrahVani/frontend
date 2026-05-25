/**
 * Karma-Prediction Dojo — L4 §7 flagship data.
 *
 * Two views:
 *   1. CYCLE-IN-MOTION view: overlay-toggle data for the karma cycle
 *      (which karma types Jyotiṣa sees clearly, partially, not at all).
 *   2. INDICATION TRANSLATOR drill: 5 deterministic statements that the
 *      user must translate into doctrinally-grounded indication framing.
 *      Tests L4's core skill — moving from pop-astrology determinism to
 *      classical Vedic indication-with-confidence-tier framing.
 */

export type KarmaSlug = "samcita" | "prarabdha" | "agami" | "kriyamana";

/** Highlight states for the cycle-in-motion overlay toggles. */
export type CycleOverlay = "none" | "jyotisha-sees" | "agency-window";

export interface OverlayConfig {
  slug: CycleOverlay;
  label: string;
  description: string;
  /** Per-karma highlight intensity (0 = invisible / dimmed, 1 = full). */
  highlight: Record<KarmaSlug, number>;
}

export const OVERLAYS: OverlayConfig[] = [
  {
    slug: "none",
    label: "All four equally",
    description:
      "Default view — all four karma types shown at equal visual weight. Useful for naming and orientation.",
    highlight: { samcita: 1, prarabdha: 1, agami: 1, kriyamana: 1 },
  },
  {
    slug: "jyotisha-sees",
    label: "What Jyotiṣa sees",
    description:
      "Prārabdha brightest — what the chart directly reads. Āgāmī partially lit — formation patterns visible but not specifics. Kriyamāṇa dim — the chart cannot foreclose current real-time choices. Saṁcita backdrop — too vast for full representation.",
    highlight: { samcita: 0.3, prarabdha: 1.0, agami: 0.55, kriyamana: 0.18 },
  },
  {
    slug: "agency-window",
    label: "Agent agency window",
    description:
      "Kriyamāṇa brightest — the domain where the agent has direct, immediate agency. Āgāmī partially lit — depends on the action-patterns the agent chooses. Prārabdha dim — committed, must play out. Saṁcita backdrop — already accumulated, not under current control.",
    highlight: { samcita: 0.2, prarabdha: 0.35, agami: 0.55, kriyamana: 1.0 },
  },
];

/** A deterministic statement → its doctrinally-correct indication-framing
 * alternative. The drill tests the practitioner's skill at this translation. */
export interface TranslationScenario {
  id: string;
  /** Short title for the scenarios-at-a-glance list. */
  title: string;
  /** The deterministic statement the user must translate. */
  deterministic: string;
  /** The four options shown — only one is the doctrinally-correct
   * indication translation. The others mix in subtle but real mistakes
   * (still too deterministic, ignoring confidence tier, overclaiming
   * specificity, etc.). */
  options: { id: string; label: string }[];
  correctId: string;
  /** The rationale for why the correct option is doctrinally right and
   * what mistakes the wrong options carry. */
  rationale: string;
  /** Which karma type the correct framing primarily reads. */
  primaryKarma: KarmaSlug;
}

export const TRANSLATION_SCENARIOS: TranslationScenario[] = [
  {
    id: "t1",
    title: "Friday promotion forecast",
    deterministic: "You will get the promotion on Friday.",
    options: [
      {
        id: "a",
        label: "There is a moderate-to-strong indication of career advancement in the 3-6 month window — the daśā schedule supports it.",
      },
      {
        id: "b",
        label: "The chart says you will probably get the promotion sometime soon.",
      },
      {
        id: "c",
        label: "It depends on your karma — there's no way to know.",
      },
      {
        id: "d",
        label: "You'll get the promotion either this Friday or next Friday — those are the auspicious windows.",
      },
    ],
    correctId: "a",
    rationale:
      "(a) is the doctrinally-correct framing — it reads prārabdha (career-advancement window committed to this life), names a confidence tier (moderate-to-strong), gives an honest time window (3-6 months) rather than a specific day, and cites the technical apparatus (daśā schedule). (b) drops the confidence calibration and the technical anchor — sounds vague rather than honest. (c) overswings to refusal — the chart CAN read prārabdha; it just can't foreclose kriyamāṇa. (d) still treats specific days as foreclosable — the deterministic framing isn't actually corrected.",
    primaryKarma: "prarabdha",
  },
  {
    id: "t2",
    title: "Special someone this week",
    deterministic: "You will meet someone special this week.",
    options: [
      {
        id: "a",
        label: "The chart shows a strong indication of relationship-forming in the next 12-24 months, with a 7th-house focus.",
      },
      {
        id: "b",
        label: "You might meet someone special this week or maybe next month.",
      },
      {
        id: "c",
        label: "Astrology can't really predict love.",
      },
      {
        id: "d",
        label: "You will definitely meet your soulmate within the year.",
      },
    ],
    correctId: "a",
    rationale:
      "(a) reframes from a week-window (incoherent — too narrow for prārabdha reading) to a 12-24 month indication window (appropriate for relationship-forming), names the relevant chart-apparatus (7th-house), and uses indication framing. (b) just softens the determinism without proper time-window or apparatus — still vague. (c) underclaims — the chart CAN read the 7th-house indications. (d) reintroduces determinism (\"definitely\") and a romanticised label (\"soulmate\") incompatible with classical framing.",
    primaryKarma: "prarabdha",
  },
  {
    id: "t3",
    title: "Lucky day Friday",
    deterministic: "Friday will be your lucky day.",
    options: [
      {
        id: "a",
        label: "Friday's transits and panchanga indicators are favourable for activities aligned with your daśā lord — there is operational support for important initiatives.",
      },
      {
        id: "b",
        label: "Friday will probably be a good day for you.",
      },
      {
        id: "c",
        label: "Every day is your lucky day if you have the right attitude.",
      },
      {
        id: "d",
        label: "Friday is your lucky day this week and next — guaranteed.",
      },
    ],
    correctId: "a",
    rationale:
      "(a) replaces the pop-astrology \"lucky day\" frame with the technical Vedic vocabulary — transits + panchanga + daśā lord support for specific kinds of action. This is what a practitioner can honestly say. (b) is just the deterministic statement softened by \"probably\" — no improvement. (c) is psychology, not Jyotiṣa — collapses the framework. (d) doubles down on the deterministic framing.",
    primaryKarma: "prarabdha",
  },
  {
    id: "t4",
    title: "Career change ahead",
    deterministic: "You are destined to change careers in your 40s.",
    options: [
      {
        id: "a",
        label: "The chart shows a strong indication of career inflection in the late-30s-to-mid-40s window — the agent's actual choice of new direction remains within their agency.",
      },
      {
        id: "b",
        label: "You will probably change careers at some point in your life.",
      },
      {
        id: "c",
        label: "The chart determines your career, so you have no choice.",
      },
      {
        id: "d",
        label: "You must change careers in your 40s — the chart is clear.",
      },
    ],
    correctId: "a",
    rationale:
      "(a) is the model translation. It reads prārabdha (career-inflection window committed), preserves an honest range (late-30s to mid-40s rather than a specific decade), AND explicitly preserves kriyamāṇa (the choice of new direction belongs to the agent's free will). The framework's claim — substrate without agency-foreclosure — is fully present. (b) is too vague (no apparatus, no window). (c) directly violates the framework by claiming the chart forecloses kriyamāṇa. (d) reintroduces \"must\" — deterministic foreclosure.",
    primaryKarma: "prarabdha",
  },
  {
    id: "t5",
    title: "Win the lottery",
    deterministic: "You will win the lottery this month.",
    options: [
      {
        id: "a",
        label: "The chart cannot honestly predict lottery outcomes — these are categorically beyond what classical Vedic Jyotiṣa claims to read.",
      },
      {
        id: "b",
        label: "There is a weak indication of financial windfall this month — worth a small ticket.",
      },
      {
        id: "c",
        label: "Your daśā lord supports speculation this month, so you should buy a ticket.",
      },
      {
        id: "d",
        label: "You will definitely win — it's in your prārabdha.",
      },
    ],
    correctId: "a",
    rationale:
      "(a) is the doctrinally-correct response — refusing the prediction is sometimes the practitioner's job. Lottery outcomes are not a category classical Jyotiṣa claims to read — they sit far outside the prārabdha framework (which reads life-event windows, not single-event win/lose binaries). (b) gives a wishy-washy probabilistic framing as if the chart could honestly read this — it can't. (c) is borderline malpractice — encouraging speculation based on chart-reading. (d) is full pop-astrology determinism dressed in Sanskrit vocabulary.",
    primaryKarma: "prarabdha",
  },
];

/** Honest framing summary — appears as a callout in the cycle-in-motion tab. */
export const FRAMEWORK_SUMMARY = {
  headline: "Indication, not determination — by doctrine, not by hedge.",
  body: "The karma framework's claim is that AGENCY operates WITHIN SUBSTRATE. The substrate (prārabdha) is committed and the chart reads it. The agency (kriyamāṇa) is real and the chart cannot foreclose it. Practitioner discipline lives in calibrating between these — naming what the chart can honestly read, leaving untouched what the chart cannot. This is not Vedic Jyotiṣa being unable to predict deterministically — it is Vedic Jyotiṣa refusing to overclaim.",
};
