/**
 * Grahvani Learning — Color System
 * Mirrors §4 of frontend/docs/learning-module/00-design-constitution.md (v0.2).
 * Do not modify these without amending the constitution.
 */

// v0.3 brand-aligned: parchment canvas + copper-gold daylight register.
// Property names retain `night/twilight` heritage; semantics are now parchment-based.
export const surfaces = {
  nightDeep: "#FAEFD8",                            // primary parchment canvas
  nightDeepGradientTop: "#FEFAEA",                  // canvas top highlight
  nightDeepGradientBottom: "#F0E0BA",               // canvas bottom shadow
  twilightGlass: "rgba(255, 249, 234, 0.78)",       // frosted-cream glass on parchment
  manuscriptCream: "#F5EDD8",                       // śloka surface (unchanged)
  dawnAccentFrom: "#F4C77B",
  dawnAccentTo: "#E8A85C",
} as const;

export const ink = {
  primaryOnDark: "#3E2A1F",                         // semantic name preserved; now dark ink on canvas
  secondaryOnDark: "#4A3020",
  mutedOnDark: "#5C3D26",
  primaryOnCream: "#1A1408",
  secondaryOnCream: "#5A4E2E",
  mutedOnCream: "#8A7E5E",
  primaryOnDawn: "#1A1408",
  goldAccent: "#9C7A2F",                            // copper-gold reads dark on parchment
  goldAccentOnCream: "#A8821E",
  vermilionAccent: "#A23A1E",                       // deeper vermilion for daylight register
  vermilionAccentOnCream: "#A23A1E",
} as const;

export type GrahaSlug =
  | "surya" | "candra" | "mangala" | "budha" | "guru"
  | "shukra" | "shani" | "rahu" | "ketu";

export interface GrahaColor {
  slug: GrahaSlug;
  devanagari: string;
  iast: string;
  hueName: string;
  primary: string;
  secondaryTint: string;
}

export const grahas: Record<GrahaSlug, GrahaColor> = {
  surya:   { slug: "surya",   devanagari: "सूर्य",  iast: "Sūrya",   hueName: "Solar Gold",        primary: "#E8B845", secondaryTint: "#FFE9A8" },
  candra:  { slug: "candra",  devanagari: "चन्द्र", iast: "Candra",  hueName: "Pearl Silver",      primary: "#D8DBE8", secondaryTint: "#F2F4FA" },
  mangala: { slug: "mangala", devanagari: "मङ्गल",  iast: "Maṅgala", hueName: "Coral Red",         primary: "#C8412E", secondaryTint: "#F5BFAE" },
  budha:   { slug: "budha",   devanagari: "बुध",    iast: "Budha",   hueName: "Verdant Green",     primary: "#3A8C5A", secondaryTint: "#B8DCC4" },
  guru:    { slug: "guru",    devanagari: "गुरु",   iast: "Guru",    hueName: "Saffron Yellow",    primary: "#E89E2A", secondaryTint: "#F8D89E" },
  shukra:  { slug: "shukra",  devanagari: "शुक्र",  iast: "Śukra",   hueName: "Diamond White-Blue", primary: "#A8C8E8", secondaryTint: "#DCE8F4" },
  shani:   { slug: "shani",   devanagari: "शनि",    iast: "Śani",    hueName: "Indigo Black",      primary: "#2C2C3E", secondaryTint: "#9494A8" },
  rahu:    { slug: "rahu",    devanagari: "राहु",   iast: "Rāhu",    hueName: "Smoke Slate",       primary: "#5A5C68", secondaryTint: "#8E909C" },
  ketu:    { slug: "ketu",    devanagari: "केतु",   iast: "Ketu",    hueName: "Ash Maroon",        primary: "#7A3E4A", secondaryTint: "#B88898" },
} as const;

export type RashiSlug =
  | "mesha" | "vrishabha" | "mithuna" | "karka" | "simha" | "kanya"
  | "tula" | "vrishchika" | "dhanus" | "makara" | "kumbha" | "mina";

export type Element = "fire" | "earth" | "air" | "water";
export type Modality = "chara" | "sthira" | "dvi-svabhava";

export interface RashiColor {
  slug: RashiSlug;
  number: number;
  devanagari: string;
  iast: string;
  english: string;
  element: Element;
  modality: Modality;
  primary: string;
}

export const rashis: Record<RashiSlug, RashiColor> = {
  mesha:      { slug: "mesha",      number: 1,  devanagari: "मेष",      iast: "Meṣa",       english: "Aries",       element: "fire",  modality: "chara",       primary: "#D8472E" },
  vrishabha:  { slug: "vrishabha",  number: 2,  devanagari: "वृषभ",     iast: "Vṛṣabha",    english: "Taurus",      element: "earth", modality: "sthira",      primary: "#7A6B3E" },
  mithuna:    { slug: "mithuna",    number: 3,  devanagari: "मिथुन",    iast: "Mithuna",    english: "Gemini",      element: "air",   modality: "dvi-svabhava", primary: "#D8C56C" },
  karka:      { slug: "karka",      number: 4,  devanagari: "कर्क",     iast: "Karka",      english: "Cancer",      element: "water", modality: "chara",       primary: "#5A8AC8" },
  simha:      { slug: "simha",      number: 5,  devanagari: "सिंह",     iast: "Siṁha",      english: "Leo",         element: "fire",  modality: "sthira",      primary: "#E89E2A" },
  kanya:      { slug: "kanya",      number: 6,  devanagari: "कन्या",    iast: "Kanyā",      english: "Virgo",       element: "earth", modality: "dvi-svabhava", primary: "#A8A07A" },
  tula:       { slug: "tula",       number: 7,  devanagari: "तुला",     iast: "Tulā",       english: "Libra",       element: "air",   modality: "chara",       primary: "#C8B888" },
  vrishchika: { slug: "vrishchika", number: 8,  devanagari: "वृश्चिक",  iast: "Vṛścika",    english: "Scorpio",     element: "water", modality: "sthira",      primary: "#3A4A6A" },
  dhanus:     { slug: "dhanus",     number: 9,  devanagari: "धनुस्",   iast: "Dhanus",     english: "Sagittarius", element: "fire",  modality: "dvi-svabhava", primary: "#D87A3E" },
  makara:     { slug: "makara",     number: 10, devanagari: "मकर",     iast: "Makara",     english: "Capricorn",   element: "earth", modality: "chara",       primary: "#4A4030" },
  kumbha:     { slug: "kumbha",     number: 11, devanagari: "कुम्भ",    iast: "Kumbha",     english: "Aquarius",    element: "air",   modality: "sthira",      primary: "#7A8AA8" },
  mina:       { slug: "mina",       number: 12, devanagari: "मीन",      iast: "Mīna",       english: "Pisces",      element: "water", modality: "dvi-svabhava", primary: "#5A7A8A" },
} as const;

export type StreamSlug = "parashara" | "kp" | "jaimini" | "lal-kitab" | "tajika" | "nadi";

export interface StreamBadge {
  slug: StreamSlug;
  label: string;
  primary: string;
}

export const streams: Record<StreamSlug, StreamBadge> = {
  parashara:   { slug: "parashara",   label: "Parāśara",   primary: "#E8C772" },
  kp:          { slug: "kp",          label: "KP",         primary: "#A8C8E8" },
  jaimini:     { slug: "jaimini",     label: "Jaimini",    primary: "#B88898" },
  "lal-kitab": { slug: "lal-kitab",   label: "Lal Kitab",  primary: "#C8412E" },
  tajika:      { slug: "tajika",      label: "Tājika",     primary: "#3A8C5A" },
  nadi:        { slug: "nadi",        label: "Nāḍī",       primary: "#7A6B3E" },
} as const;

export const goldOnGlassHairline = "rgba(232, 199, 114, 0.18)";
