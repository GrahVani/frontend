"use client";

import React, { useState, useMemo } from "react";
import { AlertTriangle, CheckCircle, Compass, Info, Clock, Sparkles } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

// Five Tattvas (Elements) data with rich qualitative signatures
const TATTVAS = [
  { id: "akash", name: "Ākāśa", english: "Ether", color: "#8b5cf6", lord: "Jupiter", qualities: "Expansion, space, non-judgment", desc: "Spiritual connection, spatial clarity. Neutral transition element." },
  { id: "vayu", name: "Vāyu", english: "Air", color: "#10b981", lord: "Saturn", qualities: "Movement, quick intellect, thoughts", desc: "Intellectual activity, fast movements. Connects with Saturn/Rahu." },
  { id: "tejas", name: "Tejas", english: "Fire", color: "#ef4444", lord: "Mars", qualities: "Vigor, vision, transformation", desc: "Action, transformation, decisiveness. Connects with Sun/Mars." },
  { id: "apas", name: "Apas", english: "Water", color: "#3b82f6", lord: "Moon/Venus", qualities: "Flow, emotion, reflection", desc: "Emotion, intuition, reception. Connects with Moon/Venus." },
  { id: "prithvi", name: "Pṛthvī", english: "Earth", color: "#f59e0b", lord: "Mercury", qualities: "Stability, structure, materialization", desc: "Stability, material results. Connects with Mercury." }
];

const NORTH_HOUSE_COORDS = [
  { house: 1, cx: 50, cy: 24 },
  { house: 2, cx: 27, cy: 13 },
  { house: 3, cx: 13, cy: 27 },
  { house: 4, cx: 24, cy: 50 },
  { house: 5, cx: 13, cy: 73 },
  { house: 6, cx: 27, cy: 87 },
  { house: 7, cx: 50, cy: 76 },
  { house: 8, cx: 73, cy: 87 },
  { house: 9, cx: 87, cy: 73 },
  { house: 10, cx: 76, cy: 50 },
  { house: 11, cx: 87, cy: 27 },
  { house: 12, cx: 73, cy: 13 }
];

export function TattvaShuddhiChecker() {
  const [timeOffset, setTimeOffset] = useState(45); // minutes since sunrise
  const [chartRef, setChartRef] = useState<"Lagna" | "Dasha">("Lagna");
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north");

  // Local Sunrise reference: 06:12 AM
  const wallClockTime = useMemo(() => {
    const sunriseMins = 6 * 60 + 12;
    const currentMins = sunriseMins + timeOffset;
    const hrs = Math.floor(currentMins / 60) % 24;
    const mins = currentMins % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")} AM`;
  }, [timeOffset]);

  const chartElement = useMemo<string>(() => {
    if (chartRef === "Lagna") return "Air"; // Aquarius Lagna is Air
    return "Ether"; // Jupiter dasha is Ether
  }, [chartRef]);

  // Compute active Tattva based on the 120-minute cycle
  const activeTattva = useMemo(() => {
    const cycleMin = timeOffset % 120;
    if (cycleMin < 6) return TATTVAS[0]; 
    if (cycleMin < 18) return TATTVAS[1]; 
    if (cycleMin < 36) return TATTVAS[2]; 
    if (cycleMin < 60) return TATTVAS[3]; 
    if (cycleMin < 90) return TATTVAS[4]; 
    return TATTVAS[0]; 
  }, [timeOffset]);

  const coherenceResult = useMemo(() => {
    const momentEl = activeTattva.english;
    if (momentEl === chartElement) {
      return {
        status: "COHERENT RESONANCE",
        color: "#15803d",
        bg: "rgba(22, 163, 74, 0.04)",
        desc: `Element match! The query moment's active element (${momentEl}) matches the chart's ${chartRef} element (${chartElement}). This suggests the querent's mind is in alignment with the natal energy.`
      };
    }
    if ((momentEl === "Fire" && chartElement === "Water") || (momentEl === "Water" && chartElement === "Fire")) {
      return {
        status: "SHARP ELEMENT CLASH",
        color: "#b91c1c",
        bg: "rgba(220, 38, 38, 0.04)",
        desc: `Antagonistic clash (${momentEl} vs ${chartElement})! Fire and Water directly cancel each other out. This suggests the query moment is elementally discordant with the natal chart.`
      };
    }
    return {
      status: "NEUTRAL RESIDUE",
      color: GOLD,
      bg: "rgba(156, 122, 47, 0.04)",
      desc: `Neutral element relationship (${momentEl} query and ${chartElement} natal). The diagnostic is neutral; continue to Ruling Planets checks.`
    };
  }, [activeTattva, chartElement, chartRef]);

  return (
    <div
      className="p-6 md:p-8 rounded-2xl border font-sans animate-fade-in"
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
            Tattva-Śuddhi Diagnostic Checker
          </h2>
          <p className="text-xs italic text-gray-600">
            Coherence modeling: evaluate elements of the query moment against natal parameters.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
            <Compass size={11} className="animate-spin-slow" />
            MODULE 2.2.1
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Query Settings
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            {/* Sunrise Offset Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span className="flex items-center gap-1"><Clock size={13} /> Time Since Sunrise:</span>
                <span className="font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                  {timeOffset} mins ({wallClockTime})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="1"
                value={timeOffset}
                onChange={(e) => setTimeOffset(Number(e.target.value))}
                className="w-full accent-amber-800 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                <span>06:12 AM</span>
                <span>07:12 AM</span>
                <span>08:12 AM</span>
              </div>
            </div>

            {/* Element Reference dropdown */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Chart Element Reference:</label>
              <select
                value={chartRef}
                onChange={(e) => setChartRef(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
              >
                <option value="Lagna">Lagna Sign Element (Aquarius = Air)</option>
                <option value="Dasha">Running Daśā Lord Element (Jupiter = Ether)</option>
              </select>
            </div>
          </div>

          {/* Coherence display box */}
          <div
            className="p-4 rounded-xl border shadow-sm transition-all"
            style={{
              borderColor: coherenceResult.color,
              backgroundColor: coherenceResult.bg
            }}
          >
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">COHERENCE SIGNAL</span>
            <h4 className="text-sm font-bold" style={{ color: coherenceResult.color }}>
              {coherenceResult.status}
            </h4>
            <p className="text-xs text-gray-600 mt-1 leading-normal">{coherenceResult.desc}</p>
          </div>
        </div>

        {/* Visualizer Column */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Tattva Interlock & Chart
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 p-4 rounded-xl border bg-white shadow-sm" style={{ borderColor: HAIRLINE }}>
            {/* Tattva Visualizer Circles */}
            <div className="sm:col-span-6 flex flex-col justify-center gap-3">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Moment Tattva Loop</span>
              {TATTVAS.map((t) => {
                const isActive = t.id === activeTattva.id;
                return (
                  <div
                    key={t.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
                      isActive ? "bg-amber-50/40" : "opacity-40 border-transparent hover:opacity-70"
                    }`}
                    style={{ borderColor: isActive ? t.color : "transparent" }}
                  >
                    <div className="w-5 h-5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: t.color }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-gray-800 block truncate">{t.name} ({t.english})</span>
                      <span className="text-[9px] text-amber-800 font-bold block">{t.qualities}</span>
                      <span className="text-[8px] text-gray-400 block font-medium truncate">{t.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic chart visualizer */}
            <div className="sm:col-span-6 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l pl-0 sm:pl-4 pt-4 sm:pt-0" style={{ borderColor: HAIRLINE }}>
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Reference Chart</span>
              <div className="w-40 h-40 bg-[#fbf9f4] border p-1 rounded-lg" style={{ borderColor: HAIRLINE }}>
                {chartStyle === "north" ? (
                  <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                    <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="2" y1="2" x2="98" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                    <line x1="98" y1="2" x2="2" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                    <line x1="50" y1="2" x2="2" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="2" y1="50" x2="50" y2="98" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="50" y1="98" x2="98" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="98" y1="50" x2="50" y2="2" stroke={HAIRLINE} strokeWidth="0.8" />

                    {NORTH_HOUSE_COORDS.map((cell) => {
                      const isH1 = cell.house === 1;
                      return (
                        <g key={cell.house}>
                          <text x={cell.cx} y={cell.cy + 1} textAnchor="middle" fontSize="4.5" fill={INK_SECONDARY}>
                            {((11 + cell.house - 2) % 12) + 1}
                          </text>
                          {isH1 && (
                            <text x={cell.cx} y={cell.cy - 5} textAnchor="middle" fontSize="4" fontWeight="bold" fill={GOLD}>
                              As (Air)
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                ) : (
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
                    <g transform="translate(0, 0)">
                      <rect x="0" y="40" width="40" height="40" fill="rgba(156, 122, 47, 0.1)" />
                      <text x="20" y="64" textAnchor="middle" fontSize="7" fontWeight="bold" fill={GOLD}>Kumbha</text>
                      <text x="20" y="52" textAnchor="middle" fontSize="5" fill="#dc2626" fontWeight="bold">As (Air)</text>
                    </g>
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
