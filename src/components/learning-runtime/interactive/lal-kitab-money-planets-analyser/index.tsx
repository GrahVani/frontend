"use client";

import { useState, useMemo } from "react";
import { Info, Sparkles, Check, Copy, AlertCircle } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

const SHLOKA_WORDS = [
  { word: "परस्परं", meaning: "Mutual or reciprocal relationship" },
  { word: "मैत्री", meaning: "Friendship and aspects between wealth-forming planets" },
  { word: "धनसिद्धिः", meaning: "Ensures the realization and acquisition of wealth" }
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

export function LalKitabMoneyPlanetsAnalyser() {
  const [marsHouse, setMarsHouse] = useState<number>(1);
  const [mercHouse, setMercHouse] = useState<number>(7);
  const [venHouse, setVenHouse] = useState<number>(4);
  const [userGuess, setUserGuess] = useState<string>("");
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Evaluate aspects
  const { channelActive, channelName, correctAspectKey, phrasingText } = useMemo(() => {
    let active = false;
    let name = "No Major Channels Active";
    let aspectKey = "none";
    let phrase = "";

    if ((marsHouse === 1 && mercHouse === 7) || (marsHouse === 7 && mercHouse === 1)) {
      active = true;
      name = "Mars-Mercury Aspect (Commercial Drive)";
      aspectKey = "mars_merc";
      phrase = "Mars and Mercury aspect each other across the 1-7 axis, merging high courage and initiative with strategic trade intellect. Fosters self-made commercial success.";
    } else if ((mercHouse === 4 && venHouse === 10) || (mercHouse === 10 && venHouse === 4)) {
      active = true;
      name = "Mercury-Venus Aspect (Luxury Trade)";
      aspectKey = "merc_ven";
      phrase = "Mercury and Venus form a mutual connection, aligning commercial business intelligence with luxury holdings and assets. Fosters steady wealth expansion.";
    } else {
      phrase = "Placements are neutral. Monitor dasha transitions and individual planet remedies.";
    }

    return { channelActive: active, channelName: name, correctAspectKey: aspectKey, phrasingText: phrase };
  }, [marsHouse, mercHouse, venHouse]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verifyGuess = (key: string) => {
    setUserGuess(key);
  };

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans animate-fade-in"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="lal-kitab-money-planets-analyser"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Lal Kitab Money Planets Analyser
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 5: Analyzing mutual relationship aspects of Mars, Mercury, and Venus.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE COMPONENT
        </div>
      </div>

      {/* Sanskrit Verse with breakdowns */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" style={{ borderColor: HAIRLINE }}>
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
          Sanskrit Maxim (Click words for breakdown)
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
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
              Placements Configuration
            </span>

            {/* Mars House */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Mars House:</label>
              <select
                value={marsHouse}
                onChange={(e) => { setMarsHouse(parseInt(e.target.value)); setUserGuess(""); }}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                {[1, 2, 4, 7, 10].map((num) => (
                  <option key={num} value={num}>House {num}</option>
                ))}
              </select>
            </div>

            {/* Mercury House */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Mercury House:</label>
              <select
                value={mercHouse}
                onChange={(e) => { setMercHouse(parseInt(e.target.value)); setUserGuess(""); }}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                {[1, 4, 7, 10].map((num) => (
                  <option key={num} value={num}>House {num}</option>
                ))}
              </select>
            </div>

            {/* Venus House */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Venus House:</label>
              <select
                value={venHouse}
                onChange={(e) => { setVenHouse(parseInt(e.target.value)); setUserGuess(""); }}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                {[2, 4, 8, 10].map((num) => (
                  <option key={num} value={num}>House {num}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Chart Visualizer with connection lines */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[250px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-3 w-full text-center">
              Fixed Aries Lagna aspect chart
            </span>

            <div className="w-48 h-48 bg-[#fbf9f4] border p-1 rounded-lg relative" style={{ borderColor: HAIRLINE }}>
              <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={HAIRLINE} strokeWidth="0.8" />
                <line x1="2" y1="2" x2="98" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                <line x1="98" y1="2" x2="2" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                <line x1="50" y1="2" x2="2" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                <line x1="2" y1="50" x2="50" y2="98" stroke={HAIRLINE} strokeWidth="0.8" />
                <line x1="50" y1="98" x2="98" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                <line x1="98" y1="50" x2="50" y2="2" stroke={HAIRLINE} strokeWidth="0.8" />

                {/* Aspect connecting lines */}
                {channelActive && (
                  <line 
                    x1={NORTH_HOUSE_COORDS.find((c) => c.house === (correctAspectKey === "mars_merc" ? marsHouse : mercHouse))?.cx} 
                    y1={NORTH_HOUSE_COORDS.find((c) => c.house === (correctAspectKey === "mars_merc" ? marsHouse : mercHouse))?.cy}
                    x2={NORTH_HOUSE_COORDS.find((c) => c.house === (correctAspectKey === "mars_merc" ? mercHouse : venHouse))?.cx} 
                    y2={NORTH_HOUSE_COORDS.find((c) => c.house === (correctAspectKey === "mars_merc" ? mercHouse : venHouse))?.cy}
                    stroke="#b45309" 
                    strokeWidth="2" 
                    className="animate-pulse"
                  />
                )}

                {NORTH_HOUSE_COORDS.map((cell) => {
                  const hasMars = marsHouse === cell.house;
                  const hasMerc = mercHouse === cell.house;
                  const hasVen = venHouse === cell.house;
                  return (
                    <g key={cell.house}>
                      <text x={cell.cx} y={cell.cy + 1} textAnchor="middle" fontSize="4.5" fill={INK_SECONDARY}>
                        {cell.house}
                      </text>
                      {hasMars && (
                        <circle cx={cell.cx - 3.5} cy={cell.cy - 3.5} r="2" fill="#dc2626" />
                      )}
                      {hasMerc && (
                        <circle cx={cell.cx + 3.5} cy={cell.cy - 3.5} r="2" fill="#059669" />
                      )}
                      {hasVen && (
                        <circle cx={cell.cx} cy={cell.cy + 4} r="2" fill="#db2777" />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Aspect quiz game */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
        <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
          Verify Aspect Relationship (Student Quiz)
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => verifyGuess("mars_merc")}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
              userGuess === "mars_merc"
                ? correctAspectKey === "mars_merc"
                  ? "bg-green-100 border-green-500 text-green-950"
                  : "bg-red-100 border-red-500 text-red-950"
                : "bg-transparent text-gray-700 hover:bg-gray-50"
            }`}
            style={{ borderColor: userGuess === "mars_merc" ? "transparent" : HAIRLINE }}
          >
            Mars-Mercury Aspect
          </button>
          <button
            onClick={() => verifyGuess("merc_ven")}
            className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
              userGuess === "merc_ven"
                ? correctAspectKey === "merc_ven"
                  ? "bg-green-100 border-green-500 text-green-950"
                  : "bg-red-100 border-red-500 text-red-950"
                : "bg-transparent text-gray-700 hover:bg-gray-50"
            }`}
            style={{ borderColor: userGuess === "merc_ven" ? "transparent" : HAIRLINE }}
          >
            Mercury-Venus Aspect
          </button>
        </div>
        {userGuess && (
          <div className="text-xs font-bold flex gap-1.5 items-center">
            {userGuess === correctAspectKey ? (
              <span className="text-green-700">✓ Correct! Aspect channel is active.</span>
            ) : (
              <span className="text-red-750">✗ Incorrect channel selection. Try another.</span>
            )}
          </div>
        )}
      </div>

      {/* Phrasing Register Panel */}
      <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: HAIRLINE }}>
          <div>
            <span className="text-[9px] uppercase tracking-wider block text-gray-400 font-bold">
              Calibrated Interpretations
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
