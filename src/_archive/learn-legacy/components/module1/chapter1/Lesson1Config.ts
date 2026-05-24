// ─── Static UI config (navigation scaffolding + assessments) ───
// These are NOT lesson content — they are page-layout and assessment config.
// Lesson prose comes from the API (lesson.bodyMarkdown).

import type { SidebarSection } from "@/components/learn/interactive/LessonSidebar";
import type { ParsedLessonBody } from "@/lib/lesson-parser";

export const SECTION_IDS = [
  "hero", "sec-overview", "sec-diagram",
  "sec-hook", "sec-prereqs", "sec-vedangas", "sec-why-eye",
  "sec-vs-vedanta", "sec-non-coverage", "sec-slokas", "sec-worked",
  "sec-mistakes", "sec-remember", "sec-knowledge",
  "sec-flashcards", "sec-summary", "sec-concepts",
  "sec-quiz", "sec-citations", "sec-next",
];

// Fallback labels when parsed data is not available (e.g., loading state)
const FALLBACK_LABELS: Record<string, string> = {
  hero: "Introduction",
  "sec-overview": "What You'll Learn",
  "sec-diagram": "Vedanga Wheel",
  "sec-hook": "Hook",
  "sec-prereqs": "What you should know first",
  "sec-vedangas": "The Veda and its limbs",
  "sec-why-eye": "Why Jyotisa is \"the eye\"",
  "sec-vs-vedanta": "Vedanga vs Vedanta — cl...",
  "sec-non-coverage": "What this lesson does NO...",
  "sec-slokas": "Sloka block (classical cita...",
  "sec-worked": "Worked examples",
  "sec-mistakes": "Common mistakes",
  "sec-remember": "Things to remember",
  "sec-knowledge": "Knowledge Check",
  "sec-flashcards": "Flashcards",
  "sec-summary": "90-Second Summary",
  "sec-concepts": "Key Concepts",
  "sec-quiz": "Practice Quiz",
  "sec-citations": "Citations",
  "sec-next": "Continue",
};

// Mapping from sidebar ID to where its label should come from
interface SidebarSource {
  id: string;
  type: string;
  group: string;
  // Static label override (always used if provided)
  staticLabel?: string;
  // Section number in markdown (e.g., 1 for §1 Hook)
  sectionNum?: number;
  // Subsection number in markdown (e.g., "4.1")
  subsectionNum?: string;
}

const SIDEBAR_SOURCES: SidebarSource[] = [
  { id: "hero", type: "overview", group: "Start", staticLabel: "Introduction" },
  { id: "sec-overview", type: "overview", group: "Start", sectionNum: 3 },
  { id: "sec-diagram", type: "concepts", group: "Start", staticLabel: "Vedanga Wheel" },
  { id: "sec-hook", type: "definition", group: "Learn", sectionNum: 1 },
  { id: "sec-prereqs", type: "overview", group: "Learn", sectionNum: 2 },
  { id: "sec-vedangas", type: "mechanics", group: "Learn", subsectionNum: "4.1" },
  { id: "sec-why-eye", type: "definition", group: "Learn", subsectionNum: "4.2" },
  { id: "sec-vs-vedanta", type: "etymology", group: "Learn", subsectionNum: "4.3" },
  { id: "sec-non-coverage", type: "overview", group: "Learn", subsectionNum: "4.4" },
  { id: "sec-slokas", type: "definition", group: "Learn", sectionNum: 5 },
  { id: "sec-worked", type: "mechanics", group: "Learn", sectionNum: 6 },
  { id: "sec-mistakes", type: "quiz", group: "Practice", sectionNum: 8 },
  { id: "sec-remember", type: "recap", group: "Practice", sectionNum: 9 },
  { id: "sec-knowledge", type: "quiz", group: "Practice", staticLabel: "Knowledge Check" },
  { id: "sec-flashcards", type: "flashcards", group: "Practice", staticLabel: "Flashcards" },
  { id: "sec-summary", type: "recap", group: "Finish", sectionNum: 11 },
  { id: "sec-concepts", type: "concepts", group: "Finish", staticLabel: "Key Concepts" },
  { id: "sec-quiz", type: "practice", group: "Finish", staticLabel: "Practice Quiz" },
  { id: "sec-citations", type: "overview", group: "Finish", sectionNum: 12 },
  { id: "sec-next", type: "continue", group: "Finish", staticLabel: "Continue" },
];

export function buildSidebarSections(parsed: ParsedLessonBody | null): SidebarSection[] {
  return SIDEBAR_SOURCES.map((source) => {
    let label = FALLBACK_LABELS[source.id] || source.id;

    if (source.staticLabel) {
      label = source.staticLabel;
    } else if (source.subsectionNum && parsed?.subsectionTitles[source.subsectionNum]) {
      label = parsed.subsectionTitles[source.subsectionNum];
    } else if (source.sectionNum && parsed?.sectionTitles[source.sectionNum]) {
      label = parsed.sectionTitles[source.sectionNum];
    }

    return {
      id: source.id,
      label,
      type: source.type,
      group: source.group,
    };
  });
}

// ─── Assessments (not present in bodyMarkdown) ──────────────────
export const FLASHCARDS = [
  { id: "f1", front: "What are the six Vedangas?", back: "Siksha (Phonetics) · Kalpa (Ritual) · Vyakarana (Grammar) · Nirukta (Etymology) · Chandas (Meter) · Jyotisa (Astronomy/Astrology)", category: "Core Framework" },
  { id: "f2", front: "What does 'Vedanga' literally mean?", back: "Veda + Anga = 'Limb of the Veda' — an auxiliary discipline supporting the Veda.", category: "Etymology" },
  { id: "f3", front: "Why is Jyotisa called the 'Eye' of the Veda?", back: "Because it determines the correct muhurta (timing) for rituals. It gives the Veda 'sight' into time. (vedasya caksuh)", category: "Core Concept" },
  { id: "f4", front: "Vedanga vs Vedanta?", back: "Vedanga = 'Limb of the Veda' (6 supporting disciplines) vs Vedanta = 'End of the Veda' (Upanishadic philosophy). Completely different!", category: "Common Confusion" },
  { id: "f5", front: "Which text establishes the Vedanga framework?", back: "Paniniya Siksha 41-42 lists all six Vedangas with body-part metaphors.", category: "Key Text" },
  { id: "f6", front: "What is kala-vidhana-sastra?", back: "\"The science of the determination of time\" — Lagadha's self-description of Jyotisa in the Vedanga Jyotisa opening verse.", category: "Key Text" },
];

export const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "How many Vedangas are there?", options: ["4", "5", "6", "8"], correctIndex: 2, explanation: "There are exactly 6 Vedangas — Siksha, Kalpa, Vyakarana, Nirukta, Chandas, and Jyotisa." },
  { id: "kc2", question: "Which Vedanga is called the 'Eye' (caksuh)?", options: ["Siksha", "Vyakarana", "Jyotisa", "Chandas"], correctIndex: 2, explanation: "Jyotisa is the Eye because it determines the correct timing for rituals — giving the Veda sight into time." },
  { id: "kc3", question: "Vedanga literally means:", options: ["End of the Veda", "Limb of the Veda", "Study of the Veda", "Light of the Veda"], correctIndex: 1, explanation: "Vedanga = Veda + Anga (limb). Supporting disciplines — NOT the Veda itself." },
  { id: "kc4", question: "Jyotisa's original function was:", options: ["Natal chart reading", "Time-keeping for Vedic ritual", "Weather prediction", "Philosophy"], correctIndex: 1, explanation: "Per Lagadha's Vedanga Jyotisa: Jyotisa = kala-vidhana-sastra — the science of time-determination for ritual." },
];
