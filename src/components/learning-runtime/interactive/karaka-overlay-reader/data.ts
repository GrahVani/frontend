/**
 * Kāraka Overlay Reader — Data Layer
 *
 * §7 interactive for Lesson 10.4.2 (Kāraka Overlay: the AD-Lord Shapes the MD).
 *
 * Holds graha natural significations (kārakas), the MD-quality / AD-flavour
 * overlay engine, multi-kāraka cluster definitions, and worked examples.
 */

import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export interface GrahaKaraka {
  slug: GrahaSlug;
  name: string;
  nameIAST: string;
  /** Broad life-phase quality when this planet is the MD-lord */
  mdQuality: string;
  /** Primary natural significations (domains) */
  domains: string[];
  /** Secondary / nuanced significations */
  secondaryDomains: string[];
  /** One-line essence */
  essence: string;
}

export interface KarakaCluster {
  id: string;
  label: string;
  labelIAST: string;
  /** Graha slugs that are part of this cluster */
  grahaSlugs: GrahaSlug[];
  /** House lords involved (shown as reference, not computed) */
  houseLords: number[];
  /** Description of what this cluster signals */
  signal: string;
  /** Minimum graha matches in active lords to flag this cluster */
  minMatches: number;
}

export interface WorkedOverlay {
  id: string;
  mdSlug: GrahaSlug;
  adSlug: GrahaSlug;
  label: string;
  reading: string;
  note: string;
}

export interface OverlayResult {
  mdQuality: string;
  adFlavour: string;
  reading: string;
  triggeredClusters: KarakaCluster[];
}

/* ─── Graha kārakas (natural significations) ───────────────────────────── */

export const GRAHA_KARAKAS: Record<GrahaSlug, GrahaKaraka> = {
  ketu: {
    slug: "ketu",
    name: "Ketu",
    nameIAST: "Ketu",
    mdQuality: "Intensified spiritual focus, detachment, sudden turns, past-life karma surfacing",
    domains: ["spirituality", "detachment", "mokṣa", "sudden events", "past-life karma", "occult"],
    secondaryDomains: ["loss of material grip", "renunciation", "liberation"],
    essence: "The severing thread — cuts away what no longer serves.",
  },
  shukra: {
    slug: "shukra",
    name: "Venus",
    nameIAST: "Śukra",
    mdQuality: "Relational and aesthetic emphasis — love, luxury, creative expression, comfort",
    domains: ["relationships", "marriage", "love", "luxury", "arts", "beauty", "comfort", "vehicles"],
    secondaryDomains: ["sensory pleasure", "harmony", "social grace", "finance"],
    essence: "The minister of beauty — refines and connects.",
  },
  surya: {
    slug: "surya",
    name: "Sun",
    nameIAST: "Sūrya",
    mdQuality: "Authority and self-definition — career thrust, recognition, vitality, government",
    domains: ["authority", "self", "soul", "father", "career", "government", "recognition", "vitality"],
    secondaryDomains: ["leadership", "ego", "health", "status"],
    essence: "The king — illuminates and commands.",
  },
  candra: {
    slug: "candra",
    name: "Moon",
    nameIAST: "Candra",
    mdQuality: "Emotional and domestic emphasis — mind, mother, public, nourishment, fluctuation",
    domains: ["mind", "mother", "emotions", "public", "nourishment", "home", "fluids"],
    secondaryDomains: ["imagination", "receptivity", "travel", "changeability"],
    essence: "The queen of tides — reflects and nurtures.",
  },
  mangala: {
    slug: "mangala",
    name: "Mars",
    nameIAST: "Maṅgala",
    mdQuality: "Action and assertion — energy, courage, conflict, property, siblings, competition",
    domains: ["energy", "courage", "siblings", "property", "conflict", "competition", "assertion"],
    secondaryDomains: ["surgery", "engineering", "military", "passion"],
    essence: "The commander — acts and conquers.",
  },
  rahu: {
    slug: "rahu",
    name: "Rāhu",
    nameIAST: "Rāhu",
    mdQuality: "Amplification and disruption — obsession, foreignness, unconventionality, sudden rise",
    domains: ["obsession", "foreign", "unconventional", "amplification", "sudden rise", "technology"],
    secondaryDomains: ["illusion", "masses", "breaking boundaries", "desire"],
    essence: "The magnifying shadow — expands and distorts.",
  },
  guru: {
    slug: "guru",
    name: "Jupiter",
    nameIAST: "Guru",
    mdQuality: "Wisdom and expansion — dharma, children, teaching, fortune, higher learning",
    domains: ["wisdom", "children", "dharma", "expansion", "teacher", "fortune", "higher learning"],
    secondaryDomains: ["wealth", "marriage (for women)", "counsel", "optimism"],
    essence: "The guru — guides and expands.",
  },
  shani: {
    slug: "shani",
    name: "Saturn",
    nameIAST: "Śani",
    mdQuality: "Structure and responsibility — discipline, delay, service, karma, longevity, work",
    domains: ["discipline", "delay", "longevity", "service", "karma", "work", "structure"],
    secondaryDomains: ["sorrow", "persistence", "boundaries", "aging"],
    essence: "The judge — teaches through time.",
  },
  budha: {
    slug: "budha",
    name: "Mercury",
    nameIAST: "Budha",
    mdQuality: "Intellect and commerce — communication, skill, adaptability, study, trade",
    domains: ["intelligence", "speech", "commerce", "skill", "adaptability", "study", "writing"],
    secondaryDomains: ["anxiety", "analysis", "youth", "diplomacy"],
    essence: "The prince — negotiates and learns.",
  },
};

/* ─── Multi-kāraka clusters ────────────────────────────────────────────── */

export const KARAKA_CLUSTERS: KarakaCluster[] = [
  {
    id: "marriage",
    label: "Marriage / partnership",
    labelIAST: "Vivāha",
    grahaSlugs: ["shukra", "guru"],
    houseLords: [7],
    signal:
      "Venus + Jupiter + 7th-lord converging → strong marriage or partnership window.",
    minMatches: 2,
  },
  {
    id: "career",
    label: "Career recognition",
    labelIAST: "Karma-sthāna",
    grahaSlugs: ["surya", "shani", "guru"],
    houseLords: [10],
    signal:
      "Sun + Saturn + 10th-lord converging → career advancement, status rise, or public authority.",
    minMatches: 2,
  },
  {
    id: "conflict",
    label: "Conflict / competition",
    labelIAST: "Yuddha",
    grahaSlugs: ["mangala", "shani"],
    houseLords: [3, 6],
    signal:
      "Mars + Saturn + 3rd/6th-lords converging → competition, legal battles, or health challenges.",
    minMatches: 2,
  },
  {
    id: "wealth",
    label: "Wealth / gains",
    labelIAST: "Dhana",
    grahaSlugs: ["guru", "shukra", "budha"],
    houseLords: [2, 11],
    signal:
      "Jupiter + Venus + Mercury + 2nd/11th-lords converging → financial growth, acquisition, or prosperity.",
    minMatches: 2,
  },
  {
    id: "spirituality",
    label: "Spirituality / mokṣa",
    labelIAST: "Mokṣa",
    grahaSlugs: ["guru", "ketu", "surya"],
    houseLords: [9, 12],
    signal:
      "Jupiter + Ketu + Sun + 9th/12th-lords converging → spiritual awakening, pilgrimage, or renunciation.",
    minMatches: 2,
  },
  {
    id: "health",
    label: "Health / vitality",
    labelIAST: "Ārogya",
    grahaSlugs: ["surya", "mangala", "candra"],
    houseLords: [1, 6],
    signal:
      "Sun + Mars + Moon + 1st/6th-lords converging → health focus, vitality changes, or medical attention.",
    minMatches: 2,
  },
];

/* ─── Overlay engine ───────────────────────────────────────────────────── */

/** Generate a thematic reading from MD + AD kārakas. */
export function computeOverlay(
  mdSlug: GrahaSlug,
  adSlug: GrahaSlug
): OverlayResult {
  const md = GRAHA_KARAKAS[mdSlug];
  const ad = GRAHA_KARAKAS[adSlug];

  // Build reading sentence
  const mdDomain = md.domains[0];
  const adDomain = ad.domains[0];
  let reading: string;

  if (mdSlug === adSlug) {
    reading = `${md.name} meets itself — an intensified ${mdDomain} phase where ${md.essence.toLowerCase()}`;
  } else {
    // Find overlapping domains for richer reading
    const overlap = md.domains.filter((d) => ad.domains.includes(d));
    if (overlap.length > 0) {
      reading = `${md.name}'s ${mdDomain} quality expressed through ${ad.name}'s ${adDomain} flavour → ${overlap.join(" / ")} come to the fore.`;
    } else {
      reading = `${md.name}'s ${mdDomain} quality expressed through ${ad.name}'s ${adDomain} flavour → ${md.name} colours the era; ${ad.name} names what is active now.`;
    }
  }

  // Check clusters
  const activeSlugs = new Set([mdSlug, adSlug]);
  const triggeredClusters = KARAKA_CLUSTERS.filter((cluster) => {
    const matches = cluster.grahaSlugs.filter((s) => activeSlugs.has(s)).length;
    return matches >= cluster.minMatches;
  });

  return {
    mdQuality: md.mdQuality,
    adFlavour: ad.domains.join(" · "),
    reading,
    triggeredClusters,
  };
}

/* ─── Worked overlays from the lesson ──────────────────────────────────── */

export const WORKED_OVERLAYS: WorkedOverlay[] = [
  {
    id: "jup-ven",
    mdSlug: "guru",
    adSlug: "shukra",
    label: "Jupiter MD + Venus AD",
    reading: "Dharmic relationships — marriage often occurs in such a bhukti.",
    note: "Jupiter (wisdom/dharma) + Venus (relationships/aesthetics) → sacred union.",
  },
  {
    id: "sat-merc",
    mdSlug: "shani",
    adSlug: "budha",
    label: "Saturn MD + Mercury AD",
    reading: "Structured intellectual work — career advancement through systematic study.",
    note: "Saturn (structure/responsibility) + Mercury (intellect/commerce) → methodical progress.",
  },
  {
    id: "sun-mars",
    mdSlug: "surya",
    adSlug: "mangala",
    label: "Sun MD + Mars AD",
    reading: "Assertive leadership — taking decisive command.",
    note: "Sun (authority/recognition) + Mars (action/courage) → commanding force.",
  },
  {
    id: "ven-jup",
    mdSlug: "shukra",
    adSlug: "guru",
    label: "Venus MD + Jupiter AD",
    reading: "Beautiful wisdom — relationships and dharma harmonised through grace.",
    note: "Venus (beauty/relationships) + Jupiter (wisdom/fortune) → artistic or relational expansion.",
  },
  {
    id: "moon-sat",
    mdSlug: "candra",
    adSlug: "shani",
    label: "Moon MD + Saturn AD",
    reading: "Emotional discipline — domestic responsibilities weigh on the mind.",
    note: "Moon (emotions/home) + Saturn (discipline/delay) → sober emotional maturation.",
  },
  {
    id: "rah-ket",
    mdSlug: "rahu",
    adSlug: "ketu",
    label: "Rāhu MD + Ketu AD",
    reading: "Axis intensity — sudden gains and severance operate together.",
    note: "Rāhu (obsession/amplification) + Ketu (detachment/sudden loss) → karmic pivot point.",
  },
];
