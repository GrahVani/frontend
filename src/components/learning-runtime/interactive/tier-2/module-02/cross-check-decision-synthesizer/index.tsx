"use client";

import React, { useState, useMemo } from "react";
import { AlertTriangle, CheckCircle, XCircle, Compass, Sparkles } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

export function CrossCheckDecisionSynthesizer() {
  const [reliability, setReliability] = useState<"reliable" | "approximate" | "unknown">("reliable");
  const [tattva, setTattva] = useState<"coherent" | "clash">("coherent");
  const [rp, setRp] = useState<"strong" | "moderate" | "none">("strong");

  // Scenario shortcuts
  const applyScenario = (relVal: any, tatVal: any, rpVal: any) => {
    setReliability(relVal);
    setTattva(tatVal);
    setRp(rpVal);
  };

  const verdict = useMemo(() => {
    let level: "PROCEED" | "PROCEED WITH CAVEATS" | "RECTIFY" | "DECLINE" = "PROCEED";
    let rationale = "";

    if (reliability === "unknown") {
      level = "DECLINE";
      rationale = "Reading declined: birth details are completely unknown. Broad natal character tendencies may be read, but no time-dependent timing or cuspal answers can be honestly attempted.";
    } else if (reliability === "reliable") {
      if (tattva === "coherent" && (rp === "strong" || rp === "moderate")) {
        level = "PROCEED";
        rationale = "Go ahead with reading: birth details are highly reliable, corroborated by a coherent query tattva, and supported by ruling planets resonance.";
      } else if (tattva === "clash" && rp === "none") {
        level = "PROCEED WITH CAVEATS";
        rationale = "Proceed with caution: birth certificate is reliable, but the soft query-moment cross-checks clash. Proceed with caveats on near-cusp planets.";
      } else {
        level = "PROCEED WITH CAVEATS";
        rationale = "Proceed with caution: some minor cross-check flags are present (tattva clash or moderate RP resonance). Data is solid, but note cusp sensitivities.";
      }
    } else {
      // Approximate
      if (tattva === "coherent" && rp !== "none") {
        level = "PROCEED WITH CAVEATS";
        rationale = "Proceed with caveats: time is approximate (family memory), but cross-checks show coherence. Verify all timing predictions against historic milestones.";
      } else if (tattva === "clash" && rp === "none") {
        level = "RECTIFY";
        rationale = "Rectification required: family-memory birth time combined with element clashes and zero ruling planets resonance indicates high risk of chart displacement.";
      } else {
        level = "RECTIFY";
        rationale = "Rectification recommended: approximate time has conflicting diagnostic signals. Perform BTR check before predictive readings.";
      }
    }

    return { level, rationale };
  }, [reliability, tattva, rp]);

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
            Cross-Check Decision Synthesizer
          </h2>
          <p className="text-xs italic text-gray-600">
            Pedagogical routing workflow: combine primary data validation with soft diagnostics.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Compass size={11} className="animate-spin-slow" />
          MODULE 2.2.3
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            State Inputs
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            {/* Scenario Buttons */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                <Sparkles size={11} /> Educational Presets:
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => applyScenario("reliable", "coherent", "strong")}
                  className="px-2.5 py-1.5 text-xs text-left font-bold rounded border bg-transparent hover:bg-amber-50/20 text-amber-900"
                  style={{ borderColor: HAIRLINE }}
                >
                  🟢 Case 1: Ideal Proceed
                </button>
                <button
                  onClick={() => applyScenario("approximate", "coherent", "moderate")}
                  className="px-2.5 py-1.5 text-xs text-left font-bold rounded border bg-transparent hover:bg-amber-50/20 text-amber-900"
                  style={{ borderColor: HAIRLINE }}
                >
                  🟡 Case 2: Borderline Caveats
                </button>
                <button
                  onClick={() => applyScenario("approximate", "clash", "none")}
                  className="px-2.5 py-1.5 text-xs text-left font-bold rounded border bg-transparent hover:bg-amber-50/20 text-amber-905"
                  style={{ borderColor: HAIRLINE }}
                >
                  🔴 Case 3: Rectification Lock
                </button>
              </div>
            </div>

            <div className="border-t pt-3.5 space-y-4" style={{ borderColor: HAIRLINE }}>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Data Reliability:</label>
                <select
                  value={reliability}
                  onChange={(e) => setReliability(e.target.value as any)}
                  className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
                >
                  <option value="reliable">Reliable (Certificate)</option>
                  <option value="approximate">Approximate (Family memory)</option>
                  <option value="unknown">Unknown Time</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Tattva Coherence:</label>
                <select
                  value={tattva}
                  onChange={(e) => setTattva(e.target.value as any)}
                  className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
                >
                  <option value="coherent">Coherent Element Resonance</option>
                  <option value="clash">Element Clash (Fire / Water)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Ruling Planets Resonance:</label>
                <select
                  value={rp}
                  onChange={(e) => setRp(e.target.value as any)}
                  className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
                >
                  <option value="strong">Strong Resonance (3+ matches)</option>
                  <option value="moderate">Moderate Resonance (1-2 matches)</option>
                  <option value="none">No Resonance (0 matches)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Display Decision Tree SVG */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Interactive Decision Routing
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            {/* SVG Decision Tree */}
            <div className="w-full bg-[#fbf9f4] p-2 border rounded-lg" style={{ borderColor: HAIRLINE }}>
              <svg viewBox="0 0 200 100" className="w-full font-sans">
                {/* Level 1: Reliability */}
                <rect x="15" y="10" width="40" height="15" rx="3" fill={reliability === "reliable" ? "rgba(156, 122, 47, 0.12)" : "transparent"} stroke={reliability === "reliable" ? GOLD : HAIRLINE} strokeWidth="1" />
                <text x="35" y="20" textAnchor="middle" fontSize="6.5" fill={INK_PRIMARY} fontWeight="bold">Reliable</text>

                <rect x="80" y="10" width="40" height="15" rx="3" fill={reliability === "approximate" ? "rgba(156, 122, 47, 0.12)" : "transparent"} stroke={reliability === "approximate" ? GOLD : HAIRLINE} strokeWidth="1" />
                <text x="100" y="20" textAnchor="middle" fontSize="6.5" fill={INK_PRIMARY} fontWeight="bold">Approx</text>

                <rect x="145" y="10" width="40" height="15" rx="3" fill={reliability === "unknown" ? "rgba(220, 38, 38, 0.08)" : "transparent"} stroke={reliability === "unknown" ? "#dc2626" : HAIRLINE} strokeWidth="1" />
                <text x="165" y="20" textAnchor="middle" fontSize="6.5" fill={INK_PRIMARY} fontWeight="bold">Unknown</text>

                {/* Connectors */}
                <line x1="35" y1="25" x2="35" y2="40" stroke={reliability === "reliable" ? GOLD : HAIRLINE} strokeWidth="1" />
                <line x1="100" y1="25" x2="100" y2="40" stroke={reliability === "approximate" ? GOLD : HAIRLINE} strokeWidth="1" />
                <line x1="165" y1="25" x2="165" y2="70" stroke={reliability === "unknown" ? "#dc2626" : HAIRLINE} strokeWidth="1" />

                {/* Level 2: Tattva */}
                <rect x="15" y="40" width="40" height="15" rx="3" fill={reliability === "reliable" && tattva === "coherent" ? "rgba(156, 122, 47, 0.12)" : "transparent"} stroke={reliability === "reliable" && tattva === "coherent" ? GOLD : HAIRLINE} strokeWidth="1" />
                <text x="35" y="50" textAnchor="middle" fontSize="6.5" fill={INK_PRIMARY}>Coherent</text>

                <rect x="80" y="40" width="40" height="15" rx="3" fill={reliability === "approximate" && tattva === "clash" ? "rgba(220, 38, 38, 0.08)" : "transparent"} stroke={reliability === "approximate" && tattva === "clash" ? "#dc2626" : HAIRLINE} strokeWidth="1" />
                <text x="100" y="50" textAnchor="middle" fontSize="6.5" fill={INK_PRIMARY}>Clash</text>

                <line x1="35" y1="55" x2="35" y2="70" stroke={reliability === "reliable" && tattva === "coherent" ? GOLD : HAIRLINE} strokeWidth="1" />
                <line x1="100" y1="55" x2="100" y2="70" stroke={reliability === "approximate" && tattva === "clash" ? "#dc2626" : HAIRLINE} strokeWidth="1" />

                {/* Level 3: Final Verdict Outcomes */}
                <rect x="15" y="70" width="40" height="20" rx="3" fill={verdict.level === "PROCEED" ? "rgba(22, 163, 74, 0.08)" : "transparent"} stroke={verdict.level === "PROCEED" ? "#16a34a" : HAIRLINE} strokeWidth="1" />
                <text x="35" y="80" textAnchor="middle" fontSize="6.5" fill="#15803d" fontWeight="bold">PROCEED</text>
                <text x="35" y="87" textAnchor="middle" fontSize="5.5" fill={INK_SECONDARY}>Clean Checks</text>

                <rect x="80" y="70" width="40" height="20" rx="3" fill={verdict.level === "RECTIFY" ? "rgba(220, 38, 38, 0.08)" : "transparent"} stroke={verdict.level === "RECTIFY" ? "#dc2626" : HAIRLINE} strokeWidth="1" />
                <text x="100" y="80" textAnchor="middle" fontSize="6.5" fill="#b91c1c" fontWeight="bold">RECTIFY</text>
                <text x="100" y="87" textAnchor="middle" fontSize="5.5" fill={INK_SECONDARY}>BTR Required</text>

                <rect x="145" y="70" width="40" height="20" rx="3" fill={verdict.level === "DECLINE" ? "rgba(220, 38, 38, 0.12)" : "transparent"} stroke={verdict.level === "DECLINE" ? "#dc2626" : HAIRLINE} strokeWidth="1" />
                <text x="165" y="80" textAnchor="middle" fontSize="6.5" fill="#b91c1c" fontWeight="bold">DECLINE</text>
                <text x="165" y="87" textAnchor="middle" fontSize="5.5" fill={INK_SECONDARY}>Invalid Data</text>
              </svg>
            </div>

            {/* Verdict Box */}
            <div
              className="p-3.5 rounded-lg border text-center text-xs font-semibold leading-relaxed"
              style={{
                borderColor: verdict.level === "PROCEED" ? "#16a34a" : verdict.level === "PROCEED WITH CAVEATS" ? GOLD : "#dc2626",
                backgroundColor: verdict.level === "PROCEED" ? "rgba(22, 163, 74, 0.03)" : verdict.level === "PROCEED WITH CAVEATS" ? "rgba(156, 122, 47, 0.03)" : "rgba(220, 38, 38, 0.03)"
              }}
            >
              <span className="block text-[9px] uppercase tracking-wider font-bold text-gray-400">Synthesized Verdict Outcome</span>
              <strong className="text-sm block mb-1" style={{ color: verdict.level === "PROCEED" ? "#15803d" : verdict.level === "PROCEED WITH CAVEATS" ? GOLD : "#b91c1c" }}>
                {verdict.level}
              </strong>
              <span>{verdict.rationale}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
