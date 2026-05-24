"use client";

import React, { useState, useEffect } from "react";
import { X, Crosshair, Zap, Eye } from "lucide-react";

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

const SIGN_COLORS = [
  "#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7",
  "#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7",
];

export default function DoubleTransit({ size = 680 }: { size?: number }) {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [jupiterPos, setJupiterPos] = useState(11);
  const [saturnPos, setSaturnPos] = useState(5);
  const [animating, setAnimating] = useState(false);

  const cx = 220;
  const cy = 220;
  const r = 160;

  useEffect(() => {
    // Initial animation
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const houseAngle = (h: number) => ((h - 1) * 30 - 90) * (Math.PI / 180);

  const jupiterAspects = [5, 7, 9]; // from its position
  const saturnAspects = [3, 7, 10]; // from its position

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

  return (
    <div className="relative w-full max-w-[720px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 shadow-2xl shadow-indigo-900/30 p-6 sm:p-8 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div className="text-center mb-5 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-indigo-300">
            Double Transit Theory
          </h2>
          <p className="text-sm text-indigo-300/70 mt-2 font-medium">
            Jupiter Blessing + Saturn Karma = Event Manifestation
          </p>
        </div>

        {/* Planet position controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5 relative z-10">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2 border border-orange-500/20">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Jupiter</span>
            <select
              value={jupiterPos}
              onChange={(e) => setJupiterPos(Number(e.target.value))}
              className="bg-transparent text-sm font-bold text-orange-300 outline-none cursor-pointer"
            >
              {HOUSES.map(h => <option key={h.num} value={h.num} className="bg-slate-800">H{h.num} {h.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2 border border-slate-500/20">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saturn</span>
            <select
              value={saturnPos}
              onChange={(e) => setSaturnPos(Number(e.target.value))}
              className="bg-transparent text-sm font-bold text-slate-300 outline-none cursor-pointer"
            >
              {HOUSES.map(h => <option key={h.num} value={h.num} className="bg-slate-800">H{h.num} {h.name}</option>)}
            </select>
          </div>
        </div>

        {/* Chart wheel */}
        <div className="relative w-full max-w-[440px] mx-auto aspect-square">
          <svg viewBox="0 0 440 440" className="w-full h-full">
            <defs>
              <filter id="dtGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="jGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="sGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
              const mx = cx + (r * 0.78) * Math.cos(mid);
              const my = cy + (r * 0.78) * Math.sin(mid);

              let fill = "#1e293b";
              if (isDouble) fill = "#7c3aed30";
              else if (hasJupiter) fill = "#f9731615";
              else if (hasSaturn) fill = "#47556920";

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
                    stroke={isDouble ? "#a78bfa" : isHover ? "#64748b" : "#334155"}
                    strokeWidth={isDouble ? 2.5 : isHover ? 2 : 0.8}
                    opacity={isSelected || isHover ? 1 : 0.85}
                  />
                  <text x={mx} y={my} textAnchor="middle" dominantBaseline="central"
                    fontSize={isDouble ? 14 : 12} fontWeight={isDouble ? 800 : 600}
                    fill={isDouble ? "#c4b5fd" : "#64748b"}
                    style={{ pointerEvents: "none" }}
                  >
                    {h.num}
                  </text>
                  {isDouble && (
                    <circle cx={mx} cy={my} r={20} fill="#7c3aed" opacity="0.08" />
                  )}
                </g>
              );
            })}

            {/* Jupiter aspect rays — animated */}
            {jupiterAspects.map((aspect, i) => {
              const target = jupiterTargets[i];
              const jPos = planetPos(jupiterPos, r + 28);
              const tPos = planetPos(target, r - 12);
              return (
                <g key={`j-${aspect}`}>
                  <line
                    x1={jPos.x} y1={jPos.y} x2={tPos.x} y2={tPos.y}
                    stroke="url(#jGrad)" strokeWidth="2.5"
                    strokeDasharray="8 5"
                    opacity="0.6"
                    strokeLinecap="round"
                    className={animating ? "" : ""}
                  >
                    <animate attributeName="stroke-dashoffset" from="26" to="0" dur="2s" repeatCount="indefinite" />
                  </line>
                  <circle cx={tPos.x} cy={tPos.y} r={5} fill="#f97316" opacity="0.4" />
                </g>
              );
            })}

            {/* Saturn aspect rays — animated */}
            {saturnAspects.map((aspect, i) => {
              const target = saturnTargets[i];
              const sPos = planetPos(saturnPos, r + 28);
              const tPos = planetPos(target, r - 12);
              return (
                <g key={`s-${aspect}`}>
                  <line
                    x1={sPos.x} y1={sPos.y} x2={tPos.x} y2={tPos.y}
                    stroke="url(#sGrad)" strokeWidth="2.5"
                    strokeDasharray="5 5"
                    opacity="0.5"
                    strokeLinecap="round"
                  >
                    <animate attributeName="stroke-dashoffset" from="20" to="0" dur="2.5s" repeatCount="indefinite" />
                  </line>
                  <circle cx={tPos.x} cy={tPos.y} r={5} fill="#94a3b8" opacity="0.3" />
                </g>
              );
            })}

            {/* Jupiter node */}
            {(() => {
              const pos = planetPos(jupiterPos, r + 28);
              return (
                <g>
                  <circle cx={pos.x} cy={pos.y} r={20} fill="#1e293b" stroke="#f97316" strokeWidth="2.5" filter="url(#dtGlow)" />
                  <circle cx={pos.x} cy={pos.y} r={14} fill="url(#jGrad)" />
                  <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={900} fill="#fff">Ju</text>
                  <text x={pos.x} y={pos.y + 28} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fb923c">Jupiter</text>
                </g>
              );
            })()}

            {/* Saturn node */}
            {(() => {
              const pos = planetPos(saturnPos, r + 28);
              return (
                <g>
                  <circle cx={pos.x} cy={pos.y} r={20} fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" filter="url(#dtGlow)" />
                  <circle cx={pos.x} cy={pos.y} r={14} fill="url(#sGrad)" />
                  <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={900} fill="#fff">Sa</text>
                  <text x={pos.x} y={pos.y + 28} textAnchor="middle" fontSize={10} fontWeight={700} fill="#94a3b8">Saturn</text>
                </g>
              );
            })()}

            {/* Center hub */}
            <circle cx={cx} cy={cy} r={32} fill="#0f172a" stroke="#4f46e5" strokeWidth="2" />
            <circle cx={cx} cy={cy} r={26} fill="#1e293b" stroke="#6366f1" strokeWidth="1" />
            <text x={cx} y={cy - 3} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={800} fill="#a5b4fc">Double</text>
            <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central" fontSize={9} fill="#818cf8">Transit</text>
          </svg>
        </div>

        {/* Double-hit legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 relative z-10">
          {doubleHitHouses.length > 0 ? (
            <>
              <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <Crosshair className="w-3.5 h-3.5" />
                Double Hit: {doubleHitHouses.map(h => `H${h}`).join(", ")}
              </span>
              {doubleHitHouses.map(h => (
                <span key={h} className="text-[10px] font-bold px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  H{h} = {HOUSES[h-1].name}
                </span>
              ))}
            </>
          ) : (
            <span className="text-xs text-slate-500 italic">No double transit active with current positions.</span>
          )}
        </div>

        {/* Rule panel */}
        <div className="mt-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">The Rule</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-orange-400">Jupiter</strong> casts aspects on houses <strong className="text-orange-400">5, 7, 9</strong> from itself.
            <strong className="text-slate-400"> Saturn</strong> casts aspects on houses <strong className="text-slate-400">3, 7, 10</strong> from itself.
            When <strong className="text-violet-400">both aspect the same house</strong>, that house is caught in the "Crosshair" — the event window is open.
          </p>
        </div>
      </div>

      {/* House detail popup */}
      {selectedHouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedHouse(null)} />
          <div className="relative bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-6 w-full max-w-[340px] animate-in zoom-in-95 duration-200"
            style={{ borderColor: doubleHitHouses.includes(selectedHouse) ? "#7c3aed" : "#334155" }}>
            <button onClick={() => setSelectedHouse(null)} className="absolute right-4 top-4 p-2 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
            {(() => {
              const h = HOUSES[selectedHouse - 1];
              const isDouble = doubleHitHouses.includes(selectedHouse);
              const hasJ = jupiterTargets.includes(selectedHouse);
              const hasS = saturnTargets.includes(selectedHouse);
              return (
                <>
                  <div className="text-center mb-3">
                    <div className={`text-3xl font-extrabold ${isDouble ? "text-violet-400" : "text-slate-400"}`}>House {h.num}</div>
                    <div className="text-sm text-slate-500">{h.name}</div>
                  </div>
                  {isDouble ? (
                    <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-center">
                      <Crosshair className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                      <div className="text-sm font-bold text-violet-300">Double Transit Active!</div>
                      <div className="text-xs text-violet-400/70 mt-1">Both Jupiter and Saturn are influencing this house.</div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center">
                      <Eye className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                      <div className="text-xs text-slate-400">
                        {hasJ && <span className="text-orange-400">Jupiter aspects this house</span>}
                        {hasS && <span className="text-slate-400">Saturn aspects this house</span>}
                        {!hasJ && !hasS && <span>No planet aspects this house currently.</span>}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
