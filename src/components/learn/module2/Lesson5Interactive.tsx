"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight,
  BookOpen, Layers, Sparkles, BrainCircuit, Target,
  Lightbulb, Play, Compass, RotateCcw, Ruler, Zap,
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

interface Lesson5InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-etymology", "sec-mechanics", "sec-computation", "sec-knowledge", "sec-concepts", "sec-flashcards", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "What is Ayanamsa?", type: "definition", group: "Learn" },
  { id: "sec-etymology", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-mechanics", label: "The Drift", type: "mechanics", group: "Learn" },
  { id: "sec-computation", label: "Computation", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-flashcards", label: "Flashcards", type: "flashcards", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const FLASHCARDS = [
  { id: "f1", front: "What is the Ayanamsa?", back: "The longitudinal difference (exact angular gap) between the Tropical Zodiac (moving) and the Sidereal Zodiac (fixed). It is the mathematical value of the drift.", category: "Core Definition" },
  { id: "f2", front: "What does 'Ayanamsa' literally mean?", back: "Ayana = movement/course. Amsa = portion/degree. Therefore: 'portion of movement' or 'degree of drift.'", category: "Etymology" },
  { id: "f3", front: "What causes the Ayanamsa drift?", back: "The Precession of the Equinoxes. Earth wobbles on its axis like a spinning top, causing the Vernal Equinox to slowly move backward against the fixed stars at ~50.3 arc-seconds per year.", category: "Astronomy" },
  { id: "f4", front: "What is the formula for Vedic planetary longitude?", back: "Vedic Longitude = Tropical Longitude - Current Ayanamsa. Because the current Ayanamsa is ~24°, all planets shift backward by roughly 24 degrees.", category: "Computation" },
  { id: "f5", front: "Name 3 common Ayanamsa systems", back: "1) Lahiri Ayanamsa (Indian government standard) 2) Raman Ayanamsa 3) KP (Krishnamurti Paddhati) Ayanamsa. They differ by a few minutes or degrees.", category: "Variations" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "What does the Ayanamsa measure?", options: ["The distance between Earth and Sun", "The angular gap between Tropical and Sidereal zodiacs", "The Moon's orbital inclination", "The speed of light"], correctIndex: 1, explanation: "The Ayanamsa is the exact longitudinal difference between the moving Tropical zodiac (season-based) and the fixed Sidereal zodiac (star-based)." },
  { id: "kc2", question: "At what rate does the Vernal Equinox drift backward?", options: ["1 degree per year", "50.3 arc-seconds per year", "30 degrees per century", "It does not drift"], correctIndex: 1, explanation: "The Precession of the Equinoxes causes a backward drift of approximately 50.3 arc-seconds per year — about 1 degree every 72 years." },
  { id: "kc3", question: "Which Ayanamsa is the official standard adopted by the Indian government?", options: ["Raman Ayanamsa", "KP Ayanamsa", "Lahiri Ayanamsa", "Chitrapaksha Ayanamsa"], correctIndex: 2, explanation: "The Lahiri Ayanamsa is the official standard. KP Ayanamsa is used in Krishnamurti Paddhati, and Raman is another classical variation." },
];

// ─── Helpers ──────────────────────────────────────────────────
const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as const }, transition: { duration: 0.5 } };

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
export default function Lesson5Interactive({ lesson, lessonProgress }: Lesson5InteractiveProps) {
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
              <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Learning Path
              </Link>

              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <GraduationCap className="w-5 h-5 text-rose-500" />
                  <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
                  <span className="text-xs text-rose-300">·</span>
                  <span className="text-xs font-medium text-rose-400">Module 2: Mathematical Mechanics</span>
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

                <h1 className="text-3xl sm:text-4xl font-bold text-rose-900 mb-3">{lesson.title}</h1>

                <div className="flex items-center gap-4 flex-wrap">
                  <ReadingTime text={allText} />
                  <span className="text-rose-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                    <Layers className="w-3.5 h-3.5" /> {content.sections?.length || 0} Sections
                  </span>
                  <span className="text-rose-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                    <Lightbulb className="w-3.5 h-3.5" /> {content.concepts.length} Concepts
                  </span>
                  <span className="text-rose-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                    <BrainCircuit className="w-3.5 h-3.5" /> {content.quiz.length} Questions
                  </span>
                </div>

                {hasSections && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-rose-100 rounded-full overflow-hidden max-w-[250px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${sectionProgress}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-xs text-rose-600 font-medium">{completedSections.size}/{content.sections?.length} viewed</span>
                  </div>
                )}
              </motion.div>
            </section>

            {/* ─── OVERVIEW ─── */}
            <section id="sec-overview" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Introduction</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6" dangerouslySetInnerHTML={{ __html: formatMarkdown(content.intro) }} />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <Compass className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">~24°</div>
                    <div className="text-[10px] text-amber-600">Current Drift</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">50.3"</div>
                    <div className="text-[10px] text-amber-600">Per Year</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <Ruler className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">1°</div>
                    <div className="text-[10px] text-amber-600">Every 72 Years</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">285 AD</div>
                    <div className="text-[10px] text-amber-600">Zero Point</div>
                  </div>
                </div>

                {lessonProgress && lessonProgress.bestScore > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 flex-wrap">
                    <span className="text-xs text-amber-600">Previous attempt:</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-200 border border-purple-400/30">
                      Best: {lessonProgress.bestScore}%
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                      {lessonProgress.attemptsCount} attempt{lessonProgress.attemptsCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </motion.div>

              <CalloutBlock variant="important" className="mt-5">
                This lesson is the <strong>absolute core calculation engine</strong> of your software.
                If the Ayanamsa is wrong, the entire chart is wrong.
                Every planetary position, every house cusp, and every predictive technique depends on this single subtraction.
              </CalloutBlock>
            </section>

            {/* ─── SECTION 1: DEFINITION ─── */}
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
                  Think of the Ayanamsa as <strong>GPS calibration</strong>.
                  If your map app uses the wrong datum, every address it gives you is slightly off.
                  The Tropical zodiac is one map datum; the Sidereal zodiac is another.
                  The Ayanamsa is the exact transformation formula between them.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 2: ETYMOLOGY ─── */}
            {content.sections?.[1] && (
              <section id="sec-etymology" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![1].id)} className="relative">
                    <LessonSection section={content.sections![1]} index={1} />
                    {completedSections.has(`sec-s${content.sections![1].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="tip" className="mt-4">
                  <strong>Memory trick:</strong> Sayana = "With drift" (Western/Tropical).
                  Nirayana = "Without drift" (Vedic/Sidereal).
                  Your software is building a <strong>Nirayana engine</strong> — it strips away the drift to reveal the true stellar positions.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 3: MECHANICS — The Drift ─── */}
            {content.sections?.[2] && (
              <section id="sec-mechanics" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![2].id)} className="relative">
                    <LessonSection section={content.sections![2]} index={2} />
                    {completedSections.has(`sec-s${content.sections![2].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="mistake" className="mt-4">
                  <strong>Common misconception:</strong> The drift is NOT caused by the stars moving.
                  The stars are fixed. The drift is caused by <em>Earth's axial wobble</em> — the same wobble that makes a spinning top slowly rotate its axis.
                  This wobble changes which star the North Pole points toward over ~26,000 years.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 4: COMPUTATION ─── */}
            {content.sections?.[3] && (
              <section id="sec-computation" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![3].id)} className="relative">
                    <LessonSection section={content.sections![3]} index={3} />
                    {completedSections.has(`sec-s${content.sections![3].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="tip" className="mt-4">
                  <strong>Pro tip for software builders:</strong> Always store the raw Tropical ephemeris data AND the applied Ayanamsa value separately in your database.
                  This allows users to toggle between Ayanamsa systems (Lahiri, Raman, KP) and see how a few minutes of arc change the entire chart interpretation.
                </CalloutBlock>
                <CalloutBlock variant="wisdom" className="mt-3">
                  Think of the Ayanamsa subtraction as <strong>converting currencies</strong>.
                  Tropical coordinates are US Dollars; Sidereal coordinates are Euros.
                  The Ayanamsa is the exchange rate. You cannot compare prices without converting first.
                </CalloutBlock>
              </section>
            )}

            {/* ─── KNOWLEDGE CHECK ─── */}
            <section id="sec-knowledge" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp}>
                <KnowledgeCheck questions={KNOWLEDGE_CHECKS} title="Check Your Understanding" />
              </motion.div>
            </section>

            {/* ─── CONCEPTS ─── */}
            <section id="sec-concepts" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-rose-600" />
                  <h2 className="text-xl font-bold text-rose-900">Key Concepts</h2>
                  <span className="ml-auto text-sm text-rose-500 font-medium">{content.concepts.length} concepts</span>
                </div>
                <div className="space-y-4">
                  {content.concepts.map((concept, idx) => (
                    <motion.div key={concept.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.08 }}>
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
                  <Lightbulb className="w-5 h-5 text-rose-600" />
                  <h2 className="text-xl font-bold text-rose-900">Review Flashcards</h2>
                  <span className="ml-auto text-sm text-rose-500 font-medium">{FLASHCARDS.length} cards</span>
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
                  <BrainCircuit className="w-5 h-5 text-rose-600" />
                  <h2 className="text-xl font-bold text-rose-900">Test Your Knowledge</h2>
                  <span className="ml-auto text-sm text-rose-500 font-medium">{content.quiz.length} questions</span>
                </div>
                {isLocked ? (
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
                    <Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Lesson Locked</h3>
                    <p className="text-gray-500 mb-4">Complete the previous lessons to unlock this one.</p>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors">
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
                      <p className="text-sm text-amber-600 mb-1 font-medium">🎉 Lesson Complete!</p>
                      <p className="text-xl font-bold text-gray-900">Continue to The Panchang Engine</p>
                      <p className="text-sm text-gray-500 mt-1">Next: Build the temporal calculation engine that measures the quality of time.</p>
                    </div>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-rose-600/20 shrink-0">
                      Continue Learning <ChevronRight className="w-4 h-4" />
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
