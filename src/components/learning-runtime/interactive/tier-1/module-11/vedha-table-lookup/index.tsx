"use client";

import React, { useState, useMemo } from "react";
import { HelpCircle, CheckCircle2, XCircle, AlertTriangle, ListOrdered, ShieldAlert } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

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

interface VedhaRule {
  planet: string;
  favorable: number[];
  vedha: number[];
}

const VEDHA_RULES: Record<string, VedhaRule> = {
  Sun: { planet: "Sun", favorable: [3, 6, 10, 11], vedha: [9, 12, 4, 5] },
  Moon: { planet: "Moon", favorable: [1, 3, 6, 7, 10, 11], vedha: [5, 9, 12, 2, 4, 8] },
  Mars: { planet: "Mars", favorable: [3, 6, 11], vedha: [12, 9, 5] },
  Mercury: { planet: "Mercury", favorable: [2, 4, 6, 8, 10, 11], vedha: [5, 3, 9, 1, 8, 12] },
  Jupiter: { planet: "Jupiter", favorable: [2, 5, 7, 9, 11], vedha: [12, 4, 3, 10, 8] },
  Venus: { planet: "Venus", favorable: [1, 2, 3, 4, 5, 8, 9, 11, 12], vedha: [8, 7, 1, 10, 9, 5, 11, 6, 3] },
  Saturn: { planet: "Saturn", favorable: [3, 6, 11], vedha: [12, 9, 5] }
};

export function VedhaTableLookup() {
  const [transitingPlanet, setTransitingPlanet] = useState<string>("Saturn");
  const [positionFromMoon, setPositionFromMoon] = useState<number>(3);
  
  // Placed planets in the 12 houses from the Moon (1-based index: H1 to H12)
  const [houseOccupants, setHouseOccupants] = useState<Record<number, string>>({
    12: "Jupiter" // Default default occupant in H12 to block Saturn in H3
  });

  const rule = useMemo(() => {
    return VEDHA_RULES[transitingPlanet] || VEDHA_RULES.Saturn;
  }, [transitingPlanet]);

  // Compute lookup steps
  const lookupAnalysis = useMemo(() => {
    const isFavorable = rule.favorable.includes(positionFromMoon);
    
    // Find designated vedha obstruction point
    let vedhaPoint = 0;
    if (isFavorable) {
      const idx = rule.favorable.indexOf(positionFromMoon);
      vedhaPoint = rule.vedha[idx];
    } else {
      const idx = rule.vedha.indexOf(positionFromMoon);
      if (idx !== -1) {
        vedhaPoint = rule.favorable[idx];
      }
    }

    const occupant = houseOccupants[vedhaPoint] || "";
    const hasOccupant = occupant !== "" && occupant !== "None";

    // Exceptions
    // 1. Sun and Saturn do not cause mutual vedha
    const isSunSaturnException = 
      hasOccupant && 
      ((transitingPlanet === "Sun" && occupant === "Saturn") || 
       (transitingPlanet === "Saturn" && occupant === "Sun"));

    // 2. Moon and Mercury do not cause mutual vedha
    const isMoonMercuryException = 
      hasOccupant && 
      ((transitingPlanet === "Moon" && occupant === "Mercury") || 
       (transitingPlanet === "Mercury" && occupant === "Moon"));

    const exceptionActive = isSunSaturnException || isMoonMercuryException;
    const isObstructed = hasOccupant && !exceptionActive;

    return {
      isFavorable,
      vedhaPoint,
      occupant,
      hasOccupant,
      exceptionActive,
      isObstructed,
      isSunSaturnException,
      isMoonMercuryException
    };
  }, [rule, transitingPlanet, positionFromMoon, houseOccupants]);

  const cycleOccupant = (houseNum: number) => {
    const current = houseOccupants[houseNum] || "None";
    const cycle = ["None", "Jupiter", "Saturn", "Sun", "Mercury", "Moon", "Mars", "Venus"];
    const nextIdx = (cycle.indexOf(current) + 1) % cycle.length;
    setHouseOccupants(prev => ({
      ...prev,
      [houseNum]: cycle[nextIdx]
    }));
  };

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
          <IAST>Śāstrīya-Vedha-Sāraṇī</IAST> — BPHS Vedha Reference &amp; Lookup
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>
          Select a transiting planet and position, place occupants in the 12-house grid, and resolve the 5-step lookup checklist.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px" }}>
        
        {/* Left Column: Configurator & House Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Selectors */}
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>
              1. Config Transiting Planet
            </h4>
            
            <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "11.5px", color: INK_SECONDARY, width: "100px" }}>Planet:</span>
                <select
                  value={transitingPlanet}
                  onChange={(e) => setTransitingPlanet(e.target.value)}
                  style={{ flex: 1, padding: "4px", fontSize: "11px", color: INK_PRIMARY, border: "1px solid rgba(0,0,0,0.15)", borderRadius: "4px" }}
                >
                  {Object.keys(VEDHA_RULES).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: INK_SECONDARY, marginBottom: "4px" }}>
                  <span>Position from Moon:</span>
                  <strong>{positionFromMoon}H</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={positionFromMoon}
                  onChange={(e) => setPositionFromMoon(Number(e.target.value))}
                  style={{ width: "100%", accentColor: GOLD, cursor: "pointer" }}
                />
              </div>
            </div>
          </div>

          {/* Clickable House Occupancy grid */}
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <h4 style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>
              2. Place Obstruction Planets
            </h4>
            <span style={{ fontSize: "10px", color: INK_MUTED, display: "block", marginBottom: "12px" }}>
              Click on a house sector to cycle through occupant planets.
            </span>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {Array.from({ length: 12 }).map((_, i) => {
                const houseNum = i + 1;
                const occupant = houseOccupants[houseNum] || "None";
                const isVedhaTarget = houseNum === lookupAnalysis.vedhaPoint;
                
                return (
                  <button
                    key={houseNum}
                    onClick={() => cycleOccupant(houseNum)}
                    style={{
                      padding: "8px 4px",
                      borderRadius: "6px",
                      background: isVedhaTarget ? "rgba(245,158,11,0.06)" : occupant !== "None" ? "rgba(156,122,47,0.04)" : "#ffffff",
                      border: isVedhaTarget
                        ? `1.8px solid ${AMBER}`
                        : occupant !== "None"
                          ? `1px solid ${GOLD}`
                          : "1px solid rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ fontSize: "9px", color: INK_MUTED, fontWeight: 700 }}>H{houseNum}</div>
                    <div style={{ fontSize: "10.5px", fontWeight: 800, color: occupant !== "None" ? GOLD_DEEP : INK_SECONDARY, marginTop: "2px" }}>
                      {occupant === "None" ? "—" : occupant[0] + occupant.slice(1, 3)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Center/Right Column: Reference Table & 5-Step Resolver */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Favorable Table Reference */}
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", overflowX: "auto" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "12.5px", fontWeight: 700, color: GOLD_DEEP }}>
              BPHS Gochara Reference
            </h4>
            <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1.2px solid rgba(156,122,47,0.15)", color: GOLD_DEEP }}>
                  <th style={{ padding: "4px" }}>Planet</th>
                  <th style={{ padding: "4px" }}>Favorable Positions</th>
                  <th style={{ padding: "4px" }}>Corresponding Vedha-Points</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(VEDHA_RULES).map(k => {
                  const isActive = k === transitingPlanet;
                  const ruleItem = VEDHA_RULES[k];
                  return (
                    <tr key={k} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", background: isActive ? "rgba(156,122,47,0.06)" : "inherit", fontWeight: isActive ? 700 : 500 }}>
                      <td style={{ padding: "5px" }}>{k}</td>
                      <td style={{ padding: "5px" }}>
                        {ruleItem.favorable.map((val, idx) => {
                          const isHighlighted = isActive && (
                            val === positionFromMoon || 
                            ruleItem.vedha[idx] === positionFromMoon
                          );
                          return (
                            <React.Fragment key={val}>
                              {idx > 0 && ", "}
                              <span style={isHighlighted ? {
                                background: "rgba(16, 185, 129, 0.25)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                border: `1px solid ${GREEN}`,
                                fontWeight: 800,
                                color: "#065f46"
                              } : {}}>
                                {val}
                              </span>
                            </React.Fragment>
                          );
                        })}
                      </td>
                      <td style={{ padding: "5px" }}>
                        {ruleItem.vedha.map((val, idx) => {
                          const isHighlighted = isActive && (
                            val === positionFromMoon || 
                            ruleItem.favorable[idx] === positionFromMoon
                          );
                          return (
                            <React.Fragment key={val}>
                              {idx > 0 && ", "}
                              <span style={isHighlighted ? {
                                background: "rgba(245, 158, 11, 0.25)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                border: `1px solid ${AMBER}`,
                                fontWeight: 800,
                                color: "#92400e"
                              } : {}}>
                                {val}
                              </span>
                            </React.Fragment>
                          );
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Dynamic 5-Step Resolver */}
          <div style={{
            background: "rgba(156,122,47,0.03)",
            border: `1.2px solid rgba(156,122,47,0.15)`,
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
              <ListOrdered size={16} /> 5-Step Lookup Resolver
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11.5px" }}>
              
              {/* Step 1 */}
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ fontWeight: 700, color: GOLD_DEEP }}>Step 1:</span>
                <span>Transiting Planet is <strong>{transitingPlanet}</strong>.</span>
              </div>

              {/* Step 2 */}
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ fontWeight: 700, color: GOLD_DEEP }}>Step 2:</span>
                <span>Transit lies in the <strong>{positionFromMoon}H</strong> from natal Moon.</span>
              </div>

              {/* Step 3 */}
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ fontWeight: 700, color: GOLD_DEEP }}>Step 3:</span>
                <span>
                  This transit is classically {lookupAnalysis.isFavorable ? <strong style={{ color: GREEN }}>Favorable</strong> : <strong style={{ color: RED }}>Unfavorable</strong>} per BPHS.
                </span>
              </div>

              {/* Step 4 */}
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ fontWeight: 700, color: GOLD_DEEP }}>Step 4:</span>
                <span>
                  Designated Vedha-Point is <strong>House {lookupAnalysis.vedhaPoint}</strong>. 
                  {lookupAnalysis.hasOccupant ? (
                    <span> Occupied by <strong>{lookupAnalysis.occupant}</strong>.</span>
                  ) : (
                    <span style={{ color: INK_MUTED }}> Currently vacant.</span>
                  )}
                </span>
              </div>

              {/* Step 5 */}
              <div style={{ display: "flex", gap: "6px", borderTop: "1px dashed rgba(156,122,47,0.15)", paddingTop: "8px", marginTop: "4px" }}>
                <span style={{ fontWeight: 800, color: GOLD_DEEP }}>Step 5:</span>
                <div>
                  <strong>Final Predictive Verdict:</strong>
                  
                  {lookupAnalysis.isObstructed ? (
                    <div style={{ marginTop: "4px", color: AMBER, fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                      <XCircle size={14} /> Result Obstructed & Nullified by {lookupAnalysis.occupant}!
                    </div>
                  ) : lookupAnalysis.exceptionActive ? (
                    <div style={{ marginTop: "4px", color: RED, fontWeight: 700, display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <ShieldAlert size={14} /> Exceptions Triggered: Mutual Friendships!
                      </div>
                      <span style={{ fontSize: "10.5px", fontWeight: 500, color: INK_SECONDARY, fontStyle: "italic" }}>
                        {lookupAnalysis.isSunSaturnException && "⚠️ BPHS Exception: The Sun and Saturn do not cause mutual vedha. Transit effect remains active."}
                        {lookupAnalysis.isMoonMercuryException && "⚠️ BPHS Exception: The Moon and Mercury do not cause mutual vedha. Transit effect remains active."}
                      </span>
                    </div>
                  ) : (
                    <div style={{ marginTop: "4px", color: GREEN, fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                      <CheckCircle2 size={14} /> Unobstructed! Transit result operates at 100%.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Source Footer */}
      <div className="rounded-lg p-3 text-[10px]" style={{ background: "var(--gl-surface-manuscript, rgba(251,248,243,0.6))", border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (gochara-phala adhyāya) — classical <IAST>vedha</IAST> tables mapping favourable positions to obstruction points. Sun↔Saturn and Moon↔Mercury exceptions are canonical.
      </div>
    </div>
  );
}
