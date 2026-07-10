export type VastuTextKey = "brihat" | "manasara" | "mayamata" | "vishvakarma" | "samarangana";
export type LayerKey = "vedic" | "classical" | "puranic";
export type RegionKey = "panIndian" | "south" | "north" | "integrative";

export interface VastuText {
  key: VastuTextKey;
  title: string;
  shortTitle: string;
  date: string;
  region: RegionKey;
  structure: string;
  access: string;
  priority: number;
  role: string;
  distinctive: string[];
  color: string;
}

export interface TextLayer {
  key: LayerKey;
  label: string;
  authority: string;
  purpose: string;
  examples: string;
  color: string;
}

export const VASTU_TEXTS: VastuText[] = [
  {
    key: "brihat",
    title: "Brihat Samhita",
    shortTitle: "Brihat",
    date: "6th c. CE",
    region: "panIndian",
    structure: "Adhyaya 52-56",
    access: "Most accessible first entry through Bhat translation.",
    priority: 1,
    role: "Pan-Indian Samhita foundation before stand-alone regional specialization.",
    distinctive: [
      "Concise five-chapter Vastu framework",
      "Mandala, elements, building types, and muhurta connection",
      "Best conceptual map before longer treatises",
    ],
    color: "#9C7A2F",
  },
  {
    key: "manasara",
    title: "Manasara",
    shortTitle: "Manasara",
    date: "c. 6th c. CE",
    region: "south",
    structure: "70 chapters",
    access: "Demanding multi-volume Acharya translation.",
    priority: 2,
    role: "South-Indian foundational stand-alone Vastu treatise.",
    distinctive: [
      "Most comprehensive chapter count",
      "32 mandala-variant catalogue",
      "Strong temple, iconography, and construction detail",
    ],
    color: "#2F7D52",
  },
  {
    key: "mayamata",
    title: "Mayamata",
    shortTitle: "Mayamata",
    date: "c. 9th c. CE",
    region: "south",
    structure: "36 chapters",
    access: "Dagens translation is rigorous, illustrated, and easier than Manasara.",
    priority: 3,
    role: "South-Indian alternative classical tradition for triangulation.",
    distinctive: [
      "Compact but deep South-Indian reference",
      "Clear mandala treatment",
      "Useful comparison partner to Manasara",
    ],
    color: "#356C96",
  },
  {
    key: "samarangana",
    title: "Samarangana-Sutradhara",
    shortTitle: "Samarangana",
    date: "11th c. CE",
    region: "integrative",
    structure: "83 chapters",
    access: "Major integrative work; best after the core map is stable.",
    priority: 4,
    role: "Bhoja's comprehensive treatment integrating several architectural concerns.",
    distinctive: [
      "Verified royal authorship context",
      "Large integrative architecture corpus",
      "Includes unusual yantra and mechanical-device material",
    ],
    color: "#6D4C8D",
  },
  {
    key: "vishvakarma",
    title: "Vishvakarma-Prakasha",
    shortTitle: "Vishvakarma",
    date: "Medieval",
    region: "north",
    structure: "Multiple recensions",
    access: "Region-specific and less internationally accessible.",
    priority: 5,
    role: "North-Indian regional-tradition reference.",
    distinctive: [
      "Important for Hindi-belt and related practitioner lineages",
      "Secondary details may differ from South-Indian texts",
      "Use with explicit regional attribution",
    ],
    color: "#A23A1E",
  },
];

export const TEXT_LAYERS: TextLayer[] = [
  {
    key: "vedic",
    label: "Vedic attestation",
    authority: "Foundational authority",
    purpose: "Grounds Vastu as a Vedic-tradition discipline, but does not supply most operational detail.",
    examples: "Atharva Veda Vastu-Sukta, Sthapatya Veda",
    color: "#9C7A2F",
  },
  {
    key: "classical",
    label: "Classical corpus",
    authority: "Operational framework",
    purpose: "The practitioner's working corpus: grid variants, deity assignments, element mapping, construction rules.",
    examples: "Brihat Samhita, Manasara, Mayamata, Vishvakarma-Prakasha, Samarangana-Sutradhara",
    color: "#2F7D52",
  },
  {
    key: "puranic",
    label: "Puranic attestation",
    authority: "Narrative substrate",
    purpose: "Supplies the Vastu-Purusha story that makes the grid functional rather than decorative.",
    examples: "Matsya Purana 252-253 and related Vastu narratives",
    color: "#356C96",
  },
];

export const REGION_LABELS: Record<RegionKey, string> = {
  panIndian: "Pan-Indian",
  south: "South-Indian",
  north: "North-Indian",
  integrative: "Integrative",
};

export const SEQUENCE_NOTES = [
  "Start with Brihat Samhita for the compact conceptual map.",
  "Use Manasara for South-Indian depth after the map is stable.",
  "Triangulate Mayamata against Manasara.",
  "Read Samarangana-Sutradhara for integrative breadth.",
  "Use Vishvakarma-Prakasha when North-Indian lineage detail is needed.",
];

export function getText(key: VastuTextKey): VastuText {
  return VASTU_TEXTS.find((text) => text.key === key) ?? VASTU_TEXTS[0];
}

export function getLayer(key: LayerKey): TextLayer {
  return TEXT_LAYERS.find((layer) => layer.key === key) ?? TEXT_LAYERS[1];
}
