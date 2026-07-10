import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import { buildWorkedTimeline, findRunningStep, houseTheme, type CaraTimelineStep } from "../cara-dasha-timeline/data";

export type Matter = "marriage" | "career" | "home" | "spiritual" | "mixed";

export interface VimshottariWindow {
  order: number;
  lord: GrahaSlug;
  label: string;
  startAge: number;
  endAge: number;
  matter: Matter;
  cue: string;
}

export interface DualPreset {
  slug: string;
  label: string;
  age: number;
  note: string;
}

export const DUAL_PRESETS: DualPreset[] = [
  { slug: "convergent-marriage", label: "Convergent marriage", age: 40, note: "Cara and Vimshottari both point to partnership." },
  { slug: "divergent-career-home", label: "Layered period", age: 30, note: "Vimshottari highlights career while Cara highlights resistance/home texture." },
  { slug: "do-not-force", label: "Do not force", age: 47, note: "A real divergence should stay visible." },
];

export const VIMSHOTTARI_WINDOWS: VimshottariWindow[] = [
  { order: 1, lord: "ketu", label: "Ketu", startAge: 0, endAge: 7, matter: "spiritual", cue: "Detachment and karmic clearing dominate the planetary lens." },
  { order: 2, lord: "shukra", label: "Venus", startAge: 7, endAge: 27, matter: "marriage", cue: "Venus supports relationship, arts, and desire fulfillment." },
  { order: 3, lord: "surya", label: "Sun", startAge: 27, endAge: 33, matter: "career", cue: "Sun foregrounds status, authority, and public visibility." },
  { order: 4, lord: "candra", label: "Moon", startAge: 33, endAge: 43, matter: "marriage", cue: "In this worked chart Moon carries the partnership promise through 7th-lordship." },
  { order: 5, lord: "mangala", label: "Mars", startAge: 43, endAge: 50, matter: "home", cue: "Mars activates property, land, and active domestic change." },
  { order: 6, lord: "rahu", label: "Rahu", startAge: 50, endAge: 68, matter: "mixed", cue: "Rahu amplifies foreign, unconventional, and mixed threads." },
  { order: 7, lord: "guru", label: "Jupiter", startAge: 68, endAge: 84, matter: "spiritual", cue: "Jupiter emphasizes counsel, children, and dharma." },
  { order: 8, lord: "shani", label: "Saturn", startAge: 84, endAge: 103, matter: "career", cue: "Saturn emphasizes duty, endurance, and structured responsibility." },
  { order: 9, lord: "budha", label: "Mercury", startAge: 103, endAge: 120, matter: "career", cue: "Mercury emphasizes trade, skill, writing, and analysis." },
];

export function matterForCara(step: CaraTimelineStep): Matter {
  if (step.lagnaHouse === 7 || step.arudhaHouse === 7 || step.arudhaHouse === 11) return "marriage";
  if (step.lagnaHouse === 10 || step.arudhaHouse === 10) return "career";
  if (step.lagnaHouse === 4 || step.arudhaHouse === 4 || step.lagnaHouse === 6) return "home";
  if (step.lagnaHouse === 9 || step.arudhaHouse === 9 || step.lagnaHouse === 12) return "spiritual";
  return "mixed";
}

export function matterLabel(matter: Matter) {
  const labels: Record<Matter, string> = {
    marriage: "Marriage / partnership",
    career: "Career / status",
    home: "Home / property",
    spiritual: "Dharma / withdrawal",
    mixed: "Mixed thread",
  };
  return labels[matter];
}

export function findVimshottariWindow(age: number) {
  return VIMSHOTTARI_WINDOWS.find((window) => age >= window.startAge && age < window.endAge) ?? VIMSHOTTARI_WINDOWS[VIMSHOTTARI_WINDOWS.length - 1];
}

export function compareAtAge(age: number) {
  const cara = findRunningStep(age, buildWorkedTimeline());
  const vimshottari = findVimshottariWindow(age);
  const caraMatter = matterForCara(cara);
  const convergent = caraMatter === vimshottari.matter || vimshottari.matter === "mixed";
  return {
    cara,
    vimshottari,
    caraMatter,
    vimshottariMatter: vimshottari.matter,
    convergent,
    verdict: convergent ? "Convergence: stronger confidence" : "Divergence: keep both threads",
    discipline: convergent
      ? "Two independent timing lenses point at the same matter in the same window."
      : "Do not recompute or cherry-pick. Report the layered period honestly.",
  };
}

export function caraCue(step: CaraTimelineStep) {
  return `H${step.lagnaHouse} from Lagna (${houseTheme(step.lagnaHouse)}), H${step.arudhaHouse} from AL (${houseTheme(step.arudhaHouse)}).`;
}

export function grahaColor(slug: GrahaSlug) {
  return grahas[slug].primary;
}

