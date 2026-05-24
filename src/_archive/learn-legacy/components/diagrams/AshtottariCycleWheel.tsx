"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AshtottariCycleWheelProps {
  size?: number;
}

const PLANETS = [
  { id: "surya",   name: "Sūrya",   en: "Sun",     years: 6,  color: "#f97316", lightBg: "#fff7ed", nakshatras: ["Krittikā", "Uttara Phālgunī", "Uttarāṣāḍhā"] },
  { id: "chandra", name: "Chandra",  en: "Moon",    years: 15, color: "#94a3b8", lightBg: "#f8fafc", nakshatras: ["Rohiṇī", "Hastā", "Śravaṇa"] },
  { id: "mangala", name: "Maṅgala", en: "Mars",    years: 8,  color: "#ef4444", lightBg: "#fef2f2", nakshatras: ["Mṛgaśīrṣā", "Chitrā", "Dhaniṣṭhā"] },
  { id: "budha",   name: "Budha",    en: "Mercury", years: 17, color: "#10b981", lightBg: "#ecfdf5", nakshatras: ["Ārdrā", "Svātī", "Śatabhiṣā"] },
  { id: "shani",   name: "Śani",     en: "Saturn",  years: 10, color: "#6366f1", lightBg: "#eef2ff", nakshatras: ["Puṣya", "Anurādhā", "Uttara Bhādrapadā"] },
  { id: "guru",    name: "Guru",     en: "Jupiter", years: 19, color: "#f59e0b", lightBg: "#fffbeb", nakshatras: ["Punarvasu", "Viśākhā", "Pūrva Bhādrapadā"] },
  { id: "rahu",    name: "Rāhu",     en: "Rahu",    years: 12, color: "#8b5cf6", lightBg: "#f5f3ff", nakshatras: ["Āśleṣā", "Jyeṣṭhā", "Revatī"] },
  { id: "shukra",  name: "Śukra",    en: "Venus",   years: 21, color: "#ec4899", lightBg: "#fdf2f8", nakshatras: ["Bharaṇī", "Pūrva Phālgunī", "Pūrvāṣāḍhā"] },
];

const TOTAL_YEARS = 108;
const KETU_NAKSHATRAS = ["Aśvinī", "Maghā", "Mūlā"];

/* ---- geometry helpers ---- */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export default function AshtottariCycleWheel({ size = 560 }: AshtottariCycleWheelProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.42;
  const innerR = size * 0.28;
  const midR = (outerR + innerR) / 2;
  const labelR = size * 0.46;

  /* Compute arc segments */
  const segments = useMemo(() => {
    let currentAngle = 0;
    return PLANETS.map((planet) => {
      const sweep = (planet.years / TOTAL_YEARS) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sweep;
      const midAngle = startAngle + sweep / 2;
      currentAngle = endAngle;
      return { ...planet, startAngle, endAngle, midAngle, sweep };
    });
  }, []);

  const activePlanet = selectedPlanet || hoveredPlanet;
  const activeData = activePlanet ? segments.find((s) => s.id === activePlanet) : null;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        style={{ maxWidth: size }}
        className="drop-shadow-sm"
      >
        {/* Background glow */}
        <defs>
          <radialGradient id="ashto-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id="ashto-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        <circle cx={cx} cy={cy} r={outerR + 12} fill="url(#ashto-glow)" />

        {/* Arc segments */}
        {segments.map((seg) => {
          const isActive = activePlanet === seg.id;
          const padAngle = 0.8;
          const s = seg.startAngle + padAngle;
          const e = seg.endAngle - padAngle;
          if (e <= s) return null;

          /* Build a thick arc path (annular sector) */
          const outerStart = polarToCartesian(cx, cy, outerR, s);
          const outerEnd = polarToCartesian(cx, cy, outerR, e);
          const innerStart = polarToCartesian(cx, cy, innerR, e);
          const innerEnd = polarToCartesian(cx, cy, innerR, s);
          const largeArc = e - s > 180 ? 1 : 0;

          const d = [
            `M ${outerStart.x} ${outerStart.y}`,
            `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
            `L ${innerStart.x} ${innerStart.y}`,
            `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
            "Z",
          ].join(" ");

          return (
            <g key={seg.id}>
              <motion.path
                d={d}
                fill={seg.color}
                opacity={activePlanet && !isActive ? 0.35 : 1}
                stroke="white"
                strokeWidth={2}
                filter={isActive ? "url(#ashto-shadow)" : undefined}
                style={{ cursor: "pointer" }}
                animate={{
                  scale: isActive ? 1.03 : 1,
                  opacity: activePlanet && !isActive ? 0.35 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onMouseEnter={() => setHoveredPlanet(seg.id)}
                onMouseLeave={() => setHoveredPlanet(null)}
                onClick={() => setSelectedPlanet(selectedPlanet === seg.id ? null : seg.id)}
              />

              {/* Year label inside arc */}
              {seg.sweep > 15 && (() => {
                const pos = polarToCartesian(cx, cy, midR, seg.midAngle);
                return (
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none select-none"
                    fill="white"
                    fontSize={seg.sweep > 25 ? 13 : 11}
                    fontWeight="700"
                  >
                    {seg.years}y
                  </text>
                );
              })()}

              {/* Planet name label outside */}
              {(() => {
                const pos = polarToCartesian(cx, cy, labelR, seg.midAngle);
                return (
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none select-none"
                    fill={seg.color}
                    fontSize={11}
                    fontWeight="700"
                  >
                    {seg.name}
                  </text>
                );
              })()}
            </g>
          );
        })}

        {/* Center circle */}
        <circle cx={cx} cy={cy} r={innerR - 6} fill="white" stroke="#f5f3ff" strokeWidth={2} />

        {/* Center content */}
        <text
          x={cx}
          y={cy - 14}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#7c3aed"
          fontSize={32}
          fontWeight="800"
          className="select-none"
        >
          108
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#a78bfa"
          fontSize={11}
          fontWeight="600"
          className="select-none"
        >
          Varsha
        </text>
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#c4b5fd"
          fontSize={9}
          fontWeight="500"
          className="select-none"
        >
          8 Graha Cycle
        </text>

        {/* Ketu excluded indicator — dashed ring outside */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR + 8}
          fill="none"
          stroke="#d1d5db"
          strokeWidth={1}
          strokeDasharray="4 6"
          opacity={0.5}
        />
      </svg>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {activeData ? (
          <motion.div
            key={activeData.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="mt-4 w-full max-w-md"
          >
            <div
              className="rounded-xl border-2 p-4"
              style={{ borderColor: activeData.color, backgroundColor: activeData.lightBg }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: activeData.color }}
                >
                  {activeData.years}y
                </div>
                <div>
                  <div className="font-bold text-gray-900">{activeData.name} ({activeData.en})</div>
                  <div className="text-xs text-gray-500">
                    {((activeData.years / TOTAL_YEARS) * 100).toFixed(1)}% of life cycle
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Ruled Nakshatras (Janma → Starting Dasha)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeData.nakshatras.map((n) => (
                    <span
                      key={n}
                      className="text-xs font-medium px-2 py-0.5 rounded-md border"
                      style={{
                        color: activeData.color,
                        borderColor: activeData.color + "40",
                        backgroundColor: activeData.color + "10",
                      }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-gray-400 italic">
              Tap any arc to explore a Graha&apos;s Mahadasha period
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ketu exclusion note */}
      <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-dashed border-gray-300 max-w-md">
        <span className="text-sm">🚫</span>
        <div>
          <span className="text-xs font-bold text-gray-600">Ketu — Excluded</span>
          <span className="text-[10px] text-gray-500 block">
            {KETU_NAKSHATRAS.join(", ")} → fallback to Vimshottari (these are Ketu&apos;s nakshatras in the 9-graha system)
          </span>
        </div>
      </div>
    </div>
  );
}
