// ============================================================
// GRAHVANI DIAGRAM CAPTIONS
// ============================================================
// Central registry of diagram captions for dynamic SVG components.
// The actual interactive diagrams are React components in:
//   src/components/learn/diagrams/
// ============================================================

export const DIAGRAM_CAPTIONS: Record<string, string> = {
  "zodiac-wheel": "Tap any sign to explore its element, modality, and planetary lord.",
  "rashi-tattvas": "The Four Tattvas (Elements) that govern the 12 Rashis.",
  "rashi-modalities": "The Three Modalities (Mobilities) that describe how each sign's energy moves.",
  "planet-orbit": "Tap each planet to discover its nature, element, and significations (Karakatwas).",
  "concept-illustration": "Interactive concept visualization.",
  "house-chart": "Tap each house to learn its domain, Sanskrit name, and structural group.",
  "nakshatra-wheel": "The 27 Nakshatras divided into 4 Padas each = 108 total divisions.",
  "ayanamsa-drift": "The Ayanamsa drift: the gap between Tropical and Sidereal zodiacs caused by axial precession.",
  "panchang-limbs": "Tap each limb to learn how it is computed and what it signifies.",
  "drishti-chart": "Tap the special-aspect planets to learn their unique sight patterns.",
};

export function getDiagramCaption(diagramType: string): string | undefined {
  return DIAGRAM_CAPTIONS[diagramType];
}
