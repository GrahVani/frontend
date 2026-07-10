"use client";

import { useState } from "react";
import { HelpCircle, RefreshCw, CheckCircle2, AlertTriangle, GitPullRequest, Share2 } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "rgba(156, 122, 47, 0.08)";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";

interface LineageNode {
  id: string;
  name: string;
  type: string;
  attribution: string;
  details: string;
  shrineLabel: string;
  x: number;
  y: number;
}

const LINEAGES: LineageNode[] = [
  {
    id: "agastya",
    name: "Agastya Nāḍī",
    type: "Primary Tamil Lineage",
    attribution: "Sage Agastya (Vedic-Tamil preceptor)",
    details: "The most prominent Tamil lineage at Vaitheeswarankoil. Focuses on thumb-print classification and narrative Tamil readings mapped across 12 chapters.",
    shrineLabel: "Agastya Shrine",
    x: 80,
    y: 150
  },
  {
    id: "sivavak",
    name: "Śiva-Vāk Nāḍī",
    type: "Tamil-Shaiva Direct Speech",
    attribution: "Lord Śiva's own speech (vāk)",
    details: "Direct revelation framing, bypassing human sage inscription in its origin claims. Shares the same material footing and Tamil narrative style.",
    shrineLabel: "Śiva-Vāk Shrine",
    x: 200,
    y: 50
  },
  {
    id: "kaushika",
    name: "Kaushika Nāḍī",
    type: "Auxiliary Second-Opinion",
    attribution: "Sage Viśvāmitra-Kauśika",
    details: "Specifically sought for complementary second opinions. Neither outranks nor is outranked by Agastya, reflecting collection independence.",
    shrineLabel: "Kaushika Shrine",
    x: 200,
    y: 250
  },
  {
    id: "shuka",
    name: "Śuka Nāḍī",
    type: "Secondary Tamil Lineage",
    attribution: "Sage Śuka (Vyāsa's son)",
    details: "Attributed to the son of the North-Indian sage Vyāsa. Represents cultural confluence, showing how Tamil palm-leaf practices integrated wider Purāṇic lore.",
    shrineLabel: "Śuka Shrine",
    x: 320,
    y: 150
  }
];

const SCENARIOS = [
  {
    id: "sc-1",
    title: "Scenario 1: The Fear-Induction Check",
    question: "A reader at Vaitheeswarankoil tells a client: 'Your Agastya reading is incomplete and danger is imminent unless you immediately pay for a Kaushika second opinion.' How do you guide the client?",
    choices: [
      {
        text: "Tell them to pay immediately to prevent any potential calamity.",
        type: "mystification",
        feedback: "Incorrect. Pushing a paid second opinion under fear is a violation of Grahvani's ethical disciplines. The first reading is not 'incomplete'."
      },
      {
        text: "Refuse the fear-induction. Explain that second opinions are completely optional, a primary reading is self-contained, and they should never be pressured under fear.",
        type: "balanced",
        feedback: "Correct! Ethics require refusing fear-induction, respecting client cost-limits, and explaining that a primary reading is structurally complete."
      },
      {
        text: "Inform them that all readings are fake, and they should sue the reader for threat.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. While calling out pressure is right, using it to generalize all practitioners as fraudulent ignores the documented craft and lineage records (Layer A)."
      }
    ]
  },
  {
    id: "sc-2",
    title: "Scenario 2: Divergence Dilemma",
    question: "A client gets an Agastya reading and then a Kaushika second opinion. The details about their future career are completely different. The client is upset. How do you advise them?",
    choices: [
      {
        text: "Explain that since both families hold independent manuscript collections, divergence is completely normal and expected. Disagreement is not, by itself, evidence of fraud.",
        type: "balanced",
        feedback: "Correct! Multi-sub-lineage collections are separate, so they do not share a single registry. Divergence is structurally expected."
      },
      {
        text: "Tell the client that the Agastya reading has to be correct, and they should ignore the Kaushika reading.",
        type: "mystification",
        feedback: "Incorrect. This violates the one-true-school refusal. Neither sub-lineage outranks the other in authority."
      },
      {
        text: "Tell the client that this contradiction is absolute proof that both readings are fake.",
        type: "scoffing",
        feedback: "Incorrect. Contradiction between separate libraries is not proof of fraud. It simply reflects their status as separate collections."
      }
    ]
  },
  {
    id: "sc-3",
    title: "Scenario 3: The Convergence Trap",
    question: "A client's Agastya and Kaushika readings agree perfectly on a past event. The client says: 'Since two independent sages said the exact same thing, it proves the leaves are supernatural and scientifically true.' How do you respond?",
    choices: [
      {
        text: "Agree with the client. Double agreement provides scientific verification of the pre-recorded leaf claim.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. Convergence could represent shared lineage techniques, birth-data inferences, or cold reading. It is not absolute scientific proof of the mechanism."
      },
      {
        text: "Point out that while convergence is interesting, it does not verify the mechanism (which remains Layer B). A major decision still needs convergent independent grounds.",
        type: "balanced",
        feedback: "Correct! Even in cases of convergence, Grahvani's discipline states that double agreement does not verify the mechanism itself. Keep decisions grounded in real-world facts."
      },
      {
        text: "Dismiss the match as lucky guessing, stating that both readers probably just communicated beforehand.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It invents explanations without evidence rather than applying a disciplined two-layer holding."
      }
    ]
  }
];

export function SublineageMap() {
  const [activeTab, setActiveTab] = useState<"network" | "dojo">("network");
  const [selectedNode, setSelectedNode] = useState<LineageNode>(LINEAGES[0]);
  
  // Dojo state
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState<number>(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, number>>({});
  const [showDojoFeedback, setShowDojoFeedback] = useState<boolean>(false);

  const scenario = SCENARIOS[currentScenarioIdx];
  const activeChoice = selectedChoices[scenario.id];

  const handleChoiceSelect = (idx: number) => {
    setSelectedChoices((prev) => ({ ...prev, [scenario.id]: idx }));
    setShowDojoFeedback(true);
  };

  const handleNextScenario = () => {
    setShowDojoFeedback(false);
    if (currentScenarioIdx < SCENARIOS.length - 1) {
      setCurrentScenarioIdx((prev) => prev + 1);
    }
  };

  const resetDojo = () => {
    setSelectedChoices({});
    setCurrentScenarioIdx(0);
    setShowDojoFeedback(false);
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
        margin: "0 auto"
      }}
      data-interactive="sublineage-map"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px", marginBottom: "20px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 20 — Chapter 2 — Lesson 3
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Tamil Nāḍī Sub-Lineage Shrines & Synthesis
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Understand parallel sub-lineages at Vaitheeswarankoil, map the second-opinion pathway, and practice ethical client guidance.
        </p>
      </div>

      {/* Tab Menu */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("network")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            background: activeTab === "network" ? GOLD : "rgba(156, 122, 47, 0.06)",
            color: activeTab === "network" ? "#fff" : GOLD_DEEP,
            border: "none",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Lineage Network Map
        </button>
        <button
          onClick={() => setActiveTab("dojo")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            background: activeTab === "dojo" ? GOLD : "rgba(156, 122, 47, 0.06)",
            color: activeTab === "dojo" ? "#fff" : GOLD_DEEP,
            border: "none",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Second-Opinion Dojo
        </button>
      </div>

      {activeTab === "network" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: "24px", minHeight: "400px" }}>
          {/* Left Panel: SVG Network */}
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
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
              Vaitheeswarankoil Courtyard Shrines
            </span>

            <svg viewBox="0 0 400 300" width="100%" height="auto">
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
                  id="arrow-muted"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(156,122,47,0.4)" />
                </marker>
              </defs>
 
              {/* Courtyard Border */}
              <rect x="10" y="10" width="380" height="280" rx="10" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="1" strokeDasharray="3,3" />
 
              {/* Dotted paths representing the second-opinion trail */}
              <path
                d="M 80,175 C 80,240 120,235 148,235"
                fill="none"
                stroke={GOLD}
                strokeWidth="2.2"
                strokeDasharray="4,4"
                marker-end="url(#arrow-gold)"
              />
 
              {/* Shuka Connection */}
              <path
                d="M 320,175 C 320,240 280,235 252,235"
                fill="none"
                stroke="rgba(156,122,47,0.35)"
                strokeWidth="1.5"
                strokeDasharray="3,3"
                marker-end="url(#arrow-muted)"
              />
 
              {/* Siva-Vak Parallel flow curves */}
              <path
                d="M 180,75 C 140,75 100,90 90,113"
                fill="none"
                stroke="rgba(156,122,47,0.3)"
                strokeWidth="1.2"
                strokeDasharray="2,2"
                marker-end="url(#arrow-muted)"
              />
              <path
                d="M 220,75 C 260,75 300,90 310,113"
                fill="none"
                stroke="rgba(156,122,47,0.3)"
                strokeWidth="1.2"
                strokeDasharray="2,2"
                marker-end="url(#arrow-muted)"
              />

              {LINEAGES.map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <g key={node.id} onClick={() => setSelectedNode(node)} style={{ cursor: "pointer" }}>
                    {/* Shrine Shape (A temple outline or block) */}
                    <rect
                      x={node.x - 45}
                      y={node.y - 30}
                      width="90"
                      height="55"
                      rx="6"
                      fill={isSelected ? GOLD_LIGHT : "#fff"}
                      stroke={GOLD}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      style={{ transition: "all 0.2s" }}
                    />
                    {/* Shading representing roof/arch of shrine */}
                    <path
                      d={`M ${node.x - 45},${node.y - 30} L ${node.x},${node.y - 45} L ${node.x + 45},${node.y - 30} Z`}
                      fill={isSelected ? GOLD : "rgba(156,122,47,0.15)"}
                      stroke={GOLD}
                      strokeWidth="1.5"
                    />
                    <text x={node.x} y={node.y - 2} textAnchor="middle" fontSize="10" fontWeight="bold" fill={INK_PRIMARY}>
                      {node.name.split(" ")[0]}
                    </text>
                    <text x={node.x} y={node.y + 12} textAnchor="middle" fontSize="7" fill={INK_MUTED}>
                      {node.shrineLabel}
                    </text>
                  </g>
                );
              })}

              {/* Second-Opinion Path text label with background mask to prevent line overlap */}
              <rect x="73" y="226" width="112" height="11" fill="#FAF6EB" rx="2" transform="rotate(22 85 235)" />
              <text x="85" y="235" fontSize="8" fill={GOLD_DEEP} fontWeight="bold" transform="rotate(22 85 235)">
                Second-Opinion Pathway
              </text>
            </svg>
          </div>

          {/* Right Panel: Selected node details */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  background: "#fff",
                  borderLeft: `4px solid ${GOLD}`,
                  borderRadius: "0 8px 8px 0",
                  padding: "16px",
                  boxShadow: "0 4px 12px rgba(156,122,47,0.04)"
                }}
              >
                <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                  {selectedNode.type}
                </span>
                <h4 style={{ margin: "4px 0 2px", fontSize: "16px", fontWeight: 700, color: INK_PRIMARY }}>
                  {selectedNode.name}
                </h4>
                <p style={{ margin: "0 0 10px", fontSize: "12px", color: INK_MUTED, fontStyle: "italic" }}>
                  Attributed to: {selectedNode.attribution}
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: INK_SECONDARY, lineHeight: "1.45" }}>
                  {selectedNode.details}
                </p>
              </div>

              <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "8px", padding: "12px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Share2 size={12} /> CULTURAL CONFLUENCE
                </span>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                  Naming Śuka (Vyāsa's son, a North-Indian sage) as a Tamil sub-lineage demonstrates cultural confluence. South India absorbed this lineage deeply through commentaries, showing it is not a contradiction.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginTop: "16px" }}>
              <HelpCircle size={16} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "11.5px", color: INK_MUTED, lineHeight: "1.4" }}>
                Click on the temple courtyard shrines on the left to inspect parallel lineages.
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Second-Opinion Dojo */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "400px" }}>
          <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                {scenario.title}
              </span>
              <span style={{ fontSize: "11px", color: INK_MUTED }}>
                {currentScenarioIdx + 1} of {SCENARIOS.length}
              </span>
            </div>

            <p style={{ fontSize: "14.5px", color: INK_PRIMARY, fontWeight: 600, margin: "0 0 20px" }}>
              {scenario.question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {scenario.choices.map((c, idx) => {
                const isSelected = activeChoice === idx;
                let borderColor = "rgba(156, 122, 47, 0.25)";
                let bg = "#fff";
                if (showDojoFeedback && isSelected) {
                  borderColor = c.type === "balanced" ? GREEN : RED;
                  bg = c.type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)";
                } else if (isSelected) {
                  borderColor = GOLD;
                  bg = "rgba(156,122,47,0.04)";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleChoiceSelect(idx)}
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

            {showDojoFeedback && activeChoice !== undefined && (
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: scenario.choices[activeChoice].type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)",
                    border: `1px solid ${scenario.choices[activeChoice].type === "balanced" ? GREEN : RED}`,
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start"
                  }}
                >
                  {scenario.choices[activeChoice].type === "balanced" ? (
                    <CheckCircle2 size={20} style={{ color: GREEN, flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle size={20} style={{ color: RED, flexShrink: 0 }} />
                  )}
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: scenario.choices[activeChoice].type === "balanced" ? GREEN : RED }}>
                      {scenario.choices[activeChoice].type === "balanced" ? "CORRECT DISCERNMENT" : "DOCTRINAL MISALIGNMENT"}
                    </h4>
                    <p style={{ margin: 0, fontSize: "13.5px", color: INK_PRIMARY, lineHeight: "1.45" }}>
                      {scenario.choices[activeChoice].feedback}
                    </p>
                  </div>
                </div>

                {scenario.choices[activeChoice].type === "balanced" && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                    {currentScenarioIdx < SCENARIOS.length - 1 ? (
                      <button
                        onClick={handleNextScenario}
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
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
