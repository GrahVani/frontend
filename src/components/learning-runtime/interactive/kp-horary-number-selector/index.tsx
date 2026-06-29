"use client";

import { useState, useMemo } from "react";
import { generate249Subs, formatZodiac, formatDMS, SIGNS } from "../kp-horary-utils";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const BLUE = "#356CAB";

export function KpHoraryNumberSelector() {
  const allSubs = useMemo(() => generate249Subs(), []);
  
  const [selectedNum, setSelectedNum] = useState<number>(127);
  const [inputVal, setInputVal] = useState<string>("127");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [activeSignIdx, setActiveSignIdx] = useState<number>(6); // Default Libra (contains 127)

  const activeSub = useMemo(() => {
    return allSubs.find((s) => s.number === selectedNum) || allSubs[0];
  }, [allSubs, selectedNum]);

  // Group divisions by Sign/Rashi for visual organization
  const groupedSubs = useMemo(() => {
    const groups: Record<string, typeof allSubs> = {};
    SIGNS.forEach((sign) => {
      groups[sign] = [];
    });
    allSubs.forEach((sub) => {
      if (groups[sub.rashiName]) {
        groups[sub.rashiName].push(sub);
      }
    });
    return groups;
  }, [allSubs]);

  // Filter subs for the active selected Sign to render inside the SVG zoom-in area
  const activeSignSubs = useMemo(() => {
    const signName = SIGNS[activeSignIdx];
    return allSubs.filter(sub => sub.rashiName === signName);
  }, [allSubs, activeSignIdx]);

  const handleSearchChange = (val: string) => {
    setInputVal(val);
    setErrorMsg("");

    if (val.trim() === "") return;

    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setErrorMsg("Please enter a valid integer.");
      return;
    }

    if (num < 1 || num > 249) {
      setErrorMsg("Number must be strictly between 1 and 249.");
      return;
    }

    setSelectedNum(num);
    const sub = allSubs.find(s => s.number === num);
    if (sub) {
      const sIdx = SIGNS.indexOf(sub.rashiName);
      if (sIdx !== -1) setActiveSignIdx(sIdx);
    }
  };

  const handleSubClick = (subNum: number) => {
    setSelectedNum(subNum);
    setInputVal(subNum.toString());
    setErrorMsg("");
  };

  return (
    <div style={{ color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif" }} data-interactive="kp-horary-number-selector">
      
      {/* Header Banner */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", marginBottom: "1rem", boxShadow: "0 4px 20px -2px rgba(47, 125, 85, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GREEN, fontWeight: 900, background: `${GREEN}15`, padding: "2px 8px", borderRadius: "4px" }}>249 Division Solver</span>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, fontWeight: 900, background: `${GOLD}15`, padding: "2px 8px", borderRadius: "4px" }}>Chapter 7, Lesson 1</span>
        </div>
        <h2 style={{ margin: "0.4rem 0 0.2rem", color: GOLD, fontSize: "1.45rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
          KP Horary — The 1–249 Number Selector
        </h2>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "13px", lineHeight: 1.55 }}>
          Select or search a horary division. Click on the interactive zodiac dial to expand signs, inspect unequal nakshatras, and resolve sub-lords.
        </p>
      </section>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem", alignItems: "start" }}>
        
        {/* Left Side: 249-Zodiac Orbital Selector SVG and sign focus controls */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1.25rem", background: SURFACE, display: "flex", flexDirection: "column", alignItems: "center" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "6px" }}>
            <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
              Zodiac Orbital Navigator
            </h3>
            
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: INK_SECONDARY }}>Focus Sign:</span>
              <select
                value={activeSignIdx}
                aria-label="Active Sign Index Selection"
                onChange={(e) => setActiveSignIdx(Number(e.target.value))}
                style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 6, padding: "2px 6px", fontSize: "12px", background: SURFACE, color: INK_PRIMARY, fontWeight: "700" }}
              >
                {SIGNS.map((s, idx) => (
                  <option key={s} value={idx}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Wheel showing focused Sign subdivisions */}
          <div style={{ position: "relative", width: "100%", maxWidth: "300px", aspectRatio: "1/1", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0.5rem" }}>
            <svg width="290" height="290" viewBox="0 0 300 300" style={{ overflow: "visible" }}>
              <defs>
                <filter id="glowArc">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {/* Outer Zodiac Circle */}
              <circle cx="150" cy="150" r="140" fill="none" stroke={HAIRLINE} strokeWidth="1" />
              <circle cx="150" cy="150" r="100" fill="none" stroke={`${HAIRLINE}50`} strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="150" cy="150" r="45" fill="none" stroke={HAIRLINE} strokeWidth="1.5" />

              {/* Draw 12 Signs Outer Slices */}
              {SIGNS.map((sign, idx) => {
                const isFocused = idx === activeSignIdx;
                const startAngle = (idx * 30 * Math.PI) / 180 - Math.PI / 2;
                const endAngle = ((idx + 1) * 30 * Math.PI) / 180 - Math.PI / 2;
                
                const x1_in = 150 + 100 * Math.cos(startAngle);
                const y1_in = 150 + 100 * Math.sin(startAngle);
                const x2_in = 150 + 100 * Math.cos(endAngle);
                const y2_in = 150 + 100 * Math.sin(endAngle);

                const x1_out = 150 + 140 * Math.cos(startAngle);
                const y1_out = 150 + 140 * Math.sin(startAngle);
                const x2_out = 150 + 140 * Math.cos(endAngle);
                const y2_out = 150 + 140 * Math.sin(endAngle);

                const midAngle = ((idx * 30 + 15) * Math.PI) / 180 - Math.PI / 2;
                const tx = 150 + 120 * Math.cos(midAngle);
                const ty = 150 + 120 * Math.sin(midAngle);

                return (
                  <g key={sign} style={{ cursor: "pointer" }} onClick={() => setActiveSignIdx(idx)}>
                    <path
                      d={`M ${x1_in},${y1_in} L ${x1_out},${y1_out} A 140 140 0 0 1 ${x2_out},${y2_out} L ${x2_in},${y2_in} A 100 100 0 0 0 ${x1_in},${y1_in} Z`}
                      fill={isFocused ? `${GOLD}1A` : "transparent"}
                      stroke={isFocused ? GOLD : `${HAIRLINE}30`}
                      strokeWidth={isFocused ? 2 : 1}
                    />
                    <text
                      x={tx}
                      y={ty}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="8"
                      fontWeight="800"
                      fill={isFocused ? GOLD : INK_SECONDARY}
                      transform={`rotate(${idx * 30 + 15}, ${tx}, ${ty})`}
                    >
                      {sign.substring(0, 4)}
                    </text>
                  </g>
                );
              })}

              {/* Inside the focused sign: draw the 249 subdivisions as inner wedges */}
              {activeSignSubs.map((sub, idx) => {
                // Map the coordinates (absFrom, absTo) relative to the focused sign's 1800 arcminutes
                const signStartOffset = activeSignIdx * 1800;
                
                // Convert arcminutes to degrees
                const degFrom = (sub.absFrom - signStartOffset) / 60; // 0 to 30
                const degTo = (sub.absTo - signStartOffset) / 60;     // 0 to 30
                
                // Map to absolute angles matching the focused sign's slice (which spans activeSignIdx * 30 to +30)
                const startAngleDeg = activeSignIdx * 30 + degFrom;
                const endAngleDeg = activeSignIdx * 30 + degTo;
                
                const startRad = (startAngleDeg * Math.PI) / 180 - Math.PI / 2;
                const endRad = (endAngleDeg * Math.PI) / 180 - Math.PI / 2;
                
                const isSelected = sub.number === selectedNum;

                // Coordinates for inner wedges
                const x1_in = 150 + 45 * Math.cos(startRad);
                const y1_in = 150 + 45 * Math.sin(startRad);
                const x2_in = 150 + 45 * Math.cos(endRad);
                const y2_in = 150 + 45 * Math.sin(endRad);

                const x1_out = 150 + 95 * Math.cos(startRad);
                const y1_out = 150 + 95 * Math.sin(startRad);
                const x2_out = 150 + 95 * Math.cos(endRad);
                const y2_out = 150 + 95 * Math.sin(endRad);

                return (
                  <g key={sub.number} style={{ cursor: "pointer" }} onClick={() => handleSubClick(sub.number)}>
                    <path
                      d={`M ${x1_in},${y1_in} L ${x1_out},${y1_out} A 95 95 0 0 1 ${x2_out},${y2_out} L ${x2_in},${y2_in} A 45 45 0 0 0 ${x1_in},${y1_in} Z`}
                      fill={isSelected ? GOLD : "transparent"}
                      stroke={isSelected ? GOLD : `${GOLD}30`}
                      strokeWidth={isSelected ? 1.5 : 0.5}
                      filter={isSelected ? "url(#glowArc)" : undefined}
                    />
                  </g>
                );
              })}

              {/* Center Core Badge */}
              <circle cx="150" cy="150" r="28" fill={SURFACE} stroke={GOLD} strokeWidth="1.5" />
              <text x="150" y="146" textAnchor="middle" fontSize="10" fill={INK_MUTED} fontWeight="900">
                HORARY
              </text>
              <text x="150" y="159" textAnchor="middle" fontSize="13" fill={GOLD} fontWeight="900">
                #{selectedNum}
              </text>
            </svg>
          </div>

          {/* Quick slider backup indicator */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700" }}>
              <span style={{ color: INK_SECONDARY }}>Navigate 1-249 Number Index:</span>
              <span style={{ color: GOLD }}>Active: #{selectedNum}</span>
            </div>
            <input
              type="range"
              min="1"
              max="249"
              value={selectedNum}
              onChange={(e) => handleSubClick(Number(e.target.value))}
              style={{ width: "100%", accentColor: GOLD, cursor: "pointer" }}
              aria-label="Horary Number Range Slider"
            />
          </div>

          {/* Search Box */}
          <div style={{ marginTop: "1rem", width: "100%", display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", gap: "8px", width: "100%" }}>
              <input
                type="text"
                value={inputVal}
                placeholder="Search index 1-249..."
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: `1px solid ${errorMsg ? RED : HAIRLINE}`,
                  background: SURFACE,
                  color: INK_PRIMARY,
                  fontSize: "13px",
                  fontWeight: 700
                }}
              />
              <button
                onClick={() => {
                  setSelectedNum(127);
                  setInputVal("127");
                  setErrorMsg("");
                  setActiveSignIdx(6);
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: `1px solid ${HAIRLINE}`,
                  background: SURFACE,
                  color: GOLD,
                  fontWeight: 750,
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Reset
              </button>
            </div>
            {errorMsg && <span style={{ color: RED, fontSize: "11px", fontWeight: 700 }}>{errorMsg}</span>}
          </div>
        </div>

        {/* Right Side: Retro Parchment Card details panel */}
        <div style={{ border: `1.5px solid ${GOLD}`, borderRadius: 12, padding: "1.25rem", background: `${GOLD}04`, display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
          
          <h2 style={{ fontSize: "1.2rem", color: GOLD, margin: "0", fontFamily: "var(--font-cormorant), serif", fontWeight: 700, borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem" }}>
            Lagna Sub-Arc Resolution
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            
            {/* Lord Chain diagram */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", background: SURFACE, padding: "10px", borderRadius: 8, border: `1px solid ${HAIRLINE}` }}>
              <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", fontWeight: 800 }}>Ruler Chain</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "700" }}>
                <span style={{ color: BLUE }}>{activeSub.rashiLord}</span>
                <span style={{ color: INK_MUTED }}>➔</span>
                <span style={{ color: GOLD }}>{activeSub.starLord}</span>
                <span style={{ color: INK_MUTED }}>➔</span>
                <span style={{ color: RED }}>{activeSub.subLord}</span>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <tbody>
                <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                  <td style={{ padding: "8px 0", color: INK_SECONDARY }}>Zodiac Sign:</td>
                  <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 700 }}>{activeSub.rashiName} ({activeSub.rashiLord})</td>
                </tr>
                <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                  <td style={{ padding: "8px 0", color: INK_SECONDARY }}>Nakṣatra (Star):</td>
                  <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 700 }}>{activeSub.nakName} ({activeSub.starLord})</td>
                </tr>
                <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                  <td style={{ padding: "8px 0", color: INK_SECONDARY }}>Sub-Lord:</td>
                  <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 700, color: RED }}>{activeSub.subLord}</td>
                </tr>
                <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                  <td style={{ padding: "8px 0", color: INK_SECONDARY }}>Longitude Range:</td>
                  <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 700, fontSize: "11px", fontFamily: "monospace" }}>
                    {formatZodiac(activeSub.absFrom)} ➔ {formatZodiac(activeSub.absTo)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", color: INK_SECONDARY }}>Arc Width:</td>
                  <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 700, color: GREEN, fontFamily: "monospace" }}>
                    {formatDMS(activeSub.absTo - activeSub.absFrom)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.5, borderTop: `1px solid ${HAIRLINE}`, paddingTop: "10px" }}>
            <strong>Pedagogical Insight:</strong> In Horary astrology, a client picks a number between 1 and 249. This number matches an exact sub-arc in the zodiac. Because adjacent sub-divisions are unequal, the Sub-Lord changes rapidly, anchoring the Lagna cusp to a precise ruler chain.
          </div>
        </div>

      </div>
    </div>
  );
}
