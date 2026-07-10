export type Quality = "favourable" | "mixed" | "unfavourable" | "neutral";

export type DayKey = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

export type DirectionKey = "east" | "south" | "west" | "north";

export interface PanchangaFactor {
  key: "tithi" | "vara" | "nakshatra" | "yoga" | "karana";
  label: string;
  value: string;
  quality: Quality;
  note: string;
}

export interface HouseState {
  house: number;
  label: string;
  quality: Quality;
  note: string;
}

export interface TravellerState {
  name: string;
  role: string;
  natalStar: string;
  taraQuality: Quality;
  taraNote: string;
  lagnaSign: string;
  lagnaQuality: Quality;
  lagnaNote: string;
  navamshaQuality: Quality;
  navamshaNote: string;
}

export interface Candidate {
  id: string;
  label: string;
  date: string;
  time: string;
  tagline: string;
  direction: DirectionKey;
  day: DayKey;
  brahmaMuhurta: boolean;
  panchanga: PanchangaFactor[];
  moonState: Quality;
  moonNote: string;
  mercuryState: Quality;
  mercuryNote: string;
  jupiterState: Quality;
  jupiterNote: string;
  lagnaSign: string;
  lagnaQuality: Quality;
  lagnaNote: string;
  houses: HouseState[];
  doshas: {
    key: string;
    label: string;
    triggered: boolean;
    note: string;
  }[];
  dishaSula: {
    triggered: boolean;
    direction: DirectionKey;
    note: string;
  };
  travellers: [TravellerState, TravellerState];
  safetyContext: string;
  recommendation: string;
}

export const DAY_PROFILES: Record<
  DayKey,
  { label: string; lord: string; favouredDirection: DirectionKey | "all" | "avoid"; note: string }
> = {
  sunday: {
    label: "Sunday",
    lord: "Sun",
    favouredDirection: "east",
    note: "Favours East-direction travel; authority-purpose travel.",
  },
  monday: {
    label: "Monday",
    lord: "Moon",
    favouredDirection: "east",
    note: "Favours East-direction (some traditions: North-West); nurturing-motion travel.",
  },
  tuesday: {
    label: "Tuesday",
    lord: "Mars",
    favouredDirection: "south",
    note: "Favours South-direction for decisive/pilgrimage purpose travel; generally avoided for routine comfortable travel.",
  },
  wednesday: {
    label: "Wednesday",
    lord: "Mercury",
    favouredDirection: "north",
    note: "Favours North-direction travel; communication/movement character.",
  },
  thursday: {
    label: "Thursday",
    lord: "Jupiter",
    favouredDirection: "all",
    note: "Universally favourable for all directions per Jupiter character — BUT check Disha-Śūla conflict.",
  },
  friday: {
    label: "Friday",
    lord: "Venus",
    favouredDirection: "west",
    note: "Favours West-direction travel; comfort-aesthetics for comfortable journey.",
  },
  saturday: {
    label: "Saturday",
    lord: "Saturn",
    favouredDirection: "avoid",
    note: "Classically avoided for auspicious travel-initiation per Saturn slow-process character conflicting with travel-momentum.",
  },
} as const;

export const DIRECTION_LABELS: Record<DirectionKey, { label: string; devanagari: string; colour: string }> = {
  east: { label: "East", devanagari: "पूर्व", colour: "#D68C2E" },
  south: { label: "South", devanagari: "दक्षिण", colour: "#A23A1E" },
  west: { label: "West", devanagari: "पश्चिम", colour: "#4F6FA8" },
  north: { label: "North", devanagari: "उत्तर", colour: "#2F7D55" },
} as const;

export const DISHA_SULA_RULES: Record<DayKey | "monday-saturday" | "tuesday-wednesday" | "friday-sunday", DirectionKey> = {
  sunday: "west",
  monday: "east",
  tuesday: "north",
  wednesday: "north",
  thursday: "south",
  friday: "west",
  saturday: "east",
  "monday-saturday": "east",
  "tuesday-wednesday": "north",
  "friday-sunday": "west",
} as const;

export const PANCHANGA_RULES = {
  tithi: {
    favourable: ["Nandā (1 / 6 / 11) — joyful momentum", "Bhadrā (2 / 7 / 12) — noble foundational", "Pūrṇā (5 / 10 / 15) — completion"],
    avoid: ["Riktā (4 / 9 / 14) — first-pass excluded"],
    note: "Nandā/Bhadrā/Pūrṇā match travel momentum/completion; Riktā excluded.",
  },
  vara: {
    favourable: ["Thursday (Jupiter — universally favourable)", "Wednesday (Mercury)", "Friday (Venus)", "Monday (Moon)", "Sunday (Sun)"],
    avoid: ["Saturday (Saturn) — classically avoided for travel-initiation", "Tuesday (Mars) — generally avoided for routine travel"],
    note: "Direction-day-pairing refines vāra-selection per direction-of-travel.",
  },
  nakshatra: {
    favourable: [
      "Cara nakṣatras: Svātī, Punarvasu, Śravaṇa, Dhaniṣṭhā, Śatabhiṣā — MOST-favoured",
      "Mṛdu nakṣatras: Mṛgaśīrṣā, Citrā, Anurādhā, Revatī — comfortable travel",
      "Laghu nakṣatras: Aśvinī, Puṣya, Hasta — quick-completion",
    ],
    avoid: ["Ugra nakṣatras", "Tīkṣṇa nakṣatras"],
    note: "Cara nakṣatras directly match movement-momentum; Ugra/Tīkṣṇa excluded.",
  },
  yoga: {
    favourable: ["Sukarmā (7)", "Vṛddhi (11)", "Siddha (21)", "Siddhi (16)", "Brahma / Śubha / Sādhya"],
    avoid: ["Vyatīpāta", "Vaidhṛti", "Parigha (Tradition A)"],
    note: "Sukarmā/Vṛddhi/Siddhi match action + prosperity + accomplishment-completion for journey.",
  },
  karana: {
    favourable: ["Cara karaṇas: Bava, Bālava, Kaulava, Taitila, Garaja", "Vaṇija for commerce-travel"],
    avoid: ["Viṣṭi / Bhadrā-mukha"],
    note: "Cara karaṇas match movement-character; Vaṇija for commerce-travel.",
  },
} as const;

export const MOON_MERCURY_JUPITER_RULES = {
  strongSigns: [
    "Own sign (Moon: Karkaṭa; Mercury: Mithuna/Kanyā; Jupiter: Dhanu/Mīna)",
    "Exaltation (Moon: Vṛṣabha; Mercury: Kanyā; Jupiter: Karkaṭa)",
    "Friendly sign with benefic environment",
  ],
  weakSigns: [
    "Debilitation (Moon: Vṛścika; Mercury: Mīna; Jupiter: Makara)",
    "Combustion or heavy malefic affliction",
    "Placement in 6 / 8 / 12 unless well fortified",
  ],
  placement: ["Kendra (1 / 4 / 7 / 10)", "Trikoṇa (1 / 5 / 9)", "9th-house emphasis for long-journey/pilgrimage"],
  note: "Moon (momentum/comfort), Mercury (movement/communication), and Jupiter (dharma/pilgrimage) should be strong for optimal yātrā-muhūrta.",
} as const;

export const LAGNA_PROFILES = [
  { sign: "Meṣa", ruler: "Mars", quality: "favourable", note: "Cara-rāśi; movement-momentum matches travel directly." },
  { sign: "Karkaṭa", ruler: "Moon", quality: "favourable", note: "Cara-rāśi; nurturing-motion character." },
  { sign: "Tulā", ruler: "Venus", quality: "favourable", note: "Cara-rāśi; movement-momentum." },
  { sign: "Makara", ruler: "Saturn", quality: "favourable", note: "Cara-rāśi; disciplined long-journey character." },
  { sign: "Mithuna", ruler: "Mercury", quality: "mixed", note: "Acceptable — movement + communication." },
  { sign: "Dhanu", ruler: "Jupiter", quality: "mixed", note: "Acceptable for pilgrimage-travel specifically." },
  { sign: "Mīna", ruler: "Jupiter", quality: "mixed", note: "Acceptable for pilgrimage-travel specifically." },
  { sign: "Siṁha", ruler: "Sun", quality: "mixed", note: "Royal but less travel-momentum aligned." },
  { sign: "Vṛṣabha", ruler: "Venus", quality: "mixed", note: "Fixed sign; less aligned with movement." },
  { sign: "Vṛścika", ruler: "Mars", quality: "mixed", note: "Fixed sign; less aligned with movement." },
  { sign: "Kumbha", ruler: "Saturn", quality: "unfavourable", note: "Fixed sign; Saturn-ruled restraint less launch-aligned." },
  { sign: "Kanyā", ruler: "Mercury", quality: "unfavourable", note: "Mutable but Mercury debilitates here; caution for travel lagna." },
] as const;

export const HOUSE_BALA_NOTES = [
  { house: 1, label: "Self / Traveller", note: "Strong; lagna-lord well-placed." },
  { house: 3, label: "Short Travel", note: "Strong for short-journey content." },
  { house: 9, label: "Long Journey / Pilgrimage", note: "MOST-CENTRAL for long-journey + pilgrimage (dharma-foundation)." },
  { house: 12, label: "Foreign / Distant Travel", note: "Strong for distant or foreign travel." },
] as const;

export const CANCELLATION_DOSHAS = [
  {
    key: "rikta-tithi",
    label: "Riktā tithi",
    description: "Tithi 4 / 9 / 14 is first-pass excluded for yātrā-muhūrta.",
  },
  {
    key: "vyatipata-vaidhriti",
    label: "Vyatīpāta / Vaidhṛti yoga",
    description: "Cancellation-grade yogas independently disqualify a travel candidate.",
  },
  {
    key: "bhadra-mukha",
    label: "Bhadrā-mukha / Viṣṭi karaṇa",
    description: "The Viṣṭi/Bhadrā-mukha karaṇa is avoided for all general initiation contexts.",
  },
  {
    key: "saturday-vara",
    label: "Saturday vāra",
    description: "Saturday is classically avoided for auspicious travel-initiation.",
  },
  {
    key: "ugra-tikshna-nakshatra",
    label: "Ugra / Tīkṣṇa nakṣatra",
    description: "Ugra/Tīkṣṇa nakṣatras are excluded for yātrā-muhūrta.",
  },
  {
    key: "weak-moon-mercury-jupiter",
    label: "All three Moon + Mercury + Jupiter weak",
    description: "If the three travel significators are all weak, the candidate is ruled out.",
  },
] as const;

export const CANDIDATES: Candidate[] = [
  {
    id: "tuesday-brahma-south",
    label: "Tue ~5:00 AM IST · South",
    date: "Tuesday",
    time: "~5:00 AM IST (Brahma-muhūrta)",
    tagline: "Tirumala-pilgrimage ideal — Tuesday-South pairing + Brahma-muhūrta, not blocked by Disha-Śūla.",
    direction: "south",
    day: "tuesday",
    brahmaMuhurta: true,
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Dvitīyā Bhadrā", quality: "favourable", note: "Bhadrā tithi supports noble foundational travel." },
      { key: "vara", label: "Vāra", value: "Tuesday (Maṅgala)", quality: "mixed", note: "Tuesday-South pairing favoured for decisive pilgrimage; routine travel would avoid." },
      { key: "nakshatra", label: "Nakṣatra", value: "Punarvasu (Cara)", quality: "favourable", note: "Cara nakṣatra matches movement-momentum." },
      { key: "yoga", label: "Yoga", value: "Sukarmā", quality: "favourable", note: "Action + accomplishment yoga for journey." },
      { key: "karana", label: "Karaṇa", value: "Bava", quality: "favourable", note: "Cara karaṇa matches travel movement." },
    ],
    moonState: "favourable",
    moonNote: "Moon in a friendly/nurturing environment, supporting comfortable travel.",
    mercuryState: "favourable",
    mercuryNote: "Mercury well-placed for movement + communication.",
    jupiterState: "favourable",
    jupiterNote: "Jupiter strong — supports pilgrimage-dharma + long-journey.",
    lagnaSign: "Meṣa",
    lagnaQuality: "favourable",
    lagnaNote: "Cara-rāśi (movable) lagna matches travel-momentum directly.",
    houses: [
      { house: 1, label: "Self / Traveller", quality: "favourable", note: "Lagna-lord Mars strong in own sign." },
      { house: 3, label: "Short Travel", quality: "favourable", note: "3rd house supported." },
      { house: 9, label: "Long Journey / Pilgrimage", quality: "favourable", note: "9th lord Jupiter strong; most-central for pilgrimage." },
      { house: 12, label: "Foreign / Distant Travel", quality: "mixed", note: "12th acceptable for long-distance but not foreign." },
    ],
    doshas: [
      { key: "rikta-tithi", label: "Riktā tithi", triggered: false, note: "Dvitīyā Bhadrā is favoured." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: false, note: "Sukarmā yoga is favourable." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha / Viṣṭi karaṇa", triggered: false, note: "Bava karaṇa is favoured." },
      { key: "saturday-vara", label: "Saturday vāra", triggered: false, note: "Tuesday vāra." },
      { key: "ugra-tikshna-nakshatra", label: "Ugra / Tīkṣṇa nakṣatra", triggered: false, note: "Punarvasu is Cara/favourable." },
      { key: "weak-moon-mercury-jupiter", label: "All three Moon + Mercury + Jupiter weak", triggered: false, note: "All three significators are strong." },
    ],
    dishaSula: {
      triggered: false,
      direction: "south",
      note: "Tuesday's Disha-Śūla is North, not South — South-direction travel is NOT blocked.",
    },
    travellers: [
      {
        name: "Traveller A",
        role: "Primary pilgrim",
        natalStar: "Anurādhā",
        taraQuality: "favourable",
        taraNote: "Mitra-tārā — supportive for journey.",
        lagnaSign: "Meṣa",
        lagnaQuality: "favourable",
        lagnaNote: "Cara-rāśi lagna matches travel.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa reinforces travel-momentum.",
      },
      {
        name: "Traveller B",
        role: "Family member",
        natalStar: "Punarvasu",
        taraQuality: "favourable",
        taraNote: "Sādhaka-tārā supports action and travel.",
        lagnaSign: "Karkaṭa",
        lagnaQuality: "favourable",
        lagnaNote: "Cara-rāśi lagna matches travel.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa Moon-nature supportive.",
      },
    ],
    safetyContext: "Pilgrimage bus-departure at dawn; driving-safety hours acceptable; no medical-emergency or natural-hazard conflict.",
    recommendation:
      "Proceed / explore for pilgrimage-purpose South-direction travel. Tuesday-South direction-day-pairing is favourable, Disha-Śūla does not block South on Tuesday, Brahma-muhūrta adds universal favourability, and 9th-house (pilgrimage) is strong. Acknowledge Tuesday's general avoidance for routine travel is waived for decisive pilgrimage-purpose per limited-application exception.",
  },
  {
    id: "thursday-south",
    label: "Thu ~9:00 AM IST · South",
    date: "Thursday",
    time: "~9:00 AM IST",
    tagline: "Within-discipline conflict drill — Thursday is universally favourable BUT South-Disha-Śūla blocks.",
    direction: "south",
    day: "thursday",
    brahmaMuhurta: false,
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Pañcamī Pūrṇā", quality: "favourable", note: "Pūrṇā tithi matches completion." },
      { key: "vara", label: "Vāra", value: "Thursday (Guru)", quality: "favourable", note: "Thursday is universally favourable per direction-day-pairing." },
      { key: "nakshatra", label: "Nakṣatra", value: "Śravaṇa (Cara)", quality: "favourable", note: "Cara nakṣatra excellent for travel." },
      { key: "yoga", label: "Yoga", value: "Vṛddhi", quality: "favourable", note: "Growth/prosperity yoga." },
      { key: "karana", label: "Karaṇa", value: "Taitila", quality: "favourable", note: "Cara karaṇa favourable." },
    ],
    moonState: "favourable",
    moonNote: "Moon well-placed for comfortable travel.",
    mercuryState: "favourable",
    mercuryNote: "Mercury strong for movement/communication.",
    jupiterState: "favourable",
    jupiterNote: "Jupiter very strong — own/exaltation/friendly environment.",
    lagnaSign: "Dhanu",
    lagnaQuality: "mixed",
    lagnaNote: "Jupiter-ruled lagna favourable for pilgrimage; not Cara-rāśi but acceptable.",
    houses: [
      { house: 1, label: "Self / Traveller", quality: "favourable", note: "Jupiter-ruled lagna supports traveller." },
      { house: 3, label: "Short Travel", quality: "favourable", note: "3rd house supported." },
      { house: 9, label: "Long Journey / Pilgrimage", quality: "favourable", note: "9th strongly supported by Jupiter." },
      { house: 12, label: "Foreign / Distant Travel", quality: "mixed", note: "12th acceptable." },
    ],
    doshas: [
      { key: "rikta-tithi", label: "Riktā tithi", triggered: false, note: "Pañcamī Pūrṇā is favoured." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: false, note: "Vṛddhi yoga is favourable." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha / Viṣṭi karaṇa", triggered: false, note: "Taitila karaṇa." },
      { key: "saturday-vara", label: "Saturday vāra", triggered: false, note: "Thursday vāra." },
      { key: "ugra-tikshna-nakshatra", label: "Ugra / Tīkṣṇa nakṣatra", triggered: false, note: "Śravaṇa is Cara/favourable." },
      { key: "weak-moon-mercury-jupiter", label: "All three Moon + Mercury + Jupiter weak", triggered: false, note: "All three significators are strong." },
    ],
    dishaSula: {
      triggered: true,
      direction: "south",
      note: "Thursday has South-Disha-Śūla — South-direction travel is BLOCKED regardless of Thursday's universal favourability.",
    },
    travellers: [
      {
        name: "Traveller A",
        role: "Primary pilgrim",
        natalStar: "Anurādhā",
        taraQuality: "favourable",
        taraNote: "Favourable tārā-bala.",
        lagnaSign: "Dhanu",
        lagnaQuality: "mixed",
        lagnaNote: "Jupiter-ruled lagna for pilgrimage.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa supportive.",
      },
      {
        name: "Traveller B",
        role: "Family member",
        natalStar: "Rohiṇī",
        taraQuality: "favourable",
        taraNote: "Favourable tārā-bala.",
        lagnaSign: "Mīna",
        lagnaQuality: "mixed",
        lagnaNote: "Jupiter-ruled lagna for pilgrimage.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa supportive.",
      },
    ],
    safetyContext: "No safety constraints; this is a classic within-discipline conflict resolution drill.",
    recommendation:
      "Avoid for South-direction travel. This is the §1 hook conflict: Thursday is universally favourable per direction-day-pairing, but Disha-Śūla overrides direction-day-pairing when they conflict. Disha-Śūla is a pre-evaluation filter. Choose Tuesday or Sunday for South-direction pilgrimage instead.",
  },
  {
    id: "saturday-east",
    label: "Sat ~7:00 AM IST · East",
    date: "Saturday",
    time: "~7:00 AM IST",
    tagline: "Double-block drill — Saturday travel-initiation avoided + East-Disha-Śūla on Saturday.",
    direction: "east",
    day: "saturday",
    brahmaMuhurta: false,
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Navamī Riktā", quality: "unfavourable", note: "Riktā tithi first-pass excluded." },
      { key: "vara", label: "Vāra", value: "Saturday (Śani)", quality: "unfavourable", note: "Saturday classically avoided for auspicious travel-initiation." },
      { key: "nakshatra", label: "Nakṣatra", value: "Aśvinī (Laghu)", quality: "favourable", note: "Laghu nakṣatra quick-completion favourable, but cannot override doṣas." },
      { key: "yoga", label: "Yoga", value: "Vaidhṛti", quality: "unfavourable", note: "Cancellation-grade yoga — independently disqualifying." },
      { key: "karana", label: "Karaṇa", value: "Bhadrā-mukha", quality: "unfavourable", note: "Viṣṭi/Bhadrā-mukha avoided." },
    ],
    moonState: "mixed",
    moonNote: "Moon neutral; cancellation environment weakens benefit.",
    mercuryState: "mixed",
    mercuryNote: "Mercury not strongly placed under cancellation.",
    jupiterState: "favourable",
    jupiterNote: "Jupiter itself acceptable, but one strong planet cannot rescue a cancelled candidate.",
    lagnaSign: "Makara",
    lagnaQuality: "favourable",
    lagnaNote: "Cara-rāśi lagna matches travel, but Saturn-ruled; irrelevant under multiple doṣas.",
    houses: [
      { house: 1, label: "Self / Traveller", quality: "mixed", note: "Lagna acceptable but under stress." },
      { house: 3, label: "Short Travel", quality: "mixed", note: "3rd under stress." },
      { house: 9, label: "Long Journey / Pilgrimage", quality: "mixed", note: "9th under Saturnine pressure." },
      { house: 12, label: "Foreign / Distant Travel", quality: "mixed", note: "12th under stress." },
    ],
    doshas: [
      { key: "rikta-tithi", label: "Riktā tithi", triggered: true, note: "Navamī is Riktā (9) — first-pass exclusion." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: true, note: "Vaidhṛti yoga present — cancellation." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha / Viṣṭi karaṇa", triggered: true, note: "Bhadrā-mukha karaṇa present." },
      { key: "saturday-vara", label: "Saturday vāra", triggered: true, note: "Saturday avoided for travel-initiation." },
      { key: "ugra-tikshna-nakshatra", label: "Ugra / Tīkṣṇa nakṣatra", triggered: false, note: "Aśvinī is Laghu/favourable." },
      { key: "weak-moon-mercury-jupiter", label: "All three Moon + Mercury + Jupiter weak", triggered: false, note: "Jupiter is strong; Moon/Mercury mixed." },
    ],
    dishaSula: {
      triggered: true,
      direction: "east",
      note: "Saturday has East-Disha-Śūla — East-direction travel is BLOCKED.",
    },
    travellers: [
      {
        name: "Traveller A",
        role: "Primary traveller",
        natalStar: "Hasta",
        taraQuality: "mixed",
        taraNote: "Tārā-bala under cancellation context.",
        lagnaSign: "Makara",
        lagnaQuality: "favourable",
        lagnaNote: "Cara-rāśi lagna.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa stress noted.",
      },
      {
        name: "Traveller B",
        role: "Family member",
        natalStar: "Puṣya",
        taraQuality: "mixed",
        taraNote: "Tārā-bala under stress.",
        lagnaSign: "Tulā",
        lagnaQuality: "favourable",
        lagnaNote: "Cara-rāśi lagna.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa stress noted.",
      },
    ],
    safetyContext: "Routine travel; no safety emergency. Saturday avoidance + Disha-Śūla both apply.",
    recommendation:
      "Avoid. Multiple first-pass exclusions (Riktā tithi, Vaidhṛti yoga, Bhadrā-mukha, Saturday vāra) plus East-Disha-Śūla make this unsuitable. Even Makara Cara-rāśi lagna cannot override these doṣas. Select Sunday/Monday for East-direction travel, or Tuesday/Sunday for South-direction.",
  },
  {
    id: "sunday-west",
    label: "Sun ~6:30 AM IST · West",
    date: "Sunday",
    time: "~6:30 AM IST (near Brahma-muhūrta)",
    tagline: "West-direction on Sunday — direction-day-pairing mismatch + West-Disha-Śūla; mixed.",
    direction: "west",
    day: "sunday",
    brahmaMuhurta: true,
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Saptamī Bhadrā", quality: "favourable", note: "Bhadrā tithi favourable." },
      { key: "vara", label: "Vāra", value: "Sunday (Ravi)", quality: "mixed", note: "Sunday favours East, not West — direction-day-pairing mismatch." },
      { key: "nakshatra", label: "Nakṣatra", value: "Svātī (Cara)", quality: "favourable", note: "Cara nakṣatra excellent for travel." },
      { key: "yoga", label: "Yoga", value: "Siddhi", quality: "favourable", note: "Accomplishment yoga for journey." },
      { key: "karana", label: "Karaṇa", value: "Bālava", quality: "favourable", note: "Cara karaṇa favourable." },
    ],
    moonState: "favourable",
    moonNote: "Moon well-placed for comfortable travel.",
    mercuryState: "mixed",
    mercuryNote: "Mercury neutral; not a decisive factor.",
    jupiterState: "favourable",
    jupiterNote: "Jupiter strong supports pilgrimage/dharma dimension.",
    lagnaSign: "Tulā",
    lagnaQuality: "favourable",
    lagnaNote: "Cara-rāśi lagna matches travel-momentum.",
    houses: [
      { house: 1, label: "Self / Traveller", quality: "favourable", note: "Venus-ruled Cara lagna supports traveller." },
      { house: 3, label: "Short Travel", quality: "favourable", note: "3rd house supported." },
      { house: 9, label: "Long Journey / Pilgrimage", quality: "mixed", note: "9th acceptable but direction-conflict tempers." },
      { house: 12, label: "Foreign / Distant Travel", quality: "favourable", note: "12th supported for distant travel." },
    ],
    doshas: [
      { key: "rikta-tithi", label: "Riktā tithi", triggered: false, note: "Saptamī Bhadrā is favoured." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: false, note: "Siddhi yoga is favourable." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha / Viṣṭi karaṇa", triggered: false, note: "Bālava karaṇa." },
      { key: "saturday-vara", label: "Saturday vāra", triggered: false, note: "Sunday vāra." },
      { key: "ugra-tikshna-nakshatra", label: "Ugra / Tīkṣṇa nakṣatra", triggered: false, note: "Svātī is Cara/favourable." },
      { key: "weak-moon-mercury-jupiter", label: "All three Moon + Mercury + Jupiter weak", triggered: false, note: "Only Mercury is mixed; Moon/Jupiter strong." },
    ],
    dishaSula: {
      triggered: true,
      direction: "west",
      note: "Sunday has West-Disha-Śūla — West-direction travel is BLOCKED.",
    },
    travellers: [
      {
        name: "Traveller A",
        role: "Primary traveller",
        natalStar: "Svātī",
        taraQuality: "favourable",
        taraNote: "Mitra-tārā — supportive.",
        lagnaSign: "Tulā",
        lagnaQuality: "favourable",
        lagnaNote: "Cara-rāśi lagna matches travel.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa supportive.",
      },
      {
        name: "Traveller B",
        role: "Family member",
        natalStar: "Revatī",
        taraQuality: "favourable",
        taraNote: "Mitra-tārā — supportive.",
        lagnaSign: "Meṣa",
        lagnaQuality: "favourable",
        lagnaNote: "Cara-rāśi lagna matches travel.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa acceptable.",
      },
    ],
    safetyContext: "No safety emergency; routine long-distance travel. Brahma-muhūrta timing favourable but does not override Disha-Śūla per conservative default.",
    recommendation:
      "Mixed — with caveats. Pañcāṅga, Cara lagna, and Moon/Jupiter are strong; Brahma-muhūrta is favourable. However, Sunday-West is blocked by Disha-Śūla, and Sunday's direction-day-pairing favours East, not West. Per conservative default, maintain Disha-Śūla even within Brahma-muhūrta. If the family explicitly operates from a tradition-strand permitting Brahma-muhūrta-override, note the variance honestly; otherwise choose Friday for West-direction travel.",
  },
];

export function scoreCandidate(candidate: Candidate): {
  score: number;
  max: number;
  verdict: "proceed" | "mixed" | "avoid";
  label: string;
} {
  let score = 0;
  let max = 0;

  // Pañcāṅga: 5 factors × 2 points
  candidate.panchanga.forEach((factor) => {
    max += 2;
    if (factor.quality === "favourable") score += 2;
    else if (factor.quality === "mixed") score += 1;
  });

  // Moon + Mercury + Jupiter: 3 × 2 points
  [candidate.moonState, candidate.mercuryState, candidate.jupiterState].forEach((state) => {
    max += 2;
    if (state === "favourable") score += 2;
    else if (state === "mixed") score += 1;
  });

  // Lagna: 2 points
  max += 2;
  if (candidate.lagnaQuality === "favourable") score += 2;
  else if (candidate.lagnaQuality === "mixed") score += 1;

  // House bala: 4 houses × 1 point
  candidate.houses.forEach((house) => {
    max += 1;
    if (house.quality === "favourable") score += 1;
    else if (house.quality === "mixed") score += 0.5;
  });

  // Travellers: 2 travellers × 3 qualities × 1 point
  candidate.travellers?.forEach((traveller) => {
    [traveller.taraQuality, traveller.lagnaQuality, traveller.navamshaQuality].forEach((q) => {
      max += 1;
      if (q === "favourable") score += 1;
      else if (q === "mixed") score += 0.5;
    });
  });

  // Cancellation doṣa penalty
  const triggeredCount = candidate.doshas.filter((d) => d.triggered).length;
  if (triggeredCount > 0) {
    score = Math.max(0, score - triggeredCount * 5);
  }

  // Disha-Śūla penalty
  if (candidate.dishaSula.triggered) {
    score = Math.max(0, score - 4);
  }

  // Brahma-muhūrta bonus (does not override Disha-Śūla in conservative default, but adds score)
  if (candidate.brahmaMuhurta && !candidate.dishaSula.triggered) {
    score += 1;
  }

  let verdict: "proceed" | "mixed" | "avoid" = "avoid";
  let label = "Avoid";
  if (triggeredCount > 0 || candidate.dishaSula.triggered || score <= max * 0.45) {
    verdict = "avoid";
    label = "Avoid";
  } else if (score >= max * 0.75) {
    verdict = "proceed";
    label = "Proceed / Explore";
  } else {
    verdict = "mixed";
    label = "Mixed — verify";
  }

  return { score: Math.round(score), max, verdict, label };
}
