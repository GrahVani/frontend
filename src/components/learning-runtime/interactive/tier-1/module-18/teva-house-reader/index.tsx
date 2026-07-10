"use client";

import { useState, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BookOpen,
  Eye,
  EyeOff,
  Grid3x3,
  MousePointerClick,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import {
  SHORT_SIGNS,
  SIGN_ABBRS,
  PLANETS,
  HOUSE_THEMES,
  PRESETS,
  getCombinedReading,
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

export function TevaHouseReader() {
  const [placements, setPlacements] = useState<Record<string, number | null>>({});
  const [lagnaSign, setLagnaSign] = useState<number>(6);
  const [selectedBox, setSelectedBox] = useState<number | null>(5);
  const [showMarker, setShowMarker] = useState(true);
  const [readMode, setReadMode] = useState<"house" | "sign">("house");

  const loadPreset = (preset: typeof PRESETS[0]) => {
    const map: Record<string, number | null> = {};
    PLANETS.forEach((p) => {
      map[p.key] = preset.placements[p.key] ?? null;
    });
    setPlacements(map);
    setLagnaSign(preset.lagnaSign);
    setSelectedBox(null);
  };

  const boxPlanets = useMemo(() => {
    const boxes: Record<number, { name: string; abbr: string; key: string }[]> = {};
    PLANETS.forEach((p) => {
      const sign = placements[p.key];
      if (sign !== null && sign !== undefined) {
        const box = sign + 1;
        if (!boxes[box]) boxes[box] = [];
        boxes[box].push({ name: p.name, abbr: p.abbr, key: p.key });
      }
    });
    return boxes;
  }, [placements]);

  const lagnaBox = lagnaSign + 1;
  const selectedTheme = selectedBox ? HOUSE_THEMES.find((h) => h.box === selectedBox) : null;
  const selectedTenants = selectedBox ? (boxPlanets[selectedBox] || []) : [];

  const handleReset = () => {
    const empty: Record<string, number | null> = {};
    PLANETS.forEach((p) => { empty[p.key] = null; });
    setPlacements(empty);
    setLagnaSign(6);
    setSelectedBox(null);
    setShowMarker(true);
    setReadMode("house");
  };

  return (
    <div data-interactive="teva-house-reader" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.2.3 — Reading the Teva</p>
            <h2 style={{ margin: "0.2rem 0 0", color: LAL_KITAB_COLOR, fontSize: "1.35rem" }}>
              Teva House Reader
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Click any box to read its fixed themes and tenant planets. Toggle the lagna marker and reading mode to explore correct vs incorrect interpretations.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Presets + toggles */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
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
        <div style={{ width: 1, height: 24, background: HAIRLINE, margin: "0 0.25rem" }} />
        <button
          type="button"
          onClick={() => setShowMarker((v) => !v)}
          style={buttonStyle(showMarker, BLUE)}
        >
          {showMarker ? <Eye size={14} /> : <EyeOff size={14} />}
          Marker
        </button>
        <button
          type="button"
          onClick={() => setReadMode((m) => (m === "house" ? "sign" : "house"))}
          style={buttonStyle(readMode === "house", readMode === "house" ? GREEN : VERMILION)}
        >
          {readMode === "house" ? "House-centric" : "Sign-centric (error demo)"}
        </button>
      </div>

      {/* Main workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 1fr) minmax(300px, 400px)", gap: "1rem", alignItems: "start" }}>
        {/* Teva grid */}
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: LAL_KITAB_DEEP, fontWeight: 950 }}>
              <Grid3x3 size={18} />
              Click a box to read it
            </div>
            {showMarker && (
              <div style={{ fontSize: "0.8rem", color: BLUE, fontWeight: 850 }}>
                Lagna marker: {SHORT_SIGNS[lagnaSign]} (box {lagnaBox})
              </div>
            )}
          </div>
          <NorthIndianSvgChart
            boxPlanets={boxPlanets}
            lagnaMarkerHouse={showMarker ? lagnaBox : null}
            highlightHouse={selectedBox}
            onHouseClick={setSelectedBox}
          />
        </section>

        {/* Detail panel */}
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
          {selectedBox && selectedTheme ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: LAL_KITAB_COLOR, color: "#fff", fontWeight: 950, fontSize: "0.9rem" }}>
                  {selectedBox}
                </span>
                <div>
                  <div style={{ fontWeight: 950, color: LAL_KITAB_DEEP, fontSize: "1.05rem" }}>
                    Box {selectedBox} — {SHORT_SIGNS[selectedBox - 1]}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: INK_MUTED }}>
                    Fixed sign: {selectedTheme.signNature}
                  </div>
                </div>
              </div>

              {/* Fixed themes */}
              <div style={{ padding: "0.75rem", borderRadius: 8, background: `${LAL_KITAB_COLOR}0A`, border: `1px solid ${LAL_KITAB_COLOR}33` }}>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: LAL_KITAB_DEEP, fontWeight: 900, marginBottom: "0.3rem" }}>
                  Fixed house themes
                </div>
                <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
                  {selectedTheme.themes}
                </p>
              </div>

              {/* Tenant planets */}
              <div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: INK_MUTED, fontWeight: 900, marginBottom: "0.3rem" }}>
                  Tenant planets
                </div>
                {selectedTenants.length > 0 ? (
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {selectedTenants.map((p) => (
                      <span
                        key={p.key}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          padding: "0.35rem 0.6rem",
                          borderRadius: 999,
                          background: `${LAL_KITAB_COLOR}18`,
                          border: `1px solid ${LAL_KITAB_COLOR}55`,
                          color: LAL_KITAB_DEEP,
                          fontWeight: 850,
                          fontSize: "0.85rem",
                        }}
                      >
                        <span style={{ fontSize: "0.75rem", fontWeight: 950 }}>{p.abbr}</span>
                        {p.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.88rem", fontStyle: "italic" }}>No planets in this box.</p>
                )}
              </div>

              {/* Combined reading */}
              {selectedTenants.length > 0 && (
                <div style={{ padding: "0.75rem", borderRadius: 8, background: readMode === "house" ? `${GREEN}0A` : `${VERMILION}0A`, border: `1px solid ${readMode === "house" ? GREEN : VERMILION}33` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: readMode === "house" ? GREEN : VERMILION, fontWeight: 900, marginBottom: "0.3rem" }}>
                    {readMode === "house" ? <BookOpen size={14} /> : <ShieldAlert size={14} />}
                    {readMode === "house" ? "House-centric reading (correct)" : "Sign-centric reading (error demo)"}
                  </div>
                  {selectedTenants.map((p) => (
                    <p key={p.key} style={{ margin: "0 0 0.4rem", color: INK_PRIMARY, lineHeight: 1.6, fontSize: "0.88rem" }}>
                      {readMode === "house"
                        ? getCombinedReading(p.key, selectedBox)
                        : `Error: "${p.name} in ${SHORT_SIGNS[selectedBox - 1]}" read as a free-standing sign dignity. This ignores that the planet sits in the fixed ${selectedBox}${selectedBox === 1 ? "st" : selectedBox === 2 ? "nd" : selectedBox === 3 ? "rd" : "th"} house. In the Teva, results flow from the box, not from the sign read independently.`}
                    </p>
                  ))}
                </div>
              )}

              {selectedBox === lagnaBox && showMarker && (
                <div style={{ padding: "0.6rem", borderRadius: 8, background: `${BLUE}0A`, border: `1px solid ${BLUE}33`, display: "flex", gap: "0.4rem", alignItems: "flex-start" }}>
                  <MousePointerClick size={16} color={BLUE} style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
                    <strong style={{ color: BLUE }}>Lagna marker:</strong> This box carries the native's rising sign ({SHORT_SIGNS[lagnaSign]}) as a personality reference. It colours the reading with {SHORT_SIGNS[lagnaSign].toLowerCase()}-type temperament but does <em>not</em> re-label house 1 or re-sort any planet.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem 1rem", color: INK_MUTED }}>
              <Grid3x3 size={32} style={{ marginBottom: "0.5rem", opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: "0.9rem" }}>Click any box on the Teva grid to read its fixed themes and tenant planets.</p>
            </div>
          )}
        </section>
      </div>

      {/* Reading workflow reminder */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Reading workflow</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.5rem", marginTop: "0.5rem" }}>
          <WorkflowStep n={1} text="Read the fixed frame" color={LAL_KITAB_COLOR} />
          <WorkflowStep n={2} text="Locate the planets" color={LAL_KITAB_COLOR} />
          <WorkflowStep n={3} text="Combine house + planet" color={GREEN} />
          <WorkflowStep n={4} text="Layer the lagna marker" color={BLUE} />
          <WorkflowStep n={5} text="Hold the verdict honestly" color={GOLD} />
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────── Grid Component ───────────────────────── */

/* ───────────────────────── SVG Chart Components ───────────────────────── */

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
  lagnaSign?: number;
  lagnaMarkerHouse?: number | null;
  highlightHouse?: number | null;
  onHouseClick?: (houseNum: number) => void;
}

function NorthIndianSvgChart({
  boxPlanets,
  lagnaSign,
  lagnaMarkerHouse,
  highlightHouse,
  onHouseClick,
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
          const isLagna = h === lagnaMarkerHouse;

          const signIdx = lagnaSign !== undefined ? (lagnaSign + h - 1) % 12 : h - 1;
          const signName = SHORT_SIGNS[signIdx];
          const signAbbr = SIGN_ABBRS[signIdx];
          const signNum = signIdx + 1;

          const isHighlighted = h === highlightHouse;
          const polyFill = isHighlighted
            ? `${LAL_KITAB_COLOR}15`
            : isLagna
            ? `${BLUE}0A`
            : "transparent";

          const strokeColor = isHighlighted
            ? LAL_KITAB_COLOR
            : isLagna
            ? BLUE
            : "rgba(168, 120, 48, 0.45)";

          const houseGrahes = boxPlanets[h] || [];
          const hasPlanets = houseGrahes.length > 0;

          return (
            <g
              key={h}
              onClick={onHouseClick ? () => onHouseClick(h) : undefined}
              style={{ cursor: onHouseClick ? "pointer" : "default" }}
            >
              <polygon
                points={HOUSE_POLYGONS[h]}
                fill={polyFill}
                stroke={strokeColor}
                strokeWidth={isHighlighted || isLagna ? 2 : 1.2}
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

function WorkflowStep({ n, text, color }: { n: number; text: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.6rem" }}>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: color, color: "#fff", fontWeight: 950, fontSize: "0.8rem", flexShrink: 0 }}>
        {n}
      </span>
      <span style={{ fontSize: "0.82rem", color: INK_PRIMARY, fontWeight: 700, lineHeight: 1.4 }}>{text}</span>
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
