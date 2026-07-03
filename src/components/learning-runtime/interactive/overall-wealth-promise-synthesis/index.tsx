"use client";

import { useState, useMemo } from "react";
import { Info, Sparkles, Check, Copy, Flame } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";

const SHLOKA_WORDS = [
  { word: "सर्वसूत्रसमन्वयाद्", meaning: "From harmonising and cross-checking all astrological streams (Parāśari, KP, Lal Kitab, Tājika)" },
  { word: "बलतो", meaning: "Weighted accurately by their scriptural strength (Shadbala, CSL, Teva status)" },
  { word: "धनवैभवम्", meaning: "The ultimate realization of wealth and prosperity" },
  { word: "गतिरूपं", meaning: "Declared as a trajectory or direction of financial life" },
  { word: "गतिरूपं वदेत्", meaning: "Must be stated by the wise practitioner as a trend, never as a fatalistic exact figure" }
];

export function OverallWealthPromiseSynthesis() {
  const [parasaraStrength, setParasaraStrength] = useState<number>(85);
  const [kpCSLFavorable, setKpCSLFavorable] = useState<boolean>(true);
  const [lalKitabMarsAwake, setLalKitabMarsAwake] = useState<boolean>(true);
  const [lalKitabMercAwake, setLalKitabMercAwake] = useState<boolean>(true);
  const [tajikaSahamActive, setTajikaSahamActive] = useState<boolean>(true);

  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Evaluate convergence and overall verdict
  const { convergenceFactor, confidenceTier, phrasingText } = useMemo(() => {
    let factorsCount = 0;
    if (parasaraStrength >= 70) factorsCount++;
    if (kpCSLFavorable) factorsCount++;
    if (lalKitabMarsAwake && lalKitabMercAwake) factorsCount++;
    if (tajikaSahamActive) factorsCount++;

    const score = (factorsCount / 4) * 100;
    
    let tier = "Moderate Confidence";
    let phrase = "";

    if (score >= 75) {
      tier = "Strong Trajectory Promise (High Confidence)";
      phrase = `Across all wealth streams, your chart exhibits a highly converged wealth promise: a solid Parāśari baseline, favorable KP significators, and active Tājika Saham activations. This indicates a confident, upward financial trajectory.`;
    } else if (score >= 50) {
      tier = "Moderate Trajectory Promise";
      phrase = `The chart displays mixed financial indications. While the baseline promise is present, minor obstructions in timing or auxiliary streams advise a structured approach rather than aggressive speculation.`;
    } else {
      tier = "Restricted Trajectory Promise (Low Confidence)";
      phrase = `Significant divergences exist across the streams, indicating potential leakages or delays in wealth manifestation. Focus on conservative cash holdings and apply classical remedies.`;
    }

    return { convergenceFactor: score, confidenceTier: tier, phrasingText: phrase };
  }, [parasaraStrength, kpCSLFavorable, lalKitabMarsAwake, lalKitabMercAwake, tajikaSahamActive]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG Gauge coordinates
  const strokeDashoffset = useMemo(() => {
    const circumference = 2 * Math.PI * 30;
    return circumference - (convergenceFactor / 100) * circumference;
  }, [convergenceFactor]);

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans animate-fade-in"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="overall-wealth-promise-synthesis"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Multi-Domain Wealth Synthesis Workbench
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 6: Harmonizing Parāśari, KP, Lal Kitab, and Tājika wealth promises.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE SYNTHESIZER
        </div>
      </div>

      {/* Sanskrit Verse with breakdowns */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" style={{ borderColor: HAIRLINE }}>
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
          Samanvaya Synthesis Maxim (Click words for breakdown)
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

      {/* Main Grid: 4-stream panels + dial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
        {/* Left Column: controls */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stream 1: Parāśari */}
            <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
              <span className="text-[10px] uppercase font-bold text-amber-800 block border-b pb-1">
                1. Parāśari Base (Houses, D2)
              </span>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] uppercase font-bold text-gray-500">
                  <span>D1/D2 Strength:</span>
                  <span className="text-amber-900 font-extrabold">{parasaraStrength}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={parasaraStrength}
                  onChange={(e) => setParasaraStrength(parseInt(e.target.value))}
                  className="w-full accent-amber-850 cursor-pointer"
                />
              </div>
            </div>

            {/* Stream 2: KP CSL */}
            <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
              <span className="text-[10px] uppercase font-bold text-amber-800 block border-b pb-1">
                2. KP Cuspal Sub-Lord
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 pt-1">
                <input
                  type="checkbox"
                  checked={kpCSLFavorable}
                  onChange={(e) => setKpCSLFavorable(e.target.checked)}
                  className="accent-amber-800"
                />
                CSL Signifies 2-6-10-11
              </label>
            </div>

            {/* Stream 3: Lal Kitab */}
            <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
              <span className="text-[10px] uppercase font-bold text-amber-800 block border-b pb-1">
                3. Lal Kitab Channels
              </span>
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={lalKitabMarsAwake}
                    onChange={(e) => setLalKitabMarsAwake(e.target.checked)}
                    className="accent-amber-800"
                  />
                  Mars Awake (Action)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={lalKitabMercAwake}
                    onChange={(e) => setLalKitabMercAwake(e.target.checked)}
                    className="accent-amber-800"
                  />
                  Mercury Awake (Intellect)
                </label>
              </div>
            </div>

            {/* Stream 4: Tājika */}
            <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
              <span className="text-[10px] uppercase font-bold text-amber-800 block border-b pb-1">
                4. Tājika Annual return
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 pt-1">
                <input
                  type="checkbox"
                  checked={tajikaSahamActive}
                  onChange={(e) => setTajikaSahamActive(e.target.checked)}
                  className="accent-amber-800"
                />
                Dhana Saham Activated
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Convergence Radar Dial */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[220px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1 w-full text-center mb-6">
              Cross-Stream Convergence Dial
            </span>

            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="30" fill="transparent" stroke="#f3f4f6" strokeWidth="8" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="30" 
                  fill="transparent" 
                  stroke={convergenceFactor >= 75 ? "#15803d" : convergenceFactor <= 25 ? "#dc2626" : "#d97706"} 
                  strokeWidth="8" 
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-amber-900">{convergenceFactor}%</span>
                <span className="text-[8px] text-gray-400 block font-bold uppercase tracking-wider">Correlation</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-amber-900 block mt-4 text-center">{confidenceTier}</span>
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
