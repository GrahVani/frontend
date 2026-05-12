"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, ChevronRight, BookOpen, Layers,
  Sparkles, BrainCircuit, Target, Clock, Sun, Moon, Shield, Zap,
  Calculator } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Lesson, type LessonProgressData } from "@/lib/api";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useReadingProgress } from "@/hooks/useReadingProgress";

import ScrollProgress from "@/components/learn/interactive/ScrollProgress";
import LessonSidebar, { type SidebarSection } from "@/components/learn/interactive/LessonSidebar";
import ReadingTime from "@/components/learn/interactive/ReadingTime";
import KnowledgeCheck from "@/components/learn/interactive/KnowledgeCheck";
import RecapSection from "@/components/learn/interactive/RecapSection";
import LessonSection, { type Section } from "@/components/learn/LessonSection";
import ConceptCard from "@/components/learn/ConceptCard";
import InteractiveQuiz from "@/components/learn/InteractiveQuiz";

import {
  AlgorithmStepper,
  LogicGateVisualizer,
  DebugComparator,
  FormulaBlock,
  type AlgorithmStep } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface ConceptMedia { type: string; diagramType?: string; caption?: string; }
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string; media?: ConceptMedia;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: unknown[]; }

interface Lesson37InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-etymology", "sec-algorithm-gate", "sec-algorithm-matrix", "sec-knowledge", "sec-concepts", "sec-simulator", "sec-debug", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-etymology", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-algorithm-gate", label: "Activation Gate", type: "mechanics", group: "Learn" },
  { id: "sec-algorithm-matrix", label: "108-Year Matrix", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-simulator", label: "Gate Simulator", type: "practice", group: "Practice" },
  { id: "sec-debug", label: "Amateur vs Pro", type: "practice", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "What is the total lifespan of Ashtottari Dasha?", options: ["120 Varsha", "108 Varsha", "36 Varsha", "27 Varsha"], correctIndex: 1, explanation: "Ashtottari = 108 years. Vimshottari = 120 years. Yogini = 36 years." },
  { id: "kc2", question: "Which Graha is completely excluded from Ashtottari?", options: ["Rahu", "Ketu", "Saturn", "Mercury"], correctIndex: 1, explanation: "Ketu is Nishkasitah (deleted) from Ashtottari. Only 8 Grahas are used." },
  { id: "kc3", question: "A native born at 3 PM during Krishna Paksha. Which engine fires?", options: ["Vimshottari", "Ashtottari", "Yogini", "Kalachakra"], correctIndex: 1, explanation: "3 PM = Diva (day). Krishna Paksha = waning. Diva + Krishna = Ashtottari Activation Gate TRUE." },
];

const ACTIVATION_GATE_STEPS: AlgorithmStep[] = [
  {
    id: "step1",
    label: "Check Kala (Time of Birth)",
    description: "Determine if the native was born during Diva (Sunrise to Sunset) or Ratri (Sunset to Sunrise).",
    formula: "Kala = 'Diva' OR 'Ratri'",
    inputs: [{ name: "Birth Time", value: "14:30", editable: true }],
    output: "Kala = Diva (Daytime)" },
  {
    id: "step2",
    label: "Check Paksha (Lunar Phase)",
    description: "Determine if the Moon was Shukla Paksha (Waxing) or Krishna Paksha (Waning) at birth.",
    formula: "Paksha = 'Shukla' OR 'Krishna'",
    inputs: [{ name: "Tithi Number", value: "18", editable: true }],
    output: "Paksha = Krishna (Waning)" },
  {
    id: "step3",
    label: "Activation Gate Decision",
    description: "Run the Boolean check to determine which Dasha engine to execute.",
    formula: "IF (Kala == 'Diva' AND Paksha == 'Krishna') OR (Kala == 'Ratri' AND Paksha == 'Shukla') THEN Ashtottari ELSE Vimshottari",
    isDecision: true,
    condition: "(Diva AND Krishna) OR (Ratri AND Shukla)",
    nextStepTrue: "step4",
    nextStepFalse: "step5" },
  {
    id: "step4",
    label: "Execute Ashtottari Engine",
    description: "The gate returned TRUE. Switch to the 108-year Ashtottari timeline.",
    output: "Ashtottari Engine ACTIVE. Ketu excluded. 8-Graha sequence initialized." },
  {
    id: "step5",
    label: "Execute Vimshottari Engine",
    description: "The gate returned FALSE. Use the standard 120-year Vimshottari timeline.",
    output: "Vimshottari Engine ACTIVE (default). 9-Graha sequence." },
];

const GATE_VARIABLES = [
  { name: "Diva", label: "Day Birth", value: true, description: "Sunrise to Sunset" },
  { name: "Ratri", label: "Night Birth", value: false, description: "Sunset to Sunrise" },
  { name: "Shukla", label: "Waxing Moon", value: false, description: "Growing Moon" },
  { name: "Krishna", label: "Waning Moon", value: true, description: "Fading Moon" },
];

const GATE_GATES = [
  { type: "AND" as const, inputs: ["Diva", "Krishna"], output: "ConditionA", label: "Day + Waning" },
  { type: "AND" as const, inputs: ["Ratri", "Shukla"], output: "ConditionB", label: "Night + Waxing" },
  { type: "OR" as const, inputs: ["ConditionA", "ConditionB"], output: "AshtottariTrigger", label: "Either condition" },
];

// ─── Helpers ──────────────────────────────────────────────────
const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as const }, transition: { duration: 0.5 } };

function getAllText(content: LessonContent): string {
  const parts = [content.intro];
  content.sections?.forEach((s) => parts.push(s.content));
  content.concepts.forEach((c) => parts.push(c.description));
  return parts.join(" ");
}

// ─── Component ────────────────────────────────────────────────
export default function Lesson37Interactive({ lesson, lessonProgress }: Lesson37InteractiveProps) {
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

      {/* Hero */}
      <section id="hero" className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-indigo-500 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-violet-500 blur-3xl" />
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-indigo-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Learning Path
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-400 text-sm font-semibold tracking-wide uppercase">Intermediate — Module 11.1</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl">{lesson.title}</h1>
          <p className="text-indigo-200 text-lg max-w-2xl leading-relaxed">{content.intro}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-indigo-300">
            <ReadingTime text={allText} />
            <span className="flex items-center gap-1"><Target className="w-4 h-4" /> Intermediate Level</span>
          </div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-72 shrink-0 sticky top-4 self-start h-fit">
            <LessonSidebar
              sections={SIDEBAR_SECTIONS}
              activeSection={activeSection}
              completedSections={completedSections}
              onNavigate={scrollToSection}
              progress={progress}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Overview */}
            <section id="sec-overview" className="mb-10 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white rounded-2xl border border-indigo-200/60 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Lesson Overview</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{content.intro}</p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-3 text-center border border-indigo-200">
                    <Clock className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">108</div>
                    <div className="text-[10px] text-indigo-600">Varsha Total</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-3 text-center border border-indigo-200">
                    <Sun className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">8</div>
                    <div className="text-[10px] text-indigo-600">Grahas Used</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-3 text-center border border-indigo-200">
                    <Moon className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">2</div>
                    <div className="text-[10px] text-indigo-600">Boolean Checks</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-3 text-center border border-indigo-200">
                    <Shield className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">1</div>
                    <div className="text-[10px] text-indigo-600">Override Rule</div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Sections */}
            {content.sections?.map((section, idx) => (
              <section
                key={section.id}
                id={
                  idx === 0 ? "sec-definition" :
                  idx === 1 ? "sec-etymology" :
                  idx === 2 ? "sec-algorithm-gate" :
                  idx === 3 ? "sec-algorithm-matrix" :
                  idx === 4 ? "sec-debug" :
                  idx === 5 ? "sec-synthesis" :
                  `sec-${idx}`
                }
                className="mb-6 scroll-mt-32"
                onClick={() => markSectionComplete(section.id)}
              >
                <motion.div {...fadeUp}>
                  <LessonSection section={section} index={idx} />
                </motion.div>
              </section>
            ))}

            {/* Algorithm Stepper */}
            <section id="sec-algorithm-gate" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Interactive: Activation Gate Algorithm</h2>
                </div>
                <AlgorithmStepper
                  steps={ACTIVATION_GATE_STEPS}
                  title="Ashtottari Pravesh Dvara"
                />
              </motion.div>
            </section>

            {/* Logic Gate Visualizer */}
            <section id="sec-simulator" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Interactive: Gate Simulator</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Toggle the variables below to see how the Activation Gate evaluates in real time.
                  Try different combinations of Day/Night and Waxing/Waning.
                </p>
                <LogicGateVisualizer
                  variables={GATE_VARIABLES}
                  gates={GATE_GATES}
                  finalOutput={{
                    condition: "Ashtottari Activation Gate",
                    resultTrue: "GATE OPEN → Ashtottari Dasha Engine ACTIVE (108-year timeline)",
                    resultFalse: "GATE CLOSED → Vimshottari Dasha Engine ACTIVE (120-year timeline)" }}
                  title="Activation Gate Simulator"
                />
              </motion.div>
            </section>

            {/* 108-Year Matrix Formula */}
            <section id="sec-algorithm-matrix" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">The 108-Year Matrix</h2>
                </div>
                <FormulaBlock
                  formula={`Ashtottari Varsha-vibhaga (Year Distribution):
─────────────────────────────────────
Surya (Sun)      : 6 Varsha
Chandra (Moon)   : 15 Varsha
Mangala (Mars)   : 8 Varsha
Budha (Mercury)  : 17 Varsha
Shani (Saturn)   : 10 Varsha
Guru (Jupiter)   : 19 Varsha
Rahu             : 12 Varsha
Shukra (Venus)   : 21 Varsha
─────────────────────────────────────
TOTAL            : 108 Varsha

Krama (Sequence):
Surya → Chandra → Mangala → Budha → Shani → Guru → Rahu → Shukra`}
                  label="Ashtottari Matrix"
                />
              </motion.div>
            </section>

            {/* Debug Comparator */}
            <section id="sec-debug" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <DebugComparator
                  scenario="A user is 35 years old and consulting your software for a career forecast. They were born during the day with a waning moon."
                  amateurOutput={{
                    title: "Vimshottari Only Prediction",
                    prediction: "You are in a severe 19-year Saturn period. Expect delays, struggle, and heavy manual labor. Career advancement is unlikely.",
                    riskLevel: "high" }}
                  professionalOutput={{
                    title: "Grahvani Ashtottari Override",
                    prediction: "CRITICAL OVERRIDE: Ashtottari Engine Active. You are actually in a massive 19-year Jupiter period. Expect explosive wealth, teaching opportunities, and executive expansion.",
                    overrideReason: "User born Diva + Krishna Paksha → Activation Gate TRUE → Vimshottari overridden → 108-year sequence calculated" }}
                  whyItMatters="Without the conditional logic gate, your software would give the user the EXACT OPPOSITE prediction — turning a period of fortune into a period of fear. This is why amateur astrology apps fail professionals."
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
                  { id: 1, title: "Ashtottari Dasha is a 108-year condit...", summary: "Ashtottari Dasha is a 108-year conditional timeline, NOT an alternative to Vimshottari." },
                  { id: 2, title: "The Activation Gate checks Diva/Ratri...", summary: "The Activation Gate checks Diva/Ratri and Shukla/Krishna Paksha before firing." },
                  { id: 3, title: "Ketu is completely excluded. Only 8 G...", summary: "Ketu is completely excluded. Only 8 Grahas are used." },
                  { id: 4, title: "Shukra receives the largest share: 21...", summary: "Shukra receives the largest share: 21 Varsha (19.4% of life)." },
                  { id: 5, title: "Without this gate, software produces ...", summary: "Without this gate, software produces the EXACT OPPOSITE prediction for eligible natives." }
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
                <InteractiveQuiz
                  quiz={content.quiz}
                  concepts={content.concepts}
                  lessonId={lesson.id}
                />
              </motion.div>
            </section>

            {/* Next Lesson */}
            <section id="sec-next" className="mb-12 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-indigo-200 text-sm mb-1">Next in Module 11</p>
                    <p className="text-xl font-bold">Yogini Dasha — The 36-Year Microscope</p>
                    <p className="text-indigo-200 text-sm mt-1">Learn the high-frequency 36-year loop that reveals micro-storms hidden by Vimshottari.</p>
                  </div>
                  <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }}
                    className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shrink-0 flex items-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
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
