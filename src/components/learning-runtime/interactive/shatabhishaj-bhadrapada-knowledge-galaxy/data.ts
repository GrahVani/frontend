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
  system: 'shatabhishaj' | 'purva' | 'uttara';
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
  // ==========================================
  // SYSTEM 1: SHATABHISHAJ
  // ==========================================
  {
    "id": "shatabhishaj-center",
    "iast": "Śatabhiṣaj",
    "devanagari": "शतभिषज्",
    "interlockLabel": "100 Physicians",
    "interlockBrief": "The Veiled Healer",
    "interlockDetail": "Śatabhiṣaj represents deep, mysterious healing, the cosmic ocean, and things hidden behind a veil.",
    "isCenter": true,
    "system": "shatabhishaj"
  },
  {
    "id": "shat-1",
    "iast": "Auṣadhi",
    "devanagari": "औषधि",
    "interlockLabel": "Healing",
    "interlockBrief": "The Cure",
    "interlockDetail": "It rules over the 100 physicians, representing the power to cure unhealable and mysterious diseases through esoteric methods.",
    "iconName": "Leaf",
    "angleDeg": -90,
    "system": "shatabhishaj"
  },
  {
    "id": "shat-2",
    "iast": "Rakṣā",
    "devanagari": "रक्षा",
    "interlockLabel": "Protection",
    "interlockBrief": "The Shield",
    "interlockDetail": "Provides an impenetrable shield of energetic protection, hiding the native from enemies and negative forces.",
    "iconName": "Shield",
    "angleDeg": -30,
    "system": "shatabhishaj"
  },
  {
    "id": "shat-3",
    "iast": "Gopanīyatā",
    "devanagari": "गोपनीयता",
    "interlockLabel": "Secrecy",
    "interlockBrief": "The Veil",
    "interlockDetail": "Rules over things that are hidden, veiled, or kept in absolute secrecy, much like the depths of the ocean.",
    "iconName": "Lock",
    "angleDeg": 30,
    "system": "shatabhishaj"
  },
  {
    "id": "shat-4",
    "iast": "Anuśāsana",
    "devanagari": "अनुशासन",
    "interlockLabel": "Discipline",
    "interlockBrief": "The Practice",
    "interlockDetail": "Requires strict, unyielding discipline and isolation to master its esoteric healing arts.",
    "iconName": "Activity",
    "angleDeg": 90,
    "system": "shatabhishaj"
  },
  {
    "id": "shat-5",
    "iast": "Gahantā",
    "devanagari": "गहनता",
    "interlockLabel": "Depth",
    "interlockBrief": "The Ocean",
    "interlockDetail": "Symbolizes the profound, unexplored depths of the cosmic waters where true knowledge resides.",
    "iconName": "Waves",
    "angleDeg": 150,
    "system": "shatabhishaj"
  },
  {
    "id": "shat-6",
    "iast": "Rahasya",
    "devanagari": "रहस्य",
    "interlockLabel": "Mystery",
    "interlockBrief": "The Unknown",
    "interlockDetail": "Governs the ultimate mysteries of the universe, astrology, and hidden spiritual truths.",
    "iconName": "Sparkles",
    "angleDeg": 210,
    "system": "shatabhishaj"
  },

  // ==========================================
  // SYSTEM 2: PURVA BHADRAPADA
  // ==========================================
  {
    "id": "purva-center",
    "iast": "Pūrva Bhādrapadā",
    "devanagari": "पूर्वभाद्रपदा",
    "interlockLabel": "The Former Blessed Feet",
    "interlockBrief": "The Fiery Ascetic",
    "interlockDetail": "Pūrva Bhādrapadā represents intense tapas (penance), the burning fire of transformation, and the front legs of the funeral cot.",
    "isCenter": true,
    "system": "purva"
  },
  {
    "id": "purva-1",
    "iast": "Tapas",
    "devanagari": "तपस्",
    "interlockLabel": "Penance",
    "interlockBrief": "Austerity",
    "interlockDetail": "The practice of severe self-discipline and abstention to achieve spiritual power.",
    "iconName": "Flame",
    "angleDeg": -90,
    "system": "purva"
  },
  {
    "id": "purva-2",
    "iast": "Agni",
    "devanagari": "अग्नि",
    "interlockLabel": "Fire",
    "interlockBrief": "The Purifier",
    "interlockDetail": "The cosmic fire that burns away karma, ego, and worldly attachments.",
    "iconName": "Zap",
    "angleDeg": -30,
    "system": "purva"
  },
  {
    "id": "purva-3",
    "iast": "Sannyāsa",
    "devanagari": "संन्यास",
    "interlockLabel": "Asceticism",
    "interlockBrief": "Renunciation",
    "interlockDetail": "The stage of life characterized by total renunciation of material desires.",
    "iconName": "Eye",
    "angleDeg": 30,
    "system": "purva"
  },
  {
    "id": "purva-4",
    "iast": "Parivartana",
    "devanagari": "परिवर्तन",
    "interlockLabel": "Transformation",
    "interlockBrief": "The Shift",
    "interlockDetail": "Radical, often painful transformation of the soul through intense experience.",
    "iconName": "RefreshCw",
    "angleDeg": 90,
    "system": "purva"
  },
  {
    "id": "purva-5",
    "iast": "Yajña",
    "devanagari": "यज्ञ",
    "interlockLabel": "Sacrifice",
    "interlockBrief": "The Offering",
    "interlockDetail": "Offering one's own ego into the fire of consciousness.",
    "iconName": "Heart",
    "angleDeg": 150,
    "system": "purva"
  },
  {
    "id": "purva-6",
    "iast": "Tīvratā",
    "devanagari": "तीव्रता",
    "interlockLabel": "Intensity",
    "interlockBrief": "The Focus",
    "interlockDetail": "Fierce, unyielding focus required to cross the threshold of spiritual awakening.",
    "iconName": "Target",
    "angleDeg": 210,
    "system": "purva"
  },

  // ==========================================
  // SYSTEM 3: UTTARA BHADRAPADA
  // ==========================================
  {
    "id": "uttara-center",
    "iast": "Uttara Bhādrapadā",
    "devanagari": "उत्तरभाद्रपदा",
    "interlockLabel": "The Latter Blessed Feet",
    "interlockBrief": "The Deep Foundation",
    "interlockDetail": "Uttara Bhādrapadā represents the cool, deep waters of wisdom that follow the fire, and the back legs of the funeral cot.",
    "isCenter": true,
    "system": "uttara"
  },
  {
    "id": "uttara-1",
    "iast": "Prajñā",
    "devanagari": "प्रज्ञा",
    "interlockLabel": "Wisdom",
    "interlockBrief": "True Knowing",
    "interlockDetail": "The deep, calm wisdom that emerges after the fiery transformation of Pūrva Bhādrapadā.",
    "iconName": "BookOpen",
    "angleDeg": -90,
    "system": "uttara"
  },
  {
    "id": "uttara-2",
    "iast": "Ādhāra",
    "devanagari": "आधार",
    "interlockLabel": "Foundation",
    "interlockBrief": "The Base",
    "interlockDetail": "Providing a solid, unshakeable foundation for spiritual growth and community.",
    "iconName": "Layers",
    "angleDeg": -30,
    "system": "uttara"
  },
  {
    "id": "uttara-3",
    "iast": "Śānti",
    "devanagari": "शान्ति",
    "interlockLabel": "Calmness",
    "interlockBrief": "Deep Peace",
    "interlockDetail": "The absolute stillness of the deep ocean, untouched by surface storms.",
    "iconName": "Feather",
    "angleDeg": 30,
    "system": "uttara"
  },
  {
    "id": "uttara-4",
    "iast": "Gahantā",
    "devanagari": "गहनता",
    "interlockLabel": "Depth",
    "interlockBrief": "The Ocean",
    "interlockDetail": "Profound emotional and spiritual depth, capable of holding the world's sorrow.",
    "iconName": "Droplet",
    "angleDeg": 90,
    "system": "uttara"
  },
  {
    "id": "uttara-5",
    "iast": "Mokṣa",
    "devanagari": "मोक्ष",
    "interlockLabel": "Liberation",
    "interlockBrief": "The Goal",
    "interlockDetail": "The final preparation for the soul's ultimate liberation from the cycle of rebirth.",
    "iconName": "Sun",
    "angleDeg": 150,
    "system": "uttara"
  },
  {
    "id": "uttara-6",
    "iast": "Dhairya",
    "devanagari": "धैर्य",
    "interlockLabel": "Patience",
    "interlockBrief": "The Virtue",
    "interlockDetail": "Endless patience, knowing that true transformation takes time to stabilize.",
    "iconName": "Clock",
    "angleDeg": 210,
    "system": "uttara"
  }
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    "slug": "s1",
    "question": "A disease that no one can diagnose is suddenly cured by a hidden, unconventional method involving extreme isolation.",
    "options": [
      {
        "id": "A",
        "label": "Śatabhiṣaj",
        "isCorrect": true,
        "explanation": "Śatabhiṣaj is the veiled healer of the 100 physicians, ruling over mysteries and isolation."
      },
      {
        "id": "B",
        "label": "Pūrva Bhādrapadā",
        "isCorrect": false,
        "explanation": "This nakshatra represents intense fiery penance, not hidden/veiled healing."
      },
      {
        "id": "C",
        "label": "Uttara Bhādrapadā",
        "isCorrect": false,
        "explanation": "This represents cool wisdom and deep foundation, not the '100 physicians'."
      }
    ]
  },
  {
    "slug": "s2",
    "question": "An ascetic endures intense, burning suffering and self-mortification to burn off karma and achieve a higher state of consciousness.",
    "options": [
      {
        "id": "A",
        "label": "Śatabhiṣaj",
        "isCorrect": false,
        "explanation": "Śatabhiṣaj is about healing and mysteries, not burning penance."
      },
      {
        "id": "B",
        "label": "Pūrva Bhādrapadā",
        "isCorrect": true,
        "explanation": "Pūrva Bhādrapadā represents the intense, burning fire of tapas and self-mortification."
      },
      {
        "id": "C",
        "label": "Uttara Bhādrapadā",
        "isCorrect": false,
        "explanation": "This nakshatra follows the fire; it represents the cool waters of wisdom after the penance is complete."
      }
    ]
  }
];
