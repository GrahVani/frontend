"use client";

import { useState, useMemo } from "react";
import { Info, Sparkles, Check, Copy, AlertCircle, Sun, Moon } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";

const SHLOKA_WORDS = [
  { word: "विषमे", meaning: "In odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius)" },
  { word: "प्रथमा होरा", meaning: "The first Hora (0° - 15°)" },
  { word: "सूर्यस्य", meaning: "Belongs to the Sun (Leo)" },
  { word: "द्वितीया", meaning: "And the second Hora (15° - 30°)" },
  { word: "चन्द्रस्य", meaning: "Belongs to the Moon (Cancer)" },
  { word: "समे", meaning: "In even signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces)" },
  { word: "व्यत्ययः", meaning: "It is reversed (first Moon, then Sun)" }
];

const SIGNS = [
  { num: 1, name: "Aries (Mesha)", type: "odd" as const },
  { num: 2, name: "Taurus (Vrishabha)", type: "even" as const },
  { num: 3, name: "Gemini (Mithuna)", type: "odd" as const },
  { num: 4, name: "Cancer (Karka)", type: "even" as const },
  { num: 5, name: "Leo (Simha)", type: "odd" as const },
  { num: 6, name: "Virgo (Kanya)", type: "even" as const },
  { num: 7, name: "Libra (Tula)", type: "odd" as const },
  { num: 8, name: "Scorpio (Vrishchika)", type: "even" as const },
  { num: 9, name: "Sagittarius (Dhanu)", type: "odd" as const },
  { num: 10, name: "Capricorn (Makara)", type: "even" as const },
  { num: 11, name: "Aquarius (Kumbha)", type: "odd" as const },
  { num: 12, name: "Pisces (Meena)", type: "even" as const }
];

export function D2SolarLunarBisection() {
  const [selectedSignIdx, setSelectedSignIdx] = useState<number>(0);
  const [degree, setDegree] = useState<number>(10);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const activeSign = SIGNS[selectedSignIdx];
  const signType = activeSign.type;

  // Compute resulting Hora
  const { activeHora, logicExplanation, phrasingText } = useMemo(() => {
    let hora: "sun" | "moon" = "sun";
    let logic = "";
    let phrase = "";

    if (signType === "odd") {
      if (degree <= 15) {
        hora = "sun";
        logic = `In ${activeSign.name} (an Odd Sign), the first 15° belong to Leo (Sun).`;
        phrase = `The placement at ${degree.toFixed(2)}° in ${activeSign.name} maps to the Solar Hora (Leo). This indicates self-made, active wealth patterns and enterprise.`;
      } else {
        hora = "moon";
        logic = `In ${activeSign.name} (an Odd Sign), the second 15° belong to Cancer (Moon).`;
        phrase = `The placement at ${degree.toFixed(2)}° in ${activeSign.name} maps to the Lunar Hora (Cancer). This indicates legacy protection and stable, passive wealth resources.`;
      }
    } else {
      if (degree <= 15) {
        hora = "moon";
        logic = `In ${activeSign.name} (an Even Sign), the first 15° belong to Cancer (Moon).`;
        phrase = `The placement at ${degree.toFixed(2)}° in ${activeSign.name} maps to the Lunar Hora (Cancer), favoring stable assets and family inheritance.`;
      } else {
        hora = "sun";
        logic = `In ${activeSign.name} (an Even Sign), the second 15° belong to Leo (Sun).`;
        phrase = `The placement at ${degree.toFixed(2)}° in ${activeSign.name} maps to the Solar Hora (Leo), indicating that resource accumulation requires active initiative.`;
      }
    }

    return { activeHora: hora, logicExplanation: logic, phrasingText: phrase };
  }, [selectedSignIdx, degree]);

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
      data-interactive="d2-solar-lunar-bisection"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            D2 Hora Construction (Solar-Lunar Bisection)
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 2: Understanding sign partitioning and Hora mapping boundaries.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE WORKBENCH
        </div>
      </div>

      {/* Sanskrit shloka with breakdowns */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" style={{ borderColor: HAIRLINE }}>
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
          Classical D2 Rule (Click words for breakdown)
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

      {/* Main interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
        {/* Left column: controllers */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
              Select Rashi Sign
            </span>

            {/* Sign selection grid */}
            <div className="grid grid-cols-4 gap-2">
              {SIGNS.map((s, idx) => (
                <button
                  key={s.num}
                  onClick={() => setSelectedSignIdx(idx)}
                  className={`p-2 text-center rounded border text-[10px] font-bold transition-all cursor-pointer ${
                    selectedSignIdx === idx 
                      ? "bg-amber-800 text-white border-amber-900 scale-105" 
                      : "bg-white text-gray-750 hover:bg-amber-50/30"
                  }`}
                  style={{ borderColor: selectedSignIdx === idx ? "transparent" : HAIRLINE }}
                >
                  <span className="block truncate">{s.name.split(" ")[0]}</span>
                  <span className="text-[8px] opacity-60 font-semibold uppercase">{s.type}</span>
                </button>
              ))}
            </div>

            {/* Degrees slider */}
            <div>
              <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-1">
                <span>Sign Degree Position:</span>
                <span className="text-amber-900">{degree.toFixed(2)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="0.1"
                value={degree}
                onChange={(e) => setDegree(parseFloat(e.target.value))}
                className="w-full accent-amber-850 cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-gray-400 mt-1 font-semibold">
                <span>0°</span>
                <span className="text-amber-700">15° Boundary</span>
                <span>30°</span>
              </div>
            </div>

            {/* Partition strip */}
            <div className="h-6 w-full rounded border flex overflow-hidden text-[9px] font-bold text-center" style={{ borderColor: HAIRLINE }}>
              {signType === "odd" ? (
                <>
                  <div className="bg-amber-100 text-amber-900 w-1/2 flex items-center justify-center">0° - 15° Solar</div>
                  <div className="bg-indigo-100 text-indigo-900 w-1/2 flex items-center justify-center">15° - 30° Lunar</div>
                </>
              ) : (
                <>
                  <div className="bg-indigo-100 text-indigo-900 w-1/2 flex items-center justify-center">0° - 15° Lunar</div>
                  <div className="bg-amber-100 text-amber-900 w-1/2 flex items-center justify-center">15° - 30° Solar</div>
                </>
              )}
            </div>

            {/* Explanation box */}
            <div className="p-3 bg-amber-50/20 border rounded text-xs leading-relaxed text-amber-950 flex gap-2" style={{ borderColor: HAIRLINE }}>
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-800" />
              <div>
                <strong>Bisection Rule:</strong> {logicExplanation}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: visualizer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[250px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-4 w-full text-center">
              Active Hora Result
            </span>

            <div className="flex gap-6 w-full justify-center">
              {/* Solar Hora card */}
              <div 
                className={`p-4 rounded-xl border w-28 text-center flex flex-col items-center transition-all duration-500 ${
                  activeHora === "sun" ? "shadow-md scale-105 border-amber-500" : "opacity-40 border-gray-150"
                }`}
                style={{
                  background: activeHora === "sun" ? "radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 100%)" : "transparent"
                }}
              >
                <Sun className={`mb-2 ${activeHora === "sun" ? "text-amber-600 animate-spin" : "text-gray-400"}`} style={{ animationDuration: "16s" }} size={28} />
                <span className="text-xs font-bold text-gray-800">Solar Hora</span>
                <span className="text-[8px] font-bold text-amber-800 block mt-1">Leo (Sun)</span>
              </div>

              {/* Lunar Hora card */}
              <div 
                className={`p-4 rounded-xl border w-28 text-center flex flex-col items-center transition-all duration-500 ${
                  activeHora === "moon" ? "shadow-md scale-105 border-indigo-500" : "opacity-40 border-gray-150"
                }`}
                style={{
                  background: activeHora === "moon" ? "radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, transparent 100%)" : "transparent"
                }}
              >
                <Moon className={`mb-2 ${activeHora === "moon" ? "text-indigo-600 animate-pulse" : "text-gray-400"}`} size={28} />
                <span className="text-xs font-bold text-gray-800">Lunar Hora</span>
                <span className="text-[8px] font-bold text-indigo-800 block mt-1">Cancer (Moon)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phrasing Register Panel */}
      <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: HAIRLINE }}>
          <div>
            <span className="text-[9px] uppercase tracking-wider block text-gray-400 font-bold">
              Calibrated Hora Interpretation
            </span>
            <span className="text-[10px] text-gray-500 font-medium italic">
              Qualitative description of the current coordinate position
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
