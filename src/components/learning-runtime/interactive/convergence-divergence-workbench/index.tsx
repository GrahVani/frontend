"use client";

import React, { useState, useMemo } from "react";
import { Compass, Check, Copy, ShieldCheck, Sparkles } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

export function ConvergenceDivergenceWorkbench() {
  const [parashari, setParashari] = useState<"confirm" | "deny">("confirm");
  const [kp, setKp] = useState<"confirm" | "deny">("confirm");
  const [jaimini, setJaimini] = useState<"confirm" | "deny">("confirm");
  const [copied, setCopied] = useState(false);

  // Apply scenario helper
  const applyScenario = (pVal: "confirm" | "deny", kVal: "confirm" | "deny", jVal: "confirm" | "deny") => {
    setParashari(pVal);
    setKp(kVal);
    setJaimini(jVal);
  };

  const activeCount = useMemo(() => {
    let count = 0;
    if (parashari === "confirm") count++;
    if (kp === "confirm") count++;
    if (jaimini === "confirm") count++;
    return count;
  }, [parashari, kp, jaimini]);

  const outputVerdict = useMemo(() => {
    if (activeCount === 3) {
      return {
        level: "CONVERGENT PROCEED",
        color: "#15803d",
        bg: "rgba(22, 163, 74, 0.04)",
        desc: "All three validation systems confirm the predictive event window. The prediction is highly stable; proceed with full confidence."
      };
    }
    if (activeCount === 2) {
      return {
        level: "CONVERGENT WITH CAVEATS",
        color: GOLD,
        bg: "rgba(156, 122, 47, 0.04)",
        desc: "Two out of three systems verify the timing. Proceed with reading, but advise client on minor delays or offset milestones."
      };
    }
    return {
      level: "DIVERGENT DISCORD (REJECT PREDICTION)",
      color: "#b91c1c",
      bg: "rgba(220, 38, 38, 0.04)",
      desc: "Conflicting diagnostic streams. Only one or zero systems show positive confirmation. Do not proceed; recommend BTR or decline timing."
    };
  }, [activeCount]);

  const stubText = useMemo(() => {
    return `### CROSS-STREAM CONVERGENCE STAGING RECORD
- **Parāśarī Stream:** ${parashari.toUpperCase()}
- **KP Stream:** ${kp.toUpperCase()}
- **Jaimini Stream:** ${jaimini.toUpperCase()}
- **Convergence Level:** ${activeCount}/3 Systems Confirming
- **Resolution Verdict:** ${outputVerdict.level}`;
  }, [parashari, kp, jaimini, activeCount, outputVerdict]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(stubText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG pointer position
  const gaugePath = useMemo(() => {
    const score = (activeCount / 3) * 100;
    const angle = (score / 100) * 180 - 180;
    const rad = (angle * Math.PI) / 180;
    const x = 50 + 35 * Math.cos(rad);
    const y = 45 + 35 * Math.sin(rad);
    return { x, y };
  }, [activeCount]);

  return (
    <div
      className="p-6 md:p-8 rounded-2xl border font-sans animate-fade-in"
      style={{
        backgroundColor: BG_TINT,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)"
      }}
    >
      <div className="pb-4 border-b mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Convergence-Divergence Workbench
          </h2>
          <p className="text-xs italic text-gray-600">
            Step 4: Resolve conflicting cross-stream signals and stage verified tickets.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Compass size={11} className="animate-spin-slow" />
          MODULE 2.4.4
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Presets & Custom Signals
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            {/* Scenarios presets */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-gray-400 flex items-center gap-1">
                <Sparkles size={11} /> Resolution Scenarios:
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => applyScenario("confirm", "confirm", "confirm")}
                  className="px-2.5 py-1.5 text-xs text-left font-bold rounded border bg-transparent hover:bg-amber-50/20 text-amber-900"
                  style={{ borderColor: HAIRLINE }}
                >
                  🟢 Scenario A: Convergent Success (3/3)
                </button>
                <button
                  onClick={() => applyScenario("confirm", "deny", "confirm")}
                  className="px-2.5 py-1.5 text-xs text-left font-bold rounded border bg-transparent hover:bg-amber-50/20 text-amber-900"
                  style={{ borderColor: HAIRLINE }}
                >
                  🟡 Scenario B: Divergent Obstruction (2/3)
                </button>
                <button
                  onClick={() => applyScenario("deny", "deny", "deny")}
                  className="px-2.5 py-1.5 text-xs text-left font-bold rounded border bg-transparent hover:bg-amber-50/20 text-amber-900"
                  style={{ borderColor: HAIRLINE }}
                >
                  🔴 Scenario C: Absolute Divergence (0/3)
                </button>
              </div>
            </div>

            <div className="border-t pt-3.5 space-y-4" style={{ borderColor: HAIRLINE }}>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Parāśarī Signal:</label>
                <select
                  value={parashari}
                  onChange={(e) => setParashari(e.target.value as any)}
                  className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
                >
                  <option value="confirm">Confirm Promise (Yes)</option>
                  <option value="deny">Deny Promise (No)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">KP Signal:</label>
                <select
                  value={kp}
                  onChange={(e) => setKp(e.target.value as any)}
                  className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
                >
                  <option value="confirm">Confirm Promise (Yes)</option>
                  <option value="deny">Deny Promise (No)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Jaimini Signal:</label>
                <select
                  value={jaimini}
                  onChange={(e) => setJaimini(e.target.value as any)}
                  className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
                >
                  <option value="confirm">Confirm Promise (Yes)</option>
                  <option value="deny">Deny Promise (No)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Display Column */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Convergence Results
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 p-4 rounded-xl border bg-white shadow-sm" style={{ borderColor: HAIRLINE }}>
            {/* SVG Speedometer */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-40 h-24">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <path d="M 15 45 A 35 35 0 0 1 85 45" fill="none" stroke="#f1e6d2" strokeWidth="6" strokeLinecap="round" />
                  {activeCount > 0 && (
                    <path
                      d={`M 15 45 A 35 35 0 0 1 ${gaugePath.x} ${gaugePath.y}`}
                      fill="none"
                      stroke={outputVerdict.color}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  )}
                  <circle cx="50" cy="45" r="4" fill={INK_PRIMARY} />
                  <line x1="50" y1="45" x2={gaugePath.x} y2={gaugePath.y} stroke={INK_PRIMARY} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="absolute bottom-0 inset-x-0 text-center">
                  <span className="text-xl font-extrabold text-amber-900 font-mono">{activeCount}/3</span>
                  <span className="block text-[8px] uppercase tracking-widest text-gray-400 font-bold">convergence</span>
                </div>
              </div>
            </div>

            {/* Verdict text */}
            <div className="sm:col-span-7 flex flex-col justify-center">
              <h4 className="text-xs font-bold block mb-1" style={{ color: outputVerdict.color }}>
                {outputVerdict.level}
              </h4>
              <p className="text-[11px] text-gray-600 leading-normal font-normal">{outputVerdict.desc}</p>
            </div>
          </div>

          {/* Copyable record */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-amber-800" /> Staging Consultation Record Ticket
              </span>
              <button
                onClick={copyToClipboard}
                className="px-2 py-1 text-[10px] font-bold rounded border hover:bg-amber-50 transition-all flex items-center gap-1.5 bg-transparent"
                style={{ borderColor: HAIRLINE }}
              >
                {copied ? <Check size={11} className="text-green-700" /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy Ticket"}
              </button>
            </div>
            <textarea
              readOnly
              rows={5}
              value={stubText}
              className="w-full text-[10px] font-mono p-3 border rounded bg-amber-950/[0.01] text-gray-600 focus:outline-none leading-relaxed"
              style={{ borderColor: HAIRLINE }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
