export interface NodeData {
  id: string;
  iast: string;
  devanagari: string;
  interlockLabel: string;
  interlockBrief: string;
  coreConcept: string;
  cosmicFunction: string;
  keyAttributes: string[];
  angleDeg?: number;
  isCenter?: boolean;
}

export interface DrillScenario {
  slug: string;
  question: string;
  context?: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const NODES: NodeData[] = [
  {
    "id": "mula",
    "iast": "Mūla",
    "devanagari": "मूल",
    "interlockLabel": "The Root",
    "interlockBrief": "Nirṛti's Domain",
    "coreConcept": "Mūla translates directly to 'the root', representing the absolute foundation and the core of existence.",
    "cosmicFunction": "Positioned near the Galactic Center, it functions to uncover the deep, often hidden origins of things by stripping away superficial reality.",
    "keyAttributes": [
      "Absolute foundation",
      "Hidden origins",
      "Galactic Center alignment"
    ],
    "isCenter": true
  },
  {
    "id": "nirriti",
    "iast": "Nirṛti",
    "devanagari": "निर्ऋति",
    "interlockLabel": "Goddess of Destruction",
    "interlockBrief": "Breaking to Build",
    "coreConcept": "Nirṛti is the ancient Vedic deity of calamity, destruction, and necessary uprooting.",
    "cosmicFunction": "Her cosmic purpose is the active destruction of the old and the false, relentlessly stripping things down to their absolute core truth.",
    "keyAttributes": [
      "Necessary destruction",
      "Uprooting falsehoods",
      "Radical transformation"
    ],
    "angleDeg": -90
  },
  {
    "id": "ketu",
    "iast": "Ketu",
    "devanagari": "केतु",
    "interlockLabel": "The South Node",
    "interlockBrief": "The Planetary Lord",
    "coreConcept": "Ketu rules Mūla, injecting profound spiritual depth, detachment, and an explosive, unpredictable energy.",
    "cosmicFunction": "It severs ties with materialistic reality and superficial attachments, forcing the soul to search for ultimate liberation (Moksha).",
    "keyAttributes": [
      "Spiritual detachment",
      "Sudden severing",
      "Quest for liberation"
    ],
    "angleDeg": 0
  },
  {
    "id": "roots",
    "iast": "Tied Roots",
    "devanagari": "मूल",
    "interlockLabel": "The Tied Bunch",
    "interlockBrief": "The Symbol of Mūla",
    "coreConcept": "The primary symbol is a tied bunch of roots, capturing Mūla's essence of restriction and foundational strength.",
    "cosmicFunction": "It represents searching beneath the surface, exploring the subconscious, and being tied to one's karmic origins.",
    "keyAttributes": [
      "Beneath the surface",
      "Karmic bindings",
      "Foundational strength"
    ],
    "angleDeg": 90
  },
  {
    "id": "sagittarius",
    "iast": "Dhanus",
    "devanagari": "धनुष",
    "interlockLabel": "Sagittarius",
    "interlockBrief": "The Rashi",
    "coreConcept": "Mūla lies entirely within Sagittarius (Dhanus), adding a philosophical, truth-seeking fire to its nature.",
    "cosmicFunction": "It ensures that Mūla's destructive tendencies are not born of malice, but are directed toward uncovering ultimate philosophical meaning.",
    "keyAttributes": [
      "Philosophical fire",
      "Truth-seeking",
      "Higher meaning"
    ],
    "angleDeg": 180
  }
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    "slug": "s1",
    "question": "A person experiences a sudden loss of their false identity and material attachments, forcing spiritual grounding. Which energies are primarily at play?",
    "context": "Focus on the destruction of illusion and spiritual detachment.",
    "options": [
      {
        "id": "A",
        "label": "Nirṛti and Ketu",
        "isCorrect": true,
        "explanation": "Nirṛti represents the necessary destruction of the false, while Ketu represents sudden severing of attachments."
      },
      {
        "id": "B",
        "label": "Tied Roots and Mūla",
        "isCorrect": false,
        "explanation": "While relevant, they signify digging and foundation, not the active destruction of false identity."
      },
      {
        "id": "C",
        "label": "Sagittarius and Ketu",
        "isCorrect": false,
        "explanation": "Sagittarius is the philosophical fire, but Nirṛti is the active destructive force missing here."
      }
    ]
  },
  {
    "slug": "s2",
    "question": "An investigative journalist spends years digging beneath the surface, refusing to stop until they reach the absolute origin of a philosophical truth.",
    "options": [
      {
        "id": "A",
        "label": "Nirṛti and Ketu",
        "isCorrect": false,
        "explanation": "This describes destruction and detachment, not sustained philosophical investigation."
      },
      {
        "id": "B",
        "label": "Tied Roots and Sagittarius",
        "isCorrect": true,
        "explanation": "The Tied Roots signify digging beneath the surface, while Sagittarius provides the philosophical truth-seeking fire."
      },
      {
        "id": "C",
        "label": "Mūla and Nirṛti",
        "isCorrect": false,
        "explanation": "Mūla is the core, but Nirṛti focuses on uprooting rather than philosophical investigation."
      }
    ]
  }
];
