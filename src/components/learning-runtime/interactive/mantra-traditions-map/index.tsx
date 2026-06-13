"use client";

import React, { useState } from "react";
import { Info, HelpCircle, CheckCircle, XCircle, RefreshCw, BookOpen, UserCheck, ShieldAlert, Award, Grid, Compass } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const TRADITIONS = [
  {
    id: "vaidika",
    name: "Vaidika",
    translation: "Vedic",
    source: "The Vedas (Ṛg Veda, Yajur Veda, Sāma Veda)",
    example: "Gāyatrī Mantra",
    rules: "Demands strict pronunciation and svara (pitch-accent). Historically associated with specific eligibility or initiation conventions.",
    badge: "Strict & Pitch-Gated",
    badgeBg: "rgba(156, 122, 47, 0.08)",
    badgeColor: GOLD_DEEP
  },
  {
    id: "smarta",
    name: "Smārta",
    translation: "Purāṇic / Devotional",
    source: "The Smṛti and Purāṇic corpus",
    example: "Viṣṇu Sahasranāma, Nāma-japa",
    rules: "Broadly accessible devotional practice. No strict eligibility rules or pitch-accents required. Accessible to all seekers.",
    badge: "Broadly Accessible",
    badgeBg: "rgba(78, 112, 55, 0.08)",
    badgeColor: "#4e7037"
  },
  {
    id: "tantrika",
    name: "Tāntrika",
    translation: "Tantric",
    source: "Āgama-Tantra texts",
    example: "Bīja-mantras (Hrīṁ, Aiṁ, Klīṁ)",
    rules: "Typically requires dīkṣā (initiation) from a qualified guru within a lineage. Casual practice without a guru is contraindicated.",
    badge: "Initiation Gated",
    badgeBg: "rgba(173, 75, 55, 0.08)",
    badgeColor: "#ad4b37"
  }
];

const MATRIX_ROWS = [
  {
    dimension: "Source Corpora",
    vaidika: "The Vedas (Śruti)",
    smarta: "Smṛti & Purāṇas",
    tantrika: "Āgamas & Tantras",
    explanation: "Vaidika comes from eternal heard revelation (Śruti). Smārta comes from remembered history (Smṛti) and Purāṇic legends. Tāntrika is sourced from esoteric dialogues (Āgamas)."
  },
  {
    dimension: "Core Example",
    vaidika: "Gāyatrī / Mahāmṛtyuñjaya",
    smarta: "Viṣṇu Sahasranāma",
    tantrika: "Bīja syllables (Hrīṁ)",
    explanation: "Vaidika contains structural prayers. Smārta uses name lists (nāma-japa) and praises. Tāntrika focuses on sound-seeds (bījas) with no direct verbal meaning."
  },
  {
    dimension: "Accent Discipline",
    vaidika: "Rigid Svara (Pitch)",
    smarta: "Devotional Sincerity",
    tantrika: "Lineage Resonance",
    explanation: "Vedic chanting requires precise tone accents (udātta, anudātta, svarita). Smārta prioritizes devotion (bhakti). Tantric requires lineage-exact phonetic vibration."
  },
  {
    dimension: "Initiation Needed",
    vaidika: "Traditional Gating",
    smarta: "No (Open to All)",
    tantrika: "Guru Dīkṣā Required",
    explanation: "Vaidika historically required sacred thread investiture (upanayana). Smārta needs no initiation. Tāntrika strictly demands guru-disciple dīkṣā."
  },
  {
    dimension: "Client Eligibility",
    vaidika: "Qualified Seekers Only",
    smarta: "Broadly Open",
    tantrika: "Esoteric Lineage Gated",
    explanation: "Vaidika is gated by capability and discipline. Smārta is a safe universal remedy. Tāntrika is highly specialized and dangerous if self-prescribed."
  }
];

interface QuizItem {
  id: number;
  question: string;
  correctTraditionId: string;
  explanation: string;
}

const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 1,
    question: "You want to recite the Gāyatrī mantra using the traditional pitch accents (svara) as codified in the Ṛg Veda.",
    correctTraditionId: "vaidika",
    explanation: "Vaidika mantras come directly from the Vedas and require strict adherence to pitch accent (svara) and precise pronunciation rules."
  },
  {
    id: 2,
    question: "A seeker wants to chant 'Om Namo Nārāyaṇāya' as a devotional name repetition (nāma-japa) for spiritual peace, requiring no formal initiation.",
    correctTraditionId: "smarta",
    explanation: "This is a Smārta practice. Coming from the Purāṇic/Smṛti corpus, devotional name repetition is open and accessible to all without formal requirements."
  },
  {
    id: 3,
    question: "A practitioner wishes to adopt the seed syllable 'Hrīṁ' for intensive daily focus and seeks formal dīkṣā (initiation) from a lineage teacher.",
    correctTraditionId: "tantrika",
    explanation: "Tāntrika practices, specifically single-syllable bīja mantras, carry strong warnings against casual use and traditionally require formal initiation (dīkṣā)."
  },
  {
    id: 4,
    question: "The rules of practice declare that the mantra's efficacy is grounded in devotion and mental sincerity, rather than pitch-accent accuracy.",
    correctTraditionId: "smarta",
    explanation: "Smārta practices emphasize accessibility and devotion (bhakti) over the rigid accent-discipline of Vedic recitation."
  },
  {
    id: 5,
    question: "The mantra source is the classical Āgama texts, and practice is strictly governed by the guru-disciple lineage.",
    correctTraditionId: "tantrika",
    explanation: "The Āgamas are the foundational texts of the Tāntrika tradition, which heavily centers around the guidance of a guru and initiation."
  }
];

export function MantraTraditionsMap() {
  const [viewMode, setViewMode] = useState<"atlas" | "dojo">("atlas");
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedMatrixRow, setSelectedMatrixRow] = useState<number | null>(0);

  const triggerVibration = (pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (err) {
        console.warn("Haptic vibration blocked or unsupported:", err);
      }
    }
  };

  const handleSelectAnswer = (traditionId: string) => {
    if (selectedAnswers[activeQuizIndex] !== undefined) return; // already answered
    const isCorrect = traditionId === QUIZ_ITEMS[activeQuizIndex].correctTraditionId;
    if (isCorrect) {
      triggerVibration(60);
    } else {
      triggerVibration([50, 50]);
    }
    setSelectedAnswers(prev => ({ ...prev, [activeQuizIndex]: traditionId }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (activeQuizIndex < QUIZ_ITEMS.length - 1) {
      triggerVibration(50);
      setActiveQuizIndex(prev => prev + 1);
    } else {
      triggerVibration([80, 40, 80]); // quiz complete flourish
      // Trigger complete by updating count
      setActiveQuizIndex(prev => prev + 1);
    }
  };

  const resetDojo = () => {
    triggerVibration(80);
    setSelectedAnswers({});
    setActiveQuizIndex(0);
    setShowExplanation(false);
  };

  const score = Object.keys(selectedAnswers).reduce((acc, qIdx) => {
    const qNum = Number(qIdx);
    return selectedAnswers[qNum] === QUIZ_ITEMS[qNum].correctTraditionId ? acc + 1 : acc;
  }, 0);

  const activeQuestion = QUIZ_ITEMS[activeQuizIndex >= QUIZ_ITEMS.length ? QUIZ_ITEMS.length - 1 : activeQuizIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === QUIZ_ITEMS.length;

  return (
    <div style={{
      padding: "16px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.75)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(156, 122, 47, 0.15)",
      fontFamily: "'Inter', sans-serif",
      color: INK_PRIMARY,
      maxWidth: "960px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }}>
      {/* Styles for dynamic card hovers */}
      <style>{`
        .tradition-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(156, 122, 47, 0.1);
        }
        .tradition-card-hovered {
          transform: translateY(-3px);
          border-color: ${GOLD};
          box-shadow: 0 4px 12px rgba(156, 122, 47, 0.1);
          background: rgba(251, 248, 243, 0.9) !important;
        }
        .quiz-choice-btn {
          transition: all 0.2s ease-in-out;
          border: 1.5px solid rgba(156, 122, 47, 0.15);
        }
        .quiz-choice-btn:hover:not(:disabled) {
          border-color: ${GOLD};
          background: rgba(156, 122, 47, 0.06);
          transform: scale(1.02);
        }
        .matrix-row {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .matrix-row:hover {
          background: rgba(156, 122, 47, 0.05);
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        borderBottom: "1px solid rgba(156,122,47,0.1)",
        paddingBottom: "10px"
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Mantra Traditions Map & Dojo
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Understand why the mantra's source sets the rules, and test your knowledge in the Dojo.
          </p>
        </div>
      </div>

      {/* SUB-TABS (Atlas vs Dojo) */}
      <div style={{
        display: "flex",
        gap: "4px",
        background: "rgba(156, 122, 47, 0.05)",
        padding: "4px",
        borderRadius: "10px"
      }}>
        <button
          onClick={() => {
            triggerVibration(40);
            setViewMode("atlas");
          }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "8px 12px",
            border: "none",
            borderRadius: "8px",
            background: viewMode === "atlas" ? "#ffffff" : "transparent",
            color: viewMode === "atlas" ? GOLD_DEEP : INK_SECONDARY,
            fontSize: "12px",
            fontWeight: viewMode === "atlas" ? 800 : 600,
            cursor: "pointer",
            boxShadow: viewMode === "atlas" ? "0 2px 6px rgba(0,0,0,0.05)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          <Compass size={14} />
          Traditions Atlas & Matrix
        </button>
        <button
          onClick={() => {
            triggerVibration(40);
            setViewMode("dojo");
          }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "8px 12px",
            border: "none",
            borderRadius: "8px",
            background: viewMode === "dojo" ? "#ffffff" : "transparent",
            color: viewMode === "dojo" ? GOLD_DEEP : INK_SECONDARY,
            fontSize: "12px",
            fontWeight: viewMode === "dojo" ? 800 : 600,
            cursor: "pointer",
            boxShadow: viewMode === "dojo" ? "0 2px 6px rgba(0,0,0,0.05)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          <HelpCircle size={14} />
          Matching Dojo Quiz
        </button>
      </div>

      {/* VIEW 1: ATLAS & COMPARATIVE MATRIX */}
      {viewMode === "atlas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Side-by-side tradition cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "12px"
          }}>
            {TRADITIONS.map(trad => {
              const isHovered = hoveredCard === trad.id;
              return (
                <div
                  key={trad.id}
                  className={`tradition-card ${isHovered ? "tradition-card-hovered" : ""}`}
                  onMouseEnter={() => setHoveredCard(trad.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: "rgba(255, 255, 255, 0.45)",
                    padding: "14px",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "8px"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 850, color: GOLD_DEEP }}>
                          {trad.name}
                        </h4>
                        <span style={{ fontSize: "9.5px", color: INK_MUTED, fontStyle: "italic" }}>
                          ({trad.translation})
                        </span>
                      </div>
                      <span style={{
                        fontSize: "8.5px",
                        fontWeight: 800,
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: trad.badgeBg,
                        color: trad.badgeColor
                      }}>
                        {trad.badge}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px", marginTop: "4px" }}>
                      <div>
                        <strong style={{ color: INK_SECONDARY, display: "flex", alignItems: "center", gap: "4px" }}>
                          <BookOpen size={11} style={{ color: GOLD }} /> Source:
                        </strong>
                        <div style={{ color: INK_PRIMARY, marginTop: "1px" }}>{trad.source}</div>
                      </div>
                      <div>
                        <strong style={{ color: INK_SECONDARY, display: "flex", alignItems: "center", gap: "4px" }}>
                          <UserCheck size={11} style={{ color: GOLD }} /> Example:
                        </strong>
                        <div style={{ color: INK_PRIMARY, marginTop: "1px", fontWeight: 700 }}>{trad.example}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    border: "1px dashed rgba(156,122,47,0.12)",
                    padding: "8px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: INK_SECONDARY,
                    lineHeight: "1.35",
                    marginTop: "6px"
                  }}>
                    <strong style={{ color: GOLD_DEEP, fontSize: "10.5px" }}>Rules & Discipline:</strong>
                    <p style={{ margin: "2px 0 0 0", color: INK_PRIMARY }}>{trad.rules}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Comparison Matrix */}
          <div style={{
            background: "rgba(255,255,255,0.45)",
            border: "1px solid rgba(156,122,47,0.12)",
            borderRadius: "12px",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", borderBottom: "1px solid rgba(156,122,47,0.08)", paddingBottom: "6px" }}>
              <Grid size={14} style={{ color: GOLD }} />
              <span style={{ fontSize: "12px", fontWeight: 800, color: GOLD_DEEP }}>
                Doctrinal Comparison Matrix
              </span>
              <span style={{ fontSize: "10px", color: INK_MUTED, marginLeft: "auto" }}>
                Click row to view detail breakdown
              </span>
            </div>

            {/* Matrix Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1.5px solid rgba(156,122,47,0.15)", color: GOLD_DEEP, fontWeight: 800 }}>
                    <th style={{ padding: "8px 6px" }}>Dimension</th>
                    <th style={{ padding: "8px 6px" }}>Vaidika (Vedic)</th>
                    <th style={{ padding: "8px 6px" }}>Smārta (Purāṇic)</th>
                    <th style={{ padding: "8px 6px" }}>Tāntrika (Tantric)</th>
                  </tr>
                </thead>
                <tbody>
                  {MATRIX_ROWS.map((row, idx) => {
                    const isSelected = selectedMatrixRow === idx;
                    return (
                      <tr
                        key={row.dimension}
                        onClick={() => {
                          triggerVibration(45);
                          setSelectedMatrixRow(idx);
                        }}
                        className="matrix-row"
                        style={{
                          borderBottom: "1px solid rgba(156,122,47,0.08)",
                          background: isSelected ? "rgba(156, 122, 47, 0.06)" : "transparent",
                          fontWeight: isSelected ? 750 : "normal"
                        }}
                      >
                        <td style={{ padding: "10px 6px", color: GOLD_DEEP, fontWeight: 700 }}>{row.dimension}</td>
                        <td style={{ padding: "10px 6px", color: INK_PRIMARY }}>{row.vaidika}</td>
                        <td style={{ padding: "10px 6px", color: INK_PRIMARY }}>{row.smarta}</td>
                        <td style={{ padding: "10px 6px", color: INK_PRIMARY }}>{row.tantrika}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Matrix Explanation Card */}
            {selectedMatrixRow !== null && (
              <div style={{
                background: "rgba(251, 248, 243, 0.85)",
                border: `1px solid ${GOLD}`,
                borderRadius: "8px",
                padding: "10px 12px",
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
                marginTop: "4px"
              }}>
                <Info size={14} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong style={{ fontSize: "10.5px", color: GOLD_DEEP }}>
                    Doctrinal Context: {MATRIX_ROWS[selectedMatrixRow].dimension}
                  </strong>
                  <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_PRIMARY, lineHeight: "1.4" }}>
                    {MATRIX_ROWS[selectedMatrixRow].explanation}
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* VIEW 2: MATCHING DOJO QUIZ */}
      {viewMode === "dojo" && (
        <div style={{
          background: "rgba(255, 255, 255, 0.4)",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(156,122,47,0.06)", paddingBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: GOLD_DEEP }}>
              Tradition Matching Dojo
            </span>
            <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD }}>
              Dojo Score: {score} / {QUIZ_ITEMS.length}
            </span>
          </div>

          {!isComplete ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              
              {/* Progress Dots */}
              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                {QUIZ_ITEMS.map((_, idx) => {
                  const isCurrent = activeQuizIndex === idx;
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isCorrect = isAnswered && selectedAnswers[idx] === QUIZ_ITEMS[idx].correctTraditionId;
                  
                  let bg = "rgba(0,0,0,0.06)";
                  let border = "1px solid transparent";
                  if (isCurrent) {
                    bg = "#ffffff";
                    border = `1.5px solid ${GOLD}`;
                  } else if (isAnswered) {
                    bg = isCorrect ? "#4e7037" : "#ad4b37";
                  }

                  return (
                    <div
                      key={idx}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: bg,
                        border: border,
                        transition: "all 0.2s"
                      }}
                    />
                  );
                })}
              </div>

              {/* Scenario / Question */}
              <div style={{
                background: "rgba(255, 253, 248, 0.9)",
                border: `1.5px solid ${GOLD}`,
                borderRadius: "10px",
                padding: "14px",
                textAlign: "center"
              }}>
                <span style={{ fontSize: "9.5px", textTransform: "uppercase", fontWeight: 800, color: GOLD_DEEP, letterSpacing: "0.5px" }}>
                  Practice Scenario {activeQuizIndex + 1}
                </span>
                <p style={{ margin: "6px 0 0 0", fontSize: "12px", fontWeight: 750, color: INK_PRIMARY, lineHeight: "1.4" }}>
                  "{activeQuestion.question}"
                </p>
              </div>

              {/* Choices */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {TRADITIONS.map(trad => {
                  const isChosen = selectedAnswers[activeQuizIndex] === trad.id;
                  const isCorrect = trad.id === activeQuestion.correctTraditionId;
                  const hasAnswered = selectedAnswers[activeQuizIndex] !== undefined;

                  let border = "1.5px solid rgba(156,122,47,0.15)";
                  let bg = "rgba(255, 255, 255, 0.6)";
                  let color = INK_PRIMARY;

                  if (hasAnswered) {
                    if (isCorrect) {
                      border = "1.5px solid #4e7037";
                      bg = "rgba(78, 112, 55, 0.12)";
                      color = "#344e24";
                    } else if (isChosen) {
                      border = "1.5px solid #ad4b37";
                      bg = "rgba(173, 75, 55, 0.12)";
                      color = "#762e21";
                    }
                  }

                  return (
                    <button
                      key={trad.id}
                      onClick={() => handleSelectAnswer(trad.id)}
                      disabled={hasAnswered}
                      className="quiz-choice-btn"
                      style={{
                        padding: "10px 6px",
                        borderRadius: "8px",
                        background: bg,
                        border: border,
                        color: color,
                        fontWeight: 750,
                        fontSize: "11px",
                        cursor: hasAnswered ? "not-allowed" : "pointer"
                      }}
                    >
                      {trad.name}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {showExplanation && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.5)",
                  border: "1px solid rgba(156,122,47,0.1)",
                  borderRadius: "8px",
                  padding: "10px 14px"
                }}>
                  <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                    {selectedAnswers[activeQuizIndex] === activeQuestion.correctTraditionId ? (
                      <CheckCircle size={14} style={{ color: "#4e7037", marginTop: "2px", flexShrink: 0 }} />
                    ) : (
                      <XCircle size={14} style={{ color: "#ad4b37", marginTop: "2px", flexShrink: 0 }} />
                    )}
                    <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.3", color: INK_SECONDARY }}>
                      {activeQuestion.explanation}
                    </p>
                  </div>
                  <button
                    onClick={handleNext}
                    style={{
                      alignSelf: "flex-end",
                      padding: "6px 16px",
                      borderRadius: "6px",
                      background: GOLD,
                      border: "none",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 750,
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                  >
                    {activeQuizIndex === QUIZ_ITEMS.length - 1 ? "Show Results" : "Next Question"}
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Results Dashboard */
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 0",
              gap: "12px",
              textAlign: "center"
            }}>
              <Award size={36} style={{ color: GOLD }} />
              <div>
                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 850 }}>Dojo Completed!</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
                  You successfully mapped {score} out of {QUIZ_ITEMS.length} scenarios to their correct traditions.
                </p>
              </div>
              
              <button
                onClick={resetDojo}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "8px",
                  background: GOLD_DEEP,
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 750,
                  cursor: "pointer"
                }}
              >
                <RefreshCw size={12} /> Reset Dojo Practice
              </button>
            </div>
          )}
        </div>
      )}

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
        <span>Grahvani Learning Runtime (Chapter 2)</span>
        <span>Tradition Mapping Dojo</span>
      </div>
    </div>
  );
}
