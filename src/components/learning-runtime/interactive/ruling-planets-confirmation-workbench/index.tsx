"use client";

import { useState, useMemo } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const EMERALD = "#10B981";
const ORANGE = "#E67E22";
const CRIMSON = "#C8412E";

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const CUSPS = Array.from({ length: 12 }, (_, i) => i + 1);

interface Presets {
  name: string;
  rps: string[];
  cusp: number;
  subLord: string;
  starLord: string;
  queryType: "marriage" | "career" | "custom";
  signifierHouses: number[];
  dasa: string;
  bhukti: string;
  antara: string;
}

const PRESETS: Presets[] = [
  {
    name: "Worked Example 1 (Marriage Confirmation - Confirmed!)",
    rps: ["Mercury", "Rahu", "Mars", "Jupiter"],
    cusp: 7,
    subLord: "Mercury",
    starLord: "Mars",
    queryType: "marriage",
    signifierHouses: [2, 7, 11],
    dasa: "Jupiter",
    bhukti: "Mercury",
    antara: "Saturn"
  },
  {
    name: "Example 2 (Timing Window Convergence - High Match!)",
    rps: ["Jupiter", "Venus", "Moon", "Saturn"],
    cusp: 10,
    subLord: "Venus",
    starLord: "Moon",
    queryType: "career",
    signifierHouses: [2, 6, 10, 11],
    dasa: "Jupiter",
    bhukti: "Venus",
    antara: "Moon"
  }
];

export function RulingPlanetsConfirmationWorkbench() {
  // RPs manual checklist state
  const [activeRps, setActiveRps] = useState<string[]>(["Mercury", "Rahu", "Mars", "Jupiter"]);

  // Cuspal Sub-lord configurations
  const [targetCusp, setTargetCusp] = useState(7);
  const [cuspSubLord, setCuspSubLord] = useState("Mercury");
  const [subStarLord, setSubStarLord] = useState("Mars");
  const [queryType, setQueryType] = useState<"marriage" | "career" | "custom">("marriage");
  const [customHouses, setCustomHouses] = useState("2,7,11");

  // Vimshottari DBA lords state
  const [dasaLord, setDasaLord] = useState("Jupiter");
  const [bhuktiLord, setBhuktiLord] = useState("Mercury");
  const [antaraLord, setAntaraLord] = useState("Saturn");

  const loadPreset = (p: Presets) => {
    setActiveRps(p.rps);
    setTargetCusp(p.cusp);
    setCuspSubLord(p.subLord);
    setSubStarLord(p.starLord);
    setQueryType(p.queryType);
    setDasaLord(p.dasa);
    setBhuktiLord(p.bhukti);
    setAntaraLord(p.antara);
    if (p.queryType === "marriage") setCustomHouses("2,7,11");
    else if (p.queryType === "career") setCustomHouses("2,6,10,11");
  };

  const toggleRp = (p: string) => {
    setActiveRps((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  // Expected houses based on query
  const queryHouses = useMemo(() => {
    if (queryType === "marriage") return [2, 7, 11];
    if (queryType === "career") return [2, 6, 10, 11];
    return customHouses.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
  }, [queryType, customHouses]);

  // Compute Confirmation metrics
  const confirmationResult = useMemo(() => {
    const subLordInRps = activeRps.includes(cuspSubLord);
    const starLordInRps = activeRps.includes(subStarLord);

    let level: "high" | "moderate" | "none" = "none";
    let message = "";
    let percent = 0;

    if (subLordInRps && starLordInRps) {
      level = "high";
      message = `Strong Confirmation: Both Cuspal Sub-Lord (${cuspSubLord}) and its Star-Lord (${subStarLord}) reside in the Ruling Planets set.`;
      percent = 100;
    } else if (subLordInRps || starLordInRps) {
      level = "moderate";
      message = `Moderate Confirmation: Either the Sub-Lord (${cuspSubLord}) or its Star-Lord (${subStarLord}) resides in the RPs.`;
      percent = 50;
    } else {
      level = "none";
      message = `Confirmation Absent: Neither the Cuspal Sub-Lord (${cuspSubLord}) nor its Star-Lord (${subStarLord}) is in the RPs.`;
      percent = 0;
    }

    return {
      subLordInRps,
      starLordInRps,
      level,
      message,
      percent,
    };
  }, [activeRps, cuspSubLord, subStarLord]);

  // Compute Vimshottari DBA lords match count
  const dbaMatches = useMemo(() => {
    const dMatch = activeRps.includes(dasaLord);
    const bMatch = activeRps.includes(bhuktiLord);
    const aMatch = activeRps.includes(antaraLord);
    
    let count = 0;
    if (dMatch) count++;
    if (bMatch) count++;
    if (aMatch) count++;

    return {
      dMatch,
      bMatch,
      aMatch,
      count,
    };
  }, [activeRps, dasaLord, bhuktiLord, antaraLord]);

  // SVG Radial arc computation (gauge)
  const strokeDashoffset = useMemo(() => {
    const r = 40;
    const circ = 2 * Math.PI * r;
    const angleRange = 270; // 3/4 circle
    const activeLength = (confirmationResult.percent / 100) * angleRange;
    const strokeLength = (activeLength / 360) * circ;
    return circ - strokeLength;
  }, [confirmationResult.percent]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "28px 24px", color: INK_PRIMARY, minHeight: "600px" }} data-interactive="ruling-planets-confirmation-workbench">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1.2rem", marginBottom: "1.8rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 5 · Lesson 3</span>
        <h1 style={{ margin: "0.3rem 0 0", color: GOLD, fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Ruling Planets Confirmation Workbench</h1>
        <p style={{ margin: "0.4rem 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5" }}>
          Verify cuspal sub-lord indicators against current active RPs, and identify convergence windows for Vimśottarī DBA periods.
        </p>
      </section>

      {/* Presets */}
      <section style={{ marginBottom: "1.8rem", display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 800, color: INK_SECONDARY, textTransform: "uppercase", letterSpacing: "0.05em" }}>Load Case Preset:</span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => loadPreset(p)}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              border: `1px solid ${HAIRLINE}`,
              background: "transparent",
              color: GOLD,
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = `${GOLD}10`}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            {p.name.split(" (")[0]}
          </button>
        ))}
      </section>

      {/* Grid containing Cockpits */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "2.4rem" }}>
        
        {/* Panel 1: RPs checklist */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Ruling Planets Roster</h3>
          <p style={{ fontSize: "10.5px", color: INK_MUTED, margin: "0 0 12px 0" }}>
            Select the active Ruling Planets computed for this moment of inquiry.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {PLANETS.map((p) => {
              const isActive = activeRps.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => toggleRp(p)}
                  style={{
                    padding: "8px 2px",
                    borderRadius: "6px",
                    border: `1px solid ${isActive ? GOLD : HAIRLINE}`,
                    background: isActive ? `${GOLD}10` : "transparent",
                    color: isActive ? GOLD : INK_PRIMARY,
                    fontSize: "11.5px",
                    fontWeight: isActive ? 800 : 500,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = `${GOLD}05`;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: "11px", color: GOLD, marginTop: "12px", fontWeight: 700 }}>
            Active: {activeRps.join(", ") || "(None)"}
          </div>
        </div>

        {/* Panel 2: Cusp Sub-lord settings */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Cuspal Verdict & Query</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "11.5px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Target Cusp</span>
                <select
                  value={targetCusp}
                  onChange={(e) => setTargetCusp(Number(e.target.value))}
                  style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px" }}
                >
                  {CUSPS.map((c) => (
                    <option key={c} value={c}>Cusp {c}</option>
                  ))}
                </select>
              </label>

              <label style={{ flex: 1.5, display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Query Category</span>
                <select
                  value={queryType}
                  onChange={(e) => setQueryType(e.target.value as any)}
                  style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px" }}
                >
                  <option value="marriage">Marriage (2,7,11)</option>
                  <option value="career">Career (2,6,10,11)</option>
                  <option value="custom">Custom Houses</option>
                </select>
              </label>
            </div>

            {queryType === "custom" && (
              <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Custom Target Houses (comma-separated)</span>
                <input
                  type="text"
                  value={customHouses}
                  onChange={(e) => setCustomHouses(e.target.value)}
                  style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px" }}
                />
              </label>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Cusp Sub-Lord</span>
                <select
                  value={cuspSubLord}
                  onChange={(e) => setCuspSubLord(e.target.value)}
                  style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px" }}
                >
                  {PLANETS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>

              <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Sub Star-Lord</span>
                <select
                  value={subStarLord}
                  onChange={(e) => setSubStarLord(e.target.value)}
                  style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px" }}
                >
                  {PLANETS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* Panel 3: Vimshottari DBA Period Lords */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Vimśottarī DBA Lords</h3>
          <p style={{ fontSize: "10.5px", color: INK_MUTED, margin: "0 0 12px 0" }}>
            Identify the nested period rulers currently active in the Vimśottarī timeline.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "11.5px" }}>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Daśā Lord:</span>
              <select
                value={dasaLord}
                onChange={(e) => setDasaLord(e.target.value)}
                style={{ width: "110px", padding: "5px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "11.5px" }}
              >
                {PLANETS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Bhukti Lord:</span>
              <select
                value={bhuktiLord}
                onChange={(e) => setBhuktiLord(e.target.value)}
                style={{ width: "110px", padding: "5px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "11.5px" }}
              >
                {PLANETS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Antara Lord:</span>
              <select
                value={antaraLord}
                onChange={(e) => setAntaraLord(e.target.value)}
                style={{ width: "110px", padding: "5px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "11.5px" }}
              >
                {PLANETS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

      </div>

      {/* Outputs: Confirmation Panel & Convergence Analyzer */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", marginBottom: "2.4rem" }}>
        
        {/* Output Panel 1: Cusp Confirmation & SVG Gauge */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          
          <div>
            <h3 style={{ margin: "0 0 14px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Cuspal Verdict Confirmation
            </h3>
            
            {/* Radial SVG Gauge and Status block */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
              <svg width="88" height="88" viewBox="0 0 100 100" style={{ transform: "rotate(-135deg)" }}>
                {/* Background arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={HAIRLINE}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="62.8" // 3/4 circle
                  strokeLinecap="round"
                />
                {/* Active indicator arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={confirmationResult.level === "high" ? EMERALD : confirmationResult.level === "moderate" ? ORANGE : CRIMSON}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.35s ease-out" }}
                />
              </svg>
              
              <div>
                <span style={{ fontSize: "10px", color: INK_MUTED, textTransform: "uppercase", fontWeight: 700 }}>Confirmation Strength</span>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 900,
                  color: confirmationResult.level === "high" ? EMERALD : confirmationResult.level === "moderate" ? ORANGE : CRIMSON,
                  marginTop: "2px"
                }}>
                  {confirmationResult.level === "high" && "✓ HIGH (100%)"}
                  {confirmationResult.level === "moderate" && "✓ MODERATE (50%)"}
                  {confirmationResult.level === "none" && "✗ ABSENT (0%)"}
                </div>
              </div>
            </div>

            <div style={{ fontSize: "12px", color: INK_SECONDARY, marginBottom: "16px", lineHeight: "1.4" }}>
              {confirmationResult.message}
            </div>
          </div>

          <div style={{
            fontSize: "10.5px",
            color: GOLD,
            background: `${GOLD}0A`,
            border: `1px solid ${GOLD}20`,
            borderRadius: "6px",
            padding: "10px",
            fontStyle: "italic",
            lineHeight: "1.4"
          }}>
            <strong>RP Rule:</strong> RPs confirm or deny confidence in a verdict, but never override it. If a cusp sub-lord promises NO, active RPs cannot change the outcome to YES.
          </div>
        </div>

        {/* Output Panel 2: Nested Vimshottari DBA Convergence Cascade */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 14px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Event Timing Convergence Cascade
          </h3>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>DBA RPs Match Coefficient:</span>
            <strong style={{
              fontSize: "13px",
              color: dbaMatches.count === 3 ? EMERALD : dbaMatches.count === 2 ? ORANGE : dbaMatches.count === 1 ? GOLD : CRIMSON
            }}>
              {dbaMatches.count} of 3 ({dbaMatches.count === 3 ? "Peak Window" : dbaMatches.count === 2 ? "Strong Window" : dbaMatches.count === 1 ? "Weak Agreement" : "No Match"})
            </strong>
          </div>

          {/* Indented cascade layout */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
            
            {/* Dasa Level */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAF8F5", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "8px 12px" }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Daśā Level</span>
                <strong>{dasaLord}</strong>
              </div>
              <span style={{
                fontSize: "10px",
                fontWeight: 800,
                color: dbaMatches.dMatch ? EMERALD : CRIMSON
              }}>
                {dbaMatches.dMatch ? "RP Match ✓" : "No Match ✗"}
              </span>
            </div>

            {/* Bhukti Level */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAF8F5", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "8px 12px", marginLeft: "14px" }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Bhukti Level</span>
                <strong>{bhuktiLord}</strong>
              </div>
              <span style={{
                fontSize: "10px",
                fontWeight: 800,
                color: dbaMatches.bMatch ? EMERALD : CRIMSON
              }}>
                {dbaMatches.bMatch ? "RP Match ✓" : "No Match ✗"}
              </span>
            </div>

            {/* Antara Level */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAF8F5", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "8px 12px", marginLeft: "28px" }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Antarā Level</span>
                <strong>{antaraLord}</strong>
              </div>
              <span style={{
                fontSize: "10px",
                fontWeight: 800,
                color: dbaMatches.aMatch ? EMERALD : CRIMSON
              }}>
                {dbaMatches.aMatch ? "RP Match ✓" : "No Match ✗"}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Computational Parameters Table (Replacing VIX JSON Console) */}
      <section style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "1.6rem" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "12px", color: INK_SECONDARY, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Astronomical & Query Parameters Table
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", color: INK_PRIMARY }}>
          <thead>
            <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
              <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 800 }}>Computational Variable</th>
              <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 800 }}>Numeric Value</th>
              <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 800 }}>Stellar Engine Context</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Krishnamurti Ayanāṁśa</td>
              <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>24°06′42″</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Precession subtraction alignment constant</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Target Query Houses</td>
              <td style={{ padding: "8px 12px" }}>{queryHouses.join(", ") || "(none)"}</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Houses checked for verification confirmation</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Sub-Lord RP Agreement</td>
              <td style={{ padding: "8px 12px" }}>{confirmationResult.subLordInRps ? "1 (True)" : "0 (False)"}</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Indicates whether the cusp sub-lord is present in the RP set</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Star-Lord RP Agreement</td>
              <td style={{ padding: "8px 12px" }}>{confirmationResult.starLordInRps ? "1 (True)" : "0 (False)"}</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Indicates whether the sub-lord's star-lord is present in the RP set</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>DBA RPs Match Count</td>
              <td style={{ padding: "8px 12px" }}>{dbaMatches.count} of 3</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Vimśottarī DBA convergence coefficients</td>
            </tr>
          </tbody>
        </table>
      </section>

    </div>
  );
}
