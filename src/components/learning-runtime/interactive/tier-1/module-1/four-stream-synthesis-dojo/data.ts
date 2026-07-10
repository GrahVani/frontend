/**
 * Four-Stream Synthesis Dojo — static data for L2.6 §7 flagship.
 *
 * Two-tab synthesis:
 *  Tab 1 — Stream Landscape Matrix: 4 columns side-by-side, click to expand
 *          each stream's foundational text / era / contributions / citation
 *          discipline. Filterable by classification (classical vs modern-primary).
 *
 *  Tab 2 — Evaluative Reasoning Drill: 5 scenarios testing the three problematic
 *          claims (§4.5) + cross-stream-evaluation + modern-primary vs modern-
 *          revival distinction.
 */

export interface EvaluativeScenario {
  id: string;
  title: string;
  setup: string;
  claim: string;
  options: Array<{
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }>;
  synthesis: string;
}

export const EVALUATIVE_SCENARIOS: EvaluativeScenario[] = [
  {
    id: "scenario-merely-innovations",
    title: "The \"merely innovations\" claim",
    setup:
      "A traditional Vedic-astrology purist tells you: \"KP and Lal Kitab are merely innovations on classical Vedic-astrology material — they should be evaluated as 'modern derivatives' rather than 'real classical equivalents'. The truly authoritative sources are the classical Sanskrit texts.\"",
    claim: "How should you evaluate this claim using the framework this lesson installs?",
    options: [
      {
        id: "a",
        label:
          "Accept it — KP and Lal Kitab are recent (20th c.); classical Sanskrit texts have temporal-authority priority",
        isCorrect: false,
        feedback:
          "Misapplies the modern-primary doctrine. Temporal-origination is NOT the operative authority criterion — within-stream-foundational-status is. KP's sub-lord theory is nowhere derivable from BPHS / Bṛhat Jātaka / Saravali / Phaladīpikā; Lal Kitab's 108-remedies system is nowhere derivable from classical śānti material. Both ORIGINATE frameworks NOT derivable from earlier classical sources. \"Merely innovations\" is factually inaccurate.",
      },
      {
        id: "b",
        label:
          "Reject it across all three component-claims — empirical, framework-application, and doctrinal",
        isCorrect: true,
        feedback:
          "Correct. The claim fails on all three: (1) EMPIRICAL — KP and Lal Kitab originate frameworks NOT derivable from classical sources, so \"merely innovations\" is factually inaccurate; (2) FRAMEWORK-APPLICATION — both meet all three modern-primary criteria (origination + practitioner lineage + empirical results), so \"modern derivatives, not real equivalents\" misapplies the doctrine; (3) DOCTRINAL — \"classical-Sanskrit = authority criterion\" over-extends a within-stream criterion (Parāśari/Jaiminī foundational language) across-stream, violating multi-stream-honesty.",
      },
      {
        id: "c",
        label:
          "Accept the empirical claim but reject the framework-application claim",
        isCorrect: false,
        feedback:
          "Partially-correct rejection but missing the empirical refutation. The empirical claim (\"merely innovations\") IS itself factually inaccurate — KP and Lal Kitab originate frameworks NOT derivable from classical sources. All three component-claims fail, not just the framework-application claim.",
      },
    ],
    synthesis:
      "Framework-evaluative reasoning decomposes a claim into its component-claims and tests each. The classical-purist claim has three nested components: empirical (are KP/LK derivable from classical?), framework-application (do they meet modern-primary criteria?), and doctrinal (is Sanskrit-classical the authority criterion?). Each fails distinctly. The four-stream landscape framework gives you operational tools for this decomposition.",
  },
  {
    id: "scenario-competing-schools",
    title: "The \"competing schools\" claim",
    setup:
      "A learner exposed to single-stream practitioner training says: \"The four streams must be competing schools — they have different foundational texts, different analytical units, even different house-systems (whole-sign for Parāśari/Jaiminī, Placidus for KP, fixed for Lal Kitab). The practitioner has to pick ONE as true and reject the others as false or inferior.\"",
    claim: "How does the multi-stream-honesty framework respond to this?",
    options: [
      {
        id: "a",
        label:
          "Agree — different house-systems and analytical units mean the streams must be incompatible",
        isCorrect: false,
        feedback:
          "Imports a competing-schools framing from elsewhere (Western religious denominationalism, scientific paradigm-disputes). The Vedic-astrology multi-stream landscape doesn't operate this way. Each stream operates at a DIFFERENT doctrinal-layer — Parāśari rāśi-and-bhāva, Jaiminī rāśi-aspect-and-cara-derivative, KP nakṣatra-and-sub-lord, Lal Kitab fixed-house-and-remedy. Different house-systems are FUNCTIONAL CHOICES WITHIN their own doctrinal frameworks, not mutually-exclusive claims about reality.",
      },
      {
        id: "b",
        label:
          "The four streams are COMPLEMENTARY (different doctrinal-layers + different analytical units), not competing — serious practice may use one as primary or draw from multiple",
        isCorrect: true,
        feedback:
          "Correct. Per Constitution §3.4 multi-stream-honesty + §4.4 of this lesson: the four streams operate at DIFFERENT doctrinal-layers and emphasise DIFFERENT analytical units. A serious practitioner can apply multiple frameworks to the same chart and read them as complementary information-layers. Different practitioner lineages have different stream-emphasis (KP-primary, Lal-Kitab-primary, Rath-lineage Parāśari+Jaiminī both-and, etc.) — no stream-choice is doctrinally invalid; each operates within its framework.",
      },
      {
        id: "c",
        label:
          "Different house-systems mean the streams are equally valid — pick whichever feels right",
        isCorrect: false,
        feedback:
          "Right that the streams are valid; wrong that the operative discipline is \"pick whichever feels right.\" The discipline is CITATION-DISCIPLINE: flag which stream you're operating in, engage within-stream operationally, evaluate cross-stream only with within-stream fluency. \"Pick whichever feels right\" without flag is the stream-mixing-without-attribution that Constitution §3.4 + §4.4 point 4 prevent.",
      },
    ],
    synthesis:
      "The competing-schools framing is a CATEGORY-ERROR — it imports a denominational/paradigm-dispute mental model that doesn't fit the Vedic-astrology multi-stream landscape. The streams complement at different doctrinal-layers. Serious practice draws from one-primary-or-multiple with explicit citation discipline. Different house-systems are intra-framework choices, not inter-framework claims about reality.",
  },
  {
    id: "scenario-classical-sanskrit-criterion",
    title: "The \"classical Sanskrit = authority\" criterion claim",
    setup:
      "An academic-Indology scholar argues: \"Real Jyotiṣa authority requires classical Sanskrit foundational texts. KP (English/Tamil 20th-c.) and Lal Kitab (Urdu 20th-c.) lack this — they're outside the genuine classical tradition.\"",
    claim: "How does the four-stream-landscape framework evaluate this scholarly criterion?",
    options: [
      {
        id: "a",
        label:
          "The scholar is right — without classical Sanskrit, KP and Lal Kitab can't be authoritative classical-equivalents",
        isCorrect: false,
        feedback:
          "OVER-EXTENDS a within-stream criterion (Parāśari/Jaiminī foundational language) across-stream. Classical Sanskrit foundational status applies to Parāśari and Jaiminī (their foundational texts ARE in classical Sanskrit). The operative authority criterion across streams is WITHIN-STREAM-FOUNDATIONAL-STATUS, not BEING-CLASSICAL-SANSKRIT. KP has within-stream-foundational-status (K.S. Krishnamurti's primary corpus); Lal Kitab has within-stream-foundational-status (Joshi's Urdu primary corpus). The Sanskrit-classical criterion would EXCLUDE them on a basis (language and era) that's not the operative criterion.",
      },
      {
        id: "b",
        label:
          "Within-stream-foundational-status is the operative criterion — KP's English/Tamil corpus and Lal Kitab's Urdu corpus are first-party authoritative within their streams without requiring classical Sanskrit form",
        isCorrect: true,
        feedback:
          "Correct. Per Constitution §3.4 + §4.4 of this lesson + §4.5 evaluation step 3: the operative authority criterion is WITHIN-STREAM-FOUNDATIONAL-STATUS, not BEING-CLASSICAL-SANSKRIT. Classical Sanskrit form applies to Parāśari + Jaiminī within-stream criterion. Modern-primary streams have first-party-authoritative within-stream-foundational-status WITHOUT the classical-Sanskrit form. \"Must be classical Sanskrit\" across-stream is a multi-stream-honesty violation.",
      },
      {
        id: "c",
        label:
          "The scholar is right for KP (modern English) but wrong for Lal Kitab (Urdu is closer to Sanskrit-tradition)",
        isCorrect: false,
        feedback:
          "Doesn't help — the same within-stream-vs-across-stream criterion error applies. Whether the language is English or Urdu or Tamil, the across-stream criterion is within-stream-foundational-status, NOT proximity-to-classical-Sanskrit. Stratifying by language-proximity-to-Sanskrit imposes a Sanskrit-centric grading that's the very category-error multi-stream-honesty prevents.",
      },
    ],
    synthesis:
      "Within-stream criteria don't transfer across streams. \"Classical Sanskrit foundational form\" is Parāśari's and Jaiminī's within-stream-foundational-language; it is NOT the across-stream-authority-criterion. The across-stream criterion is within-stream-foundational-status. KP (English/Tamil) and Lal Kitab (Urdu) have first-party-authoritative within-stream-foundational-status without the classical-Sanskrit form — multi-stream-honesty operating at its most consequential.",
  },
  {
    id: "scenario-cross-stream-critique",
    title: "Cross-stream critique without within-stream fluency",
    setup:
      "A Parāśari-trained learner — having read BPHS and Bṛhat Jātaka extensively — encounters a KP analysis using Placidus house cusps. She says: \"KP is methodologically suspect — it uses Placidus house cusps, which is a non-classical-Vedic methodology. Classical Vedic uses whole-sign houses. Therefore the KP analysis can't be relied upon.\"",
    claim: "Is this a valid cross-stream evaluation?",
    options: [
      {
        id: "a",
        label:
          "Yes — Placidus is non-classical, so KP analyses are suspect",
        isCorrect: false,
        feedback:
          "Multi-stream-honesty violation. The learner is applying Parāśari's INTERNAL criterion (whole-sign houses) to CRITIQUE another stream (KP). Within KP doctrine, Placidus is OPERATIONALLY FUNCTIONAL — the CSL methodology uses Placidus cusps as DETERMINANTS, not as classical-Vedic-style houses. Critiquing KP for \"using Placidus\" is like critiquing chess for not having checkers' jump-capture rule.",
      },
      {
        id: "b",
        label:
          "No — cross-stream evaluation requires within-stream fluency in the stream being evaluated; critiquing KP using Parāśari's internal criteria misapplies criteria across streams",
        isCorrect: true,
        feedback:
          "Correct. Per Constitution §3.4 multi-stream-honesty + §4.4 + §6 Recognition 2 of this lesson: cross-stream evaluation REQUIRES within-stream fluency in the stream being evaluated. Each stream's operational choices (Placidus cusps in KP; cara-kāraka degrees in Jaiminī; fixed-house framework in Lal Kitab) are internally functional within their own stream's framework. The Parāśari-trained learner has two valid options: (1) stay within Parāśari and perform Parāśari 11th-house analysis independently as cross-stream cross-check, OR (2) engage KP doctrine by learning enough KP fluency to evaluate the CSL analysis on its own terms.",
      },
      {
        id: "c",
        label:
          "Partial — Placidus IS the issue, but the learner should learn KP first before criticising",
        isCorrect: false,
        feedback:
          "Closer to correct but still off. Placidus is NOT \"the issue\" — within KP doctrine, Placidus is the operationally-functional house-system, not a methodological defect. After learning KP fluency, the learner wouldn't criticise Placidus AT ALL — she'd evaluate KP analyses on KP's own operational terms. The within-stream-fluency requirement isn't a hurdle before critique; it reveals that the original critique was itself a category-error.",
      },
    ],
    synthesis:
      "Within-stream criteria are NOT cross-stream weapons. A criterion that's functional within Stream A's framework (whole-sign houses in Parāśari) cannot be exported to Stream B's framework (Placidus cusps in KP) to mark Stream B as defective. Cross-stream evaluation requires within-stream fluency in the stream being evaluated — once you achieve that fluency, you evaluate Stream B's methodology on Stream B's own operational terms, not Stream A's.",
  },
  {
    id: "scenario-primary-vs-revival",
    title: "Modern-primary vs modern-revival distinction",
    setup:
      "A student writes in an essay: \"Sanjay Rath is a modern-primary in the Jaiminī tradition — his teaching corpus and SJC course materials established the modern Jaiminī framework, including cara/sthira-rāśi-daśās, ārūḍha lagna, and cara kārakas. He should be cited alongside K.S. Krishnamurti and Pandit Roop Chand Joshi as one of the three major modern primaries in 20th-c. Vedic-astrology.\"",
    claim: "Is this classification correct?",
    options: [
      {
        id: "a",
        label:
          "Yes — Rath's teaching corpus established the modern Jaiminī framework",
        isCorrect: false,
        feedback:
          "MISCLASSIFIES Rath as modern-primary when he is a modern-REVIVER. The Jaiminī doctrines Rath teaches (cara/sthira-rāśi-daśās, ārūḍha lagna, rāśi-aspects, cara kārakas, Jaiminī yogas) are CLASSICALLY FOUNDED in the Jaiminī Sūtra and medieval Jaiminī commentary tradition (Nīlakaṇṭha, Somanātha). Rath's contribution is MAKING THE CLASSICAL MATERIAL OPERATIONALLY ACCESSIBLE through translation, commentary, and teaching — not ORIGINATING new doctrinal frameworks.",
      },
      {
        id: "b",
        label:
          "No — Rath is a modern-REVIVER (Jaiminī doctrines are classically founded; Rath's contribution is operational accessibility), NOT a modern-primary (no original framework origination)",
        isCorrect: true,
        feedback:
          "Correct. Per §4.1 of this lesson: modern-revival = recovers existing classical tradition into mainstream operational practice (the doctrinal frameworks are classically founded; the reviver's contribution is operational accessibility). Modern-primary = ORIGINATES a foundational doctrinal framework not derivable from earlier classical sources. Rath's Jaiminī doctrines are classically founded in the Jaiminī Sūtra — he revives, not originates. The two unambiguous modern primaries in 20th-c. Vedic-astrology remain KP and Lal Kitab.",
      },
      {
        id: "c",
        label:
          "Partial — Rath is BOTH a reviver (for Jaiminī Sūtra material) AND a primary (for his own SJC pedagogical extensions)",
        isCorrect: false,
        feedback:
          "Conflates pedagogical-extension with framework-origination. Rath's SJC pedagogical extensions are TEACHING SYNTHESIS of classical Jaiminī material — they don't meet the modern-primary criterion of ORIGINATING DOCTRINAL FRAMEWORKS NOT DERIVABLE FROM CLASSICAL SOURCES. Pedagogical-extension within an existing tradition's framework is part of modern-revival, not separate modern-primary status. The bar for modern-primary status (original framework origination + active practitioner lineage + empirical results) is HIGH; teaching extension alone does not qualify.",
      },
    ],
    synthesis:
      "The modern-primary vs modern-revival distinction is OPERATIONALLY LOAD-BEARING. Mis-categorising a reviver as a primary inflates the modern-primary count beyond the two unambiguous cases (KP, Lal Kitab) and misapplies the citation discipline (classical citation should still trace to the classical antecedent + reviver's commentary, not be replaced by reviver-as-primary-corpus). The bar for modern-primary is HIGH: ORIGINATION, not pedagogical-extension; classical-not-derivable, not classical-with-modern-teaching-overlay.",
  },
];

/** Cross-stream doctrinal-treatment matrix — for Tab 1's "topic deep-dive" panel. */
export interface CrossStreamTopicTreatment {
  topic: string;
  parashari: string;
  jaimini: string;
  kp: string;
  lalKitab: string;
}

export const CROSS_STREAM_TOPICS: CrossStreamTopicTreatment[] = [
  {
    topic: "7th house / marriage doctrine",
    parashari:
      "Read 7th-house grahas + 7th-lord placement + 7th-aspects + dasha activations relevant to 7th. BPHS Adhyāya 12 + medieval codifier elaboration.",
    jaimini:
      "Read 7th house via rāśi-aspect logic + Dārā-kāraka (the 7th cara-kāraka, by descending degree-rank among grahas) for spouse-significator.",
    kp:
      "Read the Cuspal Sub-Lord (CSL) of the 7th house Placidus cusp. CSL signification + 7th-house RP-set + sub-lord direction-of-event.",
    lalKitab:
      "Read 7th house as fixed-Libra (always) + Lal-Kitab-specific 7th-bhāva significations + remedy-prescription if 7th-house planets are andha.",
  },
  {
    topic: "Time-cycle / event-timing",
    parashari:
      "Vimśottarī mahādaśā / antardaśā / pratyantardaśā — nakṣatra-lord-based 120-year cycle from Moon's nakṣatra. Aṣṭottarī, Yoginī as conditional alternates.",
    jaimini:
      "Cara Rāśi Daśā + Sthira Rāśi Daśā (conditional) — rāśi-based cycles from rāśi-positions and movability classification. Different time-engine entirely.",
    kp:
      "Vimśottarī (shared with Parāśari) + Ruling Planets at moment-of-query + sub-lord transit alignment. Event-timing via RP-set + sub-period sub-lord direction.",
    lalKitab:
      "Time-cycle is intertwined with the fixed-house framework + remedy-application schedule. Less time-cycle-centric than the other streams; emphasis on remedy-timing.",
  },
  {
    topic: "Significators (who/what does this graha represent?)",
    parashari:
      "Naisargika kārakas (fixed) — Sun=soul/father, Moon=mother, Mars=brother, etc. Same significators for every chart.",
    jaimini:
      "Cara kārakas (variable) — graha with highest degrees = Ātma-kāraka, next = Amātya-kāraka, etc. Re-computed per chart by degree-rank.",
    kp:
      "Significators determined via STAR-LORD (the graha whose nakṣatra the position falls in) + SUB-LORD (the graha whose sub-division the position falls in). Star tells WHERE; sub tells WHETHER.",
    lalKitab:
      "Significators interact with the fixed-house framework — each fixed-house has Lal-Kitab-specific significations, planets-in-house operate per Lal Kitab's distinctive bhāva logic.",
  },
  {
    topic: "Remedial framework (when chart shows adverse pattern, what's done?)",
    parashari:
      "Classical śānti — mantras (Vedic + planetary mantras), yantras (geometric inscriptions), gemstones (planetary stones in specific metals at auspicious muhūrta), elaborate ritual (pūjā, homa).",
    jaimini:
      "Largely overlaps with Parāśari śānti corpus; Jaiminī-specific remedies follow the rāśi-aspect-and-cara-kāraka analysis but don't form a distinctive remedy-system.",
    kp:
      "KP doesn't centre a distinctive remedy-system. Practitioners typically cross-reference classical Parāśari remedies + Lal Kitab remedies when remedial action is indicated by KP analysis.",
    lalKitab:
      "108 remedies system — UNIQUELY accessible-and-practical (donations, behavioural modifications, simple ritual acts, relationship modifications). \"Remedies a poor person can perform with no priest required.\"",
  },
];

export const FRAMEWORK_SUMMARY = {
  headline:
    "Four streams completing the classical landscape — Chapter 2 closes here.",
  body:
    "Across Chapter 2 we tracked: pre-classical foundational ṛṣis (Parāśara, Jaiminī) + classical date-anchor codifier (Varāhamihira) + medieval codifiers (Kalyāṇavarmā, Mantreśvara, Vaidyanātha, Nīlakaṇṭha) + modern primaries (Krishnamurti, Joshi). The historical-figures landscape is now traceable end-to-end. Chapter 3 shifts focus from WHO the major figures were to WHAT they wrote about — the three skandhas (gaṇita / horā / saṁhitā) and the seven sub-branches that organise the curriculum's topical scope.",
};
