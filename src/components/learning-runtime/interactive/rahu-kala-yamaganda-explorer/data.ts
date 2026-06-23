export type WeekdayKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type WindowType = "rahu" | "yamaganda" | "gulika";

export type EventType =
  | "wedding"
  | "business-launch"
  | "griha-pravesha"
  | "travel"
  | "education";

export type Verdict = "avoid" | "clear" | "boundary";

export interface TimeWindow {
  portion: number;
  start: string; // 24h "HH:MM"
  end: string; // 24h "HH:MM"
}

export interface DailyPattern {
  weekday: WeekdayKey;
  weekdayLabel: string;
  weekdayDevanagari: string;
  rahu: TimeWindow;
  yamaganda: TimeWindow;
  gulika: TimeWindow;
  mnemonic: string; // single-word classical mnemonic association
}

export interface InauspiciousWindowMeta {
  key: WindowType;
  label: string;
  labelDevanagari: string;
  color: string;
  character: string;
  description: string;
}

export interface EventProfile {
  key: EventType;
  label: string;
  sanskrit: string;
  devanagari: string;
  icon: "heart" | "briefcase" | "home" | "compass" | "book-open";
}

export interface CaseFile {
  id: string;
  client: string;
  request: string;
  eventKey: EventType;
  weekday: WeekdayKey;
  time: string; // 24h "HH:MM"
  seasonPreset: "equinox" | "summer" | "winter";
  scenario: string;
  question: string;
  correctVerdict: Verdict;
  windowsHit: WindowType[];
  explanation: string;
  recommendedShift: string;
}

// Approximate 8-portion clock times for a temperate ~12h day (06:00–18:00).
// Actual duration = daylight / 8; these are pedagogical anchors per the lesson.
export const PORTION_TIMES: Record<
  number,
  { start: string; end: string; label: string }
> = {
  1: { start: "06:00", end: "07:30", label: "Sunrise–2nd" },
  2: { start: "07:30", end: "09:00", label: "2nd–3rd" },
  3: { start: "09:00", end: "10:30", label: "3rd–4th" },
  4: { start: "10:30", end: "12:00", label: "4th–5th" },
  5: { start: "12:00", end: "13:30", label: "5th–6th" },
  6: { start: "13:30", end: "15:00", label: "6th–7th" },
  7: { start: "15:00", end: "16:30", label: "7th–8th" },
  8: { start: "16:30", end: "18:00", label: "8th–Sunset" },
};

export const WEEKDAYS: WeekdayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const WINDOW_META: Record<WindowType, InauspiciousWindowMeta> = {
  rahu: {
    key: "rahu",
    label: "Rāhu-Kāla",
    labelDevanagari: "राहु-काल",
    color: "#A23A1E",
    character: "Rāhu — shadow-planet obstruction",
    description: "Rāhu's portion of daylight; avoid for auspicious initiations.",
  },
  yamaganda: {
    key: "yamaganda",
    label: "Yamagaṇḍa",
    labelDevanagari: "यमगण्ड",
    color: "#7A3E1E",
    character: "Yama — restraint / death-deity grip",
    description: "Yama's daily grip window; avoid for auspicious initiations.",
  },
  gulika: {
    key: "gulika",
    label: "Gulika-Kāla",
    labelDevanagari: "गुलिक-काल",
    color: "#5C3D2E",
    character: "Gulika — Saturn's son, Saturn-influence",
    description:
      "Gulika's portion of daylight; avoid for auspicious initiations.",
  },
};

export const EVENT_PROFILES: EventProfile[] = [
  {
    key: "wedding",
    label: "Wedding-muhūrta",
    sanskrit: "Vivāha-muhūrta",
    devanagari: "विवाह-मुहूर्त",
    icon: "heart",
  },
  {
    key: "business-launch",
    label: "Business-launch",
    sanskrit: "Vyāpāra-ārambha",
    devanagari: "व्यापार-आरम्भ",
    icon: "briefcase",
  },
  {
    key: "griha-pravesha",
    label: "Gṛha-praveśa",
    sanskrit: "Gṛha-praveśa",
    devanagari: "गृह-प्रवेश",
    icon: "home",
  },
  {
    key: "travel",
    label: "Travel-commencement",
    sanskrit: "Yātrā-ārambha",
    devanagari: "यात्रा-आरम्भ",
    icon: "compass",
  },
  {
    key: "education",
    label: "Education-initiation",
    sanskrit: "Vidyā-ārambha",
    devanagari: "विद्या-आरम्भ",
    icon: "book-open",
  },
];

// Classical Rāhu-Kāla mnemonic: Mother, Father, Sister, Brother, Teacher, Wife, Friend
// mapped Sun→Sat.
export const DAILY_PATTERNS: DailyPattern[] = [
  {
    weekday: "sunday",
    weekdayLabel: "Sunday",
    weekdayDevanagari: "रविवासरः",
    rahu: { portion: 8, start: "16:30", end: "18:00" },
    yamaganda: { portion: 4, start: "10:30", end: "12:00" },
    gulika: { portion: 7, start: "15:00", end: "16:30" },
    mnemonic: "Mother",
  },
  {
    weekday: "monday",
    weekdayLabel: "Monday",
    weekdayDevanagari: "सोमवासरः",
    rahu: { portion: 2, start: "07:30", end: "09:00" },
    yamaganda: { portion: 3, start: "09:00", end: "10:30" },
    gulika: { portion: 6, start: "13:30", end: "15:00" },
    mnemonic: "Father",
  },
  {
    weekday: "tuesday",
    weekdayLabel: "Tuesday",
    weekdayDevanagari: "मङ्गलवासरः",
    rahu: { portion: 7, start: "15:00", end: "16:30" },
    yamaganda: { portion: 2, start: "07:30", end: "09:00" },
    gulika: { portion: 5, start: "12:00", end: "13:30" },
    mnemonic: "Sister",
  },
  {
    weekday: "wednesday",
    weekdayLabel: "Wednesday",
    weekdayDevanagari: "बुधवासरः",
    rahu: { portion: 5, start: "12:00", end: "13:30" },
    yamaganda: { portion: 1, start: "06:00", end: "07:30" },
    gulika: { portion: 4, start: "10:30", end: "12:00" },
    mnemonic: "Brother",
  },
  {
    weekday: "thursday",
    weekdayLabel: "Thursday",
    weekdayDevanagari: "गुरुवासरः",
    rahu: { portion: 6, start: "13:30", end: "15:00" },
    yamaganda: { portion: 8, start: "16:30", end: "18:00" },
    gulika: { portion: 3, start: "09:00", end: "10:30" },
    mnemonic: "Teacher",
  },
  {
    weekday: "friday",
    weekdayLabel: "Friday",
    weekdayDevanagari: "शुक्रवासरः",
    rahu: { portion: 4, start: "10:30", end: "12:00" },
    yamaganda: { portion: 7, start: "15:00", end: "16:30" },
    gulika: { portion: 2, start: "07:30", end: "09:00" },
    mnemonic: "Wife",
  },
  {
    weekday: "saturday",
    weekdayLabel: "Saturday",
    weekdayDevanagari: "शनिवासरः",
    rahu: { portion: 3, start: "09:00", end: "10:30" },
    yamaganda: { portion: 6, start: "13:30", end: "15:00" },
    gulika: { portion: 1, start: "06:00", end: "07:30" },
    mnemonic: "Friend",
  },
];

export const CASE_FILES: CaseFile[] = [
  {
    id: "case-wedding-sunday",
    client: "Family M",
    request: "Wedding-muhūrta on Sunday at 4:00 PM.",
    eventKey: "wedding",
    weekday: "sunday",
    time: "16:00",
    seasonPreset: "equinox",
    scenario:
      "Integrated four-pillar evaluation passed; event-specific wedding-application passed. Now apply the daily-window sub-day filter.",
    question: "Does the 4:00 PM window need to be shifted?",
    correctVerdict: "avoid",
    windowsHit: ["gulika"],
    explanation:
      "Rāhu-Kāla Sunday is 4:30–6:00 PM (4 PM clears). Yamagaṇḍa Sunday is 12:00–1:30 PM (4 PM clears). Gulika-Kāla Sunday is 3:00–4:30 PM — 4 PM falls inside. Shift to 2:00 PM, which clears all three windows.",
    recommendedShift: "Shift to 2:00 PM — post-Yamagaṇḍa and pre-Gulika-Kāla.",
  },
  {
    id: "case-business-wednesday",
    client: "Client V",
    request: "Business-launch on Wednesday at 12:30 PM.",
    eventKey: "business-launch",
    weekday: "wednesday",
    time: "12:30",
    seasonPreset: "equinox",
    scenario:
      "Integrated four-pillar evaluation identified Wednesday as optimal for Mercury-vāra commerce-affinity. Family prefers afternoon launch.",
    question: "Is 12:30 PM safe for launch?",
    correctVerdict: "avoid",
    windowsHit: ["rahu"],
    explanation:
      "Rāhu-Kāla Wednesday is 12:00–1:30 PM, so 12:30 PM falls inside. Yamagaṇḍa Wednesday is 7:30–9:00 AM (clears). Gulika-Kāla Wednesday is 10:30 AM–12:00 PM (12:30 PM clears by 30 min). Shift to 2:00 PM to preserve Mercury-vāra commerce-character.",
    recommendedShift:
      "Shift to 2:00 PM — post-Rāhu-Kāla, Mercury-vāra commerce-character preserved.",
  },
  {
    id: "case-education-thursday",
    client: "Student P",
    request: "Education-initiation on Thursday at 10:00 AM.",
    eventKey: "education",
    weekday: "thursday",
    time: "10:00",
    seasonPreset: "equinox",
    scenario:
      "Guru-vāra chosen for education-initiation. Verify the sub-day daily inauspicious-window filter before finalising.",
    question: "Is 10:00 AM clear for the initiation?",
    correctVerdict: "avoid",
    windowsHit: ["gulika"],
    explanation:
      "Thursday Gulika-Kāla is 9:00–10:30 AM. 10:00 AM falls inside. Rāhu-Kāla (1:30–3:00 PM) and Yamagaṇḍa (6:00–7:30 AM) clear. Shift to 11:00 AM or any time after 10:30 AM and before 1:30 PM.",
    recommendedShift:
      "Shift to 11:00 AM — post-Gulika-Kāla and pre-Rāhu-Kāla.",
  },
  {
    id: "case-travel-friday",
    client: "Traveler R",
    request: "Substantial journey commencement on Friday at 9:15 AM.",
    eventKey: "travel",
    weekday: "friday",
    time: "09:15",
    seasonPreset: "equinox",
    scenario:
      "Friday is selected for travel. The departure must clear all three daily inauspicious windows.",
    question: "Is 9:15 AM a safe departure time?",
    correctVerdict: "clear",
    windowsHit: [],
    explanation:
      "Friday Gulika-Kāla is 7:30–9:00 AM (9:15 AM clears by 15 min). Rāhu-Kāla is 10:30 AM–12:00 PM (clears). Yamagaṇḍa is 3:00–4:30 PM (clears). The time is clear, but note the narrow 15-minute margin to the preceding Gulika-Kāla.",
    recommendedShift:
      "No shift needed; for margin-of-safety, confirm with 9:30 AM or later.",
  },
];

export function findPattern(weekday: WeekdayKey): DailyPattern {
  return DAILY_PATTERNS.find((p) => p.weekday === weekday) ?? DAILY_PATTERNS[0];
}

export function findEventProfile(key: EventType): EventProfile {
  return EVENT_PROFILES.find((e) => e.key === key) ?? EVENT_PROFILES[0];
}

export function findCase(id: string): CaseFile | undefined {
  return CASE_FILES.find((c) => c.id === id);
}

export function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
}

export function formatTime(decimal: number): string {
  const h = Math.floor(decimal) % 24;
  const m = Math.round((decimal - Math.floor(decimal)) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function isInsideWindow(timeDec: number, window: TimeWindow): boolean {
  const start = parseTime(window.start);
  const end = parseTime(window.end);
  return timeDec >= start && timeDec < end;
}

export function getWindowsForTime(
  weekday: WeekdayKey,
  timeDec: number
): WindowType[] {
  const pattern = findPattern(weekday);
  const hit: WindowType[] = [];
  if (isInsideWindow(timeDec, pattern.rahu)) hit.push("rahu");
  if (isInsideWindow(timeDec, pattern.yamaganda)) hit.push("yamaganda");
  if (isInsideWindow(timeDec, pattern.gulika)) hit.push("gulika");
  return hit;
}

export function evaluateTime(
  weekday: WeekdayKey,
  timeDec: number
): {
  verdict: Verdict;
  windows: WindowType[];
  nextClearAfter: string | null;
} {
  const windows = getWindowsForTime(weekday, timeDec);
  if (windows.length > 0) {
    return {
      verdict: "avoid",
      windows,
      nextClearAfter: findNextClearWindow(weekday, timeDec),
    };
  }

  // "boundary" if within 15 min of an upcoming inauspicious window.
  const pattern = findPattern(weekday);
  const allWindows: { type: WindowType; start: number; end: number }[] = [
    {
      type: "rahu",
      start: parseTime(pattern.rahu.start),
      end: parseTime(pattern.rahu.end),
    },
    {
      type: "yamaganda",
      start: parseTime(pattern.yamaganda.start),
      end: parseTime(pattern.yamaganda.end),
    },
    {
      type: "gulika",
      start: parseTime(pattern.gulika.start),
      end: parseTime(pattern.gulika.end),
    },
  ];
  const nearBoundary = allWindows.some(
    (w) => timeDec < w.start && w.start - timeDec <= 0.25
  );

  return {
    verdict: nearBoundary ? "boundary" : "clear",
    windows: [],
    nextClearAfter: null,
  };
}

function findNextClearWindow(
  weekday: WeekdayKey,
  timeDec: number
): string | null {
  const pattern = findPattern(weekday);
  const allWindows: { type: WindowType; start: number; end: number }[] = [
    {
      type: "rahu",
      start: parseTime(pattern.rahu.start),
      end: parseTime(pattern.rahu.end),
    },
    {
      type: "yamaganda",
      start: parseTime(pattern.yamaganda.start),
      end: parseTime(pattern.yamaganda.end),
    },
    {
      type: "gulika",
      start: parseTime(pattern.gulika.start),
      end: parseTime(pattern.gulika.end),
    },
  ];
  const future = allWindows
    .filter((w) => w.end > timeDec)
    .sort((a, b) => a.end - b.end);
  return future.length > 0 ? formatTime(future[0].end) : null;
}

export function getCaseVerdict(caseFile: CaseFile): {
  verdict: Verdict;
  windows: WindowType[];
  nextClearAfter: string | null;
} {
  return evaluateTime(caseFile.weekday, parseTime(caseFile.time));
}
