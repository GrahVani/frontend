export interface Upagraha {
  id: string;
  name: string;
  shadows: string;
  shadowTone: string;
  note: string;
  primaryUse: string;
  avoidCue: string;
  importanceRank: number;
  isMuhurta: boolean;
}

export const UPAGRAHAS: Upagraha[] = [
  {
    id: "gulika",
    name: "Gulika",
    shadows: "Saturn",
    shadowTone: "Saturnine pressure, delay, severity, and karmic consequence.",
    note: "The most important; an extra malefic point and a time to avoid.",
    primaryUse: "Chief muhurta caution and the one computed in the next lesson.",
    avoidCue: "Do not begin major work in the Gulika slice.",
    importanceRank: 1,
    isMuhurta: true,
  },
  {
    id: "mandi",
    name: "Mandi",
    shadows: "Saturn",
    shadowTone: "A second Saturn-shadow, usually read close to Gulika.",
    note: "Often treated as Gulika's secondary marker.",
    primaryUse: "Secondary malefic timing and chart-reading marker.",
    avoidCue: "Use as an added caution, not as the headline.",
    importanceRank: 2,
    isMuhurta: true,
  },
  {
    id: "yamakantaka",
    name: "Yamakantaka",
    shadows: "Jupiter",
    shadowTone: "Jupiter's auspiciousness pierced by obstruction.",
    note: "\"Yama's spike\": an obstacle to auspicious action.",
    primaryUse: "Avoidance marker for auspicious beginnings.",
    avoidCue: "Pause ceremonies and blessings in this slice.",
    importanceRank: 3,
    isMuhurta: true,
  },
  {
    id: "ardhaprahara",
    name: "Ardhaprahara",
    shadows: "Mercury",
    shadowTone: "Mercurial time-splitting, calculation, exchange, and messages.",
    note: "A half-watch time-marker.",
    primaryUse: "Time-marker used as a secondary avoidance cue.",
    avoidCue: "Treat quick agreements and messages cautiously.",
    importanceRank: 4,
    isMuhurta: true,
  },
  {
    id: "kala",
    name: "Kala",
    shadows: "Sun",
    shadowTone: "Solar authority pressed by time itself.",
    note: "\"Time itself.\"",
    primaryUse: "A solar shadow-point marking an inauspicious time quality.",
    avoidCue: "Do not force high-visibility launches here.",
    importanceRank: 5,
    isMuhurta: true,
  },
  {
    id: "mrtyu",
    name: "Mrtyu",
    shadows: "Mars",
    shadowTone: "Martian conflict, injury, cutting, and urgency.",
    note: "\"Death\": a time to avoid conflict.",
    primaryUse: "Avoidance marker for risky, sharp, or confrontational starts.",
    avoidCue: "Avoid conflict, surgery-like starts, and aggressive launches.",
    importanceRank: 6,
    isMuhurta: true,
  },
  {
    id: "indra-capa",
    name: "Indra-capa",
    shadows: "Venus",
    shadowTone: "Venusian beauty and pleasure seen as a fleeting arc.",
    note: "\"Indra's bow\" (the rainbow).",
    primaryUse: "A subtler Venus-shadow in timing and interpretive nuance.",
    avoidCue: "Do not overvalue charm when the timing is unstable.",
    importanceRank: 7,
    isMuhurta: true,
  },
  {
    id: "dhuma",
    name: "Dhuma",
    shadows: "Sun",
    shadowTone: "Solar clarity obscured by smoke.",
    note: "\"Smoke\": an obscuring point.",
    primaryUse: "A solar obscuration point used as a minor caution.",
    avoidCue: "Avoid starts that require clear public visibility.",
    importanceRank: 8,
    isMuhurta: true,
  },
];
