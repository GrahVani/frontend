"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, GraduationCap, CheckCircle2, Lock, ChevronRight, BookOpen, Sparkles,
  BrainCircuit, Zap, Eye, RotateCcw, GitBranch, Heart, Layers, Lightbulb,
  ArrowRight, ArrowLeft as ArrowLeftIcon, SkipForward, ArrowDown } from "lucide-react";
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
import InteractiveQuiz, { type QuizQuestion } from "@/components/learn/InteractiveQuiz";

import { DebugComparator } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface ConceptMedia { type: string; diagramType?: string; caption?: string; }
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string; media?: ConceptMedia;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: QuizQuestion[]; }

interface Lesson39InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = [
  "hero", "sec-overview",
  "sec-c1", "sec-c2", "sec-c3", "sec-paths",
  "sec-c4", "sec-deha-jiva",
  "sec-c5", "sec-gatis",
  "sec-c6", "sec-debug",
  "sec-knowledge", "sec-concepts", "sec-recap", "sec-quiz", "sec-next",
];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-c1", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-c2", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-c3", label: "D-9 Dependency", type: "mechanics", group: "Learn" },
  { id: "sec-paths", label: "Savya / Apasavya Paths", type: "mechanics", group: "Learn" },
  { id: "sec-c4", label: "Deha & Jiva", type: "mechanics", group: "Learn" },
  { id: "sec-deha-jiva", label: "Deha & Jiva Visualizer", type: "mechanics", group: "Learn" },
  { id: "sec-c5", label: "The Three Gatis", type: "mechanics", group: "Learn" },
  { id: "sec-gatis", label: "Gati Jump Visualizer", type: "mechanics", group: "Learn" },
  { id: "sec-c6", label: "Why Apps Avoid", type: "case_debug", group: "Learn" },
  { id: "sec-debug", label: "Amateur vs Pro", type: "practice", group: "Practice" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "Kalachakra Dasha tracks life progression through which entities?", options: ["9 Grahas", "12 Rashis", "27 Nakshatras", "108 Padas"], correctIndex: 1, explanation: "Kalachakra is Rashi-gatika — sign-based, not Graha-based." },
  { id: "kc2", question: "Which Gati signifies total life upheaval?", options: ["Mandooka (Frog)", "Markata (Monkey)", "Simhavalokana (Lion)", "None of the above"], correctIndex: 2, explanation: "Simhavalokana Gati is the Lion's Glance — a massive leap across the zodiac causing total destruction or unprecedented rise." },
];

// ─── Kalachakra Data ──────────────────────────────────────────
const KALACHAKRA_SIGNS = [
  { num: 1, name: "Mesha", en: "Aries", lord: "Mangala", lordEn: "Mars", years: 7, symbol: "♈", color: "bg-red-500", text: "text-red-700", light: "bg-red-50", border: "border-red-200" },
  { num: 2, name: "Vrishabha", en: "Taurus", lord: "Shukra", lordEn: "Venus", years: 16, symbol: "♉", color: "bg-rose-400", text: "text-rose-700", light: "bg-rose-50", border: "border-rose-200" },
  { num: 3, name: "Mithuna", en: "Gemini", lord: "Budha", lordEn: "Mercury", years: 9, symbol: "♊", color: "bg-emerald-500", text: "text-emerald-700", light: "bg-emerald-50", border: "border-emerald-200" },
  { num: 4, name: "Karka", en: "Cancer", lord: "Chandra", lordEn: "Moon", years: 21, symbol: "♋", color: "bg-slate-400", text: "text-slate-700", light: "bg-slate-50", border: "border-slate-200" },
  { num: 5, name: "Simha", en: "Leo", lord: "Surya", lordEn: "Sun", years: 5, symbol: "♌", color: "bg-amber-500", text: "text-amber-700", light: "bg-amber-50", border: "border-amber-200" },
  { num: 6, name: "Kanya", en: "Virgo", lord: "Budha", lordEn: "Mercury", years: 9, symbol: "♍", color: "bg-emerald-500", text: "text-emerald-700", light: "bg-emerald-50", border: "border-emerald-200" },
  { num: 7, name: "Tula", en: "Libra", lord: "Shukra", lordEn: "Venus", years: 16, symbol: "♎", color: "bg-rose-400", text: "text-rose-700", light: "bg-rose-50", border: "border-rose-200" },
  { num: 8, name: "Vrishchika", en: "Scorpio", lord: "Mangala", lordEn: "Mars", years: 7, symbol: "♏", color: "bg-red-500", text: "text-red-700", light: "bg-red-50", border: "border-red-200" },
  { num: 9, name: "Dhanu", en: "Sagittarius", lord: "Guru", lordEn: "Jupiter", years: 10, symbol: "♐", color: "bg-yellow-500", text: "text-yellow-700", light: "bg-yellow-50", border: "border-yellow-200" },
  { num: 10, name: "Makara", en: "Capricorn", lord: "Shani", lordEn: "Saturn", years: 4, symbol: "♑", color: "bg-indigo-500", text: "text-indigo-700", light: "bg-indigo-50", border: "border-indigo-200" },
  { num: 11, name: "Kumbha", en: "Aquarius", lord: "Shani", lordEn: "Saturn", years: 4, symbol: "♒", color: "bg-indigo-500", text: "text-indigo-700", light: "bg-indigo-50", border: "border-indigo-200" },
  { num: 12, name: "Meena", en: "Pisces", lord: "Guru", lordEn: "Jupiter", years: 10, symbol: "♓", color: "bg-yellow-500", text: "text-yellow-700", light: "bg-yellow-50", border: "border-yellow-200" },
];

const SAVYA_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const APASAVYA_ORDER = [1, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

const GATI_TYPES = [
  {
    name: "Mandooka Gati",
    subtitle: "The Frog Jump",
    icon: "🐸",
    math: "Skips ONE sign",
    example: { from: 6, to: 4, skipped: 5, label: "Virgo → Cancer (skips Leo)" },
    severity: "Mid-Level",
    prediction: "Sudden distress, rapid location change, jarring relationship shift",
    color: "bg-amber-50 border-amber-300 text-amber-900",
    badge: "bg-amber-200 text-amber-800",
    arrowColor: "text-amber-500",
  },
  {
    name: "Markata Gati",
    subtitle: "The Monkey Jump",
    icon: "🐒",
    math: "Jumps BACKWARD one sign",
    example: { from: 5, to: 4, skipped: null, label: "Leo → Cancer (backward)" },
    severity: "Reversal Alert",
    prediction: "Sudden instability, loss of position, return to previous life state",
    color: "bg-orange-50 border-orange-300 text-orange-900",
    badge: "bg-orange-200 text-orange-800",
    arrowColor: "text-orange-500",
  },
  {
    name: "Simhavalokana Gati",
    subtitle: "The Lion's Glance",
    icon: "🦁",
    math: "MASSIVE leap across zodiac",
    example: { from: 12, to: 8, skipped: null, label: "Pisces → Scorpio (4 signs)" },
    severity: "CRITICAL",
    prediction: "Total life upheaval — near-death OR absolute power. Old life destroyed instantly.",
    color: "bg-red-50 border-red-400 text-red-900",
    badge: "bg-red-200 text-red-800",
    arrowColor: "text-red-500",
  },
];

// ─── Helpers ──────────────────────────────────────────────────
const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as const }, transition: { duration: 0.5 } };

function getAllText(content: LessonContent): string {
  const parts = [content.intro];
  content.sections?.forEach((s) => parts.push(s.content));
  content.concepts.forEach((c) => parts.push(c.description));
  return parts.join(" ");
}

// ─── Kalachakra Path Diagram ──────────────────────────────────
function KalachakraPathDiagram() {
  const [activePath, setActivePath] = useState<"savya" | "apasavya">("savya");
  const order = activePath === "savya" ? SAVYA_ORDER : APASAVYA_ORDER;
  const total = KALACHAKRA_SIGNS.reduce((s, sign) => s + sign.years, 0);

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider">Kalachakra Path Arrays</h3>
          <p className="text-xs text-gray-500 mt-0.5">12-Rashi sequence with year allocations. Same sign always carries the same years regardless of path direction.</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActivePath("savya")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activePath === "savya" ? "bg-white text-violet-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Savya (Clockwise)
          </button>
          <button
            onClick={() => setActivePath("apasavya")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activePath === "apasavya" ? "bg-white text-violet-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Apasavya (Reverse)
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activePath}
          initial={{ opacity: 0, x: activePath === "savya" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activePath === "savya" ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Sequence strip */}
          <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-thin">
            {order.map((signNum, idx) => {
              const sign = KALACHAKRA_SIGNS.find((s) => s.num === signNum)!;
              return (
                <motion.div
                  key={`${activePath}-${signNum}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`shrink-0 w-[72px] rounded-lg border-2 ${sign.border} ${sign.light} p-2 text-center`}
                >
                  <div className="text-lg leading-none mb-1">{sign.symbol}</div>
                  <div className="text-[10px] font-bold text-gray-900 leading-tight">{sign.en}</div>
                  <div className="text-[9px] text-gray-500 leading-tight">{sign.lordEn}</div>
                  <div className={`text-xs font-bold mt-1 ${sign.text}`}>{sign.years}y</div>
                </motion.div>
              );
            })}
          </div>

          {/* Direction arrow */}
          <div className="flex items-center justify-center gap-2 mb-4 text-xs text-gray-500">
            <span className="font-medium">{activePath === "savya" ? "Aries → Taurus → Gemini → ... → Pisces" : "Aries → Pisces → Aquarius → ... → Taurus"}</span>
            {activePath === "savya" ? <ArrowRight className="w-3 h-3" /> : <ArrowLeftIcon className="w-3 h-3" />}
          </div>

          {/* Proportional bar chart */}
          <div className="space-y-2">
            {order.map((signNum) => {
              const sign = KALACHAKRA_SIGNS.find((s) => s.num === signNum)!;
              const pct = (sign.years / total) * 100;
              return (
                <div key={`bar-${activePath}-${signNum}`} className="flex items-center gap-3">
                  <div className="w-20 sm:w-24 shrink-0">
                    <div className="text-xs font-bold text-gray-900">{sign.en}</div>
                    <div className="text-[10px] text-gray-500">{sign.lordEn}</div>
                  </div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden relative">
                    <motion.div
                      className={`h-full ${sign.color} rounded-md`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <span className="absolute inset-0 flex items-center px-2 text-[10px] font-bold text-white drop-shadow-md">
                      {sign.years} yrs
                    </span>
                  </div>
                  <div className="w-12 text-right shrink-0">
                    <span className="text-[10px] text-gray-500">{pct.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Signs owned by same planet share years: Mars=7, Venus=16, Mercury=9, Moon=21, Sun=5, Jupiter=10, Saturn=4
        </span>
        <span className="text-xs font-bold text-amber-700">Total: 118 Varsha</span>
      </div>
    </div>
  );
}

// ─── Gati Jump Visualizer ─────────────────────────────────────
function GatiJumpVisualizer() {
  const [activeGati, setActiveGati] = useState<number | null>(null);

  const getArrow = (gatiIdx: number, signNum: number) => {
    const gati = GATI_TYPES[gatiIdx];
    const ex = gati.example;
    if (ex.from === signNum) {
      const diff = ex.to - ex.from;
      if (diff === -1) return <ArrowLeftIcon className={`w-4 h-4 ${gati.arrowColor}`} />; // backward
      if (ex.skipped) return <SkipForward className={`w-4 h-4 ${gati.arrowColor}`} />; // skip
      return <ArrowDown className={`w-4 h-4 ${gati.arrowColor}`} />; // big leap
    }
    return null;
  };

  const isHighlighted = (gatiIdx: number, signNum: number) => {
    const ex = GATI_TYPES[gatiIdx].example;
    return ex.from === signNum || ex.to === signNum;
  };

  const isSkipped = (gatiIdx: number, signNum: number) => {
    const ex = GATI_TYPES[gatiIdx].example;
    return ex.skipped === signNum;
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 sm:p-6">
      <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-1">Gati Jump Visualizer</h3>
      <p className="text-xs text-gray-500 mb-4">Click a Gati type to see how the sequence breaks on the zodiac wheel. Highlighted signs show the jump endpoints.</p>

      <div className="flex gap-2 mb-4">
        {GATI_TYPES.map((gati, idx) => (
          <button
            key={gati.name}
            onClick={() => setActiveGati(activeGati === idx ? null : idx)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all border-2 ${
              activeGati === idx ? gati.color : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="mr-1">{gati.icon}</span>
            {gati.subtitle}
          </button>
        ))}
      </div>

      {/* Zodiac strip */}
      <div className="relative">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
          {KALACHAKRA_SIGNS.map((sign) => {
            const highlighted = activeGati !== null && isHighlighted(activeGati, sign.num);
            const skipped = activeGati !== null && isSkipped(activeGati, sign.num);
            return (
              <div key={sign.num} className="flex flex-col items-center shrink-0 w-12">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border-2 transition-all ${
                    skipped
                      ? "bg-gray-100 border-gray-300 opacity-40 line-through"
                      : highlighted
                      ? `${sign.light} ${sign.border} scale-110 shadow-md`
                      : "bg-white border-gray-200"
                  }`}
                >
                  {sign.symbol}
                </div>
                <span className="text-[9px] text-gray-500 mt-1 text-center leading-tight">{sign.en.slice(0, 3)}</span>
                {activeGati !== null && getArrow(activeGati, sign.num) && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1"
                  >
                    {getArrow(activeGati, sign.num)}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Jump description */}
        <AnimatePresence>
          {activeGati !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 rounded-lg border-2 bg-gray-50 border-gray-200"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{GATI_TYPES[activeGati].icon}</span>
                <span className="text-sm font-bold">{GATI_TYPES[activeGati].name}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${GATI_TYPES[activeGati].badge}`}>
                  {GATI_TYPES[activeGati].severity}
                </span>
              </div>
              <p className="text-xs text-gray-700">{GATI_TYPES[activeGati].prediction}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Deha-Jiva Visualizer ─────────────────────────────────────
function DehaJivaVisualizer() {
  const [activeTab, setActiveTab] = useState<"deha" | "jiva">("deha");

  return (
    <div className="bg-white rounded-2xl border border-violet-200/60 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-violet-600" />
        <h3 className="font-bold text-gray-900">Deha & Jiva Anchors</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("deha")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "deha"
              ? "bg-violet-600 text-white shadow-md"
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
            ? "bg-violet-50 border-violet-200"
            : "bg-violet-50 border-violet-200"
        }`}
      >
        {activeTab === "deha" ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <span className="text-lg">🫀</span>
              </div>
              <div>
                <h4 className="font-bold text-violet-900">Deha — The Body</h4>
                <p className="text-xs text-violet-600">Starting sign of Kalachakra sequence</p>
              </div>
            </div>
            <ul className="space-y-2 mt-3">
              <li className="flex items-start gap-2 text-sm text-violet-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                Dictates physical health and vitality
              </li>
              <li className="flex items-start gap-2 text-sm text-violet-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                When malefics transit Deha → physical crisis alert
              </li>
              <li className="flex items-start gap-2 text-sm text-violet-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
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
                    <div className="text-lg font-bold text-gray-900">12</div>
                    <div className="text-[10px] text-amber-600">Rashi Stations</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                    <GitBranch className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">2</div>
                    <div className="text-[10px] text-amber-600">Path Arrays</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                    <Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">3</div>
                    <div className="text-[10px] text-amber-600">Gati Types</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                    <Eye className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">D-9</div>
                    <div className="text-[10px] text-amber-600">Required Chart</div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Content Sections — use unique IDs based on section.id */}
            {content.sections?.map((section) => (
              <section
                key={section.id}
                id={`sec-c${section.id}`}
                className="mb-6 scroll-mt-32"
                onClick={() => markSectionComplete(section.id)}
              >
                <motion.div {...fadeUp}>
                  <LessonSection section={section} index={section.id - 1} />
                </motion.div>
              </section>
            ))}

            {/* ─── PATH DIAGRAM ─── */}
            <section id="sec-paths" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <KalachakraPathDiagram />
              </motion.div>
            </section>

            {/* ─── DEHA-JIVA VISUALIZER ─── */}
            <section id="sec-deha-jiva" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <DehaJivaVisualizer />
              </motion.div>
            </section>

            {/* ─── GATI CARDS ─── */}
            <section id="sec-gatis" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
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
                              <span className="opacity-80">{gati.example.label}</span>
                            </div>
                          </div>
                          <p className="text-sm mt-2 font-medium">{gati.prediction}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Gati Jump Visualizer */}
                <div className="mt-6">
                  <GatiJumpVisualizer />
                </div>
              </motion.div>
            </section>

            {/* ─── DEBUG COMPARATOR ─── */}
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
                      <p className="text-sm text-amber-600 mb-1 font-medium">Next Module</p>
                      <p className="text-xl font-bold text-gray-900">Module 12: Planetary States & Exception Handling</p>
                      <p className="text-sm text-gray-500 mt-1">Master Baladi Avasthas (Power Throttle), Lajjitadi Avasthas (Mood Engine), and Neecha Bhanga (Exception Handler).</p>
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
