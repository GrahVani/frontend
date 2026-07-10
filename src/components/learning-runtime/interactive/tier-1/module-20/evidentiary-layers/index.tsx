"use client";

import { useState } from "react";
import { Layers, HelpCircle, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

interface CardStatement {
  id: string;
  text: string;
  correctTarget: "A" | "B" | "C" | "scoffing" | "mystification";
  feedback: string;
}

const STATEMENTS: CardStatement[] = [
  {
    id: "s1",
    text: "The reader knew my mother's name, so it is proven that the sages wrote everything!",
    correctTarget: "mystification",
    feedback: "Correct! This statement commits Mystification. It collapses Layer B (the claim) and Layer C (verification status) by treating a single biographical match as total verification of the divine authorship claim."
  },
  {
    id: "s2",
    text: "There is no scientific validation of palm-leaf predictions, so the whole tradition is a fraud.",
    correctTarget: "scoffing",
    feedback: "Correct! This statement commits Scoffing. It denies Layer A (the documented existence of a living tradition and centuries of craft) simply because Layer C (verification) is unproven."
  },
  {
    id: "s3",
    text: "Vaitheeswarankoil is a documented active center where thousands consult readers annually.",
    correctTarget: "A",
    feedback: "Correct! This is a Layer A fact (Documented Practice). It refers to the physical consultations and ongoing craft, which are well-documented and undisputed."
  },
  {
    id: "s4",
    text: "The tradition claims that Maharṣis inscribed destinies on leaves through divine vision.",
    correctTarget: "B",
    feedback: "Correct! This is a Layer B statement (The Named Claim). It accurately identifies what the tradition says about itself as a claim, without smuggling it in as verified fact."
  },
  {
    id: "s5",
    text: "No peer-reviewed database check has validated the accuracy of the leaf readings.",
    correctTarget: "C",
    feedback: "Correct! This is a Layer C statement (Verification Status). It describes the honest verification status—the lack of scientific proof and the difficulty of obtaining it."
  }
];

export function EvidentiaryLayers() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [selections, setSelections] = useState<Record<string, "A" | "B" | "C" | "scoffing" | "mystification">>({});
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("");
  const [showHolding, setShowHolding] = useState<boolean>(false);

  const activeCard = STATEMENTS[activeIdx];
  const isFinished = Object.keys(selections).length === STATEMENTS.length;

  const handleClassify = (target: "A" | "B" | "C" | "scoffing" | "mystification") => {
    if (activeCard.correctTarget === target) {
      setSelections((prev) => ({ ...prev, [activeCard.id]: target }));
      setFeedback(activeCard.feedback);
      setFeedbackType("success");
    } else {
      setFeedbackType("error");
      if (target === "mystification") {
        setFeedback("Incorrect. Mystification collapses Layer B and C into one, claiming predictions are infallible.");
      } else if (target === "scoffing") {
        setFeedback("Incorrect. Scoffing denies Layer A, dismissing a centuries-old documented craft as complete fraud.");
      } else {
        setFeedback(`Incorrect. That is not where this statement fits. Try looking at the distinction between practice, claim, and proof.`);
      }
    }
  };

  const handleNextCard = () => {
    setFeedback("");
    setFeedbackType("");
    // Find next uncompleted card
    const nextIdx = STATEMENTS.findIndex((s) => !selections[s.id]);
    if (nextIdx !== -1) {
      setActiveIdx(nextIdx);
    } else {
      const firstUncompleted = STATEMENTS.findIndex((s) => !selections[s.id]);
      if (firstUncompleted !== -1) {
        setActiveIdx(firstUncompleted);
      }
    }
  };

  const resetGame = () => {
    setSelections({});
    setActiveIdx(0);
    setFeedback("");
    setFeedbackType("");
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.8)",
        border: "1px solid rgba(156, 122, 47, 0.25)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="evidentiary-layers"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 20 — Chapter 1 — Lesson 1
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Evidentiary Layers Mapping Conduit
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Interact with the map below to sort client statements into the correct evidentiary layers or traps.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", minHeight: "400px" }}>
        {/* Left: The Visual SVG Map */}
        <div
          style={{
            background: "#FAF6EB",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
              Evidentiary Conduit Map
            </span>
            <button
              onClick={() => setShowHolding(!showHolding)}
              style={{
                background: showHolding ? GOLD : "rgba(156,122,47,0.08)",
                color: showHolding ? "#fff" : GOLD_DEEP,
                border: "none",
                borderRadius: "4px",
                padding: "3px 8px",
                fontSize: "10.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s"
              }}
            >
              <ShieldCheck size={12} />
              {showHolding ? "Two-Layer Holding ON" : "Toggle Two-Layer Holding"}
            </button>
          </div>

          <svg viewBox="0 0 450 340" width="100%" height="auto">
            <defs>
              <marker
                id="arrow-gold"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={GOLD} />
              </marker>
              <marker
                id="arrow-red"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={RED} />
              </marker>
            </defs>

            {/* Traps at the top sides */}
            {/* Scoffing Node */}
            <g onClick={() => !isFinished && handleClassify("scoffing")} style={{ cursor: "pointer" }}>
              <rect
                x="15"
                y="15"
                width="120"
                height="65"
                rx="6"
                fill={selections[activeCard?.id] === "scoffing" ? "rgba(162,58,30,0.1)" : "#fff"}
                stroke={feedbackType === "error" && activeCard?.correctTarget === "scoffing" ? RED : "rgba(162,58,30,0.4)"}
                strokeWidth={feedbackType === "error" && activeCard?.correctTarget === "scoffing" ? 2 : 1.5}
                strokeDasharray={showHolding ? "3,3" : "none"}
              />
              <text x="75" y="38" textAnchor="middle" fill={RED} fontWeight="bold" fontSize="12px">
                Scoffing Trap
              </text>
              <text x="75" y="54" textAnchor="middle" fill={INK_SECONDARY} fontSize="9px">
                Denies Layer A
              </text>
              <circle cx="75" cy="70" r="4" fill={RED} />
            </g>

            {/* Mystification Node */}
            <g onClick={() => !isFinished && handleClassify("mystification")} style={{ cursor: "pointer" }}>
              <rect
                x="315"
                y="15"
                width="120"
                height="65"
                rx="6"
                fill={selections[activeCard?.id] === "mystification" ? "rgba(162,58,30,0.1)" : "#fff"}
                stroke={feedbackType === "error" && activeCard?.correctTarget === "mystification" ? RED : "rgba(162,58,30,0.4)"}
                strokeWidth={feedbackType === "error" && activeCard?.correctTarget === "mystification" ? 2 : 1.5}
                strokeDasharray={showHolding ? "3,3" : "none"}
              />
              <text x="375" y="38" textAnchor="middle" fill={RED} fontWeight="bold" fontSize="12px">
                Mystification Trap
              </text>
              <text x="375" y="54" textAnchor="middle" fill={INK_SECONDARY} fontSize="9px">
                Collapses B & C
              </text>
              <circle cx="375" cy="70" r="4" fill={RED} />
            </g>

            {/* Flow curves from Traps to Layers */}
            <path d="M 75,80 C 75,120 120,130 144,130" fill="none" stroke="rgba(162,58,30,0.4)" strokeWidth="1.5" strokeDasharray="3,3" marker-end="url(#arrow-red)" />
            <path d="M 375,80 C 375,180 320,190 306,190" fill="none" stroke="rgba(162,58,30,0.4)" strokeWidth="1.5" strokeDasharray="3,3" marker-end="url(#arrow-red)" />

            {/* Stack of the Three Layers in center */}
            {/* Layer A Node */}
            <g onClick={() => !isFinished && handleClassify("A")} style={{ cursor: "pointer" }}>
              <rect
                x="150"
                y="100"
                width="150"
                height="60"
                rx="6"
                fill={Object.values(selections).includes("A") ? "rgba(47,125,85,0.08)" : "#fff"}
                stroke={GOLD}
                strokeWidth={1.5}
              />
              <text x="225" y="125" textAnchor="middle" fill={INK_PRIMARY} fontWeight="bold" fontSize="11px">
                Layer A: Documented
              </text>
              <text x="225" y="142" textAnchor="middle" fill={INK_SECONDARY} fontSize="9px">
                Consultations, Texts, Craft
              </text>
            </g>

            {/* Layer B Node */}
            <g onClick={() => !isFinished && handleClassify("B")} style={{ cursor: "pointer" }}>
              <rect
                x="150"
                y="175"
                width="150"
                height="60"
                rx="6"
                fill={Object.values(selections).includes("B") ? "rgba(47,125,85,0.08)" : "#fff"}
                stroke={GOLD}
                strokeWidth={1.5}
              />
              <text x="225" y="200" textAnchor="middle" fill={INK_PRIMARY} fontWeight="bold" fontSize="11px">
                Layer B: Sages Claim
              </text>
              <text x="225" y="217" textAnchor="middle" fill={INK_SECONDARY} fontSize="9px">
                Maharṣi Individual Inscriptions
              </text>
            </g>

            {/* Layer C Node */}
            <g onClick={() => !isFinished && handleClassify("C")} style={{ cursor: "pointer" }}>
              <rect
                x="150"
                y="250"
                width="150"
                height="60"
                rx="6"
                fill={Object.values(selections).includes("C") ? "rgba(47,125,85,0.08)" : "#fff"}
                stroke={GOLD}
                strokeWidth={1.5}
              />
              <text x="225" y="275" textAnchor="middle" fill={INK_PRIMARY} fontWeight="bold" fontSize="11px">
                Layer C: Proof Status
              </text>
              <text x="225" y="292" textAnchor="middle" fill={INK_SECONDARY} fontSize="9px">
                Unverified / Lineage-Held
              </text>
            </g>

            {/* Center connector pipeline */}
            <line x1="225" y1="160" x2="225" y2="172" stroke={GOLD} strokeWidth="2" marker-end="url(#arrow-gold)" />
            <line x1="225" y1="235" x2="225" y2="247" stroke={GOLD} strokeWidth="2" marker-end="url(#arrow-gold)" />

            {/* Two Layer Holding Bracket visual */}
            {showHolding && (
              <path
                d="M 135,100 L 125,100 L 125,205 L 135,205"
                fill="none"
                stroke={GREEN}
                strokeWidth="2.5"
                className="animated-pulse"
              />
            )}
            {showHolding && (
              <text x="110" y="155" textAnchor="middle" fill={GREEN} fontSize="9px" fontWeight="bold" transform="rotate(-90 110 155)">
                PRESERVE CRAFT
              </text>
            )}
          </svg>
        </div>

        {/* Right: Testimonies Deck & Interactive controls */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {!isFinished ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Card display */}
              <div
                style={{
                  background: "#fff",
                  border: `2px solid ${GOLD}`,
                  borderRadius: "10px",
                  padding: "20px",
                  boxShadow: "0 4px 16px rgba(156,122,47,0.06)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>
                    ACTIVE TESTIMONY
                  </span>
                  <span style={{ fontSize: "11px", color: INK_MUTED }}>
                    {activeIdx + 1} of {STATEMENTS.length}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "14.5px", lineHeight: "1.5", fontWeight: 500, color: INK_PRIMARY }}>
                  "{activeCard.text}"
                </p>
              </div>

              {/* Action instructions */}
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <HelpCircle size={16} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
                <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                  <em>How to play:</em> Click on the correct layer or trap on the map to classify this testimony. Correct sorting lights up the node.
                </p>
              </div>

              {/* Feedback box */}
              {feedback && (
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "8px",
                    background: feedbackType === "success" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)",
                    border: `1px solid ${feedbackType === "success" ? GREEN : RED}`,
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start"
                  }}
                >
                  {feedbackType === "success" ? (
                    <CheckCircle2 size={18} style={{ color: GREEN, flexShrink: 0, marginTop: "2px" }} />
                  ) : (
                    <AlertTriangle size={18} style={{ color: RED, flexShrink: 0, marginTop: "2px" }} />
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: 700, color: feedbackType === "success" ? GREEN : RED }}>
                      {feedbackType === "success" ? "CORRECT CLASSIFICATION" : "MAPPING MISALIGNMENT"}
                    </span>
                    <p style={{ margin: 0, fontSize: "13px", color: INK_PRIMARY, lineHeight: "1.4" }}>
                      {feedback}
                    </p>
                    {feedbackType === "success" && (
                      <button
                        onClick={handleNextCard}
                        style={{
                          alignSelf: "flex-start",
                          marginTop: "6px",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          background: GREEN,
                          color: "#fff",
                          border: "none",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Next Statement
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                background: "rgba(47,125,85,0.06)",
                border: `1.5px solid ${GREEN}`,
                borderRadius: "10px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              <CheckCircle2 size={40} style={{ color: GREEN }} />
              <h4 style={{ margin: 0, color: GREEN, fontSize: "18px", fontWeight: 700 }}>
                Epistemic Alignment Mastered!
              </h4>
              <p style={{ margin: 0, fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.45" }}>
                You have successfully mapped all statements to their corresponding layers and traps, maintaining two-layer holding and separating claims from verified facts.
              </p>
              <button
                onClick={resetGame}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  background: GREEN,
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  marginTop: "8px"
                }}
              >
                <RefreshCw size={14} />
                Reset Mapping Dojo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
