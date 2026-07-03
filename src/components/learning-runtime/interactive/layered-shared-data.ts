export interface PresetQuestion {
  id: string;
  label: string;
  text: string;
  suggestedType: "binary" | "purpose" | "remedy" | "year" | "compound";
  recommendedLayers: string[]; // e.g. ["kp"]
  notes: Record<string, string>; // per-stream default notes
}

export const PRESETS: PresetQuestion[] = [
  {
    id: "q1",
    label: "Q1: Government Post",
    text: "Will I get this specific government post, and when?",
    suggestedType: "binary",
    recommendedLayers: ["kp"],
    notes: {
      parashari: "10th and 6th houses indicate strong promise; Vimshottari Mahadasha is active and ripe.",
      kp: "10th cuspal sub-lord signifies career success houses (6, 10, 11). Timing points to Mercury-Saturn AD."
    }
  },
  {
    id: "q2",
    label: "Q2: True Calling",
    text: "What is my true calling?",
    suggestedType: "purpose",
    recommendedLayers: ["jaimini"],
    notes: {
      parashari: "10th house is well-tenanted, suggesting corporate life is viable.",
      jaimini: "Atmakaraka is Sun in Aries (vocation of service/leadership); Karakāṁśa 10th supports teaching."
    }
  },
  {
    id: "q3",
    label: "Q3: Saturn Troubles",
    text: "What can I do about my persistent Saturn troubles?",
    suggestedType: "remedy",
    recommendedLayers: ["lal-kitab"],
    notes: {
      parashari: "Saturn transiting 8th house causes obstacles and delay (Sade Sati phase).",
      "lal-kitab": "Identifies ancestral debt (Pitri Rin) related to dry wells. Remedial avenue exists (Recognition only)."
    }
  },
  {
    id: "q4",
    label: "Q4: Coming Year",
    text: "How will this coming year go?",
    suggestedType: "year",
    recommendedLayers: ["tajika"],
    notes: {
      parashari: "Natal dasha backdrop is modest; Saturn period restricts expansion.",
      tajika: "Varṣaphala Year Lord is exalted; Muntha sits in 11th house (gains). High short-term recovery."
    }
  },
  {
    id: "q5",
    label: "Q5: Happy Marriage",
    text: "Will my marriage be happy and lasting?",
    suggestedType: "compound",
    recommendedLayers: ["kp", "jaimini"],
    notes: {
      parashari: "7th house promise and Venus placements in D1 & D9 are moderately strong.",
      kp: "7th cuspal sub-lord connects with houses 2, 7, 11, confirming event fructification timing.",
      jaimini: "Darakaraka is Venus (spouse is warm-hearted); Upapada Lagna has beneficial aspect (lasting union)."
    }
  },
  {
    id: "q6",
    label: "Q6: Struggles recovery",
    text: "My business has been struggling for two years; will it recover this coming year, and is there anything I can do to help it along?",
    suggestedType: "compound",
    recommendedLayers: ["tajika", "lal-kitab"],
    notes: {
      parashari: "Natal Vimshottari MD is Mercury (struggling lord), backdrop is slow.",
      tajika: "Varṣaphala Muntha in 10th house (recovery); Year Lord is strong.",
      "lal-kitab": "Upaya indications (empirical checks) suggest Saturn remedy avenue (Recognition only)."
    }
  }
];
