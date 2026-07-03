"use client";

import { useState, useMemo } from "react";
import { Info, Sparkles, Check, Copy, Flame, Shield } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";

const SHLOKA_WORDS = [
  { word: "सिंहे", meaning: "In Leo (Solar Hora)" },
  { word: "पुरुषकारः", meaning: "Manly initiative, struggle, and dynamic self-effort (pravṛtti)" },
  { word: "कर्कटे", meaning: "In Cancer (Lunar Hora)" },
  { word: "सौम्यत्वम्", meaning: "Gentleness, receptive protection, savings, and grace (nivṛtti)" }
];

export function D2SolarLunarTendencies() {
  const [solarRatio, setSolarRatio] = useState<number>(50); // percentage of planets in solar
  const [layer, setLayer] = useState<"capital" | "acquisition" | "temperament">("capital");
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const activeStrength = solarRatio;
  const inactiveStrength = 100 - solarRatio;

  // Compute values
  const { summaryText, phrasingText } = useMemo(() => {
    let summary = "";
    let phrase = "";

    if (layer === "capital") {
      if (activeStrength > 60) {
        summary = "Capital Structure: Solar Dominance. Highly leveraged, active venture funding, liquid asset turnover.";
        phrase = "The capital is structured around high liquidity and active turnover. There is a risk of capital depletion if active income sources pause. Diversification into stable land is advised.";
      } else if (inactiveStrength > 60) {
        summary = "Capital Structure: Lunar Dominance. Retained reserves, legacy wealth holdings, low leverage.";
        phrase = "Capital is primarily held in legacy reserves, trusts, and gold holdings. While extremely secure, growth remains conservative; consider active allocation.";
      } else {
        summary = "Capital Structure: Balanced. Mix of active venture capital and solid treasury reserves.";
        phrase = "A healthy capital structure balancing high-yield active investments with solid legacy assets and liquid reserves.";
      }
    } else if (layer === "acquisition") {
      if (activeStrength > 60) {
        summary = "Acquisition Path: Solar Dominance. Direct sales, entrepreneurial startups, competitive services.";
        phrase = "Wealth is acquired primarily through personal initiative, intellectual consulting, or direct trading. Earnings correspond directly to active working hours.";
      } else if (inactiveStrength > 60) {
        summary = "Acquisition Path: Lunar Dominance. Dividends, real estate rental yield, family trust disbursements.";
        phrase = "Earnings flow from passive assets, rental returns, or legacy investments. Secure and self-sustaining, requiring low daily management.";
      } else {
        summary = "Acquisition Path: Balanced. Active salary/fees combined with passive asset dividends.";
        phrase = "Dual-inflow streams: native generates active fees through enterprise, backed by stable dividend-yielding family reserves.";
      }
    } else {
      if (activeStrength > 60) {
        summary = "Financial Temperament: Solar Dominance. High risk tolerance, speculative drive, aggressive trading.";
        phrase = "The native exhibits a high appetite for risk, actively trading and seeking expansion. Implement structured stop-losses to protect assets.";
      } else if (inactiveStrength > 60) {
        summary = "Financial Temperament: Lunar Dominance. Risk-averse, focused on preservation, treasury bonds, gold.";
        phrase = "The temperament leans toward security and capital preservation. Reluctant to take risks, which limits growth during market cycles.";
      } else {
        summary = "Financial Temperament: Balanced. Measured risk-taking with solid protective hedges.";
        phrase = "A balanced financial temperament, utilizing calculated risk-taking for growth, while maintaining solid preservation hedges.";
      }
    }

    return { summaryText: summary, phrasingText: phrase };
  }, [solarRatio, layer]);

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
      data-interactive="d2-solar-lunar-tendencies"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            D2 Solar vs. Lunar Tendencies
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 2: Comparing Enterprise (Pravṛtti) vs. Protection (Nivṛtti) wealth balances.
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
          Sanskrit Classical Verse (Click words for breakdown)
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
        {/* Left Column: Ratio slider and Layer Toggles */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Hora Ratio & Signification Layer
              </span>
              
              {/* Layer selector */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => setLayer("capital")}
                  className={`text-[8px] font-bold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                    layer === "capital" ? "bg-amber-800 text-white" : "bg-transparent text-gray-500"
                  }`}
                  style={{ borderColor: HAIRLINE }}
                >
                  Capital
                </button>
                <button
                  onClick={() => setLayer("acquisition")}
                  className={`text-[8px] font-bold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                    layer === "acquisition" ? "bg-amber-800 text-white" : "bg-transparent text-gray-500"
                  }`}
                  style={{ borderColor: HAIRLINE }}
                >
                  Acquisition
                </button>
                <button
                  onClick={() => setLayer("temperament")}
                  className={`text-[8px] font-bold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                    layer === "temperament" ? "bg-amber-800 text-white" : "bg-transparent text-gray-500"
                  }`}
                  style={{ borderColor: HAIRLINE }}
                >
                  Temperament
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-amber-900 mb-2">
                <span>Solar Dominance (Enterprise)</span>
                <span>{solarRatio}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={solarRatio}
                onChange={(e) => setSolarRatio(parseInt(e.target.value))}
                className="w-full accent-amber-850 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-bold text-indigo-900 mt-1">
                <span>0% (Cancer/Lunar Dominant)</span>
                <span>100% (Leo/Solar Dominant)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Gauges */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col justify-center space-y-5 min-h-[200px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1 w-full text-center">
              Balance Evaluation (Active Layer: {layer.toUpperCase()})
            </span>

            {/* Solar meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span className="flex items-center gap-1"><Flame size={14} className="text-amber-600" /> Enterprise (Leo/Sun)</span>
                <span className="text-amber-800">{activeStrength}%</span>
              </div>
              <div className="w-full bg-gray-150 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${activeStrength}%` }}
                />
              </div>
            </div>

            {/* Lunar meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span className="flex items-center gap-1"><Shield size={14} className="text-indigo-650" /> Protection (Cancer/Moon)</span>
                <span className="text-indigo-850">{inactiveStrength}%</span>
              </div>
              <div className="w-full bg-gray-150 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${inactiveStrength}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis description */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm leading-relaxed" style={{ borderColor: HAIRLINE }}>
        <span className="text-[9px] uppercase font-bold text-gray-400 block border-b pb-1 mb-2">
          Synthesis Evaluation
        </span>
        <p className="text-xs font-bold text-amber-900">{summaryText}</p>
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
