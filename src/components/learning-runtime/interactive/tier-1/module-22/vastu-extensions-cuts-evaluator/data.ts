export type OperationKey = "extension" | "cut";
export type DirectionKey = "ne" | "east" | "north" | "sw" | "se" | "nw" | "south" | "west";
export type SizeKey = "mild" | "moderate" | "major";
export type ContextKey = "preConstruction" | "existingHome" | "apartment" | "renovation";
export type VerdictKey = "auspicious" | "secondary" | "neutral" | "mixed" | "avoid" | "moderate" | "severe" | "critical";

export interface Option<T extends string> {
  key: T;
  label: string;
  note: string;
}

export interface DirectionReading {
  verdict: VerdictKey;
  headline: string;
  principle: string;
  mitigation: string;
}

export const OPERATIONS: Option<OperationKey>[] = [
  { key: "extension", label: "Extension adds area", note: "A projection grows the footprint beyond the regular rectangle." },
  { key: "cut", label: "Cut removes area", note: "A missing portion reduces the canonical rectangular footprint." },
];

export const DIRECTIONS: Option<DirectionKey>[] = [
  { key: "ne", label: "NE", note: "Isana head-zone, water and sacred openness." },
  { key: "east", label: "E", note: "Indra, rising light, entrance and study support." },
  { key: "north", label: "N", note: "Kubera, cool pole, wealth and reception support." },
  { key: "sw", label: "SW", note: "Nairrti feet-zone, weight, privacy and grounding." },
  { key: "se", label: "SE", note: "Agni zone, kitchen and controlled fire." },
  { key: "nw", label: "NW", note: "Vayu zone, movement, guests and dispersal." },
  { key: "south", label: "S", note: "Yama direction, heat and restraint." },
  { key: "west", label: "W", note: "Varuna direction, containment and order." },
];

export const SIZES: Option<SizeKey>[] = [
  { key: "mild", label: "Mild", note: "Small deviation; read direction first, then handle proportionally." },
  { key: "moderate", label: "Moderate", note: "Large enough to affect the zone and room placement." },
  { key: "major", label: "Major", note: "Major footprint change; severity is amplified." },
];

export const CONTEXTS: Option<ContextKey>[] = [
  { key: "preConstruction", label: "Pre-construction", note: "Best stage for architectural correction before foundation." },
  { key: "existingHome", label: "Existing home", note: "Compare structural correction with symbolic mitigation." },
  { key: "apartment", label: "Apartment", note: "Footprint is fixed; work with internal zoning and symbolic support." },
  { key: "renovation", label: "Renovation", note: "Respect engineering, code, budget, and practical constraints." },
];

export const EXTENSION_READINGS: Record<DirectionKey, DirectionReading> = {
  ne: {
    verdict: "auspicious",
    headline: "Best extension",
    principle: "NE extension expands the sacred head-zone and keeps the house open toward Isana.",
    mitigation: "Preserve it clean, light, low, and uncluttered; do not convert it into heavy storage.",
  },
  east: {
    verdict: "secondary",
    headline: "Auspicious secondary",
    principle: "East extension strengthens light, entry, and Indra-quarter visibility.",
    mitigation: "Keep the addition bright and proportionate; avoid blocking the NE.",
  },
  north: {
    verdict: "secondary",
    headline: "Auspicious secondary",
    principle: "North extension supports Kubera-quarter reception and cool growth.",
    mitigation: "Use it for clean work, reception, study, or treasury-style functions.",
  },
  sw: {
    verdict: "mixed",
    headline: "Mixed, weight-bearing",
    principle: "SW extension adds grounding, but can over-weight the feet-zone if NE openness is lost.",
    mitigation: "Keep SW heavy and stable, while protecting NE light and water balance.",
  },
  se: {
    verdict: "avoid",
    headline: "Avoid if large",
    principle: "SE extension over-amplifies Agni and can make fire/heat dominate the plan.",
    mitigation: "Contain kitchen heat, ventilate well, and use symbolic cooling if the addition is fixed.",
  },
  nw: {
    verdict: "avoid",
    headline: "Avoid if large",
    principle: "NW extension over-amplifies Vayu, increasing motion and instability.",
    mitigation: "Use light, ventilated, transient functions and avoid making it the main mass.",
  },
  south: {
    verdict: "avoid",
    headline: "Avoid",
    principle: "South extension increases the hot restraint-direction and can make the form heavy downward.",
    mitigation: "Keep it service-oriented, shaded, and structurally disciplined if unavoidable.",
  },
  west: {
    verdict: "neutral",
    headline: "Mostly neutral",
    principle: "West extension is not usually as load-bearing as SW or as sensitive as NE.",
    mitigation: "Keep proportion moderate and avoid compounding it with NE/SW cuts.",
  },
};

export const CUT_READINGS: Record<DirectionKey, DirectionReading> = {
  ne: {
    verdict: "severe",
    headline: "Severe head-zone cut",
    principle: "NE cut removes the sacred head-zone; it is the opposite of an NE extension.",
    mitigation: "Architectural restoration is best; otherwise mark the geometric NE with light, water, pillar, and puja placement.",
  },
  east: {
    verdict: "moderate",
    headline: "Moderate edge loss",
    principle: "East cut reduces light, entrance strength, and Indra-quarter visibility.",
    mitigation: "Recover light, entry rhythm, and clean eastern use where possible.",
  },
  north: {
    verdict: "moderate",
    headline: "Moderate edge loss",
    principle: "North cut reduces Kubera-quarter support and cool reception.",
    mitigation: "Strengthen northern openness, orderly storage, and clean financial functions.",
  },
  sw: {
    verdict: "severe",
    headline: "Severe feet-zone cut",
    principle: "SW cut removes the grounding feet-zone and weakens structural symbolism.",
    mitigation: "Restore mass if feasible; otherwise add weight, boundary, dense landscape, and grounded room use.",
  },
  se: {
    verdict: "moderate",
    headline: "Moderate Agni cut",
    principle: "SE cut removes the kitchen/fire host-corner, a secondary-axis problem.",
    mitigation: "Relocate or stabilize kitchen fire, preferably using the next workable fire discipline.",
  },
  nw: {
    verdict: "moderate",
    headline: "Moderate Vayu cut",
    principle: "NW cut reduces movement and guest/dispersal support.",
    mitigation: "Restore ventilation, movement, and light transient functions near the available NW.",
  },
  south: {
    verdict: "moderate",
    headline: "Mild to moderate edge cut",
    principle: "South edge loss affects restraint and service rhythm, but is less critical than NE/SW corner loss.",
    mitigation: "Use boundary correction, shading, and service placement discipline.",
  },
  west: {
    verdict: "moderate",
    headline: "Mild to moderate edge cut",
    principle: "West edge loss affects containment and Varuna-quarter order.",
    mitigation: "Use boundary rhythm, storage order, and proportional symbolic completion.",
  },
};

export function rankVerdict(verdict: VerdictKey) {
  return {
    auspicious: 0,
    secondary: 1,
    neutral: 2,
    mixed: 3,
    avoid: 4,
    moderate: 5,
    severe: 6,
    critical: 7,
  }[verdict];
}

export function verdictLabel(verdict: VerdictKey) {
  if (verdict === "auspicious") return "Auspicious";
  if (verdict === "secondary") return "Auspicious secondary";
  if (verdict === "neutral") return "Neutral";
  if (verdict === "mixed") return "Mixed";
  if (verdict === "avoid") return "Avoid";
  if (verdict === "moderate") return "Moderate";
  if (verdict === "severe") return "Severe";
  return "Critical";
}

export function getBaseReading(operation: OperationKey, direction: DirectionKey) {
  return operation === "extension" ? EXTENSION_READINGS[direction] : CUT_READINGS[direction];
}

export function amplifyVerdict(base: VerdictKey, size: SizeKey) {
  if (size === "major" && base === "severe") return "critical";
  if (size === "major" && (base === "moderate" || base === "avoid")) return "severe";
  if (size === "moderate" && base === "avoid") return "moderate";
  if (size === "mild" && base === "moderate") return "mixed";
  return base;
}
