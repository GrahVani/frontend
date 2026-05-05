"use client";

import React, { useState } from "react";

interface AspectData {
  planet: string;
  sanskrit: string;
  color: string;
  aspects: number[];
  special?: string;
  description: string;
}

const ASPECTS: AspectData[] = [
  {
    planet: "Sun",
    sanskrit: "Surya",
    color: "#f59e0b",
    aspects: [7],
    description: "The Sun casts its full 7th aspect. It illuminates the house opposite, bringing authority and visibility to that domain.",
  },
  {
    planet: "Moon",
    sanskrit: "Chandra",
    color: "#94a3b8",
    aspects: [7],
    description: "The Moon's 7th aspect brings emotional connection and nurturing energy to the opposite house.",
  },
  {
    planet: "Mercury",
    sanskrit: "Budha",
    color: "#10b981",
    aspects: [7],
    description: "Mercury's 7th aspect brings analytical and communicative energy to the opposite house.",
  },
  {
    planet: "Venus",
    sanskrit: "Shukra",
    color: "#ec4899",
    aspects: [7],
    description: "Venus's 7th aspect brings harmony, beauty, and relationship energy to the opposite house.",
  },
  {
    planet: "Mars",
    sanskrit: "Mangala",
    color: "#dc2626",
    aspects: [4, 7, 8],
    special: "4th, 7th & 8th",
    description: "Mars is the warrior — it casts special aspects on the 4th, 7th, and 8th houses, bringing aggression and drive.",
  },
  {
    planet: "Jupiter",
    sanskrit: "Guru",
    color: "#f97316",
    aspects: [5, 7, 9],
    special: "5th, 7th & 9th",
    description: "Jupiter, the great benefic, blesses the 5th, 7th, and 9th houses with wisdom, expansion, and fortune.",
  },
  {
    planet: "Saturn",
    sanskrit: "Shani",
    color: "#475569",
    aspects: [3, 7, 10],
    special: "3rd, 7th & 10th",
    description: "Saturn, the great malefic, casts its restrictive gaze on the 3rd, 7th, and 10th houses, bringing discipline and delay.",
  },
  {
    planet: "Rahu",
    sanskrit: "Rahu",
    color: "#7c3aed",
    aspects: [5, 7, 9],
    special: "5th, 7th & 9th",
    description: "Rahu (the North Node) mimics Jupiter's aspects, casting illusion and obsession on the 5th, 7th, and 9th.",
  },
  {
    planet: "Ketu",
    sanskrit: "Ketu",
    color: "#0891b2",
    aspects: [5, 7, 9],
    special: "5th, 7th & 9th",
    description: "Ketu (the South Node) also mimics Jupiter, bringing detachment and spiritual insight to the 5th, 7th, and 9th.",
  },
];

export default function DrishtiChart({ size = 520 }: { size?: number }) {
  const [selected, setSelected] = useState<AspectData | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const W = size;
  const H = size * 0.75;
  const cx = W / 2;
  const cy = H * 0.42;
  const r = W * 0.28;

  const houseAngles = Array.from({ length: 12 }, (_, i) => (i * 30 - 90) * (Math.PI / 180));

  return (
    <div className="relative select-none" style={{ maxWidth: size }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <rect x={0} y={0} width={W} height={H} fill="#f8fafc" rx={12} />

        {/* Title */}
        <text x={W / 2} y={H * 0.07} textAnchor="middle" fontSize={W * 0.032} fontWeight="700" fill="#1e293b">
          Planetary Aspects (Drishti)
        </text>
        <text x={W / 2} y={H * 0.12} textAnchor="middle" fontSize={W * 0.02} fill="#64748b">
          Tap a planet to see which houses it aspects
        </text>

        {/* Houses */}
        {houseAngles.map((angle, i) => {
          const x1 = cx + Math.cos(angle) * (r - 8);
          const y1 = cy + Math.sin(angle) * (r - 8);
          const x2 = cx + Math.cos(angle) * (r + 18);
          const y2 = cy + Math.sin(angle) * (r + 18);
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={x1} y2={y1} stroke="#e2e8f0" strokeWidth={1.5} />
              <text x={x2} y={y2} textAnchor="middle" dominantBaseline="central" fontSize={W * 0.022} fontWeight="600" fill="#94a3b8">{i + 1}</text>
            </g>
          );
        })}

        {/* Center circle */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#cbd5e1" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={6} fill="#e2e8f0" />

        {/* Planet dots around the chart */}
        {ASPECTS.map((a, i) => {
          const angle = (i * 40 - 90) * (Math.PI / 180);
          const px = cx + Math.cos(angle) * (r + 44);
          const py = cy + Math.sin(angle) * (r + 44);
          const isActive = selected?.planet === a.planet;
          const isHover = hovered === a.planet;

          return (
            <g
              key={a.planet}
              onClick={() => setSelected(a)}
              onMouseEnter={() => setHovered(a.planet)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <circle cx={px} cy={py} r={isActive ? 18 : isHover ? 16 : 14} fill={a.color} opacity={isActive ? 1 : 0.9} />
              <text x={px} y={py} textAnchor="middle" dominantBaseline="central" fontSize={isActive ? 10 : 9} fontWeight="700" fill="#fff">
                {a.planet[0]}
              </text>
              {(isActive || isHover) && (
                <text x={px} y={py + 24} textAnchor="middle" fontSize={W * 0.02} fontWeight="600" fill={a.color}>
                  {a.planet}
                </text>
              )}

              {/* Aspect rays for active planet */}
              {isActive && a.aspects.map((houseNum) => {
                const houseAngle = ((houseNum - 1) * 30 - 90) * (Math.PI / 180);
                const hx = cx + Math.cos(houseAngle) * (r - 4);
                const hy = cy + Math.sin(houseAngle) * (r - 4);
                return (
                  <line
                    key={houseNum}
                    x1={px}
                    y1={py}
                    x2={hx}
                    y2={hy}
                    stroke={a.color}
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    opacity={0.6}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Legend */}
        <text x={W * 0.05} y={H * 0.88} fontSize={W * 0.018} fill="#64748b" fontWeight="600">
          Special Aspects:
        </text>
        <text x={W * 0.05} y={H * 0.93} fontSize={W * 0.016} fill="#94a3b8">
          Mars → 4, 7, 8  |  Jupiter → 5, 7, 9  |  Saturn → 3, 7, 10  |  Rahu/Ketu → 5, 7, 9
        </text>
        <text x={W * 0.05} y={H * 0.97} fontSize={W * 0.016} fill="#94a3b8">
          All others cast only the 7th aspect
        </text>
      </svg>

      {/* Info card */}
      {selected && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[92%] bg-white rounded-xl border shadow-lg p-4 z-10" style={{ borderColor: selected.color }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selected.color }} />
              <span className="text-sm font-bold" style={{ color: selected.color }}>{selected.planet} <span className="text-xs font-normal text-slate-400">({selected.sanskrit})</span></span>
            </div>
            {selected.special && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: selected.color }}>{selected.special}</span>
            )}
            {!selected.special && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">7th only</span>
            )}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{selected.description}</p>
          <button onClick={() => setSelected(null)} className="mt-2 text-xs font-medium hover:underline" style={{ color: selected.color }}>Close</button>
        </div>
      )}
    </div>
  );
}
