export type Favourability = "favoured" | "acceptable" | "less-favoured" | "avoided";

export interface Option {
  id: string;
  label: string;
  devanagari?: string;
  quality: Favourability;
  note: string;
}

export const TITHIS: Option[] = [
  { id: "pratipada", label: "Pratipadā", devanagari: "प्रतिपदा", quality: "acceptable", note: "Nandā tithi — generally favourable, but Ekādaśī vrata-modulation may apply." },
  { id: "dvitiya", label: "Dvitīyā", devanagari: "द्वितीया", quality: "favoured", note: "Bhadrā tithi — noble-foundational character; favourable for wedding." },
  { id: "tritiya", label: "Tṛtīyā", devanagari: "तृतीया", quality: "less-favoured", note: "Jayā tithi — victory-context; less wedding-affined." },
  { id: "chaturthi", label: "Caturthī", devanagari: "चतुर्थी", quality: "avoided", note: "Riktā tithi — cancellation-grade for wedding; no exception applies." },
  { id: "panchami", label: "Pañcamī", devanagari: "पञ्चमी", quality: "favoured", note: "Pūrṇā tithi — completion-integration character; matches wedding." },
  { id: "shashthi", label: "Ṣaṣṭhī", devanagari: "षष्ठी", quality: "acceptable", note: "Nandā tithi — generally favourable." },
  { id: "saptami", label: "Saptamī", devanagari: "सप्तमी", quality: "favoured", note: "Bhadrā tithi — favourable for wedding." },
  { id: "ashtami", label: "Aṣṭamī", devanagari: "अष्टमी", quality: "less-favoured", note: "Jayā tithi — less wedding-affined." },
  { id: "navami", label: "Navamī", devanagari: "नवमी", quality: "avoided", note: "Riktā tithi — cancellation-grade for wedding." },
  { id: "dashami", label: "Daśamī", devanagari: "दशमी", quality: "favoured", note: "Pūrṇā tithi — favourable for wedding." },
  { id: "ekadashi", label: "Ekādaśī", devanagari: "एकादशी", quality: "acceptable", note: "Nandā tithi — vrata-modulation may apply." },
  { id: "dwadashi", label: "Dvādaśī", devanagari: "द्वादशी", quality: "favoured", note: "Bhadrā tithi — favourable for wedding." },
  { id: "trayodashi", label: "Trayodaśī", devanagari: "त्रयोदशी", quality: "less-favoured", note: "Jayā tithi — less wedding-affined." },
  { id: "chaturdashi", label: "Caturdaśī", devanagari: "चतुर्दशी", quality: "avoided", note: "Riktā tithi — cancellation-grade for wedding." },
  { id: "purnima", label: "Pūrṇimā", devanagari: "पूर्णिमा", quality: "favoured", note: "Pūrṇā tithi — most favourable for wedding." },
  { id: "amavasya", label: "Amāvasyā", devanagari: "अमावास्या", quality: "avoided", note: "Kuhū-yoga — Sun-Moon conjunction; cancellation-grade for wedding." },
];

export const VARAS: Option[] = [
  { id: "sunday", label: "Sunday (Ravi-vāra)", devanagari: "रवि", quality: "acceptable", note: "Generally favourable for many event-types." },
  { id: "monday", label: "Monday (Soma-vāra)", devanagari: "सोम", quality: "acceptable", note: "Generally favourable." },
  { id: "tuesday", label: "Tuesday (Maṅgala-vāra)", devanagari: "मङ्गल", quality: "avoided", note: "Avoided for wedding-muhūrta; no wedding-context exception." },
  { id: "wednesday", label: "Wednesday (Budha-vāra)", devanagari: "बुध", quality: "acceptable", note: "Generally favourable." },
  { id: "thursday", label: "Thursday (Guru-vāra)", devanagari: "गुरु", quality: "favoured", note: "Jupiter-ruled — universally favourable for wedding." },
  { id: "friday", label: "Friday (Śukra-vāra)", devanagari: "शुक्र", quality: "favoured", note: "Venus-ruled — classically marriage-optimal." },
  { id: "saturday", label: "Saturday (Śani-vāra)", devanagari: "शनि", quality: "avoided", note: "Saturn-ruled — avoided for wedding-muhūrta." },
];

export const NAKSHATRAS: Option[] = [
  { id: "ashwini", label: "Aśvinī", quality: "acceptable", note: "Kṣipra nakṣatra — acceptable but not wedding-optimal." },
  { id: "bharani", label: "Bharaṇī", quality: "avoided", note: "Ugra character — specifically challenging for wedding per classical-tradition." },
  { id: "krittika", label: "Kṛttikā", quality: "less-favoured", note: "Ugra character — less favourable for wedding." },
  { id: "rohini", label: "Rohiṇī", devanagari: "रोहिणी", quality: "favoured", note: "Sthira nakṣatra + Moon's exaltation — most-favoured for wedding." },
  { id: "mrigashira", label: "Mṛgaśīrṣā", devanagari: "मृगशीर्षा", quality: "favoured", note: "Mṛdu nakṣatra — relationship-aesthetic character." },
  { id: "ardra", label: "Ārdrā", quality: "avoided", note: "Tīkṣṇa character — avoided for wedding." },
  { id: "punarvasu", label: "Punarvasu", quality: "acceptable", note: "Dharma-restoration character — acceptable." },
  { id: "pushya", label: "Puṣya", quality: "acceptable", note: "Some traditions treat as less favourable for wedding (Bṛhaspati-Tārā narrative)." },
  { id: "ashlesha", label: "Āśleṣā", quality: "avoided", note: "Tīkṣṇa character — avoided." },
  { id: "magha", label: "Maghā", quality: "acceptable", note: "Pitṛ-lineage character — acceptable with regional nuance." },
  { id: "purvaphalguni", label: "Pūrvaphālgunī", quality: "favoured", note: "Relationship-aesthetic character — favourable." },
  { id: "uttaraphalguni", label: "Uttaraphālgunī", devanagari: "उत्तराफाल्गुनी", quality: "favoured", note: "Sthira nakṣatra — foundational-permanence character." },
  { id: "hasta", label: "Hasta", devanagari: "हस्त", quality: "favoured", note: "Laghu — skilled-quick character; classically wedding-acceptable." },
  { id: "chitra", label: "Citrā", devanagari: "चित्रा", quality: "favoured", note: "Mṛdu nakṣatra — relationship-aesthetic." },
  { id: "swati", label: "Svātī", devanagari: "स्वाती", quality: "favoured", note: "Cara but classically wedding-acceptable." },
  { id: "vishakha", label: "Viśākhā", quality: "acceptable", note: "Mixed character — acceptable with caution." },
  { id: "anuradha", label: "Anurādhā", devanagari: "अनुराधा", quality: "favoured", note: "Mṛdu nakṣatra — relationship-following character." },
  { id: "jyeshtha", label: "Jyeṣṭhā", quality: "avoided", note: "Tīkṣṇa character — avoided." },
  { id: "mula", label: "Mūla", quality: "avoided", note: "Tīkṣṇa character — avoided; distinct from natal Mūla-doṣa concern." },
  { id: "purvashadha", label: "Pūrvāṣāḍhā", quality: "acceptable", note: "Invincible-victory character — acceptable." },
  { id: "uttarashadha", label: "Uttarāṣāḍhā", devanagari: "उत्तराषाढा", quality: "favoured", note: "Sthira nakṣatra — favoured for wedding." },
  { id: "shravana", label: "Śravaṇa", quality: "acceptable", note: "Hearing-learning character — acceptable." },
  { id: "dhanishta", label: "Dhaniṣṭhā", quality: "less-favoured", note: "Cara but less wedding-aligned for some traditions." },
  { id: "shatabhisha", label: "Śatabhiṣaj", quality: "avoided", note: "Tīkṣṇa character — avoided." },
  { id: "purvabhadrapada", label: "Pūrvabhādrapadā", quality: "avoided", note: "Ugra character — avoided." },
  { id: "uttarabhadrapada", label: "Uttarabhādrapadā", devanagari: "उत्तरभाद्रपदा", quality: "favoured", note: "Sthira nakṣatra — favoured for wedding." },
  { id: "revati", label: "Revatī", devanagari: "रेवती", quality: "favoured", note: "Mṛdu nakṣatra — prosperous-completion character." },
];

export const YOGAS: Option[] = [
  { id: "vishkambha", label: "Viṣkambha", quality: "acceptable", note: "Generally acceptable." },
  { id: "priti", label: "Prīti", devanagari: "प्रीति", quality: "favoured", note: "Love-character — favourable for wedding." },
  { id: "ayushman", label: "Āyuṣmān", quality: "acceptable", note: "Longevity character — acceptable." },
  { id: "saubhagya", label: "Saubhāgya", devanagari: "सौभाग्य", quality: "favoured", note: "Name-character matches wedding directly." },
  { id: "shobhana", label: "Śobhana", quality: "acceptable", note: "Splendour character — acceptable." },
  { id: "atiganda", label: "Atigaṇḍa", quality: "avoided", note: "Challenging yoga." },
  { id: "sukarma", label: "Sukarmā", devanagari: "सुकर्मा", quality: "favoured", note: "Universally favourable." },
  { id: "dhriti", label: "Dhṛti", devanagari: "धृति", quality: "favoured", note: "Universally favourable." },
  { id: "shoola", label: "Śūla", quality: "avoided", note: "Challenging yoga." },
  { id: "guna", label: "Gaṇḍa", quality: "avoided", note: "Challenging yoga." },
  { id: "vriddhi", label: "Vṛddhi", devanagari: "वृद्धि", quality: "favoured", note: "Growth — universally favourable." },
  { id: "dhruva", label: "Dhruva", quality: "acceptable", note: "Fixedness character — acceptable." },
  { id: "vyaghata", label: "Vyāghāta", quality: "avoided", note: "Challenging yoga." },
  { id: "harshana", label: "Harṣaṇa", devanagari: "हर्षण", quality: "favoured", note: "Joy — universally favourable." },
  { id: "vajra", label: "Vajra", quality: "less-favoured", note: "Mixed nature." },
  { id: "siddhi", label: "Siddhi", quality: "acceptable", note: "Accomplishment — acceptable." },
  { id: "vyatipata", label: "Vyatīpāta", devanagari: "व्यतीपात", quality: "avoided", note: "Cancellation-grade yoga for wedding." },
  { id: "variyana", label: "Varīyān", quality: "acceptable", note: "Comfort — acceptable." },
  { id: "parigha", label: "Parigha", devanagari: "परिघ", quality: "avoided", note: "Tradition A treats as cancellation-grade for wedding." },
  { id: "shiva", label: "Śiva", quality: "acceptable", note: "Auspicious — acceptable." },
  { id: "siddha", label: "Siddha", quality: "acceptable", note: "Perfected — acceptable." },
  { id: "sadhya", label: "Sādhya", quality: "acceptable", note: "Accomplishable — acceptable." },
  { id: "shubha", label: "Śubha", devanagari: "शुभ", quality: "favoured", note: "Auspicious — universally favourable." },
  { id: "shukla", label: "Śukla", quality: "acceptable", note: "Bright — acceptable." },
  { id: "brahma", label: "Brahma", devanagari: "ब्रह्म", quality: "favoured", note: "Creator — universally favourable." },
  { id: "indra", label: "Indra", quality: "acceptable", note: "Power — acceptable." },
  { id: "vaidhriti", label: "Vaidhṛti", devanagari: "वैधृति", quality: "avoided", note: "Cancellation-grade yoga for wedding." },
];

export const KARANAS: Option[] = [
  { id: "bava", label: "Bava", devanagari: "बव", quality: "favoured", note: "Samskāra-affinity — favourable for wedding." },
  { id: "balava", label: "Bālava", quality: "acceptable", note: "Cara-favourable generally." },
  { id: "kaulava", label: "Kaulava", devanagari: "कौलव", quality: "favoured", note: "Family-lineage character — matches wedding kula-content." },
  { id: "taitila", label: "Taitila", quality: "acceptable", note: "Cara-favourable generally." },
  { id: "garaja", label: "Gara", quality: "acceptable", note: "Cara-favourable generally." },
  { id: "vanija", label: "Vāṇija", quality: "acceptable", note: "Commerce character — acceptable." },
  { id: "vishti", label: "Viṣṭi (Bhadrā-mukha)", devanagari: "विष्टि", quality: "avoided", note: "Cancellation-grade for wedding; Bhadrā-puccha also not acceptable." },
  { id: "shakuni", label: "Śakuni", quality: "avoided", note: "Sthira karaṇa — generally challenging for auspicious initiations." },
  { id: "chatushpada", label: "Catuṣpada", quality: "avoided", note: "Sthira karaṇa — generally challenging." },
  { id: "naga", label: "Nāga", quality: "avoided", note: "Sthira karaṇa — generally challenging." },
  { id: "kimstughna", label: "Kimstughna", quality: "avoided", note: "Sthira karaṇa — generally challenging." },
];

export const LAGNA_SIGNS: Option[] = [
  { id: "mesha", label: "Meṣa (Aries)", quality: "acceptable", note: "Generally acceptable; not specifically wedding-favoured." },
  { id: "vrishabha", label: "Vṛṣabha (Taurus)", devanagari: "वृषभ", quality: "favoured", note: "Venus-ruled — most-favoured for wedding." },
  { id: "mithuna", label: "Mithuna (Gemini)", devanagari: "मिथुन", quality: "favoured", note: "Venus-friendly — most-favoured for wedding." },
  { id: "karkata", label: "Karkaṭa (Cancer)", quality: "avoided", note: "Avoided in some classical-tradition wedding treatments." },
  { id: "simha", label: "Siṁha (Leo)", quality: "acceptable", note: "Generally acceptable." },
  { id: "kanya", label: "Kanyā (Virgo)", devanagari: "कन्या", quality: "acceptable", note: "Favourable per some classical-tradition treatments." },
  { id: "tula", label: "Tulā (Libra)", devanagari: "तुला", quality: "favoured", note: "Venus-ruled — most-favoured for wedding." },
  { id: "vrishchika", label: "Vṛścika (Scorpio)", quality: "avoided", note: "Avoided in some classical-tradition wedding treatments." },
  { id: "dhanus", label: "Dhanus (Sagittarius)", devanagari: "धनुस्", quality: "acceptable", note: "Favourable per some classical-tradition treatments." },
  { id: "makara", label: "Makara (Capricorn)", quality: "less-favoured", note: "Saturn-ruled — discipline-restraint; less wedding-aligned." },
  { id: "kumbha", label: "Kumbha (Aquarius)", quality: "less-favoured", note: "Saturn-ruled — less wedding-favoured." },
  { id: "meena", label: "Mīna (Pisces)", devanagari: "मीन", quality: "acceptable", note: "Favourable per some classical-tradition treatments." },
];

export interface StrengthCriterion {
  id: string;
  label: string;
  description: string;
}

export const JUPITER_CRITERIA: StrengthCriterion[] = [
  { id: "jupiter_sign", label: "Own / exaltation / friendly sign", description: "Dhanu, Mīna own; Karkaṭa exaltation; Venus signs friendly." },
  { id: "jupiter_house", label: "Kendra / trikoṇa / 11th placement", description: "1st, 4th, 5th, 7th, 9th, 10th, or 11th house." },
  { id: "jupiter_combust", label: "Not combust", description: "Not within ~12° of Sun." },
  { id: "jupiter_aspect", label: "Benefic aspect environment", description: "Benefic aspects; free from malefic affliction (non-upachaya)." },
];

export const VENUS_CRITERIA: StrengthCriterion[] = [
  { id: "venus_sign", label: "Own / exaltation / friendly sign", description: "Vṛṣabha, Tulā own; Mīna exaltation; Mercury signs friendly." },
  { id: "venus_house", label: "Kendra / trikoṇa / 11th placement", description: "1st, 4th, 5th, 7th, 9th, 10th, or 11th house." },
  { id: "venus_combust", label: "Not combust", description: "Not within ~10° of Sun." },
  { id: "venus_aspect", label: "Benefic aspect environment", description: "Benefic aspects; free from malefic affliction (non-upachaya)." },
];

export interface Dosha {
  id: string;
  label: string;
  description: string;
  mitigation: string;
}

export const DOSHAS: Dosha[] = [
  {
    id: "tri-bala",
    label: "Tri-bāla-śuddhi-failure",
    description: "Multi-failure across candra-bala + tārā-bala + lagna-śuddhi for either bride OR groom.",
    mitigation: "Cancel candidate; seek window where all three bālas are favourable for both actors.",
  },
  {
    id: "mangala",
    label: "Maṅgala-doṣa interaction",
    description: "Actor with natal Maṅgala-doṣa + muhūrta-Mars in 1/4/7/8/12 (non-upachaya) amplifies the doṣa.",
    mitigation: "Shift to upachaya Mars window (3/6/10/11) or apply natal-context mitigation observances.",
  },
  {
    id: "kuhu",
    label: "Kuhū-yoga",
    description: "Amāvasyā-day wedding-muhūrta — Sun-Moon conjunction cancellation.",
    mitigation: "First-pass exclude Amāvasyā-day candidates for wedding-muhūrta.",
  },
];

export function qualityScore(quality: Favourability): number {
  switch (quality) {
    case "favoured":
      return 2;
    case "acceptable":
      return 1;
    case "less-favoured":
      return 0;
    case "avoided":
      return -2;
  }
}

export function qualityColor(quality: Favourability): string {
  switch (quality) {
    case "favoured":
      return "#2F7D55";
    case "acceptable":
      return "#B9801E";
    case "less-favoured":
      return "#8B6914";
    case "avoided":
      return "#A23A1E";
  }
}

export function qualityLabel(quality: Favourability): string {
  switch (quality) {
    case "favoured":
      return "Favoured";
    case "acceptable":
      return "Acceptable";
    case "less-favoured":
      return "Less favoured";
    case "avoided":
      return "Avoided";
  }
}
