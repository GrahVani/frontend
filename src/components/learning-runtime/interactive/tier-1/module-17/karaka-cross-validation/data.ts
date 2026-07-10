import { type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type ValidationStatus = "convergence" | "divergence" | "cara-only";

export interface KarakaValidationScenario {
  slug: string;
  domain: string;
  role: string;
  caraPlanet: GrahaSlug;
  caraLabel: string;
  naturalPlanet: GrahaSlug | null;
  naturalLabel: string;
  status: ValidationStatus;
  confidence: string;
  headline: string;
  reading: string;
  caution: string;
}

export const KARAKA_VALIDATION_SCENARIOS: KarakaValidationScenario[] = [
  {
    slug: "mother-moon",
    domain: "Mother",
    role: "MK",
    caraPlanet: "candra",
    caraLabel: "Matṛkāraka = Moon",
    naturalPlanet: "candra",
    naturalLabel: "Naisargika mother = Moon",
    status: "convergence",
    confidence: "High confidence",
    headline: "Both layers nominate the Moon.",
    reading: "Read the Moon's house, dignity, and aspects for mother with added confidence because the chart-specific and fixed witnesses agree.",
    caution: "Do not call this automatic. The Moon is not Matṛkāraka in every chart; this agreement is the special signal.",
  },
  {
    slug: "spouse-saturn",
    domain: "Spouse",
    role: "DK",
    caraPlanet: "shani",
    caraLabel: "Dārakāraka = Saturn",
    naturalPlanet: "shukra",
    naturalLabel: "Naisargika spouse = Venus",
    status: "divergence",
    confidence: "Nuanced reading",
    headline: "The layers disagree, so keep both.",
    reading: "Venus supplies the natural marriage template; Saturn gives this chart's spouse-theme a Saturnine texture: maturity, duty, delay, steadiness, or karmic weight.",
    caution: "Recheck the degree ranking once. If it holds, divergence is information, not an error.",
  },
  {
    slug: "children-mercury",
    domain: "Children",
    role: "PK",
    caraPlanet: "budha",
    caraLabel: "Putrakāraka = Mercury",
    naturalPlanet: "guru",
    naturalLabel: "Naisargika children = Jupiter",
    status: "divergence",
    confidence: "Nuanced reading",
    headline: "Jupiter remains baseline; Mercury individualizes the theme.",
    reading: "Jupiter gives the natural children/progeny witness. Mercury as PK adds study, speech, cleverness, calculation, or youthful variability to this native's child/intellect theme.",
    caution: "Never average Jupiter and Mercury into a score. Read the qualitative difference side by side.",
  },
  {
    slug: "self-ak",
    domain: "Soul / self",
    role: "AK",
    caraPlanet: "shani",
    caraLabel: "Ātmakāraka = Saturn",
    naturalPlanet: null,
    naturalLabel: "No exact fixed equivalent",
    status: "cara-only",
    confidence: "Jaimini anchor",
    headline: "The AK stands as the cara soul-significator.",
    reading: "The Sun remains a natural self/authority indicator, but the Jaimini AK is a chart-specific soul anchor rather than a one-to-one fixed pair.",
    caution: "Do not force a convergence where the lesson says there is no exact naisargika equivalent.",
  },
];

export function getValidationScenario(slug: string) {
  return KARAKA_VALIDATION_SCENARIOS.find((scenario) => scenario.slug === slug) ?? KARAKA_VALIDATION_SCENARIOS[0];
}
