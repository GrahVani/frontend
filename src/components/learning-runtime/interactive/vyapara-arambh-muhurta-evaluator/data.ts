export type Quality = "favourable" | "mixed" | "unfavourable" | "neutral";

export type BusinessTypeKey = "commerce" | "financial" | "manufacturing" | "technology" | "leadership";

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

export interface FounderState {
  name: string;
  natalStar: string;
  taraQuality: Quality;
  taraNote: string;
  lagnaSign: string;
  lagnaQuality: Quality;
  lagnaNote: string;
  navamshaQuality: Quality;
  navamshaNote: string;
}

export interface DoshaState {
  key: string;
  label: string;
  triggered: boolean;
  note: string;
}

export interface Candidate {
  id: string;
  label: string;
  date: string;
  time: string;
  tagline: string;
  businessType: BusinessTypeKey;
  panchanga: PanchangaFactor[];
  mercuryState: Quality;
  mercuryNote: string;
  jupiterState: Quality;
  jupiterNote: string;
  lagnaSign: string;
  lagnaQuality: Quality;
  lagnaNote: string;
  houses: HouseState[];
  doshas: DoshaState[];
  founders: [FounderState, FounderState];
  recommendation: string;
}

export interface BusinessType {
  key: BusinessTypeKey;
  label: string;
  tagline: string;
  planetEmphasis: string[];
  vara: string;
  lagna: string;
  houses: string;
  exceptions?: string;
  note: string;
}

export interface LagnaProfile {
  sign: string;
  ruler: string;
  quality: Quality;
  note: string;
}

export const PANCHANGA_RULES = {
  tithi: {
    favourable: ["Pūrṇā (5 / 10 / 15)", "Nandā (1 / 6 / 11)", "Bhadrā (2 / 7 / 12)", "Jayā (3 / 8 / 13) acceptable"],
    avoid: ["Riktā (4 / 9 / 14) — no puccha-exception for business-launch"],
    note: "Pūrṇā + Nandā match completion/initiation character; Riktā is first-pass excluded.",
  },
  vara: {
    favourable: ["Wednesday (Budha — commerce) most-favoured", "Thursday (Guru — prosperity)", "Friday (Śukra — material gain)", "Sunday (Ravi — authority)", "Monday (Soma — nurturing)"],
    avoid: ["Tuesday (Maṅgala)", "Saturday (Śani) — general business-launch avoid"],
    note: "Mercury-day is optimal for commerce; manufacturing has a limited Tuesday/Saturday exception.",
  },
  nakshatra: {
    favourable: ["Hasta (Laghu — skilled commerce)", "Puṣya (nakṣatra-rāja)", "Citrā (Mṛdu — creation)", "Anurādhā (Mṛdu — partnership)", "Sthira / Cara nakṣatras per business-type"],
    avoid: ["Ugra nakṣatras", "Tīkṣṇa nakṣatras"],
    note: "Hasta and Puṣya are the business-launch standouts; Ugra/Tīkṣṇa are excluded.",
  },
  yoga: {
    favourable: ["Siddhi (accomplishment)", "Sukarmā", "Vṛddhi", "Sādhya", "Varīyān", "Brahma / Śubha / Aindra"],
    avoid: ["Vyatīpāta", "Vaidhṛti", "Parigha (Tradition A)"],
    note: "Siddhi-yoga is name-character ideal for accomplishment-oriented launches.",
  },
  karana: {
    favourable: ["Vaṇija (trader/commerce) — most-favoured", "Bava", "Bālava", "Kaulava", "Taitila", "Garaja"],
    avoid: ["Viṣṭi / Bhadrā-mukha"],
    note: "Vaṇija-karaṇa directly matches the business-launch character.",
  },
} as const;

export const MERCURY_JUPITER_RULES = {
  strongSigns: [
    "Own sign (Mercury: Mithuna / Kanyā; Jupiter: Dhanu / Mīna)",
    "Exaltation (Mercury: Kanyā; Jupiter: Karkaṭa)",
    "Friendly sign with benefic aspect environment",
  ],
  weakSigns: [
    "Debilitation (Mercury: Mīna; Jupiter: Makara)",
    "Combustion (Mercury ~10° of Sun; Jupiter ~11°)",
    "Malefic affliction outside upacaya",
  ],
  placement: ["Kendra (1 / 4 / 7 / 10)", "Trikoṇa (1 / 5 / 9)", "11th upacaya for gains"],
  note: "Both Mercury AND Jupiter must be strong for a business-launch recommendation. Weakness in either modulates; both weak rules the candidate out.",
} as const;

export const CANCELLATION_DOSHAS = [
  {
    key: "rikta-tithi",
    label: "Riktā tithi",
    description: "Tithi 4 / 9 / 14 is first-pass excluded for business-launch (no Gaṇeśa/Śiva exception).",
  },
  {
    key: "vyatipata-vaidhriti",
    label: "Vyatīpāta / Vaidhṛti yoga",
    description: "Cancellation-grade yogas independently disqualify a business-launch candidate.",
  },
  {
    key: "bhadra-mukha",
    label: "Bhadrā-mukha / Viṣṭi karaṇa",
    description: "The Viṣṭi/Bhadrā-mukha karaṇa is avoided for all general initiation contexts.",
  },
  {
    key: "tuesday-saturday",
    label: "Tuesday / Saturday vāra",
    description: "Mars- and Saturn-days are generally avoided; only heavy-industrial launches have a narrow exception.",
  },
  {
    key: "ugra-tikshna-nakshatra",
    label: "Ugra / Tīkṣṇa nakṣatra",
    description: "Jyeṣṭhā, Mūla, Ārdrā, Bharaṇī etc. are excluded for business-launch (no general tantric exception).",
  },
  {
    key: "weak-mercury-jupiter",
    label: "Both Mercury & Jupiter weak",
    description: "If Mercury (commerce) and Jupiter (prosperity) are both weak, the candidate is ruled out.",
  },
] as const;

export const LAGNA_PROFILES: LagnaProfile[] = [
  { sign: "Mithuna", ruler: "Mercury", quality: "favourable", note: "Most favoured for general business — commerce character." },
  { sign: "Kanyā", ruler: "Mercury", quality: "favourable", note: "Mercury own/exaltation sign; excellent for technology/intellectual business." },
  { sign: "Vṛṣabha", ruler: "Venus", quality: "favourable", note: "Strongly favoured — material prosperity + financial business affinity." },
  { sign: "Siṁha", ruler: "Sun", quality: "favourable", note: "Strongly favoured for leadership/authority business." },
  { sign: "Tulā", ruler: "Venus", quality: "favourable", note: "Venus-ruled; partnership-business friendly." },
  { sign: "Dhanu", ruler: "Jupiter", quality: "favourable", note: "Jupiter own sign; wisdom-tradition + prosperity." },
  { sign: "Mīna", ruler: "Jupiter", quality: "favourable", note: "Jupiter own sign; wisdom-tradition support." },
  { sign: "Karkaṭa", ruler: "Moon", quality: "mixed", note: "Less business-launch aligned per regional variants." },
  { sign: "Vṛścika", ruler: "Mars", quality: "mixed", note: "Aggressive/domestic character less aligned with launch." },
  { sign: "Makara", ruler: "Saturn", quality: "unfavourable", note: "Saturn-ruled restraint character; avoided for business-launch." },
  { sign: "Kumbha", ruler: "Saturn", quality: "unfavourable", note: "Saturn-ruled; discipline-restraint less launch-aligned." },
  { sign: "Meṣa", ruler: "Mars", quality: "unfavourable", note: "Mars-ruled impulsion; not preferred for general business-launch." },
] as const;

export const HOUSE_BALA_NOTES = [
  { house: 1, label: "Self / Founder", note: "Strong lagna-lord; lagna sign favourable." },
  { house: 2, label: "Wealth / Finances", note: "Benefic occupant (Mercury/Jupiter/Venus) very favourable." },
  { house: 10, label: "Career / Karma", note: "Most-central for business-launch alongside 11th." },
  { house: 11, label: "Gains / Profit", note: "Most-central; malefic in upacaya can energise growth." },
] as const;

export const BUSINESS_TYPES: BusinessType[] = [
  {
    key: "commerce",
    label: "Commerce / Trade",
    tagline: "Mercury + Vaṇija + Wednesday + Mithuna/Kanyā",
    planetEmphasis: ["Mercury (vyāpāra-tattva)", "Vaṇija-karaṇa"],
    vara: "Wednesday (Budha-vāra)",
    lagna: "Mithuna / Kanyā (Mercury-ruled)",
    houses: "2nd + 11th",
    note: "Emphasises transactional momentum: Mercury-day, Vaṇija-karaṇa, Mercury lagna, and the wealth-gains axis.",
  },
  {
    key: "financial",
    label: "Financial / Banking",
    tagline: "Venus + Vṛṣabha + Jupiter + 2nd house",
    planetEmphasis: ["Venus (material prosperity)", "Jupiter (prosperity-significator)"],
    vara: "Friday / Thursday",
    lagna: "Vṛṣabha (Venus-ruled)",
    houses: "2nd most-central; 11th strong",
    note: "Wealth-content dominates: Venus-ruled lagna, strong Jupiter, and fortified 2nd/11th houses.",
  },
  {
    key: "manufacturing",
    label: "Manufacturing / Industrial",
    tagline: "Mars-energy + upacaya + 6th house strength",
    planetEmphasis: ["Mars (energetic production)", "Saturn (long-duration foundation)"],
    vara: "Tuesday / Saturday — limited exception only",
    lagna: "Makara/Kumbha acceptable only for heavy infrastructure",
    houses: "6th + upacaya (3/6/10/11)",
    exceptions: "Tuesday/Saturday exception applies narrowly to heavy-industrial/infrastructure launches.",
    note: "Production-energy matching: Mars upacaya, 6th-house discipline, and a narrow weekday exception.",
  },
  {
    key: "technology",
    label: "Technology / Intellectual",
    tagline: "Mercury + Saturn-discipline + 5th + 11th",
    planetEmphasis: ["Mercury (intellect + commerce)", "Saturn (technical discipline)"],
    vara: "Wednesday best; Thursday / Sunday / Friday acceptable",
    lagna: "Mithuna / Kanyā; Vṛṣabha / Tulā for partnership",
    houses: "5th (intelligence) + 11th (gains); 10th retains centrality",
    note: "The §1 hook business-type: intellectual-creativity plus disciplined execution; Mercury is most-central.",
  },
  {
    key: "leadership",
    label: "Leadership / Authority",
    tagline: "Sun + Siṁha + 10th house",
    planetEmphasis: ["Sun (authority)", "Jupiter (wisdom-leadership)"],
    vara: "Sunday (Ravi-vāra)",
    lagna: "Siṁha (Sun-ruled)",
    houses: "10th most-central; 1st + 11th strong",
    note: "Authority-content business: Sun-ruled lagna, Sunday vāra, and a dominant 10th house.",
  },
] as const;

export const CANDIDATES: Candidate[] = [
  {
    id: "oct-21",
    label: "Oct 21 ~10:00 AM IST",
    date: "Wednesday, 21 Oct",
    time: "~10:00 AM IST",
    tagline: "Strong pañcāṅga, but Mercury sits near the combustion edge.",
    businessType: "technology",
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Trayodaśī Jayā", quality: "favourable", note: "Jayā tithi supports success-victory in competitive tech context." },
      { key: "vara", label: "Vāra", value: "Wednesday (Budha)", quality: "favourable", note: "Mercury-day is ideal for technology/commerce launch." },
      { key: "nakshatra", label: "Nakṣatra", value: "Hasta (Laghu)", quality: "favourable", note: "Skilled-handcraft + commerce nakṣatra; excellent for business." },
      { key: "yoga", label: "Yoga", value: "Siddhi", quality: "favourable", note: "Accomplishment-yoga is name-character ideal for launches." },
      { key: "karana", label: "Karaṇa", value: "Vaṇija", quality: "favourable", note: "Vaṇija = trader; directly matches business initiation." },
    ],
    mercuryState: "mixed",
    mercuryNote: "Mercury in Kanyā is strong by sign, but within ~8° of the Sun — combustion caution tempers the rating.",
    jupiterState: "favourable",
    jupiterNote: "Jupiter in Vṛṣabha friendly sign, placed in a kendra/trikoṇa environment; not combust.",
    lagnaSign: "Mithuna",
    lagnaQuality: "favourable",
    lagnaNote: "Mercury-ruled lagna is most-favoured for technology and commerce business.",
    houses: [
      { house: 1, label: "Self / Founder", quality: "favourable", note: "Lagna-lord Mercury strong; Mercury-ruled sign rising." },
      { house: 2, label: "Wealth / Finances", quality: "favourable", note: "Jupiter glance supports wealth-content." },
      { house: 10, label: "Career / Karma", quality: "favourable", note: "Mercury aspects the action-house." },
      { house: 11, label: "Gains / Profit", quality: "mixed", note: "Saturn aspect from 8th slows gain-momentum; still upacaya." },
    ],
    doshas: [
      { key: "rikta-tithi", label: "Riktā tithi", triggered: false, note: "Trayodaśī Jayā is not Riktā." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: false, note: "Siddhi yoga is favourable." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha / Viṣṭi karaṇa", triggered: false, note: "Vaṇija karaṇa is favoured." },
      { key: "tuesday-saturday", label: "Tuesday / Saturday vāra", triggered: false, note: "Wednesday vāra." },
      { key: "ugra-tikshna-nakshatra", label: "Ugra / Tīkṣṇa nakṣatra", triggered: false, note: "Hasta is Laghu/commerce-favourable." },
      { key: "weak-mercury-jupiter", label: "Both Mercury & Jupiter weak", triggered: false, note: "Jupiter is strong; Mercury is mixed, not weak." },
    ],
    founders: [
      {
        name: "Founder A",
        natalStar: "Anurādhā",
        taraQuality: "favourable",
        taraNote: "Sādhaka-tārā supports action and gain.",
        lagnaSign: "Vṛṣabha",
        lagnaQuality: "favourable",
        lagnaNote: "Venus-ruled lagna aligns with prosperity-content.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa correspondence is acceptable, not exceptional.",
      },
      {
        name: "Founder B",
        natalStar: "Puṣya",
        taraQuality: "favourable",
        taraNote: "Mitra-tārā — supportive relationship.",
        lagnaSign: "Kanyā",
        lagnaQuality: "favourable",
        lagnaNote: "Mercury-ruled lagna matches technology business.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa reinforces Mercury strength.",
      },
    ],
    recommendation:
      "Good candidate with one caution: Mercury's combustion proximity requires precise pāda-level verification. If combustion is confirmed outside the exact muhūrta window, this becomes a strong proceed.",
  },
  {
    id: "oct-28",
    label: "Oct 28 ~10:00 AM IST",
    date: "Wednesday, 28 Oct",
    time: "~10:00 AM IST",
    tagline: "Standout: Mercury own/exaltation in 5th + Jupiter strong in lagna.",
    businessType: "technology",
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Daśamī Pūrṇā", quality: "favourable", note: "Pūrṇā tithi matches completion/initiation." },
      { key: "vara", label: "Vāra", value: "Wednesday (Budha)", quality: "favourable", note: "Mercury-day most-favoured for technology/commerce." },
      { key: "nakshatra", label: "Nakṣatra", value: "Puṣya (nakṣatra-rāja)", quality: "favourable", note: "Puṣya is universally auspicious and nourishing." },
      { key: "yoga", label: "Yoga", value: "Vṛddhi", quality: "favourable", note: "Growth/prosperity yoga supports business expansion." },
      { key: "karana", label: "Karaṇa", value: "Vaṇija", quality: "favourable", note: "Trader-karaṇa is ideal for business initiation." },
    ],
    mercuryState: "favourable",
    mercuryNote: "Mercury in Kanyā (own + exaltation) in 5th trikoṇa, not combust, aspects 11th house of gains — very strong.",
    jupiterState: "favourable",
    jupiterNote: "Jupiter in Vṛṣabha friendly sign in 1st kendra; aspects 5th-house Mercury (mutual exchange) — strong.",
    lagnaSign: "Vṛṣabha",
    lagnaQuality: "favourable",
    lagnaNote: "Venus-ruled lagna brings material prosperity and partnership stability.",
    houses: [
      { house: 1, label: "Self / Founder", quality: "favourable", note: "Jupiter in lagna strengthens wisdom + prosperity environment." },
      { house: 2, label: "Wealth / Finances", quality: "favourable", note: "Benefic influence on wealth-content." },
      { house: 10, label: "Career / Karma", quality: "favourable", note: "10th lord well placed; action-house supported." },
      { house: 11, label: "Gains / Profit", quality: "favourable", note: "Mercury aspects 11th; gain-house strongly favoured." },
    ],
    doshas: [
      { key: "rikta-tithi", label: "Riktā tithi", triggered: false, note: "Daśamī Pūrṇā is favoured." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: false, note: "Vṛddhi yoga is growth-oriented." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha / Viṣṭi karaṇa", triggered: false, note: "Vaṇija karaṇa." },
      { key: "tuesday-saturday", label: "Tuesday / Saturday vāra", triggered: false, note: "Wednesday vāra." },
      { key: "ugra-tikshna-nakshatra", label: "Ugra / Tīkṣṇa nakṣatra", triggered: false, note: "Puṣya is the nakṣatra-rāja." },
      { key: "weak-mercury-jupiter", label: "Both Mercury & Jupiter weak", triggered: false, note: "Both Mercury and Jupiter are strong." },
    ],
    founders: [
      {
        name: "Founder A",
        natalStar: "Anurādhā",
        taraQuality: "favourable",
        taraNote: "Sādhaka-tārā — favourable for action.",
        lagnaSign: "Vṛṣabha",
        lagnaQuality: "favourable",
        lagnaNote: "Venus-ruled lagna matches prosperity-context.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa reinforces Vṛṣabha-lagna strength.",
      },
      {
        name: "Founder B",
        natalStar: "Puṣya",
        taraQuality: "favourable",
        taraNote: "Mitra-tārā — supportive.",
        lagnaSign: "Kanyā",
        lagnaQuality: "favourable",
        lagnaNote: "Mercury-ruled lagna matches technology emphasis.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa Mercury dignity is good.",
      },
    ],
    recommendation:
      "Proceed / explore. Oct 28 aligns with the technology-services business-type refinement: Mercury very-strong in Kanyā 5th, Jupiter strong in lagna, favourable Wednesday vāra, Puṣya nakṣatra, and Vaṇija karaṇa. Verify pāda-precision and both founders' tārā-bala at the exact window.",
  },
  {
    id: "nov-4",
    label: "Nov 4 ~10:00 AM IST",
    date: "Wednesday, 4 Nov",
    time: "~10:00 AM IST",
    tagline: "Cancellation-doṣa drill — Vyatīpāta + Jyeṣṭhā rule this out.",
    businessType: "technology",
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Trayodaśī Jayā", quality: "favourable", note: "Jayā tithi is success-oriented." },
      { key: "vara", label: "Vāra", value: "Wednesday (Budha)", quality: "favourable", note: "Mercury-day is good." },
      { key: "nakshatra", label: "Nakṣatra", value: "Jyeṣṭhā (Ugra)", quality: "unfavourable", note: "Jyeṣṭhā is Ugra and avoided for business-launch." },
      { key: "yoga", label: "Yoga", value: "Vyatīpāta", quality: "unfavourable", note: "Vyatīpāta is a cancellation-grade yoga." },
      { key: "karana", label: "Karaṇa", value: "Bava", quality: "favourable", note: "Favourable cara karaṇa, but cannot override cancellation." },
    ],
    mercuryState: "mixed",
    mercuryNote: "Mercury not strongly placed; the cancellation environment weakens its commercial benefit.",
    jupiterState: "favourable",
    jupiterNote: "Jupiter itself is acceptable, but one strong planet cannot rescue a cancelled candidate.",
    lagnaSign: "Kanyā",
    lagnaQuality: "favourable",
    lagnaNote: "Mercury-ruled lagna is favourable, yet irrelevant under cancellation.",
    houses: [
      { house: 1, label: "Self / Founder", quality: "favourable", note: "Kanyā lagna is favourable." },
      { house: 2, label: "Wealth / Finances", quality: "mixed", note: "Wealth-content acceptable but under stress." },
      { house: 10, label: "Career / Karma", quality: "mixed", note: "10th under pressure from cancellation." },
      { house: 11, label: "Gains / Profit", quality: "mixed", note: "Gains possible but environment unstable." },
    ],
    doshas: [
      { key: "rikta-tithi", label: "Riktā tithi", triggered: false, note: "Trayodaśī Jayā is not Riktā." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: true, note: "Vyatīpāta yoga present — independently disqualifying." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha / Viṣṭi karaṇa", triggered: false, note: "Bava karaṇa." },
      { key: "tuesday-saturday", label: "Tuesday / Saturday vāra", triggered: false, note: "Wednesday vāra." },
      { key: "ugra-tikshna-nakshatra", label: "Ugra / Tīkṣṇa nakṣatra", triggered: true, note: "Jyeṣṭhā is Ugra and avoided." },
      { key: "weak-mercury-jupiter", label: "Both Mercury & Jupiter weak", triggered: false, note: "Jupiter is strong." },
    ],
    founders: [
      {
        name: "Founder A",
        natalStar: "Anurādhā",
        taraQuality: "mixed",
        taraNote: "Tārā-bala mixed under cancellation context.",
        lagnaSign: "Kanyā",
        lagnaQuality: "favourable",
        lagnaNote: "Mercury-ruled lagna.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa stress noted.",
      },
      {
        name: "Founder B",
        natalStar: "Puṣya",
        taraQuality: "mixed",
        taraNote: "Tārā-bala mixed.",
        lagnaSign: "Mithuna",
        lagnaQuality: "favourable",
        lagnaNote: "Mercury-ruled lagna.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa stress noted.",
      },
    ],
    recommendation:
      "Avoid. Vyatīpāta yoga alone cancels the muhūrta; Jyeṣṭhā Ugra nakṣatra reinforces the avoidance. No lagna or Jupiter strength can override a first-pass cancellation.",
  },
  {
    id: "nov-11",
    label: "Nov 11 ~10:00 AM IST",
    date: "Wednesday, 11 Nov",
    time: "~10:00 AM IST",
    tagline: "Mercury debilitated + Riktā tithi + Bhadrā-mukha — disqualified.",
    businessType: "technology",
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Navamī Riktā", quality: "unfavourable", note: "Riktā tithi is first-pass excluded for business-launch." },
      { key: "vara", label: "Vāra", value: "Wednesday (Budha)", quality: "favourable", note: "Wednesday is good, but cannot override multiple doṣas." },
      { key: "nakshatra", label: "Nakṣatra", value: "Mūla (Tīkṣṇa)", quality: "unfavourable", note: "Mūla is Tīkṣṇa and avoided." },
      { key: "yoga", label: "Yoga", value: "Vaidhṛti", quality: "unfavourable", note: "Vaidhṛti is a cancellation-grade yoga." },
      { key: "karana", label: "Karaṇa", value: "Bhadrā-mukha", quality: "unfavourable", note: "Bhadrā-mukha / Viṣṭi is avoided." },
    ],
    mercuryState: "unfavourable",
    mercuryNote: "Mercury in Mīna (debilitation), combust within ~9° of Sun — very weak for commerce-significator.",
    jupiterState: "mixed",
    jupiterNote: "Jupiter not combust but in neutral sign without strong benefic support.",
    lagnaSign: "Makara",
    lagnaQuality: "unfavourable",
    lagnaNote: "Saturn-ruled lagna is avoided for business-launch per classical wedding-parallel.",
    houses: [
      { house: 1, label: "Self / Founder", quality: "unfavourable", note: "Saturn-ruled lagna restrains launch momentum." },
      { house: 2, label: "Wealth / Finances", quality: "mixed", note: "Wealth-content stressed by debilitated Mercury." },
      { house: 10, label: "Career / Karma", quality: "mixed", note: "10th under Saturnine pressure." },
      { house: 11, label: "Gains / Profit", quality: "mixed", note: "Gains possible but weak significator environment." },
    ],
    doshas: [
      { key: "rikta-tithi", label: "Riktā tithi", triggered: true, note: "Navamī is Riktā (9) — first-pass exclusion." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: true, note: "Vaidhṛti yoga present — cancellation." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha / Viṣṭi karaṇa", triggered: true, note: "Bhadrā-mukha karaṇa present." },
      { key: "tuesday-saturday", label: "Tuesday / Saturday vāra", triggered: false, note: "Wednesday vāra." },
      { key: "ugra-tikshna-nakshatra", label: "Ugra / Tīkṣṇa nakṣatra", triggered: true, note: "Mūla is Tīkṣṇa and avoided." },
      { key: "weak-mercury-jupiter", label: "Both Mercury & Jupiter weak", triggered: false, note: "Jupiter is mixed, not weak; Mercury is weak." },
    ],
    founders: [
      {
        name: "Founder A",
        natalStar: "Anurādhā",
        taraQuality: "mixed",
        taraNote: "Tārā-bala under stress.",
        lagnaSign: "Makara",
        lagnaQuality: "unfavourable",
        lagnaNote: "Saturn-ruled lagna.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa correspondence stressed.",
      },
      {
        name: "Founder B",
        natalStar: "Puṣya",
        taraQuality: "mixed",
        taraNote: "Tārā-bala under stress.",
        lagnaSign: "Kumbha",
        lagnaQuality: "unfavourable",
        lagnaNote: "Saturn-ruled lagna.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa correspondence stressed.",
      },
    ],
    recommendation:
      "Avoid. Multiple first-pass exclusions (Riktā tithi, Vaidhṛti yoga, Bhadrā-mukha, Mūla nakṣatra) plus debilitated Mercury and a Saturn-ruled lagna make this unsuitable for business-launch.",
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

  // Mercury + Jupiter: 2 × 2 points
  [candidate.mercuryState, candidate.jupiterState].forEach((state) => {
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

  // Founders: 2 founders × 3 qualities × 1 point
  candidate.founders.forEach((founder) => {
    [founder.taraQuality, founder.lagnaQuality, founder.navamshaQuality].forEach((q) => {
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

  let verdict: "proceed" | "mixed" | "avoid" = "avoid";
  let label = "Avoid";
  if (triggeredCount > 0 || score <= max * 0.45) {
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
