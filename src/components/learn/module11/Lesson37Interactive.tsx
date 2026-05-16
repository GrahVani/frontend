"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight, BookOpen, Layers,
  Sparkles, BrainCircuit, Target, Lightbulb, Clock, Sun, Moon, Shield, Zap,
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
import InteractiveQuiz, { type QuizQuestion } from "@/components/learn/InteractiveQuiz";
import AshtottariCycleWheel from "@/components/learn/diagrams/AshtottariCycleWheel";
import ActivationGateFlowchart from "./ActivationGateFlowchart";

import {
  AlgorithmStepper,
  LogicGateVisualizer,
  DebugComparator,
  type AlgorithmStep } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface ConceptMedia { type: string; diagramType?: string; caption?: string; }
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string; media?: ConceptMedia;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: QuizQuestion[]; }

interface Lesson37InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-etymology", "sec-flowchart", "sec-algorithm-gate", "sec-algorithm-matrix", "sec-knowledge", "sec-concepts", "sec-simulator", "sec-debug", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-etymology", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-flowchart", label: "Decision Flowchart", type: "mechanics", group: "Learn" },
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
  { id: "kc1", question: "What is the total lifespan of Ashtottari Dasha?", options: ["120 Varsha", "108 Varsha", "36 Varsha", "27 Varsha"], correctIndex: 1, explanation: "Ashtottari = 108 years. Vimshottari = 120 years. Yogini = 36 years. 108 is sacred: 27 Nakshatras × 4 Pādas = 108 divisions of the zodiac." },
  { id: "kc2", question: "Which Graha is completely excluded from Ashtottari?", options: ["Rahu", "Ketu", "Saturn", "Mercury"], correctIndex: 1, explanation: "Ketu is Niṣkāsitah (excluded) from Ashtottari. Only 8 Grahas operate. Ketu's 3 nakshatras (Aśvinī, Maghā, Mūlā) are also excluded — births in those nakshatras fall back to Vimshottari." },
  { id: "kc3", question: "A native born at 3 PM during Krishna Paksha. Which engine fires?", options: ["Vimshottari", "Ashtottari", "Yogini", "Kalachakra"], correctIndex: 1, explanation: "3 PM = Diva (day). Krishna Paksha = waning. Under the Diva/Paksha variant rule: Diva + Krishna = Ashtottari Activation Gate TRUE. Note: BPHS also prescribes Ashtottari when Rāhu occupies a Kendra or Trikona from the Lagna Lord." },
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

// ─── Visual Ashtottari Data ───────────────────────────────────
const ASHTOTTARI_PLANETS = [
  { id: "surya", name: "Surya", en: "Sun", years: 6, color: "bg-orange-500", text: "text-orange-700", light: "bg-orange-50", border: "border-orange-200" },
  { id: "chandra", name: "Chandra", en: "Moon", years: 15, color: "bg-slate-400", text: "text-slate-700", light: "bg-slate-50", border: "border-slate-200" },
  { id: "mangala", name: "Mangala", en: "Mars", years: 8, color: "bg-red-500", text: "text-red-700", light: "bg-red-50", border: "border-red-200" },
  { id: "budha", name: "Budha", en: "Mercury", years: 17, color: "bg-emerald-500", text: "text-emerald-700", light: "bg-emerald-50", border: "border-emerald-200" },
  { id: "shani", name: "Shani", en: "Saturn", years: 10, color: "bg-indigo-500", text: "text-indigo-700", light: "bg-indigo-50", border: "border-indigo-200" },
  { id: "guru", name: "Guru", en: "Jupiter", years: 19, color: "bg-amber-500", text: "text-amber-700", light: "bg-amber-50", border: "border-amber-200" },
  { id: "rahu", name: "Rahu", en: "Rahu", years: 12, color: "bg-violet-500", text: "text-violet-700", light: "bg-violet-50", border: "border-violet-200" },
  { id: "shukra", name: "Shukra", en: "Venus", years: 21, color: "bg-pink-500", text: "text-pink-700", light: "bg-pink-50", border: "border-pink-200" },
];

const NAKSHATRA_ALLOCATION = [
  { planet: "Surya", nakshatras: ["Krittika", "Uttara Phalguni", "Uttara Ashadha"], color: "bg-orange-100 text-orange-800 border-orange-300" },
  { planet: "Chandra", nakshatras: ["Rohini", "Hasta", "Shravana"], color: "bg-slate-100 text-slate-800 border-slate-300" },
  { planet: "Mangala", nakshatras: ["Mrigashira", "Chitra", "Dhanishta"], color: "bg-red-100 text-red-800 border-red-300" },
  { planet: "Budha", nakshatras: ["Ardra", "Swati", "Shatabhisha"], color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { planet: "Shani", nakshatras: ["Pushya", "Anuradha", "Uttara Bhadrapada"], color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { planet: "Guru", nakshatras: ["Punarvasu", "Vishakha", "Purva Bhadrapada"], color: "bg-amber-100 text-amber-800 border-amber-300" },
  { planet: "Rahu", nakshatras: ["Ashlesha", "Jyeshtha", "Revati"], color: "bg-violet-100 text-violet-800 border-violet-300" },
  { planet: "Shukra", nakshatras: ["Bharani", "Purva Phalguni", "Purva Ashadha"], color: "bg-pink-100 text-pink-800 border-pink-300" },
];

const EXCLUDED_NAKSHATRAS = ["Ashwini", "Magha", "Mula"];

function AshtottariTimeline() {
  const total = ASHTOTTARI_PLANETS.reduce((s, p) => s + p.years, 0);
  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 sm:p-6">
      <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-4">Ashtottari Varsha-vibhaga (108-Year Timeline)</h3>
      <div className="space-y-3">
        {ASHTOTTARI_PLANETS.map((p) => {
          const pct = (p.years / total) * 100;
          return (
            <div key={p.id} className="flex items-center gap-3">
              <div className="w-20 sm:w-24 shrink-0">
                <div className="text-xs font-bold text-gray-900">{p.name}</div>
                <div className="text-[10px] text-gray-500">{p.en}</div>
              </div>
              <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                <motion.div
                  className={`h-full ${p.color} rounded-lg`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <span className="absolute inset-0 flex items-center px-2 text-xs font-bold text-white drop-shadow-md">
                  {p.years} yrs ({pct.toFixed(1)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">Sequence: Surya → Chandra → Mangala → Budha → Shani → Guru → Rahu → Shukra</span>
        <span className="text-xs font-bold text-amber-700">Total: 108 Varsha</span>
      </div>
    </div>
  );
}

function NakshatraAllocationGrid() {
  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 sm:p-6">
      <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-1">Nakshatra Allocation (Janma Nakshatra → Starting Dasha)</h3>
      <p className="text-xs text-gray-500 mb-4">Each planet rules 3 nakshatras (24 total). Birth nakshatra determines the starting Mahādashā. Aśvinī, Maghā, and Mūlā belong to Ketu in Vimshottari — since Ketu is deleted from Ashtottari, there is no starting dasha for these nakshatras. Births in these 3 nakshatras use Vimshottari instead.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {NAKSHATRA_ALLOCATION.map((group) => (
          <div key={group.planet} className={`rounded-xl border-2 p-3 ${group.color}`}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">{group.planet}</div>
            <div className="space-y-1">
              {group.nakshatras.map((n) => (
                <div key={n} className="text-xs font-medium">• {n}</div>
              ))}
            </div>
          </div>
        ))}
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-3">
          <div className="text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-500">Excluded (Ketu)</div>
          <div className="space-y-1">
            {EXCLUDED_NAKSHATRAS.map((n) => (
              <div key={n} className="text-xs font-medium text-gray-500 line-through">• {n}</div>
            ))}
          </div>
          <div className="text-[10px] text-red-600 mt-1.5 font-medium">→ No starting Mahādashā possible — falls back to Vimshottari</div>
        </div>
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
          <div className="flex-1 min-w-0 ">

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
                {/* ── Sacred 108 Infographic ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="sm:col-span-4 bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 rounded-xl p-4 border border-violet-200/60">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🕉️</span>
                      <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Why 108? — The Sacred Number</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white/70 rounded-lg p-2.5 text-center border border-violet-100">
                        <div className="text-lg font-bold text-violet-800">27 × 4</div>
                        <div className="text-[10px] text-violet-600">Nakshatras × Pādas</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-2.5 text-center border border-violet-100">
                        <div className="text-lg font-bold text-violet-800">108</div>
                        <div className="text-[10px] text-violet-600">Japa Mālā Beads</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-2.5 text-center border border-violet-100">
                        <div className="text-lg font-bold text-violet-800">108</div>
                        <div className="text-[10px] text-violet-600">Upanishads</div>
                      </div>
                      <div className="bg-white/70 rounded-lg p-2.5 text-center border border-violet-100">
                        <div className="text-lg font-bold text-violet-800">12 × 9</div>
                        <div className="text-[10px] text-violet-600">Rāshis × Grahas</div>
                      </div>
                    </div>
                    <p className="text-[10px] text-violet-600 mt-2 text-center italic">Ashtottari maps the entire life to 108 years — a microcosm of the zodiac&apos;s 108 nakshatra pādas.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                    <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">108</div>
                    <div className="text-[10px] text-amber-600">Varsha Total</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                    <Sun className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">8</div>
                    <div className="text-[10px] text-amber-600">Grahas Used</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                    <Moon className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">2</div>
                    <div className="text-[10px] text-amber-600">Boolean Checks</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                    <Shield className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">1</div>
                    <div className="text-[10px] text-amber-600">Override Rule</div>
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
                  idx === 2 ? "sec-content-gate" :
                  idx === 3 ? "sec-content-matrix" :
                  idx === 4 ? "sec-content-debug" :
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

            {/* Decision Flowchart — Visual decision tree */}
            <section id="sec-flowchart" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-violet-900">Decision Flowchart: When Does Ashtottari Fire?</h2>
                </div>
                <div className="bg-amber-50/50 rounded-xl border border-amber-200/60 p-4 mb-4">
                  <p className="text-sm text-amber-800 leading-relaxed">
                    <strong>Note:</strong> Classical texts describe <strong>two</strong> conditions for Ashtottari activation. 
                    The <strong>primary rule</strong> from Bṛhat Parāśara Horā Śāstra (BPHS) checks Rāhu&apos;s position relative to the 
                    Lagna Lord. A <strong>secondary variant</strong> used in some traditions checks the time of birth (Diva/Ratri) 
                    and lunar phase (Śukla/Kṛṣṇa Paksha).
                  </p>
                </div>
                <ActivationGateFlowchart />
              </motion.div>
            </section>

            {/* Algorithm Stepper */}
            <section id="sec-algorithm-gate" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-bold text-violet-900">Interactive: Activation Gate Algorithm</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Step through the Diva/Paksha variant of the activation gate below. 
                  This is the secondary rule used in some South Indian traditions.
                </p>
                <AlgorithmStepper
                  steps={ACTIVATION_GATE_STEPS}
                  title="Ashtottari Praveśa Dvāra (Diva/Paksha Variant)"
                />
              </motion.div>
            </section>

            {/* Logic Gate Visualizer */}
            <section id="sec-simulator" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-bold text-violet-900">Interactive: Gate Simulator</h2>
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

            {/* 108-Year Matrix — Visual Timeline + Cycle Wheel */}
            <section id="sec-algorithm-matrix" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-bold text-violet-900">The 108-Year Matrix</h2>
                </div>

                {/* Cycle Wheel — primary visual */}
                <div className="mb-6">
                  <AshtottariCycleWheel size={520} />
                </div>

                {/* Bar Timeline — complementary view */}
                <AshtottariTimeline />
                <div className="mt-4">
                  <NakshatraAllocationGrid />
                </div>
              </motion.div>
            </section>

            {/* Debug Comparator */}
            <section id="sec-debug" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <DebugComparator
                  scenario="A user born during daytime (Diva), Krishna Paksha, with Janma Nakshatra Rohiṇī (Moon's nakshatra). They are consulting your software for a career forecast at age 35."
                  amateurOutput={{
                    title: "Vimshottari Only Prediction",
                    prediction: "Running only Vimshottari: the software calculates Moon Mahādashā (10 years) → Mars Mahādashā at this age. The career forecast emphasizes conflict, aggression, and competitive struggles.",
                    riskLevel: "high" }}
                  professionalOutput={{
                    title: "Grahvani Ashtottari Override",
                    prediction: "Activation Gate fires (Diva + Krishna Paksha). Ashtottari engine: Rohiṇī → Chandra starting dasha (15 years) → Maṅgala (8 years) → Budha Mahādashā active at age 35. Career forecast emphasizes communication, intellect, and business expansion under Mercury.",
                    overrideReason: "Diva + Kṛṣṇa Paksha → Gate TRUE → 108-year timeline with different Mahādashā sequence → entirely different planetary period at age 35" }}
                  whyItMatters="The Mahādashā running at any given age depends entirely on which dasha system is active. Without the conditional gate, your software may assign the wrong planetary period — leading to fundamentally different predictions and remedial advice."
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

            {/* Concepts */}
            <section id="sec-concepts" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-bold text-violet-900">Key Concepts</h2>
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
                  <BrainCircuit className="w-5 h-5 text-violet-600" />
                  <h2 className="text-xl font-bold text-violet-900">Test Your Knowledge</h2>
                </div>
                <InteractiveQuiz
                  quiz={content.quiz}
                  concepts={content.concepts}
                  lessonId={lesson.id}
                />
              </motion.div>
            </section>

            {/* ─── NEXT LESSON CTA ─── */}
            <section id="sec-next" className="scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-amber-200/60 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-amber-600 mb-1 font-medium">Next in Module 11</p>
                      <p className="text-xl font-bold text-gray-900">Yogini Dasha — The 36-Year Microscope</p>
                      <p className="text-sm text-gray-500 mt-1">Learn the high-frequency 36-year loop that reveals micro-storms hidden by Vimshottari.</p>
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
