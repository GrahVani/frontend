"use client";

import React, { useState } from "react";
import { Sun, ArrowUp } from "lucide-react";

const SIGNS = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
const SIGN_COLORS = ["#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7", "#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7"];

export default function VarshaPravesh({ size = 640 }: { size?: number }) {
  const [birthSign, setBirthSign] = useState(1);
  const [currentAge, setCurrentAge] = useState(30);

  // Muntha advances one sign per year from birth sign
  const munthaSign = ((birthSign - 1 + currentAge) % 12) + 1;
  const munthaHouse = ((munthaSign - birthSign + 12) % 12) + 1;

  const cx = 200;
  const cy = 200;
  const r = 140;

  const signAngle = (s: number) => ((s - 1) * 30 - 75) * (Math.PI / 180);
  const signMidAngle = (s: number) => ((s - 1) * 30 - 90) * (Math.PI / 180);

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/30 to-yellow-50/10 border border-amber-200/40 shadow-2xl shadow-amber-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-700">
            Varsha Pravesh
          </h2>
          <p className="text-sm text-amber-400 mt-2 font-medium">
            Solar Return Entry — Muntha advances one sign per year from birth ascendant
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-white border border-amber-100">
            <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Birth Ascendant</label>
            <select
              value={birthSign}
              onChange={(e) => setBirthSign(parseInt(e.target.value))}
              className="w-full mt-1 p-2 rounded-lg border border-amber-200 text-sm font-bold text-gray-700 bg-amber-50"
            >
              {SIGNS.map((s, i) => <option key={i} value={i + 1}>{s}</option>)}
            </select>
          </div>
          <div className="p-3 rounded-xl bg-white border border-amber-100">
            <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Current Age</label>
            <input
              type="number"
              min={1}
              max={120}
              value={currentAge}
              onChange={(e) => setCurrentAge(parseInt(e.target.value) || 1)}
              className="w-full mt-1 p-2 rounded-lg border border-amber-200 text-sm font-bold text-gray-700 bg-amber-50"
            />
          </div>
        </div>

        {/* Chart wheel */}
        <div className="relative w-full max-w-[360px] mx-auto aspect-square mb-4">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Houses */}
            {SIGNS.map((sign, i) => {
              const s = i + 1;
              const a1 = signAngle(s);
              const a2 = signAngle(s + 1);
              const mid = signMidAngle(s);
              const isMuntha = s === munthaSign;
              const isBirth = s === birthSign;

              const x1 = cx + r * Math.cos(a1);
              const y1 = cy + r * Math.sin(a1);
              const x2 = cx + r * Math.cos(a2);
              const y2 = cy + r * Math.sin(a2);
              const mx = cx + (r * 0.78) * Math.cos(mid);
              const my = cy + (r * 0.78) * Math.sin(mid);

              return (
                <g key={s}>
                  <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                    fill={isMuntha ? `${SIGN_COLORS[i]}20` : isBirth ? `${SIGN_COLORS[i]}10` : "#fff"}
                    stroke={isMuntha ? SIGN_COLORS[i] : isBirth ? SIGN_COLORS[i] : "#e2e8f0"}
                    strokeWidth={isMuntha ? 3 : isBirth ? 2 : 1}
                  />
                  <text x={mx} y={my} textAnchor="middle" dominantBaseline="central" fontSize={isMuntha ? 14 : 12} fontWeight={isMuntha ? 800 : 600} fill={isMuntha ? SIGN_COLORS[i] : isBirth ? SIGN_COLORS[i] : "#94a3b8"} style={{ pointerEvents: "none" }}>
                    {s}
                  </text>
                  {isBirth && (
                    <text x={mx} y={my + 16} textAnchor="middle" fontSize={8} fontWeight={700} fill={SIGN_COLORS[i]} style={{ pointerEvents: "none" }}>Birth</text>
                  )}
                  {isMuntha && (
                    <text x={mx} y={my + (isBirth ? 28 : 16)} textAnchor="middle" fontSize={8} fontWeight={700} fill={SIGN_COLORS[i]} style={{ pointerEvents: "none" }}>Muntha</text>
                  )}
                </g>
              );
            })}

            {/* Center */}
            <circle cx={cx} cy={cy} r={28} fill="#fff" stroke="#f59e0b" strokeWidth="2" />
            <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={800} fill="#d97706">Year</text>
            <text x={cx} y={cy + 9} textAnchor="middle" dominantBaseline="central" fontSize={9} fill="#f59e0b">{currentAge}</text>

            {/* Muntha arrow */}
            {(() => {
              const a = signMidAngle(munthaSign);
              const ax = cx + (r + 20) * Math.cos(a);
              const ay = cy + (r + 20) * Math.sin(a);
              return (
                <g>
                  <circle cx={ax} cy={ay} r={12} fill={SIGN_COLORS[munthaSign - 1]} opacity="0.9" />
                  <text x={ax} y={ay} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={800} fill="#fff">M</text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Result panel */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-700">Muntha Position</span>
          </div>
          <p className="text-sm text-gray-700">
            At age <strong>{currentAge}</strong>, the Muntha is in <strong style={{ color: SIGN_COLORS[munthaSign - 1] }}>Sign {SIGNS[munthaSign - 1]}</strong>,
            which is the <strong>{munthaHouse}{munthaHouse === 1 ? "st" : munthaHouse === 2 ? "nd" : munthaHouse === 3 ? "rd" : "th"} house</strong> from the birth ascendant.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            The Muntha represents the soul's yearly progression. Its house placement from the ascendant indicates the major theme of the year.
          </p>
        </div>
      </div>
    </div>
  );
}
