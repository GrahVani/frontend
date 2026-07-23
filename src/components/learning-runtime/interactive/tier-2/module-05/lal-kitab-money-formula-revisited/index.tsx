"use client";

import { useState, useMemo } from "react";
import { Sparkles, Check, Copy } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";
const LABEL_TEXT = "#5f5447";
const HELPER_TEXT = "#4b5563";
const CHART_LINE = "#9b7b42";
const CHART_LINE_STRONG = "#755521";

const SHLOKA_WORDS = [
  { word: "मेषलग्ने", meaning: "With Aries as the fixed ascendant/Lagna (1st house = Aries)" },
  { word: "स्थिरे", meaning: "Permanently fixed across all Lal Kitab charts" },
  { word: "धर्मितेवः", meaning: "Dharmee Teva (a righteous, protected chart structure)" }
];

const NORTH_HOUSE_COORDS = [
  { house: 1, cx: 50, cy: 24, name: "Aries" },
  { house: 2, cx: 27, cy: 13, name: "Taurus" },
  { house: 3, cx: 13, cy: 27, name: "Gemini" },
  { house: 4, cx: 24, cy: 50, name: "Cancer" },
  { house: 5, cx: 13, cy: 73, name: "Leo" },
  { house: 6, cx: 27, cy: 87, name: "Virgo" },
  { house: 7, cx: 50, cy: 76, name: "Libra" },
  { house: 8, cx: 73, cy: 87, name: "Scorpio" },
  { house: 9, cx: 87, cy: 73, name: "Sagittarius" },
  { house: 10, cx: 76, cy: 50, name: "Capricorn" },
  { house: 11, cx: 87, cy: 27, name: "Aquarius" },
  { house: 12, cx: 73, cy: 13, name: "Pisces" }
];

export function LalKitabMoneyFormulaRevisited() {
  const [jupHouse, setJupHouse] = useState<number>(2);
  const [satHouse, setSatHouse] = useState<number>(11);
  const [selectedPlanet, setSelectedPlanet] = useState<"jupiter" | "saturn">("jupiter");
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Evaluate Teva status
  const { isDharmee, isPaapi, phrasingText } = useMemo(() => {
    let dharmee = false;
    let paapi = false;
    let phrase = "";

    if (satHouse === 11 || (jupHouse === 2 && satHouse === 11)) {
      dharmee = true;
      phrase = "Dharmee Teva confirmed (Righteous Chart). Saturn in the 11th house acts as a protective shield, minimizing malefic combinations and stabilizing wealth.";
    } else if (jupHouse === satHouse) {
      paapi = true;
      phrase = "Paapi Teva indicator: Conjunction of Jupiter and Saturn creates structural conflicts in resource preservation.";
    } else {
      phrase = "Standard Lal Kitab chart configuration. Placements are evaluated on individual planet aspects without triggering global Teva status.";
    }

    return { isDharmee: dharmee, isPaapi: paapi, phrasingText: phrase };
  }, [jupHouse, satHouse]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHouseClick = (houseNum: number) => {
    if (selectedPlanet === "jupiter") {
      setJupHouse(houseNum);
    } else {
      setSatHouse(houseNum);
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
      data-interactive="lal-kitab-money-formula-revisited"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Lal Kitab Fixed Ascendant Chart Revisited
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 5: FIXED Aries Ascendant layout and Dharmee vs. Paapi Teva analysis.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE COMPONENT
        </div>
      </div>

      {/* Sanskrit Verse with breakdowns */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" style={{ borderColor: HAIRLINE }}>
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold tracking-wider" style={{ color: LABEL_TEXT }}>
          Sanskrit Verse Reference (Click words for breakdown)
        </div>
        <div className="py-3 flex flex-wrap justify-center gap-2">
          {SHLOKA_WORDS.map((w, idx) => (
            <button
              key={idx}
              onClick={() => setActiveWordIdx(activeWordIdx === idx ? null : idx)}
              className={`text-xs md:text-sm font-bold transition-all px-1.5 py-0.5 rounded cursor-pointer ${
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
        {/* Left Column: controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-[10px] uppercase font-bold" style={{ color: LABEL_TEXT }}>
                Lal Kitab Configurator
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedPlanet("jupiter")} 
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                    selectedPlanet === "jupiter" ? "bg-amber-800 text-white" : "bg-transparent"
                  }`}
                  style={{ borderColor: HAIRLINE, color: selectedPlanet === "jupiter" ? undefined : HELPER_TEXT }}
                >
                  Position Jupiter
                </button>
                <button 
                  onClick={() => setSelectedPlanet("saturn")} 
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                    selectedPlanet === "saturn" ? "bg-amber-800 text-white" : "bg-transparent"
                  }`}
                  style={{ borderColor: HAIRLINE, color: selectedPlanet === "saturn" ? undefined : HELPER_TEXT }}
                >
                  Position Saturn
                </button>
              </div>
            </div>

            {/* Placements */}
            <div>
              <label className="block text-[9px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>Jupiter House:</label>
              <select
                value={jupHouse}
                onChange={(e) => setJupHouse(parseInt(e.target.value))}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num}>House {num} ({NORTH_HOUSE_COORDS.find((c) => c.house === num)?.name})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>Saturn House:</label>
              <select
                value={satHouse}
                onChange={(e) => setSatHouse(parseInt(e.target.value))}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num}>House {num} ({NORTH_HOUSE_COORDS.find((c) => c.house === num)?.name})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chart Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[250px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block mb-3 w-full text-center" style={{ color: LABEL_TEXT }}>
              Fixed Aries Lagna Chart (Click houses to place active Planet)
            </span>

            <div className="w-48 h-48 bg-[#fbf9f4] border p-1 rounded-lg relative" style={{ borderColor: CHART_LINE_STRONG }}>
              <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={CHART_LINE_STRONG} strokeWidth="1.2" />
                <line x1="2" y1="2" x2="98" y2="98" stroke={CHART_LINE} strokeWidth="1" />
                <line x1="98" y1="2" x2="2" y2="98" stroke={CHART_LINE} strokeWidth="1" />
                <line x1="50" y1="2" x2="2" y2="50" stroke={CHART_LINE} strokeWidth="1.1" />
                <line x1="2" y1="50" x2="50" y2="98" stroke={CHART_LINE} strokeWidth="1.1" />
                <line x1="50" y1="98" x2="98" y2="50" stroke={CHART_LINE} strokeWidth="1.1" />
                <line x1="98" y1="50" x2="50" y2="2" stroke={CHART_LINE} strokeWidth="1.1" />

                {/* Hotspot polygons to capture direct clicks */}
                {NORTH_HOUSE_COORDS.map((cell) => {
                  const hasJup = jupHouse === cell.house;
                  const hasSat = satHouse === cell.house;
                  
                  // Compute simple hover shape using box centers
                  return (
                    <g key={cell.house}>
                      <rect 
                        x={cell.cx - 5} 
                        y={cell.cy - 5} 
                        width="10" 
                        height="10" 
                        fill="transparent" 
                        className="cursor-pointer hover:fill-amber-500/10"
                        onClick={() => handleHouseClick(cell.house)}
                      />
                      <g className="pointer-events-none">
                        <text x={cell.cx} y={cell.cy + 1.5} textAnchor="middle" fontSize="5" fontWeight="700" fill={INK_SECONDARY}>
                          {cell.house}
                        </text>
                        {hasJup && (
                          <circle cx={cell.cx - 3.5} cy={cell.cy - 3.5} r="2" fill="#d97706" />
                        )}
                        {hasSat && (
                          <circle cx={cell.cx + 3.5} cy={cell.cy - 3.5} r="2" fill="#4b5563" />
                        )}
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="text-center mt-3">
              <span className="text-[10px] uppercase font-bold" style={{ color: LABEL_TEXT }}>Teva Status:</span>
              <span className="text-xs font-bold text-amber-900 block mt-0.5 animate-pulse">
                {isDharmee ? "Dharmee Teva (Righteous)" : isPaapi ? "Paapi Teva (Malefic)" : "Standard Teva"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Phrasing Register Panel */}
      <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: HAIRLINE }}>
          <div>
            <span className="text-[9px] uppercase tracking-wider block font-bold" style={{ color: LABEL_TEXT }}>
              Calibrated Interpretations
            </span>
            <span className="text-[10px] font-medium italic" style={{ color: HELPER_TEXT }}>
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
        <blockquote className="text-xs italic border-l-2 pl-3 py-1 bg-amber-50/10" style={{ borderColor: GOLD, color: HELPER_TEXT }}>
          &ldquo;{phrasingText}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}
