import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type DignityKey = "mulatrikona" | "own" | "greatFriend" | "friend" | "neutral" | "enemy" | "greatEnemy";

export interface DignityScore {
  key: DignityKey;
  label: string;
  iast: string;
  virupas: number;
  tone: "high" | "supportive" | "middle" | "low";
}

export interface SaptavargaLayer {
  key: string;
  name: string;
  focus: string;
}

export interface SaptavargaPlanet {
  slug: GrahaSlug;
  planet: string;
  iast: string;
  devanagari: string;
  color: string;
  pattern: Record<string, DignityKey>;
}

export interface SaptavargaPreset {
  key: string;
  label: string;
  note: string;
  pattern: Record<string, DignityKey>;
}

export const SAPTAVARGA_LAYERS: SaptavargaLayer[] = [
  { key: "d1", name: "D1 Rashi", focus: "body of the chart" },
  { key: "d2", name: "D2 Hora", focus: "wealth and sustenance" },
  { key: "d3", name: "D3 Drekkana", focus: "siblings and effort" },
  { key: "d7", name: "D7 Saptamsa", focus: "children and lineage" },
  { key: "d9", name: "D9 Navamsa", focus: "dharma and maturity" },
  { key: "d12", name: "D12 Dvadasamsa", focus: "parents and inheritance" },
  { key: "d30", name: "D30 Trimsamsa", focus: "misfortune and faults" },
];

export const DIGNITY_SCORES: DignityScore[] = [
  { key: "mulatrikona", label: "Mulatrikona", iast: "Mulatrikona", virupas: 45, tone: "high" },
  { key: "own", label: "Own sign", iast: "Svakshetra", virupas: 30, tone: "high" },
  { key: "greatFriend", label: "Great friend", iast: "Adhimitra", virupas: 22.5, tone: "supportive" },
  { key: "friend", label: "Friend", iast: "Mitra", virupas: 15, tone: "supportive" },
  { key: "neutral", label: "Neutral", iast: "Sama", virupas: 7.5, tone: "middle" },
  { key: "enemy", label: "Enemy", iast: "Shatru", virupas: 3.75, tone: "low" },
  { key: "greatEnemy", label: "Great enemy", iast: "Adhishatru", virupas: 1.875, tone: "low" },
];

export const SAPTAVARGA_PRESETS: SaptavargaPreset[] = [
  {
    key: "worked",
    label: "Worked example",
    note: "30 + 15 + 45 + 7.5 + 30 + 22.5 + 15 = 165.",
    pattern: {
      d1: "own",
      d2: "friend",
      d3: "mulatrikona",
      d7: "neutral",
      d9: "own",
      d12: "greatFriend",
      d30: "friend",
    },
  },
  {
    key: "high",
    label: "Consistent dignity",
    note: "Several vargas carry strong dignity, so the total climbs far above 60.",
    pattern: {
      d1: "mulatrikona",
      d2: "own",
      d3: "greatFriend",
      d7: "own",
      d9: "mulatrikona",
      d12: "friend",
      d30: "greatFriend",
    },
  },
  {
    key: "weak",
    label: "Repeated enemy signs",
    note: "Enemy and great-enemy placements keep the accumulated score low.",
    pattern: {
      d1: "enemy",
      d2: "neutral",
      d3: "greatEnemy",
      d7: "enemy",
      d9: "enemy",
      d12: "greatEnemy",
      d30: "neutral",
    },
  },
];

export const SAPTAVARGA_PLANETS: SaptavargaPlanet[] = [
  {
    slug: "surya",
    planet: "Sun",
    iast: "Surya",
    devanagari: grahas.surya.devanagari,
    color: grahas.surya.primary,
    pattern: SAPTAVARGA_PRESETS[0].pattern,
  },
  {
    slug: "candra",
    planet: "Moon",
    iast: "Candra",
    devanagari: grahas.candra.devanagari,
    color: grahas.candra.primary,
    pattern: SAPTAVARGA_PRESETS[1].pattern,
  },
  {
    slug: "mangala",
    planet: "Mars",
    iast: "Mangala",
    devanagari: grahas.mangala.devanagari,
    color: grahas.mangala.primary,
    pattern: SAPTAVARGA_PRESETS[2].pattern,
  },
  {
    slug: "budha",
    planet: "Mercury",
    iast: "Budha",
    devanagari: grahas.budha.devanagari,
    color: grahas.budha.primary,
    pattern: SAPTAVARGA_PRESETS[0].pattern,
  },
  {
    slug: "guru",
    planet: "Jupiter",
    iast: "Guru",
    devanagari: grahas.guru.devanagari,
    color: grahas.guru.primary,
    pattern: SAPTAVARGA_PRESETS[1].pattern,
  },
  {
    slug: "shukra",
    planet: "Venus",
    iast: "Shukra",
    devanagari: grahas.shukra.devanagari,
    color: grahas.shukra.primary,
    pattern: SAPTAVARGA_PRESETS[0].pattern,
  },
  {
    slug: "shani",
    planet: "Saturn",
    iast: "Shani",
    devanagari: grahas.shani.devanagari,
    color: grahas.shani.primary,
    pattern: SAPTAVARGA_PRESETS[2].pattern,
  },
];

export function getDignityScore(key: DignityKey) {
  return DIGNITY_SCORES.find((score) => score.key === key) ?? DIGNITY_SCORES[0];
}

export function totalSaptavarga(pattern: Record<string, DignityKey>) {
  return SAPTAVARGA_LAYERS.reduce((sum, layer) => sum + getDignityScore(pattern[layer.key]).virupas, 0);
}

export function getSaptavargaPlanet(slug: GrahaSlug) {
  return SAPTAVARGA_PLANETS.find((planet) => planet.slug === slug) ?? SAPTAVARGA_PLANETS[0];
}

export function formatVirupas(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}
