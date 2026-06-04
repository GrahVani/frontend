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
  system?: 'shravana' | 'dhanishtha'; // To identify which binary star it belongs to
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
    "id": "shravana",
    "iast": "Śravaṇa",
    "devanagari": "श्रवण",
    "interlockLabel": "The Ear",
    "interlockBrief": "Listening to Truth",
    "coreConcept": "Śravaṇa is the star of absolute receptivity. It represents the ability to listen deeply to the divine word (Śruti) and silence the ego's noise.",
    "cosmicFunction": "It acts as the cosmic receiver, acquiring ancient wisdom and preserving universal truths through pure attention.",
    "keyAttributes": ["Divine listening", "Deep receptivity", "Acquiring wisdom"],
    "isCenter": true,
    "system": "shravana"
  },
  {
    "id": "vishnu",
    "iast": "Viṣṇu",
    "devanagari": "विष्णु",
    "interlockLabel": "The Pervader",
    "interlockBrief": "Śravaṇa Deity",
    "coreConcept": "Viṣṇu is the supreme preserver of the universe, representing the all-pervading consciousness that sustains reality.",
    "cosmicFunction": "He provides the eternal, unchanging truth that one can only hear when the mind reaches total, receptive stillness.",
    "keyAttributes": ["Preserving universe", "Pervading consciousness", "Eternal truth"],
    "angleDeg": 90,
    "system": "shravana"
  },
  {
    "id": "moon",
    "iast": "Candra",
    "devanagari": "चन्द्र",
    "interlockLabel": "The Moon",
    "interlockBrief": "Śravaṇa Lord",
    "coreConcept": "The Moon rules the mind (Manas) and its capacity to reflect light and absorb impressions perfectly.",
    "cosmicFunction": "It provides the calm, reflective mental space necessary to truly hear and absorb profound knowledge without distortion.",
    "keyAttributes": ["Reflective mind", "Receptive space", "Absorbing knowledge"],
    "angleDeg": 270,
    "system": "shravana"
  },
  {
    "id": "dhanishtha",
    "iast": "Dhaniṣṭhā",
    "devanagari": "धनिष्ठा",
    "interlockLabel": "The Drum",
    "interlockBrief": "Rhythm & Wealth",
    "coreConcept": "Dhaniṣṭhā is the star of perfect timing, symphony, and the materialization of profound wealth through rhythm.",
    "cosmicFunction": "It transforms the silent wisdom heard in Śravaṇa into active, rhythmic manifestation and cosmic dance.",
    "keyAttributes": ["Cosmic rhythm", "Perfect timing", "Manifesting wealth"],
    "isCenter": true,
    "system": "dhanishtha"
  },
  {
    "id": "vasus",
    "iast": "Vasus",
    "devanagari": "वसवः",
    "interlockLabel": "The 8 Elements",
    "interlockBrief": "Dhaniṣṭhā Deity",
    "coreConcept": "The eight Vasus are the fundamental elemental gods of light, energy, and physical substance.",
    "cosmicFunction": "They manifest the raw material abundance, spiritual wealth, and brilliant light associated with this nakshatra.",
    "keyAttributes": ["Elemental gods", "Material abundance", "Brilliant light"],
    "angleDeg": 90,
    "system": "dhanishtha"
  },
  {
    "id": "mars",
    "iast": "Maṅgala",
    "devanagari": "मङ्गल",
    "interlockLabel": "Mars",
    "interlockBrief": "Dhaniṣṭhā Lord",
    "coreConcept": "Mars provides the driving, passionate beat and the raw courage to act with absolute precision.",
    "cosmicFunction": "It is the energetic force that strikes the drum, keeping the cosmic rhythm playing and driving action forward.",
    "keyAttributes": ["Driving beat", "Raw courage", "Precise action"],
    "angleDeg": 270,
    "system": "dhanishtha"
  }
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    "slug": "s1",
    "question": "A sage sits in total silence, receiving a transmission of ancient, preserving wisdom through deep receptivity.",
    "options": [
      {
        "id": "A",
        "label": "Śravaṇa, Viṣṇu, Candra",
        "isCorrect": true,
        "explanation": "Śravaṇa (hearing), ruled by the receptive Moon, downloading the preserving wisdom of Viṣṇu."
      },
      {
        "id": "B",
        "label": "Dhaniṣṭhā, Vasus, Maṅgala",
        "isCorrect": false,
        "explanation": "These represent rhythm, wealth, and action, not silent receptivity."
      },
      {
        "id": "C",
        "label": "Śravaṇa, Vasus, Candra",
        "isCorrect": false,
        "explanation": "The Vasus manifest material wealth, whereas Viṣṇu provides the preserving wisdom."
      }
    ]
  },
  {
    "slug": "s2",
    "question": "A leader takes action with perfect timing and energy, aligning elemental forces to manifest immense physical abundance.",
    "options": [
      {
        "id": "A",
        "label": "Śravaṇa, Viṣṇu, Candra",
        "isCorrect": false,
        "explanation": "This describes receptive listening, not taking action to manifest abundance."
      },
      {
        "id": "B",
        "label": "Dhaniṣṭhā, Vasus, Maṅgala",
        "isCorrect": true,
        "explanation": "Dhaniṣṭhā (rhythm/wealth), powered by the action of Mars, to manifest the abundance of the elemental Vasus."
      },
      {
        "id": "C",
        "label": "Dhaniṣṭhā, Viṣṇu, Maṅgala",
        "isCorrect": false,
        "explanation": "Viṣṇu preserves, but it is the Vasus (8 elements) that specifically manifest physical abundance/wealth here."
      }
    ]
  }
];
