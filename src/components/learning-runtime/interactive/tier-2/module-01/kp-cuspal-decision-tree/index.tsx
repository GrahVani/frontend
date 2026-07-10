"use client";

import { useMemo, useState } from "react";
import { Info, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { PRESETS } from '@/components/learning-runtime/interactive/layered-shared-data';

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

// Unequal Vimshottari years of planets
const VIMSHOTTARI_YEARS = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};

// Sub-lord sequences starting from Mercury Nakshatra (Aslesha/Jyeshtha/Revati)
const MERCURY_SUB_SEQUENCE: Array<{ name: keyof typeof VIMSHOTTARI_YEARS; color: string }> = [
  { name: "Mercury", color: "#0d9488" },
  { name: "Ketu", color: "#4b5563" },
  { name: "Venus", color: "#db2777" },
  { name: "Sun", color: "#ea580c" },
  { name: "Moon", color: "#2563eb" },
  { name: "Mars", color: "#dc2626" },
  { name: "Rahu", color: "#15803d" },
  { name: "Jupiter", color: "#d97706" },
  { name: "Saturn", color: "#7c3aed" }
];

export function KpCuspalDecisionTree() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("q1");
  const [nakshatraMinutes, setNakshatraMinutes] = useState<number>(320); // out of 800 (13d 20m)
  const [ayanamsaType, setAyanamsaType] = useState<"lahiri" | "kp">("kp");

  const preset = useMemo(() => {
    return PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
  }, [selectedPresetId]);

  // Adjust coordinates slightly if ayanamsa is Lahiri (introducing boundary shifts)
  const effectiveMinutes = ayanamsaType === "lahiri" ? Math.max(0, nakshatraMinutes - 24) : nakshatraMinutes;

  // Calculate segments
  let cumulativeWidth = 0;
  const segments = MERCURY_SUB_SEQUENCE.map((planet) => {
    const years = VIMSHOTTARI_YEARS[planet.name];
    const width = (years / 120) * 80; // Scale 120 years to 80 units in SVG
    const start = cumulativeWidth;
    cumulativeWidth += width;
    return {
      ...planet,
      start,
      width,
      years
    };
  });

  // Find active sub-lord
  const activeUnit = (effectiveMinutes / 800) * 80;
  const activeSegment = segments.find(s => activeUnit >= s.start && activeUnit < s.start + s.width) || segments[0];

  // Derive binary significations based on scenario & sub-lord
  // Let's assume Mercury, Jup, Ven, Rahu support Q1 (government post / career) and Q5 (marriage)
  // while Sat, Ketu, Sun, Mars deny or are neutral.
  const supportsEvent = ["Mercury", "Venus", "Jupiter", "Rahu"].includes(activeSegment.name);

  // Convert minutes to degrees-minutes
  const deg = Math.floor(nakshatraMinutes / 60);
  const min = nakshatraMinutes % 60;

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="kp-cuspal-decision-tree"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            KP Cuspal Decision Tree
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            KP Cuspal Sub-lord Yes/No event timing
          </p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider mb-1 font-bold font-sans" style={{ color: GOLD }}>
            Select Query Preset
          </label>
          <select
            value={selectedPresetId}
            onChange={(e) => setSelectedPresetId(e.target.value)}
            className="px-2 py-1 text-sm border rounded bg-transparent font-sans font-semibold"
            style={{ borderColor: HAIRLINE }}
          >
            {PRESETS.filter(p => p.suggestedType === "binary" || p.id === "q1" || p.id === "q5").map((p) => (
              <option key={p.id} value={p.id} style={{ background: SURFACE }}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>


      <div className="mb-6 p-4 rounded-lg border bg-white/40 shadow-sm" style={{ borderColor: HAIRLINE }}>
        <p className="text-sm font-semibold mb-1" style={{ color: GOLD }}>Question:</p>
        <p className="text-lg italic">"{preset.text}"</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Left Side: Controls & Slider */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg" style={{ color: GOLD }}>1. Nakṣatra Sub-lord Modulation</h3>

          {/* Ayanamsa Selector */}
          <div className="flex gap-4 items-center">
            <span className="text-sm font-semibold">Ayanāṁśa Reference:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setAyanamsaType("kp")}
                className={`px-3 py-1 text-xs font-bold rounded border transition ${
                  ayanamsaType === "kp" ? "bg-amber-800 text-white border-amber-950" : "bg-white/80 text-gray-700"
                }`}
              >
                KP Ayanāṁśa
              </button>
              <button
                onClick={() => setAyanamsaType("lahiri")}
                className={`px-3 py-1 text-xs font-bold rounded border transition ${
                  ayanamsaType === "lahiri" ? "bg-amber-850 text-white border-amber-950" : "bg-white/80 text-gray-700"
                }`}
              >
                Chitra Paksha (Lahiri)
              </button>
            </div>
          </div>

          {/* Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Nakṣatra Placement:</span>
              <span className="text-sm font-bold font-sans text-amber-900">{deg}° {min}' / 13° 20'</span>
            </div>
            <input
              type="range"
              min="0"
              max="799"
              value={nakshatraMinutes}
              onChange={(e) => setNakshatraMinutes(Number(e.target.value))}
              className="w-full accent-amber-700 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 block mt-1">
              Adjust position to see how the unequal divisions map to different planetary sub-lords.
            </span>
          </div>

          {/* SVG Sub-division Bar Visualizer */}
          <div className="w-full bg-white/50 border rounded-lg p-4 shadow-inner flex flex-col items-center" style={{ borderColor: HAIRLINE }}>
            <span className="text-xs uppercase tracking-wider mb-3 font-bold font-sans text-gray-500">Nakṣatra Division Map (13°20')</span>
            <svg className="w-full max-w-[280px] h-20" viewBox="0 0 100 25">
              {/* Segment rectangles */}
              {segments.map((seg, i) => (
                <rect
                  key={i}
                  x={10 + seg.start}
                  y="5"
                  width={seg.width}
                  height="8"
                  fill={seg.color}
                  opacity={activeSegment.name === seg.name ? "1" : "0.45"}
                  stroke="#fff"
                  strokeWidth="0.5"
                  className="transition-all duration-300"
                />
              ))}

              {/* Cursor indicator */}
              <line
                x1={10 + activeUnit}
                y1="2"
                x2={10 + activeUnit}
                y2="16"
                stroke="#2d261e"
                strokeWidth="1.5"
                className="transition-all duration-300 ease-out"
              />
              <polygon
                points={`${10 + activeUnit},2 ${10 + activeUnit - 2.5},-1.5 ${10 + activeUnit + 2.5},-1.5`}
                fill="#2d261e"
                className="transition-all duration-300 ease-out"
              />

              {/* Active Segment Label */}
              <text x="50" y="22" fontSize="3" fontWeight="bold" fill={INK_PRIMARY} textAnchor="middle" style={{ fontFamily: "sans-serif" }}>
                Active Sub-lord: {activeSegment.name} ({activeSegment.years} Years)
              </text>
            </svg>
          </div>
        </div>

        {/* Right Side: Verdict and Warnings */}
        <div className="flex flex-col justify-between p-6 border rounded-xl bg-white/40 shadow-inner" style={{ borderColor: HAIRLINE }}>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: GOLD }}>2. Binary Verdict</h3>

            <div className="p-4 rounded-lg border bg-white/80 shadow-sm mb-4" style={{ borderColor: HAIRLINE }}>
              <span className="text-xs uppercase tracking-wider block text-amber-900 font-sans font-bold">KP Signification Linkage</span>
              <p className="text-sm mt-1 leading-relaxed">
                The active sub-lord is <strong>{activeSegment.name}</strong>.
                {preset.id === "q1" ? (
                  supportsEvent ? (
                    " It connects directly with the positive career houses (6, 10, 11), confirming timing and success."
                  ) : (
                    " It connects with obstructing career houses (5, 8, 12), failing to confirm immediate promotion."
                  )
                ) : (
                  supportsEvent ? (
                    " It connects directly with positive relationship houses (2, 7, 11), indicating marriage concord."
                  ) : (
                    " It connects with delay and denial houses (1, 6, 10), indicating delay or friction."
                  )
                )}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-semibold font-sans text-gray-600">Event Verdict:</span>
                <span className={`px-2 py-0.5 text-xs font-bold font-sans rounded-full flex items-center gap-1 border ${
                  supportsEvent ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"
                }`}>
                  {supportsEvent ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                  {supportsEvent ? "Event Supported (Siddhi)" : "Event Unconfirmed / Delayed"}
                </span>
              </div>
            </div>

            {/* Boundary warning alert */}
            {Math.min(
              Math.abs(activeUnit - activeSegment.start),
              Math.abs(activeUnit - (activeSegment.start + activeSegment.width))
            ) < 1.5 && (
              <div className="p-3 rounded-lg border bg-orange-50 border-orange-200 text-orange-950 shadow-sm mb-4 animate-fade-in">
                <p className="font-bold text-xs flex items-center gap-1 font-sans">
                  <AlertTriangle size={14} className="text-orange-700" />
                  Boundary Proximity Warning (Sandhi)
                </p>
                <p className="text-[11px] leading-relaxed mt-1">
                  The placement lies within 15 arc-minutes of a sub-lord boundary. A birth time discrepancy of only 30 seconds will shift this prediction. Boundary verification is mandatory.
                </p>
              </div>
            )}
          </div>

          <div className="border-t pt-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-xs font-bold uppercase tracking-wider block text-gray-500 font-sans">KP Star-lord base</span>
            <p className="text-xs mt-1" style={{ color: INK_SECONDARY }}>
              Nakṣatras act as pipelines. The star lord holds the query's raw potential, but the sub-lord dictates the binary yes/no outcome.
            </p>
          </div>
        </div>
      </div>

      {/* Warnings & Rationale */}
      <div className="p-4 rounded-lg border flex items-start gap-3 bg-amber-50 border-amber-200 text-amber-800">
        <ShieldAlert size={22} className="shrink-0 mt-0.5 text-amber-700" />
        <div>
          <p className="font-bold text-sm">KP Precision Disclaimer & Timing Limits</p>
          <p className="text-xs mt-1 leading-relaxed">
            KP depends heavily on the Placidus house system and exact sub-lord boundaries. Always verify birth accuracy using ruling planet confirmation (Step 3) before locking binary judgments.
          </p>
        </div>
      </div>
    </div>
  );
}
