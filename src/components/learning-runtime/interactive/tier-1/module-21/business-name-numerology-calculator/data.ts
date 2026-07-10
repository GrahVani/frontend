import { computeNameNumber, getNameResultForConvention, type Convention, type NumerologySystem } from "../mulanka-bhagyanka-namanka-calculator/data";
import { classifyRelation, getDigitRegister, relationLabel, relationScore, type Relation } from "../numerology-compatibility-calculator/data";

export type { Convention, NumerologySystem };
export type LaunchContext = "prelaunch" | "postlaunch";

export interface IndustryPreference {
  id: string;
  label: string;
  preferredDigits: number[];
  rationale: string;
  caveat: string;
}

export interface BusinessCandidateInput {
  name: string;
  nameForm: string;
}

export interface BusinessCandidateResult extends BusinessCandidateInput {
  total: number;
  digit: number;
  graha: string;
  devanagari: string;
  founderRootRelation: Relation;
  founderDestinyRelation: Relation;
  industryFit: "preferred" | "workable" | "off-register";
  score: number;
  note: string;
}

export const INDUSTRY_PREFERENCES: IndustryPreference[] = [
  {
    id: "commerce",
    label: "Commerce / SaaS / media",
    preferredDigits: [5, 3],
    rationale: "Budha-5 supports trade and communication; Guru-3 can fit advisory, publishing, and SaaS education layers.",
    caveat: "Budha does not guarantee revenue. Product-market fit, sales, capital, team, and execution still decide the business.",
  },
  {
    id: "luxury",
    label: "Luxury / hospitality / wellness",
    preferredDigits: [6, 1],
    rationale: "Shukra-6 supports beauty, comfort, taste, and agreement; Surya-1 can support premium authority.",
    caveat: "Aesthetic register-fit is not a substitute for service quality, pricing, and customer trust.",
  },
  {
    id: "education",
    label: "Education / advisory / publishing",
    preferredDigits: [3, 5],
    rationale: "Guru-3 supports teaching and guidance; Budha-5 supports language, systems, and learning tools.",
    caveat: "Wisdom-register branding still needs content quality and credible delivery.",
  },
  {
    id: "infrastructure",
    label: "Infrastructure / law / institutions",
    preferredDigits: [8, 1],
    rationale: "Shani-8 supports structure, endurance, law, and institutional seriousness; Surya-1 supports authority.",
    caveat: "Shani-8 is not a business curse. It asks for disciplined execution and long-horizon positioning.",
  },
  {
    id: "innovation",
    label: "Innovation / technology / foreign trade",
    preferredDigits: [4, 5],
    rationale: "Rahu-4 supports disruption, foreignness, and technical experimentation; Budha-5 supports product communication.",
    caveat: "Rahu-4 should be framed as unconventional drive, not fear. It does not cause failure.",
  },
  {
    id: "action",
    label: "Sports / defence / urgent services",
    preferredDigits: [9, 1],
    rationale: "Mangala-9 supports speed, courage, protection, and decisive action; Surya-1 supports command.",
    caveat: "Action-register names still need safety discipline, compliance, and operational maturity.",
  },
];

export const DEFAULT_CANDIDATES: BusinessCandidateInput[] = [
  { name: "CommerceFlow", nameForm: "Customer-facing brand" },
  { name: "Retail Axis", nameForm: "Common brand variant" },
  { name: "Flow Ledger", nameForm: "Product name" },
];

export function getIndustry(id: string): IndustryPreference {
  return INDUSTRY_PREFERENCES.find((item) => item.id === id) ?? INDUSTRY_PREFERENCES[0];
}

export function computeCandidate(
  candidate: BusinessCandidateInput,
  system: NumerologySystem,
  convention: Convention,
  founderMulanka: number,
  founderBhagyanka: number,
  industry: IndustryPreference
): BusinessCandidateResult | null {
  const result = computeNameNumber(candidate.name, system, convention);
  if (result.values.length === 0) return null;
  const digit = getNameResultForConvention(result, convention);
  const reducedDigit = digit > 9 ? Number(String(digit).split("").reduce((sum, char) => sum + Number(char), 0)) : digit;
  const register = getDigitRegister(reducedDigit);
  const founderRootRelation = classifyRelation(founderMulanka, reducedDigit);
  const founderDestinyRelation = classifyRelation(founderBhagyanka, reducedDigit);
  const industryFit = industry.preferredDigits.includes(reducedDigit)
    ? "preferred"
    : industry.preferredDigits.some((preferred) => classifyRelation(preferred, reducedDigit) === "mitra")
      ? "workable"
      : "off-register";
  const industryScore = industryFit === "preferred" ? 2 : industryFit === "workable" ? 1 : 0;
  const score = relationScore(founderRootRelation) + relationScore(founderDestinyRelation) + industryScore;

  return {
    ...candidate,
    total: result.totalSum,
    digit: reducedDigit,
    graha: register.graha,
    devanagari: register.devanagari,
    founderRootRelation,
    founderDestinyRelation,
    industryFit,
    score,
    note: `${relationLabel(founderRootRelation)} with founder root, ${relationLabel(founderDestinyRelation)} with founder destiny, ${industryFit.replace("-", " ")} for industry.`,
  };
}

export function launchContextFrame(context: LaunchContext) {
  if (context === "prelaunch") {
    return {
      label: "Pre-launch selection",
      tone: "Legitimate low-cost input",
      text: "Numerology can be one input while the name is still fluid, alongside brand strategy, trademark search, domain fit, memorability, and founder preference.",
    };
  }

  return {
    label: "Post-launch rebrand",
    tone: "High-cost decision",
    text: "A live business name carries SEO, trademark, customer memory, documents, and collateral. Rebrand only with convergent business grounds, never numerology alone.",
  };
}
