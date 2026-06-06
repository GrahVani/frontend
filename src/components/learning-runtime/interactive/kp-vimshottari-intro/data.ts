import { grahas } from "@/design-tokens/grahvani-learning/colors";
import { DASHA_LORDS, TOTAL_CYCLE_YEARS } from "../dasha-timeline/data";
import { NAKSHATRAS_KP, getSubsForNakshatra } from "../kp-sub-calculator/data";

export const KP_VIMSHOTTARI_TOTAL = TOTAL_CYCLE_YEARS;

export const KP_INTRO_FEATURES = [
  {
    title: "Same Vimshottari cycle",
    value: "120 years / 9 lords",
    note: "KP does not change the mahadasha skeleton.",
    color: grahas.candra.primary,
    tint: grahas.candra.secondaryTint,
  },
  {
    title: "Sub-lord layer added",
    value: "star-lord + sub-lord",
    note: "A point in the zodiac is read through finer nakshatra subdivisions.",
    color: grahas.budha.primary,
    tint: grahas.budha.secondaryTint,
  },
  {
    title: "KP cusps",
    value: "Placidus",
    note: "KP uses Placidus cusps, not whole-sign houses.",
    color: grahas.shani.primary,
    tint: grahas.shani.secondaryTint,
  },
  {
    title: "Tier-1 boundary",
    value: "recognition only",
    note: "Full KP significators, ruling planets, and cusp sub-lords belong to the KP module.",
    color: grahas.guru.primary,
    tint: grahas.guru.secondaryTint,
  },
];

export function vimshottariCycleRows() {
  return DASHA_LORDS.map((lord) => ({
    name: lord.name,
    abbr: lord.abbr,
    years: lord.years,
    color: lord.color,
    tint: lord.colorTint,
  }));
}

export function getKpNakshatra(index: number) {
  return NAKSHATRAS_KP.find((nakshatra) => nakshatra.id === index) ?? NAKSHATRAS_KP[0];
}

export function kpSubRows(nakshatraIndex: number) {
  const nakshatra = getKpNakshatra(nakshatraIndex);
  return getSubsForNakshatra(nakshatra.lordIndex).map((sub) => ({
    id: sub.id,
    name: sub.name,
    years: sub.years,
    widthLabel: sub.widthLabel,
    widthArcMin: sub.widthArcMin,
    color: sub.color,
  }));
}

export function kpIntroStatement(nakshatraIndex: number, subIndex: number) {
  const nakshatra = getKpNakshatra(nakshatraIndex);
  const sub = kpSubRows(nakshatraIndex)[subIndex] ?? kpSubRows(nakshatraIndex)[0];
  return `${nakshatra.name} keeps its Vimshottari star-lord sequence, then KP reads the selected point through ${sub.name} as sub-lord for finer event timing.`;
}
