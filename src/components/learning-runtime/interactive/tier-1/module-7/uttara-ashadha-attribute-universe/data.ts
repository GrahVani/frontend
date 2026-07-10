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
  radius?: number;
  orbitDuration?: number;
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
    "id": "uttara",
    "iast": "Uttara Aṣāḍhā",
    "devanagari": "उत्तराषाढा",
    "interlockLabel": "The Latter Undefeated",
    "interlockBrief": "The Hub",
    "coreConcept": "Uttara Aṣāḍhā represents absolute, enduring, and unquestioned victory that comes after the initial battle is won.",
    "cosmicFunction": "It provides the unshakeable foundation for establishing long-lasting dharma, leadership, and universal truth.",
    "keyAttributes": [
      "Enduring victory",
      "Unshakeable foundation",
      "Establishing dharma"
    ],
    "isCenter": true
  },
  {
    "id": "sun",
    "iast": "Sūrya",
    "devanagari": "सूर्य",
    "interlockLabel": "The Sun",
    "interlockBrief": "The Lord",
    "coreConcept": "Sūrya brings absolute authority, radiant leadership, and an unwavering commitment to truth and duty.",
    "cosmicFunction": "It illuminates the path of dharma, ensuring that the power gained here is used to lead and protect with supreme clarity.",
    "keyAttributes": [
      "Absolute authority",
      "Radiant leadership",
      "Commitment to duty"
    ],
    "angleDeg": -90,
    "radius": 100,
    "orbitDuration": 30
  },
  {
    "id": "visvedevas",
    "iast": "Viśvedevās",
    "devanagari": "विश्वेदेवाः",
    "interlockLabel": "The Universal Gods",
    "interlockBrief": "The Deity",
    "coreConcept": "The Viśvedevās are the pantheon of universal divine virtues, embodying goodness, truth, willpower, and eternal time.",
    "cosmicFunction": "They bless this nakshatra with unmatched nobility, ensuring that its victories are aligned with cosmic laws and benefit all.",
    "keyAttributes": [
      "Universal virtues",
      "Cosmic alignment",
      "Unmatched nobility"
    ],
    "angleDeg": 30,
    "radius": 150,
    "orbitDuration": 60
  },
  {
    "id": "tusk",
    "iast": "Elephant Tusk",
    "devanagari": "गजदन्त",
    "interlockLabel": "The Symbol",
    "interlockBrief": "Enduring Strength",
    "coreConcept": "The elephant tusk is a symbol of immense, unyielding strength, prestige, and the ability to penetrate any obstacle.",
    "cosmicFunction": "It represents the raw physical and spiritual power required to sustain victory and command respect universally.",
    "keyAttributes": [
      "Unyielding strength",
      "Penetrating obstacles",
      "Commanding respect"
    ],
    "angleDeg": 150,
    "radius": 200,
    "orbitDuration": 90
  }
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    "slug": "s1",
    "question": "A leader achieves a massive, enduring victory and immediately sets out to establish laws that benefit everyone with absolute nobility. Which energies are dominant?",
    "context": "Focus on the combination of victory and universal virtues.",
    "options": [
      {
        "id": "A",
        "label": "Uttara Aṣāḍhā and Viśvedevās",
        "isCorrect": true,
        "explanation": "Uttara Aṣāḍhā provides the enduring victory, while the Viśvedevās provide the universal nobility and virtues."
      },
      {
        "id": "B",
        "label": "Sūrya and the Elephant Tusk",
        "isCorrect": false,
        "explanation": "While this shows strength and authority, it misses the 'universal virtues' aspect brought by the Viśvedevās."
      },
      {
        "id": "C",
        "label": "Uttara Aṣāḍhā and Sūrya",
        "isCorrect": false,
        "explanation": "This represents victorious leadership, but the specific blessing of universal, noble laws comes from the deities (Viśvedevās)."
      }
    ]
  },
  {
    "slug": "s2",
    "question": "Someone overcomes immense obstacles using pure, penetrating strength and radiant authority, commanding respect from all.",
    "options": [
      {
        "id": "A",
        "label": "Viśvedevās and Sūrya",
        "isCorrect": false,
        "explanation": "This describes noble authority but lacks the specific symbol of penetrating strength."
      },
      {
        "id": "B",
        "label": "Sūrya and the Elephant Tusk",
        "isCorrect": true,
        "explanation": "Sūrya provides the radiant authority, while the Elephant Tusk provides the penetrating, unyielding strength to overcome obstacles."
      },
      {
        "id": "C",
        "label": "Uttara Aṣāḍhā and the Elephant Tusk",
        "isCorrect": false,
        "explanation": "While strong, Sūrya is explicitly required for the 'radiant authority' aspect."
      }
    ]
  }
];
