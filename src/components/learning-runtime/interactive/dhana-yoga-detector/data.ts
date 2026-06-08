import { grahas, rashis, type GrahaSlug, type RashiSlug } from "@/design-tokens/grahvani-learning/colors";
import { RASHI_ORDER, SIGN_LORDS, signForHouse } from "../raja-yoga-detector/data";

export type DhanaRelationMode = "conjunction" | "aspect" | "exchange";

export interface WealthHouse {
  house: 2 | 5 | 9 | 11;
  label: string;
  iast: string;
  role: "primary" | "fortune";
  meaning: string;
  color: string;
}

export interface DhanaLord {
  house: WealthHouse["house"];
  sign: RashiSlug;
  lord: GrahaSlug;
  wealthHouse: WealthHouse;
}

export interface DhanaPair {
  first: DhanaLord;
  second: DhanaLord;
  dualRaja: boolean;
}

export const DHANA_RELATION_MODES: Record<DhanaRelationMode, { label: string; iast: string; note: string }> = {
  conjunction: {
    label: "Conjunction",
    iast: "Yuti",
    note: "The wealth-house lords sit together and combine their agendas.",
  },
  aspect: {
    label: "Aspect",
    iast: "Drishti",
    note: "One or both wealth-house lords aspect each other.",
  },
  exchange: {
    label: "Exchange",
    iast: "Parivartana",
    note: "The two lords occupy each other's signs, creating a strong wealth circuit.",
  },
};

export const WEALTH_HOUSES: WealthHouse[] = [
  {
    house: 2,
    label: "Held wealth",
    iast: "Dhana",
    role: "primary",
    meaning: "Accumulated wealth, savings, assets, family resources.",
    color: grahas.shukra.primary,
  },
  {
    house: 5,
    label: "Merit fortune",
    iast: "Pūrva-puṇya",
    role: "fortune",
    meaning: "Lakshmi, intelligence, speculation, fortune from past merit.",
    color: grahas.budha.primary,
  },
  {
    house: 9,
    label: "Bhagya",
    iast: "Bhāgya",
    role: "fortune",
    meaning: "Grace, luck, dharma, fortune and blessing.",
    color: grahas.guru.primary,
  },
  {
    house: 11,
    label: "Gains",
    iast: "Lābha",
    role: "primary",
    meaning: "Income, profits, networks, fulfilled desires.",
    color: grahas.surya.primary,
  },
];

export function wealthLordsForLagna(lagna: RashiSlug): DhanaLord[] {
  return WEALTH_HOUSES.map((wealthHouse) => {
    const sign = signForHouse(lagna, wealthHouse.house);
    return {
      house: wealthHouse.house,
      sign,
      lord: SIGN_LORDS[sign],
      wealthHouse,
    };
  });
}

export function dhanaPairs(lagna: RashiSlug): DhanaPair[] {
  const lords = wealthLordsForLagna(lagna);
  return lords.flatMap((first, index) =>
    lords.slice(index + 1).map((second) => ({
      first,
      second,
      dualRaja: [first.house, second.house].includes(5) && [first.house, second.house].includes(9),
    })),
  );
}

export function rashiName(slug: RashiSlug) {
  const rashi = rashis[slug];
  return `${rashi.iast} / ${rashi.english}`;
}

export function grahaName(slug: GrahaSlug) {
  return grahas[slug].iast;
}

export { RASHI_ORDER };
