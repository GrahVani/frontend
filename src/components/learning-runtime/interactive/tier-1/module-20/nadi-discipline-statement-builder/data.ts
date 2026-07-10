export type StatementFieldKey = "scope" | "disclosure" | "process" | "doharm" | "place";

export interface ChapterSynthesis {
  chapter: number;
  title: string;
  gives: string;
  practiceCue: string;
}

export interface StatementField {
  key: StatementFieldKey;
  label: string;
  prompt: string;
  sample: string;
}

export interface ConsultationTest {
  id: string;
  label: string;
  question: string;
  tests: StatementFieldKey[];
}

export const CHAPTER_SYNTHESIS: ChapterSynthesis[] = [
  {
    chapter: 1,
    title: "Origins & Traditions",
    gives: "The three-questions frame, two-layer holding, and separating practice from claims.",
    practiceCue: "Treat lineage records as heritage, but keep proof status unverified."
  },
  {
    chapter: 2,
    title: "Nāḍī Granthas",
    gives: "Bhṛgu, Agastya, Kaushika, and attested-but-rare texts.",
    practiceCue: "Refuse one-true-school authority claims within or across centers."
  },
  {
    chapter: 3,
    title: "Methodology",
    gives: "Yes/no narrowers, 12-kāṇḍa divisions, and the reader translation gap.",
    practiceCue: "Highlight the interpretive-fidelity gap; check cross-kāṇḍa coherence."
  },
  {
    chapter: 4,
    title: "Landscape & Scams",
    gives: "Due-diligence checkcards, trade commission loops, and cost screens.",
    practiceCue: "Expose steering commission networks; require direct bookings."
  },
  {
    chapter: 5,
    title: "Advisory Discipline",
    gives: "The five disclosures and the recommend/defer/refuse decision framework.",
    practiceCue: "Ground major life actions in calculative Jyotisha or real-world facts."
  }
];

export const DO_NO_HARM = [
  "No single-factor major life decisions.",
  "No fear-induction or threat of calamity.",
  "No exorbitant or compulsory remedy pricing.",
  "No claims of absolute predictive certainty.",
  "Supplementary placement: chart and practical reason lead."
];

export const STATEMENT_FIELDS: StatementField[] = [
  {
    key: "scope",
    label: "Scope",
    prompt: "State your consulting modes (contextual vs standalone advice) and what you will not do.",
    sample: "I limit my scope to supplementary Nāḍī advice; I never perform leaf matching or prescribe paid rituals myself."
  },
  {
    key: "disclosure",
    label: "Disclosures",
    prompt: "Commit to delivering all five disclosures (verification gap, quality, alternatives, scams, supplementary status).",
    sample: "I will deliver all five disclosures—including quality variance and alternative explanations—before any referral."
  },
  {
    key: "process",
    label: "Gating Process",
    prompt: "Explain how you will apply the recommend, defer, and refuse gates.",
    sample: "I apply the decision framework gates strictly, refusing advice if fear-induction or high upsell fees are present."
  },
  {
    key: "doharm",
    label: "Do-No-Harm",
    prompt: "Specify how you protect clients from single-factor choices and emotional exploitation.",
    sample: "I advise clients to ignore fatalistic predictions and require convergent real-world grounds for any major actions."
  },
  {
    key: "place",
    label: "Supplementary Place",
    prompt: "Place Nāḍī honestly compared to computed Jyotisha systems.",
    sample: "Nāḍī is a supplementary, located lookup stream, subordinate to calculated chart analysis and logical prudence."
  }
];

export const CONSULTATION_TESTS: ConsultationTest[] = [
  {
    id: "scam-remedy",
    label: "Exorbitant upsell",
    question: "Would your statement keep a client from paying 50,000 INR to clear ancestral curses?",
    tests: ["scope", "disclosure", "process"]
  },
  {
    id: "divorce-threat",
    label: "Marriage warning",
    question: "Would it prevent a client from breaking a marriage commitment based on a single leaf warning?",
    tests: ["disclosure", "doharm", "place"]
  },
  {
    id: "career-move",
    label: "Resigning job",
    question: "Would it guide a client to retain their office job despite a leaf prediction promising merchant wealth?",
    tests: ["process", "doharm", "place"]
  }
];

export const DEFAULT_STATEMENT: Record<StatementFieldKey, string> = {
  scope: STATEMENT_FIELDS[0].sample,
  disclosure: STATEMENT_FIELDS[1].sample,
  process: STATEMENT_FIELDS[2].sample,
  doharm: STATEMENT_FIELDS[3].sample,
  place: STATEMENT_FIELDS[4].sample
};
