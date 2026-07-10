/**
 * Engine for Lesson 23.1.4 — Muhūrta's Comparative Position.
 *
 * Provides the five jyotiṣa-stream variants, five cross-stream-shared
 * foundational principles, the sva-dharma four-input stream-selection
 * framework, and scenario-based inspector drills, plus synergy helpers.
 */

export type StreamKey =
  | "parashari"
  | "tajika"
  | "kp"
  | "jaimini"
  | "lal-kitab";

export type SharedPrincipleKey =
  | "pancanga"
  | "synergy-natal"
  | "agentive-time"
  | "discipline-distinction"
  | "honest-attribution";

export type SvaDharmaInputKey =
  | "journal-evidence"
  | "intellectual-engagement"
  | "client-context"
  | "community-accessibility";

export type IssueKey =
  | "cross-stream-conflation"
  | "variance-misread"
  | "misattribution"
  | "none";

export type Verdict = "compliant" | "non-compliant" | "needs-context";

export interface StreamVariant {
  key: StreamKey;
  name: string;
  nameDevanagari: string;
  period: string;
  foundation: string;
  techniqueSignature: string;
  engagementContext: string;
  attributionNote: string;
}

export interface SharedPrinciple {
  key: SharedPrincipleKey;
  number: number;
  label: string;
  description: string;
  lessonAnchor: string;
}

export interface SvaDharmaInput {
  key: SvaDharmaInputKey;
  number: number;
  label: string;
  prompt: string;
  parashariReading: string;
  secondaryReading: string;
}

export interface Scenario {
  id: number;
  title: string;
  situation: string;
  actor?: string;
  expectedStream: StreamKey | "cross-stream-conflation" | "not-applicable";
  expectedPrinciples: SharedPrincipleKey[];
  expectedIssue: IssueKey;
  expectedVerdict: Verdict;
  explanation: string;
  response: string;
}

export const STREAM_VARIANTS: StreamVariant[] = [
  {
    key: "parashari",
    name: "Parāśarī-tradition",
    nameDevanagari: "पाराशरी-परंपरा",
    period: "Classical dominant tradition",
    foundation: "Muhūrta-Cintāmaṇi (Rāma Daivajña, 16th c.), Muhūrta-Mārtaṇḍa, BPHS Chapter 1, Bṛhat Saṁhitā Adhyāya 99",
    techniqueSignature: "MC Chapters 16-22 chart-correspondence framework; lagna-purity; Vimśottarī daśā; tārā-bala nine-fold analysis",
    engagementContext: "Broad life-direction muhūrtas — wedding, gṛha-praveśa, vyāvasāya-ārambha, travel",
    attributionNote: "Cite as Parāśarī-tradition via MC; dominant default for Tier-2 muhūrta-specialisation.",
  },
  {
    key: "tajika",
    name: "Tājika-stream",
    nameDevanagari: "ताजिक-धारा",
    period: "Classical-stream synthesis",
    foundation: "Hora-Ratnam (Bāḷabhadra, 17th c.), Tājika Nīlakaṇṭhī",
    techniqueSignature: "Varṣaphala-context muhūrta; muthashila / planetary-mutual-application timing; Sahams for event-types",
    engagementContext: "Annual-prediction-window muhūrtas where the varṣaphala chart informs timing",
    attributionNote: "Cite as Tājika-stream via Hora-Ratnam; not Parāśarī-tradition.",
  },
  {
    key: "kp",
    name: "KP-stream",
    nameDevanagari: "कृष्णमूर्ति-पद्धति",
    period: "20th-century modern systematisation",
    foundation: "K.S. Krishnamurti's KP Readers I-VI (1908-1972)",
    techniqueSignature: "Sub-lord-theory applied to muhūrta-chart; cuspal-sub-lord rulership; significator-strength analysis",
    engagementContext: "Horary and short-window prediction work where KP-stream fluency exists",
    attributionNote: "Cite as KP-school 20th-century systematisation; NOT 'ancient Vedic' and NOT in BPHS/MC.",
  },
  {
    key: "jaimini",
    name: "Jaimini-stream",
    nameDevanagari: "जैमिनी-धारा",
    period: "Classical sūtra tradition",
    foundation: "Jaimini Sūtras (Maharṣi Jaimini); modern PJC/SJC expositions",
    techniqueSignature: "Cāra-daśā-aware timing; kāraka-significator analysis (Ātmakāraka, Amātyakāraka, etc.)",
    engagementContext: "Integrated Parāśarī + Jaimini practice where Jaimini Tier-2 fluency exists",
    attributionNote: "Cite as Jaimini-stream via Jaimini Sūtras + modern PJC/SJC exposition.",
  },
  {
    key: "lal-kitab",
    name: "Lal Kitab",
    nameDevanagari: "लाल किताब",
    period: "20th-century Punjabi tradition",
    foundation: "Pandit Roop Chand Joshi (1939, 1952)",
    techniqueSignature: "Distinct house-system and planetary-strength rules; tradition-specific timing-rules embedded in remediation-system",
    engagementContext: "Punjabi-tradition-grounded client-base where Lal Kitab Tier-2 fluency exists",
    attributionNote: "Cite as Lal Kitab-tradition; NOT Parāśarī-tradition and NOT 'ancient Vedic'.",
  },
];

export const SHARED_PRINCIPLES: SharedPrinciple[] = [
  {
    key: "pancanga",
    number: 1,
    label: "Pañcāṅga is universal",
    description: "Tithi, vāra, nakṣatra, yoga, karaṇa derive from the same Sun-Moon astronomical computation across every stream-variant. Stream-specific weightings differ; the underlying quantities are shared.",
    lessonAnchor: "Lesson 23.1.2",
  },
  {
    key: "synergy-natal",
    number: 2,
    label: "Synergy-with-natal-chart",
    description: "The muhūrta-chart's lagna, bhāvas, and planetary placements are evaluated in relation to the actor's natal chart, not in isolation. The same window may have different fitness for different actors.",
    lessonAnchor: "This lesson §4.3; MC 16-vicinity śloka",
  },
  {
    key: "agentive-time",
    number: 3,
    label: "Agentive-time-selection premise",
    description: "Muhūrta selects a forward-looking initiation window for an action the actor is undertaking. It is not retrospective and not non-agentive.",
    lessonAnchor: "Lesson 23.1.1 §4.5",
  },
  {
    key: "discipline-distinction",
    number: 4,
    label: "Muhūrta-vs-other-discipline distinctions",
    description: "Muhūrta is distinguished from jātaka (birth-moment interpretation), praśna (reactive question-answering), and gocara (continuous transit analysis) across all stream-variants.",
    lessonAnchor: "Lesson 23.1.1 §4.4",
  },
  {
    key: "honest-attribution",
    number: 5,
    label: "Honest-attribution discipline",
    description: "Every stream-variant requires naming the specific stream-tradition and source-text for each technique. Cross-stream conflation and misattribution are forbidden universally.",
    lessonAnchor: "Lesson 23.1.3 §4.10; Lesson 24.4.1 §4.9",
  },
];

export const SVA_DHARMA_INPUTS: SvaDharmaInput[] = [
  {
    key: "journal-evidence",
    number: 1,
    label: "Journal-evidence",
    prompt: "For each muhūrta-tradition-variant applied, what is the calibrated hit-rate from your self-chart-tracking journal?",
    parashariReading: "Parāśarī-tradition usually has the largest case-base because it is the default stream; weight this input most heavily.",
    secondaryReading: "KP / Tājika / Jaimini / Lal Kitab samples are often smaller; avoid drawing strong conclusions from sparse data.",
  },
  {
    key: "intellectual-engagement",
    number: 2,
    label: "Genuine intellectual engagement",
    prompt: "During svādhyāya, which stream-variant's source-corpus feels like nourishment rather than effort-without-resonance?",
    parashariReading: "MC slow-reading and Phaladīpikā engagement often anchor Parāśarī-tradition resonance.",
    secondaryReading: "Hora-Ratnam, KP Readers, Tājika Nīlakaṇṭhī, or Lal Kitab may resonate for specific practitioners.",
  },
  {
    key: "client-context",
    number: 3,
    label: "Actual client-context",
    prompt: "What kind of muhūrta-work does your practice actually involve?",
    parashariReading: "Wedding, gṛha-praveśa, vyāvasāya-ārambha, and travel muhūrtas fit Parāśarī-tradition centrally.",
    secondaryReading: "Horary windows fit KP; annual-prediction windows fit Tājika; Punjabi-tradition clientele fits Lal Kitab.",
  },
  {
    key: "community-accessibility",
    number: 4,
    label: "Community-accessibility",
    prompt: "Which stream-variant is accessible through mentor-mode and peer-mode engagement?",
    parashariReading: "Parāśarī-tradition has the broadest mentor and peer community globally.",
    secondaryReading: "KP-school, SJC/Jaimini, Tājika, and Lal Kitab communities are more specialised and geographically variable.",
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Honest KP-stream attribution",
    situation:
      "A practitioner tells a client: 'For your wedding muhūrta, I am working within the KP-stream. I will examine the sub-lord of the muhūrta-chart's 7th cusp and its significators for marriage houses. This is K.S. Krishnamurti's 20th-century systematisation, not classical MC.'",
    expectedStream: "kp",
    expectedPrinciples: ["synergy-natal", "honest-attribution", "discipline-distinction"],
    expectedIssue: "none",
    expectedVerdict: "compliant",
    explanation:
      "The practitioner names the stream-variant explicitly, attributes it correctly to KP-school (20th-century systematisation), and stays within the muhūrta discipline (not praśna or jātaka). The focus on the 7th cusp honours the synergy-with-natal-chart principle by evaluating the muhūrta chart's fitness for the specific actor.",
    response:
      "This is discipline-compliant. The recommendation operates from one stream-tradition with honest attribution and does not mix techniques from other streams.",
  },
  {
    id: 2,
    title: "Cross-stream conflation",
    situation:
      "A practitioner recommends a muhūrta by combining Parāśarī tithi-vāra-nakṣatra evaluation, KP sub-lord-theory, and a Jaimini cāra-daśā consideration — but has only Tier-1 survey-level acquaintance with KP and Jaimini.",
    expectedStream: "cross-stream-conflation",
    expectedPrinciples: ["honest-attribution"],
    expectedIssue: "cross-stream-conflation",
    expectedVerdict: "non-compliant",
    explanation:
      "Cross-stream operation requires Tier-2 working-fluency in each stream involved (Sequence Principle 3). Tier-1-survey-level mixing is shallow conflation, not integration. The practitioner is operating below the adhikāra threshold for KP and Jaimini techniques.",
    response:
      "Commit to one primary stream-tradition for Tier-2 working-fluency; refer to single-stream practitioners when a different stream-variant is needed.",
  },
  {
    id: 3,
    title: "Variance misread as arbitrariness",
    situation:
      "A client says: 'My friend's KP astrologer gave a different house-warming muhūrta than you did. One of you must be wrong, or muhūrta is arbitrary.' The practitioner replies: 'You're right, different astrologers give different answers; just pick whichever feels right to you.'",
    expectedStream: "not-applicable",
    expectedPrinciples: ["pancanga", "synergy-natal", "agentive-time", "discipline-distinction"],
    expectedIssue: "variance-misread",
    expectedVerdict: "non-compliant",
    explanation:
      "The practitioner abandoned the discipline's grounding. Cross-stream variance is technique-variance within shared foundational principles, not arbitrariness. The honest answer would distinguish shared principles from stream-specific techniques and attribute each recommendation to its source tradition.",
    response:
      "Articulate the five cross-stream-shared foundational principles, explain that Parāśarī and KP use different specific techniques, and advise operating consistently from one stream rather than mixing them.",
  },
  {
    id: 4,
    title: "Misattribution of KP as ancient",
    situation:
      "A practitioner advertises: 'My muhūrta method uses ancient Vedic sub-lord-theory from Bṛhat Parāśara Hora Śāstra to give precise windows.' The method is clearly KP sub-lord-theory.",
    expectedStream: "kp",
    expectedPrinciples: ["honest-attribution"],
    expectedIssue: "misattribution",
    expectedVerdict: "non-compliant",
    explanation:
      "Sub-lord-theory is K.S. Krishnamurti's 20th-century modern systematisation. Claiming it is 'ancient Vedic' and 'from BPHS' is cross-stream misattribution, violating the honest-attribution discipline that is universal across all variants.",
    response:
      "Correct the attribution: name the technique as KP-stream sub-lord-theory, cite the KP Readers, and remove the false BPHS/'ancient Vedic' claim.",
  },
  {
    id: 5,
    title: "Muhūrta evaluated without natal synergy",
    situation:
      "A practitioner selects a wedding muhūrta based solely on tithi, vāra, nakṣatra, and yoga quality, without examining the bride's or groom's natal chart or daśā periods.",
    expectedStream: "parashari",
    expectedPrinciples: ["synergy-natal", "agentive-time"],
    expectedIssue: "none",
    expectedVerdict: "needs-context",
    explanation:
      "The pañcāṅga evaluation is valid Parāśarī-tradition content, but the analysis is incomplete. The MC 16-vicinity principle requires the muhūrta-chart's fitness to be analysed in relation to the actor's natal lagna. For a wedding, synergy must hold for both actors. The verdict is 'needs-context' because the practitioner must add chart-correspondence analysis rather than discard the whole recommendation.",
    response:
      "Add the chart-correspondence layer: compare muhūrta lagna to each actor's natal lagna, check planetary engagement with natal sensitive-points, confirm favourable daśā periods, and verify tārā-bala for each actor.",
  },
  {
    id: 6,
    title: "Sva-dharma-aligned stream selection",
    situation:
      "A Tier-2-specialising practitioner reviews four inputs: 18 months of journal data show strongest calibration for Parāśarī-tradition muhūrta; svādhyāya with MC feels nourishing; the client-base primarily requests wedding and gṛha-praveśa muhūrtas; a local ICAS mentor runs a Parāśarī mentor-mode programme. They choose Parāśarī-tradition as primary specialisation and defer KP-stream engagement until working fluency is established.",
    expectedStream: "parashari",
    expectedPrinciples: ["honest-attribution"],
    expectedIssue: "none",
    expectedVerdict: "compliant",
    explanation:
      "All four sva-dharma inputs converge on Parāśarī-tradition. The practitioner honours Sequence Principle 3 by deferring secondary stream engagement until primary working-fluency is established. This is the discipline-compliant default path for most Tier-2 muhūrta-practitioners.",
    response:
      "Proceed with Parāśarī-tradition as the Tier-2 primary specialisation, sustain sequenced MC study, and revisit secondary stream engagement only after primary working-fluency is achieved.",
  },
];

export const WORKFLOW_STEPS = [
  {
    title: "Step 1 — Identify the operative stream-variant",
    text: "Name the specific tradition explicitly: Parāśarī, Tājika, KP, Jaimini, or Lal Kitab. Avoid vague 'Vedic' or 'ancient' claims.",
  },
  {
    title: "Step 2 — Verify shared foundational principles are honoured",
    text: "Check pañcāṅga use, synergy-with-natal-chart, agentive-time-selection, discipline-distinction from jātaka/praśna/gocara, and honest-attribution.",
  },
  {
    title: "Step 3 — Detect cross-stream-conflation",
    text: "If techniques from multiple streams are combined, confirm Tier-2 working-fluency exists in every stream involved. Otherwise, refuse the mixed recommendation.",
  },
  {
    title: "Step 4 — Detect misattribution",
    text: "Ensure each technique is cited to its actual source-tradition (e.g., KP is 20th-century; Lal Kitab is Punjabi tradition; not 'ancient Vedic' or Parāśarī).",
  },
  {
    title: "Step 5 — Apply sva-dharma stream-selection",
    text: "Use the four-input framework (journal-evidence, intellectual engagement, client-context, community-accessibility) to choose and commit to a primary stream for Tier-2 mastery.",
  },
  {
    title: "Step 6 — Communicate variance honestly",
    text: "When clients encounter differing stream-variant recommendations, explain shared principles vs specific techniques and advise consistent single-stream operation.",
  },
];

/* ───────────────────────── Visual Components Supporting Data ───────────────────────── */

export const NAKSHATRA_NAMES: string[] = [
  "Aśvinī", "Bharaṇī", "Kṛttikā", "Rohiṇī", "Mṛgaśīrṣa",
  "Ārdrā", "Punarvasu", "Puṣya", "Āśleṣā",
  "Maghā", "Pūrva Phalgunī", "Uttara Phalgunī", "Hasta", "Citrā",
  "Svātī", "Viśākhā", "Anurādhā", "Jyeṣṭhā",
  "Mūla", "Pūrva Aṣāḍhā", "Uttara Aṣāḍhā", "Śravaṇa", "Dhaniṣṭhā",
  "Śatabhiṣaj", "Pūrva Bhādrapadā", "Uttara Bhādrapadā", "Revatī"
];

export interface Tara {
  number: number;
  name: string;
  sanskrit: string;
  quality: "favourable" | "unfavourable" | "mixed";
  description: string;
}

export const TARAS: Tara[] = [
  { number: 1, name: "Janma",     sanskrit: "जन्म",     quality: "mixed",        description: "One's own birth star — mixed, proceed with caution" },
  { number: 2, name: "Sampat",    sanskrit: "सम्पत्",   quality: "favourable",   description: "Wealth-giving — favourable for gains and prosperity" },
  { number: 3, name: "Vipat",     sanskrit: "विपत्",    quality: "unfavourable", description: "Danger — avoid important beginnings" },
  { number: 4, name: "Kṣema",     sanskrit: "क्षेम",    quality: "favourable",   description: "Well-being — favourable for health and comfort" },
  { number: 5, name: "Pratyak",   sanskrit: "प्रत्यक्", quality: "unfavourable", description: "Obstructive — delays and obstacles likely" },
  { number: 6, name: "Sādhaka",   sanskrit: "साधक",     quality: "favourable",   description: "Accomplishing — favourable for achieving goals" },
  { number: 7, name: "Vadha",     sanskrit: "वध",       quality: "unfavourable", description: "Destructive — the worst tārā; avoid at all costs" },
  { number: 8, name: "Mitra",     sanskrit: "मित्र",    quality: "favourable",   description: "Friendly — supportive and harmonious" },
  { number: 9, name: "Ati-Mitra",  sanskrit: "अतिमित्र", quality: "favourable",   description: "Best friend — the most auspicious tārā" },
];

export function computeTara(janmaIndex: number, targetIndex: number): number {
  const count = ((targetIndex - janmaIndex + 27) % 27) + 1;
  const remainder = count % 9;
  return remainder === 0 ? 9 : remainder;
}

export interface LagnaSynergyResult {
  relationship: number; // 1-12
  quality: "favourable" | "unfavourable" | "mixed";
  description: string;
}

export function getLagnaSynergy(natalLagna: number, muhurtaLagna: number): LagnaSynergyResult {
  // natalLagna and muhurtaLagna are 1-indexed (1 to 12)
  const relationship = ((muhurtaLagna - natalLagna + 12) % 12) + 1;

  let quality: "favourable" | "unfavourable" | "mixed" = "mixed";
  let description = "";

  switch (relationship) {
    case 1:
      quality = "favourable";
      description = "Conjugate Lagna (1st-1st relationship). Identical signs promote strong alignment and path resonance.";
      break;
    case 2:
      quality = "mixed";
      description = "2nd house relationship. Favourable for financial initiation, but neutral/mixed for general activities.";
      break;
    case 3:
      quality = "mixed";
      description = "3rd house relationship (Upachaya). Promotes self-effort and initiative; yields success through sustained action.";
      break;
    case 4:
      quality = "favourable";
      description = "Kendra relationship (4th house). Highly supportive for foundations, domestic purchase, and stability.";
      break;
    case 5:
      quality = "favourable";
      description = "Trikona relationship (5th house). Promotes intelligence, creativity, and past-merit support. Highly auspicious.";
      break;
    case 6:
      quality = "unfavourable";
      description = "Dusthana relationship (6th house). Prone to conflicts, legal blockages, and health impediments. Avoid.";
      break;
    case 7:
      quality = "favourable";
      description = "Kendra relationship (7th house). Promotes dynamic balance, partnership resonance, and public initiatives.";
      break;
    case 8:
      quality = "unfavourable";
      description = "Dusthana relationship (8th house). Highly prone to hidden dangers, sudden obstructions, and delays. Strongly avoid.";
      break;
    case 9:
      quality = "favourable";
      description = "Trikona relationship (9th house). Promotes long-term fortune, wisdom, and blessings. Highly auspicious.";
      break;
    case 10:
      quality = "favourable";
      description = "Kendra relationship (10th house). Promotes high visibility, career endeavors, and success in action.";
      break;
    case 11:
      quality = "favourable";
      description = "Gains relationship (11th house). Highly auspicious for income-generating activities, network additions, and aspirations.";
      break;
    case 12:
      quality = "unfavourable";
      description = "Dusthana relationship (12th house). Represents expenditure, energy drain, and dissolution of effort. Avoid.";
      break;
  }

  return { relationship, quality, description };
}

export interface JyotishaDiscipline {
  key: string;
  name: string;
  sanskrit: string;
  question: string;
  focus: string;
  description: string;
}

export const JYOTISHA_DISCIPLINES: JyotishaDiscipline[] = [
  {
    key: "jataka",
    name: "Jātaka (Natal)",
    sanskrit: "जातक",
    question: "What is my default path?",
    focus: "Fixed birth moment",
    description: "Evaluates the planetary configuration at the exact birth-moment. Maps out lifelong karmic potentials, strengths, and Vimśottarī dasha progressions. It is entirely descriptive and non-electional.",
  },
  {
    key: "prasna",
    name: "Praśna (Horary)",
    sanskrit: "प्रश्न",
    question: "What is the answer to my question?",
    focus: "Reactive query moment",
    description: "Evaluates the chart cast for the precise moment and location where a sincere question is voiced. It is reactive, answering specific queries through the current sky's configuration.",
  },
  {
    key: "gocara",
    name: "Gocara (Transit)",
    sanskrit: "गोचर",
    question: "How do active transits affect me now?",
    focus: "Continuous planetary movement",
    description: "Tracks the active, ongoing positions of the planets in the sky relative to the static placements in the actor's natal chart, providing a dynamic overlay of ambient timing influence.",
  },
  {
    key: "muhurta",
    name: "Muhūrta (Electional)",
    sanskrit: "मुहूर्त",
    question: "When should I initiate this action?",
    focus: "Agentive forward selection",
    description: "Focuses on the deliberate selection of a future initiation window. The actor agentively chooses when to act to launch a new set of cycles, working in direct synergy with their birth chart.",
  },
];

export const RASHI_NAMES: string[] = [
  "Meṣa (Aries)", "Vṛṣabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
  "Siṁha (Leo)", "Kanyā (Virgo)", "Tulā (Libra)", "Vṛścika (Scorpio)",
  "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Mīna (Pisces)"
];

export function getStream(key: StreamKey): StreamVariant | undefined {
  return STREAM_VARIANTS.find((s) => s.key === key);
}

export function getSharedPrinciple(key: SharedPrincipleKey): SharedPrinciple | undefined {
  return SHARED_PRINCIPLES.find((p) => p.key === key);
}

export function streamLabel(key: StreamKey | "cross-stream-conflation" | "not-applicable"): string {
  switch (key) {
    case "parashari":
      return "Parāśarī-tradition";
    case "tajika":
      return "Tājika-stream";
    case "kp":
      return "KP-stream";
    case "jaimini":
      return "Jaimini-stream";
    case "lal-kitab":
      return "Lal Kitab";
    case "cross-stream-conflation":
      return "Cross-stream conflation";
    case "not-applicable":
      return "Not applicable / principle-level issue";
  }
}

export function streamColor(key: StreamKey | "cross-stream-conflation" | "not-applicable"): string {
  switch (key) {
    case "parashari":
      return "#356CAB";
    case "tajika":
      return "#2E7D7B";
    case "kp":
      return "#6B4C9A";
    case "jaimini":
      return "#B88421";
    case "lal-kitab":
      return "#A23A1E";
    case "cross-stream-conflation":
      return "#A23A1E";
    case "not-applicable":
      return "#6B7280";
  }
}

export function issueLabel(key: IssueKey): string {
  switch (key) {
    case "cross-stream-conflation":
      return "Cross-stream conflation";
    case "variance-misread":
      return "Variance misread as disagreement / arbitrariness";
    case "misattribution":
      return "Misattribution of stream-variant content";
    case "none":
      return "No issue";
  }
}

export function verdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case "compliant":
      return "Discipline-compliant";
    case "non-compliant":
      return "Non-compliant";
    case "needs-context":
      return "Valid so far — needs additional context";
  }
}

export function verdictColor(verdict: Verdict): string {
  switch (verdict) {
    case "compliant":
      return "#2F7D55";
    case "non-compliant":
      return "#A23A1E";
    case "needs-context":
      return "#B88421";
  }
}
