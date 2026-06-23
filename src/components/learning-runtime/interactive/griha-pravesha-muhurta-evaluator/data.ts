export type Quality = "favourable" | "mixed" | "unfavourable" | "neutral";

export type GrihaTypeKey = "apurva" | "sapurva" | "dvandva";

export type SeasonalDoshaKey = "dakshinayana" | "adhikamasa" | "samkranti";

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

export interface FamilyMemberState {
  name: string;
  relation: string;
  natalStar: string;
  taraQuality: Quality;
  taraNote: string;
  lagnaSign: string;
  lagnaQuality: Quality;
  lagnaNote: string;
  navamshaQuality: Quality;
  navamshaNote: string;
}

export interface SeasonalDosha {
  key: SeasonalDoshaKey;
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
  grihaType: GrihaTypeKey;
  panchanga: PanchangaFactor[];
  venusState: Quality;
  venusNote: string;
  moonState: Quality;
  moonNote: string;
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
  seasonalDoshas: SeasonalDosha[];
  familyMembers: [FamilyMemberState, FamilyMemberState];
  recommendation: string;
}

export interface GrihaPraveshaType {
  key: GrihaTypeKey;
  label: string;
  devanagari: string;
  significance: string;
  application: string;
  note: string;
}

export const GRIHA_PRAVESHA_TYPES: GrihaPraveshaType[] = [
  {
    key: "apurva",
    label: "Apūrva",
    devanagari: "अपूर्व",
    significance: "First occupation of a newly-constructed home — most significant.",
    application:
      "Full integrated four-pillar capstone + griha-praveśa-specific application + pāda-precision warranted.",
    note: "This is the default high-stakes case; use the complete evaluation framework.",
  },
  {
    key: "sapurva",
    label: "Sa-pūrva",
    devanagari: "सपूर्व",
    significance: "Re-occupation after renovation or long absence (>6 months) — intermediate significance.",
    application:
      "Modified application per regional-tradition variants; honest articulation of within-tradition variance required.",
    note: "Some traditions apply the full apūrva framework; others apply a lighter modified form.",
  },
  {
    key: "dvandva",
    label: "Dvandva",
    devanagari: "द्वन्द्व",
    significance: "Re-occupation after fire, flood, earthquake or prolonged dilapidation — specific significance.",
    application:
      "Specific purification + Vāstu-related remediation observances alongside muhūrta-selection; cross-discipline referral warranted.",
    note: "Muhūrta-selection coordinates with purification; Vāstu-expert + dharma-tradition priest engagement is beyond the muhūrta-practitioner scope alone.",
  },
] as const;

export const PANCHANGA_RULES = {
  tithi: {
    favourable: ["Bhadrā (2 / 7 / 12) — noble-foundational", "Pūrṇā (5 / 10 / 15) — completion-integration"],
    avoid: ["Riktā (4 / 9 / 14) — cancellation-grade for initiations"],
    note: "Bhadrā tithis match home-foundation character; Pūrṇā matches occupation-completion. Riktā is first-pass excluded.",
  },
  vara: {
    favourable: ["Monday (Soma — domesticity)", "Wednesday (Budha)", "Thursday (Guru)", "Friday (Śukra)"],
    avoid: ["Tuesday (Maṅgala)", "Saturday (Śani)"],
    note: "Monday's Moon-domesticity character is most aligned; Mercury/Jupiter/Venus also favourable. Tuesday/Saturday avoided.",
  },
  nakshatra: {
    favourable: [
      "Sthira nakṣatras: Rohiṇī, Uttaraphālguṇī, Uttarāṣāḍhā, Uttarabhādrapadā — most favoured",
      "Mṛdu nakṣatras: Mṛgaśīrṣā, Citrā, Anurādhā, Revatī — strongly favoured",
      "Hasta, Puṣya, Svātī, Punarvasu — acceptable",
    ],
    avoid: ["Ugra nakṣatras", "Tīkṣṇa nakṣatras"],
    note: "Sthira nakṣatras directly match foundational-permanence; Mṛdu matches domestic-aesthetic substance.",
  },
  yoga: {
    favourable: ["Dhruva (12) — firm-fixed, matches home-permanence", "Sukarmā, Vṛddhi, Brahma, Śubha, Sādhya"],
    avoid: ["Vyatīpāta", "Vaidhṛti", "Parigha (Tradition A)"],
    note: "Dhruva-yoga's fixed character is name-character ideal for griha-praveśa; Vyatīpāta/Vaidhṛti cancel.",
  },
  karana: {
    favourable: ["Kaulava — kula/family-lineage character", "Bava, Bālava, Taitila, Garaja — favourable cara karaṇas"],
    avoid: ["Viṣṭi / Bhadrā-mukha"],
    note: "Kaulava specifically matches family-home lineage; Bava has saṁskāra-affinity. Bhadrā-mukha first-pass excluded.",
  },
} as const;

export const VENUS_MOON_JUPITER_RULES = {
  strongSigns: [
    "Own sign (Venus: Vṛṣabha/Tulā; Moon: Karkaṭa; Jupiter: Dhanu/Mīna)",
    "Exaltation (Venus: Mīna; Moon: Vṛṣabha; Jupiter: Karkaṭa)",
    "Friendly sign with benefic environment",
  ],
  weakSigns: [
    "Debilitation (Venus: Kanyā; Moon: Vṛścika; Jupiter: Makara)",
    "Combustion or heavy malefic affliction",
    "Placement in 6 / 8 / 12 unless well fortified",
  ],
  placement: ["Kendra (1 / 4 / 7 / 10)", "Trikoṇa (1 / 5 / 9)", "4th house emphasis for home-substance"],
  note: "Venus (comfort/aesthetics), Moon (nurturing/domestic), and Jupiter (expansion/benediction) should all be strong for an optimal griha-praveśa recommendation.",
} as const;

export const SEASONAL_DOSHA_RULES = {
  dakshinayana: {
    label: "Dakṣiṇāyana avoidance",
    period: "~Karkaṭa-Saṁkrānti (mid-July) through Makara-Saṁkrānti (mid-January) per Nirayaṇa",
    note: "Sun's southward movement; classically avoided for griha-praveśa. Northern-tradition strong-application; southern-tradition less-stringent. Emergency/rental exceptions per regional variants.",
  },
  adhikamasa: {
    label: "Adhika-Māsa avoidance",
    period: "Intercalary lunar-month occurring ~every 32 months",
    note: "Extra month without Saṁkrānti anchoring; classically avoided for auspicious initiations across traditions.",
  },
  samkranti: {
    label: "Saṁkrānti day avoidance",
    period: "12 solar-ingress days per year",
    note: "Transition-day into new rāśi; transition-character is unfavourable for foundation-establishment.",
  },
} as const;

export const LAGNA_PROFILES = [
  { sign: "Vṛṣabha", ruler: "Venus", quality: "favourable", note: "Most favoured — Venus + Earth-element foundational matching." },
  { sign: "Siṁha", ruler: "Sun", quality: "favourable", note: "Sthira-rāśi; foundational-permanence character." },
  { sign: "Vṛścika", ruler: "Mars", quality: "favourable", note: "Sthira-rāśi; fixed permanence matching home-foundation." },
  { sign: "Kumbha", ruler: "Saturn", quality: "favourable", note: "Sthira-rāśi; fixed permanence." },
  { sign: "Karkaṭa", ruler: "Moon", quality: "favourable", note: "Strongly favoured — domesticity-character; Moon-ruled home-substance." },
  { sign: "Mithuna", ruler: "Mercury", quality: "mixed", note: "Acceptable — communication for family-home content." },
  { sign: "Kanyā", ruler: "Mercury", quality: "mixed", note: "Acceptable — Mercury family-home communication." },
  { sign: "Dhanu", ruler: "Jupiter", quality: "mixed", note: "Acceptable — Jupiter prosperity + wisdom-tradition." },
  { sign: "Mīna", ruler: "Jupiter", quality: "mixed", note: "Acceptable — Jupiter prosperity + wisdom-tradition." },
  { sign: "Meṣa", ruler: "Mars", quality: "unfavourable", note: "Less favoured — cara momentum less aligned with permanent foundation." },
  { sign: "Tulā", ruler: "Venus", quality: "unfavourable", note: "Less favoured — cara momentum less aligned with permanent foundation." },
  { sign: "Makara", ruler: "Saturn", quality: "unfavourable", note: "Avoided — Saturn-ruled restraint less aligned with griha-praveśa warmth." },
] as const;

export const HOUSE_BALA_NOTES = [
  { house: 1, label: "Self / Inhabitant", note: "Strong lagna-lord; lagna favourable per griha-praveśa affinity." },
  { house: 2, label: "Family / Kuṭumba", note: "Strong; family-content matching family-home character." },
  { house: 4, label: "Home / Foundation / Sukha", note: "MOST-CENTRAL — sukha-sthāna; 4th-lord well-placed; benefic occupant ideal." },
  { house: 11, label: "Gains / Fulfillment", note: "Strong; vṛddhi-growth-substance matching 11th-house fulfillment." },
] as const;

export const CANCELLATION_DOSHAS = [
  {
    key: "rikta-tithi",
    label: "Riktā tithi",
    description: "Tithi 4 / 9 / 14 is first-pass excluded for griha-praveśa (no puccha-exception).",
  },
  {
    key: "vyatipata-vaidhriti",
    label: "Vyatīpāta / Vaidhṛti yoga",
    description: "Cancellation-grade yogas independently disqualify a griha-praveśa candidate.",
  },
  {
    key: "bhadra-mukha",
    label: "Bhadrā-mukha / Viṣṭi karaṇa",
    description: "The Viṣṭi/Bhadrā-mukha karaṇa is avoided for all general initiation contexts.",
  },
  {
    key: "tuesday-saturday",
    label: "Tuesday / Saturday vāra",
    description: "Mars- and Saturn-days are generally avoided for griha-praveśa (no exception applies).",
  },
  {
    key: "ugra-tikshna-nakshatra",
    label: "Ugra / Tīkṣṇa nakṣatra",
    description: "Ugra/Tīkṣṇa nakṣatras are excluded for griha-praveśa.",
  },
  {
    key: "weak-venus-moon-jupiter",
    label: "All three Venus + Moon + Jupiter weak",
    description: "If the three griha-praveśa significators are all weak, the candidate is ruled out.",
  },
] as const;

export const CANDIDATES: Candidate[] = [
  {
    id: "jan-27",
    label: "Jan 27 ~7:30 AM IST",
    date: "Monday, 27 Jan",
    time: "~7:30 AM IST",
    tagline: "Post-Uttarāyaṇa apūrva standout — Vṛṣabha lagna + Rohiṇī + Monday + Bhadrā tithi.",
    grihaType: "apurva",
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Dvitīyā Bhadrā", quality: "favourable", note: "Bhadrā tithi matches noble-foundational home character." },
      { key: "vara", label: "Vāra", value: "Monday (Soma)", quality: "favourable", note: "Moon-day's domesticity character is ideal for griha-praveśa." },
      { key: "nakshatra", label: "Nakṣatra", value: "Rohiṇī (Sthira)", quality: "favourable", note: "Sthira nakṣatra; Moon's exaltation point; foundational-fertile." },
      { key: "yoga", label: "Yoga", value: "Dhruva", quality: "favourable", note: "Firm-fixed yoga matches home-permanence." },
      { key: "karana", label: "Karaṇa", value: "Kaulava", quality: "favourable", note: "Kula/family-lineage karana directly matches family-home." },
    ],
    venusState: "favourable",
    venusNote: "Venus in Vṛṣabha own sign, in 1st kendra — very strong for domestic comfort/aesthetics.",
    moonState: "favourable",
    moonNote: "Moon in Rohiṇī (own nakṣatra) and Karkaṭa-friendly environment — nurturing/domestic strength.",
    jupiterState: "favourable",
    jupiterNote: "Jupiter in a friendly/kendra environment, not combust — expansion + benediction strong.",
    lagnaSign: "Vṛṣabha",
    lagnaQuality: "favourable",
    lagnaNote: "Venus-ruled Earth-sign; most favoured for griha-praveśa foundational matching.",
    houses: [
      { house: 1, label: "Self / Inhabitant", quality: "favourable", note: "Venus in lagna strengthens self/inhabitant substance." },
      { house: 2, label: "Family / Kuṭumba", quality: "favourable", note: "Jupiter glance supports family-content." },
      { house: 4, label: "Home / Foundation / Sukha", quality: "favourable", note: "4th lord Venus in lagna; Moon in 4th — sukha-sthāna excellent." },
      { house: 11, label: "Gains / Fulfillment", quality: "favourable", note: "Mercury aspects 11th; gain-house supportive." },
    ],
    doshas: [
      { key: "rikta-tithi", label: "Riktā tithi", triggered: false, note: "Dvitīyā Bhadrā is favoured." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: false, note: "Dhruva yoga is favourable." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha / Viṣṭi karaṇa", triggered: false, note: "Kaulava karana is favoured." },
      { key: "tuesday-saturday", label: "Tuesday / Saturday vāra", triggered: false, note: "Monday vāra." },
      { key: "ugra-tikshna-nakshatra", label: "Ugra / Tīkṣṇa nakṣatra", triggered: false, note: "Rohiṇī is Sthira/favourable." },
      { key: "weak-venus-moon-jupiter", label: "All three Venus + Moon + Jupiter weak", triggered: false, note: "All three significators are strong." },
    ],
    seasonalDoshas: [
      { key: "dakshinayana", label: "Dakṣiṇāyana", triggered: false, note: "January 27 is in Uttarāyaṇa — no Dakṣiṇāyana doṣa." },
      { key: "adhikamasa", label: "Adhika-Māsa", triggered: false, note: "No Adhika-Māsa intersection in this window." },
      { key: "samkranti", label: "Saṁkrānti", triggered: false, note: "Not a Saṁkrānti day." },
    ],
    familyMembers: [
      {
        name: "Spouse A",
        relation: "Primary stakeholder",
        natalStar: "Anurādhā",
        taraQuality: "favourable",
        taraNote: "Mitra-tārā — supportive relationship.",
        lagnaSign: "Vṛṣabha",
        lagnaQuality: "favourable",
        lagnaNote: "Venus-ruled lagna aligns with home-substance.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa reinforces Venus strength.",
      },
      {
        name: "Spouse B",
        relation: "Primary stakeholder",
        natalStar: "Punarvasu",
        taraQuality: "favourable",
        taraNote: "Sādhaka-tārā supports action and settlement.",
        lagnaSign: "Karkaṭa",
        lagnaQuality: "favourable",
        lagnaNote: "Moon-ruled lagna matches domesticity.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa Moon-nature supportive.",
      },
    ],
    recommendation:
      "Proceed / explore. This is the §1 hook ideal: post-Uttarāyaṇa apūrva candidate with Vṛṣabha lagna, Rohiṇī nakṣatra, Monday vāra, Bhadrā tithi, Dhruva yoga, Kaulava karana, and all three home-significators strong. Verify exact pāda-precision and all family-members' tārā-bala at the sub-window.",
  },
  {
    id: "nov-18",
    label: "Nov 18 ~8:00 AM IST",
    date: "Tuesday, 18 Nov",
    time: "~8:00 AM IST",
    tagline: "Seasonal-calendar doṣa drill — Dakṣiṇāyana + Vṛścika-Saṁkrānti rules this out.",
    grihaType: "apurva",
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Navamī Riktā", quality: "unfavourable", note: "Riktā tithi is first-pass excluded." },
      { key: "vara", label: "Vāra", value: "Tuesday (Maṅgala)", quality: "unfavourable", note: "Tuesday is avoided for griha-praveśa." },
      { key: "nakshatra", label: "Nakṣatra", value: "Anurādhā (Mṛdu)", quality: "favourable", note: "Favourable nakṣatra but cannot override seasonal + cancellation doṣas." },
      { key: "yoga", label: "Yoga", value: "Vaidhṛti", quality: "unfavourable", note: "Cancellation-grade yoga — independently disqualifying." },
      { key: "karana", label: "Karaṇa", value: "Bhadrā-mukha", quality: "unfavourable", note: "Viṣṭi/Bhadrā-mukha avoided." },
    ],
    venusState: "mixed",
    venusNote: "Venus not strongly placed; the cancellation environment weakens its benefit.",
    moonState: "mixed",
    moonNote: "Moon in a neutral environment; not enough to rescue the candidate.",
    jupiterState: "favourable",
    jupiterNote: "Jupiter itself is acceptable, but one strong planet cannot rescue a cancelled candidate.",
    lagnaSign: "Dhanu",
    lagnaQuality: "mixed",
    lagnaNote: "Jupiter-ruled lagna is acceptable, yet irrelevant under multiple doṣas.",
    houses: [
      { house: 1, label: "Self / Inhabitant", quality: "mixed", note: "Lagna acceptable but under stress." },
      { house: 2, label: "Family / Kuṭumba", quality: "mixed", note: "Family-content stressed by cancellation." },
      { house: 4, label: "Home / Foundation / Sukha", quality: "mixed", note: "4th under pressure from multiple doṣas." },
      { house: 11, label: "Gains / Fulfillment", quality: "mixed", note: "Gains possible but environment unstable." },
    ],
    doshas: [
      { key: "rikta-tithi", label: "Riktā tithi", triggered: true, note: "Navamī is Riktā (9) — first-pass exclusion." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: true, note: "Vaidhṛti yoga present — cancellation." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha / Viṣṭi karaṇa", triggered: true, note: "Bhadrā-mukha karaṇa present." },
      { key: "tuesday-saturday", label: "Tuesday / Saturday vāra", triggered: true, note: "Tuesday vāra avoided." },
      { key: "ugra-tikshna-nakshatra", label: "Ugra / Tīkṣṇa nakṣatra", triggered: false, note: "Anurādhā is Mṛdu/favourable." },
      { key: "weak-venus-moon-jupiter", label: "All three Venus + Moon + Jupiter weak", triggered: false, note: "Jupiter is strong; Venus/Moon mixed." },
    ],
    seasonalDoshas: [
      { key: "dakshinayana", label: "Dakṣiṇāyana", triggered: true, note: "November 18 is within Dakṣiṇāyana (mid-July to mid-January). Northern-tradition strong-application avoids." },
      { key: "adhikamasa", label: "Adhika-Māsa", triggered: false, note: "No Adhika-Māsa intersection in this window." },
      { key: "samkranti", label: "Saṁkrānti", triggered: true, note: "November ~16 is Vṛścika-Saṁkrānti; November 18 is in the immediate Saṁkrānti-avoidance band." },
    ],
    familyMembers: [
      {
        name: "Spouse A",
        relation: "Primary stakeholder",
        natalStar: "Anurādhā",
        taraQuality: "mixed",
        taraNote: "Tārā-bala under cancellation context.",
        lagnaSign: "Dhanu",
        lagnaQuality: "mixed",
        lagnaNote: "Jupiter-ruled lagna.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa stress noted.",
      },
      {
        name: "Spouse B",
        relation: "Primary stakeholder",
        natalStar: "Rohiṇī",
        taraQuality: "mixed",
        taraNote: "Tārā-bala under stress.",
        lagnaSign: "Mīna",
        lagnaQuality: "mixed",
        lagnaNote: "Jupiter-ruled lagna.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa stress noted.",
      },
    ],
    recommendation:
      "Avoid. Multiple first-pass exclusions (Riktā tithi, Vaidhṛti yoga, Bhadrā-mukha, Tuesday vāra) plus Dakṣiṇāyana + Saṁkrānti seasonal doṣas make this unsuitable. Defer to post-Uttarāyaṇa if possible, or apply southern-tradition modified-application only with honest variance articulation.",
  },
  {
    id: "dec-8",
    label: "Dec 8 ~9:00 AM IST",
    date: "Monday, 8 Dec",
    time: "~9:00 AM IST",
    tagline: "Within Dakṣiṇāyana + Adhika-Māsa intersection — defer formal ceremony.",
    grihaType: "apurva",
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Trayodaśī Jayā", quality: "favourable", note: "Jayā tithi is favourable." },
      { key: "vara", label: "Vāra", value: "Monday (Soma)", quality: "favourable", note: "Monday's domesticity is good but cannot override seasonal doṣa." },
      { key: "nakshatra", label: "Nakṣatra", value: "Uttarāṣāḍhā (Sthira)", quality: "favourable", note: "Sthira nakṣatra excellent for home-foundation." },
      { key: "yoga", label: "Yoga", value: "Vṛddhi", quality: "favourable", note: "Growth-promoting yoga." },
      { key: "karana", label: "Karaṇa", value: "Bava", quality: "favourable", note: "Saṁskāra-affinity karana." },
    ],
    venusState: "favourable",
    venusNote: "Venus well placed in a friendly sign.",
    moonState: "favourable",
    moonNote: "Moon strong in a nurturing environment.",
    jupiterState: "favourable",
    jupiterNote: "Jupiter well placed.",
    lagnaSign: "Karkaṭa",
    lagnaQuality: "favourable",
    lagnaNote: "Moon-ruled lagna matches domesticity character.",
    houses: [
      { house: 1, label: "Self / Inhabitant", quality: "favourable", note: "Moon-ruled lagna supportive." },
      { house: 2, label: "Family / Kuṭumba", quality: "favourable", note: "Family-content supported." },
      { house: 4, label: "Home / Foundation / Sukha", quality: "favourable", note: "4th house strongly aligned." },
      { house: 11, label: "Gains / Fulfillment", quality: "mixed", note: "Gain-house acceptable but seasonal doṣa tempers." },
    ],
    doshas: [
      { key: "rikta-tithi", label: "Riktā tithi", triggered: false, note: "Trayodaśī Jayā is not Riktā." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: false, note: "Vṛddhi yoga is favourable." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha / Viṣṭi karaṇa", triggered: false, note: "Bava karana is favoured." },
      { key: "tuesday-saturday", label: "Tuesday / Saturday vāra", triggered: false, note: "Monday vāra." },
      { key: "ugra-tikshna-nakshatra", label: "Ugra / Tīkṣṇa nakṣatra", triggered: false, note: "Uttarāṣāḍhā is Sthira/favourable." },
      { key: "weak-venus-moon-jupiter", label: "All three Venus + Moon + Jupiter weak", triggered: false, note: "All three significators are strong." },
    ],
    seasonalDoshas: [
      { key: "dakshinayana", label: "Dakṣiṇāyana", triggered: true, note: "December 8 is within Dakṣiṇāyana. Northern-tradition strong-application avoids." },
      { key: "adhikamasa", label: "Adhika-Māsa", triggered: true, note: "This window intersects an Adhika-Māsa — classically avoided for auspicious initiations." },
      { key: "samkranti", label: "Saṁkrānti", triggered: false, note: "Not a Saṁkrānti day (Dhanu-Saṁkrānti ~Dec 16)." },
    ],
    familyMembers: [
      {
        name: "Spouse A",
        relation: "Primary stakeholder",
        natalStar: "Rohiṇī",
        taraQuality: "favourable",
        taraNote: "Mitra-tārā — supportive.",
        lagnaSign: "Karkaṭa",
        lagnaQuality: "favourable",
        lagnaNote: "Moon-ruled lagna matches domesticity.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa supportive.",
      },
      {
        name: "Spouse B",
        relation: "Primary stakeholder",
        natalStar: "Uttaraphālguṇī",
        taraQuality: "favourable",
        taraNote: "Sādhaka-tārā supports settlement.",
        lagnaSign: "Vṛṣabha",
        lagnaQuality: "favourable",
        lagnaNote: "Venus-ruled lagna aligns with home.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa Venus-nature supportive.",
      },
    ],
    recommendation:
      "Avoid for formal apūrva griha-praveśa. The pañcāṅga and significators are attractive, but Dakṣiṇāyana + Adhika-Māsa intersection create a seasonal-calendar doṣa that operates before integrated four-pillar evaluation. Option C from §6 Example 2 applies: treat December occupation as rental/less-significant, and defer the formal ceremony to post-Uttarāyaṇa.",
  },
  {
    id: "feb-14",
    label: "Feb 14 ~6:45 AM IST",
    date: "Friday, 14 Feb",
    time: "~6:45 AM IST",
    tagline: "Post-Uttarāyaṇa but Moon debilitated — mixed with caveats.",
    grihaType: "sapurva",
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Pañcamī Pūrṇā", quality: "favourable", note: "Pūrṇā tithi matches completion." },
      { key: "vara", label: "Vāra", value: "Friday (Śukra)", quality: "favourable", note: "Venus-day favourable for home-substance." },
      { key: "nakshatra", label: "Nakṣatra", value: "Citrā (Mṛdu)", quality: "favourable", note: "Mṛdu nakṣatra matches domestic-aesthetic substance." },
      { key: "yoga", label: "Yoga", value: "Sukarmā", quality: "favourable", note: "Auspicious yoga for action." },
      { key: "karana", label: "Karaṇa", value: "Taitila", quality: "favourable", note: "Favourable cara karaṇa." },
    ],
    venusState: "favourable",
    venusNote: "Venus in a friendly/own environment, strong for comfort/aesthetics.",
    moonState: "unfavourable",
    moonNote: "Moon in Vṛścika (debilitation) — domestic/nurturing significator weakened.",
    jupiterState: "favourable",
    jupiterNote: "Jupiter well placed in a kendra/trikoṇa environment.",
    lagnaSign: "Siṁha",
    lagnaQuality: "favourable",
    lagnaNote: "Sthira-rāśi; foundational-permanence character matches home-foundation.",
    houses: [
      { house: 1, label: "Self / Inhabitant", quality: "favourable", note: "Lagna-lord Sun well placed; Sthira sign rising." },
      { house: 2, label: "Family / Kuṭumba", quality: "favourable", note: "Family-content supported." },
      { house: 4, label: "Home / Foundation / Sukha", quality: "mixed", note: "4th supported by Venus but Moon debilitation tempers emotional/home-substance." },
      { house: 11, label: "Gains / Fulfillment", quality: "favourable", note: "Gain-house supported." },
    ],
    doshas: [
      { key: "rikta-tithi", label: "Riktā tithi", triggered: false, note: "Pañcamī Pūrṇā is favoured." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: false, note: "Sukarmā yoga is favourable." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha / Viṣṭi karaṇa", triggered: false, note: "Taitila karana." },
      { key: "tuesday-saturday", label: "Tuesday / Saturday vāra", triggered: false, note: "Friday vāra." },
      { key: "ugra-tikshna-nakshatra", label: "Ugra / Tīkṣṇa nakṣatra", triggered: false, note: "Citrā is Mṛdu/favourable." },
      { key: "weak-venus-moon-jupiter", label: "All three Venus + Moon + Jupiter weak", triggered: false, note: "Only Moon is weak; Venus and Jupiter are strong." },
    ],
    seasonalDoshas: [
      { key: "dakshinayana", label: "Dakṣiṇāyana", triggered: false, note: "February 14 is in Uttarāyaṇa." },
      { key: "adhikamasa", label: "Adhika-Māsa", triggered: false, note: "No Adhika-Māsa intersection." },
      { key: "samkranti", label: "Saṁkrānti", triggered: false, note: "Not a Saṁkrānti day (Kumbha-Saṁkrānti ~Feb 13; this is just past)." },
    ],
    familyMembers: [
      {
        name: "Spouse A",
        relation: "Primary stakeholder",
        natalStar: "Citrā",
        taraQuality: "mixed",
        taraNote: "Tārā-bala acceptable; same-nakṣatra consideration tempers.",
        lagnaSign: "Siṁha",
        lagnaQuality: "favourable",
        lagnaNote: "Sthira lagna matches permanence.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa correspondence acceptable.",
      },
      {
        name: "Spouse B",
        relation: "Primary stakeholder",
        natalStar: "Revatī",
        taraQuality: "favourable",
        taraNote: "Mitra-tārā — supportive.",
        lagnaSign: "Vṛṣabha",
        lagnaQuality: "favourable",
        lagnaNote: "Venus-ruled lagna aligns with home.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa supportive.",
      },
    ],
    recommendation:
      "Mixed — with caveats. Seasonal-calendar doṣas are clear, pañcāṅga is favourable, and Venus/Jupiter are strong. However, Moon debilitated in Vṛścika weakens the domestic/nurturing significator. For sa-pūrva re-occupation (the stated type), this may be acceptable with modified application and a remediation/Vāstu observance; for apūrva first-occupation, prefer a candidate with Moon strong.",
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

  // Venus + Moon + Jupiter: 3 × 2 points
  [candidate.venusState, candidate.moonState, candidate.jupiterState].forEach((state) => {
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

  // Family members: 2 members × 3 qualities × 1 point
  candidate.familyMembers.forEach((member) => {
    [member.taraQuality, member.lagnaQuality, member.navamshaQuality].forEach((q) => {
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

  // Seasonal doṣa penalty (less severe than cancellation, but significant)
  const seasonalTriggered = candidate.seasonalDoshas.filter((d) => d.triggered).length;
  if (seasonalTriggered > 0) {
    score = Math.max(0, score - seasonalTriggered * 3);
  }

  let verdict: "proceed" | "mixed" | "avoid" = "avoid";
  let label = "Avoid";
  if (triggeredCount > 0 || seasonalTriggered > 1 || score <= max * 0.45) {
    verdict = "avoid";
    label = "Avoid";
  } else if (score >= max * 0.75 && seasonalTriggered === 0) {
    verdict = "proceed";
    label = "Proceed / Explore";
  } else {
    verdict = "mixed";
    label = "Mixed — verify";
  }

  return { score: Math.round(score), max, verdict, label };
}
