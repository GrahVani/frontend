export type RequestKey = "wedding" | "houseEntry" | "birth" | "outcomeQuestion" | "transitConcern" | "dailyRoutine";
export type DisciplineKey = "muhurta" | "prashna" | "jataka" | "gocara";

export interface Option<T extends string> {
  key: T;
  label: string;
  note: string;
}

export interface RequestCase extends Option<RequestKey> {
  canShift: boolean;
  futureInitiation: boolean;
  correctDiscipline: DisciplineKey;
  actionType: string;
  guidance: string;
}

export interface Discipline extends Option<DisciplineKey> {
  premise: string;
  timeRelation: string;
}

export interface ScopeResult {
  accepted: boolean;
  title: string;
  scopeLine: string;
  honestLine: string;
}

export const DISCIPLINES: Discipline[] = [
  {
    key: "muhurta",
    label: "Muhūrta",
    note: "Selects an auspicious future time for an action the client will initiate.",
    premise: "agentive future timing",
    timeRelation: "future selectable time",
  },
  {
    key: "prashna",
    label: "Praśna",
    note: "Answers a question from the moment the question is asked.",
    premise: "reactive question chart",
    timeRelation: "question moment",
  },
  {
    key: "jataka",
    label: "Jātaka",
    note: "Interprets a birth chart or fixed event chart that was not selected.",
    premise: "fixed birth/event chart",
    timeRelation: "already fixed time",
  },
  {
    key: "gocara",
    label: "Gocara",
    note: "Reads unfolding planetary motion against a natal chart.",
    premise: "transit movement",
    timeRelation: "ongoing planetary time",
  },
];

export const REQUESTS: RequestCase[] = [
  {
    key: "wedding",
    label: "Wedding date",
    note: "Family has six workable dates next October.",
    canShift: true,
    futureInitiation: true,
    correctDiscipline: "muhurta",
    actionType: "marriage initiation",
    guidance: "A canonical muhūrta question: future, agentive, and candidate windows exist.",
  },
  {
    key: "houseEntry",
    label: "Gṛha-praveśa",
    note: "House entry can be scheduled within a few days.",
    canShift: true,
    futureInitiation: true,
    correctDiscipline: "muhurta",
    actionType: "house-entry initiation",
    guidance: "Appropriate for muhūrta because the action can be initiated at a selected time.",
  },
  {
    key: "birth",
    label: "Birth interpretation",
    note: "Client asks what a child’s birth time means.",
    canShift: false,
    futureInitiation: false,
    correctDiscipline: "jataka",
    actionType: "fixed birth chart",
    guidance: "This is jātaka-domain, not muhūrta selection.",
  },
  {
    key: "outcomeQuestion",
    label: "Should we proceed?",
    note: "Client asks whether the engagement will succeed.",
    canShift: false,
    futureInitiation: false,
    correctDiscipline: "prashna",
    actionType: "outcome question",
    guidance: "This is a praśna-style question unless reframed as selecting from candidate dates.",
  },
  {
    key: "transitConcern",
    label: "Saturn transit worry",
    note: "Client asks what Saturn’s current transit means.",
    canShift: false,
    futureInitiation: false,
    correctDiscipline: "gocara",
    actionType: "transit reading",
    guidance: "This belongs to gocara, not electional timing.",
  },
  {
    key: "dailyRoutine",
    label: "Everyday errand",
    note: "Client wants a muhūrta for buying groceries.",
    canShift: true,
    futureInitiation: true,
    correctDiscipline: "muhurta",
    actionType: "low-stakes routine",
    guidance: "Technically time-shiftable, but the time-cost usually exceeds the benefit.",
  },
];

export interface MuhurtaUnit {
  index: number;
  label: string;
  range: string;
  dayHalf: "Day half" | "Night half";
  name: string;
  nameDevanagari: string;
  quality: "auspicious" | "inauspicious" | "highly-auspicious";
  deity: string;
}

const MUHURTHA_METADATA: { name: string; nameDevanagari: string; quality: "auspicious" | "inauspicious" | "highly-auspicious"; deity: string }[] = [
  { name: "Rudra", nameDevanagari: "रुद्र", quality: "inauspicious", deity: "Rudra (Destroyer Form of Śiva)" },
  { name: "Ahi", nameDevanagari: "अहि", quality: "inauspicious", deity: "Ahi (Serpent of the Depths)" },
  { name: "Mitra", nameDevanagari: "मित्र", quality: "auspicious", deity: "Mitra (Sun God of Friendship)" },
  { name: "Pitri", nameDevanagari: "पितृ", quality: "inauspicious", deity: "Pitris (Ancestral Spirits)" },
  { name: "Vasu", nameDevanagari: "वसु", quality: "auspicious", deity: "Vasus (Elemental Gods)" },
  { name: "Varāha", nameDevanagari: "वराह", quality: "auspicious", deity: "Varāha (Vishnu's Boar Incarnation)" },
  { name: "Viśvedeva", nameDevanagari: "विश्वेदेव", quality: "auspicious", deity: "Viśvedevas (Universal Pantheon)" },
  { name: "Vidhi", nameDevanagari: "विधि", quality: "auspicious", deity: "Vidhi (Brahma the Creator)" },
  { name: "Śatamukhi", nameDevanagari: "शतमुखी", quality: "auspicious", deity: "Śatamukhī (Hundred-faced Goddess)" },
  { name: "Puruhūta", nameDevanagari: "पुरुहूत", quality: "auspicious", deity: "Puruhūta (Indra, King of Gods)" },
  { name: "Vāhini", nameDevanagari: "वाहिनी", quality: "inauspicious", deity: "Vāhini (Agni's Fierce Energy)" },
  { name: "Naktamcara", nameDevanagari: "नक्तञ्चर", quality: "inauspicious", deity: "Naktamcara (Nocturnal Spirits)" },
  { name: "Varuṇa", nameDevanagari: "वरुण", quality: "auspicious", deity: "Varuṇa (Lord of Oceans)" },
  { name: "Aryaman", nameDevanagari: "अर्यमन्", quality: "auspicious", deity: "Aryaman (God of Chivalry)" },
  { name: "Bhaga", nameDevanagari: "भग", quality: "auspicious", deity: "Bhaga (God of Fortune)" },
  { name: "Girīśa", nameDevanagari: "गिरीश", quality: "inauspicious", deity: "Girīśa (Lord Shiva of Mountains)" },
  { name: "Ajapāda", nameDevanagari: "अजपाद", quality: "inauspicious", deity: "Aja Ekapāda (One-footed Storm Goat)" },
  { name: "Ahirbudhnya", nameDevanagari: "अहिर्बुध्न्य", quality: "auspicious", deity: "Ahirbudhnya (Serpent of foundations)" },
  { name: "Puṣya", nameDevanagari: "पुष्य", quality: "auspicious", deity: "Puṣya (Auspicious Nurturing Star)" },
  { name: "Aśvinī", nameDevanagari: "अश्विनी", quality: "auspicious", deity: "Aśvinī Kumāras (Divine Physicians)" },
  { name: "Yama", nameDevanagari: "यम", quality: "inauspicious", deity: "Yama (God of Death and Justice)" },
  { name: "Agni", nameDevanagari: "अग्नि", quality: "auspicious", deity: "Agni (Sacred Fire God)" },
  { name: "Vidhātrī", nameDevanagari: "विधात्री", quality: "auspicious", deity: "Vidhātrī (Supreme Mother Force)" },
  { name: "Kaṇḍa", nameDevanagari: "कण्ड", quality: "auspicious", deity: "Kaṇḍa (Chandra, God of Nectar)" },
  { name: "Aditi", nameDevanagari: "अदिति", quality: "auspicious", deity: "Aditi (Boundless Universal Mother)" },
  { name: "Jīva/Amṛta", nameDevanagari: "जीव/अमृत", quality: "auspicious", deity: "Brihaspati (Teacher of Gods)" },
  { name: "Viṣṇu", nameDevanagari: "विष्णु", quality: "auspicious", deity: "Viṣṇu (Preserver of Cosmos)" },
  { name: "Dyumaṇi", nameDevanagari: "द्युमणि", quality: "auspicious", deity: "Dyumaṇi (Surya, sky jewel)" },
  { name: "Brahma", nameDevanagari: "ब्रह्म", quality: "highly-auspicious", deity: "Brahma (Infinite Creator)" },
  { name: "Samudram", nameDevanagari: "समुद्रम्", quality: "inauspicious", deity: "Samudra (Lord of Ocean Depths)" },
];

export const MUHURTA_UNITS: MuhurtaUnit[] = Array.from({ length: 30 }, (_, index) => {
  const startMinutes = index * 48;
  const hours = Math.floor(startMinutes / 60);
  const minutes = startMinutes % 60;
  const endMinutes = startMinutes + 48;
  const endHours = Math.floor(endMinutes / 60) % 24;
  const endMins = endMinutes % 60;
  const pad = (value: number) => value.toString().padStart(2, "0");

  const meta = MUHURTHA_METADATA[index];

  return {
    index: index + 1,
    label: `M${index + 1}`,
    range: `${pad(hours)}:${pad(minutes)}-${pad(endHours)}:${pad(endMins)}`,
    dayHalf: index < 15 ? "Day half" : "Night half",
    name: meta.name,
    nameDevanagari: meta.nameDevanagari,
    quality: meta.quality,
    deity: meta.deity,
  };
});

export function findOption<T extends string>(items: Option<T>[], key: T): Option<T> {
  return items.find((item) => item.key === key) ?? items[0];
}

export function findRequest(key: RequestKey): RequestCase {
  return REQUESTS.find((item) => item.key === key) ?? REQUESTS[0];
}

export function findDiscipline(key: DisciplineKey): Discipline {
  return DISCIPLINES.find((item) => item.key === key) ?? DISCIPLINES[0];
}

export function evaluateScope(request: RequestCase): ScopeResult {
  if (request.key === "dailyRoutine") {
    return {
      accepted: false,
      title: "Do not over-use muhūrta",
      scopeLine: "This is time-shiftable, but too low-stakes for full electional work.",
      honestLine: "Use common-sense timing unless a meaningful initiation is involved.",
    };
  }

  if (request.correctDiscipline !== "muhurta") {
    const discipline = findDiscipline(request.correctDiscipline);
    return {
      accepted: false,
      title: `Reclassify as ${discipline.label}`,
      scopeLine: request.guidance,
      honestLine: "Muhūrta selects a future initiation time; it does not answer every time-related question.",
    };
  }

  return {
    accepted: true,
    title: "Valid muhūrta question",
    scopeLine: request.guidance,
    honestLine: "Select the best available window; do not promise the outcome is guaranteed.",
  };
}
