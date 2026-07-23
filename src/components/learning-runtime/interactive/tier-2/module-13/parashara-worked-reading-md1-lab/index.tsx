"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  CalendarClock,
  CircleHelp,
  ClipboardCheck,
  Eye,
  Grid3X3,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";

type StepKey = "strength" | "dosha" | "dasha" | "transit" | "synthesis";
type ReferenceKey = "lagna" | "moon";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const STEPS: Record<StepKey, { label: string; result: string; detail: string; icon: ReactNode }> = {
  strength: {
    label: "Dignity and strength",
    result: "Weak 7th house",
    detail: "Aquarius is unoccupied; Saturn sits in the 12th in Cancer, an enemy sign, with malefic-only aspection and no benefic relief.",
    icon: <Grid3X3 size={16} />,
  },
  dosha: {
    label: "Yogas and doshas",
    result: "No Mangal Dosha",
    detail: "Mars is not in a triggering house from either Lagna or Moon. Jupiter is strong by own-sign trine placement, but no unverified yoga label is added.",
    icon: <ClipboardCheck size={16} />,
  },
  dasha: {
    label: "Dasha context",
    result: "Saturn dasha is salient",
    detail: "Saturn Mahadasha begins 15 June 2026, activating the same graha already found troubled for the 7th-house question.",
    icon: <CalendarClock size={16} />,
  },
  transit: {
    label: "Transit context",
    result: "No independent transit yes",
    detail: "No computed benefic transit confirmation is asserted in this pass, so the two-yes principle is not satisfied.",
    icon: <Eye size={16} />,
  },
  synthesis: {
    label: "Synthesis and confidence",
    result: "Weak-to-moderate, leaning weak",
    detail: "One salient timing indicator sits against a genuinely weak static promise, with no second independent confirmation.",
    icon: <SlidersHorizontal size={16} />,
  },
};

const STEP_ORDER: StepKey[] = ["strength", "dosha", "dasha", "transit", "synthesis"];

const DOSHA_POSITIONS = [1, 2, 4, 7, 8, 12];
const DOSHA_RESULTS: Record<ReferenceKey, { label: string; marsPosition: number; note: string }> = {
  lagna: {
    label: "From Lagna",
    marsPosition: 6,
    note: "Leo as 1st places Mars in Capricorn, the 6th house. This is not a classical trigger position.",
  },
  moon: {
    label: "From Moon",
    marsPosition: 9,
    note: "Taurus Moon as 1st places Mars in Capricorn, the 9th from Moon. This is also not a trigger position.",
  },
};

export function ParasharaWorkedReadingMd1Lab() {
  const [step, setStep] = useState<StepKey>("strength");
  const [reference, setReference] = useState<ReferenceKey>("lagna");
  const [staticPromise, setStaticPromise] = useState(true);
  const [cleanDosha, setCleanDosha] = useState(true);
  const [dashaSalience, setDashaSalience] = useState(true);
  const [transitConfirmation, setTransitConfirmation] = useState(false);
  const [avoidYogaOverclaim, setAvoidYogaOverclaim] = useState(true);

  const currentStep = STEPS[step];
  const dosha = DOSHA_RESULTS[reference];
  const doshaTriggered = DOSHA_POSITIONS.includes(dosha.marsPosition);

  const status = useMemo(() => {
    if (!avoidYogaOverclaim) return { label: "yoga overclaim risk", icon: <ShieldAlert size={18} /> };
    if (transitConfirmation) return { label: "two-yes overclaim", icon: <ShieldAlert size={18} /> };
    if (!staticPromise || !cleanDosha || !dashaSalience) return { label: "step missing", icon: <ShieldAlert size={18} /> };
    return { label: "Parashara verdict ready", icon: <BadgeCheck size={18} /> };
  }, [avoidYogaOverclaim, cleanDosha, dashaSalience, staticPromise, transitConfirmation]);

  const verdictLine = useMemo(() => {
    if (!avoidYogaOverclaim) {
      return "Repair the yoga language: report Jupiter as own-sign in a trikona, but do not name a yoga whose criteria have not been verified.";
    }
    if (transitConfirmation) {
      return "Repair the two-yes logic: this pass has dasha salience, not an independent transit confirmation.";
    }
    if (!staticPromise) return "Restore Step 1: the weak static 7th-house promise is the base finding.";
    if (!cleanDosha) return "Restore Step 2: no Mangal Dosha is a clean null result, not a positive confirming factor.";
    if (!dashaSalience) return "Restore Step 3: Saturn dasha onset makes the question salient, but not favourable by itself.";
    return "Final Parashara-only tier: weak-to-moderate, leaning weak. The two-yes principle is not met.";
  }, [avoidYogaOverclaim, cleanDosha, dashaSalience, staticPromise, transitConfirmation]);

  return (
    <div data-interactive="parashara-worked-reading-md1-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Parashara worked reading</p>
            <h2 style={headingStyle}>Run Chart MD1 through all five Parashara steps</h2>
            <p style={bodyStyle}>
              Verify the weak 7th-house promise, clean Mangal Dosha result, Saturn dasha salience, missing transit confirmation, and final weak-leaning tier.
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
          <p style={eyebrowStyle}>Five-step run</p>
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
          <p style={eyebrowStyle}>Mangal Dosha checker</p>
          <div style={toggleButtonRowStyle}>
            {(Object.keys(DOSHA_RESULTS) as ReferenceKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setReference(key)} style={choiceStyle(reference === key)} aria-pressed={reference === key}>
                {DOSHA_RESULTS[key].label}
              </button>
            ))}
          </div>
          <DoshaStrip active={dosha.marsPosition} />
          <p style={{ ...smallTextStyle, marginTop: "0.72rem" }}>
            Mars is {dosha.marsPosition} from {reference === "lagna" ? "Lagna" : "Moon"}. {doshaTriggered ? "This would trigger the dosha." : "This does not trigger the dosha."}
          </p>
          <p style={smallTextStyle}>{dosha.note}</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Verdict guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={staticPromise} onChange={setStaticPromise} label="Weak static promise retained" icon={<Grid3X3 size={16} />} />
            <ToggleRow checked={cleanDosha} onChange={setCleanDosha} label="No dosha stays a null result" icon={<ClipboardCheck size={16} />} />
            <ToggleRow checked={dashaSalience} onChange={setDashaSalience} label="Saturn dasha is salient only" icon={<CalendarClock size={16} />} />
            <ToggleRow checked={!transitConfirmation} onChange={(checked) => setTransitConfirmation(!checked)} label="No transit yes invented" icon={<Eye size={16} />} />
            <ToggleRow checked={avoidYogaOverclaim} onChange={setAvoidYogaOverclaim} label="No unverified yoga label" icon={<CircleHelp size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("strength");
              setReference("lagna");
              setStaticPromise(true);
              setCleanDosha(true);
              setDashaSalience(true);
              setTransitConfirmation(false);
              setAvoidYogaOverclaim(true);
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
            <p style={eyebrowStyle}>Final Parashara-only synthesis</p>
            <p style={{ ...bodyStyle, marginTop: "0.32rem" }}>{verdictLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepDiagram({ active }: { active: StepKey }) {
  return (
    <svg viewBox="0 0 680 160" role="img" aria-label="Five-step Parashara reading sequence" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="144" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {STEP_ORDER.map((key, index) => {
        const x = 72 + index * 134;
        const selected = active === key;
        return (
          <g key={key}>
            {index > 0 ? <path d={`M ${x - 78} 80 L ${x - 44} 80`} stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" /> : null}
            <circle cx={x} cy="80" r="34" fill={SURFACE} stroke={selected ? ACCENT : HAIRLINE} strokeWidth={selected ? 2 : 1} />
            <text x={x} y="76" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>{index + 1}</text>
            <text x={x} y="94" textAnchor="middle" fontSize="9" fill={INK_MUTED}>{STEPS[key].result}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DoshaStrip({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 680 110" role="img" aria-label="Mangal Dosha trigger positions" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="94" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {Array.from({ length: 12 }, (_, index) => {
        const house = index + 1;
        const trigger = DOSHA_POSITIONS.includes(house);
        const selected = house === active;
        const x = 42 + index * 54;
        return (
          <g key={house}>
            <rect x={x - 19} y="34" width="38" height="38" rx="8" fill={SURFACE} stroke={selected ? ACCENT : HAIRLINE} strokeWidth={selected ? 2 : 1} />
            <text x={x} y="58" textAnchor="middle" fontSize="11" fill={INK_PRIMARY}>{house}</text>
            <text x={x} y="88" textAnchor="middle" fontSize="9" fill={trigger ? INK_PRIMARY : INK_MUTED}>{trigger ? "trigger" : "clear"}</text>
          </g>
        );
      })}
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

const toggleButtonRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.5rem",
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
