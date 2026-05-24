/**
 * Static data for the Vedāṅga Body Map.
 * Mirrors `curriculum/interactive-specs/vedanga-body-map.md`.
 *
 * The figure illustration lives in `/public/assets/learning/vedic-body-composite.png`
 * (1024 × 1536, baked-in glyphs at classical body-part metaphor positions per
 * Pāṇinīya Śikṣā 41-42). Positions below are percent-of-image coordinates of the
 * baked-in glyph centres — they drive absolute-positioned invisible hit regions
 * overlaid on top of the illustration.
 */

export interface VedangaEntry {
  slug: "shiksha" | "kalpa" | "vyakarana" | "nirukta" | "chandas" | "jyotisha";
  number: 1 | 2 | 3 | 4 | 5 | 6;
  devanagari: string;
  iast: string;
  bodyPart: string;
  /** Percent-of-image coordinates of the baked-in glyph centre. */
  position: { x: number; y: number };
  /** Body-part marker accent hue — Jyotiṣa gets the warmest. */
  accentHex: string;
  function: string;
  citation: string;
  /** Bonus state for Jyotiṣa — when active, the third-eye reveal gets a poetic flourish. */
  bonus?: boolean;
}

export const VEDANGAS: VedangaEntry[] = [
  {
    slug: "shiksha",
    number: 1,
    devanagari: "शिक्षा",
    iast: "Śikṣā",
    bodyPart: "Nose (nāsika)",
    position: { x: 47, y: 18 },
    accentHex: "#C9A24D",
    function: "Phonetics — how Vedic recitation is pronounced.",
    citation: "Pāṇinīya Śikṣā 41-42 (foundational Vedāṅga enumeration).",
  },
  {
    slug: "kalpa",
    number: 2,
    devanagari: "कल्प",
    iast: "Kalpa",
    bodyPart: "Hand (hasta)",
    position: { x: 24, y: 57 },
    accentHex: "#C9A24D",
    function: "Ritual procedure — how Vedic ritual is performed.",
    citation: "Kalpa-Sūtras (Bodhāyana, Āpastamba, Hiraṇyakeśin) — the Vedāṅga's foundational manuals.",
  },
  {
    slug: "vyakarana",
    number: 3,
    devanagari: "व्याकरण",
    iast: "Vyākaraṇa",
    bodyPart: "Mouth (mukha)",
    position: { x: 49, y: 22.5 },
    accentHex: "#C9A24D",
    function: "Grammar — how Vedic Sanskrit is parsed and analysed.",
    citation: "Pāṇini's Aṣṭādhyāyī — the canonical grammatical text of this Vedāṅga.",
  },
  {
    slug: "nirukta",
    number: 4,
    devanagari: "निरुक्त",
    iast: "Nirukta",
    bodyPart: "Ear (śrotra)",
    position: { x: 60, y: 19.5 },
    accentHex: "#C9A24D",
    function: "Etymology — how difficult Vedic terms are understood.",
    citation: "Yāska's Nirukta — the canonical etymological text of this Vedāṅga.",
  },
  {
    slug: "chandas",
    number: 5,
    devanagari: "छन्दस्",
    iast: "Chandas",
    bodyPart: "Foot (pāda)",
    position: { x: 39, y: 91 },
    accentHex: "#C9A24D",
    function: "Prosody / metre — how Vedic verse moves.",
    citation: "Piṅgala's Chandaḥśāstra — the canonical metrical text of this Vedāṅga.",
  },
  {
    slug: "jyotisha",
    number: 6,
    devanagari: "ज्योतिष",
    iast: "Jyotiṣa",
    bodyPart: "Eye (cakṣuḥ) — vedasya cakṣuḥ, the eye of the Veda",
    position: { x: 50, y: 13.5 },
    accentHex: "#E89E2A",
    function: "Celestial motion — the science of time, the eye that sees when Vedic ritual is performed.",
    citation: "Lagadha's Vedāṅga Jyotiṣa (~1400 BCE) — the earliest surviving Indian Jyotiṣa text.",
    bonus: true,
  },
];

export const SIDEBAR_INSTRUCTIONS =
  "Tap any of the six luminous body-parts. Each Vedāṅga reveals its name in Devanāgarī, its function, and the classical citation that anchors it.";
