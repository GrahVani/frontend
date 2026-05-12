"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, ChevronRight,
  BookOpen, Sparkles, BrainCircuit, Target,
  Link2, GitBranch, ArrowRight, RotateCcw, Zap
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
import InteractiveQuiz from "@/components/learn/InteractiveQuiz";

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
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: unknown[]; }

interface Lesson44InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero","sec-overview","sec-definition","sec-algorithm","sec-knowledge","sec-concepts","sec-chain-tracer","sec-debug","sec-recap","sec-quiz","sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-algorithm", label: "The Chain Algorithm", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-chain-tracer", label: "Chain Tracer", type: "practice", group: "Practice" },
  { id: "sec-debug", label: "Why Apps Skip This", type: "practice", group: "Practice" },
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
          <div className="flex items-center gap-2 mb-3"><GraduationCap className="w-5 h-5 text-amber-400" /><span className="text-amber-400 text-sm font-semibold tracking-wide uppercase">Intermediate — Module 13.2</span></div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl">{lesson.title}</h1>
          <p className="text-amber-200 text-lg max-w-2xl leading-relaxed">{content.intro}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-amber-300"><ReadingTime text={allText} /><span className="flex items-center gap-1"><Link2 className="w-4 h-4" /> Ruler Chains</span></div>
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
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200"><Link2 className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-xs font-bold text-gray-800">Trace Chain</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200"><Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-xs font-bold text-gray-800">Find Root</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200"><Target className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-xs font-bold text-gray-800">Check Condition</div></div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200"><GitBranch className="w-5 h-5 text-amber-600 mx-auto mb-1" /><div className="text-xs font-bold text-gray-800">Detect Cycles</div></div>
                </div>
              </motion.div>
            </section>

            {content.sections?.map((section, idx) => (
              <section key={section.id} id={idx === 0 ? "sec-definition" : idx === 1 ? "sec-etymology" : idx === 2 ? "sec-algorithm" : idx === 3 ? "sec-debug" : idx === 4 ? "sec-synthesis" : `sec-${idx}`} className="mb-6 scroll-mt-32" onClick={() => markSectionComplete(section.id)}>
                <motion.div {...fadeUp}><LessonSection section={section} index={idx} /></motion.div>
              </section>
            ))}

            <section id="sec-chain-tracer" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp} className="space-y-6">
                <div className="flex items-center gap-2 mb-2"><GitBranch className="w-5 h-5 text-amber-600" /><h2 className="text-xl font-bold text-gray-900">Chain Tracer: Venus in Scorpio</h2></div>
                <ChainTracer nodes={SAMPLE_CHAIN} title="Dispositor Chain" subtitle="Venus → Mars → Saturn" />
                <DispositorChainBuilder />
              </motion.div>
            </section>

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
                  { id: 1, title: "Dispositor = the ruler of the sign a ...", summary: "Dispositor = the ruler of the sign a planet occupies." },
                  { id: 2, title: "Trace the chain from any planet throu...", summary: "Trace the chain from any planet through its dispositors until you reach a Swakshetra (own sign) or a cycle." },
                  { id: 3, title: "The FINAL dispositor's condition dete...", summary: "The FINAL dispositor's condition determines the ENTIRE chain's power." },
                  { id: 4, title: "Dusthana (6,8,12) dispositor = poison...", summary: "Dusthana (6,8,12) dispositor = poisoned root → results destroyed or delayed." },
                  { id: 5, title: "Grahvani automates chain tracing — no...", summary: "Grahvani automates chain tracing — no manual recursion needed." }
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
                    <p className="text-xl font-bold">Karako Bhava Nashaya — The Paradox Handler</p>
                    <p className="text-amber-200 text-sm mt-1">Why a planet in its OWN house can DESTROY that house&apos;s results. The most counterintuitive rule in Jyotish.</p>
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
