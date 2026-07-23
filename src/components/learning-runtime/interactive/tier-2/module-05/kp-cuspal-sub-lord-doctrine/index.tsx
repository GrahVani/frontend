"use client";

import { useState, useMemo } from "react";
import { Sparkles, Check, Copy } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";
const LABEL_TEXT = "#5f5447";
const HELPER_TEXT = "#4b5563";

const SHLOKA_WORDS = [
  { word: "उपपतिः", meaning: "The sub-lord of the cusp (Cuspal Sub-Lord / CSL)" },
  { word: "मुख्यः", meaning: "Is primary" },
  { word: "फलदायकः", meaning: "And determines whether the promised results of the house will manifest" }
];

export function KpCuspalSubLordDoctrine() {
  const [activeCusp, setActiveCusp] = useState<2 | 11>(2);
  const [signifiedHouses, setSignifiedHouses] = useState<number[]>([2, 11]);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleHouseSignification = (num: number) => {
    if (signifiedHouses.includes(num)) {
      setSignifiedHouses(signifiedHouses.filter((n) => n !== num));
    } else {
      setSignifiedHouses([...signifiedHouses, num]);
    }
  };

  // Evaluate KP result
  const { rating, verdict, colorTheme, phrasingText } = useMemo(() => {
    const hasWealth = signifiedHouses.includes(2) || signifiedHouses.includes(11);
    const hasCareer = signifiedHouses.includes(6) || signifiedHouses.includes(10);
    const hasLoss = signifiedHouses.includes(5) || signifiedHouses.includes(8) || signifiedHouses.includes(12);

    let r = 50;
    let v = "Neutral CSL Alignment";
    let color = "#d97706"; // Amber
    let phrase = "";

    if (hasLoss) {
      r = 15;
      v = "Severe Detriment / Obstruction";
      color = "#dc2626"; // Red
      phrase = `The sub-lord of the ${activeCusp}nd cusp signifies houses ${signifiedHouses.join(", ")}, which includes detrimental houses (5/8/12). Wealth manifestation is heavily blocked or subject to major losses.`;
    } else if (hasWealth && hasCareer) {
      r = 95;
      v = "Auspicious Career & Wealth Promise";
      color = "#15803d"; // Green
      phrase = `The sub-lord of the ${activeCusp}nd cusp signifies ${signifiedHouses.join(", ")}, combining primary wealth houses (2/11) with work profiles (6/10). Highly auspicious.`;
    } else if (hasWealth) {
      r = 80;
      v = "Auspicious Wealth Promise";
      color = "#16a34a"; // Green-medium
      phrase = `The sub-lord of the ${activeCusp}nd cusp signifies houses ${signifiedHouses.join(", ")}, promising steady financial accumulation.`;
    } else {
      phrase = `The sub-lord of the ${activeCusp}nd cusp signifies houses ${signifiedHouses.join(", ")}, offering standard neutral career and wealth stability.`;
    }

    return { rating: r, verdict: v, colorTheme: color, phrasingText: phrase };
  }, [activeCusp, signifiedHouses]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG Gauge calculations
  const strokeDashoffset = useMemo(() => {
    const circumference = 2 * Math.PI * 30; // radius = 30
    return circumference - (rating / 100) * circumference;
  }, [rating]);

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans animate-fade-in"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="kp-cuspal-sub-lord-doctrine"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            KP Cuspal Sub-Lord Doctrine
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 4: Assessing sub-lord significations for wealth promise.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE WORKBENCH
        </div>
      </div>

      {/* Sanskrit Verse with breakdowns */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" style={{ borderColor: HAIRLINE }}>
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold tracking-wider" style={{ color: LABEL_TEXT }}>
          KP Astrological Maxim (Click words for breakdown)
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
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block border-b pb-1" style={{ color: LABEL_TEXT }}>
              Sub-Lord Parameters
            </span>

            {/* Cusp selector */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>Target Cusp:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveCusp(2)}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                    activeCusp === 2 ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ borderColor: activeCusp === 2 ? "transparent" : HAIRLINE }}
                >
                  2nd Cusp (Wealth Accumulation)
                </button>
                <button
                  onClick={() => setActiveCusp(11)}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                    activeCusp === 11 ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ borderColor: activeCusp === 11 ? "transparent" : HAIRLINE }}
                >
                  11th Cusp (Incoming Gains)
                </button>
              </div>
            </div>

            {/* Signified Houses */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1.5" style={{ color: LABEL_TEXT }}>Signified Houses:</label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 6, 10, 11, 5, 8, 12].map((num) => {
                  const isPositive = [2, 6, 10, 11].includes(num);
                  const isSelected = signifiedHouses.includes(num);
                  return (
                    <button
                      key={num}
                      onClick={() => toggleHouseSignification(num)}
                      className={`p-2 text-center rounded border text-xs font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? isPositive 
                            ? "bg-green-100 border-green-600 text-green-950 scale-105" 
                            : "bg-red-100 border-red-650 text-red-950 scale-105"
                          : "bg-white text-gray-750 hover:bg-amber-50/30"
                      }`}
                      style={{ borderColor: isSelected ? "transparent" : HAIRLINE }}
                    >
                      House {num}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Speedometer Dial Indicator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[220px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block border-b pb-1 w-full text-center mb-6" style={{ color: LABEL_TEXT }}>
              Manifestation Speedometer
            </span>

            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle cx="64" cy="64" r="30" fill="transparent" stroke="#f3f4f6" strokeWidth="8" />
                {/* Foreground Meter Ring */}
                <circle 
                  cx="64" 
                  cy="64" 
                  r="30" 
                  fill="transparent" 
                  stroke={colorTheme} 
                  strokeWidth="8" 
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold" style={{ color: colorTheme }}>{rating}%</span>
                <span className="text-[8px] block font-bold uppercase tracking-wider" style={{ color: LABEL_TEXT }}>Strength</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-amber-900 block mt-3">{verdict}</span>
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
