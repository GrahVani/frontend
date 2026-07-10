"use client";

import React, { useState, useMemo } from "react";
import { Compass, Check } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

export function ParashariKpVerifier() {
  const [parashari, setParashari] = useState<"strong" | "weak" | "opposed">("strong");
  const [kpSignificator, setKpSignificator] = useState<"marriage" | "career" | "loss">("marriage");

  const outputVerdict = useMemo(() => {
    if (parashari === "strong" && kpSignificator !== "loss") {
      return {
        level: "CLEAN PARALLEL CONVERGENCE",
        color: "#15803d",
        bg: "rgba(22, 163, 74, 0.04)",
        desc: "Safe to predict. Parashari house lords rule supportive houses and KP sub-lords verify the exact cusp significators (2, 7, 10, 11). Standard prediction lock."
      };
    }
    if (parashari === "opposed" || kpSignificator === "loss") {
      return {
        level: "HEAVY DIVERGENCE (AVOID PREDICTING)",
        color: "#b91c1c",
        bg: "rgba(220, 38, 38, 0.04)",
        desc: "Divergence warning! Parashari dasha indicates challenges or KP sub-lords rule obstruction houses (8, 12). Predicting success here carries extremely high risk."
      };
    }
    return {
      level: "NEUTRAL / PROCEED WITH CAVEATS",
      color: GOLD,
      bg: "rgba(156, 122, 47, 0.04)",
      desc: "Mild verification. Parashari holds minor strength but KP is average. Expect slow results or timing offsets."
    };
  }, [parashari, kpSignificator]);

  // Compute common convergent houses list
  const convergentHouses = useMemo(() => {
    if (kpSignificator === "marriage") {
      return {
        title: "Primary Marriage Cusps:",
        list: "2nd (family Addition), 7th (spouse), 11th (desires fulfilled)",
        ok: parashari === "strong"
      };
    }
    if (kpSignificator === "career") {
      return {
        title: "Primary Career Cusps:",
        list: "10th (status/profession), 11th (gains/milestones)",
        ok: parashari === "strong"
      };
    }
    return {
      title: "Obstruction/Loss Cusps:",
      list: "8th (sudden delays/struggles), 12th (losses/expenditure)",
      ok: false
    };
  }, [kpSignificator, parashari]);

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
            Parāśarī-KP Paired Verifier
          </h2>
          <p className="text-xs italic text-gray-600">
            Step 2: Cross-examine dasha/house parameters with KP cuspal sub-lords.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Compass size={11} className="animate-spin-slow" />
          MODULE 2.4.2
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Paired Parameters
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Parāśarī House Promise:</label>
              <select
                value={parashari}
                onChange={(e) => setParashari(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
              >
                <option value="strong">Strong (Lords in Trikonas)</option>
                <option value="weak">Weak / Neutral</option>
                <option value="opposed">Opposed (Lord in Dusthana)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">KP Cuspal Significators:</label>
              <select
                value={kpSignificator}
                onChange={(e) => setKpSignificator(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans font-bold"
              >
                <option value="marriage">Marriage cusps (2, 7, 11)</option>
                <option value="career">Career cusps (10, 11)</option>
                <option value="loss">Obstruction/Loss cusps (8, 12)</option>
              </select>
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
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Verification Verdict</span>
            <strong className="text-xs block mb-1" style={{ color: outputVerdict.color }}>
              {outputVerdict.level}
            </strong>
            <p className="text-gray-600 font-normal leading-normal">{outputVerdict.desc}</p>
          </div>
        </div>

        {/* Visualizer Column */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Interactive Dashboard Gauges
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div className="grid grid-cols-2 gap-4">
              {/* Gauge 1: Parashari */}
              <div className="flex flex-col items-center justify-center p-3 border rounded-lg" style={{ borderColor: HAIRLINE }}>
                <span className="text-[9px] uppercase font-bold text-gray-400 mb-2">Parāśarī Strength</span>
                <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center font-bold text-xs font-mono text-amber-900"
                  style={{
                    borderColor: parashari === "strong" ? "#16a34a" : parashari === "weak" ? GOLD : "#dc2626",
                    backgroundColor: "rgba(156, 122, 47, 0.05)"
                  }}
                >
                  {parashari === "strong" ? "90%" : parashari === "weak" ? "50%" : "20%"}
                </div>
              </div>

              {/* Gauge 2: KP */}
              <div className="flex flex-col items-center justify-center p-3 border rounded-lg" style={{ borderColor: HAIRLINE }}>
                <span className="text-[9px] uppercase font-bold text-gray-400 mb-2">KP Cuspal Lock</span>
                <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center font-bold text-xs font-mono text-amber-900"
                  style={{
                    borderColor: kpSignificator !== "loss" ? "#16a34a" : "#dc2626",
                    backgroundColor: "rgba(156, 122, 47, 0.05)"
                  }}
                >
                  {kpSignificator !== "loss" ? "85%" : "15%"}
                </div>
              </div>
            </div>

            {/* Convergence Detail Card */}
            <div className="p-3.5 rounded border text-xs" style={{ borderColor: HAIRLINE }}>
              <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Cuspal Convergence Analysis</span>
              <strong className="block text-amber-900">{convergentHouses.title}</strong>
              <p className="text-gray-600 mt-1">{convergentHouses.list}</p>
              {convergentHouses.ok ? (
                <span className="text-green-700 font-bold block mt-2 text-[10px]">✓ Verified house overlap locks prediction targets!</span>
              ) : (
                <span className="text-red-700 font-bold block mt-2 text-[10px]">✗ Lacks solid positive house alignment.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
