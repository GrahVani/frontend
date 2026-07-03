"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Compass,
  LayoutGrid
} from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

// North Indian Chart House Centers (100x100 SVG coord system)
const NORTH_HOUSE_COORDS = [
  { house: 1, cx: 50, cy: 24, label: "H1 (Lagna)" },
  { house: 2, cx: 27, cy: 13, label: "H2" },
  { house: 3, cx: 13, cy: 27, label: "H3" },
  { house: 4, cx: 24, cy: 50, label: "H4" },
  { house: 5, cx: 13, cy: 73, label: "H5" },
  { house: 6, cx: 27, cy: 87, label: "H6" },
  { house: 7, cx: 50, cy: 76, label: "H7" },
  { house: 8, cx: 73, cy: 87, label: "H8" },
  { house: 9, cx: 87, cy: 73, label: "H9" },
  { house: 10, cx: 76, cy: 50, label: "H10" },
  { house: 11, cx: 87, cy: 27, label: "H11" },
  { house: 12, cx: 73, cy: 13, label: "H12" }
];

const SIGN_GRID_COORDS = [
  { sign: "Pisces", x: 0, y: 0, label: "Meena" },
  { sign: "Aries", x: 1, y: 0, label: "Meṣa" },
  { sign: "Taurus", x: 2, y: 0, label: "Vṛṣabha" },
  { sign: "Gemini", x: 3, y: 0, label: "Mithuna" },
  { sign: "Cancer", x: 3, y: 1, label: "Karka" },
  { sign: "Leo", x: 3, y: 2, label: "Siṁha" },
  { sign: "Virgo", x: 3, y: 3, label: "Kanyā" },
  { sign: "Libra", x: 2, y: 3, label: "Tulā" },
  { sign: "Scorpio", x: 1, y: 3, label: "Vṛścika" },
  { sign: "Sagittarius", x: 0, y: 3, label: "Dhanus" },
  { sign: "Capricorn", x: 0, y: 2, label: "Makara" },
  { sign: "Aquarius", x: 0, y: 1, label: "Kumbha" }
];

export function BirthTimeAccuracyAssessment() {
  const [birthTime, setBirthTime] = useState("12:00");
  const [uncertainty, setUncertainty] = useState(30); // in minutes
  const [reliability, setReliability] = useState<"reliable" | "approximate" | "unknown">("approximate");
  const [questionType, setQuestionType] = useState<"character" | "fine-timing" | "yes-no" | "year">("character");
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north"); // default to North India

  const handleReliabilityChange = (value: "reliable" | "approximate" | "unknown") => {
    setReliability(value);
    if (value === "reliable") setUncertainty(15);
    else if (value === "approximate") setUncertainty(60);
    else setUncertainty(180);
  };

  const baseLagnaDeg = useMemo(() => {
    const [hrs, mins] = birthTime.split(":").map(Number);
    const timeDiffMins = (hrs - 12) * 60 + (mins - 0);
    const deg = 18.45 + timeDiffMins * 0.25;
    return ((deg % 30) + 30) % 30;
  }, [birthTime]);

  const activeLagnaSign = useMemo(() => {
    const [hrs, mins] = birthTime.split(":").map(Number);
    const timeDiffMins = (hrs - 12) * 60 + (mins - 0);
    const absDeg = 318.45 + timeDiffMins * 0.25;
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs[(Math.floor((absDeg % 360) / 30) + 12) % 12];
  }, [birthTime]);

  const lagnaSignIndex = useMemo(() => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs.indexOf(activeLagnaSign) + 1; // 1-12
  }, [activeLagnaSign]);

  const lagnaSweep = useMemo(() => {
    const sweepRange = uncertainty * 0.25;
    const minDeg = baseLagnaDeg - sweepRange;
    const maxDeg = baseLagnaDeg + sweepRange;
    return {
      min: Math.max(0, minDeg),
      max: Math.min(30, maxDeg),
      rangeText: `${Math.max(0, minDeg).toFixed(2)}° to ${Math.min(30, maxDeg).toFixed(2)}°`,
      crossesBoundary: minDeg < 0 || maxDeg >= 30,
      span: sweepRange * 2
    };
  }, [baseLagnaDeg, uncertainty]);

  const dashaDriftMonths = useMemo(() => {
    return (uncertainty * 2.5) / 30.4;
  }, [uncertainty]);

  const boundaryFlags = useMemo(() => {
    const flags: string[] = [];
    if (lagnaSweep.crossesBoundary) {
      flags.push(`Lagna crosses boundary between ${activeLagnaSign} and adjacent sign within uncertainty window.`);
    } else if (baseLagnaDeg < 1.5 || baseLagnaDeg > 28.5) {
      flags.push(`Lagna is highly cusp-sensitive (${baseLagnaDeg.toFixed(2)}° ${activeLagnaSign}).`);
    }
    return flags;
  }, [baseLagnaDeg, activeLagnaSign, lagnaSweep]);

  const verdict = useMemo(() => {
    if (reliability === "unknown") {
      return {
        level: questionType === "fine-timing" ? "DECLINE" : "RECTIFY",
        rationale: "Timing predictions require a stable Lagna. Birth time completely unknown; rectification is required."
      };
    }
    if (questionType === "fine-timing" && (uncertainty > 45 || lagnaSweep.crossesBoundary || reliability === "approximate")) {
      return { level: "RECTIFY", rationale: "Timing is highly sensitive to Vimshottari balance drift. Rectification required." };
    }
    if (boundaryFlags.length > 0) {
      return { level: "PROCEED WITH FLAGS", rationale: "Data is generally reliable but boundaries are sensitive. State flags in record." };
    }
    return { level: "PROCEED", rationale: "Ready to proceed: data checks are clean, uncertainty is minimal." };
  }, [reliability, uncertainty, questionType, boundaryFlags, lagnaSweep]);

  return (
    <div
      className="p-6 md:p-8 rounded-2xl border font-sans"
      style={{
        backgroundColor: BG_TINT,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)"
      }}
    >
      <div className="pb-4 border-b mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Birth-Time Accuracy Assessor
          </h2>
          <p className="text-xs italic text-gray-600">
            Pre-flight checks: model Ascendant drift arcs and timing sensitivity in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle Button */}
          <div className="inline-flex rounded-lg border p-0.5 bg-amber-950/5" style={{ borderColor: HAIRLINE }}>
            <button
              onClick={() => setChartStyle("north")}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                chartStyle === "north" ? "bg-amber-800 text-white shadow-sm" : "text-gray-600 hover:text-amber-950"
              }`}
            >
              North India
            </button>
            <button
              onClick={() => setChartStyle("south")}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                chartStyle === "south" ? "bg-amber-800 text-white shadow-sm" : "text-gray-600 hover:text-amber-950"
              }`}
            >
              South India
            </button>
          </div>
          <div className="flex items-center gap-1 bg-amber-800/10 px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
            <Compass size={11} />
            STAGE 1
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Time (LMT):</label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Reliability:</label>
                <select
                  value={reliability}
                  onChange={(e) => handleReliabilityChange(e.target.value as any)}
                  className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800"
                >
                  <option value="reliable">Reliable (Cert)</option>
                  <option value="approximate">Approximate (Family)</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Time Uncertainty:</span>
                <span className="font-mono text-amber-900">±{uncertainty} mins</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={uncertainty}
                onChange={(e) => setUncertainty(Number(e.target.value))}
                className="w-full accent-amber-800 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
            <label className="block text-[10px] uppercase font-bold text-gray-500">Predictive Scope:</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as any)}
              className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800"
            >
              <option value="character">General Character (Tolerant)</option>
              <option value="year">Annual Year Reading (Moderate)</option>
              <option value="yes-no">Cuspal Yes/No (Strict)</option>
              <option value="fine-timing">Fine Timing (Extremely Strict)</option>
            </select>
          </div>

          {/* Verdict Card */}
          <div
            className="p-4 rounded-xl border shadow-sm"
            style={{
              borderColor: verdict.level === "PROCEED" ? "#16a34a" : verdict.level === "PROCEED WITH FLAGS" ? GOLD : "#dc2626",
              backgroundColor: verdict.level === "PROCEED" ? "rgba(22, 163, 74, 0.03)" : verdict.level === "PROCEED WITH FLAGS" ? "rgba(156, 122, 47, 0.03)" : "rgba(220, 38, 38, 0.03)"
            }}
          >
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">PRE-FLIGHT DIAGNOSIS</span>
            <h4
              className="text-sm font-bold flex items-center gap-1.5"
              style={{ color: verdict.level === "PROCEED" ? "#15803d" : verdict.level === "PROCEED WITH FLAGS" ? GOLD : "#b91c1c" }}
            >
              {verdict.level}
            </h4>
            <p className="text-xs text-gray-600 mt-1 leading-normal">{verdict.rationale}</p>
          </div>
        </div>

        {/* Right Graphical Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
              <span>{chartStyle === "north" ? "North Indian House Grid (Lagna Center)" : "South Indian Sign Grid"}</span>
              <strong className="font-mono text-amber-800">{activeLagnaSign} Ascendant ({baseLagnaDeg.toFixed(1)}°)</strong>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Conditional Chart Render */}
              <div className="w-48 h-48 md:w-52 md:h-52 shrink-0 bg-[#fbf9f4] border p-1.5 rounded-lg flex items-center justify-center" style={{ borderColor: HAIRLINE }}>
                {chartStyle === "north" ? (
                  // North Indian SVG Chart
                  <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                    {/* Outer border */}
                    <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={HAIRLINE} strokeWidth="0.8" />
                    
                    {/* Diagonal lines */}
                    <line x1="2" y1="2" x2="98" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                    <line x1="98" y1="2" x2="2" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />

                    {/* Inner Diamond */}
                    <line x1="50" y1="2" x2="2" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="2" y1="50" x2="50" y2="98" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="50" y1="98" x2="98" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="98" y1="50" x2="50" y2="2" stroke={HAIRLINE} strokeWidth="0.8" />

                    {/* Draw House mappings and Lagna highlight */}
                    {NORTH_HOUSE_COORDS.map((cell) => {
                      // H1 represents Lagna
                      const isLagnaHouse = cell.house === 1;
                      const isAdjacentCapricorn = cell.house === 12;
                      const isAdjacentPisces = cell.house === 2;
                      const isSweepBorderSpill = lagnaSweep.crossesBoundary && (isAdjacentCapricorn || isAdjacentPisces);

                      // Aquarius is 11, Pisces is 12, Aries is 1...
                      // H1 = lagnaSignIndex
                      const signNo = ((lagnaSignIndex + cell.house - 2) % 12) + 1;

                      let cellFill = "transparent";
                      if (isLagnaHouse) {
                        cellFill = lagnaSweep.crossesBoundary ? "rgba(220, 38, 38, 0.12)" : "rgba(156, 122, 47, 0.12)";
                      } else if (isSweepBorderSpill) {
                        cellFill = "rgba(220, 38, 38, 0.05)";
                      }

                      return (
                        <g key={cell.house}>
                          {cellFill !== "transparent" && (
                            <circle cx={cell.cx} cy={cell.cy} r="6" fill={cellFill} />
                          )}
                          <text
                            x={cell.cx}
                            y={cell.cy + 1.5}
                            textAnchor="middle"
                            fontSize="5.5"
                            fontWeight={isLagnaHouse ? "bold" : "normal"}
                            fill={isLagnaHouse ? GOLD : INK_SECONDARY}
                          >
                            {signNo}
                          </text>
                          {isLagnaHouse && (
                            <text x={cell.cx} y={cell.cy - 7} textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#dc2626">Lagna</text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                ) : (
                  // South Indian SVG Chart
                  <svg viewBox="0 0 160 160" className="w-full h-full font-serif">
                    {Array.from({ length: 4 }).map((_, r) =>
                      Array.from({ length: 4 }).map((_, c) => {
                        if (r > 0 && r < 3 && c > 0 && c < 3) return null;
                        return (
                          <rect
                            key={`${r}-${c}`}
                            x={c * 40}
                            y={r * 40}
                            width="40"
                            height="40"
                            fill="transparent"
                            stroke={HAIRLINE}
                            strokeWidth="0.8"
                          />
                        );
                      })
                    )}
                    {SIGN_GRID_COORDS.map((cell) => {
                      const isLagnaSign = cell.sign === activeLagnaSign;
                      return (
                        <g key={cell.sign}>
                          {isLagnaSign && (
                            <rect x={cell.x * 40 + 1} y={cell.y * 40 + 1} width="38" height="38" fill="rgba(156, 122, 47, 0.12)" />
                          )}
                          <text
                            x={cell.x * 40 + 20}
                            y={cell.y * 40 + 24}
                            textAnchor="middle"
                            fontSize="7.5"
                            fontWeight={isLagnaSign ? "bold" : "normal"}
                            fill={isLagnaSign ? GOLD : INK_SECONDARY}
                          >
                            {cell.label}
                          </text>
                          {isLagnaSign && (
                            <text x={cell.x * 40 + 20} y={cell.y * 40 + 12} textAnchor="middle" fontSize="6.5" fill="#dc2626" fontWeight="bold">Lagna</text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>

              {/* Status Readouts */}
              <div className="flex-1 space-y-4 w-full">
                <div className="border-l-2 pl-3 py-0.5" style={{ borderColor: GOLD }}>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Sweep range</span>
                  <span className="text-sm font-bold font-mono text-gray-800">{lagnaSweep.rangeText}</span>
                  <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                    {lagnaSweep.crossesBoundary ? (
                      <span className="text-red-700 block font-bold">⚠️ Warning: Sweeps across sign boundary! Unstable Lagna.</span>
                    ) : (
                      <span className="text-green-700 block font-semibold">✓ Lagna stays stable within sign.</span>
                    )}
                  </p>
                </div>

                <div className="border-l-2 pl-3 py-0.5 border-dashed" style={{ borderColor: GOLD }}>
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Vimśottarī Timing Shift</span>
                  <span className="text-sm font-bold font-mono text-gray-800">±{dashaDriftMonths.toFixed(1)} months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
