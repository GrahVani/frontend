"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, HeartHandshake, RotateCcw, Scale, ShieldCheck, Sparkles } from "lucide-react";

type ScenarioKey = "strong" | "absent" | "client-decided";
type ChoiceKey = "indication" | "destiny" | "decision-return" | "only-monastic" | "refer";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";

const SCENARIOS: Record<ScenarioKey, { title: string; prompt: string; technical: string }> = {
  strong: {
    title: "Strong technical finding",
    prompt: "A client asks: Does this mean I should become a monk?",
    technical: "Core formation is present, clean, and reasonably strong.",
  },
  absent: {
    title: "No classical yoga",
    prompt: "A client wants reassurance that renunciation is not their path.",
    technical: "Core formation, Moon variants, and qualified Ketu standard are absent.",
  },
  "client-decided": {
    title: "Client already decided",
    prompt: "A client says they will renounce and asks you to confirm it.",
    technical: "The chart shows only a modest inward disposition, not a formal-renunciation signature.",
  },
};

export function SannyasaDispositionFramingLab() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("strong");
  const [choices, setChoices] = useState<Record<ChoiceKey, boolean>>({
    indication: true,
    destiny: true,
    "decision-return": true,
    "only-monastic": false,
    refer: true,
  });

  const scenario = SCENARIOS[scenarioKey];
  const score = useMemo(() => {
    const checks = [
      choices.indication,
      choices.destiny,
      choices["decision-return"],
      !choices["only-monastic"],
      choices.refer,
    ];
    return checks.filter(Boolean).length;
  }, [choices]);

  const verdict = useMemo(() => {
    if (!choices.destiny) {
      return {
        label: "Destiny overclaim",
        color: VERMILION,
        text: "Repair the sentence: avoid 'you will', 'you must', or 'you are destined'.",
      };
    }
    if (!choices["decision-return"]) {
      return {
        label: "Path foreclosure",
        color: VERMILION,
        text: "The chart can name capacity. It cannot make the life-restructuring decision.",
      };
    }
    if (choices["only-monastic"]) {
      return {
        label: "Expression collapsed",
        color: GOLD,
        text: "Formal sannyasa is one possible expression, not the only legitimate one.",
      };
    }
    if (!choices.indication) {
      return {
        label: "Finding blurred",
        color: GOLD,
        text: "Name what the chart actually shows before giving ethical framing.",
      };
    }
    return {
      label: "Framing disciplined",
      color: GREEN,
      text: "You named the technical finding, refused destiny language, returned agency, and kept scope boundaries visible.",
    };
  }, [choices]);

  const modelLine = useMemo(() => {
    if (scenarioKey === "absent") {
      return "The specific classical Sannyasa-yoga signatures taught in this chapter are not present at meaningful strength. That does not decide your life choice either way; it only answers this narrow technical question.";
    }
    if (scenarioKey === "client-decided") {
      return "Your chart shows some inward spiritual disposition, but not a strong formal-renunciation signature. I would not use this chart as confirmation for such a consequential decision; that discernment belongs with you and qualified spiritual guidance.";
    }
    return "There is a strong indication of renunciatory capacity in the chart. That can express as formal sannyasa, contemplative service, committed practice within ordinary life, or inward detachment; the chart does not choose the form for you.";
  }, [scenarioKey]);

  return (
    <div data-interactive="sannyasa-disposition-framing-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Disposition, not prescription</p>
            <h2 style={{ margin: "0.25rem 0 0", fontSize: "1.35rem", lineHeight: 1.24, fontWeight: 650 }}>
              Practice the exact phrasing discipline for Sannyasa-yoga findings
            </h2>
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "1.05rem", lineHeight: 1.6, maxWidth: 900 }}>
              Choose what your response must preserve: indication language, agency, multiple expressions, and referral boundaries.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenarioKey("strong");
              setChoices({ indication: true, destiny: true, "decision-return": true, "only-monastic": false, refer: true });
            }}
            style={softButtonStyle}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(260px, 0.72fr) minmax(0, 1fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Case</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.85rem" }}>
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setScenarioKey(key)}
                style={{
                  ...buttonReset,
                  border: `1px solid ${scenarioKey === key ? BLUE : HAIRLINE}`,
                  background: scenarioKey === key ? "rgba(53, 108, 171, 0.1)" : "transparent",
                  color: scenarioKey === key ? BLUE : INK_SECONDARY,
                  borderRadius: 8,
                  padding: "0.72rem",
                  fontSize: "1rem",
                  fontWeight: 650,
                }}
              >
                {SCENARIOS[key].title}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>{scenario.title}</p>
          <h3 style={{ margin: "0.25rem 0 0", fontSize: "1.22rem", lineHeight: 1.3 }}>{scenario.prompt}</h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "1.03rem", lineHeight: 1.58 }}>{scenario.technical}</p>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1rem" }}>
        <ToggleCard checked={choices.indication} onChange={(value) => setChoices((current) => ({ ...current, indication: value }))} title="Name indication" body="Use 'there is a strong indication of...' before interpretation." icon={<Sparkles size={18} />} good />
        <ToggleCard checked={choices.destiny} onChange={(value) => setChoices((current) => ({ ...current, destiny: value }))} title="Avoid destiny language" body="No 'you will', 'you must', or 'the chart decides' phrasing." icon={<ShieldCheck size={18} />} good />
        <ToggleCard checked={choices["decision-return"]} onChange={(value) => setChoices((current) => ({ ...current, "decision-return": value }))} title="Return agency" body="The life decision remains the client's discernment." icon={<HeartHandshake size={18} />} good />
        <ToggleCard checked={choices["only-monastic"]} onChange={(value) => setChoices((current) => ({ ...current, "only-monastic": value }))} title="Only monastic form" body="Turn this on to see the mistake: it collapses multiple expressions." icon={<AlertTriangle size={18} />} good={false} />
        <ToggleCard checked={choices.refer} onChange={(value) => setChoices((current) => ({ ...current, refer: value }))} title="Name scope boundary" body="For a concrete renunciation decision, route to qualified spiritual guidance." icon={<Scale size={18} />} good />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.72fr) minmax(280px, 0.45fr)", gap: "1rem" }}>
        <div style={{ ...cardStyle, borderColor: verdict.color }}>
          <p style={eyebrowStyle}>Model response</p>
          <p style={{ margin: "0.4rem 0 0", color: INK_PRIMARY, fontSize: "1.08rem", lineHeight: 1.65 }}>{modelLine}</p>
          <p style={{ margin: "0.65rem 0 0", color: verdict.color, fontWeight: 700, fontSize: "1rem" }}>{verdict.text}</p>
        </div>

        <div style={{ ...cardStyle, borderColor: verdict.color }}>
          <span style={{ color: verdict.color, display: "inline-flex", alignItems: "center", gap: "0.5rem", fontWeight: 750, fontSize: "1.12rem" }}>
            {verdict.color === GREEN ? <BadgeCheck size={22} /> : <AlertTriangle size={22} />}
            {verdict.label}
          </span>
          <div style={{ marginTop: "0.9rem", height: 8, borderRadius: 999, background: "rgba(156,122,47,0.16)", overflow: "hidden" }}>
            <span aria-hidden="true" style={{ display: "block", width: `${(score / 5) * 100}%`, height: "100%", background: verdict.color, transition: "width 200ms ease" }} />
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.96rem" }}>{score} of 5 safeguards held</p>
        </div>
      </section>
    </div>
  );
}

function ToggleCard({ checked, onChange, title, body, icon, good }: { checked: boolean; onChange: (checked: boolean) => void; title: string; body: string; icon: ReactNode; good: boolean }) {
  const activeColor = good ? GREEN : VERMILION;
  return (
    <label style={{ ...cardStyle, borderColor: checked ? activeColor : HAIRLINE, cursor: "pointer", display: "grid", gap: "0.45rem" }}>
      <span style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "start" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: checked ? activeColor : INK_SECONDARY, fontWeight: 700, fontSize: "1rem" }}>
          {icon}
          {title}
        </span>
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={title} />
      </span>
      <span style={{ color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.95rem" }}>{body}</span>
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
  fontSize: "0.78rem",
  fontWeight: 700,
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
  padding: "0.58rem 0.78rem",
  fontSize: "0.92rem",
  fontWeight: 650,
};
