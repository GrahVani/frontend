"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe, Info, Star, Zap, ToggleLeft, ToggleRight,
  ChevronRight, CheckCircle2, AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────
type OuterPlanet = "Uranus" | "Neptune" | "Pluto";

interface PlanetData {
  name: string;
  vedicDeg: number;
  westernDeg?: number;
  icon: string;
  isOuter?: boolean;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────
const NATAL_PLANETS: PlanetData[] = [
  { name: "Sun", vedicDeg: 45.5, icon: "☉", color: "#f59e0b" },
  { name: "Moon", vedicDeg: 12.3, icon: "☽", color: "#cbd5e1" },
  { name: "Mars", vedicDeg: 98.7, icon: "♂", color: "#ef4444" },
  { name: "Mercury", vedicDeg: 38.2, icon: "☿", color: "#22c55e" },
  { name: "Jupiter", vedicDeg: 165.4, icon: "♃", color: "#f97316" },
  { name: "Venus", vedicDeg: 72.1, icon: "♀", color: "#ec4899" },
  { name: "Saturn", vedicDeg: 312.8, icon: "♄", color: "#475569" },
];

const OUTER_PLANETS: PlanetData[] = [
  { name: "Uranus", vedicDeg: 48.2, westernDeg: 48.2, icon: "⛢", color: "#06b6d4", isOuter: true },
  { name: "Neptune", vedicDeg: 355.1, westernDeg: 355.1, icon: "♆", color: "#3b82f6", isOuter: true },
  { name: "Pluto", vedicDeg: 298.4, westernDeg: 298.4, icon: "♇", color: "#7f1d1d", isOuter: true },
];

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_COLORS = [
  "#ef4444", "#f59e0b", "#22c55e", "#64748b",
  "#f97316", "#10b981", "#ec4899", "#7f1d1d",
  "#a855f7", "#475569", "#3b82f6", "#0ea5e9",
];

const OUTER_PLANET_INFO: Record<OuterPlanet, { orbit: string; meaning: string; trigger: string }> = {
  Uranus: { orbit: "84 years", meaning: "Sudden disruption, technological breakthrough, rebellion", trigger: "Natal Sun or 10th House hit → career revolution" },
  Neptune: { orbit: "165 years", meaning: "Dissolution, mysticism, deception, artistic inspiration", trigger: "Natal Moon hit → multi-year psychological fog" },
  Pluto: { orbit: "248 years", meaning: "Death of old self, deep transformation, hidden power", trigger: "Ascendant crossing → complete rebirth" },
};

// ─── Helpers ──────────────────────────────────────────────────
function getSign(deg: number): string {
  return SIGNS[Math.floor(deg / 30)];
}

function getSignColor(deg: number): string {
  return SIGN_COLORS[Math.floor(deg / 30)];
}

function progressedDeg(natalDeg: number, age: number): number {
  // Secondary progression: 1 day = 1 year
  // Approximate: Sun moves ~1°/day, Moon ~13°/day
  // Simplified: add ~1° per year for Sun-like, ~13° for Moon-like
  const degPerYear = 0.98; // approximate mean solar motion
  let prog = natalDeg + age * degPerYear;
  while (prog >= 360) prog -= 360;
  return prog;
}

// ─── Component ────────────────────────────────────────────────
export default function HybridBiWheelExplorer() {
  const [westernOverlay, setWesternOverlay] = useState(true);
  const [showProgressions, setShowProgressions] = useState(false);
  const [age, setAge] = useState(30);
  const [selectedOuter, setSelectedOuter] = useState<OuterPlanet>("Uranus");

  const allPlanets = useMemo(() => {
    const base = [...NATAL_PLANETS];
    if (westernOverlay) {
      return [...base, ...OUTER_PLANETS];
    }
    return base;
  }, [westernOverlay]);

  const progressedPlanets = useMemo(() => {
    return NATAL_PLANETS.map((p) => ({
      ...p,
      progDeg: progressedDeg(p.vedicDeg, age),
    }));
  }, [age]);

  // Check for "hybrid consensus" — when progressed and natal align
  const consensusAlerts = useMemo(() => {
    const alerts: { planet: string; natalSign: string; progSign: string; type: string }[] = [];
    progressedPlanets.forEach((p) => {
      const natalSign = getSign(p.vedicDeg);
      const progSign = getSign(p.progDeg);
      if (natalSign === progSign && p.name === "Sun") {
        alerts.push({ planet: p.name, natalSign, progSign, type: "Solar Return Congruence" });
      }
    });
    // Simulate a Jupiter-10th House consensus
    if (age >= 28 && age <= 32) {
      alerts.push({ planet: "Jupiter", natalSign: "Virgo", progSign: "Libra", type: "Career Elevation Window" });
    }
    return alerts;
  }, [progressedPlanets, age]);

  const outerInfo = OUTER_PLANET_INFO[selectedOuter];

  // Bi-wheel SVG params — enlarged for readability
  const cx = 210;
  const cy = 210;
  const rInner = 135;
  const rOuter = 190;

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/60 px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-gray-900">Vedic-Western Hybrid Bi-Wheel</h3>
        </div>
        <p className="text-sm text-slate-700">
          Overlay outer planets and secondary progressions onto the Sidereal natal chart.
        </p>
      </div>

      <div className="p-5 space-y-5">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setWesternOverlay((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              westernOverlay
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
            }`}
          >
            {westernOverlay ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            Western Overlay {westernOverlay ? "ON" : "OFF"}
          </button>

          <button
            onClick={() => setShowProgressions((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              showProgressions
                ? "bg-violet-600 text-white border-violet-600 shadow-md"
                : "bg-white text-slate-700 border-slate-200 hover:border-violet-300"
            }`}
          >
            {showProgressions ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            Progressions {showProgressions ? "ON" : "OFF"}
          </button>

          {showProgressions && (
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700">Age:</label>
              <input
                type="range"
                min={1}
                max={90}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-32 accent-violet-600 h-2 bg-violet-100 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-bold text-violet-700 w-8">{age}</span>
            </div>
          )}
        </div>

        {/* Main: Bi-Wheel + Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Bi-Wheel */}
          <div className="lg:col-span-3 bg-slate-50 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800">
                {showProgressions ? `Natal + Progressed (Age ${age})` : "Natal Chart"}
              </h4>
              <div className="flex items-center gap-3 text-xs text-slate-800 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-700" />
                  Natal
                </span>
                {showProgressions && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-violet-500" />
                    Progressed
                  </span>
                )}
                {westernOverlay && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border-2 border-dashed border-cyan-500" />
                    Outer
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <svg width="100%" height="420" viewBox="0 0 420 420">
                {/* Sign segments on outer ring */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const startAngle = (i * 30 - 90) * (Math.PI / 180);
                  const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);
                  const r1 = rOuter + 18;
                  const r2 = rOuter - 22;
                  const x1 = cx + r1 * Math.cos(startAngle);
                  const y1 = cy + r1 * Math.sin(startAngle);
                  const x2 = cx + r1 * Math.cos(endAngle);
                  const y2 = cy + r1 * Math.sin(endAngle);
                  const x3 = cx + r2 * Math.cos(endAngle);
                  const y3 = cy + r2 * Math.sin(endAngle);
                  const x4 = cx + r2 * Math.cos(startAngle);
                  const y4 = cy + r2 * Math.sin(startAngle);
                  const midAngle = ((i + 0.5) * 30 - 90) * (Math.PI / 180);
                  const tx = cx + (rOuter - 4) * Math.cos(midAngle);
                  const ty = cy + (rOuter - 4) * Math.sin(midAngle);
                  return (
                    <g key={i}>
                      <path
                        d={`M ${x1} ${y1} A ${r1} ${r1} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x4} ${y4} Z`}
                        fill={SIGN_COLORS[i] + "18"}
                        stroke={SIGN_COLORS[i]}
                        strokeWidth="1"
                      />
                      <text
                        x={tx}
                        y={ty}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#000000"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {SIGNS[i].slice(0, 3)}
                      </text>
                    </g>
                  );
                })}

                {/* Wheel circles */}
                <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="#000000" strokeWidth="1.5" />
                <circle cx={cx} cy={cy} r={rInner} fill="none" stroke="#000000" strokeWidth="2" />
                <circle cx={cx} cy={cy} r={rInner - 35} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />

                {/* House cusp lines */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180);
                  const x = cx + (rOuter + 18) * Math.cos(angle);
                  const y = cy + (rOuter + 18) * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={cx}
                      y1={cy}
                      x2={x}
                      y2={y}
                      stroke="#000000"
                      strokeWidth={i % 3 === 0 ? "1.2" : "0.7"}
                      opacity={0.35}
                    />
                  );
                })}

                {/* Natal planets (inner wheel) */}
                {NATAL_PLANETS.map((p, idx) => {
                  const angle = (p.vedicDeg - 90) * (Math.PI / 180);
                  const r = rInner - 22 - idx * 9;
                  const px = cx + r * Math.cos(angle);
                  const py = cy + r * Math.sin(angle);
                  return (
                    <g key={`natal-${p.name}`}>
                      <circle cx={px} cy={py} r={7} fill={p.color} stroke="#ffffff" strokeWidth="2" />
                      <text x={px} y={py + 1} textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                        {p.icon}
                      </text>
                    </g>
                  );
                })}

                {/* Progressed planets (outer ring) */}
                {showProgressions && progressedPlanets.map((p, idx) => {
                  const angle = (p.progDeg - 90) * (Math.PI / 180);
                  const r = rOuter - 12 - idx * 6;
                  const px = cx + r * Math.cos(angle);
                  const py = cy + r * Math.sin(angle);
                  return (
                    <g key={`prog-${p.name}`}>
                      <circle cx={px} cy={py} r={6} fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
                      <text x={px} y={py + 1} textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="7" fontWeight="bold">
                        {p.icon}
                      </text>
                    </g>
                  );
                })}

                {/* Outer planets (dashed outer ring) */}
                {westernOverlay && OUTER_PLANETS.map((p) => {
                  const angle = (p.vedicDeg - 90) * (Math.PI / 180);
                  const r = rOuter + 14;
                  const px = cx + r * Math.cos(angle);
                  const py = cy + r * Math.sin(angle);
                  // Offset label to avoid overlap
                  const labelR = rOuter + 32;
                  const lx = cx + labelR * Math.cos(angle);
                  const ly = cy + labelR * Math.sin(angle);
                  return (
                    <g key={`outer-${p.name}`}>
                      <circle cx={px} cy={py} r={8} fill={p.color} stroke="#ffffff" strokeWidth="2.5" />
                      <text x={px} y={py + 1} textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                        {p.icon}
                      </text>
                      <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#000000" fontSize="10" fontWeight="bold">
                        {p.name}
                      </text>
                    </g>
                  );
                })}

                {/* Center */}
                <circle cx={cx} cy={cy} r={4} fill="#000000" />
                <text x={cx} y={cy + 16} textAnchor="middle" fill="#000000" fontSize="10" fontWeight="bold">Natal</text>
              </svg>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Outer Planet Info */}
            {westernOverlay && (
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-4">
                <h4 className="text-xs font-bold text-cyan-800 uppercase mb-2 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" /> Outer Planets
                </h4>
                <div className="flex gap-1.5 mb-3">
                  {(Object.keys(OUTER_PLANET_INFO) as OuterPlanet[]).map((op) => (
                    <button
                      key={op}
                      onClick={() => setSelectedOuter(op)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                        selectedOuter === op
                          ? "bg-cyan-600 text-white border-cyan-600"
                          : "bg-white text-slate-700 border-slate-200 hover:border-cyan-300"
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-700">Orbit</span>
                    <span className="text-xs font-bold text-slate-800">{outerInfo.orbit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-700">Meaning</span>
                    <span className="text-xs font-bold text-slate-800 text-right max-w-[140px]">{outerInfo.meaning}</span>
                  </div>
                  <div className="pt-1.5 border-t border-cyan-200/50">
                    <span className="text-xs text-cyan-800 font-semibold">Trigger:</span>
                    <p className="text-xs text-slate-800 mt-0.5">{outerInfo.trigger}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Progressions */}
            {showProgressions && (
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200 p-4">
                <h4 className="text-xs font-bold text-violet-800 uppercase mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Secondary Progressions
                </h4>
                <p className="text-xs text-slate-800 mb-2">
                  <strong>1 Day = 1 Year</strong>. The sky {age} days after birth symbolizes age {age}.
                </p>
                <div className="space-y-1 max-h-[140px] overflow-y-auto">
                  {progressedPlanets.slice(0, 4).map((p) => (
                    <div key={p.name} className="flex items-center justify-between px-2 py-1 bg-white rounded-md border border-violet-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">{p.icon}</span>
                        <span className="text-xs font-bold text-slate-800">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-700">{getSign(p.vedicDeg).slice(0, 3)}</span>
                        <ChevronRight className="w-3 h-3 text-violet-400" />
                        <span className="text-xs font-bold" style={{ color: getSignColor(p.progDeg) }}>
                          {getSign(p.progDeg).slice(0, 3)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hybrid Consensus Alerts */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Synthesis Engine</h4>
              {consensusAlerts.length > 0 ? (
                <div className="space-y-2">
                  {consensusAlerts.map((alert, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 p-2 bg-green-50 rounded-lg border border-green-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-green-900">{alert.type}</p>
                        <p className="text-xs text-slate-800">
                          {alert.planet}: Natal {alert.natalSign} ↔ Progressed {alert.progSign}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div className="flex items-center gap-1.5 mt-2 p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                    <Star className="w-3.5 h-3.5 text-indigo-600" />
                    <p className="text-xs font-bold text-indigo-900">
                      Hybrid Consensus: Both engines agree
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <AlertCircle className="w-4 h-4 text-slate-600" />
                  <p className="text-xs text-slate-700">No major consensus at age {age}. Try ages 28–32.</p>
                </div>
              )}
            </div>

            {/* Planet Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-800 uppercase">Planetary Positions</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-[180px] overflow-y-auto">
                {allPlanets.map((p) => (
                  <div key={p.name} className="px-3 py-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{p.icon}</span>
                      <span className={`text-xs font-semibold ${p.isOuter ? "text-cyan-800" : "text-slate-800"}`}>
                        {p.name}
                      </span>
                      {p.isOuter && (
                        <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-800 text-[10px] font-bold rounded">OUTER</span>
                      )}
                    </div>
                    <span className="text-xs font-bold" style={{ color: getSignColor(p.vedicDeg) }}>
                      {getSign(p.vedicDeg)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Senior Astrologer Note */}
        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-indigo-800 mb-1">Senior Astrologer Note</p>
              <p className="text-xs text-slate-700 leading-relaxed">
                The Hybrid Approach is a premium feature. Traditional Vedic astrologers may reject outer planets outright. 
                Your software must respect both camps. Default to pure Vedic mode. The Western overlay is an opt-in toggle 
                that requires explicit user consent — and the UI must never present hybrid consensus as absolute truth. 
                When engines disagree, transparency wins over false certainty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
