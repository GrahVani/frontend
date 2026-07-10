import { grahas, ink, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export interface LetterGroup {
  value: number;
  letters: string[];
  note: string;
  grahaSlug: GrahaSlug | "reserved";
}

export interface CompoundMeaning {
  value: number;
  title: string;
  register: string;
  caution: string;
}

export interface NameExample {
  id: string;
  label: string;
  name: string;
  point: string;
}

export const CHALDEAN_GROUPS: LetterGroup[] = [
  { value: 1, letters: ["A", "I", "J", "Q", "Y"], note: "Solar initiation and individuality.", grahaSlug: "surya" },
  { value: 2, letters: ["B", "K", "R"], note: "Lunar receptivity and response.", grahaSlug: "candra" },
  { value: 3, letters: ["C", "G", "L", "S"], note: "Guru expansion, teaching, and expression.", grahaSlug: "guru" },
  { value: 4, letters: ["D", "M", "T"], note: "Rahu disruption, edge, and unconventional movement.", grahaSlug: "rahu" },
  { value: 5, letters: ["E", "H", "N", "X"], note: "Budha language, trade, and quick exchange.", grahaSlug: "budha" },
  { value: 6, letters: ["U", "V", "W"], note: "Shukra harmony, comfort, and aesthetic cohesion.", grahaSlug: "shukra" },
  { value: 7, letters: ["O", "Z"], note: "Ketu detachment, refinement, and inwardness.", grahaSlug: "ketu" },
  { value: 8, letters: ["F", "P"], note: "Shani structure, weight, and consequence.", grahaSlug: "shani" },
  { value: 9, letters: [], note: "Reserved-sacred: no letter receives 9 in Chaldean.", grahaSlug: "mangala" },
];

export const LETTER_VALUE: Record<string, number> = Object.fromEntries(
  CHALDEAN_GROUPS.flatMap((group) => group.letters.map((letter) => [letter, group.value])),
);

export const COMPOUND_MEANINGS: CompoundMeaning[] = [
  { value: 10, title: "Wheel of Fortune", register: "Rise, fall, visibility, and cyclic turns.", caution: "Do not mistake movement for permanent guarantee." },
  { value: 13, title: "Regeneration and Change", register: "Disruption that can become renewal.", caution: "Not automatically unlucky; read the context." },
  { value: 14, title: "Movement and Combination", register: "Travel, mixing, trade, and change through others.", caution: "Needs steadiness so motion does not scatter." },
  { value: 17, title: "Star of the Magi", register: "Legacy, protection, spiritual elevation.", caution: "High promise still needs chart support." },
  { value: 18, title: "Materialism with Spiritual Undercurrent", register: "Material push with spiritual warning beneath it.", caution: "Watch conflict between gain and conscience." },
  { value: 19, title: "Prince of Heaven", register: "Favour, esteem, success, and visible honour.", caution: "Favour is not a blank cheque." },
  { value: 22, title: "Caution and Spiritual Warning", register: "Awakening from illusion and misplaced trust.", caution: "Pause before contracts and promises." },
  { value: 26, title: "Disappointments and Reverses", register: "Partnership and money caution.", caution: "A warning signal, not a fate sentence." },
  { value: 27, title: "The Sceptre", register: "Command, authority, and spiritual force.", caution: "Power should be governed by ethics." },
  { value: 30, title: "The Thinker", register: "Reflection, philosophy, and considered speech.", caution: "Can become too solitary if unsupported." },
  { value: 32, title: "Communication and Influence", register: "Public appeal, social movement, and persuasion.", caution: "Influence must not become empty performance." },
  { value: 33, title: "Master Teacher", register: "Guidance, art, care, and public beneficence.", caution: "Avoid inflated master-number promises." },
];

export const NAME_EXAMPLES: NameExample[] = [
  { id: "aniket", label: "Aniket", name: "Aniket", point: "18 -> 9: Mangala single with compound 18 warning." },
  { id: "aaniket", label: "Aaniket", name: "Aaniket", point: "19 -> 10 -> 1: Surya single with compound 19 and 10." },
  { id: "goutham", label: "Goutham", name: "Goutham", point: "30 -> 3: Guru single with reflective compound 30." },
  { id: "grahvani", label: "Grahvani", name: "Grahvani", point: "Demonstrates how Sanskrit-origin names still use the Roman spelling table." },
];

export function reduceDigits(value: number) {
  const chain = [value];
  let current = value;
  while (current > 9) {
    current = String(current).split("").reduce((sum, digit) => sum + Number(digit), 0);
    chain.push(current);
  }
  return chain;
}

export function getCompoundMeaning(value: number) {
  return COMPOUND_MEANINGS.find((meaning) => meaning.value === value) ?? null;
}

export function getGroupByValue(value: number) {
  return CHALDEAN_GROUPS.find((group) => group.value === value) ?? CHALDEAN_GROUPS[0];
}

export function grahaLabel(value: number) {
  const group = getGroupByValue(value);
  if (group.grahaSlug === "reserved") return "Reserved";
  const graha = grahas[group.grahaSlug];
  return graha.iast;
}

export function grahaColor(value: number) {
  const group = getGroupByValue(value);
  if (group.grahaSlug === "reserved") return ink.goldAccent;
  const color = grahas[group.grahaSlug].primary;
  if (group.grahaSlug === "candra") return "#5A6F96";
  if (group.grahaSlug === "shukra") return "#356C96";
  return color;
}
