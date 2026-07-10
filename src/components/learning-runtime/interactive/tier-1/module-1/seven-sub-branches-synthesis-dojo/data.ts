/**
 * Seven Sub-Branches Synthesis Dojo — L3.2 §7 flagship data.
 *
 * Two views:
 *   1. STREAM × SUB-BRANCH MATRIX — 4 streams × 7 sub-branches clickable grid.
 *      Each cell shows the stream's emphasis level for that sub-branch.
 *   2. EVALUATIVE DRILL — 5 classification scenarios: given a text or
 *      situation, identify its correct (stream, sub-branch) coordinates.
 */

export interface MatrixCell {
  streamSlug: string;
  streamName: string;
  subBranchSlug: string;
  subBranchName: string;
  emphasis: "deep" | "distinctive-deep" | "moderate" | "light";
  note: string;
}

export interface DrillScenario {
  slug: string;
  question: string;
  context?: string;
  options: {
    id: string;
    label: string;
    stream: string;
    subBranch: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const STREAMS = [
  { slug: "parashari", name: "Parāśari", color: "#C8412E", colorDeep: "#7A2A14" },
  { slug: "jaimini", name: "Jaiminī", color: "#3A8C5A", colorDeep: "#2A6A40" },
  { slug: "kp", name: "KP", color: "#4F6FA8", colorDeep: "#2F4778" },
  { slug: "lal-kitab", name: "Lal Kitab", color: "#7A3E4A", colorDeep: "#5A2E3A" },
] as const;

export const SUBBRANCHES = [
  { slug: "jataka", name: "Jātaka", color: "#A23A1E", colorDeep: "#7A2A14" },
  { slug: "prashna", name: "Praśna", color: "#A23A1E", colorDeep: "#7A2A14" },
  { slug: "muhurta", name: "Muhūrta", color: "#A23A1E", colorDeep: "#7A2A14" },
  { slug: "nimitta", name: "Nimitta", color: "#3A8C5A", colorDeep: "#2A6A40" },
  { slug: "ayurveda-jyotisha", name: "Āyurveda-Jyotiṣa", color: "#7A5E1E", colorDeep: "#5A4514" },
  { slug: "vastu", name: "Vāstu", color: "#3A8C5A", colorDeep: "#2A6A40" },
  { slug: "samhita-detailed", name: "Saṁhitā-Detailed", color: "#3A8C5A", colorDeep: "#2A6A40" },
] as const;

export const MATRIX_CELLS: MatrixCell[] = [
  // Parāśari
  { streamSlug: "parashari", streamName: "Parāśari", subBranchSlug: "jataka", subBranchName: "Jātaka", emphasis: "deep", note: "Encyclopaedic horā corpus — BPHS + Bṛhat Jātaka + Saravali + Phaladīpikā + Jātaka Pārijāta" },
  { streamSlug: "parashari", streamName: "Parāśari", subBranchSlug: "prashna", subBranchName: "Praśna", emphasis: "moderate", note: "Classical Praśna Tantra + Praśna Mārga material" },
  { streamSlug: "parashari", streamName: "Parāśari", subBranchSlug: "muhurta", subBranchName: "Muhūrta", emphasis: "moderate", note: "Muhūrta-Cintāmaṇi, Yogayātrā, BPHS muhūrta material" },
  { streamSlug: "parashari", streamName: "Parāśari", subBranchSlug: "nimitta", subBranchName: "Nimitta", emphasis: "moderate", note: "Bṛhat Saṁhitā utpāta-darśana sections" },
  { streamSlug: "parashari", streamName: "Parāśari", subBranchSlug: "ayurveda-jyotisha", subBranchName: "Āyurveda-Jyotiṣa", emphasis: "moderate", note: "Bṛhat Saṁhitā disease chapters + classical Āyurveda integration" },
  { streamSlug: "parashari", streamName: "Parāśari", subBranchSlug: "vastu", subBranchName: "Vāstu", emphasis: "moderate", note: "Bṛhat Saṁhitā Vāstu chapters + Mayamatam + Mānasāra + Samarāṅgaṇa-Sūtradhāra" },
  { streamSlug: "parashari", streamName: "Parāśari", subBranchSlug: "samhita-detailed", subBranchName: "Saṁhitā-Detailed", emphasis: "deep", note: "Bṛhat Saṁhitā as comprehensive primary — 106 chapters" },
  // Jaiminī
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranchSlug: "jataka", subBranchName: "Jātaka", emphasis: "deep", note: "Distinctive horā-centric — cara-rāśi-daśās + ārūḍha + rāśi-aspects + cara-kārakas + Jaiminī yogas" },
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranchSlug: "prashna", subBranchName: "Praśna", emphasis: "moderate", note: "Classical praśna methodology" },
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranchSlug: "muhurta", subBranchName: "Muhūrta", emphasis: "light", note: "No distinctively-Jaiminī muhūrta material" },
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranchSlug: "nimitta", subBranchName: "Nimitta", emphasis: "light", note: "No distinctively-Jaiminī nimitta material" },
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranchSlug: "ayurveda-jyotisha", subBranchName: "Āyurveda-Jyotiṣa", emphasis: "light", note: "No distinctively-Jaiminī medical-astrology material" },
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranchSlug: "vastu", subBranchName: "Vāstu", emphasis: "light", note: "No distinctively-Jaiminī Vāstu material" },
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranchSlug: "samhita-detailed", subBranchName: "Saṁhitā-Detailed", emphasis: "light", note: "Uses standard classical saṁhitā material without distinctive contributions" },
  // KP
  { streamSlug: "kp", streamName: "KP", subBranchSlug: "jataka", subBranchName: "Jātaka", emphasis: "deep", note: "Distinctive horā-centric — sub-lord theory + CSL methodology + stellar centre" },
  { streamSlug: "kp", streamName: "KP", subBranchSlug: "prashna", subBranchName: "Praśna", emphasis: "distinctive-deep", note: "KP horary 1-249 system — uniquely KP modern primary, no classical antecedent" },
  { streamSlug: "kp", streamName: "KP", subBranchSlug: "muhurta", subBranchName: "Muhūrta", emphasis: "moderate", note: "KP muhūrta cross-references with KP techniques" },
  { streamSlug: "kp", streamName: "KP", subBranchSlug: "nimitta", subBranchName: "Nimitta", emphasis: "light", note: "No distinctively-KP nimitta material" },
  { streamSlug: "kp", streamName: "KP", subBranchSlug: "ayurveda-jyotisha", subBranchName: "Āyurveda-Jyotiṣa", emphasis: "light", note: "No distinctively-KP medical-astrology material" },
  { streamSlug: "kp", streamName: "KP", subBranchSlug: "vastu", subBranchName: "Vāstu", emphasis: "light", note: "No distinctively-KP Vāstu material" },
  { streamSlug: "kp", streamName: "KP", subBranchSlug: "samhita-detailed", subBranchName: "Saṁhitā-Detailed", emphasis: "light", note: "Uses standard classical saṁhitā material without distinctive contributions" },
  // Lal Kitab
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranchSlug: "jataka", subBranchName: "Jātaka", emphasis: "deep", note: "Distinctive horā-centric — fixed-house framework + 108 remedies + distinctive bhāva-significations" },
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranchSlug: "prashna", subBranchName: "Praśna", emphasis: "light", note: "No distinctively-Lal-Kitab praśna" },
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranchSlug: "muhurta", subBranchName: "Muhūrta", emphasis: "light", note: "No distinctively-Lal-Kitab muhūrta" },
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranchSlug: "nimitta", subBranchName: "Nimitta", emphasis: "moderate", note: "Includes some omen-reading material — partial overlap" },
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranchSlug: "ayurveda-jyotisha", subBranchName: "Āyurveda-Jyotiṣa", emphasis: "moderate", note: "Health-and-remedy material with Āyurveda-adjacent framing" },
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranchSlug: "vastu", subBranchName: "Vāstu", emphasis: "light", note: "No distinctively-Lal-Kitab Vāstu" },
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranchSlug: "samhita-detailed", subBranchName: "Saṁhitā-Detailed", emphasis: "light", note: "Some remedial overlap with classical saṁhitā gemology / perfumery / charity" },
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    slug: "drill-01",
    question: "A learner encounters a text titled *Muhūrta-Cintāmaṇi* by Rāma Daivajña. Into which (stream, sub-branch) coordinates should this text be classified?",
    options: [
      { id: "A", label: "Parāśari — Muhūrta", stream: "Parāśari", subBranch: "Muhūrta", isCorrect: true, explanation: "Correct. *Muhūrta-Cintāmaṇi* by Rāma Daivajña (~16th c. CE) is the standard Muhūrta primary — a comprehensive medieval Muhūrta synthesis widely cited in modern practice. It is Parāśari-tradition in stream (standard classical Muhūrta) and Muhūrta in sub-branch." },
      { id: "B", label: "Jaiminī — Muhūrta", stream: "Jaiminī", subBranch: "Muhūrta", isCorrect: false, explanation: "Incorrect. Jaiminī has no distinctively-Jaiminī muhūrta material. The *Muhūrta-Cintāmaṇi* is a standard classical text used across traditions, not specifically Jaiminī." },
      { id: "C", label: "Parāśari — Jātaka", stream: "Parāśari", subBranch: "Jātaka", isCorrect: false, explanation: "Incorrect. While Parāśari has deep Jātaka coverage, *Muhūrta-Cintāmaṇi* is explicitly an electional-astrology (Muhūrta) text, not a natal-astrology (Jātaka) text. The title itself signals Muhūrta." },
      { id: "D", label: "KP — Praśna", stream: "KP", subBranch: "Praśna", isCorrect: false, explanation: "Incorrect. KP's distinctive contribution is the 1-249 horary system (Praśna), not Muhūrta. *Muhūrta-Cintāmaṇi* predates KP by centuries and is unrelated to the KP stream." },
    ],
  },
  {
    slug: "drill-02",
    question: "A practitioner is asked to evaluate why a client's house feels ' energetically off' and to recommend corrective measures. Which sub-branch primarily applies?",
    options: [
      { id: "A", label: "Jātaka — because the client's birth chart reveals predispositions", stream: "N/A", subBranch: "Jātaka", isCorrect: false, explanation: "Incorrect. While Jātaka can reveal the client's general predispositions, the specific question about the house's energetic quality and corrective measures is not primarily Jātaka. Jātaka reads the person; Vāstu reads the space." },
      { id: "B", label: "Vāstu — because it covers architectural-astrological evaluation and remediation", stream: "N/A", subBranch: "Vāstu", isCorrect: true, explanation: "Correct. Vāstu is the architectural-astrology sub-branch that evaluates buildings, spaces, and sites for astrological-architectural problems (vāstu doṣas) and recommends corrective measures (vāstu remediation). The question maps directly to Vāstu operational scope." },
      { id: "C", label: "Nimitta — because an 'off feeling' is an omen", stream: "N/A", subBranch: "Nimitta", isCorrect: false, explanation: "Incorrect. While Nimitta covers omens and signs, the structured evaluation of a building's configuration with recommended remediation is specifically Vāstu, not Nimitta. Nimitta reads natural/bodily portents; Vāstu reads architectural spaces." },
      { id: "D", label: "Muhūrta — because the practitioner should pick an auspicious moment for remediation", stream: "N/A", subBranch: "Muhūrta", isCorrect: false, explanation: "Incorrect. Muhūrta would apply to *when* to perform the remediation (selecting an auspicious moment), but the primary sub-branch for *evaluating the house and recommending corrective measures* is Vāstu. Muhūrta is a cross-reference, not the primary sub-branch." },
    ],
  },
  {
    slug: "drill-03",
    question: "A learner asks: 'If the count \"seven\" is just modern convention, does that mean Āyurveda-Jyotiṣa is not a real sub-branch?' What is the honest answer?",
    options: [
      { id: "A", label: "Āyurveda-Jyotiṣa is real — the count is convention, but the sub-branches themselves are substantive", stream: "N/A", subBranch: "Āyurveda-Jyotiṣa", isCorrect: true, explanation: "Correct. The honest framing (§4.9) distinguishes what is real-and-substantive (the sub-branches themselves, including Āyurveda-Jyotiṣa, which has distinctive operational scope, foundational texts, and curriculum modules) from what is convention (the count 'seven' and the exact enumeration). Āyurveda-Jyotiṣa is a real cross-cutting sub-branch; only the count is pedagogical convention." },
      { id: "B", label: "Āyurveda-Jyotiṣa is less real than Jātaka because it is not in all classical enumerations", stream: "N/A", subBranch: "Āyurveda-Jyotiṣa", isCorrect: false, explanation: "Incorrect. The absence of Āyurveda-Jyotiṣa from some classical enumerations (e.g., six-sub-branch counts) reflects different pedagogical grouping choices, not the non-reality of the sub-branch. Āyurveda-Jyotiṣa has real operational scope, real foundational texts (Bṛhat Saṁhitā disease chapters + Āyurveda corpus), and real curriculum modules." },
      { id: "C", label: "Āyurveda-Jyotiṣa should be treated as part of Jātaka because it uses natal charts", stream: "N/A", subBranch: "Āyurveda-Jyotiṣa", isCorrect: false, explanation: "Incorrect. While Āyurveda-Jyotiṣa does use natal-chart analysis (horā side), it is cross-cutting because it also integrates saṁhitā-side material (omens, event-timing) and explicitly integrates with the parallel Āyurveda corpus. Treating it as purely Jātaka would miss the saṁhitā-cross-cutting and Āyurveda-integration that make it distinctive." },
      { id: "D", label: "Āyurveda-Jyotiṣa is curriculum-imposed and has no classical foundation", stream: "N/A", subBranch: "Āyurveda-Jyotiṣa", isCorrect: false, explanation: "Incorrect. Bṛhat Saṁhitā includes disease-prediction chapters that are classical Jyotiṣa-internal medical-astrology material. The integration with Caraka Saṁhitā and Suśruta Saṁhitā is a classical cross-śāstra engagement, not a curriculum invention. The sub-branch has classical foundation; the *count* 'seven' is convention." },
    ],
  },
  {
    slug: "drill-04",
    question: "A practitioner uses the KP 1-249 number-based system to answer a client's urgent question. Which (stream, sub-branch) coordinates describe this practice?",
    options: [
      { id: "A", label: "KP — Praśna", stream: "KP", subBranch: "Praśna", isCorrect: true, explanation: "Correct. The KP 1-249 number-based system is K.S. Krishnamurti's distinctive modern-primary contribution to Praśna (horary astrology). It is uniquely KP — no classical antecedent — and is the centre-of-gravity of KP's distinctive Praśna emphasis per the §4.10 streams × sub-branches matrix." },
      { id: "B", label: "Parāśari — Praśna", stream: "Parāśari", subBranch: "Praśna", isCorrect: false, explanation: "Incorrect. While Parāśari has moderate Praśna coverage (Praśna Tantra, Praśna Mārga), the 1-249 system is specifically KP, not Parāśari. Parāśari's Praśna material is classical; KP's is modern-primary and distinctive." },
      { id: "C", label: "KP — Jātaka", stream: "KP", subBranch: "Jātaka", isCorrect: false, explanation: "Incorrect. While KP has deep Jātaka emphasis (sub-lord theory applied to natal charts), the 1-249 system is specifically a *horary* methodology — it answers questions from the question-moment, not from the birth-chart. This is Praśna, not Jātaka." },
      { id: "D", label: "Lal Kitab — Praśna", stream: "Lal Kitab", subBranch: "Praśna", isCorrect: false, explanation: "Incorrect. Lal Kitab has light Praśna emphasis — no distinctively-Lal-Kitab praśna methodology. The 1-249 system is explicitly and uniquely KP." },
    ],
  },
  {
    slug: "drill-05",
    question: "Which of the following is the most accurate statement about Bṛhat Saṁhitā's relationship to the seven sub-branches?",
    options: [
      { id: "A", label: "Bṛhat Saṁhitā is the primary for exactly one sub-branch: Saṁhitā-Detailed", stream: "Parāśari", subBranch: "Saṁhitā-Detailed", isCorrect: false, explanation: "Incorrect. While Bṛhat Saṁhitā IS the primary for Saṁhitā-Detailed, it also serves as primary for Nimitta (utpāta-darśana sections) and provides foundational material for Vāstu (Vāstu chapters) and Āyurveda-Jyotiṣa (disease chapters). The relationship is one-to-many, not one-to-one." },
      { id: "B", label: "Bṛhat Saṁhitā is primary across multiple saṁhitā sub-branches — Nimitta, Vāstu, and Saṁhitā-Detailed — illustrating one-text-to-many-sub-branches mapping", stream: "Parāśari", subBranch: "Saṁhitā-Detailed", isCorrect: true, explanation: "Correct. Bṛhat Saṁhitā's 106 chapters span utpāta-darśana (Nimitta), Vāstu chapters (Vāstu), disease chapters (Āyurveda-Jyotiṣa), and the full encyclopaedic breadth (Saṁhitā-Detailed). This one-text-to-many-sub-branches mapping is normal operational reality — classical texts often cover multiple sub-branches, particularly within the saṁhitā skandha." },
      { id: "C", label: "Bṛhat Saṁhitā is a Jātaka text that happens to cover some saṁhitā topics", stream: "Parāśari", subBranch: "Jātaka", isCorrect: false, explanation: "Incorrect. Bṛhat Saṁhitā is explicitly a saṁhitā-skandha text, not a horā/Jātaka text. Varāhamihira's Jātaka text is *Bṛhat Jātaka*, a separate work. The two titles share the 'Bṛhat' prefix and author but are distinct skandha texts." },
      { id: "D", label: "Bṛhat Saṁhitā is equally primary for all seven sub-branches", stream: "Parāśari", subBranch: "Saṁhitā-Detailed", isCorrect: false, explanation: "Incorrect. Bṛhat Saṁhitā does not cover Jātaka, Praśna, or Muhūrta substantively. Those sub-branches have their own distinct primaries (BPHS/Bṛhat Jātaka for Jātaka; Praśna Tantra/Mārga for Praśna; Muhūrta-Cintāmaṇi for Muhūrta). Bṛhat Saṁhitā's coverage is concentrated in the saṁhitā skandha sub-branches." },
    ],
  },
];
