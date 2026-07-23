"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { GitCompare, Layers3, MessageSquareText, RotateCcw, Scale, Sparkles, TriangleAlert } from "lucide-react";

type FocusKey = "table" | "relationships" | "saturn" | "summary";
type CategoryKey = "additive" | "echo" | "disagreement" | "silence" | "timing";

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
  table: {
    label: "Rows",
    title: "Keep every row traceable",
    body: "The final reading must stay linked to the eight disclosed findings: classical, Lal Kitab, KP relevance, KP divergence, hierarchy, and timing.",
    icon: <Layers3 size={16} />,
    color: BLUE,
  },
  relationships: {
    label: "Shapes",
    title: "Sort by relationship shape",
    body: "Within-framework support can stack. Cross-framework echoes are notable but separate. Disagreement is disclosed without forcing a winner.",
    icon: <GitCompare size={16} />,
    color: GREEN,
  },
  saturn: {
    label: "Saturn",
    title: "Relevance is not favourability",
    body: "KP confirms Saturn is structurally relevant; the judgement that Saturn complicates the process is a classical judgement.",
    icon: <Scale size={16} />,
    color: GOLD,
  },
  summary: {
    label: "Summary",
    title: "Client language stays precise",
    body: "The client-facing answer should say mostly convergent, one disclosed disagreement, and one unique timing contribution.",
    icon: <MessageSquareText size={16} />,
    color: PURPLE,
  },
};

const CATEGORY: Record<CategoryKey, { label: string; color: string }> = {
  additive: { label: "within-framework additive", color: GREEN },
  echo: { label: "cross-framework echo", color: BLUE },
  disagreement: { label: "disclosed disagreement", color: VERMILION },
  silence: { label: "system silence", color: GOLD },
  timing: { label: "unique timing layer", color: PURPLE },
};

const FINDINGS: Array<{ source: string; short: string; category: CategoryKey }> = [
  { source: "Classical D1+D4", short: "strong capacity + Saturn process complication", category: "additive" },
  { source: "Lal Kitab Teva", short: "Moon and Jupiter echo home comfort", category: "echo" },
  { source: "Lal Kitab Nek/Bad", short: "Mars tends toward Mangal bad", category: "disagreement" },
  { source: "Lal Kitab boundary", short: "silent on Saturn property role", category: "silence" },
  { source: "KP sub-lord", short: "Saturn relevance confirmed", category: "echo" },
  { source: "KP house split", short: "Saturn shifts 8th to 7th by system", category: "disagreement" },
  { source: "KP hierarchy", short: "Moon > Mars > Saturn", category: "echo" },
  { source: "KP timing", short: "three windows; Saturn cleanest", category: "timing" },
];

export function CrossStreamPropertySynthesisLab() {
  const [focusKey, setFocusKey] = useState<FocusKey>("table");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("echo");
  const [forceMarsAgreement, setForceMarsAgreement] = useState(false);
  const [overcountSaturn, setOvercountSaturn] = useState(false);
  const [treatKpAsFavourability, setTreatKpAsFavourability] = useState(false);
  const [includeTiming, setIncludeTiming] = useState(true);

  const focus = FOCUS[focusKey];
  const visibleFindings = FINDINGS.filter((finding) => finding.category === activeCategory);
  const status = useMemo(() => {
    if (forceMarsAgreement) return { label: "disagreement is being hidden", color: VERMILION };
    if (overcountSaturn) return { label: "Saturn count is inflated", color: VERMILION };
    if (treatKpAsFavourability) return { label: "KP claim is over-read", color: GOLD };
    if (!includeTiming) return { label: "timing layer omitted", color: GOLD };
    return { label: "complete cross-stream synthesis", color: GREEN };
  }, [forceMarsAgreement, includeTiming, overcountSaturn, treatKpAsFavourability]);

  const summary = useMemo(() => {
    if (forceMarsAgreement) return "Repair the reading: Mars exaltation and Lal Kitab Mangal-bad are different framework claims and should both be disclosed.";
    if (overcountSaturn) return "Repair the count: Lal Kitab is silent on Saturn property signification, and KP confirms relevance rather than calling Saturn bad.";
    if (treatKpAsFavourability) return "Repair the claim: KP sub-lord convergence says Saturn matters; favourability comes from the classical Saturn condition.";
    if (!includeTiming) return "Add the KP timing contribution: Moon, Mars, and Saturn bhuktis are a unique layer not supplied by the other streams.";
    return "Final reading: substantial capacity, a well-confirmed Saturn process complication, one disclosed Mars disagreement, and KP timing with Saturn as the cleanest trigger.";
  }, [forceMarsAgreement, includeTiming, overcountSaturn, treatKpAsFavourability]);

  return (
    <div data-interactive="cross-stream-property-synthesis-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>cross-stream property synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Assemble the three-stream Chart P1 reading without flattening it
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Sort each finding by relationship type, preserve the Mars disagreement, count Saturn precisely, and keep KP timing as its own contribution.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusKey("table"); setActiveCategory("echo"); setForceMarsAgreement(false); setOvercountSaturn(false); setTreatKpAsFavourability(false); setIncludeTiming(true); }} style={buttonStyle(false, BLUE)}>
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
          <SynthesisSvg activeCategory={activeCategory} status={status} includeTiming={includeTiming} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>relationship sorter</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))", gap: "0.5rem" }}>
              {(Object.keys(CATEGORY) as CategoryKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setActiveCategory(key)} style={optionStyle(activeCategory === key, CATEGORY[key].color)}>
                  {CATEGORY[key].label}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gap: "0.45rem", marginTop: "0.75rem" }}>
              {visibleFindings.map((finding) => (
                <div key={`${finding.source}-${finding.short}`} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.65rem", background: `${CATEGORY[finding.category].color}0F` }}>
                  <span style={{ color: CATEGORY[finding.category].color, fontWeight: 600 }}>{finding.source}</span>
                  <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{finding.short}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>overclaim controls</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Preserve Mars disagreement" body="Do not force Lal Kitab and classical dignity into one verdict." color={VERMILION} value={!forceMarsAgreement} onToggle={() => setForceMarsAgreement((value) => !value)} />
              <ToggleRow title="Count Saturn precisely" body="Lal Kitab is silent; KP confirms relevance, not badness." color={GOLD} value={!overcountSaturn} onToggle={() => setOvercountSaturn((value) => !value)} />
              <ToggleRow title="Separate KP relevance" body="Sub-lord convergence is structural, not a favourability vote." color={BLUE} value={!treatKpAsFavourability} onToggle={() => setTreatKpAsFavourability((value) => !value)} />
              <ToggleRow title="Include timing layer" body="KP contributes Moon, Mars, and Saturn windows." color={PURPLE} value={includeTiming} onToggle={() => setIncludeTiming((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: status.color, marginTop: "0.15rem" }}>{status.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>client-facing synthesis</p>
            <h3 style={{ margin: 0, color: status.color, fontSize: "1.1rem", fontWeight: 600 }}>{status.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{summary}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SynthesisSvg({ activeCategory, status, includeTiming }: { activeCategory: CategoryKey; status: { label: string; color: string }; includeTiming: boolean }) {
  const nodes = [
    { label: "Classical", x: 150, y: 145, color: GREEN, text: "capacity + Saturn process" },
    { label: "Lal Kitab", x: 400, y: 145, color: GOLD, text: "Teva echo + Mars difference" },
    { label: "KP", x: 650, y: 145, color: PURPLE, text: includeTiming ? "relevance + timing" : "relevance only" },
  ];

  return (
    <svg viewBox="0 0 800 560" role="img" aria-label="Cross-stream property synthesis diagram" style={{ width: "100%", minHeight: 480, display: "block" }}>
      <rect x="12" y="12" width="776" height="536" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="400" y="56" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="700">CHART P1 CROSS-STREAM PROPERTY READING</text>
      <text x="400" y="92" textAnchor="middle" fill={status.color} fontSize="22" fontWeight="700">{status.label}</text>

      {nodes.map((node) => (
        <g key={node.label}>
          <circle cx={node.x} cy={node.y + 28} r="72" fill={node.color} fillOpacity="0.12" stroke={node.color} strokeWidth="4" />
          <text x={node.x} y={node.y + 17} textAnchor="middle" fill={node.color} fontSize="16" fontWeight="700">{node.label}</text>
          <text x={node.x} y={node.y + 45} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">{node.text}</text>
        </g>
      ))}

      <path d="M218 206 C286 278 514 278 582 206" fill="none" stroke={CATEGORY[activeCategory].color} strokeWidth="6" strokeLinecap="round" />
      <path d="M400 248 L400 322" stroke={CATEGORY[activeCategory].color} strokeWidth="6" strokeLinecap="round" />
      <rect x="172" y="322" width="456" height="122" rx="16" fill={CATEGORY[activeCategory].color} fillOpacity="0.1" stroke={CATEGORY[activeCategory].color} strokeWidth="1.5" />
      <text x="400" y="360" textAnchor="middle" fill={CATEGORY[activeCategory].color} fontSize="17" fontWeight="700">{CATEGORY[activeCategory].label}</text>
      <text x="400" y="394" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="600">capacity + complication + disagreement</text>
      <text x="400" y="424" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="600">{includeTiming ? "timing retained: Moon, Mars, Saturn windows" : "timing layer currently omitted"}</text>

      <text x="400" y="510" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">Do not force agreement; make each claim traceable to its own stream.</text>
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
  return { border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.65rem 0.5rem", cursor: "pointer", fontWeight: 600, textAlign: "left", lineHeight: 1.25 };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
