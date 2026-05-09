"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, AlertTriangle, ChevronRight, Settings,
  Info, Star, ArrowRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────
type AyanamsaModel = "lahiri" | "raman" | "kp";

interface PlanetPosition {
  name: string;
  tropicalDeg: number;
  icon: string;
}

// ─── Data ─────────────────────────────────────────────────────
const MODELS: { id: AyanamsaModel; label: string; offset2025: number; desc: string; color: string }[] = [
  { id: "lahiri", label: "Lahiri (Chitra Paksha)", offset2025: 24.18, desc: "Official Indian standard. Anchors zodiac to Spica (Chitra) at 180°.", color: "#d97706" },
  { id: "raman", label: "Raman", offset2025: 22.67, desc: "B.V. Raman's model. Uses 397 CE vernal equinox epoch. ~1.5° smaller than Lahiri.", color: "#059669" },
  { id: "kp", label: "KP Ayanamsa", offset2025: 23.90, desc: "Krishnamurti Paddhati. Spica at 179°59'. Fine-tuned for cuspal precision.", color: "#7c3aed" },
];

const PLANETS: PlanetPosition[] = [
  { name: "Sun", tropicalDeg: 45.5, icon: "☉" },
  { name: "Moon", tropicalDeg: 12.3, icon: "☽" },
  { name: "Mars", tropicalDeg: 98.7, icon: "♂" },
  { name: "Mercury", tropicalDeg: 38.2, icon: "☿" },
  { name: "Jupiter", tropicalDeg: 165.4, icon: "♃" },
  { name: "Venus", tropicalDeg: 72.1, icon: "♀" },
  { name: "Saturn", tropicalDeg: 312.8, icon: "♄" },
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

// ─── Helpers ──────────────────────────────────────────────────
function getAyanamsa(year: number, model: AyanamsaModel): number {
  // Approximate linear drift: ~50.3 arcsec/year = ~0.01397 deg/year
  const baseYear = 2000;
  const baseLahiri = 23.85;
  const driftPerYear = 0.01397;
  const lahiriVal = baseLahiri + (year - baseYear) * driftPerYear;
  if (model === "lahiri") return lahiriVal;
  if (model === "raman") return lahiriVal - 1.51;
  return lahiriVal - 0.28;
}

function tropicalToSidereal(deg: number, ayanamsa: number): number {
  let sid = deg - ayanamsa;
  while (sid < 0) sid += 360;
  while (sid >= 360) sid -= 360;
  return sid;
}

function getSign(deg: number): string {
  return SIGNS[Math.floor(deg / 30)];
}

function getSignColor(deg: number): string {
  return SIGN_COLORS[Math.floor(deg / 30)];
}

function degToDms(deg: number): string {
  const d = Math.floor(deg);
  const mFloat = (deg - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

// ─── Component ────────────────────────────────────────────────
export default function AyanamsaEngineExplorer() {
  const [year, setYear] = useState(2025);
  const [model, setModel] = useState<AyanamsaModel>("lahiri");
  const [selectedPlanet, setSelectedPlanet] = useState<string>("Moon");
  const [showRipple, setShowRipple] = useState(false);

  const ayanamsaVal = useMemo(() => getAyanamsa(year, model), [year, model]);
  const modelInfo = MODELS.find((m) => m.id === model)!;

  const planetPositions = useMemo(() => {
    return PLANETS.map((p) => {
      const siderealDeg = tropicalToSidereal(p.tropicalDeg, ayanamsaVal);
      const sign = getSign(siderealDeg);
      const signColor = getSignColor(siderealDeg);
      return { ...p, siderealDeg, sign, signColor };
    });
  }, [ayanamsaVal]);

  const selectedPos = planetPositions.find((p) => p.name === selectedPlanet)!;

  // Compare with other models for ripple effect
  const compareModels = useMemo(() => {
    return MODELS.map((m) => {
      const val = getAyanamsa(year, m.id);
      const sid = tropicalToSidereal(
        PLANETS.find((p) => p.name === selectedPlanet)!.tropicalDeg,
        val
      );
      return {
        ...m,
        ayanamsa: val,
        siderealDeg: sid,
        sign: getSign(sid),
        signColor: getSignColor(sid),
      };
    });
  }, [year, selectedPlanet]);

  const signChanges = useMemo(() => {
    const lahiriSigns = PLANETS.map((p) =>
      getSign(tropicalToSidereal(p.tropicalDeg, getAyanamsa(year, "lahiri")))
    );
    const currentSigns = PLANETS.map((p) =>
      getSign(tropicalToSidereal(p.tropicalDeg, ayanamsaVal))
    );
    return PLANETS.filter((_, i) => lahiriSigns[i] !== currentSigns[i]).map(
      (_, i) => PLANETS[i].name
    );
  }, [year, model, ayanamsaVal]);

  // Generate drift chart points (year vs ayanamsa value)
  const driftPoints = useMemo(() => {
    const points: { year: number; lahiri: number; raman: number; kp: number }[] = [];
    for (let y = 1850; y <= 2100; y += 10) {
      points.push({
        year: y,
        lahiri: getAyanamsa(y, "lahiri"),
        raman: getAyanamsa(y, "raman"),
        kp: getAyanamsa(y, "kp"),
      });
    }
    return points;
  }, []);

  const chartWidth = 520;
  const chartHeight = 160;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 30;
  const xScale = (chartWidth - padL - padR) / (2100 - 1850);
  const yMin = 20;
  const yMax = 28;
  const yScale = (chartHeight - padT - padB) / (yMax - yMin);

  const toX = (yr: number) => padL + (yr - 1850) * xScale;
  const toY = (val: number) => chartHeight - padB - (val - yMin) * yScale;

  const currentX = toX(year);

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/60 px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-gray-900">Ayanamsa Precession Engine</h3>
        </div>
        <p className="text-sm text-slate-700">
          Explore how Earth's axial wobble shifts the zodiac baseline across three calculation models.
        </p>
      </div>

      <div className="p-5 space-y-5">
        {/* Controls Row */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
              Ayanamsa Model
            </label>
            <div className="flex gap-2">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    model === m.id
                      ? "text-white shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:border-amber-300"
                  }`}
                  style={
                    model === m.id
                      ? { backgroundColor: m.color, borderColor: m.color }
                      : {}
                  }
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
              Year: <span className="text-amber-700 font-bold">{year}</span>
            </label>
            <input
              type="range"
              min={1850}
              max={2100}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full accent-amber-600 h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1850</span>
              <span>2000</span>
              <span>2100</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
              Demo Planet
            </label>
            <select
              value={selectedPlanet}
              onChange={(e) => setSelectedPlanet(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-800 focus:ring-2 focus:ring-amber-300 outline-none"
            >
              {PLANETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.icon} {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drift Chart */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-800">Ayanamsa Drift Over Time</h4>
            <div className="flex items-center gap-3 text-[10px]">
              {MODELS.map((m) => (
                <span key={m.id} className="flex items-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  {m.label.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
          <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
            {/* Grid lines */}
            {[22, 24, 26, 28].map((val) => (
              <g key={val}>
                <line
                  x1={padL}
                  y1={toY(val)}
                  x2={chartWidth - padR}
                  y2={toY(val)}
                  stroke="#e2e8f0"
                  strokeDasharray="3,3"
                />
                <text x={padL - 5} y={toY(val) + 3} textAnchor="end" fill="#64748b" fontSize="9">
                  {val}°
                </text>
              </g>
            ))}
            {/* Year ticks */}
            {[1850, 1900, 1950, 2000, 2050, 2100].map((yr) => (
              <text key={yr} x={toX(yr)} y={chartHeight - 5} textAnchor="middle" fill="#64748b" fontSize="9">
                {yr}
              </text>
            ))}
            {/* Lines */}
            {MODELS.map((m) => {
              const pts = driftPoints.map((d) => `${toX(d.year)},${toY(d[m.id as keyof typeof d] as number)}`).join(" ");
              return (
                <polyline
                  key={m.id}
                  points={pts}
                  fill="none"
                  stroke={m.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}
            {/* Current year indicator */}
            <line
              x1={currentX}
              y1={padT}
              x2={currentX}
              y2={chartHeight - padB}
              stroke="#000000"
              strokeWidth="1"
              strokeDasharray="4,2"
            />
            <text x={currentX} y={padT - 4} textAnchor="middle" fill="#000000" fontSize="9" fontWeight="bold">
              {year}
            </text>
          </svg>
        </div>

        {/* Main Content: Zodiac Wheel + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Zodiac Wheel */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <h4 className="text-sm font-bold text-slate-800 mb-3">Sidereal Position — {selectedPlanet}</h4>
            <div className="flex justify-center">
              <svg width="280" height="280" viewBox="0 0 280 280">
                {/* Outer ring segments for signs */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const startAngle = (i * 30 - 90) * (Math.PI / 180);
                  const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);
                  const r1 = 130;
                  const r2 = 100;
                  const x1 = 140 + r1 * Math.cos(startAngle);
                  const y1 = 140 + r1 * Math.sin(startAngle);
                  const x2 = 140 + r1 * Math.cos(endAngle);
                  const y2 = 140 + r1 * Math.sin(endAngle);
                  const x3 = 140 + r2 * Math.cos(endAngle);
                  const y3 = 140 + r2 * Math.sin(endAngle);
                  const x4 = 140 + r2 * Math.cos(startAngle);
                  const y4 = 140 + r2 * Math.sin(startAngle);
                  const midAngle = ((i + 0.5) * 30 - 90) * (Math.PI / 180);
                  const tx = 140 + 115 * Math.cos(midAngle);
                  const ty = 140 + 115 * Math.sin(midAngle);
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
                        fontSize="8"
                        fontWeight="bold"
                      >
                        {SIGNS[i].slice(0, 3)}
                      </text>
                    </g>
                  );
                })}
                {/* Inner circle */}
                <circle cx="140" cy="140" r="100" fill="none" stroke="#000000" strokeWidth="1.5" />
                <circle cx="140" cy="140" r="130" fill="none" stroke="#000000" strokeWidth="1" />
                {/* Planet position */}
                {planetPositions.map((p, idx) => {
                  const angle = (p.siderealDeg - 90) * (Math.PI / 180);
                  const r = 85 - idx * 10;
                  const px = 140 + r * Math.cos(angle);
                  const py = 140 + r * Math.sin(angle);
                  const isSelected = p.name === selectedPlanet;
                  return (
                    <g key={p.name}>
                      <circle cx={px} cy={py} r={isSelected ? 7 : 4} fill={isSelected ? modelInfo.color : "#475569"} stroke="#ffffff" strokeWidth="1.5" />
                      {isSelected && (
                        <>
                          <line x1={140} y1={140} x2={px} y2={py} stroke={modelInfo.color} strokeWidth="1.5" strokeDasharray="3,2" />
                          <text x={px + 10} y={py} fill="#000000" fontSize="9" fontWeight="bold">{p.name}</text>
                        </>
                      )}
                    </g>
                  );
                })}
                {/* Center */}
                <circle cx="140" cy="140" r="3" fill="#000000" />
              </svg>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            {/* Current Ayanamsa Value */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-700 uppercase">Current Ayanamsa ({year})</span>
                <span className="text-xs text-slate-500">Model: {modelInfo.label}</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{ayanamsaVal.toFixed(2)}°</div>
              <div className="text-xs text-slate-700 mt-1">{degToDms(ayanamsaVal)}</div>
            </div>

            {/* Planet Position Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-700 uppercase">Planet Positions (Sidereal)</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-[200px] overflow-y-auto">
                {planetPositions.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPlanet(p.name)}
                    className={`w-full px-4 py-2 flex items-center justify-between text-left transition-colors ${
                      selectedPlanet === p.name ? "bg-amber-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{p.icon}</span>
                      <span className={`text-xs font-semibold ${selectedPlanet === p.name ? "text-amber-700" : "text-slate-700"}`}>
                        {p.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold" style={{ color: p.signColor }}>
                        {p.sign}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono">
                        {p.siderealDeg.toFixed(1)}°
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Comparison for Selected Planet */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-700 uppercase">Cross-Model Comparison — {selectedPlanet}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {compareModels.map((m) => (
                  <div key={m.id} className="px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="text-xs font-semibold text-slate-700">{m.label.split(" ")[0]}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold" style={{ color: m.signColor }}>{m.sign}</span>
                      <span className="text-[10px] text-slate-600 font-mono">{m.siderealDeg.toFixed(1)}°</span>
                      <span className="text-[10px] text-slate-500">A:{m.ayanamsa.toFixed(1)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ripple Effect Warning */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-800 mb-1">Ripple Effect Warning</h4>
              <p className="text-xs text-slate-700 mb-3">
                Switching the Ayanamsa engine shifts every planetary position. This creates cascading changes across all derived calculations.
              </p>
              <button
                onClick={() => setShowRipple((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {showRipple ? "Hide Impact" : "Show Impact"}
              </button>
              <AnimatePresence>
                {showRipple && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-2">
                      {signChanges.length > 0 ? (
                        <div className="bg-white rounded-lg border border-red-200 p-3">
                          <p className="text-xs font-bold text-red-700 mb-1.5">
                            ⚠️ Sign changes detected (vs Lahiri baseline):
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {signChanges.map((name) => (
                              <span key={name} className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-md">
                                {name}
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 text-[10px] text-slate-600 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <ArrowRight className="w-3 h-3 text-red-500" />
                              <span>All 16 Varga charts must be recalculated</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <ArrowRight className="w-3 h-3 text-red-500" />
                              <span>Vimshottari Dasha timeline shifts by months</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <ArrowRight className="w-3 h-3 text-red-500" />
                              <span>Nakshatra positions recalculate entirely</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <ArrowRight className="w-3 h-3 text-red-500" />
                              <span>All yogas, aspects, and house lords re-evaluated</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg border border-green-200 p-3">
                          <p className="text-xs font-bold text-green-700">
                            ✓ No sign changes vs Lahiri baseline. Positions shift within signs only.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                In production software, the Ayanamsa toggle must trigger a full cache invalidation. 
                All precomputed Varga charts, Dasha timelines, and Ashtakavarga matrices become invalid 
                the instant the baseline shifts. Always warn the user before permitting this destructive action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
