/**
 * Engine for Lesson 21.3.2 — Bhāgyāṅka calculator.
 *
 * Implements full-birth-date-to-Bhāgyāṅka computation under strict-preservation
 * and flexibility conventions, plus Mūlāṅka for combined lifetime-arc reading.
 */

export type Convention = "strict" | "flexible";

export interface GrahaRegister {
  digit: number;
  graha: string;
  devanagari: string;
  caveat?: string;
}

export const GRAHA_REGISTERS: Record<number, GrahaRegister> = {
  1: { digit: 1, graha: "Sūrya", devanagari: "सूर्य" },
  2: { digit: 2, graha: "Candra", devanagari: "चन्द्र" },
  3: { digit: 3, graha: "Guru", devanagari: "गुरु" },
  4: { digit: 4, graha: "Rāhu", devanagari: "राहु", caveat: "Rāhu shadow-graha caveat — refuse cursed / destined-for-disasters / spiritually-deficient fear-induction patterns." },
  5: { digit: 5, graha: "Budha", devanagari: "बुध" },
  6: { digit: 6, graha: "Śukra", devanagari: "शुक्र" },
  7: { digit: 7, graha: "Ketu", devanagari: "केतु", caveat: "Ketu shadow-graha caveat — refuse spiritually-cursed / disconnected / must-change-Bhāgyāṅka-to-gain-warmth fear-induction patterns." },
  8: { digit: 8, graha: "Śani", devanagari: "शनि", caveat: "Śani kruratama + Sade-Sati conflation caveat — refuse deterministic punishment / lifelong-delay / Bhāgyāṅka-8-equals-perpetual-Sade-Sati framings." },
  9: { digit: 9, graha: "Maṅgala", devanagari: "मङ्गल", caveat: "Conscious-channeling reframe — use Maṅgala energy purposefully; refuse all-shadows aggression framings." },
};

export interface MasterRegister {
  master: number;
  baseDigit: number;
  baseGraha: string;
  label: string;
  caveat: string;
}

export const MASTER_REGISTERS: Record<number, MasterRegister> = {
  11: {
    master: 11,
    baseDigit: 2,
    baseGraha: "Candra",
    label: "Master Intuitive",
    caveat: "Master-number SPECIAL over-claim refusal — refuse cosmically-chosen / advanced-by-default framings; intensified-amplitude Candra-2.",
  },
  22: {
    master: 22,
    baseDigit: 4,
    baseGraha: "Rāhu",
    label: "Master Builder",
    caveat: "Compounded Rāhu + master-SPECIAL caveat — refuse both cursed framings and cosmically-chosen-for-construction framings; conscious-integration critical.",
  },
  33: {
    master: 33,
    baseDigit: 6,
    baseGraha: "Śukra",
    label: "Master Teacher",
    caveat: "Master-33 SPECIAL + destiny-determinism refusal — refuse destined-for-exceptional-contribution / chosen-for-healing-service / fixed-cosmic-purpose framings; intensified-amplitude Śukra-6.",
  },
};

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

export interface ComputationResult {
  day: number;
  month: number;
  year: number;
  allDigits: number[];
  totalSum: number;
  strictResult: number;
  flexibleResult: number;
  steps: string[];
}

export function computeBhagyanka(day: number, month: number, year: number): ComputationResult {
  const dayDigits = day.toString().split("").map(Number);
  const monthDigits = month.toString().split("").map(Number);
  const yearDigits = year.toString().split("").map(Number);
  const allDigits = [...dayDigits, ...monthDigits, ...yearDigits];
  const totalSum = allDigits.reduce((a, b) => a + b, 0);

  const steps: string[] = [];
  steps.push(`Birth-date: ${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}.`);
  steps.push(`Sum all digits: ${allDigits.join(" + ")} = ${totalSum}.`);

  const strictResult = reduceNumber(totalSum, "strict");
  const flexibleResult = reduceNumber(totalSum, "flexible");

  if (totalSum >= 10) {
    if (totalSum === 11 || totalSum === 22 || totalSum === 33) {
      steps.push(`Intermediate sum ${totalSum} is a master number.`);
      steps.push(`Strict-preservation: keep Master ${totalSum}; flexibility: reduce to ${flexibleResult}.`);
    } else {
      // Show the reduction path for flexibility
      let current = totalSum;
      const reductionSteps: string[] = [];
      while (current > 9) {
        const next = sumDigits(current);
        if (current === 11 || current === 22 || current === 33) {
          reductionSteps.push(`${current} (master, flexibility reduces to ${next})`);
          current = next;
          break;
        }
        reductionSteps.push(`${current} → ${next}`);
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
    steps.push(`Single-digit sum: Bhāgyāṅka = ${totalSum}.`);
  }

  return { day, month, year, allDigits, totalSum, strictResult, flexibleResult, steps };
}

export function computeMulanka(day: number): number {
  if (day >= 1 && day <= 9) return day;
  const s = sumDigits(day);
  if (s === 11 || s === 22) {
    // flexibility default for combined reading
    return sumDigits(s);
  }
  return s >= 10 ? sumDigits(s) : s;
}

export function getResultForConvention(result: ComputationResult, convention: Convention): number {
  return convention === "strict" ? result.strictResult : result.flexibleResult;
}

export function getRegister(result: number): GrahaRegister | MasterRegister | null {
  if (result >= 1 && result <= 9) return GRAHA_REGISTERS[result];
  if (result === 11 || result === 22 || result === 33) return MASTER_REGISTERS[result];
  return null;
}

export interface WorkedExample {
  id: number;
  label: string;
  day: number;
  month: number;
  year: number;
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
    year: 1990,
    strictResult: 33,
    flexibleResult: 6,
    register: "Strict: Master Teacher (intensified Śukra); Flexible: Śukra",
    notes: [
      "Mūlāṅka 6 (Śukra) + Bhāgyāṅka 33/6 = Śukra root deepening into Śukra destiny.",
      "Master-33 SPECIAL over-claim refused; destiny-determinism refused.",
    ],
  },
  {
    id: 2,
    label: "Rāhu-to-Ketu lifetime-arc",
    day: 13,
    month: 4,
    year: 1970,
    strictResult: 7,
    flexibleResult: 7,
    register: "Ketu",
    notes: [
      "Mūlāṅka 4 (Rāhu) + Bhāgyāṅka 7 (Ketu) = classical prārabdha-trajectory.",
      "Rāhu + Ketu shadow-graha caveats both apply; refuse doubly-cursed framings.",
    ],
  },
  {
    id: 3,
    label: "Śani destiny with Sade-Sati conflation refusal",
    day: 17,
    month: 1,
    year: 1988,
    strictResult: 8,
    flexibleResult: 8,
    register: "Śani",
    notes: [
      "1+7+0+1+1+9+8+8 = 35 → 3+5 = 8.",
      "Bhāgyāṅka 8 ≠ perpetual Sade-Sati; refuse the conflation.",
    ],
  },
  {
    id: 4,
    label: "Same-graha coherent trajectory",
    day: 24,
    month: 6,
    year: 1995,
    strictResult: 9,
    flexibleResult: 9,
    register: "Maṅgala",
    notes: [
      "2+4+0+6+1+9+9+5 = 36 → 3+6 = 9.",
      "Mūlāṅka 6 (Śukra) + Bhāgyāṅka 9 (Maṅgala) = relational foundation moving toward action-completion.",
    ],
  },
];

export const WORKFLOW_STEPS = [
  {
    title: "Compute the Bhāgyāṅka",
    text: "Sum all digits of the full birth-date (DD-MM-YYYY). Reduce to single-digit (1-9) or preserve master-number 11/22/33 per chosen convention.",
  },
  {
    title: "Identify the graha-aṅka register",
    text: "Map the result to its graha or master register. Master 11 = intensified Candra; Master 22 = intensified Rāhu; Master 33 = intensified Śukra.",
  },
  {
    title: "Articulate strengths AND shadows",
    text: "Read the register multivalently per Lesson 21.2.1. Refuse all-strengths AND all-shadows single-direction readings.",
  },
  {
    title: "Apply specific caveats",
    text: "Rāhu (4), Ketu (7), Śani (8), Maṅgala (9) shadow-graha caveats; master-number SPECIAL over-claim refusal for 11/22/33.",
  },
  {
    title: "Refuse over-claim framings",
    text: "Including the SPECIFIC destiny-determinism layer: *your DESTINY is X; you cannot escape it* / *Bhāgyāṅka determines your life-outcomes*. Refused per Lesson 22.6.3.",
  },
];

export function getLifetimeArc(mulankaDigit: number, bhagyankaDigit: number): string {
  if (mulankaDigit === bhagyankaDigit) {
    const reg = GRAHA_REGISTERS[mulankaDigit];
    return `Same-graha coherent trajectory — ${reg.graha} root deepening into ${reg.graha} destiny. The ${reg.graha.toLowerCase()}-register qualities carry through the lifetime, intensifying or maintaining.`;
  }
  const mReg = GRAHA_REGISTERS[mulankaDigit];
  const bReg = GRAHA_REGISTERS[bhagyankaDigit];

  const arcs: Record<string, string> = {
    "4-7": "Classical Rāhu-to-Ketu prārabdha-trajectory — from outward-grasping shadow-register toward inward-releasing contemplative register.",
    "1-8": "Leadership-foundation (Sūrya) deepening into karmic discipline and structure-builder authority (Śani) — late-flowering authority pattern.",
    "3-7": "Wisdom-expansion (Guru) deepening into mokṣa / contemplative realisation (Ketu) — from teaching-and-counsel toward inward-realisation.",
    "5-9": "Intellectual-communication foundation (Budha) moving toward action-execution and completion (Maṅgala) — from thinking toward doing.",
  };

  const key = `${mulankaDigit}-${bhagyankaDigit}`;
  if (arcs[key]) return arcs[key];
  return `Cross-graha trajectory — ${mReg.graha} root moving toward ${bReg.graha} destiny. The life moves from one register-orientation to another.`;
}
