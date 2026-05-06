"use client";

import React, { useState } from "react";
import { Zap, TrendingUp, Anchor, Clock, Eye, Scale } from "lucide-react";

interface BalaData {
  name: string;
  sanskrit: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bg: string;
  sampleValue: number;
}

const BALAS: BalaData[] = [
  { name: "Sthana Bala", sanskrit: "Positional", icon: <Anchor className="w-5 h-5" />, description: "Strength from sign placement: own, exalted, moolatrikona, friendly, neutral, enemy, debilitated.", color: "#3b82f6", bg: "#eff6ff", sampleValue: 245 },
  { name: "Dig Bala", sanskrit: "Directional", icon: <TrendingUp className="w-5 h-5" />, description: "Strength from house direction. Jupiter & Mercury strongest in East (1st), Sun & Mars in South (10th), Saturn in West (7th), Moon & Venus in North (4th).", color: "#22c55e", bg: "#f0fdf4", sampleValue: 198 },
  { name: "Kala Bala", sanskrit: "Temporal", icon: <Clock className="w-5 h-5" />, description: "Strength from time of day, season, and planetary age. Divaratri (day/night), Paksha (lunar fortnight), etc.", color: "#f59e0b", bg: "#fffbeb", sampleValue: 312 },
  { name: "Cheshta Bala", sanskrit: "Motional", icon: <Zap className="w-5 h-5" />, description: "Strength from planetary motion: fast/direct = strong, slow/retrograde = variable.", color: "#ef4444", bg: "#fef2f2", sampleValue: 156 },
  { name: "Drig Bala", sanskrit: "Aspectual", icon: <Eye className="w-5 h-5" />, description: "Strength from aspects received. Benefic aspects add strength; malefic aspects reduce it.", color: "#a855f7", bg: "#faf5ff", sampleValue: 87 },
  { name: "Naisargika Bala", sanskrit: "Inherent", icon: <Scale className="w-5 h-5" />, description: "Permanent natural strength. Sun is strongest, followed by Moon, Venus, Mercury, Mars, Jupiter, Saturn.", color: "#475569", bg: "#f8fafc", sampleValue: 420 },
];

export default function Shadbala({ size = 640 }: { size?: number }) {
  const [selected, setSelected] = useState<number | null>(null);

  const totalShadbala = BALAS.reduce((s, b) => s + b.sampleValue, 0);
  const maxRupa = 5.0; // Minimum required for a planet to be strong

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/30 to-sky-50/10 border border-blue-200/40 shadow-2xl shadow-blue-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
            Shad Bala
          </h2>
          <p className="text-sm text-blue-400 mt-2 font-medium">
            Six-fold Planetary Strength — total strength must exceed 5 Rupa (300 Shashtiamsa)
          </p>
        </div>

        {/* Total strength bar */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-blue-700">Total Shadbala</span>
            <span className="text-lg font-extrabold text-blue-600">{totalShadbala} / 300+</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((totalShadbala / 360) * 100, 100)}%`, background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-gray-400">
            <span>0</span>
            <span>5 Rupa (300)</span>
            <span>10 Rupa (600)</span>
          </div>
        </div>

        {/* 6 Bala cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BALAS.map((bala, i) => {
            const isSelected = selected === i;
            const rupa = (bala.sampleValue / 60).toFixed(1);
            return (
              <button
                key={i}
                onClick={() => setSelected(isSelected ? null : i)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 ${isSelected ? "shadow-md" : "hover:shadow-sm"}`}
                style={{
                  background: isSelected ? bala.bg : "#fff",
                  borderColor: isSelected ? bala.color : "#e2e8f0",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: bala.color }}>
                    {bala.icon}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-gray-900">{bala.name}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: bala.color }}>{bala.sanskrit}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-lg font-extrabold" style={{ color: bala.color }}>{bala.sampleValue}</div>
                    <div className="text-[10px] text-gray-400">Shashtiamsa</div>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-2 pt-2 border-t" style={{ borderColor: `${bala.color}20` }}>
                    <p className="text-xs text-gray-600 leading-relaxed">{bala.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((bala.sampleValue / 60) / 5 * 100, 100)}%`, background: bala.color }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: bala.color }}>{rupa} Rupa</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
          <p className="text-xs text-blue-700">
            <strong>Rule:</strong> A planet is considered <strong>strong</strong> when its total Shadbala exceeds <strong>5 Rupa</strong> (300 Shashtiamsa).
            Tap any card above for details.
          </p>
        </div>
      </div>
    </div>
  );
}
