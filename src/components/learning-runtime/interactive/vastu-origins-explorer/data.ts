export type StageKey = "harappan" | "vedic" | "classical" | "modern";
export type DomainKey = "site" | "layout" | "orientation" | "room" | "sequence";

export interface OriginStage {
  key: StageKey;
  label: string;
  period: string;
  headline: string;
  details: string[];
}

export interface VastuDomain {
  key: DomainKey;
  label: string;
  sanskrit: string;
  question: string;
  explanation: string;
}

export interface CorpusText {
  title: string;
  period: string;
  tradition: string;
  role: string;
}

export const ORIGIN_STAGES: OriginStage[] = [
  {
    key: "harappan",
    label: "Pre-Vedic roots",
    period: "c. 3000-1500 BCE",
    headline: "Urban planning before formal Vastu texts.",
    details: ["Grid-oriented cities", "Cardinal alignment", "Drainage discipline", "Standardised brick proportions"],
  },
  {
    key: "vedic",
    label: "Vedic systematisation",
    period: "c. 1500-500 BCE",
    headline: "Dwelling, ritual, and space enter the Vedic architectural stream.",
    details: ["Atharva Veda references", "Sthapatya Veda framing", "Vastu-puja ritual context", "Sacred site discipline"],
  },
  {
    key: "classical",
    label: "Classical corpus",
    period: "c. 500-1500 CE",
    headline: "Standalone and samhita texts elaborate the discipline.",
    details: ["Brihat Samhita 52-56", "Manasara", "Mayamata", "Vishvakarma Prakasha", "Samarangana Sutradhara"],
  },
  {
    key: "modern",
    label: "Modern calibration",
    period: "1900-present",
    headline: "Classical principles meet apartments, codes, cities, and engineering.",
    details: ["Apartment constraints", "Urban density", "Structural codes", "Best-available Vastu, not perfectionism"],
  },
];

export const VASTU_DOMAINS: VastuDomain[] = [
  {
    key: "site",
    label: "Site-selection",
    sanskrit: "Bhu-pariksha",
    question: "Which land is suitable?",
    explanation: "Evaluate topography, soil, water, neighbouring context, and cardinal orientation.",
  },
  {
    key: "layout",
    label: "Building-layout",
    sanskrit: "Vinyasa",
    question: "How is the building arranged?",
    explanation: "Organise rooms, courts, and structural layout through the Vastu-Purusha-Mandala logic.",
  },
  {
    key: "orientation",
    label: "Spatial-orientation",
    sanskrit: "Dik-vibhaga",
    question: "Which direction governs the axis?",
    explanation: "Read cardinal direction, entrance position, axis alignment, and directional deities.",
  },
  {
    key: "room",
    label: "Room-positioning",
    sanskrit: "Sthana-niyama",
    question: "Where does each function belong?",
    explanation: "Place rooms by mandala zone, direction, deity register, and five-element correspondence.",
  },
  {
    key: "sequence",
    label: "Construction-sequence",
    sanskrit: "Karma-krama",
    question: "When and in what order?",
    explanation: "Coordinate foundation, stages, and griha-pravesha with muhurta discipline.",
  },
];

export const CORPUS: CorpusText[] = [
  { title: "Brihat Samhita 52-56", period: "6th c. CE", tradition: "Samhita", role: "Pre-standalone foundational Vastu attestation." },
  { title: "Manasara", period: "c. 6th c. CE", tradition: "South Indian", role: "Foundational standalone architectural text." },
  { title: "Mayamata", period: "c. 9th c. CE", tradition: "South Indian", role: "Alternative classical housing and iconography text." },
  { title: "Vishvakarma Prakasha", period: "Medieval", tradition: "North Indian", role: "North Indian Vastu reference stream." },
  { title: "Samarangana Sutradhara", period: "11th c. CE", tradition: "Integrative", role: "Bhoja's comprehensive synthesis." },
];

export const MODERN_GUARDS = [
  "Respect structural engineering and building codes.",
  "Use best-available Vastu in apartments and dense cities.",
  "Do not promise perfect compliance in modern constraints.",
  "Distinguish Vastu from Feng Shui unless trained in both.",
];
