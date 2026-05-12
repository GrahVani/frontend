"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Info, Star, Zap, Target,
  ChevronRight, CheckCircle2, Clock, Calendar,
  ArrowRight, Sparkles, ShieldCheck, AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────
type QueryType = "partnership" | "career" | "health" | "travel";
type GateStatus = "pending" | "running" | "passed" | "failed";

interface GateResult {
  name: string;
  engine: string;
  status: GateStatus;
  input: string;
  output: string;
  window: string;
  detail: string;
}

// ─── Data ─────────────────────────────────────────────────────
const QUERIES: { id: QueryType; label: string; icon: string; color: string }[] = [
  { id: "partnership", label: "Major Partnership", icon: "🤝", color: "#ec4899" },
  { id: "career", label: "Career Elevation", icon: "🚀", color: "#f59e0b" },
  { id: "health", label: "Health Intervention", icon: "❤️", color: "#ef4444" },
  { id: "travel", label: "Relocation Timing", icon: "✈️", color: "#3b82f6" },
];

const GATE_TEMPLATES: Record<QueryType, GateResult[]> = {
  partnership: [
    { name: "Gate 1: Macro-Environment", engine: "Vimshottari Dasha", status: "passed", input: "Is the planetary season supportive of partnerships?", output: "Venus Mahadasha + Jupiter Antardasha active", window: "2027 — 2029", detail: "Venus rules 7H (Partnerships). Jupiter rules 11H (Gains). Both periods are supportive." },
    { name: "Gate 2: Transiting Power", engine: "Ashtakavarga", status: "passed", input: "Do transiting planets have power to execute?", output: "7H SAV = 33 points (Very High)", window: "April — June 2028", detail: "Jupiter will transit the high-power 7th house during this window." },
    { name: "Gate 3: Micro-Trigger", engine: "KP Sub-Lords", status: "passed", input: "What exact day/hour triggers the event?", output: "Moon enters Uttara Phalguni (Sun sub-lord)", window: "May 14, 2028 14:30 IST", detail: "Sub-lord signifies 7H, 10H, and 11H simultaneously." },
  ],
  career: [
    { name: "Gate 1: Macro-Environment", engine: "Vimshottari Dasha", status: "passed", input: "Is the planetary season supportive of career?", output: "Sun Mahadasha + Mars Antardasha active", window: "2026 — 2028", detail: "Sun rules 10H (Career). Mars rules 6H (Effort). Strong work ethic period." },
    { name: "Gate 2: Transiting Power", engine: "Ashtakavarga", status: "passed", input: "Do transiting planets have power to execute?", output: "10H SAV = 30 points (High)", window: "Aug — Oct 2027", detail: "Saturn transits 10H with high bindus. Authority recognition window." },
    { name: "Gate 3: Micro-Trigger", engine: "KP Sub-Lords", status: "failed", input: "What exact day/hour triggers the event?", output: "Sub-lord conflict detected", window: "—", detail: "Sub-lord signifies 8H (Obstacles) alongside 10H. Delay advised." },
  ],
  health: [
    { name: "Gate 1: Macro-Environment", engine: "Vimshottari Dasha", status: "passed", input: "Is the planetary season supportive of healing?", output: "Moon Mahadasha + Jupiter Antardasha", window: "2025 — 2027", detail: "Moon rules 1H (Body). Jupiter is natural significator of healing." },
    { name: "Gate 2: Transiting Power", engine: "Ashtakavarga", status: "failed", input: "Do transiting planets have power to execute?", output: "1H SAV = 18 points (Low)", window: "—", detail: "Low bindus in 1st house reduce vitality. Remedial measures recommended first." },
    { name: "Gate 3: Micro-Trigger", engine: "KP Sub-Lords", status: "pending", input: "What exact day/hour triggers the event?", window: "—", detail: "Gate 2 failed — funnel terminates here.", output: "" },
  ],
  travel: [
    { name: "Gate 1: Macro-Environment", engine: "Vimshottari Dasha", status: "passed", input: "Is the planetary season supportive of relocation?", output: "Rahu Mahadasha + Venus Antardasha", window: "2028 — 2030", detail: "Rahu = foreign, unconventional. Venus = comfort, new environment." },
    { name: "Gate 2: Transiting Power", engine: "Ashtakavarga", status: "passed", input: "Do transiting planets have power to execute?", output: "9H SAV = 31 points (High)", window: "Feb — Apr 2029", detail: "Jupiter transits 9H (Fortune/Travel) with strong bindus." },
    { name: "Gate 3: Micro-Trigger", engine: "KP Sub-Lords", status: "passed", input: "What exact day/hour triggers the event?", output: "Moon enters Moola (Ketu sub-lord)", window: "Mar 22, 2029 09:15 IST", detail: "Sub-lord signifies 9H, 3H, and 12H — all travel houses align." },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────
function getConfidence(gates: GateResult[]): { score: number; label: string; color: string } {
  const passed = gates.filter((g) => g.status === "passed").length;
  if (passed === 3) return { score: 96, label: "Absolute Alignment", color: "#059669" };
  if (passed === 2) return { score: 72, label: "Partial Consensus", color: "#d97706" };
  if (passed === 1) return { score: 38, label: "Weak Signal", color: "#dc2626" };
  return { score: 0, label: "No Signal", color: "#64748b" };
}

// ─── Component ────────────────────────────────────────────────
export default function MasterDashboardExplorer() {
  const [query, setQuery] = useState<QueryType>("partnership");
  const [running, setRunning] = useState(false);
  const [completedGates, setCompletedGates] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const gates = GATE_TEMPLATES[query];
  const confidence = getConfidence(gates);
  const queryInfo = QUERIES.find((q) => q.id === query)!;

  const runSynthesis = () => {
    setRunning(true);
    setShowResults(false);
    setCompletedGates(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCompletedGates(step);
      if (step >= 3) {
        clearInterval(interval);
        setRunning(false);
        setShowResults(true);
      }
    }, 900);
  };

  const allPassed = gates.every((g) => g.status === "passed");

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/60 px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <LayoutDashboard className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-gray-900">Master Dashboard — 3-Gate Synthesis</h3>
        </div>
        <p className="text-sm text-slate-700">
          Run a query through three independent prediction engines. Each gate narrows the time window until a high-confidence timestamp emerges.
        </p>
      </div>

      <div className="p-5 space-y-5">
        {/* Query Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
            Select Query
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUERIES.map((q) => (
              <button
                key={q.id}
                onClick={() => { setQuery(q.id); setShowResults(false); setCompletedGates(0); }}
                className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left flex items-center gap-2 ${
                  query === q.id
                    ? "text-white shadow-md border-transparent"
                    : "bg-white text-slate-700 border-slate-200 hover:border-amber-300"
                }`}
                style={query === q.id ? { backgroundColor: q.color, borderColor: q.color } : {}}
              >
                <span className="text-base">{q.icon}</span>
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Run Button */}
        <div className="flex justify-center">
          <button
            onClick={runSynthesis}
            disabled={running}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold shadow-lg transition-all ${
              running
                ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:shadow-xl hover:scale-[1.02]"
            }`}
          >
            {running ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
                Processing Gate {completedGates}/3...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run 3-Gate Synthesis
              </>
            )}
          </button>
        </div>

        {/* Funnel Visualization */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
          <h4 className="text-sm font-bold text-slate-800 mb-4 text-center">Temporal Funnel</h4>
          <div className="flex flex-col items-center gap-1">
            {gates.map((gate, idx) => {
              const isActive = running && completedGates === idx;
              const isDone = !running && (showResults || completedGates > idx);
              const widthPct = 100 - idx * 20;
              return (
                <motion.div
                  key={gate.name}
                  initial={{ opacity: 0, scaleX: 0.8 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                  style={{ width: `${widthPct}%` }}
                >
                  <div
                    className={`rounded-lg border-2 p-3 transition-all ${
                      isActive
                        ? "border-amber-400 bg-amber-50 shadow-md"
                        : isDone
                        ? gate.status === "passed"
                          ? "border-green-300 bg-green-50"
                          : gate.status === "failed"
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white"
                        : "border-slate-200 bg-white opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            isDone
                              ? gate.status === "passed"
                                ? "bg-green-500"
                                : gate.status === "failed"
                                ? "bg-red-500"
                                : "bg-slate-400"
                              : isActive
                              ? "bg-amber-500"
                              : "bg-slate-300"
                          }`}
                        >
                          {isDone ? (
                            gate.status === "passed" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : gate.status === "failed" ? (
                              <span>✕</span>
                            ) : (
                              <span>—</span>
                            )
                          ) : (
                            idx + 1
                          )}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{gate.name}</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                        {gate.engine}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 mb-1">{gate.input}</p>
                    {isDone && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pt-1.5 border-t border-slate-200/60"
                      >
                        <div className="flex items-center gap-1.5">
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span className="text-xs font-bold text-slate-900">{gate.output || "—"}</span>
                        </div>
                        {gate.window && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span className="text-xs text-slate-700">{gate.window}</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                  {idx < 2 && (
                    <div className="flex justify-center py-1">
                      <ChevronRight className="w-4 h-4 text-slate-300 rotate-90" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Results Panel */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              {/* Confidence Score */}
              <div
                className="rounded-xl border p-5"
                style={{
                  backgroundColor: confidence.color + "10",
                  borderColor: confidence.color + "40",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" style={{ color: confidence.color }} />
                    <span className="text-sm font-bold" style={{ color: confidence.color }}>
                      {confidence.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2.5 bg-white rounded-full overflow-hidden border border-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${confidence.score}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: confidence.color }}
                      />
                    </div>
                    <span className="text-lg font-bold" style={{ color: confidence.color }}>
                      {confidence.score}%
                    </span>
                  </div>
                </div>

                {allPassed ? (
                  <div className="bg-white rounded-lg border border-green-200 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-bold text-green-800">Target Execution Window</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      {gates[2].window}
                    </p>
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs text-slate-800">
                        <strong>Consensus Alert:</strong> Parashari (Dasha) and KP systems agree. 
                        All three gates passed. Confidence level: HIGH.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-600" />
                      <span className="text-xs text-slate-800">
                        <strong>Remediation:</strong> Complete Jupiter Bija Mantra 48 hours prior to stabilize 11H frequency.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-amber-200 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-amber-800">Consensus Partial / Blocked</span>
                    </div>
                    <p className="text-xs text-slate-800">
                      Not all gates passed. The dashboard flags the conflict with weighted probabilities.
                      Review individual gate results above for specific blockers.
                    </p>
                  </div>
                )}
              </div>

              {/* Synthesis Wheel */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <h4 className="text-sm font-bold text-slate-800 mb-3 text-center">Synthesis Wheel — Engine Agreement Zones</h4>
                <div className="flex justify-center">
                  <svg width="260" height="260" viewBox="0 0 260 260">
                    {/* Background rings */}
                    <circle cx="130" cy="130" r="120" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="130" cy="130" r="90" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="130" cy="130" r="60" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="130" cy="130" r="30" fill="none" stroke="#e2e8f0" strokeWidth="1" />

                    {/* Labels */}
                    <text x="130" y="18" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="bold">Dasha (Years)</text>
                    <text x="130" y="48" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="bold">AV (Months)</text>
                    <text x="130" y="78" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="bold">KP (Days)</text>
                    <text x="130" y="108" textAnchor="middle" fill="#000000" fontSize="9" fontWeight="bold">Target</text>

                    {/* Agreement zones */}
                    {allPassed ? (
                      <>
                        <circle cx="130" cy="130" r="105" fill="#22c55e" opacity="0.08" />
                        <circle cx="130" cy="130" r="75" fill="#22c55e" opacity="0.12" />
                        <circle cx="130" cy="130" r="45" fill="#22c55e" opacity="0.18" />
                        <circle cx="130" cy="130" r="18" fill="#059669" opacity="0.25" />
                        {/* Convergence marker */}
                        <circle cx="130" cy="130" r="6" fill="#059669" />
                        <text x="130" y="134" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">✓</text>
                      </>
                    ) : (
                      <>
                        <circle cx="130" cy="130" r="105" fill="#f59e0b" opacity="0.08" />
                        <circle cx="130" cy="130" r="75" fill={gates[1].status === "passed" ? "#22c55e" : "#ef4444"} opacity="0.1" />
                        <circle cx="130" cy="130" r="45" fill={gates[2].status === "passed" ? "#22c55e" : gates[2].status === "failed" ? "#ef4444" : "#94a3b8"} opacity="0.12" />
                        <circle cx="130" cy="130" r="18" fill="#94a3b8" opacity="0.2" />
                        <text x="130" y="134" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">?</text>
                      </>
                    )}

                    {/* Center */}
                    <circle cx="130" cy="130" r="2" fill="#000000" />
                  </svg>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-40" /> Agreement
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-40" /> Conflict
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 opacity-40" /> Pending
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Senior Astrologer Note */}
        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-indigo-800 mb-1">Senior Astrologer Note</p>
              <p className="text-xs text-slate-700 leading-relaxed">
                The Master Dashboard is the crown jewel of astro-engineering — but it is only as good as the data feeding it. 
                A 96% confidence score means the mathematics converges, not that destiny is sealed. 
                Always present the final output with humility: "The engines agree on this window. 
                Free will, preparation, and grace still determine the outcome." The dashboard serves the astrologer; it does not replace them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
