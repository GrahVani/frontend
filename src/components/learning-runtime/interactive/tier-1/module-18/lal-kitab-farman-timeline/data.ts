/**
 * Lal Kitab Farmān Timeline — data engine for Lesson 18.1.2.
 *
 * Static content for the five Farmāns, the progression logic,
 * topic-matcher items, and language-layer information.
 */

export interface Farman {
  number: number;
  year: number;
  subject: string;
  subjectShort: string;
  description: string;
  whyThisPosition: string;
  urduTitle: string;
}

export const FARMANS: Farman[] = [
  {
    number: 1,
    year: 1939,
    subject: "Foundational doctrine",
    subjectShort: "Foundation",
    description:
      "Establishes the basic principles on which everything else rests: the framing concepts, the way the chart is read, and the assumptions the system makes. It is the doctrinal ground floor.",
    whyThisPosition:
      "Everything else interprets through it. Without the foundation, the house-effects, planetary attributes, and remedies have no organising frame.",
    urduTitle: "Farman-e-Awal",
  },
  {
    number: 2,
    year: 1940,
    subject: "House-effects",
    subjectShort: "Houses",
    description:
      "Turns to the houses — what each house signifies and how planetary conditions in the houses produce their effects. This is the first analytical half of the house-and-planet pair.",
    whyThisPosition:
      "The foundation is already set; now the system applies it to the twelve houses. Houses are read before planets because the house is the domain into which the planet is placed.",
    urduTitle: "Farman-e-Doom",
  },
  {
    number: 3,
    year: 1941,
    subject: "Planetary attributes",
    subjectShort: "Planets",
    description:
      "Develops the planets — their natures, significations, and attributes. This is the second analytical half of the house-and-planet pair, completing the diagnostic vocabulary.",
    whyThisPosition:
      "With houses established, the system now builds the planetary layer. Together, house + planet give the complete diagnostic picture.",
    urduTitle: "Farman-e-Seem",
  },
  {
    number: 4,
    year: 1942,
    subject: "Upāyas (remedies)",
    subjectShort: "Remedies",
    description:
      "The corrective remedies — the upāyas — that Lal Kitab is most famous for. Feeding animals, floating objects, burying metals, simple acts of charity.",
    whyThisPosition:
      "Remedies presuppose a diagnosis, and the diagnosis depends on the doctrine, house-effects, and planetary attributes of the first three volumes. You cannot prescribe a cure before you can read the condition.",
    urduTitle: "Farman-e-Chaharum",
  },
  {
    number: 5,
    year: 1952,
    subject: "Synthesis and verification",
    subjectShort: "Synthesis",
    description:
      "Draws the corpus together and verifies it, consolidating and testing the doctrine built across the earlier four books rather than introducing a new layer.",
    whyThisPosition:
      "A decade after the core doctrine was built, circulated, and tested, this consolidating volume ties everything together. Synthesis must come last because there must be something to synthesise.",
    urduTitle: "Farman-e-Panjum",
  },
];

export const PROGRESSION_STEPS = [
  { label: "Foundation", farman: 1, color: "#356CAB" },
  { label: "House-effects", farman: 2, color: "#4F6FA8" },
  { label: "Attributes", farman: 3, color: "#B88421" },
  { label: "Upāyas", farman: 4, color: "#2F7D55" },
  { label: "Synthesis", farman: 5, color: "#A87830" },
];

export interface TopicMatcherItem {
  id: number;
  text: string;
  farmanNumber: number;
  explanation: string;
}

export const TOPIC_MATCHER_ITEMS: TopicMatcherItem[] = [
  {
    id: 1,
    text: "The fixed-Aries Teva chart and its basic reading rules",
    farmanNumber: 1,
    explanation:
      "The Teva frame and basic doctrine are foundational. They belong to Farman 1 (1939).",
  },
  {
    id: 2,
    text: "What Saturn in the 8th house produces for the native",
    farmanNumber: 2,
    explanation:
      "This is a house-effect reading — a planet placed in a house and the result predicted. Farman 2 (1940).",
  },
  {
    id: 3,
    text: "Jupiter's nature, temperament, and Lal-Kitab-specific significations",
    farmanNumber: 3,
    explanation:
      "Planetary attributes and natures are the subject of Farman 3 (1941).",
  },
  {
    id: 4,
    text: "Feeding black dogs to ease a hard Saturn placement",
    farmanNumber: 4,
    explanation:
      "A concrete upāya / remedy. These are the signature content of Farman 4 (1942).",
  },
  {
    id: 5,
    text: "Cross-checking a house-reading against a planet-reading for consistency",
    farmanNumber: 5,
    explanation:
      "Verification and synthesis of earlier material — the consolidating work of Farman 5 (1952).",
  },
  {
    id: 6,
    text: "The meaning of the 7th house and what planets placed there indicate",
    farmanNumber: 2,
    explanation:
      "House significations and effects are Farman 2 (1940), even when a planet is mentioned as occupant.",
  },
];

export const LANGUAGE_LAYERS = [
  {
    label: "Urdu original",
    detail:
      "The authoritative source. Written in Urdu with Punjabi cultural roots, published in pre-Partition Punjab.",
    audience: "Urdu readers; scholars seeking the authoritative text.",
    color: "#A23A1E",
  },
  {
    label: "Hindi translation",
    detail:
      "Devanāgarī editions that opened the corpus to a large Hindi-reading audience across North India.",
    audience: "Hindi readers; the largest contemporary readership in India.",
    color: "#B88421",
  },
  {
    label: "English translation",
    detail:
      "Modern English editions that make the corpus accessible to English-speaking students worldwide.",
    audience: "English-speaking students; the practical access route for most international learners.",
    color: "#356CAB",
  },
];
