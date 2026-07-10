"use client";

import { useState } from "react";
import { Info, Plus, Trash2, HelpCircle, Check, AlertCircle, ShieldAlert, Sparkles } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

interface EvidentiaryIndicator {
  id: string;
  name: string;
  source: "natal-promise" | "dasha" | "transit" | "d9" | "stream-kp" | "stream-jaimini" | "other";
}

const SOURCE_DETAILS = {
  "natal-promise": { label: "Natal Promise", color: "#d97706", short: "N" },
  "dasha": { label: "Daśā Period", color: "#2563eb", short: "D" },
  "transit": { label: "Transit Trigger", color: "#16a34a", short: "T" },
  "d9": { label: "D9 Navāṁśa", color: "#7c3aed", short: "9" },
  "stream-kp": { label: "KP Cuspal Sub-lord", color: "#db2777", short: "KP" },
  "stream-jaimini": { label: "Jaimini Chara Kāraka", color: "#0d9488", short: "J" },
  "other": { label: "Other Source", color: "#4b5563", short: "O" }
};

export function TwoYesIndicatorCounter() {
  const [indicators, setIndicators] = useState<EvidentiaryIndicator[]>([
    { id: "e1", name: "Dasha lord transiting 10th house", source: "transit" },
    { id: "e2", name: "Jupiter transiting 10th house", source: "transit" },
    { id: "e3", name: "10th lord strong in D9 (Navāmśa)", source: "d9" },
    { id: "e4", name: "10th sub-lord rules career houses", source: "stream-kp" }
  ]);
  const [newIndicatorName, setNewIndicatorName] = useState("");
  const [newIndicatorSource, setNewIndicatorSource] = useState<
    "natal-promise" | "dasha" | "transit" | "d9" | "stream-kp" | "stream-jaimini" | "other"
  >("transit");
  const [removalSource, setRemovalSource] = useState<string>("");

  const handleAddIndicator = () => {
    if (!newIndicatorName.trim()) return;
    setIndicators([
      ...indicators,
      {
        id: Date.now().toString(),
        name: newIndicatorName.trim(),
        source: newIndicatorSource
      }
    ]);
    setNewIndicatorName("");
  };

  const handleRemoveIndicator = (id: string) => {
    setIndicators(indicators.filter(ind => ind.id !== id));
  };

  // Filtered indicators based on the removal test
  const activeIndicators = indicators.filter(ind => ind.source !== removalSource);

  // Group all indicators to detect redundancy
  const rawSourceGroups: Record<string, EvidentiaryIndicator[]> = {};
  indicators.forEach(ind => {
    if (!rawSourceGroups[ind.source]) rawSourceGroups[ind.source] = [];
    rawSourceGroups[ind.source].push(ind);
  });

  // Group active indicators for collapsing logic
  const activeSourceGroups: Record<string, EvidentiaryIndicator[]> = {};
  activeIndicators.forEach(ind => {
    if (!activeSourceGroups[ind.source]) activeSourceGroups[ind.source] = [];
    activeSourceGroups[ind.source].push(ind);
  });

  const independentCount = Object.keys(activeSourceGroups).length;
  const meetsTwoYes = independentCount >= 2;

  // Redundancy is true if any category has more than 1 indicator
  const hasRedundancy = Object.values(rawSourceGroups).some(inds => inds.length > 1);

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="two-yes-indicator-counter"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Two-Yes Indicator Counter
          </h2>
          <p className="text-xs italic text-gray-600">
            Advanced Predictive Methodology — confirm claims across multiple independent streams.
          </p>
        </div>
        <span className="text-[10px] bg-amber-800/10 text-amber-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-amber-800/20">
          Independence test
        </span>
      </div>

      {/* Sanskrit Classical Calligraphy Board */}
      <div 
        className="mb-8 p-4 rounded-xl border bg-white shadow-sm text-center relative overflow-hidden transition-all duration-300"
        style={{ 
          borderColor: HAIRLINE,
          boxShadow: "inset 0 0 12px rgba(156, 122, 47, 0.03)"
        }}
      >
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
          Sanskrit Classical Maxim
        </div>
        
        <div className="py-3 space-y-2">
          {/* First Sutra: Bhinna-srotobhiḥ */}
          <div 
            className={`text-base md:text-lg font-bold tracking-wide transition-all duration-500 py-1 px-3 rounded inline-block ${
              meetsTwoYes 
                ? "text-green-800 bg-green-50/50 shadow-sm border border-green-200/40 scale-105" 
                : "text-amber-900/60"
            }`}
          >
            भिन्नस्रोतोभिरारब्धं फलं सत्यं भवेद् ध्रुवम् ॥
          </div>
          <div className="text-[10px] text-gray-500 font-medium italic">
            "bhinnasrotobhirārabdhaṁ phalaṁ satyaṁ bhaved dhruvam" — Predictions confirmable across different streams are reliable.
          </div>

          <div className="w-16 h-px bg-amber-800/10 mx-auto my-1" />

          {/* Second Sutra: Naika-sthaḥ */}
          <div 
            className={`text-base md:text-lg font-bold tracking-wide transition-all duration-500 py-1 px-3 rounded inline-block ${
              hasRedundancy 
                ? "text-amber-700 bg-amber-50/70 border border-amber-200/40 animate-pulse" 
                : "text-amber-900/60"
            }`}
          >
            नैतदेकस्थहेत्वाश्रयम् ॥
          </div>
          <div className="text-[10px] text-gray-500 font-medium italic">
            "naitadekasthahetvāśrayam" — Never rest predictive verdicts on a single evidentiary source.
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
        {/* Left column: Input panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
              1. Add Planetary Indicators
            </span>
            
            <div className="space-y-2.5">
              {indicators.map((ind) => {
                const s = SOURCE_DETAILS[ind.source];
                const isRemoved = ind.source === removalSource;
                return (
                  <div
                    key={ind.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm transition-all duration-300"
                    style={{
                      borderColor: HAIRLINE,
                      opacity: isRemoved ? 0.35 : 1,
                      textDecoration: isRemoved ? "line-through" : "none"
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800">{ind.name}</span>
                      <span 
                        className="text-[9px] uppercase tracking-wider font-extrabold font-sans mt-0.5"
                        style={{ color: s.color }}
                      >
                        Source: {s.label}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveIndicator(ind.id)}
                      className="p-1 text-red-700 hover:bg-red-50 rounded transition-colors"
                      aria-label="Delete indicator"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}

              {indicators.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg" style={{ borderColor: HAIRLINE }}>
                  <p className="text-xs italic text-gray-500">No indicators added yet.</p>
                </div>
              )}
            </div>

            <div className="p-3 rounded-lg border bg-amber-50/20 space-y-3" style={{ borderColor: HAIRLINE }}>
              <input
                type="text"
                value={newIndicatorName}
                onChange={(e) => setNewIndicatorName(e.target.value)}
                placeholder="e.g. Jupiter aspecting 10th lord"
                className="w-full p-2 border rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
                style={{ borderColor: HAIRLINE }}
              />
              <div className="flex gap-2">
                <select
                  value={newIndicatorSource}
                  onChange={(e) => setNewIndicatorSource(e.target.value as any)}
                  className="flex-1 p-2 border rounded bg-transparent text-xs font-semibold"
                  style={{ borderColor: HAIRLINE }}
                >
                  <option value="natal-promise">Natal Promise</option>
                  <option value="dasha">Daśā Period</option>
                  <option value="transit">Transit Trigger</option>
                  <option value="d9">D9 Navāṁśa</option>
                  <option value="stream-kp">KP Cuspal Sub-lord</option>
                  <option value="stream-jaimini">Jaimini Chara Kāraka</option>
                  <option value="other">Other Source</option>
                </select>
                <button
                  onClick={handleAddIndicator}
                  className="px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-900 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: SVG Flow & Collapsing */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
              2. Evidentiary Collapse Flow
            </span>

            {/* Dynamic SVG Flow lines */}
            <div className="w-full bg-amber-50/10 border rounded-lg p-3 flex flex-col items-center" style={{ borderColor: HAIRLINE }}>
              <svg className="w-full max-w-[280px] h-48" viewBox="0 0 100 80">
                {/* 6 primary sources list on left */}
                {Object.entries(SOURCE_DETAILS).map(([key, details], idx) => {
                  const cy = 10 + idx * 10;
                  const isActive = !!activeSourceGroups[key];
                  const hasMoreThanOne = (rawSourceGroups[key]?.length || 0) > 1;

                  return (
                    <g key={key}>
                      <circle 
                        cx="15" 
                        cy={cy} 
                        r="4" 
                        fill={isActive ? details.color : "#e5e7eb"} 
                        className="transition-all duration-300"
                      />
                      <text 
                        x="15" 
                        y={cy + 1} 
                        fontSize="2.5" 
                        fontWeight="bold" 
                        fill={isActive ? "#fff" : "#9ca3af"} 
                        textAnchor="middle"
                      >
                        {details.short}
                      </text>
                      <text 
                        x="21" 
                        y={cy + 1} 
                        fontSize="2.5" 
                        fontWeight={isActive ? "bold" : "normal"}
                        fill={isActive ? INK_PRIMARY : "#9ca3af"}
                      >
                        {details.label}
                      </text>

                      {/* Redundancy collapsed badge symbol */}
                      {isActive && hasMoreThanOne && (
                        <circle cx="9" cy={cy} r="1.8" fill="#d97706">
                          <title>Collapsed Redundancies</title>
                        </circle>
                      )}

                      {/* Path to Central Hub */}
                      <path 
                        d={`M 48 ${cy} C 62 ${cy}, 65 40, 78 40`} 
                        fill="none" 
                        stroke={isActive ? details.color : "#f3f4f6"} 
                        strokeWidth={isActive ? (hasMoreThanOne ? "1.5" : "1") : "0.5"} 
                        strokeDasharray={isActive ? "none" : "2,2"}
                        className="transition-all duration-500"
                      />
                    </g>
                  );
                })}

                {/* Synthesis Hub */}
                <g>
                  <circle 
                    cx="82" 
                    cy="40" 
                    r="7" 
                    fill={meetsTwoYes ? "#16a34a" : "#dc2626"} 
                    className="transition-all duration-300 shadow-sm" 
                  />
                  <text x="82" y="39.5" fontSize="2" fontWeight="bold" fill="#fff" textAnchor="middle">TWO-YES</text>
                  <text x="82" y="42.5" fontSize="2.5" fill="#fff" textAnchor="middle" fontWeight="extrabold">
                    {meetsTwoYes ? "MET" : "FAIL"}
                  </text>
                </g>
              </svg>
              <div className="text-center text-[10px] mt-1 text-gray-500 leading-normal">
                Redundant indicators collapse into their respective source channels, counting as 1.
              </div>
            </div>

            {/* Removal Test Controls */}
            <div className="p-3 rounded-lg border bg-amber-50/50 space-y-2" style={{ borderColor: HAIRLINE }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-950 flex items-center gap-1">
                  <HelpCircle size={13} className="text-amber-800" />
                  Evidentiary Removal Test
                </span>
                {removalSource && (
                  <button
                    onClick={() => setRemovalSource("")}
                    className="text-[10px] text-amber-900 underline font-bold"
                  >
                    Reset Test
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                Choose a source to temporarily disable. If the prediction fails the Two-Yes rule upon removal, it is a single-source claim.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Object.keys(activeSourceGroups).map((source) => (
                  <button
                    key={source}
                    onClick={() => setRemovalSource(removalSource === source ? "" : source)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition-all ${
                      removalSource === source
                        ? "bg-red-800 text-white border-red-950 shadow-sm"
                        : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                    }`}
                  >
                    Test without {SOURCE_DETAILS[source as keyof typeof SOURCE_DETAILS].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Yes Verdict Board */}
      <div 
        className="p-4 rounded-xl border bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4" 
        style={{ borderColor: meetsTwoYes ? "rgba(22, 163, 74, 0.3)" : "rgba(220, 38, 38, 0.3)" }}
      >
        <div>
          <span className="text-[9px] uppercase tracking-wider block text-gray-400 font-bold">Independent lines of evidence</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-amber-900">{independentCount}</span>
            <span className="text-xs text-gray-500">active channels</span>
          </div>
        </div>

        <div className="md:text-right space-y-1">
          <span className="text-[9px] uppercase tracking-wider block text-gray-400 font-bold">Two-Yes Verdict</span>
          <div className={`text-sm font-extrabold flex items-center gap-1.5 ${meetsTwoYes ? "text-green-700" : "text-red-700"}`}>
            {meetsTwoYes ? (
              <>
                <Check size={16} />
                Meets Two-Yes (Reliable Prediction)
              </>
            ) : (
              <>
                <ShieldAlert size={16} />
                Single-Signal Fail (Unreliable/Speculative)
              </>
            )}
          </div>
        </div>
      </div>

      {/* Illusion of confirmation warning */}
      <div 
        className="p-4 rounded-lg border bg-amber-50/10 text-xs leading-relaxed space-y-1"
        style={{ borderColor: HAIRLINE }}
      >
        <strong className="text-amber-950 font-bold flex items-center gap-1">
          <Sparkles size={12} /> The Illusion of Confirmation:
        </strong>
        <p className="text-gray-600">
          Listing four transits does not satisfy the Two-Yes rule. They represent a single transit event (one source channel). You must cross-confirm across distinct lines (e.g. Natal promise, Dasha timing, and Transits) before issuing a prediction.
        </p>
      </div>
    </div>
  );
}
