/**
 * Regional Schools Synthesis Dojo — L4.1 §7 flagship data.
 *
 * Two views:
 *   1. REGIONAL SCHOOLS MATRIX — 6 schools × 4 streams grid with concentration colours.
 *   2. EVALUATIVE DRILL — 5 scenarios from §4.9 + §8 common mistakes.
 */

export type Concentration = "centre" | "strong" | "moderate" | "light" | "none";

export interface MatrixCell {
  schoolSlug: string;
  schoolName: string;
  streamSlug: string;
  streamName: string;
  concentration: Concentration;
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

export const SCHOOLS = [
  { slug: "south-indian", name: "South Indian", color: "#C8412E", colorDeep: "#7A2A14" },
  { slug: "north-indian", name: "North Indian", color: "#4F6FA8", colorDeep: "#2F4778" },
  { slug: "bengali", name: "Bengali", color: "#3A8C5A", colorDeep: "#2A6A40" },
  { slug: "gujarati", name: "Gujarati", color: "#9C7A2F", colorDeep: "#7A5E1E" },
  { slug: "maharashtrian", name: "Maharashtrian", color: "#7A3E4A", colorDeep: "#5A2E3A" },
  { slug: "western-vedic-fusion", name: "Western-Vedic-fusion", color: "#7A5E1E", colorDeep: "#5A4A0E" },
] as const;

export const STREAMS = [
  { slug: "parashari", name: "Parāśari", color: "#C8412E", colorDeep: "#7A2A14" },
  { slug: "jaimini", name: "Jaiminī", color: "#3A8C5A", colorDeep: "#2A6A40" },
  { slug: "kp", name: "KP", color: "#4F6FA8", colorDeep: "#2F4778" },
  { slug: "lal-kitab", name: "Lal Kitab", color: "#7A3E4A", colorDeep: "#5A2E3A" },
] as const;

function c(concentration: Concentration): Concentration { return concentration; }

export const MATRIX_CELLS: MatrixCell[] = [
  // South Indian
  { schoolSlug: "south-indian", schoolName: "South Indian", streamSlug: "parashari", streamName: "Parāśari", concentration: c("strong"), note: "Classical Parāśari across all four states via deep Sanskrit-pundit lineages" },
  { schoolSlug: "south-indian", schoolName: "South Indian", streamSlug: "jaimini", streamName: "Jaiminī", concentration: c("moderate"), note: "Selective Jaiminī engagement through classical lineages" },
  { schoolSlug: "south-indian", schoolName: "South Indian", streamSlug: "kp", streamName: "KP", concentration: c("centre"), note: "Global KP centre — K.S. Krishnamurti Tamil Nadu-born; KP Reader Chennai-published" },
  { schoolSlug: "south-indian", schoolName: "South Indian", streamSlug: "lal-kitab", streamName: "Lal Kitab", concentration: c("light"), note: "Limited direct Lal Kitab concentration" },
  // North Indian
  { schoolSlug: "north-indian", schoolName: "North Indian", streamSlug: "parashari", streamName: "Parāśari", concentration: c("strong"), note: "Banaras Sanskrit-pundit Parāśari + BVB Delhi institutional teaching" },
  { schoolSlug: "north-indian", schoolName: "North Indian", streamSlug: "jaimini", streamName: "Jaiminī", concentration: c("strong"), note: "BVB Delhi Jaiminī revival under K.N. Rao + subsequent generations" },
  { schoolSlug: "north-indian", schoolName: "North Indian", streamSlug: "kp", streamName: "KP", concentration: c("moderate"), note: "KP engagement through cross-regional teaching" },
  { schoolSlug: "north-indian", schoolName: "North Indian", streamSlug: "lal-kitab", streamName: "Lal Kitab", concentration: c("centre"), note: "Global Lal Kitab centre — Pandit Roop Chand Joshi Punjab-born; Urdu primary published pre-Partition Punjab/Lahore" },
  // Bengali
  { schoolSlug: "bengali", schoolName: "Bengali", streamSlug: "parashari", streamName: "Parāśari", concentration: c("strong"), note: "Classical Parāśari with Bengali-language emphasis" },
  { schoolSlug: "bengali", schoolName: "Bengali", streamSlug: "jaimini", streamName: "Jaiminī", concentration: c("moderate"), note: "Selective Jaiminī engagement" },
  { schoolSlug: "bengali", schoolName: "Bengali", streamSlug: "kp", streamName: "KP", concentration: c("light"), note: "Limited KP concentration" },
  { schoolSlug: "bengali", schoolName: "Bengali", streamSlug: "lal-kitab", streamName: "Lal Kitab", concentration: c("none"), note: "No distinctive Lal Kitab concentration" },
  // Gujarati
  { schoolSlug: "gujarati", schoolName: "Gujarati", streamSlug: "parashari", streamName: "Parāśari", concentration: c("strong"), note: "Classical Parāśari with commercial-astrology orientation" },
  { schoolSlug: "gujarati", schoolName: "Gujarati", streamSlug: "jaimini", streamName: "Jaiminī", concentration: c("light"), note: "Limited Jaiminī engagement" },
  { schoolSlug: "gujarati", schoolName: "Gujarati", streamSlug: "kp", streamName: "KP", concentration: c("light"), note: "Limited KP concentration" },
  { schoolSlug: "gujarati", schoolName: "Gujarati", streamSlug: "lal-kitab", streamName: "Lal Kitab", concentration: c("none"), note: "No distinctive Lal Kitab concentration" },
  // Maharashtrian
  { schoolSlug: "maharashtrian", schoolName: "Maharashtrian", streamSlug: "parashari", streamName: "Parāśari", concentration: c("strong"), note: "Classical Parāśari with Pune Sanskrit-pundit emphasis" },
  { schoolSlug: "maharashtrian", schoolName: "Maharashtrian", streamSlug: "jaimini", streamName: "Jaiminī", concentration: c("light"), note: "Limited Jaiminī engagement" },
  { schoolSlug: "maharashtrian", schoolName: "Maharashtrian", streamSlug: "kp", streamName: "KP", concentration: c("light"), note: "Limited KP concentration" },
  { schoolSlug: "maharashtrian", schoolName: "Maharashtrian", streamSlug: "lal-kitab", streamName: "Lal Kitab", concentration: c("none"), note: "No distinctive Lal Kitab concentration" },
  // Western-Vedic-fusion
  { schoolSlug: "western-vedic-fusion", schoolName: "Western-Vedic-fusion", streamSlug: "parashari", streamName: "Parāśari", concentration: c("strong"), note: "Classical Parāśari as foundational emphasis across all teachers" },
  { schoolSlug: "western-vedic-fusion", schoolName: "Western-Vedic-fusion", streamSlug: "jaimini", streamName: "Jaiminī", concentration: c("strong"), note: "Jaiminī revival emphasis via Sanjay Rath SJC + K.N. Rao BVB-influence" },
  { schoolSlug: "western-vedic-fusion", schoolName: "Western-Vedic-fusion", streamSlug: "kp", streamName: "KP", concentration: c("moderate"), note: "Selective KP cross-references; full depth requires Tamil Nadu engagement" },
  { schoolSlug: "western-vedic-fusion", schoolName: "Western-Vedic-fusion", streamSlug: "lal-kitab", streamName: "Lal Kitab", concentration: c("light"), note: "Limited deep Lal Kitab due to cultural-translation barriers" },
];

export const TEACHERS = [
  { name: "Sanjay Rath", school: "Western-Vedic-fusion", stream: "Jaiminī revival / Parāśari", org: "Sri Jagannath Center (SJC) + PJC" },
  { name: "K.N. Rao", school: "North Indian (Delhi)", stream: "Jaiminī revival / Parāśari", org: "Bharatiya Vidya Bhavan (BVB) Delhi" },
  { name: "K.S. Krishnamurti", school: "South Indian (Tamil Nadu)", stream: "KP", org: "KP Astro Publications, Chennai" },
  { name: "Pandit Roop Chand Joshi", school: "North Indian (Punjab)", stream: "Lal Kitab", org: "Lal Kitab 5 volumes (Urdu, 1939–1952)" },
  { name: "David Frawley", school: "Western-Vedic-fusion", stream: "Parāśari + Vedic integration", org: "American Institute of Vedic Studies (AIVS)" },
  { name: "Hart Defouw & Robert Svoboda", school: "Western-Vedic-fusion", stream: "Parāśari", org: "Light on Life (2003, Lotus Press)" },
  { name: "Komilla Sutton", school: "Western-Vedic-fusion (UK)", stream: "Parāśari", org: "UK-based Vedic-astrology teaching" },
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    slug: "drill-01",
    question: "A learner concludes: 'Regional schools are just stream-concentration patterns. Punjab = Lal Kitab; Tamil Nadu = KP. Regional schools don't add a distinct organisational level.' What is the most accurate evaluation?",
    options: [
      { id: "A", label: "The learner is correct — regional schools are reducible to stream geography", isCorrect: false, explanation: "Incorrect. This is Common Mistake #1. Regional schools operate at geographic + cultural-linguistic + practitioner-community dimensions that cross-cut doctrinal-stream organisation. A Punjabi Parāśari practitioner and a Tamil Nadu Parāśari practitioner share stream-affiliation but operate in different regional schools with different teaching languages, cultural-religious framing, and cross-stream cross-reference patterns." },
      { id: "B", label: "The learner misses the dimensional independence of regional schools — they capture what streams cannot", isCorrect: true, explanation: "Correct. Per §4.1 + §4.9 Alternative 1: regional schools are dimensionally independent from streams. Streams organise doctrinal lineage; regional schools organise geographic + cultural-linguistic + practitioner-community context. The same stream operates differently across regional schools." },
      { id: "C", label: "The learner is partially correct for Punjab and Tamil Nadu but wrong for other regional schools", isCorrect: false, explanation: "Incorrect. The error is not partial correctness — it's a category error. Even for Punjab and Tamil Nadu, reducing the regional school to its strongest stream-concentration ignores the Parāśari foundations, Jaiminī engagement, and distinctive practitioner-community features present in both regions." },
      { id: "D", label: "The learner should study more streams before evaluating regional schools", isCorrect: false, explanation: "Incorrect. More stream knowledge wouldn't fix the category error. The issue is conflating two dimensionally independent organisational levels, not insufficient stream familiarity." },
    ],
  },
  {
    slug: "drill-02",
    question: "A learner asks: 'Doesn't the curriculum's English-medium teaching make it a Western-Vedic-fusion product, contradicting multi-region-honesty?' What is the honest analytical answer?",
    options: [
      { id: "A", label: "Yes — English-medium automatically places the curriculum in Western-Vedic-fusion", isCorrect: false, explanation: "Incorrect. English-medium teaching does not automatically make a curriculum Western-Vedic-fusion. Many Indian regional teachers teach in English without operating within the Western-Vedic-fusion school. English as a lingua franca for cross-regional accessibility is operationally distinct from Western-Vedic-fusion regional-school context." },
      { id: "B", label: "English-medium serves cross-regional accessibility; the curriculum is modern-teaching-synthesis, not affiliated with any single regional school", isCorrect: true, explanation: "Correct. Per §4.6 + §4.8 + §6 Recognition 3: the curriculum's English-medium teaching serves global accessibility across all regional schools. It is positioned as modern-teaching-synthesis synthesising material from across regional schools without claiming membership in any single one. Multi-region-honesty is operationalised through cross-referencing all schools." },
      { id: "C", label: "The curriculum should be translated into all regional languages to prove multi-region-honesty", isCorrect: false, explanation: "Incorrect. Multi-region-honesty does not require equal linguistic representation. The curriculum honours all regional schools through cross-reference protocol, explicit respectful framing, and synthesis-judgments that include each school's contributions — not through translation infrastructure." },
      { id: "D", label: "Western-Vedic-fusion is not a real regional school, so the contradiction doesn't arise", isCorrect: false, explanation: "Incorrect. Western-Vedic-fusion IS a real regional school per §4.6. It meets the regional-school definition through distinctive cultural-linguistic context, practitioner-community, teaching-tradition norms, and cross-stream-cross-reference patterns. Denying its status violates multi-region-honesty." },
    ],
  },
  {
    slug: "drill-03",
    question: "A practitioner trained in Tamil Nadu KP lineage wants to engage a teacher from the Punjabi Lal Kitab tradition. What does regional-school awareness tell them?",
    options: [
      { id: "A", label: "They should not cross regional boundaries — stick to Tamil Nadu teachers", isCorrect: false, explanation: "Incorrect. Cross-regional engagement is operationally common and productive per §4.7. Modern globalisation has produced substantial cross-regional practice. The both-layers-honoured discipline recognises historically-rooted regional schools AND modern-cross-regional practice as simultaneously real." },
      { id: "B", label: "Cross-regional engagement enriches practice; regional-school awareness helps set accurate expectations about teaching language, cultural framing, and methodological defaults", isCorrect: true, explanation: "Correct. Per §4.1 + §4.7 + §4.8: regional-school context shapes teaching-language background, cultural-religious framing, practitioner-community norms, and cross-stream-cross-reference patterns. Awareness of these differences enables productive engagement rather than category-error mismatches." },
      { id: "C", label: "The Punjabi Lal Kitab teacher's methodology is less authentic than the Tamil Nadu KP teacher's", isCorrect: false, explanation: "Incorrect. This is regional-supremacism — a direct violation of multi-region-honesty. No regional school displaces or ranks above another. Each operates within its cultural-linguistic-community context. Reach is not authority." },
      { id: "D", label: "Since both operate within the four-stream landscape, their regional differences are superficial", isCorrect: false, explanation: "Incorrect. Regional differences are substantively operationally significant — teaching language, cultural-religious framing, practitioner-community norms, and cross-stream-cross-reference patterns all shape how the same stream material is taught and applied. These are not superficial differences." },
    ],
  },
  {
    slug: "drill-04",
    question: "A learner argues: 'Modern globalisation has made historically-rooted regional schools obsolete. Online learning means geography no longer matters.' What is the honest evaluation?",
    options: [
      { id: "A", label: "The learner is correct — geography is irrelevant in the digital age", isCorrect: false, explanation: "Incorrect. This is Common Mistake #3. Modern-cross-regional practice is real, but historically-rooted regional schools continue to shape practitioner training, preserve methodological distinctness, and provide cultural-linguistic grounding. Globalisation expands the landscape rather than replacing it." },
      { id: "B", label: "Both layers operate simultaneously — historically-rooted schools remain substantive, and cross-regional practice is also real", isCorrect: true, explanation: "Correct. Per §4.7 both-layers-honoured discipline + §4.9 Alternative 3: modern-cross-regional practice and historically-rooted regional schools BOTH operate. Regional schools continue to shape training even for cross-regionally-trained practitioners. Methodological distinctness is valuable diversity that homogenisation would lose." },
      { id: "C", label: "Regional schools are becoming obsolete but the transition will take several generations", isCorrect: false, explanation: "Incorrect. This still over-extends the modern-globalisation effect. There is no evidence that regional schools are becoming obsolete — they continue to produce practitioners, transmit texts, and maintain distinctive methodologies. The 'transition' framing misrepresents the actual landscape." },
      { id: "D", label: "Online learning only matters for Western-Vedic-fusion; Indian regional schools remain offline-only", isCorrect: false, explanation: "Incorrect. Indian regional schools have substantial online presence — Tamil Nadu KP teachers offer English-medium online teaching globally; BVB Delhi has digital extensions; Punjabi Lal Kitab teachers offer online programs. The online/offline divide does not map onto regional-school categories." },
    ],
  },
  {
    slug: "drill-05",
    question: "Why is the regional-school organisational level NECESSARY alongside the four-stream + three-skandha + seven-sub-branch frameworks?",
    options: [
      { id: "A", label: "It is not necessary — streams + skandhas + sub-branches already capture everything", isCorrect: false, explanation: "Incorrect. This is Alternative 1 + Alternative 2 from §4.9. Streams organise doctrinal lineage; skandhas + sub-branches organise topical scope. Neither captures geographic + cultural-linguistic + practitioner-community dimensions. The four organisational levels are complementary, not redundant." },
      { id: "B", label: "Regional schools capture practitioner-community + cultural-linguistic + teaching-tradition dimensions that doctrinal and topical frameworks cannot capture", isCorrect: true, explanation: "Correct. Per §4.9: the four organisational levels each capture a distinct dimension — streams (doctrinal lineage), skandhas (primary topical), sub-branches (finer topical), regional schools (geographic + cultural-linguistic + practitioner-community). None is redundant; none can be reduced to the others." },
      { id: "C", label: "Regional schools are primarily useful for historical interest and cultural context, not operational practice", isCorrect: false, explanation: "Incorrect. Regional schools are operationally significant for practitioner identification, cross-regional learning, teacher engagement, and citation-contextualisation. Per §4.1 'Why this matters operationally': practitioner identification requires both stream + region; cross-regional learning requires regional-context awareness." },
      { id: "D", label: "Regional schools are necessary only for learners planning to engage teachers from specific lineages", isCorrect: false, explanation: "Incorrect. While teacher-engagement is one operational consequence, regional-school awareness matters for ALL learners — including those reading cross-regional sources, interpreting practitioner blogs, understanding citation contexts, and navigating the full four-dimensional organisational landscape." },
    ],
  },
];
