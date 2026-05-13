"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight, BookOpen, BrainCircuit,
  RotateCcw, Calculator, Grid, AlertTriangle, Zap, Layers, Lightbulb } from "lucide-react";
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
import InteractiveQuiz, { type QuizQuestion } from "@/components/learn/InteractiveQuiz";

import {
  AlgorithmStepper,
  DebugComparator,
  type AlgorithmStep } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface ConceptMedia { type: string; diagramType?: string; caption?: string; }
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string; media?: ConceptMedia;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: QuizQuestion[]; }

interface Lesson38InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-algorithm", "sec-knowledge", "sec-concepts", "sec-simulator", "sec-debug", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-algorithm", label: "Modulus-8 Engine", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-simulator", label: "Yogini Calculator", type: "practice", group: "Practice" },
  { id: "sec-debug", label: "Macro vs Micro", type: "practice", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "What is the total duration of one Yogini Dasha cycle?", options: ["120 years", "108 years", "36 years", "27 years"], correctIndex: 2, explanation: "The 8 Yoginis sum to 36 years: 1+2+3+4+5+6+7+8 = 36." },
  { id: "kc2", question: "Which Yogini corresponds to remainder 0 in the Modulus-8 calculation?", options: ["Mangala", "Siddha", "Sankata", "Bhadrika"], correctIndex: 2, explanation: "Remainder 0 maps to Sankata (Rahu, 8 years) — the most dangerous Yogini. This is the 'zero-trap.'" },
];

const YOGINI_STEPS: AlgorithmStep[] = [
  {
    id: "y1",
    label: "Identify Birth Nakshatra",
    description: "Find the native's Moon Nakshatra at birth (numbered 1-27).",
    formula: "Nakshatra = 1 to 27",
    inputs: [{ name: "Nakshatra #", value: 10, editable: true }],
    output: "Nakshatra = Magha (#10)" },
  {
    id: "y2",
    label: "Add the Sacred Offset",
    description: "Add 3 to the Nakshatra number (the Parashari constant).",
    formula: "Step = Nakshatra + 3",
    output: "10 + 3 = 13" },
  {
    id: "y3",
    label: "Calculate Modulus-8",
    description: "Divide by 8 and find the remainder (Sesa).",
    formula: "Sesa = (Nakshatra + 3) MOD 8",
    output: "13 MOD 8 = 5" },
  {
    id: "y4",
    label: "Map to Yogini",
    description: "Route the remainder to the Yogini database.",
    formula: "Sesa 5 = Bhadrika (Budha, 5 Varsha)",
    output: "Starting Yogini = Bhadrika (Mercury) — 5 years of intellectual growth" },
];

const YOGINIS = [
  { name: "Mangala", ruler: "Chandra", years: 1, energy: "Auspicious, mental peace", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { name: "Pingala", ruler: "Surya", years: 2, energy: "Heat, distress, ego conflicts", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { name: "Dhanya", ruler: "Guru", years: 3, energy: "Prosperity, wealth, childbirth", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { name: "Bhramari", ruler: "Mangala", years: 4, energy: "Erratic wandering, anger", color: "bg-red-100 text-red-800 border-red-300" },
  { name: "Bhadrika", ruler: "Budha", years: 5, energy: "Excellent results, intellect", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { name: "Ulka", ruler: "Shani", years: 6, energy: "Obstacles, grief, delays", color: "bg-slate-100 text-slate-800 border-slate-300" },
  { name: "Siddha", ruler: "Shukra", years: 7, energy: "Supreme success, romance", color: "bg-pink-100 text-pink-800 border-pink-300" },
  { name: "Sankata", ruler: "Rahu", years: 8, energy: "Severe crisis, deep karma", color: "bg-rose-100 text-rose-900 border-rose-400" },
];

// ─── Helpers ──────────────────────────────────────────────────
const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as const }, transition: { duration: 0.5 } };

// ─── Visual Yogini Data ───────────────────────────────────────
const YOGINI_DATA = [
  { num: 1, name: "Mangala", ruler: "Chandra", rulerEn: "Moon", years: 1, color: "bg-emerald-500", text: "text-emerald-800", light: "bg-emerald-50", border: "border-emerald-300", nakshatras: "Ardra, Punarvasu, Pushya" },
  { num: 2, name: "Pingala", ruler: "Surya", rulerEn: "Sun", years: 2, color: "bg-orange-500", text: "text-orange-800", light: "bg-orange-50", border: "border-orange-300", nakshatras: "Ashlesha, Magha, P. Phalguni" },
  { num: 3, name: "Dhanya", ruler: "Guru", rulerEn: "Jupiter", years: 3, color: "bg-blue-500", text: "text-blue-800", light: "bg-blue-50", border: "border-blue-300", nakshatras: "U. Phalguni, Hasta, Chitra" },
  { num: 4, name: "Bhramari", ruler: "Mangala", rulerEn: "Mars", years: 4, color: "bg-red-500", text: "text-red-800", light: "bg-red-50", border: "border-red-300", nakshatras: "Swati, Vishakha, Anuradha" },
  { num: 5, name: "Bhadrika", ruler: "Budha", rulerEn: "Mercury", years: 5, color: "bg-indigo-500", text: "text-indigo-800", light: "bg-indigo-50", border: "border-indigo-300", nakshatras: "Jyeshtha, Mula, P. Ashadha" },
  { num: 6, name: "Ulka", ruler: "Shani", rulerEn: "Saturn", years: 6, color: "bg-slate-500", text: "text-slate-800", light: "bg-slate-50", border: "border-slate-300", nakshatras: "U. Ashadha, Shravana, Dhanishta" },
  { num: 7, name: "Siddha", ruler: "Shukra", rulerEn: "Venus", years: 7, color: "bg-pink-500", text: "text-pink-800", light: "bg-pink-50", border: "border-pink-300", nakshatras: "Shatabhisha, P. Bhadrapada, U. Bhadrapada" },
  { num: 8, name: "Sankata", ruler: "Rahu", rulerEn: "Rahu", years: 8, color: "bg-rose-500", text: "text-rose-900", light: "bg-rose-50", border: "border-rose-400", nakshatras: "Revati, Ashwini, Bharani" },
];

function YoginiCycleDiagram() {
  const total = YOGINI_DATA.reduce((s, y) => s + y.years, 0);
  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 sm:p-6">
      <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-1">Yogini Chakra — 36 Year Cycle</h3>
      <p className="text-xs text-gray-500 mb-4">Each segment shows the Yogini&apos;s proportional share of the 36-year loop. The cycle repeats at ages 0, 36, 72, and 108.</p>
      <div className="space-y-2.5">
        {YOGINI_DATA.map((y) => {
          const pct = (y.years / total) * 100;
          return (
            <div key={y.name} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ backgroundColor: "transparent" }}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${y.color}`}>{y.num}</span>
              </div>
              <div className="w-20 sm:w-28 shrink-0">
                <div className="text-xs font-bold text-gray-900">{y.name}</div>
                <div className="text-[10px] text-gray-500">{y.rulerEn}</div>
              </div>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
                <motion.div
                  className={`h-full ${y.color} rounded-full`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <div className="w-16 text-right shrink-0">
                <span className="text-xs font-bold text-gray-900">{y.years} yrs</span>
                <span className="text-[10px] text-gray-500 ml-1">({pct.toFixed(1)}%)</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">Full cycle repeats every 36 years</span>
        <span className="text-xs font-bold text-amber-700">Total: 36 Varsha</span>
      </div>
    </div>
  );
}

function NakshatraToYoginiMap() {
  // Pre-calculate mapping for nakshatras 1-27 using (n + 3) mod 8
  const mapping = Array.from({ length: 27 }, (_, i) => {
    const n = i + 1;
    const rem = ((n + 3) % 8);
    const yoginiIdx = rem === 0 ? 7 : rem - 1;
    return { n, yogini: YOGINI_DATA[yoginiIdx] };
  });

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 sm:p-6">
      <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-1">Nakshatra → Yogini Lookup Table</h3>
      <p className="text-xs text-gray-500 mb-4">Formula: (Nakshatra # + 3) mod 8 = Starting Yogini. Find your birth nakshatra to see which Yogini runs first.</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {mapping.map(({ n, yogini }) => (
          <div key={n} className={`rounded-lg border p-2 ${yogini.light} ${yogini.border}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${yogini.color}`}>{yogini.num}</span>
              <span className="text-[10px] font-bold text-gray-700">#{n}</span>
            </div>
            <div className="text-[10px] font-medium text-gray-900 truncate">{yogini.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getAllText(content: LessonContent): string {
  const parts = [content.intro];
  content.sections?.forEach((s) => parts.push(s.content));
  content.concepts.forEach((c) => parts.push(c.description));
  return parts.join(" ");
}

// ─── Yogini Calculator Sub-component ──────────────────────────
function YoginiCalculator() {
  const [nakshatra, setNakshatra] = useState(10);
  const [showResult, setShowResult] = useState(false);

  const calculate = () => {
    setShowResult(true);
  };

  const step1 = nakshatra;
  const step2 = step1 + 3;
  const step3 = step2 % 8;
  const remainder = step3 === 0 ? 8 : step3;
  const yogini = YOGINIS[remainder - 1];

  return (
    <div className="bg-white rounded-2xl border border-indigo-200/60 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-gray-900">Yogini Dasha Calculator</h3>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <label className="text-sm font-medium text-gray-700">Birth Nakshatra # (1-27):</label>
        <input
          type="number"
          min={1}
          max={27}
          value={nakshatra}
          onChange={(e) => {
            setNakshatra(Math.max(1, Math.min(27, parseInt(e.target.value) || 1)));
            setShowResult(false);
          }}
          className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={calculate}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Calculate
        </button>
      </div>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-3"
        >
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase">Step 1</span>
              <p className="text-sm font-mono font-semibold">Nakshatra = {step1}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase">Step 2</span>
              <p className="text-sm font-mono font-semibold">{step1} + 3 = {step2}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase">Step 3</span>
              <p className="text-sm font-mono font-semibold">{step2} mod 8 = {remainder}</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border-2 ${yogini.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">Starting Yogini</span>
                <h4 className="text-lg font-bold">{yogini.name}</h4>
                <p className="text-sm opacity-90">Ruler: {yogini.ruler} • Duration: {yogini.years} Varsha</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold">{yogini.years}</span>
                <span className="text-xs block opacity-70">Years</span>
              </div>
            </div>
            <p className="text-sm mt-2 font-medium">Energy: {yogini.energy}</p>
          </div>

          {remainder === 8 && (
            <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-sm text-rose-800">
                <strong>SANKATA INITIALIZATION WARNING:</strong> Remainder 0 maps to Sankata (Rahu, 8 years of crisis).
                This is the most karmically intense starting point in Yogini Dasha.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────
export default function Lesson38Interactive({ lesson, lessonProgress }: Lesson38InteractiveProps) {
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

  const isLocked = lessonProgress?.status === "locked";
  const isCompleted = lessonProgress?.status === "completed";
  const hasSections = content.sections && content.sections.length > 0;
  const sectionProgress = hasSections
    ? Math.round((completedSections.size / content.sections!.length) * 100)
    : 0;

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
            onNavigate={scrollToSection}
            progress={Math.max(progress, sectionProgress)}
            className="w-64 shrink-0 sticky top-4 self-start h-fit"
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0 pr-4 sm:pr-6 lg:pr-8">

            {/* ─── HERO ─── */}
            <section id="hero" className="mb-6 scroll-mt-32">
              <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-800 text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Learning Path
              </Link>

              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <GraduationCap className="w-5 h-5 text-violet-500" />
                  <span className="text-xs font-bold text-violet-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
                  <span className="text-xs text-violet-300">·</span>
                  <span className="text-xs font-medium text-violet-400">Module 11: Conditional Dashas</span>
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

                <h1 className="text-3xl sm:text-4xl font-bold text-violet-900 mb-3">{lesson.title}</h1>

                <div className="flex items-center gap-4 flex-wrap">
                  <ReadingTime text={allText} />
                  <span className="text-violet-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600">
                    <Layers className="w-3.5 h-3.5" /> {content.sections?.length || 0} Sections
                  </span>
                  <span className="text-violet-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600">
                    <Lightbulb className="w-3.5 h-3.5" /> {content.concepts.length} Concepts
                  </span>
                  <span className="text-violet-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-600">
                    <BrainCircuit className="w-3.5 h-3.5" /> {content.quiz.length} Questions
                  </span>
                </div>

                {hasSections && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-violet-100 rounded-full overflow-hidden max-w-[250px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${sectionProgress}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-xs text-violet-600 font-medium">{completedSections.size}/{content.sections?.length} viewed</span>
                  </div>
                )}
              </motion.div>
            </section>

            {/* ─── OVERVIEW ─── */}
            <section id="sec-overview" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800 uppercase tracking-wide">Lesson Overview</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">{content.intro}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                    <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">36</div>
                    <div className="text-[10px] text-amber-600">Varsha Cycle</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                    <Grid className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">8</div>
                    <div className="text-[10px] text-amber-600">Yoginis</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                    <Calculator className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">+3</div>
                    <div className="text-[10px] text-amber-600">Parashari Offset</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                    <Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">MOD 8</div>
                    <div className="text-[10px] text-amber-600">Formula</div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Sections */}
            {content.sections?.map((section, idx) => (
              <section
                key={section.id}
                id={idx === 0 ? "sec-definition" : idx === 1 ? "sec-etymology" : idx === 2 ? "sec-algorithm" : `sec-${idx}`}
                className="mb-6 scroll-mt-32"
                onClick={() => markSectionComplete(section.id)}
              >
                <motion.div {...fadeUp}>
                  <LessonSection section={section} index={idx} />
                </motion.div>
              </section>
            ))}

            {/* 8 Yogini Cycle Diagram */}
            <section id="sec-concepts" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Grid className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-bold text-violet-900">The 8 Yogini-Shakti Frequencies</h2>
                </div>
                <YoginiCycleDiagram />
                <div className="mt-4">
                  <NakshatraToYoginiMap />
                </div>
              </motion.div>
            </section>

            {/* Algorithm Stepper */}
            <section id="sec-algorithm" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-bold text-violet-900">Interactive: Modulus-8 Engine</h2>
                </div>
                <AlgorithmStepper steps={YOGINI_STEPS} title="Yogini Sesa-ganana" />
              </motion.div>
            </section>

            {/* Yogini Calculator */}
            <section id="sec-simulator" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <YoginiCalculator />
              </motion.div>
            </section>

            {/* Debug Comparator */}
            <section id="sec-debug" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <DebugComparator
                  scenario="A user is running a 16-year Jupiter Mahadasha (prosperity) but experiencing a terrible year of legal trouble and depression. They ask: 'If my chart is so good, why is my life falling apart RIGHT NOW?'"
                  amateurOutput={{
                    title: "Vimshottari Only Prediction",
                    prediction: "Your Jupiter period is excellent. Expect prosperity and wisdom. Current troubles are temporary and insignificant.",
                    riskLevel: "medium" }}
                  professionalOutput={{
                    title: "Grahvani Yogini + Vimshottari Synthesis",
                    prediction: "Your macro-climate (Vimshottari) is highly prosperous (Jupiter). However, you are currently passing through the micro-storm of Sankata Yogini (Rahu). This is a temporary, intense 8-year psychological bottleneck. The underlying foundation is secure, but you must endure this short-term turbulence.",
                    overrideReason: "Yogini Dasha reveals the micro-weather that Vimshottari's 20-year window cannot detect." }}
                  whyItMatters="Without Yogini, your software cannot answer the most frustrating question in Jyotish: 'If my chart is so good, why is my life terrible RIGHT NOW?' Yogini is the microscope that reveals the hidden storms."
                />
              </motion.div>
            </section>

            {/* Knowledge Checks */}
            <section id="sec-knowledge" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-bold text-violet-900">Knowledge Check</h2>
                </div>
                <KnowledgeCheck questions={KNOWLEDGE_CHECKS} />
              </motion.div>
            </section>

            {/* Recap */}
            <section id="sec-recap" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <RecapSection title="Lesson Recap" items={[
                  { id: 1, title: "Yogini Dasha is a 36-year high-freque...", summary: "Yogini Dasha is a 36-year high-frequency loop, not a linear timeline." },
                  { id: 2, title: "Formula: (Nakshatra + 3) MOD 8 = Star...", summary: "Formula: (Nakshatra + 3) MOD 8 = Starting Yogini." },
                  { id: 3, title: "Remainder 0 = Sankata (the zero-trap)...", summary: "Remainder 0 = Sankata (the zero-trap). Always handle this edge case." },
                  { id: 4, title: "Yogini reveals MICRO-storms hidden by...", summary: "Yogini reveals MICRO-storms hidden by Vimshottari's MACRO windows." },
                  { id: 5, title: "The 8 Yoginis loop continuously: Age ...", summary: "The 8 Yoginis loop continuously: Age 0, 36, 72, 108 repeat the same sequence." }
                ]} />
              </motion.div>
            </section>

            {/* Quiz */}
            <section id="sec-quiz" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-bold text-violet-900">Test Your Knowledge</h2>
                </div>
                <InteractiveQuiz quiz={content.quiz} concepts={content.concepts} lessonId={lesson.id} />
              </motion.div>
            </section>

            {/* ─── NEXT LESSON CTA ─── */}
            <section id="sec-next" className="scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-amber-200/60 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-amber-600 mb-1 font-medium">Next in Module 11</p>
                      <p className="text-xl font-bold text-gray-900">Kalachakra Dasha — The Wheel of Time</p>
                      <p className="text-sm text-gray-500 mt-1">Master the quantum physics engine of Jyotish with non-linear jumps and Deha-Jiva anchors.</p>
                    </div>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-amber-600/20 shrink-0">
                      Continue <ChevronRight className="w-4 h-4" />
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
