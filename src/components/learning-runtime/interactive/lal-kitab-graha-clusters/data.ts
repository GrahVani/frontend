/**
 * Lal Kitab Graha Clusters — data engine for Lesson 18.4.4.
 */

export interface ClusterDef {
  graha: string;
  abbr: string;
  color: string;
  classical: string[];
  lalKitab: string[];
  distinctive: string[];
  remedyHook: string;
}

export const CLUSTERS: ClusterDef[] = [
  {
    graha: "Saturn",
    abbr: "Sa",
    color: "#4A5568",
    classical: ["longevity", "sorrow", "discipline", "serving classes"],
    lalKitab: ["hard work", "manual labour", "discipline", "machinery", "longevity", "servants"],
    distinctive: ["iron", "oil"],
    remedyHook: "Remedies centre on iron objects and offering oil — read straight off Saturn's object-significations.",
  },
  {
    graha: "Rāhu",
    abbr: "Ra",
    color: "#2D3748",
    classical: ["foreignness", "sudden upheaval", "unconventional"],
    lalKitab: ["maternal in-laws", "poisons", "foreign things", "foreign lands"],
    distinctive: ["electricity"],
    remedyHook: "Remedies touch domains of electricity and the foreign — the modern object that travels unseen.",
  },
  {
    graha: "Ketu",
    abbr: "Ke",
    color: "#718096",
    classical: ["mokṣa", "detachment", "occult", "headless"],
    lalKitab: ["children-specific issues", "ascetics", "renunciates", "the occult"],
    distinctive: ["dogs", "signal-fires"],
    remedyHook: "A classic Ketu remedy is to feed or care for a dog — read directly from the object-signification.",
  },
];

export const ALL_NINE_GRAHAS = [
  { lesson: "18.4.1", grahas: "Sun, Moon", note: "Concrete-signification style established" },
  { lesson: "18.4.2", grahas: "Mars, Mercury", note: "Mars sign-keyed good/bad split" },
  { lesson: "18.4.3", grahas: "Jupiter, Venus", note: "Gold, vehicles, sweet-foods" },
  { lesson: "18.4.4", grahas: "Saturn, Rāhu, Ketu", note: "Iron, oil; electricity; dogs, signal-fires" },
];
