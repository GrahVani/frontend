"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight,
  BookOpen, Layers, Sparkles, BrainCircuit, Target,
  Lightbulb, Play, Star, Zap, Flame, Crown,
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
import PanchaVargiyaExplorer from "./PanchaVargiyaExplorer";

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

interface Lesson28InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-etymology", "sec-mechanics", "sec-software", "sec-knowledge", "sec-concepts", "sec-flashcards", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Pancha Vargiya Bala", type: "definition", group: "Learn" },
  { id: "sec-etymology", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-mechanics", label: "The 5 Strengths", type: "mechanics", group: "Learn" },
  { id: "sec-software", label: "Varsheshvara Gate", type: "software_logic", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-flashcards", label: "Flashcards", type: "flashcards", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const FLASHCARDS = [
  { id: "f1", front: "What is Pancha Vargiya Bala?", back: "A 5-fold strength algorithm run on all planets in the annual chart. The highest-scoring planet connected to the annual Ascendant becomes the Varsheshvara (Lord of the Year).", category: "Core Definition" },
  { id: "f2", front: "What does 'Pancha Vargiya Bala' mean?", back: "Pancha = Five. Vargiya = Divisional/Belonging to Vargas. Bala = Strength. 'The Five-Fold Divisional Strength' — a condensed version of Shadbala for annual charts.", category: "Etymology" },
  { id: "f3", front: "What are the 5 strengths in Pancha Vargiya Bala?", back: "1. Sthana Bala (positional) · 2. Dik Bala (directional) · 3. Kala Bala (temporal) · 4. Chesta Bala (motional) · 5. Naisargika Bala (natural/inherent).", category: "5 Strengths" },
  { id: "f4", front: "What is the Varsheshvara (Lord of the Year)?", back: "The 'CEO' planet of the year. Determined by highest Pancha Vargiya Bala score + connection to annual Ascendant. If Mars wins, the year is aggressive and active.", category: "Varsheshvara" },
  { id: "f5", front: "What is Kshetra Bala in the annual chart?", back: "Sign/Positional Strength — max 30 units. Measures a planet's dignity in the annual chart: exaltation, own sign, friendly sign, enemy sign, or debilitation.", category: "Kshetra" },
  { id: "f6", front: "What is the Varsheshvara Validation Gate?", back: "Software must verify: (1) Highest Pancha Vargiya score, AND (2) Connection to annual Ascendant. A high-scoring planet with no Ascendant link cannot become Varsheshvara.", category: "Validation" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "How many strengths does Pancha Vargiya Bala measure?", options: ["3", "4", "5", "6"], correctIndex: 2, explanation: "Pancha Vargiya Bala measures 5 strengths: Sthana, Dik, Kala, Chesta, and Naisargika Bala." },
  { id: "kc2", question: "What does 'Varsheshvara' mean?", options: ["Lord of the Month", "Lord of the Year", "Lord of the Dasha", "Lord of the House"], correctIndex: 1, explanation: "Varsheshvara = Varsha (Year) + Ishvara (Lord). 'The Lord of the Year' — the planet that dictates the overall theme of the 365 days." },
  { id: "kc3", question: "What TWO conditions must a planet meet to become Varsheshvara?", options: ["Highest score + exalted in D-9", "Highest Pancha Vargiya score + connection to annual Ascendant", "Retrograde motion + highest Shadbala", "Ruling the 10th house + fastest velocity"], correctIndex: 1, explanation: "The Varsheshvara must have (1) the highest Pancha Vargiya Bala score, AND (2) a connection to the annual Ascendant. Without the Ascendant link, even the strongest planet cannot be crowned." },
];

// ─── Helpers ──────────────────────────────────────────────────
function formatMarkdown(text: string) {
  if (!text) return "";
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\n/g, "<br/>");
}

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" }, transition: { duration: 0.5 } };

export default function Lesson28Interactive({ lesson, lessonProgress }: Lesson28InteractiveProps) {
  const { user } = useAuth();
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const progress = useReadingProgress();
  const contentRef = useRef<HTMLDivElement>(null);
  const activeSection = useScrollSpy({ sectionIds: SECTION_IDS, rootMargin: "-20% 0px -60% 0px" });

  const content = lesson.contentJson as unknown as LessonContent;
  const hasSections = content.sections && content.sections.length > 0;
  const sectionProgress = hasSections ? Math.round((completedSections.size / content.sections!.length) * 100) : 0;

  const markSectionComplete = useCallback((id: string) => { setCompletedSections((prev) => { if (prev.has(id)) return prev; const next = new Set(prev); next.add(id); return next; }); }, []);
  const scrollTo = useCallback((id: string) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, []);

  const isLocked = lessonProgress?.status === "locked";
  const isCompleted = lessonProgress?.status === "completed";

  const recapItems = useMemo(() => {
    const items: { id: string; title: string; summary: string }[] = [];
    if (content.intro) items.push({ id: "recap-intro", title: "Pancha Vargiya Bala", summary: "A 5-fold strength algorithm that crowns the Varsheshvara — the Lord of the Year who dictates the annual theme." });
    content.sections?.forEach((s) => {
      if (s.type === "definition") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Five divisional strengths: Sthana, Dik, Kala, Chesta, Naisargika. The highest scorer connected to annual Ascendant wins." });
      if (s.type === "etymology") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Pancha = Five, Vargiya = Divisional, Bala = Strength. A condensed Shadbala for annual chart analysis." });
      if (s.type === "mechanics") items.push({ id: `recap-${s.id}`, title: s.title, summary: "5 strengths evaluated: position, direction, time, motion, and natural power. Kshetra Bala maxes at 30 units for sign dignity." });
      if (s.type === "software_logic") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Validation Gate: highest score + Ascendant connection required. Software crowns the Varsheshvara only when both conditions are met." });
    });
    return items.slice(0, 6);
  }, [content]);

  return (
    <div ref={contentRef}>
      <ScrollProgress />
      <div className="mx-auto pb-20">
        <div className="flex gap-8">
          <LessonSidebar sections={SIDEBAR_SECTIONS} activeSection={activeSection} completedSections={completedSections} onNavigate={scrollTo} progress={Math.max(progress, sectionProgress)} className="w-64 shrink-0" />
          <div className="flex-1 min-w-0">
            <section id="hero" className="mb-6 scroll-mt-32">
              <Link href="/learn" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm mb-4 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Learning Path</Link>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
                {isCompleted && <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>}
                {isLocked && <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
              {hasSections && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden max-w-[250px]"><motion.div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${sectionProgress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} /></div>
                  <span className="text-xs text-amber-600 font-medium">{completedSections.size}/{content.sections?.length} sections viewed</span>
                  {lessonProgress && lessonProgress.bestScore > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">Best: {lessonProgress.bestScore}%</span>}
                </div>
              )}
            </section>

            <section id="sec-overview" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-600" /><span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Introduction</span></div></div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6" dangerouslySetInnerHTML={{ __html: formatMarkdown(content.intro) }} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Crown className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">5</div><div className="text-[10px] text-amber-600">Strength Types</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Star className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">CEO</div><div className="text-[10px] text-amber-600">Varsheshvara</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">30</div><div className="text-[10px] text-amber-600">Kshetra Max</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Target className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">Gate</div><div className="text-[10px] text-amber-600">2 Conditions</div></div>
                </div>
              </motion.div>
              <CalloutBlock variant="important" className="mt-5">This lesson teaches how to crown the annual CEO. The Varsheshvara sets the emotional and environmental tone for the entire year — learn how to identify it precisely.</CalloutBlock>
            </section>

            {content.sections?.map((section, idx) => (
              <section key={section.id} id={`sec-${section.type}`} className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(String(section.id))} className="relative"><LessonSection section={{ ...section, diagramType: undefined }} index={idx} />{completedSections.has(String(section.id)) && <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>}</div>
                </motion.div>
                {idx === 2 && (
                  <motion.div {...fadeUp} className="mt-4">
                    <PanchaVargiyaExplorer />
                  </motion.div>
                )}
              </section>
            ))}

            <section id="sec-knowledge" className="mb-6 scroll-mt-32"><motion.div {...fadeUp}><KnowledgeCheck questions={KNOWLEDGE_CHECKS} title="Check Your Understanding" /></motion.div></section>

            <section id="sec-concepts" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><Lightbulb className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-gray-900">Key Concepts</h2><span className="ml-auto text-sm text-gray-500 font-medium">{content.concepts.length} concepts</span></div>
                <div className="space-y-4">{content.concepts.map((concept, idx) => <ConceptCard key={String(concept.id)} concept={concept} index={idx} showDiagram={false} showReference={false} />)}</div>
              </motion.div>
            </section>

            <section id="sec-flashcards" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><Layers className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-gray-900">Review Flashcards</h2><span className="ml-auto text-sm text-gray-500 font-medium">{FLASHCARDS.length} cards</span></div>
                <Flashcard cards={FLASHCARDS} />
              </motion.div>
            </section>

            <section id="sec-recap" className="mb-6 scroll-mt-32"><RecapSection items={recapItems} title="What You Learned in This Lesson" /></section>

            <section id="sec-quiz" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><BrainCircuit className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-gray-900">Test Your Knowledge</h2><span className="ml-auto text-sm text-gray-500 font-medium">{content.quiz.length} questions</span></div>
                {isLocked ? (
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center"><Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" /><h3 className="text-lg font-bold text-gray-700 mb-2">Lesson Locked</h3><p className="text-gray-500 mb-4">Complete the previous lessons to unlock this one.</p><Link href="/learn" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors"><Play className="w-4 h-4" /> Go to Learning Path</Link></div>
                ) : <InteractiveQuiz quiz={content.quiz} concepts={content.concepts} lessonId={lesson.id} />}
              </motion.div>
            </section>

            <section id="sec-next" className="scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-amber-200/60 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div><p className="text-sm text-amber-600 mb-1 font-medium">🎉 Lesson Complete!</p><p className="text-xl font-bold text-gray-900">Continue to Tajik Yogas</p><p className="text-sm text-gray-500 mt-1">Next: Master the Persian geometric aspects and Tajik-specific yogas for annual charts.</p></div>
                    <Link href="/learn" className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-amber-600/20 shrink-0">Continue Learning <ChevronRight className="w-4 h-4" /></Link>
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
