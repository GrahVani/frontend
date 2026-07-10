"use client";

import React, { useState, useMemo } from "react";
import { Info, ChevronLeft, ChevronRight, CheckSquare, Sparkles } from "lucide-react";
import { RASHIS, polarToCartesian } from '@/components/learning-runtime/interactive/rashi-data';
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const RAW_SAV = [32, 28, 30, 25, 35, 22, 26, 24, 31, 28, 30, 26];

const POST_TRIKONA = [1, 6, 4, 1, 4, 0, 0, 0, 0, 6, 4, 2];

// For Saturn pair: Cap 6 and Aqu 4. Unoccupied, unequal -> reduced to the smaller value (4).
// In the simplified system where weaker -> 0 is illustrated: Cap 6, Aqu 0.
// Let's use BPHS's actual rule: since both Cp and Aq are unoccupied, they reduce to the smaller value (4).
// Wait! Let's check Lesson 4 section 4.3: "Saturn (Capricorn 6, Aquarius 4) -> reduce the weaker (Aquarius); the result is the final reduced grid."
// And in section 4.3 it shows "Capricorn 6, Aquarius 0" or "weaker reduced to 0".
// Let's show:
// Aries 1, Taurus 6, Gemini 4, Cancer 1, Leo 4, Virgo 0, Libra 0, Scorpio 0, Sagittarius 0, Capricorn 6, Aquarius 0, Pisces 2.
// Total reduced sum is 24 bindus.
const FINAL_REDUCED = [1, 6, 4, 1, 4, 0, 0, 0, 0, 6, 0, 2];

const STEPS = [
  {
    title: "1. Raw SAV Grid",
    desc: "We start with the raw Sarvāṣṭakavarga (SAV) grid. This grid represents the sum of the BAV points of all 7 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn). The total sum is exactly 337 bindus."
  },
  {
    title: "2. Trikoṇa Śodhana (Trine Reduction)",
    desc: "Subtract the minimum value in each of the four elemental trine groups: Fire (Ar/Le/Sg), Earth (Ta/Vi/Cp), Air (Ge/Li/Aq), and Water (Ca/Sc/Pi). This removes the shared trine baseline."
  },
  {
    title: "3. Ekādhipatya Śodhana (Single-Lordship)",
    desc: "Apply the single-lordship ruleset to the five same-lord pairs. Since the Gemini/Virgo, Taurus/Libra, Aries/Scorpio, and Sagittarius/Pisces pairs already have a 0 in their pair, no reduction occurs for them. The Saturn pair (Capricorn 6, Aquarius 4) has no zeros, so the weaker (Aquarius) is reduced to 0."
  },
  {
    title: "4. Final Reduced Grid",
    desc: "The final reduced grid is complete. These net counts are the predictive-grade bindus that are used to analyze house strength and timing of events in Chapter 5."
  }
];

export function FullReductionWalkthrough() {
  const [step, setStep] = useState<number>(0);

  const getValuesForStep = () => {
    switch (step) {
      case 0: return RAW_SAV;
      case 1: return POST_TRIKONA;
      case 2:
      case 3: return FINAL_REDUCED;
      default: return RAW_SAV;
    }
  };

  const currentValues = getValuesForStep();

  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 180, cy = 180, r = 105;
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({ x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad), angleDeg, rashiIndex: i });
    }
    return points;
  }, []);

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Full Reduction Walkthrough
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Follow a real-chart SAV step-by-step through both reduction phases.
          </p>
        </div>
      </div>

      {/* STEP NAVIGATION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.02)", padding: "8px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.05)" }}>
        <button
          onClick={() => setStep(prev => Math.max(0, prev - 1))}
          disabled={step === 0}
          style={{ display: "flex", alignItems: "center", gap: "2px", padding: "6px 12px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", background: "#ffffff", fontSize: "11px", fontWeight: 700, cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.5 : 1 }}
        >
          <ChevronLeft size={14} /> Back
        </button>
        
        <span style={{ fontSize: "12px", fontWeight: 800, color: GOLD_DEEP }}>
          {STEPS[step].title}
        </span>

        <button
          onClick={() => setStep(prev => Math.min(STEPS.length - 1, prev + 1))}
          disabled={step === STEPS.length - 1}
          style={{ display: "flex", alignItems: "center", gap: "2px", padding: "6px 12px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", background: "#ffffff", fontSize: "11px", fontWeight: 700, cursor: step === STEPS.length - 1 ? "not-allowed" : "pointer", opacity: step === STEPS.length - 1 ? 0.5 : 1 }}
        >
          Next <ChevronRight size={14} />
        </button>
      </div>

      {/* SPLIT VIEW */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: SVG Wheel */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <h4 style={{ margin: "0 0 6px 0", fontSize: "12.5px", fontWeight: 750, color: GOLD_DEEP }}>
            Interactive Reduction View
          </h4>
          <div style={{ position: "relative", width: "270px", height: "270px" }}>
            <svg width="270" height="270" viewBox="0 0 360 360">
              <circle cx="180" cy="180" r="168" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="2" />
              <circle cx="180" cy="180" r="70" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />
              
              {/* Sector Division Lines */}
              {RASHIS.map((_, i) => {
                const angleDeg = i * 30 - 105;
                const angleRad = (angleDeg * Math.PI) / 180;
                const lx = 180 + 168 * Math.cos(angleRad);
                const ly = 180 + 168 * Math.sin(angleRad);
                return <line key={`line-${i}`} x1="180" y1="180" x2={lx} y2={ly} stroke="rgba(156,122,47,0.08)" strokeWidth="1.2" />;
              })}

              {/* Step 3: Draw Saturn pair connecting line */}
              {step === 2 && (() => {
                const pt1 = polarToCartesian(180, 180, 95, 9 * 30 - 90); // Capricorn
                const pt2 = polarToCartesian(180, 180, 95, 10 * 30 - 90); // Aquarius
                return (
                  <line
                    x1={pt1.x}
                    y1={pt1.y}
                    x2={pt2.x}
                    y2={pt2.y}
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeDasharray="4,4"
                  />
                );
              })()}

              {/* Segment highlights based on step */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                let fill = "rgba(255,255,255,0.02)";
                let stroke = "none";

                if (step === 1) {
                  // Highlight element groups during Trikoṇa
                  if (r.element === "Fire") fill = "rgba(201,162,77,0.08)";
                  else if (r.element === "Earth") fill = "rgba(107,142,107,0.08)";
                  else if (r.element === "Air") fill = "rgba(123,167,192,0.08)";
                  else if (r.element === "Water") fill = "rgba(90,138,154,0.08)";
                } else if (step === 2) {
                  // Highlight Saturn signs during Ekādhipatya step
                  if (r.lord === "Saturn") {
                    fill = "rgba(156,122,47,0.08)";
                    stroke = GOLD;
                  }
                }

                const startAngle = i * 30 - 105;
                const endAngle = i * 30 - 75;
                const so = { x: 180 + 168 * Math.cos((startAngle * Math.PI) / 180), y: 180 + 168 * Math.sin((startAngle * Math.PI) / 180) };
                const eo = { x: 180 + 168 * Math.cos((endAngle * Math.PI) / 180), y: 180 + 168 * Math.sin((endAngle * Math.PI) / 180) };
                const si = { x: 180 + 70 * Math.cos((startAngle * Math.PI) / 180), y: 180 + 70 * Math.sin((startAngle * Math.PI) / 180) };
                const ei = { x: 180 + 70 * Math.cos((endAngle * Math.PI) / 180), y: 180 + 70 * Math.sin((endAngle * Math.PI) / 180) };
                
                const pathData = [
                  `M ${si.x} ${si.y}`,
                  `L ${so.x} ${so.y}`,
                  `A 168 168 0 0 1 ${eo.x} ${eo.y}`,
                  `L ${ei.x} ${ei.y}`,
                  `A 70 70 0 0 0 ${si.x} ${si.y}`,
                  "Z"
                ].join(" ");

                return (
                  <path
                    key={`wpath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={stroke !== "none" ? "2" : "0.5"}
                  />
                );
              })}

              {/* Labels and values */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiIndex];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 180 + 148 * Math.cos(angleRad), y: 180 + 148 * Math.sin(angleRad) };
                const ptValue = { x: 180 + 105 * Math.cos(angleRad), y: 180 + 105 * Math.sin(angleRad) };

                const displayVal = currentValues[p.rashiIndex];

                return (
                  <g key={`wlabel-${p.rashiIndex}`}>
                    <text
                      x={ptEng.x}
                      y={ptEng.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "8.5px", fontWeight: 750, fill: INK_PRIMARY }}
                    >
                      {r.nameEnglish}
                    </text>
                    
                    <g>
                      <circle
                        cx={ptValue.x}
                        cy={ptValue.y}
                        r="22"
                        fill="#ffffff"
                        stroke="rgba(0,0,0,0.1)"
                        strokeWidth="1.5"
                      />
                      <text
                        x={ptValue.x}
                        y={ptValue.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "9.5px", fontWeight: 900, fill: INK_SECONDARY }}
                      >
                        {displayVal}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="180" cy="180" r="38" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <text x="180" y="175" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>FULL</text>
              <text x="180" y="187" textAnchor="middle" style={{ fontSize: "9px", fontWeight: 900, fill: GOLD_DEEP }}>REDUCTION</text>
              <text x="180" y="197" textAnchor="middle" style={{ fontSize: "6.5px", fontWeight: 800, fill: INK_MUTED }}>WALKTHROUGH</text>
            </svg>
          </div>
        </div>

        {/* Right Column: Steps narrative */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          
          {/* Step description */}
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
              <Sparkles size={12} /> Active Step Explanation:
            </span>
            <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
              {STEPS[step].desc}
            </p>
          </div>

          {/* Value Table */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
              Values Comparison
            </span>
            <div style={{ maxHeight: "150px", overflowY: "auto", fontSize: "10px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", color: INK_MUTED }}>
                    <th style={{ textAlign: "left", padding: "4px" }}>House (Sign)</th>
                    <th style={{ textAlign: "center", padding: "4px" }}>Initial</th>
                    <th style={{ textAlign: "center", padding: "4px" }}>Post-Trikoṇa</th>
                    <th style={{ textAlign: "center", padding: "4px" }}>Final Reduced</th>
                  </tr>
                </thead>
                <tbody>
                  {RASHIS.map((r, idx) => {
                    const raw = RAW_SAV[idx];
                    const tri = POST_TRIKONA[idx];
                    const fin = FINAL_REDUCED[idx];
                    const isSaturn = r.lord === "Saturn";

                    return (
                      <tr
                        key={r.number}
                        style={{
                          borderBottom: "1px solid rgba(0,0,0,0.04)",
                          background: isSaturn ? "rgba(156,122,47,0.04)" : "none"
                        }}
                      >
                        <td style={{ padding: "4px", fontWeight: 650 }}>{r.number} ({r.nameEnglish})</td>
                        <td style={{ textAlign: "center", padding: "4px" }}>{raw}</td>
                        <td style={{ textAlign: "center", padding: "4px", color: tri !== raw ? GOLD_DEEP : INK_SECONDARY }}>{tri}</td>
                        <td style={{ textAlign: "center", padding: "4px", color: fin !== tri ? "#ef4444" : INK_SECONDARY, fontWeight: fin !== tri ? "bold" : "normal" }}>{fin}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "9.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga reduction). The final reduced counts isolate the actual operational support of signs. Notice how the Saturn pair (Capricorn/Aquarius) is the only pair that undergoes reduction because it contains no zeros post-Trikoṇa.
      </div>
    </div>
  );
}
