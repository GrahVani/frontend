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

export interface QuizItem {
  id: number;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 1,
    question: "Which graha signifies electricity in Lal Kitab?",
    options: ["Saturn", "Rāhu", "Ketu", "Mars"],
    correctIdx: 1,
    explanation: "Rāhu carries electricity — a modern, context-bound addition. Rāhu runs the current.",
  },
  {
    id: 2,
    question: "Which graha is linked to signal-fires?",
    options: ["Saturn", "Rāhu", "Ketu", "Jupiter"],
    correctIdx: 2,
    explanation: "Ketu carries signal-fires. Ketu raises the signal — the mnemonic cue.",
  },
  {
    id: 3,
    question: "Saturn's distinctive concrete materials in Lal Kitab are:",
    options: ["Gold and silver", "Iron and oil", "Wood and water", "Fire and air"],
    correctIdx: 1,
    explanation: "Iron and oil are Saturn's distinctive Lal Kitab additions — tangible, laborious materials.",
  },
  {
    id: 4,
    question: "Rāhu's family link in Lal Kitab is to the:",
    options: ["Mother", "Father", "Maternal in-laws", "Paternal in-laws"],
    correctIdx: 2,
    explanation: "Rāhu = maternal in-laws (the mother's side as relations-by-marriage), not the mother herself.",
  },
  {
    id: 5,
    question: "Which three grahas anchor Lal Kitab's ṛṇa (debt) framework?",
    options: ["Sun, Moon, Mars", "Jupiter, Venus, Mercury", "Saturn, Rāhu, Ketu", "Mars, Saturn, Jupiter"],
    correctIdx: 2,
    explanation: "Saturn (consequence), Rāhu, and Ketu (karmic axis) are the structural anchors of the debt framework.",
  },
  {
    id: 6,
    question: "Why are Lal Kitab remedies called 'cheap totke'?",
    options: [
      "They use expensive gemstones",
      "They are derived directly from object-significations and use household items",
      "They require elaborate temple rituals",
      "They are based on classical mantra japa",
    ],
    correctIdx: 1,
    explanation: "The totke are read off the concrete object-significations — iron, oil, dogs — making them inexpensive household actions.",
  },
];

export const ALL_NINE_GRAHAS = [
  { lesson: "18.4.1", grahas: "Sun, Moon", note: "Concrete-signification style established" },
  { lesson: "18.4.2", grahas: "Mars, Mercury", note: "Mars sign-keyed good/bad split" },
  { lesson: "18.4.3", grahas: "Jupiter, Venus", note: "Gold, vehicles, sweet-foods" },
  { lesson: "18.4.4", grahas: "Saturn, Rāhu, Ketu", note: "Iron, oil; electricity; dogs, signal-fires" },
];
