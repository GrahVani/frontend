export type NodeId = "rahu" | "ketu";

export interface DignityPosition {
  id: string;
  source: string;
  exalt: string[]; // List of sign IDs
  debil: string[];
  ownSign: string[];
  isDefault?: boolean;
}

export const RAHU_POSITIONS: DignityPosition[] = [
  { id: "1", source: "BPHS mainstream", exalt: ["vrsabha"], debil: ["vrscika"], ownSign: [], isDefault: true },
  { id: "2", source: "Sārāvalī / Phaladīpikā", exalt: ["mithuna"], debil: ["dhanus"], ownSign: ["kumbha"] },
  { id: "3", source: "Some modern schools", exalt: ["vrsabha", "mithuna"], debil: ["vrscika", "dhanus"], ownSign: ["kanya", "kumbha"] },
  { id: "4", source: "KP / Lal Kitab variants", exalt: ["mithuna"], debil: ["dhanus"], ownSign: ["variable"] }, // variable is a special placeholder
];

export const KETU_POSITIONS: DignityPosition[] = [
  { id: "1", source: "BPHS mainstream", exalt: ["vrscika"], debil: ["vrsabha"], ownSign: [], isDefault: true },
  { id: "2", source: "Classical alternative", exalt: ["dhanus"], debil: ["mithuna"], ownSign: ["vrscika"] },
  { id: "3", source: "Some modern schools", exalt: ["dhanus", "mina"], debil: ["mithuna", "kanya"], ownSign: ["dhanus", "mina"] },
  { id: "4", source: "KP / Lal Kitab variants", exalt: ["dhanus"], debil: ["mithuna"], ownSign: ["variable"] },
];

export const ZODIAC_SIGNS = [
  { id: "mesa", name: "Meṣa" },
  { id: "vrsabha", name: "Vṛṣabha" },
  { id: "mithuna", name: "Mithuna" },
  { id: "karkata", name: "Karkaṭa" },
  { id: "simha", name: "Siṁha" },
  { id: "kanya", name: "Kanyā" },
  { id: "tula", name: "Tulā" },
  { id: "vrscika", name: "Vṛścika" },
  { id: "dhanus", name: "Dhanus" },
  { id: "makara", name: "Makara" },
  { id: "kumbha", name: "Kumbha" },
  { id: "mina", name: "Mīna" },
];

export function getJudgment(signId: string, position: DignityPosition): string {
  if (position.exalt.includes(signId)) return "Exalted";
  if (position.debil.includes(signId)) return "Debilitated";
  if (position.ownSign.includes(signId)) return "Own Sign";
  if (position.ownSign.includes("variable")) return "Variable/Unassigned";
  return "Neutral / Unassigned";
}
