"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Anchor,
  BadgeCheck,
  CircleHelp,
  ClipboardList,
  Grid3X3,
  RotateCcw,
  Route,
  ShieldAlert,
} from "lucide-react";

type GrahaKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "rahu" | "ketu";
type StepKey = "dignity" | "yogas" | "dasha" | "transit" | "synthesis";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const HOUSES = ["Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer"];

const GRAHAS: Record<GrahaKey, { label: string; sign: string; degree: string; house: number; note: string }> = {
  sun: { label: "Sun", sign: "Leo", degree: "8 deg 20", house: 1, note: "In the Lagna sign; establishes the visible chart anchor." },
  moon: { label: "Moon", sign: "Taurus", degree: "22 deg 10", house: 10, note: "Whole-sign placement follows Taurus as the 10th from Leo." },
  mars: { label: "Mars", sign: "Capricorn", degree: "27 deg 30", house: 6, note: "Degree does not alter the whole-sign house; Capricorn is the 6th." },
  mercury: { label: "Mercury", sign: "Virgo", degree: "15 deg 00", house: 2, note: "The worked example: Virgo is House 2 from Leo Lagna." },
  jupiter: { label: "Jupiter", sign: "Sagittarius", degree: "19 deg 30", house: 5, note: "Sagittarius is House 5 from Leo Lagna." },
  venus: { label: "Venus", sign: "Gemini", degree: "6 deg 15", house: 11, note: "Gemini is House 11 from Leo Lagna." },
  saturn: { label: "Saturn", sign: "Cancer", degree: "3 deg 50", house: 12, note: "The worked example: Cancer is House 12 from Leo Lagna." },
  rahu: { label: "Rahu", sign: "Libra", degree: "14 deg 20", house: 3, note: "Libra is House 3 from Leo Lagna." },
  ketu: { label: "Ketu", sign: "Aries", degree: "14 deg 20", house: 9, note: "Aries is House 9 from Leo Lagna." },
};

const STEPS: Record<StepKey, { label: string; inputRole: string }> = {
  dignity: { label: "Dignity and strength", inputRole: "Assess sign dignity, house placement, and usable strength first." },
  yogas: { label: "Yogas and doshas", inputRole: "Identify formations, but keep them as Parashara input, not final verdict." },
  dasha: { label: "Dasha context", inputRole: "Check whether the promise is active in time." },
  transit: { label: "Transit context", inputRole: "Use the two-yes principle as timing confirmation." },
  synthesis: { label: "Stream synthesis", inputRole: "Produce Parashara's contribution to the later five-stream matrix." },
};

const STEP_ORDER: StepKey[] = ["dignity", "yogas", "dasha", "transit", "synthesis"];

export function ParasharaAnchorMd1Lab() {
  const [selectedGraha, setSelectedGraha] = useState<GrahaKey>("mercury");
  const [step, setStep] = useState<StepKey>("dignity");
  const [sharedVocabulary, setSharedVocabulary] = useState(true);
  const [proceduralFirst, setProceduralFirst] = useState(true);
  const [minimalApparatus, setMinimalApparatus] = useState(true);
  const [authorityClaim, setAuthorityClaim] = useState(false);

  const graha = GRAHAS[selectedGraha];
  const currentStep = STEPS[step];

  const status = useMemo(() => {
    if (authorityClaim) {
      return { label: "authority error", icon: <ShieldAlert size={18} /> };
    }
    if (!sharedVocabulary || !proceduralFirst || !minimalApparatus) {
      return { label: "anchor reason missing", icon: <ShieldAlert size={18} /> };
    }
    return { label: "default anchor ready", icon: <BadgeCheck size={18} /> };
  }, [authorityClaim, minimalApparatus, proceduralFirst, sharedVocabulary]);

  const anchorStatement = useMemo(() => {
    if (authorityClaim) {
      return "Repair the claim: Parashara is read first for workflow reasons, not because it outranks KP, Jaimini, Lal Kitab, or Tajika.";
    }

    const reasons = [
      sharedVocabulary ? "shared vocabulary" : "missing shared-vocabulary reason",
      proceduralFirst ? "procedural first pass" : "missing workflow reason",
      minimalApparatus ? "minimal extra apparatus" : "missing apparatus reason",
    ];

    return `Parashara goes first as ${reasons.join(", ")}. Its output becomes one stream input for the later matrix, not the closing verdict.`;
  }, [authorityClaim, minimalApparatus, proceduralFirst, sharedVocabulary]);

  return (
    <div data-interactive="parashara-anchor-md1-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Chart MD1 anchor lab</p>
            <h2 style={headingStyle}>Run Parashara first without turning it into the final authority</h2>
            <p style={bodyStyle}>
              Derive whole-sign houses from Leo Lagna, rehearse the five-step sequence, and keep default separate from most reliable.
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
          <p style={eyebrowStyle}>Whole-sign D1 from Leo Lagna</p>
          <HouseWheel selectedHouse={graha.house} />
          <div style={grahaGridStyle}>
            {(Object.keys(GRAHAS) as GrahaKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setSelectedGraha(key)} style={choiceStyle(selectedGraha === key)} aria-pressed={selectedGraha === key}>
                {GRAHAS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected graha</p>
          <div style={factPanelStyle}>
            <p style={panelTitleStyle}>{graha.label}</p>
            <p style={smallTextStyle}>Sign: {graha.sign}</p>
            <p style={smallTextStyle}>Degree: {graha.degree}</p>
            <p style={smallTextStyle}>Whole-sign house: {graha.house}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.55rem" }}>{graha.note}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Five-step sequence as input</p>
          <div style={stepRailStyle}>
            {STEP_ORDER.map((key, index) => (
              <button key={key} type="button" onClick={() => setStep(key)} style={stepStyle(step === key)} aria-pressed={step === key}>
                <span>{index + 1}</span>
                {STEPS[key].label}
              </button>
            ))}
          </div>
          <p style={{ ...smallTextStyle, marginTop: "0.8rem" }}>{currentStep.inputRole}</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Default is not authority</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={sharedVocabulary} onChange={setSharedVocabulary} label="Shared vocabulary" icon={<Grid3X3 size={16} />} />
            <ToggleRow checked={proceduralFirst} onChange={setProceduralFirst} label="Procedural first pass" icon={<Route size={16} />} />
            <ToggleRow checked={minimalApparatus} onChange={setMinimalApparatus} label="Minimal extra apparatus" icon={<ClipboardList size={16} />} />
            <ToggleRow checked={!authorityClaim} onChange={(checked) => setAuthorityClaim(!checked)} label="No superiority claim" icon={<CircleHelp size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedGraha("mercury");
              setStep("dignity");
              setSharedVocabulary(true);
              setProceduralFirst(true);
              setMinimalApparatus(true);
              setAuthorityClaim(false);
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
          <Anchor size={20} color={ACCENT} style={{ flex: "0 0 auto", marginTop: "0.14rem" }} />
          <div>
            <p style={eyebrowStyle}>Anchor statement</p>
            <p style={{ ...bodyStyle, marginTop: "0.32rem" }}>{anchorStatement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function HouseWheel({ selectedHouse }: { selectedHouse: number }) {
  return (
    <svg viewBox="0 0 680 220" role="img" aria-label="Leo Lagna whole sign house wheel for Chart MD1" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="204" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {HOUSES.map((sign, index) => {
        const house = index + 1;
        const active = house === selectedHouse;
        const x = 68 + (index % 6) * 108;
        const y = index < 6 ? 62 : 150;
        return (
          <g key={sign}>
            <rect x={x - 42} y={y - 28} width="84" height="56" rx="8" fill={SURFACE} stroke={active ? ACCENT : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <text x={x} y={y - 5} textAnchor="middle" fontSize="11" fill={INK_PRIMARY}>H{house}</text>
            <text x={x} y={y + 13} textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>{sign}</text>
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

const grahaGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
};

const stepRailStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))",
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
  margin: 0,
  color: INK_PRIMARY,
  fontSize: "1rem",
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

function choiceStyle(active: boolean): CSSProperties {
  return {
    ...buttonReset,
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
    color: active ? INK_PRIMARY : INK_SECONDARY,
    minHeight: 40,
    padding: "0.5rem 0.58rem",
    fontSize: "0.84rem",
    fontWeight: 500,
    textAlign: "center",
  };
}

function stepStyle(active: boolean): CSSProperties {
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
