"use client";

import { useState, useMemo } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const INDIGO = "#4F6FA8";
const CRIMSON = "#A23A1E";

const HOUSE_PATHS = [
  { id: 1, path: "M 200,200 L 100,100 L 200,0 L 300,100 Z", textX: 200, textY: 75, numberX: 200, numberY: 30, signName: "Aries" },
  { id: 2, path: "M 0,0 L 200,0 L 100,100 Z", textX: 100, textY: 45, numberX: 50, numberY: 30, signName: "Taurus" },
  { id: 3, path: "M 0,0 L 0,200 L 100,100 Z", textX: 45, textY: 100, numberX: 30, numberY: 50, signName: "Gemini" },
  { id: 4, path: "M 200,200 L 100,100 L 0,200 L 100,300 Z", textX: 75, textY: 200, numberX: 30, numberY: 200, signName: "Cancer" },
  { id: 5, path: "M 0,400 L 0,200 L 100,300 Z", textX: 45, textY: 300, numberX: 30, numberY: 350, signName: "Leo" },
  { id: 6, path: "M 0,400 L 200,400 L 100,300 Z", textX: 100, textY: 355, numberX: 50, numberY: 375, signName: "Virgo" },
  { id: 7, path: "M 200,200 L 100,300 L 200,400 L 300,300 Z", textX: 200, textY: 325, numberX: 200, numberY: 370, signName: "Libra" },
  { id: 8, path: "M 400,400 L 200,400 L 300,300 Z", textX: 300, textY: 355, numberX: 350, numberY: 375, signName: "Scorpio" },
  { id: 9, path: "M 400,400 L 400,200 L 300,300 Z", textX: 355, textY: 300, numberX: 370, numberY: 350, signName: "Sagittarius" },
  { id: 10, path: "M 200,200 L 300,300 L 400,200 L 300,100 Z", textX: 325, textY: 200, numberX: 370, numberY: 200, signName: "Capricorn" },
  { id: 11, path: "M 400,0 L 400,200 L 300,100 Z", textX: 355, textY: 100, numberX: 370, numberY: 50, signName: "Aquarius" },
  { id: 12, path: "M 400,0 L 200,0 L 300,100 Z", textX: 300, textY: 45, numberX: 350, numberY: 30, signName: "Pisces" }
];

export function KpParashariSideBySide() {
  const [timeNudge, setTimeNudge] = useState<number>(0); // Nudge time in minutes

  // Calculate coordinates dynamically based on the slider nudge
  const rawLagnaDeg = 12.15 + (timeNudge * 0.25); // Lagna advances by ~0.25 deg per minute of time
  const raw7thCuspDeg = 20.16 + (timeNudge * 0.25); // 7th cusp advances similarly

  // Parāśarī 7th lord is Venus (always Venus since Aries Lagna rising, Libra is 7th rashi)
  const parashariLord = "Venus";

  // KP 7th Cusp sub lord (Aries lagna, Libra 7th cusp spans 20°10' Libra = 200°10' sidereal)
  // Jupiter sub spans first 53'20" of Vishakha (starts at 200°).
  // If we nudge past 53' (about 2.5 minutes of time), it flips to Saturn sub!
  const kpSubLord = useMemo(() => {
    const totalCuspMinutes = raw7thCuspDeg * 60; // relative to Libra start
    const offsetInVishakha = totalCuspMinutes - 1200; // Vishakha starts at 20° Libra = 1200'
    
    if (offsetInVishakha < 0) {
      // Swati nakshatra (Rahu star) - Rahu / Jupiter sub boundary
      return "Rahu";
    }
    
    // Vishakha (Jupiter star)
    if (offsetInVishakha < 53.33) {
      return "Jupiter"; // Jupiter sub
    } else {
      return "Saturn"; // Saturn sub
    }
  }, [raw7thCuspDeg]);

  // SVG North Indian Chart (200x200) for Parashari (Aries Lagna = Sign 1)
  const renderParashariChart = useMemo(() => {
    return (
      <svg viewBox="0 0 400 400" width="100%" height="100%">
        {/* Outer frame */}
        <rect x="0" y="0" width="400" height="400" fill="none" stroke={INDIGO} strokeWidth="3" />
        
        {/* Diagonals */}
        <line x1="0" y1="0" x2="400" y2="400" stroke={INDIGO} strokeWidth="1.5" />
        <line x1="400" y1="0" x2="0" y2="400" stroke={INDIGO} strokeWidth="1.5" />
        
        {/* Inner Diamond */}
        <path d="M 200,0 L 400,200 L 200,400 L 0,200 Z" fill="none" stroke={INDIGO} strokeWidth="1.5" />

        {/* Render 12 houses */}
        {HOUSE_PATHS.map((hp) => {
          const isHouse7 = hp.id === 7;
          return (
            <g key={hp.id}>
              {isHouse7 && (
                <path d={hp.path} fill={`${INDIGO}1a`} stroke={INDIGO} strokeWidth="2.5" />
              )}
              {/* Sign Number */}
              <text x={hp.numberX} y={hp.numberY} textAnchor="middle" fontSize="12" fill={isHouse7 ? INDIGO : INK_MUTED} fontWeight="900">
                {hp.id}
              </text>
              {/* House label */}
              <text x={hp.textX} y={hp.textY} textAnchor="middle" fontSize="10" fill={isHouse7 ? INDIGO : INK_PRIMARY} fontWeight="bold">
                H{hp.id} {isHouse7 ? "(Spouse)" : hp.id === 1 ? "(Lagna)" : ""}
              </text>
            </g>
          );
        })}

        {/* Exalted Saturn in House 7 */}
        <text x="200" y="295" textAnchor="middle" fontSize="10" fill={INDIGO} fontWeight="bold">
          Sa (Exalted)
        </text>
      </svg>
    );
  }, []);

  // SVG North Indian Chart (200x200) for KP Placidus (highlighting exact 7th cusp)
  const renderKpChart = useMemo(() => {
    return (
      <svg viewBox="0 0 400 400" width="100%" height="100%">
        {/* Outer frame */}
        <rect x="0" y="0" width="400" height="400" fill="none" stroke={GOLD} strokeWidth="3" />
        
        {/* Diagonals */}
        <line x1="0" y1="0" x2="400" y2="400" stroke={GOLD} strokeWidth="1.5" />
        <line x1="400" y1="0" x2="0" y2="400" stroke={GOLD} strokeWidth="1.5" />
        
        {/* Inner Diamond */}
        <path d="M 200,0 L 400,200 L 200,400 L 0,200 Z" fill="none" stroke={GOLD} strokeWidth="1.5" />

        {/* Render 12 houses */}
        {HOUSE_PATHS.map((hp) => {
          const isHouse7 = hp.id === 7;
          const isHouse6 = hp.id === 6;
          return (
            <g key={hp.id}>
              {isHouse7 && (
                <path d={hp.path} fill={`${GOLD}1a`} stroke={GOLD} strokeWidth="2.5" />
              )}
              {isHouse6 && (
                <path d={hp.path} fill={`${GOLD}0a`} stroke={GOLD} strokeWidth="1.5" />
              )}
              {/* Sign Number */}
              <text x={hp.numberX} y={hp.numberY} textAnchor="middle" fontSize="12" fill={isHouse7 ? GOLD : INK_MUTED} fontWeight="900">
                {hp.id}
              </text>
              {/* House label */}
              <text x={hp.textX} y={hp.textY} textAnchor="middle" fontSize="10" fill={isHouse7 ? GOLD : INK_PRIMARY} fontWeight="bold">
                {isHouse7 ? `C7 (${raw7thCuspDeg.toFixed(2)}°)` : `C${hp.id}`}
              </text>
            </g>
          );
        })}

        {/* Saturn in House 6 or 7 (Divergence based on cusp boundary) */}
        {18.00 >= raw7thCuspDeg ? (
          <text x="200" y="295" textAnchor="middle" fontSize="10" fill={GOLD} fontWeight="bold">
            Sa (Exalted)
          </text>
        ) : (
          <text x="100" y="325" textAnchor="middle" fontSize="10" fill={GOLD} fontWeight="bold">
            Sa (Exalted)
          </text>
        )}
      </svg>
    );
  }, [raw7thCuspDeg]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", color: INK_PRIMARY }} data-interactive="kp-parashari-side-by-side">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 8 · Lesson 5</span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.5rem", fontWeight: 700 }}>KP vs Parāśarī Same-Chart side-by-side</h1>
      </section>

      {/* Time Nudge Slider */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: INK_SECONDARY, marginBottom: "6px" }}>
          <span>Nudge birth time (simulate cusp boundary shifts):</span>
          <span style={{ color: GOLD, fontWeight: 700 }}>{timeNudge >= 0 ? `+${timeNudge}` : timeNudge} minutes</span>
        </div>
        <input
          type="range"
          min="-8"
          max="8"
          step="0.5"
          value={timeNudge}
          onChange={(e) => setTimeNudge(parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: GOLD }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: INK_MUTED, marginTop: "4px" }}>
          <span>Swati Star (Rahu)</span>
          <span style={{ color: kpSubLord === "Jupiter" ? GOLD : INK_MUTED, fontWeight: kpSubLord === "Jupiter" ? 900 : 500 }}>Vishakha Star (Jupiter sub)</span>
          <span style={{ color: kpSubLord === "Saturn" ? GOLD : INK_MUTED, fontWeight: kpSubLord === "Saturn" ? 900 : 500 }}>Vishakha Star (Saturn sub)</span>
        </div>
      </div>

      {/* Twin Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left: Parashari */}
        <div style={{ border: `1px solid ${INDIGO}44`, borderRadius: 12, padding: "16px", background: SURFACE, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <h2 style={{ fontSize: "1rem", color: INDIGO, margin: "0", width: "100%" }}>Parāśarī Whole-Sign Chart</h2>
          <div style={{ width: "200px", height: "200px" }}>
            {renderParashariChart}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", marginTop: "10px" }}>
            <tbody>
              <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>Lagna Sign:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700 }}>Aries (Mesh)</td>
              </tr>
              <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>7th House Sign:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700 }}>Libra (Tula)</td>
              </tr>
              <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>7th House Lord:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700, color: INDIGO }}>{parashariLord}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>7th House Tenant:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700 }}>Saturn (Exalted)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right: KP */}
        <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 12, padding: "16px", background: SURFACE, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <h2 style={{ fontSize: "1rem", color: GOLD, margin: "0", width: "100%" }}>KP Placidus Cusp Chart</h2>
          <div style={{ width: "200px", height: "200px" }}>
            {renderKpChart}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", marginTop: "10px" }}>
            <tbody>
              <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>Lagna degree:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700 }}>Aries {rawLagnaDeg.toFixed(2)}°</td>
              </tr>
              <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>7th Cusp degree:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700 }}>Libra {raw7thCuspDeg.toFixed(2)}°</td>
              </tr>
              <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>7th Cusp Sub-Lord:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700, color: GOLD }}>{kpSubLord}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>7th CSL Verdict:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700, color: kpSubLord === "Jupiter" ? "#2F7D55" : CRIMSON }}>
                  {kpSubLord === "Jupiter" ? "YES (Promises Marriage)" : "NO / Delay (Obstacles)"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* Comparison table (replaces logs) */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, marginTop: "24px" }}>
        <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 10px" }}>Cross-Stream Comparison & Synthesis</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}`, color: GOLD }}>
              <th style={{ textAlign: "left", padding: "6px" }}>Compare point</th>
              <th style={{ textAlign: "left", padding: "6px" }}>Parāśarī Column</th>
              <th style={{ textAlign: "left", padding: "6px" }}>KP Column</th>
              <th style={{ textAlign: "left", padding: "6px" }}>Takeaway / Divergence</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
              <td style={{ padding: "6px", fontWeight: 700 }}>7th house anchor</td>
              <td style={{ padding: "6px" }}>Venus (Sign Lord)</td>
              <td style={{ padding: "6px" }}>{kpSubLord} (Sub Lord)</td>
              <td style={{ padding: "6px" }}>Divergence: Parāśarī uses sign ruler, KP uses cusp sub ruler.</td>
            </tr>
            <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
              <td style={{ padding: "6px", fontWeight: 700 }}>Sensitivity to time</td>
              <td style={{ padding: "6px" }}>Very low (stable for hours)</td>
              <td style={{ padding: "6px" }}>High (flips within minutes)</td>
              <td style={{ padding: "6px" }}>KP sub-lord flips from Jupiter to Saturn with slider shifts.</td>
            </tr>
            <tr>
              <td style={{ padding: "6px", fontWeight: 700 }}>Verdict Form</td>
              <td style={{ padding: "6px" }}>Holistic delay warning (Saturn)</td>
              <td style={{ padding: "6px" }}>{kpSubLord === "Jupiter" ? "YES (Jupiter in 11th)" : "NO / Obstacles (Saturn)"}</td>
              <td style={{ padding: "6px" }}>Convergence when slider is set to Jupiter sub; divergence when nudged.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
