"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, Link2, UserCheck, Eye, EyeOff } from "lucide-react";
import { RASHIS, polarToCartesian } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

// Same-lord pairs (0-indexed indices into RASHIS)
// 0: Aries, 7: Scorpio (Mars)
// 1: Taurus, 6: Libra (Venus)
// 2: Gemini, 5: Virgo (Mercury)
// 8: Sagittarius, 11: Pisces (Jupiter)
// 9: Capricorn, 10: Aquarius (Saturn)
const SAME_LORD_PAIRS = [
  { planet: "Mars", IAST: "Maṅgala", signs: [0, 7] },
  { planet: "Venus", IAST: "Śukra", signs: [1, 6] },
  { planet: "Mercury", IAST: "Budha", signs: [2, 5] },
  { planet: "Jupiter", IAST: "Guru", signs: [8, 11] },
  { planet: "Saturn", IAST: "Śani", signs: [9, 10] }
];

// Preloaded values from post-trikona grid in Lesson 4
const POST_TRIKONA_VALUES = [
  1, // Aries
  6, // Taurus
  4, // Gemini
  1, // Cancer (Moon - single lord)
  4, // Leo (Sun - single lord)
  0, // Virgo
  0, // Libra
  0, // Scorpio
  0, // Sagittarius
  6, // Capricorn
  4, // Aquarius
  2  // Pisces
];

const PRESETS = [
  {
    name: "Lesson 4 Post-Trikoṇa",
    values: POST_TRIKONA_VALUES,
    occupancy: [false, false, false, false, false, false, false, false, false, false, false, false]
  },
  {
    name: "Mars Ar 6, Sc 4 (Unoccupied)",
    values: [6, 6, 4, 1, 4, 0, 0, 4, 0, 6, 4, 2],
    occupancy: [false, false, false, false, false, false, false, false, false, false, false, false]
  },
  {
    name: "Venus Ta 5, Li 2 (Unoccupied)",
    values: [1, 5, 4, 1, 4, 0, 2, 0, 0, 6, 4, 2],
    occupancy: [false, false, false, false, false, false, false, false, false, false, false, false]
  },
  {
    name: "Mercury Ge 4, Vi 4 (Unoccupied)",
    values: [1, 6, 4, 1, 4, 4, 0, 0, 0, 6, 4, 2],
    occupancy: [false, false, false, false, false, false, false, false, false, false, false, false]
  }
];

export function EkadhipatyaReducer() {
  const [values, setValues] = useState<number[]>(POST_TRIKONA_VALUES);
  const [occupancy, setOccupancy] = useState<boolean[]>(new Array(12).fill(false));
  const [selectedPairIndex, setSelectedPairIndex] = useState<number | null>(4); // Saturn Cp+Aq default highlight
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);

  const handlePresetSelect = (presetIndex: number) => {
    setActivePresetIndex(presetIndex);
    setValues(PRESETS[presetIndex].values);
    setOccupancy(PRESETS[presetIndex].occupancy);
    
    if (presetIndex === 1) setSelectedPairIndex(0);
    if (presetIndex === 2) setSelectedPairIndex(1);
    if (presetIndex === 3) setSelectedPairIndex(2);
    if (presetIndex === 0) setSelectedPairIndex(4);
  };

  const resetValues = () => {
    handlePresetSelect(0);
  };


  const handleValueChange = (index: number, delta: number) => {
    setValues(prev => {
      const next = [...prev];
      next[index] = Math.max(0, Math.min(99, next[index] + delta));
      return next;
    });
  };

  const toggleOccupancy = (index: number) => {
    setOccupancy(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  // Run the multi-case reduction logic per pair
  const calculatedReductions = useMemo(() => {
    const reduced = [...values];
    
    SAME_LORD_PAIRS.forEach(pair => {
      const idxA = pair.signs[0];
      const idxB = pair.signs[1];
      const valA = values[idxA];
      const valB = values[idxB];
      const occA = occupancy[idxA];
      const occB = occupancy[idxB];

      // Rule 1: Zero check
      if (valA === 0 || valB === 0) {
        // No reduction
        reduced[idxA] = valA;
        reduced[idxB] = valB;
        return;
      }

      // Rule 2: Both occupied
      if (occA && occB) {
        // No reduction
        reduced[idxA] = valA;
        reduced[idxB] = valB;
        return;
      }

      // Rule 3: One occupied, one empty
      if (occA && !occB) {
        // idxA is occupied, idxB is empty (U)
        // empty vs occupied comparison
        if (valB > valA) {
          reduced[idxB] = valA; // Empty reduced to match occupied
        } else {
          reduced[idxB] = 0; // Empty < Occupied or Empty == Occupied reduced to 0
        }
        reduced[idxA] = valA;
        return;
      }

      if (!occA && occB) {
        // idxB is occupied, idxA is empty (U)
        if (valA > valB) {
          reduced[idxA] = valB; // Empty reduced to match occupied
        } else {
          reduced[idxA] = 0; // Empty < Occupied or Empty == Occupied reduced to 0
        }
        reduced[idxB] = valB;
        return;
      }

      // Rule 4: Both unoccupied
      if (!occA && !occB) {
        if (valA !== valB) {
          const minVal = Math.min(valA, valB);
          reduced[idxA] = minVal;
          reduced[idxB] = minVal;
        } else {
          reduced[idxA] = 0;
          reduced[idxB] = 0;
        }
      }
    });

    return reduced;
  }, [values, occupancy]);

  // Compute description of active case for each pair
  const pairStatusDescriptions = useMemo(() => {
    return SAME_LORD_PAIRS.map(pair => {
      const idxA = pair.signs[0];
      const idxB = pair.signs[1];
      const valA = values[idxA];
      const valB = values[idxB];
      const occA = occupancy[idxA];
      const occB = occupancy[idxB];

      const nameA = RASHIS[idxA].nameEnglish;
      const nameB = RASHIS[idxB].nameEnglish;

      if (valA === 0 || valB === 0) {
        return `Zero Present: One of the signs (${valA === 0 ? nameA : nameB}) is already 0. No reduction occurs.`;
      }
      if (occA && occB) {
        return "Both Occupied: Both signs contain planets. No reduction occurs.";
      }
      if (occA && !occB) {
        if (valB > valA) {
          return `One Occupied, Empty > Occupied: ${nameB} (unoccupied, ${valB}) is reduced to match ${nameA} (occupied, ${valA}).`;
        } else {
          return `One Occupied, Empty ≤ Occupied: ${nameB} (unoccupied, ${valB}) is reduced to 0. ${nameA} (occupied, ${valA}) remains unchanged.`;
        }
      }
      if (!occA && occB) {
        if (valA > valB) {
          return `One Occupied, Empty > Occupied: ${nameA} (unoccupied, ${valA}) is reduced to match ${nameB} (occupied, ${valB}).`;
        } else {
          return `One Occupied, Empty ≤ Occupied: ${nameA} (unoccupied, ${valA}) is reduced to 0. ${nameB} (occupied, ${valB}) remains unchanged.`;
        }
      }
      // Both unoccupied
      if (valA !== valB) {
        return `Both Empty, Unequal: Both signs are reduced to the smaller value (${Math.min(valA, valB)}).`;
      }
      return `Both Empty, Equal: Both signs are equal (${valA}) and are reduced to 0.`;
    });
  }, [values, occupancy]);

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", borderBottom: "1px solid rgba(156,122,47,0.1)", paddingBottom: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Ekādhipatya Śodhana (Single-Lordship Reduction) Calculator
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Refine dual lordship duplication based on sign occupancy, zeros, and value relative to occupancy.
          </p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP }}>Example Preset:</span>
          <select
            value={activePresetIndex}
            onChange={(e) => handlePresetSelect(Number(e.target.value))}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid rgba(156,122,47,0.2)",
              fontSize: "11px",
              background: "#ffffff",
              color: INK_PRIMARY,
              cursor: "pointer"
            }}
          >
            {PRESETS.map((p, idx) => (
              <option key={idx} value={idx}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={resetValues}
            style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer" }}
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* SPLIT VIEW */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: SVG Wheel */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <h4 style={{ margin: "0 0 6px 0", fontSize: "12.5px", fontWeight: 750, color: GOLD_DEEP }}>
            Lordship Connections
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

              {/* Draw connection line for selected pair */}
              {selectedPairIndex !== null && (() => {
                const pair = SAME_LORD_PAIRS[selectedPairIndex];
                const pt1 = polarToCartesian(180, 180, 95, pair.signs[0] * 30 - 90);
                const pt2 = polarToCartesian(180, 180, 95, pair.signs[1] * 30 - 90);
                return (
                  <g>
                    <line
                      x1={pt1.x}
                      y1={pt1.y}
                      x2={pt2.x}
                      y2={pt2.y}
                      stroke={GOLD}
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                    />
                    <circle cx={(pt1.x + pt2.x) / 2} cy={(pt1.y + pt2.y) / 2} r="10" fill={GOLD_DEEP} />
                    <text
                      x={(pt1.x + pt2.x) / 2}
                      y={(pt1.y + pt2.y) / 2 + 0.5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "7px", fill: "#ffffff", fontWeight: 800 }}
                    >
                      {pair.planet[0]}
                    </text>
                  </g>
                );
              })()}

              {/* Segment highlights & interactive toggle */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                const isPairMember = selectedPairIndex !== null && SAME_LORD_PAIRS[selectedPairIndex].signs.includes(i);
                
                let fill = "rgba(255,255,255,0.02)";
                let stroke = "none";

                if (isPairMember) {
                  fill = "color-mix(in srgb, var(--gl-gold-accent, #9C7A2F) 8%, transparent)";
                  stroke = GOLD;
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
                    key={`epath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isPairMember ? "2" : "0.5"}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const pairIdx = SAME_LORD_PAIRS.findIndex(p => p.signs.includes(i));
                      if (pairIdx !== -1) setSelectedPairIndex(pairIdx);
                    }}
                  />
                );
              })}

              {/* Occupancy dots */}
              {RASHIS.map((_, i) => {
                if (!occupancy[i]) return null;
                const angleDeg = i * 30 - 90;
                const angleRad = (angleDeg * Math.PI) / 180;
                const pt = { x: 180 + 130 * Math.cos(angleRad), y: 180 + 130 * Math.sin(angleRad) };
                return (
                  <g key={`occ-${i}`}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
                  </g>
                );
              })}

              {/* Labels and values */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiIndex];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 180 + 148 * Math.cos(angleRad), y: 180 + 148 * Math.sin(angleRad) };
                const ptValue = { x: 180 + 105 * Math.cos(angleRad), y: 180 + 105 * Math.sin(angleRad) };

                const rawVal = values[p.rashiIndex];
                const reducedVal = calculatedReductions[p.rashiIndex];
                const isChanged = rawVal !== reducedVal;

                return (
                  <g key={`elabel-${p.rashiIndex}`}>
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
                        stroke={isChanged ? GOLD : "rgba(0,0,0,0.1)"}
                        strokeWidth="1.5"
                      />
                      <text
                        x={ptValue.x}
                        y={ptValue.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "9.5px", fontWeight: 900, fill: isChanged ? GOLD_DEEP : INK_SECONDARY }}
                      >
                        {isChanged ? `${rawVal}→${reducedVal}` : rawVal}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="180" cy="180" r="38" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <text x="180" y="175" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>EKĀDHIPATYA</text>
              <text x="180" y="187" textAnchor="middle" style={{ fontSize: "9px", fontWeight: 900, fill: GOLD_DEEP }}>ŚODHANA</text>
              <text x="180" y="197" textAnchor="middle" style={{ fontSize: "6.5px", fontWeight: 800, fill: INK_MUTED }}>REDUCTION</text>
            </svg>
          </div>
        </div>

        {/* Right Column: Lordship list with checkboxes */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
          {SAME_LORD_PAIRS.map((pair, pIdx) => {
            const idxA = pair.signs[0];
            const idxB = pair.signs[1];
            const rA = RASHIS[idxA];
            const rB = RASHIS[idxB];
            const valA = values[idxA];
            const valB = values[idxB];
            const occA = occupancy[idxA];
            const occB = occupancy[idxB];
            const isSelected = selectedPairIndex === pIdx;

            return (
              <div
                key={pair.planet}
                onClick={() => setSelectedPairIndex(pIdx)}
                style={{
                  background: isSelected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                  border: isSelected ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.05)",
                  borderRadius: "10px",
                  padding: "8px 10px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}
              >
                {/* Title */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
                    <Link2 size={12} /> {pair.planet}
                  </span>
                  <span style={{ fontSize: "9px", color: INK_MUTED, fontWeight: 700 }}>
                    {rA.nameEnglish} + {rB.nameEnglish}
                  </span>
                </div>

                {/* Sub-rows for signs */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {[idxA, idxB].map(idx => {
                    const r = RASHIS[idx];
                    return (
                      <div
                        key={r.number}
                        style={{
                          flex: 1,
                          background: "rgba(0,0,0,0.02)",
                          padding: "4px 6px",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "4px"
                        }}
                      >
                        <span style={{ fontSize: "9.5px", fontWeight: 750, color: INK_SECONDARY }}>
                          {r.nameEnglish}
                        </span>

                        {/* Value scrubber */}
                        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleValueChange(idx, -1);
                            }}
                            style={{ width: "12px", height: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "3px", background: "#ffffff", fontSize: "8px", cursor: "pointer" }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: "9.5px", fontWeight: 800, minWidth: "12px", textAlign: "center" }}>
                            {values[idx]}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleValueChange(idx, 1);
                            }}
                            style={{ width: "12px", height: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "3px", background: "#ffffff", fontSize: "8px", cursor: "pointer" }}
                          >
                            +
                          </button>
                        </div>

                        {/* Occupancy check */}
                        <label
                          onClick={(e) => e.stopPropagation()}
                          style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "9px", cursor: "pointer", fontWeight: 700 }}
                        >
                          <input
                            type="checkbox"
                            checked={occupancy[idx]}
                            onChange={() => toggleOccupancy(idx)}
                            style={{ margin: 0 }}
                          />
                          Occ
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* DYNAMIC FEEDBACK FOOTER */}
      {selectedPairIndex !== null && (() => {
        const desc = pairStatusDescriptions[selectedPairIndex];
        return (
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.45, display: "flex", gap: "6px", alignItems: "flex-start" }}>
            <Info size={14} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong>Rule Applied:</strong> {desc}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
