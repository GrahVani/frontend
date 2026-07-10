"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  ClipboardCheck,
  Compass,
  GitCompare,
  LockKeyhole,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";

type StepKey = "cusp" | "set" | "gate" | "margin" | "package";
type AyanamshaKey = "krishnamurti" | "lahiri";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const STEPS: Record<StepKey, { label: string; result: string; detail: string; icon: ReactNode }> = {
  cusp: {
    label: "Locate cusp",
    result: "Aquarius 12 deg 24",
    detail: "Lahiri Lagna Leo 12 deg 30 becomes KP-frame Leo 12 deg 24; the 7th cusp is exactly opposite.",
    icon: <Compass size={16} />,
  },
  set: {
    label: "Build 2/7/11 set",
    result: "Mercury, Moon, Saturn, Venus, Mars",
    detail: "The marriage house-set is rebuilt from occupancy, star-lord, ownership, and star-lord of owner.",
    icon: <ClipboardCheck size={16} />,
  },
  gate: {
    label: "Apply decisive gate",
    result: "Saturn qualifies",
    detail: "Saturn is in the combined set by direct 7th-house ownership, giving KP YES.",
    icon: <BadgeCheck size={16} />,
  },
  margin: {
    label: "Check boundary margin",
    result: "9 min KP / 3 min Lahiri",
    detail: "The verdict does not flip, but the margin shrinks close enough to require disclosure.",
    icon: <GitCompare size={16} />,
  },
  package: {
    label: "Package finding",
    result: "Cusp, ayanamsha, sub-lord, margin, set, verdict",
    detail: "A bare KP YES is not reviewable; the packaged finding is.",
    icon: <LockKeyhole size={16} />,
  },
};

const STEP_ORDER: StepKey[] = ["cusp", "set", "gate", "margin", "package"];

const AYANAMSHAS: Record<AyanamshaKey, { label: string; cusp: string; margin: string; note: string }> = {
  krishnamurti: {
    label: "Krishnamurti",
    cusp: "Aquarius 12 deg 24",
    margin: "about 9 minutes",
    note: "KP standard. Saturn sub-division holds with a real but not huge margin.",
  },
  lahiri: {
    label: "Lahiri",
    cusp: "Aquarius 12 deg 30",
    margin: "about 3 minutes",
    note: "Verdict still holds, but the Mercury boundary is much closer.",
  },
};

export function KpLayerBoundaryWorkedExampleLab() {
  const [step, setStep] = useState<StepKey>("cusp");
  const [ayanamsha, setAyanamsha] = useState<AyanamshaKey>("krishnamurti");
  const [cuspNamed, setCuspNamed] = useState(true);
  const [setNamed, setSetNamed] = useState(true);
  const [marginNamed, setMarginNamed] = useState(true);
  const [verdictOnly, setVerdictOnly] = useState(false);
  const [birthTimeGuess, setBirthTimeGuess] = useState(false);

  const currentStep = STEPS[step];
  const selectedAyanamsha = AYANAMSHAS[ayanamsha];

  const status = useMemo(() => {
    if (verdictOnly) return { label: "bare verdict", icon: <ShieldAlert size={18} /> };
    if (birthTimeGuess) return { label: "unsupported tolerance", icon: <ShieldAlert size={18} /> };
    if (!cuspNamed || !setNamed || !marginNamed) return { label: "package incomplete", icon: <ShieldAlert size={18} /> };
    return { label: "KP finding packaged", icon: <BadgeCheck size={18} /> };
  }, [birthTimeGuess, cuspNamed, marginNamed, setNamed, verdictOnly]);

  const packageLine = useMemo(() => {
    if (verdictOnly) return "Repair: do not report only KP YES. Name the cusp, ayanamsha, sub-lord, margin, set, and verdict.";
    if (birthTimeGuess) return "Repair: do not convert arcminute margin into birth-time tolerance without the separate birth-time tool.";
    if (!cuspNamed) return "Repair: name the 7th cusp and the ayanamsha used.";
    if (!setNamed) return "Repair: name the combined 2/7/11 significator set.";
    if (!marginNamed) return "Repair: disclose the Saturn-to-Mercury boundary margin.";
    return `KP finding: ${selectedAyanamsha.label} 7th cusp ${selectedAyanamsha.cusp}, Saturn sub-lord, ${selectedAyanamsha.margin} from the Mercury boundary, tested against Mercury, Moon, Saturn, Venus, Mars. Verdict: YES.`;
  }, [birthTimeGuess, cuspNamed, marginNamed, selectedAyanamsha, setNamed, verdictOnly]);

  return (
    <div data-interactive="kp-layer-boundary-worked-example-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP boundary worked example</p>
            <h2 style={headingStyle}>Rebuild the KP YES and disclose the margin behind it</h2>
            <p style={bodyStyle}>
              Replicate the Chart MD1 7th-cusp procedure, compare Krishnamurti and Lahiri margins, and package the KP finding so another practitioner can audit it.
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
          <p style={eyebrowStyle}>Five-step computation</p>
          <StepDiagram active={step} />
          <div style={stepGridStyle}>
            {STEP_ORDER.map((key, index) => (
              <button key={key} type="button" onClick={() => setStep(key)} style={stepButtonStyle(step === key)} aria-pressed={step === key}>
                <span>{index + 1}</span>
                {STEPS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected step</p>
          <div style={factPanelStyle}>
            <span style={{ color: ACCENT }}>{currentStep.icon}</span>
            <p style={panelTitleStyle}>{currentStep.result}</p>
            <p style={smallTextStyle}>{currentStep.detail}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Ayanamsha margin probe</p>
          <BoundaryDiagram ayanamsha={ayanamsha} />
          <div style={buttonGridStyle}>
            {(Object.keys(AYANAMSHAS) as AyanamshaKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setAyanamsha(key)} style={choiceStyle(ayanamsha === key)} aria-pressed={ayanamsha === key}>
                {AYANAMSHAS[key].label}
              </button>
            ))}
          </div>
          <p style={{ ...smallTextStyle, marginTop: "0.72rem" }}>{selectedAyanamsha.note}</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Packaging guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={cuspNamed} onChange={setCuspNamed} label="Cusp and ayanamsha named" icon={<Compass size={16} />} />
            <ToggleRow checked={setNamed} onChange={setSetNamed} label="2/7/11 set named" icon={<ClipboardCheck size={16} />} />
            <ToggleRow checked={marginNamed} onChange={setMarginNamed} label="Boundary margin disclosed" icon={<GitCompare size={16} />} />
            <ToggleRow checked={!verdictOnly} onChange={(checked) => setVerdictOnly(!checked)} label="No bare verdict" icon={<LockKeyhole size={16} />} />
            <ToggleRow checked={!birthTimeGuess} onChange={(checked) => setBirthTimeGuess(!checked)} label="No birth-time tolerance guess" icon={<ShieldAlert size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("cusp");
              setAyanamsha("krishnamurti");
              setCuspNamed(true);
              setSetNamed(true);
              setMarginNamed(true);
              setVerdictOnly(false);
              setBirthTimeGuess(false);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <SlidersHorizontal size={20} color={ACCENT} style={{ flex: "0 0 auto", marginTop: "0.14rem" }} />
          <div>
            <p style={eyebrowStyle}>Synthesis-input package</p>
            <p style={{ ...bodyStyle, marginTop: "0.32rem" }}>{packageLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepDiagram({ active }: { active: StepKey }) {
  return (
    <svg viewBox="0 0 680 160" role="img" aria-label="KP worked example five step computation" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="144" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {STEP_ORDER.map((key, index) => {
        const x = 72 + index * 134;
        const selected = active === key;
        return (
          <g key={key}>
            {index > 0 ? <path d={`M ${x - 78} 80 L ${x - 44} 80`} stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" /> : null}
            <circle cx={x} cy="80" r="34" fill={SURFACE} stroke={selected ? ACCENT : HAIRLINE} strokeWidth={selected ? 2 : 1} />
            <text x={x} y="77" textAnchor="middle" fontSize="11" fill={INK_PRIMARY}>{index + 1}</text>
            <text x={x} y="94" textAnchor="middle" fontSize="9" fill={INK_MUTED}>{STEPS[key].label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function BoundaryDiagram({ ayanamsha }: { ayanamsha: AyanamshaKey }) {
  const position = ayanamsha === "krishnamurti" ? 520 : 570;

  return (
    <svg viewBox="0 0 680 150" role="img" aria-label="Saturn sub-lord margin to Mercury boundary" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="134" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <rect x="78" y="64" width="500" height="18" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <rect x="78" y="64" width="420" height="18" rx="8" fill={SURFACE} stroke={ACCENT} />
      <line x1="578" y1="48" x2="578" y2="98" stroke={HAIRLINE} strokeWidth="2" />
      <text x="328" y="52" textAnchor="middle" fontSize="11" fill={INK_PRIMARY}>Saturn portion</text>
      <text x="618" y="52" textAnchor="middle" fontSize="11" fill={INK_MUTED}>Mercury</text>
      <circle cx={position} cy="73" r="9" fill={SURFACE} stroke={ACCENT} strokeWidth="2" />
      <text x={position} y="118" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>{AYANAMSHAS[ayanamsha].margin} clear</text>
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

const stepGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
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
  margin: "0.45rem 0 0",
  color: INK_PRIMARY,
  fontSize: "0.98rem",
  fontWeight: 500,
};

const factPanelStyle: CSSProperties = {
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

function stepButtonStyle(active: boolean): CSSProperties {
  return {
    ...buttonReset,
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
    color: active ? INK_PRIMARY : INK_SECONDARY,
    minHeight: 48,
    padding: "0.58rem 0.62rem",
    fontSize: "0.82rem",
    fontWeight: 500,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
  };
}

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
