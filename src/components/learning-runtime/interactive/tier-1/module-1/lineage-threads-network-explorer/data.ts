/**
 * Lineage Threads Network Explorer — static data.
 *
 * Eight major modern lineage threads of contemporary Vedic-astrology practice
 * with founder, regional school, stream emphasis, infrastructure, and methodology
 * per Lesson 1.4.2 §4.2–4.8.
 */

export type Reach = "broad" | "concentrated" | "regional";

export interface StreamEmphasis {
  streamSlug: string;
  streamName: string;
  level: "centre" | "strong" | "moderate" | "light" | "none";
}

export interface SubLineage {
  name: string;
  lead: string;
  note: string;
}

export interface LineageThread {
  slug: string;
  name: string;
  shortName: string;
  color: string;
  colorDeep: string;
  reach: Reach;
  founder: string;
  foundingContext: string;
  regionalSchool: string;
  streamEmphases: StreamEmphasis[];
  teachingInfrastructure: string[];
  distinctiveFeatures: string[];
  crossReferences: string[];
  subLineages?: SubLineage[];
}

export const STREAM_META: Record<string, { name: string; color: string }> = {
  parashari: { name: "Parāśari", color: "#C8412E" },
  jaimini: { name: "Jaiminī", color: "#3A8C5A" },
  kp: { name: "KP", color: "#4F6FA8" },
  "lal-kitab": { name: "Lal Kitab", color: "#7A3E4A" },
};

export const EMPHASIS_META: Record<StreamEmphasis["level"], { label: string; color: string; bg: string }> = {
  centre: { label: "Centre", color: "#3A8C5A", bg: "rgba(58,140,90,0.12)" },
  strong: { label: "Strong", color: "#4F6FA8", bg: "rgba(79,111,168,0.10)" },
  moderate: { label: "Moderate", color: "#9C7A2F", bg: "rgba(232,199,114,0.12)" },
  light: { label: "Light", color: "#7A5E1E", bg: "rgba(122,94,30,0.10)" },
  none: { label: "—", color: "#888888", bg: "rgba(120,120,120,0.06)" },
};

export const LINEAGES: LineageThread[] = [
  {
    slug: "bvb-delhi",
    name: "BVB Delhi",
    shortName: "BVB",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
    reach: "broad",
    founder: "K.N. Rao (faculty lead) within Bharatiya Vidya Bhavan founded by K.M. Munshi (1938)",
    foundingContext: "BVB was founded as a broader Indian-tradition cultural-and-educational institution; its Vedic-astrology faculty became a major modern teaching lineage under K.N. Rao's leadership",
    regionalSchool: "North Indian (Delhi centre)",
    streamEmphases: [
      { streamSlug: "parashari", streamName: "Parāśari", level: "strong" },
      { streamSlug: "jaimini", streamName: "Jaiminī", level: "strong" },
      { streamSlug: "kp", streamName: "KP", level: "light" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", level: "none" },
    ],
    teachingInfrastructure: [
      "Multi-year structured Vedic-astrology programs with substantial student throughput across decades",
      "Faculty including K.N. Rao + multiple second-generation BVB-trained teachers",
      "Indian-context teaching primarily — Hindi/English-medium with substantial Indian student community",
    ],
    distinctiveFeatures: [
      "Major modern Indian-context teaching institution with institutional credibility",
      "Substantial Jaiminī revival emphasis — Predicting through Jaimini's Chara Dasha popularised Cara daśā alongside Vimśottarī",
      "Combines classical Parāśari foundational training with practical predictive analysis + chart-based research support",
      "Substantial empirical-testing tradition within the Indian practitioner community",
    ],
    crossReferences: [
      "BVB Delhi institutional engagement (in-person programs)",
      "K.N. Rao's published corpus — multiple Jaiminī-related works + broader Vedic-astrology material",
      "Second-generation BVB-trained teachers — substantial network of named modern Indian-context authors",
    ],
  },
  {
    slug: "sjc",
    name: "SJC (Sri Jagannath Center)",
    shortName: "SJC",
    color: "#C8412E",
    colorDeep: "#7A2A14",
    reach: "broad",
    founder: "Sanjay Rath (born 1963)",
    foundingContext: "Globally-engaging Vedic-astrology teaching organisation with explicit focus on bringing classical Parāśari + Jaiminī revival to Western practitioner communities while maintaining Indian-context teaching",
    regionalSchool: "Western-Vedic-fusion + North Indian Indian-engagement",
    streamEmphases: [
      { streamSlug: "parashari", streamName: "Parāśari", level: "strong" },
      { streamSlug: "jaimini", streamName: "Jaiminī", level: "strong" },
      { streamSlug: "kp", streamName: "KP", level: "moderate" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", level: "light" },
    ],
    teachingInfrastructure: [
      "PJC (Parāśara Jyotiṣa Course) — structured progressive course in classical Parāśari + Jaiminī revival",
      "SJC branches globally — operational teaching presence in multiple countries",
      "Online programs + in-person workshops + conferences — substantial ongoing student engagement",
      "Sanjay Rath's published corpus — Jaiminī Sūtra translation/commentary (Sagittarius Publications) + Crux of Vedic Astrology",
    ],
    distinctiveFeatures: [
      "Jaiminī revival lineage centre — Jaimini Maharishi's Upadesa Sutras (2015) is the curriculum's default Jaiminī Sūtra recension",
      "Substantial global Western practitioner training via online + in-person programs",
      "Structured multi-level training (PJC) with progressive Jaiminī revival material integration",
      "Cross-references KP and Lal Kitab without deep specialisation in either",
    ],
    crossReferences: [
      "SJC course enrolment (online or in-person)",
      "Sanjay Rath's published corpus — Sagittarius Publications and other publishers",
      "SJC conference attendance (held periodically in various locations)",
    ],
  },
  {
    slug: "kp-lineages",
    name: "KP Teaching Lineages",
    shortName: "KP",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
    reach: "broad",
    founder: "K.S. Krishnamurti (1908–1972)",
    foundingContext: "Multiple parallel sub-lineages developed from Krishnamurti's direct-disciples + second-generation teachers, all emphasising KP-stream material with commentary and methodological extension",
    regionalSchool: "South Indian (Tamil Nadu centre) + global cross-regional reach",
    streamEmphases: [
      { streamSlug: "parashari", streamName: "Parāśari", level: "moderate" },
      { streamSlug: "jaimini", streamName: "Jaiminī", level: "none" },
      { streamSlug: "kp", streamName: "KP", level: "centre" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", level: "none" },
    ],
    teachingInfrastructure: [
      "Tamil Nadu-based foundational infrastructure with Krishnamurti's original direct-disciple lineages continuing",
      "Published commentary corpora across multiple sub-lineages",
      "KP conferences + practitioner gatherings — substantial KP-specific community events",
      "Online KP teaching programs increasingly supplementing in-person teaching",
    ],
    distinctiveFeatures: [
      "Multiple parallel sub-lineages with different commentary traditions — all transmit KP Reader I-VI as foundational corpus",
      "Central to global KP training infrastructure — most KP practitioners trace to Tamil Nadu-rooted lineages",
      "Cross-reference Parāśari for foundational context but maintain KP as centre-of-gravity",
    ],
    crossReferences: [
      "K.S. Krishnamurti's KP Reader I-VI (foundational corpus)",
      "Specific sub-lineage commentary corpora (Subramaniam / Hariharan / Tin Win)",
      "KP practitioner conferences + online practitioner communities",
      "Direct lineage-engagement with specific KP teaching lineages",
    ],
    subLineages: [
      { name: "K.M. Subramaniam school", lead: "K.M. Subramaniam", note: "Influential commentary corpus; Krishnamurti Padhdhati English compilation widely used" },
      { name: "K. Hariharan school", lead: "K. Hariharan", note: "Substantial textbook series via KP Astro Publications; modern KP teaching corpus" },
      { name: "K.S.K. Astro Publications", lead: "KP institutional teaching", note: "Tamil Nadu-rooted publishing + teaching infrastructure" },
      { name: "Tin Win lineage", lead: "Tin Win", note: "Applied KP series; English-medium practitioner-oriented teaching" },
    ],
  },
  {
    slug: "lal-kitab-lineages",
    name: "Lal Kitab Regional Lineages",
    shortName: "Lal Kitab",
    color: "#7A3E4A",
    colorDeep: "#5A2E3A",
    reach: "broad",
    founder: "Pandit Roop Chand Joshi (1898–1982)",
    foundingContext: "Multiple parallel sub-lineages from Joshi's direct-disciples + modern Lal Kitab teachers, all transmitting the Urdu primary corpus with regional-language-medium accessibility extensions",
    regionalSchool: "North Indian (Punjab centre) + diaspora extension",
    streamEmphases: [
      { streamSlug: "parashari", streamName: "Parāśari", level: "moderate" },
      { streamSlug: "jaimini", streamName: "Jaiminī", level: "none" },
      { streamSlug: "kp", streamName: "KP", level: "none" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", level: "centre" },
    ],
    teachingInfrastructure: [
      "Hindi/Urdu/Punjabi-medium teaching primarily — limited English-medium accessibility",
      "Regional practitioner-community embedding — integrated with broader regional practitioner traditions",
      "Joshi's Urdu primary corpus + modern Hindi/English translations as foundational text infrastructure",
    ],
    distinctiveFeatures: [
      "Transmits Joshi's foundational framework: 108 remedies + debt-of-ancestors + andha planet rules + fixed-house framework",
      "Each sub-lineage integrates regional-cultural-religious context into remedial practice",
      "Deeply embedded in Punjabi/North-Indian cultural-religious context; substantial diaspora extension",
    ],
    crossReferences: [
      "Pandit Roop Chand Joshi's Urdu primary 5 volumes (foundational)",
      "Krishnan Ashant Hindi commentary corpus",
      "Beni Madhav Goswami practitioner literature",
      "Direct lineage-engagement with regional Lal Kitab teachers (typically requires Hindi/Punjabi facility)",
    ],
    subLineages: [
      { name: "Krishnan Ashant lineage", lead: "Krishnan Ashant", note: "Modern Hindi commentary on Lal Kitab; substantial Hindi-medium accessibility" },
      { name: "Beni Madhav Goswami lineage", lead: "Beni Madhav Goswami", note: "Practitioner-oriented Hindi corpus; substantial regional practitioner reach" },
      { name: "Regional Punjabi/North-Indian teachers", lead: "Multiple named teachers", note: "Regional teaching distributed across Punjab + adjacent North-Indian regions" },
    ],
  },
  {
    slug: "aivs",
    name: "AIVS (American Institute of Vedic Studies)",
    shortName: "AIVS",
    color: "#3A8C5A",
    colorDeep: "#2A6A40",
    reach: "broad",
    founder: "David Frawley (American-born, India-influenced)",
    foundingContext: "Western-Vedic-fusion teaching organisation integrating Vedic-astrology with broader Vedic-tradition fields",
    regionalSchool: "Western-Vedic-fusion (USA centre)",
    streamEmphases: [
      { streamSlug: "parashari", streamName: "Parāśari", level: "strong" },
      { streamSlug: "jaimini", streamName: "Jaiminī", level: "light" },
      { streamSlug: "kp", streamName: "KP", level: "light" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", level: "none" },
    ],
    teachingInfrastructure: [
      "AIVS course materials covering integrated Vedic-tradition framework",
      "Online + in-person teaching programs with global cross-regional student catchment",
      "David Frawley's extensive published corpus across Vedic-astrology + Āyurveda + Yoga + Vedic philosophy",
    ],
    distinctiveFeatures: [
      "Integrates Vedic-astrology + Āyurveda + Yoga + Vedic philosophy as broader Vedic-tradition teaching framework",
      "Distinctive: astrology is taught within broader Vedic-tradition context rather than as astrology-only specialisation",
      "Explicit accessibility framing for non-Indian-cultural-context learners",
    ],
    crossReferences: [
      "AIVS course enrolment + David Frawley's published corpus",
      "Cross-references to Āyurveda, Yoga, and Vedic philosophy integration materials",
    ],
  },
  {
    slug: "defouw-svoboda",
    name: "Defouw-Svoboda",
    shortName: "Defouw-Sv.",
    color: "#9C7A2F",
    colorDeep: "#7A5E1E",
    reach: "broad",
    founder: "Hart Defouw + Robert Svoboda (both American-born, India-influenced)",
    foundingContext: "Collaborative teaching lineage centred on Light on Life corpus + various courses and workshops",
    regionalSchool: "Western-Vedic-fusion (USA + cross-regional)",
    streamEmphases: [
      { streamSlug: "parashari", streamName: "Parāśari", level: "strong" },
      { streamSlug: "jaimini", streamName: "Jaiminī", level: "moderate" },
      { streamSlug: "kp", streamName: "KP", level: "light" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", level: "none" },
    ],
    teachingInfrastructure: [
      "Light on Life: An Introduction to the Astrology of India (2003, Lotus Press) — widely-used English-medium teaching synthesis",
      "Various courses + workshops across USA and cross-regional teaching reach",
      "Collaborative teaching approach combining Defouw's and Svoboda's respective methodological emphases",
    ],
    distinctiveFeatures: [
      "Light on Life is comparable in scope to a modern-teaching-synthesis curriculum — comprehensive English-medium Parāśari introduction",
      "Centre-of-gravity teaching corpus with cross-stream cross-references",
      "Widely adopted as introductory text in Western-Vedic-fusion teaching contexts",
    ],
    crossReferences: [
      "Light on Life (Lotus Press, 2003)",
      "Defouw + Svoboda courses and workshops",
    ],
  },
  {
    slug: "komilla-sutton",
    name: "Komilla Sutton",
    shortName: "Sutton",
    color: "#7A5E1E",
    colorDeep: "#5A4A0E",
    reach: "concentrated",
    founder: "Komilla Sutton (Indian-born, UK-based)",
    foundingContext: "UK-based Vedic-astrology teaching corpus with European-context practitioner reach",
    regionalSchool: "Western-Vedic-fusion (UK + European centre)",
    streamEmphases: [
      { streamSlug: "parashari", streamName: "Parāśari", level: "strong" },
      { streamSlug: "jaimini", streamName: "Jaiminī", level: "moderate" },
      { streamSlug: "kp", streamName: "KP", level: "light" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", level: "none" },
    ],
    teachingInfrastructure: [
      "UK-based courses and workshops with substantial European practitioner reach",
      "Published corpus covering Parāśari + selective Jaiminī material",
      "Cross-cultural framing specifically adapted for European-context learners",
    ],
    distinctiveFeatures: [
      "UK + European Western-Vedic-fusion centre with distinctive cross-cultural framing",
      "Parāśari + selective Jaiminī emphasis with European accessibility orientation",
      "Substantial practitioner reach within UK and European Vedic-astrology communities",
    ],
    crossReferences: [
      "Komilla Sutton's published corpus",
      "UK-based courses and workshops",
    ],
  },
  {
    slug: "sanskrit-pundit",
    name: "Sanskrit-pundit Regional Lineages",
    shortName: "Sanskrit",
    color: "#888888",
    colorDeep: "#666666",
    reach: "regional",
    founder: "Various — multi-generational pundit families without single named founder",
    foundingContext: "Classical Sanskrit-pundit teaching traditions transmitted through teacher-student succession across generations, predating modern named-founder lineages",
    regionalSchool: "Distributed across all Indian regional schools (South + North + Bengali + Gujarati + Maharashtrian)",
    streamEmphases: [
      { streamSlug: "parashari", streamName: "Parāśari", level: "strong" },
      { streamSlug: "jaimini", streamName: "Jaiminī", level: "moderate" },
      { streamSlug: "kp", streamName: "KP", level: "none" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", level: "none" },
    ],
    teachingInfrastructure: [
      "Direct teacher-student succession — often pundit families with multi-generational continuity",
      "Community-recognised without formal institutional credentialing",
      "Sanskrit-medium engagement primarily with regional-language teaching extensions",
    ],
    distinctiveFeatures: [
      "Differently-structured from the other seven — no single founder + no course-based infrastructure",
      "Substantial Indian-regional practitioner reach; many practitioners trained through pundit lineages",
      "Preserve methodological distinctness that institutional teaching may homogenise",
      "Provide deep classical foundational engagement through direct Sanskrit + classical-pundit tradition",
      "Higher access barriers for cross-regional learners — requires regional-language + Sanskrit fluency + traditional teacher-student protocols",
    ],
    crossReferences: [
      "Direct lineage-engagement with Sanskrit-pundit teachers in specific regional contexts",
      "Requires regional-language + Sanskrit fluency + willingness to engage traditional teacher-student protocols",
      "Various scholarly studies of Indian Sanskrit-pundit teaching traditions across regional contexts",
    ],
  },
];

export const CROSS_CUTTING_PATTERNS = [
  {
    title: "Lineages crossing multiple regional schools",
    examples: [
      "SJC operates globally — Western-Vedic-fusion primary + substantial Indian-context engagement",
      "KP teaching lineages are Tamil Nadu-rooted but reach global practitioners via English-medium teaching",
      "AIVS + Defouw-Svoboda + Komilla Sutton have cross-regional student catchment beyond their primary regional school",
    ],
  },
  {
    title: "Lineages emphasising multiple streams",
    examples: [
      "BVB Delhi teaches Parāśari foundational + substantial Jaiminī revival material",
      "SJC teaches Parāśari + Jaiminī revival (both centre-of-gravity) + cross-references KP and Lal Kitab",
      "KP teaching lineages emphasise KP-stream but cross-reference Parāśari for foundational context",
    ],
  },
  {
    title: "Cross-lineage practitioner mobility",
    examples: [
      "Modern practitioners increasingly combine training across multiple lineages",
      "A practitioner may have foundational training in one lineage, intermediate in another, specialised in a third",
      "Pure single-lineage practitioner identity has become less common as practitioners assemble cross-lineage training",
    ],
  },
];
