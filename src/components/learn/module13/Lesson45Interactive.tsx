"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, ChevronRight, BookOpen, Sparkles,
  BrainCircuit, AlertTriangle, XCircle, CheckCircle, Zap } from "lucide-react";
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
  ParadoxArrayChecker,
  type ParadoxRule } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: unknown[]; }

interface Lesson45InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero","sec-overview","sec-definition","sec-paradoxes","sec-knowledge","sec-concepts","sec-paradox-grid","sec-debug","sec-recap","sec-quiz","sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-paradoxes", label: "The 5 Paradoxes", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-paradox-grid", label: "Paradox Grid", type: "practice", group: "Practice" },
  { id: "sec-debug", label: "Why Apps Love Exaltation", type: "practice", group: "Practice" },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100">
      <ScrollProgress />
      <section id="hero" className="relative bg-gradient-to-br from-amber-900 via-slate-900 to-orange-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-amber-500 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-orange-500 blur-3xl" />
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-amber-300 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" />Back to Learning Path</Link>
          <div className="flex items-center gap-2 mb-3"><GraduationCap className="w-5 h-5 text-amber-400" /><span className="text-amber-400 text-sm font-semibold tracking-wide uppercase">Intermediate — Module 13.3</span></div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl">{lesson.title}</h1>
          <p className="text-amber-200 text-lg max-w-2xl leading-relaxed">{content.intro}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-amber-300"><ReadingTime text={allText} /><span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Paradox Handler</span></div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          <div className="hidden lg:block w-72 shrink-0 sticky top-4 self-start h-fit">
            <LessonSidebar sections={SIDEBAR_SECTIONS} activeSection={activeSection} completedSections={completedSections} onNavigate={scrollToSection} progress={progress} />
          </div>
          <div className="flex-1 min-w-0">
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

            {content.sections?.map((section, idx) => (
              <section key={section.id} id={idx === 0 ? "sec-definition" : idx === 1 ? "sec-etymology" : idx === 2 ? "sec-paradoxes" : idx === 3 ? "sec-debug" : idx === 4 ? "sec-synthesis" : `sec-${idx}`} className="mb-6 scroll-mt-32" onClick={() => markSectionComplete(section.id)}>
                <motion.div {...fadeUp}><LessonSection section={section} index={idx} /></motion.div>
              </section>
            ))}

            <section id="sec-paradox-grid" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp} className="space-y-6">
                <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-gray-900">The Paradox Grid</h2></div>
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

            <section id="sec-next" className="mb-12 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-amber-200 text-sm mb-1">Module 13 Complete</p>
                    <p className="text-xl font-bold">You have completed Intermediate Astrology!</p>
                    <p className="text-amber-200 text-sm mt-1">Next: Advanced Level — Divisional Charts, Transit Timing, and Predictive Synthesis.</p>
                  </div>
                  <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="px-6 py-3 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors shrink-0 flex items-center gap-2">Return to Dashboard <ChevronRight className="w-4 h-4" /></Link>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
