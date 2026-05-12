"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, ChevronRight, BookOpen, Sparkles,
  BrainCircuit, Layers, ArrowRight } from "lucide-react";
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
  SynthesisDashboard } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: unknown[]; }

interface Lesson43InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero","sec-overview","sec-definition","sec-table","sec-knowledge","sec-concepts","sec-synthesis","sec-debug","sec-recap","sec-quiz","sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-table", label: "Derived Houses", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-synthesis", label: "Synthesis Dashboard", type: "practice", group: "Practice" },
  { id: "sec-debug", label: "Mother's Wealth", type: "practice", group: "Practice" },
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
          <div className="flex items-center gap-2 mb-3"><GraduationCap className="w-5 h-5 text-amber-400" /><span className="text-amber-400 text-sm font-semibold tracking-wide uppercase">Intermediate — Module 13.1</span></div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl">{lesson.title}</h1>
          <p className="text-amber-200 text-lg max-w-2xl leading-relaxed">{content.intro}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-amber-300"><ReadingTime text={allText} /><span className="flex items-center gap-1"><Layers className="w-4 h-4" /> Derived Houses</span></div>
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
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
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

            {content.sections?.map((section, idx) => (
              <section key={section.id} id={idx === 0 ? "sec-definition" : idx === 1 ? "sec-etymology" : idx === 2 ? "sec-table" : idx === 3 ? "sec-debug" : idx === 4 ? "sec-synthesis" : `sec-${idx}`} className="mb-6 scroll-mt-32" onClick={() => markSectionComplete(section.id)}>
                <motion.div {...fadeUp}><LessonSection section={section} index={idx} /></motion.div>
              </section>
            ))}

            <section id="sec-table" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}><BhavatBhavamExplorer /></motion.div>
            </section>

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
                  { id: 1, title: "Bhavat Bhavam = 'House from House' — ...", summary: "Bhavat Bhavam = 'House from House' — counting houses forward from any base house." },
                  { id: 2, title: "Every house has 12 derived houses, re...", summary: "Every house has 12 derived houses, revealing infinite nuance." },
                  { id: 3, title: "Mother's health = 6th from 4th. Spous...", summary: "Mother's health = 6th from 4th. Spouse's wealth = 2nd from 7th. Children's career = 10th from 5th." },
                  { id: 4, title: "The derived house inherits the base h...", summary: "The derived house inherits the base house's topic but takes the offset house's behavior." },
                  { id: 5, title: "Grahvani automates this with recursiv...", summary: "Grahvani automates this with recursive house traversal — no manual counting needed." }
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
                    <p className="text-amber-200 text-sm mb-1">Next in Module 13</p>
                    <p className="text-xl font-bold">Dispositor Theory — The Ruler Chain</p>
                    <p className="text-amber-200 text-sm mt-1">Trace the chain of rulers from any planet back to its ultimate dispositor. The key to chart synthesis.</p>
                  </div>
                  <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="px-6 py-3 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors shrink-0 flex items-center gap-2">Continue <ChevronRight className="w-4 h-4" /></Link>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
