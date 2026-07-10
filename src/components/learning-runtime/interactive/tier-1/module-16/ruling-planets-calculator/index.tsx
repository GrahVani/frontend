"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AlertTriangle, Compass, Info, Play, Pause, Check } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

// North Indian House Centers (100x100 SVG coords)
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

// Fixed Natal reference values for comparison
const NATAL_RPS = {
  lagnaSignLord: "Saturn", // Aquarius
  lagnaStarLord: "Rahu",   // Shatabhisha
  moonSignLord: "Jupiter", // Pisces
  moonStarLord: "Saturn",  // Uttara Bhadrapada
  dayLord: "Saturn"        // Saturday
};

export function RulingPlanetsCalculator() {
  const [timeOffsetMins, setTimeOffsetMins] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north");
  const [dayOfWeek, setDayOfWeek] = useState<"Saturday" | "Sunday" | "Monday">("Saturday");

  // Time simulator engine
  useEffect(() => {
    let intervalId: any;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setTimeOffsetMins((prev) => (prev + 1) % 1440);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying]);

  const baseLagnaDeg = useMemo(() => {
    const deg = 18.45 + timeOffsetMins * 0.25;
    return ((deg % 30) + 30) % 30;
  }, [timeOffsetMins]);

  const activeLagnaSign = useMemo(() => {
    const absDeg = 318.45 + timeOffsetMins * 0.25;
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs[(Math.floor((absDeg % 360) / 30) + 12) % 12];
  }, [timeOffsetMins]);

  const lagnaSignIndex = useMemo(() => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs.indexOf(activeLagnaSign) + 1;
  }, [activeLagnaSign]);

  const lagnaStarLord = useMemo(() => {
    if (activeLagnaSign === "Aquarius") {
      if (baseLagnaDeg < 6.67) return "Mars";
      if (baseLagnaDeg < 20.00) return "Rahu";
      return "Jupiter";
    }
    if (activeLagnaSign === "Pisces") {
      if (baseLagnaDeg < 3.33) return "Jupiter";
      if (baseLagnaDeg < 16.67) return "Saturn";
      return "Mercury";
    }
    return "Sun";
  }, [activeLagnaSign, baseLagnaDeg]);

  const lagnaSignLord = useMemo(() => {
    if (activeLagnaSign === "Aquarius") return "Saturn";
    if (activeLagnaSign === "Pisces") return "Jupiter";
    if (activeLagnaSign === "Capricorn") return "Saturn";
    return "Mars";
  }, [activeLagnaSign]);

  const moonSignLord = "Jupiter";
  const moonStarLord = "Saturn";

  const dayLord = useMemo(() => {
    if (dayOfWeek === "Saturday") return "Saturn";
    if (dayOfWeek === "Sunday") return "Sun";
    return "Moon";
  }, [dayOfWeek]);

  // Volatility boundary crossed alert
  const isBoundaryCrossed = useMemo(() => {
    return baseLagnaDeg < 0.5 || baseLagnaDeg > 29.5;
  }, [baseLagnaDeg]);

  // Resonance calculations: returns which query lords match natal chart parameters
  const resonanceMatches = useMemo(() => {
    const matches: string[] = [];
    const natalSet = new Set(Object.values(NATAL_RPS));

    if (natalSet.has(lagnaSignLord)) matches.push(`Lagna Sign Lord (${lagnaSignLord})`);
    if (natalSet.has(lagnaStarLord)) matches.push(`Lagna Star Lord (${lagnaStarLord})`);
    if (natalSet.has(dayLord)) matches.push(`Day Lord (${dayLord})`);

    return matches;
  }, [lagnaSignLord, lagnaStarLord, dayLord]);

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
          <h2 className="text-2xl font-bold tracking-tight text-amber-900 animate-fade-in" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Ruling Planets Calculator
          </h2>
          <p className="text-xs italic text-gray-600">
            Real-time volatility simulator: calculate sign/star lord changes at query moments.
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
            MODULE 2.2.2
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Time-Travel Cockpit
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-800 rounded-lg hover:bg-amber-900 shadow-sm"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                {isPlaying ? "Pause Sim" : "Play Tick (+1m)"}
              </button>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setTimeOffsetMins((prev) => (prev - 10 + 1440) % 1440)}
                  className="px-2 py-1.5 text-xs rounded border hover:bg-amber-50 bg-transparent text-gray-600"
                  style={{ borderColor: HAIRLINE }}
                >
                  -10m
                </button>
                <button
                  onClick={() => setTimeOffsetMins((prev) => (prev + 10) % 1440)}
                  className="px-2 py-1.5 text-xs rounded border hover:bg-amber-50 bg-transparent text-gray-600"
                  style={{ borderColor: HAIRLINE }}
                >
                  +10m
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-gray-700 pt-1.5 border-t" style={{ borderColor: HAIRLINE }}>
              <span>Simulated Query Time:</span>
              <span className="font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-bold">
                12:{(timeOffsetMins % 60).toString().padStart(2, "0")} LMT
              </span>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Query Weekday:</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
              >
                <option value="Saturday">Saturday (Day Lord: Saturn)</option>
                <option value="Sunday">Sunday (Day Lord: Sun)</option>
                <option value="Monday">Monday (Day Lord: Moon)</option>
              </select>
            </div>
          </div>

          {/* Resonance HUD */}
          <div
            className={`p-4 rounded-xl border transition-all shadow-sm ${
              resonanceMatches.length > 1 ? "bg-green-50/50 border-green-300" : "bg-white"
            }`}
            style={{ borderColor: resonanceMatches.length > 1 ? "#16a34a" : HAIRLINE }}
          >
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Resonance Diagnostics</span>
            {resonanceMatches.length > 0 ? (
              <div className="space-y-1.5 text-xs">
                <span className="text-green-700 font-bold block flex items-center gap-1">
                  <Check size={14} /> Resonance Detected!
                </span>
                <span className="text-gray-600 block leading-relaxed">
                  Query planets match the natal chart profile: <strong className="text-amber-800">{resonanceMatches.join(", ")}</strong>.
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-400 block">No immediate resonance locks detected. Proceed with normal caveats.</span>
            )}
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Interactive Diagnostics
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 p-4 rounded-xl border bg-white shadow-sm" style={{ borderColor: HAIRLINE }}>
            {/* SVG Chart */}
            <div className="sm:col-span-5 flex justify-center">
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
                      const signNo = ((lagnaSignIndex + cell.house - 2) % 12) + 1;

                      return (
                        <g key={cell.house}>
                          <text x={cell.cx} y={cell.cy + 1.5} textAnchor="middle" fontSize="4.5" fill={INK_SECONDARY}>
                            {signNo}
                          </text>
                          {isH1 && (
                            <text x={cell.cx} y={cell.cy - 5} textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#dc2626">Lagnā</text>
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
                    {SIGN_GRID_COORDS.map((cell) => {
                      const isLagnaSign = cell.sign === activeLagnaSign;
                      return (
                        <g key={cell.sign}>
                          {isLagnaSign && (
                            <rect x={cell.x * 40 + 1} y={cell.y * 40 + 1} width="38" height="38" fill="rgba(156, 122, 47, 0.1)" />
                          )}
                          <text x={cell.x * 40 + 20} y={cell.y * 40 + 24} textAnchor="middle" fontSize="7" fill={isLagnaSign ? GOLD : INK_SECONDARY}>{cell.label}</text>
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>
            </div>

            {/* Computed Ruling Planets */}
            <div className="sm:col-span-7 space-y-3">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Ruling Planets Output:</span>
              
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] font-sans border-collapse">
                  <thead>
                    <tr className="bg-amber-950/5 text-gray-600 border-b" style={{ borderColor: HAIRLINE }}>
                      <th className="p-1.5 text-left">RP Level</th>
                      <th className="p-1.5 text-left">Query moment</th>
                      <th className="p-1.5 text-left">Natal Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                      <td className="p-1.5 font-bold text-gray-500">Lagna Sign</td>
                      <td className="p-1.5 font-bold text-amber-800">{lagnaSignLord}</td>
                      <td className="p-1.5 text-gray-400">{NATAL_RPS.lagnaSignLord}</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                      <td className="p-1.5 font-bold text-gray-500">Lagna Star</td>
                      <td className="p-1.5 font-bold text-amber-800">{lagnaStarLord}</td>
                      <td className="p-1.5 text-gray-400">{NATAL_RPS.lagnaStarLord}</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                      <td className="p-1.5 font-bold text-gray-500">Moon Sign</td>
                      <td className="p-1.5 font-bold text-amber-800">{moonSignLord}</td>
                      <td className="p-1.5 text-gray-400">{NATAL_RPS.moonSignLord}</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                      <td className="p-1.5 font-bold text-gray-500">Moon Star</td>
                      <td className="p-1.5 font-bold text-amber-800">{moonStarLord}</td>
                      <td className="p-1.5 text-gray-400">{NATAL_RPS.moonStarLord}</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                      <td className="p-1.5 font-bold text-gray-500">Day Lord</td>
                      <td className="p-1.5 font-bold text-amber-800">{dayLord}</td>
                      <td className="p-1.5 text-gray-400">{NATAL_RPS.dayLord}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
