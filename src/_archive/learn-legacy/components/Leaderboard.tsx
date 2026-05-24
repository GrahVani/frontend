"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, Flame, Crown, ChevronDown } from "lucide-react";
import { learnApi } from "@/lib/api/learn";

interface LeaderboardUser {
  rank: number;
  userId: string;
  displayName: string;
  points: number;
  avatar?: string;
  tier?: string;
}

interface LeaderboardData {
  period: string;
  myRank: number | null;
  totalParticipants: number;
  topUsers: LeaderboardUser[];
}

const PERIODS = [
  { value: "weekly", label: "This Week" },
  { value: "monthly", label: "This Month" },
  { value: "all_time", label: "All Time" },
];

const RANK_COLORS: Record<number, string> = {
  1: "bg-amber-100 text-amber-700 border-amber-300",
  2: "bg-gray-100 text-gray-700 border-gray-300",
  3: "bg-orange-100 text-orange-700 border-orange-300",
};

const RANK_ICONS: Record<number, React.ReactNode> = {
  1: <Crown className="w-5 h-5 text-amber-500" />,
  2: <Medal className="w-5 h-5 text-gray-500" />,
  3: <Award className="w-5 h-5 text-orange-500" />,
};

export default function Leaderboard({ userId }: { userId?: string }) {
  const [period, setPeriod] = useState("weekly");
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    learnApi.getLeaderboard(period, userId)
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch((err) => console.error("Leaderboard fetch error:", err))
      .finally(() => setLoading(false));
  }, [period, userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-amber-200/60 p-8 text-center">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-amber-600 text-sm">Loading leaderboard...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-amber-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-amber-900">Global Rankings</h3>
          </div>
          <span className="text-xs text-amber-500">{data.totalParticipants} learners</span>
        </div>

        {/* Period Tabs */}
        <div className="flex items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                period === p.value
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-600 hover:bg-amber-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="px-5 py-4 bg-gradient-to-b from-amber-50/50 to-white">
        <div className="flex items-end justify-center gap-3">
          {data.topUsers.slice(0, 3).map((user) => (
            <div
              key={user.rank}
              className={`flex flex-col items-center ${
                user.rank === 1 ? "order-2" : user.rank === 2 ? "order-1" : "order-3"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  user.rank === 1
                    ? "bg-amber-100 border-2 border-amber-400"
                    : user.rank === 2
                    ? "bg-gray-100 border-2 border-gray-300"
                    : "bg-orange-100 border-2 border-orange-300"
                }`}
              >
                {RANK_ICONS[user.rank] || <span className="text-sm font-bold">{user.rank}</span>}
              </div>
              <span className="text-xs font-bold text-amber-900 text-center truncate max-w-[80px]">
                {user.displayName}
              </span>
              <span className="text-xs text-amber-500 font-medium">{user.points.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rankings List */}
      <div className="divide-y divide-amber-50">
        {data.topUsers.map((user) => {
          const isMe = user.userId === userId;
          const rankStyle = RANK_COLORS[user.rank] || "bg-white text-amber-700 border-amber-100";

          return (
            <div
              key={user.rank}
              className={`flex items-center gap-3 px-5 py-3 ${
                isMe ? "bg-amber-50/50" : "hover:bg-gray-50"
              } transition-colors`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${rankStyle}`}
              >
                {user.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-amber-900 truncate">
                    {user.displayName}
                  </span>
                  {isMe && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-600 text-white rounded-full font-bold">
                      YOU
                    </span>
                  )}
                </div>
                {user.tier && (
                  <span className="text-[10px] text-amber-500">{user.tier}</span>
                )}
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-amber-700">{user.points.toLocaleString()}</span>
                <span className="text-[10px] text-amber-400 ml-1">XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* My Rank */}
      {data.myRank && data.myRank > 10 && (
        <div className="px-5 py-3 bg-amber-50 border-t border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-700">
              {data.myRank}
            </div>
            <span className="text-sm font-semibold text-amber-900">Your rank</span>
            <span className="ml-auto text-sm font-bold text-amber-700">
              Top {Math.round((data.myRank / data.totalParticipants) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
