export interface StreamProfile {
  id: string;
  name: string;
  devanagari: string;
  keyUsage: string;
  resolution: number; // 0 to 100
  color: "amber" | "rose" | "emerald" | "red" | "violet";
  iconName: "BookOpen" | "Layers" | "Target" | "ShieldAlert" | "Compass";
  coreFocus: string;
  keyTechniques: string[];
  targetModule: string;
  linkText: string;
}

export interface RecapNode {
  chapter: string;
  title: string;
  description: string;
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export const STREAMS_DATA: StreamProfile[] = [
  {
    id: "parashari",
    name: "Parāśari",
    devanagari: "पारशरि",
    keyUsage: "Vimśottarī daśā mapping, Janma-nakṣatra details, foundational muhūrta, and padas.",
    resolution: 75,
    color: "amber",
    iconName: "BookOpen",
    coreFocus: "Broad and foundational. The planet's placement in a nakṣatra determines its Vimśottarī daśā ruler, which governs the timing of life events. Per-nakṣatra attributes (deity, planet, shakti) color the planet's expression.",
    keyTechniques: [
      "Vimśottarī Daśā (based on Janma-nakṣatra longitude)",
      "Nakṣatra padas mapping to Navāṁśa divisions",
      "Muhūrta election (using Nakṣatra qualities like Dhruva, Kṣipra)"
    ],
    targetModule: "Module 8 (Aspects) & Module 9 (Navāṁśa)",
    linkText: "Explore Module 9 (Navāṁśa)"
  },
  {
    id: "jaimini",
    name: "Jaimini",
    devanagari: "जैमिनि",
    keyUsage: "Indirect emphasis: padas determine Navāṁśa sign placement for Arūḍha and Kāraka schemes.",
    resolution: 50,
    color: "rose",
    iconName: "Layers",
    coreFocus: "Pada-centric. Jaimini focuses heavily on sign-based daśās (e.g. Cara daśā) and planetary kārakas. Nakṣatras are utilized primarily as structural stepping stones—how a planet's exact nakṣatra quarter (pada) projects into the Navāṁśa wheel.",
    keyTechniques: [
      "Pada divisions (3°20') mapping to sign blocks",
      "Ārūḍha Pada calculations (using house divisions)",
      "Cara Kāraka degree sequencing (using sign/pada longitudes)"
    ],
    targetModule: "Module 9 (Navāṁśa) & Module 15 (Jaimini Fundamentals)",
    linkText: "Explore Module 15 (Jaimini)"
  },
  {
    id: "kp",
    name: "KP (Krishnamurti Paddhati)",
    devanagari: "कृष्णमूर्तिपद्धति",
    keyUsage: "Ultra-central: the star lord and sub-lord chain defines the entire predictive engine.",
    resolution: 95,
    color: "emerald",
    iconName: "Target",
    coreFocus: "Nakṣatra-central. The 13°20' nakṣatra is subdivided into 9 unequal sub-divisions based on the Vimśottarī daśā year ratios. Prediction is driven by the Star-Lord and Sub-Lord, pinpointing exact event fructification.",
    keyTechniques: [
      "Star-Lord (Constellation ruler)",
      "Sub-Lord (Vimśottarī ratio subdivision)",
      "Cuspal Sub-Lord (determines house strength and event fructification)"
    ],
    targetModule: "Module 16 (KP Prediction)",
    linkText: "Explore Module 16 (KP)"
  },
  {
    id: "lalkitab",
    name: "Lal Kitab",
    devanagari: "लाल किताब",
    keyUsage: "Minimal use. Focuses on house-rāśi relationships and planetary combinations.",
    resolution: 10,
    color: "red",
    iconName: "ShieldAlert",
    coreFocus: "House & planet-focused. Lal Kitab is a distinct Persian-influenced school of remedies. It largely bypasses the nakṣatras, placing absolute focus on planets residing in specific houses and their mutual aspect rules.",
    keyTechniques: [
      "Planetary combinations (Dharmi teva, Soye graha)",
      "House-to-house aspects (drishthi rules)",
      "Remedial actions based on house placements"
    ],
    targetModule: "Module 20 (Lal Kitab System)",
    linkText: "Explore Module 20 (Lal Kitab)"
  },
  {
    id: "tajika",
    name: "Tājika",
    devanagari: "ताजिक",
    keyUsage: "Used in annual chart timing: Janma-tārā cycles and annual selection rules.",
    resolution: 40,
    color: "violet",
    iconName: "Compass",
    coreFocus: "Annual & timing-centric. Primarily used in Varṣaphala (solar return chart). The Janma-nakṣatra is used to calculate the annual tārā-bala cycle and evaluate the strength of the Munthā (progressed ascendant) for that year.",
    keyTechniques: [
      "Munthā annual calculations",
      "Varṣeśa (Year-Lord) selection",
      "Annual Tārā-bala cycles (based on natal Janma)"
    ],
    targetModule: "Module 19 (Tājika & Annual Charts)",
    linkText: "Explore Module 19 (Tājika)"
  }
];

export const RECAP_NODES: RecapNode[] = [
  {
    chapter: "Chapter 1",
    title: "Foundations",
    description: "Introduced Nakṣatras (13°20' segments), the 12-attribute template, and major classifications like gaṇa, yoni, and gaṇḍānta."
  },
  {
    chapter: "Chapters 2-5",
    title: "The 27 Profiles",
    description: "Deep dive into each of the 27 nakṣatras (Aśvinī to Revatī) to study their deities, symbols, and psychological profiles."
  },
  {
    chapter: "Chapter 6, L1-L2",
    title: "Padas & Navāṁśa",
    description: "Defined the 3°20' quarters (padas) and the 108-pada Navāṁśa bridge connecting nakṣatras to rāśis."
  },
  {
    chapter: "Chapter 6, L3",
    title: "KP Sub-Divisions",
    description: "Explored the 249 sub-division system of KP, showing how nakṣatras are cut using Vimśottarī ratios."
  },
  {
    chapter: "Chapter 6, L4",
    title: "Tārā-Bala & Kūṭas",
    description: "Applied the 9-tārā cycle for daily timing and the Aṣṭa-Kūṭa scoring system for marital compatibility."
  },
  {
    chapter: "Chapter 6, L5",
    title: "Cross-Stream Capstone",
    description: "Synthesized how each stream uses nakṣatras at different resolutions, closing Module 7."
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: "A client wants to select an auspicious wedding date (Muhūrta). Which application of Nakṣatras is most critical here, and which stream does it primarily belong to?",
    options: [
      "KP Sub-Lord analysis (KP stream)",
      "Tārā-Bala and Aṣṭa-Kūṭa check (Parāśari / Muhūrta streams)",
      "Cara Kāraka sequencing (Jaimini stream)",
      "Planet-in-house aspect rules (Lal Kitab stream)"
    ],
    answerIndex: 1,
    explanation: "Tārā-bala (strength of transit moon relative to natal moon) and Aṣṭa-Kūṭa compatibility are the standard classical tools for marriage compatibility and electional timing (Muhūrta), rooted in Parāśari and Muhūrta traditions. KP subs are for horary/predictive timing, while Jaimini is sign-focused, and Lal Kitab ignores nakṣatras."
  },
  {
    id: 2,
    scenario: "In Krishnamurti Paddhati (KP), how is the resolution of a Nakṣatra (13°20') enhanced to make precise timing predictions?",
    options: [
      "By dividing it into 4 equal quarters (padas) of 3°20' each.",
      "By mapping it directly to the 12 signs of the Zodiac.",
      "By subdividing it into 9 unequal parts (subs) proportional to Vimśottarī year ratios.",
      "By ignoring it in favor of the annual Varṣaphala return."
    ],
    answerIndex: 2,
    explanation: "KP's unique predictive power comes from dividing the 13°20' nakṣatra into 9 unequal subdivisions (sub-lords) whose spans are proportional to the years assigned to each planet in the 120-year Vimśottarī Daśā cycle."
  },
  {
    id: 3,
    scenario: "Which of the following correctly pairs a Jyotiṣa stream with its typical nakṣatra resolution and application?",
    options: [
      "Lal Kitab — High resolution (sub-lord chain)",
      "Jaimini — Pada-based resolution (Navāṁśa projection)",
      "KP — Low resolution (ignores nakṣatras)",
      "Tājika — Core foundation (Vimśottarī daśā sequencing)"
    ],
    answerIndex: 1,
    explanation: "Jaimini uses the nakṣatras at the pada level (3°20') primarily to project planet positions into the Navāṁśa (divisional chart) to identify the Ārūḍha and Kārakas. KP has ultra-high resolution (subs), Lal Kitab has minimal, and Parāśari uses Vimśottarī daśās."
  }
];
