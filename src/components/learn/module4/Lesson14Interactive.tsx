"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight,
  BookOpen, Layers, Sparkles, BrainCircuit, Target,
  Lightbulb, Play, Star, Zap, Flame, Crosshair,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Lesson, type LessonProgressData } from "@/lib/api";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useReadingProgress } from "@/hooks/useReadingProgress";

import ScrollProgress from "@/components/learn/interactive/ScrollProgress";
import LessonSidebar, { type SidebarSection } from "@/components/learn/interactive/LessonSidebar";
import CalloutBlock from "@/components/learn/interactive/CalloutBlock";
import Flashcard from "@/components/learn/interactive/Flashcard";
import KnowledgeCheck from "@/components/learn/interactive/KnowledgeCheck";
import RecapSection from "@/components/learn/interactive/RecapSection";
import LessonSection, { type Section } from "@/components/learn/LessonSection";
import ConceptCard from "@/components/learn/ConceptCard";
import InteractiveQuiz from "@/components/learn/InteractiveQuiz";
import DoubleTransitExplorer from "@/components/learn/module4/DoubleTransitExplorer";

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

interface Lesson14InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-etymology", "sec-mechanics", "sec-software", "sec-knowledge", "sec-concepts", "sec-flashcards", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Double Transit Theory", type: "definition", group: "Learn" },
  { id: "sec-etymology", label: "Why 'Double'?", type: "etymology", group: "Learn" },
  { id: "sec-mechanics", label: "The Algorithm", type: "mechanics", group: "Learn" },
  { id: "sec-software", label: "Software Logic", type: "software_logic", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-flashcards", label: "Flashcards", type: "flashcards", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const FLASHCARDS = [
  { id: "f1", front: "What is the Double Transit Theory?", back: "A major life event only manifests when BOTH transiting Jupiter and transiting Saturn simultaneously influence the same natal house or its lord via placement or aspect (Drishti).", category: "Core Definition" },
  { id: "f2", front: "Why is it called 'Double' Transit?", back: "It relies exclusively on the two slowest, heaviest planets: Jupiter (the Blessing) and Saturn (the Karma). Both must turn their 'keys' for an event to execute.", category: "Etymology" },
  { id: "f3", front: "What does Jupiter represent in the Double Transit?", back: "Jupiter represents Jiva (life force), opportunity, grace, and expansion. Jupiter says: 'You have the blessing to receive this.'", category: "Jupiter" },
  { id: "f4", front: "What does Saturn represent in the Double Transit?", back: "Saturn represents reality, effort, structure, and physical manifestation. Saturn says: 'You have done the work — the physical path is clear.'", category: "Saturn" },
  { id: "f5", front: "What is the 'Crosshair' in the Double Transit algorithm?", back: "The intersection point where Jupiter's aspect lines (5th, 7th, 9th) and Saturn's aspect lines (3rd, 7th, 10th) cross over the same natal house or lord.", category: "Algorithm" },
  { id: "f6", front: "Can a Double Transit hit the House Lord instead of the house itself?", back: "Yes! If the 7th House is owned by Venus sitting in the 2nd House, a Double Transit hitting the 2nd House will ALSO trigger the 7th House event.", category: "Advanced" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "Which two planets are required for the Double Transit Theory?", options: ["Mars and Venus", "Jupiter and Saturn", "Sun and Moon", "Rahu and Ketu"], correctIndex: 1, explanation: "The Double Transit requires both Jupiter (opportunity/blessing) and Saturn (reality/karma) to simultaneously influence the target house or lord." },
  { id: "kc2", question: "What aspects does transiting Jupiter cast?", options: ["3rd, 7th, 10th", "5th, 7th, 9th", "4th, 8th, 12th", "1st, 5th, 9th"], correctIndex: 1, explanation: "Jupiter casts its 5th, 7th, and 9th aspects — these are its special Drishti lines in Vedic astrology." },
  { id: "kc3", question: "If only Jupiter influences a house but Saturn does not, what happens?", options: ["The event happens immediately", "The event remains a thought or near-miss", "The event is delayed by 1 year", "Saturn's influence is irrelevant"], correctIndex: 1, explanation: "Both keys must turn. Without Saturn's physical-reality key, the event stays as potential — a thought or near-miss that doesn't fully manifest." },
];

// ─── Helpers ──────────────────────────────────────────────────
function formatMarkdown(text: string) {
  if (!text) return "";
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" }, transition: { duration: 0.5 } };

export default function Lesson14Interactive({ lesson, lessonProgress }: Lesson14InteractiveProps) {
  const { user } = useAuth();
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const progress = useReadingProgress();
  const contentRef = useRef<HTMLDivElement>(null);
  const activeSection = useScrollSpy({ sectionIds: SECTION_IDS, rootMargin: "-20% 0px -60% 0px" });

  const content = lesson.contentJson as unknown as LessonContent;
  const hasSections = content.sections && content.sections.length > 0;
  const sectionProgress = hasSections ? Math.round((completedSections.size / content.sections!.length) * 100) : 0;

  const markSectionComplete = useCallback((id: string) => {
    setCompletedSections((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const isLocked = lessonProgress?.status === "locked";
  const isCompleted = lessonProgress?.status === "completed";

  // Recap items
  const recapItems = useMemo(() => {
    const items: { id: string; title: string; summary: string }[] = [];
    if (content.intro) {
      items.push({ id: "recap-intro", title: "Double Transit Theory", summary: "Both Jupiter and Saturn must simultaneously influence the same natal house or lord for a major event to manifest." });
    }
    content.sections?.forEach((s) => {
      if (s.type === "definition") items.push({ id: `recap-${s.id}`, title: s.title, summary: "An event needs two administrative keys: Jupiter (blessing) and Saturn (karma). One key alone is not enough." });
      if (s.type === "etymology") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Jupiter = opportunity and grace. Saturn = reality and physical manifestation. Both are required." });
      if (s.type === "mechanics") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Track Jupiter's 5th/7th/9th aspects and Saturn's 3rd/7th/10th aspects. Find where their lines cross = the Crosshair." });
      if (s.type === "software_logic") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Software must check both the target house AND the house lord's position. A transit hitting the lord also triggers the event." });
    });
    return items.slice(0, 6);
  }, [content]);

  return (
    <div ref={contentRef}>
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
          <div className="flex-1 min-w-0">
            {/* ─── HERO ─── */}
            <section id="hero" className="mb-6 scroll-mt-32">
              <Link href="/learn" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Learning Path
              </Link>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
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
              <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
              {hasSections && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden max-w-[250px]">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${sectionProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs text-amber-600 font-medium">
                    {completedSections.size}/{content.sections?.length} sections viewed
                  </span>
                  {lessonProgress && lessonProgress.bestScore > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                      Best: {lessonProgress.bestScore}%
                    </span>
                  )}
                </div>
              )}
            </section>

            {/* ─── OVERVIEW ─── */}
            <section id="sec-overview" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Introduction</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6" dangerouslySetInnerHTML={{ __html: formatMarkdown(content.intro) }} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center">
                    <Crosshair className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">2</div>
                    <div className="text-[10px] text-amber-600">Planets Required</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center">
                    <Star className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">Jupiter</div>
                    <div className="text-[10px] text-amber-600">The Blessing</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center">
                    <Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">Saturn</div>
                    <div className="text-[10px] text-amber-600">The Karma</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center">
                    <Target className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">Crosshair</div>
                    <div className="text-[10px] text-amber-600">Aspect Intersection</div>
                  </div>
                </div>
              </motion.div>
              <CalloutBlock variant="important" className="mt-5">
                This lesson reveals the professional astrologer's secret weapon: the Double Transit. You will learn why Jupiter and Saturn together are the only reliable predictors of major life events.
              </CalloutBlock>
            </section>

            {/* ─── SECTIONS ─── */}
            {content.sections?.map((section, idx) => (
              <section key={section.id} id={`sec-${section.type}`} className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(String(section.id))} className="relative">
                    <LessonSection section={{ ...section, diagramType: undefined }} index={idx} />
                    {completedSections.has(String(section.id)) && (
                      <div className="absolute top-4 right-12">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </motion.div>
                {idx === 2 && (
                  <motion.div {...fadeUp} className="mt-4">
                    <DoubleTransitExplorer />
                  </motion.div>
                )}
              </section>
            ))}

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
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-gray-900">Key Concepts</h2>
                  <span className="ml-auto text-sm text-gray-500 font-medium">{content.concepts.length} concepts</span>
                </div>
                <div className="space-y-4">
                  {content.concepts.map((concept, idx) => (
                    <ConceptCard key={String(concept.id)} concept={concept} index={idx} showDiagram={false} showReference={false} />
                  ))}
                </div>
              </motion.div>
            </section>

            {/* ─── FLASHCARDS ─── */}
            <section id="sec-flashcards" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-gray-900">Review Flashcards</h2>
                  <span className="ml-auto text-sm text-gray-500 font-medium">{FLASHCARDS.length} cards</span>
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
                  <h2 className="text-xl font-bold text-gray-900">Test Your Knowledge</h2>
                  <span className="ml-auto text-sm text-gray-500 font-medium">{content.quiz.length} questions</span>
                </div>
                {isLocked ? (
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
                    <Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Lesson Locked</h3>
                    <p className="text-gray-500 mb-4">Complete the previous lessons to unlock this one.</p>
                    <Link href="/learn" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors">
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
                      <p className="text-xl font-bold text-gray-900">Continue to Dasha + Gochara Synthesis</p>
                      <p className="text-sm text-gray-500 mt-1">Next: Merge the macro-timeline with real-time transits for the ultimate predictive engine.</p>
                    </div>
                    <Link href="/learn" className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-amber-600/20 shrink-0">
                      Continue Learning <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
