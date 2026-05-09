"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell, TrendingUp, Anchor, Compass, Clock, Zap,
  Eye, Scale, Crown, Info, ArrowRight, Star, CheckCircle2
} from "lucide-react";

interface BalaDef {
  id: string;
  name: string;
  sanskrit: string;
  description: string;
  color: string;
  lightColor: string;
  icon: React.ReactNode;
}

const BALAS: BalaDef[] = [
  { id: "sthana", name: "Sthana Bala", sanskrit: "Positional", description: "Dignity: own sign, exaltation, moolatrikona = high. Enemy sign, debilitation = zero.", color: "#3b82f6", lightColor: "#eff6ff", icon: <Anchor className="w-4 h-4" /> },
  { id: "dik", name: "Dik Bala", sanskrit: "Directional", description: "Sun & Mars peak in 10th. Jupiter & Mercury in 1st. Saturn in 7th. Moon & Venus in 4th.", color: "#22c55e", lightColor: "#f0fdf4", icon: <Compass className="w-4 h-4" /> },
  { id: "kala", name: "Kala Bala", sanskrit: "Temporal", description: "Day/night birth, lunar phase (Shukla/Krishna Paksha), planetary war outcomes.", color: "#f59e0b", lightColor: "#fffbeb", icon: <Clock className="w-4 h-4" /> },
  { id: "chesta", name: "Chesta Bala", sanskrit: "Motional", description: "Velocity-based. Retrograde planets gain massive points — closer to Earth = stronger.", color: "#ef4444", lightColor: "#fef2f2", icon: <Zap className="w-4 h-4" /> },
  { id: "naisargika", name: "Naisargika Bala", sanskrit: "Inherent", description: "Fixed luminosity constant. Sun > Moon > Venus > Mercury > Mars > Jupiter > Saturn.", color: "#8b5cf6", lightColor: "#faf5ff", icon: <Scale className="w-4 h-4" /> },
  { id: "drig", name: "Drig Bala", sanskrit: "Aspectual", description: "Benefic aspects (Jupiter) add points. Malefic aspects (Saturn) deduct points.", color: "#64748b", lightColor: "#f8fafc", icon: <Eye className="w-4 h-4" /> },
];

interface PlanetScore {
  planet: string;
  color: string;
  scores: number[]; // 6 bala scores in Shashtiamsa
}

const PLANET_DATA: PlanetScore[] = [
  { planet: "Sun", color: "#f59e0b", scores: [245, 198, 312, 156, 420, 87] },
  { planet: "Moon", color: "#94a3b8", scores: [198, 156, 278, 134, 380, 120] },
  { planet: "Mars", color: "#ef4444", scores: [312, 245, 134, 289, 220, 56] },
  { planet: "Mercury", color: "#22c55e", scores: [267, 189, 245, 198, 260, 145] },
  { planet: "Jupiter", color: "#f97316", scores: [189, 134, 198, 167, 280, 178] },
  { planet: "Venus", color: "#a855f7", scores: [156, 178, 267, 145, 340, 134] },
  { planet: "Saturn", color: "#475569", scores: [134, 89, 156, 312, 180, 67] },
];

export default function ShadbalaScorerExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState(0); // Sun
  const [showDetails, setShowDetails] = useState(false);

  const p = PLANET_DATA[selectedPlanet];
  const total = p.scores.reduce((a, b) => a + b, 0);
  const rupa = (total / 60).toFixed(2);
  const isStrong = total >= 300; // 5 Rupa threshold

  // Ranking
  const ranked = [...PLANET_DATA]
    .map(pl => ({ ...pl, total: pl.scores.reduce((a, b) => a + b, 0) }))
    .sort((a, b) => b.total - a.total);
  const king = ranked[0];

  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <div className="w-full max-w-[780px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-rose-50/20 to-orange-50/10 border border-rose-200/50 shadow-2xl shadow-rose-900/5 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-orange-700">
            Shadbala Scorer
          </h2>
          <p className="text-sm text-rose-500/80 mt-2 font-medium">
            Six-fold strength algorithm — the true power ranking of every planet.
          </p>
        </div>

        {/* Planet selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          {PLANET_DATA.map((pl, i) => (
            <button
              key={pl.planet}
              onClick={() => { setSelectedPlanet(i); setShowDetails(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${selectedPlanet === i ? "shadow-md scale-105" : "hover:scale-[1.02]"}`}
              style={{
                background: selectedPlanet === i ? `${pl.color}15` : "#fff",
                borderColor: selectedPlanet === i ? pl.color : "#e2e8f0",
                color: selectedPlanet === i ? pl.color : "#64748b",
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: pl.color }} />
              {pl.planet}
            </button>
          ))}
        </div>

        {/* Score card */}
        <motion.div
          key={selectedPlanet}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-5 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ background: p.color }}>
              {p.planet[0]}
            </div>
            <div className="flex-1">
              <div className="text-lg font-extrabold text-gray-900">{p.planet}</div>
              <div className="text-xs text-gray-500">Shadbala Total Score</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold" style={{ color: p.color }}>{total}</div>
              <div className="text-xs text-gray-400">Shashtiamsa</div>
            </div>
            <div className="text-right pl-3 border-l border-gray-100">
              <div className="text-2xl font-extrabold text-gray-800">{rupa}</div>
              <div className="text-xs text-gray-400">Rupas</div>
            </div>
          </div>

          {/* Strength threshold bar */}
          <div className="mb-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Strength Threshold</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isStrong ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                {isStrong ? "STRONG ✓" : "WEAK ✗"}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((total / 400) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ background: isStrong ? "linear-gradient(90deg, #22c55e, #10b981)" : "linear-gradient(90deg, #ef4444, #f97316)" }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
              <span>0</span>
              <span className="font-bold text-gray-500">5 Rupa (300)</span>
              <span>10 Rupa (600)</span>
            </div>
          </div>

          {/* Toggle details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {showDetails ? "Hide" : "Show"} 6 Criteria Breakdown
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-3 space-y-2">
                  {BALAS.map((bala, i) => {
                    const score = p.scores[i];
                    const maxScore = 350;
                    return (
                      <div key={bala.id} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: bala.color }}>
                          {bala.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[11px] font-bold text-gray-700">{bala.name}</span>
                            <span className="text-[11px] font-extrabold" style={{ color: bala.color }}>{score}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(score / maxScore) * 100}%`, background: bala.color }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                  {BALAS.map((b, i) => `${b.sanskrit}: ${p.scores[i]}`).join(" · ")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Ranking table */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Planetary Power Ranking</span>
          </div>
          <div className="space-y-1.5">
            {ranked.map((pl, i) => {
              const isKing = i === 0;
              const plRupa = (pl.total / 60).toFixed(1);
              return (
                <div
                  key={pl.planet}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${isKing ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100"}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isKing ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {i + 1}
                  </div>
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: pl.color }} />
                  <span className="text-xs font-bold text-gray-800 w-16">{pl.planet}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(pl.total / ranked[0].total) * 100}%`, background: pl.color }} />
                  </div>
                  <span className="text-xs font-extrabold text-gray-700 w-10 text-right">{pl.total}</span>
                  <span className="text-[10px] font-bold text-gray-400 w-12 text-right">{plRupa} R</span>
                  {isKing && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">KING</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* King of the chart panel */}
        <motion.div
          className="mb-5 p-4 rounded-2xl border-2 text-center"
          style={{ background: `${king.color}08`, borderColor: `${king.color}30` }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-5 h-5" style={{ color: king.color }} />
            <span className="text-lg font-extrabold" style={{ color: king.color }}>{king.planet} is the King of this Chart</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed max-w-lg mx-auto">
            With a Shadbala score of <strong>{king.total}</strong> ({(king.total / 60).toFixed(1)} Rupas), 
            <strong> {king.planet}</strong> dominates every Dasha period it participates in. 
            Even if another planet is exalted in its sign, {king.planet}'s raw kinetic energy will override it.
          </p>
        </motion.div>

        {/* 6 Bala quick reference */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {BALAS.map((bala) => (
            <div key={bala.id} className="p-3 rounded-xl border" style={{ background: bala.lightColor, borderColor: `${bala.color}20` }}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px]" style={{ background: bala.color }}>
                  {bala.icon}
                </div>
                <span className="text-[10px] font-bold text-gray-700">{bala.name}</span>
              </div>
              <p className="text-[9px] text-gray-500 leading-relaxed">{bala.description}</p>
            </div>
          ))}
        </div>

        {/* Senior astrologer note */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50/60 border border-rose-200/40">
          <Info className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
          <p className="text-xs text-rose-800/80 leading-relaxed">
            <strong>Professional Note:</strong> When a user runs a "Sun-Saturn" Dasha, check Shadbala first. 
            If Saturn scores 150% and the Sun only 80%, Saturn dominates — regardless of the Sun's sign placement. 
            The user will experience delays and hard work. Never guess which planet wins a conflict. Compute it.
          </p>
        </div>
      </div>
    </div>
  );
}
