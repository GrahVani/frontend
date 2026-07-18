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

type Reading = "transit-only" | "natal-inclusive";
type DisclosureChoice = "clear" | "obstructed" | "honest" | null;
type ScenarioChoice = "yes" | "no" | null;
type MistakeKey = "silentPick" | "overApply" | "convenientPick";

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
const MARS = "#C8412E";
const SATURN = "#5A5C68";

const SIGNS_FROM_MOON = [
  "Sagittarius", "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus",
  "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio",
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  silentPick: {
    label: "Do not silently pick one reading without disclosure",
    heldText: "Held: both verdicts are named and the reading each depends on is stated.",
    releasedText: "Warning: a single confident verdict hides that it rests on an unsettled interpretive choice.",
  },
  overApply: {
    label: "Apply the two-reading treatment only where readings diverge",
    heldText: "Held: when no natal-only occupant exists, both readings agree and no divergence needs disclosure.",
    releasedText: "Warning: forcing the full disclosure into every vedha check wastes the client's attention.",
  },
  convenientPick: {
    label: "Do not choose the reading that suits a desired outcome",
    heldText: "Held: the safe default is procedural disclosure, not outcome-shopping.",
    releasedText: "Warning: an acknowledged gap is not permission to fill it with the more convenient story.",
  },
};

function pointOnCircle(index: number, radius: number, cx: number, cy: number) {
  const angle = (index * 30 - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

export function NatalVsTransitVedhaExplorer() {
  const [reading, setReading] = useState<Reading>("transit-only");
  const [disclosure, setDisclosure] = useState<DisclosureChoice>(null);
  const [scenario, setScenario] = useState<ScenarioChoice>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    silentPick: true, overApply: true, convenientPick: true,
  });

  const obstructed = reading === "natal-inclusive";
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setReading("transit-only");
    setDisclosure(null);
    setScenario(null);
    setMistakes({ silentPick: true, overApply: true, convenientPick: true });
  }

  return (
    <div data-interactive="natal-vs-transit-vedha-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Open vedha question</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem", fontWeight: 600 }}>
              Natal-vs-transit vedha explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              T1-11&apos;s source text is silent on whether a natal planet counts at the vedha-point. Toggle the two readings and see how Kavya&apos;s Scenario A produces opposite verdicts.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Reading selector</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Choose how to interpret &ldquo;any planet occupies the vedha-point&rdquo;
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={reading === "transit-only"}
            onClick={() => setReading("transit-only")}
            style={readingButtonStyle(reading === "transit-only", GREEN)}
          >
            Transit-only reading
          </button>
          <button
            type="button"
            aria-pressed={reading === "natal-inclusive"}
            onClick={() => setReading("natal-inclusive")}
            style={readingButtonStyle(reading === "natal-inclusive", VERMILION)}
          >
            Natal-inclusive reading
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Scenario A wheel</p>
          <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
            Saturn in Libra, vedha-point Aries, natal Mars present
          </h3>
          <ScenarioAWheel reading={reading} />
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Verdict" icon={<CheckCircle2 size={18} />} color={obstructed ? VERMILION : GREEN}>
            <div style={{ color: obstructed ? VERMILION : GREEN, fontWeight: 600, fontSize: "1.2rem" }}>
              {obstructed ? "Trigger 1 is obstructed" : "Trigger 1 stands clear"}
            </div>
            <div style={{ color: INK_SECONDARY, marginTop: "0.35rem", lineHeight: 1.55 }}>
              {obstructed
                ? "Under the natal-inclusive reading, Kavya's natal Mars in Aries counts as occupying the vedha-point, so Saturn's Libra transit is cancelled."
                : "Under the transit-only reading, only a co-transiting planet can occupy the vedha-point. No transiting planet is in Aries, so Saturn's Libra transit is unobstructed."}
            </div>
            <div style={{ color: INK_MUTED, marginTop: "0.55rem", fontSize: "0.9rem" }}>
              Opposite reading would say: {obstructed ? "Trigger 1 stands clear" : "Trigger 1 is obstructed"}.
            </div>
          </Panel>

          <Panel title="Arguments" icon={<Lightbulb size={18} />} color={PURPLE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, padding: "0.75rem", background: `${GREEN}08` }}>
                <div style={{ color: GREEN, fontWeight: 600 }}>Case for transit-only</div>
                <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <li>T1-11 worked examples use co-transiting planets.</li>
                  <li>Vedha is an obstruction between moving triggers.</li>
                  <li>Natal-inclusive would create lifetime standing obstructions.</li>
                </ul>
              </div>
              <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, padding: "0.75rem", background: `${VERMILION}08` }}>
                <div style={{ color: VERMILION, fontWeight: 600 }}>Case for natal-inclusive</div>
                <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <li>&quot;Any planet&quot; is unqualified.</li>
                  <li>Gochara already blends natal and transiting facts.</li>
                  <li>A natal occupant is permanently present.</li>
                </ul>
              </div>
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Disclosure sentence builder</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Which client-facing statement is scope-honest for Scenario A?
        </h3>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={disclosure === "clear"}
            onClick={() => setDisclosure("clear")}
            style={claimButtonStyle(disclosure === "clear", VERMILION)}
          >
            <span style={{ fontWeight: 600 }}>Overclaim (clear):</span>{" "}
            &ldquo;Saturn&apos;s transit into Libra is a clear, unobstructed favourable trigger.&rdquo;
          </button>
          <button
            type="button"
            aria-pressed={disclosure === "obstructed"}
            onClick={() => setDisclosure("obstructed")}
            style={claimButtonStyle(disclosure === "obstructed", VERMILION)}
          >
            <span style={{ fontWeight: 600 }}>Overclaim (obstructed):</span>{" "}
            &ldquo;Saturn&apos;s transit into Libra is obstructed by your natal Mars and will not deliver its promised benefit.&rdquo;
          </button>
          <button
            type="button"
            aria-pressed={disclosure === "honest"}
            onClick={() => setDisclosure("honest")}
            style={claimButtonStyle(disclosure === "honest", GREEN)}
          >
            <span style={{ fontWeight: 600 }}>Scope-honest:</span>{" "}
            &ldquo;Saturn&apos;s entry into Libra is a favourable, well-placed transit. There is a classical question about whether your own natal Mars — sitting exactly in this transit&apos;s obstruction-point — counts as blocking it; sources are not settled on this, so I am tracking this trigger under both possibilities rather than picking one.&rdquo;
          </button>
        </div>
        {disclosure && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: disclosure === "honest" ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${disclosure === "honest" ? GREEN : VERMILION}55`,
              color: disclosure === "honest" ? GREEN : VERMILION,
            }}
          >
            {disclosure === "honest"
              ? "Correct. This sentence states the favourable transit, the open question, the natal occupant, and the practitioner's safe default without falsely claiming a settled doctrine."
              : "Incorrect. Both one-sided versions silently assume a reading the source text does not settle."}
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Divergence check</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          Does the same ambiguity affect Jupiter&apos;s Gemini transit?
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Jupiter in Gemini has vedha-point Aquarius. No natal planet occupies Aquarius in Kavya&apos;s chart, and no transiting planet occupies it during this window.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            aria-pressed={scenario === "yes"}
            onClick={() => setScenario("yes")}
            style={scenarioButtonStyle(scenario === "yes", VERMILION)}
          >
            Yes — the ambiguity matters here too
          </button>
          <button
            type="button"
            aria-pressed={scenario === "no"}
            onClick={() => setScenario("no")}
            style={scenarioButtonStyle(scenario === "no", GREEN)}
          >
            No — both readings agree Aquarius is unoccupied
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
              ? "Correct. The unresolved question only needs disclosure when the two readings produce different answers. Since Aquarius has no occupant under either reading, Trigger 2 is simply clear."
              : "Incorrect. The general question is open, but in this specific case there is no divergence. Both readings agree the vedha-point is empty."}
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
            ? "All discipline commitments are held. Both readings are named, divergence is checked, and disclosure is proportional."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function ScenarioAWheel({ reading }: { reading: Reading }) {
  const cx = 180;
  const cy = 180;
  const outerR = 145;
  const innerR = 65;
  const saturnPos = 10; // Libra = 11th from Moon, zero-based index 10
  const marsPos = 4; // Aries = 5th from Moon, zero-based index 4

  return (
    <svg viewBox="0 0 360 360" role="img" aria-label="Scenario A from-Moon wheel" style={{ width: "100%", maxHeight: 360, margin: "0.55rem auto 0.25rem", display: "block" }}>
      <circle cx={cx} cy={cy} r={outerR + 6} fill="transparent" stroke={HAIRLINE} strokeWidth="1.5" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + outerR * Math.cos(angle)}
            y2={cy + outerR * Math.sin(angle)}
            stroke={HAIRLINE}
            strokeWidth="1"
          />
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const pos = pointOnCircle(i, outerR + 22, cx, cy);
        const isVedha = i === marsPos;
        return (
          <g key={`label-${i}`}>
            <text x={pos.x} y={pos.y - 2} textAnchor="middle" fill={isVedha ? VERMILION : INK_SECONDARY} fontSize="9" fontWeight={600}>
              {SIGNS_FROM_MOON[i].slice(0, 3)}
            </text>
            <text x={pos.x} y={pos.y + 8} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight={600}>
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Vedha-point highlight */}
      <path
        d={sectorPath(marsPos, innerR - 8, outerR + 4, cx, cy)}
        fill={reading === "natal-inclusive" ? `${VERMILION}18` : `${AMBER}10`}
        stroke={reading === "natal-inclusive" ? VERMILION : AMBER}
        strokeWidth="2"
        strokeDasharray={reading === "natal-inclusive" ? "0" : "4 4"}
      />

      {/* Moon center */}
      <circle cx={cx} cy={cy} r={26} fill={`${MOON}18`} stroke={MOON} strokeWidth="2" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill={MOON} fontSize="10" fontWeight={600}>Moon</text>

      {/* Saturn marker */}
      <g transform={`translate(${pointOnCircle(saturnPos, innerR - 30, cx, cy).x} ${pointOnCircle(saturnPos, innerR - 30, cx, cy).y})`}>
        <circle r={16} fill={`${SATURN}22`} stroke={SATURN} strokeWidth="2" />
        <text y="3" textAnchor="middle" fill={SATURN} fontSize="9" fontWeight={600}>Sa</text>
      </g>

      {/* Mars marker */}
      <g transform={`translate(${pointOnCircle(marsPos, innerR - 30, cx, cy).x} ${pointOnCircle(marsPos, innerR - 30, cx, cy).y})`}>
        <circle r={16} fill={`${MARS}22`} stroke={MARS} strokeWidth="2" />
        <text y="3" textAnchor="middle" fill={MARS} fontSize="9" fontWeight={600}>Ma</text>
      </g>

      {/* Obstruction or clear icon */}
      {reading === "natal-inclusive" ? (
        <g transform={`translate(${pointOnCircle(marsPos, innerR - 62, cx, cy).x} ${pointOnCircle(marsPos, innerR - 62, cx, cy).y})`}>
          <circle r="14" fill={`${VERMILION}18`} stroke={VERMILION} strokeWidth="2" />
          <text y="4" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight={600}>×</text>
        </g>
      ) : (
        <g transform={`translate(${pointOnCircle(marsPos, innerR - 62, cx, cy).x} ${pointOnCircle(marsPos, innerR - 62, cx, cy).y})`}>
          <circle r="14" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="2" />
          <text y="4" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight={600}>✓</text>
        </g>
      )}

      {/* Legend */}
      <g transform="translate(10 330)">
        <LegendItem color={SATURN} label="Saturn (Libra, 11th)" x={0} />
        <LegendItem color={MARS} label="Natal Mars (Aries)" x={135} />
        <LegendItem color={reading === "natal-inclusive" ? VERMILION : AMBER} label={reading === "natal-inclusive" ? "vedha-point occupied" : "vedha-point empty"} x={260} />
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

function sectorPath(index: number, innerR: number, outerR: number, cx: number, cy: number) {
  const startAngle = (index * 30 - 105) * (Math.PI / 180);
  const endAngle = (index * 30 - 75) * (Math.PI / 180);
  const p1 = { x: cx + innerR * Math.cos(startAngle), y: cy + innerR * Math.sin(startAngle) };
  const p2 = { x: cx + outerR * Math.cos(startAngle), y: cy + outerR * Math.sin(startAngle) };
  const p3 = { x: cx + outerR * Math.cos(endAngle), y: cy + outerR * Math.sin(endAngle) };
  const p4 = { x: cx + innerR * Math.cos(endAngle), y: cy + innerR * Math.sin(endAngle) };
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${outerR} ${outerR} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${innerR} ${innerR} 0 0 0 ${p1.x} ${p1.y} Z`;
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
    flex: "1 1 200px",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function claimButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.75rem",
    fontWeight: 400,
    cursor: "pointer",
    lineHeight: 1.55,
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
