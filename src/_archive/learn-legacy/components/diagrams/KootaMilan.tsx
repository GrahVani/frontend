"use client";

import React, { useState } from "react";
import { Heart, CheckCircle, XCircle } from "lucide-react";

interface Koota {
  name: string;
  points: number;
  max: number;
  description: string;
  color: string;
  bg: string;
}

const KOotas: Koota[] = [
  { name: "Varna", points: 1, max: 1, description: "Spiritual compatibility based on caste/ego hierarchy.", color: "#7c3aed", bg: "#f5f3ff" },
  { name: "Vasya", points: 2, max: 2, description: "Mutual attraction and magnetic control between partners.", color: "#3b82f6", bg: "#eff6ff" },
  { name: "Tara", points: 3, max: 3, description: "Destiny alignment via nakshatra compatibility.", color: "#22c55e", bg: "#f0fdf4" },
  { name: "Yoni", points: 4, max: 4, description: "Sexual compatibility and physical harmony.", color: "#ef4444", bg: "#fef2f2" },
  { name: "Grahamaitri", points: 5, max: 5, description: "Planetary friendship between the two charts.", color: "#f59e0b", bg: "#fffbeb" },
  { name: "Gana", points: 6, max: 6, description: "Temperament match: Deva (divine), Manushya (human), Rakshasa (demonic).", color: "#f97316", bg: "#fff7ed" },
  { name: "Bhakoot", points: 7, max: 7, description: "Emotional compatibility and relative moon positions.", color: "#a855f7", bg: "#faf5ff" },
  { name: "Nadi", points: 8, max: 8, description: "Health and genetic compatibility — most important koota.", color: "#06b6d4", bg: "#ecfeff" },
];

export default function KootaMilan({ size = 640 }: { size?: number }) {
  const [selected, setSelected] = useState<number | null>(null);

  const total = KOotas.reduce((s, k) => s + k.points, 0);
  const maxTotal = KOotas.reduce((s, k) => s + k.max, 0);
  const score = Math.round((total / maxTotal) * 100);

  let verdict = "Good Match";
  let verdictColor = "#22c55e";
  if (score >= 80) { verdict = "Excellent Match"; verdictColor = "#22c55e"; }
  else if (score >= 60) { verdict = "Good Match"; verdictColor = "#3b82f6"; }
  else if (score >= 40) { verdict = "Average Match"; verdictColor = "#f59e0b"; }
  else { verdict = "Challenging"; verdictColor = "#ef4444"; }

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-pink-50 via-rose-50/30 to-red-50/10 border border-pink-200/40 shadow-2xl shadow-pink-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-700">
            Koota Milan
          </h2>
          <p className="text-sm text-pink-400 mt-2 font-medium">
            8-fold Compatibility Scoring — minimum 18/36 points for approval
          </p>
        </div>

        {/* Score gauge */}
        <div className="mb-6 p-5 rounded-2xl bg-white border border-pink-100 shadow-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-bold text-pink-700">Compatibility Score</span>
          </div>
          <div className="text-4xl font-extrabold" style={{ color: verdictColor }}>{total} / {maxTotal}</div>
          <div className="text-sm font-bold mt-1" style={{ color: verdictColor }}>{verdict}</div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mt-3 mx-auto max-w-[300px]">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${verdictColor}, ${verdictColor}80)` }} />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-gray-400 max-w-[300px] mx-auto">
            <span>0</span>
            <span>18 (min)</span>
            <span>36 (max)</span>
          </div>
        </div>

        {/* 8 Kootas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {KOotas.map((k, i) => {
            const isSelected = selected === i;
            const pct = (k.points / k.max) * 100;
            return (
              <button
                key={i}
                onClick={() => setSelected(isSelected ? null : i)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 ${isSelected ? "shadow-md" : "hover:shadow-sm"}`}
                style={{
                  background: isSelected ? k.bg : "#fff",
                  borderColor: isSelected ? k.color : "#e2e8f0",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold" style={{ color: k.color }}>{k.name}</span>
                  <span className="text-xs font-bold text-gray-500">{k.points}/{k.max}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: k.color }} />
                </div>
                {isSelected && (
                  <p className="text-[10px] text-gray-600 mt-2 leading-relaxed">{k.description}</p>
                )}
              </button>
            );
          })}
        </div>

        {/* Rules */}
        <div className="mt-4 p-3 rounded-xl bg-pink-50 border border-pink-100">
          <div className="text-xs font-bold text-pink-700 mb-1">Scoring Rules</div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> ≥ 18: Approved</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-blue-500" /> 24-32: Good</span>
            <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-amber-500" /> {'<'} 18: Caution</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-600" /> 32+: Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
