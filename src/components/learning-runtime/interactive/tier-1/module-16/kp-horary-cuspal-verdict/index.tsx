"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Info, Sparkles, Zap, RotateCcw, HelpCircle, Layers, CheckCircle2, ShieldCheck, Filter, AlertTriangle } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const EMERALD = "#2F7D55";
const AMBER = "#D9822B";
const CRIMSON = "#A23A1E";

interface MatterConfig {
  name: string;
  queryHouse: number;
  supporting: number[];
  negating: number[];
}

const MATTERS: Record<string, MatterConfig> = {
  marriage: { name: "Marriage", queryHouse: 7, supporting: [2, 7, 11], negating: [1, 6, 10] },
  job: { name: "Job / Career", queryHouse: 10, supporting: [6, 10, 11], negating: [5, 9, 12] },
  childbirth: { name: "Childbirth", queryHouse: 5, supporting: [2, 5, 11], negating: [1, 4, 10] },
  loan: { name: "Loan Approval", queryHouse: 6, supporting: [6, 11, 2], negating: [5, 8, 12] },
  recovery: { name: "Recovery from Illness", queryHouse: 1, supporting: [1, 5, 11], negating: [6, 8, 12] }
};

export function KpHoraryCuspalVerdict() {
  const [activeMatterKey, setActiveMatterKey] = useState<string>("marriage");
  const [selectedSubLord, setSelectedSubLord] = useState<string>("Venus");
  const [signifiedHouses, setSignifiedHouses] = useState<number[]>([2, 11]);
  const [inRPs, setInRPs] = useState<boolean>(true);

  const activeMatter = MATTERS[activeMatterKey];

  const handleHouseToggle = (h: number) => {
    if (signifiedHouses.includes(h)) {
      setSignifiedHouses(signifiedHouses.filter((x) => x !== h));
    } else {
      setSignifiedHouses([...signifiedHouses, h]);
    }
  };

  // Run KP Horary Verdict logic
  const verdictResult = useMemo(() => {
    const supports = signifiedHouses.filter((h) => activeMatter.supporting.includes(h));
    const negates = signifiedHouses.filter((h) => activeMatter.negating.includes(h));

    const hasSupport = supports.length > 0;
    const hasNegation = negates.length > 0;

    let verdict: "YES" | "NO" | "CONDITIONAL" = "NO";
    let color = CRIMSON;
    let desc = "";

    if (hasSupport && !hasNegation && inRPs) {
      verdict = "YES";
      color = EMERALD;
      desc = `${selectedSubLord} signifies supporting houses (${supports.join(", ")}) cleanly and aligns with the Ruling Planets. The query resolves affirmatively.`;
    } else if (hasSupport && hasNegation) {
      verdict = "CONDITIONAL";
      color = AMBER;
      desc = `${selectedSubLord} signifies both supporting (${supports.join(", ")}) and negating (${negates.join(", ")}) houses. The matter occurs with delay, obstacles, or specific conditions.`;
    } else if (hasSupport && !inRPs) {
      verdict = "CONDITIONAL";
      color = AMBER;
      desc = `${selectedSubLord} signifies supporting houses, but lacks corroboration from the moment's Ruling Planets. Verdict is qualified.`;
    } else {
      verdict = "NO";
      color = CRIMSON;
      desc = `${selectedSubLord} does not signify sufficient supporting houses or is dominated by negating houses (${negates.join(", ") || "none"}). Union/event does not fructify.`;
    }

    return { verdict, color, desc, supports, negates };
  }, [activeMatter, selectedSubLord, signifiedHouses, inRPs]);

  // Gauge needle rotation angle: YES (60deg), CONDITIONAL (0deg), NO (-60deg)
  const needleAngle = useMemo(() => {
    if (verdictResult.verdict === "YES") return 60;
    if (verdictResult.verdict === "CONDITIONAL") return 0;
    return -60;
  }, [verdictResult.verdict]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", color: INK_PRIMARY }} data-interactive="kp-horary-cuspal-verdict">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 7 · Lesson 3</span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.5rem", fontWeight: 700 }}>The Horary Verdict Gauge Console</h1>
      </section>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gap: "24px", alignItems: "start" }} className="grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Panel: Configurations */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Query Config */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <h2 style={{ fontSize: "1rem", color: GOLD, margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 800 }}>
              <Layers size={16} /> 1. Setup Query Matter
            </h2>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "0.8rem", color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>Select Matter Category</label>
              <select
                value={activeMatterKey}
                onChange={(e) => {
                  const m = MATTERS[e.target.value];
                  setActiveMatterKey(e.target.value);
                  // Auto toggle active houses based on new matter default
                  setSignifiedHouses([m.supporting[0]]);
                }}
                style={{ width: "100%", padding: "8px 10px", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY, fontWeight: 700 }}
              >
                {Object.keys(MATTERS).map((key) => (
                  <option key={key} value={key}>{MATTERS[key].name}</option>
                ))}
              </select>
            </div>

            {/* Matter House Sets */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem", marginTop: "12px" }}>
              <div style={{ border: `1.2px solid ${GOLD}40`, borderRadius: 6, padding: "8px", background: `${GOLD}06` }}>
                <strong style={{ color: GOLD, fontSize: "0.76rem", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Supporting Houses:</strong>
                <span style={{ fontWeight: 700 }}>{activeMatter.supporting.map(h => `House ${h}`).join(", ")}</span>
              </div>
              <div style={{ border: `1.2px solid ${CRIMSON}40`, borderRadius: 6, padding: "8px", background: `${CRIMSON}06` }}>
                <strong style={{ color: CRIMSON, fontSize: "0.76rem", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Negating Houses:</strong>
                <span style={{ fontWeight: 700 }}>{activeMatter.negating.map(h => `House ${h}`).join(", ")}</span>
              </div>
            </div>
          </div>

          {/* Sub Lord Signification Checkbox Array */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <h2 style={{ fontSize: "1rem", color: GOLD, margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 800 }}>
              <Filter size={16} /> 2. Cuspal Sub-Lord Significations
            </h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>Sub-Lord Planet</label>
                <select
                  value={selectedSubLord}
                  onChange={(e) => setSelectedSubLord(e.target.value)}
                  style={{ width: "100%", padding: "6px 10px", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY }}
                >
                  {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>RP Alignment</label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", height: "32px", cursor: "pointer", fontSize: "0.88rem" }}>
                  <input
                    type="checkbox"
                    checked={inRPs}
                    onChange={(e) => setInRPs(e.target.checked)}
                    style={{ accentColor: GOLD }}
                  />
                  Is present in RPs
                </label>
              </div>
            </div>

            <label style={{ fontSize: "0.8rem", color: INK_SECONDARY, display: "block", marginBottom: "6px" }}>Select houses signified by {selectedSubLord}:</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px" }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                const isSelected = signifiedHouses.includes(h);
                const isSupporting = activeMatter.supporting.includes(h);
                const isNegating = activeMatter.negating.includes(h);
                
                let borderCol = HAIRLINE;
                if (isSelected) {
                  borderCol = isSupporting ? EMERALD : (isNegating ? CRIMSON : GOLD);
                }
                
                return (
                  <button
                    key={h}
                    onClick={() => handleHouseToggle(h)}
                    style={{
                      height: "32px",
                      borderRadius: 6,
                      border: `1.5px solid ${borderCol}`,
                      background: isSelected 
                        ? (isSupporting ? `${EMERALD}15` : (isNegating ? `${CRIMSON}15` : `${GOLD}15`))
                        : "transparent",
                      color: isSelected ? INK_PRIMARY : INK_MUTED,
                      fontWeight: isSelected ? 800 : 500,
                      cursor: "pointer",
                      fontSize: "0.78rem"
                    }}
                    className="gl-clickable"
                  >
                    H{h}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Panel: The Horary Verdict Gauge (SVG) */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          <h2 style={{ fontSize: "1rem", color: GOLD, margin: "0", alignSelf: "flex-start", fontWeight: 800 }}>3. Horary Verdict Gauge</h2>

          {/* Premium SVG Gauge */}
          <div style={{ position: "relative", width: "100%", maxWidth: "260px", aspectRatio: "1.3/1" }}>
            <svg width="100%" height="100%" viewBox="-120 -100 240 180" style={{ overflow: "visible" }}>
              {/* Gauge arcs */}
              {/* NO zone (Red) */}
              <path d="M -90 -10 A 90 90 0 0 1 -45 -78" fill="none" stroke={CRIMSON} strokeWidth="12" strokeLinecap="round" />
              {/* CONDITIONAL zone (Amber) */}
              <path d="M -42 -80 A 90 90 0 0 1 42 -80" fill="none" stroke={AMBER} strokeWidth="12" />
              {/* YES zone (Green) */}
              <path d="M 45 -78 A 90 90 0 0 1 90 -10" fill="none" stroke={EMERALD} strokeWidth="12" strokeLinecap="round" />

              {/* Labels on arcs */}
              <text x="-65" y="-35" textAnchor="middle" fill={CRIMSON} fontSize="8.5" fontWeight="800">NO</text>
              <text x="0" y="-95" textAnchor="middle" fill={AMBER} fontSize="8.5" fontWeight="800">CONDITIONAL</text>
              <text x="65" y="-35" textAnchor="middle" fill={EMERALD} fontSize="8.5" fontWeight="800">YES</text>

              {/* Central Needle cap */}
              <circle cx="0" cy="0" r="14" fill="#333" stroke="#FFF" strokeWidth="2.5" />

              {/* The Sweeping Needle */}
              <motion.g
                animate={{ rotate: needleAngle }}
                transition={{ type: "spring", stiffness: 60, damping: 10 }}
                style={{ originX: 0, originY: 0 }}
              >
                {/* Draw needle pointing straight UP (which is rotated by needleAngle) */}
                <line x1="0" y1="0" x2="0" y2="-75" stroke="#333" strokeWidth="3" strokeLinecap="round" />
                <polygon points="-4,0 4,0 0,-75" fill="#333" />
                <circle cx="0" cy="-60" r="3.5" fill={verdictResult.color} />
              </motion.g>
            </svg>
          </div>

          {/* Verdict Card */}
          <div style={{
            width: "100%",
            border: `2px solid ${verdictResult.color}`,
            borderRadius: 8,
            padding: "12px 16px",
            background: `${verdictResult.color}06`,
            textAlign: "center",
            marginTop: "6px"
          }}>
            <span style={{ fontSize: "10px", textTransform: "uppercase", color: INK_MUTED, fontWeight: 900, letterSpacing: "0.05em" }}>Cuspal Sub-Lord Verdict</span>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, color: verdictResult.color, margin: "4px 0" }}>
              {verdictResult.verdict === "YES" && "YES (AUSPICIOUS)"}
              {verdictResult.verdict === "CONDITIONAL" && "CONDITIONAL / DELAY"}
              {verdictResult.verdict === "NO" && "NO / OBSTRUCTED"}
            </div>
            <p style={{ margin: 0, fontSize: "12.5px", lineHeight: 1.45, color: INK_SECONDARY }}>
              {verdictResult.desc}
            </p>
          </div>

        </div>

      </div>

      {/* Summary table */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, marginTop: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
          <ShieldCheck size={16} style={{ color: GOLD }} />
          <h3 style={{ fontSize: "12px", color: GOLD, margin: "0", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Verdict Parameters Checklist</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}`, color: GOLD }}>
              <th style={{ textAlign: "left", padding: "6px" }}>Variable</th>
              <th style={{ textAlign: "left", padding: "6px" }}>Status / Value</th>
              <th style={{ textAlign: "left", padding: "6px" }}>Astrological Check</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
              <td style={{ padding: "6px", fontWeight: 700 }}>Active Cusp & Lord</td>
              <td style={{ padding: "6px" }}>House {activeMatter.queryHouse} sub-lord: {selectedSubLord}</td>
              <td style={{ padding: "6px" }}>Primary decider of the {activeMatter.name} matter.</td>
            </tr>
            <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
              <td style={{ padding: "6px", fontWeight: 700 }}>Supporting Significations</td>
              <td style={{ padding: "6px", color: EMERALD, fontWeight: 700 }}>
                {verdictResult.supports.length > 0 ? `Yes (${verdictResult.supports.map(h => `H${h}`).join(", ")})` : "None"}
              </td>
              <td style={{ padding: "6px" }}>Required to establish the positive promise (YES).</td>
            </tr>
            <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
              <td style={{ padding: "6px", fontWeight: 700 }}>Negating Significations</td>
              <td style={{ padding: "6px", color: CRIMSON, fontWeight: 700 }}>
                {verdictResult.negates.length > 0 ? `Yes (${verdictResult.negates.map(h => `H${h}`).join(", ")})` : "None"}
              </td>
              <td style={{ padding: "6px" }}>If present, overrides or delays the positive outcome.</td>
            </tr>
            <tr>
              <td style={{ padding: "6px", fontWeight: 700 }}>Ruling Planet Match</td>
              <td style={{ padding: "6px", color: inRPs ? EMERALD : AMBER, fontWeight: 700 }}>
                {inRPs ? "Aligned" : "Absent"}
              </td>
              <td style={{ padding: "6px" }}>Cross-check corroborating the timed event promise.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
