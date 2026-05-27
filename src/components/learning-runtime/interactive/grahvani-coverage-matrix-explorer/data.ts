/**
 * Grahvani Coverage Matrix Explorer — static data.
 *
 * The curriculum's 4-stream × 3-skandha × 7-sub-branch coverage matrix
 * with depth-per-cell assessment per Lesson 1.3.3 §4.1.
 */

export type Depth = "deep" | "moderate" | "light" | "cross-ref" | "na";

export interface CoverageCell {
  stream: string;
  subBranch: string;
  skandha: string;
  depth: Depth;
  modules: string[];
  note: string;
}

export interface NonCoverageItem {
  id: string;
  title: string;
  what: string;
  why: string;
  crossRefs: string[];
}

export const DEPTH_META: Record<Depth, { label: string; color: string; bg: string; desc: string }> = {
  deep: { label: "Deep", color: "#3A8C5A", bg: "rgba(58,140,90,0.12)", desc: "Operational mastery — foundational-text-engagement + practitioner-applicable methodology + cross-stream synthesis" },
  moderate: { label: "Moderate", color: "#9C7A2F", bg: "rgba(232,199,114,0.12)", desc: "Intermediate level — foundational-text basics + selective T1/T2 coverage" },
  light: { label: "Light", color: "#4F6FA8", bg: "rgba(79,111,168,0.10)", desc: "Introductory exposure + cross-references for deeper engagement" },
  "cross-ref": { label: "Cross-ref", color: "#7A5E1E", bg: "rgba(122,94,30,0.10)", desc: "Explicit pointer to external sources — where to go for depth" },
  na: { label: "n/a", color: "#888888", bg: "rgba(120,120,120,0.06)", desc: "No distinctively-stream-specific material exists at this intersection" },
};

export const STREAMS = [
  { slug: "parashari", name: "Parāśari", color: "#C8412E", colorDeep: "#7A2A14" },
  { slug: "jaimini", name: "Jaiminī", color: "#3A8C5A", colorDeep: "#2A6A40" },
  { slug: "kp", name: "KP", color: "#4F6FA8", colorDeep: "#2F4778" },
  { slug: "lal-kitab", name: "Lal Kitab", color: "#7A3E4A", colorDeep: "#5A2E3A" },
] as const;

export const SKANDHAS = [
  { slug: "ganita", name: "Gaṇita", color: "#4F6FA8", colorDeep: "#2F4778" },
  { slug: "hora", name: "Horā", color: "#A23A1E", colorDeep: "#7A2A14" },
  { slug: "samhita", name: "Saṁhitā", color: "#3A8C5A", colorDeep: "#2A6A40" },
] as const;

export const SUBBRANCHES = [
  { slug: "jataka", name: "Jātaka", skandha: "hora" },
  { slug: "prashna", name: "Praśna", skandha: "hora" },
  { slug: "muhurta", name: "Muhūrta", skandha: "hora" },
  { slug: "nimitta", name: "Nimitta", skandha: "samhita" },
  { slug: "ayurveda-jyotisha", name: "Āyurveda-Jyotiṣa", skandha: "cross" },
  { slug: "vastu", name: "Vāstu", skandha: "samhita" },
  { slug: "samhita-detailed", name: "Saṁhitā-Detailed", skandha: "samhita" },
] as const;

export const COVERAGE_CELLS: CoverageCell[] = [
  // Parāśari
  { stream: "Parāśari", subBranch: "Jātaka", skandha: "Horā", depth: "deep", modules: ["T1-04 through T1-15", "T1-16", "T2-01 through T2-13"], note: "Centre-of-gravity coverage — foundational fluency + daśā + yoga + use-case + synthesis" },
  { stream: "Parāśari", subBranch: "Praśna", skandha: "Horā", depth: "moderate", modules: ["T1-19", "T2-20"], note: "Classical Praśna Tantra + Praśna Mārga material" },
  { stream: "Parāśari", subBranch: "Muhūrta", skandha: "Horā", depth: "moderate", modules: ["T1-18", "T2-18"], note: "Muhūrta-Cintāmaṇi + Yogayātrā + BPHS muhūrta material" },
  { stream: "Parāśari", subBranch: "Nimitta", skandha: "Saṁhitā", depth: "moderate", modules: ["T2-19", "T2-21"], note: "Bṛhat Saṁhitā utpāta-darśana sections" },
  { stream: "Parāśari", subBranch: "Āyurveda-Jyotiṣa", skandha: "Cross", depth: "moderate", modules: ["T1-09", "T1-15", "T2-09", "T2-22"], note: "Cross-cutting — cross-reference for full Āyurveda integration" },
  { stream: "Parāśari", subBranch: "Vāstu", skandha: "Saṁhitā", depth: "light", modules: ["T1-22"], note: "Intro — cross-reference for standalone Vāstu specialisation depth" },
  { stream: "Parāśari", subBranch: "Saṁhitā-Detailed", skandha: "Saṁhitā", depth: "moderate", modules: ["T2-21", "T2-19"], note: "Bṛhat Saṁhitā as comprehensive primary" },
  // Jaiminī
  { stream: "Jaiminī", subBranch: "Jātaka", skandha: "Horā", depth: "deep", modules: ["T1-08 WE", "T1-09", "T1-10", "T1-14", "T2-13"], note: "Deep at intro+intermediate — cross-ref for full Jaiminī specialisation (SJC, BVB, Rangacharya)" },
  { stream: "Jaiminī", subBranch: "Praśna", skandha: "Horā", depth: "light", modules: [], note: "No distinctively-Jaiminī praśna" },
  { stream: "Jaiminī", subBranch: "Muhūrta", skandha: "Horā", depth: "light", modules: [], note: "No distinctively-Jaiminī muhūrta" },
  { stream: "Jaiminī", subBranch: "Nimitta", skandha: "Saṁhitā", depth: "na", modules: [], note: "Uses Parāśari saṁhitā foundation" },
  { stream: "Jaiminī", subBranch: "Āyurveda-Jyotiṣa", skandha: "Cross", depth: "light", modules: [], note: "No distinctively-Jaiminī medical-astrology" },
  { stream: "Jaiminī", subBranch: "Vāstu", skandha: "Saṁhitā", depth: "na", modules: [], note: "No distinctively-Jaiminī Vāstu" },
  { stream: "Jaiminī", subBranch: "Saṁhitā-Detailed", skandha: "Saṁhitā", depth: "na", modules: [], note: "Uses Parāśari saṁhitā foundation" },
  // KP
  { stream: "KP", subBranch: "Jātaka", skandha: "Horā", depth: "moderate", modules: ["T1-04", "T1-09", "T2-13"], note: "Sub-lord + CSL intro — cross-ref for full KP depth (KP Reader I-VI; Subramaniam; Hariharan; Tin Win)" },
  { stream: "KP", subBranch: "Praśna", skandha: "Horā", depth: "moderate", modules: ["T1-19", "T2-20"], note: "KP horary 1-249 — cross-ref for full KP horary practitioner training" },
  { stream: "KP", subBranch: "Muhūrta", skandha: "Horā", depth: "light", modules: [], note: "KP muhūrta cross-references" },
  { stream: "KP", subBranch: "Nimitta", skandha: "Saṁhitā", depth: "na", modules: [], note: "Uses standard Parāśari saṁhitā foundation" },
  { stream: "KP", subBranch: "Āyurveda-Jyotiṣa", skandha: "Cross", depth: "light", modules: [], note: "No distinctively-KP medical-astrology" },
  { stream: "KP", subBranch: "Vāstu", skandha: "Saṁhitā", depth: "na", modules: [], note: "No distinctively-KP Vāstu" },
  { stream: "KP", subBranch: "Saṁhitā-Detailed", skandha: "Saṁhitā", depth: "na", modules: [], note: "Uses standard Parāśari saṁhitā foundation" },
  // Lal Kitab
  { stream: "Lal Kitab", subBranch: "Jātaka", skandha: "Horā", depth: "moderate", modules: ["T1-09", "T1-20", "T2-22"], note: "Fixed-house + remedies basics — cross-ref for full Lal Kitab depth (Joshi Urdu; Krishnan Ashant; Beni Madhav Goswami)" },
  { stream: "Lal Kitab", subBranch: "Praśna", skandha: "Horā", depth: "light", modules: [], note: "No distinctively-Lal-Kitab praśna" },
  { stream: "Lal Kitab", subBranch: "Muhūrta", skandha: "Horā", depth: "light", modules: [], note: "No distinctively-Lal-Kitab muhūrta" },
  { stream: "Lal Kitab", subBranch: "Nimitta", skandha: "Saṁhitā", depth: "light", modules: [], note: "Partial omen overlap" },
  { stream: "Lal Kitab", subBranch: "Āyurveda-Jyotiṣa", skandha: "Cross", depth: "moderate", modules: ["T2-22"], note: "Health-and-remedy material with Āyurveda-adjacent framing" },
  { stream: "Lal Kitab", subBranch: "Vāstu", skandha: "Saṁhitā", depth: "light", modules: [], note: "No distinctively-Lal-Kitab Vāstu" },
  { stream: "Lal Kitab", subBranch: "Saṁhitā-Detailed", skandha: "Saṁhitā", depth: "light", modules: [], note: "Some remedial overlap with classical saṁhitā gemology / perfumery / charity" },
];

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
