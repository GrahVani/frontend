"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Crown, Star, BarChart3, CheckCircle2, XCircle, Sparkles,
  TrendingUp, Shield, AlertTriangle,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────
const PLANETS = [
  { name: "Sun", icon: "☉", color: "#f97316", maxScore: 58 },
  { name: "Moon", icon: "☽", color: "#64748b", maxScore: 62 },
  { name: "Mars", icon: "♂", color: "#ef4444", maxScore: 55 },
  { name: "Mercury", icon: "☿", color: "#22c55e", maxScore: 60 },
  { name: "Jupiter", icon: "♃", color: "#eab308", maxScore: 65 },
  { name: "Venus", icon: "♀", color: "#ec4899", maxScore: 58 },
  { name: "Saturn", icon: "♄", color: "#6b7280", maxScore: 52 },
];

const STRENGTHS = [
  { id: "kshetra", name: "Kshetra Bala", max: 30, desc: "Sign / Positional Strength" },
  { id: "uchcha", name: "Uchcha Bala", max: 20, desc: "Exaltation Strength" },
  { id: "hadda", name: "Hadda Bala", max: 15, desc: "Persian Degree Strength" },
  { id: "drekkana", name: "Drekkana Bala", max: 10, desc: "Decanate Strength" },
  { id: "navamsha", name: "Navamsha Bala", max: 5, desc: "D-9 Micro-Strength" },
];

const TOTAL_MAX = 80; // 30+20+15+10+5

// Pre-computed demo scores (realistic)
const DEMO_SCORES: Record<string, number[]> = {
  Sun: [22.5, 15, 10, 6, 3],
  Moon: [30, 18, 12, 8, 4],
  Mars: [15, 8, 6, 4, 2],
  Mercury: [20, 12, 9, 5, 3],
  Jupiter: [30, 20, 15, 10, 5],
  Venus: [18, 10, 8, 5, 3],
  Saturn: [12, 5, 4, 3, 1.5],
};

// ─── Component ────────────────────────────────────────────────
export default function PanchaVargiyaExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState(PLANETS[4]); // Jupiter default

  const scores = DEMO_SCORES[selectedPlanet.name];
  const rawTotal = scores.reduce((a, b) => a + b, 0);
  const viswas = (rawTotal / 4).toFixed(1);
  const percentage = Math.round((rawTotal / TOTAL_MAX) * 100);

  // Calculate all planet totals for ranking
  const rankings = useMemo(() => {
    return PLANETS.map((p) => {
      const s = DEMO_SCORES[p.name];
      const total = s.reduce((a, b) => a + b, 0);
      const v = (total / 4).toFixed(1);
      return { ...p, total, viswas: v };
    }).sort((a, b) => b.total - a.total);
  }, []);

  const isTop = rankings[0].name === selectedPlanet.name;
  const rank = rankings.findIndex((r) => r.name === selectedPlanet.name) + 1;

  return (
    <div className="bg-white border border-orange-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center">
            <Crown className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-orange-900">Pancha Vargiya Bala Scorer</h3>
            <p className="text-sm text-orange-600">5-Fold Strength Algorithm — Crown the Varsheshvara</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Planet Selector */}
        <div className="mb-5">
          <label className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-2 block">Select Planet</label>
          <div className="flex flex-wrap gap-2">
            {PLANETS.map((p) => {
              const active = selectedPlanet.name === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => setSelectedPlanet(p)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border transition-all ${
                    active
                      ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                      : "bg-white text-slate-800 border-slate-200 hover:border-orange-300"
                  }`}
                >
                  <span className="text-base">{p.icon}</span> {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Total Score Card */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-300 p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-600" />
              <span className="text-lg font-extrabold text-orange-900">{selectedPlanet.name}</span>
            </div>
            <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${isTop ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
              Rank #{rank} of {PLANETS.length}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-orange-700">Raw Total</div>
              <div className="text-2xl font-extrabold text-orange-800">{rawTotal.toFixed(1)} <span className="text-sm font-medium text-orange-600">/ {TOTAL_MAX}</span></div>
            </div>
            <div className="text-right">
              <div className="text-xs text-orange-700">In Viswas</div>
              <div className="text-2xl font-extrabold text-orange-800">{viswas} <span className="text-sm font-medium text-orange-600">/ 20</span></div>
            </div>
          </div>
          <div className="w-full h-2.5 bg-orange-200 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="h-full bg-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* 5 Strength Bars */}
        <div className="space-y-3 mb-5">
          {STRENGTHS.map((s, i) => {
            const score = scores[i];
            const pct = (score / s.max) * 100;
            return (
              <div key={s.id} className="bg-slate-50 rounded-lg border border-slate-100 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{s.name}</span>
                    <span className="text-xs text-slate-700">({s.desc})</span>
                  </div>
                  <span className="text-xs font-bold text-orange-700">{score} / {s.max}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-orange-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Varsheshvara Validation Gate */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-bold text-slate-800">Varsheshvara Validation Gate</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${isTop ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"}`}>
              {isTop ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-slate-400 shrink-0" />}
              <span className={`text-xs font-bold ${isTop ? "text-emerald-800" : "text-slate-700"}`}>Highest Pancha Vargiya Score</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${isTop ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"}`}>
              {isTop ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-slate-400 shrink-0" />}
              <span className={`text-xs font-bold ${isTop ? "text-emerald-800" : "text-slate-700"}`}>Aspects Annual Ascendant</span>
            </div>
          </div>
          {isTop && (
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100/50 px-3 py-2 rounded-lg border border-emerald-200">
              <Crown className="w-3.5 h-3.5" />
              {selectedPlanet.name} is crowned <strong>Varsheshvara</strong> — Lord of the Year
            </div>
          )}
        </div>

        {/* Rankings Table */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-bold text-slate-800">Planetary Power Ranking</span>
          </div>
          <div className="space-y-1.5">
            {rankings.map((r, i) => (
              <div
                key={r.name}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-xs ${
                  r.name === selectedPlanet.name
                    ? "bg-orange-50 border-orange-200"
                    : "bg-white border-slate-100"
                }`}
              >
                <span className="w-5 text-center font-bold text-slate-700">{i + 1}</span>
                <span className="text-base">{r.icon}</span>
                <span className={`font-bold ${r.name === selectedPlanet.name ? "text-orange-800" : "text-slate-800"}`}>{r.name}</span>
                <span className="ml-auto font-bold text-slate-700">{r.viswas} Viswas</span>
              </div>
            ))}
          </div>
        </div>

        {/* Astrologer Note */}
        <div className="mt-4 bg-orange-50 rounded-lg border border-orange-200 p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-orange-800">Astrologer Note</div>
              <p className="text-sm text-orange-700 mt-0.5">
                The Varsheshvara is the <strong>CEO of the year</strong>. If Mars wins, expect conflict and real estate activity. If Venus wins, expect romance and luxury. If Saturn wins, expect discipline and delay. The planet&apos;s nature becomes the annual theme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
