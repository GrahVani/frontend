/**
 * Lal Kitab Status and Ethics Explorer — data engine for Lesson 18.1.4.
 *
 * Static content for scenario responses, rewrite lab, lineage cards,
 * and epistemic-status positions.
 */

export interface ScenarioItem {
  id: number;
  context: string;
  clientSays: string;
  options: { label: string; text: string; isCorrect: boolean }[];
  discipline: string;
}

export const SCENARIO_ITEMS: ScenarioItem[] = [
  {
    id: 1,
    context: "A sceptical client asks about Lal Kitab's legitimacy.",
    clientSays: '"My friend swears by Lal Kitab. Is it real astrology, or is it just superstition?"',
    options: [
      {
        label: "A",
        text: '"It is an ancient secret Vedic system, older than Parāśara himself."',
        isCorrect: false,
      },
      {
        label: "B",
        text: '"It is a well-known folk-empirical tradition from Punjab. Its rules come from observed patterns rather than Sanskrit śāstra. It is a different method, not inferior or superior — just different."',
        isCorrect: true,
      },
      {
        label: "C",
        text: '"It is basically superstition with no foundation. Stick to classical astrology."',
        isCorrect: false,
      },
    ],
    discipline:
      "Honest framing requires three moves: disclose the stream, place it without ranking, and refuse both over-claims. Option B does all three; A invents antiquity; C dismisses outright.",
  },
  {
    id: 2,
    context: "A client asks for the source of your remedy recommendation.",
    clientSays: '"Where does this feeding-black-dogs remedy come from?"',
    options: [
      {
        label: "A",
        text: '"It comes from the Lal Kitab tradition, where long practitioner observation associates it with easing Saturn-related difficulties."',
        isCorrect: true,
      },
      {
        label: "B",
        text: '"It is prescribed in the Bṛhat Parāśara Horā Śāstra, chapter 47."',
        isCorrect: false,
      },
      {
        label: "C",
        text: '"Oh, it is just general astrology advice."',
        isCorrect: false,
      },
    ],
    discipline:
      "Disclose-the-tradition: name Lal Kitab explicitly. Option B falsely attributes it to BPHS; C hides the stream entirely.",
  },
  {
    id: 3,
    context: "A client asks when their problem will resolve after doing the upāya.",
    clientSays: '"So if I do this remedy, my money problems will be gone in two months?"',
    options: [
      {
        label: "A",
        text: '"Yes, definitely. Do it faithfully for forty days and the problem will be solved."',
        isCorrect: false,
      },
      {
        label: "B",
        text: '"In the Lal Kitab tradition this remedy is associated with relief from this difficulty. It costs almost nothing to try. I suggest trying it, while being clear it is a traditional recommendation, not a guarantee."',
        isCorrect: true,
      },
      {
        label: "C",
        text: '"There is no evidence it will work at all, so I would not bother."',
        isCorrect: false,
      },
    ],
    discipline:
      "Honest remedy framing: name the tradition, state the empirical basis, set honest expectations. Option A over-promises; C scoffs.",
  },
  {
    id: 4,
    context: "A client assumes Lal Kitab is ancient Vedic scripture.",
    clientSays: '"So Lal Kitab is just an older, secret form of Vedic astrology, right?"',
    options: [
      {
        label: "A",
        text: '"Exactly — it was revealed to a sage in the Vedic era and later hidden in Urdu to protect it."',
        isCorrect: false,
      },
      {
        label: "B",
        text: '"Not quite. Lal Kitab is a 20th-century compilation by Pandit Roop Chand Joshi, published 1939–1952. It is a folk-empirical tradition, not derived from the Vedic śāstra. Its strength is practical observation, not ancient pedigree."',
        isCorrect: true,
      },
      {
        label: "C",
        text: '"Sort of. The exact dates do not really matter."',
        isCorrect: false,
      },
    ],
    discipline:
      "Don't-overclaim-ancient-pedigree: correct the misapprehension firmly but without scorn. Option A invents mythology; C is evasive.",
  },
  {
    id: 5,
    context: "A classically-trained colleague dismisses your Lal Kitab reading.",
    clientSays: '"Lal Kitab has no Sanskrit śāstra behind it, so it is not real astrology."',
    options: [
      {
        label: "A",
        text: '"You are right — I should stop using it and stick to Parāśarī."',
        isCorrect: false,
      },
      {
        label: "B",
        text: '"Lal Kitab is a different tradition with a folk-empirical basis, not a deficient one. Absence of Sanskrit pedigree is absence of that pedigree, not absence of legitimacy. Both streams can coexist."',
        isCorrect: true,
      },
      {
        label: "C",
        text: '"Actually, there are secret Sanskrit manuscripts that prove its antiquity."',
        isCorrect: false,
      },
    ],
    discipline:
      "Multi-streams-valid: refuse dismissal without inventing pedigree. Option A concedes too much; C fabricates evidence.",
  },
  {
    id: 6,
    context: "A client asks which lineage your Lal Kitab teaching comes from.",
    clientSays: '"Is there one official Lal Kitab school I should trust?"',
    options: [
      {
        label: "A",
        text: '"Yes, the Joshi-direct lineage is the only authentic one. All others are corrupted."',
        isCorrect: false,
      },
      {
        label: "B",
        text: '"Lal Kitab has no single central authority. It is carried by several lineages — Joshi-direct strands and modern-blended adaptations. Plurality is normal for a living folk tradition."',
        isCorrect: true,
      },
      {
        label: "C",
        text: '"There is no lineage at all — it is just a collection of folk tips."',
        isCorrect: false,
      },
    ],
    discipline:
      "Plural lineages: acknowledge multiple valid strands without centralising or dismissing. Option A falsely centralises; C falsely dismisses.",
  },
];

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
