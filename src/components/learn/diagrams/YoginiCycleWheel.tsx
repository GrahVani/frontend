"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface YoginiCycleWheelProps {
  size?: number;
}

const YOGINIS = [
  { id: "mangala",  name: "Maṅgalā",  ruler: "Chandra", rulerEn: "Moon",    years: 1, color: "#10b981", lightBg: "#ecfdf5", energy: "Auspicious, mental peace, nurturing",
    nakshatras: ["Ārdrā (6)", "Chitrā (14)", "Śravaṇa (22)"] },
  { id: "pingala",  name: "Piṅgalā",  ruler: "Sūrya",  rulerEn: "Sun",     years: 2, color: "#f97316", lightBg: "#fff7ed", energy: "Heat, distress, ego conflicts, authority",
    nakshatras: ["Punarvasu (7)", "Svātī (15)", "Dhaniṣṭhā (23)"] },
  { id: "dhanya",   name: "Dhanyā",    ruler: "Guru",   rulerEn: "Jupiter", years: 3, color: "#3b82f6", lightBg: "#eff6ff", energy: "Prosperity, wealth, childbirth, expansion",
    nakshatras: ["Puṣya (8)", "Viśākhā (16)", "Śatabhiṣā (24)"] },
  { id: "bhramari", name: "Bhrāmarī", ruler: "Maṅgala", rulerEn: "Mars",    years: 4, color: "#ef4444", lightBg: "#fef2f2", energy: "Erratic wandering, anger, impulsive action",
    nakshatras: ["Aśvinī (1)", "Āśleṣā (9)", "Anurādhā (17)", "P. Bhādra (25)"] },
  { id: "bhadrika", name: "Bhadrikā",  ruler: "Budha",  rulerEn: "Mercury", years: 5, color: "#6366f1", lightBg: "#eef2ff", energy: "Excellent results, intellect, communication",
    nakshatras: ["Bharaṇī (2)", "Maghā (10)", "Jyeṣṭhā (18)", "U. Bhādra (26)"] },
  { id: "ulka",     name: "Ulkā",      ruler: "Śani",   rulerEn: "Saturn",  years: 6, color: "#64748b", lightBg: "#f8fafc", energy: "Obstacles, grief, delays, karmic lessons",
    nakshatras: ["Kṛttikā (3)", "P. Phālgunī (11)", "Mūlā (19)", "Revatī (27)"] },
  { id: "siddha",   name: "Siddhā",    ruler: "Śukra",  rulerEn: "Venus",   years: 7, color: "#ec4899", lightBg: "#fdf2f8", energy: "Supreme success, romance, artistic mastery",
    nakshatras: ["Rohiṇī (4)", "U. Phālgunī (12)", "P. Āṣāḍhā (20)"] },
  { id: "sankata",  name: "Saṅkaṭā",   ruler: "Rāhu",   rulerEn: "Rahu",    years: 8, color: "#be123c", lightBg: "#fff1f2", energy: "Severe crisis, deep karma, transformation",
    nakshatras: ["Mṛgaśīrṣā (5)", "Hastā (13)", "U. Āṣāḍhā (21)"] },
];

const TOTAL_YEARS = 36;

/* ---- geometry helpers ---- */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function YoginiCycleWheel({ size = 520 }: YoginiCycleWheelProps) {
  const [hoveredYogini, setHoveredYogini] = useState<string | null>(null);
  const [selectedYogini, setSelectedYogini] = useState<string | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.42;
  const innerR = size * 0.26;
  const midR = (outerR + innerR) / 2;
  const labelR = size * 0.47;

  const segments = useMemo(() => {
    let currentAngle = 0;
    return YOGINIS.map((yogini) => {
      const sweep = (yogini.years / TOTAL_YEARS) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sweep;
      const midAngle = startAngle + sweep / 2;
      currentAngle = endAngle;
      return { ...yogini, startAngle, endAngle, midAngle, sweep };
    });
  }, []);

  const activeId = selectedYogini || hoveredYogini;
  const activeData = activeId ? segments.find((s) => s.id === activeId) : null;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        style={{ maxWidth: size }}
        className="drop-shadow-sm"
      >
        <defs>
          <radialGradient id="yog-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fce7f3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id="yog-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        <circle cx={cx} cy={cy} r={outerR + 12} fill="url(#yog-glow)" />

        {/* Arc segments */}
        {segments.map((seg) => {
          const isActive = activeId === seg.id;
          const padAngle = 0.8;
          const s = seg.startAngle + padAngle;
          const e = seg.endAngle - padAngle;
          if (e <= s) return null;

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
                opacity={activeId && !isActive ? 0.3 : 1}
                stroke="white"
                strokeWidth={2}
                filter={isActive ? "url(#yog-shadow)" : undefined}
                style={{ cursor: "pointer" }}
                animate={{
                  scale: isActive ? 1.04 : 1,
                  opacity: activeId && !isActive ? 0.3 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onMouseEnter={() => setHoveredYogini(seg.id)}
                onMouseLeave={() => setHoveredYogini(null)}
                onClick={() => setSelectedYogini(selectedYogini === seg.id ? null : seg.id)}
              />

              {/* Year label inside arc */}
              {seg.sweep > 12 && (() => {
                const pos = polarToCartesian(cx, cy, midR, seg.midAngle);
                return (
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none select-none"
                    fill="white"
                    fontSize={seg.sweep > 25 ? 13 : 10}
                    fontWeight="700"
                  >
                    {seg.years}y
                  </text>
                );
              })()}

              {/* Yogini name outside */}
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
                    fontSize={10}
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
        <circle cx={cx} cy={cy} r={innerR - 6} fill="white" stroke="#fce7f3" strokeWidth={2} />

        {/* Center content */}
        <text x={cx} y={cy - 14} textAnchor="middle" dominantBaseline="central"
          fill="#be123c" fontSize={30} fontWeight="800" className="select-none">
          36
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="central"
          fill="#f472b6" fontSize={11} fontWeight="600" className="select-none">
          Varsha
        </text>
        <text x={cx} y={cy + 22} textAnchor="middle" dominantBaseline="central"
          fill="#f9a8d4" fontSize={9} fontWeight="500" className="select-none">
          8 Yoginī Cycle
        </text>

        {/* Repeat arrows hint */}
        <circle cx={cx} cy={cy} r={outerR + 8} fill="none" stroke="#f9a8d4" strokeWidth={1}
          strokeDasharray="3 5" opacity={0.5} />
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
                  <div className="font-bold text-gray-900">{activeData.name}</div>
                  <div className="text-xs text-gray-500">
                    Ruler: {activeData.ruler} ({activeData.rulerEn}) · {activeData.years} Varsha ({((activeData.years / TOTAL_YEARS) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>

              {/* Energy */}
              <div className="mb-3">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                  Śakti Energy
                </div>
                <p className="text-sm text-gray-800 font-medium">{activeData.energy}</p>
              </div>

              {/* Nakshatras */}
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Ruled Nakshatras ({activeData.nakshatras.length})
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

              {/* Sankata warning */}
              {activeData.id === "sankata" && (
                <div className="mt-3 p-2.5 bg-rose-100 rounded-lg border border-rose-300 text-xs text-rose-800 font-medium">
                  ⚠️ Remainder 0 in (N+3) MOD 8 maps here — the &quot;zero-trap.&quot; Most karmically intense starting point.
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
            <p className="text-xs text-gray-400 italic">
              Tap any arc to explore a Yoginī&apos;s Śakti energy and ruled nakshatras
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cycle repetition note */}
      <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-lg border border-pink-200 max-w-md">
        <span className="text-sm">🔄</span>
        <span className="text-[10px] text-pink-700">
          The 36-year cycle repeats at ages 0 → 36 → 72 → 108. Three full cycles = Ashtottari&apos;s 108 years.
        </span>
      </div>
    </div>
  );
}
