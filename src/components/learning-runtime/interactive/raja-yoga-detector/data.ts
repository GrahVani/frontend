import { grahas, type GrahaSlug, rashis, type RashiSlug } from "@/design-tokens/grahvani-learning/colors";

export type RelationshipMode = "conjunction" | "mutual-aspect" | "exchange" | "one-way-aspect";

export interface HouseLord {
  house: number;
  sign: RashiSlug;
  lord: GrahaSlug;
  kind: "kendra" | "trikona" | "both" | "regular";
}

export interface RajaYogaPair {
  kendra: HouseLord;
  trikona: HouseLord;
  samePlanet: boolean;
}

export interface Yogakaraka {
  lord: GrahaSlug;
  kendraHouse: number;
  trikonaHouse: number;
}

export const KENDRA_HOUSES = [1, 4, 7, 10] as const;
export const TRIKONA_HOUSES = [1, 5, 9] as const;

export const RASHI_ORDER: RashiSlug[] = [
  "mesha",
  "vrishabha",
  "mithuna",
  "karka",
  "simha",
  "kanya",
  "tula",
  "vrishchika",
  "dhanus",
  "makara",
  "kumbha",
  "mina",
];

export const SIGN_LORDS: Record<RashiSlug, GrahaSlug> = {
  mesha: "mangala",
  vrishabha: "shukra",
  mithuna: "budha",
  karka: "candra",
  simha: "surya",
  kanya: "budha",
  tula: "shukra",
  vrishchika: "mangala",
  dhanus: "guru",
  makara: "shani",
  kumbha: "shani",
  mina: "guru",
};

export const RELATIONSHIP_MODES: Record<RelationshipMode, { label: string; iast: string; description: string }> = {
  conjunction: {
    label: "Conjunction",
    iast: "Yuti",
    description: "Both lords occupy the same sign.",
  },
  "mutual-aspect": {
    label: "Mutual aspect",
    iast: "Paraspara drishti",
    description: "Each lord aspects the other.",
  },
  exchange: {
    label: "Exchange",
    iast: "Parivartana",
    description: "Each lord occupies the other's sign.",
  },
  "one-way-aspect": {
    label: "One-way aspect",
    iast: "Eka drishti",
    description: "One lord aspects the other.",
  },
};

export function signForHouse(lagna: RashiSlug, house: number): RashiSlug {
  const start = RASHI_ORDER.indexOf(lagna);
  return RASHI_ORDER[(start + house - 1) % 12];
}

export function housesForLagna(lagna: RashiSlug): HouseLord[] {
  return Array.from({ length: 12 }, (_, index) => {
    const house = index + 1;
    const sign = signForHouse(lagna, house);
    const isKendra = KENDRA_HOUSES.includes(house as (typeof KENDRA_HOUSES)[number]);
    const isTrikona = TRIKONA_HOUSES.includes(house as (typeof TRIKONA_HOUSES)[number]);
    return {
      house,
      sign,
      lord: SIGN_LORDS[sign],
      kind: isKendra && isTrikona ? "both" : isKendra ? "kendra" : isTrikona ? "trikona" : "regular",
    };
  });
}

export function rajaYogaPairs(lagna: RashiSlug): RajaYogaPair[] {
  const houses = housesForLagna(lagna);
  const kendras = houses.filter((house) => KENDRA_HOUSES.includes(house.house as (typeof KENDRA_HOUSES)[number]));
  const trikonas = houses.filter((house) => TRIKONA_HOUSES.includes(house.house as (typeof TRIKONA_HOUSES)[number]));

  return kendras.flatMap((kendra) =>
    trikonas
      .filter((trikona) => kendra.house !== trikona.house)
      .map((trikona) => ({
        kendra,
        trikona,
        samePlanet: kendra.lord === trikona.lord,
      })),
  );
}

export function yogakarakas(lagna: RashiSlug): Yogakaraka[] {
  const houses = housesForLagna(lagna);
  const byLord = Object.values(grahas).map((graha) => {
    const owned = houses.filter((house) => house.lord === graha.slug);
    const kendra = owned.find((house) => house.house !== 1 && KENDRA_HOUSES.includes(house.house as (typeof KENDRA_HOUSES)[number]));
    const trikona = owned.find((house) => house.house !== 1 && TRIKONA_HOUSES.includes(house.house as (typeof TRIKONA_HOUSES)[number]));
    return kendra && trikona ? { lord: graha.slug, kendraHouse: kendra.house, trikonaHouse: trikona.house } : null;
  });

  return byLord.filter((item): item is Yogakaraka => item !== null);
}

export function rashiLabel(slug: RashiSlug) {
  const rashi = rashis[slug];
  return `${rashi.iast} / ${rashi.english}`;
}

export function grahaLabel(slug: GrahaSlug) {
  return grahas[slug].iast;
}

export function grahaShort(slug: GrahaSlug) {
  const labels: Record<GrahaSlug, string> = {
    surya: "Su",
    candra: "Mo",
    mangala: "Ma",
    budha: "Me",
    guru: "Ju",
    shukra: "Ve",
    shani: "Sa",
    rahu: "Ra",
    ketu: "Ke",
  };
  return labels[slug];
}
