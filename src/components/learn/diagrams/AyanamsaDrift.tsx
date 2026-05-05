"use client";

import React, { useState } from "react";

interface EpochData {
  year: number;
  ayanamsa: string;
  label: string;
  description: string;
}

const EPOCHS: EpochData[] = [
  { year: 285, ayanamsa: "0°", label: "Alignment Era", description: "Tropical and Sidereal zodiacs were aligned." },
  { year: 1000, ayanamsa: "~15°", label: "Medieval Period", description: "Significant drift accumulated; Western and Vedic astrology diverged." },
  { year: 1500, ayanamsa: "~22°", label: "Renaissance", description: "Drift clearly visible; different ayanamsa systems emerged." },
  { year: 2025, ayanamsa: "~24°-25°", label: "Modern Era", description: "Current gap: Lahiri ~24.1°, Raman ~22.9°, Krishnamurti ~23.6°" },
  { year: 4000, ayanamsa: "~48°", label: "Far Future", description: "Projected drift if current precession rate continues." },
];

export default function AyanamsaDrift({ size = 520 }: { size?: number }) {
  const [selected, setSelected] = useState<EpochData | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const W = size;
  const H = size * 0.65;
  const padX = W * 0.08;
  const padY = H * 0.15;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const minYear = 0;
  const maxYear = 4000;
  const maxAya = 50;

  const toX = (year: number) => padX + ((year - minYear) / (maxYear - minYear)) * chartW;
  const toY = (deg: number) => padY + chartH - (deg / maxAya) * chartH;

  const points = EPOCHS.map((e) => `${toX(e.year)},${toY(parseFloat(e.ayanamsa.replace("~", "").replace("°", "")))}`).join(" ");

  return (
    <div className="relative select-none" style={{ maxWidth: size }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* Background */}
        <rect x={0} y={0} width={W} height={H} fill="#f8fafc" rx={12} />

        {/* Title */}
        <text x={W / 2} y={padY * 0.4} textAnchor="middle" fontSize={W * 0.035} fontWeight="700" fill="#1e293b">
          Axial Precession & Ayanamsa Drift
        </text>
        <text x={W / 2} y={padY * 0.7} textAnchor="middle" fontSize={W * 0.022} fill="#64748b">
          Tap an era to see the gap between Tropical and Sidereal zodiacs
        </text>

        {/* Grid lines */}
        {[0, 10, 20, 30, 40, 50].map((deg) => (
          <g key={deg}>
            <line x1={padX} y1={toY(deg)} x2={W - padX} y2={toY(deg)} stroke="#e2e8f0" strokeWidth={1} />
            <text x={padX - 8} y={toY(deg)} textAnchor="end" dominantBaseline="central" fontSize={W * 0.02} fill="#94a3b8">{deg}°</text>
          </g>
        ))}

        {/* X axis labels */}
        {[0, 1000, 2000, 3000, 4000].map((year) => (
          <text key={year} x={toX(year)} y={H - padY * 0.3} textAnchor="middle" fontSize={W * 0.02} fill="#94a3b8">{year === 0 ? "0 AD" : `${year} AD`}</text>
        ))}

        {/* Area under curve */}
        <polygon
          points={`${toX(0)},${toY(0)} ${points} ${toX(4000)},${toY(0)}`}
          fill="#06b6d4"
          opacity="0.08"
        />

        {/* Drift curve */}
        <polyline
          points={points}
          fill="none"
          stroke="#0891b2"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Epoch dots */}
        {EPOCHS.map((epoch, i) => {
          const x = toX(epoch.year);
          const y = toY(parseFloat(epoch.ayanamsa.replace("~", "").replace("°", "")));
          const isActive = selected?.year === epoch.year;
          const isHover = hovered === i;
          return (
            <g key={epoch.year} onClick={() => setSelected(epoch)} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              <circle cx={x} cy={y} r={isActive ? 10 : isHover ? 8 : 6} fill={isActive ? "#0891b2" : "#fff"} stroke="#0891b2" strokeWidth={2.5} />
              {(isActive || isHover) && (
                <text x={x} y={y - 16} textAnchor="middle" fontSize={W * 0.022} fontWeight="600" fill="#0891b2">{epoch.ayanamsa}</text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Info card */}
      {selected && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[90%] bg-white rounded-xl border border-cyan-200 shadow-lg p-4 z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-cyan-700">{selected.label}</span>
            <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">{selected.year === 0 ? "0 AD" : `${selected.year} AD`}</span>
          </div>
          <div className="text-lg font-extrabold text-cyan-800 mb-1">{selected.ayanamsa}</div>
          <p className="text-sm text-slate-600 leading-relaxed">{selected.description}</p>
          <button onClick={() => setSelected(null)} className="mt-2 text-xs text-cyan-500 hover:text-cyan-700 font-medium">Close</button>
        </div>
      )}
    </div>
  );
}
