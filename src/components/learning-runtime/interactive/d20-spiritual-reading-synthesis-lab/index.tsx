"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Compass, GitCompare, Layers3, MessageSquareText, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type StepKey = "construct" | "houses" | "karakas" | "verdict";
type LayerKey = "all" | "strong" | "complicated" | "speculative";

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

const STEPS: Record<StepKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  construct: {
    label: "Construct",
    title: "Begin with the completed D20 table",
    body: "Use the Vimshamsha construction from Lesson 12.2.1 before reading any houses or karakas.",
    icon: <Layers3 size={16} />,
    color: BLUE,
  },
  houses: {
    label: "Houses",
    title: "Read from the D20 Lagna",
    body: "Fix Gemini as the D20 Lagna, then read the 5th, 9th, and 12th from that chart.",
    icon: <Compass size={16} />,
    color: GREEN,
  },
  karakas: {
    label: "Karakas",
    title: "Overlay three separate voices",
    body: "Report Jupiter, Ketu, and Saturn separately, with house placement and dignity kept visible.",
    icon: <GitCompare size={16} />,
    color: PURPLE,
  },
  verdict: {
    label: "Verdict",
    title: "State a calibrated disposition",
    body: "Give the confidence tier after sorting clean, complicated, and speculative findings.",
    icon: <MessageSquareText size={16} />,
    color: GOLD,
  },
};

const FINDINGS = [
  {
    layer: "strong",
    label: "D20 Lagna",
    title: "Gemini Lagna with Sun and Moon",
    body: "A clean centrality signal: practice identity is visible and repeated through both luminaries.",
    color: BLUE,
  },
  {
    layer: "strong",
    label: "D20 5th",
    title: "Exalted Saturn in Libra",
    body: "The mantra and upasana house carries the strongest discipline signal in the chapter.",
    color: GREEN,
  },
  {
    layer: "complicated",
    label: "Jupiter",
    title: "Virgo, D20 4th, enemy sign",
    body: "Wisdom and guru guidance are present, but the dignity adds friction rather than a clean lift.",
    color: GOLD,
  },
  {
    layer: "speculative",
    label: "D20 9th",
    title: "Rahu and Ketu on dharma",
    body: "A striking nodal dharma signature, reported with caution because nodal reading is less settled.",
    color: PURPLE,
  },
  {
    layer: "complicated",
    label: "D20 12th",
    title: "Empty house, read through Venus",
    body: "The moksha house is not ignored; its lord carries the secondary channel through the D20 7th.",
    color: VERMILION,
  },
] as const;

const STEP_ORDER: StepKey[] = ["construct", "houses", "karakas", "verdict"];
const LAYER_OPTIONS: Array<{ key: LayerKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "strong", label: "Strong" },
  { key: "complicated", label: "Complicated" },
  { key: "speculative", label: "Speculative" },
];

export function D20SpiritualReadingSynthesisLab() {
  const [stepKey, setStepKey] = useState<StepKey>("construct");
  const [layerKey, setLayerKey] = useState<LayerKey>("all");
  const [keepOrder, setKeepOrder] = useState(true);
  const [useD20Lagna, setUseD20Lagna] = useState(true);
  const [separateFindings, setSeparateFindings] = useState(true);
  const [capacityOnly, setCapacityOnly] = useState(true);

  const step = STEPS[stepKey];
  const stepNumber = STEP_ORDER.indexOf(stepKey) + 1;
  const visibleFindings = FINDINGS.filter((finding) => layerKey === "all" || finding.layer === layerKey);

  const status = useMemo(() => {
    if (!keepOrder) return { label: "sequence skipped", color: VERMILION };
    if (!useD20Lagna) return { label: "wrong Lagna frame", color: VERMILION };
    if (!separateFindings) return { label: "tier inflation risk", color: GOLD };
    if (!capacityOnly) return { label: "destiny overclaim", color: VERMILION };
    return { label: "synthesis ready", color: GREEN };
  }, [capacityOnly, keepOrder, separateFindings, useD20Lagna]);

  const reading = useMemo(() => {
    if (!keepOrder) return "Run construction, house-reading, karaka overlay, and verdict in order. A confidence tier without the steps is not defensible.";
    if (!useD20Lagna) return "Count the 5th, 9th, and 12th from the D20 Lagna. Do not import the D1 Lagna frame into this reading.";
    if (!separateFindings) return "Keep the clean, complicated, and speculative findings separate before naming the tier.";
    if (!capacityOnly) return "State capacity for devotional and spiritual practice, not an active practice or a destined outcome.";
    return "Chart S1 D20 verdict: Moderate, trending toward Strong. Two clean indicators converge, Jupiter adds a real but complicated third signal, and the nodal 9th is reported separately.";
  }, [capacityOnly, keepOrder, separateFindings, useD20Lagna]);

  return (
    <div data-interactive="d20-spiritual-reading-synthesis-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>D20 worked synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Build Chart S1 into one calibrated spiritual-path reading
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Move through the four-step sequence, filter the evidence by confidence, and keep the final verdict bounded as disposition rather than destiny.
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
              whiteSpace: "nowrap",
              background: "color-mix(in srgb, currentColor 8%, transparent)",
            }}
          >
            {status.label}
          </span>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Sequence map</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
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
                    minHeight: 86,
                    border: `1px solid ${active ? item.color : HAIRLINE}`,
                    background: active ? "color-mix(in srgb, white 76%, var(--gl-card-surface-solid))" : "transparent",
                    color: active ? item.color : INK_SECONDARY,
                    borderRadius: 8,
                    padding: "0.7rem",
                    display: "grid",
                    alignContent: "space-between",
                    gap: "0.55rem",
                  }}
                  aria-pressed={active}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", fontWeight: 600 }}>
                    {item.icon}
                    Step {index + 1}
                  </span>
                  <span style={{ fontSize: "0.9rem", lineHeight: 1.25 }}>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "minmax(220px, 0.8fr) minmax(0, 1fr)", gap: "1rem", alignItems: "center" }}>
            <SynthesisDiagram stepKey={stepKey} />
            <div>
              <p style={{ margin: 0, color: step.color, fontSize: "0.78rem", fontWeight: 600 }}>Step {stepNumber}</p>
              <h3 style={{ margin: "0.25rem 0", color: INK_PRIMARY, fontSize: "1.05rem", fontWeight: 600 }}>{step.title}</h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{step.body}</p>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={keepOrder} onChange={setKeepOrder} label="Use the four-step sequence" icon={<Layers3 size={16} />} />
            <ToggleRow checked={useD20Lagna} onChange={setUseD20Lagna} label="Count houses from D20 Lagna" icon={<Compass size={16} />} />
            <ToggleRow checked={separateFindings} onChange={setSeparateFindings} label="Sort findings before the tier" icon={<Scale size={16} />} />
            <ToggleRow checked={capacityOnly} onChange={setCapacityOnly} label="Say capacity, not destiny" icon={<ShieldCheck size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setStepKey("construct");
              setLayerKey("all");
              setKeepOrder(true);
              setUseD20Lagna(true);
              setSeparateFindings(true);
              setCapacityOnly(true);
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
            <p style={eyebrowStyle}>Evidence sorter</p>
            <h3 style={{ margin: "0.22rem 0 0", fontSize: "1.05rem", fontWeight: 600, color: INK_PRIMARY }}>Separate clean, complicated, and speculative findings</h3>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {LAYER_OPTIONS.map((option) => {
              const active = option.key === layerKey;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setLayerKey(option.key)}
                  style={{
                    ...buttonReset,
                    border: `1px solid ${active ? BLUE : HAIRLINE}`,
                    color: active ? BLUE : INK_SECONDARY,
                    borderRadius: 999,
                    padding: "0.45rem 0.7rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    background: active ? "color-mix(in srgb, white 80%, var(--gl-card-surface-solid))" : "transparent",
                  }}
                  aria-pressed={active}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.75rem", marginTop: "0.9rem" }}>
          {visibleFindings.map((finding) => (
            <article key={`${finding.layer}-${finding.label}`} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.85rem", background: "rgba(255,255,255,0.32)" }}>
              <p style={{ margin: 0, color: finding.color, fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{finding.label}</p>
              <h4 style={{ margin: "0.28rem 0", color: INK_PRIMARY, fontSize: "0.98rem", fontWeight: 600 }}>{finding.title}</h4>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.48, fontSize: "0.92rem" }}>{finding.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...cardStyle, borderColor: status.color }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <span style={{ color: status.color, marginTop: "0.1rem" }}>{status.color === GREEN ? <Sparkles size={20} /> : <TriangleAlert size={20} />}</span>
          <div>
            <p style={eyebrowStyle}>Final statement</p>
            <p style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, lineHeight: 1.58 }}>{reading}</p>
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

function SynthesisDiagram({ stepKey }: { stepKey: StepKey }) {
  const active = STEPS[stepKey].color;
  const nodes = [
    { key: "construct", x: 50, y: 38, label: "D20" },
    { key: "houses", x: 150, y: 38, label: "5/9/12" },
    { key: "karakas", x: 250, y: 38, label: "J/K/S" },
    { key: "verdict", x: 150, y: 112, label: "Tier" },
  ] as const;

  return (
    <svg viewBox="0 0 300 150" role="img" aria-label="Four-step D20 synthesis diagram" style={{ width: "100%", maxWidth: 340, height: "auto" }}>
      <rect x="8" y="8" width="284" height="134" rx="8" fill="rgba(255,255,255,0.35)" stroke={HAIRLINE} />
      <path d="M80 38 H120 M180 38 H220 M250 58 C245 98 205 112 178 112 M50 58 C57 96 99 112 122 112" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      {nodes.map((node) => {
        const selected = node.key === stepKey;
        return (
          <g key={node.key}>
            <circle cx={node.x} cy={node.y} r={selected ? 26 : 22} fill={selected ? active : SURFACE} stroke={selected ? active : HAIRLINE} strokeWidth="2" />
            <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill={selected ? "white" : INK_SECONDARY}>
              {node.label}
            </text>
          </g>
        );
      })}
      <text x="150" y="136" textAnchor="middle" fontSize="11" fill={INK_MUTED}>
        construction to calibrated disposition
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
