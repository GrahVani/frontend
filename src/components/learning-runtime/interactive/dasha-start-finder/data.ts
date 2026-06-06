import { DASHA_LORDS, type DashaLord } from "../dasha-timeline/data";
import { NAKSHATRAS, type NakshatraData } from "../nakshatra-data";

export const NAKSHATRA_SPAN_ARC_MINUTES = 800;

export interface DashaNakshatraGroup {
  lord: DashaLord;
  nakshatraNums: [number, number, number];
}

export interface DashaStartMapping {
  nakshatra: NakshatraData;
  lord: DashaLord;
  cycle: 1 | 2 | 3;
}

export const DASHA_NAKSHATRA_GROUPS: DashaNakshatraGroup[] = DASHA_LORDS.map((lord, index) => ({
  lord,
  nakshatraNums: [index + 1, index + 10, index + 19] as [number, number, number],
}));

export const DASHA_START_MAPPINGS: DashaStartMapping[] = NAKSHATRAS.map((nakshatra) => {
  const lordIndex = (nakshatra.num - 1) % DASHA_LORDS.length;
  return {
    nakshatra,
    lord: DASHA_LORDS[lordIndex],
    cycle: Math.floor((nakshatra.num - 1) / DASHA_LORDS.length) + 1 as 1 | 2 | 3,
  };
});

export function getDashaStartMapping(nakshatraNum: number): DashaStartMapping {
  return DASHA_START_MAPPINGS.find((item) => item.nakshatra.num === nakshatraNum) ?? DASHA_START_MAPPINGS[0];
}

export function getNakshatrasForLord(lordIndex: number): NakshatraData[] {
  const group = DASHA_NAKSHATRA_GROUPS.find((item) => item.lord.index === lordIndex) ?? DASHA_NAKSHATRA_GROUPS[0];
  return group.nakshatraNums.map((num) => NAKSHATRAS.find((nakshatra) => nakshatra.num === num)!).filter(Boolean);
}

export function calculateBalance(lord: DashaLord, elapsedArcMinutes: number) {
  const clampedElapsed = Math.min(Math.max(elapsedArcMinutes, 0), NAKSHATRA_SPAN_ARC_MINUTES);
  const remainingArcMinutes = NAKSHATRA_SPAN_ARC_MINUTES - clampedElapsed;
  const remainingFraction = remainingArcMinutes / NAKSHATRA_SPAN_ARC_MINUTES;
  const elapsedFraction = clampedElapsed / NAKSHATRA_SPAN_ARC_MINUTES;
  const remainingYears = lord.years * remainingFraction;

  return {
    elapsedArcMinutes: clampedElapsed,
    remainingArcMinutes,
    elapsedFraction,
    remainingFraction,
    remainingYears,
  };
}

export function formatArcMinutes(totalMinutes: number): string {
  const degrees = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${degrees} deg ${minutes.toString().padStart(2, "0")} min`;
}

export function formatYears(value: number): string {
  return `${value.toFixed(2)} years`;
}
