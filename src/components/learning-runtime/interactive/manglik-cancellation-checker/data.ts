/**
 * Manglik Cancellation Checker — Data Engine
 *
 * §7 interactive for Lesson 14.6.2 (Manglik Cancellations: 15+ Classical Conditions).
 *
 * Tests all grouped cancellations (A–E) against a chart and weights them.
 */

/* ─── Sign helpers ───────────────────────────────────────────────────────── */

export const SIGN_NAMES = [
  "Meṣa", "Vṛṣabha", "Mithuna", "Karkaṭa",
  "Siṃha", "Kanyā", "Tulā", "Vṛścika",
  "Dhanus", "Makara", "Kumbha", "Mīna",
];

export function marsOwnSign(sign: number): boolean {
  return sign === 1 || sign === 8; // Aries, Scorpio
}

export function marsExalted(sign: number): boolean {
  return sign === 10; // Capricorn
}

export function marsFriendly(sign: number): boolean {
  // Friends of Mars: Sun (Leo=5), Moon (Cancer=4), Jupiter (Sag=9, Pisces=12)
  return [4, 5, 9, 12].includes(sign);
}

/* ─── Cancellation groups ────────────────────────────────────────────────── */

export type GroupKey = "A" | "B" | "C" | "D" | "E";

export interface CancellationItem {
  key: string;
  group: GroupKey;
  groupLabel: string;
  label: string;
  weight: "firm" | "tradition" | "folk";
  check: (state: CheckState) => boolean;
  detail: (state: CheckState) => string;
}

export interface CheckState {
  marsSign: number;
  marsHouse: number;
  jupiterAspect: boolean;
  jupiterSameHouse: boolean;
  otherBeneficAspect: boolean;
  mutualManglik: boolean;
  bornTuesday: boolean;
  ageOver28: boolean;
  strong7thLordVenus: boolean;
}

export const CANCELLATIONS: CancellationItem[] = [
  /* ── Group A: Dignity ── */
  {
    key: "A1",
    group: "A",
    groupLabel: "Dignity of Mars",
    label: "Mars in own sign (Aries / Scorpio)",
    weight: "firm",
    check: (s) => marsOwnSign(s.marsSign),
    detail: (s) => `Mars in ${SIGN_NAMES[s.marsSign - 1]} — ${marsOwnSign(s.marsSign) ? "own sign ✓" : "not own"}`,
  },
  {
    key: "A2",
    group: "A",
    groupLabel: "Dignity of Mars",
    label: "Mars exalted (Capricorn)",
    weight: "firm",
    check: (s) => marsExalted(s.marsSign),
    detail: (s) => `Mars in ${SIGN_NAMES[s.marsSign - 1]} — ${marsExalted(s.marsSign) ? "exalted ✓" : "not exalted"}`,
  },
  {
    key: "A3",
    group: "A",
    groupLabel: "Dignity of Mars",
    label: "Mars in a friendly sign",
    weight: "firm",
    check: (s) => marsFriendly(s.marsSign),
    detail: (s) => `Mars in ${SIGN_NAMES[s.marsSign - 1]} — ${marsFriendly(s.marsSign) ? "friendly sign ✓" : "not friendly"}`,
  },

  /* ── Group B: Benefic influence ── */
  {
    key: "B1",
    group: "B",
    groupLabel: "Benefic influence",
    label: "Mars conjunct or aspected by Jupiter",
    weight: "firm",
    check: (s) => s.jupiterAspect,
    detail: () => "Jupiter's influence on Mars",
  },
  {
    key: "B2",
    group: "B",
    groupLabel: "Benefic influence",
    label: "Mars conjunct or aspected by another benefic (Venus, Moon, well-disposed Mercury)",
    weight: "firm",
    check: (s) => s.otherBeneficAspect,
    detail: () => "Another benefic influencing Mars",
  },
  {
    key: "B3",
    group: "B",
    groupLabel: "Benefic influence",
    label: "Jupiter (or a benefic) in the same house as Mars",
    weight: "firm",
    check: (s) => s.jupiterSameHouse,
    detail: () => "Benefic sharing Mars's house",
  },

  /* ── Group C: Mutual ── */
  {
    key: "C1",
    group: "C",
    groupLabel: "Mutual cancellation",
    label: "Both partners are Manglik → cancels mutually",
    weight: "firm",
    check: (s) => s.mutualManglik,
    detail: () => "Both partners carry the doṣa",
  },

  /* ── Group D: Sign-house specifics ── */
  {
    key: "D1",
    group: "D",
    groupLabel: "Sign-house specifics",
    label: "Mars in the 2nd in Gemini / Virgo",
    weight: "tradition",
    check: (s) => s.marsHouse === 2 && (s.marsSign === 3 || s.marsSign === 6),
    detail: (s) => `Mars H${s.marsHouse} / ${SIGN_NAMES[s.marsSign - 1]} — ${s.marsHouse === 2 && (s.marsSign === 3 || s.marsSign === 6) ? "matches ✓" : "no match"}`,
  },
  {
    key: "D2",
    group: "D",
    groupLabel: "Sign-house specifics",
    label: "Mars in the 4th in Aries / Scorpio",
    weight: "tradition",
    check: (s) => s.marsHouse === 4 && (s.marsSign === 1 || s.marsSign === 8),
    detail: (s) => `Mars H${s.marsHouse} / ${SIGN_NAMES[s.marsSign - 1]} — ${s.marsHouse === 4 && (s.marsSign === 1 || s.marsSign === 8) ? "matches ✓" : "no match"}`,
  },
  {
    key: "D3",
    group: "D",
    groupLabel: "Sign-house specifics",
    label: "Mars in the 7th in Cancer / Capricorn",
    weight: "tradition",
    check: (s) => s.marsHouse === 7 && (s.marsSign === 4 || s.marsSign === 10),
    detail: (s) => `Mars H${s.marsHouse} / ${SIGN_NAMES[s.marsSign - 1]} — ${s.marsHouse === 7 && (s.marsSign === 4 || s.marsSign === 10) ? "matches ✓" : "no match"}`,
  },
  {
    key: "D4",
    group: "D",
    groupLabel: "Sign-house specifics",
    label: "Mars in the 8th in Sagittarius / Pisces",
    weight: "tradition",
    check: (s) => s.marsHouse === 8 && (s.marsSign === 9 || s.marsSign === 12),
    detail: (s) => `Mars H${s.marsHouse} / ${SIGN_NAMES[s.marsSign - 1]} — ${s.marsHouse === 8 && (s.marsSign === 9 || s.marsSign === 12) ? "matches ✓" : "no match"}`,
  },
  {
    key: "D5",
    group: "D",
    groupLabel: "Sign-house specifics",
    label: "Mars in the 12th in Taurus / Libra",
    weight: "tradition",
    check: (s) => s.marsHouse === 12 && (s.marsSign === 2 || s.marsSign === 7),
    detail: (s) => `Mars H${s.marsHouse} / ${SIGN_NAMES[s.marsSign - 1]} — ${s.marsHouse === 12 && (s.marsSign === 2 || s.marsSign === 7) ? "matches ✓" : "no match"}`,
  },

  /* ── Group E: Folk / regional ── */
  {
    key: "E1",
    group: "E",
    groupLabel: "Folk / regional",
    label: "Native born on a Tuesday (Mars's day)",
    weight: "folk",
    check: (s) => s.bornTuesday,
    detail: () => "Tuesday birth",
  },
  {
    key: "E2",
    group: "E",
    groupLabel: "Folk / regional",
    label: "Doṣa weakens with age (e.g. after ~28)",
    weight: "folk",
    check: (s) => s.ageOver28,
    detail: () => "Age threshold passed",
  },
  {
    key: "E3",
    group: "E",
    groupLabel: "Folk / regional",
    label: "Strong, well-placed 7th lord / Venus offsetting",
    weight: "folk",
    check: (s) => s.strong7thLordVenus,
    detail: () => "7th lord or Venus well-disposed",
  },
];

export function runCheck(state: CheckState) {
  const results = CANCELLATIONS.map((c) => ({
    ...c,
    met: c.check(state),
    detailText: c.detail(state),
  }));

  const metCount = results.filter((r) => r.met).length;
  const firmCount = results.filter((r) => r.met && r.weight === "firm").length;
  const traditionCount = results.filter((r) => r.met && r.weight === "tradition").length;
  const folkCount = results.filter((r) => r.met && r.weight === "folk").length;

  let overall = "no-cancellation";
  let overallLabel = "No cancellations met";
  let overallColor = "#A23A1E";

  if (metCount === 0) {
    overall = "no-cancellation";
    overallLabel = "No cancellations met — the doṣa stands uncancelled.";
    overallColor = "#A23A1E";
  } else if (firmCount >= 1) {
    overall = "firmly-cancelled";
    overallLabel = `Firmly cancelled — ${metCount} condition${metCount > 1 ? "s" : ""} met, including ${firmCount} firmly-classical.`;
    overallColor = "#2F7D55";
  } else if (traditionCount >= 1) {
    overall = "traditionally-cancelled";
    overallLabel = `Traditionally cancelled — ${metCount} condition${metCount > 1 ? "s" : ""} met (tradition-specific).`;
    overallColor = "#C8841E";
  } else {
    overall = "folk-cancelled";
    overallLabel = `Weakly cancelled — ${metCount} folk condition${metCount > 1 ? "s" : ""} met only.`;
    overallColor = "#8A7E5E";
  }

  return { results, metCount, firmCount, traditionCount, folkCount, overall, overallLabel, overallColor };
}

/* ─── Presets ────────────────────────────────────────────────────────────── */

export const PRESETS: Record<string, CheckState> = {
  "dignity-exalt": {
    marsSign: 10, marsHouse: 7,
    jupiterAspect: false, jupiterSameHouse: false, otherBeneficAspect: false,
    mutualManglik: false, bornTuesday: false, ageOver28: false, strong7thLordVenus: false,
  },
  "jupiter-aspect": {
    marsSign: 3, marsHouse: 7,
    jupiterAspect: true, jupiterSameHouse: false, otherBeneficAspect: false,
    mutualManglik: false, bornTuesday: false, ageOver28: false, strong7thLordVenus: false,
  },
  "mutual": {
    marsSign: 1, marsHouse: 1,
    jupiterAspect: false, jupiterSameHouse: false, otherBeneficAspect: false,
    mutualManglik: true, bornTuesday: false, ageOver28: false, strong7thLordVenus: false,
  },
  "sign-house": {
    marsSign: 4, marsHouse: 7,
    jupiterAspect: false, jupiterSameHouse: false, otherBeneficAspect: false,
    mutualManglik: false, bornTuesday: false, ageOver28: false, strong7thLordVenus: false,
  },
  "folk-mix": {
    marsSign: 3, marsHouse: 2,
    jupiterAspect: false, jupiterSameHouse: false, otherBeneficAspect: false,
    mutualManglik: false, bornTuesday: true, ageOver28: true, strong7thLordVenus: false,
  },
  "none": {
    marsSign: 3, marsHouse: 2,
    jupiterAspect: false, jupiterSameHouse: false, otherBeneficAspect: false,
    mutualManglik: false, bornTuesday: false, ageOver28: false, strong7thLordVenus: false,
  },
};
