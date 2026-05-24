"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Pentagon, ArrowRight, Zap, Star, AlertTriangle, CheckCircle2,
  XCircle, Sparkles, MoveRight, MoveLeft, Orbit,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────
const ASPECTS = [
  { id: "conjunction", name: "Conjunction", angle: 0, type: "neutral", desc: "0° — Planets at same longitude" },
  { id: "sextile", name: "Sextile", angle: 60, type: "friendly", desc: "60° — Easy success, helpful allies" },
  { id: "square", name: "Square", angle: 90, type: "hostile", desc: "90° — Obstacles, open conflict" },
  { id: "trine", name: "Trine", angle: 120, type: "friendly", desc: "120° — Great fortune, flow" },
  { id: "opposition", name: "Opposition", angle: 180, type: "hostile", desc: "180° — Forced compromise" },
];

const PLANETS = [
  { name: "Sun", speed: "slow", color: "#f97316" },
  { name: "Moon", speed: "fast", color: "#64748b" },
  { name: "Mars", speed: "medium", color: "#ef4444" },
  { name: "Mercury", speed: "fast", color: "#22c55e" },
  { name: "Jupiter", speed: "slow", color: "#eab308" },
  { name: "Venus", speed: "medium", color: "#ec4899" },
  { name: "Saturn", speed: "slow", color: "#6b7280" },
];

const DEEPTAMSHA: Record<string, number> = {
  Sun: 15, Moon: 12, Mars: 8, Mercury: 7, Jupiter: 9, Venus: 7, Saturn: 9,
};

// ─── Component ────────────────────────────────────────────────
export default function TajikYogaExplorer() {
  const [planetA, setPlanetA] = useState(PLANETS[4]); // Jupiter
  const [planetB, setPlanetB] = useState(PLANETS[6]); // Saturn
  const [posA, setPosA] = useState(45); // degrees
  const [posB, setPosB] = useState(75); // degrees
  const [selectedAspect, setSelectedAspect] = useState(ASPECTS[2]); // Square

  const distance = Math.abs(posA - posB);
  const shortestDistance = Math.min(distance, 360 - distance);

  const orb = useMemo(() => {
    const d1 = DEEPTAMSHA[planetA.name] || 7;
    const d2 = DEEPTAMSHA[planetB.name] || 7;
    return (d1 + d2) / 2;
  }, [planetA, planetB]);

  const isWithinOrb = shortestDistance <= selectedAspect.angle + orb && shortestDistance >= selectedAspect.angle - orb;
  const isExact = Math.abs(shortestDistance - selectedAspect.angle) <= 3;

  // Ithasala vs Easarpha
  const isApplying = planetA.speed === "fast" && posA < posB;
  const isSeparating = planetA.speed === "fast" && posA > posB;

  const yogaType =
    isExact && isWithinOrb
      ? isApplying
        ? "ithasala"
        : isSeparating
        ? "esarpha"
        : "stationary"
      : "none";

  return (
    <div className="bg-white border border-orange-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center">
            <Pentagon className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-orange-900">Tajik Yoga Geometry Engine</h3>
            <p className="text-sm text-orange-600">Persian Aspect Logic — Ithasala vs. Easarpha</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Aspect Type Selector */}
        <div className="mb-5">
          <label className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-2 block">Select Aspect Type</label>
          <div className="flex flex-wrap gap-2">
            {ASPECTS.map((a) => {
              const active = selectedAspect.id === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAspect(a)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border transition-all ${
                    active
                      ? a.type === "friendly"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : a.type === "hostile"
                        ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                        : "bg-orange-600 text-white border-orange-600 shadow-sm"
                      : "bg-white text-slate-800 border-slate-200 hover:border-orange-300"
                  }`}
                >
                  <span className="text-xs">{a.angle}°</span> {a.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Planet Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-bold text-orange-800">Planet A</span>
              <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${planetA.speed === "fast" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{planetA.speed.toUpperCase()}</span>
            </div>
            <select
              value={planetA.name}
              onChange={(e) => setPlanetA(PLANETS.find((p) => p.name === e.target.value)!)}
              className="w-full px-3 py-2 rounded-lg border border-orange-200 text-sm font-bold text-slate-800 bg-white mb-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {PLANETS.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
            <label className="text-xs font-bold text-orange-700 mb-1 block">Longitude: {posA}°</label>
            <input
              type="range"
              min={0}
              max={360}
              value={posA}
              onChange={(e) => setPosA(Number(e.target.value))}
              className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: planetA.color }}
            />
          </div>
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-800">Planet B</span>
              <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded ${planetB.speed === "fast" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{planetB.speed.toUpperCase()}</span>
            </div>
            <select
              value={planetB.name}
              onChange={(e) => setPlanetB(PLANETS.find((p) => p.name === e.target.value)!)}
              className="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm font-bold text-slate-800 bg-white mb-3 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              {PLANETS.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
            <label className="text-xs font-bold text-amber-700 mb-1 block">Longitude: {posB}°</label>
            <input
              type="range"
              min={0}
              max={360}
              value={posB}
              onChange={(e) => setPosB(Number(e.target.value))}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: planetB.color }}
            />
          </div>
        </div>

        {/* Orb Info */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 mb-5 text-center">
          <div className="text-xs text-slate-800">
            Deeptamsha Orb: <strong className="text-orange-700">{orb.toFixed(1)}°</strong> (avg of {planetA.name} {DEEPTAMSHA[planetA.name]}° + {planetB.name} {DEEPTAMSHA[planetB.name]}°)
          </div>
          <div className="text-xs text-slate-800 mt-1">
            Actual Distance: <strong className={isExact ? "text-emerald-700" : "text-slate-700"}>{shortestDistance.toFixed(1)}°</strong> vs Target: <strong>{selectedAspect.angle}°</strong>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-5">
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Outer circle */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="#000000" strokeWidth="2" />
                {/* Degree ticks */}
                {Array.from({ length: 12 }, (_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180);
                  const x1 = 100 + 82 * Math.cos(angle);
                  const y1 = 100 + 82 * Math.sin(angle);
                  const x2 = 100 + 90 * Math.cos(angle);
                  const y2 = 100 + 90 * Math.sin(angle);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000000" strokeWidth="1" />;
                })}
                {/* Aspect angle arc */}
                {isWithinOrb && (
                  <path
                    d={`M 100 10 A 90 90 0 0 1 ${100 + 90 * Math.cos((selectedAspect.angle - 90) * Math.PI / 180)} ${100 + 90 * Math.sin((selectedAspect.angle - 90) * Math.PI / 180)}`}
                    fill="none"
                    stroke={selectedAspect.type === "friendly" ? "#10b981" : selectedAspect.type === "hostile" ? "#f43f5e" : "#f59e0b"}
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    opacity="0.4"
                  />
                )}
                {/* Planet A */}
                <g>
                  <circle
                    cx={100 + 75 * Math.cos((posA - 90) * Math.PI / 180)}
                    cy={100 + 75 * Math.sin((posA - 90) * Math.PI / 180)}
                    r="12"
                    fill={planetA.color}
                    opacity="0.9"
                  />
                  <text
                    x={100 + 75 * Math.cos((posA - 90) * Math.PI / 180)}
                    y={100 + 75 * Math.sin((posA - 90) * Math.PI / 180)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="8"
                    fill="#fff"
                    fontWeight="bold"
                  >
                    {planetA.name[0]}
                  </text>
                </g>
                {/* Planet B */}
                <g>
                  <circle
                    cx={100 + 75 * Math.cos((posB - 90) * Math.PI / 180)}
                    cy={100 + 75 * Math.sin((posB - 90) * Math.PI / 180)}
                    r="12"
                    fill={planetB.color}
                    opacity="0.9"
                  />
                  <text
                    x={100 + 75 * Math.cos((posB - 90) * Math.PI / 180)}
                    y={100 + 75 * Math.sin((posB - 90) * Math.PI / 180)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="8"
                    fill="#fff"
                    fontWeight="bold"
                  >
                    {planetB.name[0]}
                  </text>
                </g>
                {/* Center */}
                <circle cx="100" cy="100" r="4" fill="#000000" />
              </svg>
            </div>
          </div>
        </div>

        {/* Yoga Result */}
        <div className={`rounded-xl border-2 p-4 mb-5 text-center ${
          yogaType === "ithasala"
            ? "bg-emerald-50 border-emerald-300"
            : yogaType === "esarpha"
            ? "bg-rose-50 border-rose-300"
            : isWithinOrb
            ? "bg-amber-50 border-amber-300"
            : "bg-slate-50 border-slate-200"
        }`}>
          {yogaType === "ithasala" && (
            <>
              <div className="flex items-center justify-center gap-2 mb-1">
                <MoveRight className="w-5 h-5 text-emerald-600" />
                <span className="text-xl font-extrabold text-emerald-800">Ithasala Yoga</span>
              </div>
              <p className="text-sm text-emerald-700 font-medium">Applying Aspect — The event is actively forming and will manifest soon.</p>
            </>
          )}
          {yogaType === "esarpha" && (
            <>
              <div className="flex items-center justify-center gap-2 mb-1">
                <MoveLeft className="w-5 h-5 text-rose-600" />
                <span className="text-xl font-extrabold text-rose-800">Easarpha Yoga</span>
              </div>
              <p className="text-sm text-rose-700 font-medium">Separating Aspect — The opportunity has passed. Momentum is dead.</p>
            </>
          )}
          {yogaType === "stationary" && isWithinOrb && (
            <>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Orbit className="w-5 h-5 text-amber-600" />
                <span className="text-xl font-extrabold text-amber-800">Stationary Aspect</span>
              </div>
              <p className="text-sm text-amber-700 font-medium">Exact angle held — Event is at peak intensity.</p>
            </>
          )}
          {!isWithinOrb && (
            <>
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="w-5 h-5 text-slate-500" />
                <span className="text-xl font-extrabold text-slate-700">No Valid Aspect</span>
              </div>
              <p className="text-sm text-slate-600">Distance exceeds Deeptamsha orb. No geometric connection.</p>
            </>
          )}
        </div>

        {/* Aspect Meaning */}
        <div className={`rounded-lg border p-3 mb-4 ${
          selectedAspect.type === "friendly"
            ? "bg-emerald-50 border-emerald-200"
            : selectedAspect.type === "hostile"
            ? "bg-rose-50 border-rose-200"
            : "bg-orange-50 border-orange-200"
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {selectedAspect.type === "friendly" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : selectedAspect.type === "hostile" ? <AlertTriangle className="w-4 h-4 text-rose-600" /> : <Star className="w-4 h-4 text-orange-600" />}
            <span className={`text-sm font-bold ${
              selectedAspect.type === "friendly" ? "text-emerald-800" : selectedAspect.type === "hostile" ? "text-rose-800" : "text-orange-800"
            }`}>
              {selectedAspect.name} — {selectedAspect.type === "friendly" ? "Mitra Drishti (Friendly)" : selectedAspect.type === "hostile" ? "Shatru Drishti (Hostile)" : "Neutral"}
            </span>
          </div>
          <p className={`text-xs ${
            selectedAspect.type === "friendly" ? "text-emerald-700" : selectedAspect.type === "hostile" ? "text-rose-700" : "text-orange-700"
          }`}>
            {selectedAspect.desc}
          </p>
        </div>

        {/* Astrologer Note */}
        <div className="bg-orange-50 rounded-lg border border-orange-200 p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-orange-800">Astrologer Note</div>
              <p className="text-sm text-orange-700 mt-0.5">
                Tajik aspects are <strong>degree-exact</strong>, not sign-based. Always check velocity: a fast planet applying to a slow planet creates Ithasala (success). A fast planet separating creates Easarpha (failure). The orb (Deeptamsha) must be respected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
