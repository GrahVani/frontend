"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight,
  BookOpen, Layers, Sparkles, BrainCircuit, Target,
  Lightbulb, Play, Moon, Orbit, LayoutGrid, Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Lesson, type LessonProgressData } from "@/lib/api";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useReadingProgress } from "@/hooks/useReadingProgress";

import ScrollProgress from "@/components/learn/interactive/ScrollProgress";
import LessonSidebar, { type SidebarSection } from "@/components/learn/interactive/LessonSidebar";
import CalloutBlock from "@/components/learn/interactive/CalloutBlock";
import ReadingTime from "@/components/learn/interactive/ReadingTime";
import Flashcard from "@/components/learn/interactive/Flashcard";
import KnowledgeCheck from "@/components/learn/interactive/KnowledgeCheck";
import RecapSection from "@/components/learn/interactive/RecapSection";
import LessonSection, { type Section } from "@/components/learn/LessonSection";
import ConceptCard from "@/components/learn/ConceptCard";
import InteractiveQuiz from "@/components/learn/InteractiveQuiz";
import DynamicDiagram from "@/components/learn/DynamicDiagram";

// ─── Types ────────────────────────────────────────────────────
interface ConceptMedia { type: string; diagramType?: string; caption?: string; }
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string; media?: ConceptMedia;
}
type QuizQuestion =
  | { questionId: number; type: "multiple_choice"; question: string; options: Record<string, string>; correctAnswer: string; explanation: string; whyWrong?: Record<string, string>; conceptRef?: number; memoryAid?: string; hint?: string; difficulty?: string }
  | { questionId: number; type: "true_false"; question: string; correctAnswer: "true" | "false"; explanation: string; conceptRef?: number; memoryAid?: string; hint?: string; difficulty?: string }
  | { questionId: number; type: "matching"; question: string; pairs: { left: string; right: string }[]; conceptRef?: number; memoryAid?: string; difficulty?: string }
  | { questionId: number; type: "fill_blank"; question: string; correctAnswer: string; acceptableAnswers?: string[]; explanation: string; conceptRef?: number; memoryAid?: string; hint?: string; difficulty?: string }
  | { questionId: number; type: "case_study"; question: string; scenario: string; subQuestions: { questionId: number; question: string; options: Record<string, string>; correctAnswer: string; explanation: string; whyWrong?: Record<string, string> }[]; conceptRef?: number; memoryAid?: string; difficulty?: string };

interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: QuizQuestion[]; }

interface Lesson4InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-logic", "sec-architecture", "sec-payload", "sec-knowledge", "sec-concepts", "sec-flashcards", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "What is a Nakshatra?", type: "definition", group: "Learn" },
  { id: "sec-logic", label: "Why Nakshatras?", type: "mechanics", group: "Learn" },
  { id: "sec-architecture", label: "The Matrix", type: "mechanics", group: "Learn" },
  { id: "sec-payload", label: "Data Payload", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-flashcards", label: "Flashcards", type: "flashcards", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const FLASHCARDS = [
  { id: "f1", front: "What does 'Nakshatra' mean in Sanskrit?", back: "'That which does not decay' or a 'map of stars.' In English, they are called the Lunar Mansions — 27 segments of the Moon's path.", category: "Core Definition" },
  { id: "f2", front: "What is the exact span of each Nakshatra?", back: "13°20' (13 degrees and 20 minutes). 360° ÷ 27 = 13°20'. The Moon spends approximately one day in each Nakshatra.", category: "Mechanics" },
  { id: "f3", front: "What is the 2.25 Rule?", back: "2.25 Nakshatras fit into one 30° Rashi. For example, Aries contains all of Ashwini, all of Bharani, and the first quarter of Krittika.", category: "Architecture" },
  { id: "f4", front: "How many Padas are in the zodiac, and why does it matter?", back: "108 Padas (27 Nakshatras × 4 quarters). These 108 micro-sectors are the exact mathematical foundation of the Navamsha (D-9) chart.", category: "Architecture" },
  { id: "f5", front: "Name the 9 Nakshatra rulers in order", back: "Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury. This exact loop powers the Vimshottari Dasha timing system.", category: "Timing Engine" },
  { id: "f6", front: "What 5 data layers does every Nakshatra carry?", back: "1) Planetary Lord 2) Deity 3) Symbol 4) Purushartha (Motivation) 5) Activity Type (Create/Maintain/Dissolve).", category: "Data Payload" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "How many Nakshatras divide the 360° zodiac?", options: ["12", "27", "36", "108"], correctIndex: 1, explanation: "The zodiac is divided into exactly 27 Nakshatras, each spanning 13°20'. This is the lunar matrix underlying the 12 solar Rashis." },
  { id: "kc2", question: "What is the span of one Pada (quarter) of a Nakshatra?", options: ["30°", "13°20'", "3°20'", "1°"], correctIndex: 2, explanation: "Each Nakshatra (13°20') is divided into 4 equal Padas. 13°20' ÷ 4 = 3°20' per Pada. 27 × 4 = 108 Padas total." },
  { id: "kc3", question: "Which planetary sequence rules the 27 Nakshatras?", options: ["Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu", "Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury", "Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Rahu, Ketu", "Rahu, Ketu, Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn"], correctIndex: 1, explanation: "The strict 9-planet sequence is: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury. This repeating loop is the algorithm behind the Vimshottari Dasha system." },
];

// ─── Helpers ──────────────────────────────────────────────────
const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as const }, transition: { duration: 0.5 } };

/** Parse markdown bold/italic into HTML */
function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong>$1</strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function getAllText(content: LessonContent): string {
  const parts = [content.intro];
  content.sections?.forEach((s) => parts.push(s.content));
  content.concepts.forEach((c) => parts.push(c.description));
  return parts.join(" ");
}

// ─── Component ────────────────────────────────────────────────
export default function Lesson4Interactive({ lesson, lessonProgress }: Lesson4InteractiveProps) {
  const { user } = useAuth();
  const content = lesson.contentJson as unknown as LessonContent;
  const allText = useMemo(() => getAllText(content), [content]);
  const progress = useReadingProgress();
  const activeSection = useScrollSpy({ sectionIds: SECTION_IDS });
  const [completedSections, setCompletedSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (lessonProgress?.sectionsViewed) {
      lessonProgress.sectionsViewed.forEach((id) => initial.add(`sec-s${id}`));
    }
    return initial;
  });

  const markSectionComplete = useCallback((sectionId: number) => {
    setCompletedSections((prev) => {
      const next = new Set(prev);
      next.add(`sec-s${sectionId}`);
      if (user) {
        learnApi.trackSectionView(lesson.id, user.id, sectionId).catch(console.error);
      }
      return next;
    });
  }, [lesson.id, user]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const isLocked = lessonProgress?.status === "locked";
  const isCompleted = lessonProgress?.status === "completed";
  const hasSections = content.sections && content.sections.length > 0;
  const sectionProgress = hasSections
    ? Math.round((completedSections.size / content.sections!.length) * 100)
    : 0;

  const recapItems = content.concepts.map((c) => ({
    id: c.id, title: c.title,
    summary: (c.keyTakeaway && c.keyTakeaway !== c.title)
      ? c.keyTakeaway
      : c.description.replace(/\*+/g, '').slice(0, 120) + "...",
  }));

  return (
    <>
      <ScrollProgress />

      <div className="mx-auto pb-20">
        <div className="flex gap-8">
          {/* Sidebar */}
          <LessonSidebar
            sections={SIDEBAR_SECTIONS}
            activeSection={activeSection}
            completedSections={completedSections}
            onNavigate={scrollTo}
            progress={Math.max(progress, sectionProgress)}
            className="w-64 shrink-0 sticky top-4 self-start h-fit"
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0 ">

            {/* ─── HERO ─── */}
            <section id="hero" className="mb-6 scroll-mt-32">
              <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Learning Path
              </Link>

              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
                  <span className="text-xs text-blue-300">·</span>
                  <span className="text-xs font-medium text-blue-400">Module 1: Foundations</span>
                  {isCompleted && (
                    <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  )}
                  {isLocked && (
                    <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-3">{lesson.title}</h1>

                <div className="flex items-center gap-4 flex-wrap">
                  <ReadingTime text={allText} />
                  <span className="text-blue-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                    <Layers className="w-3.5 h-3.5" /> {content.sections?.length || 0} Sections
                  </span>
                  <span className="text-blue-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                    <Lightbulb className="w-3.5 h-3.5" /> {content.concepts.length} Concepts
                  </span>
                  <span className="text-blue-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                    <BrainCircuit className="w-3.5 h-3.5" /> {content.quiz.length} Questions
                  </span>
                </div>

                {/* Progress bar */}
                {hasSections && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden max-w-[250px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${sectionProgress}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-xs text-blue-600 font-medium">{completedSections.size}/{content.sections?.length} viewed</span>
                  </div>
                )}
              </motion.div>
            </section>

            {/* ─── KEY TAKEAWAYS OVERVIEW ─── */}
            <section id="sec-overview" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Introduction</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6" dangerouslySetInnerHTML={{ __html: formatMarkdown(content.intro) }} />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <Moon className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">27</div>
                    <div className="text-[10px] text-gray-500">Nakshatras</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <Target className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">13°20'</div>
                    <div className="text-[10px] text-gray-500">Each Span</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <LayoutGrid className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">108</div>
                    <div className="text-[10px] text-gray-500">Padas (Quarters)</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <Orbit className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">9</div>
                    <div className="text-[10px] text-gray-500">Ruling Grahas</div>
                  </div>
                </div>

                {lessonProgress && lessonProgress.bestScore > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4 flex-wrap">
                    <span className="text-xs text-gray-500">Previous attempt:</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                      Best: {lessonProgress.bestScore}%
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                      {lessonProgress.attemptsCount} attempt{lessonProgress.attemptsCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </motion.div>

              <CalloutBlock variant="important" className="mt-5">
                This lesson covers the <strong>lunar matrix</strong> — the microscopic source code of Vedic Astrology.
                If the 12 Rashis are the macro-environment and the 9 Grahas are the active variables,
                the 27 Nakshatras provide the <strong>high-definition resolution</strong> that makes precise prediction possible.
                Master this, and you unlock the timing engine of the Dasha system.
              </CalloutBlock>
            </section>

            {/* ─── SECTION 1: DEFINITION — What is a Nakshatra? ─── */}
            {content.sections?.[0] && (
              <section id="sec-definition" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![0].id)} className="relative">
                    <LessonSection section={content.sections![0]} index={0} />
                    {completedSections.has(`sec-s${content.sections![0].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="wisdom" className="mt-4">
                  Think of the zodiac as a <strong>photograph</strong>.
                  The 12 Rashis give you the broad landscape — mountains, rivers, forests.
                  The 27 Nakshatras provide the <strong>pixel-level detail</strong> — every leaf, every grain of sand.
                  A planet in Aries behaves one way; a planet in Ashwini Nakshatra (within Aries) behaves with a very specific, refined personality.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 2: LOGIC — Why do we need Nakshatras? ─── */}
            {content.sections?.[1] && (
              <section id="sec-logic" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![1].id)} className="relative">
                    <LessonSection section={content.sections![1]} index={1} />
                    {completedSections.has(`sec-s${content.sections![1].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="mistake" className="mt-4">
                  <strong>Don't dismiss Nakshatras as 'optional advanced material!'</strong>
                  In Vedic astrology, the Moon's Nakshatra at birth is <em>the</em> primary key that unlocks the Vimshottari Dasha system.
                  Without it, you cannot calculate the timing of life events. It is foundational, not advanced.
                </CalloutBlock>
                <CalloutBlock variant="tip" className="mt-3">
                  <strong>Memory trick:</strong> The Sun takes ~30 days per sign (solar month).
                  The Moon takes ~27.3 days to orbit Earth (sidereal month).
                  Therefore, the Moon spends roughly <strong>one day in each Nakshatra</strong>.
                  This is why Vedic astrology is fundamentally a <em>lunar</em> science.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 3: ARCHITECTURE — The Matrix ─── */}
            {content.sections?.[2] && (
              <section id="sec-architecture" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![2].id)} className="relative">
                    <LessonSection section={content.sections![2]} index={2} />
                    {completedSections.has(`sec-s${content.sections![2].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="tip" className="mt-4">
                  <strong>The 2.25 Rule in plain English:</strong> Since 27 Nakshatras must fit into 12 Rashis,
                  they don't line up cleanly at the edges. Each sign contains 2 full Nakshatras + the first quarter of a 3rd.
                  This is why Krittika starts in Aries but <em>finishes</em> in Taurus — it spills over.
                </CalloutBlock>
                <CalloutBlock variant="wisdom" className="mt-3">
                  <strong>Why 108 Padas matter:</strong> 27 × 4 = 108.
                  The number 108 is sacred across Dharmic traditions — 108 beads on a mala, 108 Upanishads.
                  In astrology, these 108 Padas are the exact mathematical foundation of the <strong>Navamsha (D-9) chart</strong>,
                  which reveals the inner soul-quality of a person's destiny.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 4: PAYLOAD — Data Variables ─── */}
            {content.sections?.[3] && (
              <section id="sec-payload" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![3].id)} className="relative">
                    <LessonSection section={content.sections![3]} index={3} />
                    {completedSections.has(`sec-s${content.sections![3].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="tip" className="mt-4">
                  <strong>Reading a Nakshatra like a pro:</strong> When you see a planet in a Nakshatra,
                  read it like a sentence: <em>"[Planet] acting like [Deity], driven by [Motivation], behaving through [Symbol]."</em>
                  Example: Moon in Ashwini = Mind acting like a celestial physician, driven by Dharma, symbolized by a horse's head.
                  Fast, healing, initiatory energy.
                </CalloutBlock>
              </section>
            )}

            {/* ─── KNOWLEDGE CHECK ─── */}
            <section id="sec-knowledge" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp}>
                <KnowledgeCheck
                  questions={KNOWLEDGE_CHECKS}
                  title="Check Your Understanding"
                />
              </motion.div>
            </section>

            {/* ─── CONCEPTS ─── */}
            <section id="sec-concepts" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-blue-900">Key Concepts</h2>
                  <span className="ml-auto text-sm text-blue-500 font-medium">{content.concepts.length} concepts</span>
                </div>
                <div className="space-y-4">
                  {content.concepts.map((concept, idx) => (
                    <motion.div
                      key={concept.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                    >
                      <ConceptCard concept={concept} index={idx} showDiagram={false} showReference />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* ─── FLASHCARDS ─── */}
            <section id="sec-flashcards" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-blue-900">Review Flashcards</h2>
                  <span className="ml-auto text-sm text-blue-500 font-medium">{FLASHCARDS.length} cards</span>
                </div>
                <Flashcard cards={FLASHCARDS} />
              </motion.div>
            </section>

            {/* ─── RECAP ─── */}
            <section id="sec-recap" className="mb-6 scroll-mt-32">
              <RecapSection items={recapItems} title="What You Learned in This Lesson" />
            </section>

            {/* ─── QUIZ ─── */}
            <section id="sec-quiz" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-blue-900">Test Your Knowledge</h2>
                  <span className="ml-auto text-sm text-blue-500 font-medium">{content.quiz.length} questions</span>
                </div>
                {isLocked ? (
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
                    <Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Lesson Locked</h3>
                    <p className="text-gray-500 mb-4">Complete the previous lessons to unlock this one.</p>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                      <Play className="w-4 h-4" /> Go to Learning Path
                    </Link>
                  </div>
                ) : (
                  <InteractiveQuiz quiz={content.quiz} concepts={content.concepts} lessonId={lesson.id} />
                )}
              </motion.div>
            </section>

            {/* ─── NEXT LESSON CTA ─── */}
            <section id="sec-next" className="scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-amber-200/60 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-amber-600 mb-1 font-medium">🎉 Module 1 Foundations Complete!</p>
                      <p className="text-xl font-bold text-gray-900">Continue to Module 2</p>
                      <p className="text-sm text-gray-500 mt-1">Next: Dive deeper into chart construction and planetary combinations.</p>
                    </div>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-blue-600/20 shrink-0"
                    >
                      Continue Learning
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
