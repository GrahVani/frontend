"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Anchor,
  BadgeCheck,
  GitBranch,
  Layers3,
  LockKeyhole,
  RotateCcw,
  ShieldAlert,
  Split,
} from "lucide-react";

type OutcomeKey = "augment" | "complicate";
type StrengthKey = "weak" | "strong";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const OUTCOMES: Record<OutcomeKey, { label: string; text: string }> = {
  augment: {
    label: "Augment",
    text: "A later stream independently corroborates the anchor direction and may raise combined confidence.",
  },
  complicate: {
    label: "Complicate",
    text: "A later stream points another way, creating genuine divergence for the matrix to hold honestly.",
  },
};

const STRENGTHS: Record<StrengthKey, { label: string; statement: string }> = {
  weak: {
    label: "Actual weak-to-moderate anchor",
    statement: "Chapter 2's Parashara finding is weak-to-moderate, leaning weak.",
  },
  strong: {
    label: "Counterfactual strong anchor",
    statement: "Even a strong Parashara finding would still be one stream's input, not the final five-stream verdict.",
  },
};

export function ParasharaAnchorNotVerdictLab() {
  const [outcome, setOutcome] = useState<OutcomeKey>("augment");
  const [strength, setStrength] = useState<StrengthKey>("weak");
  const [carryForward, setCarryForward] = useState(true);
  const [scopeLimited, setScopeLimited] = useState(true);
  const [noPrivilege, setNoPrivilege] = useState(true);
  const [noPrediction, setNoPrediction] = useState(true);
  const [symmetric, setSymmetric] = useState(true);

  const status = useMemo(() => {
    if (!carryForward) return { label: "anchor dropped", icon: <ShieldAlert size={18} /> };
    if (!scopeLimited) return { label: "scope overclaim", icon: <ShieldAlert size={18} /> };
    if (!noPrivilege) return { label: "default-guess error", icon: <ShieldAlert size={18} /> };
    if (!noPrediction) return { label: "later stream guessed", icon: <ShieldAlert size={18} /> };
    if (!symmetric) return { label: "symmetry missing", icon: <ShieldAlert size={18} /> };
    return { label: "anchor discipline ready", icon: <BadgeCheck size={18} /> };
  }, [carryForward, noPrediction, noPrivilege, scopeLimited, symmetric]);

  const clientLine = useMemo(() => {
    if (!carryForward) return "Repair: the Parashara finding does not disappear. It is carried forward exactly as computed.";
    if (!scopeLimited) return "Repair: the Parashara result is complete for one stream, but partial in five-stream scope.";
    if (!noPrivilege) return "Repair: later streams do not bear a special burden to overturn the Parashara anchor.";
    if (!noPrediction) return "Repair: do not predict what KP, Jaimini, Lal Kitab, or Tajika will find before they are run.";
    if (!symmetric) return "Repair: the same rule applies whether the Parashara finding is weak or strong.";
    return `${STRENGTHS[strength].statement} It can be ${OUTCOMES[outcome].label.toLowerCase()}d later, but it remains one real input at the same evidentiary table.`;
  }, [carryForward, noPrediction, noPrivilege, outcome, scopeLimited, strength, symmetric]);

  return (
    <div data-interactive="parashara-anchor-not-verdict-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Anchor, not verdict</p>
            <h2 style={headingStyle}>Carry the Parashara result forward without privileging it</h2>
            <p style={bodyStyle}>
              Practice the chapter-close discipline: the anchor is real, complete for its stream, scope-limited, and never a default guess other streams must overturn.
            </p>
          </div>
          <span style={statusPillStyle}>
            {status.icon}
            {status.label}
          </span>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Evidence table</p>
          <AnchorTable outcome={outcome} strength={strength} />
          <div style={buttonGridStyle}>
            <button type="button" onClick={() => setOutcome("augment")} style={choiceStyle(outcome === "augment")} aria-pressed={outcome === "augment"}>
              Augmentation path
            </button>
            <button type="button" onClick={() => setOutcome("complicate")} style={choiceStyle(outcome === "complicate")} aria-pressed={outcome === "complicate"}>
              Complication path
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Symmetry test</p>
          <div style={buttonGridStyle}>
            <button type="button" onClick={() => setStrength("weak")} style={choiceStyle(strength === "weak")} aria-pressed={strength === "weak"}>
              Weak anchor
            </button>
            <button type="button" onClick={() => setStrength("strong")} style={choiceStyle(strength === "strong")} aria-pressed={strength === "strong"}>
              Strong anchor
            </button>
          </div>
          <p style={{ ...smallTextStyle, marginTop: "0.78rem" }}>{STRENGTHS[strength].statement}</p>
          <p style={smallTextStyle}>The scope rule does not change with comfort level.</p>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={carryForward} onChange={setCarryForward} label="Carry anchor forward" icon={<Anchor size={16} />} />
            <ToggleRow checked={scopeLimited} onChange={setScopeLimited} label="Limit scope to one stream" icon={<Layers3 size={16} />} />
            <ToggleRow checked={noPrivilege} onChange={setNoPrivilege} label="No privileged default guess" icon={<Split size={16} />} />
            <ToggleRow checked={noPrediction} onChange={setNoPrediction} label="No guessing later streams" icon={<LockKeyhole size={16} />} />
            <ToggleRow checked={symmetric} onChange={setSymmetric} label="Apply symmetrically" icon={<GitBranch size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setOutcome("augment");
              setStrength("weak");
              setCarryForward(true);
              setScopeLimited(true);
              setNoPrivilege(true);
              setNoPrediction(true);
              setSymmetric(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Client-safe phrasing</p>
          <div style={phrasePanelStyle}>
            <p style={panelTitleStyle}>{OUTCOMES[outcome].label}</p>
            <p style={smallTextStyle}>{OUTCOMES[outcome].text}</p>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <BadgeCheck size={20} color={ACCENT} style={{ flex: "0 0 auto", marginTop: "0.14rem" }} />
          <div>
            <p style={eyebrowStyle}>Anchor statement</p>
            <p style={{ ...bodyStyle, marginTop: "0.32rem" }}>{clientLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AnchorTable({ outcome, strength }: { outcome: OutcomeKey; strength: StrengthKey }) {
  const laterLabel = outcome === "augment" ? "Later stream agrees" : "Later stream diverges";
  const anchorLabel = strength === "weak" ? "Parashara weak-to-moderate" : "Parashara strong";

  return (
    <svg viewBox="0 0 680 190" role="img" aria-label="Parashara anchor sits at same evidentiary table as later streams" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="174" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <rect x="52" y="54" width="190" height="70" rx="8" fill={SURFACE} stroke={ACCENT} strokeWidth="2" />
      <text x="147" y="82" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>Anchor</text>
      <text x="147" y="104" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>{anchorLabel}</text>
      <path d="M 252 90 C 300 90, 318 90, 366 90" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" />
      <rect x="386" y="54" width="242" height="70" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="507" y="82" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>Later stream contribution</text>
      <text x="507" y="104" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>{laterLabel}</text>
      <text x="340" y="154" textAnchor="middle" fontSize="11" fill={INK_MUTED}>same evidentiary table, no hierarchy of trust</text>
    </svg>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem" }}>{icon}{label}</span>
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

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.72fr)",
  gap: "1rem",
};

const buttonGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.52rem",
  marginTop: "0.85rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.22rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.25rem",
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.58,
  maxWidth: 940,
};

const smallTextStyle: CSSProperties = {
  margin: "0.22rem 0 0",
  color: INK_SECONDARY,
  fontSize: "0.86rem",
  lineHeight: 1.48,
};

const panelTitleStyle: CSSProperties = {
  margin: 0,
  color: INK_PRIMARY,
  fontSize: "0.98rem",
  fontWeight: 500,
};

const phrasePanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "0.9rem",
  marginTop: "0.85rem",
};

const statusPillStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 999,
  color: INK_PRIMARY,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.38rem",
  padding: "0.42rem 0.68rem",
  fontSize: "0.78rem",
  fontWeight: 500,
  background: SURFACE,
  whiteSpace: "nowrap",
};

const buttonReset: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
};

function choiceStyle(active: boolean): CSSProperties {
  return {
    ...buttonReset,
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
    color: active ? INK_PRIMARY : INK_SECONDARY,
    minHeight: 42,
    padding: "0.55rem 0.62rem",
    fontSize: "0.84rem",
    fontWeight: 500,
    textAlign: "center",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    padding: "0.62rem 0.7rem",
    color: checked ? INK_PRIMARY : INK_MUTED,
    cursor: "pointer",
    background: checked ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
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
  fontWeight: 500,
};
