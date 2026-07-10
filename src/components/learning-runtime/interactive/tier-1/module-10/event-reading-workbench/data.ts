/**
 * Event Reading Workbench — Data Layer
 *
 * §7 interactive for Lesson 10.4.4 (Introductory Daśā Event Reading).
 *
 * Computes functional lordship for any of the 12 ascendants, maps question
 * domains to relevant houses and natural kārakas, and runs the six-step
 * event-reading workflow end-to-end.
 */

import type { GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import { getNaisargikaRelation } from "../bhukti-yoga-matrix/data";
import { GRAHA_KARAKAS } from "../karaka-overlay-reader/data";

/* ─── Sign lordship (0=Aries → 11=Pisces) ──────────────────────────────── */

export const SIGN_LORDS: GrahaSlug[] = [
  "mangala",  // 0 Aries
  "shukra",   // 1 Taurus
  "budha",    // 2 Gemini
  "candra",   // 3 Cancer
  "surya",    // 4 Leo
  "budha",    // 5 Virgo
  "shukra",   // 6 Libra
  "mangala",  // 7 Scorpio
  "guru",     // 8 Sagittarius
  "shani",    // 9 Capricorn
  "shani",    // 10 Aquarius
  "guru",     // 11 Pisces
];

export const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const RASHI_NAMES_IAST = [
  "Meṣa", "Vṛṣabha", "Mithuna", "Karkaṭa",
  "Siṃha", "Kanyā", "Tulā", "Vṛścika",
  "Dhanus", "Makara", "Kumbha", "Mīna",
];

/** Which houses (1–12) does a given graha rule for a given ascendant? */
export function getRuledHouses(ascendantIndex: number, graha: GrahaSlug): number[] {
  const houses: number[] = [];
  for (let h = 1; h <= 12; h++) {
    const signIndex = (ascendantIndex + h - 1) % 12;
    if (SIGN_LORDS[signIndex] === graha) {
      houses.push(h);
    }
  }
  return houses;
}

/* ─── Question domains ─────────────────────────────────────────────────── */

export interface QuestionDomain {
  id: string;
  label: string;
  labelIAST: string;
  relevantHouses: number[];
  karakaSlugs: GrahaSlug[];
  description: string;
}

export const DOMAINS: QuestionDomain[] = [
  {
    id: "marriage",
    label: "Marriage / partnership",
    labelIAST: "Vivāha",
    relevantHouses: [7],
    karakaSlugs: ["shukra", "guru"],
    description: "7th house + Venus (spouse-kāraka) + Jupiter (husband-kāraka for women).",
  },
  {
    id: "career",
    label: "Career / status",
    labelIAST: "Karma",
    relevantHouses: [10],
    karakaSlugs: ["surya", "shani", "guru"],
    description: "10th house + Sun (authority) + Saturn (work) + Jupiter (fortune).",
  },
  {
    id: "wealth",
    label: "Wealth / gains",
    labelIAST: "Dhana",
    relevantHouses: [2, 11],
    karakaSlugs: ["guru", "shukra", "budha"],
    description: "2nd & 11th houses + Jupiter (gains) + Venus (luxury) + Mercury (commerce).",
  },
  {
    id: "health",
    label: "Health / vitality",
    labelIAST: "Ārogya",
    relevantHouses: [1, 6],
    karakaSlugs: ["surya", "mangala", "candra"],
    description: "1st & 6th houses + Sun (vitality) + Mars (energy) + Moon (mind-body).",
  },
  {
    id: "spirituality",
    label: "Spirituality / dharma",
    labelIAST: "Dharma",
    relevantHouses: [9, 12],
    karakaSlugs: ["guru", "ketu", "surya"],
    description: "9th & 12th houses + Jupiter (dharma) + Ketu (mokṣa) + Sun (soul).",
  },
];

/* ─── Simplified dignity (illustrative) ────────────────────────────────── */

export type DignityLevel = "exalted" | "own" | "friendly" | "neutral" | "enemy" | "debilitated";

export interface LordDisposition {
  dignity: DignityLevel;
  label: string;
}

export const DIGNITY_OPTIONS: { value: DignityLevel; label: string; score: number }[] = [
  { value: "exalted", label: "Exalted (ucca)", score: 3 },
  { value: "own", label: "Own sign (sva)", score: 2 },
  { value: "friendly", label: "Friendly sign", score: 1 },
  { value: "neutral", label: "Neutral sign", score: 0 },
  { value: "enemy", label: "Enemy sign", score: -1 },
  { value: "debilitated", label: "Debilitated (nīca)", score: -2 },
];

/* ─── Six-step workflow engine ─────────────────────────────────────────── */

export interface WorkflowStep {
  step: number;
  title: string;
  titleIAST: string;
  content: string;
  detail?: string;
  status: "pending" | "active" | "complete";
}

export interface TwoYesIndicator {
  id: string;
  label: string;
  source: "MD" | "AD" | "both";
  active: boolean;
}

export interface WorkflowResult {
  steps: WorkflowStep[];
  twoYesIndicators: TwoYesIndicator[];
  twoYesCount: number;
  verdict: "reliable" | "uncertain" | "no-signal";
  bhuktiYoga: "friend" | "neutral" | "enemy" | "self";
  overlayReading: string;
}

export function runWorkflow(
  domain: QuestionDomain,
  ascendantIndex: number,
  mdSlug: GrahaSlug,
  adSlug: GrahaSlug,
  mdDignity: DignityLevel,
  adDignity: DignityLevel
): WorkflowResult {
  const mdKaraka = GRAHA_KARAKAS[mdSlug];
  const adKaraka = GRAHA_KARAKAS[adSlug];

  // Step 1: Domain
  const step1: WorkflowStep = {
    step: 1,
    title: "Identify the domain",
    titleIAST: "Viṣaya-nirṇaya",
    content: `${domain.label} → relevant houses: ${domain.relevantHouses.map((h) => `${h}th`).join(", ")}.`,
    detail: domain.description,
    status: "complete",
  };

  // Step 2: Active lords
  const step2: WorkflowStep = {
    step: 2,
    title: "Locate active MD-AD",
    titleIAST: "Daśā-prabhor anveṣaṇam",
    content: `Mahādaśā: ${mdKaraka.name} · Antardaśā: ${adKaraka.name}.`,
    detail: `The period is coloured by ${mdKaraka.name}'s ${mdKaraka.domains[0]} quality, with ${adKaraka.name}'s ${adKaraka.domains[0]} flavour active now.`,
    status: "complete",
  };

  // Step 3: MD disposition
  const mdRuledHouses = getRuledHouses(ascendantIndex, mdSlug);
  const mdRelevant = mdRuledHouses.filter((h) => domain.relevantHouses.includes(h));
  const mdIsKaraka = domain.karakaSlugs.includes(mdSlug);
  const mdDignityLabel = DIGNITY_OPTIONS.find((d) => d.value === mdDignity)?.label ?? mdDignity;

  const step3: WorkflowStep = {
    step: 3,
    title: "Check MD-lord disposition",
    titleIAST: "Mahādaśā-prabhor avasthā",
    content: `${mdKaraka.name} rules ${mdRuledHouses.length > 0 ? `house${mdRuledHouses.length > 1 ? "s" : ""} ${mdRuledHouses.join(", ")}` : "no house"} for ${RASHI_NAMES[ascendantIndex]} Lagna.`,
    detail: `${mdDignityLabel}.${mdRelevant.length > 0 ? ` Relevant to domain: rules the ${mdRelevant.join(", ")}th house.` : ""}${mdIsKaraka ? ` Natural ${domain.label.toLowerCase()} kāraka.` : ""}`,
    status: "complete",
  };

  // Step 4: AD disposition
  const adRuledHouses = getRuledHouses(ascendantIndex, adSlug);
  const adRelevant = adRuledHouses.filter((h) => domain.relevantHouses.includes(h));
  const adIsKaraka = domain.karakaSlugs.includes(adSlug);
  const adDignityLabel = DIGNITY_OPTIONS.find((d) => d.value === adDignity)?.label ?? adDignity;

  const step4: WorkflowStep = {
    step: 4,
    title: "Check AD-lord disposition",
    titleIAST: "Antardaśā-prabhor avasthā",
    content: `${adKaraka.name} rules ${adRuledHouses.length > 0 ? `house${adRuledHouses.length > 1 ? "s" : ""} ${adRuledHouses.join(", ")}` : "no house"} for ${RASHI_NAMES[ascendantIndex]} Lagna.`,
    detail: `${adDignityLabel}.${adRelevant.length > 0 ? ` Relevant to domain: rules the ${adRelevant.join(", ")}th house.` : ""}${adIsKaraka ? ` Natural ${domain.label.toLowerCase()} kāraka.` : ""}`,
    status: "complete",
  };

  // Step 5: Bhukti-yoga + kāraka overlay
  const relation = getNaisargikaRelation(mdSlug, adSlug);
  const bhuktiYogaLabel =
    relation === "friend" ? "auspicious / smooth" : relation === "enemy" ? "inauspicious / friction" : relation === "self" ? "intensified same-lord" : "mixed / mediocre";

  const overlap = mdKaraka.domains.filter((d) => adKaraka.domains.includes(d));
  const overlayReading =
    mdSlug === adSlug
      ? `${mdKaraka.name} meets itself — an intensified ${mdKaraka.domains[0]} phase.`
      : overlap.length > 0
        ? `${mdKaraka.name}'s ${mdKaraka.domains[0]} quality expressed through ${adKaraka.name}'s ${adKaraka.domains[0]} flavour → ${overlap.join(" / ")} come to the fore.`
        : `${mdKaraka.name}'s ${mdKaraka.domains[0]} quality expressed through ${adKaraka.name}'s ${adKaraka.domains[0]} flavour.`;

  const step5: WorkflowStep = {
    step: 5,
    title: "Bhukti-yoga + Kāraka overlay",
    titleIAST: "Bhukti-yoga-kārakādhikāra",
    content: `Naisargika relation: ${relation === "self" ? "same lord" : relation} → ${bhuktiYogaLabel}.`,
    detail: overlayReading,
    status: "complete",
  };

  // Step 6: Two-yes check
  const twoYesIndicators: TwoYesIndicator[] = [];

  if (mdRelevant.length > 0) {
    twoYesIndicators.push({
      id: "md-house-lord",
      label: `MD-lord rules ${domain.label.toLowerCase()} house (${mdRelevant.join(", ")}th)`,
      source: "MD",
      active: true,
    });
  }
  if (mdIsKaraka) {
    twoYesIndicators.push({
      id: "md-karaka",
      label: `MD-lord is natural ${domain.label.toLowerCase()} kāraka`,
      source: "MD",
      active: true,
    });
  }
  if (adRelevant.length > 0) {
    twoYesIndicators.push({
      id: "ad-house-lord",
      label: `AD-lord rules ${domain.label.toLowerCase()} house (${adRelevant.join(", ")}th)`,
      source: "AD",
      active: true,
    });
  }
  if (adIsKaraka) {
    twoYesIndicators.push({
      id: "ad-karaka",
      label: `AD-lord is natural ${domain.label.toLowerCase()} kāraka`,
      source: "AD",
      active: true,
    });
  }
  if (relation === "friend") {
    twoYesIndicators.push({
      id: "bhukti-yoga",
      label: "Friendly bhukti-yoga between MD and AD",
      source: "both",
      active: true,
    });
  }
  const mdDignityScore = DIGNITY_OPTIONS.find((d) => d.value === mdDignity)?.score ?? 0;
  const adDignityScore = DIGNITY_OPTIONS.find((d) => d.value === adDignity)?.score ?? 0;
  if (mdDignityScore >= 1 && adDignityScore >= 1) {
    twoYesIndicators.push({
      id: "dignity",
      label: "Both lords are well-dignified (exalted / own / friendly)",
      source: "both",
      active: true,
    });
  }

  const twoYesCount = twoYesIndicators.length;
  const verdict: WorkflowResult["verdict"] =
    twoYesCount >= 2 ? "reliable" : twoYesCount === 1 ? "uncertain" : "no-signal";

  const step6: WorkflowStep = {
    step: 6,
    title: "Two-yes check",
    titleIAST: "Dvisammati-parīkṣā",
    content: `${twoYesCount} independent indicator${twoYesCount !== 1 ? "s" : ""} active.`,
    detail:
      verdict === "reliable"
        ? `≥2 independent indicators agree — the prediction clears the gate. Deliver as a corroborated tendency, not a decree.`
        : verdict === "uncertain"
          ? `Only 1 indicator — one yes alone is uncertain. Report "uncertain" rather than committing.`
          : `No indicators active — no basis for a prediction on this question with these lords.`,
    status: verdict === "reliable" ? "complete" : "active",
  };

  return {
    steps: [step1, step2, step3, step4, step5, step6],
    twoYesIndicators,
    twoYesCount,
    verdict,
    bhuktiYoga: relation,
    overlayReading,
  };
}

/* ─── Preset scenarios ─────────────────────────────────────────────────── */

export interface ScenarioPreset {
  id: string;
  label: string;
  domainId: string;
  ascendantIndex: number;
  mdSlug: GrahaSlug;
  adSlug: GrahaSlug;
  mdDignity: DignityLevel;
  adDignity: DignityLevel;
  note: string;
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "aries-marriage",
    label: "Aries marriage (lesson example)",
    domainId: "marriage",
    ascendantIndex: 0,
    mdSlug: "surya",
    adSlug: "shukra",
    mdDignity: "own",
    adDignity: "own",
    note: "Sun MD (5th-lord, romance era) + Venus AD (7th-lord + spouse-kāraka) = two independent yeses → reliable.",
  },
  {
    id: "leo-marriage",
    label: "Leo marriage (Venus is NOT 7th-lord)",
    domainId: "marriage",
    ascendantIndex: 4,
    mdSlug: "surya",
    adSlug: "shukra",
    mdDignity: "own",
    adDignity: "friendly",
    note: "For Leo, Venus rules 3rd & 10th — NOT the 7th. Only one marriage indicator (Venus as spouse-kāraka).",
  },
  {
    id: "capricorn-career",
    label: "Capricorn career (Saturn + Sun)",
    domainId: "career",
    ascendantIndex: 9,
    mdSlug: "shani",
    adSlug: "surya",
    mdDignity: "own",
    adDignity: "debilitated",
    note: "Saturn MD (1st & 2nd-lord) + Sun AD (8th-lord, debilitated in Libra). Weak career signal.",
  },
  {
    id: "taurus-wealth",
    label: "Taurus wealth (Venus + Jupiter)",
    domainId: "wealth",
    ascendantIndex: 1,
    mdSlug: "shukra",
    adSlug: "guru",
    mdDignity: "own",
    adDignity: "own",
    note: "Venus MD (1st & 6th-lord) + Jupiter AD (8th & 11th-lord, gains). Jupiter rules 11th → wealth yes.",
  },
  {
    id: "scorpio-health",
    label: "Scorpio health (Mars + Sun)",
    domainId: "health",
    ascendantIndex: 7,
    mdSlug: "mangala",
    adSlug: "surya",
    mdDignity: "own",
    adDignity: "friendly",
    note: "Mars MD (1st & 6th-lord) + Sun AD (10th-lord). Mars rules 1st & 6th → two health indicators.",
  },
];
