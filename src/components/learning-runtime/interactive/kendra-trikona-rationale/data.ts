import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type DoctrineMode = "union" | "benefic-kendra" | "malefic-kendra" | "yogakaraka";

export interface DoctrineCard {
  slug: DoctrineMode;
  label: string;
  title: string;
  iast: string;
  devanagari: string;
  principle: string;
  result: string;
  caution: string;
  color: string;
}

export const HOUSE_FAMILIES = [
  {
    slug: "kendra",
    label: "Kendras",
    houses: "1, 4, 7, 10",
    deity: "Vishnu",
    iast: "Viṣṇu-sthāna",
    meaning: "power, sustenance, action, visible pillars of life",
    color: grahas.shani.primary,
  },
  {
    slug: "trikona",
    label: "Trikonas",
    houses: "1, 5, 9",
    deity: "Lakshmi",
    iast: "Lakṣmī-sthāna",
    meaning: "dharma, fortune, grace, merit",
    color: grahas.guru.primary,
  },
] as const;

export const DOCTRINE_CARDS: DoctrineCard[] = [
  {
    slug: "union",
    label: "Power + grace",
    title: "Raja yoga rationale",
    iast: "Viṣṇu + Lakṣmī",
    devanagari: "विष्णु लक्ष्मी",
    principle: "A kendra lord brings executive power; a trikona lord brings grace and merit.",
    result: "When they relate, power is guided by grace. That is why the result is called royal.",
    caution: "A kendra alone is power without grace; a trikona alone is grace without execution.",
    color: grahas.surya.primary,
  },
  {
    slug: "benefic-kendra",
    label: "Benefic kendra lord",
    title: "Kendradhipati dosha",
    iast: "Kendrādhipati doṣa",
    devanagari: "केन्द्राधिपति",
    principle: "A natural benefic owning only a kendra loses some benefic potency.",
    result: "The angle gives power, but it neutralizes part of the planet's pure grace.",
    caution: "Do not read every kendra lord as automatically auspicious.",
    color: grahas.shukra.primary,
  },
  {
    slug: "malefic-kendra",
    label: "Malefic kendra lord",
    title: "Kendra tempers harm",
    iast: "Kendra-śamana",
    devanagari: "केन्द्रशमन",
    principle: "A natural malefic owning a kendra becomes capable of good results.",
    result: "The angle channels force into structure, action, responsibility, and durability.",
    caution: "This is improvement through function, not instant sainthood.",
    color: grahas.mangala.primary,
  },
  {
    slug: "yogakaraka",
    label: "Yogakaraka",
    title: "Blemish-free union",
    iast: "Yogakāraka",
    devanagari: "योगकारक",
    principle: "One planet owns both a kendra and a trikona.",
    result: "Trikona grace joins kendra power in one body, escaping the kendra blemish.",
    caution: "Still judge dignity and strength, but the structural promise is excellent.",
    color: grahas.budha.primary,
  },
];

export const EXAMPLES = [
  {
    title: "Power alone",
    body: "A 10th lord can create action, office, and visibility, but without trinal grace the structure may be hollow.",
  },
  {
    title: "Grace alone",
    body: "A 9th or 5th lord can show merit and blessing, but without an angle it may remain less visible.",
  },
  {
    title: "Royal union",
    body: "When the two families relate, grace has a vehicle and power has a dharmic guide.",
  },
];

export function getDoctrineCard(slug: DoctrineMode) {
  return DOCTRINE_CARDS.find((card) => card.slug === slug) ?? DOCTRINE_CARDS[0];
}
