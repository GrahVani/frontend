/**
 * Jaimini Workflow Walkthrough engine -- Lesson 17.7.4
 *
 * Six ordered steps that assemble every Jaimini tool into one end-to-end reading.
 * Steps 1-5 are positional (what the chart promises); Step 6 is temporal (when).
 */

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

export const GRAHAS = [
  { key: "Su", name: "Sun" },
  { key: "Mo", name: "Moon" },
  { key: "Ma", name: "Mars" },
  { key: "Me", name: "Mercury" },
  { key: "Ju", name: "Jupiter" },
  { key: "Ve", name: "Venus" },
  { key: "Sa", name: "Saturn" },
] as const;

export interface StepData {
  title: string;
  subtitle: string;
  tool: string;
  source: string;
  inputs: string[];
  outputs: string[];
  detail: string;
}

export const WORKFLOW_STEPS: StepData[] = [
  {
    title: "Cara-Kārakas + Ātmakāraka",
    subtitle: "The variable significators + the soul-anchor",
    tool: "Cara-kāraka ranking",
    source: "Chapter 2 (Lessons 17.2.2, 17.2.4)",
    inputs: ["Within-sign degrees of the seven grahas"],
    outputs: ["Seven cara-kāraka roles ranked by longitude", "Ātmakāraka (AK) = highest-degree planet"],
    detail: "Every later step consumes the cara-kārakas. The AK is required before the Kārakāṁśa can be set. Without this anchor, the reading floats.",
  },
  {
    title: "Kārakāṁśa + Iṣṭa-Devatā",
    subtitle: "The soul-purpose reference frame",
    tool: "Navāṁśa (D9) projection",
    source: "Chapter 7 (Lessons 17.7.1–17.7.3)",
    inputs: ["AK's navāṁśa sign"],
    outputs: ["Kārakāṁśa Lagna = AK's D9 sign treated as lagna", "Iṣṭa-devatā from 12th-from-KL"],
    detail: "The Kārakāṁśa fixes the soul-purpose chart-within-the-chart. All later layers are interpreted against this frame. Step 2 is non-skippable.",
  },
  {
    title: "Rāśi-Dṛṣṭi",
    subtitle: "The relational layer -- which signs aspect which",
    tool: "Sign-to-sign aspects",
    source: "Chapter 5 (Lesson 17.5.2)",
    inputs: ["Sign classes (movable / fixed / dual)", "Target houses from KL"],
    outputs: ["List of aspecting signs for each target", "Planets carried across by those aspects"],
    detail: "Once significators and the KL frame are fixed, the next question is which signs are in relationship. Jaimini aspects are sign-to-sign, not planet-to-planet.",
  },
  {
    title: "Argala + Virodhārgala",
    subtitle: "Intervention and counter-intervention",
    tool: "Argala / virodhārgala",
    source: "Chapter 3 (Lessons 17.3.1, 17.3.4)",
    inputs: ["Target house (e.g. 10th-from-KL for career)", "2nd, 4th, 11th positions"],
    outputs: ["Supporting argala sources", "Obstructing virodhārgala sources"],
    detail: "Argala modulates the relationships rāśi-dṛṣṭi established. It asks: who helps and who blocks the matter? It logically follows the aspect layer.",
  },
  {
    title: "Ārūḍha Padas (AL, UL)",
    subtitle: "The perceived image (māyā) layer",
    tool: "Ārūḍha Lagna + Upapada",
    source: "Chapter 4 (Lessons 17.4.1, 17.4.3)",
    inputs: ["Lagna lord placement (for AL)", "12th-lord placement (for UL)"],
    outputs: ["AL = perceived self / public image", "UL = spouse-image / relationship significator"],
    detail: "The padas describe how matters manifest and are perceived. They are read after the significator-and-aspect skeleton is in place, because the padas are interpreted against it.",
  },
  {
    title: "Cara-Daśā + Vimśottarī Cross-Check",
    subtitle: "Timing engine -- when the promises activate",
    tool: "Cara-daśā (rāśi-based)",
    source: "Chapter 6 (Lessons 17.6.4, 17.6.5)",
    inputs: ["Sign-periods from cara-daśā", "Vimśottarī daśā/bhukti"],
    outputs: ["Activation window for the matter", "Confidence level (converged = high, diverged = uncertain)"],
    detail: "The cara-daśā answers WHEN, not WHAT. It is meaningful only as the activation-window of conclusions already drawn. Cross-validate against Vimśottarī: convergence raises confidence, divergence flags uncertainty.",
  },
];

/* --- Presets --- */

export interface Preset {
  name: string;
  question: string;
  keyKaraka: string;
  keyPada: string;
  // Step 1
  degrees: Record<string, number>;
  ak: string;
  amk: string;
  dk: string;
  // Step 2
  klSign: number;
  ishtaDevata: string;
  // Step 3
  rashiDrishtiTargets: { house: number; sign: string; aspectedBy: string[] }[];
  // Step 4
  argala: { house: number; supports: string[]; blocks: string[] }[];
  // Step 5
  alSign: number;
  ulSign: number;
  // Step 6
  caraDasha: { sign: string; years: number; active: boolean }[];
  vimshottari: { planet: string; period: string; active: boolean }[];
  conclusion: string;
}

function fmtDeg(v: number): string {
  const d = Math.floor(v);
  const m = Math.round((v - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}'`;
}

export const PRESETS: Preset[] = [
  {
    name: "Career question",
    question: "Will my career advance significantly, and when?",
    keyKaraka: "Amātyakāraka (Saturn)",
    keyPada: "Ārūḍha Lagna (status image)",
    degrees: { Su: 28.68, Mo: 4, Ma: 19, Me: 22, Ju: 8, Ve: 15, Sa: 27.5 },
    ak: "Sun (Surya) at 28°41'",
    amk: "Saturn (Shani) at 27°30'",
    dk: "Venus (Shukra) at 15°00'",
    klSign: 4, // Leo
    ishtaDevata: "Śiva (from Sun in Leo KL)",
    rashiDrishtiTargets: [
      { house: 10, sign: "Taurus", aspectedBy: ["Scorpio", "Aquarius", "Leo"] },
      { house: 1, sign: "Leo", aspectedBy: ["Capricorn", "Aries", "Sagittarius"] },
    ],
    argala: [
      { house: 10, supports: ["11th-from-KL (Gemini) -- gains intervene"], blocks: [] },
    ],
    alSign: 2, // Gemini
    ulSign: 8, // Sagittarius
    caraDasha: [
      { sign: "Aries", years: 7, active: false },
      { sign: "Taurus", years: 8, active: true },
      { sign: "Gemini", years: 7, active: false },
    ],
    vimshottari: [
      { planet: "Saturn", period: "Saturn-Mercury", active: true },
      { planet: "Jupiter", period: "Jupiter-Venus", active: false },
    ],
    conclusion: "Career advancement is promised (AmK Saturn + supportive argala + favourable KL frame). Timing: Taurus cara-daśā period, corroborated by Saturn-Mercury Vimśottarī -- high-confidence window.",
  },
  {
    name: "Marriage question",
    question: "When will I marry?",
    keyKaraka: "Dārakāraka (Venus)",
    keyPada: "Upapada Lagna (UL)",
    degrees: { Su: 18, Mo: 28.5, Ma: 12, Me: 22, Ju: 5, Ve: 25, Sa: 10 },
    ak: "Moon (Candra) at 28°30'",
    amk: "Mercury (Budha) at 22°00'",
    dk: "Venus (Shukra) at 25°00'",
    klSign: 2, // Gemini
    ishtaDevata: "Viṣṇu (from Mercury in Gemini KL)",
    rashiDrishtiTargets: [
      { house: 7, sign: "Sagittarius", aspectedBy: ["Pisces", "Gemini", "Virgo"] },
      { house: 12, sign: "Taurus", aspectedBy: ["Scorpio", "Aquarius", "Leo"] },
    ],
    argala: [
      { house: 12, supports: ["2nd-from-UL (Capricorn) -- sustenance supports"], blocks: ["Virodhārgala from 8th-from-UL (Leo) -- obstacles"] },
    ],
    alSign: 5, // Leo
    ulSign: 11, // Aquarius
    caraDasha: [
      { sign: "Cancer", years: 7, active: false },
      { sign: "Leo", years: 8, active: false },
      { sign: "Virgo", years: 7, active: true },
    ],
    vimshottari: [
      { planet: "Venus", period: "Venus-Mars", active: true },
      { planet: "Jupiter", period: "Jupiter-Moon", active: false },
    ],
    conclusion: "Marriage is promised but tested (DK Venus + mixed argala on UL). Timing: Virgo cara-daśā period, corroborated by Venus-Mars Vimśottarī -- moderate-confidence window due to virodhārgala.",
  },
  {
    name: "Spiritual path question",
    question: "What is my soul's spiritual direction?",
    keyKaraka: "Ātmakāraka (Jupiter)",
    keyPada: "Kārakāṁśa Lagna",
    degrees: { Su: 10, Mo: 15, Ma: 8, Me: 12, Ju: 29, Ve: 5, Sa: 18 },
    ak: "Jupiter (Guru) at 29°00'",
    amk: "Saturn (Shani) at 18°00'",
    dk: "Venus (Shukra) at 5°00'",
    klSign: 8, // Sagittarius
    ishtaDevata: "Vāmana / Viṣṇu (from Jupiter in Sagittarius KL)",
    rashiDrishtiTargets: [
      { house: 12, sign: "Scorpio", aspectedBy: ["Taurus", "Leo", "Aquarius"] },
      { house: 9, sign: "Leo", aspectedBy: ["Capricorn", "Aries", "Sagittarius"] },
    ],
    argala: [
      { house: 12, supports: ["11th-from-KL (Libra) -- gains support spiritual practice"], blocks: [] },
    ],
    alSign: 0, // Aries
    ulSign: 6, // Libra
    caraDasha: [
      { sign: "Sagittarius", years: 8, active: true },
      { sign: "Capricorn", years: 7, active: false },
    ],
    vimshottari: [
      { planet: "Jupiter", period: "Jupiter-Jupiter", active: true },
      { planet: "Saturn", period: "Saturn-Jupiter", active: false },
    ],
    conclusion: "Strong spiritual path (AK Jupiter in own-sign KL + supportive 12th argala + Jupiter-Jupiter Vimśottarī). Timing: Sagittarius cara-daśā -- very high confidence.",
  },
];

export { fmtDeg };
