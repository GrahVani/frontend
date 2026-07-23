"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  Binary,
  Compass,
  Eye,
  Layers3,
  Orbit,
  RotateCcw,
  Scale,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

type StepKey = "ak" | "d9" | "lagna" | "occupants" | "houses";
type FrameKey = "karakamsha" | "d1";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const STEPS: Record<StepKey, { label: string; result: string; detail: string; icon: ReactNode }> = {
  ak: {
    label: "Atmakaraka",
    result: "Mars, 27 deg 30 Capricorn",
    detail: "Mars is the highest-degree cara karaka and becomes the soul-significator for this read.",
    icon: <Sparkles size={16} />,
  },
  d9: {
    label: "D9 sign",
    result: "Virgo",
    detail: "Capricorn is an earth sign; the ninth navamsha of Capricorn lands in Virgo.",
    icon: <Orbit size={16} />,
  },
  lagna: {
    label: "Karakamsha",
    result: "Virgo as first house",
    detail: "The read counts from the AK D9 sign, not from the D1 Lagna Leo or Mars D1 sign Capricorn.",
    icon: <Compass size={16} />,
  },
  occupants: {
    label: "Occupants and aspect",
    result: "Mars + Jupiter, aspected by Sun",
    detail: "Jupiter co-occupies Virgo; Sun in Gemini aspects Virgo by dual-sign rashi drishti.",
    icon: <Eye size={16} />,
  },
  houses: {
    label: "Houses from K",
    result: "Mercury 9th, Sun 10th, Saturn + Ketu 12th",
    detail: "The houses show dharma communication, public authority, and a real inward renunciate pull.",
    icon: <Layers3 size={16} />,
  },
};

const STEP_ORDER: StepKey[] = ["ak", "d9", "lagna", "occupants", "houses"];

const FRAMES: Record<FrameKey, { label: string; note: string }> = {
  karakamsha: {
    label: "Karakamsha Virgo",
    note: "Correct frame: the AK D9 sign becomes the first house for this dharma-path read.",
  },
  d1: {
    label: "D1 Lagna Leo",
    note: "Training contrast: using Leo shifts every house count and creates the lesson's main chart-selection error.",
  },
};

export function JaiminiDharmaPathAugmentationLab() {
  const [step, setStep] = useState<StepKey>("lagna");
  const [frame, setFrame] = useState<FrameKey>("karakamsha");
  const [marriageMerge, setMarriageMerge] = useState(false);
  const [countVotes, setCountVotes] = useState(false);
  const [discardTension, setDiscardTension] = useState(false);

  const selected = STEPS[step];

  const status = useMemo(() => {
    if (frame !== "karakamsha" || marriageMerge || countVotes || discardTension) {
      return { label: "reading needs repair", icon: <ShieldAlert size={18} /> };
    }
    return { label: "dharma read held honestly", icon: <BadgeCheck size={18} /> };
  }, [countVotes, discardTension, frame, marriageMerge]);

  const readingLine = useMemo(() => {
    if (frame !== "karakamsha") return "Repair: count from Virgo, the AK D9 sign, not from the D1 Lagna Leo.";
    if (marriageMerge) return "Repair: keep the Karakamsha dharma question separate from the marriage verdict; the marriage Jaimini thread is Darakaraka Saturn.";
    if (countVotes) return "Repair: Saturn and Ketu in the 12th are real, but they do not win by planet count over the structurally primary Karakamsha occupants.";
    if (discardTension) return "Repair: do not erase either current. The outward teaching-vocation and inward renunciate pull both belong in the statement.";
    return "Jaimini dharma-path input: Mars as AK in Virgo Karakamsha with Jupiter gives decisive analytical force shaped toward counsel and teaching; Sun adds public authority and 10th-house vocation; Mercury in the 9th supports precise dharma communication; Saturn and Ketu in the 12th add a genuine inward renunciate current.";
  }, [countVotes, discardTension, frame, marriageMerge]);

  return (
    <div data-interactive="jaimini-dharma-path-augmentation-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Jaimini dharma-path augmentation</p>
            <h2 style={headingStyle}>Read Chart MD1 from the Karakamsha, not the marriage question</h2>
            <p style={bodyStyle}>
              Walk the five-step Karakamsha method, compare the correct frame against the D1 reflex, and preserve both dharma currents without averaging them.
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
          <p style={eyebrowStyle}>Five-step Karakamsha read</p>
          <KarakamshaDiagram active={step} frame={frame} />
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
            <span style={{ color: ACCENT }}>{selected.icon}</span>
            <p style={panelTitleStyle}>{selected.result}</p>
            <p style={smallTextStyle}>{selected.detail}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Frame selector</p>
          <div style={buttonGridStyle}>
            {(Object.keys(FRAMES) as FrameKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setFrame(key)} style={choiceStyle(frame === key)} aria-pressed={frame === key}>
                <Compass size={16} />
                {FRAMES[key].label}
              </button>
            ))}
          </div>
          <p style={{ ...smallTextStyle, marginTop: "0.75rem" }}>{FRAMES[frame].note}</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Interpretive guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={!marriageMerge} onChange={(checked) => setMarriageMerge(!checked)} label="Dharma question kept separate" icon={<Binary size={16} />} />
            <ToggleRow checked={!countVotes} onChange={(checked) => setCountVotes(!checked)} label="No planet-count voting" icon={<Scale size={16} />} />
            <ToggleRow checked={!discardTension} onChange={(checked) => setDiscardTension(!checked)} label="Both currents preserved" icon={<Layers3 size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("lagna");
              setFrame("karakamsha");
              setMarriageMerge(false);
              setCountVotes(false);
              setDiscardTension(false);
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
          <Layers3 size={20} color={ACCENT} style={{ flex: "0 0 auto", marginTop: "0.14rem" }} />
          <div>
            <p style={eyebrowStyle}>Synthesis-input statement</p>
            <p style={{ ...bodyStyle, marginTop: "0.32rem" }}>{readingLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function KarakamshaDiagram({ active, frame }: { active: StepKey; frame: FrameKey }) {
  const correct = frame === "karakamsha";

  return (
    <svg viewBox="0 0 680 270" role="img" aria-label="Chart MD1 Karakamsha five step read diagram" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="254" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <rect x="252" y="28" width="176" height="46" rx="8" fill={SURFACE} stroke={active === "lagna" ? ACCENT : HAIRLINE} strokeWidth={active === "lagna" ? 2 : 1} />
      <text x="340" y="48" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>{correct ? "Virgo Karakamsha" : "Leo D1 Lagna"}</text>
      <text x="340" y="64" textAnchor="middle" fontSize="10" fill={correct ? INK_MUTED : ACCENT}>{correct ? "correct first house" : "contrast frame"}</text>

      <rect x="54" y="122" width="168" height="56" rx="8" fill={SURFACE} stroke={active === "occupants" ? ACCENT : HAIRLINE} strokeWidth={active === "occupants" ? 2 : 1} />
      <text x="138" y="145" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>Mars + Jupiter</text>
      <text x="138" y="162" textAnchor="middle" fontSize="10" fill={INK_MUTED}>occupants</text>

      <rect x="256" y="122" width="168" height="56" rx="8" fill={SURFACE} stroke={active === "occupants" ? ACCENT : HAIRLINE} strokeWidth={active === "occupants" ? 2 : 1} />
      <text x="340" y="145" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>Sun aspect</text>
      <text x="340" y="162" textAnchor="middle" fontSize="10" fill={INK_MUTED}>dual sign drishti</text>

      <rect x="458" y="122" width="168" height="56" rx="8" fill={SURFACE} stroke={active === "houses" ? ACCENT : HAIRLINE} strokeWidth={active === "houses" ? 2 : 1} />
      <text x="542" y="145" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>9th / 10th / 12th</text>
      <text x="542" y="162" textAnchor="middle" fontSize="10" fill={INK_MUTED}>{correct ? "Mercury, Sun, Saturn + Ketu" : "counts shift incorrectly"}</text>

      <path d="M 300 76 C 246 98 184 102 138 122" stroke={HAIRLINE} strokeWidth="2" fill="none" />
      <path d="M 340 76 L 340 122" stroke={HAIRLINE} strokeWidth="2" fill="none" />
      <path d="M 380 76 C 434 98 496 102 542 122" stroke={HAIRLINE} strokeWidth="2" fill="none" />

      <rect x="78" y="208" width="226" height="28" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="191" y="227" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>outward teaching-vocation current</text>
      <rect x="376" y="208" width="226" height="28" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="489" y="227" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>inward renunciate current</text>
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
  gridTemplateColumns: "repeat(auto-fit, minmax(142px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
};

const buttonGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
};

const factPanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.9rem",
  minHeight: "11rem",
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
    borderColor: active ? ACCENT : HAIRLINE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
  };
}

function stepButtonStyle(active: boolean): CSSProperties {
  return {
    ...softButtonStyle,
    justifyContent: "flex-start",
    borderColor: active ? ACCENT : HAIRLINE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
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

