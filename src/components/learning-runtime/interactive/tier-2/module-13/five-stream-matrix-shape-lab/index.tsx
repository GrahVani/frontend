"use client";

import { Fragment, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CircleHelp, GitBranch, Grid3X3, Layers3, RotateCcw, ShieldCheck, SlidersHorizontal, TriangleAlert } from "lucide-react";

type OutcomeKey = "full" | "partial" | "divergence";
type ElementKey = "promise" | "timing" | "quality";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const STREAMS = ["Parashara", "KP", "Jaimini", "Lal Kitab", "Tajika"];
const ELEMENTS: Record<ElementKey, { label: string; hint: string }> = {
  promise: { label: "Will it occur?", hint: "Promise or non-promise" },
  timing: { label: "Timing", hint: "Approximate window" },
  quality: { label: "Quality", hint: "Character or caveat" },
};

const OUTCOMES: Record<OutcomeKey, { label: string; action: string; color: string; icon: ReactNode }> = {
  full: {
    label: "Full convergence",
    action: "Strengthen the claim: all streams in play point the same way on this question-element.",
    color: GREEN,
    icon: <BadgeCheck size={16} />,
  },
  partial: {
    label: "Partial convergence",
    action: "Qualify the claim: most streams agree, or one agrees with a caveat that must be named.",
    color: GOLD,
    icon: <SlidersHorizontal size={16} />,
  },
  divergence: {
    label: "Genuine divergence",
    action: "Re-examine, then downgrade honestly if the divergence remains after independent checks.",
    color: VERMILION,
    icon: <GitBranch size={16} />,
  },
};

export function FiveStreamMatrixShapeLab() {
  const [elementKey, setElementKey] = useState<ElementKey>("promise");
  const [outcomeKey, setOutcomeKey] = useState<OutcomeKey>("partial");
  const [convergingCount, setConvergingCount] = useState(3);
  const [streamsAxis, setStreamsAxis] = useState(true);
  const [elementsAxis, setElementsAxis] = useState(true);
  const [nativeVocabulary, setNativeVocabulary] = useState(true);
  const [noInventedCells, setNoInventedCells] = useState(true);

  const element = ELEMENTS[elementKey];
  const outcome = OUTCOMES[outcomeKey];

  const confidence = useMemo(() => {
    if (!noInventedCells) return { label: "invalid practice data", color: VERMILION, note: "Do not fill cells with invented stream verdicts before Chart MD1 exists." };
    if (convergingCount >= 5) return { label: "strongest possible", color: GREEN, note: "5-of-5 is the strongest matrix picture." };
    if (convergingCount === 4) return { label: "strong", color: GREEN, note: "4-of-5 supports a strong claim while naming the exception." };
    if (convergingCount === 3) return { label: "moderate", color: GOLD, note: "3-of-5 is moderate at five-stream depth." };
    if (convergingCount === 2) return { label: "weak", color: GOLD, note: "2-of-5 is weak and must report divergence honestly." };
    return { label: "no defensible prediction", color: VERMILION, note: "Below two converging streams, do not force a prediction." };
  }, [convergingCount, noInventedCells]);

  const status = useMemo(() => {
    if (!streamsAxis) return { label: "stream axis missing", color: VERMILION };
    if (!elementsAxis) return { label: "question axis missing", color: VERMILION };
    if (!nativeVocabulary) return { label: "vocabulary flattened", color: GOLD };
    if (!noInventedCells) return { label: "fabricated cells", color: VERMILION };
    return { label: "matrix shape ready", color: GREEN };
  }, [elementsAxis, nativeVocabulary, noInventedCells, streamsAxis]);

  const guidance = useMemo(() => {
    if (!streamsAxis) return "Repair the shape: rows must list the five streams in play.";
    if (!elementsAxis) return "Repair the shape: columns must list question-elements, not random observations.";
    if (!nativeVocabulary) return "Repair the cells: each stream keeps its own vocabulary rather than being flattened into generic yes or no.";
    if (!noInventedCells) return "Repair the practice: leave cells as placeholders until real Chart MD1 findings exist.";
    return `${outcome.label}: ${outcome.action} Confidence preview: ${confidence.note}`;
  }, [confidence.note, elementsAxis, nativeVocabulary, noInventedCells, outcome, streamsAxis]);

  return (
    <div data-interactive="five-stream-matrix-shape-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Convergence-divergence matrix</p>
            <h2 style={{ margin: "0.22rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Learn the five-stream matrix shape before filling any real cells
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Inspect stream rows, question-element columns, three outcome types, and the five-stream confidence preview without inventing Chart MD1 findings.
            </p>
          </div>
          <span style={{ border: `1px solid ${status.color}`, color: status.color, borderRadius: 999, padding: "0.42rem 0.68rem", fontSize: "0.78rem", fontWeight: 600, background: "color-mix(in srgb, currentColor 8%, transparent)", whiteSpace: "nowrap" }}>
            {status.label}
          </span>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.68fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <p style={eyebrowStyle}>Blank matrix shape</p>
              <h3 style={{ margin: "0.22rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", fontWeight: 600 }}>{element.label}</h3>
            </div>
            <span style={{ color: BLUE, display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.84rem", fontWeight: 600 }}>
              <Grid3X3 size={16} />
              5 x 3
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.05fr repeat(3, minmax(92px, 1fr))", gap: "0.42rem", marginTop: "0.9rem" }} role="table" aria-label="Blank five stream convergence divergence matrix">
            <Cell tone={BLUE}>Stream</Cell>
            {(Object.keys(ELEMENTS) as ElementKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setElementKey(key)} style={matrixButtonStyle(elementKey === key)} aria-pressed={elementKey === key}>
                {ELEMENTS[key].label}
              </button>
            ))}
            {STREAMS.map((stream) => (
              <Fragment key={stream}>
                <Cell key={`${stream}-label`} tone={PURPLE}>{stream}</Cell>
                {(Object.keys(ELEMENTS) as ElementKey[]).map((key) => (
                  <Cell key={`${stream}-${key}`} tone={key === elementKey ? GOLD : HAIRLINE}>
                    ?
                  </Cell>
                ))}
              </Fragment>
            ))}
          </div>
          <p style={{ margin: "0.8rem 0 0", color: INK_SECONDARY, lineHeight: 1.52 }}>{element.hint}: cells stay as question marks until real stream verdicts exist.</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Shape guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={streamsAxis} onChange={setStreamsAxis} label="Streams are rows" icon={<Layers3 size={16} />} />
            <ToggleRow checked={elementsAxis} onChange={setElementsAxis} label="Question-elements are columns" icon={<Grid3X3 size={16} />} />
            <ToggleRow checked={nativeVocabulary} onChange={setNativeVocabulary} label="Keep native vocabulary" icon={<CircleHelp size={16} />} />
            <ToggleRow checked={noInventedCells} onChange={setNoInventedCells} label="No invented verdicts" icon={<ShieldCheck size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setElementKey("promise");
              setOutcomeKey("partial");
              setConvergingCount(3);
              setStreamsAxis(true);
              setElementsAxis(true);
              setNativeVocabulary(true);
              setNoInventedCells(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.75fr) minmax(280px, 1fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Three outcomes</p>
          <div style={{ display: "grid", gap: "0.52rem", marginTop: "0.8rem" }}>
            {(Object.keys(OUTCOMES) as OutcomeKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setOutcomeKey(key)} style={choiceStyle(outcomeKey === key, OUTCOMES[key].color)} aria-pressed={outcomeKey === key}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.42rem" }}>{OUTCOMES[key].icon}{OUTCOMES[key].label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>5-stream confidence preview</p>
          <label style={{ display: "grid", gap: "0.45rem", marginTop: "0.8rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
            Converging streams: {convergingCount} of 5
            <input type="range" min="0" max="5" step="1" value={convergingCount} onChange={(event) => setConvergingCount(Number(event.target.value))} aria-label="Converging stream count" />
          </label>
          <div style={{ marginTop: "0.72rem", border: `1px solid ${confidence.color}`, borderRadius: 8, padding: "0.75rem", background: "rgba(255,255,255,0.34)" }}>
            <p style={{ margin: 0, color: confidence.color, fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{confidence.label}</p>
            <p style={{ margin: "0.34rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>{confidence.note}</p>
          </div>
        </div>
      </section>

      <section style={{ ...cardStyle, borderColor: status.color }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <span style={{ color: status.color, marginTop: "0.1rem" }}>{status.color === GREEN ? <BadgeCheck size={20} /> : <TriangleAlert size={20} />}</span>
          <div>
            <p style={eyebrowStyle}>Matrix rule</p>
            <p style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, lineHeight: 1.58 }}>{guidance}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Cell({ children, tone }: { children: ReactNode; tone: string }) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${tone}`, borderRadius: 8, minHeight: 44, display: "grid", placeItems: "center", padding: "0.45rem", color: INK_SECONDARY, background: "rgba(255,255,255,0.32)", fontSize: "0.82rem", textAlign: "center" }}>
      {children}
    </div>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${checked ? GREEN : HAIRLINE}`, borderRadius: 8, padding: "0.62rem 0.7rem", color: checked ? INK_PRIMARY : INK_MUTED, cursor: "pointer" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem" }}>{icon}{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 600,
};

const buttonReset: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
  textAlign: "center",
};

function matrixButtonStyle(active: boolean): CSSProperties {
  return {
    ...buttonReset,
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, currentColor 7%, transparent)" : "rgba(255,255,255,0.32)",
    color: active ? BLUE : INK_SECONDARY,
    minHeight: 44,
    padding: "0.45rem",
    fontSize: "0.78rem",
    fontWeight: 600,
  };
}

function choiceStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonReset,
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, currentColor 7%, transparent)" : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.65rem 0.72rem",
    fontSize: "0.86rem",
    fontWeight: 600,
  };
}

const softButtonStyle: CSSProperties = {
  ...buttonReset,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_SECONDARY,
  padding: "0.55rem 0.72rem",
  fontSize: "0.86rem",
  fontWeight: 600,
};
