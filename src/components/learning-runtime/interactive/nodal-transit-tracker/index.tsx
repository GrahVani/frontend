"use client";

import React, { useState, useMemo } from "react";
import { Compass, Calendar, MoveDown, HelpCircle, Eye } from "lucide-react";
import { RASHIS } from "../rashi-data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

const TRANSIT_DATES = [
  "Apr 12, 2022 - Oct 30, 2023",
  "Oct 30, 2023 - May 18, 2025",
  "May 18, 2025 - Dec 5, 2026",
  "Dec 5, 2026 - Jun 26, 2028",
  "Jun 26, 2028 - Jan 15, 2030",
  "Jan 15, 2030 - Aug 9, 2031",
  "Aug 9, 2031 - Feb 25, 2033",
  "Feb 25, 2033 - Sep 16, 2034",
  "Sep 16, 2034 - Apr 8, 2036",
  "Apr 8, 2036 - Oct 28, 2037",
  "Oct 28, 2037 - May 19, 2039",
  "May 19, 2039 - Dec 7, 2040"
];

// Transit Sign interpretations for Rahu (Desire) and Ketu (Release)
const TRANSIT_SIGN_MATTERS: Record<string, { rahu: string; ketu: string }> = {
  Aries: {
    rahu: "Obsessive focus on self-reliance, physical action, and pioneering initiatives. Can trigger impulsive egotism.",
    ketu: "Detachment from partnership negotiations, letting go of dependency on others, and dissolving collaborative indecision."
  },
  Taurus: {
    rahu: "Intense desire to accumulate wealth, secure physical assets, and command speech. Grasping for material stability.",
    ketu: "Dissolving attachments to joint assets, inheritances, occult secrets, and intense psychological crises."
  },
  Gemini: {
    rahu: "Obsessive curiosity, expanding local travel, writing projects, and short-term skills. Over-active communication.",
    ketu: "Releasing dogmatic spiritual beliefs, detachment from formal gurus, and letting go of long-distance wanderlust."
  },
  Cancer: {
    rahu: "Searching for domestic security, home comfort, and maternal safety. Obsessive emotional nesting.",
    ketu: "Letting go of career attachments, dissolution of public status obsessions, and retirement from social leadership pressures."
  },
  Leo: {
    rahu: "Intense urge for personal recognition, creative expression, children, and speculation. Expanding ego-expression.",
    ketu: "Detaching from massive networks, dissolving reliance on large social gains, and stepping back from group dynamics."
  },
  Virgo: {
    rahu: "Obsessive detail-oriented work, daily service, healing discipline, and conflict management. Focus on hygiene and debts.",
    ketu: "Dissolving subconscious loops, releasing fear of isolation, and letting go of dreams or spiritual expenditure blockages."
  },
  Libra: {
    rahu: "Intense focus on finding alliances, business partnerships, and marriage. Grasping for external harmony.",
    ketu: "Detachment from pure self-will, letting go of raw personal demands, and dissolving isolationist tendencies."
  },
  Scorpio: {
    rahu: "Intense curiosity in occult sciences, joint finance, psychological restructuring, and secret transactions.",
    ketu: "Dissolving material accumulation attachments, letting go of static security, and speaking with quiet detachment."
  },
  Sagittarius: {
    rahu: "Searching for long-distance travel, spiritual dharma, higher wisdom, and mentor blessings. Expanding philosophy.",
    ketu: "Releasing over-reliance on local network gossip, sibling dependencies, and short-term communication loops."
  },
  Capricorn: {
    rahu: "Obsessive focus on professional status, public career, and societal duties. Material ambition.",
    ketu: "Detaching from domestic safety loops, letting go of emotional nesting comforts, and dissolving family dependencies."
  },
  Aquarius: {
    rahu: "Desire for large networks, global cashflows, social gains, and humanitarian groups. Expanding gains.",
    ketu: "Releasing obsession with private speculation, detaching from ego-centric creativity, and dissolving pride."
  },
  Pisces: {
    rahu: "Expanding spiritual retreat, overseas travels, dreams, and subconscious work. Dissolving boundaries.",
    ketu: "Detaching from microscopic task-management, letting go of obsessive checking, and releasing critical arguments."
  }
};

export function NodalTransitTracker() {
  const [step, setStep] = useState<number>(0); // 18-month steps (0 to 11 = 18 years)
  const [focusMode, setFocusMode] = useState<"rahu" | "ketu">("rahu");

  // Retrograde calculations:
  // Node starts at Aries (Sign 1, index 0).
  // Retrograde means signs move backwards: Aries (1) -> Pisces (12) -> Aquarius (11) -> Capricorn (10)...
  const rahuSignNum = useMemo(() => {
    return ((12 - (step % 12)) % 12) + 1;
  }, [step]);

  const ketuSignNum = useMemo(() => {
    return ((rahuSignNum + 6 - 1) % 12) + 1;
  }, [rahuSignNum]);

  const rahuRashi = useMemo(() => {
    return RASHIS.find(r => r.number === rahuSignNum) || RASHIS[0];
  }, [rahuSignNum]);

  const ketuRashi = useMemo(() => {
    return RASHIS.find(r => r.number === ketuSignNum) || RASHIS[0];
  }, [ketuSignNum]);

  // Year mapping: step * 1.5 years
  const activeYear = useMemo(() => {
    return step * 1.5;
  }, [step]);

  // Coordinates for placing signs in standard clockwise top-centered circle
  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 150;
    const cy = 150;
    const r = 98; // Adjusted radius to prevent overlaps
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90; // Aries at top
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({
        rashiNum: i + 1,
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad),
        angleDeg
      });
    }
    return points;
  }, []);

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
          राहु-केतुगोचरचक्रम् — Rāhu-Ketu Nodal Transit Tracker
        </h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: INK_SECONDARY }}>
          Watch the retrograde nodal axis transit backward through the zodiac in 18-month cycles, activating opposite sign polarities.
        </p>
      </div>

      {/* Main Split Layout */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        
        {/* Left Circular Wheel */}
        <div style={{
          flex: "1 1 300px",
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid rgba(156,122,47,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <h4 style={{ margin: "0 0 16px 0", fontSize: "12px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
            Retrograde Zodiac Ray Compass
          </h4>

          <div style={{ position: "relative", width: "300px", height: "300px" }}>
            <svg width="300" height="300" viewBox="0 0 300 300">
              {/* Outer wheel boundary (radius 120) */}
              <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              {/* Inner wheel boundary (radius 70) */}
              <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(156,122,47,0.08)" strokeWidth="1" />
              
              {/* Division lines */}
              {circlePoints.map((p, idx) => {
                const dividerAngleRad = ((p.angleDeg - 15) * Math.PI) / 180;
                return (
                  <line
                    key={`div-${idx}`}
                    x1="150"
                    y1="150"
                    x2={150 + 120 * Math.cos(dividerAngleRad)}
                    y2={150 + 120 * Math.sin(dividerAngleRad)}
                    stroke="rgba(156,122,47,0.08)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Draw Favourability Arc Shadows */}
              {(() => {
                const rIdx = rahuSignNum - 1;
                const kIdx = ketuSignNum - 1;

                const makeArc = (idx: number, fillHex: string) => {
                  const angle = idx * 30 - 90;
                  const startOuter = { x: 150 + 120 * Math.cos((angle * Math.PI) / 180), y: 150 + 120 * Math.sin((angle * Math.PI) / 180) };
                  const endOuter = { x: 150 + 120 * Math.cos(((angle + 30) * Math.PI) / 180), y: 150 + 120 * Math.sin(((angle + 30) * Math.PI) / 180) };
                  const startInner = { x: 150 + 70 * Math.cos((angle * Math.PI) / 180), y: 150 + 70 * Math.sin((angle * Math.PI) / 180) };
                  const endInner = { x: 150 + 70 * Math.cos(((angle + 30) * Math.PI) / 180), y: 150 + 70 * Math.sin(((angle + 30) * Math.PI) / 180) };
                  return [
                    `M ${startInner.x} ${startInner.y}`,
                    `L ${startOuter.x} ${startOuter.y}`,
                    `A 120 120 0 0 1 ${endOuter.x} ${endOuter.y}`,
                    `L ${endInner.x} ${endInner.y}`,
                    `A 70 70 0 0 0 ${startInner.x} ${startInner.y}`,
                    "Z"
                  ].join(" ");
                };

                return (
                  <>
                    <path d={makeArc(rIdx, PURPLE)} fill={`${PURPLE}12`} stroke={PURPLE} strokeWidth="1.5" />
                    <path d={makeArc(kIdx, AMBER)} fill={`${AMBER}12`} stroke={AMBER} strokeWidth="1.5" />
                  </>
                );
              })()}

              {/* Stacked Rashi text labels (Aligned cleanly to prevent overlapping) */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiNum - 1];
                const labelAngleRad = ((p.angleDeg + 15) * Math.PI) / 180;
                
                const ptEng = { x: 150 + 105 * Math.cos(labelAngleRad), y: 150 + 105 * Math.sin(labelAngleRad) };
                const ptDev = { x: 150 + 86 * Math.cos(labelAngleRad), y: 150 + 86 * Math.sin(labelAngleRad) };
                const ptNum = { x: 150 + 54 * Math.cos(labelAngleRad), y: 150 + 54 * Math.sin(labelAngleRad) };

                return (
                  <g key={p.rashiNum}>
                    <text x={ptEng.x} y={ptEng.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8.5px", fontWeight: 700, fill: INK_PRIMARY }}>
                      {r.nameEnglish}
                    </text>
                    <text x={ptDev.x} y={ptDev.y + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: INK_MUTED }}>
                      {r.nameDevanagari}
                    </text>
                    <text x={ptNum.x} y={ptNum.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fontWeight: 800, fill: INK_MUTED }}>
                      {r.number}
                    </text>
                  </g>
                );
              })}

              {/* Persistent 180° opposite axis line (extended to outer orbit) */}
              {(() => {
                const rAngleRad = ((rahuSignNum * 30 - 75) * Math.PI) / 180;
                const kAngleRad = ((ketuSignNum * 30 - 75) * Math.PI) / 180;
                const rx = 150 + 130 * Math.cos(rAngleRad);
                const ry = 150 + 130 * Math.sin(rAngleRad);
                const kx = 150 + 130 * Math.cos(kAngleRad);
                const ky = 150 + 130 * Math.sin(kAngleRad);
                return (
                  <line x1={rx} y1={ry} x2={kx} y2={ky} stroke={GOLD} strokeWidth="1.5" strokeDasharray="3 3" style={{ opacity: 0.65 }} />
                );
              })()}

              {/* Rahu (Head ☊) Node sphere orbiting outside the text area */}
              {(() => {
                const angleRad = ((rahuSignNum * 30 - 75) * Math.PI) / 180;
                const rx = 150 + 134 * Math.cos(angleRad);
                const ry = 150 + 134 * Math.sin(angleRad);
                const isFocused = focusMode === "rahu";
                return (
                  <g style={{ transition: "all 0.2s ease-out" }}>
                    {isFocused && (
                      <circle
                        cx={rx}
                        cy={ry}
                        r="18"
                        fill="none"
                        stroke={PURPLE}
                        strokeWidth="2"
                        strokeDasharray="3 2"
                        style={{ opacity: 0.8 }}
                      />
                    )}
                    <circle cx={rx} cy={ry} r="12" fill={PURPLE} stroke="#ffffff" strokeWidth="1.5" />
                    <text x={rx} y={ry + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fill: "#ffffff", fontWeight: 800 }}>
                      ☊
                    </text>
                  </g>
                );
              })()}

              {/* Ketu (Tail ☋) Node sphere orbiting outside the text area */}
              {(() => {
                const angleRad = ((ketuSignNum * 30 - 75) * Math.PI) / 180;
                const kx = 150 + 134 * Math.cos(angleRad);
                const ky = 150 + 134 * Math.sin(angleRad);
                const isFocused = focusMode === "ketu";
                return (
                  <g style={{ transition: "all 0.2s ease-out" }}>
                    {isFocused && (
                      <circle
                        cx={kx}
                        cy={ky}
                        r="18"
                        fill="none"
                        stroke={AMBER}
                        strokeWidth="2"
                        strokeDasharray="3 2"
                        style={{ opacity: 0.8 }}
                      />
                    )}
                    <circle cx={kx} cy={ky} r="12" fill={AMBER} stroke="#ffffff" strokeWidth="1.5" />
                    <text x={kx} y={ky + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fill: "#ffffff", fontWeight: 800 }}>
                      ☋
                    </text>
                  </g>
                );
              })()}

              {/* Core Label */}
              <circle cx="150" cy="150" r="30" fill="rgba(156,122,47,0.06)" />
              <text x="150" y="148" textAnchor="middle" style={{ fontSize: "8px", fontWeight: 700, fill: GOLD_DEEP }}>
                NODAL
              </text>
              <text x="150" y="158" textAnchor="middle" style={{ fontSize: "8px", fontWeight: 700, fill: GOLD_DEEP }}>
                AXIS
              </text>
            </svg>
          </div>
        </div>

        {/* Right Panel: Controls & Focus */}
        <div style={{ flex: "1.2 1 360px", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Time Scrubber */}
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: INK_PRIMARY, display: "flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={15} /> SCRUB TRANSIT TIMELINE
              </span>
              <span style={{ fontSize: "13px", fontWeight: 800, color: GOLD_DEEP }}>
                Year {activeYear.toFixed(1)} / 18.0
              </span>
            </div>

            {/* Exact Transit Period Display */}
            <div style={{
              fontSize: "12px",
              fontWeight: 600,
              color: GOLD_DEEP,
              background: "rgba(156, 122, 47, 0.08)",
              padding: "4px 8px",
              borderRadius: "4px",
              marginBottom: "8px",
              textAlign: "center"
            }}>
              📅 Transit Period: {TRANSIT_DATES[step]}
            </div>

            <input
              type="range"
              min="0"
              max="11"
              step="1"
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              style={{
                width: "100%",
                margin: 0,
                accentColor: GOLD,
                cursor: "pointer"
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED, marginTop: "4px" }}>
              <span>Start (0 yr)</span>
              <span>4.5 yr</span>
              <span>9.0 yr</span>
              <span>13.5 yr</span>
              <span>End (18 yr)</span>
            </div>
            
            <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: INK_SECONDARY, background: "rgba(0,0,0,0.03)", padding: "6px 10px", borderRadius: "6px" }}>
              <Compass size={14} color={GOLD} />
              <span><strong>Direction:</strong> Nodes move backward (Pisces → Aquarius...). Clockwise on wheel.</span>
            </div>
          </div>

          {/* Node Focus Selector */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "6px" }}>
              Select Active Focus Node
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setFocusMode("rahu")}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: focusMode === "rahu" ? `2px solid ${PURPLE}` : "1px solid rgba(0,0,0,0.1)",
                  background: focusMode === "rahu" ? "rgba(139,92,246,0.06)" : "#ffffff",
                  color: focusMode === "rahu" ? PURPLE : INK_SECONDARY,
                  fontWeight: 700,
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                ☊ Rāhu (Desire / Grasping Focus)
              </button>
              <button
                onClick={() => setFocusMode("ketu")}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: focusMode === "ketu" ? `2px solid ${AMBER}` : "1px solid rgba(0,0,0,0.1)",
                  background: focusMode === "ketu" ? "rgba(245,158,11,0.06)" : "#ffffff",
                  color: focusMode === "ketu" ? AMBER : INK_SECONDARY,
                  fontWeight: 700,
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                ☋ Ketu (Release / Detachment Focus)
              </button>
            </div>
          </div>

          {/* Polarity Summary Card */}
          <div style={{
            background: "rgba(156,122,47,0.03)",
            border: `1.2px solid rgba(156,122,47,0.15)`,
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: GOLD_DEEP }}>
              Active Polarity: {rahuRashi.nameEnglish} - {ketuRashi.nameEnglish} Axis
            </h4>

            <div style={{ fontSize: "12px", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "8px" }}>
              <div>
                <span style={{ fontWeight: 700, color: PURPLE, display: "block", marginBottom: "2px" }}>
                  ☊ Rāhu in {rahuRashi.nameEnglish} ({rahuRashi.nameDevanagari}):
                </span>
                <p style={{ margin: 0, lineHeight: "1.4" }}>
                  {TRANSIT_SIGN_MATTERS[rahuRashi.nameEnglish]?.rahu}
                </p>
              </div>

              <div style={{ borderTop: "1px dashed rgba(156,122,47,0.15)", paddingTop: "8px" }}>
                <span style={{ fontWeight: 700, color: AMBER, display: "block", marginBottom: "2px" }}>
                  ☋ Ketu in {ketuRashi.nameEnglish} ({ketuRashi.nameDevanagari}):
                </span>
                <p style={{ margin: 0, lineHeight: "1.4" }}>
                  {TRANSIT_SIGN_MATTERS[ketuRashi.nameEnglish]?.ketu}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
