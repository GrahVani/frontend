/**
 * Static data for the Dasha Selector interactive component.
 * Lists the classical conditional daśās and their triggering chart criteria.
 */

export interface ConditionalDasha {
  id: string;
  nameIAST: string;
  devanagari: string;
  cycleLength: number;
  conditionDescription: string;
  shortCondition: string;
  source: string;
  color: string;
}

export const CONDITIONAL_DASHAS: ConditionalDasha[] = [
  {
    id: "chaturashiti",
    nameIAST: "Chaturāśīti Sama",
    devanagari: "चतुराशीतिसम",
    cycleLength: 84,
    conditionDescription: "Applies when the 10th lord is placed in the 10th house.",
    shortCondition: "10th lord in 10th house",
    source: "BPHS 43.25",
    color: "#E89E2A", // Saffron Yellow
  },
  {
    id: "dvisaptati",
    nameIAST: "Dvisaptati Sama",
    devanagari: "द्विसप्ततिसम",
    cycleLength: 72,
    conditionDescription: "Applies when the Lagna lord is placed in the Lagna or the 7th house.",
    shortCondition: "Lagna lord in Lagna/7th",
    source: "BPHS 43.26",
    color: "#C8412E", // Coral Red
  },
  {
    id: "shatabdika",
    nameIAST: "Śatabdikā",
    devanagari: "शताब्दिका",
    cycleLength: 100,
    conditionDescription: "Applies when the Lagna is Vargottama (same sign in D1 and D9 charts).",
    shortCondition: "Lagna is Vargottama",
    source: "BPHS 43.24",
    color: "#3A8C5A", // Verdant Green
  },
  {
    id: "shashtihayani",
    nameIAST: "Śaṣṭihāyanī",
    devanagari: "षष्टिहायनी",
    cycleLength: 60,
    conditionDescription: "Applies when the Sun is placed in the Lagna.",
    shortCondition: "Sun is in Lagna",
    source: "BPHS 43.27",
    color: "#E8B845", // Solar Gold
  },
  {
    id: "ashtottari",
    nameIAST: "Aṣṭottarī",
    devanagari: "अष्टोत्तरी",
    cycleLength: 108,
    conditionDescription: "Applies when Rāhu is in a Kendra or Trikona from the Lagna Lord, but not conjunct the Lagna Lord. (Also depends on day/night birth and Moon phase).",
    shortCondition: "Rāhu in specific dignity to Lagna Lord",
    source: "BPHS 43.14-16",
    color: "#A8C8E8", // Diamond White-Blue
  },
];
