"use client";

import { useState, useMemo } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const CRIMSON = "#A23A1E";
const GREEN = "#2F7D55";

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
  const [step, setStep] = useState<number>(1);
  const [selectedNum, setSelectedNum] = useState<number>(127);

  const data = useMemo(() => {
    return PRESETS[selectedNum] || PRESETS[127];
  }, [selectedNum]);

  const renderCuspChart = useMemo(() => {
    return (
      <svg viewBox="0 0 400 400" width="100%" height="100%">
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
                {isLagna ? "Lagna" : isPrimary ? `C${hp.id}` : ""}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }, [data]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", color: INK_PRIMARY, fontFamily: "sans-serif" }} data-interactive="kp-synthesis-capstone">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 8 · Lesson 6</span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.5rem", fontWeight: 700 }}>KP Synthesis Capstone Pipeline</h1>
      </section>

      {/* Progress Wizard */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "0.78rem" }}>
        {["1. Input", "2. Chart", "3. CSL", "4. Significators", "5. RPs", "6. Verdict"].map((label, idx) => (
          <div key={label} style={{
            color: step === idx + 1 ? GOLD : step > idx + 1 ? GREEN : INK_MUTED,
            fontWeight: step === idx + 1 ? 900 : 500,
            borderBottom: `2.5px solid ${step === idx + 1 ? GOLD : step > idx + 1 ? GREEN : "transparent"}`,
            paddingBottom: "4px",
            flex: 1,
            textAlign: "center"
          }}>
            {label}
          </div>
        ))}
      </div>

      {/* Step Panels */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "20px", background: SURFACE, minHeight: "180px", marginBottom: "20px" }}>
        
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "1rem", color: GOLD, margin: "0" }}>Step 1: Select/Input Horary Query</h3>
            <p style={{ fontSize: "0.82rem", color: INK_SECONDARY, margin: "0" }}>
              Select a worked example query to launch the pipeline calculation:
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[127, 85, 49].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedNum(num)}
                  style={{
                    flex: 1,
                    background: selectedNum === num ? GOLD : "transparent",
                    color: selectedNum === num ? "#FFFBF2" : INK_PRIMARY,
                    border: `1.5px solid ${selectedNum === num ? GOLD : HAIRLINE}`,
                    borderRadius: "6px",
                    padding: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  #{num} ({num === 127 ? "Marriage" : num === 85 ? "Career" : "Property"})
                </button>
              ))}
            </div>
            <div style={{ fontSize: "0.82rem", fontStyle: "italic", color: INK_MUTED, marginTop: "4px" }}>
              Active Question: "{data.question}"
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "1rem", color: GOLD, margin: "0 0 10px" }}>Step 2: Cast verified Placidus houses</h3>
              <p style={{ fontSize: "0.82rem", color: INK_SECONDARY, margin: "0 0 8px" }}>
                The horary number fixes the exact Lagna degree. Cusp boundaries are computed using the Placidus model and verified.
              </p>
              <ul style={{ listStyle: "none", padding: "0", margin: "0", fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li>Lagna: <strong>{data.lagna}</strong></li>
                <li>Target Cusp: <strong>{data.cusp}</strong></li>
              </ul>
            </div>
            <div style={{ width: "130px", height: "130px", margin: "0 auto" }}>
              {renderCuspChart}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 style={{ fontSize: "1rem", color: GOLD, margin: "0" }}>Step 3: Cuspal Sub-Lord (CSL) Identification</h3>
            <p style={{ fontSize: "0.82rem", color: INK_SECONDARY, margin: "0" }}>
              Determine the Sign, Star, and Sub-Lord for the target cusp degree:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", textAlign: "center", marginTop: "10px" }}>
              <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 6, padding: "8px", background: "rgba(156, 122, 47, 0.05)" }}>
                <span style={{ display: "block", fontSize: "0.7rem", color: INK_MUTED }}>Sign-Lord</span>
                <strong style={{ fontSize: "0.9rem" }}>{selectedNum === 127 || selectedNum === 85 ? "Jupiter" : "Sun"}</strong>
              </div>
              <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 6, padding: "8px", background: "rgba(156, 122, 47, 0.05)" }}>
                <span style={{ display: "block", fontSize: "0.7rem", color: INK_MUTED }}>Star-Lord</span>
                <strong style={{ fontSize: "0.9rem" }}>{data.starLord}</strong>
              </div>
              <div style={{ border: `1.5px solid ${GOLD}`, borderRadius: 6, padding: "8px", background: "rgba(156, 122, 47, 0.1)" }}>
                <span style={{ display: "block", fontSize: "0.7rem", color: GOLD, fontWeight: 700 }}>Sub-Lord (CSL)</span>
                <strong style={{ fontSize: "0.95rem", color: GOLD }}>{data.subLord}</strong>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 style={{ fontSize: "1rem", color: GOLD, margin: "0" }}>Step 4: Significator Chain Evaluation</h3>
            <p style={{ fontSize: "0.82rem", color: INK_SECONDARY, margin: "0" }}>
              Identify the strength of the planets signifying the query houses (Tiers 1-4 significators):
            </p>
            <div style={{ background: "rgba(156, 122, 47, 0.05)", borderRadius: 8, padding: "12px", borderLeft: `4px solid ${GOLD}`, fontSize: "0.8rem", marginTop: "8px" }}>
              <strong>Active Significators:</strong> {data.significators}
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 style={{ fontSize: "1rem", color: GOLD, margin: "0" }}>Step 5: Ruling Planets (RP) Cross-Check</h3>
            <p style={{ fontSize: "0.82rem", color: INK_SECONDARY, margin: "0" }}>
              Query the moment's active rulers (Lagna star/sign lords, Moon star/sign lords, day lord) to verify active triggers:
            </p>
            <div style={{ background: "rgba(156, 122, 47, 0.05)", borderRadius: 8, padding: "12px", borderLeft: `4px solid ${GOLD}`, fontSize: "0.8rem", marginTop: "8px" }}>
              <strong>Ruling Planets of the moment:</strong> {data.rps}
            </div>
          </div>
        )}

        {step === 6 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "1rem", color: GOLD, margin: "0" }}>Step 6: Bidirectional Verdict</h3>
            <div style={{
              background: data.verdict === "YES" ? `${GREEN}11` : data.verdict === "NO" ? `${CRIMSON}11` : "rgba(156, 122, 47, 0.1)",
              border: `1.5px solid ${data.verdict === "YES" ? GREEN : data.verdict === "NO" ? CRIMSON : GOLD}`,
              borderRadius: 8,
              padding: "16px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>Final Verdict:</span>
                <strong style={{
                  fontSize: "1.1rem",
                  color: data.verdict === "YES" ? GREEN : data.verdict === "NO" ? CRIMSON : GOLD
                }}>{data.verdict}</strong>
              </div>
              <p style={{ margin: 0, fontSize: "0.78rem", lineHeight: "1.4" }}>
                {data.verdictDesc}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
          style={{
            background: "transparent",
            color: step === 1 ? INK_MUTED : INK_PRIMARY,
            border: `1px solid ${step === 1 ? HAIRLINE : INK_PRIMARY}`,
            borderRadius: "6px",
            padding: "8px 20px",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: step === 1 ? "not-allowed" : "pointer",
            transition: "all 0.2s ease"
          }}
        >
          Back
        </button>

        {step < 6 ? (
          <button
            onClick={() => setStep(step + 1)}
            style={{
              background: GOLD,
              color: "#FFFBF2",
              border: "none",
              borderRadius: "6px",
              padding: "8px 20px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={() => setStep(1)}
            style={{
              background: GREEN,
              color: "#FFFBF2",
              border: "none",
              borderRadius: "6px",
              padding: "8px 20px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Restart Pipeline
          </button>
        )}
      </div>

    </div>
  );
}
