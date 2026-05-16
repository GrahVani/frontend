"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2, Lock, ChevronRight,
  BookOpen, Layers, Sparkles, BrainCircuit, Target,
  Lightbulb, Play, Compass, Globe,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Lesson, type LessonProgressData } from "@/lib/api";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useReadingProgress } from "@/hooks/useReadingProgress";

import ScrollProgress from "@/components/learn/interactive/ScrollProgress";
import LessonSidebar, { type SidebarSection } from "@/components/learn/interactive/LessonSidebar";
import LessonHeader from "@/components/learn/interactive/LessonHeader";
import CalloutBlock from "@/components/learn/interactive/CalloutBlock";
import Flashcard from "@/components/learn/interactive/Flashcard";
import KnowledgeCheck from "@/components/learn/interactive/KnowledgeCheck";
import TTSButton from "@/components/learn/interactive/TTSButton";

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

interface Lesson1InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-etymology", "sec-mechanics", "sec-knowledge", "sec-concepts", "sec-flashcards", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-etymology", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-mechanics", label: "Mechanics", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-flashcards", label: "Flashcards", type: "flashcards", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];



const FLASHCARDS = [
  { id: "f1", front: "What is Celestial Geometry in Vedic Astrology?", back: "The mathematical mapping of the Bha-Chakra — dividing the 360° circle into 12 equal segments of 30° called Rashis (Signs).", category: "Core Definition" },
  { id: "f2", front: "What does 'Rashi' literally mean in Sanskrit?", back: "A \"heap,\" \"cluster,\" or \"quantity\" — representing a specific 30° quantity of space containing a distinct cluster of cosmic energy.", category: "Etymology" },
  { id: "f3", front: "Name the 4 Tattvas (Elements) and their Sanskrit names", back: "Agni (Fire) · Prithvi (Earth) · Vayu (Air) · Jala (Water) — they cycle in a repeating 1-2-3-4 pattern across the 12 signs.", category: "Mechanics" },
  { id: "f4", front: "What are the 3 Modalities and their Sanskrit names?", back: "Chara (Movable) · Sthira (Fixed) · Dwisvabhava (Dual) — they cycle in a repeating 1-2-3 pattern describing how each sign's energy moves.", category: "Mechanics" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "How many degrees does each Rashi span in the zodiac?", options: ["15°", "30°", "45°", "60°"], correctIndex: 1, explanation: "Each Rashi is exactly 30° wide. 360° ÷ 12 = 30° per segment. This is the fundamental 30-Degree Rule of Celestial Geometry." },
  { id: "kc2", question: "Which element does Aries (Mesha) belong to?", options: ["Earth (Prithvi)", "Water (Jala)", "Fire (Agni)", "Air (Vayu)"], correctIndex: 2, explanation: "Aries is a Fire (Agni) sign — action-oriented, transformative, and energetic. Fire signs are Aries, Leo, and Sagittarius." },
  { id: "kc3", question: "What is the Bha-Chakra?", options: ["A type of Dasha system", "The Zodiac Wheel (360° circle)", "A planetary conjunction", "A Nakshatra division"], correctIndex: 1, explanation: "Bha-Chakra literally means the 'Zodiac Wheel' — the 360° circle of space surrounding the Earth divided into 12 Rashis." },
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
export default function Lesson1Interactive({ lesson, lessonProgress }: Lesson1InteractiveProps) {
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
          <div className="flex-1 min-w-0 ">

            {/* ─── HERO ─── */}
            <LessonHeader
              title={lesson.title}
              lessonNumber={lesson.sequenceOrder}
              moduleNumber={lesson.module}
              chapterNumber={lesson.chapter}
              chapterTitle={lesson.chapter > 0 ? `What Jyotiṣa Is` : undefined}
              isCompleted={isCompleted}
              isLocked={isLocked}
              allText={allText}
              conceptCount={content.concepts.length}
              quizCount={content.quiz.length}
              bestScore={lessonProgress?.bestScore || 0}
              attemptsCount={lessonProgress?.attemptsCount || 0}
            />

            {/* ─── KEY TAKEAWAYS OVERVIEW ─── */}
            <section id="sec-overview" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-amber-700" />
                    </div>
                    <span className="text-sm font-semibold text-amber-800 uppercase tracking-wide">Introduction</span>
                  </div>
                  <TTSButton text={content.intro} size="sm" label="Listen" />
                </div>
                <p className="text-amber-900 leading-relaxed text-lg mb-6" dangerouslySetInnerHTML={{ __html: formatMarkdown(content.intro) }} />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-3 text-center">
                    <Globe className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-amber-900">360°</div>
                    <div className="text-[10px] font-medium text-amber-600">Full Circle</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-3 text-center">
                    <Compass className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-amber-900">12</div>
                    <div className="text-[10px] font-medium text-amber-600">Rashis (Signs)</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-3 text-center">
                    <Target className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-amber-900">30°</div>
                    <div className="text-[10px] font-medium text-amber-600">Per Rashi</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-3 text-center">
                    <Sparkles className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-amber-900">4</div>
                    <div className="text-[10px] font-medium text-amber-600">Elements</div>
                  </div>
                </div>

                {lessonProgress && lessonProgress.bestScore > 0 && (
                  <div className="mt-5 pt-4 border-t border-amber-100 flex items-center gap-4 flex-wrap">
                    <span className="text-xs text-amber-600 font-medium">Previous attempt:</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      Best: {lessonProgress.bestScore}%
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {lessonProgress.attemptsCount} attempt{lessonProgress.attemptsCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </motion.div>

              <CalloutBlock variant="important" className="mt-4">
                This lesson covers the <strong>foundational coordinate system</strong> of Vedic Astrology.
                Every prediction, every chart analysis, and every timing technique you will ever learn is built on top of this 12-sign framework.
                Master this, and everything else becomes logical.
              </CalloutBlock>
            </section>

            {/* ─── SECTION 1: DEFINITION ─── */}
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
                  Think of the Rashis as the <strong>permanent address system</strong> of the cosmos.
                  Just like GPS coordinates don&apos;t change — the signs are fixed in space.
                  The planets are the &ldquo;travelers&rdquo; moving through these addresses.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 2: ETYMOLOGY ─── */}
            {content.sections?.[1] && (
              <section id="sec-etymology" className="mb-6 scroll-mt-32">
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

            {/* ─── SECTION 3: MECHANICS ─── */}
            {content.sections?.[2] && (
              <section id="sec-mechanics" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![2].id)} className="relative">
                    <LessonSection section={content.sections![2]} index={2} />
                    {completedSections.has(`sec-s${content.sections![2].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="mistake" className="mt-4">
                  <strong>Don&apos;t confuse Rashis with Western constellations!</strong> Vedic Rashis are <em>mathematical divisions</em> (exactly 30° each).
                  Western star constellations have irregular, overlapping boundaries.
                  This distinction is crucial for accurate chart computation.
                </CalloutBlock>
                <CalloutBlock variant="tip" className="mt-3">
                  <strong>Memory trick for the element cycle:</strong> Think &ldquo;FEWA&rdquo; — Fire, Earth, Water... wait, it&apos;s actually <strong>Fire → Earth → Air → Water</strong> repeating 3 times across 12 signs. The sequence never breaks.
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
                      <p className="text-xl font-bold text-gray-900">Continue to The Navagraha</p>
                      <p className="text-sm text-gray-500 mt-1">Next: Learn about the 9 planetary variables that govern the chart.</p>
                    </div>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }}
                      className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-amber-600/20 shrink-0"
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
