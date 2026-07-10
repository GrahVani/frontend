"use client";

import React, { useState, useMemo } from "react";
import { Compass, Sparkles } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
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

const HOUSE_THEMES: Record<number, string> = {
  1: "Self, health, new beginnings",
  2: "Wealth, family, speech",
  3: "Initiatives, siblings, journeys",
  4: "Home, mother, property, comforts",
  5: "Children, investments, education, romance",
  6: "Debts, enemies, disputes, service",
  7: "Marriage, partnerships, business relations",
  8: "Longevity, deep research, sudden events",
  9: "Higher wisdom, father, luck, travel",
  10: "Career, status, public reputation",
  11: "Gains, desires, networks",
  12: "Expenditure, isolation, spiritual release"
};

export function TransitContextAnalyzer() {
  const [saturnHouse, setSaturnHouse] = useState(10);
  const [jupiterHouse, setJupiterHouse] = useState(2);
  const [lagnaSign, setLagnaSign] = useState("Aquarius");
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north");

  const lagnaIndex = useMemo(() => {
    return ZODIAC_SIGNS.indexOf(lagnaSign);
  }, [lagnaSign]);

  // Saturn aspects houses 3, 7, 10 from its position, and occupies its own house
  const saturnInfluence = useMemo(() => {
    const list = [saturnHouse];
    list.push(((saturnHouse + 3 - 1) % 12) + 1);
    list.push(((saturnHouse + 7 - 1) % 12) + 1);
    list.push(((saturnHouse + 10 - 1) % 12) + 1);
    return list;
  }, [saturnHouse]);

  // Jupiter aspects houses 5, 7, 9 from its position, and occupies its own house
  const jupiterInfluence = useMemo(() => {
    const list = [jupiterHouse];
    list.push(((jupiterHouse + 5 - 1) % 12) + 1);
    list.push(((jupiterHouse + 7 - 1) % 12) + 1);
    list.push(((jupiterHouse + 9 - 1) % 12) + 1);
    return list;
  }, [jupiterHouse]);

  // Intersecting houses receive double transit trigger
  const doubleTransitHouses = useMemo(() => {
    return saturnInfluence.filter((h) => jupiterInfluence.includes(h));
  }, [saturnInfluence, jupiterInfluence]);

  // Compute exact signs aspected
  const saturnSigns = useMemo(() => {
    return saturnInfluence.map((h) => ZODIAC_SIGNS[(lagnaIndex + h - 1) % 12]).join(", ");
  }, [saturnInfluence, lagnaIndex]);

  const jupiterSigns = useMemo(() => {
    return jupiterInfluence.map((h) => ZODIAC_SIGNS[(lagnaIndex + h - 1) % 12]).join(", ");
  }, [jupiterInfluence, lagnaIndex]);

  const doubleTransitSigns = useMemo(() => {
    return doubleTransitHouses.map((h) => ZODIAC_SIGNS[(lagnaIndex + h - 1) % 12]).join(", ");
  }, [doubleTransitHouses, lagnaIndex]);

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
            Transit Context Analyzer
          </h2>
          <p className="text-xs italic text-gray-600">
            Step 4: Track transiting Saturn and Jupiter aspects to map double-transit timing triggers.
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
            MODULE 2.3.4
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Transit Controls
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Ascendant (Lagna) Sign:</label>
              <select
                value={lagnaSign}
                onChange={(e) => setLagnaSign(e.target.value)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
              >
                {ZODIAC_SIGNS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Saturn transit slider */}
            <div className="space-y-1.5 border-t pt-3" style={{ borderColor: HAIRLINE }}>
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span className="text-blue-700">Transiting Saturn:</span>
                <span className="font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{saturnHouse}H</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={saturnHouse}
                onChange={(e) => setSaturnHouse(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[9px] text-gray-400 font-bold block">Aspects: {saturnSigns}</span>
            </div>

            {/* Jupiter transit slider */}
            <div className="space-y-1.5 border-t pt-3" style={{ borderColor: HAIRLINE }}>
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span className="text-amber-800">Transiting Jupiter:</span>
                <span className="font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{jupiterHouse}H</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={jupiterHouse}
                onChange={(e) => setJupiterHouse(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[9px] text-gray-400 font-bold block">Aspects: {jupiterSigns}</span>
            </div>
          </div>

          {/* Trigger box */}
          <div
            className={`p-4 rounded-xl border transition-all text-xs font-semibold leading-relaxed ${
              doubleTransitHouses.length > 0 ? "bg-amber-50/50 border-amber-300" : "bg-white"
            }`}
            style={{ borderColor: doubleTransitHouses.length > 0 ? GOLD : HAIRLINE }}
          >
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">DOUBLE TRANSIT DETECTOR</span>
            {doubleTransitHouses.length > 0 ? (
              <div className="space-y-1 text-xs">
                <span className="text-amber-800 font-bold block flex items-center gap-1">
                  <Sparkles size={14} className="animate-pulse" /> Active Trigger: House {doubleTransitHouses.join(", ")} ({doubleTransitSigns})
                </span>
                <p className="text-gray-600 font-normal leading-normal">
                  expected event areas: <strong className="text-amber-900">{doubleTransitHouses.map((h) => HOUSE_THEMES[h]).join("; ")}</strong>.
                </p>
              </div>
            ) : (
              <span className="text-xs text-gray-400 block font-normal">No houses receive intersecting aspects. Move the sliders to test triggers.</span>
            )}
          </div>
        </div>

        {/* Visualizer Column */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Intersection Visualizer
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[260px]" style={{ borderColor: HAIRLINE }}>
            <div className="w-56 h-56 bg-[#fbf9f4] border p-2 rounded-lg" style={{ borderColor: HAIRLINE }}>
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
                    const isDouble = doubleTransitHouses.includes(cell.house);
                    const isSaturn = cell.house === saturnHouse;
                    const isJupiter = cell.house === jupiterHouse;
                    const rashiNo = ((lagnaIndex + cell.house - 1) % 12) + 1;

                    return (
                      <g key={cell.house}>
                        {isDouble && (
                          <rect x={cell.cx - 8} y={cell.cy - 8} width="16" height="16" rx="2" fill="rgba(156, 122, 47, 0.18)" stroke={GOLD} strokeWidth="1.2" className="animate-pulse" />
                        )}
                        <text
                          x={cell.cx}
                          y={cell.cy + 2.5}
                          textAnchor="middle"
                          fontSize={isSaturn || isJupiter || isDouble ? "5.5" : "4.5"}
                          fontWeight={isSaturn || isJupiter || isDouble ? "bold" : "normal"}
                          fill={isDouble ? GOLD : isSaturn ? "#3b82f6" : isJupiter ? "#f59e0b" : INK_SECONDARY}
                        >
                          {isSaturn && isJupiter ? "Sa+Ju" : isSaturn ? "Sa" : isJupiter ? "Ju" : cell.house}
                        </text>
                        <text x={cell.cx} y={cell.cy - 3} textAnchor="middle" fontSize="3" fill="#888">
                          {rashiNo}
                        </text>
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
                    const cellSignIndex = ZODIAC_SIGNS.indexOf(cell.sign);
                    const cellHouseNo = ((cellSignIndex - lagnaIndex + 12) % 12) + 1;

                    const isDouble = doubleTransitHouses.includes(cellHouseNo);
                    const isSaturn = cellHouseNo === saturnHouse;
                    const isJupiter = cellHouseNo === jupiterHouse;

                    return (
                      <g key={cell.sign}>
                        {isDouble && (
                          <rect x={cell.x * 40 + 1} y={cell.y * 40 + 1} width="38" height="38" fill="rgba(156, 122, 47, 0.18)" stroke={GOLD} strokeWidth="1" />
                        )}
                        <text
                          x={cell.x * 40 + 20}
                          y={cell.y * 40 + 24}
                          textAnchor="middle"
                          fontSize="6.5"
                          fontWeight={isSaturn || isJupiter || isDouble ? "bold" : "normal"}
                          fill={isDouble ? GOLD : isSaturn ? "#3b82f6" : isJupiter ? "#f59e0b" : INK_SECONDARY}
                        >
                          {isSaturn && isJupiter ? "Sa+Ju" : isSaturn ? "Sa" : isJupiter ? "Ju" : cell.label}
                        </text>
                        <text x={cell.x * 40 + 20} y={cell.y * 40 + 12} textAnchor="middle" fontSize="4.5" fill="#888">
                          {cellHouseNo}H
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
            <p className="text-[10px] text-gray-500 text-center italic mt-3 max-w-[320px]">
              Glow overlays highlight houses experiencing a double transit lock (intersection of Saturn and Jupiter).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
