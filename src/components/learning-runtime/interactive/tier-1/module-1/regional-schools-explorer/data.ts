/**
 * Regional Schools Explorer — static data.
 *
 * Six major regional schools of Vedic-astrology practice with their
 * geographic, cultural-linguistic, stream-concentration, and practitioner-community
 * dimensions per Lesson 1.4.1 §4.2–4.6.
 */

export type Reach = "broad" | "concentrated";
export type Concentration = "centre" | "strong" | "moderate" | "light" | "none";

export interface StreamConcentration {
  streamSlug: string;
  streamName: string;
  concentration: Concentration;
  note: string;
}

export interface RegionalSchool {
  slug: string;
  name: string;
  shortName: string;
  color: string;
  colorDeep: string;
  reach: Reach;
  geographic: string;
  languages: string[];
  streamConcentrations: StreamConcentration[];
  distinctiveFeatures: string[];
  teachers?: string[];
}

export const STREAM_META: Record<string, { name: string; color: string; colorDeep: string }> = {
  parashari: { name: "Parāśari", color: "#C8412E", colorDeep: "#7A2A14" },
  jaimini: { name: "Jaiminī", color: "#3A8C5A", colorDeep: "#2A6A40" },
  kp: { name: "KP", color: "#4F6FA8", colorDeep: "#2F4778" },
  "lal-kitab": { name: "Lal Kitab", color: "#7A3E4A", colorDeep: "#5A2E3A" },
};

export const CONCENTRATION_META: Record<Concentration, { label: string; color: string; bg: string }> = {
  centre: { label: "Centre", color: "#3A8C5A", bg: "rgba(58,140,90,0.12)" },
  strong: { label: "Strong", color: "#4F6FA8", bg: "rgba(79,111,168,0.10)" },
  moderate: { label: "Moderate", color: "#9C7A2F", bg: "rgba(232,199,114,0.12)" },
  light: { label: "Light", color: "#7A5E1E", bg: "rgba(122,94,30,0.10)" },
  none: { label: "—", color: "#888888", bg: "rgba(120,120,120,0.06)" },
};

export const SCHOOLS: RegionalSchool[] = [
  {
    slug: "south-indian",
    name: "South Indian",
    shortName: "South",
    color: "#C8412E",
    colorDeep: "#7A2A14",
    reach: "broad",
    geographic: "Tamil Nadu · Kerala · Andhra Pradesh · Karnataka",
    languages: ["Tamil", "Malayalam", "Telugu", "Kannada", "Sanskrit", "English"],
    streamConcentrations: [
      { streamSlug: "parashari", streamName: "Parāśari", concentration: "strong", note: "Classical Parāśari across all four states via Sanskrit-pundit lineages" },
      { streamSlug: "jaimini", streamName: "Jaiminī", concentration: "moderate", note: "Selective Jaiminī engagement through classical lineages" },
      { streamSlug: "kp", streamName: "KP", concentration: "centre", note: "Global KP centre — K.S. Krishnamurti was Tamil Nadu-born; KP Reader published Chennai-based" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", concentration: "light", note: "Limited direct Lal Kitab concentration; some cross-references" },
    ],
    distinctiveFeatures: [
      "Deep Sanskrit-pundit traditions with centuries of continuous transmission",
      "Conservative classical-Vedic emphasis — direct primary-text reading, classical-pundit lineage engagement",
      "Global KP practitioner training infrastructure rooted in Tamil Nadu lineages",
      "Praśna Mārga centre globally — Kerala's ~17th c. text grounds praśna practice",
    ],
  },
  {
    slug: "north-indian",
    name: "North Indian",
    shortName: "North",
    color: "#4F6FA8",
    colorDeep: "#2F4778",
    reach: "broad",
    geographic: "Punjab · Delhi · Uttar Pradesh · Bihar · Haryana",
    languages: ["Hindi", "Punjabi", "Urdu", "Sanskrit", "English"],
    streamConcentrations: [
      { streamSlug: "parashari", streamName: "Parāśari", concentration: "strong", note: "Banaras Sanskrit-pundit Parāśari + BVB Delhi institutional teaching" },
      { streamSlug: "jaimini", streamName: "Jaiminī", concentration: "strong", note: "BVB Delhi Jaiminī revival under K.N. Rao + subsequent generations" },
      { streamSlug: "kp", streamName: "KP", concentration: "moderate", note: "KP engagement through cross-regional teaching; not a primary centre" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", concentration: "centre", note: "Global Lal Kitab centre — Pandit Roop Chand Joshi was Punjab-born; Urdu 5-volume primary published pre-Partition Punjab/Lahore" },
    ],
    distinctiveFeatures: [
      "Hindi/Urdu-medium accessibility alongside Sanskrit-classical engagement",
      "Bharatiya Vidya Bhavan (BVB) Delhi — major modern institutional teaching infrastructure",
      "Lal Kitab regional tradition deeply embedded in Punjabi/North-Indian cultural-religious context",
      "Substantial diaspora extension of Punjabi and Delhi teaching lineages",
    ],
  },
  {
    slug: "bengali",
    name: "Bengali",
    shortName: "Bengal",
    color: "#3A8C5A",
    colorDeep: "#2A6A40",
    reach: "concentrated",
    geographic: "West Bengal · Bangladesh · Bengali-diaspora",
    languages: ["Bengali", "Sanskrit", "English"],
    streamConcentrations: [
      { streamSlug: "parashari", streamName: "Parāśari", concentration: "strong", note: "Classical Parāśari with Bengali-language emphasis" },
      { streamSlug: "jaimini", streamName: "Jaiminī", concentration: "moderate", note: "Selective Jaiminī engagement" },
      { streamSlug: "kp", streamName: "KP", concentration: "light", note: "Limited KP concentration" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", concentration: "none", note: "No distinctive Lal Kitab concentration" },
    ],
    distinctiveFeatures: [
      "Distinctive Bengali cultural-religious framing within broader Hindu tradition",
      "Pre-Partition continuity in some lineages extending across West Bengal and Bangladesh",
      "Bengali-medium classical-text translations and commentaries",
      "Smaller global reach — regionally-concentrated practitioner community",
    ],
  },
  {
    slug: "gujarati",
    name: "Gujarati",
    shortName: "Gujarat",
    color: "#9C7A2F",
    colorDeep: "#7A5E1E",
    reach: "concentrated",
    geographic: "Gujarat · Mumbai · Gujarati-diaspora",
    languages: ["Gujarati", "Sanskrit", "English"],
    streamConcentrations: [
      { streamSlug: "parashari", streamName: "Parāśari", concentration: "strong", note: "Classical Parāśari with commercial-astrology orientation" },
      { streamSlug: "jaimini", streamName: "Jaiminī", concentration: "light", note: "Limited Jaiminī engagement" },
      { streamSlug: "kp", streamName: "KP", concentration: "light", note: "Limited KP concentration" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", concentration: "none", note: "No distinctive Lal Kitab concentration" },
    ],
    distinctiveFeatures: [
      "Substantial commercial-astrology integration — paid consultation as primary practitioner activity",
      "Mumbai as a major commercial-astrology centre with Gujarati lineage influence",
      "Gujarati-medium teaching foundations and classical-text translations",
      "Smaller global reach — regionally-concentrated with diaspora extension",
    ],
  },
  {
    slug: "maharashtrian",
    name: "Maharashtrian",
    shortName: "Maharashtra",
    color: "#7A3E4A",
    colorDeep: "#5A2E3A",
    reach: "concentrated",
    geographic: "Maharashtra · Goa · Marathi-diaspora",
    languages: ["Marathi", "Sanskrit", "English"],
    streamConcentrations: [
      { streamSlug: "parashari", streamName: "Parāśari", concentration: "strong", note: "Classical Parāśari with Pune Sanskrit-pundit emphasis" },
      { streamSlug: "jaimini", streamName: "Jaiminī", concentration: "light", note: "Limited Jaiminī engagement" },
      { streamSlug: "kp", streamName: "KP", concentration: "light", note: "Limited KP concentration" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", concentration: "none", note: "No distinctive Lal Kitab concentration" },
    ],
    distinctiveFeatures: [
      "Pune as a major Sanskrit + Marathi pundit centre",
      "Marathi-medium teaching foundations and classical-text translations",
      "Substantial Sanskrit-pundit transmission alongside Marathi-medium accessibility",
      "Smaller global reach — regionally-concentrated practitioner community",
    ],
  },
  {
    slug: "western-vedic-fusion",
    name: "Western-Vedic-fusion",
    shortName: "Western",
    color: "#7A5E1E",
    colorDeep: "#5A4A0E",
    reach: "broad",
    geographic: "USA · UK · Europe · Australia · non-Indian-diaspora globally",
    languages: ["English", "selective Sanskrit"],
    streamConcentrations: [
      { streamSlug: "parashari", streamName: "Parāśari", concentration: "strong", note: "Classical Parāśari as foundational emphasis across all teachers" },
      { streamSlug: "jaimini", streamName: "Jaiminī", concentration: "strong", note: "Jaiminī revival emphasis via Sanjay Rath SJC + K.N. Rao BVB-influence reaching Western practitioners" },
      { streamSlug: "kp", streamName: "KP", concentration: "moderate", note: "Selective KP cross-references; full KP depth requires Tamil Nadu-rooted engagement" },
      { streamSlug: "lal-kitab", streamName: "Lal Kitab", concentration: "light", note: "Limited deep Lal Kitab engagement due to cultural-translation barriers; cross-references without specialisation" },
    ],
    distinctiveFeatures: [
      "English-medium teaching with explicit accessibility for non-Indian-cultural-context practitioners",
      "Often combined with broader Vedic-tradition fields — Āyurveda, Yoga, Vedic philosophy, Tantra",
      "Cross-cultural translation work alongside doctrinal teaching",
      "Uniquely modern-globalisation-driven reach across non-Indian-diaspora contexts",
    ],
    teachers: ["Sanjay Rath (SJC)", "David Frawley (AIVS)", "Hart Defouw & Robert Svoboda", "Komilla Sutton", "Ronnie Gale Dreyer", "James Braha", "Dennis Harness", "Marc Boney"],
  },
];

export const CROSS_STREAM_PATTERNS = [
  { stream: "Lal Kitab", school: "North Indian (Punjab)", type: "centre" as const },
  { stream: "KP", school: "South Indian (Tamil Nadu)", type: "centre" as const },
  { stream: "Praśna Mārga", school: "South Indian (Kerala)", type: "centre" as const },
  { stream: "Jaiminī revival", school: "Western-Vedic-fusion + BVB Delhi", type: "strong" as const },
  { stream: "Classical Parāśari", school: "All six regional schools", type: "strong" as const },
];

export const GLOBALISATION_CONNECTIONS = [
  { from: "Sanjay Rath SJC", to: "Global (USA/UK/Europe/Australia)", note: "Online + in-person programs across multiple countries annually" },
  { from: "K.N. Rao BVB Delhi", to: "Pan-India + Western cross-regional", note: "Digital extensions + translation reaching Western practitioners" },
  { from: "Tamil Nadu KP teachers", to: "Global English-medium students", note: "English-medium online KP teaching reaching non-Tamil learners worldwide" },
  { from: "Punjabi Lal Kitab teachers", to: "Global Hindi/English students", note: "Online Lal Kitab teaching crossing regional and linguistic boundaries" },
  { from: "Western-Vedic-fusion teachers", to: "India (direct lineage engagement)", note: "Western teachers visiting India for direct Sanskrit-pundit + institutional lineage engagement" },
];
