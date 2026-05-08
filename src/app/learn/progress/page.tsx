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
  COMMON:    { color: "text-gray-600",    bg: "bg-gray-50",    border: "border-gray-200",    label: "Common",    icon: Award },
  UNCOMMON:  { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Uncommon",  icon: Star },
  RARE:      { color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200",    label: "Rare",      icon: Gem },
  EPIC:      { color: "text-purple-600",  bg: "bg-purple-50",  border: "border-purple-200",  label: "Epic",      icon: Zap },
  LEGENDARY: { color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   label: "Legendary", icon: Crown },
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
          <p className="text-amber-700 font-medium">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "Student";

  // Core stats — ALL from backend dashboard (fully dynamic)
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
      {/* Header */}
      <div className="bg-white border-b border-amber-200/60 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-amber-900">Your Learning Journey</h1>
              <p className="text-amber-600 text-sm mt-1">
                Hey {firstName}, track your growth through Vedic astrology mastery.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                <Crown className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-amber-900">{title}</div>
                <div className="text-[10px] text-amber-500">Tier {currentTier}</div>
              </div>
              <div className="text-center px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl">
                <Star className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-purple-900">{skillScore}</div>
                <div className="text-[10px] text-purple-500">Skill Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Key Stats Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <StatCard icon={<BookCheck className="w-5 h-5" />} label="Completed" value={lessonsCompleted} sub={`/ ${totalLessons} passed`} color="green" />
          <StatCard icon={<Target className="w-5 h-5" />} label="Attempted" value={attemptedLessons} sub={`/ ${totalLessons} tried`} color="amber" />
          <StatCard icon={<Trophy className="w-5 h-5" />} label="Total XP" value={totalPoints} sub={pointsToNextTier > 0 ? `${pointsToNextTier} to next tier` : "Max tier!"} color="purple" />
          <StatCard icon={<Flame className="w-5 h-5" />} label="Streak" value={`${currentStreak}d`} sub={longestStreak > 0 ? `Best: ${longestStreak}d` : ""} color="orange" />
          <StatCard icon={<Rocket className="w-5 h-5" />} label="Modules Done" value={modulesCompleted} sub={`/ ${modules.length}`} color="teal" />
          <StatCard icon={<Star className="w-5 h-5" />} label="Avg Score" value={`${averageScore}%`} color="indigo" />
          <StatCard icon={<Sparkles className="w-5 h-5" />} label="Perfect" value={perfectLessons} sub={perfectLessons === 1 ? "lesson" : "lessons"} color="rose" />
          <StatCard icon={<Medal className="w-5 h-5" />} label="Badges" value={earnedBadges.length} sub={`/ ${earnedBadges.length + upcomingBadges.length}`} color="cyan" />
        </div>

        {/* ── Overall Progress + Tier ── */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Circular Progress */}
          <div className="bg-white rounded-2xl border border-amber-200/60 p-6 flex flex-col items-center justify-center">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-amber-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-amber-500" strokeDasharray={`${overallPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-amber-900">{overallPercent}%</span>
                <span className="text-[10px] text-amber-500">Complete</span>
              </div>
            </div>
            <p className="text-xs text-amber-600 mt-3 text-center">
              {attemptedLessons} attempted · {lessonsCompleted} passed
            </p>
            <p className="text-[10px] text-amber-400 mt-1 text-center max-w-[200px]">
              Overall progress counts every lesson you try, weighted by your score.
            </p>
          </div>

          {/* Tier Progress */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-amber-200/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-amber-700" />
              <h2 className="text-base font-bold text-amber-900">Tier Progress</h2>
              <span className="ml-auto text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                {title}
              </span>
            </div>

            {/* Exact XP numbers */}
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-amber-600 font-medium">{prevTierThreshold} XP</span>
              <span className="text-amber-900 font-bold">
                {totalPoints} <span className="text-amber-500 font-normal">/ {nextTierThreshold} XP</span>
              </span>
              <span className="text-amber-600 font-medium">{nextTierThreshold} XP</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-amber-700 w-14 text-right whitespace-nowrap">Tier {currentTier}</span>
              <div className="flex-1 h-3 bg-amber-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-all duration-1000" style={{ width: `${nextTierProgress}%` }} />
              </div>
              <span className="text-xs font-bold text-amber-700 w-14 whitespace-nowrap">Tier {currentTier + 1}</span>
            </div>
            <p className="text-xs text-amber-500 text-center mb-4">
              {pointsToNextTier > 0
                ? `${nextTierProgress}% to ${nextTierName} · ${pointsToNextTier} XP needed`
                : "You have reached the highest tier!"}
            </p>

            {/* Tier roadmap */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5, 6].map((tier) => {
                const isCurrent = tier === currentTier;
                const isCompleted = tier < currentTier;
                const tierShort = data?.tierNames?.[tier]?.split(" ").pop() || TIER_SHORT_FALLBACK[tier];
                return (
                  <div key={tier} className={`flex-1 min-w-[100px] text-center p-2 rounded-lg border ${isCurrent ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-300' : isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`text-[10px] font-bold ${isCurrent ? 'text-amber-700' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                      {isCompleted && <CheckCircle2 className="w-3 h-3 inline mr-0.5" />}
                      Tier {tier}
                    </div>
                    <div className={`text-[11px] font-semibold mt-0.5 ${isCurrent ? 'text-amber-800' : isCompleted ? 'text-green-700' : 'text-gray-400'}`}>
                      {tierShort}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isCurrent ? 'text-amber-500' : isCompleted ? 'text-green-500' : 'text-gray-300'}`}>
                      {data?.tierThresholds?.[tier - 1] ?? (tier - 1) * 500} XP
                    </div>
                  </div>
                );
              })}
            </div>

            {/* What tiers mean */}
            <div className="mt-4 p-3 bg-amber-50/60 rounded-lg border border-amber-100">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>Tiers</strong> unlock automatically as you earn XP. Each tier gives you a new title and reflects your growing mastery.
                  <strong> Skill Score</strong> (0-1000) measures overall mastery based on XP, accuracy, modules, and badges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Module Breakdown ── */}
        {modules.length > 0 && (
          <div className="bg-white rounded-2xl border border-amber-200/60 p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-amber-700" />
              <h2 className="text-base font-bold text-amber-900">Module Breakdown</h2>
              <span className="ml-auto text-xs text-amber-500">
                {modulesCompleted}/{modules.length} completed
              </span>
            </div>
            <div className="space-y-3">
              {modules.map((mod, idx) => {
                const isLocked = mod.status === "locked";
                const isCompleted = mod.status === "completed";
                const progress = mod.progressPercentage || 0;
                const moduleNum = idx + 1;
                return (
                  <div key={mod.moduleId} className={`flex items-center gap-4 p-3 rounded-xl border ${isLocked ? 'bg-gray-50 border-gray-100 opacity-60' : isCompleted ? 'bg-green-50/40 border-green-100' : 'bg-amber-50/40 border-amber-100'}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-100 text-green-600' : isLocked ? 'bg-gray-100 text-gray-400' : 'bg-amber-100 text-amber-600'}`}>
                      {isLocked ? <Lock className="w-4 h-4" /> : isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <BookCheck className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold truncate ${isLocked ? 'text-gray-500' : 'text-amber-900'}`}>
                          M{moduleNum}: {mod.title.replace(/^Module\s+\d+:\s*/, "")}
                        </p>
                        {isCompleted && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700">Done</span>}
                        {isLocked && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Locked</span>}
                        {!isLocked && !isCompleted && progress > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">{progress}%</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-1.5 bg-amber-100 rounded-full overflow-hidden max-w-[180px]">
                          <div className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : isLocked ? 'bg-gray-200' : 'bg-amber-500'}`} style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-[11px] text-amber-500">
                          {mod.lessonsCompleted}/{mod.totalLessons} lessons
                        </span>
                        {mod.averageScore > 0 && (
                          <span className="text-[11px] font-medium text-amber-600">
                            Avg {mod.averageScore}%
                          </span>
                        )}
                      </div>
                    </div>
                    {!isLocked && (
                      <Link href={`/learn/lesson/${mod.moduleId}`} className="p-2 hover:bg-amber-100 rounded-lg transition-colors shrink-0">
                        <ArrowRight className="w-4 h-4 text-amber-500" />
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
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-700" />
            <h2 className="text-base font-bold text-amber-900">Milestones</h2>
            <span className="ml-auto text-xs text-amber-500">
              {earnedBadges.length} earned · {upcomingBadges.length} upcoming
            </span>
          </div>

          {earnedBadges.length === 0 && upcomingBadges.length === 0 ? (
            <div className="bg-white rounded-2xl border border-amber-200/60 p-6 text-center">
              <Award className="w-8 h-8 text-amber-300 mx-auto mb-2" />
              <p className="text-amber-900 font-semibold text-sm">No milestones yet</p>
              <p className="text-xs text-amber-600 mt-1">Pass a lesson (score ≥70%) to start earning milestones!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Earned milestones grid */}
              {earnedBadges.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3">Earned</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {earnedBadges.map((badge) => {
                      const style = RARITY_STYLES[badge.rarity] || RARITY_STYLES.COMMON;
                      const Icon = style.icon;
                      return (
                        <div key={badge.badgeCode} className={`flex items-center gap-3 p-3 rounded-xl border ${style.bg} ${style.border}`}>
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white/60`}>
                            <Icon className={`w-4 h-4 ${style.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-sm font-semibold truncate ${style.color}`}>{badge.name}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                            </div>
                            <p className="text-[11px] text-amber-600 truncate">{badge.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upcoming milestones */}
              {upcomingBadges.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3">Upcoming</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {upcomingBadges.slice(0, 9).map((badge) => {
                      const style = RARITY_STYLES[badge.rarity] || RARITY_STYLES.COMMON;
                      const Icon = style.icon;
                      const pct = badge.progress?.percent || 0;
                      const current = badge.progress?.current || 0;
                      const target = badge.progress?.target || 1;
                      return (
                        <div key={badge.badgeCode} className="p-4 rounded-xl border border-gray-200 bg-white hover:border-amber-200 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-gray-100 text-gray-400">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-700 truncate">{badge.name}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 shrink-0">{style.label}</span>
                              </div>
                              <p className="text-[11px] text-gray-500 truncate">{badge.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[11px] font-medium text-amber-600 whitespace-nowrap">
                              {current}/{target}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">{pct}% complete · +{badge.pointsReward || 0} XP on earn</p>
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
          <div className="bg-white rounded-2xl border border-amber-200/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-amber-700" />
              <h2 className="text-base font-bold text-amber-900">Recent Activity</h2>
            </div>
            <div className="space-y-2">
              {data.progress.slice(0, 10).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl hover:bg-amber-100/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${p.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {p.status === "COMPLETED" ? <BookCheck className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-900">{p.lesson?.title || "Lesson"}</p>
                      <p className="text-[11px] text-amber-600">
                        {p.status === "COMPLETED"
                          ? `Passed${p.completedAt ? " on " + new Date(p.completedAt).toLocaleDateString() : ""}`
                          : "In Progress · retry to pass (≥70%)"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.score !== null && p.score !== undefined && (
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.score >= 70 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {p.score}%
                      </div>
                    )}
                    <Link href={`/learn/lesson/${p.lessonId}`} className="p-1.5 hover:bg-amber-100 rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4 text-amber-500" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!data || data.progress.length === 0) && (
          <div className="bg-white rounded-2xl border border-amber-200/60 p-8 text-center">
            <BookCheck className="w-10 h-10 text-amber-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-amber-900 mb-1">No activity yet</h3>
            <p className="text-sm text-amber-600 mb-4">Start your first lesson to begin tracking your progress!</p>
            <Link href="/learn" className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors text-sm">
              Start Learning <ChevronRight className="w-4 h-4" />
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
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
  };
  const cls = colorMap[color] || colorMap.amber;

  return (
    <div className={`rounded-xl border p-3 ${cls}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[11px] font-medium opacity-80">{label}</span>
      </div>
      <div className="text-xl font-bold">{value}</div>
      {sub && <div className="text-[10px] opacity-70">{sub}</div>}
    </div>
  );
}


