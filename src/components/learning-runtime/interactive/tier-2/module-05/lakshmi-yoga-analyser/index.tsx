"use client";

import { useState, useMemo } from "react";
import { Sparkles, Check, Copy, CheckCircle2, XCircle } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";
const LABEL_TEXT = "#5f5447";
const HELPER_TEXT = "#4b5563";

const SHLOKA_WORDS = [
  { word: "भाग्येशे", meaning: "The lord of the 9th house of fortune (bhāgyeśa)" },
  { word: "केन्द्रकोणे", meaning: "Situated in a quadrant (kendra) or trine (koṇa)" },
  { word: "तु", meaning: "And" },
  { word: "तुङ्गे", meaning: "Exalted (tuṅga) or in its own sign" },
  { word: "लग्नेशे", meaning: "And the lord of the ascendant (lagneśa)" },
  { word: "बलसंयुते", meaning: "Is endowed with strength" }
];

export function LakshmiYogaAnalyser() {
  const [lord9Placement, setLord9Placement] = useState<"kendra" | "dusthana">("kendra");
  const [lord9Dignity, setLord9Dignity] = useState<"strong" | "weak">("strong");
  const [lagnaLordStrength, setLagnaLordStrength] = useState<"strong" | "weak">("strong");
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Validate rules
  const checks = useMemo(() => {
    const c1 = lord9Placement === "kendra";
    const c2 = lord9Dignity === "strong";
    const c3 = lagnaLordStrength === "strong";
    const all = c1 && c2 && c3;

    return { c1, c2, c3, all };
  }, [lord9Placement, lord9Dignity, lagnaLordStrength]);

  const phrasingText = useMemo(() => {
    if (checks.all) {
      return "The prestigious Lakshmi Yoga is fully verified. The native possesses divine grace, exceptional financial capacity, and stable prosperity.";
    }
    return "Lakshmi Yoga is incomplete. While partial indicators exist, the full structural requirements are not met. Focus client reading on standard self-effort savings.";
  }, [checks.all]);

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
      data-interactive="lakshmi-yoga-analyser"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Lakshmi Yoga Analyser
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 3: Verifying the structural requirements of the prestigious Lakshmi Yoga.
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
              Interactive Rule Modulators
            </span>

            {/* 9th Lord placement */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>9th Lord Placement:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLord9Placement("kendra")}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                    lord9Placement === "kendra" ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ borderColor: lord9Placement === "kendra" ? "transparent" : HAIRLINE }}
                >
                  Kendra / Trikona
                </button>
                <button
                  onClick={() => setLord9Placement("dusthana")}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                    lord9Placement === "dusthana" ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ borderColor: lord9Placement === "dusthana" ? "transparent" : HAIRLINE }}
                >
                  Dusthana (6, 8, 12)
                </button>
              </div>
            </div>

            {/* 9th Lord Dignity */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>9th Lord Dignity:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLord9Dignity("strong")}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                    lord9Dignity === "strong" ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ borderColor: lord9Dignity === "strong" ? "transparent" : HAIRLINE }}
                >
                  Exalted / Own Sign
                </button>
                <button
                  onClick={() => setLord9Dignity("weak")}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                    lord9Dignity === "weak" ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ borderColor: lord9Dignity === "weak" ? "transparent" : HAIRLINE }}
                >
                  Debilitated / Combust
                </button>
              </div>
            </div>

            {/* Lagna Lord Strength */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>Lagna Lord Strength:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLagnaLordStrength("strong")}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                    lagnaLordStrength === "strong" ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ borderColor: lagnaLordStrength === "strong" ? "transparent" : HAIRLINE }}
                >
                  Strong (Dignified)
                </button>
                <button
                  onClick={() => setLagnaLordStrength("weak")}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                    lagnaLordStrength === "weak" ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ borderColor: lagnaLordStrength === "weak" ? "transparent" : HAIRLINE }}
                >
                  Weak / Afflicted
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Rule Verification Checklist & Glow Display */}
        <div className="lg:col-span-6 space-y-4">
          <div 
            className="p-6 rounded-xl border bg-white shadow-sm flex flex-col justify-center space-y-4 min-h-[250px] transition-all duration-500"
            style={{ 
              borderColor: checks.all ? GOLD : HAIRLINE,
              boxShadow: checks.all ? "0 4px 20px rgba(156, 122, 47, 0.25)" : "none"
            }}
          >
            <span className="text-[10px] uppercase font-bold block border-b pb-1 w-full text-center" style={{ color: LABEL_TEXT }}>
              Rule Verification Status
            </span>

            <div className="space-y-3">
              {/* Check 1 */}
              <div className="flex items-center gap-2.5 text-xs font-bold">
                {checks.c1 ? <CheckCircle2 size={16} className="text-green-700" /> : <XCircle size={16} className="text-red-700" />}
                <span className={checks.c1 ? "text-gray-800" : "font-medium"} style={{ color: checks.c1 ? undefined : HELPER_TEXT }}>
                  Rule 1: 9th Lord placed in Kendra or Trikona
                </span>
              </div>

              {/* Check 2 */}
              <div className="flex items-center gap-2.5 text-xs font-bold">
                {checks.c2 ? <CheckCircle2 size={16} className="text-green-700" /> : <XCircle size={16} className="text-red-700" />}
                <span className={checks.c2 ? "text-gray-800" : "font-medium"} style={{ color: checks.c2 ? undefined : HELPER_TEXT }}>
                  Rule 2: 9th Lord in exalted or own sign dignity
                </span>
              </div>

              {/* Check 3 */}
              <div className="flex items-center gap-2.5 text-xs font-bold">
                {checks.c3 ? <CheckCircle2 size={16} className="text-green-700" /> : <XCircle size={16} className="text-red-700" />}
                <span className={checks.c3 ? "text-gray-800" : "font-medium"} style={{ color: checks.c3 ? undefined : HELPER_TEXT }}>
                  Rule 3: Lagna Lord strong and healthy
                </span>
              </div>
            </div>

            {checks.all && (
              <div className="p-3 bg-amber-50/40 rounded border border-amber-250/20 text-center animate-bounce text-xs font-bold text-amber-900">
                ✨ LAKSHMI YOGA VERIFIED IN FULL ✨
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
