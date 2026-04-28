"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type DashboardData } from "@/lib/api";
import {
  Trophy,
  BookCheck,
  Target,
  TrendingUp,
  Award,
  Star,
  Clock,
  Flame,
  ChevronRight,
  Medal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function LearnProgressPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    learnApi.getDashboard(user.id)
      .then((res: { success: boolean; data: DashboardData }) => {
        if (res.success) setData(res.data);
      })
      .catch((err: Error) => console.error("Failed to fetch dashboard:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-700 font-medium">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "Learner";
  const lessonsCompleted = data?.lessonsCompleted || 0;
  const averageScore = data?.averageScore || 0;
  const totalLessons = 12; // Placeholder - should come from API
  const progressPercent = Math.round((lessonsCompleted / totalLessons) * 100);

  // Achievement badges
  const badges = [
    { name: "First Step", icon: <Sparkles className="w-5 h-5" />, unlocked: lessonsCompleted >= 1, color: "bg-blue-100 text-blue-700" },
    { name: "Rising Star", icon: <Star className="w-5 h-5" />, unlocked: averageScore >= 70, color: "bg-yellow-100 text-yellow-700" },
    { name: "Dedicated", icon: <Flame className="w-5 h-5" />, unlocked: lessonsCompleted >= 3, color: "bg-orange-100 text-orange-700" },
    { name: "Expert", icon: <Medal className="w-5 h-5" />, unlocked: averageScore >= 90, color: "bg-purple-100 text-purple-700" },
    { name: "Master", icon: <Award className="w-5 h-5" />, unlocked: lessonsCompleted >= 10, color: "bg-green-100 text-green-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b border-amber-200/60 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Your Learning Journey</h1>
          <p className="text-amber-600">
            Hey {firstName}, here's how you're progressing through Vedic astrology mastery.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Overall Progress */}
        <div className="bg-white rounded-2xl border border-amber-200/60 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg font-bold text-amber-900">Overall Progress</h2>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-amber-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  className="text-amber-500"
                  strokeDasharray={`${progressPercent}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-amber-900">{progressPercent}%</span>
                <span className="text-xs text-amber-600">Complete</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <BookCheck className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-amber-900">{lessonsCompleted}</div>
                <div className="text-xs text-amber-600">Lessons Done</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">{averageScore}%</div>
                <div className="text-xs text-green-600">Average Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">{badges.filter((b) => b.unlocked).length}</div>
                <div className="text-xs text-purple-600">Badges Earned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg font-bold text-amber-900">Achievements</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`rounded-xl p-4 text-center border transition-all ${
                  badge.unlocked
                    ? `${badge.color} border-transparent`
                    : "bg-gray-50 text-gray-400 border-gray-200"
                }`}
              >
                <div className="mx-auto mb-2">{badge.icon}</div>
                <div className="text-sm font-semibold">{badge.name}</div>
                {badge.unlocked && (
                  <div className="text-xs mt-1 opacity-80">Unlocked!</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {data && data.progress.length > 0 && (
          <div className="bg-white rounded-2xl border border-amber-200/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-amber-700" />
              <h2 className="text-lg font-bold text-amber-900">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {data.progress.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 bg-amber-50/50 rounded-xl hover:bg-amber-100/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        p.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.status === "COMPLETED" ? (
                        <BookCheck className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-amber-900">{p.lesson.title}</p>
                      <p className="text-xs text-amber-600">
                        {p.status === "COMPLETED"
                          ? `Completed on ${p.completedAt ? new Date(p.completedAt).toLocaleDateString() : "N/A"}`
                          : "In Progress"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.score !== null && p.score !== undefined && (
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          p.score >= 70 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {p.score}%
                      </div>
                    )}
                    <Link
                      href={`/learn/lesson/${p.id}`}
                      className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-amber-500" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!data || data.progress.length === 0) && (
          <div className="bg-white rounded-2xl border border-amber-200/60 p-10 text-center">
            <BookCheck className="w-12 h-12 text-amber-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-amber-900 mb-2">No activity yet</h3>
            <p className="text-amber-600 mb-4">
              Start your first lesson to begin tracking your progress!
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors"
            >
              Start Learning
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
