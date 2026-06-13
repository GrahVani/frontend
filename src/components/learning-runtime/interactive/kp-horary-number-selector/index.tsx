"use client";

import { useState, useMemo } from "react";
import { generate249Subs, formatZodiac, formatDMS, SIGNS } from "../kp-horary-utils";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const RED = "#A23A1E";

export function KpHoraryNumberSelector() {
  const allSubs = useMemo(() => generate249Subs(), []);
  
  const [selectedNum, setSelectedNum] = useState<number>(127);
  const [inputVal, setInputVal] = useState<string>("127");
  const [errorMsg, setErrorMsg] = useState<string>("");

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

  const handleSearchChange = (val: string) => {
    setInputVal(val);
    setErrorMsg("");

    if (val.trim() === "") {
      return;
    }

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
  };

  const handleGridClick = (num: number) => {
    setSelectedNum(num);
    setInputVal(num.toString());
    setErrorMsg("");
  };

  // Render SVG Zodiac Circle representation
  const zodiacWheelSvg = useMemo(() => {
    const radius = 90;
    const cx = 100;
    const cy = 100;
    
    // Draw 12 signs as slices
    const slices = [];
    const labels = [];
    const signAbbreviations = ["Meṣa", "Vṛṣa", "Mith", "Kark", "Siṁh", "Kany", "Tulā", "Vṛśc", "Dhan", "Maka", "Kumb", "Mīna"];

    for (let i = 0; i < 12; i++) {
      const startAngle = (i * 30 * Math.PI) / 180 - Math.PI / 2;
      const endAngle = ((i + 1) * 30 * Math.PI) / 180 - Math.PI / 2;
      
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);

      slices.push(
        <path
          key={i}
          d={`M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`}
          fill="none"
          stroke={`${GOLD}33`}
          strokeWidth="1"
        />
      );

      // Mid-angle for label placement
      const midAngle = ((i * 30 + 15) * Math.PI) / 180 - Math.PI / 2;
      const tx = cx + 58 * Math.cos(midAngle);
      const ty = cy + 58 * Math.sin(midAngle);

      labels.push(
        <text
          key={`lbl-${i}`}
          x={tx}
          y={ty + 3}
          textAnchor="middle"
          fontSize="7"
          fill={GOLD}
          fontWeight="bold"
          style={{ opacity: 0.8 }}
        >
          {signAbbreviations[i]}
        </text>
      );
    }

    // Highlight the active sub-arc
    const totalMinutes = 360 * 60;
    const activeStartRad = ((activeSub.absFrom / totalMinutes) * 360 * Math.PI) / 180 - Math.PI / 2;
    const activeEndRad = ((activeSub.absTo / totalMinutes) * 360 * Math.PI) / 180 - Math.PI / 2;

    const ax1 = cx + (radius - 5) * Math.cos(activeStartRad);
    const ay1 = cy + (radius - 5) * Math.sin(activeStartRad);
    const ax2 = cx + (radius - 5) * Math.cos(activeEndRad);
    const ay2 = cy + (radius - 5) * Math.sin(activeEndRad);

    const activeArcPath = `M ${cx},${cy} L ${ax1},${ay1} A ${radius - 5},${radius - 5} 0 0,1 ${ax2},${ay2} Z`;

    return (
      <svg width="200" height="200" style={{ display: "block", margin: "0 auto" }}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke={GOLD} strokeWidth="1.5" />
        {slices}
        <path d={activeArcPath} fill={`${GOLD}77`} stroke={GOLD} strokeWidth="1.5" />
        {labels}
        <circle cx={cx} cy={cy} r="25" fill={SURFACE} stroke={HAIRLINE} />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fill={GOLD} fontWeight="bold">
          #{activeSub.number}
        </text>
      </svg>
    );
  }, [activeSub]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", color: INK_PRIMARY }} data-interactive="kp-horary-number-selector">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 7 · Lesson 1</span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.5rem", fontWeight: 700 }}>KP Horary — The 1–249 Number Selector</h1>
      </section>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left Side: Number Selection Shelf */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
          <h2 style={{ fontSize: "1.1rem", color: GOLD, margin: "0 0 12px" }}>Select division number (1–249)</h2>
          
          {/* Search Box */}
          <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={inputVal}
                placeholder="Enter 1-249..."
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${errorMsg ? RED : HAIRLINE}`,
                  background: SURFACE,
                  color: INK_PRIMARY,
                  fontSize: "0.95rem",
                  fontWeight: 600
                }}
              />
              <button
                onClick={() => {
                  setSelectedNum(127);
                  setInputVal("127");
                  setErrorMsg("");
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${HAIRLINE}`,
                  background: SURFACE,
                  color: GOLD,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Reset
              </button>
            </div>
            {errorMsg && <span style={{ color: RED, fontSize: "0.78rem", fontWeight: 700 }}>{errorMsg}</span>}
          </div>

          {/* Grid grouped by Sign */}
          <div style={{ maxHeight: "350px", overflowY: "auto", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "10px" }}>
            {SIGNS.map((sign) => {
              const subsInSign = groupedSubs[sign];
              if (!subsInSign || subsInSign.length === 0) return null;
              return (
                <div key={sign} style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 900, color: GOLD, textTransform: "uppercase", marginBottom: "6px", borderBottom: `1px solid ${HAIRLINE}` }}>
                    {sign}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {subsInSign.map((sub) => {
                      const isSelected = sub.number === selectedNum;
                      return (
                        <button
                          key={sub.number}
                          onClick={() => handleGridClick(sub.number)}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: 6,
                            border: `1px solid ${isSelected ? GOLD : HAIRLINE}`,
                            background: isSelected ? `${GOLD}33` : "transparent",
                            color: isSelected ? GOLD : INK_PRIMARY,
                            fontSize: "0.76rem",
                            fontWeight: isSelected ? 800 : 500,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                          title={`#${sub.number}: Star ${sub.starLord}, Sub ${sub.subLord}`}
                        >
                          {sub.number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Visual Output and Lords */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, height: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <h2 style={{ fontSize: "1.1rem", color: GOLD, margin: "0" }}>Lagna Sub-Arc Resolution</h2>
          
          {/* SVG Wheel */}
          <div style={{ padding: "10px 0" }}>
            {zodiacWheelSvg}
          </div>

          {/* Coordinate Properties Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <tbody>
              <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>Zodiac Sign:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700 }}>{activeSub.rashiName} ({activeSub.rashiLord})</td>
              </tr>
              <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>Nakṣatra (Star):</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700 }}>{activeSub.nakName} ({activeSub.starLord})</td>
              </tr>
              <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>Sub-Lord:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700, color: GOLD }}>{activeSub.subLord}</td>
              </tr>
              <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>Longitude Range:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700, fontSize: "0.78rem" }}>
                  {formatZodiac(activeSub.absFrom)} ➔ {formatZodiac(activeSub.absTo)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", color: INK_SECONDARY }}>Arc Width:</td>
                <td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700, color: "var(--gl-ink-on-cream-secondary)" }}>
                  {formatDMS(activeSub.absTo - activeSub.absFrom)}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ fontSize: "0.78rem", color: INK_MUTED, fontStyle: "italic", borderTop: `1px solid ${HAIRLINE}`, paddingTop: "8px", marginTop: "auto" }}>
            Pedagogical takeaway: Notice how adjacent sub-divisions can cause the Sub-Lord to switch lords entirely, which makes the exact named number critical to casting the horary Lagna.
          </div>
        </div>

      </div>

    </div>
  );
}
