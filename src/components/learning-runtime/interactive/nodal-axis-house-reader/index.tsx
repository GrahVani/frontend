"use client";

import React, { useState, useMemo } from "react";
import { ShieldAlert, CheckCircle2, Clock, Scale, Info } from "lucide-react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const PURPLE = "#8b5cf6";
const GREEN = "#10b981";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const SLATE_BLUE = "#3b82f6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface HouseAxisDetail {
  id: string; label: string; rahuHouse: number; ketuHouse: number;
  title: string; rahuFocus: string; ketuFocus: string; synthesis: string;
}

const AXIS_DETAILS: HouseAxisDetail[] = [
  { id: "1-7", label: "1–7", rahuHouse: 1, ketuHouse: 7, title: "Identity vs. Relationship Polarity",
    rahuFocus: "Obsessive self-focus, personal projection, restructuring identity. Grasping for independent self-will — the ahaṅkāra asserts itself.",
    ketuFocus: "Dissolving partnership attachments, letting go of dependency on marriage/legal agreements, experiencing partner distance — vairāgya through the Other.",
    synthesis: "Realignment of self-reliance vs. cooperative sharing. Dissolving relational codependency to build a mature, independent identity." },
  { id: "2-8", label: "2–8", rahuHouse: 2, ketuHouse: 8, title: "Personal Wealth vs. Shared Assets Polarity",
    rahuFocus: "Heavy urge to accumulate assets, manage bank balances, command speech. Grasping for material security — artha without surrender.",
    ketuFocus: "Detaching from joint resources, spouse's finances, secret occult investigations. Experiencing inheritance delays — randhra as release.",
    synthesis: "Shifting focus from shared legacy assets and secrets toward structuring self-made resource buffers and direct values." },
  { id: "3-9", label: "3–9", rahuHouse: 3, ketuHouse: 9, title: "Self-effort vs. Grace Polarity",
    rahuFocus: "Obsessive daily work, communication, skills, writing, intense self-efforts. Relying entirely on own hands — parākrama.",
    ketuFocus: "Dissolving rigid dogmatic beliefs, detaching from religious institutions, distance from gurus and fathers — bhāgya through letting go.",
    synthesis: "Learning to balance self-made efforts and logical skills with mature, structured surrender to dharma and spiritual laws." },
  { id: "4-10", label: "4–10", rahuHouse: 4, ketuHouse: 10, title: "Home vs. Professional Status Polarity",
    rahuFocus: "Urge for domestic peace, property acquisitions, home baseline comfort. emotional nesting focus — sukha-sthāna grasping.",
    ketuFocus: "Releasing ambition, detaching from public reputation pressures, dissolving corporate status obsession — karma-sthāna release.",
    synthesis: "Stabilizing home boundaries and emotional foundations by consciously letting go of external status anxieties." },
  { id: "5-11", label: "5–11", rahuHouse: 5, ketuHouse: 11, title: "Creative Intellect vs. Social Gains Polarity",
    rahuFocus: "Obsessive focus on personal projects, children, spiritual chants (mantra), speculative intellect. putra-bhāva grasping.",
    ketuFocus: "Detaching from massive social clubs, dissolving dependencies on networking gains, pruning superficial friendships — lābha released.",
    synthesis: "Realignment toward deep individual creativity, study, and child development, leaving behind social recognition loops." },
  { id: "6-12", label: "6–12", rahuHouse: 6, ketuHouse: 12, title: "Daily Service vs. Spiritual Liberation Polarity",
    rahuFocus: "Urge to resolve health issues, clean daily routines, fight debts, handle service tasks. Managing enemies/conflict — roga-śatrū.",
    ketuFocus: "Dissolving active expenditures, detaching from dreams, releasing fear of isolation. Spiritual surrender — vyaya as mokṣa.",
    synthesis: "Sustaining regular daily health routines and pragmatic service while surrendering the ego's control through meditation and rest." }
];

const PLANET_RULED_HOUSES: Record<string, { houses: number[]; description: string }> = {
  Sun: { houses: [5], description: "rules 5H (Leo)" },
  Moon: { houses: [4], description: "rules 4H (Cancer)" },
  Mars: { houses: [1, 8], description: "rules 1H (Aries) & 8H (Scorpio)" },
  Mercury: { houses: [3, 6], description: "rules 3H (Gemini) & 6H (Virgo)" },
  Jupiter: { houses: [9, 12], description: "rules 9H (Sagittarius) & 12H (Pisces)" },
  Venus: { houses: [2, 7], description: "rules 2H (Taurus) & 7H (Libra)" },
  Saturn: { houses: [10, 11], description: "rules 10H (Capricorn) & 11H (Aquarius)" },
  Rahu: { houses: [], description: "transit node (directly activates axis)" },
  Ketu: { houses: [], description: "transit node (directly activates axis)" }
};

export function NodalAxisHouseReader() {
  const [activeAxisId, setActiveAxisId] = useState<string>("4-10");
  
  // Placement states for sensitive hits: "none" | "rahu" | "ketu"
  const [moonPlacement, setMoonPlacement] = useState<"none" | "rahu" | "ketu">("none");
  const [sunPlacement, setSunPlacement] = useState<"none" | "rahu" | "ketu">("none");
  const [lagnaPlacement, setLagnaPlacement] = useState<"none" | "rahu" | "ketu">("none");
  const [dashaPlacement, setDashaPlacement] = useState<"none" | "rahu" | "ketu">("none");

  const [runningDashaLord, setRunningDashaLord] = useState<string>("Saturn");

  const activeAxis = useMemo(() => AXIS_DETAILS.find(a => a.id === activeAxisId) || AXIS_DETAILS[3], [activeAxisId]);

  const dashaMatching = useMemo(() => {
    if (runningDashaLord === "Rahu" || runningDashaLord === "Ketu") return true;
    const ruled = PLANET_RULED_HOUSES[runningDashaLord]?.houses || [];
    return ruled.includes(activeAxis.rahuHouse) || ruled.includes(activeAxis.ketuHouse);
  }, [runningDashaLord, activeAxis]);

  // Sensitive hits helpers
  const isMoonHit = moonPlacement !== "none";
  const isSunHit = sunPlacement !== "none";
  const isLagnaHit = lagnaPlacement !== "none";
  const isDashaHit = dashaPlacement !== "none";
  const anyHit = isMoonHit || isSunHit || isLagnaHit || isDashaHit;

  // Occupants list for SVG drawing
  const leftOccupants = useMemo(() => {
    const list = [];
    if (moonPlacement === "rahu") list.push({ glyph: "☽", name: "Moon", color: SLATE_BLUE });
    if (sunPlacement === "rahu") list.push({ glyph: "☉", name: "Sun", color: AMBER });
    if (lagnaPlacement === "rahu") list.push({ glyph: "Lg", name: "Lagna", color: GOLD_DEEP });
    if (dashaPlacement === "rahu") list.push({ glyph: runningDashaLord[0], name: "Dasha", color: RED });
    return list;
  }, [moonPlacement, sunPlacement, lagnaPlacement, dashaPlacement, runningDashaLord]);

  const rightOccupants = useMemo(() => {
    const list = [];
    if (moonPlacement === "ketu") list.push({ glyph: "☽", name: "Moon", color: SLATE_BLUE });
    if (sunPlacement === "ketu") list.push({ glyph: "☉", name: "Sun", color: AMBER });
    if (lagnaPlacement === "ketu") list.push({ glyph: "Lg", name: "Lagna", color: GOLD_DEEP });
    if (dashaPlacement === "ketu") list.push({ glyph: runningDashaLord[0], name: "Dasha", color: RED });
    return list;
  }, [moonPlacement, sunPlacement, lagnaPlacement, dashaPlacement, runningDashaLord]);

  // Calculate weights & scale angle
  const scaleAngle = useMemo(() => {
    // Rahu base weight = 2 (grasping desire is heavy)
    // Ketu base weight = 0.5 (detachment is light)
    const rahuWeight = 2 + leftOccupants.length * 1.5;
    const ketuWeight = 0.5 + rightOccupants.length * 1.5;
    const diff = rahuWeight - ketuWeight;
    // Angle limits between -25 and 25 degrees
    return Math.max(-25, Math.min(25, -5 - diff * 7));
  }, [leftOccupants, rightOccupants]);

  // SVG Coordinate helpers based on angle
  const scaleCoords = useMemo(() => {
    const cx = 120;
    const cy = 45;
    const d = 70; // half-length of beam
    const rad = (scaleAngle * Math.PI) / 180;
    return {
      leftX: cx - d * Math.cos(rad),
      leftY: cy - d * Math.sin(rad),
      rightX: cx + d * Math.cos(rad),
      rightY: cy + d * Math.sin(rad)
    };
  }, [scaleAngle]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          Janmabhāveṣu Rāhu-Ketu-Akṣaḥ — Axis on Natal Houses
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>The six house-pair axes. Rāhu grasps in one house; Ketu releases in the opposite. Always read both.</p>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label style={{ fontSize: "11.5px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "6px" }}>
            1. Select Transit Nodal Axis
          </label>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {AXIS_DETAILS.map(axis => (
              <button key={axis.id} onClick={() => setActiveAxisId(axis.id)} style={{
                padding: "5px 8px", borderRadius: "5px", border: activeAxisId === axis.id ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.08)",
                background: activeAxisId === axis.id ? "rgba(156,122,47,0.08)" : "#ffffff", fontWeight: activeAxisId === axis.id ? 700 : 500,
                fontSize: "10px", cursor: "pointer", color: activeAxisId === axis.id ? GOLD_DEEP : INK_SECONDARY, textAlign: "center",
                transition: "all 0.15s ease"
              }}>
                <div>{axis.label}</div>
                <div style={{ fontSize: "8px", opacity: 0.8 }}>H{axis.rahuHouse}-H{axis.ketuHouse}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── MAIN: BALANCE SCALE + SYNTHESIS ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        
        {/* Left Column: Interactive Balance Scale */}
        <div style={{ flex: "0 0 280px", background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h4 style={{ margin: "0 0 14px 0", fontSize: "11.5px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
            <Scale size={14} color={GOLD} /> Dragon Scale Model (DSM)
          </h4>
          
          <div style={{ position: "relative", width: "240px", height: "150px" }}>
            <svg width="240" height="150" viewBox="0 0 240 150" style={{ overflow: "visible" }}>
              {/* Stand Base */}
              <line x1="120" y1="130" x2="120" y2="45" stroke={INK_SECONDARY} strokeWidth="3.5" />
              <line x1="85" y1="130" x2="155" y2="130" stroke={INK_SECONDARY} strokeWidth="4.5" strokeLinecap="round" />
              
              {/* Fulcrum indicator point */}
              <circle cx="120" cy="45" r="4.5" fill={INK_SECONDARY} />
              
              {/* Rotated Beam */}
              <line x1={scaleCoords.leftX} y1={scaleCoords.leftY} x2={scaleCoords.rightX} y2={scaleCoords.rightY} stroke={GOLD_DEEP} strokeWidth="3" strokeLinecap="round" style={{ transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)" }} />
              
              {/* Left Pan (Rahu side) - strings hang straight down */}
              {(() => {
                const { leftX, leftY } = scaleCoords;
                return (
                  <g style={{ transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)" }}>
                    {/* Strings */}
                    <line x1={leftX} y1={leftY} x2={leftX - 16} y2={leftY + 28} stroke={PURPLE} strokeWidth="1" opacity="0.6" />
                    <line x1={leftX} y1={leftY} x2={leftX + 16} y2={leftY + 28} stroke={PURPLE} strokeWidth="1" opacity="0.6" />
                    {/* Pan Basket */}
                    <path d={`M ${leftX - 20} ${leftY + 28} Q ${leftX} ${leftY + 38} ${leftX + 20} ${leftY + 28} Z`} fill="rgba(139,92,246,0.08)" stroke={PURPLE} strokeWidth="1.5" />
                    
                    {/* Suspended core Rahu weight */}
                    <circle cx={leftX} cy={leftY + 36} r="7" fill={PURPLE} stroke="#ffffff" strokeWidth="1" />
                    <text x={leftX} y={leftY + 36.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: "#ffffff", fontWeight: 900 }}>☊</text>
                    
                    <text x={leftX} y={leftY + 49} textAnchor="middle" style={{ fontSize: "8.5px", fill: PURPLE, fontWeight: 800 }}>Rāhu (H{activeAxis.rahuHouse})</text>

                    {/* Left occupants in pan */}
                    {leftOccupants.map((occ, idx) => {
                      const total = leftOccupants.length;
                      const spacing = 11;
                      const startX = leftX - ((total - 1) * spacing) / 2;
                      const occX = startX + idx * spacing;
                      const occY = leftY + 18;
                      return (
                        <g key={occ.name}>
                          <circle cx={occX} cy={occY} r="5.5" fill={occ.color} stroke="#ffffff" strokeWidth="0.75" />
                          <text x={occX} y={occY} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7px", fill: "#ffffff", fontWeight: 900, fontFamily: "Arial, sans-serif" }}>
                            {occ.glyph}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })()}

              {/* Right Pan (Ketu side) - strings hang straight down */}
              {(() => {
                const { rightX, rightY } = scaleCoords;
                return (
                  <g style={{ transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)" }}>
                    {/* Strings */}
                    <line x1={rightX} y1={rightY} x2={rightX - 16} y2={rightY + 28} stroke={AMBER} strokeWidth="1" opacity="0.6" />
                    <line x1={rightX} y1={rightY} x2={rightX + 16} y2={rightY + 28} stroke={AMBER} strokeWidth="1" opacity="0.6" />
                    {/* Pan Basket */}
                    <path d={`M ${rightX - 20} ${rightY + 28} Q ${rightX} ${rightY + 38} ${rightX + 20} ${rightY + 28} Z`} fill="rgba(245,158,11,0.08)" stroke={AMBER} strokeWidth="1.5" />
                    
                    {/* Suspended core Ketu weight */}
                    <circle cx={rightX} cy={rightY + 36} r="7" fill={AMBER} stroke="#ffffff" strokeWidth="1" />
                    <text x={rightX} y={rightY + 36.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: "#ffffff", fontWeight: 900 }}>☋</text>
                    
                    <text x={rightX} y={rightY + 49} textAnchor="middle" style={{ fontSize: "8.5px", fill: AMBER, fontWeight: 800 }}>Ketu (H{activeAxis.ketuHouse})</text>

                    {/* Right occupants in pan */}
                    {rightOccupants.map((occ, idx) => {
                      const total = rightOccupants.length;
                      const spacing = 11;
                      const startX = rightX - ((total - 1) * spacing) / 2;
                      const occX = startX + idx * spacing;
                      const occY = rightY + 18;
                      return (
                        <g key={occ.name}>
                          <circle cx={occX} cy={occY} r="5.5" fill={occ.color} stroke="#ffffff" strokeWidth="0.75" />
                          <text x={occX} y={occY} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7px", fill: "#ffffff", fontWeight: 900, fontFamily: "Arial, sans-serif" }}>
                            {occ.glyph}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Right Column: Placement Selector & Synthesis */}
        <div style={{ flex: "1.2 1 300px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          
          {/* Conjunction Placement Panel */}
          <div style={{ background: "#ffffff", padding: "14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", display: "block" }}>
              2. Place Sensitive Conjunctions (DSM)
            </span>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Moon Placement Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ color: SLATE_BLUE, fontWeight: 800 }}>☽</span> Natal Moon:
                </span>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[
                    { value: "none", label: "None" },
                    { value: "rahu", label: `H${activeAxis.rahuHouse} (Rāhu)` },
                    { value: "ketu", label: `H${activeAxis.ketuHouse} (Ketu)` }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setMoonPlacement(opt.value as any)}
                      style={{
                        padding: "4px 6px",
                        fontSize: "9.5px",
                        fontWeight: 700,
                        borderRadius: "4px",
                        border: moonPlacement === opt.value ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.08)",
                        background: moonPlacement === opt.value ? "rgba(156,122,47,0.08)" : "#ffffff",
                        color: moonPlacement === opt.value ? GOLD_DEEP : INK_SECONDARY,
                        cursor: "pointer"
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sun Placement Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ color: AMBER, fontWeight: 800 }}>☉</span> Natal Sun:
                </span>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[
                    { value: "none", label: "None" },
                    { value: "rahu", label: `H${activeAxis.rahuHouse} (Rāhu)` },
                    { value: "ketu", label: `H${activeAxis.ketuHouse} (Ketu)` }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSunPlacement(opt.value as any)}
                      style={{
                        padding: "4px 6px",
                        fontSize: "9.5px",
                        fontWeight: 700,
                        borderRadius: "4px",
                        border: sunPlacement === opt.value ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.08)",
                        background: sunPlacement === opt.value ? "rgba(156,122,47,0.08)" : "#ffffff",
                        color: sunPlacement === opt.value ? GOLD_DEEP : INK_SECONDARY,
                        cursor: "pointer"
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lagna Placement Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ color: GOLD_DEEP, fontWeight: 800 }}>L</span> Natal Lagna:
                </span>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[
                    { value: "none", label: "None" },
                    { value: "rahu", label: `H${activeAxis.rahuHouse} (Rāhu)` },
                    { value: "ketu", label: `H${activeAxis.ketuHouse} (Ketu)` }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setLagnaPlacement(opt.value as any)}
                      style={{
                        padding: "4px 6px",
                        fontSize: "9.5px",
                        fontWeight: 700,
                        borderRadius: "4px",
                        border: lagnaPlacement === opt.value ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.08)",
                        background: lagnaPlacement === opt.value ? "rgba(156,122,47,0.08)" : "#ffffff",
                        color: lagnaPlacement === opt.value ? GOLD_DEEP : INK_SECONDARY,
                        cursor: "pointer"
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dasha Placement Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, display: "flex", flexDirection: "column" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: RED, fontWeight: 800 }}>D</span> Daśā-lord ({runningDashaLord}):
                  </span>
                  <span style={{ fontSize: "8.5px", color: INK_MUTED, marginLeft: "10px" }}>
                    {PLANET_RULED_HOUSES[runningDashaLord]?.description}
                  </span>
                </span>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[
                    { value: "none", label: "None" },
                    { value: "rahu", label: `H${activeAxis.rahuHouse} (Rāhu)` },
                    { value: "ketu", label: `H${activeAxis.ketuHouse} (Ketu)` }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setDashaPlacement(opt.value as any)}
                      style={{
                        padding: "4px 6px",
                        fontSize: "9.5px",
                        fontWeight: 700,
                        borderRadius: "4px",
                        border: dashaPlacement === opt.value ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.08)",
                        background: dashaPlacement === opt.value ? "rgba(156,122,47,0.08)" : "#ffffff",
                        color: dashaPlacement === opt.value ? GOLD_DEEP : INK_SECONDARY,
                        cursor: "pointer"
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dasha Lord Dropdown */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed rgba(0,0,0,0.06)", paddingTop: "6px" }}>
                <span style={{ fontSize: "10.5px", color: INK_SECONDARY }}>Select Running Daśā-lord:</span>
                <select value={runningDashaLord} onChange={(e) => setRunningDashaLord(e.target.value)} style={{ padding: "4px 6px", fontSize: "10.5px", borderRadius: "4px", border: "1px solid rgba(0,0,0,0.12)", background: "#ffffff", fontWeight: 600 }}>
                  {Object.keys(PLANET_RULED_HOUSES).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

            </div>
          </div>

          {/* Detailed Synthesis text output */}
          <div style={{ background: "rgba(156,122,47,0.03)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "14px" }}>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: 800, color: GOLD_DEEP }}>{activeAxis.title}</h4>
            <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>{activeAxis.synthesis}</p>
            
            <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "10px" }}>
              <div>
                <strong style={{ fontSize: "10px", color: PURPLE }}>☊ RĀHU (H{activeAxis.rahuHouse}):</strong>
                <p style={{ margin: "3px 0 0 0", fontSize: "11px", lineHeight: "1.4", color: INK_SECONDARY }}>{activeAxis.rahuFocus}</p>
              </div>
              <div>
                <strong style={{ fontSize: "10px", color: AMBER }}>☋ KETU (H{activeAxis.ketuHouse}):</strong>
                <p style={{ margin: "3px 0 0 0", fontSize: "11px", lineHeight: "1.4", color: INK_SECONDARY }}>{activeAxis.ketuFocus}</p>
              </div>
            </div>

            {/* Dynamic Sensitive Hit Warnings */}
            {anyHit && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "10px" }}>
                <strong style={{ fontSize: "11px", color: INK_PRIMARY }}>Active Conjunction Impacts:</strong>
                
                {isMoonHit && (
                  <div style={{ background: "rgba(59,130,246,0.05)", borderLeft: `3px solid ${SLATE_BLUE}`, padding: "6px 8px", borderRadius: "4px", fontSize: "11px", color: "#1e40af", lineHeight: "1.35" }}>
                    <strong>Moon conjunct {moonPlacement === "rahu" ? "Rāhu" : "Ketu"}:</strong>{" "}
                    {moonPlacement === "rahu" 
                      ? "Intense, obsessive emotional desire in H" + activeAxis.rahuHouse + ". Spells of psychological shadow or driven ambitions."
                      : "Deep emotional detachment and apathy in H" + activeAxis.ketuHouse + ". Quiet introspection, letting go of attachment, or mood isolation."}
                  </div>
                )}

                {isSunHit && (
                  <div style={{ background: "rgba(245,158,11,0.05)", borderLeft: `3px solid ${AMBER}`, padding: "6px 8px", borderRadius: "4px", fontSize: "11px", color: "#9a3412", lineHeight: "1.35" }}>
                    <strong>Sun conjunct {sunPlacement === "rahu" ? "Rāhu" : "Ketu"}:</strong>{" "}
                    {sunPlacement === "rahu"
                      ? "High ego amplification in H" + activeAxis.rahuHouse + ". Driven focus on leadership, public projection, or authority tensions."
                      : "Ego dissolution and restructuring in H" + activeAxis.ketuHouse + ". Letting go of external validation, father/authority release."}
                  </div>
                )}

                {isLagnaHit && (
                  <div style={{ background: "rgba(156,122,47,0.05)", borderLeft: `3px solid ${GOLD_DEEP}`, padding: "6px 8px", borderRadius: "4px", fontSize: "11px", color: "#7a5e1e", lineHeight: "1.35" }}>
                    <strong>Lagna conjunct {lagnaPlacement === "rahu" ? "Rāhu" : "Ketu"}:</strong>{" "}
                    {lagnaPlacement === "rahu"
                      ? "Physical and identity transformation in H" + activeAxis.rahuHouse + ". Intense projection of self, lifestyle changes, high-drive phase."
                      : "Physical detachment and inward identity shift in H" + activeAxis.ketuHouse + ". Focus on spiritual baseline, body sensitivity, letting go of vanity."}
                  </div>
                )}

                {isDashaHit && (
                  <div style={{ background: "rgba(239,68,68,0.05)", borderLeft: `3px solid ${RED}`, padding: "6px 8px", borderRadius: "4px", fontSize: "11px", color: "#991b1b", lineHeight: "1.35" }}>
                    <strong>Daśā-lord conjunct {dashaPlacement === "rahu" ? "Rāhu" : "Ketu"}:</strong>{" "}
                    {dashaPlacement === "rahu"
                      ? "Concrete event timing activated! Nodal shadow triggers the mahādaśā/bhukti lord promise in H" + activeAxis.rahuHouse + "."
                      : "Concrete release event activated! The running timeline promise triggers letting go or completion in H" + activeAxis.ketuHouse + "."}
                  </div>
                )}

              </div>
            )}

            {/* Two-Yes Verdict */}
            <div style={{ marginTop: "10px" }}>
              {dashaMatching ? (
                <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid #bbf7d0", padding: "8px", borderRadius: "6px", display: "flex", gap: "6px", color: "#14532d", fontSize: "11px" }}>
                  <CheckCircle2 size={14} color={GREEN} />
                  <strong>Two-Yes Timing Active:</strong> Transit axis + running Vimśottari Daśā support the same theme. High event probability.
                </div>
              ) : (
                <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.08)", padding: "8px", borderRadius: "6px", display: "flex", gap: "6px", color: INK_SECONDARY, fontSize: "11px" }}>
                  <Clock size={14} color={INK_MUTED} />
                  <strong>Background Shift:</strong> Psychological-level transit. Concrete changes delayed — Daśā lord does not trigger this house-pair.
                </div>
              )}
            </div>

            <p style={{ margin: "10px 0 0 0", fontSize: "10px", fontStyle: "italic", color: INK_MUTED, display: "flex", alignItems: "center", gap: "4px" }}>
              <Info size={12} color={INK_MUTED} />
              Always read both houses of the axis. Confirm with daśā before predicting events. Themes are tendencies, not verdicts.
            </p>

          </div>

          {/* Footer source references */}
          <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
            <strong>Source:</strong> Classical gochara (nodal transits). Bṛhat Pārāśara Horā Śāstra — the nodes activate opposite bhāvas simultaneously. Special force on natal Moon (mind), Sun (ego), Lagna (body), and daśā-lord (timing trigger).
          </div>

        </div>

      </div>

    </div>
  );
}
