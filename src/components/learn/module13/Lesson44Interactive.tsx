"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, ChevronRight,
  BookOpen, Sparkles, BrainCircuit, Target,
  Link2, GitBranch, ArrowRight, RotateCcw, Zap,
  CheckCircle2, Lock, Lightbulb, Layers, Crown
} from "lucide-react";
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
  ChainTracer,
  type ChainNode,
} from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: QuizQuestion[]; }

interface Lesson44InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = [
  "hero", "sec-overview",
  "sec-c1", "sec-c2", "sec-c3", "sec-c4", "sec-c5",
  "sec-chain-tracer", "sec-debug",
  "sec-knowledge", "sec-concepts", "sec-recap", "sec-quiz", "sec-next",
];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-c1", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-c2", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-c3", label: "Chain Algorithm", type: "algorithm", group: "Learn" },
  { id: "sec-c4", label: "Why Apps Skip", type: "case_debug", group: "Learn" },
  { id: "sec-c5", label: "Synthesis", type: "synthesis", group: "Learn" },
  { id: "sec-chain-tracer", label: "Chain Tracer", type: "practice", group: "Practice" },
  { id: "sec-debug", label: "Amateur vs Pro", type: "practice", group: "Practice" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "If Jupiter is in Capricorn, who is its dispositor?", options: ["Saturn","Mars","Venus","Mercury"], correctIndex: 0, explanation: "Capricorn is ruled by Saturn. Therefore, Saturn is Jupiter's dispositor. Jupiter is debilitated in Capricorn, so Saturn's condition CRITICALLY affects Jupiter's results." },
  { id: "kc2", question: "What happens when a planet's dispositor is in a Dusthana (6,8,12)?", options: ["Results are amplified","Results are destroyed or delayed","Results remain unchanged","Planet becomes exalted"], correctIndex: 1, explanation: "Dusthana placement of the dispositor = 'poisoned root.' The planet cannot deliver its promises because its ruler is in a house of loss, disease, or debt." },
];

const SAMPLE_CHAIN: ChainNode[] = [
  { id: "n1", label: "Venus in Scorpio", subtitle: "Debilitated in enemy sign", strength: "weak" },
  { id: "n2", label: "Mars (dispositor)", subtitle: "Ruler of Scorpio", strength: "medium" },
  { id: "n3", label: "Saturn (dispositor)", subtitle: "Ruler of Capricorn", strength: "strong" },
  { id: "n4", label: "Saturn in own sign", subtitle: "Chain terminates — Swakshetra", strength: "strong", isCEO: true },
];

const SIGN_RULERS = [
  { sign: "Aries", ruler: "Mars", rulerEn: "Mangala", color: "bg-red-500", light: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  { sign: "Taurus", ruler: "Venus", rulerEn: "Shukra", color: "bg-pink-500", light: "bg-pink-50", border: "border-pink-200", text: "text-pink-700" },
  { sign: "Gemini", ruler: "Mercury", rulerEn: "Budha", color: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  { sign: "Cancer", ruler: "Moon", rulerEn: "Chandra", color: "bg-slate-400", light: "bg-slate-50", border: "border-slate-200", text: "text-slate-700" },
  { sign: "Leo", ruler: "Sun", rulerEn: "Surya", color: "bg-amber-500", light: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  { sign: "Virgo", ruler: "Mercury", rulerEn: "Budha", color: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  { sign: "Libra", ruler: "Venus", rulerEn: "Shukra", color: "bg-pink-500", light: "bg-pink-50", border: "border-pink-200", text: "text-pink-700" },
  { sign: "Scorpio", ruler: "Mars", rulerEn: "Mangala", color: "bg-red-500", light: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  { sign: "Sagittarius", ruler: "Jupiter", rulerEn: "Guru", color: "bg-yellow-500", light: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" },
  { sign: "Capricorn", ruler: "Saturn", rulerEn: "Shani", color: "bg-indigo-500", light: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700" },
  { sign: "Aquarius", ruler: "Saturn", rulerEn: "Shani", color: "bg-indigo-500", light: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700" },
  { sign: "Pisces", ruler: "Jupiter", rulerEn: "Guru", color: "bg-yellow-500", light: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" },
];

// ─── Sign Ruler Reference Table ───────────────────────────────
function SignRulerReferenceTable() {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Crown className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider">Sign-to-Ruler Reference</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Every planet in a sign is &quot;owned&quot; by that sign&apos;s ruler. To trace a dispositor chain, you must know these mappings by heart.
        Hover a planet in the legend to highlight its signs.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {planets.map((p) => (
          <button
            key={p}
            onMouseEnter={() => setHoveredPlanet(p)}
            onMouseLeave={() => setHoveredPlanet(null)}
            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
              hoveredPlanet === p ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-gray-100 text-gray-600 border border-transparent"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {SIGN_RULERS.map((s) => {
          const isHighlighted = hoveredPlanet === null || hoveredPlanet === s.ruler;
          return (
            <motion.div
              key={s.sign}
              className={`rounded-lg border-2 p-2.5 text-center transition-all ${s.light} ${s.border} ${
                isHighlighted ? "opacity-100" : "opacity-40"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`text-xs font-bold ${s.text}`}>{s.sign}</div>
              <div className={`text-[10px] font-semibold mt-0.5`}>{s.ruler}</div>
              <div className="text-[9px] text-gray-500">{s.rulerEn}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Dispositor Chain Builder ─────────────────────────────────
function DispositorChainBuilder() {
  const [chain, setChain] = useState<{ planet: string; sign: string; dispositor: string }[]>([
    { planet: "Venus", sign: "Scorpio", dispositor: "Mars" },
  ]);
  const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  const RULERS: Record<string, string> = { Aries:"Mars", Taurus:"Venus", Gemini:"Mercury", Cancer:"Moon", Leo:"Sun", Virgo:"Mercury", Libra:"Venus", Scorpio:"Mars", Sagittarius:"Jupiter", Capricorn:"Saturn", Aquarius:"Saturn", Pisces:"Jupiter" };

  const addLink = () => {
    const last = chain[chain.length - 1];
    const dispositorSign = prompt(`Where is ${last.dispositor} placed? (Enter sign name)`, "Capricorn");
    if (!dispositorSign || !SIGNS.includes(dispositorSign)) return;
    const nextDispositor = RULERS[dispositorSign];
    setChain([...chain, { planet: last.dispositor, sign: dispositorSign, dispositor: nextDispositor }]);
  };

  const reset = () => setChain([{ planet: "Venus", sign: "Scorpio", dispositor: "Mars" }]);

  const last = chain[chain.length - 1];
  const isCycle = chain.some((c, i) => i < chain.length - 1 && c.planet === last.dispositor);
  const isOwnSign = last.planet === last.dispositor || (last.planet === "Mars" && ["Aries","Scorpio"].includes(last.sign)) || (last.planet === "Venus" && ["Taurus","Libra"].includes(last.sign)) || (last.planet === "Mercury" && ["Gemini","Virgo"].includes(last.sign)) || (last.planet === "Jupiter" && ["Sagittarius","Pisces"].includes(last.sign)) || (last.planet === "Saturn" && ["Capricorn","Aquarius"].includes(last.sign)) || (last.planet === "Moon" && last.sign === "Cancer") || (last.planet === "Sun" && last.sign === "Leo");

  return (
    <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-5 h-5 text-amber-600" />
        <h3 className="font-bold text-gray-900">Dispositor Chain Builder</h3>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {chain.map((link, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ArrowRight className="w-4 h-4 text-slate-400" />}
            <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-sm">
              <span className="font-bold text-amber-900">{link.planet}</span>
              <span className="text-amber-600"> in {link.sign}</span>
            </div>
          </React.Fragment>
        ))}
        {!isOwnSign && !isCycle && (
          <React.Fragment>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <button onClick={addLink} className="px-3 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors">+ Add Dispositor</button>
          </React.Fragment>
        )}
      </div>
      {isOwnSign && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-medium">
          ✅ Chain terminates — {last.planet} is in its own sign (Swakshetra). This is a STRONG chain endpoint.
        </motion.div>
      )}
      {isCycle && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-orange-50 border border-orange-300 text-orange-800 text-sm font-medium">
          🔄 Cycle detected! The chain loops back. This creates a CLOSED SYSTEM where planets feed each other indefinitely.
        </motion.div>
      )}
      <button onClick={reset} className="mt-3 text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Reset chain</button>
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

export default function Lesson44Interactive({ lesson, lessonProgress }: Lesson44InteractiveProps) {
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200"><Link2 className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-xs font-bold text-gray-800">Trace Chain</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200"><Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-xs font-bold text-gray-800">Find Root</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200"><Target className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-xs font-bold text-gray-800">Check Condition</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200"><GitBranch className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-xs font-bold text-gray-800">Detect Cycles</div></div>
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

            {/* Chain Tracer + Sign Reference */}
            <section id="sec-chain-tracer" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp} className="space-y-6">
                <SignRulerReferenceTable />

                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-gray-900">Chain Tracer: Venus in Scorpio</h2>
                </div>
                <ChainTracer nodes={SAMPLE_CHAIN} title="Dispositor Chain" subtitle="Venus → Mars → Saturn" />
                <DispositorChainBuilder />
              </motion.div>
            </section>

            {/* Debug Comparator */}
            <section id="sec-debug" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <DebugComparator
                  scenario="A native has Venus in Scorpio (debilitated). They ask about marriage quality. Mars (dispositor) is in the 8th house (Capricorn). Saturn (Mars' dispositor) is in the 12th house."
                  amateurOutput={{ title: "Single-House Analysis", prediction: "Venus is debilitated in Scorpio. Marriage will be difficult, possibly with a controlling or secretive partner. The 7th house lord's placement should be checked for timing.", riskLevel: "medium" }}
                  professionalOutput={{ title: "Grahvani Dispositor Chain Analysis", prediction: "FULL CHAIN TRACE: Venus → Mars (8th house, Capricorn) → Saturn (12th house). The chain TERMINATES in the 12th house (loss, foreign lands, bed pleasures). This is a POISONED CHAIN. Venus (love) → Mars (aggression) → Saturn (delay/separation) → 12th (loss). The native will experience: intense attraction (Venus-Scorpio) → conflict (Mars-8th) → eventual separation (Saturn-12th). The TIMING is Saturn Dasha → Mars Bhukti → Venus Antara.", overrideReason: "Amateur software sees 'debilitated Venus.' Grahvani traces the ENTIRE CHAIN to the 12th house and predicts the full arc: attraction → conflict → separation." }}
                  whyItMatters="Without dispositor theory, you tell someone 'marriage may be difficult.' With it, you say: 'You will be drawn to intense partners, fight over secrets, and separate after Saturn matures. The pattern is reversible if you address the 8th house Mars before marriage.' That is the difference between astrology and counseling."
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
                  { id: 1, title: "Dispositor = the ruler of the sign a ...", summary: "Dispositor = the ruler of the sign a planet occupies." },
                  { id: 2, title: "Trace the chain from any planet throu...", summary: "Trace the chain from any planet through its dispositors until you reach a Swakshetra (own sign) or a cycle." },
                  { id: 3, title: "The FINAL dispositor's condition dete...", summary: "The FINAL dispositor's condition determines the ENTIRE chain's power." },
                  { id: 4, title: "Dusthana (6,8,12) dispositor = poison...", summary: "Dusthana (6,8,12) dispositor = poisoned root → results destroyed or delayed." },
                  { id: 5, title: "Grahvani automates chain tracing — no...", summary: "Grahvani automates chain tracing — no manual recursion needed." }
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
                      <p className="text-xl font-bold text-gray-900">Karako Bhava Nashaya — The Paradox Handler</p>
                      <p className="text-sm text-gray-500 mt-1">Why a planet in its OWN house can DESTROY that house&apos;s results. The most counterintuitive rule in Jyotish.</p>
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
