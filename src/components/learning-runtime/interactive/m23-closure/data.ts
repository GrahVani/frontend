export type ChapterKey = "ch1" | "ch2" | "ch3" | "ch4" | "ch5" | "ch6";
export type CapabilityKey =
  | "fourPillar"
  | "eventSpecific"
  | "cancellation"
  | "honestHandling"
  | "m24Ethics";
export type OngoingPracticeKey =
  | "svadhyaya"
  | "community"
  | "journal"
  | "tier2";
export type HookStepKey =
  | "23.1.1"
  | "23.1.2"
  | "23.2.1"
  | "23.2.2"
  | "23.2.3"
  | "23.2.4"
  | "23.3.1"
  | "23.3.2"
  | "23.3.3"
  | "23.3.4"
  | "23.4.1"
  | "23.5.1"
  | "23.5.2"
  | "23.5.3"
  | "23.6.1"
  | "23.6.2"
  | "23.6.3";
export type MistakeKey =
  | "noOngoing"
  | "skipPending"
  | "isolatedHook";

export interface Chapter {
  key: ChapterKey;
  number: number;
  title: string;
  lessons: number;
  achievement: string;
  color: string;
}

export interface Capability {
  key: CapabilityKey;
  label: string;
  question: string;
  evidence: string;
}

export interface OngoingPractice {
  key: OngoingPracticeKey;
  label: string;
  devanagari: string;
  description: string;
  actionItems: string[];
}

export interface HookStep {
  key: HookStepKey;
  lesson: string;
  contribution: string;
}

export interface CommonMistake {
  key: MistakeKey;
  label: string;
  warning: string;
  remedy: string;
}

export const CHAPTERS: Chapter[] = [
  {
    key: "ch1",
    number: 1,
    title: "Origins & Pañcāṅga",
    lessons: 4,
    achievement: "Muhūrta-concept + pañcāṅga 5-limb foundation + classical-corpus + comparative-position.",
    color: "#2F6F9F",
  },
  {
    key: "ch2",
    number: 2,
    title: "Tithi-Vāra-Nakṣatra",
    lessons: 4,
    achievement: "First three pañcāṅga-limbs with sub-nakṣatra-pāda precision.",
    color: "#7A4A8A",
  },
  {
    key: "ch3",
    number: 3,
    title: "Yoga-Karaṇa-Lagna",
    lessons: 4,
    achievement: "Yoga + karaṇa cancellation-doṣas + chart-correspondence + integrated four-pillar capstone.",
    color: "#B9801E",
  },
  {
    key: "ch4",
    number: 4,
    title: "Event-Specific Muhūrtas",
    lessons: 4,
    achievement: "Wedding + business-launch + griha-praveśa + travel event-type-specific applications.",
    color: "#2F7D52",
  },
  {
    key: "ch5",
    number: 5,
    title: "Cancellations & Chowghadiya",
    lessons: 3,
    achievement: "Pañcaka + daily inauspicious-windows + Chowghadiya practical-heuristic three-step method.",
    color: "#A23A1E",
  },
  {
    key: "ch6",
    number: 6,
    title: "Honest Handling & Closure",
    lessons: 3,
    achievement: "Cumulative honest-handling (19+ instances) + stakes-calibration + this closure.",
    color: "#8A6424",
  },
];

export const CAPABILITIES: Capability[] = [
  {
    key: "fourPillar",
    label: "Integrated four-pillar capstone",
    question: "Can I apply pañcāṅga + candra-bala + tārā-bala + lagna-śuddhi per M23 Chapters 1–3?",
    evidence: "22-lesson cumulative-method completion across Chapters 1–3.",
  },
  {
    key: "eventSpecific",
    label: "Event-specific applications",
    question: "Can I apply wedding + business-launch + griha-praveśa + travel frameworks per Lesson 23.4.x?",
    evidence: "Chapter 4 four-lesson cumulative completion.",
  },
  {
    key: "cancellation",
    label: "Cancellation + sub-day filter",
    question: "Can I apply Pañcaka + Rāhu-Kāla/Yamaganda/Gulika-Kāla + Chowghadiya per Chapter 5?",
    evidence: "Chapter 5 three-step canonical operational method mastered.",
  },
  {
    key: "honestHandling",
    label: "Honest-handling + stakes-calibration",
    question: "Can I articulate honest recommendation + decline trivial engagement per Chapter 6?",
    evidence: "Chapter 6 three-lesson cumulative discipline completion.",
  },
  {
    key: "m24Ethics",
    label: "M24-ethics-integration",
    question: "Can I operationalise daivajña-qualifications (satya-vādī + dayā-yutaḥ + nirlobha + jñānin + śāstra-vit) cumulatively?",
    evidence: "M24 + M23 cumulative integration per Bṛhat Saṁhitā Adhyāya 2.",
  },
];

export const ONGOING_PRACTICES: OngoingPractice[] = [
  {
    key: "svadhyaya",
    label: "Svādhyāya",
    devanagari: "स्वाध्याय",
    description: "Continued engagement with MC + Bṛhat Saṁhitā + classical-corpus + modern systematic expositions.",
    actionItems: [
      "Read MC chapter-by-chapter (Sharma translation)",
      "Study Raman's Muhurtha",
      "Review Bhat's Bṛhat Saṁhitā Adhyāya 99",
      "Engage adjacent classical-corpus over ongoing years",
    ],
  },
  {
    key: "community",
    label: "Community-engagement",
    devanagari: "सहाध्यायी-परिष्कार",
    description: "Practitioner-community sahādhyāyī peer-review per cumulative honest-handling discipline.",
    actionItems: [
      "Monthly peer-review with 3–6 co-students",
      "Review recent muhūrta-recommendations together",
      "Apply honest-attribution + trade-off-honesty in peer discussion",
    ],
  },
  {
    key: "journal",
    label: "Self-chart-tracking",
    devanagari: "फल-अनुसंधान-दिनचर्या",
    description: "Hits-and-misses-journal across own muhūrta-recommendation outcomes.",
    actionItems: [
      "Record recommendation + predicted outcome",
      "Record actual outcome",
      "Review paired-entries monthly",
      "Use evidence for sva-dharma stream assessment",
    ],
  },
  {
    key: "tier2",
    label: "Tier-2 progression-pathway",
    devanagari: "स्व-धर्म-विशेषण-मार्ग",
    description: "Sva-dharma stream-specialisation decision per four-input framework.",
    actionItems: [
      "Assess journal-evidence",
      "Evaluate intellectual-engagement",
      "Consider client-context",
      "Review community-accessibility",
    ],
  },
];

export const HOOK_STEPS: HookStep[] = [
  { key: "23.1.1", lesson: "23.1.1", contribution: "Discipline-distinction: client-question identified as muhūrta-domain." },
  { key: "23.1.2", lesson: "23.1.2", contribution: "Pañcāṅga 5-limb framework + 6-candidate evaluation grid." },
  { key: "23.2.1", lesson: "23.2.1", contribution: "Tithi-classification → Pūrṇā tithis favourable; Riktā ruled-out." },
  { key: "23.2.2", lesson: "23.2.2", contribution: "Vāra-classification → Friday/Thursday optimal; Sunday acceptable." },
  { key: "23.2.3", lesson: "23.2.3", contribution: "Nakṣatra-classification → Sthira preferred; Rohiṇī ruled-out by Riktā integration." },
  { key: "23.2.4", lesson: "23.2.4", contribution: "Pāda-precision → Revatī Pāda 1 Sagittarius Navāṁśa favourable." },
  { key: "23.3.1", lesson: "23.3.1", contribution: "Yoga-classification → Vṛddhi favourable; cancellation-doṣa first-pass passed." },
  { key: "23.3.2", lesson: "23.3.2", contribution: "Karaṇa-classification → Vaṇija acceptable; 5-pañcāṅga-limb completion." },
  { key: "23.3.3", lesson: "23.3.3", contribution: "Lagna-śuddhi → Capricorn-lagna mismatch + Navāṁśa-trika challenges identified." },
  { key: "23.3.4", lesson: "23.3.4", contribution: "Integrated four-pillar capstone → mixed-pillar-aggregate; house-bala 7th Mars weakness." },
  { key: "23.4.1", lesson: "23.4.1", contribution: "Wedding-specific application → Jupiter-Venus strong; three-option family empowerment." },
  { key: "23.5.1", lesson: "23.5.1", contribution: "Pañcaka check → no overlap." },
  { key: "23.5.2", lesson: "23.5.2", contribution: "Daily inauspicious-window check → Gulika-Kāla overlap; shift 4 PM → 2 PM." },
  { key: "23.5.3", lesson: "23.5.3", contribution: "Chowghadiya check → Sunday 2 PM = Śubha; cumulative sub-day filter convergence." },
  { key: "23.6.1", lesson: "23.6.1", contribution: "Honest-handling → best-available recommendation; perfect-muhūrta-is-rare; family decides." },
  { key: "23.6.2", lesson: "23.6.2", contribution: "Stakes-calibration → high-stakes wedding warrants full integrated method." },
  { key: "23.6.3", lesson: "23.6.3", contribution: "Cumulative resolution → Nov 8 Sunday 2:00 PM recommended; family decides per empowerment." },
];

export const COMMON_MISTAKES: CommonMistake[] = [
  {
    key: "noOngoing",
    label: "Treating M23-completion as full mastery",
    warning: "Practitioner skips ongoing svādhyāya + community-engagement + self-chart-tracking per Lesson 24.4.x.",
    remedy: "Apply §4.6 ongoing-development discipline. M23 = Tier-1 foundation; Tier-2 progression + ongoing engagement warranted.",
  },
  {
    key: "skipPending",
    label: "Treating M23-completion as substitute for pending remediation",
    warning: "Practitioner treats temporal-discipline mastery alone as complete; skips M22 Vāstu spatial-discipline.",
    remedy: "Apply §4.5 Tier-1 curriculum-completion status. M23 + M24 = 2 of 24 modules complete; M22 is next per sequence.",
  },
  {
    key: "isolatedHook",
    label: "Failing to articulate §1 hook cumulative resolution",
    warning: "Practitioner treats §1 hook as isolated worked-example instead of operational demonstration across 22 lessons.",
    remedy: "Apply §4.4 cumulative resolution articulation. Progressive scenario-resolution demonstrates cumulative method end-to-end.",
  },
];

export const CURRICULUM_STATUS = {
  completed: ["M24", "M23"],
  pending: ["M22 Vāstu", "M21 Numerology", "M20 Nāḍī", "M19 Tājika", "M18 Lal Kitab", "M17 Jaimini", "M16 KP", "M04–M15 audit"],
  next: "M22 Vāstu",
  total: 24,
};

export function findChapter(key: ChapterKey): Chapter {
  return CHAPTERS.find((c) => c.key === key) ?? CHAPTERS[0];
}

export function findCapability(key: CapabilityKey): Capability {
  return CAPABILITIES.find((c) => c.key === key) ?? CAPABILITIES[0];
}

export function findPractice(key: OngoingPracticeKey): OngoingPractice {
  return ONGOING_PRACTICES.find((p) => p.key === key) ?? ONGOING_PRACTICES[0];
}
