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
const GREEN = "#2F7D55";

const HOUSE_PATHS = [
  { id: 1, path: "M 200,200 L 100,100 L 200,0 L 300,100 Z", textX: 200, textY: 75, numberX: 200, numberY: 30 },
  { id: 2, path: "M 0,0 L 200,0 L 100,100 Z", textX: 100, textY: 45, numberX: 50, numberY: 30 },
  { id: 3, path: "M 0,0 L 0,200 L 100,100 Z", textX: 45, textY: 100, numberX: 30, numberY: 50 },
  { id: 4, path: "M 200,200 L 100,100 L 0,200 L 100,300 Z", textX: 75, textY: 200, numberX: 30, numberY: 200 },
  { id: 5, path: "M 0,400 L 0,200 L 100,300 Z", textX: 45, textY: 300, numberX: 30, numberY: 350 },
  { id: 6, path: "M 0,400 L 200,400 L 100,300 Z", textX: 100, textY: 355, numberX: 50, numberY: 375 },
  { id: 7, path: "M 200,200 L 100,300 L 200,400 L 300,300 Z", textX: 200, textY: 325, numberX: 200, numberY: 370 },
  { id: 8, path: "M 400,400 L 200,400 L 300,300 Z", textX: 300, textY: 355, numberX: 350, numberY: 375 },
  { id: 9, path: "M 400,400 L 400,200 L 300,300 Z", textX: 355, textY: 300, numberX: 370, numberY: 350 },
  { id: 10, path: "M 200,200 L 300,300 L 400,200 L 300,100 Z", textX: 325, textY: 200, numberX: 370, numberY: 200 },
  { id: 11, path: "M 400,0 L 400,200 L 300,100 Z", textX: 355, textY: 100, numberX: 370, numberY: 50 },
  { id: 12, path: "M 400,0 L 200,0 L 300,100 Z", textX: 300, textY: 45, numberX: 350, numberY: 30 }
];

export function KpParashariDivergences() {
  const [activeTab, setActiveTab] = useState<"houses" | "determinant" | "aspects" | "ayanamsha" | "output">("houses");
  const [ayanamshaOffset, setAyanamshaOffset] = useState<number>(0); // in arcminutes, from -10 to +10
  const [cusp7Deg, setCusp7Deg] = useState<number>(20.10); // 7th cusp in Libra, from 15.0 to 25.0

  // Saturn calculations based on Ayanamsha offset (Tab 4 local slider)
  const saturnResult = useMemo(() => {
    const rawSaturnDeg = 19.97 + (ayanamshaOffset / 60);
    const inVishakha = rawSaturnDeg >= 20.0;
    const starLord = inVishakha ? "Jupiter" : "Rahu";
    const subLord = inVishakha
      ? (rawSaturnDeg - 20.0) * 60 < 53.33 ? "Jupiter" : "Saturn"
      : "Jupiter"; // simplified mapping
    return { rawSaturnDeg, starLord, subLord, inVishakha };
  }, [ayanamshaOffset]);

  const saturnInH7 = 18.00 >= cusp7Deg;

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", color: INK_PRIMARY, fontFamily: "sans-serif" }} data-interactive="kp-parashari-divergences">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 8 · Lesson 2</span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.5rem", fontWeight: 700 }}>KP &amp; Parāśarī Divergences</h1>
      </section>

      {/* Global Cusp Slider */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: INK_SECONDARY, marginBottom: "6px" }}>
          <span>Adjust Placidus C7 Cusp Longitude (simulate time shift):</span>
          <span style={{ color: GOLD, fontWeight: 700 }}>Libra {cusp7Deg.toFixed(2)}°</span>
        </div>
        <input
          type="range"
          min="15.0"
          max="25.0"
          step="0.1"
          value={cusp7Deg}
          onChange={(e) => setCusp7Deg(parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: GOLD }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: INK_MUTED, marginTop: "4px" }}>
          <span>Saturn in H7 (C7 &le; 18.0°)</span>
          <span style={{ color: GOLD, fontWeight: 900 }}>Saturn (fixed at 18.00° Libra)</span>
          <span>Saturn in H6 (C7 &gt; 18.0°)</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "8px" }}>
        {(["houses", "determinant", "aspects", "ayanamsha", "output"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? GOLD : "transparent",
              color: activeTab === tab ? "#FFFBF2" : INK_SECONDARY,
              border: `1px solid ${activeTab === tab ? GOLD : HAIRLINE}`,
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {tab === "houses" ? "1. House Division" : tab === "determinant" ? "2. Determinant" : tab === "aspects" ? "3. Aspects" : tab === "ayanamsha" ? "4. Ayanāṁśa Shift" : "5. Output Style"}
          </button>
        ))}
      </div>

      {/* Contents */}
      {activeTab === "houses" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontSize: "0.85rem", color: INK_SECONDARY, margin: "0" }}>
            <strong>House Division Divergence:</strong> Parāśarī uses <strong>Whole-Sign</strong> houses (Libra is always House 7 for Aries Lagna). KP uses unequal <strong>Placidus</strong> house boundaries. Adjust the slider above to see Saturn cross the Placidus cusp boundary.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Parashari Whole-Sign */}
            <div style={{ border: `1px solid ${INDIGO}44`, borderRadius: 12, padding: "12px", background: SURFACE, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h3 style={{ fontSize: "0.9rem", color: INDIGO, margin: "0 0 10px" }}>Parāśarī (Whole-Sign)</h3>
              <div style={{ width: "160px", height: "160px" }}>
                <svg viewBox="0 0 400 400" width="100%" height="100%">
                  <rect x="0" y="0" width="400" height="400" fill="none" stroke={INDIGO} strokeWidth="3" />
                  <line x1="0" y1="0" x2="400" y2="400" stroke={INDIGO} strokeWidth="1.5" />
                  <line x1="400" y1="0" x2="0" y2="400" stroke={INDIGO} strokeWidth="1.5" />
                  <path d="M 200,0 L 400,200 L 200,400 L 0,200 Z" fill="none" stroke={INDIGO} strokeWidth="1.5" />
                  {HOUSE_PATHS.map((hp) => (
                    <g key={hp.id}>
                      {hp.id === 7 && <path d={hp.path} fill={`${INDIGO}22`} stroke={INDIGO} strokeWidth="2" />}
                      <text x={hp.numberX} y={hp.numberY} textAnchor="middle" fontSize="14" fill={hp.id === 7 ? INDIGO : INK_MUTED} fontWeight="900">{hp.id}</text>
                    </g>
                  ))}
                  <text x="200" y="300" textAnchor="middle" fontSize="16" fill={INDIGO} fontWeight="bold">Saturn (H7)</text>
                </svg>
              </div>
              <span style={{ fontSize: "0.75rem", color: INK_SECONDARY, marginTop: "8px" }}>Saturn is always in House 7 (Libra).</span>
            </div>

            {/* KP Placidus */}
            <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 12, padding: "12px", background: SURFACE, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h3 style={{ fontSize: "0.9rem", color: GOLD, margin: "0 0 10px" }}>KP Placidus (C7: {cusp7Deg.toFixed(1)}° Libra)</h3>
              <div style={{ width: "160px", height: "160px" }}>
                <svg viewBox="0 0 400 400" width="100%" height="100%">
                  <rect x="0" y="0" width="400" height="400" fill="none" stroke={GOLD} strokeWidth="3" />
                  <line x1="0" y1="0" x2="400" y2="400" stroke={GOLD} strokeWidth="1.5" />
                  <line x1="400" y1="0" x2="0" y2="400" stroke={GOLD} strokeWidth="1.5" />
                  <path d="M 200,0 L 400,200 L 200,400 L 0,200 Z" fill="none" stroke={GOLD} strokeWidth="1.5" />
                  {HOUSE_PATHS.map((hp) => (
                    <g key={hp.id}>
                      {hp.id === (saturnInH7 ? 7 : 6) && <path d={hp.path} fill={`${GOLD}22`} stroke={GOLD} strokeWidth="2" />}
                      <text x={hp.numberX} y={hp.numberY} textAnchor="middle" fontSize="14" fill={hp.id === (saturnInH7 ? 7 : 6) ? GOLD : INK_MUTED} fontWeight="900">{hp.id}</text>
                    </g>
                  ))}
                  {saturnInH7 ? (
                    <text x="200" y="300" textAnchor="middle" fontSize="16" fill={GOLD} fontWeight="bold">Saturn (H7)</text>
                  ) : (
                    <text x="100" y="320" textAnchor="middle" fontSize="16" fill={GOLD} fontWeight="bold">Saturn (H6)</text>
                  )}
                </svg>
              </div>
              <span style={{ fontSize: "0.75rem", color: INK_SECONDARY, marginTop: "8px" }}>
                Saturn occupies: <strong>{saturnInH7 ? "House 7" : "House 6"}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "determinant" && (
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
          <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 12px" }}>Primary Determinant of a House</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}`, color: GOLD }}>
                <th style={{ textAlign: "left", padding: "8px" }}>Feature</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Parāśarī Column</th>
                <th style={{ textAlign: "left", padding: "8px" }}>KP Column (C7: Libra {cusp7Deg.toFixed(2)}°)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "8px", fontWeight: 700 }}>Primary Anchor</td>
                <td style={{ padding: "8px" }}>House Lord (Venus for Libra 7th)</td>
                <td style={{ padding: "8px" }}>Cuspal Sub-Lord (Jupiter at C7 cusp)</td>
              </tr>
              <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "8px", fontWeight: 700 }}>Saturn House Placement</td>
                <td style={{ padding: "8px" }}>House 7</td>
                <td style={{ padding: "8px", color: saturnInH7 ? GREEN : CRIMSON, fontWeight: 700 }}>
                  {saturnInH7 ? "House 7 (Libran Tenant)" : "House 6 (Virgo Sector)"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px", fontWeight: 700 }}>Decisive Factor</td>
                <td style={{ padding: "8px" }}>Synthesis of overall strength (ṣaḍbala, vargas)</td>
                <td style={{ padding: "8px" }}>Sub-lord's connection to supporting vs negating houses</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "aspects" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <h3 style={{ fontSize: "0.95rem", color: INDIGO, margin: "0 0 10px" }}>Parāśarī Aspect Logic</h3>
            <p style={{ fontSize: "0.8rem", color: INK_SECONDARY, margin: "0 0 10px" }}>
              Aspects are based on entire signs. Saturn in Libra aspects the signs Sagittarius (3rd aspect), Aries (7th aspect), and Cancer (10th aspect) with full strength.
            </p>
            <div style={{ background: `${INDIGO}0d`, borderLeft: `3px solid ${INDIGO}`, padding: "8px", fontSize: "0.75rem" }}>
              <strong>Result:</strong> Saturn aspects Lagna (Aries) and the 10th house (Cancer) directly.
            </div>
          </div>

          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 10px" }}>KP Star-Lord Signification</h3>
            <p style={{ fontSize: "0.8rem", color: INK_SECONDARY, margin: "0 0 10px" }}>
              KP redirects aspects into Star-Lords. A planet acts as a channel for the results of the houses lording its Nakṣatra Star-Lord.
            </p>
            <div style={{ background: `${GOLD}0d`, borderLeft: `3px solid ${GOLD}`, padding: "8px", fontSize: "0.75rem" }}>
              <strong>Result:</strong> Saturn in Venus star gives Venus's house significations (H7 marriage).
            </div>
          </div>
        </div>
      )}

      {activeTab === "ayanamsha" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontSize: "0.85rem", color: INK_SECONDARY, margin: "0" }}>
            Adjust the slider below to simulate an Ayanāṁśa drift. Watch how a planet near a nakṣatra boundary switches its Star-Lord and Sub-Lord, altering its KP significations.
          </p>

          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: INK_SECONDARY, marginBottom: "8px" }}>
              <span>Ayanāṁśa Offset (arcminutes):</span>
              <span style={{ color: GOLD, fontWeight: 700 }}>{ayanamshaOffset >= 0 ? `+${ayanamshaOffset}` : ayanamshaOffset}′</span>
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={ayanamshaOffset}
              onChange={(e) => setAyanamshaOffset(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: GOLD }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
              <h3 style={{ fontSize: "0.9rem", color: GOLD, margin: "0 0 8px" }}>Coordinates</h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0", fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>Saturn Degree: <strong>Libra {saturnResult.rawSaturnDeg.toFixed(3)}°</strong></li>
                <li>Nakṣatra Boundary: <strong>20.00° Libra (Vishakha starts)</strong></li>
                <li>Position: <span style={{ color: saturnResult.inVishakha ? GREEN : CRIMSON, fontWeight: 700 }}>{saturnResult.inVishakha ? "Passed Boundary (Vishakha)" : "Before Boundary (Swati)"}</span></li>
              </ul>
            </div>

            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
              <h3 style={{ fontSize: "0.9rem", color: GOLD, margin: "0 0 8px" }}>KP Dispositors</h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0", fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>Star-Lord: <strong>{saturnResult.starLord}</strong></li>
                <li>Sub-Lord: <strong>{saturnResult.subLord}</strong></li>
                <li>Cusp Activation: <strong>{saturnResult.starLord === "Jupiter" ? "Active (Supportive)" : "Muted"}</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "output" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ border: `1px solid ${INDIGO}44`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <h3 style={{ fontSize: "0.95rem", color: INDIGO, margin: "0 0 8px" }}>Parāśarī Qualitative Output</h3>
            <blockquote style={{ borderLeft: `3.5px solid ${INDIGO}`, paddingLeft: "10px", color: INK_SECONDARY, fontSize: "0.8rem", margin: "0" }}>
              "Marriage is promised but delayed. The exalted Saturn in the seventh house indicates maturity and patience, with marriage most likely to take place after age 28 during the Venus-Jupiter dasha."
            </blockquote>
          </div>

          <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 8px" }}>KP Binary / Timed Output</h3>
            <div style={{ background: `${GOLD}0d`, border: `1px solid ${GOLD}22`, borderRadius: 8, padding: "10px", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>Promise:</span>
                <span style={{ color: saturnInH7 ? GREEN : CRIMSON, fontWeight: 700 }}>
                  {saturnInH7 ? "YES" : "NO / Delay"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>Timing Window:</span>
                <span style={{ fontWeight: 700 }}>{saturnInH7 ? "Venus MD / Jupiter AD" : "Obstacles in H6"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Operative RPs:</span>
                <span style={{ fontWeight: 700 }}>Venus, Jupiter, Mars</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
