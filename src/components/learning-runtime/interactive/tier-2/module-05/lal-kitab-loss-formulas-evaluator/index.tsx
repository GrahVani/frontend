"use client";

import { useState, useMemo } from "react";
import { Info, Sparkles, Check, Copy, AlertTriangle } from "lucide-react";
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
  { word: "उपायेन", meaning: "Through the application of traditional Lal Kitab remedies (Upayas)" },
  { word: "कष्टनिवारणम्", meaning: "Alleviation and neutralization of negative planetary afflictions" },
  { word: "निश्चितम्", meaning: "Is surely achieved" }
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

export function LalKitabLossFormulasEvaluator() {
  const [affliction, setAffliction] = useState<"merc3" | "ven8" | "sunsat">("merc3");
  const [selectedRemedy, setSelectedRemedy] = useState<string>("none");
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Define remedy options
  const remedyOptions = useMemo(() => {
    return [
      { id: "honey", text: "Bury honey in a clay pot under the earth" },
      { id: "copper", text: "Donate copper blocks to a temple / flowing water" },
      { id: "silver", text: "Keep a solid block of silver at home" }
    ];
  }, []);

  const correctRemedyId = useMemo(() => {
    if (affliction === "merc3") return "honey";
    if (affliction === "ven8") return "silver";
    return "copper";
  }, [affliction]);

  const remedyApplied = selectedRemedy === correctRemedyId;

  // Compute active house and details
  const { houseNum, text, remedyText, phrasingText } = useMemo(() => {
    let num = 3;
    let t = "";
    let rem = "";
    let phrase = "";

    if (affliction === "merc3") {
      num = 3;
      t = "Mercury in the 3rd House: Causes loss of wealth through unstable partnerships, speculative trading, or wrong agreements.";
      rem = "Upaya Remedy: Bury honey in a clay pot under the earth to stabilize Mercury's commercial intelligence.";
      phrase = remedyApplied
        ? "Mercury in the 3rd house affliction is neutralized through the earth-honey bury remedy. Savings and contracts stabilize."
        : "Mercury in the 3rd house causes heavy leakage of funds. Native struggles to retain liquid wealth.";
    } else if (affliction === "ven8") {
      num = 8;
      t = "Venus in the 8th House: Financial debt vulnerabilities, losses through spouse or sudden assets decay.";
      rem = "Upaya Remedy: Keep a solid block of silver at home to stabilize Venus's luxury energy.";
      phrase = remedyApplied
        ? "Venus in the 8th house affliction is mitigated via solid silver grounding, restoring wealth luck."
        : "Venus in the 8th house presents high risk of sudden bankruptcies or litigation costs.";
    } else {
      num = 1;
      t = "Sun-Saturn Conjunction in the 1st House: Creates extreme conflict between status goals and resource preservation.";
      rem = "Upaya Remedy: Donate copper blocks to flowing water to establish Sun's authority over Saturn.";
      phrase = remedyApplied
        ? "Sun-Saturn conflict in the 1st house is pacified by the copper block remedy."
        : "Sun-Saturn conjunction generates internal friction, hindering long-term asset accumulation.";
    }

    return { houseNum: num, text: t, remedyText: rem, phrasingText: phrase };
  }, [affliction, remedyApplied]);

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
      data-interactive="lal-kitab-loss-formulas-evaluator"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Lal Kitab Loss & Remedy Evaluator
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 5: Identifying wealth afflictions and calibrating specific traditional Upayas.
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
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block border-b pb-1" style={{ color: LABEL_TEXT }}>
              Affliction Selector
            </span>

            {/* Affliction selection */}
            <div>
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>Select Affliction:</label>
              <select
                value={affliction}
                onChange={(e) => {
                  setAffliction(e.target.value as "merc3" | "ven8" | "sunsat");
                  setSelectedRemedy("none");
                }}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value="merc3">Mercury in the 3rd House</option>
                <option value="ven8">Venus in the 8th House</option>
                <option value="sunsat">Sun-Saturn Conjunction (1st House)</option>
              </select>
            </div>

            {/* Remedy multiple-choice selector */}
            <div className="space-y-2 pt-2">
              <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>Calibrate Correct Upaya:</label>
              <div className="space-y-1.5">
                {remedyOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedRemedy(opt.id)}
                    className={`w-full p-2.5 rounded border text-left text-xs font-semibold cursor-pointer transition-all ${
                      selectedRemedy === opt.id
                        ? opt.id === correctRemedyId
                          ? "bg-green-100 border-green-500 text-green-950 scale-105"
                          : "bg-red-100 border-red-500 text-red-950 scale-105"
                        : "bg-transparent border-gray-200"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chart highlighting and explanation */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[250px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block mb-3 w-full text-center" style={{ color: LABEL_TEXT }}>
              Chart Highlight (Afflicted: House {houseNum})
            </span>

            <div className="w-36 h-36 bg-[#fbf9f4] border p-1 rounded-lg relative" style={{ borderColor: CHART_LINE_STRONG }}>
              <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={CHART_LINE_STRONG} strokeWidth="1.2" />
                <line x1="2" y1="2" x2="98" y2="98" stroke={CHART_LINE} strokeWidth="1" />
                <line x1="98" y1="2" x2="2" y2="98" stroke={CHART_LINE} strokeWidth="1" />
                <line x1="50" y1="2" x2="2" y2="50" stroke={CHART_LINE} strokeWidth="1.1" />
                <line x1="2" y1="50" x2="50" y2="98" stroke={CHART_LINE} strokeWidth="1.1" />
                <line x1="50" y1="98" x2="98" y2="50" stroke={CHART_LINE} strokeWidth="1.1" />
                <line x1="98" y1="50" x2="50" y2="2" stroke={CHART_LINE} strokeWidth="1.1" />

                {NORTH_HOUSE_COORDS.map((cell) => {
                  const isAfflicted = cell.house === houseNum;
                  return (
                    <g key={cell.house}>
                      <text x={cell.cx} y={cell.cy + 1} textAnchor="middle" fontSize="5" fontWeight="700" fill={INK_SECONDARY}>
                        {cell.house}
                      </text>
                      {isAfflicted && (
                        <circle 
                          cx={cell.cx} 
                          cy={cell.cy - 3} 
                          r="2.5" 
                          fill={remedyApplied ? "#15803d" : "#dc2626"} 
                          className="animate-pulse" 
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory cards */}
      <div className="mb-6 space-y-4">
        <div className="p-4 rounded-xl border bg-white shadow-sm space-y-2 leading-relaxed" style={{ borderColor: HAIRLINE }}>
          <span className="text-[9px] uppercase font-bold block border-b pb-1" style={{ color: LABEL_TEXT }}>
            Affliction Description
          </span>
          <p className="text-xs text-gray-700 font-semibold">{text}</p>
        </div>

        {remedyApplied ? (
          <div className="p-4 rounded-xl border border-green-200 bg-green-50 text-green-950 shadow-sm leading-relaxed space-y-2 animate-fade-in">
            <span className="text-[9px] uppercase font-bold text-green-800 block border-b pb-1 border-green-200">
              Active Remedy Output
            </span>
            <p className="text-xs font-semibold">{remedyText}</p>
          </div>
        ) : selectedRemedy !== "none" ? (
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-950 shadow-sm leading-relaxed space-y-2 flex items-start gap-2 animate-fade-in">
            <AlertTriangle size={18} className="text-red-755 shrink-0 mt-0.5" />
            <div>
              <span className="text-[9px] uppercase font-bold text-red-800 block border-b pb-1 border-red-200 mb-1">
                Remedy Mismatch Status
              </span>
              <p className="text-xs font-semibold">This remedy selection is incorrect. Choose the correct traditional scriptural remedy to resolve savings leakages.</p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-950 shadow-sm leading-relaxed space-y-2 flex items-start gap-2">
            <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-[9px] uppercase font-bold text-amber-800 block border-b pb-1 border-amber-200 mb-1">
                Remedy Choice Pending
              </span>
              <p className="text-xs font-semibold">Select the correct traditional remedy from the checklist on the left.</p>
            </div>
          </div>
        )}
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
