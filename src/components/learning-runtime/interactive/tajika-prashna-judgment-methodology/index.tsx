"use client";

import { useState } from "react";
import { Info, HelpCircle, Layers, CheckCircle2, ShieldAlert, Compass, Star, ChevronLeft, ChevronRight } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

const RASHI_NAMES = [
  "Aries (Meṣa)",
  "Taurus (Vṛṣabha)",
  "Gemini (Mithuna)",
  "Cancer (Karka)",
  "Leo (Siṁha)",
  "Virgo (Kanyā)",
  "Libra (Tulā)",
  "Scorpio (Vṛścika)",
  "Sagittarius (Dhanu)",
  "Capricorn (Makara)",
  "Aquarius (Kumbha)",
  "Pisces (Mīna)"
];

const HOUSE_PATHS = {
  1: "M 100,0 L 50,50 L 100,100 L 150,50 Z",
  2: "M 0,0 L 100,0 L 50,50 Z",
  3: "M 0,0 L 0,100 L 50,50 Z",
  4: "M 0,100 L 50,50 L 100,100 L 50,150 Z",
  5: "M 0,200 L 0,100 L 50,150 Z",
  6: "M 0,200 L 100,200 L 50,150 Z",
  7: "M 100,200 L 50,150 L 100,100 L 150,150 Z",
  8: "M 200,200 L 100,200 L 150,150 Z",
  9: "M 200,200 L 200,100 L 150,150 Z",
  10: "M 200,100 L 150,50 L 100,100 L 150,150 Z",
  11: "M 200,0 L 200,100 L 150,50 Z",
  12: "M 200,0 L 100,0 L 150,50 Z"
};

const HOUSE_LABEL_POS = {
  1: { x: 100, y: 45 },
  2: { x: 50, y: 22 },
  3: { x: 22, y: 50 },
  4: { x: 45, y: 100 },
  5: { x: 22, y: 150 },
  6: { x: 50, y: 178 },
  7: { x: 100, y: 155 },
  8: { x: 150, y: 178 },
  9: { x: 178, y: 150 },
  10: { x: 155, y: 100 },
  11: { x: 178, y: 50 },
  12: { x: 150, y: 22 }
};

interface DojoOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

const DOJO_QUESTION = {
  query: "The Tājika praśna chart shows a separating aspect (no-trend) for my career opportunity, and my Vivāha/Kārya Saham is afflicted. Is it a 100% guarantee that my interview tomorrow is doomed to fail?",
  options: [
    {
      text: "Yes, separating aspects are a final curse. The chart never lies, so you should prepare for rejection.",
      isCorrect: false,
      feedback: "Incorrect. Under the M19 stream-mastery counseling guidelines, we never deliver fatalistic, deterministic outcomes."
    },
    {
      text: "No. The separating aspect shows a trend of fading momentum in current conditions. It is a trend indicator, not a fatalistic decree. Use this information to redouble your preparation, try a new approach, or apply elsewhere, understanding that praśna measures trends rather than certainties.",
      isCorrect: true,
      feedback: "Correct! Reframes the separating aspect responsibly as a trend indicator of current conditions, encouraging positive agency and preparation."
    },
    {
      text: "You can reverse it if you wear the correct gemstone for the year lord before the interview.",
      isCorrect: false,
      feedback: "Incorrect. This treats remedies as deterministic override buttons, violating the counseling integrity standards of the curriculum."
    }
  ] as DojoOption[]
};

export function TajikaPrashnaJudgmentMethodology() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [lagnaSign, setLagnaSign] = useState<number>(1);
  const [quesitedHouse, setQuesitedHouse] = useState<number>(7);
  const [fasterDeg, setFasterDeg] = useState<number>(8); // Moon degree
  const [slowerDeg, setSlowerDeg] = useState<number>(14); // Mars degree
  const [sahamWellPlaced, setSahamWellPlaced] = useState<boolean>(true);
  const [selectedDojo, setSelectedDojo] = useState<number | null>(null);
  const [dojoFeedback, setDojoFeedback] = useState<string>("");

  const getRashiForHouse = (houseNum: number) => {
    return (lagnaSign + houseNum - 2) % 12 + 1;
  };

  const getSahamHouse = () => {
    if (quesitedHouse === 7) return 8; // Vivāha Saham in 8H
    if (quesitedHouse === 10) return 11; // Kārya Saham in 11H
    return 10; // Pārāva Saham in 10H
  };

  // Auto-resolve aspect based on degrees
  const getAspectType = () => {
    if (fasterDeg < slowerDeg) return "applying";
    if (fasterDeg > slowerDeg) return "separating";
    return "exact";
  };

  const aspectType = getAspectType();

  const getVerdict = () => {
    if (aspectType === "separating") {
      return {
        trend: "Fading Momentum (No-trending)",
        color: AMBER,
        details: "The faster significator has passed the slower significator (Īsarpha). The trend shows waning momentum under current conditions."
      };
    }
    if (aspectType === "exact") {
      return {
        trend: "Critical Focus (Exact Aspect)",
        color: GOLD_DEEP,
        details: "The aspect is exact. Momentum is at a structural peak right now; immediate developments are forming."
      };
    }
    // Applying
    if (sahamWellPlaced) {
      return {
        trend: "Strong Favourable Trend (Yes-trending)",
        color: GREEN,
        details: "Applying aspect (Ithaśāla) reinforced by a well-placed Saham indicates a strong likelihood of fructification. The matter is actively forming."
      };
    } else {
      return {
        trend: "Qualified Trend (Yes with delay/conditions)",
        color: GOLD_DEEP,
        details: "Applying aspect shows positive momentum, but the afflicted Saham indicates constraints, delays, or obstacles that require active resolution."
      };
    }
  };

  const verdict = getVerdict();

  const handleDojoClick = (idx: number, opt: DojoOption) => {
    setSelectedDojo(idx);
    setDojoFeedback(opt.feedback);
  };

  const handleChartHouseClick = (houseNum: number) => {
    if (activeStep === 2) {
      setQuesitedHouse(houseNum);
    }
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.7)",
        border: "1px solid rgba(156, 122, 47, 0.2)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="tajika-prashna-judgment-methodology"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes aspect-flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -20; }
        }
        .applying-aspect-flow {
          animation: aspect-flow 1.5s linear infinite;
        }
        .house-clickable {
          cursor: pointer;
        }
        .house-clickable:hover {
          fill: rgba(156, 122, 47, 0.08) !important;
        }
      ` }} />

      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 5 — Lesson 2
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Tājika Praśna Judgment Methodology
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Walk through the 4-step sequence to judge a horary chart and resolve questions. Click directly on the chart to select houses and toggle Saham states.
        </p>
      </div>

      {/* Wizard Steps Indicator */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", background: "#ffffff", padding: "10px 16px", borderRadius: "10px", border: "1px solid rgba(156, 122, 47, 0.12)" }}>
        {[
          { step: 1, label: "Lagna Setup" },
          { step: 2, label: "Quesited House" },
          { step: 3, label: "Aspect Resolution" },
          { step: 4, label: "Saham Confirmation" }
        ].map((s) => {
          const isActive = activeStep === s.step;
          const isDone = activeStep > s.step;

          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                flex: 1,
                opacity: isActive ? 1 : 0.6
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: isDone ? GREEN : isActive ? GOLD : INK_MUTED,
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {s.step}
              </div>
              <span style={{ fontSize: "11px", fontWeight: isActive ? 700 : 500, color: isActive ? GOLD_DEEP : INK_SECONDARY }}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Workspace Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left Side: Diamond Chart Display */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.16)",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 4px 16px rgba(156, 122, 47, 0.03)"
          }}
        >
          <svg width="220" height="220" viewBox="0 0 200 200" style={{ overflow: "visible" }}>
            <rect x="0" y="0" width="200" height="200" fill="none" stroke="rgba(156, 122, 47, 0.3)" strokeWidth="1.5" rx="4" />
            {(Object.keys(HOUSE_PATHS) as Array<unknown> as number[]).map((h) => {
              const pathStr = HOUSE_PATHS[h as keyof typeof HOUSE_PATHS];
              const pos = HOUSE_LABEL_POS[h as keyof typeof HOUSE_LABEL_POS];
              const sign = getRashiForHouse(h);
              const isLagna = h === 1;
              const isQuesited = h === quesitedHouse;
              const isSaham = h === getSahamHouse();

              let fillColor = "none";
              let strokeColor = "rgba(156, 122, 47, 0.2)";
              let strokeWidth = "1";

              if (isLagna) {
                fillColor = "rgba(47, 125, 85, 0.04)";
                strokeColor = GREEN;
                strokeWidth = "1.5";
              } else if (isQuesited) {
                fillColor = "rgba(156, 122, 47, 0.06)";
                strokeColor = GOLD;
                strokeWidth = "1.8";
              } else if (isSaham && activeStep >= 4) {
                fillColor = sahamWellPlaced ? "rgba(47, 125, 85, 0.04)" : "rgba(162, 58, 30, 0.04)";
                strokeColor = sahamWellPlaced ? GREEN : RED;
                strokeWidth = "1.5";
              }

              return (
                <g key={h}>
                  <path
                    d={pathStr}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    className={activeStep === 2 && !isLagna ? "house-clickable" : ""}
                    onClick={() => handleChartHouseClick(h)}
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 7}
                    fill={INK_MUTED}
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    pointerEvents="none"
                  >
                    {sign}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 6}
                    fill={isLagna ? GREEN : isQuesited ? GOLD_DEEP : isSaham && activeStep >= 4 ? (sahamWellPlaced ? GREEN : RED) : "rgba(77, 65, 51, 0.3)"}
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    pointerEvents="none"
                  >
                    {isLagna ? `Lg (${fasterDeg}°)` : isQuesited ? `Qs (${slowerDeg}°)` : isSaham && activeStep >= 4 ? "SAHAM" : `H${h}`}
                  </text>
                </g>
              );
            })}

            {/* Clickable Saham Star Marker */}
            {activeStep >= 4 && (
              <g
                cursor="pointer"
                onClick={() => setSahamWellPlaced(p => !p)}
                style={{ transform: "translate(-5px, -5px)" }}
              >
                <circle
                  cx={HOUSE_LABEL_POS[getSahamHouse() as keyof typeof HOUSE_LABEL_POS].x}
                  cy={HOUSE_LABEL_POS[getSahamHouse() as keyof typeof HOUSE_LABEL_POS].y - 18}
                  r="7"
                  fill={sahamWellPlaced ? GREEN : RED}
                  opacity="0.2"
                />
                <Star
                  size={10}
                  x={HOUSE_LABEL_POS[getSahamHouse() as keyof typeof HOUSE_LABEL_POS].x - 5}
                  y={HOUSE_LABEL_POS[getSahamHouse() as keyof typeof HOUSE_LABEL_POS].y - 23}
                  color={sahamWellPlaced ? GREEN : RED}
                  fill={sahamWellPlaced ? GREEN : "none"}
                />
              </g>
            )}

            {/* Dynamic Aspect Connection Line */}
            {activeStep >= 3 && (
              <g>
                <path
                  d={
                    quesitedHouse === 7
                      ? "M 100,65 L 100,135"
                      : quesitedHouse === 9
                      ? "M 115,55 L 160,115"
                      : "M 115,55 L 145,75"
                  }
                  fill="none"
                  stroke={aspectType === "applying" ? GREEN : aspectType === "exact" ? GOLD : RED}
                  strokeWidth="2.5"
                  strokeDasharray={aspectType === "applying" ? "none" : aspectType === "exact" ? "none" : "4 3"}
                  className={aspectType === "applying" ? "applying-aspect-flow" : ""}
                />
                <text
                  x={quesitedHouse === 7 ? 100 : quesitedHouse === 9 ? 148 : 138}
                  y={quesitedHouse === 7 ? 100 : quesitedHouse === 9 ? 80 : 60}
                  fill={aspectType === "applying" ? GREEN : aspectType === "exact" ? GOLD : RED}
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {aspectType === "applying" ? "Applying" : aspectType === "exact" ? "Exact" : "Separating"}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Right Side: Step-by-Step Settings Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Step 1 Settings */}
          {activeStep === 1 && (
            <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "10px", padding: "18px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                Step 1: Set Querent Lagna Sign
              </span>
              <label style={{ fontSize: "13px", color: INK_SECONDARY, display: "block", marginBottom: "8px" }}>
                Select the ascendant sign for the question-moment chart:
              </label>
              <select
                value={lagnaSign}
                onChange={(e) => setLagnaSign(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(156, 122, 47, 0.25)",
                  background: "#ffffff",
                  color: INK_PRIMARY,
                  fontSize: "14px",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                {RASHI_NAMES.map((name, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {idx + 1} - {name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 2 Settings */}
          {activeStep === 2 && (
            <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "10px", padding: "18px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                Step 2: Choose Quesited House
              </span>
              <label style={{ fontSize: "13px", color: INK_SECONDARY, display: "block", marginBottom: "12px" }}>
                Click directly on the chart houses or select below:
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { house: 7, label: "Marriage / Partnership (7th House)" },
                  { house: 10, label: "Career / Work (10th House)" },
                  { house: 9, label: "Long Travel / Higher Wisdom (9th House)" }
                ].map((item) => (
                  <label key={item.house} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="domain"
                      checked={quesitedHouse === item.house}
                      onChange={() => setQuesitedHouse(item.house)}
                      style={{ accentColor: GOLD }}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 Settings (Aspect degree calculation) */}
          {activeStep === 3 && (
            <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "10px", padding: "18px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                Step 3: Dynamic Aspect Calculation
              </span>
              <label style={{ fontSize: "13px", color: INK_SECONDARY, display: "block", marginBottom: "8px" }}>
                Drag the sliders to see Applying vs. Separating aspect resolution:
              </label>
              
              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span>Faster Planet Degree (Lagna Lord):</span>
                  <strong>{fasterDeg}°</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={fasterDeg}
                  onChange={(e) => setFasterDeg(Number(e.target.value))}
                  style={{ width: "100%", accentColor: GREEN }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span>Slower Planet Degree (Quesited Lord):</span>
                  <strong>{slowerDeg}°</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={slowerDeg}
                  onChange={(e) => setSlowerDeg(Number(e.target.value))}
                  style={{ width: "100%", accentColor: GOLD }}
                />
              </div>

              <div style={{ background: "rgba(156, 122, 47, 0.03)", padding: "10px", borderRadius: "6px", fontSize: "12px", border: "1px solid rgba(156, 122, 47, 0.08)", marginTop: "12px" }}>
                <strong>Arithmetic:</strong> {fasterDeg}° &lt; {slowerDeg}° ?{" "}
                <span style={{ fontWeight: "bold", color: aspectType === "applying" ? GREEN : aspectType === "exact" ? GOLD : RED }}>
                  {aspectType === "applying" ? "Yes ➔ Applying" : aspectType === "exact" ? "Exact Aspect" : "No ➔ Separating"}
                </span>
              </div>
            </div>
          )}

          {/* Step 4 Settings */}
          {activeStep === 4 && (
            <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "10px", padding: "18px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                Step 4: Saham Confirmation
              </span>
              <label style={{ fontSize: "13px", color: INK_SECONDARY, display: "block", marginBottom: "12px" }}>
                Click the star icon on the chart or select the Saham status below:
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setSahamWellPlaced(true)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1.5px solid ${sahamWellPlaced ? GREEN : "rgba(156, 122, 47, 0.15)"}`,
                    background: sahamWellPlaced ? "rgba(47, 125, 85, 0.05)" : "#ffffff",
                    color: sahamWellPlaced ? GREEN : INK_SECONDARY,
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold"
                  }}
                >
                  Well-Placed
                </button>
                <button
                  onClick={() => setSahamWellPlaced(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1.5px solid ${!sahamWellPlaced ? RED : "rgba(156, 122, 47, 0.15)"}`,
                    background: !sahamWellPlaced ? "rgba(162, 58, 30, 0.05)" : "#ffffff",
                    color: !sahamWellPlaced ? RED : INK_SECONDARY,
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold"
                  }}
                >
                  Afflicted
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <button
              onClick={() => setActiveStep(p => Math.max(1, p - 1))}
              disabled={activeStep === 1}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid rgba(156, 122, 47, 0.2)",
                background: "#ffffff",
                cursor: activeStep === 1 ? "not-allowed" : "pointer",
                opacity: activeStep === 1 ? 0.5 : 1,
                fontSize: "13px",
                fontWeight: 600,
                color: GOLD_DEEP
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setActiveStep(p => Math.min(4, p + 1))}
              disabled={activeStep === 4}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1.5px solid " + GOLD,
                background: "rgba(156, 122, 47, 0.05)",
                cursor: activeStep === 4 ? "not-allowed" : "pointer",
                opacity: activeStep === 4 ? 0.5 : 1,
                fontSize: "13px",
                fontWeight: 600,
                color: GOLD_DEEP
              }}
            >
              Next
            </button>
          </div>

          {/* Real-time Verdict Result */}
          {activeStep >= 3 && (
            <div style={{ background: "#ffffff", border: "1.5px solid " + verdict.color, borderRadius: "10px", padding: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: verdict.color, textTransform: "uppercase" }}>
                Resolution Verdict Trend:
              </span>
              <h4 style={{ margin: "6px 0 4px", fontSize: "16px", fontWeight: 700, color: verdict.color }}>
                {verdict.trend}
              </h4>
              <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                {verdict.details}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Counseling Dojo Drill */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "12px",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "0 4px 16px rgba(156, 122, 47, 0.02)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Layers size={18} color={GOLD} />
          <div>
            <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "15px" }}>M19 Counseling Dojo Drill</span>
            <p style={{ fontSize: "12px", color: INK_MUTED, margin: 0 }}>
              Resolve client anxiety responsibly without declaring deterministic doom.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "rgba(156, 122, 47, 0.04)",
            borderLeft: `4px solid ${GOLD}`,
            padding: "12px 14px",
            fontSize: "13.5px",
            lineHeight: "1.5",
            fontStyle: "italic",
            color: INK_SECONDARY,
            borderRadius: "0 8px 8px 0"
          }}
        >
          <strong>Client:</strong> "{DOJO_QUESTION.query}"
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {DOJO_QUESTION.options.map((opt, idx) => {
            const isSelected = selectedDojo === idx;
            const borderCol = isSelected ? (opt.isCorrect ? GREEN : RED) : "rgba(156, 122, 47, 0.15)";
            const bgCol = isSelected ? (opt.isCorrect ? "rgba(47, 125, 85, 0.04)" : "rgba(162, 58, 30, 0.04)") : "#ffffff";

            return (
              <button
                key={idx}
                onClick={() => handleDojoClick(idx, opt)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: bgCol,
                  border: `1px solid ${borderCol}`,
                  cursor: "pointer",
                  fontSize: "13px",
                  color: INK_SECONDARY,
                  lineHeight: "1.5",
                  transition: "all 150ms ease",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.01)"
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: `1.5px solid ${isSelected ? (opt.isCorrect ? GREEN : RED) : INK_MUTED}`,
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: isSelected ? (opt.isCorrect ? GREEN : RED) : INK_MUTED,
                    flexShrink: 0,
                    marginTop: "2px"
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {selectedDojo !== null && (
          <div
            style={{
              background: DOJO_QUESTION.options[selectedDojo].isCorrect ? "rgba(47, 125, 85, 0.08)" : "rgba(162, 58, 30, 0.08)",
              border: `1px solid ${DOJO_QUESTION.options[selectedDojo].isCorrect ? GREEN : RED}`,
              color: DOJO_QUESTION.options[selectedDojo].isCorrect ? GREEN : RED,
              borderRadius: "8px",
              padding: "12px 14px",
              fontSize: "13px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            {DOJO_QUESTION.options[selectedDojo].isCorrect ? (
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            ) : (
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            )}
            <span>{dojoFeedback}</span>
          </div>
        )}
      </div>
    </div>
  );
}
