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
    "id": "purva-ashadha",
    "iast": "Pūrva Aṣāḍhā",
    "devanagari": "पूर्वाषाढा",
    "interlockLabel": "The Former Undefeated",
    "interlockBrief": "The Hub",
    "coreConcept": "Pūrva Aṣāḍhā translates to 'The Former Undefeated', representing an early, raw form of victory and absolute invincibility.",
    "cosmicFunction": "Its cosmic function is to provide the unstoppable surge of energy required to begin major undertakings without fear of failure.",
    "keyAttributes": [
      "Raw victory",
      "Early invincibility",
      "Unstoppable surge"
    ],
    "isCenter": true
  },
  {
    "id": "apas",
    "iast": "Āpas",
    "devanagari": "आपः",
    "interlockLabel": "Cosmic Waters",
    "interlockBrief": "The Deity",
    "coreConcept": "Āpas represents the divine cosmic waters, the vast ocean of consciousness that flows universally and sustains all life.",
    "cosmicFunction": "It functions as the ultimate purifying force, washing away illusions and connecting the individual soul to the universal flow.",
    "keyAttributes": [
      "Divine cosmic waters",
      "Universal flow",
      "Ultimate purification"
    ],
    "angleDeg": -90
  },
  {
    "id": "venus",
    "iast": "Śukra",
    "devanagari": "शुक्र",
    "interlockLabel": "Venus",
    "interlockBrief": "The Lord",
    "coreConcept": "Venus (Śukra) rules this nakshatra, bringing an intense desire for rejuvenation, flow, and artistic pleasure.",
    "cosmicFunction": "It directs the raw, unstoppable energy of Pūrva Aṣāḍhā towards creation, beauty, and harmonious relationships.",
    "keyAttributes": [
      "Artistic rejuvenation",
      "Harmonious flow",
      "Creative pleasure"
    ],
    "angleDeg": 30
  },
  {
    "id": "basket",
    "iast": "Winnowing Basket",
    "devanagari": "शूर्प",
    "interlockLabel": "The Symbol",
    "interlockBrief": "Separating Chaff",
    "coreConcept": "The winnowing basket is used to separate the grain (truth) from the chaff (illusion) using the wind.",
    "cosmicFunction": "It aligns with the purifying nature of the cosmic waters, actively separating what is valuable and eternal from what is useless and temporary.",
    "keyAttributes": [
      "Separating truth",
      "Purging illusion",
      "Active purification"
    ],
    "angleDeg": 150
  }
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    "slug": "s1",
    "question": "An individual seeks to completely cleanse themselves of past illusions and separate truth from falsehood. Which energies facilitate this?",
    "context": "Focus on the purification and separation actions.",
    "options": [
      {
        "id": "A",
        "label": "Āpas and the Winnowing Basket",
        "isCorrect": true,
        "explanation": "Āpas provides purifying waters, while the Basket actively separates the true grain from the false chaff."
      },
      {
        "id": "B",
        "label": "Pūrva Aṣāḍhā and Venus",
        "isCorrect": false,
        "explanation": "These energies focus on undefeated victory and flowing pleasure, not purification."
      },
      {
        "id": "C",
        "label": "Venus and the Winnowing Basket",
        "isCorrect": false,
        "explanation": "Venus brings rejuvenation, but Āpas is required for the fundamental cleansing."
      }
    ]
  },
  {
    "slug": "s2",
    "question": "A creative person channels an overwhelming, victorious wave of beauty that simply cannot be stopped or reasoned with.",
    "options": [
      {
        "id": "A",
        "label": "Āpas and the Winnowing Basket",
        "isCorrect": false,
        "explanation": "These are purifying and separating forces, not unstoppable artistic waves."
      },
      {
        "id": "B",
        "label": "Pūrva Aṣāḍhā and Venus",
        "isCorrect": true,
        "explanation": "Pūrva Aṣāḍhā provides the 'undefeated' raw power, while Venus provides the artistic and flowing essence."
      },
      {
        "id": "C",
        "label": "Āpas and Venus",
        "isCorrect": false,
        "explanation": "While watery and beautiful, this misses the 'undefeated' (Aṣāḍhā) raw power driving the wave."
      }
    ]
  }
];
