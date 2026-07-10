export type OccupationKey = "openCourtyard" | "clearLiving" | "column" | "heavyStorage" | "kitchen" | "toilet" | "plumbingRiser";
export type SeverityKey = "ideal" | "good" | "moderate" | "moderateHigh" | "severe" | "mostSevere";

export interface CentreOccupation {
  key: OccupationKey;
  label: string;
  shortLabel: string;
  severity: SeverityKey;
  zoneEffect: string;
  why: string;
  mitigation: string;
}

export interface AxisNote {
  label: string;
  pair: string;
  elementPair: string;
  role: string;
}

export const CENTRE_OCCUPATIONS: CentreOccupation[] = [
  {
    key: "openCourtyard",
    label: "Open courtyard / Brahmangana",
    shortLabel: "Open",
    severity: "ideal",
    zoneEffect: "Akasha honoured",
    why: "The centre remains open, lit, breathable, and ritually significant. This is the classical unbuilt-centre discipline.",
    mitigation: "Preserve openness; keep the centre clean, bright, uncluttered, and available as the dwelling's breathing space.",
  },
  {
    key: "clearLiving",
    label: "Clear living circulation",
    shortLabel: "Clear",
    severity: "good",
    zoneEffect: "Apartment adaptation",
    why: "A modern apartment may not have a courtyard, but a clean circulation zone preserves the spirit of Akasha.",
    mitigation: "Use light colours, soft lighting, minimal furniture, and a clear walking path through the centre.",
  },
  {
    key: "column",
    label: "Structural column",
    shortLabel: "Column",
    severity: "moderateHigh",
    zoneEffect: "Open-space blocked",
    why: "A column places structural mass in the open Akasha zone. It is not ideal, but it is often unmodifiable.",
    mitigation: "Do not suggest demolition. Keep a clear radius, use light colour, add gentle lighting, and maintain cross-ventilation around it.",
  },
  {
    key: "heavyStorage",
    label: "Heavy storage / large furniture",
    shortLabel: "Storage",
    severity: "moderate",
    zoneEffect: "Modifiable obstruction",
    why: "Heavy storage blocks the centre but can usually be moved. It is less severe than wet or fire functions.",
    mitigation: "Relocate heavy mass toward SW or S; restore the centre as light, clean, and open.",
  },
  {
    key: "kitchen",
    label: "Kitchen / fire equipment",
    shortLabel: "Kitchen",
    severity: "severe",
    zoneEffect: "Agni in Akasha",
    why: "Kitchen heat, appliances, and activity occupy the integrative zone, replacing openness with fire-load.",
    mitigation: "If relocation is impossible, keep the cooking line contained, ventilate strongly toward NW/W, and keep the exact centre clear.",
  },
  {
    key: "toilet",
    label: "Toilet / discharge",
    shortLabel: "Toilet",
    severity: "mostSevere",
    zoneEffect: "Discharge in sacred centre",
    why: "Discharge activity in Brahmasthana combines pollution, water-drainage, and obstruction in the most sacred integrative zone.",
    mitigation: "Prioritise dryness, flawless drainage, ventilation, cleanliness, and relocation if feasible. Name severity clearly without fear language.",
  },
  {
    key: "plumbingRiser",
    label: "Plumbing riser",
    shortLabel: "Riser",
    severity: "moderateHigh",
    zoneEffect: "Fixed service intrusion",
    why: "A fixed service shaft narrows the open centre and carries water/discharge infrastructure through Akasha.",
    mitigation: "Keep surrounding space uncluttered, dry, clean, bright, and well-ventilated; treat the riser as an engineering constraint.",
  },
];

export const AXIS_NOTES: AxisNote[] = [
  {
    label: "Primary axis",
    pair: "SW to NE",
    elementPair: "Prithvi to Jala",
    role: "Head-feet polarity crosses the centre.",
  },
  {
    label: "Secondary axis",
    pair: "SE to NW",
    elementPair: "Agni to Vayu",
    role: "Right-left transactional flow crosses the centre.",
  },
  {
    label: "Centre",
    pair: "Brahmasthana",
    elementPair: "Akasha",
    role: "The open medium that integrates all four corner elements.",
  },
];

export const AKASHA_DISCIPLINE = [
  "Keep the centre open, clean, light, and breathable.",
  "Do not load the exact centre with discharge, fire, heavy storage, or structural mass when avoidable.",
  "In apartments, symbolic openness counts: clear circulation, light colour, gentle illumination, and uncluttered radius.",
  "Respect engineering constraints; mitigate fixed columns or risers without unsafe structural advice.",
];

export function getOccupation(key: OccupationKey): CentreOccupation {
  return CENTRE_OCCUPATIONS.find((item) => item.key === key) ?? CENTRE_OCCUPATIONS[0];
}
