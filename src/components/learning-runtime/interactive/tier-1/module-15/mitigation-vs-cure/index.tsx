"use client";

import React, { useState } from "react";
import { Info, RotateCcw, ShieldAlert, Sparkles, CheckCircle2, XCircle, Scale } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface Scenario {
  id: number;
  statement: string;
  correctCategory: "Cure" | "Mitigation";
  analysis: string;
  reframeOptions: { text: string; correct: boolean }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    statement: "Doing this fast on Saturdays will completely erase the chronic disease indicators in your chart and make you permanently healthy.",
    correctCategory: "Cure",
    analysis: "This is a Cure-claim. It promises to erase a physical destiny from the chart (prārabdha core) which is classically uncuttable. This constitutes over-promise and professional malpractice.",
    reframeOptions: [
      { text: "Fast on Saturdays to reduce the severity of the health dasha and strengthen your digestive capacity.", correct: true },
      { text: "Fast on Saturdays to make sure the dasha results are delayed until you are older.", correct: false }
    ]
  },
  {
    id: 2,
    statement: "Performing charity on Tuesdays helps soften Mars's impulsive heat during this dasha, allowing you to react with composure.",
    correctCategory: "Mitigation",
    analysis: "This is an Honest Mitigation claim. It does not promise to cancel the Mars dasha or delete Mars; it simply offers a way to ease the impulsive intensity and fortify the practitioner's composure.",
    reframeOptions: [
      { text: "Mars is eliminated through this charity, leaving only planetary peace.", correct: false },
      { text: "This charity offers a constructive channel for Mars's energy, reducing conflict severity.", correct: true }
    ]
  },
  {
    id: 3,
    statement: "Wearing this yellow sapphire will completely cancel the financial loss promised during your Jupiter dasha.",
    correctCategory: "Cure",
    analysis: "This is a Cure-claim. It asserts that an external gemstone can cancel a ripened dasha's structural results (financial loss). In reality, gems can only mitigate or tune resonances, never delete fate.",
    reframeOptions: [
      { text: "Wear yellow sapphire to completely change Jupiter from enemy to friend, stopping loss.", correct: false },
      { text: "Wear yellow sapphire to strengthen your clarity and capacity to manage resources wisely during this Jupiter dasha.", correct: true }
    ]
  },
  {
    id: 4,
    statement: "This mantra can mitigate the mental and emotional pressure of the Rahu transit, helping you bear it with patience.",
    correctCategory: "Mitigation",
    analysis: "This is an Honest Mitigation claim. It addresses the emotional edges of the transit (mental pressure, patience) and focuses on the capacity to bear the period rather than erasing the Rahu transit itself.",
    reframeOptions: [
      { text: "The mantra builds resilience and mental grounding, softening Rahu's confusion.", correct: true },
      { text: "The mantra deletes Rahu's transit from your chart, redirecting the planet elsewhere.", correct: false }
    ]
  },
  {
    id: 5,
    statement: "If you perform this specific home puja, the accident indicators in your 8th house will be deleted from your destiny.",
    correctCategory: "Cure",
    analysis: "This is a Cure-claim. Promising to delete accident indicators (the core of prārabdha) constitutes a predatory prescription. It misrepresents shanti measures, which only reduce severity or shift timing.",
    reframeOptions: [
      { text: "The puja mitigates the intensity of the 8th house affliction and builds physical protection.", correct: true },
      { text: "The puja deletes the 8th house from the chart for the duration of the cycle.", correct: false }
    ]
  }
];

export function MitigationVsCure() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, "Cure" | "Mitigation">>({});
  const [selectedReframes, setSelectedReframes] = useState<Record<number, number>>({});
  const [showReframePanel, setShowReframePanel] = useState<Record<number, boolean>>({});

  const activeScenario = SCENARIOS[currentIndex];
  const userChoice = selectedAnswers[activeScenario.id];
  const reframeChoice = selectedReframes[activeScenario.id];

  const resetValues = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSelectedReframes({});
    setShowReframePanel({});
  };

  const handleCategorize = (choice: "Cure" | "Mitigation") => {
    setSelectedAnswers(prev => ({ ...prev, [activeScenario.id]: choice }));
    setShowReframePanel(prev => ({ ...prev, [activeScenario.id]: true }));
  };

  const handleReframeSelect = (optionIndex: number) => {
    setSelectedReframes(prev => ({ ...prev, [activeScenario.id]: optionIndex }));
  };

  // Calculate score
  const correctCount = SCENARIOS.reduce((count, s) => {
    const ans = selectedAnswers[s.id];
    return ans === s.correctCategory ? count + 1 : count;
  }, 0);

  const isDojoComplete = Object.keys(selectedAnswers).length === SCENARIOS.length;

  // Determine Scale Tilt Angle
  let tiltAngle = 0;
  if (userChoice !== undefined) {
    const isCorrect = userChoice === activeScenario.correctCategory;
    if (userChoice === "Cure") {
      // Over-promise cure heavy on the left
      tiltAngle = isCorrect ? -15 : -8;
    } else {
      // Honest mitigation balances grounding on the right
      tiltAngle = isCorrect ? 15 : 8;
    }
  }

  // Left/Right Pan Colors based on audit outcomes
  const leftPanColor = userChoice === "Cure" 
    ? (userChoice === activeScenario.correctCategory ? "rgba(239, 68, 68, 0.15)" : "rgba(124, 109, 91, 0.15)")
    : "rgba(255, 255, 255, 0.3)";
  const leftPanBorder = userChoice === "Cure" 
    ? (userChoice === activeScenario.correctCategory ? "#ef4444" : INK_MUTED)
    : GOLD;

  const rightPanColor = userChoice === "Mitigation"
    ? (userChoice === activeScenario.correctCategory ? "rgba(22, 163, 74, 0.15)" : "rgba(124, 109, 91, 0.15)")
    : "rgba(255, 255, 255, 0.3)";
  const rightPanBorder = userChoice === "Mitigation"
    ? (userChoice === activeScenario.correctCategory ? "#16a34a" : INK_MUTED)
    : GOLD;

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", borderBottom: "1px solid rgba(156,122,47,0.1)", paddingBottom: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
            <Scale size={18} /> Honesty Auditor: Mitigation vs Cure
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Audit client claims. Redesign terms from predatory fate cures to honest, balanced cosmic mitigation.
          </p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP }}>
            Dojo Progress: {correctCount} / {SCENARIOS.length} Correct
          </span>
          <button
            onClick={resetValues}
            style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer" }}
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* PROGRESS DOTS */}
      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
        {SCENARIOS.map((s, idx) => {
          const isCurrent = currentIndex === idx;
          const isAudited = selectedAnswers[s.id] !== undefined;
          const isCorrect = isAudited && selectedAnswers[s.id] === s.correctCategory;
          
          let bg = "rgba(0,0,0,0.06)";
          let border = "1px solid transparent";
          let color = INK_SECONDARY;
          
          if (isCurrent) {
            bg = "#ffffff";
            border = `1.5px solid ${GOLD}`;
            color = GOLD_DEEP;
          } else if (isAudited) {
            bg = isCorrect ? "#16a34a" : "#ef4444";
            color = "#ffffff";
          }

          return (
            <div
              key={s.id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: bg,
                border: border,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 900,
                color: color,
                transition: "all 0.15s"
              }}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>

      {/* SPLIT VIEW */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: Active Audit Statement & Interactive Scale */}
        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: "12px", background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          
          <div>
            <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
              Claim to Audit (Scenario {currentIndex + 1})
            </span>
            <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.08)", borderRadius: "8px", padding: "12px", marginTop: "4px" }}>
              <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", fontWeight: 750, color: INK_PRIMARY, fontStyle: "italic" }}>
                "{activeScenario.statement}"
              </p>
            </div>
          </div>

          {/* INTERACTIVE BALANCE SCALE SVG */}
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0", background: "rgba(251, 248, 243, 0.4)", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.06)" }}>
            <svg width="240" height="140" viewBox="0 0 240 140" style={{ display: "block" }}>
              {/* Stand */}
              <line x1="120" y1="25" x2="120" y2="120" stroke={INK_MUTED} strokeWidth="4" />
              <path d="M 90 120 L 150 120" stroke={INK_MUTED} strokeWidth="6" strokeLinecap="round" />
              <circle cx="120" cy="25" r="5" fill={GOLD_DEEP} />

              {/* Pivoting Scale Assembly */}
              <g style={{ transformOrigin: "120px 35px", transform: `rotate(${tiltAngle}deg)`, transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                {/* Crossbeam */}
                <line x1="60" y1="35" x2="180" y2="35" stroke={GOLD} strokeWidth="3" />
                <circle cx="120" cy="35" r="4" fill={GOLD_DEEP} />
                
                {/* Left Pan Assembly (Cure) */}
                <g style={{ transformOrigin: "60px 35px", transform: `rotate(${-tiltAngle}deg)`, transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                  <line x1="60" y1="35" x2="40" y2="85" stroke={INK_MUTED} strokeWidth="1" />
                  <line x1="60" y1="35" x2="80" y2="85" stroke={INK_MUTED} strokeWidth="1" />
                  <path d="M 32 85 L 88 85 C 88 95, 32 95, 32 85 Z" fill={leftPanColor} stroke={leftPanBorder} strokeWidth="1.5" />
                  
                  {/* Heavy Weight for Cure */}
                  {userChoice === "Cure" && (
                    <rect x="50" y="65" width="20" height="20" rx="3" fill="#ef4444" opacity="0.9" style={{ animation: "slideIn 0.3s ease" }} />
                  )}
                </g>

                {/* Right Pan Assembly (Mitigation) */}
                <g style={{ transformOrigin: "180px 35px", transform: `rotate(${-tiltAngle}deg)`, transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                  <line x1="180" y1="35" x2="160" y2="85" stroke={INK_MUTED} strokeWidth="1" />
                  <line x1="180" y1="35" x2="200" y2="85" stroke={INK_MUTED} strokeWidth="1" />
                  <path d="M 152 85 L 208 85 C 208 95, 152 95, 152 85 Z" fill={rightPanColor} stroke={rightPanBorder} strokeWidth="1.5" />
                  
                  {/* Grounded Weight for Mitigation */}
                  {userChoice === "Mitigation" && (
                    <rect x="170" y="65" width="20" height="20" rx="3" fill="#16a34a" opacity="0.9" style={{ animation: "slideIn 0.3s ease" }} />
                  )}
                </g>
              </g>
            </svg>
          </div>

          {/* Categorize Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
              Evaluate this claim:
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                onClick={() => handleCategorize("Mitigation")}
                disabled={userChoice !== undefined}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: userChoice === "Mitigation" ? "1.5px solid #16a34a" : "1px solid rgba(0,0,0,0.1)",
                  background: userChoice === "Mitigation" ? "rgba(22, 163, 74, 0.08)" : "#ffffff",
                  color: userChoice === "Mitigation" ? "#16a34a" : INK_SECONDARY,
                  fontWeight: 800,
                  fontSize: "11px",
                  cursor: userChoice !== undefined ? "default" : "pointer",
                  transition: "all 0.15s ease-in-out"
                }}
              >
                Honest Mitigation
              </button>
              
              <button
                onClick={() => handleCategorize("Cure")}
                disabled={userChoice !== undefined}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: userChoice === "Cure" ? "1.5px solid #ef4444" : "1px solid rgba(0,0,0,0.1)",
                  background: userChoice === "Cure" ? "rgba(239, 68, 68, 0.08)" : "#ffffff",
                  color: userChoice === "Cure" ? "#ef4444" : INK_SECONDARY,
                  fontWeight: 800,
                  fontSize: "11px",
                  cursor: userChoice !== undefined ? "default" : "pointer",
                  transition: "all 0.15s ease-in-out"
                }}
              >
                Malpractice / Cure
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Analysis & Reframe */}
        <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          
          {userChoice ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              
              {/* Verdict Header */}
              {(() => {
                const isCorrect = userChoice === activeScenario.correctCategory;
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", background: isCorrect ? "rgba(22,163,74,0.05)" : "rgba(239,68,68,0.05)", border: `1.2px solid ${isCorrect ? "#16a34a" : "#ef4444"}`, padding: "8px 10px", borderRadius: "10px" }}>
                    {isCorrect ? <CheckCircle2 size={16} style={{ color: "#16a34a" }} /> : <XCircle size={16} style={{ color: "#ef4444" }} />}
                    <span style={{ fontSize: "11.5px", fontWeight: 900, color: isCorrect ? "#16a34a" : "#ef4444" }}>
                      {isCorrect ? "Correct Audit Conclusion" : "Incorrect Audit Conclusion"}
                    </span>
                  </div>
                );
              })()}

              {/* Astrological Analysis */}
              <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.15)", borderRadius: "10px", padding: "10px" }}>
                <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "block", marginBottom: "2px" }}>
                  Astrological Rationale
                </span>
                <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
                  {activeScenario.analysis}
                </p>
              </div>

              {/* Reframe Exercise */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
                  Select the Ethical Reframing:
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {activeScenario.reframeOptions.map((opt, oIdx) => {
                    const isSelected = reframeChoice === oIdx;
                    const isAnswered = reframeChoice !== undefined;
                    let border = "1px solid rgba(0,0,0,0.08)";
                    let bg = "#ffffff";
                    
                    if (isSelected) {
                      border = `1.5px solid ${opt.correct ? "#16a34a" : "#ef4444"}`;
                      bg = opt.correct ? "rgba(22, 163, 74, 0.05)" : "rgba(239, 68, 68, 0.05)";
                    }

                    return (
                      <div
                        key={oIdx}
                        onClick={() => !isAnswered && handleReframeSelect(oIdx)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: border,
                          background: bg,
                          cursor: isAnswered ? "default" : "pointer",
                          fontSize: "10.5px",
                          lineHeight: "1.4",
                          color: INK_SECONDARY,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 0.15s ease-in-out"
                        }}
                      >
                        <span>{opt.text}</span>
                        {isSelected && (
                          <span style={{ fontSize: "9px", fontWeight: 800, color: opt.correct ? "#16a34a" : "#ef4444", marginLeft: "6px" }}>
                            {opt.correct ? "Ethical" : "Incorrect"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", height: "180px", border: "1.5px dashed rgba(156,122,47,0.15)", borderRadius: "12px", background: "rgba(0,0,0,0.01)" }}>
              <span style={{ fontSize: "11px", color: INK_MUTED, textAlign: "center", padding: "16px" }}>
                Select an audit conclusion on the left to see the Scale of Claims pivot, and unlock the ethical reframing options.
              </span>
            </div>
          )}

        </div>

      </div>

      {/* COMPLETED BANNER */}
      {isDojoComplete && (
        <div style={{ background: "rgba(22, 163, 74, 0.06)", border: "1.5px solid #16a34a", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "4px", alignItems: "center", textAlign: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: 900, color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
            <Sparkles size={16} /> Auditor Dojo Mastered!
          </span>
          <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY }}>
            You have successfully audited all scenarios. You scored **{correctCount} / {SCENARIOS.length}** correct conclusions! You are prepared to counsel clients with integrity and classical precision.
          </p>
        </div>
      )}

    </div>
  );
}
