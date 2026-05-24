"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Calendar, ArrowRight, Star, Zap, AlertTriangle,
  CheckCircle2, Info, TrendingUp
} from "lucide-react";

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const MONTH_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
const LORD_COLORS: Record<string, string> = {
  Sun: "#f59e0b", Moon: "#94a3b8", Mars: "#ef4444", Mercury: "#22c55e",
  Jupiter: "#f97316", Venus: "#a855f7", Saturn: "#475569",
};

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_COLORS = ["#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7", "#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7"];

// Tajik aspects
const TAJIK_ASPECTS = [
  { name: "Trine", houses: [5, 9], type: "friendly", color: "#22c55e" },
  { name: "Sextile", houses: [3, 11], type: "friendly", color: "#3b82f6" },
  { name: "Square", houses: [4, 10], type: "hostile", color: "#ef4444" },
  { name: "Opposition", houses: [7], type: "hostile", color: "#f59e0b" },
];

export default function TajikAnnualChartExplorer() {
  const [natalAscendant, setNatalAscendant] = useState(0); // Aries
  const [currentAge, setCurrentAge] = useState(35);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedAspect, setSelectedAspect] = useState(0);

  // Muntha = (Natal Ascendant + Age) % 12
  const munthaSign = ((natalAscendant + currentAge) % 12);
  const munthaHouse = munthaSign + 1;

  // Muntha quality based on house
  const getMunthaQuality = (house: number) => {
    if ([1, 9, 10, 11].includes(house)) return { label: "Excellent", color: "#22c55e", bg: "#f0fdf4" };
    if ([2, 3, 4, 5, 7].includes(house)) return { label: "Good", color: "#3b82f6", bg: "#eff6ff" };
    if ([6, 8, 12].includes(house)) return { label: "Stress/Challenge", color: "#ef4444", bg: "#fef2f2" };
    return { label: "Neutral", color: "#94a3b8", bg: "#f8fafc" };
  };
  const munthaQ = getMunthaQuality(munthaHouse);

  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <div className="w-full select-none">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-amber-700">
            Tajik Varshaphala
          </h2>
          <p className="text-base text-orange-700 mt-2 font-semibold">
            Annual Solar Return — a sealed 365-day predictive environment.
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-white border border-orange-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Sun className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Natal Ascendant</span>
            </div>
            <select
              value={natalAscendant}
              onChange={(e) => setNatalAscendant(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm font-bold text-gray-700 outline-none focus:border-orange-400 cursor-pointer"
            >
              {SIGNS.map((s, i) => <option key={i} value={i}>{s}</option>)}
            </select>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-orange-100 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Current Age</span>
              <span className="text-sm font-extrabold text-orange-700">{currentAge} years</span>
            </div>
            <input
              type="range" min={1} max={100} value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
        </div>

        {/* Muntha calculation */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-orange-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-800 uppercase tracking-wider">Muntha (Progressed Ascendant)</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-center">
              <div className="text-xs font-bold text-orange-700 uppercase mb-1">Natal Asc</div>
              <div className="text-lg font-extrabold text-gray-800">{SIGNS[natalAscendant]}</div>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-orange-300" />
            </div>
            <div className="p-3 rounded-xl text-center border" style={{ background: munthaQ.bg, borderColor: `${munthaQ.color}30` }}>
              <div className="text-xs font-bold uppercase mb-1" style={{ color: munthaQ.color }}>{munthaQ.label}</div>
              <div className="text-lg font-extrabold text-gray-800">{SIGNS[munthaSign]}</div>
              <div className="text-xs text-gray-600">House {munthaHouse}</div>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-orange-50 border border-orange-100 text-center">
            <span className="text-sm text-orange-800">
              Formula: <strong>({natalAscendant + 1} + {currentAge}) mod 12 = {munthaHouse}</strong> — Muntha in House {munthaHouse} predicts a {munthaQ.label.toLowerCase()} year.
            </span>
          </div>
        </div>

        {/* Monthly Lords */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-800 uppercase tracking-wider">12 Monthly Lords</span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {MONTHS.map((m, i) => {
              const lord = MONTH_LORDS[i];
              const isSelected = selectedMonth === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedMonth(isSelected ? null : i)}
                  className={`p-2 rounded-xl text-center border transition-all ${isSelected ? "shadow-sm" : ""}`}
                  style={{
                    background: isSelected ? `${LORD_COLORS[lord]}12` : "#fff",
                    borderColor: isSelected ? LORD_COLORS[lord] : "#e2e8f0",
                  }}
                >
                  <div className="text-xs font-bold text-gray-600">{m}</div>
                  <div className="text-lg font-extrabold" style={{ color: LORD_COLORS[lord] }}>{lord.slice(0, 2)}</div>
                </button>
              );
            })}
          </div>
          {selectedMonth !== null && (
            <motion.div {...fadeUp} className="mt-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
              <p className="text-sm text-orange-800">
                <strong>{MONTHS[selectedMonth]}</strong> is ruled by <strong style={{ color: LORD_COLORS[MONTH_LORDS[selectedMonth]] }}>{MONTH_LORDS[selectedMonth]}</strong>. 
                Events this month are judged by this planet's strength and placement in the Varsha Kundali.
              </p>
            </motion.div>
          )}
        </div>

        {/* Tajik Aspects */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-800 uppercase tracking-wider">Tajik Aspects (Persian Geometry)</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {TAJIK_ASPECTS.map((asp, i) => (
              <button
                key={i}
                onClick={() => setSelectedAspect(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${selectedAspect === i ? "shadow-sm" : ""}`}
                style={{
                  background: selectedAspect === i ? `${asp.color}12` : "#fff",
                  borderColor: selectedAspect === i ? asp.color : "#e2e8f0",
                  color: selectedAspect === i ? asp.color : "#64748b",
                }}
              >
                {asp.name} ({asp.houses.join(", ")})
              </button>
            ))}
          </div>
          <div className="p-3 rounded-xl border" style={{ background: `${TAJIK_ASPECTS[selectedAspect].color}08`, borderColor: `${TAJIK_ASPECTS[selectedAspect].color}25` }}>
            <div className="flex items-center gap-2 mb-1">
              {TAJIK_ASPECTS[selectedAspect].type === "friendly" ? (
                <CheckCircle2 className="w-4 h-4" style={{ color: TAJIK_ASPECTS[selectedAspect].color }} />
              ) : (
                <AlertTriangle className="w-4 h-4" style={{ color: TAJIK_ASPECTS[selectedAspect].color }} />
              )}
              <span className="text-sm font-bold text-gray-800">{TAJIK_ASPECTS[selectedAspect].name}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-gray-300" style={{ color: TAJIK_ASPECTS[selectedAspect].color }}>
                {TAJIK_ASPECTS[selectedAspect].type === "friendly" ? "Friendly" : "Hostile"}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {TAJIK_ASPECTS[selectedAspect].name} aspects occur at houses 
              <strong> {TAJIK_ASPECTS[selectedAspect].houses.join(" & ")} </strong> 
              from any planet. In Tajik, standard Vedic Drishti is disabled — these geometric aspects 
              {TAJIK_ASPECTS[selectedAspect].type === "friendly" ? " bring support and opportunity." : " create friction and challenge."}
            </p>
          </div>
        </div>

        {/* Ithasala Yoga */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/40">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-800 uppercase tracking-wider">Ithasala Yoga</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            The most famous Tajik yoga. When a <strong>faster planet</strong> is behind a <strong>slower planet</strong> 
            but is catching up to it, an "applying" aspect forms. This promises the event 
            <strong> will soon happen</strong>. The tighter the orb, the sooner the manifestation.
          </p>
        </div>

        {/* Senior astrologer note */}
        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200">
          <Info className="w-5 h-5 text-orange-700 mt-0.5 shrink-0" />
          <p className="text-sm text-orange-900 leading-relaxed">
            <strong>Professional Note:</strong> The Varshaphala chart is cast the exact millisecond the Sun returns 
            to its natal longitude. Because a solar year is ~365.24 days, this moment shifts every year. 
            Never use midnight on the birthday — the software must query the ephemeris for the exact return timestamp.
          </p>
        </div>
      </div>
    </div>
  );
}
