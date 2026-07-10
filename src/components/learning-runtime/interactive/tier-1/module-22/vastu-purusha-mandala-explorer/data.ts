export type MandalaVariantKey = "paramashayika" | "manduka" | "upapitha";
export type FocusKey = "brahma" | "outer" | "inner" | "corners" | "modern";

export interface MandalaVariant {
  key: MandalaVariantKey;
  label: string;
  grid: number;
  padas: number;
  useCase: string;
  brahmaCells: number;
  note: string;
}

export interface DirectionZone {
  key: string;
  label: string;
  deity: string;
  quality: string;
  placement: string;
  row: number;
  col: number;
}

export interface FocusPanel {
  key: FocusKey;
  label: string;
  headline: string;
  text: string;
}

export const MANDALA_VARIANTS: MandalaVariant[] = [
  {
    key: "paramashayika",
    label: "Paramashayika",
    grid: 9,
    padas: 81,
    useCase: "Residential homes and standard temples",
    brahmaCells: 9,
    note: "Default practical grid in this lesson; the central 3x3 is Brahma-sthana.",
  },
  {
    key: "manduka",
    label: "Manduka",
    grid: 8,
    padas: 64,
    useCase: "Commercial and secular public structures",
    brahmaCells: 4,
    note: "The central 2x2 is treated as Brahma-sthana.",
  },
  {
    key: "upapitha",
    label: "Upapitha",
    grid: 7,
    padas: 49,
    useCase: "Small shrines and small residential plots",
    brahmaCells: 1,
    note: "A compact grid; the single centre cell carries the central principle.",
  },
];

export const DIRECTION_ZONES: DirectionZone[] = [
  { key: "ne", label: "North-east", deity: "Ishana", quality: "head, purity, worship", placement: "Puja, meditation, water purity", row: 0, col: 8 },
  { key: "se", label: "South-east", deity: "Agni", quality: "fire, cooking, transformation", placement: "Kitchen, controlled heat", row: 8, col: 8 },
  { key: "sw", label: "South-west", deity: "Nirriti", quality: "weight, settlement, containment", placement: "Master bedroom, storage, stability", row: 8, col: 0 },
  { key: "nw", label: "North-west", deity: "Vayu", quality: "movement, air, exchange", placement: "Guests, movement, circulation", row: 0, col: 0 },
  { key: "e", label: "East", deity: "Indra", quality: "opening, vitality, recognition", placement: "Entrance and morning light logic", row: 4, col: 8 },
  { key: "s", label: "South", deity: "Yama", quality: "discipline, boundaries", placement: "Controlled, less open functions", row: 8, col: 4 },
  { key: "w", label: "West", deity: "Varuna", quality: "water, containment, evening", placement: "Water/store logic by tradition", row: 4, col: 0 },
  { key: "n", label: "North", deity: "Kubera", quality: "wealth, resources", placement: "Treasury, valuables, receiving", row: 0, col: 4 },
];

export const FOCUS_PANELS: FocusPanel[] = [
  {
    key: "brahma",
    label: "Brahma-sthana",
    headline: "The centre is sacred and classically open.",
    text: "In the 9x9 grid, the central 3x3 is the Brahma-sthana. Classical practice keeps it unbuilt and unobstructed as the dwelling's spiritual and breathing centre.",
  },
  {
    key: "outer",
    label: "32 outer deities",
    headline: "The perimeter governs boundary functions.",
    text: "The outer ring mediates entrances, walls, thresholds, and contact with the outside. Chapter 2 develops the cardinal and intercardinal deities in detail.",
  },
  {
    key: "inner",
    label: "13 inner deities",
    headline: "The inner zone governs dwelling life.",
    text: "The interior carries the more intimate functions of living, worship, food, sleep, and circulation around the centre.",
  },
  {
    key: "corners",
    label: "Directional anchors",
    headline: "Corners and cardinals are the learner's first map.",
    text: "Begin with NE Ishana, SE Agni, SW Nirriti, NW Vayu, then add E Indra, S Yama, W Varuna, and N Kubera.",
  },
  {
    key: "modern",
    label: "Modern apartment",
    headline: "A violation is not a catastrophe.",
    text: "Apartments often cannot preserve an open centre. Acknowledge the limitation, mitigate clutter and heavy functions, respect engineering, and avoid fear.",
  },
];

export function getVariant(key: MandalaVariantKey): MandalaVariant {
  return MANDALA_VARIANTS.find((item) => item.key === key) ?? MANDALA_VARIANTS[0];
}

export function getFocus(key: FocusKey): FocusPanel {
  return FOCUS_PANELS.find((item) => item.key === key) ?? FOCUS_PANELS[0];
}
