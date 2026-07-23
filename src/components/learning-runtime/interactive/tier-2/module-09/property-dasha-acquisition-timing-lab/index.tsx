"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { GitCompare, ListChecks, RotateCcw, ShieldCheck, Sparkles, Telescope, TriangleAlert } from "lucide-react";

type FocusKey = "presence" | "scan" | "compare" | "transit";
type ViewMode = "all" | "practical" | "overlap" | "new";

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
  presence: {
    label: "Presence",
    title: "Presence is not timing",
    body: "Mars and Saturn describe the property promise from birth; dasha and bhukti show when that promise can fire.",
    icon: <ShieldCheck size={16} />,
    color: BLUE,
  },
  scan: {
    label: "Scan",
    title: "Scan the wider classical span",
    body: "This lesson scans Mars and Saturn bhuktis across Saturn, Mercury, Ketu, and Venus Mahadashas, not only Mercury MD.",
    icon: <ListChecks size={16} />,
    color: GREEN,
  },
  compare: {
    label: "Compare",
    title: "Overlap is real; silence is not disagreement",
    body: "Mercury-MD Mars and Saturn windows overlap KP. Ketu-MD windows are new because KP did not scan that Mahadasha.",
    icon: <GitCompare size={16} />,
    color: GOLD,
  },
  transit: {
    label: "Transit",
    title: "State the rule; do not fabricate positions",
    body: "Transit confirmation is conceptual here: Jupiter or Saturn activating the 4th, 4th lord, or Mars during a dasha window.",
    icon: <Telescope size={16} />,
    color: PURPLE,
  },
};

const WINDOWS = [
  { md: "Saturn MD", lord: "Mars", age: "5.86-6.97", note: "technical, not adult acquisition", kind: "early", color: VERMILION },
  { md: "Mercury MD", lord: "Mars", age: "20.85-21.84", note: "matches KP Mars window", kind: "overlap", color: GREEN },
  { md: "Mercury MD", lord: "Saturn", age: "26.66-29.35", note: "matches KP Saturn window", kind: "overlap", color: GREEN },
  { md: "Ketu MD", lord: "Mars", age: "31.86-32.27", note: "new wider-scan finding", kind: "new", color: BLUE },
  { md: "Ketu MD", lord: "Saturn", age: "34.25-35.36", note: "new wider-scan finding", kind: "new", color: BLUE },
  { md: "Venus MD", lord: "Mars", age: "42.35-43.52", note: "later-life candidate", kind: "later", color: GOLD },
  { md: "Venus MD", lord: "Saturn", age: "49.18-52.35", note: "later-life candidate", kind: "later", color: GOLD },
];

export function PropertyDashaAcquisitionTimingLab() {
  const [focusKey, setFocusKey] = useState<FocusKey>("presence");
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [includeAgeSix, setIncludeAgeSix] = useState(true);
  const [respectKpScope, setRespectKpScope] = useState(true);
  const [keepTransitConceptual, setKeepTransitConceptual] = useState(true);
  const [useParticipatingPlanets, setUseParticipatingPlanets] = useState(true);

  const focus = FOCUS[focusKey];
  const visibleWindows = useMemo(() => {
    return WINDOWS.filter((window) => {
      if (!includeAgeSix && window.kind === "early") return false;
      if (viewMode === "practical") return window.kind !== "early";
      if (viewMode === "overlap") return window.kind === "overlap";
      if (viewMode === "new") return window.kind === "new";
      return true;
    });
  }, [includeAgeSix, viewMode]);

  const status = useMemo(() => {
    if (!useParticipatingPlanets) return { label: "participating planets missing", color: VERMILION };
    if (!includeAgeSix) return { label: "technical window hidden", color: GOLD };
    if (!respectKpScope) return { label: "KP silence misread", color: VERMILION };
    if (!keepTransitConceptual) return { label: "unverified transit fabricated", color: VERMILION };
    return { label: "complete classical timing scan", color: GREEN };
  }, [includeAgeSix, keepTransitConceptual, respectKpScope, useParticipatingPlanets]);

  const reading = useMemo(() => {
    if (!useParticipatingPlanets) return "Repair the setup: classical property timing scans Mars as occupant and karaka, and Saturn as 4th lord.";
    if (!includeAgeSix) return "The age-6 Mars window is not practically actionable for adult acquisition, but it should be reported as a genuine technical window.";
    if (!respectKpScope) return "Ketu-MD windows are not contradicted by KP; Lesson 9.3.3 simply did not scan Ketu MD.";
    if (!keepTransitConceptual) return "Do not invent future transit positions. State the confirmation rule and leave exact application to a real ephemeris check.";
    return "Chart P1: classical timing overlaps KP at the Mercury-MD Mars and Saturn windows, then adds Ketu and Venus MD candidates from the wider scan.";
  }, [includeAgeSix, keepTransitConceptual, respectKpScope, useParticipatingPlanets]);

  return (
    <div data-interactive="property-dasha-acquisition-timing-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>property dasha timing lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Scan Mars and Saturn windows without overclaiming the timing
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Generalise presence-versus-timing from yoga fruition to property acquisition, then compare the classical scan with the KP-only pass.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusKey("presence"); setViewMode("all"); setIncludeAgeSix(true); setRespectKpScope(true); setKeepTransitConceptual(true); setUseParticipatingPlanets(true); }} style={buttonStyle(false, BLUE)}>
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
          <TimingSvg windows={visibleWindows} status={status} />
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
              <button type="button" onClick={() => setViewMode("all")} style={optionStyle(viewMode === "all", BLUE)}>All</button>
              <button type="button" onClick={() => setViewMode("practical")} style={optionStyle(viewMode === "practical", GREEN)}>Adult</button>
              <button type="button" onClick={() => setViewMode("overlap")} style={optionStyle(viewMode === "overlap", GOLD)}>Overlap</button>
              <button type="button" onClick={() => setViewMode("new")} style={optionStyle(viewMode === "new", PURPLE)}>New</button>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>method discipline</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Use Mars and Saturn" body="Classical participants are occupant/karaka Mars and 4th lord Saturn." color={BLUE} value={useParticipatingPlanets} onToggle={() => setUseParticipatingPlanets((value) => !value)} />
              <ToggleRow title="Show age-6 window" body="Technically genuine, then flagged as not adult-acquisition relevant." color={GOLD} value={includeAgeSix} onToggle={() => setIncludeAgeSix((value) => !value)} />
              <ToggleRow title="Respect KP scope" body="Ketu-MD silence is not disagreement because KP did not scan it." color={GREEN} value={respectKpScope} onToggle={() => setRespectKpScope((value) => !value)} />
              <ToggleRow title="Keep transit conceptual" body="No future-year transit positions without ephemeris verification." color={VERMILION} value={keepTransitConceptual} onToggle={() => setKeepTransitConceptual((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: status.color, marginTop: "0.15rem" }}>{status.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current timing reading</p>
            <h3 style={{ margin: 0, color: status.color, fontSize: "1.1rem", fontWeight: 600 }}>{status.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TimingSvg({ windows, status }: { windows: typeof WINDOWS; status: { label: string; color: string } }) {
  return (
    <svg viewBox="0 0 820 560" role="img" aria-label="Classical property dasha timing scan diagram" style={{ width: "100%", minHeight: 480, display: "block" }}>
      <rect x="12" y="12" width="796" height="536" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="56" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="700">CLASSICAL PROPERTY DASHA SCAN</text>
      <text x="410" y="92" textAnchor="middle" fill={status.color} fontSize="22" fontWeight="700">{status.label}</text>
      <line x1="72" y1="280" x2="748" y2="280" stroke={HAIRLINE} strokeWidth="2" />
      {windows.map((window, index) => {
        const x = 90 + index * (640 / Math.max(windows.length - 1, 1));
        const y = window.lord === "Mars" ? 230 : 330;
        return (
          <g key={`${window.md}-${window.lord}-${window.age}`}>
            <line x1={x} y1="280" x2={x} y2={y} stroke={window.color} strokeWidth="4" strokeLinecap="round" />
            <circle cx={x} cy={y} r="30" fill={window.color} fillOpacity="0.15" stroke={window.color} strokeWidth="4" />
            <text x={x} y={y + 6} textAnchor="middle" fill={window.color} fontSize="13" fontWeight="700">{window.lord}</text>
            <text x={x} y={window.lord === "Mars" ? y - 54 : y + 56} textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="700">{window.age}</text>
            <text x={x} y={window.lord === "Mars" ? y - 34 : y + 78} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">{window.md}</text>
          </g>
        );
      })}
      <rect x="178" y="426" width="464" height="58" rx="12" fill={status.color} fillOpacity="0.1" stroke={status.color} strokeWidth="1.5" />
      <text x="410" y="461" textAnchor="middle" fill={status.color} fontSize="15" fontWeight="700">transit confirmation remains conceptual until verified</text>
      <text x="410" y="526" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">Mars and Saturn windows are candidates; practical relevance is a separate judgement.</text>
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
