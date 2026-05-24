"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crosshair, Zap, Eye, Info, Star, ArrowRight, CheckCircle2, X
} from "lucide-react";

interface HouseData {
  num: number;
  name: string;
}

const HOUSES: HouseData[] = [
  { num: 1, name: "Self" }, { num: 2, name: "Wealth" }, { num: 3, name: "Siblings" },
  { num: 4, name: "Home" }, { num: 5, name: "Children" }, { num: 6, name: "Enemies" },
  { num: 7, name: "Marriage" }, { num: 8, name: "Transformation" }, { num: 9, name: "Fortune" },
  { num: 10, name: "Career" }, { num: 11, name: "Gains" }, { num: 12, name: "Loss" },
];

const PRESETS = [
  { label: "Marriage (H7)", jupiter: 11, saturn: 5, target: 7, lordHouse: 2 },
  { label: "Career (H10)", jupiter: 2, saturn: 10, target: 10, lordHouse: 6 },
  { label: "Wealth (H2)", jupiter: 6, saturn: 12, target: 2, lordHouse: 4 },
  { label: "Children (H5)", jupiter: 1, saturn: 9, target: 5, lordHouse: 11 },
];

export default function DoubleTransitExplorer() {
  const [jupiterPos, setJupiterPos] = useState(11);
  const [saturnPos, setSaturnPos] = useState(5);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [activePreset, setActivePreset] = useState(0);

  const cx = 200;
  const cy = 200;
  const r = 150;

  const houseAngle = (h: number) => ((h - 1) * 30 - 90) * (Math.PI / 180);

  const jupiterAspects = [5, 7, 9];
  const saturnAspects = [3, 7, 10];

  const getAspectedHouses = (planetPos: number, aspects: number[]) => {
    return aspects.map(a => {
      let target = planetPos + a;
      if (target > 12) target -= 12;
      return target;
    });
  };

  const jupiterTargets = getAspectedHouses(jupiterPos, jupiterAspects);
  const saturnTargets = getAspectedHouses(saturnPos, saturnAspects);
  const doubleHitHouses = jupiterTargets.filter(h => saturnTargets.includes(h));

  const planetPos = (pos: number, radius: number) => ({
    x: cx + radius * Math.cos(houseAngle(pos)),
    y: cy + radius * Math.sin(houseAngle(pos)),
  });

  const applyPreset = (idx: number) => {
    const p = PRESETS[idx];
    setActivePreset(idx);
    setJupiterPos(p.jupiter);
    setSaturnPos(p.saturn);
  };

  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <div className="w-full select-none">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700">
            Double Transit Theory
          </h2>
          <p className="text-base text-amber-700 mt-2 font-semibold">
            Jupiter Blessing + Saturn Karma = Event Manifestation
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => applyPreset(i)}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all border ${
                activePreset === i
                  ? "bg-amber-600 text-white border-amber-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Planet controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-orange-200 shadow-sm">
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Jupiter</span>
            <select
              value={jupiterPos}
              onChange={(e) => { setJupiterPos(Number(e.target.value)); setActivePreset(-1); }}
              className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
            >
              {HOUSES.map(h => <option key={h.num} value={h.num} className="bg-white">H{h.num} {h.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Saturn</span>
            <select
              value={saturnPos}
              onChange={(e) => { setSaturnPos(Number(e.target.value)); setActivePreset(-1); }}
              className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
            >
              {HOUSES.map(h => <option key={h.num} value={h.num} className="bg-white">H{h.num} {h.name}</option>)}
            </select>
          </div>
        </div>

        {/* Chart wheel */}
        <div className="relative w-full max-w-[480px] mx-auto aspect-square">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
              <filter id="dtGlowLight" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="jGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="sGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>

            {/* Houses */}
            {HOUSES.map((h) => {
              const a1 = ((h.num - 1) * 30 - 75) * (Math.PI / 180);
              const a2 = (h.num * 30 - 75) * (Math.PI / 180);
              const mid = ((h.num - 1) * 30 - 90) * (Math.PI / 180);
              const isDouble = doubleHitHouses.includes(h.num);
              const hasJupiter = jupiterTargets.includes(h.num);
              const hasSaturn = saturnTargets.includes(h.num);
              const isHover = hoveredHouse === h.num;
              const isSelected = selectedHouse === h.num;

              const x1 = cx + r * Math.cos(a1);
              const y1 = cy + r * Math.sin(a1);
              const x2 = cx + r * Math.cos(a2);
              const y2 = cy + r * Math.sin(a2);
              const mx = cx + (r * 0.75) * Math.cos(mid);
              const my = cy + (r * 0.75) * Math.sin(mid);

              let fill = "#f8fafc";
              if (isDouble) fill = "#a78bfa20";
              else if (hasJupiter) fill = "#f9731610";
              else if (hasSaturn) fill = "#64748b10";

              return (
                <g key={h.num}
                  onClick={() => setSelectedHouse(isSelected ? null : h.num)}
                  onMouseEnter={() => setHoveredHouse(h.num)}
                  onMouseLeave={() => setHoveredHouse(null)}
                  className="cursor-pointer"
                >
                  <path
                    d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                    fill={fill}
                    stroke={isDouble ? "#8b5cf6" : isHover ? "#475569" : "#94a3b8"}
                    strokeWidth={isDouble ? 2 : isHover ? 1.5 : 0.8}
                    opacity={isSelected || isHover ? 1 : 0.9}
                  />
                  <text x={mx} y={my} textAnchor="middle" dominantBaseline="central"
                    fontSize={isDouble ? 13 : 11} fontWeight={isDouble ? 800 : 600}
                    fill={isDouble ? "#7c3aed" : "#1e293b"}
                    style={{ pointerEvents: "none" }}
                  >
                    {h.num}
                  </text>
                </g>
              );
            })}

            {/* Jupiter aspect rays */}
            {jupiterAspects.map((aspect, i) => {
              const target = jupiterTargets[i];
              const jP = planetPos(jupiterPos, r + 24);
              const tP = planetPos(target, r - 10);
              return (
                <g key={`j-${aspect}`}>
                  <line
                    x1={jP.x} y1={jP.y} x2={tP.x} y2={tP.y}
                    stroke="url(#jGradLight)" strokeWidth="2"
                    strokeDasharray="6 4"
                    opacity="0.55"
                    strokeLinecap="round"
                  >
                    <animate attributeName="stroke-dashoffset" from="20" to="0" dur="2s" repeatCount="indefinite" />
                  </line>
                  <circle cx={tP.x} cy={tP.y} r={4} fill="#f97316" opacity="0.3" />
                </g>
              );
            })}

            {/* Saturn aspect rays */}
            {saturnAspects.map((aspect, i) => {
              const target = saturnTargets[i];
              const sP = planetPos(saturnPos, r + 24);
              const tP = planetPos(target, r - 10);
              return (
                <g key={`s-${aspect}`}>
                  <line
                    x1={sP.x} y1={sP.y} x2={tP.x} y2={tP.y}
                    stroke="url(#sGradLight)" strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.45"
                    strokeLinecap="round"
                  >
                    <animate attributeName="stroke-dashoffset" from="16" to="0" dur="2.5s" repeatCount="indefinite" />
                  </line>
                  <circle cx={tP.x} cy={tP.y} r={4} fill="#64748b" opacity="0.25" />
                </g>
              );
            })}

            {/* Jupiter node */}
            {(() => {
              const pos = planetPos(jupiterPos, r + 24);
              return (
                <g>
                  <circle cx={pos.x} cy={pos.y} r={18} fill="#fff" stroke="#f97316" strokeWidth="2.5" filter="url(#dtGlowLight)" />
                  <circle cx={pos.x} cy={pos.y} r={12} fill="url(#jGradLight)" />
                  <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={900} fill="#fff">♃</text>
                  <text x={pos.x} y={pos.y + 28} textAnchor="middle" fontSize={10} fontWeight={700} fill="#c2410c">Jupiter</text>
                </g>
              );
            })()}

            {/* Saturn node */}
            {(() => {
              const pos = planetPos(saturnPos, r + 24);
              return (
                <g>
                  <circle cx={pos.x} cy={pos.y} r={18} fill="#fff" stroke="#64748b" strokeWidth="2.5" filter="url(#dtGlowLight)" />
                  <circle cx={pos.x} cy={pos.y} r={12} fill="url(#sGradLight)" />
                  <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={900} fill="#fff">♄</text>
                  <text x={pos.x} y={pos.y + 28} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">Saturn</text>
                </g>
              );
            })()}

            {/* Center hub */}
            <circle cx={cx} cy={cy} r={30} fill="#fff" stroke="#fbbf24" strokeWidth="2" />
            <text x={cx} y={cy - 3} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={800} fill="#78350f">Double</text>
            <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central" fontSize={9} fill="#451a03">Transit</text>
          </svg>
        </div>

        {/* Double-hit legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {doubleHitHouses.length > 0 ? (
            <>
              <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                <Crosshair className="w-3.5 h-3.5" />
                Crosshair: {doubleHitHouses.map(h => `H${h}`).join(", ")}
              </span>
              {doubleHitHouses.map(h => (
                <span key={h} className="text-[10px] font-bold px-2 py-1 rounded-full bg-violet-50 text-violet-600 border border-violet-100">
                  H{h} = {HOUSES[h - 1].name}
                </span>
              ))}
            </>
          ) : (
            <span className="text-sm text-gray-600 italic">No double transit active with current positions.</span>
          )}
        </div>

        {/* Rule panel */}
        <div className="mt-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-800 uppercase tracking-wider">The Rule</span>
          </div>
          <p className="text-base text-gray-800 leading-relaxed">
            <strong className="text-orange-600">Jupiter</strong> casts aspects on houses <strong className="text-orange-600">5, 7, 9</strong> from itself.
            <strong className="text-slate-500"> Saturn</strong> casts aspects on houses <strong className="text-slate-500">3, 7, 10</strong> from itself.
            When <strong className="text-violet-600">both aspect the same house</strong>, that house is caught in the <strong>Crosshair</strong> — the event window is open.
          </p>
        </div>

        {/* House-lord vector note */}
        <div className="mt-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/40">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-800 uppercase tracking-wider">Advanced: House Lord Vector</span>
          </div>
          <p className="text-base text-gray-800 leading-relaxed">
            If the target house lord sits in a different house, the Double Transit hitting <strong>that house</strong> also triggers the event.
            Example: If Venus (7th lord) sits in the 2nd house, Jupiter+Saturn aspecting the 2nd house will also activate marriage.
          </p>
        </div>

        {/* Selected house popup — inline, not fixed modal */}
        <AnimatePresence>
          {selectedHouse && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              {(() => {
                const h = HOUSES[selectedHouse - 1];
                const isDouble = doubleHitHouses.includes(selectedHouse);
                const hasJ = jupiterTargets.includes(selectedHouse);
                const hasS = saturnTargets.includes(selectedHouse);
                return (
                  <div className={`p-4 rounded-2xl border shadow-sm ${
                    isDouble ? "bg-violet-50 border-violet-200" : "bg-white border-gray-100"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`text-xl font-extrabold ${isDouble ? "text-violet-700" : "text-gray-500"}`}>
                          House {h.num} — {h.name}
                        </div>
                        {isDouble && (
                          <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                            <Crosshair className="w-3.5 h-3.5" /> CROSSHAIR
                          </span>
                        )}
                      </div>
                      <button onClick={() => setSelectedHouse(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {hasJ && (
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Jupiter aspects this house
                        </span>
                      )}
                      {hasS && (
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Saturn aspects this house
                        </span>
                      )}
                      {isDouble && (
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-violet-100 text-violet-800 border border-violet-300">
                          <Crosshair className="w-3.5 h-3.5" /> Double Transit Active — Event Window Open
                        </span>
                      )}
                      {!hasJ && !hasS && (
                        <span className="text-sm text-gray-600">No planet aspects this house currently.</span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Senior astrologer note */}
        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <Info className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-900 leading-relaxed">
            <strong>Professional Note:</strong> Jupiter aspects the 10th house every few years, but you don't get a promotion every time.
            The Double Transit filters false positives — both Jupiter (blessing) AND Saturn (karma) must simultaneously influence 
            the same domain. One key alone keeps the event as potential only.
          </p>
        </div>
      </div>
    </div>
  );
}
