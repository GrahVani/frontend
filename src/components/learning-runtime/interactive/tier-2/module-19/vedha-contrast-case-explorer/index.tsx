"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type Scenario = "actual" | "contrast";
type Reading = "transit-only" | "natal-inclusive";
type AshtaScenario = "yes" | "no" | null;
type MistakeKey = "mistakeContrast" | "ashtaResolves" | "collapseStatuses";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const AMBER = "#B88421";
const MOON = "#5A6B8A";
const SATURN = "#5A5C68";
const MARS = "#C8412E";
const JUPITER = "#2F7D55";

const SIGNS_FROM_MOON = [
  "Sagittarius", "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus",
  "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio",
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  mistakeContrast: {
    label: "Label the contrast case as illustrative, not Kavya's actual chart",
    heldText: "Held: the contrast case is explicitly an alternate timeline used for teaching the obstruction side of the pair.",
    releasedText: "Warning: confusing the illustrative case with the actual window is a serious, avoidable error.",
  },
  ashtaResolves: {
    label: "Do not use Ashtakavarga strength to settle the vedha interpretive question",
    heldText: "Held: strength and nullification are different questions; a bindu score does not pick which occupancy rule applies.",
    releasedText: "Warning: using strength to resolve an interpretive rule smuggles in invented certainty.",
  },
  collapseStatuses: {
    label: "Do not collapse the three-status handoff table into one score",
    heldText: "Held: contested, clear, and unreachable are three distinct Chapter 4 inputs.",
    releasedText: "Warning: averaging or merging them hides the qualitatively different work each trigger is doing.",
  },
};

function pointOnCircle(index: number, radius: number, cx: number, cy: number) {
  const angle = (index * 30 - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function sectorPath(index: number, innerR: number, outerR: number, cx: number, cy: number) {
  const startAngle = (index * 30 - 105) * (Math.PI / 180);
  const endAngle = (index * 30 - 75) * (Math.PI / 180);
  const p1 = { x: cx + innerR * Math.cos(startAngle), y: cy + innerR * Math.sin(startAngle) };
  const p2 = { x: cx + outerR * Math.cos(startAngle), y: cy + outerR * Math.sin(startAngle) };
  const p3 = { x: cx + outerR * Math.cos(endAngle), y: cy + outerR * Math.sin(endAngle) };
  const p4 = { x: cx + innerR * Math.cos(endAngle), y: cy + innerR * Math.sin(endAngle) };
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${outerR} ${outerR} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR} ${innerR} 0 0 0 ${p1.x} ${p1.y} Z`;
}

export function VedhaContrastCaseExplorer() {
  const [scenario, setScenario] = useState<Scenario>("actual");
  const [reading, setReading] = useState<Reading>("transit-only");
  const [ashtaScenario, setAshtaScenario] = useState<AshtaScenario>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    mistakeContrast: true, ashtaResolves: true, collapseStatuses: true,
  });

  const contrast = scenario === "contrast";
  const obstructed = contrast || reading === "natal-inclusive";
  const contested = !contrast && reading === "transit-only";
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setScenario("actual");
    setReading("transit-only");
    setAshtaScenario(null);
    setMistakes({ mistakeContrast: true, ashtaResolves: true, collapseStatuses: true });
  }

  return (
    <div data-interactive="vedha-contrast-case-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Chapter 3 capstone</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem", fontWeight: 600 }}>
              Vedha contrast case explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compare Kavya&apos;s contested Scenario A with an illustrative alternate timeline where a transiting occupant makes the obstruction unambiguous. Then synthesise the Chapter 4 handoff.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Scenario selector</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Choose the timeline to examine
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={scenario === "actual"}
            onClick={() => setScenario("actual")}
            style={scenarioButtonStyle(scenario === "actual", GREEN)}
          >
            Kavya&apos;s actual window (Scenario A)
          </button>
          <button
            type="button"
            aria-pressed={scenario === "contrast"}
            onClick={() => setScenario("contrast")}
            style={scenarioButtonStyle(scenario === "contrast", VERMILION)}
          >
            Illustrative contrast case (+ Jupiter in Aries)
          </button>
        </div>
        {contrast && (
          <div style={{ marginTop: "0.65rem", color: VERMILION, fontSize: "0.92rem" }}>
            Note: this is an alternate timeline for teaching the obstruction side of the pair, not Kavya&apos;s actual designed window.
          </div>
        )}
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Trigger 1 detail</p>
          <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
            Saturn → Libra, vedha-point Aries
          </h3>

          {!contrast && (
            <div style={{ marginTop: "0.55rem" }}>
              <p style={{ color: INK_SECONDARY, margin: "0 0 0.45rem" }}>Reading for the natal-vs-transit question:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                <button
                  type="button"
                  aria-pressed={reading === "transit-only"}
                  onClick={() => setReading("transit-only")}
                  style={readingButtonStyle(reading === "transit-only", GREEN)}
                >
                  Transit-only
                </button>
                <button
                  type="button"
                  aria-pressed={reading === "natal-inclusive"}
                  onClick={() => setReading("natal-inclusive")}
                  style={readingButtonStyle(reading === "natal-inclusive", VERMILION)}
                >
                  Natal-inclusive
                </button>
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: obstructed ? `${VERMILION}12` : `${GREEN}12`,
              border: `1px solid ${obstructed ? VERMILION : GREEN}55`,
            }}
          >
            <div style={{ color: obstructed ? VERMILION : GREEN, fontWeight: 600, fontSize: "1.2rem" }}>
              {contrast ? "Obstructed — both readings agree" : obstructed ? "Obstructed — natal-inclusive" : "Stands — transit-only"}
            </div>
            <div style={{ color: INK_SECONDARY, marginTop: "0.35rem", lineHeight: 1.55 }}>
              {contrast
                ? "Transiting Jupiter is now in Aries, the vedha-point. A transiting occupant alone is enough to establish obstruction, so both readings converge on the same verdict."
                : obstructed
                  ? "Natal Mars in Aries counts as the occupant. Saturn's favourable Libra result is cancelled."
                  : "Only transiting planets count. No transiting planet occupies Aries, so Saturn's favourable Libra result stands."}
            </div>
          </div>

          <TriggerWheel contrast={contrast} />
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="The one-fact distinction" icon={<Lightbulb size={18} />} color={AMBER}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              The two scenarios differ in exactly one fact: whether a <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>transiting</span> planet occupies the vedha-point. The natal chart is identical.
            </p>
          </Panel>

          <Panel title="Chapter 4 handoff" icon={<CheckCircle2 size={18} />} color={PURPLE}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 700 }}>Trigger</th>
                    <th style={{ textAlign: "left", padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 700 }}>Vedha status</th>
                    <th style={{ textAlign: "left", padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 700 }}>Chapter 4 input</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontWeight: 600 }}>Saturn → Libra</td>
                    <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: contrast ? VERMILION : GREEN }}>
                      {contrast ? "Obstructed (both readings)" : contested ? "Contested" : "Obstructed"}
                    </td>
                    <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                      {contrast ? "Result nullified" : contested ? "Carry both readings" : "Obstructed under active reading"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontWeight: 600 }}>Jupiter → Gemini</td>
                    <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: GREEN }}>Clear</td>
                    <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>Confirmed, unobstructed</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontWeight: 600 }}>Nodal-axis reversal</td>
                    <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: VERMILION }}>Unreachable</td>
                    <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>Hierarchy-strong, vedha unknown</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Ashtakavarga scope</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Can Chapter 4&apos;s Ashtakavarga strength settle Trigger 1&apos;s contested status?
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          A colleague suggests: &ldquo;Since Ashtakavarga gives Saturn a strength value in Libra, maybe a high enough value could tip the vedha question toward the transit-only reading.&rdquo;
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={ashtaScenario === "yes"}
            onClick={() => setAshtaScenario("yes")}
            style={scenarioButtonStyle(ashtaScenario === "yes", VERMILION)}
          >
            Yes — high strength can override the ambiguity
          </button>
          <button
            type="button"
            aria-pressed={ashtaScenario === "no"}
            onClick={() => setAshtaScenario("no")}
            style={scenarioButtonStyle(ashtaScenario === "no", GREEN)}
          >
            No — strength and nullification are different questions
          </button>
        </div>
        {ashtaScenario && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: ashtaScenario === "no" ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${ashtaScenario === "no" ? GREEN : VERMILION}55`,
              color: ashtaScenario === "no" ? GREEN : VERMILION,
            }}
          >
            {ashtaScenario === "no"
              ? "Correct. Ashtakavarga measures strength, not whether a nullification rule applies. It cannot pick between the transit-only and natal-inclusive readings of the vedha question."
              : "Incorrect. Using a strength score to resolve an interpretive rule conflates two independent techniques and introduces invented certainty."}
          </div>
        )}
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
            ? "All discipline commitments are held. The contrast case is labelled, the handoff is distinct, and Chapter 4's limits are respected."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function TriggerWheel({ contrast }: { contrast: boolean }) {
  const cx = 180;
  const cy = 180;
  const outerR = 145;
  const innerR = 60;
  const saturnPos = 10; // Libra, 11th from Moon
  const vedhaPos = 4; // Aries, 5th from Moon

  return (
    <svg viewBox="0 0 360 360" role="img" aria-label="Trigger 1 vedha wheel" style={{ width: "100%", maxHeight: 360, margin: "0.75rem auto 0.25rem", display: "block" }}>
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
      <path d={sectorPath(vedhaPos, innerR - 8, outerR + 4, cx, cy)} fill={`${AMBER}18`} stroke={AMBER} strokeWidth="2" />
      {Array.from({ length: 12 }, (_, i) => {
        const pos = pointOnCircle(i, outerR + 22, cx, cy);
        return (
          <g key={`label-${i}`}>
            <text x={pos.x} y={pos.y - 2} textAnchor="middle" fill={i === saturnPos ? SATURN : i === vedhaPos ? AMBER : INK_SECONDARY} fontSize="9" fontWeight={600}>
              {SIGNS_FROM_MOON[i].slice(0, 3)}
            </text>
            <text x={pos.x} y={pos.y + 8} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight={600}>
              {i + 1}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={24} fill={`${MOON}18`} stroke={MOON} strokeWidth="2" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill={MOON} fontSize="10" fontWeight={600}>Moon</text>

      {/* Saturn marker */}
      <g transform={`translate(${pointOnCircle(saturnPos, innerR - 28, cx, cy).x} ${pointOnCircle(saturnPos, innerR - 28, cx, cy).y})`}>
        <circle r={16} fill={`${SATURN}22`} stroke={SATURN} strokeWidth="2" />
        <text y="3" textAnchor="middle" fill={SATURN} fontSize="9" fontWeight={600}>Sa</text>
      </g>

      {/* Natal Mars marker */}
      <g transform={`translate(${pointOnCircle(vedhaPos, innerR - 28, cx, cy).x} ${pointOnCircle(vedhaPos, innerR - 28, cx, cy).y})`}>
        <circle r={16} fill={`${MARS}22`} stroke={MARS} strokeWidth="2" />
        <text y="3" textAnchor="middle" fill={MARS} fontSize="9" fontWeight={600}>Ma</text>
      </g>

      {/* Contrast Jupiter marker */}
      {contrast && (
        <g transform={`translate(${pointOnCircle(vedhaPos, innerR - 58, cx, cy).x} ${pointOnCircle(vedhaPos, innerR - 58, cx, cy).y})`}>
          <circle r={16} fill={`${JUPITER}22`} stroke={JUPITER} strokeWidth="2" />
          <text y="3" textAnchor="middle" fill={JUPITER} fontSize="9" fontWeight={600}>Ju</text>
        </g>
      )}

      {/* Obstruction badge */}
      <g transform={`translate(${pointOnCircle(vedhaPos, innerR - 88, cx, cy).x} ${pointOnCircle(vedhaPos, innerR - 88, cx, cy).y})`}>
        <circle r="15" fill={`${VERMILION}18`} stroke={VERMILION} strokeWidth="2" />
        <text y="4" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight={600}>×</text>
      </g>

      {/* Legend */}
      <g transform="translate(10 330)">
        <LegendItem color={SATURN} label="Saturn (Libra)" x={0} />
        <LegendItem color={MARS} label="Natal Mars (Aries)" x={95} />
        {contrast && <LegendItem color={JUPITER} label="Illustrative Jupiter (Aries)" x={215} />}
      </g>
    </svg>
  );
}

function LegendItem({ color, label, x }: { color: string; label: string; x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx="5" cy="-4" r="5" fill={`${color}22`} stroke={color} strokeWidth="1.5" />
      <text x="14" y="-1" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>{label}</text>
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

function readingButtonStyle(active: boolean, color: string): CSSProperties {
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
