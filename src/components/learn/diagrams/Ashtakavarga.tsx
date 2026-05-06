"use client";

import React, { useState } from "react";
import { Star, TrendingUp } from "lucide-react";

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const PLANET_COLORS = ["#f59e0b", "#94a3b8", "#ef4444", "#22c55e", "#f97316", "#a855f7", "#475569"];
const SIGNS = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

// Sample BAV data: each planet's contribution to each sign (0 or 1 bindu)
const BAV_DATA: number[][] = [
  // Sun
  [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
  // Moon
  [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
  // Mars
  [0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0],
  // Mercury
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
  // Jupiter
  [0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  // Venus
  [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  // Saturn
  [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
];

export default function Ashtakavarga({ size = 640 }: { size?: number }) {
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{p: number, s: number} | null>(null);

  // Calculate Sarvashtakavarga (total per sign)
  const sarpa = SIGNS.map((_, s) => BAV_DATA.reduce((sum, planetRow) => sum + planetRow[s], 0));

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50/30 to-orange-50/10 border border-amber-200/40 shadow-2xl shadow-amber-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-700">
            Ashtakavarga
          </h2>
          <p className="text-sm text-amber-500 mt-2 font-medium">
            Bhinnashtakavarga (BAV) — 7 planets × 12 signs = 84 bindu scoring matrix
          </p>
        </div>

        {/* Planet selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          <button
            onClick={() => setSelectedPlanet(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedPlanet === null ? "bg-amber-100 text-amber-700 border-amber-300" : "bg-white text-gray-400 border-gray-200"}`}
          >
            All Planets
          </button>
          {PLANETS.map((p, i) => (
            <button
              key={p}
              onClick={() => setSelectedPlanet(selectedPlanet === i ? null : i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedPlanet === i ? "shadow-sm" : ""}`}
              style={{
                background: selectedPlanet === i ? `${PLANET_COLORS[i]}15` : "#fff",
                borderColor: selectedPlanet === i ? PLANET_COLORS[i] : "#e2e8f0",
                color: selectedPlanet === i ? PLANET_COLORS[i] : "#94a3b8",
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: PLANET_COLORS[i] }} />
              {p}
            </button>
          ))}
        </div>

        {/* BAV Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Header row */}
            <div className="grid grid-cols-[100px_repeat(12,1fr)] gap-1 mb-1">
              <div className="text-xs font-bold text-gray-400 flex items-end pb-1">Planet \ Sign</div>
              {SIGNS.map((s, i) => (
                <div key={s} className="text-center">
                  <div className="text-[10px] font-bold text-gray-400">{i + 1}</div>
                  <div className="text-[10px] font-bold text-gray-500">{s}</div>
                </div>
              ))}
            </div>

            {/* Data rows */}
            {BAV_DATA.map((row, pIdx) => {
              if (selectedPlanet !== null && selectedPlanet !== pIdx) return null;
              return (
                <div key={pIdx} className="grid grid-cols-[100px_repeat(12,1fr)] gap-1 mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold" style={{ color: PLANET_COLORS[pIdx] }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: PLANET_COLORS[pIdx] }} />
                    {PLANETS[pIdx]}
                  </div>
                  {row.map((bindu, sIdx) => (
                    <div
                      key={sIdx}
                      className="aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer"
                      style={{
                        background: bindu ? `${PLANET_COLORS[pIdx]}20` : "#f8fafc",
                        border: `1.5px solid ${bindu ? PLANET_COLORS[pIdx] : "#e2e8f0"}`,
                        color: bindu ? PLANET_COLORS[pIdx] : "#cbd5e1",
                      }}
                      onMouseEnter={() => setHoveredCell({p: pIdx, s: sIdx})}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {bindu ? "1" : "0"}
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Sarvashtakavarga total row */}
            <div className="grid grid-cols-[100px_repeat(12,1fr)] gap-1 mt-2 pt-2 border-t border-amber-200">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700">
                <TrendingUp className="w-3.5 h-3.5" />
                SAV Total
              </div>
              {sarpa.map((total, i) => (
                <div
                  key={i}
                  className="aspect-square flex items-center justify-center rounded-lg text-xs font-extrabold"
                  style={{
                    background: total >= 5 ? "#f59e0b20" : total >= 3 ? "#eab30815" : "#f8fafc",
                    border: `1.5px solid ${total >= 5 ? "#f59e0b" : total >= 3 ? "#eab308" : "#e2e8f0"}`,
                    color: total >= 5 ? "#d97706" : total >= 3 ? "#a16207" : "#94a3b8",
                  }}
                >
                  {total}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-amber-500 bg-amber-500/20" /> Bindu (1 point)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-gray-200 bg-gray-50" /> No Bindu (0)</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" /> SAV ≥ 5 = Strong</span>
        </div>
      </div>
    </div>
  );
}
