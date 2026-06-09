"use client";

import React, { useState, useMemo } from "react";
import { Shield, ShieldAlert, CheckCircle2, HelpCircle, Sparkles, Zap, ZapOff } from "lucide-react";
import { RASHIS } from "../rashi-data";
import { IAST } from "../../chrome/typography";

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

export function VedhaIntro() {
  const [scenario, setScenario] = useState<"saturn_12" | "jupiter_11">("saturn_12");
  const [vedhaPlaced, setVedhaPlaced] = useState<boolean>(true);

  // Scenario Details
  const details = useMemo(() => {
    if (scenario === "saturn_12") {
      return {
        transitingPlanet: "Saturn",
        transitingGlyph: "♄",
        transitHouse: 12,
        vedhaHouse: 3,
        blockerName: "Jupiter",
        blockerGlyph: "♃",
        color: PURPLE,
        defaultEffect: "Pratham Sāḍhe-Sātī (12th from Moon). Classically triggers financial losses, high expenditure, mental worry, and sleep disturbances.",
        obstructedEffect: "Obstructed by planet in the 3rd House! The 12th-house difficulties are nullified — the native passes through this phase without typical troubles."
      };
    } else {
      return {
        transitingPlanet: "Jupiter",
        transitingGlyph: "♃",
        transitHouse: 11,
        vedhaHouse: 8,
        blockerName: "Mars",
        blockerGlyph: "♂",
        color: SLATE_BLUE,
        defaultEffect: "Favorable 11th from Moon transit. Classically brings massive financial gains, network growth, honors, and desires fulfilled.",
        obstructedEffect: "Obstructed by planet in the 8th House! The favorable gain-bringing results are nullified — the transit passes without bringing expected gains."
      };
    }
  }, [scenario]);

  // SVG Center & Radius settings for clean layout
  const center = 150;

  // Mid-point angles for houses (H1 is at -75 deg, i.e. between -90 and -60 deg)
  const transitAngle = useMemo(() => {
    return (details.transitHouse - 1) * 30 - 75;
  }, [details]);

  const vedhaAngle = useMemo(() => {
    return (details.vedhaHouse - 1) * 30 - 75;
  }, [details]);

  // Planet outer coordinates (Radius 96)
  const transitCoord = useMemo(() => {
    const rad = (transitAngle * Math.PI) / 180;
    return {
      x: center + 96 * Math.cos(rad),
      y: center + 96 * Math.sin(rad)
    };
  }, [transitAngle]);

  const vedhaCoord = useMemo(() => {
    const rad = (vedhaAngle * Math.PI) / 180;
    return {
      x: center + 96 * Math.cos(rad),
      y: center + 96 * Math.sin(rad)
    };
  }, [vedhaAngle]);

  // Shield coordinate (positioned on the separator boundary at Radius 72)
  const shieldCoord = useMemo(() => {
    const rad = (transitAngle * Math.PI) / 180;
    return {
      x: center + 72 * Math.cos(rad),
      y: center + 72 * Math.sin(rad),
      angle: transitAngle + 90 // Tangent angle
    };
  }, [transitAngle]);

  // Inner planet label coordinates (Radius 78, aligned inwards)
  const transitLabelCoord = useMemo(() => {
    const rad = (transitAngle * Math.PI) / 180;
    return {
      x: center + 78 * Math.cos(rad),
      y: center + 78 * Math.sin(rad)
    };
  }, [transitAngle]);

  const vedhaLabelCoord = useMemo(() => {
    const rad = (vedhaAngle * Math.PI) / 180;
    return {
      x: center + 78 * Math.cos(rad),
      y: center + 78 * Math.sin(rad)
    };
  }, [vedhaAngle]);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "20px",
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
        gap: "14px"
      }}
    >
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Vedhasiddhānta-paricayaḥ</IAST> — The Vedha Doctrine
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>
          Watch how placing a planet in the designated vedha-point blocks the active ray of a transit, nullifying its outcomes.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        
        {/* Left Column: Visual Ray Blockage Diagram */}
        <div style={{
          flex: "1 1 300px",
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid rgba(156,122,47,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <h4 style={{ margin: "0 0 16px 0", fontSize: "12px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
            Visual Vedha Obstruction Ray
          </h4>

          <div style={{ position: "relative", width: "300px", height: "300px" }}>
            <svg width="300" height="300" viewBox="0 0 300 300" style={{ overflow: "visible" }}>
              {/* Outer boundary */}
              <circle cx="150" cy="150" r="122" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              
              {/* Concentric separator circle (separates inner house zone from outer planet zone) */}
              <circle cx="150" cy="150" r="72" fill="none" stroke="rgba(156,122,47,0.08)" strokeWidth="1" strokeDasharray="3 3" />

              {/* 12 House Sectors */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angleDeg = i * 30 - 90;
                const rad = (angleDeg * Math.PI) / 180;
                const lineX2 = center + 122 * Math.cos(rad);
                const lineY2 = center + 122 * Math.sin(rad);

                const textRad = ((angleDeg + 15) * Math.PI) / 180;
                const textX = center + 48 * Math.cos(textRad);
                const textY = center + 48 * Math.sin(textRad);

                return (
                  <g key={i}>
                    {/* Partition Line starting from center (will be masked by Moon circle) */}
                    <line x1="150" y1="150" x2={lineX2} y2={lineY2} stroke="rgba(156,122,47,0.1)" strokeWidth="1" />
                    {/* House Label positioned cleanly in the middle zone */}
                    <text x={textX} y={textY} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fontWeight: 800, fill: INK_MUTED, opacity: 0.65 }}>
                      H{i + 1}
                    </text>
                  </g>
                );
              })}

              {/* Active Transit Connection Ray */}
              {vedhaPlaced ? (
                <>
                  {/* Outer Segment: Planet to Shield (Fully colored and glowing) */}
                  <line
                    x1={transitCoord.x}
                    y1={transitCoord.y}
                    x2={shieldCoord.x}
                    y2={shieldCoord.y}
                    stroke={details.color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 5px ${details.color}50)`, transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)" }}
                  />
                  {/* Inner Segment: Shield to Moon (Blocked, faint dashed gray) */}
                  <line
                    x1={shieldCoord.x}
                    y1={shieldCoord.y}
                    x2={center}
                    y2={center}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.3"
                    style={{ transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)" }}
                  />
                </>
              ) : (
                /* Unobstructed: Solid glowing ray all the way from Planet to Moon */
                <line
                  x1={transitCoord.x}
                  y1={transitCoord.y}
                  x2={center}
                  y2={center}
                  stroke={details.color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 7px ${details.color}60)`, transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)" }}
                />
              )}

              {/* Blocker Obstruction Beam (Vedha force ray from Blocker Planet to Shield) */}
              {vedhaPlaced && (
                <line
                  x1={vedhaCoord.x}
                  y1={vedhaCoord.y}
                  x2={shieldCoord.x}
                  y2={shieldCoord.y}
                  stroke={AMBER}
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 4px ${AMBER}60)`, transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)", opacity: 0.85 }}
                />
              )}

              {/* Central Moon reference circle (Masks the inner partition lines) */}
              <circle cx="150" cy="150" r="26" fill="#fffdfa" stroke={GOLD} strokeWidth="1.5" style={{ filter: "drop-shadow(0 3px 8px rgba(156,122,47,0.12))" }} />
              <text x="150" y="145" textAnchor="middle" style={{ fontSize: "8px", fontWeight: 800, fill: GOLD_DEEP, letterSpacing: "0.05em" }}>NATAL</text>
              <text x="150" y="156" textAnchor="middle" style={{ fontSize: "10px", fontWeight: 900, fill: GOLD_DEEP, letterSpacing: "0.05em" }}>MOON</text>

              {/* Active Shield Arc on the transit ray path (at radius 72 separator) */}
              {vedhaPlaced && (
                <g transform={`translate(${shieldCoord.x} ${shieldCoord.y}) rotate(${shieldCoord.angle})`} style={{ transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)" }}>
                  {/* Glow layer */}
                  <path d="M -16 -4 Q 0 4 16 -4" fill="none" stroke={AMBER} strokeWidth="5" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${AMBER})`, opacity: 0.6 }} />
                  {/* Core white/amber layer */}
                  <path d="M -16 -4 Q 0 4 16 -4" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              )}

              {/* Transiting Planet Sphere */}
              <g transform={`translate(${transitCoord.x}, ${transitCoord.y})`} style={{ transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)" }}>
                {/* Glow ring */}
                <circle cx="0" cy="0" r="18" fill="none" stroke={details.color} strokeWidth="1" opacity="0.3" strokeDasharray="2 2" />
                {/* Solid orb */}
                <circle cx="0" cy="0" r="14" fill={details.color} stroke="#ffffff" strokeWidth="2" style={{ filter: `drop-shadow(0 3px 8px ${details.color}50)` }} />
                {/* Astrological Glyph */}
                <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "14px", fill: "#ffffff", fontWeight: "normal", fontFamily: "Arial, sans-serif" }}>
                  {details.transitingGlyph}
                </text>
              </g>

              {/* Transiting Planet Label (Positioned inwards at radius 78) */}
              <text
                x={transitLabelCoord.x}
                y={transitLabelCoord.y}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: "9.5px", fontWeight: 900, fill: details.color, transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)" }}
              >
                {details.transitingPlanet}
              </text>

              {/* Blocker planet if active */}
              {vedhaPlaced && (
                <>
                  <g transform={`translate(${vedhaCoord.x}, ${vedhaCoord.y})`} style={{ transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)" }}>
                    {/* Blocker glow ring */}
                    <circle cx="0" cy="0" r="18" fill="none" stroke={AMBER} strokeWidth="1" opacity="0.3" strokeDasharray="2 2" />
                    {/* Blocker solid orb */}
                    <circle cx="0" cy="0" r="14" fill={AMBER} stroke="#ffffff" strokeWidth="2" style={{ filter: `drop-shadow(0 3px 8px ${AMBER}50)` }} />
                    {/* Blocker Astrological Glyph */}
                    <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "14px", fill: "#ffffff", fontWeight: "normal", fontFamily: "Arial, sans-serif" }}>
                      {details.blockerGlyph}
                    </text>
                  </g>

                  {/* Blocker Label (Positioned inwards at radius 78) */}
                  <text
                    x={vedhaLabelCoord.x}
                    y={vedhaLabelCoord.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: "9.5px", fontWeight: 900, fill: AMBER, transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)" }}
                  >
                    {details.blockerName}
                  </text>
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Right Column: Controls & Dynamic Explanations */}
        <div style={{ flex: "1.2 1 320px", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Scenario selector */}
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "8px" }}>
              1. Choose Transit Scenario
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setScenario("saturn_12")}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: scenario === "saturn_12" ? `2px solid ${PURPLE}` : "1px solid rgba(0,0,0,0.1)",
                  background: scenario === "saturn_12" ? "rgba(139,92,246,0.06)" : "#ffffff",
                  color: scenario === "saturn_12" ? PURPLE : INK_SECONDARY,
                  fontWeight: 700,
                  fontSize: "11px",
                  cursor: "pointer"
                }}
              >
                Saturn in 12th House (Difficult)
              </button>
              <button
                onClick={() => setScenario("jupiter_11")}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: scenario === "jupiter_11" ? `2px solid ${SLATE_BLUE}` : "1px solid rgba(0,0,0,0.1)",
                  background: scenario === "jupiter_11" ? "rgba(59,130,246,0.06)" : "#ffffff",
                  color: scenario === "jupiter_11" ? SLATE_BLUE : INK_SECONDARY,
                  fontWeight: 700,
                  fontSize: "11px",
                  cursor: "pointer"
                }}
              >
                Jupiter in 11th House (Favorable)
              </button>
            </div>
          </div>

          {/* Vedha Blocker Toggle */}
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: INK_PRIMARY, display: "block" }}>
                  2. Place Planet in Vedha-Point
                </span>
                <span style={{ fontSize: "10.5px", color: INK_MUTED }}>
                  Position {details.blockerName} in House {details.vedhaHouse} to obstruct.
                </span>
              </div>
              <input
                type="checkbox"
                checked={vedhaPlaced}
                onChange={(e) => setVedhaPlaced(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: AMBER }}
              />
            </div>
          </div>

          {/* Doctrinal Outcome Verdict */}
          <div style={{
            background: vedhaPlaced ? "rgba(245,158,11,0.04)" : "rgba(16,185,129,0.04)",
            border: `1.5px solid ${vedhaPlaced ? AMBER : GREEN}`,
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: vedhaPlaced ? AMBER : GREEN }}>
              {vedhaPlaced ? <ZapOff size={18} /> : <Zap size={18} />}
              <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: 800 }}>
                {vedhaPlaced ? "Transit Result Obstructed (Vedha Active)" : "Transit Result Active (No Obstruction)"}
              </h4>
            </div>

            <div style={{ fontSize: "12px", lineHeight: "1.4", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "6px" }}>
              <div>
                <strong style={{ fontSize: "10.5px", color: INK_MUTED, display: "block", textTransform: "uppercase" }}>Base Transit Effect:</strong>
                {details.defaultEffect}
              </div>
              
              {vedhaPlaced && (
                <div style={{ borderTop: "1px dashed rgba(0,0,0,0.06)", paddingTop: "6px" }}>
                  <strong style={{ fontSize: "10.5px", color: AMBER, display: "block", textTransform: "uppercase" }}>Vedha Obstructed Result:</strong>
                  {details.obstructedEffect}
                </div>
              )}
            </div>
          </div>

          {/* Universal Vedha Possibility Explanation Card */}
          <div style={{
            background: "rgba(156,122,47,0.03)",
            border: "1.5px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: GOLD_DEEP }}>
              <HelpCircle size={18} />
              <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: 800 }}>
                Universal Vedha Possibility
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>
              Why is checking for vedha a routine necessity in every single reading? 
              In the classical tables, almost every house placement for a transiting planet has a corresponding counter-house that acts as its obstruction-point. 
              Since there are <strong>9 transiting planets</strong> moving through the <strong>12 houses</strong> at any given time, the mathematical probability that at least one planet occupies the specific vedha-point for a transit is high. 
              Checking vedha is therefore a core requirement to avoid over-prediction and to explain why feared transits often pass quietly.
            </p>
          </div>

        </div>

      </div>

      {/* Source Footer */}
      <div className="rounded-lg p-3 text-[10px]" style={{ background: "var(--gl-surface-manuscript, rgba(251,248,243,0.6))", border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (gochara-phala); <IAST>Bṛhat Saṁhitā</IAST> — <IAST>Vedha</IAST> obstruction doctrine. A planet in the designated <IAST>vedha-sthāna</IAST> nullifies the transit <IAST>phala</IAST>.
      </div>
    </div>
  );
}
