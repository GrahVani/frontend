/**
 * Special-Yoga Scan — Data Engine
 *
 * §7 interactive for Lesson 14.4.4 (Chapter 4 capstone).
 *
 * Fixed Cancer-lagna chart with systematic 5-yoga checklist.
 * Users can toggle Jupiter's dignity to see the broken-condition cascade.
 */

export type Dignity = "exalted" | "moolatrikona" | "own" | "neutral" | "debilitated";

export interface DignityInfo {
  key: Dignity;
  label: string;
  isStrong: boolean;
  isDebilitated: boolean;
}

export const DIGNITIES: DignityInfo[] = [
  { key: "exalted", label: "Exalted", isStrong: true, isDebilitated: false },
  { key: "moolatrikona", label: "Mūlatrikoṇa", isStrong: true, isDebilitated: false },
  { key: "own", label: "Own sign", isStrong: true, isDebilitated: false },
  { key: "neutral", label: "Neutral", isStrong: false, isDebilitated: false },
  { key: "debilitated", label: "Debilitated", isStrong: false, isDebilitated: true },
];

/* ─── Fixed chart: Cancer lagna ──────────────────────────────────────────── */

export interface ChartPlacement {
  planet: string;
  house: number;
  sign: number;
  signName: string;
  dignity: Dignity;
  longitude?: number; // for Sun/Mercury separation
}

export const FIXED_CHART: ChartPlacement[] = [
  { planet: "Moon", house: 1, sign: 4, signName: "Karkaṭa", dignity: "exalted" },
  { planet: "Sun", house: 2, sign: 5, signName: "Siṃha", dignity: "own" },
  { planet: "Mercury", house: 2, sign: 5, signName: "Siṃha", dignity: "neutral", longitude: 140 },
  { planet: "Jupiter", house: 4, sign: 7, signName: "Tulā", dignity: "neutral", longitude: 0 },
  { planet: "Venus", house: 4, sign: 7, signName: "Tulā", dignity: "own", longitude: 0 },
  { planet: "Mars", house: 10, sign: 1, signName: "Meṣa", dignity: "moolatrikona", longitude: 0 },
  { planet: "Saturn", house: 7, sign: 10, signName: "Makara", dignity: "own", longitude: 0 },
];

export const LAGNA_SIGN = 4; // Cancer
export const SUN_LONGITUDE = 125;
export const MERCURY_LONGITUDE = 140;
export const COMBUSTION_ORB = 14;

/* ─── Lords for Cancer lagna ─────────────────────────────────────────────── */

export const HOUSE_LORDS: Record<number, { planet: string; sign: number }> = {
  1: { planet: "Moon", sign: 4 },
  2: { planet: "Sun", sign: 5 },
  3: { planet: "Mercury", sign: 6 },
  4: { planet: "Venus", sign: 7 },
  5: { planet: "Mars", sign: 8 },
  6: { planet: "Jupiter", sign: 9 },
  7: { planet: "Saturn", sign: 10 },
  8: { planet: "Saturn", sign: 11 },
  9: { planet: "Jupiter", sign: 12 },
  10: { planet: "Mars", sign: 1 },
  11: { planet: "Venus", sign: 2 },
  12: { planet: "Mercury", sign: 3 },
};

/* ─── Yoga check results ─────────────────────────────────────────────────── */

export interface YogaCheck {
  key: string;
  nameIAST: string;
  nameDevanagari: string;
  color: string;
  formed: boolean;
  strength: "strong" | "moderate" | "weak" | "absent";
  conditions: { label: string; met: boolean; detail: string }[];
  notes: string[];
  grade: string;
}

export function runChecklist(jupiterDignity: Dignity): YogaCheck[] {
  const jup = FIXED_CHART.find((p) => p.planet === "Jupiter")!;
  const ven = FIXED_CHART.find((p) => p.planet === "Venus")!;
  const merc = FIXED_CHART.find((p) => p.planet === "Mercury")!;
  const sun = FIXED_CHART.find((p) => p.planet === "Sun")!;
  const moon = FIXED_CHART.find((p) => p.planet === "Moon")!;

  // Override Jupiter dignity with user toggle
  const jupiterDignityInfo = DIGNITIES.find((d) => d.key === jupiterDignity)!;

  /* ── 1. Lakṣmī Yoga ── */
  const ninthLord = HOUSE_LORDS[9].planet; // Jupiter for Cancer
  const ninthLordDignified = jupiterDignityInfo.isStrong;
  const lagnaLordStrong = DIGNITIES.find((d) => d.key === moon.dignity)!.isStrong;
  const lakshmiFormed = ninthLordDignified && lagnaLordStrong;

  /* ── 2. Sarasvatī Yoga ── */
  const mercuryWellPlaced = [1, 2, 4, 5, 7, 9, 10].includes(merc.house);
  const jupiterWellPlaced = [1, 2, 4, 5, 7, 9, 10].includes(jup.house);
  const venusWellPlaced = [1, 2, 4, 5, 7, 9, 10].includes(ven.house);
  const mercuryUndeb = !DIGNITIES.find((d) => d.key === merc.dignity)!.isDebilitated;
  const jupiterUndeb = !jupiterDignityInfo.isDebilitated;
  const venusUndeb = !DIGNITIES.find((d) => d.key === ven.dignity)!.isDebilitated;
  const jupiterStrong = jupiterDignityInfo.isStrong;
  const saraswatiFormed = mercuryWellPlaced && jupiterWellPlaced && venusWellPlaced && mercuryUndeb && jupiterUndeb && venusUndeb && jupiterStrong;

  /* ── 3. Akhanda Sāmrājya ── */
  const lord2nd = FIXED_CHART.find((p) => p.planet === HOUSE_LORDS[2].planet)!;
  const lord11th = FIXED_CHART.find((p) => p.planet === HOUSE_LORDS[11].planet)!;
  const lord4th = FIXED_CHART.find((p) => p.planet === HOUSE_LORDS[4].planet)!;
  const akhandaFormed = false; // Full multi-lord stack is absent on this chart

  /* ── 4. Buddhāditya ── */
  const sameSign = sun.sign === merc.sign;
  const separation = Math.abs(SUN_LONGITUDE - MERCURY_LONGITUDE);
  const combust = separation <= COMBUSTION_ORB;
  const buddhaFormed = sameSign && !combust;

  /* ── 5. Gaja-Kesari ── */
  const distance = ((jup.house - moon.house + 12) % 12) || 12;
  const kendra = [1, 4, 7, 10].includes(distance);
  const gkFormed = kendra;

  return [
    {
      key: "lakshmi",
      nameIAST: "Lakṣmī Yoga",
      nameDevanagari: "लक्ष्मीयोगः",
      color: "#2F7D55",
      formed: lakshmiFormed,
      strength: lakshmiFormed ? "moderate" : "absent",
      conditions: [
        { label: "9th lord dignified", met: ninthLordDignified, detail: `Jupiter in ${jup.signName} — ${jupiterDignity}` },
        { label: "Lagna lord strong", met: lagnaLordStrong, detail: `Moon in ${moon.signName} — ${moon.dignity}` },
      ],
      notes: lakshmiFormed
        ? ["Lakṣmī Yoga formed."]
        : ["9th lord Jupiter is not dignified in Libra (neutral) — near miss.", "Venus (Lakṣmī's kāraka) is in own sign, which reinforces thematically but does not replace the structural core."],
      grade: lakshmiFormed ? "Moderate — 9th lord dignified, lagna lord strong." : "Absent — 9th lord not dignified.",
    },
    {
      key: "saraswati",
      nameIAST: "Sarasvatī Yoga",
      nameDevanagari: "सरस्वतीयोगः",
      color: "#8B5A9F",
      formed: saraswatiFormed,
      strength: saraswatiFormed ? (jupiterStrong ? "strong" : "moderate") : "absent",
      conditions: [
        { label: "Mercury well-placed, undebilitated", met: mercuryWellPlaced && mercuryUndeb, detail: `Mercury in H${merc.house} (${merc.signName}), ${merc.dignity}` },
        { label: "Jupiter well-placed, undebilitated", met: jupiterWellPlaced && jupiterUndeb, detail: `Jupiter in H${jup.house} (${jup.signName}), ${jupiterDignity}` },
        { label: "Venus well-placed, undebilitated", met: venusWellPlaced && venusUndeb, detail: `Venus in H${ven.house} (${ven.signName}), ${ven.dignity}` },
        { label: "Jupiter especially strong", met: jupiterStrong, detail: jupiterDignity === "debilitated" ? "Debilitated — breaks the yoga" : `Jupiter ${jupiterDignity}` },
      ],
      notes: saraswatiFormed
        ? ["All three learning planets well-placed and undebilitated."]
        : jupiterDignity === "debilitated"
          ? ["Jupiter debilitated — this BREAKS Sarasvatī Yoga.", "One placement change cascades across multiple yogas."]
          : ["Some condition not met — check each planet's placement and dignity."],
      grade: saraswatiFormed
        ? `Strong — Me/Ju/Ve all well-placed. Jupiter ${jupiterDignity}.`
        : jupiterDignity === "debilitated"
          ? "Broken — debilitated Jupiter violates the no-debilitation rule."
          : "Absent — conditions not fully met.",
    },
    {
      key: "akhanda",
      nameIAST: "Akhanda Sāmrājya",
      nameDevanagari: "अखण्डसाम्राज्ययोगः",
      color: "#C8841E",
      formed: akhandaFormed,
      strength: "absent",
      conditions: [
        { label: "2nd lord in kendra, strong", met: false, detail: `Sun in H${lord2nd.house} — kendra? No` },
        { label: "9th lord in kendra, strong", met: false, detail: `Jupiter in H${jup.house} — kendra? No` },
        { label: "11th lord in kendra, strong", met: false, detail: `Venus in H${lord11th.house} — kendra? No` },
        { label: "Jupiter in 9th, strong", met: false, detail: `Jupiter in H${jup.house}, not 9th` },
      ],
      notes: ["The full multi-lord stack is absent — this is normal; Akhanda Sāmrājya is genuinely rare."],
      grade: "Absent — full stack not present.",
    },
    {
      key: "buddhaditya",
      nameIAST: "Buddhāditya",
      nameDevanagari: "बुधादित्ययोगः",
      color: "#D99622",
      formed: buddhaFormed,
      strength: buddhaFormed ? "strong" : "absent",
      conditions: [
        { label: "Sun + Mercury same sign", met: sameSign, detail: `Both in ${sun.signName}` },
        { label: "Mercury uncombust", met: !combust, detail: `Separation ${separation.toFixed(0)}° ${combust ? "(combust)" : "(uncombust ✓)"}` },
      ],
      notes: buddhaFormed
        ? ["Clean Buddhāditya — same sign, Mercury outside combustion orb."]
        : ["Mercury too close to Sun — combust and weakened."],
      grade: buddhaFormed ? "Strong — Sun own-sign, Mercury uncombust." : "Weak — combustion weakens Mercury.",
    },
    {
      key: "gajakesari",
      nameIAST: "Gaja-Kesari",
      nameDevanagari: "गजकेसरियोगः",
      color: "#6D7FA8",
      formed: gkFormed,
      strength: gkFormed ? (jupiterDignityInfo.isStrong ? "strong" : "moderate") : "absent",
      conditions: [
        { label: "Jupiter in kendra from Moon", met: kendra, detail: `Jupiter H${jup.house}, Moon H${moon.house} — ${distance === 1 ? "conjunct" : distance + "th from"}` },
        { label: "Jupiter strong", met: jupiterDignityInfo.isStrong, detail: `Jupiter ${jupiterDignity}` },
      ],
      notes: gkFormed
        ? ["Jupiter in the 4th from the Moon — a kendra. Gaja-Kesari formed."]
        : ["Jupiter not in a kendra from the Moon."],
      grade: gkFormed
        ? jupiterDignity === "debilitated"
          ? "Weak — Jupiter debilitated, though kendra position holds."
          : "Moderate — kendra position confirmed; Jupiter neutral (not own/exalt)."
        : "Absent — not in kendra from Moon.",
    },
  ];
}
