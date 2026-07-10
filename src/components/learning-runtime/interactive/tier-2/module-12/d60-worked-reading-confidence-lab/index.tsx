"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Ban, CheckCircle2, Clock3, GitCompare, HeartHandshake, RotateCcw, Sparkles, Table2, TriangleAlert } from "lucide-react";

type ConfidenceKey = "confirmed" | "recorded" | "approximate";
type StepKey = "confidence" | "index" | "relative" | "empowerment";

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

const CONFIDENCE: Record<ConfidenceKey, { label: string; title: string; body: string; color: string }> = {
  confirmed: {
    label: "Confirmed / rectified",
    title: "D60 reading may proceed",
    body: "This meets the lesson standard: a birth certificate, hospital record, or rectified equivalent.",
    color: GREEN,
  },
  recorded: {
    label: "Recorded but untested",
    title: "Pause and verify before D60",
    body: "The chart may be usable for D1 and some D20 discussion, but the D60 needs stronger confidence.",
    color: GOLD,
  },
  approximate: {
    label: "Approximate",
    title: "Decline the D60 reading",
    body: "Do not soften or hedge D60 findings. Offer D1/D20 material and name rectification as a path forward.",
    color: VERMILION,
  },
};

const STEPS: Record<StepKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  confidence: {
    label: "Confidence",
    title: "State birth-time confidence first",
    body: "The D60 reading starts by declaring the time standard before any index or interpretation.",
    icon: <Clock3 size={16} />,
    color: BLUE,
  },
  index: {
    label: "Index",
    title: "Compute index-only table",
    body: "Sun 21, Moon 31, Mars 17, Mercury 25, Jupiter 41, Venus 37, Saturn 55, Rahu 31, Ketu 31.",
    icon: <Table2 size={16} />,
    color: PURPLE,
  },
  relative: {
    label: "Relative",
    title: "Read outliers with cross-reference",
    body: "Saturn 55 and Mars 17 are positional facts; meaning comes only through independent D1 and D20 evidence.",
    icon: <GitCompare size={16} />,
    color: GOLD,
  },
  empowerment: {
    label: "Empower",
    title: "Close with agency",
    body: "Disciplined, structured practice is named as a likely strength, offered as input rather than destiny.",
    icon: <HeartHandshake size={16} />,
    color: GREEN,
  },
};

const CONVERGENCE = [
  { label: "D1 degree", body: "Saturn is late within its sign.", color: BLUE },
  { label: "Atmakaraka", body: "The same high degree gives Saturn AK status.", color: PURPLE },
  { label: "D20", body: "Saturn is exalted in the mantra house.", color: GREEN },
  { label: "D60", body: "Saturn index 55 is the high-end outlier.", color: GOLD },
] as const;

const STEP_ORDER: StepKey[] = ["confidence", "index", "relative", "empowerment"];

export function D60WorkedReadingConfidenceLab() {
  const [confidenceKey, setConfidenceKey] = useState<ConfidenceKey>("confirmed");
  const [stepKey, setStepKey] = useState<StepKey>("confidence");
  const [indexOnly, setIndexOnly] = useState(true);
  const [noHedgedD60, setNoHedgedD60] = useState(true);
  const [crossReference, setCrossReference] = useState(true);
  const [empowermentClose, setEmpowermentClose] = useState(true);

  const confidence = CONFIDENCE[confidenceKey];
  const step = STEPS[stepKey];
  const canReadD60 = confidenceKey === "confirmed" && indexOnly && noHedgedD60 && crossReference && empowermentClose;

  const status = useMemo(() => {
    if (confidenceKey === "approximate") return { label: "D60 declined", color: VERMILION };
    if (confidenceKey === "recorded") return { label: "verify or rectify first", color: GOLD };
    if (!indexOnly) return { label: "scope limit broken", color: VERMILION };
    if (!noHedgedD60) return { label: "hedged D60 risk", color: GOLD };
    if (!crossReference) return { label: "outlier overread", color: GOLD };
    if (!empowermentClose) return { label: "empowerment missing", color: GOLD };
    return { label: "complete D60 reading ready", color: GREEN };
  }, [confidenceKey, crossReference, empowermentClose, indexOnly, noHedgedD60]);

  const finalReading = useMemo(() => {
    if (confidenceKey === "approximate") return "Decline the D60 reading outright. Continue with D1 and D20 material, and name birth-time rectification as a possible next step.";
    if (confidenceKey === "recorded") return "Pause before D60. The lesson standard is confirmed or rectified time, not merely remembered or untested time.";
    if (!indexOnly) return "Return to index-only D60 output. This lesson does not add signs, names, or quality labels.";
    if (!noHedgedD60) return "There is no honest softened D60 on rough time. Either the confidence standard is met, or the D60 is declined.";
    if (!crossReference) return "Do not make Saturn 55 meaningful by itself. Cross-reference the D1 degree, Atmakaraka status, and D20 exaltation.";
    if (!empowermentClose) return "Close the reading with agency: disciplined and structured practice as a likely strength, not a foreclosed destiny.";
    return "Chart S1 D60 synthesis: confirmed-time context, index-only table, Saturn and Mars as positional outliers, and a Saturn convergence closed as disciplined practice capacity rather than destiny.";
  }, [confidenceKey, crossReference, empowermentClose, indexOnly, noHedgedD60]);

  return (
    <div data-interactive="d60-worked-reading-confidence-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>D60 worked reading with confidence gate</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Run the complete D60 synthesis only when the time standard is met
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Choose the birth-time confidence, walk the four-step reading, and see when the tool must decline D60 output instead of hedging it.
            </p>
          </div>
          <span
            style={{
              border: `1px solid ${status.color}`,
              color: status.color,
              borderRadius: 999,
              padding: "0.42rem 0.68rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              background: "color-mix(in srgb, currentColor 8%, transparent)",
              whiteSpace: "nowrap",
            }}
          >
            {status.label}
          </span>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.78fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Birth-time confidence</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.6rem", marginTop: "0.75rem" }}>
            {(Object.keys(CONFIDENCE) as ConfidenceKey[]).map((key) => {
              const item = CONFIDENCE[key];
              const active = key === confidenceKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setConfidenceKey(key)}
                  style={{
                    ...buttonReset,
                    border: `1px solid ${active ? item.color : HAIRLINE}`,
                    borderRadius: 8,
                    background: active ? "color-mix(in srgb, white 78%, var(--gl-card-surface-solid))" : "transparent",
                    color: active ? item.color : INK_SECONDARY,
                    padding: "0.78rem",
                    minHeight: 112,
                  }}
                  aria-pressed={active}
                >
                  <span style={{ display: "block", fontSize: "0.82rem", fontWeight: 600 }}>{item.label}</span>
                  <span style={{ display: "block", marginTop: "0.4rem", color: active ? INK_PRIMARY : INK_SECONDARY, lineHeight: 1.35 }}>{item.title}</span>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: "0.85rem", border: `1px solid ${confidence.color}`, borderRadius: 8, padding: "0.8rem", background: "rgba(255,255,255,0.32)" }}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{confidence.body}</p>
          </div>

          <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "minmax(240px, 0.8fr) minmax(0, 1fr)", gap: "1rem", alignItems: "center" }}>
            <SynthesisDiagram stepKey={stepKey} canReadD60={canReadD60} />
            <div>
              <p style={{ margin: 0, color: step.color, fontSize: "0.78rem", fontWeight: 600 }}>{step.label}</p>
              <h3 style={{ margin: "0.24rem 0", color: INK_PRIMARY, fontSize: "1.05rem", fontWeight: 600 }}>{step.title}</h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{step.body}</p>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Reading safeguards</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={indexOnly} onChange={setIndexOnly} label="Keep D60 index-only" icon={<Table2 size={16} />} />
            <ToggleRow checked={noHedgedD60} onChange={setNoHedgedD60} label="No hedged D60 on rough time" icon={<Ban size={16} />} />
            <ToggleRow checked={crossReference} onChange={setCrossReference} label="Cross-reference outliers" icon={<GitCompare size={16} />} />
            <ToggleRow checked={empowermentClose} onChange={setEmpowermentClose} label="Close with empowerment" icon={<HeartHandshake size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setConfidenceKey("confirmed");
              setStepKey("confidence");
              setIndexOnly(true);
              setNoHedgedD60(true);
              setCrossReference(true);
              setEmpowermentClose(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <p style={eyebrowStyle}>Four-step sequence</p>
            <h3 style={{ margin: "0.22rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", fontWeight: 600 }}>Click each step of the complete reading</h3>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {STEP_ORDER.map((key, index) => {
              const item = STEPS[key];
              const active = key === stepKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStepKey(key)}
                  style={{
                    ...buttonReset,
                    border: `1px solid ${active ? item.color : HAIRLINE}`,
                    borderRadius: 999,
                    background: active ? "color-mix(in srgb, white 80%, var(--gl-card-surface-solid))" : "transparent",
                    color: active ? item.color : INK_SECONDARY,
                    padding: "0.48rem 0.72rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                  aria-pressed={active}
                >
                  {index + 1}. {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginTop: "0.9rem" }}>
          {CONVERGENCE.map((item) => (
            <article key={item.label} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.85rem", background: "rgba(255,255,255,0.32)" }}>
              <p style={{ margin: 0, color: item.color, fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{item.label}</p>
              <p style={{ margin: "0.28rem 0 0", color: INK_SECONDARY, lineHeight: 1.48, fontSize: "0.92rem" }}>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...cardStyle, borderColor: status.color }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <span style={{ color: status.color, marginTop: "0.1rem" }}>{status.color === GREEN ? <Sparkles size={20} /> : <TriangleAlert size={20} />}</span>
          <div>
            <p style={eyebrowStyle}>Reading output</p>
            <p style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, lineHeight: 1.58 }}>{finalReading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        border: `1px solid ${checked ? GREEN : HAIRLINE}`,
        borderRadius: 8,
        padding: "0.62rem 0.7rem",
        color: checked ? INK_PRIMARY : INK_MUTED,
        cursor: "pointer",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem" }}>
        {icon}
        {label}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function SynthesisDiagram({ stepKey, canReadD60 }: { stepKey: StepKey; canReadD60: boolean }) {
  const nodes = [
    { key: "confidence", x: 58, y: 62, label: "time" },
    { key: "index", x: 158, y: 62, label: "index" },
    { key: "relative", x: 258, y: 62, label: "outlier" },
    { key: "empowerment", x: 158, y: 132, label: "agency" },
  ] as const;
  const activeColor = canReadD60 ? STEPS[stepKey].color : VERMILION;

  return (
    <svg viewBox="0 0 320 172" role="img" aria-label="D60 confidence-gated synthesis diagram" style={{ width: "100%", maxWidth: 380, height: "auto" }}>
      <rect x="8" y="8" width="304" height="154" rx="8" fill="rgba(255,255,255,0.35)" stroke={HAIRLINE} />
      <path d="M88 62 H128 M188 62 H228 M258 84 C248 120 205 132 188 132 M58 84 C68 120 112 132 128 132" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      {nodes.map((node) => {
        const selected = node.key === stepKey;
        return (
          <g key={node.key}>
            <circle cx={node.x} cy={node.y} r={selected ? 25 : 21} fill={selected ? activeColor : SURFACE} stroke={selected ? activeColor : HAIRLINE} strokeWidth="2" />
            <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill={selected ? "white" : INK_SECONDARY}>
              {node.label}
            </text>
          </g>
        );
      })}
      {canReadD60 ? <CheckCircle2 x={244} y={119} width={18} height={18} color={GREEN} /> : <Ban x={244} y={119} width={18} height={18} color={VERMILION} />}
      <text x="158" y="154" textAnchor="middle" fontSize="11" fill={INK_MUTED}>
        confidence gate before synthesis
      </text>
    </svg>
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
  textAlign: "left",
};

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
