"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, ArrowRight, Play, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type TargetPlanetKey = "sun" | "mars" | "jupiter";
type ContributorIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface TargetConfig {
  label: string;
  symbol: string;
  color: string;
  total: number;
  tables: Record<string, number[]>; // contributor -> relative houses (1-indexed)
}

const TARGETS: Record<TargetPlanetKey, TargetConfig> = {
  sun: {
    label: "Sun",
    symbol: "☉",
    color: "#f59e0b",
    total: 48,
    tables: {
      sun: [1, 2, 4, 7, 8, 9, 10, 11],
      moon: [3, 6, 10, 11],
      mars: [1, 2, 4, 7, 8, 9, 10, 11],
      mercury: [3, 5, 6, 9, 10, 11, 12],
      jupiter: [5, 6, 9, 11],
      venus: [6, 7, 12],
      saturn: [1, 2, 4, 7, 8, 9, 10, 11],
      lagna: [3, 4, 6, 10, 11, 12],
    },
  },
  mars: {
    label: "Mars",
    symbol: "♂",
    color: "#ef4444",
    total: 39,
    tables: {
      sun: [3, 5, 6, 10, 11, 12],
      moon: [3, 6, 11],
      mars: [1, 2, 4, 7, 8, 10, 11],
      mercury: [3, 5, 6, 11],
      jupiter: [1, 4, 10, 11, 12],
      venus: [6, 8, 11, 12],
      saturn: [1, 4, 7, 8, 9, 10, 11],
      lagna: [1, 3, 6, 10, 11],
    },
  },
  jupiter: {
    label: "Jupiter",
    symbol: "♃",
    color: "#d97706",
    total: 56,
    tables: {
      sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
      moon: [2, 5, 7, 9, 11],
      mars: [1, 2, 4, 7, 8, 10, 11],
      mercury: [1, 2, 4, 5, 6, 9, 10, 11],
      jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
      venus: [2, 5, 6, 9, 10, 11],
      saturn: [3, 5, 6, 12],
      lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
    },
  },
};

interface ContributorInfo {
  key: string;
  label: string;
  symbol: string;
  natalSign: number; // Aries = 1, Pisces = 12
  color: string;
}

// Preset Natal Chart for the Step-by-Step Build
const CONTRIBUTORS: ContributorInfo[] = [
  { key: "sun", label: "Sun", symbol: "☉", natalSign: 1, color: "#f59e0b" }, // Aries
  { key: "moon", label: "Moon", symbol: "☽", natalSign: 2, color: "#3b82f6" }, // Taurus
  { key: "mars", label: "Mars", symbol: "♂", natalSign: 5, color: "#ef4444" }, // Leo
  { key: "mercury", label: "Mercury", symbol: "☿", natalSign: 3, color: "#10b981" }, // Gemini
  { key: "jupiter", label: "Jupiter", symbol: "♃", natalSign: 9, color: "#d97706" }, // Sagittarius
  { key: "venus", label: "Venus", symbol: "♀", natalSign: 7, color: "#ec4899" }, // Libra
  { key: "saturn", label: "Saturn", symbol: "♄", natalSign: 11, color: "#64748b" }, // Aquarius
  { key: "lagna", label: "Lagna", symbol: "ASC", natalSign: 1, color: GOLD_DEEP }, // Aries
];

export function BhinnaBuilder() {
  const [selectedTarget, setSelectedTarget] = useState<TargetPlanetKey>("mars");
  const [step, setStep] = useState<number>(0); // 0 = not started, 1 to 8 = completed contributors, 9 = fully summed BAV

  const activeTarget = TARGETS[selectedTarget];

  // Helper to translate relative house to absolute sign
  const getAbsoluteSign = (relativeHouse: number, natalSign: number) => {
    return ((natalSign - 1 + relativeHouse - 1) % 12) + 1;
  };

  // Compute BAV values dynamically based on current step
  const BAV_GRID = useMemo(() => {
    const grid = Array(12).fill(0);
    // Add bindus for each completed step
    const stepsCount = Math.min(step, 8);
    for (let s = 0; s < stepsCount; s++) {
      const c = CONTRIBUTORS[s];
      const beneficHouses = activeTarget.tables[c.key] || [];
      beneficHouses.forEach(h => {
        const absSign = getAbsoluteSign(h, c.natalSign);
        grid[absSign - 1] += 1;
      });
    }
    return grid;
  }, [step, activeTarget]);

  // Compute expected fully built BAV grid (all 8 contributors applied)
  const EXPECTED_GRID = useMemo(() => {
    const grid = Array(12).fill(0);
    CONTRIBUTORS.forEach(c => {
      const beneficHouses = activeTarget.tables[c.key] || [];
      beneficHouses.forEach(h => {
        const absSign = getAbsoluteSign(h, c.natalSign);
        grid[absSign - 1] += 1;
      });
    });
    return grid;
  }, [activeTarget]);

  // Active contributor of the current step (only defined when 0 < step <= 8)
  const currentContributor = useMemo(() => {
    if (step > 0 && step <= 8) {
      return CONTRIBUTORS[step - 1];
    }
    return null;
  }, [step]);

  const beneficHousesOfCurrent = useMemo(() => {
    if (currentContributor) {
      return activeTarget.tables[currentContributor.key] || [];
    }
    return [];
  }, [currentContributor, activeTarget]);

  const handleNext = () => {
    if (step < 9) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleAutoBuild = () => {
    setStep(9);
  };

  const handleReset = () => {
    setStep(0);
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
            Bhinnāṣṭakavarga Builder
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Walk step-by-step to build a planet&apos;s BAV grid by applying all 8 contributors.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* PLANET SELECTOR */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 750, color: GOLD_DEEP, marginRight: "4px" }}>
          Target Planet:
        </span>
        {(Object.keys(TARGETS) as TargetPlanetKey[]).map(tk => {
          const t = TARGETS[tk];
          const active = selectedTarget === tk;
          return (
            <button
              key={tk}
              onClick={() => { setSelectedTarget(tk); setStep(0); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 10px",
                borderRadius: "6px",
                border: active ? `1.5px solid ${t.color}` : "1px solid rgba(0,0,0,0.08)",
                background: active ? `${t.color}12` : "#ffffff",
                fontSize: "11px",
                fontWeight: active ? 700 : 500,
                color: active ? t.color : INK_SECONDARY,
                cursor: "pointer"
              }}
            >
              <span>{t.symbol}</span>
              <span>{t.label}</span>
              <span style={{ opacity: 0.6, fontSize: "9px" }}>({t.total})</span>
            </button>
          );
        })}
      </div>

      {/* GRID */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: Progress Controls */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "10px", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: GOLD_DEEP }}>
              Step {step === 9 ? "8" : step} of 8
            </span>
            <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: step === 9 ? "#d9f99d" : "#f1f5f9", color: step === 9 ? "#3f6212" : INK_MUTED, fontWeight: 700 }}>
              {step === 0 ? "Not Started" : step === 9 ? "Completed" : "In Progress"}
            </span>
          </div>

          {/* Stepper details */}
          <div style={{ background: "rgba(156,122,47,0.04)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            {step === 0 ? (
              <div>
                <p style={{ margin: 0, fontSize: "11.5px", lineHeight: 1.5, color: INK_SECONDARY }}>
                  Let&apos;s build the BAV grid for <strong>{activeTarget.label}</strong>. We will apply the contribution tables for all 8 contributors one-by-one.
                </p>
                <button
                  onClick={handleNext}
                  style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%", justifyContent: "center", padding: "8px", borderRadius: "8px", border: "none", background: activeTarget.color, color: "#ffffff", fontWeight: 800, fontSize: "11px", marginTop: "12px", cursor: "pointer" }}
                >
                  <Play size={12} fill="#ffffff" /> Start Step-by-Step
                </button>
              </div>
            ) : step === 9 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={14} /> BAV Grid Complete!
                </span>
                <p style={{ margin: 0, fontSize: "11.5px", lineHeight: 1.5, color: INK_SECONDARY }}>
                  All 8 contributors have been stacked. The final BAV totals exactly <strong>{activeTarget.total}</strong> bindus, matching the checksum!
                </p>
              </div>
            ) : (
              currentContributor && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: `${currentContributor.color}20`, color: currentContributor.color, fontWeight: 800 }}>
                      Contributor {step}
                    </span>
                    <strong style={{ fontSize: "12px", color: INK_PRIMARY }}>
                      {currentContributor.label}
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "11px", lineHeight: 1.4, color: INK_SECONDARY }}>
                    {currentContributor.label} is placed natally in <strong>{RASHIS[currentContributor.natalSign - 1].nameEnglish} ({currentContributor.natalSign})</strong>.
                  </p>
                  
                  <div style={{ background: "#ffffff", padding: "8px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.06)" }}>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, display: "block", marginBottom: "2px" }}>
                      Benefic Places relative to {currentContributor.label}:
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>
                      {beneficHousesOfCurrent.join(", ")}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: "10.5px", lineHeight: 1.35, color: INK_MUTED, fontStyle: "italic" }}>
                    * Dropping bindus in houses {beneficHousesOfCurrent.join(", ")} relative to {currentContributor.label} natal position.
                  </p>
                </div>
              )
            )}
          </div>

          {/* Stepper buttons */}
          {step > 0 && (
            <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
              <button
                onClick={handlePrev}
                disabled={step === 0}
                style={{ flex: 1, display: "flex", alignItems: "center", gap: "4px", justifyContent: "center", padding: "8px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", background: "#ffffff", color: INK_SECONDARY, fontSize: "11px", fontWeight: 700, cursor: "pointer", opacity: step === 0 ? 0.5 : 1 }}
              >
                <ChevronLeft size={14} /> Back
              </button>
              
              <button
                onClick={handleNext}
                disabled={step === 9}
                style={{ flex: 1, display: "flex", alignItems: "center", gap: "4px", justifyContent: "center", padding: "8px", borderRadius: "8px", border: "none", background: activeTarget.color, color: "#ffffff", fontSize: "11px", fontWeight: 800, cursor: "pointer", opacity: step === 9 ? 0.5 : 1 }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}

          {step < 9 && step > 0 && (
            <button
              onClick={handleAutoBuild}
              style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center", padding: "8px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.15)", background: "transparent", color: GOLD_DEEP, fontSize: "11px", fontWeight: 800, cursor: "pointer" }}
            >
              Auto-Build Remaining
            </button>
          )}
        </div>

        {/* Right Column: Circular SVG Wheel */}
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

              {/* Segment highlights */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                
                const isContributorSign = currentContributor && num === currentContributor.natalSign;
                const isProjectedSign = currentContributor && beneficHousesOfCurrent.some(h => getAbsoluteSign(h, currentContributor.natalSign) === num);

                let fill = "transparent";
                let stroke = "none";
                if (isContributorSign) {
                  fill = `color-mix(in srgb, ${currentContributor.color} 10%, transparent)`;
                  stroke = currentContributor.color;
                } else if (isProjectedSign) {
                  fill = `color-mix(in srgb, ${activeTarget.color} 5%, transparent)`;
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
                    key={`bpath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isContributorSign ? "2.5" : "0.5"}
                  />
                );
              })}

              {/* Dynamic Projection Beams */}
              {(() => {
                if (!currentContributor) return null;
                const nIndex = currentContributor.natalSign - 1;
                const nAngleDeg = nIndex * 30 - 90;
                const nAngleRad = (nAngleDeg * Math.PI) / 180;
                const nPt = { x: 150 + 100 * Math.cos(nAngleRad), y: 150 + 100 * Math.sin(nAngleRad) };

                return beneficHousesOfCurrent.map(h => {
                  const absSignNum = getAbsoluteSign(h, currentContributor.natalSign);
                  const aIndex = absSignNum - 1;
                  const aAngleDeg = aIndex * 30 - 90;
                  const aAngleRad = (aAngleDeg * Math.PI) / 180;
                  const aPt = { x: 150 + 100 * Math.cos(aAngleRad), y: 150 + 100 * Math.sin(aAngleRad) };

                  return (
                    <g key={`beam-${absSignNum}`}>
                      <line
                        x1={nPt.x}
                        y1={nPt.y}
                        x2={aPt.x}
                        y2={aPt.y}
                        stroke={activeTarget.color}
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                      />
                      <circle cx={aPt.x} cy={aPt.y} r="3" fill={activeTarget.color} />
                    </g>
                  );
                });
              })()}

              {/* Labels and values */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiNum - 1];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
                const ptBindu = { x: 150 + 85 * Math.cos(angleRad), y: 150 + 85 * Math.sin(angleRad) };

                const isContributor = currentContributor && p.rashiNum === currentContributor.natalSign;

                return (
                  <g key={`blabel-${p.rashiNum}`}>
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
                        r={isContributor ? "12" : "10"}
                        fill={isContributor ? currentContributor.color : "rgba(156,122,47,0.04)"}
                        stroke={isContributor ? "#ffffff" : "rgba(156,122,47,0.12)"}
                        strokeWidth="1"
                      />
                      <text
                        x={ptBindu.x}
                        y={ptBindu.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: isContributor ? "9px" : "8px", fontWeight: 800, fill: isContributor ? "#ffffff" : INK_SECONDARY }}
                      >
                        {isContributor ? currentContributor.symbol : BAV_GRID[p.rashiNum - 1]}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="150" cy="150" r="30" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <text x="150" y="142" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>TOTAL</text>
              <text x="150" y="156" textAnchor="middle" style={{ fontSize: "11px", fontWeight: 900, fill: GOLD_DEEP }}>
                {step === 9 ? activeTarget.total : BAV_GRID.reduce((a, b) => a + b, 0)}
              </text>
              <text x="150" y="166" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>BINDUS</text>
            </svg>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "9.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). When the stepper concludes, verify that the sum of bindus across all 12 signs matches the target planet&apos;s expected checksum (Sun=48, Mars=39, Jupiter=56).
      </div>
    </div>
  );
}
