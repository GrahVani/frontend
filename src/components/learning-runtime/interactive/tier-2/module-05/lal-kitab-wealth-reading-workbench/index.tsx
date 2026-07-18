"use client";

import { useState } from "react";
import { Sparkles, Check, Copy } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";
const LABEL_TEXT = "#5f5447";
const HELPER_TEXT = "#4b5563";
const CHART_LINE = "#9b7b42";
const CHART_LINE_STRONG = "#755521";

const SHLOKA_WORDS = [
  { word: "कर्मणः", meaning: "Of actions and deeds performed in past alignments" },
  { word: "फलं", meaning: "The resulting fruit or legacy wealth state" },
  { word: "निश्चितम्", meaning: "Is surely manifest in the native's lifetime" }
];

const NORTH_HOUSE_COORDS = [
  { house: 1, cx: 50, cy: 24 },
  { house: 2, cx: 27, cy: 13 },
  { house: 3, cx: 13, cy: 27 },
  { house: 4, cx: 24, cy: 50 },
  { house: 5, cx: 13, cy: 73 },
  { house: 6, cx: 27, cy: 87 },
  { house: 7, cx: 50, cy: 76 },
  { house: 8, cx: 73, cy: 87 },
  { house: 9, cx: 87, cy: 73 },
  { house: 10, cx: 76, cy: 50 },
  { house: 11, cx: 87, cy: 27 },
  { house: 12, cx: 73, cy: 13 }
];

const PRESETS = {
  trader: {
    name: "Speculative Trader Case",
    planets: [
      { name: "Mars", house: 1 },
      { name: "Mercury", house: 7 },
      { name: "Saturn", house: 11 }
    ],
    status: "Dharmee Teva Active. Mars-Mercury mutual aspect provides robust commercial courage.",
    remedy: "No immediate emergency remedy required. Stabilize with charity to labor.",
    phrasing: "The speculative trader chart exhibits a Dharmee Teva structure with active Mars-Mercury aspects, promoting self-effort commercial expansion."
  },
  afflicted: {
    name: "Afflicted Savings Case",
    planets: [
      { name: "Mercury", house: 3 },
      { name: "Venus", house: 8 }
    ],
    status: "Heavy Afflictions. Mercury in the 3rd and Venus in the 8th houses cause severe leakage.",
    remedy: "Bury honey in a clay pot under the earth; keep solid block of silver at home.",
    phrasing: "The native suffers from savings leakage due to Mercury in 3rd and Venus in 8th. Immediate traditional Upayas are required to anchor wealth."
  }
};

export function LalKitabWealthReadingWorkbench() {
  const [presetKey, setPresetKey] = useState<"trader" | "afflicted">("trader");
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const activePreset = PRESETS[presetKey];

  const allAudited = check1 && check2 && check3;

  const copyPhrasing = () => {
    if (!allAudited) return;
    navigator.clipboard.writeText(activePreset.phrasing);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePresetChange = (key: "trader" | "afflicted") => {
    setPresetKey(key);
    setCheck1(false);
    setCheck2(false);
    setCheck3(false);
  };

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans animate-fade-in"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="lal-kitab-wealth-reading-workbench"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Lal Kitab Wealth Case Workbench
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 5: Integrated worked case studies and custom remedy generators.
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
          Sanskrit Maxim (Click words for breakdown)
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
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block border-b pb-1" style={{ color: LABEL_TEXT }}>
              Select worked case preset
            </span>

            {/* Select Preset */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>Worked Cases:</label>
              <select
                value={presetKey}
                onChange={(e) => handlePresetChange(e.target.value as "trader" | "afflicted")}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="trader">Speculative Trader Case (Dharmee Teva)</option>
                <option value="afflicted">Afflicted Savings Case (Upaya Needed)</option>
              </select>
            </div>

            {/* Audit Checklist */}
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: HAIRLINE }}>
              <label className="block text-[10px] uppercase font-bold mb-1.5" style={{ color: LABEL_TEXT }}>Chart Audit Checklist:</label>
              
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={check1}
                  onChange={(e) => setCheck1(e.target.checked)}
                  className="accent-amber-800"
                />
                Dharmee/Paapi Status audited
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={check2}
                  onChange={(e) => setCheck2(e.target.checked)}
                  className="accent-amber-800"
                />
                Aspect collision channels checked
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={check3}
                  onChange={(e) => setCheck3(e.target.checked)}
                  className="accent-amber-800"
                />
                Required Upaya remedies mapped
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Chart Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between min-h-[250px]" style={{ borderColor: HAIRLINE }}>
            <div className="flex-1 w-full space-y-2.5 text-xs text-gray-700 leading-relaxed">
              <p><strong>Teva Status:</strong> {activePreset.status}</p>
              <p><strong>Prescribed Upaya:</strong> {activePreset.remedy}</p>
            </div>

            <div className="w-36 h-36 bg-[#fbf9f4] border p-1 rounded-lg relative shrink-0" style={{ borderColor: CHART_LINE_STRONG }}>
              <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={CHART_LINE_STRONG} strokeWidth="1.2" />
                <line x1="2" y1="2" x2="98" y2="98" stroke={CHART_LINE} strokeWidth="1" />
                <line x1="98" y1="2" x2="2" y2="98" stroke={CHART_LINE} strokeWidth="1" />
                <line x1="50" y1="2" x2="2" y2="50" stroke={CHART_LINE} strokeWidth="1.1" />
                <line x1="2" y1="50" x2="50" y2="98" stroke={CHART_LINE} strokeWidth="1.1" />
                <line x1="50" y1="98" x2="98" y2="50" stroke={CHART_LINE} strokeWidth="1.1" />
                <line x1="98" y1="50" x2="50" y2="2" stroke={CHART_LINE} strokeWidth="1.1" />

                {NORTH_HOUSE_COORDS.map((cell) => {
                  const matches = activePreset.planets.filter((p) => p.house === cell.house);
                  return (
                    <g key={cell.house}>
                      <text x={cell.cx} y={cell.cy + 1} textAnchor="middle" fontSize="5" fontWeight="700" fill={INK_SECONDARY}>
                        {cell.house}
                      </text>
                      {matches.map((m, idx) => (
                        <circle 
                          key={m.name}
                          cx={cell.cx + (idx === 0 ? -3 : 3)} 
                          cy={cell.cy - 3} 
                          r="1.5" 
                          fill="#d97706" 
                        />
                      ))}
                    </g>
                  );
                })}
              </svg>
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
              {allAudited ? "Audit complete. Interpretation copy unlocked." : "Complete the chart audit checklist to unlock copy capabilities."}
            </span>
          </div>
          <button
            onClick={copyPhrasing}
            disabled={!allAudited}
            className={`px-2 py-1 text-[10px] font-bold rounded border transition-all flex items-center gap-1 bg-transparent cursor-pointer ${
              allAudited ? "hover:bg-amber-50 text-amber-955" : "opacity-50 cursor-not-allowed"
            }`}
            style={{ borderColor: HAIRLINE, color: allAudited ? undefined : LABEL_TEXT }}
          >
            {copied ? <Check size={11} className="text-green-700" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy Phrasing"}
          </button>
        </div>
        <blockquote className={`text-xs italic border-l-2 pl-3 py-1 bg-amber-50/10 transition-opacity duration-300 ${
          allAudited ? "opacity-100" : "opacity-30 select-none"
        }`} style={{ borderColor: GOLD, color: allAudited ? HELPER_TEXT : LABEL_TEXT }}>
          &ldquo;{activePreset.phrasing}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}
