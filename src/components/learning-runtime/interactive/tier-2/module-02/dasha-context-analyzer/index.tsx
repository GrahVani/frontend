"use client";

import React, { useState, useMemo } from "react";
import { Compass } from "lucide-react";

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

export function DashaContextAnalyzer() {
  const [dashaLord, setDashaLord] = useState("Saturn");
  const [ownership, setOwnership] = useState<"trikona" | "upachaya" | "dusthana">("trikona");
  const [placement, setPlacement] = useState(1); 
  const [lagnaSign, setLagnaSign] = useState("Aquarius");
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north");

  // Determine sign index of Lagna
  const lagnaIndex = useMemo(() => {
    return ZODIAC_SIGNS.indexOf(lagnaSign);
  }, [lagnaSign]);

  // Compute houses aspected by this lord (relative offset from placing house)
  const aspectedHouses = useMemo(() => {
    const list: number[] = [];
    const p7 = ((placement + 7 - 1) % 12) + 1;
    list.push(p7);

    if (dashaLord === "Saturn") {
      list.push(((placement + 3 - 1) % 12) + 1);
      list.push(((placement + 10 - 1) % 12) + 1);
    }
    if (dashaLord === "Jupiter") {
      list.push(((placement + 5 - 1) % 12) + 1);
      list.push(((placement + 9 - 1) % 12) + 1);
    }
    if (dashaLord === "Mars") {
      list.push(((placement + 4 - 1) % 12) + 1);
      list.push(((placement + 8 - 1) % 12) + 1);
    }

    return Array.from(new Set(list)); 
  }, [dashaLord, placement]);

  // Compute aspect list with exact sign names
  const aspectSummary = useMemo(() => {
    return aspectedHouses.map((house) => {
      const signIndex = (lagnaIndex + house - 1) % 12;
      return `${house}H (${ZODIAC_SIGNS[signIndex]})`;
    }).join(", ");
  }, [aspectedHouses, lagnaIndex]);

  const outputVerdict = useMemo(() => {
    const placementSign = ZODIAC_SIGNS[(lagnaIndex + placement - 1) % 12];
    if (ownership === "trikona" && (placement === 1 || placement === 5 || placement === 9)) {
      return {
        title: "HIGHLY BENEFIC DAŚĀ PERIOD",
        color: "#15803d",
        bg: "rgba(22, 163, 74, 0.04)",
        desc: `${dashaLord} rules a supportive Trikona house and sits in the auspicious ${placement}H (${placementSign}). Expect a highly smooth, prosperous period focused on self-realization, wisdom, and clean gains.`
      };
    }
    if (ownership === "dusthana" && (placement === 8 || placement === 12)) {
      return {
        title: "CHALLENGING DUSTHANA DAŚĀ (HARSH TIMING)",
        color: "#b91c1c",
        bg: "rgba(220, 38, 38, 0.04)",
        desc: `${dashaLord} rules a Dusthana and sits in ${placement}H (${placementSign}). This period triggers significant transformations, health/debt hurdles, or displacement. Use remedial discipline.`
      };
    }
    return {
      title: "MIXED / TRANSITIONAL DAŚĀ WINDOW",
      color: GOLD,
      bg: "rgba(156, 122, 47, 0.04)",
      desc: `${dashaLord} rules a ${ownership} house and sits in the ${placement}H (${placementSign}). Some delay or effort is required to unlock the positive potential of the period.`
    };
  }, [dashaLord, ownership, placement, lagnaIndex]);

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
            Dasha Context Analyzer
          </h2>
          <p className="text-xs italic text-gray-600">
            Step 3: Analyze dasha/bhukti lord placement, ownership, and aspect targets.
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
            MODULE 2.3.3
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Dasha Parameters
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

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Dasha Lord:</label>
              <select
                value={dashaLord}
                onChange={(e) => setDashaLord(e.target.value)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans font-bold"
              >
                <option value="Saturn">Saturn (Shani) - aspects 3, 7, 10</option>
                <option value="Jupiter">Jupiter (Guru) - aspects 5, 7, 9</option>
                <option value="Mars">Mars (Mangala) - aspects 4, 7, 8</option>
                <option value="Mercury">Mercury (Budha) - aspects 7</option>
                <option value="Moon">Moon (Chandra) - aspects 7</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-500">Ownership:</label>
                <select
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value as any)}
                  className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800 font-sans"
                >
                  <option value="trikona">Trikona</option>
                  <option value="upachaya">Upachaya</option>
                  <option value="dusthana">Dusthana</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-500">Placement:</label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(Number(e.target.value))}
                  className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800 font-sans"
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}H</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dasha result */}
          <div
            className="p-4 rounded-xl border shadow-sm text-xs font-semibold leading-relaxed"
            style={{
              borderColor: outputVerdict.color,
              backgroundColor: outputVerdict.bg
            }}
          >
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Dasha Period Verdict</span>
            <strong className="text-xs block mb-1" style={{ color: outputVerdict.color }}>
              {outputVerdict.title}
            </strong>
            <p className="text-gray-600 font-normal leading-normal">{outputVerdict.desc}</p>
            <div className="mt-2 border-t pt-2" style={{ borderColor: HAIRLINE }}>
              <span className="text-[9px] uppercase font-bold text-gray-400 block">Aspect Target Houses:</span>
              <strong className="text-amber-800">{aspectSummary}</strong>
            </div>
          </div>
        </div>

        {/* Visualizer Column */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Aspect Beams Visualizer
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
                    const isPlacing = cell.house === placement;
                    const isAspected = aspectedHouses.includes(cell.house);
                    // Rashi number is Lagna index + house index - 1
                    const rashiNo = ((lagnaIndex + cell.house - 1) % 12) + 1;

                    return (
                      <g key={cell.house}>
                        {isPlacing && (
                          <rect x={cell.cx - 7} y={cell.cy - 7} width="14" height="14" rx="2" fill="rgba(156, 122, 47, 0.15)" stroke={GOLD} strokeWidth="1" />
                        )}
                        <text
                          x={cell.cx}
                          y={cell.cy + 2.5}
                          textAnchor="middle"
                          fontSize={isPlacing ? "5" : "4.2"}
                          fontWeight={isPlacing ? "bold" : "normal"}
                          fill={isPlacing ? "#b91c1c" : isAspected ? GOLD : INK_SECONDARY}
                        >
                          {isPlacing ? dashaLord.slice(0, 2) : cell.house}
                        </text>
                        <text x={cell.cx} y={cell.cy - 3} textAnchor="middle" fontSize="3" fill="#888">
                          {rashiNo}
                        </text>
                      </g>
                    );
                  })}

                  {/* Draw aspect vector lines */}
                  {aspectedHouses.map((hIndex) => {
                    const fromCell = NORTH_HOUSE_COORDS.find((c) => c.house === placement);
                    const toCell = NORTH_HOUSE_COORDS.find((c) => c.house === hIndex);
                    if (!fromCell || !toCell) return null;
                    return (
                      <line
                        key={hIndex}
                        x1={fromCell.cx}
                        y1={fromCell.cy}
                        x2={toCell.cx}
                        y2={toCell.cy}
                        stroke="#8b5cf6"
                        strokeWidth="1.2"
                        strokeDasharray="2,2"
                      />
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
                    // Match sign coordinate
                    const cellSignIndex = ZODIAC_SIGNS.indexOf(cell.sign);
                    // House position = (cell sign index - Lagna index + 12) % 12 + 1
                    const cellHouseNo = ((cellSignIndex - lagnaIndex + 12) % 12) + 1;

                    const isPlacing = cellHouseNo === placement;
                    const isAspected = aspectedHouses.includes(cellHouseNo);

                    return (
                      <g key={cell.sign}>
                        {isPlacing && (
                          <rect x={cell.x * 40 + 1} y={cell.y * 40 + 1} width="38" height="38" fill="rgba(156, 122, 47, 0.15)" stroke={GOLD} strokeWidth="1" />
                        )}
                        <text
                          x={cell.x * 40 + 20}
                          y={cell.y * 40 + 24}
                          textAnchor="middle"
                          fontSize="6.5"
                          fontWeight={isPlacing ? "bold" : "normal"}
                          fill={isPlacing ? "#b91c1c" : isAspected ? GOLD : INK_SECONDARY}
                        >
                          {isPlacing ? dashaLord.slice(0, 2) : cell.label}
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
              The inner grey numbers represent the Rashi (Sign) indices, shifting dynamically as you select the Lagna Sign.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
