"use client";

import React, { useState } from "react";
import { AlertOctagon, CheckCircle, XCircle, Info, RefreshCw, Award } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface Scenario {
  id: number;
  statement: string;
  correctCategory: "Sensationalism" | "Dismissal" | "Accurate";
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    statement: "Tantra is a collection of sexual techniques and sensory indulgences created to achieve spiritual ecstasy and cosmic orgasms in modern life.",
    correctCategory: "Sensationalism",
    explanation: "Correct! This is a classic Western pop-culture caricature. It reduces Tantra to physical sensationalism, ignoring the vast, strict corpus of mantra-śāstra, ritual liturgy, and meditative discipline."
  },
  {
    id: 2,
    statement: "Tantra is a set of superstitious charms and black magic rituals written by primitive minds to exploit gullible people. It has no value for serious astrology.",
    correctCategory: "Dismissal",
    explanation: "Correct! This represents reflexive dismissal. It writes off a highly structured and sophisticated esoteric science as primitive superstition, overlooking its role as the systematic framework for mantra and yantra remediation."
  },
  {
    id: 3,
    statement: "Tantra is a ritual-technical science that uses geometric diagrams (yantras), vocalized vibrations (mantras), and focused visualization (dhyāna) to align energy fields under lineage guidance.",
    correctCategory: "Accurate",
    explanation: "Correct! Defining Tantra as a systematic loom/technique of energy control respects both classical sources (the Āgamas) and traditional lineages, avoiding emotional bias."
  }
];

export function TantraContextNote() {
  const [activeTab, setActiveTab] = useState<"compare" | "audit">("compare");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});
  const [lensPosition, setLensPosition] = useState<"sensational" | "dismiss" | "accurate">("accurate");

  const handleSelectAnswer = (scenarioId: number, category: string) => {
    setSelectedAnswers(prev => ({ ...prev, [scenarioId]: category }));
    setShowFeedback(prev => ({ ...prev, [scenarioId]: true }));
  };

  const resetAudit = () => {
    setSelectedAnswers({});
    setShowFeedback({});
  };

  const getScore = () => {
    let score = 0;
    SCENARIOS.forEach(s => {
      if (selectedAnswers[s.id] === s.correctCategory) score++;
    });
    return score;
  };

  const allAnswered = Object.keys(selectedAnswers).length === SCENARIOS.length;

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <style>{`
        .tab-btn {
          border: 1px solid transparent;
          background: transparent;
          transition: all 0.2s ease-in-out;
        }
        .tab-btn.active {
          border-color: rgba(156,122,47,0.2);
          background: #ffffff;
          color: ${GOLD_DEEP};
          font-weight: 800;
        }
        .quiz-choice-btn {
          border: 1.5px solid rgba(156,122,47,0.15);
          background: rgba(255,255,255,0.45);
          transition: all 0.2s ease;
        }
        .quiz-choice-btn:hover:not(:disabled) {
          border-color: ${GOLD};
          background: rgba(251,248,243,0.7);
        }
        .lens-nav-btn {
          flex: 1;
          padding: 6px;
          border: 1px solid rgba(156,122,47,0.15);
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
      `}</style>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", borderBottom: "1px solid rgba(156,122,47,0.1)", paddingBottom: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Tantra Context & Cultural Care Note
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Train your academic clarity: learn to present Tantra objectively as a structured ritual science, avoiding popular caricatures and reactive scorn.
          </p>
        </div>
      </div>

      {/* TABS CONTROLLER */}
      <div style={{ display: "flex", background: "rgba(0,0,0,0.04)", borderRadius: "8px", padding: "3px", alignSelf: "flex-start", gap: "4px" }}>
        <button
          onClick={() => setActiveTab("compare")}
          className={`tab-btn ${activeTab === "compare" ? "active" : ""}`}
          style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "11.5px", cursor: "pointer", color: INK_SECONDARY }}
        >
          Academic Framing Lens
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`tab-btn ${activeTab === "audit" ? "active" : ""}`}
          style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "11.5px", cursor: "pointer", color: INK_SECONDARY }}
        >
          Cultural Care Auditor
        </button>
      </div>

      {/* TAB 1: COMPARE (WITH INTERACTIVE ACADEMIC LENS) */}
      {activeTab === "compare" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          {/* LENS CONTROLLER SLIDER */}
          <div style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "10.5px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
              Slide the Academic Framing Lens
            </span>
            
            {/* Horizontal Pill Selectors */}
            <div style={{ display: "flex", gap: "6px" }}>
              <button 
                onClick={() => setLensPosition("sensational")} 
                className="lens-nav-btn"
                style={{ 
                  background: lensPosition === "sensational" ? "rgba(173, 75, 55, 0.15)" : "#ffffff", 
                  borderColor: lensPosition === "sensational" ? "#ad4b37" : "rgba(156,122,47,0.15)",
                  color: lensPosition === "sensational" ? "#ad4b37" : INK_SECONDARY
                }}
              >
                Pop Sensationalism Lens
              </button>
              <button 
                onClick={() => setLensPosition("dismiss")} 
                className="lens-nav-btn"
                style={{ 
                  background: lensPosition === "dismiss" ? "rgba(124, 109, 91, 0.15)" : "#ffffff", 
                  borderColor: lensPosition === "dismiss" ? INK_MUTED : "rgba(156,122,47,0.15)",
                  color: lensPosition === "dismiss" ? INK_MUTED : INK_SECONDARY
                }}
              >
                Reflexive Dismissal Lens
              </button>
              <button 
                onClick={() => setLensPosition("accurate")} 
                className="lens-nav-btn"
                style={{ 
                  background: lensPosition === "accurate" ? "rgba(78, 112, 55, 0.15)" : "#ffffff", 
                  borderColor: lensPosition === "accurate" ? "#4e7037" : "rgba(156,122,47,0.15)",
                  color: lensPosition === "accurate" ? "#4e7037" : INK_SECONDARY
                }}
              >
                Āgamic Traditional Lens
              </button>
            </div>

            {/* LENS VIEWER DISPLAY CARD */}
            <div style={{ 
              background: "#ffffff", 
              borderRadius: "10px", 
              padding: "16px", 
              border: `1.5px solid ${
                lensPosition === "sensational" ? "#ad4b37" :
                lensPosition === "dismiss" ? INK_MUTED :
                "#4e7037"
              }`,
              minHeight: "100px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              transition: "all 0.3s ease"
            }}>
              <span style={{ 
                fontSize: "9px", 
                fontWeight: 900, 
                textTransform: "uppercase", 
                color: 
                  lensPosition === "sensational" ? "#ad4b37" :
                  lensPosition === "dismiss" ? INK_MUTED :
                  "#4e7037"
              }}>
                {lensPosition === "sensational" ? "Visual Filter: Western Pop Caricature" :
                 lensPosition === "dismiss" ? "Visual Filter: Reactive Rationalist Dismissal" :
                 "Visual Filter: Authentic Liturgical Science"}
              </span>

              {/* Text switches dynamically based on lens position */}
              {lensPosition === "sensational" && (
                <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: "#762e21", fontStyle: "italic" }}>
                  "Tantra is primarily an exotic method of sexual exercises, sensory indulgence, and physical ecstasy redesigned to help modern westerners achieve cosmic thrills..."
                </p>
              )}
              {lensPosition === "dismiss" && (
                <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY, fontStyle: "italic" }}>
                  "Tantra is a collection of primitive black magic tricks, superstitious charms, and mystical nonsense used to exploit vulnerable minds, carrying no values for study..."
                </p>
              )}
              {lensPosition === "accurate" && (
                <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.45", color: "#344e24", fontWeight: 700 }}>
                  "Tantra is a structured ritual-technical science (literally: 'loom') utilizing yantras (geometry), mantras (sound vibrations), and dhyāna (visual meditation) under lineage guidance to calibrate internal fields."
                </p>
              )}
            </div>
          </div>

          {/* SANSKRITIC TERMINOLOGY GLOSSARY */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              Key Sanskritic Terminology (Lesson Context)
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px" }}>
              <div style={{ background: "rgba(156, 122, 47, 0.03)", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "10px", padding: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Tantra</strong>
                  <span style={{ fontSize: "12px", fontFamily: "'Noto Serif Devanagari', serif", color: GOLD }}>तन्त्र</span>
                </div>
                <div style={{ fontSize: "9px", color: INK_MUTED, fontStyle: "italic", marginTop: "2px" }}>Literal: "loom / technique"</div>
                <p style={{ margin: "4px 0 0 0", fontSize: "10.5px", lineHeight: "1.35", color: INK_SECONDARY }}>
                  A ritual-technical science organizing mantra, yantra, and dhyāna into systematic energy-work methods.
                </p>
              </div>

              <div style={{ background: "rgba(156, 122, 47, 0.03)", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "10px", padding: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Āgama-Tantra</strong>
                  <span style={{ fontSize: "12px", fontFamily: "'Noto Serif Devanagari', serif", color: GOLD }}>आगम-तन्त्र</span>
                </div>
                <div style={{ fontSize: "9px", color: INK_MUTED, fontStyle: "italic", marginTop: "2px" }}>Scriptural Corpus</div>
                <p style={{ margin: "4px 0 0 0", fontSize: "10.5px", lineHeight: "1.35", color: INK_SECONDARY }}>
                  The foundational textual authority containing liturgical rules, geometric layouts, and spiritual practices.
                </p>
              </div>

              <div style={{ background: "rgba(156, 122, 47, 0.03)", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "10px", padding: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Dīkṣā</strong>
                  <span style={{ fontSize: "12px", fontFamily: "'Noto Serif Devanagari', serif", color: GOLD }}>दीक्षा</span>
                </div>
                <div style={{ fontSize: "9px", color: INK_MUTED, fontStyle: "italic", marginTop: "2px" }}>Lineage Initiation</div>
                <p style={{ margin: "4px 0 0 0", fontSize: "10.5px", lineHeight: "1.35", color: INK_SECONDARY }}>
                  Formal transmission from guru to disciple required to enlive and safely practice gated bīja-mantras.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: AUDITOR */}
      {activeTab === "audit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          <div style={{ background: "rgba(156, 122, 47, 0.05)", border: "1px dashed rgba(156,122,47,0.25)", borderRadius: "10px", padding: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Info size={14} style={{ color: GOLD_DEEP, flexShrink: 0 }} />
            <span style={{ fontSize: "10.5px", color: INK_SECONDARY }}>
              Categorize each statement below correctly. Aim to identify biased extremes vs. academic framing.
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {SCENARIOS.map((s) => {
              const selectedCategory = selectedAnswers[s.id];
              const isSubmitted = showFeedback[s.id];
              const isCorrect = selectedCategory === s.correctCategory;

              return (
                <div
                  key={s.id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(156, 122, 47, 0.15)",
                    borderRadius: "12px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <span style={{
                      background: "rgba(156,122,47,0.1)",
                      color: GOLD_DEEP,
                      fontWeight: 800,
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      flexShrink: 0
                    }}>
                      S{s.id}
                    </span>
                    <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: INK_PRIMARY, lineHeight: "1.4" }}>
                      "{s.statement}"
                    </p>
                  </div>

                  {/* SELECT BUTTONS */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {[
                      { val: "Sensationalism", text: "Western Sensationalism" },
                      { val: "Dismissal", text: "Reflexive Dismissal" },
                      { val: "Accurate", text: "Accurate / Respectful" }
                    ].map((opt) => {
                      const isChosen = selectedCategory === opt.val;
                      
                      let bg = undefined;
                      let color = undefined;
                      let borderStyle = undefined;

                      if (isChosen) {
                        if (isSubmitted) {
                          bg = isCorrect ? "rgba(78, 112, 55, 0.1)" : "rgba(173, 75, 55, 0.1)";
                          color = isCorrect ? "#4e7037" : "#ad4b37";
                          borderStyle = `1.5px solid ${isCorrect ? "#4e7037" : "#ad4b37"}`;
                        } else {
                          bg = GOLD_DEEP;
                          color = "#ffffff";
                          borderStyle = `1.5px solid ${GOLD_DEEP}`;
                        }
                      }

                      return (
                        <button
                          key={opt.val}
                          disabled={isSubmitted}
                          onClick={() => handleSelectAnswer(s.id, opt.val)}
                          className="quiz-choice-btn"
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "10.5px",
                            fontWeight: isChosen ? 750 : "normal",
                            cursor: isSubmitted ? "not-allowed" : "pointer",
                            background: bg,
                            color: color,
                            border: borderStyle
                          }}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>

                  {/* FEEDBACK BLOCK */}
                  {isSubmitted && (
                    <div style={{
                      background: isCorrect ? "rgba(78, 112, 55, 0.04)" : "rgba(173, 75, 55, 0.04)",
                      borderLeft: `3px solid ${isCorrect ? "#4e7037" : "#ad4b37"}`,
                      padding: "8px 12px",
                      borderRadius: "0 8px 8px 0",
                      fontSize: "11px",
                      lineHeight: "1.4",
                      color: isCorrect ? "#344e24" : "#762e21",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "6px"
                    }}>
                      {isCorrect ? (
                        <CheckCircle size={14} style={{ color: "#4e7037", marginTop: "2px", flexShrink: 0 }} />
                      ) : (
                        <XCircle size={14} style={{ color: "#ad4b37", marginTop: "2px", flexShrink: 0 }} />
                      )}
                      <div>
                        <strong>{isCorrect ? "Correct Classification!" : "Incorrect Classification."}</strong>
                        <p style={{ margin: "2px 0 0 0" }}>{s.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SCORED COMPLETED MESSAGE */}
          {allAnswered && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(251, 248, 243, 0.8)",
              border: `1.5px solid ${GOLD}`,
              textAlign: "center"
            }}>
              <Award size={28} style={{ color: GOLD_DEEP }} />
              <div>
                <span style={{ fontSize: "13px", fontWeight: 850, color: GOLD_DEEP }}>
                  Audit Score: {getScore()} / {SCENARIOS.length}
                </span>
                <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
                  {getScore() === SCENARIOS.length 
                    ? "Excellent! You easily distinguish cultural distortions from objective traditional definitions."
                    : "Review the comparative grid and try again to refine your understanding."
                  }
                </p>
              </div>
              <button
                onClick={resetAudit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: GOLD_DEEP,
                  color: "#ffffff",
                  fontSize: "10.5px",
                  fontWeight: 750,
                  cursor: "pointer",
                  marginTop: "6px"
                }}
              >
                <RefreshCw size={10} /> Reset Auditor
              </button>
            </div>
          )}

        </div>
      )}

      {/* PERMANENT PRACTICE BOUNDARY WARNING */}
      <div style={{
        background: "rgba(173, 75, 55, 0.05)",
        border: "1.5px solid rgba(173, 75, 55, 0.25)",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        alignItems: "flex-start",
        gap: "8px"
      }}>
        <AlertOctagon size={16} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#ad4b37", textTransform: "uppercase" }}>
            Critical Tier-1 Competence Boundary
          </span>
          <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#762e21" }}>
            As a Tier-1 student/graduate, you are trained to <strong>explain</strong> the purpose and place of Tantra remedies. You are <strong>strictly prohibited</strong> from prescribing, constructing, or enlivening yantras, or instructing clients in gated bīja-mantras. Prescription authority belongs strictly to initiated lineage masters or advanced practitioners.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(156,122,47,0.08)",
        paddingTop: "8px",
        fontSize: "10px",
        color: INK_MUTED
      }}>
        <span>Grahvani Learning Runtime (Chapter 3)</span>
        <span>Cultural Care Auditor</span>
      </div>
    </div>
  );
}
