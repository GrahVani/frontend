export interface Planet {
  id: string;
  name: string;
  devanagari: string;
  defaultNature: "benefic" | "malefic";
  aspectOffsets: number[]; // e.g. [7] or [4, 7, 8], 1-based offset (e.g. 7 means 7th from itself)
}

export interface Lagna {
  id: number;
  name: string;
  sanskrit: string;
}

export const PLANETS_DATA: Planet[] = [
  { id: "sun", name: "Sun (Sūrya)", devanagari: "सूर्य", defaultNature: "malefic", aspectOffsets: [7] },
  { id: "moon", name: "Moon (Candra)", devanagari: "चन्द्र", defaultNature: "benefic", aspectOffsets: [7] },
  { id: "mars", name: "Mars (Maṅgala)", devanagari: "मङ्गल", defaultNature: "malefic", aspectOffsets: [4, 7, 8] },
  { id: "mercury", name: "Mercury (Budha)", devanagari: "बुध", defaultNature: "benefic", aspectOffsets: [7] },
  { id: "jupiter", name: "Jupiter (Guru)", devanagari: "गुरु", defaultNature: "benefic", aspectOffsets: [5, 7, 9] },
  { id: "venus", name: "Venus (Śukra)", devanagari: "शुक्र", defaultNature: "benefic", aspectOffsets: [7] },
  { id: "saturn", name: "Saturn (Śani)", devanagari: "शनि", defaultNature: "malefic", aspectOffsets: [3, 7, 10] },
  { id: "rahu", name: "Rāhu", devanagari: "राहु", defaultNature: "malefic", aspectOffsets: [7] },
  { id: "ketu", name: "Ketu", devanagari: "केतु", defaultNature: "malefic", aspectOffsets: [7] }
];

export const LAGNAS_DATA: Lagna[] = [
  { id: 1, name: "Aries", sanskrit: "Meṣa" },
  { id: 2, name: "Taurus", sanskrit: "Vṛṣabha" },
  { id: 3, name: "Gemini", sanskrit: "Mithuna" },
  { id: 4, name: "Cancer", sanskrit: "Karka" },
  { id: 5, name: "Leo", sanskrit: "Siṁha" },
  { id: 6, name: "Virgo", sanskrit: "Kanyā" },
  { id: 7, name: "Libra", sanskrit: "Tulā" },
  { id: 8, name: "Scorpio", sanskrit: "Vṛścika" },
  { id: 9, name: "Sagittarius", sanskrit: "Dhanus" },
  { id: 10, name: "Capricorn", sanskrit: "Makara" },
  { id: 11, name: "Aquarius", sanskrit: "Kumbha" },
  { id: 12, name: "Pisces", sanskrit: "Mīna" }
];


export function getAspectedHouses(startHouse: number, offsets: number[]): number[] {
  return offsets.map(offset => {
    const target = (startHouse + offset - 1) % 12;
    return target === 0 ? 12 : target;
  });
}
