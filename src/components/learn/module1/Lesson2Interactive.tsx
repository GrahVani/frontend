"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight,
  BookOpen, Layers, Sparkles, BrainCircuit, Target,
  Lightbulb, Play, Sun, Moon, Orbit,
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

interface Lesson2InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-composition", "sec-karakatwas", "sec-dignity", "sec-knowledge", "sec-concepts", "sec-flashcards", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "What is a Graha?", type: "definition", group: "Learn" },
  { id: "sec-composition", label: "The 9 Grahas", type: "mechanics", group: "Learn" },
  { id: "sec-karakatwas", label: "Karakatwas", type: "mechanics", group: "Learn" },
  { id: "sec-dignity", label: "Planetary States", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-flashcards", label: "Flashcards", type: "flashcards", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const FLASHCARDS = [
  { id: "f1", front: "What does 'Graha' literally mean in Sanskrit?", back: "'That which seizes' or 'to grasp' — a Graha captures a specific type of cosmic energy and projects it onto human experience.", category: "Core Definition" },
  { id: "f2", front: "How many Grahas are in the Vedic system?", back: "9 Grahas (Navagraha): 7 physical bodies (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) + 2 shadow planets (Rahu, Ketu).", category: "Structure" },
  { id: "f3", front: "What are 'Karakatwas'?", back: "Significations — the specific 'data payload' each Graha carries. E.g., Sun = soul, ego, authority; Moon = mind, emotions, mother.", category: "Mechanics" },
  { id: "f4", front: "What is the difference between Exaltation and Debilitation?", back: "Exaltation (Ucha) = peak 100% efficiency (e.g., Sun in Aries). Debilitation (Neecha) = lowest efficiency, the planet struggles (e.g., Sun in Libra).", category: "Dignity" },
  { id: "f5", front: "Why are Rahu & Ketu included despite not being physical planets?", back: "They are the mathematical intersection points where the Moon's orbit crosses the ecliptic. Eclipses happen exactly at these nodes, making them points of energy disruption.", category: "Logic" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "What does the Sanskrit word 'Graha' literally mean?", options: ["Star", "Planet", "That which seizes", "Light"], correctIndex: 2, explanation: "'Graha' comes from the root 'grah' meaning 'to seize/grasp.' A Graha captures cosmic energy and projects it onto life — it's not just a 'planet' in the Western sense." },
  { id: "kc2", question: "How many physical celestial bodies are in the Navagraha system?", options: ["9", "7", "12", "5"], correctIndex: 1, explanation: "There are 7 physical bodies (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) and 2 mathematical shadow points (Rahu, Ketu), totaling 9 Grahas." },
  { id: "kc3", question: "When a planet is 'Exalted' (Ucha), what does it mean?", options: ["It's invisible", "It's at 100% operational efficiency", "It's retrograde", "It's combust"], correctIndex: 1, explanation: "Exaltation is the sign where a Graha performs at its absolute peak — 100% operational efficiency. E.g., Sun exalted in Aries, Moon in Taurus." },
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
export default function Lesson2Interactive({ lesson, lessonProgress }: Lesson2InteractiveProps) {
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
          <div className="flex-1 min-w-0 pr-4 sm:pr-6 lg:pr-8">

            {/* ─── HERO ─── */}
            <section id="hero" className="mb-6 scroll-mt-32">
              <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Learning Path
              </Link>

              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <GraduationCap className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
                  <span className="text-xs text-amber-300">·</span>
                  <span className="text-xs font-medium text-amber-400">Module 1: Foundations</span>
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

                <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-3">{lesson.title}</h1>

                <div className="flex items-center gap-4 flex-wrap">
                  <ReadingTime text={allText} />
                  <span className="text-amber-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                    <Layers className="w-3.5 h-3.5" /> {content.sections?.length || 0} Sections
                  </span>
                  <span className="text-amber-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                    <Lightbulb className="w-3.5 h-3.5" /> {content.concepts.length} Concepts
                  </span>
                  <span className="text-amber-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                    <BrainCircuit className="w-3.5 h-3.5" /> {content.quiz.length} Questions
                  </span>
                </div>

                {/* Progress bar */}
                {hasSections && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden max-w-[250px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${sectionProgress}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-xs text-amber-600 font-medium">{completedSections.size}/{content.sections?.length} viewed</span>
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
                    <Sun className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <div className="text-lg font-bold">9</div>
                    <div className="text-[10px] text-amber-600">Navagraha</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <Orbit className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold">7</div>
                    <div className="text-[10px] text-amber-600">Physical Bodies</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <Moon className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold">2</div>
                    <div className="text-[10px] text-amber-600">Shadow Planets</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <Target className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold">4</div>
                    <div className="text-[10px] text-amber-600">Dignity States</div>
                  </div>
                </div>

                {lessonProgress && lessonProgress.bestScore > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 flex-wrap">
                    <span className="text-xs text-amber-600">Previous attempt:</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      Best: {lessonProgress.bestScore}%
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {lessonProgress.attemptsCount} attempt{lessonProgress.attemptsCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </motion.div>

              <CalloutBlock variant="important" className="mt-5">
                The Grahas are the <strong>active variables</strong> in every astrological computation.
                If the Rashis are the fixed hardware of the sky, the Grahas are the <strong>dynamic software</strong> running the code.
                Every chart interpretation starts with understanding what each planet signifies.
              </CalloutBlock>
            </section>

            {/* ─── SECTION 1: DEFINITION — What is a Graha? ─── */}
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
                  Think of Grahas as <strong>cosmic actors on a stage</strong>. The Rashis (signs) are the scenery,
                  the Bhavas (houses) are the departments of life — but the Grahas are the <strong>actors performing the drama</strong>.
                  Their significations determine <em>what</em> they do; their placement determines <em>where</em>.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 2: COMPOSITION — The 9 Grahas ─── */}
            {content.sections?.[1] && (
              <section id="sec-composition" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![1].id)} className="relative">
                    <LessonSection section={content.sections![1]} index={1} />
                    {completedSections.has(`sec-s${content.sections![1].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="mistake" className="mt-4">
                  <strong>Don&apos;t confuse Vedic Grahas with Western planets!</strong> Vedic astrology does <em>not</em> use
                  Uranus, Neptune, or Pluto. The system is Earth-centric and observational — only what&apos;s visible from Earth
                  + the mathematically computed lunar nodes (Rahu &amp; Ketu) are used.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 3: KARAKATWAS — Significations ─── */}
            {content.sections?.[2] && (
              <section id="sec-karakatwas" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![2].id)} className="relative">
                    <LessonSection section={content.sections![2]} index={2} />
                    {completedSections.has(`sec-s${content.sections![2].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="tip" className="mt-4">
                  <strong>Memory trick for planet hierarchy:</strong> Think of a royal court —
                  Sun is King, Moon is Queen, Mars is Commander, Mercury is Prince, Jupiter is Teacher,
                  Venus is Counselor, Saturn is the Judge. Rahu is the Rebel, Ketu is the Monk.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 4: DIGNITY — Planetary States ─── */}
            {content.sections?.[3] && (
              <section id="sec-dignity" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![3].id)} className="relative">
                    <LessonSection section={content.sections![3]} index={3} />
                    {completedSections.has(`sec-s${content.sections![3].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="wisdom" className="mt-4">
                  Think of dignity as a <strong>performance rating</strong> —
                  Exaltation is an employee in their dream job (peak output), Own Sign is working from home (comfortable),
                  and Debilitation is like working in a hostile environment (minimal output).
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
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-amber-900">Key Concepts</h2>
                  <span className="ml-auto text-sm text-amber-500 font-medium">{content.concepts.length} concepts</span>
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
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-amber-900">Review Flashcards</h2>
                  <span className="ml-auto text-sm text-amber-500 font-medium">{FLASHCARDS.length} cards</span>
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
                  <BrainCircuit className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-amber-900">Test Your Knowledge</h2>
                  <span className="ml-auto text-sm text-amber-500 font-medium">{content.quiz.length} questions</span>
                </div>
                {isLocked ? (
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
                    <Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Lesson Locked</h3>
                    <p className="text-gray-500 mb-4">Complete the previous lessons to unlock this one.</p>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors">
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
                      <p className="text-xl font-bold text-gray-900">Continue to The 12 Bhavas</p>
                      <p className="text-sm text-gray-500 mt-1">Next: Learn about the 12 houses and how they map life domains.</p>
                    </div>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-purple-600/20 shrink-0"
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
