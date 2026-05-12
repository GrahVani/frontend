"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, ChevronRight, BookOpen, Sparkles,
  BrainCircuit, Zap, Compass, Eye, RotateCcw, GitBranch, Heart, Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Lesson, type LessonProgressData } from "@/lib/api";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useReadingProgress } from "@/hooks/useReadingProgress";

import ScrollProgress from "@/components/learn/interactive/ScrollProgress";
import LessonSidebar, { type SidebarSection } from "@/components/learn/interactive/LessonSidebar";
import KnowledgeCheck from "@/components/learn/interactive/KnowledgeCheck";
import ReadingTime from "@/components/learn/interactive/ReadingTime";
import RecapSection from "@/components/learn/interactive/RecapSection";
import LessonSection, { type Section } from "@/components/learn/LessonSection";
import ConceptCard from "@/components/learn/ConceptCard";
import InteractiveQuiz from "@/components/learn/InteractiveQuiz";

import {
  DebugComparator } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface ConceptMedia { type: string; diagramType?: string; caption?: string; }
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string; media?: ConceptMedia;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: unknown[]; }

interface Lesson39InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-paths", "sec-deha-jiva", "sec-gatis", "sec-knowledge", "sec-concepts", "sec-debug", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-paths", label: "Savya / Apasavya", type: "mechanics", group: "Learn" },
  { id: "sec-deha-jiva", label: "Deha & Jiva", type: "mechanics", group: "Learn" },
  { id: "sec-gatis", label: "The Three Jumps", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-debug", label: "Why Apps Avoid Kalachakra", type: "practice", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "Kalachakra Dasha tracks life progression through which entities?", options: ["9 Grahas", "12 Rashis", "27 Nakshatras", "108 Padas"], correctIndex: 1, explanation: "Kalachakra is Rashi-gatika — sign-based, not Graha-based." },
  { id: "kc2", question: "Which Gati signifies total life upheaval?", options: ["Mandooka (Frog)", "Markata (Monkey)", "Simhavalokana (Lion)", "None of the above"], correctIndex: 2, explanation: "Simhavalokana Gati is the Lion's Glance — a massive leap across the zodiac causing total destruction or unprecedented rise." },
];

const GATI_TYPES = [
  {
    name: "Mandooka Gati",
    subtitle: "The Frog Jump",
    icon: "🐸",
    math: "Skips ONE sign",
    example: "Virgo → Cancer (skips Leo)",
    severity: "Mid-Level",
    prediction: "Sudden distress, rapid location change, jarring relationship shift",
    color: "bg-amber-50 border-amber-300 text-amber-900",
    badge: "bg-amber-200 text-amber-800" },
  {
    name: "Markata Gati",
    subtitle: "The Monkey Jump",
    icon: "🐒",
    math: "Jumps BACKWARD one sign",
    example: "Leo → Cancer (backward)",
    severity: "Reversal Alert",
    prediction: "Sudden instability, loss of position, return to previous life state",
    color: "bg-orange-50 border-orange-300 text-orange-900",
    badge: "bg-orange-200 text-orange-800" },
  {
    name: "Simhavalokana Gati",
    subtitle: "The Lion's Glance",
    icon: "🦁",
    math: "MASSIVE leap across zodiac",
    example: "Pisces → Scorpio (6 signs)",
    severity: "CRITICAL",
    prediction: "Total life upheaval — near-death OR absolute power. Old life destroyed instantly.",
    color: "bg-red-50 border-red-400 text-red-900",
    badge: "bg-red-200 text-red-800" },
];

// ─── Helpers ──────────────────────────────────────────────────
const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as const }, transition: { duration: 0.5 } };

function getAllText(content: LessonContent): string {
  const parts = [content.intro];
  content.sections?.forEach((s) => parts.push(s.content));
  content.concepts.forEach((c) => parts.push(c.description));
  return parts.join(" ");
}

// ─── Deha-Jiva Visualizer ─────────────────────────────────────
function DehaJivaVisualizer() {
  const [activeTab, setActiveTab] = useState<"deha" | "jiva">("deha");

  return (
    <div className="bg-white rounded-2xl border border-indigo-200/60 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-gray-900">Deha & Jiva Anchors</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("deha")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "deha"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Deha (Body)
        </button>
        <button
          onClick={() => setActiveTab("jiva")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "jiva"
              ? "bg-violet-600 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Jiva (Soul)
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border-2 ${
          activeTab === "deha"
            ? "bg-indigo-50 border-indigo-200"
            : "bg-violet-50 border-violet-200"
        }`}
      >
        {activeTab === "deha" ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <span className="text-lg">🫀</span>
              </div>
              <div>
                <h4 className="font-bold text-indigo-900">Deha — The Body</h4>
                <p className="text-xs text-indigo-600">Starting sign of Kalachakra sequence</p>
              </div>
            </div>
            <ul className="space-y-2 mt-3">
              <li className="flex items-start gap-2 text-sm text-indigo-800">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                Dictates physical health and vitality
              </li>
              <li className="flex items-start gap-2 text-sm text-indigo-800">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                When malefics transit Deha → physical crisis alert
              </li>
              <li className="flex items-start gap-2 text-sm text-indigo-800">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                Represents the vessel that carries the soul
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <span className="text-lg">🔥</span>
              </div>
              <div>
                <h4 className="font-bold text-violet-900">Jiva — The Soul</h4>
                <p className="text-xs text-violet-600">Ending sign of Kalachakra sequence</p>
              </div>
            </div>
            <ul className="space-y-2 mt-3">
              <li className="flex items-start gap-2 text-sm text-violet-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                Dictates inner happiness and spiritual state
              </li>
              <li className="flex items-start gap-2 text-sm text-violet-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                When malefics transit Jiva → psychological crisis alert
              </li>
              <li className="flex items-start gap-2 text-sm text-violet-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                Represents the ultimate trajectory of the native&apos;s life
              </li>
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────
export default function Lesson39Interactive({ lesson, lessonProgress }: Lesson39InteractiveProps) {
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

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
      <ScrollProgress />

      <section id="hero" className="relative bg-gradient-to-br from-violet-900 via-slate-900 to-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-indigo-500 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-violet-500 blur-3xl" />
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-indigo-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Learning Path
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-400 text-sm font-semibold tracking-wide uppercase">Intermediate — Module 11.3</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl">{lesson.title}</h1>
          <p className="text-indigo-200 text-lg max-w-2xl leading-relaxed">{content.intro}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-indigo-300">
            <ReadingTime text={allText} />
            <span className="flex items-center gap-1"><Compass className="w-4 h-4" /> Non-linear timeline</span>
          </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          <div className="hidden lg:block w-72 shrink-0 sticky top-4 self-start h-fit">
            <LessonSidebar
              sections={SIDEBAR_SECTIONS}
              activeSection={activeSection}
              completedSections={completedSections}
              onNavigate={scrollToSection}
              progress={progress}
            />
          </div>

          <div className="flex-1 min-w-0">
            <section id="sec-overview" className="mb-10 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white rounded-2xl border border-indigo-200/60 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Lesson Overview</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{content.intro}</p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-3 text-center border border-indigo-200">
                    <RotateCcw className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">12</div>
                    <div className="text-[10px] text-indigo-600">Rashi Stations</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-3 text-center border border-indigo-200">
                    <GitBranch className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">2</div>
                    <div className="text-[10px] text-indigo-600">Path Arrays</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-3 text-center border border-indigo-200">
                    <Zap className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">3</div>
                    <div className="text-[10px] text-indigo-600">Gati Types</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-3 text-center border border-indigo-200">
                    <Eye className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">D-9</div>
                    <div className="text-[10px] text-indigo-600">Required Chart</div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Sections */}
            {content.sections?.map((section, idx) => (
              <section
                key={section.id}
                id={idx === 0 ? "sec-definition" : idx === 1 ? "sec-paths" : idx === 2 ? "sec-deha-jiva" : idx === 3 ? "sec-gatis" : idx === 4 ? "sec-debug" : idx === 5 ? "sec-synthesis" : `sec-${idx}`}
                className="mb-6 scroll-mt-32"
                onClick={() => markSectionComplete(section.id)}
              >
                <motion.div {...fadeUp}>
                  <LessonSection section={section} index={idx} />
                </motion.div>
              </section>
            ))}

            {/* Deha-Jiva Visualizer */}
            <section id="sec-deha-jiva" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <DehaJivaVisualizer />
              </motion.div>
            </section>

            {/* Gati Cards */}
            <section id="sec-gatis" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">The Three Gatis (Jumps)</h2>
                </div>
                <div className="space-y-4">
                  {GATI_TYPES.map((gati, idx) => (
                    <motion.div
                      key={gati.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 }}
                      className={`p-5 rounded-xl border-2 ${gati.color}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl shrink-0">{gati.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-lg">{gati.name}</h4>
                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${gati.badge}`}>
                              {gati.severity}
                            </span>
                          </div>
                          <p className="text-sm font-medium opacity-80 mb-2">{gati.subtitle}</p>
                          <div className="grid md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-semibold">Math: </span>
                              <span className="opacity-80">{gati.math}</span>
                            </div>
                            <div>
                              <span className="font-semibold">Example: </span>
                              <span className="opacity-80">{gati.example}</span>
                            </div>
                          </div>
                          <p className="text-sm mt-2 font-medium">{gati.prediction}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Debug Comparator */}
            <section id="sec-debug" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <DebugComparator
                  scenario="A native asks: 'Why did I suddenly quit my 10-year career and move to India at age 34?'"
                  amateurOutput={{
                    title: "Standard Dasha Prediction",
                    prediction: "Your current Dasha lord is Mercury in the 10th house. This should bring career stability and intellectual growth. The move is irrational and against your chart.",
                    riskLevel: "medium" }}
                  professionalOutput={{
                    title: "Grahvani Kalachakra Detection",
                    prediction: "SIMHAVALOKANA GATI DETECTED at age 34. Your Kalachakra timeline made a Lion's Glance leap from your 10th house (career) sign to your 9th house (Dharma/long travel) sign. This is not irrational — it is mathematically programmed total life upheaval. The old career HAD to be destroyed for the new life to begin.",
                    overrideReason: "Kalachakra's non-linear Gati detection reveals quantum leaps that linear Dashas (Vimshottari/Yogini) cannot model." }}
                  whyItMatters="Without Kalachakra, your software calls major life transformations 'irrational' or 'unpredictable.' With Kalachakra, you can warn the native YEARS in advance: 'Age 34: Total restructuring programmed. Prepare for teleportation.'"
                />
              </motion.div>
            </section>

            {/* Knowledge Checks */}
            <section id="sec-knowledge" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2>
                </div>
                <KnowledgeCheck questions={KNOWLEDGE_CHECKS} />
              </motion.div>
            </section>

            {/* Concepts */}
            <section id="sec-concepts" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Key Concepts</h2>
                </div>
                <div className="space-y-4">
                  {content.concepts.map((concept, idx) => (
                    <ConceptCard key={concept.id} concept={concept} index={idx} />
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Recap */}
            <section id="sec-recap" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <RecapSection title="Lesson Recap" items={[
                  { id: 1, title: "Kalachakra is Rashi-gatika (sign-base...", summary: "Kalachakra is Rashi-gatika (sign-based), not Graha-based." },
                  { id: 2, title: "Savya = clockwise path. Apasavya = co...", summary: "Savya = clockwise path. Apasavya = counter-clockwise path." },
                  { id: 3, title: "Deha = starting sign (physical health...", summary: "Deha = starting sign (physical health). Jiva = ending sign (soul trajectory)." },
                  { id: 4, title: "Three Gatis: Mandooka (skip 1), Marka...", summary: "Three Gatis: Mandooka (skip 1), Markata (backward 1), Simhavalokana (massive leap)." },
                  { id: 5, title: "Requires D-9 Navamsha data — most bir...", summary: "Requires D-9 Navamsha data — most birth-time sensitive Dasha in Jyotish." }
                ]} />
              </motion.div>
            </section>

            {/* Quiz */}
            <section id="sec-quiz" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Test Your Knowledge</h2>
                </div>
                <InteractiveQuiz quiz={content.quiz} concepts={content.concepts} lessonId={lesson.id} />
              </motion.div>
            </section>

            {/* Next */}
            <section id="sec-next" className="mb-12 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-indigo-200 text-sm mb-1">Next Module</p>
                    <p className="text-xl font-bold">Module 12: Planetary States & Exception Handling</p>
                    <p className="text-indigo-200 text-sm mt-1">Master Baladi Avasthas (Power Throttle), Lajjitadi Avasthas (Mood Engine), and Neecha Bhanga (Exception Handler).</p>
                  </div>
                  <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shrink-0 flex items-center gap-2">
                    Continue <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
