"use client";

import React, { useState, useMemo } from "react";
import { AlertTriangle, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import { RASHIS } from "../rashi-data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const GREEN = "#10b981";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

export function EclipseSignificanceChecker() {
  // Eclipse Parameters
  const [eclipseSign, setEclipseSign] = useState<string>("Virgo");
  const [eclipseDegree, setEclipseDegree] = useState<number>(14);
  const [eclipseType, setEclipseType] = useState<string>("Solar");

  // Chart sensitive points (Signs and Degrees)
  const [lagnaSign, setLagnaSign] = useState<string>("Taurus");
  const [lagnaDegree, setLagnaDegree] = useState<number>(22);

  const [moonSign, setMoonSign] = useState<string>("Virgo");
  const [moonDegree, setMoonDegree] = useState<number>(16); // Hits Virgo within 2°!

  const [sunSign, setSunSign] = useState<string>("Leo");
  const [sunDegree, setSunDegree] = useState<number>(5);

  const [dashaSign, setDashaSign] = useState<string>("Capricorn");
  const [dashaDegree, setDashaDegree] = useState<number>(10);

  // Compute significance hits based on tight 6° orb in the same sign
  const hits = useMemo(() => {
    const list: Array<{ name: string; sign: string; degree: number; diff: number; desc: string }> = [];

    // Check Lagna
    if (lagnaSign === eclipseSign) {
      const diff = Math.abs(lagnaDegree - eclipseDegree);
      if (diff <= 6) {
        list.push({
          name: "Natal Lagna Cusp",
          sign: lagnaSign,
          degree: lagnaDegree,
          diff,
          desc: "Identifies with a direct shake-up of physical vitality, lifestyle focus, and self-expression. Grasping or releasing bodily choices."
        });
      }
    }

    // Check Moon
    if (moonSign === eclipseSign) {
      const diff = Math.abs(moonDegree - eclipseDegree);
      if (diff <= 6) {
        list.push({
          name: "Natal Moon (Manas)",
          sign: moonSign,
          degree: moonDegree,
          diff,
          desc: "Direct hit on the mind and emotional baseline. Can trigger temporary feelings of isolation, anxiety, or emotional sorting. Practice meditation."
        });
      }
    }

    // Check Sun
    if (sunSign === eclipseSign) {
      const diff = Math.abs(sunDegree - eclipseDegree);
      if (diff <= 6) {
        list.push({
          name: "Natal Sun (Atma)",
          sign: sunSign,
          degree: sunDegree,
          diff,
          desc: "Hits the core identity, career status, ego-expression, and father/authority matters. Focus on authentic values."
        });
      }
    }

    // Check Dasha Lord
    if (dashaSign === eclipseSign) {
      const diff = Math.abs(dashaDegree - eclipseDegree);
      if (diff <= 6) {
        list.push({
          name: "Vimshottari Dasha Lord",
          sign: dashaSign,
          degree: dashaDegree,
          diff,
          desc: "Hits the planet actively ruling your timeline. Triggers immediate events and changes in the houses ruled by this planet."
        });
      }
    }

    return list;
  }, [eclipseSign, eclipseDegree, lagnaSign, lagnaDegree, moonSign, moonDegree, sunSign, sunDegree, dashaSign, dashaDegree]);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 248, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}
    >
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: GOLD_DEEP }}>
          ग्रहण सार्थकता-यन्त्र — Eclipse Significance Checker
        </h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: INK_SECONDARY }}>
          Verify if an eclipse is significant for a chart. In astrology, an eclipse only matters to an individual when its degree directly hits a sensitive point.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        
        {/* Left Column: Eclipse Configurator */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>
              1. Configure Eclipse Position
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Type */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>Eclipse Type:</span>
                <div style={{ display: "flex", gap: "4px" }}>
                  {["Solar", "Lunar"].map(t => (
                    <button
                      key={t}
                      onClick={() => setEclipseType(t)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: eclipseType === t ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.1)",
                        background: eclipseType === t ? "rgba(156,122,47,0.06)" : "#ffffff",
                        color: eclipseType === t ? GOLD_DEEP : INK_SECONDARY,
                        fontWeight: 700,
                        fontSize: "10px",
                        cursor: "pointer"
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>
                  Eclipse Sign:
                </label>
                <select
                  value={eclipseSign}
                  onChange={(e) => setEclipseSign(e.target.value)}
                  style={{ width: "100%", padding: "5px", borderRadius: "4px", border: "1px solid rgba(0,0,0,0.15)", fontSize: "11px", color: INK_PRIMARY }}
                >
                  {RASHIS.map(r => (
                    <option key={r.number} value={r.nameEnglish}>{r.number} - {r.nameEnglish} ({r.nameDevanagari})</option>
                  ))}
                </select>
              </div>

              {/* Degree Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: INK_SECONDARY, marginBottom: "4px" }}>
                  <span>Eclipse Degree:</span>
                  <strong>{eclipseDegree}°</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="29"
                  step="1"
                  value={eclipseDegree}
                  onChange={(e) => setEclipseDegree(Number(e.target.value))}
                  style={{ width: "100%", accentColor: GOLD, cursor: "pointer" }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Middle Column: Natal Sensitive Points */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>
              2. Natal sensitive points
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Moon sign/deg */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: INK_PRIMARY, fontWeight: 700, marginBottom: "4px" }}>
                  <span>Natal Moon:</span>
                  <span>{moonDegree}° in {moonSign}</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <select
                    value={moonSign}
                    onChange={(e) => setMoonSign(e.target.value)}
                    style={{ flex: 1.5, padding: "3px", fontSize: "10.5px", color: INK_PRIMARY }}
                  >
                    {RASHIS.map(r => (
                      <option key={r.number} value={r.nameEnglish}>{r.nameEnglish}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="29"
                    value={moonDegree}
                    onChange={(e) => setMoonDegree(Number(e.target.value))}
                    style={{ flex: 1, padding: "3px", fontSize: "10.5px", color: INK_PRIMARY }}
                  />
                </div>
              </div>

              {/* Lagna sign/deg */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: INK_PRIMARY, fontWeight: 700, marginBottom: "4px" }}>
                  <span>Natal Lagna:</span>
                  <span>{lagnaDegree}° in {lagnaSign}</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <select
                    value={lagnaSign}
                    onChange={(e) => setLagnaSign(e.target.value)}
                    style={{ flex: 1.5, padding: "3px", fontSize: "10.5px", color: INK_PRIMARY }}
                  >
                    {RASHIS.map(r => (
                      <option key={r.number} value={r.nameEnglish}>{r.nameEnglish}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="29"
                    value={lagnaDegree}
                    onChange={(e) => setLagnaDegree(Number(e.target.value))}
                    style={{ flex: 1, padding: "3px", fontSize: "10.5px", color: INK_PRIMARY }}
                  />
                </div>
              </div>

              {/* Sun sign/deg */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: INK_PRIMARY, fontWeight: 700, marginBottom: "4px" }}>
                  <span>Natal Sun:</span>
                  <span>{sunDegree}° in {sunSign}</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <select
                    value={sunSign}
                    onChange={(e) => setSunSign(e.target.value)}
                    style={{ flex: 1.5, padding: "3px", fontSize: "10.5px", color: INK_PRIMARY }}
                  >
                    {RASHIS.map(r => (
                      <option key={r.number} value={r.nameEnglish}>{r.nameEnglish}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="29"
                    value={sunDegree}
                    onChange={(e) => setSunDegree(Number(e.target.value))}
                    style={{ flex: 1, padding: "3px", fontSize: "10.5px", color: INK_PRIMARY }}
                  />
                </div>
              </div>

              {/* Dasha Lord sign/deg */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: INK_PRIMARY, fontWeight: 700, marginBottom: "4px" }}>
                  <span>Dasha Lord Planet:</span>
                  <span>{dashaDegree}° in {dashaSign}</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <select
                    value={dashaSign}
                    onChange={(e) => setDashaSign(e.target.value)}
                    style={{ flex: 1.5, padding: "3px", fontSize: "10.5px", color: INK_PRIMARY }}
                  >
                    {RASHIS.map(r => (
                      <option key={r.number} value={r.nameEnglish}>{r.nameEnglish}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="29"
                    value={dashaDegree}
                    onChange={(e) => setDashaDegree(Number(e.target.value))}
                    style={{ flex: 1, padding: "3px", fontSize: "10.5px", color: INK_PRIMARY }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Significance Verdict */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {hits.length > 0 ? (
            <div style={{
              background: "rgba(244, 63, 94, 0.06)",
              border: `1.5px solid ${RED}`,
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: RED }}>
                <AlertTriangle size={20} />
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800 }}>
                  Significant Eclipse Alignment!
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.4", color: INK_SECONDARY }}>
                The upcoming {eclipseType.toLowerCase()} eclipse falls in <strong>{eclipseSign} at {eclipseDegree}°</strong>, directly aligning with {hits.length} of your chart's sensitive points within a tight 6° orb:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                {hits.map((h, idx) => {
                  const spX = 20 + (h.degree / 30) * 220;
                  const ecX = 20 + (eclipseDegree / 30) * 220;
                  const leftEdge = Math.max(0, h.degree - 6);
                  const rightEdge = Math.min(30, h.degree + 6);
                  const leftX = 20 + (leftEdge / 30) * 220;
                  const rightX = 20 + (rightEdge / 30) * 220;
                  const zoneWidth = rightX - leftX;

                  return (
                    <div key={idx} style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid rgba(244, 63, 94, 0.15)", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: RED }}>
                        <span>🎯 {h.name} Hit</span>
                        <span>Orb: {h.diff.toFixed(1)}°</span>
                      </div>
                      <div style={{ fontSize: "11.5px", color: INK_SECONDARY, lineHeight: "1.35" }}>{h.desc}</div>
                      
                      {/* Visual Orb Gauge */}
                      <div style={{ background: "rgba(0,0,0,0.02)", padding: "8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.03)" }}>
                        <span style={{ fontSize: "9px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                          Degree Orb Alignment (6° Shaded Impact Zone)
                        </span>
                        <svg width="100%" height="45" viewBox="0 0 260 45">
                          {/* Gray axis line */}
                          <line x1="20" y1="20" x2="240" y2="20" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Tick marks */}
                          <line x1="20" y1="17" x2="20" y2="23" stroke="#94a3b8" strokeWidth="1" />
                          <line x1="93.3" y1="17" x2="93.3" y2="23" stroke="#94a3b8" strokeWidth="1" />
                          <line x1="166.6" y1="17" x2="166.6" y2="23" stroke="#94a3b8" strokeWidth="1" />
                          <line x1="240" y1="17" x2="240" y2="23" stroke="#94a3b8" strokeWidth="1" />
                          
                          {/* Tick labels */}
                          <text x="20" y="11" textAnchor="middle" style={{ fontSize: "7px", fill: "#64748b" }}>0°</text>
                          <text x="93.3" y="11" textAnchor="middle" style={{ fontSize: "7px", fill: "#64748b" }}>10°</text>
                          <text x="166.6" y="11" textAnchor="middle" style={{ fontSize: "7px", fill: "#64748b" }}>20°</text>
                          <text x="240" y="11" textAnchor="middle" style={{ fontSize: "7px", fill: "#64748b" }}>30°</text>

                          {/* Shaded impact zone (±6°) */}
                          <rect x={leftX} y="14" width={zoneWidth} height="12" fill="rgba(244, 63, 94, 0.12)" stroke="rgba(244, 63, 94, 0.25)" strokeWidth="1" rx="2" />

                          {/* Sensitive point marker */}
                          <circle cx={spX} cy="20" r="4.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
                          <text x={spX} y="36" textAnchor="middle" style={{ fontSize: "7px", fontWeight: "bold", fill: "#1e3a8a" }}>Natal ({h.degree}°)</text>

                          {/* Eclipse marker */}
                          <circle cx={ecX} cy="20" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                          <text x={ecX} y="36" textAnchor="middle" style={{ fontSize: "7px", fontWeight: "bold", fill: "#7f1d1d" }}>Eclipse ({eclipseDegree}°)</text>
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{
              background: "rgba(16, 185, 129, 0.06)",
              border: `1.5px solid ${GREEN}`,
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: GREEN }}>
                <ShieldCheck size={20} />
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800 }}>
                  Non-Aligned Eclipse (Reassurance)
                </h4>
              </div>
              
              <div style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                Status: General Astronomical Event Only
              </div>

              <p style={{ margin: 0, fontSize: "12.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
                The eclipse falls in <strong>{eclipseSign} at {eclipseDegree}°</strong>. 
                There are <strong>no natal sensitive points</strong> (Moon, Lagna, Sun, Dasha Lord) in {eclipseSign} within a 6° orb of this degree.
              </p>

              <div style={{ background: "#ffffff", padding: "10px", borderRadius: "6px", border: "1px solid rgba(16,185,129,0.15)", fontSize: "11.5px", color: "#14532d", lineHeight: "1.4" }}>
                <strong>Honest Astrological Framing:</strong> 
                “This eclipse is a spectacular event in the sky, but it does not contact your chart's coordinates. You do not need to fear it or perform any alarmist remedies. Treat it as a natural sky alignment.”
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
