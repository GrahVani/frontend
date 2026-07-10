/**
 * Three Skandha Synthesis Dojo — L3.1 §7 flagship data.
 *
 * Two views:
 *   1. STREAM × SKANDHA MATRIX — 4 streams × 3 skandhas clickable grid.
 *      Each cell shows the stream's distinctive corpus for that skandha.
 *   2. EVALUATIVE DRILL — 5 classification scenarios: given a text or
 *      module, identify its correct (stream, skandha) coordinates.
 */

export interface MatrixCell {
  streamSlug: string;
  streamName: string;
  skandhaSlug: string;
  skandhaName: string;
  corpus: string[];
  note: string;
}

export interface DrillScenario {
  slug: string;
  question: string;
  context?: string;
  options: {
    id: string;
    label: string;
    stream: string;
    skandha: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const STREAMS = [
  { slug: "parashari", name: "Parāśari", color: "#C8412E", colorDeep: "#7A2A14" },
  { slug: "jaimini", name: "Jaiminī", color: "#3A8C5A", colorDeep: "#2A6A40" },
  { slug: "kp", name: "KP", color: "#4F6FA8", colorDeep: "#2F4778" },
  { slug: "lal-kitab", name: "Lal Kitab", color: "#7A3E4A", colorDeep: "#5A2E3A" },
] as const;

export const SKANDHAS = [
  { slug: "ganita", name: "Gaṇita", color: "#4F6FA8", colorDeep: "#2F4778" },
  { slug: "hora", name: "Horā", color: "#A23A1E", colorDeep: "#7A2A14" },
  { slug: "samhita", name: "Saṁhitā", color: "#3A8C5A", colorDeep: "#2A6A40" },
] as const;

export const MATRIX_CELLS: MatrixCell[] = [
  // Parāśari
  {
    streamSlug: "parashari",
    streamName: "Parāśari",
    skandhaSlug: "ganita",
    skandhaName: "Gaṇita",
    corpus: ["Pañcasiddhāntikā (Varāhamihira)", "Sūrya Siddhānta", "Siddhānta Śiromaṇi (Bhāskara II)"],
    note: "Deep classical gaṇita corpus — the most extensive gaṇita tradition across all streams.",
  },
  {
    streamSlug: "parashari",
    streamName: "Parāśari",
    skandhaSlug: "hora",
    skandhaName: "Horā",
    corpus: ["BPHS", "Bṛhat Jātaka", "Saravali", "Phaladīpikā", "Jātaka Pārijāta"],
    note: "Encyclopaedic horā corpus — centre-of-gravity for the entire Parāśari tradition.",
  },
  {
    streamSlug: "parashari",
    streamName: "Parāśari",
    skandhaSlug: "samhita",
    skandhaName: "Saṁhitā",
    corpus: ["Bṛhat Saṁhitā (Varāhamihira)"],
    note: "The dominant classical saṁhitā text — 106 chapters spanning mundane astrology + adjacent disciplines.",
  },
  // Jaiminī
  {
    streamSlug: "jaimini",
    streamName: "Jaiminī",
    skandhaSlug: "ganita",
    skandhaName: "Gaṇita",
    corpus: ["Standard classical gaṇita (no distinctively-Jaiminī gaṇita corpus)"],
    note: "Uses standard Parāśari-tradition gaṇita computation without distinctive Jaiminī mathematical contributions.",
  },
  {
    streamSlug: "jaimini",
    streamName: "Jaiminī",
    skandhaSlug: "hora",
    skandhaName: "Horā",
    corpus: ["Jaiminī Sūtra — cara-rāśi-daśās, ārūḍha, rāśi-aspects, cara-kārakas, Jaiminī yogas"],
    note: "Distinctive horā-centric framework with unique doctrines not found in Parāśari horā.",
  },
  {
    streamSlug: "jaimini",
    streamName: "Jaiminī",
    skandhaSlug: "samhita",
    skandhaName: "Saṁhitā",
    corpus: ["Standard classical saṁhitā material"],
    note: "Rare in distinctively-Jaiminī form; uses standard classical saṁhitā texts (primarily Bṛhat Saṁhitā).",
  },
  // KP
  {
    streamSlug: "kp",
    streamName: "KP",
    skandhaSlug: "ganita",
    skandhaName: "Gaṇita",
    corpus: ["Standard classical gaṇita + Placidus house-cusps (Western-imported extension)"],
    note: "Standard computation with a Western-imported house-cusp extension; no original KP gaṇita treatise.",
  },
  {
    streamSlug: "kp",
    streamName: "KP",
    skandhaSlug: "hora",
    skandhaName: "Horā",
    corpus: ["KP Reader I-VI — sub-lord, CSL, Ruling Planets, KP horary 1-249"],
    note: "Distinctive horā-centric stellar methodology; the centre-of-gravity of the entire KP stream.",
  },
  {
    streamSlug: "kp",
    streamName: "KP",
    skandhaSlug: "samhita",
    skandhaName: "Saṁhitā",
    corpus: ["Standard classical saṁhitā material"],
    note: "No distinctively-KP saṁhitā; practitioners use standard classical saṁhitā material when needed.",
  },
  // Lal Kitab
  {
    streamSlug: "lal-kitab",
    streamName: "Lal Kitab",
    skandhaSlug: "ganita",
    skandhaName: "Gaṇita",
    corpus: ["Standard classical gaṇita"],
    note: "Uses standard classical gaṇita without distinctive Lal Kitab mathematical contributions.",
  },
  {
    streamSlug: "lal-kitab",
    streamName: "Lal Kitab",
    skandhaSlug: "hora",
    skandhaName: "Horā",
    corpus: ["Lal Kitab — 108 remedies, debt-of-ancestors, andha-planets, fixed-house framework"],
    note: "Distinctive horā-centric remedy framework with unique planetary-state classifications.",
  },
  {
    streamSlug: "lal-kitab",
    streamName: "Lal Kitab",
    skandhaSlug: "samhita",
    skandhaName: "Saṁhitā",
    corpus: ["Remedial-application overlap with classical saṁhitā gemology / perfumery / charity"],
    note: "No distinctively-Lal-Kitab saṁhitā; some remedial overlap with classical saṁhitā gemology and charity material.",
  },
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    slug: "drill-01",
    question: "A learner encounters a text titled *Bṛhat Saṁhitā* by Varāhamihira. Into which (stream, skandha) coordinates should this text be classified?",
    options: [
      {
        id: "A",
        label: "Parāśari — Gaṇita",
        stream: "Parāśari",
        skandha: "Gaṇita",
        isCorrect: false,
        explanation: "Incorrect. While Varāhamihira DID write a gaṇita text (*Pañcasiddhāntikā*), the *Bṛhat Saṁhitā* is specifically the saṁhitā-skandha text. Gaṇita is a different skandha with different foundational texts.",
      },
      {
        id: "B",
        label: "Parāśari — Saṁhitā",
        stream: "Parāśari",
        skandha: "Saṁhitā",
        isCorrect: true,
        explanation: "Correct. *Bṛhat Saṁhitā* by Varāhamihira is the dominant classical saṁhitā text — 106 chapters covering mundane astrology, omens, gemology, architecture, and adjacent encyclopaedic disciplines. It is Parāśari in stream (Varāhamihira is firmly within the Parāśari tradition) and Saṁhitā in skandha.",
      },
      {
        id: "C",
        label: "Jaiminī — Saṁhitā",
        stream: "Jaiminī",
        skandha: "Saṁhitā",
        isCorrect: false,
        explanation: "Incorrect. Jaiminī has no distinctively-Jaiminī saṁhitā corpus. The *Bṛhat Saṁhitā* is explicitly Parāśari — Varāhamihira is a Parāśari-tradition codifier, not a Jaiminī-tradition author.",
      },
      {
        id: "D",
        label: "Parāśari — Horā",
        stream: "Parāśari",
        skandha: "Horā",
        isCorrect: false,
        explanation: "Incorrect. Varāhamihira's horā text is *Bṛhat Jātaka*, not *Bṛhat Saṁhitā*. The two titles are often confused because they share the 'Bṛhat' prefix and the same author. *Bṛhat Jātaka* = horā; *Bṛhat Saṁhitā* = saṁhitā.",
      },
    ],
  },
  {
    slug: "drill-02",
    question: "A practitioner prescribes a specific mantra for a Jyotiṣa-derived remedial purpose. Which skandha governs the correctness of that mantra's pronunciation?",
    context: "The prescription itself comes from horā-skandha predictive analysis. The question is about the pronunciation discipline.",
    options: [
      {
        id: "A",
        label: "Horā — because the remedy was prescribed via horā analysis",
        stream: "N/A",
        skandha: "Horā",
        isCorrect: false,
        explanation: "Incorrect. While the *prescription* of the remedy comes from horā analysis, the *pronunciation correctness* of the mantra is governed by Śikṣā (phonetics), which is a Vedāṅga, not a skandha. However, within the three-skandha framework, this question tests whether you conflate 'prescription' with 'pronunciation discipline'. The skandha framework does not directly contain Śikṣā — Śikṣā is a Vedāṅga. If forced to classify within skandhas, the closest overlap is saṁhitā (which covers remedial gemology, perfumery, and ritual-adjacent disciplines), but the honest answer is that pronunciation is Vedāṅga-level infrastructure, not skandha-level.",
      },
      {
        id: "B",
        label: "Saṁhitā — because remedial material overlaps with saṁhitā's encyclopaedic breadth",
        stream: "N/A",
        skandha: "Saṁhitā",
        isCorrect: true,
        explanation: "Correct within the skandha framework. While mantra pronunciation is technically Śikṣā (a Vedāṅga, not a skandha), the remedial application of gems, mantras, and charitable acts is most closely aligned with saṁhitā's encyclopaedic breadth — specifically the gemology (ratna-parīkṣā) and perfumery chapters of Bṛhat Saṁhitā. The skandha framework maps 'what the knowledge is about'; Vedāṅga framework maps 'supporting infrastructure'. Both are needed.",
      },
      {
        id: "C",
        label: "Gaṇita — because the mantra must be recited at the correct time",
        stream: "N/A",
        skandha: "Gaṇita",
        isCorrect: false,
        explanation: "Incorrect. While gaṇita determines 'when' (the correct time for ritual), it does not govern 'how' (pronunciation). This option conflates temporal computation (gaṇita) with phonetic discipline (Śikṣā / Vedāṅga).",
      },
      {
        id: "D",
        label: "None of the three skandhas — pronunciation is Śikṣā, a Vedāṅga",
        stream: "N/A",
        skandha: "N/A",
        isCorrect: false,
        explanation: "Technically true but operationally incomplete. Śikṣā IS a Vedāṅga, not a skandha. However, the question asks for classification *within the skandha framework*, and the remedial application of mantras, gems, and rituals is operationally grouped under saṁhitā's encyclopaedic umbrella in classical practice. The most honest single-skandha answer is saṁhitā, while acknowledging the Vedāṅga-layer nuance.",
      },
    ],
  },
  {
    slug: "drill-03",
    question: "The curriculum module 'T1-10 — Daśā Systems' is primarily which skandha? And which stream's distinctive contribution is most relevant to it?",
    options: [
      {
        id: "A",
        label: "Gaṇita — Parāśari (Vimśottarī computation)",
        stream: "Parāśari",
        skandha: "Gaṇita",
        isCorrect: false,
        explanation: "Incorrect. While daśā computation involves gaṇita-substrate mathematics (planetary positions, elapsed periods, subdivisions), the module itself is about *predictive timing interpretation* — which is horā, not gaṇita. The computation is the substrate; the interpretation is the skandha.",
      },
      {
        id: "B",
        label: "Horā — Parāśari (Vimśottarī mahā-daśā)",
        stream: "Parāśari",
        skandha: "Horā",
        isCorrect: true,
        explanation: "Correct. Daśā Systems is a horā-skandha module because it covers predictive timing and life-event interpretation. The Parāśari stream's distinctive contribution is Vimśottarī mahā-daśā / bhukti (from BPHS), the most widely-used daśā system. Jaiminī also has cara-rāśi-daśās (distinctively Jaiminī horā), but Vimśottarī is the primary Parāśari contribution.",
      },
      {
        id: "C",
        label: "Horā — Jaiminī (cara-rāśi-daśās)",
        stream: "Jaiminī",
        skandha: "Horā",
        isCorrect: false,
        explanation: "Incorrect. While Jaiminī DOES have a distinctive horā contribution (cara-rāśi-daśās), the T1-10 module in the curriculum is Parāśari-Vimśottarī-centric. Jaiminī daśās appear in the Jaiminī stream overview module (T1-17), not in the foundational daśā module. The question asks about T1-10 specifically.",
      },
      {
        id: "D",
        label: "Saṁhitā — Parāśari (mundane timing)",
        stream: "Parāśari",
        skandha: "Saṁhitā",
        isCorrect: false,
        explanation: "Incorrect. Saṁhitā covers mundane astrology and civic-event prediction, not individual-natal daśā timing. Individual daśā analysis is firmly horā-skandha.",
      },
    ],
  },
  {
    slug: "drill-04",
    question: "A student claims: 'KP has no saṁhitā contribution, so KP is an incomplete stream.' Evaluate this claim using the streams × skandhas matrix.",
    options: [
      {
        id: "A",
        label: "True — a complete stream must contribute to all three skandhas distinctly",
        stream: "N/A",
        skandha: "N/A",
        isCorrect: false,
        explanation: "Incorrect. The matrix shows that only Parāśari has full three-skandha distinctive corpus. Jaiminī, KP, and Lal Kitab all concentrate their distinctive contributions in horā while using standard classical (mostly Parāśari-tradition) gaṇita and saṁhitā material. This is *normal cross-stream practice*, not incompleteness. The 'complementary, not competing' principle (Lesson 1.2.6) extends here: streams are allowed to have different distribution of strength across skandhas.",
      },
      {
        id: "B",
        label: "False — KP uses standard classical saṁhitā material; lacking a distinctively-KP saṁhitā is normal, not incomplete",
        stream: "N/A",
        skandha: "N/A",
        isCorrect: true,
        explanation: "Correct. Per the matrix: KP's distinctive contribution is horā-centric (sub-lord, CSL, RP, KP horary). For gaṇita and saṁhitā, KP uses standard classical material — this is normal cross-stream practice. The 'incomplete' framing imposes an external hierarchy that the classical landscape does not recognise. The four-stream landscape is complementary, not competing; each stream has different distribution of strength.",
      },
      {
        id: "C",
        label: "Partially true — KP is incomplete in saṁhitā but compensates with deeper gaṇita",
        stream: "N/A",
        skandha: "N/A",
        isCorrect: false,
        explanation: "Incorrect. KP does not have 'deeper gaṇita' either — it uses standard classical gaṇita plus Placidus cusps (a Western-imported extension). The 'compensates' framing still imposes an external completeness metric that the classical landscape does not use. The honest framing is: each stream has a centre-of-gravity skandha (horā for KP) and uses shared classical material for the others.",
      },
      {
        id: "D",
        label: "True — because saṁhitā includes mundane astrology, and KP cannot predict national elections",
        stream: "N/A",
        skandha: "N/A",
        isCorrect: false,
        explanation: "Incorrect. This conflates 'having a distinctively-KP saṁhitā corpus' with 'being able to practice saṁhitā'. A KP practitioner CAN apply standard classical saṁhitā methods (including mundane astrology) even without a distinctively-KP saṁhitā text. The absence of a distinctive corpus does not mean the absence of capability.",
      },
    ],
  },
  {
    slug: "drill-05",
    question: "Which of the following curriculum module distributions most honestly reflects the modern operational reality of Vedic-astrology practice?",
    context: "The curriculum's actual distribution: ~30 horā modules, ~5 gaṇita, ~3-4 saṁhitā, ~5 cross-cutting/meta.",
    options: [
      {
        id: "A",
        label: "Equal coverage: 10 modules per skandha, because all three are equally foundational",
        stream: "N/A",
        skandha: "N/A",
        isCorrect: false,
        explanation: "Incorrect. While all three skandhas ARE foundational, 'equally foundational' does not imply 'equally covered in curriculum'. The curriculum's distribution honestly reflects modern operational reality: horā dominates practitioner use-cases, gaṇita is machine-discharged, and saṁhitā is more specialised. Equal coverage would misrepresent the modern landscape and waste learner time on material less relevant to actual practice.",
      },
      {
        id: "B",
        label: "Horā-dominant (~30) + Gaṇita-foundational (~5) + Saṁhitā-specialised (~3-4), because this mirrors actual practitioner use-case prevalence",
        stream: "N/A",
        skandha: "N/A",
        isCorrect: true,
        explanation: "Correct. Per Lesson 1.3.1 §4.7 + §4.8. The distribution mirrors modern operational reality: individual-natal-chart prediction (horā) is the dominant client-facing use-case; gaṇita is foundational but machine-discharged for most practitioners; saṁhitā is more specialised with smaller practitioner constituency. The curriculum's literacy-vs-mastery doctrine (Constitution §3.6) justifies this: mastery in horā + literacy in gaṇita and saṁhitā + opt-in mastery paths in selected specialisations.",
      },
      {
        id: "C",
        label: "Gaṇita-dominant, because without gaṇita the other skandhas cannot function",
        stream: "N/A",
        skandha: "N/A",
        isCorrect: false,
        explanation: "Incorrect. While gaṇita IS foundational-substrate (both other skandhas depend on it), 'foundational' does not mean 'most curriculum coverage'. Modern computational engines discharge most manual gaṇita work. A practitioner needs gaṇita *literacy* (understanding how charts are computed) but not gaṇita *mastery* (manual computation) to practice horā effectively. The curriculum's ~5 gaṇita modules reflect this literacy threshold.",
      },
      {
        id: "D",
        label: "Saṁhitā-dominant, because Bṛhat Saṁhitā's 106 chapters show saṁhitā is the most encyclopaedic",
        stream: "N/A",
        skandha: "N/A",
        isCorrect: false,
        explanation: "Incorrect. While saṁhitā IS the most encyclopaedic in topical breadth (Bṛhat Saṁhitā's 106 chapters demonstrate this), 'encyclopaedic breadth' does not translate to 'modern operational dominance'. Most modern clients seek personal predictive consultation (horā), not mundane-event prediction or gemological assessment (saṁhitā). The curriculum's distribution honestly reflects this operational mismatch between classical breadth and modern demand.",
      },
    ],
  },
];
