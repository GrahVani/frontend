"use client";

import { useState, useMemo } from "react";
import { ShieldAlert, Sparkles, Check, Copy } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";
const CHART_LINE = "#B89A58";
const CHART_LINE_STRONG = "#8A641D";
const LABEL_TEXT = "#5B6472";
const LABEL_TEXT_STRONG = "#374151";

type Lord2Location = "2nd" | "11th" | "12th" | "6th";
type Lord11Location = "11th" | "2nd" | "8th" | "1st";
type Association = "conjunction" | "aspect" | "parivartana" | "none";

const SHLOKA_WORDS = [
  { word: "धनाधिपो", meaning: "The lord of the 2nd house (dhana-bhāva)" },
  { word: "लाभगतो", meaning: "Positioned in the 11th house of gains (lābha-bhāva)" },
  { word: "लाभाधिपतिः", meaning: "And the lord of the 11th house" },
  { word: "संयुतः", meaning: "Conjoined together" }
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

export function SecondEleventhLordPermutations() {
  const [lord2Loc, setLord2Loc] = useState<Lord2Location>("2nd");
  const [lord11Loc, setLord11Loc] = useState<Lord11Location>("11th");
  const [association, setAssociation] = useState<Association>("none");
  const [btrShift, setBtrShift] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Compute Dhana Yoga strength score
  const { yogaScore, yogaName, phrasingText } = useMemo(() => {
    let score = 20; // baseline
    let name = "No Dhana Yoga Active";
    let phrase = "";

    // Check association first
    if (association === "parivartana" || (lord2Loc === "11th" && lord11Loc === "2nd")) {
      score = 95;
      name = "Maha Parivartana Dhana Yoga (Supreme Exchange)";
      phrase = "A classic Parivartana (sign exchange) between the lords of the 2nd (wealth/savings) and 11th (income/gains) houses. This forms a supreme Dhana Yoga, suggesting high financial capabilities and assets.";
    } else if (association === "conjunction") {
      score = 80;
      name = "Dhana Yoga (Conjunction)";
      phrase = "The 2nd lord and 11th lord occupy the same sign, merging gains and savings. Financial opportunities materialize via family business, networks, or speech.";
    } else if (association === "aspect") {
      score = 70;
      name = "Dhana Yoga (Mutual Aspect)";
      phrase = "The 2nd lord and 11th lord aspect each other across the houses. Gains are directed reliably into long-term savings.";
    } else {
      // Individual lord locations
      if (lord2Loc === "11th" || lord11Loc === "2nd") {
        score = 65;
        name = "Sambandha Dhana Yoga (Single Connection)";
        phrase = "A direct sambandha (connection) is established between the house of gains and the house of savings. This supports asset building.";
      } else if (lord2Loc === "12th" || lord11Loc === "8th") {
        score = 25;
        name = "Dhana Affliction (Loss/Dusthana link)";
        phrase = "The wealth lords are positioned in dusthana houses (8th/12th), pointing to high expenditures or sudden changes in liquid capital. Remedial measures should focus on conservation.";
      } else {
        name = "Neutral Rulership Structure";
        phrase = "The 2nd and 11th lords are in neutral configurations. Wealth is generated primarily through standard self-effort without major yogic boosts.";
      }
    }

    return { yogaScore: score, yogaName: name, phrasingText: phrase };
  }, [lord2Loc, lord11Loc, association]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHouseClick = (houseNum: number) => {
    if (houseNum === 2) {
      setLord2Loc("2nd");
    } else if (houseNum === 11) {
      setLord2Loc("11th");
    } else if (houseNum === 12) {
      setLord2Loc("12th");
    } else if (houseNum === 6) {
      setLord2Loc("6th");
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
      data-interactive="second-eleventh-lord-permutations"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            2nd & 11th Lord Permutations
          </h2>
          <p className="text-xs italic" style={{ color: LABEL_TEXT_STRONG }}>
            Module 5, Chapter 1: Assessing sambandha (connections) and exchanges forming Dhana Yogas.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE COMPONENT
        </div>
      </div>

      {/* Sanskrit Verse with Interactive Breakdown */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" style={{ borderColor: HAIRLINE }}>
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold tracking-wider" style={{ color: LABEL_TEXT }}>
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
        {/* Left Column: controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block border-b pb-1" style={{ color: LABEL_TEXT, borderColor: HAIRLINE }}>
              Lord Relations & Permutations
            </span>

            {/* 2nd Lord Placement */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT_STRONG }}>
                2nd Lord House Position:
              </label>
              <select
                value={lord2Loc}
                onChange={(e) => setLord2Loc(e.target.value as Lord2Location)}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="2nd">2nd House (Own Sign)</option>
                <option value="11th">11th House (Savings linked to Gains)</option>
                <option value="12th">12th House (Savings linked to Loss)</option>
                <option value="6th">6th House (Savings linked to Service)</option>
              </select>
            </div>

            {/* 11th Lord Placement */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT_STRONG }}>
                11th Lord House Position:
              </label>
              <select
                value={lord11Loc}
                onChange={(e) => setLord11Loc(e.target.value as Lord11Location)}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="11th">11th House (Own Sign)</option>
                <option value="2nd">2nd House (Gains linked to Savings)</option>
                <option value="8th">8th House (Gains linked to Hidden matters)</option>
                <option value="1st">1st House (Gains linked to Self)</option>
              </select>
            </div>

            {/* Association type */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT_STRONG }}>
                Lord Association Type:
              </label>
              <select
                value={association}
                onChange={(e) => setAssociation(e.target.value as Association)}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="none">None (Isolated placements)</option>
                <option value="conjunction">Conjunction (Same sign)</option>
                <option value="aspect">Mutual Aspect (Opposite houses)</option>
                <option value="parivartana">Parivartana (Exchange of signs)</option>
              </select>
            </div>

            {/* BTR Shift Toggle */}
            <div className="pt-2 flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={btrShift}
                  onChange={(e) => setBtrShift(e.target.checked)}
                  className="accent-amber-800"
                />
                Simulate BTR Boundary Shift (+/- 4 minutes)
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Visualizer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[280px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block mb-2 w-full text-center" style={{ color: LABEL_TEXT }}>
              Exchange/Aspect Flow Reference (Click 2, 11, 12, 6 for 2nd Lord Placement)
            </span>

            {/* Chart SVG showing arrows or aspect lines */}
            <div className="w-48 h-48 bg-[#fbf9f4] border p-1 rounded-lg relative" style={{ borderColor: CHART_LINE }}>
              <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={CHART_LINE_STRONG} strokeWidth="1" />
                <line x1="2" y1="2" x2="98" y2="98" stroke={CHART_LINE} strokeWidth="0.85" />
                <line x1="98" y1="2" x2="2" y2="98" stroke={CHART_LINE} strokeWidth="0.85" />
                <line x1="50" y1="2" x2="2" y2="50" stroke={CHART_LINE} strokeWidth="0.9" />
                <line x1="2" y1="50" x2="50" y2="98" stroke={CHART_LINE} strokeWidth="0.9" />
                <line x1="50" y1="98" x2="98" y2="50" stroke={CHART_LINE} strokeWidth="0.9" />
                <line x1="98" y1="50" x2="50" y2="2" stroke={CHART_LINE} strokeWidth="0.9" />

                {/* Interactive polygon overlays */}
                <polygon points="2,2 50,2 26,26" fill="transparent" className="cursor-pointer hover:fill-amber-100/10" onClick={() => handleHouseClick(2)} />
                <polygon points="98,2 50,2 74,26" fill="transparent" className="cursor-pointer hover:fill-amber-100/10" onClick={() => handleHouseClick(11)} />
                <polygon points="74,2 50,2 73,13" fill="transparent" className="cursor-pointer hover:fill-amber-100/10" onClick={() => handleHouseClick(12)} />
                <polygon points="2,98 50,98 26,74" fill="transparent" className="cursor-pointer hover:fill-amber-100/10" onClick={() => handleHouseClick(6)} />

                {/* Draw exchange curve line if Parivartana active */}
                {(association === "parivartana" || (lord2Loc === "11th" && lord11Loc === "2nd")) && (
                  <path 
                    d="M 27 13 C 45 3, 70 12, 87 27" 
                    fill="none" 
                    stroke={GOLD} 
                    strokeWidth="1.8" 
                    strokeDasharray="1,1"
                    className="animate-pulse"
                  />
                )}

                {/* Draw aspect straight line if Aspect active */}
                {association === "aspect" && (
                  <line 
                    x1="27" 
                    y1="13" 
                    x2="87" 
                    y2="27" 
                    stroke={GOLD} 
                    strokeWidth="1.6" 
                  />
                )}

                {/* Draw conjunction indicator circle */}
                {association === "conjunction" && (
                  <circle cx="50" cy="50" r="10" fill="rgba(184, 132, 33, 0.15)" stroke={CHART_LINE_STRONG} strokeWidth="0.8" strokeDasharray="2,2" />
                )}

                {NORTH_HOUSE_COORDS.map((cell) => {
                  const is2 = cell.house === 2;
                  const is11 = cell.house === 11;
                  return (
                    <g key={cell.house} className="pointer-events-none">
                      <text 
                        x={cell.cx} 
                        y={cell.cy + 1} 
                        textAnchor="middle" 
                        fontSize="5" 
                        fill={is2 || is11 ? CHART_LINE_STRONG : LABEL_TEXT_STRONG} 
                        fontWeight={is2 || is11 ? "bold" : "600"}
                      >
                        {cell.house}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Dhana Yoga Strength Speedometer Indicator */}
            <div className="w-full mt-4 space-y-1 text-center">
              <span className="text-[10px] uppercase font-bold block" style={{ color: LABEL_TEXT_STRONG }}>Dhana Yoga Intensity Indicator:</span>
              <span className="text-xs font-bold text-amber-900 block mt-0.5">{yogaName}</span>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-amber-800 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${yogaScore}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-amber-900">{yogaScore}% Potential</span>
            </div>
          </div>
        </div>
      </div>

      {/* BTR Boundary Warning Box */}
      {btrShift && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-950 shadow-sm leading-relaxed space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-red-800">
            <ShieldAlert size={16} /> BTR Boundary Shift Alert
          </div>
          <p className="text-[11px]" style={{ color: LABEL_TEXT_STRONG }}>
            <strong>Rectification Required:</strong> A minor 4-minute birth time shift shifts the 2nd lord from Taurus to Gemini, reassigning rulership from Venus to Mercury. Do not issue predictive statements on the strength of this yoga without verifying birth time accuracy first.
          </p>
        </div>
      )}

      {/* Phrasing Register Panel */}
      <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: HAIRLINE }}>
          <div>
            <span className="text-[9px] uppercase tracking-wider block font-bold" style={{ color: LABEL_TEXT }}>
              Calibrated Permutation Phrasing
            </span>
            <span className="text-[10px] font-medium italic" style={{ color: LABEL_TEXT_STRONG }}>
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
        <blockquote className="text-xs italic border-l-2 pl-3 py-1 bg-amber-50/10" style={{ borderColor: GOLD, color: LABEL_TEXT_STRONG }}>
          &ldquo;{phrasingText}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}
