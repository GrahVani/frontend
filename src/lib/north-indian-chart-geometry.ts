/**
 * Shared geometry for a compact 340×340 North Indian (diamond) chart.
 *
 * House 1 is the top diamond. Houses are fixed in the North Indian style;
 * sign numbers are overlaid based on the ascendant.
 */

export const NI_HOUSE_POLYGONS: Record<number, string> = {
  1: "170,10 90,90 170,170 250,90",
  2: "10,10 170,10 90,90",
  3: "10,10 90,90 10,170",
  4: "10,170 90,90 170,170 90,250",
  5: "10,170 90,250 10,330",
  6: "10,330 90,250 170,330",
  7: "170,330 90,250 170,170 250,250",
  8: "170,330 250,250 330,330",
  9: "330,170 250,250 330,330",
  10: "330,170 250,90 170,170 250,250",
  11: "330,10 250,90 330,170",
  12: "170,10 330,10 250,90",
};

export const NI_HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 170, y: 90 },
  2: { x: 90, y: 40 },
  3: { x: 40, y: 90 },
  4: { x: 90, y: 170 },
  5: { x: 40, y: 250 },
  6: { x: 90, y: 300 },
  7: { x: 170, y: 250 },
  8: { x: 250, y: 300 },
  9: { x: 300, y: 250 },
  10: { x: 250, y: 170 },
  11: { x: 300, y: 90 },
  12: { x: 250, y: 40 },
};

export const NI_CENTER = { x: 170, y: 170 };
