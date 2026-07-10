export interface NodeData {
  id: string;
  iast: string;
  devanagari: string;
  interlockLabel: string;
  interlockBrief: string;
  interlockDetail: string;
  iconName?: string;
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
    "id": "revati",
    "iast": "Revatī",
    "devanagari": "रेवती",
    "interlockLabel": "The Wealthy",
    "interlockBrief": "The Final Journey",
    "interlockDetail": "Revatī is the twenty-seventh and final nakṣatra, representing completion, transition to the next world, spiritual wealth, and final dissolution into the cosmic ocean.",
    "isCenter": true
  },
  {
    "id": "pushan",
    "iast": "Pūṣan",
    "devanagari": "पूषन्",
    "interlockLabel": "The Nourisher",
    "interlockBrief": "The Shepherd Deity",
    "interlockDetail": "Pūṣan is the divine shepherd of the gods, who nourishes the flock, finds lost things, and safely guides souls across thresholds into the afterlife.",
    "iconName": "Heart",
    "angleDeg": -90
  },
  {
    "id": "mercury",
    "iast": "Budha",
    "devanagari": "बुध",
    "interlockLabel": "Mercury",
    "interlockBrief": "The Ruling Planet",
    "interlockDetail": "Mercury provides the ultimate communication and translation skills necessary to cross between different realms of existence and integrate final knowledge.",
    "iconName": "Feather",
    "angleDeg": -30
  },
  {
    "id": "fish",
    "iast": "Mīna",
    "devanagari": "मीन",
    "interlockLabel": "Two Fishes",
    "interlockBrief": "The Symbol",
    "interlockDetail": "The two fishes swimming in the cosmic ocean represent the soul navigating the waters of Moksha, moving gracefully towards final liberation.",
    "iconName": "Waves",
    "angleDeg": 30
  },
  {
    "id": "wealth",
    "iast": "Sampatti",
    "devanagari": "संपत्ति",
    "interlockLabel": "Prosperity",
    "interlockBrief": "Abundance",
    "interlockDetail": "Revatī translates directly to 'The Wealthy'. It promises immense material prosperity that eventually transforms into supreme spiritual wealth.",
    "iconName": "Sparkles",
    "angleDeg": 90
  },
  {
    "id": "nourish",
    "iast": "Poṣaṇa",
    "devanagari": "पोषण",
    "interlockLabel": "Nourishment",
    "interlockBrief": "Sustenance",
    "interlockDetail": "The profound ability to care for and sustain others. Revatī natives often find themselves feeding, protecting, and fostering the growth of those around them.",
    "iconName": "Sun",
    "angleDeg": 150
  },
  {
    "id": "moksha",
    "iast": "Mokṣa",
    "devanagari": "मोक्ष",
    "interlockLabel": "Liberation",
    "interlockBrief": "The End of the Cycle",
    "interlockDetail": "As the final nakṣatra of the zodiac, Revatī is the ultimate gateway to Moksha—the release from the cycle of birth and rebirth.",
    "iconName": "RefreshCw",
    "angleDeg": 210
  }
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    "slug": "s1",
    "question": "A soul needs gentle guidance to safely navigate from this world to the next without getting lost in the darkness.",
    "options": [
      {
        "id": "A",
        "label": "Revatī and Pūṣan",
        "isCorrect": true,
        "explanation": "Revatī represents the final journey, and Pūṣan is the divine shepherd who safely guides souls across."
      },
      {
        "id": "B",
        "label": "Budha and Two Fishes",
        "isCorrect": false,
        "explanation": "These represent translation and swimming the cosmic ocean, not the 'guiding shepherd' archetype."
      },
      {
        "id": "C",
        "label": "Revatī and Two Fishes",
        "isCorrect": false,
        "explanation": "While true to Revatī, this lacks the active guiding energy provided by the deity Pūṣan."
      }
    ]
  },
  {
    "slug": "s2",
    "question": "Information from a higher, spiritual realm must be accurately translated and communicated into a form we can understand here on earth.",
    "options": [
      {
        "id": "A",
        "label": "Revatī and Pūṣan",
        "isCorrect": false,
        "explanation": "This is about guidance and transition, not specifically translation and communication."
      },
      {
        "id": "B",
        "label": "Budha and Two Fishes",
        "isCorrect": true,
        "explanation": "Budha (Mercury) is the messenger and translator, while the Fishes represent navigating those higher cosmic waters."
      },
      {
        "id": "C",
        "label": "Budha and Pūṣan",
        "isCorrect": false,
        "explanation": "Mercury translates, but Pūṣan guides; the Fishes are a better symbol for the medium (cosmic waters) of the message."
      }
    ]
  }
];
