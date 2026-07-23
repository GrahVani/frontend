"use client";

import { useState, useMemo } from "react";
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
  { word: "लग्नेश", meaning: "The lord of the ascendant (1st lord)" },
  { word: "धनेश", meaning: "And the lord of wealth (2nd lord)" },
  { word: "सम्बन्धः", meaning: "When a mutual connection (conjunction/aspect/exchange) is established" },
  { word: "धनयोगाय", meaning: "For the formation of wealth combinations" },
  { word: "कल्पते", meaning: "Is declared functional" }
];

const NORTH_HOUSE_COORDS = [
  { house: 1, cx: 50, cy: 24, name: "1st (Tanu)" },
  { house: 2, cx: 27, cy: 13, name: "2nd (Dhana)" },
  { house: 3, cx: 13, cy: 27, name: "3rd (Sahaja)" },
  { house: 4, cx: 24, cy: 50, name: "4th (Sukha)" },
  { house: 5, cx: 13, cy: 73, name: "5th (Putra)" },
  { house: 6, cx: 27, cy: 87, name: "6th (Ripu)" },
  { house: 7, cx: 50, cy: 76, name: "7th (Yuvati)" },
  { house: 8, cx: 73, cy: 87, name: "8th (Randhra)" },
  { house: 9, cx: 87, cy: 73, name: "9th (Dharma)" },
  { house: 10, cx: 76, cy: 50, name: "10th (Karma)" },
  { house: 11, cx: 87, cy: 27, name: "11th (Labha)" },
  { house: 12, cx: 73, cy: 13, name: "12th (Vyaya)" }
];

export function DhanaYogaPatternVerifier() {
  const [lord2House, setLord2House] = useState<number>(2);
  const [lord11House, setLord11House] = useState<number>(11);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [selectedLord, setSelectedLord] = useState<"2nd" | "11th">("2nd");
  const [copied, setCopied] = useState(false);

  // Verify Dhana Yoga combinations
  const { yogaName, phrasingText } = useMemo(() => {
    let active = false;
    let name = "No Primary Dhana Yoga verified";
    let phrase = "";

    // 2nd lord in 11th, 11th lord in 2nd
    if (lord2House === 11 && lord11House === 2) {
      active = true;
      name = "Maha Dhana Yoga (Mutual Exchange)";
      phrase = "The mutual exchange of signs between the 2nd and 11th lords connects accumulated savings directly to incoming profits. Wealth potential is highly verified.";
    } else if (lord2House === 11 || lord11House === 2) {
      active = true;
      name = "Primary Dhana Yoga (Sambandha)";
      phrase = "A direct placement connection is formed between the 2nd and 11th houses. Earnings translate successfully into stable long-term savings.";
    } else if (lord2House === 9 || lord11House === 9) {
      active = true;
      name = "Bhagya Dhana Yoga (Fortune Connection)";
      phrase = "Connecting the wealth lords to the 9th house of fortune invites divine grace and ease of acquisition into the native's career trajectory.";
    } else {
      phrase = "placements are neutral. Standard wealth accrual via persistent self-effort holds without major yogic configurations.";
    }

    return { isYogaActive: active, yogaName: name, phrasingText: phrase };
  }, [lord2House, lord11House]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHouseClick = (houseNum: number) => {
    if (selectedLord === "2nd") {
      setLord2House(houseNum);
    } else {
      setLord11House(houseNum);
    }
  };

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans animate-fade-in"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="dhana-yoga-pattern-verifier"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Dhana Yoga Pattern Verifier
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 3: Verifying structural linkages between the 1st, 2nd, 5th, 9th, and 11th houses.
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
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-[10px] uppercase font-bold" style={{ color: LABEL_TEXT }}>
                Pattern Configurator
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedLord("2nd")} 
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                    selectedLord === "2nd" ? "bg-amber-800 text-white" : "bg-transparent"
                  }`}
                  style={{ borderColor: HAIRLINE, color: selectedLord === "2nd" ? undefined : HELPER_TEXT }}
                >
                  Position 2nd Lord
                </button>
                <button 
                  onClick={() => setSelectedLord("11th")} 
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                    selectedLord === "11th" ? "bg-amber-800 text-white" : "bg-transparent"
                  }`}
                  style={{ borderColor: HAIRLINE, color: selectedLord === "11th" ? undefined : HELPER_TEXT }}
                >
                  Position 11th Lord
                </button>
              </div>
            </div>

            {/* 2nd Lord Placement dropdown */}
            <div>
              <label className="block text-[9px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>
                2nd Lord House:
              </label>
              <select
                value={lord2House}
                onChange={(e) => setLord2House(parseInt(e.target.value))}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value={2}>2nd House (Own Sign)</option>
                <option value={11}>11th House (Dhana-Labha Connection)</option>
                <option value={9}>9th House (Dhana-Bhagya Connection)</option>
                <option value={12}>12th House (Dhana-Vyaya Leakage)</option>
              </select>
            </div>

            {/* 11th Lord Placement dropdown */}
            <div>
              <label className="block text-[9px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT }}>
                11th Lord House:
              </label>
              <select
                value={lord11House}
                onChange={(e) => setLord11House(parseInt(e.target.value))}
                className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                style={{ borderColor: HAIRLINE }}
              >
                <option value={11}>11th House (Own Sign)</option>
                <option value={2}>2nd House (Labha-Dhana Connection)</option>
                <option value={9}>9th House (Labha-Bhagya Connection)</option>
                <option value={8}>8th House (Labha-Randhra Obstruction)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chart Visualizer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[250px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block mb-3 w-full text-center" style={{ color: LABEL_TEXT }}>
              Vedic Chart (Click houses to place active Lord)
            </span>

            <div className="w-48 h-48 bg-[#fbf9f4] border p-1 rounded-lg relative" style={{ borderColor: CHART_LINE_STRONG }}>
              <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={CHART_LINE_STRONG} strokeWidth="1.2" />
                <line x1="2" y1="2" x2="98" y2="98" stroke={CHART_LINE} strokeWidth="1" />
                <line x1="98" y1="2" x2="2" y2="98" stroke={CHART_LINE} strokeWidth="1" />
                <line x1="50" y1="2" x2="2" y2="50" stroke={CHART_LINE} strokeWidth="1.1" />
                <line x1="2" y1="50" x2="50" y2="98" stroke={CHART_LINE} strokeWidth="1.1" />
                <line x1="50" y1="98" x2="98" y2="50" stroke={CHART_LINE} strokeWidth="1.1" />
                <line x1="98" y1="50" x2="50" y2="2" stroke={CHART_LINE} strokeWidth="1.1" />

                {/* Hotspot polygons */}
                <polygon points="2,2 50,2 26,26" fill="transparent" className="cursor-pointer hover:fill-amber-100/10" onClick={() => handleHouseClick(2)} />
                <polygon points="98,2 50,2 74,26" fill="transparent" className="cursor-pointer hover:fill-amber-100/10" onClick={() => handleHouseClick(11)} />
                <polygon points="98,98 50,98 74,74" fill="transparent" className="cursor-pointer hover:fill-blue-100/10" onClick={() => handleHouseClick(9)} />

                {NORTH_HOUSE_COORDS.map((cell) => {
                  const hasLord2 = lord2House === cell.house;
                  const hasLord11 = lord11House === cell.house;
                  return (
                    <g key={cell.house} className="pointer-events-none">
                      <text x={cell.cx} y={cell.cy + 1} textAnchor="middle" fontSize="5" fontWeight="700" fill={INK_SECONDARY}>
                        {cell.house}
                      </text>
                      {hasLord2 && (
                        <circle cx={cell.cx - 3} cy={cell.cy - 3} r="1.5" fill="#b45309" />
                      )}
                      {hasLord11 && (
                        <circle cx={cell.cx + 3} cy={cell.cy - 3} r="1.5" fill="#047857" />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="text-center mt-3">
              <span className="text-[10px] uppercase font-bold" style={{ color: LABEL_TEXT }}>Yoga Status:</span>
              <span className="text-xs font-bold text-amber-900 block mt-0.5">{yogaName}</span>
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
