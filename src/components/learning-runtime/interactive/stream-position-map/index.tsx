"use client";

import { useState } from "react";
import { Compass, CheckCircle2, AlertTriangle, Eye, HelpCircle, RefreshCw } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

const ALTERNATIVE_EXPLANATIONS = [
  { title: "Sage Authorship (Tradition-internal)", desc: "The ancient Maharṣis saw the soul's destiny using divine vision (*divya-cakṣus*) and pre-recorded it." },
  { title: "Cold Reading / Verbal Fishing", desc: "The reader gathers information from the client's verbal/non-verbal reactions during the matching query." },
  { title: "Prior Research / Registration", desc: "Biographical details are collected via booking procedures, prior visits, or community contexts." },
  { title: "Astronomical Logic Match", desc: "Expert deduction using planetary matching, birth-data calculations, and shared lineage databases." }
];

interface VerificationScenario {
  id: string;
  title: string;
  question: string;
  choices: {
    text: string;
    type: "scoffing" | "mystification" | "balanced";
    feedback: string;
  }[];
}

const VERIFICATION_SCENARIOS: VerificationScenario[] = [
  {
    id: "v1",
    title: "Scenario 1: The Father's Profession Hit",
    question: "A client says: 'The palm-leaf reader correctly stated my father's exact profession on the first try. This high accuracy proves scientifically that Sage Agastya wrote this leaf 5,000 years ago.' How do you respond?",
    choices: [
      {
        text: "Agree. A precise prediction hit is absolute verification of the tradition's sage-authorship claim.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. A precise hit (Layer A fact) does not verify the historical authorship claim (Layer B). Alternative explanations (cold reading, birth configurations, databases) remain possible."
      },
      {
        text: "Explain that a precise hit is documented practice (Layer A), but does not verify the sage-authorship claim (Layer B). We must hold the hit honestly while remembering that the mechanism remains unverified (Layer C).",
        type: "balanced",
        feedback: "Correct! This is Balanced Holding, separating Layer A hits from Layer B claims and Layer C proof status."
      },
      {
        text: "Dismiss the hit as lucky guessing, stating that the reader probably just checked their identity documents beforehand.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It assumes fraud without evidence instead of maintaining the disciplined holding."
      }
    ]
  },
  {
    id: "v2",
    title: "Scenario 2: Double-Blind Constraints",
    question: "A client asks: 'Why can't academic researchers set up a simple double-blind trial to verify palm-leaf accuracy once and for all?' How do you explain the constraint?",
    choices: [
      {
        text: "Sages designed the leaves to dissolve or become invisible if subjected to secular testing.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. It invents supernatural reasons instead of explaining structural retrieval constraints."
      },
      {
        text: "Because palm-leaf traditions are lookup-only retrieval systems from private collections, lacking a public re-derivable rulebook. A double-blind test is structurally difficult because the retrieval process itself is lineage-held.",
        type: "balanced",
        feedback: "Correct! The retrieval process is lineage-held and lookup-based, making standard re-derivable testing structures difficult to apply."
      },
      {
        text: "Because all readers are frauds and they know they would fail any scientific test.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It generalizes fraud rather than analyzing the structural constraints of static retrieval."
      }
    ]
  }
];

export function StreamPositionMap() {
  const [activeTab, setActiveTab] = useState<"paradigm" | "sorter">("paradigm");
  const [derivMode, setDerivMode] = useState<"computed" | "located">("computed");
  const [verificationToggle, setVerificationToggle] = useState<boolean>(false);

  // Dojo State
  const [verificationIdx, setVerificationIdx] = useState<number>(0);
  const [selectedVerificationChoice, setSelectedVerificationChoice] = useState<number | null>(null);
  const [showVerificationFeedback, setShowVerificationFeedback] = useState<boolean>(false);

  const resetDojo = () => {
    setSelectedVerificationChoice(null);
    setVerificationIdx(0);
    setShowVerificationFeedback(false);
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
      data-interactive="stream-position-map"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 20 — Chapter 1 — Lesson 4
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Calculative vs Retrieval Positioning Map
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Compare derivation and verification paradigms (calculated vs located), and sort a precise testimony to view alternative explanations.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1.5px solid rgba(156,122,47,0.1)" }}>
        <button
          onClick={() => setActiveTab("paradigm")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "none",
            background: activeTab === "paradigm" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "paradigm" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "paradigm" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "paradigm" ? 700 : 500,
            borderRadius: "6px 6px 0 0"
          }}
        >
          <Compass size={16} />
          Paradigm Pathways Comparison
        </button>
        <button
          onClick={() => setActiveTab("sorter")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "none",
            background: activeTab === "sorter" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "sorter" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "sorter" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "sorter" ? 700 : 500,
            borderRadius: "6px 6px 0 0"
          }}
        >
          <Eye size={16} />
          Testimony Sorter & Explanations
        </button>
      </div>

      {activeTab === "paradigm" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
          {/* Left: SVG Diagram showing Calc vs Retrieval */}
          <div
            style={{
              background: "#FAF6EB",
              border: "1px solid rgba(156, 122, 47, 0.15)",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <svg viewBox="0 0 420 220" width="100%" height="auto">
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
                  id="arrow-green"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={GREEN} />
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

              {/* Group A: Computed Chart Streams */}
              {derivMode === "computed" && (
                <g>
                  <rect x="20" y="20" width="380" height="180" rx="8" fill="#fff" stroke="#D1C2A5" strokeWidth="1.5" />
                  <text x="210" y="45" textAnchor="middle" fill={GOLD_DEEP} fontWeight="bold" fontSize="13px">
                    5 Computed Chart-Based Streams
                  </text>
                  <text x="210" y="65" textAnchor="middle" fill={INK_MUTED} fontSize="11px">
                    Parāśari, KP, Jaimini, Lal Kitab, Tājika
                  </text>

                  {/* Flow blocks */}
                  <rect x="40" y="90" width="110" height="35" rx="4" fill="#FAF6EB" stroke={GOLD} strokeWidth="1" />
                  <text x="95" y="112" textAnchor="middle" fill={INK_PRIMARY} fontSize="10px" fontWeight="bold">
                    Birth Data
                  </text>

                  <rect x="270" y="90" width="110" height="35" rx="4" fill="#FAF6EB" stroke={GOLD} strokeWidth="1" />
                  <text x="325" y="112" textAnchor="middle" fill={INK_PRIMARY} fontSize="10px" fontWeight="bold">
                    Compute Chart
                  </text>

                  {/* Arrow */}
                  <line x1="150" y1="108" x2="264" y2="108" stroke={GOLD} strokeWidth="2" marker-end="url(#arrow-gold)" />

                  {/* Verification flow curve */}
                  <path
                    d="M 325,125 C 325,145 310,167.5 282,167.5"
                    fill="none"
                    stroke={verificationToggle ? GREEN : GOLD}
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    marker-end={verificationToggle ? "url(#arrow-green)" : "url(#arrow-gold)"}
                  />

                  {/* Verification box */}
                  <rect x="140" y="150" width="140" height="35" rx="4" fill={verificationToggle ? "rgba(47,125,85,0.06)" : "none"} stroke={verificationToggle ? GREEN : GOLD} strokeWidth="1.5" />
                  <text x="210" y="172" textAnchor="middle" fill={verificationToggle ? GREEN : INK_PRIMARY} fontSize="10px" fontWeight="bold">
                    {verificationToggle ? "✓ Peer-Rederivable" : "Verification Mode"}
                  </text>
                </g>
              )}

              {/* Group B: Located Nāḍī Stream */}
              {derivMode === "located" && (
                <g>
                  <rect x="20" y="20" width="380" height="180" rx="8" fill="#fff" stroke="#D1C2A5" strokeWidth="1.5" />
                  <text x="210" y="45" textAnchor="middle" fill={GOLD_DEEP} fontWeight="bold" fontSize="13px">
                    Nāḍī Stream Paradigm
                  </text>
                  <text x="210" y="65" textAnchor="middle" fill={INK_MUTED} fontSize="11px">
                    Private Manuscript Collections
                  </text>

                  {/* Flow blocks */}
                  <rect x="40" y="90" width="110" height="35" rx="4" fill="#FAF6EB" stroke={GOLD} strokeWidth="1" />
                  <text x="95" y="112" textAnchor="middle" fill={INK_PRIMARY} fontSize="10px" fontWeight="bold">
                    Thumbprint Key
                  </text>

                  <rect x="270" y="90" width="110" height="35" rx="4" fill="#FAF6EB" stroke={GOLD} strokeWidth="1" />
                  <text x="325" y="112" textAnchor="middle" fill={INK_PRIMARY} fontSize="10px" fontWeight="bold">
                    Locate Leaf File
                  </text>

                  {/* Arrow */}
                  <line x1="150" y1="108" x2="264" y2="108" stroke={GOLD} strokeWidth="2" marker-end="url(#arrow-gold)" />

                  {/* Verification flow curve */}
                  <path
                    d="M 325,125 C 325,145 310,167.5 282,167.5"
                    fill="none"
                    stroke={verificationToggle ? RED : GOLD}
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    marker-end={verificationToggle ? "url(#arrow-red)" : "url(#arrow-gold)"}
                  />

                  {/* Verification box */}
                  <rect x="140" y="150" width="140" height="35" rx="4" fill={verificationToggle ? "rgba(162,58,30,0.06)" : "none"} stroke={verificationToggle ? RED : GOLD} strokeWidth="1.5" />
                  <text x="210" y="172" textAnchor="middle" fill={verificationToggle ? RED : INK_PRIMARY} fontSize="10px" fontWeight="bold">
                    {verificationToggle ? "✗ Lookup-Only (Private)" : "Verification Mode"}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Right: Comparative toggles & explanatory card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                1. Compare Derivation Mode
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setDerivMode("computed")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: derivMode === "computed" ? GOLD : "rgba(156,122,47,0.08)",
                    color: derivMode === "computed" ? "#fff" : GOLD_DEEP,
                    border: "none",
                    fontWeight: 600,
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  5 Computed Streams
                </button>
                <button
                  onClick={() => setDerivMode("located")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: derivMode === "located" ? GOLD : "rgba(156,122,47,0.08)",
                    color: derivMode === "located" ? "#fff" : GOLD_DEEP,
                    border: "none",
                    fontWeight: 600,
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  1 Located Stream
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                2. Toggle Verification Mode
              </span>
              <button
                onClick={() => setVerificationToggle(!verificationToggle)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  background: "rgba(156,122,47,0.08)",
                  color: GOLD_DEEP,
                  border: `1.5px solid ${GOLD}`,
                  fontWeight: 600,
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                {verificationToggle ? "Hide Verification Mode" : "Show Verification Mode"}
              </button>
            </div>

            <div style={{ padding: "12px", borderRadius: "8px", background: "#fff", border: "1px solid rgba(156,122,47,0.15)", fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
              {derivMode === "computed"
                ? "Calculative Derivation: Predictions are computed from birth data using mathematical principles, enabling peer re-derivation."
                : "Static Retrieval: Predictions are located in private collections using thumbprints. Direct external verification of matches is unavailable."}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "300px" }}>
          <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                {VERIFICATION_SCENARIOS[verificationIdx].title}
              </span>
              <span style={{ fontSize: "11px", color: INK_MUTED }}>
                {verificationIdx + 1} of {VERIFICATION_SCENARIOS.length}
              </span>
            </div>

            <p style={{ fontSize: "14.5px", color: INK_PRIMARY, fontWeight: 600, margin: "0 0 20px" }}>
              {VERIFICATION_SCENARIOS[verificationIdx].question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {VERIFICATION_SCENARIOS[verificationIdx].choices.map((c, idx) => {
                const isSelected = selectedVerificationChoice === idx;
                let borderColor = "rgba(156, 122, 47, 0.25)";
                let bg = "#fff";
                if (showVerificationFeedback && isSelected) {
                  borderColor = c.type === "balanced" ? GREEN : RED;
                  bg = c.type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)";
                } else if (isSelected) {
                  borderColor = GOLD;
                  bg = "rgba(156,122,47,0.04)";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedVerificationChoice(idx);
                      setShowVerificationFeedback(true);
                    }}
                    style={{
                      textAlign: "left",
                      padding: "14px",
                      borderRadius: "8px",
                      border: `1.5px solid ${borderColor}`,
                      background: bg,
                      fontSize: "13.5px",
                      color: INK_PRIMARY,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px"
                    }}
                  >
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: `1.5px solid ${GOLD}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: "bold",
                        background: isSelected ? GOLD : "transparent",
                        color: isSelected ? "#fff" : GOLD,
                        flexShrink: 0,
                        marginTop: "1px"
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span style={{ lineHeight: "1.4" }}>{c.text}</span>
                  </button>
                );
              })}
            </div>

            {showVerificationFeedback && selectedVerificationChoice !== null && (
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: VERIFICATION_SCENARIOS[verificationIdx].choices[selectedVerificationChoice].type === "balanced" ? "rgba(47, 125, 85, 0.05)" : "rgba(162, 58, 30, 0.05)",
                    border: `1px solid ${VERIFICATION_SCENARIOS[verificationIdx].choices[selectedVerificationChoice].type === "balanced" ? GREEN : RED}`,
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start"
                  }}
                >
                  {VERIFICATION_SCENARIOS[verificationIdx].choices[selectedVerificationChoice].type === "balanced" ? (
                    <CheckCircle2 size={20} style={{ color: GREEN, flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle size={20} style={{ color: RED, flexShrink: 0 }} />
                  )}
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: VERIFICATION_SCENARIOS[verificationIdx].choices[selectedVerificationChoice].type === "balanced" ? GREEN : RED }}>
                      {VERIFICATION_SCENARIOS[verificationIdx].choices[selectedVerificationChoice].type === "balanced" ? "CORRECT DISCERNMENT" : "VERIFICATION WARNING"}
                    </h4>
                    <p style={{ margin: 0, fontSize: "13.5px", color: INK_PRIMARY, lineHeight: "1.45" }}>
                      {VERIFICATION_SCENARIOS[verificationIdx].choices[selectedVerificationChoice].feedback}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                  {verificationIdx < VERIFICATION_SCENARIOS.length - 1 ? (
                    <button
                      onClick={() => {
                        setShowVerificationFeedback(false);
                        setSelectedVerificationChoice(null);
                        setVerificationIdx((prev) => prev + 1);
                      }}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        background: GREEN,
                        color: "#fff",
                        border: "none",
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: "pointer"
                      }}
                    >
                      Next Scenario
                    </button>
                  ) : (
                    <button
                      onClick={resetDojo}
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
                        cursor: "pointer"
                      }}
                    >
                      <RefreshCw size={14} /> Reset Dojo
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
