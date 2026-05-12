"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight,
  BookOpen, Layers, Sparkles, BrainCircuit, Target,
  Lightbulb, Play, Home, LayoutGrid, Anchor, PieChart,
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

interface Lesson3InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-distinction", "sec-domains", "sec-groupings", "sec-knowledge", "sec-concepts", "sec-flashcards", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "What is a Bhava?", type: "definition", group: "Learn" },
  { id: "sec-distinction", label: "Bhavas vs Rashis", type: "mechanics", group: "Learn" },
  { id: "sec-domains", label: "The 12 Domains", type: "mechanics", group: "Learn" },
  { id: "sec-groupings", label: "Structural Groupings", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-flashcards", label: "Flashcards", type: "flashcards", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const FLASHCARDS = [
  { id: "f1", front: "What does 'Bhava' literally mean in Sanskrit?", back: "'State of being,' 'existence,' or 'manifestation.' In English, we call them the 12 Houses — the departments of life where planetary energy manifests.", category: "Core Definition" },
  { id: "f2", front: "What is the Lagna (Ascendant)?", back: "The exact degree of the Zodiac rising on the Eastern horizon at the moment of birth. It locks in the 1st House and anchors the entire chart.", category: "Mechanics" },
  { id: "f3", front: "Name the 4 Structural Groupings of Bhavas", back: "Kendras (1,4,7,10) — Angular Pillars · Trikonas (1,5,9) — Trines of Luck · Dusthanas (6,8,12) — Suffering · Upachayas (3,6,10,11) — Growth", category: "Architecture" },
  { id: "f4", front: "Which Bhava signifies Mother, Home, and Real Estate?", back: "The 4th Bhava (Matru). It represents the mother, vehicles, property, inner peace, and the heart/chest region of the body.", category: "Domains" },
  { id: "f5", front: "What is the key difference between Rashis and Bhavas?", back: "Rashis are FIXED in space (the cosmic backdrop). Bhavas are tied to Earth's rotation and generated by birth time + location (the Lagna sets the 1st house).", category: "Logic" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "What does the Sanskrit word 'Bhava' translate to?", options: ["Planet", "State of being / existence", "Star cluster", "Division of time"], correctIndex: 1, explanation: "'Bhava' literally means 'state of being' or 'existence.' The 12 Bhavas are the 12 departments of life where planetary energy grounds into human experience." },
  { id: "kc2", question: "What determines the starting point (1st House) of the Bhava chart?", options: ["The Sun's position", "The Moon's Nakshatra", "The Lagna (Ascendant) on the Eastern horizon", "The current date"], correctIndex: 2, explanation: "The Lagna is the exact degree of the Zodiac rising on the Eastern horizon at birth. It sets the 1st House, and all other houses are calculated relative to it." },
  { id: "kc3", question: "Which house grouping is known as the 'Trines of Luck'?", options: ["Kendras (1, 4, 7, 10)", "Trikonas (1, 5, 9)", "Dusthanas (6, 8, 12)", "Upachayas (3, 6, 10, 11)"], correctIndex: 1, explanation: "Trikonas (1, 5, 9) are the most auspicious houses. They represent blessings, natural talents, protective energy, and dharma." },
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
export default function Lesson3Interactive({ lesson, lessonProgress }: Lesson3InteractiveProps) {
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
          <div className="flex-1 min-w-0 pr-4 sm:pr-6 lg:pr-8">

            {/* ─── HERO ─── */}
            <section id="hero" className="mb-6 scroll-mt-32">
              <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Learning Path
              </Link>

              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <GraduationCap className="w-5 h-5 text-teal-500" />
                  <span className="text-xs font-bold text-teal-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
                  <span className="text-xs text-teal-300">·</span>
                  <span className="text-xs font-medium text-teal-400">Module 1: Foundations</span>
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

                <h1 className="text-3xl sm:text-4xl font-bold text-teal-900 mb-3">{lesson.title}</h1>

                <div className="flex items-center gap-4 flex-wrap">
                  <ReadingTime text={allText} />
                  <span className="text-teal-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600">
                    <Layers className="w-3.5 h-3.5" /> {content.sections?.length || 0} Sections
                  </span>
                  <span className="text-teal-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600">
                    <Lightbulb className="w-3.5 h-3.5" /> {content.concepts.length} Concepts
                  </span>
                  <span className="text-teal-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600">
                    <BrainCircuit className="w-3.5 h-3.5" /> {content.quiz.length} Questions
                  </span>
                </div>

                {/* Progress bar */}
                {hasSections && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-teal-100 rounded-full overflow-hidden max-w-[250px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${sectionProgress}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-xs text-teal-600 font-medium">{completedSections.size}/{content.sections?.length} viewed</span>
                  </div>
                )}
              </motion.div>
            </section>

            {/* ─── KEY TAKEAWAYS OVERVIEW ─── */}
            <section id="sec-overview" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Introduction</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6" dangerouslySetInnerHTML={{ __html: formatMarkdown(content.intro) }} />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <Home className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">12</div>
                    <div className="text-[10px] text-amber-600">Bhavas (Houses)</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <Anchor className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">Lagna</div>
                    <div className="text-[10px] text-amber-600">Ascendant Anchor</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <LayoutGrid className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">4</div>
                    <div className="text-[10px] text-amber-600">Structural Groups</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center">
                    <PieChart className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">360°</div>
                    <div className="text-[10px] text-amber-600">Full Circle</div>
                  </div>
                </div>

                {lessonProgress && lessonProgress.bestScore > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4 flex-wrap">
                    <span className="text-xs text-gray-500">Previous attempt:</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      Best: {lessonProgress.bestScore}%
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {lessonProgress.attemptsCount} attempt{lessonProgress.attemptsCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </motion.div>

              <CalloutBlock variant="important" className="mt-5">
                This lesson covers the <strong>departmental mapping</strong> of human life in Vedic Astrology.
                If the Rashis are the cosmic scenery and the Grahas are the actors, the Bhavas are the <strong>stages where the drama unfolds</strong>.
                Every life domain — from your body to your bank account to your spirituality — is mapped here.
              </CalloutBlock>
            </section>

            {/* ─── SECTION 1: DEFINITION — What is a Bhava? ─── */}
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
                  Think of Bhavas as <strong>the 12 departments of a corporation</strong>.
                  The Grahas (planets) are the employees, the Rashis (signs) are the office decor —
                  but the Bhavas are the actual departments (HR, Finance, Operations, etc.) where work gets done.
                  A strong department makes the employee productive; a weak department creates struggle.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 2: DISTINCTION — Bhavas vs Rashis ─── */}
            {content.sections?.[1] && (
              <section id="sec-distinction" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![1].id)} className="relative">
                    <LessonSection section={content.sections![1]} index={1} />
                    {completedSections.has(`sec-s${content.sections![1].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="mistake" className="mt-4">
                  <strong>The #1 beginner mistake:</strong> Confusing the sign (Rashi) with the house (Bhava).
                  Just because your 1st House is in Aries does <em>not</em> mean Aries <em>is</em> your 1st House.
                  The Lagna (rising degree) sets the 1st house — the sign there is simply the "flavor" of that house.
                  The house is the container; the sign is the wallpaper.
                </CalloutBlock>
                <CalloutBlock variant="tip" className="mt-3">
                  <strong>Memory trick:</strong> Rashis are <strong>where</strong> (fixed cosmic addresses).
                  Bhavas are <strong>what</strong> (life domains tied to birth time).
                  Grahas are <strong>who</strong> (the actors). Rashi = scenery, Bhava = stage, Graha = actor.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 3: DOMAINS — The 12 Domains ─── */}
            {content.sections?.[2] && (
              <section id="sec-domains" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![2].id)} className="relative">
                    <LessonSection section={content.sections![2]} index={2} />
                    {completedSections.has(`sec-s${content.sections![2].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="tip" className="mt-4">
                  <strong>Body-part mapping trick:</strong> The houses map to body parts from head to toe —
                  1st (head), 2nd (face), 3rd (hands/shoulders), 4th (heart/chest), 5th (stomach), 6th (intestines),
                  7th (lower abdomen), 8th (genitals), 9th (hips/thighs), 10th (knees), 11th (calves), 12th (feet).
                  A planet in a house can affect the corresponding body part.
                </CalloutBlock>
              </section>
            )}

            {/* ─── SECTION 4: GROUPINGS — Structural Groupings ─── */}
            {content.sections?.[3] && (
              <section id="sec-groupings" className="mb-6 scroll-mt-32">
                <motion.div {...fadeUp}>
                  <div onClick={() => markSectionComplete(content.sections![3].id)} className="relative">
                    <LessonSection section={content.sections![3]} index={3} />
                    {completedSections.has(`sec-s${content.sections![3].id}`) && (
                      <div className="absolute top-4 right-12"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                    )}
                  </div>
                </motion.div>
                <CalloutBlock variant="wisdom" className="mt-4">
                  Think of the groupings as <strong>zoning laws</strong> in a city —
                  Kendras are the downtown core (high visibility, high activity).
                  Trikonas are the wealthy residential districts (auspicious, protected).
                  Dusthanas are the industrial zones (hardship but transformation).
                  Upachayas are the developing suburbs (improve over time with effort).
                </CalloutBlock>
                <CalloutBlock variant="tip" className="mt-3">
                  <strong>Pro tip for chart reading:</strong> Malefic planets (Mars, Saturn) often do well in Upachayas (3, 6, 10, 11)
                  because these houses reward effort and endurance. Benefic planets (Jupiter, Venus) shine in Trikonas (1, 5, 9)
                  where their protective, expansive nature is amplified.
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
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-bold text-teal-900">Key Concepts</h2>
                  <span className="ml-auto text-sm text-teal-500 font-medium">{content.concepts.length} concepts</span>
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
                  <Lightbulb className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-bold text-teal-900">Review Flashcards</h2>
                  <span className="ml-auto text-sm text-teal-500 font-medium">{FLASHCARDS.length} cards</span>
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
                  <BrainCircuit className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-bold text-teal-900">Test Your Knowledge</h2>
                  <span className="ml-auto text-sm text-teal-500 font-medium">{content.quiz.length} questions</span>
                </div>
                {isLocked ? (
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
                    <Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Lesson Locked</h3>
                    <p className="text-gray-500 mb-4">Complete the previous lessons to unlock this one.</p>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors">
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
                      <p className="text-xl font-bold text-gray-900">Continue to The Nakshatras</p>
                      <p className="text-sm text-gray-500 mt-1">Next: Learn about the 27 Lunar Mansions that provide the microscopic DNA of the chart.</p>
                    </div>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }}
                      className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-teal-600/20 shrink-0"
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
