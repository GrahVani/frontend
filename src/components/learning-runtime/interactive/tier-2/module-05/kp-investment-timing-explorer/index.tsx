"use client";

import { useState, useMemo } from "react";
import { Info, Sparkles, Check, Copy } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";

const SHLOKA_WORDS = [
  { word: "दशा-भुक्ति", meaning: "The active planetary periods of Vimshottari" },
  { word: "द्वारेण", meaning: "Through their path/agency" },
  { word: "कालनिर्णयः", meaning: "The final determination of timing is established" }
];

export function KpInvestmentTimingExplorer() {
  const [timeIndex, setTimeIndex] = useState<number>(0); // 0 to 11 (representing 12 months)
  const [planetSigns, setPlanetSigns] = useState<Record<string, "positive" | "negative">>({
    jup: "positive",
    mer: "positive",
    ven: "negative",
    sun: "positive",
    sat: "negative"
  });

  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Map month index to active DBA lords
  const activeDBA = useMemo(() => {
    // Simulate transition
    if (timeIndex < 4) {
      return { dasha: "jup", bhukti: "mer", antara: "ven", name: "Jan - Apr Period (Jupiter-Mercury-Venus)" };
    } else if (timeIndex < 8) {
      return { dasha: "jup", bhukti: "mer", antara: "sun", name: "May - Aug Period (Jupiter-Mercury-Sun)" };
    } else {
      return { dasha: "jup", bhukti: "sat", antara: "sat", name: "Sep - Dec Period (Jupiter-Saturn-Saturn)" };
    }
  }, [timeIndex]);

  const togglePlanetSign = (key: string) => {
    setPlanetSigns({
      ...planetSigns,
      [key]: planetSigns[key] === "positive" ? "negative" : "positive"
    });
  };

  // Evaluate timing
  const { timingRating, timingVerdict, phrasingText } = useMemo(() => {
    const dSign = planetSigns[activeDBA.dasha] || "positive";
    const bSign = planetSigns[activeDBA.bhukti] || "positive";
    const aSign = planetSigns[activeDBA.antara] || "positive";

    const signs = [dSign, bSign, aSign];
    const negativeCount = signs.filter((s) => s === "negative").length;

    let rating = 100 - negativeCount * 30;
    let verdict = "Auspicious Timing";
    let phrase = "";

    if (negativeCount === 3) {
      rating = 10;
      verdict = "Severe Loss Warning";
      phrase = `In the active ${activeDBA.name}, all period lords signify detrimental houses (5/8/12). Avoid all major transactions or property investments immediately.`;
    } else if (negativeCount >= 1) {
      verdict = "Vulnerable / Speculative";
      phrase = `In the active ${activeDBA.name}, mixed significations are active. Wealth gains are possible but accompanied by high expenditure or transaction blockages.`;
    } else {
      phrase = `All active period lords in ${activeDBA.name} signify favorable wealth houses (2/6/10/11). Excellent window for investments and commercial contracts.`;
    }

    return { timingRating: rating, timingVerdict: verdict, phrasingText: phrase };
  }, [activeDBA, planetSigns]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans animate-fade-in"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="kp-investment-timing-explorer"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            KP Investment Timing Explorer
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 4: Aligning active Dasha-Bhukti-Antara significators with timing windows.
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
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
              Active Period Timeline Slider
            </span>

            {/* Months slider */}
            <div>
              <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-1">
                <span>Select Calendar Timeline:</span>
                <span className="text-amber-900 font-extrabold">{activeDBA.name}</span>
              </div>
              <input
                type="range"
                min="0"
                max="11"
                step="1"
                value={timeIndex}
                onChange={(e) => setTimeIndex(parseInt(e.target.value))}
                className="w-full accent-amber-850 cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-gray-400 mt-1 font-semibold">
                <span>Jan</span>
                <span>Jun</span>
                <span>Dec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Risk / Rating gauge */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col justify-center space-y-4 min-h-[200px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1 w-full text-center">
              Signification Toggle & Safety Indicator
            </span>

            {/* Toggles */}
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.keys(planetSigns).map((pKey) => {
                const state = planetSigns[pKey];
                return (
                  <button
                    key={pKey}
                    onClick={() => togglePlanetSign(pKey)}
                    className={`px-2 py-1 text-[10px] font-bold rounded border cursor-pointer transition-all ${
                      state === "positive" ? "bg-green-100 text-green-900 border-green-300" : "bg-red-100 text-red-900 border-red-300"
                    }`}
                  >
                    {pKey.toUpperCase()}: {state.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 text-center pt-2">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    timingRating >= 70 ? "bg-green-650" : timingRating <= 35 ? "bg-red-650 animate-pulse" : "bg-amber-650"
                  }`} 
                  style={{ width: `${timingRating}%` }}
                />
              </div>
              <span className="text-sm font-extrabold text-amber-900 block">{timingVerdict} ({timingRating}%)</span>
            </div>
          </div>
        </div>
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
