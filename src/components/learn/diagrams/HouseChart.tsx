"use client";

import React, { useState } from "react";
import { X, Home, Heart, Briefcase, Users, BookOpen, Baby, Skull, Landmark, Sparkles, Scale, Plane } from "lucide-react";

interface HouseData {
  num: number;
  sanskrit: string;
  meaning: string;
  angle: number;
  icon: React.ReactNode;
  keywords: string[];
}

const HOUSES: HouseData[] = [
  { num: 1, sanskrit: "Tanu", meaning: "Body / Self", angle: 0, icon: <Sparkles className="w-4 h-4" />, keywords: ["Personality", "Physical body", "Lagna", "Life path"] },
  { num: 2, sanskrit: "Dhana", meaning: "Wealth", angle: 30, icon: <Landmark className="w-4 h-4" />, keywords: ["Money", "Family", "Speech", "Food"] },
  { num: 3, sanskrit: "Sahaja", meaning: "Siblings", angle: 60, icon: <Users className="w-4 h-4" />, keywords: ["Courage", "Younger siblings", "Communication", "Skills"] },
  { num: 4, sanskrit: "Bandhu", meaning: "Home / Mother", angle: 90, icon: <Home className="w-4 h-4" />, keywords: ["Mother", "Property", "Vehicle", "Happiness"] },
  { num: 5, sanskrit: "Putra", meaning: "Children", angle: 120, icon: <Baby className="w-4 h-4" />, keywords: ["Children", "Intelligence", "Speculation", "Mantra"] },
  { num: 6, sanskrit: "Ari", meaning: "Enemies / Disease", angle: 150, icon: <Scale className="w-4 h-4" />, keywords: ["Disease", "Debt", "Enemies", "Service"] },
  { num: 7, sanskrit: "Yuvati", meaning: "Spouse", angle: 180, icon: <Heart className="w-4 h-4" />, keywords: ["Marriage", "Partnership", "Business", "Foreign lands"] },
  { num: 8, sanskrit: "Randhra", meaning: "Death / Occult", angle: 210, icon: <Skull className="w-4 h-4" />, keywords: ["Longevity", "Occult", "Sudden events", "Inheritance"] },
  { num: 9, sanskrit: "Dharma", meaning: "Fortune / Father", angle: 240, icon: <BookOpen className="w-4 h-4" />, keywords: ["Father", "Higher learning", "Luck", "Religion"] },
  { num: 10, sanskrit: "Karma", meaning: "Career", angle: 270, icon: <Briefcase className="w-4 h-4" />, keywords: ["Career", "Status", "Power", "Government"] },
  { num: 11, sanskrit: "Labha", meaning: "Gains", angle: 300, icon: <Landmark className="w-4 h-4" />, keywords: ["Income", "Elder siblings", "Friends", "Ambition"] },
  { num: 12, sanskrit: "Vyaya", meaning: "Loss / Liberation", angle: 330, icon: <Plane className="w-4 h-4" />, keywords: ["Expenses", "Foreign settlement", "Liberation", "Sleep"] },
];

const GROUPS = [
  { label: "Kendras (Angular)", houses: [1, 4, 7, 10], color: "#dc2626", bg: "#fef2f2" },
  { label: "Trikonas (Trines)", houses: [1, 5, 9], color: "#16a34a", bg: "#f0fdf4" },
  { label: "Dusthanas (Suffering)", houses: [6, 8, 12], color: "#7c3aed", bg: "#f5f3ff" },
  { label: "Upachayas (Growth)", houses: [3, 6, 10, 11], color: "#ea580c", bg: "#fff7ed" },
];

export default function HouseChart({ size = 520 }: { size?: number }) {
  const [selected, setSelected] = useState<HouseData | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.34;
  const pad = size * 0.08;

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  // Diamond points
  const diamondPoints = [
    polarToCartesian(0, r), polarToCartesian(90, r),
    polarToCartesian(180, r), polarToCartesian(270, r),
  ];
  const diamondPath = `M ${diamondPoints[0].x} ${diamondPoints[0].y} L ${diamondPoints[1].x} ${diamondPoints[1].y} L ${diamondPoints[2].x} ${diamondPoints[2].y} L ${diamondPoints[3].x} ${diamondPoints[3].y} Z`;

  // House wedge path inside diamond
  const getHouseWedge = (house: HouseData) => {
    const a1 = house.angle;
    const a2 = house.angle + 30;
    const p1 = polarToCartesian(a1, r * 0.08);
    const p2 = polarToCartesian(a2, r * 0.08);
    const p3 = polarToCartesian(a2, r);
    const p4 = polarToCartesian(a1, r);
    return `M ${cx} ${cy} L ${p4.x} ${p4.y} L ${p3.x} ${p3.y} L ${cx} ${cy} Z`;
  };

  const getHouseLabelPos = (angle: number, dist: number) => polarToCartesian(angle, dist);

  const getGroupColor = (houseNum: number) => {
    for (const g of GROUPS) {
      if (g.houses.includes(houseNum)) return { color: g.color, bg: g.bg };
    }
    return { color: "#d97706", bg: "#fffbeb" };
  };

  return (
    <div className="relative w-full max-w-[640px] mx-auto select-none">
      {/* Modern card container */}
      <div className="rounded-3xl bg-gradient-to-br from-[#fdfcfa] to-[#f5f2ee] border border-amber-100/80 shadow-lg shadow-amber-900/5 p-4 sm:p-6">
        {/* Title */}
        <div className="text-center mb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-600 tracking-tight">The 12 Bhavas</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Structural Architecture — Kendra · Trikona · Dusthana · Upachaya</p>
        </div>

        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
          <defs>
            <filter id="hcShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#78350f" floodOpacity="0.1" />
            </filter>
            {/* Clip path: everything inside the diamond only */}
            <clipPath id="diamondClip">
              <path d={diamondPath} />
            </clipPath>
          </defs>

          {/* Diamond background */}
          <path d={diamondPath} fill="#fffbeb" stroke="#d4a373" strokeWidth="2.5" filter="url(#hcShadow)" />

          {/* All internal lines CLIPPED to diamond */}
          <g clipPath="url(#diamondClip)">
            {/* Cross lines */}
            <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#d4a373" strokeWidth="1" opacity="0.4" />
            <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="#d4a373" strokeWidth="1" opacity="0.4" />
            {/* Diagonal dashed */}
            <line x1={diamondPoints[0].x} y1={diamondPoints[0].y} x2={diamondPoints[2].x} y2={diamondPoints[2].y} stroke="#d4a373" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
            <line x1={diamondPoints[1].x} y1={diamondPoints[1].y} x2={diamondPoints[3].x} y2={diamondPoints[3].y} stroke="#d4a373" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
            {/* House dividing lines */}
            {[30, 60, 120, 150, 210, 240, 300, 330].map((angle) => {
              const from = polarToCartesian(angle, r * 0.08);
              const to = polarToCartesian(angle, r);
              return <line key={angle} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#d4a373" strokeWidth="1" opacity="0.5" />;
            })}
          </g>

          {/* Interactive house wedges (also clipped) */}
          <g clipPath="url(#diamondClip)">
            {HOUSES.map((house) => {
              const gc = getGroupColor(house.num);
              const isHovered = hovered === house.num;
              const isSelected = selected?.num === house.num;

              return (
                <path
                  key={`wedge-${house.num}`}
                  d={getHouseWedge(house)}
                  fill={isHovered || isSelected ? gc.bg : "transparent"}
                  stroke={isHovered || isSelected ? gc.color : "transparent"}
                  strokeWidth={isHovered || isSelected ? 2.5 : 0}
                  opacity={isHovered || isSelected ? 0.9 : 0}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHovered(house.num)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(house)}
                />
              );
            })}
          </g>

          {/* House number circles (outside diamond, on top) */}
          {HOUSES.map((house) => {
            const gc = getGroupColor(house.num);
            const labelPos = getHouseLabelPos(house.angle + 15, r * 0.58);
            return (
              <g key={`label-${house.num}`}>
                <circle cx={labelPos.x} cy={labelPos.y} r={size * 0.048} fill="#fff" stroke={gc.color} strokeWidth="2" />
                <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.034} fontWeight="700" fill={gc.color} style={{ pointerEvents: "none" }}>
                  {house.num}
                </text>
              </g>
            );
          })}

          {/* Corner labels OUTSIDE diamond */}
          <text x={cx} y={pad} textAnchor="middle" fontSize={size * 0.026} fontWeight="700" fill="#92400e">1st House · Lagna</text>
          <text x={cx} y={size - pad * 0.3} textAnchor="middle" fontSize={size * 0.026} fontWeight="700" fill="#92400e">7th House · Yuvati</text>
          <text x={pad * 0.3} y={cy} textAnchor="start" dominantBaseline="central" fontSize={size * 0.026} fontWeight="700" fill="#92400e">4th House</text>
          <text x={size - pad * 0.3} y={cy} textAnchor="end" dominantBaseline="central" fontSize={size * 0.026} fontWeight="700" fill="#92400e">10th House</text>

          {/* Center */}
          <circle cx={cx} cy={cy} r={size * 0.085} fill="#fff" stroke="#d4a373" strokeWidth="2" />
          <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.034} fontWeight="800" fill="#78350f">12 Bhavas</text>
          <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.024} fill="#a16207">House Chart</text>
        </svg>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          {GROUPS.map((g) => (
            <div key={g.label} className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
              <span className="text-xs font-semibold text-gray-700">{g.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected House Detail Popup */}
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl border-2 shadow-2xl p-5 w-full max-w-[360px] animate-in zoom-in-95 duration-200"
            style={{ borderColor: getGroupColor(selected.num).color }}
          >
            <button onClick={() => setSelected(null)} className="absolute right-3 top-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                style={{ background: getGroupColor(selected.num).color }}>
                {selected.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selected.num}{selected.num === 1 ? "st" : selected.num === 2 ? "nd" : selected.num === 3 ? "rd" : "th"} House</h3>
                <p className="text-sm font-medium" style={{ color: getGroupColor(selected.num).color }}>{selected.sanskrit} · {selected.meaning}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {selected.keywords.map((k) => (
                <span key={k} className="text-[11px] font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-600">{k}</span>
              ))}
            </div>

            {GROUPS.filter(g => g.houses.includes(selected.num)).map(g => (
              <div key={g.label} className="p-2.5 rounded-lg mb-2 text-xs font-bold" style={{ background: g.bg, color: g.color }}>
                {g.label}
              </div>
            ))}

            <p className="text-xs text-gray-500 leading-relaxed mt-3">
              The {selected.num}{selected.num === 1 ? "st" : selected.num === 2 ? "nd" : selected.num === 3 ? "rd" : "th"} house ({selected.sanskrit}) governs{" "}
              <span className="font-semibold text-gray-700">{selected.meaning.toLowerCase()}</span>.
              Planets placed here significantly influence these areas of life.
            </p>
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {hovered !== null && !selected && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg pointer-events-none animate-in fade-in duration-150">
          Click House {hovered} to explore
        </div>
      )}
    </div>
  );
}
