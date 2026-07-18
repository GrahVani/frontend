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

type TriggerKey = "saturn" | "jupiter" | "nodes";
type MistakeKey = "favourableVsHierarchy" | "conjunctionOnly" | "untouchedMeansIrrelevant";

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
const KARAKA = "#E8B845";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const LAGNA_INDEX = 3; // Cancer
const MOON_INDEX = 8; // Sagittarius
const JUPITER_INDEX = 11; // Pisces
const SATURN_INDEX = 6; // Libra
const SEVENTH_HOUSE_SIGN_INDEX = 9; // Capricorn
const RAHU_TRANSIT_INDEX = 8; // Sagittarius
const KETU_TRANSIT_INDEX = 2; // Gemini
const JUPITER_TRANSIT_INDEX = 2; // Gemini
const SATURN_TRANSIT_INDEX = 6; // Libra

interface SensitivePoint {
  key: string;
  signIndex: number;
  label: string;
  category: string;
  color: string;
}

const SENSITIVE_POINTS: SensitivePoint[] = [
  { key: "moon", signIndex: MOON_INDEX, label: "Natal Moon", category: "MD lord + Category 3 Moon", color: MOON },
  { key: "jupiter", signIndex: JUPITER_INDEX, label: "Natal Jupiter", category: "AD lord + marriage-kāraka", color: KARAKA },
  { key: "saturn", signIndex: SATURN_INDEX, label: "Natal Saturn", category: "7th lord", color: PURPLE },
  { key: "seventhHouse", signIndex: SEVENTH_HOUSE_SIGN_INDEX, label: "7th house sign", category: "Capricorn", color: VERMILION },
];

interface TriggerConfig {
  key: TriggerKey;
  label: string;
  planet: string;
  signIndex: number;
  color: string;
  aspects?: { name: string; offset: number }[];
}

const TRIGGERS: TriggerConfig[] = [
  {
    key: "saturn",
    label: "Saturn → Libra",
    planet: "Sa",
    signIndex: SATURN_TRANSIT_INDEX,
    color: PURPLE,
    aspects: [
      { name: "3rd", offset: 2 },
      { name: "7th", offset: 6 },
      { name: "10th", offset: 9 },
    ],
  },
  {
    key: "jupiter",
    label: "Jupiter → Gemini",
    planet: "Ju",
    signIndex: JUPITER_TRANSIT_INDEX,
    color: GREEN,
    aspects: [
      { name: "5th", offset: 4 },
      { name: "7th", offset: 6 },
      { name: "9th", offset: 8 },
    ],
  },
  {
    key: "nodes",
    label: "Nodal-axis reversal",
    planet: "Ra/Ke",
    signIndex: RAHU_TRANSIT_INDEX,
    color: VERMILION,
  },
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  favourableVsHierarchy: {
    label: "Distinguish 'very favourable' from 'high on the hierarchy'",
    heldText: "Held: T1-11's Moon-table favourability and T2-01's sensitivity hierarchy are separate tests.",
    releasedText: "Warning: collapsing the two tests into one impression of 'strong' hides which claim rests on which evidence.",
  },
  conjunctionOnly: {
    label: "Check aspects as well as conjunctions",
    heldText: "Held: T2-01's hierarchy explicitly allows a trigger to touch a point by aspect.",
    releasedText: "Warning: checking conjunction alone misses Saturn's 3rd and Jupiter's 5th/7th aspect hits.",
  },
  untouchedMeansIrrelevant: {
    label: "Untouched natal point ≠ irrelevant trigger",
    heldText: "Held: a trigger's value is measured by what it touches, not by whether something touches its own natal point.",
    releasedText: "Warning: conflating these two directions leads to dropping triggers that are doing real hierarchy work.",
  },
};

function mod12(n: number) {
  return ((n % 12) + 12) % 12;
}

function houseFromSign(lagnaIndex: number, signIndex: number) {
  return mod12(signIndex - lagnaIndex) + 1;
}

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

function getTriggerReach(trigger: TriggerConfig) {
  const reach: Record<number, { type: "conjunction" | "aspect"; aspectName?: string }> = {};
  reach[trigger.signIndex] = { type: "conjunction" };
  if (trigger.aspects) {
    for (const a of trigger.aspects) {
      const sign = mod12(trigger.signIndex + a.offset);
      reach[sign] = { type: "aspect", aspectName: a.name };
    }
  }
  if (trigger.key === "nodes") {
    reach[KETU_TRANSIT_INDEX] = { type: "conjunction" };
  }
  return reach;
}

export function TransitTriggerIdentificationWorkbench() {
  const [active, setActive] = useState<Record<TriggerKey, boolean>>({
    saturn: true, jupiter: true, nodes: true,
  });
  const [stationIntensifier, setStationIntensifier] = useState(true);
  const [scenario, setScenario] = useState<"yes" | "no" | null>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    favourableVsHierarchy: true, conjunctionOnly: true, untouchedMeansIrrelevant: true,
  });

  const results = useMemo(() => {
    return SENSITIVE_POINTS.map((pt) => {
      const hits: { trigger: TriggerKey; mechanism: string }[] = [];
      for (const t of TRIGGERS) {
        if (!active[t.key]) continue;
        const reach = getTriggerReach(t);
        const hit = reach[pt.signIndex];
        if (hit) {
          hits.push({
            trigger: t.key,
            mechanism: hit.type === "conjunction" ? "conjunction" : `${hit.aspectName} aspect`,
          });
        }
      }
      return { point: pt, hits };
    });
  }, [active]);

  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setActive({ saturn: true, jupiter: true, nodes: true });
    setStationIntensifier(true);
    setScenario(null);
    setMistakes({ favourableVsHierarchy: true, conjunctionOnly: true, untouchedMeansIrrelevant: true });
  }

  return (
    <div data-interactive="transit-trigger-identification-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Chapter 2 capstone</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Transit trigger identification workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Assemble Chapter 2&apos;s triggers and test each against T2-01&apos;s sensitivity hierarchy. Report convergence, gaps, and the mechanism behind every hit.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Trigger switches</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Toggle the Chapter 2 triggers active in Kavya&apos;s window
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          {TRIGGERS.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={active[t.key]}
              onClick={() => setActive((a) => ({ ...a, [t.key]: !a[t.key] }))}
              style={buttonStyle(active[t.key], t.color)}
            >
              {active[t.key] ? <CheckCircle2 size={15} aria-hidden="true" /> : null}
              {t.label}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={stationIntensifier}
            onClick={() => setStationIntensifier((v) => !v)}
            style={buttonStyle(stationIntensifier, AMBER)}
          >
            {stationIntensifier ? <CheckCircle2 size={15} aria-hidden="true" /> : null}
            Saturn station intensifier
          </button>
        </div>
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          The station intensifier does not add a new point of contact; it concentrates Saturn&apos;s existing Libra trigger.
        </p>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Convergence wheel</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Active triggers and sensitive points
          </h3>
          <ConvergenceWheel active={active} results={results} />
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Hits by mechanism" icon={<Lightbulb size={18} />} color={GOLD}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 700 }}>Point</th>
                    {TRIGGERS.map((t) => (
                      <th key={t.key} style={{ textAlign: "left", padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: t.color, fontWeight: 700 }}>{t.planet}</th>
                    ))}
                    <th style={{ textAlign: "center", padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 700 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.point.key}>
                      <td style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontWeight: 600 }}>
                        {r.point.label}
                        <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 400 }}>{r.point.category}</div>
                      </td>
                      {TRIGGERS.map((t) => {
                        const hit = r.hits.find((h) => h.trigger === t.key);
                        return (
                          <td key={t.key} style={{ padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: hit ? t.color : INK_MUTED }}>
                            {hit ? hit.mechanism : "—"}
                          </td>
                        );
                      })}
                      <td style={{ textAlign: "center", padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: r.hits.length > 0 ? GREEN : INK_MUTED, fontWeight: 600 }}>
                        {r.hits.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Honest synthesis" icon={<CheckCircle2 size={18} />} color={GREEN}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {results.map((r) => {
                const count = r.hits.length;
                return (
                  <div key={r.point.key} style={{ color: count === 0 ? INK_MUTED : INK_SECONDARY }}>
                    <span style={{ color: r.point.color, fontWeight: 600 }}>{r.point.label}</span>
                    {" — "}
                    {count === 0
                      ? "no hits from active triggers"
                      : `touched by ${count} active trigger${count > 1 ? "s" : ""}: ${r.hits.map((h) => `${TRIGGERS.find((t) => t.key === h.trigger)?.label} (${h.mechanism})`).join(", ")}`}
                  </div>
                );
              })}
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Direction-of-reach check</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Does Jupiter&apos;s untouched natal position make Trigger 2 irrelevant?
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          A colleague drafts: &ldquo;Since nothing touches natal Jupiter, Trigger 2 (Jupiter into Gemini) turns out to be irrelevant to this window after all.&rdquo;
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={scenario === "yes"}
            onClick={() => setScenario("yes")}
            style={scenarioButtonStyle(scenario === "yes", VERMILION)}
          >
            Yes — an untouched natal point weakens the trigger
          </button>
          <button
            type="button"
            aria-pressed={scenario === "no"}
            onClick={() => setScenario("no")}
            style={scenarioButtonStyle(scenario === "no", GREEN)}
          >
            No — the trigger reaches other sensitive points by aspect
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
              ? "Correct. Trigger 2's value is in what Jupiter touches from Gemini: the Moon by its 7th aspect and Saturn by its 5th aspect. Whether Jupiter's own natal point is touched is a separate question."
              : "Incorrect. A trigger's relevance is measured by the reach it casts onto sensitive points, not by whether something lands on the transiting planet's own natal degree."}
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
            ? "All discipline commitments are held. Convergence, gaps, and mechanisms are reported honestly."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function ConvergenceWheel({ active, results }: { active: Record<TriggerKey, boolean>; results: { point: SensitivePoint; hits: { trigger: TriggerKey; mechanism: string }[] }[] }) {
  const cx = 180;
  const cy = 180;
  const outerR = 150;
  const innerR = 95;

  const highlightedSigns = results.filter((r) => r.hits.length > 0).map((r) => r.point.signIndex);

  // Build marker lists per sign
  const sensitiveMarkers: Record<number, { label: string; color: string; key: string }[]> = {};
  const transitMarkers: Record<number, { label: string; color: string; key: string; trigger: TriggerKey }[]> = {};

  for (const pt of SENSITIVE_POINTS) {
    if (!sensitiveMarkers[pt.signIndex]) sensitiveMarkers[pt.signIndex] = [];
    sensitiveMarkers[pt.signIndex].push({ label: pt.label.split(" ").map((w) => w[0]).join(""), color: pt.color, key: pt.key });
  }

  for (const t of TRIGGERS) {
    if (!active[t.key]) continue;
    if (!transitMarkers[t.signIndex]) transitMarkers[t.signIndex] = [];
    transitMarkers[t.signIndex].push({ label: t.planet, color: t.color, key: t.key, trigger: t.key });
    if (t.key === "nodes") {
      if (!transitMarkers[KETU_TRANSIT_INDEX]) transitMarkers[KETU_TRANSIT_INDEX] = [];
      transitMarkers[KETU_TRANSIT_INDEX].push({ label: "Ke", color: t.color, key: "ketu", trigger: t.key });
    }
  }

  const offsetMap: Record<number, number[]> = {
    1: [0],
    2: [-12, 12],
    3: [-20, 0, 20],
    4: [-28, -8, 8, 28],
  };

  return (
    <svg viewBox="0 0 360 360" role="img" aria-label="Multi-trigger convergence wheel for Kavya" style={{ width: "100%", maxHeight: 360, margin: "0.55rem auto 0.25rem", display: "block" }}>
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
          d={sectorPath(sign, innerR - 10, outerR + 4, cx, cy)}
          fill={`${GREEN}12`}
          stroke={GREEN}
          strokeWidth="1.5"
        />
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const house = houseFromSign(LAGNA_INDEX, i);
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

      {/* Aspect lines */}
      {TRIGGERS.map((t) => {
        if (!active[t.key]) return null;
        const reach = getTriggerReach(t);
        const sourcePos = pointOnCircle(t.signIndex, innerR - 24, cx, cy);
        return results.map((r) => {
          const hit = reach[r.point.signIndex];
          if (!hit || hit.type !== "aspect") return null;
          const targetPos = pointOnCircle(r.point.signIndex, innerR - 24, cx, cy);
          return (
            <line
              key={`line-${t.key}-${r.point.key}`}
              x1={sourcePos.x}
              y1={sourcePos.y}
              x2={targetPos.x}
              y2={targetPos.y}
              stroke={t.color}
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity={0.7}
            />
          );
        });
      })}

      {/* Sensitive point markers */}
      {Object.entries(sensitiveMarkers).map(([signStr, markers]) => {
        const sign = Number(signStr);
        const offsets = offsetMap[markers.length] || offsetMap[4];
        return markers.map((m, idx) => {
          const offset = offsets[idx] ?? 0;
          const pos = pointOnCircle(sign + offset / 30, innerR - 24, cx, cy);
          return (
            <g key={`sens-${m.key}`}>
              <circle cx={pos.x} cy={pos.y} r={14} fill={`${m.color}22`} stroke={m.color} strokeWidth="2" />
              <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill={m.color} fontSize="8" fontWeight={600}>
                {m.label}
              </text>
            </g>
          );
        });
      })}

      {/* Transit markers */}
      {Object.entries(transitMarkers).map(([signStr, markers]) => {
        const sign = Number(signStr);
        const offsets = offsetMap[markers.length] || offsetMap[4];
        return markers.map((m, idx) => {
          const offset = offsets[idx] ?? 0;
          const pos = pointOnCircle(sign + offset / 30, innerR - 52, cx, cy);
          return (
            <g key={`trans-${m.key}`}>
              <circle cx={pos.x} cy={pos.y} r={14} fill={`${m.color}22`} stroke={m.color} strokeWidth="2" />
              <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill={m.color} fontSize="8" fontWeight={600}>
                {m.label}
              </text>
            </g>
          );
        });
      })}

      {/* Center */}
      <circle cx={cx} cy={cy} r={22} fill={`${GOLD}18`} stroke={GOLD} strokeWidth="2" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill={GOLD} fontSize="10" fontWeight={600}>Cancer</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight={600}>Lagna</text>

      {/* Legend */}
      <g transform={`translate(10 330)`}>
        <LegendItem color={TRIGGERS[0].color} label="Saturn trigger" x={0} />
        <LegendItem color={TRIGGERS[1].color} label="Jupiter trigger" x={115} />
        <LegendItem color={TRIGGERS[2].color} label="Nodes trigger" x={230} />
      </g>
      <g transform={`translate(10 348)`}>
        <LegendItem color={MOON} label="Moon" x={0} />
        <LegendItem color={KARAKA} label="Jupiter" x={60} />
        <LegendItem color={PURPLE} label="7th lord Saturn" x={125} />
        <LegendItem color={VERMILION} label="7th house" x={220} />
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
