"use client";

import React, { useState } from "react";
import { X, Heart, Sparkles } from "lucide-react";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_COLORS = [
  "#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7",
  "#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7",
];

// For each sign, show which Navamsha signs fall in each of its 9 divisions
function getNavamshaLord(rashiNum: number, division: number) {
  // Navamsha: each 30° sign divided into 9 parts of 3°20' each
  // Starting sign depends on the element of the rashi
  // Fire (1,5,9): starts from Aries (1)
  // Earth (2,6,10): starts from Capricorn (10)
  // Air (3,7,11): starts from Libra (7)
  // Water (4,8,12): starts from Cancer (4)
  const element = (rashiNum - 1) % 4; // 0=fire, 1=earth, 2=air, 3=water
  const starts = [1, 10, 7, 4];
  let start = starts[element];
  let navamsaSign = ((start - 1 + division - 1) % 12) + 1;
  return navamsaSign;
}

export default function VargaNavamsha({ size = 640 }: { size?: number }) {
  const [selectedSign, setSelectedSign] = useState<number | null>(null);
  const [hoveredSign, setHoveredSign] = useState<number | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<number | null>(null);

  const cx = 200;
  const cy = 200;
  const r = 150;

  const signAngle = (s: number) => ((s - 1) * 30 - 75) * (Math.PI / 180);
  const signMidAngle = (s: number) => ((s - 1) * 30 - 90) * (Math.PI / 180);

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50/30 to-purple-50/10 border border-rose-200/40 shadow-2xl shadow-rose-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-700">
            Navamsha (D-9)
          </h2>
          <p className="text-sm text-rose-400 mt-2 font-medium">
            The Soul & Relationship Matrix — each sign divided into 9 parts of 3°20'
          </p>
        </div>

        {/* Main chart */}
        <div className="relative w-full max-w-[400px] mx-auto aspect-square">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
              <filter id="navGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>

            {/* Outer ring - 12 signs */}
            {SIGNS.map((sign, i) => {
              const s = i + 1;
              const a1 = signAngle(s);
              const a2 = signAngle(s + 1);
              const mid = signMidAngle(s);
              const isSelected = selectedSign === s;
              const isHover = hoveredSign === s;

              const x1 = cx + r * Math.cos(a1);
              const y1 = cy + r * Math.sin(a1);
              const x2 = cx + r * Math.cos(a2);
              const y2 = cy + r * Math.sin(a2);
              const mx = cx + (r * 0.82) * Math.cos(mid);
              const my = cy + (r * 0.82) * Math.sin(mid);

              return (
                <g key={s} onClick={() => { setSelectedSign(isSelected ? null : s); setSelectedDivision(null); }} onMouseEnter={() => setHoveredSign(s)} onMouseLeave={() => setHoveredSign(null)} className="cursor-pointer">
                  <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                    fill={isSelected ? `${SIGN_COLORS[i]}20` : isHover ? `${SIGN_COLORS[i]}10` : "#fff"}
                    stroke={isSelected ? SIGN_COLORS[i] : "#e2e8f0"}
                    strokeWidth={isSelected ? 2.5 : 1}
                  />
                  <text x={mx} y={my} textAnchor="middle" dominantBaseline="central" fontSize={isSelected ? 13 : 11} fontWeight={isSelected ? 800 : 600} fill={isSelected ? SIGN_COLORS[i] : "#94a3b8"} style={{ pointerEvents: "none" }}>{s}</text>
                </g>
              );
            })}

            {/* Inner circle - Navamsha divisions */}
            <circle cx={cx} cy={cy} r={r * 0.55} fill="#fff" stroke="#e2e8f0" strokeWidth="1.5" />

            {/* Center label */}
            <circle cx={cx} cy={cy} r={r * 0.18} fill="#fff" stroke="#f43f5e" strokeWidth="2" filter="url(#navGlow)" />
            <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={800} fill="#e11d48">D-9</text>
            <text x={cx} y={cy + 9} textAnchor="middle" dominantBaseline="central" fontSize={8} fill="#fb7185">Navamsha</text>

            {/* If a sign is selected, show its 9 divisions */}
            {selectedSign && (() => {
              const divisions = [];
              for (let d = 1; d <= 9; d++) {
                const navSign = getNavamshaLord(selectedSign, d);
                divisions.push(
                  <g key={d} onClick={(e) => { e.stopPropagation(); setSelectedDivision(selectedDivision === d ? null : d); }} className="cursor-pointer">
                    <rect
                      x={cx - 60 + ((d - 1) % 3) * 40}
                      y={cy - 40 + Math.floor((d - 1) / 3) * 28}
                      width={36} height={24}
                      rx={6}
                      fill={selectedDivision === d ? `${SIGN_COLORS[navSign - 1]}20` : "#f8fafc"}
                      stroke={selectedDivision === d ? SIGN_COLORS[navSign - 1] : "#e2e8f0"}
                      strokeWidth={selectedDivision === d ? 2 : 1}
                    />
                    <text
                      x={cx - 60 + ((d - 1) % 3) * 40 + 18}
                      y={cy - 40 + Math.floor((d - 1) / 3) * 28 + 14}
                      textAnchor="middle" dominantBaseline="central"
                      fontSize={9} fontWeight={700}
                      fill={selectedDivision === d ? SIGN_COLORS[navSign - 1] : "#64748b"}
                    >
                      {SIGNS[navSign - 1].slice(0, 3)}
                    </text>
                  </g>
                );
              }
              return <>{divisions}</>;
            })()}
          </svg>
        </div>

        {/* Sign selector pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          {SIGNS.map((sign, i) => (
            <button
              key={sign}
              onClick={() => { setSelectedSign(selectedSign === i + 1 ? null : i + 1); setSelectedDivision(null); }}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${selectedSign === i + 1 ? "shadow-sm" : ""}`}
              style={{
                background: selectedSign === i + 1 ? `${SIGN_COLORS[i]}15` : "#fff",
                borderColor: selectedSign === i + 1 ? SIGN_COLORS[i] : "#e2e8f0",
                color: selectedSign === i + 1 ? SIGN_COLORS[i] : "#94a3b8",
              }}
            >
              {sign.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Info panel */}
        {selectedSign && (() => {
          const sign = SIGNS[selectedSign - 1];
          const element = ["Fire", "Earth", "Air", "Water"][(selectedSign - 1) % 4];
          return (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-bold text-rose-700">{sign} → Navamsha Lords</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => {
                  const navSign = getNavamshaLord(selectedSign, d);
                  return (
                    <div key={d} className="flex items-center gap-1.5 text-xs">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold text-white" style={{ background: SIGN_COLORS[navSign - 1] }}>{d}</div>
                      <span className="text-gray-600">{SIGNS[navSign - 1].slice(0, 3)}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <strong>{sign}</strong> is a <strong>{element}</strong> sign. Its Navamsha divisions start from <strong>{["Aries", "Capricorn", "Libra", "Cancer"][(selectedSign - 1) % 4]}</strong> and cycle through all 12 signs.
              </p>
            </div>
          );
        })()}

        {!selectedSign && (
          <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <Sparkles className="w-5 h-5 text-rose-400 mx-auto mb-1" />
            <p className="text-sm text-gray-500">Tap any sign on the wheel or a button below to see its 9 Navamsha divisions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
