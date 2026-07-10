/**
 * Kemadruma + Sade Sati Recap -- Data Engine
 *
 * Section 7 interactive for Lesson 14.6.5
 * (Kemadruma and Sade Sati Revisited for Completeness).
 *
 * Brings both doṣas into one recap surface with cancellations,
 * phases, and the de-fearmongering discipline.
 */

/* --- Kemadruma --- */

export interface KemadrumaResult {
  hasKemadruma: boolean;
  moonHouse: number;
  h2Empty: boolean;
  h12Empty: boolean;
  cancelled: boolean;
  cancellationMet: string[];
  severity: "none" | "structural" | "cancelled";
  severityLabel: string;
  severityColor: string;
  note: string;
}

export interface KSCancellation {
  key: string;
  label: string;
}

export const KEMADRUMA_CANCELLATIONS: KSCancellation[] = [
  { key: "kendra-lagna", label: "A planet (other than Sun) in a kendra (1/4/7/10) from lagna" },
  { key: "kendra-moon", label: "A planet (other than Sun) in a kendra from the Moon" },
  { key: "conjunct-moon", label: "The Moon conjunct a non-Sun planet" },
  { key: "aspected-moon", label: "The Moon aspected by a benefic (or non-Sun graha)" },
  { key: "dignified-moon", label: "The Moon in own sign / exaltation / otherwise strong" },
];

export function checkKemadruma(
  moonHouse: number,
  planetInH2: boolean,
  planetInH12: boolean,
  cancellationKeys: string[],
): KemadrumaResult {
  const h2 = moonHouse === 12 ? 1 : moonHouse + 1;
  const h12 = moonHouse === 1 ? 12 : moonHouse - 1;
  const h2Empty = !planetInH2;
  const h12Empty = !planetInH12;
  const hasKemadruma = h2Empty && h12Empty;
  const cancelled = cancellationKeys.length > 0;

  let severity: KemadrumaResult["severity"] = "none";
  let severityLabel = "No Kemadruma";
  let severityColor = "#2F7D55";
  let note = "";

  if (!hasKemadruma) {
    severity = "none";
    severityLabel = "No Kemadruma -- 2nd or 12th from Moon occupied";
    severityColor = "#2F7D55";
    note = `Moon in H${moonHouse}. H${h2} or H${h12} has a planet -- Kemadruma does not form.`;
  } else if (cancelled) {
    severity = "cancelled";
    severityLabel = "Structural Kemadruma -- CANCELLED";
    severityColor = "#2F7D55";
    note = `Moon in H${moonHouse}. Both H${h2} and H${h12} are empty, but ${cancellationKeys.length} cancellation(s) apply. Most charts cancel.`;
  } else {
    severity = "structural";
    severityLabel = "Structural Kemadruma -- uncancelled";
    severityColor = "#A23A1E";
    note = `Moon in H${moonHouse}. Both H${h2} and H${h12} are empty with no cancellation. Rare. Frame as self-reliance, never doom.`;
  }

  return {
    hasKemadruma,
    moonHouse,
    h2Empty,
    h12Empty,
    cancelled,
    cancellationMet: cancellationKeys,
    severity,
    severityLabel,
    severityColor,
    note,
  };
}

/* --- Sade Sati --- */

export type SadeSatiPhase = "none" | "rising" | "peak" | "setting";

export interface SadeSatiResult {
  moonHouse: number;
  saturnHouse: number;
  phase: SadeSatiPhase;
  phaseLabel: string;
  phaseColor: string;
  phaseDetail: string;
  inSadeSati: boolean;
  notes: string[];
}

export function checkSadeSati(moonHouse: number, saturnHouse: number): SadeSatiResult {
  const h12fromMoon = moonHouse === 1 ? 12 : moonHouse - 1;
  const h1fromMoon = moonHouse;
  const h2fromMoon = moonHouse === 12 ? 1 : moonHouse + 1;

  let phase: SadeSatiPhase = "none";
  let phaseLabel = "No Sade Sati";
  let phaseColor = "#2F7D55";
  let phaseDetail = "";
  const notes: string[] = [];

  if (saturnHouse === h12fromMoon) {
    phase = "rising";
    phaseLabel = "Rising phase (Vyaya)";
    phaseColor = "#3B82F6";
    phaseDetail = `Saturn transits H${saturnHouse} -- the 12th from Moon (H${moonHouse}). The ~2.5-year rising / vyaya phase. Losses, endings, clearing.`;
    notes.push("Rising phase: often the most externally disruptive. Things fall away.");
  } else if (saturnHouse === h1fromMoon) {
    phase = "peak";
    phaseLabel = "Peak phase (Janma)";
    phaseColor = "#8B5CF6";
    phaseDetail = `Saturn transits H${saturnHouse} -- directly over the Moon sign (H${moonHouse}). The ~2.5-year peak / janma phase. Identity pressure, maturation.`;
    notes.push("Peak phase: Saturn on the natal Moon. Emotional pressure, endurance building.");
  } else if (saturnHouse === h2fromMoon) {
    phase = "setting";
    phaseLabel = "Setting phase (Dhana)";
    phaseColor = "#C8841E";
    phaseDetail = `Saturn transits H${saturnHouse} -- the 2nd from Moon (H${moonHouse}). The ~2.5-year setting / dhana phase. Rebuilding, consolidation.`;
    notes.push("Setting phase: lessons integrate. Resources and relationships restructure.");
  } else {
    phase = "none";
    phaseLabel = "No Sade Sati";
    phaseColor = "#2F7D55";
    phaseDetail = `Saturn in H${saturnHouse} -- not in the 12th, 1st, or 2nd from Moon (H${moonHouse}). No Sade Sati.`;
    notes.push("Saturn is outside the Sade Sati window.");
  }

  const inSadeSati = phase !== "none";

  if (inSadeSati) {
    notes.push("Sade Sati is maturation, not doom. Texture varies by Saturn's dignity and Moon's strength.");
    notes.push("Check Module 11 for full phase analysis, mitigations, and communication discipline.");
  }

  return { moonHouse, saturnHouse, phase, phaseLabel, phaseColor, phaseDetail, inSadeSati, notes };
}

/* --- Presets --- */

export interface Preset {
  key: string;
  label: string;
  moonHouse: number;
  planetInH2: boolean;
  planetInH12: boolean;
  cancellationKeys: string[];
  saturnHouse: number;
}

export const PRESETS: Preset[] = [
  {
    key: "kemadruma-cancelled",
    label: "Kemadruma cancelled",
    moonHouse: 1,
    planetInH2: false,
    planetInH12: false,
    cancellationKeys: ["kendra-lagna", "dignified-moon"],
    saturnHouse: 5,
  },
  {
    key: "kemadruma-uncancelled",
    label: "Kemadruma uncancelled",
    moonHouse: 5,
    planetInH2: false,
    planetInH12: false,
    cancellationKeys: [],
    saturnHouse: 7,
  },
  {
    key: "sade-sati-peak",
    label: "Sade Sati peak",
    moonHouse: 4,
    planetInH2: true,
    planetInH12: false,
    cancellationKeys: [],
    saturnHouse: 4,
  },
  {
    key: "both-clear",
    label: "Both clear",
    moonHouse: 7,
    planetInH2: true,
    planetInH12: true,
    cancellationKeys: [],
    saturnHouse: 10,
  },
];
