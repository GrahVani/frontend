"use client";

import React, { useState, useMemo } from "react";
import { Compass, Sparkles } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

export function CrossStreamConceptBuilder() {
  const [parashari, setParashari] = useState(true);
  const [jaimini, setJaimini] = useState(true);
  const [kp, setKp] = useState(false);

  // Apply Case study presets
  const applyPreset = (pVal: boolean, jVal: boolean, kVal: boolean) => {
    setParashari(pVal);
    setJaimini(jVal);
    setKp(kVal);
  };

  const activeCount = useMemo(() => {
    let count = 0;
    if (parashari) count++;
    if (jaimini) count++;
    if (kp) count++;
    return count;
  }, [parashari, jaimini, kp]);

  const outputVerdict = useMemo(() => {
    if (activeCount === 3) {
      return {
        level: "MAXIMUM CONVERGENCE (95% RELIABILITY)",
        color: "#15803d",
        bg: "rgba(22, 163, 74, 0.04)",
        desc: "Triple confirmation: Parashari (dasha/bhava), Jaimini (chara karaka/dasha), and KP (sub-lord significators) all confirm the promise. The prediction has a negligible false-positive risk."
      };
    }
    if (activeCount === 2) {
      return {
        level: "MODERATE CONVERGENCE (60% RELIABILITY)",
        color: GOLD,
        bg: "rgba(156, 122, 47, 0.04)",
        desc: "Double stream alignment. Excellent reliability, but require minor caveats as one validation stream is missing or neutral."
      };
    }
    if (activeCount === 1) {
      return {
        level: "HIGH FALSE-POSITIVE RISK (15% RELIABILITY)",
        color: "#b91c1c",
        bg: "rgba(220, 38, 38, 0.04)",
        desc: "Single stream promise is unverified by other systems. High risk of prediction failure due to offset factors. Cross-check required."
      };
    }
    return {
      level: "ZERO RELIABILITY",
      color: "#b91c1c",
      bg: "rgba(220, 38, 38, 0.04)",
      desc: "All streams disabled. No prediction can be made."
    };
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
            Cross-Stream Concept Builder
          </h2>
          <p className="text-xs italic text-gray-600">
            Step 1: Understand the convergence of Parāśarī, Jaimini, and KP systems.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Compass size={11} className="animate-spin-slow" />
          MODULE 2.4.1
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Presets & Custom Toggles
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3.5" style={{ borderColor: HAIRLINE }}>
            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-bold text-gray-400 flex items-center gap-1">
                <Sparkles size={11} /> Case Presets:
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => applyPreset(true, true, true)}
                  className="px-2.5 py-1.5 text-xs text-left font-bold rounded border bg-transparent hover:bg-amber-50/20 text-amber-900"
                  style={{ borderColor: HAIRLINE }}
                >
                  🟢 Case A: Marriage (Full Convergence)
                </button>
                <button
                  onClick={() => applyPreset(true, false, false)}
                  className="px-2.5 py-1.5 text-xs text-left font-bold rounded border bg-transparent hover:bg-amber-50/20 text-amber-900"
                  style={{ borderColor: HAIRLINE }}
                >
                  🔴 Case B: Career (Single Stream Risk)
                </button>
                <button
                  onClick={() => applyPreset(true, true, false)}
                  className="px-2.5 py-1.5 text-xs text-left font-bold rounded border bg-transparent hover:bg-amber-50/20 text-amber-900"
                  style={{ borderColor: HAIRLINE }}
                >
                  🟡 Case C: Travel (Double Stream)
                </button>
              </div>
            </div>

            {/* Custom checkboxes */}
            <div className="border-t pt-3 space-y-2" style={{ borderColor: HAIRLINE }}>
              <button
                onClick={() => setParashari(!parashari)}
                className="w-full flex items-center gap-3 p-2 rounded border text-left bg-amber-950/[0.01] hover:bg-amber-950/[0.03] transition-all"
                style={{ borderColor: parashari ? GOLD : HAIRLINE }}
              >
                <input type="checkbox" checked={parashari} readOnly className="accent-amber-800" />
                <span className="text-xs text-gray-700 font-bold">Parāśarī (Dasha & Lords)</span>
              </button>

              <button
                onClick={() => setJaimini(!jaimini)}
                className="w-full flex items-center gap-3 p-2 rounded border text-left bg-amber-950/[0.01] hover:bg-amber-950/[0.03] transition-all"
                style={{ borderColor: jaimini ? GOLD : HAIRLINE }}
              >
                <input type="checkbox" checked={jaimini} readOnly className="accent-amber-800" />
                <span className="text-xs text-gray-700 font-bold">Jaimini (Chara Karakas)</span>
              </button>

              <button
                onClick={() => setKp(!kp)}
                className="w-full flex items-center gap-3 p-2 rounded border text-left bg-amber-950/[0.01] hover:bg-amber-950/[0.03] transition-all"
                style={{ borderColor: kp ? GOLD : HAIRLINE }}
              >
                <input type="checkbox" checked={kp} readOnly className="accent-amber-800" />
                <span className="text-xs text-gray-700 font-bold">KP (Cuspal Sub-lords)</span>
              </button>
            </div>
          </div>

          {/* Verdict Box */}
          <div
            className="p-4 rounded-xl border shadow-sm text-xs font-semibold leading-relaxed"
            style={{
              borderColor: outputVerdict.color,
              backgroundColor: outputVerdict.bg
            }}
          >
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">ESTIMATED RECONSTRUCTION</span>
            <strong className="text-xs block mb-1" style={{ color: outputVerdict.color }}>
              {outputVerdict.level}
            </strong>
            <p className="text-gray-600 font-normal leading-normal">{outputVerdict.desc}</p>
          </div>
        </div>

        {/* Visualizer Column */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Interactive Venn Diagram
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[260px]" style={{ borderColor: HAIRLINE }}>
            <svg viewBox="0 0 120 100" className="w-full max-w-[280px]">
              {/* Parashari Circle */}
              <circle
                cx="45"
                cy="40"
                r="25"
                fill={parashari ? "rgba(16, 185, 129, 0.15)" : "transparent"}
                stroke={parashari ? "#10b981" : HAIRLINE}
                strokeWidth="1.2"
              />
              <text x="32" y="32" fontSize="5" fontWeight="bold" fill={parashari ? "#047857" : INK_SECONDARY}>Parāśarī</text>

              {/* Jaimini Circle */}
              <circle
                cx="75"
                cy="40"
                r="25"
                fill={jaimini ? "rgba(245, 158, 11, 0.15)" : "transparent"}
                stroke={jaimini ? "#f59e0b" : HAIRLINE}
                strokeWidth="1.2"
              />
              <text x="82" y="32" fontSize="5" fontWeight="bold" fill={jaimini ? "#b45309" : INK_SECONDARY}>Jaimini</text>

              {/* KP Circle */}
              <circle
                cx="60"
                cy="65"
                r="25"
                fill={kp ? "rgba(139, 92, 246, 0.15)" : "transparent"}
                stroke={kp ? "#8b5cf6" : HAIRLINE}
                strokeWidth="1.2"
              />
              <text x="60" y="78" textAnchor="middle" fontSize="5" fontWeight="bold" fill={kp ? "#6d28d9" : INK_SECONDARY}>KP</text>

              {/* Convergence center intersection highlight */}
              {activeCount >= 2 && (
                <circle cx="60" cy="48" r="6" fill="rgba(156, 122, 47, 0.3)" stroke={GOLD} strokeWidth="0.8" />
              )}
            </svg>
            <p className="text-[10px] text-gray-500 text-center italic mt-4 max-w-[320px]">
              Overlapping intersections indicate system convergence, lowering the risk of prediction failure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
