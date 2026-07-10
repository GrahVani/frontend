"use client";

import { useState, useEffect, useRef } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "#E9D7A5";
const GREEN = "#2F7D55";
const GREEN_LIGHT = "#A3E2C0";
const CRIMSON = "#A23A1E";
const CRIMSON_LIGHT = "#F2B8B8";

interface Scenario {
  id: number;
  title: string;
  category: "Timing" | "Narrative" | "Strength" | "Horary" | "Synthesis";
  question: string;
  correctAnswer: "kp" | "parashari" | "both";
  explanation: string;
  metadata: {
    client: string;
    birthInfo: string;
    focus: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Inquiry #201",
    category: "Timing",
    question: "Will my visa be approved, and by roughly what month?",
    correctAnswer: "kp",
    explanation: "This is a pinpoint event-timing question. KP's significator hierarchy and sub-lord overlay are built exactly for this level of date-window precision.",
    metadata: {
      client: "Aarav Sharma",
      birthInfo: "Verified birth details, precise to 5 seconds",
      focus: "Temporal pinpointing of visa approval window"
    }
  },
  {
    id: 2,
    title: "Inquiry #202",
    category: "Narrative",
    question: "What are the overall themes, challenges, and strengths in my child's life?",
    correctAnswer: "parashari",
    explanation: "This is a broad life-narrative question. Parāśarī excels at weaving together house lords, yogas, and divisional charts (vargas) to paint a holistic life portrait.",
    metadata: {
      client: "Meera Nair",
      birthInfo: "Standard birth time from hospital records",
      focus: "Comprehensive life overview, character, and fortunes"
    }
  },
  {
    id: 3,
    title: "Inquiry #203",
    category: "Timing",
    question: "Will I get this specific promotion at work?",
    correctAnswer: "kp",
    explanation: "This is a clear binary yes/no question. KP's cuspal sub-lord serves as the primary determinant for pinpointing a single promise.",
    metadata: {
      client: "Rohan Varma",
      birthInfo: "Rectified chart, highly reliable cusp degrees",
      focus: "Binary yes/no success of job promotion inquiry"
    }
  },
  {
    id: 4,
    title: "Inquiry #204",
    category: "Strength",
    question: "I want to know which planet lording my 10th house is strongest via Ṣaḍbala and Aṣṭakavarga.",
    correctAnswer: "parashari",
    explanation: "KP does not use Ṣaḍbala or Aṣṭakavarga. These are classic strength-scoring systems unique to the Parāśarī tradition.",
    metadata: {
      client: "Devika Roy",
      birthInfo: "Precise birth chart available",
      focus: "Quantitative strength analysis of houses and lords"
    }
  },
  {
    id: 5,
    title: "Inquiry #205",
    category: "Horary",
    question: "Will I get married? My birth time is uncertain, but I am asking the question right now.",
    correctAnswer: "kp",
    explanation: "Because the birth time is uncertain, casting a horary (praśna) chart using KP's 1-249 number system is the ideal route since it relies on the moment of the question, not birth coordinates.",
    metadata: {
      client: "Sneha Patel",
      birthInfo: "Uncertain birth record (approximate range +- 2 hours)",
      focus: "Marriage promise resolved via immediate horary moment"
    }
  },
  {
    id: 6,
    title: "Inquiry #206",
    category: "Narrative",
    question: "I need to understand the planetary yogas in my chart for wealth.",
    correctAnswer: "parashari",
    explanation: "The classical yoga catalog (e.g. Raja Yogas, Dhana Yogas) belongs exclusively to Parāśarī. KP focuses on significator chains rather than yogas.",
    metadata: {
      client: "Karan Gupta",
      birthInfo: "Standard birth chart coordinates",
      focus: "Identification of classical wealth configurations"
    }
  },
  {
    id: 7,
    title: "Inquiry #207",
    category: "Synthesis",
    question: "I am making an irreversible decision to buy a business. I want to verify if both systems align on the window.",
    correctAnswer: "both",
    explanation: "For major, high-stakes decisions where the querent will act irreversibly, the framework recommends running both streams separately. Convergence raises confidence; divergence flags nuance to investigate.",
    metadata: {
      client: "Priya Malhotra",
      birthInfo: "Rectified birth time, high accuracy",
      focus: "Double-stream confirmation for high-risk investment"
    }
  },
  {
    id: 8,
    title: "Inquiry #208",
    category: "Timing",
    question: "Which sub-period within my running Venus mahādaśā will trigger travel?",
    correctAnswer: "kp",
    explanation: "Sub-period timing (daśā → bhukti → antara) falls under KP's modified Vimśottarī, where the sub-lord overlay pinpoints when significators trigger.",
    metadata: {
      client: "Vikram Sen",
      birthInfo: "Precise birth chart",
      focus: "Pinpointing sub-period triggering travel significators"
    }
  }
];

export function KpCrossStreamRouter() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [routedAnswers, setRoutedAnswers] = useState<Record<number, "kp" | "parashari" | "both">>({});
  const [selectedAnswer, setSelectedAnswer] = useState<"kp" | "parashari" | "both" | null>(null);
  const [flowAnimation, setFlowAnimation] = useState<"kp" | "parashari" | "both" | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);
  const [diagnosticText, setDiagnosticText] = useState<string>("");
  const diagnosticInterval = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect for diagnostics screen
  const runTypewriter = (text: string) => {
    if (diagnosticInterval.current) clearInterval(diagnosticInterval.current);
    let index = 0;
    setDiagnosticText("");
    diagnosticInterval.current = setInterval(() => {
      if (index < text.length) {
        setDiagnosticText((prev) => prev + text.charAt(index));
        index++;
      } else {
        if (diagnosticInterval.current) clearInterval(diagnosticInterval.current);
      }
    }, 15);
  };

  useEffect(() => {
    runTypewriter(
      "DISPATCHER ONLINE. Waiting for client inquiry routing configuration. Select target router for the active queue item."
    );
    return () => {
      if (diagnosticInterval.current) clearInterval(diagnosticInterval.current);
    };
  }, []);

  const handleRoute = (router: "kp" | "parashari" | "both") => {
    if (selectedAnswer !== null || flowAnimation !== null) return;

    // Trigger flow animation
    setFlowAnimation(router);

    // After animation finishes, compute correctness and diagnostics
    setTimeout(() => {
      setSelectedAnswer(router);
      setFlowAnimation(null);
      const isCorrect = router === SCENARIOS[currentIndex].correctAnswer;
      const response = isCorrect
        ? `>>> CONNECTION CONFIRMED: SUCCESSFUL ROUTE\n\n${SCENARIOS[currentIndex].explanation}`
        : `>>> ROUTING EXCEPTION DETECTED: INVALID CHANNEL\n\n${SCENARIOS[currentIndex].explanation}`;
      
      runTypewriter(response);

      // Record answer
      setRoutedAnswers((prev) => ({ ...prev, [SCENARIOS[currentIndex].id]: router }));
    }, 800);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      runTypewriter(`LOADING CLIENT INQUIRY #${SCENARIOS[currentIndex + 1].id}... Standing by for routing command.`);
    } else {
      setCompleted(true);
      const correctCount = SCENARIOS.filter(
        (s) => routedAnswers[s.id] === s.correctAnswer
      ).length;
      runTypewriter(
        `DISPATCH SESSION COMPLETE. Routed: ${correctCount}/${SCENARIOS.length} successfully. Competency level calculated.`
      );
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setFlowAnimation(null);
    setRoutedAnswers({});
    setCompleted(false);
    runTypewriter(
      "DISPATCHER INITIALIZED. Ready for routing operations. Select target router for the active queue item."
    );
  };

  const currentScenario = SCENARIOS[currentIndex];
  const score = SCENARIOS.filter((s) => routedAnswers[s.id] === s.correctAnswer).length;

  // Key handlers for keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, choice: "kp" | "parashari" | "both") => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRoute(choice);
    }
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        color: INK_PRIMARY,
        fontFamily: "'Courier New', Courier, monospace",
        borderRadius: "16px",
        border: `1px solid ${HAIRLINE}`,
        position: "relative",
        overflow: "hidden"
      }}
      data-interactive="kp-cross-stream-router"
    >
      {/* Header */}
      <header
        style={{
          borderBottom: `1px solid ${HAIRLINE}`,
          paddingBottom: "12px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <div>
          <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.15em" }}>
            Module 16 · Chapter 8 · Lesson 3
          </span>
          <h1 style={{ margin: "4px 0 0", color: GOLD, fontSize: "1.6rem", fontWeight: 700, fontFamily: "inherit" }}>
            PRACTITIONER'S DISPATCH COCKPIT
          </h1>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ fontSize: "11px", color: INK_SECONDARY, border: `1px solid ${HAIRLINE}`, padding: "4px 8px", borderRadius: "4px" }}>
            DECISION ENGINE: <strong style={{ color: GREEN }}>ACTIVE</strong>
          </div>
        </div>
      </header>

      {/* Main Console Layout */}
      {!completed ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
          {/* Responsive grid for console panels */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(240px, 300px) 1fr",
              gap: "20px",
            }}
            className="dispatcher-responsive-grid"
          >
            <style>{`
              @media (max-width: 900px) {
                .dispatcher-responsive-grid {
                  grid-template-columns: 1fr ! from !important;
                }
              }
            `}</style>

            {/* Left Column: Client Queue */}
            <div
              style={{
                background: "rgba(156, 122, 47, 0.03)",
                border: `1px solid ${HAIRLINE}`,
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              <h2 style={{ fontSize: "11px", color: GOLD, margin: "0 0 4px", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "6px", fontWeight: "bold" }}>
                INQUIRY DISPATCH QUEUE
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", maxHeight: "300px" }}>
                {SCENARIOS.map((scenario, index) => {
                  const isCurrent = index === currentIndex;
                  const answer = routedAnswers[scenario.id];
                  const isAnswered = answer !== undefined;
                  const isCorrect = isAnswered && answer === scenario.correctAnswer;

                  let border = `1px solid ${HAIRLINE}`;
                  let bg = "rgba(0, 0, 0, 0.1)";
                  if (isCurrent) {
                    border = `1.5px solid ${GOLD}`;
                    bg = "rgba(156, 122, 47, 0.12)";
                  } else if (isAnswered) {
                    border = `1px solid ${isCorrect ? GREEN : CRIMSON}`;
                    bg = isCorrect ? `${GREEN}11` : `${CRIMSON}11`;
                  }

                  return (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        if (selectedAnswer === null && flowAnimation === null) {
                          setCurrentIndex(index);
                          runTypewriter(`LOADING CLIENT INQUIRY #${scenario.id}... Standing by for routing command.`);
                        }
                      }}
                      disabled={selectedAnswer !== null || flowAnimation !== null}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border,
                        background: bg,
                        color: isCurrent ? GOLD : INK_PRIMARY,
                        cursor: (selectedAnswer !== null || flowAnimation !== null) ? "not-allowed" : "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontFamily: "inherit",
                        fontSize: "12px",
                        transition: "all 0.2s"
                      }}
                    >
                      <div>
                        <strong style={{ display: "block" }}>{scenario.title}</strong>
                        <span style={{ fontSize: "10px", color: INK_SECONDARY }}>{scenario.category} Focus</span>
                      </div>
                      <div>
                        {isAnswered ? (
                          isCorrect ? (
                            <span style={{ color: GREEN, fontWeight: "bold" }}>✓</span>
                          ) : (
                            <span style={{ color: CRIMSON, fontWeight: "bold" }}>✗</span>
                          )
                        ) : (
                          <span style={{ color: INK_MUTED }}>●</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend & Help Box */}
              <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "12px", marginTop: "8px", fontSize: "10px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                <span style={{ color: GOLD, fontWeight: "bold" }}>LEGEND:</span>
                <ul style={{ paddingLeft: "14px", margin: "4px 0" }}>
                  <li><strong style={{ color: GOLD }}>KP Router:</strong> Strict binary timing rules, Placidus cusps, or birth-time anomalies (Horary).</li>
                  <li><strong style={{ color: GOLD }}>Parāśarī:</strong> General yogas, broad life themes, strength-metric checks.</li>
                  <li><strong style={{ color: GOLD }}>Both:</strong> High-risk consultations.</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Work Desk */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Active Inquiry detail */}
              <div
                style={{
                  border: `1.5px solid ${GOLD}`,
                  borderRadius: "12px",
                  padding: "20px",
                  background: SURFACE,
                  boxShadow: "inset 0 0 10px rgba(156, 122, 47, 0.1)",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: GOLD, marginBottom: "8px" }}>
                  <span>ACTIVE OPERATIONAL SLOT: <strong>{currentScenario.title}</strong></span>
                  <span>CATEGORY: <strong>{currentScenario.category.toUpperCase()}</strong></span>
                </div>
                <p style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 14px 0", lineHeight: "1.5", color: INK_PRIMARY }}>
                  "{currentScenario.question}"
                </p>

                <div style={{ borderTop: `1px dashed ${HAIRLINE}`, paddingTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "10px", color: INK_SECONDARY }}>
                  <div>
                    CLIENT CODENAME: <strong style={{ color: INK_PRIMARY }}>{currentScenario.metadata.client}</strong>
                  </div>
                  <div>
                    BIRTH LONGITUDE INTEGRITY: <strong style={{ color: INK_PRIMARY }}>{currentScenario.metadata.birthInfo}</strong>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    INQUIRY OBJECTIVE: <strong style={{ color: INK_PRIMARY }}>{currentScenario.metadata.focus}</strong>
                  </div>
                </div>
              </div>

              {/* Interactive Signal Flow Canvas */}
              <div
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: "12px",
                  padding: "12px",
                  background: "rgba(0, 0, 0, 0.15)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <span style={{ fontSize: "10px", color: GOLD, marginBottom: "6px" }}>SIGNAL ROUTING PATHWAY</span>
                <svg width="100%" height="80" viewBox="0 0 500 80" style={{ maxWidth: "500px", overflow: "visible" }}>
                  {/* Lines to routers */}
                  {/* KP Path (left to top-left) */}
                  <path
                    d="M 250,15 L 250,30 L 70,30 L 70,65"
                    fill="none"
                    stroke={flowAnimation === "kp" ? GOLD : HAIRLINE}
                    strokeWidth="1.5"
                    strokeDasharray={flowAnimation === "kp" ? "4" : "none"}
                    style={{ transition: "stroke 0.3s" }}
                  />
                  {/* Parashari Path (left to top-right) */}
                  <path
                    d="M 250,15 L 250,30 L 430,30 L 430,65"
                    fill="none"
                    stroke={flowAnimation === "parashari" ? GOLD : HAIRLINE}
                    strokeWidth="1.5"
                    strokeDasharray={flowAnimation === "parashari" ? "4" : "none"}
                    style={{ transition: "stroke 0.3s" }}
                  />
                  {/* Dual Stream Path (straight down) */}
                  <path
                    d="M 250,15 L 250,65"
                    fill="none"
                    stroke={flowAnimation === "both" ? GOLD : HAIRLINE}
                    strokeWidth="1.5"
                    strokeDasharray={flowAnimation === "both" ? "4" : "none"}
                    style={{ transition: "stroke 0.3s" }}
                  />

                  {/* Pulsing Source Node */}
                  <circle cx="250" cy="15" r="7" fill={GOLD} />
                  <circle cx="250" cy="15" r="14" fill="none" stroke={GOLD} strokeWidth="1" style={{ opacity: 0.5 }}>
                    <animate attributeName="r" values="7;18;7" dur="2s" repeatCount="indefinite" />
                  </circle>

                  {/* Flowing Pulse Particle */}
                  {flowAnimation === "kp" && (
                    <circle r="5" fill={GOLD}>
                      <animateMotion dur="0.8s" repeatCount="1" path="M 250,15 L 250,30 L 70,30 L 70,65" fill="freeze" />
                    </circle>
                  )}
                  {flowAnimation === "parashari" && (
                    <circle r="5" fill={GOLD}>
                      <animateMotion dur="0.8s" repeatCount="1" path="M 250,15 L 250,30 L 430,30 L 430,65" fill="freeze" />
                    </circle>
                  )}
                  {flowAnimation === "both" && (
                    <circle r="5" fill={GOLD}>
                      <animateMotion dur="0.8s" repeatCount="1" path="M 250,15 L 250,65" fill="freeze" />
                    </circle>
                  )}

                  {/* Port Target Markers */}
                  <circle cx="70" cy="65" r="4" fill={flowAnimation === "kp" ? GOLD : HAIRLINE} />
                  <circle cx="250" cy="65" r="4" fill={flowAnimation === "both" ? GOLD : HAIRLINE} />
                  <circle cx="430" cy="65" r="4" fill={flowAnimation === "parashari" ? GOLD : HAIRLINE} />

                  <text x="250" y="5" textAnchor="middle" fill={GOLD} fontSize="8" fontWeight="bold">SOURCE QUEUE</text>
                </svg>
              </div>

              {/* Router Channels Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
                {/* KP Router Button */}
                <button
                  onClick={() => handleRoute("kp")}
                  onKeyDown={(e) => handleKeyDown(e, "kp")}
                  disabled={selectedAnswer !== null || flowAnimation !== null}
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    border: `1.5px solid ${selectedAnswer === "kp" ? (currentScenario.correctAnswer === "kp" ? GREEN : CRIMSON) : HAIRLINE}`,
                    borderRadius: "10px",
                    padding: "16px 12px",
                    color: INK_PRIMARY,
                    cursor: (selectedAnswer !== null || flowAnimation !== null) ? "not-allowed" : "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "inherit",
                    transition: "all 0.2s"
                  }}
                  aria-label="Route to KP Placidus Cusp Router"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span style={{ fontSize: "11px", fontWeight: "bold" }}>KP PLACIDUS</span>
                  <span style={{ fontSize: "9px", color: INK_SECONDARY }}>CSL &amp; Timing</span>
                </button>

                {/* Parashari Router Button */}
                <button
                  onClick={() => handleRoute("parashari")}
                  onKeyDown={(e) => handleKeyDown(e, "parashari")}
                  disabled={selectedAnswer !== null || flowAnimation !== null}
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    border: `1.5px solid ${selectedAnswer === "parashari" ? (currentScenario.correctAnswer === "parashari" ? GREEN : CRIMSON) : HAIRLINE}`,
                    borderRadius: "10px",
                    padding: "16px 12px",
                    color: INK_PRIMARY,
                    cursor: (selectedAnswer !== null || flowAnimation !== null) ? "not-allowed" : "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "inherit",
                    transition: "all 0.2s"
                  }}
                  aria-label="Route to Parāśarī Whole-Sign Router"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2">
                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <line x1="2" y1="8.5" x2="22" y2="15.5" />
                  </svg>
                  <span style={{ fontSize: "11px", fontWeight: "bold" }}>PARĀŚARĪ</span>
                  <span style={{ fontSize: "9px", color: INK_SECONDARY }}>Vargas &amp; Yogas</span>
                </button>

                {/* Dual Router Button */}
                <button
                  onClick={() => handleRoute("both")}
                  onKeyDown={(e) => handleKeyDown(e, "both")}
                  disabled={selectedAnswer !== null || flowAnimation !== null}
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    border: `1.5px solid ${selectedAnswer === "both" ? (currentScenario.correctAnswer === "both" ? GREEN : CRIMSON) : HAIRLINE}`,
                    borderRadius: "10px",
                    padding: "16px 12px",
                    color: INK_PRIMARY,
                    cursor: (selectedAnswer !== null || flowAnimation !== null) ? "not-allowed" : "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "inherit",
                    transition: "all 0.2s"
                  }}
                  aria-label="Route to Dual-Stream Integration Router"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2">
                    <path d="M4.5 16.5c-1.5-1.5-2.5-3.5-2.5-5.5s1-4 2.5-5.5" />
                    <path d="M19.5 7.5c1.5 1.5 2.5 3.5 2.5 5.5s-1 4-2.5 5.5" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                  <span style={{ fontSize: "11px", fontWeight: "bold" }}>DUAL ROUTE</span>
                  <span style={{ fontSize: "9px", color: INK_SECONDARY }}>Convergence</span>
                </button>
              </div>

              {/* Retro Diagnostic Screen */}
              <div
                style={{
                  background: "#080C0A",
                  border: "2px solid #1E2D24",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "inset 0 0 12px rgba(47, 125, 85, 0.2)",
                  color: "#39E67B",
                  fontSize: "12px",
                  minHeight: "120px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ color: "#74F4A2", fontSize: "10px", borderBottom: "1px solid #1E2D24", paddingBottom: "4px", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                    <span>DIAGNOSTIC PROCESSOR ACTIVE</span>
                    <span style={{ animation: "pulse 1.5s infinite" }}>● ONLINE</span>
                  </div>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: "1.4" }}>
                    {diagnosticText}
                  </pre>
                </div>

                {selectedAnswer !== null && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                    <button
                      onClick={handleNext}
                      style={{
                        background: "#39E67B",
                        color: "#080C0A",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 14px",
                        fontFamily: "inherit",
                        fontWeight: "bold",
                        fontSize: "11px",
                        cursor: "pointer",
                        boxShadow: "0 0 8px rgba(57, 230, 123, 0.4)"
                      }}
                    >
                      {currentIndex < SCENARIOS.length - 1 ? "LOAD NEXT INQUIRY" : "RESOLVE SESSION"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Final Summary View */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          {/* Radial Competency Gauge */}
          <div style={{ position: "relative", width: "160px", height: "160px", marginBottom: "16px" }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="8" />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke={score >= 6 ? GREEN : score >= 4 ? GOLD : CRIMSON}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - score / SCENARIOS.length)}`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                style={{ transition: "stroke-dashoffset 1s" }}
              />
              <text x="80" y="75" textAnchor="middle" fill={GOLD} fontSize="20" fontWeight="bold" fontFamily="inherit">
                {Math.round((score / SCENARIOS.length) * 100)}%
              </text>
              <text x="80" y="95" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontFamily="inherit">
                ROUTING SCORE
              </text>
            </svg>
          </div>

          <h2 style={{ fontSize: "1.5rem", color: GOLD, margin: "0 0 8px 0" }}>
            {score === SCENARIOS.length
              ? "MASTER ASTROLOGICAL DISPATCHER"
              : score >= 6
              ? "SHASTRA SPECIALIST ROUTER"
              : score >= 4
              ? "INTERMEDIATE ASTRO-OPERATOR"
              : "APPRENTICE ROUTER"}
          </h2>
          <p style={{ fontSize: "13px", color: INK_SECONDARY, lineHeight: "1.5", margin: "0 0 24px 0" }}>
            You correctly evaluated and dispatched <strong>{score}</strong> out of <strong>{SCENARIOS.length}</strong> complex client inquiries to their appropriate system terminals, keeping precision and narrative goals properly balanced.
          </p>

          {/* Detailed Score breakdown table */}
          <div style={{ width: "100%", border: `1px solid ${HAIRLINE}`, borderRadius: "8px", background: "rgba(0, 0, 0, 0.1)", padding: "12px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "11px", color: GOLD, margin: "0 0 10px 0", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "6px" }}>ROUTE REPORT DIGEST</h3>
            {SCENARIOS.map((s) => {
              const answer = routedAnswers[s.id];
              const isCorrect = answer === s.correctAnswer;
              return (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", padding: "4px 0", borderBottom: `1px solid rgba(156, 122, 47, 0.05)` }}>
                  <span style={{ color: INK_PRIMARY }}>{s.title} ({s.category})</span>
                  <span style={{ color: isCorrect ? GREEN : CRIMSON, fontWeight: "bold" }}>
                    {isCorrect ? "CORRECT ROUTE" : `WRONG ROUTE (${answer?.toUpperCase()})`}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRestart}
            style={{
              background: GOLD,
              color: "#FFFBF2",
              border: "none",
              borderRadius: "8px",
              padding: "12px 30px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)"
            }}
          >
            REBOOT DISPATCH ENGINE
          </button>
        </div>
      )}

      {/* Retro styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
