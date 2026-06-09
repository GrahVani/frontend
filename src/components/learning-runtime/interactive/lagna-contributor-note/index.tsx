"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, ShieldCheck, HelpCircle } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type TabKey = "anchoring" | "pervasiveness" | "eighth";

export function LagnaContributorNote() {
  const [lagnaSignNum, setLagnaSignNum] = useState<number>(1); // 1 = Aries, 12 = Pisces
  const [lagnaStrength, setLagnaStrength] = useState<number>(50); // 0 to 100
  const [activeTab, setActiveTab] = useState<TabKey>("anchoring");

  const handleReset = () => {
    setLagnaSignNum(1);
    setLagnaStrength(50);
    setActiveTab("anchoring");
  };

  // Compute absolute sign for a given house number (1-12)
  // House 1 = Lagna, House 2 = 2nd from Lagna, etc.
  const getSignForHouse = (houseNum: number) => {
    return ((lagnaSignNum - 1 + houseNum - 1) % 12) + 1;
  };

  // Inverse: Get house number for a given absolute sign number
  const getHouseForSign = (signNum: number) => {
    return ((signNum - lagnaSignNum + 12) % 12) + 1;
  };

  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 140, cy = 140, r = 95;
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({ x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad), angleDeg, rashiNum: i + 1 });
    }
    return points;
  }, []);

  const strengthFeedback = useMemo(() => {
    if (lagnaStrength < 30) {
      return { label: "Weak / Afflicted Frame", desc: "The chart's framework has low structural support. Auspicious transits in planetary BAVs will struggle to manifest their full potential.", color: "#ef4444" };
    } else if (lagnaStrength < 70) {
      return { label: "Medium / Supported Frame", desc: "Standard capacity. Planetary transits and natal yogas behave as calculated standard values.", color: GOLD };
    } else {
      return { label: "Strong / Luminous Frame", desc: "Excellent structural foundation. Even weaker transits are mitigated and stabilized by the overall vitality of the Ascendant.", color: "#16a34a" };
    }
  }, [lagnaStrength]);

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Why the Lagna is the Eighth Contributor
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Explore how the Ascendant anchors the house system and acts on par with planets in <IAST>Aṣṭakavarga</IAST>.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* TWO COLUMN GRID */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: Dynamic House Wheel */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <div style={{ display: "flex", gap: "4px", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>Lagna Sign:</span>
            <select
              value={lagnaSignNum}
              onChange={(e) => setLagnaSignNum(Number(e.target.value))}
              style={{
                padding: "4px",
                borderRadius: "6px",
                border: "1px solid rgba(156,122,47,0.2)",
                fontSize: "11px",
                color: INK_PRIMARY,
                background: "#ffffff",
                cursor: "pointer"
              }}
            >
              {RASHIS.map(r => (
                <option key={r.number} value={r.number}>
                  {r.nameEnglish} ({r.number})
                </option>
              ))}
            </select>
          </div>

          <div style={{ position: "relative", width: "260px", height: "260px" }}>
            <svg width="260" height="260" viewBox="0 0 300 300">
              <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="2" />
              <circle cx="150" cy="150" r="65" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />
              
              {/* Sector Division Lines */}
              {RASHIS.map((_, i) => {
                const angleDeg = i * 30 - 105;
                const angleRad = (angleDeg * Math.PI) / 180;
                const lx = 150 + 130 * Math.cos(angleRad);
                const ly = 150 + 130 * Math.sin(angleRad);
                return <line key={`line-${i}`} x1="150" y1="150" x2={lx} y2={ly} stroke="rgba(156,122,47,0.08)" strokeWidth="1.2" />;
              })}

              {/* Rashi Paths and Highlights */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                const isLagna = num === lagnaSignNum;
                
                let fill = "transparent";
                let stroke = "none";
                if (isLagna) {
                  fill = `color-mix(in srgb, ${GOLD_DEEP} 8%, transparent)`;
                  stroke = GOLD_DEEP;
                }

                const startAngle = i * 30 - 105;
                const endAngle = i * 30 - 75;
                const so = { x: 150 + 130 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((startAngle * Math.PI) / 180) };
                const eo = { x: 150 + 130 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((endAngle * Math.PI) / 180) };
                const si = { x: 150 + 65 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 65 * Math.sin((startAngle * Math.PI) / 180) };
                const ei = { x: 150 + 65 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 65 * Math.sin((endAngle * Math.PI) / 180) };
                
                const pathData = [
                  `M ${si.x} ${si.y}`,
                  `L ${so.x} ${so.y}`,
                  `A 130 130 0 0 1 ${eo.x} ${eo.y}`,
                  `L ${ei.x} ${ei.y}`,
                  `A 65 65 0 0 0 ${si.x} ${si.y}`,
                  "Z"
                ].join(" ");

                return (
                  <path
                    key={`lpath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isLagna ? "2.5" : "0.5"}
                    style={{ cursor: "pointer", transition: "all 0.15s" }}
                    onClick={() => setLagnaSignNum(num)}
                  />
                );
              })}

              {/* Central rays showing anchoring */}
              {circlePoints.map(p => {
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptInner = { x: 150 + 65 * Math.cos(angleRad), y: 150 + 65 * Math.sin(angleRad) };
                return (
                  <line
                    key={`ray-${p.rashiNum}`}
                    x1="150"
                    y1="150"
                    x2={ptInner.x}
                    y2={ptInner.y}
                    stroke={p.rashiNum === lagnaSignNum ? GOLD_DEEP : "rgba(156,122,47,0.08)"}
                    strokeWidth={p.rashiNum === lagnaSignNum ? "2" : "0.5"}
                    strokeDasharray={p.rashiNum === lagnaSignNum ? "none" : "2,2"}
                  />
                );
              })}

              {/* Labels */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiNum - 1];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
                const ptHouse = { x: 150 + 80 * Math.cos(angleRad), y: 150 + 80 * Math.sin(angleRad) };

                const isLagna = p.rashiNum === lagnaSignNum;
                const houseNum = getHouseForSign(p.rashiNum);

                return (
                  <g key={`llabel-${p.rashiNum}`}>
                    {/* English Sign Name */}
                    <text
                      x={ptEng.x}
                      y={ptEng.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "8px", fontWeight: 700, fill: INK_PRIMARY }}
                    >
                      {r.nameEnglish}
                    </text>

                    {/* House Label */}
                    <g style={{ cursor: "pointer" }} onClick={() => setLagnaSignNum(p.rashiNum)}>
                      <circle
                        cx={ptHouse.x}
                        cy={ptHouse.y}
                        r={isLagna ? "13" : "10"}
                        fill={isLagna ? GOLD_DEEP : "rgba(156,122,47,0.04)"}
                        stroke={isLagna ? "#ffffff" : "rgba(156,122,47,0.12)"}
                        strokeWidth="1"
                      />
                      <text
                        x={ptHouse.x}
                        y={ptHouse.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: isLagna ? "9px" : "8px", fontWeight: 800, fill: isLagna ? "#ffffff" : INK_SECONDARY }}
                      >
                        {isLagna ? "Lg" : `${houseNum}H`}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="150" cy="150" r="28" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <text x="150" y="146" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>ASC</text>
              <text x="150" y="160" textAnchor="middle" style={{ fontSize: "14px", fontWeight: 950, fill: GOLD_DEEP }}>Lg</text>
            </svg>
          </div>
        </div>

        {/* Right Column: Anchoring & Strength Simulator */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          {/* Tab Selection */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "2px" }}>
            {(["anchoring", "pervasiveness", "eighth"] as TabKey[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "6px 4px",
                  border: "none",
                  borderBottom: activeTab === tab ? `2px solid ${GOLD_DEEP}` : "none",
                  background: "transparent",
                  fontSize: "11px",
                  fontWeight: activeTab === tab ? 750 : 500,
                  color: activeTab === tab ? GOLD_DEEP : INK_SECONDARY,
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                {tab === "anchoring" ? "Anchoring" : tab === "pervasiveness" ? "Pervasiveness" : "8th Contributor"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, minHeight: "110px" }}>
            {activeTab === "anchoring" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 750, color: GOLD_DEEP }}>
                  House Frame Anchoring
                </h4>
                <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
                  The Lagna acts as the <strong>zero point</strong> of the house frame. Every house is calculated relative to it (e.g. if Lagna is Taurus, Taurus becomes the 1st house, Gemini the 2nd house, and so on).
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: INK_MUTED, fontStyle: "italic" }}>
                  * Shifting the Lagna dropdown above rotates the house markers (Lg, 2H, 3H) across the sign segments.
                </p>
              </div>
            )}

            {activeTab === "pervasiveness" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 750, color: GOLD_DEEP }}>
                  Whole-Chart Pervasiveness
                </h4>
                <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
                  Because the Lagna coordinates how planetary energies manifest physically, a strong or supported Lagna enables all other planetary combinations to realize their values cleanly.
                </p>
                
                {/* Strength slider */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", background: "rgba(0,0,0,0.02)", padding: "8px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.04)", marginTop: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: 700 }}>
                    <span>Lagna Strength:</span>
                    <span style={{ color: strengthFeedback.color }}>{strengthFeedback.label}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={lagnaStrength}
                    onChange={(e) => setLagnaStrength(Number(e.target.value))}
                    style={{ width: "100%", accentColor: strengthFeedback.color, cursor: "pointer", margin: "2px 0" }}
                  />
                  <span style={{ fontSize: "10px", color: INK_MUTED, lineHeight: "1.35" }}>
                    {strengthFeedback.desc}
                  </span>
                </div>
              </div>
            )}

            {activeTab === "eighth" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 750, color: GOLD_DEEP }}>
                  The 8th Contributor Status
                </h4>
                <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
                  Rather than treating Lagna as a secondary passive point, the classical <IAST>aṣṭakavarga</IAST> architecture grants it active donor status. It possesses its own fixed tables, donating bindus to houses counted relative to itself just like a planet.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(156,122,47,0.05)", padding: "8px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", marginTop: "4px" }}>
                  <ShieldCheck size={16} color={GOLD_DEEP} />
                  <span style={{ fontSize: "10.5px", fontWeight: 650, color: GOLD_DEEP }}>
                    Self-Referential Architecture: The frame participates in the calculations!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "9.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). The inclusion of the Lagna as the eighth active contributor formalizes the whole-chart influence of the Ascendant. It anchors all 12 houses.
      </div>
    </div>
  );
}
