"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, ChevronRight, BookOpen, Sparkles,
  BrainCircuit, Target, ShieldAlert, CheckCircle, XCircle, Zap,
  CheckCircle2, Lock, Lightbulb, Layers, Crown, AlertTriangle } from "lucide-react";
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
  ExceptionHandlerFlow,
  type ExceptionPhase } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: QuizQuestion[]; }

interface Lesson42InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = [
  "hero", "sec-overview",
  "sec-c1", "sec-c2", "sec-c3", "sec-c4", "sec-c5",
  "sec-exception-flow", "sec-debug",
  "sec-knowledge", "sec-concepts", "sec-recap", "sec-quiz", "sec-next",
];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-c1", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-c2", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-c3", label: "5-Check Algorithm", type: "algorithm", group: "Learn" },
  { id: "sec-c4", label: "Override in Action", type: "case_debug", group: "Learn" },
  { id: "sec-c5", label: "Synthesis", type: "synthesis", group: "Learn" },
  { id: "sec-exception-flow", label: "Exception Handler", type: "practice", group: "Practice" },
  { id: "sec-debug", label: "Amateur vs Pro", type: "practice", group: "Practice" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "What is the SINGLE most important condition for Neecha Bhanga?", options: ["Exalted planet in the same house","Dispositor in a Kendra (1,4,7,10)","Debilitated planet in a Trikona (1,5,9)","Conjunction with Jupiter"], correctIndex: 1, explanation: "The dispositor (ruler of the debilitated sign) must be in a Kendra (1st, 4th, 7th, or 10th house). Without this, there is NO Neecha Bhanga." },
  { id: "kc2", question: "What happens if a planet is debilitated but its dispositor is in the 12th house?", options: ["Neecha Bhanga Raja Yoga","No cancellation — debilitation stands","Partial cancellation (50%)","Exaltation by proxy"], correctIndex: 1, explanation: "12th house is NOT a Kendra. The dispositor fails the critical check. The planet remains fully debilitated. This is the most common trap for amateur software." },
];

const NEECHA_CONDITIONS = [
  { name: "Dispositor in Kendra", description: "Ruler of the debilitated sign sits in 1st, 4th, 7th, or 10th house", icon: ShieldAlert, color: "text-emerald-600", critical: true },
  { name: "Exaltation Lord in Kendra", description: "The planet that is exalted in this sign sits in a Kendra from the lagna", icon: CheckCircle, color: "text-blue-600", critical: false },
  { name: "Dispositor Exalted", description: "The dispositor is in its own exaltation sign", icon: Zap, color: "text-amber-600", critical: false },
  { name: "Debilitated in Navamsha", description: "Planet is ALSO debilitated in D-9 — intensifies the problem", icon: XCircle, color: "text-red-600", critical: false },
  { name: "Neecha Bhanga Raja Yoga", description: "If ALL conditions align, debilitation becomes the source of KINGLY power", icon: Target, color: "text-purple-600", critical: false },
];

const DEBILITATION_TABLE = [
  { planet: "Surya", planetEn: "Sun", debilitationSign: "Tula", debilitationSignEn: "Libra", dispositor: "Shukra", dispositorEn: "Venus", exaltationLord: "Shani", exaltationLordEn: "Saturn", degree: "10°" },
  { planet: "Chandra", planetEn: "Moon", debilitationSign: "Vrishchika", debilitationSignEn: "Scorpio", dispositor: "Mangala", dispositorEn: "Mars", exaltationLord: "Chandra", exaltationLordEn: "Moon (itself)", degree: "3°" },
  { planet: "Mangala", planetEn: "Mars", debilitationSign: "Karka", debilitationSignEn: "Cancer", dispositor: "Chandra", dispositorEn: "Moon", exaltationLord: "Mangala", exaltationLordEn: "Mars (itself)", degree: "28°" },
  { planet: "Budha", planetEn: "Mercury", debilitationSign: "Meena", debilitationSignEn: "Pisces", dispositor: "Guru", dispositorEn: "Jupiter", exaltationLord: "Budha", exaltationLordEn: "Mercury (itself)", degree: "15°" },
  { planet: "Guru", planetEn: "Jupiter", debilitationSign: "Makara", debilitationSignEn: "Capricorn", dispositor: "Shani", dispositorEn: "Saturn", exaltationLord: "Mangala", exaltationLordEn: "Mars", degree: "5°" },
  { planet: "Shukra", planetEn: "Venus", debilitationSign: "Kanya", debilitationSignEn: "Virgo", dispositor: "Budha", dispositorEn: "Mercury", exaltationLord: "Shukra", exaltationLordEn: "Venus (itself)", degree: "27°" },
  { planet: "Shani", planetEn: "Saturn", debilitationSign: "Mesha", debilitationSignEn: "Aries", dispositor: "Mangala", dispositorEn: "Mars", exaltationLord: "Surya", exaltationLordEn: "Sun", degree: "20°" },
];

// ─── Neecha Bhanga Reference Table ────────────────────────────
function NeechaBhangaReferenceTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Crown className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider">Debilitation Reference Table</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        For each planet: its debilitation sign, deepest debilitation degree, dispositor (Rashi-pati), and exaltation lord (Uccha-pati).
        These are the two &quot;rescue team&quot; planets for Neecha Bhanga checks.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Planet</th>
              <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Debilitation Sign</th>
              <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Deep Point</th>
              <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <span className="text-emerald-600">Dispositor</span>
                <span className="block text-[9px] font-normal text-gray-400">(Rashi-pati)</span>
              </th>
              <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <span className="text-blue-600">Exaltation Lord</span>
                <span className="block text-[9px] font-normal text-gray-400">(Uccha-pati)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {DEBILITATION_TABLE.map((row, idx) => (
              <motion.tr
                key={row.planet}
                className={`border-b border-gray-100 transition-colors cursor-default ${
                  hoveredRow === idx ? "bg-amber-50/60" : ""
                }`}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="py-2.5 px-2">
                  <div className="font-bold text-gray-900">{row.planet}</div>
                  <div className="text-[10px] text-gray-500">{row.planetEn}</div>
                </td>
                <td className="py-2.5 px-2">
                  <div className="font-semibold text-gray-800">{row.debilitationSign}</div>
                  <div className="text-[10px] text-gray-500">{row.debilitationSignEn}</div>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-xs font-mono font-bold text-red-600">{row.degree}</span>
                </td>
                <td className="py-2.5 px-2">
                  <div className="font-semibold text-emerald-700">{row.dispositor}</div>
                  <div className="text-[10px] text-gray-500">{row.dispositorEn}</div>
                </td>
                <td className="py-2.5 px-2">
                  <div className="font-semibold text-blue-700">{row.exaltationLord}</div>
                  <div className="text-[10px] text-gray-500">{row.exaltationLordEn}</div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-500">
        <span className="font-bold">Tip:</span> When analyzing a debilitated planet, immediately locate its{" "}
        <span className="text-emerald-600 font-semibold">Dispositor</span> and{" "}
        <span className="text-blue-600 font-semibold">Exaltation Lord</span> in the chart. If either sits in a Kendra (1, 4, 7, 10), Neecha Bhanga may be active.
      </div>
    </div>
  );
}

// ─── Neecha Bhanga Calculator ─────────────────────────────────
function NeechaBhangaCalculator() {
  const [checks, setChecks] = useState({ dispositorKendra: false, exaltLordKendra: false, dispositorExalted: false, navamshaDebilitated: false });
  const [showResult, setShowResult] = useState(false);

  const hasBhanga = checks.dispositorKendra && (checks.exaltLordKendra || checks.dispositorExalted);
  const isRajaYoga = checks.dispositorKendra && checks.exaltLordKendra && checks.dispositorExalted && !checks.navamshaDebilitated;

  return (
    <div className="bg-white rounded-2xl border border-teal-200/60 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-teal-600" />
        <h3 className="font-bold text-gray-900">Neecha Bhanga Calculator</h3>
      </div>
      <div className="space-y-3 mb-4">
        {[
          { key: "dispositorKendra" as const, label: "Dispositor in Kendra (1,4,7,10)?", critical: true },
          { key: "exaltLordKendra" as const, label: "Exaltation Lord in Kendra?", critical: false },
          { key: "dispositorExalted" as const, label: "Dispositor exalted in its own sign?", critical: false },
          { key: "navamshaDebilitated" as const, label: "Also debilitated in D-9 Navamsha?", critical: false },
        ].map((c) => (
          <label key={c.key} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-teal-300 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checks[c.key]}
              onChange={(e) => { setChecks((p) => ({ ...p, [c.key]: e.target.checked })); setShowResult(false); }}
              className="w-5 h-5 text-teal-600 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-gray-700">{c.label}</span>
            {c.critical && <span className="ml-auto text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">CRITICAL</span>}
          </label>
        ))}
      </div>
      <button
        onClick={() => setShowResult(true)}
        className="w-full py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
      >
        Evaluate Neecha Bhanga
      </button>
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl border-2 ${isRajaYoga ? "bg-purple-50 border-purple-400" : hasBhanga ? "bg-emerald-50 border-emerald-400" : "bg-red-50 border-red-400"}`}
        >
          <h4 className={`font-bold text-lg ${isRajaYoga ? "text-purple-900" : hasBhanga ? "text-emerald-900" : "text-red-900"}`}>
            {isRajaYoga ? "🎯 NEECHA BHANGA RAJA YOGA DETECTED" : hasBhanga ? "✅ Neecha Bhanga Confirmed" : "❌ No Cancellation — Debilitation Stands"}
          </h4>
          <p className="text-sm mt-1 text-gray-700">
            {isRajaYoga
              ? "ALL conditions aligned. The debilitated planet will produce KINGLY results. This is the most powerful yoga in Jyotish."
              : hasBhanga
              ? "Basic Neecha Bhanga applies. The planet's debilitation is cancelled, but it does not reach Raja Yoga power."
              : "The planet remains debilitated. Predictions must account for reduced power, psychological struggle, and delayed results."}
          </p>
        </motion.div>
      )}
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

export default function Lesson42Interactive({ lesson, lessonProgress }: Lesson42InteractiveProps) {
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

  const overridePhases: ExceptionPhase[] = [
    { id: "detect", label: "Detect Neecha", description: "Planet in debilitated sign?", status: "completed" },
    { id: "dispositor", label: "Check Dispositor", description: "Is the sign ruler in a Kendra?", status: "completed" },
    { id: "exaltation", label: "Check Exaltation Lord", description: "Is the exaltation planet in a Kendra?", status: "active" },
    { id: "override", label: "Override Prediction", description: "Transform failure into Raja Yoga", status: "pending" },
  ];

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
              <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Learning Path
              </Link>

              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <GraduationCap className="w-5 h-5 text-teal-500" />
                  <span className="text-xs font-bold text-teal-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
                  <span className="text-xs text-teal-300">·</span>
                  <span className="text-xs font-medium text-teal-400">Module 12: Planetary States & Exception Handling</span>
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

            {/* ─── OVERVIEW ─── */}
            <section id="sec-overview" className="mb-6 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white border border-amber-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800 uppercase tracking-wide">Lesson Overview</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">{content.intro}</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {NEECHA_CONDITIONS.map((c) => (
                    <div key={c.name} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-3 text-center border border-teal-200">
                      <c.icon className={`w-5 h-5 mx-auto mb-1 ${c.color}`} />
                      <div className="text-xs font-bold text-gray-800">{c.name}</div>
                      {c.critical && <div className="text-[9px] text-red-600 font-bold mt-0.5">MUST PASS</div>}
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

            {/* Reference Table */}
            <section id="sec-exception-flow" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp} className="space-y-6">
                <NeechaBhangaReferenceTable />

                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-bold text-gray-900">The Exception Handler Flow</h2>
                </div>
                <ExceptionHandlerFlow phases={overridePhases} />
                <NeechaBhangaCalculator />
              </motion.div>
            </section>

            {/* Debug Comparator */}
            <section id="sec-debug" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <DebugComparator
                  scenario="A native has Mercury debilitated in Pisces (5°), with Jupiter (dispositor of Pisces) in the 10th house (Sagittarius). They ask about career success in writing and communication."
                  amateurOutput={{ title: "Standard Dignity Analysis", prediction: "Mercury is debilitated in Pisces. Your communication skills are weak. Writing career is not advised. You may struggle with documentation, contracts, and intellectual work. Consider manual labor or service roles.", riskLevel: "high" }}
                  professionalOutput={{ title: "Grahvani Exception Handler", prediction: "NEECHA BHANGA RAJA YOGA DETECTED. Mercury is debilitated, BUT Jupiter (dispositor) is in the 10th house (Kendra). Jupiter is ALSO the exaltation lord of Mercury's sign (Cancer). This is a CLASSICAL Neecha Bhanga Raja Yoga. The native will achieve EXTRAORDINARY success in writing — but only AFTER age 36, after the initial struggle. The debilitation is the FUEL for the rise.", overrideReason: "Dispositor in Kendra + Exaltation lord involved = Raja Yoga. Amateur software calls this 'weak.' Grahvani calls it 'the making of a king.'" }}
                  whyItMatters="Without Neecha Bhanga detection, software DESTROYS lives. It tells a 22-year-old writer they have 'no talent' when they actually have the chart of a literary giant. The 36-year delay is the struggle period — it is PREDICTABLE and navigable with the right guidance."
                />
              </motion.div>
            </section>

            {/* Knowledge Checks */}
            <section id="sec-knowledge" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><BrainCircuit className="w-5 h-5 text-teal-600" /><h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2></div>
                <KnowledgeCheck questions={KNOWLEDGE_CHECKS} />
              </motion.div>
            </section>

            {/* Concepts */}
            <section id="sec-concepts" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-teal-600" /><h2 className="text-xl font-bold text-gray-900">Key Concepts</h2></div>
                <div className="space-y-4">{content.concepts.map((concept, idx) => <ConceptCard key={concept.id} concept={concept} index={idx} />)}</div>
              </motion.div>
            </section>

            {/* Recap */}
            <section id="sec-recap" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <RecapSection title="Lesson Recap" items={[
                  { id: 1, title: "Neecha Bhanga = 'Cancellation of Debi...", summary: "Neecha Bhanga = 'Cancellation of Debilitation' — the most powerful exception handler in Jyotish." },
                  { id: 2, title: "Critical condition: Dispositor MUST b...", summary: "Critical condition: Dispositor MUST be in a Kendra (1,4,7,10). Without this, no cancellation." },
                  { id: 3, title: "Secondary conditions: Exaltation lord...", summary: "Secondary conditions: Exaltation lord in Kendra, dispositor exalted, no D-9 debilitation." },
                  { id: 4, title: "Neecha Bhanga Raja Yoga = ALL conditi...", summary: "Neecha Bhanga Raja Yoga = ALL conditions met → debilitation becomes KINGLY power." },
                  { id: 5, title: "Most apps miss this because they stop...", summary: "Most apps miss this because they stop at dignity tables. Grahvani checks the FULL chain." }
                ]} />
              </motion.div>
            </section>

            {/* Quiz */}
            <section id="sec-quiz" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><BrainCircuit className="w-5 h-5 text-teal-600" /><h2 className="text-xl font-bold text-gray-900">Test Your Knowledge</h2></div>
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
                      <p className="text-xl font-bold text-gray-900">Module 13: Derived Houses & Paradox Handling</p>
                      <p className="text-sm text-gray-500 mt-1">Master Bhavat Bhavam, Dispositor Theory, and Karako Bhava Nashaya — the three pillars of advanced chart interpretation.</p>
                    </div>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-teal-600/20 shrink-0">
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
