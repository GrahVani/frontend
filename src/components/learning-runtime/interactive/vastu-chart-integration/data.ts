export type ChartKey = "chartA" | "chartB" | "purchaseWindow" | "emotionalHome" | "overclaimSaturn";
export type RegisterKey = "ease" | "mixed" | "friction";
export type KarakaKey = "mars" | "moon" | "saturn";
export type PropertyKey = "quiet" | "active" | "strong";
export type DirectionKey = "east" | "south" | "west" | "northWest" | "north" | "northEast" | "southEast" | "southWest" | "center";
export type AttentionLevel = "light" | "moderate" | "deep";

export interface Option<T extends string> {
  key: T;
  label: string;
  note: string;
}

export interface ChartScenario extends Option<ChartKey> {
  prompt: string;
  fourthHouse: string;
  karakas: Record<KarakaKey, string>;
  propertyContext: PropertyKey;
  defaultRegister: RegisterKey;
  defaultDirection: DirectionKey;
  overclaim: string;
}

export interface DirectionMapItem {
  key: DirectionKey;
  label: string;
  short: string;
  graha: string;
  devata: string;
  context: string;
}

export interface ReadingResult {
  attention: AttentionLevel;
  registerSummary: string;
  directionPriority: string;
  propertyLine: string;
  safeClientLine: string;
  overclaimRefusal: string;
  score: number;
}

export const REGISTERS: Option<RegisterKey>[] = [
  { key: "ease", label: "Residential ease", note: "4H and modifiers mostly support domestic stability." },
  { key: "mixed", label: "Mixed register", note: "Some supports and some stresses must be separated." },
  { key: "friction", label: "Residential friction", note: "Multiple convergent indicators ask for deeper attention." },
];

export const PROPERTY_CONTEXTS: Option<PropertyKey>[] = [
  { key: "quiet", label: "Quiet property layer", note: "2H/4H/11H are not especially activated." },
  { key: "active", label: "Active purchase layer", note: "Property, moving, or acquisition timing is visible." },
  { key: "strong", label: "Strong acquisition layer", note: "2H, 4H, 11H, and timing converge around property." },
];

export const KARAKAS: Option<KarakaKey>[] = [
  { key: "mars", label: "Mars", note: "Building, construction, structure, property action." },
  { key: "moon", label: "Moon", note: "Felt home, nurture, emotional shelter." },
  { key: "saturn", label: "Saturn", note: "Stability, burden, longevity, foundations." },
];

export const DIRECTIONS: DirectionMapItem[] = [
  { key: "east", label: "East", short: "E", graha: "Surya", devata: "Indra", context: "Visibility, sunrise, authority, entry clarity." },
  { key: "south", label: "South", short: "S", graha: "Mangala", devata: "Yama", context: "Heat, restraint, fire discipline, structural courage." },
  { key: "west", label: "West", short: "W", graha: "Sani", devata: "Varuna", context: "Stability, containment, settled weight, long duration." },
  { key: "northWest", label: "Northwest", short: "NW", graha: "Candra", devata: "Vayu", context: "Movement, air, emotional transit, changeable rooms." },
  { key: "north", label: "North", short: "N", graha: "Budha", devata: "Kubera", context: "Trade, calculation, wealth movement, study." },
  { key: "northEast", label: "Northeast", short: "NE", graha: "Guru", devata: "Isana", context: "Blessing, learning, prayer, clarity, water-light purity." },
  { key: "southEast", label: "Southeast", short: "SE", graha: "Sukra", devata: "Agni", context: "Warmth, pleasure, kitchen/fire, sensory harmony." },
  { key: "southWest", label: "Southwest", short: "SW", graha: "Rahu", devata: "Nairrti", context: "Weight, shadow, boundary, caution, heavy storage." },
  { key: "center", label: "Center", short: "C", graha: "Ketu", devata: "Brahma", context: "Open centre, detachment, circulation, sacred emptiness." },
];

export const CHARTS: ChartScenario[] = [
  {
    key: "chartA",
    label: "Chart A: supported 4H",
    note: "Strong 4H, benefic support, active 4H lord.",
    prompt: "4H Cancer; Moon strong; Jupiter aspects 4H; no malefic in 4H.",
    fourthHouse: "Residential register is supported and emotionally coherent.",
    karakas: {
      mars: "Mars is not dominating the residence question.",
      moon: "Moon supports felt shelter and domestic ease.",
      saturn: "Saturn does not impose heavy residential burden.",
    },
    propertyContext: "active",
    defaultRegister: "ease",
    defaultDirection: "northEast",
    overclaim: "Do not say the house is automatically perfect.",
  },
  {
    key: "chartB",
    label: "Chart B: afflicted 4H",
    note: "Saturn 8H weakness, Mars in 4H, Rahu pressure.",
    prompt: "4H Aquarius; 4H lord Saturn debilitated in 8H; Mars occupies 4H.",
    fourthHouse: "The chart register shows sustained residential friction.",
    karakas: {
      mars: "Mars makes construction, conflict, or structural action salient.",
      moon: "Moon must be checked for emotional safety in the dwelling.",
      saturn: "Saturn adds delay, weight, or long-term burden.",
    },
    propertyContext: "quiet",
    defaultRegister: "friction",
    defaultDirection: "west",
    overclaim: "Do not say the chart proves the house is wrong.",
  },
  {
    key: "purchaseWindow",
    label: "Property purchase window",
    note: "2H, 4H, 11H, and dasha timing converge.",
    prompt: "4H lord connects to 11H; 2H lord dasha runs; client is searching for property.",
    fourthHouse: "The chart supports a property-context conversation.",
    karakas: {
      mars: "Mars shows the property action and negotiation layer.",
      moon: "Moon asks whether the home will feel emotionally workable.",
      saturn: "Saturn asks whether the purchase is durable and sustainable.",
    },
    propertyContext: "strong",
    defaultRegister: "mixed",
    defaultDirection: "north",
    overclaim: "Do not approve purchase from chart evidence alone.",
  },
  {
    key: "emotionalHome",
    label: "Home feels unstable",
    note: "Moon is the main modifier, not the building itself.",
    prompt: "Client says the home feels unsettled; 4H is mixed and Moon is afflicted.",
    fourthHouse: "The 4H is not disastrous, but emotional-home quality needs attention.",
    karakas: {
      mars: "Mars is secondary; do not jump to structural remedies.",
      moon: "Moon is the main residential karaka in this case.",
      saturn: "Saturn checks whether routine and stability can restore shelter.",
    },
    propertyContext: "quiet",
    defaultRegister: "mixed",
    defaultDirection: "northWest",
    overclaim: "Do not turn emotional discomfort into a Vastu defect verdict.",
  },
  {
    key: "overclaimSaturn",
    label: "4H Saturn overclaim",
    note: "A partial truth is presented as full causation.",
    prompt: "Client was told 4H Saturn is why the house feels heavy and asks whether to sell.",
    fourthHouse: "Saturn in the residential register is real, but not sufficient cause.",
    karakas: {
      mars: "Mars must be checked before any structural claim is made.",
      moon: "Moon separates emotional heaviness from building causation.",
      saturn: "Saturn contributes weight, duty, delay, or durability.",
    },
    propertyContext: "quiet",
    defaultRegister: "friction",
    defaultDirection: "west",
    overclaim: "Never advise sale on a single chart factor.",
  },
];

export function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

export function findChart(key: ChartKey): ChartScenario {
  return CHARTS.find((item) => item.key === key) ?? CHARTS[0];
}

export function findDirection(key: DirectionKey): DirectionMapItem {
  return DIRECTIONS.find((item) => item.key === key) ?? DIRECTIONS[0];
}

export function evaluateReading(
  chart: ChartScenario,
  register: RegisterKey,
  property: PropertyKey,
  directionKey: DirectionKey,
  selectedKaraka: KarakaKey,
): ReadingResult {
  const registerScore = register === "ease" ? 1 : register === "mixed" ? 2 : 3;
  const propertyScore = property === "quiet" ? 0 : property === "active" ? 1 : 2;
  const karakaScore = selectedKaraka === "saturn" && register === "friction" ? 1 : selectedKaraka === "mars" && property !== "quiet" ? 1 : 0;
  const score = registerScore + propertyScore + karakaScore;
  const attention: AttentionLevel = score >= 5 ? "deep" : score >= 3 ? "moderate" : "light";
  const direction = findDirection(directionKey);

  return {
    attention,
    score,
    registerSummary:
      register === "ease"
        ? "The chart suggests residential ease; keep the reading contextual and avoid declaring the house perfect."
        : register === "mixed"
          ? "The chart shows both support and friction; separate building, emotion, and stability layers."
          : "The chart suggests residential friction; Vastu attention is warranted, but actual building evidence is still required.",
    directionPriority: `${direction.graha} -> ${direction.label}: use this as directional context for ${direction.context.toLowerCase()}`,
    propertyLine:
      property === "quiet"
        ? "Property-purchase timing is not the main issue; read residence quality first."
        : property === "active"
          ? "2H/4H/11H activity supports a property or moving conversation."
          : "Property indicators are strong; still require practical due diligence before action.",
    safeClientLine:
      attention === "deep"
        ? "Your chart asks for deeper residential attention, preferably with actual floor-plan evidence or specialist input."
        : attention === "moderate"
          ? "Your chart gives a useful residential context; start with light, reversible Vastu checks."
          : "Your chart supports a light Vastu lens, not a major residential decision.",
    overclaimRefusal: chart.overclaim,
  };
}
