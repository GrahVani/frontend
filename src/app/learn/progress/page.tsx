"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type DashboardData, type BadgeItem } from "@/lib/api";
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
  Crown,
  Zap,
  Rocket,
  Gem,
  Shield,
} from "lucide-react";
import Link from "next/link";

/* ── Rarity config based on backend badge rarity ── */
const RARITY_STYLES: Record<string, { color: string; bg: string; border: string; label: string }> = {
  COMMON:    { color: "text-gray-600",    bg: "bg-gray-50",    border: "border-gray-200",    label: "Common" },
  UNCOMMON:  { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Uncommon" },
  RARE:      { color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200",    label: "Rare" },
  EPIC:      { color: "text-purple-600",  bg: "bg-purple-50",  border: "border-purple-200",  label: "Epic" },
  LEGENDARY: { color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   label: "Legendary" },
};

function BadgeIcon({ badge, size = 24 }: { badge: BadgeItem; size?: number }) {
  if (badge.iconUrl) {
    return (
      <img
        src={badge.iconUrl}
        alt={badge.name}
        width={size}
        height={size}
        className="mx-auto object-contain"
      />
    );
  }
  // Default icon based on rarity
  const Icon =
    badge.rarity === "LEGENDARY"
      ? Crown
      : badge.rarity === "EPIC"
      ? Gem
      : badge.rarity === "RARE"
      ? Star
      : badge.rarity === "UNCOMMON"
      ? Shield
      : Award;
  return <Icon className="mx-auto" style={{ width: size, height: size }} />;
}

export default function LearnProgressPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    learnApi
      .getDashboard(user.id)
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

  const firstName = user?.name?.split(" ")[0] || "Student";
  const lessonsCompleted = data?.lessonsCompleted || 0;
  const averageScore = data?.averageScore || 0;
  const totalLessons = data?.totalLessons || 0;
  const progressPercent = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;

  const totalPoints = data?.totalPoints || 0;
  const currentStreak = data?.currentStreak || 0;
  const longestStreak = data?.longestStreak || 0;
  const skillScore = data?.skillScore || 0;
  const title = data?.title || "Jyotish Novice";
  const currentTier = data?.currentTier || 1;
  const nextTierProgress = data?.nextTierProgress || 0;
  const modulesCompleted = data?.totalModulesCompleted || 0;

  // Badges — purely from backend, no fallback
  const earnedBadges = data?.badges?.earned || [];
  const availableBadges = data?.badges?.available || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b border-amber-200/60 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-900 mb-2">Your Learning Journey</h1>
              <p className="text-amber-600">
                Hey {firstName}, here&apos;s how you&apos;re progressing through Vedic astrology mastery.
              </p>
            </div>
            {data && (
              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                  <Crown className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-amber-900">{title}</div>
                  <div className="text-[10px] text-amber-500">Tier {currentTier}</div>
                </div>
                <div className="text-center px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl">
                  <Sparkles className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-purple-900">{skillScore}</div>
                  <div className="text-[10px] text-purple-500">Skill Score</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Overall Progress */}
        <div className="bg-white rounded-2xl border border-amber-200/60 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg font-bold text-amber-900">Overall Progress</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Circular Chart */}
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

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
              <StatBox icon={<BookCheck className="w-6 h-6" />} label="Lessons Done" value={lessonsCompleted} color="text-amber-600" bg="bg-amber-50" />
              <StatBox icon={<Target className="w-6 h-6" />} label="Avg Score" value={`${averageScore}%`} color="text-green-600" bg="bg-green-50" />
              <StatBox icon={<Trophy className="w-6 h-6" />} label="Total XP" value={totalPoints} color="text-purple-600" bg="bg-purple-50" />
              <StatBox icon={<Medal className="w-6 h-6" />} label="Badges" value={earnedBadges.length} color="text-amber-600" bg="bg-amber-50" />
              <StatBox icon={<Flame className="w-6 h-6" />} label="Current Streak" value={`${currentStreak}d`} color="text-orange-600" bg="bg-orange-50" />
              <StatBox icon={<Zap className="w-6 h-6" />} label="Longest Streak" value={`${longestStreak}d`} color="text-rose-600" bg="bg-rose-50" />
              <StatBox icon={<Sparkles className="w-6 h-6" />} label="Skill Score" value={skillScore} color="text-indigo-600" bg="bg-indigo-50" />
              <StatBox icon={<Rocket className="w-6 h-6" />} label="Modules Done" value={modulesCompleted} color="text-teal-600" bg="bg-teal-50" />
            </div>
          </div>
        </div>

        {/* Tier Progress */}
        {data && (
          <div className="bg-white rounded-2xl border border-amber-200/60 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-amber-700" />
              <h2 className="text-lg font-bold text-amber-900">Tier Progress</h2>
              <span className="ml-auto text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {title}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-amber-700">Tier {currentTier}</span>
              <div className="flex-1 h-3 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-all duration-1000"
                  style={{ width: `${nextTierProgress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-amber-700">Tier {currentTier + 1}</span>
            </div>
            <p className="text-xs text-amber-500 mt-2 text-center">
              {nextTierProgress}% to next tier · {totalPoints} XP earned
            </p>
          </div>
        )}

        {/* Achievements */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg font-bold text-amber-900">Achievements</h2>
            <span className="ml-auto text-xs text-amber-500">
              {earnedBadges.length} earned · {availableBadges.length} available
            </span>
          </div>

          {earnedBadges.length === 0 && availableBadges.length === 0 ? (
            <div className="bg-white rounded-2xl border border-amber-200/60 p-8 text-center">
              <Award className="w-10 h-10 text-amber-300 mx-auto mb-3" />
              <p className="text-amber-900 font-semibold mb-1">No badges yet</p>
              <p className="text-sm text-amber-600">Complete lessons and maintain streaks to earn badges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Earned badges */}
              {earnedBadges.map((badge) => {
                const style = RARITY_STYLES[badge.rarity] || RARITY_STYLES.COMMON;
                return (
                  <div
                    key={badge.badgeCode}
                    className={`rounded-xl p-4 text-center border transition-all ${style.bg} ${style.border}`}
                    title={badge.description}
                  >
                    <div className={`mx-auto mb-2 ${style.color}`}>
                      <BadgeIcon badge={badge} size={28} />
                    </div>
                    <div className={`text-sm font-semibold ${style.color}`}>{badge.name}</div>
                    <div className="text-[10px] mt-1 opacity-80 font-bold uppercase tracking-wide">{style.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">Unlocked!</div>
                  </div>
                );
              })}
              {/* Available badges */}
              {availableBadges.slice(0, Math.max(0, 10 - earnedBadges.length)).map((badge) => {
                const style = RARITY_STYLES[badge.rarity] || RARITY_STYLES.COMMON;
                return (
                  <div
                    key={badge.badgeCode}
                    className="rounded-xl p-4 text-center border border-gray-200 bg-gray-50 text-gray-400 opacity-70 transition-all hover:opacity-100"
                    title={badge.description}
                  >
                    <div className="mx-auto mb-2 grayscale">
                      <BadgeIcon badge={badge} size={28} />
                    </div>
                    <div className="text-sm font-semibold">{badge.name}</div>
                    <div className="text-[10px] mt-1 opacity-60 font-bold uppercase tracking-wide">{style.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-60">Locked</div>
                  </div>
                );
              })}
            </div>
          )}
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
                        p.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.status === "COMPLETED" ? <BookCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
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
                    <Link href={`/learn/lesson/${p.lessonId}`} className="p-2 hover:bg-amber-100 rounded-lg transition-colors">
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
            <p className="text-amber-600 mb-4">Start your first lesson to begin tracking your progress!</p>
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

function StatBox({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
  return (
    <div className={`text-center p-3 rounded-xl ${bg}`}>
      <div className={`${color} mx-auto mb-1`}>{icon}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className={`text-[11px] opacity-80 ${color}`}>{label}</div>
    </div>
  );
}
