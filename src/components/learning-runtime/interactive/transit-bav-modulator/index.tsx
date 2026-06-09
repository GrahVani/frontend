"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, ShieldAlert, Sparkles, CheckCircle2, Sliders } from "lucide-react";
import { RASHIS, polarToCartesian, GRAHA_SYMBOLS, GRAHA_COLORS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

// Default BAV points (from standard chart in Lesson 4)
const DEFAULT_BAV: Record<string, number[]> = {
  Saturn: [1, 3, 4, 5, 2, 4, 6, 2, 3, 6, 4, 2],
  Jupiter: [5, 4, 6, 7, 4, 5, 5, 6, 7, 2, 5, 6],
  Mars: [6, 2, 4, 1, 5, 3, 2, 6, 4, 5, 4, 3]
};

export function TransitBavModulator() {
  const [planet, setPlanet] = useState<"Saturn" | "Jupiter" | "Mars">("Saturn");
  const [transitRashiIndex, setTransitRashiIndex] = useState<number>(9); // Capricorn default
  const [lagnaRashiIndex, setLagnaRashiIndex] = useState<number>(0); // Aries Lagna default
  const [bavData, setBavData] = useState<Record<string, number[]>>({
    Saturn: [...DEFAULT_BAV.Saturn],
    Jupiter: [...DEFAULT_BAV.Jupiter],
    Mars: [...DEFAULT_BAV.Mars]
  });
  const [isDashaActive, setIsDashaActive] = useState<boolean>(true);

  const resetValues = () => {
    setPlanet("Saturn");
    setTransitRashiIndex(9);
    setLagnaRashiIndex(0);
    setBavData({
      Saturn: [...DEFAULT_BAV.Saturn],
      Jupiter: [...DEFAULT_BAV.Jupiter],
      Mars: [...DEFAULT_BAV.Mars]
    });
    setIsDashaActive(true);
  };

  const handleBavChange = (rashiIdx: number, delta: number) => {
    setBavData(prev => {
      const next = { ...prev };
      next[planet] = [...prev[planet]];
      next[planet][rashiIdx] = Math.max(0, Math.min(8, next[planet][rashiIdx] + delta));
      return next;
    });
  };

  const currentBav = bavData[planet];
  const transitBindus = currentBav[transitRashiIndex];
  
  // Calculate house number: 1-indexed house based on Lagna
  // House = (TransitRashi - LagnaRashi + 12) % 12 + 1
  const houseNumber = ((transitRashiIndex - lagnaRashiIndex + 12) % 12) + 1;

  const triggerStats = useMemo(() => {
    let grade: "Strong" | "Moderate" | "Weak";
    let color: string;
    let icon: React.ReactNode;
    let desc: string;

    if (transitBindus >= 5) {
      grade = "Strong";
      color = "#16a34a"; // Green
      icon = <CheckCircle2 size={16} style={{ color }} />;
      desc = `Strong Trigger: ${planet} has high operational support (${transitBindus} bindus) in this sign. The transit will land hard and trigger notable events.`;
    } else if (transitBindus >= 3) {
      grade = "Moderate";
      color = GOLD_DEEP;
      icon = <Sparkles size={16} style={{ color }} />;
      desc = `Moderate Trigger: ${planet} has average support (${transitBindus} bindus). The transit manifests moderate or typical results, requiring supporting factors to trigger major events.`;
    } else {
      grade = "Weak";
      color = "#ef4444"; // Red
      icon = <ShieldAlert size={16} style={{ color }} />;
      desc = `Weak / Uneventful: ${planet} is starved of support (${transitBindus} bindus). The transit passes quietly and fails to trigger events, even under active planetary aspects.`;
    }

    return { grade, color, icon, desc };
  }, [transitBindus, planet]);

  const synthesisResult = useMemo(() => {
    if (triggerStats.grade === "Strong" && isDashaActive) {
      return {
        verdict: "Corroborated Event (Highly Probable)",
        desc: "The active Daśā opens the temporal window, and the strong transit BAV pulls the trigger. A major event relating to house affairs is highly likely to manifest.",
        color: "#16a34a"
      };
    } else if (triggerStats.grade === "Strong" && !isDashaActive) {
      return {
        verdict: "Background Strength (Underfunded Trigger)",
        desc: "Although the transit is locally very strong, the timing window is closed because this planet's Daśā/Bhukti is inactive. Manifests as general background support but no major event.",
        color: GOLD_DEEP
      };
    } else if (triggerStats.grade === "Weak" && isDashaActive) {
      return {
        verdict: "Event Delayed / Blocked",
        desc: "The Daśā window is open, but the transiting planet has no local support (low BAV) to trigger the event. Results are delayed, blocked, or manifest very weakly.",
        color: "#ef4444"
      };
    } else {
      return {
        verdict: "Uneventful Pass",
        desc: "Both the timing window (Daśā inactive) and local trigger strength (low/moderate BAV) are low. This transit passes completely without triggering events.",
        color: INK_MUTED
      };
    }
  }, [triggerStats.grade, isDashaActive]);

  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 200, cy = 200, r = 114;
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({ x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad), angleDeg, rashiIndex: i });
    }
    return points;
  }, []);

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", borderBottom: "1px solid rgba(156,122,47,0.1)", paddingBottom: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Transit BAV Modulator Component
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Analyze transit trigger strength using the transiting planet's own BAV (not the SAV) for the entered house.
          </p>
        </div>
        <button
          onClick={resetValues}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* SPLIT VIEW */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: SVG BAV Wheel */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", width: "100%", marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: GOLD_DEEP }}>
                {planet} Bhinna Aṣṭakavarga (BAV) Map
              </h4>
              <span style={{ fontSize: "10px", color: INK_MUTED, fontWeight: 700, display: "flex", alignItems: "center", gap: "3px", whiteSpace: "nowrap" }}>
                <Sliders size={11} /> Click to scrub
              </span>
            </div>
            <div style={{ fontSize: "10px", color: INK_MUTED, fontStyle: "italic" }}>
              Click wedge to select transit | Click value to edit (+1 / -1)
            </div>
          </div>
          <div style={{ position: "relative", width: "100%", maxWidth: "320px", aspectRatio: "1 / 1" }}>
            <svg width="100%" height="100%" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="188" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="2" />
              <circle cx="200" cy="200" r="70" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />
              
              {/* Sector Division Lines */}
              {RASHIS.map((_, i) => {
                const angleDeg = i * 30 - 105;
                const angleRad = (angleDeg * Math.PI) / 180;
                const lx1 = 200 + 70 * Math.cos(angleRad);
                const ly1 = 200 + 70 * Math.sin(angleRad);
                const lx2 = 200 + 188 * Math.cos(angleRad);
                const ly2 = 200 + 188 * Math.sin(angleRad);
                return <line key={`line-${i}`} x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="rgba(156,122,47,0.08)" strokeWidth="1.2" />;
              })}

              {/* Segment highlight for transited sign */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                const isTransited = i === transitRashiIndex;
                
                let fill = "rgba(255,255,255,0.02)";
                let stroke = "none";

                if (isTransited) {
                  fill = "color-mix(in srgb, var(--gl-gold-accent, #9C7A2F) 12%, transparent)";
                  stroke = GOLD;
                }

                const startAngle = i * 30 - 105;
                const endAngle = i * 30 - 75;
                const so = { x: 200 + 188 * Math.cos((startAngle * Math.PI) / 180), y: 200 + 188 * Math.sin((startAngle * Math.PI) / 180) };
                const eo = { x: 200 + 188 * Math.cos((endAngle * Math.PI) / 180), y: 200 + 188 * Math.sin((endAngle * Math.PI) / 180) };
                const si = { x: 200 + 70 * Math.cos((startAngle * Math.PI) / 180), y: 200 + 70 * Math.sin((startAngle * Math.PI) / 180) };
                const ei = { x: 200 + 70 * Math.cos((endAngle * Math.PI) / 180), y: 200 + 70 * Math.sin((endAngle * Math.PI) / 180) };
                
                const pathData = [
                  `M ${si.x} ${si.y}`,
                  `L ${so.x} ${so.y}`,
                  `A 188 188 0 0 1 ${eo.x} ${eo.y}`,
                  `L ${ei.x} ${ei.y}`,
                  `A 70 70 0 0 0 ${si.x} ${si.y}`,
                  "Z"
                ].join(" ");

                return (
                  <path
                    key={`trpath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isTransited ? "2.5" : "0.5"}
                    style={{ cursor: "pointer" }}
                    onClick={() => setTransitRashiIndex(i)}
                  >
                    <title>Wedge {r.nameEnglish}: Click to select as transiting sign</title>
                  </path>
                );
              })}

              {/* Draw Transit Node indicator inside the transited sign wedge */}
              {(() => {
                const angleDeg = transitRashiIndex * 30 - 90;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptTrans = polarToCartesian(200, 200, 136, angleDeg + 90); // Place at 136px radius (corridor midpoint)
                return (
                  <g>
                    <circle cx={ptTrans.x} cy={ptTrans.y} r="13" fill={GRAHA_COLORS[planet]} stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={ptTrans.x}
                      y={ptTrans.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "8px", fill: "#ffffff", fontWeight: 900 }}
                    >
                      {planet.slice(0, 3).toUpperCase()}
                    </text>
                  </g>
                );
              })()}

              {/* Labels and values */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiIndex];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 200 + 170 * Math.cos(angleRad), y: 200 + 170 * Math.sin(angleRad) };
                const ptValue = { x: 200 + 102 * Math.cos(angleRad), y: 200 + 102 * Math.sin(angleRad) };

                const rawVal = currentBav[p.rashiIndex];
                const isTransited = p.rashiIndex === transitRashiIndex;

                // Calculate house label
                const hNum = ((p.rashiIndex - lagnaRashiIndex + 12) % 12) + 1;
                const shortSign = r.nameEnglish.slice(0, 3);

                return (
                  <g key={`trlabel-${p.rashiIndex}`}>
                    <text
                      x={ptEng.x}
                      y={ptEng.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "8px", fontWeight: 800, fill: INK_PRIMARY, cursor: "pointer" }}
                      onClick={() => setTransitRashiIndex(p.rashiIndex)}
                    >
                      <title>{r.nameEnglish}: Click to select as transiting sign</title>
                      {shortSign} (H{hNum})
                    </text>
                    
                    <g
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleBavChange(p.rashiIndex, e.shiftKey ? -1 : 1);
                      }}
                      onContextMenu={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleBavChange(p.rashiIndex, -1);
                      }}
                    >
                      <title>{r.nameEnglish} BAV: Left-click to +1, Shift-click or Right-click to -1</title>
                      <circle
                        cx={ptValue.x}
                        cy={ptValue.y}
                        r="18"
                        fill="#ffffff"
                        stroke={isTransited ? GOLD : "rgba(0,0,0,0.1)"}
                        strokeWidth={isTransited ? "2.5" : "1.5"}
                      />
                      <text
                        x={ptValue.x}
                        y={ptValue.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "11px", fontWeight: 900, fill: isTransited ? GOLD_DEEP : INK_SECONDARY }}
                      >
                        {rawVal}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="200" cy="200" r="40" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <text x="200" y="195" textAnchor="middle" style={{ fontSize: "7.5px", fontWeight: 800, fill: INK_MUTED }}>TRANSIT BAV</text>
              <text x="200" y="206" textAnchor="middle" style={{ fontSize: "9.5px", fontWeight: 900, fill: GOLD_DEEP }}>MODULATOR</text>
              <text x="200" y="215" textAnchor="middle" style={{ fontSize: "6.5px", fontWeight: 800, fill: INK_MUTED }}>ENGINE</text>
            </svg>
          </div>
        </div>

        {/* Right Column: Controls & Dynamic Calculator */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          
          {/* Parameter Selectors */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
              Transit Configuration
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <label style={{ fontSize: "9.5px", fontWeight: 700, color: INK_SECONDARY }}>Planet</label>
                <select
                  value={planet}
                  onChange={(e) => setPlanet(e.target.value as any)}
                  style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.15)", fontSize: "11px", background: "#ffffff" }}
                >
                  <option value="Saturn">Saturn</option>
                  <option value="Jupiter">Jupiter</option>
                  <option value="Mars">Mars</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <label style={{ fontSize: "9.5px", fontWeight: 700, color: INK_SECONDARY }}>Lagna (Ascendant)</label>
                <select
                  value={lagnaRashiIndex}
                  onChange={(e) => setLagnaRashiIndex(Number(e.target.value))}
                  style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.15)", fontSize: "11px", background: "#ffffff" }}
                >
                  {RASHIS.map((r, i) => (
                    <option key={r.number} value={i}>{r.nameEnglish}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px", gridColumn: "span 2" }}>
                <label style={{ fontSize: "9.5px", fontWeight: 700, color: INK_SECONDARY }}>Transiting Sign</label>
                <select
                  value={transitRashiIndex}
                  onChange={(e) => setTransitRashiIndex(Number(e.target.value))}
                  style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.15)", fontSize: "11px", background: "#ffffff" }}
                >
                  {RASHIS.map((r, i) => (
                    <option key={r.number} value={i}>{r.nameEnglish} (House {((i - lagnaRashiIndex + 12) % 12) + 1})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* BAV Scrubber for active sign */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, display: "block" }}>
                Edit Local BAV Value
              </span>
              <span style={{ fontSize: "9px", color: INK_MUTED }}>
                Modify BAV points in {RASHIS[transitRashiIndex].nameEnglish} (House {houseNumber})
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={() => handleBavChange(transitRashiIndex, -1)}
                style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "4px", background: "#ffffff", fontSize: "11px", cursor: "pointer" }}
              >
                -
              </button>
              <span style={{ fontSize: "13px", fontWeight: 900, minWidth: "20px", textAlign: "center" }}>
                {transitBindus}
              </span>
              <button
                onClick={() => handleBavChange(transitRashiIndex, 1)}
                style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "4px", background: "#ffffff", fontSize: "11px", cursor: "pointer" }}
              >
                +
              </button>
            </div>
          </div>

          {/* Daśā window active check */}
          <div
            onClick={() => setIsDashaActive(!isDashaActive)}
            style={{
              background: "#ffffff",
              padding: "10px",
              borderRadius: "10px",
              border: `1.5px solid ${isDashaActive ? GOLD : "rgba(0,0,0,0.05)"}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.15s"
            }}
          >
            <div>
              <span style={{ fontSize: "10.5px", fontWeight: 800, color: isDashaActive ? GOLD_DEEP : INK_PRIMARY }}>
                Active Timing Window
              </span>
              <span style={{ fontSize: "9px", color: INK_MUTED, display: "block" }}>
                Is {planet}'s Daśā / Bhukti current active?
              </span>
            </div>
            <input
              type="checkbox"
              checked={isDashaActive}
              onChange={() => {}}
              style={{ cursor: "pointer" }}
            />
          </div>

        </div>

      </div>

      {/* DYNAMIC RESULTS AND SYNTHESIS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", flexWrap: "wrap" }}>
        
        {/* Trigger Strength BAV */}
        <div style={{ background: "rgba(255,255,255,0.4)", border: `1.2px solid ${triggerStats.color}`, borderRadius: "10px", padding: "10px" }}>
          <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: triggerStats.color, display: "block", marginBottom: "2px" }}>
            Trigger Strength ({planet} BAV)
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11.5px", fontWeight: 800, color: triggerStats.color, marginBottom: "4px" }}>
            {triggerStats.icon} {triggerStats.grade} Trigger ({transitBindus} bindus)
          </div>
          <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
            {triggerStats.desc}
          </p>
        </div>

        {/* Daśā + Transit Synthesis */}
        <div style={{ background: "rgba(255,255,255,0.4)", border: `1.2px solid ${synthesisResult.color}`, borderRadius: "10px", padding: "10px" }}>
          <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "block", marginBottom: "2px" }}>
            Daśā + Transit Synthesis
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11.5px", fontWeight: 800, color: synthesisResult.color, marginBottom: "4px" }}>
            {synthesisResult.verdict}
          </div>
          <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
            {synthesisResult.desc}
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "10px", color: INK_SECONDARY, lineHeight: 1.45, display: "flex", gap: "6px", alignItems: "flex-start" }}>
        <Info size={14} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong>Astrological Rule Reminder:</strong> You must always check the BAV value of the **transiting planet itself** in that sign, **never** the total SAV of the house. The SAV measures the house overall, whereas the BAV determines how strongly *that specific planet* fires. Tweak the BAV values above to see the trigger thresholds shift (high ≥5, low ≤2).
        </div>
      </div>
    </div>
  );
}
