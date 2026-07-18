"use client";

import { useState, useMemo } from "react";
import { ShieldAlert, Sparkles, Check, Copy } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";
const CHART_LINE = "#B89A58";
const CHART_LINE_STRONG = "#8A641D";
const LABEL_TEXT = "#5B6472";
const LABEL_TEXT_STRONG = "#374151";

type JupiterPlacement = "2nd" | "11th" | "9th" | "12th";
type VenusPlacement = "2nd" | "11th" | "12th" | "7th";
type Dignity = "exalted" | "own" | "debilitated" | "neutral";

const SHLOKA_WORDS = [
  { word: "कारको", meaning: "The natural significator (kāraka)" },
  { word: "भावनशाय", meaning: "Causes the decay or saturation of the house (bhāva-nāśāya)" },
  { word: "जीवो", meaning: "Jupiter (Guru), when placed in its own karaka bhava" },
  { word: "द्वितीयसंस्थितः", meaning: "Situated in the second house of resources" }
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

export function NaturalWealthKarakaAnalyzer() {
  const [jupPlacement, setJupPlacement] = useState<JupiterPlacement>("2nd");
  const [jupDignity, setJupDignity] = useState<Dignity>("neutral");
  const [venPlacement, setVenPlacement] = useState<VenusPlacement>("11th");
  const [venDignity, setVenDignity] = useState<Dignity>("neutral");
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [activeKarakaFocus, setActiveKarakaFocus] = useState<"jupiter" | "venus">("jupiter");
  const [copied, setCopied] = useState(false);

  // Compute strengths of Jupiter and Venus
  const { jupScore, venScore, hasKarakoBhavaNashaya, phrasingText } = useMemo(() => {
    let jScore = 50;
    let vScore = 50;
    let phrase = "";

    // Jupiter Dignity
    if (jupDignity === "exalted") jScore += 30;
    else if (jupDignity === "own") jScore += 15;
    else if (jupDignity === "debilitated") jScore -= 20;

    // Jupiter placement adjustments
    if (jupPlacement === "11th" || jupPlacement === "9th") jScore += 10;
    else if (jupPlacement === "12th") jScore -= 15;

    // Venus Dignity
    if (venDignity === "exalted") vScore += 30;
    else if (venDignity === "own") vScore += 15;
    else if (venDignity === "debilitated") vScore -= 20;

    // Venus placement adjustments
    if (venPlacement === "11th" || venPlacement === "2nd") vScore += 10;
    else if (venPlacement === "12th") vScore -= 15;

    // Check Karako Bhava Nashaya (Jupiter in 2nd house)
    const nashaya = jupPlacement === "2nd";

    if (nashaya) {
      phrase = "While Jupiter (Guru) represents natural expansion, its placement in the 2nd signifying house triggers the Karako Bhāva Nāśāya rule. Wealth development is present, but requires conscious vigilance against complacency or excess. Secondary wealth indicators (Venus and the 2nd lord) must be analyzed for stability.";
    } else {
      phrase = `Jupiter is strong and well-placed, indicating wisdom-led wealth growth. Venus at ${venPlacement} adds luxury and secondary comfort. Asset preservation remains secure.`;
    }

    return { 
      jupScore: Math.max(0, Math.min(100, jScore)), 
      venScore: Math.max(0, Math.min(100, vScore)), 
      hasKarakoBhavaNashaya: nashaya,
      phrasingText: phrase 
    };
  }, [jupPlacement, jupDignity, venPlacement, venDignity]);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHouseClick = (houseNum: number) => {
    if (activeKarakaFocus === "jupiter") {
      if (houseNum === 2) setJupPlacement("2nd");
      else if (houseNum === 11) setJupPlacement("11th");
      else if (houseNum === 9) setJupPlacement("9th");
      else if (houseNum === 12) setJupPlacement("12th");
    } else {
      if (houseNum === 2) setVenPlacement("2nd");
      else if (houseNum === 11) setVenPlacement("11th");
      else if (houseNum === 12) setVenPlacement("12th");
      else if (houseNum === 7) setVenPlacement("7th");
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
      data-interactive="natural-wealth-karaka-analyzer"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Natural Wealth Kāraka Analyzer
          </h2>
          <p className="text-xs italic" style={{ color: LABEL_TEXT_STRONG }}>
            Module 5, Chapter 1: Comparing Guru and Śukra significations and evaluating Karako Bhāva Nāśāya.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE COMPONENT
        </div>
      </div>

      {/* Sanskrit Verse with Interactive Breakdown */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" style={{ borderColor: HAIRLINE }}>
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold tracking-wider" style={{ color: LABEL_TEXT }}>
          Sanskrit Classical Verse (Click words for breakdown)
        </div>
        <div className="py-3 flex flex-wrap justify-center gap-2">
          {SHLOKA_WORDS.map((w, idx) => (
            <button
              key={idx}
              onClick={() => setActiveWordIdx(activeWordIdx === idx ? null : idx)}
              className={`text-sm md:text-base font-bold transition-all px-1.5 py-0.5 rounded cursor-pointer ${
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
        {/* Left Column: Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-[10px] uppercase font-bold" style={{ color: LABEL_TEXT }}>
                Natural Kāraka Modulators
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveKarakaFocus("jupiter")} 
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                    activeKarakaFocus === "jupiter" ? "bg-amber-800 text-white" : "bg-transparent"
                  }`}
                  style={{ borderColor: HAIRLINE, color: activeKarakaFocus === "jupiter" ? undefined : LABEL_TEXT_STRONG }}
                >
                  Edit Jupiter
                </button>
                <button 
                  onClick={() => setActiveKarakaFocus("venus")} 
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                    activeKarakaFocus === "venus" ? "bg-indigo-800 text-white" : "bg-transparent"
                  }`}
                  style={{ borderColor: HAIRLINE, color: activeKarakaFocus === "venus" ? undefined : LABEL_TEXT_STRONG }}
                >
                  Edit Venus
                </button>
              </div>
            </div>

            {/* Jupiter controls */}
            {activeKarakaFocus === "jupiter" ? (
              <div className="space-y-3 animate-fade-in">
                <strong className="block text-xs text-amber-950 font-bold">Guru (Jupiter) - Core Significator</strong>
                <div>
                  <label className="block text-[9px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT_STRONG }}>Placement:</label>
                  <select
                    value={jupPlacement}
                    onChange={(e) => setJupPlacement(e.target.value as JupiterPlacement)}
                    className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                    style={{ borderColor: HAIRLINE }}
                  >
                    <option value="2nd">2nd House (Own Kāraka)</option>
                    <option value="11th">11th House (House of Gains)</option>
                    <option value="9th">9th House (House of Fortune)</option>
                    <option value="12th">12th House (House of Loss)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT_STRONG }}>Sign Dignity:</label>
                  <select
                    value={jupDignity}
                    onChange={(e) => setJupDignity(e.target.value as Dignity)}
                    className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-amber-800 cursor-pointer"
                    style={{ borderColor: HAIRLINE }}
                  >
                    <option value="neutral">Neutral Sign</option>
                    <option value="exalted">Exalted Sign</option>
                    <option value="own">Own Sign</option>
                    <option value="debilitated">Debilitated Sign</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <strong className="block text-xs text-indigo-950 font-bold">Śukra (Venus) - Secondary Significator</strong>
                <div>
                  <label className="block text-[9px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT_STRONG }}>Placement:</label>
                  <select
                    value={venPlacement}
                    onChange={(e) => setVenPlacement(e.target.value as VenusPlacement)}
                    className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-indigo-850 cursor-pointer"
                    style={{ borderColor: HAIRLINE }}
                  >
                    <option value="11th">11th House (Gains)</option>
                    <option value="2nd">2nd House (Savings)</option>
                    <option value="12th">12th House (Expenditure)</option>
                    <option value="7th">7th House (Partnerships)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold mb-1" style={{ color: LABEL_TEXT_STRONG }}>Sign Dignity:</label>
                  <select
                    value={venDignity}
                    onChange={(e) => setVenDignity(e.target.value as Dignity)}
                    className="w-full text-xs p-2 border rounded bg-transparent font-semibold focus:ring-indigo-850 cursor-pointer"
                    style={{ borderColor: HAIRLINE }}
                  >
                    <option value="neutral">Neutral Sign</option>
                    <option value="exalted">Exalted Sign</option>
                    <option value="own">Own Sign</option>
                    <option value="debilitated">Debilitated Sign</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visualizer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[280px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block mb-3 w-full text-center" style={{ color: LABEL_TEXT }}>
              Planetary Tejas (Tejas Orbs) & Chart Mapping
            </span>

            {/* Side-by-side orbs */}
            <div className="flex gap-8 justify-center items-center w-full mb-4">
              {/* Jupiter Orb */}
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-amber-900 mb-1">Jupiter (Guru)</span>
                <div 
                  className="rounded-full shadow-inner flex items-center justify-center text-amber-900 font-extrabold text-xs transition-all duration-500 ease-out animate-pulse"
                  style={{
                    width: `${40 + jupScore * 0.4}px`,
                    height: `${40 + jupScore * 0.4}px`,
                    background: `radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, rgba(217, 119, 6, 0.4) 70%, transparent 100%)`,
                    boxShadow: `0 0 ${jupScore * 0.2}px rgba(245, 158, 11, 0.6)`
                  }}
                >
                  {jupScore}%
                </div>
              </div>

              {/* Venus Orb */}
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-indigo-900 mb-1">Venus (Śukra)</span>
                <div 
                  className="rounded-full shadow-inner flex items-center justify-center text-indigo-900 font-extrabold text-xs transition-all duration-500 ease-out animate-pulse"
                  style={{
                    width: `${40 + venScore * 0.4}px`,
                    height: `${40 + venScore * 0.4}px`,
                    background: `radial-gradient(circle, rgba(129, 140, 248, 0.8) 0%, rgba(79, 70, 229, 0.4) 70%, transparent 100%)`,
                    boxShadow: `0 0 ${venScore * 0.2}px rgba(99, 102, 241, 0.6)`
                  }}
                >
                  {venScore}%
                </div>
              </div>
            </div>

            {/* Interactive chart visualizer */}
            <div className="w-56 h-56 bg-[#fbf9f4] border p-1 rounded-lg" style={{ borderColor: CHART_LINE }}>
              <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                <rect x="2" y="2" width="96" height="96" fill="transparent" stroke={CHART_LINE_STRONG} strokeWidth="1" />
                <line x1="2" y1="2" x2="98" y2="98" stroke={CHART_LINE} strokeWidth="0.85" />
                <line x1="98" y1="2" x2="2" y2="98" stroke={CHART_LINE} strokeWidth="0.85" />
                <line x1="50" y1="2" x2="2" y2="50" stroke={CHART_LINE} strokeWidth="0.9" />
                <line x1="2" y1="50" x2="50" y2="98" stroke={CHART_LINE} strokeWidth="0.9" />
                <line x1="50" y1="98" x2="98" y2="50" stroke={CHART_LINE} strokeWidth="0.9" />
                <line x1="98" y1="50" x2="50" y2="2" stroke={CHART_LINE} strokeWidth="0.9" />

                {/* Hotspots */}
                <polygon points="2,2 50,2 26,26" fill="transparent" className="cursor-pointer hover:fill-amber-100/10" onClick={() => handleHouseClick(2)} />
                <polygon points="98,2 50,2 74,26" fill="transparent" className="cursor-pointer hover:fill-amber-100/10" onClick={() => handleHouseClick(11)} />

                {NORTH_HOUSE_COORDS.map((cell) => {
                  const is2 = cell.house === 2;
                  const is11 = cell.house === 11;
                  const hasJup = jupPlacement === `${cell.house}rd` || jupPlacement === `${cell.house}th` || (jupPlacement === "2nd" && cell.house === 2) || (jupPlacement === "9th" && cell.house === 9);
                  const hasVen = venPlacement === `${cell.house}nd` || venPlacement === `${cell.house}th` || (venPlacement === "2nd" && cell.house === 2) || (venPlacement === "7th" && cell.house === 7);
                  return (
                    <g key={cell.house} className="pointer-events-none">
                      <text x={cell.cx} y={cell.cy + 1} textAnchor="middle" fontSize="5" fontWeight={is2 || is11 ? "bold" : "600"} fill={is2 || is11 ? CHART_LINE_STRONG : LABEL_TEXT_STRONG}>
                        {cell.house}
                      </text>
                      {hasJup && (
                        <circle cx={cell.cx - 3} cy={cell.cy - 3} r="2" fill="#d97706" />
                      )}
                      {hasVen && (
                        <circle cx={cell.cx + 3} cy={cell.cy - 3} r="2" fill="#4f46e5" />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {hasKarakoBhavaNashaya && (
        <div className="p-3 rounded border border-amber-300 bg-amber-50/40 text-[10px] text-amber-950 leading-relaxed w-full flex items-start gap-2 mb-4 animate-fade-in">
          <ShieldAlert size={14} className="shrink-0 mt-0.5 text-amber-800 animate-pulse" />
          <div>
            <strong>Karako Bhāva Nāśāya alert:</strong> Jupiter occupies the 2nd house (its own signifying domain). This can cause complacency, saturation, or minor communication friction. Frame reading safeguards around Venus and the 2nd lord strength.
          </div>
        </div>
      )}

      {/* Phrasing Register Panel */}
      <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: HAIRLINE }}>
          <div>
            <span className="text-[9px] uppercase tracking-wider block font-bold" style={{ color: LABEL_TEXT }}>
              Calibrated Kāraka Phrasing
            </span>
            <span className="text-[10px] font-medium italic" style={{ color: LABEL_TEXT_STRONG }}>
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
        <blockquote className="text-xs italic border-l-2 pl-3 py-1 bg-amber-50/10" style={{ borderColor: GOLD, color: LABEL_TEXT_STRONG }}>
          &ldquo;{phrasingText}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}
