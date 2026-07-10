"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  RefreshCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const GREEN = "#2F7D55";

type ThemeEvidence = {
  key: string;
  label: string;
  kind: "support" | "contradiction";
  color: string;
  description: string;
};

const THEME_EVIDENCE: ThemeEvidence[] = [
  {
    key: "classical-sixth",
    label: "Classical 6th-house strength",
    kind: "support",
    color: GREEN,
    description: "Saturn rules and occupies the 6th in its own sign; maximally strong on classical terms.",
  },
  {
    key: "mars-saturn-dynamic",
    label: "Mars–Saturn mutual aspect",
    kind: "support",
    color: GREEN,
    description: "The two conflict kārakas are directly linked by mutual 7th-house aspect; an independent structural fact.",
  },
  {
    key: "kp-no",
    label: "KP 6th-cuspal NO",
    kind: "contradiction",
    color: VERMILION,
    description: "The 6th cusp's sub-lord Ketu is not a significator — a clean, disclosed divergence.",
  },
];

const DISCIPLINE_STATEMENTS = [
  {
    key: "drop-kp",
    label: "A clean-sounding 'Strong' verdict is better than reporting a genuine contradiction.",
    correction:
      "A contradiction must be reported and must lower the tier. Hiding it to preserve a stronger verdict is a discipline violation.",
  },
  {
    key: "overcorrect",
    label: "A single classical-vs-KP divergence automatically cancels the whole reading to 'no defensible prediction.'",
    correction:
      "Contradiction lowers the tier; it does not erase an otherwise well-evidenced classical case unless nothing remains standing.",
  },
  {
    key: "triple-role",
    label: "Saturn's three structural roles count as three independent timing confirmations for one bhukti.",
    correction:
      "A richly-qualified planet activating is one timing indicator, not several. Separate evidence (e.g., transit) is still needed.",
  },
] as const;

export function LitigationConfidenceSynthesis() {
  const [themeIncluded, setThemeIncluded] = useState<Record<string, boolean>>({
    "classical-sixth": true,
    "mars-saturn-dynamic": true,
    "kp-no": true,
  });
  const [timingIncluded, setTimingIncluded] = useState(true);
  const [attemptedTransit, setAttemptedTransit] = useState(false);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "drop-kp": false,
    overcorrect: false,
    "triple-role": false,
  });

  const supports = useMemo(
    () => THEME_EVIDENCE.filter((e) => themeIncluded[e.key] && e.kind === "support").length,
    [themeIncluded]
  );
  const hasContradiction = useMemo(() => themeIncluded["kp-no"], [themeIncluded]);

  const themeTier = useMemo(() => {
    if (supports === 0 && !hasContradiction) return { label: "No defensible prediction", color: INK_MUTED };
    if (supports === 0 && hasContradiction) return { label: "No defensible prediction", color: INK_MUTED };
    if (supports === 1 && hasContradiction) return { label: "Weak-to-Moderate", color: GOLD };
    if (supports === 2 && hasContradiction) return { label: "Moderate", color: BLUE };
    if (supports === 2 && !hasContradiction) return { label: "Moderate-to-Strong", color: GREEN };
    return { label: "Strong", color: GREEN };
  }, [supports, hasContradiction]);

  const timingTier = useMemo(() => {
    if (!timingIncluded) return { label: "No defensible timing", color: INK_MUTED };
    if (attemptedTransit) return { label: "Moderate", color: BLUE };
    return { label: "Weak-to-Moderate", color: GOLD };
  }, [timingIncluded, attemptedTransit]);

  const clientScript = useMemo(() => {
    const themePart = `On the theme question — is conflict structurally significant in your chart? — I'd place this at ${themeTier.label}.${hasContradiction ? " There is a real internal tension: the classical picture is genuinely strong, but KP gives a clean NO on the exact 6th-cuspal point, and I'm not going to hide that." : ""}`;
    const timingPart = timingIncluded
      ? ` On timing, the Moon MD → Saturn bhukti window around 2027–2028 is the most promising near-term candidate, but I rate that only as ${timingTier.label}${attemptedTransit ? " — and I want to be clear that I have not independently verified a transit confirmation for it" : " because it rests on one indicator, with transit confirmation unavailable"}.`
      : " On timing, I don't have a confidently identifiable window to name.";
    return `${themePart}${timingPart} What I cannot address is the actual legal merits of the case; that belongs with your attorney.`;
  }, [themeTier, hasContradiction, timingIncluded, timingTier, attemptedTransit]);

  function toggleTheme(key: string) {
    setThemeIncluded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setThemeIncluded({ "classical-sixth": true, "mars-saturn-dynamic": true, "kp-no": true });
    setTimingIncluded(true);
    setAttemptedTransit(false);
    setMistakes({ "drop-kp": false, overcorrect: false, "triple-role": false });
  }

  return (
    <div data-interactive="litigation-confidence-synthesis" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chart L1 — full module synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>
              Theme vs. timing confidence for an ongoing court case
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Apply the four-tier confidence framework to Chart L1&apos;s ongoing-litigation question. Watch how a genuine classical-vs-KP contradiction lowers, but does not erase, the theme-level verdict.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Theme-level confidence</p>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
            Is conflict/litigation structurally significant in this chart? Toggle the evidence and the contradiction.
          </p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            {THEME_EVIDENCE.map((ev) => {
              const active = themeIncluded[ev.key];
              return (
                <button
                  key={ev.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleTheme(ev.key)}
                  style={evidenceToggleStyle(active, ev.color)}
                >
                  <span style={{ color: ev.color }}>
                    {active ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
                  </span>
                  <span>
                    <span style={{ display: "block", fontWeight: 600 }}>{ev.label}</span>
                    <span style={{ color: INK_SECONDARY, fontSize: "0.86rem" }}>{ev.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div
            style={{
              marginTop: "0.85rem",
              border: `1px solid ${themeTier.color}55`,
              borderRadius: 8,
              background: `${themeTier.color}0A`,
              padding: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
            }}
          >
            <Scale size={20} color={themeTier.color} aria-hidden="true" />
            <div>
              <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Theme-level verdict
              </span>
              <p style={{ margin: "0.15rem 0 0", color: themeTier.color, fontWeight: 600, fontSize: "1.1rem" }}>
                {themeTier.label}
              </p>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Timing-level confidence</p>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
            Is a specific window confidently identifiable? One richly-qualified indicator is present; transit confirmation is unavailable.
          </p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            <button
              type="button"
              aria-pressed={timingIncluded}
              onClick={() => setTimingIncluded((v) => !v)}
              style={evidenceToggleStyle(timingIncluded, BLUE)}
            >
              <span style={{ color: BLUE }}>
                {timingIncluded ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
              </span>
              <span>
                <span style={{ display: "block", fontWeight: 600 }}>Moon MD → Saturn bhukti</span>
                <span style={{ color: INK_SECONDARY, fontSize: "0.86rem" }}>Age 30.95–32.53 (~2027–2028); Saturn carries three structural roles simultaneously.</span>
              </span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setAttemptedTransit(true)}
            disabled={attemptedTransit || !timingIncluded}
            style={{
              ...buttonStyle(attemptedTransit, GOLD),
              marginTop: "0.75rem",
              width: "100%",
              justifyContent: "center",
              opacity: !timingIncluded ? 0.5 : 1,
            }}
          >
            {attemptedTransit ? <ShieldAlert size={15} aria-hidden="true" /> : <ShieldCheck size={15} aria-hidden="true" />}
            {attemptedTransit ? "Transit confirmation unavailable" : "Attempt to add transit confirmation"}
          </button>
          {attemptedTransit ? (
            <p style={{ margin: "0.55rem 0 0", color: VERMILION, fontSize: "0.86rem", lineHeight: 1.5 }}>
              The tool refuses to fabricate a transit confirmation. Without a verified real-time Saturn transit check, the timing call stays at one indicator.
            </p>
          ) : null}
          <div
            style={{
              marginTop: "0.85rem",
              border: `1px solid ${timingTier.color}55`,
              borderRadius: 8,
              background: `${timingTier.color}0A`,
              padding: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
            }}
          >
            <ClockIcon color={timingTier.color} />
            <div>
              <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Timing-level verdict
              </span>
              <p style={{ margin: "0.15rem 0 0", color: timingTier.color, fontWeight: 600, fontSize: "1.1rem" }}>
                {timingTier.label}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Four-tier framework reference</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.55rem", marginTop: "0.55rem" }}>
          {[
            { label: "Strong", desc: "Two or more independent indicators, no contradiction.", color: GREEN },
            { label: "Moderate-to-Strong", desc: "Two+ indicators, minor tension only.", color: GREEN },
            { label: "Moderate", desc: "Genuine support with a disclosed contradiction.", color: BLUE },
            { label: "Weak-to-Moderate", desc: "One solid indicator or mixed, weaker evidence.", color: GOLD },
            { label: "Weak", desc: "Single weak or conditional indicator.", color: GOLD },
            { label: "No prediction", desc: "Zero usable indicators or mutually cancelling evidence.", color: INK_MUTED },
          ].map((tier) => (
            <div key={tier.label} style={{ border: `1px solid ${tier.color}44`, borderRadius: 8, background: `${tier.color}0A`, padding: "0.65rem" }}>
              <span style={{ color: tier.color, fontWeight: 600, fontSize: "0.9rem" }}>{tier.label}</span>
              <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.78rem", lineHeight: 1.4 }}>{tier.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Live synthesis</p>
        <div
          style={{
            marginTop: "0.55rem",
            border: `1px solid ${PURPLE}55`,
            borderRadius: 8,
            background: `${PURPLE}0A`,
            padding: "0.85rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: PURPLE }}>
            <MessageSquare size={16} aria-hidden="true" />
            <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>Client-facing answer</span>
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.75 }}>{clientScript}</p>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline checks</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>
          Mark each false statement to reveal the correction.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {DISCIPLINE_STATEMENTS.map((s) => {
            const active = mistakes[s.key];
            return (
              <div
                key={s.key}
                style={{
                  border: `1px solid ${active ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${VERMILION}0A` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    color: INK_SECONDARY,
                    cursor: "pointer",
                  }}
                >
                  <input type="checkbox" checked={active} onChange={() => toggleMistake(s.key)} />
                  <span>{s.label}</span>
                </label>
                {active ? (
                  <p style={{ margin: "0.55rem 0 0", color: VERMILION, fontSize: "0.86rem", lineHeight: 1.5 }}>
                    <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" /> {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${PURPLE}66`,
          background: `${PURPLE}0A`,
        }}
      >
        <p style={eyebrowStyle}>Core discipline</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" /> Contradiction lowers the tier; it does not erase the evidence
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.7 }}>
          The classical 6th-house strength and the Mars–Saturn dynamic are two genuinely independent structural supports. The KP 6th-cuspal NO is a real divergence on a more exact technique. Per the four-tier framework, that divergence caps the theme-level verdict at Moderate — it does not justify hiding the KP finding, and it does not cancel the classical case entirely. The timing-level verdict stays Weak-to-Moderate because only one timing indicator is available and transit confirmation is honestly unavailable.
        </p>
      </section>
    </div>
  );
}

function ClockIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function evidenceToggleStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "start",
    gap: "0.7rem",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}0A` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
