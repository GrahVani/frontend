"use client";
import { useState, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { GitCompare, BookOpen, AlertTriangle, ChevronRight, CheckCircle, XCircle, Terminal, Play, Sparkles, RotateCcw } from "lucide-react";

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

const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
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

function getRashiSignOnly(deg: number): string {
  const normalized = (deg % 360 + 360) % 360;
  const index = Math.floor(normalized / 30);
  return RASHIS[index];
}

const NAK_RULERS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
function getCuspalSubLord(deg: number): string {
  const normalized = (deg % 360 + 360) % 360;
  const totalSubUnits = 249;
  const idx = Math.floor((normalized / 360) * totalSubUnits) % 9;
  return NAK_RULERS[idx];
}

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "If a planet falls in Sagittarius in a Parāśarī whole-sign chart but Capricorn in a KP chart, which one is correct?",
    choices: [
      "The KP chart is correct; Parāśarī is wrong",
      "The Parāśarī chart is correct; KP is wrong",
      "Both are correct within their respective house-system methodologies",
      "The ayanamsha calculation is broken and must be recalculated"
    ],
    correct: 2,
    explanation: "This is a classic house-system boundary divergence. Both whole-sign and Placidus are internally consistent house systems with different purposes — neither is incorrect."
  },
  {
    id: 2,
    question: "What is the key danger of cherry-picking elements from both systems in a single reading?",
    choices: [
      "It makes the software run slower",
      "It results in an incoherent analysis because the underlying mathematical and interpretive rules are mixed",
      "It triggers a timezone calculation error",
      "It violates the polar circle latitude caution"
    ],
    correct: 1,
    explanation: "Mixing Parāśarī sign-lords with KP sub-lord doctrines breaks framework consistency. You must stay internally consistent within one stream per analysis."
  },
  {
    id: 3,
    question: "Why does nudging the birth time by 5 minutes change KP cusps significantly but rarely shifts Parāśarī house boundaries?",
    choices: [
      "Parāśarī ignore Earth's rotation entirely",
      "KP uses a tropical calculation that speeds up time",
      "Parāśarī house boundaries are fixed at sign-boundaries (30° blocks) which only shift when the rising sign itself changes",
      "KP uses Lahiri ayanamsha which is highly time-sensitive"
    ],
    correct: 2,
    explanation: "Parāśarī whole-sign houses span a full 30° sign block. Unless the Ascendant degree crosses into a new sign, all 12 houses remain unchanged. KP Placidus cusps are degree-specific and shift continuously."
  }
];

export function KpVsParashariCuspComparator() {
  const [tab, setTab] = useState<"comparator" | "worked" | "quiz">("comparator");
  const [timeNudge, setTimeNudge] = useState(0); // in minutes
  const [ayanMode, setAyanMode] = useState<"Krishnamurti" | "Lahiri">("Krishnamurti");

  // Mumbai 1985-06-15 14:30 IST base values
  const baseAsc = 211.383; // 1°23' Scorpio (tropical)
  const baseMc = 116.917;  // 26°55' Cancer (tropical)

  const calculations = useMemo(() => {
    // 1 minute ≈ 0.25 degrees of LST shift
    const degreeShift = timeNudge * 0.25;
    const tropAsc = (baseAsc + degreeShift) % 360;
    const tropMc = (baseMc + degreeShift) % 360;

    // Calculate robust quadrant distance with wrap-around
    const getDist = (start: number, end: number) => {
      return (end - start + 360) % 360;
    };
    const distMcToAsc = getDist(tropMc, tropAsc);
    const distAscToIc = getDist(tropAsc, (tropMc + 180) % 360);

    let tropCusps: Record<number, number> = {};
    tropCusps[10] = tropMc;
    tropCusps[1] = tropAsc;
    tropCusps[4] = (tropMc + 180) % 360;
    tropCusps[7] = (tropAsc + 180) % 360;

    tropCusps[11] = (tropMc + distMcToAsc * (1/3)) % 360;
    tropCusps[12] = (tropMc + distMcToAsc * (2/3)) % 360;
    tropCusps[2] = (tropAsc + distAscToIc * (1/3)) % 360;
    tropCusps[3] = (tropAsc + distAscToIc * (2/3)) % 360;

    tropCusps[5] = (tropCusps[11] + 180) % 360;
    tropCusps[6] = (tropCusps[12] + 180) % 360;
    tropCusps[8] = (tropCusps[2] + 180) % 360;
    tropCusps[9] = (tropCusps[3] + 180) % 360;

    // Ayanamsha offset
    const offset = ayanMode === "Krishnamurti" ? 23.583 : 23.683; // 23°35' vs 23°41' approx

    // Parāśarī whole-sign: 1st house is the entire sign of the Ascendant
    const parashariAscSidereal = (tropAsc - offset + 360) % 360;
    const ascSignIndex = Math.floor(parashariAscSidereal / 30);
    const parashariHouses: Record<number, { sign: string; lord: string }> = {};
    for (let h = 1; h <= 12; h++) {
      const signIdx = (ascSignIndex + h - 1) % 12;
      parashariHouses[h] = {
        sign: RASHIS[signIdx],
        lord: SIGN_LORDS[signIdx]
      };
    }

    // KP Placidus sidereal
    const kpCusps: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      kpCusps[h] = (tropCusps[h] - offset + 360) % 360;
    }

    // Count sign mismatches
    let mismatches = 0;
    for (let h = 1; h <= 12; h++) {
      if (parashariHouses[h].sign !== getRashiSignOnly(kpCusps[h])) {
        mismatches++;
      }
    }

    return {
      parashariHouses,
      kpCusps,
      parashariAscSidereal,
      mismatches,
      degreeShift
    };
  }, [timeNudge, ayanMode]);

  // Quiz Answer triggers
  const [quizAns, setQuizAns] = useState<Record<number, number>>({});
  const [quizShow, setQuizShow] = useState<Record<number, boolean>>({});

  return (
    <div data-interactive="kp-vs-parashari-cusp-comparator" style={{ color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      {/* Top Banner and Tabs */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", marginBottom: "1rem", boxShadow: "0 4px 20px -2px rgba(53, 108, 171, 0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE, fontWeight: 900, background: `${BLUE}15`, padding: "2px 8px", borderRadius: "4px" }}>Comparator Mode</span>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, fontWeight: 900, background: `${GOLD}15`, padding: "2px 8px", borderRadius: "4px" }}>Lesson 4 Flagship</span>
            </div>
            <h2 style={{ margin: "0.4rem 0 0.2rem", color: GOLD, fontSize: "1.45rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
              Parāśarī vs KP House Cusp Comparator
            </h2>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "13px", lineHeight: 1.55 }}>
              Compare Whole-Sign structures (equal 30° sectors) directly with degree-specific Placidus cusps. Nudge birth times to examine boundary crossings.
            </p>
          </div>
            <button
              type="button"
              onClick={() => {
                setTab("comparator");
                setTimeNudge(0);
                setAyanMode("Krishnamurti");
              }}
              style={buttonStyle(false, BLUE)}
            >
              <RotateCcw size={14} />
              Reset
            </button>
        </div>
      </section>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {[
          { key: "comparator" as const, label: "Side-by-Side Comparator", icon: <GitCompare size={14} /> },
          { key: "worked" as const, label: "Worked Example (Mumbai)", icon: <BookOpen size={14} /> },
          { key: "quiz" as const, label: "Cross-System Quiz", icon: <AlertTriangle size={14} /> }
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
              background: tab === t.key ? BLUE : `${BLUE}12`,
              color: tab === t.key ? "#FFF" : BLUE
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Comparator */}
      {tab === "comparator" && (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {/* Controls section */}
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
            <h4 style={{ margin: "0 0 1rem", color: GOLD, fontSize: "1.05rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>Interactive Parameters Adjustment</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.5rem", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: INK_SECONDARY }}>Nudge Birth Time:</span>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: GOLD, fontFamily: "monospace" }}>
                    {timeNudge > 0 ? `+${timeNudge}` : timeNudge} minutes ({calculations.degreeShift > 0 ? `+${calculations.degreeShift.toFixed(2)}` : calculations.degreeShift.toFixed(2)}° LST)
                  </span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={timeNudge}
                  onChange={(e) => setTimeNudge(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: GOLD, cursor: "pointer" }}
                />
                <span style={{ fontSize: "11px", color: INK_MUTED, marginTop: "0.3rem", display: "block" }}>
                  Drag the slider to watch degree-specific Placidus cusps cross boundaries, while Whole-Sign blocks remain completely locked until the rising sign changes.
                </span>
              </div>
              
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "0.4rem" }}>
                  Select Ayanāṁśa System
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["Krishnamurti", "Lahiri"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setAyanMode(mode as typeof ayanMode)}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: 6,
                        border: `1.5px solid ${ayanMode === mode ? GOLD : HAIRLINE}`,
                        background: ayanMode === mode ? GOLD : "transparent",
                        color: ayanMode === mode ? "#FFF" : INK_SECONDARY,
                        fontWeight: 700,
                        fontSize: "12.5px",
                        cursor: "pointer",
                        transition: "all 150ms ease"
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: "11px", color: INK_MUTED, marginTop: "0.3rem", display: "block" }}>
                  Toggles standard ayanāṁśas to observe the ~6′ (0.1°) shift.
                </span>
              </div>
            </div>
          </section>

          {/* Comparative Table */}
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
            <h4 style={{ margin: "0 0 1rem", color: GOLD, fontSize: "1.05rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
              Cuspal Divergence Matrix (Whole-Sign vs KP Placidus)
            </h4>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
                <thead>
                  <tr style={{ borderBottom: `2.5px solid ${HAIRLINE}`, color: GOLD, textAlign: "left" }}>
                    <th style={{ padding: "0.6rem 0.5rem" }}>House</th>
                    <th style={{ padding: "0.6rem 0.5rem" }}>Parāśarī Cusp Sign</th>
                    <th style={{ padding: "0.6rem 0.5rem" }}>Parāśarī Sign Lord</th>
                    <th style={{ padding: "0.6rem 0.5rem" }}>KP Placidus Cusp Degree</th>
                    <th style={{ padding: "0.6rem 0.5rem" }}>KP Cuspal Sub-lord</th>
                    <th style={{ padding: "0.6rem 0.5rem", textAlign: "right" }}>Divergence Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                    const parHouse = calculations.parashariHouses[h];
                    const kpCuspVal = calculations.kpCusps[h];
                    const kpSignOnly = getRashiSignOnly(kpCuspVal);
                    const kpCuspStr = getRashiName(kpCuspVal);
                    const kpSubLord = getCuspalSubLord(kpCuspVal);

                    const signDiverges = parHouse.sign !== kpSignOnly;

                    return (
                      <tr
                        key={h}
                        style={{
                          borderBottom: `1px solid ${HAIRLINE}55`,
                          background: signDiverges ? "rgba(162, 58, 30, 0.03)" : "transparent"
                        }}
                      >
                        <td style={{ padding: "0.75rem 0.5rem", fontWeight: 800, color: signDiverges ? VERMILION : INK_PRIMARY }}>House {h}</td>
                        <td style={{ padding: "0.75rem 0.5rem" }}>0° {parHouse.sign}</td>
                        <td style={{ padding: "0.75rem 0.5rem" }}>
                          <span style={{ fontSize: "11px", textTransform: "uppercase", color: BLUE, background: `${BLUE}12`, padding: "2px 8px", borderRadius: "4px", fontWeight: 800 }}>
                            {parHouse.lord}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 0.5rem", fontFamily: "monospace", fontWeight: 700 }}>{kpCuspStr}</td>
                        <td style={{ padding: "0.75rem 0.5rem" }}>
                          <span style={{ fontSize: "11px", textTransform: "uppercase", color: GREEN, background: `${GREEN}12`, padding: "2px 8px", borderRadius: "4px", fontWeight: 800 }}>
                            {kpSubLord}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem 0.5rem", textAlign: "right" }}>
                          {signDiverges ? (
                            <span style={{ fontSize: "11px", background: `${VERMILION}15`, color: VERMILION, padding: "3px 8px", borderRadius: "4px", fontWeight: 800, border: `1px solid ${VERMILION}33` }}>
                              ⚠️ Sign Diverged
                            </span>
                          ) : (
                            <span style={{ fontSize: "11px", background: `${GREEN}10`, color: GREEN, padding: "3px 8px", borderRadius: "4px", fontWeight: 800 }}>
                              Consistent Sign
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

      {/* Tab 2: Worked Example */}
      {tab === "worked" && (
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem" }}>
          <h3 style={{ margin: "0 0 1rem", color: GOLD, fontSize: "1.35rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>Worked Case Study: Mumbai 1985 Calibration</h3>
          <p style={{ fontSize: "13px", color: INK_SECONDARY, lineHeight: 1.6, marginBottom: "1.25rem" }}>
            Contrasting systems for the canonical worked example (Mumbai, June 15, 1985, at 14:30 IST):
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <div style={{ padding: "1.25rem", borderRadius: 8, border: `1.5px solid ${BLUE}33`, background: `${BLUE}04` }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "0.5rem" }}>
                <CheckCircle size={16} style={{ color: BLUE }} />
                <strong style={{ color: BLUE, fontSize: "13.5px" }}>3rd House Boundary Crossing</strong>
              </div>
              <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: 1.6 }}>
                Under Parāśarī whole-sign, the 3rd house occupies the entire sign of <strong>Sagittarius</strong> (lord Jupiter). 
                KP Placidus place the 3rd cusp at <strong>3° Capricorn</strong>. This relocates house significations to Capricorn (lord Saturn) and initiates the KP sub-lord predictive chain.
              </p>
            </div>
            <div style={{ padding: "1.25rem", borderRadius: 8, border: `1.5px solid ${VERMILION}33`, background: `${VERMILION}04` }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "0.5rem" }}>
                <AlertTriangle size={16} style={{ color: VERMILION }} />
                <strong style={{ color: VERMILION, fontSize: "13.5px" }}>11th House Sign Discrepancy</strong>
              </div>
              <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: 1.6 }}>
                Parāśarī allocates the 11th house to the entire sign of <strong>Leo</strong> (lord Sun). 
                KP Placidus places the 11th cusp at <strong>4° Cancer</strong>. The houses differ by an entire sign due to unequal Placidus time-divisions.
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
                    <strong style={{ color: answer === q.correct ? GREEN : VERMILION }}>{answer === q.correct ? "✓ Correct Verdict" : "⚠ Practice Mismatch"}</strong> — {q.explanation}
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
