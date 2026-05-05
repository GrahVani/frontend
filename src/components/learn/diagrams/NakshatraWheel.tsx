"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

const NAKSHATRAS = [
  { name: "Ashwini", ruler: "Ketu", symbol: "🐎", start: 0 },
  { name: "Bharani", ruler: "Venus", symbol: "⚖", start: 13.33 },
  { name: "Krittika", ruler: "Sun", symbol: "🔥", start: 26.66 },
  { name: "Rohini", ruler: "Moon", symbol: "🛞", start: 40 },
  { name: "Mrigashira", ruler: "Mars", symbol: "🦌", start: 53.33 },
  { name: "Ardra", ruler: "Rahu", symbol: "💧", start: 66.66 },
  { name: "Punarvasu", ruler: "Jupiter", symbol: "🏹", start: 80 },
  { name: "Pushya", ruler: "Saturn", symbol: "🌸", start: 93.33 },
  { name: "Ashlesha", ruler: "Mercury", symbol: "🐍", start: 106.66 },
  { name: "Magha", ruler: "Ketu", symbol: "👑", start: 120 },
  { name: "Purva Phalguni", ruler: "Venus", symbol: "🛏", start: 133.33 },
  { name: "Uttara Phalguni", ruler: "Sun", symbol: "🛏", start: 146.66 },
  { name: "Hasta", ruler: "Moon", symbol: "✋", start: 160 },
  { name: "Chitra", ruler: "Mars", symbol: "💎", start: 173.33 },
  { name: "Swati", ruler: "Rahu", symbol: "🌬", start: 186.66 },
  { name: "Vishakha", ruler: "Jupiter", symbol: "🏹", start: 200 },
  { name: "Anuradha", ruler: "Saturn", symbol: "🌂", start: 213.33 },
  { name: "Jyeshtha", ruler: "Mercury", symbol: "🦂", start: 226.66 },
  { name: "Mula", ruler: "Ketu", symbol: "🌿", start: 240 },
  { name: "Purva Ashadha", ruler: "Venus", symbol: "🐘", start: 253.33 },
  { name: "Uttara Ashadha", ruler: "Sun", symbol: "🐘", start: 266.66 },
  { name: "Shravana", ruler: "Moon", symbol: "👂", start: 280 },
  { name: "Dhanishta", ruler: "Mars", symbol: "🥁", start: 293.33 },
  { name: "Shatabhisha", ruler: "Rahu", symbol: "💯", start: 306.66 },
  { name: "Purva Bhadrapada", ruler: "Jupiter", symbol: "🛏", start: 320 },
  { name: "Uttara Bhadrapada", ruler: "Saturn", symbol: "🐂", start: 333.33 },
  { name: "Revati", ruler: "Mercury", symbol: "🐟", start: 346.66 },
];

const RULER_COLORS: Record<string, string> = {
  Ketu: "#64748b", Venus: "#ec4899", Sun: "#f59e0b", Moon: "#94a3b8",
  Mars: "#ef4444", Rahu: "#7c3aed", Jupiter: "#f97316", Saturn: "#6366f1", Mercury: "#10b981",
};

export default function NakshatraWheel({ size = 520 }: { size?: number }) {
  const [selected, setSelected] = useState<(typeof NAKSHATRAS)[0] | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.4;
  const innerR = size * 0.18;

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  return (
    <div className="relative w-full max-w-[640px] mx-auto select-none">
      {/* Modern card container */}
      <div className="rounded-3xl bg-gradient-to-br from-[#fdfcfa] to-[#f5f2ee] border border-amber-100/80 shadow-lg shadow-amber-900/5 p-4 sm:p-6">
        {/* Title */}
        <div className="text-center mb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-600 tracking-tight">Nakshatras & The 108 Padas</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">27 Nakshatras × 4 Padas = 108 Micro-Divisions</p>
        </div>

        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
          <defs>
            <filter id="nwShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1" />
            </filter>
          </defs>

          <circle cx={cx} cy={cy} r={outerR + 2} fill="none" stroke="#d4a373" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={outerR} fill="#fffbeb" stroke="#d4a373" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={innerR} fill="#fff" stroke="#d4a373" strokeWidth="1.5" />

          {/* 27 segments */}
          {NAKSHATRAS.map((n, i) => {
            const startAngle = (i * 360) / 27;
            const endAngle = ((i + 1) * 360) / 27;
            const midAngle = startAngle + 180 / 27;
            const start = polarToCartesian(endAngle, outerR);
            const end = polarToCartesian(startAngle, outerR);
            const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
            const path = `M ${cx} ${cy} L ${start.x} ${start.y} A ${outerR} ${outerR} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
            const labelPos = polarToCartesian(midAngle, (outerR + innerR) / 2);
            const isHovered = hovered === i;
            const isSelected = selected?.name === n.name;
            const rColor = RULER_COLORS[n.ruler] || "#d97706";

            return (
              <g key={n.name}>
                <path
                  d={path}
                  fill={isHovered || isSelected ? `${rColor}15` : (i % 2 === 0 ? "#fef3c7" : "transparent")}
                  stroke={isHovered || isSelected ? rColor : "#e5e7eb"}
                  strokeWidth={isHovered || isSelected ? 2 : 0.5}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(n)}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={size * 0.018}
                  fontWeight="600"
                  fill={isHovered || isSelected ? rColor : "#78350f"}
                  style={{ pointerEvents: "none" }}
                >
                  {n.symbol}
                </text>
              </g>
            );
          })}

          {/* Center */}
          <circle cx={cx} cy={cy} r={innerR - 4} fill="#fff" stroke="#d4a373" strokeWidth="1" />
          <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.042} fontWeight="800" fill="#d97706">27 × 4 = 108</text>
          <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.026} fill="#a16207">Padas</text>
        </svg>

        {/* Info cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <h4 className="text-xs font-bold text-amber-600 mb-1">The 2.25 Rule</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">27 Nakshatras fit into 12 Rashis. Each Rashi contains exactly 2.25 Nakshatras.</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <h4 className="text-xs font-bold text-amber-600 mb-1">Navamsha Link</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">108 Padas = 108 Navamshas. Each Pada maps to exactly one D-9 division sign.</p>
          </div>
        </div>
      </div>

      {selected && (
        <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl border shadow-2xl p-5 w-full max-w-[300px] animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelected(null)} className="absolute right-3 top-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
            <div className="text-center mb-3">
              <span className="text-3xl">{selected.symbol}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">{selected.name}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg"><span className="text-xs font-semibold text-gray-500">Ruler</span><span className="text-sm font-bold" style={{ color: RULER_COLORS[selected.ruler] || "#d97706" }}>{selected.ruler}</span></div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg"><span className="text-xs font-semibold text-gray-500">Start</span><span className="text-sm font-bold text-gray-700">{selected.start}°</span></div>
            </div>
          </div>
        </div>
      )}

      {hovered !== null && !selected && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg pointer-events-none animate-in fade-in duration-150">
          {NAKSHATRAS[hovered].name} · {NAKSHATRAS[hovered].ruler}
        </div>
      )}
    </div>
  );
}
