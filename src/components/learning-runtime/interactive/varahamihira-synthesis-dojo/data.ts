/**
 * Varāhamihira Synthesis Dojo — L2.3 §7 flagship data.
 *
 * Two views:
 *   1. AUTHOR CROSS-DATING — show how other classical authors are dated
 *      RELATIVE to Varāhamihira's secure anchor at ~575 CE.
 *   2. CITATION DRILL — 5 scenarios on Varāhamihira-specific citation
 *      discipline (3 from §6 + 2 invented).
 */

export interface RelativeDatingEntry {
  slug: string;
  author: string;
  authorDevanagari: string;
  primaryText: string;
  /** Approximate date range (academic). */
  dateRange: string;
  centralYear: number;
  /** Relation to Varāhamihira. */
  relationLabel: string;
  /** How this author is dated relative to Varāhamihira. */
  relativeDatingNote: string;
  /** Whether they CITE Varāhamihira, ARE CITED BY Varāhamihira, or are CROSS-REFERENCED. */
  relationKind: "post-varahamihira-cites" | "pre-varahamihira-cited-by" | "adjacent-cross-reference";
}

export const RELATIVE_DATING: RelativeDatingEntry[] = [
  {
    slug: "lagadha",
    author: "Lagadha",
    authorDevanagari: "लगध",
    primaryText: "Vedāṅga Jyotiṣa",
    dateRange: "~1200 BCE to ~400 BCE",
    centralYear: -800,
    relationLabel: "Pre-Varāhamihira",
    relativeDatingNote:
      "Lagadha is CITED BY Varāhamihira as a prior authority. This establishes Lagadha as PRE-Varāhamihira but does not by itself give Lagadha a specific date — linguistic and astronomical analysis pushes him further into the pre-classical period.",
    relationKind: "pre-varahamihira-cited-by",
  },
  {
    slug: "sphujidhvaja",
    author: "Sphujidhvaja",
    authorDevanagari: "स्फुजिध्वज",
    primaryText: "Yavanajātaka",
    dateRange: "269 CE (colophon)",
    centralYear: 269,
    relationLabel: "Pre-Varāhamihira",
    relativeDatingNote:
      "Sphujidhvaja's Yavanajātaka has its own colophon date (269 CE) — independent of Varāhamihira. He pre-dates Varāhamihira by ~300 years and is cited as part of the Indo-Hellenistic prior tradition.",
    relationKind: "adjacent-cross-reference",
  },
  {
    slug: "brahmagupta",
    author: "Brahmagupta",
    authorDevanagari: "ब्रह्मगुप्त",
    primaryText: "Brāhmasphuṭasiddhānta",
    dateRange: "598-665 CE",
    centralYear: 632,
    relationLabel: "Adjacent contemporary",
    relativeDatingNote:
      "Brahmagupta (non-Jyotiṣa but adjacent mathematical astronomy) is dated partly through cross-reference to Varāhamihira as a senior predecessor. His own astronomical observations and the Brāhmasphuṭasiddhānta's internal references give independent anchoring; cross-reference to Varāhamihira refines the dating further.",
    relationKind: "adjacent-cross-reference",
  },
  {
    slug: "kalyanavarma",
    author: "Kalyāṇavarmā",
    authorDevanagari: "कल्याणवर्मा",
    primaryText: "Saravali",
    dateRange: "7th-10th century CE",
    centralYear: 850,
    relationLabel: "Post-Varāhamihira",
    relativeDatingNote:
      "Kalyāṇavarmā CITES Varāhamihira as a prior authority. This establishes Kalyāṇavarmā as POST-Varāhamihira (so post-587 CE). He is also CITED BY 9th-10th-century sources, bracketing his date to the 7th-10th c. window. Without Varāhamihira's anchor, this bracketing would be much looser.",
    relationKind: "post-varahamihira-cites",
  },
  {
    slug: "mantresvara",
    author: "Mantreśvara",
    authorDevanagari: "मन्त्रेश्वर",
    primaryText: "Phaladīpikā",
    dateRange: "12th-15th century CE",
    centralYear: 1350,
    relationLabel: "Post-Varāhamihira & Kalyāṇavarmā",
    relativeDatingNote:
      "Mantreśvara CITES both Varāhamihira AND Kalyāṇavarmā as prior authorities — so post-both. He is CITED BY 15th-century sources. This double cross-reference is what dates Phaladīpikā to the 14th c. CE with reasonable confidence.",
    relationKind: "post-varahamihira-cites",
  },
];

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
    title: "Dating Kalyāṇavarmā to \"approximately 750 CE\"",
    prompt:
      "A modern source dates Kalyāṇavarmā to \"approximately 750 CE\" with no further justification. A serious learner asks: how is that date arrived at? What's the most accurate answer?",
    options: [
      {
        id: "a",
        label: "Through manuscript carbon-dating of Saravali fragments.",
      },
      {
        id: "b",
        label: "Through RELATIVE dating against Varāhamihira: Kalyāṇavarmā CITES Varāhamihira (so post-587 CE) and is CITED BY 9th-10th century authors (so pre-9th-10th c.). The bracketing gives a 7th-10th c. window, with ~750-850 CE often cited as the central estimate.",
      },
      {
        id: "c",
        label: "Through Saravali's own internal dating references.",
      },
      {
        id: "d",
        label: "Through traditional Indian chronology placing him in a specific era.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the right framing. Most classical Indian authors don't carry internal dating evidence; their dates are established through CITATION-NETWORK ANALYSIS — who they cite (sets the floor) and who cites them (sets the ceiling). Varāhamihira's secure anchor at ~575 CE serves as the upstream reference: anyone who cites Varāhamihira post-dates him. Kalyāṇavarmā does, and 9th-10th-c. sources cite Kalyāṇavarmā, so he's in between. (a) is rare — manuscript carbon-dating of Indian astrology texts is uncommon. (c) is generally false for classical Jyotiṣa authors. (d) is the lineage perspective but not the academic-Indology methodology.",
    disciplineMove: "Date authors RELATIVE to Varāhamihira's anchor — citation-network bracketing is the standard methodology.",
  },
  {
    id: "s2",
    title: "Citing Bṛhat Jātaka chapter 14",
    prompt:
      "A teacher writes: \"Per Bṛhat Jātaka chapter 14, the rules of Pañcamahāpuruṣa Yoga state that...\" — and gives the doctrinal content correctly. How does this citation compare to BPHS citation discipline?",
    options: [
      {
        id: "a",
        label: "Bṛhat Jātaka requires the same recension-specification as BPHS — naming \"chapter 14\" alone is insufficient.",
      },
      {
        id: "b",
        label: "Bṛhat Jātaka citations are LESS recension-affected than BPHS — Varāhamihira's texts are recension-stable across major editions. The citation is reasonably honest as long as the Bhat (1981) edition or equivalent is implied. Adding \"per Bhat 1981 edition\" makes it explicit-honest.",
      },
      {
        id: "c",
        label: "Bṛhat Jātaka is older than BPHS, so citation is always less careful.",
      },
      {
        id: "d",
        label: "All classical Jyotiṣa citations require the same level of recension specification.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the right framing. Varāhamihira's texts are RECENSION-STABLE — manuscript transmission of named historical-author texts is more controlled than recension of attributed ṛṣi-corpus (like BPHS). Citing \"Bṛhat Jātaka chapter 14\" is reasonably honest in modern practice; adding the translator-edition (Bhat 1981) makes it more rigorous but isn't as urgently required as for BPHS. (a) overstates the recension issue for Varāhamihira. (c) is age-based reasoning unrelated to recension. (d) is too rigid.",
    disciplineMove: "Recension-specification urgency varies by author — BPHS demands it; Varāhamihira citations carry less recension burden.",
  },
  {
    id: "s3",
    title: "\"BPHS or Bṛhat Jātaka — which is more authoritative?\"",
    prompt:
      "A learner asks: \"For natal astrology, is BPHS or Bṛhat Jātaka the MORE authoritative source? They cover overlapping ground.\" What's the right framing?",
    options: [
      {
        id: "a",
        label: "BPHS is more authoritative because Parāśara is older than Varāhamihira.",
      },
      {
        id: "b",
        label: "Bṛhat Jātaka is more authoritative because it's recension-stable.",
      },
      {
        id: "c",
        label: "Both anchors are real, complementary authorities. Parāśara/BPHS = lineage authority (foundational ṛṣi, encyclopaedic horā coverage). Varāhamihira/Bṛhat Jātaka = evidence authority (dateable, recension-stable, three-skandha-spanning). They COMPLEMENT — neither displaces the other.",
      },
      {
        id: "d",
        label: "Modern practice has moved past both of them.",
      },
    ],
    correctId: "c",
    rationale:
      "(c) is the both-anchors framework. Each text carries genuine but DIFFERENT authority. BPHS's encyclopaedic scope + foundational-ṛṣi status make it the most-cited modern source; Bṛhat Jātaka's secure dating + recension stability make it the evidence-authoritative source. Modern practice draws on BOTH — and the citation discipline differs by anchor type (BPHS needs recension specification; Varāhamihira citations don't carry the same urgency). (a) collapses the framework. (b) collapses it the other way. (d) is false.",
    disciplineMove: "Honour both anchors — recognise they serve different authority types, and avoid collapsing them.",
  },
  {
    id: "s4",
    title: "The astronomical-position dating methodology",
    prompt:
      "A learner asks: \"How can we be so confident Varāhamihira lived in the 6th century when most classical Indian texts can't be dated with that precision?\" What's the best brief explanation?",
    options: [
      {
        id: "a",
        label: "Pañcasiddhāntikā contains INTERNALLY-DATEABLE astronomical observations — recorded planetary positions, calendrical reckonings in the Śaka era. These can be back-calculated against modern accurate ephemerides; the match closes most tightly for ~575 CE. This is evidence-quality unmatched by most classical texts.",
      },
      {
        id: "b",
        label: "There are surviving inscriptions naming Varāhamihira at specific dates.",
      },
      {
        id: "c",
        label: "Traditional Indian chronology places him in the 6th century, and tradition is reliable.",
      },
      {
        id: "d",
        label: "Modern guess based on writing style.",
      },
    ],
    correctId: "a",
    rationale:
      "(a) is the methodology that anchors Varāhamihira. Pañcasiddhāntikā contains recorded planetary positions for specific Śaka-era dates. Modern ephemerides can back-calculate what actual positions occurred on those dates. The match closes tightly for ~575 CE. This is independent of tradition-attribution or later editorial framing. (b) is not the primary evidence (inscriptions naming Varāhamihira specifically are limited). (c) is the traditional view but not the academic methodology. (d) understates the rigour.",
    disciplineMove: "Internal astronomical-observation evidence is the gold standard for classical Indian text dating — Varāhamihira is the rare classical Jyotiṣa author whose texts carry it.",
  },
  {
    id: "s5",
    title: "Three-skandha breadth as evidence of single authorship",
    prompt:
      "A learner asks: \"How do we know all three of Varāhamihira's major texts (Bṛhat Jātaka, Bṛhat Saṁhitā, Pañcasiddhāntikā) are by the same author? Could they be later compilations?\" What's the right framing?",
    options: [
      {
        id: "a",
        label: "We don't know; it's just attributed to him by tradition.",
      },
      {
        id: "b",
        label: "Single authorship is supported by: (1) cross-references between the texts (e.g., Bṛhat Saṁhitā cites Bṛhat Jātaka), (2) consistent linguistic and stylistic markers across the three, (3) consistent doctrinal positions, (4) external citations from later authors treating them as a single corpus. The single-authorship attribution is well-supported.",
      },
      {
        id: "c",
        label: "Single authorship is impossible — no one author could write across three skandhas.",
      },
      {
        id: "d",
        label: "Only Pañcasiddhāntikā is reliably by Varāhamihira.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the academic-Indology framing. Single authorship for Varāhamihira's three primary texts is well-supported through multiple converging lines of evidence — cross-references, linguistic markers, doctrinal consistency, external citations. (a) understates the evidence. (c) is over-incredulity; Varāhamihira's breadth is unusual but not impossible. (d) is unsupported by the evidence base.",
    disciplineMove: "Multi-text single-authorship attribution rests on converging lines of evidence — cross-reference, linguistic, doctrinal, external citation.",
  },
];

export const FRAMEWORK_SUMMARY = {
  headline: "The chronology depends on Varāhamihira.",
  body: "Almost every other classical Jyotiṣa author is dated RELATIVE to Varāhamihira's secure 6th-century anchor — Kalyāṇavarmā (cites him), Mantreśvara (cites him plus Kalyāṇavarmā), Brahmagupta (adjacent cross-reference). Without Varāhamihira's astronomical-observation evidence, the relative chronology of classical Jyotiṣa would be substantially less clear. This is why the both-anchors framework treats him as evidence-authoritative — not because tradition lacks weight, but because the academic-Indology dating methodology needs an internal-evidence anchor, and Pañcasiddhāntikā uniquely provides one.",
};
