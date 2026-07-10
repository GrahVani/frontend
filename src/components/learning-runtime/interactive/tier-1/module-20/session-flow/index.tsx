"use client";

import { useState } from "react";
import { HelpCircle, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Play, Layers } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "rgba(156, 122, 47, 0.08)";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";

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
    id: "s-sc-1",
    title: "Scenario 1: The All-Twelve Pressure",
    question: "A Nāḍī practitioner tells a client: 'You must pay for and read all 12 chapters today. If you skip any, your reading is incomplete, and negative forces will amplify.' How do you guide the client?",
    choices: [
      {
        text: "Tell them to pay for all twelve immediately to avoid cosmic danger.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. It endorses the fear-inducing claim. Kāṇḍas are standalone units; partial readings are structurally complete."
      },
      {
        text: "Advise the client to refuse the fear-induction. Apply the cost-benefit screen, start with 3-4 key chapters based on their immediate questions, and preserve financial safety.",
        type: "balanced",
        feedback: "Correct! The cost-benefit screen requires refusing fear-induction and taking a graduated pathway based on budget."
      },
      {
        text: "Inform the client that since all leaves are fake, they should walk out and report the shop.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It dismisses the consultation entirely instead of applying ethical client guidance guidelines."
      }
    ]
  },
  {
    id: "s-sc-2",
    title: "Scenario 2: The Recording Dispute",
    question: "A client wants to record their session for future verification, but the reader says: 'Recording is forbidden by the sages.' The client is suspicious. How do you advise them?",
    choices: [
      {
        text: "Explain that recording policies vary by sub-lineage. Seekers should ask beforehand, respect local custom, but keep alternative explanations in mind if recording is refused.",
        type: "balanced",
        feedback: "Correct! Policies are lineage-dependent, not written in ancient law. We respect the layout rules but note that lack of recording limits external validation."
      },
      {
        text: "Agree that recording is indeed a modern desecration of the leaves, so the reader is correct.",
        type: "mystification",
        feedback: "Incorrect. This represents Mystification. Recording is a modern technological option, not a spiritual taboo."
      },
      {
        text: "Tell the client this refusal is absolute proof that the reader is cheating and hiding their script.",
        type: "scoffing",
        feedback: "Incorrect. Scoffing assumes deliberate fraud, ignoring that private custody and gurukula traditions are historically closed to public replication."
      }
    ]
  },
  {
    id: "s-sc-3",
    title: "Scenario 3: Single-Factor Decision",
    question: "A client gets a career reading saying they will become a wealthy merchant in the South. They immediately want to resign from their stable office job. How do you guide them?",
    choices: [
      {
        text: "Tell them to resign. Destiny is written, and staying in the office is resisting the sages.",
        type: "mystification",
        feedback: "Incorrect. This violates the single-factor major-life-decision refusal. Destiny claims must never override real-world prudence."
      },
      {
        text: "Advise them to keep their job. Explain that session content is one symbolic input, not a validated mechanism. Any major career move needs convergent independent grounds.",
        type: "balanced",
        feedback: "Correct! The Grahvani discipline states that we must refuse major life decisions based on a single reading. Real-world facts must lead."
      },
      {
        text: "Tell them to sue the reader for giving dangerous, irresponsible advice.",
        type: "scoffing",
        feedback: "Incorrect. Scoffing treats the client's experience as purely harmful rather than helping them parse it using the two-layer holding."
      }
    ]
  }
];

export function SessionFlow() {
  const [activeTab, setActiveTab] = useState<"timeline" | "dojo">("timeline");
  const [timelineStep, setTimelineStep] = useState<number>(0);
  const [seekerResponse, setSeekerResponse] = useState<string>("");

  // Budget Planner State
  const [clientBudget, setClientBudget] = useState<number>(15000);
  const [selectedChapters, setSelectedChapters] = useState<number[]>([1, 10]);

  // Dojo State
  const [dojoIdx, setDojoIdx] = useState<number>(0);
  const [selectedDojoChoice, setSelectedDojoChoice] = useState<number | null>(null);
  const [showDojoFeedback, setShowDojoFeedback] = useState<boolean>(false);

  const currentDojo = DOJO_SCENARIOS[dojoIdx];

  const TIMELINE_STEPS = [
    { title: "Recitation", desc: "The reader chants the Old-Tamil or Sanskrit verses aloud from the leaf in a poetic, rhythmic meter.", detail: "Requires specialised apprenticeship-trained literacy." },
    { title: "Translation", desc: "The reader translates the cryptic terms word-for-word into the client's spoken language.", detail: "Lineage assistants often help translate Tamil to English/Hindi." },
    { title: "Interpretation", desc: "The reader interprets symbolic metaphors and cosmological planetary indicators into plain predictions.", detail: "This creates the 'interpretive-fidelity gap' (verse ≠ prediction)." },
    { title: "Confirmation", desc: "The seeker validates each statement, asking questions or clarifying details in a back-and-forth cycle.", detail: "Allows dialogue negotiation and active refinement." }
  ];

  const CHAPTER_LIST = [
    { id: 1, name: "K1: General Arc", cost: 3000, hrs: 1.0 },
    { id: 2, name: "K2: Wealth & Speech", cost: 2500, hrs: 0.5 },
    { id: 3, name: "K3: Siblings", cost: 2500, hrs: 0.5 },
    { id: 7, name: "K7: Marriage", cost: 3000, hrs: 0.8 },
    { id: 10, name: "K10: Career & Status", cost: 3500, hrs: 1.0 },
    { id: 12, name: "K12: Loss & Mokṣa", cost: 2500, hrs: 0.6 }
  ];

  const baseMatchingFee = 2000;
  const totalCost = baseMatchingFee + CHAPTER_LIST.filter(c => selectedChapters.includes(c.id)).reduce((acc, c) => acc + c.cost, 0);
  const totalHours = 1.0 + CHAPTER_LIST.filter(c => selectedChapters.includes(c.id)).reduce((acc, c) => acc + c.hrs, 0);

  const handleToggleChapter = (id: number) => {
    setSelectedChapters(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleTriggerConfirmation = (type: "agree" | "disagree") => {
    if (type === "agree") {
      setSeekerResponse("Seeker: 'Yes, that fits. My father's name does carry a solar meaning.'");
    } else {
      setSeekerResponse("Seeker: 'Wait, the verse says my mother has passed, but she is alive. Can you re-read that line?'");
    }
  };

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
      data-interactive="session-flow"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 20 — Chapter 3 — Lesson 2
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Reading Session Flow & Cost-Benefit Screen
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Explore the timeline choreography of a consultation, trigger confirmation dialogues, and calculate per-kāṇḍa budget limits.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1.5px solid rgba(156,122,47,0.1)" }}>
        <button
          onClick={() => setActiveTab("timeline")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: activeTab === "timeline" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "timeline" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "timeline" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "timeline" ? 700 : 500,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Play size={16} />
          Session Timeline & Budget
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
          Cost-Benefit Dojo
        </button>
      </div>

      {activeTab === "timeline" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.20fr 1fr", gap: "24px" }}>
          
          {/* Left Panel: Timeline & confirmation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                Interactive Timeline Step
              </span>

              {/* High-fidelity SVG Timeline */}
              <div style={{ margin: "16px 0", background: "#fff", padding: "12px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
                <svg viewBox="0 0 420 70" width="100%" height="auto" style={{ overflow: "visible" }}>
                  {/* Track base line */}
                  <line x1="30" y1="35" x2="390" y2="35" stroke="rgba(156,122,47,0.2)" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Active highlight line */}
                  <line 
                    x1="30" 
                    y1="35" 
                    x2={30 + timelineStep * 120} 
                    y2="35" 
                    stroke={GOLD} 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    style={{ transition: "all 0.5s ease" }} 
                  />

                  {TIMELINE_STEPS.map((step, idx) => {
                    const isCurrent = timelineStep === idx;
                    const isPast = timelineStep > idx;
                    const cx = 30 + idx * 120;
                    return (
                      <g key={idx} onClick={() => { setTimelineStep(idx); setSeekerResponse(""); }} style={{ cursor: "pointer" }}>
                        <circle 
                          cx={cx} 
                          cy="35" 
                          r={isCurrent ? "12" : "9"} 
                          fill={isCurrent ? GOLD : isPast ? GREEN : "#fff"} 
                          stroke={GOLD} 
                          strokeWidth="2"
                          style={{ transition: "all 0.3s ease" }} 
                        />
                        {isCurrent && (
                          <circle cx={cx} cy="35" r="16" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.6">
                            <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <text x={cx} y="56" textAnchor="middle" fill={isCurrent ? GOLD_DEEP : INK_SECONDARY} fontSize="8.5px" fontWeight={isCurrent ? "bold" : "normal"}>
                          {step.title}
                        </text>
                        <text x={cx} y="38" textAnchor="middle" fill={isCurrent || isPast ? "#fff" : GOLD_DEEP} fontSize="7px" fontWeight="bold">
                          {idx + 1}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div style={{ background: "#fff", padding: "12px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.15)" }}>
                <h5 style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>
                  {TIMELINE_STEPS[timelineStep].title}
                </h5>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: INK_PRIMARY, lineHeight: "1.4" }}>
                  {TIMELINE_STEPS[timelineStep].desc}
                </p>
                <span style={{ fontSize: "11px", fontStyle: "italic", color: INK_MUTED }}>
                  Operational reality: {TIMELINE_STEPS[timelineStep].detail}
                </span>
              </div>

              {timelineStep === 3 && (
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED }}>TRIGGER SEEKER RESPONSE:</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleTriggerConfirmation("agree")} style={{ flex: 1, padding: "6px", borderRadius: "4px", background: GREEN, color: "#fff", border: "none", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Confirm Hit</button>
                    <button onClick={() => handleTriggerConfirmation("disagree")} style={{ flex: 1, padding: "6px", borderRadius: "4px", background: RED, color: "#fff", border: "none", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>Question Error</button>
                  </div>
                  {seekerResponse && (
                    <div style={{ background: "#fff", padding: "8px 12px", borderRadius: "6px", border: `1px solid ${GOLD}`, fontSize: "12px", fontFamily: "monospace", color: INK_SECONDARY }}>
                      {seekerResponse}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                Recording & Transcripts
              </span>
              <p style={{ margin: "8px 0 0", fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                Always ask the reader's recording policy first. The transcript capturing source-verse, translation, and commentary is valuable for later comparative validation.
              </p>
            </div>
          </div>

          {/* Right Panel: Budget Planner */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>PER-KĀṆḌA BUDGET PLANNER</span>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: INK_SECONDARY }}>Client Total Budget Limit (₹):</label>
                <input
                  type="number"
                  value={clientBudget}
                  onChange={(e) => setClientBudget(Number(e.target.value))}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(156,122,47,0.3)",
                    fontSize: "13px",
                    width: "100%"
                  }}
                />
              </div>

              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, display: "block", marginBottom: "6px" }}>
                  Select Chapters to Read:
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  {CHAPTER_LIST.map((chap) => {
                    const isSelected = selectedChapters.includes(chap.id);
                    return (
                      <button
                        key={chap.id}
                        onClick={() => handleToggleChapter(chap.id)}
                        style={{
                          textAlign: "left",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          border: `1px solid ${isSelected ? GOLD : "rgba(156,122,47,0.15)"}`,
                          background: isSelected ? GOLD_LIGHT : "#fff",
                          fontSize: "11px",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between"
                        }}
                      >
                        <span>{chap.name}</span>
                        <span style={{ fontWeight: "bold" }}>₹{chap.cost}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress Utilization Bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: INK_MUTED, marginBottom: "4px" }}>
                  <span>Budget Utilisation</span>
                  <span>{Math.round((totalCost / clientBudget) * 100)}%</span>
                </div>
                <div style={{ height: "12px", width: "100%", background: "rgba(156,122,47,0.1)", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(156,122,47,0.2)" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, (totalCost / clientBudget) * 100)}%`,
                      background: totalCost > clientBudget ? RED : GREEN,
                      transition: "all 0.5s ease",
                      borderRadius: "6px"
                    }}
                  />
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(156,122,47,0.15)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "12.5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Matching Retrieval Fee:</span>
                  <span style={{ fontWeight: 600 }}>₹{baseMatchingFee}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Selected Kāṇḍas Cost:</span>
                  <span style={{ fontWeight: 600 }}>₹{totalCost - baseMatchingFee}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed rgba(156,122,47,0.2)", paddingTop: "4px", fontSize: "13.5px", fontWeight: "bold" }}>
                  <span>Total Cost:</span>
                  <span style={{ color: totalCost > clientBudget ? RED : GREEN }}>₹{totalCost}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: INK_MUTED }}>
                  <span>Estimated Time:</span>
                  <span>~{totalHours.toFixed(1)} hrs</span>
                </div>
              </div>

              {totalCost > clientBudget && (
                <div style={{ padding: "10px", borderRadius: "6px", background: "rgba(162,58,30,0.06)", border: `1px solid ${RED}`, display: "flex", gap: "6px", alignItems: "flex-start" }}>
                  <ShieldCheck size={16} style={{ color: RED, flexShrink: 0, marginTop: "2px" }} />
                  <div style={{ fontSize: "11.5px", color: INK_PRIMARY }}>
                    <strong style={{ color: RED }}>BUDGET EXCEEDED WARNING:</strong> High financial harm risk. Instruct the seeker to deselect chapters and focus only on immediate questions.
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
}
