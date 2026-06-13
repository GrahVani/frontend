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
const CRIMSON = "#A23A1E";

export function KpParashariConvergences() {
  const [activeTab, setActiveTab] = useState<"zodiac" | "grahas" | "vimshottari">("zodiac");
  const [ayanamshaOffset, setAyanamshaOffset] = useState<number>(24.08); // standard Citrapaksa
  const [moonLongitude, setMoonLongitude] = useState<number>(263.23); // 23°14' Sagittarius

  // Vimshottari calculations
  const vimshottariResult = useMemo(() => {
    // 27 Nakshatras names
    const NAKSHATRAS = [
      "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
      "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
      "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhishaj", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ];
    // Rulers index matching Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury
    const RULERS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

    const totalDegrees = moonLongitude;
    const nakIndex = Math.floor(totalDegrees / (13 + 1/3)) % 27;
    const nakName = NAKSHATRAS[nakIndex];
    const ruler = RULERS[nakIndex % 9];

    // Compute remaining balance fraction
    const passedInNak = totalDegrees % (13 + 1/3);
    const fractionRemaining = 1 - (passedInNak / (13 + 1/3));

    return { nakName, ruler, fractionRemaining };
  }, [moonLongitude]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", color: INK_PRIMARY, fontFamily: "sans-serif" }} data-interactive="kp-parashari-convergences">
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 8 · Lesson 1</span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.5rem", fontWeight: 700 }}>KP &amp; Parāśarī Convergences</h1>
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "8px" }}>
        {(["zodiac", "grahas", "vimshottari"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? GOLD : "transparent",
              color: activeTab === tab ? "#FFFBF2" : INK_SECONDARY,
              border: `1px solid ${activeTab === tab ? GOLD : HAIRLINE}`,
              borderRadius: "6px",
              padding: "8px 16px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {tab === "zodiac" ? "1. Zodiac Alignment" : tab === "grahas" ? "2. Shared Grahas" : "3. Vimśottarī Engine"}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "zodiac" && (() => {
        const lahiriDiff = Math.abs(ayanamshaOffset - 24.08);
        const kpDiff = Math.abs(ayanamshaOffset - 23.98);
        const alignmentPercent = Math.max(0, 100 - (lahiriDiff / 30) * 100);
        const tropicalOffsetPercent = (ayanamshaOffset / 30) * 100;

        // Dynamic Saturn coordinates
        const saturnTropical = 200.0; // 20° Libra
        const saturnSidereal = (saturnTropical - ayanamshaOffset + 360) % 360;
        const saturnSignIdx = Math.floor(saturnSidereal / 30);
        const saturnSignDeg = saturnSidereal % 30;
        const signNames = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
        const saturnSignName = signNames[saturnSignIdx];

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontSize: "0.9rem", color: INK_SECONDARY, margin: "0" }}>
              Both systems are <strong>sidereal</strong>. They measure positions against the fixed stars, applying an Ayanāṁśa. Compare the minor offset between Lahiri and Krishnamurti Ayanāṁśas versus the massive gap to the Tropical system.
            </p>

            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
              <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: INK_SECONDARY, marginBottom: "8px" }}>
                <span>Adjust Custom Ayanāṁśa Reference:</span>
                <span style={{ color: GOLD, fontWeight: 700 }}>{ayanamshaOffset.toFixed(2)}°</span>
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="0.05"
                value={ayanamshaOffset}
                onChange={(e) => setAyanamshaOffset(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: GOLD }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "16px" }}>
              <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
                <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 12px" }}>Ayanāṁśa Reference Comparison</h3>
                <ul style={{ listStyle: "none", padding: "0", margin: "0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
                  <li style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Lahiri Reference:</span>
                    <span style={{ fontWeight: 700 }}>24.08°</span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Krishnamurti Reference:</span>
                    <span style={{ fontWeight: 700 }}>23.98°</span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${HAIRLINE}`, paddingTop: "8px", color: GOLD }}>
                    <span><strong>Diff from Lahiri:</strong></span>
                    <span><strong>{lahiriDiff.toFixed(2)}° ({Math.round(lahiriDiff * 60)}′)</strong></span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", borderTop: `1px dashed ${HAIRLINE}`, paddingTop: "8px" }}>
                    <span>Saturn (Tropical 20° Libra):</span>
                    <span style={{ fontWeight: 700, color: saturnSignName === "Libra" ? INDIGO : CRIMSON }}>
                      {saturnSignName} {saturnSignDeg.toFixed(2)}°
                    </span>
                  </li>
                </ul>
              </div>

              <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 10px" }}>Visual Convergence Scale</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "4px" }}>
                      <span>Alignment with Lahiri</span>
                      <span style={{ color: GREEN, fontWeight: 700 }}>{alignmentPercent.toFixed(1)}% Aligned</span>
                    </div>
                    <div style={{ height: "12px", background: "#EAE6DF", borderRadius: "6px", overflow: "hidden" }}>
                      <div style={{ width: `${alignmentPercent}%`, height: "100%", background: GREEN, transition: "width 0.1s ease" }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "4px" }}>
                      <span>Shift from Tropical (0° Ayanāmśa)</span>
                      <span style={{ color: "#A23A1E", fontWeight: 700 }}>{tropicalOffsetPercent.toFixed(1)}% Shifted</span>
                    </div>
                    <div style={{ height: "12px", background: "#EAE6DF", borderRadius: "6px", overflow: "hidden" }}>
                      <div style={{ width: `${tropicalOffsetPercent}%`, height: "100%", background: "#A23A1E", transition: "width 0.1s ease" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {activeTab === "grahas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontSize: "0.9rem", color: INK_SECONDARY, margin: "0" }}>
            The celestial coordinates of all grahas are calculated identically in both systems. Only when a planet sits exactly on the border of a sign/nakṣatra does the 6' ayanāṁśa offset nudge it into a different division.
          </p>

          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 12px" }}>Planet Position Verifier</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}`, color: GOLD }}>
                  <th style={{ textAlign: "left", padding: "6px" }}>Graha</th>
                  <th style={{ textAlign: "left", padding: "6px" }}>Raw Longitude</th>
                  <th style={{ textAlign: "left", padding: "6px" }}>Parāśarī Position</th>
                  <th style={{ textAlign: "left", padding: "6px" }}>KP Position</th>
                  <th style={{ textAlign: "left", padding: "6px" }}>Agreement</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                  <td style={{ padding: "6px", fontWeight: 700 }}>Sun</td>
                  <td style={{ padding: "6px" }}>45°12' (Taurus)</td>
                  <td style={{ padding: "6px" }}>Taurus 15°12'</td>
                  <td style={{ padding: "6px" }}>Taurus 15°18'</td>
                  <td style={{ padding: "6px", color: GREEN, fontWeight: 700 }}>Same Sign &amp; Star</td>
                </tr>
                <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                  <td style={{ padding: "6px", fontWeight: 700 }}>Jupiter</td>
                  <td style={{ padding: "6px" }}>134°58' (Leo)</td>
                  <td style={{ padding: "6px" }}>Leo 14°58'</td>
                  <td style={{ padding: "6px" }}>Leo 15°04'</td>
                  <td style={{ padding: "6px", color: GREEN, fontWeight: 700 }}>Same Sign &amp; Star</td>
                </tr>
                <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                  <td style={{ padding: "6px", fontWeight: 700 }}>Saturn (Border case)</td>
                  <td style={{ padding: "6px" }}>199°58' (Libra)</td>
                  <td style={{ padding: "6px" }}>Libra 19°58' (Swati)</td>
                  <td style={{ padding: "6px" }}>Libra 20°04' (Vishakha)</td>
                  <td style={{ padding: "6px", color: "#A23A1E", fontWeight: 700 }}>Nakṣatra Shift!</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "vimshottari" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontSize: "0.9rem", color: INK_SECONDARY, margin: "0" }}>
            Vimśottarī daśā is the shared engine for timing. Enter a Moon longitude to verify that the starting lord and balance fractions correspond across both streams.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "16px" }}>
            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, display: "flex", flexDirection: "column", gap: "12px" }}>
              <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0" }}>Configure Moon</h3>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: INK_SECONDARY, marginBottom: "4px" }}>
                  Moon Longitude (0 - 360°):
                </label>
                <input
                  type="number"
                  min="0"
                  max="359.99"
                  step="0.01"
                  value={moonLongitude}
                  onChange={(e) => setMoonLongitude(Math.max(0, Math.min(359.99, parseFloat(e.target.value) || 0)))}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: `1px solid ${HAIRLINE}`,
                    background: "transparent",
                    color: INK_PRIMARY,
                    fontSize: "0.85rem",
                    boxSizing: "border-box"
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: INK_MUTED }}>
                <span>Selected:</span>
                <span>{(moonLongitude % 30).toFixed(2)}° in Sign {Math.floor(moonLongitude / 30) + 1}</span>
              </div>
            </div>

            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
              <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 12px" }}>Dasha Engine Diagnostics</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <tbody>
                  <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                    <td style={{ padding: "6px 0", color: INK_SECONDARY }}>Nakṣatra:</td>
                    <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700 }}>{vimshottariResult.nakName}</td>
                  </tr>
                  <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                    <td style={{ padding: "6px 0", color: INK_SECONDARY }}>Starting Dasha Lord:</td>
                    <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700, color: GOLD }}>{vimshottariResult.ruler}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px 0", color: INK_SECONDARY }}>Balance Fraction Remaining:</td>
                    <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700 }}>{(vimshottariResult.fractionRemaining * 100).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
