"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Course } from "@/lib/api";
import type { LessonSummary, DashboardData } from "@/lib/api/learn";
import {
  BookOpen,
  Trophy,
  Target,
  Flame,
  ChevronRight,
  Star,
  Zap,
  GraduationCap,
  Play,
  Lock,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

interface CourseWithProgress extends Course {
  completedLessons?: number;
  totalLessons?: number;
  progressPercent?: number;
}

export default function LearnPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      learnApi.getCourses(),
      user ? learnApi.getDashboard(user.id) : Promise.resolve({ success: true, data: null }),
    ])
      .then(([coursesRes, dashboardRes]) => {
        if (coursesRes.success) {
          const enriched = coursesRes.data.map((course) => ({
            ...course,
            totalLessons: course.lessons.length,
            completedLessons: 0,
            progressPercent: 0,
          }));
          setCourses(enriched);
        }
        if (dashboardRes.success && dashboardRes.data) {
          setDashboard(dashboardRes.data);
          // Merge progress into courses
          setCourses((prev) =>
            prev.map((course) => {
              const completedCount = course.lessons.filter((lesson) =>
                dashboardRes.data?.progress?.some(
                  (p) => p.lesson.title === lesson.title && p.status === "COMPLETED"
                )
              ).length;
              return {
                ...course,
                completedLessons: completedCount,
                progressPercent: Math.round((completedCount / course.lessons.length) * 100),
              };
            })
          );
        }
      })
      .catch((err: Error) => console.error("Failed to fetch learning data:", err))
      .finally(() => setLoading(false));
  }, [user]);

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

  const firstName = user?.name?.split(" ")[0] || "Learner";
  const currentLevel = dashboard?.lessonsCompleted && dashboard.lessonsCompleted > 5 ? "Level 2" : "Level 1";
  const streakDays = 3; // TODO: calculate from progress data

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <span className="text-amber-300 text-sm font-semibold tracking-wide uppercase">
                  Grahvani Learning
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {firstName}!
              </h1>
              <p className="text-amber-200 text-lg max-w-xl">
                Continue your journey into Vedic astrology. Every chart you read brings you closer to mastery.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                <div className="text-2xl font-bold">{streakDays}</div>
                <div className="text-xs text-amber-300">Day Streak</div>
              </div>
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-2xl font-bold">{dashboard?.averageScore || 0}%</div>
                <div className="text-xs text-amber-300">Avg Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            label="Lessons Completed"
            value={dashboard?.lessonsCompleted || 0}
            color="bg-blue-50 text-blue-700 border-blue-200"
          />
          <StatCard
            icon={<Target className="w-5 h-5" />}
            label="Average Score"
            value={`${dashboard?.averageScore || 0}%`}
            color="bg-green-50 text-green-700 border-green-200"
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Current Level"
            value={currentLevel}
            color="bg-purple-50 text-purple-700 border-purple-200"
          />
          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            label="Courses"
            value={courses.length}
            color="bg-amber-50 text-amber-700 border-amber-200"
          />
        </div>

        {/* Continue Learning */}
        {dashboard && dashboard.lessonsCompleted > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-amber-700" />
              <h2 className="text-xl font-bold text-amber-900">Continue Learning</h2>
            </div>
            <div className="bg-white rounded-2xl border border-amber-200/60 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                  {courses[0]?.lessons[0]?.sequenceOrder || 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-amber-600 mb-1">Next up in {courses[0]?.title}</p>
                  <p className="text-lg font-bold text-amber-900">
                    {courses[0]?.lessons.find((l) => !dashboard.progress.some((p) => p.lesson.title === l.title))?.title ||
                      courses[0]?.lessons[0]?.title}
                  </p>
                </div>
                <Link
                  href={`/learn/lesson/${courses[0]?.lessons.find((l) => !dashboard.progress.some((p) => p.lesson.title === l.title))?.id || courses[0]?.lessons[0]?.id}`}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Resume
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Courses */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-bold text-amber-900">Your Courses</h2>
            <span className="ml-auto text-sm text-amber-600">
              {courses.length} course{courses.length !== 1 ? "s" : ""} available
            </span>
          </div>

          <div className="grid gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>

        {/* Learning Path Preview */}
        <div className="mt-12 bg-white rounded-2xl border border-amber-200/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-bold text-amber-900">Your Learning Path</h2>
          </div>
          <div className="flex items-center gap-2">
            {["Level 1: Foundations", "Level 2: Birth Chart", "Level 3: Prediction", "Level 4: Mastery"].map(
              (level, idx) => (
                <React.Fragment key={level}>
                  <div
                    className={`px-4 py-2 rounded-xl text-sm font-semibold ${idx === 0
                        ? "bg-amber-600 text-white"
                        : "bg-amber-100 text-amber-600"
                      }`}
                  >
                    {level}
                  </div>
                  {idx < 3 && <ChevronRight className="w-4 h-4 text-amber-400" />}
                </React.Fragment>
              )
            )}
          </div>
          <p className="text-amber-600 text-sm mt-4">
            Complete all Level 1 courses to unlock Level 2. Each level builds on the previous one.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${color}`}>
      <div className="mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
}

function CourseCard({ course }: { course: CourseWithProgress }) {
  const progress = course.progressPercent || 0;
  const isCompleted = progress === 100;
  const isStarted = progress > 0;

  return (
    <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                {course.level.replace("LEVEL_", "Level ")}
              </span>
              {isCompleted && (
                <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              )}
              {!isStarted && (
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Not Started
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-amber-900">{course.title}</h3>
            <p className="text-amber-600 mt-1 text-sm">{course.description}</p>
          </div>
          <div className="ml-4 flex flex-col items-center">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-amber-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className={isCompleted ? "text-green-500" : "text-amber-500"}
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-amber-800">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-amber-100 rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all ${isCompleted ? "bg-green-500" : "bg-amber-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Lessons */}
        <div className="space-y-2">
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
                <span className="text-amber-900 font-medium">{lesson.title}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:text-amber-600 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
