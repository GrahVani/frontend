"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Grid3X3, TrendingUp, Star, AlertTriangle, CheckCircle2,
  Info, Zap, ArrowRight
} from "lucide-react";

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const PLANET_COLORS = ["#f59e0b", "#94a3b8", "#ef4444", "#22c55e", "#f97316", "#a855f7", "#475569"];
const SIGNS = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

// Realistic BAV data: each planet's bindu contribution to each sign
const BAV_DATA: number[][] = [
  [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1], // Sun
  [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0], // Moon
  [0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0], // Mars
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0], // Mercury
  [0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1], // Jupiter
  [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1], // Venus
  [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1], // Saturn
];

const TRANSIT_EXAMPLES = [
  { planet: "Saturn", sign: 9, sav: 38, bav: 6, label: "Saturn in Sagittarius", result: "ELEVATION through hard work" },
  { planet: "Jupiter", sign: 0, sav: 22, bav: 2, label: "Jupiter in Aries", result: "BLOCKED — low structural support" },
  { planet: "Venus", sign: 6, sav: 31, bav: 5, label: "Venus in Libra", result: "RELATIONSHIP breakthrough" },
];

export default function AshtakavargaMatrixExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ p: number; s: number } | null>(null);
  const [activeExample, setActiveExample] = useState(0);

  // SAV = sum of all planets per sign
  const sav = SIGNS.map((_, s) => BAV_DATA.reduce((sum, row) => sum + row[s], 0));
  const totalSav = sav.reduce((a, b) => a + b, 0);

  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <div className="w-full max-w-[780px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-teal-50/20 to-cyan-50/10 border border-teal-200/50 shadow-2xl shadow-teal-900/5 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-cyan-700">
            Ashtakavarga Matrix
          </h2>
          <p className="text-sm text-teal-500/80 mt-2 font-medium">
            Binary bindu scoring across 7 planets × 12 signs = 337 total points.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-white border border-teal-100 shadow-sm text-center">
            <div className="text-xs font-bold text-gray-400 uppercase">Total SAV</div>
            <div className="text-xl font-extrabold text-teal-700">{totalSav}</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-teal-100 shadow-sm text-center">
            <div className="text-xs font-bold text-gray-400 uppercase">Average / House</div>
            <div className="text-xl font-extrabold text-teal-700">{(totalSav / 12).toFixed(1)}</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-teal-100 shadow-sm text-center">
            <div className="text-xs font-bold text-gray-400 uppercase">Reference Points</div>
            <div className="text-xl font-extrabold text-teal-700">8</div>
          </div>
        </div>

        {/* Planet selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <button
            onClick={() => setSelectedPlanet(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedPlanet === null ? "bg-teal-600 text-white border-teal-600 shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-teal-300"}`}
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
                color: selectedPlanet === i ? PLANET_COLORS[i] : "#64748b",
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: PLANET_COLORS[i] }} />
              {p}
            </button>
          ))}
        </div>

        {/* BAV Grid */}
        <div className="overflow-x-auto mb-4">
          <div className="min-w-[520px]">
            {/* Header */}
            <div className="grid grid-cols-[80px_repeat(12,1fr)_60px] gap-1 mb-1">
              <div className="text-[10px] font-bold text-gray-400 flex items-end pb-1">Planet</div>
              {SIGNS.map((s, i) => (
                <div key={s} className="text-center">
                  <div className="text-[9px] font-bold text-gray-400">{i + 1}</div>
                  <div className="text-[9px] font-bold text-gray-600">{s}</div>
                </div>
              ))}
              <div className="text-[10px] font-bold text-gray-400 text-center">BAV</div>
            </div>

            {/* Rows */}
            {BAV_DATA.map((row, pIdx) => {
              if (selectedPlanet !== null && selectedPlanet !== pIdx) return null;
              const bavTotal = row.reduce((a, b) => a + b, 0);
              return (
                <div key={pIdx} className="grid grid-cols-[80px_repeat(12,1fr)_60px] gap-1 mb-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: PLANET_COLORS[pIdx] }}>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PLANET_COLORS[pIdx] }} />
                    {PLANETS[pIdx]}
                  </div>
                  {row.map((bindu, sIdx) => {
                    const isHover = hoveredCell?.p === pIdx && hoveredCell?.s === sIdx;
                    return (
                      <div
                        key={sIdx}
                        className="aspect-square flex items-center justify-center rounded-md text-[10px] font-bold transition-all cursor-pointer"
                        style={{
                          background: bindu ? `${PLANET_COLORS[pIdx]}18` : "#f8fafc",
                          border: `1.5px solid ${bindu ? PLANET_COLORS[pIdx] : "#e2e8f0"}`,
                          color: bindu ? PLANET_COLORS[pIdx] : "#cbd5e1",
                          transform: isHover ? "scale(1.1)" : "scale(1)",
                        }}
                        onMouseEnter={() => setHoveredCell({ p: pIdx, s: sIdx })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {bindu ? "●" : "○"}
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-center">
                    <span className="text-xs font-extrabold" style={{ color: PLANET_COLORS[pIdx] }}>{bavTotal}</span>
                  </div>
                </div>
              );
            })}

            {/* SAV total row */}
            <div className="grid grid-cols-[80px_repeat(12,1fr)_60px] gap-1 mt-2 pt-2 border-t border-teal-200">
              <div className="flex items-center gap-1 text-[10px] font-extrabold text-teal-700">
                <TrendingUp className="w-3 h-3" />
                SAV
              </div>
              {sav.map((total, i) => (
                <div
                  key={i}
                  className="aspect-square flex items-center justify-center rounded-md text-[10px] font-extrabold"
                  style={{
                    background: total >= 30 ? "#14b8a620" : total >= 25 ? "#f59e0b15" : "#ef444415",
                    border: `1.5px solid ${total >= 30 ? "#14b8a6" : total >= 25 ? "#f59e0b" : "#ef4444"}`,
                    color: total >= 30 ? "#0f766e" : total >= 25 ? "#b45309" : "#b91c1c",
                  }}
                >
                  {total}
                </div>
              ))}
              <div className="flex items-center justify-center">
                <span className="text-xs font-extrabold text-teal-700">{totalSav}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-500 mb-5">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-teal-500 bg-teal-500/20" /> ● Bindu (1)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-gray-200 bg-gray-50" /> ○ Rekha (0)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-emerald-500 bg-emerald-500/20" /> SAV ≥ 30 Strong</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-red-500 bg-red-500/20" /> SAV &lt; 25 Weak</span>
        </div>

        {/* Golden Rule panel */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">The Golden Rule</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-center">
              <div className="text-lg font-extrabold text-red-600">&lt; 25</div>
              <div className="text-[10px] font-bold text-red-500">Weak House</div>
              <div className="text-[9px] text-red-400 mt-1">Hard work, disappointment</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
              <div className="text-lg font-extrabold text-amber-600">25–28</div>
              <div className="text-[10px] font-bold text-amber-500">Average</div>
              <div className="text-[9px] text-amber-400 mt-1">Standard experiences</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <div className="text-lg font-extrabold text-emerald-600">30+</div>
              <div className="text-[10px] font-bold text-emerald-500">Highly Potent</div>
              <div className="text-[9px] text-emerald-400 mt-1">Natural flourishing</div>
            </div>
          </div>
        </div>

        {/* Transit validation examples */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Transit Validation Engine</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {TRANSIT_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setActiveExample(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeExample === i ? "bg-teal-600 text-white border-teal-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"}`}
              >
                {ex.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeExample}
              {...fadeUp}
              className="p-3 rounded-xl border"
              style={{
                background: TRANSIT_EXAMPLES[activeExample].sav >= 30 ? "#f0fdf4" : "#fef2f2",
                borderColor: TRANSIT_EXAMPLES[activeExample].sav >= 30 ? "#86efac" : "#fecaca",
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm`} style={{ background: PLANET_COLORS[PLANETS.indexOf(TRANSIT_EXAMPLES[activeExample].planet)] }}>
                  {TRANSIT_EXAMPLES[activeExample].planet[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800">{TRANSIT_EXAMPLES[activeExample].label}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white border border-gray-200">SAV: {TRANSIT_EXAMPLES[activeExample].sav}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white border border-gray-200">BAV: {TRANSIT_EXAMPLES[activeExample].bav}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-extrabold ${TRANSIT_EXAMPLES[activeExample].sav >= 30 ? "text-emerald-600" : "text-red-600"}`}>
                    {TRANSIT_EXAMPLES[activeExample].result}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Senior astrologer note */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-teal-50/60 border border-teal-200/40">
          <Info className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
          <p className="text-xs text-teal-800/80 leading-relaxed">
            <strong>Professional Note:</strong> Amateur software assumes Jupiter transit = good, Saturn transit = bad. 
            Ashtakavarga overrides this. If Saturn transits a house with 38 SAV points, the high structural reinforcement 
            means Saturn causes <em>elevation through hard work</em> — not job loss. The points override the planet's nature.
          </p>
        </div>
      </div>
    </div>
  );
}
