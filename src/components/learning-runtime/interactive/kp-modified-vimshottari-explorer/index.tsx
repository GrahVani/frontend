"use client";

import { useState, useMemo } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const INDIGO = "#4F6FA8";

const PLANETS = [
  { name: "Ketu", years: 7 },
  { name: "Venus", years: 20 },
  { name: "Sun", years: 6 },
  { name: "Moon", years: 10 },
  { name: "Mars", years: 7 },
  { name: "Rahu", years: 18 },
  { name: "Jupiter", years: 16 },
  { name: "Saturn", years: 19 },
  { name: "Mercury", years: 17 }
];

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

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", color: INK_PRIMARY, fontFamily: "sans-serif" }} data-interactive="kp-modified-vimshottari-explorer">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 8 · Lesson 4</span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.5rem", fontWeight: 700 }}>KP-Modified Vimśottarī Explorer</h1>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left: Calculator */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, display: "flex", flexDirection: "column", gap: "14px" }}>
          <h2 style={{ fontSize: "1rem", color: GOLD, margin: "0" }}>Sub-period Proportional Calculator</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: INK_SECONDARY, marginBottom: "4px" }}>
                Mahādaśā Lord (MD):
              </label>
              <select
                value={mahadashaIdx}
                onChange={(e) => setMahadashaIdx(parseInt(e.target.value))}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: `1px solid ${HAIRLINE}`,
                  background: "transparent",
                  color: INK_PRIMARY,
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                {PLANETS.map((p, idx) => (
                  <option key={p.name} value={idx} style={{ background: SURFACE }}>
                    {p.name} ({p.years} yrs)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: INK_SECONDARY, marginBottom: "4px" }}>
                Bhukti Lord (AD):
              </label>
              <select
                value={bhuktiIdx}
                onChange={(e) => setBhuktiIdx(parseInt(e.target.value))}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: `1px solid ${HAIRLINE}`,
                  background: "transparent",
                  color: INK_PRIMARY,
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                {PLANETS.map((p, idx) => (
                  <option key={p.name} value={idx} style={{ background: SURFACE }}>
                    {p.name} ({p.years} yrs)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "14px", marginTop: "4px" }}>
            <span style={{ fontSize: "0.75rem", color: INK_MUTED, display: "block", marginBottom: "4px" }}>Calculation: ({mdPlanet.years} × {bhPlanet.years}) ÷ 120 = {duration.totalYears.toFixed(4)} years</span>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: GOLD }}>
              Duration: {duration.years > 0 ? `${duration.years} yrs ` : ""}{duration.months} mos {duration.days} days
            </div>
          </div>

          {/* Hierarchy Drill down Visual */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.78rem", color: INK_SECONDARY, background: "rgba(156, 122, 47, 0.05)", padding: "10px", borderRadius: "6px" }}>
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

        {/* Right: Interpretive Lens */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1rem", color: GOLD, margin: "0" }}>Interpretive Lens</h2>
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
                  fontSize: "0.72rem",
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
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                KP Lens
              </button>
            </div>
          </div>

          <div style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>
            <strong>Case Study:</strong> Saturn is lording H10/H11 placed in H6 (Aries Lagna). Its Nakṣatra Star-Lord is Sun in H11.
          </div>

          {activeLens === "parashari" ? (
            <div style={{ border: `1.5px solid ${INDIGO}`, borderRadius: 8, padding: "12px", background: `${INDIGO}0a`, display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontSize: "0.85rem", color: INDIGO, margin: "0", fontWeight: 700 }}>Parāśarī Assessment</h3>
              <p style={{ margin: "0", fontSize: "0.78rem", lineHeight: "1.4" }}>
                Saturn acts directly on H6 placement. The period brings mixed results: career struggles, disputes, and challenges due to the H6 placement, but the native has the ability to overcome competitors.
              </p>
              <div style={{ fontSize: "0.72rem", color: INK_MUTED }}>
                Focus: Planet ownership, placement, and house tenant aspects.
              </div>
            </div>
          ) : (
            <div style={{ border: `1.5px solid ${GOLD}`, borderRadius: 8, padding: "12px", background: `${GOLD}0a`, display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontSize: "0.85rem", color: GOLD, margin: "0", fontWeight: 700 }}>KP Stellar Assessment</h3>
              <p style={{ margin: "0", fontSize: "0.78rem", lineHeight: "1.4" }}>
                Saturn acts as a channel for its Star-Lord, <strong>Sun (placed in H11)</strong>. The period triggers massive gains, wealth, and fulfillment of career desires, completely overriding the H6 placement.
              </p>
              <div style={{ fontSize: "0.72rem", color: INK_MUTED }}>
                Focus: Nakṣatra Star-Lord lording/occupying houses. qualified by Sub-Lord.
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
