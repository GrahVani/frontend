"use client";

import { useState, useMemo } from "react";
import { Info, ShieldAlert, Plus, Trash2, CheckCircle2, Sparkles, Copy, Check } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

interface Indicator {
  id: string;
  name: string;
  type: "supports" | "neutral" | "denies";
}

const PHRASING_TEMPLATES = {
  "Strong": {
    phrasing: "The indicators converge robustly: the natal potential, active dasha sequence, and transits align. This highlights a highly supportive window for event activation; align your personal efforts to capture this momentum.",
    note: "Safe for high-stakes predictive framing. Avoid deterministic guarantees."
  },
  "Moderate": {
    phrasing: "The primary event promise is supported, though timing triggers present minor offsets. Expect delay or conditional progress. A calibrated, steady approach is recommended.",
    note: "Frame as conditional opportunity rather than certainty."
  },
  "Weak": {
    phrasing: "The astrological signals are faint or isolated. Direct predictive claims cannot be supported. We recommend focusing on spiritual alignment and mitigation remedies.",
    note: "Enforce predictive restraint. Advise caution."
  },
  "Conflict": {
    phrasing: "Significant astrological contradictions are present in the indicators. No clear predictive direction is established. Declare this tension directly to ensure practitioner accountability.",
    note: "Declare tension transparently; do not gloss over contradictory parameters."
  },
  "No Prediction": {
    phrasing: "No planetary indicators have been registered. A predictive verdict is unavailable.",
    note: "Begin by listing chart factors on the left."
  }
};

export function PredictionConfidenceDial() {
  const [indicators, setIndicators] = useState<Indicator[]>([
    { id: "i1", name: "10th lord exalted in rashi chart", type: "supports" },
    { id: "i2", name: "Dasha lord Mercury aspecting 10th house", type: "supports" }
  ]);
  const [newIndicatorName, setNewIndicatorName] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAddIndicator = () => {
    if (!newIndicatorName.trim()) return;
    setIndicators([
      ...indicators,
      { id: Date.now().toString(), name: newIndicatorName.trim(), type: "supports" }
    ]);
    setNewIndicatorName("");
  };

  const handleRemoveIndicator = (id: string) => {
    setIndicators(indicators.filter((ind) => ind.id !== id));
  };

  const handleTypeChange = (id: string, type: "supports" | "neutral" | "denies") => {
    setIndicators(
      indicators.map((ind) => (ind.id === id ? { ...ind, type } : ind))
    );
  };

  const supporting = indicators.filter((ind) => ind.type === "supports").length;
  const denying = indicators.filter((ind) => ind.type === "denies").length;

  // Determine Confidence states
  const { tier, color, degrees, activeVersePart, phrasingKey } = useMemo(() => {
    if (denying > 0) {
      return {
        tier: "Weak / Conflict" as const,
        color: "#b91c1c", // red
        degrees: 45, // -45 deg
        activeVersePart: "virodhe" as const,
        phrasingKey: "Conflict" as const
      };
    }
    if (supporting >= 3) {
      return {
        tier: "Strong" as const,
        color: "#15803d", // green
        degrees: 135, // 45 deg
        activeVersePart: "tribhir" as const,
        phrasingKey: "Strong" as const
      };
    }
    if (supporting === 2) {
      return {
        tier: "Moderate" as const,
        color: "#b45309", // amber
        degrees: 90, // 0 deg
        activeVersePart: "dvabhyam" as const,
        phrasingKey: "Moderate" as const
      };
    }
    if (supporting === 1) {
      return {
        tier: "Weak" as const,
        color: "#b91c1c",
        degrees: 45,
        activeVersePart: "ekena" as const,
        phrasingKey: "Weak" as const
      };
    }
    return {
      tier: "No Prediction" as const,
      color: "#6b7280",
      degrees: 0, // -90 deg
      activeVersePart: "none" as const,
      phrasingKey: "No Prediction" as const
    };
  }, [supporting, denying]);

  const activePhrasing = PHRASING_TEMPLATES[phrasingKey];

  const copyPhrasing = () => {
    navigator.clipboard.writeText(activePhrasing.phrasing);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="prediction-confidence-dial"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Prediction Confidence Dial
          </h2>
          <p className="text-xs italic text-gray-600">
            Chapter 3: Calibrate indicators to prevent deterministic or over-inflated decrees.
          </p>
        </div>
        <span className="text-[10px] bg-amber-800/10 text-amber-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-amber-800/20">
          Calibration Mode
        </span>
      </div>

      {/* Sanskrit Classical Maxim Board */}
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
          {/* 1 Indicator: Ekena */}
          <div 
            className={`text-sm font-bold tracking-wide transition-all duration-500 py-1 px-3 rounded inline-block ${
              activeVersePart === "ekena" 
                ? "text-red-800 bg-red-50/50 shadow-sm border border-red-200/40 scale-105" 
                : "text-amber-905/30"
            }`}
          >
            एकेन सूचितं मन्दे (ekena sūcitaṁ mande — indicated by one is weak)
          </div>

          <div className="text-[10px] text-gray-300 font-extralight">|</div>

          {/* 2 Indicators: Dvabhyam */}
          <div 
            className={`text-sm font-bold tracking-wide transition-all duration-500 py-1 px-3 rounded inline-block ${
              activeVersePart === "dvabhyam" 
                ? "text-amber-700 bg-amber-50/50 shadow-sm border border-amber-200/40 scale-105" 
                : "text-amber-905/30"
            }`}
          >
            द्वाभ्यां मध्यमं (dvābhyāṁ madhyaṁ — indicated by two is moderate)
          </div>

          <div className="text-[10px] text-gray-300 font-extralight">|</div>

          {/* 3+ Indicators: Tribhir */}
          <div 
            className={`text-sm font-bold tracking-wide transition-all duration-500 py-1 px-3 rounded inline-block ${
              activeVersePart === "tribhir" 
                ? "text-green-800 bg-green-50/50 shadow-sm border border-green-200/40 scale-105" 
                : "text-amber-905/30"
            }`}
          >
            त्रिभिर् दृढं (tribhir dṛḍhaṁ — indicated by three is firm)
          </div>

          <div className="text-[10px] text-gray-300 font-extralight">|</div>

          {/* Contradictory: Virodhe */}
          <div 
            className={`text-sm font-bold tracking-wide transition-all duration-500 py-1 px-3 rounded inline-block ${
              activeVersePart === "virodhe" 
                ? "text-red-700 bg-red-50/70 border border-red-200/40 animate-pulse scale-105" 
                : "text-amber-905/30"
            }`}
          >
            विरोधे तु न निश्चयः (virodhe tu na niścayaḥ — in conflict, no certainty)
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
        {/* Left column: Gathered indicators */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1">
              1. Gathered Indicators
            </span>

            <div className="space-y-2.5">
              {indicators.map((ind) => (
                <div 
                  key={ind.id} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm" 
                  style={{ borderColor: HAIRLINE }}
                >
                  <span className="text-xs font-bold text-gray-800 pr-4">{ind.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={ind.type}
                      onChange={(e) => handleTypeChange(ind.id, e.target.value as any)}
                      className="px-2 py-1 text-xs border rounded bg-transparent font-semibold"
                      style={{ borderColor: HAIRLINE }}
                    >
                      <option value="supports">Supports (+)</option>
                      <option value="neutral">Neutral (0)</option>
                      <option value="denies">Denies (-)</option>
                    </select>
                    <button
                      onClick={() => handleRemoveIndicator(ind.id)}
                      className="p-1 text-red-700 hover:bg-red-50 rounded transition-colors"
                      aria-label="Delete indicator"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {indicators.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg" style={{ borderColor: HAIRLINE }}>
                  <p className="text-xs italic text-gray-500">No indicators recorded.</p>
                </div>
              )}
            </div>

            {/* Add input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newIndicatorName}
                onChange={(e) => setNewIndicatorName(e.target.value)}
                placeholder="e.g. Jupiter aspecting 10th house"
                className="flex-1 p-2 border rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
                style={{ borderColor: HAIRLINE }}
              />
              <button
                onClick={handleAddIndicator}
                className="px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-900 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Right column: SVG dial */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[250px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1 w-full text-center mb-6">
              2. Calibrated Confidence Tier
            </span>

            {/* Visual SVG Gauge */}
            <div className="relative w-56 h-32 flex items-center justify-center overflow-hidden mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#b91c1c" />
                    <stop offset="50%" stopColor="#b45309" />
                    <stop offset="100%" stopColor="#15803d" />
                  </linearGradient>
                </defs>

                {/* Gauge Track */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Colored active arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="url(#gaugeGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(degrees / 180) * 126} 126`}
                  className="transition-all duration-500 ease-out"
                />
                {/* Dial ticks */}
                <line x1="10" y1="50" x2="15" y2="50" stroke="#4d4133" strokeWidth="1" />
                <line x1="50" y1="10" x2="50" y2="15" stroke="#4d4133" strokeWidth="1" />
                <line x1="90" y1="50" x2="85" y2="50" stroke="#4d4133" strokeWidth="1" />

                {/* Needle */}
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="12"
                  stroke="#2d261e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  transform={`rotate(${degrees - 90} 50 50)`}
                  className="transition-all duration-500 ease-out origin-center"
                />
                <circle cx="50" cy="50" r="5" fill="#2d261e" />
              </svg>

              {/* Dynamic Label overlay */}
              <div className="absolute bottom-1 text-center">
                <span className="text-xl font-extrabold uppercase tracking-wider transition-colors duration-500" style={{ color }}>
                  {tier}
                </span>
              </div>
            </div>

            <div className="text-center px-4 space-y-1.5">
              <p className="text-[11px] font-bold text-gray-700">
                Count: {supporting} supporting, {denying} denying indicators
              </p>
              <p className="text-[9px] italic text-gray-500 max-w-xs leading-normal">
                Tiers are strictly qualitative. Jyotiṣa refutes numeric probability percentages because the system carries qualitative boundaries, not mechanical fractions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contradiction Alert banner */}
      {denying > 0 && (
        <div className="p-4 rounded-xl border flex items-start gap-3 bg-red-50 border-red-200 text-red-950 mb-6 animate-fade-in shadow-sm">
          <ShieldAlert size={20} className="shrink-0 mt-0.5 text-red-750 animate-pulse" />
          <div>
            <p className="font-bold text-xs">Contradiction Warning: Conflicting Signals</p>
            <p className="text-[10px] mt-1 leading-relaxed text-gray-600">
              When indicators point in opposite directions, the confidence tier collapses to **Weak / Conflict**. In accordance with multi-stream honesty guidelines, you must declare this tension directly to the client rather than glossing over the contradiction.
            </p>
          </div>
        </div>
      )}

      {/* Phrasing Register Panel */}
      <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: HAIRLINE }}>
          <div>
            <span className="text-[9px] uppercase tracking-wider block text-gray-400 font-bold">
              3. Calibrated Phrasing Register
            </span>
            <span className="text-[10px] text-gray-500 font-medium italic">
              {activePhrasing.note}
            </span>
          </div>
          <button
            onClick={copyPhrasing}
            disabled={phrasingKey === "No Prediction"}
            className={`px-2 py-1 text-[10px] font-bold rounded border transition-all flex items-center gap-1 bg-transparent ${
              phrasingKey !== "No Prediction" ? "hover:bg-amber-50 cursor-pointer" : "opacity-40 cursor-not-allowed"
            }`}
            style={{ borderColor: HAIRLINE }}
          >
            {copied ? <Check size={11} className="text-green-700" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy Phrasing"}
          </button>
        </div>
        <blockquote className="text-xs italic text-gray-600 border-l-2 pl-3 py-1 bg-amber-50/10" style={{ borderColor: GOLD }}>
          "{activePhrasing.phrasing}"
        </blockquote>
      </div>
    </div>
  );
}
