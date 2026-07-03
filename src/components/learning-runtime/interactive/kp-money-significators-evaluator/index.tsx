"use client";

import { useState, useMemo } from "react";
import { Info, Sparkles, Check, Copy } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";

const SHLOKA_WORDS = [
  { word: "नक्षत्राधिपतिः", meaning: "The Nakshatra/Star lord of the planet" },
  { word: "मुख्यः", meaning: "Is primary" },
  { word: "बलवान्", meaning: "And holds superior strength over the planet itself in determining the result" }
];

export function KpMoneySignificatorsEvaluator() {
  const [targetHouse, setTargetHouse] = useState<2 | 11>(2);
  const [marsInTargetHouse, setMarsInTargetHouse] = useState(true);
  const [sunInMarsStar, setSunInMarsStar] = useState(true);
  const [selectedLevelInfo, setSelectedLevelInfo] = useState<string | null>("A");
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Compute levels
  const significators = useMemo(() => {
    const list: { planet: string; level: "A" | "B" | "C" | "D"; desc: string }[] = [];

    // Mars is the occupant, or else standard lord
    if (marsInTargetHouse) {
      list.push({ planet: "Mars", level: "B", desc: "Planet occupying the house directly" });
      if (sunInMarsStar) {
        list.push({ planet: "Sun", level: "A", desc: "Planet in the Nakshatra of the occupant (Mars)" });
      }
    } else {
      list.push({ planet: "Mars", level: "D", desc: "Lord of the house" });
      if (sunInMarsStar) {
        list.push({ planet: "Sun", level: "C", desc: "Planet in the Nakshatra of the house lord (Mars)" });
      }
    }

    return list.sort((a, b) => a.level.localeCompare(b.level));
  }, [marsInTargetHouse, sunInMarsStar]);

  const levelJustifications = useMemo(() => {
    return {
      A: "Level A: Planets in the Nakshatra of the occupant of the house. This is the strongest predictive stream in KP.",
      B: "Level B: The planet occupying the target house directly.",
      C: "Level C: Planets in the Nakshatra of the house lord.",
      D: "Level D: The planet owning/ruling the house itself (the Lord)."
    };
  }, []);

  const phrasingText = useMemo(() => {
    const strongest = significators[0];
    if (!strongest) return "No active significators configured.";
    return `The strongest significator of the ${targetHouse}nd house is ${strongest.planet} at Level ${strongest.level} (${strongest.desc}). Financial dashas ruled by this planet will trigger robust results.`;
  }, [significators, targetHouse]);

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
      data-interactive="kp-money-significators-evaluator"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            KP Four-Fold Significators Evaluator
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 4: Finding significators of wealth houses across Levels A, B, C, and D.
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
              Configuration Panel
            </span>

            {/* Target House */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Target House:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTargetHouse(2)}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                    targetHouse === 2 ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ borderColor: targetHouse === 2 ? "transparent" : HAIRLINE }}
                >
                  2nd House (Accumulation)
                </button>
                <button
                  onClick={() => setTargetHouse(11)}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold rounded border transition-all cursor-pointer ${
                    targetHouse === 11 ? "bg-amber-800 text-white border-amber-900" : "bg-transparent text-gray-700 hover:bg-gray-50"
                  }`}
                  style={{ borderColor: targetHouse === 11 ? "transparent" : HAIRLINE }}
                >
                  11th House (Incoming Gains)
                </button>
              </div>
            </div>

            {/* Planet Placements */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={marsInTargetHouse}
                  onChange={(e) => setMarsInTargetHouse(e.target.checked)}
                  className="accent-amber-800"
                />
                Place Mars inside the {targetHouse}nd House
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={sunInMarsStar}
                  onChange={(e) => setSunInMarsStar(e.target.checked)}
                  className="accent-amber-800"
                />
                Place Sun in Nakshatra (Star) of Mars
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Significator Ladder */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col justify-center space-y-4 min-h-[220px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1 w-full text-center mb-2">
              KP Significators Ladder (Click levels for details)
            </span>

            <div className="space-y-2">
              {["A", "B", "C", "D"].map((level) => {
                const matches = significators.filter((s) => s.level === level);
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevelInfo(level)}
                    className={`w-full flex justify-between items-center p-2 rounded border text-xs font-medium transition-all text-left cursor-pointer ${
                      selectedLevelInfo === level ? "bg-amber-50/60 border-amber-600 scale-[1.02] shadow-sm" : "bg-transparent border-gray-250/20"
                    }`}
                  >
                    <span className="font-bold text-amber-900">Level {level} {level === "A" ? "(Strongest)" : ""}</span>
                    <div>
                      {matches.length > 0 ? (
                        matches.map((m) => (
                          <span key={m.planet} className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold text-[10px] ml-1 uppercase">
                            {m.planet}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-[10px]">No planet matches</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Level Info box */}
      {selectedLevelInfo && (
        <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm space-y-1 animate-fade-in" style={{ borderColor: HAIRLINE }}>
          <span className="text-[9px] uppercase font-bold text-gray-400 block border-b pb-1">
            Signification Rule Explanation
          </span>
          <p className="text-xs text-gray-700 font-semibold">{levelJustifications[selectedLevelInfo as keyof typeof levelJustifications]}</p>
        </div>
      )}

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
