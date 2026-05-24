"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, RotateCcw, Info } from "lucide-react";

// ─── Tithi Data ─────────────────────────────────────────────────
const SHUKLA_TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"
];

const KRISHNA_TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

const ALL_TITHIS = [...SHUKLA_TITHIS, ...KRISHNA_TITHIS];

// ─── Helpers ────────────────────────────────────────────────────
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  // Convert angle (0° at top, counter-clockwise) to radians
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function getTithiInfo(moonDeg: number) {
  const raw = moonDeg / 12;
  const tithiIndex = Math.floor(raw); // 0-29
  const tithiNumber = tithiIndex + 1; // 1-30
  const isShukla = tithiIndex < 15;
  const name = isShukla ? SHUKLA_TITHIS[tithiIndex] : KRISHNA_TITHIS[tithiIndex - 15];
  const paksha = isShukla ? "Shukla Paksha (Waxing)" : "Krishna Paksha (Waning)";
  const progressInTithi = ((raw - tithiIndex) * 100).toFixed(1);
  return { tithiNumber, name, paksha, isShukla, progressInTithi, tithiIndex };
}

// ─── Component ──────────────────────────────────────────────────
export default function SoliLunarTithiDial() {
  const [moonDeg, setMoonDeg] = useState(60);
  const [showDivisions, setShowDivisions] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const info = useMemo(() => getTithiInfo(moonDeg), [moonDeg]);

  const cx = 250;
  const cy = 250;
  const radius = 180;
  const labelRadius = 205;
  const outerRadius = 225;

  // Moon position on the dial (counter-clockwise from top)
  const moonPos = polarToCartesian(cx, cy, radius - 20, moonDeg);
  const sunPos = polarToCartesian(cx, cy, radius - 20, 0);

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMoonDeg(Number(e.target.value));
  }, []);

  const reset = useCallback(() => setMoonDeg(60), []);

  return (
    <div className="w-full bg-white py-4 sm:py-6 px-0">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-900">Soli-Lunar Tithi Dial</h3>
        <p className="text-sm text-amber-700 mt-1">
          Visualizing how the Moon&apos;s motion relative to the Sun creates the 30 Tithis
        </p>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
        <div className="bg-white rounded-xl border border-amber-200 p-2 text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Angular Distance</p>
          <p className="text-lg font-bold text-amber-800">{moonDeg.toFixed(1)}°</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-2 text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Tithi #</p>
          <p className="text-lg font-bold text-amber-800">{info.tithiNumber} / 30</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-2 text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Name</p>
          <p className="text-base font-bold text-amber-800">{info.name}</p>
        </div>
        <div className={`rounded-xl border p-2 text-center ${info.isShukla ? "bg-amber-50 border-amber-200" : "bg-indigo-50 border-indigo-200"}`}>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Phase</p>
          <p className={`text-sm font-bold ${info.isShukla ? "text-amber-800" : "text-indigo-800"}`}>{info.paksha}</p>
        </div>
      </div>

      {/* SVG Dial */}
      <div className="relative w-full mb-4">
        <svg viewBox="0 0 500 500" className="w-full h-auto max-h-[520px] mx-auto">
          {/* Background circles */}
          <circle cx={cx} cy={cy} r={radius} fill="#fafafa" stroke="#e5e7eb" strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={radius * 0.65} fill="none" stroke="#f3f4f6" strokeWidth={1} strokeDasharray="4 4" />
          <circle cx={cx} cy={cy} r={4} fill="#374151" />

          {/* Paksha Sectors */}
          {/* Shukla Paksha: 0° to 180° (counter-clockwise) - Warm */}
          <path
            d={describeArc(cx, cy, radius - 2, 0, 180)}
            fill="rgba(251, 191, 36, 0.12)"
            stroke="none"
          />
          {/* Krishna Paksha: 180° to 360° - Cool */}
          <path
            d={describeArc(cx, cy, radius - 2, 180, 360)}
            fill="rgba(99, 102, 241, 0.10)"
            stroke="none"
          />

          {/* Current Tithi Arc (highlight) */}
          <path
            d={describeArc(cx, cy, radius - 2, 0, moonDeg)}
            fill={info.isShukla ? "rgba(251, 191, 36, 0.35)" : "rgba(99, 102, 241, 0.30)"}
            stroke="none"
          />

          {/* Tithi Division Lines & Labels */}
          {showDivisions && Array.from({ length: 30 }).map((_, i) => {
            const angle = (i + 1) * 12; // 12°, 24°, 36° ... 360°
            const inner = polarToCartesian(cx, cy, radius * 0.55, angle);
            const outer = polarToCartesian(cx, cy, radius, angle);
            const labelPt = polarToCartesian(cx, cy, labelRadius, angle);
            const isMajor = i === 14 || i === 29; // Full Moon (180°) and New Moon (360°)
            const isShuklaDiv = i < 15;

            return (
              <g key={i}>
                <line
                  x1={inner.x} y1={inner.y}
                  x2={outer.x} y2={outer.y}
                  stroke={isMajor ? "#9ca3af" : "#d1d5db"}
                  strokeWidth={isMajor ? 2 : 1}
                  strokeDasharray={isMajor ? "0" : "2 2"}
                />
                {showLabels && (
                  <text
                    x={labelPt.x}
                    y={labelPt.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[9px] font-medium"
                    fill={isShuklaDiv ? "#b45309" : "#4338ca"}
                  >
                    {i + 1}
                  </text>
                )}
              </g>
            );
          })}

          {/* Paksha Labels */}
          <text x={cx - 70} y={cy - 20} textAnchor="middle" className="text-xs font-bold" fill="#b45309">
            Shukla Paksha
          </text>
          <text x={cx - 70} y={cy - 5} textAnchor="middle" className="text-[10px]" fill="#d97706">
            (Waxing / Bright)
          </text>
          <text x={cx + 70} y={cy - 20} textAnchor="middle" className="text-xs font-bold" fill="#4338ca">
            Krishna Paksha
          </text>
          <text x={cx + 70} y={cy - 5} textAnchor="middle" className="text-[10px]" fill="#6366f1">
            (Waning / Dark)
          </text>

          {/* Phase Labels */}
          <text x={cx} y={cy - radius - 12} textAnchor="middle" className="text-xs font-bold" fill="#374151">
            NEW MOON (Amavasya)
          </text>
          <text x={cx} y={cy + radius + 20} textAnchor="middle" className="text-xs font-bold" fill="#374151">
            FULL MOON (Purnima)
          </text>

          {/* 12° marker labels */}
          <text x={cx - radius - 35} y={cy + 5} textAnchor="middle" className="text-[10px] font-semibold" fill="#6b7280">
            90°
          </text>
          <text x={cx + radius + 35} y={cy + 5} textAnchor="middle" className="text-[10px] font-semibold" fill="#6b7280">
            270°
          </text>

          {/* Sun (fixed at 0° / top) */}
          <g>
            <circle cx={sunPos.x} cy={sunPos.y} r={14} fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} />
            <text x={sunPos.x} y={sunPos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={14}>☉</text>
          </g>
          <rect x={sunPos.x - 28} y={sunPos.y - 32} width={56} height={18} rx={6} fill="#fffbeb" stroke="#f59e0b" strokeWidth={1.5} />
          <text x={sunPos.x} y={sunPos.y - 22} textAnchor="middle" className="text-[10px] font-bold" fill="#92400e">SUN (0°)</text>

          {/* Moon (moves counter-clockwise) */}
          <motion.g
            animate={{ cx: moonPos.x, cy: moonPos.y }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            <circle cx={moonPos.x} cy={moonPos.y} r={14} fill="#e0e7ff" stroke="#6366f1" strokeWidth={2} />
            <text x={moonPos.x} y={moonPos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={14}>☽</text>
          </motion.g>
          <rect x={moonPos.x - 38} y={moonPos.y + 18} width={76} height={18} rx={6} fill="#eef2ff" stroke="#6366f1" strokeWidth={1.5} />
          <text x={moonPos.x} y={moonPos.y + 28} textAnchor="middle" className="text-[10px] font-bold" fill="#3730a3">
            MOON ({moonDeg.toFixed(0)}°)
          </text>

          {/* Angular distance arc indicator */}
          <path
            d={describeArc(cx, cy, radius + 15, 0, moonDeg)}
            fill="none"
            stroke={info.isShukla ? "#f59e0b" : "#6366f1"}
            strokeWidth={2}
            strokeDasharray="4 2"
            opacity={0.6}
          />
        </svg>
      </div>

      {/* Formula Display */}
      <div className="bg-white rounded-xl border border-amber-200 p-3 mb-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-semibold text-amber-800">Formula:</span>{" "}
              <code className="bg-amber-50 px-1.5 py-0.5 rounded text-amber-900 font-mono text-xs">
                Tithi = (Moon° - Sun°) ÷ 12°
              </code>
            </p>
            <p>
              <span className="font-semibold text-amber-800">Calculation:</span>{" "}
              <code className="bg-gray-50 px-1.5 py-0.5 rounded text-gray-800 font-mono text-xs">
                ({moonDeg.toFixed(1)}° - 0°) ÷ 12° = {(moonDeg / 12).toFixed(3)}
              </code>
            </p>
            <p>
              <span className="font-semibold text-amber-800">Result:</span>{" "}
              Integer part = {Math.floor(moonDeg / 12)}, so{" "}
              <span className="font-bold text-amber-800">Tithi #{info.tithiNumber} — {info.name}</span>
              {" "}(<span className={info.isShukla ? "text-amber-700" : "text-indigo-700"}>{info.paksha}</span>)
            </p>
            <p className="text-xs text-gray-500">
              Progress within current Tithi: {info.progressInTithi}% complete
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-amber-200 p-4 space-y-4">
        {/* Slider */}
        <div className="flex items-center gap-3">
          <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
          <label htmlFor="moon-slider" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Moon Position
          </label>
          <input
            id="moon-slider"
            type="range"
            min={0}
            max={359.9}
            step={0.1}
            value={moonDeg}
            onChange={handleSlider}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <span className="text-sm font-bold text-amber-800 w-16 text-right">{moonDeg.toFixed(1)}°</span>
        </div>

        {/* Toggle switches */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDivisions}
              onChange={(e) => setShowDivisions(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Show Tithi Divisions</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">Show Numbers</span>
          </label>
          <button
            onClick={reset}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to 60°
          </button>
        </div>
      </div>

      {/* Educational Callout */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-bold">Note:</span>{" "}
          The Moon moves <span className="font-semibold">counter-clockwise</span> — this is the true direction of zodiacal motion (Aries → Taurus → Gemini...). 
          The shaded area shows the angular distance covered. Every 12° segment represents one Tithi. 
          When the Moon reaches 180° (Full Moon), the Paksha switches from Shukla (waxing) to Krishna (waning).
        </p>
      </div>
    </div>
  );
}
