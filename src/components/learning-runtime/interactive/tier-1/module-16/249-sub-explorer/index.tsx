"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { NAKSHATRAS } from '@/components/learning-runtime/interactive/nakshatra-data';

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const BLUE = "#356CAB";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const VIM: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];
const RASHI_LORD = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

function formatDMS(arcMinutes: number): string {
  const deg = Math.floor(arcMinutes / 60);
  const min = Math.floor(arcMinutes % 60);
  const sec = Math.round((arcMinutes * 60) % 60);
  if (sec > 0) {
    return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″`;
  }
  return `${deg}°${min.toString().padStart(2, "0")}′`;
}

function formatZodiac(arcMinutes: number): string {
  const signIdx = Math.min(Math.floor(arcMinutes / 1800), 11);
  const degMinSec = arcMinutes % 1800;
  const deg = Math.floor(degMinSec / 60);
  const min = Math.floor(degMinSec % 60);
  const sec = Math.round((degMinSec * 60) % 60);
  const signName = SIGNS[signIdx];
  if (sec > 0) {
    return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″ ${signName}`;
  }
  return `${deg}°${min.toString().padStart(2, "0")}′ ${signName}`;
}

export function Kp249SubExplorer() {
  const [nakIdx, setNakIdx] = useState(0); // Default Aśvinī
  const [cursorVal, setCursorVal] = useState(400); // 0 to 800 arcminutes
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const selectedNak = NAKSHATRAS[nakIdx];
  const nakStart = nakIdx * 800;
  const nakEnd = (nakIdx + 1) * 800;

  // Current coordinate absolute longitude
  const activeAbsMinutes = nakStart + cursorVal;

  // Active Sign, Nakshatra, Sub-lord, and D9 Navamsha
  const activeSignIdx = Math.min(Math.floor(activeAbsMinutes / 1800), 11);
  const activeRashiLord = RASHI_LORD[activeSignIdx];

  // Derive the 9 unequal sub divisions inside this nakṣatra
  const subs = useMemo(() => {
    const startIdx = VIM.findIndex((v) => v[0] === selectedNak.ruler);
    const result = [];
    let currentOffset = 0;
    for (let i = 0; i < 9; i++) {
      const [lord, years] = VIM[(startIdx + i) % 9];
      const width = (years / 120) * 800;
      result.push({
        index: i,
        lord,
        years,
        width,
        from: currentOffset,
        to: currentOffset + width,
        absFrom: nakStart + currentOffset,
        absTo: nakStart + currentOffset + width,
      });
      currentOffset += width;
    }
    return result;
  }, [selectedNak, nakStart]);

  // Active Sub-lord
  const activeSub = useMemo(() => {
    return subs.find(s => cursorVal >= s.from && cursorVal <= s.to) || subs[0];
  }, [subs, cursorVal]);

  // Find overlapping D9 Navamshas (width 200' each)
  const overlappingNavamshas = useMemo(() => {
    const startNav = Math.floor(nakStart / 200);
    const endNav = Math.ceil(nakEnd / 200);
    const result = [];
    for (let i = startNav; i < endNav; i++) {
      const absFrom = i * 200;
      const absTo = (i + 1) * 200;
      const from = Math.max(0, absFrom - nakStart);
      const to = Math.min(800, absTo - nakStart);
      const signIdx = i % 12;
      const lord = RASHI_LORD[signIdx];
      result.push({
        index: i,
        signIdx,
        lord,
        from,
        to,
        absFrom,
        absTo,
      });
    }
    return result;
  }, [nakStart, nakEnd]);

  // Active D9 Navamsha
  const activeD9 = useMemo(() => {
    return overlappingNavamshas.find(n => cursorVal >= n.from && cursorVal <= n.to) || overlappingNavamshas[0];
  }, [overlappingNavamshas, cursorVal]);

  // Find sign boundary intersections inside the nakṣatra (multiples of 1800')
  const signBoundaries = useMemo(() => {
    const result = [];
    const firstSign = Math.ceil(nakStart / 1800);
    const lastSign = Math.floor(nakEnd / 1800);
    for (let s = firstSign; s <= lastSign; s++) {
      const absBoundary = s * 1800;
      if (absBoundary > nakStart && absBoundary < nakEnd) {
        result.push({
          absBoundary,
          offset: absBoundary - nakStart,
          leftSign: SIGNS[s - 1],
          rightSign: SIGNS[s],
        });
      }
    }
    return result;
  }, [nakStart, nakEnd]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (svgRef.current) {
      svgRef.current.setPointerCapture(e.pointerId);
      setIsDragging(true);
      updateCursorFromEvent(e);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateCursorFromEvent(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (svgRef.current) {
      svgRef.current.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  const updateCursorFromEvent = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padding = 20; // 20px padding left and right in the SVG coordinates (0-800 maps to 20-780)
    const renderWidth = rect.width - 2 * padding;
    const percent = Math.max(0, Math.min(1, (x - padding) / renderWidth));
    setCursorVal(Math.round(percent * 800));
  };

  // Convert cursorVal to screen X inside SVG coordinate system (width = 800)
  // Let's map 0-800 to 20-780 for padding
  const getSvgX = (val: number) => 20 + (val / 800) * 760;

  return (
    <div style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.8rem", marginBottom: "1rem" }}>
          <div>
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GREEN, fontWeight: 900, background: `${GREEN}15`, padding: "2px 8px", borderRadius: "4px" }}>Visual Sandbox</span>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, fontWeight: 900, background: `${GOLD}15`, padding: "2px 8px", borderRadius: "4px" }}>Chapter 3, Lesson 1</span>
            </div>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.4rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
              KP 249 Sub-Divisions Explorer
            </h2>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>Select Nakṣatra:</span>
            <select
              value={nakIdx}
              aria-label="Select Nakshatra"
              onChange={(e) => {
                setNakIdx(Number(e.target.value));
              }}
              style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, color: INK_PRIMARY, padding: "0.4rem 0.6rem", fontWeight: 700, fontSize: "0.9rem" }}
            >
              {NAKSHATRAS.map((n, i) => (
                <option key={n.name} value={i}>
                  {n.num}. {n.name} ({n.ruler})
                </option>
              ))}
            </select>
          </div>
        </div>

        <p style={{ margin: "0 0 1rem", fontSize: "13px", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Drag the vertical cursor line or use the slider under the track to scan the 13°20′ (800′) span of <strong>{selectedNak.name}</strong>. Observe how the Rashi, Nakshatra, Unequal Sub-lord, and D9 layers align.
        </p>

        {/* Draggable Parallel Track SVG */}
        <div style={{ background: `${GOLD}04`, border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "1rem", position: "relative", touchAction: "none" }}>
          <svg
            ref={svgRef}
            width="100%"
            height="220"
            viewBox="0 0 800 220"
            style={{ overflow: "visible", cursor: "pointer", userSelect: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Background grid guides */}
            <rect x="20" y="10" width="760" height="200" fill="none" stroke={`${HAIRLINE}50`} strokeWidth="1" />
            
            {/* ROW 1: Rashi Layer */}
            <g transform="translate(0, 10)">
              <text x="25" y="14" fontSize="9" fontWeight="800" fill={INK_MUTED} style={{ textTransform: "uppercase" }}>1. Rashi / Sign Layer</text>
              <rect x="20" y="18" width="760" height="22" fill={`${BLUE}08`} stroke={`${HAIRLINE}80`} strokeWidth="0.5" />
              {/* If sign boundary splits it */}
              {signBoundaries.length > 0 ? (
                <>
                  <rect x="20" y="18" width={(signBoundaries[0].offset / 800) * 760} height="22" fill={`${BLUE}10`} />
                  <text x={20 + ((signBoundaries[0].offset / 800) * 760) / 2} y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill={BLUE}>
                    {signBoundaries[0].leftSign} (Lord: {RASHI_LORD[activeSignIdx - 1]})
                  </text>
                  <text x={20 + (signBoundaries[0].offset / 800) * 760 + ((800 - signBoundaries[0].offset) / 800) * 760 / 2} y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill={BLUE}>
                    {signBoundaries[0].rightSign} (Lord: {RASHI_LORD[activeSignIdx]})
                  </text>
                </>
              ) : (
                <text x="400" y="32" textAnchor="middle" fontSize="10" fontWeight="700" fill={BLUE}>
                  {SIGNS[activeSignIdx]} (Lord: {activeRashiLord})
                </text>
              )}
            </g>

            {/* ROW 2: Nakshatra Layer */}
            <g transform="translate(0, 60)">
              <text x="25" y="14" fontSize="9" fontWeight="800" fill={INK_MUTED} style={{ textTransform: "uppercase" }}>2. Nakshatra Layer</text>
              <rect x="20" y="18" width="760" height="22" fill={`${GOLD}10`} stroke={`${HAIRLINE}80`} strokeWidth="0.5" />
              <text x="400" y="32" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={GOLD}>
                {selectedNak.name} (Lord: {selectedNak.ruler})
              </text>
            </g>

            {/* ROW 3: Sub Layer */}
            <g transform="translate(0, 110)">
              <text x="25" y="14" fontSize="9" fontWeight="800" fill={INK_MUTED} style={{ textTransform: "uppercase" }}>3. Sub-Lord Layer (Unequal Vimshottari Splits)</text>
              {subs.map((s, idx) => {
                const subXStart = getSvgX(s.from);
                const subWidth = (s.width / 800) * 760;
                const isSelected = activeSub.index === s.index;
                return (
                  <g key={idx}>
                    <rect
                      x={subXStart}
                      y="18"
                      width={subWidth}
                      height="26"
                      fill={isSelected ? `${GOLD}22` : "transparent"}
                      stroke={`${HAIRLINE}`}
                      strokeWidth="1"
                    />
                    {subWidth > 22 && (
                      <text x={subXStart + subWidth / 2} y="34" textAnchor="middle" fontSize="9" fontWeight={isSelected ? "900" : "600"} fill={isSelected ? GOLD : INK_PRIMARY}>
                        {s.lord}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* ROW 4: D9 Layer */}
            <g transform="translate(0, 160)">
              <text x="25" y="14" fontSize="9" fontWeight="800" fill={INK_MUTED} style={{ textTransform: "uppercase" }}>4. D9 Navamsha Layer (Equal 3°20' divisions)</text>
              {overlappingNavamshas.map((n, idx) => {
                const d9XStart = getSvgX(n.from);
                const d9Width = ((n.to - n.from) / 800) * 760;
                const isSelected = activeD9.index === n.index;
                return (
                  <g key={idx}>
                    <rect
                      x={d9XStart}
                      y="18"
                      width={d9Width}
                      height="22"
                      fill={isSelected ? `${GREEN}15` : `${GREEN}05`}
                      stroke={`${HAIRLINE}90`}
                      strokeWidth="0.5"
                    />
                    {d9Width > 30 && (
                      <text x={d9XStart + d9Width / 2} y="32" textAnchor="middle" fontSize="8" fontWeight={isSelected ? "800" : "600"} fill={GREEN}>
                        {SIGNS[n.signIdx]} D9
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Vertical dragging cursor indicator */}
            <g>
              <line
                x1={getSvgX(cursorVal)}
                y1="10"
                x2={getSvgX(cursorVal)}
                y2="210"
                stroke={RED}
                strokeWidth="2.5"
                filter="drop-shadow(0px 0px 4px rgba(162, 58, 30, 0.4))"
              />
              <circle
                cx={getSvgX(cursorVal)}
                cy="10"
                r="6"
                fill={RED}
              />
              <circle
                cx={getSvgX(cursorVal)}
                cy="210"
                r="6"
                fill={RED}
              />
            </g>
          </svg>
        </div>

        {/* HTML Accessible Backup Slider */}
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: INK_SECONDARY, fontWeight: 700 }}>
              Position inside {selectedNak.name}: <span style={{ color: GOLD, fontFamily: "monospace" }}>{formatDMS(cursorVal)}</span> / 13°20′
            </span>
            <span style={{ fontSize: "12px", color: RED, fontWeight: 700 }}>
              Absolute Longitude: <span style={{ fontFamily: "monospace" }}>{formatZodiac(activeAbsMinutes)}</span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="800"
            value={cursorVal}
            onChange={(e) => setCursorVal(Number(e.target.value))}
            style={{ width: "100%", cursor: "pointer", accentColor: RED }}
            aria-label="Cusp Position Slider"
          />
        </div>
      </section>

      {/* Real-time Lord Intersection Chain Diagram */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
        <h3 style={{ margin: "0 0 1rem", color: GOLD, fontSize: "1.1rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
          Cusp Lord Intersection Chain
        </h3>
        
        {/* Visual pipeline node flow chart */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", flexWrap: "wrap", gap: "1rem", padding: "1rem 0" }}>
          
          <div style={lordBadgeStyle(BLUE)}>
            <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase" }}>Rashi Lord</span>
            <strong style={{ fontSize: "15px", color: BLUE }}>{activeRashiLord}</strong>
          </div>

          <div style={{ fontSize: "1.5rem", color: HAIRLINE, fontWeight: "300" }}>➔</div>

          <div style={lordBadgeStyle(GOLD)}>
            <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase" }}>Star Lord</span>
            <strong style={{ fontSize: "15px", color: GOLD }}>{selectedNak.ruler}</strong>
          </div>

          <div style={{ fontSize: "1.5rem", color: HAIRLINE, fontWeight: "300" }}>➔</div>

          <div style={lordBadgeStyle(RED)}>
            <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase" }}>Sub Lord</span>
            <strong style={{ fontSize: "15px", color: RED }}>{activeSub.lord}</strong>
          </div>

          <div style={{ fontSize: "1.5rem", color: HAIRLINE, fontWeight: "300" }}>➔</div>

          <div style={lordBadgeStyle(GREEN)}>
            <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase" }}>D9 Lord</span>
            <strong style={{ fontSize: "15px", color: GREEN }}>{activeD9.lord}</strong>
          </div>

        </div>

        <p style={{ margin: "1rem 0 0", fontSize: "12.5px", color: INK_SECONDARY, lineHeight: 1.5, background: `${GREEN}05`, borderLeft: `3px solid ${GREEN}`, padding: "8px 12px" }}>
          <strong>Pedagogical Insight:</strong> Placing a planet at coordinate <strong>{formatZodiac(activeAbsMinutes)}</strong> subjects it to the rule of {activeRashiLord} (Sign), {selectedNak.ruler} (Star), and {activeSub.lord} (Sub-lord). Notice that Sub-lord widths are unequal because they mimic the years allocated to each lord in the 120-year Vimshottari Dasha system.
        </p>
      </section>

      {/* Numerical Math Breakdowns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
        
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem" }}>
          <h4 style={{ margin: "0 0 0.8rem", color: GOLD, fontSize: "0.95rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
            Sub-Lord Math Derivation
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: INK_SECONDARY }}>Active Sub-Lord:</span>
              <strong style={{ color: RED }}>{activeSub.lord}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: INK_SECONDARY }}>Dasha Span Years:</span>
              <strong>{activeSub.years} Years / 120 Total</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: INK_SECONDARY }}>Arc Width:</span>
              <strong style={{ color: GREEN }}>{formatDMS(activeSub.width)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: INK_SECONDARY }}>Local Offset Span:</span>
              <span>{formatDMS(activeSub.from)} to {formatDMS(activeSub.to)}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", marginTop: "0.4rem" }}>
              <span style={{ color: INK_MUTED, fontSize: "10px", fontWeight: 700 }}>MATHEMATICAL RATIO:</span>
              <code style={{ background: "rgba(0,0,0,0.02)", padding: "6px", borderRadius: 4, fontSize: "11px", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                ({activeSub.years} / 120) * 800′ = {activeSub.width.toFixed(1)}′ ({formatDMS(activeSub.width)})
              </code>
            </div>
          </div>
        </div>

        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem" }}>
          <h4 style={{ margin: "0 0 0.8rem", color: GOLD, fontSize: "0.95rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
            Operational 249 Divisions
          </h4>
          <p style={{ margin: 0, fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.55 }}>
            A standard 27 nakṣatras × 9 sub-divisions setup yields <strong>243 natural divisions</strong>.
            <br /><br />
            However, 9 of the 12 rāśi boundaries cut through the middle of these sub-divisions. To preserve sign-lord associations, these 6 split divisions are broken into 12 separate entries, totaling <strong>249 operational divisions</strong>.
          </p>
          {signBoundaries.length > 0 && (
            <div style={{ marginTop: "0.75rem", padding: "0.4rem 0.6rem", borderRadius: 6, background: `${RED}08`, border: `1px dashed ${RED}33`, fontSize: "11px" }}>
              <strong style={{ color: RED }}>Sign Boundary Crossing:</strong> This nakṣatra is cut by the boundary between {signBoundaries[0].leftSign} and {signBoundaries[0].rightSign} at local offset {formatDMS(signBoundaries[0].offset)}.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function lordBadgeStyle(color: string): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    background: `${color}06`,
    border: `1.5px solid ${color}40`,
    minWidth: "100px",
    textAlign: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.02)"
  };
}
