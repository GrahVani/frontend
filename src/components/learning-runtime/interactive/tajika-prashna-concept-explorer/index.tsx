"use client";

import { useState } from "react";
import { Info, HelpCircle, Layers, CheckCircle2, ShieldAlert, Award, Compass, Clock, RefreshCw, Sun as SunIcon } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

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

type MomentType = "jataka" | "varshaphala" | "prashna";

interface MomentDetails {
  title: string;
  description: string;
  lagnaSign: number;
  rashiLabels: Record<number, number>;
  planetPlacements: Record<number, string>;
  activeTools: string[];
  inactiveTools: string[];
}

const MOMENTS_CONFIG: Record<MomentType, MomentDetails> = {
  jataka: {
    title: "Jātaka (Birth Moment Chart)",
    description: "Cast for the exact moment of birth. Establishes the static blueprint of the native's life potential and governs lifetime Vimśottarī Dasha sequences.",
    lagnaSign: 6,
    rashiLabels: {
      1: 6, 2: 7, 3: 8, 4: 9, 5: 10, 6: 11, 7: 12, 8: 1, 9: 2, 10: 3, 11: 4, 12: 5
    },
    planetPlacements: {
      1: "Lagna",
      5: "Sun",
      10: "Mars"
    },
    activeTools: ["Natal Houses", "Vimśottarī Dashas", "Naisargika Friendship", "Parāśarī Aspects"],
    inactiveTools: ["Munthā Progression", "Varṣeśa (Year Lord)", "Applying Ithaśāla Yogas", "Horary Sahams"]
  },
  varshaphala: {
    title: "Varṣaphala (Solar Return Chart)",
    description: "Cast for the exact moment the transiting Sun returns to its precise natal longitude. Determines the annual progressed Munthā point and Varṣeśa lord.",
    lagnaSign: 2,
    rashiLabels: {
      1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11, 11: 12, 12: 1
    },
    planetPlacements: {
      1: "Lagna",
      4: "Munthā",
      5: "Sun",
      10: "Varṣeśa (Mer)"
    },
    activeTools: ["Progressed Munthā", "Varṣeśa Selection", "16 Tājika Yogas", "Annual Sahams"],
    inactiveTools: ["Lifetime Vimśottarī", "Question-moment Lagna", "Instantaneous Horary Verdict"]
  },
  prashna: {
    title: "Praśna-kāla (Question Moment Chart)",
    description: "Cast for the exact moment and location when a query is formulated. Resolves localized inquiries using applying Ithaśāla yogas and Sahams.",
    lagnaSign: 4,
    rashiLabels: {
      1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 10, 8: 11, 9: 12, 10: 1, 11: 2, 12: 3
    },
    planetPlacements: {
      1: "Lagna (Moon)",
      5: "Mars (10H)",
      10: "Saturn"
    },
    activeTools: ["Question-moment Lagna", "Applying Ithaśāla Yogas", "Quesited House Lords", "Praśna Sahams"],
    inactiveTools: ["Munthā Progression", "Varṣeśa Selection", "Year-Lord cycles", "Lifetime Dashas"]
  }
};

interface DojoOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

const DOJO_QUESTION = {
  query: "I want to know if I will pass my licensing exam tomorrow. Can I just check the Munthā and Varṣeśa lord in my current Varṣaphala annual chart to get this specific answer?",
  options: [
    {
      text: "Yes, because the annual chart covers the entire year, so it includes tomorrow. If your Varṣeśa is strong, you will definitely pass.",
      isCorrect: false,
      feedback: "Incorrect. This mixes up the operational scopes. Varṣaphala governs year-long thematic focus, not localized, immediate hour/day-level questions."
    },
    {
      text: "No, a specific, localized inquiry is best answered by casting a Praśna-kāla chart for the moment the question is asked, or looking at immediate transits. The annual chart is for the yearly thematic overview, not horary questions.",
      isCorrect: true,
      feedback: "Correct! This maintains clear boundary definitions between annual cycles (Varṣaphala) and instantaneous horary moments (Praśna-kāla)."
    },
    {
      text: "You should mix them: check if your Varṣeśa is in applying aspect to your natal Lagna lord in the birth chart.",
      isCorrect: false,
      feedback: "Incorrect. This is cross-stream conflation, mixing annual return points, horary engines, and birth charts in a hybrid way."
    }
  ] as DojoOption[]
};

export function TajikaPrashnaConceptExplorer() {
  const [activeMoment, setActiveMoment] = useState<MomentType>("jataka");
  const [prashnaSunDeg, setPrashnaSunDeg] = useState<number>(240); // User adjustable in horary mode
  const [selectedDojo, setSelectedDojo] = useState<number | null>(null);
  const [dojoFeedback, setDojoFeedback] = useState<string>("");

  const moment = MOMENTS_CONFIG[activeMoment];

  // Coordinates for the alignment dial
  const getCoordinates = (deg: number, radius: number) => {
    const angleRad = (deg * Math.PI) / 180;
    return {
      x: 100 + radius * Math.cos(angleRad),
      y: 100 - radius * Math.sin(angleRad)
    };
  };

  const getSunAngle = () => {
    if (activeMoment === "jataka" || activeMoment === "varshaphala") {
      return 120; // Natal Sun is fixed at 120 (Leo) for illustration
    }
    return prashnaSunDeg; // Variable for question moment
  };

  const sunAngle = getSunAngle();
  const sunPos = getCoordinates(sunAngle, 65);
  const earthPos = { x: 100, y: 100 };
  const natalSunPos = getCoordinates(120, 65); // Marker showing natal position

  const handleDojoClick = (idx: number, opt: DojoOption) => {
    setSelectedDojo(idx);
    setDojoFeedback(opt.feedback);
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
      data-interactive="tajika-prashna-concept-explorer"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-vector {
          0% { stroke-opacity: 0.4; stroke-width: 2px; }
          50% { stroke-opacity: 0.9; stroke-width: 3.5px; }
          100% { stroke-opacity: 0.4; stroke-width: 2px; }
        }
        .applying-aspect-pulse {
          animation: pulse-vector 1.8s infinite ease-in-out;
        }
        @keyframes lock-glow {
          0% { stroke: #2F7D55; stroke-width: 2px; opacity: 0.4; }
          50% { stroke: #D4AF37; stroke-width: 3.5px; opacity: 1; }
          100% { stroke: #2F7D55; stroke-width: 2px; opacity: 0.4; }
        }
        .lock-line-animation {
          animation: lock-glow 2s infinite ease-in-out;
        }
      ` }} />

      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 5 — Lesson 1
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Tājika Praśna Concept Explorer
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Distinguish between birth (Jātaka), solar-return (Varṣaphala), and question-moment (Praśna-kāla) charts using the alignment dial.
        </p>
      </div>

      {/* Moment Switcher Tabs */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid rgba(156, 122, 47, 0.1)", paddingBottom: "4px" }}>
        {(Object.keys(MOMENTS_CONFIG) as MomentType[]).map((type) => {
          const isActive = activeMoment === type;
          let label = "Jātaka (Birth)";
          let Icon = Clock;
          if (type === "varshaphala") {
            label = "Varṣaphala (Annual)";
            Icon = RefreshCw;
          } else if (type === "prashna") {
            label = "Praśna-kāla (Horary)";
            Icon = Compass;
          }

          return (
            <button
              key={type}
              onClick={() => setActiveMoment(type)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1.5px solid " + (isActive ? GOLD : "rgba(156, 122, 47, 0.12)"),
                background: isActive ? "rgba(156, 122, 47, 0.08)" : "#ffffff",
                color: isActive ? GOLD_DEEP : INK_SECONDARY,
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                fontSize: "13.5px",
                transition: "all 200ms ease"
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Main Visual Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left Side: SVGs (Zodiac Alignment Dial + North Indian Chart) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
          
          {/* Dial SVG Drawing */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(156, 122, 47, 0.16)",
              borderRadius: "12px",
              padding: "16px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 16px rgba(156, 122, 47, 0.03)"
            }}
          >
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: GOLD_DEEP, alignSelf: "flex-start" }}>
              Solar Return & Moment Alignment Dial
            </span>
            
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
              {/* Outer Zodiac Circle */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(156, 122, 47, 0.2)" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(156, 122, 47, 0.1)" strokeWidth="1" />
              
              {/* Earth Center */}
              <circle cx={earthPos.x} cy={earthPos.y} r="10" fill={INK_SECONDARY} />
              <text x={earthPos.x} y={earthPos.y} fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle" dominantBaseline="central" style={{ transform: "rotate(90deg 100px 100px)" }}>Earth</text>

              {/* Natal Sun degree marker (at 120 deg) */}
              <line x1="100" y1="100" x2={natalSunPos.x} y2={natalSunPos.y} stroke="rgba(156,122,47,0.3)" strokeDasharray="3 3" />
              <circle cx={natalSunPos.x} cy={natalSunPos.y} r="6" fill="none" stroke={GOLD} strokeWidth="1.5" />

              {/* Solar Return Lock Connection (Golden highlight in solar return mode) */}
              {activeMoment === "varshaphala" && (
                <line x1="100" y1="100" x2={sunPos.x} y2={sunPos.y} className="lock-line-animation" strokeWidth="2.5" />
              )}

              {/* Current Active Sun position */}
              <circle cx={sunPos.x} cy={sunPos.y} r="8" fill={activeMoment === "varshaphala" ? GOLD : AMBER} />
              <text x={sunPos.x} y={sunPos.y} fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle" dominantBaseline="central" style={{ transform: `rotate(90deg ${sunPos.x}px ${sunPos.y}px)` }}>Su</text>

              {/* Info text inside dial */}
              <text x="100" y="145" fill={INK_MUTED} fontSize="6" textAnchor="middle" style={{ transform: "rotate(90deg 100px 145px)" }}>
                {activeMoment === "jataka" ? "Birth Sun: 120° (Leo)" : activeMoment === "varshaphala" ? "Solar Return Lock: 120°" : `Horary Sun: ${sunAngle}°`}
              </text>
            </svg>

            {/* Slider for Horary Sun position */}
            {activeMoment === "prashna" && (
              <div style={{ width: "100%", padding: "0 8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: INK_SECONDARY, marginBottom: "4px" }}>
                  <span>Set Question Moment (Sun Degree):</span>
                  <strong>{prashnaSunDeg}°</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={prashnaSunDeg}
                  onChange={(e) => setPrashnaSunDeg(Number(e.target.value))}
                  style={{ width: "100%", accentColor: GOLD }}
                />
              </div>
            )}
          </div>

          {/* North Indian Diamond Chart SVG */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(156, 122, 47, 0.16)",
              borderRadius: "12px",
              padding: "20px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 4px 16px rgba(156, 122, 47, 0.03)"
            }}
          >
            <div style={{ display: "flex", width: "100%", justifyItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "12.5px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
                <Compass size={16} color={GOLD} />
                North Indian Diamond Chart (Lagna {moment.lagnaSign})
              </span>
            </div>

            <svg width="200" height="200" viewBox="0 0 200 200" style={{ overflow: "visible" }}>
              <rect x="0" y="0" width="200" height="200" fill="none" stroke="rgba(156, 122, 47, 0.3)" strokeWidth="1.5" rx="4" />
              {(Object.keys(HOUSE_PATHS) as Array<unknown> as number[]).map((h) => {
                const pathStr = HOUSE_PATHS[h as keyof typeof HOUSE_PATHS];
                const pos = HOUSE_LABEL_POS[h as keyof typeof HOUSE_LABEL_POS];
                const sign = moment.rashiLabels[h];
                const planetText = moment.planetPlacements[h] || "";

                let fillColor = "none";
                let strokeColor = "rgba(156, 122, 47, 0.2)";
                let strokeWidth = "1";

                if (activeMoment === "varshaphala" && h === 4) {
                  fillColor = "rgba(156, 122, 47, 0.1)";
                  strokeColor = GOLD;
                  strokeWidth = "1.8";
                } else if (activeMoment === "prashna" && (h === 1 || h === 5)) {
                  fillColor = "rgba(47, 125, 85, 0.04)";
                  strokeColor = GREEN;
                  strokeWidth = "1.5";
                }

                return (
                  <g key={h}>
                    <path
                      d={pathStr}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      style={{ transition: "all 300ms ease" }}
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 7}
                      fill={INK_MUTED}
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {sign}
                    </text>
                    {planetText && (
                      <text
                        x={pos.x}
                        y={pos.y + 6}
                        fill={planetText.includes("Munthā") || planetText.includes("Varṣeśa") ? GOLD_DEEP : INK_PRIMARY}
                        fontSize="7.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {planetText}
                      </text>
                    )}
                  </g>
                );
              })}

              {activeMoment === "prashna" && (
                <g>
                  <path
                    d="M 100,55 Q 60,100 28,144"
                    fill="none"
                    stroke={GREEN}
                    strokeWidth="2.5"
                    className="applying-aspect-pulse"
                    strokeDasharray="4 2"
                  />
                  <polygon points="25,147 33,145 29,139" fill={GREEN} />
                  <text x="64" y="94" fill={GREEN} fontSize="7" fontWeight="bold" textAnchor="middle">
                    Applying Ithaśāla
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Right Side: Moment Info Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Details Card */}
          <div
            className="gl-surface-twilight-glass"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(156, 122, 47, 0.15)",
              borderRadius: "10px",
              padding: "18px",
              boxShadow: "0 2px 8px rgba(156,122,47,0.01)"
            }}
          >
            <h4 style={{ fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <SunIcon size={18} color={GOLD} />
              {moment.title}
            </h4>
            <p style={{ fontSize: "13.5px", lineHeight: "1.5", color: INK_SECONDARY, margin: "0 0 16px 0" }}>
              {moment.description}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: GREEN, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                  Active Tools:
                </span>
                <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "12px", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "4px" }}>
                  {moment.activeTools.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: RED, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                  Disabled/Not Used:
                </span>
                <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "12px", color: INK_MUTED, display: "flex", flexDirection: "column", gap: "4px" }}>
                  {moment.inactiveTools.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Solar Return Rationale Info Block */}
          {activeMoment === "varshaphala" && (
            <div
              style={{
                background: "rgba(47, 125, 85, 0.04)",
                border: "1px solid rgba(47, 125, 85, 0.2)",
                borderRadius: "10px",
                padding: "14px",
                fontSize: "12.5px",
                color: GREEN,
                lineHeight: "1.4"
              }}
            >
              <Info size={16} style={{ float: "left", marginRight: "8px", marginTop: "2px" }} />
              <strong>Solar Return Alignment Lock:</strong> Varṣaphala calculation locks onto the exact natal Sun degree (120° in this example), cast for that exact moment of solar transit alignment. This differs from birth and horary charts, which are oriented around exact physical time and geographical coordinates.
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
              Verify your alignment with non-fatalistic horary boundary parameters.
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
