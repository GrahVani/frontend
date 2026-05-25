/**
 * BPHS Citation Dojo — L2.2 §7 flagship data.
 *
 * Two views:
 *   1. VERSE CROSS-REFERENCE — the canonical Vimśottarī starting-daśā rule
 *      (BPHS Daśākramaprakaraṇa 46.1 in Santhanam-numbering), shown with
 *      Sanskrit + English + Devanāgarī, and how it cross-references to the
 *      Sitaram Jha and Devacandra Jha recensions.
 *   2. CITATION DISCIPLINE DRILL — five scenarios specific to BPHS-citation
 *      discipline. Adapted from L2.2 §6 Recognition cases.
 */

export interface VerseCrossReference {
  santhanamCitation: string;
  santhanamPage: string;
  prakaranaContext: string;
  sanskritDevanagari: string;
  iastTransliteration: string;
  englishTranslation: string;
  doctrinalPoint: string;
  /** How this verse is cited across the three recensions. */
  crossReferences: {
    recension: string;
    citation: string;
    notes: string;
  }[];
}

export const VIMSHOTTARI_VERSE: VerseCrossReference = {
  santhanamCitation: "BPHS Daśākramaprakaraṇa, Adhyāya 46, verse 1",
  santhanamPage: "Santhanam Vol II, pp. 1024-1031",
  prakaranaContext:
    "The opening verse of the Daśākramaprakaraṇa — establishing Vimśottarī as the primary daśā system and declaring that the starting mahā-daśā lord is determined by the graha governing the nakṣatra in which the Moon resides at the moment of birth.",
  sanskritDevanagari:
    "जन्मकाले शशी यस्मिन् नक्षत्रे तत्र यो ग्रहः ।\nतस्मात् प्रारभ्य गणिता विंशोत्तर्या दशा भवेत् ॥",
  iastTransliteration:
    "Janmakāle śaśī yasmin nakṣatre tatra yo grahaḥ |\nTasmāt prārabhya gaṇitā Vimśottaryā daśā bhavet ||",
  englishTranslation:
    "Per Santhanam: \"The graha ruling the nakṣatra occupied by the Moon at the time of birth — beginning from this graha, the Vimśottarī mahā-daśā sequence is reckoned.\" (Santhanam 1996, Vol II, p. 1024)",
  doctrinalPoint:
    "This single verse is the foundation of the entire Vimśottarī mahā-daśā framework — the time-engine that underwrites virtually all Tier 1 and Tier 2 predictive practice. Every modern Jyotiṣa daśā computation traces back to this rule. The doctrine is stable across all three recensions; only the chapter:verse REFERENCE differs.",
  crossReferences: [
    {
      recension: "Santhanam (1996) — CURRICULUM DEFAULT",
      citation: "Daśākramaprakaraṇa, Adhyāya 46.1 · Vol II, pp. 1024-1031",
      notes: "English translation + Sanskrit en face. The reference used throughout the curriculum.",
    },
    {
      recension: "Sitaram Jha (Chaukhamba)",
      citation: "Daśākramaprakaraṇa, Adhyāya 48.1 (in some manuscript families)",
      notes: "Sanskrit + Hindi commentary. Adhyāya number shifts +2 in some manuscript families due to splitting of an earlier chapter.",
    },
    {
      recension: "Devacandra Jha (Chaukhamba)",
      citation: "Daśākramaprakaraṇa, Adhyāya 46.1 (verse text identical; Hindi commentary differs)",
      notes: "Verse-numbering matches Santhanam; the Hindi commentary expands on the daśā-lord determination.",
    },
  ],
};

export interface DrillScenario {
  id: string;
  title: string;
  prompt: string;
  options: { id: string; label: string }[];
  correctId: string;
  rationale: string;
  disciplineMove: string;
}

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    id: "s1",
    title: "\"Per BPHS chapter 46\"",
    prompt:
      "A modern teacher writes: \"Per BPHS chapter 46, the starting daśā lord is determined by Moon's nakṣatra at birth.\" The doctrine is correct. What's still wrong with the citation?",
    options: [
      {
        id: "a",
        label: "Nothing is wrong — the chapter and the doctrine are both right.",
      },
      {
        id: "b",
        label: "\"BPHS chapter 46\" doesn't name the recension. Sitaram Jha may number it 48 in some manuscript families. The four-move discipline requires recension specification — e.g., \"BPHS Daśākramaprakaraṇa 46.1 (Santhanam 1996)\".",
      },
      {
        id: "c",
        label: "The doctrine is wrong — the starting daśā lord depends on Lagna, not Moon.",
      },
      {
        id: "d",
        label: "BPHS doesn't have a chapter 46.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) catches the citation-discipline problem. \"BPHS chapter 46\" is doctrinally right but recensionally vague. Honest citation names the prakaraṇa-division, the chapter:verse in a SPECIFIC recension, and ideally the translator-edition with page number. (c) is doctrinally wrong — the daśā rule IS Moon-nakṣatra-based, not Lagna-based. (d) is false.",
    disciplineMove: "What recension? — for BPHS especially, name the manuscript family (Santhanam / Sitaram Jha / Devacandra Jha).",
  },
  {
    id: "s2",
    title: "\"Maharṣi Parāśara wrote BPHS 5,000 years ago\"",
    prompt:
      "A pop-astrology source claims: \"Maharṣi Parāśara wrote BPHS 5,000 years ago — making it the oldest astrology text in the world.\" What's wrong?",
    options: [
      {
        id: "a",
        label: "The claim conflates the pre-classical Parāśara FIGURE (whom tradition does place ~3000 BCE) with the medieval-recension TEXT (Pingree dates it 10th-14th c. CE).",
      },
      {
        id: "b",
        label: "Nothing — Parāśara did write BPHS 5,000 years ago.",
      },
      {
        id: "c",
        label: "BPHS isn't the oldest astrology text — the Egyptian decanal calendars predate it.",
      },
      {
        id: "d",
        label: "Maharṣi Parāśara isn't a real historical figure.",
      },
    ],
    correctId: "a",
    rationale:
      "(a) is the right disambiguation. The pop framing collapses the Parāśara DUAL IDENTITY — pre-classical ṛṣi-figure (per tradition) vs medieval-recension text (per academic dating). The honest move is to hold both layers visibly: \"The pre-classical Parāśara figure to whom tradition attributes the doctrine is dated traditionally to ~3000 BCE; the recensional TEXT we have access to is dated by academic-Indology scholarship to the 10th-14th c. CE.\" (b) collapses the layers. (c) is technically true but misses the citation-discipline issue. (d) overswings — the tradition attests a Parāśara figure across multiple non-Jyotiṣa texts.",
    disciplineMove: "Hold both layers — pre-classical ṛṣi (tradition) AND medieval recension (academic) — never collapse them.",
  },
  {
    id: "s3",
    title: "\"Is BPHS 100% authoritative?\"",
    prompt:
      "A learner asks: \"Is BPHS 100% authoritative since it's by Parāśara? Should I treat it as the unmediated word of the ṛṣi?\" What's the right framing?",
    options: [
      {
        id: "a",
        label: "Yes — BPHS is the foundational text; treat it as definitive.",
      },
      {
        id: "b",
        label: "BPHS is the MOST-CITED classical source, AND it has the SHARPEST recension problem. Treat it as a primary source whose RECENSIONAL form is medieval — the core doctrine is authoritative, but \"BPHS says X\" requires recension specification.",
      },
      {
        id: "c",
        label: "No — BPHS is a modern fabrication.",
      },
      {
        id: "d",
        label: "It depends on which guru you follow.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the honest framing. BPHS's core doctrine carries genuine authority within the Parāśarī lineage — but the TEXT as we read it is mediated through medieval manuscript transmission. \"Unmediated word of the ṛṣi\" overclaims; \"modern fabrication\" underclaims. The honest middle is: foundational authority within the lineage, with explicit recognition that the textual form is recensional. (a) collapses the recension problem. (c) is dismissive and false. (d) abdicates the scholarly question.",
    disciplineMove: "Recognise the two-layer authority — doctrinal authority within lineage + textual recensional layering.",
  },
  {
    id: "s4",
    title: "Sanskrit verse from a translator-only source",
    prompt:
      "A student quotes BPHS in an essay: \"BPHS says: 'janma-kāle śaśī yasmin nakṣatre tatra yo grahaḥ...' (translated by Santhanam 1996).\" The student doesn't read Sanskrit. What's actually going on with this citation?",
    options: [
      {
        id: "a",
        label: "The student should not have quoted Sanskrit they can't read — academic dishonesty.",
      },
      {
        id: "b",
        label: "The student is citing the Sanskrit text that appears en face in Santhanam's translation — the Santhanam edition prints the Sanskrit alongside the English. Citing the Sanskrit-as-Santhanam-prints-it is honest, AS LONG AS the translator is named.",
      },
      {
        id: "c",
        label: "Santhanam isn't a real translator.",
      },
      {
        id: "d",
        label: "The Sanskrit verse is incorrect.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the right framing. Santhanam's 1996 edition prints Sanskrit en face — the student is citing the Sanskrit-as-Santhanam-presents-it. This is honest IF the translator is named (which it is here). A Sanskrit-reading student would still want to cross-check against the Sitaram Jha or Devacandra Jha Sanskrit if precision matters, but the basic citation is sound. (a) is overzealous — citing primary-language text via a critical edition is standard academic practice when the translator is acknowledged. (c) and (d) are false.",
    disciplineMove: "What modern translator? — naming the translator-edition is what makes Sanskrit citation honest even for non-Sanskrit-readers.",
  },
  {
    id: "s5",
    title: "Cross-recension verse comparison",
    prompt:
      "A learner notices two BPHS quotes appear slightly different in two books — same doctrine, slightly different Sanskrit wording. What's the most likely explanation?",
    options: [
      {
        id: "a",
        label: "One of the books is wrong.",
      },
      {
        id: "b",
        label: "Different recensions preserve slightly different Sanskrit wordings of the same verse. The CORE DOCTRINE is stable; the manuscript transmission produced minor variations. The honest move is to name which recension each book draws on.",
      },
      {
        id: "c",
        label: "The doctrine changed across recensions.",
      },
      {
        id: "d",
        label: "BPHS doesn't have stable verses.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the right framing. Manuscript transmission inevitably produces minor variations — word-choices, occasional verse-counts, sometimes whole verses present in one recension but not another. The CORE DOCTRINE is stable across all three major BPHS recensions; the SURFACE TEXT carries minor variations. Recognising this is recension-awareness. (a) is too binary. (c) overclaims (doctrine is stable). (d) overswings (verses ARE stable in core meaning).",
    disciplineMove: "Recension-awareness — minor textual variation does NOT mean doctrinal instability.",
  },
];

export const FRAMEWORK_SUMMARY = {
  headline: "Cite BPHS with all four moves.",
  body: "Name the prakaraṇa-division. Name the chapter:verse in Santhanam-numbering (the curriculum default). Name Santhanam 1996 as the translator-edition. Acknowledge the medieval-recensional layer separating the text from the pre-classical Parāśara core. The result is honest scholarship that respects both lineage authority and academic methodology.",
};
