/**
 * Jyotiṣa-Sāṅga Synthesis Hub — static data.
 *
 * Two views' data in one file:
 *   1. HUB: Jyotiṣa-at-centre, five interlock spokes — the synthesis viz.
 *   2. SCENARIOS: three Vedic-life tasks where the learner picks the
 *      operationally-involved Vedāṅgas (the sāṅga mental-model test).
 *
 * Per L2 §7 markdown: "the *full version* — with the cluster structure
 * visualised, with the Jyotiṣa-interlocks shown as coupling-lines… and with
 * the `sāṅga` discipline displayed as a closing-summary panel."
 */

export type VedangaSlug =
  | "shiksha"
  | "kalpa"
  | "vyakarana"
  | "nirukta"
  | "chandas"
  | "jyotisha";

/** Positions for SVG hub layout (viewBox 0 0 400 400, centre 200,200). */
export const HUB_POSITIONS: Record<Exclude<VedangaSlug, "jyotisha">, { x: number; y: number }> = {
  shiksha:   { x: 200, y: 60 },   //   0° (top)
  kalpa:     { x: 333, y: 157 },  //  72°
  vyakarana: { x: 282, y: 313 },  // 144°
  nirukta:   { x: 118, y: 313 },  // 216°
  chandas:   { x: 67,  y: 157 },  // 288°
};

export type ModernPracticeRelevance = "operational" | "occasional";

export interface InterlockSpoke {
  slug: Exclude<VedangaSlug, "jyotisha">;
  iast: string;
  devanagari: string;
  /** Short label for the spoke (e.g. "mantra", "citation"). */
  interlockLabel: string;
  /** One-line summary of the coupling. */
  interlockBrief: string;
  /** Full prose describing how Jyotiṣa couples with this Vedāṅga in modern
   * practice. */
  interlockDetail: string;
  modernPractice: ModernPracticeRelevance;
}

export const HUB_SPOKES: InterlockSpoke[] = [
  {
    slug: "shiksha",
    iast: "Śikṣā",
    devanagari: "शिक्षा",
    interlockLabel: "mantra",
    interlockBrief: "Correct pronunciation of remedial mantras.",
    interlockDetail:
      "Jyotiṣa-derived remedies often prescribe specific Vedic mantras. Correct pronunciation is Śikṣā's domain — a mispronounced mantra is operationally non-equivalent to the prescribed one. A Jyotiṣa practitioner who orders a mantra remedy without Śikṣā support is shipping the prescription incomplete.",
    modernPractice: "operational",
  },
  {
    slug: "kalpa",
    iast: "Kalpa",
    devanagari: "कल्प",
    interlockLabel: "ritual timing",
    interlockBrief: "When the rite begins; what the rite consists of.",
    interlockDetail:
      "Jyotiṣa supplies the muhurta — the moment the ritual begins. Kalpa governs the procedure performed at that moment. In a temple-priest tradition this interlock is direct and constant; in modern client practice it appears only when a consultation supports a real rite (rarer but operationally real).",
    modernPractice: "occasional",
  },
  {
    slug: "vyakarana",
    iast: "Vyākaraṇa",
    devanagari: "व्याकरण",
    interlockLabel: "citation",
    interlockBrief: "Defensible classical citation in Sanskrit.",
    interlockDetail:
      "Jyotiṣa cites classical ślokas — Pāṇinīya Śikṣā, Bṛhat Saṁhitā, Vedāṅga Jyotiṣa — constantly. Vyākaraṇa is what separates a defensible classical citation from a misattributed or mis-parsed one. A working practitioner whose Sanskrit grammar is sound carries the tradition; one whose isn't, slowly drifts away from it.",
    modernPractice: "operational",
  },
  {
    slug: "nirukta",
    iast: "Nirukta",
    devanagari: "निरुक्त",
    interlockLabel: "etymology",
    interlockBrief: "Lineage of difficult Jyotiṣa terms.",
    interlockDetail:
      "Jyotiṣa technical terms — yoga, kāla, daśā, dṛṣṭi — have Vedic etymological lineages that a Nirukta lens makes legible. A learner who knows where a term came from reads classical Jyotiṣa literature with a sharper sense of what it is actually saying and what it is not.",
    modernPractice: "occasional",
  },
  {
    slug: "chandas",
    iast: "Chandas",
    devanagari: "छन्दस्",
    interlockLabel: "metre",
    interlockBrief: "Recognising the metre of memorised verses.",
    interlockDetail:
      "Jyotiṣa learners memorise classical ślokas. Chandas — the prosody discipline — governs verse metre. Recognising the metre is how a learner stays faithful to the verse while reciting it under pressure; it is also how a learner catches their own misquotation in real time.",
    modernPractice: "operational",
  },
];

/** Pāṇinīya Śikṣā 42 closing verse — the sāṅga citation. */
export const SANGA_VERSE = {
  devanagari: "षड्भिः अङ्गैः सहोपेतं — सर्वाङ्ग साङ्गम् इति स्मृतम् ।",
  iast: "Ṣaḍbhiḥ aṅgaiḥ saho-petaṁ — sarvāṅga-sāṅgam iti smṛtam.",
  english:
    "Endowed with all six limbs — that is what classical tradition calls sāṅga: the integrated, with-all-limbs discipline.",
  source: "Pāṇinīya Śikṣā 42 (closing verse)",
};

export interface SangaScenario {
  id: string;
  title: string;
  prompt: string;
  /** The set of Vedāṅgas that are *operationally* involved in this task. */
  correctSlugs: VedangaSlug[];
  /** One-paragraph explanation revealed after the user submits. */
  rationale: string;
}

export const SCENARIOS: SangaScenario[] = [
  {
    id: "s1",
    title: "Memorise Bṛhat Saṁhitā śloka 1.5",
    prompt:
      "A Jyotiṣa learner must commit Bṛhat Saṁhitā śloka 1.5 to memory in time for tomorrow's teaching session — and must be able to cite it accurately from memory. Which Vedāṅgas are operationally involved?",
    correctSlugs: ["shiksha", "chandas", "vyakarana"],
    rationale:
      "Śikṣā for pronunciation of the Sanskrit consonants. Chandas for recognising the metre — that's how the learner knows where each line breaks under pressure. Vyākaraṇa for parsing the compound words so the verse is defensible when later cited in front of a peer.",
  },
  {
    id: "s2",
    title: "Plan a śubha-muhurta for a temple consecration",
    prompt:
      "A Jyotiṣa practitioner is asked to determine the auspicious muhurta for a temple consecration. The priest team will perform the consecration rite at the moment chosen. Which Vedāṅgas are operationally involved?",
    correctSlugs: ["jyotisha", "kalpa"],
    rationale:
      "Jyotiṣa is the discipline supplying the timing — its own domain. Kalpa governs the ritual procedure that runs at that timing. This is the cleanest, most direct interlock — the one that explains why Jyotiṣa originally entered the Vedāṅga compendium in the first place.",
  },
  {
    id: "s3",
    title: "Decode a classical term in a kuṇḍalī reading",
    prompt:
      "A learner reads the phrase 'graha-yoga' in a classical Jyotiṣa text and isn't sure which technical sense applies — is it the compound (graha + yoga) or the fixed term (graha-yoga as a kind of planetary configuration)? Which Vedāṅgas are operationally involved to recover the right meaning?",
    correctSlugs: ["nirukta", "vyakarana"],
    rationale:
      "Nirukta clarifies the etymological lineage of yoga in Vedic and Jyotiṣa contexts — what range of meanings the word carries. Vyākaraṇa ensures the compound is parsed correctly — is graha-yoga a tatpuruṣa, a karmadhāraya, or a frozen technical term? Both lenses together let the learner read the passage with classical fidelity.",
  },
];
