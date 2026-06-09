/**
 * Pitṛ-Doṣa Indicator -- Data Engine
 *
 * Section 7 interactive for Lesson 14.6.4 (Pitṛ-Doṣa Defined and Remedial Framework).
 *
 * Surfaces chart signatures and the remedial framework with honest limits.
 */

export interface SignatureResult {
  key: string;
  label: string;
  met: boolean;
  detail: string;
  weight: "primary" | "corroborating";
}

export interface PitrResult {
  signatures: SignatureResult[];
  primaryCount: number;
  corroboratingCount: number;
  severity: "none" | "mild" | "moderate" | "strong";
  severityLabel: string;
  severityColor: string;
  notes: string[];
}

export function checkPitrDosha(
  sunHouse: number,
  rahuHouse: number,
  saturnHouse: number,
  ninthHouse: number,
  ninthLordHouse: number,
  ketuWithNinthLord: boolean,
  maleficsInNinth: boolean,
  fatherDifficulties: boolean,
): PitrResult {
  const sunRahuConjunct = sunHouse === rahuHouse;
  const sunSaturnConjunct = sunHouse === saturnHouse;
  const sunSaturnAspect = Math.abs(sunHouse - saturnHouse) === 6 || Math.abs(sunHouse - saturnHouse) === 0;
  const sunInNinth = sunHouse === 9;
  const ninthLordWithNode = ketuWithNinthLord || ninthLordHouse === rahuHouse;

  const signatures: SignatureResult[] = [
    {
      key: "sun-rahu",
      label: "Sun afflicted by Rahu (conjunction)",
      met: sunRahuConjunct,
      detail: sunRahuConjunct
        ? `Sun H${sunHouse} + Rahu H${rahuHouse} -- conjunction ✓`
        : `Sun H${sunHouse}, Rahu H${rahuHouse} -- not conjunct`,
      weight: "primary",
    },
    {
      key: "sun-saturn",
      label: "Sun afflicted by Saturn (conjunction or aspect)",
      met: sunSaturnConjunct || sunSaturnAspect,
      detail: sunSaturnConjunct
        ? `Sun H${sunHouse} + Saturn H${saturnHouse} -- conjunction ✓`
        : sunSaturnAspect
          ? `Sun H${sunHouse}, Saturn H${saturnHouse} -- 7th aspect ✓`
          : `Sun H${sunHouse}, Saturn H${saturnHouse} -- no conjunction or aspect`,
      weight: "primary",
    },
    {
      key: "sun-in-ninth",
      label: "Sun in the 9th house (especially with nodes)",
      met: sunInNinth,
      detail: sunInNinth
        ? `Sun in H9 -- primary pitr house ✓${sunRahuConjunct ? " (with Rahu)" : ""}`
        : `Sun in H${sunHouse} -- not in 9th`,
      weight: "primary",
    },
    {
      key: "ninth-afflicted",
      label: "9th house heavily afflicted (malefics present)",
      met: maleficsInNinth,
      detail: maleficsInNinth
        ? "Malefics in the 9th house -- house of dharma/father afflicted ✓"
        : "9th house condition -- no major malefic presence flagged",
      weight: "corroborating",
    },
    {
      key: "ninth-lord-node",
      label: "9th lord conjunct Rahu / Ketu",
      met: ninthLordWithNode,
      detail: ninthLordWithNode
        ? `9th lord with node -- conjunction ✓`
        : `9th lord H${ninthLordHouse} -- not with node`,
      weight: "corroborating",
    },
    {
      key: "life-corroboration",
      label: "Corroborating father-related difficulties in life",
      met: fatherDifficulties,
      detail: fatherDifficulties
        ? "Life history corroborates -- father/ancestral difficulties noted ✓"
        : "No corroborating life difficulty flagged",
      weight: "corroborating",
    },
  ];

  const primaryCount = signatures.filter((s) => s.met && s.weight === "primary").length;
  const corroboratingCount = signatures.filter((s) => s.met && s.weight === "corroborating").length;
  const totalMet = primaryCount + corroboratingCount;

  let severity: PitrResult["severity"] = "none";
  let severityLabel = "No Pitṛ-Doṣa signatures";
  let severityColor = "#2F7D55";
  const notes: string[] = [];

  if (totalMet === 0) {
    severity = "none";
    severityLabel = "No Pitṛ-Doṣa signatures";
    severityColor = "#2F7D55";
    notes.push("None of the common Pitṛ-Doṣa signatures are present on this chart.");
  } else if (primaryCount >= 2) {
    severity = "strong";
    severityLabel = "Strong -- multiple primary signatures";
    severityColor = "#A23A1E";
    notes.push("Multiple primary signatures present. The pitr pattern is pronounced.");
    notes.push("Even so, handle without fatalism -- remedies are acts of remembrance, not fear-relief.");
  } else if (primaryCount === 1 && corroboratingCount >= 1) {
    severity = "moderate";
    severityLabel = "Moderate -- primary + corroboration";
    severityColor = "#C8841E";
    notes.push("One primary signature with corroboration. The pattern is present and worth noting.");
    notes.push("Frame constructively -- ancestral repair, not doom.");
  } else if (primaryCount === 1) {
    severity = "mild";
    severityLabel = "Mild -- single primary signature";
    severityColor = "#C8841E";
    notes.push("A single primary signature. Mention as a background pattern, not a dominant force.");
  } else {
    severity = "mild";
    severityLabel = "Mild -- corroboration only";
    severityColor = "#8A7E5E";
    notes.push("Only corroborating signatures. Very mild pattern -- mention in passing.");
  }

  return { signatures, primaryCount, corroboratingCount, severity, severityLabel, severityColor, notes };
}

/* --- Remedial framework --- */

export interface RemedyItem {
  key: string;
  label: string;
  detail: string;
  source: string;
}

export const REMEDIES: RemedyItem[] = [
  {
    key: "shraddha",
    label: "Śrāddha (ancestral rites)",
    detail: "Performed especially during Pitṛ Pakṣa / Mahālaya. Acts of remembrance and nourishment for the departed.",
    source: "Smṛti / Purāṇic tradition",
  },
  {
    key: "pinda",
    label: "Pind-dāna at sacred sites",
    detail: "Offerings at Gayā or Kāśī -- the classical loci for ancestral liberation rites.",
    source: "Purāṇic tradition",
  },
  {
    key: "service",
    label: "Service to elders",
    detail: "Care of the living lineage -- honouring parents, grandparents, and teachers while they live.",
    source: "Dharma-śāstra / smṛti",
  },
  {
    key: "sun",
    label: "Sun-strengthening practices",
    detail: "Sūrya Namaskāra, Aditya Hṛdayam, generosity, ethical leadership. (Module 15 develops remedies.)",
    source: "Graha-shānti / yoga tradition",
  },
];

/* --- Presets --- */

export interface Preset {
  key: string;
  label: string;
  sunHouse: number;
  rahuHouse: number;
  saturnHouse: number;
  ninthLordHouse: number;
  ketuWithNinthLord: boolean;
  maleficsInNinth: boolean;
  fatherDifficulties: boolean;
}

export const PRESETS: Preset[] = [
  {
    key: "strong",
    label: "Strong: Sun+Rahu in 9th",
    sunHouse: 9,
    rahuHouse: 9,
    saturnHouse: 3,
    ninthLordHouse: 9,
    ketuWithNinthLord: true,
    maleficsInNinth: true,
    fatherDifficulties: true,
  },
  {
    key: "moderate",
    label: "Moderate: Sun+Saturn",
    sunHouse: 1,
    rahuHouse: 5,
    saturnHouse: 1,
    ninthLordHouse: 3,
    ketuWithNinthLord: false,
    maleficsInNinth: true,
    fatherDifficulties: true,
  },
  {
    key: "mild",
    label: "Mild: 9th lord with node",
    sunHouse: 5,
    rahuHouse: 7,
    saturnHouse: 11,
    ninthLordHouse: 9,
    ketuWithNinthLord: true,
    maleficsInNinth: false,
    fatherDifficulties: false,
  },
  {
    key: "none",
    label: "No signatures",
    sunHouse: 5,
    rahuHouse: 7,
    saturnHouse: 11,
    ninthLordHouse: 3,
    ketuWithNinthLord: false,
    maleficsInNinth: false,
    fatherDifficulties: false,
  },
];
