"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, ChevronRight, BookOpen, Sparkles,
  BrainCircuit, Layers, ArrowRight, CheckCircle2, Lock, Lightbulb,
  Heart, Users, Baby, Briefcase, Home, Coins } from "lucide-react";
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

import {
  DebugComparator,
  SynthesisDashboard } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: QuizQuestion[]; }

interface Lesson43InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = [
  "hero", "sec-overview",
  "sec-c1", "sec-c2", "sec-c3", "sec-c4", "sec-c5",
  "sec-table", "sec-synthesis", "sec-debug",
  "sec-knowledge", "sec-concepts", "sec-recap", "sec-quiz", "sec-next",
];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-c1", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-c2", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-c3", label: "Master Formula", type: "algorithm", group: "Learn" },
  { id: "sec-c4", label: "Why It Matters", type: "case_debug", group: "Learn" },
  { id: "sec-c5", label: "Synthesis", type: "synthesis", group: "Learn" },
  { id: "sec-table", label: "Derived Houses Explorer", type: "mechanics", group: "Practice" },
  { id: "sec-synthesis", label: "Synthesis Dashboard", type: "practice", group: "Practice" },
  { id: "sec-debug", label: "Amateur vs Pro", type: "practice", group: "Practice" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "What is the 2nd house FROM the 4th house?", options: ["4th house","5th house","2nd house","6th house"], correctIndex: 1, explanation: "2nd from 4th = 4 + 2 = 5th house. The 5th house reveals family happiness (2nd = family, 4th = happiness → 5th = family happiness)." },
  { id: "kc2", question: "To assess mother's health, which house do you examine?", options: ["2nd house","4th house","6th house","8th house"], correctIndex: 2, explanation: "Mother = 4th house. Mother's health = 6th from 4th = 10th house. Among the given options, the 6th house (disease) from the 4th is the closest proxy — but the true derived house is the 10th. This is a trick question testing your Bhavat Bhavam precision." },
];

const DERIVED_HOUSES = [
  { base: "4th (Mother)", derived: "6th from 4th = 9th", meaning: "Mother's health & enemies" },
  { base: "4th (Mother)", derived: "10th from 4th = 1st", meaning: "Mother's career/status" },
  { base: "5th (Children)", derived: "2nd from 5th = 6th", meaning: "Children's wealth accumulation" },
  { base: "7th (Spouse)", derived: "2nd from 7th = 8th", meaning: "Spouse's family & longevity" },
  { base: "10th (Career)", derived: "11th from 10th = 8th", meaning: "Gains from career (dangerous gains!)" },
  { base: "9th (Father)", derived: "4th from 9th = 12th", meaning: "Father's happiness (loss/endings)" },
];

const COMMON_DERIVED_HOUSES = [
  { category: "Mother", icon: Home, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-200", items: [
    { base: "4th", offset: "4th", derived: "7th", meaning: "Mother's psychological foundation & marriage" },
    { base: "4th", offset: "6th", derived: "9th", meaning: "Mother's health & obstacles" },
    { base: "4th", offset: "10th", derived: "1st", meaning: "Mother's career & status" },
    { base: "4th", offset: "2nd", derived: "5th", meaning: "Mother's family & wealth" },
  ]},
  { category: "Father", icon: Users, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200", items: [
    { base: "9th", offset: "4th", derived: "12th", meaning: "Father's happiness & losses" },
    { base: "9th", offset: "6th", derived: "2nd", meaning: "Father's health & enemies" },
    { base: "9th", offset: "10th", derived: "6th", meaning: "Father's career & service" },
  ]},
  { category: "Children", icon: Baby, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200", items: [
    { base: "5th", offset: "5th", derived: "9th", meaning: "Children's destiny & grandchildren" },
    { base: "5th", offset: "2nd", derived: "6th", meaning: "Children's wealth & health" },
    { base: "5th", offset: "10th", derived: "2nd", meaning: "Children's career & family" },
  ]},
  { category: "Spouse", icon: Heart, color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-200", items: [
    { base: "7th", offset: "7th", derived: "1st", meaning: "Spouse's view of the native" },
    { base: "7th", offset: "2nd", derived: "8th", meaning: "Spouse's family & longevity" },
    { base: "7th", offset: "4th", derived: "10th", meaning: "Spouse's home & career" },
  ]},
  { category: "Career", icon: Briefcase, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200", items: [
    { base: "10th", offset: "10th", derived: "7th", meaning: "Career's impact on partnerships" },
    { base: "10th", offset: "11th", derived: "8th", meaning: "Gains from career (sudden/legacy)" },
    { base: "10th", offset: "2nd", derived: "11th", meaning: "Career's wealth accumulation" },
  ]},
  { category: "Wealth", icon: Coins, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200", items: [
    { base: "2nd", offset: "2nd", derived: "3rd", meaning: "Source of wealth (effort/courage)" },
    { base: "2nd", offset: "11th", derived: "12th", meaning: "Wealth losses & foreign spending" },
    { base: "11th", offset: "2nd", derived: "12th", meaning: "Gains turned to losses" },
  ]},
];

// ─── Common Derived Houses Table ──────────────────────────────
function CommonDerivedHousesTable() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Layers className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider">Common Derived Houses Reference</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Most frequently used Bhavat Bhavam combinations organized by life topic.
        Click a category to filter, or view all.
      </p>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeCategory === null
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {COMMON_DERIVED_HOUSES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeCategory === cat.category
                  ? `${cat.bg} ${cat.color} border ${cat.border} shadow-sm`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.category}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Topic</th>
              <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Base House</th>
              <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Offset</th>
              <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Derived</th>
              <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {COMMON_DERIVED_HOUSES.filter((cat) => activeCategory === null || activeCategory === cat.category).map((cat) =>
              cat.items.map((item, idx) => (
                <motion.tr
                  key={`${cat.category}-${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-b border-gray-100 ${cat.bg} hover:brightness-95 transition-colors`}
                >
                  <td className="py-2 px-2">
                    <span className={`text-xs font-bold ${cat.color}`}>{cat.category}</span>
                  </td>
                  <td className="py-2 px-2">
                    <span className="font-semibold text-gray-800">{item.base}</span>
                  </td>
                  <td className="py-2 px-2">
                    <span className="text-xs font-mono text-gray-600">{item.offset}</span>
                  </td>
                  <td className="py-2 px-2">
                    <span className="font-bold text-amber-700">{item.derived}</span>
                  </td>
                  <td className="py-2 px-2">
                    <span className="text-xs text-gray-700">{item.meaning}</span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-500">
        <span className="font-bold">Rule:</span> The {`<offset>`} house <em>from</em> the {`<base>`} house reveals the {`<offset>`}-signification <em>of</em> the {`<base>`} house topic. Example: 6th from 4th = 9th house = mother's (4th) health (6th).
      </div>
    </div>
  );
}

// ─── Bhavat Bhavam Explorer ───────────────────────────────────
function BhavatBhavamExplorer() {
  const [baseHouse, setBaseHouse] = useState(4);
  const [offset, setOffset] = useState(6);
  const derived = ((baseHouse + offset - 1) % 12) + 1;

  const meanings: Record<number, string> = {
    1: "Self, personality, physical body",
    2: "Family, wealth, speech, food",
    3: "Siblings, courage, short travels",
    4: "Mother, home, vehicles, happiness",
    5: "Children, intelligence, speculation",
    6: "Disease, enemies, service, debts",
    7: "Spouse, partnerships, business",
    8: "Longevity, inheritance, transformation",
    9: "Father, fortune, higher learning",
    10: "Career, status, government",
    11: "Gains, friends, elder siblings",
    12: "Loss, liberation, foreign lands" };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-amber-600" />
        <h3 className="font-bold text-gray-900">Bhavat Bhavam Explorer</h3>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Base House</label>
          <select value={baseHouse} onChange={(e) => setBaseHouse(Number(e.target.value))} className="block mt-1 w-24 rounded-lg border-slate-200 text-sm">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => <option key={h} value={h}>{h}th</option>)}
          </select>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-400 mt-4" />
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Offset</label>
          <select value={offset} onChange={(e) => setOffset(Number(e.target.value))} className="block mt-1 w-28 rounded-lg border-slate-200 text-sm">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((o) => <option key={o} value={o}>{o} houses forward</option>)}
          </select>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-400 mt-4" />
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Derived</label>
          <div className="mt-1 w-20 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-amber-900">
            {derived}th
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
        <div className="text-sm text-gray-700">
          <span className="font-semibold">{baseHouse}th house</span> + <span className="font-semibold">{offset} houses forward</span> = <span className="font-bold text-amber-800">{derived}th house</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          <span className="font-semibold">Meaning: </span>{meanings[derived] || "Derived significance"}
        </div>
        <div className="text-xs text-amber-700 mt-2 bg-white/60 rounded-lg p-2">
          <strong>Rule:</strong> The {offset}th house <em>from</em> the {baseHouse}th reveals the {offset}th-signification <em>of</em> the {baseHouse}th house topic.
        </div>
      </div>
    </div>
  );
}

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as const }, transition: { duration: 0.5 } };

function getAllText(content: LessonContent): string {
  const parts = [content.intro];
  content.sections?.forEach((s) => parts.push(s.content));
  content.concepts.forEach((c) => parts.push(c.description));
  return parts.join(" ");
}

export default function Lesson43Interactive({ lesson, lessonProgress }: Lesson43InteractiveProps) {
  const { user } = useAuth();
  const content = lesson.contentJson as unknown as LessonContent;
  const allText = useMemo(() => getAllText(content), [content]);
  const progress = useReadingProgress();
  const activeSection = useScrollSpy({ sectionIds: SECTION_IDS });
  const [completedSections, setCompletedSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (lessonProgress?.sectionsViewed) lessonProgress.sectionsViewed.forEach((id) => initial.add(`sec-s${id}`));
    return initial;
  });

  const markSectionComplete = useCallback((sectionId: number) => {
    setCompletedSections((prev) => {
      const next = new Set(prev);
      next.add(`sec-s${sectionId}`);
      if (user) learnApi.trackSectionView(lesson.id, user.id, sectionId).catch(console.error);
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
              <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Learning Path
              </Link>

              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <GraduationCap className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
                  <span className="text-xs text-amber-300">·</span>
                  <span className="text-xs font-medium text-amber-400">Module 13: Chart Synthesis & Logic Traps</span>
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

                <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-3">{lesson.title}</h1>

                <div className="flex items-center gap-4 flex-wrap">
                  <ReadingTime text={allText} />
                  <span className="text-amber-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                    <Layers className="w-3.5 h-3.5" /> {content.sections?.length || 0} Sections
                  </span>
                  <span className="text-amber-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                    <Lightbulb className="w-3.5 h-3.5" /> {content.concepts.length} Concepts
                  </span>
                  <span className="text-amber-200">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                    <BrainCircuit className="w-3.5 h-3.5" /> {content.quiz.length} Questions
                  </span>
                </div>

                {hasSections && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden max-w-[250px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${sectionProgress}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                    <span className="text-xs text-amber-600 font-medium">{completedSections.size}/{content.sections?.length} viewed</span>
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DERIVED_HOUSES.map((d, i) => (
                    <div key={i} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200">
                      <div className="text-xs font-bold text-amber-800">{d.base}</div>
                      <div className="text-xs text-gray-600 mt-1">{d.derived}</div>
                      <div className="text-[10px] text-amber-600 mt-0.5">{d.meaning}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Content Sections — unique IDs */}
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

            {/* Derived Houses Explorer + Reference Table */}
            <section id="sec-table" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp} className="space-y-6">
                <CommonDerivedHousesTable />
                <BhavatBhavamExplorer />
              </motion.div>
            </section>

            {/* Synthesis Dashboard */}
            <section id="sec-synthesis" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <SynthesisDashboard
                  title="Bhavat Bhavam Synthesis: Mother's Career"
                  overlayNodes={[
                    { id: "n1", label: "4th House", x: 150, y: 100, color: "#f59e0b" },
                    { id: "n2", label: "10th from 4th", x: 350, y: 100, color: "#10b981" },
                    { id: "n3", label: "1st House", x: 550, y: 100, color: "#3b82f6" },
                  ]}
                  edges={[
                    { from: "n1", to: "n2", label: "+10 houses" },
                    { from: "n2", to: "n3", label: "= 1st from lagna" },
                  ]}
                  analysis="To assess mother's career: Start at 4th (mother). Count 10 houses forward → lands on the 1st house from lagna. If the 1st house has strong planets, mother's career is excellent. If afflicted, mother's career suffered."
                />
              </motion.div>
            </section>

            {/* Debug Comparator */}
            <section id="sec-debug" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <DebugComparator
                  scenario="A native asks: 'Will I inherit wealth from my mother?' Their 4th house has Saturn, and the 2nd from 4th (5th house) has Rahu."
                  amateurOutput={{ title: "House-Only Analysis", prediction: "4th house has Saturn — mother is strict, possibly absent. 5th house has Rahu — speculative losses. Inheritance is unlikely. Focus on earning your own wealth.", riskLevel: "medium" }}
                  professionalOutput={{ title: "Grahvani Bhavat Bhavam Analysis", prediction: "Mother = 4th house (Saturn = discipline, delay). Mother's wealth = 2nd from 4th = 5th house (Rahu = sudden, unconventional). SATURN in 4th means mother EARNED wealth through discipline (not inherited). RAHU in 5th means the wealth came through speculative or unconventional means. The native WILL inherit, but with DELAY (Saturn) and through UNCONVENTIONAL channels (Rahu). The timing is Saturn-dasha, 5th house activation.", overrideReason: "Amateur software reads Rahu in 5th as 'bad for speculation.' Grahvani reads it as 'unconventional wealth source for mother's family.' Same placement, opposite prediction." }}
                  whyItMatters="Without Bhavat Bhavam, every prediction is surface-level. You tell people 'no inheritance' when they actually have DELAYED, UNCONVENTIONAL inheritance. The difference between despair and patience is the difference between amateur and professional Jyotish."
                />
              </motion.div>
            </section>

            {/* Knowledge Checks */}
            <section id="sec-knowledge" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><BrainCircuit className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2></div>
                <KnowledgeCheck questions={KNOWLEDGE_CHECKS} />
              </motion.div>
            </section>

            {/* Concepts */}
            <section id="sec-concepts" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-gray-900">Key Concepts</h2></div>
                <div className="space-y-4">{content.concepts.map((concept, idx) => <ConceptCard key={concept.id} concept={concept} index={idx} />)}</div>
              </motion.div>
            </section>

            {/* Recap */}
            <section id="sec-recap" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <RecapSection title="Lesson Recap" items={[
                  { id: 1, title: "Bhavat Bhavam = 'House from House' — ...", summary: "Bhavat Bhavam = 'House from House' — counting houses forward from any base house." },
                  { id: 2, title: "Every house has 12 derived houses, re...", summary: "Every house has 12 derived houses, revealing infinite nuance." },
                  { id: 3, title: "Mother's health = 6th from 4th. Spous...", summary: "Mother's health = 6th from 4th. Spouse's wealth = 2nd from 7th. Children's career = 10th from 5th." },
                  { id: 4, title: "The derived house inherits the base h...", summary: "The derived house inherits the base house's topic but takes the offset house's behavior." },
                  { id: 5, title: "Grahvani automates this with recursiv...", summary: "Grahvani automates this with recursive house traversal — no manual counting needed." }
                ]} />
              </motion.div>
            </section>

            {/* Quiz */}
            <section id="sec-quiz" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><BrainCircuit className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-gray-900">Test Your Knowledge</h2></div>
                <InteractiveQuiz quiz={content.quiz} concepts={content.concepts} lessonId={lesson.id} />
              </motion.div>
            </section>

            {/* ─── NEXT LESSON CTA ─── */}
            <section id="sec-next" className="scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-amber-200/60 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-amber-600 mb-1 font-medium">Next in Module 13</p>
                      <p className="text-xl font-bold text-gray-900">Dispositor Theory — The Ruler Chain</p>
                      <p className="text-sm text-gray-500 mt-1">Trace the chain of rulers from any planet back to its ultimate dispositor. The key to chart synthesis.</p>
                    </div>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-amber-600/20 shrink-0">Continue <ChevronRight className="w-4 h-4" /></Link>
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
