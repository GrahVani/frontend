"use client";

import React, { useState, useMemo } from "react";
import {
  AlertCircle, ShieldCheck, ShieldAlert, AlertOctagon,
  Activity, Zap, Compass, RefreshCw, Info, CheckCircle2, XCircle, RotateCcw
} from "lucide-react";

// Slate blue, indigo, and ivory color tokens
const STEEL_BLUE = "#365c7a";
const STEEL_DEEP = "#21394c";
const STEEL_LIGHT = "rgba(54, 92, 122, 0.05)";
const STEEL_BORDER = "rgba(54, 92, 122, 0.18)";
const GREEN = "#4e7037";
const GREEN_LIGHT = "rgba(78, 112, 55, 0.06)";
const RED = "#ad4b37";
const RED_LIGHT = "rgba(173, 75, 55, 0.05)";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

interface SubDivision {
  lord: string;
  startMin: number;
  endMin: number;
  durationMin: number;
  color: string;
}

interface NakshatraData {
  name: string;
  lord: string;
  startMin: number;
  endMin: number;
  subs: SubDivision[];
}

const ARIES_NAKSHATRAS: NakshatraData[] = [
  {
    name: "Aśvinī",
    lord: "Ketu",
    startMin: 0,
    endMin: 800, // 13°20'
    subs: [
      { lord: "Ketu", startMin: 0, endMin: 46.67, durationMin: 46.67, color: "#90a4ae" },
      { lord: "Venus", startMin: 46.67, endMin: 180, durationMin: 133.33, color: "#b3e5fc" },
      { lord: "Sun", startMin: 180, endMin: 220, durationMin: 40, color: "#ff8a80" },
      { lord: "Moon", startMin: 220, endMin: 286.67, durationMin: 66.67, color: "#cfd8dc" },
      { lord: "Mars", startMin: 286.67, endMin: 333.33, durationMin: 46.67, color: "#ff8a80" },
      { lord: "Rahu", startMin: 333.33, endMin: 453.33, durationMin: 120, color: "#ffe0b2" },
      { lord: "Jupiter", startMin: 453.33, endMin: 560, durationMin: 106.67, color: "#fff9c4" },
      { lord: "Saturn", startMin: 560, endMin: 686.67, durationMin: 126.67, color: "#c5cae9" },
      { lord: "Mercury", startMin: 686.67, endMin: 800, durationMin: 113.33, color: "#c8e6c9" }
    ]
  },
  {
    name: "Bharaṇī",
    lord: "Venus",
    startMin: 800,
    endMin: 1600, // 26°40'
    subs: [
      { lord: "Venus", startMin: 800, endMin: 933.33, durationMin: 133.33, color: "#b3e5fc" },
      { lord: "Sun", startMin: 933.33, endMin: 973.33, durationMin: 40, color: "#ff8a80" },
      { lord: "Moon", startMin: 973.33, endMin: 1040, durationMin: 66.67, color: "#cfd8dc" },
      { lord: "Mars", startMin: 1040, endMin: 1086.67, durationMin: 46.67, color: "#ff8a80" },
      { lord: "Rahu", startMin: 1086.67, endMin: 1206.67, durationMin: 120, color: "#ffe0b2" },
      { lord: "Jupiter", startMin: 1206.67, endMin: 1313.33, durationMin: 106.67, color: "#fff9c4" },
      { lord: "Saturn", startMin: 1313.33, endMin: 1440, durationMin: 126.67, color: "#c5cae9" },
      { lord: "Mercury", startMin: 1440, endMin: 1553.33, durationMin: 113.33, color: "#c8e6c9" },
      { lord: "Ketu", startMin: 1553.33, endMin: 1600, durationMin: 46.67, color: "#90a4ae" }
    ]
  },
  {
    name: "Kṛttikā (1st Quarter)",
    lord: "Sun",
    startMin: 1600,
    endMin: 1800, // 30°00'
    subs: [
      { lord: "Sun", startMin: 1600, endMin: 1640, durationMin: 40, color: "#ff8a80" },
      { lord: "Moon", startMin: 1640, endMin: 1706.67, durationMin: 66.67, color: "#cfd8dc" },
      { lord: "Mars", startMin: 1706.67, endMin: 1753.33, durationMin: 46.67, color: "#ff8a80" },
      { lord: "Rahu", startMin: 1753.33, endMin: 1800, durationMin: 46.67, color: "#ffe0b2" } // Rest cut off at 30°
    ]
  }
];

const PLANET_YEARS: Record<string, number> = {
  "Ketu": 7,
  "Venus": 20,
  "Sun": 6,
  "Moon": 10,
  "Mars": 7,
  "Rahu": 18,
  "Jupiter": 16,
  "Saturn": 19,
  "Mercury": 17
};

const PLANET_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

function formatArcToDegMin(minutes: number): string {
  const d = Math.floor(minutes / 60);
  const m = (minutes % 60).toFixed(1);
  return `${d}°${m}′`;
}

function formatArcToZodiac(totalArcMin: number): string {
  if (totalArcMin <= 1800) {
    const d = Math.floor(totalArcMin / 60);
    const minPart = (totalArcMin % 60).toFixed(1);
    return `Aries ${d}°${minPart}′`;
  } else {
    const taurusMin = totalArcMin - 1800;
    const d = Math.floor(taurusMin / 60);
    const minPart = (taurusMin % 60).toFixed(1);
    return `Taurus ${d}°${minPart}′`;
  }
}

function describeArc(x: number, y: number, rInner: number, rOuter: number, startAngleDeg: number, endAngleDeg: number) {
  const startRad1 = ((startAngleDeg - 90) * Math.PI) / 180;
  const endRad1 = ((endAngleDeg - 90) * Math.PI) / 180;
  
  const x1_in = x + rInner * Math.cos(startRad1);
  const y1_in = y + rInner * Math.sin(startRad1);
  const x2_in = x + rInner * Math.cos(endRad1);
  const y2_in = y + rInner * Math.sin(endRad1);

  const x1_out = x + rOuter * Math.cos(startRad1);
  const y1_out = y + rOuter * Math.sin(startRad1);
  const x2_out = x + rOuter * Math.cos(endRad1);
  const y2_out = y + rOuter * Math.sin(endRad1);
  
  const largeArc = endAngleDeg - startAngleDeg <= 180 ? 0 : 1;
  
  return [
    "M", x1_out, y1_out,
    "A", rOuter, rOuter, 0, largeArc, 1, x2_out, y2_out,
    "L", x2_in, y2_in,
    "A", rInner, rInner, 0, largeArc, 0, x1_in, y1_in,
    "Z"
  ].join(" ");
}

export function KPPrecisionResolutionComparator() {
  const [totalMin, setTotalMin] = useState<number>(330); // Default to 5°30' in Aries (330 arc-minutes)
  const [activeTab, setActiveTab] = useState<"slider" | "evaluation">("slider");
  
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement> | React.MouseEvent<SVGPathElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    let angleRad = Math.atan2(y, x);
    let angleNormalized = angleRad + Math.PI / 2;
    if (angleNormalized < 0) {
      angleNormalized += 2 * Math.PI;
    }
    const ratio = angleNormalized / (2 * Math.PI);
    const newMin = Math.round(ratio * 1800);
    if (newMin >= 0 && newMin <= 1800) {
      setTotalMin(newMin);
    }
  };
  
  // Evaluation checklist
  const [evalTab, setEvalTab] = useState<"strengths" | "limitations">("strengths");

  // State for math visualizer toggle and quiz
  const [showMath, setShowMath] = useState<boolean>(true);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [quizIsCorrect, setQuizIsCorrect] = useState<boolean | null>(null);

  // Calculations based on totalMin
  const currentNak = useMemo(() => {
    return ARIES_NAKSHATRAS.find(n => totalMin >= n.startMin && totalMin <= n.endMin) || ARIES_NAKSHATRAS[0];
  }, [totalMin]);

  // Generate full list of 9 subdivisions for the active Nakshatra (including Taurus extensions)
  const fullSubdivisions = useMemo(() => {
    const lordIndex = PLANET_ORDER.indexOf(currentNak.lord);
    let startMin = currentNak.name.includes("Aśvinī") ? 0 : currentNak.name.includes("Bharaṇī") ? 800 : 1600;
    const list = [];
    let cumulative = startMin;
    for (let i = 0; i < 9; i++) {
      const lord = PLANET_ORDER[(lordIndex + i) % 9];
      const years = PLANET_YEARS[lord];
      const duration = (years / 120) * 800;
      const subStart = cumulative;
      const subEnd = cumulative + duration;
      cumulative += duration;

      list.push({
        lord,
        years,
        duration,
        startMin: subStart,
        endMin: subEnd
      });
    }
    return list;
  }, [currentNak]);

  const currentSub = useMemo(() => {
    return fullSubdivisions.find(s => totalMin >= s.startMin && totalMin <= s.endMin) || fullSubdivisions[0];
  }, [fullSubdivisions, totalMin]);

  // Convert arc-minutes to Degrees and Minutes
  const deg = Math.floor(totalMin / 60);
  const min = Math.round(totalMin % 60);

  // Check if close to a boundary (within 3 arc-minutes)
  const boundaryDetails = useMemo(() => {
    const distToStart = Math.abs(totalMin - currentSub.startMin);
    const distToEnd = Math.abs(totalMin - currentSub.endMin);
    const isClose = distToStart <= 3 || distToEnd <= 3;
    const distance = Math.min(distToStart, distToEnd);
    return {
      isClose,
      distance,
      distToStart,
      distToEnd
    };
  }, [totalMin, currentSub]);

  const handleQuizSubmit = (optionId: string) => {
    setQuizSelectedOption(optionId);
    if (optionId === "opt_c") {
      setQuizIsCorrect(true);
      setQuizFeedback("Correct! The double refusal discipline demands that we reject both the hagiographical claim of absolute predictive infallibility and the dismissive scoffing at KP's empirical tracking. We recognize KP as a comparative methodology-precision claim that requires meticulous birth-time rectification to function properly.");
    } else if (optionId === "opt_a") {
      setQuizIsCorrect(false);
      setQuizFeedback("Incorrect. Claiming absolute infallibility violates the honest-evaluation posture. KP is highly sensitive to coordinates and birth time, and predicting events with absolute certainty ignores empirical reality.");
    } else if (optionId === "opt_b") {
      setQuizIsCorrect(false);
      setQuizFeedback("Incorrect. Cynical dismissal of KP ignores its multi-decade, systematic commentarial tradition and its rigorous astronomical structure (Placidus house divisions, momental Ruling Planets). We must evaluate its empirical tracking neutrally.");
    } else {
      setQuizIsCorrect(false);
      setQuizFeedback("Incorrect. While Parāśarī whole-sign houses are classical, rejecting Placidus divisions entirely does not represent the balanced double refusal posture.");
    }
  };

  const handleQuizReset = () => {
    setQuizSelectedOption(null);
    setQuizFeedback(null);
    setQuizIsCorrect(null);
  };

  return (
    <div style={{
      padding: "20px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.80)",
      backdropFilter: "blur(14px)",
      border: `1px solid ${STEEL_BORDER}`,
      fontFamily: "'Inter', sans-serif",
      color: INK_PRIMARY,
      maxWidth: "980px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "18px"
    }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        
        .kpc-nav-btn {
          border: none; background: transparent; cursor: pointer; padding: 8px 16px;
          border-radius: 8px; font-size: 11.5px; font-weight: 700; color: ${INK_MUTED};
          transition: all 0.2s ease;
        }
        .kpc-nav-btn:hover { color: ${STEEL_BLUE}; background: rgba(54, 92, 122, 0.04); }
        .kpc-nav-btn.active { background: rgba(54, 92, 122, 0.08); color: ${STEEL_BLUE}; }

        .eval-toggle-btn {
          border: 1px solid ${STEEL_BORDER}; background: #ffffff; cursor: pointer;
          padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: 700;
          color: ${INK_SECONDARY}; transition: all 0.2s ease; flex: 1; text-align: center;
        }
        .eval-toggle-btn.active-strength { border-color: #4e7037; background: rgba(78, 112, 55, 0.05); color: #4e7037; }
        .eval-toggle-btn.active-limit { border-color: #ad4b37; background: rgba(173, 75, 55, 0.04); color: #ad4b37; }

        .zodiac-bar-container {
          height: 20px; background: #e0dcd3; border-radius: 4px; overflow: hidden;
          position: relative; margin: 8px 0; border: 1px solid rgba(0,0,0,0.08);
        }
        .sub-block {
          height: 100%; float: left; transition: opacity 0.2s ease;
        }
        .sub-block.active {
          box-shadow: inset 0 0 0 2px ${STEEL_DEEP}; opacity: 1;
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ borderBottom: "1px solid rgba(54, 92, 122, 0.12)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: STEEL_DEEP, display: "flex", alignItems: "center", gap: "8px" }}>
            <Zap size={18} />
            KP Precision Resolution Comparator
          </h3>
          <span style={{ fontSize: "11px", fontWeight: 700, color: STEEL_BLUE, fontStyle: "italic" }}>
            भाव-सन्धि-उप-स्वामी
          </span>
        </div>
        <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: INK_SECONDARY, lineHeight: "1.45" }}>
          Compare the resolving power of Parāśarī whole-sign divisions vs. nakṣatras and KP sub-divisions across Aries (0° to 30°).
        </p>
      </div>

      {/* ── NAV SWITCHER ── */}
      <div style={{ display: "flex", gap: "4px", background: "rgba(54, 92, 122, 0.03)", borderRadius: "10px", padding: "3px" }}>
        <button onClick={() => setActiveTab("slider")} className={`kpc-nav-btn ${activeTab === "slider" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Compass size={13} /> Resolution Slider</span>
        </button>
        <button onClick={() => setActiveTab("evaluation")} className={`kpc-nav-btn ${activeTab === "evaluation" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><AlertOctagon size={13} /> Honest Evaluation</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 1: RESOLUTION SLIDER                                */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "slider" && (
        <>
          <div style={{ display: "grid", gap: "20px" }} className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] items-start">
          
          {/* LEFT COLUMN: Circular SVG Triple-Tier Dial */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            background: "#ffffff",
            padding: "18px",
            borderRadius: "12px",
            border: `1px solid ${STEEL_BORDER}`,
            boxShadow: "0 4px 20px -6px rgba(54, 92, 122, 0.08)"
          }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: STEEL_DEEP, letterSpacing: "0.5px" }}>
              Triple-Tier Resolving Dial (Interactive)
            </span>
            <div style={{ position: "relative", width: "100%", maxWidth: "320px", aspectRatio: "1/1", margin: "0 auto" }}>
              <svg 
                width="100%" 
                height="100%" 
                viewBox="-180 -180 360 360" 
                style={{ overflow: "visible", cursor: "pointer", userSelect: "none" }}
                onClick={handleSvgClick}
                onMouseMove={(e) => {
                  if (e.buttons === 1) { // Left-click dragged
                    handleSvgClick(e);
                  }
                }}
              >
                {/* Dial Center Info */}
                <circle cx="0" cy="0" r="45" fill="#fcfbf7" stroke={STEEL_BLUE} strokeWidth="1.5" />
                <text textAnchor="middle" dy="-8" fontSize="9" fontWeight="700" fill={INK_MUTED}>CUSP DEGREE</text>
                <text textAnchor="middle" dy="10" fontSize="14" fontWeight="850" fill={STEEL_DEEP}>{deg}°{min}′</text>
                <text textAnchor="middle" dy="24" fontSize="9" fontWeight="800" fill={STEEL_BLUE}>{currentSub.lord} Sub</text>

                {/* Outer Ring: Whole-Sign Aries (Mars-ruled) */}
                <path 
                  d={describeArc(0, 0, 142, 162, 0, 360)} 
                  fill="rgba(54, 92, 122, 0.04)" 
                  stroke={STEEL_BLUE} 
                  strokeWidth="1.2" 
                />
                <text textAnchor="middle" transform="rotate(0) translate(0, -149)" fontSize="8.5" fontWeight="800" fill={STEEL_DEEP} letterSpacing="1px">ARIES (Mars)</text>

                {/* Middle Ring: Nakshatras */}
                {/* Ashvini (0° to 13°20') = 0 to 160 degrees */}
                <path 
                  d={describeArc(0, 0, 115, 138, 0.5, 159.5)} 
                  fill={currentNak.name === "Aśvinī" ? "rgba(54, 92, 122, 0.15)" : "#FFF"} 
                  stroke={currentNak.name === "Aśvinī" ? STEEL_BLUE : "rgba(0,0,0,0.12)"} 
                  strokeWidth="1.5" 
                />
                {/* Bharani (13°20' to 26°40') = 160 to 320 degrees */}
                <path 
                  d={describeArc(0, 0, 115, 138, 160.5, 319.5)} 
                  fill={currentNak.name === "Bharaṇī" ? "rgba(54, 92, 122, 0.15)" : "#FFF"} 
                  stroke={currentNak.name === "Bharaṇī" ? STEEL_BLUE : "rgba(0,0,0,0.12)"} 
                  strokeWidth="1.5" 
                />
                {/* Krittika (26°40' to 30°) = 320 to 360 degrees */}
                <path 
                  d={describeArc(0, 0, 115, 138, 320.5, 359.5)} 
                  fill={currentNak.name.includes("Kṛttikā") ? "rgba(54, 92, 122, 0.15)" : "#FFF"} 
                  stroke={currentNak.name.includes("Kṛttikā") ? STEEL_BLUE : "rgba(0,0,0,0.12)"} 
                  strokeWidth="1.5" 
                />
                
                {/* Labels for Nakshatras */}
                <text textAnchor="middle" transform="rotate(80) translate(0, -123) rotate(-80)" fontSize="9" fontWeight="700" fill={INK_SECONDARY}>Aśvinī (Ketu)</text>
                <text textAnchor="middle" transform="rotate(240) translate(0, -123) rotate(-240)" fontSize="9" fontWeight="700" fill={INK_SECONDARY}>Bharaṇī (Venus)</text>
                <text textAnchor="middle" transform="rotate(340) translate(0, -123) rotate(-340)" fontSize="9" fontWeight="700" fill={INK_SECONDARY}>Kṛttikā (Sun)</text>

                {/* Inner Ring: Sub-lords (Render all subdivisions dynamically from active Nakshatra) */}
                {fullSubdivisions.map((sub, i) => {
                  const startAngle = (sub.startMin / 1800) * 360;
                  const endAngle = (sub.endMin / 1800) * 360;
                  const isActive = totalMin >= sub.startMin && totalMin <= sub.endMin;
                  
                  const subFill = isActive ? STEEL_BLUE : "rgba(54, 92, 122, 0.05)";
                  const subStroke = isActive ? STEEL_DEEP : "rgba(0, 0, 0, 0.08)";
                  
                  return (
                    <g key={i}>
                      <path 
                        d={describeArc(0, 0, 85, 110, startAngle + 0.3, endAngle - 0.3)} 
                        fill={subFill} 
                        stroke={subStroke} 
                        strokeWidth={isActive ? 2 : 0.8} 
                      />
                    </g>
                  );
                })}

                {/* Pointer Line */}
                {(() => {
                  const pointerAngleDeg = (totalMin / 1800) * 360;
                  const pointerRad = ((pointerAngleDeg - 90) * Math.PI) / 180;
                  const targetX = Math.cos(pointerRad) * 165;
                  const targetY = Math.sin(pointerRad) * 165;
                  
                  return (
                    <g>
                      <line 
                        x1="0" 
                        y1="0" 
                        x2={targetX} 
                        y2={targetY} 
                        stroke={boundaryDetails.isClose ? RED : "#dca134"} 
                        strokeWidth={boundaryDetails.isClose ? 3 : 2} 
                        strokeDasharray={boundaryDetails.isClose ? "none" : "3 1"} 
                      />
                      <circle cx={targetX} cy={targetY} r="5" fill={boundaryDetails.isClose ? RED : "#dca134"} stroke="#FFF" strokeWidth="1.5" />
                    </g>
                  );
                })()}
              </svg>
            </div>
            <span style={{ fontSize: "11px", color: INK_MUTED, fontStyle: "italic", textAlign: "center" }}>
              Click or drag on dial rings to rotate needle
            </span>
          </div>

          {/* RIGHT COLUMN: Scrubber Controls & Active Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* Cusp Degree Slider */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
                  1. Fine Coordinate Scrubber
                </span>
                <span style={{ fontSize: "15px", fontWeight: 850, color: STEEL_BLUE }}>
                  {deg}° {min}′
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1800"
                step="1"
                value={totalMin}
                onChange={(e) => setTotalMin(parseInt(e.target.value))}
                style={{ cursor: "pointer", accentColor: STEEL_BLUE, width: "100%" }}
              />
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button 
                  onClick={() => setTotalMin(prev => Math.max(0, prev - 10))}
                  style={{
                    background: "white", border: `1px solid ${STEEL_BORDER}`, borderRadius: "4px",
                    fontSize: "10.5px", padding: "4px 8px", cursor: "pointer", color: INK_SECONDARY
                  }}
                >
                  -10′
                </button>
                <button 
                  onClick={() => setTotalMin(prev => Math.max(0, prev - 1))}
                  style={{
                    background: "white", border: `1px solid ${STEEL_BORDER}`, borderRadius: "4px",
                    fontSize: "10.5px", padding: "4px 8px", cursor: "pointer", color: INK_SECONDARY
                  }}
                >
                  -1′
                </button>
                <button 
                  onClick={() => setTotalMin(prev => Math.min(1800, prev + 1))}
                  style={{
                    background: "white", border: `1px solid ${STEEL_BORDER}`, borderRadius: "4px",
                    fontSize: "10.5px", padding: "4px 8px", cursor: "pointer", color: INK_SECONDARY
                  }}
                >
                  +1′
                </button>
                <button 
                  onClick={() => setTotalMin(prev => Math.min(1800, prev + 10))}
                  style={{
                    background: "white", border: `1px solid ${STEEL_BORDER}`, borderRadius: "4px",
                    fontSize: "10.5px", padding: "4px 8px", cursor: "pointer", color: INK_SECONDARY
                  }}
                >
                  +10′
                </button>
              </div>
            </div>

            {/* Active Lords Display Panel */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
              <div style={{ background: "#ffffff", border: "1px solid rgba(54,92,122,0.12)", padding: "10px 12px", borderRadius: "8px" }}>
                <span style={{ fontSize: "9px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>Sign (Parāśarī)</span>
                <div style={{ fontSize: "13px", fontWeight: 800, color: STEEL_DEEP, marginTop: "2px" }}>Aries (Meṣa)</div>
                <div style={{ fontSize: "11px", color: STEEL_BLUE, fontWeight: 700 }}>Mars-ruled</div>
              </div>

              <div style={{ background: "#ffffff", border: "1px solid rgba(54,92,122,0.12)", padding: "10px 12px", borderRadius: "8px" }}>
                <span style={{ fontSize: "9px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>Nakṣatra</span>
                <div style={{ fontSize: "13px", fontWeight: 800, color: STEEL_DEEP, marginTop: "2px" }}>{currentNak.name}</div>
                <div style={{ fontSize: "11px", color: STEEL_BLUE, fontWeight: 700 }}>{currentNak.lord}-ruled</div>
              </div>

              <div style={{ background: "#ffffff", border: `1.5px solid ${STEEL_BLUE}`, padding: "10px 12px", borderRadius: "8px" }}>
                <span style={{ fontSize: "9px", fontWeight: 850, color: STEEL_BLUE, textTransform: "uppercase" }}>KP Sub-Lord</span>
                <div style={{ fontSize: "13px", fontWeight: 850, color: STEEL_DEEP, marginTop: "2px" }}>{currentSub.lord} Sub</div>
                <div style={{ fontSize: "11px", color: STEEL_BLUE, fontWeight: 800 }}>Confirming Lord</div>
              </div>
            </div>

            {/* Proportional Nakshatra Map visualizer */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>
                <span>Nakṣatra subdivision view ({currentNak.name})</span>
                <span>Total Arc: 13°20′</span>
              </div>
              
              <div className="zodiac-bar-container">
                {currentNak.subs.map((sub, i) => {
                  const isActive = totalMin >= sub.startMin && totalMin <= sub.endMin;
                  const percentage = (sub.durationMin / 800) * 100;
                  return (
                    <div
                      key={i}
                      className={`sub-block ${isActive ? "active" : ""}`}
                      style={{
                        width: `${percentage}%`,
                        background: sub.color,
                        opacity: isActive ? 1 : 0.45
                      }}
                      title={`Sub-lord: ${sub.lord}`}
                    />
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED }}>
                <span>Start: {currentNak.name === "Aśvinī" ? "0°00′" : currentNak.name === "Bharaṇī" ? "13°20′" : "26°40′"}</span>
                <span>Active Sub: <strong>{currentSub.lord}</strong> ({formatArcToDegMin(currentSub.duration)})</span>
                <span>End: {currentNak.name === "Aśvinī" ? "13°20′" : currentNak.name === "Bharaṇī" ? "26°40′" : "30°00′"}</span>
              </div>
            </div>

          </div>
        </div>

          {/* Toggle Math Details Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setShowMath(!showMath)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                border: `1px solid ${STEEL_BORDER}`,
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: 700,
                color: STEEL_BLUE,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(54, 92, 122, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Activity size={13} />
              {showMath ? "Hide Vimśottarī Math" : "Show Vimśottarī Math & Proportions"}
            </button>
          </div>

          {/* Math details card/table */}
          {showMath && (
            <div style={{
              background: "#ffffff",
              border: `1px solid ${STEEL_BORDER}`,
              borderRadius: "12px",
              padding: "12px",
              marginTop: "4px",
              animation: "slideIn 0.25s ease"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <strong style={{ fontSize: "12px", color: STEEL_DEEP }}>
                  Vimśottarī Subdivision Math ({currentNak.name})
                </strong>
                <span style={{ fontSize: "10px", color: INK_MUTED }}>
                  Nakṣatra total span: 13°20′ (800′)
                </span>
              </div>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${STEEL_BORDER}`, color: STEEL_BLUE }}>
                      <th style={{ padding: "6px 4px", fontWeight: 700 }}>Sub-Lord</th>
                      <th style={{ padding: "6px 4px", fontWeight: 700 }}>Vimśottarī Years</th>
                      <th style={{ padding: "6px 4px", fontWeight: 700 }}>Proportional Arc Formula</th>
                      <th style={{ padding: "6px 4px", fontWeight: 700 }}>Theoretical Arc Span</th>
                      <th style={{ padding: "6px 4px", fontWeight: 700 }}>Zodiac Range (Aries/Taurus)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullSubdivisions.map((sub, idx) => {
                      const isActive = totalMin >= sub.startMin && totalMin <= sub.endMin;
                      const isTruncated = sub.startMin < 1800 && sub.endMin > 1800;
                      const isOutside = sub.startMin >= 1800;
                      
                      let rangeStr = "";
                      if (isOutside) {
                        rangeStr = `Taurus (${formatArcToZodiac(sub.startMin).replace("Taurus ", "")} - ${formatArcToZodiac(sub.endMin).replace("Taurus ", "")})`;
                      } else if (isTruncated) {
                        rangeStr = `${formatArcToZodiac(sub.startMin).replace("Aries ", "")} to 30°00.0′ (Truncated)`;
                      } else {
                        rangeStr = `${formatArcToZodiac(sub.startMin).replace("Aries ", "")} to ${formatArcToZodiac(sub.endMin).replace("Aries ", "")}`;
                      }
                      
                      return (
                        <tr 
                          key={idx} 
                          style={{
                            borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                            background: isActive ? "rgba(54, 92, 122, 0.07)" : "transparent",
                            fontWeight: isActive ? 700 : 400,
                            color: isActive ? STEEL_DEEP : INK_SECONDARY,
                            transition: "background 0.2s ease"
                          }}
                        >
                          <td style={{ padding: "6px 4px", display: "flex", alignItems: "center", gap: "4px" }}>
                            {sub.lord}
                            {isActive && (
                              <span style={{
                                fontSize: "8px", background: STEEL_BLUE, color: "white", padding: "1px 4px", borderRadius: "4px", textTransform: "uppercase", fontWeight: 800
                              }}>
                                Active
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "6px 4px" }}>{sub.years}y</td>
                          <td style={{ padding: "6px 4px" }}>({sub.years} / 120) × 800′</td>
                          <td style={{ padding: "6px 4px" }}>
                            {formatArcToDegMin(sub.duration)} ({(sub.duration).toFixed(2)}′)
                          </td>
                          <td style={{ padding: "6px 4px", fontStyle: isOutside || isTruncated ? "italic" : "normal" }}>
                            {rangeStr}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {currentNak.name.includes("Kṛttikā") && (
                <div style={{ marginTop: "8px", fontSize: "10px", color: RED, display: "flex", gap: "4px", alignItems: "center" }}>
                  <Info size={12} />
                  <span>
                    Note: Kṛttikā’s first quarter ends at 30°00′ Meṣa (Aries). The remaining 5 subdivisions and part of Rāhu fall into Vṛṣabha (Taurus).
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Boundary warning callout */}
          {boundaryDetails.isClose && (
            <div style={{
              padding: "10px 12px", borderRadius: "8px", background: "rgba(173, 75, 55, 0.05)",
              border: `1.5px solid ${RED}`, display: "flex", gap: "8px", alignItems: "flex-start",
              animation: "slideIn 0.2s ease"
            }}>
              <AlertCircle size={15} style={{ color: RED, flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ fontSize: "11px", color: RED, textTransform: "uppercase" }}>Boundary Sensitivity Alert (§7)</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.45", color: "#762e21" }}>
                  The selected cusp degree is within 3 arc-minutes of a sub-lord boundary. The exact distance to the nearest boundary is <strong>{boundaryDetails.distance.toFixed(2)}′ (arc-minutes)</strong>.
                </p>
                <p style={{ margin: "4px 0 0 0", fontSize: "10.5px", lineHeight: "1.45", color: "#762e21" }}>
                  An error of just <strong>{boundaryDetails.distance.toFixed(2)}′</strong> corresponds to approximately <strong>{(boundaryDetails.distance * 4).toFixed(0)} seconds</strong> of clock time discrepancy in the cusp's movement! A tiny shift would flip the sub-lord, highlighting why KP requires meticulous **birth-time rectification** (Chapter 2).
                </p>
              </div>
            </div>
          )}

        </>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 2: HONEST EVALUATION                                 */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "evaluation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              2. Honestly Evaluating the Precision Claim (§4.5)
            </span>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.45" }}>
              Grahvani requires learners to evaluate KP's predictive-precision claim neutrally, noting both its legitimate strengths and real limitations.
            </p>
          </div>

          {/* Toggle buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setEvalTab("strengths")}
              className={`eval-toggle-btn ${evalTab === "strengths" ? "active-strength" : ""}`}
            >
              Legitimate Strengths
            </button>
            <button
              onClick={() => setEvalTab("limitations")}
              className={`eval-toggle-btn ${evalTab === "limitations" ? "active-limit" : ""}`}
            >
              Real Limitations
            </button>
          </div>

          {/* Details Card */}
          <div style={{
            background: "#ffffff", border: `1.5px solid ${evalTab === "strengths" ? "#4e7037" : "#ad4b37"}`,
            borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px",
            animation: "slideIn 0.25s ease"
          }}>
            {evalTab === "strengths" ? (
              <>
                <strong style={{ fontSize: "12px", color: "#4e7037" }}>Legitimate Empirical Strengths:</strong>
                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li><strong>Fine-Grained resolution:</strong> Spatially 20× finer than whole-sign houses, allowing sharper temporal calculations.</li>
                  <li><strong>~60 Years of tracking:</strong> Supported by a multi-decade, pan-Indian and international commentarial tradition.</li>
                  <li><strong>Methodological rigour:</strong> Integrates Placidus house-cusps and momental-moment Ruling Planets for objective cross-validation.</li>
                </ul>
              </>
            ) : (
              <>
                <strong style={{ fontSize: "12px", color: "#ad4b37" }}>Acknowledged Epistemic Limitations:</strong>
                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li><strong>Selection-Bias:</strong> Favourable predictions are often documented more than incorrect ones in lineage lore.</li>
                  <li><strong>Interpretive Judgments:</strong> Astrological timing claims involve subjective evaluations of event occurrences.</li>
                  <li><strong>No Controlled Clinical Validation:</strong> The stream has not been tested via modern double-blind research standards.</li>
                  <li><strong>Sensitivity:</strong> As shown on the slider, boundary degrees are fragile and depend heavily on time rectification.</li>
                </ul>
              </>
            )}
          </div>

          {/* Double refusal reminder */}
          <div style={{
            background: "rgba(173, 75, 55, 0.05)", border: "1.5px solid rgba(173, 75, 55, 0.25)",
            borderRadius: "12px", padding: "12px", display: "flex", gap: "8px", alignItems: "flex-start"
          }}>
            <AlertOctagon size={16} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#ad4b37", textTransform: "uppercase" }}>
                Double Refusal Discipline (Lesson 19.5.2)
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "10.5px", lineHeight: "1.45", color: "#762e21" }}>
                Refuse over-promising absolute precision (verdict infallibility) AND refuse scoffing at KP's empirical tracking. KP's claim is a comparative <strong>methodology-precision</strong> claim, not a license to guarantee deterministic client outcomes.
              </p>
            </div>
          </div>

          {/* Double Refusal Quiz */}
          <div style={{
            background: "rgba(54, 92, 122, 0.03)",
            border: `1px solid ${STEEL_BORDER}`,
            borderRadius: "12px",
            padding: "16px",
            marginTop: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={16} style={{ color: STEEL_BLUE }} />
              <strong style={{ fontSize: "12px", color: STEEL_DEEP }}>
                Drill: Double Refusal Self-Check
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.45" }}>
              To master the honest evaluation of KP's precision claim, which of the following represents the correct balanced stance?
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              {[
                {
                  id: "opt_a",
                  label: "A",
                  text: "Accept KP as an infallible system that predicts exact events down to the second, dismissing any claim of error."
                },
                {
                  id: "opt_b",
                  label: "B",
                  text: "Reject KP completely as unscientific, ignoring its multi-decade empirical tracking and consistency checks."
                },
                {
                  id: "opt_c",
                  label: "C",
                  text: "Refuse both the over-promising of absolute predictive infallibility AND the dismissive scoffing of KP's empirical tracking, understanding it as a comparative methodology-precision claim."
                },
                {
                  id: "opt_d",
                  label: "D",
                  text: "Only practice Parāśarī whole-sign astrology because sub-lord boundaries are too sensitive to rectify."
                }
              ].map((opt) => {
                const isSelected = quizSelectedOption === opt.id;
                const optColor = isSelected 
                  ? (quizIsCorrect ? "#4e7037" : "#ad4b37")
                  : STEEL_BLUE;
                const optBg = isSelected
                  ? (quizIsCorrect ? "rgba(78, 112, 55, 0.06)" : "rgba(173, 75, 55, 0.04)")
                  : "#ffffff";
                const optBorder = isSelected
                  ? `1.5px solid ${optColor}`
                  : `1px solid ${STEEL_BORDER}`;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleQuizSubmit(opt.id)}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      textAlign: "left",
                      background: optBg,
                      border: optBorder,
                      borderRadius: "8px",
                      padding: "10px 12px",
                      cursor: "pointer",
                      fontSize: "11px",
                      color: isSelected ? optColor : INK_PRIMARY,
                      transition: "all 0.2s ease",
                      width: "100%"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "rgba(54, 92, 122, 0.04)";
                        e.currentTarget.style.borderColor = STEEL_BLUE;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "#ffffff";
                        e.currentTarget.style.borderColor = STEEL_BORDER;
                      }
                    }}
                  >
                    <span style={{
                      fontWeight: 800,
                      background: isSelected ? optColor : "rgba(54, 92, 122, 0.08)",
                      color: isSelected ? "#ffffff" : STEEL_BLUE,
                      borderRadius: "4px",
                      padding: "2px 6px",
                      fontSize: "10px",
                      flexShrink: 0
                    }}>
                      {opt.label}
                    </span>
                    <span style={{ lineHeight: "1.4" }}>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {quizFeedback && (
              <div style={{
                marginTop: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                background: quizIsCorrect ? "rgba(78, 112, 55, 0.05)" : "rgba(173, 75, 55, 0.05)",
                border: `1.5px solid ${quizIsCorrect ? "#4e7037" : "#ad4b37"}`,
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
                animation: "slideIn 0.2s ease"
              }}>
                {quizIsCorrect ? (
                  <ShieldCheck size={16} style={{ color: "#4e7037", flexShrink: 0, marginTop: "2px" }} />
                ) : (
                  <AlertCircle size={16} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: quizIsCorrect ? "#4e7037" : "#ad4b37", textTransform: "uppercase" }}>
                    {quizIsCorrect ? "Stance Mastered!" : "Stance Needs Calibration"}
                  </span>
                  <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.45", color: quizIsCorrect ? "#354e25" : "#762e21" }}>
                    {quizFeedback}
                  </p>
                  {!quizIsCorrect && (
                    <button
                      onClick={handleQuizReset}
                      style={{
                        alignSelf: "flex-start",
                        marginTop: "6px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#ad4b37",
                        fontSize: "10.5px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: 0
                      }}
                    >
                      <RotateCcw size={12} /> Try Again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: `1px solid ${STEEL_BORDER}`,
        paddingTop: "8px",
        fontSize: "10px",
        color: INK_MUTED
      }}>
        <span>Module 16 · Chapter 1 · Lesson 3</span>
        <span>KP Precision Resolution Comparator</span>
      </div>
    </div>
  );
}

