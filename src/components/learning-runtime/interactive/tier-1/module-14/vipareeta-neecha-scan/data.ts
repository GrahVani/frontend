/**
 * Vipareeta-Neecha Scan — Data Engine
 *
 * §7 interactive for Lesson 14.5.4 (Worked Example: Vipareeta and Neecha-Bhaṅga).
 *
 * Fixed Aries-lagna chart with Saturn debilitated H1, Sun H4 (exalted-in-Aries),
 * Mercury (6L) H8. Checks neecha-bhaṅga + Harṣa Vipareeta.
 */

export type StrengthLevel = "strong" | "moderate" | "weak";
export type TimingLevel = "active" | "moderate" | "quiet";

export const LAGNA_SIGN = 1; // Aries

export interface ChartPlacement {
  planet: string;
  short: string;
  house: number;
  sign: number;
  signName: string;
  grahaSlug: string;
  note?: string;
}

export const FIXED_CHART: ChartPlacement[] = [
  { planet: "Saturn", short: "Sa", house: 1, sign: 1, signName: "Meṣa", grahaSlug: "shani", note: "Debilitated" },
  { planet: "Sun", short: "Su", house: 4, sign: 4, signName: "Karkaṭa", grahaSlug: "surya", note: "Exalted in Aries" },
  { planet: "Mercury", short: "Me", house: 8, sign: 8, signName: "Vṛścika", grahaSlug: "budha", note: "6th lord" },
];

/* ─── House helpers ──────────────────────────────────────────────────────── */

export const KENDRA_HOUSES = [1, 4, 7, 10];
export const DUSTHANAS = [6, 8, 12];

export function isKendra(house: number): boolean {
  return KENDRA_HOUSES.includes(house);
}

export function isDusthana(house: number): boolean {
  return DUSTHANAS.includes(house);
}

export function getDistance(from: number, to: number): number {
  const d = ((to - from + 12) % 12);
  return d === 0 ? 12 : d;
}

/* ─── Neecha-bhaṅga check for this chart ─────────────────────────────────── */

export interface NeechaCondition {
  number: number;
  label: string;
  met: boolean;
  detail: string;
  isKeyCondition: boolean; // the one that actually works on this chart
  isFalseClaim?: boolean; // the common mistake condition
}

export interface NeechaResult {
  cancelled: boolean;
  conditions: NeechaCondition[];
  verdict: "no-cancellation" | "neutralised" | "raja-yoga";
  verdictLabel: string;
  verdictColor: string;
  notes: string[];
}

export function checkNeechaBhanga(
  sunHouse: number,
  saturnHouse: number,
  saturnStrength: StrengthLevel,
  testFalseAspect: boolean,
): NeechaResult {
  // For this fixed chart:
  // Saturn debilitated in Aries (H1)
  // Sun is exalted in Aries → Sun in H4 (kendra) = condition 2
  // Sun aspects only 7th → 7th-from-H4 = H10, NOT H1

  const cond1 = false; // Mars (dispositor of Aries) not in kendra on this chart
  const cond2 = isKendra(sunHouse); // Sun (exalted in Aries) in kendra
  const cond3FalseClaim = testFalseAspect; // The common false claim: "Sun aspects Saturn"
  const actualAspect = getDistance(sunHouse, saturnHouse) === 7; // Real aspect check
  const cond3Actual = actualAspect; // Does Sun actually aspect Saturn?
  const cond4 = false; // Sun not conjunct Saturn
  const cond5 = false; // Dispositor and exalted planet not in mutual kendras

  const conditions: NeechaCondition[] = [
    {
      number: 1,
      label: "Dispositor (Mars) in kendra from lagna/Moon",
      met: cond1,
      detail: "Mars not placed in a kendra on this chart.",
      isKeyCondition: false,
    },
    {
      number: 2,
      label: "Exalted planet (Sun) in kendra from lagna/Moon",
      met: cond2,
      detail: `Sun in H${sunHouse} — ${isKendra(sunHouse) ? "kendra ✓" : "not kendra"}`,
      isKeyCondition: true,
    },
    {
      number: 3,
      label: "Debilitated planet aspected by dispositor or exalted planet",
      met: cond3Actual,
      detail: cond3Actual
        ? "Sun aspects Saturn — true aspect."
        : `Sun in H${sunHouse} aspects H${sunHouse + 6 > 12 ? sunHouse + 6 - 12 : sunHouse + 6} (7th from Sun), not H${saturnHouse}. No aspect.`,
      isKeyCondition: false,
      isFalseClaim: false,
    },
    {
      number: 3,
      label: "[FALSE CLAIM] Sun in 4th aspects Saturn in 1st",
      met: testFalseAspect && cond3FalseClaim && !actualAspect,
      detail: testFalseAspect
        ? "This is a common mistake! The Sun aspects only the 7th — H4's 7th is H10, not H1."
        : "Toggle 'Test false aspect claim' above to see this mistake demonstrated.",
      isKeyCondition: false,
      isFalseClaim: true,
    },
    {
      number: 4,
      label: "Debilitated planet conjunct dispositor or exalted planet",
      met: cond4,
      detail: "Saturn H1 and Sun H4 — not conjunct.",
      isKeyCondition: false,
    },
    {
      number: 5,
      label: "Dispositor and exalted planet in mutual kendras",
      met: cond5,
      detail: "Not applicable on this chart.",
      isKeyCondition: false,
    },
  ];

  const cancelled = conditions.some((c) => c.met && !c.isFalseClaim);

  let verdict: NeechaResult["verdict"] = "no-cancellation";
  let verdictLabel = "No cancellation — debility remains full.";
  let verdictColor = "#A23A1E";
  const notes: string[] = [];

  if (cancelled) {
    const strong = saturnStrength === "strong";
    if (strong) {
      verdict = "raja-yoga";
      verdictLabel = "Neecha-bhaṅga — debility cancelled.";
      verdictColor = "#2F7D55"; // green
      notes.push("Sun (exalted in Aries) sits in a kendra (H4) — this alone cancels Saturn's debilitation.");
      notes.push("Saturn has decent strength; the redeemed planet can deliver meaningful results in its daśā.");
    } else {
      verdict = "neutralised";
      verdictLabel = "Debility neutralised — harm is cancelled.";
      verdictColor = "#C8841E"; // amber
      notes.push("The debilitation is undone by the Sun's kendra placement, but Saturn's modest strength limits the upside.");
    }
  } else {
    notes.push("No valid neecha-bhaṅga condition is met on this chart.");
  }

  return { cancelled, conditions, verdict, verdictLabel, verdictColor, notes };
}

/* ─── Harṣa Vipareeta check for this chart ───────────────────────────────── */

export interface HarshaResult {
  formed: boolean;
  lordHouse: number;
  lordPlanet: string;
  lordGrahaSlug: string;
  placedHouse: number;
  inOwnDusthana: boolean;
  inAnotherDusthana: boolean;
  strength: StrengthLevel;
  grade: string;
  notes: string[];
}

export function checkHarsha(mercuryHouse: number, mercuryStrength: StrengthLevel): HarshaResult {
  // For Aries lagna: H6 = Virgo → lord = Mercury
  const formed = isDusthana(mercuryHouse);
  const inOwnDusthana = mercuryHouse === 6;
  const inAnotherDusthana = formed && !inOwnDusthana;

  let grade = "Absent — 6th lord not in a dusthana.";
  const notes: string[] = [];

  if (formed) {
    if (inAnotherDusthana && mercuryStrength !== "weak") {
      grade = `Strong — Mercury (6L) in H${mercuryHouse} (another dusthana), strength ${mercuryStrength}.`;
      notes.push("Dusthana lord in another dusthana — the 'malefic spoils malefic' logic is clean.");
    } else if (inOwnDusthana) {
      grade = `Moderate — Mercury (6L) in its own dusthana H${mercuryHouse}.`;
      notes.push("In its own dusthana — the vipareeta logic still holds, but is less forceful than cross-dusthana placement.");
    } else {
      grade = `Weak — Mercury (6L) in H${mercuryHouse}, but low strength tempers the result.`;
      notes.push("The structural pattern is present, but the lord lacks the strength to deliver strongly.");
    }
  }

  return {
    formed,
    lordHouse: 6,
    lordPlanet: "Mercury",
    lordGrahaSlug: "budha",
    placedHouse: mercuryHouse,
    inOwnDusthana,
    inAnotherDusthana,
    strength: mercuryStrength,
    grade,
    notes,
  };
}

/* ─── Combined reading ───────────────────────────────────────────────────── */

export function combinedReading(
  neecha: NeechaResult,
  harsha: HarshaResult,
  saturnStrength: StrengthLevel,
  mercuryStrength: StrengthLevel,
  timing: TimingLevel,
): { label: string; color: string; text: string } {
  const hasNeecha = neecha.cancelled;
  const hasHarsha = harsha.formed;

  if (!hasNeecha && !hasHarsha) {
    return {
      label: "No reversal yogas",
      color: "#A23A1E",
      text: "Neither neecha-bhaṅga nor Harṣa Vipareeta is present on this chart. The debility remains full, and the 6th lord's placement does not form a vipareeta yoga.",
    };
  }

  if (hasNeecha && !hasHarsha) {
    return {
      label: "Neecha-bhaṅga only",
      color: "#C8841E",
      text: "Saturn's debilitation is cancelled, but no Vipareeta yoga accompanies it. A single redemption pattern — good, but not the full 'rise through adversity' signature.",
    };
  }

  if (!hasNeecha && hasHarsha) {
    return {
      label: "Harṣa only",
      color: "#C8841E",
      text: "Harṣa Vipareeta is present, but Saturn remains fully debilitated. One reversal pattern without the other — partial signature.",
    };
  }

  // Both present
  const strong = saturnStrength !== "weak" && mercuryStrength !== "weak";
  const timed = timing === "active";

  if (strong && timed) {
    return {
      label: "Rise through adversity — strong & timed",
      color: "#2F7D55",
      text: "Both reversal yogas present with decent strength and active timing. This is a genuine 'rise through adversity' signature: Saturn's debility redeemed, enemies overcome through effort. The path runs through hardship, but the outcome is promising.",
    };
  } else if (strong && !timed) {
    return {
      label: "Rise through adversity — potential",
      color: "#2F7D55",
      text: "Both yogas structurally present and reasonably strong, but timing is not yet peak. Potential is real; delivery waits for the right daśā period.",
    };
  } else {
    return {
      label: "Rise through adversity — muted",
      color: "#C8841E",
      text: "Both reversal yogas are present, but one or both lords lack strength. The signature is there, but it underdelivers. Grade carefully and time precisely before reading greatness.",
    };
  }
}
