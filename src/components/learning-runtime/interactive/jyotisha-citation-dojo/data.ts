/**
 * Jyotiṣa Citation Dojo — L2.1 §7 flagship data.
 *
 * Two views' data:
 *   1. DIVERGENCE: per-text academic vs traditional dating, with gap-years
 *      derived for the lollipop viz.
 *   2. DRILL: five citation-discipline scenarios. Three are adapted from
 *      L2.1 §6's Recognition cases; two are invented for full coverage of
 *      the §4.6 honest-citation discipline (which classical source, what
 *      date, what recension, what modern translator).
 */

export interface DivergencePoint {
  slug: string;
  label: string;
  academicYear: number;
  traditionalYear: number;
  /** Magnitude of the gap (positive number). */
  gapYears: number;
  /** Short note about why the chronologies disagree. */
  note: string;
}

/** Computed from the timeline entries — only the divergent ones. */
export const DIVERGENCE_POINTS: DivergencePoint[] = [
  {
    slug: "lagadha-vedanga-jyotisha",
    label: "Lagadha — Vedāṅga Jyotiṣa",
    academicYear: -800,
    traditionalYear: -1300,
    gapYears: 500,
    note: "Traditional Vedic-era placement vs academic linguistic/astronomical-data analysis pushing later.",
  },
  {
    slug: "parashara-bphs",
    label: "Parāśara — BPHS",
    academicYear: 1200,
    traditionalYear: -3000,
    gapYears: 4200,
    note: "Maharṣi Parāśara as pre-classical Vedic ṛṣi (traditional) vs recensional form medieval (academic).",
  },
  {
    slug: "jaimini-sutras",
    label: "Jaiminī — Jaiminī Sūtras",
    academicYear: 200,
    traditionalYear: -2800,
    gapYears: 3000,
    note: "Maharṣi Jaiminī as pre-classical ṛṣi (traditional) vs classical composition (academic).",
  },
];

export interface DrillScenario {
  id: string;
  title: string;
  prompt: string;
  options: { id: string; label: string }[];
  correctId: string;
  rationale: string;
  /** Which of the four citation-discipline moves this scenario tests. */
  disciplineMove: string;
}

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    id: "s1",
    title: "\"Per ancient classical tradition, BPHS teaches…\"",
    prompt:
      "A modern teacher writes: \"Per the ancient classical tradition, BPHS teaches that the Sun is the kāraka of the soul and the king.\" A serious learner notices something off. What's wrong with the framing?",
    options: [
      {
        id: "a",
        label: "Nothing — BPHS is ancient classical; the teaching is correct.",
      },
      {
        id: "b",
        label: "\"Ancient classical tradition\" is too vague — BPHS exists only in medieval recensions (10th-14th c. CE academic). A careful citation names the recension family.",
      },
      {
        id: "c",
        label: "BPHS isn't a Vedic text — it's medieval, so the teaching has no authority.",
      },
      {
        id: "d",
        label: "The Sun isn't the kāraka of the soul — the teaching itself is wrong.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the right disambiguation. BPHS's core doctrine is likely pre-classical, but the TEXT we read exists only in medieval recensions. \"Ancient classical tradition\" elides the recension problem entirely. The honest move is to cite the recension or at minimum acknowledge that the text-form is medieval. (a) underestimates the recension problem. (c) overswings — the doctrine has real authority within the Parāśarī lineage even though the text-form is medieval. (d) is unrelated — the Sun-as-soul-kāraka teaching is doctrinally standard.",
    disciplineMove: "What recension? — for BPHS especially, name the manuscript family or at least acknowledge medieval recensional form.",
  },
  {
    id: "s2",
    title: "Comparing Lagadha vs Varāhamihira dating",
    prompt:
      "A learner reads two adjacent paragraphs: \"Lagadha's Vedāṅga Jyotiṣa, dated 1400 BCE, established…\" and \"Varāhamihira, the 6th-century codifier, extended this in his Bṛhat Saṁhitā…\". What's the citation-discipline problem?",
    options: [
      {
        id: "a",
        label: "Nothing — both dates are widely accepted.",
      },
      {
        id: "b",
        label: "Lagadha is cited with TRADITIONAL dating; Varāhamihira with ACADEMIC dating. The chronologies are mixed without acknowledgement — an inconsistent citation discipline.",
      },
      {
        id: "c",
        label: "Varāhamihira isn't a codifier — he's an author.",
      },
      {
        id: "d",
        label: "1400 BCE for Lagadha is too early — academic dating places it later.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) catches the real problem. Lagadha at 1400 BCE is the TRADITIONAL dating; Varāhamihira at 6th century CE is the ACADEMIC dating (where academic and traditional largely converge). Mixing chronologies without acknowledgement is exactly the kind of \"citation rot\" §4.6 warns against. The honest move is either: (a) use academic dating for both, OR (b) use traditional for both and clearly mark traditional-dating throughout, OR (c) explicitly cite both. (d) is partly true but isn't the citation-discipline issue.",
    disciplineMove: "What date? — pick a chronology and apply it consistently OR explicitly switch and mark the switch.",
  },
  {
    id: "s3",
    title: "\"Is KP just made-up modern stuff?\"",
    prompt:
      "A learner asks: \"Is KP just made-up modern stuff, since Krishnamurti wrote it in the 1960s? Shouldn't we only study the classical authors?\" What's the right framing?",
    options: [
      {
        id: "a",
        label: "Yes — only classical authors carry authority; KP is a recent invention.",
      },
      {
        id: "b",
        label: "KP is a MODERN PRIMARY tradition — authored 1963-1972 by K.S. Krishnamurti, with its own substantive methodology (sub-lord theory) and a large practitioner community. Real and authoritative, just modern.",
      },
      {
        id: "c",
        label: "KP isn't astrology — it's a different discipline entirely.",
      },
      {
        id: "d",
        label: "All astrology is modern invention anyway, so the question doesn't matter.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the right framing. KP is a MODERN PRIMARY — a real, independent 20th-century tradition with its own methodology. The MODERN PRIMARY carve-out (§4.5) is precisely the move that lets the curriculum honor both classical lineage AND modern authoritative streams. (a) collapses the distinction between modern derivative (often weak) and modern primary (legitimately authoritative). (c) is false — KP is astrology, just with sub-lord refinements. (d) is dismissive.",
    disciplineMove: "Which classical source? — recognise when the source is MODERN PRIMARY, not classical at all. Both can be authoritative.",
  },
  {
    id: "s4",
    title: "Translator-edition matters",
    prompt:
      "A student cites: \"BPHS says X (Sharma translation, 1995)\". Another student cites: \"BPHS says NOT-X (Santhanam translation, 1984)\". They appear to contradict. What's going on?",
    options: [
      {
        id: "a",
        label: "One of the translators is just wrong.",
      },
      {
        id: "b",
        label: "Different translators work from different recensional manuscripts AND make different interpretive choices for ambiguous Sanskrit passages. Both citations need to acknowledge the translator-edition.",
      },
      {
        id: "c",
        label: "The two students are reading different texts entirely.",
      },
      {
        id: "d",
        label: "BPHS is contradictory throughout — pick whichever supports your case.",
      },
    ],
    correctId: "b",
    rationale:
      "(b) is the honest framing. Sanskrit classical texts often have ambiguous passages requiring interpretive choices in translation. Different translators work from different recensional manuscripts AND make different interpretive choices. When two translations \"contradict\", the honest move is to name the translator-edition for each and recognise that the underlying disagreement is interpretive, not factual. (a) blames the translators wrongly. (c) is rarely literally true. (d) is intellectual abdication.",
    disciplineMove: "What modern translator? — name the translator-edition; different choices carry different interpretive emphases.",
  },
  {
    id: "s5",
    title: "Citing Pingree's dating",
    prompt:
      "A learner writes: \"Per Pingree, the Yavanajātaka dates to 269 CE — the colophon date.\" A peer says \"You should cite that more carefully.\" Why?",
    options: [
      {
        id: "a",
        label: "Pingree's date is contested — Bill Mak (2014+) has questioned aspects of Pingree's specific reconstructions.",
      },
      {
        id: "b",
        label: "269 CE is wrong — it's actually 250 CE.",
      },
      {
        id: "c",
        label: "Pingree wasn't an authority on the Yavanajātaka.",
      },
      {
        id: "d",
        label: "The colophon date can't be trusted at all.",
      },
    ],
    correctId: "a",
    rationale:
      "(a) is the right citation-discipline move. The colophon-date 269 CE is widely accepted, AND Pingree (1978) is the foundational secondary source — but Mak (2014 onwards) has contested aspects of Pingree's specific manuscript-stemma reconstructions. A careful citation acknowledges the post-Pingree academic debate. (b) is fabricated — Pingree's date IS 269 CE. (c) is false — Pingree's 1978 critical edition IS the standard reference. (d) overswings — the colophon is a real piece of evidence, just one of several.",
    disciplineMove: "What date? — acknowledge that even academic dating has ongoing scholarly debate; cite the canonical reference AND note major contesting views.",
  },
];

/** Framework summary shown in the dojo's right panel. */
export const FRAMEWORK_SUMMARY = {
  headline: "Cite what you cite — not what sounds ancient.",
  body: "The honest-citation discipline is four moves: (1) which specific classical source, (2) what date and chronology family, (3) what recension or manuscript family, (4) what modern translator. Vague gestures to \"the classical tradition\" hide the recension problem AND mix chronologies AND elide translator interpretive choices. A learner who masters these four moves operates as a system-aware scholar; one who doesn't carries silent confusion into every classical citation they ever make.",
};
