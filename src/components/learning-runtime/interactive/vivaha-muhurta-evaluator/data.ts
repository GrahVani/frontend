export type Quality = "favourable" | "mixed" | "unfavourable" | "neutral";

export interface PanchangaFactor {
  key: "tithi" | "vara" | "nakshatra" | "yoga" | "karana";
  label: string;
  value: string;
  quality: Quality;
  note: string;
}

export interface ActorState {
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

export interface Candidate {
  id: string;
  label: string;
  date: string;
  time: string;
  tagline: string;
  panchanga: PanchangaFactor[];
  jupiterState: Quality;
  jupiterNote: string;
  venusState: Quality;
  venusNote: string;
  houseBala: Quality;
  houseNote: string;
  doshas: {
    key: string;
    label: string;
    triggered: boolean;
    note: string;
  }[];
  actors: [ActorState, ActorState];
  recommendation: string;
}

export const PANCHANGA_RULES = {
  tithi: {
    favourable: ["Pūrṇā (full: 5/10/15)", "Bhadrā (2/7/12)", "Jayā (3/8/13)", "Riktā with puccha-exception not applicable for wedding"],
    avoid: ["Riktā (4/9/14)", "Kṛṣṇa Pakṣa Chaturthī etc. without regional support"],
    note: "Pūrṇā/Bhadrā tithis preferred; Riktā excluded for wedding.",
  },
  vara: {
    favourable: ["Friday (Venus)", "Thursday (Jupiter)"],
    avoid: ["Tuesday (Mars)", "Saturday (Saturn)"],
    note: "Venus-ruled Friday most favoured; Jupiter-ruled Thursday universally good.",
  },
  nakshatra: {
    favourable: ["Rohiṇī", "Mṛgaśīrṣa", "Maghā", "Uttara-phālguṇī", "Hasta", "Svātī", "Anurādhā", "Uttarāṣāḍhā", "Revatī"],
    avoid: ["Bharaṇī", "Ārdrā", "Āśleṣā", "Jyeṣṭhā", "Mūla", "Viśākhā (some traditions)", "Śatabhiṣaj (some traditions)"],
    note: "Sthira (fixed) and Mṛdu (soft) nakṣatras preferred; Ugra/Tīkṣṇa/Bharaṇī avoided.",
  },
  yoga: {
    favourable: ["Saubhāgya", "Prīti", "Sukarmā", "Vṛddhi", "Harṣaṇa", "Śubha", "Brahma", "Vajra", "Siddhi"],
    avoid: ["Vyatīpāta", "Vaidhṛti", "Parigha", "Atigaṇḍa", "Śūla"],
    note: "Saubhāgya-yoga is name-character ideal for wedding; Vyatīpāta/Vaidhṛti cancel.",
  },
  karana: {
    favourable: ["Bava", "Kaulava", "Taitila", "Gara"],
    avoid: ["Viṣṭi", "Bhadrā-mukha", "Śakuni", "Nāga"],
    note: "Bava/Kaulava (family-lineage character) preferred; Bhadrā-mukha excluded (no puccha-exception).",
  },
} as const;

export const JUPITER_VENUS_RULES = {
  strongSigns: [
    "Own sign (Jupiter: Dhanus/Meena; Venus: Vṛṣabha/Tulā)",
    "Exaltation (Jupiter: Karkaṭa; Venus: Mīna)",
    "Friendly sign",
  ],
  weakSigns: [
    "Debilitation (Jupiter: Makara; Venus: Kanyā)",
    "Enemy sign",
    "Combust within ~12° of Sun",
  ],
  placement: ["Kendra (1/4/7/10)", "Trikoṇa (1/5/9)", "Avoid 6/8/12 unless well fortified"],
  note: "Both Jupiter AND Venus should be strong in the muhūrta chart. Weakness in either modulates the recommendation; both weak rules the candidate out.",
} as const;

export const CANCELLATION_DOSHAS = [
  {
    key: "tri-bala-shuddhi",
    label: "Tri-bāla-śuddhi failure",
    description:
      "Simultaneous unfavourable candra-bala + tārā-bala + lagna-śuddhi for either bride or groom.",
  },
  {
    key: "mangala-dosha",
    label: "Maṅgala-doṣa interaction",
    description:
      "Natal Maṅgala-doṣa in an actor interacting with non-upacaya muhūrta-Mars placement; upacaya placement can mitigate.",
  },
  {
    key: "kuhu-yoga",
    label: "Kuhū-yoga",
    description: "Amāvasyā (Sun-Moon conjunction) wedding-muhūrta is cancelled.",
  },
  {
    key: "vyatipata-vaidhriti",
    label: "Vyatīpāta / Vaidhṛti yoga",
    description: "General cancellation doṣa — these yogas cancel any muhūrta, including wedding.",
  },
  {
    key: "bhadra-mukha",
    label: "Bhadrā-mukha karaṇa",
    description: "General cancellation doṣa — no puccha-exception for wedding context.",
  },
] as const;

export const CANDIDATES: Candidate[] = [
  {
    id: "nov-8-afternoon",
    label: "Nov 8 ~4:00 PM IST",
    date: "Friday, 8 Nov",
    time: "~4:00 PM IST",
    tagline: "The §1 hook candidate — strong pañcāṅga, mixed lagna-śuddhi.",
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Daśamī Pūrṇā", quality: "favourable", note: "Pūrṇā tithi is wedding-preferred." },
      { key: "vara", label: "Vāra", value: "Friday (Venus)", quality: "favourable", note: "Venus-ruled Friday is optimal for wedding." },
      { key: "nakshatra", label: "Nakṣatra", value: "Revatī (Mṛdu)", quality: "favourable", note: "Mṛdu nakṣatra favourable; not as ideal as Rohiṇī but acceptable." },
      { key: "yoga", label: "Yoga", value: "Vṛddhi", quality: "favourable", note: "Growth-promoting yoga; not Saubhāgya but favourable." },
      { key: "karana", label: "Karaṇa", value: "Bava", quality: "favourable", note: "Family-lineage karana preferred." },
    ],
    jupiterState: "favourable",
    jupiterNote: "Jupiter in own/friendly sign, not combust, well placed.",
    venusState: "favourable",
    venusNote: "Venus strong in own/exaltation or friendly environment.",
    houseBala: "mixed",
    houseNote: "7th house has debilitated Mars — central partnership house weakened.",
    doshas: [
      { key: "tri-bala-shuddhi", label: "Tri-bāla-śuddhi failure", triggered: false, note: "Candra-bala favourable for both; tārā-bala mixed; lagna-śuddhi mixed — not a simultaneous triple failure." },
      { key: "mangala-dosha", label: "Maṅgala-doṣa interaction", triggered: false, note: "Assume no natal Maṅgala-doṣa interaction in this example." },
      { key: "kuhu-yoga", label: "Kuhū-yoga", triggered: false, note: "Not Amāvasyā." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: false, note: "Vṛddhi yoga is not a cancellation yoga." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha karaṇa", triggered: false, note: "Bava karana, not Bhadrā-mukha." },
    ],
    actors: [
      {
        name: "Bride",
        natalStar: "Rohiṇī",
        taraQuality: "favourable",
        taraNote: "Sādhaka-tārā (6th from Rohiṇī) — favourable.",
        lagnaSign: "Makara",
        lagnaQuality: "mixed",
        lagnaNote: "Capricorn lagna is Saturn-ruled; not Venus-ruled wedding-preferred.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa-trika correspondence noted.",
      },
      {
        name: "Groom",
        natalStar: "Mṛgaśīrṣa",
        taraQuality: "mixed",
        taraNote: "Pratyari-tārā (5th from Mṛgaśīrṣa) — challenging.",
        lagnaSign: "Makara",
        lagnaQuality: "mixed",
        lagnaNote: "Same Saturn-ruled lagna concern.",
        navamshaQuality: "mixed",
        navamshaNote: "Navāṁśa-trika correspondence noted.",
      },
    ],
    recommendation:
      "Mixed candidate. Strong pañcāṅga + favourable Jupiter-Venus + cancellation-doṣas pass, but tārā-bala is mixed for groom, lagna-śuddhi is mixed, and 7th house has debilitated Mars. Consider a Vṛṣabha lagna sub-window on the same day.",
  },
  {
    id: "nov-1-morning",
    label: "Nov 1 morning",
    date: "Saturday, 1 Nov",
    time: "Morning lagna window",
    tagline: "Strong multi-actor tārā-bala, but Saturday vāra is classically avoided.",
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Tṛtīyā Jayā", quality: "favourable", note: "Jayā tithi is favourable." },
      { key: "vara", label: "Vāra", value: "Saturday (Saturn)", quality: "unfavourable", note: "Saturday is classically avoided for wedding (no Saturn exception)." },
      { key: "nakshatra", label: "Nakṣatra", value: "Uttarāṣāḍhā (Sthira)", quality: "favourable", note: "Sthira nakṣatra, excellent for wedding." },
      { key: "yoga", label: "Yoga", value: "Sukarmā", quality: "favourable", note: "Auspicious yoga." },
      { key: "karana", label: "Karaṇa", value: "Kaulava", quality: "favourable", note: "Family-lineage karana preferred." },
    ],
    jupiterState: "favourable",
    jupiterNote: "Jupiter well placed.",
    venusState: "favourable",
    venusNote: "Venus well placed.",
    houseBala: "favourable",
    houseNote: "7th house unafflicted.",
    doshas: [
      { key: "tri-bala-shuddhi", label: "Tri-bāla-śuddhi failure", triggered: false, note: "Both actors have favourable tārā-bala." },
      { key: "mangala-dosha", label: "Maṅgala-doṣa interaction", triggered: false, note: "No interaction indicated." },
      { key: "kuhu-yoga", label: "Kuhū-yoga", triggered: false, note: "Not Amāvasyā." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: false, note: "Sukarmā yoga is favourable." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha karaṇa", triggered: false, note: "Kaulava karana." },
    ],
    actors: [
      {
        name: "Bride",
        natalStar: "Rohiṇī",
        taraQuality: "favourable",
        taraNote: "Ati-Mitra (9th from Rohiṇī) — excellent.",
        lagnaSign: "Vṛṣabha",
        lagnaQuality: "favourable",
        lagnaNote: "Venus-ruled lagna, most favoured for wedding.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa correspondence supportive.",
      },
      {
        name: "Groom",
        natalStar: "Mṛgaśīrṣa",
        taraQuality: "favourable",
        taraNote: "Mitra (8th from Mṛgaśīrṣa) — favourable.",
        lagnaSign: "Vṛṣabha",
        lagnaQuality: "favourable",
        lagnaNote: "Venus-ruled lagna.",
        navamshaQuality: "favourable",
        navamshaNote: "Navāṁśa correspondence supportive.",
      },
    ],
    recommendation:
      "Strong on most factors except Saturday vāra. Some regional traditions permit Saturday wedding with Saturn-mitigation observances. Honest variance note required. If Saturday is non-negotiable in your tradition, prefer a Friday/Thursday alternative.",
  },
  {
    id: "nov-15-amavasya",
    label: "Nov 15 late evening",
    date: "Friday, 15 Nov",
    time: "Late evening",
    tagline: "Kuhū-yoga cancellation drill — Amāvasyā rules out wedding.",
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Amāvasyā", quality: "unfavourable", note: "New Moon — Kuhū-yoga; wedding cancelled." },
      { key: "vara", label: "Vāra", value: "Friday (Venus)", quality: "favourable", note: "Venus vāra is good but cannot override Kuhū-yoga." },
      { key: "nakshatra", label: "Nakṣatra", value: "Anurādhā (Mṛdu)", quality: "favourable", note: "Favourable nakṣatra but cannot override Kuhū-yoga." },
      { key: "yoga", label: "Yoga", value: "Vaidhṛti", quality: "unfavourable", note: "Cancellation yoga — independently disqualifying." },
      { key: "karana", label: "Karaṇa", value: "Nāga", quality: "unfavourable", note: "Unfavourable karana." },
    ],
    jupiterState: "favourable",
    jupiterNote: "Jupiter well placed.",
    venusState: "favourable",
    venusNote: "Venus well placed.",
    houseBala: "favourable",
    houseNote: "7th house strong.",
    doshas: [
      { key: "tri-bala-shuddhi", label: "Tri-bāla-śuddhi failure", triggered: false, note: "Actors' strengths acceptable." },
      { key: "mangala-dosha", label: "Maṅgala-doṣa interaction", triggered: false, note: "No interaction indicated." },
      { key: "kuhu-yoga", label: "Kuhū-yoga", triggered: true, note: "Amāvasyā — wedding-muhūrta cancelled." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: true, note: "Vaidhṛti yoga present — independently disqualifying." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha karaṇa", triggered: false, note: "Nāga karana is also unfavourable but Kuhū/Vaidhṛti already rule out." },
    ],
    actors: [
      {
        name: "Bride",
        natalStar: "Rohiṇī",
        taraQuality: "favourable",
        taraNote: "Favourable tārā-bala.",
        lagnaSign: "Mīna",
        lagnaQuality: "favourable",
        lagnaNote: "Jupiter-ruled lagna is acceptable.",
        navamshaQuality: "favourable",
        navamshaNote: "Good Navāṁśa correspondence.",
      },
      {
        name: "Groom",
        natalStar: "Mṛgaśīrṣa",
        taraQuality: "favourable",
        taraNote: "Favourable tārā-bala.",
        lagnaSign: "Mīna",
        lagnaQuality: "favourable",
        lagnaNote: "Jupiter-ruled lagna.",
        navamshaQuality: "favourable",
        navamshaNote: "Good Navāṁśa correspondence.",
      },
    ],
    recommendation:
      "Disqualified. Amāvasyā Kuhū-yoga + Vaidhṛti yoga create first-pass cancellation. No amount of favourable Jupiter-Venus or lagna-śuddhi can override these cancellation doṣas. Select a different candidate.",
  },
  {
    id: "nov-22-marsy",
    label: "Nov 22 early afternoon",
    date: "Friday, 22 Nov",
    time: "~1:30 PM IST",
    tagline: "Tuesday-like Mars pressure — vara is Friday but nakṣatra is Jyeṣṭhā.",
    panchanga: [
      { key: "tithi", label: "Tithi", value: "Saptamī Bhadrā", quality: "favourable", note: "Bhadrā tithi preferred." },
      { key: "vara", label: "Vāra", value: "Friday (Venus)", quality: "favourable", note: "Venus vāra good." },
      { key: "nakshatra", label: "Nakṣatra", value: "Jyeṣṭhā (Ugra)", quality: "unfavourable", note: "Jyeṣṭhā is Ugra/Elder-power nakṣatra, avoided for wedding." },
      { key: "yoga", label: "Yoga", value: "Vyatīpāta", quality: "unfavourable", note: "Cancellation yoga — disqualifying." },
      { key: "karana", label: "Karaṇa", value: "Bava", quality: "favourable", note: "Favourable karana but cannot override cancellation yoga." },
    ],
    jupiterState: "mixed",
    jupiterNote: "Jupiter in neutral sign, not afflicted but not strongly fortified.",
    venusState: "favourable",
    venusNote: "Venus well placed.",
    houseBala: "mixed",
    houseNote: "Mars aspects 7th house from lagna.",
    doshas: [
      { key: "tri-bala-shuddhi", label: "Tri-bāla-śuddhi failure", triggered: false, note: "Not a triple failure." },
      { key: "mangala-dosha", label: "Maṅgala-doṣa interaction", triggered: true, note: "Mars aspect on 7th + possible natal Maṅgala-doṣa interaction in one actor." },
      { key: "kuhu-yoga", label: "Kuhū-yoga", triggered: false, note: "Not Amāvasyā." },
      { key: "vyatipata-vaidhriti", label: "Vyatīpāta / Vaidhṛti yoga", triggered: true, note: "Vyatīpāta yoga present — disqualifying." },
      { key: "bhadra-mukha", label: "Bhadrā-mukha karaṇa", triggered: false, note: "Bava karana." },
    ],
    actors: [
      {
        name: "Bride",
        natalStar: "Rohiṇī",
        taraQuality: "mixed",
        taraNote: "Tārā-bala mixed.",
        lagnaSign: "Siṁha",
        lagnaQuality: "mixed",
        lagnaNote: "Sun-ruled lagna not wedding-preferred.",
        navamshaQuality: "mixed",
        navamshaNote: "Neutral Navāṁśa correspondence.",
      },
      {
        name: "Groom",
        natalStar: "Mṛgaśīrṣa",
        taraQuality: "mixed",
        taraNote: "Tārā-bala mixed.",
        lagnaSign: "Siṁha",
        lagnaQuality: "mixed",
        lagnaNote: "Sun-ruled lagna.",
        navamshaQuality: "mixed",
        navamshaNote: "Neutral Navāṁśa correspondence.",
      },
    ],
    recommendation:
      "Disqualified. Vyatīpāta yoga alone cancels the muhūrta; Jyeṣṭhā nakṣatra and Mars-7th interaction reinforce the avoidance. Even with Friday vāra and Bhadrā tithi, this candidate is unsuitable.",
  },
];

export function scoreCandidate(candidate: Candidate): { score: number; max: number; verdict: "proceed" | "mixed" | "avoid"; label: string } {
  let score = 0;
  let max = 0;

  // Pañcāṅga: 5 factors x 2 points
  candidate.panchanga.forEach((factor) => {
    max += 2;
    if (factor.quality === "favourable") score += 2;
    else if (factor.quality === "mixed") score += 1;
  });

  // Jupiter + Venus: 2 x 2 points
  [candidate.jupiterState, candidate.venusState].forEach((state) => {
    max += 2;
    if (state === "favourable") score += 2;
    else if (state === "mixed") score += 1;
  });

  // House bala: 2 points
  max += 2;
  if (candidate.houseBala === "favourable") score += 2;
  else if (candidate.houseBala === "mixed") score += 1;

  // Actors: 2 actors x (tara + lagna + navamsha) x 1 point = 6 points
  candidate.actors.forEach((actor) => {
    [actor.taraQuality, actor.lagnaQuality, actor.navamshaQuality].forEach((q) => {
      max += 1;
      if (q === "favourable") score += 1;
      else if (q === "mixed") score += 0.5;
    });
  });

  // Cancellation doṣas: each triggered doṣa is a heavy penalty
  const triggeredCount = candidate.doshas.filter((d) => d.triggered).length;
  if (triggeredCount > 0) {
    score = Math.max(0, score - triggeredCount * 5);
  }

  // Verdict
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
    label = "Mixed — with caveats";
  }

  return { score: Math.round(score), max, verdict, label };
}

export const SAPTAPADI_LAGNAS = [
  { sign: "Vṛṣabha", ruler: "Venus", quality: "favourable", note: "Most favoured for wedding — Venus own sign." },
  { sign: "Mithuna", ruler: "Mercury", quality: "favourable", note: "Venus-ruled by some classifications; Mercury's neutral nature acceptable." },
  { sign: "Tulā", ruler: "Venus", quality: "favourable", note: "Venus own sign; good for evening ceremonies." },
  { sign: "Karkaṭa", ruler: "Moon", quality: "favourable", note: "Jupiter exalted here; Moon-ruled lagna supportive." },
  { sign: "Dhanus", ruler: "Jupiter", quality: "favourable", note: "Jupiter own sign; dharma-promoting." },
  { sign: "Mīna", ruler: "Jupiter", quality: "favourable", note: "Jupiter own sign." },
  { sign: "Siṁha", ruler: "Sun", quality: "mixed", note: "Royal but not wedding-preferred." },
  { sign: "Kanyā", ruler: "Mercury", quality: "mixed", note: "Neutral; Venus debilitated here." },
  { sign: "Makara", ruler: "Saturn", quality: "mixed", note: "Saturn-ruled; acceptable only if well fortified." },
  { sign: "Kumbha", ruler: "Saturn", quality: "mixed", note: "Saturn-ruled; generally less favoured." },
  { sign: "Meṣa", ruler: "Mars", quality: "unfavourable", note: "Mars-ruled; avoid unless strong mitigations." },
  { sign: "Vṛścika", ruler: "Mars", quality: "unfavourable", note: "Mars-ruled; avoid for wedding lagna." },
] as const;
