"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight,
  BookOpen, Layers, BrainCircuit, Target,
  Lightbulb, Play, Star, Zap, Hexagon,
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
import YantraGeometryExplorer from "./YantraGeometryExplorer";

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

interface Lesson33InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-etymology", "sec-mechanics", "sec-software", "sec-knowledge", "sec-concepts", "sec-flashcards", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Yantra & Modern Anchors", type: "definition", group: "Learn" },
  { id: "sec-etymology", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-mechanics", label: "Sacred Geometry", type: "mechanics", group: "Learn" },
  { id: "sec-software", label: "Modern Anchors", type: "software_logic", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-flashcards", label: "Flashcards", type: "flashcards", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const FLASHCARDS = [
  { id: "f1", front: "What is a Yantra?", back: "A sacred geometric diagram representing a specific deity or planetary energy. It acts as a 2D antenna that focuses and amplifies cosmic frequencies into a localized energy field.", category: "Core Definition" },
  { id: "f2", front: "What does 'Yantra' mean?", back: "Yantra = 'Instrument' or 'Machine' in Sanskrit. It is a spiritual technology — a geometric tool designed to harness and focus specific energies.", category: "Etymology" },
  { id: "f3", front: "What is the Sri Yantra?", back: "The most powerful and complex Yantra — composed of 9 interlocking triangles (4 Shiva/male upward, 5 Shakti/female downward) forming 43 smaller triangles. It represents the entire cosmos and divine feminine energy.", category: "Sri Yantra" },
  { id: "f4", front: "How does a Yantra work physically?", back: "The geometric pattern creates a cymatic field. When the eye gazes at the center (bindu), the brain enters a focused meditative state. The pattern acts as a resonance chamber for the planet's frequency.", category: "Mechanism" },
  { id: "f5", front: "What are Modern Anchors in remediation?", back: "Contemporary equivalents of Yantras: vision boards, affirmation practices, digital reminders, environmental design (Feng Shui/Vastu), and wearable tech that serve as constant energetic focal points.", category: "Modern Anchors" },
  { id: "f6", front: "What is the rule for Yantra placement?", back: "A Yantra should face the direction ruled by the planet it represents (e.g., Sun = East, Saturn = West). It must be kept clean, energized (prana pratishtha), and placed at eye level for daily gazing.", category: "Placement" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "What does 'Yantra' literally mean?", options: ["Prayer", "Instrument/Machine", "Gemstone", "Mantra"], correctIndex: 1, explanation: "Yantra = 'Instrument' or 'Machine' in Sanskrit. It is a spiritual technology — a geometric tool designed to harness and focus specific cosmic energies." },
  { id: "kc2", question: "How many interlocking triangles form the Sri Yantra?", options: ["3", "6", "9", "12"], correctIndex: 2, explanation: "The Sri Yantra consists of 9 interlocking triangles — 4 upward (Shiva/male) and 5 downward (Shakti/female) — forming 43 smaller triangles total. It is the most powerful Yantra representing the entire cosmos." },
  { id: "kc3", question: "Which direction should a Sun Yantra face?", options: ["North", "South", "East", "West"], correctIndex: 2, explanation: "The Sun Yantra should face East — the direction ruled by the Sun. Each planet has a directional rulership that determines optimal Yantra placement." },
];

// ─── Helpers ──────────────────────────────────────────────────
function formatMarkdown(text: string) {
  if (!text) return "";
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\n/g, "<br/>");
}

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" }, transition: { duration: 0.5 } };

export default function Lesson33Interactive({ lesson, lessonProgress }: Lesson33InteractiveProps) {
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
    if (content.intro) items.push({ id: "recap-intro", title: "Yantra & Modern Anchors", summary: "Sacred geometric diagrams and modern focal points that create localized energy fields to amplify or balance planetary frequencies." });
    content.sections?.forEach((s) => {
      if (s.type === "definition") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Yantras are 2D geometric antennas. Modern anchors are contemporary equivalents (vision boards, apps, environmental design)." });
      if (s.type === "etymology") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Yantra = Instrument/Machine. A spiritual technology, not just art." });
      if (s.type === "mechanics") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Geometric patterns create cymatic fields. The bindu (center point) focuses energy. Sri Yantra = 9 triangles, 43 sub-triangles." });
      if (s.type === "software_logic") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Software can generate personalized Yantras, recommend modern anchors, and track engagement with remedial practices." });
    });
    return items.slice(0, 6);
  }, [content]);

  return (
    <div ref={contentRef}>
      <ScrollProgress />
      <div className="mx-auto pb-20">
        <div className="flex gap-8">
          <LessonSidebar sections={SIDEBAR_SECTIONS} activeSection={activeSection} completedSections={completedSections} onNavigate={scrollTo} progress={Math.max(progress, sectionProgress)} className="w-64 shrink-0 sticky top-4 self-start h-fit" />
          <div className="flex-1 min-w-0">
            <section id="hero" className="mb-6 scroll-mt-32">
              <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm mb-4 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Learning Path</Link>
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
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Hexagon className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">9</div><div className="text-[10px] text-amber-600">Sri Yantra Triangles</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Star className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">2D</div><div className="text-[10px] text-amber-600">Antenna</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">Bindu</div><div className="text-[10px] text-amber-600">Focus Point</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Target className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">Modern</div><div className="text-[10px] text-amber-600">Anchors</div></div>
                </div>
              </motion.div>
              <CalloutBlock variant="important" className="mt-5">This is the capstone of Module 9. Yantras bridge ancient sacred geometry with modern technology — from copper-plate Sri Yantras to vision boards and digital reminders. You will learn how focused geometry creates focused reality.</CalloutBlock>
            </section>

            {content.sections?.map((section, idx) => (
              <section key={section.id} id={`sec-${section.type}`} className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(String(section.id))} className="relative"><LessonSection section={{ ...section, diagramType: undefined }} index={idx} />{completedSections.has(String(section.id)) && <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>}</div>
                </motion.div>
                {idx === 2 && (
                  <motion.div {...fadeUp} className="mt-4">
                    <YantraGeometryExplorer />
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
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center"><Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" /><h3 className="text-lg font-bold text-gray-700 mb-2">Lesson Locked</h3><p className="text-gray-500 mb-4">Complete the previous lessons to unlock this one.</p><Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors"><Play className="w-4 h-4" /> Go to Learning Path</Link></div>
                ) : <InteractiveQuiz quiz={content.quiz} concepts={content.concepts} lessonId={lesson.id} />}
              </motion.div>
            </section>

            <section id="sec-next" className="scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-amber-200/60 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div><p className="text-sm text-amber-600 mb-1 font-medium">🎉 Module 9 Complete!</p><p className="text-xl font-bold text-gray-900">You've Mastered Astro-Remediation</p><p className="text-sm text-gray-500 mt-1">You've now covered gemstones, mantras, charity, and sacred geometry — the complete remedial toolkit for shifting astrological probability.</p></div>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-amber-600/20 shrink-0">Continue Learning <ChevronRight className="w-4 h-4" /></Link>
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
