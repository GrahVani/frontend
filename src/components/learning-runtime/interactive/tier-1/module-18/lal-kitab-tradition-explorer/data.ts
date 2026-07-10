/**
 * Lal Kitab Tradition Explorer — data engine for Lesson 18.1.1.
 *
 * Static content organized into three pedagogical views:
 * 1. Timeline — Joshi's life + the five Farmans
 * 2. Four Features — the method signatures that distinguish Lal Kitab
 * 3. Stream Classifier — scenarios where the learner decides Lal Kitab / Classical / Misattributed
 */

export interface TimelineEvent {
  year: number;
  label: string;
  shortLabel?: string;
  detail: string;
  kind: "birth" | "farmān" | "death" | "context";
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: 1898,
    label: "Pandit Roop Chand Joshi born",
    shortLabel: "Joshi born",
    detail:
      "Born in Punjab. Would later compile and transmit the Lal Kitab corpus in Urdu and Punjabi — not Sanskrit.",
    kind: "birth",
  },
  {
    year: 1939,
    label: "First Farmān published",
    shortLabel: "Farmān 1",
    detail:
      "The first of five volumes (farmāns) appears. The word farmān means 'edict' or 'decree' in Urdu. The series would continue for thirteen years.",
    kind: "farmān",
  },
  {
    year: 1945,
    label: "Mid-series (approx.)",
    shortLabel: "Farmān 2–4",
    detail:
      "The middle farmāns appear across the 1940s, building and revising doctrine progressively rather than handing it down whole.",
    kind: "farmān",
  },
  {
    year: 1952,
    label: "Fifth Farmān published",
    shortLabel: "Farmān 5",
    detail:
      "The final farmān closes the series. The complete corpus spans 1939–1952 — entirely within Joshi's lifetime.",
    kind: "farmān",
  },
  {
    year: 1982,
    label: "Joshi passes away",
    shortLabel: "Joshi dies",
    detail:
      "Dies at age 84. Nothing in the core corpus was first composed after his death; the tradition is transmitted through later re-typesets and commentaries.",
    kind: "death",
  },
];

export interface DistinctiveFeature {
  slug: string;
  title: string;
  short: string;
  detail: string;
  classicalContrast: string;
  example: string;
}

export const DISTINCTIVE_FEATURES: DistinctiveFeature[] = [
  {
    slug: "teva",
    title: "Fixed-Aries Teva chart",
    short: "House 1 is always Aries, regardless of the native's Lagna.",
    detail:
      "Lal Kitab reads from a standardised house-chart — the Teva — in which the first house is fixed to Aries. Where Parāśarī keys houses to the rising sign, Lal Kitab keys them to a constant Aries-first frame. A planet's 'house' in a Teva is read differently from its house in a Parāśarī chart.",
    classicalContrast:
      "Parāśarī: Lagna = 1st house, so houses rotate with the ascendant. Lal Kitab: Meṣa = 1st house always, so house number equals sign number.",
    example:
      "A native with Taurus rising has Venus in Cancer. Parāśarī counts Cancer as the 3rd house from Taurus. Lal Kitab counts Cancer as the 4th house (fixed frame). Same planet, different house domain.",
  },
  {
    slug: "significations",
    title: "Redefined planetary significations",
    short: "Grahas keep their names but acquire Lal-Kitab-specific meanings.",
    detail:
      "Each planet keeps its classical name but carries significations particular to Lal Kitab — its own catalogue of what each planet 'does' in each house, sometimes diverging sharply from classical karaka-theory.",
    classicalContrast:
      "Parāśarī uses universal karakas (Sun = ātmā, Jupiter = guru, etc.) plus sign/house/nakṣatra overlays. Lal Kitab has its own house-by-planet result tables.",
    example:
      "Saturn in the 1st house may be read as restriction and delay in Parāśarī; in Lal Kitab it may trigger a specific ṛṇa diagnosis with a corresponding cheap remedy.",
  },
  {
    slug: "rina",
    title: "Ṛṇa (karmic-debt) framing",
    short: "Hard placements are debts to be diagnosed and settled, not just malefic results.",
    detail:
      "A difficult placement is read not merely as a malefic result but as a ṛṇa — a karmic debt (for example a debt owed to ancestors, to a deity, or arising from a moral lapse) that the native is repaying. The interpretive task becomes diagnosing which debt, and the remedy becomes settling it.",
    classicalContrast:
      "Parāśarī diagnoses affliction through dignity, aspect, and yoga; remedies include mantras, rituals, and gemstones. Lal Kitab reframes the problem as debt-repayment.",
    example:
      "A hard Saturn placement is diagnosed as pitṛ-ṛṇa (debt to ancestors). The remedy is not a blue sapphire but a specific physical act — feeding black dogs, floating oil in a river, etc.",
  },
  {
    slug: "upaya",
    title: "Cheap, practical upāya / ṭoṭke",
    short: "Remedies are inexpensive physical acts, not costly gemstones or elaborate rituals.",
    detail:
      "The upāya (colloquially ṭoṭke) are deliberately inexpensive and physical — feeding animals, floating or burying small objects, offering specific foods, simple acts of charity. This contrasts with the gemstone-and-ritual remedy culture of much classical practice.",
    classicalContrast:
      "Classical prescriptions may demand certified gemstones, fire rituals (homa), or sustained mantra practice. Lal Kitab remedies cost little and require no priest.",
    example:
      "Feeding crows, burying a piece of silver, offering mustard oil on Saturday — each targets a specific planet/debt and costs almost nothing.",
  },
];

export type ClassifierVerdict = "lal-kitab" | "classical" | "misattributed";

export interface ClassifierScenario {
  id: number;
  text: string;
  verdict: ClassifierVerdict;
  explanation: string;
}

export const CLASSIFIER_SCENARIOS: ClassifierScenario[] = [
  {
    id: 1,
    text:
      'A reading fixes the 1st house to Aries regardless of birth lagna, calls a hard Saturn placement a "pitṛ-ṛṇa," and prescribes feeding black dogs.',
    verdict: "lal-kitab",
    explanation:
      "All three Lal Kitab signatures are present: fixed-Aries Teva frame, ṛṇa (debt) diagnosis, and a cheap physical upāya. This is unmistakably Lal Kitab.",
  },
  {
    id: 2,
    text:
      "A reading uses the native's Taurus lagna as the 1st house, assesses Saturn's dignity by sign and aspect, and recommends a certified blue sapphire.",
    verdict: "classical",
    explanation:
      "Lagna-keyed houses, dignity/aspect analysis, and gemstone remedy are all Parāśarī-classical signatures. Lal Kitab would use a fixed-Aries frame and a cheap physical upāya instead.",
  },
  {
    id: 3,
    text:
      '"Lal Kitab is an ancient Vedic text, older than Parāśara, later translated into Punjabi."',
    verdict: "misattributed",
    explanation:
      "Both clauses are false. Lal Kitab is a 20th-century corpus (1939-1952), not ancient. It is an original Urdu/Punjabi compilation, not a translation of an older Sanskrit text. This is a misattribution.",
  },
  {
    id: 4,
    text:
      "A chart reading places planets into houses counted from Aries, but then applies Parāśarī karaka theory and prescribes an expensive pooja.",
    verdict: "misattributed",
    explanation:
      "This is a hybrid/conflation. The fixed-Aries frame is Lal Kitab, but the karaka theory and expensive ritual are classical. Mixing frameworks without announcing the shift creates an invalid reading.",
  },
  {
    id: 5,
    text:
      "A reading describes Jupiter in the 5th house as indicating teaching and children, using standard karaka logic, with no mention of ṛṇa.",
    verdict: "classical",
    explanation:
      "Standard karaka-based interpretation (Jupiter = wisdom, 5th = children/education) with no debt framing and no Teva fixed frame — purely Parāśarī.",
  },
  {
    id: 6,
    text:
      "A reading diagnoses Mercury in the 8th as a debt to a deity, prescribes floating copper coins in a river on Wednesday, and uses a fixed-Aries chart.",
    verdict: "lal-kitab",
    explanation:
      "Fixed-Aries Teva, ṛṇa diagnosis (debt to deity), and cheap physical upāya (floating coins) — all three Lal Kitab signatures present.",
  },
];

/** Epistemic-status slider positions for the honesty discipline. */
export const EPISTEMIC_POSITIONS = [
  {
    label: "Ancient śāstra",
    text: "Lal Kitab is an ancient Vedic text handed down from a ṛṣi.",
    verdict: "error" as const,
    feedback:
      "Inflation error. Lal Kitab has no Sanskrit-śloka pedigree. It is a 20th-century Urdu/Punjabi folk-empirical corpus.",
  },
  {
    label: "Folk-empirical",
    text: "Lal Kitab is a 20th-century folk-empirical tradition, valid in its own frame, neither ancient nor worthless.",
    verdict: "correct" as const,
    feedback:
      "Correct. Hold the status honestly: experience-tested rules from a regional, non-scholastic community — not derived from classical Sanskrit śāstra, but not baseless either.",
  },
  {
    label: "Worthless superstition",
    text: "Lal Kitab is unscientific folk superstition with no śāstra behind it.",
    verdict: "error" as const,
    feedback:
      "Scorn error. Dismissing the stream outright is the mirror-image of antiquing it. Folk-empirical status is a description, not a verdict.",
  },
];
