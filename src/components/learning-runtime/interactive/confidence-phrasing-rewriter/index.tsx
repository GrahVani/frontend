"use client";

import { useState } from "react";
import { Info, ShieldAlert, CheckCircle, AlertTriangle, BookOpen } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

interface PhrasingScenario {
  id: string;
  label: string;
  targetTier: string;
  targetRegisterGuide: string;
  suggestedRewrite: string;
}

const PHRASING_SCENARIOS: PhrasingScenario[] = [
  {
    id: "job",
    label: "Job Timing (Strong promise + active Dasha + double aspect)",
    targetTier: "Strong",
    targetRegisterGuide: "Phrase as a strong indication. Avoid deterministic decrees ('you will definitely get a job on July 5th') and over-hedging ('there is a small chance you might get a job').",
    suggestedRewrite: "The astrological factors show a strong, converging indication of career success and new job placement in the active timing window between July and September."
  },
  {
    id: "marriage",
    label: "Marriage Concord (Moderate promise + dormant Dasha)",
    targetTier: "Moderate",
    targetRegisterGuide: "Phrase as a moderate propensity. Highlight potential delays and friction honestly without declaring total marital failure.",
    suggestedRewrite: "There is moderate support for marital concord in this phase, although Saturn's aspect suggests relationship delay and calls for emotional maturity before locking commitments."
  },
  {
    id: "health",
    label: "Health Caution (Weak promise + active transit affliction)",
    targetTier: "Weak",
    targetRegisterGuide: "Phrase as a weak/cautionary tendency. Focus strictly on precautionary measures rather than doom decrees.",
    suggestedRewrite: "The chart indicators show a vulnerability to physical strain in this transit phase; prioritizing rest and safe travel is recommended to manage the indication."
  }
];

export function ConfidencePhrasingRewriter() {
  const [selectedScenarioId, setSelectedScenarioId] = useState("job");
  const [draftText, setDraftText] = useState("");

  const scenario = PHRASING_SCENARIOS.find(s => s.id === selectedScenarioId) || PHRASING_SCENARIOS[0];

  // Real-time verification heuristics
  const lowerText = draftText.toLowerCase();

  const isFatalistic = lowerText.includes("will ") || lowerText.includes("definitely") || lowerText.includes("must ") || lowerText.includes("destined");
  const isFalsePrecision = lowerText.includes("exactly") || lowerText.includes("on July 5") || lowerText.includes("percent") || lowerText.includes("%") || lowerText.includes("on the dot");
  const isFearDoom = lowerText.includes("ruin") || lowerText.includes("disaster") || lowerText.includes("accident") || lowerText.includes("die") || lowerText.includes("destroy");
  
  // Over-hedging checks on high/moderate scenarios
  const isOverHedge = (scenario.targetTier === "Strong" || scenario.targetTier === "Moderate") && 
    (lowerText.includes("maybe") || lowerText.includes("perhaps") || lowerText.includes("small chance") || lowerText.includes("slight possibility"));

  let score = 100;
  if (isFatalistic) score -= 25;
  if (isFalsePrecision) score -= 25;
  if (isFearDoom) score -= 25;
  if (isOverHedge) score -= 25;
  if (draftText.length < 15) score = Math.max(0, score - 30); // penalize empty/too short drafts

  const hasFaults = isFatalistic || isFalsePrecision || isFearDoom || isOverHedge;

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="confidence-phrasing-rewriter"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Confidence Phrasing Rewriter
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Train your prediction language to match the evidence exactly
          </p>
        </div>
        <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-sans uppercase font-bold tracking-wider">
          Speech Calibration
        </span>
      </div>


      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Editor Area */}
        <div>
          <div className="mb-4 p-3 rounded-lg border bg-white/40 shadow-sm" style={{ borderColor: HAIRLINE }}>
            <span className="text-xs uppercase tracking-wider block font-bold text-amber-900 font-sans">
              Target Confidence Tier: {scenario.targetTier}
            </span>
            <p className="text-xs mt-1 text-gray-700 leading-relaxed">{scenario.targetRegisterGuide}</p>
          </div>

          <label className="block text-sm font-semibold mb-2" style={{ color: GOLD }}>Draft Client Statement:</label>
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="Write your prediction statement here..."
            className="w-full h-36 p-3 border rounded-md bg-white/60 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
            style={{ borderColor: HAIRLINE }}
          />

          {/* Fault chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {isFatalistic && (
              <span className="px-2.5 py-1 text-xs bg-red-50 text-red-800 rounded-full border border-red-200 font-sans font-bold shadow-sm flex items-center gap-1">
                <AlertTriangle size={12} /> Fatalistic Decree (will/definitely)
              </span>
            )}
            {isFalsePrecision && (
              <span className="px-2.5 py-1 text-xs bg-red-50 text-red-800 rounded-full border border-red-200 font-sans font-bold shadow-sm flex items-center gap-1">
                <AlertTriangle size={12} /> False Precision (exact date)
              </span>
            )}
            {isFearDoom && (
              <span className="px-2.5 py-1 text-xs bg-red-50 text-red-800 rounded-full border border-red-200 font-sans font-bold shadow-sm flex items-center gap-1">
                <AlertTriangle size={12} /> Fear/Doom Exaggeration
              </span>
            )}
            {isOverHedge && (
              <span className="px-2.5 py-1 text-xs bg-orange-50 text-orange-850 rounded-full border border-orange-200 font-sans font-bold shadow-sm flex items-center gap-1">
                <AlertTriangle size={12} /> Over-Hedging (maybe/perhaps)
              </span>
            )}
            {!hasFaults && draftText.length >= 15 && (
              <span className="px-2.5 py-1 text-xs bg-green-50 text-green-800 rounded-full border border-green-200 font-sans font-bold shadow-sm flex items-center gap-1">
                <CheckCircle size={12} /> Clean Speech Calibration
              </span>
            )}
          </div>
        </div>

        {/* Score and Rewrite Panel */}
        <div className="p-6 rounded-xl border bg-white/40 shadow-inner flex flex-col justify-between" style={{ borderColor: HAIRLINE }}>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: GOLD }}>Calibration Score</h3>

            <div className="flex items-center gap-6 mb-6">
              {/* Score circle gauge */}
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    stroke={score === 100 ? "#15803d" : "#b45309"}
                    strokeDasharray={`${score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute text-xl font-bold font-sans text-gray-800">{score}%</div>
              </div>

              <div>
                <p className="text-sm font-semibold">Speech Calibration status</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                  {score === 100 ? "Perfect. The text matches the target confidence register exactly." : "Under-calibrated. Refine your draft to remove the flagged faults."}
                </p>
              </div>
            </div>

            {/* Model Suggestion */}
            <div className="p-4 rounded-lg border bg-green-50 border-green-200 text-green-900 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider block text-green-800 font-sans flex items-center gap-1">
                <BookOpen size={14} />
                Model Calibrated Statement Suggestion:
              </span>
              <p className="text-sm italic mt-1 font-serif leading-relaxed">"{scenario.suggestedRewrite}"</p>
            </div>
          </div>

          <div className="mt-4 border-t pt-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-xs font-bold uppercase tracking-wider block text-gray-500 font-sans">Ethics Reminder:</span>
            <p className="text-xs mt-1" style={{ color: INK_SECONDARY }}>
              Always state boundaries and limits clearly to the client. Real-world astrology is probabilistic; never declare absolute fate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
