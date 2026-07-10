"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, Flame, Leaf, Wind, Droplets } from "lucide-react";
import { RASHIS, ELEMENT_COLORS, polarToCartesian } from '@/components/learning-runtime/interactive/rashi-data';
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const INITIAL_SAV = [
  32, // Aries (Fire)
  28, // Taurus (Earth)
  30, // Gemini (Air)
  25, // Cancer (Water)
  35, // Leo (Fire)
  22, // Virgo (Earth)
  26, // Libra (Air)
  24, // Scorpio (Water)
  31, // Sagittarius (Fire)
  28, // Capricorn (Earth)
  30, // Aquarius (Air)
  26  // Pisces (Water)
];

const PRESETS = [
  { name: "Lesson 4 Chart (SAV)", data: INITIAL_SAV },
  { name: "Fire Trine Example [3, 5, 4]", data: [3, 28, 30, 25, 5, 22, 26, 24, 4, 28, 30, 26] },
  { name: "Earth Trine Example [6, 2, 6]", data: [32, 6, 30, 25, 35, 2, 26, 24, 31, 6, 30, 26] },
  { name: "Zero Present Example [5, 0, 3]", data: [32, 5, 30, 25, 35, 0, 26, 24, 31, 3, 30, 26] }
];

type ElementType = "Fire" | "Earth" | "Air" | "Water";

export function TrikonaReducer() {
  const [values, setValues] = useState<number[]>(INITIAL_SAV);
  const [selectedElement, setSelectedElement] = useState<ElementType | null>("Fire");
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);

  const handlePresetSelect = (presetIndex: number) => {
    setActivePresetIndex(presetIndex);
    setValues(PRESETS[presetIndex].data);
    if (presetIndex === 1) setSelectedElement("Fire");
    if (presetIndex === 2 || presetIndex === 3) setSelectedElement("Earth");
  };

  const resetValues = () => {
    handlePresetSelect(0);
  };


  const trineGroups = useMemo(() => {
    return {
      Fire: [0, 4, 8],      // Aries, Leo, Sagittarius
      Earth: [1, 5, 9],     // Taurus, Virgo, Capricorn
      Air: [2, 6, 10],      // Gemini, Libra, Aquarius
      Water: [3, 7, 11]     // Cancer, Scorpio, Pisces
    };
  }, []);

  const calculatedReductions = useMemo(() => {
    const reduced = [...values];
    
    // Perform Trikoṇa reduction for each element
    (Object.keys(trineGroups) as ElementType[]).forEach(el => {
      const indices = trineGroups[el];
      const val1 = values[indices[0]];
      const val2 = values[indices[1]];
      const val3 = values[indices[2]];
      const minVal = Math.min(val1, val2, val3);

      reduced[indices[0]] = val1 - minVal;
      reduced[indices[1]] = val2 - minVal;
      reduced[indices[2]] = val3 - minVal;
    });

    return reduced;
  }, [values, trineGroups]);

  const handleValueChange = (index: number, delta: number) => {
    setValues(prev => {
      const next = [...prev];
      next[index] = Math.max(0, Math.min(99, next[index] + delta));
      return next;
    });
  };

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

  const getElementIcon = (el: ElementType) => {
    switch (el) {
      case "Fire": return <Flame size={14} style={{ color: "#C9A24D" }} />;
      case "Earth": return <Leaf size={14} style={{ color: "#6B8E6B" }} />;
      case "Air": return <Wind size={14} style={{ color: "#7BA7C0" }} />;
      case "Water": return <Droplets size={14} style={{ color: "#5A8A9A" }} />;
    }
  };

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", borderBottom: "1px solid rgba(156,122,47,0.1)", paddingBottom: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Trikoṇa Śodhana (Trine Reduction) Calculator
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Subtract the minimum of each trine-group to isolate the net surplus of support.
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

      {/* ELEMENT SELECTOR BAR */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {(["Fire", "Earth", "Air", "Water"] as ElementType[]).map(el => {
          const colors = ELEMENT_COLORS[el];
          const isSelected = selectedElement === el;
          return (
            <button
              key={el}
              onClick={() => setSelectedElement(el)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: isSelected ? `2.5px solid ${colors.text}` : "1.2px solid rgba(0,0,0,0.08)",
                background: isSelected ? colors.bg : "rgba(255,255,255,0.5)",
                color: colors.text,
                fontSize: "11.5px",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {getElementIcon(el)} {el} Trine
            </button>
          );
        })}
        <button
          onClick={() => setSelectedElement(null)}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: selectedElement === null ? `2.5px solid ${GOLD_DEEP}` : "1.2px solid rgba(0,0,0,0.08)",
            background: selectedElement === null ? "rgba(156,122,47,0.08)" : "rgba(255,255,255,0.5)",
            color: INK_SECONDARY,
            fontSize: "11.5px",
            fontWeight: 850,
            cursor: "pointer",
            marginLeft: "auto"
          }}
        >
          Show All
        </button>
      </div>

      {/* SPLIT VIEW */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: SVG Wheel */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <h4 style={{ margin: "0 0 6px 0", fontSize: "12.5px", fontWeight: 750, color: GOLD_DEEP }}>
            Rāśi Trine Map
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

              {/* Segment fills and borders based on selected element */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                const isHighlighted = selectedElement ? r.element === selectedElement : true;
                const colors = ELEMENT_COLORS[r.element];

                let fill = "rgba(255,255,255,0.05)";
                let stroke = "none";

                if (isHighlighted) {
                  fill = colors.bg;
                  if (selectedElement === r.element) {
                    stroke = colors.text;
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
                    key={`rpath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={selectedElement === r.element ? "2.5" : "0.5"}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedElement(r.element)}
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

                const rawVal = values[p.rashiIndex];
                const reducedVal = calculatedReductions[p.rashiIndex];
                const isChanged = rawVal !== reducedVal;

                return (
                  <g key={`rlabel-${p.rashiIndex}`}>
                    {/* Outward-flowing rashi name */}
                    <text
                      x={ptEng.x}
                      y={ptEng.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "8.5px", fontWeight: 750, fill: INK_PRIMARY }}
                    >
                      {r.nameEnglish}
                    </text>
                    
                    {/* Value indicator: Raw -> Reduced */}
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
              <text x="180" y="175" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>TRIKOṆA</text>
              <text x="180" y="187" textAnchor="middle" style={{ fontSize: "9px", fontWeight: 900, fill: GOLD_DEEP }}>ŚODHANA</text>
              <text x="180" y="197" textAnchor="middle" style={{ fontSize: "6.5px", fontWeight: 800, fill: INK_MUTED }}>REDUCTION</text>
            </svg>
          </div>
        </div>

        {/* Right Column: Interactive Trine Panels */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          {(["Fire", "Earth", "Air", "Water"] as ElementType[]).map(el => {
            const indices = trineGroups[el];
            const val1 = values[indices[0]];
            const val2 = values[indices[1]];
            const val3 = values[indices[2]];
            const minVal = Math.min(val1, val2, val3);
            const isHighlighted = selectedElement === el;
            const colors = ELEMENT_COLORS[el];

            return (
              <div
                key={el}
                onClick={() => setSelectedElement(el)}
                style={{
                  background: isHighlighted ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                  padding: "10px",
                  borderRadius: "10px",
                  border: isHighlighted ? `1.5px solid ${colors.text}` : "1px solid rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                {/* Trine Title */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: colors.text, display: "flex", alignItems: "center", gap: "4px" }}>
                    {getElementIcon(el)} {el} Trine
                  </span>
                  <span style={{ fontSize: "10px", color: INK_MUTED, fontWeight: 700 }}>
                    Min of trine: <strong style={{ color: colors.text }}>{minVal}</strong>
                  </span>
                </div>

                {/* Grid of three signs */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {indices.map(idx => {
                    const r = RASHIS[idx];
                    const rawVal = values[idx];
                    const reducedVal = calculatedReductions[idx];

                    return (
                      <div
                        key={r.number}
                        style={{
                          flex: 1,
                          background: "rgba(0,0,0,0.02)",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid rgba(0,0,0,0.04)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <span style={{ fontSize: "10px", fontWeight: 750, color: INK_SECONDARY }}>
                          {r.nameEnglish}
                        </span>
                        
                        {/* Interactive Scrubber */}
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleValueChange(idx, -1);
                            }}
                            style={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "4px", background: "#ffffff", fontSize: "10px", cursor: "pointer" }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: "11px", fontWeight: 800, minWidth: "16px", textAlign: "center" }}>
                            {rawVal}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleValueChange(idx, 1);
                            }}
                            style={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "4px", background: "#ffffff", fontSize: "10px", cursor: "pointer" }}
                          >
                            +
                          </button>
                        </div>

                        {/* Reduced Value display */}
                        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", width: "100%", textAlign: "center", paddingTop: "2px", fontSize: "10px", fontWeight: 750, color: GOLD_DEEP }}>
                          Reduced: {reducedVal}
                        </div>
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
      {selectedElement && (() => {
        const indices = trineGroups[selectedElement];
        const val1 = values[indices[0]];
        const val2 = values[indices[1]];
        const val3 = values[indices[2]];
        const minVal = Math.min(val1, val2, val3);
        const name1 = RASHIS[indices[0]].nameEnglish;
        const name2 = RASHIS[indices[1]].nameEnglish;
        const name3 = RASHIS[indices[2]].nameEnglish;

        let explanation = "";
        if (minVal === 0) {
          explanation = `Because one of the signs in the trine (${val1 === 0 ? name1 : val2 === 0 ? name2 : name3}) has 0 bindus, the minimum of the trine is 0. Subtracting 0 leaves the other sign values completely unchanged.`;
        } else if (val1 === val2 && val2 === val3) {
          explanation = `All signs have equal values (${val1}). Subtracting the minimum (${minVal}) reduces all three signs to exactly 0.`;
        } else {
          explanation = `The smallest value among the three is ${minVal} (found in ${val1 === minVal ? name1 : val2 === minVal ? name2 : name3}). Subtracting ${minVal} from each yields the net surplus of support.`;
        }

        return (
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.45, display: "flex", gap: "6px", alignItems: "flex-start" }}>
            <Info size={14} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong>{selectedElement} Trine Detail:</strong> {explanation}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
