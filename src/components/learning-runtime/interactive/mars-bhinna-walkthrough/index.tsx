"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, CheckCircle2, AlertTriangle, ArrowRight, Play } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface StepInfo {
  contributor: string;
  symbol: string;
  natalSign: number;
  houses: number[];
  color: string;
  desc: string;
}

const STEPS: StepInfo[] = [
  {
    contributor: "Sun",
    symbol: "☉",
    natalSign: 4, // Cancer (Karka)
    houses: [3, 5, 6, 10, 11, 12],
    color: "#f59e0b",
    desc: "Sun in Cancer. Benefic houses from Sun: 3, 5, 6, 10, 11, 12. These correspond to Virgo, Scorpio, Sagittarius, Aries, Taurus, and Gemini."
  },
  {
    contributor: "Moon",
    symbol: "☽",
    natalSign: 8, // Scorpio (Vṛścika)
    houses: [3, 6, 11],
    color: "#3b82f6",
    desc: "Moon in Scorpio. Benefic houses from Moon: 3, 6, 11. These correspond to Capricorn, Aries, and Virgo."
  },
  {
    contributor: "Mars",
    symbol: "♂",
    natalSign: 1, // Aries (Meṣa)
    houses: [1, 2, 4, 7, 8, 10, 11],
    color: "#ef4444",
    desc: "Mars in Aries. Benefic houses from Mars: 1, 2, 4, 7, 8, 10, 11. These correspond to Aries, Taurus, Cancer, Libra, Scorpio, Capricorn, and Aquarius."
  },
  {
    contributor: "Mercury",
    symbol: "☿",
    natalSign: 4, // Cancer (Karka)
    houses: [3, 5, 6, 11],
    color: "#10b981",
    desc: "Mercury in Cancer. Benefic houses from Mercury: 3, 5, 6, 11. These correspond to Virgo, Scorpio, Sagittarius, and Taurus."
  },
  {
    contributor: "Jupiter",
    symbol: "♃",
    natalSign: 9, // Sagittarius (Dhanus)
    houses: [1, 4, 10, 11],
    color: "#d97706",
    desc: "Jupiter in Sagittarius. Benefic houses from Jupiter: 1, 4, 10, 11. These correspond to Sagittarius, Pisces, Virgo, and Libra."
  },
  {
    contributor: "Venus",
    symbol: "♀",
    natalSign: 7, // Libra (Tulā)
    houses: [6, 8, 11, 12],
    color: "#ec4899",
    desc: "Venus in Libra. Benefic houses from Venus: 6, 8, 11, 12. These correspond to Pisces, Taurus, Leo, and Virgo."
  },
  {
    contributor: "Saturn",
    symbol: "♄",
    natalSign: 6, // Virgo (Kanyā)
    houses: [1, 4, 7, 8, 10, 11],
    color: "#64748b",
    desc: "Saturn in Virgo. Benefic houses from Saturn: 1, 4, 7, 8, 10, 11. These correspond to Virgo, Sagittarius, Pisces, Aries, Cancer, and Gemini."
  },
  {
    contributor: "Lagna",
    symbol: "ASC",
    color: GOLD_DEEP,
    natalSign: 1, // Aries (Meṣa)
    houses: [1, 3, 6, 10, 11],
    desc: "Lagna in Aries. Benefic houses from Lagna: 1, 3, 6, 10, 11. These correspond to Aries, Gemini, Virgo, Capricorn, and Aquarius."
  }
];

export function MarsBhinnaWalkthrough() {
  const [step, setStep] = useState<number>(0); // 0 = start, 1-8 steps, 9 = verify

  const currentStep = step > 0 && step <= 8 ? STEPS[step - 1] : null;

  const handleReset = () => {
    setStep(0);
  };

  const handleNext = () => {
    if (step < 9) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const getAbsoluteSign = (relativeHouse: number, natalSign: number) => {
    return ((natalSign - 1 + relativeHouse - 1) % 12) + 1;
  };

  // Compute accumulated Mars BAV up to current step
  const BAV = useMemo(() => {
    const grid = Array(12).fill(0);
    const stepsCount = Math.min(step, 8);
    for (let i = 0; i < stepsCount; i++) {
      const s = STEPS[i];
      s.houses.forEach(h => {
        const absSign = getAbsoluteSign(h, s.natalSign);
        grid[absSign - 1] += 1;
      });
    }
    return grid;
  }, [step]);

  const totalBindus = useMemo(() => BAV.reduce((a, b) => a + b, 0), [BAV]);

  const PLANETS_CONFIG: Record<string, { symbol: string; color: string }> = {
    ASC: { symbol: "ASC", color: GOLD_DEEP },
    "☉": { symbol: "☉", color: "#f59e0b" },
    "☽": { symbol: "☽", color: "#3b82f6" },
    "♂": { symbol: "♂", color: "#ef4444" },
    "☿": { symbol: "☿", color: "#10b981" },
    "♃": { symbol: "♃", color: "#d97706" },
    "♀": { symbol: "♀", color: "#ec4899" },
    "♄": { symbol: "♄", color: "#64748b" },
  };

  const getPlanetsInSign = (signNum: number) => {
    const planets = [];
    if (signNum === 1) planets.push("ASC", "♂");
    if (signNum === 4) planets.push("☉", "☿");
    if (signNum === 6) planets.push("♄");
    if (signNum === 7) planets.push("♀");
    if (signNum === 8) planets.push("☽");
    if (signNum === 9) planets.push("♃");
    return planets;
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
            Mars BAV Construction: Worked Example
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Step through building Mars&apos;s BAV on the sample chart and verify the 39 checksum.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* STACK SECTION */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: Circular Natal Chart Wheel */}
        <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "12.5px", fontWeight: 750, color: GOLD_DEEP }}>
            Sample Chart Placements
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
                return <line key={`nline-${i}`} x1="150" y1="150" x2={lx} y2={ly} stroke="rgba(156,122,47,0.08)" strokeWidth="1.2" />;
              })}

              {/* Rashi paths with active step contributor highlight */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                const isActive = currentStep && currentStep.natalSign === num;

                let fill = "transparent";
                let stroke = "none";
                if (isActive) {
                  fill = `color-mix(in srgb, ${currentStep.color} 10%, transparent)`;
                  stroke = currentStep.color;
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
                    key={`npath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isActive ? "2" : "0"}
                  />
                );
              })}

              {/* Labels and planet badges */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiNum - 1];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
                
                const planets = getPlanetsInSign(p.rashiNum);

                return (
                  <g key={`nlabel-${p.rashiNum}`}>
                    {/* Centered English Sign Name */}
                    <text
                      x={ptEng.x}
                      y={ptEng.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "8px", fontWeight: 700, fill: INK_PRIMARY }}
                    >
                      {r.nameEnglish}
                    </text>

                    {/* Planet Placements inside sector */}
                    {planets.map((planetName, planetIdx) => {
                      const conf = PLANETS_CONFIG[planetName];
                      if (!conf) return null;

                      // Radially stack
                      let radius = 85;
                      if (planets.length === 2) {
                        radius = planetIdx === 0 ? 94 : 76;
                      }

                      const ptPlanet = {
                        x: 150 + radius * Math.cos(angleRad),
                        y: 150 + radius * Math.sin(angleRad),
                      };

                      if (planetName === "ASC") {
                        return (
                          <g key={`nplanet-${p.rashiNum}-${planetName}`}>
                            <rect
                              x={ptPlanet.x - 14}
                              y={ptPlanet.y - 8}
                              width="28"
                              height="16"
                              rx="4"
                              ry="4"
                              fill="#ffffff"
                              stroke={conf.color}
                              strokeWidth="1.5"
                            />
                            <text
                              x={ptPlanet.x}
                              y={ptPlanet.y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              style={{ fontSize: "8.5px", fontWeight: 800, fill: conf.color }}
                            >
                              ASC
                            </text>
                          </g>
                        );
                      } else {
                        return (
                          <g key={`nplanet-${p.rashiNum}-${planetName}`}>
                            <circle
                              cx={ptPlanet.x}
                              cy={ptPlanet.y}
                              r="10"
                              fill="#ffffff"
                              stroke={conf.color}
                              strokeWidth="1.5"
                            />
                            <text
                              x={ptPlanet.x}
                              y={ptPlanet.y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              style={{ fontSize: "11px", fontWeight: 800, fill: conf.color }}
                            >
                              {conf.symbol}
                            </text>
                          </g>
                        );
                      }
                    })}
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="150" cy="150" r="30" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <text x="150" y="145" textAnchor="middle" style={{ fontSize: "8px", fontWeight: 800, fill: INK_MUTED }}>NATAL</text>
              <text x="150" y="160" textAnchor="middle" style={{ fontSize: "12px", fontWeight: 950, fill: GOLD_DEEP }}>CHART</text>
            </svg>
          </div>
        </div>

        {/* Middle Column: Stepper Controls */}
        <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", gap: "10px", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)" }}>
          <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 750, color: GOLD_DEEP }}>
            Construction Walk
          </h4>
          
          <div style={{ background: "rgba(156,122,47,0.04)", border: "1px solid rgba(156,122,47,0.12)", padding: "10px", borderRadius: "8px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            {step === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <p style={{ margin: 0, fontSize: "11px", lineHeight: 1.45, color: INK_SECONDARY }}>
                  Let&apos;s build Mars&apos;s BAV. Click Start to step through the natal positions and drop bindus.
                </p>
                <button
                  onClick={handleNext}
                  style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "none", borderRadius: "6px", background: "#ef4444", color: "#ffffff", fontSize: "11px", fontWeight: 800, cursor: "pointer", marginTop: "10px", justifyContent: "center" }}
                >
                  <Play size={12} fill="#ffffff" /> Start Walk
                </button>
              </div>
            ) : step === 9 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={14} /> Summation Verification
                </span>
                <p style={{ margin: 0, fontSize: "11px", lineHeight: 1.45, color: INK_SECONDARY }}>
                  All steps completed! Summing the bindus:
                </p>
                <div style={{ fontSize: "18px", fontWeight: 900, color: GOLD_DEEP, textAlign: "center", margin: "4px 0" }}>
                  Total = {totalBindus} bindus
                </div>
                {totalBindus === 39 ? (
                  <span style={{ fontSize: "10.5px", color: "#16a34a", fontWeight: 700, textAlign: "center" }}>
                    ✓ Checksum Matches Invariant: Correct!
                  </span>
                ) : (
                  <span style={{ fontSize: "10.5px", color: "#ef4444", fontWeight: 700, textAlign: "center" }}>
                    ✗ Checksum Mismatch! Expected 39.
                  </span>
                )}
              </div>
            ) : (
              currentStep && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "9.5px", padding: "2px 6px", borderRadius: "4px", background: `${currentStep.color}20`, color: currentStep.color, fontWeight: 800, alignSelf: "flex-start" }}>
                    Step {step} of 8
                  </span>
                  <strong style={{ fontSize: "12px", color: INK_PRIMARY }}>
                    Contributor: {currentStep.contributor} ({currentStep.symbol})
                  </strong>
                  <p style={{ margin: 0, fontSize: "11px", lineHeight: 1.4, color: INK_SECONDARY }}>
                    {currentStep.desc}
                  </p>
                </div>
              )
            )}
          </div>

          {step > 0 && (
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={handlePrev}
                style={{ flex: 1, padding: "6px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", background: "#ffffff", color: INK_SECONDARY, fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                style={{ flex: 1, padding: "6px", border: "none", borderRadius: "6px", background: "#ef4444", color: "#ffffff", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}
              >
                {step === 8 ? "Finish" : "Next"}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: BAV circle */}
        <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156, 122, 47, 0.15)", minWidth: 0 }}>
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
                
                const isProjectedSign = currentStep && currentStep.houses.some(h => getAbsoluteSign(h, currentStep.natalSign) === num);

                let fill = "transparent";
                if (isProjectedSign && currentStep) {
                  fill = `color-mix(in srgb, ${currentStep.color} 10%, transparent)`;
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
                    key={`wpath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke="none"
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

                return (
                  <g key={`wlabel-${p.rashiNum}`}>
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
                        r="10"
                        fill="rgba(156,122,47,0.04)"
                        stroke="rgba(156,122,47,0.12)"
                        strokeWidth="1"
                      />
                      <text
                        x={ptBindu.x}
                        y={ptBindu.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "8px", fontWeight: 800, fill: INK_SECONDARY }}
                      >
                        {BAV[p.rashiNum - 1]}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="150" cy="150" r="30" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <text x="150" y="142" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>TOTAL</text>
              <text x="150" y="156" textAnchor="middle" style={{ fontSize: "11px", fontWeight: 900, fill: GOLD_DEEP }}>{totalBindus}</text>
              <text x="150" y="166" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>BINDUS</text>
            </svg>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "9.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). Walk the step-by-step model. Summing all signs at the final step yields exactly 39 bindus, illustrating the invariant check for Mars BAV.
      </div>
    </div>
  );
}
