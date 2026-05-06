"use client";

import React, { useState } from "react";
import { Target, Circle } from "lucide-react";

interface OrbData {
  planet: string;
  symbol: string;
  orb: number;
  color: string;
  description: string;
}

const ORBS: OrbData[] = [
  { planet: "Sun", symbol: "Su", orb: 15, color: "#f59e0b", description: "The brightest orb. Sun aspects with full 15° influence." },
  { planet: "Moon", symbol: "Mo", orb: 12, color: "#94a3b8", description: "The Moon's orb is 12° — reflective and responsive." },
  { planet: "Mars", symbol: "Ma", orb: 8, color: "#ef4444", description: "Mars penetrates with 8° of aggressive force." },
  { planet: "Mercury", symbol: "Me", orb: 7, color: "#22c55e", description: "Mercury's orb is 7° — precise and analytical." },
  { planet: "Jupiter", symbol: "Ju", orb: 9, color: "#f97316", description: "Jupiter expands with 9° of benevolent grace." },
  { planet: "Venus", symbol: "Ve", orb: 7, color: "#a855f7", description: "Venus harmonizes within 7° of magnetic attraction." },
  { planet: "Saturn", symbol: "Sa", orb: 9, color: "#475569", description: "Saturn constricts with 9° of heavy karmic weight." },
];

export default function OrbChart({ size = 640 }: { size?: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const maxOrb = Math.max(...ORBS.map(o => o.orb));

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-blue-50/30 to-sky-50/10 border border-indigo-200/40 shadow-2xl shadow-indigo-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-700">
            Deeptamsha (Orb of Influence)
          </h2>
          <p className="text-sm text-indigo-400 mt-2 font-medium">
            Each planet emits a specific orb of light — aspects only work within this range
          </p>
        </div>

        {/* Orb visualization */}
        <div className="relative w-full max-w-[400px] mx-auto aspect-square mb-5">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
              <filter id="orbGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>

            {/* Background grid circles */}
            {[5, 10, 15].map(r => (
              <circle key={r} cx={200} cy={200} r={r * 10} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            ))}

            {/* Concentric orb rings */}
            {ORBS.map((o, i) => {
              const isSelected = selected === i;
              const radius = (o.orb / maxOrb) * 140;
              return (
                <g key={i} onClick={() => setSelected(isSelected ? null : i)} className="cursor-pointer">
                  <circle
                    cx={200} cy={200} r={radius}
                    fill={`${o.color}10`}
                    stroke={o.color}
                    strokeWidth={isSelected ? 3 : 1.5}
                    opacity={isSelected ? 1 : 0.5}
                    filter={isSelected ? "url(#orbGlow)" : undefined}
                  />
                  {/* Planet label on ring */}
                  <text
                    x={200 + radius * 0.7}
                    y={200 - radius * 0.7}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={isSelected ? 14 : 11}
                    fontWeight={isSelected ? 800 : 600}
                    fill={o.color}
                  >
                    {o.symbol}
                  </text>
                  <text
                    x={200 + radius * 0.7}
                    y={200 - radius * 0.7 + 14}
                    textAnchor="middle"
                    fontSize={9}
                    fill={o.color}
                    opacity={0.7}
                  >
                    {o.orb}°
                  </text>
                </g>
              );
            })}

            {/* Center */}
            <circle cx={200} cy={200} r={8} fill="#4f46e5" />
            <text x={200} y={200 + 22} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">Aspect Point</text>
          </svg>
        </div>

        {/* Planet selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {ORBS.map((o, i) => (
            <button
              key={i}
              onClick={() => setSelected(isSelected => isSelected === i ? null : i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${selected === i ? "shadow-sm" : ""}`}
              style={{
                background: selected === i ? `${o.color}15` : "#fff",
                borderColor: selected === i ? o.color : "#e2e8f0",
                color: selected === i ? o.color : "#94a3b8",
              }}
            >
              <Circle className="w-3 h-3" style={{ color: o.color }} />
              {o.planet} ({o.orb}°)
            </button>
          ))}
        </div>

        {/* Selected detail */}
        {selected !== null && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-bold text-indigo-700">{ORBS[selected].planet} — {ORBS[selected].orb}° Orb</span>
            </div>
            <p className="text-xs text-gray-600">{ORBS[selected].description}</p>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(ORBS[selected].orb / maxOrb) * 100}%`, background: ORBS[selected].color }} />
            </div>
          </div>
        )}

        {/* Rule */}
        <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
          <p className="text-xs text-blue-700">
            <strong>Rule:</strong> When two planets are within the average of their orbs, an aspect exists.
            Beyond that distance, the connection is dead — even if they are in aspecting signs.
          </p>
        </div>
      </div>
    </div>
  );
}
