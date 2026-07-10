/**
 * Neecha-Bhaṅga Checker — Data Engine
 *
 * §7 interactive for Lesson 14.5.1 (Neecha-Bhaṅga: Cancellation of Debilitation).
 *
 * Tests the 5 classical cancellation conditions for any debilitated planet.
 */

export type PlanetKey = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn";

export interface PlanetInfo {
  key: PlanetKey;
  iast: string;
  devanagari: string;
  grahaSlug: string; // for design-token color lookup
  debilitationSign: number; // 1-12
  debilitationSignIAST: string;
  debilitationSignDevanagari: string;
  exaltationSign: number; // 1-12
  exaltationSignIAST: string;
}

export const PLANETS: PlanetInfo[] = [
  {
    key: "Sun", iast: "Sūrya", devanagari: "सूर्य", grahaSlug: "surya",
    debilitationSign: 7, debilitationSignIAST: "Tulā", debilitationSignDevanagari: "तुला",
    exaltationSign: 1, exaltationSignIAST: "Meṣa",
  },
  {
    key: "Moon", iast: "Candra", devanagari: "चन्द्र", grahaSlug: "candra",
    debilitationSign: 8, debilitationSignIAST: "Vṛścika", debilitationSignDevanagari: "वृश्चिक",
    exaltationSign: 2, exaltationSignIAST: "Vṛṣabha",
  },
  {
    key: "Mars", iast: "Maṅgala", devanagari: "मङ्गल", grahaSlug: "mangala",
    debilitationSign: 4, debilitationSignIAST: "Karkaṭa", debilitationSignDevanagari: "कर्कट",
    exaltationSign: 10, exaltationSignIAST: "Makara",
  },
  {
    key: "Mercury", iast: "Budha", devanagari: "बुध", grahaSlug: "budha",
    debilitationSign: 12, debilitationSignIAST: "Mīna", debilitationSignDevanagari: "मीन",
    exaltationSign: 6, exaltationSignIAST: "Kanyā",
  },
  {
    key: "Jupiter", iast: "Guru", devanagari: "गुरु", grahaSlug: "guru",
    debilitationSign: 10, debilitationSignIAST: "Makara", debilitationSignDevanagari: "मकर",
    exaltationSign: 4, exaltationSignIAST: "Karkaṭa",
  },
  {
    key: "Venus", iast: "Śukra", devanagari: "शुक्र", grahaSlug: "shukra",
    debilitationSign: 6, debilitationSignIAST: "Kanyā", debilitationSignDevanagari: "कन्या",
    exaltationSign: 12, exaltationSignIAST: "Mīna",
  },
  {
    key: "Saturn", iast: "Śani", devanagari: "शनि", grahaSlug: "shani",
    debilitationSign: 1, debilitationSignIAST: "Meṣa", debilitationSignDevanagari: "मेष",
    exaltationSign: 7, exaltationSignIAST: "Tulā",
  },
];

/* ─── Sign lords (1=Aries … 12=Pisces) ───────────────────────────────────── */

export const SIGN_LORDS: Record<number, { planet: PlanetKey; iast: string; grahaSlug: string }> = {
  1: { planet: "Mars", iast: "Maṅgala", grahaSlug: "mangala" },
  2: { planet: "Venus", iast: "Śukra", grahaSlug: "shukra" },
  3: { planet: "Mercury", iast: "Budha", grahaSlug: "budha" },
  4: { planet: "Moon", iast: "Candra", grahaSlug: "candra" },
  5: { planet: "Sun", iast: "Sūrya", grahaSlug: "surya" },
  6: { planet: "Mercury", iast: "Budha", grahaSlug: "budha" },
  7: { planet: "Venus", iast: "Śukra", grahaSlug: "shukra" },
  8: { planet: "Mars", iast: "Maṅgala", grahaSlug: "mangala" },
  9: { planet: "Jupiter", iast: "Guru", grahaSlug: "guru" },
  10: { planet: "Saturn", iast: "Śani", grahaSlug: "shani" },
  11: { planet: "Saturn", iast: "Śani", grahaSlug: "shani" },
  12: { planet: "Jupiter", iast: "Guru", grahaSlug: "guru" },
};

/* ─── Exaltation mapping: which planet is exalted in each sign ───────────── */

export const EXALTED_IN_SIGN: Record<number, { planet: PlanetKey; iast: string; grahaSlug: string }> = {
  1: { planet: "Sun", iast: "Sūrya", grahaSlug: "surya" },
  2: { planet: "Moon", iast: "Candra", grahaSlug: "candra" },
  4: { planet: "Jupiter", iast: "Guru", grahaSlug: "guru" },
  6: { planet: "Mercury", iast: "Budha", grahaSlug: "budha" },
  7: { planet: "Saturn", iast: "Śani", grahaSlug: "shani" },
  10: { planet: "Mars", iast: "Maṅgala", grahaSlug: "mangala" },
  12: { planet: "Venus", iast: "Śukra", grahaSlug: "shukra" },
};

/* ─── House helpers ──────────────────────────────────────────────────────── */

export const KENDRA_HOUSES = [1, 4, 7, 10];
export const TRIKONA_HOUSES = [1, 5, 9];
export const DUSTHANA_HOUSES = [6, 8, 12];
export const UPACHAYA_HOUSES = [3, 6, 10, 11];

export function isKendra(house: number): boolean {
  return KENDRA_HOUSES.includes(house);
}

export function isTrikona(house: number): boolean {
  return TRIKONA_HOUSES.includes(house);
}

export function isDusthana(house: number): boolean {
  return DUSTHANA_HOUSES.includes(house);
}

export function getDistance(from: number, to: number): number {
  const d = ((to - from + 12) % 12);
  return d === 0 ? 12 : d;
}

/* ─── Neecha-bhaṅga condition check ──────────────────────────────────────── */

export interface ConditionResult {
  number: number;
  label: string;
  met: boolean;
  detail: string;
}

export interface NeechaBhangaResult {
  cancelled: boolean;
  conditions: ConditionResult[];
  verdict: "no-cancellation" | "neutralised" | "raja-yoga";
  verdictLabel: string;
  verdictColor: string;
  notes: string[];
}

export function checkNeechaBhanga(
  planetKey: PlanetKey,
  dispositorHouse: number,
  exaltedPlanetHouse: number,
  debilitatedPlanetHouse: number,
  moonHouse: number,
  dispositorAspects: boolean,
  dispositorConjunct: boolean,
  exaltedAspects: boolean,
  exaltedConjunct: boolean,
  mutualKendra: boolean,
  planetStrength: number, // 0-100
): NeechaBhangaResult {
  const planet = PLANETS.find((p) => p.key === planetKey)!;
  const dispositor = SIGN_LORDS[planet.debilitationSign];
  const exaltedPlanet = EXALTED_IN_SIGN[planet.debilitationSign];

  // Condition 1: Dispositor in kendra from lagna or Moon
  const dispositorKendraFromLagna = isKendra(dispositorHouse);
  const dispositorKendraFromMoon = isKendra(getDistance(moonHouse, dispositorHouse));
  const cond1 = dispositorKendraFromLagna || dispositorKendraFromMoon;

  // Condition 2: Exalted planet in kendra from lagna or Moon
  const exaltedKendraFromLagna = isKendra(exaltedPlanetHouse);
  const exaltedKendraFromMoon = isKendra(getDistance(moonHouse, exaltedPlanetHouse));
  const cond2 = exaltedKendraFromLagna || exaltedKendraFromMoon;

  // Condition 3: Debilitated planet aspected by dispositor OR exalted planet
  // Aspect = 7th from (standard full aspect) OR conjunction counted separately
  const dispositorAspectsDeb = dispositorAspects || dispositorConjunct;
  const exaltedAspectsDeb = exaltedAspects || exaltedConjunct;
  const cond3 = dispositorAspectsDeb || exaltedAspectsDeb;

  // Condition 4: Debilitated planet conjunct dispositor OR exalted planet
  const cond4 = dispositorConjunct || exaltedConjunct;

  // Condition 5: Dispositor and exalted planet in mutual kendras or conjoined
  const mutualDist = getDistance(dispositorHouse, exaltedPlanetHouse);
  const inMutualKendra = [1, 4, 7, 10].includes(mutualDist);
  const cond5 = mutualKendra || inMutualKendra || dispositorHouse === exaltedPlanetHouse;

  const conditions: ConditionResult[] = [
    {
      number: 1,
      label: "Dispositor in kendra from lagna/Moon",
      met: cond1,
      detail: cond1
        ? `${dispositor.iast} in H${dispositorHouse} — kendra ${dispositorKendraFromLagna ? "from lagna" : "from Moon"}`
        : `${dispositor.iast} in H${dispositorHouse} — not kendra`,
    },
    {
      number: 2,
      label: "Exalted planet in kendra from lagna/Moon",
      met: cond2,
      detail: cond2
        ? `${exaltedPlanet.iast} in H${exaltedPlanetHouse} — kendra ${exaltedKendraFromLagna ? "from lagna" : "from Moon"}`
        : `${exaltedPlanet.iast} in H${exaltedPlanetHouse} — not kendra`,
    },
    {
      number: 3,
      label: "Debilitated planet aspected by dispositor or exalted planet",
      met: cond3,
      detail: cond3
        ? `${dispositorAspectsDeb ? dispositor.iast : ""}${dispositorAspectsDeb && exaltedAspectsDeb ? " + " : ""}${exaltedAspectsDeb ? exaltedPlanet.iast : ""} aspects/conjoins`
        : "No aspect or conjunction",
    },
    {
      number: 4,
      label: "Debilitated planet conjunct dispositor or exalted planet",
      met: cond4,
      detail: cond4
        ? `${dispositorConjunct ? dispositor.iast : ""}${dispositorConjunct && exaltedConjunct ? " + " : ""}${exaltedConjunct ? exaltedPlanet.iast : ""} conjunct`
        : "No conjunction",
    },
    {
      number: 5,
      label: "Dispositor and exalted planet in mutual kendras or conjoined",
      met: cond5,
      detail: cond5
        ? `${dispositor.iast} H${dispositorHouse} ↔ ${exaltedPlanet.iast} H${exaltedPlanetHouse} — mutual kendra/conjunct`
        : `H${dispositorHouse} ↔ H${exaltedPlanetHouse} — not mutual kendra`,
    },
  ];

  const cancelled = conditions.some((c) => c.met);

  // Verdict logic with honest debate
  let verdict: NeechaBhangaResult["verdict"] = "no-cancellation";
  let verdictLabel = "No cancellation — debility remains full.";
  let verdictColor = "#A23A1E"; // vermilion
  const notes: string[] = [];

  if (cancelled) {
    const inGoodHouse = isKendra(debilitatedPlanetHouse) || isTrikona(debilitatedPlanetHouse);
    const inBadHouse = isDusthana(debilitatedPlanetHouse);
    const strong = planetStrength >= 60;

    if (inBadHouse || !strong) {
      verdict = "neutralised";
      verdictLabel = "Debility neutralised — harm is cancelled.";
      verdictColor = "#C8841E"; // amber
      notes.push("The debilitation is undone, but the planet lacks the supporting strength and house placement for extraordinary success.");
      if (inBadHouse) notes.push("A dusthāna placement (6/8/12) tempers the result even when cancellation applies.");
      if (!strong) notes.push("Low planetary strength means the redeemed planet performs adequately, not exceptionally.");
    } else {
      verdict = "raja-yoga";
      verdictLabel = "Neecha-bhaṅga Rāja Yoga — rise after fall.";
      verdictColor = "#2F7D55"; // green
      notes.push("Cancellation + good house + decent strength = the classic 'rise after a fall' pattern.");
    }
  } else {
    notes.push("None of the five conditions are met. The planet remains fully debilitated.");
  }

  return { cancelled, conditions, verdict, verdictLabel, verdictColor, notes };
}

/* ─── Presets from the lesson ────────────────────────────────────────────── */

export interface Preset {
  key: string;
  label: string;
  planet: PlanetKey;
  dispositorHouse: number;
  exaltedPlanetHouse: number;
  debilitatedPlanetHouse: number;
  moonHouse: number;
  dispositorAspects: boolean;
  dispositorConjunct: boolean;
  exaltedAspects: boolean;
  exaltedConjunct: boolean;
  mutualKendra: boolean;
  planetStrength: number;
}

export const PRESETS: Preset[] = [
  {
    key: "exalted-in-kendra",
    label: "Exalted planet in kendra",
    planet: "Saturn",
    dispositorHouse: 3,
    exaltedPlanetHouse: 4,
    debilitatedPlanetHouse: 1,
    moonHouse: 1,
    dispositorAspects: false,
    dispositorConjunct: false,
    exaltedAspects: false,
    exaltedConjunct: false,
    mutualKendra: false,
    planetStrength: 75,
  },
  {
    key: "dispositor-in-kendra",
    label: "Dispositor in kendra",
    planet: "Saturn",
    dispositorHouse: 10,
    exaltedPlanetHouse: 3,
    debilitatedPlanetHouse: 1,
    moonHouse: 1,
    dispositorAspects: false,
    dispositorConjunct: false,
    exaltedAspects: false,
    exaltedConjunct: false,
    mutualKendra: false,
    planetStrength: 70,
  },
  {
    key: "conservative",
    label: "Conservative: weak + bad house",
    planet: "Saturn",
    dispositorHouse: 10,
    exaltedPlanetHouse: 3,
    debilitatedPlanetHouse: 8,
    moonHouse: 1,
    dispositorAspects: false,
    dispositorConjunct: false,
    exaltedAspects: false,
    exaltedConjunct: false,
    mutualKendra: false,
    planetStrength: 25,
  },
  {
    key: "aspect-rescue",
    label: "Aspect rescue",
    planet: "Jupiter",
    dispositorHouse: 7,
    exaltedPlanetHouse: 4,
    debilitatedPlanetHouse: 10,
    moonHouse: 1,
    dispositorAspects: true,
    dispositorConjunct: false,
    exaltedAspects: false,
    exaltedConjunct: false,
    mutualKendra: false,
    planetStrength: 60,
  },
];
