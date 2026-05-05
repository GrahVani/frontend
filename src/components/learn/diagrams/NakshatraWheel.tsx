"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface PadaData {
  pada: number;
  navamshaRashi: string;
  degreeStart: number;
  degreeEnd: number;
}

interface NakshatraData {
  name: string;
  sanskrit: string;
  ruler: string;
  symbol: string;
  startDeg: number;
  endDeg: number;
  padas: PadaData[];
  deity: string;
  guna: string;
  animal: string;
}

const RULER_COLORS: Record<string, string> = {
  Ketu: "#64748b", Venus: "#ec4899", Sun: "#f59e0b", Moon: "#94a3b8",
  Mars: "#ef4444", Rahu: "#7c3aed", Jupiter: "#f97316", Saturn: "#6366f1", Mercury: "#10b981",
};

const NAVAMSHA_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

function buildNakshatras(): NakshatraData[] {
  const names = [
    ["Ashwini", "अश्विनी", "Ketu", "🐎", "Ashwini Kumaras", "Rajas", "Horse"],
    ["Bharani", "भरणी", "Venus", "⚖", "Yama", "Rajas", "Male Elephant"],
    ["Krittika", "कृत्तिका", "Sun", "🔥", "Agni", "Rajas", "Female Sheep"],
    ["Rohini", "रोहिणी", "Moon", "🛞", "Brahma/Prajapati", "Rajas", "Male Serpent"],
    ["Mrigashira", "मृगशीर्ष", "Mars", "🦌", "Soma", "Rajas", "Female Serpent"],
    ["Ardra", "आर्द्रा", "Rahu", "💧", "Rudra", "Tamas", "Female Dog"],
    ["Punarvasu", "पुनर्वसु", "Jupiter", "🏹", "Aditi", "Sattva", "Female Cat"],
    ["Pushya", "पुष्य", "Saturn", "🌸", "Brihaspati", "Tamas", "Male Sheep"],
    ["Ashlesha", "आश्लेषा", "Mercury", "🐍", "Nagas/Serpents", "Sattva", "Male Cat"],
    ["Magha", "मघा", "Ketu", "👑", "Pitris (Ancestors)", "Tamas", "Male Rat"],
    ["Purva Phalguni", "पूर्व फाल्गुनी", "Venus", "🛏", "Bhaga", "Tamas", "Female Rat"],
    ["Uttara Phalguni", "उत्तर फाल्गुनी", "Sun", "🛏", "Aryaman", "Tamas", "Male Cow"],
    ["Hasta", "हस्त", "Moon", "✋", "Savitar/Surya", "Sattva", "Female Buffalo"],
    ["Chitra", "चित्रा", "Mars", "💎", "Tvashtar/Vishwakarma", "Tamas", "Female Tiger"],
    ["Swati", "स्वाती", "Rahu", "🌬", "Vayu", "Tamas", "Male Buffalo"],
    ["Vishakha", "विशाखा", "Jupiter", "🏹", "Indra & Agni", "Sattva", "Male Tiger"],
    ["Anuradha", "अनुराधा", "Saturn", "🌂", "Mitra", "Tamas", "Female Deer"],
    ["Jyeshtha", "ज्येष्ठा", "Mercury", "🦂", "Indra", "Sattva", "Male Deer"],
    ["Mula", "मूल", "Ketu", "🌿", "Nirriti", "Tamas", "Male Dog"],
    ["Purva Ashadha", "पूर्वाषाढ़ा", "Venus", "🐘", "Apah (Waters)", "Sattva", "Male Monkey"],
    ["Uttara Ashadha", "उत्तराषाढ़ा", "Sun", "🐘", "Vishvadevas", "Sattva", "Male Mongoose"],
    ["Shravana", "श्रवण", "Moon", "👂", "Vishnu", "Tamas", "Female Monkey"],
    ["Dhanishta", "धनिष्ठा", "Mars", "🥁", "Vasus (8 Elements)", "Tamas", "Female Lion"],
    ["Shatabhisha", "शतभिषा", "Rahu", "💯", "Varuna", "Sattva", "Female Horse"],
    ["Purva Bhadrapada", "पूर्वभाद्रपदा", "Jupiter", "🛏", "Ajaikapada", "Sattva", "Male Lion"],
    ["Uttara Bhadrapada", "उत्तरभाद्रपदा", "Saturn", "🐂", "Ahirbudhnya", "Tamas", "Female Cow"],
    ["Revati", "रेवती", "Mercury", "🐟", "Pushan", "Sattva", "Female Elephant"],
  ];

  return names.map(([name, sanskrit, ruler, symbol, deity, guna, animal], i) => {
    const startDeg = i * 13.3333;
    const endDeg = (i + 1) * 13.3333;
    const padaSize = 13.3333 / 4;
    const padas: PadaData[] = Array.from({ length: 4 }, (_, p) => {
      const navIndex = ((i * 4 + p) % 12);
      return {
        pada: p + 1,
        navamshaRashi: NAVAMSHA_SIGNS[navIndex],
        degreeStart: Number((startDeg + p * padaSize).toFixed(2)),
        degreeEnd: Number((startDeg + (p + 1) * padaSize).toFixed(2)),
      };
    });
    return { name, sanskrit, ruler: ruler as string, symbol, startDeg: Number(startDeg.toFixed(2)), endDeg: Number(endDeg.toFixed(2)), padas, deity, guna, animal };
  });
}

const NAKSHATRAS = buildNakshatras();

export default function NakshatraWheel({ size = 560 }: { size?: number }) {
  const [selected, setSelected] = useState<NakshatraData | null>(null);
  const [selectedPada, setSelectedPada] = useState<PadaData | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoveredPada, setHoveredPada] = useState<{ n: number; p: number } | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.44;
  const midR = size * 0.32;
  const innerR = size * 0.14;

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const rColor = (ruler: string) => RULER_COLORS[ruler] || "#d97706";

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-[#fdfcfa] via-[#fffbeb] to-[#fef3c7] border border-amber-200/60 shadow-xl shadow-amber-900/5 p-5 sm:p-7">
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-700 tracking-tight">The 27 Nakshatras & 108 Padas</h2>
          <p className="text-xs sm:text-sm text-amber-500/80 mt-1">Each Nakshatra spans 13° 20′ and contains 4 Padas (3° 20′ each)</p>
        </div>

        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
          <defs>
            <filter id="nwShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="5" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Outer decorative ring */}
          <circle cx={cx} cy={cy} r={outerR + 6} fill="none" stroke="#d4a373" strokeWidth="1" opacity="0.3" />
          <circle cx={cx} cy={cy} r={outerR} fill="#fff" stroke="#d4a373" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={midR} fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={cx} cy={cy} r={innerR} fill="#fffbeb" stroke="#d4a373" strokeWidth="2" />

          {/* 27 Nakshatra outer wedges + 4 Padas inner wedges */}
          {NAKSHATRAS.map((n, i) => {
            const startAngle = (i * 360) / 27;
            const endAngle = ((i + 1) * 360) / 27;
            const midAngle = startAngle + 180 / 27;
            const isHovered = hovered === i;
            const isSelected = selected?.name === n.name;
            const color = rColor(n.ruler);

            // Outer wedge (nakshatra boundary)
            const oStart = polarToCartesian(endAngle, outerR);
            const oEnd = polarToCartesian(startAngle, outerR);
            const oMid = polarToCartesian(startAngle, midR);
            const oMidEnd = polarToCartesian(endAngle, midR);
            const outerPath = `M ${oMid.x} ${oMid.y} L ${oStart.x} ${oStart.y} A ${outerR} ${outerR} 0 0 0 ${oEnd.x} ${oEnd.y} L ${oMidEnd.x} ${oMidEnd.y} Z`;

            return (
              <g key={n.name}>
                {/* Nakshatra outer region */}
                <path
                  d={outerPath}
                  fill={isHovered || isSelected ? `${color}12` : (i % 2 === 0 ? "#fef9c3" : "transparent")}
                  stroke={isHovered || isSelected ? color : "#e5e7eb"}
                  strokeWidth={isHovered || isSelected ? 2 : 0.5}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => { setSelected(n); setSelectedPada(null); }}
                />

                {/* 4 Padas per nakshatra */}
                {n.padas.map((p, pi) => {
                  const pStartAngle = startAngle + (pi * (endAngle - startAngle)) / 4;
                  const pEndAngle = startAngle + ((pi + 1) * (endAngle - startAngle)) / 4;
                  const pMidAngle = (pStartAngle + pEndAngle) / 2;
                  const pStart = polarToCartesian(pEndAngle, midR);
                  const pEnd = polarToCartesian(pStartAngle, midR);
                  const pInnerStart = polarToCartesian(pEndAngle, innerR);
                  const pInnerEnd = polarToCartesian(pStartAngle, innerR);
                  const padaPath = `M ${pInnerStart.x} ${pInnerStart.y} L ${pStart.x} ${pStart.y} A ${midR} ${midR} 0 0 0 ${pEnd.x} ${pEnd.y} L ${pInnerEnd.x} ${pInnerEnd.y} Z`;
                  const isPHovered = hoveredPada?.n === i && hoveredPada?.p === pi;
                  const isPSelected = selected?.name === n.name && selectedPada?.pada === p.pada;
                  const labelPos = polarToCartesian(pMidAngle, (midR + innerR) / 2);

                  return (
                    <g key={pi}>
                      <path
                        d={padaPath}
                        fill={isPSelected || isPHovered ? `${color}22` : (pi % 2 === 0 ? "#fff" : `${color}08`)}
                        stroke={isPSelected || isPHovered ? color : "#e5e7eb"}
                        strokeWidth={isPSelected || isPHovered ? 1.5 : 0.5}
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredPada({ n: i, p: pi })}
                        onMouseLeave={() => setHoveredPada(null)}
                        onClick={(e) => { e.stopPropagation(); setSelected(n); setSelectedPada(p); }}
                      />
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={size * 0.014}
                        fontWeight={isPHovered || isPSelected ? "700" : "500"}
                        fill={isPHovered || isPSelected ? color : "#a8a29e"}
                        style={{ pointerEvents: "none" }}
                      >
                        {p.pada}
                      </text>
                    </g>
                  );
                })}

                {/* Nakshatra label */}
                {(() => {
                  const labelPos = polarToCartesian(midAngle, (outerR + midR) / 2);
                  return (
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={isHovered || isSelected ? size * 0.022 : size * 0.018}
                      fontWeight={isHovered || isSelected ? "700" : "600"}
                      fill={isHovered || isSelected ? color : "#78350f"}
                      style={{ pointerEvents: "none" }}
                    >
                      {n.symbol}
                    </text>
                  );
                })()}

                {/* Nakshatra name (small, outer edge) */}
                {(() => {
                  const namePos = polarToCartesian(midAngle, outerR - 10);
                  return (
                    <text
                      x={namePos.x}
                      y={namePos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={size * 0.012}
                      fontWeight="500"
                      fill={isHovered || isSelected ? color : "#a8a29e"}
                      style={{ pointerEvents: "none" }}
                    >
                      {n.name.slice(0, 6)}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          {/* Center hub */}
          <circle cx={cx} cy={cy} r={innerR - 4} fill="#fff" stroke="#d4a373" strokeWidth="1.5" />
          <text x={cx} y={cy - 12} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.045} fontWeight="800" fill="#d97706">108</text>
          <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.024} fill="#a16207">Padas</text>
          <text x={cx} y={cy + 28} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.016} fill="#d97706" opacity="0.7">27 × 4</text>
        </svg>

        {/* Info bar */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-amber-100 text-center">
            <div className="text-2xl font-bold text-amber-600">27</div>
            <div className="text-[11px] text-amber-500 font-medium uppercase tracking-wide">Nakshatras</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-amber-100 text-center">
            <div className="text-2xl font-bold text-amber-600">4</div>
            <div className="text-[11px] text-amber-500 font-medium uppercase tracking-wide">Padas Each</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-amber-100 text-center">
            <div className="text-2xl font-bold text-amber-600">108</div>
            <div className="text-[11px] text-amber-500 font-medium uppercase tracking-wide">Total Padas</div>
          </div>
        </div>
      </div>

      {/* Detail popup */}
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center z-20 p-3">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl" onClick={() => { setSelected(null); setSelectedPada(null); }} />
          <div className="relative bg-white rounded-2xl border-2 shadow-2xl p-5 w-full max-w-[380px] animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto" style={{ borderColor: rColor(selected.ruler) }}>
            <button onClick={() => { setSelected(null); setSelectedPada(null); }} className="absolute right-3 top-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>

            <div className="text-center mb-4">
              <span className="text-4xl">{selected.symbol}</span>
              <h3 className="text-xl font-bold text-gray-900 mt-1">{selected.name}</h3>
              <p className="text-sm font-medium text-amber-600">{selected.sanskrit}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg text-sm">
                <span className="text-xs font-semibold text-gray-500">Ruler</span>
                <span className="font-bold" style={{ color: rColor(selected.ruler) }}>{selected.ruler}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg text-sm">
                <span className="text-xs font-semibold text-gray-500">Deity</span>
                <span className="font-bold text-gray-700">{selected.deity}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg text-sm">
                <span className="text-xs font-semibold text-gray-500">Guna</span>
                <span className="font-bold text-gray-700">{selected.guna}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg text-sm">
                <span className="text-xs font-semibold text-gray-500">Animal</span>
                <span className="font-bold text-gray-700">{selected.animal}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded-lg text-sm col-span-2">
                <span className="text-xs font-semibold text-gray-500">Degrees</span>
                <span className="font-bold text-gray-700">{selected.startDeg}° — {selected.endDeg}°</span>
              </div>
            </div>

            {/* Padas table */}
            <div className="bg-amber-50/60 rounded-xl border border-amber-100 p-3">
              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">4 Padas (Navamsha Mapping)</h4>
              <div className="space-y-1.5">
                {selected.padas.map((p) => {
                  const isActive = selectedPada?.pada === p.pada;
                  return (
                    <div
                      key={p.pada}
                      onClick={() => setSelectedPada(isActive ? null : p)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                        isActive ? "bg-amber-100 border border-amber-200" : "bg-white border border-transparent hover:border-amber-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-700"}`}>{p.pada}</span>
                        <span className="text-xs font-semibold text-gray-700">{p.navamshaRashi}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">{p.degreeStart}°–{p.degreeEnd}°</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedPada && (
              <div className="mt-3 p-3 rounded-xl border" style={{ borderColor: rColor(selected.ruler), background: `${rColor(selected.ruler)}08` }}>
                <p className="text-xs font-bold mb-1" style={{ color: rColor(selected.ruler) }}>
                  Pada {selectedPada.pada}: {selectedPada.navamshaRashi} Navamsha
                </p>
                <p className="text-xs text-gray-600">
                  This Pada falls in the {selectedPada.navamshaRashi} sign of the D-9 (Navamsha) chart. It refines the expression of {selected.name} energy through {selectedPada.navamshaRashi} qualities.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {hovered !== null && !selected && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-900 text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-lg pointer-events-none animate-in fade-in duration-150">
          {NAKSHATRAS[hovered].name} · {NAKSHATRAS[hovered].ruler} · {NAKSHATRAS[hovered].padas.length} Padas
        </div>
      )}
    </div>
  );
}
