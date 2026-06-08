"use client";

import React, { useState, useMemo } from "react";
import { ShieldCheck, HelpCircle, AlertCircle, Sparkles, Scale, Info } from "lucide-react";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const GREEN = "#10b981";
const RED = "#ef4444";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

interface ScenarioPreset {
  id: string;
  name: string;
  baselineScore: number; // -5 to +5
  transitDetails: string;
  vedhaDetails: string;
  natalLabel: string;
  defaultDashaLord: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    id: "sade_sati_pratham",
    name: "Pratham Sāḍhe-Sātī (12H)",
    baselineScore: -4,
    transitDetails: "Saturn transits the 12th from Moon. High expenditure, anxiety, isolation tendencies.",
    vedhaDetails: "Jupiter sits in the 3rd from Moon (Saturn's 12H vedha-point).",
    natalLabel: "Natal Saturn Strength",
    defaultDashaLord: "Saturn"
  },
  {
    id: "sade_sati_mukhya",
    name: "Mukhya Sāḍhe-Sātī (1H)",
    baselineScore: -5,
    transitDetails: "Saturn transits the 1st from Moon (Janma Śani). Triggers severe mental stress, physical exhaustion, and health concerns.",
    vedhaDetails: "Jupiter sits in the 12th from Moon (Saturn's 1H vedha-point).",
    natalLabel: "Natal Saturn Strength",
    defaultDashaLord: "Saturn"
  },
  {
    id: "sade_sati_antya",
    name: "Antya Sāḍhe-Sātī (2H)",
    baselineScore: -3,
    transitDetails: "Saturn transits the 2nd from Moon. Financial pressure, family discord, and communication issues.",
    vedhaDetails: "Jupiter sits in the 8th from Moon (Saturn's 2H vedha-point).",
    natalLabel: "Natal Saturn Strength",
    defaultDashaLord: "Saturn"
  },
  {
    id: "kantaka_shani",
    name: "Kantaka Śani (4H)",
    baselineScore: -3,
    transitDetails: "Saturn transits the 4th from Moon. Career friction, domestic relocations, lack of focus.",
    vedhaDetails: "Venus/Jupiter sits in the 12th from Moon (Saturn's 4H vedha-point).",
    natalLabel: "Natal Saturn Strength",
    defaultDashaLord: "Saturn"
  },
  {
    id: "jupiter_11",
    name: "Jupiter 11th House",
    baselineScore: 4,
    transitDetails: "Jupiter transits the 11th from Moon. High cashflows, honor, expanded professional network.",
    vedhaDetails: "Mars sits in the 8th from Moon (Jupiter's 11H vedha-point).",
    natalLabel: "Natal Jupiter Strength",
    defaultDashaLord: "Jupiter"
  },
  {
    id: "custom",
    name: "Custom Synthesis",
    baselineScore: -2,
    transitDetails: "Custom user-defined transit configuration.",
    vedhaDetails: "Occupant in the transit's designated vedha-point.",
    natalLabel: "Natal Planet Strength",
    defaultDashaLord: "Mars"
  }
];

export function VedhaApplicator() {
  const [activePresetId, setActivePresetId] = useState<string>("sade_sati_pratham");
  const [customBaseline, setCustomBaseline] = useState<number>(-2);
  const [vedhaActive, setVedhaActive] = useState<boolean>(true);
  const [natalStrength, setNatalStrength] = useState<"Strong" | "Weak">("Strong");
  const [dashaLordMatches, setDashaLordMatches] = useState<boolean>(true); // Two-Yes timing

  const activePreset = useMemo(() => {
    return PRESETS.find(p => p.id === activePresetId) || PRESETS[0];
  }, [activePresetId]);

  // Calculations
  const baseline = useMemo(() => {
    if (activePresetId === "custom") {
      return customBaseline;
    }
    return activePreset.baselineScore;
  }, [activePreset, activePresetId, customBaseline]);

  const scores = useMemo(() => {
    let vedhaAdjustment = 0;
    if (vedhaActive) {
      // Vedha nullifies the baseline effect: if negative it cancels the difficulty, if positive it blocks the benefit.
      vedhaAdjustment = -baseline;
    }

    // Natal strength mitigates negative transits or enhances positive ones
    let natalAdjustment = 0;
    if (natalStrength === "Strong") {
      natalAdjustment = baseline < 0 ? 1 : 0.5; // Eases bad transits, boosts good
    } else {
      natalAdjustment = baseline > 0 ? -1 : -0.5; // Drops good transits, worsens bad
    }

    const netScore = Math.max(-5, Math.min(5, baseline + vedhaAdjustment + natalAdjustment));
    
    return {
      baseline,
      vedhaAdjustment,
      natalAdjustment,
      netScore
    };
  }, [baseline, vedhaActive, natalStrength]);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 248, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}
    >
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: GOLD_DEEP }}>
          गोचरवेधप्रयोगः — Vedha Application Workbench
        </h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: INK_SECONDARY }}>
          Run the systematic transit outcome routine, stacking vedha cancellations, natal mitigations, and Vimshottari triggers.
        </p>
      </div>

      {/* Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        
        {/* Left Column: Preset Scenarios & Configs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Preset Buttons */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "6px" }}>
              1. Load Scenario Preset
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
              {PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePresetId(p.id)}
                  style={{
                    padding: "10px 6px",
                    borderRadius: "6px",
                    border: activePresetId === p.id ? `1.8px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.1)",
                    background: activePresetId === p.id ? "rgba(156,122,47,0.08)" : "#ffffff",
                    fontWeight: 700,
                    fontSize: "11px",
                    cursor: "pointer",
                    color: activePresetId === p.id ? GOLD_DEEP : INK_SECONDARY,
                    textAlign: "center"
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Config Detail Input Card */}
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "12px" }}>
            
            {activePresetId === "custom" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: INK_SECONDARY, marginBottom: "4px" }}>
                  <span>Custom Baseline Friction:</span>
                  <strong>{customBaseline > 0 ? `+${customBaseline}` : customBaseline}</strong>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={customBaseline}
                  onChange={(e) => setCustomBaseline(Number(e.target.value))}
                  style={{ width: "100%", accentColor: GOLD, cursor: "pointer" }}
                />
              </div>
            )}

            {/* Blocker planet active */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "10px" }}>
              <div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: INK_PRIMARY, display: "block" }}>
                  Vedha Blocker Active
                </span>
                <span style={{ fontSize: "10px", color: INK_MUTED, maxWidth: "220px", display: "block", lineHeight: "1.3" }}>
                  {activePreset.vedhaDetails}
                </span>
              </div>
              <input
                type="checkbox"
                checked={vedhaActive}
                onChange={(e) => setVedhaActive(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: GOLD }}
              />
            </div>

            {/* Natal strength */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "10px" }}>
              <div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: INK_PRIMARY, display: "block" }}>
                  {activePreset.natalLabel}
                </span>
                <span style={{ fontSize: "10px", color: INK_MUTED }}>
                  Dignity / placement in natal chart.
                </span>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {["Strong", "Weak"].map(s => (
                  <button
                    key={s}
                    onClick={() => setNatalStrength(s as "Strong" | "Weak")}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: natalStrength === s ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.1)",
                      background: natalStrength === s ? "rgba(156,122,47,0.06)" : "#ffffff",
                      color: natalStrength === s ? GOLD_DEEP : INK_SECONDARY,
                      fontSize: "10.5px",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Two-Yes check */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: INK_PRIMARY, display: "block" }}>
                  Timeline Active (Bhukti Lord matches)
                </span>
                <span style={{ fontSize: "10px", color: INK_MUTED }}>
                  Verify Vimshottari dasha lord trigger.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dashaLordMatches}
                onChange={(e) => setDashaLordMatches(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: GOLD }}
              />
            </div>

          </div>

        </div>

        {/* Right Column: Dynamic Gauge & Synthesized Verdict */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Visual friction score dial */}
          <div style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid rgba(156,122,47,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Scale size={14} color={GOLD} /> Synthesized Transit Net Score
            </span>

            {/* Score Bar */}
            <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", position: "relative", margin: "20px 0 10px 0" }}>
              {/* Shaded baseline bar from center (0) */}
              {(() => {
                const centerPct = 50;
                const widthPct = (scores.netScore / 5) * 50;
                const left = scores.netScore >= 0 ? centerPct : centerPct + widthPct;
                const width = Math.abs(widthPct);
                const color = scores.netScore > 0 ? GREEN : scores.netScore === 0 ? GOLD : RED;

                return (
                  <div style={{
                    position: "absolute",
                    left: `${left}%`,
                    width: `${width}%`,
                    height: "100%",
                    background: color,
                    borderRadius: "4px",
                    transition: "all 0.3s ease"
                  }} />
                );
              })()}

              {/* Center point marker */}
              <div style={{ position: "absolute", left: "50%", top: "-4px", width: "2px", height: "16px", background: INK_MUTED }} />
              
              {/* Current Net Score Pin */}
              <div style={{
                position: "absolute",
                left: `${50 + (scores.netScore / 5) * 50}%`,
                top: "-8px",
                transform: "translateX(-50%)",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: scores.netScore > 0 ? GREEN : scores.netScore === 0 ? GOLD : RED,
                border: "2px solid #ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "9px",
                fontWeight: 800,
                transition: "all 0.3s ease"
              }}>
                {scores.netScore > 0 ? `+${scores.netScore.toFixed(1)}` : scores.netScore.toFixed(1)}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "9px", color: INK_MUTED }}>
              <span>High Friction (-5.0)</span>
              <span>Neutral (0.0)</span>
              <span>Smooth (+5.0)</span>
            </div>
          </div>

          {/* Outcome Synthesis Card */}
          <div style={{
            background: "rgba(156,122,47,0.03)",
            border: `1.2px solid rgba(156,122,47,0.15)`,
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={16} /> Routine Synthesis Verdict
            </h4>

            <div style={{ fontSize: "12px", lineHeight: "1.4", color: INK_SECONDARY }}>
              <p style={{ margin: "0 0 8px 0", fontStyle: "italic" }}>
                <strong>Active Transit:</strong> {activePreset.transitDetails}
              </p>

              <ul style={{ margin: "0 0 10px 0", paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>Baseline Score: <strong>{scores.baseline > 0 ? `+${scores.baseline}` : scores.baseline}</strong></li>
                <li>
                  Vedha cancellation adjustment:{" "}
                  <strong>{scores.vedhaAdjustment > 0 ? `+${scores.vedhaAdjustment}` : scores.vedhaAdjustment}</strong>
                  {vedhaActive && <span style={{ color: AMBER, fontSize: "10.5px", marginLeft: "4px" }}>(Canceled!)</span>}
                </li>
                <li>Natal mitigation/dignity adjustment: <strong>{scores.natalAdjustment > 0 ? `+${scores.natalAdjustment}` : scores.natalAdjustment}</strong></li>
              </ul>

              {/* Dasha confirmation banner */}
              {dashaLordMatches ? (
                <div style={{ background: "rgba(16, 185, 129, 0.05)", borderLeft: `3.5px solid ${GREEN}`, padding: "8px 10px", borderRadius: "4px", color: "#14532d", fontSize: "11.5px", marginBottom: "6px", display: "flex", gap: "6px" }}>
                  <Info size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
                  <div>
                    <strong>Dasha Window Confirmed:</strong> The running Bhukti lord triggers this transit sector. The net score will manifest strongly as tangible events.
                  </div>
                </div>
              ) : (
                <div style={{ background: "rgba(0, 0, 0, 0.02)", borderLeft: `3.5px solid ${INK_MUTED}`, padding: "8px 10px", borderRadius: "4px", color: INK_SECONDARY, fontSize: "11.5px", marginBottom: "6px", display: "flex", gap: "6px" }}>
                  <Info size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
                  <div>
                    <strong>Delayed Activation:</strong> Dasha timeline does not support this transit sector. Expected changes operate as background moods rather than concrete event milestones.
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
