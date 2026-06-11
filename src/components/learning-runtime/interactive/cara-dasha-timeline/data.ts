import { grahas } from "@/design-tokens/grahvani-learning/colors";
import { getPeriodRashi, type CaraPeriodRashi } from "../cara-period-calculator/data";

export type ReferenceFrame = "lagna" | "arudha";

export interface CaraTimelineStep {
  order: number;
  rashi: CaraPeriodRashi;
  years: number;
  startAge: number;
  endAge: number;
  lagnaHouse: number;
  arudhaHouse: number;
  karakaCue: string;
  occupantCue: string;
  drishtiCue: string;
  argalaCue: string;
  verdict: string;
}

export interface AntarStep {
  order: number;
  rashi: CaraPeriodRashi;
  startOffset: number;
  endOffset: number;
  cue: string;
}

const WORKED_PERIODS = [8, 12, 6, 10, 9, 7, 8, 6, 5, 4, 8, 7];
const WORKED_SEQUENCE_INDEXES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const READING_CUES = [
  {
    lagnaHouse: 3,
    arudhaHouse: 7,
    karakaCue: "Siblings and initiative become the applied field.",
    occupantCue: "Mars gives effort, speed, and restlessness.",
    drishtiCue: "A benefic glance steadies the first push.",
    argalaCue: "Secondary argala supports movement, not final closure.",
    verdict: "Preparation period: useful, but not the main partnership window.",
  },
  {
    lagnaHouse: 4,
    arudhaHouse: 8,
    karakaCue: "Home and inner stability need attention.",
    occupantCue: "Moon softens domestic matters.",
    drishtiCue: "Mixed sign-aspects create private pressure.",
    argalaCue: "Counter-argala delays visible outcome.",
    verdict: "Internal settling before public change.",
  },
  {
    lagnaHouse: 10,
    arudhaHouse: 10,
    karakaCue: "Amatya-karaka style career matters are activated.",
    occupantCue: "Mercury adds skill and decision work.",
    drishtiCue: "Helpful aspects support reputation.",
    argalaCue: "Argala opens a professional step.",
    verdict: "Career and public standing are readable here.",
  },
  {
    lagnaHouse: 6,
    arudhaHouse: 12,
    karakaCue: "Service and contest themes are louder than union.",
    occupantCue: "Saturn adds endurance and delay.",
    drishtiCue: "Malefic pressure asks for discipline.",
    argalaCue: "Virodha-argala blocks easy closure.",
    verdict: "Work through resistance; avoid over-promising events.",
  },
  {
    lagnaHouse: 7,
    arudhaHouse: 11,
    karakaCue: "Dara-karaka is engaged: spouse and partnership are live.",
    occupantCue: "A benefic occupant softens delivery.",
    drishtiCue: "Benefic rashi-drishti supports the sign.",
    argalaCue: "Clean argala lets the matter close.",
    verdict: "Strong partnership window: experienced and visibly realized.",
  },
  {
    lagnaHouse: 8,
    arudhaHouse: 12,
    karakaCue: "Transformation is activated more than social arrival.",
    occupantCue: "Ketu makes the result inward and discontinuous.",
    drishtiCue: "Sparse support reduces certainty.",
    argalaCue: "Argala is weak; closure needs cross-checking.",
    verdict: "Good for depth work, weak for a public event verdict.",
  },
  {
    lagnaHouse: 9,
    arudhaHouse: 1,
    karakaCue: "Guru themes of dharma and guidance arise.",
    occupantCue: "Jupiter gives counsel and grace.",
    drishtiCue: "Supportive signs aspect the field.",
    argalaCue: "Argala helps meaning, teacher, and travel matters.",
    verdict: "A dharma-facing period with visible self-redefinition.",
  },
  {
    lagnaHouse: 1,
    arudhaHouse: 5,
    karakaCue: "Self-direction and intelligence return to center.",
    occupantCue: "Mars sharpens initiative.",
    drishtiCue: "Mixed aspects require judgment.",
    argalaCue: "Argala can trigger a personal decision.",
    verdict: "Identity period; read carefully before naming an external event.",
  },
  {
    lagnaHouse: 2,
    arudhaHouse: 6,
    karakaCue: "Family, speech, and resources are activated.",
    occupantCue: "Rahu complicates appetite and ambition.",
    drishtiCue: "Aspects intensify material concerns.",
    argalaCue: "Argala supports gain but can bring dispute.",
    verdict: "Resource period with competitive texture.",
  },
  {
    lagnaHouse: 11,
    arudhaHouse: 3,
    karakaCue: "Networks and gains become practical.",
    occupantCue: "Saturn asks for slow building.",
    drishtiCue: "Rashi-drishti supports structured alliances.",
    argalaCue: "Argala is present but not dramatic.",
    verdict: "Gain through repetition and mature networks.",
  },
  {
    lagnaHouse: 12,
    arudhaHouse: 4,
    karakaCue: "Withdrawal, foreignness, and expense are activated.",
    occupantCue: "Saturn keeps outcomes restrained.",
    drishtiCue: "Aspects cool public visibility.",
    argalaCue: "Argala turns inward.",
    verdict: "Private or foreign-facing period.",
  },
  {
    lagnaHouse: 5,
    arudhaHouse: 9,
    karakaCue: "Putra-karaka themes of children, students, and creativity open.",
    occupantCue: "Jupiter supports counsel.",
    drishtiCue: "Benefic aspects lift the reading.",
    argalaCue: "Argala helps fruition where promise exists.",
    verdict: "Creative and counsel-rich period.",
  },
];

export const APPLICATION_PRESETS = [
  { slug: "age-40", label: "Age 40 marriage question", age: 40, note: "Lands in the fifth sign, years 36-45." },
  { slug: "age-22", label: "Age 22 career check", age: 22, note: "Lands in the third sign, years 20-26." },
  { slug: "boundary-36", label: "Boundary discipline", age: 36, note: "Exactly at the start of the fifth window." },
];

export function buildWorkedTimeline(): CaraTimelineStep[] {
  let running = 0;
  return WORKED_SEQUENCE_INDEXES.map((rashiIndex, index) => {
    const years = WORKED_PERIODS[index];
    const cue = READING_CUES[index];
    const step = {
      order: index + 1,
      rashi: getPeriodRashi(rashiIndex),
      years,
      startAge: running,
      endAge: running + years,
      ...cue,
    };
    running += years;
    return step;
  });
}

export function findRunningStep(age: number, timeline = buildWorkedTimeline()) {
  return timeline.find((step) => age >= step.startAge && age < step.endAge) ?? timeline[timeline.length - 1];
}

export function buildAntarSteps(maha: CaraTimelineStep): AntarStep[] {
  const weights = [1.1, 0.9, 1.25, 0.8, 1.35, 0.75];
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  let running = 0;
  return weights.map((weight, index) => {
    const length = (maha.years * weight) / totalWeight;
    const rashi = getPeriodRashi(maha.rashi.index + index);
    const step = {
      order: index + 1,
      rashi,
      startOffset: running,
      endOffset: running + length,
      cue: index === 3 ? "Convergence window: antar repeats the event theme." : "Sub-window refines the main sign promise.",
    };
    running += length;
    return step;
  });
}

export function findRunningAntar(age: number, maha: CaraTimelineStep) {
  const offset = Math.max(0, Math.min(maha.years, age - maha.startAge));
  const steps = buildAntarSteps(maha);
  return steps.find((step) => offset >= step.startOffset && offset < step.endOffset) ?? steps[steps.length - 1];
}

export function frameHouse(step: CaraTimelineStep, frame: ReferenceFrame) {
  return frame === "lagna" ? step.lagnaHouse : step.arudhaHouse;
}

export function frameLabel(frame: ReferenceFrame) {
  return frame === "lagna" ? "Lagna" : "Arudha Lagna";
}

export function houseTheme(house: number) {
  const themes = [
    "self and body",
    "family and resources",
    "effort and siblings",
    "home and inner life",
    "children and intelligence",
    "service and contest",
    "partnership and marriage",
    "change and vulnerability",
    "dharma and guidance",
    "career and standing",
    "gains and networks",
    "expense and distance",
  ];
  return themes[house - 1] ?? "house theme";
}

export const READING_STACK = [
  { label: "Houses", text: "Count the dasha-sign from Lagna and from Arudha Lagna." },
  { label: "Karakas", text: "Check whether the life significator sits in or points to the running sign." },
  { label: "Rashi-drishti", text: "Name which signs and occupants aspect the running sign." },
  { label: "Argala", text: "Decide whether the matter can lock shut or is blocked." },
];

export const FRAME_COLORS = {
  lagna: grahas.surya.primary,
  arudha: grahas.shukra.primary,
};

