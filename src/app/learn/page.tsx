"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Course } from "@/lib/api";
import type { LessonSummary, DashboardData } from "@/lib/api/learn";
import {
  BookOpen, Trophy, Target, Flame, ChevronRight, Star, Zap,
  GraduationCap, Play, Lock, CheckCircle2, Clock, TrendingUp,
  Map, Rocket, Crown, Gem, Calculator, Eye, Sun, Moon,
  Compass, Shield, Sparkles
} from "lucide-react";

interface CourseWithProgress extends Course {
  completedLessons?: number;
  totalLessons?: number;
  progressPercentage?: number;
  averageScore?: number;
  status?: string;
  moduleNumber?: number;
}

const MODULE_ICONS: Record<string, React.ElementType> = {
  FOUNDATIONS: Sun,
  COMPUTATION: Calculator,
  SYNTHESIS: Compass,
  TIMING: Clock,
  QUANTIFICATION: Target,
  PRO_SYSTEMS: Rocket,
  APPLIED: Shield,
  ANNUAL: CalendarIcon,
  REMEDIES: Gem,
  MASTER: Crown,
};

function CalendarIcon(props: any) {
  return <Target {...props} />;
}

const LEVEL_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; ring: string }> = {
  LEVEL_1: { label: "Beginner", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", ring: "ring-emerald-500" },
  LEVEL_2: { label: "Intermediate", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", ring: "ring-blue-500" },
  LEVEL_3: { label: "Advanced", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", ring: "ring-purple-500" },
  LEVEL_4: { label: "Professional", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", ring: "ring-amber-500" },
};

const CATEGORY_COLORS: Record<string, string> = {
  FOUNDATIONS: "bg-orange-100 text-orange-700 border-orange-200",
  COMPUTATION: "bg-blue-100 text-blue-700 border-blue-200",
  SYNTHESIS: "bg-purple-100 text-purple-700 border-purple-200",
  TIMING: "bg-indigo-100 text-indigo-700 border-indigo-200",
  QUANTIFICATION: "bg-teal-100 text-teal-700 border-teal-200",
  PRO_SYSTEMS: "bg-rose-100 text-rose-700 border-rose-200",
  APPLIED: "bg-cyan-100 text-cyan-700 border-cyan-200",
  ANNUAL: "bg-violet-100 text-violet-700 border-violet-200",
  REMEDIES: "bg-pink-100 text-pink-700 border-pink-200",
  MASTER: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function LearnPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await learnApi.getCourses(user?.id);
        if (coursesRes.success) {
          const levelOrder = ["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4"];
          const sorted = [...coursesRes.data].sort(
            (a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level)
          );
          const enriched: CourseWithProgress[] = sorted.map((course, index) => ({
            ...course,
            totalLessons: course.totalLessons ?? course.lessons.length,
            completedLessons: course.completedLessons ?? 0,
            progressPercentage: course.progressPercentage ?? 0,
            averageScore: course.averageScore ?? 0,
            status: course.status ?? (index === 0 ? "available" : "locked"),
            moduleNumber: index + 1,
          }));
          setCourses(enriched);
          // Restore level from URL, or default to first available
          const levelFromUrl = searchParams.get('level');
          if (levelFromUrl && LEVEL_CONFIG[levelFromUrl]) {
            setActiveLevel(levelFromUrl);
          } else if (enriched.length > 0) {
            setActiveLevel(enriched[0].level);
          }
          // Restore expanded modules from URL
          const expandFromUrl = searchParams.get('expand');
          if (expandFromUrl) {
            setExpandedModules(new Set(expandFromUrl.split(',').filter(Boolean)));
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

  // Sync activeLevel to URL (replace, not push — avoids history pollution)
  useEffect(() => {
    if (activeLevel === null) return;
    const currentLevel = searchParams.get('level');
    if (currentLevel === activeLevel) return;
    const current = new URLSearchParams(searchParams.toString());
    current.set('level', activeLevel);
    router.replace(`/learn?${current.toString()}`, { scroll: false });
  }, [activeLevel, searchParams, router]);

  // Sync expandedModules to URL
  useEffect(() => {
    const currentExpand = searchParams.get('expand');
    const expectedExpand = expandedModules.size > 0 ? Array.from(expandedModules).join(',') : null;
    if (currentExpand === expectedExpand) return;
    const current = new URLSearchParams(searchParams.toString());
    if (expandedModules.size > 0) {
      current.set('expand', Array.from(expandedModules).join(','));
    } else {
      current.delete('expand');
    }
    router.replace(`/learn?${current.toString()}`, { scroll: false });
  }, [expandedModules, searchParams, router]);

  const toggleModule = (courseId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  };

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

  const firstName = user?.name?.split(" ")[0] || "Student";
  const streakDays = dashboard?.currentStreak || 0;

  const totalLessons = dashboard?.totalLessons || courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const completedLessons = dashboard?.lessonsCompleted || courses.reduce((sum, c) => sum + (c.completedLessons || 0), 0);
  const overallProgress = dashboard?.overallProgress || (totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0);

  const title = dashboard?.title || "Jyotish Novice";
  const currentTier = dashboard?.currentTier || 1;
  const totalPoints = dashboard?.totalPoints || 0;


  const allLessons = courses.flatMap((c) => c.lessons.map((l) => ({ ...l, courseTitle: c.title, courseLevel: c.level, courseId: c.id })));
  const nextLesson = dashboard
    ? allLessons.find((l) => !dashboard.progress?.some((p) => p.lessonId === l.id && p.status === "COMPLETED"))
    : allLessons[0];

  const coursesByLevel = courses.reduce((acc, course) => {
    if (!acc[course.level]) acc[course.level] = [];
    acc[course.level].push(course);
    return acc;
  }, {} as Record<string, CourseWithProgress[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <span className="text-amber-300 text-sm font-semibold tracking-wide uppercase">Grahvani Learning Academy</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {firstName}!</h1>
              <p className="text-amber-200 text-lg max-w-xl">
                Your journey from curious beginner to professional astrologer. {completedLessons} of {totalLessons} lessons completed.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <StatBadge icon={<Flame className="w-6 h-6 text-orange-400" />} value={streakDays} label="Day Streak" />
              <StatBadge icon={<Star className="w-6 h-6 text-yellow-400" />} value={`${dashboard?.averageScore || 0}%`} label="Avg Score" />
              <StatBadge icon={<Target className="w-6 h-6 text-green-400" />} value={`${overallProgress}%`} label="Progress" />
              <StatBadge icon={<Trophy className="w-6 h-6 text-amber-400" />} value={totalPoints} label="Total XP" />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-amber-300">Your Journey to Mastery</span>
              <span className="text-amber-300 font-bold">{completedLessons} / {totalLessons} lessons</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-all duration-1000" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Continue Learning */}
        {nextLesson && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-amber-700" />
              <h2 className="text-xl font-bold text-amber-900">Continue Learning</h2>
            </div>
            <div className="bg-white rounded-2xl border border-amber-200/60 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {nextLesson.sequenceOrder}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm text-amber-600">Next up in {nextLesson.courseTitle}</p>
                    {dashboard && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        {title} · Tier {currentTier}
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-bold text-amber-900">{nextLesson.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_CONFIG[nextLesson.courseLevel]?.bg} ${LEVEL_CONFIG[nextLesson.courseLevel]?.color}`}>
                      {LEVEL_CONFIG[nextLesson.courseLevel]?.label}
                    </span>
                  </div>
                </div>
                <Link href={`/learn/lesson/${nextLesson.id}`} className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 shrink-0">
                  <Play className="w-4 h-4" />
                  {completedLessons > 0 ? "Resume" : "Start Learning"}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 10-Module Roadmap */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Map className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-bold text-amber-900">Your Learning Path</h2>
            <span className="ml-auto text-sm text-amber-600">{courses.length} modules • {totalLessons} lessons</span>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4"].map((level) => {
              const config = LEVEL_CONFIG[level];
              const count = coursesByLevel[level]?.length || 0;
              const isActive = activeLevel === level;
              return (
                <button
                  key={level}
                  onClick={() => setActiveLevel(isActive ? null : level)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive ? `${config.bg} ${config.color} ${config.border} border-2` : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${config.ring.replace("ring-", "bg-")}`} />
                  {config.label}
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Module Cards */}
          <div className="space-y-4">
            {courses
              .filter((c) => !activeLevel || c.level === activeLevel)
              .map((course) => {
                const config = LEVEL_CONFIG[course.level];
                const isExpanded = expandedModules.has(course.id);
                const progress = course.progressPercentage || 0;
                const isCompleted = course.status === "completed";
                const Icon = MODULE_ICONS[course.category] || BookOpen;
                const catStyle = CATEGORY_COLORS[course.category] || "bg-gray-100 text-gray-700 border-gray-200";

                return (
                  <div key={course.id} className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
                    {/* Module Header */}
                    <button
                      onClick={() => toggleModule(course.id)}
                      className="w-full p-5 text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${catStyle}`}>
                              {course.category}
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                              {config.label}
                            </span>
                            {isCompleted && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Completed
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-amber-900">Module {course.moduleNumber}: {course.title.replace(/^Module\s+\d+:\s*/, "")}</h3>
                          <p className="text-sm text-amber-600 mt-1">{course.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden max-w-[200px]">
                              <div className={`h-full rounded-full transition-all ${isCompleted ? "bg-green-500" : "bg-amber-500"}`} style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-xs text-amber-500 font-medium">{course.completedLessons || 0}/{course.lessons.length} lessons</span>
                            <ChevronRight className={`w-4 h-4 text-amber-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Lessons */}
                    {isExpanded && (
                      <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                        <div className="grid gap-2">
                          {course.lessons.map((lesson: LessonSummary) => (
                            <Link
                              key={lesson.id}
                              href={`/learn/lesson/${lesson.id}`}
                              className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 hover:bg-amber-100/50 border border-amber-100 hover:border-amber-200 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                                  {lesson.sequenceOrder}
                                </div>
                                <span className="text-sm text-amber-900 font-medium">{lesson.title}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:text-amber-600 transition-colors" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>


      </div>
    </div>
  );
}

function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="text-center px-4 py-3 bg-white/10 rounded-xl backdrop-blur-sm min-w-[80px]">
      <div className="mx-auto mb-1">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-amber-300">{label}</div>
    </div>
  );
}


