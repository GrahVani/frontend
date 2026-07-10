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
  nakshatra: string;
  label: string;
}

const BASE_PLANETS: Planet[] = [
  { name: "Ascendant", sign: "Aquarius", deg: 18.45, nakshatra: "Shatabhisha", label: "Lagnā" },
  { name: "Sun", sign: "Scorpio", deg: 7.23, nakshatra: "Anuradha", label: "Surya" },
  { name: "Moon", sign: "Pisces", deg: 12.45, nakshatra: "Uttara Bhadrapada", label: "Chandra" },
  { name: "Venus", sign: "Scorpio", deg: 1.05, nakshatra: "Vishakha", label: "Śukra" },
  { name: "Saturn", sign: "Scorpio", deg: 5.48, nakshatra: "Anuradha", label: "Śani" }
];

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

export function AyanamshaChoiceVerifier() {
  const [stream, setStream] = useState<"Parashari" | "KP">("Parashari");
  const [ayanamsa, setAyanamsa] = useState<"Lahiri" | "KP" | "Raman" | "Yukteshwar" | "Pushya-paksha">("Lahiri");
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north"); // default to North India

  const shift = useMemo(() => {
    if (ayanamsa === "KP") return 0.10;
    if (ayanamsa === "Raman") return -1.35;
    if (ayanamsa === "Yukteshwar") return -0.45;
    if (ayanamsa === "Pushya-paksha") return -2.10;
    return 0.00;
  }, [ayanamsa]);

  const computedPlanets = useMemo(() => {
    return BASE_PLANETS.map((p) => {
      let finalDeg = p.deg + shift;
      let finalSign = p.sign;
      let finalNak = p.nakshatra;
      let crossedBorder = false;

      if (finalDeg < 0) {
        finalDeg += 30;
        crossedBorder = true;
        if (p.sign === "Scorpio") {
          finalSign = "Libra";
          finalNak = "Chitra";
        } else if (p.sign === "Aquarius") {
          finalSign = "Capricorn";
          finalNak = "Dhanishta";
        }
      } else if (finalDeg >= 30) {
        finalDeg -= 30;
        crossedBorder = true;
        if (p.sign === "Scorpio") {
          finalSign = "Sagittarius";
          finalNak = "Mula";
        }
      }

      return {
        ...p,
        shiftedDeg: finalDeg,
        shiftedSign: finalSign,
        shiftedNak: finalNak,
        crossedBorder
      };
    });
  }, [shift]);

  const lagnaSignIndex = useMemo(() => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const lagna = computedPlanets.find(p => p.name === "Ascendant");
    const activeSign = lagna ? lagna.shiftedSign : "Aquarius";
    return signs.indexOf(activeSign) + 1; // 1-12
  }, [computedPlanets]);

  // Group planets by sign for South Indian visual
  const planetsBySign = useMemo(() => {
    const map: Record<string, typeof computedPlanets> = {};
    computedPlanets.forEach((p) => {
      if (!map[p.shiftedSign]) map[p.shiftedSign] = [];
      map[p.shiftedSign].push(p);
    });
    return map;
  }, [computedPlanets]);

  // Group planets by house for North Indian visual
  const planetsByHouse = useMemo(() => {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const map: Record<number, typeof computedPlanets> = {};

    computedPlanets.forEach((p) => {
      const sIndex = signs.indexOf(p.shiftedSign) + 1;
      const houseNo = ((sIndex - lagnaSignIndex + 12) % 12) + 1;
      if (!map[houseNo]) map[houseNo] = [];
      map[houseNo].push(p);
    });

    return map;
  }, [computedPlanets, lagnaSignIndex]);

  const warnings = useMemo(() => {
    const list: string[] = [];
    if (stream === "KP" && ayanamsa !== "KP") {
      list.push("Ayanāṁśa mismatch: KP stream requires KP Ayanāṁśa to accurately calculate cuspal sub-lords.");
    } else if (stream === "Parashari" && ayanamsa === "KP") {
      list.push("Convention warning: KP Ayanāṁśa is typically not applied to classical Parāśari readings.");
    }
    return list;
  }, [stream, ayanamsa]);

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
            Ayanāṁśa Choice Verifier
          </h2>
          <p className="text-xs italic text-gray-600">
            Reference offset calculator: analyze planetary shifts across different ayanāṁśas.
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
            <Compass size={11} />
            STAGE 2
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Settings Panel
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
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Ayanāṁśa System:</label>
              <select
                value={ayanamsa}
                onChange={(e) => setAyanamsa(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800"
              >
                <option value="Lahiri">Chitrapakṣa (Lahiri) [Base]</option>
                <option value="KP">KP Ayanāṁśa (+0°06')</option>
                <option value="Raman">B.V. Raman (-1°21')</option>
                <option value="Yukteshwar">Sri Yukteshwar (-0°27')</option>
                <option value="Pushya-paksha">Pushya-pakṣa (-2°06')</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-2 text-xs leading-relaxed" style={{ borderColor: HAIRLINE }}>
            <span className="font-bold text-amber-800 block mb-0.5 flex items-center gap-1.5">
              <Info size={13} /> Active Shift Offset:
            </span>
            <span>
              The selected ayanāṁśa shifts coordinates by <strong className="text-amber-800">{shift.toFixed(2)}°</strong> relative to Lahiri.
            </span>
          </div>
        </div>

        {/* Chart and Shifts Panel */}
        <div className="lg:col-span-8 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Interactive Zodiac Chart
          </span>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4 rounded-xl border bg-white shadow-sm" style={{ borderColor: HAIRLINE }}>
            {/* North Indian vs South Indian SVG */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-44 h-44 bg-[#fbf9f4] border p-1.5 rounded-lg flex items-center justify-center" style={{ borderColor: HAIRLINE }}>
                {chartStyle === "north" ? (
                  // North Indian SVG with dynamic planets list
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
                      const signNo = ((lagnaSignIndex + cell.house - 2) % 12) + 1;

                      return (
                        <g key={cell.house}>
                          <text x={cell.cx} y={cell.cy + 1} textAnchor="middle" fontSize="4.5" fill={INK_SECONDARY}>
                            {signNo}
                          </text>
                          {planetsInHouse.map((p, idx) => {
                            const isWarning = p.crossedBorder;
                            return (
                              <text
                                key={p.name}
                                x={cell.cx}
                                y={cell.cy - 4 - idx * 4}
                                textAnchor="middle"
                                fontSize="4"
                                fontWeight="bold"
                                fill={isWarning ? "#dc2626" : GOLD}
                              >
                                {p.label.substring(0, 2)}
                              </text>
                            );
                          })}
                        </g>
                      );
                    })}
                  </svg>
                ) : (
                  // South Indian SVG with planets list
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
                              y={coords.y * 40 + 20 + idx * 8}
                              textAnchor="middle"
                              fontSize="6.5"
                              fontWeight="bold"
                              fill={p.crossedBorder ? "#dc2626" : GOLD}
                            >
                              {p.label.substring(0, 3)}
                            </text>
                          ))}
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>
            </div>

            {/* Shift comparison details */}
            <div className="md:col-span-7 space-y-3.5">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Planet Coordinate Shift:</span>
              <div className="divide-y text-xs font-mono">
                {computedPlanets.map((p) => (
                  <div key={p.name} className="py-2 flex justify-between items-center hover:bg-amber-50/10">
                    <span className="font-sans font-bold text-gray-700">{p.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{p.deg.toFixed(1)}° {p.sign}</span>
                      <ArrowRight size={12} className="text-amber-800" />
                      <span className={`font-bold ${p.crossedBorder ? "text-red-700 bg-red-50 px-1 py-0.5 rounded border border-red-200" : "text-amber-900"}`}>
                        {p.shiftedDeg.toFixed(1)}° {p.shiftedSign}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Warnings */}
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
