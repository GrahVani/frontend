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
  { word: "प्रश्नकुण्डल्यां", meaning: "In the Horary chart (Prashna Kundali)" },
  { word: "रहस्यम्", meaning: "The hidden secret or final verdict of the query" },
  { word: "निश्चितम्", meaning: "Is declared with certainty through the cuspal sub-lord" }
];

export function KpWealthQuestionWorkbench() {
  const [queryKey, setQueryKey] = useState<"lost_money" | "debts">("lost_money");
  const [horaryNumber, setHoraryNumber] = useState<number>(100);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Compute horary sub-lord
  const { subLord, starLord, verdict, phrasingText } = useMemo(() => {
    let lord = "Jupiter";
    let star = "Saturn";
    let isYes = true;
    let phrase = "";

    if (horaryNumber < 80) {
      lord = "Sun";
      star = "Venus";
    } else if (horaryNumber < 160) {
      lord = "Mercury";
      star = "Mars";
    } else {
      lord = "Saturn";
      star = "Rahu";
    }

    if (queryKey === "lost_money") {
      isYes = horaryNumber >= 50 && horaryNumber <= 200;
      phrase = isYes
        ? `Horary No. ${horaryNumber} maps to ${lord} as 2nd CSL. Since ${lord} signifies houses 2 & 11, the recovery of lost money is verified (YES).`
        : `Horary No. ${horaryNumber} maps to ${lord} as 2nd CSL. Since ${lord} signifies detrimental houses (5/8/12), the recovery of lost money is obstructed (NO).`;
    } else {
      isYes = horaryNumber < 100 || horaryNumber > 220;
      phrase = isYes
        ? `Horary No. ${horaryNumber} maps to ${lord} as 6th CSL. Signifying houses 6 and 11, debt clearance will successfully occur (YES).`
        : `Horary No. ${horaryNumber} maps to ${lord} as 6th CSL. Signifying house 12 and 8, debt clearance is delayed or subject to refinance issues (NO).`;
    }

    return { 
      subLord: lord, 
      starLord: star, 
      verdict: isYes ? "YES - Manifestation Confirmed" : "NO - Obstruction/Delay", 
      phrasingText: phrase 
    };
  }, [queryKey, horaryNumber]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Rotate angle based on horary number (out of 249)
  const pointerAngle = useMemo(() => {
    return (horaryNumber / 249) * 360;
  }, [horaryNumber]);

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans animate-fade-in"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="kp-wealth-question-workbench"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            KP Horary Wealth Workbench
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 4: Simulating client queries using the $1-249$ horary sub-division system.
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
              Horary Query Cockpit
            </span>

            {/* Query select */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>Query Type:</label>
              <select
                value={queryKey}
                onChange={(e) => setQueryKey(e.target.value as "lost_money" | "debts")}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="lost_money">Will I recover my lost money?</option>
                <option value="debts">Will I clear my heavy debts?</option>
              </select>
            </div>

            {/* Horary number input */}
            <div>
              <div className="flex justify-between text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>
                <span>Select Horary No. (1 - 249):</span>
                <span className="text-amber-900 font-extrabold">{horaryNumber}</span>
              </div>
              <input
                type="range"
                min="1"
                max="249"
                step="1"
                value={horaryNumber}
                onChange={(e) => setHoraryNumber(parseInt(e.target.value))}
                className="w-full accent-amber-850 cursor-pointer"
              />
              <div className="flex justify-between text-[8px] mt-1 font-semibold" style={{ color: LABEL_TEXT }}>
                <span>1</span>
                <span className="text-amber-700">125 Middle</span>
                <span>249</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Verdict and 249 Slice Wheel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col md:flex-row gap-4 items-center justify-center min-h-[220px]" style={{ borderColor: HAIRLINE }}>
            <div className="flex-1 w-full space-y-2.5 text-center">
              <span className="text-[10px] uppercase font-bold block border-b pb-1" style={{ color: LABEL_TEXT }}>
                CSL Verdict
              </span>
              <div className="text-[11px] font-semibold uppercase" style={{ color: HELPER_TEXT }}>
                Sub-Lord: <span className="text-amber-900 font-bold">{subLord}</span> | Star: <span className="text-amber-900 font-bold">{starLord}</span>
              </div>
              <div className={`p-3 rounded border text-sm font-extrabold transition-all duration-300 ${
                verdict.startsWith("YES") 
                  ? "bg-green-50 text-green-950 border-green-200" 
                  : "bg-red-50 text-red-950 border-red-200"
              }`}>
                {verdict}
              </div>
            </div>

            {/* 249 subdivisions Slice Wheel */}
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle cx="64" cy="64" r="30" fill="transparent" stroke="#f3f4f6" strokeWidth="8" />
                {/* Colored sector slices */}
                <circle cx="64" cy="64" r="30" fill="transparent" stroke="#fef08a" strokeWidth="8" strokeDasharray={2 * Math.PI * 30} strokeDashoffset={(2 * Math.PI * 30) * 0.7} />
                <circle cx="64" cy="64" r="30" fill="transparent" stroke="#a7f3d0" strokeWidth="8" strokeDasharray={2 * Math.PI * 30} strokeDashoffset={(2 * Math.PI * 30) * 0.4} />
              </svg>
              {/* Dial needle pointing to horary position */}
              <div 
                className="absolute w-1 bg-amber-800 origin-bottom transition-all duration-300"
                style={{ 
                  height: "26px", 
                  bottom: "50%", 
                  transform: `rotate(${pointerAngle}deg)` 
                }}
              />
              <div className="absolute w-2 h-2 rounded-full bg-amber-900" />
            </div>
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
