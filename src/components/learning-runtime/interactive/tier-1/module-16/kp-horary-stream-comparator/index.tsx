"use client";

import { useState, useMemo } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const INDIGO = "#4F6FA8";

interface RowDetail {
  dimension: string;
  kp: string;
  parashari: string;
  tajika: string;
  expandedDetails: string;
}

const COMPARISONS: RowDetail[] = [
  {
    dimension: "Lagna Selection",
    kp: "Querent's 1-249 number fixes Lagna sub-position",
    parashari: "Moment of call rising sign sets Lagna",
    tajika: "Moment Lagna / question letters sets Lagna",
    expandedDetails: "KP uses the querent's number to bypass natal time errors, whereas Parāśarī and Tājika rely on the clock time of the question."
  },
  {
    dimension: "House Division",
    kp: "Placidus House division (decisive cusps)",
    parashari: "Whole-Sign or Bhāva Chalita division",
    tajika: "Śrīpati equal houses or Placidus divisions",
    expandedDetails: "KP is strictly dependent on Placidus cusps since it evaluates the exact cusp degree sub-lord. Parāśarī reads entire signs as houses."
  },
  {
    dimension: "Aspect Doctrine",
    kp: "Star-lord tenancy rules over direct aspects",
    parashari: "Sign / Graha aspects (mutual or full aspect)",
    tajika: "Tajika aspects (Ithasāla/Īsarāpha) based on orbs",
    expandedDetails: "KP views planets as agents of their star-lords. Tājika uses active applying/separating geometry (ithasāla/īsarāpha) within strict deeptāṁśa orbs."
  },
  {
    dimension: "Timing Mechanism",
    kp: "KP-modified Vimśottarī bhuktis + Ruling Planets",
    parashari: "Moment chart Vimśottarī daśā + transits",
    tajika: "Planetary years / progression of Varṣaphala",
    expandedDetails: "KP cross-checks the active significators against the Ruling Planets of the question moment to narrow the predictive window to exact days."
  },
  {
    dimension: "Verdict Decider",
    kp: "Cuspal sub-lord significations (YES/NO)",
    parashari: "Holistic lord placements, yogas & strength",
    tajika: "Yogadhīpati aspects & Saham calculations",
    expandedDetails: "KP delivers binary/conditional verdicts based on cuspal sub-lords, while Parāśarī provides holistic life-narrative readings."
  }
];

export function KpHoraryStreamComparator() {
  const [activeTab, setActiveTab] = useState<"matrix" | "simulation">("matrix");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [sampleQuestion, setSampleQuestion] = useState<string>("visa");

  const simulationFlow = useMemo(() => {
    switch (sampleQuestion) {
      case "visa":
        return {
          question: "Will my visa be approved?",
          kp: ["Querent names number 108", "Ascendant set to Libra 24°", "9th cusp (travel) sub-lord checked", "Venus signifies 9, 11 (YES)"],
          parashari: ["Casts moment chart", "Aries Lagna rising", "9th lord Jupiter in kendra", "Jupiter running daśā predicts success"],
          tajika: ["Casts annual varṣa chart", "Lagna-lord and 9th-lord aspect", "Confirm ithasāla (applying) aspect within 6° (Approved)"]
        };
      default:
        return {
          question: "Will the property sale close?",
          kp: ["Querent names number 45", "Ascendant set to Taurus 12°", "4th cusp (property) sub-lord checked", "Saturn signifies 4, 11 (YES)"],
          parashari: ["Casts moment chart", "Gemini Lagna rising", "4th lord Mercury in 8th", "Obstacles predicted via daśā lord"],
          tajika: ["Casts annual chart", "Lagna-lord and 4th-lord in separating aspect", "Confirm īsarāpha (separating) aspect (Receding)"]
        };
    }
  }, [sampleQuestion]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", color: INK_PRIMARY }} data-interactive="kp-horary-stream-comparator">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 7 · Lesson 6</span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.5rem", fontWeight: 700 }}>KP vs Parāśarī vs Tājika Praśna Comparator</h1>
      </section>

      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("matrix")}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: `1.5px solid ${activeTab === "matrix" ? GOLD : HAIRLINE}`,
            background: activeTab === "matrix" ? `${GOLD}22` : SURFACE,
            color: activeTab === "matrix" ? GOLD : INK_PRIMARY,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "0.85rem"
          }}
        >
          Comparison Matrix
        </button>
        <button
          onClick={() => setActiveTab("simulation")}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: `1.5px solid ${activeTab === "simulation" ? GOLD : HAIRLINE}`,
            background: activeTab === "simulation" ? `${GOLD}22` : SURFACE,
            color: activeTab === "simulation" ? GOLD : INK_PRIMARY,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "0.85rem"
          }}
        >
          Scenario Simulator
        </button>
      </div>

      {/* Main Tab Render */}
      {activeTab === "matrix" ? (
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
          <h2 style={{ fontSize: "1.1rem", color: GOLD, margin: "0 0 12px" }}>Astrological Comparison Matrix (Click rows for detail)</h2>
          
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}`, color: GOLD }}>
                <th style={{ textAlign: "left", padding: "8px" }}>Dimension</th>
                <th style={{ textAlign: "left", padding: "8px" }}>KP Horary</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Parāśarī Praśna</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Tājika Praśna</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISONS.map((row, idx) => {
                const isExpanded = expandedRow === idx;
                return (
                  <>
                    <tr
                      key={idx}
                      onClick={() => setExpandedRow(isExpanded ? null : idx)}
                      style={{
                        borderBottom: `1px solid ${HAIRLINE}`,
                        cursor: "pointer",
                        background: isExpanded ? `${GOLD}06` : "transparent"
                      }}
                    >
                      <td style={{ padding: "10px", fontWeight: 700, color: GOLD }}>{row.dimension}</td>
                      <td style={{ padding: "10px" }}>{row.kp}</td>
                      <td style={{ padding: "10px" }}>{row.parashari}</td>
                      <td style={{ padding: "10px" }}>{row.tajika}</td>
                    </tr>
                    {isExpanded && (
                      <tr style={{ background: `${GOLD}0a` }}>
                        <td colSpan={4} style={{ padding: "12px 16px", color: INK_SECONDARY, fontSize: "0.8rem", borderBottom: `1px solid ${GOLD}44` }}>
                          <strong>Deep-Dive Detail:</strong> {row.expandedDetails}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.1rem", color: GOLD, margin: "0" }}>Scenario Simulator</h2>
            <div>
              <span style={{ fontSize: "0.85rem", marginRight: "8px" }}>Choose Query:</span>
              <select
                value={sampleQuestion}
                onChange={(e) => setSampleQuestion(e.target.value)}
                style={{ padding: "4px 8px", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY, fontWeight: 700 }}
              >
                <option value="visa">Visa Approval</option>
                <option value="property">Property Close</option>
              </select>
            </div>
          </div>

          {/* Dual columns for visual flow comparison */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            
            {/* KP Box */}
            <div style={{ border: `1.5px solid ${GOLD}`, borderRadius: 8, padding: "12px", background: `${GOLD}0a` }}>
              <strong style={{ color: GOLD, fontSize: "0.85rem", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>KP Horary Path</strong>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {simulationFlow.kp.map((step, sIdx) => (
                  <div key={sIdx} style={{ fontSize: "0.78rem", padding: "6px", border: `1px solid ${HAIRLINE}`, borderRadius: 4, background: SURFACE }}>
                    {sIdx + 1}. {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Parashari Box */}
            <div style={{ border: `1.5px solid ${INDIGO}`, borderRadius: 8, padding: "12px", background: `${INDIGO}0a` }}>
              <strong style={{ color: INDIGO, fontSize: "0.85rem", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Parāśarī Praśna Path</strong>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {simulationFlow.parashari.map((step, sIdx) => (
                  <div key={sIdx} style={{ fontSize: "0.78rem", padding: "6px", border: `1px solid ${HAIRLINE}`, borderRadius: 4, background: SURFACE }}>
                    {sIdx + 1}. {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Tajika Box */}
            <div style={{ border: `1.5px solid #2F7D55`, borderRadius: 8, padding: "12px", background: `#2F7D550a` }}>
              <strong style={{ color: "#2F7D55", fontSize: "0.85rem", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Tājika Praśna Path</strong>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {simulationFlow.tajika.map((step, sIdx) => (
                  <div key={sIdx} style={{ fontSize: "0.78rem", padding: "6px", border: `1px solid ${HAIRLINE}`, borderRadius: 4, background: SURFACE }}>
                    {sIdx + 1}. {step}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* General summary panel */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "12px 16px", background: SURFACE, marginTop: "24px", fontSize: "0.8rem", color: INK_MUTED, fontStyle: "italic" }}>
        Takeaway: Each of the three traditions operates a fully complete, self-consistent method. Mixing them or conflating them (e.g. evaluating a KP sub-lord with Tājika deeptāṁśa orbs) breaks their calibration and invalidates the reading. Choose one stream up front and stay in its column.
      </div>

    </div>
  );
}
