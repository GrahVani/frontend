"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AspectData {
  planet: string;
  sanskrit: string;
  color: string;
  bg: string;
  aspects: number[];
  special?: string;
  description: string;
}

const ASPECTS: AspectData[] = [
  { planet: "Sun", sanskrit: "Surya", color: "#f59e0b", bg: "#fffbeb", aspects: [7], description: "The Sun casts its full 7th aspect, bringing authority and visibility to the opposite house." },
  { planet: "Moon", sanskrit: "Chandra", color: "#94a3b8", bg: "#f8fafc", aspects: [7], description: "The Moon's 7th aspect brings emotional connection and nurturing energy to the opposite house." },
  { planet: "Mercury", sanskrit: "Budha", color: "#10b981", bg: "#ecfdf5", aspects: [7], description: "Mercury's 7th aspect brings analytical and communicative energy to the opposite house." },
  { planet: "Venus", sanskrit: "Shukra", color: "#ec4899", bg: "#fdf2f8", aspects: [7], description: "Venus's 7th aspect brings harmony, beauty, and relationship energy to the opposite house." },
  { planet: "Mars", sanskrit: "Mangala", color: "#ef4444", bg: "#fef2f2", aspects: [4, 7, 8], special: "4th, 7th & 8th", description: "Mars is the warrior — it casts special aspects on the 4th, 7th, and 8th houses, bringing aggression and drive." },
  { planet: "Jupiter", sanskrit: "Guru", color: "#f97316", bg: "#fff7ed", aspects: [5, 7, 9], special: "5th, 7th & 9th", description: "Jupiter, the great benefic, blesses the 5th, 7th, and 9th houses with wisdom, expansion, and fortune." },
  { planet: "Saturn", sanskrit: "Shani", color: "#475569", bg: "#f1f5f9", aspects: [3, 7, 10], special: "3rd, 7th & 10th", description: "Saturn, the great malefic, casts its restrictive gaze on the 3rd, 7th, and 10th houses, bringing discipline and delay." },
  { planet: "Rahu", sanskrit: "Rahu", color: "#7c3aed", bg: "#f5f3ff", aspects: [5, 7, 9], special: "5th, 7th & 9th", description: "Rahu (the North Node) mimics Jupiter's aspects, casting illusion and obsession on the 5th, 7th, and 9th." },
  { planet: "Ketu", sanskrit: "Ketu", color: "#0891b2", bg: "#f0fdfa", aspects: [], special: undefined, description: "Ketu (the South Node) has no head — therefore blind. It casts NO Drishti. This is the exception every student must memorize." },
];

export default function DrishtiChart({ size = 600 }: { size?: number }) {
  const [selected, setSelected] = useState<AspectData | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const W = size;
  const H = size * 0.92;
  const cx = W / 2;
  const cy = H * 0.40;
  const r = W * 0.26;

  const houseAngles = Array.from({ length: 12 }, (_, i) => (i * 30 - 90) * (Math.PI / 180));

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-[#fdfcfa] via-[#eef2ff] to-[#e0e7ff] border border-indigo-200/50 shadow-xl shadow-indigo-900/5 p-5 sm:p-7">
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 tracking-tight">Planetary Aspects (Drishti)</h2>
          <p className="text-xs sm:text-sm text-indigo-500/80 mt-1">Tap a planet to see which houses it aspects</p>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          <defs>
            <filter id="dcShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="5" floodOpacity="0.08" />
            </filter>
            <linearGradient id="dcGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e7ff" />
              <stop offset="100%" stopColor="#c7d2fe" />
            </linearGradient>
          </defs>

          {/* Background glow */}
          <circle cx={cx} cy={cy} r={r + 40} fill="url(#dcGlow)" opacity="0.4" />

          {/* House segments (glass-like wedges) */}
          {houseAngles.map((angle, i) => {
            const nextAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);
            const x1 = cx + Math.cos(angle) * r;
            const y1 = cy + Math.sin(angle) * r;
            const x2 = cx + Math.cos(nextAngle) * r;
            const y2 = cy + Math.sin(nextAngle) * r;
            const lx1 = cx + Math.cos(angle) * (r + 22);
            const ly1 = cy + Math.sin(angle) * (r + 22);
            const lx2 = cx + Math.cos(nextAngle) * (r + 22);
            const ly2 = cy + Math.sin(nextAngle) * (r + 22);
            const midAngleDeg = i * 30;
            const isKendra = [0, 3, 6, 9].includes(i);
            const isTrikona = [0, 4, 8].includes(i);
            const fillColor = isKendra ? "#e0e7ff" : isTrikona ? "#dbeafe" : "#f8fafc";

            return (
              <g key={i}>
                <path
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                  fill={fillColor}
                  stroke="#c7d2fe"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <line x1={cx} y1={cy} x2={x1} y2={y1} stroke="#c7d2fe" strokeWidth="1.5" />
                {/* House number */}
                <text
                  x={(lx1 + lx2) / 2}
                  y={(ly1 + ly2) / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={W * 0.022}
                  fontWeight="700"
                  fill={isKendra ? "#4f46e5" : isTrikona ? "#0891b2" : "#94a3b8"}
                >
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* Center circle */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#a5b4fc" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={r * 0.55} fill="#fff" stroke="#c7d2fe" strokeWidth="1.5" opacity="0.8" />
          <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="central" fontSize={W * 0.028} fontWeight="700" fill="#6366f1">12 Houses</text>
          <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central" fontSize={W * 0.018} fill="#818cf8">Drishti Sight</text>

          {/* Planet nodes around the chart */}
          {ASPECTS.map((a, i) => {
            const angleDeg = i * 40;
            const angle = (angleDeg - 90) * (Math.PI / 180);
            const px = cx + Math.cos(angle) * (r + 52);
            const py = cy + Math.sin(angle) * (r + 52);
            const isActive = selected?.planet === a.planet;
            const isHover = hovered === a.planet;
            const pr = isActive ? 22 : isHover ? 20 : 18;

            return (
              <g
                key={a.planet}
                onClick={() => setSelected(a)}
                onMouseEnter={() => setHovered(a.planet)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                {/* Glow on active/hover */}
                {(isActive || isHover) && (
                  <circle cx={px} cy={py} r={pr + 10} fill={a.color} opacity="0.12" />
                )}

                {/* Planet circle */}
                <circle
                  cx={px}
                  cy={py}
                  r={pr}
                  fill={isActive ? a.color : "#fff"}
                  stroke={a.color}
                  strokeWidth={isActive ? 3 : 2.5}
                  filter="url(#dcShadow)"
                  className="transition-all duration-200"
                />

                {/* Planet initial */}
                <text
                  x={px}
                  y={py}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isActive ? 14 : 12}
                  fontWeight="800"
                  fill={isActive ? "#fff" : a.color}
                >
                  {a.planet[0]}
                </text>

                {/* Planet name on hover/active */}
                {(isActive || isHover) && (
                  <>
                    <text x={px} y={py + pr + 14} textAnchor="middle" fontSize={W * 0.02} fontWeight="700" fill={a.color}>
                      {a.planet}
                    </text>
                    <text x={px} y={py + pr + 28} textAnchor="middle" fontSize={W * 0.016} fill="#94a3b8">
                      {a.sanskrit}
                    </text>
                  </>
                )}

                {/* Aspect rays for active planet */}
                {isActive && a.aspects.map((houseNum) => {
                  const houseAngle = ((houseNum - 1) * 30 - 90) * (Math.PI / 180);
                  const hx = cx + Math.cos(houseAngle) * (r - 6);
                  const hy = cy + Math.sin(houseAngle) * (r - 6);
                  return (
                    <g key={houseNum}>
                      <line
                        x1={px}
                        y1={py}
                        x2={hx}
                        y2={hy}
                        stroke={a.color}
                        strokeWidth={2.5}
                        strokeDasharray="5 4"
                        opacity={0.5}
                        strokeLinecap="round"
                      />
                      {/* Glow dot at house */}
                      <circle cx={hx} cy={hy} r={5} fill={a.color} opacity="0.4" />
                      <text x={hx} y={hy - 10} textAnchor="middle" fontSize={10} fontWeight="700" fill={a.color}>
                        {houseNum}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-100 p-4">
          <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2">Special Aspects</h4>
          <div className="flex flex-wrap gap-2">
            {ASPECTS.filter(a => a.special).map((a) => (
              <button
                key={a.planet}
                onClick={() => setSelected(selected?.planet === a.planet ? null : a)}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-200"
                style={{
                  background: selected?.planet === a.planet ? a.bg : "#fff",
                  color: a.color,
                  borderColor: selected?.planet === a.planet ? a.color : "#e2e8f0",
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                {a.planet} → {a.special?.replace("th", "").replace("rd", "").replace("nd", "").replace(" & ", ", ")}
              </button>
            ))}
            <span className="text-[11px] text-gray-400 px-2 py-1">All others cast only the 7th aspect</span>
          </div>
        </div>
      </div>

      {/* Info card */}
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center z-20 p-3">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl border-2 shadow-2xl p-5 w-full max-w-[380px] animate-in zoom-in-95 duration-200" style={{ borderColor: selected.color }}>
            <button onClick={() => setSelected(null)} className="absolute right-3 top-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm" style={{ background: selected.color }}>
                {selected.planet[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selected.planet}</h3>
                <p className="text-sm font-medium" style={{ color: selected.color }}>{selected.sanskrit} · {selected.aspects.length === 0 ? "No Aspects" : selected.special || "7th Aspect Only"}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-3">{selected.description}</p>

            <div className="flex flex-wrap gap-1.5">
              {selected.aspects.map((h) => (
                <span key={h} className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ background: selected.color }}>
                  {h}{h === 1 ? "st" : h === 2 ? "nd" : h === 3 ? "rd" : "th"} House
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
