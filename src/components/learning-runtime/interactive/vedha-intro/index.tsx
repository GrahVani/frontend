"use client";

import React, { useState, useMemo } from "react";
import { Shield, ShieldAlert, CheckCircle2, HelpCircle, Sparkles, Zap, ZapOff } from "lucide-react";
import { RASHIS } from "../rashi-data";

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
        transitHouse: 12,
        vedhaHouse: 3,
        blockerName: "Jupiter",
        color: PURPLE,
        defaultEffect: "Pratham Sāḍhe-Sātī (12th from Moon). Classically triggers financial losses, high expenditure, mental worry, and sleep disturbances.",
        obstructedEffect: "Obstructed by planet in the 3rd House! The 12th-house difficulties are nullified — the native passes through this phase without typical troubles."
      };
    } else {
      return {
        transitingPlanet: "Jupiter",
        transitHouse: 11,
        vedhaHouse: 8,
        blockerName: "Mars",
        color: SLATE_BLUE,
        defaultEffect: "Favorable 11th from Moon transit. Classically brings massive financial gains, network growth, honors, and desires fulfilled.",
        obstructedEffect: "Obstructed by planet in the 8th House! The favorable gain-bringing results are nullified — the transit passes without bringing expected gains."
      };
    }
  }, [scenario]);

  // SVG Positions
  const center = 150;
  const radius = 95;

  const transitAngle = useMemo(() => {
    // 1-based house index to degree (H1 is top, clockwise H1 to H12)
    return (details.transitHouse - 1) * 30 - 90;
  }, [details]);

  const vedhaAngle = useMemo(() => {
    return (details.vedhaHouse - 1) * 30 - 90;
  }, [details]);

  // Coordinates
  const transitCoord = useMemo(() => {
    const rad = (transitAngle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    };
  }, [transitAngle]);

  const vedhaCoord = useMemo(() => {
    const rad = (vedhaAngle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad)
    };
  }, [vedhaAngle]);

  // Shield coordinate (positioned closer along the ray path)
  const shieldCoord = useMemo(() => {
    const rad = (transitAngle * Math.PI) / 180;
    const shieldRadius = 55;
    return {
      x: center + shieldRadius * Math.cos(rad),
      y: center + shieldRadius * Math.sin(rad),
      angle: transitAngle + 90 // Tangent angle
    };
  }, [transitAngle]);

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
          वेधसिद्धान्तपरिचयः — The Vedha Doctrine
        </h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: INK_SECONDARY }}>
          Watch how placing a planet in the designated vedha-point blocks the active ray of a transit, nullifying its outcomes.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        
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
            <svg width="300" height="300" viewBox="0 0 300 300">
              {/* Outer boundary */}
              <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(156,122,47,0.12)" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(156,122,47,0.06)" strokeWidth="1" />

              {/* 12 House Sectors */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angleDeg = i * 30 - 90;
                const rad = (angleDeg * Math.PI) / 180;
                const lineX2 = center + 120 * Math.cos(rad);
                const lineY2 = center + 120 * Math.sin(rad);

                const textRad = ((angleDeg + 15) * Math.PI) / 180;
                const textX = center + 105 * Math.cos(textRad);
                const textY = center + 105 * Math.sin(textRad);

                return (
                  <g key={i}>
                    {/* Partition Line */}
                    <line x1="150" y1="150" x2={lineX2} y2={lineY2} stroke="rgba(156,122,47,0.08)" strokeWidth="1" />
                    {/* House Label */}
                    <text x={textX} y={textY} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fontWeight: 700, fill: INK_MUTED }}>
                      H{i + 1}
                    </text>
                  </g>
                );
              })}

              {/* Central Moon reference circle */}
              <circle cx="150" cy="150" r="25" fill="rgba(156,122,47,0.08)" stroke={GOLD} strokeWidth="1" />
              <text x="150" y="147" textAnchor="middle" style={{ fontSize: "8.5px", fontWeight: 800, fill: GOLD_DEEP }}>NATAL</text>
              <text x="150" y="157" textAnchor="middle" style={{ fontSize: "8.5px", fontWeight: 800, fill: GOLD_DEEP }}>MOON</text>

              {/* Active Connection Ray */}
              <line
                x1={center}
                y1={center}
                x2={transitCoord.x}
                y2={transitCoord.y}
                stroke={vedhaPlaced ? "#cbd5e1" : details.color}
                strokeWidth={vedhaPlaced ? "2" : "3.5"}
                strokeDasharray={vedhaPlaced ? "4 4" : "none"}
                style={{ transition: "all 0.3s ease", opacity: vedhaPlaced ? 0.4 : 1 }}
              />

              {/* Transiting Planet Sphere */}
              <g style={{ transform: `translate(${transitCoord.x - 14}px, ${transitCoord.y - 14}px)`, transition: "all 0.3s ease" }}>
                <circle cx="14" cy="14" r="14" fill={details.color} stroke="#ffffff" strokeWidth="2" />
                <text x="14" y="14" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fill: "#ffffff", fontWeight: 800 }}>
                  {details.transitingPlanet[0]}
                </text>
                {/* Small indicator label */}
                <text x="14" y="-6" textAnchor="middle" style={{ fontSize: "8px", fontWeight: 800, fill: INK_PRIMARY }}>
                  Transit H{details.transitHouse}
                </text>
              </g>

              {/* Blocker planet if active */}
              {vedhaPlaced && (
                <g style={{ transform: `translate(${vedhaCoord.x - 14}px, ${vedhaCoord.y - 14}px)`, transition: "all 0.3s ease" }}>
                  <circle cx="14" cy="14" r="14" fill={AMBER} stroke="#ffffff" strokeWidth="2" />
                  <text x="14" y="14" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fill: "#ffffff", fontWeight: 800 }}>
                    {details.blockerName[0]}
                  </text>
                  <text x="14" y="-6" textAnchor="middle" style={{ fontSize: "8px", fontWeight: 800, fill: AMBER }}>
                    Vedha H{details.vedhaHouse}
                  </text>
                </g>
              )}

              {/* Visual Shield Blocker Overlay on the Ray path */}
              {vedhaPlaced && (
                <g transform={`translate(${shieldCoord.x} ${shieldCoord.y}) rotate(${shieldCoord.angle})`}>
                  <path d="M -15 -3 Q 0 5 15 -3" fill="none" stroke={AMBER} strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M -15 -3 Q 0 5 15 -3" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                </g>
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

    </div>
  );
}
