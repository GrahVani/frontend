"use client";

import { useState, useMemo } from "react";
import { Sparkles, Check, Copy, AlertTriangle } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";
const LABEL_TEXT = "#5f5447";
const HELPER_TEXT = "#4b5563";

const SHLOKA_WORDS = [
  { word: "बलहीने", meaning: "When planets lack structural strength (Shadbala < 1.2 Rupas)" },
  { word: "फलं", meaning: "The promised results and predictions" },
  { word: "नास्ति", meaning: "Do not manifest in life (remains a paper promise)" }
];

export function DhanaYogaShadbalaOverlay() {
  const [shadbalaA, setShadbalaA] = useState<number>(1.5);
  const [shadbalaB, setShadbalaB] = useState<number>(0.8);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Validate threshold
  const { allStrong, phrasingText } = useMemo(() => {
    const strongA = shadbalaA >= 1.2;
    const strongB = shadbalaB >= 1.2;
    const both = strongA && strongB;

    let phrase = "";
    if (both) {
      phrase = "The Shadbala strength verify confirms that the yoga-forming planets possess robust energy. The financial prospects are highly functional and capable of full activation during the respective planetary periods.";
    } else {
      phrase = "Warning: One or both yoga-forming planets lack sufficient Shadbala strength. The combination remains a 'paper promise' — wealth opportunities may present themselves but will require extraordinary self-effort or remedial alignment to materialize.";
    }

    return { allStrong: both, phrasingText: phrase };
  }, [shadbalaA, shadbalaB]);

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
      data-interactive="dhana-yoga-shadbala-overlay"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Dhana Yoga Shadbala Overlay
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 3: Overlaying Shadbala (six-fold strength) metrics onto Dhana Yoga combinations.
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
        {/* Left Column: controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block border-b pb-1" style={{ color: LABEL_TEXT }}>
              Interactive Strength Sliders
            </span>

            {/* Slider A */}
            <div>
              <div className="flex justify-between text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>
                <span>Planet A (2nd Lord) Strength:</span>
                <span className={shadbalaA >= 1.2 ? "text-green-700" : "text-red-700"}>{shadbalaA.toFixed(2)} Rupas</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={shadbalaA}
                onChange={(e) => setShadbalaA(parseFloat(e.target.value))}
                className="w-full accent-amber-850 cursor-pointer"
              />
            </div>

            {/* Slider B */}
            <div>
              <div className="flex justify-between text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>
                <span>Planet B (11th Lord) Strength:</span>
                <span className={shadbalaB >= 1.2 ? "text-green-700" : "text-red-700"}>{shadbalaB.toFixed(2)} Rupas</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={shadbalaB}
                onChange={(e) => setShadbalaB(parseFloat(e.target.value))}
                className="w-full accent-amber-850 cursor-pointer"
              />
            </div>
            
            <div className="text-[9px] font-semibold text-center" style={{ color: LABEL_TEXT }}>
              Classical activation threshold: $\ge 1.20$ Rupas
            </div>
          </div>
        </div>

        {/* Right Column: visual meter indicators */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col justify-center space-y-4 min-h-[200px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block border-b pb-1 w-full text-center" style={{ color: LABEL_TEXT }}>
              Activation Status
            </span>

            {/* Status bars */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Planet A Status:</span>
                <span className={shadbalaA >= 1.2 ? "text-green-700" : "text-red-700"}>
                  {shadbalaA >= 1.2 ? "Functional" : "Lacks Strength"}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Planet B Status:</span>
                <span className={shadbalaB >= 1.2 ? "text-green-700" : "text-red-700"}>
                  {shadbalaB >= 1.2 ? "Functional" : "Lacks Strength"}
                </span>
              </div>
            </div>

            {allStrong ? (
              <div className="p-2.5 rounded bg-green-50 text-green-950 border border-green-200 text-center text-xs font-bold animate-pulse">
                ✓ YOGA ACTIVATED: FULL MATERIAL PROMISE
              </div>
            ) : (
              <div className="p-2.5 rounded bg-red-50 text-red-950 border border-red-200 text-center text-xs font-bold flex items-center justify-center gap-1.5 animate-pulse">
                <AlertTriangle size={14} className="text-red-700" /> PAPER PROMISE ONLY (STAGNATION RISK)
              </div>
            )}
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
