"use client";

import React, { useState } from "react";

interface LimbData {
  id: string;
  name: string;
  sanskrit: string;
  icon: string;
  color: string;
  light: string;
  description: string;
  computation: string;
}

const LIMBS: LimbData[] = [
  {
    id: "tithi",
    name: "Tithi",
    sanskrit: "तिथि",
    icon: "🌙",
    color: "#d97706",
    light: "#fef3c7",
    description: "The lunar day — one of 30 divisions of the synodic month. Governs emotional and mental states.",
    computation: "Moon Longitude − Sun Longitude ÷ 12°",
  },
  {
    id: "var",
    name: "Vara",
    sanskrit: "वार",
    icon: "☀️",
    color: "#dc2626",
    light: "#fee2e2",
    description: "The weekday — ruled by one of the 7 planets. Determines daily energy and activity suitability.",
    computation: "Sunrise-to-sunrise day ruled by the planet of the hour at sunrise.",
  },
  {
    id: "nakshatra",
    name: "Nakshatra",
    sanskrit: "नक्षत्र",
    icon: "⭐",
    color: "#7c3aed",
    light: "#ede9fe",
    description: "The lunar mansion — Moon's position in one of 27 star constellations. Governs the psyche.",
    computation: "Moon Longitude ÷ 13° 20′",
  },
  {
    id: "yoga",
    name: "Yoga",
    sanskrit: "योग",
    icon: "🧘",
    color: "#059669",
    light: "#d1fae5",
    description: "The union — angle sum of Sun + Moon determines 27 yogas. Governs auspiciousness of events.",
    computation: "(Sun Longitude + Moon Longitude) ÷ 13° 20′",
  },
  {
    id: "karana",
    name: "Karana",
    sanskrit: "करण",
    icon: "⚔️",
    color: "#0891b2",
    light: "#cffafe",
    description: "The half-tithi — 11 karanas rotate. Determines the 'how' of actions and deeds.",
    computation: "(Moon Longitude − Sun Longitude) ÷ 6°",
  },
];

export default function PanchangLimbs({ size = 520 }: { size?: number }) {
  const [selected, setSelected] = useState<LimbData | null>(null);
  const W = size;
  const H = size * 0.58;
  const cardW = W * 0.16;
  const cardH = H * 0.62;
  const startX = W * 0.05;
  const gap = (W - startX * 2 - cardW * 5) / 4;
  const cardY = H * 0.28;

  return (
    <div className="relative select-none" style={{ maxWidth: size }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <rect x={0} y={0} width={W} height={H} fill="#f8fafc" rx={12} />

        {/* Title */}
        <text x={W / 2} y={H * 0.12} textAnchor="middle" fontSize={W * 0.032} fontWeight="700" fill="#1e293b">
          The Five Limbs of the Panchang
        </text>
        <text x={W / 2} y={H * 0.18} textAnchor="middle" fontSize={W * 0.02} fill="#64748b">
          Tap each limb to learn its computation and significance
        </text>

        {/* Connection line */}
        <line x1={startX + cardW / 2} y1={cardY + cardH / 2} x2={W - startX - cardW / 2} y2={cardY + cardH / 2} stroke="#e2e8f0" strokeWidth={2} strokeDasharray="6 4" />

        {LIMBS.map((limb, i) => {
          const x = startX + i * (cardW + gap);
          const isActive = selected?.id === limb.id;
          return (
            <g
              key={limb.id}
              onClick={() => setSelected(limb)}
              style={{ cursor: "pointer" }}
            >
              {/* Card background */}
              <rect
                x={x}
                y={cardY}
                width={cardW}
                height={cardH}
                rx={10}
                fill={isActive ? limb.light : "#fff"}
                stroke={limb.color}
                strokeWidth={isActive ? 2.5 : 1.5}
                opacity={isActive ? 1 : 0.95}
              />

              {/* Number badge */}
              <circle cx={x + cardW / 2} cy={cardY + cardW * 0.35} r={cardW * 0.28} fill={limb.color} opacity="0.1" />
              <text x={x + cardW / 2} y={cardY + cardW * 0.35} textAnchor="middle" dominantBaseline="central" fontSize={cardW * 0.35}>
                {limb.icon}
              </text>

              {/* Name */}
              <text x={x + cardW / 2} y={cardY + cardW * 0.85} textAnchor="middle" fontSize={cardW * 0.18} fontWeight="700" fill={limb.color}>
                {limb.name}
              </text>

              {/* Sanskrit */}
              <text x={x + cardW / 2} y={cardY + cardW * 1.05} textAnchor="middle" fontSize={cardW * 0.14} fill="#94a3b8">
                {limb.sanskrit}
              </text>

              {/* Index */}
              <circle cx={x + cardW - 10} cy={cardY + 14} r={9} fill={limb.color} />
              <text x={x + cardW - 10} y={cardY + 14} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="700" fill="#fff">{i + 1}</text>
            </g>
          );
        })}
      </svg>

      {/* Detail popup */}
      {selected && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[92%] bg-white rounded-xl border shadow-lg p-4 z-10" style={{ borderColor: selected.color }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{selected.icon}</span>
            <span className="text-base font-bold" style={{ color: selected.color }}>{selected.name} <span className="text-sm font-normal text-slate-400">({selected.sanskrit})</span></span>
          </div>
          <p className="text-sm text-slate-600 mb-2 leading-relaxed">{selected.description}</p>
          <div className="bg-slate-50 rounded-lg p-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Formula:</span> {selected.computation}
          </div>
          <button onClick={() => setSelected(null)} className="mt-2 text-xs font-medium hover:underline" style={{ color: selected.color }}>Close</button>
        </div>
      )}
    </div>
  );
}
