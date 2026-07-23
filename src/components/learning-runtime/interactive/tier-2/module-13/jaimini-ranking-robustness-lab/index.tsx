"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  ClipboardCheck,
  GitCompare,
  Layers3,
  LockKeyhole,
  RotateCcw,
  Scale,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";

type StepKey = "rank" | "margin" | "contrast" | "scope" | "package";
type GrahaKey = "mars" | "moon" | "jupiter" | "mercury" | "sun" | "venus" | "saturn";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const RANKS: Array<{ key: GrahaKey; role: string; graha: string; sign: string; degree: string; margin: string; minutes: number }> = [
  { key: "mars", role: "AK", graha: "Mars", sign: "Capricorn", degree: "27 deg 30", margin: "5 deg 20", minutes: 320 },
  { key: "moon", role: "AmK", graha: "Moon", sign: "Taurus", degree: "22 deg 10", margin: "2 deg 40", minutes: 160 },
  { key: "jupiter", role: "BK", graha: "Jupiter", sign: "Sagittarius", degree: "19 deg 30", margin: "4 deg 30", minutes: 270 },
  { key: "mercury", role: "MK", graha: "Mercury", sign: "Virgo", degree: "15 deg 00", margin: "6 deg 40", minutes: 400 },
  { key: "sun", role: "PK", graha: "Sun", sign: "Leo", degree: "8 deg 20", margin: "2 deg 05", minutes: 125 },
  { key: "venus", role: "GK", graha: "Venus", sign: "Gemini", degree: "6 deg 15", margin: "2 deg 25", minutes: 145 },
  { key: "saturn", role: "DK", graha: "Saturn", sign: "Cancer", degree: "3 deg 50", margin: "lowest rank", minutes: 0 },
];

const STEPS: Record<StepKey, { label: string; result: string; detail: string; icon: ReactNode }> = {
  rank: {
    label: "Rank karakas",
    result: "Mars AK, Saturn DK",
    detail: "Seven eligible grahas are ranked by within-sign degree; Rahu and Ketu are excluded in this scheme.",
    icon: <ClipboardCheck size={16} />,
  },
  margin: {
    label: "Compute margins",
    result: "Smallest gap: 2 deg 05",
    detail: "Every adjacent margin exceeds 120 arcminutes, so the ranking is not boundary-adjacent.",
    icon: <SlidersHorizontal size={16} />,
  },
  contrast: {
    label: "Contrast KP",
    result: "At least 13x the KP margin",
    detail: "The lesson contrasts this robust ranking with the about 9 minute KP cuspal margin from 13.3.3.",
    icon: <GitCompare size={16} />,
  },
  scope: {
    label: "Keep scope",
    result: "Robust does not mean heavier",
    detail: "Computational robustness is separate from interpretive weight in a later synthesis.",
    icon: <Scale size={16} />,
  },
  package: {
    label: "Package finding",
    result: "AK, margin, K, occupants, DK",
    detail: "The packaged Jaimini finding names the ranking margin and the separate Darakaraka marriage thread.",
    icon: <LockKeyhole size={16} />,
  },
};

const STEP_ORDER: StepKey[] = ["rank", "margin", "contrast", "scope", "package"];

export function JaiminiRankingRobustnessLab() {
  const [step, setStep] = useState<StepKey>("margin");
  const [selectedGraha, setSelectedGraha] = useState<GrahaKey>("sun");
  const [marginNamed, setMarginNamed] = useState(true);
  const [overWeight, setOverWeight] = useState(false);
  const [forcedWarning, setForcedWarning] = useState(false);
  const [dkNamed, setDkNamed] = useState(true);

  const currentStep = STEPS[step];
  const selectedRank = RANKS.find((rank) => rank.key === selectedGraha) ?? RANKS[0];

  const status = useMemo(() => {
    if (!marginNamed || overWeight || forcedWarning || !dkNamed) return { label: "package needs repair", icon: <ShieldAlert size={18} /> };
    return { label: "robustness packaged", icon: <BadgeCheck size={18} /> };
  }, [dkNamed, forcedWarning, marginNamed, overWeight]);

  const packageLine = useMemo(() => {
    if (!marginNamed) return "Repair: do not report AK equals Mars without the 5 deg 20 margin to Moon.";
    if (overWeight) return "Repair: robust ranking computation does not make the Jaimini finding more important than KP.";
    if (forcedWarning) return "Repair: do not manufacture a boundary warning; this chart's Jaimini ranking is wide-margin.";
    if (!dkNamed) return "Repair: include Darakaraka Saturn separately as the marriage-thread corroboration.";
    return "Jaimini package: AK Mars, 5 deg 20 clear of Moon, gives Virgo Karakamsha; Jupiter co-occupies, Sun aspects and appears in the 10th-from-K, Mercury sits 9th-from-K, Saturn plus Ketu sit 12th-from-K. Separately, DK Saturn corroborates the marriage thread.";
  }, [dkNamed, forcedWarning, marginNamed, overWeight]);

  return (
    <div data-interactive="jaimini-ranking-robustness-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Jaimini ranking robustness lab</p>
            <h2 style={headingStyle}>Rebuild the cara-karaka ranking and report what the margins actually show</h2>
            <p style={bodyStyle}>
              Rank the seven eligible grahas in Chart MD1, inspect each adjacent margin, contrast the KP boundary case, and package the Jaimini finding without overclaiming it.
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
          <p style={eyebrowStyle}>Worked-example steps</p>
          <MarginScale selected={selectedGraha} />
          <div style={stepGridStyle}>
            {STEP_ORDER.map((key, index) => (
              <button key={key} type="button" onClick={() => setStep(key)} style={choiceStyle(step === key)} aria-pressed={step === key}>
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
          <p style={eyebrowStyle}>Ranking table</p>
          <div style={rankListStyle}>
            {RANKS.map((rank, index) => (
              <button key={rank.key} type="button" onClick={() => setSelectedGraha(rank.key)} style={rankButtonStyle(selectedGraha === rank.key)} aria-pressed={selectedGraha === rank.key}>
                <span>{index + 1}. {rank.role}</span>
                <span>{rank.graha}</span>
                <span>{rank.degree}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected rank</p>
          <div style={factPanelStyle}>
            <p style={panelTitleStyle}>{selectedRank.role}: {selectedRank.graha}</p>
            <p style={smallTextStyle}>{selectedRank.sign}, {selectedRank.degree}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.62rem" }}>
              {selectedRank.key === "saturn" ? "Darakaraka Saturn is the lowest-ranked graha and has no lower adjacent margin." : `Margin to next rank: ${selectedRank.margin}.`}
            </p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Packaging guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={marginNamed} onChange={setMarginNamed} label="AK margin named" icon={<SlidersHorizontal size={16} />} />
            <ToggleRow checked={!overWeight} onChange={(checked) => setOverWeight(!checked)} label="No extra interpretive weight claimed" icon={<Scale size={16} />} />
            <ToggleRow checked={!forcedWarning} onChange={(checked) => setForcedWarning(!checked)} label="No false boundary warning" icon={<ShieldAlert size={16} />} />
            <ToggleRow checked={dkNamed} onChange={setDkNamed} label="Darakaraka Saturn named separately" icon={<Layers3 size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("margin");
              setSelectedGraha("sun");
              setMarginNamed(true);
              setOverWeight(false);
              setForcedWarning(false);
              setDkNamed(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Synthesis-input package</p>
          <div style={statementPanelStyle}>
            <LockKeyhole size={22} color={ACCENT} />
            <p style={{ ...bodyStyle, marginTop: "0.5rem" }}>{packageLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MarginScale({ selected }: { selected: GrahaKey }) {
  const selectedRank = RANKS.find((rank) => rank.key === selected) ?? RANKS[0];
  const maxMinutes = 420;
  const kpWidth = (9 / maxMinutes) * 500;

  return (
    <svg viewBox="0 0 680 250" role="img" aria-label="Jaimini adjacent ranking margins compared to KP margin" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="234" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="74" y="38" fontSize="11" fill={INK_PRIMARY}>Adjacent cara-karaka margins</text>
      {RANKS.slice(0, 6).map((rank, index) => {
        const y = 58 + index * 27;
        const width = (rank.minutes / maxMinutes) * 500;
        const active = rank.key === selected;
        return (
          <g key={rank.key}>
            <text x="76" y={y + 13} fontSize="10" fill={active ? INK_PRIMARY : INK_MUTED}>{rank.role} to next</text>
            <rect x="172" y={y} width="500" height="16" rx="8" fill={SURFACE} stroke={HAIRLINE} />
            <rect x="172" y={y} width={width} height="16" rx="8" fill={SURFACE} stroke={active ? ACCENT : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <text x="640" y={y + 12} textAnchor="end" fontSize="10" fill={active ? INK_PRIMARY : INK_MUTED}>{rank.margin}</text>
          </g>
        );
      })}
      <line x1={172 + kpWidth} y1="48" x2={172 + kpWidth} y2="222" stroke={ACCENT} strokeWidth="2" strokeDasharray="4 6" />
      <text x={172 + kpWidth + 8} y="222" fontSize="10" fill={ACCENT}>KP about 9 min</text>
      <text x="340" y="232" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>
        Selected: {selectedRank.role} {selectedRank.graha}; smallest Jaimini gap remains 2 deg 05.
      </text>
    </svg>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem" }}>
        {icon}
        {label}
      </span>
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
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
};

const rankListStyle: CSSProperties = {
  display: "grid",
  gap: "0.45rem",
  marginTop: "0.85rem",
};

const factPanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.9rem",
  minHeight: "9.5rem",
  background: SURFACE,
};

const statementPanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.9rem",
  minHeight: "11.5rem",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.78rem",
  letterSpacing: 0,
  textTransform: "uppercase",
  color: ACCENT,
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  fontSize: "1.35rem",
  lineHeight: 1.22,
  color: INK_PRIMARY,
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.48rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.95rem",
};

const smallTextStyle: CSSProperties = {
  margin: "0.28rem 0 0",
  color: INK_MUTED,
  lineHeight: 1.45,
  fontSize: "0.86rem",
};

const panelTitleStyle: CSSProperties = {
  margin: "0.4rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1rem",
  lineHeight: 1.32,
  fontWeight: 500,
};

const statusPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 999,
  padding: "0.45rem 0.7rem",
  color: INK_SECONDARY,
  background: SURFACE,
  fontSize: "0.86rem",
  whiteSpace: "nowrap",
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.58rem 0.72rem",
  background: SURFACE,
  color: INK_PRIMARY,
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.9rem",
};

function choiceStyle(active: boolean): CSSProperties {
  return {
    ...softButtonStyle,
    justifyContent: "flex-start",
    borderColor: active ? ACCENT : HAIRLINE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
  };
}

function rankButtonStyle(active: boolean): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 0.8fr",
    gap: "0.5rem",
    alignItems: "center",
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    padding: "0.55rem 0.65rem",
    background: SURFACE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.86rem",
    textAlign: "left",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem",
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    padding: "0.62rem 0.72rem",
    background: SURFACE,
    color: checked ? INK_PRIMARY : INK_MUTED,
  };
}
