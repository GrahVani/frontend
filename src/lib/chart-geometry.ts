/**
 * Centralized geometry constants for North Indian diamond chart rendering.
 * Single source of truth — used by NorthIndianChart, ChartWithPopup, and KpCuspalChart.
 *
 * SVG coordinate space: viewBox "-10 -10 420 420" (logical 400x400 grid).
 */

// House center positions — where planet names and values are rendered.
// House 1 = top diamond, counting anti-clockwise.
export const HOUSE_CENTERS: readonly { h: number; x: number; y: number }[] = [
    { h: 1, x: 200, y: 105 },  // Top Diamond
    { h: 2, x: 105, y: 45 },   // Top Left Triangle (Top-most)
    { h: 3, x: 45, y: 105 },   // Top Left Triangle (Left-most)
    { h: 4, x: 105, y: 200 },  // Left Diamond
    { h: 5, x: 45, y: 295 },   // Bottom Left Triangle (Left-most)
    { h: 6, x: 105, y: 355 },  // Bottom Left Triangle (Bottom-most)
    { h: 7, x: 200, y: 295 },  // Bottom Diamond
    { h: 8, x: 295, y: 355 },  // Bottom Right Triangle (Bottom-most)
    { h: 9, x: 355, y: 295 },  // Bottom Right Triangle (Right-most)
    { h: 10, x: 295, y: 200 }, // Right Diamond
    { h: 11, x: 355, y: 105 }, // Top Right Triangle (Right-most)
    { h: 12, x: 295, y: 45 },  // Top Right Triangle (Top-most)
] as const;

// Lookup version of HOUSE_CENTERS keyed by house number (1-12).
// Used by ChartWithPopup for SVG → viewport coordinate mapping.
export const HOUSE_CENTERS_MAP: Record<number, { x: number; y: number }> = Object.fromEntries(
    HOUSE_CENTERS.map(c => [c.h, { x: c.x, y: c.y }])
);

// Clickable polygon hit regions for each house segment.
export const HOUSE_POLYGONS: Record<number, string> = {
    1: "200,10 105,105 200,200 295,105",
    2: "10,10 200,10 105,105",
    3: "10,10 105,105 10,200",
    4: "10,200 105,105 200,200 105,295",
    5: "10,200 105,295 10,390",
    6: "10,390 105,295 200,390",
    7: "200,390 105,295 200,200 295,295",
    8: "200,390 295,295 390,390",
    9: "390,200 295,295 390,390",
    10: "390,200 295,105 200,200 295,295",
    11: "390,10 295,105 390,200",
    12: "200,10 390,10 295,105",
} as const;

// Sign number label positions — placed at corners/edges to avoid planet name overlap.
export const SIGN_NUMBER_POSITIONS: Record<number, { x: number; y: number }> = {
    1: { x: 200, y: 170 },
    2: { x: 105, y: 85 },
    3: { x: 85, y: 105 },
    4: { x: 175, y: 195 },
    5: { x: 90, y: 295 },
    6: { x: 105, y: 325 },
    7: { x: 200, y: 230 },
    8: { x: 295, y: 325 },
    9: { x: 315, y: 295 },
    10: { x: 235, y: 205 },
    11: { x: 315, y: 105 },
    12: { x: 295, y: 85 },
} as const;

// Full zodiac sign names, indexed 0-11 (signId - 1).
export const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;
