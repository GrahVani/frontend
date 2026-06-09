"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, HelpCircle, CheckCircle2 } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type Mode = "sav" | "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";

interface PlanetInfo {
  label: string;
  symbol: string;
  expected: number;
  color: string;
  bav: number[];
}

const PLANETS: Record<Exclude<Mode, "sav">, PlanetInfo> = {
  sun: {
    label: "Sun",
    symbol: "☉",
    expected: 48,
    color: AMBER,
    bav: [4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 4],
  },
  moon: {
    label: "Moon",
    symbol: "☽",
    expected: 49,
    color: SLATE_BLUE,
    bav: [3, 4, 5, 5, 4, 4, 4, 3, 5, 4, 4, 4],
  },
  mars: {
    label: "Mars",
    symbol: "♂",
    expected: 39,
    color: "#ef4444",
    bav: [2, 3, 4, 4, 3, 3, 3, 3, 4, 3, 4, 3],
  },
  mercury: {
    label: "Mercury",
    symbol: "☿",
    expected: 54,
    color: "#10b981",
    bav: [5, 4, 4, 5, 4, 5, 4, 4, 5, 4, 5, 5],
  },
  jupiter: {
    label: "Jupiter",
    symbol: "♃",
    expected: 56,
    color: "#d97706",
    bav: [6, 5, 3, 5, 4, 5, 5, 4, 5, 5, 4, 5],
  },
  venus: {
    label: "Venus",
    symbol: "♀",
    expected: 52,
    color: PURPLE,
    bav: [5, 4, 2, 5, 4, 4, 4, 3, 5, 4, 4, 8],
  },
  saturn: {
    label: "Saturn",
    symbol: "♄",
    expected: 39,
    color: "#64748b",
    bav: [3, 3, 3, 4, 3, 3, 3, 3, 4, 3, 4, 3],
  },
};

export function SavBuilder() {
  const [activeMode, setActiveMode] = useState<Mode>("sav");
  const [hoveredSignIndex, setHoveredSignIndex] = useState<number | null>(null);

  const planetKeys = Object.keys(PLANETS) as Exclude<Mode, "sav">[];

  const savGrid = useMemo(() => {
    const grid = Array(12).fill(0);
    for (let i = 0; i < 12; i++) {
      planetKeys.forEach(pk => {
        grid[i] += PLANETS[pk].bav[i];
      });
    }
    return grid;
  }, [planetKeys]);

  const activeGrid = useMemo(() => {
    if (activeMode === "sav") return savGrid;
    return PLANETS[activeMode].bav;
  }, [activeMode, savGrid]);

  const activeTotal = useMemo(() => {
    if (activeMode === "sav") return 337;
    return PLANETS[activeMode].expected;
  }, [activeMode]);

  const handleReset = () => {
    setActiveMode("sav");
    setHoveredSignIndex(null);
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

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Sarvāṣṭakavarga (SAV) Builder
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Sum the 7 planetary BAV grids sign-by-sign to build the composite chart-wide SAV map.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* LAGNA EXCLUSION BANNER */}
      <div style={{ background: "rgba(156,122,47,0.04)", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "10px 14px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
        <Info size={16} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
        <div style={{ fontSize: "11px", lineHeight: 1.45, color: INK_SECONDARY }}>
          <strong>Lagna Exclusion Rule:</strong> Although Lagna acts as a contributor when building each individual planet&apos;s BAV, the <strong>SAV sums only the 7 planetary BAVs</strong>. Lagna&apos;s own BAV is excluded, keeping the SAV total at exactly <strong>337</strong> bindus.
        </div>
      </div>

      {/* MODE TABS */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", background: "#ffffff", padding: "8px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
        <button
          onClick={() => setActiveMode("sav")}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: activeMode === "sav" ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.08)",
            background: activeMode === "sav" ? "rgba(156,122,47,0.08)" : "#ffffff",
            fontSize: "11.5px",
            fontWeight: 800,
            color: activeMode === "sav" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer"
          }}
        >
          Σ SAV (337)
        </button>
        {planetKeys.map(pk => {
          const p = PLANETS[pk];
          const active = activeMode === pk;
          return (
            <button
              key={pk}
              onClick={() => setActiveMode(pk)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 10px",
                borderRadius: "6px",
                border: active ? `1.5px solid ${p.color}` : "1px solid rgba(0,0,0,0.08)",
                background: active ? `${p.color}12` : "#ffffff",
                fontSize: "11px",
                fontWeight: active ? 700 : 500,
                color: active ? p.color : INK_SECONDARY,
                cursor: "pointer"
              }}
            >
              <span>{p.symbol}</span>
              <span>{p.label} BAV</span>
            </button>
          );
        })}
      </div>

      {/* SPLIT VIEW */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left: Summation Grid Table */}
        <div style={{ flex: "1 1 420px", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "12.5px", fontWeight: 750, color: GOLD_DEEP }}>
            Sign-by-Sign Addition Grid
          </h4>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "center" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", color: INK_MUTED }}>
                  <th style={{ padding: "6px 4px", textAlign: "left" }}>Sign</th>
                  {planetKeys.map(pk => (
                    <th key={pk} style={{ padding: "6px 4px", color: PLANETS[pk].color }}>{PLANETS[pk].symbol}</th>
                  ))}
                  <th style={{ padding: "6px 4px", fontWeight: 800, color: GOLD_DEEP }}>SAV</th>
                </tr>
              </thead>
              <tbody>
                {RASHIS.map((r, idx) => {
                  const isHovered = hoveredSignIndex === idx;
                  return (
                    <tr
                      key={r.number}
                      onMouseEnter={() => setHoveredSignIndex(idx)}
                      onMouseLeave={() => setHoveredSignIndex(null)}
                      style={{
                        borderBottom: "1px solid rgba(0,0,0,0.03)",
                        background: isHovered ? "rgba(156,122,47,0.04)" : "transparent",
                        transition: "all 0.15s"
                      }}
                    >
                      <td style={{ padding: "6px 4px", textAlign: "left", fontWeight: 750 }}>
                        {r.nameEnglish} ({r.number})
                      </td>
                      {planetKeys.map(pk => {
                        const cellVal = PLANETS[pk].bav[idx];
                        const highlight = activeMode === pk;
                        return (
                          <td
                            key={pk}
                            style={{
                              padding: "6px 4px",
                              background: highlight ? `${PLANETS[pk].color}08` : "transparent",
                              fontWeight: highlight ? 700 : 400,
                              color: highlight ? PLANETS[pk].color : INK_SECONDARY
                            }}
                          >
                            {cellVal}
                          </td>
                        );
                      })}
                      <td
                        style={{
                          padding: "6px 4px",
                          fontWeight: 800,
                          color: GOLD_DEEP,
                          background: activeMode === "sav" ? "rgba(156,122,47,0.05)" : "transparent"
                        }}
                      >
                        {savGrid[idx]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {hoveredSignIndex !== null && (
            <div style={{ marginTop: "10px", padding: "8px", borderRadius: "6px", background: "rgba(156,122,47,0.03)", border: "1px solid rgba(156,122,47,0.1)", fontSize: "10.5px", color: INK_SECONDARY }}>
              <strong>Meṣa to Mīna Addition for {RASHIS[hoveredSignIndex].nameEnglish}:</strong>{" "}
              {planetKeys.map(pk => PLANETS[pk].bav[hoveredSignIndex]).join(" + ")} = <strong>{savGrid[hoveredSignIndex]}</strong> bindus.
            </div>
          )}
        </div>

        {/* Right: Circular Wheel */}
        <div style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <h4 style={{ margin: "0 0 6px 0", fontSize: "12.5px", fontWeight: 750, color: GOLD_DEEP }}>
            {activeMode === "sav" ? "Sarvāṣṭakavarga Wheel" : `${PLANETS[activeMode].label} BAV Wheel`}
          </h4>
          <div style={{ position: "relative", width: "240px", height: "240px" }}>
            <svg width="240" height="240" viewBox="0 0 300 300">
              <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="2" />
              <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />
              
              {/* Sector Division Lines */}
              {RASHIS.map((_, i) => {
                const angleDeg = i * 30 - 105;
                const angleRad = (angleDeg * Math.PI) / 180;
                const lx = 150 + 130 * Math.cos(angleRad);
                const ly = 150 + 130 * Math.sin(angleRad);
                return <line key={`line-${i}`} x1="150" y1="150" x2={lx} y2={ly} stroke="rgba(156,122,47,0.08)" strokeWidth="1.2" />;
              })}

              {/* Segment highlights */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                const isHovered = hoveredSignIndex === (num - 1);
                
                let fill = "transparent";
                let stroke = "none";
                if (isHovered) {
                  fill = "color-mix(in srgb, var(--gl-gold-accent, #9C7A2F) 10%, transparent)";
                  stroke = GOLD;
                }

                const startAngle = i * 30 - 105;
                const endAngle = i * 30 - 75;
                const so = { x: 150 + 130 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((startAngle * Math.PI) / 180) };
                const eo = { x: 150 + 130 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((endAngle * Math.PI) / 180) };
                const si = { x: 150 + 70 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 70 * Math.sin((startAngle * Math.PI) / 180) };
                const ei = { x: 150 + 70 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 70 * Math.sin((endAngle * Math.PI) / 180) };
                
                const pathData = [
                  `M ${si.x} ${si.y}`,
                  `L ${so.x} ${so.y}`,
                  `A 130 130 0 0 1 ${eo.x} ${eo.y}`,
                  `L ${ei.x} ${ei.y}`,
                  `A 70 70 0 0 0 ${si.x} ${si.y}`,
                  "Z"
                ].join(" ");

                return (
                  <path
                    key={`spath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isHovered ? "2" : "0.5"}
                    onMouseEnter={() => setHoveredSignIndex(num - 1)}
                    onMouseLeave={() => setHoveredSignIndex(null)}
                  />
                );
              })}

              {/* Labels and values */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiNum - 1];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
                const ptBindu = { x: 150 + 85 * Math.cos(angleRad), y: 150 + 85 * Math.sin(angleRad) };

                const isHovered = hoveredSignIndex === (p.rashiNum - 1);

                return (
                  <g key={`slabel-${p.rashiNum}`}>
                    <text
                      x={ptEng.x}
                      y={ptEng.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "8px", fontWeight: 700, fill: INK_PRIMARY }}
                    >
                      {r.nameEnglish}
                    </text>
                    
                    <g>
                      <circle
                        cx={ptBindu.x}
                        cy={ptBindu.y}
                        r={isHovered ? "12" : "10"}
                        fill={isHovered ? GOLD_DEEP : activeMode === "sav" ? "rgba(156,122,47,0.06)" : `color-mix(in srgb, ${PLANETS[activeMode].color} 8%, transparent)`}
                        stroke={isHovered ? "#ffffff" : activeMode === "sav" ? "rgba(156,122,47,0.15)" : PLANETS[activeMode].color}
                        strokeWidth="1"
                      />
                      <text
                        x={ptBindu.x}
                        y={ptBindu.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: isHovered ? "9px" : "8px", fontWeight: 800, fill: isHovered ? "#ffffff" : INK_SECONDARY }}
                      >
                        {activeGrid[p.rashiNum - 1]}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="150" cy="150" r="30" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <text x="150" y="142" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>TOTAL</text>
              <text x="150" y="156" textAnchor="middle" style={{ fontSize: "11px", fontWeight: 900, fill: GOLD_DEEP }}>{activeTotal}</text>
              <text x="150" y="166" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>BINDUS</text>
            </svg>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "9.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). Summing the 7 planetary BAV totals yields exactly 337 bindus (48 + 49 + 39 + 54 + 56 + 52 + 39 = 337). This is the chart-wide checksum.
      </div>
    </div>
  );
}
