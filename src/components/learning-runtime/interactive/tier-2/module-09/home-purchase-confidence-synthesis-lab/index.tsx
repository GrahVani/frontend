"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CalendarRange, MessageSquareText, RotateCcw, Scale, Sparkles, TriangleAlert } from "lucide-react";

type FocusKey = "windows" | "tiers" | "saturn" | "client";
type FilterKey = "all" | "moderate" | "weak" | "primary";

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
  windows: {
    label: "Windows",
    title: "Assemble all five candidate windows",
    body: "Two windows converge across classical and KP timing, two are classical-only Ketu-MD windows, and one is KP-only Moon bhukti.",
    icon: <CalendarRange size={16} />,
    color: BLUE,
  },
  tiers: {
    label: "Tiers",
    title: "Count timing indicators only",
    body: "Two independent timing indicators produce Moderate confidence. One timing indicator produces Weak confidence. No window reaches Strong.",
    icon: <BadgeCheck size={16} />,
    color: GREEN,
  },
  saturn: {
    label: "Saturn",
    title: "Primary does not mean Strong",
    body: "Saturn is highlighted for qualitative reasons: 4th-lord directness, structural relevance, and thematic coherence.",
    icon: <Scale size={16} />,
    color: GOLD,
  },
  client: {
    label: "Client",
    title: "Give a useful window, not a false date",
    body: "The final answer is a graded likelihood trajectory, held as a multi-year window rather than a guaranteed date.",
    icon: <MessageSquareText size={16} />,
    color: PURPLE,
  },
};

const WINDOWS = [
  { label: "Moon bhukti", age: "19.43-20.85", source: "KP only", tier: "Weak", primary: false, color: PURPLE, indicators: 1 },
  { label: "Mars bhukti", age: "20.85-21.84", source: "Classical + KP", tier: "Moderate", primary: false, color: GREEN, indicators: 2 },
  { label: "Saturn bhukti", age: "26.66-29.35", source: "Classical + KP", tier: "Moderate", primary: true, color: GOLD, indicators: 2 },
  { label: "Mars bhukti", age: "31.86-32.27", source: "Classical only", tier: "Weak", primary: false, color: BLUE, indicators: 1 },
  { label: "Saturn bhukti", age: "34.25-35.36", source: "Classical only", tier: "Weak", primary: false, color: BLUE, indicators: 1 },
];

export function HomePurchaseConfidenceSynthesisLab() {
  const [focusKey, setFocusKey] = useState<FocusKey>("windows");
  const [filterKey, setFilterKey] = useState<FilterKey>("all");
  const [countOnlyTimingIndicators, setCountOnlyTimingIndicators] = useState(true);
  const [keepSaturnModerate, setKeepSaturnModerate] = useState(true);
  const [useWindowNotDate, setUseWindowNotDate] = useState(true);
  const [includeWeakWindows, setIncludeWeakWindows] = useState(true);

  const focus = FOCUS[focusKey];
  const visibleWindows = useMemo(() => {
    return WINDOWS.filter((window) => {
      if (!includeWeakWindows && window.tier === "Weak") return false;
      if (filterKey === "moderate") return window.tier === "Moderate";
      if (filterKey === "weak") return window.tier === "Weak";
      if (filterKey === "primary") return window.primary;
      return true;
    });
  }, [filterKey, includeWeakWindows]);

  const status = useMemo(() => {
    if (!countOnlyTimingIndicators) return { label: "relevance counted as timing", color: VERMILION };
    if (!keepSaturnModerate) return { label: "primary candidate inflated", color: VERMILION };
    if (!includeWeakWindows) return { label: "weak windows hidden", color: GOLD };
    if (!useWindowNotDate) return { label: "false date precision", color: VERMILION };
    return { label: "honest Moderate primary answer", color: GREEN };
  }, [countOnlyTimingIndicators, includeWeakWindows, keepSaturnModerate, useWindowNotDate]);

  const reading = useMemo(() => {
    if (!countOnlyTimingIndicators) return "Repair the tier count: KP sub-lord convergence confirms Saturn relevance, but it is not a third timing indicator.";
    if (!keepSaturnModerate) return "Saturn can be the primary candidate for qualitative reasons while remaining Moderate by indicator count.";
    if (!includeWeakWindows) return "Keep the weaker windows visible. They are held loosely, not erased from the final trajectory.";
    if (!useWindowNotDate) return "Do not compress a two-and-a-half-year window into one guaranteed date under client pressure.";
    return "Final answer: the Saturn window around age 27-29 is the primary Moderate candidate, with the Mars early-twenties window also Moderate and later possibilities held weakly.";
  }, [countOnlyTimingIndicators, includeWeakWindows, keepSaturnModerate, useWindowNotDate]);

  return (
    <div data-interactive="home-purchase-confidence-synthesis-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>home purchase confidence synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Tier the final home-buying windows without inflating Saturn
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Assemble every timing candidate, count only true timing indicators, and translate the result into precise client-facing language.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusKey("windows"); setFilterKey("all"); setCountOnlyTimingIndicators(true); setKeepSaturnModerate(true); setUseWindowNotDate(true); setIncludeWeakWindows(true); }} style={buttonStyle(false, BLUE)}>
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

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.65fr)", gap: "1rem", alignItems: "start" }}>
        <div style={cardStyle}>
          <ConfidenceSvg windows={visibleWindows} status={status} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>window filter</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.5rem" }}>
              <button type="button" onClick={() => setFilterKey("all")} style={optionStyle(filterKey === "all", BLUE)}>All</button>
              <button type="button" onClick={() => setFilterKey("moderate")} style={optionStyle(filterKey === "moderate", GREEN)}>Moderate</button>
              <button type="button" onClick={() => setFilterKey("weak")} style={optionStyle(filterKey === "weak", PURPLE)}>Weak</button>
              <button type="button" onClick={() => setFilterKey("primary")} style={optionStyle(filterKey === "primary", GOLD)}>Primary</button>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>tier discipline</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Count timing only" body="Structural relevance is useful, but not a timing vote." color={BLUE} value={countOnlyTimingIndicators} onToggle={() => setCountOnlyTimingIndicators((value) => !value)} />
              <ToggleRow title="Keep Saturn Moderate" body="Primary candidate remains Moderate, not Strong." color={GOLD} value={keepSaturnModerate} onToggle={() => setKeepSaturnModerate((value) => !value)} />
              <ToggleRow title="Show weak windows" body="Weak possibilities are held loosely, not hidden." color={PURPLE} value={includeWeakWindows} onToggle={() => setIncludeWeakWindows((value) => !value)} />
              <ToggleRow title="Use a window, not a date" body="The answer stays non-fatalistic and appropriately precise." color={VERMILION} value={useWindowNotDate} onToggle={() => setUseWindowNotDate((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: status.color, marginTop: "0.15rem" }}>{status.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>final client answer</p>
            <h3 style={{ margin: 0, color: status.color, fontSize: "1.1rem", fontWeight: 600 }}>{status.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ConfidenceSvg({ windows, status }: { windows: typeof WINDOWS; status: { label: string; color: string } }) {
  return (
    <svg viewBox="0 0 820 560" role="img" aria-label="Home purchase timing confidence tier diagram" style={{ width: "100%", minHeight: 480, display: "block" }}>
      <rect x="12" y="12" width="796" height="536" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="56" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="700">FINAL HOME PURCHASE TIMING TIERS</text>
      <text x="410" y="92" textAnchor="middle" fill={status.color} fontSize="22" fontWeight="700">{status.label}</text>
      <line x1="90" y1="280" x2="730" y2="280" stroke={HAIRLINE} strokeWidth="2" />
      {windows.map((window, index) => {
        const x = 110 + index * (600 / Math.max(windows.length - 1, 1));
        const y = window.tier === "Moderate" ? 226 : 338;
        return (
          <g key={`${window.label}-${window.age}`}>
            <line x1={x} y1="280" x2={x} y2={y} stroke={window.color} strokeWidth="4" strokeLinecap="round" />
            <circle cx={x} cy={y} r={window.primary ? 36 : 30} fill={window.color} fillOpacity="0.16" stroke={window.color} strokeWidth="4" />
            <text x={x} y={y + 6} textAnchor="middle" fill={window.color} fontSize="13" fontWeight="700">{window.tier}</text>
            <text x={x} y={window.tier === "Moderate" ? y - 58 : y + 58} textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="700">{window.age}</text>
            <text x={x} y={window.tier === "Moderate" ? y - 36 : y + 80} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">{window.label}</text>
          </g>
        );
      })}
      <rect x="178" y="428" width="464" height="58" rx="12" fill={status.color} fillOpacity="0.1" stroke={status.color} strokeWidth="1.5" />
      <text x="410" y="463" textAnchor="middle" fill={status.color} fontSize="15" fontWeight="700">no window reaches Strong; Saturn is primary within Moderate</text>
      <text x="410" y="526" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">Confidence is counted by matching timing indicators, not by general relevance.</text>
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
  return { border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.65rem 0.45rem", cursor: "pointer", fontWeight: 600 };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
