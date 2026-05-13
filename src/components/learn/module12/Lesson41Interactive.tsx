"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, ChevronRight,
  BookOpen, Sparkles, BrainCircuit,
  Smile, Frown, Flame, Zap, Droplets, Star,
  CheckCircle2, Lock, Lightbulb, Layers,
  Target, AlertTriangle,
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

import { DebugComparator } from "@/components/learn/intermediate";

// ─── Types ────────────────────────────────────────────────────
interface Concept {
  id: number; title: string; description: string; icon?: string;
  keyTakeaway?: string; proTip?: string; commonMistake?: string;
}
interface LessonContent { intro: string; sections?: Section[]; concepts: Concept[]; quiz: QuizQuestion[]; }

interface Lesson41InteractiveProps {
  lesson: Lesson;
  lessonProgress: LessonProgressData | null;
}

// ─── Static Data ──────────────────────────────────────────────
const SECTION_IDS = [
  "hero", "sec-overview",
  "sec-c1", "sec-c2", "sec-c3", "sec-c4", "sec-c5",
  "sec-mood-flags", "sec-debug",
  "sec-knowledge", "sec-concepts", "sec-recap", "sec-quiz", "sec-next",
];

const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "hero", label: "Introduction", type: "overview", group: "Start" },
  { id: "sec-overview", label: "Overview", type: "overview", group: "Start" },
  { id: "sec-c1", label: "Definition", type: "definition", group: "Learn" },
  { id: "sec-c2", label: "Etymology", type: "etymology", group: "Learn" },
  { id: "sec-c3", label: "Logic Gates", type: "algorithm", group: "Learn" },
  { id: "sec-c4", label: "Mood Overrides Dignity", type: "case_debug", group: "Learn" },
  { id: "sec-c5", label: "Synthesis", type: "synthesis", group: "Learn" },
  { id: "sec-mood-flags", label: "Mood Flags", type: "mechanics", group: "Practice" },
  { id: "sec-debug", label: "Amateur vs Pro", type: "practice", group: "Practice" },
  { id: "sec-knowledge", label: "Knowledge Check", type: "quiz", group: "Practice" },
  { id: "sec-concepts", label: "Key Concepts", type: "concepts", group: "Practice" },
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

// ─── Lajjitadi Trigger Matrix ─────────────────────────────────
function LajjitadiTriggerMatrix() {
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Target className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider">Lajjitadi Trigger Matrix</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Quick-reference map of all six moods, their triggers, and behavioral outputs.
        Hover any row for emphasis.
      </p>

      <div className="space-y-2">
        {MOOD_FLAGS.map((mood, idx) => {
          const Icon = mood.icon;
          const isHovered = hoveredMood === mood.name;
          return (
            <motion.div
              key={mood.name}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className={`grid grid-cols-12 gap-2 sm:gap-3 items-center rounded-xl border-2 p-3 transition-all cursor-default ${mood.color} ${
                isHovered ? "shadow-md scale-[1.01]" : ""
              }`}
              onMouseEnter={() => setHoveredMood(mood.name)}
              onMouseLeave={() => setHoveredMood(null)}
            >
              {/* Icon + Name */}
              <div className="col-span-12 sm:col-span-2 flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${mood.badge} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">{mood.name}</div>
                  <div className="text-[10px] opacity-70">{mood.translation}</div>
                </div>
              </div>

              {/* Trigger */}
              <div className="col-span-12 sm:col-span-4">
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-0.5">Trigger</div>
                <div className="text-xs leading-snug">{mood.trigger}</div>
              </div>

              {/* Behavior */}
              <div className="col-span-12 sm:col-span-3">
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-0.5">Behavior</div>
                <div className="text-xs leading-snug">{mood.behavior}</div>
              </div>

              {/* Example */}
              <div className="col-span-12 sm:col-span-3">
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-0.5">Example</div>
                <div className="text-xs leading-snug opacity-80">{mood.example}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mood Flag Card ───────────────────────────────────────────
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
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {MOOD_FLAGS.map((m) => (
                    <div key={m.name} className={`p-2 rounded-lg text-center border ${m.color}`}>
                      <m.icon className="w-5 h-5 mx-auto mb-1 opacity-70" />
                      <div className="text-xs font-bold">{m.name}</div>
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

            {/* Trigger Matrix */}
            <section id="sec-mood-flags" className="mb-8 scroll-mt-32">
              <motion.div {...fadeUp}>
                <LajjitadiTriggerMatrix />

                {/* Expandable Mood Cards */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-teal-600" />
                    <h2 className="text-xl font-bold text-gray-900">The Six Lajjitadi Mood Flags</h2>
                    <span className="text-xs text-gray-500 ml-2">(Click to expand details)</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {MOOD_FLAGS.map((mood) => <MoodFlag key={mood.name} mood={mood} />)}
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Debug Comparator */}
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
                  { id: 1, title: "Lajjitadi Avastha calculates a Graha'...", summary: "Lajjitadi Avastha calculates a Graha's PSYCHOLOGICAL mood based on placement." },
                  { id: 2, title: "Six moods: Garvita, Kshudita, Lajjita...", summary: "Six moods: Garvita, Kshudita, Lajjita, Santushta, Mudita, Deeptita." },
                  { id: 3, title: "These are NOT degrees — they are hous...", summary: "These are NOT degrees — they are house, combustion, and aspect conditions." },
                  { id: 4, title: "Kshudita + Neecha = the most difficul...", summary: "Kshudita + Neecha = the most difficult combination." },
                  { id: 5, title: "Lajjitadi explains WHY a planet behav...", summary: "Lajjitadi explains WHY a planet behaves as it does, not just WHAT it produces." }
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
                      <p className="text-sm text-amber-600 mb-1 font-medium">Next in Module 12</p>
                      <p className="text-xl font-bold text-gray-900">Neecha Bhanga — The Exception Handler</p>
                      <p className="text-sm text-gray-500 mt-1">Why some &apos;debilitated&apos; planets produce MORE power than exalted ones.</p>
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
