"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Compass, Home, Layers3, RotateCcw, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type FocusKey = "lagna" | "fourth" | "dignity" | "integration";
type ReadingMode = "d4" | "d1";

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

const FOCUS: Record<FocusKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  lagna: {
    label: "D4 Lagna",
    title: "Aries anchors the property chart",
    body: "The D4 Lagna is Aries, so Mars becomes the D4 Lagna lord and property matters take an active, self-directed tone.",
    icon: <Compass size={16} />,
    color: BLUE,
  },
  fourth: {
    label: "D4 4th",
    title: "Cancer is the D4 property house",
    body: "Read the D4 4th from the D4 Lagna: Cancer, lord Moon, occupied by Mars and Venus.",
    icon: <Home size={16} />,
    color: GOLD,
  },
  dignity: {
    label: "Dignity",
    title: "Judge each lord inside the same chart",
    body: "Mars may be exalted in D1, but as D4 Lagna lord it is judged by its D4 placement: Cancer, debilitation.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  integration: {
    label: "Integrate",
    title: "Do not cancel either chart layer",
    body: "Strong D1 with weaker D4 means property is promised but harder to secure, not denied.",
    icon: <Layers3 size={16} />,
    color: PURPLE,
  },
};

const D4_FACTS = [
  { label: "D4 Lagna", value: "Aries", note: "self-starting property orientation", color: BLUE },
  { label: "Lagna lord", value: "Mars in Cancer", note: "D4 debilitation, not D1 exaltation", color: VERMILION },
  { label: "D4 4th", value: "Cancer", note: "property house inside the D4", color: GOLD },
  { label: "4th lord", value: "Moon in Libra", note: "kendra placement, neutral dignity", color: GREEN },
  { label: "Occupants", value: "Mars + Venus", note: "debilitated Mars, Venus in enemy sign", color: PURPLE },
];

export function D4InternalLagnaFourthReadingLab() {
  const [focusKey, setFocusKey] = useState<FocusKey>("fourth");
  const [readingMode, setReadingMode] = useState<ReadingMode>("d4");
  const [stateD4First, setStateD4First] = useState(true);
  const [holdD1D4Together, setHoldD1D4Together] = useState(true);

  const focus = FOCUS[focusKey];
  const usesCorrectLayer = readingMode === "d4";

  const verdict = useMemo(() => {
    if (!usesCorrectLayer) return { label: "borrowed D1 dignity", color: VERMILION };
    if (!stateD4First) return { label: "D4-only reading skipped", color: GOLD };
    if (!holdD1D4Together) return { label: "layer cancellation risk", color: VERMILION };
    return { label: "D4 internal reading disciplined", color: GREEN };
  }, [holdD1D4Together, stateD4First, usesCorrectLayer]);

  const reading = useMemo(() => {
    if (!usesCorrectLayer) return "Repair the dignity check: Mars is D4 Lagna lord, so use its D4 placement in Cancer, where it is debilitated.";
    if (!stateD4First) return "State the D4 on its own terms before softening it with D1. The D4 4th is mixed-to-weak by dignity.";
    if (!holdD1D4Together) return "Do not let the weak D4 cancel the strong D1. The correct synthesis is promised but harder to secure.";
    return "D4 Lagna Aries gives Mars the D4 anchor role; the D4 4th is Cancer, with Moon in Libra and Mars/Venus occupying Cancer. This is a mixed-to-weak D4 property layer.";
  }, [holdD1D4Together, stateD4First, usesCorrectLayer]);

  return (
    <div data-interactive="d4-internal-lagna-fourth-reading-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>D4 internal reading lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Read the D4 Lagna and D4 4th house on their own terms
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Compare D4-internal dignity against the tempting D1 shortcut, then hold the strong D1 and weaker D4 without cancelling either layer.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusKey("fourth"); setReadingMode("d4"); setStateD4First(true); setHoldD1D4Together(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS) as FocusKey[]).map((key) => (
            <button key={key} type="button" onClick={() => setFocusKey(key)} style={buttonStyle(focusKey === key, FOCUS[key].color)}>
              {FOCUS[key].icon}
              {FOCUS[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(300px, 0.92fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <D4ReadingSvg readingMode={readingMode} verdict={verdict} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>dignity source</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.5rem" }}>
              <button type="button" onClick={() => setReadingMode("d4")} style={optionStyle(readingMode === "d4", GREEN)}>
                <span style={{ fontWeight: 600 }}>Use D4</span>
                <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>Mars debilitated</span>
              </button>
              <button type="button" onClick={() => setReadingMode("d1")} style={optionStyle(readingMode === "d1", VERMILION)}>
                <span style={{ fontWeight: 600 }}>Borrow D1</span>
                <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>Mars exalted</span>
              </button>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>reading discipline</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="State D4 first" body="Give the D4-only finding before comparing to D1." color={GOLD} value={stateD4First} onToggle={() => setStateD4First((value) => !value)} />
              <ToggleRow title="Hold D1 and D4 together" body="Strong D1 plus weak D4 means promised but harder to secure." color={PURPLE} value={holdD1D4Together} onToggle={() => setHoldD1D4Together((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: verdict.color, marginTop: "0.15rem" }}>{verdict.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current D4 reading</p>
            <h3 style={{ margin: 0, color: verdict.color, fontSize: "1.1rem", fontWeight: 600 }}>{verdict.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function D4ReadingSvg({ readingMode, verdict }: { readingMode: ReadingMode; verdict: { label: string; color: string } }) {
  return (
    <svg viewBox="0 0 760 460" role="img" aria-label="D4 Lagna and fourth house internal reading diagram" style={{ width: "100%", minHeight: 360, display: "block" }}>
      <rect x="12" y="12" width="736" height="436" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="48" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">CHART P1 D4 INTERNAL READING</text>
      <text x="380" y="78" textAnchor="middle" fill={verdict.color} fontSize="18" fontWeight="600">{verdict.label}</text>
      {D4_FACTS.map((fact, index) => {
        const x = 134 + (index % 3) * 246;
        const y = index < 3 ? 160 : 270;
        const active = readingMode === "d4" || fact.label !== "Lagna lord";
        return (
          <g key={fact.label}>
            <rect x={x - 84} y={y - 42} width="168" height="84" rx="14" fill={active ? fact.color : VERMILION} fillOpacity={active ? "0.12" : "0.18"} stroke={active ? fact.color : VERMILION} />
            <text x={x} y={y - 15} textAnchor="middle" fill={active ? fact.color : VERMILION} fontSize="12" fontWeight="600">{fact.label}</text>
            <text x={x} y={y + 7} textAnchor="middle" fill={INK_PRIMARY} fontSize="13">{fact.value}</text>
            <text x={x} y={y + 28} textAnchor="middle" fill={INK_MUTED} fontSize="10">{fact.note}</text>
          </g>
        );
      })}
      <path d="M154 374 C260 335 311 335 380 374 S522 416 606 374" fill="none" stroke={verdict.color} strokeWidth="3" strokeLinecap="round" />
      <text x="380" y="413" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">{readingMode === "d4" ? "Each D4 lord is judged by its D4 placement." : "Borrowing D1 Mars exaltation hides the D4 finding."}</text>
    </svg>
  );
}

function ToggleRow({ title, body, color, value, onToggle }: { title: string; body: string; color: string; value: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} style={toggleStyle(value, color)}>
      <span style={{ display: "grid", gap: "0.15rem", textAlign: "left" }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</span>
      </span>
      <span style={{ width: 42, height: 23, borderRadius: 999, border: `1px solid ${value ? color : HAIRLINE}`, background: value ? `${color}24` : SURFACE, padding: 2, display: "flex", justifyContent: value ? "flex-end" : "flex-start", flex: "0 0 auto" }}>
        <span style={{ width: 17, height: 17, borderRadius: 999, background: value ? color : INK_MUTED }} />
      </span>
    </button>
  );
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.72rem", fontWeight: 600 };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 999, background: active ? `${color}18` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.55rem 0.78rem", cursor: "pointer", fontWeight: 600 };
}

function optionStyle(active: boolean, color: string): CSSProperties {
  return { display: "grid", gap: "0.18rem", textAlign: "left", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
