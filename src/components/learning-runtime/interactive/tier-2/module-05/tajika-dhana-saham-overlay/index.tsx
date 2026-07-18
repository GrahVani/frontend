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
  { word: "धनसहमे", meaning: "Dhana Saham: The computed sensitive wealth-point lot" },
  { word: "मुन्था वर्षे", meaning: "Muntha placement: The annual focus-point that moves one sign per year" },
  { word: "धनवर्षस्य सूचिका", meaning: "Indicates a highly prominent wealth-fructification year" },
  { word: "इत्थशालाद्", meaning: "Through an active applying Ithasala aspect" },
  { word: "दशाक्षेत्रे", meaning: "Evaluated strictly within the field and timing of the active Vimshottari Dasha" }
];

const NORTH_HOUSE_COORDS = [
  { house: 1, cx: 50, cy: 24, name: "Lagna" },
  { house: 2, cx: 27, cy: 13, name: "Dhana Saham" },
  { house: 3, cx: 13, cy: 27, name: "Sahaj" },
  { house: 4, cx: 24, cy: 50, name: "Bandhu" },
  { house: 5, cx: 13, cy: 73, name: "Putra" },
  { house: 6, cx: 27, cy: 87, name: "Ari" },
  { house: 7, cx: 50, cy: 76, name: "Yuvati" },
  { house: 8, cx: 73, cy: 87, name: "Randhra" },
  { house: 9, cx: 87, cy: 73, name: "Dharma" },
  { house: 10, cx: 76, cy: 50, name: "Karma" },
  { house: 11, cx: 87, cy: 27, name: "Labha" },
  { house: 12, cx: 73, cy: 13, name: "Vyaya" }
];

export function TajikaDhanaSahamOverlay() {
  const [munthaHouse, setMunthaHouse] = useState<number>(11);
  const [varshesa, setVarshesa] = useState<"jupiter" | "mars" | "saturn">("jupiter");
  const [ithasalaActive, setIthasalaActive] = useState<boolean>(true);
  const [dashaAligned, setDashaAligned] = useState<boolean>(true);
  
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Compute the Two-Yes and Verdict
  const { yes1, yes2, totalYes, verdictClass, phrasingText } = useMemo(() => {
    const y1 = dashaAligned;
    const y2 = munthaHouse === 2 || munthaHouse === 11 || (ithasalaActive && varshesa === "jupiter");

    let count = 0;
    if (y1) count++;
    if (y2) count++;

    let vClass = "Neutral Window";
    let phrase = "";

    if (count === 2) {
      vClass = "Auspicious Timing (Two-Yes Confirmed)";
      phrase = `The Vimshottari Dasha flags a wealth-active window (Yes #1), and the annual return is highly supportive with Muntha in house ${munthaHouse} and active ${varshesa} aspect to the Dhana Saham (Yes #2). Recommend this year as a strong window of likelihood.`;
    } else if (count === 1) {
      vClass = "Partial Timing Agreement";
      phrase = y1 
        ? "Vimshottari Dasha is favorable (Yes #1), but the annual return lacks strong wealth indicators. Moderate caution or patience is advised."
        : "Annual return shows wealth focus, but the underlying Dasha stream is unsupportive. A temporary minor gain, avoid over-leveraging.";
    } else {
      vClass = "Inauspicious / Unsupportive Timing";
      phrase = "Both Dasha and Varshaphala streams are unsupportive. Financial stagnation expected; maintain liquid assets and avoid speculative trading.";
    }

    return { yes1: y1, yes2: y2, totalYes: count, verdictClass: vClass, phrasingText: phrase };
  }, [munthaHouse, varshesa, ithasalaActive, dashaAligned]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHouseClick = (houseNum: number) => {
    setMunthaHouse(houseNum);
  };

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans animate-fade-in"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="tajika-dhana-saham-overlay"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Tajika Dhana Saham Overlay
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 6: Refinement of the Dasha window using Varshaphala return parameters.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE SYNTHESIZER
        </div>
      </div>

      {/* Sanskrit Verse with breakdowns */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" style={{ borderColor: HAIRLINE }}>
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold tracking-wider" style={{ color: LABEL_TEXT }}>
          Tajika Classic Maxims (Click words for translation)
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
            <span className="text-[10px] uppercase font-bold block border-b pb-1" style={{ color: LABEL_TEXT }}>
              Varshaphala Return Parameters
            </span>

            {/* Dasha toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={dashaAligned}
                  onChange={(e) => setDashaAligned(e.target.checked)}
                  className="accent-amber-800"
                />
                Vimshottari Dasha Window Favorable (Yes #1)
              </label>
            </div>

            {/* Muntha select */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>Muntha House:</label>
              <select
                value={munthaHouse}
                onChange={(e) => setMunthaHouse(parseInt(e.target.value))}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num}>House {num} ({NORTH_HOUSE_COORDS.find((c) => c.house === num)?.name})</option>
                ))}
              </select>
            </div>

            {/* Varṣeśa */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>Year-Lord (Varṣeśa):</label>
              <select
                value={varshesa}
                onChange={(e) => setVarshesa(e.target.value as "jupiter" | "mars" | "saturn")}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="jupiter">Jupiter (Expansion, wealth)</option>
                <option value="mars">Mars (Initiative, quick gains)</option>
                <option value="saturn">Saturn (Delay, caution)</option>
              </select>
            </div>

            {/* Ithasala Aspect */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={ithasalaActive}
                  onChange={(e) => setIthasalaActive(e.target.checked)}
                  className="accent-amber-800"
                />
                Activate Ithasala Aspect to Dhana Saham
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Return Chart Diamond SVG */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[250px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block mb-3 w-full text-center" style={{ color: LABEL_TEXT }}>
              Annual Return Chart (Click houses to place Muntha)
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

                {/* Aspect connection line */}
                {ithasalaActive && (
                  <line 
                    x1={NORTH_HOUSE_COORDS.find((c) => c.house === (varshesa === "jupiter" ? 10 : 5))?.cx} 
                    y1={NORTH_HOUSE_COORDS.find((c) => c.house === (varshesa === "jupiter" ? 10 : 5))?.cy}
                    x2={NORTH_HOUSE_COORDS.find((c) => c.house === 2)?.cx} 
                    y2={NORTH_HOUSE_COORDS.find((c) => c.house === 2)?.cy}
                    stroke="#d97706" 
                    strokeWidth="2" 
                    strokeDasharray="2,2"
                    className="animate-pulse"
                  />
                )}

                {NORTH_HOUSE_COORDS.map((cell) => {
                  const isMuntha = munthaHouse === cell.house;
                  const isSaham = cell.house === 2;
                  
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
                        {isMuntha && (
                          <circle cx={cell.cx - 3.5} cy={cell.cy - 3.5} r="2" fill="#d97706" className="animate-bounce" />
                        )}
                        {isSaham && (
                          <circle cx={cell.cx + 3.5} cy={cell.cy - 3.5} r="2" fill="#15803d" />
                        )}
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="flex gap-4 text-[9px] font-bold mt-2" style={{ color: LABEL_TEXT }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600 block" /> Muntha Target</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-700 block" /> Dhana Saham (H2)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Yes Dashboard */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
        <span className="text-[10px] uppercase font-bold block border-b pb-1" style={{ color: LABEL_TEXT }}>
          Two-Yes Verification Dashboard
        </span>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 rounded border text-center text-xs font-bold transition-all ${
            yes1 ? "bg-green-50 border-green-200 text-green-950" : "bg-red-50 border-red-200 text-red-950"
          }`}>
            Yes #1: Dasha Aligned ({yes1 ? "✓ Aligned" : "✗ Disaligned"})
          </div>
          <div className={`p-3 rounded border text-center text-xs font-bold transition-all ${
            yes2 ? "bg-green-50 border-green-200 text-green-950" : "bg-red-50 border-red-200 text-red-950"
          }`}>
            Yes #2: Annual Return supportive ({yes2 ? "✓ supportive" : "✗ Unsupportive"})
          </div>
        </div>
        <div className="text-center pt-2">
          <span className="text-xs font-extrabold text-amber-900">Verdict: {verdictClass} ({totalYes}/2 Yes)</span>
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
