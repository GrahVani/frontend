"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  GitCompare,
  Layers,
  RefreshCcw,
  Route,
  Scale,
  ShieldCheck,
  XCircle,
} from "lucide-react";

type TabKey = "strengths" | "limits" | "when-to-use";
type StrengthKey = "no-events" | "same-sign" | "honest-frame";
type LimitKey = "verified-gap" | "infrastructure" | "independence";
type ScenarioKey = "same-sign-tie" | "different-sign-winner" | "no-events";

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

const TABS: Record<TabKey, { label: string; icon: typeof Scale }> = {
  strengths: { label: "Three strengths", icon: ShieldCheck },
  limits: { label: "Three limits", icon: AlertTriangle },
  "when-to-use": { label: "When to use", icon: Route },
};

const STRENGTHS: Record<StrengthKey, { title: string; body: string; icon: typeof CheckCircle2 }> = {
  "no-events": {
    title: "Needs no dated life events",
    body: "Unlike Chapter 2, tattva-śuddhi can run when a client has no recoverable dated history. It needs only candidate times and the charts they produce.",
    icon: CheckCircle2,
  },
  "same-sign": {
    title: "Breaks same-Lagna-sign ties",
    body: "Chapter 2 could not separate Vikram's Candidates A and B because both share Virgo. The self-coherence check uses the finer moment-tattva, a smaller grain than the Lagna sign alone.",
    icon: GitCompare,
  },
  "honest-frame": {
    title: "Stays inside an honest traditional frame",
    body: "It is a real, practised technique (praśna and KP-BTR use tattva coherence), claimed classically, and not independently verified — the same epistemic honesty as Lesson 20.3.1.",
    icon: Scale,
  },
};

const LIMITS: Record<LimitKey, { title: string; body: string; icon: typeof XCircle }> = {
  "verified-gap": {
    title: "The verified gap is unchanged",
    body: "Extending the check from diagnostic to rectification depth does not make it a proven mechanism. It remains a soft, traditionally-supported signal.",
    icon: XCircle,
  },
  infrastructure: {
    title: "A real infrastructure gap",
    body: "This curriculum's worked example used designed, illustrative moment-tattva values. A real practitioner needs a verified pañcāṅga computation — an honest teaching constraint, not a method weakness.",
    icon: AlertTriangle,
  },
  independence: {
    title: "Limited independence for different-sign candidates",
    body: "For Candidate C, both Chapter 2's house-lordship test and this chapter's Lagna-element check depend on the Lagna sign. The tattva clash corroborates, but does not deepen, the exclusion.",
    icon: Layers,
  },
};

const SCENARIOS: Record<ScenarioKey, { label: string; situation: string; verdict: string; method: string; good: boolean }> = {
  "same-sign-tie": {
    label: "Same-sign tie",
    situation: "Two candidates share Virgo Lagna; Chapter 2 cannot distinguish them.",
    verdict: "Tattva-śuddhi adds real value here.",
    method: "Run the self-coherence check on each candidate.",
    good: true,
  },
  "different-sign-winner": {
    label: "Clean winner already",
    situation: "Three candidates sit in different signs; events-based rectification already found one clear winner.",
    verdict: "Tattva-śuddhi has low marginal value here.",
    method: "Confirm the winner with D60 or KP RPP instead.",
    good: false,
  },
  "no-events": {
    label: "No dated events",
    situation: "The client has no datable life events, but several candidates share the same Lagna sign.",
    verdict: "Tattva-śuddhi is usable where Chapter 2 stalls.",
    method: "Use it as one of the few methods that does not need events.",
    good: true,
  },
};

function NoEventsSvg() {
  return (
    <svg viewBox="0 0 420 160" role="img" aria-label="Needs no dated events" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={400} height={140} rx={8} fill={`${GREEN}08`} stroke={HAIRLINE} />
      <text x={210} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={13} fontWeight={600}>Chapter 2 requirement</text>
      <rect x={60} y={55} width={120} height={40} rx={6} fill={`${VERMILION}18`} stroke={VERMILION} />
      <text x={120} y={72} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>dated events</text>
      <text x={120} y={86} textAnchor="middle" fill={INK_MUTED} fontSize={9}>client history</text>

      <text x={210} y={80} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontWeight={600}>stops without this</text>
      <path d="M 190 80 L 160 80" stroke={HAIRLINE} strokeWidth={2} />
      <path d="M 230 80 L 260 80" stroke={HAIRLINE} strokeWidth={2} />

      <rect x={260} y={55} width={120} height={40} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
      <text x={320} y={72} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>tattva check</text>
      <text x={320} y={86} textAnchor="middle" fill={INK_MUTED} fontSize={9}>candidate times only</text>

      <text x={210} y={128} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>Runs even when the client has nothing datable</text>
    </svg>
  );
}

function SameSignSvg() {
  return (
    <svg viewBox="0 0 420 180" role="img" aria-label="Breaks same Lagna sign ties" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={400} height={160} rx={8} fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x={210} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>A and B share Virgo Lagna</text>

      <circle cx={120} cy={90} r={38} fill={`${INK_MUTED}33`} stroke={HAIRLINE} />
      <text x={120} y={86} textAnchor="middle" fill={INK_PRIMARY} fontSize={12} fontWeight={600}>A</text>
      <text x={120} y={102} textAnchor="middle" fill={INK_MUTED} fontSize={10}>Virgo</text>

      <circle cx={300} cy={90} r={38} fill={`${INK_MUTED}33`} stroke={HAIRLINE} />
      <text x={300} y={86} textAnchor="middle" fill={INK_PRIMARY} fontSize={12} fontWeight={600}>B</text>
      <text x={300} y={102} textAnchor="middle" fill={INK_MUTED} fontSize={10}>Virgo</text>

      <text x={210} y={95} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontWeight={600}>same house lords</text>
      <line x1={162} y1={90} x2={258} y2={90} stroke={HAIRLINE} strokeWidth={2} strokeDasharray="6 4" />

      <path d="M 120 132 C 120 160, 180 160, 200 145" fill="none" stroke={VERMILION} strokeWidth={3} />
      <text x={155} y={160} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>Air clash</text>

      <path d="M 300 132 C 300 160, 240 160, 220 145" fill="none" stroke={GREEN} strokeWidth={3} />
      <text x={265} y={160} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>Earth coherence</text>

      <text x={210} y={175} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>Moment-tattva separates what Lagna sign cannot</text>
    </svg>
  );
}

function HonestFrameSvg() {
  return (
    <svg viewBox="0 0 420 160" role="img" aria-label="Honest traditional frame" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={400} height={140} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      <rect x={40} y={45} width={100} height={50} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
      <text x={90} y={68} textAnchor="middle" fill={GREEN} fontSize={11} fontWeight={600}>Practised</text>
      <text x={90} y={84} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>in praśna / KP-BTR</text>

      <rect x={160} y={45} width={100} height={50} rx={6} fill={`${GOLD}18`} stroke={GOLD} />
      <text x={210} y={68} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>Claimed</text>
      <text x={210} y={84} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>classical teaching</text>

      <rect x={280} y={45} width={100} height={50} rx={6} fill={`${INK_MUTED}22`} stroke={INK_MUTED} />
      <text x={330} y={68} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontWeight={600}>Verified</text>
      <text x={330} y={84} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>not independently</text>

      <text x={210} y={125} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>Same honest frame at diagnostic and rectification depth</text>
    </svg>
  );
}

function VerifiedGapSvg() {
  return (
    <svg viewBox="0 0 420 160" role="img" aria-label="Verified gap unchanged" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={400} height={140} rx={8} fill={`${VERMILION}08`} stroke={HAIRLINE} />
      <text x={210} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Epistemic weight does not increase with use</text>

      <rect x={50} y={60} width={120} height={40} rx={6} fill={`${BLUE}18`} stroke={BLUE} />
      <text x={110} y={78} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={600}>Diagnostic use</text>
      <text x={110} y={92} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>soft signal</text>

      <path d="M 175 80 L 245 80" stroke={HAIRLINE} strokeWidth={2} strokeDasharray="6 4" markerEnd="url(#arrow-right)" />

      <rect x={250} y={60} width={120} height={40} rx={6} fill={`${PURPLE}18`} stroke={PURPLE} />
      <text x={310} y={78} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>Rectification use</text>
      <text x={310} y={92} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>still soft signal</text>

      <text x={210} y={128} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>Context changes; evidentiary standing does not</text>

      <defs>
        <marker id="arrow-right" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M 0 0 L 8 4 L 0 8 z" fill={INK_MUTED} />
        </marker>
      </defs>
    </svg>
  );
}

function InfrastructureSvg({ mode }: { mode: "designed" | "real" }) {
  return (
    <svg viewBox="0 0 420 180" role="img" aria-label="Infrastructure gap" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={400} height={160} rx={8} fill={`${mode === "real" ? GREEN : GOLD}08`} stroke={HAIRLINE} />
      <text x={210} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        {mode === "designed" ? "Curriculum teaching example" : "Real practitioner workflow"}
      </text>

      <rect x={60} y={55} width={130} height={50} rx={6} fill={`${mode === "real" ? GREEN : GOLD}18`} stroke={mode === "real" ? GREEN : GOLD} />
      <text x={125} y={74} textAnchor="middle" fill={mode === "real" ? GREEN : GOLD} fontSize={10} fontWeight={600}>
        {mode === "real" ? "Verified pañcāṅga" : "Designed values"}
      </text>
      <text x={125} y={90} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>
        {mode === "real" ? "Astro Engine endpoint" : "from m20_chart_data.md"}
      </text>

      <rect x={230} y={55} width={130} height={50} rx={6} fill={`${BLUE}18`} stroke={BLUE} />
      <text x={295} y={74} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={600}>Self-coherence</text>
      <text x={295} y={90} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>check</text>

      <path d="M 192 80 L 228 80" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="220,74 230,80 220,86" fill={INK_MUTED} />

      <text x={210} y={138} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>
        {mode === "designed"
          ? "Honest teaching constraint: illustrative, not computed."
          : "The method itself can be precise with the right access."}
      </text>
    </svg>
  );
}

function IndependenceSvg() {
  return (
    <svg viewBox="0 0 420 180" role="img" aria-label="Limited independence for different signs" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={400} height={160} rx={8} fill={`${VERMILION}08`} stroke={HAIRLINE} />
      <text x={210} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Candidate C: both methods use Lagna sign</text>

      <circle cx={120} cy={95} r={45} fill={`${BLUE}22`} stroke={BLUE} strokeWidth={2} />
      <text x={120} y={92} textAnchor="middle" fill={BLUE} fontSize={11} fontWeight={600}>Events-based</text>
      <text x={120} y={108} textAnchor="middle" fill={BLUE} fontSize={10}>house lords</text>

      <circle cx={300} cy={95} r={45} fill={`${GOLD}22`} stroke={GOLD} strokeWidth={2} />
      <text x={300} y={92} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>Tattva</text>
      <text x={300} y={108} textAnchor="middle" fill={GOLD} fontSize={10}>Lagna element</text>

      <ellipse cx={210} cy={95} rx={50} ry={32} fill={`${VERMILION}33`} stroke={VERMILION} strokeWidth={2} />
      <text x={210} y={100} textAnchor="middle" fill={VERMILION} fontSize={11} fontWeight={600}>Libra sign</text>

      <text x={210} y={150} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>Corroborating, not independently decisive</text>
    </svg>
  );
}

function ScenarioSvg({ scenario }: { scenario: ScenarioKey }) {
  const s = SCENARIOS[scenario];
  const color = s.good ? GREEN : GOLD;
  return (
    <svg viewBox="0 0 460 200" role="img" aria-label={`Scenario ${s.label}`} style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={180} rx={8} fill={`${color}08`} stroke={HAIRLINE} />
      <text x={230} y={40} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>{s.label}</text>

      <rect x={40} y={60} width={380} height={44} rx={6} fill={SURFACE} stroke={HAIRLINE} />
      <text x={230} y={80} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>{s.situation}</text>
      <text x={230} y={96} textAnchor="middle" fill={INK_MUTED} fontSize={10}>click the other scenarios to compare</text>

      <circle cx={120} cy={145} r={34} fill={`${color}18`} stroke={color} />
      <text x={120} y={141} textAnchor="middle" fill={color} fontSize={11} fontWeight={600}>{s.good ? "Use" : "Low value"}</text>
      <text x={120} y={157} textAnchor="middle" fill={color} fontSize={9}>{s.good ? "tattva" : "for tattva"}</text>

      <path d="M 160 145 L 200 145" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="192,139 202,145 192,151" fill={INK_MUTED} />

      <rect x={220} y={115} width={200} height={60} rx={6} fill={SURFACE} stroke={HAIRLINE} />
      <text x={320} y={138} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>{s.verdict}</text>
      <text x={320} y={158} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>{s.method}</text>
    </svg>
  );
}

export function TattvaShuddhiStrengthsLimitsEvaluator() {
  const [activeTab, setActiveTab] = useState<TabKey>("strengths");
  const [selectedStrength, setSelectedStrength] = useState<StrengthKey>("same-sign");
  const [selectedLimit, setSelectedLimit] = useState<LimitKey>("independence");
  const [infraMode, setInfraMode] = useState<"designed" | "real">("designed");
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>("same-sign-tie");

  const reset = () => {
    setActiveTab("strengths");
    setSelectedStrength("same-sign");
    setSelectedLimit("independence");
    setInfraMode("designed");
    setSelectedScenario("same-sign-tie");
  };

  return (
    <div data-interactive="tattva-shuddhi-strengths-limits-evaluator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Tattva-śuddhi · Chapter 3</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Strengths and limits evaluator
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Three demonstrated strengths, three genuine limits, and a decision rule for when this method earns its place in the rectification workflow.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(Object.keys(TABS) as TabKey[]).map((key) => {
          const TabIcon = TABS[key].icon;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={activeTab === key}
              onClick={() => setActiveTab(key)}
              style={tabChipStyle(activeTab === key, key === activeTab ? GOLD : INK_MUTED)}
            >
              <TabIcon size={15} aria-hidden="true" />
              {TABS[key].label}
            </button>
          );
        })}
      </div>

      {activeTab === "strengths" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Demonstrated strengths</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>What this chapter&apos;s case genuinely showed</h3>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {(Object.keys(STRENGTHS) as StrengthKey[]).map((key) => {
                const s = STRENGTHS[key];
                const active = selectedStrength === key;
                const Icon = s.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedStrength(key)}
                    style={{ width: "100%", textAlign: "left", padding: "0.75rem", borderRadius: 8, border: `1px solid ${active ? GREEN : HAIRLINE}`, background: active ? `${GREEN}10` : SURFACE, cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <Icon size={18} color={active ? GREEN : INK_MUTED} aria-hidden="true" />
                      <span style={{ color: active ? GREEN : INK_PRIMARY, fontWeight: 600 }}>{s.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Selected strength</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>{STRENGTHS[selectedStrength].title}</h3>
            <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.55 }}>{STRENGTHS[selectedStrength].body}</p>
            {selectedStrength === "no-events" && <NoEventsSvg />}
            {selectedStrength === "same-sign" && <SameSignSvg />}
            {selectedStrength === "honest-frame" && <HonestFrameSvg />}
          </section>
        </>
      )}

      {activeTab === "limits" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Genuine limits</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>What this chapter&apos;s case disclosed, not smoothed over</h3>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {(Object.keys(LIMITS) as LimitKey[]).map((key) => {
                const l = LIMITS[key];
                const active = selectedLimit === key;
                const Icon = l.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedLimit(key)}
                    style={{ width: "100%", textAlign: "left", padding: "0.75rem", borderRadius: 8, border: `1px solid ${active ? VERMILION : HAIRLINE}`, background: active ? `${VERMILION}10` : SURFACE, cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <Icon size={18} color={active ? VERMILION : INK_MUTED} aria-hidden="true" />
                      <span style={{ color: active ? VERMILION : INK_PRIMARY, fontWeight: 600 }}>{l.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Selected limit</p>
                <h3 style={{ margin: "0.15rem 0 0.5rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>{LIMITS[selectedLimit].title}</h3>
              </div>
              {selectedLimit === "infrastructure" && (
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button type="button" aria-pressed={infraMode === "designed"} onClick={() => setInfraMode("designed")} style={buttonStyle(infraMode === "designed", GOLD)}>
                    Designed
                  </button>
                  <button type="button" aria-pressed={infraMode === "real"} onClick={() => setInfraMode("real")} style={buttonStyle(infraMode === "real", GREEN)}>
                    Real
                  </button>
                </div>
              )}
            </div>
            <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.55 }}>{LIMITS[selectedLimit].body}</p>
            {selectedLimit === "verified-gap" && <VerifiedGapSvg />}
            {selectedLimit === "infrastructure" && <InfrastructureSvg mode={infraMode} />}
            {selectedLimit === "independence" && <IndependenceSvg />}
          </section>
        </>
      )}

      {activeTab === "when-to-use" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Decision rule</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Match the method to the gap in the evidence</h3>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => {
                const s = SCENARIOS[key];
                const active = selectedScenario === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedScenario(key)}
                    style={{ width: "100%", textAlign: "left", padding: "0.75rem", borderRadius: 8, border: `1px solid ${active ? GOLD : HAIRLINE}`, background: active ? `${GOLD}10` : SURFACE, cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.6rem" }}>
                      <span style={{ color: active ? GOLD : INK_PRIMARY, fontWeight: 600 }}>{s.label}</span>
                      <span style={{ color: s.good ? GREEN : VERMILION, fontSize: "0.85rem", fontWeight: 600 }}>{s.good ? "Use tattva" : "Use another method"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section style={cardStyle}>
            <ScenarioSvg scenario={selectedScenario} />
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${SCENARIOS[selectedScenario].good ? GREEN : GOLD}55`, background: `${SCENARIOS[selectedScenario].good ? GREEN : GOLD}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                {SCENARIOS[selectedScenario].good
                  ? "This is exactly the gap tattva-śuddhi is demonstrated to fill: same-sign candidates or missing events."
                  : "The question is already resolved at the sign level; a genuinely independent method (D60, KP RPP) adds more than another Lagna-linked check."}
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? color : SURFACE,
    color: active ? "#fff" : INK_PRIMARY,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.92rem",
  };
}

function tabChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 0.85rem",
    borderRadius: 20,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.92rem",
  };
}
