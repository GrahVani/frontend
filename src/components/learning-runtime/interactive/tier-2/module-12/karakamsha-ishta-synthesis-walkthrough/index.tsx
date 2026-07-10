"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, BadgeCheck, GitCompare, GraduationCap, HeartHandshake, Layers3, RotateCcw, ShieldAlert, Sparkles, TimerReset } from "lucide-react";

type StepKey = "ak" | "karakamsha" | "occupants" | "houses" | "ishta" | "synthesis" | "close";
type ClaimKey = "scope" | "destiny" | "renunciation";

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
  ak: {
    label: "AK",
    title: "Saturn wins by degree",
    body: "Saturn at 27 degrees Capricorn is the Atmakaraka by degree alone. Its dignity is a separate condition, not the selection rule.",
    icon: <BadgeCheck size={16} />,
    color: BLUE,
  },
  karakamsha: {
    label: "KL",
    title: "Virgo becomes Karakamsha",
    body: "Saturn's D9 sign is Virgo, so Chart S1 is read from Virgo as the Karakamsha Lagna.",
    icon: <Layers3 size={16} />,
    color: PURPLE,
  },
  occupants: {
    label: "Seat",
    title: "Saturn and Jupiter share the seat",
    body: "Saturn is structurally present, while Jupiter is a genuine chart-specific co-presence at the soul seat.",
    icon: <GraduationCap size={16} />,
    color: GREEN,
  },
  houses: {
    label: "Houses",
    title: "Public dharma expression",
    body: "Key houses from Virgo show active 4th and 10th registers, a communicative 5th, and Ketu in the 12th.",
    icon: <GitCompare size={16} />,
    color: GOLD,
  },
  ishta: {
    label: "Deity",
    title: "Ketu points to Ganesha",
    body: "The 12th from Virgo is Leo, occupied by Ketu, so the Ishta-devata indication is Ganesha.",
    icon: <Sparkles size={16} />,
    color: GREEN,
  },
  synthesis: {
    label: "Scope",
    title: "Two convergences, two scopes",
    body: "Saturn governs the overall soul-agenda convergence. Ketu governs the specific moksha-door convergence.",
    icon: <GitCompare size={16} />,
    color: BLUE,
  },
  close: {
    label: "Close",
    title: "Disposition, not destiny",
    body: "The reading closes with agency: a strong orientation offered for discernment, never a fixed verdict.",
    icon: <HeartHandshake size={16} />,
    color: VERMILION,
  },
};

const STEP_ORDER: StepKey[] = ["ak", "karakamsha", "occupants", "houses", "ishta", "synthesis", "close"];

export function KarakamshaIshtaSynthesisWalkthrough() {
  const [stepKey, setStepKey] = useState<StepKey>("ak");
  const [confidence, setConfidence] = useState(72);
  const [claims, setClaims] = useState<Record<ClaimKey, boolean>>({
    scope: true,
    destiny: true,
    renunciation: true,
  });

  const step = STEPS[stepKey];
  const confidenceBand = useMemo(() => {
    if (confidence >= 75) return { label: "high working confidence", color: GREEN, note: "AK and Karakamsha are comparatively robust, while confidence still must be stated." };
    if (confidence >= 45) return { label: "moderate confidence", color: GOLD, note: "Keep the reading usable but add more explicit caveats about degree and divisional sensitivity." };
    return { label: "low confidence", color: VERMILION, note: "Treat the chain as provisional; a changed AK would change every downstream step." };
  }, [confidence]);

  const overreachStatus = useMemo(() => {
    if (!claims.scope) return { label: "scope collapse", color: VERMILION };
    if (!claims.destiny) return { label: "destiny overreach", color: VERMILION };
    if (!claims.renunciation) return { label: "sannyasa leap", color: GOLD };
    return { label: "synthesis disciplined", color: GREEN };
  }, [claims]);

  const guidance = useMemo(() => {
    if (!claims.scope) return "Separate the claims: Saturn is the overall soul-agenda signature; Ketu is the moksha-door signature.";
    if (!claims.destiny) return "Repair the close: this is disposition available to choice, not a foreclosed life verdict.";
    if (!claims.renunciation) return "Decline the leap to formal renunciation. That question belongs to dedicated sannyasa-yoga factors.";
    return "Complete reading: Saturn AK, Virgo Karakamsha with Jupiter, public dharma expression, Ketu to Ganesha, and an agency-preserving close.";
  }, [claims]);

  return (
    <div data-interactive="karakamsha-ishta-synthesis-walkthrough" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Chart S1 synthesis walkthrough</p>
            <h2 style={{ margin: "0.22rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Assemble the chapter into one scoped Karakamsha and Ishta-devata reading
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Step through Saturn, Virgo, Jupiter, Ketu, Ganesha, confidence context, and the empowerment close without collapsing scope or turning disposition into destiny.
            </p>
          </div>
          <span style={{ border: `1px solid ${overreachStatus.color}`, color: overreachStatus.color, borderRadius: 999, padding: "0.42rem 0.68rem", fontSize: "0.78rem", fontWeight: 600, background: "color-mix(in srgb, currentColor 8%, transparent)", whiteSpace: "nowrap" }}>
            {overreachStatus.label}
          </span>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.7fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <p style={eyebrowStyle}>Seven-step chain</p>
              <h3 style={{ margin: "0.22rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", fontWeight: 600 }}>{step.title}</h3>
            </div>
            <span style={{ color: step.color, display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.84rem", fontWeight: 600 }}>
              {step.icon}
              {step.label}
            </span>
          </div>

          <SynthesisDiagram active={stepKey} onSelect={setStepKey} />
          <p style={{ margin: "0.85rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{step.body}</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Confidence context</p>
          <div style={{ marginTop: "0.85rem", display: "grid", gap: "0.62rem" }}>
            <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              Birth-time confidence
              <input type="range" min="10" max="100" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} aria-label="Birth-time confidence" />
            </label>
            <div style={{ border: `1px solid ${confidenceBand.color}`, borderRadius: 8, padding: "0.75rem", background: "rgba(255,255,255,0.34)" }}>
              <p style={{ margin: 0, color: confidenceBand.color, fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{confidenceBand.label}</p>
              <p style={{ margin: "0.36rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>{confidenceBand.note}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1rem" }}>
        <ConvergenceCard title="Saturn convergence" scope="Overall soul-agenda" body="AK status, D20 dignity, D60 outlier, and shared degree-signature all point toward disciplined dharma work." color={BLUE} />
        <ConvergenceCard title="Ketu convergence" scope="Moksha-door register" body="D1 12th-house Ketu and Karakamsha-derived 12th-from-Virgo Ketu converge narrowly on the deity route." color={GREEN} />
        <ConvergenceCard title="Boundary" scope="No single verdict" body="The two convergences answer different questions and must not become a dramatic most-important-planet claim." color={VERMILION} />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.75fr) minmax(280px, 1fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Hypothesis test</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={claims.scope} onChange={(value) => setClaims((current) => ({ ...current, scope: value }))} label="Keep Saturn and Ketu scopes separate" icon={<GitCompare size={16} />} />
            <ToggleRow checked={claims.destiny} onChange={(value) => setClaims((current) => ({ ...current, destiny: value }))} label="Read disposition, not destiny" icon={<HeartHandshake size={16} />} />
            <ToggleRow checked={claims.renunciation} onChange={(value) => setClaims((current) => ({ ...current, renunciation: value }))} label="Decline renunciation leap" icon={<ShieldAlert size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setStepKey("ak");
              setConfidence(72);
              setClaims({ scope: true, destiny: true, renunciation: true });
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div style={{ ...cardStyle, borderColor: overreachStatus.color }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
            <span style={{ color: overreachStatus.color, marginTop: "0.1rem" }}>{overreachStatus.color === GREEN ? <Sparkles size={20} /> : <TimerReset size={20} />}</span>
            <div>
              <p style={eyebrowStyle}>Final synthesis line</p>
              <p style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, lineHeight: 1.58 }}>{guidance}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SynthesisDiagram({ active, onSelect }: { active: StepKey; onSelect: (key: StepKey) => void }) {
  return (
    <svg viewBox="0 0 760 164" role="img" aria-label="Seven step Karakamsha and Ishta-devata synthesis chain" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="744" height="148" rx="8" fill="rgba(255,255,255,0.35)" stroke={HAIRLINE} />
      {STEP_ORDER.map((key, index) => {
        const x = 70 + index * 103;
        const item = STEPS[key];
        const selected = active === key;
        return (
          <g key={key} onClick={() => onSelect(key)} style={{ cursor: "pointer" }}>
            {index > 0 ? <ArrowRight x={x - 64} y="67" width={16} height={16} color={HAIRLINE} /> : null}
            <circle cx={x} cy="76" r={selected ? 26 : 21} fill={selected ? item.color : SURFACE} stroke={item.color} strokeWidth="2" />
            <text x={x} y="80" textAnchor="middle" fontSize="10" fontWeight="600" fill={selected ? "white" : item.color}>{item.label}</text>
            <text x={x} y="120" textAnchor="middle" fontSize="10" fill={selected ? item.color : INK_MUTED}>{index + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ConvergenceCard({ title, scope, body, color }: { title: string; scope: string; body: string; color: string }) {
  return (
    <article style={{ ...cardStyle, borderColor: color }}>
      <p style={{ margin: 0, color, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{title}</p>
      <h3 style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, fontSize: "0.98rem", fontWeight: 600 }}>{scope}</h3>
      <p style={{ margin: "0.42rem 0 0", color: INK_SECONDARY, lineHeight: 1.48 }}>{body}</p>
    </article>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${checked ? GREEN : HAIRLINE}`, borderRadius: 8, padding: "0.62rem 0.7rem", color: checked ? INK_PRIMARY : INK_MUTED, cursor: "pointer" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem" }}>{icon}{label}</span>
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
