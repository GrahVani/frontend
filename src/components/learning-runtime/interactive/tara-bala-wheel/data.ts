// The 9 Tārā classifications
export interface Tara {
  number: number;        // 1–9
  name: string;
  sanskrit: string;
  quality: "favourable" | "unfavourable" | "mixed";
  description: string;
}

export const TARAS: Tara[] = [
  { number: 1, name: "Janma",     sanskrit: "जन्म",     quality: "mixed",        description: "One's own birth star — mixed, proceed with caution" },
  { number: 2, name: "Sampat",    sanskrit: "सम्पत्",   quality: "favourable",   description: "Wealth-giving — favourable for gains and prosperity" },
  { number: 3, name: "Vipat",     sanskrit: "विपत्",    quality: "unfavourable", description: "Danger — avoid important beginnings" },
  { number: 4, name: "Kṣema",     sanskrit: "क्षेम",    quality: "favourable",   description: "Well-being — favourable for health and comfort" },
  { number: 5, name: "Pratyak",   sanskrit: "प्रत्यक्", quality: "unfavourable", description: "Obstructive — delays and obstacles likely" },
  { number: 6, name: "Sādhaka",   sanskrit: "साधक",     quality: "favourable",   description: "Accomplishing — favourable for achieving goals" },
  { number: 7, name: "Vadha",     sanskrit: "वध",       quality: "unfavourable", description: "Destructive — the worst tārā; avoid at all costs" },
  { number: 8, name: "Mitra",     sanskrit: "मित्र",    quality: "favourable",   description: "Friendly — supportive and harmonious" },
  { number: 9, name: "Ati-Mitra",  sanskrit: "अतिमित्र", quality: "favourable",   description: "Best friend — the most auspicious tārā" },
];

// The 27 Nakṣatras (names only, for selector/counting)
export const NAKSHATRA_NAMES: string[] = [
  "Aśvinī", "Bharaṇī", "Kṛttikā", "Rohiṇī", "Mṛgaśīrṣa",
  "Ārdrā", "Punarvasu", "Puṣya", "Āśleṣā",
  "Maghā", "Pūrva Phalgunī", "Uttara Phalgunī", "Hasta", "Citrā",
  "Svātī", "Viśākhā", "Anurādhā", "Jyeṣṭhā",
  "Mūla", "Pūrva Aṣāḍhā", "Uttara Aṣāḍhā", "Śravaṇa", "Dhaniṣṭhā",
  "Śatabhiṣaj", "Pūrva Bhādrapadā", "Uttara Bhādrapadā", "Revatī"
];

// The 8 Kūṭas of Aṣṭa-Kūṭa
export interface Kuta {
  number: number;
  name: string;
  sanskrit: string;
  weighs: string;
  maxPoints: number;
}

export const KUTAS: Kuta[] = [
  { number: 1, name: "Varṇa",        sanskrit: "वर्ण",       weighs: "Spiritual / temperamental class", maxPoints: 1 },
  { number: 2, name: "Vaśya",        sanskrit: "वश्य",       weighs: "Mutual attraction / control",     maxPoints: 2 },
  { number: 3, name: "Tārā",         sanskrit: "तारा",       weighs: "Nakṣatra compatibility",          maxPoints: 3 },
  { number: 4, name: "Yoni",         sanskrit: "योनि",       weighs: "Physical / instinctual temperament", maxPoints: 4 },
  { number: 5, name: "Graha-maitrī", sanskrit: "ग्रहमैत्री", weighs: "Friendship of Moon-sign lords",   maxPoints: 5 },
  { number: 6, name: "Gaṇa",         sanskrit: "गण",        weighs: "Temperament tribe (deva/manuṣya/rākṣasa)", maxPoints: 6 },
  { number: 7, name: "Bhakūṭa",      sanskrit: "भकूट",      weighs: "Rāśi-to-rāśi relationship",      maxPoints: 7 },
  { number: 8, name: "Nāḍī",         sanskrit: "नाडी",       weighs: "Āyurvedic constitution",          maxPoints: 8 },
];

/** Compute the Tārā number (1–9) given janma index and target index (0-based). */
export function computeTara(janmaIndex: number, targetIndex: number): number {
  const count = ((targetIndex - janmaIndex + 27) % 27) + 1; // inclusive count 1..27
  const remainder = count % 9;
  return remainder === 0 ? 9 : remainder;
}

export interface DrillScenario {
  slug: string;
  question: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    slug: "s1",
    question: "If your Janma-nakṣatra is Rohiṇī (4th) and today's nakṣatra is Hasta (13th), what is the Tārā?",
    options: [
      {
        id: "A",
        label: "Janma (mixed)",
        isCorrect: true,
        explanation: "Correct! Count inclusive: 13 − 4 + 1 = 10; 10 mod 9 = 1 → Janma-tārā (mixed)."
      },
      {
        id: "B",
        label: "Sampat (favourable)",
        isCorrect: false,
        explanation: "Sampat is the 2nd tārā. 10 mod 9 = 1, not 2."
      },
      {
        id: "C",
        label: "Vadha (unfavourable)",
        isCorrect: false,
        explanation: "Vadha is the 7th tārā. The count here gives 1 (Janma), not 7."
      }
    ]
  },
  {
    slug: "s2",
    question: "How many of the 9 Tārās are classified as favourable?",
    options: [
      {
        id: "A",
        label: "3",
        isCorrect: false,
        explanation: "3 is the number of *unfavourable* tārās (Vipat, Pratyak, Vadha). A common mix-up!"
      },
      {
        id: "B",
        label: "5",
        isCorrect: true,
        explanation: "Correct! Sampat, Kṣema, Sādhaka, Mitra, and Ati-Mitra are the 5 favourable tārās."
      },
      {
        id: "C",
        label: "4",
        isCorrect: false,
        explanation: "There are 5 favourable, not 4. The five are Sampat, Kṣema, Sādhaka, Mitra, Ati-Mitra."
      }
    ]
  },
  {
    slug: "s3",
    question: "A couple scores 30/36 on Aṣṭa-Kūṭa but has Nāḍī doṣa (0/8 on Nāḍī). What is the honest reading?",
    options: [
      {
        id: "A",
        label: "Excellent match — 30/36 is very high",
        isCorrect: false,
        explanation: "The total looks high, but Nāḍī doṣa (worth 8 points, the heaviest kūṭa) is a serious flag that needs investigation."
      },
      {
        id: "B",
        label: "Check if a doṣa-cancellation applies and examine the full chart",
        isCorrect: true,
        explanation: "Correct! A high total with a serious doṣa is not automatically good. Check cancellations and the full 7th-house/Venus comparison."
      },
      {
        id: "C",
        label: "Incompatible — any doṣa means rejection",
        isCorrect: false,
        explanation: "Not necessarily. Doṣas have recognised cancellation rules. The score is a screen, not a verdict."
      }
    ]
  }
];
