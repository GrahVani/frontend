"use client";

import { useState, useMemo } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const CRIMSON = "#A23A1E";
const AMBER = "#D9822B";

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
      color = GOLD;
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

  // SVG Flowchart drawing paths dynamically
  const svgFlowchart = useMemo(() => {
    const hasSupport = verdictResult.supports.length > 0;
    const hasNegation = verdictResult.negates.length > 0;

    const path1Color = hasSupport ? GOLD : HAIRLINE;
    const path2Color = hasSupport && !hasNegation ? GOLD : HAIRLINE;
    const path3Color = hasSupport && hasNegation ? GOLD : HAIRLINE;
    const path4Color = hasSupport && !hasNegation && inRPs ? GOLD : HAIRLINE;
    const path5Color = hasSupport && !hasNegation && !inRPs ? GOLD : HAIRLINE;

    return (
      <svg width="100%" height="265" viewBox="0 0 400 265" style={{ display: "block" }}>
        {/* Node 1: Start */}
        <rect x="150" y="10" width="100" height="30" rx="6" fill={SURFACE} stroke={GOLD} strokeWidth="1.5" />
        <text x="200" y="29" textAnchor="middle" fontSize="10" fill={INK_PRIMARY} fontWeight="bold">1. Cuspal Sub-Lord</text>

        {/* Path 1: Start to support check */}
        <line x1="200" y1="40" x2="200" y2="65" stroke={GOLD} strokeWidth="1.5" />
        
        {/* Node 2: Support check */}
        <polygon points="200,65 255,90 200,115 145,90" fill={SURFACE} stroke={path1Color} strokeWidth="1.5" />
        <text x="200" y="93" textAnchor="middle" fontSize="8.5" fill={INK_PRIMARY} fontWeight="bold">Signifies Support?</text>

        {/* Left Branch: No support -> NO */}
        <line x1="145" y1="90" x2="80" y2="90" stroke={!hasSupport ? GOLD : HAIRLINE} strokeWidth="1.5" />
        <line x1="80" y1="90" x2="80" y2="160" stroke={!hasSupport ? GOLD : HAIRLINE} strokeWidth="1.5" />
        <rect x="30" y="160" width="100" height="30" rx="6" fill={SURFACE} stroke={!hasSupport ? CRIMSON : HAIRLINE} strokeWidth="2" />
        <text x="80" y="179" textAnchor="middle" fontSize="11" fill={!hasSupport ? CRIMSON : INK_MUTED} fontWeight="bold">NO VERDICT</text>

        {/* Right branch: Yes support -> Negation Check */}
        <line x1="255" y1="90" x2="320" y2="90" stroke={path1Color} strokeWidth="1.5" />
        <line x1="320" y1="90" x2="320" y2="105" stroke={path1Color} strokeWidth="1.5" />

        {/* Node 3: Negation check */}
        <polygon points="320,105 365,125 320,145 275,125" fill={SURFACE} stroke={path1Color} strokeWidth="1.5" />
        <text x="320" y="128" textAnchor="middle" fontSize="8" fill={INK_PRIMARY} fontWeight="bold">Negation?</text>

        {/* Branch 3a: Negation Yes -> Conditional */}
        <line x1="275" y1="125" x2="230" y2="125" stroke={path3Color} strokeWidth="1.5" />
        <line x1="230" y1="125" x2="230" y2="160" stroke={path3Color} strokeWidth="1.5" />
        <rect x="180" y="160" width="100" height="30" rx="6" fill={SURFACE} stroke={path3Color === GOLD ? AMBER : HAIRLINE} strokeWidth="2" />
        <text x="230" y="179" textAnchor="middle" fontSize="10" fill={path3Color === GOLD ? AMBER : INK_MUTED} fontWeight="bold">CONDITIONAL</text>

        {/* Branch 3b: Negation No -> RP check */}
        <line x1="320" y1="145" x2="320" y2="165" stroke={path2Color} strokeWidth="1.5" />
        
        {/* Node 4: RP alignment */}
        <polygon points="320,165 365,185 320,205 275,185" fill={SURFACE} stroke={path2Color} strokeWidth="1.5" />
        <text x="320" y="188" textAnchor="middle" fontSize="8" fill={INK_PRIMARY} fontWeight="bold">RP Match?</text>

        {/* Branch 4a: RP Match -> YES */}
        <line x1="320" y1="205" x2="320" y2="225" stroke={path4Color} strokeWidth="1.5" />
        <rect x="270" y="225" width="100" height="30" rx="6" fill={SURFACE} stroke={path4Color === GOLD ? GOLD : HAIRLINE} strokeWidth="2" />
        <text x="320" y="244" textAnchor="middle" fontSize="11" fill={path4Color === GOLD ? GOLD : INK_MUTED} fontWeight="bold">YES VERDICT</text>
        
        {/* Branch 4b: RP No -> Conditional */}
        <line x1="275" y1="185" x2="230" y2="185" stroke={path5Color} strokeWidth="1.5" />
        <line x1="230" y1="185" x2="230" y2="190" stroke={path5Color} strokeWidth="1.5" />
      </svg>
    );
  }, [verdictResult, inRPs]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", color: INK_PRIMARY }} data-interactive="kp-horary-cuspal-verdict">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 7 · Lesson 3</span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.5rem", fontWeight: 700 }}>The Cuspal Sub-Lord Yes/No Verdict Engine</h1>
      </section>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left Panel: Configurations */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Query Config */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <h2 style={{ fontSize: "1rem", color: GOLD, margin: "0 0 12px" }}>1. Setup Query Matter</h2>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "0.8rem", color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>Select Matter Category</label>
              <select
                value={activeMatterKey}
                onChange={(e) => setActiveMatterKey(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY, fontWeight: 700 }}
              >
                {Object.keys(MATTERS).map((key) => (
                  <option key={key} value={key}>{MATTERS[key].name}</option>
                ))}
              </select>
            </div>

            {/* Matter House Sets */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem", marginTop: "12px" }}>
              <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 6, padding: "8px", background: `${GOLD}06` }}>
                <strong style={{ color: GOLD, fontSize: "0.76rem", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Supporting Houses:</strong>
                <span style={{ fontWeight: 700 }}>{activeMatter.supporting.map(h => `House ${h}`).join(", ")}</span>
              </div>
              <div style={{ border: `1px solid ${CRIMSON}44`, borderRadius: 6, padding: "8px", background: `${CRIMSON}06` }}>
                <strong style={{ color: CRIMSON, fontSize: "0.76rem", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Negating Houses:</strong>
                <span style={{ fontWeight: 700 }}>{activeMatter.negating.map(h => `House ${h}`).join(", ")}</span>
              </div>
            </div>
          </div>

          {/* Sub Lord Signification Checkbox Array */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <h2 style={{ fontSize: "1rem", color: GOLD, margin: "0 0 12px" }}>2. Cuspal Sub-Lord Significations ({selectedSubLord})</h2>
            
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
                <label style={{ fontSize: "0.8rem", color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>Ruling Planet Alignment</label>
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
                  borderCol = isSupporting ? GOLD : (isNegating ? CRIMSON : INK_PRIMARY);
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
                        ? (isSupporting ? `${GOLD}22` : (isNegating ? `${CRIMSON}22` : `${INK_MUTED}22`))
                        : "transparent",
                      color: isSelected ? INK_PRIMARY : INK_MUTED,
                      fontWeight: isSelected ? 800 : 500,
                      cursor: "pointer",
                      fontSize: "0.78rem"
                    }}
                  >
                    H{h}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Panel: Decision SVG and Verdict Display */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ fontSize: "1rem", color: GOLD, margin: "0" }}>3. Astrological Verdict</h2>

          {/* SVG Flow diagram */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "8px", background: "rgba(0,0,0,0.01)" }}>
            {svgFlowchart}
          </div>

          {/* Verdict Output Card */}
          <div style={{
            border: `2px solid ${verdictResult.color}`,
            borderRadius: 8,
            padding: "16px",
            background: `${verdictResult.color}11`,
            textAlign: "center"
          }}>
            <span style={{ fontSize: "0.78rem", textTransform: "uppercase", color: INK_SECONDARY, fontWeight: 900 }}>Final Verdict</span>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: verdictResult.color, margin: "4px 0" }}>
              {verdictResult.verdict}
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.4, color: INK_PRIMARY }}>
              {verdictResult.desc}
            </p>
          </div>

        </div>

      </div>

      {/* Summary table (replaces raw logs) */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, marginTop: "24px" }}>
        <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 10px" }}>Verdict Parameters Checklist</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
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
              <td style={{ padding: "6px" }}>{verdictResult.supports.length > 0 ? `Yes (${verdictResult.supports.map(h => `H${h}`).join(", ")})` : "None"}</td>
              <td style={{ padding: "6px" }}>Required to establish the positive promise (YES).</td>
            </tr>
            <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
              <td style={{ padding: "6px", fontWeight: 700 }}>Negating Significations</td>
              <td style={{ padding: "6px" }}>{verdictResult.negates.length > 0 ? `Yes (${verdictResult.negates.map(h => `H${h}`).join(", ")})` : "None"}</td>
              <td style={{ padding: "6px" }}>If present, overrides or delays the positive outcome.</td>
            </tr>
            <tr>
              <td style={{ padding: "6px", fontWeight: 700 }}>Ruling Planet Match</td>
              <td style={{ padding: "6px" }}>{inRPs ? "Aligned" : "Absent"}</td>
              <td style={{ padding: "6px" }}>Cross-check corroborating the timed event promise.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
