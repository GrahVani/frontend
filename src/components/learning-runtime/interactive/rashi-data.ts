/**
 * Shared Rāśi data module for all Module 04 interactive components.
 *
 * Following the nakshatra-data.ts pattern from Module 03.
 */

export interface RashiData {
  number: number;
  nameDevanagari: string;
  nameIAST: string;
  nameEnglish: string;
  startDegree: number;
  endDegree: number;
  lord: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  modality: "Chara" | "Sthira" | "Dvi-svabhāva";
  gender: "Masculine" | "Feminine";
  bodyPart: string;
  direction: "East" | "South" | "West" | "North";
  keywords: string;
  color: string;
  mnemonic: string;
}

export interface DignityEntry {
  type: "Exalted" | "Debilitated" | "Mūla-trikoṇa" | "Own-sign" | "Friend" | "Enemy" | "Neutral";
  graha: string;
  degree?: number;
  degreeStart?: number;
  degreeEnd?: number;
  color: string;
  badge: string;
}

export const RASHIS: RashiData[] = [
  { number: 1, nameDevanagari: "मेष", nameIAST: "Meṣa", nameEnglish: "Aries", startDegree: 0, endDegree: 30, lord: "Mars", element: "Fire", modality: "Chara", gender: "Masculine", bodyPart: "Head", direction: "East", color: "#C9A24D", keywords: "Initiating, aggressive, pioneering", mnemonic: "The ram charges forward — cardinal initiating fire" },
  { number: 2, nameDevanagari: "वृष", nameIAST: "Vṛṣabha", nameEnglish: "Taurus", startDegree: 30, endDegree: 60, lord: "Venus", element: "Earth", modality: "Sthira", gender: "Feminine", bodyPart: "Face / Neck", direction: "South", color: "#6B8E6B", keywords: "Persistent, sensual, accumulating", mnemonic: "The bull stands its ground — fixed persistent earth" },
  { number: 3, nameDevanagari: "मिथुन", nameIAST: "Mithuna", nameEnglish: "Gemini", startDegree: 60, endDegree: 90, lord: "Mercury", element: "Air", modality: "Dvi-svabhāva", gender: "Masculine", bodyPart: "Shoulders / Arms", direction: "West", color: "#7BA7C0", keywords: "Adaptive, communicative, curious", mnemonic: "The twins shift and adapt — mutable flexible air" },
  { number: 4, nameDevanagari: "कर्क", nameIAST: "Karka", nameEnglish: "Cancer", startDegree: 90, endDegree: 120, lord: "Moon", element: "Water", modality: "Chara", gender: "Feminine", bodyPart: "Chest / Heart", direction: "North", color: "#5A8A9A", keywords: "Nurturing, protective, emotional", mnemonic: "The crab scuttles sideways but initiates — cardinal water" },
  { number: 5, nameDevanagari: "सिंह", nameIAST: "Siṁha", nameEnglish: "Leo", startDegree: 120, endDegree: 150, lord: "Sun", element: "Fire", modality: "Sthira", gender: "Masculine", bodyPart: "Stomach / Upper-belly", direction: "East", color: "#C9A24D", keywords: "Regal, radiant, authoritative", mnemonic: "The lion holds its territory — fixed radiant fire" },
  { number: 6, nameDevanagari: "कन्या", nameIAST: "Kanyā", nameEnglish: "Virgo", startDegree: 150, endDegree: 180, lord: "Mercury", element: "Earth", modality: "Dvi-svabhāva", gender: "Feminine", bodyPart: "Digestive / Intestines", direction: "South", color: "#6B8E6B", keywords: "Analytical, service-oriented, discriminating", mnemonic: "The maiden serves and adapts — mutable earth" },
  { number: 7, nameDevanagari: "तुला", nameIAST: "Tulā", nameEnglish: "Libra", startDegree: 180, endDegree: 210, lord: "Venus", element: "Air", modality: "Chara", gender: "Masculine", bodyPart: "Hips", direction: "West", color: "#7BA7C0", keywords: "Balancing, relational, diplomatic", mnemonic: "The scales seek balance through action — cardinal air" },
  { number: 8, nameDevanagari: "वृश्चिक", nameIAST: "Vṛścika", nameEnglish: "Scorpio", startDegree: 210, endDegree: 240, lord: "Mars", element: "Water", modality: "Sthira", gender: "Feminine", bodyPart: "Genitals", direction: "North", color: "#5A8A9A", keywords: "Transformative, intense, hidden-power", mnemonic: "The scorpion holds its sting — fixed intense water" },
  { number: 9, nameDevanagari: "धनु", nameIAST: "Dhanus", nameEnglish: "Sagittarius", startDegree: 240, endDegree: 270, lord: "Jupiter", element: "Fire", modality: "Dvi-svabhāva", gender: "Masculine", bodyPart: "Thighs", direction: "East", color: "#C9A24D", keywords: "Expanding, wisdom-seeking, adventurous", mnemonic: "The archer aims and adapts — mutable fire" },
  { number: 10, nameDevanagari: "मकर", nameIAST: "Makara", nameEnglish: "Capricorn", startDegree: 270, endDegree: 300, lord: "Saturn", element: "Earth", modality: "Chara", gender: "Feminine", bodyPart: "Knees", direction: "South", color: "#6B8E6B", keywords: "Disciplined, ambitious, structured", mnemonic: "The sea-goat climbs — cardinal earth ambition" },
  { number: 11, nameDevanagari: "कुम्भ", nameIAST: "Kumbha", nameEnglish: "Aquarius", startDegree: 300, endDegree: 330, lord: "Saturn", element: "Air", modality: "Sthira", gender: "Masculine", bodyPart: "Calves / Ankles", direction: "West", color: "#7BA7C0", keywords: "Humanitarian, visionary, collective", mnemonic: "The water-bearer pours steadily — fixed air vision" },
  { number: 12, nameDevanagari: "मीन", nameIAST: "Mīna", nameEnglish: "Pisces", startDegree: 330, endDegree: 360, lord: "Jupiter", element: "Water", modality: "Dvi-svabhāva", gender: "Feminine", bodyPart: "Feet", direction: "North", color: "#5A8A9A", keywords: "Transcendent, compassionate, boundless", mnemonic: "The fish swim in all directions — mutable water" },
];

export const DIGNITIES: Record<number, DignityEntry[]> = {
  1: [
    { type: "Exalted", graha: "Sun", degree: 10, color: "#C9A24D", badge: "👑" },
    { type: "Debilitated", graha: "Saturn", degree: 20, color: "#6B6B6B", badge: "⬇️" },
    { type: "Mūla-trikoṇa", graha: "Mars", degreeStart: 0, degreeEnd: 12, color: "#A23A1E", badge: "🔺" },
    { type: "Own-sign", graha: "Mars", color: "#4A7C9B", badge: "●" },
  ],
  2: [
    { type: "Exalted", graha: "Moon", degree: 3, color: "#C9A24D", badge: "👑" },
    { type: "Mūla-trikoṇa", graha: "Moon", degreeStart: 3, degreeEnd: 30, color: "#A23A1E", badge: "🔺" },
    { type: "Own-sign", graha: "Venus", color: "#4A7C9B", badge: "●" },
  ],
  3: [
    { type: "Own-sign", graha: "Mercury", color: "#4A7C9B", badge: "●" },
  ],
  4: [
    { type: "Exalted", graha: "Jupiter", degree: 5, color: "#C9A24D", badge: "👑" },
    { type: "Debilitated", graha: "Mars", degree: 28, color: "#6B6B6B", badge: "⬇️" },
    { type: "Own-sign", graha: "Moon", color: "#4A7C9B", badge: "●" },
  ],
  5: [
    { type: "Mūla-trikoṇa", graha: "Sun", degreeStart: 0, degreeEnd: 20, color: "#A23A1E", badge: "🔺" },
    { type: "Own-sign", graha: "Sun", color: "#4A7C9B", badge: "●" },
  ],
  6: [
    { type: "Exalted", graha: "Mercury", degree: 15, color: "#C9A24D", badge: "👑" },
    { type: "Mūla-trikoṇa", graha: "Mercury", degreeStart: 0, degreeEnd: 15, color: "#A23A1E", badge: "🔺" },
    { type: "Own-sign", graha: "Mercury", color: "#4A7C9B", badge: "●" },
    { type: "Debilitated", graha: "Venus", degree: 27, color: "#6B6B6B", badge: "⬇️" },
  ],
  7: [
    { type: "Debilitated", graha: "Sun", degree: 10, color: "#6B6B6B", badge: "⬇️" },
    { type: "Exalted", graha: "Saturn", degree: 20, color: "#C9A24D", badge: "👑" },
    { type: "Mūla-trikoṇa", graha: "Venus", degreeStart: 0, degreeEnd: 15, color: "#A23A1E", badge: "🔺" },
    { type: "Own-sign", graha: "Venus", color: "#4A7C9B", badge: "●" },
  ],
  8: [
    { type: "Debilitated", graha: "Moon", degree: 3, color: "#6B6B6B", badge: "⬇️" },
    { type: "Own-sign", graha: "Mars", color: "#4A7C9B", badge: "●" },
  ],
  9: [
    { type: "Mūla-trikoṇa", graha: "Jupiter", degreeStart: 0, degreeEnd: 10, color: "#A23A1E", badge: "🔺" },
    { type: "Own-sign", graha: "Jupiter", color: "#4A7C9B", badge: "●" },
  ],
  10: [
    { type: "Exalted", graha: "Mars", degree: 28, color: "#C9A24D", badge: "👑" },
    { type: "Debilitated", graha: "Jupiter", degree: 5, color: "#6B6B6B", badge: "⬇️" },
    { type: "Own-sign", graha: "Saturn", color: "#4A7C9B", badge: "●" },
  ],
  11: [
    { type: "Mūla-trikoṇa", graha: "Saturn", degreeStart: 0, degreeEnd: 20, color: "#A23A1E", badge: "🔺" },
    { type: "Own-sign", graha: "Saturn", color: "#4A7C9B", badge: "●" },
  ],
  12: [
    { type: "Exalted", graha: "Venus", degree: 27, color: "#C9A24D", badge: "👑" },
    { type: "Debilitated", graha: "Mercury", degree: 15, color: "#6B6B6B", badge: "⬇️" },
    { type: "Own-sign", graha: "Jupiter", color: "#4A7C9B", badge: "●" },
  ],
};

export const MULA_TRIKONA_REDIRECTS: Record<string, { fromRashi: number; toRashi: number; graha: string; reason: string }> = {
  moon: { fromRashi: 4, toRashi: 2, graha: "Moon", reason: "Moon's mūla-trikoṇa is in Vṛṣabha (3°–30°), not Karka" },
  mars: { fromRashi: 8, toRashi: 1, graha: "Mars", reason: "Mars's mūla-trikoṇa is in Meṣa (0°–12°), not Vṛścika" },
  venus: { fromRashi: 2, toRashi: 7, graha: "Venus", reason: "Venus's mūla-trikoṇa is in Tulā (0°–15°), not Vṛṣabha" },
  mercury: { fromRashi: 3, toRashi: 6, graha: "Mercury", reason: "Mercury's mūla-trikoṇa is in Kanyā (0°–15°), not Mithuna" },
  saturn: { fromRashi: 10, toRashi: 11, graha: "Saturn", reason: "Saturn's mūla-trikoṇa is in Kumbha (0°–20°), not Makara" },
  jupiter: { fromRashi: 12, toRashi: 9, graha: "Jupiter", reason: "Jupiter's mūla-trikoṇa is in Dhanus (0°–10°), not Mīna" },
};

export const OPPOSITE_PAIRS: Array<{ rashiA: number; rashiB: number; axis: string; significance: string }> = [
  { rashiA: 1, rashiB: 7, axis: "Self–Other", significance: "Meṣa (self-identity) ↔ Tulā (relationship) — Sun exalted vs debilitated at 10°" },
  { rashiA: 2, rashiB: 8, axis: "Resources–Transformation", significance: "Vṛṣabha (accumulation) ↔ Vṛścika (dissolution) — Moon exalted vs debilitated at 3°" },
  { rashiA: 3, rashiB: 9, axis: "Communication–Wisdom", significance: "Mithuna (information) ↔ Dhanus (meaning)" },
  { rashiA: 4, rashiB: 10, axis: "Home–Career", significance: "Karka (nurture) ↔ Makara (achievement) — Jupiter exalted vs debilitated at 5°" },
  { rashiA: 5, rashiB: 11, axis: "Radiance–Vision", significance: "Siṁha (sovereign) ↔ Kumbha (collective)" },
  { rashiA: 6, rashiB: 12, axis: "Analysis–Transcendence", significance: "Kanyā (discrimination) ↔ Mīna (dissolution) — Mercury exalted vs debilitated at 15°" },
];

export const ELEMENT_COLORS: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  Fire:  { text: "#C9A24D", bg: "#C9A24D15", border: "#C9A24D50", glow: "#C9A24D30" },
  Earth: { text: "#6B8E6B", bg: "#6B8E6B15", border: "#6B8E6B50", glow: "#6B8E6B30" },
  Air:   { text: "#7BA7C0", bg: "#7BA7C015", border: "#7BA7C050", glow: "#7BA7C030" },
  Water: { text: "#5A8A9A", bg: "#5A8A9A15", border: "#5A8A9A50", glow: "#5A8A9A30" },
};

export const MODALITY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  Chara:        { text: "#C9A24D", bg: "#C9A24D15", border: "#C9A24D50" },
  Sthira:       { text: "#5A8A9A", bg: "#5A8A9A15", border: "#5A8A9A50" },
  "Dvi-svabhāva": { text: "#8A6BB5", bg: "#8A6BB515", border: "#8A6BB550" },
};

export const DIGNITY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  Exalted:     { text: "#C9A24D", bg: "#C9A24D20", border: "#C9A24D60" },
  Debilitated: { text: "#6B6B6B", bg: "#6B6B6B20", border: "#6B6B6B60" },
  "Mūla-trikoṇa": { text: "#A23A1E", bg: "#A23A1E20", border: "#A23A1E60" },
  "Own-sign":  { text: "#4A7C9B", bg: "#4A7C9B20", border: "#4A7C9B60" },
  Friend:      { text: "#6B8E6B", bg: "#6B8E6B20", border: "#6B8E6B60" },
  Enemy:       { text: "#A23A1E", bg: "#A23A1E20", border: "#A23A1E60" },
  Neutral:     { text: "#7A7A7A", bg: "#7A7A7A20", border: "#7A7A7A60" },
};

export const GRAHA_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃", Venus: "♀", Saturn: "♄",
};

export const GRAHA_COLORS: Record<string, string> = {
  Sun: "#C9A24D", Moon: "#E8E8E8", Mars: "#A23A1E", Mercury: "#6B8E6B",
  Jupiter: "#D4A843", Venus: "#C8A2C8", Saturn: "#4A4A6A",
};

export const LORD_PAIRS: Record<string, number[]> = {
  Mars: [1, 8],
  Venus: [2, 7],
  Mercury: [3, 6],
  Moon: [4],
  Sun: [5],
  Jupiter: [9, 12],
  Saturn: [10, 11],
};

export const CROSS_REFERENCES: Record<string, string[]> = {
  dignity: ["Module 05 — Graha-rāśi relationships", "Module 13 — Rāśi interpretation"],
  aspects: ["Module 08 — Graha dṛṣṭi"],
  dasha: ["Module 09 — Vimśottarī Daśā"],
  kalapurusa: ["Module 06 — Bhāva system", "Module 12 — Medical Jyotiṣa"],
  muhurta: ["Module 23 — Muhūrta"],
  nakshatra: ["Module 07 — Nakṣatra system"],
};

/* ─── SVG helpers ─── */
export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

export function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, "Z"].join(" ");
}

export function midAngle(start: number, end: number) {
  return (start + end) / 2;
}

export function getRashiByNumber(n: number): RashiData | undefined {
  return RASHIS.find((r) => r.number === n);
}

export function getRashiByLongitude(deg: number): RashiData {
  const idx = Math.min(Math.floor(deg / 30), 11);
  return RASHIS[idx];
}

export function getDignitiesForRashi(rashiNum: number): DignityEntry[] {
  return DIGNITIES[rashiNum] ?? [];
}
