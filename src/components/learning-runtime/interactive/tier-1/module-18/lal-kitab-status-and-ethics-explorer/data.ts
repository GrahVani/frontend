/**
 * Lal Kitab Status and Ethics Explorer — data engine for Lesson 18.1.4.
 *
 * Static content for rewrite lab, lineage cards, and epistemic-status positions.
 */

export interface RewriteItem {
  id: number;
  dishonest: string;
  honest: string;
  flaw: string;
}

export const REWRITE_ITEMS: RewriteItem[] = [
  {
    id: 1,
    dishonest: "Do this Lal Kitab remedy and your money problems will be gone in two months.",
    honest:
      "In the Lal Kitab tradition, this remedy is associated with easing financial difficulties on the basis of long practitioner observation. It costs almost nothing to try. I suggest trying it, while being clear it is a traditional recommendation, not a guarantee.",
    flaw: "Over-promises a guaranteed outcome and a specific timeline.",
  },
  {
    id: 2,
    dishonest: "Lal Kitab is an ancient Vedic system handed down from Parāśara's time.",
    honest:
      "Lal Kitab is a 20th-century folk-empirical tradition compiled by Pandit Roop Chand Joshi in the Farmans of 1939–1952. It is not derived from classical Sanskrit śāstra.",
    flaw: "Invents an ancient pedigree that does not exist.",
  },
  {
    id: 3,
    dishonest: "This is just astrology — no need to name which tradition.",
    honest:
      "This recommendation comes from the Lal Kitab tradition, a folk-empirical system distinct from classical Parāśarī astrology.",
    flaw: "Hides the stream, denying the client informed consent about the method.",
  },
  {
    id: 4,
    dishonest: "Lal Kitab is superstition because it has no Sanskrit ślokas.",
    honest:
      "Lal Kitab has a folk-empirical rather than scriptural-classical basis. That makes it a different tradition, not an invalid one.",
    flaw: "Dismisses the stream outright using the wrong epistemic standard.",
  },
];

export interface LineageCard {
  slug: string;
  title: string;
  description: string;
  characteristics: string[];
}

export const LINEAGE_CARDS: LineageCard[] = [
  {
    slug: "joshi-direct",
    title: "Joshi-direct lineages",
    description:
      "Claim descent from or close fidelity to Pandit Roop Chand Joshi's original Farmans. Emphasise staying true to the Urdu/Punjabi source text.",
    characteristics: [
      "Close to original Farman wording",
      "Urdu/Punjabi source emphasis",
      "Respect for Joshi's sequence and structure",
      "Often taught through oral transmission",
    ],
  },
  {
    slug: "modern-blended",
    title: "Modern-blended lineages",
    description:
      "Adapt, systematise, or combine Lal Kitab with other techniques. Present the tradition in contemporary form for modern audiences.",
    characteristics: [
      "English and Hindi teaching materials",
      "Systematised tables and reference guides",
      "May combine with other astrological methods",
      "Broader accessibility through modern media",
    ],
  },
];

export const EPISTEMIC_POSITIONS = [
  {
    label: "Scriptural-classical",
    text: "Authority comes from Sanskrit śāstra, ancient ṛṣi transmission, and textual derivation.",
    examples: "Parāśarī, Jaimini — traced to BPHS, Jaiminī Sūtras",
    color: "#356CAB",
  },
  {
    label: "Folk-empirical",
    text: "Authority comes from observed patterns, practical result, and regional practitioner culture.",
    examples: "Lal Kitab — codified 1939–1952 from Punjabi-folk observation",
    color: "#A87830",
  },
  {
    label: "Modern-invented",
    text: "Authority claimed by a single contemporary author without historical or observational basis.",
    examples: "Pop-astrology systems with no lineage or corpus",
    color: "#A23A1E",
  },
];

export const GEOGRAPHY_FACTS = [
  { region: "Punjab", note: "Heartland — origin and densest practitioner community" },
  { region: "Haryana", note: "Strong presence, shared cultural roots" },
  { region: "Delhi", note: "Major urban centre for readings and teaching" },
  { region: "UK / Canada / diaspora", note: "Travels with Punjabi migration worldwide" },
];
