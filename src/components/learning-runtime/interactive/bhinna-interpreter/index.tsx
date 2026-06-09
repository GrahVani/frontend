"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, Award, AlertCircle, Sparkles, Navigation } from "lucide-react";
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

type PlanetKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";
type QuestionKey = "career" | "finance" | "education" | "obstacle";

interface PlanetConfig {
  label: string;
  symbol: string;
  color: string;
  bav: number[];
}

const PLANETS: Record<PlanetKey, PlanetConfig> = {
  sun: {
    label: "Sun",
    symbol: "☉",
    color: AMBER,
    bav: [4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 4],
  },
  moon: {
    label: "Moon",
    symbol: "☽",
    color: SLATE_BLUE,
    bav: [4, 4, 4, 5, 4, 4, 4, 3, 5, 4, 4, 4],
  },
  mars: {
    label: "Mars",
    symbol: "♂",
    color: "#ef4444",
    bav: [3, 3, 3, 4, 3, 3, 3, 3, 4, 3, 4, 3],
  },
  mercury: {
    label: "Mercury",
    symbol: "☿",
    color: "#10b981",
    bav: [5, 4, 4, 5, 4, 5, 4, 4, 5, 4, 5, 5],
  },
  jupiter: {
    label: "Jupiter",
    symbol: "♃",
    color: "#d97706",
    bav: [5, 5, 4, 5, 4, 5, 5, 4, 5, 5, 4, 5],
  },
  venus: {
    label: "Venus",
    symbol: "♀",
    color: PURPLE,
    bav: [4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 8],
  },
  saturn: {
    label: "Saturn",
    symbol: "♄",
    color: "#64748b",
    bav: [3, 3, 3, 4, 3, 3, 3, 3, 4, 3, 4, 3],
  },
};

interface QuestionConfig {
  label: string;
  planet: PlanetKey;
  targetHouse: number; // 1-indexed house (assuming Aries Lagna for simplicity)
  desc: string;
}

const QUESTIONS: Record<QuestionKey, QuestionConfig> = {
  career: {
    label: "Career Recognition & Authority",
    planet: "sun",
    targetHouse: 10, // Capricorn
    desc: "Examines your capacity to gain authority, leadership, and public recognition. Check the Sun's BAV in Capricorn (10th house).",
  },
  finance: {
    label: "Financial Stability & Growth",
    planet: "jupiter",
    targetHouse: 2, // Taurus
    desc: "Examines wealth, assets, and blessings. Check Jupiter's BAV in Taurus (2nd house).",
  },
  education: {
    label: "Wisdom, Learning & Children",
    planet: "jupiter",
    targetHouse: 5, // Leo
    desc: "Examines higher intellect, academic milestones, and child-rearing blessings. Check Jupiter's BAV in Leo (5th house).",
  },
  obstacle: {
    label: "Endurance & Obstacle Overcoming",
    planet: "saturn",
    targetHouse: 6, // Virgo
    desc: "Examines structural resistance, health challenges, and capacity to handle service. Check Saturn's BAV in Virgo (6th house).",
  },
};

export function BhinnaInterpreter() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetKey>("jupiter");
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionKey>("finance");
  const [transitSignNum, setTransitSignNum] = useState<number>(1); // 1 = Aries

  const activePlanet = PLANETS[selectedPlanet];
  const activeQuestion = QUESTIONS[selectedQuestion];

  const maxBinduVal = useMemo(() => Math.max(...activePlanet.bav), [activePlanet]);
  const minBinduVal = useMemo(() => Math.min(...activePlanet.bav), [activePlanet]);

  const handleReset = () => {
    setSelectedPlanet("jupiter");
    setSelectedQuestion("finance");
    setTransitSignNum(1);
  };

  const handleQuestionChange = (qk: QuestionKey) => {
    setSelectedQuestion(qk);
    setSelectedPlanet(QUESTIONS[qk].planet);
  };

  const transitFeedback = useMemo(() => {
    const binduVal = activePlanet.bav[transitSignNum - 1];
    if (binduVal >= 5) {
      return { rating: "Strong / Auspicious Transit", desc: `During this transit through ${RASHIS[transitSignNum - 1].nameEnglish}, the planet receives substantial support (${binduVal} bindus) from the chart. Manifestations will be highly positive and protected.`, color: "#16a34a" };
    } else if (binduVal === 4) {
      return { rating: "Neutral Transit", desc: `During this transit through ${RASHIS[transitSignNum - 1].nameEnglish}, the planet has moderate support (4 bindus). Outcomes require balanced effort and are standard.`, color: GOLD };
    } else {
      return { rating: "Weak / Vulnerable Transit", desc: `During this transit through ${RASHIS[transitSignNum - 1].nameEnglish}, support is low (${binduVal} bindus). Watch for obstacles, delays, and lack of protection.`, color: "#ef4444" };
    }
  }, [transitSignNum, activePlanet]);

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
            Bhinnāṣṭakavarga Interpreter
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Analyze peaks, valleys, predictive scenarios, and transit support for any planet.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* PLANET BAR */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 750, color: GOLD_DEEP, marginRight: "4px" }}>
          Select Planet BAV:
        </span>
        {(Object.keys(PLANETS) as PlanetKey[]).map(pk => {
          const p = PLANETS[pk];
          const active = selectedPlanet === pk;
          return (
            <button
              key={pk}
              onClick={() => setSelectedPlanet(pk)}
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
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* SPLIT GRID */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: BAV SVG Wheel */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: 750, color: GOLD_DEEP }}>
            {activePlanet.label} BAV (Peaks & Valleys)
          </h4>
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

              {/* Rashi paths with peak and valley highlights */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                const binduVal = activePlanet.bav[num - 1];
                const isPeak = binduVal === maxBinduVal;
                const isValley = binduVal === minBinduVal;
                const isTransit = num === transitSignNum;

                let fill = "transparent";
                let stroke = "none";
                if (isPeak) {
                  fill = "rgba(22,163,74,0.04)";
                  stroke = "#16a34a";
                } else if (isValley) {
                  fill = "rgba(239,68,68,0.03)";
                  stroke = "#ef4444";
                }

                if (isTransit) {
                  stroke = activePlanet.color;
                  fill = `color-mix(in srgb, ${activePlanet.color} 8%, transparent)`;
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
                    key={`ipath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isTransit ? "3" : isPeak || isValley ? "2" : "0.5"}
                    style={{ cursor: "pointer" }}
                    onClick={() => setTransitSignNum(num)}
                  />
                );
              })}

              {/* Transit indicator node on outer ring */}
              {(() => {
                const idx = transitSignNum - 1;
                const angleDeg = idx * 30 - 90;
                const angleRad = (angleDeg * Math.PI) / 180;
                const pt = { x: 150 + 106 * Math.cos(angleRad), y: 150 + 106 * Math.sin(angleRad) };

                return (
                  <g>
                    <circle cx={pt.x} cy={pt.y} r="9" fill={activePlanet.color} stroke="#ffffff" strokeWidth="1.5" />
                    <text x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fontWeight: 700, fill: "#ffffff" }}>
                      T
                    </text>
                  </g>
                );
              })()}

              {/* Labels */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiNum - 1];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
                const ptBindu = { x: 150 + 85 * Math.cos(angleRad), y: 150 + 85 * Math.sin(angleRad) };

                const binduVal = activePlanet.bav[p.rashiNum - 1];
                const isPeak = binduVal === maxBinduVal;
                const isValley = binduVal === minBinduVal;

                return (
                  <g key={`ilabel-${p.rashiNum}`}>
                    <text
                      x={ptEng.x}
                      y={ptEng.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "8px", fontWeight: 700, fill: INK_PRIMARY }}
                    >
                      {r.nameEnglish}
                    </text>
                    
                    <g style={{ cursor: "pointer" }} onClick={() => setTransitSignNum(p.rashiNum)}>
                      <circle
                        cx={ptBindu.x}
                        cy={ptBindu.y}
                        r="10"
                        fill={isPeak ? "#16a34a" : isValley ? "#ef4444" : "rgba(156,122,47,0.04)"}
                        stroke={isPeak ? "#ffffff" : isValley ? "#ffffff" : "rgba(156,122,47,0.12)"}
                        strokeWidth="1"
                      />
                      <text
                        x={ptBindu.x}
                        y={ptBindu.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "8px", fontWeight: 800, fill: isPeak || isValley ? "#ffffff" : INK_SECONDARY }}
                      >
                        {binduVal}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="150" cy="150" r="28" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <text x="150" y="146" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>INTERP</text>
              <text x="150" y="160" textAnchor="middle" style={{ fontSize: "14px", fontWeight: 950, fill: GOLD_DEEP }}>BAV</text>
            </svg>
          </div>
          
          <div style={{ display: "flex", gap: "8px", fontSize: "10px", marginTop: "4px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "2px", color: "#16a34a", fontWeight: 700 }}>
              <Award size={12} /> Peak ({maxBinduVal} bindus)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "2px", color: "#ef4444", fontWeight: 700 }}>
              <AlertCircle size={12} /> Valley ({minBinduVal} bindus)
            </span>
          </div>
        </div>

        {/* Right Column: Scenario & Transit workbench */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          {/* Scenario Picker */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP, display: "block", marginBottom: "4px" }}>
              1. Choose Predictive Question:
            </span>
            <select
              value={selectedQuestion}
              onChange={(e) => handleQuestionChange(e.target.value as QuestionKey)}
              style={{
                width: "100%",
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid rgba(156,122,47,0.2)",
                fontSize: "11px",
                color: INK_PRIMARY,
                background: "#ffffff",
                cursor: "pointer"
              }}
            >
              {(Object.keys(QUESTIONS) as QuestionKey[]).map(qk => (
                <option key={qk} value={qk}>
                  {QUESTIONS[qk].label}
                </option>
              ))}
            </select>
            <p style={{ margin: "6px 0 0 0", fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4 }}>
              {activeQuestion.desc}
            </p>
          </div>

          {/* House evaluation panel */}
          <div style={{ background: "rgba(156,122,47,0.04)", border: "1px solid rgba(156,122,47,0.15)", padding: "10px", borderRadius: "10px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
              <Sparkles size={12} /> Natal Evaluation
            </span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: INK_PRIMARY }}>
                Expected house ({activeQuestion.targetHouse}H) bindus:
              </span>
              <strong style={{ fontSize: "16px", color: activePlanet.color, marginLeft: "6px" }}>
                {activePlanet.bav[activeQuestion.targetHouse - 1]}
              </strong>
            </div>
            <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4 }}>
              {activePlanet.bav[activeQuestion.targetHouse - 1] >= 5 ? (
                <span>Strong support. The planet&apos;s significations are highly supported natally in this house, giving solid outcomes.</span>
              ) : activePlanet.bav[activeQuestion.targetHouse - 1] === 4 ? (
                <span>Neutral support. Outcomes are standard, requiring conscious focus to consolidate gains.</span>
              ) : (
                <span>Weak support. Manifestations are thin and prone to challenges. Needs qualitative mitigation to stabilize.</span>
              )}
            </p>
          </div>

          {/* Transit Simulator */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
              <Navigation size={12} /> 2. Transit Simulator
            </span>
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: INK_SECONDARY, whiteSpace: "nowrap" }}>Transit Sign:</span>
              <select
                value={transitSignNum}
                onChange={(e) => setTransitSignNum(Number(e.target.value))}
                style={{
                  padding: "4px",
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
                    {r.nameEnglish} ({r.number})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ background: "rgba(0,0,0,0.02)", padding: "8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.04)", marginTop: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: 700, marginBottom: "2px" }}>
                <span>Transit Evaluation:</span>
                <span style={{ color: transitFeedback.color }}>{transitFeedback.rating}</span>
              </div>
              <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.35", color: INK_MUTED }}>
                {transitFeedback.desc}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "9.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). High BAV scores (&gt;= 5) represent strong support zones; low BAV scores (&lt;= 3) show vulnerable placements. BAV is used natally to rank houses and dynamically to filter transits.
      </div>
    </div>
  );
}
