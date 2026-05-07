"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight,
  BookOpen, Layers, Sparkles, BrainCircuit, Target,
  Lightbulb, Play, Eye, Crosshair, Orbit, View,
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

interface Lesson7InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-etymology", "sec-rules", "sec-software", "sec-knowledge", "sec-concepts", "sec-flashcards", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview" },
  { id: "sec-overview", label: "Overview", type: "overview" },
  { id: "sec-definition", label: "What is Drishti?", type: "definition" },
  { id: "sec-etymology", label: "Etymology", type: "etymology" },
  { id: "sec-rules", label: "Aspect Rules", type: "mechanics" },
  { id: "sec-software", label: "Software Logic", type: "mechanics" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts" },
  { id: "sec-flashcards", label: "Flashcards", type: "recap" },
  { id: "sec-recap", label: "Recap", type: "recap" },
  { id: "sec-quiz", label: "Practice Quiz", type: "quiz" },
  { id: "sec-next", label: "Continue", type: "overview" },
];

const FLASHCARDS = [
  { id: "f1", front: "What does 'Drishti' literally mean?", back: "'Sight,' 'vision,' 'glance,' or 'to look.' A planet's Drishti is its geometric line of sight projected onto other houses and planets.", category: "Core Definition" },
  { id: "f2", front: "What is the Universal Rule of Drishti?", back: "ALL planets aspect the 7th house from their own position (exactly 180° away). This is the baseline rule every Graha follows.", category: "Universal Rule" },
  { id: "f3", front: "Which houses does Mars aspect?", back: "Mars aspects the 4th, 7th, and 8th houses from itself. It protects its base and strikes blind spots.", category: "Special Rules" },
  { id: "f4", front: "Which houses does Jupiter aspect?", back: "Jupiter aspects the 5th, 7th, and 9th houses from itself. It expands and blesses everything in a trine of harmony.", category: "Special Rules" },
  { id: "f5", front: "Which houses does Saturn aspect?", back: "Saturn aspects the 3rd, 7th, and 10th houses from itself. It looks where effort is required and duty must be fulfilled.", category: "Special Rules" },
  { id: "f6", front: "Does Ketu cast any aspects?", back: "No. Ketu traditionally has no head, and therefore is 'blind' — it casts no Drishti. Rahu mimics Jupiter's aspects (5th, 7th, 9th).", category: "Shadow Planets" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "Which house does EVERY planet aspect by default?", options: ["The 1st house", "The 7th house from itself", "The 10th house", "The 12th house"], correctIndex: 1, explanation: "The Universal Rule: All planets aspect the 7th house from their own position (180° away). This is the baseline for every Graha." },
  { id: "kc2", question: "Jupiter aspects which houses from itself?", options: ["3rd, 7th, 10th", "4th, 7th, 8th", "5th, 7th, 9th", "Only the 7th"], correctIndex: 2, explanation: "Jupiter (The Teacher) expands and blesses in a trine of harmony. It aspects the 5th, 7th, and 9th houses from itself." },
  { id: "kc3", question: "If Saturn is in House 2, which houses does it aspect?", options: ["House 4, 7, 10", "House 3, 7, 10 counted from House 2 = Houses 4, 8, 11", "House 5, 7, 9", "Only House 8"], correctIndex: 1, explanation: "Saturn aspects 3rd, 7th, and 10th from itself. Counting inclusively from House 2: 2→3→4 (3rd aspect), 2→3→4→5→6→7→8 (7th aspect), 2→3→4→5→6→7→8→9→10→11 (10th aspect). Result: Houses 4, 8, and 11." },
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
export default function Lesson7Interactive({ lesson, lessonProgress }: Lesson7InteractiveProps) {
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
            className="w-64 shrink-0"
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0 pr-4 sm:pr-6 lg:pr-8">

            {/* ─── HERO ─── */}
            <section id="hero" className="mb-10 scroll-mt-32">
              <Link href="/learn" className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-800 text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Learning Path
              </Link>

              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <GraduationCap className="w-5 h-5 text-violet-500" />
                  <span className="text-xs font-bold text-violet-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
                  <span className="text-xs text-violet-300">·</span>
                  <span className="text-xs font-medium text-violet-400">Module 2: Mathematical Mechanics</span>
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

                <h1 className="text-3xl sm:text-4xl font-bold text-violet-900 mb-3">{lesson.title}</h1>

                <div className="flex items-center gap-4 flex-wrap">
                  <ReadingTime text={allText} />
                  <span className="text-violet-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600">
                    <Layers className="w-3.5 h-3.5" /> {content.sections?.length || 0} Sections
                  </span>
                  <span className="text-violet-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600">
                    <Lightbulb className="w-3.5 h-3.5" /> {content.concepts.length} Concepts
                  </span>
                  <span className="text-violet-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600">
                    <BrainCircuit className="w-3.5 h-3.5" /> {content.quiz.length} Questions
                  </span>
                </div>

                {hasSections && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-violet-100 rounded-full overflow-hidden max-w-[250px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${sectionProgress}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-xs text-violet-600 font-medium">{completedSections.size}/{content.sections?.length} viewed</span>
                  </div>
                )}
              </motion.div>
            </section>

            {/* ─── OVERVIEW ─── */}
            <section id="sec-overview" className="mb-10 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-violet-300" />
                  <span className="text-sm font-semibold text-violet-300 uppercase tracking-wide">Introduction</span>
                </div>
                <p className="text-violet-100 leading-relaxed text-lg mb-6" dangerouslySetInnerHTML={{ __html: formatMarkdown(content.intro) }} />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                    <Eye className="w-5 h-5 text-violet-300 mx-auto mb-1" />
                    <div className="text-lg font-bold">7th</div>
                    <div className="text-[10px] text-violet-300">Universal Aspect</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                    <Crosshair className="w-5 h-5 text-violet-300 mx-auto mb-1" />
                    <div className="text-lg font-bold">3</div>
                    <div className="text-[10px] text-violet-300">Mars Aspects</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                    <Orbit className="w-5 h-5 text-violet-300 mx-auto mb-1" />
                    <div className="text-lg font-bold">3</div>
                    <div className="text-[10px] text-violet-300">Jupiter Aspects</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                    <View className="w-5 h-5 text-violet-300 mx-auto mb-1" />
                    <div className="text-lg font-bold">3</div>
                    <div className="text-[10px] text-violet-300">Saturn Aspects</div>
                  </div>
                </div>

                {lessonProgress && lessonProgress.bestScore > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 flex-wrap">
                    <span className="text-xs text-violet-300">Previous attempt:</span>
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
                This lesson builds the <strong>geometry of influence</strong>.
                Up until now, we assumed planets only affect the house they occupy.
                Drishti reveals that every planet is a <em>dynamic transmitter</em> —
                a lightbulb whose beam hits multiple walls across the room.
                Without this, your software cannot compute real chart interactions.
              </CalloutBlock>
            </section>

            {/* ─── SECTION 1: DEFINITION ─── */}
            {content.sections?.[0] && (
              <section id="sec-definition" className="mb-10 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![0].id)} className="relative">
                    <LessonSection section={content.sections![0]} index={0} />
                    {completedSections.has(`sec-s${content.sections![0].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="wisdom" className="mt-4">
                  Think of Drishti as <strong>the Wi-Fi signal of a planet</strong>.
                  The house it sits in is the router's physical location — but the Wi-Fi signal reaches multiple rooms.
                  Some routers (Jupiter) have a wide, benevolent signal.
                  Others (Saturn) have a focused, demanding signal.
                  The quality of the signal depends on which planet is transmitting.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 2: ETYMOLOGY ─── */}
            {content.sections?.[1] && (
              <section id="sec-etymology" className="mb-10 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![1].id)} className="relative">
                    <LessonSection section={content.sections![1]} index={1} />
                    {completedSections.has(`sec-s${content.sections![1].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
              </section>
            )}

            {/* ─── SECTION 3: RULES ─── */}
            {content.sections?.[2] && (
              <section id="sec-rules" className="mb-10 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![2].id)} className="relative">
                    <LessonSection section={content.sections![2]} index={2} />
                    {completedSections.has(`sec-s${content.sections![2].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="mistake" className="mt-4">
                  <strong>Don't forget inclusive counting!</strong> When calculating aspects, House 1 is always counted as "1."
                  If Jupiter is in House 2 and aspects the 5th from itself, you count inclusively: 2→3→4→5→6.
                  The target is House 6, not House 7. This is the #1 coding error in aspect calculators.
                </CalloutBlock>
                <CalloutBlock variant="tip" className="mt-3">
                  <strong>Mnemonic for special aspects:</strong>
                  <br />• <strong>Mars</strong> (Commander) → 4, 7, 8 — "Protects base, strikes flanks"
                  <br />• <strong>Jupiter</strong> (Teacher) → 5, 7, 9 — "Blesses the trine"
                  <br />• <strong>Saturn</strong> (Judge) → 3, 7, 10 — "Demands effort everywhere"
                  <br />• <strong>Rahu</strong> (Rebel) → 5, 7, 9 — Mimics Jupiter's geometry
                  <br />• <strong>Ketu</strong> (Monk) → No aspects — "Headless, therefore blind"
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 4: SOFTWARE LOGIC ─── */}
            {content.sections?.[3] && (
              <section id="sec-software" className="mb-10 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![3].id)} className="relative">
                    <LessonSection section={content.sections![3]} index={3} />
                    {completedSections.has(`sec-s${content.sections![3].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="wisdom" className="mt-4">
                  Think of aspect calculation as <strong>building a social network graph</strong>.
                  Each planet is a node. Each aspect is a directed edge.
                  The strength of the connection depends on:
                  (1) The planet's dignity, (2) The house it aspects, and (3) Whether the aspect is friendly or hostile.
                  A complete chart reading is simply reading this network's influence map.
                </CalloutBlock>
              </section>
            )}

            {/* ─── KNOWLEDGE CHECK ─── */}
            <section id="sec-knowledge" className="mb-10 scroll-mt-32">
              <motion.div {...fadeUp}>
                <KnowledgeCheck questions={KNOWLEDGE_CHECKS} title="Check Your Understanding" />
              </motion.div>
            </section>

            {/* ─── CONCEPTS ─── */}
            <section id="sec-concepts" className="mb-10 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-bold text-violet-900">Key Concepts</h2>
                  <span className="ml-auto text-sm text-violet-500 font-medium">{content.concepts.length} concepts</span>
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
            <section id="sec-flashcards" className="mb-10 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-bold text-violet-900">Review Flashcards</h2>
                  <span className="ml-auto text-sm text-violet-500 font-medium">{FLASHCARDS.length} cards</span>
                </div>
                <Flashcard cards={FLASHCARDS} />
              </motion.div>
            </section>

            {/* ─── RECAP ─── */}
            <section id="sec-recap" className="mb-10 scroll-mt-32">
              <RecapSection items={recapItems} title="What You Learned in This Lesson" />
            </section>

            {/* ─── QUIZ ─── */}
            <section id="sec-quiz" className="mb-10 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-bold text-violet-900">Test Your Knowledge</h2>
                  <span className="ml-auto text-sm text-violet-500 font-medium">{content.quiz.length} questions</span>
                </div>
                {isLocked ? (
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
                    <Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Lesson Locked</h3>
                    <p className="text-gray-500 mb-4">Complete the previous lessons to unlock this one.</p>
                    <Link href="/learn" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors">
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
                <div className="p-6 sm:p-8 bg-gradient-to-r from-violet-50 via-white to-purple-50 rounded-2xl border-2 border-violet-200/60 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-violet-600 mb-1 font-medium">🎉 Module 2 Complete!</p>
                      <p className="text-xl font-bold text-violet-900">Continue to Module 3</p>
                      <p className="text-sm text-violet-600 mt-1">Next: Synthesis & Pattern Recognition — Yogas, Avasthas, and the Recursive House Matrix.</p>
                    </div>
                    <Link href="/learn" className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-violet-600/20 shrink-0">
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
