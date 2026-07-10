/**
 * Engine for Lesson 21.3.4 — Personal Year Number calculator.
 *
 * Implements birth-date + current-year Personal Year computation under
 * strict-preservation and flexibility conventions, plus the 9-year cycle
 * visualisation and developmental-framing lookup.
 */

import {
  getRegister,
  type Convention,
} from "../bhagyanka-calculator/data";

export type { Convention };

export interface PersonalYearResult {
  day: number;
  month: number;
  targetYear: number;
  daySum: number;
  monthSum: number;
  yearSum: number;
  totalSum: number;
  strictResult: number;
  flexibleResult: number;
  steps: string[];
}

export interface CycleYear {
  year: number;
  personalYear: number;
  register: string;
  framing: string;
}

function sumDigits(n: number): number {
  return n.toString().split("").map(Number).reduce((a, b) => a + b, 0);
}

function reduceNumber(n: number, convention: Convention): number {
  if (n >= 1 && n <= 9) return n;
  if (convention === "strict" && (n === 11 || n === 22 || n === 33)) return n;
  if (n > 9) {
    const s = sumDigits(n);
    return reduceNumber(s, convention);
  }
  return n;
}

export function computePersonalYear(day: number, month: number, targetYear: number): PersonalYearResult {
  const dayDigits = day.toString().split("").map(Number);
  const monthDigits = month.toString().split("").map(Number);
  const yearDigits = targetYear.toString().split("").map(Number);

  const daySum = dayDigits.reduce((a, b) => a + b, 0);
  const monthSum = monthDigits.reduce((a, b) => a + b, 0);
  const yearSum = yearDigits.reduce((a, b) => a + b, 0);
  const totalSum = daySum + monthSum + yearSum;

  const strictResult = reduceNumber(totalSum, "strict");
  const flexibleResult = reduceNumber(totalSum, "flexible");

  const steps: string[] = [];
  steps.push(`Birth-day digits: ${dayDigits.join(", ")} -> sum = ${daySum}.`);
  steps.push(`Birth-month digits: ${monthDigits.join(", ")} -> sum = ${monthSum}.`);
  steps.push(`Current-year digits: ${yearDigits.join(", ")} -> sum = ${yearSum}.`);
  steps.push(`Total: ${daySum} + ${monthSum} + ${yearSum} = ${totalSum}.`);

  if (totalSum >= 10) {
    if (totalSum === 11 || totalSum === 22 || totalSum === 33) {
      steps.push(`Intermediate sum ${totalSum} is a master number.`);
      steps.push(`Strict-preservation: keep Master ${totalSum}; flexibility: reduce to ${flexibleResult}.`);
    } else {
      const reductionSteps: string[] = [];
      let current = totalSum;
      while (current > 9) {
        const next = sumDigits(current);
        if (current === 11 || current === 22 || current === 33) {
          reductionSteps.push(`${current} (master, flexibility reduces to ${next})`);
          current = next;
          break;
        }
        reductionSteps.push(`${current} -> ${next}`);
        current = next;
      }
      if (reductionSteps.length > 0) {
        steps.push(`Reduction path (flexibility): ${reductionSteps.join(", ")}.`);
      }
      if (strictResult !== flexibleResult) {
        steps.push(`Strict-preservation stops at Master ${strictResult}; flexibility reduces to ${flexibleResult}.`);
      } else {
        steps.push(`Result under both conventions: ${flexibleResult}.`);
      }
    }
  } else {
    steps.push(`Single-digit sum: Personal Year = ${totalSum}.`);
  }

  return { day, month, targetYear, daySum, monthSum, yearSum, totalSum, strictResult, flexibleResult, steps };
}

export function getResultForConvention(result: PersonalYearResult, convention: Convention): number {
  return convention === "strict" ? result.strictResult : result.flexibleResult;
}

export const PY_FRAMEWORK: Record<number, { register: string; framing: string }> = {
  1: { register: "Sūrya", framing: "New-beginnings / initiation / plant-seeds year" },
  2: { register: "Candra", framing: "Partnership-development / relational / patience year" },
  3: { register: "Guru", framing: "Expansion-expression / wisdom-teaching / creative year" },
  4: { register: "Rāhu", framing: "Foundation-building / disciplined-work / structure year" },
  5: { register: "Budha", framing: "Change-communication / freedom / adaptation year" },
  6: { register: "Śukra", framing: "Harmony-responsibility / relational-care / aesthetic year" },
  7: { register: "Ketu", framing: "Introspection-reflection / spiritual-deepening / inner-work year" },
  8: { register: "Śani", framing: "Mastery-material / karmic-discipline-rewards / recognition year" },
  9: { register: "Maṅgala", framing: "Completion-release / culmination / action-completion year" },
};

export function getDevelopmentalFraming(value: number): { register: string; framing: string } | null {
  if (value >= 1 && value <= 9) return PY_FRAMEWORK[value];
  if (value === 11) return { register: "Candra (Master Intuitive)", framing: "Intensified partnership-intuition / relational rhythm year" };
  if (value === 22) return { register: "Rāhu (Master Builder)", framing: "Intensified foundation-building / large-structure rhythm year" };
  if (value === 33) return { register: "Śukra (Master Teacher)", framing: "Intensified harmony-responsibility / relational-care rhythm year" };
  return null;
}

export function computeNineYearCycle(day: number, month: number, startYear: number): CycleYear[] {
  const cycle: CycleYear[] = [];
  for (let offset = 0; offset < 9; offset += 1) {
    const year = startYear + offset;
    const result = computePersonalYear(day, month, year);
    const py = getResultForConvention(result, "flexible");
    const frame = getDevelopmentalFraming(py);
    cycle.push({
      year,
      personalYear: py,
      register: frame?.register ?? "—",
      framing: frame?.framing ?? "—",
    });
  }
  return cycle;
}

export interface WorkedExample {
  id: number;
  label: string;
  day: number;
  month: number;
  targetYear: number;
  strictResult: number;
  flexibleResult: number;
  register: string;
  notes: string[];
}

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    id: 1,
    label: "§1 hook client",
    day: 15,
    month: 8,
    targetYear: 2026,
    strictResult: 6,
    flexibleResult: 6,
    register: "Śukra — harmony-responsibility year",
    notes: [
      "1+5 + 0+8 + 2+0+2+6 = 6 + 8 + 10 = 24 -> 2+4 = 6.",
      "Cycle continues 2027=PY7 (Ketu), 2028=PY8 (Śani), 2029=PY9 (Maṅgala), 2030=PY1 (Sūrya — cycle reset).",
    ],
  },
  {
    id: 2,
    label: "Personal Year 8 with Sade-Sati conflation refusal",
    day: 17,
    month: 1,
    targetYear: 2028,
    strictResult: 8,
    flexibleResult: 8,
    register: "Śani — mastery-material year",
    notes: [
      "1+7 + 0+1 + 2+0+2+8 = 8 + 1 + 12 = 21 -> 2+1 = 8.",
      "PY8 is Śani rhythm-theme, NOT Sade-Sati. Refuse fear-induction / whole-year-blocks framing.",
    ],
  },
  {
    id: 3,
    label: "Personal Year 1 with success-guarantee refusal",
    day: 10,
    month: 3,
    targetYear: 2031,
    strictResult: 1,
    flexibleResult: 1,
    register: "Sūrya — new-beginnings year",
    notes: [
      "1+0 + 0+3 + 2+0+3+1 = 1 + 3 + 6 = 10 -> 1+0 = 1.",
      "Refuse *PY1 guarantees new-venture success* over-claim. Rhythm-context only.",
    ],
  },
];

export const WORKFLOW_STEPS = [
  {
    title: "Take birth-day + birth-month + current-calendar-year digits",
    text: "Sum all individual digits. For double-digit day/month, sum the digits; for the year, sum all four digits.",
  },
  {
    title: "Reduce to single-digit (1-9) or preserve master-number",
    text: "Apply strict-preservation (keep 11/22/33) or flexibility (reduce) per chosen convention from Lesson 21.2.4.",
  },
  {
    title: "Identify the year-specific graha-aṅka register",
    text: "Map the result to Sūrya (1) through Maṅgala (9) or to the master-register intensification.",
  },
  {
    title: "Frame the 9-year developmental rhythm",
    text: "Place the year in its 1->9 cycle position. PY1 = plant-seeds initiation; PY9 = completion-release; then reset.",
  },
  {
    title: "Read multivalently + apply caveats",
    text: "Use strengths AND shadows. Apply Rāhu (4), Ketu (7), Śani (8), Maṅgala (9), and master-number caveats as applicable.",
  },
  {
    title: "Add the year-as-determinant refusal layer",
    text: "Refuse *PY1 guarantees success / PY7 guarantees difficulty / PY8 guarantees material gain* over-claims. Personal Year is rhythm-context, not year-outcome-determinant.",
  },
];

export { getRegister };
