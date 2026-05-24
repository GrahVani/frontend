"use client";

import React, { useState, useCallback } from "react";
import { RotateCcw } from "lucide-react";

const SIGNS = [
  { abbr: "ARI", full: "Aries",       color: "#ef4444", bg: "#fef2f2" },
  { abbr: "TAU", full: "Taurus",      color: "#a16207", bg: "#fefce8" },
  { abbr: "GEM", full: "Gemini",      color: "#16a34a", bg: "#f0fdf4" },
  { abbr: "CAN", full: "Cancer",      color: "#0891b2", bg: "#ecfeff" },
  { abbr: "LEO", full: "Leo",         color: "#ea580c", bg: "#fff7ed" },
  { abbr: "VIR", full: "Virgo",       color: "#65a30d", bg: "#f7fee7" },
  { abbr: "LIB", full: "Libra",       color: "#e879a0", bg: "#fdf2f8" },
  { abbr: "SCO", full: "Scorpio",     color: "#dc2626", bg: "#fef2f2" },
  { abbr: "SAG", full: "Sagittarius", color: "#7c3aed", bg: "#f5f3ff" },
  { abbr: "CAP", full: "Capricorn",   color: "#4b5563", bg: "#f3f4f6" },
  { abbr: "AQU", full: "Aquarius",    color: "#2563eb", bg: "#eff6ff" },
  { abbr: "PIS", full: "Pisces",      color: "#0d9488", bg: "#f0fdfa" },
];

// Wedge colors for visual distinction
const WEDGE_COLORS = [
  "#fca5a5", "#fde68a", "#86efac", "#67e8f9",
  "#fdba74", "#bef264", "#f9a8d4", "#fca5a5",
  "#c4b5fd", "#d1d5db", "#93c5fd", "#99f6e4",
];

const INNER_COLORS = [
  "#ef4444", "#ca8a04", "#22c55e", "#06b6d4",
  "#f97316", "#84cc16", "#ec4899", "#dc2626",
  "#8b5cf6", "#6b7280", "#3b82f6", "#14b8a6",
];

export default function AyanamsaDrift({ size = 560 }: { size?: number }) {
  const [offset, setOffset] = useState(0); // degrees of Ayanamsa offset

  const S = size;
  const cx = S / 2, cy = S / 2;
  const outerR = S * 0.44;
  const outerInnerR = S * 0.34;
  const innerR = S * 0.33;
  const innerInnerR = S * 0.18;
  const centerR = S * 0.06;

  // A planet position to demonstrate the offset effect
  const planetTropicalDeg = 15; // 15° Aries in tropical

  // Compute sidereal position
  const planetSiderealDeg = ((planetTropicalDeg - offset) % 360 + 360) % 360;
  const tropSign = Math.floor(planetTropicalDeg / 30);
  const tropDeg = Math.floor(planetTropicalDeg % 30);
  const sidSign = Math.floor(planetSiderealDeg / 30);
  const sidDeg = Math.floor(planetSiderealDeg % 30);

  const sameSign = tropSign === sidSign;

  // Helper: polar to cartesian (0° = top/12 o'clock, clockwise)
  const polar = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // Arc path for a wedge
  const wedgePath = (startDeg: number, endDeg: number, rOuter: number, rInner: number) => {
    const p1 = polar(startDeg, rOuter);
    const p2 = polar(endDeg, rOuter);
    const p3 = polar(endDeg, rInner);
    const p4 = polar(startDeg, rInner);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M${p1.x},${p1.y} A${rOuter},${rOuter} 0 ${large} 1 ${p2.x},${p2.y} L${p3.x},${p3.y} A${rInner},${rInner} 0 ${large} 0 ${p4.x},${p4.y} Z`;
  };

  // Text along arc - we'll use simple positioned text with rotation
  const labelPos = (index: number, r: number, offsetDeg: number = 0) => {
    const angle = index * 30 + 15 + offsetDeg; // center of the 30° wedge
    const pos = polar(angle, r);
    // Rotate text so it reads outward from center
    // For bottom half (90-270°), flip 180° so text isn't upside down
    let rotation = angle;
    if (angle > 90 && angle < 270) {
      rotation = angle + 180;
    }
    return { ...pos, rotation };
  };

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setOffset(parseFloat(e.target.value));
  }, []);

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-[#fdfcfa] via-[#f0f9ff] to-[#ecfeff] border border-cyan-200/50 shadow-xl shadow-cyan-900/5 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-cyan-800">Ayanamsa & The Dual Zodiac</h2>
            <p className="text-xs mt-1 font-semibold" style={{ color: sameSign ? "#16a34a" : "#dc2626" }}>
              {sameSign
                ? `The planet remains in ${SIGNS[tropSign].full} for both systems.`
                : `Tropical: ${SIGNS[tropSign].full} → Sidereal: ${SIGNS[sidSign].full} (shifted!)`
              }
            </p>
          </div>
          <div className="text-right text-[11px] font-mono">
            <div className="flex gap-4 font-bold text-gray-500 mb-0.5">
              <span>OFFSET</span><span>TROPICAL</span><span>SIDEREAL</span>
            </div>
            <div className="flex gap-4 font-extrabold">
              <span className="text-cyan-700">{offset.toFixed(1)}°</span>
              <span className="text-amber-700">{tropDeg}° {SIGNS[tropSign].abbr}</span>
              <span className="text-indigo-700">{sidDeg}° {SIGNS[sidSign].abbr}</span>
            </div>
          </div>
        </div>

        {/* SVG Wheel */}
        <svg viewBox={`0 0 ${S} ${S}`} className="w-full h-auto">
          <defs>
            <filter id="ayWheelShadow">
              <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#0e7490" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* ── OUTER RING: Fixed Tropical Zodiac ── */}
          {SIGNS.map((sign, i) => {
            const startAngle = i * 30;
            const endAngle = (i + 1) * 30;
            const lbl = labelPos(i, (outerR + outerInnerR) / 2);
            return (
              <g key={`outer-${i}`}>
                <path d={wedgePath(startAngle, endAngle, outerR, outerInnerR)}
                  fill={WEDGE_COLORS[i]} fillOpacity="0.5"
                  stroke="#fff" strokeWidth="1.5" />
                <text x={lbl.x} y={lbl.y}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={S * 0.032} fontWeight="800" fill={sign.color}
                  transform={`rotate(${lbl.rotation},${lbl.x},${lbl.y})`}>
                  {sign.abbr}
                </text>
              </g>
            );
          })}

          {/* ── INNER RING: Rotating Sidereal Zodiac ── */}
          {SIGNS.map((sign, i) => {
            const startAngle = i * 30 + offset;
            const endAngle = (i + 1) * 30 + offset;
            const lbl = labelPos(i, (innerR + innerInnerR) / 2, offset);
            return (
              <g key={`inner-${i}`}>
                <path d={wedgePath(startAngle, endAngle, innerR, innerInnerR)}
                  fill={INNER_COLORS[i]} fillOpacity="0.7"
                  stroke="#fff" strokeWidth="1" />
                <text x={lbl.x} y={lbl.y}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={S * 0.026} fontWeight="700" fill="#fff"
                  transform={`rotate(${lbl.rotation},${lbl.x},${lbl.y})`}>
                  {sign.abbr}
                </text>
              </g>
            );
          })}

          {/* Ring labels */}
          <text x={cx} y={cy - outerR - S * 0.02} textAnchor="middle"
            fontSize={S * 0.02} fontWeight="700" fill="#64748b" letterSpacing="0.05em">
            FIXED TROPICAL ZODIAC (OUTER)
          </text>
          <text x={cx} y={cy - innerR + S * 0.04} textAnchor="middle"
            fontSize={S * 0.017} fontWeight="600" fill="#475569" letterSpacing="0.03em">
            ROTATING SIDEREAL ZODIAC (INNER)
          </text>

          {/* Center circle */}
          <circle cx={cx} cy={cy} r={centerR} fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={2} fill="#22d3ee" />

          {/* Planet marker line - from center to outer edge at tropical position */}
          {(() => {
            const tropPos = polar(planetTropicalDeg, outerR + 4);
            const tropInner = polar(planetTropicalDeg, centerR);
            const sidPos = polar(planetSiderealDeg + offset, innerInnerR);
            return (
              <g>
                {/* Tropical line (dashed, goes from center through both rings) */}
                <line x1={tropInner.x} y1={tropInner.y} x2={tropPos.x} y2={tropPos.y}
                  stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 3" opacity="0.7" />
                {/* Planet dot on outer ring */}
                <circle cx={tropPos.x} cy={tropPos.y} r={S * 0.015}
                  fill="#3b82f6" stroke="#fff" strokeWidth="2" filter="url(#ayWheelShadow)" />
              </g>
            );
          })()}

          {/* Aries 0° marker on outer ring */}
          {(() => {
            const p1 = polar(0, outerR);
            const p2 = polar(0, outerR + S * 0.03);
            return (
              <g>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#ef4444" strokeWidth="2" />
                <text x={p2.x + 2} y={p2.y - 4} fontSize={S * 0.018} fontWeight="700" fill="#ef4444">0° ♈</text>
              </g>
            );
          })()}
        </svg>

        {/* Ayanamsa Offset Slider */}
        <div className="mt-4 flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl border border-cyan-100 p-3 sm:p-4">
          <label className="text-xs font-bold text-gray-500 whitespace-nowrap">Ayanamsa Offset (°)</label>
          <input
            type="range"
            min="0" max="30" step="0.5"
            value={offset}
            onChange={handleSliderChange}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #0891b2 ${(offset / 30) * 100}%, #e2e8f0 ${(offset / 30) * 100}%)`,
            }}
          />
          <div className="w-12 text-center text-sm font-extrabold text-cyan-800 bg-cyan-50 rounded-lg py-1 border border-cyan-200">
            {offset.toFixed(0)}
          </div>
          <button
            onClick={() => setOffset(0)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-cyan-700 bg-gray-50 hover:bg-cyan-50 rounded-lg border border-gray-200 hover:border-cyan-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset (0°)
          </button>
        </div>

        {/* Explanation */}
        <div className="mt-3 text-center">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Drag the slider to see how the <strong className="text-amber-700">Sidereal zodiac (inner)</strong> shifts
            relative to the <strong className="text-cyan-700">Tropical zodiac (outer)</strong>.
            At <strong>~24°</strong> (current Lahiri Ayanamsa), most planets shift back by nearly one whole sign.
          </p>
        </div>
      </div>
    </div>
  );
}
