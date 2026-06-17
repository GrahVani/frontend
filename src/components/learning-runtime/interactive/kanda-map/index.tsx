"use client";

import { useState } from "react";
import { HelpCircle, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Info, Compass, Award } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "rgba(156, 122, 47, 0.08)";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";

interface KandaNode {
  num: number;
  name: string;
  domain: string;
  details: string;
  gridRow: number;
  gridCol: number;
}

const KANDAS: KandaNode[] = [
  { num: 1, name: "General / Self", domain: "Self, character, life-arc", details: "Summary of birth details and main life events from birth to death.", gridRow: 1, gridCol: 2 },
  { num: 2, name: "Wealth", domain: "Speech, eyes, finances, family", details: "Monetary gains, speech patterns, and family wealth growth indicators.", gridRow: 1, gridCol: 3 },
  { num: 3, name: "Brothers", domain: "Siblings, courage, support", details: "Number of siblings and relationship harmony or conflicts.", gridRow: 1, gridCol: 4 },
  { num: 4, name: "Mother", domain: "Mother, home, vehicles, land", details: "Mother's health, ancestral land acquisition, and domestic life.", gridRow: 2, gridCol: 4 },
  { num: 5, name: "Children", domain: "Offspring, mind, intelligence", details: "Progeny, education, and artistic/intellectual pursuits.", gridRow: 3, gridCol: 4 },
  { num: 6, name: "Disease & Debt", domain: "Enemies, debts, illnesses", details: "Physical health, debt recovery, and handling legal or personal disputes.", gridRow: 4, gridCol: 4 },
  { num: 7, name: "Marriage", domain: "Spouse, partnership, foreign travel", details: "Marriage timing, spouse characteristics, initial names, and directions.", gridRow: 4, gridCol: 3 },
  { num: 8, name: "Longevity", domain: "Lifespan, legacy, hidden events", details: "Lifespan indicators, legacy inheritance, and unexpected transformations.", gridRow: 4, gridCol: 2 },
  { num: 9, name: "Father", domain: "Father, dharma, teachers, fortune", details: "Father's well-being, spiritual inclinations, and foreign travels.", gridRow: 4, gridCol: 1 },
  { num: 10, name: "Profession", domain: "Career, status, public honor", details: "Primary profession, changes in career, and social standing.", gridRow: 3, gridCol: 1 },
  { num: 11, name: "Gains", domain: "Elder siblings, profits, friends", details: "Accumulation of profits, helpful friends, and material gains.", gridRow: 2, gridCol: 1 },
  { num: 12, name: "Losses", domain: "Expenditure, travel, liberation", details: "Expenditures, foreign travel settlement, and spiritual liberation.", gridRow: 1, gridCol: 1 }
];

interface DojoScenario {
  id: string;
  title: string;
  question: string;
  choices: {
    text: string;
    type: "scoffing" | "mystification" | "balanced";
    feedback: string;
  }[];
}

const DOJO_SCENARIOS: DojoScenario[] = [
  {
    id: "k-sc-1",
    title: "Scenario 1: The Infallible Sage Myth",
    question: "A client gets a reading where Kāṇḍa 7 says they will marry in their 28th year, but Kāṇḍa 10 says they marry in their 32nd year. The client refuses to raise the issue because 'sages cannot make mistakes, so both must be true.' How do you guide them?",
    choices: [
      {
        text: "Tell them to accept both dates as a mystery beyond human logic.",
        type: "mystification",
        feedback: "Incorrect. This represents Mystification. It ignores the documented interpretive gap and refuses to apply a logical coherence check."
      },
      {
        text: "Advise them to raise the contradiction with the reader (Layer A). Explain that cross-kāṇḍa contradictions can represent interpretive drift or transcription error, and they should never make life decisions based on a self-contradictory reading.",
        type: "balanced",
        feedback: "Correct! Cross-kāṇḍa coherence is a standard discipline. Point out contradictions and hold them open."
      },
      {
        text: "Agree that this mismatch proves the entire reading is a lazy scam and they should throw it away.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It uses a contradiction to generalize all practitioners as fraudulent, ignoring the archival craft."
      }
    ]
  },
  {
    id: "k-sc-2",
    title: "Scenario 2: The Mandatory Longevity Chapter",
    question: "A client says: 'I only want to know about my career and family, but the reader says I am forbidden from skipping Kāṇḍa 8 (Longevity) or the reading will become invalid.' What is your guidance?",
    choices: [
      {
        text: "Explain that each Kāṇḍa is a standalone unit. Seeker-selected coverage is normal, and skipping Kāṇḍa 8 loses nothing critical. Refuse this pressure.",
        type: "balanced",
        feedback: "Correct! Kāṇḍas operate independently; seekers can select which to cover based on choice and cost-benefit."
      },
      {
        text: "Tell the client they must read the Longevity chapter, otherwise the spirits of the sages will not bless the career chapter.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. It invents supernatural rules to justify practitioner sales pressure."
      },
      {
        text: "Dismiss the entire session because the reader is just trying to squeeze more money out of them.",
        type: "scoffing",
        feedback: "Incorrect. Scoffing focuses only on the greed aspect rather than guiding the client on the standalone nature of the chapters."
      }
    ]
  },
  {
    id: "k-sc-3",
    title: "Scenario 3: The Parallel Proof",
    question: "A client states: 'Since the 12 Kāṇḍas line up exactly with the 12 bhāvas of standard Parāśarī astrology, this proves the leaves are scientifically authentic.' How do you handle this?",
    choices: [
      {
        text: "Agree. The structural parallel provides mathematical validation of the leaf accuracy.",
        type: "mystification",
        feedback: "Incorrect. This collapses Layer B and Layer C. The parallel is a structural feature (Layer A), not verification of accuracy (Layer C)."
      },
      {
        text: "Acknowledge the parallel as an interesting structural feature, but explain that it could reflect historical absorption or shared Indian templates. It does not verify the predictive mechanism itself.",
        type: "balanced",
        feedback: "Correct! The parallel is interesting but does not verify the claim on its own. Keep it framed honestly."
      },
      {
        text: "Dismiss it, claiming that the parallel is just a cheap trick readers use to deceive client expectations.",
        type: "scoffing",
        feedback: "Incorrect. Scoffing assumes deliberate fraud instead of holding the shared structural templates honestly."
      }
    ]
  }
];

export function KandaMap() {
  const [activeTab, setActiveTab] = useState<"parallel" | "dojo">("parallel");
  const [activeKanda, setActiveKanda] = useState<KandaNode>(KANDAS[0]);

  // Question Router State
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>("none");

  // Coherence Checker State
  const [spouseInitialK7, setSpouseInitialK7] = useState<string>("A");
  const [spouseInitialK9, setSpouseInitialK9] = useState<string>("A");

  // Dojo State
  const [dojoIdx, setDojoIdx] = useState<number>(0);
  const [selectedDojoChoice, setSelectedDojoChoice] = useState<number | null>(null);
  const [showDojoFeedback, setShowDojoFeedback] = useState<boolean>(false);

  const currentDojo = DOJO_SCENARIOS[dojoIdx];

  const ROUTER_PRESETS = [
    { key: "none", label: "Clear Router" },
    { key: "career", label: "Career & Gains", chapters: [10, 11, 2] },
    { key: "family", label: "Marriage & Offspring", chapters: [7, 5, 1] },
    { key: "health", label: "Health & Obstacles", chapters: [6, 12, 8] }
  ];

  const activeQuestionPreset = ROUTER_PRESETS.find(p => p.key === selectedQuestionType);

  const handlePresetSelect = (key: string) => {
    setSelectedQuestionType(key);
  };

  const isCoherent = spouseInitialK7 === spouseInitialK9;

  const resetDojo = () => {
    setSelectedDojoChoice(null);
    setDojoIdx(0);
    setShowDojoFeedback(false);
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.9)",
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
      data-interactive="kanda-map"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 20 — Chapter 3 — Lesson 3
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Twelve Kāṇḍas Comparative Parallel
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Map the standalone chapters to standard houses, run cross-chapter coherence checks, and test contradictions.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1.5px solid rgba(156,122,47,0.1)" }}>
        <button
          onClick={() => setActiveTab("parallel")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: activeTab === "parallel" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "parallel" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "parallel" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "parallel" ? 700 : 500,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Compass size={16} />
          Kāṇḍa Map Explorer
        </button>
        <button
          onClick={() => setActiveTab("dojo")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: activeTab === "dojo" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "dojo" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "dojo" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "dojo" ? 700 : 500,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Award size={16} />
          Kāṇḍa Dojo
        </button>
      </div>

      {activeTab === "parallel" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "24px" }}>
          
          {/* Left Panel: Grid Mapping */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
                1. South Indian Grid Representation
              </span>

              {/* High-fidelity visual parchment grid wrapper */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gridTemplateRows: "repeat(4, 1fr)",
                  gap: "6px",
                  background: "url(#parchmentBg)",
                  backgroundColor: "#FAF6EB",
                  border: `2px solid ${GOLD}`,
                  borderRadius: "10px",
                  padding: "10px",
                  aspectRatio: "1/1",
                  boxShadow: "inset 0 0 12px rgba(156, 122, 47, 0.15)"
                }}
              >
                {/* Row 1 */}
                {renderGridBox(12)}
                {renderGridBox(1)}
                {renderGridBox(2)}
                {renderGridBox(3)}

                {/* Row 2 */}
                {renderGridBox(11)}
                <div style={{ gridColumn: "span 2", gridRow: "span 2", background: "#fff", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(156,122,47,0.25)", padding: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textAlign: "center", letterSpacing: "0.05em" }}>
                    AGASTYA NĀḌĪ
                  </span>
                  <span style={{ fontSize: "9px", color: INK_MUTED, textAlign: "center", marginTop: "2px" }}>
                    12 Chapter Parallel
                  </span>
                </div>
                {renderGridBox(4)}

                {/* Row 3 */}
                {renderGridBox(10)}
                {renderGridBox(5)}

                {/* Row 4 */}
                {renderGridBox(9)}
                {renderGridBox(8)}
                {renderGridBox(7)}
                {renderGridBox(6)}
              </div>
            </div>

            <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                2. Seeker Question Router
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {ROUTER_PRESETS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => handlePresetSelect(p.key)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: `1px solid ${selectedQuestionType === p.key ? GOLD : "rgba(156,122,47,0.15)"}`,
                      background: selectedQuestionType === p.key ? GOLD : "#fff",
                      color: selectedQuestionType === p.key ? "#fff" : GOLD_DEEP,
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Kanda detail / Coherence */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#fff", borderLeft: `4px solid ${GOLD}`, borderRadius: "0 8px 8px 0", padding: "16px", boxShadow: "0 4px 12px rgba(156,122,47,0.04)", border: "1px solid rgba(156,122,47,0.1)", borderLeftWidth: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                Kāṇḍa {activeKanda.num} — House {activeKanda.num} Parallel
              </span>
              <h4 style={{ margin: "4px 0 2px", fontSize: "16px", fontWeight: 700, color: INK_PRIMARY }}>
                {activeKanda.name}
              </h4>
              <p style={{ margin: "0 0 8px", fontSize: "12.5px", color: INK_MUTED, fontStyle: "italic" }}>
                Covers: {activeKanda.domain}
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: INK_SECONDARY, lineHeight: "1.45" }}>
                {activeKanda.details}
              </p>
            </div>

            {/* Coherence Checker UI */}
            <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>CROSS-KĀṆḌA COHERENCE CHECKER</span>
              
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                  <label style={{ fontSize: "11px", color: INK_MUTED }}>Spouse Initial (K7):</label>
                  <select value={spouseInitialK7} onChange={(e) => setSpouseInitialK7(e.target.value)} style={{ padding: "6px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)" }}>
                    <option value="A">A (Aditi)</option>
                    <option value="M">M (Meena)</option>
                    <option value="S">S (Sita)</option>
                  </select>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                  <label style={{ fontSize: "11px", color: INK_MUTED }}>Father-in-law (K9):</label>
                  <select value={spouseInitialK9} onChange={(e) => setSpouseInitialK9(e.target.value)} style={{ padding: "6px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)" }}>
                    <option value="A">A (Aditi relation)</option>
                    <option value="M">M (Meena relation)</option>
                    <option value="S">S (Sita relation)</option>
                  </select>
                </div>
              </div>

              {!isCoherent ? (
                <div style={{ padding: "10px", borderRadius: "6px", background: "rgba(162,58,30,0.06)", border: `1px solid ${RED}`, display: "flex", gap: "6px", alignItems: "flex-start" }}>
                  <ShieldCheck size={16} style={{ color: RED, flexShrink: 0, marginTop: "2px" }} />
                  <div style={{ fontSize: "11.5px", color: INK_PRIMARY }}>
                    <strong style={{ color: RED }}>COHERENCE ERROR FLAG:</strong> Spousal indicator initials mismatch! Ask the reader to explain and hold the contradiction open. **Do not make major life decisions on this output.**
                  </div>
                </div>
              ) : (
                <div style={{ padding: "10px", borderRadius: "6px", background: "rgba(47,125,85,0.06)", border: `1px solid ${GREEN}`, display: "flex", gap: "6px", alignItems: "flex-start" }}>
                  <CheckCircle2 size={16} style={{ color: GREEN, flexShrink: 0, marginTop: "2px" }} />
                  <div style={{ fontSize: "11.5px", color: INK_PRIMARY }}>
                    <strong style={{ color: GREEN }}>COHERENT CORRESPONDENCE:</strong> Initials match cleanly across chapters. Keep monitoring timeline events.
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Dojo Tab */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "440px" }}>
          <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                {currentDojo.title}
              </span>
              <span style={{ fontSize: "11px", color: INK_MUTED }}>
                {dojoIdx + 1} of {DOJO_SCENARIOS.length}
              </span>
            </div>

            <p style={{ fontSize: "14.5px", color: INK_PRIMARY, fontWeight: 600, margin: "0 0 20px" }}>
              {currentDojo.question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {currentDojo.choices.map((c, idx) => {
                const isSelected = selectedDojoChoice === idx;
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
                    onClick={() => {
                      setSelectedDojoChoice(idx);
                      setShowDojoFeedback(true);
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

            {showDojoFeedback && selectedDojoChoice !== null && (
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: currentDojo.choices[selectedDojoChoice].type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)",
                    border: `1px solid ${currentDojo.choices[selectedDojoChoice].type === "balanced" ? GREEN : RED}`,
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start"
                  }}
                >
                  {currentDojo.choices[selectedDojoChoice].type === "balanced" ? (
                    <CheckCircle2 size={20} style={{ color: GREEN, flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle size={20} style={{ color: RED, flexShrink: 0 }} />
                  )}
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: currentDojo.choices[selectedDojoChoice].type === "balanced" ? GREEN : RED }}>
                      {currentDojo.choices[selectedDojoChoice].type === "balanced" ? "CORRECT DISCERNMENT" : "TRAP WARNING"}
                    </h4>
                    <p style={{ margin: 0, fontSize: "13.5px", color: INK_PRIMARY, lineHeight: "1.45" }}>
                      {currentDojo.choices[selectedDojoChoice].feedback}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                  {dojoIdx < DOJO_SCENARIOS.length - 1 ? (
                    <button
                      onClick={() => {
                        setShowDojoFeedback(false);
                        setSelectedDojoChoice(null);
                        setDojoIdx((prev) => prev + 1);
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

  function renderGridBox(num: number) {
    const kanda = KANDAS.find((k) => k.num === num) || KANDAS[0];
    const isSelected = activeKanda.num === num;
    
    // Check if preset highlights this chapter
    const isHighlighted = activeQuestionPreset?.chapters?.includes(num);

    return (
      <button
        onClick={() => setActiveKanda(kanda)}
        style={{
          border: `1.5px solid ${isSelected ? GOLD : isHighlighted ? GREEN : "rgba(156,122,47,0.25)"}`,
          background: isSelected ? GOLD : isHighlighted ? "rgba(47,125,85,0.12)" : "#fff",
          color: isSelected ? "#fff" : INK_PRIMARY,
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: "4px",
          transition: "all 0.25s ease",
          boxShadow: isSelected ? "0 2px 6px rgba(156,122,47,0.3)" : "none",
          transform: isSelected ? "scale(1.03)" : "none"
        }}
      >
        <span style={{ fontSize: "8.5px", fontWeight: "bold", color: isSelected ? "#FAF6EB" : isHighlighted ? GREEN : GOLD_DEEP }}>
          K{num}
        </span>
        <span style={{ fontSize: "9.5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%", textAlign: "center", fontWeight: isSelected || isHighlighted ? "bold" : "normal" }}>
          {kanda.name.split(" ")[0]}
        </span>
      </button>
    );
  }
}
