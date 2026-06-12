"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Grid3x3,
  MousePointerClick,
  RotateCcw,
  XCircle,
} from "lucide-react";
import {
  SIGNS,
  SHORT_SIGNS,
  SIGN_ABBRS,
  GRAHAS,
  DEMO_PLACEMENTS,
  QUIZ_ITEMS,
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

type TabKey = "frame" | "demo" | "drop" | "quiz";

const TABS: { key: TabKey; label: string; icon: ReactNode }[] = [
  { key: "frame", label: "Fixed frame", icon: <Grid3x3 size={16} /> },
  { key: "demo", label: "Lagna demo", icon: <BookOpen size={16} /> },
  { key: "drop", label: "Planet drop", icon: <MousePointerClick size={16} /> },
  { key: "quiz", label: "Quiz", icon: <CheckCircle2 size={16} /> },
];

export function LalKitabTevaDoctrineExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("frame");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("frame");
  };

  return (
    <div data-interactive="lal-kitab-teva-doctrine-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.2.1 — The Fixed-Aries Doctrine</p>
            <h2 style={{ margin: "0.2rem 0 0", color: LAL_KITAB_COLOR, fontSize: "1.35rem" }}>
              Lal Kitab Teva — Fixed Frame & Planet Placement
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Explore the fixed-Aries Teva grid, see how the lagna shifts planet positions, and practise reading house N as sign N.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Tab strip */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            aria-pressed={activeTab === tab.key}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              border: `1px solid ${activeTab === tab.key ? LAL_KITAB_COLOR : HAIRLINE}`,
              borderRadius: 8,
              background: activeTab === tab.key ? LAL_KITAB_COLOR : "transparent",
              color: activeTab === tab.key ? "#fff" : INK_SECONDARY,
              padding: "0.52rem 0.85rem",
              fontWeight: 850,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div key={resetKey}>
        {activeTab === "frame" && <FrameTab />}
        {activeTab === "demo" && <DemoTab />}
        {activeTab === "drop" && <DropTab />}
        {activeTab === "quiz" && <QuizTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Frame Tab ───────────────────────── */

function FrameTab() {
  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>The fixed Teva frame</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          House number equals sign number in every box. This frame is identical for every native.
        </p>
      </div>

      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1.25rem" }}>
        <NorthIndianSvgChart />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem" }}>
        <FactCard label="Rule" value="House 1 = Aries" note="Always. For everyone. Regardless of lagna." color={LAL_KITAB_COLOR} />
        <FactCard label="Mapping" value="House N = Sign N" note="7th house = Libra (sign 7); 10th = Capricorn (sign 10)." color={BLUE} />
        <FactCard label="Lagna role" value="Shifts planet positions" note="Determines which fixed house each planet falls into." color={GREEN} />
        <FactCard label="Read" value="House N as Sign N" note="A planet in house 5 carries Leo's signification." color={GOLD} />
      </div>
    </section>
  );
}

/* ───────────────────────── Demo Tab ───────────────────────── */

function DemoTab() {
  const [demoIdx, setDemoIdx] = useState(0);
  const demo = DEMO_PLACEMENTS[demoIdx];

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Lagna demo — two frames, same native</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Select a lagna to see how the same planet positions appear in the Parāśarī rāśi chart versus the Lal Kitab Teva.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
          {DEMO_PLACEMENTS.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setDemoIdx(i)}
              style={{
                ...buttonStyle(demoIdx === i, LAL_KITAB_COLOR),
                fontSize: "0.85rem",
              }}
            >
              {d.lagnaName} lagna
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", alignItems: "start" }}>
        {/* Parāśarī chart */}
        <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}0A`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: BLUE, fontWeight: 950, fontSize: "1rem", marginBottom: "0.6rem" }}>
            <BookOpen size={16} />
            Parāśarī rāśi chart (D1)
          </div>
          <div style={{ marginBottom: "0.6rem", padding: "0.5rem", borderRadius: 6, background: `${BLUE}15`, border: `1px solid ${BLUE}33` }}>
            <span style={{ color: BLUE, fontWeight: 950, fontSize: "0.85rem" }}>Lagna: {demo.lagnaName}</span>
            <span style={{ color: INK_MUTED, fontSize: "0.8rem", marginLeft: "0.5rem" }}>(rising sign = house 1)</span>
          </div>
          <NorthIndianSvgChart lagnaSign={demo.lagnaSign} placements={demo.placements} />
        </div>

        {/* Teva chart */}
        <div style={{ border: `1px solid ${LAL_KITAB_COLOR}44`, borderRadius: 8, background: `${LAL_KITAB_COLOR}0D`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: LAL_KITAB_DEEP, fontWeight: 950, fontSize: "1rem", marginBottom: "0.6rem" }}>
            <Grid3x3 size={16} />
            Lal Kitab Teva
          </div>
          <div style={{ marginBottom: "0.6rem", padding: "0.5rem", borderRadius: 6, background: `${LAL_KITAB_COLOR}15`, border: `1px solid ${LAL_KITAB_COLOR}33` }}>
            <span style={{ color: LAL_KITAB_DEEP, fontWeight: 950, fontSize: "0.85rem" }}>Lagna marker: {demo.lagnaName}</span>
            <span style={{ color: INK_MUTED, fontSize: "0.8rem", marginLeft: "0.5rem" }}>(Aries = house 1 always)</span>
          </div>
          <NorthIndianSvgChart placements={demo.placements} />
        </div>
      </div>

      {/* Placement notes */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ ...eyebrowStyle, marginBottom: "0.5rem" }}>Planet placements</p>
        <div style={{ display: "grid", gap: "0.45rem" }}>
          {demo.placements.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
              <ArrowRight size={14} color={LAL_KITAB_COLOR} />
              <span style={{ color: INK_PRIMARY }}>{p.graha}</span>
              <span style={{ color: INK_MUTED }}>{p.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Drop Tab ───────────────────────── */

function DropTab() {
  const [grahaIdx, setGrahaIdx] = useState(0);
  const [houseNum, setHouseNum] = useState(1);

  const graha = GRAHAS[grahaIdx];
  const tevaSign = SHORT_SIGNS[houseNum - 1];
  const tevaSignFull = SIGNS[houseNum - 1];

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Planet drop simulator</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Select a planet and its actual house position (counted from the lagna). See where it lands in the Teva and what sign to read it with.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", alignItems: "start" }}>
        {/* Controls */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
          <div>
            <label style={labelStyle}>Planet</label>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {GRAHAS.map((g, i) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setGrahaIdx(i)}
                  style={{
                    ...buttonStyle(grahaIdx === i, LAL_KITAB_COLOR),
                    fontSize: "0.82rem",
                    padding: "0.42rem 0.55rem",
                  }}
                >
                  {g.abbr}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>House from lagna</label>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHouseNum(h)}
                  style={{
                    ...buttonStyle(houseNum === h, BLUE),
                    fontSize: "0.82rem",
                    padding: "0.42rem 0.55rem",
                    minWidth: 36,
                    justifyContent: "center",
                  }}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <div style={{ border: `1px solid ${LAL_KITAB_COLOR}44`, borderRadius: 8, background: `${LAL_KITAB_COLOR}0D`, padding: "1rem", display: "grid", gap: "0.6rem" }}>
          <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: LAL_KITAB_DEEP, fontWeight: 900 }}>Result</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 950, color: INK_PRIMARY }}>
            {graha.name} drops into <span style={{ color: LAL_KITAB_COLOR }}>Teva house {houseNum}</span>
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 850, color: LAL_KITAB_DEEP }}>
            Read as <span style={{ color: LAL_KITAB_COLOR }}>{tevaSignFull}</span>
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.87rem" }}>
            The lagna placed {graha.name} in house {houseNum}. The Teva's house {houseNum} is always {tevaSign} (sign {houseNum}). Read house N as sign N.
          </p>
        </div>
      </div>

      {/* Mini Teva with highlight */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <NorthIndianSvgChart highlightHouse={houseNum} highlightGraha={graha.abbr} />
      </div>
    </section>
  );
}

/* ───────────────────────── Quiz Tab ───────────────────────── */

function QuizTab() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleReveal = (id: number) => {
    setRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const correctCount = QUIZ_ITEMS.filter((q) => {
    const ans = answers[q.id]?.trim().toLowerCase();
    return ans && q.answer.toLowerCase().includes(ans);
  }).length;

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Quick quiz</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
              Type your answer, then reveal the explanation.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: GOLD, fontWeight: 950, fontSize: "0.9rem" }}>
            <CheckCircle2 size={18} />
            {correctCount} / {QUIZ_ITEMS.length} matched
          </div>
        </div>
      </div>

      {QUIZ_ITEMS.map((item) => {
        const show = revealed[item.id];
        const userAns = answers[item.id] || "";
        const isMatch = userAns.trim().length > 0 && item.answer.toLowerCase().includes(userAns.trim().toLowerCase());

        return (
          <article key={item.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <BookOpen size={14} />
              Question {item.id}
            </div>
            <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.93rem", lineHeight: 1.5 }}>{item.question}</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <input
                type="text"
                value={userAns}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [item.id]: e.target.value }))}
                placeholder="Type your answer..."
                style={{
                  flex: 1,
                  minWidth: 200,
                  border: `1px solid ${show ? (isMatch ? GREEN : VERMILION) : HAIRLINE}`,
                  borderRadius: 8,
                  background: "rgba(255,251,241,0.78)",
                  color: INK_PRIMARY,
                  padding: "0.55rem 0.65rem",
                  fontWeight: 850,
                }}
              />
              <button type="button" onClick={() => handleReveal(item.id)} style={buttonStyle(false, BLUE)}>
                Reveal
              </button>
            </div>
            {show && (
              <div
                style={{
                  border: `1px solid ${isMatch ? GREEN : VERMILION}44`,
                  borderRadius: 8,
                  background: `${isMatch ? GREEN : VERMILION}0D`,
                  padding: "0.65rem",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                }}
              >
                {isMatch ? (
                  <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <XCircle size={18} color={VERMILION} style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div>
                  <div style={{ fontWeight: 950, color: isMatch ? GREEN : VERMILION, fontSize: "0.88rem" }}>
                    {isMatch ? "Correct" : `Answer: ${item.answer}`}
                  </div>
                  <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{item.explanation}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
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

const HOUSE_LABEL_POSITIONS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 35 },
  2: { x: 105, y: 35 },
  3: { x: 35, y: 80 },
  4: { x: 35, y: 200 },
  5: { x: 35, y: 320 },
  6: { x: 105, y: 365 },
  7: { x: 200, y: 365 },
  8: { x: 295, y: 365 },
  9: { x: 365, y: 320 },
  10: { x: 365, y: 200 },
  11: { x: 365, y: 80 },
  12: { x: 295, y: 35 },
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
  lagnaSign?: number;
  highlightHouse?: number | null;
  highlightGraha?: string;
  placements?: { graha: string; houseFromLagna: number }[];
}

function NorthIndianSvgChart({
  lagnaSign,
  highlightHouse,
  highlightGraha,
  placements = [],
}: NorthIndianSvgChartProps) {
  const placementMap = new Map<number, string[]>();
  placements.forEach((p) => {
    const house = p.houseFromLagna;
    const list = placementMap.get(house) || [];
    list.push(p.graha);
    placementMap.set(house, list);
  });

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
          const isLagnaHouse = h === 1;
          const signIdx = lagnaSign !== undefined ? (lagnaSign + h - 1) % 12 : h - 1;
          const signName = SHORT_SIGNS[signIdx];
          const signAbbr = SIGN_ABBRS[signIdx];
          const signNum = signIdx + 1;

          const isHighlighted = highlightHouse === h;
          const polyFill = isHighlighted
            ? `${LAL_KITAB_COLOR}15`
            : isLagnaHouse
            ? (lagnaSign !== undefined ? `${BLUE}0A` : `${LAL_KITAB_COLOR}0A`)
            : "transparent";

          const strokeColor = isHighlighted
            ? LAL_KITAB_COLOR
            : isLagnaHouse
            ? (lagnaSign !== undefined ? BLUE : LAL_KITAB_COLOR)
            : "rgba(168, 120, 48, 0.45)";

          const houseGrahes = placementMap.get(h) || [];
          const hasPlanets = houseGrahes.length > 0;

          return (
            <g key={h}>
              <polygon
                points={HOUSE_POLYGONS[h]}
                fill={polyFill}
                stroke={strokeColor}
                strokeWidth={isHighlighted || isLagnaHouse ? 2 : 1.2}
                style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
              />

              {hasPlanets ? (
                // State: House has planets. Place labels in the corners to avoid overlaps.
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

                  {/* Sign number */}
                  <text
                    x={HOUSE_SIGN_NUM_POS[h].x}
                    y={HOUSE_SIGN_NUM_POS[h].y}
                    fill={isLagnaHouse ? (lagnaSign !== undefined ? BLUE : LAL_KITAB_DEEP) : INK_SECONDARY}
                    fontSize={11.5}
                    fontWeight="950"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {signNum}
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
                    fill={isLagnaHouse ? (lagnaSign !== undefined ? BLUE : LAL_KITAB_COLOR) : INK_PRIMARY}
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

                  {/* Sign Number */}
                  <text
                    y="24"
                    fill={isLagnaHouse ? (lagnaSign !== undefined ? BLUE : LAL_KITAB_DEEP) : INK_SECONDARY}
                    fontSize={11.5}
                    fontWeight="950"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {signNum}
                  </text>
                </g>
              )}

              {/* Draw planet badges */}
              {hasPlanets && (
                <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                  {houseGrahes.map((gName, pIdx) => {
                    const grahaObj = GRAHAS.find((g) => g.name === gName);
                    const grahaAbbr = grahaObj ? grahaObj.abbr : gName.slice(0, 2);
                    const isHighlightGraha = highlightGraha === grahaAbbr;

                    const badgeW = 28;
                    const badgeH = 18;
                    const gap = 3;
                    const totalW = houseGrahes.length * badgeW + (houseGrahes.length - 1) * gap;
                    const startX = -totalW / 2 + badgeW / 2;
                    const xOffset = startX + pIdx * (badgeW + gap);

                    const badgeFill = isHighlightGraha
                      ? LAL_KITAB_COLOR
                      : "rgba(255, 251, 241, 0.95)";
                    const badgeStroke = isHighlightGraha
                      ? LAL_KITAB_COLOR
                      : "rgba(184, 132, 33, 0.4)";
                    const textFill = isHighlightGraha ? "#fff" : INK_PRIMARY;

                    return (
                      <g key={gName} transform={`translate(${xOffset}, 0)`}>
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

/* ───────────────────────── Shared styles ───────────────────────── */

function FactCard({ label, value, note, color }: { label: string; value: string; note: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.75rem" }}>
      <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: INK_MUTED, fontWeight: 900 }}>{label}</div>
      <div style={{ marginTop: "0.35rem", fontWeight: 950, color: INK_PRIMARY, fontSize: "0.95rem" }}>{value}</div>
      <div style={{ marginTop: "0.15rem", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.4 }}>{note}</div>
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

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: "0.35rem",
  color: INK_MUTED,
  fontWeight: 900,
  fontSize: "0.76rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
