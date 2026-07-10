"use client";

import { useState } from "react";
import { HelpCircle, RefreshCw, CheckCircle2, AlertTriangle, BookOpen, Layers } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "rgba(156, 122, 47, 0.08)";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const PURPLE = "#6D28D9";
const BLUE = "#1D4ED8";

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
    id: "v-sc-1",
    title: "Scenario 1: Reader Disagreement",
    question: "A client shows you two different interpretations of the same palm-leaf verse from two different readers. They ask: 'Which reader is right?' How do you answer?",
    choices: [
      {
        text: "Tell them that the reader with the older lineage must be right, and the other is wrong.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. It forces a one-true-interpretation hierarchy. Reader-to-reader variation is structural and expected in symbolic-poetic traditions."
      },
      {
        text: "Explain that reader-to-reader variation is structural for symbolic verse. Refuse the 'which is right' binary. Both can draw out complementary facets of the same verse. Base decisions on independent grounds.",
        type: "balanced",
        feedback: "Correct! Structural variation is normal in symbolic-poetic reading traditions. Refuse the binary, let the client integrate both."
      },
      {
        text: "Inform them that this disagreement proves the verse is just gibberish and both readers are guessing randomly.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It dismisses the lineage-trained, documented interpretation craft simply because it has variable outputs."
      }
    ]
  },
  {
    id: "v-sc-2",
    title: "Scenario 2: The Cryptic Complaint",
    question: "A seeker complains: 'The verses are so vague and cryptic. If this was a true science, it would say my name and details in plain prose.' How do you explain the design?",
    choices: [
      {
        text: "Say that sages wrote in code to prevent evil spirits from stealing the predictions.",
        type: "mystification",
        feedback: "Incorrect. This represents Mystification. It invents supernatural myths rather than explaining classical poetic structure."
      },
      {
        text: "Explain that ambiguity is a structural feature of classical Indian poetic traditions (Vedic, Puranic, jyotiṣa). Poetic verses naturally require skilled, lineage-trained interpretation to unfold.",
        type: "balanced",
        feedback: "Correct! Ambiguity is a structural and intended feature of symbolic predictive units, not a defect or bug."
      },
      {
        text: "Agree that the vagueness is just a cover trick designed to make it impossible to prove them wrong.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It denies the genuine structural tradition of aphoristic, symbolic texts."
      }
    ]
  }
];

export function ShlokaDecoder() {
  const [activeTab, setActiveTab] = useState<"decoder" | "dojo">("decoder");
  const [activeHighlight, setActiveHighlight] = useState<"all" | "literal" | "figurative" | "cosmological" | "temporal">("all");
  const [activeReader, setActiveReader] = useState<"A" | "B">("A");
  const [decodeStep, setDecodeStep] = useState<number>(0);

  // Dojo State
  const [dojoIdx, setDojoIdx] = useState<number>(0);
  const [selectedDojoChoice, setSelectedDojoChoice] = useState<number | null>(null);
  const [showDojoFeedback, setShowDojoFeedback] = useState<boolean>(false);

  const currentDojo = DOJO_SCENARIOS[dojoIdx];

  const DECODE_STEPS = [
    { title: "1. Read source", desc: "Read the Old-Tamil or Sanskrit verse in its original dialect script.", detail: "Requires lineage-apprenticed literacy." },
    { title: "2. Translate literal terms", desc: "Translate precise anchors (e.g. Sun in Aries Lagna, Saturn in 7th, Son of Kaushiki).", detail: "Provides the observable biographical anchors." },
    { title: "3. Interpret imagery", desc: "Interpret symbolic/figurative imagery (e.g. 'honored by leaders', 'son of Kaushiki' as a lineage initial 'K').", detail: "Bridges symbolic registers to actual meaning." },
    { title: "4. Integrate context", desc: "Combine anchors and interpreted symbols to deliver a coherent life-event prediction.", detail: "Final predictive delivery to the seeker." }
  ];

  // Alternate readings for the same verse
  const ALTERNATIVE_READINGS = {
    A: {
      title: "Reader A (Northern lineage school)",
      desc: "Focuses on the computed astrological alignment. Interpretation: 'Since Saturn aspects the 7th house, marriage will be delayed until the 30th year, but the native's career will rise to great public honors after struggles in the south.'"
    },
    B: {
      title: "Reader B (Southern Vaitīśvaran school)",
      desc: "Focuses on lineage-transmitted name matching. Interpretation: 'The mother's name begins with initial K. The native's fortune rises after relocating to a city by a river in the southern direction, earning respect from elders.'"
    }
  };

  const getHighlightStyle = (type: "literal" | "figurative" | "cosmological" | "temporal") => {
    const isMuted = activeHighlight !== "all" && activeHighlight !== type;
    let color = "";
    switch (type) {
      case "literal": color = GOLD; break;
      case "figurative": color = GREEN; break;
      case "cosmological": color = PURPLE; break;
      case "temporal": color = BLUE; break;
    }
    return {
      borderBottom: `2.5px solid ${isMuted ? "transparent" : color}`,
      background: isMuted ? "transparent" : `rgba(${hexToRgb(color)}, 0.12)`,
      color: isMuted ? INK_MUTED : INK_PRIMARY,
      padding: "2px 4px",
      borderRadius: "4px",
      fontWeight: isMuted ? "normal" : "bold",
      transition: "all 0.3s ease"
    };
  };

  // Helper to convert hex to rgb numbers
  function hexToRgb(hex: string) {
    if (hex === GOLD) return "156, 122, 47";
    if (hex === GREEN) return "47, 125, 85";
    if (hex === PURPLE) return "109, 40, 217";
    if (hex === BLUE) return "29, 78, 216";
    return "124, 109, 91";
  }

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
      data-interactive="shloka-decoder"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 20 — Chapter 3 — Lesson 4
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Śloka Registers Decoder & Variation Explorer
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Analyze a sample verse, highlight its literal vs symbolic registers, walk the translation steps, and inspect reader-to-reader variation.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1.5px solid rgba(156,122,47,0.1)" }}>
        <button
          onClick={() => setActiveTab("decoder")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: activeTab === "decoder" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "decoder" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "decoder" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "decoder" ? 700 : 500,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <BookOpen size={16} />
          Śloka Register Decoder
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
          <Layers size={16} />
          Ambiguity Dojo
        </button>
      </div>

      {activeTab === "decoder" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "24px" }}>
          
          {/* Left Panel: Register Highlighting */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                1. Text Register Highlights
              </span>

              {/* Text highlighting buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <button onClick={() => setActiveHighlight("all")} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, border: "1px solid #ccc", background: activeHighlight === "all" ? GOLD_LIGHT : "#fff", cursor: "pointer" }}>Show All</button>
                <button onClick={() => setActiveHighlight("cosmological")} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, border: `1px solid ${PURPLE}`, background: activeHighlight === "cosmological" ? "rgba(109, 40, 217, 0.1)" : "#fff", color: PURPLE, cursor: "pointer" }}>Cosmological</button>
                <button onClick={() => setActiveHighlight("literal")} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, border: `1px solid ${GOLD}`, background: activeHighlight === "literal" ? GOLD_LIGHT : "#fff", color: GOLD_DEEP, cursor: "pointer" }}>Literal Anchors</button>
                <button onClick={() => setActiveHighlight("figurative")} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, border: `1px solid ${GREEN}`, background: activeHighlight === "figurative" ? "rgba(47, 125, 85, 0.1)" : "#fff", color: GREEN, cursor: "pointer" }}>Figurative</button>
                <button onClick={() => setActiveHighlight("temporal")} style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600, border: `1px solid ${BLUE}`, background: activeHighlight === "temporal" ? "rgba(29, 78, 216, 0.1)" : "#fff", color: BLUE, cursor: "pointer" }}>Temporal</button>
              </div>

              {/* Visual Palm Leaf Drawing for Text Container */}
              <div style={{ position: "relative", padding: "16px", borderRadius: "10px", background: "url(#agedLeaf)", backgroundColor: "#E6DABF", border: `2px solid ${GOLD}`, boxShadow: "inset 0 0 10px rgba(109, 90, 61, 0.3)", display: "flex", justifyContent: "center" }}>
                
                {/* Horizontal binding leaf lines */}
                <div style={{ position: "absolute", left: "10px", right: "10px", top: "35%", borderTop: "0.5px dashed rgba(109, 90, 61, 0.35)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", left: "10px", right: "10px", top: "65%", borderTop: "0.5px dashed rgba(109, 90, 61, 0.35)", pointerEvents: "none" }} />
                
                {/* Left string hole */}
                <div style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", width: "12px", height: "12px", borderRadius: "50%", background: "#FAF6EB", border: `1px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#6D5A3D" }} />
                </div>

                <div style={{ fontFamily: "monospace", paddingLeft: "30px", fontSize: "12.5px", lineHeight: "2.0", color: INK_PRIMARY, zIndex: 1, textShadow: "0.5px 0.5px 0px rgba(255,255,255,0.5)" }}>
                  <span style={getHighlightStyle("cosmological")}>meṣe ravau lagne sūryaputraśca saptame</span>
                  <span> | </span>
                  <span style={getHighlightStyle("literal")}>kauśikī nandanaḥ</span>
                  <span> </span>
                  <span style={getHighlightStyle("temporal")}>paścāt</span>
                  <span> </span>
                  <span style={getHighlightStyle("figurative")}>kīrtimān rājapūjitaḥ</span>
                  <span> ||</span>
                </div>
              </div>

              <div style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                <strong>Legend:</strong>
                <ul style={{ margin: "4px 0 0", paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "2px" }}>
                  <li><span style={{ color: PURPLE, fontWeight: "bold" }}>Purple:</span> Astrological alignments (Sun in Aries, Saturn in 7th).</li>
                  <li><span style={{ color: GOLD_DEEP, fontWeight: "bold" }}>Gold:</span> Literal biographical anchor initial (son of K/Kaushiki).</li>
                  <li><span style={{ color: GREEN, fontWeight: "bold" }}>Green:</span> Figurative metaphor (rājapūjitaḥ — honored by rulers/leaders).</li>
                  <li><span style={{ color: BLUE, fontWeight: "bold" }}>Blue:</span> Temporal timeline indicator (paścāt — later, subsequently).</li>
                </ul>
              </div>
            </div>

            <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                2. Reader Translation Mediation
              </span>
              <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
                {DECODE_STEPS.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDecodeStep(idx)}
                    style={{
                      flex: 1,
                      padding: "4px",
                      borderRadius: "4px",
                      border: "none",
                      background: decodeStep === idx ? GOLD : "rgba(156,122,47,0.1)",
                      color: decodeStep === idx ? "#fff" : GOLD_DEEP,
                      fontSize: "10px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Step {idx + 1}
                  </button>
                ))}
              </div>
              <div style={{ background: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.12)", fontSize: "12.5px" }}>
                <strong style={{ color: GOLD_DEEP, display: "block", marginBottom: "2px" }}>{DECODE_STEPS[decodeStep].title}</strong>
                <p style={{ margin: "0 0 4px", color: INK_PRIMARY }}>{DECODE_STEPS[decodeStep].desc}</p>
                <span style={{ fontSize: "11px", fontStyle: "italic", color: INK_MUTED }}>Context: {DECODE_STEPS[decodeStep].detail}</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Alternative readings */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>READER VARIATION EXPLORER</span>
              <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                Because the verses are highly symbolic and cryptic, different readers may genuinely derive different meanings. Refuse the binary check.
              </p>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setActiveReader("A")}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "6px",
                    border: `1.5px solid ${activeReader === "A" ? GOLD : "rgba(156,122,47,0.15)"}`,
                    background: activeReader === "A" ? GOLD_LIGHT : "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Reader A
                </button>
                <button
                  onClick={() => setActiveReader("B")}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "6px",
                    border: `1.5px solid ${activeReader === "B" ? GOLD : "rgba(156,122,47,0.15)"}`,
                    background: activeReader === "B" ? GOLD_LIGHT : "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Reader B
                </button>
              </div>

              <div style={{ background: "#FAF6EB", padding: "12px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.15)" }}>
                <h5 style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>
                  {ALTERNATIVE_READINGS[activeReader].title}
                </h5>
                <p style={{ margin: 0, fontSize: "12.5px", color: INK_PRIMARY, lineHeight: "1.4" }}>
                  {ALTERNATIVE_READINGS[activeReader].desc}
                </p>
              </div>
            </div>

            <div style={{ padding: "12px", borderRadius: "8px", background: "#fff", border: "1px solid rgba(156,122,47,0.15)", fontSize: "12px", color: INK_MUTED, display: "flex", gap: "6px" }}>
              <HelpCircle size={16} style={{ color: GOLD, flexShrink: 0, marginTop: "2px" }} />
              <span>
                Ambiguity is a **structural feature** of symbolic poetry across Indian classical traditions. Hold variant interpretations honestly.
              </span>
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
}
