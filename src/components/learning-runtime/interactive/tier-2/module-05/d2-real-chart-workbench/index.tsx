"use client";

import { useState, useMemo } from "react";
import { Info, Sparkles, Check, Copy, AlertTriangle } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";

const SHLOKA_WORDS = [
  { word: "सूक्ष्मविचारे", meaning: "In detailed divisional/varga readings" },
  { word: "कालः", meaning: "Time (birth time accuracy)" },
  { word: "मुख्यः", meaning: "Is supreme/essential" }
];

const PRESETS = {
  entrepreneur: {
    name: "Self-made Entrepreneur Case",
    planets: [
      { name: "Sun", deg: 12.5, sign: "odd", D2: "Solar" },
      { name: "Moon", deg: 23.4, sign: "even", D2: "Solar" },
      { name: "Mars", deg: 4.2, sign: "odd", D2: "Solar" },
      { name: "Jupiter", deg: 18.9, sign: "even", D2: "Solar" }
    ],
    phrasing: "The D2 chart exhibits high solar activity. Wealth is derived entirely via independent business, active competition, and dynamic self-effort."
  },
  heir: {
    name: "Legacy Heir Case",
    planets: [
      { name: "Moon", deg: 8.9, sign: "even", D2: "Lunar" },
      { name: "Venus", deg: 11.2, sign: "even", D2: "Lunar" },
      { name: "Jupiter", deg: 14.1, sign: "even", D2: "Lunar" },
      { name: "Saturn", deg: 22.5, sign: "odd", D2: "Lunar" }
    ],
    phrasing: "The D2 chart shows an accumulation of planets in the Lunar Hora (Cancer), indicating inherited holdings and asset security."
  }
};

export function D2RealChartWorkbench() {
  const [presetKey, setPresetKey] = useState<"entrepreneur" | "heir">("entrepreneur");
  const [btrShift, setBtrShift] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const activePreset = PRESETS[presetKey];

  const phrasingText = useMemo(() => {
    if (btrShift) {
      return `${activePreset.phrasing} BTR Alert: An early birth shift alters planetary positions and requires verification of legacy assets.`;
    }
    return activePreset.phrasing;
  }, [presetKey, btrShift]);

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
      data-interactive="d2-real-chart-workbench"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            D2 Real Chart Workbench
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 2: Multi-varga analysis, preset worked cases, and BTR threshold checks.
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
          Sanskrit Classical Maxim (Click words for breakdown)
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
        {/* Left Column: Preset selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
              Select Chart Case Preset
            </span>

            {/* Presets */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Worked Cases:</label>
              <select
                value={presetKey}
                onChange={(e) => setPresetKey(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="entrepreneur">Self-made Entrepreneur (Solar Dominant)</option>
                <option value="heir">Legacy Wealth Heir (Lunar Dominant)</option>
              </select>
            </div>

            {/* BTR shift */}
            <div className="pt-2 flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={btrShift}
                  onChange={(e) => setBtrShift(e.target.checked)}
                  className="accent-amber-800"
                />
                Simulate Birth Time Rectification (BTR) Shift
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Visual D2 Division Display */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm min-h-[250px] flex flex-col md:flex-row gap-4 justify-between items-center" style={{ borderColor: HAIRLINE }}>
            <div className="flex-1 w-full space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1 w-full text-center mb-2">
                Planetary Division Mapping
              </span>

              {activePreset.planets.map((p, idx) => {
                const isShifted = btrShift && (p.name === "Jupiter" || p.name === "Venus");
                const finalD2 = isShifted ? (p.D2 === "Solar" ? "Lunar" : "Solar") : p.D2;

                return (
                  <div key={idx} className="flex justify-between items-center p-2 rounded border bg-amber-50/5 text-xs font-medium" style={{ borderColor: HAIRLINE }}>
                    <span>{p.name} ({p.deg}° in {p.sign === "odd" ? "Odd" : "Even"} Sign)</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold transition-all duration-300 ${
                      finalD2 === "Solar" ? "bg-amber-100 text-amber-900 animate-pulse" : "bg-indigo-100 text-indigo-900 animate-pulse"
                    }`}>
                      {finalD2}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* D2 Visual Chart (North Indian style bisection) */}
            <div className="w-36 h-36 bg-[#fbf9f4] border p-1 rounded-lg relative shrink-0" style={{ borderColor: HAIRLINE }}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={HAIRLINE} strokeWidth="0.8" />
                <line x1="2" y1="2" x2="98" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                <line x1="98" y1="2" x2="2" y2="98" stroke={HAIRLINE} strokeWidth="0.6" />
                <line x1="50" y1="2" x2="2" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                <line x1="2" y1="50" x2="50" y2="98" stroke={HAIRLINE} strokeWidth="0.8" />
                <line x1="50" y1="98" x2="98" y2="50" stroke={HAIRLINE} strokeWidth="0.8" />
                <line x1="98" y1="50" x2="50" y2="2" stroke={HAIRLINE} strokeWidth="0.8" />

                {/* Leo Solar sector (House 5 at top-left quadrant) */}
                <text x="25" y="25" textAnchor="middle" fontSize="6" fill="#b45309" fontWeight="bold">Leo</text>
                <text x="25" y="32" textAnchor="middle" fontSize="4.5" fill="#78350f">Solar</text>

                {/* Cancer Lunar sector (House 4 at bottom-right quadrant) */}
                <text x="75" y="75" textAnchor="middle" fontSize="6" fill="#1e3a8a" fontWeight="bold">Cancer</text>
                <text x="75" y="82" textAnchor="middle" fontSize="4.5" fill="#172554">Lunar</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* BTR Boundary Warning Box */}
      {btrShift && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-950 shadow-sm leading-relaxed space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-red-800">
            <AlertTriangle size={16} /> BTR Divisonal Boundary Warning
          </div>
          <p className="text-[11px] text-gray-600">
            <strong>Rectification Alert:</strong> A minor 3-minute birth shift alters the degrees of close-cusp planets, shifting them from the Solar Hora to the Lunar Hora or vice versa. Verify your client's birth details before submitting divisional readings.
          </p>
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
