"use client";

import { useState, useMemo } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const INDIGO = "#4F6FA8";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const BLUE = "#356CAB";

const PLANETS = [
  { name: "Ketu", years: 7, color: "#7A5E5E" },
  { name: "Venus", years: 20, color: "#888888" },
  { name: "Sun", years: 6, color: "#B8860B" },
  { name: "Moon", years: 10, color: "#708090" },
  { name: "Mars", years: 7, color: "#C8412E" },
  { name: "Rahu", years: 18, color: "#5A5A5A" },
  { name: "Jupiter", years: 16, color: "#DAA520" },
  { name: "Saturn", years: 19, color: "#4A6FA8" },
  { name: "Mercury", years: 17, color: "#2E8B57" }
];

function describeWedge(cx: number, cy: number, rInner: number, rOuter: number, startDeg: number, endDeg: number): string {
  const startRad = (startDeg * Math.PI) / 180 - Math.PI / 2;
  const endRad = (endDeg * Math.PI) / 180 - Math.PI / 2;
  const x1_in = cx + rInner * Math.cos(startRad);
  const y1_in = cy + rInner * Math.sin(startRad);
  const x2_in = cx + rInner * Math.cos(endRad);
  const y2_in = cy + rInner * Math.sin(endRad);
  const x1_out = cx + rOuter * Math.cos(startRad);
  const y1_out = cy + rOuter * Math.sin(startRad);
  const x2_out = cx + rOuter * Math.cos(endRad);
  const y2_out = cy + rOuter * Math.sin(endRad);
  
  const sweepIn = 0; // return path clockwise/counter-clockwise toggle
  const sweepOut = 1;
  const largeArcFlag = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  
  return `M ${x1_in} ${y1_in} L ${x1_out} ${y1_out} A ${rOuter} ${rOuter} 0 ${largeArcFlag} ${sweepOut} ${x2_out} ${y2_out} L ${x2_in} ${y2_in} A ${rInner} ${rInner} 0 ${largeArcFlag} ${sweepIn} ${x1_in} Z`;
}

export function KpModifiedVimshottariExplorer() {
  const [mahadashaIdx, setMahadashaIdx] = useState<number>(1); // Venus default
  const [bhuktiIdx, setBhuktiIdx] = useState<number>(6); // Jupiter default
  const [activeLens, setActiveLens] = useState<"parashari" | "kp">("kp");

  const mdPlanet = PLANETS[mahadashaIdx];
  const bhPlanet = PLANETS[bhuktiIdx];

  // Calculate length in Years, Months, Days
  const duration = useMemo(() => {
    const totalYears = (mdPlanet.years * bhPlanet.years) / 120;
    const years = Math.floor(totalYears);
    
    const remainingYears = totalYears - years;
    const totalMonths = remainingYears * 12;
    const months = Math.floor(totalMonths);
    
    const remainingMonths = totalMonths - months;
    const days = Math.round(remainingMonths * 30);

    return { years, months, days, totalYears };
  }, [mdPlanet, bhPlanet]);

  // Compute sector cumulative angles for rendering the proportional ring
  const ringSlices = useMemo(() => {
    let currentAngle = 0;
    return PLANETS.map((p, idx) => {
      const sliceDeg = (p.years / 120) * 360;
      const start = currentAngle;
      const end = currentAngle + sliceDeg;
      currentAngle = end;
      return {
        name: p.name,
        years: p.years,
        color: p.color,
        start,
        end,
        idx
      };
    });
  }, []);

  return (
    <div style={{ color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif" }} data-interactive="kp-modified-vimshottari-explorer">
      
      {/* Header Banner */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", marginBottom: "1rem", boxShadow: "0 4px 20px -2px rgba(47, 125, 85, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GREEN, fontWeight: 900, background: `${GREEN}15`, padding: "2px 8px", borderRadius: "4px" }}>Dasha Proportional Wheel</span>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, fontWeight: 900, background: `${GOLD}15`, padding: "2px 8px", borderRadius: "4px" }}>Chapter 8, Lesson 4</span>
        </div>
        <h2 style={{ margin: "0.4rem 0 0.2rem", color: GOLD, fontSize: "1.45rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
          KP-Modified Vimśottarī Explorer
        </h2>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "13px", lineHeight: 1.55 }}>
          Explore the mathematics of sub-period proportions. The 120-year Vimshottari cycle is divided into proportional nested blocks, which are interpreted under the stellar lens.
        </p>
      </section>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem", alignItems: "start" }}>
        
        {/* Left: Interactive Sandbox Calculator */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1.25rem", background: SURFACE, display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
          <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
            Proportional Time-Ring Sandbox
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: INK_SECONDARY, marginBottom: "4px", fontWeight: "750" }}>
                Mahādaśā Lord (MD):
              </label>
              <select
                aria-label="Mahadasha Lord Selection"
                value={mahadashaIdx}
                onChange={(e) => setMahadashaIdx(parseInt(e.target.value))}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: `1px solid ${HAIRLINE}`,
                  background: SURFACE,
                  color: INK_PRIMARY,
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                {PLANETS.map((p, idx) => (
                  <option key={p.name} value={idx}>
                    {p.name} ({p.years} yrs)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", color: INK_SECONDARY, marginBottom: "4px", fontWeight: "750" }}>
                Bhukti Lord (AD):
              </label>
              <select
                aria-label="Bhukti Lord Selection"
                value={bhuktiIdx}
                onChange={(e) => setBhuktiIdx(parseInt(e.target.value))}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: `1px solid ${HAIRLINE}`,
                  background: SURFACE,
                  color: INK_PRIMARY,
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                {PLANETS.map((p, idx) => (
                  <option key={p.name} value={idx}>
                    {p.name} ({p.years} yrs)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SVG Proportional Time-Ring Dial */}
          <div style={{ display: "flex", justifyContent: "center", margin: "0.5rem 0" }}>
            <svg width="220" height="220" viewBox="0 0 240 240" style={{ overflow: "visible" }}>
              <defs>
                <filter id="ringGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              <circle cx="120" cy="120" r="115" fill="none" stroke={HAIRLINE} strokeWidth="1" />
              <circle cx="120" cy="120" r="65" fill="none" stroke={HAIRLINE} strokeWidth="1" strokeDasharray="3 3" />

              {/* Render the 9 proportional wedges */}
              {ringSlices.map((slice) => {
                const isMD = slice.idx === mahadashaIdx;
                const isAD = slice.idx === bhuktiIdx;
                
                // Describe paths
                const wedgePath = describeWedge(120, 120, 65, 110, slice.start, slice.end);
                
                // Label coordinates
                const midAngle = slice.start + (slice.end - slice.start) / 2;
                const rad = (midAngle * Math.PI) / 180 - Math.PI / 2;
                const lx = 120 + 87 * Math.cos(rad);
                const ly = 120 + 87 * Math.sin(rad);

                return (
                  <g
                    key={slice.name}
                    onClick={() => setMahadashaIdx(slice.idx)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d={wedgePath}
                      fill={isMD ? `${GOLD}25` : "transparent"}
                      stroke={isMD ? GOLD : `${HAIRLINE}40`}
                      strokeWidth={isMD ? 2.5 : 1}
                      filter={isMD ? "url(#ringGlow)" : undefined}
                    />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="8"
                      fontWeight={isMD ? "900" : "600"}
                      fill={isMD ? GOLD : INK_SECONDARY}
                      transform={`rotate(${midAngle}, ${lx}, ${ly})`}
                    >
                      {slice.name.substring(0, 3)}
                    </text>
                  </g>
                );
              })}

              <circle cx="120" cy="120" r="30" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
              <text x="120" y="123" textAnchor="middle" fontSize="9" fontWeight="900" fill={GOLD}>
                {mdPlanet.name}
              </text>
            </svg>
          </div>

          {/* Nested linear timeline bar visualizer */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
            <span style={{ fontSize: "11px", color: INK_MUTED, fontWeight: "800", textTransform: "uppercase" }}>
              Bhukti Proportion Nested in {mdPlanet.name} (MD)
            </span>
            <div style={{ position: "relative", height: "1.8rem", width: "100%", background: "rgba(0,0,0,0.02)", border: `1px solid ${HAIRLINE}`, borderRadius: 6, display: "flex", overflow: "hidden" }}>
              {/* Active AD share */}
              <div
                style={{
                  width: `${(bhPlanet.years / 120) * 100}%`,
                  height: "100%",
                  background: `${GOLD}35`,
                  borderRight: `1.5px solid ${GOLD}`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "11px",
                  fontWeight: 900,
                  color: GOLD
                }}
              >
                {bhPlanet.name} ({duration.totalYears.toFixed(2)}y)
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: "10px", fontSize: "10px", color: INK_MUTED }}>
                Remaining {mdPlanet.name} Dasha ({(mdPlanet.years - duration.totalYears).toFixed(2)}y)
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
              <span style={{ fontSize: "11px", color: INK_MUTED }}>Formula: ({mdPlanet.years}y × {bhPlanet.years}y) ÷ 120 = {duration.totalYears.toFixed(4)}y</span>
              <strong style={{ fontSize: "13px", color: GOLD }}>
                {duration.years > 0 ? `${duration.years}y ` : ""}{duration.months}m {duration.days}d
              </strong>
            </div>
          </div>

          {/* Proportional breakdown drilldown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: INK_SECONDARY, background: "rgba(156, 122, 47, 0.04)", padding: "10px", borderRadius: "8px", border: `1px solid ${HAIRLINE}33` }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Mahādaśā Lord (MD):</span>
              <strong>{mdPlanet.name} ({mdPlanet.years} years)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "10px", borderLeft: `1.5px solid ${GOLD}` }}>
              <span>Bhukti Lord (AD):</span>
              <strong>{bhPlanet.name} ({duration.years}y {duration.months}m)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "20px", borderLeft: `1.5px solid ${GOLD}66` }}>
              <span>Antarā Lord (PD):</span>
              <strong>~{(duration.totalYears * bhPlanet.years * 30 / 120).toFixed(1)} days</strong>
            </div>
          </div>
        </div>

        {/* Right: Interpretive Stellar Lens */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1.25rem", background: SURFACE, display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
              Interpretive Lens
            </h3>
            {/* Toggle Switch */}
            <div style={{ display: "flex", gap: "4px", background: "rgba(156, 122, 47, 0.1)", borderRadius: "6px", padding: "2px" }}>
              <button
                onClick={() => setActiveLens("parashari")}
                style={{
                  background: activeLens === "parashari" ? INDIGO : "transparent",
                  color: activeLens === "parashari" ? "#FFFBF2" : INK_SECONDARY,
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Parāśarī
              </button>
              <button
                onClick={() => setActiveLens("kp")}
                style={{
                  background: activeLens === "kp" ? GOLD : "transparent",
                  color: activeLens === "kp" ? "#FFFBF2" : INK_SECONDARY,
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                KP Lens
              </button>
            </div>
          </div>

          <div style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.45 }}>
            <strong>Case Study:</strong> Saturn is lording H10/H11 placed in H6 (Aries Lagna). Its Nakṣatra Star-Lord is Sun in H11.
          </div>

          {activeLens === "parashari" ? (
            <div style={{ border: `1.5px solid ${INDIGO}`, borderRadius: 8, padding: "12px", background: `${INDIGO}0a`, display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontSize: "12px", color: INDIGO, margin: "0", fontWeight: 700 }}>Parāśarī Assessment</h3>
              <p style={{ margin: "0", fontSize: "12px", lineHeight: "1.45" }}>
                Saturn acts directly on H6 placement. The period brings mixed results: career struggles, disputes, and challenges due to the H6 placement, but the native has the ability to overcome competitors.
              </p>
              <div style={{ fontSize: "11px", color: INK_MUTED }}>
                Focus: Planet ownership, placement, and house tenant aspects.
              </div>
            </div>
          ) : (
            <div style={{ border: `1.5px solid ${GOLD}`, borderRadius: 8, padding: "12px", background: `${GOLD}0a`, display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontSize: "12px", color: GOLD, margin: "0", fontWeight: 700 }}>KP Stellar Assessment</h3>
              <p style={{ margin: "0", fontSize: "12px", lineHeight: "1.45" }}>
                Saturn acts as a channel for its Star-Lord, <strong>Sun (placed in H11)</strong>. The period triggers massive gains, wealth, and fulfillment of career desires, completely overriding the H6 placement.
              </p>
              <div style={{ fontSize: "11px", color: INK_MUTED }}>
                Focus: Nakṣatra Star-Lord lording/occupying houses, qualified by Sub-Lord outcome.
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
