"use client";

import React, { useState } from "react";
import { X, Flame, Droplets, Wind, Mountain, MoveRight, Anchor, Repeat } from "lucide-react";

interface SignData {
  name: string;
  sanskrit: string;
  symbol: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  modality: "Movable" | "Fixed" | "Dual";
  lord: string;
  startDeg: number;
  endDeg: number;
  startAngle: number;
}

const SIGNS: SignData[] = [
  { name: "Aries", sanskrit: "Mesha", symbol: "♈", element: "Fire", modality: "Movable", lord: "Mars", startDeg: 0, endDeg: 30, startAngle: 0 },
  { name: "Taurus", sanskrit: "Vrishabha", symbol: "♉", element: "Earth", modality: "Fixed", lord: "Venus", startDeg: 30, endDeg: 60, startAngle: 30 },
  { name: "Gemini", sanskrit: "Mithuna", symbol: "♊", element: "Air", modality: "Dual", lord: "Mercury", startDeg: 60, endDeg: 90, startAngle: 60 },
  { name: "Cancer", sanskrit: "Karka", symbol: "♋", element: "Water", modality: "Movable", lord: "Moon", startDeg: 90, endDeg: 120, startAngle: 90 },
  { name: "Leo", sanskrit: "Simha", symbol: "♌", element: "Fire", modality: "Fixed", lord: "Sun", startDeg: 120, endDeg: 150, startAngle: 120 },
  { name: "Virgo", sanskrit: "Kanya", symbol: "♍", element: "Earth", modality: "Dual", lord: "Mercury", startDeg: 150, endDeg: 180, startAngle: 150 },
  { name: "Libra", sanskrit: "Tula", symbol: "♎", element: "Air", modality: "Movable", lord: "Venus", startDeg: 180, endDeg: 210, startAngle: 180 },
  { name: "Scorpio", sanskrit: "Vrishchika", symbol: "♏", element: "Water", modality: "Fixed", lord: "Mars", startDeg: 210, endDeg: 240, startAngle: 210 },
  { name: "Sagittarius", sanskrit: "Dhanu", symbol: "♐", element: "Fire", modality: "Dual", lord: "Jupiter", startDeg: 240, endDeg: 270, startAngle: 240 },
  { name: "Capricorn", sanskrit: "Makara", symbol: "♑", element: "Earth", modality: "Movable", lord: "Saturn", startDeg: 270, endDeg: 300, startAngle: 270 },
  { name: "Aquarius", sanskrit: "Kumbha", symbol: "♒", element: "Air", modality: "Fixed", lord: "Saturn", startDeg: 300, endDeg: 330, startAngle: 300 },
  { name: "Pisces", sanskrit: "Meena", symbol: "♓", element: "Water", modality: "Dual", lord: "Jupiter", startDeg: 330, endDeg: 360, startAngle: 330 },
];

const ELEMENT_META: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode; sanskrit: string; lightBg: string }> = {
  Fire: { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", icon: <Flame className="w-3.5 h-3.5" />, sanskrit: "Agni", lightBg: "#ffedd5" },
  Earth: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: <Mountain className="w-3.5 h-3.5" />, sanskrit: "Prithvi", lightBg: "#dcfce7" },
  Air: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: <Wind className="w-3.5 h-3.5" />, sanskrit: "Vayu", lightBg: "#dbeafe" },
  Water: { color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc", icon: <Droplets className="w-3.5 h-3.5" />, sanskrit: "Jala", lightBg: "#cffafe" },
};

const MODALITY_META: Record<string, { icon: React.ReactNode; sanskrit: string; color: string; bg: string }> = {
  Movable: { icon: <MoveRight className="w-3.5 h-3.5" />, sanskrit: "Chara", color: "#dc2626", bg: "#fef2f2" },
  Fixed: { icon: <Anchor className="w-3.5 h-3.5" />, sanskrit: "Sthira", color: "#2563eb", bg: "#eff6ff" },
  Dual: { icon: <Repeat className="w-3.5 h-3.5" />, sanskrit: "Dwisvabhava", color: "#16a34a", bg: "#f0fdf4" },
};

export default function ZodiacWheel({ size = 520 }: { size?: number }) {
  const [selected, setSelected] = useState<SignData | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.38;
  const midR = size * 0.26;
  const innerR = size * 0.14;
  const labelR = size * 0.46;

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const describeArc = (startAngle: number, endAngle: number, r: number) => {
    const start = polarToCartesian(endAngle, r);
    const end = polarToCartesian(startAngle, r);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
  };

  return (
    <div className="relative w-full max-w-[640px] mx-auto select-none">
      {/* Modern card container */}
      <div className="rounded-3xl bg-gradient-to-br from-[#fdfcfa] to-[#f5f2ee] border border-amber-100/80 shadow-lg shadow-amber-900/5 p-4 sm:p-6">
        {/* Title */}
        <div className="text-center mb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-600 tracking-tight">Bha-Chakra</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">The 12 Rashis arranged in 360° with their elemental classifications</p>
        </div>

        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
          <defs>
            <filter id="zwShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#78350f" floodOpacity="0.12" />
            </filter>
            <filter id="chipShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Background rings */}
          <circle cx={cx} cy={cy} r={outerR + 2} fill="none" stroke="#d4a373" strokeWidth="2.5" />
          <circle cx={cx} cy={cy} r={outerR} fill="#fffbeb" stroke="#d4a373" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={midR} fill="none" stroke="#d4a373" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

          {/* 12 Interactive Segments */}
          {SIGNS.map((sign, idx) => {
            const meta = ELEMENT_META[sign.element];
            const isHovered = hovered === idx;
            const isSelected = selected?.name === sign.name;
            const midAngle = sign.startAngle + 15;
            const symbolPos = polarToCartesian(midAngle, (outerR + midR) / 2);
            const innerSymbolPos = polarToCartesian(midAngle, (midR + innerR) / 2);

            return (
              <g key={sign.name}>
                {/* Clickable wedge with subtle element fill */}
                <path
                  d={describeArc(sign.startAngle, sign.startAngle + 30, outerR)}
                  fill={isHovered || isSelected ? meta.lightBg : meta.bg}
                  stroke={meta.color}
                  strokeWidth={isHovered || isSelected ? 2.5 : 1}
                  opacity={isHovered || isSelected ? 0.95 : 0.35}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(sign)}
                />
                {/* Symbol chip in outer band */}
                <rect
                  x={symbolPos.x - size * 0.032}
                  y={symbolPos.y - size * 0.032}
                  width={size * 0.064}
                  height={size * 0.064}
                  rx={size * 0.012}
                  fill={meta.bg}
                  stroke={meta.border}
                  strokeWidth="1.5"
                  filter="url(#chipShadow)"
                  style={{ pointerEvents: "none" }}
                />
                <text
                  x={symbolPos.x}
                  y={symbolPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={size * 0.04}
                  fill={meta.color}
                  fontWeight="700"
                  style={{ pointerEvents: "none" }}
                >
                  {sign.symbol}
                </text>
                {/* Degree range in inner band */}
                <text
                  x={innerSymbolPos.x}
                  y={innerSymbolPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={size * 0.022}
                  fill="#a16207"
                  fontWeight="500"
                  style={{ pointerEvents: "none" }}
                >
                  {sign.startDeg}°
                </text>
              </g>
            );
          })}

          {/* Radial divider lines (only between outer and mid ring) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30;
            const start = polarToCartesian(angle, midR);
            const end = polarToCartesian(angle, outerR);
            return (
              <line
                key={`line-${i}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#d4a373"
                strokeWidth="1"
                opacity="0.7"
              />
            );
          })}

          {/* Outer labels (Sanskrit names outside the wheel) */}
          {SIGNS.map((sign) => {
            const midAngle = sign.startAngle + 15;
            const pos = polarToCartesian(midAngle, labelR);
            const meta = ELEMENT_META[sign.element];
            return (
              <g key={`label-${sign.name}`}>
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={size * 0.03}
                  fontWeight="700"
                  fill={meta.color}
                  style={{ pointerEvents: "none" }}
                >
                  {sign.sanskrit}
                </text>
              </g>
            );
          })}

          {/* Center circle on top */}
          <circle cx={cx} cy={cy} r={innerR} fill="#fff" stroke="#d4a373" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={innerR - 4} fill="#fff" stroke="#d4a373" strokeWidth="0.5" opacity="0.5" />
          <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.042} fontWeight="800" fill="#78350f" letterSpacing="1">
            Bha-Chakra
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.026} fill="#a16207" fontWeight="500">
            360° · 12 Rashis
          </text>

          {/* Cardinal direction markers */}
          {[
            { angle: 0, label: "Ascendant", sub: "East" },
            { angle: 90, label: "IC", sub: "North" },
            { angle: 180, label: "Descendant", sub: "West" },
            { angle: 270, label: "MC", sub: "South" },
          ].map((m) => {
            const pos = polarToCartesian(m.angle, outerR + 18);
            return (
              <g key={m.label}>
                <circle cx={pos.x} cy={pos.y} r={3} fill="#d4a373" />
                <text x={pos.x} y={pos.y - 8} textAnchor="middle" fontSize={size * 0.022} fontWeight="700" fill="#92400e">
                  {m.label}
                </text>
                <text x={pos.x} y={pos.y + 8} textAnchor="middle" fontSize={size * 0.02} fill="#b45309">
                  {m.sub}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Element Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          {Object.entries(ELEMENT_META).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
              <span className="text-xs font-semibold text-gray-700">{key}</span>
              <span className="text-[10px] text-gray-400">({meta.sanskrit})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Sign Detail Popup */}
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-white rounded-2xl border shadow-2xl p-5 w-full max-w-[340px] animate-in zoom-in-95 duration-200"
            style={{ borderColor: ELEMENT_META[selected.element].border }}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm"
                style={{ background: ELEMENT_META[selected.element].bg, color: ELEMENT_META[selected.element].color, border: `2px solid ${ELEMENT_META[selected.element].border}` }}
              >
                {selected.symbol}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selected.name}</h3>
                <p className="text-sm font-medium" style={{ color: ELEMENT_META[selected.element].color }}>
                  {selected.sanskrit}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: ELEMENT_META[selected.element].bg }}>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Element</span>
                <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: ELEMENT_META[selected.element].color }}>
                  {ELEMENT_META[selected.element].icon}
                  {selected.element} ({ELEMENT_META[selected.element].sanskrit})
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Modality</span>
                <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: MODALITY_META[selected.modality].color }}>
                  {MODALITY_META[selected.modality].icon}
                  {selected.modality} ({MODALITY_META[selected.modality].sanskrit})
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lord</span>
                <span className="text-sm font-bold text-amber-700">{selected.lord}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Degrees</span>
                <span className="text-sm font-bold text-gray-700">{selected.startDeg}° – {selected.endDeg}°</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed">
                <span className="font-semibold text-gray-700">{selected.name}</span> is a{" "}
                <span className="font-medium" style={{ color: ELEMENT_META[selected.element].color }}>{selected.element}</span>{" "}
                sign with <span className="font-medium text-gray-700">{selected.modality.toLowerCase()}</span> energy.
                It spans longitude {selected.startDeg}° to {selected.endDeg}° of the zodiac.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {hovered !== null && !selected && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg pointer-events-none animate-in fade-in duration-150">
          Click {SIGNS[hovered].sanskrit} to explore
        </div>
      )}
    </div>
  );
}
