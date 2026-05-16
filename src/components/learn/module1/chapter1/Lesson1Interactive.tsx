"use client";
import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight, BookOpen, Layers, Sparkles, BrainCircuit, Eye, Lightbulb, Play, BookMarked, Clock, GitCompare, ScrollText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Lesson, type LessonProgressData } from "@/lib/api";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import ScrollProgress from "@/components/learn/interactive/ScrollProgress";
import LessonSidebar from "@/components/learn/interactive/LessonSidebar";
import ReadingTime from "@/components/learn/interactive/ReadingTime";
import TTSButton from "@/components/learn/interactive/TTSButton";
import Flashcard from "@/components/learn/interactive/Flashcard";
import KnowledgeCheck from "@/components/learn/interactive/KnowledgeCheck";
import ConceptCard from "@/components/learn/ConceptCard";
import InteractiveQuiz from "@/components/learn/InteractiveQuiz";
import VedangaWheel from "./VedangaWheel";
import { SECTION_IDS, buildSidebarSections, FLASHCARDS, KNOWLEDGE_CHECKS } from "./Lesson1Config";
import { parseLessonBody } from "@/lib/lesson-parser";
import { HookSection, PrereqSection, VedangaTableSection, WhyEyeSection, VsVedantaSection, NonCoverageSection, SlokasSection, WorkedExamplesSection, MistakesSection, RememberSection, SummarySection, CitationsSection, type RecapInsight } from "./Lesson1Sections";

// Types
interface Concept { id: number; title: string; description: string; icon?: string; keyTakeaway?: string; proTip?: string; commonMistake?: string; media?: { type: string; diagramType?: string; caption?: string }; }
interface LessonContent { intro: string; sections?: unknown[]; concepts: Concept[]; quiz: unknown[]; }

interface Props { lesson: Lesson; lessonProgress: LessonProgressData | null; }

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as `${number}px` }, transition: { duration: 0.5 } };

const M1C1L1_RECAP_INSIGHTS: RecapInsight[] = [
  { icon: Layers, title: "Six Vedāṅgas", description: "Jyotiṣa is one of six supporting disciplines — the limbs of the Veda.", badge: "Foundation", badgeColor: "amber" },
  { icon: Eye, title: "Eye of the Veda", description: "Jyotiṣa provides temporal vision — 'vedasya cakṣuḥ' means the tradition sees time.", badge: "Core Metaphor", badgeColor: "violet", highlight: true },
  { icon: Clock, title: "Ritual Timing", description: "Original purpose: determine the correct moment for Vedic rituals to retain efficacy.", badge: "Origin", badgeColor: "green" },
  { icon: GitCompare, title: "Vedāṅga ≠ Vedānta", description: "Vedāṅga = 6 supporting tools. Vedānta = philosophical culmination (Upaniṣadic).", badge: "Critical", badgeColor: "red" },
  { icon: ScrollText, title: "Source Texts", description: "Pāṇinīya Śikṣā 41-42 & Vedāṅga Jyotiṣa (Lagadha) anchor this framework.", badge: "Classical", badgeColor: "blue" },
];

export default function Lesson1Interactive({ lesson, lessonProgress }: Props) {
  const { user } = useAuth();
  const content = lesson.contentJson as unknown as LessonContent;
  const progress = useReadingProgress();
  const activeSection = useScrollSpy({ sectionIds: SECTION_IDS });
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const scrollTo = useCallback((id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }, []);

  const isLocked = lessonProgress?.status === "locked";
  const isCompleted = lessonProgress?.status === "completed";
  const allText = useMemo(() => content.intro + content.concepts.map(c => c.description).join(" "), [content]);

  // Parse structured lesson data from bodyMarkdown (DB source)
  const parsed = useMemo(() => {
    if (!lesson.bodyMarkdown) return null;
    return parseLessonBody(
      lesson.bodyMarkdown,
      lesson.primarySources || [],
      lesson.modernSources || []
    );
  }, [lesson.bodyMarkdown, lesson.primarySources, lesson.modernSources]);

  const introHook = parsed?.hookText
    ? parsed.hookText.split(".").slice(0, 2).join(".") + "."
    : "Jyotisa is one of six classical Vedangas — limbs of the Veda. This lesson places it within its proper textual home.";

  return (
    <>
      <ScrollProgress />
      <div className="mx-auto pb-20">
        <div className="flex gap-8">
          <LessonSidebar sections={buildSidebarSections(parsed)} activeSection={activeSection} completedSections={completedSections} onNavigate={scrollTo} progress={progress} className="w-64 shrink-0 sticky top-4 self-start h-fit" />

          <div className="flex-1 min-w-0  space-y-6">

            {/* ═══ HERO ═══ */}
            <section id="hero" className="scroll-mt-32">
              <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Learning Path
              </Link>
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <GraduationCap className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
                  <span className="text-xs text-amber-400">·</span>
                  <span className="text-xs font-medium text-amber-600">Module 01 · Ch.1 — What Jyotiṣa Is</span>
                  {isCompleted && <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>}
                  {isLocked && <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-3">{lesson.title}</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <ReadingTime text={allText} />
                  <span className="text-amber-300">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700"><Layers className="w-3.5 h-3.5" /> 8 Sections</span>
                  <span className="text-amber-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600"><Lightbulb className="w-3.5 h-3.5" /> {content.concepts.length} Concepts</span>
                  <span className="text-amber-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600"><BrainCircuit className="w-3.5 h-3.5" /> {content.quiz.length} Questions</span>
                </div>
              </motion.div>
              {/* Intro card */}
              <motion.div {...fadeUp} className="mt-4 relative overflow-hidden bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20 rounded-2xl border border-amber-200/60 shadow-sm p-5 sm:p-6">
                {/* Decorative accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-2 mb-4 relative">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center"><BookOpen className="w-3.5 h-3.5 text-amber-700" /></div>
                  <span className="text-sm font-semibold text-amber-800 uppercase tracking-wide">Introduction</span>
                  <span className="ml-auto"><TTSButton text={introHook} size="sm" label="Listen" /></span>
                </div>

                {/* Key question - highlighted */}
                <div className="relative mb-4 p-4 bg-amber-50/80 rounded-xl border border-amber-200/50">
                  <p className="text-amber-900 leading-relaxed text-[15px]">
                    When you open a Vedic-astrology textbook and read <em>&ldquo;Jyotisa is the eye of the Veda&rdquo;</em>, what does that <strong>mean</strong>?
                  </p>
                </div>

                {/* Answer - structured */}
                <div className="relative space-y-3">
                  <p className="text-gray-700 leading-relaxed text-[15px]">
                    The answer is structural: Jyotisa is <strong className="text-amber-800">one of six disciplines</strong> the Vedic tradition treats as essential infrastructure for the Veda itself.
                  </p>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4 text-amber-600" /></div>
                    <p className="text-sm text-amber-900 font-medium">They are called <em>Vedangas</em> — <strong>limbs of the Veda</strong>. Today we place Jyotisa within its proper textual home.</p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* ═══ WHAT YOU'LL LEARN ═══ */}
            <section id="sec-overview" className="scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><GraduationCap className="w-4 h-4 text-amber-700" /></div><span className="text-sm font-semibold text-amber-800 uppercase tracking-wide">What You&apos;ll Learn</span></div>
                {lesson.learningOutcomes && lesson.learningOutcomes.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">By the end of this lesson, you will be able to:</h3>
                    <div className="space-y-2">
                      {lesson.learningOutcomes.map((o: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-amber-50/50 hover:border-amber-200/50 transition-colors">
                          <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i+1}</span>
                          <span className="text-sm text-gray-700 leading-relaxed">{o}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-3 text-center"><BookMarked className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-amber-900">6</div><div className="text-[10px] font-medium text-amber-600">Vedangas</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-3 text-center"><Eye className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-amber-900">Caksuh</div><div className="text-[10px] font-medium text-amber-600">Eye of Veda</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-3 text-center"><Layers className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-amber-900">8</div><div className="text-[10px] font-medium text-amber-600">Sections</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-3 text-center"><Sparkles className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-lg font-bold text-amber-900">{content.quiz.length}</div><div className="text-[10px] font-medium text-amber-600">Quiz Questions</div></div>
                </div>
              </motion.div>
            </section>

            {/* ═══ VEDĀṄGA WHEEL ═══ */}
            <section id="sec-diagram" className="scroll-mt-32">
              <motion.div {...fadeUp}><div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-4 sm:p-6"><VedangaWheel size={620} /></div></motion.div>
            </section>

            {/* ═══ LEARN SECTIONS (§1-§8) ═══ */}
            <section id="sec-hook" className="scroll-mt-32">{parsed && <HookSection hookText={parsed.hookText} />}</section>
            <section id="sec-prereqs" className="scroll-mt-32">{parsed && <PrereqSection prerequisites={parsed.prerequisites} />}</section>
            <section id="sec-vedangas" className="scroll-mt-32">{parsed && <VedangaTableSection vedangaTable={parsed.vedangaTable} />}</section>
            <section id="sec-why-eye" className="scroll-mt-32">{parsed && <WhyEyeSection bodyMetaphors={parsed.bodyMetaphors} />}</section>
            <section id="sec-vs-vedanta" className="scroll-mt-32">{parsed && <VsVedantaSection comparison={parsed.comparison} />}</section>
            <section id="sec-non-coverage" className="scroll-mt-32">{parsed && <NonCoverageSection items={parsed.nonCoverage} />}</section>
            <section id="sec-slokas" className="scroll-mt-32">{parsed && <SlokasSection slokas={parsed.slokas} />}</section>
            <section id="sec-worked" className="scroll-mt-32">{parsed && <WorkedExamplesSection examples={parsed.workedExamples} />}</section>

            {/* ═══ PRACTICE ═══ */}
            <section id="sec-mistakes" className="scroll-mt-32">{parsed && <MistakesSection mistakes={parsed.commonMistakes} />}</section>
            <section id="sec-remember" className="scroll-mt-32">{parsed && <RememberSection items={parsed.rememberItems} />}</section>
            <section id="sec-knowledge" className="scroll-mt-32"><motion.div {...fadeUp}><KnowledgeCheck questions={KNOWLEDGE_CHECKS} title="Check Your Understanding" /></motion.div></section>
            <section id="sec-flashcards" className="scroll-mt-32"><motion.div {...fadeUp}><div className="flex items-center gap-2 mb-4"><Lightbulb className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-amber-900">Review Flashcards</h2><span className="ml-auto text-sm text-amber-500 font-medium">{FLASHCARDS.length} cards</span></div><Flashcard cards={FLASHCARDS} /></motion.div></section>

            {/* ═══ FINISH ═══ */}
            <section id="sec-summary" className="scroll-mt-32">{parsed && <SummarySection paragraphs={parsed.summaryParagraphs} insights={M1C1L1_RECAP_INSIGHTS} />}</section>
            <section id="sec-concepts" className="scroll-mt-32">
              <motion.div {...fadeUp}>
                {/* Enhanced Key Concepts Header */}
                <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5 sm:p-6 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200/50">
                        <Sparkles className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-amber-900">Key Concepts</h2>
                        <p className="text-xs text-gray-500">Master these before the quiz</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      {content.concepts.length} concepts
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-500">Study Progress</span>
                      <span className="text-xs font-bold text-amber-600">0/{content.concepts.length} reviewed</span>
                    </div>
                    <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500" style={{ width: "0%" }} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{content.concepts.map((c, i) => (<motion.div key={c.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}><ConceptCard concept={c} index={i} showDiagram={false} showReference /></motion.div>))}</div>
              </motion.div>
            </section>
            <section id="sec-quiz" className="scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><BrainCircuit className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-amber-900">Test Your Knowledge</h2><span className="ml-auto text-sm text-amber-500 font-medium">{content.quiz.length} questions</span></div>
                {isLocked ? (
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center"><Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" /><h3 className="text-lg font-bold text-gray-700 mb-2">Lesson Locked</h3><Link href="/learn" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors"><Play className="w-4 h-4" /> Go to Learning Path</Link></div>
                ) : (<InteractiveQuiz quiz={content.quiz as any} concepts={content.concepts as any} lessonId={lesson.id} />)}
              </motion.div>
            </section>
            <section id="sec-citations" className="scroll-mt-32">{parsed && <CitationsSection citations={parsed.citations} />}</section>
            <section id="sec-next" className="scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-amber-200/60 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div><p className="text-sm text-amber-600 mb-1 font-medium">🎉 Lesson Complete!</p><p className="text-xl font-bold text-gray-900">Continue to Next Lesson</p><p className="text-sm text-gray-500 mt-1">Next: The Six Vedangas and Their Relationship</p></div>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-amber-600/20 shrink-0">Continue Learning<ChevronRight className="w-4 h-4" /></Link>
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
