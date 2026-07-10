"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ArrowDownUp, Ban, GitCompare, MessageSquareText, Orbit, RotateCcw, Scale, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type GrahaKey = "Mars" | "Sun" | "Mercury" | "Moon" | "Rahu" | "Ketu" | "Venus" | "Jupiter" | "Saturn";
type ViewKey = "relative" | "decline" | "response";

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

const SORTED_GRAHAS: Array<{ key: GrahaKey; index: number; position: "low" | "middle" | "high"; note: string; color: string }> = [
  { key: "Mars", index: 17, position: "low", note: "Lowest index in Chart S1, stated descriptively only.", color: VERMILION },
  { key: "Sun", index: 21, position: "low", note: "Early relative to the chart cluster, without a quality claim.", color: BLUE },
  { key: "Mercury", index: 25, position: "middle", note: "Part of the central cluster of Chart S1 indices.", color: GREEN },
  { key: "Moon", index: 31, position: "middle", note: "Shares 31 here as a chart-specific degree coincidence.", color: PURPLE },
  { key: "Rahu", index: 31, position: "middle", note: "Shares 31 with Ketu by structural nodal symmetry.", color: PURPLE },
  { key: "Ketu", index: 31, position: "middle", note: "Shares 31 with Rahu by structural nodal symmetry.", color: PURPLE },
  { key: "Venus", index: 37, position: "middle", note: "A higher middle index, still inside the main chart cluster.", color: GOLD },
  { key: "Jupiter", index: 41, position: "middle", note: "Next-highest after Saturn, but not a standalone arc claim.", color: BLUE },
  { key: "Saturn", index: 55, position: "high", note: "Clear high-end outlier, cross-referenced with high D1 degree and Atmakaraka status.", color: GREEN },
];

const VIEWS: Record<ViewKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  relative: {
    label: "Relative",
    title: "Compare positions inside one chart",
    body: "The index table can show clustering and outliers. It cannot assign favorability from raw number alone.",
    icon: <ArrowDownUp size={16} />,
    color: BLUE,
  },
  decline: {
    label: "Decline",
    title: "Refuse the life-arc overlay",
    body: "Low number does not mean early life-stage, and high number does not mean maturity or fruition.",
    icon: <Ban size={16} />,
    color: VERMILION,
  },
  response: {
    label: "Respond",
    title: "Redirect the client question",
    body: "Correct the popular claim gently, then redirect to D60 as WHY beneath independently supported D1 and D20 facts.",
    icon: <MessageSquareText size={16} />,
    color: GREEN,
  },
};

export function D60SpiritualPathArcLab() {
  const [selectedKey, setSelectedKey] = useState<GrahaKey>("Saturn");
  const [viewKey, setViewKey] = useState<ViewKey>("relative");
  const [relativeOnly, setRelativeOnly] = useState(true);
  const [declineLifeArc, setDeclineLifeArc] = useState(true);
  const [noQualityClaim, setNoQualityClaim] = useState(true);
  const [crossReference, setCrossReference] = useState(true);

  const selected = SORTED_GRAHAS.find((graha) => graha.key === selectedKey) ?? SORTED_GRAHAS[0];
  const view = VIEWS[viewKey];

  const status = useMemo(() => {
    if (!relativeOnly) return { label: "standalone number overread", color: GOLD };
    if (!declineLifeArc) return { label: "life-arc overlay risk", color: VERMILION };
    if (!noQualityClaim) return { label: "quality claim unsupported", color: VERMILION };
    if (!crossReference) return { label: "context missing", color: GOLD };
    return { label: "honest relative reading ready", color: GREEN };
  }, [crossReference, declineLifeArc, noQualityClaim, relativeOnly]);

  const reading = useMemo(() => {
    if (!relativeOnly) return "Keep the D60 number comparative. Raw position alone should not become a standalone spiritual-path claim.";
    if (!declineLifeArc) return "Decline the popular life-arc narrative. The lesson does not map low indices to early stages or high indices to mature stages.";
    if (!noQualityClaim) return "Do not call a low index weak or a high index strong. That would require a verified named-portion quality.";
    if (!crossReference) return "Use independently legitimate D1 or D20 facts before giving any interpretive weight to the position.";
    if (selected.key === "Saturn") return "Saturn at 55 is Chart S1 high-end outlier. Report it descriptively and cross-reference its high D1 degree and Atmakaraka status.";
    if (selected.key === "Mars") return "Mars at 17 is Chart S1 low end. Report the position plainly, then use ordinary D1 dignity for any interpretive context.";
    return `${selected.key} at ${selected.index}: ${selected.note}`;
  }, [crossReference, declineLifeArc, noQualityClaim, relativeOnly, selected]);

  return (
    <div data-interactive="d60-spiritual-path-arc-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>D60 spiritual path arc</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Sort the D60 indices without turning them into a life story
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Compare Chart S1 positions from low to high, identify outliers, and practise refusing unsupported name, quality, and chronological overlays.
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
          <p style={eyebrowStyle}>Relative-position sorter</p>
          <RelativeArcDiagram selectedKey={selectedKey} onSelect={setSelectedKey} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(94px, 1fr))", gap: "0.5rem", marginTop: "0.9rem" }}>
            {SORTED_GRAHAS.map((graha) => {
              const active = graha.key === selectedKey;
              return (
                <button
                  key={graha.key}
                  type="button"
                  onClick={() => setSelectedKey(graha.key)}
                  style={{
                    ...buttonReset,
                    minHeight: 74,
                    border: `1px solid ${active ? graha.color : HAIRLINE}`,
                    borderRadius: 8,
                    background: active ? "color-mix(in srgb, white 78%, var(--gl-card-surface-solid))" : "transparent",
                    color: active ? graha.color : INK_SECONDARY,
                    padding: "0.62rem",
                  }}
                  aria-pressed={active}
                >
                  <span style={{ display: "block", fontSize: "0.82rem", fontWeight: 600 }}>{graha.key}</span>
                  <span style={{ display: "block", marginTop: "0.28rem", fontSize: "1.08rem", fontWeight: 600 }}>#{graha.index}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Scope toggles</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={relativeOnly} onChange={setRelativeOnly} label="Use relative comparison only" icon={<GitCompare size={16} />} />
            <ToggleRow checked={declineLifeArc} onChange={setDeclineLifeArc} label="Decline life-stage mapping" icon={<Ban size={16} />} />
            <ToggleRow checked={noQualityClaim} onChange={setNoQualityClaim} label="No raw-number quality claim" icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={crossReference} onChange={setCrossReference} label="Cross-reference D1 or D20 facts" icon={<Scale size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedKey("Saturn");
              setViewKey("relative");
              setRelativeOnly(true);
              setDeclineLifeArc(true);
              setNoQualityClaim(true);
              setCrossReference(true);
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
            <p style={eyebrowStyle}>Honest-scope response</p>
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

function RelativeArcDiagram({ selectedKey, onSelect }: { selectedKey: GrahaKey; onSelect: (key: GrahaKey) => void }) {
  return (
    <svg viewBox="0 0 620 188" role="img" aria-label="Sorted D60 relative-position diagram" style={{ width: "100%", height: "auto", marginTop: "0.8rem" }}>
      <rect x="8" y="10" width="604" height="168" rx="8" fill="rgba(255,255,255,0.35)" stroke={HAIRLINE} />
      <text x="310" y="34" textAnchor="middle" fontSize="12" fill={INK_MUTED}>
        Chart S1 D60 indices sorted low to high
      </text>
      <line x1="52" y1="102" x2="568" y2="102" stroke={HAIRLINE} strokeWidth="2" />
      <text x="52" y="136" textAnchor="middle" fontSize="11" fill={INK_MUTED}>
        low
      </text>
      <text x="310" y="136" textAnchor="middle" fontSize="11" fill={INK_MUTED}>
        central cluster
      </text>
      <text x="568" y="136" textAnchor="middle" fontSize="11" fill={INK_MUTED}>
        high
      </text>
      {SORTED_GRAHAS.map((graha) => {
        const x = 52 + ((graha.index - 1) / 59) * 516;
        const active = graha.key === selectedKey;
        const y = graha.key === "Rahu" ? 78 : graha.key === "Ketu" ? 126 : 102;
        return (
          <g key={graha.key} onClick={() => onSelect(graha.key)} style={{ cursor: "pointer" }}>
            <circle cx={x} cy={y} r={active ? 18 : 13} fill={active ? graha.color : SURFACE} stroke={graha.color} strokeWidth="2" />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="9" fontWeight="600" fill={active ? "white" : graha.color}>
              {graha.index}
            </text>
            <text x={x} y={y - 24} textAnchor="middle" fontSize="10" fill={active ? graha.color : INK_SECONDARY}>
              {graha.key}
            </text>
          </g>
        );
      })}
      <Orbit x={500} y={42} width={18} height={18} color={GOLD} />
      <text x="526" y="56" fontSize="11" fill={INK_MUTED}>
        outlier is descriptive, not a quality claim
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
