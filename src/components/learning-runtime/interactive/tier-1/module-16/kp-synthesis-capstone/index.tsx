"use client";

import { useState, useMemo } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "#E9D7A5";
const CRIMSON = "#A23A1E";
const CRIMSON_LIGHT = "#F2B8B8";
const GREEN = "#2F7D55";
const GREEN_LIGHT = "#A3E2C0";

const HOUSE_PATHS = [
  { id: 1, path: "M 200,200 L 100,100 L 200,0 L 300,100 Z", textX: 200, textY: 75, numberX: 200, numberY: 30 },
  { id: 2, path: "M 0,0 L 200,0 L 100,100 Z", textX: 100, textY: 45, numberX: 50, numberY: 30 },
  { id: 3, path: "M 0,0 L 0,200 L 100,100 Z", textX: 45, textY: 100, numberX: 30, numberY: 50 },
  { id: 4, path: "M 200,200 L 100,100 L 0,200 L 100,300 Z", textX: 75, textY: 200, numberX: 30, numberY: 200 },
  { id: 5, path: "M 0,400 L 0,200 L 100,300 Z", textX: 45, textY: 300, numberX: 30, numberY: 350 },
  { id: 6, path: "M 0,400 L 200,400 L 100,300 Z", textX: 100, textY: 355, numberX: 50, numberY: 375 },
  { id: 7, path: "M 200,200 L 100,300 L 200,400 L 300,300 Z", textX: 200, textY: 325, numberX: 200, numberY: 370 },
  { id: 8, path: "M 400,400 L 200,400 L 300,300 Z", textX: 300, textY: 355, numberX: 350, numberY: 375 },
  { id: 9, path: "M 400,400 L 400,200 L 300,300 Z", textX: 355, textY: 300, numberX: 370, numberY: 350 },
  { id: 10, path: "M 200,200 L 300,300 L 400,200 L 300,100 Z", textX: 325, textY: 200, numberX: 370, numberY: 200 },
  { id: 11, path: "M 400,0 L 400,200 L 300,100 Z", textX: 355, textY: 100, numberX: 370, numberY: 50 },
  { id: 12, path: "M 400,0 L 200,0 L 300,100 Z", textX: 300, textY: 45, numberX: 350, numberY: 30 }
];

interface CasePreset {
  number: number;
  question: string;
  lagna: string;
  cusp: string;
  subLord: string;
  starLord: string;
  significators: string;
  rps: string;
  verdict: "YES" | "NO" | "CONDITIONAL";
  verdictDesc: string;
  primaryHouse: number;
}

const PRESETS: Record<number, CasePreset> = {
  127: {
    number: 127,
    question: "Marriage: Will I get married to this proposal?",
    lagna: "Virgo (Kanya) 24°13'",
    cusp: "Pisces (Meena) 24°13'",
    starLord: "Venus",
    subLord: "Venus",
    significators: "Venus (Tier 1), Jupiter (Tier 2), Saturn (Tier 3)",
    rps: "Venus, Moon, Mercury, Jupiter",
    verdict: "YES",
    verdictDesc: "The 7th cuspal sub-lord (Venus) is strongly connected to supporting houses 2 and 11, and appears directly among the active Ruling Planets.",
    primaryHouse: 7
  },
  85: {
    number: 85,
    question: "Career: Will I get this corporate job?",
    lagna: "Gemini (Mithuna) 12°00'",
    cusp: "Pisces (Meena) 12°00' (10th cusp)",
    starLord: "Saturn",
    subLord: "Saturn",
    significators: "Saturn (Tier 1), Mars (Tier 3), Sun (Tier 4)",
    rps: "Mars, Sun, Mercury",
    verdict: "CONDITIONAL",
    verdictDesc: "Saturn lording the 10th cusp occupies the 6th house (service) but lords the 12th (negation). Since Saturn is absent from the RPs, the verdict indicates a delayed, conditional agreement.",
    primaryHouse: 10
  },
  49: {
    number: 49,
    question: "Property: Will the deal close next month?",
    lagna: "Taurus (Vrishabha) 05°20'",
    cusp: "Leo (Simha) 05°20' (4th cusp)",
    starLord: "Ketu",
    subLord: "Mars",
    significators: "Mars (Tier 1), Venus (Tier 2), Ketu (Tier 3)",
    rps: "Venus, Moon, Ketu",
    verdict: "NO",
    verdictDesc: "The 4th cuspal sub-lord (Mars) is placed in the 12th house (loss), lording the 7th and 12th houses, which negates the property acquisition.",
    primaryHouse: 4
  }
};

export function KpSynthesisCapstone() {
  // Navigation / Quest state
  const [activeSeal, setActiveSeal] = useState<number | null>(null);
  const [sealsMelted, setSealsMelted] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false
  });

  // Seal 1 Checkpoint State (Origins)
  const [seal1Answers, setSeal1Answers] = useState<Record<string, string>>({
    literature: "",
    singularity: ""
  });
  const [seal1Feedback, setSeal1Feedback] = useState<string>("");

  // Seal 2 Checkpoint State (Sub-divisions)
  const [seal2Width, setSeal2Width] = useState<number>(10); // user selects years
  const [seal2Gate, setSeal2Gate] = useState<string>("");
  const [seal2Feedback, setSeal2Feedback] = useState<string>("");

  // Seal 3 Checkpoint State (Prediction Pipeline)
  const [selectedNum, setSelectedNum] = useState<number>(127);
  const [pipelineStep, setPipelineStep] = useState<number>(1);

  const data = useMemo(() => {
    return PRESETS[selectedNum] || PRESETS[127];
  }, [selectedNum]);

  // Validation functions
  const validateSeal1 = () => {
    if (seal1Answers.literature === "6readers" && seal1Answers.singularity === "latitude") {
      setSealsMelted((prev) => ({ ...prev, 1: true }));
      setSeal1Feedback("CORRECT. The Origins seal has melted. The foundations of Placidus limits and canonical literature are unlocked.");
      setTimeout(() => setActiveSeal(null), 1500);
    } else {
      setSeal1Feedback("ERROR: Astrological alignment incomplete. Verify literature volumes and coordinate limitations.");
    }
  };

  const validateSeal2 = () => {
    // Venus Vimshottari years is 20
    if (seal2Width === 20 && seal2Gate === "sub_confirm") {
      setSealsMelted((prev) => ({ ...prev, 2: true }));
      setSeal2Feedback("CORRECT. The Subdivision seal has melted. The recursive math and logic gates are verified.");
      setTimeout(() => setActiveSeal(null), 1500);
    } else {
      setSeal2Feedback("ERROR: Nakshatra division proportion or logic gate destination is misaligned.");
    }
  };

  const completeSeal3 = () => {
    setSealsMelted((prev) => ({ ...prev, 3: true }));
    setActiveSeal(null);
  };

  const allMelted = sealsMelted[1] && sealsMelted[2] && sealsMelted[3];

  const renderCuspChart = useMemo(() => {
    return (
      <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ overflow: "visible" }}>
        <rect x="0" y="0" width="400" height="400" fill="none" stroke={GOLD} strokeWidth="3" />
        <line x1="0" y1="0" x2="400" y2="400" stroke={GOLD} strokeWidth="1.5" />
        <line x1="400" y1="0" x2="0" y2="400" stroke={GOLD} strokeWidth="1.5" />
        <path d="M 200,0 L 400,200 L 200,400 L 0,200 Z" fill="none" stroke={GOLD} strokeWidth="1.5" />
        {HOUSE_PATHS.map((hp) => {
          const isLagna = hp.id === 1;
          const isPrimary = hp.id === data.primaryHouse;
          return (
            <g key={hp.id}>
              {(isLagna || isPrimary) && (
                <path d={hp.path} fill={isLagna ? `${GREEN}1a` : `${GOLD}1a`} stroke={isLagna ? GREEN : GOLD} strokeWidth="2" />
              )}
              <text x={hp.numberX} y={hp.numberY} textAnchor="middle" fontSize="13" fill={isLagna ? GREEN : isPrimary ? GOLD : INK_MUTED} fontWeight="900">
                {hp.id}
              </text>
              <text x={hp.textX} y={hp.textY} textAnchor="middle" fontSize="10" fill={INK_PRIMARY} fontWeight="bold">
                {isLagna ? "Lagna" : isPrimary ? `Cusp ${hp.id}` : ""}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }, [data]);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        color: INK_PRIMARY,
        fontFamily: "sans-serif",
        borderRadius: "16px",
        border: `1px solid ${HAIRLINE}`,
        position: "relative"
      }}
      data-interactive="kp-synthesis-capstone"
    >
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.12em" }}>
          Module 16 · Chapter 8 · Lesson 6
        </span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.6rem", fontWeight: 700 }}>
          CONSECRATED KP MASTERY SCROLL
        </h1>
      </section>

      {/* Main Parchment Scroll Wrapper */}
      <div
        style={{
          background: "rgba(247, 243, 233, 0.03)",
          border: `2px solid ${GOLD}`,
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "inset 0 0 20px rgba(156, 122, 47, 0.15)",
          position: "relative",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}
      >
        {!allMelted ? (
          <>
            <p style={{ fontSize: "13px", lineHeight: "1.6", color: INK_SECONDARY, margin: "0", textAlign: "center" }}>
              To unfurl the complete synthesis pipeline of the KP Stream, you must melt the three traditional wax seals by completing their localized shastra challenges.
            </p>

            {/* Seals Layout */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "20px",
                justifyContent: "center",
                marginTop: "10px"
              }}
            >
              {/* Seal 1: Origins */}
              <div
                style={{
                  border: `1px solid ${sealsMelted[1] ? GREEN : HAIRLINE}`,
                  borderRadius: "10px",
                  padding: "16px",
                  textAlign: "center",
                  background: sealsMelted[1] ? `${GREEN}09` : "rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onClick={() => {
                  if (!sealsMelted[1]) {
                    setActiveSeal(1);
                    setSeal1Feedback("");
                  }
                }}
              >
                <div style={{ position: "relative", width: "70px", height: "70px", margin: "0 auto 12px" }}>
                  <svg width="70" height="70" viewBox="0 0 70 70">
                    <circle cx="35" cy="35" r="30" fill={sealsMelted[1] ? GREEN : CRIMSON} stroke={GOLD} strokeWidth="2" />
                    <circle cx="35" cy="35" r="24" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="3 3" />
                    {sealsMelted[1] ? (
                      <path d="M22,35 L30,43 L48,25" fill="none" stroke="#FFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <path d="M25,20 L45,20 L35,45 Z M35,45 L35,53" fill="none" stroke="#FFF" strokeWidth="2.5" />
                    )}
                  </svg>
                </div>
                <strong style={{ display: "block", fontSize: "12px", color: sealsMelted[1] ? GREEN : GOLD }}>
                  SEAL I: ORIGINS
                </strong>
                <span style={{ fontSize: "10px", color: INK_SECONDARY }}>
                  {sealsMelted[1] ? "MELTED (Verified)" : "SEALED (Click to Test)"}
                </span>
              </div>

              {/* Seal 2: Sub-divisions */}
              <div
                style={{
                  border: `1px solid ${sealsMelted[2] ? GREEN : HAIRLINE}`,
                  borderRadius: "10px",
                  padding: "16px",
                  textAlign: "center",
                  background: sealsMelted[2] ? `${GREEN}09` : "rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onClick={() => {
                  if (!sealsMelted[2]) {
                    setActiveSeal(2);
                    setSeal2Feedback("");
                  }
                }}
              >
                <div style={{ position: "relative", width: "70px", height: "70px", margin: "0 auto 12px" }}>
                  <svg width="70" height="70" viewBox="0 0 70 70">
                    <circle cx="35" cy="35" r="30" fill={sealsMelted[2] ? GREEN : CRIMSON} stroke={GOLD} strokeWidth="2" />
                    <circle cx="35" cy="35" r="24" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="3 3" />
                    {sealsMelted[2] ? (
                      <path d="M22,35 L30,43 L48,25" fill="none" stroke="#FFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <path d="M20,35 A 15,15 0 1,1 50,35 A 15,15 0 1,1 20,35" fill="none" stroke="#FFF" strokeWidth="2" />
                    )}
                  </svg>
                </div>
                <strong style={{ display: "block", fontSize: "12px", color: sealsMelted[2] ? GREEN : GOLD }}>
                  SEAL II: SUB-DIVISIONS
                </strong>
                <span style={{ fontSize: "10px", color: INK_SECONDARY }}>
                  {sealsMelted[2] ? "MELTED (Verified)" : "SEALED (Click to Test)"}
                </span>
              </div>

              {/* Seal 3: Predictions */}
              <div
                style={{
                  border: `1px solid ${sealsMelted[3] ? GREEN : HAIRLINE}`,
                  borderRadius: "10px",
                  padding: "16px",
                  textAlign: "center",
                  background: sealsMelted[3] ? `${GREEN}09` : "rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onClick={() => {
                  if (!sealsMelted[3]) {
                    setActiveSeal(3);
                    setPipelineStep(1);
                  }
                }}
              >
                <div style={{ position: "relative", width: "70px", height: "70px", margin: "0 auto 12px" }}>
                  <svg width="70" height="70" viewBox="0 0 70 70">
                    <circle cx="35" cy="35" r="30" fill={sealsMelted[3] ? GREEN : CRIMSON} stroke={GOLD} strokeWidth="2" />
                    <circle cx="35" cy="35" r="24" fill="none" stroke={GOLD} strokeWidth="1" strokeDasharray="3 3" />
                    {sealsMelted[3] ? (
                      <path d="M22,35 L30,43 L48,25" fill="none" stroke="#FFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <path d="M25,25 L45,25 L35,50 Z" fill="none" stroke="#FFF" strokeWidth="2.5" />
                    )}
                  </svg>
                </div>
                <strong style={{ display: "block", fontSize: "12px", color: sealsMelted[3] ? GREEN : GOLD }}>
                  SEAL III: PREDICTIONS
                </strong>
                <span style={{ fontSize: "10px", color: INK_SECONDARY }}>
                  {sealsMelted[3] ? "MELTED (Verified)" : "SEALED (Click to Test)"}
                </span>
              </div>
            </div>

            {/* Challenge overlay panel */}
            {activeSeal !== null && (
              <div
                style={{
                  border: `1px solid ${GOLD}`,
                  borderRadius: "8px",
                  padding: "16px",
                  background: SURFACE,
                  marginTop: "10px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "8px", marginBottom: "12px" }}>
                  <strong style={{ color: GOLD, fontSize: "13px" }}>
                    CHALLENGE GATE {activeSeal === 1 ? "I" : activeSeal === 2 ? "II" : "III"}: {activeSeal === 1 ? "ORIGINS & LITERATURE" : activeSeal === 2 ? "SUBDIVISION SEGMENT RATIOS" : "PREDICTION SYNTHESIS"}
                  </strong>
                  <button onClick={() => setActiveSeal(null)} style={{ background: "none", border: "none", color: INK_MUTED, cursor: "pointer", fontSize: "12px" }}>✕ Close</button>
                </div>

                {/* Challenge content depending on selected seal */}
                {activeSeal === 1 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <p style={{ fontSize: "12px", color: INK_SECONDARY, margin: "0" }}>
                      Identify the correct canonical literature and coordinate mathematical thresholds of the Placidus boundary:
                    </p>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: GOLD, fontWeight: "bold", marginBottom: "4px" }}>
                        How many volumes constitute the canonical KP Reader Series?
                      </label>
                      <select
                        value={seal1Answers.literature}
                        onChange={(e) => setSeal1Answers((prev) => ({ ...prev, literature: e.target.value }))}
                        style={{ width: "100%", padding: "6px", background: "none", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontSize: "12px" }}
                      >
                        <option value="" style={{ background: "#111" }}>Select Volume Count</option>
                        <option value="3readers" style={{ background: "#111" }}>3 Volumes</option>
                        <option value="6readers" style={{ background: "#111" }}>6 Readers (Volumes 1-6)</option>
                        <option value="12readers" style={{ background: "#111" }}>12 Readers</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: GOLD, fontWeight: "bold", marginBottom: "4px" }}>
                        Which coordinate boundary introduces singularities that disrupt unequal Placidus house curves?
                      </label>
                      <select
                        value={seal1Answers.singularity}
                        onChange={(e) => setSeal1Answers((prev) => ({ ...prev, singularity: e.target.value }))}
                        style={{ width: "100%", padding: "6px", background: "none", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontSize: "12px" }}
                      >
                        <option value="" style={{ background: "#111" }}>Select Boundary</option>
                        <option value="longitude" style={{ background: "#111" }}>Crossing the Prime Meridian (0° Longitude)</option>
                        <option value="latitude" style={{ background: "#111" }}>Crossing the Polar Circles (66°33′ N/S Latitude)</option>
                        <option value="ecliptic" style={{ background: "#111" }}>Intersection with the Celestial Equator</option>
                      </select>
                    </div>

                    {seal1Feedback && (
                      <div style={{ fontSize: "11px", color: seal1Feedback.includes("CORRECT") ? GREEN : CRIMSON }}>
                        {seal1Feedback}
                      </div>
                    )}

                    <button
                      onClick={validateSeal1}
                      style={{ background: GOLD, color: "#FFF", border: "none", padding: "8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                    >
                      Verify Alignment
                    </button>
                  </div>
                )}

                {activeSeal === 2 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <p style={{ fontSize: "12px", color: INK_SECONDARY, margin: "0" }}>
                      Calculate the width ratios and logic pathways that regulate stellar hierarchy:
                    </p>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: GOLD, fontWeight: "bold", marginBottom: "4px" }}>
                        Specify the exact Vimshottari years assigned to Venus (determines its proportional share of a 13°20' Nakshatra):
                      </label>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                          type="range"
                          min="6"
                          max="20"
                          step="1"
                          value={seal2Width}
                          onChange={(e) => setSeal2Width(Number(e.target.value))}
                          style={{ flex: 1 }}
                        />
                        <strong style={{ fontSize: "12px", width: "60px", textAlign: "right" }}>{seal2Width} Years</strong>
                      </div>
                      <span style={{ fontSize: "9px", color: INK_MUTED }}>
                        Tip: Venus has the longest period in the Vimshottari cycle.
                      </span>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: GOLD, fontWeight: "bold", marginBottom: "4px" }}>
                        Complete the stellar logic gate rule: "Planet indicates source of event, Star Lord indicates result, Sub Lord indicates..."
                      </label>
                      <select
                        value={seal2Gate}
                        onChange={(e) => setSeal2Gate(e.target.value)}
                        style={{ width: "100%", padding: "6px", background: "none", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontSize: "12px" }}
                      >
                        <option value="" style={{ background: "#111" }}>Select Sub-Lord Function</option>
                        <option value="same_result" style={{ background: "#111" }}>The same result as Star Lord</option>
                        <option value="sub_confirm" style={{ background: "#111" }}>Final Confirmation (favorability / yes-no verdict)</option>
                        <option value="transit_only" style={{ background: "#111" }}>Only active during transit crossing</option>
                      </select>
                    </div>

                    {seal2Feedback && (
                      <div style={{ fontSize: "11px", color: seal2Feedback.includes("CORRECT") ? GREEN : CRIMSON }}>
                        {seal2Feedback}
                      </div>
                    )}

                    <button
                      onClick={validateSeal2}
                      style={{ background: GOLD, color: "#FFF", border: "none", padding: "8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                    >
                      Verify Equations
                    </button>
                  </div>
                )}

                {activeSeal === 3 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <p style={{ fontSize: "12px", color: INK_SECONDARY, margin: "0" }}>
                      Run the complete worked Horary query pipeline to verify prediction convergence:
                    </p>

                    {/* Step Tabs */}
                    <div style={{ display: "flex", gap: "4px", fontSize: "9px", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "4px" }}>
                      {["1. Query", "2. Chart", "3. CSL", "4. Significators", "5. RPs", "6. Verdict"].map((n, i) => (
                        <div key={n} style={{ color: pipelineStep === i + 1 ? GOLD : pipelineStep > i + 1 ? GREEN : INK_MUTED, flex: 1, textAlign: "center", fontWeight: "bold" }}>
                          {n}
                        </div>
                      ))}
                    </div>

                    {/* Step content */}
                    <div style={{ background: "rgba(0, 0, 0, 0.2)", borderRadius: "6px", padding: "12px", minHeight: "140px" }}>
                      {pipelineStep === 1 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <span style={{ fontSize: "10px", color: GOLD }}>SELECT SAMPLE HORARY WORKED CASE:</span>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {[127, 85, 49].map((num) => (
                              <button
                                key={num}
                                onClick={() => setSelectedNum(num)}
                                style={{
                                  flex: 1,
                                  background: selectedNum === num ? GOLD : "transparent",
                                  color: selectedNum === num ? "#FFF" : INK_PRIMARY,
                                  border: `1.5px solid ${selectedNum === num ? GOLD : HAIRLINE}`,
                                  borderRadius: "4px",
                                  padding: "6px",
                                  fontSize: "11px",
                                  cursor: "pointer"
                                }}
                              >
                                #{num} ({num === 127 ? "Marriage" : num === 85 ? "Career" : "Property"})
                              </button>
                            ))}
                          </div>
                          <p style={{ fontSize: "11px", margin: "4px 0 0", color: INK_SECONDARY, fontStyle: "italic" }}>
                            "{data.question}"
                          </p>
                        </div>
                      )}

                      {pipelineStep === 2 && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: "10px", alignItems: "center" }}>
                          <div>
                            <span style={{ fontSize: "10px", color: GOLD }}>PLACIDUS HOUSE BOUNDARIES:</span>
                            <ul style={{ padding: "0 0 0 12px", margin: "4px 0", fontSize: "11px", lineHeight: "1.4" }}>
                              <li>Lagna: <strong>{data.lagna}</strong></li>
                              <li>Target Cusp: <strong>{data.cusp}</strong></li>
                            </ul>
                          </div>
                          <div style={{ width: "90px", height: "90px" }}>
                            {renderCuspChart}
                          </div>
                        </div>
                      )}

                      {pipelineStep === 3 && (
                        <div>
                          <span style={{ fontSize: "10px", color: GOLD }}>CUSPAL SUB-LORD (CSL) IDENTIFICATION:</span>
                          <p style={{ fontSize: "11px", margin: "4px 0" }}>
                            Cusp {data.primaryHouse} coordinates resolve to:
                          </p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "11px" }}>
                            <div style={{ border: `1px solid ${HAIRLINE}`, padding: "4px 8px", borderRadius: "4px" }}>
                              Star-Lord: <strong>{data.starLord}</strong>
                            </div>
                            <div style={{ border: `1px solid ${GOLD}`, padding: "4px 8px", borderRadius: "4px", background: "rgba(156, 122, 47, 0.1)" }}>
                              Sub-Lord: <strong style={{ color: GOLD }}>{data.subLord}</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {pipelineStep === 4 && (
                        <div>
                          <span style={{ fontSize: "10px", color: GOLD }}>SIGNIFICATOR ENERGY CHAINS:</span>
                          <p style={{ fontSize: "11px", margin: "4px 0" }}>
                            Planets signifying the query houses (ordered by hierarchy tier):
                          </p>
                          <div style={{ background: "rgba(156, 122, 47, 0.05)", borderLeft: `3px solid ${GOLD}`, padding: "8px", fontSize: "11px" }}>
                            {data.significators}
                          </div>
                        </div>
                      )}

                      {pipelineStep === 5 && (
                        <div>
                          <span style={{ fontSize: "10px", color: GOLD }}>RULING PLANETS (RPs) MOMENTAL INTEGRITY:</span>
                          <p style={{ fontSize: "11px", margin: "4px 0" }}>
                            Rulers of the moment of query (Lagna + Moon star/sign lords + Day lord):
                          </p>
                          <div style={{ background: "rgba(156, 122, 47, 0.05)", borderLeft: `3px solid ${GOLD}`, padding: "8px", fontSize: "11px" }}>
                            {data.rps}
                          </div>
                        </div>
                      )}

                      {pipelineStep === 6 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontSize: "10px", color: GOLD }}>VERDICT CONVERGENCE:</span>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "11px" }}>Decision:</span>
                            <strong style={{ color: data.verdict === "YES" ? GREEN : data.verdict === "NO" ? CRIMSON : GOLD, fontSize: "13px" }}>
                              {data.verdict}
                            </strong>
                          </div>
                          <p style={{ fontSize: "10px", color: INK_SECONDARY, margin: "0", lineHeight: "1.3" }}>
                            {data.verdictDesc}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Nav triggers */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                      <button
                        disabled={pipelineStep === 1}
                        onClick={() => setPipelineStep((p) => p - 1)}
                        style={{
                          background: "none",
                          border: `1px solid ${HAIRLINE}`,
                          color: pipelineStep === 1 ? INK_MUTED : INK_PRIMARY,
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          cursor: "pointer"
                        }}
                      >
                        Back
                      </button>

                      {pipelineStep < 6 ? (
                        <button
                          onClick={() => setPipelineStep((p) => p + 1)}
                          style={{ background: GOLD, color: "#FFF", border: "none", padding: "4px 12px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                        >
                          Next Step
                        </button>
                      ) : (
                        <button
                          onClick={completeSeal3}
                          style={{ background: GREEN, color: "#FFF", border: "none", padding: "4px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
                        >
                          Unlock Seal III
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Success fully unfurled scroll */
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "fadeIn 1s" }}>
            <div style={{ textAlign: "center", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "12px" }}>
              <span style={{ color: GREEN, fontSize: "10px", textTransform: "uppercase", fontWeight: "bold", letterSpacing: "0.15em" }}>
                ✓ ALL SEALS MELTED · PATHWAY COMPLETE
              </span>
              <h2 style={{ color: GOLD, fontSize: "1.5rem", margin: "6px 0 0 0" }}>
                THE GOLDEN PATH OF KP MASTER SYNTHESIS
              </h2>
            </div>

            {/* Interactive Concept Pathway Diagram */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                borderRadius: "12px",
                border: `1px solid ${GOLD}`,
                padding: "20px"
              }}
            >
              <svg viewBox="0 0 600 240" width="100%" height="100%" style={{ overflow: "visible" }}>
                {/* Connection lines */}
                <line x1="100" y1="120" x2="300" y2="70" stroke={GOLD} strokeWidth="2" strokeDasharray="5 5" />
                <line x1="100" y1="120" x2="300" y2="170" stroke={GOLD} strokeWidth="2" strokeDasharray="5 5" />
                <line x1="300" y1="70" x2="500" y2="120" stroke={GOLD} strokeWidth="2" />
                <line x1="300" y1="170" x2="500" y2="120" stroke={GOLD} strokeWidth="2" />

                {/* Node 1: Origins */}
                <g>
                  <circle cx="100" cy="120" r="30" fill="rgba(156, 122, 47, 0.15)" stroke={GOLD} strokeWidth="2" />
                  <text x="100" y="115" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="bold">I. ORIGINS</text>
                  <text x="100" y="130" textAnchor="middle" fill={INK_SECONDARY} fontSize="8">Placidus Limits</text>
                </g>

                {/* Node 2a: Divisions */}
                <g>
                  <circle cx="300" cy="70" r="30" fill="rgba(47, 125, 85, 0.15)" stroke={GREEN} strokeWidth="2" />
                  <text x="300" y="65" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="bold">IIa. DIVISIONS</text>
                  <text x="300" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="8">CSL 249 Segments</text>
                </g>

                {/* Node 2b: Logic Gates */}
                <g>
                  <circle cx="300" cy="170" r="30" fill="rgba(47, 125, 85, 0.15)" stroke={GREEN} strokeWidth="2" />
                  <text x="300" y="165" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="bold">IIb. LOGIC GATES</text>
                  <text x="300" y="180" textAnchor="middle" fill={INK_SECONDARY} fontSize="8">Star vs Sub Rule</text>
                </g>

                {/* Node 3: Synthesis */}
                <g>
                  <circle cx="500" cy="120" r="30" fill="rgba(156, 122, 47, 0.15)" stroke={GOLD} strokeWidth="2" />
                  <text x="500" y="115" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="bold">III. PREDICTIONS</text>
                  <text x="500" y="130" textAnchor="middle" fill={INK_SECONDARY} fontSize="8">Verdict Convergence</text>
                </g>

                {/* Info Text boxes under nodes */}
                <text x="100" y="175" textAnchor="middle" fill={INK_MUTED} fontSize="8" width="120">
                  Epistemic Lineage &amp; Space math
                </text>
                <text x="300" y="225" textAnchor="middle" fill={INK_MUTED} fontSize="8">
                  Sub-lord recursion &amp; favorability
                </text>
                <text x="500" y="175" textAnchor="middle" fill={INK_MUTED} fontSize="8">
                  RP filtering &amp; double-stream check
                </text>
              </svg>
            </div>

            {/* Achievement Certificate Box */}
            <div
              style={{
                border: `3px double ${GOLD}`,
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                background: "rgba(156,122,47,0.05)",
                marginTop: "10px"
              }}
            >
              <h3 style={{ margin: "0 0 8px 0", color: GOLD, fontSize: "14px", fontWeight: "bold", letterSpacing: "0.1em" }}>
                DECISION ENGINEERING VERIFIED
              </h3>
              <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: INK_PRIMARY, lineHeight: "1.5" }}>
                This certifies that the student has successfully unlocked all shastra gates of Krishnamurti Paddhati, demonstrating competency in spatial Placidus geometry, sub-lord divisions calculation, significator flow chains, and horary verdict convergence.
              </p>
              <div style={{ fontSize: "10px", color: INK_MUTED, fontStyle: "italic" }}>
                "The sub-lord determines favorability, and active RPs seal the timeline."
              </div>
            </div>

            {/* Restart button */}
            <button
              onClick={() => {
                setSealsMelted({ 1: false, 2: false, 3: false });
                setActiveSeal(null);
              }}
              style={{
                background: GOLD,
                color: "#FFF",
                border: "none",
                borderRadius: "8px",
                padding: "10px 24px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                alignSelf: "center"
              }}
            >
              Reset and Consecrate Scroll Again
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
