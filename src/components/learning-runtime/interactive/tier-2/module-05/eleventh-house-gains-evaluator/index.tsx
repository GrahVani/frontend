"use client";

import { useState, useMemo } from "react";
import { Info, HelpCircle, ShieldAlert, Sparkles, Check, Copy, ArrowUpRight, ArrowDownRight, Award } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

const SHLOKA_WORDS = [
  { word: "एकादशं", meaning: "The eleventh house" },
  { word: "भवेत्", meaning: "Shall become" },
  { word: "लाभस्थानं", meaning: "The house of gains (lābha-bhāva)" },
  { word: "सर्व-फल-आगमम्", meaning: "Where all fruits, rewards, and goals arrive" }
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

export function EleventhHouseGainsEvaluator() {
  const [occupant, setOccupant] = useState<"benefic" | "malefic" | "none">("none");
  const [lordPlacement, setLordPlacement] = useState<"11th" | "12th" | "2nd" | "6th">("11th");
  const [balanceMode, setBalanceMode] = useState(true);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<number>(11);
  const [copied, setCopied] = useState(false);

  // Evaluate the gains potential and balance tilt
  const { tiltAngle, summaryText, phrasingText, isUpachayaBenefit } = useMemo(() => {
    let score = 50; // out of 100
    let tilt = 0; // degrees
    let desc = "";
    let phrase = "";
    let upachaya = false;

    // Occupant influence
    if (occupant === "benefic") {
      score += 15;
      tilt += 10;
      desc += "Jupiter or Venus in the 11th house supports smooth financial inflows. ";
    } else if (occupant === "malefic") {
      score += 25; // Malefics are favored in Upachayas!
      tilt += 20;
      upachaya = true;
      desc += "Malefic occupant (Saturn/Mars) active. Upachaya growth rule triggers: challenges generate strong earnings. ";
    }

    // Lord Placement
    if (lordPlacement === "11th") {
      score += 20;
      tilt += 15;
      desc += "Eleventh lord resides in the 11th, confirming reliable income channels.";
      phrase = "The 11th lord situated in the 11th house indicates that income streams remain secure. The native possesses self-sustaining gains backed by their networks.";
    } else if (lordPlacement === "12th") {
      score -= 25;
      tilt -= 25; // Tilt heavy to outflow (12th)
      desc += "Eleventh lord in the 12th house. Gains are directly spent or leaked into expenditures.";
      phrase = "With the 11th lord in the 12th house, cashflow is characterized by immediate outflows. Savings will require conscious restraint, though foreign projects offer a viable outlet.";
    } else if (lordPlacement === "2nd") {
      score += 30;
      tilt += 30; // Tilt heavy to inflow (11th)
      desc += "Eleventh lord in the 2nd house forms a powerful Dhana Yoga (gains flowing into savings).";
      phrase = "The placement of the 11th lord in the 2nd house links income directly to accumulated savings. This is a signature of wealth preservation and asset multiplication.";
    } else if (lordPlacement === "6th") {
      score -= 5;
      tilt -= 5;
      desc += "Eleventh lord in the 6th house indicates gains through active dispute resolution, debts, or service.";
      phrase = "The 11th lord in the 6th house means that earnings are generated through competitive fields, daily service, or debt structures. Gains are labor-intensive.";
    }

    // Cap tilt angle for visualization
    const cappedTilt = Math.max(-25, Math.min(25, tilt));
    return { 
      tiltAngle: cappedTilt, 
      summaryText: desc, 
      phrasingText: phrase,
      isUpachayaBenefit: upachaya 
    };
  }, [occupant, lordPlacement]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHouseClick = (houseNum: number) => {
    setSelectedHouse(houseNum);
    if (houseNum === 11) {
      setLordPlacement("11th");
    } else if (houseNum === 12) {
      setLordPlacement("12th");
    } else if (houseNum === 2) {
      setLordPlacement("2nd");
    } else if (houseNum === 6) {
      setLordPlacement("6th");
    }
  };

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans animate-fade-in"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="eleventh-house-gains-evaluator"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            11th House Gains (Lābha Bhāva) Evaluator
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 1: Analyzing active income, networks, and the Upachaya growth rule.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE COMPONENT
        </div>
      </div>

      {/* Sanskrit Verse with Interactive Breakdown */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" style={{ borderColor: HAIRLINE }}>
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
          Sanskrit Classical Verse (Click words for breakdown)
        </div>
        <div className="py-3 flex flex-wrap justify-center gap-2">
          {SHLOKA_WORDS.map((w, idx) => (
            <button
              key={idx}
              onClick={() => setActiveWordIdx(activeWordIdx === idx ? null : idx)}
              className={`text-sm md:text-base font-bold transition-all px-1.5 py-0.5 rounded cursor-pointer ${
                activeWordIdx === idx 
                  ? "bg-amber-800 text-white shadow-md scale-105" 
                  : "text-amber-950 hover:bg-amber-50"
              }`}
            >
              {w.word}
            </button>
          ))}
        </div>
        {activeWordIdx !== null && (
          <div className="mt-2 text-xs text-amber-900 font-bold bg-amber-50/50 py-1.5 px-3 rounded-lg border border-amber-250/20 animate-fade-in">
            {SHLOKA_WORDS[activeWordIdx].meaning}
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
        {/* Left Column: Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
              Gains & Inflow Modulators
            </span>

            {/* Occupants */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                11th House Occupant (Upachaya Rule):
              </label>
              <select
                value={occupant}
                onChange={(e) => setOccupant(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="none">None (Empty House)</option>
                <option value="benefic">Benefic (Jupiter/Venus) — Smooth Inflows</option>
                <option value="malefic">Malefic (Saturn/Mars) — Upachaya Growth</option>
              </select>
            </div>

            {/* Lord Placement */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                11th Lord House Placement:
              </label>
              <select
                value={lordPlacement}
                onChange={(e) => {
                  setLordPlacement(e.target.value as any);
                  const hNum = e.target.value === "11th" ? 11 : e.target.value === "12th" ? 12 : e.target.value === "2nd" ? 2 : 6;
                  setSelectedHouse(hNum);
                }}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="11th">11th House (Self-Gains)</option>
                <option value="12th">12th House (Outflow/Loss of Gains)</option>
                <option value="2nd">2nd House (Asset Conjunction Dhana Yoga)</option>
                <option value="6th">6th House (Service/Friction Gains)</option>
              </select>
            </div>

            {/* Upachaya Info card */}
            {isUpachayaBenefit && (
              <div className="p-3 rounded border border-green-200 bg-green-50/50 text-[11px] text-green-950 leading-relaxed flex gap-2">
                <Award size={16} className="text-green-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Upachaya Rule Active:</strong> Malefics in the 11th are highly favored classically. They suggest competitive capacity, persistent effort, and resourcefulness leading to strong wealth gains over time.
                </div>
              </div>
            )}

            {/* Toggle Balance View */}
            <div className="pt-2">
              <button
                onClick={() => setBalanceMode(!balanceMode)}
                className={`w-full py-2 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                  balanceMode ? "bg-amber-850 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                }`}
                style={{ borderColor: balanceMode ? "transparent" : HAIRLINE }}
              >
                {balanceMode ? "Show Interactive Chart" : "Show Cashflow Balance Scale"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visualizer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[280px]" style={{ borderColor: HAIRLINE }}>
            {balanceMode ? (
              <>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-4 w-full text-center">
                  Cashflow Balance Scale (11th Inflow vs 12th Outflow)
                </span>
                
                {/* Visual SVG Scale Balance */}
                <div className="w-56 h-40 flex items-center justify-center bg-[#fbf9f4] border rounded-lg p-2" style={{ borderColor: HAIRLINE }}>
                  <svg viewBox="0 0 100 80" className="w-full h-full">
                    {/* Stand */}
                    <line x1="50" y1="70" x2="50" y2="20" stroke="#b45309" strokeWidth="2.5" />
                    <line x1="30" y1="70" x2="70" y2="70" stroke="#b45309" strokeWidth="3" />
                    <circle cx="50" cy="20" r="3" fill="#b45309" />

                    {/* Beam (rotating based on tiltAngle) */}
                    <g transform={`rotate(${tiltAngle} 50 20)`} className="transition-all duration-700 ease-out origin-center">
                      <line x1="20" y1="20" x2="80" y2="20" stroke="#b45309" strokeWidth="2" />
                      
                      {/* Left Pan (12th House - Outflow) */}
                      <g transform="translate(0, 0)">
                        <line x1="20" y1="20" x2="10" y2="45" stroke="#9ca3af" strokeWidth="0.8" />
                        <line x1="20" y1="20" x2="30" y2="45" stroke="#9ca3af" strokeWidth="0.8" />
                        <path d="M 8 45 L 32 45 A 12 6 0 0 1 8 45" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
                        {/* Dynamic coin counts representing weight */}
                        {tiltAngle <= 0 && (
                          <g fill="#d97706" opacity="0.8">
                            <circle cx="16" cy="42" r="1.5" />
                            <circle cx="20" cy="42" r="1.5" />
                            <circle cx="24" cy="42" r="1.5" />
                            <circle cx="18" cy="39" r="1.5" />
                            <circle cx="22" cy="39" r="1.5" />
                          </g>
                        )}
                        <text x="20" y="52" fontSize="3" fontWeight="bold" fill={INK_SECONDARY} textAnchor="middle">12th Outflow</text>
                      </g>

                      {/* Right Pan (11th House - Inflow) */}
                      <g transform="translate(0, 0)">
                        <line x1="80" y1="20" x2="70" y2="45" stroke="#d97706" strokeWidth="0.8" />
                        <line x1="80" y1="20" x2="90" y2="45" stroke="#d97706" strokeWidth="0.8" />
                        <path d="M 68 45 L 92 45 A 12 6 0 0 1 68 45" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
                        {/* Dynamic coin counts representing weight */}
                        {tiltAngle >= 0 && (
                          <g fill="#d97706" opacity="0.85">
                            <circle cx="76" cy="42" r="1.5" />
                            <circle cx="80" cy="42" r="1.5" />
                            <circle cx="84" cy="42" r="1.5" />
                            <circle cx="78" cy="39" r="1.5" />
                            <circle cx="82" cy="39" r="1.5" />
                            <circle cx="80" cy="36" r="1.5" />
                          </g>
                        )}
                        <text x="80" y="52" fontSize="3" fontWeight="bold" fill="#b45309" textAnchor="middle">11th Inflow</text>
                      </g>
                    </g>
                  </svg>
                </div>
                
                <div className="text-center text-[11px] mt-2 flex items-center gap-1.5 font-bold">
                  {tiltAngle > 0 ? (
                    <span className="text-green-700 flex items-center gap-0.5">
                      <ArrowUpRight size={14} /> Inflow Positive (Asset Building)
                    </span>
                  ) : tiltAngle < 0 ? (
                    <span className="text-red-700 flex items-center gap-0.5">
                      <ArrowDownRight size={14} /> Outflow Heavy (Expenditures)
                    </span>
                  ) : (
                    <span className="text-gray-500">Perfect Inflow-Outflow Balance</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2 w-full text-center">
                  Vedic Chart (Click houses 11, 12, 2, 6 to map placement)
                </span>
                <div className="w-48 h-48 bg-[#fbf9f4] border p-1 rounded-lg" style={{ borderColor: HAIRLINE }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                    <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="2" y1="2" x2="98" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                    <line x1="98" y1="2" x2="2" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                    <line x1="50" y1="2" x2="2" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="2" y1="50" x2="50" y2="98" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="50" y1="98" x2="98" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                    <line x1="98" y1="50" x2="50" y2="2" stroke={HAIRLINE} strokeWidth="0.8" />

                    {/* 11th House triangle highlight */}
                    <polygon 
                      points="98,2 50,2 74,26" 
                      fill={selectedHouse === 11 ? "rgba(156, 122, 47, 0.25)" : "rgba(156, 122, 47, 0.05)"}
                      stroke={GOLD}
                      strokeWidth="0.6"
                      onClick={() => handleHouseClick(11)}
                      className="cursor-pointer transition-all duration-300 hover:fill-amber-100/30"
                    />

                    {/* 12th House triangle highlight */}
                    <polygon 
                      points="74,2 50,2 73,13" 
                      fill={selectedHouse === 12 ? "rgba(220, 38, 38, 0.15)" : "transparent"}
                      stroke={selectedHouse === 12 ? "#dc2626" : "transparent"}
                      strokeWidth="0.6"
                      onClick={() => handleHouseClick(12)}
                      className="cursor-pointer transition-all duration-300 hover:fill-red-100/30"
                    />

                    {/* 2nd House triangle highlight */}
                    <polygon 
                      points="2,2 50,2 26,26" 
                      fill={selectedHouse === 2 ? "rgba(22, 163, 74, 0.15)" : "transparent"}
                      stroke={selectedHouse === 2 ? "#16a34a" : "transparent"}
                      strokeWidth="0.6"
                      onClick={() => handleHouseClick(2)}
                      className="cursor-pointer transition-all duration-300 hover:fill-green-100/30"
                    />

                    {/* 6th House triangle highlight */}
                    <polygon 
                      points="2,98 50,98 26,74" 
                      fill={selectedHouse === 6 ? "rgba(37, 99, 235, 0.15)" : "transparent"}
                      stroke={selectedHouse === 6 ? "#2563eb" : "transparent"}
                      strokeWidth="0.6"
                      onClick={() => handleHouseClick(6)}
                      className="cursor-pointer transition-all duration-300 hover:fill-blue-100/30"
                    />

                    {NORTH_HOUSE_COORDS.map((cell) => {
                      const isH11 = cell.house === 11;
                      const isSelected = selectedHouse === cell.house;
                      return (
                        <g key={cell.house} className="pointer-events-none">
                          <text 
                            x={cell.cx} 
                            y={cell.cy + 1} 
                            textAnchor="middle" 
                            fontSize="4.5" 
                            fill={isH11 ? GOLD : isSelected ? "#d97706" : INK_SECONDARY} 
                            fontWeight={isH11 || isSelected ? "bold" : "normal"}
                          >
                            {cell.house}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Phrasing Register Panel */}
      <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: HAIRLINE }}>
          <div>
            <span className="text-[9px] uppercase tracking-wider block text-gray-400 font-bold">
              Calibrated Gains Phrasing
            </span>
            <span className="text-[10px] text-gray-500 font-medium italic">
              Use this qualitative framing in your client write-ups
            </span>
          </div>
          <button
            onClick={copyPhrasing}
            className="px-2 py-1 text-[10px] font-bold rounded border transition-all flex items-center gap-1 bg-transparent hover:bg-amber-50 cursor-pointer"
            style={{ borderColor: HAIRLINE }}
          >
            {copied ? <Check size={11} className="text-green-700" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy Phrasing"}
          </button>
        </div>
        <blockquote className="text-xs italic text-gray-600 border-l-2 pl-3 py-1 bg-amber-50/10" style={{ borderColor: GOLD }}>
          "{phrasingText}"
        </blockquote>
      </div>
    </div>
  );
}
