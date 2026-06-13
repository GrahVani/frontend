"use client";
import { useState, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, BookOpen, AlertTriangle, Play, CheckCircle, XCircle, Terminal, HelpCircle, RotateCcw } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";

const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

function toDMS(decimalDeg: number): string {
  const absolute = Math.abs(decimalDeg);
  const d = Math.floor(absolute);
  const m = Math.floor((absolute - d) * 60);
  return `${decimalDeg < 0 ? "-" : ""}${d}°${m.toString().padStart(2, "0")}′`;
}

function getRashiName(deg: number): string {
  const normalized = (deg % 360 + 360) % 360;
  const index = Math.floor(normalized / 30);
  const relativeDeg = normalized % 30;
  return `${toDMS(relativeDeg)} ${RASHIS[index]}`;
}

const VERIFIER_PRESETS = [
  {
    name: "Standard Mumbai 1985 (Within-Tolerance)",
    description: "Matches the lesson worked example. The minor variations between by-hand and Swiss-Ephemeris engine calculations are well within tolerance.",
    tolerance: 0.5,
    byHand: [187.8, 215.4167, 249.0, 296.9167, 328.0, 7.0, 7.8, 35.4167, 69.0, 116.9167, 140.0, 172.0],
    engine: [187.85, 215.45, 249.03, 296.95, 328.02, 7.04, 7.85, 35.45, 69.03, 116.95, 140.02, 172.04]
  },
  {
    name: "GMT Time-Zone Slip (Beyond-Tolerance)",
    description: "The by-hand chart was computed in IST, but the engine query was accidentally sent in GMT (5.5 hour error). All twelve cusps are shifted by ~6.5°.",
    tolerance: 0.5,
    byHand: [187.8, 215.4167, 249.0, 296.9167, 328.0, 7.0, 7.8, 35.4167, 69.0, 116.9167, 140.0, 172.0],
    engine: [194.3, 221.9167, 255.5, 303.4167, 334.5, 13.5, 14.3, 41.9167, 75.5, 123.4167, 146.5, 178.5]
  },
  {
    name: "Ayanāṁśa Mismatch (Lahiri vs Krishnamurti)",
    description: "The by-hand cusps subtracted Krishnamurti (~23°35′), but the engine query was mistakenly run with Lahiri (~23°41′). Produces a constant ~6′ (0.1°) shift.",
    tolerance: 0.5,
    byHand: [187.8, 215.4, 249.0, 296.9, 328.0, 7.0, 7.8, 35.4, 69.0, 116.9, 140.0, 172.0],
    engine: [187.7, 215.3, 248.9, 296.8, 327.9, 6.9, 7.7, 35.3, 68.9, 116.8, 139.9, 171.9]
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Why is the verification tolerance set to ±0.5° rather than demanding exact arcsecond alignment?",
    choices: [
      "Because manual calculations are always intrinsically wrong",
      "Because ephemeris versions, rounding choices, and coordinate systems introduce minor acceptable numerical variations",
      "Because the Earth moves by 0.5 degrees per minute of time",
      "Because KP only works when coordinates are rounded to the nearest half-degree"
    ],
    correct: 1,
    explanation: "Legitimate variations in manual rounding, ephemeris databases, and Placidus math versions create small differences that do not alter the final predictive results."
  },
  {
    id: 2,
    question: "If all 12 cusps show a constant discrepancy of exactly ~6′ (0.1°), what should you investigate?",
    choices: [
      "A timezone input mismatch",
      "An obliquity calculation formula slip",
      "An Ayanamsha system mismatch (e.g., mixing Lahiri and Krishnamurti values)",
      "A polar latitude mathematical distortion"
    ],
    correct: 2,
    explanation: "Lahiri and Krishnamurti ayanāṁśas differ consistently by about 6 arc-minutes (~0.1°). A constant shift of this size indicates a mismatch between the two systems."
  },
  {
    id: 3,
    question: "What is the proper action if a cusp verification fails (exceeds ±0.5°)?",
    choices: [
      "Proceed with the reading anyway and ignore the discrepancy",
      "Increase the tolerance slider until all indicators turn green",
      "Apply the discrepancy-investigation protocol to identify and resolve the root cause before starting analysis",
      "Change the house system to equal houses without telling the client"
    ],
    correct: 2,
    explanation: "Because the cuspal sub-lord doctrine consumes the cusp degree, proceeding with unverified coordinates propagates critical errors into the reading. Always find and fix the discrepancy first."
  }
];

export function KpCuspVerifier() {
  const [tab, setTab] = useState<"verifier" | "worked" | "quiz">("verifier");
  const [tolerance, setTolerance] = useState(0.5); // in degrees
  
  // 12 cusps state arrays
  const [byHandCusps, setByHandCusps] = useState<number[]>([...VERIFIER_PRESETS[0].byHand]);
  const [engineCusps, setEngineCusps] = useState<number[]>([...VERIFIER_PRESETS[0].engine]);
  const [activePresetDesc, setActivePresetDesc] = useState(VERIFIER_PRESETS[0].description);

  const loadPreset = (preset: typeof VERIFIER_PRESETS[0]) => {
    setByHandCusps([...preset.byHand]);
    setEngineCusps([...preset.engine]);
    setTolerance(preset.tolerance);
    setActivePresetDesc(preset.description);
  };

  const differences = useMemo(() => {
    return byHandCusps.map((val, idx) => {
      const diff = Math.abs(val - engineCusps[idx]);
      return diff > 180 ? 360 - diff : diff;
    });
  }, [byHandCusps, engineCusps]);

  const diagnosticResult = useMemo(() => {
    const firstDiff = differences[0];
    const isConstantShift = differences.every(d => Math.abs(d - firstDiff) < 0.05);
    const hasFailures = differences.some(d => d > tolerance);

    if (!hasFailures) {
      return {
        status: "PASS",
        color: GREEN,
        text: "Verification Successful! All computed cusps fall within the acceptable tolerance bounds."
      };
    }

    if (isConstantShift) {
      const avgShift = differences.reduce((sum, d) => sum + d, 0) / 12;
      if (Math.abs(avgShift - 6.5) < 0.5) {
        return {
          status: "FAIL",
          color: VERMILION,
          text: "⚠️ DISCREPANCY DETECTED: Constant shift of ~6.5° observed. Recommended action: Check for Time-zone / DST entry errors (e.g. GMT instead of IST)."
        };
      }
      if (Math.abs(avgShift - 0.1) < 0.05) {
        return {
          status: "FAIL",
          color: VERMILION,
          text: "⚠️ DISCREPANCY DETECTED: Constant shift of ~6′ (0.1°) observed. Recommended action: Check for Ayanāṁśa system mismatches (e.g. Lahiri vs Krishnamurti)."
        };
      }
    }

    return {
      status: "FAIL",
      color: VERMILION,
      text: "⚠️ DISCREPANCY DETECTED: Large or irregular differences. Recommended action: Check coordinates, time input, or intermediate cusp calculations for arithmetic slips."
    };
  }, [differences, tolerance]);

  const updateByHandCusp = (idx: number, val: number) => {
    const updated = [...byHandCusps];
    updated[idx] = (val % 360 + 360) % 360;
    setByHandCusps(updated);
    setActivePresetDesc("Custom User Inputs");
  };

  const updateEngineCusp = (idx: number, val: number) => {
    const updated = [...engineCusps];
    updated[idx] = (val % 360 + 360) % 360;
    setEngineCusps(updated);
    setActivePresetDesc("Custom User Inputs");
  };

  // Quiz states
  const [quizAns, setQuizAns] = useState<Record<number, number>>({});
  const [quizShow, setQuizShow] = useState<Record<number, boolean>>({});

  const meanError = useMemo(() => {
    return differences.reduce((sum, d) => sum + d, 0) / 12;
  }, [differences]);

  return (
    <div data-interactive="kp-cusp-verifier" style={{ color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      {/* Top Banner and Tabs */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", marginBottom: "1rem", boxShadow: "0 4px 20px -2px rgba(47, 125, 85, 0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GREEN, fontWeight: 900, background: `${GREEN}15`, padding: "2px 8px", borderRadius: "4px" }}>Verifier Dojo</span>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, fontWeight: 900, background: `${GOLD}15`, padding: "2px 8px", borderRadius: "4px" }}>Lesson 5 Flagship</span>
            </div>
            <h2 style={{ margin: "0.4rem 0 0.2rem", color: GOLD, fontSize: "1.45rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
              KP Cusp Diagnostic Verifier
            </h2>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "13px", lineHeight: 1.55 }}>
              Compare manually calculated coordinates against Astro Engine output. Execute discrepancy checks to isolate timezone slips and ayanāṁśa mismatches.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => {
                setTab("verifier");
                setTolerance(0.5);
                setByHandCusps([...VERIFIER_PRESETS[0].byHand]);
                setEngineCusps([...VERIFIER_PRESETS[0].engine]);
                setActivePresetDesc(VERIFIER_PRESETS[0].description);
              }}
              style={buttonStyle(false, GREEN)}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {[
          { key: "verifier" as const, label: "Verification Workspace", icon: <BadgeCheck size={14} /> },
          { key: "worked" as const, label: "Worked Case Studies", icon: <BookOpen size={14} /> },
          { key: "quiz" as const, label: "Practitioner Quiz", icon: <AlertTriangle size={14} /> }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 700,
              transition: "all 180ms ease",
              background: tab === t.key ? GREEN : `${GREEN}12`,
              color: tab === t.key ? "#FFF" : GREEN
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Verifier */}
      {tab === "verifier" && (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          
          {/* Preset Picker */}
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Diagnostic Scenario Presets</span>
              <p style={{ margin: 0, fontSize: "13px", color: INK_SECONDARY }}>Select a preset case study to simulate common calculation slips.</p>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {VERIFIER_PRESETS.map((p, idx) => {
                const isSelected = activePresetDesc === p.description;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadPreset(p)}
                    style={buttonStyle(isSelected, GOLD)}
                  >
                    Preset {idx + 1}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Tolerance & Status Display */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "1.25rem", alignItems: "stretch" }}>
            <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: INK_SECONDARY }}>Acceptable Tolerance:</span>
                <span style={{ fontSize: "14px", fontWeight: 800, color: GOLD, fontFamily: "monospace" }}>±{tolerance}° ({Math.round(tolerance * 60)}′)</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={tolerance}
                onChange={(e) => setTolerance(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: GOLD, cursor: "pointer" }}
              />
              <span style={{ fontSize: "11px", color: INK_MUTED, marginTop: "0.4rem", display: "block" }}>
                Default: ±0.5°. Slide down to ±0.1° to observe how standard precession variants trigger errors.
              </span>
            </section>

            <section
              style={{
                border: `1.5px solid ${diagnosticResult.color}44`,
                borderRadius: 12,
                background: `${diagnosticResult.color}05`,
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.01)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: diagnosticResult.color, fontWeight: 900, fontSize: "13.5px", marginBottom: "0.4rem" }}>
                <Play size={16} />
                System Verdict Panel
              </div>
              <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: 1.55 }}>
                {diagnosticResult.text}
              </p>
            </section>
          </div>

          {/* Verification Grid */}
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
            <h4 style={{ margin: "0 0 0.6rem", color: GOLD, fontSize: "0.95rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>Cusp Comparison Workspace</h4>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5px" }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${HAIRLINE}`, color: GOLD, textAlign: "left" }}>
                    <th style={{ padding: "0.35rem 0.3rem", fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.04em" }}>#</th>
                    <th style={{ padding: "0.35rem 0.3rem", fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.04em" }}>By-Hand (°)</th>
                    <th style={{ padding: "0.35rem 0.3rem", fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Engine (°)</th>
                    <th style={{ padding: "0.35rem 0.3rem", fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Δ Diff</th>
                    <th style={{ padding: "0.35rem 0.3rem", fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "right" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                    const idx = h - 1;
                    const manualVal = byHandCusps[idx];
                    const engineVal = engineCusps[idx];
                    const diff = differences[idx];
                    const passes = diff <= tolerance;

                    return (
                      <tr
                        key={h}
                        style={{
                          borderBottom: `1px solid ${HAIRLINE}55`,
                          background: passes ? "transparent" : "rgba(162, 58, 30, 0.03)"
                        }}
                      >
                        <td style={{ padding: "0.3rem 0.3rem", fontWeight: 800, fontSize: "10px", color: passes ? INK_PRIMARY : VERMILION }}>{h}</td>
                        <td style={{ padding: "0.25rem 0.3rem" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <input
                              type="number"
                              step="0.01"
                              value={manualVal}
                              onChange={(e) => updateByHandCusp(idx, parseFloat(e.target.value) || 0)}
                              style={tableInputStyle}
                            />
                            <span style={{ fontSize: "9px", color: INK_MUTED, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                              {getRashiName(manualVal)}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "0.25rem 0.3rem" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <input
                              type="number"
                              step="0.01"
                              value={engineVal}
                              onChange={(e) => updateEngineCusp(idx, parseFloat(e.target.value) || 0)}
                              style={tableInputStyle}
                            />
                            <span style={{ fontSize: "9px", color: INK_MUTED, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                              {getRashiName(engineVal)}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "0.3rem 0.3rem", fontFamily: "monospace", fontWeight: 700, fontSize: "10px" }}>
                          {toDMS(diff)}
                        </td>
                        <td style={{ padding: "0.3rem 0.3rem", textAlign: "right" }}>
                          {passes ? (
                            <span style={{ fontSize: "9px", background: `${GREEN}10`, color: GREEN, padding: "2px 5px", borderRadius: "3px", fontWeight: 800 }}>
                              ✓ OK
                            </span>
                          ) : (
                            <span style={{ fontSize: "9px", background: `${VERMILION}15`, color: VERMILION, padding: "2px 5px", borderRadius: "3px", fontWeight: 800, border: `1px solid ${VERMILION}33` }}>
                              ⚠ FAIL
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Tab 2: Worked Examples */}
      {tab === "worked" && (
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem" }}>
          <h3 style={{ margin: "0 0 1rem", color: GOLD, fontSize: "1.35rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>Verification Case Studies</h3>
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <div style={{ border: `1px solid ${GREEN}33`, borderRadius: 8, background: `${GREEN}04`, padding: "1.25rem" }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "0.5rem" }}>
                <CheckCircle size={16} style={{ color: GREEN }} />
                <strong style={{ color: GREEN, fontSize: "13.5px" }}>Case Study 1: Clean Verification (Mumbai 1985)</strong>
              </div>
              <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: 1.6 }}>
                By-hand Ascendant is calculated to 7°48′ Libra and MC to 3°20′ Cancer. Astro Engine returns 7°51′ Libra and 3°22′ Cancer. 
                Discrepancies across all 12 houses fall between 1′ and 5′. Since all differences are well inside the ±0.5° threshold, the verification passes.
              </p>
            </div>
            <div style={{ border: `1px solid ${VERMILION}33`, borderRadius: 8, background: `${VERMILION}04`, padding: "1.25rem" }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "0.5rem" }}>
                <AlertTriangle size={16} style={{ color: VERMILION }} />
                <strong style={{ color: VERMILION, fontSize: "13.5px" }}>Case Study 2: System Slip (GMT timezone mismatch)</strong>
              </div>
              <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: 1.6 }}>
                The by-hand calculation was run using local time (14:30 IST), but the engine query was mistakenly configured as 14:30 GMT. 
                This timezone error shifts all twelve computed cusps by exactly 6.5° (about 6°30′). Because the differences vastly exceed the ±0.5° tolerance boundary, the verifier flags the system and isolates the timezone mismatch immediately.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: Quiz */}
      {tab === "quiz" && (
        <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {QUIZ_QUESTIONS.map((q) => {
            const answer = quizAns[q.id];
            const revealed = quizShow[q.id];
            return (
              <div key={q.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: GOLD, color: "#fff", fontSize: "11px", fontWeight: 900 }}>
                    {q.id}
                  </span>
                  <strong style={{ color: GOLD, fontSize: "13.5px", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>{q.question}</strong>
                </div>

                <div style={{ display: "grid", gap: "0.6rem", marginBottom: "1rem" }}>
                  {q.choices.map((choice, choiceIdx) => {
                    const isSelected = answer === choiceIdx;
                    const isCorrect = choiceIdx === q.correct;
                    let borderCol = HAIRLINE;
                    let bgCol = "transparent";
                    if (revealed) {
                      if (isCorrect) {
                        borderCol = GREEN;
                        bgCol = `${GREEN}0D`;
                      } else if (isSelected) {
                        borderCol = VERMILION;
                        bgCol = `${VERMILION}0D`;
                      }
                    } else if (isSelected) {
                      borderCol = BLUE;
                      bgCol = `${BLUE}0D`;
                    }
                    return (
                      <button
                        key={choiceIdx}
                        onClick={() => {
                          if (revealed) return;
                          setQuizAns((prev) => ({ ...prev, [q.id]: choiceIdx }));
                          setQuizShow((prev) => ({ ...prev, [q.id]: true }));
                        }}
                        style={{
                          textAlign: "left",
                          padding: "0.6rem 1rem",
                          borderRadius: 8,
                          border: `1.5px solid ${borderCol}`,
                          background: bgCol,
                          color: INK_PRIMARY,
                          fontSize: "12.5px",
                          fontWeight: 700,
                          cursor: revealed ? "default" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          transition: "all 150ms ease"
                        }}
                      >
                        {revealed && isCorrect && <CheckCircle size={15} style={{ color: GREEN }} />}
                        {revealed && isSelected && !isCorrect && <XCircle size={15} style={{ color: VERMILION }} />}
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {revealed && (
                  <div style={{ border: `1.5px solid ${answer === q.correct ? GREEN : VERMILION}33`, borderRadius: 8, background: `${answer === q.correct ? GREEN : VERMILION}08`, padding: "0.8rem 1rem", fontSize: "12px", lineHeight: 1.5 }}>
                    <strong style={{ color: answer === q.correct ? GREEN : VERMILION }}>{answer === q.correct ? "✓ Correct Identification" : "⚠ Practice Mismatch"}</strong> — {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

    </div>
  );
}

const tableInputStyle: CSSProperties = {
  padding: "0.25rem 0.4rem",
  borderRadius: 4,
  border: `1px solid ${HAIRLINE}`,
  background: SURFACE,
  color: INK_PRIMARY,
  fontSize: "10.5px",
  fontFamily: "monospace",
  outline: "none",
  width: "58px"
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    border: `1.5px solid ${active ? color : HAIRLINE}`,
    borderRadius: "6px",
    background: active ? color : "transparent",
    color: active ? "#FFF" : INK_SECONDARY,
    padding: "0.45rem 0.85rem",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 150ms ease",
    outline: "none"
  };
}
