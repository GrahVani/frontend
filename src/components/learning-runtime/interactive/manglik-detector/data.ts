/**
 * Manglik Detector — Data Engine
 *
 * §7 interactive for Lesson 14.6.1 (Manglik / Kuja-Doṣa Defined).
 *
 * Flags Mars from lagna, Moon, and Venus with house-set variation.
 */

export const MANGLIK_HOUSES_FULL = [1, 2, 4, 7, 8, 12];
export const MANGLIK_HOUSES_NO_2ND = [1, 4, 7, 8, 12];

export function getDistance(from: number, to: number): number {
  const d = ((to - from + 12) % 12);
  return d === 0 ? 12 : d;
}

export function isManglikFrom(marsHouse: number, referenceHouse: number, include2nd: boolean): boolean {
  const distance = getDistance(referenceHouse, marsHouse);
  const houses = include2nd ? MANGLIK_HOUSES_FULL : MANGLIK_HOUSES_NO_2ND;
  return houses.includes(distance);
}

export interface ReferenceResult {
  point: string;
  house: number;
  flagged: boolean;
  manglikHouses: number[];
}

export interface ManglikResult {
  flaggedCount: number;
  severity: "none" | "mild" | "moderate" | "strong";
  severityLabel: string;
  severityColor: string;
  references: ReferenceResult[];
  notes: string[];
}

export function checkManglik(
  marsHouse: number,
  moonHouse: number,
  venusHouse: number,
  include2nd: boolean,
): ManglikResult {
  const refLagna = isManglikFrom(marsHouse, 1, include2nd);
  const refMoon = isManglikFrom(marsHouse, moonHouse, include2nd);
  const refVenus = isManglikFrom(marsHouse, venusHouse, include2nd);

  const houses = include2nd ? MANGLIK_HOUSES_FULL : MANGLIK_HOUSES_NO_2ND;

  const references: ReferenceResult[] = [
    {
      point: "Lagna",
      house: 1,
      flagged: refLagna,
      manglikHouses: houses.map((h) => h),
    },
    {
      point: "Moon",
      house: moonHouse,
      flagged: refMoon,
      manglikHouses: houses.map((h) => {
        const target = moonHouse + h - 1;
        return target > 12 ? target - 12 : target;
      }),
    },
    {
      point: "Venus",
      house: venusHouse,
      flagged: refVenus,
      manglikHouses: houses.map((h) => {
        const target = venusHouse + h - 1;
        return target > 12 ? target - 12 : target;
      }),
    },
  ];

  const flaggedCount = references.filter((r) => r.flagged).length;

  let severity: ManglikResult["severity"] = "none";
  let severityLabel = "Not Manglik";
  let severityColor = "#2F7D55";
  const notes: string[] = [];

  if (flaggedCount === 0) {
    severity = "none";
    severityLabel = "Not Manglik";
    severityColor = "#2F7D55";
    notes.push("Mars is not in a Manglik house from any of the three reference points.");
  } else if (flaggedCount === 1) {
    severity = "mild";
    severityLabel = "Mild — one reference point";
    severityColor = "#C8841E";
    notes.push("Flagged from one reference point only. This is the mildest form of Kuja-Doṣa.");
    notes.push("Many traditions weigh multiple reference points — a single flag is less concerning.");
  } else if (flaggedCount === 2) {
    severity = "moderate";
    severityLabel = "Moderate — two reference points";
    severityColor = "#C8841E";
    notes.push("Flagged from two reference points. The pattern is consistent across the chart.");
    notes.push("Check cancellations (next lesson) before drawing conclusions.");
  } else {
    severity = "strong";
    severityLabel = "Strong — all three reference points";
    severityColor = "#A23A1E";
    notes.push("Flagged from lagna, Moon, and Venus. The Kuja-Doṣa pattern is pronounced.");
    notes.push("Even so, 15+ classical cancellations may apply. Never read Manglik as doom.");
  }

  if (include2nd && flaggedCount > 0) {
    const wouldStillFlag = references.filter((r) => isManglikFrom(marsHouse, r.house, false)).length;
    if (wouldStillFlag < flaggedCount) {
      notes.push(`Without the 2nd-house rule, only ${wouldStillFlag} reference point${wouldStillFlag === 1 ? "" : "s"} would flag it. The 2nd-house inclusion varies by tradition.`);
    }
  }

  return { flaggedCount, severity, severityLabel, severityColor, references, notes };
}

/* ─── Presets ────────────────────────────────────────────────────────────── */

export interface Preset {
  key: string;
  label: string;
  marsHouse: number;
  moonHouse: number;
  venusHouse: number;
  include2nd: boolean;
}

export const PRESETS: Preset[] = [
  {
    key: "lagna-only",
    label: "Mild: lagna only",
    marsHouse: 7,
    moonHouse: 5,
    venusHouse: 9,
    include2nd: true,
  },
  {
    key: "two-points",
    label: "Moderate: two points",
    marsHouse: 8,
    moonHouse: 1,
    venusHouse: 3,
    include2nd: true,
  },
  {
    key: "all-three",
    label: "Strong: all three",
    marsHouse: 1,
    moonHouse: 1,
    venusHouse: 1,
    include2nd: true,
  },
  {
    key: "2nd-variation",
    label: "2nd-house variation",
    marsHouse: 2,
    moonHouse: 5,
    venusHouse: 9,
    include2nd: true,
  },
  {
    key: "not-manglik",
    label: "Not Manglik",
    marsHouse: 3,
    moonHouse: 5,
    venusHouse: 9,
    include2nd: true,
  },
];
