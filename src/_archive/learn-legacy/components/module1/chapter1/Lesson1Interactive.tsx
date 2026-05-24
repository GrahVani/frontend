"use client";
import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, CheckCircle2, Lock, ChevronRight, BookOpen, Layers, Sparkles, BrainCircuit, Eye, Lightbulb, Play, BookMarked, Clock, GitCompare, ScrollText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Lesson, type LessonProgressData } from "@/lib/api";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import ScrollProgress from "@/components/learn/interactive/ScrollProgress";
import LessonSidebar from "@/components/learn/interactive/LessonSidebar";
import LessonHeader, { sanitizeTitle } from "@/components/learn/interactive/LessonHeader";
import TTSButton from "@/components/learn/interactive/TTSButton";
import Flashcard from "@/components/learn/interactive/Flashcard";
import KnowledgeCheck from "@/components/learn/interactive/KnowledgeCheck";

function renderOutcomeText(text: string): React.ReactNode {
  const cleanText = sanitizeTitle(text);
  const parts = cleanText.split(/(\*[^*]+\*|`[^`]+`)/);
  return parts.map((part, idx) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={idx} className="italic text-[#8B5A2B] font-serif font-semibold">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <em key={idx} className="italic text-[#8B5A2B] font-serif font-semibold">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}
import ConceptCard from "@/components/learn/ConceptCard";
import InteractiveQuiz from "@/components/learn/InteractiveQuiz";
import VedangaWheel from "./VedangaWheel";
import { SECTION_IDS, buildSidebarSections, FLASHCARDS, KNOWLEDGE_CHECKS } from "./Lesson1Config";
import { parseLessonBody } from "@/lib/lesson-parser";
import { HookSection, PrereqSection, VedangaTableSection, WhyEyeSection, VsVedantaSection, NonCoverageSection, SlokasSection, WorkedExamplesSection, MistakesSection, RememberSection, SummarySection, CitationsSection, type RecapInsight } from "./Lesson1Sections";
import { learningTokens } from "@/design-tokens";

// Types
interface Concept { id: number; title: string; description: string; icon?: string; keyTakeaway?: string; proTip?: string; commonMistake?: string; media?: { type: string; diagramType?: string; caption?: string }; }
interface LessonContent { intro: string; sections?: unknown[]; concepts: Concept[]; quiz: unknown[]; }

interface Props { lesson: Lesson; lessonProgress: LessonProgressData | null; }

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as `${number}px` }, transition: { duration: 0.5 } };

const M1C1L1_RECAP_INSIGHTS: RecapInsight[] = [
  { icon: Layers, title: "Six Vedangas", description: "Jyotisha is one of six supporting disciplines — the limbs of the Veda.", badge: "Foundation", badgeColor: "amber" },
  { icon: Eye, title: "Eye of the Veda", description: "Jyotisha provides temporal vision — 'vedasya cakshuh' means the tradition sees time.", badge: "Core Metaphor", badgeColor: "violet", highlight: true },
  { icon: Clock, title: "Ritual Timing", description: "Original purpose: determine the correct moment for Vedic rituals to retain efficacy.", badge: "Origin", badgeColor: "green" },
  { icon: GitCompare, title: "Vedanga ≠ Vedanta", description: "Vedanga = 6 supporting tools. Vedanta = philosophical culmination (Upanishadic).", badge: "Critical", badgeColor: "red" },
  { icon: ScrollText, title: "Source Texts", description: "Paniniya Shiksha 41-42 & Vedanga Jyotisha (Lagadha) anchor this framework.", badge: "Classical", badgeColor: "blue" },
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

  // Use backend data for intro hook, fallback to parsed content
  const introHook = parsed?.hookText
    ? parsed.hookText.split(".").slice(0, 2).join(".") + "."
    : lesson.subtitle || "Jyotisa is one of six classical Vedangas — limbs of the Veda. This lesson places it within its proper textual home.";

  return (
    <>
      <ScrollProgress />
      <div className="mx-auto pb-20">
        <div className="flex gap-6">
          {/* Sidebar */}
          <LessonSidebar sections={buildSidebarSections(parsed)} activeSection={activeSection} completedSections={completedSections} onNavigate={scrollTo} progress={progress} showProgress={false} className="w-64 shrink-0 sticky top-4 self-start h-fit" />

          {/* Main column */}
          <div className="flex-1 min-w-0 space-y-5 overflow-x-hidden">
            {/* Header layout card inside main column */}
            <div className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm px-5 sm:px-6 py-2">
              <LessonHeader
                title={lesson.title}
                titleDevanagari={lesson.titleDevanagari}
                lessonNumber={lesson.sequenceOrder}
                moduleNumber={lesson.module}
                chapterNumber={lesson.chapter}
                chapterTitle={lesson.subtitle || "What Jyotisha Is"}
                isCompleted={isCompleted}
                isLocked={isLocked}
                allText={allText}
                conceptCount={content.concepts.length}
                quizCount={content.quiz.length}
                bestScore={lessonProgress?.bestScore || 0}
                attemptsCount={lessonProgress?.attemptsCount || 0}
                progress={progress}
              />
            </div>
            {/* Intro card */}
            <motion.div {...fadeUp} className="mt-4 relative overflow-hidden bg-white rounded-2xl border border-[#E7D6B8] shadow-sm p-6 sm:p-7">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFE0B2]/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

              {/* Header row */}
              <div className="flex items-center justify-between mb-5 relative pb-3 border-b border-[#E7D6B8]/40">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#8B5A2B]" />
                  <span className="text-xs font-extrabold text-[#8B5A2B] uppercase tracking-widest">Introduction</span>
                </div>
                <TTSButton text={introHook} size="sm" label="Listen" />
              </div>

              {/* Hook text: clean, editorial, large font size, no nested box */}
              <div className="relative mb-5">
                <p className="text-black text-lg sm:text-xl font-semibold leading-relaxed tracking-tight">
                  When you open a Vedic-astrology textbook and read <span className="italic text-[#8B5A2B] font-serif">&ldquo;Jyotisha is the eye of the Veda&rdquo;</span>, what does that mean?
                </p>
              </div>

              {/* Body text & Callout */}
              <div className="relative space-y-4 text-[15px] leading-relaxed text-black">
                <p className="font-medium">
                  The answer is structural: Jyotisha is one of six classical disciplines that the Vedic tradition treats as the essential infrastructure for the Veda itself.
                </p>

                {/* Elegant left-border callout instead of a nested boxed card */}
                <div className="border-l-[3px] border-[#C9A24D] pl-4 py-1.5 mt-2 bg-[#FFF3E0]/15 rounded-r-xl">
                  <p className="text-black font-semibold text-[14px] leading-relaxed">
                    These supporting disciplines are called <span className="italic text-[#8B5A2B] font-serif">Vedangas</span> (limbs of the Veda). Today, we place Jyotisha within its proper textual home.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ═══ WHAT YOU'LL LEARN ═══ */}
            <section id="sec-overview" className="scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-lg bg-[#FAEFD8] flex items-center justify-center"><GraduationCap className="w-4 h-4 text-[#8B5A2B]" /></div><span className="text-sm font-bold text-[#2D2419] uppercase tracking-wide">What You&apos;ll Learn</span></div>
                {lesson.learningOutcomes && lesson.learningOutcomes.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-xs font-bold text-[#5C3D26] uppercase tracking-wide mb-3">By the end of this lesson, you will be able to:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {lesson.learningOutcomes.map((o: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-[#E65100]/60 bg-transparent hover:bg-[#FFF3E0]/15 hover:border-[#E65100] transition-colors last:md:col-span-2">
                          <span className="w-6 h-6 rounded-full bg-[#C9A24D] text-[#1A0A05] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                          <span className="text-sm text-[#4A3020] leading-relaxed font-semibold">{renderOutcomeText(o)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-[#FEFAEA] to-[#FFF3E0]/50 border border-[#E7D6B8] rounded-xl p-3 text-center"><BookMarked className="w-5 h-5 text-[#EF6C00] mx-auto mb-1" /><div className="text-lg font-bold text-[#1A0A05]">6</div><div className="text-[10px] font-bold text-[#795548]">Vedangas</div></div>
                  <div className="bg-gradient-to-br from-[#FEFAEA] to-[#FFF3E0]/50 border border-[#E7D6B8] rounded-xl p-3 text-center"><Eye className="w-5 h-5 text-[#EF6C00] mx-auto mb-1" /><div className="text-lg font-bold text-[#1A0A05]">Eye</div><div className="text-[10px] font-bold text-[#795548]">Cakshuh</div></div>
                  <div className="bg-gradient-to-br from-[#FEFAEA] to-[#FFF3E0]/50 border border-[#E7D6B8] rounded-xl p-3 text-center"><Layers className="w-5 h-5 text-[#EF6C00] mx-auto mb-1" /><div className="text-lg font-bold text-[#1A0A05]">8</div><div className="text-[10px] font-bold text-[#795548]">Sections</div></div>
                  <div className="bg-gradient-to-br from-[#FEFAEA] to-[#FFF3E0]/50 border border-[#E7D6B8] rounded-xl p-3 text-center"><Sparkles className="w-5 h-5 text-[#EF6C00] mx-auto mb-1" /><div className="text-lg font-bold text-[#1A0A05]">{content.quiz.length}</div><div className="text-[10px] font-bold text-[#795548]">Quiz Questions</div></div>
                </div>
              </motion.div>
            </section>

            {/* ═══ VEDANgGA WHEEL ═══ */}
            <section id="sec-diagram" className="scroll-mt-32">
              <motion.div {...fadeUp}><div className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm p-4 sm:p-6"><VedangaWheel size={620} /></div></motion.div>
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
            <section id="sec-flashcards" className="scroll-mt-32"><motion.div {...fadeUp}><div className="flex items-center gap-2 mb-4"><Lightbulb className="w-5 h-5 text-[#EF6C00]" /><h2 className="text-xl font-bold text-[#2D2419]">Review Flashcards</h2><span className="ml-auto text-sm text-[#795548] font-semibold">{FLASHCARDS.length} cards</span></div><Flashcard cards={FLASHCARDS} /></motion.div></section>

            {/* ═══ FINISH ═══ */}
            <section id="sec-summary" className="scroll-mt-32">{parsed && <SummarySection paragraphs={parsed.summaryParagraphs} insights={M1C1L1_RECAP_INSIGHTS} />}</section>
            <section id="sec-concepts" className="scroll-mt-32">
              <motion.div {...fadeUp}>
                {/* Enhanced Key Concepts Header */}
                <div className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm p-5 sm:p-6 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE0B2] to-[#FFF3E0] flex items-center justify-center border border-[#FFE0B2]/50">
                        <Sparkles className="w-5 h-5 text-[#795548]" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#2D2419]">Key Concepts</h2>
                        <p className="text-xs text-[#5C3D26] font-medium">Master these before the quiz</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#795548] bg-[#FFF3E0] px-3 py-1 rounded-full border border-[#FFE0B2]">
                      {content.concepts.length} concepts
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-[#5C3D26]">Study Progress</span>
                      <span className="text-xs font-bold text-[#795548]">0/{content.concepts.length} reviewed</span>
                    </div>
                    <div className="h-2 bg-[#F2E6D0] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#C9A24D] to-[#EF6C00] rounded-full transition-all duration-500" style={{ width: "0%" }} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{content.concepts.map((c, i) => (<motion.div key={c.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}><ConceptCard concept={c} index={i} showDiagram={false} showReference /></motion.div>))}</div>
              </motion.div>
            </section>
            <section id="sec-quiz" className="scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><BrainCircuit className="w-5 h-5 text-[#EF6C00]" /><h2 className="text-xl font-bold text-[#2D2419]">Test Your Knowledge</h2><span className="ml-auto text-sm text-[#795548] font-semibold">{content.quiz.length} questions</span></div>
                {isLocked ? (
                  <div className="bg-[#FEFAEA]/40 rounded-2xl border border-[#E7D6B8] p-8 text-center"><Lock className="w-10 h-10 text-[#5C3D26] mx-auto mb-3" /><h3 className="text-lg font-bold text-[#2D2419] mb-2">Lesson Locked</h3><Link href="/learn" className={learningTokens.components.buttons.primary}><Play className="w-4 h-4" /> Go to Learning Path</Link></div>
                ) : (<InteractiveQuiz quiz={content.quiz as any} concepts={content.concepts as any} lessonId={lesson.id} />)}
              </motion.div>
            </section>
            <section id="sec-citations" className="scroll-mt-32">{parsed && <CitationsSection citations={parsed.citations} />}</section>
            <section id="sec-next" className="scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-[#E7D6B8] shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-[#EF6C00] mb-1 font-bold">🎉 Lesson Complete!</p>
                      <p className="text-xl font-bold text-black">Continue to Next Lesson</p>
                      {lesson.postrequisites && lesson.postrequisites.length > 0 ? (
                        <div className="mt-2">
                          <p className="text-[15px] sm:text-base text-black font-medium">Next lessons in this path:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {lesson.postrequisites.map((postreq, idx) => (
                              <span key={idx} className="text-sm px-2.5 py-1 rounded-lg bg-[#FFF3E0] border border-[#FFE0B2] text-black font-semibold">
                                {postreq}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[15px] sm:text-base text-black mt-1 font-medium">Next: The Six Vedangas and Their Relationship</p>
                      )}
                    </div>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="flex items-center gap-2 px-6 py-3 bg-[#C9A24D] hover:bg-[#D4AD5A] active:bg-[#B8923F] text-[#1A0A05] font-bold rounded-xl transition-all border border-[#9C7A2F] shadow-md shadow-[#C9A24D]/20 shrink-0">Continue Learning<ChevronRight className="w-4 h-4" /></Link>
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
