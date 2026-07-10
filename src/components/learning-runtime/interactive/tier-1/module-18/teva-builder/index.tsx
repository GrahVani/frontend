"use client";

import { useState, useMemo } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  Eye,
  EyeOff,
  Grid3x3,
  MousePointerClick,
  RotateCcw,
} from "lucide-react";
import {
  SIGNS,
  SHORT_SIGNS,
  SIGN_ABBRS,
  PLANETS,
  PRESETS,
} from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const LAL_KITAB_COLOR = "#A87830";
const LAL_KITAB_DEEP = "#7A5212";

export function TevaBuilder() {
  const [placements, setPlacements] = useState<Record<string, number | null>>({});
  const [lagnaSign, setLagnaSign] = useState<number>(3);
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const loadPreset = (preset: typeof PRESETS[0]) => {
    const map: Record<string, number | null> = {};
    PLANETS.forEach((p) => {
      map[p.key] = preset.placements[p.key] ?? null;
    });
    setPlacements(map);
    setLagnaSign(preset.lagnaSign);
  };

  const setPlanetSign = (planetKey: string, signIdx: number | null) => {
    setPlacements((prev) => ({ ...prev, [planetKey]: signIdx }));
  };

  const handleReset = () => {
    const empty: Record<string, number | null> = {};
    PLANETS.forEach((p) => { empty[p.key] = null; });
    setPlacements(empty);
    setLagnaSign(3);
    setShowOverlay(false);
    setActiveStep(1);
  };

  // Build box contents
  const boxPlanets = useMemo(() => {
    const boxes: Record<number, { name: string; abbr: string; key: string }[]> = {};
    PLANETS.forEach((p) => {
      const sign = placements[p.key];
      if (sign !== null && sign !== undefined) {
        const box = sign + 1; // sign 0 -> box 1
        if (!boxes[box]) boxes[box] = [];
        boxes[box].push({ name: p.name, abbr: p.abbr, key: p.key });
      }
    });
    return boxes;
  }, [placements]);

  const lagnaBox = lagnaSign + 1;
  const allPlaced = PLANETS.every((p) => placements[p.key] !== null && placements[p.key] !== undefined);

  return (
    <div data-interactive="teva-builder" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.2.2 — Constructing the Teva</p>
            <h2 style={{ margin: "0.2rem 0 0", color: LAL_KITAB_COLOR, fontSize: "1.35rem" }}>
              Teva Builder — Step by Step
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Enter sidereal sign placements, select the lagna, and watch each planet drop into its fixed box.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Step progress */}
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {[
          { n: 1, label: "1. Select signs" },
          { n: 2, label: "2. Set lagna" },
          { n: 3, label: "3. Build Teva" },
        ].map((s) => (
          <button
            key={s.n}
            type="button"
            onClick={() => setActiveStep(s.n)}
            style={{
              ...buttonStyle(activeStep === s.n, activeStep === s.n ? LAL_KITAB_COLOR : HAIRLINE),
              flex: 1,
              minWidth: 120,
              justifyContent: "center",
              fontSize: "0.82rem",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Main workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(280px, 380px)", gap: "1rem", alignItems: "start" }}>
        {/* Left: Teva grid */}
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: LAL_KITAB_DEEP, fontWeight: 950 }}>
              <Grid3x3 size={18} />
              Teva grid
            </div>
            <button
              type="button"
              onClick={() => setShowOverlay((v) => !v)}
              style={buttonStyle(showOverlay, showOverlay ? VERMILION : BLUE)}
            >
              {showOverlay ? <EyeOff size={14} /> : <Eye size={14} />}
              {showOverlay ? "Hide overlay" : "Parāśarī overlay"}
            </button>
          </div>

          <NorthIndianSvgChart boxPlanets={boxPlanets} lagnaSign={lagnaSign} showOverlay={showOverlay} />

          {allPlaced && (
            <div style={{ marginTop: "0.75rem", padding: "0.65rem", borderRadius: 8, background: `${GREEN}0A`, border: `1px solid ${GREEN}33`, display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <BookOpen size={16} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
                <strong style={{ color: GREEN }}>All planets placed.</strong> Each planet sits in the box matching its sidereal sign. The lagna marker is on box {lagnaBox} ({SHORT_SIGNS[lagnaSign]}). No planet was counted from the lagna.
              </p>
            </div>
          )}
        </section>

        {/* Right: controls */}
        <section style={{ display: "grid", gap: "0.85rem" }}>
          {/* Presets */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <p style={eyebrowStyle}>Presets</p>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  style={{
                    ...buttonStyle(false, GOLD),
                    fontSize: "0.78rem",
                    padding: "0.4rem 0.55rem",
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 1: Planet selectors */}
          {activeStep === 1 && (
            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
              <p style={eyebrowStyle}>Step 1 — Planet sidereal signs</p>
              <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.45 }}>
                Select the sidereal sign for each planet. Sign number = box number.
              </p>
              <div style={{ display: "grid", gap: "0.4rem" }}>
                {PLANETS.map((p) => (
                  <label key={p.key} style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{ fontWeight: 850, fontSize: "0.85rem", color: INK_PRIMARY }}>{p.name}</span>
                    <select
                      value={placements[p.key] ?? ""}
                      onChange={(e) => setPlanetSign(p.key, e.target.value === "" ? null : Number(e.target.value))}
                      style={{
                        border: `1px solid ${HAIRLINE}`,
                        borderRadius: 8,
                        background: "rgba(255,251,241,0.78)",
                        color: INK_PRIMARY,
                        padding: "0.45rem 0.55rem",
                        fontWeight: 850,
                      }}
                    >
                      <option value="">— select sign —</option>
                      {SIGNS.map((s, i) => (
                        <option key={s} value={i}>{s}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Lagna selector */}
          {activeStep === 2 && (
            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
              <p style={eyebrowStyle}>Step 2 — Lagna marker</p>
              <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.45 }}>
                Select the rising sign. The marker records it without relabelling house 1 or moving any planet.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.4rem" }}>
                {SHORT_SIGNS.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setLagnaSign(i)}
                    style={{
                      ...buttonStyle(lagnaSign === i, BLUE),
                      fontSize: "0.78rem",
                      padding: "0.42rem 0.3rem",
                      justifyContent: "center",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div style={{ padding: "0.6rem", borderRadius: 6, background: `${BLUE}0A`, border: `1px solid ${BLUE}33` }}>
                <span style={{ color: BLUE, fontWeight: 950, fontSize: "0.85rem" }}>
                  Lagna: {SHORT_SIGNS[lagnaSign]} → marker on box {lagnaBox}
                </span>
              </div>
            </div>
          )}

          {/* Step 3: Build result */}
          {activeStep === 3 && (
            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
              <p style={eyebrowStyle}>Step 3 — Build result</p>
              <div style={{ display: "grid", gap: "0.35rem" }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((box) => {
                  const planets = boxPlanets[box] || [];
                  const isLagna = box === lagnaBox;
                  return (
                    <div key={box} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                      <span style={{ fontWeight: 950, color: isLagna ? BLUE : INK_MUTED, minWidth: 36 }}>
                        Box {box}
                      </span>
                      <span style={{ color: INK_SECONDARY }}>{SHORT_SIGNS[box - 1]}</span>
                      {isLagna && <span style={{ color: BLUE, fontWeight: 850, fontSize: "0.75rem" }}>(Lg)</span>}
                      {planets.length > 0 && (
                        <span style={{ color: INK_PRIMARY, fontWeight: 850 }}>
                          {planets.map((p) => p.name).join(", ")}
                        </span>
                      )}
                      {planets.length === 0 && <span style={{ color: INK_MUTED }}>—</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Discipline note */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Construction discipline</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.55rem", marginTop: "0.5rem" }}>
          <DisciplineCard step="1" text="Compute sidereal positions" color={LAL_KITAB_COLOR} />
          <DisciplineCard step="2" text="Draw fixed frame (Aries = H1)" color={LAL_KITAB_COLOR} />
          <DisciplineCard step="3" text="Place by sign number = box number" color={GREEN} />
          <DisciplineCard step="4" text="Add lagna marker (reference only)" color={BLUE} />
        </div>
      </section>
    </div>
  );
}

/* ─────────────────/* ───────────────────────── SVG Chart Components ───────────────────────── */

const HOUSE_POLYGONS: Record<number, string> = {
  1: "200,10 105,105 200,200 295,105",
  2: "10,10 200,10 105,105",
  3: "10,10 105,105 10,200",
  4: "10,200 105,105 200,200 105,295",
  5: "10,200 105,295 10,390",
  6: "10,390 105,295 200,390",
  7: "200,390 105,295 200,200 295,295",
  8: "200,390 295,295 390,390",
  9: "390,200 295,295 390,390",
  10: "390,200 295,105 200,200 295,295",
  11: "390,10 295,105 390,200",
  12: "200,10 390,10 295,105",
};

const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 105 },
  2: { x: 105, y: 45 },
  3: { x: 45, y: 105 },
  4: { x: 105, y: 200 },
  5: { x: 45, y: 295 },
  6: { x: 105, y: 355 },
  7: { x: 200, y: 295 },
  8: { x: 295, y: 355 },
  9: { x: 355, y: 295 },
  10: { x: 295, y: 200 },
  11: { x: 355, y: 105 },
  12: { x: 295, y: 45 },
};

const HOUSE_SIGN_NUM_POS: Record<number, { x: number; y: number }> = {
  1: { x: 186, y: 144 },
  2: { x: 105, y: 80 },
  3: { x: 80, y: 105 },
  4: { x: 144, y: 186 },
  5: { x: 80, y: 295 },
  6: { x: 105, y: 325 },
  7: { x: 186, y: 256 },
  8: { x: 295, y: 325 },
  9: { x: 320, y: 295 },
  10: { x: 256, y: 186 },
  11: { x: 320, y: 105 },
  12: { x: 295, y: 80 },
};

// Positions for House Labels when house has planets
const OCCUPIED_LABEL_POS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 35 },
  2: { x: 45, y: 25 },
  3: { x: 25, y: 45 },
  4: { x: 35, y: 200 },
  5: { x: 25, y: 355 },
  6: { x: 45, y: 375 },
  7: { x: 200, y: 365 },
  8: { x: 355, y: 375 },
  9: { x: 375, y: 355 },
  10: { x: 365, y: 200 },
  11: { x: 375, y: 45 },
  12: { x: 355, y: 25 },
};

interface NorthIndianSvgChartProps {
  boxPlanets: Record<number, { name: string; abbr: string; key: string }[]>;
  lagnaSign: number;
  showOverlay: boolean;
}

function NorthIndianSvgChart({
  boxPlanets,
  lagnaSign,
  showOverlay,
}: NorthIndianSvgChartProps) {
  return (
    <div style={{ width: "100%", maxWidth: 440, margin: "0 auto", position: "relative" }}>
      <svg
        viewBox="0 0 400 400"
        style={{
          width: "100%",
          background: "#fffdf8",
          border: `1.5px solid ${HAIRLINE}`,
          borderRadius: "10px",
          overflow: "visible",
        }}
      >
        {/* Render Houses (polygons) */}
        {Array.from({ length: 12 }, (_, idx) => {
          const h = idx + 1;
          const isLagna = h === (lagnaSign + 1);

          // Fixed Aries frame: sign in box h is h (0-indexed h-1)
          const signIdx = h - 1;
          const signName = SHORT_SIGNS[signIdx];
          const signAbbr = SIGN_ABBRS[signIdx];
          const signNum = h;

          const polyFill = isLagna
            ? `${BLUE}0A`
            : "transparent";

          const strokeColor = isLagna
            ? BLUE
            : "rgba(168, 120, 48, 0.45)";

          const houseGrahes = boxPlanets[h] || [];
          const hasPlanets = houseGrahes.length > 0;

          // Parashari overlay house relative to lagna sign
          const overlayHouse = ((signIdx - lagnaSign + 12) % 12) + 1;

          // For occupied cells overlay offset
          const isLowerHouse = [5, 6, 7, 8, 9].includes(h);
          const occupiedOverlayY = isLowerHouse 
            ? OCCUPIED_LABEL_POS[h].y - 13 
            : OCCUPIED_LABEL_POS[h].y + 13;

          return (
            <g key={h}>
              <polygon
                points={HOUSE_POLYGONS[h]}
                fill={polyFill}
                stroke={strokeColor}
                strokeWidth={isLagna ? 2 : 1.2}
                style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
              />

              {hasPlanets ? (
                // State: House has planets. Place labels in corners.
                <g>
                  {/* House Label */}
                  <text
                    x={OCCUPIED_LABEL_POS[h].x}
                    y={OCCUPIED_LABEL_POS[h].y}
                    fill={INK_SECONDARY}
                    fontSize={9.5}
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    H{h}
                  </text>

                  {/* Parashari Overlay (occupied) */}
                  {showOverlay && (
                    <text
                      x={OCCUPIED_LABEL_POS[h].x}
                      y={occupiedOverlayY}
                      fill={VERMILION}
                      fontSize={8.5}
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      P: {overlayHouse}H
                    </text>
                  )}

                  {/* Sign number + Lagna indicator */}
                  <text
                    x={HOUSE_SIGN_NUM_POS[h].x}
                    y={HOUSE_SIGN_NUM_POS[h].y}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    <tspan fill={isLagna ? BLUE : LAL_KITAB_DEEP} fontSize={11.5} fontWeight="950">
                      {signNum}
                    </tspan>
                    {isLagna && (
                      <tspan fill={BLUE} fontSize={8.5} fontWeight="900" dx="4">Lg</tspan>
                    )}
                  </text>
                </g>
              ) : (
                // State: House is empty. Stack elements vertically in the center.
                <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                  {/* House Label */}
                  <text
                    y="-20"
                    fill={INK_SECONDARY}
                    fontSize={10.5}
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    H{h}
                  </text>

                  {/* Sign Abbreviation */}
                  <text
                    y="-4"
                    fill={isLagna ? BLUE : LAL_KITAB_COLOR}
                    fontSize={12.5}
                    fontWeight="900"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {signAbbr}
                  </text>

                  {/* Sign Name */}
                  <text
                    y="10"
                    fill={INK_SECONDARY}
                    fontSize={9.5}
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {signName}
                  </text>

                  {/* Sign Number + Lagna indicator */}
                  <text
                    y="24"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    <tspan fill={isLagna ? BLUE : LAL_KITAB_DEEP} fontSize={11.5} fontWeight="950">
                      {signNum}
                    </tspan>
                    {isLagna && (
                      <tspan fill={BLUE} fontSize={8.5} fontWeight="900" dx="4">Lg</tspan>
                    )}
                  </text>

                  {/* Parashari Overlay (empty) */}
                  {showOverlay && (
                    <text
                      y="36"
                      fill={VERMILION}
                      fontSize={8.5}
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      P: {overlayHouse}H
                    </text>
                  )}
                </g>
              )}

              {/* Draw planet badges */}
              {hasPlanets && (
                <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                  {houseGrahes.map((p, pIdx) => {
                    const grahaAbbr = p.abbr;
                    const badgeW = 28;
                    const badgeH = 18;
                    const gap = 3;
                    const totalW = houseGrahes.length * badgeW + (houseGrahes.length - 1) * gap;
                    const startX = -totalW / 2 + badgeW / 2;
                    const xOffset = startX + pIdx * (badgeW + gap);

                    const badgeFill = LAL_KITAB_COLOR;
                    const badgeStroke = LAL_KITAB_COLOR;
                    const textFill = "#fff";

                    return (
                      <g key={p.key} transform={`translate(${xOffset}, 0)`}>
                        <rect
                          x={-badgeW / 2}
                          y={-badgeH / 2}
                          width={badgeW}
                          height={badgeH}
                          rx={4}
                          fill={badgeFill}
                          stroke={badgeStroke}
                          strokeWidth={1.2}
                          style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.06))" }}
                        />
                        <text
                          fill={textFill}
                          fontSize={9.5}
                          fontWeight="900"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {grahaAbbr}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}
            </g>
          );
        })}

        {/* Standard Lines */}
        <g stroke="rgba(184, 132, 33, 0.3)" strokeWidth="1.2" fill="none">
          <rect x="10" y="10" width="380" height="380" />
          <line x1="10" y1="10" x2="390" y2="390" />
          <line x1="390" y1="10" x2="10" y2="390" />
          <line x1="200" y1="10" x2="10" y2="200" />
          <line x1="10" y1="200" x2="200" y2="390" />
          <line x1="200" y1="390" x2="390" y2="200" />
          <line x1="390" y1="200" x2="200" y2="10" />
        </g>
      </svg>
    </div>
  );
}

function DisciplineCard({ step, text, color }: { step: string; text: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.6rem" }}>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: color, color: "#fff", fontWeight: 950, fontSize: "0.8rem", flexShrink: 0 }}>
        {step}
      </span>
      <span style={{ fontSize: "0.85rem", color: INK_PRIMARY, fontWeight: 700, lineHeight: 1.4 }}>{text}</span>
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
