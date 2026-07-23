"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, Brain, HeartHandshake, Map, Route, Sparkles } from "lucide-react";

type ChapterKey = "recap" | "dharma" | "sannyasa" | "crisis" | "scope";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const STEPS: Record<ChapterKey, { label: string; title: string; role: string; color: string }> = {
  recap: {
    label: "12.6.1",
    title: "Overview",
    role: "Recap Chapters 1-5 and choose the right closing discipline.",
    color: BLUE,
  },
  dharma: {
    label: "12.6.2",
    title: "Dharma Question",
    role: "Synthesize the spiritual-purpose archetype without turning it into an occupation prescription.",
    color: GREEN,
  },
  sannyasa: {
    label: "12.6.3",
    title: "Sannyasa Question",
    role: "Answer the renunciation-aspiration question with non-foreclosure in both directions.",
    color: GOLD,
  },
  crisis: {
    label: "12.6.4",
    title: "Meaningfulness Crisis",
    role: "Recognize when spiritual language may overlap with mental-health urgency before reading further.",
    color: VERMILION,
  },
  scope: {
    label: "12.6.5",
    title: "Scope Boundary",
    role: "Separate astrological guidance, religious direction, and clinical mental-health care.",
    color: PURPLE,
  },
};

const FINDINGS = [
  "Moksha-trikona: Jupiter reaches House 12; Ketu occupies House 12.",
  "D20: Saturn exalted, supporting spiritual-practice capacity.",
  "D60: Saturn is the karmic-substrate outlier.",
  "Jaimini: Saturn is Atmakaraka; Virgo is Karakamsha.",
  "Ishta-devata: Ganesha via Ketu, converging with D1 Ketu-in-12th.",
  "Sannyasa checks: core and Moon variants absent; Ketu standard doubly qualified.",
];

export function SpiritualSynthesisOverviewMap() {
  const [active, setActive] = useState<ChapterKey>("recap");
  const [clientLine, setClientLine] = useState<"dharma" | "sannyasa" | "crisis">("dharma");
  const step = STEPS[active];

  const routeVerdict = useMemo(() => {
    if (clientLine === "dharma") {
      return {
        title: "Route to 12.6.2",
        text: "This is a dharma-purpose question. Use the synthesis, then close with empowerment rather than a job prescription.",
        color: GREEN,
      };
    }
    if (clientLine === "sannyasa") {
      return {
        title: "Route to 12.6.3",
        text: "This is a sannyasa-aspiration question. Use the Chapter 5 findings and refuse path-foreclosure.",
        color: GOLD,
      };
    }
    return {
      title: "Pause before synthesis",
      text: "This may be a meaningfulness-crisis presentation. Use 12.6.4 recognition and routing before ordinary chart interpretation.",
      color: VERMILION,
    };
  }, [clientLine]);

  return (
    <div data-interactive="spiritual-synthesis-overview-map" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Module 12 closing map</p>
        <h2 style={{ margin: "0.28rem 0 0", fontSize: "1.35rem", lineHeight: 1.24, fontWeight: 650 }}>
          See how the five closing lessons turn Chart S1 findings into safe spiritual-path practice
        </h2>
        <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "1.05rem", lineHeight: 1.6, maxWidth: 920 }}>
          This overview is a router: it recaps the evidence base, then shows which closing lesson handles dharma synthesis, sannyasa aspiration, crisis recognition, and scope boundaries.
        </p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.48fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Chapter arc</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(110px, 1fr))", gap: "0.6rem", marginTop: "0.9rem" }}>
            {(Object.keys(STEPS) as ChapterKey[]).map((key) => {
              const item = STEPS[key];
              const selected = active === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActive(key)}
                  style={{
                    ...buttonReset,
                    border: `1px solid ${selected ? item.color : HAIRLINE}`,
                    borderRadius: 8,
                    background: selected ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.28)",
                    color: selected ? item.color : INK_SECONDARY,
                    padding: "0.75rem",
                    minHeight: 104,
                    display: "grid",
                    gap: "0.28rem",
                    boxShadow: selected ? "0 6px 18px rgba(62,42,31,0.08)" : "none",
                  }}
                >
                  <span style={{ fontSize: "0.78rem", fontWeight: 750, letterSpacing: "0.04em" }}>{item.label}</span>
                  <span style={{ fontSize: "1rem", fontWeight: 750, lineHeight: 1.2 }}>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ ...cardStyle, borderColor: step.color }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.48rem", color: step.color, fontSize: "1.08rem", fontWeight: 750 }}>
            <Map size={20} />
            {step.label} - {step.title}
          </span>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, fontSize: "1.02rem", lineHeight: 1.58 }}>{step.role}</p>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(280px, 0.7fr) minmax(0, 1fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Chart S1 evidence base</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.8rem" }}>
            {FINDINGS.map((finding) => (
              <div key={finding} style={{ display: "flex", gap: "0.55rem", alignItems: "start", color: INK_SECONDARY, fontSize: "0.98rem", lineHeight: 1.45 }}>
                <Sparkles size={16} style={{ color: GOLD, flex: "0 0 auto", marginTop: "0.12rem" }} />
                <span>{finding}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Client-presentation router</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.6rem", marginTop: "0.85rem" }}>
            <RouterButton active={clientLine === "dharma"} color={GREEN} onClick={() => setClientLine("dharma")} icon={<Brain size={17} />} label="What is my dharma?" />
            <RouterButton active={clientLine === "sannyasa"} color={GOLD} onClick={() => setClientLine("sannyasa")} icon={<HeartHandshake size={17} />} label="Should I take sannyasa?" />
            <RouterButton active={clientLine === "crisis"} color={VERMILION} onClick={() => setClientLine("crisis")} icon={<AlertTriangle size={17} />} label="Nothing means anything" />
          </div>
          <div style={{ marginTop: "0.9rem", border: `1px solid ${routeVerdict.color}`, borderRadius: 8, padding: "0.9rem", background: "rgba(255,255,255,0.34)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: routeVerdict.color, fontWeight: 750, fontSize: "1.05rem" }}>
              <Route size={18} />
              {routeVerdict.title}
            </span>
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "1.02rem", lineHeight: 1.55 }}>{routeVerdict.text}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function RouterButton({ active, color, onClick, icon, label }: { active: boolean; color: string; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...buttonReset,
        border: `1px solid ${active ? color : HAIRLINE}`,
        borderRadius: 8,
        background: active ? "rgba(255,255,255,0.72)" : "transparent",
        color: active ? color : INK_SECONDARY,
        padding: "0.72rem",
        minHeight: 82,
        display: "grid",
        placeItems: "center",
        gap: "0.35rem",
        textAlign: "center",
        fontSize: "0.95rem",
        fontWeight: 700,
        lineHeight: 1.25,
      }}
    >
      {icon}
      {label}
    </button>
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
};
