/**
 * Vedāṅga Relationship Diagram — static data.
 *
 * Six Vedāṅgas with their functions, body-part metaphors, cluster memberships,
 * Jyotiṣa interlocks, and modern-practice operational relevance.
 *
 * Per curriculum/02 §4.3 + Lesson 2's §4 body. Source: Pāṇinīya Śikṣā 41-42
 * + Vedāṅga Jyotiṣa (Lagadha) + Defouw & Svoboda (2003).
 */

export type ClusterSlug = "recitation" | "meaning" | "action";

export interface VedangaNode {
  slug: "shiksha" | "kalpa" | "vyakarana" | "nirukta" | "chandas" | "jyotisha";
  iast: string;
  devanagari: string;
  /** What this Vedāṅga studies / governs. */
  function: string;
  /** Body-part metaphor from Pāṇinīya Śikṣā 41. */
  bodyPart: string;
  /** Cluster memberships — Vyākaraṇa belongs to two. */
  clusters: ClusterSlug[];
  /**
   * How this Vedāṅga interlocks with Jyotiṣa in practice. Null for Jyotiṣa
   * itself (self — no interlock).
   */
  jyotishaInterlock: string | null;
  /** Modern-practice relevance for a working Jyotiṣa practitioner. */
  modernPractice: "operational" | "occasional" | "self";
  /** Hex bearing for hexagonal arrangement (0 = top, clockwise). */
  bearingDeg: number;
}

export const VEDANGA_NODES: VedangaNode[] = [
  {
    slug: "shiksha",
    iast: "Śikṣā",
    devanagari: "शिक्षा",
    function: "Phonetics — how Vedic recitation is pronounced",
    bodyPart: "Nose",
    clusters: ["recitation"],
    jyotishaInterlock:
      "Mantra prescription. Jyotiṣa-derived remedies often involve specific mantras; correct pronunciation is Śikṣā's domain. A Jyotiṣa practitioner who prescribes a mantra incorrectly pronounced is operating without Śikṣā support.",
    modernPractice: "operational",
    bearingDeg: 60,
  },
  {
    slug: "kalpa",
    iast: "Kalpa",
    devanagari: "कल्प",
    function: "Ritual procedure — how Vedic ritual is performed",
    bodyPart: "Hand",
    clusters: ["action"],
    jyotishaInterlock:
      "Ritual timing. Jyotiṣa determines when ritual happens; Kalpa governs what is done in the ritual. Where a Jyotiṣa consultation supports a ritual (rare in modern practice but operationally real in the temple-priest tradition), the interlock is direct.",
    modernPractice: "occasional",
    bearingDeg: 120,
  },
  {
    slug: "vyakarana",
    iast: "Vyākaraṇa",
    devanagari: "व्याकरण",
    function: "Grammar — how Vedic Sanskrit is parsed",
    bodyPart: "Mouth",
    clusters: ["recitation", "meaning"],
    jyotishaInterlock:
      "Citation work. Jyotiṣa cites classical śloka in Sanskrit constantly. Vyākaraṇa enables accurate citation — the difference between a defensible classical citation and a misattributed one is grammatical competence.",
    modernPractice: "operational",
    bearingDeg: 180,
  },
  {
    slug: "jyotisha",
    iast: "Jyotiṣa",
    devanagari: "ज्योतिष",
    function: "Astronomy + astrology — how time is determined and read",
    bodyPart: "Eye",
    clusters: ["action"],
    jyotishaInterlock: null,
    modernPractice: "self",
    bearingDeg: 0,
  },
  {
    slug: "nirukta",
    iast: "Nirukta",
    devanagari: "निरुक्त",
    function: "Etymology — how difficult Vedic terms are understood",
    bodyPart: "Ear",
    clusters: ["meaning"],
    jyotishaInterlock:
      "Technical-term unpacking. Jyotiṣa terminology (`Vimśottarī`, `ayanāṁśa`, `navāṁśa`, `ṣaḍbala`, `kāraka`) often has Vedic etymology that a Nirukta lens clarifies. A learner who knows the etymological lineage of a Jyotiṣa term reads the classical literature with a sharper sense of meaning.",
    modernPractice: "occasional",
    bearingDeg: 300,
  },
  {
    slug: "chandas",
    iast: "Chandas",
    devanagari: "छन्दस्",
    function: "Prosody — how Vedic verse moves",
    bodyPart: "Foot",
    clusters: ["recitation"],
    jyotishaInterlock:
      "Verse memorisation. Jyotiṣa learners memorise classical śloka — Pāṇinīya Śikṣā, Bṛhat Saṁhitā, Vedāṅga Jyotiṣa. Chandas governs metre; recognising metre is how a learner avoids mis-quoting a verse.",
    modernPractice: "operational",
    bearingDeg: 240,
  },
];

export interface Cluster {
  slug: ClusterSlug;
  label: string;
  /** Hex color from the Grahvani chapter-accent palette. */
  color: string;
  description: string;
  /** Which Vedāṅgas belong to this cluster (denormalised for quick lookup). */
  memberSlugs: VedangaNode["slug"][];
}

export const CLUSTERS: Cluster[] = [
  {
    slug: "recitation",
    label: "Recitation",
    color: "#C28220",
    description: "How the Veda is recited",
    memberSlugs: ["shiksha", "vyakarana", "chandas"],
  },
  {
    slug: "meaning",
    label: "Meaning",
    color: "#4F6FA8",
    description: "How the Veda is understood",
    memberSlugs: ["vyakarana", "nirukta"],
  },
  {
    slug: "action",
    label: "Action",
    color: "#A23A1E",
    description: "How the Veda is enacted",
    memberSlugs: ["kalpa", "jyotisha"],
  },
];

/** Pāṇinīya Śikṣā 42 closing (sāṅga) couplet — verbatim from lesson §5. */
export const SANGA_CITATION = {
  devanagari: "शिक्षा घ्राणं तु वेदस्य मुखं व्याकरणं स्मृतम्। तस्मात् साङ्गमधीत्यैव ब्रह्मलोके महीयते॥",
  iast: "śikṣā ghrāṇaṁ tu vedasya mukhaṁ vyākaraṇaṁ smṛtam | tasmāt sāṅgam-adhītyaiva brahma-loke mahīyate ||",
  english:
    "Śikṣā is the nose of the Veda; Vyākaraṇa is remembered as its mouth. Therefore (tasmāt), having studied the Veda together with all its limbs (sāṅgam-adhītya), one is honoured in the world of Brahman.",
  source: "Pāṇinīya Śikṣā 42",
};
