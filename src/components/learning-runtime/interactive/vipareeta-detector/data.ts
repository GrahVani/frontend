/**
 * Vipareeta Detector — Data Engine
 *
 * §7 interactive for Lesson 14.5.2 (The Three Vipareeta Rāja Yogas).
 *
 * Flags Harṣa, Sarala, and Vimala based on dusthana-lord placement.
 */

export const SIGN_NAMES = [
  "Meṣa", "Vṛṣabha", "Mithuna", "Karkaṭa",
  "Siṃha", "Kanyā", "Tulā", "Vṛścika",
  "Dhanus", "Makara", "Kumbha", "Mīna",
];

export const SIGN_LORDS: Record<number, { planet: string; iast: string; grahaSlug: string }> = {
  1: { planet: "Mars", iast: "Maṅgala", grahaSlug: "mangala" },
  2: { planet: "Venus", iast: "Śukra", grahaSlug: "shukra" },
  3: { planet: "Mercury", iast: "Budha", grahaSlug: "budha" },
  4: { planet: "Moon", iast: "Candra", grahaSlug: "candra" },
  5: { planet: "Sun", iast: "Sūrya", grahaSlug: "surya" },
  6: { planet: "Mercury", iast: "Budha", grahaSlug: "budha" },
  7: { planet: "Venus", iast: "Śukra", grahaSlug: "shukra" },
  8: { planet: "Mars", iast: "Maṅgala", grahaSlug: "mangala" },
  9: { planet: "Jupiter", iast: "Guru", grahaSlug: "guru" },
  10: { planet: "Saturn", iast: "Śani", grahaSlug: "shani" },
  11: { planet: "Saturn", iast: "Śani", grahaSlug: "shani" },
  12: { planet: "Jupiter", iast: "Guru", grahaSlug: "guru" },
};

export const DUSTHANAS = [6, 8, 12];
export const KENDRAS = [1, 4, 7, 10];
export const TRIKONAS = [1, 5, 9];
export const BENEFICS = ["Jupiter", "Venus", "Mercury", "Moon"];
export const MALEFICS = ["Saturn", "Mars", "Sun"];

export function getSignOfHouse(house: number, lagnaSign: number): number {
  return ((lagnaSign - 1 + house - 1) % 12) + 1;
}

export function getLordOfHouse(house: number, lagnaSign: number) {
  const sign = getSignOfHouse(house, lagnaSign);
  return SIGN_LORDS[sign];
}

export function isDusthana(house: number): boolean {
  return DUSTHANAS.includes(house);
}

export interface VipareetaResult {
  key: "harsha" | "sarala" | "vimala";
  nameIAST: string;
  nameDevanagari: string;
  lordHouse: number; // 6, 8, or 12
  lordPlanet: string;
  lordIAST: string;
  lordGrahaSlug: string;
  placedHouse: number;
  formed: boolean;
  strength: "strong" | "moderate" | "weak";
  inOwnDusthana: boolean;
  inAnotherDusthana: boolean;
  associatedWithGood: boolean;
  flavor: string;
  grade: string;
}

export function checkVipareeta(
  lagnaSign: number,
  lord6House: number,
  lord8House: number,
  lord12House: number,
  harshaAssoc: boolean,
  saralaAssoc: boolean,
  vimalaAssoc: boolean,
): VipareetaResult[] {
  const lord6 = getLordOfHouse(6, lagnaSign);
  const lord8 = getLordOfHouse(8, lagnaSign);
  const lord12 = getLordOfHouse(12, lagnaSign);

  function checkOne(
    key: VipareetaResult["key"],
    nameIAST: string,
    nameDevanagari: string,
    lordHouse: number,
    lordInfo: { planet: string; iast: string; grahaSlug: string },
    placedHouse: number,
    associated: boolean,
    flavor: string,
  ): VipareetaResult {
    const formed = isDusthana(placedHouse);
    const inOwnDusthana = placedHouse === lordHouse;
    const inAnotherDusthana = formed && !inOwnDusthana;

    let strength: VipareetaResult["strength"] = "weak";
    if (formed) {
      if (inAnotherDusthana && !associated) {
        strength = "strong";
      } else if ((inAnotherDusthana && associated) || (inOwnDusthana && !associated)) {
        strength = "moderate";
      } else {
        strength = "weak";
      }
    }

    let grade = "Absent — dusthana lord not in a dusthana.";
    if (formed) {
      if (strength === "strong") {
        grade = `Strong — ${lordInfo.iast} in another dusthana (H${placedHouse}), unassociated with good-house lords.`;
      } else if (strength === "moderate") {
        grade = `Moderate — ${lordInfo.iast} in a dusthana (H${placedHouse}), but ${inOwnDusthana ? "in its own dusthana" : "associated with a good-house lord/benefic"}.`;
      } else {
        grade = `Weak — ${lordInfo.iast} in its own dusthana AND associated with a good-house lord; the 'malefic spoils malefic' logic is diluted.`;
      }
    }

    return {
      key,
      nameIAST,
      nameDevanagari,
      lordHouse,
      lordPlanet: lordInfo.planet,
      lordIAST: lordInfo.iast,
      lordGrahaSlug: lordInfo.grahaSlug,
      placedHouse,
      formed,
      strength,
      inOwnDusthana,
      inAnotherDusthana,
      associatedWithGood: associated,
      flavor,
      grade,
    };
  }

  return [
    checkOne("harsha", "Harṣa", "हर्ष", 6, lord6, lord6House, harshaAssoc, "Victory over enemies, health, competitive success"),
    checkOne("sarala", "Sarala", "सरल", 8, lord8, lord8House, saralaAssoc, "Longevity, fearlessness, resilience through crises"),
    checkOne("vimala", "Vimala", "विमल", 12, lord12, lord12House, vimalaAssoc, "Frugality, independence, freedom from loss"),
  ];
}

/* ─── Presets ────────────────────────────────────────────────────────────── */

export interface Preset {
  key: string;
  label: string;
  lagnaSign: number;
  lord6House: number;
  lord8House: number;
  lord12House: number;
  harshaAssoc: boolean;
  saralaAssoc: boolean;
  vimalaAssoc: boolean;
}

export const PRESETS: Preset[] = [
  {
    key: "harsha-example",
    label: "Harṣa: 6L in 8th",
    lagnaSign: 1,
    lord6House: 8,
    lord8House: 3,
    lord12House: 5,
    harshaAssoc: false,
    saralaAssoc: false,
    vimalaAssoc: false,
  },
  {
    key: "sarala-example",
    label: "Sarala: 8L in 12th",
    lagnaSign: 1,
    lord6House: 2,
    lord8House: 12,
    lord12House: 5,
    harshaAssoc: false,
    saralaAssoc: false,
    vimalaAssoc: false,
  },
  {
    key: "vimala-example",
    label: "Vimala: 12L in 6th",
    lagnaSign: 1,
    lord6House: 5,
    lord8House: 3,
    lord12House: 6,
    harshaAssoc: false,
    saralaAssoc: false,
    vimalaAssoc: false,
  },
  {
    key: "all-three",
    label: "All three formed",
    lagnaSign: 1,
    lord6House: 8,
    lord8House: 12,
    lord12House: 6,
    harshaAssoc: false,
    saralaAssoc: false,
    vimalaAssoc: false,
  },
  {
    key: "weakened",
    label: "Weakened by association",
    lagnaSign: 1,
    lord6House: 8,
    lord8House: 12,
    lord12House: 6,
    harshaAssoc: true,
    saralaAssoc: true,
    vimalaAssoc: true,
  },
];
