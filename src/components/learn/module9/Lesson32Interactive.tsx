"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight,
  BookOpen, Layers, BrainCircuit, Target,
  Lightbulb, Play, Star, Zap, HandHeart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Lesson, LessonProgressData } from "@/lib/api";
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
import DanaSevaExplorer from "./DanaSevaExplorer";

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

interface Lesson32InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-etymology", "sec-mechanics", "sec-software", "sec-knowledge", "sec-concepts", "sec-flashcards", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Dana & Seva", type: "definition", group: "Learn" },
  { id: "sec-etymology", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-mechanics", label: "Karmic Offset Algorithm", type: "mechanics", group: "Learn" },
  { id: "sec-software", label: "Execution Flow", type: "software_logic", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-flashcards", label: "Flashcards", type: "flashcards", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const FLASHCARDS = [
  { id: "f1", front: "What is Dana & Seva?", back: "The algorithmic practice of donating items or performing service ruled by an afflicted planet to offset its negative karma. Charity neutralizes malefic energy by giving away what the planet represents.", category: "Core Definition" },
  { id: "f2", front: "What does 'Dana' and 'Seva' mean?", back: "Dana = Charity/Donation. Seva = Selfless Service. Together they form the karmic offset mechanism — giving away what an afflicted planet controls to reduce its grip." },
  { id: "f3", front: "What is the Karmic Offset Algorithm?", back: "Identify the afflicted planet → Determine what it rules (house + significations) → Donate or serve EXACTLY that domain → The negative energy is redirected outward instead of inward.", category: "Algorithm" },
  { id: "f4", front: "What should you donate for an afflicted Saturn?", back: "Saturn rules iron, black items, sesame oil, blankets, and service to the elderly or disabled. Donating these items or serving the aged offsets Saturn's delay and hardship.", category: "Saturn Dana" },
  { id: "f5", front: "What should you donate for an afflicted Jupiter?", back: "Jupiter rules gold, yellow items, knowledge, and Brahmin/priestly support. Donating scriptures, teaching the poor, or supporting priests offsets Jupiter's wisdom-blockage.", category: "Jupiter Dana" },
  { id: "f6", front: "Why is timing critical in Dana & Seva?", back: "Charity is most effective on the DAY ruled by the afflicted planet (e.g., Saturday for Saturn) and during its Hora (planetary hour). This aligns the karmic offset with the planet's active frequency.", category: "Timing" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "What is the core principle of Dana & Seva remediation?", options: ["Accumulate wealth", "Give away what the afflicted planet rules", "Avoid the planet entirely", "Change the birth time"], correctIndex: 1, explanation: "Dana & Seva work by giving away exactly what the afflicted planet rules. This redirects negative energy outward instead of allowing it to manifest as suffering inward." },
  { id: "kc2", question: "Which items should be donated for an afflicted Saturn?", options: ["Gold and yellow cloth", "Iron, black items, sesame oil, blankets", "Red coral and red cloth", "Pearls and white cloth"], correctIndex: 1, explanation: "Saturn rules iron, black items, sesame oil, and blankets. Service to the elderly or disabled also powerfully offsets Saturn's hardship." },
  { id: "kc3", question: "When is Dana most effective for a specific planet?", options: ["Any time of day", "On the day ruled by the planet and during its Hora", "Only during full moon", "Only on the native's birthday"], correctIndex: 1, explanation: "Charity is most effective on the DAY ruled by the afflicted planet (e.g., Saturday for Saturn) and during its HORA (planetary hour). This aligns the karmic offset with the planet's active frequency." },
];

// ─── Helpers ──────────────────────────────────────────────────
function formatMarkdown(text: string) {
  if (!text) return "";
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\n/g, "<br/>");
}

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" }, transition: { duration: 0.5 } };

export default function Lesson32Interactive({ lesson, lessonProgress }: Lesson32InteractiveProps) {
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
    if (content.intro) items.push({ id: "recap-intro", title: "Dana & Seva", summary: "The karmic offset mechanism: donating items or performing service ruled by an afflicted planet to redirect negative energy outward." });
    content.sections?.forEach((s) => {
      if (s.type === "definition") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Charity neutralizes malefic energy by giving away what the planet represents. You sacrifice the planet's domain to reduce its grip." });
      if (s.type === "etymology") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Dana = Charity/Donation. Seva = Selfless Service. The giving-away remedy." });
      if (s.type === "mechanics") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Algorithm: Identify afflicted planet → Determine its rulerships → Donate EXACTLY that domain → Energy redirects outward. Timing: planet's day + Hora." });
      if (s.type === "software_logic") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Software maps each planet to its donation items, calculates optimal timing (day + Hora), and generates a personalized charity protocol." });
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
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><HandHeart className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">Give</div><div className="text-[10px] text-amber-600">= Receive</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Star className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">9</div><div className="text-[10px] text-amber-600">Planet Maps</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">Day</div><div className="text-[10px] text-amber-600">+ Hora</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Target className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">Offset</div><div className="text-[10px] text-amber-600">Karma</div></div>
                </div>
              </motion.div>
              <CalloutBlock variant="important" className="mt-5">This lesson teaches the highest form of remediation: giving. You will learn how to algorithmically match an afflicted planet with its corresponding charitable action — and why timing that charity on the planet's day creates maximum karmic offset.</CalloutBlock>
            </section>

            {content.sections?.map((section, idx) => (
              <section key={section.id} id={`sec-${section.type}`} className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(String(section.id))} className="relative"><LessonSection section={{ ...section, diagramType: undefined }} index={idx} />{completedSections.has(String(section.id)) && <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>}</div>
                </motion.div>
                {idx === 2 && (
                  <motion.div {...fadeUp} className="mt-4">
                    <DanaSevaExplorer />
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
                    <div><p className="text-sm text-amber-600 mb-1 font-medium">🎉 Lesson Complete!</p><p className="text-xl font-bold text-gray-900">Continue to Yantra & Modern Anchors</p><p className="text-sm text-gray-500 mt-1">Next: Learn the geometry engine — how sacred geometric patterns and modern anchors create focused energy fields.</p></div>
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
