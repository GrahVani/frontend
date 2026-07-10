"use client";

import { useState, useMemo } from "react";
import { Info, Sparkles, Check, Copy } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";

const SHLOKA_WORDS = [
  { word: "इन्द्राद्याः", meaning: "Indra and other classic yogas" },
  { word: "विशिष्टाः", meaning: "Are special divisional combinations" },
  { word: "धनयोगाः", meaning: "Forming financial status and wealth structures" }
];

export function DhanaYogaVariantsEvaluator() {
  const [variant, setVariant] = useState<"indra" | "kubera" | "bhagya">("indra");
  const [dignityState, setDignityState] = useState<"strong" | "weak">("strong");
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Compute values
  const { score, phrasingText } = useMemo(() => {
    let s = 50;
    let phrase = "";

    if (variant === "indra") {
      s = dignityState === "strong" ? 90 : 60;
      phrase = dignityState === "strong"
        ? "The Indra Yoga is verified with strong planetary dignity, promising notable authority, social status, and professional assets."
        : "The Indra Yoga is formed but weakened by planetary combustion or debilitation. High professional aspirations are met with initial delays.";
    } else if (variant === "kubera") {
      s = dignityState === "strong" ? 95 : 65;
      phrase = dignityState === "strong"
        ? "The Kubera Yoga is confirmed. A supreme indicator of legacy preservation, savings, and stable assets."
        : "The Kubera Yoga is verified but has low structural strength. Savings capability is present but vulnerable to sudden outflows.";
    } else {
      s = dignityState === "strong" ? 85 : 55;
      phrase = dignityState === "strong"
        ? "The Bhagya Yoga (Mutual Exchange of 1st and 9th lords) is fully verified. Financial success arrives with luck and spiritual alignment."
        : "The Bhagya Yoga is present but lord strength is compromised. Good opportunities present themselves but require active effort to fully anchor.";
    }

    return { score: s, phrasingText: phrase };
  }, [variant, dignityState]);

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
      data-interactive="dhana-yoga-variants-evaluator"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Major Dhana Yoga Variants Evaluator
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 3: Analyzing complex, multi-lord quadrant and trine combinations.
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
        {/* Left Column: controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
              Variant Configurator
            </span>

            {/* Select Variant */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Dhana Yoga Variant:</label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="indra">Indra Yoga (Status & Wealth)</option>
                <option value="kubera">Kubera Yoga (Treasury & Savings)</option>
                <option value="bhagya">Bhāgya Yoga (Ascendant-9th Exchange)</option>
              </select>
            </div>

            {/* Dignity Modulator */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Planetary Dignity:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDignityState("strong")}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                    dignityState === "strong" ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ borderColor: dignityState === "strong" ? "transparent" : HAIRLINE }}
                >
                  Exalted / Own Sign (Strong)
                </button>
                <button
                  onClick={() => setDignityState("weak")}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                    dignityState === "weak" ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ borderColor: dignityState === "weak" ? "transparent" : HAIRLINE }}
                >
                  Debilitated / Combust (Stressed)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Intensity dial */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[200px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1 w-full text-center mb-6">
              Yoga Functional Strength
            </span>

            {/* Dial gauge indicator */}
            <div className="w-full space-y-2 text-center">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-amber-800 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-sm font-extrabold text-amber-900">{score}% Intensity</span>
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
