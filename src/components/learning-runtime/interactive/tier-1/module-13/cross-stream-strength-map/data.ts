/**
 * Cross-Stream Strength Map — Data Engine
 *
 * §7 interactive for Lesson 13.6.3.
 *
 * Provides the four stream strength conceptions, the pañcavargīya
 * breakdown, and convergence/divergence scenarios.
 */

/* ─── The four streams and their strength conceptions ────────────────────── */

export interface StreamConception {
  key: string;
  name: string;
  nameDevanagari: string;
  color: string;
  strengthIAST: string;
  strengthDevanagari: string;
  strengthEnglish: string;
  description: string;
  unit: string;
  deepModule: string;
  deepModuleRef: string;
}

export const STREAMS: StreamConception[] = [
  {
    key: "parashari",
    name: "Parāśarī",
    nameDevanagari: "पाराशरी",
    color: "#356CAB",
    strengthIAST: "Ṣaḍbala + Bhāva Bala",
    strengthDevanagari: "षड्बलम् + भावबलम्",
    strengthEnglish: "Six-fold planet + house strength",
    description:
      "Ṣaḍbala (sthāna, dik, kāla, cheṣṭā, naisargika, dṛk) for planets; bhāva bala (lord + aspect + direction) for houses. Summed in virūpas → rūpas.",
    unit: "rūpas (÷60)",
    deepModule: "Module 13 (this module)",
    deepModuleRef: "tier-1/module-13",
  },
  {
    key: "kp",
    name: "KP",
    nameDevanagari: "कृष्णमूर्ति पद्धति",
    color: "#7A6B3E",
    strengthIAST: "Cuspal / Significator Strength",
    strengthDevanagari: "कस्पल / सिग्निफिकेटर बलम्",
    strengthEnglish: "Sub-lord based cusp strength",
    description:
      "Strength via the sub-lord — which planet's sub a cusp or significator falls in. Not measured in rūpas; judged by sub-lord placement and significator network.",
    unit: "sub-lord / significator",
    deepModule: "KP Stream Module",
    deepModuleRef: "tier-1/kp-stream",
  },
  {
    key: "jaimini",
    name: "Jaimini",
    nameDevanagari: "जैमिनी",
    color: "#A23A1E",
    strengthIAST: "Chara-kāraka + Rāśi/Argala",
    strengthDevanagari: "चरकारक + राश्यर्गल",
    strengthEnglish: "Dynamic kārakas + sign/aspect strength",
    description:
      "Planets graded by longitude into seven/eight chara-kārakas. Plus rāśi-based and argala-based strength unique to Jaimini's sign-centric logic.",
    unit: "kāraka rank / sign dignity",
    deepModule: "Jaimini Stream Module",
    deepModuleRef: "tier-1/jaimini-stream",
  },
  {
    key: "tajika",
    name: "Tājika",
    nameDevanagari: "ताजिक",
    color: "#3A8C5A",
    strengthIAST: "Pañcavargīya Bala",
    strengthDevanagari: "पञ्चवर्गीयबलम्",
    strengthEnglish: "Five-fold annual-chart strength",
    description:
      "Annual-chart (varṣaphala) strength. The five-fold pañcavargīya bala: kṣetra, uccha, hadda, drekkāṇa, navāṁśa — five divisional dignities summed.",
    unit: "pañcavargīya points",
    deepModule: "Module 19 (Tājika)",
    deepModuleRef: "tier-1/module-19",
  },
];

/* ─── Pañcavargīya components (Tājika five-fold) ─────────────────────────── */

export interface PancavargiyaComponent {
  key: string;
  nameIAST: string;
  nameDevanagari: string;
  english: string;
  description: string;
}

export const PANCVARGIYA: PancavargiyaComponent[] = [
  {
    key: "kshetra",
    nameIAST: "Kṣetra",
    nameDevanagari: "क्षेत्र",
    english: "Sign Dignity",
    description: "Strength from the planet's sign placement (mūlatrikona, own, friendly, etc.)",
  },
  {
    key: "uccha",
    nameIAST: "Uccha",
    nameDevanagari: "उच्च",
    english: "Exaltation",
    description: "Strength from exaltation degree proximity",
  },
  {
    key: "hadda",
    nameIAST: "Hadda",
    nameDevanagari: "हद्द",
    english: "Hadda Dignity",
    description: "Strength from the Tājika hadda (term) placement",
  },
  {
    key: "drekkana",
    nameIAST: "Drekkāṇa",
    nameDevanagari: "द्रेक्काण",
    english: "Drekkāṇa Dignity",
    description: "Strength from the drekkāṇa (1/3rd division) placement",
  },
  {
    key: "navamsa",
    nameIAST: "Navāṁśa",
    nameDevanagari: "नवांश",
    english: "Navāṁśa Dignity",
    description: "Strength from the navāṁśa (D-9) placement",
  },
];

/* ─── Convergence / divergence scenarios ─────────────────────────────────── */

export interface Scenario {
  label: string;
  description: string;
  streamsAgree: string[];
  result: string;
  resultColor: string;
  icon: "converge" | "diverge";
}

export const SCENARIOS: Scenario[] = [
  {
    label: "Convergence",
    description: "Ṣaḍbala says Jupiter is strong AND Tājika's pañcavargīya bala agrees in the year-chart.",
    streamsAgree: ["parashari", "tajika"],
    result: "Higher confidence — both systems point the same way.",
    resultColor: "#2F7D55",
    icon: "converge",
  },
  {
    label: "Divergence",
    description: "Ṣaḍbala says Mars is strong, but KP's cuspal sub-lord makes it a weak significator for the same matter.",
    streamsAgree: [],
    result: "Tension informs the reading — something subtle is in play. Cross-validate.",
    resultColor: "#C8841E",
    icon: "diverge",
  },
];

/* ─── Presets (worked examples from §6) ──────────────────────────────────── */

export interface Preset {
  label: string;
  description: string;
  streamKey: string;
  takeaway: string;
}

export const PRESETS: Preset[] = [
  {
    label: "Parāśarī",
    description: "How strong is Mars? → compute its ṣaḍbala.",
    streamKey: "parashari",
    takeaway: "The six-fold measure.",
  },
  {
    label: "KP",
    description: "Will the 7th deliver? → check the cuspal sub-lord.",
    streamKey: "kp",
    takeaway: "Sub-lord strength, not rūpas.",
  },
  {
    label: "Convergence",
    description: "Ṣaḍbala AND Tājika agree → higher confidence.",
    streamKey: "tajika",
    takeaway: "Convergence builds confidence.",
  },
];
