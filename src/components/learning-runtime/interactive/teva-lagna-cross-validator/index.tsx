"use client";

import { useState, useMemo } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRightLeft,
  BookOpen,
  CheckCircle2,
  Grid3x3,
  RotateCcw,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import {
  SHORT_SIGNS,
  SIGN_ABBRS,
  PLANETS,
  DEMO_CASES,
  TEVA_THEMES,
  CLASSICAL_THEMES,
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

export function TevaLagnaCrossValidator() {
  const [caseIdx, setCaseIdx] = useState(0);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const demo = DEMO_CASES[caseIdx];

  const handleReset = () => {
    setCaseIdx(0);
    setSelectedPlanet(null);
  };

  // Build box contents for Teva
  const tevaBoxes = useMemo(() => {
    const boxes: Record<number, { name: string; abbr: string; key: string }[]> = {};
    PLANETS.forEach((p) => {
      const sign = demo.placements[p.key];
      if (sign !== undefined) {
        const box = sign + 1;
        if (!boxes[box]) boxes[box] = [];
        boxes[box].push({ name: p.name, abbr: p.abbr, key: p.key });
      }
    });
    return boxes;
  }, [demo]);

  // Build box contents for Parashari
  const parashariBoxes = useMemo(() => {
    const boxes: Record<number, { name: string; abbr: string; key: string }[]> = {};
    PLANETS.forEach((p) => {
      const sign = demo.placements[p.key];
      if (sign !== undefined) {
        const houseFromLagna = ((sign - demo.lagnaSign + 12) % 12) + 1;
        if (!boxes[houseFromLagna]) boxes[houseFromLagna] = [];
        boxes[houseFromLagna].push({ name: p.name, abbr: p.abbr, key: p.key });
      }
    });
    return boxes;
  }, [demo]);

  const selPlanet = selectedPlanet ? PLANETS.find((p) => p.key === selectedPlanet) : null;
  const selSign = selectedPlanet ? demo.placements[selectedPlanet] : null;
  const tevaHouse = selSign !== null && selSign !== undefined ? selSign + 1 : null;
  const parashariHouse = selSign !== null && selSign !== undefined ? ((selSign - demo.lagnaSign + 12) % 12) + 1 : null;

  return (
    <div data-interactive="teva-lagna-cross-validator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.2.4 — Teva vs Lagna Cross-Validation</p>
            <h2 style={{ margin: "0.2rem 0 0", color: LAL_KITAB_COLOR, fontSize: "1.35rem" }}>
              Same Nativity, Two Frames
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Explore how the same planets land in different houses across the Teva and the lagna chart. Read each in its own system, then reconcile.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Case selector */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {DEMO_CASES.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setCaseIdx(i); setSelectedPlanet(null); }}
            style={{
              ...buttonStyle(caseIdx === i, LAL_KITAB_COLOR),
              fontSize: "0.82rem",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Planet selector */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "0.78rem", color: INK_MUTED, fontWeight: 900, marginRight: "0.3rem" }}>Select planet:</span>
        {PLANETS.map((p) => {
          const hasPlacement = demo.placements[p.key] !== undefined;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setSelectedPlanet(p.key)}
              disabled={!hasPlacement}
              style={{
                ...buttonStyle(selectedPlanet === p.key, LAL_KITAB_COLOR),
                opacity: hasPlacement ? 1 : 0.35,
                fontSize: "0.8rem",
                padding: "0.4rem 0.55rem",
              }}
            >
              {p.abbr}
            </button>
          );
        })}
      </div>

      {/* Side-by-side grids */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", alignItems: "start" }}>
        {/* Teva */}
        <section style={{ border: `1px solid ${LAL_KITAB_COLOR}44`, borderRadius: 8, background: `${LAL_KITAB_COLOR}0D`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: LAL_KITAB_DEEP, fontWeight: 950, fontSize: "1rem", marginBottom: "0.6rem" }}>
            <Grid3x3 size={16} />
            Lal Kitab Teva
          </div>
          <NorthIndianSvgChart
            boxPlanets={tevaBoxes}
            highlightHouse={tevaHouse}
            frame="teva"
          />
        </section>

        {/* Parashari */}
        <section style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}0A`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: BLUE, fontWeight: 950, fontSize: "1rem", marginBottom: "0.6rem" }}>
            <BookOpen size={16} />
            Parāśarī rāśi chart (D1)
          </div>
          <div style={{ marginBottom: "0.5rem", padding: "0.4rem 0.6rem", borderRadius: 6, background: `${BLUE}15`, border: `1px solid ${BLUE}33`, fontSize: "0.8rem", color: BLUE, fontWeight: 850 }}>
            Lagna: {demo.lagnaName} (house 1)
          </div>
          <NorthIndianSvgChart
            boxPlanets={parashariBoxes}
            lagnaSign={demo.lagnaSign}
            lagnaMarkerHouse={1}
            highlightHouse={parashariHouse}
            frame="parashari"
          />
        </section>
      </div>

      {/* Selected planet detail */}
      {selPlanet && tevaHouse && parashariHouse && (
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
          <div style={{ fontWeight: 950, color: INK_PRIMARY, fontSize: "1.05rem" }}>
            {selPlanet.name} — two frames, one nativity
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.65rem" }}>
            <div style={{ border: `1px solid ${LAL_KITAB_COLOR}44`, borderRadius: 8, background: `${LAL_KITAB_COLOR}0D`, padding: "0.75rem" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: LAL_KITAB_DEEP, fontWeight: 900, marginBottom: "0.3rem" }}>
                Teva reading
              </div>
              <div style={{ fontWeight: 950, color: LAL_KITAB_COLOR, fontSize: "0.95rem" }}>
                {selPlanet.name} in box {tevaHouse} ({SHORT_SIGNS[tevaHouse - 1]})
              </div>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
                Fixed themes: {TEVA_THEMES[tevaHouse]}. Read for Lal Kitab significations and upāya.
              </p>
            </div>

            <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}0A`, padding: "0.75rem" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: BLUE, fontWeight: 900, marginBottom: "0.3rem" }}>
                Classical reading
              </div>
              <div style={{ fontWeight: 950, color: BLUE, fontSize: "0.95rem" }}>
                {selPlanet.name} in {parashariHouse}{parashariHouse === 1 ? "st" : parashariHouse === 2 ? "nd" : parashariHouse === 3 ? "rd" : "th"} house from {demo.lagnaName}
              </div>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
                Lagna-relative themes: {CLASSICAL_THEMES[parashariHouse]}. Read for classical lordship, aspect, yoga.
              </p>
            </div>
          </div>

          <div style={{ padding: "0.65rem", borderRadius: 8, background: `${GREEN}0A`, border: `1px solid ${GREEN}33`, display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <ShieldAlert size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
              <strong style={{ color: GREEN }}>No-conflation discipline:</strong> The {selPlanet.name} is "in the {tevaHouse}{tevaHouse === 1 ? "st" : tevaHouse === 2 ? "nd" : tevaHouse === 3 ? "rd" : "th"} house" (Teva) AND "in the {parashariHouse}{parashariHouse === 1 ? "st" : parashariHouse === 2 ? "nd" : parashariHouse === 3 ? "rd" : "th"} house" (lagna chart) simultaneously — both correct, each within its own frame. Read each in its own system. Never blend.
            </p>
          </div>
        </section>
      )}

      {/* Discipline cards */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Cross-validation disciplines</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.55rem", marginTop: "0.5rem" }}>
          <DisciplineCard icon={<CheckCircle2 size={14} />} text="Read each chart in its own system" color={GREEN} />
          <DisciplineCard icon={<XCircle size={14} />} text="Never conflate the two frames" color={VERMILION} />
          <DisciplineCard icon={<CheckCircle2 size={14} />} text="Convergence = added confidence" color={GREEN} />
          <DisciplineCard icon={<ArrowRightLeft size={14} />} text="Divergence = reconcile carefully" color={GOLD} />
        </div>
      </section>
    </div>
  );
}

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
  frame?: "teva" | "parashari";
}

function NorthIndianSvgChart({
  boxPlanets,
  lagnaSign,
  lagnaMarkerHouse,
  highlightHouse,
  frame = "teva",
}: NorthIndianSvgChartProps) {
  const themeColor = frame === "teva" ? LAL_KITAB_COLOR : BLUE;
  const deepColor = frame === "teva" ? LAL_KITAB_DEEP : BLUE;

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
            ? `${themeColor}15`
            : isLagna
            ? `${themeColor}0A`
            : "transparent";

          const strokeColor = isHighlighted
            ? themeColor
            : isLagna
            ? themeColor
            : "rgba(168, 120, 48, 0.45)";

          const houseGrahes = boxPlanets[h] || [];
          const hasPlanets = houseGrahes.length > 0;

          return (
            <g key={h}>
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
                    <tspan fill={isLagna ? themeColor : deepColor} fontSize={11.5} fontWeight="950">
                      {signNum}
                    </tspan>
                    {isLagna && (
                      <tspan fill={themeColor} fontSize={8.5} fontWeight="900" dx="4">Lg</tspan>
                    )}
                  </text>
                </g>
              ) : (
                // State: House is empty. Stack elements vertically in the center.
                <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                  {frame === "teva" ? (
                    <>
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
                        fill={isLagna ? themeColor : themeColor}
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
                        <tspan fill={isLagna ? themeColor : deepColor} fontSize={11.5} fontWeight="950">
                          {signNum}
                        </tspan>
                        {isLagna && (
                          <tspan fill={themeColor} fontSize={8.5} fontWeight="900" dx="4">Lg</tspan>
                        )}
                      </text>
                    </>
                  ) : (
                    <>
                      {/* House Label */}
                      <text
                        y="-10"
                        fill={INK_SECONDARY}
                        fontSize={10.5}
                        fontWeight="800"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        H{h}
                      </text>

                      {/* Sign Number + Lagna indicator */}
                      <text
                        y="10"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        <tspan fill={isLagna ? themeColor : deepColor} fontSize={11.5} fontWeight="950">
                          {signNum}
                        </tspan>
                        {isLagna && (
                          <tspan fill={themeColor} fontSize={8.5} fontWeight="900" dx="4">Lg</tspan>
                        )}
                      </text>
                    </>
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

                    const badgeFill = themeColor;
                    const badgeStroke = themeColor;
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

function DisciplineCard({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.6rem" }}>
      <span style={{ color, flexShrink: 0 }}>{icon}</span>
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
