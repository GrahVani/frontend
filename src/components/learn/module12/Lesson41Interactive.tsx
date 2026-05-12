"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, ChevronRight,
  BookOpen, Sparkles, BrainCircuit,
  Smile, Frown, Flame, Zap, Droplets, Star
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

import { DebugComparator } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: unknown[]; }

interface Lesson41InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = ["hero","sec-overview","sec-definition","sec-mood-flags","sec-knowledge","sec-concepts","sec-debug","sec-recap","sec-quiz","sec-next"];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-definition", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-mood-flags", label: "Mood Flags", type: "mechanics", group: "Learn" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
  { id: "sec-debug", label: "Venus in Scorpio", type: "practice", group: "Practice" },
  { id: "sec-recap", label: "Recap", type: "recap", group: "Finish" },
  { id: "sec-quiz", label: "Practice Quiz", type: "practice", group: "Finish" },
  { id: "sec-next", label: "Continue", type: "continue", group: "Finish" },
];

const KNOWLEDGE_CHECKS = [
  { id: "kc1", question: "What mood does Saturn produce when placed in the 5th house?", options: ["Garvita (Proud)","Lajjita (Ashamed)","Santushta (Delighted)","Mudita (Agitated)"], correctIndex: 1, explanation: "Saturn in the 5th house = Lajjita (Ashamed). Saturn represents discipline; the 5th house represents joy, creativity, and children. Saturn's structure placed in the joy house produces a constant feeling of shame and embarrassment." },
  { id: "kc2", question: "Venus combust (within 1° of Sun) produces which mood?", options: ["Garvita","Kshudita","Deeptita","Mudita"], correctIndex: 1, explanation: "Kshudita (Starving). Venus is 'eaten' by the Sun's fire. The native craves love but cannot receive it." },
];

const MOOD_FLAGS = [
  { name: "Garvita", translation: "Proud", icon: Star, color: "bg-yellow-50 border-yellow-300 text-yellow-900", badge: "bg-yellow-200 text-yellow-800", trigger: "Planet in exaltation sign OR in Moolatrikona", behavior: "Acts with unshakable confidence. Results delivered with grandiosity.", example: "Exalted Jupiter in Cancer: feelings of superiority, inflated self-belief" },
  { name: "Kshudita", translation: "Starving", icon: Flame, color: "bg-red-50 border-red-300 text-red-900", badge: "bg-red-200 text-red-800", trigger: "Combust by Sun OR placed in enemy's house", behavior: "Desperately craves what the planet promises but cannot access it.", example: "Combust Venus: insatiable need for love but relationships burn out" },
  { name: "Lajjita", translation: "Ashamed", icon: Frown, color: "bg-purple-50 border-purple-300 text-purple-900", badge: "bg-purple-200 text-purple-800", trigger: "Placed in 6th, 8th, or 12th OR hemmed by malefics", behavior: "Acts in fear. Fear of judgment paralyzes house significations.", example: "Saturn in 5th house: afraid to express joy, hides creativity" },
  { name: "Santushta", translation: "Delighted", icon: Smile, color: "bg-green-50 border-green-300 text-green-900", badge: "bg-green-200 text-green-800", trigger: "Placed in friendly house OR conjunct with natural benefic", behavior: "Gives contentment. Results are stable, moderate, and satisfying.", example: "Moon with Jupiter: emotional satisfaction, moderate wealth" },
  { name: "Mudita", translation: "Agitated", icon: Zap, color: "bg-orange-50 border-orange-300 text-orange-900", badge: "bg-orange-200 text-orange-800", trigger: "Placed in inimical house OR heavily aspected by malefic", behavior: "Produces anxious, frenetic energy. Results arrive through conflict.", example: "Mars in 12th house: restless sleep, explosive behind closed doors" },
  { name: "Deeptita", translation: "Thirsty", icon: Droplets, color: "bg-blue-50 border-blue-300 text-blue-900", badge: "bg-blue-200 text-blue-800", trigger: "Deprived of natural element — water in fire, fire in water", behavior: "Not destroyed but uncomfortable. Produces constant craving.", example: "Moon in Aries: needs emotional stimulation constantly" },
];

function MoodFlag({ mood }: { mood: typeof MOOD_FLAGS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = mood.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-shadow hover:shadow-md ${mood.color}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${mood.badge} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base">{mood.name}</h4>
            <p className="text-xs opacity-70 font-medium">{mood.translation}</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${mood.badge}`}>{mood.translation.toUpperCase()}</span>
      </div>
      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 pt-3 border-t border-current/20 space-y-2">
          <div><span className="font-semibold text-sm">Trigger: </span><span className="text-sm opacity-80">{mood.trigger}</span></div>
          <div><span className="font-semibold text-sm">Behavior: </span><span className="text-sm opacity-80">{mood.behavior}</span></div>
          <div className="bg-white/50 rounded-lg p-2 text-sm"><span className="font-semibold">Example: </span>{mood.example}</div>
        </motion.div>
      )}
    </motion.div>
  );
}

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as const }, transition: { duration: 0.5 } };

function getAllText(content: LessonContent): string {
  const parts = [content.intro];
  content.sections?.forEach((s) => parts.push(s.content));
  content.concepts.forEach((c) => parts.push(c.description));
  return parts.join(" ");
}

export default function Lesson41Interactive({ lesson, lessonProgress }: Lesson41InteractiveProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100">
      <ScrollProgress />
      <section id="hero" className="relative bg-gradient-to-br from-teal-900 via-slate-900 to-cyan-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-teal-500 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-cyan-500 blur-3xl" />
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="inline-flex items-center gap-1 text-teal-300 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" />Back to Learning Path</Link>
          <div className="flex items-center gap-2 mb-3"><GraduationCap className="w-5 h-5 text-teal-400" /><span className="text-teal-400 text-sm font-semibold tracking-wide uppercase">Intermediate — Module 12.2</span></div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl">{lesson.title}</h1>
          <p className="text-teal-200 text-lg max-w-2xl leading-relaxed">{content.intro}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-teal-300"><ReadingTime text={allText} /><span className="flex items-center gap-1"><Smile className="w-4 h-4" /> Mood Mapping</span></div>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          <div className="hidden lg:block w-72 shrink-0 sticky top-4 self-start h-fit">
            <LessonSidebar sections={SIDEBAR_SECTIONS} activeSection={activeSection} completedSections={completedSections} onNavigate={scrollToSection} progress={progress} />
          </div>
          <div className="flex-1 min-w-0">
            <section id="sec-overview" className="mb-10 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-white rounded-2xl border border-teal-200/60 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-teal-600" /><h2 className="text-xl font-bold text-gray-900">Lesson Overview</h2></div>
                <p className="text-gray-700 leading-relaxed text-lg">{content.intro}</p>
                <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-2">
                  {MOOD_FLAGS.map((m) => (
                    <div key={m.name} className={`p-2 rounded-lg text-center border ${m.color}`}>
                      <m.icon className="w-5 h-5 mx-auto mb-1 opacity-70" />
                      <div className="text-xs font-bold">{m.name}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {content.sections?.map((section, idx) => (
              <section key={section.id} id={idx === 0 ? "sec-definition" : idx === 1 ? "sec-etymology" : idx === 2 ? "sec-debug" : idx === 3 ? "sec-synthesis" : `sec-${idx}`} className="mb-6 scroll-mt-32" onClick={() => markSectionComplete(section.id)}>
                <motion.div {...fadeUp}><LessonSection section={section} index={idx} /></motion.div>
              </section>
            ))}

            <section id="sec-mood-flags" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><Smile className="w-5 h-5 text-teal-600" /><h2 className="text-xl font-bold text-gray-900">The Six Lajjitadi Mood Flags</h2><span className="text-xs text-gray-500 ml-2">(Click to expand)</span></div>
                <div className="grid md:grid-cols-2 gap-3">
                  {MOOD_FLAGS.map((mood) => <MoodFlag key={mood.name} mood={mood} />)}
                </div>
              </motion.div>
            </section>

            <section id="sec-debug" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <DebugComparator
                  scenario="A native has Venus at 7° Scorpio (debilitated) in the 7th house, with Jupiter in Pisces (1st house). They ask about marriage prospects."
                  amateurOutput={{ title: "Dignity-Only Analysis", prediction: "Debilitated Venus in the 7th house. Marriage will be difficult. Saturn aspects the 7th from the 10th. Delayed marriage until 32+. Not a favorable period.", riskLevel: "medium" }}
                  professionalOutput={{ title: "Grahvani Mood Engine + Exception Handler", prediction: "CRITICAL CORRECTION: Venus is Kshudita (Starving) — placed in enemy territory. Venus ALSO receives Neecha Bhanga because its dispositor (Mars) is in a Kendra. The native will have INTENSE, compulsive attraction but suffer from starvation. Marriage WILL happen (Jupiter 1st protects), but the dynamic is: craving → possession → dissatisfaction → repeat.", overrideReason: "Without Lajjitadi mood detection, software misses the 'why' behind the prediction." }}
                  whyItMatters="Lajjitadi Avastha gives the PSYCHOLOGICAL texture. Combined with Neecha Bhanga, you predict not just IF but HOW the marriage will feel."
                />
              </motion.div>
            </section>

            <section id="sec-knowledge" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><BrainCircuit className="w-5 h-5 text-teal-600" /><h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2></div>
                <KnowledgeCheck questions={KNOWLEDGE_CHECKS} />
              </motion.div>
            </section>

            <section id="sec-concepts" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-teal-600" /><h2 className="text-xl font-bold text-gray-900">Key Concepts</h2></div>
                <div className="space-y-4">{content.concepts.map((concept, idx) => <ConceptCard key={concept.id} concept={concept} index={idx} />)}</div>
              </motion.div>
            </section>

            <section id="sec-recap" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <RecapSection title="Lesson Recap" items={[
                  { id: 1, title: "Lajjitadi Avastha calculates a Graha'...", summary: "Lajjitadi Avastha calculates a Graha's PSYCHOLOGICAL mood based on placement." },
                  { id: 2, title: "Six moods: Garvita, Kshudita, Lajjita...", summary: "Six moods: Garvita, Kshudita, Lajjita, Santushta, Mudita, Deeptita." },
                  { id: 3, title: "These are NOT degrees — they are hous...", summary: "These are NOT degrees — they are house, combustion, and aspect conditions." },
                  { id: 4, title: "Kshudita + Neecha = the most difficul...", summary: "Kshudita + Neecha = the most difficult combination." },
                  { id: 5, title: "Lajjitadi explains WHY a planet behav...", summary: "Lajjitadi explains WHY a planet behaves as it does, not just WHAT it produces." }
                ]} />
              </motion.div>
            </section>

            <section id="sec-quiz" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <div className="flex items-center gap-2 mb-4"><BrainCircuit className="w-5 h-5 text-teal-600" /><h2 className="text-xl font-bold text-gray-900">Test Your Knowledge</h2></div>
                <InteractiveQuiz quiz={content.quiz} concepts={content.concepts} lessonId={lesson.id} />
              </motion.div>
            </section>

            <section id="sec-next" className="mb-12 scroll-mt-32">
              <motion.div {...fadeUp} className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-teal-200 text-sm mb-1">Next in Module 12</p>
                    <p className="text-xl font-bold">Neecha Bhanga — The Exception Handler</p>
                    <p className="text-teal-200 text-sm mt-1">Why some &apos;debilitated&apos; planets produce MORE power than exalted ones.</p>
                  </div>
                  <Link href="/learn" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }} className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors shrink-0 flex items-center gap-2">Continue <ChevronRight className="w-4 h-4" /></Link>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
