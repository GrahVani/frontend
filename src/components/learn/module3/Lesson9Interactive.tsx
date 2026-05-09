"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight,
  BookOpen, Layers, Sparkles, BrainCircuit, Target,
  Lightbulb, Play, Star, Zap, Flame, Scale,
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
import AvasthaSynthesisExplorer from "./AvasthaSynthesisExplorer";


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

interface Lesson9InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-etymology", "sec-mechanics", "sec-synthesis", "sec-knowledge", "sec-concepts", "sec-flashcards", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "What is an Avastha?", type: "definition", group: "Learn" },
  { id: "sec-etymology", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-mechanics", label: "Age States", type: "mechanics", group: "Learn" },
  { id: "sec-synthesis", label: "Dignity + Avastha", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-flashcards", label: "Flashcards", type: "flashcards", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const FLASHCARDS = [
  { id: "f1", front: "What is an Avastha?", back: "The mathematical state, condition, or 'age' of a planet, calculated by its exact longitudinal degree within a 30-degree Rashi (Sign).", category: "Core Definition" },
  { id: "f2", front: "What does 'Avastha' mean in Sanskrit?", back: "'State,' 'Condition,' or 'Stage of Life.' Planets go through a life cycle within each sign, just like humans.", category: "Etymology" },
  { id: "f3", front: "What are the 5 Baaladi Avasthas (Age States)?", back: "1. Bala (Infant): 0°-6° · 2. Kumara (Adolescent): 6°-12° · 3. Yuva (Youth/Prime): 12°-18° · 4. Vriddha (Old): 18°-24° · 5. Mrita (Dead): 24°-30°", category: "Age States" },
  { id: "f4", front: "How do Odd and Even signs differ for Avasthas?", back: "Odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius): Bala → Kumara → Yuva → Vriddha → Mrita. Even signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces): Mrita → Vriddha → Yuva → Kumara → Bala. The middle degrees (12°-18°) are ALWAYS at 100% power.", category: "Algorithm" },
  { id: "f5", front: "What is the synthesis of Dignity + Avastha?", back: "Dignity tells you WHAT a planet promises. Avastha tells you HOW WELL it can deliver. Exalted Sun at 29° Aries = brilliant potential (Exalted) but depleted energy (Dead Avastha).", category: "Synthesis" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "What does 'Avastha' mean in Sanskrit?", options: ["Planet", "State or Condition", "House", "Sign"], correctIndex: 1, explanation: "Avastha translates to 'State,' 'Condition,' or 'Stage of Life.' It measures a planet's kinetic capacity to deliver results within a sign." },
  { id: "kc2", question: "At which degree range is a planet at 100% power (Yuva/Youth) in ANY sign?", options: ["0°-6°", "6°-12°", "12°-18°", "24°-30°"], correctIndex: 2, explanation: "The middle degrees (12°-18°) are always the Yuva (Youth/Prime) state, regardless of whether the sign is Odd or Even. This is the planet's maximum power zone." },
  { id: "kc3", question: "An exalted planet at 29° in an Odd sign has what Avastha?", options: ["Bala (Infant)", "Yuva (Youth)", "Vriddha (Old)", "Mrita (Dead)"], correctIndex: 3, explanation: "In Odd signs, 24°-30° is Mrita (Dead). Even though the planet is exalted (100% dignity), its Avastha is 0% material power. The person has brilliant potential but lacks energy to manifest it." },
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

export default function Lesson9Interactive({ lesson, lessonProgress }: Lesson9InteractiveProps) {
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
      items.push({ id: "recap-intro", title: "What is an Avastha?", summary: "An Avastha is the mathematical state or 'age' of a planet, calculated by its exact degree within a 30-degree sign. It determines the planet's kinetic capacity to deliver results." });
    }
    content.sections?.forEach((s) => {
      if (s.type === "definition") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Avastha = the state, condition, or stage of life of a planet within a sign, measured by its longitudinal degree." });
      if (s.type === "etymology") items.push({ id: `recap-${s.id}`, title: s.title, summary: "From Sanskrit Avastha — 'state,' 'condition,' or 'stage of life.' Planets experience a life cycle within each sign." });
      if (s.type === "content" && s.title.includes("Age")) items.push({ id: `recap-${s.id}`, title: s.title, summary: "The five Baaladi Avasthas are Bala (0°-6°), Kumara (6°-12°), Yuva (12°-18°), Vriddha (18°-24°), and Mrita (24°-30°). Odd and even signs have opposite directions." });
      if (s.type === "content" && s.title.includes("Dignity")) items.push({ id: `recap-${s.id}`, title: s.title, summary: "Dignity tells you WHAT a planet promises. Avastha tells you HOW WELL it can deliver. Together they give the full picture of planetary strength." });
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
                    <Scale className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">5</div>
                    <div className="text-[10px] text-amber-600">Age States</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center">
                    <Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">30°</div>
                    <div className="text-[10px] text-amber-600">Per Sign</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center">
                    <Target className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">12°-18°</div>
                    <div className="text-[10px] text-amber-600">Peak Power</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center">
                    <Flame className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">Odd / Even</div>
                    <div className="text-[10px] text-amber-600">Direction</div>
                  </div>
                </div>
              </motion.div>
              <CalloutBlock variant="important" className="mt-5">
                This lesson introduces the degree-based states of planets — Avasthas — and how they combine with Dignity to determine a planet's true capacity to deliver results.
              </CalloutBlock>
            </section>

            {/* ─── SECTIONS ─── */}
            {content.sections?.map((section, idx) => (
              <section key={section.id} id={`sec-${section.type === "content" ? (idx === 2 ? "mechanics" : "synthesis") : section.type}`} className="mb-6 scroll-mt-32">
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
                {/* Interactive Avastha Synthesis Explorer */}
                {idx === 2 && (
                  <motion.div {...fadeUp} className="mt-4">
                    <AvasthaSynthesisExplorer />
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
                      <p className="text-xl font-bold text-gray-900">Continue to the Next Lesson</p>
                      <p className="text-sm text-gray-500 mt-1">Next: Keep exploring the planetary strength system.</p>
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
