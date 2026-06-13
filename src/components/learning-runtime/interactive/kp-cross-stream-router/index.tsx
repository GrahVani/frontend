"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const CRIMSON = "#A23A1E";

interface Scenario {
  id: number;
  question: string;
  correctAnswer: "kp" | "parashari" | "both";
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    question: "Will my visa be approved, and by roughly what month?",
    correctAnswer: "kp",
    explanation: "This is a pinpoint event-timing question. KP's significator hierarchy and sub-lord overlay are built exactly for this level of date-window precision."
  },
  {
    id: 2,
    question: "What are the overall themes, challenges, and strengths in my child's life?",
    correctAnswer: "parashari",
    explanation: "This is a broad life-narrative question. Parāśarī excels at weaving together house lords, yogas, and divisional charts (vargas) to paint a holistic life portrait."
  },
  {
    id: 3,
    question: "Will I get this specific promotion at work?",
    correctAnswer: "kp",
    explanation: "This is a clear binary yes/no question. KP's cuspal sub-lord serves as the primary determinant for pinpointing a single promise."
  },
  {
    id: 4,
    question: "I want to know which planet lording my 10th house is strongest via Ṣaḍbala and Aṣṭakavarga.",
    correctAnswer: "parashari",
    explanation: "KP does not use Ṣaḍbala or Aṣṭakavarga. These are classic strength-scoring systems unique to the Parāśarī tradition."
  },
  {
    id: 5,
    question: "Will I get married? My birth time is uncertain, but I am asking the question right now.",
    correctAnswer: "kp",
    explanation: "Because the birth time is uncertain, casting a horary (praśna) chart using KP's 1-249 number system is the ideal route since it relies on the moment of the question, not birth coordinates."
  },
  {
    id: 6,
    question: "I need to understand the planetary yogas in my chart for wealth.",
    correctAnswer: "parashari",
    explanation: "The classical yoga catalog (e.g. Raja Yogas, Dhana Yogas) belongs exclusively to Parāśarī. KP focuses on significator chains rather than yogas."
  },
  {
    id: 7,
    question: "I am making an irreversible decision to buy a business. I want to verify if both systems align on the window.",
    correctAnswer: "both",
    explanation: "For major, high-stakes predictions where the querent will act irreversibly, the framework recommends running both streams separately. Convergence raises confidence; divergence flags nuance to investigate."
  },
  {
    id: 8,
    question: "Which sub-period within my running Venus mahādaśā will trigger travel?",
    correctAnswer: "kp",
    explanation: "Sub-period timing (daśā → bhukti → antara) falls under KP's modified Vimśottarī, where the sub-lord overlay pinpoints when significators trigger."
  }
];

export function KpCrossStreamRouter() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<"kp" | "parashari" | "both" | null>(null);
  const [score, setScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleRoute = (answer: "kp" | "parashari" | "both") => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(answer);
    if (answer === SCENARIOS[currentIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setCompleted(false);
  };

  const currentScenario = SCENARIOS[currentIndex];

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", color: INK_PRIMARY, fontFamily: "sans-serif" }} data-interactive="kp-cross-stream-router">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 8 · Lesson 3</span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.5rem", fontWeight: 700 }}>Client Question Decision Router</h1>
      </section>

      {!completed ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Progress & Score */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: INK_SECONDARY }}>
            <span>Question <strong>{currentIndex + 1}</strong> of <strong>{SCENARIOS.length}</strong></span>
            <span>Score: <strong style={{ color: GOLD }}>{score}</strong></span>
          </div>

          {/* Scenario Card */}
          <div style={{ border: `1.5px solid ${GOLD}`, borderRadius: 12, padding: "20px", background: SURFACE, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
            <span style={{ fontSize: "0.75rem", color: GOLD, textTransform: "uppercase", fontWeight: 700 }}>Client Question:</span>
            <p style={{ fontSize: "1.05rem", fontWeight: 600, margin: "8px 0 0", fontStyle: "italic", color: INK_PRIMARY }}>
              "{currentScenario.question}"
            </p>
          </div>

          {/* Decision Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {(["kp", "parashari", "both"] as const).map((choice) => {
              const isSelected = selectedAnswer === choice;
              const isCorrect = choice === currentScenario.correctAnswer;
              
              let btnBg = "transparent";
              let btnBorder = HAIRLINE;
              let btnColor = INK_PRIMARY;

              if (selectedAnswer !== null) {
                if (isSelected) {
                  btnBg = isCorrect ? GREEN : CRIMSON;
                  btnBorder = isCorrect ? GREEN : CRIMSON;
                  btnColor = "#FFFBF2";
                } else if (isCorrect) {
                  btnBg = `${GREEN}22`;
                  btnBorder = GREEN;
                  btnColor = GREEN;
                }
              }

              return (
                <button
                  key={choice}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleRoute(choice)}
                  style={{
                    flex: 1,
                    background: btnBg,
                    color: btnColor,
                    border: `1.5px solid ${btnBorder}`,
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: selectedAnswer !== null ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {choice === "kp" ? "Route to KP" : choice === "parashari" ? "Route to Parāśarī" : "Route to Both"}
                </button>
              );
            })}
          </div>

          {/* Feedback Section */}
          {selectedAnswer !== null && (
            <div style={{
              marginTop: "10px",
              padding: "16px",
              borderRadius: "8px",
              background: selectedAnswer === currentScenario.correctAnswer ? `${GREEN}11` : `${CRIMSON}11`,
              borderLeft: `4px solid ${selectedAnswer === currentScenario.correctAnswer ? GREEN : CRIMSON}`
            }}>
              <h4 style={{ margin: "0 0 6px 0", color: selectedAnswer === currentScenario.correctAnswer ? GREEN : CRIMSON, fontSize: "0.9rem", fontWeight: 700 }}>
                {selectedAnswer === currentScenario.correctAnswer ? "✓ Correct Route!" : "✗ Incorrect Route"}
              </h4>
              <p style={{ margin: 0, fontSize: "0.8rem", color: INK_PRIMARY, lineHeight: "1.4" }}>
                {currentScenario.explanation}
              </p>
              <button
                onClick={handleNext}
                style={{
                  marginTop: "12px",
                  background: GOLD,
                  color: "#FFFBF2",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 16px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                {currentIndex < SCENARIOS.length - 1 ? "Next Question" : "View Results"}
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Results View */
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", textAlign: "center", padding: "20px 0" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "40px",
            background: `${GREEN}1a`,
            border: `2px solid ${GREEN}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            color: GREEN,
            fontWeight: "bold"
          }}>
            {Math.round((score / SCENARIOS.length) * 100)}%
          </div>
          <h2 style={{ fontSize: "1.3rem", color: GOLD, margin: "10px 0 0 0" }}>Training Complete</h2>
          <p style={{ fontSize: "0.9rem", color: INK_SECONDARY, margin: "0 0 10px 0" }}>
            You routed <strong>{score}</strong> out of <strong>{SCENARIOS.length}</strong> client scenarios correctly.
          </p>
          <button
            onClick={handleRestart}
            style={{
              background: GOLD,
              color: "#FFFBF2",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Restart Router Training
          </button>
        </div>
      )}

    </div>
  );
}
