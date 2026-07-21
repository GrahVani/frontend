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

type MistakeKey = "skipSynthesis" | "exceptionPairs" | "nodesInTable";

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

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const OCCUPANTS = ["None", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

const VEDHA_RULES: Record<string, { favorable: number[]; vedha: number[] }> = {
  Sun: { favorable: [3, 6, 10, 11], vedha: [9, 12, 4, 5] },
  Moon: { favorable: [1, 3, 6, 7, 10, 11], vedha: [5, 9, 12, 2, 4, 8] },
  Mars: { favorable: [3, 6, 11], vedha: [12, 9, 5] },
  Mercury: { favorable: [2, 4, 6, 8, 10, 11], vedha: [5, 3, 9, 1, 8, 12] },
  Jupiter: { favorable: [2, 5, 7, 9, 11], vedha: [12, 4, 3, 10, 8] },
  Venus: { favorable: [1, 2, 3, 4, 5, 8, 9, 11, 12], vedha: [8, 7, 1, 10, 9, 5, 11, 6, 3] },
  Saturn: { favorable: [3, 6, 11], vedha: [12, 9, 5] },
};

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  skipSynthesis: {
    label: "Complete the full 5-step routine, ending in synthesis",
    heldText: "Held: step 5 brings natal condition and active bhukti into the vedha verdict.",
    releasedText: "Warning: stopping at step 4 treats the bare vedha-point lookup as the final verdict.",
  },
  exceptionPairs: {
    label: "Check Sun-Saturn and Moon-Mercury exceptions before finalising",
    heldText: "Held: these two pairs do not cause mutual vedha regardless of position-count.",
    releasedText: "Warning: applying vedha to an exception pair reports a cancellation classical doctrine excludes.",
  },
  nodesInTable: {
    label: "Do not look up Rāhu or Ketu in the 7-graha table",
    heldText: "Held: the table covers Sun through Saturn only; the nodes are a disclosed scope gap.",
    releasedText: "Warning: inventing or assuming a nodal vedha-point goes beyond this curriculum's verified content.",
  },
};

function isExceptionPair(planet: string, occupant: string) {
  if ((planet === "Sun" && occupant === "Saturn") || (planet === "Saturn" && occupant === "Sun")) return true;
  if ((planet === "Moon" && occupant === "Mercury") || (planet === "Mercury" && occupant === "Moon")) return true;
  return false;
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

function pointOnCircle(index: number, radius: number, cx: number, cy: number) {
  const angle = (index * 30 - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

export function VedhaDoctrineRevisitedExplorer() {
  const [planet, setPlanet] = useState("Saturn");
  const [position, setPosition] = useState(11);
  const [occupant, setOccupant] = useState("None");
  const [scenario, setScenario] = useState<"ignore" | "apply" | null>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    skipSynthesis: true, exceptionPairs: true, nodesInTable: true,
  });

  const rule = VEDHA_RULES[planet];
  const analysis = useMemo(() => {
    const favIndex = rule.favorable.indexOf(position);
    const vedhaIndex = rule.vedha.indexOf(position);
    const isFavorable = favIndex !== -1;
    const isVedhaPosition = vedhaIndex !== -1;
    let vedhaPoint = 0;
    let direction: "favorable-to-vedha" | "vedha-to-favorable" | null = null;
    if (isFavorable) {
      vedhaPoint = rule.vedha[favIndex];
      direction = "favorable-to-vedha";
    } else if (isVedhaPosition) {
      vedhaPoint = rule.favorable[vedhaIndex];
      direction = "vedha-to-favorable";
    }
    const occupantAtVedha = vedhaPoint > 0 && occupant !== "None";
    const exception = occupantAtVedha && isExceptionPair(planet, occupant);
    const obstructed = occupantAtVedha && !exception;
    return {
      isFavorable,
      isVedhaPosition,
      vedhaPoint,
      direction,
      occupantAtVedha,
      exception,
      obstructed,
    };
  }, [rule, planet, position, occupant]);

  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setPlanet("Saturn");
    setPosition(11);
    setOccupant("None");
    setScenario(null);
    setMistakes({ skipSynthesis: true, exceptionPairs: true, nodesInTable: true });
  }

  return (
    <div data-interactive="vedha-doctrine-revisited-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Vedha operational depth</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem", fontWeight: 600 }}>
              Vedha doctrine revisited explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Operate T1-11&apos;s full 7-graha vedha table: look up the position, find the vedha-point, place an occupant, check the exceptions, and complete the 5-step synthesis routine.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>7-graha vedha table</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Select a transiting planet to load it into the simulator
        </h3>
        <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 700 }}>Planet</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 700 }}>Favourable from Moon</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 700 }}>Vedha-point</th>
              </tr>
            </thead>
            <tbody>
              {PLANETS.map((p) => {
                const active = p === planet;
                return (
                  <tr
                    key={p}
                    onClick={() => setPlanet(p)}
                    style={{
                      cursor: "pointer",
                      background: active ? `${PURPLE}0C` : "transparent",
                    }}
                  >
                    <td style={{ padding: "0.5rem", borderBottom: `1px solid ${HAIRLINE}`, color: active ? PURPLE : INK_PRIMARY, fontWeight: active ? 600 : 400 }}>
                      {p}
                    </td>
                    <td style={{ padding: "0.5rem", borderBottom: `1px solid ${HAIRLINE}`, color: active ? GREEN : INK_SECONDARY }}>
                      {VEDHA_RULES[p].favorable.join(", ")}
                    </td>
                    <td style={{ padding: "0.5rem", borderBottom: `1px solid ${HAIRLINE}`, color: active ? AMBER : INK_SECONDARY }}>
                      {VEDHA_RULES[p].vedha.join(", ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>From-Moon wheel</p>
          <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
            Click a position to set the transiting planet
          </h3>
          <VedhaWheelSvg planet={planet} position={position} vedhaPoint={analysis.vedhaPoint} occupant={occupant} onSelect={setPosition} />
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Simulator" icon={<Lightbulb size={18} />} color={PURPLE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <label style={{ color: INK_SECONDARY }}>
                Transiting planet
                <select value={planet} onChange={(e) => setPlanet(e.target.value)} style={selectStyle}>
                  {PLANETS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <label style={{ color: INK_SECONDARY }}>
                Position from Moon
                <select value={position} onChange={(e) => setPosition(Number(e.target.value))} style={selectStyle}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <label style={{ color: INK_SECONDARY }}>
                Occupant of vedha-point
                <select value={occupant} onChange={(e) => setOccupant(e.target.value)} style={selectStyle}>
                  {OCCUPANTS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
            </div>
          </Panel>

          <Panel title="5-step routine" icon={<CheckCircle2 size={18} />} color={analysis.obstructed ? VERMILION : GREEN}>
            <ol style={{ margin: 0, paddingLeft: "1.2rem", color: INK_SECONDARY, lineHeight: 1.7 }}>
              <li>Position from Moon: <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{position}</span></li>
              <li>Table lookup: <span style={{ color: analysis.isFavorable || analysis.isVedhaPosition ? INK_PRIMARY : VERMILION, fontWeight: 600 }}>{analysis.isFavorable ? "favourable position" : analysis.isVedhaPosition ? "vedha position" : "not listed"}</span></li>
              <li>Vedha-point: <span style={{ color: analysis.vedhaPoint ? AMBER : INK_MUTED, fontWeight: 600 }}>{analysis.vedhaPoint ? analysis.vedhaPoint : "none"}</span></li>
              <li>Occupancy &amp; exceptions: {analysis.occupantAtVedha ? (analysis.exception ? "exception pair — no cancellation" : "occupied — cancellation applies") : "unoccupied"}</li>
              <li>Synthesis: combine with natal condition and active bhukti for net effect</li>
            </ol>
          </Panel>

          <Panel title="Verdict" icon={<CheckCircle2 size={18} />} color={analysis.obstructed ? VERMILION : GREEN}>
            <div style={{ color: analysis.obstructed ? VERMILION : GREEN, fontWeight: 600, fontSize: "1.1rem" }}>
              {analysis.obstructed
                ? "Effect obstructed by vedha"
                : analysis.exception
                  ? "Exception pair — no vedha"
                  : analysis.vedhaPoint === 0
                    ? "No vedha point for this position"
                    : "No obstruction; proceed to synthesis"}
            </div>
            <div style={{ color: INK_SECONDARY, marginTop: "0.35rem", lineHeight: 1.55 }}>
              {analysis.obstructed
                ? `A planet occupies the vedha-point (${analysis.vedhaPoint} from Moon) and no classical exception applies. Step 5 still asks how the natal condition and bhukti colour the net result.`
                : analysis.exception
                  ? `${planet} and ${occupant} form one of the two disclosed exception pairs (Sun-Saturn or Moon-Mercury), so mutual vedha does not occur.`
                  : analysis.vedhaPoint === 0
                    ? "This position is not in the selected planet's favourable or vedha list, so the table makes no vedha claim here."
                    : "The vedha-point is clear or an exception applies. Step 5 now brings in dignity, house role, and the active bhukti."}
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Scope and applicability</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Which of Kavya&apos;s Chapter 2 triggers can this table reach?
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
          <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, padding: "0.75rem", background: `${GREEN}08` }}>
            <div style={{ color: GREEN, fontWeight: 600 }}>Saturn → Libra</div>
            <div style={{ color: INK_SECONDARY, fontSize: "0.92rem", marginTop: "0.25rem" }}>Covered. Saturn is in the 7-graha table.</div>
          </div>
          <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, padding: "0.75rem", background: `${GREEN}08` }}>
            <div style={{ color: GREEN, fontWeight: 600 }}>Jupiter → Gemini</div>
            <div style={{ color: INK_SECONDARY, fontSize: "0.92rem", marginTop: "0.25rem" }}>Covered. Jupiter is in the 7-graha table.</div>
          </div>
          <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, padding: "0.75rem", background: `${VERMILION}08` }}>
            <div style={{ color: VERMILION, fontWeight: 600 }}>Nodal-axis reversal</div>
            <div style={{ color: INK_SECONDARY, fontSize: "0.92rem", marginTop: "0.25rem" }}>Not covered. Rāhu/Ketu have no vedha-point in T1-11&apos;s verified table.</div>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Exception check</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          A colleague finds Saturn transiting with the Sun in its vedha-point. What is the correct call?
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={scenario === "apply"}
            onClick={() => setScenario("apply")}
            style={scenarioButtonStyle(scenario === "apply", VERMILION)}
          >
            Apply the vedha cancellation
          </button>
          <button
            type="button"
            aria-pressed={scenario === "ignore"}
            onClick={() => setScenario("ignore")}
            style={scenarioButtonStyle(scenario === "ignore", GREEN)}
          >
            Ignore it — Sun-Saturn is an exception pair
          </button>
        </div>
        {scenario && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: scenario === "ignore" ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${scenario === "ignore" ? GREEN : VERMILION}55`,
              color: scenario === "ignore" ? GREEN : VERMILION,
            }}
          >
            {scenario === "ignore"
              ? "Correct. Sun and Saturn are one of the two disclosed classical exceptions; they do not cause mutual vedha regardless of position-count."
              : "Incorrect. The Sun-Saturn pair is explicitly exempted. Applying vedha here would report a cancellation classical doctrine excludes."}
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
            ? "All discipline commitments are held. The vedha routine is applied fully and within its scope."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function VedhaWheelSvg({
  planet,
  position,
  vedhaPoint,
  occupant,
  onSelect,
}: {
  planet: string;
  position: number;
  vedhaPoint: number;
  occupant: string;
  onSelect: (n: number) => void;
}) {
  const cx = 180;
  const cy = 180;
  const outerR = 150;
  const innerR = 70;

  return (
    <svg viewBox="0 0 360 360" role="img" aria-label="Twelve positions from the Moon with vedha point" style={{ width: "100%", maxHeight: 360, margin: "0.55rem auto 0.25rem", display: "block" }}>
      <circle cx={cx} cy={cy} r={outerR + 6} fill="transparent" stroke={HAIRLINE} strokeWidth="1.5" />
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const isSelected = n === position;
        const isVedha = n === vedhaPoint;
        const isFavorable = VEDHA_RULES[planet].favorable.includes(n);
        return (
          <g key={n}>
            {isSelected && (
              <path d={sectorPath(i, innerR - 10, outerR + 4, cx, cy)} fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth="2" />
            )}
            {isVedha && !isSelected && (
              <path d={sectorPath(i, innerR - 10, outerR + 4, cx, cy)} fill={`${AMBER}18`} stroke={AMBER} strokeWidth="2" />
            )}
            {!isSelected && !isVedha && isFavorable && (
              <path d={sectorPath(i, innerR - 10, outerR + 4, cx, cy)} fill={`${GREEN}0A`} stroke="none" />
            )}
            <line
              x1={cx}
              y1={cy}
              x2={cx + outerR * Math.cos((i * 30 - 90) * (Math.PI / 180))}
              y2={cy + outerR * Math.sin((i * 30 - 90) * (Math.PI / 180))}
              stroke={HAIRLINE}
              strokeWidth="1"
            />
            <g
              role="button"
              tabIndex={0}
              aria-label={`Set position ${n}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(n)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(n);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <text
                x={cx + (outerR + 22) * Math.cos((i * 30 - 90) * (Math.PI / 180))}
                y={cy + (outerR + 22) * Math.sin((i * 30 - 90) * (Math.PI / 180)) + 3}
                textAnchor="middle"
                fill={isSelected ? PURPLE : isVedha ? AMBER : INK_SECONDARY}
                fontSize="11"
                fontWeight={600}
              >
                {n}
              </text>
            </g>
          </g>
        );
      })}
      {/* Center Moon */}
      <circle cx={cx} cy={cy} r={24} fill={`${MOON}18`} stroke={MOON} strokeWidth="2" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill={MOON} fontSize="10" fontWeight={600}>Moon</text>

      {/* Transiting planet marker */}
      {position > 0 && (
        <g transform={`translate(${pointOnCircle(position - 1, innerR - 32, cx, cy).x} ${pointOnCircle(position - 1, innerR - 32, cx, cy).y})`}>
          <circle r={16} fill={`${PURPLE}22`} stroke={PURPLE} strokeWidth="2" />
          <text y="3" textAnchor="middle" fill={PURPLE} fontSize="9" fontWeight={600}>{planet.slice(0, 2)}</text>
        </g>
      )}

      {/* Vedha occupant marker */}
      {vedhaPoint > 0 && occupant !== "None" && (
        <g transform={`translate(${pointOnCircle(vedhaPoint - 1, innerR - 32, cx, cy).x} ${pointOnCircle(vedhaPoint - 1, innerR - 32, cx, cy).y})`}>
          <circle r={16} fill={`${VERMILION}22`} stroke={VERMILION} strokeWidth="2" />
          <text y="3" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={600}>{occupant.slice(0, 2)}</text>
        </g>
      )}

      {/* Legend */}
      <g transform="translate(10 330)">
        <LegendItem color={PURPLE} label="transiting planet" x={0} />
        <LegendItem color={AMBER} label="vedha point" x={115} />
        <LegendItem color={VERMILION} label="occupant" x={210} />
      </g>
      <g transform="translate(10 348)">
        <LegendItem color={GREEN} label="favourable zone" x={0} />
      </g>
    </svg>
  );
}

function LegendItem({ color, label, x }: { color: string; label: string; x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x="0" y="-8" width="10" height="10" rx="3" fill={`${color}22`} stroke={color} strokeWidth="1.5" />
      <text x="15" y="-1" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>{label}</text>
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
