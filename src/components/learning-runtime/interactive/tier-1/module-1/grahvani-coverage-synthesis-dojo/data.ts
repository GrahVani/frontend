/**
 * Grahvani Coverage Synthesis Dojo — L3.3 §7 flagship data.
 *
 * Two views:
 *   1. FULL COVERAGE MATRIX — all 4 streams × 7 sub-branches grid with depth colours.
 *   2. EVALUATIVE DRILL — 3 scenarios from §4.6 + 2 cross-reference protocol scenarios.
 */

export interface MatrixCell {
  streamSlug: string;
  streamName: string;
  subBranch: string;
  depth: "deep" | "moderate" | "light" | "cross-ref" | "na";
  note: string;
}

export interface DrillScenario {
  slug: string;
  question: string;
  context?: string;
  options: {
    id: string;
    label: string;
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
  "Jātaka", "Praśna", "Muhūrta", "Nimitta", "Āyurveda-Jyotiṣa", "Vāstu", "Saṁhitā-Detailed",
] as const;

function d(depth: MatrixCell["depth"]): MatrixCell["depth"] { return depth; }

export const MATRIX_CELLS: MatrixCell[] = [
  // Parāśari
  { streamSlug: "parashari", streamName: "Parāśari", subBranch: "Jātaka", depth: d("deep"), note: "Deep — T1-04 through T1-15 + T1-16 + T2-01 through T2-13" },
  { streamSlug: "parashari", streamName: "Parāśari", subBranch: "Praśna", depth: d("moderate"), note: "Moderate — T1-19 + T2-20" },
  { streamSlug: "parashari", streamName: "Parāśari", subBranch: "Muhūrta", depth: d("moderate"), note: "Moderate — T1-18 + T2-18" },
  { streamSlug: "parashari", streamName: "Parāśari", subBranch: "Nimitta", depth: d("moderate"), note: "Moderate — T2-19 + T2-21" },
  { streamSlug: "parashari", streamName: "Parāśari", subBranch: "Āyurveda-Jyotiṣa", depth: d("moderate"), note: "Moderate — T1-09 + T1-15 + T2-09 + T2-22" },
  { streamSlug: "parashari", streamName: "Parāśari", subBranch: "Vāstu", depth: d("light"), note: "Light — T1-22 intro + cross-ref for standalone depth" },
  { streamSlug: "parashari", streamName: "Parāśari", subBranch: "Saṁhitā-Detailed", depth: d("moderate"), note: "Moderate — T2-21 + T2-19" },
  // Jaiminī
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranch: "Jātaka", depth: d("deep"), note: "Deep at intro+intermediate — cross-ref for full specialisation" },
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranch: "Praśna", depth: d("light"), note: "Light — no distinctively-Jaiminī praśna" },
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranch: "Muhūrta", depth: d("light"), note: "Light — no distinctively-Jaiminī muhūrta" },
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranch: "Nimitta", depth: d("na"), note: "n/a — uses Parāśari saṁhitā foundation" },
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranch: "Āyurveda-Jyotiṣa", depth: d("light"), note: "Light — no distinctively-Jaiminī material" },
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranch: "Vāstu", depth: d("na"), note: "n/a — no distinctively-Jaiminī Vāstu" },
  { streamSlug: "jaimini", streamName: "Jaiminī", subBranch: "Saṁhitā-Detailed", depth: d("na"), note: "n/a — uses Parāśari saṁhitā foundation" },
  // KP
  { streamSlug: "kp", streamName: "KP", subBranch: "Jātaka", depth: d("moderate"), note: "Moderate — cross-ref for full KP specialisation depth" },
  { streamSlug: "kp", streamName: "KP", subBranch: "Praśna", depth: d("moderate"), note: "Moderate — KP horary 1-249; cross-ref for practitioner training" },
  { streamSlug: "kp", streamName: "KP", subBranch: "Muhūrta", depth: d("light"), note: "Light — KP muhūrta cross-references" },
  { streamSlug: "kp", streamName: "KP", subBranch: "Nimitta", depth: d("na"), note: "n/a — uses standard Parāśari saṁhitā foundation" },
  { streamSlug: "kp", streamName: "KP", subBranch: "Āyurveda-Jyotiṣa", depth: d("light"), note: "Light — no distinctively-KP material" },
  { streamSlug: "kp", streamName: "KP", subBranch: "Vāstu", depth: d("na"), note: "n/a — no distinctively-KP Vāstu" },
  { streamSlug: "kp", streamName: "KP", subBranch: "Saṁhitā-Detailed", depth: d("na"), note: "n/a — uses standard Parāśari saṁhitā foundation" },
  // Lal Kitab
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranch: "Jātaka", depth: d("moderate"), note: "Moderate — cross-ref for full Lal Kitab specialisation" },
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranch: "Praśna", depth: d("light"), note: "Light — no distinctively-Lal-Kitab praśna" },
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranch: "Muhūrta", depth: d("light"), note: "Light — no distinctively-Lal-Kitab muhūrta" },
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranch: "Nimitta", depth: d("light"), note: "Light — partial omen overlap" },
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranch: "Āyurveda-Jyotiṣa", depth: d("moderate"), note: "Moderate — health-and-remedy material in T2-22" },
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranch: "Vāstu", depth: d("light"), note: "Light — no distinctively-Lal-Kitab Vāstu" },
  { streamSlug: "lal-kitab", streamName: "Lal Kitab", subBranch: "Saṁhitā-Detailed", depth: d("light"), note: "Light — remedial overlap with classical saṁhitā" },
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    slug: "drill-01",
    question: "A learner claims: 'The curriculum should cover all four streams, all three skandhas, all seven sub-branches at full mastery depth — anything less is incomplete.' What is the most accurate evaluation of this claim?",
    options: [
      { id: "A", label: "The claim is correct — a comprehensive curriculum must deliver full mastery everywhere", isCorrect: false, explanation: "Incorrect. This misapplies the literacy-vs-mastery doctrine (Constitution §3.6). No curriculum can deliver full mastery across all 84 conceptual cells without becoming impractically large or shallow. False-comprehensive-mastery claims are operationally dishonest." },
      { id: "B", label: "The claim misapplies literacy-vs-mastery doctrine + modern operational distribution + cross-reference protocol logic", isCorrect: true, explanation: "Correct. The claim over-extends a 'comprehensive coverage' criterion that no curriculum could meet. Per §4.6 evaluative claim 1: the literacy-vs-mastery + cross-reference protocol approach better serves real learner operational needs — deep in core areas, moderate where literacy suffices, light + cross-reference for standalone specialisations." },
      { id: "C", label: "The claim is partially correct for Parāśari but wrong for Jaiminī, KP, and Lal Kitab", isCorrect: false, explanation: "Incorrect. The claim is not 'partially correct' for any stream. Even Parāśari does not need 'full mastery depth' across all sub-branches — Parāśari Vāstu is light + cross-reference, Parāśari Āyurveda-Jyotiṣa is moderate with cross-reference for full Āyurveda integration. The issue is the claim's scope, not stream-specific distribution." },
      { id: "D", label: "The claim is correct in principle but the curriculum lacks resources to implement it", isCorrect: false, explanation: "Incorrect. The problem is not 'lack of resources' — the problem is that the claim itself is structurally flawed. Even with infinite resources, delivering full mastery across all 84 cells would produce a curriculum so large that no learner could complete it. The literacy-vs-mastery approach is structurally preferable, not merely practically necessary." },
    ],
  },
  {
    slug: "drill-02",
    question: "A learner observes that Tier 1 has 12 modules of primary Jātaka coverage that are largely Parāśari-tradition, while Jaiminī, KP, and Lal Kitab get only intro coverage. They conclude: 'The curriculum is centred on Parāśari — multi-stream-honesty is hollow rhetoric.' What is the honest evaluation?",
    options: [
      { id: "A", label: "The learner is correct — the coverage distribution proves Parāśari-centrism", isCorrect: false, explanation: "Incorrect. This conflates 'Parāśari-foundational-with-multi-stream-honoured' with 'Parāśari-centric-disguised-as-multi-stream'. These are structurally distinct positionings." },
      { id: "B", label: "The learner mischaracterises the positioning — Parāśari-foundational depth is operationally honest, and multi-stream-honesty doesn't require equal coverage", isCorrect: true, explanation: "Correct. Per §4.6 evaluative claim 2: multi-stream-honesty requires (i) honest acknowledgement of all streams as real, (ii) explicit framework operationalising all streams, (iii) cross-stream synthesis training, (iv) cross-references for lineage-specific depth. The curriculum meets all four. Equal coverage would misrepresent the operational landscape." },
      { id: "C", label: "The curriculum should increase Jaiminī/KP/Lal Kitab coverage to match Parāśari depth", isCorrect: false, explanation: "Incorrect. Equal coverage would violate operational-honesty discipline. Parāśari has the deepest classical foundational corpus + globally-dominant practitioner discourse. Inflating other streams to match Parāśari depth would misrepresent the actual landscape and bloat the curriculum with material that doesn't reflect operational distribution." },
      { id: "D", label: "The learner should simply accept that Parāśari is the 'best' stream", isCorrect: false, explanation: "Incorrect. The curriculum does NOT rank streams hierarchically. Parāśari is the *foundational* stream (largest corpus, most practitioners) — this is an *operational observation*, not an *authority ranking*. Jaiminī, KP, and Lal Kitab are all honoured as real-and-substantive with their own distinctive contributions." },
    ],
  },
  {
    slug: "drill-03",
    question: "A learner asks: 'If the curriculum is just a synthesis of existing material, why shouldn't I go directly to the foundational texts instead?' What is the most accurate answer?",
    options: [
      { id: "A", label: "The curriculum is faster than reading foundational texts directly", isCorrect: false, explanation: "Incorrect. While efficiency is a benefit, this answer understates the curriculum's actual contribution. The curriculum's value-add is not merely 'speed' — it is scaffolded pedagogical organisation, synthesis-judgments, and cross-stream framework integration." },
      { id: "B", label: "The synthesis-judgments are themselves real scholarly contributions — what to include, omit, integrate, scaffold — plus the curriculum provides scaffolded learning sequences that direct foundational engagement does not", isCorrect: true, explanation: "Correct. Per §4.6 Recognition 3 + §4.4: synthesis-judgments (what to include, what to omit, how to integrate, how to scaffold, which edition to default to) are the curriculum's actual contribution. Direct foundational-text engagement is hard for new learners — BPHS is ~1,500+ pages, Jaiminī Sūtra requires commentary engagement, KP Reader is six compact volumes. The curriculum provides scaffolded Tier 1 → Tier 2 progression + Bloom-progression + cross-references for direct engagement when ready." },
      { id: "C", label: "Foundational texts are outdated and the curriculum updates them", isCorrect: false, explanation: "Incorrect. The curriculum does NOT claim to 'update' foundational texts. The foundational texts retain their doctrinal authority; the curriculum is pedagogical scaffolding around them, not a replacement or update. This answer mischaracterises both the curriculum's role and the foundational texts' status." },
      { id: "D", label: "There is no good reason — direct foundational engagement is always superior", isCorrect: false, explanation: "Incorrect. Both pathways are legitimate and complementary. A learner with deep prior background may engage foundational texts directly; a new learner benefits from scaffolded synthesis. Most learners benefit from doing both. The two pathways are not competitive." },
    ],
  },
  {
    slug: "drill-04",
    question: "A practitioner wants full operational mastery in KP horary for client work. They have completed the curriculum. What is the honest framing of their readiness?",
    options: [
      { id: "A", label: "The curriculum has fully trained them — they are ready for KP-horary client work immediately", isCorrect: false, explanation: "Incorrect. The curriculum covers KP horary at moderate depth (T1-19 intro + T2-20 deeper). Beyond intermediate level, KP-horary specialisation requires direct KP-stream engagement: KP Reader I-VI + second-generation commentary + active teaching-lineage participation." },
      { id: "B", label: "The curriculum has prepared them with foundational scaffolding + cross-references — full KP-horary mastery requires direct KP-stream engagement beyond the curriculum", isCorrect: true, explanation: "Correct. Per §4.5 cross-reference protocol + §6 Recognition 1: the curriculum prepares but does not complete KP-horary specialisation. The learner is operationally literate in KP horary basics and prepared for substantial KP-stream engagement; full practitioner mastery requires direct KP-stream training. The cross-reference protocol transparently points to KP Reader I-VI + Subramaniam + Hariharan + Tin Win + KP teaching lineages." },
      { id: "C", label: "The curriculum has not prepared them at all — they must start KP horary from scratch", isCorrect: false, explanation: "Incorrect. The curriculum DOES provide substantial preparation: multi-stream framework awareness + Parāśari foundations + KP introduction (sub-lord, CSL, 1-249) + cross-references for depth. Starting 'from scratch' ignores the scaffolding the curriculum provides." },
      { id: "D", label: "They should switch to a different stream since KP is not covered deeply", isCorrect: false, explanation: "Incorrect. KP IS covered at moderate depth with transparent cross-references for deeper engagement. The curriculum's design explicitly supports learners who want to specialise in any stream — via literacy-coverage + cross-references. There is no reason to 'switch streams' due to coverage design." },
    ],
  },
  {
    slug: "drill-05",
    question: "Which of the following best describes the curriculum's cross-reference protocol?",
    options: [
      { id: "A", label: "An admission that the curriculum is incomplete and deficient", isCorrect: false, explanation: "Incorrect. This mischaracterises cross-referencing as deficiency-admission. Per §4.5 + §4.6 Common Mistake #4: transparent cross-referencing is epistemic honesty in action, not an admission of failure." },
      { id: "B", label: "An operational mechanism for transparently pointing to external authoritative sources for depth beyond curriculum coverage", isCorrect: true, explanation: "Correct. Per §4.5: the cross-reference protocol has five dimensions (foundational-text, modern-primary corpus, modern revival/second-generation, adjacent-discipline, academic/Indology). It operationalises multi-stream-honesty + multi-discipline-honesty + literacy-vs-mastery + honest-citation simultaneously. It is structurally preferable to false-comprehensive-mastery claims." },
      { id: "C", label: "A marketing device to make the curriculum seem more comprehensive than it is", isCorrect: false, explanation: "Incorrect. The cross-references are specific, actionable, and tied to real authoritative sources (Sanjay Rath SJC for Jaiminī depth; KP Reader for KP depth; Mayamatam/Mānasāra for Vāstu depth; etc.). They serve real learner operational needs, not marketing purposes." },
      { id: "D", label: "Optional supplementary material that learners can safely ignore", isCorrect: false, explanation: "Incorrect. The cross-references are integral to the curriculum's design. For learners seeking depth in non-covered areas, the cross-references provide direct operational guidance. Ignoring them would leave the learner without pathways to specialisation depth." },
    ],
  },
];

export interface NonCoverageItem {
  id: string;
  title: string;
  what: string;
  why: string;
  crossRefs: string[];
}

/** The seven intentional non-coverage categories — lesson §4.3. */
export const NON_COVERAGE_ITEMS: NonCoverageItem[] = [
  {
    id: "manual-ganita",
    title: "Manual gaṇita-by-hand fluency",
    what: "Performing chart-erection mathematics + planetary-position computation entirely by hand.",
    why: "Modern computational discharge — Swiss Ephemeris, Astro Engine, and commercial software handle gaṇita for routine practice. Manual fluency is historically required but operationally optional.",
    crossRefs: ["T2-15 Astronomical Foundations", "Sūrya Siddhānta (Burgess)", "Pañcasiddhāntikā (Neugebauer-Pingree)", "Siddhānta Śiromaṇi (Bhāskara II)"],
  },
  {
    id: "standalone-vastu",
    title: "Standalone Vāstu specialisation depth",
    what: "Full operational mastery in Vāstu-Śāstra as a standalone practitioner discipline.",
    why: "Vāstu has its own substantial separate practitioner community. The curriculum provides intro (T1-22) for Jyotiṣa-integrated literacy; full specialisation requires standalone Vāstu literature.",
    crossRefs: ["Mayamatam", "Mānasāra", "Samarāṅgaṇa-Sūtradhāra", "Modern Vāstu Shastra training programs"],
  },
  {
    id: "standalone-ayurveda",
    title: "Standalone Āyurveda integration depth",
    what: "Full operational integration of Jyotiṣa with Āyurveda corpus mastery.",
    why: "Āyurveda is a major separate śāstra requiring multi-year parallel training. The curriculum covers the Jyotiṣa side with explicit cross-references.",
    crossRefs: ["Caraka Saṁhitā", "Suśruta Saṁhitā", "Aṣṭāṅga Hṛdaya", "Modern Āyurveda BAMS training", "Frawley's Ayurvedic Astrology"],
  },
  {
    id: "numerology-tantra",
    title: "Numerology + tantric ritual + tantra-mantric practice depth",
    what: "Full operational mastery in numerology, tantric ritual, and tantra-mantric remedial practice.",
    why: "These adjacent disciplines have their own substantial separate traditions. The curriculum provides intro literacy only.",
    crossRefs: ["Specialised numerology literature (Cheiro, Sepharial)", "Tantric primaries per sectarian tradition", "Lineage-engagement for tantric practice"],
  },
  {
    id: "lineage-training",
    title: "Specific stream practitioner-lineage training",
    what: "Direct engagement with a specific practitioner-lineage at lineage-internal mastery depth.",
    why: "Lineage-engagement requires direct teacher-disciple relationship + lineage-specific practices. The curriculum is a modern teaching synthesis, not a lineage-tradition-internal system.",
    crossRefs: ["Sanjay Rath SJC / PJC", "K.N. Rao BVB lineage", "Specific KP teaching lineages", "Specific Lal Kitab regional lineages"],
  },
  {
    id: "adjacent-traditions",
    title: "Tājika horary, Western Renaissance horary, Hellenistic astrology",
    what: "Full operational mastery in adjacent astrological traditions historically present in Indian cross-fertilisation.",
    why: "The curriculum is Vedic-astrology-centric per its mission. Adjacent traditions are acknowledged but not integrated into core coverage.",
    crossRefs: ["Standalone Tājika literature", "Western Renaissance horary corpus (Lilly, Bonatti, Barclay, Frawley)", "Hellenistic astrology corpus (Project Hindsight, Brennan)"],
  },
  {
    id: "sectarian-tantric",
    title: "Regional sectarian tantric astrology",
    what: "Śaiva, Vaiṣṇava, or Śākta tantric astrology integrated with sectarian ritual practice.",
    why: "Substantial regional and sectarian variations require sectarian-internal engagement. The curriculum provides Hindu-tradition-broadly-respectful framing without sectarian commitment.",
    crossRefs: ["Śaiva tantric primaries", "Vaiṣṇava tantric primaries", "Śākta tantric primaries", "Sectarian lineage-engagement"],
  },
];
