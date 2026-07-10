export interface NakshatraData {
  id: number;
  name: string;
  startRashiId: number; // The sign where Pada 1 starts (0=Aries, 1=Taurus...)
}

// Zodiac mapping: 0=Aries, 1=Taurus, ..., 11=Pisces
export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", 
  "Leo", "Virgo", "Libra", "Scorpio", 
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const NAKSHATRAS: NakshatraData[] = [
  { id: 1, name: "Aśvinī", startRashiId: 0 },
  { id: 2, name: "Bharaṇī", startRashiId: 0 },
  { id: 3, name: "Kṛttikā", startRashiId: 0 },
  { id: 4, name: "Rohiṇī", startRashiId: 1 },
  { id: 5, name: "Mṛgaśīrṣa", startRashiId: 1 },
  { id: 6, name: "Ārdrā", startRashiId: 2 },
  { id: 7, name: "Punarvasu", startRashiId: 2 },
  { id: 8, name: "Puṣya", startRashiId: 3 },
  { id: 9, name: "Āśleṣā", startRashiId: 3 },
  { id: 10, name: "Maghā", startRashiId: 4 },
  { id: 11, name: "Pūrva Phalgunī", startRashiId: 4 },
  { id: 12, name: "Uttara Phalgunī", startRashiId: 4 },
  { id: 13, name: "Hasta", startRashiId: 5 },
  { id: 14, name: "Citrā", startRashiId: 5 },
  { id: 15, name: "Svātī", startRashiId: 6 },
  { id: 16, name: "Viśākhā", startRashiId: 6 },
  { id: 17, name: "Anurādhā", startRashiId: 7 },
  { id: 18, name: "Jyeṣṭhā", startRashiId: 7 },
  { id: 19, name: "Mūla", startRashiId: 8 },
  { id: 20, name: "Pūrva Aṣāḍhā", startRashiId: 8 },
  { id: 21, name: "Uttara Aṣāḍhā", startRashiId: 8 },
  { id: 22, name: "Śravaṇa", startRashiId: 9 },
  { id: 23, name: "Dhaniṣṭhā", startRashiId: 9 },
  { id: 24, name: "Śatabhiṣaj", startRashiId: 10 },
  { id: 25, name: "Pūrva Bhādrapadā", startRashiId: 10 },
  { id: 26, name: "Uttara Bhādrapadā", startRashiId: 11 },
  { id: 27, name: "Revatī", startRashiId: 11 },
];

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
    "slug": "s1",
    "question": "According to the N mod 3 rule, which Navāṁśa sign does Pada 1 of Kṛttikā (Nakṣatra 3) start in?",
    "options": [
      {
        "id": "A",
        "label": "Aries",
        "isCorrect": false,
        "explanation": "Aries is for Nakṣatras where N mod 3 = 1."
      },
      {
        "id": "B",
        "label": "Leo",
        "isCorrect": false,
        "explanation": "Leo is for Nakṣatras where N mod 3 = 2."
      },
      {
        "id": "C",
        "label": "Sagittarius",
        "isCorrect": true,
        "explanation": "Correct! 3 mod 3 = 0, which dictates the cycle begins at the Fire sign Sagittarius."
      }
    ]
  },
  {
    "slug": "s2",
    "question": "If a planet is located in Bharaṇī Pada 3, what is its Navāṁśa sign?",
    "options": [
      {
        "id": "A",
        "label": "Libra",
        "isCorrect": true,
        "explanation": "Correct! Bharaṇī is N=2, so it starts at Leo. Pada 1 = Leo, Pada 2 = Virgo, Pada 3 = Libra."
      },
      {
        "id": "B",
        "label": "Scorpio",
        "isCorrect": false,
        "explanation": "Scorpio is Pada 4 of Bharaṇī."
      },
      {
        "id": "C",
        "label": "Virgo",
        "isCorrect": false,
        "explanation": "Virgo is Pada 2 of Bharaṇī."
      }
    ]
  },
  {
    "slug": "s3",
    "question": "What does it mean if a planet's Pada maps to the exact same sign as its parent Nakṣatra's sign?",
    "options": [
      {
        "id": "A",
        "label": "It is an error in calculation",
        "isCorrect": false,
        "explanation": "No, this is a mathematically expected occurrence."
      },
      {
        "id": "B",
        "label": "It is Vargottama",
        "isCorrect": true,
        "explanation": "Correct! When the D1 (Rāśi) and D9 (Navāṁśa) signs are identical, the planet gains special strength known as Vargottama."
      },
      {
        "id": "C",
        "label": "It causes a Gaṇḍānta",
        "isCorrect": false,
        "explanation": "Gaṇḍānta occurs at the junctions of water/fire signs, not simply when D1 and D9 match."
      }
    ]
  }
];
