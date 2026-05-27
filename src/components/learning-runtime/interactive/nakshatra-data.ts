export interface NakshatraData {
  num: number;
  name: string;
  devanagari: string;
  ruler: string;
  rulerKey: string;
  deity: string;
  symbol: string;
  yoni: string;
  gana: "deva" | "manuṣya" | "rākṣasa";
  taraGroup: number;
  taraName: string;
  meaning: string;
  syllables: [string, string, string, string];
}

export const NAKSHATRAS: NakshatraData[] = [
  { num: 1,  name: "Aśvinī",        devanagari: "अश्विनी",        ruler: "Ketu",   rulerKey: "ketu",   deity: "Aśvinī Kumāra",   symbol: "Horse head",     yoni: "Horse",      gana: "deva",     taraGroup: 1, taraName: "Janma",        meaning: "The Horsemen — speed, healing, initiation", syllables: ["Chu", "Che", "Cho", "La"] },
  { num: 2,  name: "Bharaṇī",       devanagari: "भरणी",          ruler: "Venus",  rulerKey: "venus",  deity: "Yama",              symbol: "Vulva / Bearing", yoni: "Male Elephant", gana: "manuṣya",  taraGroup: 2, taraName: "Sampat",       meaning: "The Bearer — destruction & renewal, restraint", syllables: ["Li", "Lu", "Le", "Lo"] },
  { num: 3,  name: "Kṛttikā",       devanagari: "कृत्तिका",      ruler: "Sun",    rulerKey: "sun",    deity: "Agni",              symbol: "Razor / Flame",   yoni: "Female Sheep",  gana: "rākṣasa",  taraGroup: 3, taraName: "Vipat",        meaning: "The Cutters — fiery purification, criticism", syllables: ["A", "I", "U", "E"] },
  { num: 4,  name: "Rohiṇī",        devanagari: "रोहिणी",         ruler: "Moon",   rulerKey: "moon",   deity: "Brahmā / Prajāpati", symbol: "Chariot / Ox cart", yoni: "Male Serpent", gana: "manuṣya",  taraGroup: 4, taraName: "Kṣema",        meaning: "The Red One — growth, fertility, beauty", syllables: ["O", "Va", "Vi", "Vu"] },
  { num: 5,  name: "Mṛgaśīrṣa",     devanagari: "मृगशीर्षा",     ruler: "Mars",   rulerKey: "mars",   deity: "Soma",              symbol: "Deer head",       yoni: "Female Serpent", gana: "deva",   taraGroup: 5, taraName: "Pratyak",      meaning: "The Deer Head — searching, curiosity, nourishment", syllables: ["Ve", "Vo", "Ka", "Ki"] },
  { num: 6,  name: "Ārdrā",         devanagari: "आर्द्रा",        ruler: "Rahu",   rulerKey: "rahu",   deity: "Rudra",             symbol: "Teardrop / Diamond", yoni: "Female Dog", gana: "manuṣya",  taraGroup: 6, taraName: "Sādhana",      meaning: "The Moist One — storms, emotion, transformation", syllables: ["Ku", "Gha", "ṅga", "Jha"] },
  { num: 7,  name: "Punarvasu",     devanagari: "पुनर्वसु",      ruler: "Jupiter",rulerKey: "jupiter",deity: "Aditi",             symbol: "Quiver of arrows", yoni: "Female Cat", gana: "deva",     taraGroup: 7, taraName: "Naidhana",     meaning: "Return of the Light — renewal, abundance, safety", syllables: ["Ke", "Ko", "Ha", "Hi"] },
  { num: 8,  name: "Puṣya",         devanagari: "पुष्य",           ruler: "Saturn", rulerKey: "saturn", deity: "Bṛhaspati",         symbol: "Flower / Circle", yoni: "Male Sheep", gana: "deva",     taraGroup: 8, taraName: "Mitra",        meaning: "The Nourisher — teaching, expansion, prosperity", syllables: ["Hu", "He", "Ho", "Ḍa"] },
  { num: 9,  name: "Āśleṣā",        devanagari: "आश्लेषा",        ruler: "Mercury",rulerKey: "mercury",deity: "Nāga / Serpents",   symbol: "Coiled serpent",  yoni: "Male Cat", gana: "rākṣasa",  taraGroup: 9, taraName: "Parama Mitra", meaning: "The Embrace — entanglement, deception, depth", syllables: ["Ḍi", "Ḍu", "Ḍe", "Ḍo"] },
  { num: 10, name: "Maghā",         devanagari: "मघा",            ruler: "Ketu",   rulerKey: "ketu",   deity: "Pitṛ",              symbol: "Royal throne",    yoni: "Male Rat", gana: "rākṣasa",  taraGroup: 1, taraName: "Janma",        meaning: "The Mighty — ancestral power, tradition, pride", syllables: ["Ma", "Mi", "Mu", "Me"] },
  { num: 11, name: "Pūrva Phālguṇī",devanagari: "पूर्व फाल्गुनी", ruler: "Venus",  rulerKey: "venus",  deity: "Bhaga",             symbol: "Front legs of bed", yoni: "Female Rat", gana: "manuṣya",  taraGroup: 2, taraName: "Sampat",       meaning: "The Former Red One — pleasure, union, creativity", syllables: ["Mo", "Ṭa", "Ṭi", "Ṭu"] },
  { num: 12, name: "Uttara Phālguṇī",devanagari:"उत्तर फाल्गुनी",ruler: "Sun",    rulerKey: "sun",    deity: "Aryaman",           symbol: "Back legs of bed", yoni: "Male Cow", gana: "manuṣya",  taraGroup: 3, taraName: "Vipat",        meaning: "The Latter Red One — contracts, kindness, patronage", syllables: ["Ṭe", "Ṭo", "Pā", "Pi"] },
  { num: 13, name: "Hasta",         devanagari: "हस्त",            ruler: "Moon",   rulerKey: "moon",   deity: "Savitar / Sūrya",   symbol: "Closed hand / Fist", yoni: "Female Buffalo", gana: "deva", taraGroup: 4, taraName: "Kṣema",        meaning: "The Hand — skill, craftsmanship, dexterity", syllables: ["Pu", "Sha", "Na", "Tha"] },
  { num: 14, name: "Chitrā",        devanagari: "चित्रा",          ruler: "Mars",   rulerKey: "mars",   deity: "Tvaṣṭṛ",            symbol: "Shining jewel",   yoni: "Female Tiger", gana: "rākṣasa",  taraGroup: 5, taraName: "Pratyak",      meaning: "The Brilliant — art, illusion, shining glory", syllables: ["Pē", "Pō", "Rā", "Ri"] },
  { num: 15, name: "Svātī",         devanagari: "स्वाती",          ruler: "Rahu",   rulerKey: "rahu",   deity: "Vāyu",              symbol: "Coral / Sapphire", yoni: "Male Buffalo", gana: "deva",   taraGroup: 6, taraName: "Sādhana",      meaning: "The Independent — autonomy, flexibility, trade", syllables: ["Ru", "Re", "Ro", "Ta"] },
  { num: 16, name: "Viśākhā",       devanagari: "विशाखा",         ruler: "Jupiter",rulerKey: "jupiter",deity: "Indrāgni",          symbol: "Triumphant arch", yoni: "Male Tiger", gana: "rākṣasa",  taraGroup: 7, taraName: "Naidhana",     meaning: "Forked Branch — ambition, conquest, divided purpose", syllables: ["Ti", "Tu", "Te", "To"] },
  { num: 17, name: "Anurādhā",      devanagari: "अनुराधा",        ruler: "Saturn", rulerKey: "saturn", deity: "Mitra",             symbol: "Arch / Lotus arch", yoni: "Female Deer", gana: "deva",    taraGroup: 8, taraName: "Mitra",        meaning: "Following Rādhā — devotion, friendship, cooperation", syllables: ["Na", "Ni", "Nu", "Ne"] },
  { num: 18, name: "Jyeṣṭhā",       devanagari: "ज्येष्ठा",        ruler: "Mercury",rulerKey: "mercury",deity: "Indra",             symbol: "Earring / Umbrella", yoni: "Male Hare", gana: "rākṣasa",  taraGroup: 9, taraName: "Parama Mitra", meaning: "The Eldest — seniority, protection, occult power", syllables: ["No", "Ya", "Yi", "Yu"] },
  { num: 19, name: "Mūla",          devanagari: "मूल",             ruler: "Ketu",   rulerKey: "ketu",   deity: "Nirṛti",            symbol: "Tied roots / Bunch", yoni: "Male Dog", gana: "rākṣasa",  taraGroup: 1, taraName: "Janma",        meaning: "The Root — destruction, uprooting, foundation", syllables: ["Ye", "Yo", "Bha", "Bhi"] },
  { num: 20, name: "Pūrva Aṣāḍhā",  devanagari: "पूर्वाषाढा",     ruler: "Venus",  rulerKey: "venus",  deity: "Āpaḥ / Waters",     symbol: "Elephant tusk / Bed", yoni: "Male Monkey", gana: "manuṣya", taraGroup: 2, taraName: "Sampat",       meaning: "The Former Unconquered — victory, invigoration", syllables: ["Bhu", "Dha", "Bha", "Ḍa"] },
  { num: 21, name: "Uttara Aṣāḍhā", devanagari: "उत्तराषाढा",    ruler: "Sun",    rulerKey: "sun",    deity: "Viśvedevā",         symbol: "Elephant tusk / Stool", yoni: "Male Mongoose", gana: "manuṣya", taraGroup: 3, taraName: "Vipat",        meaning: "The Latter Unconquered — enduring victory, fame", syllables: ["Bhe", "Bho", "Ja", "Ji"] },
  { num: 22, name: "Śravaṇa",       devanagari: "श्रवण",          ruler: "Moon",   rulerKey: "moon",   deity: "Viṣṇu",             symbol: "Three footprints / Ear", yoni: "Female Monkey", gana: "deva", taraGroup: 4, taraName: "Kṣema",        meaning: "The Ear — listening, learning, pilgrimage", syllables: ["Ju", "Je", "Jo", "Gha"] },
  { num: 23, name: "Dhaniṣṭhā",     devanagari: "धनिष्ठा",        ruler: "Mars",   rulerKey: "mars",   deity: "Vasu",              symbol: "Drum / Flute",    yoni: "Female Lion", gana: "rākṣasa",  taraGroup: 5, taraName: "Pratyak",      meaning: "The Wealthiest — rhythm, prosperity, symphony", syllables: ["Ga", "Gi", "Gu", "Ge"] },
  { num: 24, name: "Śatabhiṣaj",    devanagari: "शततारका",       ruler: "Rahu",   rulerKey: "rahu",   deity: "Varuṇa",            symbol: "Hundred physicians / Circle", yoni: "Female Horse", gana: "rākṣasa", taraGroup: 6, taraName: "Sādhana",      meaning: "The Hundred Healers — healing, secrecy, explosion", syllables: ["Go", "Sa", "Si", "Su"] },
  { num: 25, name: "Pūrva Bhādrapadā",devanagari:"पूर्वभाद्रपदा", ruler: "Jupiter",rulerKey: "jupiter",deity: "Ajaikapāda",        symbol: "Front of funeral cot / Sword", yoni: "Male Lion", gana: "manuṣya", taraGroup: 7, taraName: "Naidhana",     meaning: "The Former Blessed Feet — fire tapas, purification", syllables: ["Se", "So", "Da", "Di"] },
  { num: 26, name: "Uttara Bhādrapadā",devanagari:"उत्तरभाद्रपदा",ruler: "Saturn", rulerKey: "saturn", deity: "Ahirbudhnya",       symbol: "Back of funeral cot / Twins", yoni: "Female Cow", gana: "manuṣya", taraGroup: 8, taraName: "Mitra",        meaning: "The Latter Blessed Feet — stability, depth, cosmic waters", syllables: ["Du", "Tha", "Jha", "ña"] },
  { num: 27, name: "Revatī",        devanagari: "रेवती",          ruler: "Mercury",rulerKey: "mercury",deity: "Pūṣan",             symbol: "Drum / Fish",     yoni: "Female Elephant", gana: "deva", taraGroup: 9, taraName: "Parama Mitra", meaning: "The Wealthy — protection, travel, nourishment", syllables: ["De", "Do", "Cha", "Chi"] },
];

export const RULER_COLORS: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  sun:     { text: "#B8860B", bg: "#FDF6E3", border: "#E8D5A3", glow: "#F5E6C8" },
  moon:    { text: "#708090", bg: "#F0F1F5", border: "#B8C0CC", glow: "#E2E5EB" },
  mars:    { text: "#C8412E", bg: "#FDE8E5", border: "#E8AFA8", glow: "#FAD4CD" },
  mercury: { text: "#2E8B57", bg: "#E8F5EE", border: "#A8D4B8", glow: "#D4EDD9" },
  jupiter: { text: "#DAA520", bg: "#FDF6E3", border: "#E8D5A3", glow: "#F5E6C8" },
  venus:   { text: "#888888", bg: "#F5F5F5", border: "#C8C8C8", glow: "#EBEBEB" },
  saturn:  { text: "#4A6FA8", bg: "#EBF0FA", border: "#B0C4DE", glow: "#D6E0F0" },
  rahu:    { text: "#5A5A5A", bg: "#F0F0F0", border: "#C0C0C0", glow: "#E0E0E0" },
  ketu:    { text: "#7A5E5E", bg: "#F5F0F0", border: "#C8B8B8", glow: "#E8DCDC" },
};

export const GANA_STYLE: Record<string, { text: string; bg: string }> = {
  deva:     { text: "#2d7d46", bg: "#E8F5EE" },
  manuṣya:  { text: "#B8860B", bg: "#FDF6E3" },
  rākṣasa:  { text: "#A23A1E", bg: "#FDE8E5" },
};
