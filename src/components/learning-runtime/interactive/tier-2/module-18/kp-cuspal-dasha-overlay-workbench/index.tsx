"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { RotateCcw, ChevronRight, AlertTriangle, CheckCircle2, BookOpen } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "var(--gold-dark, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

type Lens = "both" | "parashari" | "kp";

const WORKED_STEPS = [
  {
    title: "Shared Vimśottarī arithmetic",
    body: "Jupiter mahādaśā, Saturn bhukti. The dates are identical in both Parāśarī and KP — the same 120-year cycle and proportional formula produce the same window.",
  },
  {
    title: "Period-lord → star-lord",
    body: "KP asks what Saturn’s star-lord signifies. In this illustration, Saturn’s star-lord is the Sun, and the Sun signifies the 10th (status) and 11th (gains) houses.",
  },
  {
    title: "Sub-lord polarity",
    body: "The sub-lord refines the read into favourable, unfavourable, or conditional. Here the polarity is favourable — Saturn bhukti reads as promotion-favourable.",
  },
  {
    title: "Ruling-Planets convergence",
    body: "Cross-referencing the day’s Ruling Planets (day-lord, Moon’s star/sign-lord, Lagna’s star/sign-lord) narrows the window to a specific high-probability day, always framed as a KP-doctrine assessment, never a guarantee.",
  },
];

const HAS_DATA = [
  "Planetary sign placements",
  "Whole-sign house mapping",
  "Vimśottarī cascade timing",
  "Graha dṛṣṭi rules",
];

const MISSING_DATA = [
  "Exact birth time (minute-level, ideally rectified)",
  "Geographic birth location",
  "Placidus house cusps via oblique-ascension computation",
  "249-part nakṣatra-subdivision positions",
  "A chosen judgment moment for Ruling Planets",
];

export function KpCuspalDashaOverlayWorkbench() {
  const [lens, setLens] = useState<Lens>("both");
  const [step, setStep] = useState(0);
  const [scopeMode, setScopeMode] = useState<"has" | "missing">("missing");
  const [rivalMode, setRivalMode] = useState(false);

  function reset() {
    setLens("both");
    setStep(0);
    setScopeMode("missing");
    setRivalMode(false);
  }

  return (
    <div
      data-interactive="kp-cuspal-dasha-overlay-workbench"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY, fontFamily: "var(--font-family-sans)" }}
    >
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chapter 3 cross-framework lens</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              KP Cuspal Dasha Overlay Workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Same Vimśottarī dates, genuinely different reading. Compare Parāśarī’s whole-sign cusp check
              with KP’s star-lord/sub-lord/Ruling-Planets overlay.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Choose lens</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
          {[
            { key: "both", label: "Side-by-side" },
            { key: "parashari", label: "Parāśarī only" },
            { key: "kp", label: "KP only" },
          ].map((opt) => (
            <button key={opt.key} type="button" onClick={() => setLens(opt.key as Lens)} style={chipStyle(lens === opt.key)}>
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Shared arithmetic</p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
          <Metric label="Mahādaśā" value="Jupiter" sub="16 years" />
          <Metric label="Bhukti" value="Saturn" sub="2.5333 years" />
          <Metric label="Question" value="Promotion timing" sub="10th / 11th houses" />
        </div>
        <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
          Both frameworks use the identical Vimśottarī arithmetic. The dates do not change; the reading does.
        </p>
      </section>

      {(lens === "both" || lens === "parashari") && (
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Parāśarī lens</p>
          <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            Does the running period-lord itself reach the relevant house through aspect, occupation, or
            ownership?
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem", marginTop: "0.75rem" }}>
            <CheckCard label="Aspect" active={false} text="Saturn in this example does not aspect the 10th/11th by whole-sign graha dṛṣṭi." />
            <CheckCard label="Occupation" active={false} text="Saturn is not placed in the 10th or 11th house." />
            <CheckCard label="Ownership" active text="Saturn owns Capricorn and Aquarius; if either were the relevant cusp, ownership would apply." />
          </div>
        </section>
      )}

      {(lens === "both" || lens === "kp") && (
        <section style={cardStyle}>
          <p style={eyebrowStyle}>KP lens</p>
          <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            The period-lord is read as a proxy for its star-lord’s significations, refined by sub-lord
            polarity, then pinpointed via Ruling Planets.
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.9rem" }}>
            <svg viewBox="0 0 360 140" style={{ width: "100%", maxWidth: 400 }}>
              <rect x="10" y="50" width="70" height="40" rx="6" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="1.5" />
              <text x="45" y="74" textAnchor="middle" style={{ fontSize: "10px", fill: INK_PRIMARY, fontWeight: 600 }}>
                Period-lord
              </text>
              <path d="M 80 70 L 110 70" stroke={HAIRLINE} strokeWidth="1.5" markerEnd="url(#arrow)" />

              <rect x="110" y="50" width="70" height="40" rx="6" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="1.5" />
              <text x="145" y="74" textAnchor="middle" style={{ fontSize: "10px", fill: INK_PRIMARY, fontWeight: 600 }}>
                Star-lord
              </text>
              <path d="M 180 70 L 210 70" stroke={HAIRLINE} strokeWidth="1.5" markerEnd="url(#arrow)" />

              <rect x="210" y="50" width="70" height="40" rx="6" fill={`${AMBER}18`} stroke={AMBER} strokeWidth="1.5" />
              <text x="245" y="74" textAnchor="middle" style={{ fontSize: "10px", fill: INK_PRIMARY, fontWeight: 600 }}>
                Sub-lord
              </text>
              <path d="M 280 70 L 310 70" stroke={HAIRLINE} strokeWidth="1.5" markerEnd="url(#arrow)" />

              <rect x="310" y="50" width="45" height="40" rx="6" fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth="1.5" />
              <text x="332" y="74" textAnchor="middle" style={{ fontSize: "9px", fill: INK_PRIMARY, fontWeight: 600 }}>
                RP
              </text>

              <defs>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 L0,0" fill={HAIRLINE} />
                </marker>
              </defs>
            </svg>
          </div>
        </section>
      )}

      <section
        style={{
          ...cardStyle,
          background: "#F5EDD8",
          borderLeft: "4px solid var(--gold-primary, #C9A24D)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BookOpen size={18} color={GOLD} />
          <p style={{ ...eyebrowStyle, color: GOLD, margin: 0 }}>T1-16 credited worked example</p>
        </div>
        <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Reused from T1-16 Lesson 16.8.4 §6, not recomputed for Kavya. Click through the KP reading layers.
        </p>
        <div style={{ marginTop: "0.9rem", padding: "0.9rem", borderRadius: "8px", background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p style={{ margin: 0, color: GOLD, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
            Layer {step + 1} of {WORKED_STEPS.length}
          </p>
          <h3 style={{ margin: "0.3rem 0 0", fontSize: "1.1rem", fontWeight: 600, color: INK_PRIMARY }}>
            {WORKED_STEPS[step].title}
          </h3>
          <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {WORKED_STEPS[step].body}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              style={{ ...buttonStyle(false, GOLD), opacity: step === 0 ? 0.5 : 1 }}
            >
              Back
            </button>
            <button
              type="button"
              disabled={step === WORKED_STEPS.length - 1}
              onClick={() => setStep((s) => Math.min(WORKED_STEPS.length - 1, s + 1))}
              style={{ ...buttonStyle(false, GOLD), opacity: step === WORKED_STEPS.length - 1 ? 0.5 : 1 }}
            >
              Next layer <ChevronRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Scope honesty — what would Kavya’s chart need?</p>
          <button type="button" onClick={() => setScopeMode((m) => (m === "has" ? "missing" : "has"))} style={pillStyle(scopeMode === "missing")}>
            {scopeMode === "has" ? "Show missing data" : "Show available data"}
          </button>
        </div>
        <ul style={{ margin: "0.75rem 0 0", paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.7 }}>
          {(scopeMode === "has" ? HAS_DATA : MISSING_DATA).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {scopeMode === "missing" && (
          <p style={{ margin: "0.75rem 0 0", color: VERMILION, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <AlertTriangle size={16} /> This module deliberately does not invent Placidus cusp degrees for Kavya.
          </p>
        )}
      </section>

      <section style={{ ...cardStyle, borderColor: rivalMode ? `${VERMILION}88` : `${GREEN}88`, background: rivalMode ? `${VERMILION}0A` : `${GREEN}0A` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Framework relationship</p>
          <button type="button" onClick={() => setRivalMode((v) => !v)} style={pillStyle(rivalMode)}>
            {rivalMode ? "Show complementarity" : "Show rivalry mistake"}
          </button>
        </div>
        {rivalMode ? (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", alignItems: "start" }}>
            <AlertTriangle size={20} color={VERMILION} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Mistake: “Parāśarī and KP give different answers, so one must be wrong.” This forces a false
              winner and suppresses genuine divergence.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", alignItems: "start" }}>
            <CheckCircle2 size={20} color={GREEN} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Correct discipline: both are legitimate within their own framework. Agreement between
              independent methods amplifies confidence; divergence invites investigation, not suppression.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ padding: "0.75rem 1rem", borderRadius: "8px", background: `${GOLD}0A`, border: `1px solid ${HAIRLINE}`, minWidth: 130 }}>
      <p style={{ margin: 0, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, color: INK_MUTED }}>
        {label}
      </p>
      <p style={{ margin: "0.25rem 0 0", fontWeight: 600, color: INK_PRIMARY }}>{value}</p>
      <p style={{ margin: "0.15rem 0 0", fontSize: "0.78rem", color: INK_MUTED }}>{sub}</p>
    </div>
  );
}

function CheckCard({ label, active, text }: { label: string; active: boolean; text: string }) {
  return (
    <div style={{ padding: "0.75rem", borderRadius: "8px", border: `1px solid ${active ? GREEN : HAIRLINE}`, background: active ? `${GREEN}0A` : SURFACE }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, color: INK_MUTED }}>
          {label}
        </p>
        {active ? <CheckCircle2 size={16} color={GREEN} /> : <span style={{ color: INK_MUTED, fontSize: "0.75rem" }}>—</span>}
      </div>
      <p style={{ margin: "0.4rem 0 0", color: active ? INK_PRIMARY : INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
        {text}
      </p>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "8px",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  fontWeight: 700,
  color: INK_MUTED,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.45rem 0.9rem",
    borderRadius: "8px",
    border: `1px solid ${color}`,
    background: active ? color : "transparent",
    color: active ? "#fff" : color,
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function chipStyle(active: boolean): CSSProperties {
  return {
    padding: "0.35rem 0.75rem",
    borderRadius: "6px",
    border: `1px solid ${active ? GOLD : HAIRLINE}`,
    background: active ? `${GOLD}15` : SURFACE,
    color: active ? GOLD : INK_PRIMARY,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function pillStyle(active: boolean): CSSProperties {
  return {
    padding: "0.4rem 0.85rem",
    borderRadius: "9999px",
    border: `1px solid ${active ? GOLD : HAIRLINE}`,
    background: active ? `${GOLD}15` : "transparent",
    color: active ? GOLD : INK_SECONDARY,
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
