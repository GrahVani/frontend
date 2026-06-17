"use client";

import { useState } from "react";
import { Info, Check, ArrowRight, Layers, Sun, Moon, Compass, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

const CLIENT_CONCERNS = [
  { id: "marriage", label: "Marriage & Partnership", cluster: ["Vivāha Saham", "Mitra Saham"] },
  { id: "career", label: "Career & Authority", cluster: ["Karma Saham", "Rāja Saham", "Vyāpāra Saham"] },
  { id: "health", label: "Health & Longevity Check", cluster: ["Jīvana Saham", "Mṛtyu Saham", "Ayur Saham"] },
  { id: "wealth", label: "Wealth & Gains", cluster: ["Dhana Saham", "Lābha Saham", "Vyaya Saham"] }
];

const ALL_SAHAMS = [
  "Punya Saham", "Vivāha Saham", "Mitra Saham", "Karma Saham", 
  "Rāja Saham", "Vyāpāra Saham", "Jīvana Saham", "Mṛtyu Saham", 
  "Ayur Saham", "Dhana Saham", "Lābha Saham", "Vyaya Saham"
];

export function TajikaSahamsApplicationWizard() {
  const [step, setStep] = useState(1);
  const [concern, setConcern] = useState("marriage");
  const [selectedSahams, setSelectedSahams] = useState<string[]>([]);
  const [isDayBirth, setIsDayBirth] = useState(true);
  const [lagnaDeg, setLagnaDeg] = useState(10);
  const [sunDeg, setSunDeg] = useState(50);
  const [moonDeg, setMoonDeg] = useState(230);
  const [orbSeparation, setOrbSeparation] = useState(-4); // -15 to +15 degree offset
  const [verdictSelect, setVerdictSelect] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const targetCluster = CLIENT_CONCERNS.find(c => c.id === concern)?.cluster || [];

  // Calculation for Step 2
  const diff = isDayBirth ? (moonDeg - sunDeg) : (sunDeg - moonDeg);
  let rawSum = diff + lagnaDeg;
  let finalDeg = rawSum % 360;
  if (finalDeg < 0) finalDeg += 360;

  const houseIndex = Math.floor(finalDeg / 30) + 1; // Relative to Return Lagna at Aries 0°
  const rashiNames = [
    "Aries (Meṣa)", "Taurus (Vṛṣabha)", "Gemini (Mithuna)", "Cancer (Karka)",
    "Leo (Siṁha)", "Virgo (Kanyā)", "Libra (Tulā)", "Scorpio (Vṛścika)",
    "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Mīna)"
  ];
  const rashiIndex = Math.floor(finalDeg / 30);

  const toggleSahamSelection = (saham: string) => {
    setSelectedSahams(prev =>
      prev.includes(saham) ? prev.filter(x => x !== saham) : [...prev, saham]
    );
  };

  const isStep1Correct = () => {
    if (selectedSahams.length !== targetCluster.length) return false;
    return targetCluster.every(s => selectedSahams.includes(s));
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedSahams([]);
    setVerdictSelect(null);
    setFinished(false);
  };

  const handleVerdictSelection = (idx: number) => {
    setVerdictSelect(idx);
    if (idx === 2) {
      setFinished(true);
    }
  };

  // Math for Step 4 SVG aspect lines
  const orbLimit = 9; // Jupiter orb limit
  const isWithinOrb = Math.abs(orbSeparation) <= orbLimit;
  const isApplying = orbSeparation < 0 && isWithinOrb;
  const isSeparating = orbSeparation >= 0 && isWithinOrb;

  const getAspectCoords = (offset: number) => {
    // Convert offset angle (centered at 90 degrees/top)
    const angleRad = ((90 + offset) * Math.PI) / 180;
    const cx = 100;
    const cy = 110;
    const radius = 65;
    return {
      x: cx + radius * Math.cos(angleRad),
      y: cy - radius * Math.sin(angleRad)
    };
  };

  const planetCoords = getAspectCoords(orbSeparation * 6); // Amplify scale for visual representation

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(255, 253, 246, 0.7)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
      data-interactive="tajika-sahams-application-wizard"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.12)", paddingBottom: "12px", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Module 19 — Chapter 3 — Lesson 4
        </span>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0" }}>
          Five-Step Sahams Application Wizard
        </h3>
        <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: "2px 0 0" }}>
          Simulate a real consultation workflow from identifying saham clusters to issuing a non-deterministic verdict.
        </p>
      </div>

      {/* Wizard Progress Stepper */}
      <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(156, 122, 47, 0.1)", paddingBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
        {[1, 2, 3, 4, 5].map((s) => {
          const isCurrent = s === step;
          const isDone = s < step;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: isCurrent ? GOLD_DEEP : isDone ? GREEN : "rgba(156, 122, 47, 0.05)",
                  color: isCurrent || isDone ? "#ffffff" : INK_SECONDARY,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "12px",
                  border: `1.5px solid ${isCurrent || isDone ? "transparent" : "rgba(156, 122, 47, 0.15)"}`
                }}
              >
                {isDone ? <Check size={14} /> : s}
              </div>
              <span style={{ fontSize: "11.5px", fontWeight: isCurrent ? 700 : 500, color: isCurrent ? GOLD_DEEP : INK_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {s === 1 ? "Identify" : s === 2 ? "Compute" : s === 3 ? "Placement" : s === 4 ? "Aspect" : "Verdict"}
              </span>
              {s < 5 && <ArrowRight size={12} color={INK_MUTED} />}
            </div>
          );
        })}
      </div>

      {/* STEP 1: IDENTIFY */}
      {step === 1 && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, margin: 0 }}>
            Step 1: Identify Client Concern and Select Cluster
          </h4>
          <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0 }}>
            Pick the client's concern, and then select the specific Sahams that must be analyzed together in that cluster.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
            {/* Concern List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {CLIENT_CONCERNS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setConcern(c.id); setSelectedSahams([]); }}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    background: concern === c.id ? "rgba(156, 122, 47, 0.08)" : "#ffffff",
                    border: `1px solid ${concern === c.id ? GOLD : "rgba(156, 122, 47, 0.12)"}`,
                    color: concern === c.id ? GOLD_DEEP : INK_SECONDARY,
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "12.5px"
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Saham Selector Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                Select Sahams to add to the analysis cluster:
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                {ALL_SAHAMS.map((s) => {
                  const isSel = selectedSahams.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSahamSelection(s)}
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        background: isSel ? GOLD : "#ffffff",
                        color: isSel ? "#ffffff" : INK_SECONDARY,
                        border: `1px solid ${isSel ? GOLD : "rgba(156, 122, 47, 0.12)"}`,
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 600,
                        textAlign: "left"
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
            <button
              onClick={() => setStep(2)}
              disabled={!isStep1Correct()}
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                background: isStep1Correct() ? GREEN : "rgba(156, 122, 47, 0.1)",
                color: isStep1Correct() ? "#ffffff" : INK_MUTED,
                border: "none",
                fontWeight: 700,
                cursor: isStep1Correct() ? "pointer" : "default",
                fontSize: "13px"
              }}
            >
              Continue to Computation &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: COMPUTE */}
      {step === 2 && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, margin: 0 }}>
            Step 2: Compute Saham Coordinates
          </h4>
          <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0 }}>
            Verify birth time and slide the longitudes to see how birth time alters the order of Sun and Moon in Punya computation.
          </p>

          <div style={{ display: "flex", background: "rgba(156, 122, 47, 0.08)", padding: "2px", borderRadius: "6px", width: "fit-content" }}>
            <button
              onClick={() => setIsDayBirth(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "11px",
                background: isDayBirth ? "#ffffff" : "transparent",
                color: isDayBirth ? GOLD_DEEP : INK_SECONDARY
              }}
            >
              <Sun size={12} color={isDayBirth ? AMBER : INK_MUTED} />
              Day Birth
            </button>
            <button
              onClick={() => setIsDayBirth(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "11px",
                background: !isDayBirth ? "#ffffff" : "transparent",
                color: !isDayBirth ? GOLD_DEEP : INK_SECONDARY
              }}
            >
              <Moon size={12} color={!isDayBirth ? GOLD_DEEP : INK_MUTED} />
              Night Birth
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Sliders */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                  <span>Lagna Longitude:</span>
                  <strong>{lagnaDeg}°</strong>
                </div>
                <input type="range" min="0" max="359" value={lagnaDeg} onChange={e => setLagnaDeg(parseInt(e.target.value))} style={{ width: "100%", accentColor: GOLD }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                  <span>Sun Longitude:</span>
                  <strong>{sunDeg}°</strong>
                </div>
                <input type="range" min="0" max="359" value={sunDeg} onChange={e => setSunDeg(parseInt(e.target.value))} style={{ width: "100%", accentColor: isDayBirth ? RED : GREEN }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                  <span>Moon Longitude:</span>
                  <strong>{moonDeg}°</strong>
                </div>
                <input type="range" min="0" max="359" value={moonDeg} onChange={e => setMoonDeg(parseInt(e.target.value))} style={{ width: "100%", accentColor: isDayBirth ? GREEN : RED }} />
              </div>
            </div>

            {/* Calculations display */}
            <div style={{ background: "rgba(156, 122, 47, 0.03)", padding: "12px", borderRadius: "6px", border: "1px solid rgba(156, 122, 47, 0.08)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: INK_MUTED }}>Formula:</span>
              <div style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, margin: "2px 0 6px" }}>
                {isDayBirth ? "Moon − Sun + Lagna" : "Sun − Moon + Lagna"}
              </div>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: INK_MUTED }}>Calculated Longitude:</span>
              <div style={{ fontSize: "20px", fontWeight: 700, color: GOLD_DEEP, margin: "2px 0" }}>
                {finalDeg}° ({rashiNames[rashiIndex]})
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <button onClick={() => setStep(1)} style={{ padding: "8px 12px", borderRadius: "4px", background: "none", border: "1px solid rgba(156, 122, 47, 0.15)", color: GOLD_DEEP, cursor: "pointer", fontSize: "13px" }}>
              &larr; Back
            </button>
            <button onClick={() => setStep(3)} style={{ padding: "8px 16px", borderRadius: "4px", background: GOLD_DEEP, color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
              Verify House Placement &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: HOUSE PLACEMENT */}
      {step === 3 && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, margin: 0 }}>
            Step 3: Check House Placement (Relative to Solar-Return Lagna)
          </h4>
          <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0 }}>
            Assuming the Varṣaphala (Solar Return) Lagna falls at Aries 0° (Meṣa), map the computed Saham coordinate onto its corresponding house.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", background: "rgba(156, 122, 47, 0.02)", padding: "12px", borderRadius: "6px", border: "1px solid rgba(156, 122, 47, 0.08)" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: INK_MUTED }}>Computed Coordinate:</span>
              <div style={{ fontSize: "18px", fontWeight: 700, color: GOLD_DEEP, margin: "2px 0" }}>
                {finalDeg}° in {rashiNames[rashiIndex]}
              </div>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: INK_MUTED, display: "block", marginTop: "8px" }}>House Location:</span>
              <strong style={{ fontSize: "14px", color: GREEN }}>
                House {houseIndex} (relative to Aries Lagna)
              </strong>
            </div>
            <div>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: INK_MUTED }}>Yearly Context Meaning:</span>
              <p style={{ fontSize: "12px", color: INK_SECONDARY, margin: "2px 0 0", lineHeight: "1.4" }}>
                {houseIndex === 10
                  ? "Auspicious context manifesting in professional standing, promotions, leadership, and public recognition."
                  : houseIndex === 7
                  ? "Supportive ambient context for partnerships, spousal support, and collaborative contracts."
                  : " Favorable opportunity-conditions highlighting this house's life themes. Requires active participation to yield concrete results."}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <button onClick={() => setStep(2)} style={{ padding: "8px 12px", borderRadius: "4px", background: "none", border: "1px solid rgba(156, 122, 47, 0.15)", color: GOLD_DEEP, cursor: "pointer", fontSize: "13px" }}>
              &larr; Back
            </button>
            <button onClick={() => setStep(4)} style={{ padding: "8px 16px", borderRadius: "4px", background: GOLD_DEEP, color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
              Verify Aspects & Timing &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ASPECTS & TIMING WITH SVG CASATER */}
      {step === 4 && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, margin: 0 }}>
            Step 4: Check Aspect Timing & Scrub Deeptāmśa Orb
          </h4>
          <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0 }}>
            Use the slider to adjust the aspecting planet's degree separation relative to the Saham degree. Watch the caster calculate Vartamāna (Applying) or Pūrṇa (Separating) timing.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", alignItems: "center" }}>
            {/* Control & Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span>Planet Separation from Saham:</span>
                  <strong style={{ color: GOLD_DEEP }}>{orbSeparation}°</strong>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  value={orbSeparation}
                  onChange={e => setOrbSeparation(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: GOLD }}
                />
              </div>

              <div
                style={{
                  background: "rgba(156, 122, 47, 0.03)",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid rgba(156, 122, 47, 0.08)",
                  fontSize: "12.5px"
                }}
              >
                <div>
                  <strong>Orb Status:</strong>{" "}
                  <span style={{ fontWeight: 700, color: isWithinOrb ? GREEN : RED }}>
                    {isWithinOrb ? `Within Orb (Jupiter limit 9°)` : `Out of Orb (Jupiter limit 9°)`}
                  </span>
                </div>
                <div style={{ marginTop: "4px" }}>
                  <strong>Timing Classification:</strong>{" "}
                  <span style={{ fontWeight: 700, color: isApplying ? GREEN : isSeparating ? AMBER : INK_MUTED }}>
                    {isApplying
                      ? "Vartamāna (Applying / Active)"
                      : isSeparating
                      ? "Pūrṇa (Separating / Residual)"
                      : "N/A (Inactive connection)"}
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Aspect Caster Drawing */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(156, 122, 47, 0.01)", border: "1px solid rgba(156, 122, 47, 0.06)", borderRadius: "8px", padding: "10px" }}>
              <svg width="200" height="180" viewBox="0 0 200 180">
                {/* Center Saham */}
                <circle cx="100" cy="110" r="14" fill={GOLD_DEEP} />
                <text x="100" y="110" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                  Saham
                </text>

                {/* Orb sector overlay */}
                {/* Visualizing 9 degrees limit: arc from 90-9*6 (36) to 90+9*6 (144) on the orbit */}
                <path
                  d="M 47,65 A 65 65 0 0 1 153,65 L 100,110 Z"
                  fill="rgba(156, 122, 47, 0.05)"
                  stroke="rgba(156, 122, 47, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Orbit path for aspecting planet */}
                <path
                  d="M 35,110 A 65 65 0 0 1 165,110"
                  fill="none"
                  stroke="rgba(156, 122, 47, 0.2)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Aspecting line connecting planet to saham */}
                {isWithinOrb && (
                  <line
                    x1="100"
                    y1="110"
                    x2={planetCoords.x}
                    y2={planetCoords.y}
                    stroke={isApplying ? GREEN : isSeparating ? AMBER : "rgba(156, 122, 47, 0.2)"}
                    strokeWidth="2.5"
                    strokeDasharray={isSeparating ? "4 2" : "none"}
                  />
                )}

                {/* Aspecting Planet node */}
                <circle cx={planetCoords.x} cy={planetCoords.y} r="8" fill={isWithinOrb ? (isApplying ? GREEN : AMBER) : INK_MUTED} />
                <text x={planetCoords.x} y={planetCoords.y} fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                  Ju
                </text>

                {/* Left/Right labels showing Applying vs Separating */}
                <text x="35" y="135" fill={GREEN} fontSize="8" fontWeight="bold" textAnchor="middle">
                  Applying
                </text>
                <text x="165" y="135" fill={AMBER} fontSize="8" fontWeight="bold" textAnchor="middle">
                  Separating
                </text>
                <text x="100" y="150" fill={INK_MUTED} fontSize="8" textAnchor="middle">
                  {orbSeparation}° offset
                </text>
              </svg>
            </div>
          </div>

          <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
            <button onClick={() => setStep(3)} style={{ padding: "8px 12px", borderRadius: "4px", background: "none", border: "1px solid rgba(156, 122, 47, 0.15)", color: GOLD_DEEP, cursor: "pointer", fontSize: "13px" }}>
              &larr; Back
            </button>
            <button onClick={() => setStep(5)} style={{ padding: "8px 16px", borderRadius: "4px", background: GOLD_DEEP, color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
              Synthesize Verdict &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SYNTHESIZE YEAR-VERDICT */}
      {step === 5 && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, margin: 0 }}>
            Step 5: Synthesize Year-Verdict (Convergence-Validation)
          </h4>
          <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0 }}>
            Integrate all layers: the Saham cluster, aspect timing, yearly Munthā progression, and natal Parāśari context. Choose the correct, discipline-compliant client counsel.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "8px" }}>
            <div style={{ border: "1px solid rgba(156, 122, 47, 0.1)", borderRadius: "6px", padding: "10px", background: "rgba(156, 122, 47, 0.02)" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: GOLD_DEEP }}>Active Inputs:</span>
              <ul style={{ fontSize: "12px", margin: "4px 0 0", paddingLeft: "16px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                <li>Dhana Saham in 10th (Career)</li>
                <li>Jupiter Vartamāna aspect (Active)</li>
                <li>Munthā progressing to 10th (Focus)</li>
                <li>Natal Parāśari 10th lord is strong</li>
              </ul>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: INK_MUTED }}>Convergence Status:</span>
              <strong style={{ fontSize: "16px", color: GREEN, display: "flex", alignItems: "center", gap: "4px" }}>
                <ShieldCheck size={16} />
                Strong Convergence
              </strong>
              <span style={{ fontSize: "11px", color: INK_MUTED, marginTop: "2px" }}>
                All layers (saham, yoga, munthā, and natal) align on positive career growth context.
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
              Choose the correct client counsel statement:
            </span>

            <button
              onClick={() => handleVerdictSelection(0)}
              style={{
                padding: "10px",
                borderRadius: "6px",
                background: verdictSelect === 0 ? "rgba(162, 58, 30, 0.03)" : "#ffffff",
                border: `1.5px solid ${verdictSelect === 0 ? RED : "rgba(156, 122, 47, 0.15)"}`,
                textAlign: "left",
                cursor: "pointer",
                fontSize: "12px",
                color: INK_SECONDARY
              }}
            >
              <strong>1. Over-promise:</strong> "You are guaranteed to get promoted and double your business profits this year. The stars align, so success is 100% certain."
            </button>

            <button
              onClick={() => handleVerdictSelection(1)}
              style={{
                padding: "10px",
                borderRadius: "6px",
                background: verdictSelect === 1 ? "rgba(162, 58, 30, 0.03)" : "#ffffff",
                border: `1.5px solid ${verdictSelect === 1 ? RED : "rgba(156, 122, 47, 0.15)"}`,
                textAlign: "left",
                cursor: "pointer",
                fontSize: "12px",
                color: INK_SECONDARY
              }}
            >
              <strong>2. Fear-induction:</strong> "Although it looks positive, Saturn is aspecting, so you might face sudden business bankruptcy if you make any errors."
            </button>

            <button
              onClick={() => handleVerdictSelection(2)}
              style={{
                padding: "10px",
                borderRadius: "6px",
                background: verdictSelect === 2 ? "rgba(47, 125, 85, 0.03)" : "#ffffff",
                border: `1.5px solid ${verdictSelect === 2 ? GREEN : "rgba(156, 122, 47, 0.15)"}`,
                textAlign: "left",
                cursor: "pointer",
                fontSize: "12px",
                color: INK_SECONDARY
              }}
            >
              <strong>3. Discipline-Compliant (M19):</strong> "All major annual indicators (saham, yoga, munthā, and natal context) converge to highlight an exceptionally strong career and professional context for the year. This provides strong opportunity-conditions; make active, structured plans to leverage this context, while remembering that final outcomes depend on your practical work."
            </button>
          </div>

          {finished && (
            <div style={{ borderLeft: `4px solid ${GREEN}`, background: "rgba(47, 125, 85, 0.04)", padding: "12px", borderRadius: "0 6px 6px 0", marginTop: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: GREEN, display: "block" }}>
                Success!
              </span>
              <p style={{ fontSize: "12px", color: INK_SECONDARY, margin: 0 }}>
                You have completed the entire 5-step practitioner workflow and selected the correct, non-deterministic M19 counsel!
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
            <button onClick={() => setStep(4)} style={{ padding: "8px 12px", borderRadius: "4px", background: "none", border: "1px solid rgba(156, 122, 47, 0.15)", color: GOLD_DEEP, cursor: "pointer", fontSize: "13px" }}>
              &larr; Back
            </button>
            {finished ? (
              <button onClick={resetWizard} style={{ padding: "8px 16px", borderRadius: "4px", background: GREEN, color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
                Reset Wizard
              </button>
            ) : (
              <button disabled style={{ padding: "8px 16px", borderRadius: "4px", background: "rgba(156, 122, 47, 0.1)", color: INK_MUTED, border: "none", fontWeight: 700, fontSize: "13px" }}>
                Complete Selection
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
