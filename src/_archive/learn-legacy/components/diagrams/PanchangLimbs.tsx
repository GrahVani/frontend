"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface LimbData {
  id: string;
  name: string;
  sanskrit: string;
  icon: string;
  color: string;
  light: string;
  border: string;
  description: string;
  computation: string;
  significance: string;
  angle: number; // degrees around the circle
}

const LIMBS: LimbData[] = [
  {
    id: "tithi",
    name: "Tithi",
    sanskrit: "तिथि",
    icon: "🌙",
    color: "#d97706",
    light: "#fef3c7",
    border: "#fed7aa",
    description: "The lunar day — one of 30 divisions of the synodic month. Governs emotional and mental states, and determines auspiciousness for activities.",
    computation: "(Moon Longitude − Sun Longitude) ÷ 12°",
    significance: "30 Tithis cycle (15 bright + 15 dark). Shukla Paksha = waxing, Krishna Paksha = waning.",
    angle: 270,
  },
  {
    id: "var",
    name: "Vara",
    sanskrit: "वार",
    icon: "☀️",
    color: "#dc2626",
    light: "#fee2e2",
    border: "#fecaca",
    description: "The weekday — ruled by one of the 7 planets. Determines daily energy and activity suitability.",
    computation: "Sunrise-to-sunrise day ruled by the planet of the hour at sunrise.",
    significance: "7 days: Surya (Sun), Chandra (Mon), Mangala (Tue), Budha (Wed), Guru (Thu), Shukra (Fri), Shani (Sat).",
    angle: 342,
  },
  {
    id: "nakshatra",
    name: "Nakshatra",
    sanskrit: "नक्षत्र",
    icon: "⭐",
    color: "#7c3aed",
    light: "#ede9fe",
    border: "#ddd6fe",
    description: "The lunar mansion — Moon's position in one of 27 star constellations. Governs the psyche and nature.",
    computation: "Moon Longitude ÷ 13° 20′",
    significance: "27 Nakshatras × 4 Padas = 108 divisions. Each Pada maps to a Navamsha sign.",
    angle: 54,
  },
  {
    id: "yoga",
    name: "Yoga",
    sanskrit: "योग",
    icon: "🧘",
    color: "#059669",
    light: "#d1fae5",
    border: "#a7f3d0",
    description: "The union — angle sum of Sun + Moon determines 27 yogas. Governs the overall auspiciousness of the moment.",
    computation: "(Sun Longitude + Moon Longitude) ÷ 13° 20′",
    significance: "27 Yogas from Vishkambha to Vaidhriti. Benefic yogas = good for beginnings; Malefic = avoid.",
    angle: 126,
  },
  {
    id: "karana",
    name: "Karana",
    sanskrit: "करण",
    icon: "⚔️",
    color: "#0891b2",
    light: "#cffafe",
    border: "#a5f3fc",
    description: "The half-tithi — 11 karanas rotate. Determines the 'how' of actions and deeds.",
    computation: "(Moon Longitude − Sun Longitude) ÷ 6°",
    significance: "7 Chara (movable) + 4 Sthira (fixed) = 11 Karanas. Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti, Shakuni, Chatushpada, Naga, Kimstughna.",
    angle: 198,
  },
];

export default function PanchangLimbs({ size = 560 }: { size?: number }) {
  const [selected, setSelected] = useState<LimbData | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const W = size;
  const H = size * 0.88;
  const cx = W / 2;
  const cy = H * 0.42;
  const hubR = W * 0.13;
  const nodeR = W * 0.09;
  const orbitR = W * 0.30;

  const polar = (angleDeg: number, radius: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  return (
    <div className="relative w-full max-w-[640px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-[#fdfcfa] via-[#fff7ed] to-[#ffedd5] border border-orange-200/60 shadow-xl shadow-orange-900/5 p-5 sm:p-7">
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-orange-700 tracking-tight">The Panchang — Five Limbs of Time</h2>
          <p className="text-xs sm:text-sm text-orange-500/80 mt-1">Tap any limb to explore its computation, significance, and role in Vedic timing</p>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          <defs>
            <filter id="plShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="6" floodOpacity="0.1" />
            </filter>
            <linearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#fff7ed" />
            </linearGradient>
          </defs>

          {/* Decorative orbit ring */}
          <circle cx={cx} cy={cy} r={orbitR} fill="none" stroke="#fed7aa" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
          <circle cx={cx} cy={cy} r={orbitR - 8} fill="none" stroke="#fed7aa" strokeWidth="1" opacity="0.3" />

          {/* Connection lines from hub to each limb */}
          {LIMBS.map((limb) => {
            const pos = polar(limb.angle, orbitR);
            return (
              <line
                key={`line-${limb.id}`}
                x1={cx}
                y1={cy}
                x2={pos.x}
                y2={pos.y}
                stroke={limb.color}
                strokeWidth={hovered === limb.id || selected?.id === limb.id ? 2.5 : 1.5}
                opacity={hovered === limb.id || selected?.id === limb.id ? 0.5 : 0.2}
                strokeDasharray="4 3"
                className="transition-all duration-300"
              />
            );
          })}

          {/* Hub circle */}
          <circle cx={cx} cy={cy} r={hubR} fill="url(#hubGrad)" stroke="#f97316" strokeWidth="2.5" filter="url(#plShadow)" />
          <circle cx={cx} cy={cy} r={hubR - 6} fill="none" stroke="#fed7aa" strokeWidth="1" strokeDasharray="4 2" />
          <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central" fontSize={W * 0.035} fontWeight="800" fill="#c2410c">पञ्चाङ्ग</text>
          <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central" fontSize={W * 0.018} fill="#9a3412" fontWeight="600">Panchang</text>
          <text x={cx} y={cy + 26} textAnchor="middle" dominantBaseline="central" fontSize={W * 0.013} fill="#c2410c" opacity="0.6">5 Limbs of Time</text>

          {/* Limb nodes */}
          {LIMBS.map((limb, i) => {
            const pos = polar(limb.angle, orbitR);
            const isActive = selected?.id === limb.id;
            const isHover = hovered === limb.id;
            const r = isActive ? nodeR + 4 : isHover ? nodeR + 2 : nodeR;

            return (
              <g
                key={limb.id}
                onClick={() => setSelected(limb)}
                onMouseEnter={() => setHovered(limb.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                {/* Glow ring on hover */}
                {(isActive || isHover) && (
                  <circle cx={pos.x} cy={pos.y} r={r + 8} fill={limb.color} opacity="0.08" />
                )}

                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={r}
                  fill={isActive ? limb.light : "#fff"}
                  stroke={limb.color}
                  strokeWidth={isActive ? 3 : 2}
                  filter="url(#plShadow)"
                  className="transition-all duration-200"
                />

                {/* Icon */}
                <text
                  x={pos.x}
                  y={pos.y - 4}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={r * 0.55}
                >
                  {limb.icon}
                </text>

                {/* Limb number */}
                <circle cx={pos.x + r * 0.6} cy={pos.y - r * 0.6} r={10} fill={limb.color} />
                <text
                  x={pos.x + r * 0.6}
                  y={pos.y - r * 0.6}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={10}
                  fontWeight="700"
                  fill="#fff"
                >
                  {i + 1}
                </text>

                {/* Name label */}
                <text
                  x={pos.x}
                  y={pos.y + r + 14}
                  textAnchor="middle"
                  fontSize={W * 0.022}
                  fontWeight="700"
                  fill={isActive || isHover ? limb.color : "#78350f"}
                  className="transition-all duration-200"
                >
                  {limb.name}
                </text>

                {/* Sanskrit label */}
                <text
                  x={pos.x}
                  y={pos.y + r + 28}
                  textAnchor="middle"
                  fontSize={W * 0.016}
                  fill={isActive || isHover ? limb.color : "#a8a29e"}
                  opacity={isActive || isHover ? 1 : 0.7}
                >
                  {limb.sanskrit}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Bottom legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {LIMBS.map((limb) => (
            <button
              key={limb.id}
              onClick={() => setSelected(selected?.id === limb.id ? null : limb)}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-200"
              style={{
                background: selected?.id === limb.id ? limb.light : "#fff",
                color: limb.color,
                borderColor: selected?.id === limb.id ? limb.color : limb.border,
              }}
            >
              <span>{limb.icon}</span>
              {limb.name}
            </button>
          ))}
        </div>
      </div>

      {/* Detail popup */}
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center z-20 p-3">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl border-2 shadow-2xl p-5 w-full max-w-[400px] animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto" style={{ borderColor: selected.color }}>
            <button onClick={() => setSelected(null)} className="absolute right-3 top-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: selected.light, border: `2px solid ${selected.color}` }}>
                {selected.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selected.name}</h3>
                <p className="text-sm font-medium" style={{ color: selected.color }}>{selected.sanskrit}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-4">{selected.description}</p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl" style={{ background: `${selected.color}08`, border: `1px solid ${selected.border}` }}>
                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Computation Formula</span>
                <p className="text-sm font-bold mt-1" style={{ color: selected.color }}>{selected.computation}</p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Significance</span>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">{selected.significance}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
