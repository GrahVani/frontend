import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";

export type UpayaFamilyKey = "throwing" | "feeding" | "wearing" | "burial" | "donation" | "behavioral";

export interface UpayaFamily {
  key: UpayaFamilyKey;
  number: number;
  label: string;
  iast: string;
  devanagari: string;
  verb: string;
  action: string;
  example: string;
  contrast: string;
  color: string;
}

export interface TotkaExample {
  id: string;
  label: string;
  family: UpayaFamilyKey;
  planetCue: string;
  why: string;
}

export interface FramingRule {
  label: string;
  verdict: "good" | "caution";
  text: string;
}

export const UPAYA_FAMILIES: UpayaFamily[] = [
  {
    key: "throwing",
    number: 1,
    label: "Object-throwing",
    iast: "vastu-visarjana",
    devanagari: "विसर्जन",
    verb: "release",
    action: "Float or cast an item away, usually into flowing water.",
    example: "Float a coconut down a river.",
    contrast: "Released, not kept on the body and not handed to a recipient.",
    color: grahas.candra.primary,
  },
  {
    key: "feeding",
    number: 2,
    label: "Food-feeding",
    iast: "anna-dana style feeding",
    devanagari: "भोजन",
    verb: "feed",
    action: "Give food to animals, birds, the poor, or brahmins.",
    example: "Feed dogs, cows, birds, or the poor.",
    contrast: "The item is food; the family is still feeding regardless of recipient.",
    color: "#2F7D52",
  },
  {
    key: "wearing",
    number: 3,
    label: "Item-wearing",
    iast: "dharaṇa",
    devanagari: "धारण",
    verb: "wear",
    action: "Keep a small object on the body or carried with the person.",
    example: "Wear a copper ring or carry a metal square.",
    contrast: "The item stays with the person; it is not buried or donated.",
    color: grahas.budha.primary,
  },
  {
    key: "burial",
    number: 4,
    label: "Item-burial",
    iast: "nikṣepa",
    devanagari: "निक्षेप",
    verb: "fix",
    action: "Place an object into a location so it remains anchored there.",
    example: "Bury a coin under a tree or in a house corner.",
    contrast: "Fixed in place, the spatial opposite of releasing into water.",
    color: grahas.shani.primary,
  },
  {
    key: "donation",
    number: 5,
    label: "Item-donation",
    iast: "dana-like transfer",
    devanagari: "दान",
    verb: "give",
    action: "Transfer a specific item to a specified recipient, often on a weekday.",
    example: "Donate a black item on Saturday.",
    contrast: "A recipient receives it; only partly resembles classical dana.",
    color: ink.goldAccent,
  },
  {
    key: "behavioral",
    number: 6,
    label: "Behavioral",
    iast: "achara-niyama",
    devanagari: "आचार",
    verb: "continue",
    action: "Adopt an ongoing restriction, service, or rule of conduct.",
    example: "Avoid a food, drink, place, or serve elders regularly.",
    contrast: "A lived habit, not a one-time physical gesture.",
    color: grahas.mangala.primary,
  },
];

export const TOTKA_EXAMPLES: TotkaExample[] = [
  {
    id: "coconut",
    label: "Float a coconut in flowing water",
    family: "throwing",
    planetCue: "release an object",
    why: "The action is casting away; water carries the item onward.",
  },
  {
    id: "dogs",
    label: "Feed dogs on Saturday",
    family: "feeding",
    planetCue: "recipient receives food",
    why: "Dogs are the recipient, but the verb is feeding, so it stays in family 2.",
  },
  {
    id: "copper-ring",
    label: "Wear a copper ring",
    family: "wearing",
    planetCue: "metal stays on body",
    why: "The copper is kept with the person rather than released, buried, or donated.",
  },
  {
    id: "silver-bury",
    label: "Bury silver in a house corner",
    family: "burial",
    planetCue: "item fixed in place",
    why: "The same material could be worn or donated; here the verb is bury.",
  },
  {
    id: "black-donation",
    label: "Donate a black item on Saturday",
    family: "donation",
    planetCue: "recipient receives an item",
    why: "The action transfers a specified item to someone else.",
  },
  {
    id: "avoidance",
    label: "Avoid alcohol for a stated period",
    family: "behavioral",
    planetCue: "ongoing conduct rule",
    why: "Avoidance is lived repeatedly, not performed once.",
  },
];

export const FRAMING_RULES: FramingRule[] = [
  {
    label: "Honest claim",
    verdict: "good",
    text: "Offer a totka as a low-cost Lal Kitab folk practice, worth trying but never guaranteed.",
  },
  {
    label: "Do not make it magic",
    verdict: "caution",
    text: "Do not say the act mechanically forces a result or makes the planet obey.",
  },
  {
    label: "Disclose the source",
    verdict: "good",
    text: "Name the tradition clearly: Lal Kitab folk practice, distinct from classical mantra, yantra, and dana.",
  },
];

export function getFamily(key: UpayaFamilyKey) {
  return UPAYA_FAMILIES.find((family) => family.key === key) ?? UPAYA_FAMILIES[0];
}
