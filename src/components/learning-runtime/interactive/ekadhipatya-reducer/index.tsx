"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, RotateCcw, Link2 } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS, polarToCartesian } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const BLUE = "#3b82f6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface PairDef {
  planet: string;
  iast: string;
  signs: [number, number];
}

const SAME_LORD_PAIRS: PairDef[] = [
  { planet: "Mars", iast: "Maṅgala", signs: [0, 7] },
  { planet: "Venus", iast: "Śukra", signs: [1, 6] },
  { planet: "Mercury", iast: "Budha", signs: [2, 5] },
  { planet: "Jupiter", iast: "Guru", signs: [8, 11] },
  { planet: "Saturn", iast: "Śani", signs: [9, 10] },
];

const SINGLE_LORDS = [
  { planet: "Sun", iast: "Sūrya", sign: 4 }, // Leo
  { planet: "Moon", iast: "Candra", sign: 3 }, // Cancer
];

const POST_TRIKONA_VALUES = [1, 6, 4, 1, 4, 0, 0, 0, 0, 6, 4, 2];

const PRESETS = [
  { name: "Lesson 4 Post-Trikoṇa", values: POST_TRIKONA_VALUES, occupancy: new Array(12).fill(false) },
  { name: "Mars Ar 6, Sc 4 (Unoccupied)", values: [6, 6, 4, 1, 4, 0, 0, 4, 0, 6, 4, 2], occupancy: new Array(12).fill(false) },
  { name: "Venus Ta 5, Li 2 (Unoccupied)", values: [1, 5, 4, 1, 4, 0, 2, 0, 0, 6, 4, 2], occupancy: new Array(12).fill(false) },
  { name: "Mercury Ge 4, Vi 4 (Unoccupied)", values: [1, 6, 4, 1, 4, 4, 0, 0, 0, 6, 4, 2], occupancy: new Array(12).fill(false) },
];

function describeCase(values: number[], occupancy: boolean[], pair: PairDef): string {
  const [idxA, idxB] = pair.signs;
  const valA = values[idxA];
  const valB = values[idxB];
  const occA = occupancy[idxA];
  const occB = occupancy[idxB];
  const nameA = RASHIS[idxA].nameEnglish;
  const nameB = RASHIS[idxB].nameEnglish;

  if (valA === 0 || valB === 0) {
    return `Zero present: ${valA === 0 ? nameA : nameB} is already 0, so no reduction occurs.`;
  }
  if (occA && occB) {
    return "Both signs occupied: no reduction occurs.";
  }
  if (occA && !occB) {
    if (valB > valA) return `One occupied: empty ${nameB} (${valB}) > occupied ${nameA} (${valA}) → ${nameB} reduced to ${valA}.`;
    return `One occupied: empty ${nameB} (${valB}) ≤ occupied ${nameA} (${valA}) → ${nameB} reduced to 0.`;
  }
  if (!occA && occB) {
    if (valA > valB) return `One occupied: empty ${nameA} (${valA}) > occupied ${nameB} (${valB}) → ${nameA} reduced to ${valB}.`;
    return `One occupied: empty ${nameA} (${valA}) ≤ occupied ${nameB} (${valB}) → ${nameA} reduced to 0.`;
  }
  if (valA !== valB) {
    const minVal = Math.min(valA, valB);
    return `Both empty and unequal: ${nameA} (${valA}) and ${nameB} (${valB}) both reduce to ${minVal}.`;
  }
  return `Both empty and equal (${valA}): both reduce to 0.`;
}

function computeReductions(values: number[], occupancy: boolean[]): number[] {
  const reduced = [...values];

  SAME_LORD_PAIRS.forEach(pair => {
    const [idxA, idxB] = pair.signs;
    const valA = values[idxA];
    const valB = values[idxB];
    const occA = occupancy[idxA];
    const occB = occupancy[idxB];

    if (valA === 0 || valB === 0) return;
    if (occA && occB) return;

    if (occA && !occB) {
      reduced[idxB] = valB > valA ? valA : 0;
      return;
    }
    if (!occA && occB) {
      reduced[idxA] = valA > valB ? valB : 0;
      return;
    }

    if (valA !== valB) {
      const minVal = Math.min(valA, valB);
      reduced[idxA] = minVal;
      reduced[idxB] = minVal;
    } else {
      reduced[idxA] = 0;
      reduced[idxB] = 0;
    }
  });

  return reduced;
}

export function EkadhipatyaReducer() {
  const [values, setValues] = useState<number[]>(POST_TRIKONA_VALUES);
  const [occupancy, setOccupancy] = useState<boolean[]>(new Array(12).fill(false));
  const [selectedPairIndex, setSelectedPairIndex] = useState<number | null>(4);
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);

  const calculatedReductions = useMemo(() => computeReductions(values, occupancy), [values, occupancy]);

  const handlePresetSelect = (presetIndex: number) => {
    setActivePresetIndex(presetIndex);
    setValues(PRESETS[presetIndex].values);
    setOccupancy(PRESETS[presetIndex].occupancy);
    if (presetIndex === 1) setSelectedPairIndex(0);
    else if (presetIndex === 2) setSelectedPairIndex(1);
    else if (presetIndex === 3) setSelectedPairIndex(2);
    else setSelectedPairIndex(4);
  };

  const resetValues = () => handlePresetSelect(0);

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

  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 150, cy = 150, r = 105;
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({ x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad), angleDeg, rashiIndex: i });
    }
    return points;
  }, []);

  const wheelSize = 230;

  return (
    <div data-interactive="ekadhipatya-reducer" style={{ padding: "14px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Ekādhipatya Śodhana Calculator
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Remove same-lord duplication for the five dual-rulership pairs. Sun and Moon rule single signs, so they are skipped.
          </p>
        </div>
        <button
          onClick={resetValues}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Controls */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
        <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Example Preset</span>
        <select
          value={activePresetIndex}
          onChange={(e) => handlePresetSelect(Number(e.target.value))}
          style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "5px", background: "#ffffff", color: INK_PRIMARY, padding: "4px 6px", fontSize: "11px", fontWeight: 700, minWidth: "200px", cursor: "pointer" }}
        >
          {PRESETS.map((p, idx) => <option key={idx} value={idx}>{p.name}</option>)}
        </select>
        <span style={{ fontSize: "10px", color: INK_MUTED }}>Select a pair on the right to inspect its rule.</span>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>

        {/* Left: wheel */}
        <div style={{ flex: "1 1 260px", minWidth: "240px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
          <h4 style={{ margin: "0 0 6px 0", fontSize: "10px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", alignSelf: "flex-start" }}>
            Lordship Connections
          </h4>
          <div style={{ position: "relative", width: `${wheelSize}px`, height: `${wheelSize}px` }}>
            <svg width={wheelSize} height={wheelSize} viewBox="0 0 300 300" style={{ overflow: "visible" }}>
              <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="2" />
              <circle cx="150" cy="150" r="72" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />

              {RASHIS.map((_, i) => {
                const angleDeg = i * 30 - 105;
                const angleRad = (angleDeg * Math.PI) / 180;
                const lx = 150 + 130 * Math.cos(angleRad);
                const ly = 150 + 130 * Math.sin(angleRad);
                return <line key={`line-${i}`} x1="150" y1="150" x2={lx} y2={ly} stroke="rgba(156,122,47,0.08)" strokeWidth="1.2" />;
              })}

              {selectedPairIndex !== null && (() => {
                const pair = SAME_LORD_PAIRS[selectedPairIndex];
                const pt1 = polarToCartesian(150, 150, 95, pair.signs[0] * 30 - 90);
                const pt2 = polarToCartesian(150, 150, 95, pair.signs[1] * 30 - 90);
                const mx = (pt1.x + pt2.x) / 2;
                const my = (pt1.y + pt2.y) / 2;
                return (
                  <g>
                    <line x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y} stroke={GOLD} strokeWidth="2.5" strokeDasharray="4,3" />
                    <circle cx={mx} cy={my} r="11" fill={GOLD_DEEP} />
                    <text x={mx} y={my + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7px", fill: "#ffffff", fontWeight: 900 }}>{pair.planet[0]}</text>
                  </g>
                );
              })()}

              {RASHIS.map((r, i) => {
                const num = r.number;
                const isPairMember = selectedPairIndex !== null && SAME_LORD_PAIRS[selectedPairIndex].signs.includes(i);

                const startAngle = i * 30 - 105;
                const endAngle = i * 30 - 75;
                const so = { x: 150 + 130 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((startAngle * Math.PI) / 180) };
                const eo = { x: 150 + 130 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((endAngle * Math.PI) / 180) };
                const si = { x: 150 + 72 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 72 * Math.sin((startAngle * Math.PI) / 180) };
                const ei = { x: 150 + 72 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 72 * Math.sin((endAngle * Math.PI) / 180) };

                const pathData = [
                  `M ${si.x} ${si.y}`,
                  `L ${so.x} ${so.y}`,
                  `A 130 130 0 0 1 ${eo.x} ${eo.y}`,
                  `L ${ei.x} ${ei.y}`,
                  `A 72 72 0 0 0 ${si.x} ${si.y}`,
                  "Z"
                ].join(" ");

                return (
                  <path
                    key={`epath-${num}`}
                    d={pathData}
                    fill={isPairMember ? `color-mix(in srgb, ${GOLD} 10%, transparent)` : "transparent"}
                    stroke={isPairMember ? GOLD : "rgba(156,122,47,0.08)"}
                    strokeWidth={isPairMember ? "2" : "0.5"}
                    style={{ cursor: "pointer", transition: "all 0.15s" }}
                    onClick={() => {
                      const pairIdx = SAME_LORD_PAIRS.findIndex(p => p.signs.includes(i));
                      if (pairIdx !== -1) setSelectedPairIndex(pairIdx);
                    }}
                  />
                );
              })}

              {occupancy.map((isOccupied, i) => {
                if (!isOccupied) return null;
                const angleDeg = i * 30 - 90;
                const angleRad = (angleDeg * Math.PI) / 180;
                const pt = { x: 150 + 128 * Math.cos(angleRad), y: 150 + 128 * Math.sin(angleRad) };
                return (
                  <g key={`occ-${i}`}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill={BLUE} stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                );
              })}

              {circlePoints.map(p => {
                const r = RASHIS[p.rashiIndex];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
                const ptValue = { x: 150 + 85 * Math.cos(angleRad), y: 150 + 85 * Math.sin(angleRad) };

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
                      style={{ fontSize: "8px", fontWeight: 700, fill: INK_PRIMARY }}
                    >
                      {r.nameEnglish}
                    </text>

                    <g>
                      <circle
                        cx={ptValue.x}
                        cy={ptValue.y}
                        r="14"
                        fill="#ffffff"
                        stroke={isChanged ? GOLD : "rgba(156,122,47,0.15)"}
                        strokeWidth="1.5"
                      />
                      <text
                        x={ptValue.x}
                        y={ptValue.y - 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "9px", fontWeight: 900, fill: isChanged ? GOLD_DEEP : INK_SECONDARY }}
                      >
                        {isChanged ? `${rawVal}→${reducedVal}` : rawVal}
                      </text>
                    </g>
                  </g>
                );
              })}

              <circle cx="150" cy="150" r="28" fill="#ffffff" stroke={GOLD} strokeWidth="1.5" />
              <text x="150" y="146" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>EKĀDHIPATYA</text>
              <text x="150" y="160" textAnchor="middle" style={{ fontSize: "11px", fontWeight: 900, fill: GOLD_DEEP }}>ŚODHANA</text>
            </svg>
          </div>
        </div>

        {/* Right: pairs + single lords */}
        <div style={{ flex: "1 1 300px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "6px" }}>

          {/* Dual-lord pairs */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ fontSize: "10px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>Dual-lord pairs — click to inspect</div>

            {SAME_LORD_PAIRS.map((pair, pIdx) => {
              const [idxA, idxB] = pair.signs;
              const rA = RASHIS[idxA];
              const rB = RASHIS[idxB];
              const isSelected = selectedPairIndex === pIdx;
              const reducedA = calculatedReductions[idxA];
              const reducedB = calculatedReductions[idxB];

              return (
                <div
                  key={pair.planet}
                  onClick={() => setSelectedPairIndex(pIdx)}
                  style={{
                    background: isSelected ? `${GOLD}10` : "rgba(156,122,47,0.03)",
                    border: `1.5px solid ${isSelected ? GOLD : "rgba(156,122,47,0.1)"}`,
                    borderRadius: "8px",
                    padding: "6px 8px",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Link2 size={12} /> {pair.planet}
                    </span>
                    <span style={{ fontSize: "9px", color: INK_MUTED, fontWeight: 700 }}>
                      {rA.nameEnglish} + {rB.nameEnglish}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    {[idxA, idxB].map(idx => {
                      const r = RASHIS[idx];
                      const reduced = calculatedReductions[idx];
                      const raw = values[idx];
                      const changed = raw !== reduced;
                      return (
                        <div
                          key={r.number}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            flex: 1,
                            background: "#ffffff",
                            border: `1px solid ${changed ? GOLD : "rgba(0,0,0,0.08)"}`,
                            borderRadius: "6px",
                            padding: "4px 6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "4px"
                          }}
                        >
                          <span style={{ fontSize: "9px", fontWeight: 700, color: INK_SECONDARY }}>{r.nameEnglish}</span>

                          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                            <button
                              onClick={() => handleValueChange(idx, -1)}
                              style={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "4px", background: "#ffffff", fontSize: "10px", cursor: "pointer", color: INK_SECONDARY }}
                            >
                              −
                            </button>
                            <span style={{ fontSize: "10px", fontWeight: 800, minWidth: "16px", textAlign: "center", color: changed ? GOLD_DEEP : INK_PRIMARY }}>
                              {values[idx]}
                            </span>
                            <button
                              onClick={() => handleValueChange(idx, 1)}
                              style={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "4px", background: "#ffffff", fontSize: "10px", cursor: "pointer", color: INK_SECONDARY }}
                            >
                              +
                            </button>
                          </div>

                          <label style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "9px", cursor: "pointer", fontWeight: 700, color: INK_MUTED }}>
                            <input
                              type="checkbox"
                              checked={occupancy[idx]}
                              onChange={() => toggleOccupancy(idx)}
                              style={{ margin: 0, cursor: "pointer" }}
                            />
                            Occ
                          </label>

                          <span style={{ fontSize: "10px", fontWeight: 900, color: changed ? GOLD_DEEP : INK_MUTED, minWidth: "22px", textAlign: "right" }}>
                            → {reduced}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Single lords */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "10px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", marginBottom: "6px" }}>Single-lord signs — no reduction</div>
            <div style={{ display: "flex", gap: "8px" }}>
              {SINGLE_LORDS.map(sl => {
                const r = RASHIS[sl.sign];
                return (
                  <div
                    key={sl.planet}
                    style={{
                      flex: 1,
                      background: "rgba(156,122,47,0.03)",
                      border: "1px solid rgba(156,122,47,0.1)",
                      borderRadius: "6px",
                      padding: "6px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px"
                    }}
                  >
                    <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP }}>{sl.planet}</span>
                    <span style={{ fontSize: "9px", color: INK_MUTED }}>{r.nameEnglish}</span>
                    <span style={{ fontSize: "12px", fontWeight: 900, color: INK_SECONDARY }}>{values[sl.sign]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rule explanation */}
          <AnimatePresence mode="wait">
            {selectedPairIndex !== null && (
              <motion.div
                key={`rule-${selectedPairIndex}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "8px", display: "flex", gap: "6px", alignItems: "flex-start" }}
              >
                <Info size={14} color={GOLD_DEEP} style={{ flexShrink: 0, marginTop: "1px" }} />
                <div style={{ fontSize: "10.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
                  <strong style={{ color: GOLD_DEEP }}>{SAME_LORD_PAIRS[selectedPairIndex].planet}:</strong>{" "}
                  {describeCase(values, occupancy, SAME_LORD_PAIRS[selectedPairIndex])}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga reduction). Ekādhipatya śodhana removes duplication where one planet rules two signs. The full ruleset depends on occupancy, equality, and zeros; the calculator shows the standard case logic. Apply this reduction <strong>after</strong> trikoṇa śodhana.
      </div>
    </div>
  );
}
