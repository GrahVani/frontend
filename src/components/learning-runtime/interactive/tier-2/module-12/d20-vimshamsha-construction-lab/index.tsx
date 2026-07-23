"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Clock3, GitCompare, ListChecks, RotateCcw, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type FocusKey = "algorithm" | "chart" | "nodes" | "birth";
type RowKey = "saturn" | "mars" | "jupiter" | "rahu" | "lagna";

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
  algorithm: {
    label: "Method",
    title: "Run the same three steps every time",
    body: "Classify the D1 sign, find the 1d30m part number, then count from the D20 start sign for that class.",
    icon: <ListChecks size={16} />,
    color: BLUE,
  },
  chart: {
    label: "Chart S1",
    title: "Compute the full chart in one pass",
    body: "The lesson builds all grahas plus Lagna, with Gemini concentration and Libra Saturn emerging from the arithmetic.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  nodes: {
    label: "Nodes",
    title: "Rahu and Ketu symmetry is structural",
    body: "The nodal axis preserves sign-class and within-sign degree, so both nodes always land in the same D20 sign.",
    icon: <GitCompare size={16} />,
    color: GOLD,
  },
  birth: {
    label: "Time",
    title: "Fine parts make confidence time-dependent",
    body: "Each D20 part is only 1d30m wide, so rough birth times must produce suggestive, not decisive, D20 readings.",
    icon: <Clock3 size={16} />,
    color: PURPLE,
  },
};

const ROWS: Record<RowKey, { graha: string; d1: string; className: string; part: string; start: string; d20: string; color: string }> = {
  saturn: { graha: "Saturn", d1: "Capricorn 27d", className: "Movable", part: "19", start: "Aries", d20: "Libra", color: GOLD },
  mars: { graha: "Mars", d1: "Gemini 8d", className: "Dual", part: "6", start: "Leo", d20: "Capricorn", color: VERMILION },
  jupiter: { graha: "Jupiter", d1: "Sagittarius 20d", className: "Dual", part: "14", start: "Leo", d20: "Virgo", color: GREEN },
  rahu: { graha: "Rahu + Ketu", d1: "Libra/Aries 15d", className: "Movable", part: "11", start: "Aries", d20: "Aquarius", color: PURPLE },
  lagna: { graha: "Lagna", d1: "Taurus 10d", className: "Fixed", part: "7", start: "Sagittarius", d20: "Gemini", color: BLUE },
};

export function D20VimshamshaConstructionLab() {
  const [focusKey, setFocusKey] = useState<FocusKey>("algorithm");
  const [rowKey, setRowKey] = useState<RowKey>("saturn");
  const [useD20Starts, setUseD20Starts] = useState(true);
  const [showNodalSymmetry, setShowNodalSymmetry] = useState(true);
  const [crossCheckByHand, setCrossCheckByHand] = useState(true);
  const [verifiedBirthTime, setVerifiedBirthTime] = useState(true);

  const focus = FOCUS[focusKey];
  const row = ROWS[rowKey];

  const status = useMemo(() => {
    if (!useD20Starts) return { label: "D16 start-rule trap", color: VERMILION };
    if (!showNodalSymmetry && rowKey === "rahu") return { label: "nodal symmetry mistaken", color: VERMILION };
    if (!crossCheckByHand) return { label: "table not cross-checked", color: GOLD };
    if (!verifiedBirthTime) return { label: "suggestive D20 confidence", color: GOLD };
    return { label: "D20 construction ready", color: GREEN };
  }, [crossCheckByHand, rowKey, showNodalSymmetry, useD20Starts, verifiedBirthTime]);

  const reading = useMemo(() => {
    if (!useD20Starts) return "Repair the rule: D20 uses movable to Aries, fixed to Sagittarius, and dual to Leo. Do not import the D16 pairing.";
    if (!showNodalSymmetry && rowKey === "rahu") return "Rahu and Ketu sharing Aquarius is expected. The axis preserves sign-class and within-sign degree.";
    if (!crossCheckByHand) return "Work at least two grahas by hand before trusting the full table; one off-by-one part error can shift the sign.";
    if (!verifiedBirthTime) return "Read this D20 as suggestive unless the birth time is well documented; the parts are only 1d30m wide.";
    return `${row.graha}: ${row.d1}, ${row.className.toLowerCase()} sign, part ${row.part}, count from ${row.start}, D20 ${row.d20}.`;
  }, [crossCheckByHand, row, rowKey, showNodalSymmetry, useD20Starts, verifiedBirthTime]);

  return (
    <div data-interactive="d20-vimshamsha-construction-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>D20 Vimshamsha construction lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Build Chart S1 D20 one graha at a time
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Practice the sign-class start rule, part number, nodal symmetry, and birth-time confidence check without modifying the existing navigator.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusKey("algorithm"); setRowKey("saturn"); setUseD20Starts(true); setShowNodalSymmetry(true); setCrossCheckByHand(true); setVerifiedBirthTime(true); }} style={buttonStyle(false, BLUE)}>
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

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(330px, 100%), 1fr))", gap: "1rem" }}>
        <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
          <D20Svg row={row} status={status} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>worked row</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.5rem" }}>
              {(Object.keys(ROWS) as RowKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setRowKey(key)} style={optionStyle(rowKey === key, ROWS[key].color)}>
                  {ROWS[key].graha}
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>construction checks</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Use D20 starts" body="Movable Aries, fixed Sagittarius, dual Leo." color={BLUE} value={useD20Starts} onToggle={() => setUseD20Starts((value) => !value)} />
              <ToggleRow title="Accept nodal symmetry" body="Rahu and Ketu share D20 sign by structure." color={PURPLE} value={showNodalSymmetry} onToggle={() => setShowNodalSymmetry((value) => !value)} />
              <ToggleRow title="Cross-check by hand" body="Verify at least two grahas against the table." color={GREEN} value={crossCheckByHand} onToggle={() => setCrossCheckByHand((value) => !value)} />
              <ToggleRow title="Birth time verified" body="Rough times reduce D20 reading confidence." color={GOLD} value={verifiedBirthTime} onToggle={() => setVerifiedBirthTime((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: status.color, marginTop: "0.15rem" }}>{status.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current construction note</p>
            <h3 style={{ margin: 0, color: status.color, fontSize: "1.1rem", fontWeight: 600 }}>{status.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function D20Svg({ row, status }: { row: (typeof ROWS)[RowKey]; status: { label: string; color: string } }) {
  return (
    <svg viewBox="0 0 920 420" role="img" aria-label="D20 Vimshamsha construction diagram" style={{ width: "100%", minHeight: 420, display: "block" }}>
      <rect x="12" y="12" width="896" height="396" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="460" y="50" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="700">D20 THREE-STEP CONSTRUCTION</text>
      <text x="460" y="84" textAnchor="middle" fill={status.color} fontSize="24" fontWeight="700">{status.label}</text>

      <rect x="70" y="128" width="220" height="116" rx="16" fill={BLUE} fillOpacity="0.1" stroke={BLUE} strokeWidth="1.5" />
      <text x="180" y="161" textAnchor="middle" fill={BLUE} fontSize="17" fontWeight="700">1. Classify</text>
      <text x="180" y="194" textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="600">{row.d1}</text>
      <text x="180" y="220" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">{row.className}</text>

      <rect x="350" y="128" width="220" height="116" rx="16" fill={GREEN} fillOpacity="0.1" stroke={GREEN} strokeWidth="1.5" />
      <text x="460" y="161" textAnchor="middle" fill={GREEN} fontSize="17" fontWeight="700">2. Find part</text>
      <text x="460" y="197" textAnchor="middle" fill={INK_PRIMARY} fontSize="26" fontWeight="700">#{row.part}</text>
      <text x="460" y="224" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">1d30m per part</text>

      <rect x="630" y="128" width="220" height="116" rx="16" fill={row.color} fillOpacity="0.1" stroke={row.color} strokeWidth="1.5" />
      <text x="740" y="161" textAnchor="middle" fill={row.color} fontSize="17" fontWeight="700">3. Count</text>
      <text x="740" y="194" textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="600">from {row.start}</text>
      <text x="740" y="220" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">D20 {row.d20}</text>

      <path d="M180 284 C290 326 630 326 740 284" fill="none" stroke={status.color} strokeWidth="5" strokeLinecap="round" />
      <circle cx="460" cy="314" r="48" fill={status.color} fillOpacity="0.14" stroke={status.color} strokeWidth="1.5" />
      <text x="460" y="310" textAnchor="middle" fill={status.color} fontSize="16" fontWeight="700">{row.graha}</text>
      <text x="460" y="334" textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="600">{row.d20}</text>
      <text x="460" y="384" textAnchor="middle" fill={INK_SECONDARY} fontSize="15" fontWeight="600">Movable starts Aries; fixed starts Sagittarius; dual starts Leo. Tie D20 confidence to birth-time confidence.</text>
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
