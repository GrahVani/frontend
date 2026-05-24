"use client";

import React from "react";
import { Flame, Zap } from "lucide-react";

interface QuizProgressProps {
  current: number;
  total: number;
  streak: number;
  xp: number;
}

export default function QuizProgress({ current, total, streak, xp }: QuizProgressProps) {
  const progress = ((current) / total) * 100;

  return (
    <div className="mb-6">
      {/* Top row: Question counter + streak + XP */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-amber-900">
            Question {current} <span className="text-amber-400">/</span> {total}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 rounded-full border border-orange-100">
              <Flame className={`w-4 h-4 ${streak >= 3 ? "text-orange-500" : "text-orange-400"}`} />
              <span className="text-xs font-bold text-orange-600">{streak} streak</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-full border border-amber-100">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-700">{xp} XP</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-amber-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
