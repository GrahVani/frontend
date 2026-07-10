"use client";

import { useState, useMemo } from "react";
import { Info, HelpCircle, ShieldAlert, Sparkles, Check, Copy, Clock, Layers, Star } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

const SHLOKA_WORDS = [
  { word: "द्वितीये", meaning: "In the second house (dhana-bhāva)" },
  { word: "स्वामिनि", meaning: "And its lord (dhanesha)" },
  { word: "बले", meaning: "When endowed with strength (dignity/sources)" },
  { word: "शुभदृष्टे", meaning: "Aspected by natural benefics (Jupiter/Venus)" },
  { word: "च", meaning: "And" },
  { word: "संयुते", meaning: "Conjoined with them" },
  { word: "धनसञ्चयम्", meaning: "Accumulation of wealth" },
  { word: "आदिश्येद्", meaning: "Should be declared by the astrologer" },
  { word: "वाक्-कुटुम्ब-अन्न-सम्पदः", meaning: "Prosperities of speech, family, and sustenance" }
];

const NORTH_HOUSE_COORDS = [
  { house: 1, cx: 50, cy: 24, name: "Tanu (Self)" },
  { house: 2, cx: 27, cy: 13, name: "Dhana (Wealth)" },
  { house: 3, cx: 13, cy: 27, name: "Sahaja (Effort)" },
  { house: 4, cx: 24, cy: 50, name: "Sukha (Home)" },
  { house: 5, cx: 13, cy: 73, name: "Putra (Intellect)" },
  { house: 6, cx: 27, cy: 87, name: "Ripu (Service)" },
  { house: 7, cx: 50, cy: 76, name: "Yuvati (Partnership)" },
  { house: 8, cx: 73, cy: 87, name: "Randhra (Hidden)" },
  { house: 9, cx: 87, cy: 73, name: "Dharma (Fortune)" },
  { house: 10, cx: 76, cy: 50, name: "Karma (Career)" },
  { house: 11, cx: 87, cy: 27, name: "Labha (Gains)" },
  { house: 12, cx: 73, cy: 13, name: "Vyaya (Loss)" }
];

export function SecondHouseWealthEvaluator() {
  const [occupant, setOccupant] = useState<"benefic" | "malefic" | "none">("none");
  const [lordDignity, setLordDignity] = useState<"exalted" | "own" | "debilitated" | "neutral">("neutral");
  const [lordPlacement, setLordPlacement] = useState<"2nd" | "11th" | "12th" | "6th">("2nd");
  const [comparisonMode, setComparisonMode] = useState(false);
  const [marakaMode, setMarakaMode] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<number>(2);
  const [copied, setCopied] = useState(false);

  // Evaluate the strength of the 2nd house based on selections
  const { strengthScore, summaryText, phrasingText } = useMemo(() => {
    let score = 50; // out of 100
    let desc = "";
    let phrase = "";

    // Occupant influence
    if (occupant === "benefic") {
      score += 20;
      desc += "Supported by a natural benefic (Jupiter/Venus) in the house. ";
    } else if (occupant === "malefic") {
      score -= 20;
      desc += "Afflicted by a malefic occupant. Savings subject to sudden disruptions. ";
    }

    // Lord Dignity
    if (lordDignity === "exalted") {
      score += 25;
      desc += "Second lord is exalted, indicating strong wealth capacity and noble values. ";
    } else if (lordDignity === "own") {
      score += 15;
      desc += "Second lord in its own sign, indicating stable, self-sustaining assets. ";
    } else if (lordDignity === "debilitated") {
      score -= 20;
      desc += "Second lord is debilitated/combust, suggesting volatility in conserving speech and savings. ";
    }

    // Lord Placement
    if (lordPlacement === "11th") {
      score += 10;
      desc += "Second lord sits in the 11th of gains, connecting income directly to accumulated wealth.";
      phrase = "The connection between the 2nd lord and the 11th house shows a highly productive pattern. Wealth is generated and converted into long-term savings through consistent gains.";
    } else if (lordPlacement === "12th") {
      score -= 15;
      desc += "Second lord in the 12th house indicates high expenditures or leakages of savings.";
      phrase = "With the 2nd lord situated in the 12th house, liquid assets are subject to sudden outflows or foreign investment. Cultivate structured savings mechanisms to counter leakages.";
    } else if (lordPlacement === "6th") {
      score -= 5;
      desc += "Second lord in the 6th house indicates wealth generated through disputes, debt, or service.";
      phrase = "The placement of the 2nd lord in the 6th suggests gains derived through daily service, clinical fields, or dispute resolution. Financial success requires steady effort.";
    } else {
      phrase = "The 2nd house is stabilized by its own lord's presence. Assets remain self-sustaining and focused on family preservation.";
    }

    const cappedScore = Math.max(0, Math.min(100, score));
    return { strengthScore: cappedScore, summaryText: desc || "Neutral parameters.", phrasingText: phrase };
  }, [occupant, lordDignity, lordPlacement]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHouseClick = (houseNum: number) => {
    setSelectedHouse(houseNum);
    if (houseNum === 2) {
      setLordPlacement("2nd");
    } else if (houseNum === 11) {
      setLordPlacement("11th");
    } else if (houseNum === 12) {
      setLordPlacement("12th");
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
      data-interactive="second-house-wealth-evaluator"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            2nd House Wealth (Dhana Bhāva) Evaluator
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 1: Assessing the capacity to accumulate liquid wealth and family assets.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE COMPONENT
        </div>
      </div>

      {/* Sanskrit Maxim Board with Interactive Word Selector */}
      <div 
        className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" 
        style={{ borderColor: HAIRLINE }}
      >
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
          Sanskrit Classical Verse (Click words for breakdown)
        </div>
        <div className="py-3 flex flex-wrap justify-center gap-1.5 md:gap-3">
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
        {/* Left Column: Dashboard Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
              Interactive House Modulators
            </span>

            {/* Occupants */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                2nd House Occupant Influence:
              </label>
              <select
                value={occupant}
                onChange={(e) => setOccupant(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="none">None (Empty House)</option>
                <option value="benefic">Benefic (Jupiter/Venus) — Supporting</option>
                <option value="malefic">Malefic (Saturn/Mars) — Restraining</option>
              </select>
            </div>

            {/* Lord Placement */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                2nd Lord House Placement:
              </label>
              <select
                value={lordPlacement}
                onChange={(e) => {
                  setLordPlacement(e.target.value as any);
                  const hNum = e.target.value === "2nd" ? 2 : e.target.value === "11th" ? 11 : e.target.value === "12th" ? 12 : 6;
                  setSelectedHouse(hNum);
                }}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="2nd">2nd House (Own House Stability)</option>
                <option value="11th">11th House (Dhana-Labha Connection)</option>
                <option value="12th">12th House (Dhana-Vyaya Leakage)</option>
                <option value="6th">6th House (Dhana-Ripu Service/Conflict)</option>
              </select>
            </div>

            {/* Lord Dignity */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                2nd Lord Sign Dignity:
              </label>
              <select
                value={lordDignity}
                onChange={(e) => setLordDignity(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="neutral">Neutral Sign (Average)</option>
                <option value="exalted">Exalted Sign (Noble/Strong)</option>
                <option value="own">Own Sign (Stable)</option>
                <option value="debilitated">Debilitated/Combust Sign (Afflicted)</option>
              </select>
            </div>

            {/* Modes Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setComparisonMode(!comparisonMode);
                  if (marakaMode) setMarakaMode(false);
                }}
                className={`py-2 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                  comparisonMode ? "bg-amber-850 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                }`}
                style={{ borderColor: comparisonMode ? "transparent" : HAIRLINE }}
              >
                {comparisonMode ? "Hide Wealth Compare" : "Compare Wealth Houses"}
              </button>
              <button
                onClick={() => {
                  setMarakaMode(!marakaMode);
                  if (comparisonMode) setComparisonMode(false);
                }}
                className={`py-2 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                  marakaMode ? "bg-red-800 text-white border-red-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                }`}
                style={{ borderColor: marakaMode ? "transparent" : HAIRLINE }}
              >
                {marakaMode ? "Hide Maraka Info" : "Maraka Caution Mode"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Chart Visualizer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[280px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2 w-full text-center">
              Interactive Chart (Click houses to select placement)
            </span>

            <div className="w-56 h-56 bg-[#fbf9f4] border p-1 rounded-lg relative" style={{ borderColor: HAIRLINE }}>
              <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                {/* Background outline */}
                <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={HAIRLINE} strokeWidth="0.8" />
                <line x1="2" y1="2" x2="98" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                <line x1="98" y1="2" x2="2" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                <line x1="50" y1="2" x2="2" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                <line x1="2" y1="50" x2="50" y2="98" stroke={HAIRLINE} strokeWidth="0.8" />
                <line x1="50" y1="98" x2="98" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                <line x1="98" y1="50" x2="50" y2="2" stroke={HAIRLINE} strokeWidth="0.8" />

                {/* Highlighted regions based on selection or modes */}
                <polygon 
                  points="2,2 50,2 26,26" 
                  fill={selectedHouse === 2 ? "rgba(156, 122, 47, 0.25)" : "rgba(156, 122, 47, 0.05)"}
                  stroke={GOLD}
                  strokeWidth="0.6"
                  onClick={() => handleHouseClick(2)}
                  className="cursor-pointer transition-all duration-300 hover:fill-amber-100/30"
                />
                
                {comparisonMode && (
                  <polygon 
                    points="98,98 50,98 74,74" 
                    fill={selectedHouse === 9 ? "rgba(37, 99, 235, 0.18)" : "rgba(37, 99, 235, 0.08)"}
                    stroke="#2563eb"
                    strokeWidth="0.6"
                    onClick={() => handleHouseClick(9)}
                    className="cursor-pointer transition-all duration-300 hover:fill-blue-100/30"
                  />
                )}

                {comparisonMode && (
                  <polygon 
                    points="98,2 50,2 74,26" 
                    fill={selectedHouse === 11 ? "rgba(22, 163, 74, 0.18)" : "rgba(22, 163, 74, 0.08)"}
                    stroke="#16a34a"
                    strokeWidth="0.6"
                    onClick={() => handleHouseClick(11)}
                    className="cursor-pointer transition-all duration-300 hover:fill-green-100/30"
                  />
                )}

                {/* Plot text descriptors in houses */}
                {NORTH_HOUSE_COORDS.map((cell) => {
                  const is2nd = cell.house === 2;
                  const is9th = cell.house === 9;
                  const is11th = cell.house === 11;
                  const isLordP = lordPlacement === `${cell.house}th` || (lordPlacement === "2nd" && cell.house === 2);
                  
                  let fill = INK_SECONDARY;
                  let fontW = "normal";

                  if (is2nd) {
                    fill = GOLD;
                    fontW = "bold";
                  } else if (is9th && comparisonMode) {
                    fill = "#2563eb";
                    fontW = "bold";
                  } else if (is11th && comparisonMode) {
                    fill = "#16a34a";
                    fontW = "bold";
                  }

                  return (
                    <g key={cell.house} className="pointer-events-none">
                      <text x={cell.cx} y={cell.cy + 1} textAnchor="middle" fontSize="4.5" fill={fill} fontWeight={fontW}>
                        {cell.house}
                      </text>
                      {is2nd && (
                        <text x={cell.cx} y={cell.cy + 5} textAnchor="middle" fontSize="3" fontWeight="bold" fill={GOLD}>
                          Dhana
                        </text>
                      )}
                      {is9th && comparisonMode && (
                        <text x={cell.cx} y={cell.cy + 5} textAnchor="middle" fontSize="3" fontWeight="bold" fill="#2563eb">
                          Bhagya
                        </text>
                      )}
                      {is11th && comparisonMode && (
                        <text x={cell.cx} y={cell.cy + 5} textAnchor="middle" fontSize="3" fontWeight="bold" fill="#16a34a">
                          Labha
                        </text>
                      )}
                      {isLordP && (
                        <circle cx={cell.cx} cy={cell.cy - 4} r="1.5" fill="#d97706" className="animate-pulse" />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="w-full mt-4 space-y-1 text-center">
              <span className="text-[10px] uppercase font-bold text-gray-500">Calculated Dhana Potential:</span>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-amber-850 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${strengthScore}%` }}
                />
              </div>
              <span className="text-xs font-bold text-amber-900">{strengthScore}% (Qualitative Capacity)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic comparison panel */}
      {comparisonMode && (
        <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm space-y-3 animate-fade-in" style={{ borderColor: HAIRLINE }}>
          <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
            Three wealth houses comparison
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
            <div className="p-3 rounded border bg-amber-50/15" style={{ borderColor: HAIRLINE }}>
              <strong className="block text-amber-900 mb-1">2nd House (Dhana Bhāva)</strong>
              <p className="text-gray-600">
                Governs accumulated wealth, bank balances, liquid assets, jewelry, family legacy, and initial resources. It signifies *what you save and hold*.
              </p>
            </div>
            <div className="p-3 rounded border bg-blue-50/15" style={{ borderColor: "rgba(37, 99, 235, 0.2)" }}>
              <strong className="block text-blue-900 mb-1">9th House (Bhāgya Bhāva)</strong>
              <p className="text-gray-600">
                Governs grace, luck, higher destiny, divine guidance, and general fortune. It represents *prosperity capability* from past good deeds (purva-punya).
              </p>
            </div>
            <div className="p-3 rounded border bg-green-50/15" style={{ borderColor: "rgba(22, 163, 74, 0.2)" }}>
              <strong className="block text-green-900 mb-1">11th House (Lābha Bhāva)</strong>
              <p className="text-gray-600">
                Governs income, gains, networks, and profit. It measures incoming cashflow and *daily/monthly inflows* from work.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Maraka cautionary warning with Visual Timeline */}
      {marakaMode && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-950 shadow-sm leading-relaxed space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b pb-1.5 border-red-200/50">
            <div className="flex items-center gap-2 text-xs font-bold text-red-800">
              <ShieldAlert size={16} /> Maraka (Death-Inflicting) Timing Caution
            </div>
            <span className="text-[9px] bg-red-100 text-red-900 px-2 py-0.5 rounded font-bold uppercase font-sans">
              Timing Trigger Mode
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8">
              <p className="text-[11px] text-gray-600">
                Classical texts define the 2nd and 7th houses as maraka houses. However, in Tier-2 Advanced practice, you must frame this solely as a timing filter for Dasha-Bhukti transit confirmation, rather than declaring fatalistic physical doom to a client.
              </p>
            </div>
            <div className="md:col-span-4 p-3 bg-white/60 rounded border border-red-100 flex flex-col items-center justify-center text-center">
              <Clock className="text-red-700 animate-spin shrink-0 mb-1" size={20} style={{ animationDuration: "12s" }} />
              <span className="text-[10px] font-bold text-red-850">Dasha Threshold</span>
              <span className="text-[8px] text-gray-500 italic">Required before declaring alert</span>
            </div>
          </div>
        </div>
      )}

      {/* Phrasing Register Panel */}
      <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: HAIRLINE }}>
          <div>
            <span className="text-[9px] uppercase tracking-wider block text-gray-400 font-bold">
              Calibrated Wealth Phrasing
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
