"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, ChevronRight, BookOpen, Sparkles,
  BrainCircuit, Gauge, Zap } from "lucide-react";
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
  DebugComparator,
  FormulaBlock } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface ConceptMedia { type: string; diagramType?: string; caption?: string; }
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string; media?: ConceptMedia;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: unknown[]; }

interface Lesson40InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero", "sec-overview", "sec-definition", "sec-algorithm", "sec-knowledge", "sec-concepts", "sec-simulator", "sec-debug", "sec-recap", "sec-quiz", "sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-algorithm", label: "Odd/Even Algorithm", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-simulator", label: "Power Throttle Gauge", type: "practice", group: "Practice" },
  { id: "sec-debug", label: "Exalted but Dead", type: "practice", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "Which Avastha yields 100% peak power?", options: ["Bala (Infant)", "Kumara (Youth)", "Yuva (Adult)", "Mrita (Dead)"], correctIndex: 2, explanation: "Yuva (Adult) at 12°-18° yields 100% power. This is the only state that delivers full manifestation." },
  { id: "kc2", question: "For an EVEN sign, what is the Avastha at 0°-6°?", options: ["Bala (25%)", "Yuva (100%)", "Mrita (0%)", "Kumara (50%)"], correctIndex: 2, explanation: "Even signs REVERSE the order: 0°-6° = Mrita (Dead/0%). This is the critical trap that breaks amateur software." },
];

const AVASTHA_DATA = [
  { name: "Bala", label: "Infant", power: 25, rangeOdd: "0°-6°", rangeEven: "24°-30°", color: "#f59e0b", desc: "Potential exists but cannot manifest" },
  { name: "Kumara", label: "Youth", power: 50, rangeOdd: "6°-12°", rangeEven: "18°-24°", color: "#3b82f6", desc: "Energy building but inconsistent" },
  { name: "Yuva", label: "Adult", power: 100, rangeOdd: "12°-18°", rangeEven: "12°-18°", color: "#10b981", desc: "Full power and manifestation" },
  { name: "Vriddha", label: "Old", power: 10, rangeOdd: "18°-24°", rangeEven: "6°-12°", color: "#8b5cf6", desc: "Wisdom remains, execution fails" },
  { name: "Mrita", label: "Dead", power: 0, rangeOdd: "24°-30°", rangeEven: "0°-6°", color: "#ef4444", desc: "Complete exhaustion, no manifestation" },
];

// ─── Power Throttle Gauge Sub-component ───────────────────────
function PowerThrottleGauge() {
  const [degree, setDegree] = useState(14);
  const [isOdd, setIsOdd] = useState(true);

  const getAvastha = (deg: number, odd: boolean) => {
    if (deg >= 0 && deg < 6) return odd ? AVASTHA_DATA[0] : AVASTHA_DATA[4];
    if (deg >= 6 && deg < 12) return odd ? AVASTHA_DATA[1] : AVASTHA_DATA[3];
    if (deg >= 12 && deg < 18) return AVASTHA_DATA[2];
    if (deg >= 18 && deg < 24) return odd ? AVASTHA_DATA[3] : AVASTHA_DATA[1];
    return odd ? AVASTHA_DATA[4] : AVASTHA_DATA[0];
  };

  const avastha = getAvastha(degree, isOdd);
  const gaugeRotation = -90 + (avastha.power / 100) * 180;

  return (
    <div className="bg-white rounded-2xl border border-teal-200/60 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-5 h-5 text-teal-600" />
        <h3 className="font-bold text-gray-900">Baladi Power Throttle Gauge</h3>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Degree:</label>
          <input
            type="range"
            min={0}
            max={29.9}
            step={0.1}
            value={degree}
            onChange={(e) => setDegree(parseFloat(e.target.value))}
            className="w-32"
          />
          <span className="text-sm font-mono font-bold text-teal-700 w-14">
            {degree.toFixed(1)}°
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOdd(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isOdd
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Odd Sign
          </button>
          <button
            onClick={() => setIsOdd(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isOdd
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Even Sign
          </button>
        </div>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-32">
          {/* Gauge background */}
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="75%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            {/* Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Tick marks */}
            {[0, 25, 50, 75, 100].map((tick) => {
              const angle = -90 + (tick / 100) * 180;
              const rad = (angle * Math.PI) / 180;
              const x1 = 100 + 70 * Math.cos(rad);
              const y1 = 100 + 70 * Math.sin(rad);
              const x2 = 100 + 60 * Math.cos(rad);
              const y2 = 100 + 60 * Math.sin(rad);
              return (
                <g key={tick}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2" />
                  <text
                    x={100 + 50 * Math.cos(rad)}
                    y={100 + 50 * Math.sin(rad)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[8px] font-bold fill-white"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}
            {/* Needle */}
            <motion.line
              x1="100"
              y1="100"
              x2={100 + 65 * Math.cos((gaugeRotation * Math.PI) / 180)}
              y2={100 + 65 * Math.sin((gaugeRotation * Math.PI) / 180)}
              stroke="#1f2937"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{
                x2: 100 + 65 * Math.cos((gaugeRotation * Math.PI) / 180),
                y2: 100 + 65 * Math.sin((gaugeRotation * Math.PI) / 180) }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
            <circle cx="100" cy="100" r="6" fill="#1f2937" />
          </svg>
        </div>

        {/* Result Card */}
        <motion.div
          key={avastha.name}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 w-full max-w-sm p-4 rounded-xl border-2 text-center"
          style={{ borderColor: avastha.color, backgroundColor: avastha.color + "15" }}
        >
          <h4 className="text-2xl font-bold" style={{ color: avastha.color }}>
            {avastha.name} ({avastha.label})
          </h4>
          <p className="text-3xl font-bold text-gray-900 mt-1">{avastha.power}%</p>
          <p className="text-sm text-gray-600 mt-1">{avastha.desc}</p>
          <div className="mt-2 text-xs font-mono text-gray-500">
            {isOdd ? "Odd" : "Even"} sign: {isOdd ? avastha.rangeOdd : avastha.rangeEven}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as const }, transition: { duration: 0.5 } };

function getAllText(content: LessonContent): string {
  const parts = [content.intro];
  content.sections?.forEach((s) => parts.push(s.content));
  content.concepts.forEach((c) => parts.push(c.description));
  return parts.join(" ");
}

// ─── Component ────────────────────────────────────────────────
export default function Lesson40Interactive({ lesson, lessonProgress }: Lesson40InteractiveProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100">
      <ScrollProgress />

      <section id="hero" className="relative bg-gradient-to-br from-teal-900 via-slate-900 to-cyan-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-teal-500 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-cyan-500 blur-3xl" />
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-teal-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Learning Path
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-teal-400" />
            <span className="text-teal-400 text-sm font-semibold tracking-wide uppercase">Intermediate — Module 12.1</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl">{lesson.title}</h1>
          <p className="text-teal-200 text-lg max-w-2xl leading-relaxed">{content.intro}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-teal-300">
            <ReadingTime text={allText} />
            <span className="flex items-center gap-1"><Gauge className="w-4 h-4" /> Power Throttle</span>
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
              <motion.div {...fadeUp} className="bg-white rounded-2xl border border-teal-200/60 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-bold text-gray-900">Lesson Overview</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{content.intro}</p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {AVASTHA_DATA.map((a) => (
                    <div
                      key={a.name}
                      className="rounded-xl p-3 text-center border-2"
                      style={{ borderColor: a.color, backgroundColor: a.color + "10" }}
                    >
                      <div className="text-lg font-bold" style={{ color: a.color }}>{a.power}%</div>
                      <div className="text-xs font-bold text-gray-700">{a.name}</div>
                      <div className="text-[10px] text-gray-500">{a.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Sections */}
            {content.sections?.map((section, idx) => (
              <section
                key={section.id}
                id={idx === 0 ? "sec-definition" : idx === 1 ? "sec-etymology" : idx === 2 ? "sec-algorithm" : idx === 3 ? "sec-debug" : idx === 4 ? "sec-synthesis" : `sec-${idx}`}
                className="mb-6 scroll-mt-32"
                onClick={() => markSectionComplete(section.id)}
              >
                <motion.div {...fadeUp}>
                  <LessonSection section={section} index={idx} />
                </motion.div>
              </section>
            ))}

            {/* Algorithm Formula */}
            <section id="sec-algorithm" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-bold text-gray-900">The Odd/Even Reversal Algorithm</h2>
                </div>
                <FormulaBlock
                  formula={`ODD SIGNS (Vishama: Aries, Gemini, Leo, Libra, Sagittarius, Aquarius):
─────────────────────────────────────────────────────────────
0°  - 6°   = Bala   (Infant)   → 25%  power
6°  - 12°  = Kumara (Youth)    → 50%  power
12° - 18°  = Yuva   (Adult)    → 100% power
18° - 24°  = Vriddha (Old)     → 10%  power
24° - 30°  = Mrita  (Dead)     → 0%   power

EVEN SIGNS (Sama: Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces):
─────────────────────────────────────────────────────────────
0°  - 6°   = Mrita  (Dead)     → 0%   power
6°  - 12°  = Vriddha (Old)     → 10%  power
12° - 18°  = Yuva   (Adult)    → 100% power
18° - 24°  = Kumara (Youth)    → 50%  power
24° - 30°  = Bala   (Infant)   → 25%  power

CRITICAL: Always check Vishama/Sama BEFORE calculating Avastha!`}
                  label="Baladi Algorithm"
                />
              </motion.div>
            </section>

            {/* Power Throttle Gauge */}
            <section id="sec-simulator" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <PowerThrottleGauge />
              </motion.div>
            </section>

            {/* Debug Comparator */}
            <section id="sec-debug" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <DebugComparator
                  scenario="A native has Sun at 28° of Aries (exalted). They ask about career authority and government success."
                  amateurOutput={{
                    title: "Dignity-Only Prediction",
                    prediction: "You have an Exalted Sun! Expect supreme confidence, government favors, and massive authority! Launch your political career now!",
                    riskLevel: "high" }}
                  professionalOutput={{
                    title: "Grahvani Baladi Override",
                    prediction: "Your Sun is Uccha (exalted) BUT Mrita Avastha (Dead) at 28°. It lacks physical vitality to produce results. You will experience the DESIRE for authority, but it will consistently fail to materialize without intense remediation.",
                    overrideReason: "Aries = Odd sign. 24°-30° = Mrita (0% power). Exaltation without energy = 'Dead King' paradox." }}
                  whyItMatters="Without Baladi Avastha, software creates false confidence. The native takes reckless risks, fails, and blames Jyotish. With Baladi, you give accurate expectations: 'You have the title, not the power. Build energy first.'"
                />
              </motion.div>
            </section>

            {/* Knowledge Checks */}
            <section id="sec-knowledge" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2>
                </div>
                <KnowledgeCheck questions={KNOWLEDGE_CHECKS} />
              </motion.div>
            </section>

            {/* Concepts */}
            <section id="sec-concepts" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-teal-600" />
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
                  { id: 1, title: "Baladi Avastha calculates a Graha's p...", summary: "Baladi Avastha calculates a Graha's physical 'age' based on its exact degree." },
                  { id: 2, title: "Five states: Bala (25%), Kumara (50%)...", summary: "Five states: Bala (25%), Kumara (50%), Yuva (100%), Vriddha (10%), Mrita (0%)." },
                  { id: 3, title: "Odd signs run forward; Even signs REV...", summary: "Odd signs run forward; Even signs REVERSE the sequence." },
                  { id: 4, title: "Always check Avastha BEFORE interpret...", summary: "Always check Avastha BEFORE interpreting dignity." },
                  { id: 5, title: "Uccha + Mrita = 'Dead King' — the mos...", summary: "Uccha + Mrita = 'Dead King' — the most tragic placement in Jyotish." }
                ]} />
              </motion.div>
            </section>

            {/* Quiz */}
            <section id="sec-quiz" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="w-5 h-5 text-teal-600" />
                  <h2 className="text-xl font-bold text-gray-900">Test Your Knowledge</h2>
                </div>
                <InteractiveQuiz quiz={content.quiz} concepts={content.concepts} lessonId={lesson.id} />
              </motion.div>
            </section>

            {/* Next */}
            <section id="sec-next" className="mb-12 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-teal-200 text-sm mb-1">Next in Module 12</p>
                    <p className="text-xl font-bold">Lajjitadi Avasthas — The Mood Engine</p>
                    <p className="text-teal-200 text-sm mt-1">Decode the psychological mood of every planet: Proud, Starving, Ashamed, Delighted, Agitated, Thirsty.</p>
                  </div>
                  <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors shrink-0 flex items-center gap-2">
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
