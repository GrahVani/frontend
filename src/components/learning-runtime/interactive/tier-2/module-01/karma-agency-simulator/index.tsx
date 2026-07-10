"use client";

import { useState } from "react";
import { Info, ShieldAlert, Zap, Compass, CheckCircle } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

interface Scenario {
  id: string;
  label: string;
  decree: string;
  calibrated: string;
  rationale: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "career",
    label: "Career Block (10th lord afflicted + Saturn transit)",
    decree: "You will face total career ruin and lose your job this month.",
    calibrated: "The planetary factors show a strong indication of career obstacles and stress in this period. It is a time for conservative planning, avoiding speculative investments, and keeping a steady posture. Mindful action mitigates severe disruption.",
    rationale: "Prārabdha creates the timing window of difficulty, but Kriyamāṇa (free will) regulates the severity by preparing defensive choices."
  },
  {
    id: "health",
    label: "Health Caution (6th lord active + transit aspect)",
    decree: "An accident is destined; you will break your leg next week.",
    calibrated: "The current transits indicate temporary physical vulnerability. Focus on slow, safe travel, check vehicle tires/brakes, and avoid high-risk physical sports. Precaution directly offsets the raw indications.",
    rationale: "The physical strain pattern is mitigated by active precaution and mindful movement."
  },
  {
    id: "marriage",
    label: "Marriage Delay (Saturn aspecting 7th house)",
    decree: "You will never marry; your chart denies marriage forever.",
    calibrated: "The indicators show relationship delay and friction under Saturn's aspects. This suggests a period for self-reflection and personal maturity before seeking union. Committing after the delay clears ensures a lasting bond.",
    rationale: "A timing delay is a window of preparation, not an immutable lifetime ban. Effort is directed to maturity."
  }
];

export function KarmaAgencySimulator() {
  const [selectedScenarioId, setSelectedScenarioId] = useState("career");
  const [prarabdha, setPrarabdha] = useState(75);
  const [kriyaman, setKriyaman] = useState(25);

  const scenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  // manifestation = prarabdha - (kriyaman * 0.8)
  const rawManifestation = prarabdha - (kriyaman * 0.8);
  const manifestationScore = Math.max(0, Math.min(100, rawManifestation));

  let manifestationVerdict = "Catastrophic (Fatalistic / Unmitigated)";
  let verdictColor = "#b91c1c"; // red
  let activeVersePart: "prarabdha" | "yatnena" | "none" = "none";

  if (manifestationScore < 35) {
    manifestationVerdict = "Active Mastery (Navigated & Healed)";
    verdictColor = "#15803d"; // green
    activeVersePart = "yatnena";
  } else if (manifestationScore < 65) {
    manifestationVerdict = "Mitigated Growth (Navigated with Care)";
    verdictColor = "#b45309"; // amber
    activeVersePart = "yatnena";
  } else {
    activeVersePart = "prarabdha";
  }

  // Calculate tilt angle in degrees based on difference
  const tilt = Math.max(-25, Math.min(25, (prarabdha - (kriyaman * 0.8)) * 0.4));
  const angleRad = (tilt * Math.PI) / 180;

  // Geometry for SVG balance scale
  const pivotX = 50;
  const pivotY = 20;
  const halfBeamLength = 28;

  // Beam ends
  const leftX = pivotX - halfBeamLength * Math.cos(angleRad);
  const leftY = pivotY - halfBeamLength * Math.sin(angleRad);
  const rightX = pivotX + halfBeamLength * Math.cos(angleRad);
  const rightY = pivotY + halfBeamLength * Math.sin(angleRad);

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="karma-agency-simulator"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Karma & Agency Simulator
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Visualize how Kriyamāṇa (free will) acts on Prārabdha (natal tendencies)
          </p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider mb-1 font-bold font-sans" style={{ color: GOLD }}>
            Select Scenario
          </label>
          <select
            value={selectedScenarioId}
            onChange={(e) => setSelectedScenarioId(e.target.value)}
            className="px-2 py-1 text-sm border rounded bg-transparent font-sans font-semibold"
            style={{ borderColor: HAIRLINE }}
          >
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id} style={{ background: SURFACE }}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Sliders panel */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: GOLD }}>
            <span>1. Balance of Forces</span>
          </h3>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold">Prārabdha (Natal Propensity Weight):</span>
              <span className="text-sm font-bold font-sans text-red-700">{prarabdha}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={prarabdha}
              onChange={(e) => setPrarabdha(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-700"
            />
            <span className="text-xs text-gray-500 font-sans block mt-1">
              Ripened karma already loosed as a tendency in the chart.
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold">Kriyamāṇa (Current Choice & Effort):</span>
              <span className="text-sm font-bold font-sans text-green-700">{kriyaman}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={kriyaman}
              onChange={(e) => setKriyaman(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-700"
            />
            <span className="text-xs text-gray-500 font-sans block mt-1">
              Active conscious response, precaution, and remedial effort.
            </span>
          </div>

          {/* Custom SVG Scales of Karma */}
          <div className="w-full bg-white/50 border rounded-lg p-4 flex flex-col items-center shadow-inner" style={{ borderColor: HAIRLINE }}>
            <span className="text-xs uppercase tracking-wider mb-2 font-bold font-sans text-gray-500">The Scales of Karma</span>
            <svg className="w-full max-w-[280px] h-36" viewBox="0 0 100 70">
              {/* Stand */}
              <line x1="50" y1="20" x2="50" y2="60" stroke="#78350f" strokeWidth="2.5" />
              <line x1="40" y1="60" x2="60" y2="60" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="20" r="2.5" fill="#d97706" />

              {/* Beam */}
              <line x1={leftX} y1={leftY} x2={rightX} y2={rightY} stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-300 ease-out" />

              {/* Left Pan (Prārabdha - Red) */}
              <g className="transition-all duration-300 ease-out">
                {/* Cords */}
                <line x1={leftX} y1={leftY} x2={leftX - 7} y2={leftY + 18} stroke="#d97706" strokeWidth="0.5" />
                <line x1={leftX} y1={leftY} x2={leftX + 7} y2={leftY + 18} stroke="#d97706" strokeWidth="0.5" />
                {/* Pan line */}
                <line x1={leftX - 10} y1={leftY + 18} x2={leftX + 10} y2={leftY + 18} stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" />
                {/* Weights stacked on pan */}
                <rect x={leftX - 3} y={leftY + 18 - Math.max(1, prarabdha / 10)} width="6" height={Math.max(1, prarabdha / 10)} fill="#b91c1c" rx="0.5" />
              </g>

              {/* Right Pan (Kriyamāṇa - Green) */}
              <g className="transition-all duration-300 ease-out">
                {/* Cords */}
                <line x1={rightX} y1={rightY} x2={rightX - 7} y2={rightY + 18} stroke="#d97706" strokeWidth="0.5" />
                <line x1={rightX} y1={rightY} x2={rightX + 7} y2={rightY + 18} stroke="#d97706" strokeWidth="0.5" />
                {/* Pan line */}
                <line x1={rightX - 10} y1={rightY + 18} x2={rightX + 10} y2={rightY + 18} stroke="#14532d" strokeWidth="2" strokeLinecap="round" />
                {/* Weights stacked on pan */}
                <rect x={rightX - 3} y={rightY + 18 - Math.max(1, (kriyaman * 0.8) / 10)} width="6" height={Math.max(1, (kriyaman * 0.8) / 10)} fill="#15803d" rx="0.5" />
              </g>
            </svg>
          </div>
        </div>

        {/* Manifestation Outcome */}
        <div className="p-6 rounded-xl border bg-white/40 shadow-inner flex flex-col justify-between" style={{ borderColor: HAIRLINE }}>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: GOLD }}>2. Manifestation Outcome</h3>

            {/* Severity Index Meter */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1 text-xs uppercase tracking-wider font-bold">
                <span>Result Severity:</span>
                <span style={{ color: verdictColor }}>{manifestationScore.toFixed(0)} / 100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${manifestationScore}%`,
                    backgroundColor: verdictColor
                  }}
                />
              </div>
              <p className="text-sm font-bold mt-2" style={{ color: verdictColor }}>
                Verdict: {manifestationVerdict}
              </p>
            </div>

            {/* Decree vs Reading */}
            <div className="space-y-4">
              <div className="p-3 rounded-lg border bg-red-50 border-red-200 text-red-900 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider block text-red-800 font-sans flex items-center gap-1">
                  <ShieldAlert size={14} />
                  Banned Deterministic Decree (Fatalism):
                </span>
                <p className="text-sm italic mt-1 font-serif">"{scenario.decree}"</p>
              </div>

              <div className="p-3 rounded-lg border bg-green-50 border-green-200 text-green-900 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider block text-green-800 font-sans flex items-center gap-1">
                  <CheckCircle size={14} />
                  Calibrated Probabilistic Reading (Conscious Agency):
                </span>
                <p className="text-sm italic mt-1 font-serif">"{scenario.calibrated}"</p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t pt-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-xs font-bold uppercase tracking-wider block text-gray-500 font-sans">Manifestation Rationale:</span>
            <p className="text-xs mt-1" style={{ color: INK_SECONDARY }}>{scenario.rationale}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
