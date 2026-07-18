"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  GitCompare,
  RefreshCcw,
  Scale,
  ShieldCheck,
} from "lucide-react";

type TabKey = "strengths" | "fragility" | "decision-rule" | "confirm";
type ScenarioKey = "vikram" | "eleven-seconds";
type ConditionKey = "tie" | "spacing";

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
  strengths: { label: "Strengths", icon: ShieldCheck },
  fragility: { label: "Fragility", icon: AlertTriangle },
  "decision-rule": { label: "Decision rule", icon: GitCompare },
  confirm: { label: "Confirm, not override", icon: Scale },
};

const SCENARIOS: Record<ScenarioKey, { label: string; tie: boolean; spacing: boolean; verdict: string; detail: string }> = {
  vikram: {
    label: "Vikram's case",
    tie: true,
    spacing: true,
    verdict: "Sub-lord refinement is justified.",
    detail: "Classical RP tied all three candidates, and the Lagna degrees sit well inside distinct sub-lord spans.",
  },
  "eleven-seconds": {
    label: "Eleven-second gap",
    tie: true,
    spacing: false,
    verdict: "Report classical confirmation only.",
    detail: "A gap smaller than the sub-lord span cannot be trusted to discriminate; reporting a sub-lord finding would be false precision.",
  },
};

const CONDITIONS: Record<ConditionKey, { label: string; text: string }> = {
  tie: { label: "Genuine tie", text: "Other methods leave candidates genuinely tied or nearly tied." },
  spacing: { label: "Adequate spacing", text: "Candidate Lagna degrees are far enough apart relative to timing confidence and the relevant sub-lord span." },
};

function ReproducibilitySvg() {
  return (
    <svg viewBox="0 0 420 160" role="img" aria-label="Reproducibility strength" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={400} height={140} rx={8} fill={`${GREEN}08`} stroke={HAIRLINE} />
      <text x={210} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Self-sufficient computation</text>

      <circle cx={90} cy={85} r={28} fill={`${BLUE}22`} stroke={BLUE} strokeWidth={2} />
      <text x={90} y={81} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={600}>Lagna</text>
      <text x={90} y={95} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>degree</text>

      <circle cx={190} cy={85} r={28} fill={`${PURPLE}22`} stroke={PURPLE} strokeWidth={2} />
      <text x={190} y={81} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>Moon</text>
      <text x={190} y={95} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>degree</text>

      <circle cx={290} cy={85} r={28} fill={`${GOLD}22`} stroke={GOLD} strokeWidth={2} />
      <text x={290} y={81} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>Day</text>
      <text x={290} y={95} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>lord</text>

      <path d="M 120 85 L 160 85" stroke={HAIRLINE} strokeWidth={2} />
      <path d="M 220 85 L 260 85" stroke={HAIRLINE} strokeWidth={2} />

      <text x={210} y={128} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>No client events or unverified moment-tattva needed</text>
    </svg>
  );
}

function GracefulSvg() {
  return (
    <svg viewBox="0 0 420 160" role="img" aria-label="Graceful degradation" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={400} height={140} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      <text x={210} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Graceful degradation</text>

      <rect x={50} y={65} width={130} height={45} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
      <text x={115} y={85} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>Classical 5 roles</text>
      <text x={115} y={100} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>confirm</text>

      <path d="M 185 87 L 235 87" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="227,81 237,87 227,93" fill={GOLD} />

      <rect x={245} y={65} width={130} height={45} rx={6} fill={`${PURPLE}18`} stroke={PURPLE} />
      <text x={310} y={85} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>Sub-lord</text>
      <text x={310} y={100} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>discriminate</text>

      <text x={210} y={132} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>Coarse confirmation when fine resolution is not needed</text>
    </svg>
  );
}

function FragilitySvg({ mode }: { mode: "boundary" | "overgeneral" | "infra" }) {
  const config = {
    boundary: { title: "Boundary sensitivity", color: VERMILION, text: "A candidate near a sub-lord boundary can flip planets on a small timing error." },
    overgeneral: { title: "Over-generalisation", color: GOLD, text: "A clean pattern in one chart invites a false universal law." },
    infra: { title: "Infrastructure gap", color: BLUE, text: "A missing interactive tool is not evidence against the doctrine." },
  }[mode];
  return (
    <svg viewBox="0 0 420 180" role="img" aria-label={config.title} style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={400} height={160} rx={8} fill={`${config.color}08`} stroke={HAIRLINE} />
      <text x={210} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>{config.title}</text>

      {mode === "boundary" && (
        <>
          <rect x={60} y={65} width={120} height={40} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
          <text x={120} y={85} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>Span A</text>
          <text x={120} y={99} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>Jupiter</text>
          <rect x={180} y={65} width={120} height={40} rx={6} fill={`${VERMILION}18`} stroke={VERMILION} />
          <text x={240} y={85} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>Span B</text>
          <text x={240} y={99} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>Saturn</text>
          <line x1={180} y1={85} x2={180} y2={85} stroke={INK_MUTED} strokeWidth={2} />
          <circle cx={185} cy={120} r={6} fill={VERMILION} />
          <text x={210} y={124} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>Candidate near boundary · small error flips result</text>
        </>
      )}

      {mode === "overgeneral" && (
        <>
          <circle cx={120} cy={95} r={30} fill={`${GOLD}22`} stroke={GOLD} strokeWidth={2} />
          <text x={120} y={91} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>This chart</text>
          <text x={120} y={105} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>B overlaps</text>
          <path d="M 155 95 L 265 95" stroke={HAIRLINE} strokeWidth={2} strokeDasharray="6 4" />
          <polygon points="257,89 267,95 257,101" fill={VERMILION} />
          <rect x={270} y={70} width={100} height={50} rx={6} fill={`${VERMILION}18`} stroke={VERMILION} />
          <text x={320} y={90} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>Universal law?</text>
          <text x={320} y={108} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>No source asserts it</text>
        </>
      )}

      {mode === "infra" && (
        <>
          <rect x={70} y={65} width={120} height={40} rx={6} fill={`${VERMILION}18`} stroke={VERMILION} />
          <text x={130} y={85} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>Missing tool</text>
          <text x={130} y={99} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>component gap</text>
          <path d="M 200 85 L 260 85" stroke={HAIRLINE} strokeWidth={2} />
          <polygon points="252,79 262,85 252,91" fill={GREEN} />
          <rect x={270} y={65} width={90} height={40} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
          <text x={315} y={85} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>Doctrine</text>
          <text x={315} y={99} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>still sound</text>
          <text x={210} y={132} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>Separate infrastructure from inherent soundness</text>
        </>
      )}
    </svg>
  );
}

function DecisionRuleSvg({ scenario }: { scenario: ScenarioKey }) {
  const s = SCENARIOS[scenario];
  const color = s.spacing ? GREEN : GOLD;
  return (
    <svg viewBox="0 0 460 200" role="img" aria-label="Decision rule check" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={180} rx={8} fill={`${color}08`} stroke={HAIRLINE} />
      <text x={230} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>{s.label}</text>

      <circle cx={120} cy={90} r={34} fill={`${s.tie ? GREEN : VERMILION}22`} stroke={s.tie ? GREEN : VERMILION} strokeWidth={2} />
      <text x={120} y={86} textAnchor="middle" fill={s.tie ? GREEN : VERMILION} fontSize={10} fontWeight={600}>Tie?</text>
      <text x={120} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>{s.tie ? "yes" : "no"}</text>

      <circle cx={230} cy={90} r={34} fill={`${s.spacing ? GREEN : VERMILION}22`} stroke={s.spacing ? GREEN : VERMILION} strokeWidth={2} />
      <text x={230} y={86} textAnchor="middle" fill={s.spacing ? GREEN : VERMILION} fontSize={10} fontWeight={600}>Spacing?</text>
      <text x={230} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>{s.spacing ? "yes" : "no"}</text>

      <path d="M 160 90 L 190 90" stroke={HAIRLINE} strokeWidth={2} />

      <rect x={290} y={60} width={140} height={60} rx={6} fill={SURFACE} stroke={color} />
      <text x={360} y={85} textAnchor="middle" fill={color} fontSize={11} fontWeight={600}>{s.verdict}</text>
      <text x={360} y={108} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>{s.spacing ? "use sub-lord" : "disclose limit"}</text>
    </svg>
  );
}

function ConfirmSvg() {
  return (
    <svg viewBox="0 0 420 160" role="img" aria-label="RPP confirms rather than overrides" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={400} height={140} rx={8} fill={`${PURPLE}08`} stroke={HAIRLINE} />
      <text x={210} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>One voice in the triangulation chorus</text>

      <circle cx={100} cy={85} r={30} fill={`${BLUE}22`} stroke={BLUE} strokeWidth={2} />
      <text x={100} y={81} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={600}>Ch 2</text>
      <text x={100} y={95} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>events</text>

      <circle cx={200} cy={85} r={30} fill={`${GOLD}22`} stroke={GOLD} strokeWidth={2} />
      <text x={200} y={81} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>Ch 3</text>
      <text x={200} y={95} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>tattva</text>

      <circle cx={300} cy={85} r={30} fill={`${PURPLE}22`} stroke={PURPLE} strokeWidth={2} />
      <text x={300} y={81} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>Ch 4</text>
      <text x={300} y={95} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>RPP</text>

      <path d="M 130 85 L 170 85" stroke={HAIRLINE} strokeWidth={2} />
      <path d="M 230 85 L 270 85" stroke={HAIRLINE} strokeWidth={2} />

      <text x={210} y={128} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>Weighed together in Chapter 6, not decided by any one</text>
    </svg>
  );
}

export function KpRppStrengthsLimitsEvaluator() {
  const [activeTab, setActiveTab] = useState<TabKey>("strengths");
  const [fragilityMode, setFragilityMode] = useState<"boundary" | "overgeneral" | "infra">("boundary");
  const [scenario, setScenario] = useState<ScenarioKey>("vikram");

  const reset = () => {
    setActiveTab("strengths");
    setFragilityMode("boundary");
    setScenario("vikram");
  };

  return (
    <div data-interactive="kp-rpp-strengths-limits-evaluator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP RPP · Chapter 4</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Strengths and limits evaluator
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              RPP is precise and reproducible — and its precision is exactly where its fragility lives.
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
            <p style={eyebrowStyle}>Genuine strengths</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>What RPP offers</h3>
            <ReproducibilitySvg />
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: GREEN, fontWeight: 600 }}>Reproducibility:</span> RPP needs no client events or unverified moment-tattva. Two practitioners using the same candidate time always arrive at the same RP set.
              </p>
            </div>
          </section>

          <section style={cardStyle}>
            <GracefulSvg />
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: BLUE, fontWeight: 600 }}>Graceful degradation:</span> the classical five roles give a confirmatory signal; the sub-lord gives discrimination where coarser methods tie.
              </p>
            </div>
          </section>
        </>
      )}

      {activeTab === "fragility" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Three fragilities</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>Where the strength becomes fragility</h3>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {(["boundary", "overgeneral", "infra"] as const).map((key) => (
                <button key={key} type="button" aria-pressed={fragilityMode === key} onClick={() => setFragilityMode(key)} style={buttonStyle(fragilityMode === key, fragilityMode === key ? VERMILION : INK_MUTED)}>
                  {key === "boundary" ? "Boundary" : key === "overgeneral" ? "Over-generalise" : "Infrastructure"}
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <FragilitySvg mode={fragilityMode} />
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${fragilityMode === "boundary" ? VERMILION : fragilityMode === "overgeneral" ? GOLD : BLUE}55`, background: `${fragilityMode === "boundary" ? VERMILION : fragilityMode === "overgeneral" ? GOLD : BLUE}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                {fragilityMode === "boundary" && "Sub-lord spans are narrow (0.667°–2.222°). A candidate near a boundary can return a different planet on a small timing error — the same precision that discriminates also corrupts easily."}
                {fragilityMode === "overgeneral" && "A clean overlap pattern in one chart is tempting to universalise. The discipline is to name it as this chart's own result, not a law of what RPP always shows."}
                {fragilityMode === "infra" && "The missing ruling-planets-of-the-moment component is an infrastructure gap, not evidence against the sub-lord doctrine's soundness — the same separation Lesson 20.3.3 modelled for Tattva-śuddhi."}
              </p>
            </div>
          </section>
        </>
      )}

      {activeTab === "decision-rule" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Two-condition rule</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>When to reach for the sub-lord refinement</h3>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {(Object.keys(CONDITIONS) as ConditionKey[]).map((key) => (
                <div key={key} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                  <p style={{ margin: 0, color: GREEN, fontWeight: 600 }}>{CONDITIONS[key].label}</p>
                  <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{CONDITIONS[key].text}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={scenario === key} onClick={() => setScenario(key)} style={buttonStyle(scenario === key, key === "vikram" ? GREEN : GOLD)}>
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: "0.75rem" }}>
              <DecisionRuleSvg scenario={scenario} />
            </div>
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${SCENARIOS[scenario].spacing ? GREEN : GOLD}55`, background: `${SCENARIOS[scenario].spacing ? GREEN : GOLD}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: SCENARIOS[scenario].spacing ? GREEN : GOLD, fontWeight: 600 }}>{SCENARIOS[scenario].verdict}</span> {SCENARIOS[scenario].detail}
              </p>
            </div>
          </section>
        </>
      )}

      {activeTab === "confirm" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Confirm, not override</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>RPP is weighed, not decisive</h3>
            <ConfirmSvg />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Discipline</p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Classical check:</span> cheap and worth running on every case for its modest confirmatory value.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GOLD, fontWeight: 600 }}>Sub-lord check:</span> only when the two-condition rule is satisfied; otherwise report the classical confirmation and disclose the limit.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}55`, background: `${PURPLE}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: PURPLE, fontWeight: 600 }}>Final verdict:</span> Chapter 6&apos;s triangulation weighs RPP alongside every other method; no single method stands alone.
                </p>
              </div>
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
