"use client";

import React, { useState, useMemo } from "react";
import { AlertTriangle, Info, Compass, ArrowRight } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

interface Planet {
  name: string;
  sign: string;
  deg: number;
  label: string;
  houseWhole: number;
  houseChalita: number;
  housePlacidus: number;
}

const BASE_PLANETS: Planet[] = [
  { name: "Venus", sign: "Scorpio", deg: 1.05, label: "Śukra", houseWhole: 10, houseChalita: 9, housePlacidus: 9 },
  { name: "Saturn", sign: "Scorpio", deg: 5.48, label: "Śani", houseWhole: 10, houseChalita: 9, housePlacidus: 9 },
  { name: "Sun", sign: "Scorpio", deg: 7.23, label: "Surya", houseWhole: 10, houseChalita: 9, housePlacidus: 9 },
  { name: "Moon", sign: "Pisces", deg: 12.45, label: "Chandra", houseWhole: 2, houseChalita: 1, housePlacidus: 1 },
  { name: "Jupiter", sign: "Capricorn", deg: 15.34, label: "Guru", houseWhole: 12, houseChalita: 11, housePlacidus: 11 },
  { name: "Mars", sign: "Virgo", deg: 28.12, label: "Mangal", houseWhole: 8, houseChalita: 8, housePlacidus: 7 }
];

// North Indian Chart House Centers (100x100 SVG coords)
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

// Grid mappings for South Indian chart
const SIGN_GRID_MAP: Record<string, { x: number; y: number; sanksrit: string }> = {
  "Pisces": { x: 0, y: 0, sanksrit: "Meena" },
  "Aries": { x: 1, y: 0, sanksrit: "Meṣa" },
  "Taurus": { x: 2, y: 0, sanksrit: "Vṛṣabha" },
  "Gemini": { x: 3, y: 0, sanksrit: "Mithuna" },
  "Cancer": { x: 3, y: 1, sanksrit: "Karka" },
  "Leo": { x: 3, y: 2, sanksrit: "Siṁha" },
  "Virgo": { x: 3, y: 3, sanksrit: "Kanyā" },
  "Libra": { x: 2, y: 3, sanksrit: "Tulā" },
  "Scorpio": { x: 1, y: 3, sanksrit: "Vṛścika" },
  "Sagittarius": { x: 0, y: 3, sanksrit: "Dhanus" },
  "Capricorn": { x: 0, y: 2, sanksrit: "Makara" },
  "Aquarius": { x: 0, y: 1, sanksrit: "Kumbha" }
};

export function HouseSystemChoiceVerifier() {
  const [stream, setStream] = useState<"Parashari" | "KP">("Parashari");
  const [houseSystem, setHouseSystem] = useState<"whole-sign" | "Bhāva Cālita" | "Placidus">("whole-sign");
  const [selectedPlanetName, setSelectedPlanetName] = useState<string>("Venus");
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north"); // default to North India

  const warnings = useMemo(() => {
    const list: string[] = [];
    if (stream === "KP" && houseSystem !== "Placidus") {
      list.push("House system mismatch: KP stream strictly requires Placidus cusps to identify sub-lords.");
    } else if (stream === "Parashari" && houseSystem === "Placidus") {
      list.push("Convention warning: Placidus cusps are typically not used in classical Parāśari, which assumes whole-sign or equal Bhāva Cālita.");
    }
    return list;
  }, [stream, houseSystem]);

  const selectedPlanet = useMemo(() => {
    return BASE_PLANETS.find((p) => p.name === selectedPlanetName) || BASE_PLANETS[0];
  }, [selectedPlanetName]);

  // Compute active house assignments based on selection
  const computedPlanets = useMemo(() => {
    return BASE_PLANETS.map((p) => {
      let activeHouse = p.houseWhole;
      if (houseSystem === "Bhāva Cālita") activeHouse = p.houseChalita;
      else if (houseSystem === "Placidus") activeHouse = p.housePlacidus;

      return {
        ...p,
        activeHouse
      };
    });
  }, [houseSystem]);

  // Group planets by active house for North Indian visual
  const planetsByHouse = useMemo(() => {
    const map: Record<number, typeof computedPlanets> = {};
    computedPlanets.forEach((p) => {
      if (!map[p.activeHouse]) map[p.activeHouse] = [];
      map[p.activeHouse].push(p);
    });
    return map;
  }, [computedPlanets]);

  // Group planets by sign for South Indian visual (in South Indian chart, signs are fixed)
  const planetsBySign = useMemo(() => {
    const map: Record<string, typeof computedPlanets> = {};
    computedPlanets.forEach((p) => {
      if (!map[p.sign]) map[p.sign] = [];
      map[p.sign].push(p);
    });
    return map;
  }, [computedPlanets]);

  const cuspVisualData = useMemo(() => {
    const p = selectedPlanet;
    let relativePositionPercent = 50; 
    let previousHouse = p.houseWhole - 1;
    let nextHouse = p.houseWhole;

    if (houseSystem === "whole-sign") {
      relativePositionPercent = (p.deg / 30) * 100;
      previousHouse = p.houseWhole - 1;
      nextHouse = p.houseWhole;
    } else {
      const activeHouse = houseSystem === "Bhāva Cālita" ? p.houseChalita : p.housePlacidus;
      if (p.deg < 5) {
        relativePositionPercent = 10 + (p.deg / 5) * 40; 
        previousHouse = activeHouse - 1;
        nextHouse = activeHouse;
      } else if (p.deg > 25) {
        relativePositionPercent = 50 + ((p.deg - 25) / 5) * 40; 
        previousHouse = activeHouse;
        nextHouse = activeHouse + 1;
      } else {
        relativePositionPercent = 50; 
        previousHouse = activeHouse;
        nextHouse = activeHouse;
      }
    }

    return {
      relativePositionPercent,
      previousHouse,
      nextHouse,
      p
    };
  }, [selectedPlanet, houseSystem]);

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
            House-System Choice Verifier
          </h2>
          <p className="text-xs italic text-gray-600">
            Cuspal alignment comparator: compare Whole-Sign, Bhāva Cālita, and Placidus placements.
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
          <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
            <Compass size={11} className="animate-spin-slow" />
            STAGE 3
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Parameters Selector
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Astrological Stream:</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800"
              >
                <option value="Parashari">Parāśari (Classical)</option>
                <option value="KP">KP (Krishnamurti Padhdhati)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">House System:</label>
              <select
                value={houseSystem}
                onChange={(e) => setHouseSystem(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800"
              >
                <option value="whole-sign">Whole-Sign (Rashi = House)</option>
                <option value="Bhāva Cālita">Bhāva Cālita (Equal Midpoint)</option>
                <option value="Placidus">Placidus (Cuspal Longitude)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
            <label className="block text-[10px] uppercase font-bold text-gray-500">Inspect Planet Cusp Proximity:</label>
            <div className="grid grid-cols-3 gap-2">
              {BASE_PLANETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPlanetName(p.name)}
                  className={`px-2 py-1.5 text-xs font-bold rounded border transition-all ${
                    selectedPlanetName === p.name ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-600 border-gray-200 hover:bg-amber-50/20"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display Panel */}
        <div className="lg:col-span-8 space-y-6">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Interactive Cuspal Horizon Ruler
          </span>

          {/* SVG Horizon Ruler */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
              <span>Planet placement relative to house boundary:</span>
              <strong className="text-amber-800 font-mono">
                {selectedPlanet.name} at {selectedPlanet.deg.toFixed(2)}° {selectedPlanet.sign}
              </strong>
            </div>

            <div className="w-full bg-[#fbf9f4] p-4 border rounded-lg" style={{ borderColor: HAIRLINE }}>
              <svg viewBox="0 0 200 60" className="w-full font-serif">
                {/* House boundary cusp line */}
                <line x1="100" y1="5" x2="100" y2="45" stroke="#dc2626" strokeWidth="1" strokeDasharray="2 2" />
                <text x="100" y="52" textAnchor="middle" fontSize="5" fill="#dc2626" fontWeight="bold">CUSP LINE</text>

                {/* Horizon Ruler bar */}
                <rect x="10" y="20" width="180" height="10" fill="rgba(156, 122, 47, 0.05)" stroke={HAIRLINE} strokeWidth="0.8" rx="2" />
                
                {/* Labels for houses */}
                <text x="50" y="15" textAnchor="middle" fontSize="6.5" fill={INK_SECONDARY} fontWeight="bold">
                  House {cuspVisualData.previousHouse}
                </text>
                <text x="150" y="15" textAnchor="middle" fontSize="6.5" fill={INK_SECONDARY} fontWeight="bold">
                  House {cuspVisualData.nextHouse}
                </text>

                {/* Planet sliding indicator */}
                <g transform={`translate(${10 + (cuspVisualData.relativePositionPercent / 100) * 180}, 25)`} className="transition-transform duration-500">
                  <circle cx="0" cy="0" r="5" fill={GOLD} stroke="white" strokeWidth="1" className="animate-pulse" />
                  <text x="0" y="-8" textAnchor="middle" fontSize="6" fontWeight="bold" fill={INK_PRIMARY}>
                    {selectedPlanet.name}
                  </text>
                  <text x="0" y="12" textAnchor="middle" fontSize="5.5" fontStyle="italic" fill={INK_SECONDARY}>
                    {selectedPlanet.deg.toFixed(1)}°
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* SVG Chart Comparison Area */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-xs font-bold text-gray-700 block mb-1">
              Live Chart View ({chartStyle === "north" ? "North Indian House Grid" : "South Indian Sign Grid"}):
            </span>

            <div className="flex justify-center">
              <div className="w-48 h-48 bg-[#fbf9f4] border p-1.5 rounded-lg flex items-center justify-center" style={{ borderColor: HAIRLINE }}>
                {chartStyle === "north" ? (
                  // North Indian SVG with house-system dynamic placements
                  <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                    <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="2" y1="2" x2="98" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                    <line x1="98" y1="2" x2="2" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                    <line x1="50" y1="2" x2="2" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="2" y1="50" x2="50" y2="98" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="50" y1="98" x2="98" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="98" y1="50" x2="50" y2="2" stroke={HAIRLINE} strokeWidth="0.8" />

                    {NORTH_HOUSE_COORDS.map((cell) => {
                      const planetsInHouse = planetsByHouse[cell.house] || [];
                      // Aquarius is Lagna (11)
                      const signNo = ((11 + cell.house - 2) % 12) + 1;

                      return (
                        <g key={cell.house}>
                          <text x={cell.cx} y={cell.cy + 1.5} textAnchor="middle" fontSize="4.5" fill={INK_SECONDARY}>
                            {signNo}
                          </text>
                          {planetsInHouse.map((p, idx) => (
                            <text
                              key={p.name}
                              x={cell.cx}
                              y={cell.cy - 4 - idx * 4}
                              textAnchor="middle"
                              fontSize="4"
                              fontWeight="bold"
                              fill={p.name === selectedPlanetName ? "#dc2626" : GOLD}
                            >
                              {p.label.substring(0, 2)}
                            </text>
                          ))}
                        </g>
                      );
                    })}
                  </svg>
                ) : (
                  // South Indian SVG with house-system dynamic indicators
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
                    {Object.keys(SIGN_GRID_MAP).map((sign) => {
                      const coords = SIGN_GRID_MAP[sign];
                      const planetsInSign = planetsBySign[sign] || [];

                      return (
                        <g key={sign}>
                          <text
                            x={coords.x * 40 + 20}
                            y={coords.y * 40 + 10}
                            textAnchor="middle"
                            fontSize="6.5"
                            fill={INK_SECONDARY}
                          >
                            {coords.sanksrit}
                          </text>
                          {planetsInSign.map((p, idx) => (
                            <text
                              key={p.name}
                              x={coords.x * 40 + 20}
                              y={coords.y * 40 + 18 + idx * 8}
                              textAnchor="middle"
                              fontSize="6"
                              fontWeight="bold"
                              fill={p.name === selectedPlanetName ? "#dc2626" : GOLD}
                            >
                              {p.label.substring(0, 3)} (H{p.activeHouse})
                            </text>
                          ))}
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Matrix table list */}
          <div className="overflow-x-auto bg-white rounded-xl border shadow-sm" style={{ borderColor: HAIRLINE }}>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-amber-950/5 text-gray-700 font-bold border-b" style={{ borderColor: HAIRLINE }}>
                  <th className="p-2.5 text-left">Planet</th>
                  <th className="p-2.5 text-center">Whole-Sign</th>
                  <th className="p-2.5 text-center">Bhāva Cālita</th>
                  <th className="p-2.5 text-center">Placidus</th>
                  <th className="p-2.5 text-left">Cusp Alignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {computedPlanets.map((p) => {
                  const isShifting = p.houseWhole !== p.houseChalita || p.houseWhole !== p.housePlacidus;
                  const isCuspNear = p.deg < 1.5 || p.deg > 28.5;

                  return (
                    <tr key={p.name} className={`hover:bg-amber-50/20 ${selectedPlanetName === p.name ? "bg-amber-50/30" : ""}`}>
                      <td className="p-2.5 font-bold font-sans text-gray-700">{p.name}</td>
                      <td className={`p-2.5 text-center font-bold ${houseSystem === "whole-sign" ? "text-amber-800 font-extrabold bg-amber-50" : ""}`}>H{p.houseWhole}</td>
                      <td className={`p-2.5 text-center font-bold ${houseSystem === "Bhāva Cālita" ? "text-amber-800 font-extrabold bg-amber-50" : ""}`}>H{p.houseChalita}</td>
                      <td className={`p-2.5 text-center font-bold ${houseSystem === "Placidus" ? "text-amber-800 font-extrabold bg-amber-50" : ""}`}>H{p.housePlacidus}</td>
                      <td className="p-2.5 text-[10px] font-sans">
                        {isShifting ? (
                          <span className="px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                            Shifts to H{p.activeHouse}
                          </span>
                        ) : isCuspNear ? (
                          <span className="px-1.5 py-0.5 rounded font-bold bg-yellow-100 text-yellow-800">
                            Cusp-sensitive
                          </span>
                        ) : (
                          <span className="text-gray-400">Stable</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Stream Warning */}
          {warnings.map((w, idx) => (
            <div key={idx} className="p-3 rounded-lg border bg-red-50 border-red-200 text-xs text-red-950 flex gap-2.5 items-start">
              <AlertTriangle size={15} className="text-red-700 mt-0.5 shrink-0" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
