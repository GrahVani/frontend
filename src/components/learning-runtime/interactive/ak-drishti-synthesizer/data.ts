/**
 * AK-Drishti Synthesizer engine -- Lesson 17.5.3
 *
 * Integrates cara-kārakas with rāśi-dṛṣṭi:
 *  1. Pick a kāraka and the sign it occupies.
 *  2. Compute which signs aspect that sign.
 *  3. Read the planets in those aspecting signs as incoming influences.
 *  4. Classify benefic / malefic and synthesise a reading.
 */

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const SIGN_CLASSES: ("movable" | "fixed" | "dual")[] = [
  "movable", "fixed", "dual", "movable", "fixed", "dual",
  "movable", "fixed", "dual", "movable", "fixed", "dual",
];

export const CLASS_LABELS = {
  movable: "Cara (Movable)",
  fixed: "Sthira (Fixed)",
  dual: "Dvisvabhāva (Dual)",
};

export const LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

export const GRAHAS = [
  { key: "Su", name: "Sun", nature: "malefic" as const, natureLabel: "Malefic" },
  { key: "Mo", name: "Moon", nature: "mixed" as const, natureLabel: "Mixed" },
  { key: "Ma", name: "Mars", nature: "malefic" as const, natureLabel: "Malefic" },
  { key: "Me", name: "Mercury", nature: "mixed" as const, natureLabel: "Mixed" },
  { key: "Ju", name: "Jupiter", nature: "benefic" as const, natureLabel: "Benefic" },
  { key: "Ve", name: "Venus", nature: "benefic" as const, natureLabel: "Benefic" },
  { key: "Sa", name: "Saturn", nature: "malefic" as const, natureLabel: "Malefic" },
] as const;

export type GrahaKey = (typeof GRAHAS)[number]["key"];

export const KARAKAS = [
  { key: "AK", name: "Atmakaraka", domain: "Soul, self, king of the chart" },
  { key: "AmK", name: "Amatyakaraka", domain: "Career, counsel, advisors" },
  { key: "BK", name: "Bhratrkaraka", domain: "Siblings, courage, competition" },
  { key: "MK", name: "Matrkaraka", domain: "Mother, nourishment, home" },
  { key: "PK", name: "Putrkaraka", domain: "Children, learning, legacy" },
  { key: "GK", name: "Gnatikaraka", domain: "Conflict, obstacles, rivals" },
  { key: "DK", name: "Darakaraka", domain: "Spouse, partnership" },
] as const;

export type KarakaKey = (typeof KARAKAS)[number]["key"];

/* --- Rāśi-dṛṣṭi engine (same rule as Lesson 17.5.1) --- */

export function getAspectedSigns(signIdx: number): number[] {
  const cls = SIGN_CLASSES[signIdx];
  if (cls === "dual") {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      .filter((i) => SIGN_CLASSES[i] === "dual" && i !== signIdx);
  }
  if (cls === "movable") {
    const fixed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      .filter((i) => SIGN_CLASSES[i] === "fixed");
    const adjacent = (signIdx + 1) % 12;
    return fixed.filter((i) => i !== adjacent);
  }
  const movable = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    .filter((i) => SIGN_CLASSES[i] === "movable");
  const adjacent = (signIdx - 1 + 12) % 12;
  return movable.filter((i) => i !== adjacent);
}

/** Which signs aspect the given target sign? (Reverse lookup.) */
export function getAspectsToTarget(targetIdx: number): number[] {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    .filter((i) => i !== targetIdx && getAspectedSigns(i).includes(targetIdx));
}

export function getExcludedSign(signIdx: number): number | null {
  const cls = SIGN_CLASSES[signIdx];
  if (cls === "dual") return signIdx;
  if (cls === "movable") return (signIdx + 1) % 12;
  return (signIdx - 1 + 12) % 12;
}

/* --- Presets (matched to lesson worked examples) --- */

export interface Preset {
  name: string;
  lagna: number;
  karakaKey: KarakaKey;
  karakaPlanet: GrahaKey;
  karakaSign: number;
  occupants: GrahaKey[][];
  note: string;
}

export const PRESETS: Preset[] = [
  {
    name: "Saturn AK in Capricorn",
    lagna: 1,
    karakaKey: "AK",
    karakaPlanet: "Sa",
    karakaSign: 9, // Capricorn
    occupants: [
      [],       // 0 Aries
      ["Ju"],   // 1 Taurus
      [],       // 2 Gemini
      [],       // 3 Cancer
      [],       // 4 Leo
      [],       // 5 Virgo
      [],       // 6 Libra
      ["Ma"],   // 7 Scorpio
      [],       // 8 Sagittarius
      ["Sa"],   // 9 Capricorn <- AK
      [],       // 10 Aquarius
      [],       // 11 Pisces
    ],
    note: "Capricorn (movable) is aspected by Taurus, Leo, Scorpio. Jupiter in Taurus (benefic) supports; Mars in Scorpio (malefic) tests. A mixed soul-field.",
  },
  {
    name: "Mercury AK in Gemini",
    lagna: 1,
    karakaKey: "AK",
    karakaPlanet: "Me",
    karakaSign: 2, // Gemini
    occupants: [
      [],       // 0 Aries
      [],       // 1 Taurus
      ["Me"],   // 2 Gemini <- AK
      [],       // 3 Cancer
      [],       // 4 Leo
      [],       // 5 Virgo
      [],       // 6 Libra
      [],       // 7 Scorpio
      ["Ju"],   // 8 Sagittarius
      [],       // 9 Capricorn
      [],       // 10 Aquarius
      [],       // 11 Pisces
    ],
    note: "Gemini (dual) is aspected by Virgo, Sagittarius, Pisces. Jupiter in Sagittarius (benefic) strongly supports the Mercurial soul-agenda.",
  },
  {
    name: "Venus DK in Libra",
    lagna: 1,
    karakaKey: "DK",
    karakaPlanet: "Ve",
    karakaSign: 6, // Libra
    occupants: [
      ["Sa"],   // 0 Aries
      [],       // 1 Taurus
      [],       // 2 Gemini
      [],       // 3 Cancer
      ["Su"],   // 4 Leo
      [],       // 5 Virgo
      ["Ve"],   // 6 Libra <- DK
      [],       // 7 Scorpio
      [],       // 8 Sagittarius
      [],       // 9 Capricorn
      [],       // 10 Aquarius
      ["Ju"],   // 11 Pisces
    ],
    note: "Libra (movable) is aspected by Taurus, Leo, Aquarius. Sun in Leo (malefic) tests partnership; Jupiter in Pisces does not aspect Libra directly -- a good check.",
  },
  {
    name: "Empty explorer",
    lagna: 1,
    karakaKey: "AK",
    karakaPlanet: "Ju",
    karakaSign: 0, // Aries
    occupants: Array.from({ length: 12 }, () => [] as GrahaKey[]),
    note: "Start from Aries and modify freely.",
  },
];

/* --- Synthesis helpers --- */

export function ruleText(signIdx: number): string {
  const cls = SIGN_CLASSES[signIdx];
  if (cls === "movable") return "Movable aspects fixed signs, except the adjacent fixed sign.";
  if (cls === "fixed") return "Fixed aspects movable signs, except the adjacent movable sign.";
  return "Dual aspects the other dual signs, except its own self.";
}

export function incomingInfluences(
  karakaSign: number,
  occupants: GrahaKey[][],
): { signIdx: number; signName: string; planets: { key: GrahaKey; name: string; nature: string; natureLabel: string }[]; lord: string }[] {
  const aspecting = getAspectsToTarget(karakaSign);
  return aspecting.map((sIdx) => {
    const occ = occupants[sIdx];
    const planets = occ.map((k) => {
      const g = GRAHAS.find((x) => x.key === k)!;
      return { key: g.key, name: g.name, nature: g.nature, natureLabel: g.natureLabel };
    });
    return { signIdx: sIdx, signName: SIGNS[sIdx], planets, lord: LORDS[sIdx] };
  });
}

export function synthesiseReading(
  karakaName: string,
  karakaKey: KarakaKey,
  karakaSign: number,
  karakaPlanet: GrahaKey,
  influences: ReturnType<typeof incomingInfluences>,
): string {
  const planetName = GRAHAS.find((g) => g.key === karakaPlanet)!.name;
  const signName = SIGNS[karakaSign];

  const benefic = influences.flatMap((inf) => inf.planets.filter((p) => p.nature === "benefic"));
  const malefic = influences.flatMap((inf) => inf.planets.filter((p) => p.nature === "malefic"));
  const mixed = influences.flatMap((inf) => inf.planets.filter((p) => p.nature === "mixed"));

  const isMixedField = benefic.length > 0 && malefic.length > 0;

  let text = `${planetName} as ${karakaName} in ${signName} sets a `;

  if (karakaKey === "AK") {
    text += "soul-agenda";
  } else if (karakaKey === "DK") {
    text += "partnership theme";
  } else if (karakaKey === "AmK") {
    text += "career trajectory";
  } else {
    text += "life-area focus";
  }

  text += ". ";

  if (influences.length === 0 || (benefic.length === 0 && malefic.length === 0 && mixed.length === 0)) {
    text += "No planets occupy the aspecting signs, so the sign-flavours condition the agenda without planetary intensity.";
    return text;
  }

  if (isMixedField) {
    text += `The field is mixed: `;
    if (benefic.length > 0) {
      text += `${benefic.map((p) => p.name).join(" and ")} ${benefic.length === 1 ? "supports" : "support"} and elevate the path`;
    }
    if (malefic.length > 0) {
      text += `${benefic.length > 0 ? "; " : ""}${malefic.map((p) => p.name).join(" and ")} ${malefic.length === 1 ? "tests" : "test"} it through hardship or delay`;
    }
    text += ". Hold both poles -- do not collapse a mixed field into a single verdict.";
  } else if (benefic.length > 0) {
    text += `${benefic.map((p) => p.name).join(" and ")} ${benefic.length === 1 ? "throws a benefic sign-aspect that supports and elevates" : "throw benefic sign-aspects that support and elevate"} the ${karakaKey === "AK" ? "soul-path" : "life-area"}.`;
  } else if (malefic.length > 0) {
    text += `${malefic.map((p) => p.name).join(" and ")} ${malefic.length === 1 ? "throws a malefic sign-aspect that obstructs or tests" : "throw malefic sign-aspects that obstruct or test"} the ${karakaKey === "AK" ? "soul-path" : "life-area"} through struggle, delay, or austerity.`;
  } else if (mixed.length > 0) {
    text += `${mixed.map((p) => p.name).join(" and ")} ${mixed.length === 1 ? "contributes a mixed influence that modifies" : "contribute mixed influences that modify"} the expression without strongly supporting or obstructing.`;
  }

  return text;
}
