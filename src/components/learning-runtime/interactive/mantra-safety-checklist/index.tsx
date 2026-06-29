"use client";

import React, { useState } from "react";
import { ShieldAlert, CheckCircle, AlertTriangle, RefreshCw, ChevronRight, ShieldCheck, HeartPulse } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface Step {
  id: number;
  title: string;
  question: string;
  options: {
    text: string;
    isSafe: boolean;
    feedback: string;
  }[];
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Pronunciation",
    question: "How did you learn (or intend to learn) the mantra's correct pronunciation?",
    options: [
      {
        text: "Under the guidance of a qualified Sanskrit teacher or lineage guru.",
        isSafe: true,
        feedback: "Safest Practice. Personal oral transmission preserves the exact pitch and phonemic vibration of the lineage."
      },
      {
        text: "From an authentic audio recording alongside precise IAST transliteration.",
        isSafe: true,
        feedback: "Acceptable for study. Audio and IAST support prevent major phonetic distortions."
      },
      {
        text: "From casual English translations / simplified reading text, without audio guidance.",
        isSafe: false,
        feedback: "Warning: Approximate pronunciation changes the sonic form, altering or neutralizing the causal effects. Audio + IAST is the minimum requirement."
      }
    ]
  },
  {
    id: 2,
    title: "Initiation",
    question: "What is the mantra's tradition category, and have you received initiation (dīkṣā)?",
    options: [
      {
        text: "It is an open Smārta/devotional name mantra (e.g. stotra, nāma-japa), needing no initiation.",
        isSafe: true,
        feedback: "Clearance: Devotional and Purāṇic mantras are openly accessible and do not require dīkṣā."
      },
      {
        text: "It is a Vaidika / Tāntrika bīja mantra, and I have received formal lineage initiation.",
        isSafe: true,
        feedback: "Clearance: Linage-gated mantras are safely activated through formal teacher-initiated frameworks."
      },
      {
        text: "It is a Vaidika / Tāntrika bīja mantra, but I do NOT have initiation (dīkṣā).",
        isSafe: false,
        feedback: "Contraindication: Single-syllable bīja and Vedic mantras are initiation-gated. Self-starting these carries severe spiritual and psychological warnings in classical śāstras."
      }
    ]
  },
  {
    id: 3,
    title: "Timing & Purity",
    question: "Are there specific timing (e.g. brāhma-muhūrta) or purity/fasting conventions, and will you follow them?",
    options: [
      {
        text: "No specific restrictions apply to this mantra's category.",
        isSafe: true,
        feedback: "Clearance: General devotional mantras can be practiced freely at any time."
      },
      {
        text: "Yes, rules apply, and I will strictly adhere to the timing and purity guidelines.",
        isSafe: true,
        feedback: "Clearance: Adhering to pre-dawn (brāhma-muhūrta) or purification rules supports rhythmic integration."
      },
      {
        text: "Yes, rules apply, but I plan to ignore them or practice casually at arbitrary times.",
        isSafe: false,
        feedback: "Contraindication: Disregarding timing and purity boundaries for high-discipline mantras disrupts energetic balance."
      }
    ]
  },
  {
    id: 4,
    title: "Health & Force",
    question: "Is the practitioner planning intensive sādhana (breath-linked, long sessions) or dealing with medical issues?",
    options: [
      {
        text: "Gentle devotional chanting only (under 15 minutes daily, normal breathing).",
        isSafe: true,
        feedback: "Clearance: Standard, soft chanting for short periods carries low systemic demand."
      },
      {
        text: "Intensive practice / pregnancy / illness is present, but I have cleared it with a qualified teacher/physician.",
        isSafe: true,
        feedback: "Clearance: Specialist supervision ensures physical and nervous safety during heavy practice."
      },
      {
        text: "Intensive practice / pregnancy / illness is present, but I have NOT consulted a teacher or physician.",
        isSafe: false,
        feedback: "Warning: Intensive breath-linked or high-repetition japa when pregnant or ill can tax the nervous system and is contraindicated without expert oversight."
      }
    ]
  }
];

export function MantraSafetyChecklist() {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, number>>({});
  const [showReport, setShowReport] = useState<boolean>(false);

  const triggerVibration = (pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (err) {}
    }
  };

  const handleSelectOption = (optionIdx: number) => {
    triggerVibration(40);
    setSelectedChoices(prev => ({ ...prev, [currentStepIdx]: optionIdx }));
  };

  const handleNext = () => {
    if (currentStepIdx < STEPS.length - 1) {
      triggerVibration(50);
      setCurrentStepIdx(prev => prev + 1);
    } else {
      const warnings = Object.keys(selectedChoices).reduce((acc, stepId) => {
        const sId = Number(stepId);
        const optId = selectedChoices[sId];
        const option = STEPS[sId].options[optId];
        return option && !option.isSafe ? acc + 1 : acc;
      }, 0);
      
      if (warnings > 0) {
        triggerVibration([100, 50]);
      } else {
        triggerVibration(80);
      }
      setShowReport(true);
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      triggerVibration(50);
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const resetAuditor = () => {
    triggerVibration(80);
    setSelectedChoices({});
    setCurrentStepIdx(0);
    setShowReport(false);
  };

  const activeStep = STEPS[currentStepIdx];
  const selectedOptionIdx = selectedChoices[currentStepIdx];

  // Calculate flags
  const flaggedCount = Object.keys(selectedChoices).reduce((acc, stepId) => {
    const sId = Number(stepId);
    const optId = selectedChoices[sId];
    const option = STEPS[sId].options[optId];
    return option && !option.isSafe ? acc + 1 : acc;
  }, 0);

  const isCurrentStepAnswered = selectedOptionIdx !== undefined;

  // Determine path coloring for the flowchart
  const getFlowSegmentColor = (stepIdx: number) => {
    const choice = selectedChoices[stepIdx];
    if (choice === undefined) return "rgba(0,0,0,0.1)"; // uncompleted
    const option = STEPS[stepIdx].options[choice];
    return option.isSafe ? "#4e7037" : "#ad4b37"; // green for safe, red for contraindication
  };

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <style>{`
        .checklist-option-btn {
          border: 1.5px solid rgba(156, 122, 47, 0.15);
          background: rgba(255, 255, 255, 0.55);
          transition: all 0.2s ease-in-out;
        }
        .checklist-option-btn:hover:not(:disabled) {
          border-color: ${GOLD};
          background: rgba(251,248,243,0.7);
        }
      `}</style>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", borderBottom: "1px solid rgba(156,122,47,0.1)", paddingBottom: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Mantra Practice Safety Auditor
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Audit mantra practices step-by-step for safety, rules compliance, and medical cautions.
          </p>
        </div>
      </div>

      {/* INTERACTIVE FLOWCHART DECISION TREE SVG */}
      <div style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "12px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, paddingLeft: "4px" }}>
          Interactive Safety Flowchart Path
        </span>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width="280" height="60" viewBox="0 0 280 60" style={{ display: "block" }}>
            {/* Flowchart lines */}
            <line x1="40" y1="30" x2="105" y2="30" stroke={getFlowSegmentColor(0)} strokeWidth="3" style={{ transition: "stroke 0.4s ease" }} />
            <line x1="105" y1="30" x2="175" y2="30" stroke={getFlowSegmentColor(1)} strokeWidth="3" style={{ transition: "stroke 0.4s ease" }} />
            <line x1="175" y1="30" x2="240" y2="30" stroke={getFlowSegmentColor(2)} strokeWidth="3" style={{ transition: "stroke 0.4s ease" }} />

            {/* Step 1 Node */}
            <circle cx="40" cy="30" r="10" fill={selectedChoices[0] !== undefined ? getFlowSegmentColor(0) : "#ffffff"} stroke={currentStepIdx === 0 ? GOLD : "rgba(156,122,47,0.3)"} strokeWidth="2" style={{ transition: "all 0.3s ease" }} />
            <text x="40" y="33" textAnchor="middle" style={{ fontSize: "9px", fontWeight: 900, fill: selectedChoices[0] !== undefined ? "#ffffff" : INK_SECONDARY }}>1</text>
            
            {/* Step 2 Node */}
            <circle cx="105" cy="30" r="10" fill={selectedChoices[1] !== undefined ? getFlowSegmentColor(1) : "#ffffff"} stroke={currentStepIdx === 1 ? GOLD : "rgba(156,122,47,0.3)"} strokeWidth="2" style={{ transition: "all 0.3s ease" }} />
            <text x="105" y="33" textAnchor="middle" style={{ fontSize: "9px", fontWeight: 900, fill: selectedChoices[1] !== undefined ? "#ffffff" : INK_SECONDARY }}>2</text>

            {/* Step 3 Node */}
            <circle cx="175" cy="30" r="10" fill={selectedChoices[2] !== undefined ? getFlowSegmentColor(2) : "#ffffff"} stroke={currentStepIdx === 2 ? GOLD : "rgba(156,122,47,0.3)"} strokeWidth="2" style={{ transition: "all 0.3s ease" }} />
            <text x="175" y="33" textAnchor="middle" style={{ fontSize: "9px", fontWeight: 900, fill: selectedChoices[2] !== undefined ? "#ffffff" : INK_SECONDARY }}>3</text>

            {/* Step 4 Node */}
            <circle cx="240" cy="30" r="10" fill={selectedChoices[3] !== undefined ? getFlowSegmentColor(3) : "#ffffff"} stroke={currentStepIdx === 3 ? GOLD : "rgba(156,122,47,0.3)"} strokeWidth="2" style={{ transition: "all 0.3s ease" }} />
            <text x="240" y="33" textAnchor="middle" style={{ fontSize: "9px", fontWeight: 900, fill: selectedChoices[3] !== undefined ? "#ffffff" : INK_SECONDARY }}>4</text>
          </svg>
        </div>
      </div>

      {!showReport ? (
        /* WIZARD INTERFACE */
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          {/* QUESTION BOX */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1.5px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
            <span style={{ fontSize: "9.5px", textTransform: "uppercase", fontWeight: 800, color: GOLD_DEEP }}>
              Audit Check {activeStep.id}: {activeStep.title}
            </span>
            <h4 style={{ margin: "6px 0 0 0", fontSize: "13.5px", fontWeight: 800, color: INK_PRIMARY, lineHeight: "1.4" }}>
              {activeStep.question}
            </h4>
          </div>

          {/* OPTIONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {activeStep.options.map((option, optIdx) => {
              const isChosen = selectedOptionIdx === optIdx;
              let borderStyle = isChosen ? `1.5px solid ${GOLD}` : "1px solid rgba(156, 122, 47, 0.15)";
              let bg = isChosen ? "rgba(251, 248, 243, 0.95)" : "rgba(255, 255, 255, 0.55)";
              let shadow = isChosen ? "0 2px 6px rgba(156, 122, 47, 0.08)" : "none";

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className="checklist-option-btn"
                  style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    textAlign: "left",
                    color: INK_PRIMARY,
                    fontSize: "11.5px",
                    fontWeight: isChosen ? 750 : "normal",
                    cursor: "pointer",
                    boxShadow: shadow,
                    border: borderStyle,
                    background: bg,
                    lineHeight: "1.4"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: `1.5px solid ${isChosen ? GOLD : INK_MUTED}`,
                      background: isChosen ? GOLD : "transparent",
                      flexShrink: 0
                    }} />
                    <span>{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* WIZARD NAVIGATION FOOTER */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <button
              onClick={handleBack}
              disabled={currentStepIdx === 0}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid rgba(156, 122, 47, 0.15)",
                background: "transparent",
                color: currentStepIdx === 0 ? INK_MUTED : INK_SECONDARY,
                fontSize: "11px",
                fontWeight: 750,
                cursor: currentStepIdx === 0 ? "not-allowed" : "pointer",
                opacity: currentStepIdx === 0 ? 0.4 : 1
              }}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isCurrentStepAnswered}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "8px 20px",
                borderRadius: "6px",
                border: "none",
                background: isCurrentStepAnswered ? GOLD : "rgba(156,122,47,0.12)",
                color: isCurrentStepAnswered ? "#ffffff" : INK_MUTED,
                fontSize: "11px",
                fontWeight: 750,
                cursor: isCurrentStepAnswered ? "pointer" : "not-allowed",
                transition: "all 0.2s"
              }}
            >
              {currentStepIdx === STEPS.length - 1 ? "Audit Complete" : "Next Check"}
              <ChevronRight size={12} />
            </button>
          </div>

        </div>
      ) : (
        /* SUITABILITY REPORT DISPLAY */
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          {/* GENERAL RATING BADGE */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px",
            borderRadius: "12px",
            background: flaggedCount > 0 ? "rgba(173, 75, 55, 0.06)" : "rgba(78, 112, 55, 0.06)",
            border: flaggedCount > 0 ? "1px solid rgba(173, 75, 55, 0.25)" : "1px solid rgba(78, 112, 55, 0.25)"
          }}>
            {flaggedCount > 0 ? (
              <ShieldAlert size={36} style={{ color: "#ad4b37", flexShrink: 0 }} />
            ) : (
              <ShieldCheck size={36} style={{ color: "#4e7037", flexShrink: 0 }} />
            )}
            <div>
              <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 850, color: flaggedCount > 0 ? "#762e21" : "#344e24" }}>
                Practice Audit: {flaggedCount > 0 ? `${flaggedCount} Caution Flags Raised` : "Fully Cleared & Compliant"}
              </h4>
              <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: flaggedCount > 0 ? "#762e21" : "#344e24", lineHeight: "1.35" }}>
                {flaggedCount > 0 
                  ? "Warnings exist around pronunciation accuracy, initiation gates, timing discipline, or medical checks. Recommend adjustments before continuing."
                  : "All checklist conditions conform to classical Mantra-śāstra safety guidelines. The practice outline is clean and safe."
                }
              </p>
            </div>
          </div>

          {/* CHECKLIST STEPS FEEDBACK LIST */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {STEPS.map((step, idx) => {
              const chosenOptIdx = selectedChoices[idx];
              const option = step.options[chosenOptIdx];
              
              if (!option) return null;
              
              return (
                <div
                  key={step.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    border: "1px solid rgba(156, 122, 47, 0.12)",
                    borderRadius: "10px",
                    padding: "12px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px"
                  }}
                >
                  <div style={{ marginTop: "2px" }}>
                    {option.isSafe ? (
                      <CheckCircle size={14} style={{ color: "#4e7037" }} />
                    ) : (
                      <AlertTriangle size={14} style={{ color: "#ad4b37" }} />
                    )}
                  </div>
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD, textTransform: "uppercase" }}>
                      Check {step.id}: {step.title}
                    </span>
                    <p style={{ margin: "4px 0 0 0", fontSize: "11px", fontWeight: 750, color: INK_PRIMARY }}>
                      Selected: "{option.text}"
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "10.5px", color: INK_SECONDARY, lineHeight: "1.3" }}>
                      {option.feedback}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DOJO DISCIPLINE REMINDER */}
          <div style={{
            background: SURFACE_MANUSCRIPT,
            border: "1px dashed rgba(156, 122, 47, 0.25)",
            borderRadius: "10px",
            padding: "12px",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px"
          }}>
            <HeartPulse size={16} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
            <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
              <strong>Referral Guideline:</strong> For any client planning intensive mantra practice (like repeated daily japa lists, breath-linked pranayama mantras), refer them to a qualified guru/lineage teacher. Ensure they consult a physician if dealing with illness, surgery, or pregnancy.
            </p>
          </div>

          {/* Reset button */}
          <button
            onClick={resetAuditor}
            style={{
              alignSelf: "center",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background: GOLD_DEEP,
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: 750,
              cursor: "pointer",
              marginTop: "8px"
            }}
          >
            <RefreshCw size={12} /> Audit Another Practice Profile
          </button>

        </div>
      )}

      {/* FOOTER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(156,122,47,0.08)", paddingTop: "8px", fontSize: "10px", color: INK_MUTED }}>
        <span>Grahvani Learning Runtime (Chapter 2)</span>
        <span>Safety Checklist Wizard</span>
      </div>
    </div>
  );
}
