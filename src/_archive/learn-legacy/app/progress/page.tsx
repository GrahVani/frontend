"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type DashboardData, type BadgeItem } from "@/lib/api";
import {
  Trophy, BookCheck, Target, Award, Star, Clock, Flame,
  ChevronRight, Crown, Zap, Rocket, Gem, Shield, Lock,
  CheckCircle2, TrendingUp, BarChart3, Info, Sparkles,
  ArrowRight, Medal
} from "lucide-react";
import Link from "next/link";

/* ── Rarity config ── */
const RARITY_STYLES: Record<string, { color: string; bg: string; border: string; label: string; icon: React.ElementType }> = {
  COMMON:    { color: "text-gray-700",    bg: "bg-gray-50",    border: "border-gray-200",    label: "Common",    icon: Award },
  UNCOMMON:  { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", label: "Uncommon",  icon: Star },
  RARE:      { color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",    label: "Rare",      icon: Gem },
  EPIC:      { color: "text-purple-700",  bg: "bg-purple-50",  border: "border-purple-200",  label: "Epic",      icon: Zap },
  LEGENDARY: { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   label: "Legendary", icon: Crown },
};

const TIER_SHORT_FALLBACK: Record<number, string> = {
  1: "Novice", 2: "Seeker", 3: "Scholar", 4: "Adept", 5: "Master", 6: "Acharya",
};

interface ModuleProgressItem {
  moduleId: string;
  title: string;
  status: string;
  progressPercentage: number;
  lessonsCompleted: number;
  totalLessons: number;
  averageScore: number;
}

export default function LearnProgressPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [modules, setModules] = useState<ModuleProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    Promise.all([
      learnApi.getDashboard(user.id),
      learnApi.getModuleProgress(user.id),
    ])
      .then(([dashRes, modRes]) => {
        if (dashRes.success) setData(dashRes.data);
        if (modRes.success) setModules(modRes.data.modules);
      })
      .catch((err: Error) => console.error("Failed to fetch progress:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-800 font-semibold text-lg">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "Student";

  // Core stats
  const lessonsCompleted = data?.lessonsCompleted || 0;
  const attemptedLessons = data?.attemptedLessons || 0;
  const totalLessons = data?.totalLessons || 0;
  const overallPercent = data?.overallProgress || 0;
  const averageScore = data?.averageScore || 0;
  const totalPoints = data?.totalPoints || 0;
  const currentStreak = data?.currentStreak || 0;
  const longestStreak = data?.longestStreak || 0;
  const skillScore = data?.skillScore || 0;
  const currentTier = data?.currentTier || 1;
  const nextTierProgress = data?.nextTierProgress || 0;
  const nextTierThreshold = data?.nextTierThreshold || 500;
  const prevTierThreshold = data?.prevTierThreshold || 0;
  const pointsToNextTier = data?.pointsToNextTier || 0;
  const modulesCompleted = data?.totalModulesCompleted || 0;
  const perfectLessons = data?.perfectLessons || 0;
  const title = data?.title || data?.tierNames?.[currentTier] || "Jyotish Novice";
  const nextTierName = data?.tierNames?.[currentTier + 1] || TIER_SHORT_FALLBACK[currentTier + 1] || "Max Tier";

  const earnedBadges = data?.badges?.earned || [];
  const upcomingBadges = data?.badges?.upcoming || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* ── Dense Header ── */}
      <div className="bg-white border-b border-amber-200/60 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-900">Your Learning Journey</h1>
              <p className="text-amber-700 text-sm sm:text-base mt-1 font-medium">
                Hey {firstName}, track your growth through Vedic astrology mastery.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                <Crown className="w-5 h-5 text-amber-700 mx-auto mb-1" />
                <div className="text-sm font-extrabold text-amber-900">{title}</div>
                <div className="text-xs text-amber-700 font-semibold">Tier {currentTier}</div>
              </div>
              <div className="text-center px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-xl">
                <Star className="w-5 h-5 text-purple-700 mx-auto mb-1" />
                <div className="text-sm font-extrabold text-purple-900">{skillScore}</div>
                <div className="text-xs text-purple-700 font-semibold">Skill Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content: full width, dense ── */}
      <div className="px-4 sm:px-6 lg:px-8 py-5 space-y-5">

        {/* ── Stats Bar: 8 cards, single row on large ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          <StatCard icon={<BookCheck className="w-5 h-5" />} label="Completed" value={lessonsCompleted} sub={`/ ${totalLessons} passed`} color="green" />
          <StatCard icon={<Target className="w-5 h-5" />} label="Attempted" value={attemptedLessons} sub={`/ ${totalLessons} tried`} color="amber" />
          <StatCard icon={<Trophy className="w-5 h-5" />} label="Total XP" value={totalPoints} sub={pointsToNextTier > 0 ? `${pointsToNextTier} to next` : "Max tier!"} color="purple" />
          <StatCard icon={<Flame className="w-5 h-5" />} label="Streak" value={`${currentStreak}d`} sub={longestStreak > 0 ? `Best: ${longestStreak}d` : ""} color="orange" />
          <StatCard icon={<Rocket className="w-5 h-5" />} label="Modules" value={modulesCompleted} sub={`/ ${modules.length}`} color="teal" />
          <StatCard icon={<Star className="w-5 h-5" />} label="Avg Score" value={`${averageScore}%`} color="indigo" />
          <StatCard icon={<Sparkles className="w-5 h-5" />} label="Perfect" value={perfectLessons} sub={perfectLessons === 1 ? "lesson" : "lessons"} color="rose" />
          <StatCard icon={<Medal className="w-5 h-5" />} label="Badges" value={earnedBadges.length} sub={`/ ${earnedBadges.length + upcomingBadges.length}`} color="cyan" />
        </div>

        {/* ── Progress + Tier: side by side, full width ── */}
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Circular Progress */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-amber-200/60 p-4 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-amber-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-amber-600" strokeDasharray={`${overallPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-amber-900">{overallPercent}%</span>
                <span className="text-xs font-bold text-amber-700">Complete</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-amber-800 mt-2 text-center">
              {attemptedLessons} attempted · {lessonsCompleted} passed
            </p>
            <p className="text-xs text-amber-700 mt-0.5 text-center">
              Weighted by your score
            </p>
          </div>

          {/* Tier Progress */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-amber-200/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-amber-800" />
              <h2 className="text-lg font-extrabold text-amber-900">Tier Progress</h2>
              <span className="ml-auto text-sm font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {title}
              </span>
            </div>

            {/* XP bar */}
            <div className="flex items-center justify-between text-sm font-bold mb-1">
              <span className="text-amber-800">{prevTierThreshold} XP</span>
              <span className="text-amber-900">
                {totalPoints} <span className="text-amber-700 font-medium">/ {nextTierThreshold} XP</span>
              </span>
              <span className="text-amber-800">{nextTierThreshold} XP</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-extrabold text-amber-900 w-16 text-right">Tier {currentTier}</span>
              <div className="flex-1 h-4 bg-amber-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 transition-all duration-1000" style={{ width: `${nextTierProgress}%` }} />
              </div>
              <span className="text-sm font-extrabold text-amber-900 w-16">Tier {currentTier + 1}</span>
            </div>
            <p className="text-sm font-semibold text-amber-800 text-center mb-3">
              {pointsToNextTier > 0
                ? `${nextTierProgress}% to ${nextTierName} · ${pointsToNextTier} XP needed`
                : "You have reached the highest tier!"}
            </p>

            {/* Tier roadmap */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((tier) => {
                const isCurrent = tier === currentTier;
                const isCompleted = tier < currentTier;
                const tierShort = data?.tierNames?.[tier]?.split(" ").pop() || TIER_SHORT_FALLBACK[tier];
                return (
                  <div key={tier} className={`text-center p-2.5 rounded-lg border ${isCurrent ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400' : isCompleted ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                    <div className={`text-xs font-bold ${isCurrent ? 'text-amber-900' : isCompleted ? 'text-green-800' : 'text-gray-500'}`}>
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 inline mr-0.5" />}
                      Tier {tier}
                    </div>
                    <div className={`text-sm font-extrabold mt-0.5 ${isCurrent ? 'text-amber-900' : isCompleted ? 'text-green-900' : 'text-gray-500'}`}>
                      {tierShort}
                    </div>
                    <div className={`text-xs font-semibold mt-0.5 ${isCurrent ? 'text-amber-700' : isCompleted ? 'text-green-700' : 'text-gray-400'}`}>
                      {data?.tierThresholds?.[tier - 1] ?? (tier - 1) * 500} XP
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info note */}
            <div className="mt-3 p-2.5 bg-amber-50/80 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-amber-900 leading-relaxed">
                  <strong>Tiers</strong> unlock automatically as you earn XP. Each tier gives you a new title and reflects your growing mastery.
                  <strong> Skill Score</strong> (0-1000) measures overall mastery based on XP, accuracy, modules, and badges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Module Breakdown ── */}
        {modules.length > 0 && (
          <div className="bg-white rounded-xl border border-amber-200/60 p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-amber-800" />
              <h2 className="text-lg font-extrabold text-amber-900">Module Breakdown</h2>
              <span className="ml-auto text-sm font-bold text-amber-700">
                {modulesCompleted}/{modules.length} completed
              </span>
            </div>
            <div className="space-y-2">
              {modules.map((mod, idx) => {
                const isLocked = mod.status === "locked";
                const isCompleted = mod.status === "completed";
                const progress = mod.progressPercentage || 0;
                const moduleNum = idx + 1;
                return (
                  <div key={mod.moduleId} className={`flex items-center gap-3 p-2.5 rounded-lg border ${isLocked ? 'bg-gray-50 border-gray-200 opacity-60' : isCompleted ? 'bg-green-50/50 border-green-200' : 'bg-amber-50/30 border-amber-200'}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-100 text-green-700' : isLocked ? 'bg-gray-200 text-gray-500' : 'bg-amber-100 text-amber-700'}`}>
                      {isLocked ? <Lock className="w-5 h-5" /> : isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <BookCheck className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold truncate ${isLocked ? 'text-gray-600' : 'text-amber-900'}`}>
                          M{moduleNum}: {mod.title.replace(/^Module\s+\d+:\s*/, "")}
                        </p>
                        {isCompleted && <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200">Done</span>}
                        {isLocked && <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-gray-200 text-gray-600 border border-gray-300">Locked</span>}
                        {!isLocked && !isCompleted && progress > 0 && <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">{progress}%</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isCompleted ? 'bg-green-600' : isLocked ? 'bg-gray-300' : 'bg-amber-500'}`} style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs font-bold text-amber-800">
                          {mod.lessonsCompleted}/{mod.totalLessons} lessons
                        </span>
                        {mod.averageScore > 0 && (
                          <span className="text-xs font-bold text-amber-900">
                            Avg {mod.averageScore}%
                          </span>
                        )}
                      </div>
                    </div>
                    {!isLocked && (
                      <Link href={`/learn/lesson/${mod.moduleId}`} className="p-2 hover:bg-amber-100 rounded-lg transition-colors shrink-0">
                        <ArrowRight className="w-5 h-5 text-amber-700" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Milestones ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-amber-800" />
            <h2 className="text-lg font-extrabold text-amber-900">Milestones</h2>
            <span className="ml-auto text-sm font-bold text-amber-700">
              {earnedBadges.length} earned · {upcomingBadges.length} upcoming
            </span>
          </div>

          {earnedBadges.length === 0 && upcomingBadges.length === 0 ? (
            <div className="bg-white rounded-xl border border-amber-200/60 p-5 text-center">
              <Award className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <p className="text-amber-900 font-bold text-base">No milestones yet</p>
              <p className="text-sm text-amber-700 mt-1 font-medium">Pass a lesson (score ≥70%) to start earning milestones!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Earned */}
              {earnedBadges.length > 0 && (
                <div>
                  <p className="text-sm font-extrabold text-amber-900 uppercase tracking-wide mb-2">Earned</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {earnedBadges.map((badge) => {
                      const style = RARITY_STYLES[badge.rarity] || RARITY_STYLES.COMMON;
                      const Icon = style.icon;
                      return (
                        <div key={badge.badgeCode} className={`flex items-center gap-3 p-2.5 rounded-lg border ${style.bg} ${style.border}`}>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-white/70`}>
                            <Icon className={`w-5 h-5 ${style.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-sm font-bold truncate ${style.color}`}>{badge.name}</span>
                              <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                            </div>
                            <p className="text-xs font-semibold text-amber-800 truncate">{badge.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upcoming */}
              {upcomingBadges.length > 0 && (
                <div>
                  <p className="text-sm font-extrabold text-amber-900 uppercase tracking-wide mb-2">Upcoming</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {upcomingBadges.slice(0, 12).map((badge) => {
                      const style = RARITY_STYLES[badge.rarity] || RARITY_STYLES.COMMON;
                      const Icon = style.icon;
                      const pct = badge.progress?.percent || 0;
                      const current = badge.progress?.current || 0;
                      const target = badge.progress?.target || 1;
                      return (
                        <div key={badge.badgeCode} className="p-3 rounded-lg border border-gray-200 bg-white hover:border-amber-300 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gray-100 text-gray-500">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-800 truncate">{badge.name}</span>
                                <span className="text-xs font-extrabold uppercase tracking-wide text-gray-500 shrink-0">{style.label}</span>
                              </div>
                              <p className="text-xs font-semibold text-gray-600 truncate">{badge.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-bold text-amber-800 whitespace-nowrap">
                              {current}/{target}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-gray-600 mt-1">{pct}% complete · +{badge.pointsReward || 0} XP</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Recent Activity ── */}
        {data && data.progress.length > 0 && (
          <div className="bg-white rounded-xl border border-amber-200/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-amber-800" />
              <h2 className="text-lg font-extrabold text-amber-900">Recent Activity</h2>
            </div>
            <div className="space-y-1.5">
              {data.progress.slice(0, 10).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 bg-amber-50/50 rounded-lg hover:bg-amber-100/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${p.status === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                      {p.status === "COMPLETED" ? <BookCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-900">{p.lesson?.title || "Lesson"}</p>
                      <p className="text-xs font-semibold text-amber-800">
                        {p.status === "COMPLETED"
                          ? `Passed${p.completedAt ? " on " + new Date(p.completedAt).toLocaleDateString() : ""}`
                          : "In Progress · retry to pass (≥70%)"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.score !== null && p.score !== undefined && (
                      <div className={`px-3 py-1 rounded-full text-sm font-extrabold ${p.score >= 70 ? "bg-green-100 text-green-800 border border-green-200" : "bg-amber-100 text-amber-800 border border-amber-200"}`}>
                        {p.score}%
                      </div>
                    )}
                    <Link href={`/learn/lesson/${p.lessonId}`} className="p-2 hover:bg-amber-100 rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5 text-amber-700" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!data || data.progress.length === 0) && (
          <div className="bg-white rounded-xl border border-amber-200/60 p-6 text-center">
            <BookCheck className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-amber-900 mb-1">No activity yet</h3>
            <p className="text-base text-amber-800 mb-4 font-medium">Start your first lesson to begin tracking your progress!</p>
            <Link href="/learn" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl transition-colors text-base">
              Start Learning <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    green: "bg-green-50 text-green-800 border-green-200",
    purple: "bg-purple-50 text-purple-800 border-purple-200",
    orange: "bg-orange-50 text-orange-800 border-orange-200",
    teal: "bg-teal-50 text-teal-800 border-teal-200",
    indigo: "bg-indigo-50 text-indigo-800 border-indigo-200",
    rose: "bg-rose-50 text-rose-800 border-rose-200",
    cyan: "bg-cyan-50 text-cyan-800 border-cyan-200",
  };
  const cls = colorMap[color] || colorMap.amber;

  return (
    <div className={`rounded-xl border p-3 ${cls}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs font-bold opacity-90">{label}</span>
      </div>
      <div className="text-2xl font-extrabold">{value}</div>
      {sub && <div className="text-xs font-semibold opacity-80">{sub}</div>}
    </div>
  );
}
