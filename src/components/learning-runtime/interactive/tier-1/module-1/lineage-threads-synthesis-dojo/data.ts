/**
 * Lineage Threads Synthesis Dojo — L4.2 §7 flagship data.
 *
 * Two views:
 *   1. LINEAGE COMPARISON MATRIX — 8 lineages × characteristics grid.
 *   2. EVALUATIVE DRILL — 5 scenarios from §4.10 + §8 common mistakes.
 */

export interface ComparisonRow {
  lineage: string;
  founder: string;
  regionalSchool: string;
  streams: string;
  infrastructure: string;
  reach: string;
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

export const COMPARISON_ROWS: ComparisonRow[] = [
  { lineage: "BVB Delhi", founder: "K.N. Rao (BVB faculty)", regionalSchool: "North Indian", streams: "Parāśari + Jaiminī", infrastructure: "Multi-year institutional programs", reach: "Broad (Indian-context)" },
  { lineage: "SJC", founder: "Sanjay Rath", regionalSchool: "Western-Vedic-fusion + Indian", streams: "Parāśari + Jaiminī + cross-ref", infrastructure: "PJC structured course + global branches", reach: "Broad (global)" },
  { lineage: "KP lineages", founder: "K.S. Krishnamurti", regionalSchool: "South Indian", streams: "KP (centre) + Parāśari cross-ref", infrastructure: "Commentary corpora + conferences", reach: "Broad (global via English)" },
  { lineage: "Lal Kitab lineages", founder: "Pandit Roop Chand Joshi", regionalSchool: "North Indian", streams: "Lal Kitab (centre) + Parāśari cross-ref", infrastructure: "Regional teacher networks + Hindi/Urdu corpus", reach: "Broad (Punjab + diaspora)" },
  { lineage: "AIVS", founder: "David Frawley", regionalSchool: "Western-Vedic-fusion", streams: "Parāśari + Vedic integration", infrastructure: "AIVS courses + published corpus", reach: "Broad (USA + global)" },
  { lineage: "Defouw-Svoboda", founder: "Hart Defouw + Robert Svoboda", regionalSchool: "Western-Vedic-fusion", streams: "Parāśari + cross-stream ref", infrastructure: "Light on Life + courses/workshops", reach: "Broad (USA + cross-regional)" },
  { lineage: "Komilla Sutton", founder: "Komilla Sutton", regionalSchool: "Western-Vedic-fusion", streams: "Parāśari + selective Jaiminī", infrastructure: "UK courses + published corpus", reach: "Concentrated (UK + Europe)" },
  { lineage: "Sanskrit-pundit", founder: "Various (generational)", regionalSchool: "Distributed Indian", streams: "Parāśari (centre)", infrastructure: "Direct teacher-student succession", reach: "Regional (Indian)" },
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    slug: "drill-01",
    question: "A learner concludes: 'KP teaching lineages are just the KP-stream, and Lal Kitab regional lineages are just the Lal Kitab-stream. Lineages don't add anything beyond stream membership.' What is the most accurate evaluation?",
    options: [
      { id: "A", label: "The learner is correct — lineages are redundant organisational units", isCorrect: false, explanation: "Incorrect. This is Common Mistake #1. Lineages organise by teacher-student-network; streams organise by doctrinal lineage. The same stream operates through multiple parallel lineages (Parāśari operates through BVB + SJC + AIVS + Defouw-Svoboda + Komilla Sutton + Sanskrit-pundit lineages). The same lineage may emphasise multiple streams (BVB teaches Parāśari + Jaiminī). These are different organisational dimensions." },
      { id: "B", label: "The learner conflates two dimensionally independent organisational levels — teacher-student-network vs doctrinal lineage", isCorrect: true, explanation: "Correct. Per §4.1 + §4.9: lineages organise by teacher-student-network; streams organise by doctrinal lineage. Strong correlation between lineage and stream-emphasis (KP lineages do emphasise KP-stream) makes stream-reduction intuitive but wrong. The two dimensions cross-cut and interrelate without one reducing to the other." },
      { id: "C", label: "The learner is partially correct for KP and Lal Kitab but wrong for BVB and SJC", isCorrect: false, explanation: "Incorrect. The error is not partial — it's a category error across all lineages. Even for KP lineages, the specific sub-lineage (Subramaniam vs Hariharan vs Tin Win) has different commentary traditions, student networks, and methodological emphases within the same KP-stream. These differences are lineage-specific, not stream-specific." },
      { id: "D", label: "The learner should study more sub-lineages before evaluating", isCorrect: false, explanation: "Incorrect. More sub-lineage knowledge wouldn't fix the category error. The issue is conflating two different organisational dimensions (teacher-student-network vs doctrinal lineage), not insufficient knowledge of specific sub-lineages." },
    ],
  },
  {
    slug: "drill-02",
    question: "A learner asks: 'I've completed the curriculum's Tier 1. Does that make me a credentialed practitioner with lineage standing?' What is the honest answer?",
    options: [
      { id: "A", label: "Yes — curriculum completion provides both operational mastery and lineage credentialing", isCorrect: false, explanation: "Incorrect. This is Common Mistake #3. The curriculum is modern-teaching-synthesis (per Lesson 1.3.3 §4.4), NOT a lineage. Curriculum completion provides operational mastery (cross-stream + cross-region competence) but NOT lineage-credentialing, which requires lineage-internal initiation + ongoing teacher-student relationship + lineage-internal recognition." },
      { id: "B", label: "Curriculum completion provides operational mastery but not lineage-credentialing — the curriculum is synthesis, not lineage", isCorrect: true, explanation: "Correct. Per §4.10 + §6 Recognition 3: curriculum completion provides operational mastery per Lesson 1.3.3 §4.2, but lineage-credentialing operates through specific lineage-internal mechanisms (initiation + ongoing teacher-student relationship + lineage-internal recognition). The curriculum cross-references lineages but does not replace them. Both engagements are legitimate and complementary." },
      { id: "C", label: "No — the learner must start over with a specific lineage to become credentialed", isCorrect: false, explanation: "Incorrect. The curriculum DOES provide substantial preparation and operational competence. The learner is not starting 'from scratch' — they have cross-stream fluency, foundational scaffolding, and cross-references for lineage engagement. The curriculum and lineage-engagement complement each other; one does not invalidate the other." },
      { id: "D", label: "Only Sanskrit-pundit lineages provide real credentialing; modern institutional lineages don't count", isCorrect: false, explanation: "Incorrect. This is a form of lineage-supremacism (Common Mistake #2 variant). All eight lineage threads are real-and-substantive. Sanskrit-pundit lineages and modern institutional lineages operate different forms of teacher-disciple transmission (per §5 Manusmṛti analysis), but both provide legitimate lineage-credentialing within their respective traditions." },
    ],
  },
  {
    slug: "drill-03",
    question: "A learner wants to specialise in Jaiminī revival material. They can access both SJC and BVB Delhi. What does the lineage-thread framework tell them about choosing between these two lineages?",
    options: [
      { id: "A", label: "They should choose SJC because it is the only authentic Jaiminī revival lineage", isCorrect: false, explanation: "Incorrect. This is intra-Jaiminī-revival supremacism (Common Mistake #2). Both SJC and BVB Delhi are legitimate Jaiminī revival lineages. Neither displaces the other. Multi-lineage-honesty requires recognising both as real-and-substantive." },
      { id: "B", label: "Both are legitimate; the choice depends on operational fit — SJC for English-medium global access + structured PJC; BVB for Indian-context + Hindi/English institutional programs", isCorrect: true, explanation: "Correct. Per §4.3 + §4.4 + §6 Recognition 1: both SJC and BVB Delhi are legitimate Jaiminī revival lineages. SJC fits learners with English-medium primary engagement, cross-regional access, structured-course preference, and Western-Vedic-fusion cultural context. BVB fits learners with Indian-context engagement, Hindi-medium accessibility, institutional-program preference, and Indian-cultural-context fit. Many serious practitioners engage both." },
      { id: "C", label: "They should choose BVB because K.N. Rao's Jaiminī work predates Sanjay Rath's", isCorrect: false, explanation: "Incorrect. Chronological priority does not establish authority-ranking in multi-lineage-honesty. Both lineages are legitimate within their respective training traditions. 'Predates' is not a criterion for legitimacy in the lineage-thread framework." },
      { id: "D", label: "They should avoid both and find a Sanskrit-pundit Jaiminī lineage for 'authentic' transmission", isCorrect: false, explanation: "Incorrect. Sanskrit-pundit lineages are differently-structured and primarily transmit Parāśari (per §4.8). Jaiminī revival material is concentrated in SJC and BVB Delhi lineages. Moreover, this framing privileges one lineage type over another, violating multi-lineage-honesty." },
    ],
  },
  {
    slug: "drill-04",
    question: "A learner observes that Sanskrit-pundit regional lineages lack named founders, course-based infrastructure, and global reach. They conclude these lineages are 'less real' than BVB, SJC, or KP lineages. What is the honest evaluation?",
    options: [
      { id: "A", label: "The learner is correct — institutional formalisation is the measure of lineage reality", isCorrect: false, explanation: "Incorrect. This is Common Mistake #4. Modern-institutional-formalisation framing creates the impression that only formally-institutionalised lineages are real. Sanskrit-pundit regional lineages are real-and-substantive despite differently-structured organisational characteristics. Differently-structured ≠ less real." },
      { id: "B", label: "Sanskrit-pundit lineages are differently-structured but equally real — they have substantial practitioner reach, preserve methodological distinctness, and provide deep classical engagement", isCorrect: true, explanation: "Correct. Per §4.8 + §5 Manusmṛti analysis: Sanskrit-pundit lineages have substantial Indian-regional practitioner reach; preserve methodological distinctness that institutional teaching may homogenise; provide deep classical foundational engagement through direct Sanskrit + classical-pundit tradition. The guru-paramparā discipline applies to both differently-structured and named-modern-institutional lineages." },
      { id: "C", label: "Sanskrit-pundit lineages were historically real but are becoming obsolete in the modern era", isCorrect: false, explanation: "Incorrect. There is no evidence that Sanskrit-pundit lineages are becoming obsolete. They continue to train practitioners, transmit texts, and maintain distinctive methodologies across Indian regional schools. The 'obsolescence' framing misrepresents the actual landscape." },
      { id: "D", label: "The learner should personally visit a Sanskrit-pundit teacher before evaluating their reality", isCorrect: false, explanation: "Incorrect. While direct engagement is valuable, the learner's conclusion is already operationally wrong based on the framework's analytical criteria. Sanskrit-pundit lineages meet the lineage-thread definition (teacher-student-network + training pathway + practitioner network) regardless of whether any individual learner has personally visited a pundit teacher." },
    ],
  },
  {
    slug: "drill-05",
    question: "Which of the following best captures the relationship between curriculum engagement and lineage engagement?",
    options: [
      { id: "A", label: "Curriculum engagement replaces lineage engagement — the curriculum is a superior modern alternative", isCorrect: false, explanation: "Incorrect. The curriculum does NOT replace lineage engagement. Per §4.10 + Lesson 1.3.3 §4.4: the curriculum is modern-teaching-synthesis, NOT a lineage. It cross-references lineages but does not replace them. 'Superior alternative' framing violates the both-engagements-legitimate discipline." },
      { id: "B", label: "Both engagements are legitimate and serve different operational purposes — curriculum provides cross-stream/cross-region fluency; lineage provides stream-specific specialisation depth + practitioner-community embedding + credentialing", isCorrect: true, explanation: "Correct. Per §4.10: curriculum completion provides operational mastery (cross-stream + cross-region competence) but not lineage-credentialing. Lineage engagement provides lineage-credentialing + specific stream-and-lineage depth + practitioner-community embedding. Most serious practitioners pursue both complementarily — the yes-and pathway." },
      { id: "C", label: "Lineage engagement replaces curriculum engagement — direct teacher-student transmission is always superior", isCorrect: false, explanation: "Incorrect. While lineage engagement provides depth and credentialing that the curriculum does not, it typically provides less cross-stream cross-region fluency than the curriculum. Neither replaces the other. 'Always superior' framing is lineage-supremacism, violating multi-lineage-honesty and the curriculum-vs-lineage distinction." },
      { id: "D", label: "The two are competitive — learners must choose one or the other based on their career goals", isCorrect: false, explanation: "Incorrect. The two are NOT competitive. They are complementary. Many learners benefit from completing the curriculum for cross-stream operational fluency AND engaging a specific lineage for specialisation depth. The honest framing is yes-and, not either-or." },
    ],
  },
];
