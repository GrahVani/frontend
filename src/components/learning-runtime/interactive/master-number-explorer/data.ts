import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";

export type MasterNumberId = 11 | 22 | 33;
export type ConventionId = "preserve" | "reduce";

export interface MasterNumber {
  value: MasterNumberId;
  label: string;
  devanagari: string;
  reducesTo: 2 | 4 | 6;
  underlying: string;
  grahaSlug: "candra" | "rahu" | "shukra";
  title: string;
  intensification: string;
  strengths: string[];
  shadows: string[];
  overclaim: string;
  honestFrame: string;
}

export const MASTER_NUMBERS: MasterNumber[] = [
  {
    value: 11,
    label: "Master Intuitive",
    devanagari: "गुरु ११",
    reducesTo: 2,
    underlying: "Candra-2",
    grahaSlug: "candra",
    title: "Visionary sensitivity and spiritual perception",
    intensification: "11 preserves the Candra register at higher amplitude: intuition, vision, receptivity, and subtle perception.",
    strengths: ["heightened intuition", "visionary inspiration", "spiritual perception", "sensitive guidance"],
    shadows: ["nervous overload", "ungrounded vision", "oversensitivity", "thin boundaries"],
    overclaim: "You are spiritually advanced by default.",
    honestFrame: "11 is amplified Candra. It suggests heightened sensitivity, not automatic spiritual maturity.",
  },
  {
    value: 22,
    label: "Master Builder",
    devanagari: "गुरु २२",
    reducesTo: 4,
    underlying: "Rahu-4",
    grahaSlug: "rahu",
    title: "Large-scale building and manifestation",
    intensification: "22 preserves the Rahu register at higher amplitude: unconventional vision made tangible through scale.",
    strengths: ["manifestation power", "large-scale building", "structural leadership", "vision-to-form execution"],
    shadows: ["over-reaching", "builder-ego inflation", "burnout from scale", "unstable foundations"],
    overclaim: "You are chosen for cosmic construction, but cursed by Rahu.",
    honestFrame: "22 is amplified Rahu-builder power. Refuse both specialness and Rahu fear-induction.",
  },
  {
    value: 33,
    label: "Master Teacher",
    devanagari: "गुरु ३३",
    reducesTo: 6,
    underlying: "Shukra-6",
    grahaSlug: "shukra",
    title: "Healing teaching and compassionate service",
    intensification: "33 preserves the Shukra register at higher amplitude: harmony, care, teaching, and relational healing.",
    strengths: ["healing presence", "compassionate teaching", "relational wisdom", "service at scale"],
    shadows: ["caretaker burnout", "loss of boundaries", "over-responsibility", "healer-role inflation"],
    overclaim: "You must sacrifice yourself as a master healer.",
    honestFrame: "33 is amplified Shukra. Service must remain bounded and sustainable.",
  },
];

export const CONVENTIONS: Array<{ id: ConventionId; label: string; note: string; color: string }> = [
  {
    id: "preserve",
    label: "Preserve",
    note: "Modern Western Pythagorean: stop at 11, 22, or 33.",
    color: ink.goldAccent,
  },
  {
    id: "reduce",
    label: "Reduce",
    note: "Vedic-flexible: continue to the single graha digit.",
    color: "#2F7D52",
  },
];

export function getMasterNumber(value: MasterNumberId) {
  return MASTER_NUMBERS.find((item) => item.value === value) ?? MASTER_NUMBERS[0];
}

export function grahaColor(item: MasterNumber) {
  if (item.grahaSlug === "candra") return "#5A6F96";
  if (item.grahaSlug === "shukra") return "#356C96";
  return grahas[item.grahaSlug].primary;
}
