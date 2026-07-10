/**
 * Engine for Lesson 23.2.2 — Vāra (Weekday) Lord Effects.
 *
 * Provides the seven weekday-lords, their planetary-character grounding,
 * event-type affinities, Tuesday/Saturday exception-contexts, and
 * scenario-based screener drills.
 */

export type VaraKey =
  | "ravi"
  | "soma"
  | "mangala"
  | "budha"
  | "guru"
  | "shukra"
  | "shani";

export type EventTypeKey =
  | "wedding"
  | "griha-pravesha"
  | "foundation-stone"
  | "legal-action"
  | "surgical-procedure"
  | "education-initiation"
  | "business-launch"
  | "communication-project"
  | "domestic-initiation"
  | "saturn-deity-observance";

export type IssueKey =
  | "single-limb-dominance"
  | "tuesday-saturday-over-application"
  | "tuesday-saturday-under-application"
  | "arbitrary-vara-effect"
  | "none";

export type Verdict = "favourable" | "avoid" | "exception-applies" | "needs-context";

export interface VaraDef {
  key: VaraKey;
  order: number;
  name: string;
  devanagari: string;
  english: string;
  planet: string;
  planetDevanagari: string;
  color: string;
  character: string;
  affinities: string[];
  generalStance: "favourable" | "avoid" | "mixed";
  exceptionContext?: string;
}

export interface EventType {
  key: EventTypeKey;
  label: string;
  favourableVaras: VaraKey[];
  avoidVaras: VaraKey[];
  exceptionVara?: VaraKey;
  explanation: string;
}

export interface Scenario {
  id: number;
  title: string;
  event: string;
  vara: VaraKey;
  situation: string;
  expectedIssue: IssueKey;
  expectedVerdict: Verdict;
  explanation: string;
  response: string;
}

export const VARAS: VaraDef[] = [
  {
    key: "ravi",
    order: 1,
    name: "Ravi-vāra",
    devanagari: "रवि-वार",
    english: "Sunday",
    planet: "Sun (Ravi / Sūrya)",
    planetDevanagari: "सूर्य",
    color: "#B88421",
    character: "Authority, government, leadership, sovereignty, ātma-related actions",
    affinities: ["Authority initiations", "Government-related actions", "Leadership-role acceptance", "Generally favourable for many event-types"],
    generalStance: "favourable",
  },
  {
    key: "soma",
    order: 2,
    name: "Soma-vāra",
    devanagari: "सोम-वार",
    english: "Monday",
    planet: "Moon (Soma / Candra)",
    planetDevanagari: "चन्द्र",
    color: "#356CAB",
    character: "Nurturing, domesticity, water-related, emotional-sensitivity, manas-related actions",
    affinities: ["Domestic initiations", "Nurturing-context actions", "Water-related ventures", "Family-context events"],
    generalStance: "favourable",
  },
  {
    key: "mangala",
    order: 3,
    name: "Maṅgala-vāra",
    devanagari: "मङ्गल-वार",
    english: "Tuesday",
    planet: "Mars (Maṅgala / Kuja)",
    planetDevanagari: "मङ्गल",
    color: "#A23A1E",
    character: "Initiative, contention, energy, decisive-action, parākrama, surgical-and-incisive action",
    affinities: ["Surgical procedures", "Legal-contest initiation", "Martial-or-decisive-action contexts", "Mars-deity observances"],
    generalStance: "avoid",
    exceptionContext:
      "Limited-application exceptions: surgical-procedures; legal-contest initiation; specific martial-or-decisive-action contexts; Mars-deity observances.",
  },
  {
    key: "budha",
    order: 4,
    name: "Budha-vāra",
    devanagari: "बुध-वार",
    english: "Wednesday",
    planet: "Mercury (Budha)",
    planetDevanagari: "बुध",
    color: "#2E7D7B",
    character: "Communication, learning, commerce, intellectual-activity, vāk and vidyā",
    affinities: ["Communication-initiations", "Education-related actions", "Commerce-and-trade-initiations", "Intellectual-or-scholarly initiations"],
    generalStance: "favourable",
  },
  {
    key: "guru",
    order: 5,
    name: "Guru-vāra",
    devanagari: "गुरु-वार",
    english: "Thursday",
    planet: "Jupiter (Guru / Bṛhaspati)",
    planetDevanagari: "गुरु",
    color: "#D4A017",
    character: "Wisdom, dharma, sacred-tradition, expansion, benediction, guru-tattva, śubha-grahaḥ",
    affinities: [
      "Wedding-muhūrta",
      "Gṛha-praveśa",
      "Dharma-related initiations",
      "Education-and-wisdom-related actions",
      "Launches and samskāra ceremonies",
    ],
    generalStance: "favourable",
  },
  {
    key: "shukra",
    order: 6,
    name: "Śukra-vāra",
    devanagari: "शुक्र-वार",
    english: "Friday",
    planet: "Venus (Śukra)",
    planetDevanagari: "शुक्र",
    color: "#C1549A",
    character: "Aesthetics, partnership, comfort, relationship-oriented-grace, kāma-tattva, bhoga, kalā",
    affinities: ["Wedding-muhūrta and relationship initiations", "Aesthetic-event initiations", "Comfort-and-luxury initiations", "Partnership-launches"],
    generalStance: "favourable",
  },
  {
    key: "shani",
    order: 7,
    name: "Śani-vāra",
    devanagari: "शनि-वार",
    english: "Saturday",
    planet: "Saturn (Śanaiścara / Śani)",
    planetDevanagari: "शनि",
    color: "#4A5568",
    character: "Discipline, structure, slow-process, long-duration-foundation, sthairya, karma-tattva, vairāgya",
    affinities: [
      "Foundational long-duration constructions",
      "Śani-deity / Hanumān observances",
      "Iron-installation",
      "Discipline-character vrata-initiations",
    ],
    generalStance: "avoid",
    exceptionContext:
      "Limited-application exceptions: foundational long-duration constructions; Śani-deity / Hanumān observances; iron-installation; discipline-character vrata-initiations.",
  },
];

export const EVENT_TYPES: EventType[] = [
  {
    key: "wedding",
    label: "Wedding-muhūrta",
    favourableVaras: ["shukra", "guru", "ravi", "soma", "budha"],
    avoidVaras: ["mangala", "shani"],
    explanation:
      "Friday (Venus) is classically marriage-optimal; Thursday (Jupiter) is universally-favourable; Sunday/Monday/Wednesday are acceptable. Tuesday and Saturday are avoided for weddings.",
  },
  {
    key: "griha-pravesha",
    label: "Gṛha-praveśa (house-warming)",
    favourableVaras: ["guru", "shukra", "soma", "budha", "ravi"],
    avoidVaras: ["mangala", "shani"],
    explanation:
      "Thursday (Jupiter) and Friday (Venus) are strongest for house-warming. Monday (Moon/domesticity) is also favourable. Tuesday and Saturday are avoided for the festive house-warming.",
  },
  {
    key: "foundation-stone",
    label: "Foundation-stone-laying",
    favourableVaras: ["guru", "shukra", "soma", "budha", "ravi"],
    avoidVaras: ["mangala"],
    exceptionVara: "shani",
    explanation:
      "Foundation-stone-laying generally favours Jupiter/Venus. Saturday (Saturn) is the specific exception-context for foundational long-duration constructions where Saturn's stability character matches.",
  },
  {
    key: "legal-action",
    label: "Legal-case filing / Competitive action",
    favourableVaras: ["mangala", "budha", "guru", "ravi"],
    avoidVaras: ["shani", "shukra", "soma"],
    explanation:
      "Tuesday (Mars) is favourable for legal-contest initiation as a limited-application exception. Mercury supports communication/contractual action; Jupiter adds dharmic grounding. Saturn, Venus, and Moon are less aligned.",
  },
  {
    key: "surgical-procedure",
    label: "Surgical procedure",
    favourableVaras: ["mangala"],
    avoidVaras: ["shani", "shukra", "soma"],
    exceptionVara: "mangala",
    explanation:
      "Tuesday (Mars) is the canonical exception-context for surgery — Mars's incisive-and-decisive character matches surgical action. Saturday is avoided for elective surgery. Medical-team judgment takes precedence.",
  },
  {
    key: "education-initiation",
    label: "Education initiation / Upanayana",
    favourableVaras: ["guru", "budha", "ravi"],
    avoidVaras: ["mangala", "shani"],
    explanation:
      "Thursday (Jupiter — wisdom/dharma) and Wednesday (Mercury — learning/communication) are optimal. Sunday is favourable. Tuesday and Saturday are avoided.",
  },
  {
    key: "business-launch",
    label: "Business-launch / Major venture",
    favourableVaras: ["guru", "budha", "shukra", "ravi"],
    avoidVaras: ["mangala", "shani"],
    explanation:
      "Thursday (Jupiter) for expansion/benediction; Wednesday (Mercury) for commerce/communication; Friday (Venus) for partnership/luxury; Sunday for authority. Tuesday and Saturday are avoided.",
  },
  {
    key: "communication-project",
    label: "Communication / Publication / Media launch",
    favourableVaras: ["budha", "guru", "shukra"],
    avoidVaras: ["mangala", "shani"],
    explanation:
      "Wednesday (Mercury) is optimal for communication, publication, and media. Jupiter and Venus support. Tuesday and Saturday are avoided.",
  },
  {
    key: "domestic-initiation",
    label: "Domestic / Nurturing initiation",
    favourableVaras: ["soma", "guru", "shukra"],
    avoidVaras: ["mangala", "shani"],
    explanation:
      "Monday (Moon) is optimal for domestic/nurturing events. Jupiter and Venus support. Tuesday and Saturday are avoided.",
  },
  {
    key: "saturn-deity-observance",
    label: "Śani / Hanumān deity observance",
    favourableVaras: ["shani"],
    avoidVaras: ["mangala"],
    exceptionVara: "shani",
    explanation:
      "Saturday (Saturn) is the specific exception-context for Śani-deity or Hanumān-related observances. This is event-type-specific; Saturday is still avoided for most auspicious-initiations.",
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Wedding-muhūrta on Saturday",
    event: "Wedding-muhūrta",
    vara: "shani",
    situation:
      "A family asks for a wedding-muhūrta on Saturday because the venue is cheaper and more available. They argue that Saturn's discipline-character will help the marriage last.",
    expectedIssue: "tuesday-saturday-under-application",
    expectedVerdict: "avoid",
    explanation:
      "Saturday (Śani-vāra) is classically avoided for wedding-muhūrta. Saturn's discipline-character does not override the general avoidance for marriage. The exception-contexts (foundational construction, Śani-deity observance) do not apply.",
    response:
      "Explain that Saturday is classically avoided for wedding-muhūrta. Offer Thursday or Friday as optimal, or Sunday/Monday/Wednesday as acceptable alternatives. Do not invoke Saturn-character to justify a Saturday wedding.",
  },
  {
    id: 2,
    title: "Hip-replacement surgery on Tuesday",
    event: "Surgical procedure",
    vara: "mangala",
    situation:
      "An orthopaedic team offers Tuesday, Thursday, and Saturday for a hip-replacement. The client asks which vāra is most favourable from a muhūrta perspective.",
    expectedIssue: "tuesday-saturday-over-application",
    expectedVerdict: "exception-applies",
    explanation:
      "Tuesday (Maṅgala-vāra) is generally avoided for auspicious-initiations, but surgical-procedure is the canonical exception-context — Mars's incisive-decisive character matches surgical action. Saturday is avoided for elective surgery.",
    response:
      "Recommend Tuesday as the optimal vāra-component for this surgical procedure, with Thursday as an acceptable alternative. Avoid Saturday. Note that medical-team judgment takes precedence over muhūrta-input.",
  },
  {
    id: 3,
    title: "Business-launch on Thursday but ignored other limbs",
    event: "Business-launch",
    vara: "guru",
    situation:
      "A practitioner recommends a business-launch on Thursday solely because it is Guru-vāra, without checking tithi, nakṣatra, yoga, karaṇa, or chart-correspondence.",
    expectedIssue: "single-limb-dominance",
    expectedVerdict: "needs-context",
    explanation:
      "Thursday is genuinely favourable for business-launch, but vāra alone is insufficient. The practitioner must integrate with the other four pañcāṅga-limbs and chart-correspondence before recommending.",
    response:
      "Add tithi-classification, nakṣatra, yoga, karaṇa, and chart-correspondence analysis. Thursday is a strong vāra-component, not a sufficient condition.",
  },
  {
    id: 4,
    title: "Refusing Tuesday foundation-stone-laying absolutely",
    event: "Foundation-stone-laying",
    vara: "mangala",
    situation:
      "A practitioner refuses to recommend any Tuesday foundation-stone-laying, even when the event is a small, decisive construction start where Mars-character might be operative.",
    expectedIssue: "tuesday-saturday-over-application",
    expectedVerdict: "avoid",
    explanation:
      "Tuesday is generally avoided for foundation-stone-laying. The Saturday exception is the classical one for foundational long-duration constructions; Tuesday does not have a foundation-stone exception. The refusal is discipline-compliant, though the practitioner should distinguish Tuesday from Saturday's exception-context.",
    response:
      "For foundation-stone-laying, Tuesday is avoided; Saturday is the exception-context for long-duration foundational constructions. Recommend Thursday or Friday for the stone-laying itself, and use Saturday only if the event specifically invokes Saturn-character.",
  },
  {
    id: 5,
    title: "Explaining Thursday favourability without planetary grounding",
    event: "Wedding-muhūrta",
    vara: "guru",
    situation:
      "A client asks why Thursday is universally favourable. The practitioner replies, 'Because Thursday is just auspicious — that's the tradition.'",
    expectedIssue: "arbitrary-vara-effect",
    expectedVerdict: "needs-context",
    explanation:
      "The practitioner failed to articulate the planetary-character grounding. Thursday is favourable because Jupiter (Guru) is the śubha-grahaḥ with wisdom-dharma-expansion character. 'Because tradition says so' is arbitrary and does not empower the client.",
    response:
      "Articulate the planetary-character grounding: Jupiter's wisdom, dharma, expansion, and benediction character matches the character of auspicious initiations. This makes the recommendation explainable rather than rote.",
  },
  {
    id: 6,
    title: "Education initiation on Thursday",
    event: "Education initiation / Upanayana",
    vara: "guru",
    situation:
      "A family schedules a vidyā-ārambha on Thursday and evaluates the tithi (Pūrṇā) and nakṣatra favourably before finalising the muhūrta.",
    expectedIssue: "none",
    expectedVerdict: "favourable",
    explanation:
      "Thursday (Jupiter) is optimal for education-initiation. The family also checked tithi and nakṣatra, avoiding single-limb dominance. This is discipline-compliant.",
    response:
      "Proceed with the integrated assessment. Thursday's Jupiter-character strongly supports education-initiation; the additional limb-checks confirm the integrated quality.",
  },
];

export const INTEGRATION_STEPS = [
  {
    title: "Step 1 — Identify the event-type",
    text: "Wedding, gṛha-praveśa, foundation-stone, legal/competitive, surgical, education, business, communication, domestic, or deity-observance.",
  },
  {
    title: "Step 2 — Apply vāra-lord-effects",
    text: "Check the weekday's planetary-character and event-type affinity. Note Thursday's universal favourability, Friday's marriage-optimality, and Tuesday/Saturday avoidance.",
  },
  {
    title: "Step 3 — Check Tuesday/Saturday exception-contexts",
    text: "Tuesday is favourable for surgical-procedure and legal-contest; Saturday for foundational long-duration constructions and Śani/Hanumān observances. Exceptions are event-type-specific.",
  },
  {
    title: "Step 4 — Articulate the planetary-character grounding",
    text: "Explain the vāra-effect through the underlying planetary character (BPHS Chapter 3) rather than rote rule.",
  },
  {
    title: "Step 5 — Integrate with tithi-classification",
    text: "Combine vāra-component with the tithi-component (Lesson 23.2.1). Favourable vāra + favourable tithi strengthens the candidate; favourable vāra + weak tithi weakens it.",
  },
  {
    title: "Step 6 — Integrate with remaining limbs and chart-correspondence",
    text: "Add nakṣatra, yoga, karaṇa (M23 Chapter 3) and synergy-with-natal-chart analysis (M23 Chapter 3) before final recommendation.",
  },
];

export function getVara(key: VaraKey): VaraDef | undefined {
  return VARAS.find((v) => v.key === key);
}

export function getEventType(key: EventTypeKey): EventType | undefined {
  return EVENT_TYPES.find((e) => e.key === key);
}

export function varaLabel(key: VaraKey): string {
  return getVara(key)?.name ?? key;
}

export function issueLabel(key: IssueKey): string {
  switch (key) {
    case "single-limb-dominance":
      return "Single-limb dominance";
    case "tuesday-saturday-over-application":
      return "Tuesday/Saturday over-application";
    case "tuesday-saturday-under-application":
      return "Tuesday/Saturday under-application";
    case "arbitrary-vara-effect":
      return "Arbitrary vāra-effect explanation";
    case "none":
      return "No issue";
  }
}

export function verdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case "favourable":
      return "Favourable";
    case "avoid":
      return "Avoid";
    case "exception-applies":
      return "Exception applies — favourable for this event-type";
    case "needs-context":
      return "Valid vāra-component — needs integrated context";
  }
}

export function verdictColor(verdict: Verdict): string {
  switch (verdict) {
    case "favourable":
      return "#2F7D55";
    case "avoid":
      return "#A23A1E";
    case "exception-applies":
      return "#2E7D7B";
    case "needs-context":
      return "#B88421";
  }
}

export const ISSUE_OPTIONS: IssueKey[] = [
  "none",
  "single-limb-dominance",
  "tuesday-saturday-over-application",
  "tuesday-saturday-under-application",
  "arbitrary-vara-effect",
];
