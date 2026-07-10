"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Calculator, Clock3, EyeOff, GitCompare, Layers3, RotateCcw, Scale, Sparkles, TriangleAlert } from "lucide-react";

type GrahaKey = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";
type ViewKey = "formula" | "precision" | "why";

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

const GRAHAS: Array<{ key: GrahaKey; degree: number; index: number; note: string; color: string }> = [
  { key: "Sun", degree: 10, index: 21, note: "Index is computed from 10 degrees within the sign.", color: BLUE },
  { key: "Moon", degree: 15, index: 31, note: "Shares index 31 with the nodes by this chart's stipulated degree.", color: PURPLE },
  { key: "Mars", degree: 8, index: 17, note: "A simple index-only result; no name or quality is asserted.", color: VERMILION },
  { key: "Mercury", degree: 12, index: 25, note: "Recognition-level computation stops at the number.", color: GREEN },
  { key: "Jupiter", degree: 20, index: 41, note: "Index 41 is part of the table, not a fresh spiritual verdict.", color: BLUE },
  { key: "Venus", degree: 18, index: 37, note: "The D60 answers why beneath existing findings, not a new what.", color: GOLD },
  { key: "Saturn", degree: 27, index: 55, note: "Saturn's late index and Atmakaraka status share the same high degree root.", color: GREEN },
  { key: "Rahu", degree: 15, index: 31, note: "Node symmetry guarantees Rahu and Ketu share the same index.", color: PURPLE },
  { key: "Ketu", degree: 15, index: 31, note: "Node symmetry is structural; Moon sharing 31 here is chart-specific.", color: PURPLE },
];

const VIEWS: Record<ViewKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  formula: {
    label: "Formula",
    title: "Index = floor(degree x 2) + 1",
    body: "Each sign is divided into sixty half-degree parts. This lab shows the index only.",
    icon: <Calculator size={16} />,
    color: BLUE,
  },
  precision: {
    label: "Precision",
    title: "D60 is gated by birth-time confidence",
    body: "Chart S1 is treated as precisely known for teaching. Approximate real-client times should decline D60 reading.",
    icon: <Clock3 size={16} />,
    color: VERMILION,
  },
  why: {
    label: "WHY",
    title: "Read beneath the existing WHAT",
    body: "D60 does not invent a new spiritual-path claim. It looks under the D1 and D20 findings already established.",
    icon: <Layers3 size={16} />,
    color: GREEN,
  },
};

export function D60KarmicSubstrateIndexLab() {
  const [selectedKey, setSelectedKey] = useState<GrahaKey>("Saturn");
  const [viewKey, setViewKey] = useState<ViewKey>("formula");
  const [preciseTime, setPreciseTime] = useState(true);
  const [indexOnly, setIndexOnly] = useState(true);
  const [whyNotWhat, setWhyNotWhat] = useState(true);
  const [separateCoincidence, setSeparateCoincidence] = useState(true);

  const selected = GRAHAS.find((graha) => graha.key === selectedKey) ?? GRAHAS[0];
  const view = VIEWS[viewKey];

  const status = useMemo(() => {
    if (!preciseTime) return { label: "D60 output declined", color: VERMILION };
    if (!indexOnly) return { label: "scope limit broken", color: VERMILION };
    if (!whyNotWhat) return { label: "fresh-prediction warning", color: GOLD };
    if (!separateCoincidence) return { label: "coincidence overread", color: GOLD };
    return { label: "index-only substrate ready", color: GREEN };
  }, [indexOnly, preciseTime, separateCoincidence, whyNotWhat]);

  const reading = useMemo(() => {
    if (!preciseTime) return "Decline the D60 reading. The D60 is too birth-time sensitive for approximate real-client data.";
    if (!indexOnly) return "Return to index-only output. This lesson does not assert a D60 sign, deity name, or quality.";
    if (!whyNotWhat) return "Use the D60 as WHY beneath the already-established D1 and D20 WHAT, not as a standalone new prediction.";
    if (!separateCoincidence) return "Do not inflate repeated index 31 into a major convergence. Node symmetry is structural; Moon sharing the number here is chart-specific.";
    if (selected.key === "Saturn") return "Saturn index 55 is the key worked example: the same late within-sign degree also explains Saturn's Atmakaraka ranking.";
    return `${selected.key} index ${selected.index}: ${selected.note}`;
  }, [indexOnly, preciseTime, selected, separateCoincidence, whyNotWhat]);

  return (
    <div data-interactive="d60-karmic-substrate-index-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>D60 karmic substrate</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Compute Chart S1 indices without crossing the precision boundary
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Select a graha, inspect its half-degree index, and keep the reading framed as index-only WHY beneath the D1 and D20 findings.
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
          <p style={eyebrowStyle}>Chart S1 D60 table</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(86px, 1fr))", gap: "0.5rem", marginTop: "0.75rem" }}>
            {GRAHAS.map((graha) => {
              const active = graha.key === selectedKey;
              return (
                <button
                  key={graha.key}
                  type="button"
                  onClick={() => setSelectedKey(graha.key)}
                  style={{
                    ...buttonReset,
                    border: `1px solid ${active ? graha.color : HAIRLINE}`,
                    borderRadius: 8,
                    background: active ? "color-mix(in srgb, white 78%, var(--gl-card-surface-solid))" : "transparent",
                    color: active ? graha.color : INK_SECONDARY,
                    padding: "0.62rem",
                    minHeight: 74,
                  }}
                  aria-pressed={active}
                >
                  <span style={{ display: "block", fontSize: "0.82rem", fontWeight: 600 }}>{graha.key}</span>
                  <span style={{ display: "block", marginTop: "0.28rem", fontSize: "1.08rem", fontWeight: 600 }}>#{graha.index}</span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "minmax(220px, 0.86fr) minmax(0, 1fr)", gap: "1rem", alignItems: "center" }}>
            <D60IndexStrip degree={selected.degree} index={selected.index} color={selected.color} />
            <div>
              <p style={{ margin: 0, color: selected.color, fontSize: "0.78rem", fontWeight: 600 }}>{selected.key} within-sign degree</p>
              <h3 style={{ margin: "0.24rem 0", color: INK_PRIMARY, fontSize: "1.05rem", fontWeight: 600 }}>
                {selected.degree} deg gives D60 index {selected.index}
              </h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                floor({selected.degree} x 2) + 1 = {selected.index}. The lab stops here, matching the lesson recognition-level limit.
              </p>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Precision discipline</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={preciseTime} onChange={setPreciseTime} label="Chart time treated as precise" icon={<Clock3 size={16} />} />
            <ToggleRow checked={indexOnly} onChange={setIndexOnly} label="Keep output index-only" icon={<EyeOff size={16} />} />
            <ToggleRow checked={whyNotWhat} onChange={setWhyNotWhat} label="Read WHY beneath WHAT" icon={<GitCompare size={16} />} />
            <ToggleRow checked={separateCoincidence} onChange={setSeparateCoincidence} label="Do not overread coincidences" icon={<Scale size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedKey("Saturn");
              setViewKey("formula");
              setPreciseTime(true);
              setIndexOnly(true);
              setWhyNotWhat(true);
              setSeparateCoincidence(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.6rem" }}>
          {(Object.keys(VIEWS) as ViewKey[]).map((key) => {
            const item = VIEWS[key];
            const active = key === viewKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setViewKey(key)}
                style={{
                  ...buttonReset,
                  border: `1px solid ${active ? item.color : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? "color-mix(in srgb, white 78%, var(--gl-card-surface-solid))" : "transparent",
                  color: active ? item.color : INK_SECONDARY,
                  padding: "0.75rem",
                  minHeight: 94,
                }}
                aria-pressed={active}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.38rem", fontSize: "0.78rem", fontWeight: 600 }}>
                  {item.icon}
                  {item.label}
                </span>
                <span style={{ display: "block", marginTop: "0.4rem", color: active ? INK_PRIMARY : INK_SECONDARY, lineHeight: 1.35 }}>{item.title}</span>
              </button>
            );
          })}
        </div>
        <p style={{ margin: "0.85rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{view.body}</p>
      </section>

      <section style={{ ...cardStyle, borderColor: status.color }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <span style={{ color: status.color, marginTop: "0.1rem" }}>{status.color === GREEN ? <Sparkles size={20} /> : <TriangleAlert size={20} />}</span>
          <div>
            <p style={eyebrowStyle}>Reading boundary</p>
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

function D60IndexStrip({ degree, index, color }: { degree: number; index: number; color: string }) {
  const markerX = (degree / 30) * 280 + 10;
  return (
    <svg viewBox="0 0 300 134" role="img" aria-label="D60 half-degree index strip" style={{ width: "100%", maxWidth: 360, height: "auto" }}>
      <rect x="8" y="12" width="284" height="110" rx="8" fill="rgba(255,255,255,0.35)" stroke={HAIRLINE} />
      <text x="150" y="32" textAnchor="middle" fontSize="12" fill={INK_MUTED}>
        one sign divided into 60 half-degree parts
      </text>
      {Array.from({ length: 61 }).map((_, tick) => {
        const x = 10 + (tick / 60) * 280;
        const tall = tick % 10 === 0;
        return <line key={tick} x1={x} y1={62} x2={x} y2={tall ? 88 : 78} stroke={tick === index ? color : HAIRLINE} strokeWidth={tick === index ? 2 : 1} />;
      })}
      <rect x={markerX - 3} y="54" width="6" height="42" rx="3" fill={color} />
      <circle cx={markerX} cy="54" r="8" fill={color} />
      <text x={markerX} y="58" textAnchor="middle" fontSize="8" fontWeight="600" fill="white">
        {index}
      </text>
      <text x="12" y="106" fontSize="11" fill={INK_MUTED}>
        0 deg
      </text>
      <text x="288" y="106" textAnchor="end" fontSize="11" fill={INK_MUTED}>
        30 deg
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
