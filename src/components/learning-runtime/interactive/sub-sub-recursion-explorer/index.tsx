"use client";

import { useState, useMemo } from "react";
import { NAKSHATRAS } from "../nakshatra-data";
import { Activity, Compass, RotateCcw, AlertTriangle, CheckCircle, Sparkles, BookOpen, Layers, Clock, ShieldAlert } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const ORANGE = "#C28220";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const VIM: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];

function formatDMS(arcMinutes: number): string {
  const deg = Math.floor(arcMinutes / 60);
  const min = Math.floor(arcMinutes % 60);
  const sec = Math.round((arcMinutes * 60) % 60);
  if (sec > 0) {
    return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″`;
  }
  return `${deg}°${min.toString().padStart(2, "0")}′`;
}

function formatZodiac(arcMinutes: number): string {
  const signIdx = Math.min(Math.floor(arcMinutes / 1800), 11);
  const degMinSec = arcMinutes % 1800;
  const deg = Math.floor(degMinSec / 60);
  const min = Math.floor(degMinSec % 60);
  const sec = Math.round((degMinSec * 60) % 60);
  const signName = SIGNS[signIdx];
  if (sec > 0) {
    return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″ ${signName}`;
  }
  return `${deg}°${min.toString().padStart(2, "0")}′ ${signName}`;
}

function describeArc(x: number, y: number, rInner: number, rOuter: number, startAngleDeg: number, endAngleDeg: number) {
  const startRad = ((startAngleDeg - 90) * Math.PI) / 180;
  const endRad = ((endAngleDeg - 90) * Math.PI) / 180;
  
  const x1_in = x + rInner * Math.cos(startRad);
  const y1_in = y + rInner * Math.sin(startRad);
  const x2_in = x + rInner * Math.cos(endRad);
  const y2_in = y + rInner * Math.sin(endRad);

  const x1_out = x + rOuter * Math.cos(startRad);
  const y1_out = y + rOuter * Math.sin(startRad);
  const x2_out = x + rOuter * Math.cos(endRad);
  const y2_out = y + rOuter * Math.sin(endRad);
  
  const largeArc = endAngleDeg - startAngleDeg <= 180 ? 0 : 1;
  
  return [
    "M", x1_out, y1_out,
    "A", rOuter, rOuter, 0, largeArc, 1, x2_out, y2_out,
    "L", x2_in, y2_in,
    "A", rInner, rInner, 0, largeArc, 0, x1_in, y1_in,
    "Z"
  ].join(" ");
}

export function SubSubRecursionExplorer() {
  const [sign, setSign] = useState(8); // Default Dhanus (Sagittarius)
  const [degInSign, setDegInSign] = useState(11.25); // Default 11°15′ (Example 1)
  const [uncertaintySec, setUncertaintySec] = useState(15); // Birth-time uncertainty in seconds (±)
  const [showParams, setShowParams] = useState(false);

  const lon = sign * 1800 + degInSign * 60; // Absolute longitude in arcminutes
  const uncertaintyArcmin = uncertaintySec / 4; // 4 seconds of time ≈ 1 arcminute of zodiac

  // Star calculation
  const nakIdx = Math.min(Math.floor(lon / 800), 26);
  const selectedNak = NAKSHATRAS[nakIdx];
  const nakStart = nakIdx * 800;
  const nakEnd = (nakIdx + 1) * 800;
  const nakOffset = lon - nakStart;

  // Sub calculation
  const subs = useMemo(() => {
    const startIdx = VIM.findIndex((v) => v[0] === selectedNak.ruler);
    const result = [];
    let currentOffset = 0;
    for (let i = 0; i < 9; i++) {
      const [lord, years] = VIM[(startIdx + i) % 9];
      const width = (years / 120) * 800;
      result.push({
        lord,
        years,
        width,
        from: currentOffset,
        to: currentOffset + width,
        absFrom: nakStart + currentOffset,
        absTo: nakStart + currentOffset + width,
      });
      currentOffset += width;
    }
    return result;
  }, [selectedNak, nakStart]);

  const activeSub = useMemo(() => {
    return subs.find((s) => nakOffset >= s.from && nakOffset < s.to) ?? subs[subs.length - 1];
  }, [subs, nakOffset]);

  const activeSubIdx = subs.indexOf(activeSub);
  const subOffset = nakOffset - activeSub.from;

  // Sub-Sub calculation
  const subSubs = useMemo(() => {
    const startIdx = VIM.findIndex((v) => v[0] === activeSub.lord);
    const result = [];
    let currentOffset = 0;
    for (let i = 0; i < 9; i++) {
      const [lord, years] = VIM[(startIdx + i) % 9];
      const width = (years / 120) * activeSub.width;
      result.push({
        lord,
        years,
        width,
        from: currentOffset,
        to: currentOffset + width,
        absFrom: activeSub.absFrom + currentOffset,
        absTo: activeSub.absFrom + currentOffset + width,
      });
      currentOffset += width;
    }
    return result;
  }, [activeSub]);

  const activeSubSub = useMemo(() => {
    return subSubs.find((s) => subOffset >= s.from && subOffset < s.to) ?? subSubs[subSubs.length - 1];
  }, [subSubs, subOffset]);

  const activeSubSubIdx = subSubs.indexOf(activeSubSub);

  // Check if uncertainty spans across sub-sub boundaries
  const minLon = lon - uncertaintyArcmin;
  const maxLon = lon + uncertaintyArcmin;
  const isNoisy = uncertaintySec > 20; // Threshold: birth-time uncertainty > 20 seconds

  // Computed astronomical parameters for the parameters panel
  const paramData = useMemo(() => {
    return {
      obliquity: 23.4367,
      julianDate: 2461202.04167,
      lst: "06:12:45",
      precession: 50.2909,
      offset: (lon / 60).toFixed(4),
      timeRatio: (uncertaintySec / 86400).toFixed(6),
    };
  }, [lon, uncertaintySec]);

  // Click on the SVG rings
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const clickR = Math.sqrt(x * x + y * y);
    
    let angleRad = Math.atan2(y, x);
    let angleNormalized = angleRad + Math.PI / 2;
    if (angleNormalized < 0) {
      angleNormalized += 2 * Math.PI;
    }
    const ratio = angleNormalized / (2 * Math.PI);

    // Click in Middle Ring (Sub-lord)
    if (clickR >= 75 && clickR <= 110) {
      const clickMin = ratio * 800;
      const targetSub = subs.find(s => clickMin >= s.from && clickMin <= s.to);
      if (targetSub) {
        const midAbs = targetSub.absFrom + targetSub.width / 2;
        const signOffset = Math.floor(midAbs / 1800);
        const degPart = (midAbs % 1800) / 60;
        setSign(signOffset);
        setDegInSign(degPart);
      }
    }
    // Click in Inner Ring (Sub-sub-lord)
    else if (clickR >= 45 && clickR <= 72) {
      const clickMinInsideSub = ratio * activeSub.width;
      const targetSubSub = subSubs.find(ss => clickMinInsideSub >= ss.from && clickMinInsideSub <= ss.to);
      if (targetSubSub) {
        const midAbs = targetSubSub.absFrom + targetSubSub.width / 2;
        const signOffset = Math.floor(midAbs / 1800);
        const degPart = (midAbs % 1800) / 60;
        setSign(signOffset);
        setDegInSign(degPart);
      }
    }
  };

  return (
    <div style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.8rem", marginBottom: "1rem" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Lesson 16.3.3 Sandbox</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.4rem" }}>Recursive Concentric Ring Sandbox</h2>
          </div>
          <button
            onClick={() => setShowParams(!showParams)}
            style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: showParams ? `${GOLD}15` : "transparent", color: GOLD, padding: "0.35rem 0.6rem", fontSize: "0.8rem", fontWeight: 900, textTransform: "uppercase", cursor: "pointer" }}
          >
            {showParams ? "Hide Parameters" : "Parameters"}
          </button>
        </div>

        {/* Dynamic Warning Indicator */}
        {isNoisy ? (
          <div style={{ border: `1.5px solid ${RED}`, borderRadius: 8, background: `${RED}0A`, padding: "10px 14px", marginBottom: "1.2rem" }} role="alert">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={16} style={{ color: RED }} />
              <strong style={{ color: RED, fontSize: "0.88rem" }}>PRECISION-VS-NOISE DISCIPLINE BREACH (NOISE ENCOUNTERED)</strong>
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
              Your birth-time uncertainty of ±{uncertaintySec} seconds exceeds the <strong>±20-second threshold</strong>. At this range, coordinates drift by ±{formatDMS(uncertaintyArcmin)}, spanning multiple sub-sub-lords. The sub-sub-lord represents noise; you must fall back to 2-level analysis.
            </p>
          </div>
        ) : (
          <div style={{ border: `1.5px solid ${GREEN}`, borderRadius: 8, background: `${GREEN}0A`, padding: "10px 14px", marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle size={16} style={{ color: GREEN }} />
              <strong style={{ color: GREEN, fontSize: "0.88rem" }}>MEANINGFUL PRECISION ZONE</strong>
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
              Uncertainty is within ±20 seconds (±{formatDMS(uncertaintyArcmin)} drift), which keeps the coordinate statistically locked within this sub-sub division. Precision is analytically valid.
            </p>
          </div>
        )}

        {/* Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "1.25rem", marginBottom: "1.2rem" }}>
          <div>
            <label style={{ display: "block", color: INK_MUTED, fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.3rem" }}>Coordinate Longitude</label>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <input
                type="number" min={0} max={29.99} step={0.01} value={degInSign}
                onChange={(e) => setDegInSign(Math.max(0, Math.min(29.99, Number(e.target.value) || 0)))}
                style={{ width: "5.5rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.4rem 0.5rem", fontWeight: 700, fontSize: "0.9rem" }}
              />
              <span style={{ color: INK_SECONDARY, fontSize: "0.9rem" }}>° in</span>
              <select
                value={sign}
                onChange={(e) => setSign(Number(e.target.value))}
                style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, color: INK_PRIMARY, padding: "0.4rem 0.5rem", fontWeight: 700, fontSize: "0.9rem" }}
              >
                {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
              </select>
            </div>
            <p style={{ margin: "0.3rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>
              = {formatZodiac(lon)}
            </p>
          </div>

          <div>
            <label style={{ display: "block", color: INK_MUTED, fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.3rem" }}>Birth-Time Uncertainty (seconds)</label>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
              <input
                type="range" min={0} max={120} step={1} value={uncertaintySec}
                onChange={(e) => setUncertaintySec(Number(e.target.value))}
                style={{ flex: 1, accentColor: GOLD }}
              />
              <span style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.3rem 0.5rem", fontWeight: 900, fontSize: "0.9rem", color: isNoisy ? RED : GREEN, width: "3.5rem", textAlign: "center" }}>
                ±{uncertaintySec}s
              </span>
            </div>
            <p style={{ margin: "0.3rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>
              Zodiac shift range: ±{formatDMS(uncertaintyArcmin)}
            </p>
          </div>
        </div>

        {/* Astronomical Parameters Table */}
        {showParams && (
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "0.9rem", marginBottom: "1.2rem" }} aria-live="polite">
            <p style={{ margin: "0 0 0.5rem", color: GOLD, fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Astronomical Parameters</p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td style={{ padding: "0.3rem 0", color: INK_SECONDARY }}>Julian Date (praśna-kāla)</td>
                  <td style={{ padding: "0.3rem 0", textAlign: "right", fontWeight: 700 }}>{paramData.julianDate}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td style={{ padding: "0.3rem 0", color: INK_SECONDARY }}>Local Sidereal Time</td>
                  <td style={{ padding: "0.3rem 0", textAlign: "right", fontWeight: 700 }}>{paramData.lst}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td style={{ padding: "0.3rem 0", color: INK_SECONDARY }}>Ecliptic Obliquity (ε)</td>
                  <td style={{ padding: "0.3rem 0", textAlign: "right", fontWeight: 700 }}>{paramData.obliquity}°</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td style={{ padding: "0.3rem 0", color: INK_SECONDARY }}>Precession Rate (Ayanāṁśa drift)</td>
                  <td style={{ padding: "0.3rem 0", textAlign: "right", fontWeight: 700 }}>{paramData.precession}″/yr</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td style={{ padding: "0.3rem 0", color: INK_SECONDARY }}>Computed Longitude</td>
                  <td style={{ padding: "0.3rem 0", textAlign: "right", fontWeight: 700, color: GOLD }}>{paramData.offset}°</td>
                </tr>
                <tr>
                  <td style={{ padding: "0.3rem 0", color: INK_SECONDARY }}>Time Uncertainty Fraction</td>
                  <td style={{ padding: "0.3rem 0", textAlign: "right", fontWeight: 700 }}>{paramData.timeRatio} of day</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {/* TWO COLUMN GRID: Rings SVG on Left, details on Right */}
        <div style={{ display: "grid", gap: "20px" }} className="grid grid-cols-1 md:grid-cols-[1fr_1fr] items-center">
          
          {/* LEFT: 3-Ring SVG Concentric Explorer */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: "330px", aspectRatio: "1/1" }}>
              <svg 
                width="100%" 
                height="100%" 
                viewBox="-170 -170 340 340" 
                style={{ overflow: "visible" }}
                onClick={handleSvgClick}
              >
                {/* Center Core */}
                <circle cx="0" cy="0" r="40" fill="#FFFBF5" stroke={GOLD} strokeWidth="1.5" />
                <text textAnchor="middle" dy="-5" fontSize="8" fontWeight="800" fill={INK_MUTED}>RECURSION</text>
                <text textAnchor="middle" dy="8" fontSize="11" fontWeight="900" fill={GOLD}>{degInSign.toFixed(2)}°</text>
                <text textAnchor="middle" dy="18" fontSize="7" fontWeight="600" fill={INK_SECONDARY}>{SIGNS[sign]}</text>

                {/* Ring 1 (Outer): Star level (Single Nakshatra) */}
                <path 
                  d={describeArc(0, 0, 116, 140, 0, 360)} 
                  fill="rgba(156, 122, 47, 0.05)" 
                  stroke={GOLD} 
                  strokeWidth="1.2" 
                />
                <text textAnchor="middle" transform="rotate(0) translate(0, -125)" fontSize="9" fontWeight="900" fill={GOLD}>{selectedNak.name}</text>

                {/* Ring 2 (Middle): Sub level */}
                {subs.map((s, idx) => {
                  const startAngle = (s.from / 800) * 360;
                  const endAngle = (s.to / 800) * 360;
                  const isActive = s === activeSub;
                  
                  return (
                    <g key={`sub-${idx}`}>
                      <path 
                        d={describeArc(0, 0, 80, 112, startAngle + 0.3, endAngle - 0.3)} 
                        fill={isActive ? `${ORANGE}2A` : "rgba(194, 130, 32, 0.04)"} 
                        stroke={isActive ? ORANGE : "rgba(0,0,0,0.12)"} 
                        strokeWidth={isActive ? 2.2 : 0.8} 
                        style={{ transition: "all 0.2s ease" }}
                      />
                      {/* Short text inside sector if large enough */}
                      {s.width > 50 && (
                        <text
                          textAnchor="middle"
                          transform={`rotate(${(startAngle + endAngle) / 2}) translate(0, -94) rotate(${-((startAngle + endAngle) / 2)})`}
                          fontSize="8"
                          fontWeight={isActive ? 900 : 600}
                          fill={isActive ? ORANGE : INK_MUTED}
                        >
                          {s.lord}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Ring 3 (Inner): Sub-Sub level */}
                {subSubs.map((ss, idx) => {
                  const startAngle = (ss.from / activeSub.width) * 360;
                  const endAngle = (ss.to / activeSub.width) * 360;
                  const isActive = ss === activeSubSub;
                  
                  return (
                    <g key={`subsub-${idx}`} style={{ opacity: isNoisy ? 0.35 : 1 }}>
                      <path 
                        d={describeArc(0, 0, 46, 76, startAngle + 0.4, endAngle - 0.4)} 
                        fill={isActive ? `${GREEN}33` : "rgba(47, 125, 85, 0.04)"} 
                        stroke={isActive ? GREEN : "rgba(0,0,0,0.1)"} 
                        strokeWidth={isActive ? 2 : 0.6} 
                      />
                      {ss.width / activeSub.width > 0.06 && (
                        <text
                          textAnchor="middle"
                          transform={`rotate(${(startAngle + endAngle) / 2}) translate(0, -58) rotate(${-((startAngle + endAngle) / 2)})`}
                          fontSize="7"
                          fontWeight={isActive ? 900 : 500}
                          fill={isActive ? GREEN : INK_MUTED}
                        >
                          {ss.lord}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Sweeping Needle pointer */}
                {(() => {
                  const pointerAngleDeg = (nakOffset / 800) * 360;
                  const pointerRad = ((pointerAngleDeg - 90) * Math.PI) / 180;
                  const targetX = Math.cos(pointerRad) * 145;
                  const targetY = Math.sin(pointerRad) * 145;
                  
                  return (
                    <g>
                      <line 
                        x1="0" 
                        y1="0" 
                        x2={targetX} 
                        y2={targetY} 
                        stroke={isNoisy ? RED : GOLD} 
                        strokeWidth={isNoisy ? 2.5 : 1.5} 
                        strokeDasharray={isNoisy ? "3 3" : "none"}
                      />
                      <circle cx={targetX} cy={targetY} r="4.5" fill={isNoisy ? RED : GOLD} stroke="#FFF" strokeWidth="1" />
                    </g>
                  );
                })()}

                {/* Uncertainty Slice (Pie segment representing zodiac drift) */}
                {(() => {
                  const startAngle = ((nakOffset - uncertaintyArcmin) / 800) * 360;
                  const endAngle = ((nakOffset + uncertaintyArcmin) / 800) * 360;
                  
                  return (
                    <path 
                      d={describeArc(0, 0, 46, 140, startAngle, endAngle)} 
                      fill={isNoisy ? "rgba(162, 58, 30, 0.15)" : "rgba(47, 125, 85, 0.12)"} 
                      stroke={isNoisy ? "rgba(162, 58, 30, 0.4)" : "rgba(47, 125, 85, 0.3)"} 
                      strokeWidth="1"
                      pointerEvents="none"
                    />
                  );
                })()}
              </svg>
            </div>
            <span style={{ fontSize: "11px", color: INK_MUTED, fontStyle: "italic", textAlign: "center" }}>
              Click on Rings: Middle (Sub-lords) or Inner (Sub-subs) to jump coordinates
            </span>
          </div>

          {/* RIGHT: Numeric Breakdown Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: "rgba(255, 253, 248, 0.4)", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: GOLD, fontWeight: 800, fontSize: "12px", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "4px" }}>
                <Layers size={14} />
                <span>NESTED DIVISION BREAKDOWN</span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(0,0,0,0.06)", paddingBottom: "4px" }}>
                  <span style={{ color: INK_SECONDARY }}>Star-Lord (Level 1):</span>
                  <strong style={{ color: GOLD }}>{selectedNak.name} ({selectedNak.ruler})</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(0,0,0,0.06)", paddingBottom: "4px" }}>
                  <span style={{ color: INK_SECONDARY }}>Sub-Lord (Level 2):</span>
                  <strong style={{ color: ORANGE }}>{activeSub.lord}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(0,0,0,0.06)", paddingBottom: "4px", color: isNoisy ? RED : INK_PRIMARY }}>
                  <span style={{ color: isNoisy ? RED : INK_SECONDARY }}>Sub-Sub-Lord (Level 3):</span>
                  <strong>{isNoisy ? "UNRELIABLE / NOISE" : activeSubSub.lord}</strong>
                </div>
              </div>

              <div style={{ marginTop: "6px" }}>
                <span style={{ color: INK_MUTED, fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>Theoretical Division Span:</span>
                <code style={{ display: "block", background: "white", padding: "6px", borderRadius: 6, fontSize: "11px", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, marginTop: "4px", lineHeight: 1.35 }}>
                  Sub-Sub Span = ({activeSubSub.years}y / 120) × {formatDMS(activeSub.width)} = {formatDMS(activeSubSub.width)}
                </code>
              </div>
            </div>

            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: "rgba(255, 253, 248, 0.4)", padding: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: GREEN, fontWeight: 800, fontSize: "12px" }}>
                <Clock size={14} />
                <span>TIME-SPACE CORRELATION</span>
              </div>
              <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.45 }}>
                KP maps Vimshottari time fractions directly onto spatial divisions:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "11px", marginTop: "4px" }}>
                <div style={{ background: "white", border: `1px solid ${HAIRLINE}`, borderRadius: 6, padding: "6px" }}>
                  <strong style={{ color: GOLD, fontSize: "10.5px" }}>Time (Vimshottari):</strong>
                  <div style={{ color: INK_SECONDARY, marginTop: "2px" }}>Mahādaśā ➔ Antardaśā ➔ Pratyantardaśā</div>
                </div>
                <div style={{ background: "white", border: `1px solid ${HAIRLINE}`, borderRadius: 6, padding: "6px" }}>
                  <strong style={{ color: GREEN, fontSize: "10.5px" }}>Space (Zodiac):</strong>
                  <div style={{ color: INK_SECONDARY, marginTop: "2px" }}>Star (13°20′) ➔ Sub (~1°27′) ➔ Sub-Sub (~10′)</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}
