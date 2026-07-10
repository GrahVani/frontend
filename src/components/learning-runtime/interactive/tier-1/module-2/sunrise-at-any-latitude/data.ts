/**
 * SunriseAtAnyLatitude — Static Data Layer
 *
 * All lesson content, presets, challenges, flashcards, and achievement definitions.
 * Fully typed; no runtime logic.
 */

export interface Preset {
  id: string;
  label: string;
  lat: number;
  lon: number;
  tz: number;
  year: number;
  month: number;
  day: number;
  note: string;
  expected: string;
}

export interface ChallengeScenario {
  id: string;
  text: string;
  answer: "early" | "late" | "polar-day" | "polar-night" | "constant" | "undefined";
  reason: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Flashcard {
  id: string;
  front: string;
  frontDevanagari?: string;
  back: string;
  backDetail: string;
  color: string;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: "sun" | "compass" | "alert" | "scroll" | "mandala";
  color: string;
}

export const GOLD = "#C28220";
export const INDIGO = "#4A6FA5";
export const VERMILION = "#A23A1E";
export const JADE = "#2F8C5A";
export const INK_PRIMARY = "var(--gl-ink-primary)";
export const INK_SECONDARY = "var(--gl-ink-secondary)";
export const INK_MUTED = "var(--gl-ink-muted)";

export const PRESETS: Preset[] = [
  {
    id: "mumbai-equinox",
    label: "Mumbai — Equinox",
    lat: 19.076,
    lon: 72.877,
    tz: 5.5,
    year: 2026,
    month: 3,
    day: 21,
    note: "Expected: ~06:39 IST",
    expected: "06:39",
  },
  {
    id: "delhi-solstice",
    label: "Delhi — June Solstice",
    lat: 28.613,
    lon: 77.209,
    tz: 5.5,
    year: 2026,
    month: 6,
    day: 21,
    note: "Expected: ~05:26 IST",
    expected: "05:26",
  },
  {
    id: "singapore-dec",
    label: "Singapore — Dec Solstice",
    lat: 1.352,
    lon: 103.819,
    tz: 8,
    year: 2026,
    month: 12,
    day: 21,
    note: "Expected: ~07:07 SGT",
    expected: "07:07",
  },
  {
    id: "tromso-polar",
    label: "Tromsø — Polar Day",
    lat: 69.65,
    lon: 18.96,
    tz: 1,
    year: 2026,
    month: 6,
    day: 21,
    note: "Above the Arctic Circle: midnight sun (no solution)",
    expected: "polar-day",
  },
  {
    id: "quito-equator",
    label: "Quito — Equator",
    lat: -0.18,
    lon: -78.47,
    tz: -5,
    year: 2026,
    month: 6,
    day: 21,
    note: "Expected: ~06:14 ECT (equatorial, near-constant)",
    expected: "06:14",
  },
];

export const CHALLENGE_SCENARIOS: ChallengeScenario[] = [
  {
    id: "c1",
    text: "Bengaluru (12.97° N) on 21 March 2026 (equinox). How many hours before local apparent noon does sunrise occur?",
    answer: "constant",
    reason:
      "At equinox, declination δ ≈ 0°, so tan(δ) = 0 → cos H = 0 → H = 90° = exactly 6 hours. This is the equinoctial equality: 12-hour day everywhere on Earth.",
    difficulty: "easy",
  },
  {
    id: "c2",
    text: "Delhi (28.61° N) on 21 June 2026 (June solstice). Will sunrise be earlier or later than on the equinox?",
    answer: "early",
    reason:
      "June solstice: δ = +23.44° (maximum). At northern latitudes, positive δ means the Sun rises north of east and H > 90° → sunrise more than 6 hours before noon → earlier sunrise (~05:26 IST vs ~06:39 on equinox).",
    difficulty: "easy",
  },
  {
    id: "c3",
    text: "Tromsø, Norway (69.65° N) on 21 June 2026. What happens to the sunrise formula?",
    answer: "polar-day",
    reason:
      "cos H = −tan(69.65°) × tan(23.44°) ≈ −1.166. Since |−1.166| > 1, arccos has no real solution. The Sun never sets — polar day (midnight sun). φ + δ = 93.09° > 90° confirms.",
    difficulty: "medium",
  },
  {
    id: "c4",
    text: "Singapore (1.35° N) on any date. How does sunrise time vary seasonally?",
    answer: "constant",
    reason:
      "At the equator, tan(φ) ≈ 0, so cos H ≈ 0 regardless of declination. H ≈ 90° = 6 hours year-round. Equatorial sunrise is nearly constant (~minutes variation vs ~1.5 hours at mid-latitudes).",
    difficulty: "medium",
  },
  {
    id: "c5",
    text: "The South Pole (90° S) on any date. What does the formula produce?",
    answer: "undefined",
    reason:
      "At φ = ±90°, tan(φ) is undefined (approaches infinity). The sunrise formula breaks down entirely. The poles experience 6-month days and 6-month nights; the concept of daily sunrise does not apply.",
    difficulty: "medium",
  },
  {
    id: "c6",
    text: "Mumbai (19° N) on 21 December 2026 (December solstice). Will sunrise be earlier or later than on the equinox?",
    answer: "late",
    reason:
      "December solstice: δ = −23.44°. At northern latitudes, negative δ means H < 90° → sunrise less than 6 hours before noon → later sunrise. Mumbai's winter sunrise is ~07:15 IST vs ~06:39 on equinox.",
    difficulty: "easy",
  },
  {
    id: "c7",
    text: "A location at 66.5° N on 21 June 2026. What is the operational status?",
    answer: "polar-day",
    reason:
      "66.5° N is the Arctic Circle. On June solstice, φ + δ = 66.5° + 23.44° = 89.94° ≈ 90° — the boundary of polar day. At or above this latitude on this date, the Sun does not set.",
    difficulty: "hard",
  },
  {
    id: "c8",
    text: "Quito, Ecuador (−0.18° S) on 21 December 2026. What is the approximate sunrise time?",
    answer: "constant",
    reason:
      "Equatorial sunrise is ~6 hours before local noon year-round. Longitude correction (~14 minutes west of ECT standard meridian) shifts local noon to ~12:14 ECT, giving sunrise ~06:14 ECT — nearly constant regardless of season.",
    difficulty: "medium",
  },
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: "f1",
    front: "Hour-angle formula",
    back: "cos H = −tan(φ) × tan(δ)",
    backDetail:
      "H = hour angle of sunrise (degrees). φ = observer's latitude. δ = Sun's declination. 15° = 1 hour.",
    color: INDIGO,
  },
  {
    id: "f2",
    front: "Solar declination approximation",
    back: "δ ≈ −23.44° × cos(360° × (N + 10) / 365)",
    backDetail:
      "N = day-of-year (1–365). +10 offset aligns with December solstice. Range: ±23.44° (Earth's axial tilt).",
    color: GOLD,
  },
  {
    id: "f3",
    front: "Seven-step sunrise procedure",
    back: "N → δ → H → H in hours → local apparent noon → longitude correction → sunrise",
    backDetail:
      "Step 1: day-of-year. Step 2: declination. Step 3: hour angle. Step 4: convert to hours. Step 5: local apparent noon with longitude correction. Step 6: sunrise = noon − H. Step 7: timezone.",
    color: JADE,
  },
  {
    id: "f4",
    front: "Longitude correction",
    back: "(λ − λ_std) / 15 hours",
    backDetail:
      "Positive eastward. Locations west of standard meridian have later local solar noon. Mumbai is ~9.67° west of IST → ~38 minutes later.",
    color: INDIGO,
  },
  {
    id: "f5",
    front: "Equinoctial equality",
    back: "At any equinox, sunrise is exactly 6 hours before local noon at ALL latitudes",
    backDetail:
      "Because δ = 0° → tan(δ) = 0 → cos H = 0 → H = 90° = 6 hours. This gives ~12-hour day + ~12-hour night everywhere.",
    color: GOLD,
  },
  {
    id: "f6",
    front: "Polar day / polar night condition",
    back: "|−tan(φ) × tan(δ)| > 1 → no real sunrise",
    backDetail:
      "Polar day: φ + δ ≥ 90° (Sun never sets). Polar night: |φ − δ| ≥ 90° (Sun never rises). Formula correctly signals edge case.",
    color: VERMILION,
  },
  {
    id: "f7",
    front: "Equatorial sunrise behaviour",
    back: "tan(φ) ≈ 0 → cos H ≈ 0 → H ≈ 90° year-round",
    backDetail:
      "At the equator, sunrise is ~6 hours from noon regardless of season. Seasonal variation is only ~minutes (vs ~1.5 hours at mid-latitudes).",
    color: JADE,
  },
  {
    id: "f8",
    front: "Atmospheric refraction correction",
    back: "~50 arc-minutes ≈ 3–4 minutes earlier visible sunrise",
    backDetail:
      "Atmospheric refraction (~34′) + solar radius (~16′) = ~50′ total. Visible sunrise precedes geometric sunrise. Deferred to Module 23 (Muhūrta).",
    color: VERMILION,
  },
  {
    id: "f9",
    front: "Sūrya Siddhānta Triprasnādhyāya",
    back: "The chapter on the 'three questions' — time, place, direction",
    backDetail:
      "Classical anchor for sunrise computation. Establishes latitude + equinoctial degree + cara (hour angle) + nata (meridian-distance) as foundational inputs.",
    color: GOLD,
  },
];

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "eye-of-dawn",
    title: "Eye of Dawn",
    description: "Computed sunrise for all 5 presets",
    icon: "sun",
    color: GOLD,
  },
  {
    id: "formula-weaver",
    title: "Formula Weaver",
    description: "Completed the guided formula walkthrough",
    icon: "compass",
    color: INDIGO,
  },
  {
    id: "edge-walker",
    title: "Edge Walker",
    description: "Discovered all 3 edge cases",
    icon: "alert",
    color: VERMILION,
  },
  {
    id: "surya-siddhanta",
    title: "Sūrya Siddhānta",
    description: "Completed the 7-step journey",
    icon: "scroll",
    color: JADE,
  },
  {
    id: "master-of-sunrise",
    title: "Master of Sunrise",
    description: "100% interactive completion",
    icon: "mandala",
    color: GOLD,
  },
];

export const GUIDED_STEPS = [
  {
    title: "Welcome",
    body: "In Vedic tradition, the day begins at sunrise — not midnight. Let's discover why, and learn to compute sunrise at any place on Earth.",
    highlight: null,
  },
  {
    title: "The Celestial Sphere",
    body: "Adjust the latitude slider. Watch how the Sun's daily path tilts. At the equator, the path is vertical. At the poles, it's horizontal.",
    highlight: "sphere",
  },
  {
    title: "The Hour Angle",
    body: "The hour angle H is the Sun's angular distance from the meridian at sunrise. Adjust declination (season) and watch H change.",
    highlight: "sphere",
  },
  {
    title: "Build the Formula",
    body: "The formula cos H = −tan(φ) × tan(δ) connects latitude, declination, and hour angle. Tap each term to understand it.",
    highlight: "formula",
  },
  {
    title: "Compute Sunrise",
    body: "Try the calculator. Enter a date and location, then watch the 7 steps unfold. Start with a preset to see the pattern.",
    highlight: "compute",
  },
  {
    title: "Explore Edge Cases",
    body: "Drag the latitude pin to extremes. See what happens at the equator, at high latitudes, and at the poles.",
    highlight: "edge",
  },
  {
    title: "Test Yourself",
    body: "Now try the Challenge. Match locations and dates to their sunrise behaviour. Every wrong answer teaches.",
    highlight: null,
  },
];

/* ------------------------------------------------------------------ */
/* Computation utilities (pure functions)                               */
/* ------------------------------------------------------------------ */

export function dayOfYear(y: number, m: number, d: number): number {
  const days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) days[2] = 29;
  let n = d;
  for (let i = 1; i < m; i++) n += days[i];
  return n;
}

export function toDMS(dec: number): string {
  const d = Math.floor(Math.abs(dec));
  const mFull = (Math.abs(dec) - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${dec < 0 ? "−" : ""}${d}°${m.toString().padStart(2, "0")}′${s.toString().padStart(2, "0")}″`;
}

export function fmtTime(decimalHours: number): string {
  // Normalize into [0, 24) so intermediate/over-midnight values never render as
  // negative ("-1:56:27") or overflow ("25:30:00") clock strings.
  const norm = ((decimalHours % 24) + 24) % 24;
  let h = Math.floor(norm);
  let m = Math.floor((norm - h) * 60);
  let s = Math.round(((norm - h) * 60 - m) * 60);
  if (s === 60) { s = 0; m += 1; }
  if (m === 60) { m = 0; h = (h + 1) % 24; }
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export interface SunriseResult {
  edgeCase: "polar-day" | "polar-night" | null;
  steps: { label: string; value: string }[] | null;
  sunrise: string | null;
  N: number;
  delta: number;
  Hdeg: number;
  Hhours: number;
  localApparentNoon: number;
  longitudeCorrection: number;
  civilTime: number;
}

export function computeSunrise(
  lat: number,
  lon: number,
  tz: number,
  year: number,
  month: number,
  day: number
): SunriseResult {
  const N = dayOfYear(year, month, day);
  const delta = -23.44 * Math.cos(((N + 10) * 360 * Math.PI) / (365 * 180));
  const phiRad = (lat * Math.PI) / 180;
  const deltaRad = (delta * Math.PI) / 180;
  const cosH = -Math.tan(phiRad) * Math.tan(deltaRad);

  if (cosH > 1 || cosH < -1) {
    return {
      edgeCase: cosH > 1 ? "polar-night" : "polar-day",
      steps: null,
      sunrise: null,
      N,
      delta,
      Hdeg: 0,
      Hhours: 0,
      localApparentNoon: 0,
      longitudeCorrection: 0,
      civilTime: 0,
    };
  }

  const Hdeg = (Math.acos(cosH) * 180) / Math.PI;
  const Hhours = Hdeg / 15;
  // Lesson §4.2.3 Step 5: longitude correction = (λ − λ_std)/15, positive
  // eastward. The standard meridian is λ_std = tz × 15 (e.g. IST tz=5.5 →
  // 82.5°E). So (λ − λ_std)/15 = lon/15 − tz (Mumbai: 72.83/15 − 5.5 = −0.645h).
  const longitudeCorrection = lon / 15 - tz;
  const localApparentNoon = 12 - longitudeCorrection; // 12:00 std − (λ−λ_std)/15
  const civilTime = localApparentNoon - Hhours; // Step 6: sunrise = noon − H
  const corrMin = longitudeCorrection * 60;
  const sgn = (x: number) => (x >= 0 ? "+" : "−");

  const steps = [
    { label: "Day of year (N)", value: N.toString() },
    { label: "Solar declination (δ)", value: `${delta.toFixed(2)}°` },
    { label: "Hour angle (H)", value: `${Hdeg.toFixed(2)}° = ${Hhours.toFixed(3)}h` },
    {
      label: "Longitude correction (λ − λ_std)/15",
      value: `${sgn(longitudeCorrection)}${Math.abs(longitudeCorrection).toFixed(3)}h (${sgn(corrMin)}${Math.abs(corrMin).toFixed(0)} min)`,
    },
    { label: "Local apparent noon", value: fmtTime(localApparentNoon) },
    { label: "Sunrise = noon − H", value: fmtTime(civilTime) },
  ];

  return {
    edgeCase: null,
    steps,
    sunrise: fmtTime(civilTime),
    N,
    delta,
    Hdeg,
    Hhours,
    localApparentNoon,
    longitudeCorrection,
    civilTime,
  };
}
