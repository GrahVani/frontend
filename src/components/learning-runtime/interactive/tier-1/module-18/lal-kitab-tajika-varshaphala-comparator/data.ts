import { grahas } from "@/design-tokens/grahvani-learning/colors";

export type AnnualSystemKey = "lalKitab" | "tajika";
export type VerdictKey = "converge" | "divergeMaterial" | "divergeRemedy";

export interface AnnualSystemProfile {
  key: AnnualSystemKey;
  label: string;
  iast: string;
  devanagari: string;
  emphasis: string;
  frame: string;
  engine: string;
  output: string;
  color: string;
  accent: string;
  tools: string[];
}

export interface ToolGateItem {
  id: string;
  label: string;
  iast: string;
  belongsTo: AnnualSystemKey;
  why: string;
}

export interface VerdictScenario {
  key: VerdictKey;
  label: string;
  premise: string;
  choice: string;
  explanation: string;
  color: string;
}

export const ANNUAL_SYSTEMS: AnnualSystemProfile[] = [
  {
    key: "lalKitab",
    label: "Lal Kitab Varshphala",
    iast: "Lal Kitab varshphala",
    devanagari: "लाल किताब वर्षफल",
    emphasis: "Remedy-forward annual reading",
    frame: "Fixed-Aries Teva, no calculated annual lagna",
    engine: "Planet attributes plus blind, sleeping, and burning states",
    output: "What to do about the year through cheap, diagnosis-led upayas",
    color: grahas.mangala.primary,
    accent: "#8F6C1F",
    tools: ["Fixed-Aries Teva", "Lal Kitab states", "attribute redefinitions", "totka / upaya"],
  },
  {
    key: "tajika",
    label: "Tajika Varshaphala",
    iast: "Tajika varshaphala",
    devanagari: "ताजिक वर्षफल",
    emphasis: "Analysis-forward annual reading",
    frame: "Solar-return chart with calculated lagna",
    engine: "Muntha, varshesha, sahams, ithasala and isarapha inside orbs",
    output: "What the year holds in material detail",
    color: grahas.guru.primary,
    accent: "#356C96",
    tools: ["calculated lagna", "muntha", "varshesha", "sahams", "ithasala / isarapha"],
  },
];

export const TOOL_GATES: ToolGateItem[] = [
  {
    id: "fixed-teva",
    label: "Fixed-Aries Teva",
    iast: "Mesha-fixed Teva",
    belongsTo: "lalKitab",
    why: "Lal Kitab annual work keeps Aries fixed as house 1 instead of computing a fresh lagna.",
  },
  {
    id: "states",
    label: "Blind / sleeping / burning states",
    iast: "andha / sutela / jalta",
    belongsTo: "lalKitab",
    why: "These are Lal Kitab state-doctrine labels and do not judge a Tajika chart.",
  },
  {
    id: "upaya",
    label: "Cheap totka prescription",
    iast: "upaya",
    belongsTo: "lalKitab",
    why: "The Lal Kitab annual closes in remedy; Tajika is not built around household totke.",
  },
  {
    id: "muntha",
    label: "Muntha advances one sign per year",
    iast: "muntha",
    belongsTo: "tajika",
    why: "Muntha is a Tajika annual sensitive point; it is never inserted into a Lal Kitab Teva.",
  },
  {
    id: "saham",
    label: "Marriage or wealth saham",
    iast: "saham",
    belongsTo: "tajika",
    why: "Sahams are computed lots from the Tajika apparatus, taught fully in Module 19.",
  },
  {
    id: "ithasala",
    label: "Applying aspect within orb",
    iast: "ithasala",
    belongsTo: "tajika",
    why: "Tajika judges perfection and separation through degree-based applying and separating aspects.",
  },
];

export const VERDICT_SCENARIOS: VerdictScenario[] = [
  {
    key: "converge",
    label: "Both systems agree",
    premise: "The Lal Kitab Teva and the Tajika annual chart both favour the same year-theme.",
    choice: "Read it as high-confidence corroboration.",
    explanation: "Agreement matters because the methods remained independent. Do not merge the toolkits after they agree.",
    color: "#2F7D52",
  },
  {
    key: "divergeMaterial",
    label: "Divergence on material result",
    premise: "Lal Kitab cautions a planet, but Tajika gives a strong material promise through muntha and saham.",
    choice: "Use Tajika for the material forecast.",
    explanation: "Tajika is the analysis-forward system for fine annual detail, so it owns the material judgment.",
    color: grahas.guru.primary,
  },
  {
    key: "divergeRemedy",
    label: "Divergence on what to do",
    premise: "Tajika describes the year, while Lal Kitab identifies a burning or sleeping planet needing correction.",
    choice: "Use Lal Kitab for the remedy prescription.",
    explanation: "Lal Kitab is remedy-forward; its states diagnose which upaya belongs to the year.",
    color: grahas.mangala.primary,
  },
];

export function getSystem(key: AnnualSystemKey) {
  return ANNUAL_SYSTEMS.find((system) => system.key === key) ?? ANNUAL_SYSTEMS[0];
}

export function getVerdict(key: VerdictKey) {
  return VERDICT_SCENARIOS.find((scenario) => scenario.key === key) ?? VERDICT_SCENARIOS[0];
}
