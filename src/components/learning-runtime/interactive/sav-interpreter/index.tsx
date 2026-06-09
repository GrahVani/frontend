"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, Sparkles, Navigation, Award, ShieldAlert, CheckSquare } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const AMBER = "#f59e0b";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type Tab = "natal" | "transit";
type QuestionKey = "career" | "finance" | "sibling" | "competition";

interface QuestionConfig {
  label: string;
  targetHouse: number; // 1-indexed house (assuming Aries Lagna)
  planetLabel: string;
  planetSymbol: string;
  planetBavVal: number;
  signName: string;
  desc: string;
}

const QUESTIONS: Record<QuestionKey, QuestionConfig> = {
  career: {
    label: "10H: Career & Authority",
    targetHouse: 10, // Capricorn
    planetLabel: "Sun BAV in 10H",
    planetSymbol: "☉",
    planetBavVal: 4, // moderate
    signName: "Capricorn",
    desc: "Examines career growth, public recognition, and leadership capacity. Check the 10th house (Capricorn) SAV score."
  },
  finance: {
    label: "2H: Wealth & Assets",
    targetHouse: 2, // Taurus
    planetLabel: "Jupiter BAV in 2H",
    planetSymbol: "♃",
    planetBavVal: 5, // strong
    signName: "Taurus",
    desc: "Examines family lineage wealth, savings, assets, and speech capacity. Check the 2nd house (Taurus) SAV score."
  },
  sibling: {
    label: "3H: Siblings & Initiatives",
    targetHouse: 3, // Gemini
    planetLabel: "Mars BAV in 3H",
    planetSymbol: "♂",
    planetBavVal: 3, // weak
    signName: "Gemini",
    desc: "Examines self-efforts, courage, short journeys, and sibling dynamics. Check the 3rd house (Gemini) SAV score."
  },
  competition: {
    label: "6H: Debt, Disease & Enemies",
    targetHouse: 6, // Virgo
    planetLabel: "Saturn BAV in 6H",
    planetSymbol: "♄",
    planetBavVal: 3, // weak
    signName: "Virgo",
    desc: "Examines service, competitive obstacles, disease resolution, and debts. Check the 6th house (Virgo) SAV score."
  }
};

// Preset SAV grid aligned with lesson worked examples (10H = 32, 7H = 16, sum = 337)
const SAV_GRID = [28, 27, 24, 33, 26, 28, 16, 23, 33, 32, 29, 38];

export function SavInterpreter() {
  const [activeTab, setActiveTab] = useState<Tab>("natal");
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionKey>("career");
  const [overlayBav, setOverlayBav] = useState<boolean>(false);
  const [transitSignNum, setTransitSignNum] = useState<number>(1); // 1 = Aries

  const activeQuestion = QUESTIONS[selectedQuestion];

  const getThresholdColor = (val: number, alpha: boolean = false) => {
    if (val >= 30) return alpha ? "color-mix(in srgb, #16a34a 8%, transparent)" : "#16a34a"; // Green (Abundant)
    if (val >= 25) return alpha ? "color-mix(in srgb, #84cc16 8%, transparent)" : "#84cc16"; // Light Green (Strong)
    if (val >= 22) return alpha ? "color-mix(in srgb, #eab308 8%, transparent)" : "#eab308";  // Yellow (Moderate)
    if (val >= 18) return alpha ? "color-mix(in srgb, #f97316 8%, transparent)" : "#f97316";  // Orange (Weak)
    return alpha ? "color-mix(in srgb, #ef4444 8%, transparent)" : "#ef4444"; // Red (Very Weak)
  };

  const getThresholdText = (val: number) => {
    if (val >= 30) return "Abundant (Very Strong)";
    if (val >= 25) return "Strong (Auspicious)";
    if (val >= 22) return "Moderate (Mixed)";
    if (val >= 18) return "Weak (Restricted)";
    return "Very Weak (Difficulty)";
  };

  const handleReset = () => {
    setActiveTab("natal");
    setSelectedQuestion("career");
    setOverlayBav(false);
    setTransitSignNum(1);
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

  const transitFeedback = useMemo(() => {
    const savVal = SAV_GRID[transitSignNum - 1];
    if (savVal >= 30) {
      return { rating: "Auspicious Transit", color: "#16a34a", desc: `Transiting through ${RASHIS[transitSignNum - 1].nameEnglish} which has high SAV support (${savVal} bindus). Placements during this transit will manifest with maximum speed, protection, and gains.` };
    } else if (savVal >= 22) {
      return { rating: "Moderate Transit", color: GOLD, desc: `Transiting through ${RASHIS[transitSignNum - 1].nameEnglish} which has moderate SAV support (${savVal} bindus). Outcomes require standard effort and are stable.` };
    } else {
      return { rating: "Vulnerable Transit", color: "#ef4444", desc: `Transiting through ${RASHIS[transitSignNum - 1].nameEnglish} which has low SAV support (${savVal} bindus). Watch for obstacles, delays, lack of outer protection, and potential stress.` };
    }
  }, [transitSignNum]);

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            SAV Interpreter & Transit Grader
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Interpret the composite support of houses relative to the 28 average and evaluate transits.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(156,122,47,0.15)", gap: "12px" }}>
        <button
          onClick={() => setActiveTab("natal")}
          style={{
            padding: "8px 12px",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "natal" ? `2.5px solid ${GOLD_DEEP}` : "none",
            color: activeTab === "natal" ? GOLD_DEEP : INK_SECONDARY,
            fontSize: "12px",
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          1. Natal House Evaluation
        </button>
        <button
          onClick={() => setActiveTab("transit")}
          style={{
            padding: "8px 12px",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "transit" ? `2.5px solid ${GOLD_DEEP}` : "none",
            color: activeTab === "transit" ? GOLD_DEEP : INK_SECONDARY,
            fontSize: "12px",
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          2. Transit Simulator
        </button>
      </div>

      {/* SPLIT VIEW */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: SVG Wheel */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <h4 style={{ margin: "0 0 6px 0", fontSize: "12.5px", fontWeight: 750, color: GOLD_DEEP }}>
            Sarvāṣṭakavarga Map
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

              {/* Segment highlights based on SAV strength */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                const savVal = SAV_GRID[num - 1];
                
                const isSelectedHouse = activeTab === "natal" && num === activeQuestion.targetHouse;
                const isTransitHouse = activeTab === "transit" && num === transitSignNum;

                let fill = getThresholdColor(savVal, true);
                let stroke = "none";

                if (isSelectedHouse) {
                  stroke = GOLD_DEEP;
                } else if (isTransitHouse) {
                  stroke = SLATE_BLUE;
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
                    strokeWidth={isSelectedHouse || isTransitHouse ? "3" : "0.5"}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (activeTab === "transit") setTransitSignNum(num);
                    }}
                  />
                );
              })}

              {/* Transit indicator node */}
              {activeTab === "transit" && (() => {
                const idx = transitSignNum - 1;
                const angleDeg = idx * 30 - 90;
                const angleRad = (angleDeg * Math.PI) / 180;
                const pt = { x: 150 + 106 * Math.cos(angleRad), y: 150 + 106 * Math.sin(angleRad) };

                return (
                  <g>
                    <circle cx={pt.x} cy={pt.y} r="9" fill={SLATE_BLUE} stroke="#ffffff" strokeWidth="1.5" />
                    <text x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fontWeight: 700, fill: "#ffffff" }}>
                      T
                    </text>
                  </g>
                );
              })()}

              {/* Labels and values */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiNum - 1];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
                const ptBindu = { x: 150 + 85 * Math.cos(angleRad), y: 150 + 85 * Math.sin(angleRad) };

                const savVal = SAV_GRID[p.rashiNum - 1];

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
                    
                    <g
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (activeTab === "transit") setTransitSignNum(p.rashiNum);
                      }}
                    >
                      <circle
                        cx={ptBindu.x}
                        cy={ptBindu.y}
                        r="10"
                        fill={getThresholdColor(savVal)}
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                      <text
                        x={ptBindu.x}
                        y={ptBindu.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "8px", fontWeight: 800, fill: "#ffffff" }}
                      >
                        {savVal}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="150" cy="150" r="30" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <text x="150" y="142" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>TOTAL</text>
              <text x="150" y="156" textAnchor="middle" style={{ fontSize: "11px", fontWeight: 900, fill: GOLD_DEEP }}>337</text>
              <text x="150" y="166" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>BINDUS</text>
            </svg>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", fontSize: "8.5px", fontWeight: 750, marginTop: "8px" }}>
            <span style={{ color: "#16a34a" }}>● 30+</span>
            <span style={{ color: "#84cc16" }}>● 25-29</span>
            <span style={{ color: "#eab308" }}>● 22-24</span>
            <span style={{ color: "#f97316" }}>● 18-21</span>
            <span style={{ color: "#ef4444" }}>● &lt;18</span>
          </div>
        </div>

        {/* Right Column: Tab Workspaces */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          {activeTab === "natal" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Question Picker */}
              <div style={{ background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP, display: "block", marginBottom: "4px" }}>
                  Select Natal Focus:
                </span>
                <select
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value as QuestionKey)}
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

              {/* Evaluation Card */}
              <div style={{ background: "rgba(156,122,47,0.04)", border: "1px solid rgba(156,122,47,0.15)", padding: "12px", borderRadius: "12px" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Sparkles size={12} /> Natal Evaluation
                </span>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px", flexWrap: "wrap", gap: "6px" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: 700 }}>
                    Expected house ({activeQuestion.targetHouse}H in {activeQuestion.signName}) SAV:
                  </span>
                  <strong style={{ fontSize: "15px", color: getThresholdColor(SAV_GRID[activeQuestion.targetHouse - 1]), marginLeft: "4px" }}>
                    {SAV_GRID[activeQuestion.targetHouse - 1]} ({getThresholdText(SAV_GRID[activeQuestion.targetHouse - 1]).split(" ")[0]})
                  </strong>
                </div>

                <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    onClick={() => setOverlayBav(!overlayBav)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: overlayBav ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.15)",
                      background: overlayBav ? "rgba(156,122,47,0.08)" : "#ffffff",
                      fontSize: "10.5px",
                      fontWeight: 750,
                      cursor: "pointer",
                      color: GOLD_DEEP
                    }}
                  >
                    {overlayBav ? "Hide" : "Show"} Planet BAV Detail
                  </button>
                </div>

                {overlayBav && (
                  <div style={{ marginTop: "8px", padding: "8px", borderRadius: "6px", background: "#ffffff", border: "1.2px solid rgba(156,122,47,0.15)", display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: GOLD_DEEP }}>
                      {activeQuestion.planetSymbol}
                    </span>
                    <span style={{ fontSize: "11px", color: INK_SECONDARY }}>
                      <strong>{activeQuestion.planetLabel}:</strong> {activeQuestion.planetBavVal} bindus (out of 8 possible contributor bindus).
                    </span>
                  </div>
                )}

                <p style={{ margin: "8px 0 0 0", fontSize: "11.5px", lineHeight: "1.45", color: INK_SECONDARY, borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px" }}>
                  {SAV_GRID[activeQuestion.targetHouse - 1] >= 30 ? (
                    <span>Abundant support. The matters of this house will go extremely well, enjoying outer protection, support, and success.</span>
                  ) : SAV_GRID[activeQuestion.targetHouse - 1] >= 25 ? (
                    <span>Auspicious support. Matters manifest easily and positively with regular effort.</span>
                  ) : SAV_GRID[activeQuestion.targetHouse - 1] >= 22 ? (
                    <span>Moderate support. Mixed results. Success requires active efforts to structure and consolidate.</span>
                  ) : (
                    <span>Weak support. Vulnerability to delays, struggles, and friction in the house themes. Requires care.</span>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Transit controls */}
              <div style={{ background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                  <Navigation size={12} /> Select Transit Sign:
                </span>
                <select
                  value={transitSignNum}
                  onChange={(e) => setTransitSignNum(Number(e.target.value))}
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
                  {RASHIS.map(r => (
                    <option key={r.number} value={r.number}>
                      {r.nameEnglish} ({r.number}) — SAV: {SAV_GRID[r.number - 1]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transit Feedback */}
              <div style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)", padding: "12px", borderRadius: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 800, marginBottom: "4px" }}>
                  <span>Transit Grading:</span>
                  <span style={{ color: transitFeedback.color }}>{transitFeedback.rating}</span>
                </div>
                <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.4", color: INK_SECONDARY }}>
                  {transitFeedback.desc}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "9.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). High SAV scores (&gt;= 30) represent abundance, whereas values below 22 show restriction. Transit outcomes are dynamically graded based on sign SAV.
      </div>
    </div>
  );
}
