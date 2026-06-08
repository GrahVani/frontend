import { grahas, rashis, type GrahaSlug, type RashiSlug } from "@/design-tokens/grahvani-learning/colors";
import { RASHI_ORDER, SIGN_LORDS, signForHouse, yogakarakas } from "../raja-yoga-detector/data";

export type DharmaKarmaMode = "none" | "conjunction" | "aspect" | "exchange";

export interface DharmaKarmaCase {
  lagna: RashiSlug;
  ninthSign: RashiSlug;
  tenthSign: RashiSlug;
  ninthLord: GrahaSlug;
  tenthLord: GrahaSlug;
  yogakarakaLord?: GrahaSlug;
}

export const DHARMA_KARMA_MODES: Record<DharmaKarmaMode, { label: string; iast: string; formed: boolean; note: string }> = {
  none: {
    label: "No relationship",
    iast: "Asambandha",
    formed: false,
    note: "The 9th and 10th lords are known, but the yoga is not active until they relate.",
  },
  conjunction: {
    label: "Conjunction",
    iast: "Yuti",
    formed: true,
    note: "Dharma and karma lords occupy the same sign.",
  },
  aspect: {
    label: "Aspect",
    iast: "Drishti",
    formed: true,
    note: "One or both lords aspect across the chart, joining fortune to action.",
  },
  exchange: {
    label: "Exchange",
    iast: "Parivartana",
    formed: true,
    note: "The 9th lord occupies the 10th sign and the 10th lord occupies the 9th sign.",
  },
};

export const FEATURED_LAGNAS: RashiSlug[] = ["mesha", "karka", "kumbha"];

export function dharmaKarmaCase(lagna: RashiSlug): DharmaKarmaCase {
  const ninthSign = signForHouse(lagna, 9);
  const tenthSign = signForHouse(lagna, 10);
  const yogakaraka = yogakarakas(lagna)[0];

  return {
    lagna,
    ninthSign,
    tenthSign,
    ninthLord: SIGN_LORDS[ninthSign],
    tenthLord: SIGN_LORDS[tenthSign],
    yogakarakaLord: yogakaraka?.lord,
  };
}

export function dharmaKarmaCases() {
  return RASHI_ORDER.map(dharmaKarmaCase);
}

export function rashiName(slug: RashiSlug) {
  const rashi = rashis[slug];
  return `${rashi.iast} / ${rashi.english}`;
}

export function grahaName(slug: GrahaSlug) {
  return grahas[slug].iast;
}
