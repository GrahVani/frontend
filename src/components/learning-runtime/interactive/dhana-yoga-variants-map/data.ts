import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type DhanaVariantCategory = "archetype" | "fortune" | "exchange" | "cluster" | "planetary" | "crossref";

export interface DhanaVariant {
  slug: string;
  title: string;
  iast: string;
  devanagari: string;
  category: DhanaVariantCategory;
  status: string;
  houses: string;
  condition: string;
  flavour: string;
  caution: string;
  color: string;
}

export const DHANA_VARIANT_CATEGORIES: Record<DhanaVariantCategory, { label: string; description: string }> = {
  archetype: {
    label: "Archetype",
    description: "The cleanest wealth-plus-gains pairing: held resources and income joined.",
  },
  fortune: {
    label: "Fortune wealth",
    description: "Trikona or bhagya links feed wealth through merit, grace, and dharma.",
  },
  exchange: {
    label: "Exchange",
    description: "Two houses trade signs and make a tighter wealth circuit.",
  },
  cluster: {
    label: "Cluster",
    description: "Several wealth lords converge into one major dhana-yoga zone.",
  },
  planetary: {
    label: "Planetary pair",
    description: "A named wealth yoga made by planets themselves, not house-lord arithmetic.",
  },
  crossref: {
    label: "Cross-reference",
    description: "Important, but taught in its own later chapter rather than duplicated here.",
  },
};

export const DHANA_YOGA_VARIANTS: DhanaVariant[] = [
  {
    slug: "two-eleven",
    title: "2nd-11th Lords",
    iast: "Dhana-Lābha Yoga",
    devanagari: "धन-लाभ",
    category: "archetype",
    status: "Most celebrated",
    houses: "2 + 11",
    condition: "2nd lord and 11th lord conjoin, aspect, or otherwise strongly relate.",
    flavour: "Holding wealth and gaining wealth cooperate, so assets and income reinforce each other.",
    caution: "Still judge dignity, strength, affliction, and operating dasha before promising results.",
    color: grahas.shukra.primary,
  },
  {
    slug: "five-nine",
    title: "5th-9th Lords",
    iast: "Lakṣmī-Bhāgya Link",
    devanagari: "लक्ष्मी-भाग्य",
    category: "fortune",
    status: "Dhana + raja-grade",
    houses: "5 + 9",
    condition: "5th lord and 9th lord form a strong relationship.",
    flavour: "Fortune-fed wealth: merit, grace, learning, and bhagya become wealth carriers.",
    caution: "It overlaps with raja-yoga logic because both houses are trikonas.",
    color: grahas.guru.primary,
  },
  {
    slug: "two-five-exchange",
    title: "2nd-5th Exchange",
    iast: "Dhana-Pūrva-puṇya Parivartana",
    devanagari: "धन-पुण्य",
    category: "exchange",
    status: "Deep wealth via merit",
    houses: "2 ↔ 5",
    condition: "2nd lord occupies the 5th lord's sign while the 5th lord occupies the 2nd lord's sign.",
    flavour: "Stored wealth links with intelligence, merit, speculation, and creative capacity.",
    caution: "Exchange is powerful, but beneficence depends on the planets and their condition.",
    color: grahas.budha.primary,
  },
  {
    slug: "nine-eleven",
    title: "9th-11th Lords",
    iast: "Bhāgya-Lābha Yoga",
    devanagari: "भाग्य-लाभ",
    category: "fortune",
    status: "Gain via dharma",
    houses: "9 + 11",
    condition: "9th lord and 11th lord relate by conjunction, aspect, exchange, or strong mutual support.",
    flavour: "Income and gains are fed through dharma, teachers, blessings, networks, or ethical alignment.",
    caution: "Do not reduce it to income only; the 9th house sets the quality of the gain.",
    color: grahas.surya.primary,
  },
  {
    slug: "multi-lord-cluster",
    title: "Multi-lord Cluster",
    iast: "Dhana-saṅgha",
    devanagari: "धनसङ्घ",
    category: "cluster",
    status: "Major convergence",
    houses: "2/5/9/11",
    condition: "Several lords of the 2nd, 5th, 9th, and 11th converge in one place or tight relationship.",
    flavour: "Multiple wealth channels concentrate, making the dhana promise more visible.",
    caution: "Separate each contributing lord before calling the whole cluster major.",
    color: grahas.candra.primary,
  },
  {
    slug: "chandra-mangala",
    title: "Chandra-Mangala",
    iast: "Candra-Maṅgala Yoga",
    devanagari: "चन्द्रमंगल",
    category: "planetary",
    status: "Dhana, not raja",
    houses: "Moon + Mars",
    condition: "Moon and Mars are conjunct.",
    flavour: "Enterprising wealth: drive, trade, initiative, and activity can produce money.",
    caution: "Class it as dhana yoga; some texts warn about aggressive or less-gentle wealth routes.",
    color: grahas.mangala.primary,
  },
  {
    slug: "lakshmi-yoga-crossref",
    title: "Lakshmi Yoga Proper",
    iast: "Lakṣmī Yoga",
    devanagari: "लक्ष्मी",
    category: "crossref",
    status: "Chapter 4",
    houses: "Special yoga",
    condition: "A specific special-yoga formula taught later in Chapter 4.",
    flavour: "Related to prosperity, but not duplicated inside this variant survey.",
    caution: "Use this as a route marker, not as one of the five major variants in this lesson.",
    color: grahas.shukra.primary,
  },
];

export const DEFAULT_DHANA_VARIANT_SLUG = "two-eleven";

export function getDhanaVariant(slug: string) {
  return DHANA_YOGA_VARIANTS.find((variant) => variant.slug === slug) ?? DHANA_YOGA_VARIANTS[0];
}
