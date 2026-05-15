"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KalachakraCycleWheelProps {
  size?: number;
}

const SIGNS = [
  { num: 1,  name: "Meṣa",        en: "Aries",       symbol: "♈", lord: "Maṅgala", lordEn: "Mars",    years: 7,  color: "#ef4444" },
  { num: 2,  name: "Vṛṣabha",     en: "Taurus",      symbol: "♉", lord: "Śukra",   lordEn: "Venus",   years: 16, color: "#f43f5e" },
  { num: 3,  name: "Mithuna",      en: "Gemini",      symbol: "♊", lord: "Budha",   lordEn: "Mercury", years: 9,  color: "#10b981" },
  { num: 4,  name: "Karka",        en: "Cancer",      symbol: "♋", lord: "Chandra", lordEn: "Moon",    years: 21, color: "#94a3b8" },
  { num: 5,  name: "Siṁha",       en: "Leo",         symbol: "♌", lord: "Sūrya",   lordEn: "Sun",     years: 5,  color: "#f59e0b" },
  { num: 6,  name: "Kanyā",       en: "Virgo",       symbol: "♍", lord: "Budha",   lordEn: "Mercury", years: 9,  color: "#10b981" },
  { num: 7,  name: "Tulā",        en: "Libra",       symbol: "♎", lord: "Śukra",   lordEn: "Venus",   years: 16, color: "#f43f5e" },
  { num: 8,  name: "Vṛścika",     en: "Scorpio",     symbol: "♏", lord: "Maṅgala", lordEn: "Mars",    years: 7,  color: "#ef4444" },
  { num: 9,  name: "Dhanu",        en: "Sagittarius", symbol: "♐", lord: "Guru",    lordEn: "Jupiter", years: 10, color: "#eab308" },
  { num: 10, name: "Makara",       en: "Capricorn",   symbol: "♑", lord: "Śani",    lordEn: "Saturn",  years: 4,  color: "#6366f1" },
  { num: 11, name: "Kumbha",       en: "Aquarius",    symbol: "♒", lord: "Śani",    lordEn: "Saturn",  years: 4,  color: "#6366f1" },
  { num: 12, name: "Mīna",        en: "Pisces",      symbol: "♓", lord: "Guru",    lordEn: "Jupiter", years: 10, color: "#eab308" },
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function KalachakraCycleWheel({ size = 520 }: KalachakraCycleWheelProps) {
  const [selectedSign, setSelectedSign] = useState<number | null>(null);
  const [direction, setDirection] = useState<"savya" | "apasavya">("savya");

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.43;
  const innerR = size * 0.3;
  const midR = (outerR + innerR) / 2;
  const labelR = size * 0.24;

  const segments = useMemo(() => {
    const sweep = 360 / 12; // equal 30° per sign
    return SIGNS.map((sign, i) => {
      const startAngle = i * sweep;
      const endAngle = startAngle + sweep;
      const midAngle = startAngle + sweep / 2;
      return { ...sign, startAngle, endAngle, midAngle, sweep };
    });
  }, []);

  const activeSign = selectedSign !== null ? segments.find((s) => s.num === selectedSign) : null;

  /* Arrow path for direction */
  const arrowR = outerR + 10;

  return (
    <div className="flex flex-col items-center">
      {/* Direction toggle */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
        <button
          onClick={() => setDirection("savya")}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
            direction === "savya" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ↻ Savya (Clockwise)
        </button>
        <button
          onClick={() => setDirection("apasavya")}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
            direction === "apasavya" ? "bg-white text-rose-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ↺ Apasavya (Reverse)
        </button>
      </div>

      <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: size }} className="drop-shadow-sm">
        <defs>
          <radialGradient id="kc-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <marker id="kc-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d={`M0,0 L8,3 L0,6`} fill={direction === "savya" ? "#10b981" : "#f43f5e"} />
          </marker>
        </defs>

        <circle cx={cx} cy={cy} r={outerR + 14} fill="url(#kc-glow)" />

        {/* Direction arrow arc */}
        <motion.path
          d={(() => {
            // Draw an arc showing direction
            const startA = direction === "savya" ? 10 : 350;
            const endA = direction === "savya" ? 340 : 20;
            const start = polarToCartesian(cx, cy, arrowR, startA);
            const end = polarToCartesian(cx, cy, arrowR, endA);
            const sweepFlag = direction === "savya" ? 1 : 0;
            return `M ${start.x} ${start.y} A ${arrowR} ${arrowR} 0 1 ${sweepFlag} ${end.x} ${end.y}`;
          })()}
          fill="none"
          stroke={direction === "savya" ? "#10b981" : "#f43f5e"}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          opacity={0.4}
          markerEnd="url(#kc-arrow)"
          key={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.3 }}
        />

        {/* Sign segments — equal 30° arcs */}
        {segments.map((seg) => {
          const isActive = selectedSign === seg.num;
          const padAngle = 0.6;
          const s = seg.startAngle + padAngle;
          const e = seg.endAngle - padAngle;

          const outerStart = polarToCartesian(cx, cy, outerR, s);
          const outerEnd = polarToCartesian(cx, cy, outerR, e);
          const innerStart = polarToCartesian(cx, cy, innerR, e);
          const innerEnd = polarToCartesian(cx, cy, innerR, s);

          const d = [
            `M ${outerStart.x} ${outerStart.y}`,
            `A ${outerR} ${outerR} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
            `L ${innerStart.x} ${innerStart.y}`,
            `A ${innerR} ${innerR} 0 0 0 ${innerEnd.x} ${innerEnd.y}`,
            "Z",
          ].join(" ");

          return (
            <g key={seg.num}>
              <motion.path
                d={d}
                fill={seg.color}
                opacity={selectedSign !== null && !isActive ? 0.25 : 1}
                stroke="white"
                strokeWidth={2}
                style={{ cursor: "pointer" }}
                animate={{
                  scale: isActive ? 1.04 : 1,
                  opacity: selectedSign !== null && !isActive ? 0.25 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onMouseEnter={() => setSelectedSign(seg.num)}
                onMouseLeave={() => setSelectedSign(null)}
                onClick={() => setSelectedSign(selectedSign === seg.num ? null : seg.num)}
              />

              {/* Symbol inside arc */}
              {(() => {
                const pos = polarToCartesian(cx, cy, midR, seg.midAngle);
                return (
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none select-none"
                    fill="white"
                    fontSize={16}
                  >
                    {seg.symbol}
                  </text>
                );
              })()}

              {/* Years label inside */}
              {(() => {
                const pos = polarToCartesian(cx, cy, labelR, seg.midAngle);
                return (
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none select-none"
                    fill="#6b7280"
                    fontSize={9}
                    fontWeight="600"
                  >
                    {seg.years}y
                  </text>
                );
              })()}
            </g>
          );
        })}

        {/* Center */}
        <circle cx={cx} cy={cy} r={innerR - 8} fill="white" stroke="#e5e7eb" strokeWidth={1.5} />
        <text x={cx} y={cy - 16} textAnchor="middle" dominantBaseline="central"
          fill="#7c3aed" fontSize={14} fontWeight="800" className="select-none">
          Kālachakra
        </text>
        <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="central"
          fill={direction === "savya" ? "#10b981" : "#f43f5e"} fontSize={11} fontWeight="600" className="select-none">
          {direction === "savya" ? "Savya ↻" : "Apasavya ↺"}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="central"
          fill="#9ca3af" fontSize={9} fontWeight="500" className="select-none">
          12 Rāśi Stations
        </text>
      </svg>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {activeSign ? (
          <motion.div
            key={activeSign.num}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="mt-4 w-full max-w-md"
          >
            <div className="rounded-xl border-2 p-4" style={{ borderColor: activeSign.color, backgroundColor: activeSign.color + "08" }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: activeSign.color }}>
                  {activeSign.symbol}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{activeSign.name} ({activeSign.en})</div>
                  <div className="text-xs text-gray-500">Lord: {activeSign.lord} ({activeSign.lordEn}) · {activeSign.years} Varsha</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-bold" style={{ color: activeSign.color }}>{activeSign.years}</div>
                  <div className="text-[10px] text-gray-400">years</div>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 mt-2 bg-gray-50 rounded-lg p-2">
                Same lord = same years: {activeSign.lordEn} signs always carry {activeSign.years} years in Kālachakra.
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
            <p className="text-xs text-gray-400 italic">Hover any sign to see its Kālachakra year allocation</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pada note */}
      <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg border border-amber-200 max-w-md">
        <span className="text-sm">📐</span>
        <span className="text-[10px] text-amber-700">
          Savya or Apasavya is determined by the <strong>Navāṁśa pada</strong> of the birth nakshatra. Each of the 108 padas maps to a specific starting sign and direction.
        </span>
      </div>
    </div>
  );
}
