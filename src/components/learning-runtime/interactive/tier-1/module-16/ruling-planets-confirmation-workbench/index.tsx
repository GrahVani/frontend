"use client";

import { useState, useMemo } from "react";
import { Check, Info, Sparkles, Zap, RotateCcw, HelpCircle, Layers, CheckCircle2, ShieldCheck, Filter, Clock } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "#F4C77B";
const EMERALD = "#2F7D55";
const ORANGE = "#C28220";
const CRIMSON = "#A23A1E";

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

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "28px 24px", color: INK_PRIMARY, minHeight: "600px" }} data-interactive="ruling-planets-confirmation-workbench">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1.2rem", marginBottom: "1.8rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 5 · Lesson 3</span>
            <h1 style={{ margin: "0.3rem 0 0", color: GOLD, fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Ruling Planets Active Filter Cockpit</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveRps(["Mercury", "Rahu", "Mars", "Jupiter"]);
              setTargetCusp(7);
              setCuspSubLord("Mercury");
              setSubStarLord("Mars");
              setQueryType("marriage");
              setDasaLord("Jupiter");
              setBhuktiLord("Mercury");
              setAntaraLord("Saturn");
              setCustomHouses("2,7,11");
            }}
            style={{
              background: "transparent",
              border: `1.2px solid ${HAIRLINE}`,
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "12px",
              fontWeight: 700,
              color: GOLD,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
        <p style={{ margin: "0.4rem 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5" }}>
          Verify Cuspal Sub-lord configuration against momental RPs, and filter DBA periods to identify timing convergence.
        </p>
      </section>

      {/* Presets */}
      <section style={{ marginBottom: "1.8rem", display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "11.5px", fontWeight: 800, color: INK_SECONDARY, textTransform: "uppercase", letterSpacing: "0.05em" }}>Load Case Preset:</span>
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

      {/* THREE COLUMN COCKPIT CONTROLS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        
        {/* Panel 1: RPs checklist */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <Filter size={15} style={{ color: GOLD }} />
            <h3 style={{ margin: "0", fontSize: "12.5px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Momental RPs Console</h3>
          </div>
          <p style={{ fontSize: "11px", color: INK_MUTED, margin: "0 0 12px 0", lineHeight: 1.4 }}>
            Click to set the 5 momental RPs computed for the query execution time.
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
                    background: isActive ? `${GOLD}15` : "transparent",
                    color: isActive ? GOLD : INK_PRIMARY,
                    fontSize: "12px",
                    fontWeight: isActive ? 800 : 500,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s"
                  }}
                  className="gl-clickable"
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel 2: Cusp Sub-lord settings */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <Layers size={15} style={{ color: GOLD }} />
            <h3 style={{ margin: "0", fontSize: "12.5px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Cuspal Configuration</h3>
          </div>
          
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
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Custom Target Houses</span>
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

        {/* Panel 3: Vimshottari DBA Period Rulers */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <Clock size={15} style={{ color: GOLD }} />
            <h3 style={{ margin: "0", fontSize: "12.5px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Vimśottarī DBA Period</h3>
          </div>
          <p style={{ fontSize: "11px", color: INK_MUTED, margin: "0 0 12px 0", lineHeight: 1.4 }}>
            Input the active DBA period rulers to analyze their agreement with current RPs.
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

      {/* VISUAL FILTER AND GATEWAY FLOW (SVG GATEWAY) */}
      <section style={{
        background: "white",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: "12px",
        padding: "16px 20px",
        marginBottom: "2rem",
        boxShadow: "0 4px 12px rgba(156,122,47,0.03)"
      }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "12.5px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Active Convergence Filter Gateway
        </h3>
        <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.45 }}>
          The diagram below visualizes the dynamic filtering process. RPs filter both Cuspal rulers and DBA time periods, highlighting convergence matches.
        </p>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <svg viewBox="0 0 680 180" style={{ minWidth: "600px", width: "100%", height: "100%", overflow: "visible" }}>
            {/* Left side: Active RPs list */}
            <g transform="translate(10, 0)">
              <rect x="0" y="10" width="160" height="160" rx="8" fill="rgba(156, 122, 47, 0.03)" stroke={HAIRLINE} strokeWidth="1.5" />
              <text x="80" y="32" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={GOLD}>MOMENTAL RPs</text>
              {activeRps.slice(0, 5).map((rp, idx) => (
                <g key={rp} transform={`translate(15, ${50 + idx * 24})`}>
                  <circle cx="10" cy="0" r="7" fill={GOLD} />
                  <text x="24" y="4" fontSize="11" fontWeight="700" fill={INK_PRIMARY}>{rp}</text>
                </g>
              ))}
              {activeRps.length === 0 && (
                <text x="80" y="90" textAnchor="middle" fontSize="11" fontStyle="italic" fill={INK_MUTED}>No RPs Active</text>
              )}
            </g>

            {/* Middle: Filter Gate */}
            <g transform="translate(240, 20)">
              <circle cx="50" cy="70" r="45" fill="#fcfbf7" stroke={GOLD} strokeWidth="2" strokeDasharray="3 3" />
              <path d="M 32 50 L 68 50 L 58 85 L 42 85 Z" fill="none" stroke={GOLD} strokeWidth="2.5" />
              <line x1="50" y1="85" x2="50" y2="100" stroke={GOLD} strokeWidth="2.5" />
              <text x="50" y="125" textAnchor="middle" fontSize="10" fontWeight="800" fill={GOLD}>RP FILTER GATE</text>
            </g>

            {/* Right side: DBA Convergence */}
            <g transform="translate(460, 0)">
              <rect x="0" y="10" width="200" height="160" rx="8" fill="rgba(47, 125, 85, 0.02)" stroke="rgba(47, 125, 85, 0.2)" strokeWidth="1.5" />
              <text x="100" y="32" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={EMERALD}>DBA PERIODS CONVERGENCE</text>
              
              {/* Dasa */}
              <g transform="translate(15, 55)">
                <rect x="0" y="-12" width="170" height="24" rx="4" fill={activeRps.includes(dasaLord) ? "rgba(47,125,85,0.12)" : "rgba(0,0,0,0.02)"} stroke={activeRps.includes(dasaLord) ? EMERALD : "rgba(0,0,0,0.08)"} strokeWidth="1" />
                <text x="10" y="4" fontSize="11" fontWeight={activeRps.includes(dasaLord) ? 800 : 500} fill={activeRps.includes(dasaLord) ? EMERALD : INK_SECONDARY}>D: {dasaLord}</text>
                <text x="160" y="4" textAnchor="end" fontSize="10" fontWeight="800" fill={activeRps.includes(dasaLord) ? EMERALD : INK_MUTED}>
                  {activeRps.includes(dasaLord) ? "PASS" : "BLOCK"}
                </text>
              </g>

              {/* Bhukti */}
              <g transform="translate(15, 90)">
                <rect x="0" y="-12" width="170" height="24" rx="4" fill={activeRps.includes(bhuktiLord) ? "rgba(47,125,85,0.12)" : "rgba(0,0,0,0.02)"} stroke={activeRps.includes(bhuktiLord) ? EMERALD : "rgba(0,0,0,0.08)"} strokeWidth="1" />
                <text x="10" y="4" fontSize="11" fontWeight={activeRps.includes(bhuktiLord) ? 800 : 500} fill={activeRps.includes(bhuktiLord) ? EMERALD : INK_SECONDARY}>B: {bhuktiLord}</text>
                <text x="160" y="4" textAnchor="end" fontSize="10" fontWeight="800" fill={activeRps.includes(bhuktiLord) ? EMERALD : INK_MUTED}>
                  {activeRps.includes(bhuktiLord) ? "PASS" : "BLOCK"}
                </text>
              </g>

              {/* Antara */}
              <g transform="translate(15, 125)">
                <rect x="0" y="-12" width="170" height="24" rx="4" fill={activeRps.includes(antaraLord) ? "rgba(47,125,85,0.12)" : "rgba(0,0,0,0.02)"} stroke={activeRps.includes(antaraLord) ? EMERALD : "rgba(0,0,0,0.08)"} strokeWidth="1" />
                <text x="10" y="4" fontSize="11" fontWeight={activeRps.includes(antaraLord) ? 800 : 500} fill={activeRps.includes(antaraLord) ? EMERALD : INK_SECONDARY}>A: {antaraLord}</text>
                <text x="160" y="4" textAnchor="end" fontSize="10" fontWeight="800" fill={activeRps.includes(antaraLord) ? EMERALD : INK_MUTED}>
                  {activeRps.includes(antaraLord) ? "PASS" : "BLOCK"}
                </text>
              </g>
            </g>

            {/* FLOW LINES connecting Left -> Gate -> Right */}
            {/* RPs to Gate */}
            <path 
              d="M 170 90 Q 220 90 238 90" 
              fill="none" 
              stroke={activeRps.length > 0 ? GOLD : "rgba(0,0,0,0.08)"} 
              strokeWidth="2" 
              strokeDasharray={activeRps.length > 0 ? "none" : "3 3"} 
            />
            
            {/* Gate to DBA */}
            <path 
              d="M 335 90 Q 400 90 458 90" 
              fill="none" 
              stroke={dbaMatches.count > 0 ? EMERALD : "rgba(0,0,0,0.08)"} 
              strokeWidth="2" 
              strokeDasharray={dbaMatches.count > 0 ? "none" : "3 3"} 
            />
          </svg>
        </div>
      </section>

      {/* RESULTS DISPLAY GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
        
        {/* Output Panel 1: Cusp Confirmation verdict */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
              <ShieldCheck size={16} style={{ color: GOLD }} />
              <h3 style={{ margin: "0", fontSize: "12.5px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Cuspal Confirmation Verdict
              </h3>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
              <div style={{
                fontSize: "14px",
                fontWeight: 900,
                color: confirmationResult.level === "high" ? EMERALD : confirmationResult.level === "moderate" ? ORANGE : CRIMSON,
                padding: "6px 12px",
                background: confirmationResult.level === "high" ? `${EMERALD}15` : confirmationResult.level === "moderate" ? `${ORANGE}15` : `${CRIMSON}15`,
                borderRadius: "6px",
                border: `1px solid ${confirmationResult.level === "high" ? EMERALD : confirmationResult.level === "moderate" ? ORANGE : CRIMSON}33`
              }}>
                {confirmationResult.level === "high" && "HIGH CONFIRMATION"}
                {confirmationResult.level === "moderate" && "MODERATE CONFIRMATION"}
                {confirmationResult.level === "none" && "ABSENT CONFIRMATION"}
              </div>
            </div>

            <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: "0 0 16px 0", lineHeight: "1.5" }}>
              {confirmationResult.message}
            </p>
          </div>

          <div style={{
            fontSize: "11px",
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

        {/* Output Panel 2: Timing Convergence Coefficients */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
            <Zap size={16} style={{ color: GOLD }} />
            <h3 style={{ margin: "0", fontSize: "12.5px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Event Timing Convergence
            </h3>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: INK_SECONDARY }}>Timing Window Strength:</span>
            <strong style={{
              fontSize: "13px",
              color: dbaMatches.count === 3 ? EMERALD : dbaMatches.count === 2 ? ORANGE : dbaMatches.count === 1 ? GOLD : CRIMSON
            }}>
              {dbaMatches.count} of 3 ({dbaMatches.count === 3 ? "Peak Window" : dbaMatches.count === 2 ? "Strong Window" : dbaMatches.count === 1 ? "Weak Agreement" : "No Match"})
            </strong>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAF8F5", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "8px 12px" }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Daśā Level</span>
                <strong>{dasaLord}</strong>
              </div>
              <span style={{ fontSize: "10.5px", fontWeight: 800, color: dbaMatches.dMatch ? EMERALD : CRIMSON }}>
                {dbaMatches.dMatch ? "RP Match ✓" : "No Match ✗"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAF8F5", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "8px 12px", marginLeft: "14px" }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Bhukti Level</span>
                <strong>{bhuktiLord}</strong>
              </div>
              <span style={{ fontSize: "10.5px", fontWeight: 800, color: dbaMatches.bMatch ? EMERALD : CRIMSON }}>
                {dbaMatches.bMatch ? "RP Match ✓" : "No Match ✗"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAF8F5", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "8px 12px", marginLeft: "28px" }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Antarā Level</span>
                <strong>{antaraLord}</strong>
              </div>
              <span style={{ fontSize: "10.5px", fontWeight: 800, color: dbaMatches.aMatch ? EMERALD : CRIMSON }}>
                {dbaMatches.aMatch ? "RP Match ✓" : "No Match ✗"}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Computational Parameters Table */}
      <section style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "1.6rem" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "12px", color: INK_SECONDARY, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Astronomical Engine Variables
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", color: INK_PRIMARY }}>
          <thead>
            <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}`, color: GOLD }}>
              <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 800 }}>Computational Variable</th>
              <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 800 }}>Value</th>
              <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 800 }}>Stellar Engine Context</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Krishnamurti Ayanāṁśa</td>
              <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>24°06′42″</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Precession subtraction constant</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Target Query Houses</td>
              <td style={{ padding: "8px 12px" }}>{queryHouses.join(", ") || "(none)"}</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Houses checked for verification confirmation</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Sub-Lord RP Agreement</td>
              <td style={{ padding: "8px 12px" }}>{confirmationResult.subLordInRps ? "1 (True)" : "0 (False)"}</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Presence of cusp sub-lord in the active RP set</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Star-Lord RP Agreement</td>
              <td style={{ padding: "8px 12px" }}>{confirmationResult.starLordInRps ? "1 (True)" : "0 (False)"}</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Presence of sub-lord's star-lord in the active RP set</td>
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
