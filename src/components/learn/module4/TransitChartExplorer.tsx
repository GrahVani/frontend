"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Orbit, Moon, Zap, Gauge, Eye, AlertTriangle,
  ChevronDown, ChevronUp, Info, Star, ArrowRight
} from "lucide-react";

interface TransitPlanet {
  planet: string;
  sanskrit: string;
  color: string;
  lightColor: string;
  periodDays: number;
  periodLabel: string;
  speed: "fast" | "slow";
  description: string;
  icon: string;
}

const TRANSIT_PLANETS: TransitPlanet[] = [
  { planet: "Saturn", sanskrit: "शनि", color: "#475569", lightColor: "#e2e8f0", periodDays: 912, periodLabel: "2.5 years", speed: "slow", description: "The slowest teacher. Brings discipline, restructuring, and karmic lessons.", icon: "♄" },
  { planet: "Jupiter", sanskrit: "गुरु", color: "#f97316", lightColor: "#ffedd5", periodDays: 365, periodLabel: "1 year", speed: "slow", description: "The great expander. Blesses with wisdom, growth, fortune, and protection.", icon: "♃" },
  { planet: "Rahu", sanskrit: "राहु", color: "#7c3aed", lightColor: "#ede9fe", periodDays: 547, periodLabel: "1.5 years", speed: "slow", description: "Shadow of obsession. Creates sudden events, foreign influences, cravings.", icon: "☊" },
  { planet: "Ketu", sanskrit: "केतु", color: "#0891b2", lightColor: "#cffafe", periodDays: 547, periodLabel: "1.5 years", speed: "slow", description: "Shadow of detachment. Brings spiritual insight, endings, liberation.", icon: "☋" },
  { planet: "Mars", sanskrit: "मङ्गल", color: "#ef4444", lightColor: "#fee2e2", periodDays: 45, periodLabel: "45 days", speed: "fast", description: "The energizer. Activates conflict, action, courage, property matters.", icon: "♂" },
  { planet: "Sun", sanskrit: "सूर्य", color: "#f59e0b", lightColor: "#fef3c7", periodDays: 30, periodLabel: "1 month", speed: "fast", description: "The illuminator. Highlights authority, health, and ego issues.", icon: "☉" },
  { planet: "Venus", sanskrit: "शुक्र", color: "#ec4899", lightColor: "#fce7f3", periodDays: 30, periodLabel: "1 month", speed: "fast", description: "The harmonizer. Brings relationships, beauty, and pleasure.", icon: "♀" },
  { planet: "Mercury", sanskrit: "बुध", color: "#10b981", lightColor: "#d1fae5", periodDays: 30, periodLabel: "1 month", speed: "fast", description: "The messenger. Affects communication, business, and intellect.", icon: "☿" },
  { planet: "Moon", sanskrit: "चन्द्र", color: "#94a3b8", lightColor: "#f1f5f9", periodDays: 2, periodLabel: "2.25 days", speed: "fast", description: "The fastest mover. Governs daily emotions and short-term fluctuations.", icon: "☽" },
];

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_COLORS = [
  "#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7",
  "#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7",
];

export default function TransitChartExplorer() {
  const [moonSign, setMoonSign] = useState(3); // Cancer
  const [saturnTransit, setSaturnTransit] = useState(1); // Aries
  const [velocityFilter, setVelocityFilter] = useState<"all" | "slow">("all");
  const [showSadeSati, setShowSadeSati] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<TransitPlanet | null>(null);

  // Sade Sati: Saturn transiting 12th, 1st, 2nd from natal Moon
  const sadeSatiHouses = [
    ((moonSign - 1 + 12) % 12) + 1, // 12th from Moon
    moonSign + 1, // 1st from Moon (Moon itself)
    ((moonSign + 1) % 12) + 1, // 2nd from Moon
  ];

  const isSadeSatiActive = sadeSatiHouses.includes(saturnTransit);
  const sadeSatiPhase = isSadeSatiActive
    ? saturnTransit === sadeSatiHouses[0] ? 1
    : saturnTransit === sadeSatiHouses[1] ? 2
    : 3
    : 0;

  const filteredPlanets = velocityFilter === "slow"
    ? TRANSIT_PLANETS.filter(p => p.speed === "slow")
    : TRANSIT_PLANETS;

  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.25 } };

  return (
    <div className="w-full select-none">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-cyan-700">
            Gochara Transit Explorer
          </h2>
          <p className="text-base text-sky-700 mt-2 font-semibold">
            Real-time planetary movement overlaid on the natal chart.
          </p>
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {/* Chandra Lagna selector */}
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-sky-200 shadow-sm">
            <Moon className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Natal Moon</span>
            <select
              value={moonSign}
              onChange={(e) => setMoonSign(Number(e.target.value))}
              className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
            >
              {SIGNS.map((s, i) => (
                <option key={i} value={i} className="bg-white">{s}</option>
              ))}
            </select>
          </div>

          {/* Saturn transit selector */}
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Saturn Transit</span>
            <select
              value={saturnTransit}
              onChange={(e) => setSaturnTransit(Number(e.target.value))}
              className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
            >
              {SIGNS.map((s, i) => (
                <option key={i} value={i + 1} className="bg-white">{s}</option>
              ))}
            </select>
          </div>

          {/* Velocity filter */}
          <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setVelocityFilter("all")}
              className={`px-3 py-2 text-sm font-bold transition-colors ${velocityFilter === "all" ? "bg-sky-700 text-white" : "text-gray-700 hover:bg-gray-50"}`}
            >
              All Planets
            </button>
            <button
              onClick={() => setVelocityFilter("slow")}
              className={`px-3 py-2 text-sm font-bold transition-colors flex items-center gap-1 ${velocityFilter === "slow" ? "bg-sky-700 text-white" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <Gauge className="w-3 h-3" /> Slow Only
            </button>
          </div>
        </div>

        {/* Chandra Lagna visualization */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-sky-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-bold text-sky-800 uppercase tracking-wider">Chandra Lagna View</span>
            <span className="text-xs text-gray-600 ml-auto font-semibold">Natal Moon = House 1</span>
          </div>

          <div className="relative w-full max-w-[480px] mx-auto aspect-square">
            <svg viewBox="0 0 360 360" className="w-full h-full">
              <defs>
                <filter id="ttGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Houses */}
              {Array.from({ length: 12 }, (_, i) => {
                const houseNum = i + 1;
                const a1 = ((i) * 30 - 75) * (Math.PI / 180);
                const a2 = ((i + 1) * 30 - 75) * (Math.PI / 180);
                const mid = ((i) * 30 - 90) * (Math.PI / 180);
                const r = 140;
                const cx = 180, cy = 180;

                const x1 = cx + r * Math.cos(a1);
                const y1 = cy + r * Math.sin(a1);
                const x2 = cx + r * Math.cos(a2);
                const y2 = cy + r * Math.sin(a2);
                const mx = cx + (r * 0.72) * Math.cos(mid);
                const my = cy + (r * 0.72) * Math.sin(mid);

                // Chandra Lagna: Moon sign = 1st house
                const chandraHouse = ((i - moonSign + 12) % 12) + 1;
                const isMoonHouse = chandraHouse === 1;
                const isSadeSati = showSadeSati && [12, 1, 2].includes(chandraHouse) && saturnTransit === houseNum;

                return (
                  <g key={houseNum}>
                    <path
                      d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                      fill={isSadeSati ? "#ef444415" : isMoonHouse ? "#3b82f610" : "#f8fafc"}
                      stroke={isSadeSati ? "#ef4444" : isMoonHouse ? "#3b82f6" : "#e2e8f0"}
                      strokeWidth={isSadeSati ? 2 : isMoonHouse ? 1.5 : 0.8}
                    />
                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="central"
                      fontSize={isMoonHouse ? 13 : 11} fontWeight={isMoonHouse ? 800 : 600}
                      fill={isMoonHouse ? "#3b82f6" : isSadeSati ? "#ef4444" : "#94a3b8"}
                    >
                      H{chandraHouse}
                    </text>
                    {/* Sign label */}
                    <text x={mx} y={my + 16} textAnchor="middle" fontSize={10} fill="#64748b">
                      {SIGNS[i]?.slice(0, 3)}
                    </text>
                  </g>
                );
              })}

              {/* Moon at center of H1 */}
              {(() => {
                const moonAngle = ((moonSign) * 30 - 90) * (Math.PI / 180);
                const mx = 180 + 100 * Math.cos(moonAngle);
                const my = 180 + 100 * Math.sin(moonAngle);
                return (
                  <g>
                    <circle cx={mx} cy={my} r={18} fill="#fff" stroke="#94a3b8" strokeWidth="2" filter="url(#ttGlow)" />
                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="central" fontSize={14} fill="#94a3b8">☽</text>
                    <text x={mx} y={my + 28} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">Moon</text>
                  </g>
                );
              })()}

              {/* Saturn position */}
              {(() => {
                const saturnAngle = ((saturnTransit - 1) * 30 - 90) * (Math.PI / 180);
                const sx = 180 + 115 * Math.cos(saturnAngle);
                const sy = 180 + 115 * Math.sin(saturnAngle);
                return (
                  <g>
                    <circle cx={sx} cy={sy} r={18} fill="#fff" stroke="#475569" strokeWidth="2.5" filter="url(#ttGlow)" />
                    <text x={sx} y={sy} textAnchor="middle" dominantBaseline="central" fontSize={14} fill="#475569">♄</text>
                    <text x={sx} y={sy + 28} textAnchor="middle" fontSize={10} fontWeight={700} fill="#1e293b">Saturn</text>
                  </g>
                );
              })()}

              {/* Center */}
              <circle cx={180} cy={180} r={28} fill="#fff" stroke="#0ea5e9" strokeWidth="2" />
              <text x={180} y={176} textAnchor="middle" fontSize={11} fontWeight={800} fill="#0369a1">Chandra</text>
              <text x={180} y={190} textAnchor="middle" fontSize={10} fill="#0284c7">Lagna</text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <Moon className="w-3 h-3" /> Moon = H1
            </span>
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-slate-600" /> Saturn Transit
            </span>
            {isSadeSatiActive && (
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 animate-pulse">
                <AlertTriangle className="w-3 h-3" /> Sade Sati Phase {sadeSatiPhase}
              </span>
            )}
          </div>
        </div>

        {/* Sade Sati panel */}
        <AnimatePresence>
          {showSadeSati && (
            <motion.div {...fadeUp} className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-bold text-red-800 uppercase tracking-wider">Sade Sati Tracker</span>
                </div>
                <button onClick={() => setShowSadeSati(false)} className="text-gray-400 hover:text-gray-600">
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map(phase => {
                  const isActive = sadeSatiPhase === phase;
                  const houseDesc = phase === 1 ? "12th from Moon" : phase === 2 ? "1st from Moon (Moon itself)" : "2nd from Moon";
                  return (
                    <div
                      key={phase}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isActive
                          ? "bg-red-50 border-red-200 shadow-sm"
                          : "bg-gray-50 border-gray-100"
                      }`}
                    >
                      <div className={`text-sm font-extrabold mb-1 ${isActive ? "text-red-600" : "text-gray-400"}`}>
                        Phase {phase}
                      </div>
                      <div className={`text-xs font-semibold ${isActive ? "text-red-700" : "text-gray-500"}`}>
                        {houseDesc}
                      </div>
                      <div className={`text-xs mt-1 ${isActive ? "text-red-600" : "text-gray-500"}`}>
                        {phase === 1 ? "Loss & Separation" : phase === 2 ? "Peak Challenge" : "Recovery & Rebuild"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 p-3 rounded-xl bg-red-50/50 border border-red-100">
                <p className="text-sm text-red-900 leading-relaxed">
                  <strong>Sade Sati</strong> is the 7.5-year period when Saturn transits the 12th, 1st, and 2nd houses 
                  from the natal Moon. It forces intense psychological maturity, restructuring, and often hardship. 
                  Currently {isSadeSatiActive ? <strong className="text-red-600">ACTIVE</strong> : "not active"} for this Moon sign.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Velocity filter explanation */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-bold text-sky-800 uppercase tracking-wider">Velocity Filter</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-3 h-3 text-amber-500" />
                <span className="text-xs font-bold text-gray-700 uppercase">Fast = Noise</span>
              </div>
              <p className="text-sm text-gray-700">Moon (2.5 days), Mercury/Venus/Sun (~30 days). Daily moods, minor events.</p>
            </div>
            <div className="text-gray-300">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="flex-1 p-3 rounded-xl bg-sky-50 border border-sky-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Star className="w-3 h-3 text-sky-600" />
                <span className="text-xs font-bold text-sky-800 uppercase">Slow = Triggers</span>
              </div>
              <p className="text-sm text-sky-800">Jupiter (1yr), Rahu/Ketu (1.5yrs), Saturn (2.5yrs). Major life events.</p>
            </div>
          </div>
        </div>

        {/* Planet cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {filteredPlanets.map((p) => (
            <button
              key={p.planet}
              onClick={() => setSelectedPlanet(selectedPlanet?.planet === p.planet ? null : p)}
              className={`relative rounded-xl p-3 text-left transition-all duration-300 border-2 ${
                selectedPlanet?.planet === p.planet
                  ? "scale-[1.03] shadow-lg -translate-y-0.5"
                  : "hover:scale-[1.01] hover:shadow-md"
              }`}
              style={{
                background: selectedPlanet?.planet === p.planet ? p.lightColor : "#fff",
                borderColor: selectedPlanet?.planet === p.planet ? p.color : "#f1f5f9",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: p.color }} />
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ background: p.color }}>
                  {p.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{p.planet}</div>
                  <div className="text-xs text-gray-600 font-semibold">{p.sanskrit}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${p.speed === "slow" ? "bg-sky-100 text-sky-800" : "bg-amber-50 text-amber-700"}`}>
                  {p.speed}
                </span>
                <span className="text-xs text-gray-600 font-medium">{p.periodLabel}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected planet detail */}
        <AnimatePresence>
          {selectedPlanet && (
            <motion.div {...fadeUp} className="mt-4 p-4 rounded-2xl border shadow-sm" style={{ background: selectedPlanet.lightColor, borderColor: `${selectedPlanet.color}30` }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0" style={{ background: selectedPlanet.color }}>
                  {selectedPlanet.icon}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">{selectedPlanet.planet} Transit</h3>
                  <p className="text-sm text-gray-700 font-semibold">{selectedPlanet.sanskrit} · {selectedPlanet.periodLabel} per sign</p>
                  <p className="text-sm text-gray-800 leading-relaxed mt-1">{selectedPlanet.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedPlanet.speed === "slow" ? "bg-sky-100 text-sky-800" : "bg-amber-50 text-amber-700"}`}>
                      {selectedPlanet.speed === "slow" ? "🎯 Major Event Trigger" : "🌊 Background Noise"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Senior astrologer note */}
        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-sky-50 border border-sky-200">
          <Info className="w-5 h-5 text-sky-700 mt-0.5 shrink-0" />
          <p className="text-sm text-sky-900 leading-relaxed">
            <strong>Professional Note:</strong> When reading Gochara, always anchor to Chandra Lagna (natal Moon). 
            A transit hitting the Ascendant is secondary. Saturn transiting over the Moon sign is the peak of Sade Sati 
            (Phase 2) — the most psychologically intense period. Jupiter's transit to the Moon sign brings emotional healing 
            and mental clarity, even if other areas are stressed.
          </p>
        </div>
      </div>
    </div>
  );
}
