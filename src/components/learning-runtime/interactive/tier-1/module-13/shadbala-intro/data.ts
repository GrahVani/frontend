import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export interface ShadbalaComponent {
  key: string;
  name: string;
  sanskrit: string;
  score: number;
  note: string;
}

export interface ShadbalaPlanetSample {
  slug: GrahaSlug;
  name: string;
  devanagari: string;
  impression: string;
  qualitativeCue: string;
  houseFocus: string;
  ashtakavargaBindus: number;
  predictiveWeight: string;
  components: ShadbalaComponent[];
  color: string;
  tint: string;
}

export const SHADBALA_COMPONENT_NAMES = [
  "Sthana Bala",
  "Dik Bala",
  "Kala Bala",
  "Cheshta Bala",
  "Naisargika Bala",
  "Drik Bala",
];

export const SHADBALA_SAMPLES: ShadbalaPlanetSample[] = [
  {
    slug: "surya",
    name: "Sun",
    devanagari: grahas.surya.devanagari,
    impression: "Looks impressive: exalted, angular, visually strong.",
    qualitativeCue: "Qualitative dignity says the Sun should matter.",
    houseFocus: "10th house support looks high.",
    ashtakavargaBindus: 33,
    predictiveWeight: "High audit score: the Sun can carry its promises with authority.",
    color: grahas.surya.primary,
    tint: grahas.surya.secondaryTint,
    components: [
      { key: "sthana", name: "Sthana", sanskrit: "positional", score: 88, note: "Placement strongly supports the planet." },
      { key: "dik", name: "Dik", sanskrit: "directional", score: 78, note: "Direction gives usable force." },
      { key: "kala", name: "Kala", sanskrit: "temporal", score: 66, note: "Time factors are supportive." },
      { key: "cheshta", name: "Cheshta", sanskrit: "motional", score: 52, note: "Motion is moderate." },
      { key: "naisargika", name: "Naisargika", sanskrit: "natural", score: 82, note: "Natural strength is high." },
      { key: "drik", name: "Drik", sanskrit: "aspectual", score: 58, note: "Aspect pressure is manageable." },
    ],
  },
  {
    slug: "shani",
    name: "Saturn",
    devanagari: grahas.shani.devanagari,
    impression: "Looks difficult: heavy placement and slow delivery.",
    qualitativeCue: "Qualitative reading may under-estimate its staying power.",
    houseFocus: "7th house bindus are average.",
    ashtakavargaBindus: 25,
    predictiveWeight: "Strong audit score: Saturn may deliver slowly but materially.",
    color: grahas.shani.primary,
    tint: grahas.shani.secondaryTint,
    components: [
      { key: "sthana", name: "Sthana", sanskrit: "positional", score: 61, note: "Placement is workable." },
      { key: "dik", name: "Dik", sanskrit: "directional", score: 82, note: "Direction gives force." },
      { key: "kala", name: "Kala", sanskrit: "temporal", score: 76, note: "Time factors are strong." },
      { key: "cheshta", name: "Cheshta", sanskrit: "motional", score: 68, note: "Motion adds weight." },
      { key: "naisargika", name: "Naisargika", sanskrit: "natural", score: 36, note: "Natural strength is lower by scheme." },
      { key: "drik", name: "Drik", sanskrit: "aspectual", score: 72, note: "Aspectual support is meaningful." },
    ],
  },
  {
    slug: "mangala",
    name: "Mars",
    devanagari: grahas.mangala.devanagari,
    impression: "Looks dramatic: sharp, visible, action-oriented.",
    qualitativeCue: "Qualitative heat is obvious, but strength must still be weighed.",
    houseFocus: "4th house bindus are low.",
    ashtakavargaBindus: 19,
    predictiveWeight: "Moderate audit score: visible heat does not equal full delivery.",
    color: grahas.mangala.primary,
    tint: grahas.mangala.secondaryTint,
    components: [
      { key: "sthana", name: "Sthana", sanskrit: "positional", score: 48, note: "Placement is mixed." },
      { key: "dik", name: "Dik", sanskrit: "directional", score: 42, note: "Direction is not ideal." },
      { key: "kala", name: "Kala", sanskrit: "temporal", score: 56, note: "Time factors are moderate." },
      { key: "cheshta", name: "Cheshta", sanskrit: "motional", score: 64, note: "Motion helps expression." },
      { key: "naisargika", name: "Naisargika", sanskrit: "natural", score: 54, note: "Natural strength is middling." },
      { key: "drik", name: "Drik", sanskrit: "aspectual", score: 38, note: "Aspectual pressure reduces confidence." },
    ],
  },
];

export function totalShadbala(sample: ShadbalaPlanetSample) {
  return sample.components.reduce((sum, component) => sum + component.score, 0);
}

export function averageShadbala(sample: ShadbalaPlanetSample) {
  return Math.round(totalShadbala(sample) / sample.components.length);
}

export function strengthBand(score: number) {
  if (score >= 70) return "High";
  if (score >= 52) return "Moderate";
  return "Low";
}

export function getShadbalaSample(slug: GrahaSlug) {
  return SHADBALA_SAMPLES.find((sample) => sample.slug === slug) ?? SHADBALA_SAMPLES[0];
}
