"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { NAKSHATRAS } from "../nakshatra-data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const ORANGE = "#C28220";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const PLANETS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const VIM: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];

function formatDMS(arcMinutes: number): string {
  const deg = Math.floor(arcMinutes / 60);
  const min = Math.floor(arcMinutes % 60);
  const sec = Math.round((arcMinutes * 60) % 60);
  if (sec > 0) {
    return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″`;
  }
  return `${deg}°${min.toString().padStart(2, "0")}′`;
}

function formatZodiac(arcMinutes: number): string {
  const signIdx = Math.min(Math.floor(arcMinutes / 1800), 11);
  const degMinSec = arcMinutes % 1800;
  const deg = Math.floor(degMinSec / 60);
  const min = Math.floor(degMinSec % 60);
  const sec = Math.round((degMinSec * 60) % 60);
  const signName = SIGNS[signIdx];
  if (sec > 0) {
    return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″ ${signName}`;
  }
  return `${deg}°${min.toString().padStart(2, "0")}′ ${signName}`;
}

export function SubLordFluencyTrainer() {
  const [activeTab, setActiveTab] = useState<"quiz" | "reference">("quiz");

  // Game state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Current question coordinates
  const [currentSign, setCurrentSign] = useState(0);
  const [currentDeg, setCurrentDeg] = useState(0);
  const [isHighStakes, setIsHighStakes] = useState(false);
  const [feedback, setFeedback] = useState<{ status: "correct" | "incorrect" | "fallback_success" | null; msg: string }>({ status: null, msg: "" });

  const [selectedStarLord, setSelectedStarLord] = useState<string | null>(null);
  const [selectedSubLord, setSelectedSubLord] = useState<string | null>(null);

  const [timer, setTimer] = useState(30);

  const currentLon = currentSign * 1800 + currentDeg * 60;

  // Calculate correct answers
  const correctData = useMemo(() => {
    const nakIdx = Math.min(Math.floor(currentLon / 800), 26);
    const nak = NAKSHATRAS[nakIdx];
    const nakStart = nakIdx * 800;
    const offset = currentLon - nakStart;

    const startIdx = VIM.findIndex((v) => v[0] === nak.ruler);
    const subs = [];
    let currentOffset = 0;
    for (let i = 0; i < 9; i++) {
      const [lord, years] = VIM[(startIdx + i) % 9];
      const width = (years / 120) * 800;
      subs.push({ lord, from: currentOffset, to: currentOffset + width });
      currentOffset += width;
    }
    const sub = subs.find((s) => offset >= s.from && offset < s.to) ?? subs[subs.length - 1];

    // Determine boundary proximity (within ±10′ of any boundary)
    let isNearBoundary = offset <= 10 || offset >= 790;
    for (const s of subs) {
      if (Math.abs(offset - s.from) <= 10 || Math.abs(offset - s.to) <= 10) {
        isNearBoundary = true;
      }
    }

    return {
      starLord: nak.ruler,
      subLord: sub.lord,
      nakName: nak.name,
      offset,
      isNearBoundary,
    };
  }, [currentLon]);

  const hasFallbackTrigger = correctData.isNearBoundary || isHighStakes;

  // Generate a random question
  const generateQuestion = useCallback(() => {
    const randomSign = Math.floor(Math.random() * 12);
    // Generate a random degree, occasionally skewing toward boundary regions (multiples of 13.333 or sub boundaries)
    let randomDeg = Math.random() * 30;
    if (Math.random() < 0.4) {
      // Skew towards nakṣatra boundaries (0, 13.333, 26.666 etc)
      const boundaries = [0, 13.333, 26.666, 10, 23.333, 6.666, 20];
      const base = boundaries[Math.floor(Math.random() * boundaries.length)];
      randomDeg = base + (Math.random() * 0.3 - 0.15); // Add minor drift
      if (randomDeg < 0) randomDeg = 0;
      if (randomDeg >= 30) randomDeg = 29.9;
    }
    // Round to nearest minute
    randomDeg = Math.round(randomDeg * 60) / 60;

    setCurrentSign(randomSign);
    setCurrentDeg(randomDeg);
    setIsHighStakes(Math.random() < 0.2); // 20% chance of high stakes cusp
    setFeedback({ status: null, msg: "" });
    setSelectedStarLord(null);
    setSelectedSubLord(null);
    setTimer(30);
  }, []);

  // Set initial question
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  // Timer countdown logic
  useEffect(() => {
    if (feedback.status !== null) return;
    if (timer <= 0) {
      setFeedback({
        status: "incorrect",
        msg: `Time expired! The correct answer was Star: ${correctData.starLord}, Sub: ${correctData.subLord}.`,
      });
      setStreak(0);
      setAttempts((a) => a + 1);
      return;
    }
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, feedback.status, correctData]);

  // Handle answers
  const handleAnswerSubmit = (star: string, sub: string) => {
    if (feedback.status !== null) return;

    if (hasFallbackTrigger) {
      // User guessed instead of triggering fallback
      setFeedback({
        status: "incorrect",
        msg: `Breach of discipline! Proximity to boundary/high-stakes cusp requires a computed fallback verification, not a guess.`,
      });
      setStreak(0);
      setAttempts((a) => a + 1);
    } else {
      const isStarCorrect = star === correctData.starLord;
      const isSubCorrect = sub === correctData.subLord;
      if (isStarCorrect && isSubCorrect) {
        setFeedback({
          status: "correct",
          msg: `Correct! ${formatZodiac(currentLon)} lands in ${correctData.nakName} (${correctData.starLord}) and ${correctData.subLord} sub.`,
        });
        setScore((s) => s + 10 + Math.floor(timer / 3));
        setStreak((s) => s + 1);
        setCorrectAnswers((c) => c + 1);
      } else {
        setFeedback({
          status: "incorrect",
          msg: `Incorrect. You guessed (${star}, ${sub}). Correct: (${correctData.starLord}, ${correctData.subLord}).`,
        });
        setStreak(0);
      }
      setAttempts((a) => a + 1);
    }
  };

  const handleFallbackActivate = () => {
    if (feedback.status !== null) return;

    if (hasFallbackTrigger) {
      setFeedback({
        status: "fallback_success",
        msg: `Discipline upheld! The coordinate was indeed in a fallback zone (Boundary: ${correctData.isNearBoundary ? "Yes" : "No"}, High-Stakes Cusp: ${isHighStakes ? "Yes" : "No"}). Fallback computation successfully verified: Star: ${correctData.starLord}, Sub: ${correctData.subLord}.`,
      });
      setScore((s) => s + 15);
      setStreak((s) => s + 1);
      setCorrectAnswers((c) => c + 1);
    } else {
      setFeedback({
        status: "incorrect",
        msg: `Incorrect fallback trigger! The coordinate was in a safe milestone zone. You should have resolved it mentally.`,
      });
      setStreak(0);
    }
    setAttempts((a) => a + 1);
  };

  return (
    <div style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Navigation tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem" }}>
        <button
          onClick={() => setActiveTab("quiz")}
          style={{ border: "none", background: "transparent", color: activeTab === "quiz" ? GOLD : INK_SECONDARY, fontSize: "0.95rem", fontWeight: 700, borderBottom: activeTab === "quiz" ? `2px solid ${GOLD}` : "none", padding: "0.4rem 0.8rem", cursor: "pointer" }}
        >
          Dojo Quiz
        </button>
        <button
          onClick={() => setActiveTab("reference")}
          style={{ border: "none", background: "transparent", color: activeTab === "reference" ? GOLD : INK_SECONDARY, fontSize: "0.95rem", fontWeight: 700, borderBottom: activeTab === "reference" ? `2px solid ${GOLD}` : "none", padding: "0.4rem 0.8rem", cursor: "pointer" }}
        >
          Reference Milestones
        </button>
      </div>

      {activeTab === "quiz" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr md:320px", gap: "1rem" }}>
          {/* Main Quiz Area */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.2rem", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.78rem", color: INK_MUTED, fontWeight: 900, textTransform: "uppercase" }}>Fluency Lookup Trainer</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: timer < 10 ? RED : INK_SECONDARY }}>Timer: {timer}s</span>
            </div>

            {/* Target Longitude Display */}
            <div style={{ textAlign: "center", padding: "1.5rem", borderRadius: 8, background: "rgba(0,0,0,0.01)", border: `1px dashed ${HAIRLINE}`, marginBottom: "1.2rem" }}>
              <span style={{ color: INK_MUTED, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase" }}>Zodiac Coordinate</span>
              <h1 style={{ margin: "0.4rem 0", color: GOLD, fontSize: "2rem" }}>{formatDMS(currentDeg)} {SIGNS[currentSign]}</h1>
              {isHighStakes && (
                <span style={{ background: `${RED}1A`, color: RED, border: `1px solid ${RED}`, borderRadius: 4, padding: "2px 6px", fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase" }}>
                  ⚠ High-Stakes 7th Cusp (Marriage Question)
                </span>
              )}
            </div>

            {/* Fallback Action Trigger Box */}
            {hasFallbackTrigger && feedback.status === null && (
              <div style={{ border: `1px solid ${ORANGE}`, borderRadius: 8, background: `${ORANGE}0A`, padding: "0.8rem", marginBottom: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.6rem" }}>
                <div>
                  <strong style={{ color: ORANGE, fontSize: "0.84rem" }}>⚠ CRITICAL FALLBACK TRIGGER DETECTED!</strong>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: INK_SECONDARY }}> Proximity to boundary or high-stakes cusp makes guessing dangerous.</p>
                </div>
                <button
                  onClick={handleFallbackActivate}
                  style={{ background: ORANGE, color: "#FFF", border: "none", borderRadius: 8, padding: "0.5rem 1rem", fontWeight: 900, fontSize: "0.85rem", cursor: "pointer", textTransform: "uppercase" }}
                >
                  Activate Computed Fallback
                </button>
              </div>
            )}

            {/* Feedback messages */}
            {feedback.status !== null && (
              <div style={{ padding: "0.8rem", borderRadius: 8, border: "1px solid", borderColor: feedback.status === "correct" || feedback.status === "fallback_success" ? GREEN : RED, background: feedback.status === "correct" || feedback.status === "fallback_success" ? `${GREEN}0D` : `${RED}0D`, marginBottom: "1.2rem" }}>
                <strong style={{ display: "block", color: feedback.status === "correct" || feedback.status === "fallback_success" ? GREEN : RED, fontSize: "0.88rem" }}>
                  {feedback.status === "correct" && "✓ CORRECT ANSWER"}
                  {feedback.status === "fallback_success" && "✓ VERIFIED FALLBACK SUCCESSFUL"}
                  {feedback.status === "incorrect" && "⚠ ARITHMETIC DRIFT / BREACH"}
                </strong>
                <p style={{ margin: "0.2rem 0 0.6rem", fontSize: "0.82rem", color: INK_SECONDARY }}>{feedback.msg}</p>
                <button
                  onClick={generateQuestion}
                  style={{ background: GOLD, color: "#FFF", border: "none", borderRadius: 6, padding: "0.35rem 0.7rem", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer" }}
                >
                  Next Longitude
                </button>
              </div>
            )}

            {/* Select Options */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", position: "relative" }}>
              {hasFallbackTrigger && feedback.status === null && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255, 255, 255, 0.65)",
                  backdropFilter: "blur(1px)",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                  padding: "1rem",
                  border: `1px dashed ${ORANGE}`,
                  textAlign: "center"
                }}>
                  <strong style={{ color: ORANGE, fontSize: "0.88rem", display: "block", marginBottom: "0.2rem" }}>🔒 GUESSING LOCKED</strong>
                  <span style={{ fontSize: "0.78rem", color: INK_PRIMARY, fontWeight: 500 }}>
                    Boundary or high-stakes cusp detected. You must use the <strong>computed fallback</strong> option above.
                  </span>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", marginBottom: "0.4rem" }}>Star-Lord (Nakṣatra)</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem" }}>
                  {PLANETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedStarLord(p)}
                      disabled={feedback.status !== null || hasFallbackTrigger}
                      style={{
                        padding: "0.45rem",
                        borderRadius: 6,
                        border: `1px solid ${selectedStarLord === p ? GOLD : HAIRLINE}`,
                        background: selectedStarLord === p ? `${GOLD}1A` : SURFACE,
                        color: selectedStarLord === p ? GOLD : INK_PRIMARY,
                        fontWeight: selectedStarLord === p ? 900 : 600,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", marginBottom: "0.4rem" }}>Sub-Lord</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem" }}>
                  {PLANETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedSubLord(p)}
                      disabled={feedback.status !== null || hasFallbackTrigger}
                      style={{
                        padding: "0.45rem",
                        borderRadius: 6,
                        border: `1px solid ${selectedSubLord === p ? GOLD : HAIRLINE}`,
                        background: selectedSubLord === p ? `${GOLD}1A` : SURFACE,
                        color: selectedSubLord === p ? GOLD : INK_PRIMARY,
                        fontWeight: selectedSubLord === p ? 900 : 600,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Answer verification submit */}
            {selectedStarLord && selectedSubLord && feedback.status === null && !hasFallbackTrigger && (
              <button
                onClick={() => handleAnswerSubmit(selectedStarLord, selectedSubLord)}
                style={{ width: "100%", marginTop: "1rem", padding: "0.6rem", borderRadius: 8, background: GOLD, color: "#FFF", border: "none", fontWeight: 900, fontSize: "0.9rem", cursor: "pointer", textTransform: "uppercase" }}
              >
                Submit Lookup Answer
              </button>
            )}
          </div>

          {/* Stats Sidebar */}
          <div style={{ display: "grid", gap: "1rem" }}>
            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
              <h3 style={{ margin: "0 0 1rem", color: GOLD, fontSize: "1.1rem", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", fontWeight: 700 }}>Dojo Dashboard</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", textAlign: "center", marginBottom: "1rem" }}>
                <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, padding: "0.6rem", background: "rgba(0,0,0,0.01)" }}>
                  <div style={{ fontSize: "0.72rem", color: INK_MUTED, textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.05em", marginBottom: "0.2rem" }}>Score</div>
                  <strong style={{ fontSize: "1.4rem", color: GOLD }}>{score}</strong>
                </div>
                <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, padding: "0.6rem", background: "rgba(0,0,0,0.01)" }}>
                  <div style={{ fontSize: "0.72rem", color: INK_MUTED, textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.05em", marginBottom: "0.2rem" }}>Streak</div>
                  <strong style={{ fontSize: "1.4rem", color: GREEN }}>
                    {streak} {streak >= 3 ? "🔥" : ""}
                  </strong>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0.2rem", fontSize: "0.8rem", color: INK_SECONDARY, borderBottom: `1px dashed ${HAIRLINE}` }}>
                <span>Total Attempts:</span>
                <strong>{attempts}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0.2rem", fontSize: "0.8rem", color: INK_SECONDARY, borderBottom: `1px dashed ${HAIRLINE}` }}>
                <span>Correct Answers:</span>
                <strong style={{ color: GREEN }}>{correctAnswers}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.2rem 0.2rem", fontSize: "0.82rem", color: INK_PRIMARY, fontWeight: 700 }}>
                <span>Session Accuracy:</span>
                <strong style={{ color: attempts > 0 && (correctAnswers/attempts) >= 0.7 ? GREEN : GOLD }}>
                  {attempts > 0 ? `${Math.round((correctAnswers / attempts) * 100)}%` : "0%"}
                </strong>
              </div>
            </div>

            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem" }}>
              <h3 style={{ margin: "0 0 0.6rem", color: GOLD, fontSize: "1.02rem" }}>Fallback Triggers</h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.4 }}>
                Never guess near boundaries (±10′) or high-stakes cusps! Trigger the fallback action when:
                <br /><br />
                1. Coordinate is within ±10′ of a sub boundary.
                <br />
                2. Cuspal degree represents a client career/marriage question.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Reference Landmarks Tab */
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.2rem", overflowX: "auto" }}>
          <h3 style={{ margin: "0 0 0.6rem", color: GOLD, fontSize: "1.2rem" }}>Sub-Width Milestones & Landmarks</h3>
          <p style={{ margin: "0 0 1rem", fontSize: "0.84rem", color: INK_SECONDARY, lineHeight: 1.4 }}>
            Memorizing the cumulative milestones of the 13°20′ nakṣatra allows you to narrow down coordinates quickly:
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "26rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${GOLD}66`, color: INK_MUTED, fontSize: "0.74rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.4rem", textAlign: "left" }}>Landmark</th>
                <th style={{ padding: "0.4rem", textAlign: "left" }}>Relative Offset</th>
                <th style={{ padding: "0.4rem", textAlign: "left" }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { l: "Nakṣatra Start", o: "0°00′00″", d: "First sub = nakṣatra-lord (coincidence rule)" },
                { l: "Venus Sub End", o: "3°00′00″", d: "Cumulative boundary of the Venus sub (~25% of nakṣatra)" },
                { l: "Rāhu Sub End", o: "7°33′20″", d: "Cumulative boundary of the Rāhu sub (mid-nakṣatra milestone)" },
                { l: "Saturn Sub End", o: "11°26′40″", d: "Cumulative boundary of the Saturn sub (~85% of nakṣatra)" },
                { l: "Nakṣatra End", o: "13°20′00″", d: "Mercury sub end; boundary crossing to next nakṣatra" },
              ].map((m, idx) => (
                <tr key={idx} style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                  <td style={{ padding: "0.4rem", fontWeight: 700, color: GOLD }}>{m.l}</td>
                  <td style={{ padding: "0.4rem", fontWeight: 700 }}>{m.o}</td>
                  <td style={{ padding: "0.4rem", color: INK_SECONDARY }}>{m.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
