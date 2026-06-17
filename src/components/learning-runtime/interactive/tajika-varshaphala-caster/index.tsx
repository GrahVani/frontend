"use client";

import { useState } from "react";
import { Info, HelpCircle, Layers, CheckCircle2, ShieldAlert, Award, Compass, ArrowRight, RefreshCw } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

const RASHI_NAMES = [
  "Aries (Meṣa)",
  "Taurus (Vṛṣabha)",
  "Gemini (Mithuna)",
  "Cancer (Karka)",
  "Leo (Siṁha)",
  "Virgo (Kanyā)",
  "Libra (Tulā)",
  "Scorpio (Vṛścika)",
  "Sagittarius (Dhanu)",
  "Capricorn (Makara)",
  "Aquarius (Kumbha)",
  "Pisces (Mīna)"
];

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa"
};

const HOUSE_PATHS = {
  1: "M 100,0 L 50,50 L 100,100 L 150,50 Z",
  2: "M 0,0 L 100,0 L 50,50 Z",
  3: "M 0,0 L 0,100 L 50,50 Z",
  4: "M 0,100 L 50,50 L 100,100 L 50,150 Z",
  5: "M 0,200 L 0,100 L 50,150 Z",
  6: "M 0,200 L 100,200 L 50,150 Z",
  7: "M 100,200 L 50,150 L 100,100 L 150,150 Z",
  8: "M 200,200 L 100,200 L 150,150 Z",
  9: "M 200,200 L 200,100 L 150,150 Z",
  10: "M 200,100 L 150,50 L 100,100 L 150,150 Z",
  11: "M 200,0 L 200,100 L 150,50 Z",
  12: "M 200,0 L 100,0 L 150,50 Z"
};

const HOUSE_CENTROIDS = {
  1: { x: 100, y: 50 },
  2: { x: 50, y: 16.67 },
  3: { x: 16.67, y: 50 },
  4: { x: 50, y: 100 },
  5: { x: 16.67, y: 150 },
  6: { x: 50, y: 183.33 },
  7: { x: 100, y: 150 },
  8: { x: 150, y: 183.33 },
  9: { x: 183.33, y: 150 },
  10: { x: 150, y: 100 },
  11: { x: 183.33, y: 50 },
  12: { x: 150, y: 16.67 }
};

const HOUSE_LABEL_POS = {
  1: { x: 100, y: 24 },
  2: { x: 30, y: 16 },
  3: { x: 16, y: 30 },
  4: { x: 24, y: 100 },
  5: { x: 16, y: 170 },
  6: { x: 30, y: 184 },
  7: { x: 100, y: 176 },
  8: { x: 170, y: 184 },
  9: { x: 184, y: 170 },
  10: { x: 176, y: 100 },
  11: { x: 184, y: 30 },
  12: { x: 170, y: 16 }
};

export function TajikaVarshaphalaCaster() {
  const [step, setStep] = useState<number>(1);
  const [natalSunDeg, setNatalSunDeg] = useState<string>("15°25'");
  const [natalSunRashi, setNatalSunRashi] = useState<number>(1); // 1 = Aries
  const [age, setAge] = useState<number>(24);
  const [natalLagna, setNatalLagna] = useState<number>(1); // 1 = Aries
  const [transitingOffset, setTransitingOffset] = useState<number>(-8);
  
  const isAligned = transitingOffset === 0;
  
  // Dynamic output triggers
  const computedSRTime = "April 28, 2026 at 14:32:08 Birth Location Time";
  const calculatedVarsaLagna = 5; // Leo
  
  // Planet positions relative to Leo Lagna (Leo = H1)
  const planetPositions: Record<string, number> = {
    Sun: 9,   // H9 (Aries, exalted)
    Moon: 3,  // H3 (Libra)
    Mars: 1,  // H1 (Leo)
    Venus: 5, // H5 (Sagittarius)
    Jupiter: 10 // H10 (Taurus)
  };

  const munthaHouse = (age % 12) + 1; // For Age 24, mod 12 + 1 = 1st house from natal Lagna
  // Relative to natal Aries Lagna: 1st house is Aries (Rashi 1).
  // Relative to Leo (5) Lagna, Aries (1) is the 9th house (H9).
  const munthaRashi = (natalLagna + munthaHouse - 2) % 12 + 1;
  const munthaVarsaHouse = (munthaRashi - calculatedVarsaLagna + 12) % 12 + 1;

  const handleNext = () => {
    if (step < 6 && (step !== 1 || isAligned)) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const getCoordinatesForAngle = (angleInDegrees: number, radius: number = 60) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: 100 + radius * Math.cos(angleInRadians),
      y: 100 + radius * Math.sin(angleInRadians)
    };
  };

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
      data-interactive="tajika-varshaphala-caster"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes gold-pulse {
          0% { fill: rgba(156, 122, 47, 0.1); stroke: #9C7A2F; stroke-width: 2px; }
          50% { fill: rgba(156, 122, 47, 0.22); stroke: #D4AF37; stroke-width: 2.5px; }
          100% { fill: rgba(156, 122, 47, 0.1); stroke: #9C7A2F; stroke-width: 2px; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .active-varshesa-region {
          animation: gold-pulse 2s infinite ease-in-out;
        }
      `}} />

      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.12)", paddingBottom: "12px", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Module 19 — Chapter 4 — Lesson 3
        </span>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0" }}>
          Six-Step Varṣaphala Chart Caster
        </h3>
        <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: "2px 0 0" }}>
          Construct an annual return chart step-by-step to see how constructions, annotations, and calculations overlay.
        </p>
      </div>

      {/* Wizard Steps indicator */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "4px", borderBottom: "1px solid rgba(156, 122, 47, 0.08)", paddingBottom: "12px" }}>
        {Array.from({ length: 6 }, (_, i) => i + 1).map((s) => {
          const isActive = s === step;
          const isDone = s < step;
          const isDisabled = s > 1 && !isAligned;
          return (
            <button
              key={s}
              disabled={isDisabled}
              onClick={() => setStep(s)}
              style={{
                flex: 1,
                padding: "8px 4px",
                borderRadius: "4px",
                background: isActive ? GOLD_DEEP : isDone ? "rgba(47, 125, 85, 0.12)" : isDisabled ? "rgba(77, 65, 51, 0.03)" : "#ffffff",
                color: isActive ? "#ffffff" : isDone ? GREEN : isDisabled ? INK_MUTED : INK_SECONDARY,
                border: `1px solid ${isActive ? GOLD_DEEP : isDone ? GREEN : isDisabled ? "rgba(77, 65, 51, 0.08)" : "rgba(156, 122, 47, 0.15)"}`,
                fontSize: "11px",
                fontWeight: 700,
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.65 : 1,
                transition: "all 150ms ease"
              }}
            >
              Step {s}
              <div style={{ fontSize: "9px", fontWeight: "normal", marginTop: "2px" }}>
                {s === 1 ? "SR Moment" : s === 2 ? "Cast Lagna" : s === 3 ? "Planets" : s === 4 ? "Munthā" : s === 5 ? "Varṣeśa" : "Yogas"}
              </div>
            </button>
          );
        })}
      </div>


      {/* Grid: Instructions, SVG Diamond Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", alignItems: "start" }}>
        
        {/* Step-Specific Controls & Narrative */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Step 1: Solar Return Moment */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 700, color: GOLD_DEEP, margin: 0 }}>
                Step 1: Compute Solar-Return Moment
              </h4>
              <p style={{ fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.45", margin: 0 }}>
                The solar return moment is the precise global time coordinate when the transiting Sun returns to the exact longitude degree of the client's birth Sun.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "8px", background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.12)" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, display: "block", marginBottom: "2px" }}>Natal Sun Longitude:</label>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <select
                      value={natalSunRashi}
                      onChange={(e) => setNatalSunRashi(Number(e.target.value))}
                      style={{ fontSize: "11px", padding: "4px" }}
                    >
                      {RASHI_NAMES.map((name, i) => (
                        <option key={i+1} value={i+1}>{name.split(" ")[0]}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={natalSunDeg}
                      onChange={(e) => setNatalSunDeg(e.target.value)}
                      style={{ width: "50px", fontSize: "11px", padding: "4px", textAlign: "center" }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, display: "block", marginBottom: "2px" }}>Target Completed Age:</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    style={{ width: "100%", fontSize: "11px", padding: "4px" }}
                  />
                </div>
              </div>

              {/* Solar Return Alignment Slider */}
              <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.12)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                    Align Transiting Sun (Degree Offset):
                  </label>
                  <strong style={{ fontSize: "13px", color: isAligned ? GREEN : AMBER }}>
                    {transitingOffset === 0 ? "0.0° (Locked)" : `${transitingOffset > 0 ? "+" : ""}${transitingOffset}.0°`}
                  </strong>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="1"
                  value={transitingOffset}
                  onChange={(e) => setTransitingOffset(Number(e.target.value))}
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    accentColor: isAligned ? GREEN : AMBER
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED, marginTop: "2px" }}>
                  <span>-15.0° (Early)</span>
                  <span>Exact Match (0.0°)</span>
                  <span>+15.0° (Late)</span>
                </div>
              </div>

              {isAligned ? (
                <div style={{ background: "rgba(47, 125, 85, 0.08)", border: `1px solid ${GREEN}`, color: GREEN, borderRadius: "6px", padding: "10px", fontSize: "11.5px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} />
                  <span><strong>Solar Return Moment Locked!</strong> Computed time: {computedSRTime}.</span>
                </div>
              ) : (
                <div style={{ background: "rgba(217, 119, 6, 0.08)", border: `1px solid ${AMBER}`, color: AMBER, borderRadius: "6px", padding: "10px", fontSize: "11.5px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldAlert size={16} />
                  <span>Adjust the slider to <strong>0.0°</strong> to align the transiting Sun with natal longitude.</span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Cast Lagna */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 700, color: GOLD_DEEP, margin: 0 }}>
                Step 2: Cast Lagna for Solar Return Moment
              </h4>
              <p style={{ fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.45", margin: 0 }}>
                Using the precise solar return moment computed in Step 1, cast the ascendant for the birth location coordinates. This determines the Varṣaphala Lagna, establishing the house layout.
              </p>
              <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.12)", fontSize: "12.5px" }}>
                <div><strong>Birth Coordinates:</strong> 28.6139° N, 77.2090° E (Delhi)</div>
                <div style={{ marginTop: "4px" }}><strong>Ascending sign at SR Moment:</strong> Leo (Siṁha)</div>
              </div>
              <div style={{ background: "rgba(156, 122, 47, 0.08)", border: `1px solid ${GOLD}`, color: GOLD_DEEP, borderRadius: "6px", padding: "10px", fontSize: "12px" }}>
                <strong>Lagna Chart Created:</strong> Sign 5 (Leo) is now placed in the 1st House (top-center diamond).
              </div>
            </div>
          )}

          {/* Step 3: Place Planets */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 700, color: GOLD_DEEP, margin: 0 }}>
                Step 3: Reposition Planets at Solar Return Positions
              </h4>
              <p style={{ fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.45", margin: 0 }}>
                Reposition all planets at their active transiting coordinates at the solar return moment. Note that the Sun is placed exactly back in its natal sign and degree (Aries).
              </p>
              <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.12)", fontSize: "12px" }}>
                <div style={{ fontWeight: "bold", color: GOLD_DEEP, marginBottom: "4px" }}>Transiting Placements:</div>
                <ul style={{ margin: 0, paddingLeft: "16px", lineHeight: "1.4" }}>
                  <li>Sun: Aries (9th House from Leo Lagna)</li>
                  <li>Moon: Libra (3rd House)</li>
                  <li>Mars: Leo (1st House)</li>
                  <li>Venus: Sagittarius (5th House)</li>
                  <li>Jupiter: Taurus (10th House)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Mark Muntha */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 700, color: GOLD_DEEP, margin: 0 }}>
                Step 4: Mark Munthā Position
              </h4>
              <p style={{ fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.45", margin: 0 }}>
                Advance the Munthā sensitive point exactly one house per year of completed life from the natal Lagna.
              </p>
              <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.12)", fontSize: "12.5px" }}>
                <div><strong>Natal Lagna:</strong> Aries (Rashi 1)</div>
                <div><strong>Age (Completed Years):</strong> {age}</div>
                <div style={{ fontWeight: "bold", marginTop: "4px" }}>
                  Munthā House = (Age mod 12) + 1 = ({age} % 12) + 1 = House {munthaHouse}
                </div>
                <div style={{ color: GOLD_DEEP, marginTop: "2px" }}>
                  Aries (Rashi 1) is the 9th House relative to the Leo Varṣa Lagna.
                </div>
              </div>
              <div style={{ background: "rgba(47, 125, 85, 0.06)", border: `1px solid ${GREEN}`, color: GREEN, borderRadius: "6px", padding: "10px", fontSize: "12px" }}>
                <strong>Munthā Placed:</strong> Marked "Mun" inside the 9th House of the Varṣaphala chart.
              </div>
            </div>
          )}

          {/* Step 5: Compute Varshesa */}
          {step === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 700, color: GOLD_DEEP, margin: 0 }}>
                Step 5: Compute Varṣeśa Year-Lord
              </h4>
              <p style={{ fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.45", margin: 0 }}>
                Identify the 5 candidate office-bearers, check who aspects the Varṣa Lagna, and score their strength (Pańcavargīya-bala) to select the year-lord.
              </p>
              <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.12)", fontSize: "12px" }}>
                <strong>Aspect Qualifiers:</strong>
                <ul style={{ margin: "4px 0", paddingLeft: "16px" }}>
                  <li>Sun (Lagneśa / Dina-lord / Triplicity lord) aspects H1 (from H9).</li>
                  <li>Mars (Janma-lord) aspects H1 (from H1).</li>
                </ul>
                <strong>Score Breakdown:</strong>
                <div>Sun Total: 42.5 points | Mars Total: 52.5 points</div>
              </div>
              <div style={{ background: "rgba(156, 122, 47, 0.08)", border: `1px solid ${GOLD}`, color: GOLD_DEEP, borderRadius: "6px", padding: "10px", fontSize: "12px" }}>
                <strong>Varṣeśa Selected:</strong> Mars qualifies and wins with 52.5 points!
              </div>
            </div>
          )}

          {/* Step 6: Identify Yogas */}
          {step === 6 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 700, color: GOLD_DEEP, margin: 0 }}>
                Step 6: Identify Active Tājika Yogas
              </h4>
              <p style={{ fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.45", margin: 0 }}>
                Analyze the angular relationships and applying orbs between planets to identify active Tājika yogas affecting the native's year-trend.
              </p>
              <div style={{ background: "#ffffff", padding: "12px", borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.12)", fontSize: "12px" }}>
                <strong>Detected Yogas:</strong>
                <ul style={{ margin: "4px 0", paddingLeft: "16px", lineHeight: "1.4" }}>
                  <li style={{ color: GREEN }}>
                    <strong>Mars (H1) trine Sun (H9)</strong> - Valid 120° Friendly aspect within 9° orb. <strong>Ithasāla (Applying) Yoga</strong> is active.
                  </li>
                  <li style={{ color: AMBER }}>
                    <strong>Venus (H5) square Jupiter (H10)</strong> - 90° Inimical aspect. <strong>Eesarphā (Separating) Yoga</strong>.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button
              onClick={handlePrev}
              disabled={step === 1}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid rgba(156, 122, 47, 0.2)",
                background: "#ffffff",
                color: step === 1 ? INK_MUTED : INK_SECONDARY,
                cursor: step === 1 ? "not-allowed" : "pointer",
                fontWeight: 700,
                fontSize: "13px"
              }}
            >
              Previous Step
            </button>
            <button
              onClick={handleNext}
              disabled={step === 6}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                background: step === 6 ? INK_MUTED : GOLD_DEEP,
                color: "#ffffff",
                border: `1px solid ${step === 6 ? INK_MUTED : GOLD_DEEP}`,
                cursor: step === 6 ? "not-allowed" : "pointer",
                fontWeight: 700,
                fontSize: "13px"
              }}
            >
              Next Step
            </button>
          </div>
        </div>

        {/* Right Side: Step-by-step SVG Chart Drawing */}
        <div
          key={`chart-${step}`}
          className="animate-scale-in"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.12)",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            boxShadow: "0 4px 16px rgba(156, 122, 47, 0.03)"
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, alignSelf: "flex-start" }}>
            Annual Chart Construction (Step {step} of 6)
          </span>

          {step === 1 ? (
            /* Step 1 custom drawing: Sun longitude alignment dial */
            <div style={{ width: "220px", height: "220px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "8px", padding: "10px", background: "rgba(156, 122, 47, 0.02)" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, marginBottom: "8px", textTransform: "uppercase" }}>Solar Return Alignment Dial</span>
              <svg width="140" height="140" viewBox="0 0 200 200">
                {/* Dial outer track */}
                <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="5" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(156, 122, 47, 0.08)" strokeWidth="1" strokeDasharray="3,3" />
                
                {/* Natal Sun position line and marker */}
                {(() => {
                  const natalAngle = 45;
                  const coords = getCoordinatesForAngle(natalAngle, 75);
                  return (
                    <g>
                      <line x1="100" y1="100" x2={coords.x} y2={coords.y} stroke={GOLD} strokeWidth="2" />
                      <circle cx={coords.x} cy={coords.y} r="8" fill={GOLD} />
                      <text x={coords.x} y={coords.y - 12} fill={GOLD_DEEP} fontSize="9" fontWeight="bold" textAnchor="middle">Natal Sun</text>
                    </g>
                  );
                })()}

                {/* Transiting Sun position line and marker */}
                {(() => {
                  const transAngle = 45 + transitingOffset * 8;
                  const coords = getCoordinatesForAngle(transAngle, 75);
                  return (
                    <g>
                      <line x1="100" y1="100" x2={coords.x} y2={coords.y} stroke={isAligned ? GREEN : AMBER} strokeWidth="2.5" />
                      <circle cx={coords.x} cy={coords.y} r="8" fill={isAligned ? GREEN : AMBER} style={{ filter: `drop-shadow(0 0 4px ${isAligned ? GREEN : AMBER})` }} />
                      <text x={coords.x} y={coords.y + 16} fill={isAligned ? GREEN : AMBER} fontSize="9" fontWeight="bold" textAnchor="middle">Transit Sun</text>
                    </g>
                  );
                })()}

                {/* Central locking indicator */}
                <circle cx="100" cy="100" r="15" fill={isAligned ? "rgba(47, 125, 85, 0.15)" : "rgba(156, 122, 47, 0.05)"} stroke={isAligned ? GREEN : GOLD} strokeWidth="1.5" />
                <text x="100" y="103" fill={isAligned ? GREEN : GOLD_DEEP} fontSize="8" fontWeight="bold" textAnchor="middle">
                  {isAligned ? "LOCK" : "ALIGN"}
                </text>
              </svg>
              <div style={{ fontSize: "11px", color: INK_MUTED, marginTop: "8px", textAlign: "center" }}>
                {isAligned ? "Sun returned to Aries 15°25' (Exact Moment)" : `Sun offset: ${transitingOffset > 0 ? "+" : ""}${transitingOffset}°`}
              </div>
            </div>
          ) : (
            <svg width="220" height="220" viewBox="0 0 200 200">
              <rect x="0" y="0" width="200" height="200" fill="none" stroke="rgba(156, 122, 47, 0.3)" strokeWidth="1.5" />
              
              {(Object.keys(HOUSE_PATHS) as Array<unknown> as number[]).map((h) => {
                const isLagna = h === 1;
                const pathStr = HOUSE_PATHS[h as keyof typeof HOUSE_PATHS];
                const pos = HOUSE_LABEL_POS[h as keyof typeof HOUSE_LABEL_POS];
                const centroid = HOUSE_CENTROIDS[h as keyof typeof HOUSE_CENTROIDS];
                const currentRashi = (calculatedVarsaLagna + h - 2) % 12 + 1;

                // Build values depending on active steps
                const showPlanets = step >= 3;
                const showMuntha = step >= 4 && h === munthaVarsaHouse;
                const showVarshesaHighlight = step >= 5 && h === 1; // Mars is in H1

                // Find planets in this house
                const planets: string[] = [];
                if (showPlanets) {
                  Object.keys(planetPositions).forEach(p => {
                    if (planetPositions[p] === h) planets.push(p);
                  });
                }

                let fillColor = "none";
                let strokeCol = "rgba(156, 122, 47, 0.2)";
                let strokeW = "1";

                if (showVarshesaHighlight) {
                  fillColor = "rgba(156, 122, 47, 0.12)";
                  strokeCol = GOLD;
                  strokeW = "2";
                } else if (isLagna) {
                  fillColor = "rgba(47, 125, 85, 0.04)";
                }

                const planetAbbrs = planets.map(p => PLANET_SYMBOLS[p] || p.substring(0,2));

                return (
                  <g key={h}>
                    <path
                      d={pathStr}
                      fill={fillColor}
                      stroke={strokeCol}
                      strokeWidth={strokeW}
                      style={{ transition: "all 200ms ease" }}
                    />
                    
                    {/* Render Sign Index */}
                    <text
                      x={centroid.x}
                      y={centroid.y - 7}
                      fill={showVarshesaHighlight ? GOLD_DEEP : INK_MUTED}
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {currentRashi}
                    </text>

                    {/* House Label */}
                    <text
                      x={pos.x}
                      y={pos.y}
                      fill="rgba(77, 65, 51, 0.4)"
                      fontSize="6.5"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {`H${h}`}
                    </text>

                    {/* Planet & Munthā labels */}
                    <text
                      x={centroid.x}
                      y={centroid.y + 7}
                      fill={showVarshesaHighlight ? GOLD_DEEP : INK_PRIMARY}
                      fontSize="7"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {showMuntha ? "Mun" : ""} {planetAbbrs.join(" ")}
                    </text>
                  </g>
                );
              })}

              {/* Step 5 aspect qualification lines */}
              {step === 5 && (
                <>
                  {/* Sun aspects H1 from H9 */}
                  <line x1={170} y1={150} x2={100} y2={50} stroke={GOLD} strokeWidth="1.5" strokeDasharray="3,3" />
                  {/* Mars is in H1 itself */}
                </>
              )}

              {/* Step 6 Yoga connection lines */}
              {step === 6 && (
                <>
                  {/* Mars (H1) and Sun (H9) aspect line */}
                  <line
                    x1={100}
                    y1={75}
                    x2={170}
                    y2={150}
                    stroke={GREEN}
                    strokeWidth="2.5"
                    opacity="0.8"
                  />
                  {/* Venus (H5) and Jupiter (H10) aspect line */}
                  <line
                    x1={30}
                    y1={150}
                    x2={150}
                    y2={100}
                    stroke={AMBER}
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                    opacity="0.7"
                  />
                </>
              )}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
