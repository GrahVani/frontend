/**
 * Medieval Synthesis Dojo — L2.4 §7 flagship data.
 *
 * Five drill scenarios on medieval-codifier dating + citation discipline.
 */

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
    title: "Dating Mantreśvara to \"approximately 13th century CE\"",
    prompt:
      "A modern source dates Mantreśvara to \"approximately 13th century CE\" with no further justification. What's the most accurate explanation of how that date was arrived at?",
    options: [
      {
        id: "a",
        label: "Through manuscript carbon-dating of Phaladīpikā fragments.",
      },
      {
        id: "b",
        label: "Through citation-network bracketing: Mantreśvara CITES Varāhamihira AND Kalyāṇavarmā (so post-9th c. CE earliest) and is CITED BY 15th-c. authors (so pre-15th c. CE). The bracketed range is ~12th-15th c. CE, with 13th-14th c. as the central estimate. The ~±300 yr bracket reflects compounded uncertainty across the citation chain.",
      },
      {
        id: "c",
        label: "Through Mantreśvara's own statements about his date in Phaladīpikā.",
      },
      {
        id: "d",
        label: "Through traditional Indian chronology placing him in a specific era.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the right methodology. Mantreśvara has no internal dating evidence; his date is established through citation-network bracketing. The chain is longer than Kalyāṇavarmā's (Mantreśvara is post-Kalyāṇavarmā whose own date is ±100 yr), so the uncertainty compounds to ~±300 yr. (a) is not how Sanskrit manuscript dating typically works. (c) is false — Mantreśvara doesn't self-date. (d) is the traditional view but not the academic methodology.",
    disciplineMove: "Compounding uncertainty — the longer the citation chain, the wider the bracket.",
  },
  {
    id: "s2",
    title: "Citing Saravali's Pañcamahāpuruṣa Yoga",
    prompt:
      "A teacher cites: \"Per Saravali, the Pañcamahāpuruṣa Yoga has the following five conditions...\" — and gives the conditions accurately. What's the assessment?",
    options: [
      {
        id: "a",
        label: "Saravali is recension-stable; the citation is honest as long as the Santhanam (1983) edition or equivalent is implied. Adding \"per Santhanam 1983 edition\" makes it explicit-rigorous.",
      },
      {
        id: "b",
        label: "Saravali requires the same recension-specification as BPHS — naming \"Saravali\" alone is insufficient.",
      },
      {
        id: "c",
        label: "Pañcamahāpuruṣa Yoga is from BPHS, not Saravali.",
      },
      {
        id: "d",
        label: "Saravali doesn't discuss yogas.",
      },
    ],
    correctId: "a",
    rationale:
      "(a) is the right framing. Saravali's recension situation is good — major editions agree on chapter structure with manageable verse-count variation. Citing \"per Saravali\" is reasonably honest; adding the translator-edition makes it rigorous. The recension-specification urgency for medieval codifier texts is lower than for BPHS. (b) overstates the recension burden. (c) is false — Pañcamahāpuruṣa appears across BPHS, Bṛhat Jātaka, AND Saravali (Saravali extends the catalogue). (d) is false — yogas are Saravali's distinctive emphasis.",
    disciplineMove: "Recension-specification urgency varies by author — medieval codifier texts are more stable than BPHS.",
  },
  {
    id: "s3",
    title: "\"Why study Phaladīpikā at all?\"",
    prompt:
      "A learner asks: \"If Mantreśvara just synthesises BPHS + Bṛhat Jātaka + Saravali into Phaladīpikā, why study Phaladīpikā at all? Why not just read the originals?\" What's the right framing?",
    options: [
      {
        id: "a",
        label: "The learner is right — there's no reason to study Phaladīpikā if the originals are available.",
      },
      {
        id: "b",
        label: "Phaladīpikā is distinctively VALUABLE for its CODIFIER-ROLE contribution: practitioner-oriented selection, compact pedagogy, systematic bhāva-results delineation. The originals are encyclopaedic-reference texts; Phaladīpikā is teachable in a way they aren't. Different texts for different purposes.",
      },
      {
        id: "c",
        label: "Phaladīpikā is the only one of these texts that's actually authoritative.",
      },
      {
        id: "d",
        label: "Mantreśvara originated new doctrinal content — Phaladīpikā isn't just synthesis.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the right framing. The codifier role IS distinctive even when not originating new doctrine. Phaladīpikā's selection-and-pedagogical-structure is a real contribution — modern practitioners learning natal chart-reading have historically used Phaladīpikā precisely because its compact-practitioner-orientation works better as a teaching text than the encyclopaedic alternatives. (a) collapses the codifier contribution. (c) is wrong (all are authoritative). (d) over-claims Mantreśvara's originality.",
    disciplineMove: "Codifier authority is real — refining + synthesising + pedagogical structuring add value distinct from originating.",
  },
  {
    id: "s4",
    title: "Comparing Vaidyanātha and Mantreśvara dating brackets",
    prompt:
      "A learner notices: Mantreśvara's bracket is ±300 years, but Vaidyanātha's is ±50 years — even though Vaidyanātha is FURTHER down the citation chain. Why is Vaidyanātha's bracket TIGHTER?",
    options: [
      {
        id: "a",
        label: "Vaidyanātha has astronomical-observation evidence like Varāhamihira.",
      },
      {
        id: "b",
        label: "The CEILING matters as much as the FLOOR. Mantreśvara's tightest known citing source is 15th-c. (giving a 12th-15th-c. range = ~±300 yr around the centre). Vaidyanātha is cited by 17th-c. sources very close to his own date (giving a 16th-c. ± 50 yr). A tight ceiling can compensate for a long floor-chain.",
      },
      {
        id: "c",
        label: "Vaidyanātha is older than Mantreśvara — that's why his date is more secure.",
      },
      {
        id: "d",
        label: "All medieval codifier datings are equally uncertain; the brackets reported are arbitrary.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the right framing. Citation-network dating has TWO bounds — floor (whom you cite) and ceiling (who cites you). Mantreśvara has a long floor-chain (post-multiple-codifiers) AND a moderate ceiling (15th c.) → wide bracket. Vaidyanātha has a longer floor-chain BUT a very tight ceiling (17th-c. authors who clearly knew his text) → tighter overall bracket. (a) is false. (c) is reversed (Vaidyanātha is LATER, not older). (d) is over-dismissive.",
    disciplineMove: "Both bounds matter — citation-network dating uses floor AND ceiling; a tight ceiling can compensate for a long floor-chain.",
  },
  {
    id: "s5",
    title: "Three-layer lineage citation",
    prompt:
      "A modern teacher writes: \"The Parāśari tradition stretches from Maharṣi Parāśara through Varāhamihira through Kalyāṇavarmā to Mantreśvara — all teaching the same doctrine.\" What's the assessment?",
    options: [
      {
        id: "a",
        label: "Inaccurate — these authors disagree about most doctrines.",
      },
      {
        id: "b",
        label: "Substantially right but flattens the layers. The three-layer structure — foundational ṛṣi-core (Parāśara/BPHS) + systematic codifier date-anchor (Varāhamihira) + medieval codifiers (Kalyāṇavarmā, Mantreśvara, etc.) — is real and cumulative. The doctrine IS broadly consistent but each layer contributes distinctively. Honour the layering, don't flatten it.",
      },
      {
        id: "c",
        label: "Inaccurate — Mantreśvara isn't in the Parāśari tradition.",
      },
      {
        id: "d",
        label: "Accurate — all classical Jyotiṣa is undifferentiated tradition.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the most accurate framing. Yes, the Parāśari-tradition lineage is real and the doctrine IS broadly consistent across these authors. BUT the three-layer structure (foundational ṛṣi → systematic codifier → medieval codifiers) carries different authority types. Flattening these into \"all teaching the same doctrine\" loses the citation-discipline structure that matters for scholarly practice. (a) overstates the disagreement. (c) is false. (d) is the flat-tradition view the lesson explicitly disarms.",
    disciplineMove: "Honour the three-layer lineage structure — don't flatten into undifferentiated tradition.",
  },
];

export const FRAMEWORK_SUMMARY = {
  headline: "Three layers, cumulative authorities, distinct citation discipline.",
  body: "The medieval codifiers (Layer 3) refine and synthesise the Parāśara + Varāhamihira foundation (Layers 1-2), each contributing distinctive emphasis. Their dating is bracketed by citation-network analysis, with uncertainty compounding along the chain. Citation discipline for medieval-codifier texts is less recension-burdened than for BPHS (because their recension situation is more stable), but more chain-length-aware (the dating brackets widen the further you are from the Varāhamihira anchor). Honour all three layers, never collapse them into undifferentiated tradition.",
};
