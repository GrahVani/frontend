export interface DrillScenario {
  slug: string;
  question: string;
  context?: string;
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
    "question": "A planet is located at exactly 3°20′ Aries. Which pada does it belong to?",
    "context": "Remember how boundaries are handled.",
    "options": [
      {
        "id": "A",
        "label": "Pada 1",
        "isCorrect": false,
        "explanation": "Pada 1 strictly ends right before 3°20′. The exact boundary begins the next section."
      },
      {
        "id": "B",
        "label": "Pada 2",
        "isCorrect": true,
        "explanation": "Correct! A planet exactly on the 3°20′ seam belongs to the pada that begins there, which is Pada 2."
      },
      {
        "id": "C",
        "label": "Pada 3",
        "isCorrect": false,
        "explanation": "Pada 3 does not begin until 6°40′."
      }
    ]
  },
  {
    "slug": "s2",
    "question": "You calculate a planet's position within its Nakshatra to be 220′. You divide 220′ by 200′ and get 1.1, taking the floor yields 1. What is the Pada?",
    "context": "Beware the common off-by-one error.",
    "options": [
      {
        "id": "A",
        "label": "Pada 1",
        "isCorrect": false,
        "explanation": "This is the 'index' result of the floor division, not the final human-readable Pada number."
      },
      {
        "id": "B",
        "label": "Pada 2",
        "isCorrect": true,
        "explanation": "Correct! You must always add 1 to the floor division result. Index 1 = Pada 2."
      },
      {
        "id": "C",
        "label": "Pada 3",
        "isCorrect": false,
        "explanation": "You would need the floor division result to be 2 to get Pada 3."
      }
    ]
  },
  {
    "slug": "s3",
    "question": "If a planet is at 8°00′ within a Nakshatra (480 arc-minutes). Which Pada is it in?",
    "options": [
      {
        "id": "A",
        "label": "Pada 2",
        "isCorrect": false,
        "explanation": "Pada 2 ends at 6°40′ (400 arc-minutes)."
      },
      {
        "id": "B",
        "label": "Pada 3",
        "isCorrect": true,
        "explanation": "Correct! 480 ÷ 200 = 2.4. Floor is 2. Add 1 = Pada 3. (6°40′ to 10°00′)."
      },
      {
        "id": "C",
        "label": "Pada 4",
        "isCorrect": false,
        "explanation": "Pada 4 begins at 10°00′ (600 arc-minutes)."
      }
    ]
  }
];
