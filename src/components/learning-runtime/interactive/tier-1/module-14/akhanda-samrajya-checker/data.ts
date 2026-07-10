/**
 * Akhanda Sāmrājya Checker — Data Engine
 *
 * §7 interactive for Lesson 14.4.2.
 *
 * Provides multiple source definitions of Akhanda Sāmrājya Yoga,
 * condition-checking logic per source, and worked presets.
 */

export const RASHIS = [
  { num: 1, name: "Meṣa", lord: "mars" },
  { num: 2, name: "Vṛṣabha", lord: "venus" },
  { num: 3, name: "Mithuna", lord: "mercury" },
  { num: 4, name: "Karkaṭa", lord: "moon" },
  { num: 5, name: "Siṃha", lord: "sun" },
  { num: 6, name: "Kanyā", lord: "mercury" },
  { num: 7, name: "Tulā", lord: "venus" },
  { num: 8, name: "Vṛścika", lord: "mars" },
  { num: 9, name: "Dhanuṣa", lord: "jupiter" },
  { num: 10, name: "Makara", lord: "saturn" },
  { num: 11, name: "Kumbha", lord: "saturn" },
  { num: 12, name: "Mīna", lord: "jupiter" },
];

export function getLordOfHouse(house: number, lagnaSign: number): string {
  const signNum = ((lagnaSign - 1 + house - 1) % 12) + 1;
  const rashi = RASHIS.find((r) => r.num === signNum);
  return rashi?.lord ?? "sun";
}

export function getSignOfHouse(house: number, lagnaSign: number): number {
  return ((lagnaSign - 1 + house - 1) % 12) + 1;
}

export function isKendra(house: number): boolean {
  return [1, 4, 7, 10].includes(house);
}

export function isTrikona(house: number): boolean {
  return [1, 5, 9].includes(house);
}

export type Dignity = "exalted" | "moolatrikona" | "own" | "neutral" | "debilitated";

export interface DignityInfo {
  key: Dignity;
  label: string;
  strength: number;
  isStrong: boolean;
  isDebilitated: boolean;
}

export const DIGNITIES: DignityInfo[] = [
  { key: "exalted", label: "Exalted", strength: 100, isStrong: true, isDebilitated: false },
  { key: "moolatrikona", label: "Mūlatrikoṇa", strength: 90, isStrong: true, isDebilitated: false },
  { key: "own", label: "Own sign", strength: 80, isStrong: true, isDebilitated: false },
  { key: "neutral", label: "Neutral", strength: 50, isStrong: false, isDebilitated: false },
  { key: "debilitated", label: "Debilitated", strength: 0, isStrong: false, isDebilitated: true },
];

/* ─── Source definitions ─────────────────────────────────────────────────── */

export interface SourceVersion {
  key: string;
  label: string;
  source: string;
  description: string;
  conditions: {
    label: string;
    check: (params: CheckParams) => boolean;
    detail: (params: CheckParams) => string;
  }[];
}

export interface CheckParams {
  lagnaSign: number;
  lord2ndHouse: number;
  lord2ndDignity: Dignity;
  lord9thHouse: number;
  lord9thDignity: Dignity;
  lord11thHouse: number;
  lord11thDignity: Dignity;
  jupiterHouse: number;
  jupiterDignity: Dignity;
  lord4thHouse: number;
  lord4thDignity: Dignity;
}

export const SOURCE_VERSIONS: SourceVersion[] = [
  {
    key: "stub",
    label: "Standard version",
    source: "Common composite",
    description: "2nd/9th/11th lords strong in kendras + Jupiter in the 9th + strong 4th lord.",
    conditions: [
      {
        label: "2nd lord in kendra, strong",
        check: (p) => isKendra(p.lord2ndHouse) && DIGNITIES.find((d) => d.key === p.lord2ndDignity)!.isStrong,
        detail: (p) => `2nd lord in H${p.lord2ndHouse}${isKendra(p.lord2ndHouse) ? " (kendra)" : ""}, ${p.lord2ndDignity}`,
      },
      {
        label: "9th lord in kendra, strong",
        check: (p) => isKendra(p.lord9thHouse) && DIGNITIES.find((d) => d.key === p.lord9thDignity)!.isStrong,
        detail: (p) => `9th lord in H${p.lord9thHouse}${isKendra(p.lord9thHouse) ? " (kendra)" : ""}, ${p.lord9thDignity}`,
      },
      {
        label: "11th lord in kendra, strong",
        check: (p) => isKendra(p.lord11thHouse) && DIGNITIES.find((d) => d.key === p.lord11thDignity)!.isStrong,
        detail: (p) => `11th lord in H${p.lord11thHouse}${isKendra(p.lord11thHouse) ? " (kendra)" : ""}, ${p.lord11thDignity}`,
      },
      {
        label: "Jupiter in 9th, strong",
        check: (p) => p.jupiterHouse === 9 && DIGNITIES.find((d) => d.key === p.jupiterDignity)!.isStrong,
        detail: (p) => `Jupiter in H${p.jupiterHouse}${p.jupiterHouse === 9 ? " (9th)" : ""}, ${p.jupiterDignity}`,
      },
      {
        label: "4th lord strong",
        check: (p) => DIGNITIES.find((d) => d.key === p.lord4thDignity)!.isStrong,
        detail: (p) => `4th lord in H${p.lord4thHouse}, ${p.lord4thDignity}`,
      },
    ],
  },
  {
    key: "phaladipika",
    label: "Phaladīpikā variant",
    source: "Phaladīpikā",
    description: "Lord of 2nd/9th/11th in a kendra + Jupiter as lord of 2nd/5th/11th, well-placed.",
    conditions: [
      {
        label: "2nd/9th/11th lord in kendra",
        check: (p) => isKendra(p.lord2ndHouse) || isKendra(p.lord9thHouse) || isKendra(p.lord11thHouse),
        detail: (p) => `2nd: H${p.lord2ndHouse}${isKendra(p.lord2ndHouse) ? "✓" : ""} · 9th: H${p.lord9thHouse}${isKendra(p.lord9thHouse) ? "✓" : ""} · 11th: H${p.lord11thHouse}${isKendra(p.lord11thHouse) ? "✓" : ""}`,
      },
      {
        label: "Jupiter as 2nd/5th/11th lord",
        check: (p) => {
          const jupiterIsLord2 = getLordOfHouse(2, p.lagnaSign) === "jupiter";
          const jupiterIsLord5 = getLordOfHouse(5, p.lagnaSign) === "jupiter";
          const jupiterIsLord11 = getLordOfHouse(11, p.lagnaSign) === "jupiter";
          return jupiterIsLord2 || jupiterIsLord5 || jupiterIsLord11;
        },
        detail: (p) => {
          const houses: string[] = [];
          if (getLordOfHouse(2, p.lagnaSign) === "jupiter") houses.push("2nd");
          if (getLordOfHouse(5, p.lagnaSign) === "jupiter") houses.push("5th");
          if (getLordOfHouse(11, p.lagnaSign) === "jupiter") houses.push("11th");
          return houses.length > 0 ? `Jupiter lord of: ${houses.join(", ")}` : "Jupiter is not 2nd/5th/11th lord";
        },
      },
      {
        label: "Jupiter well-placed, strong",
        check: (p) => (isKendra(p.jupiterHouse) || isTrikona(p.jupiterHouse)) && DIGNITIES.find((d) => d.key === p.jupiterDignity)!.isStrong,
        detail: (p) => `Jupiter in H${p.jupiterHouse}${isKendra(p.jupiterHouse) || isTrikona(p.jupiterHouse) ? " (well-placed)" : ""}, ${p.jupiterDignity}`,
      },
    ],
  },
];

export interface CheckResult {
  present: boolean;
  strength: "strong" | "partial" | "absent";
  metCount: number;
  totalCount: number;
  conditionResults: { label: string; detail: string; met: boolean }[];
  notes: string[];
}

export function checkAkhanda(sourceKey: string, params: CheckParams): CheckResult {
  const source = SOURCE_VERSIONS.find((s) => s.key === sourceKey)!;
  const results = source.conditions.map((c) => ({
    label: c.label,
    detail: c.detail(params),
    met: c.check(params),
  }));

  const metCount = results.filter((r) => r.met).length;
  const totalCount = results.length;
  const present = metCount === totalCount;
  const strength = present ? "strong" : metCount >= totalCount / 2 ? "partial" : "absent";

  const notes: string[] = [];
  if (!present) {
    const missing = results.filter((r) => !r.met).map((r) => r.label);
    notes.push(`Missing: ${missing.join("; ")}.`);
  }
  if (present) {
    notes.push("Full stack present — this is genuinely rare.");
  }
  notes.push("Always cite which source's definition you applied.");

  return { present, strength, metCount, totalCount, conditionResults: results, notes };
}

export interface Preset {
  key: string;
  label: string;
  lagnaSign: number;
  lord2ndHouse: number;
  lord2ndDignity: Dignity;
  lord9thHouse: number;
  lord9thDignity: Dignity;
  lord11thHouse: number;
  lord11thDignity: Dignity;
  jupiterHouse: number;
  jupiterDignity: Dignity;
  lord4thHouse: number;
  lord4thDignity: Dignity;
  description: string;
}

export const PRESETS: Preset[] = [
  {
    key: "full-stack",
    label: "Full stack — standard",
    lagnaSign: 5, // Leo
    lord2ndHouse: 10, // Mercury in 10th (kendra)
    lord2ndDignity: "own",
    lord9thHouse: 1, // Mars in 1st (kendra)
    lord9thDignity: "moolatrikona",
    lord11thHouse: 4, // Mercury in 4th (kendra)
    lord11thDignity: "own",
    jupiterHouse: 9,
    jupiterDignity: "exalted",
    lord4thHouse: 7,
    lord4thDignity: "own",
    description: "Leo lagna: 2nd lord Mercury in 10th, 9th lord Mars in 1st, 11th lord Mercury in 4th, Jupiter exalted in 9th, 4th lord Mars strong.",
  },
  {
    key: "phaladipika-match",
    label: "Phaladīpikā match",
    lagnaSign: 9, // Sagittarius — Jupiter is lagna lord
    lord2ndHouse: 2, // Saturn in 2nd
    lord2ndDignity: "neutral",
    lord9thHouse: 10, // Sun in 10th (kendra)
    lord9thDignity: "own",
    lord11thHouse: 11, // Saturn in 11th
    lord11thDignity: "neutral",
    jupiterHouse: 1,
    jupiterDignity: "own",
    lord4thHouse: 4,
    lord4thDignity: "neutral",
    description: "Sagittarius lagna: Jupiter is 1st lord (counts as 2nd/5th/11th via lordship), 9th lord Sun in 10th (kendra). Fits Phaladīpikā variant.",
  },
  {
    key: "near-miss",
    label: "Near miss",
    lagnaSign: 1, // Aries
    lord2ndHouse: 3, // Venus in 3rd (not kendra)
    lord2ndDignity: "own",
    lord9thHouse: 10, // Jupiter in 10th (kendra)
    lord9thDignity: "exalted",
    lord11thHouse: 11, // Saturn in 11th (not kendra)
    lord11thDignity: "own",
    jupiterHouse: 10,
    jupiterDignity: "exalted",
    lord4thHouse: 4,
    lord4thDignity: "neutral",
    description: "2nd and 11th lords not in kendras — partial only. Shows how the full stack is rare.",
  },
];
