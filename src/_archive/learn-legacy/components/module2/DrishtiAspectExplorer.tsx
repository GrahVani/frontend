"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Info, RotateCcw } from "lucide-react";

interface PlanetData {
  id: string;
  name: string;
  sanskrit: string;
  color: string;
  bg: string;
  border: string;
  aspects: number[];
  isSpecial: boolean;
  description: string;
}

const PLANETS: PlanetData[] = [
  { id: "sun", name: "Sun", sanskrit: "Surya", color: "#d97706", bg: "#fffbeb", border: "#fcd34d", aspects: [7], isSpecial: false, description: "The Sun casts only the universal 7th aspect — authority and visibility to the opposite house." },
  { id: "moon", name: "Moon", sanskrit: "Chandra", color: "#64748b", bg: "#f8fafc", border: "#cbd5e1", aspects: [7], isSpecial: false, description: "The Moon casts only the universal 7th aspect — emotional connection to the opposite house." },
  { id: "mercury", name: "Mercury", sanskrit: "Budha", color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", aspects: [7], isSpecial: false, description: "Mercury casts only the universal 7th aspect — analytical and communicative energy across the chart." },
  { id: "venus", name: "Venus", sanskrit: "Shukra", color: "#db2777", bg: "#fdf2f8", border: "#f9a8d4", aspects: [7], isSpecial: false, description: "Venus casts only the universal 7th aspect — harmony and relationship energy to the opposite house." },
  { id: "mars", name: "Mars", sanskrit: "Mangala", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", aspects: [4, 7, 8], isSpecial: true, description: "Mars (The Commander) protects its base and strikes blind spots. Special aspects: 4th, 7th, and 8th from itself." },
  { id: "jupiter", name: "Jupiter", sanskrit: "Guru", color: "#ea580c", bg: "#fff7ed", border: "#fdba74", aspects: [5, 7, 9], isSpecial: true, description: "Jupiter (The Teacher) expands and blesses everything in a trine of harmony. Special aspects: 5th, 7th, and 9th from itself." },
  { id: "saturn", name: "Saturn", sanskrit: "Shani", color: "#475569", bg: "#f1f5f9", border: "#94a3b8", aspects: [3, 7, 10], isSpecial: true, description: "Saturn (The Judge) looks where effort is required and duty must be fulfilled. Special aspects: 3rd, 7th, and 10th from itself." },
  { id: "rahu", name: "Rahu", sanskrit: "Rahu", color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", aspects: [5, 7, 9], isSpecial: true, description: "Rahu (The Rebel) mimics Jupiter's expansive geometry. Special aspects: 5th, 7th, and 9th from itself." },
  { id: "ketu", name: "Ketu", sanskrit: "Ketu", color: "#0891b2", bg: "#f0fdfa", border: "#5eead4", aspects: [], isSpecial: false, description: "Ketu (The Monk) has no head — therefore blind. It casts NO Drishti. This is the exception every student must memorize." },
];

function getHouseAngle(houseNum: number) {
  const deg = -90 - (houseNum - 1) * 30;
  return (deg * Math.PI) / 180;
}

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function getTargetHouse(sourceHouse: number, aspectOffset: number) {
  let target = sourceHouse + aspectOffset - 1;
  if (target > 12) target -= 12;
  return target;
}

function getCountingPath(source: number, target: number): number[] {
  const path: number[] = [];
  let current = source;
  while (true) {
    path.push(current);
    if (current === target) break;
    current = current === 12 ? 1 : current + 1;
  }
  return path;
}

export default function DrishtiAspectExplorer() {
  const [planetId, setPlanetId] = useState("mars");
  const [house, setHouse] = useState(1);
  const [showCounting, setShowCounting] = useState(true);

  const planet = useMemo(() => PLANETS.find((p) => p.id === planetId)!, [planetId]);

  const cx = 430;
  const cy = 310;
  const rOuter = 260;
  const rMid = 200;
  const rInner = 120;
  const rLabel = 295;
  const rPlanet = 230;

  const sourceAngle = getHouseAngle(house);
  const sourcePos = polar(cx, cy, rPlanet, sourceAngle);

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-white to-amber-50 rounded-2xl border border-indigo-200/80 shadow-lg p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-indigo-900">Planetary Drishti (Aspects)</h3>
        <p className="text-sm text-indigo-700 mt-1">Select a planet and house to see where its gaze falls — using inclusive Vedic counting</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-indigo-200 p-3 sm:p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">Planet</label>
          <select
            value={planetId}
            onChange={(e) => setPlanetId(e.target.value)}
            className="text-sm font-medium rounded-lg border border-gray-200 bg-white px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {PLANETS.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.sanskrit})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">In House</label>
          <input
            type="range" min={1} max={12} step={1} value={house}
            onChange={(e) => setHouse(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="text-sm font-bold text-indigo-800 w-8">H{house}</span>
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={showCounting} onChange={(e) => setShowCounting(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
          <span className="text-xs text-gray-700">Show Counting</span>
        </label>

        <button
          onClick={() => { setPlanetId("mars"); setHouse(1); }}
          className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl border p-3 mb-4 flex items-start gap-3" style={{ background: planet.bg, borderColor: planet.border }}>
        <Eye className="w-5 h-5 shrink-0 mt-0.5" style={{ color: planet.color }} />
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: planet.color }}>
            {planet.name} ({planet.sanskrit}){" "}
            {planet.aspects.length > 0 ? (
              <span className="text-gray-700">aspects the {planet.aspects.join("th, ")}th house{planet.aspects.length > 1 ? "s" : ""} from itself.</span>
            ) : (
              <span className="text-gray-700">casts <strong>NO aspects</strong> — headless, therefore blind.</span>
            )}
          </p>
          <p className="text-xs text-gray-600 mt-1">{planet.description}</p>
        </div>
      </div>

      {/* Chart + Details */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left: SVG Chart */}
        <div className="flex-1 flex justify-center min-w-0">
          <svg viewBox="0 0 860 640" className="w-full h-auto">
            {/* Outer rim */}
            <circle cx={cx} cy={cy} r={rOuter} fill="#fafafa" stroke="#cbd5e1" strokeWidth={2} />
            <circle cx={cx} cy={cy} r={rOuter - 1} fill="none" stroke="#fff" strokeWidth={2} />

            {/* Middle reference ring */}
            <circle cx={cx} cy={cy} r={rMid} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />

            {/* Inner hub */}
            <circle cx={cx} cy={cy} r={rInner} fill="#fff" stroke="#e2e8f0" strokeWidth={1.5} />
            <circle cx={cx} cy={cy} r={4} fill="#475569" />

            {/* House spokes */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = getHouseAngle(i + 1);
              const x = cx + rOuter * Math.cos(angle);
              const y = cy + rOuter * Math.sin(angle);
              return (
                <line key={`spoke-${i}`} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth={1.5} />
              );
            })}

            {/* House wedges (subtle tint) */}
            {Array.from({ length: 12 }).map((_, i) => {
              const houseNum = i + 1;
              const angle = getHouseAngle(houseNum);
              const nextAngle = getHouseAngle(houseNum === 12 ? 1 : houseNum + 1);
              const x1 = cx + rOuter * Math.cos(angle);
              const y1 = cy + rOuter * Math.sin(angle);
              const x2 = cx + rOuter * Math.cos(nextAngle);
              const y2 = cy + rOuter * Math.sin(nextAngle);

              const isSource = houseNum === house;
              const isAspected = planet.aspects.some((offset) => getTargetHouse(house, offset) === houseNum);
              const isKendra = [1, 4, 7, 10].includes(houseNum);

              let fill = isSource ? planet.bg : isAspected ? planet.color + "12" : isKendra ? "#eef2ff" : "transparent";

              return (
                <path
                  key={`wedge-${houseNum}`}
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 0 ${x2} ${y2} Z`}
                  fill={fill}
                  stroke={isSource || isAspected ? planet.color : "none"}
                  strokeWidth={isSource ? 2 : isAspected ? 1.5 : 0}
                  opacity={isSource ? 0.85 : isAspected ? 0.7 : 1}
                />
              );
            })}

            {/* House labels */}
            {Array.from({ length: 12 }).map((_, i) => {
              const houseNum = i + 1;
              const angle = getHouseAngle(houseNum);
              const pos = polar(cx, cy, rLabel, angle);
              const isSource = houseNum === house;
              const isAspected = planet.aspects.some((offset) => getTargetHouse(house, offset) === houseNum);
              return (
                <text
                  key={`label-${houseNum}`}
                  x={pos.x} y={pos.y}
                  textAnchor="middle" dominantBaseline="central"
                  className="text-lg font-bold"
                  fill={isSource ? planet.color : isAspected ? planet.color : "#94a3b8"}
                >
                  {houseNum}
                </text>
              );
            })}

            {/* Aspect lines — drawn on outer rim */}
            <AnimatePresence>
              {planet.aspects.map((offset) => {
                const targetHouse = getTargetHouse(house, offset);
                const targetAngle = getHouseAngle(targetHouse);
                const start = polar(cx, cy, rOuter - 4, sourceAngle);
                const end = polar(cx, cy, rOuter - 4, targetAngle);
                const is7th = offset === 7;
                const countingPath = showCounting ? getCountingPath(house, targetHouse) : [];

                return (
                  <g key={offset}>
                    {/* Counting dots on mid ring */}
                    {showCounting && countingPath.length > 2 && countingPath.slice(1, -1).map((h, idx) => {
                      const a = getHouseAngle(h);
                      const p = polar(cx, cy, rMid, a);
                      return (
                        <g key={h}>
                          <circle cx={p.x} cy={p.y} r={14} fill="#fff" stroke={planet.color} strokeWidth={1.5} opacity={0.9} />
                          <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={800} fill={planet.color}>
                            {idx + 2}
                          </text>
                        </g>
                      );
                    })}

                    {/* Main aspect ray — from outer rim to outer rim */}
                    <motion.line
                      x1={start.x} y1={start.y}
                      x2={end.x} y2={end.y}
                      stroke={planet.color}
                      strokeWidth={is7th ? 3.5 : 3}
                      strokeDasharray={is7th ? "0" : "8 5"}
                      opacity={0.65}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.65 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />

                    {/* Glow under the line */}
                    <motion.line
                      x1={start.x} y1={start.y}
                      x2={end.x} y2={end.y}
                      stroke={planet.color}
                      strokeWidth={is7th ? 10 : 8}
                      opacity={0.08}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.08 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />

                    {/* Target marker on rim */}
                    <motion.circle
                      cx={end.x} cy={end.y} r={6}
                      fill={planet.color} opacity={0.35}
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: 0.5 }}
                    />

                    {/* Offset badge near target */}
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                      <rect
                        x={end.x - 19} y={end.y - 28}
                        width={38} height={18} rx={5}
                        fill={planet.color} opacity={0.9}
                      />
                      <text x={end.x} y={end.y - 17} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff">
                        {offset}th
                      </text>
                    </motion.g>
                  </g>
                );
              })}
            </AnimatePresence>

            {/* Source planet marker on rim */}
            <g>
              <circle cx={sourcePos.x} cy={sourcePos.y} r={24} fill={planet.color} opacity={0.12} />
              <circle cx={sourcePos.x} cy={sourcePos.y} r={18} fill="#fff" stroke={planet.color} strokeWidth={2.5} />
              <text x={sourcePos.x} y={sourcePos.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={800} fill={planet.color}>
                {planet.name[0]}
              </text>
              <rect x={sourcePos.x - 30} y={sourcePos.y + 22} width={60} height={18} rx={5} fill={planet.color} opacity={0.9} />
              <text x={sourcePos.x} y={sourcePos.y + 33} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">
                {planet.name}
              </text>
            </g>

            {/* Center label */}
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill="#94a3b8">
              Drishti
            </text>
          </svg>
        </div>

        {/* Right: Aspect Breakdown Panel */}
        <div className="lg:w-80 shrink-0 bg-white rounded-xl border border-indigo-200 p-4 space-y-3">
          <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wide flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Aspect Breakdown
          </h4>

          {planet.aspects.length === 0 ? (
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-center">
              <p className="text-sm font-bold text-gray-700">No Aspects</p>
              <p className="text-xs text-gray-500 mt-1">Ketu is headless and blind.</p>
            </div>
          ) : (
            planet.aspects.map((offset) => {
              const target = getTargetHouse(house, offset);
              const is7th = offset === 7;
              const path = getCountingPath(house, target);
              return (
                <div key={offset} className="p-3 rounded-lg border" style={{ background: is7th ? "#f8fafc" : planet.bg, borderColor: is7th ? "#e2e8f0" : planet.border }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: planet.color }}>
                      {is7th ? "Universal" : "Special"}
                    </span>
                    <span className="text-xs font-bold text-gray-700">{offset}th Aspect</span>
                  </div>
                  <p className="text-xs text-gray-600">From <strong>H{house}</strong> to <strong>H{target}</strong></p>
                  {showCounting && (
                    <p className="text-[10px] text-gray-500 mt-1 font-mono">{path.join(" → ")}</p>
                  )}
                </div>
              );
            })
          )}

          {/* Legend */}
          <div className="pt-2 border-t border-gray-100 space-y-1.5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Legend</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-gray-500 rounded" />
              <span className="text-[10px] text-gray-600">Solid = 7th (Universal)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 border-b-2 border-dashed border-gray-500" />
              <span className="text-[10px] text-gray-600">Dashed = Special</span>
            </div>
          </div>
        </div>
      </div>

      {/* Senior Astrologer Note */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-bold">Note:</span>{" "}
          Vedic counting is <strong>inclusive</strong> — the house the planet occupies is counted as &quot;1.&quot;{" "}
          If Mars sits in H2 and aspects the 4th from itself, you count: 2,3,4,5 = <strong>H5 is aspected</strong>.{" "}
          This is the #1 error in software aspect calculators. The chart uses <strong>counter-clockwise</strong> house numbering — the true zodiacal direction.
        </p>
      </div>
    </div>
  );
}
