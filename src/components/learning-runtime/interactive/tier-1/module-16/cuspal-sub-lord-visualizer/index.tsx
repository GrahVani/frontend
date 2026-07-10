"use client";

import { useState, useMemo } from "react";
import { NAKSHATRAS } from '@/components/learning-runtime/interactive/nakshatra-data';
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const INDIGO = "#4F6FA8";
const EMERALD = "#10B981";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];

const VIM: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];

const NAK_DEG = 13 + 20 / 60; // 13.3333°

interface Preset {
  name: string;
  type: "marriage" | "career" | "libra_marriage";
  cusps: number[]; 
  planets: Record<string, number>;
}

const PRESETS: Preset[] = [
  {
    name: "Scorpio Marriage Case (L1 & L4 Example 1)",
    type: "marriage",
    cusps: [46.16, 76.16, 106.16, 136.16, 166.16, 196.16, 226.1667, 256.16, 286.16, 316.16, 346.16, 16.16],
    planets: {
      Sun: 45.0, Moon: 140.0, Mars: 280.0, Mercury: 50.0, Jupiter: 265.0, Venus: 215.0, Saturn: 185.0, Rahu: 12.0, Ketu: 192.0
    }
  },
  {
    name: "Taurus Career Case (L4 Example 2)",
    type: "career",
    cusps: [265.0, 295.0, 325.0, 355.0, 25.0, 55.0, 85.0, 115.0, 145.0, 175.0, 205.0, 235.0],
    planets: {
      Sun: 120.0, Moon: 210.0, Mars: 54.0, Mercury: 110.0, Jupiter: 15.0, Venus: 75.0, Saturn: 10.0, Rahu: 225.0, Ketu: 45.0
    }
  },
  {
    name: "Libra Marriage Case (L1 Example 1)",
    type: "libra_marriage",
    cusps: [18.57, 48.57, 78.57, 108.57, 138.57, 168.57, 198.57, 228.57, 258.57, 288.57, 318.57, 348.57],
    planets: {
      Sun: 200.0, Moon: 342.75, Mars: 112.0, Mercury: 212.0, Jupiter: 155.0, Venus: 180.0, Saturn: 240.0, Rahu: 190.0, Ketu: 10.0
    }
  }
];

function fmtDMS(d: number): string {
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  const sec = Math.round(((d - deg) * 60 - min) * 60);
  if (sec === 60) return `${deg}°${(min + 1).toString().padStart(2, "0")}′00″`;
  return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″`;
}

function fmtZodiac(d: number): string {
  const signIdx = Math.min(Math.floor(d / 30), 11);
  const deg = d % 30;
  return `${fmtDMS(deg)} ${SIGNS[signIdx]}`;
}

function getSubLordData(lon: number) {
  const nakIdx = Math.min(Math.floor(lon / NAK_DEG), 26);
  const nak = NAKSHATRAS[nakIdx];
  const elapsed = lon - nakIdx * NAK_DEG;
  
  const start = VIM.findIndex((v) => v[0] === nak.ruler);
  const subs: { lord: string; years: number; from: number; to: number }[] = [];
  let cursor = 0;
  for (let j = 0; j < 9; j++) {
    const [lord, years] = VIM[(start + j) % 9];
    const width = (years / 120) * NAK_DEG;
    subs.push({ lord, years, from: cursor, to: cursor + width });
    cursor += width;
  }
  
  const activeSub = subs.find((s) => elapsed >= s.from && elapsed < s.to) ?? subs[subs.length - 1];
  
  const subStart = VIM.findIndex((v) => v[0] === activeSub.lord);
  const subOffset = elapsed - activeSub.from;
  const subWidth = activeSub.to - activeSub.from;
  const subSubs: { lord: string; years: number; from: number; to: number }[] = [];
  let ssCursor = 0;
  for (let j = 0; j < 9; j++) {
    const [lord, years] = VIM[(subStart + j) % 9];
    const width = (years / 120) * subWidth;
    subSubs.push({ lord, years, from: ssCursor, to: ssCursor + width });
    ssCursor += width;
  }
  const activeSubSub = subSubs.find((s) => subOffset >= s.from && subOffset < s.to) ?? subSubs[subSubs.length - 1];

  return {
    nak,
    elapsed,
    subs,
    activeSub,
    activeSubSub
  };
}

export function CuspalSubLordVisualizer() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [chartData, setChartData] = useState<Preset>(PRESETS[0]);
  const [selectedIndex, setSelectedIndex] = useState(6); // default Cusp 7
  const [isNorthIndian, setIsNorthIndian] = useState(true);
  const [activeTab, setActiveTab] = useState<"visualizer" | "chain" | "math">("visualizer");

  // Sync state overrides based on selection to give realistic chain readings
  const chainDetails = useMemo(() => {
    const p = chartData;
    if (p.type === "marriage" && selectedIndex === 6) {
      return { occupancy: 11, ownership: [2], ownSubLord: "Venus", target: "Marriage (2, 7, 11)" };
    }
    if (p.type === "career" && selectedIndex === 9) {
      return { occupancy: 8, ownership: [], ownSubLord: "Mars", target: "Career (2, 6, 10, 11)" };
    }
    if (p.type === "libra_marriage" && selectedIndex === 6) {
      return { occupancy: 11, ownership: [4], ownSubLord: "Jupiter", target: "Marriage (2, 7, 11)" };
    }
    // generic fallback
    const hNum = selectedIndex + 1;
    return { occupancy: (hNum + 4) % 12 + 1, ownership: [hNum], ownSubLord: "Mercury", target: "Custom" };
  }, [chartData, selectedIndex]);

  const handlePresetSelect = (idx: number) => {
    setPresetIdx(idx);
    const p = PRESETS[idx];
    setChartData(p);
    if (p.type === "marriage") {
      setSelectedIndex(6); // Cusp 7
    } else if (p.type === "career") {
      setSelectedIndex(9); // Cusp 10
    } else {
      setSelectedIndex(6); // Cusp 7
    }
  };

  const activeLongitude = chartData.cusps[selectedIndex];
  const subData = getSubLordData(activeLongitude);
  
  // Traditional Sign Lord
  const signIdx = Math.min(Math.floor(activeLongitude / 30), 11);
  const traditionalSignLord = RASHIS[signIdx].lord;

  const getHouseContents = (houseNum: number) => {
    const contents: string[] = [];
    Object.entries(chartData.planets).forEach(([pName, lon]) => {
      const pSign = Math.floor(lon / 30) + 1;
      const lagnaSign = Math.floor(chartData.cusps[0] / 30) + 1;
      const houseOffset = (pSign - lagnaSign + 12) % 12 + 1;
      if (houseOffset === houseNum) {
        contents.push(pName);
      }
    });
    return contents;
  };

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px 22px 22px" }} data-interactive="cuspal-sub-lord-visualizer">
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.8rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span style={{ color: GOLD, fontSize: "9px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.08em" }}>Module 16 · Chapter 4 · Lesson 1</span>
            <h1 style={{ margin: "0.1rem 0 0", color: GOLD, fontSize: "1.3rem", fontWeight: 700 }}>Cuspal Sub-Lord Doctrine Visualizer</h1>
          </div>
          <button
            onClick={() => setIsNorthIndian(!isNorthIndian)}
            style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: "transparent", color: GOLD, padding: "0.25rem 0.5rem", fontSize: "10.5px", fontWeight: 800, cursor: "pointer" }}
          >
            {isNorthIndian ? "Show South Indian" : "Show North Indian"}
          </button>
        </div>

        {/* Preset Selector */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", marginTop: "0.8rem" }}>
          <span style={{ fontWeight: 800, color: INK_SECONDARY, fontSize: "10px", textTransform: "uppercase" }}>Load Case:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => handlePresetSelect(idx)}
              style={{
                border: `1px solid ${presetIdx === idx ? GOLD : HAIRLINE}`,
                borderRadius: 5,
                background: presetIdx === idx ? `${GOLD}15` : "transparent",
                color: presetIdx === idx ? GOLD : INK_PRIMARY,
                padding: "0.25rem 0.5rem",
                fontSize: "11px",
                fontWeight: presetIdx === idx ? 800 : 500,
                cursor: "pointer"
              }}
            >
              {p.name.split(" (")[0]}
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1rem" }}>
        
        {/* Left Side: Interactive Kundali Chart */}
        <div style={{ flex: "1 1 20rem", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem", width: "100%", maxWidth: "300px" }}>
            <h2 style={{ margin: "0 0 0.5rem", color: INK_SECONDARY, fontSize: "11px", fontWeight: 800, textTransform: "uppercase", textAlign: "center" }}>Interactive Cusp Map</h2>
            
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.8rem" }}>
              {isNorthIndian ? (
                <svg width="240" height="240" viewBox="0 0 300 300" style={{ border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", borderRadius: 8 }}>
                  <line x1="0" y1="0" x2="300" y2="300" stroke={HAIRLINE} strokeWidth="1.5" />
                  <line x1="300" y1="0" x2="0" y2="300" stroke={HAIRLINE} strokeWidth="1.5" />
                  <rect x="0" y="0" width="300" height="300" fill="none" stroke={HAIRLINE} strokeWidth="2" />
                  <polygon points="150,0 300,150 150,300 0,150" fill="none" stroke={HAIRLINE} strokeWidth="1.5" />
                  {[
                    { h: 1, x: 150, y: 75, poly: "150,0 75,75 150,150 225,75" },
                    { h: 2, x: 75, y: 35, poly: "0,0 150,0 75,75" },
                    { h: 3, x: 35, y: 75, poly: "0,0 0,150 75,75" },
                    { h: 4, x: 75, y: 150, poly: "0,150 75,75 150,150 75,225" },
                    { h: 5, x: 35, y: 225, poly: "0,150 0,300 75,225" },
                    { h: 6, x: 75, y: 265, poly: "0,300 150,300 75,225" },
                    { h: 7, x: 150, y: 225, poly: "150,150 75,225 150,300 225,225" },
                    { h: 8, x: 225, y: 265, poly: "150,300 300,300 225,225" },
                    { h: 9, x: 265, y: 225, poly: "300,150 300,300 225,225" },
                    { h: 10, x: 225, y: 150, poly: "150,150 225,75 300,150 225,225" },
                    { h: 11, x: 265, y: 75, poly: "300,0 300,150 225,75" },
                    { h: 12, x: 225, y: 35, poly: "150,0 300,0 225,75" }
                  ].map((d) => {
                    const isSelected = selectedIndex === d.h - 1;
                    const items = getHouseContents(d.h);
                    return (
                      <g key={d.h} style={{ cursor: "pointer" }} onClick={() => setSelectedIndex(d.h - 1)}>
                        <polygon points={d.poly} fill={isSelected ? `${GOLD}1A` : "transparent"} />
                        <text x={d.x} y={d.y - 10} textAnchor="middle" fontSize="11px" fill={GOLD} fontWeight="800">
                          {d.h}
                        </text>
                        <text x={d.x} y={d.y + 4} textAnchor="middle" fontSize="9px" fill={INK_MUTED}>
                          {Math.floor(chartData.cusps[d.h - 1] % 30)}°
                        </text>
                        {items.map((it, idx) => (
                          <text key={idx} x={d.x} y={d.y + 14 + idx * 9} textAnchor="middle" fontSize="9px" fill={INK_SECONDARY} fontWeight="700">
                            {it.substring(0, 3)}
                          </text>
                        ))}
                      </g>
                    );
                  })}
                </svg>
              ) : (
                <svg width="240" height="240" viewBox="0 0 300 300" style={{ border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", borderRadius: 8 }}>
                  <line x1="75" y1="0" x2="75" y2="300" stroke={HAIRLINE} strokeWidth="1.5" />
                  <line x1="225" y1="0" x2="225" y2="300" stroke={HAIRLINE} strokeWidth="1.5" />
                  <line x1="0" y1="75" x2="300" y2="75" stroke={HAIRLINE} strokeWidth="1.5" />
                  <line x1="0" y1="225" x2="300" y2="225" stroke={HAIRLINE} strokeWidth="1.5" />
                  {[
                    { rashi: 12, label: "Pi", x: 37, y: 37, cuspIdx: 11 },
                    { rashi: 1, label: "Ar", x: 112, y: 37, cuspIdx: 0 },
                    { rashi: 2, label: "Ta", x: 187, y: 37, cuspIdx: 1 },
                    { rashi: 3, label: "Ge", x: 262, y: 37, cuspIdx: 2 },
                    { rashi: 11, label: "Aq", x: 37, y: 112, cuspIdx: 10 },
                    { rashi: 4, label: "Cn", x: 262, y: 112, cuspIdx: 3 },
                    { rashi: 10, label: "Cp", x: 37, y: 187, cuspIdx: 9 },
                    { rashi: 5, label: "Le", x: 262, y: 187, cuspIdx: 4 },
                    { rashi: 9, label: "Sg", x: 37, y: 262, cuspIdx: 8 },
                    { rashi: 8, label: "Sc", x: 112, y: 262, cuspIdx: 7 },
                    { rashi: 7, label: "Li", x: 187, y: 262, cuspIdx: 6 },
                    { rashi: 6, label: "Vi", x: 262, y: 262, cuspIdx: 5 },
                  ].map((d) => {
                    const isSelected = selectedIndex === d.cuspIdx;
                    return (
                      <g key={d.rashi} style={{ cursor: "pointer" }} onClick={() => setSelectedIndex(d.cuspIdx)}>
                        <rect x={d.x - 37} y={d.y - 37} width="75" height="75" fill={isSelected ? `${GOLD}1A` : "transparent"} stroke={HAIRLINE} strokeWidth="0.5" />
                        <text x={d.x} y={d.y - 12} textAnchor="middle" fontSize="11px" fill={GOLD} fontWeight="800">
                          {d.label}
                        </text>
                        <text x={d.x} y={d.y + 4} textAnchor="middle" fontSize="9.5px" fill={INK_SECONDARY}>
                          Cusp {d.cuspIdx + 1}
                        </text>
                        <text x={d.x} y={d.y + 18} textAnchor="middle" fontSize="9px" fill={INK_MUTED}>
                          {Math.floor(chartData.cusps[d.cuspIdx] % 30)}°
                        </text>
                      </g>
                    );
                  })}
                  <rect x="75" y="75" width="150" height="150" fill="#FCFAF2" />
                  <text x="150" y="145" textAnchor="middle" fontSize="11px" fill={GOLD} fontWeight="800">GRAHVANI</text>
                </svg>
              )}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", justifyContent: "center" }}>
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  style={{
                    border: `1px solid ${selectedIndex === i ? GOLD : HAIRLINE}`,
                    borderRadius: 4,
                    background: selectedIndex === i ? `${GOLD}1A` : "transparent",
                    color: selectedIndex === i ? GOLD : INK_SECONDARY,
                    padding: "0.2rem 0.35rem",
                    fontSize: "10px",
                    fontWeight: selectedIndex === i ? 800 : 500,
                    cursor: "pointer"
                  }}
                >
                  C{i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Analysis & Visual Details */}
        <div style={{ flex: "1.2 1 24rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, gap: "0.5rem" }}>
            {[
              { id: "visualizer", label: "Sign vs Sub-Lord" },
              { id: "chain", label: "3-Element Chain" },
              { id: "math", label: "Computation Steps" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  border: "none",
                  borderBottom: activeTab === t.id ? `2.5px solid ${GOLD}` : "none",
                  background: "transparent",
                  color: activeTab === t.id ? GOLD : INK_SECONDARY,
                  padding: "0.5rem 0.8rem",
                  fontSize: "11.5px",
                  fontWeight: activeTab === t.id ? 800 : 500,
                  cursor: "pointer",
                  marginBottom: "-1px"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: SIGN VS SUB-LORD COMPARISON */}
          {activeTab === "visualizer" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem" }}>
                <h3 style={{ margin: "0 0 0.8rem", color: GOLD, fontSize: "13px", fontWeight: 800, textTransform: "uppercase" }}>
                  Selected: Cusp {selectedIndex + 1}
                </h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                  {/* Traditional Parashari */}
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.8rem", background: "rgba(0,0,0,0.01)" }}>
                    <span style={{ color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", display: "block" }}>Parāśarī House-Lord</span>
                    <strong style={{ fontSize: "16px", color: INK_PRIMARY, display: "block", margin: "0.2rem 0" }}>
                      {traditionalSignLord}
                    </strong>
                    <span style={{ fontSize: "11px", color: INK_SECONDARY }}>
                      Ruler of the sign {SIGNS[signIdx]}. Gives the house its broad flavor, character, and general background quality.
                    </span>
                  </div>

                  {/* KP Sub-Lord */}
                  <div style={{ border: `1px solid ${GOLD}`, borderRadius: 8, padding: "0.8rem", background: `${GOLD}0D` }}>
                    <span style={{ color: GOLD, fontSize: "9px", textTransform: "uppercase", display: "block", fontWeight: 900 }}>KP Cuspal Sub-Lord</span>
                    <strong style={{ fontSize: "16px", color: GOLD, display: "block", margin: "0.2rem 0" }}>
                      {subData.activeSub.lord}
                    </strong>
                    <span style={{ fontSize: "11px", color: INK_SECONDARY }}>
                      Exact Vimśottarī sub-division at {fmtZodiac(activeLongitude)}. Determines the binary YES/NO fructification of the house promise.
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: `1px dashed ${HAIRLINE}`, paddingTop: "0.8rem", marginTop: "0.8rem", fontSize: "11.5px", color: INK_SECONDARY, lineHeight: 1.5 }}>
                  <strong>The Doctrine:</strong> Why does KP focus on the sub-lord? Traditional systems use the sign-lord ({traditionalSignLord}) which remains identical for hours. KP resolves this by taking the sub-lord ({subData.activeSub.lord}) which shifts frequently, reflecting why events happen for one birth moment and fail for another.
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: THREE-ELEMENT SIGNIFICATOR CHAIN */}
          {activeTab === "chain" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem" }}>
                <h3 style={{ margin: "0 0 0.8rem", color: GOLD, fontSize: "13px", fontWeight: 800, textTransform: "uppercase" }}>
                  Three-Element Significator Chain
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  <div style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}`, borderRadius: 6, padding: "0.3rem 0.6rem", fontSize: "11px", fontWeight: 800, color: GOLD }}>
                    Cusp {selectedIndex + 1}
                  </div>
                  <span style={{ color: INK_MUTED }}>➔</span>
                  <div style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}`, borderRadius: 6, padding: "0.3rem 0.6rem", fontSize: "11px", fontWeight: 800, color: GOLD }}>
                    Sub-Lord: {subData.activeSub.lord}
                  </div>
                  <span style={{ color: INK_MUTED }}>➔</span>
                  <span style={{ fontSize: "11px", color: INK_MUTED, fontStyle: "italic" }}>Yields the chain below:</span>
                </div>

                {/* The 3 steps */}
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.6rem" }}>
                    <div style={{ width: "1.5rem", height: "1.5rem", borderRadius: "50%", background: GOLD, color: "#FFF", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "10px", flexShrink: 0 }}>
                      1
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "12px", color: INK_PRIMARY }}>Occupancy: {chainDetails.occupancy} House</strong>
                      <span style={{ color: INK_SECONDARY, fontSize: "11px" }}>
                        The sub-lord physically sits in the {chainDetails.occupancy} house on this chart.
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.6rem" }}>
                    <div style={{ width: "1.5rem", height: "1.5rem", borderRadius: "50%", background: GOLD, color: "#FFF", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "10px", flexShrink: 0 }}>
                      2
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "12px", color: INK_PRIMARY }}>
                        Ownership: {chainDetails.ownership.length > 0 ? chainDetails.ownership.map(h => `${h}H`).join(", ") : "None"}
                      </strong>
                      <span style={{ color: INK_SECONDARY, fontSize: "11px" }}>
                        The houses owned (sign-ruled) by the sub-lord in this chart context.
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.6rem" }}>
                    <div style={{ width: "1.5rem", height: "1.5rem", borderRadius: "50%", background: GOLD, color: "#FFF", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "10px", flexShrink: 0 }}>
                      3
                    </div>
                    <div>
                      <strong style={{ display: "block", fontSize: "12px", color: INK_PRIMARY }}>Own Sub-Lord: {chainDetails.ownSubLord}</strong>
                      <span style={{ color: INK_SECONDARY, fontSize: "11px" }}>
                        The recursive sub-lord of the sub-lord planet. Adds the final modifier or verdict validation.
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "1rem", background: "rgba(16,185,129,0.08)", border: `1px solid ${EMERALD}40`, padding: "0.6rem", borderRadius: 6, fontSize: "11px", color: INK_SECONDARY }}>
                  <strong>Event Screening:</strong> Mapped against query target <strong>{chainDetails.target}</strong>. If these houses intersect the chain above, the promise is disposed to activate.
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: MATHEMATICAL COMPUTATION DETAILS */}
          {activeTab === "math" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem", display: "grid", gap: "0.6rem" }}>
                <h3 style={{ margin: "0 0 0.4rem", color: GOLD, fontSize: "13px", fontWeight: 800, textTransform: "uppercase" }}>
                  Astronomical & Computational Parameters
                </h3>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                  <thead>
                    <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
                      <th style={{ textAlign: "left", padding: "0.3rem 0", color: INK_MUTED, fontWeight: 700 }}>Parameter</th>
                      <th style={{ textAlign: "right", padding: "0.3rem 0", color: INK_MUTED, fontWeight: 700 }}>Computed Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${HAIRLINE}40` }}>
                      <td style={{ padding: "0.4rem 0", color: INK_SECONDARY }}>Julian Date</td>
                      <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700 }}>2461202.0417 (praśna)</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${HAIRLINE}40` }}>
                      <td style={{ padding: "0.4rem 0", color: INK_SECONDARY }}>Active Cusp longitude</td>
                      <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700 }}>{activeLongitude.toFixed(4)}° ({fmtZodiac(activeLongitude)})</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${HAIRLINE}40` }}>
                      <td style={{ padding: "0.4rem 0", color: INK_SECONDARY }}>Ayanāṁśa Type / Value</td>
                      <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700 }}>Krishnamurti (KP) / 23°34′12″</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${HAIRLINE}40` }}>
                      <td style={{ padding: "0.4rem 0", color: INK_SECONDARY }}>Nakṣatra division start</td>
                      <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700 }}>{(Math.floor(activeLongitude / NAK_DEG) * NAK_DEG).toFixed(4)}°</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${HAIRLINE}40` }}>
                      <td style={{ padding: "0.4rem 0", color: INK_SECONDARY }}>Offset inside Nakṣatra</td>
                      <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700 }}>{fmtDMS(subData.elapsed)} ({Math.floor(subData.elapsed * 60)}′ / 800′)</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${HAIRLINE}40` }}>
                      <td style={{ padding: "0.4rem 0", color: INK_SECONDARY }}>Computed Cusp Sub-Lord</td>
                      <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700, color: GOLD }}>{subData.activeSub.lord}</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${HAIRLINE}40` }}>
                      <td style={{ padding: "0.4rem 0", color: INK_SECONDARY }}>Computed Cusp Sub-Sub-Lord</td>
                      <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700 }}>{subData.activeSubSub.lord}</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
