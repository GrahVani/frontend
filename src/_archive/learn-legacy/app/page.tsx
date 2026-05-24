"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Course } from "@/lib/api";
import type { LessonSummary, ChapterSummary, DashboardData } from "@/lib/api/learn";
import {
  BookOpen, Trophy, Target, Flame, ChevronRight, Star, Zap,
  GraduationCap, Play, Lock, CheckCircle2, Clock, TrendingUp,
  Map, Rocket, Crown, Gem, Calculator, Eye, Sun, Moon,
  Compass, Shield, Sparkles, Timer, BrainCircuit, FileQuestion,
  AlertCircle, ChevronDown, Hourglass
} from "lucide-react";

interface CourseWithProgress extends Course {
  completedLessons?: number;
  progressPercentage?: number;
  averageScore?: number;
  status?: string;
}

/* ──────────────────────────── Helpers ──────────────────────────── */

/** Extract short tier name from "Tier 1 — Foundation" → "Foundation" */
function shortTierName(tierTitle: string): string {
  return tierTitle.replace(/^Tier\s+\d+\s*[—–-]\s*/, "").trim();
}

/** Extract tier number from "Tier 1 — Foundation" → 1 */
function tierNumberFromTitle(tierTitle: string): number {
  const m = tierTitle.match(/^Tier\s+(\d+)/i);
  return m ? parseInt(m[1], 10) : 0;
}

/** Clean a module title that may have a leading dash left by regex */
function cleanTitle(title: string): string {
  return title.replace(/^[\s:–—\-]+/, "").trim();
}

/** Format a module display label: "01 · Introduction to Jyotiṣa" */
function moduleLabel(modNumber: number, title: string): string {
  return `${String(modNumber).padStart(2, "0")} · ${cleanTitle(title)}`;
}

/* ──────────────────────────── Icons ────────────────────────────── */

const MODULE_ICONS: Record<string, React.ElementType> = {
  INTRODUCTION_TO_JYOTISHA: Sun,
  FOUNDATIONS_OF_TIME: Clock,
  PANCHANGA: CalendarIcon,
  RASHIS_ZODIAC: Compass,
  GRAHAS_PLANETS: Eye,
  BHAVAS_HOUSES: Shield,
  ASPECTS_AND_INTRO_YOGAS: Sparkles,
  VARGAS_DIVISIONAL_CHARTS: Gem,
  DASHA_SYSTEMS: Timer,
  GOCHARA_TRANSITS: Rocket,
  YOGAS_AND_RAJA_YOGAS: Crown,
  PRASHNA_HORARY: Moon,
  MARRIAGE_COMPATIBILITY: HeartIcon,
  CAREER_AND_FINANCE: TrendingUp,
  HEALTH_AND_AYURVEDA: Shield,
  REMEDIAL_MEASURES: Gem,
  MUHURTA_ELECTIONAL: Clock,
  NAKSHATRAS: Star,
  JAIMINI_ASTROLOGY: Compass,
  KRISHNAMURTI_PADDHATI: Target,
  TAJIKA_VARSHAPHAL: Sun,
  SANKET_NIDHI: BookOpen,
  PHALA_DEEPIKA: Sparkles,
  MANTRA_SADHANA: Shield,
  // Tier 2 modules
  PREDICTIVE_METHODOLOGY: BrainCircuit,
  CHART_READING_WORKFLOW: Eye,
  CAREER_PROFESSION: TrendingUp,
  MARRIAGE_RELATIONSHIPS: HeartIcon,
};

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Clock {...props} />;
}
function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Star {...props} />;
}

/* ──────────────────────────── Styles ───────────────────────────── */

const TIER_COLORS: Record<string, { bg: string; border: string; text: string; dot: string; progress: string }> = {
  LEVEL_1: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", progress: "bg-emerald-500" },
  LEVEL_2: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500", progress: "bg-blue-500" },
  LEVEL_3: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", dot: "bg-purple-500", progress: "bg-purple-500" },
  LEVEL_4: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500", progress: "bg-amber-500" },
};

const BLOOM_COLOR: Record<string, string> = {
  Remember: "bg-slate-100 text-slate-600 border-slate-200",
  Understand: "bg-blue-100 text-blue-600 border-blue-200",
  Apply: "bg-emerald-100 text-emerald-600 border-emerald-200",
  Analyze: "bg-amber-100 text-amber-600 border-amber-200",
  Evaluate: "bg-rose-100 text-rose-600 border-rose-200",
  Create: "bg-purple-100 text-purple-600 border-purple-200",
};

/* ──────────────────────────── Component ────────────────────────── */

export default function LearnPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  /* ── Fetch data ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await learnApi.getCourses(user?.id);
        if (coursesRes.success) {
          const levelOrder = ["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4"];
          const sorted = [...coursesRes.data].sort(
            (a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level)
          );
          const enriched: CourseWithProgress[] = sorted.map((course) => ({
            ...course,
            completedLessons: course.completedLessons ?? 0,
            progressPercentage: course.progressPercentage ?? 0,
            averageScore: course.averageScore ?? 0,
            status: course.status ?? "available",
          }));
          setCourses(enriched);

          const availableLevels = [...new Set(enriched.map((c) => c.level))].sort();
          const levelFromUrl = searchParams.get("level");
          if (levelFromUrl && availableLevels.includes(levelFromUrl)) {
            setActiveLevel(levelFromUrl);
          } else if (enriched.length > 0) {
            setActiveLevel(enriched[0].level);
          }

          const expandFromUrl = searchParams.get("expand");
          if (expandFromUrl) {
            setExpandedModules(new Set(expandFromUrl.split(",").filter(Boolean)));
          }
        }

        if (user) {
          const dashboardRes = await learnApi.getDashboard(user.id);
          if (dashboardRes.success && dashboardRes.data) {
            setDashboard(dashboardRes.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch learning data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, searchParams]);

  /* ── Sync URL ── */
  useEffect(() => {
    if (activeLevel === null) return;
    const currentLevel = searchParams.get("level");
    if (currentLevel === activeLevel) return;
    const current = new URLSearchParams(searchParams.toString());
    current.set("level", activeLevel);
    router.replace(`/learn?${current.toString()}`, { scroll: false });
  }, [activeLevel, searchParams, router]);

  useEffect(() => {
    const currentExpand = searchParams.get("expand");
    const expectedExpand = expandedModules.size > 0 ? Array.from(expandedModules).join(",") : null;
    if (currentExpand === expectedExpand) return;
    const current = new URLSearchParams(searchParams.toString());
    if (expandedModules.size > 0) {
      current.set("expand", Array.from(expandedModules).join(","));
    } else {
      current.delete("expand");
    }
    router.replace(`/learn?${current.toString()}`, { scroll: false });
  }, [expandedModules, searchParams, router]);

  const toggleModule = (courseId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  };

  /* ── Derived data ── */
  const activeCourses = courses.filter((c) => !activeLevel || c.level === activeLevel);
  const publishedCourses = activeCourses.filter((c) => c.totalLessons > 0);
  const comingSoonCourses = activeCourses.filter((c) => c.totalLessons === 0);

  const totalLessonsAll = courses.reduce((sum, c) => sum + c.totalLessons, 0);
  const completedLessonsAll = courses.reduce((sum, c) => sum + (c.completedLessons || 0), 0);
  const overallProgress = totalLessonsAll > 0 ? Math.round((completedLessonsAll / totalLessonsAll) * 100) : 0;

  const coursesByLevel = courses.reduce((acc, course) => {
    if (!acc[course.level]) acc[course.level] = [];
    acc[course.level].push(course);
    return acc;
  }, {} as Record<string, CourseWithProgress[]>);

  const allLessons = courses.flatMap((c) =>
    c.lessons.map((l) => ({ ...l, courseTitle: c.title, courseLevel: c.level, courseId: c.id }))
  );
  const nextLesson = dashboard
    ? allLessons.find((l) => !dashboard.progress?.some((p) => p.lessonId === l.id && p.status === "COMPLETED"))
    : allLessons[0];

  const firstName = user?.name?.split(" ")[0] || "Student";
  const streakDays = dashboard?.currentStreak || 0;
  const totalPoints = dashboard?.totalPoints || 0;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-700 font-medium">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white shadow-lg">
        <div className="max-w-[1400px] mx-auto py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <span className="text-amber-300 text-sm font-semibold tracking-wider uppercase">
                  Grahvani Learning Academy
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {firstName}!</h1>
              <p className="text-amber-200/90 text-lg max-w-lg">
                {completedLessonsAll} of {totalLessonsAll} lessons completed across all tiers.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatBadge icon={<Flame className="w-5 h-5 text-orange-400" />} value={streakDays} label="Streak" />
              <StatBadge icon={<Star className="w-5 h-5 text-yellow-400" />} value={`${dashboard?.averageScore || 0}%`} label="Avg" />
              <StatBadge icon={<Target className="w-5 h-5 text-emerald-400" />} value={`${overallProgress}%`} label="Done" />
              <StatBadge icon={<Trophy className="w-5 h-5 text-amber-400" />} value={totalPoints} label="XP" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-amber-300/80">Your Journey to Mastery</span>
              <span className="text-amber-300 font-semibold">{completedLessonsAll} / {totalLessonsAll} lessons</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-all duration-1000"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto py-10">
        {/* ═══════════════════ CONTINUE LEARNING ═══════════════════ */}
        {nextLesson && (
          <div className="mb-12">
            <h2 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-amber-600" />
              Continue Learning
            </h2>
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-lg shadow-amber-200">
                  {nextLesson.sequenceOrder}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-amber-600 mb-1">
                    Next up in <span className="font-semibold">{cleanTitle(nextLesson.courseTitle || "")}</span>
                  </p>
                  <p className="text-xl font-bold text-amber-900 mb-2">{nextLesson.title}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {nextLesson.targetMinutes && (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {nextLesson.targetMinutes} min
                      </span>
                    )}
                    {nextLesson.mcqCount ? (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <FileQuestion className="w-4 h-4" /> {nextLesson.mcqCount} MCQs
                      </span>
                    ) : null}
                    {nextLesson.bloomLevels && nextLesson.bloomLevels.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        {nextLesson.bloomLevels[0]}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/learn/lesson/${nextLesson.id}`}
                  className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <Play className="w-4 h-4" />
                  {completedLessonsAll > 0 ? "Resume" : "Start Learning"}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ LEARNING PATH ═══════════════════ */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
              <Map className="w-5 h-5 text-amber-600" />
              Learning Path
            </h2>
            <span className="text-sm text-amber-600/80">
              {activeCourses.length} modules · {publishedCourses.length} available · {activeCourses.reduce((s, c) => s + c.totalLessons, 0)} lessons
            </span>
          </div>

          {/* Tier Tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
            {Object.keys(coursesByLevel)
              .sort((a, b) => {
                const na = coursesByLevel[a][0]?.tierNumber || 0;
                const nb = coursesByLevel[b][0]?.tierNumber || 0;
                return na - nb;
              })
              .map((level) => {
                const first = coursesByLevel[level][0];
                const tierName = shortTierName(first?.tierTitle || level);
                const tierNum = first?.tierNumber || tierNumberFromTitle(first?.tierTitle || "");
                const total = coursesByLevel[level].length;
                const active = coursesByLevel[level].filter((c) => c.totalLessons > 0).length;
                const isActive = activeLevel === level;
                const col = TIER_COLORS[level] || TIER_COLORS.LEVEL_1;

                return (
                  <button
                    key={level}
                    onClick={() => setActiveLevel(isActive ? null : level)}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? `${col.bg} ${col.text} ${col.border} border-2 shadow-sm`
                        : "bg-white text-gray-500 border border-gray-200 hover:border-amber-300 hover:text-gray-700"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <span>{tierName}</span>
                    <span className="text-xs opacity-60 font-medium">{active}/{total}</span>
                  </button>
                );
              })}
          </div>

          {/* ── Available Modules ── */}
          <div className="space-y-4">
            {publishedCourses.map((course) => {
              const isExpanded = expandedModules.has(course.id);
              const progress = course.progressPercentage || 0;
              const isCompleted = course.status === "completed" || course.status === "mastered";
              const Icon = MODULE_ICONS[course.category] || BookOpen;
              const col = TIER_COLORS[course.level] || TIER_COLORS.LEVEL_1;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Module header (always visible) */}
                  <button
                    onClick={() => toggleModule(course.id)}
                    className="w-full p-5 text-left group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${col.bg} ${col.text} border ${col.border}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-gray-900 leading-snug">
                              {moduleLabel(course.moduleNumber, course.title)}
                            </h3>
                            {course.description && (
                              <p className="text-sm text-gray-500 mt-0.5 truncate">
                                {course.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isCompleted && (
                              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                              </span>
                            )}
                            <ChevronDown
                              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-5 mt-3 flex-wrap">
                          <div className="flex items-center gap-2 flex-1 max-w-[220px]">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isCompleted ? "bg-emerald-500" : col.progress} transition-all`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-500 shrink-0">
                              {course.completedLessons || 0}/{course.totalLessons}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {course.totalMinutes} min
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <FileQuestion className="w-3.5 h-3.5" />
                            {course.totalMcqs} MCQs
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            {course.totalLessons} lessons
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded chapters */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-amber-50">
                      {course.chapters.map((chapter: ChapterSummary) => (
                        <div key={chapter.id} className="mt-4 first:mt-3">
                          {/* Chapter header */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-white bg-amber-600 px-2 py-0.5 rounded-md">
                              Ch.{chapter.number}
                            </span>
                            <h4 className="text-sm font-semibold text-amber-900">
                              {cleanTitle(chapter.title)}
                            </h4>
                            <span className="text-xs text-gray-400">{chapter.lessonCount} lessons</span>
                          </div>

                          {/* Lesson list */}
                          <div className="grid gap-1">
                            {chapter.lessons.map((lesson: LessonSummary) => (
                              <Link
                                key={lesson.id}
                                href={`/learn/lesson/${lesson.id}`}
                                className="flex items-center justify-between p-3 rounded-xl bg-amber-50/40 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="w-7 h-7 rounded-lg bg-white border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0">
                                    {lesson.sequenceOrder}
                                  </span>
                                  <div className="min-w-0">
                                    <span className="text-sm text-gray-800 font-medium block truncate">
                                      {lesson.title}
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                      {lesson.targetMinutes && (
                                        <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                                          <Clock className="w-3 h-3" /> {lesson.targetMinutes}m
                                        </span>
                                      )}
                                      {lesson.mcqCount ? (
                                        <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                                          <FileQuestion className="w-3 h-3" /> {lesson.mcqCount}
                                        </span>
                                      ) : null}
                                      {lesson.bloomLevels?.map((bl: string) => (
                                        <span
                                          key={bl}
                                          className={`text-[10px] px-1.5 py-0.5 rounded-full border ${BLOOM_COLOR[bl] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                                        >
                                          {bl}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Coming Soon ── */}
          {comingSoonCourses.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-5">
                <Hourglass className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Coming Soon</h3>
                <span className="text-xs text-gray-400 font-medium">{comingSoonCourses.length} modules</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {comingSoonCourses.map((course) => {
                  const Icon = MODULE_ICONS[course.category] || BookOpen;
                  const col = TIER_COLORS[course.level] || TIER_COLORS.LEVEL_1;
                  return (
                    <div
                      key={course.id}
                      className="flex items-center gap-3 p-4 rounded-xl bg-gray-50/80 border border-gray-200/80 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${col.bg} ${col.text} border ${col.border} shrink-0`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600 truncate">
                          {moduleLabel(course.moduleNumber, course.title)}
                        </p>
                        <span className="text-[11px] text-gray-400">Content in development</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── Sub-components ───────────────────── */

function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="text-center px-4 py-2.5 bg-white/10 rounded-xl backdrop-blur-sm min-w-[72px]">
      <div className="mx-auto mb-1">{icon}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-[11px] text-amber-300/80 uppercase tracking-wide">{label}</div>
    </div>
  );
}
