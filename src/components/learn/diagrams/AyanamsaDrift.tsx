"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface EpochData {
  year: number;
  label: string;
  ayanamsa: string;
  ayaNum: number;
  description: string;
}

const EPOCHS: EpochData[] = [
  { year: 285, label: "Alignment Era", ayanamsa: "0°", ayaNum: 0, description: "Tropical and Sidereal zodiacs were perfectly aligned. The vernal equinox marked 0° Aries in both systems." },
  { year: 1000, label: "Medieval Period", ayanamsa: "~15°", ayaNum: 15, description: "Significant drift accumulated. Western and Vedic astrology began diverging visibly in their calculations." },
  { year: 1500, label: "Renaissance", ayanamsa: "~22°", ayaNum: 22, description: "The drift was clearly visible. Different ayanamsa systems (Lahiri, Raman, Krishnamurti) emerged to handle the gap." },
  { year: 2025, label: "Modern Era", ayanamsa: "~24°-25°", ayaNum: 24.5, description: "Current gap: Lahiri ~24.1°, Raman ~22.9°, Krishnamurti ~23.6°. Software must subtract this offset from Tropical coordinates." },
  { year: 4000, label: "Far Future", ayanamsa: "~48°", ayaNum: 48, description: "Projected drift if current precession rate (~50 arc-seconds/year) continues. Entire signs will have shifted." },
];

export default function AyanamsaDrift({ size = 600 }: { size?: number }) {
  const [selected, setSelected] = useState<EpochData | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const W = size;
  const H = size * 0.70;
  const padX = W * 0.07;
  const padY = H * 0.16;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const minYear = 0;
  const maxYear = 4000;
  const maxAya = 55;

  const toX = (year: number) => padX + ((year - minYear) / (maxYear - minYear)) * chartW;
  const toY = (deg: number) => padY + chartH - (deg / maxAya) * chartH;

  const points = EPOCHS.map((e) => `${toX(e.year)},${toY(e.ayaNum)}`).join(" ");

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-[#fdfcfa] via-[#ecfeff] to-[#cffafe] border border-cyan-200/50 shadow-xl shadow-cyan-900/5 p-5 sm:p-7">
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-cyan-700 tracking-tight">Axial Precession & Ayanamsa Drift</h2>
          <p className="text-xs sm:text-sm text-cyan-500/80 mt-1">Tap any era to see the gap between Tropical and Sidereal zodiacs</p>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          <defs>
            <filter id="adShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.08" />
            </filter>
            <linearGradient id="adArea" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="adLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* Background glow */}
          <rect x={padX} y={padY} width={chartW} height={chartH} rx={12} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

          {/* Grid lines */}
          {[0, 10, 20, 30, 40, 50].map((deg) => (
            <g key={deg}>
              <line x1={padX} y1={toY(deg)} x2={W - padX} y2={toY(deg)} stroke="#e2e8f0" strokeWidth={1} />
              <text x={padX - 10} y={toY(deg)} textAnchor="end" dominantBaseline="central" fontSize={W * 0.018} fill="#94a3b8" fontWeight="600">{deg}°</text>
            </g>
          ))}

          {/* X axis labels */}
          {[0, 1000, 2000, 3000, 4000].map((year) => (
            <text key={year} x={toX(year)} y={H - padY * 0.25} textAnchor="middle" fontSize={W * 0.018} fill="#94a3b8" fontWeight="600">
              {year === 0 ? "0 AD" : `${year} AD`}
            </text>
          ))}

          {/* Axis labels */}
          <text x={padX} y={padY * 0.45} fontSize={W * 0.02} fontWeight="700" fill="#0891b2">Ayanamsa (degrees)</text>
          <text x={W - padX} y={H - padY * 0.55} textAnchor="end" fontSize={W * 0.02} fontWeight="700" fill="#0891b2">Year (AD)</text>

          {/* Area under curve */}
          <polygon points={`${toX(0)},${toY(0)} ${points} ${toX(4000)},${toY(0)}`} fill="url(#adArea)" />

          {/* Drift curve */}
          <polyline points={points} fill="none" stroke="url(#adLine)" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" filter="url(#adShadow)" />

          {/* Glow line */}
          <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity="0.15" />

          {/* Epoch dots */}
          {EPOCHS.map((epoch, i) => {
            const x = toX(epoch.year);
            const y = toY(epoch.ayaNum);
            const isActive = selected?.year === epoch.year;
            const isHover = hovered === i;
            return (
              <g key={epoch.year} onClick={() => setSelected(epoch)} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                {/* Outer glow */}
                {(isActive || isHover) && (
                  <circle cx={x} cy={y} r={14} fill="#06b6d4" opacity="0.15" />
                )}
                <circle cx={x} cy={y} r={isActive ? 9 : isHover ? 7 : 5} fill={isActive ? "#0891b2" : "#fff"} stroke="#0891b2" strokeWidth={2.5} />
                {/* Year label on hover/active */}
                {(isActive || isHover) && (
                  <g>
                    <rect x={x - 30} y={y - 38} width={60} height={22} rx={6} fill="#0891b2" opacity="0.95" />
                    <text x={x} y={y - 26} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="700" fill="#fff">{epoch.ayanamsa}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Timeline bar below */}
        <div className="mt-4 flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-xl border border-cyan-100 p-3">
          {EPOCHS.map((e, i) => (
            <button
              key={e.year}
              onClick={() => setSelected(selected?.year === e.year ? null : e)}
              className="flex flex-col items-center gap-1 transition-all duration-200"
            >
              <div
                className={`w-3 h-3 rounded-full transition-all ${selected?.year === e.year ? "scale-125" : ""}`}
                style={{ background: selected?.year === e.year ? "#0891b2" : "#cbd5e1" }}
              />
              <span className={`text-[10px] font-semibold ${selected?.year === e.year ? "text-cyan-700" : "text-gray-400"}`}>
                {e.year === 0 ? "0 AD" : `${e.year}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Info card */}
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center z-20 p-3">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl border-2 shadow-2xl p-5 w-full max-w-[380px] animate-in zoom-in-95 duration-200" style={{ borderColor: "#0891b2" }}>
            <button onClick={() => setSelected(null)} className="absolute right-3 top-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-cyan-700">{selected.label}</span>
              <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">{selected.year === 0 ? "0 AD" : `${selected.year} AD`}</span>
            </div>
            <div className="text-3xl font-extrabold text-cyan-800 mb-2">{selected.ayanamsa}</div>
            <p className="text-sm text-slate-600 leading-relaxed">{selected.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
