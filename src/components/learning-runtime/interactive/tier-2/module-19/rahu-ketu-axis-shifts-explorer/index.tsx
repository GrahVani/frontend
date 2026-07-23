"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type AxisIndex = 0 | 1 | 2 | 3 | 4 | 5;
type ScenarioChoice = "yes" | "no" | null;
type MistakeKey = "readBoth" | "reversalNotReturn" | "eclipseScope";
type SensitiveKey = "moon" | "sun" | "lagna" | "dasha";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const RAHU = "#5A5C68";
const KETU = "#7A3E4A";
const MOON = "#5A6B8A";
const SUN = "#E8B845";
const LAGNA = "#356CAB";
const DASHA = "#2F7D55";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const AXES = [
  { houses: [1, 7], label: "Self vs Other", theme: "relationship tensions, identity/partnership reconfiguration" },
  { houses: [2, 8], label: "Wealth vs Transformation", theme: "resource redistribution, inheritance, sudden change" },
  { houses: [3, 9], label: "Effort vs Grace", theme: "siblings, travel, dharma reconfiguration" },
  { houses: [4, 10], label: "Home vs Career", theme: "family/profession tensions and transitions" },
  { houses: [5, 11], label: "Children vs Gains", theme: "speculation, creative output, networks" },
  { houses: [6, 12], label: "Service vs Spirituality", theme: "daily work/meditation; chronic issues and release" },
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  readBoth: {
    label: "Read both houses of the axis together",
    heldText: "Held: Rāhu's house and Ketu's house are interpreted as one polarity, not two separate events.",
    releasedText: "Warning: reporting only Rāhu's house ignores Ketu's release half of the axis.",
  },
  reversalNotReturn: {
    label: "Same axis is not the same configuration",
    heldText: "Held: a polarity reversal swaps which node occupies which house, changing the emphasis.",
    releasedText: "Warning: treating a reversed return as a comfortable birth-repeat misses the polarity swap.",
  },
  eclipseScope: {
    label: "Do not reconstruct eclipse criteria from memory",
    heldText: "Held: eclipse-specific filters are inherited from T1-11 and consulted directly, not guessed.",
    releasedText: "Warning: this lesson does not independently establish eclipse-relevance criteria.",
  },
};

function mod12(n: number) {
  return ((n % 12) + 12) % 12;
}

function opposite(index: number) {
  return mod12(index + 6);
}

function houseFromSign(lagnaIndex: number, signIndex: number) {
  return mod12(signIndex - lagnaIndex) + 1;
}

function signAtHouse(lagnaIndex: number, house: number) {
  return mod12(lagnaIndex + house - 1);
}

function pointOnCircle(index: number, radius: number, cx: number, cy: number) {
  const angle = (index * 30 - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function sectorPath(index: number, innerR: number, outerR: number, cx: number, cy: number) {
  const startAngle = (index * 30 - 105) * (Math.PI / 180);
  const endAngle = (index * 30 - 75) * (Math.PI / 180);
  const p1 = {
    x: cx + innerR * Math.cos(startAngle),
    y: cy + innerR * Math.sin(startAngle),
  };
  const p2 = {
    x: cx + outerR * Math.cos(startAngle),
    y: cy + outerR * Math.sin(startAngle),
  };
  const p3 = {
    x: cx + outerR * Math.cos(endAngle),
    y: cy + outerR * Math.sin(endAngle),
  };
  const p4 = {
    x: cx + innerR * Math.cos(endAngle),
    y: cy + innerR * Math.sin(endAngle),
  };
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${outerR} ${outerR} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR} ${innerR} 0 0 0 ${p1.x} ${p1.y} Z`;
}

export function RahuKetuAxisShiftsExplorer() {
  const [lagnaIndex, setLagnaIndex] = useState<number>(3); // Cancer
  const [moonIndex, setMoonIndex] = useState<number>(8); // Sagittarius
  const [sunIndex, setSunIndex] = useState<number>(4); // Leo placeholder
  const [natalRahuIndex, setNatalRahuIndex] = useState<number>(2); // Gemini
  const [transitRahuIndex, setTransitRahuIndex] = useState<number>(8); // Sagittarius
  const [dashaLordIndex, setDashaLordIndex] = useState<number>(8); // Moon
  const [selectedAxis, setSelectedAxis] = useState<AxisIndex>(5); // 6-12
  const [scenario, setScenario] = useState<ScenarioChoice>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    readBoth: true, reversalNotReturn: true, eclipseScope: true,
  });

  const natalKetuIndex = useMemo(() => opposite(natalRahuIndex), [natalRahuIndex]);
  const transitKetuIndex = useMemo(() => opposite(transitRahuIndex), [transitRahuIndex]);

  const transitRahuHouse = useMemo(() => houseFromSign(lagnaIndex, transitRahuIndex), [lagnaIndex, transitRahuIndex]);
  const transitKetuHouse = useMemo(() => houseFromSign(lagnaIndex, transitKetuIndex), [lagnaIndex, transitKetuIndex]);
  const natalRahuHouse = useMemo(() => houseFromSign(lagnaIndex, natalRahuIndex), [lagnaIndex, natalRahuIndex]);
  const natalKetuHouse = useMemo(() => houseFromSign(lagnaIndex, natalKetuIndex), [lagnaIndex, natalKetuIndex]);
  const axisHouses = AXES[selectedAxis].houses;
  const axisSigns = axisHouses.map((h) => signAtHouse(lagnaIndex, h));

  const transitOnSelectedAxis = axisHouses.includes(transitRahuHouse) && axisHouses.includes(transitKetuHouse);
  const polarityReversed = transitRahuIndex === natalKetuIndex && transitKetuIndex === natalRahuIndex;
  const sameAxisAsNatal = natalRahuHouse === transitKetuHouse && natalKetuHouse === transitRahuHouse;

  const sensitiveHits = useMemo(() => {
    const hits: { key: SensitiveKey; label: string; effect: string }[] = [];
    if (transitRahuIndex === moonIndex) hits.push({ key: "moon", label: "Natal Moon", effect: "turbulent mental/emotional period" });
    if (transitRahuIndex === sunIndex) hits.push({ key: "sun", label: "Natal Sun", effect: "ego-restructuring" });
    if (transitRahuIndex === lagnaIndex) hits.push({ key: "lagna", label: "Natal Lagna", effect: "identity transformation" });
    if (transitRahuIndex === dashaLordIndex) hits.push({ key: "dasha", label: "Running daśā-lord", effect: "major event-trigger" });
    return hits;
  }, [transitRahuIndex, moonIndex, sunIndex, lagnaIndex, dashaLordIndex]);

  const moonHit = transitRahuIndex === moonIndex;
  const dashaReinforcement = moonHit && dashaLordIndex === moonIndex;

  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setLagnaIndex(3);
    setMoonIndex(8);
    setSunIndex(4);
    setNatalRahuIndex(2);
    setTransitRahuIndex(8);
    setDashaLordIndex(8);
    setSelectedAxis(5);
    setScenario(null);
    setMistakes({ readBoth: true, reversalNotReturn: true, eclipseScope: true });
  }

  function loadKavya() {
    setLagnaIndex(3);
    setMoonIndex(8);
    setSunIndex(4);
    setNatalRahuIndex(2);
    setTransitRahuIndex(8);
    setDashaLordIndex(8);
    setSelectedAxis(5);
  }

  return (
    <div data-interactive="rahu-ketu-axis-shifts-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Nodal triggers</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem", fontWeight: 600 }}>
              Rāhu-Ketu axis shifts explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Apply T1-11&apos;s six house-pair axes and sensitive-point hits to a polarity-reversed nodal return. Read the axis, flag the Moon hit, and keep eclipse scope honest.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Whole-sign nodal wheel</p>
          <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
            Natal anchors and transiting nodes
          </h3>
          <NodalWheelSvg
            lagnaIndex={lagnaIndex}
            moonIndex={moonIndex}
            sunIndex={sunIndex}
            natalRahuIndex={natalRahuIndex}
            natalKetuIndex={natalKetuIndex}
            transitRahuIndex={transitRahuIndex}
            transitKetuIndex={transitKetuIndex}
            dashaLordIndex={dashaLordIndex}
            highlightedSigns={axisSigns}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button type="button" onClick={loadKavya} style={buttonStyle(false, PURPLE)}>
              Load Kavya (6-12 axis reversal, Moon hit)
            </button>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Selectors" icon={<Lightbulb size={18} />} color={PURPLE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <SelectRow label="Lagna sign" value={lagnaIndex} onChange={setLagnaIndex} />
              <SelectRow label="Natal Moon sign" value={moonIndex} onChange={setMoonIndex} />
              <SelectRow label="Natal Sun sign" value={sunIndex} onChange={setSunIndex} />
              <SelectRow label="Natal Rāhu sign" value={natalRahuIndex} onChange={setNatalRahuIndex} />
              <SelectRow label="Transiting Rāhu sign" value={transitRahuIndex} onChange={setTransitRahuIndex} />
              <SelectRow label="Running daśā-lord sign" value={dashaLordIndex} onChange={setDashaLordIndex} />
            </div>
          </Panel>

          <Panel title="Selected axis" icon={<CheckCircle2 size={18} />} color={GOLD}>
            <div style={{ color: GOLD, fontWeight: 600, fontSize: "1.1rem" }}>
              Houses {axisHouses[0]}–{axisHouses[1]}: {AXES[selectedAxis].label}
            </div>
            <div style={{ color: INK_SECONDARY, marginTop: "0.35rem" }}>{AXES[selectedAxis].theme}</div>
          </Panel>

          <Panel title="Result" icon={<CheckCircle2 size={18} />} color={transitOnSelectedAxis ? GREEN : INK_MUTED}>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              <div style={{ color: transitOnSelectedAxis ? GREEN : INK_MUTED, fontWeight: 600 }}>
                {transitOnSelectedAxis
                  ? `Transiting nodes are on the ${axisHouses[0]}–${axisHouses[1]} axis`
                  : "Transiting nodes are not on the selected axis"}
              </div>
              {sameAxisAsNatal && (
                <div style={{ color: PURPLE }}>
                  This is a nodal-axis reversal relative to the natal nodes.
                </div>
              )}
              {polarityReversed && (
                <div style={{ color: VERMILION }}>
                  Polarity is swapped: transiting Rāhu sits where natal Ketu was, and vice versa.
                </div>
              )}
              {sensitiveHits.length > 0 && (
                <div style={{ marginTop: "0.35rem" }}>
                  <div style={{ color: INK_SECONDARY, marginBottom: "0.25rem" }}>Sensitive-point hits:</div>
                  {sensitiveHits.map((hit) => (
                    <div key={hit.key} style={{ color: hit.key === "moon" ? VERMILION : INK_SECONDARY }}>
                      {hit.label}: {hit.effect}
                    </div>
                  ))}
                </div>
              )}
              {dashaReinforcement && (
                <div style={{ color: GREEN, marginTop: "0.35rem" }}>
                  Daśā reinforcement: the touched planet (Moon) is also the running Mahādaśā lord.
                </div>
              )}
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Six house-pair axes</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Select the axis the transiting nodes activate
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
          {AXES.map((axis, idx) => {
            const active = selectedAxis === idx;
            return (
              <button
                key={axis.label}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedAxis(idx as AxisIndex)}
                style={{
                  textAlign: "left",
                  border: `1px solid ${active ? PURPLE : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${PURPLE}14` : SURFACE,
                  color: active ? PURPLE : INK_PRIMARY,
                  padding: "0.75rem",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600 }}>Houses {axis.houses[0]}–{axis.houses[1]}</div>
                <div style={{ color: active ? PURPLE : INK_SECONDARY, fontSize: "0.92rem", marginTop: "0.2rem" }}>{axis.label}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Polarity check</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Is a nodal-axis reversal a comfortable return to birth conditions?
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          A learner says: &ldquo;The nodes have returned to Kavya&apos;s own natal axis, so this transit should feel like a comfortable repeat of birth conditions.&rdquo;
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={scenario === "yes"}
            onClick={() => setScenario("yes")}
            style={scenarioButtonStyle(scenario === "yes", VERMILION)}
          >
            Yes — same axis means same pattern
          </button>
          <button
            type="button"
            aria-pressed={scenario === "no"}
            onClick={() => setScenario("no")}
            style={scenarioButtonStyle(scenario === "no", GREEN)}
          >
            No — the nodes have swapped polarity
          </button>
        </div>
        {scenario && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: scenario === "no" ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${scenario === "no" ? GREEN : VERMILION}55`,
              color: scenario === "no" ? GREEN : VERMILION,
            }}
          >
            {scenario === "no"
              ? "Correct. The nodes occupy the same house pair, but Rāhu and Ketu have swapped places. Grasping now concentrates where release used to dominate, and release now operates where grasping used to dominate."
              : "Incorrect. Same axis is not the same configuration. A polarity reversal changes which node&apos;s themes dominate which house, even though the house pair is identical."}
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Eclipse scope</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Eclipses are intensified nodal-axis transits
        </h3>
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Structurally, an eclipse is an intensified instance of a nodal-axis transit. The axis-reading discipline above is therefore the right starting frame for any eclipse that falls near this window.
        </p>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          The specific criteria for which eclipses deserve special weight are T1-11 Lesson 11.4.3&apos;s own content. This lesson did not read that source in full, so those filters are not reconstructed here.
        </p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const held = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={held}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !held }))}
                style={togglePanelStyle(held, held ? GREEN : VERMILION)}
              >
                {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <span style={{ fontWeight: 600 }}>{MISTAKES[key].label}</span>
                  <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? MISTAKES[key].heldText : MISTAKES[key].releasedText}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 8,
            background: allMistakesHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allMistakesHeld ? GREEN : VERMILION}55`,
            color: allMistakesHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allMistakesHeld
            ? "All discipline commitments are held. The nodal axis is read as a polarity, not a single point, and eclipse scope is kept honest."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function SelectRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label style={{ color: INK_SECONDARY }}>
      {label}
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} style={selectStyle}>
        {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
      </select>
    </label>
  );
}

function NodalWheelSvg({
  lagnaIndex,
  moonIndex,
  sunIndex,
  natalRahuIndex,
  natalKetuIndex,
  transitRahuIndex,
  transitKetuIndex,
  dashaLordIndex,
  highlightedSigns,
}: {
  lagnaIndex: number;
  moonIndex: number;
  sunIndex: number;
  natalRahuIndex: number;
  natalKetuIndex: number;
  transitRahuIndex: number;
  transitKetuIndex: number;
  dashaLordIndex: number;
  highlightedSigns: number[];
}) {
  const cx = 180;
  const cy = 180;
  const outerR = 158;
  const innerR = 92;

  const signMarkers: Record<number, { label: string; color: string; ring: boolean; key: string }[]> = {};
  function add(sign: number, label: string, color: string, ring: boolean, key: string) {
    if (!signMarkers[sign]) signMarkers[sign] = [];
    signMarkers[sign].push({ label, color, ring, key });
  }

  add(lagnaIndex, "La", LAGNA, false, "lagna");
  add(moonIndex, "Mo", MOON, false, "moon");
  add(sunIndex, "Su", SUN, false, "sun");
  add(natalRahuIndex, "nRa", RAHU, false, "natal-rahu");
  add(natalKetuIndex, "nKe", KETU, false, "natal-ketu");
  add(transitRahuIndex, "tRa", RAHU, true, "transit-rahu");
  add(transitKetuIndex, "tKe", KETU, true, "transit-ketu");
  add(dashaLordIndex, "Da", DASHA, false, "dasha");

  const markerOffsets: Record<number, number[]> = {
    1: [0],
    2: [-12, 12],
    3: [-20, 0, 20],
    4: [-28, -8, 8, 28],
    5: [-32, -16, 0, 16, 32],
    6: [-36, -20, -6, 6, 20, 36],
    7: [-40, -24, -10, 0, 10, 24, 40],
    8: [-44, -28, -14, -4, 4, 14, 28, 44],
  };

  return (
    <svg viewBox="0 0 360 390" role="img" aria-label="Whole-sign nodal axis wheel" style={{ width: "100%", maxHeight: 390, margin: "0.55rem auto 0.25rem", display: "block" }}>
      <circle cx={cx} cy={cy} r={outerR + 6} fill="transparent" stroke={HAIRLINE} strokeWidth="1.5" />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + outerR * Math.cos((i * 30 - 90) * (Math.PI / 180))}
          y2={cy + outerR * Math.sin((i * 30 - 90) * (Math.PI / 180))}
          stroke={HAIRLINE}
          strokeWidth="1"
        />
      ))}
      {highlightedSigns.map((sign) => (
        <path
          key={`highlight-${sign}`}
          d={sectorPath(sign, innerR - 8, outerR + 4, cx, cy)}
          fill={`${PURPLE}14`}
          stroke={PURPLE}
          strokeWidth="1.5"
        />
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const house = houseFromSign(lagnaIndex, i);
        const labelPos = pointOnCircle(i, outerR + 22, cx, cy);
        return (
          <g key={`sign-${i}`}>
            <text x={labelPos.x} y={labelPos.y - 2} textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>
              {SIGNS[i].slice(0, 3)}
            </text>
            <text x={labelPos.x} y={labelPos.y + 8} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight={600}>
              H{house}
            </text>
          </g>
        );
      })}
      {/* Natal axis line */}
      <line
        x1={cx + innerR * Math.cos((natalRahuIndex * 30 - 90) * (Math.PI / 180))}
        y1={cy + innerR * Math.sin((natalRahuIndex * 30 - 90) * (Math.PI / 180))}
        x2={cx + innerR * Math.cos((natalKetuIndex * 30 - 90) * (Math.PI / 180))}
        y2={cy + innerR * Math.sin((natalKetuIndex * 30 - 90) * (Math.PI / 180))}
        stroke={INK_MUTED}
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      {/* Transit axis line */}
      <line
        x1={cx + (innerR - 4) * Math.cos((transitRahuIndex * 30 - 90) * (Math.PI / 180))}
        y1={cy + (innerR - 4) * Math.sin((transitRahuIndex * 30 - 90) * (Math.PI / 180))}
        x2={cx + (innerR - 4) * Math.cos((transitKetuIndex * 30 - 90) * (Math.PI / 180))}
        y2={cy + (innerR - 4) * Math.sin((transitKetuIndex * 30 - 90) * (Math.PI / 180))}
        stroke={PURPLE}
        strokeWidth="2"
      />
      {/* Center Lagna glyph */}
      <circle cx={cx} cy={cy} r={22} fill="#FBF5E8" stroke={LAGNA} strokeWidth="2" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill={LAGNA} fontSize="10" fontWeight={600}>Lagna</text>
      {/* Markers */}
      {Object.entries(signMarkers).map(([signStr, markers]) => {
        const sign = Number(signStr);
        const offsets = markerOffsets[markers.length] || markerOffsets[8];
        return markers.map((m, idx) => {
          const offset = offsets[idx] ?? 0;
          const pos = pointOnCircle(sign + offset / 30, innerR - 26, cx, cy);
          return (
            <g key={m.key}>
              <circle cx={pos.x} cy={pos.y} r={m.ring ? 15 : 12} fill="#FBF5E8" stroke={m.color} strokeWidth={m.ring ? 3 : 2} />
              <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill={m.color} fontSize="8" fontWeight={600}>
                {m.label}
              </text>
            </g>
          );
        });
      })}
      {/* Legend */}
      <g transform="translate(10, 350)">
        <LegendItem color={RAHU} label="natal Rāhu" x={0} />
        <LegendItem color={KETU} label="natal Ketu" x={70} />
        <LegendItem color={RAHU} ring label="transit Rāhu" x={135} />
        <LegendItem color={KETU} ring label="transit Ketu" x={215} />
        <LegendItem color={MOON} label="Moon" x={290} />
      </g>
      <g transform="translate(10, 368)">
        <LegendItem color={SUN} label="Sun" x={0} />
        <LegendItem color={LAGNA} label="Lagna" x={55} />
        <LegendItem color={DASHA} label="daśā lord" x={110} />
      </g>
    </svg>
  );
}

function LegendItem({ color, label, x, ring }: { color: string; label: string; x: number; ring?: boolean }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx="6" cy="-4" r={ring ? 6 : 5} fill="#FBF5E8" stroke={color} strokeWidth={ring ? 2 : 1.5} />
      <text x="16" y="-1" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>{label}</text>
    </g>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

const selectStyle: CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: "0.35rem",
  background: SURFACE,
  color: INK_PRIMARY,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.45rem 0.75rem",
  fontWeight: 600,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function scenarioButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
