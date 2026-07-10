/**
 * Jaiminī Second-Tradition Dojo — static data for L2.5 §7 flagship.
 *
 * Two-tab synthesis flagship:
 *  Tab 1 — Doctrinal-Pair Atlas: 6 cross-tradition pairs showing what each
 *          tradition's mechanism is for the same predictive purpose, plus
 *          the genuinely-unique-to-Jaiminī markers.
 *  Tab 2 — Tradition-Attribution Drill: 5 scenarios where the learner must
 *          identify which tradition each claim belongs to (or both, or
 *          neither), and detect mis-attribution.
 */

export interface DoctrinePair {
  slug: string;
  purpose: string;
  parashari: string;
  parashariMechanism: string;
  jaimini: string;
  jaiminiMechanism: string;
  /** "unique" if there's no Parāśari counterpart; otherwise "parallel" or "different". */
  relationship: "parallel-different-mechanism" | "unique-to-jaimini" | "unique-to-parashari";
  takeaway: string;
}

export const DOCTRINAL_PAIR_ATLAS: DoctrinePair[] = [
  {
    slug: "time-engine",
    purpose: "Time-engine (when does this event activate?)",
    parashari: "Vimśottarī Daśā",
    parashariMechanism: "Nakṣatra-lord-based 120-year cycle assigned by Moon's nakṣatra at birth",
    jaimini: "Cara Rāśi Daśā",
    jaiminiMechanism: "Rāśi-based cycle computed from the rāśis themselves and their movability classification",
    relationship: "parallel-different-mechanism",
    takeaway:
      "Same predictive purpose (when does an event time-out), different mechanisms. Multi-stream practice uses both, choosing the daśā that suits the specific predictive question.",
  },
  {
    slug: "significators",
    purpose: "Significators (who/what does this graha represent?)",
    parashari: "Naisargika Kārakas (fixed)",
    parashariMechanism: "Sun = soul/father, Moon = mother, Mars = brother, etc. — same significators for every chart",
    jaimini: "Cara Kārakas (variable)",
    jaiminiMechanism: "Graha with highest degrees = Ātma-kāraka, next = Amātya-kāraka, etc. — re-computed per chart",
    relationship: "parallel-different-mechanism",
    takeaway:
      "Parāśari fixed kārakas are universal; Jaiminī variable kārakas are chart-specific. Different operational lenses on the same significator question — both honoured.",
  },
  {
    slug: "aspects",
    purpose: "Aspects (what affects what across the chart?)",
    parashari: "Graha-Aspects (graha-dṛṣṭi)",
    parashariMechanism: "Each graha aspects specific houses from itself (Mars: 4th, 7th, 8th; Jupiter: 5th, 7th, 9th; etc.)",
    jaimini: "Rāśi-Aspects (rāśi-dṛṣṭi)",
    jaiminiMechanism: "Movable rāśis aspect fixed rāśis (and vice versa) at specific angular distances — sign-class-based",
    relationship: "parallel-different-mechanism",
    takeaway:
      "Parāśari aspects work at the graha level; Jaiminī aspects work at the rāśi level. Different aspect-systems entirely — neither replaces the other.",
  },
  {
    slug: "yogas",
    purpose: "Yogas (chart configurations producing distinctive life-outcomes)",
    parashari: "Graha-position yogas",
    parashariMechanism: "Pañcamahāpuruṣa, Rāja, Dhana, etc. — based on graha-positions, ownerships, and exchanges",
    jaimini: "Rāśi-aspect + cara-kāraka yogas",
    jaiminiMechanism: "Distinctive Jaiminī yogas built on rāśi-aspect logic and cara-kāraka positions",
    relationship: "parallel-different-mechanism",
    takeaway:
      "Both yoga catalogues are operationally consulted by serious practitioners. Each captures patterns the other does not.",
  },
  {
    slug: "arudha-lagna",
    purpose: "Image-of-self / public perception",
    parashari: "(no foundational equivalent)",
    parashariMechanism:
      "Parāśari has bhāva-ārūḍha as a derivative pattern but no canonical foundational interpretive lens dedicated to public-perception",
    jaimini: "Ārūḍha Lagna",
    jaiminiMechanism:
      "Foundational interpretive lens — the projection of the lagna and its lord onto the rāśi-wheel; reflects perceived self vs actual self",
    relationship: "unique-to-jaimini",
    takeaway:
      "Genuinely unique to Jaiminī. Modern practitioners consulting Jaiminī ārūḍha for reputation / brand / public-image questions are drawing on a doctrinal lens that Parāśari does not provide foundationally.",
  },
  {
    slug: "bhava-lordships",
    purpose: "House-lordship effects (effects of bhāva-lords)",
    parashari: "Bhāva-lord rules (extensive)",
    parashariMechanism:
      "BPHS dedicates extensive prakaraṇas to bhāva-lord-in-other-bhāva effects, exchanges, lordships of kendras, koṇas, dusthānas, etc.",
    jaimini: "(less foundational emphasis)",
    jaiminiMechanism:
      "Jaiminī sūtras give comparatively less foundational weight to bhāva-lord effects; the operational emphasis sits on rāśi-aspects and cara-kārakas",
    relationship: "unique-to-parashari",
    takeaway:
      "Bhāva-lordship doctrine is most fully developed in Parāśari. Cross-tradition asymmetries exist in BOTH directions — each tradition has areas of distinctive foundational development.",
  },
];

/** Tab 2 — five tradition-attribution scenarios. */
export interface AttributionScenario {
  id: string;
  setup: string;
  claim: string;
  /** Options shown to the learner. */
  options: Array<{
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }>;
  /** Final synthesis takeaway shown after answering. */
  synthesis: string;
}

export const ATTRIBUTION_SCENARIOS: AttributionScenario[] = [
  {
    id: "scenario-1-arudha",
    setup:
      "A practitioner-friend tells you: \"I read the client's chart using Ārūḍha Lagna to understand how she's perceived professionally — her ārūḍha is in the 10th house from her lagna, very strong, that's why she has the public reputation she has.\"",
    claim: "Which tradition is the practitioner working in here?",
    options: [
      {
        id: "a",
        label: "Parāśari — BPHS describes bhāva-ārūḍha patterns",
        isCorrect: false,
        feedback:
          "Mis-attributed. Although Parāśari has bhāva-ārūḍha as a derivative pattern, the Ārūḍha Lagna as a FOUNDATIONAL interpretive lens belongs to Jaiminī. Citing this work as Parāśari mis-locates the doctrinal source.",
      },
      {
        id: "b",
        label: "Jaiminī — Ārūḍha Lagna is a foundational Jaiminī lens",
        isCorrect: true,
        feedback:
          "Correct. Ārūḍha Lagna is one of the five genuinely-distinctive-to-Jaiminī doctrines. The practitioner is working in the Jaiminī tradition. Honest citation: \"per Jaiminī ārūḍha doctrine.\"",
      },
      {
        id: "c",
        label: "Both — neither is the primary source",
        isCorrect: false,
        feedback:
          "Mis-located. Ārūḍha Lagna does not have a Parāśari foundational counterpart — it is uniquely Jaiminī. The correct citation is single-tradition: Jaiminī.",
      },
    ],
    synthesis:
      "Ārūḍha Lagna is genuinely-unique-to-Jaiminī. Public-perception / image-of-self questions are the natural fit for this doctrine. Honest citation: \"Per Jaiminī Ārūḍha doctrine.\"",
  },
  {
    id: "scenario-2-vimshottari",
    setup:
      "Another practitioner says: \"His Mars antardaśā within Jupiter mahādaśā is producing the property purchase — Mars rules the 4th and is well-placed.\"",
    claim: "Which tradition's time-engine is the practitioner using?",
    options: [
      {
        id: "a",
        label: "Jaiminī — Cara Rāśi Daśā",
        isCorrect: false,
        feedback:
          "Mis-attributed. \"Mahādaśā\" + \"antardaśā\" with graha names (Jupiter, Mars) as period-lords is the signature of Vimśottarī, which is the Parāśari time-engine. Jaiminī's Cara Rāśi Daśā uses RĀŚI names as period markers, not graha names.",
      },
      {
        id: "b",
        label: "Parāśari — Vimśottarī Daśā",
        isCorrect: true,
        feedback:
          "Correct. Graha-named mahādaśā/antardaśā is the Vimśottarī signature — Parāśari's nakṣatra-lord time-engine. The other major Parāśari daśās (Aṣṭottarī, Yoginī) also use graha-named period-lords. Sign-named periods belong to Jaiminī.",
      },
      {
        id: "c",
        label: "Either — the daśā system is unclear from this description",
        isCorrect: false,
        feedback:
          "The signature is actually clear: graha-named period-lords = Parāśari (Vimśottarī family). Jaiminī period-lords would be rāśi-named.",
      },
    ],
    synthesis:
      "Tradition-attribution shortcut for daśās: graha-named periods (Mars-Jupiter-Saturn) → Parāśari Vimśottarī family. Rāśi-named periods (Mesha-Vrṣabha) → Jaiminī Rāśi-Daśā family.",
  },
  {
    id: "scenario-3-rashi-aspect",
    setup:
      "A student writes in an essay: \"Mars in Aries aspects the 4th, 7th, and 8th houses, applying its energetic projection to property, partnership, and shared-resources matters.\"",
    claim: "Which tradition's aspect system is the student citing?",
    options: [
      {
        id: "a",
        label: "Parāśari — graha-aspect doctrine",
        isCorrect: true,
        feedback:
          "Correct. Mars aspecting the 4th, 7th, and 8th from itself is the Parāśari GRAHA-aspect doctrine. Jaiminī aspects are SIGN-based — a movable rāśi aspects the fixed rāśis other than the one adjacent to it: e.g. Aries (movable) aspects Leo, Scorpio, and Aquarius, but NOT the adjacent Taurus — not graha-based.",
      },
      {
        id: "b",
        label: "Jaiminī — rāśi-aspect doctrine",
        isCorrect: false,
        feedback:
          "Mis-attributed. The aspect logic cited (Mars aspecting specific houses from itself) is Parāśari graha-aspect logic. Jaiminī rāśi-aspects are sign-class-based, not graha-based.",
      },
      {
        id: "c",
        label: "Both — combined aspect system",
        isCorrect: false,
        feedback:
          "Although serious practice draws on BOTH aspect systems as complementary lenses, the specific claim cited here is exclusively Parāśari (graha-aspect-from-position). The citation should reflect the actual system used.",
      },
    ],
    synthesis:
      "Aspect-attribution shortcut: graha aspecting specific houses from itself = Parāśari graha-dṛṣṭi. Rāśi aspecting other rāśis by movability-class = Jaiminī rāśi-dṛṣṭi. They are different aspect-systems with different operational logic.",
  },
  {
    id: "scenario-4-multi-stream",
    setup:
      "A senior practitioner says: \"For this chart I'm reading the Vimśottarī daśā timing, the Ātma-kāraka's placement, AND the graha-aspect to the 10th — combining all three to get the most-honest picture of the career trajectory.\"",
    claim: "What is the practitioner doing?",
    options: [
      {
        id: "a",
        label: "Mixing traditions incorrectly — they should pick one",
        isCorrect: false,
        feedback:
          "Not a mistake. Multi-stream synthesis (drawing on both Parāśari and Jaiminī doctrines for the same chart) is canonical practice in the modern revival of Jaiminī. The key is HONEST CITATION of which tradition each tool comes from, not single-tradition purism.",
      },
      {
        id: "b",
        label: "Multi-stream synthesis — combining Parāśari + Jaiminī tools",
        isCorrect: true,
        feedback:
          "Correct. Vimśottarī (Parāśari) + Ātma-kāraka (Jaiminī) + graha-aspect (Parāśari) is honest multi-stream practice. The practitioner is treating the two traditions as parallel-not-subordinate and drawing the strongest tool from each for the specific predictive question.",
      },
      {
        id: "c",
        label: "Working purely in Jaiminī — Ātma-kāraka is Jaiminī",
        isCorrect: false,
        feedback:
          "Not purely Jaiminī — Vimśottarī and graha-aspects are Parāśari. The practitioner is multi-stream, drawing on both. Single-tradition purism would mean using only one set of tools.",
      },
    ],
    synthesis:
      "Multi-stream synthesis is honest classical practice. The integrity is in CITATION — naming which tradition each tool belongs to — not in tradition-purism. \"Per Vimśottarī, the Mars antardaśā... per Jaiminī Ātma-kāraka doctrine, the soul-significator...\" — each cited honestly.",
  },
  {
    id: "scenario-5-jaimini-identity",
    setup:
      "A textbook claims: \"Maharṣi Jaiminī, the disciple of Vyāsa, composed both the Pūrva-Mīmāṁsā Sūtra (the foundational text of the Mīmāṁsā philosophical school) and the Jaiminī Sūtra of Jyotiṣa. He is therefore one of the most consequential ṛṣis in the entire Indic intellectual heritage.\"",
    claim: "How should the curriculum cite this same-Jaiminī claim?",
    options: [
      {
        id: "a",
        label: "Accept as given — the tradition treats them as the same person",
        isCorrect: false,
        feedback:
          "Partial honesty. Tradition does treat them as the same Jaiminī, but academic-Indology scholarship treats the same-author question as unresolved — some scholars argue single authorship, others argue two different authors of the same name. Curriculum honesty requires citing both views.",
      },
      {
        id: "b",
        label: "Cite tradition's view + acknowledge academic uncertainty",
        isCorrect: true,
        feedback:
          "Correct. The curriculum's framing: hold the question open. Cite both texts as Jaiminī-attributed, acknowledge that traditional view treats them as the same Maharṣi, AND acknowledge that academic-Indology has not resolved the same-author question. This is honest-uncertainty doctrine in action.",
      },
      {
        id: "c",
        label: "Refuse the citation entirely — too uncertain to teach",
        isCorrect: false,
        feedback:
          "Over-correction. The Jaiminī Sūtra of Jyotiṣa is well-attested as a foundational text of the second tradition — that fact does not depend on resolving the cross-text identity question. Cite the Jyotiṣa text confidently; cite the cross-text identity as an open question.",
      },
    ],
    synthesis:
      "Honest-uncertainty doctrine: when traditional and academic accounts diverge on an identity question, cite BOTH and hold the question open. The lesson is teachable without resolution: Jaiminī Sūtra exists, is Jaiminī-attributed, is the foundational text of the second tradition. The cross-text Mīmāṁsā question is genuinely open — don't pretend otherwise.",
  },
];
