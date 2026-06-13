import { classifyRelation, getDigitRegister, relationLabel, relationScore, type Relation } from "../numerology-compatibility-calculator/data";

export type ObjectType = "house" | "phone" | "vehicle" | "other";
export type ChoiceStage = "pre-acquisition" | "already-owned";

export interface ObjectExample {
  id: string;
  label: string;
  type: ObjectType;
  value: string;
  method: string;
}

export interface ObjectResult {
  raw: string;
  digits: string;
  total: number;
  reduced: number;
  graha: string;
  devanagari: string;
  rootRelation: Relation;
  destinyRelation: Relation;
  score: number;
}

export const OBJECT_EXAMPLES: ObjectExample[] = [
  { id: "house-408", label: "House 408", type: "house", value: "408", method: "Unit number" },
  { id: "house-484", label: "House 484", type: "house", value: "484", method: "Unit number" },
  { id: "phone", label: "Phone ending 3210", type: "phone", value: "9876543210", method: "Full phone number" },
  { id: "vehicle", label: "KA-05-AB-1234", type: "vehicle", value: "KA-05-AB-1234", method: "Plate digits" },
];

export const OBJECT_CONTEXT: Record<ObjectType, { label: string; scope: string; cost: string; caution: string }> = {
  house: {
    label: "House / apartment",
    scope: "Use the most specific living identifier, usually unit or apartment number.",
    cost: "Very high cost to change; moving home is a major life decision.",
    caution: "Never reject an otherwise suitable home on 4/8 fear alone.",
  },
  phone: {
    label: "Phone number",
    scope: "Use the full number or a named convention such as last four digits.",
    cost: "Moderate friction to change; contacts, OTPs, banking, and business identity are affected.",
    caution: "A phone number can be a curiosity or tie-breaker, not a life-outcome switch.",
  },
  vehicle: {
    label: "Vehicle plate",
    scope: "Use the numerical plate portion; ignore state/RTO letters unless a tradition explicitly says otherwise.",
    cost: "Some pre-choice exists through vanity plates; post-change has fees and paperwork.",
    caution: "Do not promise safety, accidents, or fortune from a plate number.",
  },
  other: {
    label: "Other object",
    scope: "Use the digit string that actually identifies the object.",
    cost: "Choice and cost vary; name the practical stakes before advising.",
    caution: "Treat the number as contextual symbolism, not causal machinery.",
  },
};

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function sumDigits(value: string): number {
  return value.split("").reduce((total, char) => total + Number(char), 0);
}

function reduceToDigit(total: number): number {
  if (total <= 9) return total;
  return reduceToDigit(sumDigits(String(total)));
}

export function computeObjectResult(raw: string, mulanka: number, bhagyanka: number): ObjectResult | null {
  const digits = digitsOnly(raw);
  if (!digits) return null;
  const total = sumDigits(digits);
  const reduced = reduceToDigit(total);
  const register = getDigitRegister(reduced);
  const rootRelation = classifyRelation(mulanka, reduced);
  const destinyRelation = classifyRelation(bhagyanka, reduced);
  return {
    raw,
    digits,
    total,
    reduced,
    graha: register.graha,
    devanagari: register.devanagari,
    rootRelation,
    destinyRelation,
    score: relationScore(rootRelation) + relationScore(destinyRelation),
  };
}

export function resultNote(result: ObjectResult): string {
  return `${result.reduced} ${result.graha}: ${relationLabel(result.rootRelation)} with Mulanka, ${relationLabel(result.destinyRelation)} with Bhagyanka.`;
}

export function stageFrame(stage: ChoiceStage) {
  if (stage === "pre-acquisition") {
    return {
      label: "Pre-acquisition",
      title: "Legitimate as a tie-breaker",
      text: "When multiple options are genuinely similar on practical criteria, object-number register-fit can be one modest input.",
    };
  }

  return {
    label: "Already owned",
    title: "Do not create fear after the fact",
    text: "Lived experience and practical suitability matter more than retroactive number fear. Do not move, change phones, or change plates on numerology alone.",
  };
}
