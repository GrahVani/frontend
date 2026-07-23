"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  BarChart2,
  Target,
  Award,
  Lightbulb,
  Clock,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ListTodo,
  ArrowRight,
  AlertTriangle,
  Lock,
  Layers,
} from "lucide-react";

import type { CurriculumTier } from "@/lib/learning-runtime/curriculum-index";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface StudyTask {
  lesson: string;
  lessonSlug?: string;
  section?: string;
  sectionId?: string;
  priority: string;
  estimatedDuration: number;
  reason: string;
  expectedOutcome: string;
  type?: string;
}

type TabId = "all" | "planner" | "goals" | "reflections";
import { useProgressStore } from "@/lib/learning-runtime/progress-store";
import {
  aggregateLearnerProfile,
  generateAdaptiveRecommendations,
  generateLearningPath,
  aggregateLearnerMemory,
  generateStudyPlan,
  generateMentorGoals,
  generateAchievements,
  calculateMomentum,
  generateCoachingInterventions,
  evaluateCoachingEffectiveness,
  generateAdaptiveReflection,
  calculateLearningConsistency,
} from "@/lib/learning-runtime/profile/profile-service";

/* ════════════════════════════════════════════════════════════════════
 * VEDIC LUXURY DESIGN PALETTE (Matches CurriculumJourney v4)
 * ════════════════════════════════════════════════════════════════════ */
const GOLD_LIGHT = "#F4D078";

export function LearnerDashboardView({ tiers }: { tiers?: CurriculumTier[] } = {}) {
  const progressState = useProgressStore();
  const router = useRouter();

  const lessonHrefMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (!tiers) return map;
    for (const tier of tiers) {
      for (const mod of tier.modules) {
        for (const ch of mod.chapters) {
          for (const lesson of ch.lessons) {
            if (lesson.canonicalSlug) map[lesson.canonicalSlug] = lesson.href;
            if (lesson.slug) map[lesson.slug] = lesson.href;
            if (lesson.title) map[lesson.title] = lesson.href;
          }
        }
      }
    }
    return map;
  }, [tiers]);

  const getTaskHref = React.useCallback((task: StudyTask) => {
    if (task.lessonSlug && lessonHrefMap[task.lessonSlug]) {
      return lessonHrefMap[task.lessonSlug];
    }
    if (task.lesson && lessonHrefMap[task.lesson]) {
      return lessonHrefMap[task.lesson];
    }
    const fallbackMap: Record<string, string> = {
      "jyotisha-as-vedanga": "/learn/tier-1/module-1/chapter-1/lesson-1",
      "the-six-vedangas-and-their-relationship": "/learn/tier-1/module-1/chapter-1/lesson-2",
      "jyotisha-vs-western-astrology-vs-pop-astrology": "/learn/tier-1/module-1/chapter-1/lesson-3",
      "philosophy-of-karma-and-prediction": "/learn/tier-1/module-1/chapter-2/lesson-4",
      "the-historical-timeline-of-jyotisha": "/learn/tier-1/module-1/chapter-2/lesson-5",
      "parashara-the-foundational-rishi": "/learn/tier-1/module-1/chapter-3/lesson-6",
      "varahamihira-the-systematic-codifier": "/learn/tier-1/module-1/chapter-3/lesson-7",
      "medieval-codifiers-kalyanavarma-mantresvara": "/learn/tier-1/module-1/chapter-4/lesson-8",
      "jaimini-and-the-second-tradition": "/learn/tier-1/module-1/chapter-4/lesson-9",
      "modern-founders-krishnamurti-and-joshi": "/learn/tier-1/module-1/chapter-4/lesson-10",
      "Jyotiṣa as a Vedāṅga": "/learn/tier-1/module-1/chapter-1/lesson-1",
      "The Six Vedāṅgas and Their Relationship": "/learn/tier-1/module-1/chapter-1/lesson-2",
      "Jyotiṣa vs Western vs Pop Astrology": "/learn/tier-1/module-1/chapter-1/lesson-3",
      "Philosophy of Karma and Prediction": "/learn/tier-1/module-1/chapter-2/lesson-4",
      "The Historical Timeline of Jyotiṣa": "/learn/tier-1/module-1/chapter-2/lesson-5",
      "Parāśara: The Foundational Ṛṣi": "/learn/tier-1/module-1/chapter-3/lesson-6",
      "Varāhamihira: The Systematic Codifier": "/learn/tier-1/module-1/chapter-3/lesson-7",
      "Medieval Codifiers: Kalyāṇavarmā & Mantreśvara": "/learn/tier-1/module-1/chapter-4/lesson-8",
      "Jaimini and the Second Tradition": "/learn/tier-1/module-1/chapter-4/lesson-9",
      "Modern Founders: Krishnamurti and Joshi": "/learn/tier-1/module-1/chapter-4/lesson-10",
    };
    if (task.lessonSlug && fallbackMap[task.lessonSlug]) {
      return fallbackMap[task.lessonSlug];
    }
    if (task.lesson && fallbackMap[task.lesson]) {
      return fallbackMap[task.lesson];
    }
    return "/learn";
  }, [lessonHrefMap]);

  const [plannerExpanded, setPlannerExpanded] = useState(true);
  const [consistencyExpanded, setConsistencyExpanded] = useState(true);
  const [mentorExpanded, setMentorExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const {
    studyPlan,
    mentorGoals,
    achievements,
    momentum,
    coachingEffectiveness,
    adaptiveReflection,
    learningConsistency,
  } = useMemo(() => {
    const profile = aggregateLearnerProfile(progressState);
    const adaptiveRecs = generateAdaptiveRecommendations(profile, progressState);
    const learningPath = generateLearningPath(profile, progressState);
    const memory = aggregateLearnerMemory(progressState);
    const plan = generateStudyPlan(profile, memory, adaptiveRecs, learningPath, progressState);
    const goals = generateMentorGoals(profile, memory, progressState);
    const achs = generateAchievements(profile, memory, progressState);
    const mom = calculateMomentum(profile, memory, progressState);
    const interventions = generateCoachingInterventions(profile, memory, progressState, plan, mom, achs);
    const effectiveness = evaluateCoachingEffectiveness(profile, memory, progressState, interventions);
    const reflection = generateAdaptiveReflection(profile, memory, progressState, effectiveness);
    const consistency = calculateLearningConsistency(profile, memory, progressState);

    return {
      studyPlan: plan,
      mentorGoals: goals,
      achievements: achs,
      momentum: mom,
      coachingEffectiveness: effectiveness,
      adaptiveReflection: reflection,
      learningConsistency: consistency,
    };
  }, [progressState]);

  const completedDailyGoals = useMemo(
    () => mentorGoals.filter((g) => g.type === "daily" && g.status === "completed").length,
    [mentorGoals]
  );
  const totalDailyGoals = useMemo(
    () => mentorGoals.filter((g) => g.type === "daily").length,
    [mentorGoals]
  );
  const unlockedAchievements = useMemo(
    () => achievements.filter((a) => a.unlocked).length,
    [achievements]
  );

  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#B88421]/20 selection:text-[#1A1408]">
      {/* Soft background radial glow and subtle watermark */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle, ${GOLD_LIGHT} 0%, transparent 70%)` }}
        />
        <span
          className="absolute top-20 right-10 font-serif text-[280px] leading-none opacity-[0.03] select-none text-[#8B6312]"
          style={{ fontFamily: "var(--font-devanagari), serif" }}
        >
          ज्योतिष
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-1 space-y-10">
        {/* ── Page Header & Interactive Tabs ───────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#B88421]/20 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B88421]/10 border border-[#B88421]/30 text-[#8B6312] text-xs font-bold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#B88421]" />
              AI Mentor &amp; Learning Analytics · Tier 1
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#1A1408] tracking-tight leading-tight">
              Jyotiṣa Learner Analytics
            </h1>
            <p className="text-[#6B583D] text-base max-w-2xl font-normal leading-relaxed">
              Your dynamically generated study planner, daily momentum index, consistency metrics, and AI mentor coaching engine.
            </p>
          </div>

          {/* Full-Width / Scannable Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#FFFDF8] border border-[#B88421]/25 rounded-xl shadow-sm self-start md:self-auto overflow-x-auto max-w-full">
            {[
              { id: "all" as TabId, label: "Overview", icon: Layers },
              { id: "planner" as TabId, label: "Study Planner", icon: Calendar },
              { id: "goals" as TabId, label: "Mentor Goals", icon: Target },
              { id: "reflections" as TabId, label: "Reflections", icon: Lightbulb },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-[#B88421] to-[#8B6312] text-white shadow-md"
                      : "text-[#6B583D] hover:bg-[#FAF3E3] hover:text-[#1A1408]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* ── Top Hero Metrics Ribbon (Always Visible Across All Tabs) ─── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Metric 1: Momentum */}
          <div className="bg-[#FFFDF8]/95 border border-[#B88421]/25 rounded-2xl p-5 shadow-[0_4px_20px_rgba(139,99,18,0.06)] hover:shadow-[0_8px_28px_rgba(139,99,18,0.12)] transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B583D] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#B88421]" /> Momentum Index
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  momentum.trend === "rising"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : momentum.trend === "declining"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-blue-50 text-blue-800 border-blue-200"
                }`}
              >
                {momentum.trend}
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-4xl font-serif font-bold text-[#1A1408] group-hover:text-[#8B6312] transition-colors">
                {momentum.score}%
              </span>
              <span className="text-xs text-[#6B583D]">Target: 80%+</span>
            </div>
            <div className="mt-3 w-full bg-[#ECE5D5] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D4AF37] to-[#8B6312] h-full rounded-full transition-all duration-500"
                style={{ width: `${momentum.score}%` }}
              />
            </div>
          </div>

          {/* Metric 2: Consistency */}
          <div className="bg-[#FFFDF8]/95 border border-[#B88421]/25 rounded-2xl p-5 shadow-[0_4px_20px_rgba(139,99,18,0.06)] hover:shadow-[0_8px_28px_rgba(139,99,18,0.12)] transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B583D] flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-[#8B6312]" /> Consistency Index
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  learningConsistency.trend === "improving"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : learningConsistency.trend === "declining"
                    ? "bg-rose-50 text-rose-800 border-rose-200"
                    : "bg-purple-50 text-purple-800 border-purple-200"
                }`}
              >
                {learningConsistency.trend}
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-4xl font-serif font-bold text-[#1A1408] group-hover:text-[#8B6312] transition-colors">
                {learningConsistency.consistency}%
              </span>
              <span className="text-xs text-[#6B583D]">Attendance: {learningConsistency.attendance}%</span>
            </div>
            <div className="mt-3 w-full bg-[#ECE5D5] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#8B6312] to-[#B88421] h-full rounded-full transition-all duration-500"
                style={{ width: `${learningConsistency.consistency}%` }}
              />
            </div>
          </div>

          {/* Metric 3: Today's Study Load */}
          <div className="bg-[#FFFDF8]/95 border border-[#B88421]/25 rounded-2xl p-5 shadow-[0_4px_20px_rgba(139,99,18,0.06)] hover:shadow-[0_8px_28px_rgba(139,99,18,0.12)] transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B583D] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#B88421]" /> Today&apos;s Study Load
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                {studyPlan.todayTasks.length} Tasks Due
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-4xl font-serif font-bold text-[#1A1408] group-hover:text-[#8B6312] transition-colors">
                {studyPlan.estimatedStudyTime}m
              </span>
              <span className="text-xs text-[#6B583D]">Recommended</span>
            </div>
            <p className="mt-3 text-xs text-[#6B583D] truncate">
              {(studyPlan.todayTasks[0] as StudyTask)?.lesson || "All daily tasks caught up"}
            </p>
          </div>

          {/* Metric 4: Mastery Forecast */}
          <div className="bg-[#FFFDF8]/95 border border-[#B88421]/25 rounded-2xl p-5 shadow-[0_4px_20px_rgba(139,99,18,0.06)] hover:shadow-[0_8px_28px_rgba(139,99,18,0.12)] transition-all flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B583D] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#8B6312]" /> Mastery Forecast
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                Tier 1 Goal
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-4xl font-serif font-bold text-[#1A1408] group-hover:text-[#8B6312] transition-colors">
                {studyPlan.completionForecast}d
              </span>
              <span className="text-xs text-[#6B583D]">Est. Completion</span>
            </div>
            <p className="mt-3 text-xs text-[#6B583D] truncate">
              At current pace of {Math.max(1, Math.round(studyPlan.estimatedStudyTime))} mins/day
            </p>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════
         * TAB 1: OVERVIEW (Balanced 2-Row Grid across Full Widescreen Width)
         * ═════════════════════════════════════════════════════════════════ */}
        {activeTab === "all" && (
          <div className="space-y-8 w-full">
            {/* Row 1: Study Planner (7 cols) + AI Mentor Goals (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Intelligent Study Planner Card (7 cols) */}
              <div className="lg:col-span-7 bg-[#FFFDF8] border border-[#B88421]/25 rounded-2xl shadow-[0_8px_32px_rgba(139,99,18,0.07)] overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setPlannerExpanded(!plannerExpanded)}
                  className="w-full px-6 py-5 bg-gradient-to-r from-[#FBF7ED] to-[#FFFDF8] border-b border-[#B88421]/15 flex items-center justify-between hover:bg-[#FAF3E3] transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#B88421]/10 border border-[#B88421]/25 flex items-center justify-center text-[#8B6312] shadow-sm">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-[#1A1408] text-2xl">
                        Intelligent Study Planner
                      </h2>
                      <p className="text-xs text-[#6B583D] mt-0.5">
                        Dynamic daily schedule tailored by your AI mentor &amp; spaced repetition engine.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#B88421]/10 text-[#8B6312] border border-[#B88421]/20">
                      {studyPlan.todayTasks.length} Today · {studyPlan.tomorrowTasks.length} Tomorrow
                    </span>
                    {plannerExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[#8B6312]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#8B6312]" />
                    )}
                  </div>
                </button>

                {plannerExpanded && (
                  <div className="p-6 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#8B6312] flex items-center gap-2">
                          <ListTodo className="w-4 h-4 text-[#B88421]" /> Today&apos;s High-Priority Tasks ({studyPlan.todayTasks.length})
                        </h3>
                        {studyPlan.burnoutRisk === "high" && (
                          <span className="text-xs text-rose-700 font-semibold flex items-center gap-1 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5" /> High Burnout Risk — Take a rest break
                          </span>
                        )}
                      </div>

                      {studyPlan.todayTasks.length > 0 ? (
                        <div className="space-y-3.5">
                          {studyPlan.todayTasks.map((t: StudyTask, idx: number) => {
                            const taskHref = getTaskHref(t);
                            return (
                              <Link
                                key={idx}
                                href={taskHref}
                                className="block bg-[#FFFDF8] p-5 rounded-xl border border-[#B88421]/25 hover:border-[#B88421]/60 shadow-sm hover:shadow-md transition-all duration-200 space-y-3 group relative overflow-hidden text-left no-underline cursor-pointer"
                              >
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#D4AF37] to-[#8B6312]" />
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div>
                                    <span className="font-serif font-bold text-[#1A1408] text-lg group-hover:text-[#8B6312] transition-colors block">
                                      {t.lesson}
                                    </span>
                                    {t.section && (
                                      <span className="text-xs font-semibold text-[#8B6312] block mt-0.5">
                                        {t.section}
                                      </span>
                                    )}
                                  </div>
                                  <span
                                    className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                                      t.priority === "high"
                                        ? "bg-rose-50 text-rose-800 border border-rose-200 shadow-sm"
                                        : t.priority === "medium"
                                        ? "bg-amber-50 text-amber-800 border border-amber-200 shadow-sm"
                                        : "bg-stone-100 text-stone-700 border border-stone-300"
                                    }`}
                                  >
                                    {t.priority} · {t.estimatedDuration} mins
                                  </span>
                                </div>

                                <p className="text-xs text-[#6B583D] leading-relaxed">
                                  <strong className="text-[#1A1408]">Why now: </strong> {t.reason}
                                </p>

                                <div className="pt-2 border-t border-[#B88421]/15 flex items-center justify-between gap-3">
                                  <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 min-w-0">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span className="truncate">Outcome: {t.expectedOutcome}</span>
                                  </div>
                                  <span className="text-xs font-bold text-[#8B6312] flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                                    Begin Task <ArrowRight className="w-3.5 h-3.5" />
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-[#FBF7ED] p-6 rounded-xl border border-[#B88421]/20 text-center space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                          <p className="font-serif text-lg font-bold text-[#1A1408]">All Daily Tasks Completed!</p>
                          <p className="text-xs text-[#6B583D]">You have met today&apos;s target study cadence. Explore upcoming lessons below.</p>
                        </div>
                      )}
                    </div>

                    {/* Tomorrow's Tasks Preview */}
                    <div className="space-y-3 pt-3 border-t border-[#B88421]/15">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B583D] flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#8B6312]" /> Tomorrow&apos;s Queued Tasks ({studyPlan.tomorrowTasks.length})
                      </h3>
                      {studyPlan.tomorrowTasks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {studyPlan.tomorrowTasks.map((t: StudyTask, idx: number) => {
                            const taskHref = getTaskHref(t);
                            return (
                              <Link
                                key={idx}
                                href={taskHref}
                                className="block bg-[#FAF7F0] p-3.5 rounded-xl border border-[#B88421]/15 flex items-center justify-between gap-3 hover:border-[#B88421]/30 transition-colors no-underline cursor-pointer group"
                              >
                                <div className="min-w-0">
                                  <span className="font-semibold text-[#1A1408] text-xs block truncate group-hover:text-[#8B6312] transition-colors">
                                    {t.lesson}
                                  </span>
                                  <span className="text-[11px] text-[#6B583D] block truncate mt-0.5">
                                    {t.reason}
                                  </span>
                                </div>
                                <span className="text-xs font-bold text-[#8B6312] bg-[#FFFDF8] px-2.5 py-1 rounded-lg border border-[#B88421]/20 shrink-0 group-hover:bg-[#8B6312] group-hover:text-white transition-colors">
                                  {t.estimatedDuration}m
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-[#6B583D] italic">No tasks queued for tomorrow yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Mentor Goals Card (5 cols) */}
              <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#B88421]/25 rounded-2xl shadow-[0_8px_32px_rgba(139,99,18,0.07)] overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setMentorExpanded(!mentorExpanded)}
                  className="w-full px-6 py-5 bg-gradient-to-r from-[#FBF7ED] to-[#FFFDF8] border-b border-[#B88421]/15 flex items-center justify-between hover:bg-[#FAF3E3] transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 shadow-sm">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-[#1A1408] text-2xl">
                        AI Mentor Goals
                      </h2>
                      <p className="text-xs text-[#6B583D] mt-0.5">
                        Active daily targets &amp; milestones set by your AI tutor.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B88421]/10 text-[#8B6312] border border-[#B88421]/20 shrink-0">
                      Daily: {completedDailyGoals}/{totalDailyGoals}
                    </span>
                    {mentorExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[#8B6312]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#8B6312]" />
                    )}
                  </div>
                </button>

                {mentorExpanded && (
                  <div className="p-6 space-y-4">
                    {mentorGoals.filter((g) => g.type === "daily" || g.type === "streak").length > 0 ? (
                      mentorGoals
                        .filter((g) => g.type === "daily" || g.type === "streak")
                        .map((g) => {
                          const progressPct = Math.min(100, Math.round((g.progress / Math.max(1, g.target)) * 100));
                          return (
                            <div
                              key={g.id}
                              className="bg-[#FAF7F0] p-4 rounded-xl border border-[#B88421]/20 space-y-3 shadow-sm hover:border-[#B88421]/40 transition-all"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-serif font-bold text-[#1A1408] text-base block">
                                  {g.title}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border shrink-0 ${
                                    g.status === "completed"
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                      : g.status === "in_progress"
                                      ? "bg-amber-50 text-amber-800 border-amber-200"
                                      : "bg-stone-100 text-stone-600 border-stone-300"
                                  }`}
                                >
                                  {g.status.replace(/_/g, " ")} ({g.priority})
                                </span>
                              </div>

                              <p className="text-xs text-[#6B583D] leading-normal">{g.description}</p>

                              <div className="space-y-1.5 pt-1">
                                <div className="flex items-center justify-between text-xs font-semibold text-[#3D3120]">
                                  <span>Progress: {g.progress} / {g.target}</span>
                                  <span>{progressPct}%</span>
                                </div>
                                <div className="w-full bg-[#ECE5D5] h-2 rounded-full overflow-hidden border border-[#B88421]/15 shadow-inner">
                                  <div
                                    className="bg-gradient-to-r from-[#D4AF37] to-[#8B6312] h-full rounded-full transition-all duration-500 shadow-sm"
                                    style={{ width: `${progressPct}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <p className="text-xs text-[#6B583D] italic text-center py-4">No active daily goals set right now.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Learning Consistency (5 cols) + Milestones & Reflections (7 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Learning Consistency & Discipline Card (5 cols) */}
              <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#B88421]/25 rounded-2xl shadow-[0_8px_32px_rgba(139,99,18,0.07)] overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setConsistencyExpanded(!consistencyExpanded)}
                  className="w-full px-6 py-5 bg-gradient-to-r from-[#FBF7ED] to-[#FFFDF8] border-b border-[#B88421]/15 flex items-center justify-between hover:bg-[#FAF3E3] transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-700 shadow-sm">
                      <BarChart2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-[#1A1408] text-2xl">
                        Consistency Metrics
                      </h2>
                      <p className="text-xs text-[#6B583D] mt-0.5">
                        Attendance cadence &amp; focus quality.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shrink-0 ${
                        learningConsistency.trend === "improving"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : learningConsistency.trend === "declining"
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : "bg-purple-50 text-purple-800 border-purple-200"
                      }`}
                    >
                      {learningConsistency.consistency}%
                    </span>
                    {consistencyExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[#8B6312]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#8B6312]" />
                    )}
                  </div>
                </button>

                {consistencyExpanded && (
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#B88421]/20 text-center space-y-1.5 shadow-sm">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#6B583D]">
                          Attendance Rate
                        </div>
                        <div className="text-3xl font-serif font-bold text-purple-900">
                          {learningConsistency.attendance}%
                        </div>
                        <div className="text-[11px] text-[#6B583D]">Daily cadence</div>
                      </div>
                      <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#B88421]/20 text-center space-y-1.5 shadow-sm">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#6B583D]">
                          Focus Score
                        </div>
                        <div className="text-3xl font-serif font-bold text-purple-900">
                          {learningConsistency.focusScore}%
                        </div>
                        <div className="text-[11px] text-[#6B583D]">Quiz accuracy</div>
                      </div>
                      <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#B88421]/20 text-center space-y-1.5 shadow-sm">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#6B583D]">
                          Discipline Score
                        </div>
                        <div className="text-3xl font-serif font-bold text-purple-900">
                          {learningConsistency.discipline}%
                        </div>
                        <div className="text-[11px] text-[#6B583D]">Spaced reviews</div>
                      </div>
                    </div>

                    <div className="bg-[#FBF7ED] p-4 rounded-xl border border-[#B88421]/20 flex items-start gap-3.5">
                      <Lightbulb className="w-5 h-5 text-[#B88421] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#3D3120] leading-relaxed">
                        <strong>Consistency Insight:</strong> Maintaining daily login cadence and completing section checks directly accelerates your Tier 1 unlock velocity.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Milestones & Adaptive Reflections Card (7 cols) */}
              <div className="lg:col-span-7 bg-[#FFFDF8] border border-[#B88421]/25 rounded-2xl shadow-[0_8px_32px_rgba(139,99,18,0.07)] overflow-hidden transition-all duration-300 space-y-6 p-6">
                {/* Milestones header */}
                <div className="flex items-center justify-between border-b border-[#B88421]/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-700 shadow-sm">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-[#1A1408] text-xl">
                        Milestones &amp; AI Reflections
                      </h3>
                      <p className="text-xs text-[#6B583D]">Earned doctrine seals and live coaching synthesis.</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B88421]/10 text-[#8B6312] border border-[#B88421]/20 shrink-0">
                    Unlocked: {unlockedAchievements}/{achievements.length}
                  </span>
                </div>

                {/* Momentum Alert Banner */}
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3.5 shadow-sm ${
                    momentum.trend === "rising"
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                      : momentum.trend === "declining"
                      ? "bg-amber-50/80 border-amber-200 text-amber-950"
                      : "bg-blue-50/80 border-blue-200 text-blue-950"
                  }`}
                >
                  <TrendingUp className="w-5 h-5 shrink-0 mt-0.5 text-[#B88421]" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Learning Momentum · {momentum.trend} ({momentum.score}%)
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">{momentum.explanation}</p>
                  </div>
                </div>

                {/* Achievements Preview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {achievements.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        a.unlocked
                          ? "bg-[#FAF7F0] border-[#B88421]/30 shadow-sm"
                          : "bg-stone-50/60 border-stone-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            a.unlocked
                              ? "bg-gradient-to-br from-[#D4AF37] to-[#8B6312] text-white shadow-sm"
                              : "bg-stone-200 text-stone-500"
                          }`}
                        >
                          {a.unlocked ? <Award className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <span className="font-serif font-bold text-[#1A1408] text-xs block truncate">
                            {a.title}
                          </span>
                          <span className="text-[11px] text-[#6B583D] block truncate">
                            {a.description}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                          a.unlocked
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm"
                            : "bg-stone-100 text-stone-600 border-stone-300"
                        }`}
                      >
                        {a.unlocked ? "UNLOCKED" : "LOCKED"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coaching Reflection Card inside row */}
                <div className="bg-[#FBF7ED] p-5 rounded-xl border border-[#B88421]/20 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold text-[#8B6312] uppercase tracking-wider pb-2 border-b border-[#B88421]/15">
                    <span>Coaching Effectiveness Score</span>
                    <span>{coachingEffectiveness?.score ?? 85}%</span>
                  </div>

                  {adaptiveReflection?.title && (
                    <h4 className="font-serif font-bold text-[#1A1408] text-sm">
                      {adaptiveReflection.title}
                    </h4>
                  )}

                  <p className="text-xs text-[#3D3120] leading-relaxed">
                    {adaptiveReflection?.reflection ||
                      "Your AI mentor observes steady advancement through Module 1. Spaced repetition retention remains strong. Continue focusing on interactive planetary workbench simulations to solidify technical mastery."}
                  </p>

                  {adaptiveReflection?.nextFocus && adaptiveReflection.nextFocus.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6312] block">
                        Recommended Next Focus:
                      </span>
                      <ul className="list-disc list-inside text-xs text-[#3D3120] space-y-0.5 pl-1">
                        {adaptiveReflection.nextFocus.slice(0, 2).map((nf, idx) => (
                          <li key={idx} className="truncate">{nf}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════
         * TAB 2: STUDY PLANNER ONLY (Full Width Widescreen Row Structure)
         * ═════════════════════════════════════════════════════════════════ */}
        {activeTab === "planner" && (
          <div className="bg-[#FFFDF8] border border-[#B88421]/25 rounded-2xl shadow-[0_8px_32px_rgba(139,99,18,0.07)] p-6 sm:p-8 space-y-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B88421]/15 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#B88421]/10 border border-[#B88421]/25 flex items-center justify-center text-[#8B6312] shadow-sm">
                  <Calendar className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-[#1A1408] text-3xl">
                    Full Study Schedule &amp; Priority Queue
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B583D] mt-0.5">
                    Comprehensive daily agenda optimized by your AI mentor &amp; spaced review intervals.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#B88421]/10 text-[#8B6312] border border-[#B88421]/20">
                  Total Recommended Time: {studyPlan.estimatedStudyTime} mins
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (7 cols): Today's Tasks */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#8B6312] flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-[#B88421]" /> Today&apos;s High-Priority Tasks ({studyPlan.todayTasks.length})
                  </h3>
                  {studyPlan.burnoutRisk === "high" && (
                    <span className="text-xs text-rose-700 font-semibold flex items-center gap-1 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      <AlertTriangle className="w-3.5 h-3.5" /> High Burnout Risk — Take a rest break
                    </span>
                  )}
                </div>

                {studyPlan.todayTasks.length > 0 ? (
                  <div className="space-y-4">
                    {studyPlan.todayTasks.map((t: StudyTask, idx: number) => {
                      const taskHref = getTaskHref(t);
                      return (
                        <Link
                          key={idx}
                          href={taskHref}
                          className="block bg-[#FFFDF8] p-6 rounded-xl border border-[#B88421]/25 hover:border-[#B88421]/60 shadow-sm hover:shadow-md transition-all duration-200 space-y-3.5 group relative overflow-hidden text-left no-underline cursor-pointer"
                        >
                          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#D4AF37] to-[#8B6312]" />
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-serif font-bold text-[#1A1408] text-xl group-hover:text-[#8B6312] transition-colors block">
                                {t.lesson}
                              </span>
                              {t.section && (
                                <span className="text-xs font-semibold text-[#8B6312] block mt-0.5">
                                  {t.section}
                                </span>
                              )}
                            </div>
                            <span
                              className={`self-start sm:self-auto px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                                t.priority === "high"
                                  ? "bg-rose-50 text-rose-800 border border-rose-200 shadow-sm"
                                  : t.priority === "medium"
                                  ? "bg-amber-50 text-amber-800 border border-amber-200 shadow-sm"
                                  : "bg-stone-100 text-stone-700 border border-stone-300"
                              }`}
                            >
                              {t.priority} priority · {t.estimatedDuration} mins
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-[#6B583D] leading-relaxed">
                            <strong className="text-[#1A1408]">Why now: </strong> {t.reason}
                          </p>

                          <div className="pt-3 border-t border-[#B88421]/15 flex items-center justify-between gap-4">
                            <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 min-w-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="truncate">Outcome: {t.expectedOutcome}</span>
                            </div>
                            <span className="text-xs font-bold text-[#8B6312] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform shrink-0">
                              Begin Task <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-[#FBF7ED] p-8 rounded-xl border border-[#B88421]/20 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <p className="font-serif text-xl font-bold text-[#1A1408]">All Daily Tasks Completed!</p>
                    <p className="text-xs sm:text-sm text-[#6B583D]">You have met today&apos;s target study cadence.</p>
                  </div>
                )}
              </div>

              {/* Right Column (5 cols): Tomorrow's Queue & Study Cadence Guidance */}
              <div className="lg:col-span-5 space-y-6 bg-[#FAF7F0] p-6 rounded-2xl border border-[#B88421]/20">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#6B583D] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8B6312]" /> Queued for Tomorrow ({studyPlan.tomorrowTasks.length})
                  </h3>
                  {studyPlan.tomorrowTasks.length > 0 ? (
                    <div className="space-y-3">
                      {studyPlan.tomorrowTasks.map((t: StudyTask, idx: number) => {
                        const taskHref = getTaskHref(t);
                        return (
                          <Link
                            key={idx}
                            href={taskHref}
                            className="block bg-[#FFFDF8] p-4 rounded-xl border border-[#B88421]/15 flex items-center justify-between gap-3 hover:border-[#B88421]/30 transition-colors shadow-sm no-underline cursor-pointer group"
                          >
                            <div className="min-w-0">
                              <span className="font-semibold text-[#1A1408] text-xs sm:text-sm block truncate group-hover:text-[#8B6312] transition-colors">
                                {t.lesson}
                              </span>
                              <span className="text-xs text-[#6B583D] block truncate mt-0.5">
                                {t.reason}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-[#8B6312] bg-[#FAF7F0] px-3 py-1 rounded-lg border border-[#B88421]/20 shrink-0 group-hover:bg-[#8B6312] group-hover:text-white transition-colors">
                              {t.estimatedDuration}m
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-[#6B583D] italic">No tasks queued for tomorrow yet.</p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#B88421]/15 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B6312]">
                    Spaced Repetition &amp; Burnout Prevention
                  </h4>
                  <p className="text-xs text-[#3D3120] leading-relaxed">
                    Your study schedule automatically calibrates based on quiz accuracy and login regularity. Maintaining sessions under 45 minutes daily maximizes long-term retention of Sanskrit doctrines without cognitive fatigue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════
         * TAB 3: MENTOR GOALS ONLY (Full Width Widescreen Balanced Row)
         * ═════════════════════════════════════════════════════════════════ */}
        {activeTab === "goals" && (
          <div className="bg-[#FFFDF8] border border-[#B88421]/25 rounded-2xl shadow-[0_8px_32px_rgba(139,99,18,0.07)] p-6 sm:p-8 space-y-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B88421]/15 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 shadow-sm">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-[#1A1408] text-3xl">
                    AI Mentor Goals &amp; Doctrine Milestones
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B583D] mt-0.5">
                    Active targets set by your AI tutor and unlocked curriculum achievements.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#B88421]/10 text-[#8B6312] border border-[#B88421]/20">
                  Completed Daily: {completedDailyGoals}/{totalDailyGoals}
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Unlocked Seals: {unlockedAchievements}/{achievements.length}
                </span>
              </div>
            </div>

            {/* 2 Equal Columns across Full Widescreen Width */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Side (6 cols): Daily & Streak Goals */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#8B6312] flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#B88421]" /> Active Daily &amp; Streak Goals
                </h3>

                <div className="space-y-4">
                  {mentorGoals.map((g) => {
                    const progressPct = Math.min(100, Math.round((g.progress / Math.max(1, g.target)) * 100));
                    return (
                      <div
                        key={g.id}
                        className="bg-[#FAF7F0] p-5 rounded-xl border border-[#B88421]/20 space-y-3.5 shadow-sm hover:border-[#B88421]/40 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-serif font-bold text-[#1A1408] text-lg block">
                            {g.title}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider border shrink-0 ${
                              g.status === "completed"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm"
                                : g.status === "in_progress"
                                ? "bg-amber-50 text-amber-800 border-amber-200 shadow-sm"
                                : "bg-stone-100 text-stone-600 border-stone-300"
                            }`}
                          >
                            {g.status.replace(/_/g, " ")} ({g.priority})
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-[#6B583D] leading-relaxed">{g.description}</p>

                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between text-xs font-semibold text-[#3D3120]">
                            <span>Progress: {g.progress} / {g.target}</span>
                            <span>{progressPct}%</span>
                          </div>
                          <div className="w-full bg-[#ECE5D5] h-2.5 rounded-full overflow-hidden border border-[#B88421]/15 shadow-inner">
                            <div
                              className="bg-gradient-to-r from-[#D4AF37] to-[#8B6312] h-full rounded-full transition-all duration-500 shadow-sm"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side (6 cols): All Milestones & Seals */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#8B6312] flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700" /> Doctrine Seals &amp; Curriculum Achievements
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {achievements.map((a) => (
                    <div
                      key={a.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                        a.unlocked
                          ? "bg-[#FAF7F0] border-[#B88421]/30 shadow-sm hover:shadow-md"
                          : "bg-stone-50/60 border-stone-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            a.unlocked
                              ? "bg-gradient-to-br from-[#D4AF37] to-[#8B6312] text-white shadow-sm"
                              : "bg-stone-200 text-stone-500"
                          }`}
                        >
                          {a.unlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <span className="font-serif font-bold text-[#1A1408] text-sm block">
                            {a.title}
                          </span>
                          <span className="text-xs text-[#6B583D] block mt-1 leading-normal">
                            {a.description}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end pt-2 border-t border-[#B88421]/10">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            a.unlocked
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm"
                              : "bg-stone-100 text-stone-600 border-stone-300"
                          }`}
                        >
                          {a.unlocked ? "UNLOCKED SEAL" : "LOCKED"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════
         * TAB 4: REFLECTIONS ONLY (Full Width Widescreen Balanced Row)
         * ═════════════════════════════════════════════════════════════════ */}
        {activeTab === "reflections" && (
          <div className="bg-[#FFFDF8] border border-[#B88421]/25 rounded-2xl shadow-[0_8px_32px_rgba(139,99,18,0.07)] p-6 sm:p-8 space-y-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B88421]/15 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-700 shadow-sm">
                  <Lightbulb className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-[#1A1408] text-3xl">
                    Adaptive AI Coaching Reflections
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B583D] mt-0.5">
                    Live synthesis &amp; strategic guidance generated from your recent study patterns.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#B88421]/10 text-[#8B6312] border border-[#B88421]/20">
                  Coaching Effectiveness: {coachingEffectiveness?.score ?? 85}%
                </span>
              </div>
            </div>

            {/* 2 Balanced Columns across Full Widescreen Width */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Side (7 cols): Main Reflection Synthesis & Strengths */}
              <div className="lg:col-span-7 bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#B88421]/20 space-y-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#B88421]/15">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8B6312]">
                    AI Mentor Coaching Report
                  </span>
                  <span className="text-xs text-[#6B583D]">Updated Live</span>
                </div>

                {adaptiveReflection?.title && (
                  <h3 className="font-serif font-bold text-[#1A1408] text-2xl">
                    {adaptiveReflection.title}
                  </h3>
                )}

                <p className="text-sm text-[#3D3120] leading-relaxed font-normal">
                  {adaptiveReflection?.reflection ||
                    "Your AI mentor observes steady advancement through Module 1. Spaced repetition retention remains strong. Continue focusing on interactive planetary workbench simulations to solidify technical mastery."}
                </p>

                {adaptiveReflection?.strengths && adaptiveReflection.strengths.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                      Demonstrated Key Strengths:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {adaptiveReflection.strengths.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-sm"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {adaptiveReflection?.nextFocus && adaptiveReflection.nextFocus.length > 0 && (
                  <div className="space-y-2.5 pt-2 border-t border-[#B88421]/15">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8B6312] block">
                      Recommended Next Focus Areas:
                    </span>
                    <ul className="space-y-2 pl-1">
                      {adaptiveReflection.nextFocus.map((nf, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-[#3D3120] flex items-start gap-2">
                          <span className="text-[#B88421] font-bold mt-0.5">•</span>
                          <span>{nf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {adaptiveReflection?.encouragement && (
                  <div className="pt-4 border-t border-[#B88421]/15">
                    <p className="text-xs sm:text-sm font-serif font-semibold text-[#8B6312] italic leading-relaxed">
                      &ldquo;{adaptiveReflection.encouragement}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Right Side (5 cols): Growth Areas & Coaching Metrics */}
              <div className="lg:col-span-5 bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#B88421]/20 space-y-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#B88421]/15">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8B6312]">
                    Growth Areas &amp; Metrics
                  </span>
                  <span className="text-xs text-[#6B583D]">Targeted Focus</span>
                </div>

                {adaptiveReflection?.improvements && adaptiveReflection.improvements.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                      Recommended Refinements:
                    </span>
                    <ul className="space-y-2.5">
                      {adaptiveReflection.improvements.map((imp, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-[#3D3120] flex items-start gap-2.5 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                          <span className="text-amber-700 font-bold mt-0.5">•</span>
                          <span className="leading-relaxed">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-3 pt-3 border-t border-[#B88421]/15">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8B6312] block">
                    Coaching Impact &amp; Acceptance:
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#FFFDF8] p-3.5 rounded-xl border border-[#B88421]/15">
                      <div className="text-[11px] text-[#6B583D] font-medium">Intervention Success</div>
                      <div className="text-lg font-serif font-bold text-[#1A1408] mt-0.5">
                        {coachingEffectiveness?.interventionSuccess ?? 88}%
                      </div>
                    </div>
                    <div className="bg-[#FFFDF8] p-3.5 rounded-xl border border-[#B88421]/15">
                      <div className="text-[11px] text-[#6B583D] font-medium">Recommendation Uptake</div>
                      <div className="text-lg font-serif font-bold text-[#1A1408] mt-0.5">
                        {coachingEffectiveness?.recommendationAcceptance ?? 92}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="bg-gradient-to-r from-[#B88421]/10 to-[#8B6312]/10 p-4 rounded-xl border border-[#B88421]/20 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#8B6312]">AI Confidence Score</div>
                      <div className="text-[11px] text-[#6B583D]">Based on your learning velocity</div>
                    </div>
                    <div className="text-xl font-serif font-bold text-[#8B6312]">
                      {coachingEffectiveness?.confidence ?? 94}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

