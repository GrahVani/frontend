/**
 * De-Fearmongering Protocol -- Data Engine
 *
 * Section 7 interactive for Lesson 14.6.6
 * (The De-Fearmongering Discipline Applied to Doṣas).
 *
 * Eight-step protocol walker with doṣa-specific content
 * and reframe exercises.
 */

export interface DoshaProfile {
  key: string;
  label: string;
  labelDevanagari: string;
  classicalStatus: "classical" | "contested" | "interpretive";
  statusNote: string;
  definition: string;
  sources: string;
  cancellations: string[];
  honestHandling: string;
  reframe: string;
  remedies: string;
  catastropheExample: string;
  fearFeeWarning: string;
}

export const DOSHAS: DoshaProfile[] = [
  {
    key: "manglik",
    label: "Māngalik / Kuja-Doṣa",
    labelDevanagari: "कुजदोषः",
    classicalStatus: "classical",
    statusNote: "Well-attested in BPHS and standard texts. Has extensive cancellation literature.",
    definition: "Mars in the 1st, 2nd, 4th, 7th, 8th, or 12th from lagna (or Moon, or Venus). Associated with partnership friction.",
    sources: "BPHS (kuja-doṣa chapter); standard parāśari commentaries.",
    cancellations: [
      "Mars in its own / exalted sign",
      "Mars conjunct Jupiter or Moon",
      "Mars in a kendra from lagna (some sources)",
      "Mars aspected by Jupiter",
      "Mars in a friendly sign with good dignity",
      "2nd-house variation reduces scope",
      // Keep list representative; full list is in the Manglik lesson
    ],
    honestHandling: "Most charts cancel. Mention the structural condition briefly, then lead with the cancellation. Never open with doom.",
    reframe: " partnership area benefits from patience and conscious communication ",
    remedies: "Module 15: Hanumān sādhanā, Tuesday fasting, red donation. Constructive practice, never purchased fear-relief.",
    catastropheExample: "'You will never marry' or 'Your spouse will die' -- both forbidden.",
    fearFeeWarning: "Never sell a 'Manglik removal' ritual. Remedies are practice, not transactions.",
  },
  {
    key: "kala-sarpa",
    label: "Kāla Sarpa Yoga",
    labelDevanagari: "कालसर्पयोगः",
    classicalStatus: "contested",
    statusNote: "Absent from BPHS. A post-classical / popular-era configuration. Must be disclosed as contested.",
    definition: "All planets hemmed between Rāhu and Ketu on one side of the nodal axis. Some variants require all planets strictly between; others allow one on the axis.",
    sources: "NOT in BPHS. Post-classical / 20th-century popular texts. Contested among scholars.",
    cancellations: [
      "A planet on the nodal axis (broken KSY)",
      "A planet outside the Rāhu-Ketu arc (no KSY)",
      "Kāla Amṛta (reverse orientation) is a different variant",
      "Rāhu/Ketu dignified or well-placed reduces severity",
    ],
    honestHandling: "State clearly that this is NOT a classical BPHS doṣa. Acknowledge the doctrinal debate. Do not present it as settled canon.",
    reframe: " the nodal axis is intensified; this calls for conscious attention to the houses Rāhu and Ketu occupy ",
    remedies: "Module 15: Rāhu-Ketu temple visits, nāga-pūjā, ethical living. Frame as self-awareness, not fear-appeasement.",
    catastropheExample: "'Your entire life is cursed by KSY' -- this is non-classical and harmful.",
    fearFeeWarning: "Never up-sell expensive 'KSY removal' rituals. The configuration itself is doctrinally contested.",
  },
  {
    key: "pitr-dosha",
    label: "Pitṛ-Doṣa",
    labelDevanagari: "पितृदोषः",
    classicalStatus: "interpretive",
    statusNote: "More rooted in smṛti / Purāṇic ancestral-rite tradition than in strict BPHS horoscopy. Interpretive conventions.",
    definition: "Chart signatures suggesting ancestral-karma friction: Sun afflicted by Rāhu/Saturn, 9th house afflicted, 9th lord with nodes.",
    sources: "Smṛti / Purāṇic ancestral-rite tradition; classical Sun / 9th-house horoscopy (interpretive, not one canonical rule).",
    cancellations: [
      "Strong / dignified Sun",
      "Benefic aspect on Sun or 9th house",
      "9th lord in good dignity",
      "Service to living elders (active ethical repair)",
      "Śrāddha performed properly (remedial, not cancellation per se)",
    ],
    honestHandling: "Frame as interpretive convention, not rigid doṣa. There is no single canonical definition. Handle without fatalism.",
    reframe: " ancestral connection rewards conscious remembrance and ethical repair ",
    remedies: "Śrāddha (Pitṛ Pakṣa), pind-dāna (Gayā/Kāśī), service to elders, Sun-strengthening (Module 15). Acts of remembrance, not fear-relief.",
    catastropheExample: "'Your ancestors are cursing you' or 'You must perform this expensive ritual' -- both forbidden.",
    fearFeeWarning: "Never sell rites to 'remove' ancestral doom. Frame śrāddha as remembrance, not transactional fear-relief.",
  },
  {
    key: "kemadruma",
    label: "Kemadruma",
    labelDevanagari: "केमद्रुमः",
    classicalStatus: "classical",
    statusNote: "Attested in BPHS. Richly cancelled -- most charts cancel.",
    definition: "No planet (other than Sun) in the 2nd or 12th from the Moon -- the Moon is 'unsupported.'",
    sources: "BPHS (Kemadruma chapter); standard parāśari commentaries.",
    cancellations: [
      "A planet in a kendra from lagna",
      "A planet in a kendra from the Moon",
      "The Moon conjunct a non-Sun planet",
      "The Moon aspected by a benefic",
      "The Moon in own sign / exaltation / strong dignity",
    ],
    honestHandling: "Most charts cancel. If uncancelled, frame as self-reliance or emotional independence to support -- never poverty or misery.",
    reframe: " emotional self-reliance is a strength; conscious support-building enriches it ",
    remedies: "Module 15: Moon-strengthening practices, pearl (if appropriate), water rituals, nurturing routines.",
    catastropheExample: "'You will be poor and alone' -- Kemadruma does NOT predict specific catastrophe.",
    fearFeeWarning: "Never sell 'Kemadruma removal.' The doṣa is usually cancelled; if not, it is mild.",
  },
  {
    key: "sade-sati",
    label: "Sāḍhe-Sātī",
    labelDevanagari: "साढेसाती",
    classicalStatus: "classical",
    statusNote: "Well-attested in classical Saturn-transit tradition. Phased, not blanket.",
    definition: "Saturn transiting the 12th, 1st, and 2nd from the natal Moon -- ~7.5 years in three ~2.5-year phases.",
    sources: "Classical Saturn-transit tradition; standard jyotiṣa transit texts.",
    cancellations: [
      "Strong / exalted Moon",
      "Saturn in good dignity during transit",
      "Benefic aspects on Moon or Saturn",
      "Strong lagna lord",
      "Good daśā period overlapping",
      // These are mitigations rather than strict cancellations
    ],
    honestHandling: "Three distinct phases with different textures. Rising = clearing; Peak = identity pressure; Setting = rebuilding. Never blanket doom.",
    reframe: " a 7.5-year period of maturation and restructuring in the areas Saturn and the Moon govern ",
    remedies: "Module 15: Śani sādhanā, Saturday discipline, service to elders/neglected, blue sapphire (only if appropriate).",
    catastropheExample: "'Seven and a half years of disaster' -- this is the textbook fearmongering misreading.",
    fearFeeWarning: "Never sell 'Sade Sati protection packages.' The period is maturation, not a catastrophe to be paid away.",
  },
];

/* --- 8-step protocol --- */

export interface ProtocolStep {
  num: number;
  title: string;
  short: string;
}

export const PROTOCOL_STEPS: ProtocolStep[] = [
  { num: 1, title: "Identify the classical definition and sources", short: "Define + source" },
  { num: 2, title: "Check ALL cancellation conditions", short: "Cancellations first" },
  { num: 3, title: "Apply honest-handling", short: "Honest handling" },
  { num: 4, title: "Frame as karmic re-prioritisation, not fatalism", short: "Re-prioritise" },
  { num: 5, title: "Recommend classical remedies (Module 15)", short: "Remedies" },
  { num: 6, title: "Never predict a specific catastrophe", short: "No catastrophe" },
  { num: 7, title: "Never extract fear or money", short: "No fear/fee" },
  { num: 8, title: "Cross-reference ethics (Module 24)", short: "Ethics" },
];

/* --- Reframe exercises --- */

export interface ReframeExercise {
  fatalistic: string;
  rePrioritised: string;
  doshaKey: string;
}

export const REFRAMES: ReframeExercise[] = [
  { doshaKey: "manglik", fatalistic: "You are Manglik. Your marriage is doomed.", rePrioritised: "Mars is active in your partnership houses. Conscious communication and patience will be especially rewarding here." },
  { doshaKey: "kala-sarpa", fatalistic: "Kāla Sarpa Yoga has cursed your entire life.", rePrioritised: "The nodal axis is emphasised in your chart. The houses ruled by Rāhu and Ketu call for deeper self-awareness." },
  { doshaKey: "pitr-dosha", fatalistic: "Your ancestors are angry. Disaster will follow.", rePrioritised: "Ancestral connection is a theme in this chart. Remembrance and ethical repair are constructive practices." },
  { doshaKey: "kemadruma", fatalistic: "You have Kemadruma. You will be poor and alone.", rePrioritised: "The Moon's support houses are unoccupied. This points toward self-reliance -- building conscious emotional support enriches it." },
  { doshaKey: "sade-sati", fatalistic: "Sade Sati means 7.5 years of disaster.", rePrioritised: "Saturn is transiting your Moon zone. This is a maturation period -- clearing, restructuring, and building endurance." },
];
