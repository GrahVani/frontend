import { grahas, ink, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";

export type DigitId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type ReadingMode = "balanced" | "strengths" | "shadows" | "overclaim";

export interface DigitMeaning {
  digit: DigitId;
  grahaSlug: GrahaSlug;
  graha: string;
  devanagari: string;
  title: string;
  core: string;
  strengths: string[];
  shadows: string[];
  prescription: string;
  honestFrame: string;
  crossSystem: string;
}

export const DIGIT_MEANINGS: DigitMeaning[] = [
  {
    digit: 1,
    grahaSlug: "surya",
    graha: "Surya",
    devanagari: "सूर्य",
    title: "Leadership, authority, vitality",
    core: "The first digit begins, directs, and carries the solar register of individuation.",
    strengths: ["clarity of direction", "command presence", "founder energy", "self-assertion"],
    shadows: ["isolation through leadership", "authority attachment", "over-assertion", "rigidity"],
    prescription: "You must run your own business.",
    honestFrame: "Leadership can express through founder, team lead, mentor, senior contributor, or household responsibility.",
    crossSystem: "Chaldean 1, Pythagorean 1, and Vedic Mulanka 1 all begin from this solar baseline.",
  },
  {
    digit: 2,
    grahaSlug: "candra",
    graha: "Candra",
    devanagari: "चन्द्र",
    title: "Receptivity, partnership, public feeling",
    core: "The second digit reflects, responds, pairs, and carries the lunar register of mind and relationship.",
    strengths: ["empathy", "partnership capacity", "public resonance", "intuitive response"],
    shadows: ["dependency", "emotional volatility", "over-receptivity", "indecision"],
    prescription: "You must always work in partnership.",
    honestFrame: "Partnership elements help, but solo work can still suit a Candra-2 person when sensitivity has a channel.",
    crossSystem: "The Surya-Candra complement is useful, but it never guarantees relationship outcome.",
  },
  {
    digit: 3,
    grahaSlug: "guru",
    graha: "Guru",
    devanagari: "गुरु",
    title: "Wisdom, expansion, teaching",
    core: "The third digit expands meaning, counsel, learning, and the Jupiterian impulse to guide.",
    strengths: ["wisdom presence", "teaching capacity", "optimism", "counsel"],
    shadows: ["over-expansion", "dogmatism", "preachy tendency", "spiritual bypass"],
    prescription: "You must become a teacher or guru.",
    honestFrame: "Guru-3 can express through engineering mentorship, research, writing, parenting, counsel, or formal teaching.",
    crossSystem: "Western Pythagorean 3 often says expression and creativity; Vedic language adds Guru's counsel depth.",
  },
  {
    digit: 4,
    grahaSlug: "rahu",
    graha: "Rahu",
    devanagari: "राहु",
    title: "Unconventional, intense, change-oriented",
    core: "The fourth digit carries the shadow-graha register of disruption, foreignness, investigation, and material traction.",
    strengths: ["innovation", "depth investigation", "cosmopolitan capacity", "sudden-change adaptation"],
    shadows: ["restlessness", "materialism excess", "rootlessness", "disruption without construction"],
    prescription: "You are cursed by Rahu and must change your name.",
    honestFrame: "Rahu-4 is textured, not cursed: read its unconventional strengths and integration challenges without fear.",
    crossSystem: "Indian Rahu-4 and Western Pythagorean foundation-builder 4 are different vocabularies; name the system you are using.",
  },
  {
    digit: 5,
    grahaSlug: "budha",
    graha: "Budha",
    devanagari: "बुध",
    title: "Intellect, communication, adaptability",
    core: "The fifth digit carries Mercury's quick register of speech, trade, exchange, analysis, and flexible movement.",
    strengths: ["quick thinking", "articulate speech", "networking", "adaptability"],
    shadows: ["scattered focus", "non-committal", "surface-only learning", "nervous restlessness"],
    prescription: "You should avoid stable commitments because 5 must always be free.",
    honestFrame: "Budha-5 needs movement and exchange, but real skill comes when agility is paired with focus.",
    crossSystem: "Pythagorean 5 overlaps strongly with Budha: freedom, change, communication, and movement.",
  },
  {
    digit: 6,
    grahaSlug: "shukra",
    graha: "Shukra",
    devanagari: "शुक्र",
    title: "Beauty, relationship, harmony",
    core: "The sixth digit carries Venus's kama register of art, pleasure, relationship, refinement, and comfort.",
    strengths: ["aesthetic sense", "relational warmth", "harmony creation", "comfort providing"],
    shadows: ["over-indulgence", "conflict avoidance", "vanity", "sensual attachment"],
    prescription: "A 6 guarantees marriage harmony and material comfort.",
    honestFrame: "Shukra-6 supports beauty and relationship, but harmony is built through choices, context, and mutual conduct.",
    crossSystem: "Across systems, 6 often keeps the relationship, beauty, care, and responsibility register.",
  },
  {
    digit: 7,
    grahaSlug: "ketu",
    graha: "Ketu",
    devanagari: "केतु",
    title: "Detachment, refinement, moksha-orientation",
    core: "The seventh digit carries the south-node register of inward release, contemplation, subtraction, and subtle perception.",
    strengths: ["depth inquiry", "productive solitude", "witness perspective", "research focus"],
    shadows: ["disconnection", "spiritual bypass", "chronic isolation", "premature renunciation"],
    prescription: "You are cursed with disconnection and cannot sustain relationships.",
    honestFrame: "Ketu-7 is inward and refined, not cursed: read solitude as capacity, then watch for disconnection.",
    crossSystem: "Ketu-7 parallels Rahu-4 as a shadow-graha digit; Western 7 often speaks as the searcher, scholar, or analyst.",
  },
  {
    digit: 8,
    grahaSlug: "shani",
    graha: "Shani",
    devanagari: "शनि",
    title: "Discipline, structure, karma",
    core: "The eighth digit carries Saturn's long-haul register of time, work, responsibility, consequence, and durable construction.",
    strengths: ["sustained effort", "durability", "structure building", "late-bloomer success"],
    shadows: ["rigidity", "burden orientation", "delay fixation", "loneliness"],
    prescription: "Mulanka 8 means perpetual Sade-Sati and Saturn's curse.",
    honestFrame: "Shani-8 is a numerology register; Sade-Sati is a transit. Do not collapse categories.",
    crossSystem: "Pythagorean 8 often reads material mastery and authority; Vedic language adds Shani's time, karma, and discipline.",
  },
  {
    digit: 9,
    grahaSlug: "mangala",
    graha: "Mangala",
    devanagari: "मङ्गल",
    title: "Energy, action, courage",
    core: "The ninth digit carries Mars's fire register of action, drive, conflict, completion, protection, and decisive movement.",
    strengths: ["action capacity", "courage", "completion drive", "protective initiative"],
    shadows: ["aggression", "impulsivity", "anger", "over-action"],
    prescription: "You are doomed to anger issues and should change to a peaceful number.",
    honestFrame: "Mangala-9 needs conscious channeling; fire can protect, act, lead, repair, or burn.",
    crossSystem: "In Chaldean, no letter carries 9, but names can reduce to 9 as a result; then the Mangala register applies.",
  },
];

export const READING_MODES: Array<{ id: ReadingMode; label: string; note: string; color: string }> = [
  { id: "balanced", label: "Balanced", note: "Strength and shadow together.", color: "#2F7D52" },
  { id: "strengths", label: "Strengths only", note: "Useful as a layer, incomplete alone.", color: ink.goldAccent },
  { id: "shadows", label: "Shadows only", note: "Can become anxiety-inducing.", color: "#A23A1E" },
  { id: "overclaim", label: "Over-claim", note: "Turns a register into a life prescription.", color: grahas.mangala.primary },
];

export function getDigitMeaning(digit: DigitId) {
  return DIGIT_MEANINGS.find((item) => item.digit === digit) ?? DIGIT_MEANINGS[0];
}

export function digitColor(digit: DigitId) {
  const meaning = getDigitMeaning(digit);
  if (meaning.grahaSlug === "candra") return "#5A6F96";
  if (meaning.grahaSlug === "shukra") return "#356C96";
  return grahas[meaning.grahaSlug].primary;
}
