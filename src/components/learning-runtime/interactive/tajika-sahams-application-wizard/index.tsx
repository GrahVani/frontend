"use client";

import { useState, useEffect, useRef } from "react";
import { Info, Check, ArrowRight, Sun, Moon, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "rgba(156, 122, 47, 0.08)";
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

// North Indian Chart House Polygons
const HOUSE_POLYGONS: Record<number, string> = {
  1: "70,10 100,40 70,70 40,40",
  2: "10,10 70,10 40,40",
  3: "10,10 10,70 40,40",
  4: "10,70 40,40 70,70 40,100",
  5: "10,130 10,70 40,100",
  6: "10,130 70,130 40,100",
  7: "70,130 40,100 70,70 100,100",
  8: "70,130 130,130 100,100",
  9: "130,130 130,70 100,100",
  10: "130,70 100,100 70,70 100,40",
  11: "130,10 130,70 100,40",
  12: "130,10 70,10 100,40"
};

const HOUSE_LABEL_COORDS: Record<number, { x: number; y: number }> = {
  1: { x: 70, y: 35 },
  2: { x: 40, y: 22 },
  3: { x: 22, y: 40 },
  4: { x: 35, y: 70 },
  5: { x: 22, y: 100 },
  6: { x: 40, y: 118 },
  7: { x: 70, y: 105 },
  8: { x: 100, y: 118 },
  9: { x: 118, y: 100 },
  10: { x: 105, y: 70 },
  11: { x: 118, y: 40 },
  12: { x: 100, y: 22 }
};

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

  const containerRef = useRef<HTMLDivElement>(null);

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
    } else {
      setFinished(false);
    }
  };

  // Keyboard navigation for step changes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "SELECT") {
        return;
      }
      if (e.key === "ArrowRight" && step < 5) {
        if (step === 1 && !isStep1Correct()) return;
        setStep(prev => prev + 1);
      } else if (e.key === "ArrowLeft" && step > 1) {
        setStep(prev => prev - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, selectedSahams, concern]);

  // Math for Step 4 SVG aspect lines
  const orbLimit = 9; // Jupiter orb limit
  const isWithinOrb = Math.abs(orbSeparation) <= orbLimit;
  const isApplying = orbSeparation < 0 && isWithinOrb;
  const isSeparating = orbSeparation >= 0 && isWithinOrb;

  const getAspectCoords = (offset: number) => {
    const angleRad = ((90 + offset) * Math.PI) / 180;
    const cx = 100;
    const cy = 100;
    const radius = 65;
    return {
      x: cx + radius * Math.cos(angleRad),
      y: cy - radius * Math.sin(angleRad)
    };
  };

  const planetCoords = getAspectCoords(orbSeparation * 5); // Amplified separation scale

  return (
    <div
      ref={containerRef}
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "14px",
        background: "rgba(255, 253, 246, 0.8)",
        border: "1px solid rgba(156, 122, 47, 0.2)",
        boxShadow: "0 12px 40px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="tajika-sahams-application-wizard"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Module 19 — Chapter 3 — Lesson 4
            </span>
            <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", fontFamily: "var(--font-cormorant), serif" }}>
              Practitioner Sahams Application Wizard
            </h3>
          </div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", background: GOLD_LIGHT, padding: "6px 12px", borderRadius: "20px", border: "1px solid rgba(156, 122, 47, 0.1)" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: GOLD_DEEP }}>Keyboard Shortcuts Active (&larr; / &rarr;)</span>
          </div>
        </div>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "6px 0 0", lineHeight: "1.5" }}>
          Simulate a professional consultant's workflow. Walk through 5 critical validation stages: clustering, calculation, house assessment, aspect timing, and final ethical counsel synthesis.
        </p>
      </div>

      {/* Wizard Progress Stepper */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          borderBottom: "1px solid rgba(156, 122, 47, 0.1)", 
          paddingBottom: "14px", 
          flexWrap: "wrap", 
          gap: "10px" 
        }}
        role="navigation"
        aria-label="Wizard Steps"
      >
        {[1, 2, 3, 4, 5].map((s) => {
          const isCurrent = s === step;
          const isDone = s < step;
          return (
            <button
              key={s}
              onClick={() => {
                if (s > 1 && !isStep1Correct()) return;
                setStep(s);
              }}
              disabled={s > 1 && !isStep1Correct()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: (s === 1 || isStep1Correct()) ? "pointer" : "not-allowed",
                opacity: (s === 1 || isStep1Correct()) ? 1 : 0.4,
                padding: "4px 8px",
                borderRadius: "4px"
              }}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: isCurrent ? GOLD_DEEP : isDone ? GREEN : "rgba(156, 122, 47, 0.05)",
                  color: isCurrent || isDone ? "#ffffff" : INK_SECONDARY,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "12px",
                  transition: "all 0.2s ease-in-out",
                  border: isCurrent ? `2px solid ${GOLD}` : `1.5px solid rgba(156, 122, 47, 0.15)`
                }}
              >
                {isDone ? <Check size={14} /> : s}
              </div>
              <span style={{ fontSize: "12px", fontWeight: isCurrent ? 700 : 500, color: isCurrent ? GOLD_DEEP : INK_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {s === 1 ? "1. Identify" : s === 2 ? "2. Compute" : s === 3 ? "3. Placement" : s === 4 ? "4. Aspect" : "5. Verdict"}
              </span>
              {s < 5 && <ArrowRight size={12} color={INK_MUTED} style={{ marginLeft: "4px" }} />}
            </button>
          );
        })}
      </div>

      {/* STEP 1: IDENTIFY */}
      {step === 1 && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ backgroundColor: GOLD_DEEP, color: "#ffffff", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>STEP 1</span>
            <h4 style={{ fontSize: "18px", fontWeight: 700, color: INK_PRIMARY, margin: 0 }}>
              Isolate Concern & Select Saham Cluster
            </h4>
          </div>
          <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: 0, lineHeight: "1.5" }}>
            Astrological diagnosis requires clustering related Sahams to avoid single-point reading bias. Select a client concern, then activate all Sahams corresponding to that concern's traditional cluster.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", minHeight: "220px" }}>
            {/* Concern List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>Client Concerns</span>
              {CLIENT_CONCERNS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setConcern(c.id); setSelectedSahams([]); }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "8px",
                    background: concern === c.id ? GOLD_LIGHT : "#ffffff",
                    border: `1.5px solid ${concern === c.id ? GOLD : "rgba(156, 122, 47, 0.15)"}`,
                    color: concern === c.id ? GOLD_DEEP : INK_SECONDARY,
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "13px",
                    transition: "all 0.2s ease-in-out"
                  }}
                  aria-pressed={concern === c.id}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Saham Selector Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Traditional Sahams (Activate Cluster)
                </span>
                <span style={{ fontSize: "11px", color: GOLD_DEEP, fontWeight: 600 }}>
                  Required: {targetCluster.join(", ")}
                </span>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
                {ALL_SAHAMS.map((s) => {
                  const isSel = selectedSahams.includes(s);
                  const isTarget = targetCluster.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSahamSelection(s)}
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        background: isSel ? GOLD : "#ffffff",
                        color: isSel ? "#ffffff" : INK_SECONDARY,
                        border: `1.5px solid ${isSel ? GOLD : isTarget ? "rgba(156, 122, 47, 0.25)" : "rgba(156, 122, 47, 0.1)"}`,
                        cursor: "pointer",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        textAlign: "left",
                        transition: "all 0.2s ease",
                        boxShadow: isTarget && !isSel ? "0 0 6px rgba(156, 122, 47, 0.15)" : "none"
                      }}
                      aria-label={`Toggle ${s}`}
                      aria-pressed={isSel}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>{s}</span>
                        {isSel && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(156, 122, 47, 0.1)", paddingTop: "14px", marginTop: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: isStep1Correct() ? GREEN : RED }}>
              <Info size={16} />
              <span style={{ fontSize: "12px", fontWeight: 600 }}>
                {isStep1Correct() 
                  ? "Perfect! The cluster is correctly isolated for analysis." 
                  : `Please select both Sahams belonging to the ${CLIENT_CONCERNS.find(c => c.id === concern)?.label} cluster.`}
              </span>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!isStep1Correct()}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                background: isStep1Correct() ? GREEN : "rgba(156, 122, 47, 0.1)",
                color: isStep1Correct() ? "#ffffff" : INK_MUTED,
                border: "none",
                fontWeight: 700,
                cursor: isStep1Correct() ? "pointer" : "not-allowed",
                fontSize: "13.5px",
                transition: "all 0.2s"
              }}
            >
              Continue to Computation &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: COMPUTE */}
      {step === 2 && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ backgroundColor: GOLD_DEEP, color: "#ffffff", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>STEP 2</span>
            <h4 style={{ fontSize: "18px", fontWeight: 700, color: INK_PRIMARY, margin: 0 }}>
              Adjust Longitudes & Formula Direction
            </h4>
          </div>
          <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: 0, lineHeight: "1.5" }}>
            Tājiika Saham equations change spatial vector directions based on diurnal context. If birth occurs at night, the formula reverses from <code style={{ fontStyle: "italic", background: "#f5f5f5", padding: "2px 4px", borderRadius: "3px" }}>Moon &rarr; Sun</code> to <code style={{ fontStyle: "italic", background: "#f5f5f5", padding: "2px 4px", borderRadius: "3px" }}>Sun &rarr; Moon</code>.
          </p>

          <div style={{ display: "flex", background: "rgba(156, 122, 47, 0.08)", padding: "4px", borderRadius: "8px", width: "fit-content" }}>
            <button
              onClick={() => setIsDayBirth(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "12px",
                background: isDayBirth ? "#ffffff" : "transparent",
                color: isDayBirth ? GOLD_DEEP : INK_SECONDARY,
                boxShadow: isDayBirth ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.2s"
              }}
              aria-pressed={isDayBirth}
            >
              <Sun size={14} color={isDayBirth ? AMBER : INK_MUTED} />
              Day Birth (Diurnal)
            </button>
            <button
              onClick={() => setIsDayBirth(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "12px",
                background: !isDayBirth ? "#ffffff" : "transparent",
                color: !isDayBirth ? GOLD_DEEP : INK_SECONDARY,
                boxShadow: !isDayBirth ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.2s"
              }}
              aria-pressed={!isDayBirth}
            >
              <Moon size={14} color={!isDayBirth ? GOLD_DEEP : INK_MUTED} />
              Night Birth (Nocturnal)
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {/* Sliders */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span>Lagna (Ascendant) Longitude:</span>
                  <strong style={{ color: GOLD_DEEP }}>{lagnaDeg}°</strong>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="359" 
                  value={lagnaDeg} 
                  onChange={e => setLagnaDeg(parseInt(e.target.value))} 
                  style={{ width: "100%", accentColor: GOLD, height: "8px", borderRadius: "4px" }}
                  aria-label="Lagna Longitude"
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span>Sun (Sūrya) Longitude:</span>
                  <strong style={{ color: isDayBirth ? RED : GREEN }}>{sunDeg}°</strong>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="359" 
                  value={sunDeg} 
                  onChange={e => setSunDeg(parseInt(e.target.value))} 
                  style={{ width: "100%", accentColor: isDayBirth ? RED : GREEN, height: "8px", borderRadius: "4px" }}
                  aria-label="Sun Longitude"
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span>Moon (Candra) Longitude:</span>
                  <strong style={{ color: isDayBirth ? GREEN : RED }}>{moonDeg}°</strong>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="359" 
                  value={moonDeg} 
                  onChange={e => setMoonDeg(parseInt(e.target.value))} 
                  style={{ width: "100%", accentColor: isDayBirth ? GREEN : RED, height: "8px", borderRadius: "4px" }}
                  aria-label="Moon Longitude"
                />
              </div>
            </div>

            {/* Calculations display */}
            <div style={{ background: GOLD_LIGHT, padding: "16px", borderRadius: "10px", border: "1px solid rgba(156, 122, 47, 0.15)", display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.05em" }}>Calculated Saham Vector Formula:</span>
                <div style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: 700, color: GOLD_DEEP, marginTop: "2px" }}>
                  {isDayBirth ? "Moon − Sun + Lagna" : "Sun − Moon + Lagna"}
                </div>
              </div>
              <div style={{ borderTop: "1px solid rgba(156, 122, 47, 0.1)", paddingTop: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.05em" }}>Resulting Longitude Coordinate:</span>
                <div style={{ fontSize: "22px", fontWeight: 700, color: GOLD_DEEP, marginTop: "2px" }}>
                  {finalDeg}° in {rashiNames[rashiIndex]}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", borderTop: "1px solid rgba(156, 122, 47, 0.1)", paddingTop: "14px" }}>
            <button onClick={() => setStep(1)} style={{ padding: "10px 16px", borderRadius: "6px", background: "none", border: "1px solid rgba(156, 122, 47, 0.2)", color: GOLD_DEEP, cursor: "pointer", fontSize: "13.5px", fontWeight: 600 }}>
              &larr; Back to Selection
            </button>
            <button onClick={() => setStep(3)} style={{ padding: "10px 20px", borderRadius: "6px", background: GOLD_DEEP, color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13.5px" }}>
              Verify House Placement &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: HOUSE PLACEMENT */}
      {step === 3 && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ backgroundColor: GOLD_DEEP, color: "#ffffff", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>STEP 3</span>
            <h4 style={{ fontSize: "18px", fontWeight: 700, color: INK_PRIMARY, margin: 0 }}>
              Assess Relative House Placement
            </h4>
          </div>
          <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: 0, lineHeight: "1.5" }}>
            Sahams are mapped relative to the Varṣaphala Lagna (Ascendant), which acts as House 1. Below is the interactive North Indian chart. The house containing the calculated Saham is highlighted.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", alignItems: "center" }}>
            
            {/* North Indian SVG Chart */}
            <div style={{ display: "flex", justifyContent: "center", background: "rgba(156, 122, 47, 0.02)", border: "1px solid rgba(156, 122, 47, 0.08)", borderRadius: "10px", padding: "16px" }}>
              <svg width="220" height="220" viewBox="0 0 140 140" style={{ maxWidth: "100%", height: "auto" }}>
                {/* Draw House Polygons */}
                {Object.entries(HOUSE_POLYGONS).map(([hStr, points]) => {
                  const h = parseInt(hStr);
                  const isHighlighted = h === houseIndex;
                  return (
                    <g key={h}>
                      <polygon
                        points={points}
                        fill={isHighlighted ? "rgba(156, 122, 47, 0.2)" : "rgba(255, 255, 255, 0.9)"}
                        stroke={isHighlighted ? GOLD : "rgba(156, 122, 47, 0.25)"}
                        strokeWidth={isHighlighted ? "1.8" : "0.8"}
                        style={{ transition: "all 0.3s ease" }}
                      />
                      {/* House Label */}
                      <text
                        x={HOUSE_LABEL_COORDS[h].x}
                        y={HOUSE_LABEL_COORDS[h].y}
                        fill={isHighlighted ? GOLD_DEEP : INK_MUTED}
                        fontSize={isHighlighted ? "8.5" : "7"}
                        fontWeight={isHighlighted ? "bold" : "normal"}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        H{h}
                      </text>
                    </g>
                  );
                })}

                {/* Outer frame */}
                <rect x="10" y="10" width="120" height="120" fill="none" stroke={GOLD} strokeWidth="1" />

                {/* Lagna (H1) Text */}
                <text x="70" y="22" fill={GOLD_DEEP} fontSize="6" fontWeight="bold" textAnchor="middle">
                  Lagna
                </text>
                
                {/* Saham Indicator inside highlighted house */}
                {HOUSE_LABEL_COORDS[houseIndex] && (
                  <circle
                    cx={HOUSE_LABEL_COORDS[houseIndex].x}
                    cy={HOUSE_LABEL_COORDS[houseIndex].y + 9}
                    r="2.5"
                    fill={GOLD_DEEP}
                  />
                )}
              </svg>
            </div>

            {/* Placement Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "rgba(156, 122, 47, 0.03)", padding: "14px", borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.08)" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.05em" }}>Computed Coordinate:</span>
                <div style={{ fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, margin: "2px 0" }}>
                  {finalDeg}° in {rashiNames[rashiIndex]}
                </div>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: INK_MUTED, display: "block", marginTop: "8px", letterSpacing: "0.05em" }}>Calculated Location:</span>
                <strong style={{ fontSize: "15px", color: GREEN }}>
                  House {houseIndex} (relative to Aries Lagna)
                </strong>
              </div>

              <div>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.05em" }}>Yearly Ambience & Meaning:</span>
                <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: "4px 0 0", lineHeight: "1.4" }}>
                  {houseIndex === 10
                    ? "Exceptional professional context. The Saham activates career opportunities, potential public promotions, and executive recognition."
                    : houseIndex === 7
                    ? "Active partnership context. Highlights collaborative business agreements, marital interactions, and client relations."
                    : houseIndex === 2
                    ? "Financial focus context. Highlights cash flow, resource security, and family wealth adjustments."
                    : houseIndex === 11
                    ? "Context of gains, networked support, financial windfalls, and fulfillment of year goals."
                    : "Favorable ambient opportunity-conditions highlighting this house's life themes. Needs active human endeavor to materialize."}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", borderTop: "1px solid rgba(156, 122, 47, 0.1)", paddingTop: "14px" }}>
            <button onClick={() => setStep(2)} style={{ padding: "10px 16px", borderRadius: "6px", background: "none", border: "1px solid rgba(156, 122, 47, 0.2)", color: GOLD_DEEP, cursor: "pointer", fontSize: "13.5px", fontWeight: 600 }}>
              &larr; Back to Compute
            </button>
            <button onClick={() => setStep(4)} style={{ padding: "10px 20px", borderRadius: "6px", background: GOLD_DEEP, color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13.5px" }}>
              Verify Aspects & Timing &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ASPECTS & TIMING WITH SVG CASATER */}
      {step === 4 && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ backgroundColor: GOLD_DEEP, color: "#ffffff", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>STEP 4</span>
            <h4 style={{ fontSize: "18px", fontWeight: 700, color: INK_PRIMARY, margin: 0 }}>
              Check Aspect timing & Deeptāmśa Orb
            </h4>
          </div>
          <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: 0, lineHeight: "1.5" }}>
            A Saham only triggers if a significant transit planet forms an aspect within the traditional **Deeptāmśa Orb** limit (9° for Jupiter). Scrub the slider to adjust the aspect alignment.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", alignItems: "center" }}>
            {/* Control & Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span>Planet separation from Saham point:</span>
                  <strong style={{ color: GOLD_DEEP }}>{orbSeparation}°</strong>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  value={orbSeparation}
                  onChange={e => setOrbSeparation(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: GOLD, height: "8px", borderRadius: "4px" }}
                  aria-label="Planet Separation Angle"
                />
              </div>

              <div
                style={{
                  background: "rgba(156, 122, 47, 0.03)",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(156, 122, 47, 0.08)",
                  fontSize: "13px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                <div>
                  <strong>Orb Status:</strong>{" "}
                  <span style={{ fontWeight: 700, color: isWithinOrb ? GREEN : RED }}>
                    {isWithinOrb ? `Within Orb (Active 9° Threshold)` : `Out of Orb (Inactive > 9°)`}
                  </span>
                </div>
                <div>
                  <strong>Yoga Timing Type:</strong>{" "}
                  <span style={{ fontWeight: 700, color: isApplying ? GREEN : isSeparating ? AMBER : INK_MUTED }}>
                    {isApplying
                      ? "Vartamāna (Applying — Active Opportunity)"
                      : isSeparating
                      ? "Pūrṇa (Separating — Residual/Fading Context)"
                      : "No Connection (Outside of Orb)"}
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Aspect Caster Drawing */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(156, 122, 47, 0.01)", border: "1px solid rgba(156, 122, 47, 0.06)", borderRadius: "10px", padding: "12px" }}>
              <svg width="220" height="200" viewBox="0 0 200 200" style={{ maxWidth: "100%", height: "auto" }}>
                {/* Center Saham Point */}
                <circle cx="100" cy="100" r="16" fill={GOLD_DEEP} />
                <text x="100" y="100" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                  Saham
                </text>

                {/* Orb sector overlay (9 degrees limit = 45 degrees visual scale) */}
                <path
                  d="M 68,54 A 65 65 0 0 1 132,54 L 100,100 Z"
                  fill="rgba(156, 122, 47, 0.06)"
                  stroke="rgba(156, 122, 47, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Orbit path for aspecting planet */}
                <path
                  d="M 35,100 A 65 65 0 0 1 165,100"
                  fill="none"
                  stroke="rgba(156, 122, 47, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Aspecting line connecting planet to saham */}
                {isWithinOrb && (
                  <line
                    x1="100"
                    y1="100"
                    x2={planetCoords.x}
                    y2={planetCoords.y}
                    stroke={isApplying ? GREEN : isSeparating ? AMBER : "rgba(156, 122, 47, 0.2)"}
                    strokeWidth="2.5"
                    strokeDasharray={isSeparating ? "4 2" : "none"}
                  />
                )}

                {/* Aspecting Planet node (Jupiter) */}
                <circle cx={planetCoords.x} cy={planetCoords.y} r="10" fill={isWithinOrb ? (isApplying ? GREEN : AMBER) : INK_MUTED} />
                <text x={planetCoords.x} y={planetCoords.y} fill="#ffffff" fontSize="9.5" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                  Ju
                </text>

                {/* Left/Right labels showing Applying vs Separating */}
                <text x="35" y="125" fill={GREEN} fontSize="9" fontWeight="bold" textAnchor="middle">
                  Applying
                </text>
                <text x="165" y="125" fill={AMBER} fontSize="9" fontWeight="bold" textAnchor="middle">
                  Separating
                </text>
                <text x="100" y="180" fill={INK_MUTED} fontSize="9" textAnchor="middle">
                  {orbSeparation}° offset
                </text>
              </svg>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", borderTop: "1px solid rgba(156, 122, 47, 0.1)", paddingTop: "14px" }}>
            <button onClick={() => setStep(3)} style={{ padding: "10px 16px", borderRadius: "6px", background: "none", border: "1px solid rgba(156, 122, 47, 0.2)", color: GOLD_DEEP, cursor: "pointer", fontSize: "13.5px", fontWeight: 600 }}>
              &larr; Back to Placement
            </button>
            <button onClick={() => setStep(5)} style={{ padding: "10px 20px", borderRadius: "6px", background: GOLD_DEEP, color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13.5px" }}>
              Synthesize Verdict &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SYNTHESIZE YEAR-VERDICT */}
      {step === 5 && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ backgroundColor: GOLD_DEEP, color: "#ffffff", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>STEP 5</span>
            <h4 style={{ fontSize: "18px", fontWeight: 700, color: INK_PRIMARY, margin: 0 }}>
              Synthesize Ethical Year-Verdict
            </h4>
          </div>
          <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: 0, lineHeight: "1.5" }}>
            Issue your client counsel based on the converging layers: the Saham cluster, aspect timing, yearly Munthā progression, and natal Parāśari context. Select the most ethical and accurate statement.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "8px" }}>
            <div style={{ border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "8px", padding: "12px", background: "rgba(156, 122, 47, 0.02)" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: GOLD_DEEP, letterSpacing: "0.05em" }}>Active Diagnostic Inputs:</span>
              <ul style={{ fontSize: "13px", margin: "6px 0 0", paddingLeft: "16px", color: INK_SECONDARY, lineHeight: "1.5" }}>
                <li>Dhana Saham in 10th (Career Placement)</li>
                <li>Jupiter Vartamāna aspect (Active Applying)</li>
                <li>Munthā progressing to 10th (Focus point)</li>
                <li>Natal Parāśari 10th lord is strong</li>
              </ul>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.05em" }}>Convergence Status:</span>
              <strong style={{ fontSize: "16px", color: GREEN, display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={18} />
                High Confluence & Strength
              </strong>
              <span style={{ fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                All astrological layers converge, creating exceptionally strong ambient opportunity-conditions for professional advancement.
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} role="radiogroup" aria-label="Counsel Statement Options">
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Choose the correct practitioner statement:
            </span>

            <button
              onClick={() => handleVerdictSelection(0)}
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                background: verdictSelect === 0 ? "rgba(162, 58, 30, 0.03)" : "#ffffff",
                border: `2px solid ${verdictSelect === 0 ? RED : "rgba(156, 122, 47, 0.15)"}`,
                textAlign: "left",
                cursor: "pointer",
                fontSize: "13px",
                color: INK_SECONDARY,
                transition: "all 0.2s"
              }}
              role="radio"
              aria-checked={verdictSelect === 0}
            >
              <strong>1. Over-promise (Fatalistic Benefic):</strong> "You are guaranteed to get promoted and double your business profits this year. The stars align, so success is 100% certain. No obstacles are possible."
            </button>

            <button
              onClick={() => handleVerdictSelection(1)}
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                background: verdictSelect === 1 ? "rgba(162, 58, 30, 0.03)" : "#ffffff",
                border: `2px solid ${verdictSelect === 1 ? RED : "rgba(156, 122, 47, 0.15)"}`,
                textAlign: "left",
                cursor: "pointer",
                fontSize: "13px",
                color: INK_SECONDARY,
                transition: "all 0.2s"
              }}
              role="radio"
              aria-checked={verdictSelect === 1}
            >
              <strong>2. Fear-induction (Fatalistic Malefic):</strong> "Although it looks positive, Saturn is aspecting, so you might face sudden business bankruptcy if you make any errors. Fear is required."
            </button>

            <button
              onClick={() => handleVerdictSelection(2)}
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                background: verdictSelect === 2 ? "rgba(47, 125, 85, 0.03)" : "#ffffff",
                border: `2px solid ${verdictSelect === 2 ? GREEN : "rgba(156, 122, 47, 0.15)"}`,
                textAlign: "left",
                cursor: "pointer",
                fontSize: "13px",
                color: INK_SECONDARY,
                transition: "all 0.2s",
                boxShadow: verdictSelect === 2 ? "0 0 8px rgba(47, 125, 85, 0.15)" : "none"
              }}
              role="radio"
              aria-checked={verdictSelect === 2}
            >
              <strong>3. Discipline-Compliant (M19 Counsel):</strong> "All major annual indicators (saham, yoga, munthā, and natal context) converge to highlight an exceptionally strong career and professional context for the year. This provides strong opportunity-conditions; make active, structured plans to leverage this context, while remembering that final outcomes depend on your practical work."
            </button>
          </div>

          {finished && (
            <div style={{ borderLeft: `4px solid ${GREEN}`, background: "rgba(47, 125, 85, 0.04)", padding: "14px", borderRadius: "0 8px 8px 0", marginTop: "8px", display: "flex", gap: "10px", alignItems: "center" }}>
              <ShieldCheck size={20} color={GREEN} />
              <div>
                <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: GREEN, display: "block" }}>
                  Ethical Certification Passed!
                </span>
                <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0, lineHeight: "1.4" }}>
                  You have successfully completed the 5-step practitioner workflow and selected the correct, non-deterministic M19 counsel option!
                </p>
              </div>
            </div>
          )}

          {verdictSelect !== null && verdictSelect !== 2 && (
            <div style={{ borderLeft: `4px solid ${RED}`, background: "rgba(162, 58, 30, 0.04)", padding: "14px", borderRadius: "0 8px 8px 0", marginTop: "8px", display: "flex", gap: "10px", alignItems: "center" }}>
              <AlertTriangle size={20} color={RED} />
              <div>
                <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: RED, display: "block" }}>
                  Ethical Warning
                </span>
                <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0, lineHeight: "1.4" }}>
                  This option breaches the non-deterministic guidelines of Jyotiṣa by either over-promising absolute success or inducing fear. Choose the third option.
                </p>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", marginTop: "8px", borderTop: "1px solid rgba(156, 122, 47, 0.1)", paddingTop: "14px" }}>
            <button onClick={() => setStep(4)} style={{ padding: "10px 16px", borderRadius: "6px", background: "none", border: "1px solid rgba(156, 122, 47, 0.2)", color: GOLD_DEEP, cursor: "pointer", fontSize: "13.5px", fontWeight: 600 }}>
              &larr; Back to Aspects
            </button>
            {finished ? (
              <button onClick={resetWizard} style={{ padding: "10px 20px", borderRadius: "6px", background: GREEN, color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13.5px", display: "flex", alignItems: "center", gap: "6px" }}>
                <RefreshCw size={14} />
                Restart Case
              </button>
            ) : (
              <button disabled style={{ padding: "10px 20px", borderRadius: "6px", background: "rgba(156, 122, 47, 0.1)", color: INK_MUTED, border: "none", fontWeight: 700, fontSize: "13.5px" }}>
                Complete Selection
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
