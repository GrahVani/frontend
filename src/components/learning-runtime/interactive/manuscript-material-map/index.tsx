"use client";

import { useState } from "react";
import { Compass, CheckCircle2, AlertTriangle, HelpCircle, RefreshCw } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

interface ElementData {
  id: string;
  name: string;
  sanskrit: string;
  expectedType: "shared" | "distinctive";
  description: string;
  x: number;
  y: number;
}

const ELEMENTS: ElementData[] = [
  {
    id: "leaf",
    name: "Palm-Leaf Material",
    sanskrit: "Tāḍapatra",
    expectedType: "shared",
    description: "Prepared palm-leaf strips dried and treated to hold text. Used for thousands of classical, mathematical, and astronomical texts across India.",
    x: 100,
    y: 60
  },
  {
    id: "stylus",
    name: "Iron Stylus",
    sanskrit: "Eḻuttāṇi",
    expectedType: "shared",
    description: "An iron needle used to incise characters into the dried palm-leaf, which are then stained with charcoal and oil to make the writing visible.",
    x: 280,
    y: 80
  },
  {
    id: "script",
    name: "Grantha / Old-Tamil Script",
    sanskrit: "Lipi",
    expectedType: "shared",
    description: "The classical scripts used to write Tamil and Sanskrit in the south. The characters are curved to avoid tearing the leaf along horizontal fibers.",
    x: 440,
    y: 55
  },
  {
    id: "thumbprint",
    name: "Thumbprint Schema",
    sanskrit: "Rekhā / Aṅguṣṭha",
    expectedType: "distinctive",
    description: "The categorisation scheme mapping thumbprint ridges (134 types) to leaf bundles. This indexing schema is distinctive to the Tamil leaf-reading traditions.",
    x: 640,
    y: 60
  },
  {
    id: "bundle",
    name: "Hereditary Family Collection",
    sanskrit: "Grantha Samūha",
    expectedType: "distinctive",
    description: "Private collections held by hereditary practitioner lineages, inaccessible publicly and transmitted via gurukula apprenticeship.",
    x: 780,
    y: 70
  }
];

interface FallacyScenario {
  id: string;
  title: string;
  question: string;
  choices: {
    text: string;
    type: "scoffing" | "mystification" | "balanced";
    feedback: string;
  }[];
}

const FALLACY_SCENARIOS: FallacyScenario[] = [
  {
    id: "f1",
    title: "Scenario 1: The Antiquity Trap",
    question: "A client holds up a dark, turmeric-stained palm-leaf manuscript and says: 'Look at how blackened the edges are and how ancient the script looks. This physical age is absolute proof that Sage Agastya wrote these exact letters himself thousands of years ago.' How do you guide them?",
    choices: [
      {
        text: "Agree with the client. The physical decay and turmeric treatment directly verify the ancient sage authorship claim.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. Physical antiquity of a medium represents continuous preservation craft (Layer A), but does not verify the claim of sage authorship (Layer B)."
      },
      {
        text: "Point out that turmeric preservation is a standard material craft (Layer A), but physical age does not prove direct sage authorship (Layer B). We must hold both ideas honestly.",
        type: "balanced",
        feedback: "Correct! This is Balanced Holding. Antiquity of the medium is a Layer A fact, but authorship remains an open claim (Layer B) with no external verification (Layer C)."
      },
      {
        text: "Dismiss the leaf as a fake, stating that readers probably just stained the leaf with tea to make it look old.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. Generalizing all artifacts as deliberate fakes ignores the documented material footprint of palm-leaf archiving (Layer A)."
      }
    ]
  },
  {
    id: "f2",
    title: "Scenario 2: The Longevity Dilemma",
    question: "A practitioner tells you: 'These palm-leaf bundles have survived weather, wars, and custody in my family's private library for nine generations. This survival proves that the predictions are verified.' What is the correct response?",
    choices: [
      {
        text: "Agree. Nine generations of continuous heritage is living proof that the predictions inside are validated.",
        type: "mystification",
        feedback: "Incorrect. This collapses Layer A and Layer C. Lineage transmission is a Layer A fact of heritage preservation, not objective verification of predictive accuracy (Layer C)."
      },
      {
        text: "Lineage survival simply means the library has been preserved. It represents continuous practice and trust (Layer A), but is not peer-reviewed scientific verification (Layer C).",
        type: "balanced",
        feedback: "Correct! Longevity of practice is a Layer A fact, but verification remains open (Layer C)."
      },
      {
        text: "Tell the practitioner that family inheritance claims are completely unproven, so the library is likely just a set of random scrolls.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It denies the genuine historical custody of manuscript libraries simply because of validation limits."
      }
    ]
  }
];

export function ManuscriptMaterialMap() {
  const [activeTab, setActiveTab] = useState<"classify" | "fallacies">("classify");
  const [selectedElement, setSelectedElement] = useState<string>("leaf");
  const [classifications, setClassifications] = useState<Record<string, "shared" | "distinctive">>({});
  const [classifyFeedback, setClassifyFeedback] = useState<string>("");

  // Fallacy Dojo State
  const [fallacyIdx, setFallacyIdx] = useState<number>(0);
  const [selectedFallacyChoice, setSelectedFallacyChoice] = useState<number | null>(null);
  const [showFallacyFeedback, setShowFallacyFeedback] = useState<boolean>(false);

  const activeElement = ELEMENTS.find((e) => e.id === selectedElement) || ELEMENTS[0];

  const handleClassify = (type: "shared" | "distinctive") => {
    if (activeElement.expectedType === type) {
      setClassifications((prev) => ({ ...prev, [activeElement.id]: type }));
      setClassifyFeedback(`Correct! ${activeElement.name} is indeed ${type === "shared" ? "shared with classical Indian manuscript tradition" : "distinctive to Nāḍī"}.`);
    } else {
      setClassifyFeedback(`Incorrect. Think about whether this element is used across all Sanskrit/Indian classical manuscripts or only for Nāḍī.`);
    }
  };

  const resetAll = () => {
    setClassifications({});
    setClassifyFeedback("");
    setSelectedFallacyChoice(null);
    setFallacyIdx(0);
    setShowFallacyFeedback(false);
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
      data-interactive="manuscript-material-map"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 20 — Chapter 1 — Lesson 2
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Manuscript Material Classifier & Fallacy Dojo
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Tag physical manuscript features as shared vs distinctive, and run fallacy checks on age and survival claims.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1.5px solid rgba(156,122,47,0.1)" }}>
        <button
          onClick={() => setActiveTab("classify")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "none",
            background: activeTab === "classify" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "classify" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "classify" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "classify" ? 700 : 500,
            borderRadius: "6px 6px 0 0"
          }}
        >
          <Compass size={16} />
          Tag Shared vs Distinctive Elements
        </button>
        <button
          onClick={() => setActiveTab("fallacies")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "none",
            background: activeTab === "fallacies" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "fallacies" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "fallacies" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "fallacies" ? 700 : 500,
            borderRadius: "6px 6px 0 0"
          }}
        >
          <HelpCircle size={16} />
          Material Fallacy Checker
        </button>
      </div>

      {/* Interactive SVG drawing at top of both tabs */}
      <div
        style={{
          width: "100%",
          background: "#FAF6EB",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative"
        }}
      >
        <svg viewBox="0 0 900 150" width="100%" height="auto">
          <defs>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DFD2B7" />
              <stop offset="50%" stopColor="#EADEC6" />
              <stop offset="100%" stopColor="#DFD2B7" />
            </linearGradient>
          </defs>
          <rect x="30" y="30" width="840" height="80" rx="10" fill="url(#leafGrad)" stroke="#B59E74" strokeWidth="2.5" />
          <circle cx="450" cy="70" r="8" fill="#FAF6EB" stroke="#B59E74" strokeWidth="2" />
          <path d="M 50,50 Q 80,48 110,50 T 170,50 T 230,50 T 290,50 T 350,50" fill="none" stroke="#6B593C" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.75" />
          <path d="M 490,50 Q 520,48 550,50 T 610,50 T 670,50 T 730,50 T 790,50" fill="none" stroke="#6B593C" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.75" />

          {ELEMENTS.map((elem) => {
            const isSelected = selectedElement === elem.id;
            const isClassified = classifications[elem.id];
            return (
              <g key={elem.id} onClick={() => setSelectedElement(elem.id)} style={{ cursor: "pointer" }}>
                <circle
                  cx={elem.x}
                  cy={elem.y}
                  r="16"
                  fill={isSelected ? GOLD : isClassified ? "rgba(47,125,85,0.8)" : "#fff"}
                  stroke={GOLD}
                  strokeWidth="2.5"
                />
                <circle cx={elem.x} cy={elem.y} r="22" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray={isSelected ? "none" : "3,3"} opacity={isSelected ? 0.8 : 0.4} />
                <text x={elem.x} y={elem.y + 4} textAnchor="middle" fill={isSelected ? "#fff" : GOLD_DEEP} fontSize="10px" fontWeight="bold">
                  {isClassified ? "✓" : elem.id === "leaf" ? "1" : elem.id === "stylus" ? "2" : elem.id === "script" ? "3" : elem.id === "thumbprint" ? "4" : "5"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {activeTab === "classify" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
          {/* Active Element Info */}
          <div style={{ padding: "20px", borderRadius: "10px", background: "#fff", border: "1px solid rgba(156,122,47,0.15)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>SELECTED MANUSCRIPT REGION</span>
            <h4 style={{ margin: "4px 0 2px", color: INK_PRIMARY, fontSize: "16px", fontWeight: 700 }}>
              {activeElement.name}
            </h4>
            <span style={{ fontSize: "12px", fontStyle: "italic", color: INK_MUTED, display: "block", marginBottom: "12px" }}>
              Sanskrit: {activeElement.sanskrit}
            </span>
            <p style={{ margin: "0 0 16px", fontSize: "13.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
              {activeElement.description}
            </p>

            {/* Classification Buttons */}
            {!classifications[activeElement.id] ? (
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => handleClassify("shared")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: "rgba(47,125,85,0.08)",
                    color: GREEN,
                    border: `1.5px solid ${GREEN}`,
                    fontWeight: 600,
                    fontSize: "12.5px",
                    cursor: "pointer"
                  }}
                >
                  Shared Material Craft
                </button>
                <button
                  onClick={() => handleClassify("distinctive")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: "rgba(217,119,6,0.08)",
                    color: AMBER,
                    border: `1.5px solid ${AMBER}`,
                    fontWeight: 600,
                    fontSize: "12.5px",
                    cursor: "pointer"
                  }}
                >
                  Distinctive Nāḍī Schema
                </button>
              </div>
            ) : (
              <div style={{ padding: "8px 12px", borderRadius: "6px", background: "rgba(47,125,85,0.1)", color: GREEN, fontWeight: 700, fontSize: "13px", textAlign: "center" }}>
                Classified: {activeElement.expectedType === "shared" ? "Shared Craft" : "Distinctive Schema"}
              </div>
            )}
          </div>

          {/* Tagging Progress and feedback */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                Classification Status
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                {ELEMENTS.map((el) => (
                  <div
                    key={el.id}
                    style={{
                      height: "6px",
                      borderRadius: "3px",
                      background: classifications[el.id] ? GREEN : "rgba(156,122,47,0.15)"
                    }}
                  />
                ))}
              </div>
              <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: 0 }}>
                {Object.keys(classifications).length} of {ELEMENTS.length} elements tagged. Remember: most material elements are *shared* with all manuscript traditions.
              </p>

              {classifyFeedback && (
                <div style={{ padding: "12px", borderRadius: "8px", background: classifyFeedback.includes("Correct") ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)", border: `1px solid ${classifyFeedback.includes("Correct") ? GREEN : RED}`, fontSize: "13px", color: INK_PRIMARY }}>
                  {classifyFeedback}
                </div>
              )}
            </div>

            {Object.keys(classifications).length === ELEMENTS.length && (
              <button
                onClick={resetAll}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  background: GREEN,
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                <RefreshCw size={14} />
                Reset Classifier
              </button>
            )}
        </div>
      </div>
    ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "300px" }}>
          <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                {FALLACY_SCENARIOS[fallacyIdx].title}
              </span>
              <span style={{ fontSize: "11px", color: INK_MUTED }}>
                {fallacyIdx + 1} of {FALLACY_SCENARIOS.length}
              </span>
            </div>

            <p style={{ fontSize: "14.5px", color: INK_PRIMARY, fontWeight: 600, margin: "0 0 20px" }}>
              {FALLACY_SCENARIOS[fallacyIdx].question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {FALLACY_SCENARIOS[fallacyIdx].choices.map((c, idx) => {
                const isSelected = selectedFallacyChoice === idx;
                let borderColor = "rgba(156, 122, 47, 0.25)";
                let bg = "#fff";
                if (showFallacyFeedback && isSelected) {
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
                      setSelectedFallacyChoice(idx);
                      setShowFallacyFeedback(true);
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

            {showFallacyFeedback && selectedFallacyChoice !== null && (
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: FALLACY_SCENARIOS[fallacyIdx].choices[selectedFallacyChoice].type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)",
                    border: `1px solid ${FALLACY_SCENARIOS[fallacyIdx].choices[selectedFallacyChoice].type === "balanced" ? GREEN : RED}`,
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start"
                  }}
                >
                  {FALLACY_SCENARIOS[fallacyIdx].choices[selectedFallacyChoice].type === "balanced" ? (
                    <CheckCircle2 size={20} style={{ color: GREEN, flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle size={20} style={{ color: RED, flexShrink: 0 }} />
                  )}
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: FALLACY_SCENARIOS[fallacyIdx].choices[selectedFallacyChoice].type === "balanced" ? GREEN : RED }}>
                      {FALLACY_SCENARIOS[fallacyIdx].choices[selectedFallacyChoice].type === "balanced" ? "CORRECT DISCERNMENT" : "FALLACY WARNING"}
                    </h4>
                    <p style={{ margin: 0, fontSize: "13.5px", color: INK_PRIMARY, lineHeight: "1.45" }}>
                      {FALLACY_SCENARIOS[fallacyIdx].choices[selectedFallacyChoice].feedback}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                  {fallacyIdx < FALLACY_SCENARIOS.length - 1 ? (
                    <button
                      onClick={() => {
                        setShowFallacyFeedback(false);
                        setSelectedFallacyChoice(null);
                        setFallacyIdx((prev) => prev + 1);
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
                      onClick={resetAll}
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
