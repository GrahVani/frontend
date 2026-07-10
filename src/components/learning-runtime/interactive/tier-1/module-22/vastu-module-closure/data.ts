export type ChapterKey = "origins" | "directions" | "elements" | "site" | "remediation" | "discipline";
export type PracticeModeKey = "chartContext" | "specialistReferral" | "teachingOnly";
export type VoiceKey = "concise" | "clientFacing" | "formal";

export interface Option<T extends string> {
  key: T;
  label: string;
  note: string;
}

export interface ChapterLayer extends Option<ChapterKey> {
  chapter: number;
  layer: string;
  practiceCue: string;
}

export interface Commitment {
  key: string;
  label: string;
  note: string;
}

export const CHAPTERS: ChapterLayer[] = [
  {
    key: "origins",
    chapter: 1,
    label: "Origins",
    layer: "Classical authority, Vastu Purusha Mandala, and key texts.",
    note: "Grounds the subject before modern claims are evaluated.",
    practiceCue: "Name the source layer before using a rule.",
  },
  {
    key: "directions",
    chapter: 2,
    label: "Directions",
    layer: "Cardinal and intercardinal dik-palas with room-direction synthesis.",
    note: "Builds the directional vocabulary used across the module.",
    practiceCue: "Translate direction into quality, not fear.",
  },
  {
    key: "elements",
    chapter: 3,
    label: "Elements",
    layer: "Earth, water, fire, air, and Brahmasthana-space discipline.",
    note: "Adds pancha-bhuta logic to the directional frame.",
    practiceCue: "Keep the center open and the elemental zones proportionate.",
  },
  {
    key: "site",
    chapter: 4,
    label: "Site and building",
    layer: "Plot selection, slope, house shape, extensions, and cuts.",
    note: "Turns symbolism into practical built-form evaluation.",
    practiceCue: "Check the actual building before prescribing.",
  },
  {
    key: "remediation",
    chapter: 5,
    label: "Remediation",
    layer: "Four-tier cascade, apartments, offices, mirrors, yantras, and pyramids.",
    note: "Teaches least-invasive correction with honest attribution.",
    practiceCue: "Start T1, escalate only with grounds and consent.",
  },
  {
    key: "discipline",
    chapter: 6,
    label: "Discipline",
    layer: "Honest handling, decision-framework, chart integration, and closure.",
    note: "Protects client and practitioner from over-claim.",
    practiceCue: "Context, not causation; literacy, not impersonated expertise.",
  },
];

export const COMMITMENTS: Commitment[] = [
  {
    key: "noDemolition",
    label: "No Vastu-only demolition",
    note: "Major structural action requires independent practical grounds.",
  },
  {
    key: "fourTest",
    label: "Four-test screen",
    note: "Empirical kernel, demolition block, cost-benefit, and over-claim check.",
  },
  {
    key: "cascade",
    label: "Sequential cascade",
    note: "T1 architectural, T2 symbolic, T3 yantra/pyramid, T4 ritual.",
  },
  {
    key: "chartContext",
    label: "Chart context, not causation",
    note: "Chart register informs Vastu discussion but never proves the house is wrong.",
  },
  {
    key: "twoLayers",
    label: "Empirical vs symbolic",
    note: "Separate light, air, drainage, and ergonomics from deity-symbolic layers.",
  },
];

export const PRACTICE_MODES: Option<PracticeModeKey>[] = [
  {
    key: "chartContext",
    label: "Chart-contextual mention",
    note: "I use Vastu inside Jyotisha consultations when client topic, chart-ground, or life-stage warrants it.",
  },
  {
    key: "specialistReferral",
    label: "Referral-first practice",
    note: "I name context but refer most floor-plan and site questions to a Vastu specialist.",
  },
  {
    key: "teachingOnly",
    label: "Teaching-only literacy",
    note: "I use M22 to explain principles, not to prescribe remedies for clients.",
  },
];

export const VOICES: Option<VoiceKey>[] = [
  { key: "concise", label: "Concise", note: "Short professional statement." },
  { key: "clientFacing", label: "Client-facing", note: "Warmer language suitable for client boundaries." },
  { key: "formal", label: "Formal", note: "Discipline-policy wording." },
];

export function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

export function findChapter(key: ChapterKey): ChapterLayer {
  return CHAPTERS.find((item) => item.key === key) ?? CHAPTERS[0];
}

export function buildStatement(mode: PracticeModeKey, voice: VoiceKey, selectedCommitments: string[]) {
  const modeText = findOption(PRACTICE_MODES, mode).note;
  const activeCommitments = COMMITMENTS.filter((item) => selectedCommitments.includes(item.key));
  const commitmentText = activeCommitments.map((item) => item.label.toLowerCase()).join(", ");
  const guardText = commitmentText || "the M22 do-no-harm floor";

  if (voice === "formal") {
    return `M22 VASTU DISCIPLINE STATEMENT\n\nScope: ${modeText}\n\nOperational commitments: I apply ${guardText}. I do not convert Vastu literacy into specialist authority, deterministic chart causation, or fear-based prescription.\n\nCascade: I begin with low-cost, reversible T1 adjustments and escalate only with client consent, honest attribution, and proportionate grounds.\n\nPlacement: M22 is my space-discipline milestone at 22 of 24 Tier 1 modules; M23 and M24 complete the time and ethics capstone arc.`;
  }

  if (voice === "clientFacing") {
    return `My Vastu literacy helps me name space-related context carefully. ${modeText}\n\nWhen I discuss Vastu, I keep the work practical and proportionate: ${guardText}. I will not use Vastu to create fear, guarantee outcomes, or recommend major action from one factor.\n\nIf a question needs floor-plan depth, construction judgement, or specialist site review, I will say so clearly and refer rather than overreach.`;
  }

  return `My M22 Vastu discipline: ${modeText}\n\nI commit to ${guardText}. I start with T1 practical adjustments, distinguish empirical from symbolic layers, and refuse Vastu-only demolition, guarantees, and chart-causation claims.\n\nM22 closes my space-literacy foundation and points me toward M23 time-discipline and M24 whole-practitioner ethics.`;
}
