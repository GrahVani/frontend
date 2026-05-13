"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, ChevronRight, BookOpen, Sparkles,
  BrainCircuit, AlertTriangle, XCircle, CheckCircle, Zap,
  CheckCircle2, Lock, Lightbulb, Layers, Crown } from "lucide-react";
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
  ParadoxArrayChecker,
  type ParadoxRule } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: QuizQuestion[]; }

interface Lesson45InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = [
  "hero", "sec-overview",
  "sec-c1", "sec-c2", "sec-c3", "sec-c4", "sec-c5",
  "sec-paradox-grid", "sec-debug",
  "sec-knowledge", "sec-concepts", "sec-recap", "sec-quiz", "sec-next",
];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-c1", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-c2", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-c3", label: "The 5 Paradoxes", type: "mechanics", group: "Learn" },
  { id: "sec-c4", label: "Why Apps Love Exaltation", type: "case_debug", group: "Learn" },
  { id: "sec-c5", label: "Synthesis", type: "synthesis", group: "Learn" },
  { id: "sec-paradox-grid", label: "Paradox Grid", type: "practice", group: "Practice" },
  { id: "sec-debug", label: "Amateur vs Pro", type: "practice", group: "Practice" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "What is the literal meaning of 'Karako Bhava Nashaya'?", options: ["Significator strengthens the house","Significator destroys the house","Significator ignores the house","Significator exchanges with the house"], correctIndex: 1, explanation: "'Karaka' = significator. 'Bhava' = house. 'Nashaya' = destruction. The significator of a topic, when placed in its own house, OVERLOADS and DESTROYS that house's results." },
  { id: "kc2", question: "Jupiter in the 5th house produces which effect?", options: ["Excellent children and education","Over-intellectualization, delayed children, rigid teaching","No effect on children","Immediate childbirth"], correctIndex: 1, explanation: "Jupiter = significator of children and wisdom. 5th house = children and education. Jupiter in 5th = Karako Bhava Nashaya. The native overthinks parenting, delays having children, and may become a rigid teacher rather than a joyful parent." },
];

const PARADOX_RULES: ParadoxRule[] = [
  { planet: "Jupiter", house: 5, houseName: "Children / Education", effect: "Over-intellectualizes parenting. Delays children. Becomes rigid teacher.", severity: "high" },
  { planet: "Venus", house: 7, houseName: "Marriage / Partnership", effect: "Over-romanticizes marriage. Partner feels suffocated. Multiple relationships.", severity: "high" },
  { planet: "Saturn", house: 6, houseName: "Disease / Enemies", effect: "Chronic health issues. Cannot defeat enemies through normal means.", severity: "critical" },
  { planet: "Mars", house: 3, houseName: "Courage / Siblings", effect: "Over-aggressive with siblings. Courage becomes recklessness.", severity: "medium" },
  { planet: "Sun", house: 1, houseName: "Self / Identity", effect: "Massive ego. Identity crisis when ego is challenged. Narcissistic tendencies.", severity: "high" },
  { planet: "Moon", house: 4, houseName: "Mother / Home", effect: "Over-attached to mother. Emotional dependency. Cannot form independent home.", severity: "medium" },
  { planet: "Mercury", house: 4, houseName: "Education / Home", effect: "Over-analyzes family dynamics. Education becomes rote memorization.", severity: "low" },
  { planet: "Saturn", house: 8, houseName: "Longevity / Transformation", effect: "Extreme longevity but painful transformations. Fear of death.", severity: "critical" },
];

const KARAKA_DATA = [
  { planet: "Sun", planetEn: "Surya", houses: ["1st (Self)", "5th (Children)", "9th (Father)"], color: "bg-amber-500", light: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  { planet: "Moon", planetEn: "Chandra", houses: ["4th (Mother/Home)"], color: "bg-slate-400", light: "bg-slate-50", border: "border-slate-200", text: "text-slate-700" },
  { planet: "Mars", planetEn: "Mangala", houses: ["3rd (Courage/Siblings)", "6th (Enemies/Disease)"], color: "bg-red-500", light: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  { planet: "Mercury", planetEn: "Budha", houses: ["4th (Education)", "6th (Service)", "10th (Career)"], color: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  { planet: "Jupiter", planetEn: "Guru", houses: ["2nd (Wealth)", "5th (Children)", "9th (Fortune)", "11th (Gains)"], color: "bg-yellow-500", light: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" },
  { planet: "Venus", planetEn: "Shukra", houses: ["7th (Marriage)"], color: "bg-pink-500", light: "bg-pink-50", border: "border-pink-200", text: "text-pink-700" },
  { planet: "Saturn", planetEn: "Shani", houses: ["6th (Disease)", "8th (Longevity)", "10th (Career)", "12th (Loss)"], color: "bg-indigo-500", light: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700" },
];

// ─── Karaka Reference Table ───────────────────────────────────
function KarakaReferenceTable() {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Crown className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider">Karaka (Significator) Reference</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Each planet is a natural significator (Karaka) for specific houses. When placed in those houses,
        Karako Bhava Nashaya may trigger. Hover any row to highlight.
      </p>

      <div className="space-y-2">
        {KARAKA_DATA.map((k) => {
          const isHovered = hoveredPlanet === k.planet;
          return (
            <motion.div
              key={k.planet}
              className={`flex flex-wrap items-center gap-2 sm:gap-4 rounded-xl border-2 p-3 transition-all cursor-default ${k.light} ${k.border} ${
                isHovered ? "shadow-md scale-[1.01]" : ""
              }`}
              onMouseEnter={() => setHoveredPlanet(k.planet)}
              onMouseLeave={() => setHoveredPlanet(null)}
            >
              <div className="flex items-center gap-2 min-w-[100px]">
                <div className={`w-3 h-3 rounded-full ${k.color}`} />
                <div>
                  <div className={`text-xs font-bold ${k.text}`}>{k.planet}</div>
                  <div className="text-[10px] text-gray-500">{k.planetEn}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {k.houses.map((h) => (
                  <span
                    key={h}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border ${k.border} ${k.text}`}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-500">
        <span className="font-bold">Rule:</span> If a planet sits in ANY of its Karaka houses, it becomes an "overload" candidate.
        Exaltation or own sign placement intensifies the effect.
      </div>
    </div>
  );
}

// ─── Karaka House Checker ─────────────────────────────────────
function KarakaHouseChecker() {
  const [selected, setSelected] = useState<{ planet: string; house: number } | null>(null);
  const planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
  const houses = [1,2,3,4,5,6,7,8,9,10,11,12];

  const karakaHouses: Record<string, number[]> = {
    Sun: [1,5,9],
    Moon: [4],
    Mars: [3,6],
    Mercury: [4,6,10],
    Jupiter: [2,5,9,11],
    Venus: [7],
    Saturn: [6,8,10,12] };

  const isParadox = selected && karakaHouses[selected.planet]?.includes(selected.house);

  return (
    <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <h3 className="font-bold text-gray-900">Karako Bhava Nashaya Detector</h3>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {planets.map((p) => (
          <button
            key={p}
            onClick={() => setSelected((s) => ({ planet: p, house: s?.house || 1 }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selected?.planet === p
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      {selected && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {houses.map((h) => (
              <button
                key={h}
                onClick={() => setSelected({ ...selected, house: h })}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                  selected.house === h
                    ? isParadox
                      ? "bg-red-600 text-white"
                      : "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <motion.div
            key={`${selected.planet}-${selected.house}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 ${
              isParadox ? "bg-red-50 border-red-400" : "bg-emerald-50 border-emerald-400"
            }`}
          >
            <h4 className={`font-bold text-lg ${isParadox ? "text-red-900" : "text-emerald-900"}`}>
              {isParadox ? "⚠️ KARAKO BHAVA NASHAYA DETECTED" : "✅ Safe Placement"}
            </h4>
            <p className="text-sm mt-1 text-gray-700">
              {isParadox
                ? `${selected.planet} is a significator (Karaka) for house ${selected.house}. Being placed here OVERLOADS the house and destroys its natural results.`
                : `${selected.planet} in house ${selected.house} is NOT a Karako Bhava Nashaya case. The planet operates normally here.`}
            </p>
            {isParadox && (
              <div className="mt-2 text-sm text-red-700 bg-white/60 rounded-lg p-2">
                <strong>Effect:</strong> {" "}
                {PARADOX_RULES.find((r) => r.planet === selected.planet && r.house === selected.house)?.effect || "General overload of house significations."}
              </div>
            )}
          </motion.div>
        </>
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

export default function Lesson45Interactive({ lesson, lessonProgress }: Lesson45InteractiveProps) {
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
            <section id="sec-overview" className="mb-10 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white rounded-2xl border border-amber-200/60 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-gray-900">Lesson Overview</h2></div>
                <p className="text-gray-700 leading-relaxed text-lg">{content.intro}</p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200"><AlertTriangle className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-xs font-bold text-gray-800">5 Core Rules</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200"><XCircle className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-xs font-bold text-gray-800">Destruction Logic</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200"><Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-xs font-bold text-gray-800">Overload Pattern</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200"><CheckCircle className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-xs font-bold text-gray-800">Remedies</div></div>
                </div>
              </motion.div>
            </section>

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

            <section id="sec-paradox-grid" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp} className="space-y-6">
                <KarakaReferenceTable />
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl font-bold text-gray-900">The Paradox Grid</h2>
                </div>
                <ParadoxArrayChecker rules={PARADOX_RULES} />
                <KarakaHouseChecker />
              </motion.div>
            </section>

            <section id="sec-debug" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <DebugComparator
                  scenario="A native has Jupiter exalted in Cancer in the 5th house. They ask about children and education. Most apps say: 'Excellent! Jupiter exalted in 5th = brilliant children and top education!'"
                  amateurOutput={{ title: "Exaltation-Only Analysis", prediction: "Jupiter is exalted in Cancer in the 5th house! This is one of the BEST placements for children and education. Expect brilliant, wise children. The native will excel in teaching, mentoring, and higher studies. A truly blessed chart.", riskLevel: "high" }}
                  professionalOutput={{ title: "Grahvani Paradox Handler", prediction: "KARAKO BHAVA NASHAYA ALERT. Jupiter = significator of children (5th house topic). Jupiter in 5th = OVERLOAD. The native will: (1) Delay having children due to perfectionism, (2) Over-intellectualize parenting, turning it into a project, (3) Be a rigid, preachy teacher rather than an inspiring one, (4) Expect children to be geniuses, causing pressure. The EXALTATION makes the problem WORSE — the native has ENOUGH Jupiter energy to suffocate the 5th house entirely.", overrideReason: "Amateur software adds 'exalted' + '5th house' and gets 'great.' Grahvani adds 'Karaka' + 'own house' and gets 'overload.' The math is identical; the logic is opposite." }}
                  whyItMatters="This is the #1 reason people distrust astrology. The app says 'brilliant children' and the native has no children at 40. The app says 'top education' and the native dropped out of college. Karako Bhava Nashaya explains the gap: the promise EXISTS (exalted Jupiter) but the DELIVERY is destroyed (overload). Without this rule, astrology becomes a cruel joke."
                />
              </motion.div>
            </section>

            <section id="sec-knowledge" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><BrainCircuit className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2></div>
                <KnowledgeCheck questions={KNOWLEDGE_CHECKS} />
              </motion.div>
            </section>

            <section id="sec-concepts" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-gray-900">Key Concepts</h2></div>
                <div className="space-y-4">{content.concepts.map((concept, idx) => <ConceptCard key={concept.id} concept={concept} index={idx} />)}</div>
              </motion.div>
            </section>

            <section id="sec-recap" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <RecapSection title="Lesson Recap" items={[
                  { id: 1, title: "Karako Bhava Nashaya = significator i...", summary: "Karako Bhava Nashaya = significator in its own house DESTROYS that house's results." },
                  { id: 2, title: "This is COUNTERINTUITIVE: more energy...", summary: "This is COUNTERINTUITIVE: more energy = worse results, not better." },
                  { id: 3, title: "5 core cases: Jupiter-5th, Venus-7th,...", summary: "5 core cases: Jupiter-5th, Venus-7th, Saturn-6th, Mars-3rd, Sun-1st." },
                  { id: 4, title: "Exaltation makes the problem WORSE by...", summary: "Exaltation makes the problem WORSE by adding more energy to the overload." },
                  { id: 5, title: "Grahvani's Paradox Array checks every...", summary: "Grahvani's Paradox Array checks every planet-house pair automatically." }
                ]} />
              </motion.div>
            </section>

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
                      <p className="text-sm text-amber-600 mb-1 font-medium">Module 13 Complete</p>
                      <p className="text-xl font-bold text-gray-900">You have completed Intermediate Astrology!</p>
                      <p className="text-sm text-gray-500 mt-1">Next: Advanced Level — Divisional Charts, Transit Timing, and Predictive Synthesis.</p>
                    </div>
                    <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-amber-600/20 shrink-0">Return to Dashboard <ChevronRight className="w-4 h-4" /></Link>
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
