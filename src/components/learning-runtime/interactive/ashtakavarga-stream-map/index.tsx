"use client";

import React, { useState } from "react";
import { Info, RotateCcw, Link, ShieldCheck, Compass, GitMerge } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface StreamDetail {
  name: string;
  slug: string;
  usage: "Heavy" | "Rare" | "None";
  primaryTool: string;
  toolDetails: string;
  workflowSteps: string[];
  rationale: string;
}

const STREAMS_DATA: StreamDetail[] = [
  {
    name: "Parāśarī (Classical Vedic)",
    slug: "parashari",
    usage: "Heavy",
    primaryTool: "Sarvāṣṭakavarga & Bhinnāṣṭakavarga",
    toolDetails: "Uses 337 bindu distributions over 12 houses to evaluate the baseline material support of houses and transit strength.",
    workflowSteps: [
      "Step 1: Lagna Chart (Qualitative Promise)",
      "Step 2: Vimśottarī Daśā (Temporal Window)",
      "Step 3: Transits / Gochara (Trigger Event)",
      "Step 4: Aṣṭakavarga Bindus (Weight & Strength)"
    ],
    rationale: "Parāśarī values geometric relationships and planets acting as operational agents of houses. Aṣṭakavarga's contribution tables are directly built upon Parāśarī graha-house aspects and friendships."
  },
  {
    name: "Jaimini (Sūtra Tradition)",
    slug: "jaimini",
    usage: "Rare",
    primaryTool: "Cara-kārakas & Rāśi-daśās",
    toolDetails: "Uses movable planet significators (7/8 Karakas) and sign-based periods (chara/sthira daśā) to evaluate events.",
    workflowSteps: [
      "Step 1: Karaka Placements (Soul-agenda)",
      "Step 2: Rāśi-daśā Progression (Sign-level timing)",
      "Step 3: Rāśi Dṛṣṭi (Aspect patterns)",
      "Step 4: Argala / Arudha (External locks)"
    ],
    rationale: "Jaimini bypasses planet-longitudes relative to houses, prioritizing sign-to-sign aspects and movable planetary roles. Traditional Jaimini readings rarely reference bindu totals directly."
  },
  {
    name: "KP (Krishnamurti Paddhati)",
    slug: "kp",
    usage: "Rare",
    primaryTool: "Sub-Lord Precision & Placidus Cusps",
    toolDetails: "Divides each nakṣatra into unequal segments (subs) ruled by specific planets to determine exact cusp significations.",
    workflowSteps: [
      "Step 1: Placidus Cusp Coordinates (Degree-exact)",
      "Step 2: Sub-Lord Identification (Ultimate decider)",
      "Step 3: Star-Lord Significations (Primary results)",
      "Step 4: Ruling Planets (Instantaneous query)"
    ],
    rationale: "KP demands micro-precision down to seconds of arc. Since aṣṭakavarga averages strength over broad 30° signs, KP practitioners ignore bindus, relying entirely on sub-lord configurations."
  },
  {
    name: "Tājika (Varṣaphala Solar Return)",
    slug: "tajika",
    usage: "None",
    primaryTool: "Orb-Based Aspects & Sahams",
    toolDetails: "Evaluates annual return charts using degree-based aspects (Ithasala, Eserapha) and calculated mathematical points (Sahams).",
    workflowSteps: [
      "Step 1: Solar Return chart (Annual snapshot)",
      "Step 2: Annual Lord selection (Harsha Bala/Pancha Bala)",
      "Step 3: Saham longitude checks (Event points)",
      "Step 4: Tajika Aspects (Degree-exact Ithasala)"
    ],
    rationale: "Tājika is derived from Western/Hellenistic-Arabic astrology, which does not share the concept of Bindu contributions. It uses Pancha-vargīya Bala for strength and ithasala orbs for transits."
  }
];

export function AshtakavargaStreamMap() {
  const [selectedStreamIndex, setSelectedStreamIndex] = useState<number>(0);
  const [crossValTriggered, setCrossValTriggered] = useState<boolean>(false);

  const activeStream = STREAMS_DATA[selectedStreamIndex];

  const resetValues = () => {
    setSelectedStreamIndex(0);
    setCrossValTriggered(false);
  };

  const getUsageBadgeColor = (usage: string) => {
    switch (usage) {
      case "Heavy": return "#16a34a"; // Green
      case "Rare": return GOLD_DEEP;   // Amber
      case "None": return "#ef4444";   // Red
      default: return INK_MUTED;
    }
  };

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", borderBottom: "1px solid rgba(156,122,47,0.1)", paddingBottom: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Cross-Stream Quantitative Map Component
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Compare how different sampradāyas (astrological streams) utilize aṣṭakavarga vs their own native quantitative tools.
          </p>
        </div>
        <button
          onClick={resetValues}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* STREAMS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
        {STREAMS_DATA.map((stream, idx) => {
          const isSelected = selectedStreamIndex === idx;
          const badgeColor = getUsageBadgeColor(stream.usage);
          
          return (
            <div
              key={stream.slug}
              onClick={() => setSelectedStreamIndex(idx)}
              style={{
                background: isSelected ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.4)",
                border: isSelected ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.05)",
                borderRadius: "12px",
                padding: "10px 12px",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                flexDirection: "column",
                gap: "4px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11.5px", fontWeight: 800, color: isSelected ? GOLD_DEEP : INK_PRIMARY }}>
                  {stream.name.split(" ")[0]}
                </span>
                <span style={{ fontSize: "8px", fontWeight: 900, textTransform: "uppercase", background: `${badgeColor}15`, color: badgeColor, padding: "2px 6px", borderRadius: "4px", border: `1px solid ${badgeColor}30` }}>
                  {stream.usage} Use
                </span>
              </div>
              <span style={{ fontSize: "9px", color: INK_MUTED, fontStyle: "italic" }}>
                Native: {stream.primaryTool}
              </span>
            </div>
          );
        })}
      </div>

      {/* STREAM DETAIL DIALOGUE */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)" }}>
        
        {/* Left Column: Stream Details */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div>
            <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: GOLD_DEEP }}>
              {activeStream.name} Detailed Analysis
            </h4>
            <span style={{ fontSize: "9px", color: INK_MUTED, display: "block" }}>
              How aṣṭakavarga fits in this tradition.
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
              Primary Quantitative Tool
            </span>
            <span style={{ fontSize: "11.5px", fontWeight: 750, color: INK_SECONDARY }}>
              {activeStream.primaryTool}
            </span>
            <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: INK_MUTED }}>
              {activeStream.toolDetails}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
              Astrological Rationale
            </span>
            <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
              {activeStream.rationale}
            </p>
          </div>
        </div>

        {/* Right Column: Workflow Steps Visualizer */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px", background: "rgba(0,0,0,0.015)", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.04)" }}>
          <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
            <Compass size={12} /> Predictive Engine Workflow
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {activeStream.workflowSteps.map((step, idx) => {
              const isAshtakavargaStep = step.includes("Aṣṭakavarga");
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: isAshtakavargaStep ? "color-mix(in srgb, var(--gl-gold-accent, #9C7A2F) 8%, transparent)" : "#ffffff",
                    border: isAshtakavargaStep ? `1px solid ${GOLD}` : "1px solid rgba(0,0,0,0.04)",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    fontSize: "10.5px",
                    fontWeight: isAshtakavargaStep ? 800 : 700,
                    color: isAshtakavargaStep ? GOLD_DEEP : INK_SECONDARY
                  }}
                >
                  <span style={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: isAshtakavargaStep ? GOLD : "rgba(0,0,0,0.06)", color: isAshtakavargaStep ? "#ffffff" : INK_MUTED, fontSize: "8.5px", fontWeight: 800 }}>
                    {idx + 1}
                  </span>
                  {step}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* CROSS-VALIDATION SIMULATOR PANEL */}
      <div style={{ border: `1px solid rgba(156,122,47,0.15)`, borderRadius: "12px", background: "#ffffff", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(156,122,47,0.08)", paddingBottom: "4px" }}>
          <span style={{ fontSize: "11px", fontWeight: 850, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
            <GitMerge size={13} /> Cross-Stream Validation Simulator
          </span>
          <button
            onClick={() => setCrossValTriggered(!crossValTriggered)}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid rgba(156,122,47,0.15)",
              background: crossValTriggered ? GOLD : "transparent",
              color: crossValTriggered ? "#ffffff" : GOLD_DEEP,
              fontSize: "9.5px",
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            {crossValTriggered ? "Reset Simulator" : "Trigger Cross-Validation"}
          </button>
        </div>
        
        {crossValTriggered ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px", lineHeight: "1.4" }}>
            <div style={{ display: "flex", gap: "8px", background: "rgba(22, 163, 74, 0.03)", border: "1px solid rgba(22, 163, 74, 0.15)", padding: "8px", borderRadius: "8px" }}>
              <ShieldCheck size={16} style={{ color: "#16a34a", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Corroborated Event (Two-Yes Rule):</strong>
                <p style={{ margin: "2px 0 0 0", color: INK_SECONDARY }}>
                  Suppose a KP reading triggers a transit in the 10th house via sub-lord precision. By cross-validating with Parāśarī **Aṣṭakavarga (10th House SAV = 32)**, you confirm the event is fully supported. Both streams indicate a yes, making prediction highly reliable.
                </p>
              </div>
            </div>
            <p style={{ margin: 0, fontStyle: "italic", fontSize: "10.5px", color: INK_MUTED }}>
              Note: Cross-stream validation is valuable for auditing final event weight but is **never mandatory**. Always prioritize the native tools of the active stream.
            </p>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: "10.5px", color: INK_MUTED, lineHeight: "1.4" }}>
            Trigger the simulator to see how a practitioner cross-validates a non-Parāśarī trigger (e.g. KP sub-lord or Jaimini rāśi-dasa) against Parāśarī aṣṭakavarga bindu weights.
          </p>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "10.5px", color: INK_SECONDARY, lineHeight: 1.45, display: "flex", gap: "6px", alignItems: "flex-start" }}>
        <Info size={14} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong>Astrological Synthesis:</strong> Aṣṭakavarga is the **quantitative-strength layer** of the predictive engine. When the daśā opens the temporal window and transit pulls the trigger, aṣṭakavarga measures *how strong the local support is*. Keep this tool inside the Parāśarī stream to remain mathematically and conceptually coherent.
        </div>
      </div>
    </div>
  );
}
