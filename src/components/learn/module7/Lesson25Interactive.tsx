"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight,
  BookOpen, Layers, Sparkles, BrainCircuit, Target,
  Lightbulb, Play, Star, Zap, Flame, Heart,
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
import KootaMilanExplorer from "./KootaMilanExplorer";

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

interface Lesson25InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-etymology", "sec-mechanics", "sec-software", "sec-knowledge", "sec-concepts", "sec-flashcards", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Synastry & Koota Milan", type: "definition", group: "Learn" },
  { id: "sec-etymology", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-mechanics", label: "The 8 Kootas", type: "mechanics", group: "Learn" },
  { id: "sec-software", label: "Exceptions & Doshas", type: "software_logic", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-flashcards", label: "Flashcards", type: "flashcards", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const FLASHCARDS = [
  { id: "f1", front: "What is Synastry & Koota Milan?", back: "A compatibility matrix that compares two birth charts (primarily Moon signs and Nakshatras) to predict the structural health of a relationship across 8 critical life domains.", category: "Core Definition" },
  { id: "f2", front: "What does 'Koota Milan' mean?", back: "Koota = Division/Category. Milan = Matching/Comparison. 'Divisional Matching' — comparing 8 specific categories between two charts.", category: "Etymology" },
  { id: "f3", front: "What is Varna Koota (1 point)?", back: "Compares spiritual hierarchy and ego compatibility. The 4 Varnas are Brahmin (wisdom), Kshatriya (warrior), Vaishya (merchant), Shudra (service). Partners should be equal or the groom one level higher.", category: "Varna" },
  { id: "f4", front: "What is Vasya Koota (2 points)?", back: "Measures magnetic attraction and power dynamics. Certain signs naturally dominate or submit to others. High score = natural attraction.", category: "Vasya" },
  { id: "f5", front: "What is Nadi Koota (8 points) — the most critical?", back: "Measures genetic and health compatibility. Same Nadi = zero points (high risk of genetic conflict). Different Nadi = full 8 points. This alone can cancel a match.", category: "Nadi" },
  { id: "f6", front: "What is the minimum passing score in Koota Milan?", back: "18 out of 36 points is the traditional minimum. Below 18 = severe incompatibility. 18-24 = acceptable. 25-32 = very good. 33-36 = exceptional.", category: "Scoring" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "How many Kootas (categories) are compared in Koota Milan?", options: ["5", "6", "8", "12"], correctIndex: 2, explanation: "Koota Milan compares 8 categories: Varna, Vasya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi." },
  { id: "kc2", question: "Which Koota carries the highest point weight (8 points)?", options: ["Varna", "Gana", "Nadi", "Bhakoot"], correctIndex: 2, explanation: "Nadi Koota carries 8 points — the highest weight. Same Nadi = 0 points and can cancel the entire match due to genetic incompatibility risk." },
  { id: "kc3", question: "What is the traditional minimum passing score for Koota Milan?", options: ["12", "18", "24", "30"], correctIndex: 1, explanation: "18 out of 36 points is the traditional minimum passing score. Below 18 = severe incompatibility. 25+ = very good match." },
];

// ─── Helpers ──────────────────────────────────────────────────
function formatMarkdown(text: string) {
  if (!text) return "";
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\n/g, "<br/>");
}

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" }, transition: { duration: 0.5 } };

export default function Lesson25Interactive({ lesson, lessonProgress }: Lesson25InteractiveProps) {
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
    if (content.intro) items.push({ id: "recap-intro", title: "Synastry & Koota Milan", summary: "A compatibility matrix comparing two charts across 8 life domains to predict relationship structural health." });
    content.sections?.forEach((s) => {
      if (s.type === "definition") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Compares Moon signs and Nakshatras of two individuals to assess compatibility across spiritual, emotional, physical, and genetic dimensions." });
      if (s.type === "etymology") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Koota = Division/Category. Milan = Matching. 'Divisional Matching.'" });
      if (s.type === "mechanics") items.push({ id: `recap-${s.id}`, title: s.title, summary: "8 Kootas total 36 points: Varna(1), Vasya(2), Tara(3), Yoni(4), Graha Maitri(5), Gana(6), Bhakoot(7), Nadi(8). Nadi is most critical." });
      if (s.type === "software_logic") items.push({ id: `recap-${s.id}`, title: s.title, summary: "Software must check for exceptions and cancellations (Doshas). Some low scores can be overridden; some high scores can be nullified by specific afflictions." });
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
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Heart className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">8</div><div className="text-[10px] text-amber-600">Kootas</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Star className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">36</div><div className="text-[10px] text-amber-600">Total Points</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">18+</div><div className="text-[10px] text-amber-600">Min Pass</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 text-center"><Target className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-gray-900">Nadi</div><div className="text-[10px] text-amber-600">8 pts (Max)</div></div>
                </div>
              </motion.div>
              <CalloutBlock variant="important" className="mt-5">This lesson teaches the mathematics of relationships. You will learn how ancient astrologers quantified love, loyalty, attraction, and genetic compatibility into a precise 36-point scoring system.</CalloutBlock>
            </section>

            {content.sections?.map((section, idx) => (
              <section key={section.id} id={`sec-${section.type}`} className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(String(section.id))} className="relative"><LessonSection section={{ ...section, diagramType: undefined }} index={idx} />{completedSections.has(String(section.id)) && <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>}</div>
                </motion.div>
                {idx === 2 && (
                  <motion.div {...fadeUp} className="mt-4">
                    <KootaMilanExplorer />
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
                    <div><p className="text-sm text-amber-600 mb-1 font-medium">🎉 Lesson Complete!</p><p className="text-xl font-bold text-gray-900">Continue to Astro-Remediation</p><p className="text-sm text-gray-500 mt-1">Next: Learn how to physically counteract negative planetary influences through Remedial Astrology.</p></div>
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
