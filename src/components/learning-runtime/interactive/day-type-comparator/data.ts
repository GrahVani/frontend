/**
 * DayTypeComparator — Static Data Layer
 *
 * All lesson content, scenarios, flashcards, and achievement definitions.
 * Fully typed; no runtime logic.
 */

export interface DayType {
  key: "savana" | "sidereal" | "lunar" | "solar";
  name: string;
  devanagari: string;
  color: string;
  referenceEvent: string;
  duration: string;
  durationSec: number;
  scope: string;
  detail: string;
  orbitalRadius: number;
  orbitalDurationSec: number;
  icon: "sun" | "star" | "moon" | "orbit";
}

export interface QuizScenario {
  id: string;
  text: string;
  answer: DayType["key"];
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
  dayTypeKey: DayType["key"];
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: "eye" | "compass" | "scroll" | "sun" | "mandala";
  color: string;
}

export const GOLD = "#C28220";
export const INDIGO = "#4A6FA5";
export const VERMILION = "#A23A1E";
export const JADE = "#2F8C5A";
export const INK_PRIMARY = "var(--gl-ink-primary)";
export const INK_SECONDARY = "var(--gl-ink-secondary)";
export const INK_MUTED = "var(--gl-ink-muted)";

export const DAY_TYPES: DayType[] = [
  {
    key: "savana",
    name: "Sāvana",
    devanagari: "सावन",
    color: GOLD,
    referenceEvent: "Sunrise → next sunrise",
    duration: "~24 hours",
    durationSec: 86400,
    scope: "Civil time, vāra, muhūrta timing, daily rituals",
    detail:
      "The sāvana day is the civil day of Vedic tradition. It begins and ends at sunrise (not midnight). The vāra (day-of-week) changes at sunrise, which creates important edge cases for births and events occurring before sunrise. All everyday scheduling, civil timekeeping, and muhūrta selection operate against the sāvana day.",
    orbitalRadius: 90,
    orbitalDurationSec: 24,
    icon: "sun",
  },
  {
    key: "sidereal",
    name: "Nakṣatra (Sidereal)",
    devanagari: "नाक्षत्र",
    color: INDIGO,
    referenceEvent: "Fixed-star rise → same-star rise",
    duration: "~23h 56m 4s",
    durationSec: 86164,
    scope: "Planetary mean-motion, nakṣatra-timing, sidereal-position computation",
    detail:
      "The sidereal day is the time for Earth to complete one 360° rotation relative to fixed stars. It is ~3m 56s shorter than the sāvana day because Earth must rotate ~361° to realign with the Sun after moving ~1° in its orbit. Using sidereal-day reckoning prevents ~1°/year cumulative error in multi-year planetary computations.",
    orbitalRadius: 140,
    orbitalDurationSec: 23.934,
    icon: "star",
  },
  {
    key: "lunar",
    name: "Lunar (Tithi)",
    devanagari: "चान्द्र / तिथि",
    color: VERMILION,
    referenceEvent: "Sun-Moon 12° elongation step",
    duration: "Mean ~23.62h; variable 19–26h",
    durationSec: 85032,
    scope: "Pañcāṅga, Vedic-festival timing, muhūrta election, tithi rituals",
    detail:
      "The lunar day (tithi) is defined by the Sun-Moon angular elongation increasing by 12°. There are 30 tithis in a lunar synodic month (~29.53 sāvana days). Tithi duration varies due to Keplerian orbital mechanics — perigee tithis can be ~19–20h, apogee tithis ~25–26h. This variability causes kṣaya (skipped) and vṛddhi (doubled) tithis.",
    orbitalRadius: 190,
    orbitalDurationSec: 23.62,
    icon: "moon",
  },
  {
    key: "solar",
    name: "Solar",
    devanagari: "सौर",
    color: JADE,
    referenceEvent: "Saṅkrānti → next saṅkrānti",
    duration: "~24h ± seasonal",
    durationSec: 86400,
    scope: "Solar-month regional calendars (Tamil/Kerala/Bengal/Assam), saṅkrānti festivals, saṁhitā mundane cycles",
    detail:
      "The solar day-type is anchored to the Sun's sign-ingress (saṅkrānti). The saura DAY itself is ~24 hours (± slight seasonal variation, since the Sun's angular speed along the ecliptic varies — faster near perihelion in early January, slower near aphelion in early July, per Kepler's second law). It is the saura MONTH — 1/12 of a solar year, ~30.44 days — that runs from one saṅkrānti to the next. Operationally used for solar-month regional calendars (Tamil/Kerala/Bengal/Assam), Makara/Meṣa Saṅkrānti festivals, and saṁhitā mundane-cycle computations.",
    orbitalRadius: 240,
    orbitalDurationSec: 24,
    icon: "orbit",
  },
];

export const BASELINE_SEC = 86400; // sāvana seconds

export const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: "q1",
    text: "Computing the ascendant (lagna) from birth time and location.",
    answer: "savana",
    reason:
      "Lagna computation uses birth time (civil/sāvana time) + location + ayanāṁśa. The sidereal zodiac is used for positions, but the time input is sāvana civil time.",
    difficulty: "easy",
  },
  {
    id: "q2",
    text: "Computing planetary mean-motion over a 100-year period per Sūrya Siddhānta.",
    answer: "sidereal",
    reason:
      "Mean-motion computations in Sūrya Siddhānta use sidereal-day reckoning. Using sāvana days would accumulate ~1°/year error.",
    difficulty: "medium",
  },
  {
    id: "q3",
    text: "Determining the tithi for Śravaṇa Pūrṇimā festival.",
    answer: "lunar",
    reason:
      "Tithi computation uses the lunar day-type (Sun-Moon elongation). Festivals like Pūrṇimā are tithi-based.",
    difficulty: "easy",
  },
  {
    id: "q4",
    text: "Constructing a Tamil solar-month calendar.",
    answer: "solar",
    reason:
      "Solar-month calendars are anchored to saṅkrāntis (Sun's rāśi entry). The solar day-type is normative.",
    difficulty: "medium",
  },
  {
    id: "q5",
    text: "Finding when the Moon will enter Aśvinī nakṣatra for electional timing.",
    answer: "sidereal",
    reason:
      "Nakṣatra-timing uses the sidereal day-type. The Moon's sidereal position and transit through nakṣatras are computed against sidereal reckoning.",
    difficulty: "medium",
  },
  {
    id: "q6",
    text: "Selecting the vāra (day-of-week) for a business opening.",
    answer: "savana",
    reason:
      "Vāra is a 7-day cycle based on planetary lords, operating within the sāvana civil-day framework.",
    difficulty: "easy",
  },
  {
    id: "q7",
    text: "Calculating the muhūrta for a wedding ceremony at sunrise.",
    answer: "savana",
    reason:
      "Muhūrta selection for daily events operates within the sāvana day framework, dividing the sunrise-to-sunrise interval into 30 muhūrtas.",
    difficulty: "easy",
  },
  {
    id: "q8",
    text: "Determining the date of Makara Saṅkrānti festival.",
    answer: "solar",
    reason:
      "Makara Saṅkrānti is defined by the Sun's entry into Makara rāśi (Capricorn). This is a saṅkrānti event, requiring the solar day-type.",
    difficulty: "medium",
  },
  {
    id: "q9",
    text: "Computing the pañcāṅga tithi element for a natal chart.",
    answer: "lunar",
    reason:
      "The tithi is the first of the five pañcāṅga elements and is computed from Sun-Moon angular elongation — the lunar day-type.",
    difficulty: "easy",
  },
  {
    id: "q10",
    text: "Accurate sidereal-position of Saturn after 30 years of ephemeris calculation.",
    answer: "sidereal",
    reason:
      "Long-term planetary position computation requires sidereal-day reckoning to avoid accumulating ~1°/year error from sāvana-day approximation.",
    difficulty: "hard",
  },
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: "f1",
    front: "Sāvana",
    frontDevanagari: "सावन",
    back: "Sunrise → next sunrise (~24 hours)",
    backDetail: "Civil time, vāra, muhūrta timing, daily rituals",
    color: GOLD,
    dayTypeKey: "savana",
  },
  {
    id: "f2",
    front: "Nakṣatra / Sidereal",
    frontDevanagari: "नाक्षत्र",
    back: "Fixed-star rise → same-star rise (~23h 56m 4s)",
    backDetail: "Planetary mean-motion, nakṣatra-timing, sidereal positions",
    color: INDIGO,
    dayTypeKey: "sidereal",
  },
  {
    id: "f3",
    front: "Cāndra / Tithi",
    frontDevanagari: "चान्द्र / तिथि",
    back: "Sun-Moon 12° elongation step (variable 19–26h)",
    backDetail: "Pañcāṅga, festivals, muhūrta election, vrata",
    color: VERMILION,
    dayTypeKey: "lunar",
  },
  {
    id: "f4",
    front: "Saura / Solar",
    frontDevanagari: "सौर",
    back: "Saṅkrānti-anchored — saura DAY ~24h ± seasonal (saura MONTH ~30.44d)",
    backDetail: "Solar-month regional calendars (Tamil/Kerala/Bengal/Assam), saṅkrānti festivals, saṁhitā cycles",
    color: JADE,
    dayTypeKey: "solar",
  },
  {
    id: "f5",
    front: "Why is sidereal shorter than sāvana?",
    back: "Earth moves ~1° in orbit while rotating",
    backDetail:
      "To realign with the Sun, Earth must rotate ~361° (sāvana). To realign with a distant star, only 360° is needed (sidereal). Differential: ~3m 56s.",
    color: INDIGO,
    dayTypeKey: "sidereal",
  },
  {
    id: "f6",
    front: "Why does tithi duration vary?",
    back: "Moon's orbital speed changes (Kepler's 2nd law)",
    backDetail:
      "At perigee (closest), Moon moves fastest → tithi ~19–20h. At apogee (farthest), slowest → tithi ~25–26h. Mean: ~23.62h.",
    color: VERMILION,
    dayTypeKey: "lunar",
  },
  {
    id: "f7",
    front: "Day-type-determining-context principle",
    back: "The calculation context selects the day-type",
    backDetail:
      "Sāvana for civil time. Sidereal for sidereal positions. Lunar for pañcāṅga/tithi. Solar for saṅkrānti. Not stylistic preference.",
    color: GOLD,
    dayTypeKey: "savana",
  },
  {
    id: "f8",
    front: "Sūrya Siddhānta Mānādhyāya 14.1–3",
    back: "The four-fold classification of days",
    backDetail:
      "Classical anchor establishing sāvana (sunrise), nakṣatra (star-rise), cāndra (tithi), and saura (saṅkrānti) as the canonical day-types.",
    color: JADE,
    dayTypeKey: "solar",
  },
];

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "eye-of-time",
    title: "Eye of Time",
    description: "Explored all four day-types",
    icon: "eye",
    color: GOLD,
  },
  {
    id: "context-sage",
    title: "Context Sage",
    description: "Scored 10/10 on the context challenge",
    icon: "compass",
    color: INDIGO,
  },
  {
    id: "sanskrit-scholar",
    title: "Sanskrit Scholar",
    description: "Completed the flashcard deck",
    icon: "scroll",
    color: VERMILION,
  },
  {
    id: "surya-siddhanta",
    title: "Sūrya Siddhānta",
    description: "Finished guided exploration",
    icon: "sun",
    color: JADE,
  },
  {
    id: "master-of-days",
    title: "Master of Days",
    description: "100% interactive completion",
    icon: "mandala",
    color: GOLD,
  },
];

export const GUIDED_STEPS = [
  {
    title: "Welcome",
    body: "In Vedic astrology, the word 'day' means four different things. Let's discover them together.",
    highlight: null,
  },
  {
    title: "Sāvana — The Civil Day",
    body: "Tap the inner golden ring. This is the sāvana day: sunrise to sunrise. It powers civil time, vāra, and daily muhūrta.",
    highlight: "savana",
  },
  {
    title: "Sidereal — The Star Day",
    body: "Now tap the indigo ring. The sidereal day is measured by fixed stars. It is ~3m 56s shorter than sāvana. Can you see why?",
    highlight: "sidereal",
  },
  {
    title: "Lunar — The Tithi",
    body: "The vermilion ring shows the lunar day. Each 12° of Sun-Moon separation is one tithi. Its duration varies from ~19 to ~26 hours.",
    highlight: "lunar",
  },
  {
    title: "Solar — The Saṅkrānti Day",
    body: "Finally, the jade outer ring. The solar 'day' is the time between saṅkrāntis — about 30 sāvana days. It anchors solar calendars and festivals.",
    highlight: "solar",
  },
  {
    title: "Compare Durations",
    body: "Switch to Compare mode to see all four durations side by side. Notice how the sidereal bar is just slightly shorter.",
    highlight: null,
  },
  {
    title: "Test Yourself",
    body: "Now try the Context Challenge. Match real calculation scenarios to their correct day-type. Every wrong answer teaches.",
    highlight: null,
  },
  {
    title: "Memorise",
    body: "Use the Flashcards to anchor the Sanskrit names, durations, and operational scopes in memory.",
    highlight: null,
  },
];
