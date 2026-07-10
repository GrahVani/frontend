"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, ArrowRight } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type ContributorKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "lagna";

interface ContributorPreset {
  label: string;
  symbol: string;
  color: string;
  houses: number[]; // 1-indexed relative houses that receive bindus
}

const PRESETS: Record<ContributorKey, ContributorPreset> = {
  sun: {
    label: "Sun",
    symbol: "☉",
    color: "#f59e0b",
    houses: [1, 2, 4, 7, 8, 9, 10, 11],
  },
  moon: {
    label: "Moon",
    symbol: "☽",
    color: "#3b82f6",
    houses: [3, 6, 10, 11],
  },
  mars: {
    label: "Mars",
    symbol: "♂",
    color: "#ef4444",
    houses: [1, 2, 4, 7, 8, 10, 11],
  },
  mercury: {
    label: "Mercury",
    symbol: "☿",
    color: "#10b981",
    houses: [1, 3, 5, 6, 9, 10, 11, 12],
  },
  jupiter: {
    label: "Jupiter",
    symbol: "♃",
    color: "#d97706",
    houses: [1, 2, 3, 4, 7, 8, 10, 11],
  },
  venus: {
    label: "Venus",
    symbol: "♀",
    color: "#ec4899",
    houses: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  saturn: {
    label: "Saturn",
    symbol: "♄",
    color: "#64748b",
    houses: [3, 5, 6, 11],
  },
  lagna: {
    label: "Lagna",
    symbol: "ASC",
    color: GOLD_DEEP,
    houses: [3, 4, 6, 10, 11, 12],
  },
};

export function ContributionTableDemo() {
  const [selectedContributor, setSelectedContributor] = useState<ContributorKey>("sun");
  const [natalSignNum, setNatalSignNum] = useState<number>(1); // 1 = Aries, 12 = Pisces
  const [hoveredRelativeHouse, setHoveredRelativeHouse] = useState<number | null>(null);

  const activePreset = PRESETS[selectedContributor];

  // Helper to translate 1-indexed relative house to absolute 1-indexed sign number
  const getAbsoluteSign = (relativeHouse: number) => {
    // e.g. if natal is Aries (1), relative 2nd is Taurus (2).
    // Formula: (natalSignNum - 1 + relativeHouse - 1) % 12 + 1
    return ((natalSignNum - 1 + relativeHouse - 1) % 12) + 1;
  };

  const handleReset = () => {
    setSelectedContributor("sun");
    setNatalSignNum(1);
    setHoveredRelativeHouse(null);
  };

  // Compute total bindus this contributor donates
  const totalDonated = activePreset.houses.length;

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
            The Contribution-Table Principle
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Observe how a contributor donates bindus to signs relative to its natal placement.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* SELECTORS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
        {/* Contributor Planet Selector */}
        <div style={{ background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP }}>1. Contributor</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {(Object.keys(PRESETS) as ContributorKey[]).map(pk => {
              const p = PRESETS[pk];
              const active = selectedContributor === pk;
              return (
                <button
                  key={pk}
                  onClick={() => setSelectedContributor(pk)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: active ? `1.5px solid ${p.color}` : "1px solid rgba(0,0,0,0.08)",
                    background: active ? `${p.color}12` : "#ffffff",
                    fontSize: "11px",
                    fontWeight: active ? 700 : 500,
                    color: active ? p.color : INK_SECONDARY,
                    cursor: "pointer"
                  }}
                >
                  <span style={{ fontSize: "12px" }}>{p.symbol}</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Natal Sign Selector */}
        <div style={{ background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP }}>2. Natal Sign Position</span>
          <select
            value={natalSignNum}
            onChange={(e) => setNatalSignNum(Number(e.target.value))}
            style={{
              padding: "6px",
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
                Sign {r.number}: {r.nameEnglish} ({r.nameDevanagari})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: Relative Houses List */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)" }}>
          <h4 style={{ margin: "0 0 4px 0", fontSize: "12.5px", fontWeight: 750, color: GOLD_DEEP }}>
            Relative Donation Table (from {activePreset.label})
          </h4>
          <p style={{ margin: 0, fontSize: "10.5px", color: INK_MUTED, lineHeight: 1.4 }}>
            Hover a house row to view the donation beam in the zodiac wheel.
          </p>
          <div style={{ display: "grid", gap: "4px", marginTop: "4px" }}>
            {Array.from({ length: 12 }, (_, index) => {
              const houseNum = index + 1;
              const receivesBindu = activePreset.houses.includes(houseNum);
              const absSignNum = getAbsoluteSign(houseNum);
              const absSign = RASHIS[absSignNum - 1];
              const isHovered = hoveredRelativeHouse === houseNum;

              let bg = "transparent";
              let border = "1px solid rgba(0,0,0,0.03)";
              if (isHovered) {
                bg = receivesBindu ? `${activePreset.color}15` : "rgba(0,0,0,0.05)";
                border = `1px solid ${receivesBindu ? activePreset.color : "rgba(0,0,0,0.15)"}`;
              }

              return (
                <div
                  key={houseNum}
                  onMouseEnter={() => setHoveredRelativeHouse(houseNum)}
                  onMouseLeave={() => setHoveredRelativeHouse(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    background: bg,
                    border: border,
                    fontSize: "11px",
                    transition: "all 0.15s",
                    cursor: "default"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontWeight: 800, color: GOLD_DEEP, width: "34px" }}>
                      {houseNum === 1 ? "1st" : houseNum === 2 ? "2nd" : houseNum === 3 ? "3rd" : `${houseNum}th`}
                    </span>
                    <span style={{ color: INK_MUTED }}>house:</span>
                    <span style={{ fontWeight: 700, color: INK_PRIMARY }}>
                      {absSign.nameEnglish} ({absSign.number})
                    </span>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {receivesBindu ? (
                      <span style={{ background: `${activePreset.color}20`, color: activePreset.color, padding: "2px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: 850 }}>
                        +1 Bindu
                      </span>
                    ) : (
                      <span style={{ background: "rgba(0,0,0,0.05)", color: INK_MUTED, padding: "2px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: 500 }}>
                        0 Bindus
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Absolute Zodiac svg */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <div style={{ position: "relative", width: "260px", height: "260px" }}>
            <svg width="260" height="260" viewBox="0 0 300 300">
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

              {/* Rashi Paths and Highlights */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                const isNatal = num === natalSignNum;
                
                // Check relative house relation
                // Absolute house offset relative to natal: (num - natalSignNum + 12) % 12 + 1
                const relHouse = ((num - natalSignNum + 12) % 12) + 1;
                const receivesBindu = activePreset.houses.includes(relHouse);
                const isHovered = hoveredRelativeHouse === relHouse;

                let fill = "transparent";
                let stroke = "none";
                if (isNatal) {
                  fill = `color-mix(in srgb, ${activePreset.color} 10%, transparent)`;
                  stroke = activePreset.color;
                } else if (isHovered) {
                  fill = receivesBindu ? `color-mix(in srgb, ${activePreset.color} 15%, transparent)` : "rgba(0,0,0,0.06)";
                  stroke = receivesBindu ? activePreset.color : INK_MUTED;
                } else if (receivesBindu) {
                  fill = `color-mix(in srgb, ${activePreset.color} 5%, transparent)`;
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
                    key={`zpath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isNatal || isHovered ? "2.5" : "0.5"}
                    style={{ cursor: "pointer", transition: "all 0.15s" }}
                    onClick={() => setNatalSignNum(num)}
                  />
                );
              })}

              {/* Rays from Natal Sign to hovered sign */}
              {(() => {
                if (hoveredRelativeHouse === null) return null;
                const receivesBindu = activePreset.houses.includes(hoveredRelativeHouse);
                if (!receivesBindu) return null;

                const absSignNum = getAbsoluteSign(hoveredRelativeHouse);
                
                const nIndex = natalSignNum - 1;
                const aIndex = absSignNum - 1;

                const nAngleDeg = nIndex * 30 - 90;
                const nAngleRad = (nAngleDeg * Math.PI) / 180;
                const nPt = { x: 150 + 100 * Math.cos(nAngleRad), y: 150 + 100 * Math.sin(nAngleRad) };

                const aAngleDeg = aIndex * 30 - 90;
                const aAngleRad = (aAngleDeg * Math.PI) / 180;
                const aPt = { x: 150 + 100 * Math.cos(aAngleRad), y: 150 + 100 * Math.sin(aAngleRad) };

                return (
                  <g>
                    <line
                      x1={nPt.x}
                      y1={nPt.y}
                      x2={aPt.x}
                      y2={aPt.y}
                      stroke={activePreset.color}
                      strokeWidth="2.5"
                      strokeDasharray="4,3"
                    />
                    <circle cx={aPt.x} cy={aPt.y} r="4" fill={activePreset.color} />
                  </g>
                );
              })()}

              {/* Rashi Labels */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiNum - 1];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
                const ptBindu = { x: 150 + 85 * Math.cos(angleRad), y: 150 + 85 * Math.sin(angleRad) };

                const isNatal = p.rashiNum === natalSignNum;
                const relHouse = ((p.rashiNum - natalSignNum + 12) % 12) + 1;
                const receivesBindu = activePreset.houses.includes(relHouse);

                return (
                  <g key={`zlabel-${p.rashiNum}`}>
                    <text
                      x={ptEng.x}
                      y={ptEng.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "8px", fontWeight: 700, fill: INK_PRIMARY }}
                    >
                      {r.nameEnglish}
                    </text>
                    
                    <g style={{ cursor: "pointer" }} onClick={() => setNatalSignNum(p.rashiNum)}>
                      <circle
                        cx={ptBindu.x}
                        cy={ptBindu.y}
                        r={isNatal ? "12" : "10"}
                        fill={isNatal ? activePreset.color : receivesBindu ? `color-mix(in srgb, ${activePreset.color} 20%, transparent)` : "rgba(0,0,0,0.03)"}
                        stroke={isNatal ? "#ffffff" : receivesBindu ? activePreset.color : "rgba(0,0,0,0.1)"}
                        strokeWidth="1"
                      />
                      <text
                        x={ptBindu.x}
                        y={ptBindu.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: isNatal ? "10px" : "8px", fontWeight: 800, fill: isNatal ? "#ffffff" : INK_SECONDARY }}
                      >
                        {isNatal ? activePreset.symbol : receivesBindu ? "1" : "0"}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="150" cy="150" r="30" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <text x="150" y="142" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>TOTAL</text>
              <text x="150" y="156" textAnchor="middle" style={{ fontSize: "11px", fontWeight: 900, fill: GOLD_DEEP }}>{totalDonated}</text>
              <text x="150" y="166" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>BINDUS</text>
            </svg>
          </div>
        </div>
      </div>

      {/* DETAIL WORKBENCH */}
      <div style={{ background: "rgba(156,122,47,0.04)", border: `1px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 750, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
          <Info size={14} /> Mechanics of Relative Counting
        </h4>
        <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.5", color: INK_SECONDARY }}>
          With <strong>{activePreset.label}</strong> positioned natally in <strong>{RASHIS[natalSignNum - 1].nameEnglish}</strong>:
          it will donate exactly <strong>1 bindu</strong> to all signs corresponding to its benefited houses relative to its position. 
          For example:
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", margin: "4px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#ffffff", padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.08)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: activePreset.color }}>Natal Sign</span>
            <ArrowRight size={12} color={INK_MUTED} />
            <span style={{ fontSize: "11.5px", fontWeight: 800, color: INK_PRIMARY }}>{RASHIS[natalSignNum - 1].nameEnglish}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#ffffff", padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.08)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: activePreset.color }}>Benefited Houses</span>
            <ArrowRight size={12} color={INK_MUTED} />
            <span style={{ fontSize: "11.5px", fontWeight: 800, color: INK_PRIMARY }}>
              {activePreset.houses.join(", ")}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#ffffff", padding: "6px 12px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.08)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: activePreset.color }}>Donates Bindus</span>
            <ArrowRight size={12} color={INK_MUTED} />
            <span style={{ fontSize: "11.5px", fontWeight: 800, color: INK_PRIMARY }}>
              {totalDonated} signs
            </span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: "10.5px", color: INK_MUTED, fontStyle: "italic", lineHeight: 1.4 }}>
          <strong>Takeaway:</strong> If you shift the planet&apos;s natal position (using the select dropdown or clicking signs on the wheel), the relative houses remain the same, but the absolute signs receiving bindus shift accordingly.
        </p>
      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "9.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). Every BAV is built from the tables of these eight contributors. Sun always donates exactly 48 bindus in total, Mars 39, and Jupiter 56.
      </div>
    </div>
  );
}
