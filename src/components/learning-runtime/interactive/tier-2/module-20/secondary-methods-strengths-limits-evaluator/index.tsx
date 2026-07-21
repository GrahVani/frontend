"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { BookOpen, GitCompare, Scale, Search } from "lucide-react";

type TabKey = "limits" | "decision" | "citation" | "summary";
type ScenarioKey = "vikram" | "rough" | "consultation-only";

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

const TABS: Record<TabKey, { label: string; icon: typeof Search }> = {
  limits: { label: "Three limits", icon: Scale },
  decision: { label: "Decision rule", icon: Search },
  citation: { label: "Citation profile", icon: BookOpen },
  summary: { label: "Chapter 5 summary", icon: GitCompare },
};

const METHODS = {
  prashna: {
    name: "Praśna-derived rectification",
    shape: "Silence",
    color: BLUE,
    cause: "A real, certain consultation moment may simply have nothing to say about the case's established significators.",
    response: "Accept and record the silent result; do not shop for a different moment.",
    when: "Whenever a real consultation moment is available — low cost, both outcomes useful.",
  },
  nadiamsa: {
    name: "Nāḍiāṁśa (D150)",
    shape: "Fragility from resolution",
    color: VERMILION,
    cause: "12′ divisions are powerful enough to discriminate, and easily corrupted by a birth-time error of similar size.",
    response: "Use only when candidate Lagna degrees are already trusted to arc-minute precision.",
    when: "After D60 and sub-lord narrowing have already established trustworthy degrees.",
  },
  tara: {
    name: "Janma Tāra",
    shape: "Hard resolution ceiling",
    color: PURPLE,
    cause: "When candidates share both relevant nakṣatras, the doctrine has no finer layer to reach for.",
    response: "Use its confirmatory value for general chart character; redirect discrimination to other methods.",
    when: "Early and cheaply, as a general chart-character check.",
  },
};

const SCENARIOS: Record<ScenarioKey, { label: string; situation: string; recommendations: string[]; avoid?: string }> = {
  vikram: {
    label: "Vikram's case",
    situation: "Three narrowed candidates, prior D60 and sub-lord work, real consultation moment available.",
    recommendations: [
      "Run the praśna-derived overlay — real moment, low cost; accept silence if it occurs.",
      "Run Nāḍiāṁśa — candidate degrees are already load-bearing after Chapter 4.",
      "Run Janma Tāra early — cheap general check; expect non-discrimination because nakṣatras are shared.",
    ],
  },
  rough: {
    label: "Rough two-hour window",
    situation: "Single wide birth-time window, no dated events, no prior D60 or sub-lord narrowing.",
    recommendations: [
      "Run Janma Tāra cheaply — may give a general chart read even now.",
      "Run praśna-derived if a consultation moment exists.",
    ],
    avoid: "Delay Nāḍiāṁśa. A 12′ division on a two-hour window is false precision.",
  },
  "consultation-only": {
    label: "Consultation only",
    situation: "No birth-time estimate at all, but a real consultation moment is recorded.",
    recommendations: [
      "Run praśna-derived overlay — it is one of the few methods that does not depend on a candidate birth time.",
      "Record silence or confirmation honestly.",
    ],
    avoid: "Neither Nāḍiāṁśa nor Janma Tāra can run without at least candidate nakṣatras.",
  },
};

function LimitShapesSvg() {
  return (
    <svg viewBox="0 0 640 200" role="img" aria-label="Three differently shaped limits" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={620} height={180} rx={8} fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x={320} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        Three different shapes of limitation
      </text>

      {/* Silence */}
      <rect x={40} y={60} width={170} height={100} rx={6} fill={`${BLUE}10`} stroke={BLUE} />
      <circle cx={125} cy={95} r={18} fill={SURFACE} stroke={BLUE} strokeWidth={2} />
      <text x={125} y={100} textAnchor="middle" fill={BLUE} fontSize={12} fontWeight={600}>…</text>
      <text x={125} y={130} textAnchor="middle" fill={INK_PRIMARY} fontSize={10} fontWeight={600}>Silence</text>
      <text x={125} y={146} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>nothing to say</text>

      {/* Fragility */}
      <rect x={235} y={60} width={170} height={100} rx={6} fill={`${VERMILION}10`} stroke={VERMILION} />
      <line x1={260} y1={110} x2={380} y2={110} stroke={VERMILION} strokeWidth={2} />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={270 + i * 20} y1={105} x2={270 + i * 20} y2={115} stroke={VERMILION} strokeWidth={2} />
      ))}
      <path d="M 300 95 L 310 110 L 300 125" stroke={VERMILION} strokeWidth={2} fill="none" />
      <text x={320} y={90} textAnchor="middle" fill={INK_PRIMARY} fontSize={10} fontWeight={600}>12′ divisions</text>
      <text x={320} y={146} textAnchor="middle" fill={INK_PRIMARY} fontSize={10} fontWeight={600}>Fragility</text>

      {/* Ceiling */}
      <rect x={430} y={60} width={170} height={100} rx={6} fill={`${PURPLE}10`} stroke={PURPLE} />
      <rect x={450} y={70} width={130} height={12} rx={3} fill={PURPLE} />
      <circle cx={485} cy={115} r={14} fill={SURFACE} stroke={PURPLE} strokeWidth={2} />
      <text x={485} y={120} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>A</text>
      <circle cx={545} cy={115} r={14} fill={SURFACE} stroke={PURPLE} strokeWidth={2} />
      <text x={545} y={120} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>B</text>
      <text x={515} y={152} textAnchor="middle" fill={INK_PRIMARY} fontSize={10} fontWeight={600}>Ceiling</text>
      <text x={515} y={168} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>no finer layer</text>
    </svg>
  );
}

function DecisionFlowSvg({ scenario }: { scenario: ScenarioKey }) {
  const showNadiamsa = scenario === "vikram";
  const showTara = scenario !== "consultation-only";
  const showPrashna = true;
  return (
    <svg viewBox="0 0 620 240" role="img" aria-label="Decision rule flow" style={{ width: "100%", maxHeight: 260, display: "block" }}>
      <rect x={10} y={10} width={600} height={220} rx={8} fill={`${GREEN}08`} stroke={HAIRLINE} />
      <text x={310} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        Decision rule flow
      </text>

      {/* Start */}
      <rect x={260} y={50} width={100} height={34} rx={6} fill={SURFACE} stroke={HAIRLINE} />
      <text x={310} y={72} textAnchor="middle" fill={INK_PRIMARY} fontSize={10} fontWeight={600}>Case input</text>

      {/* Praśna branch */}
      <path d="M 310 84 L 310 110" stroke={HAIRLINE} strokeWidth={2} />
      <path d="M 310 110 L 150 110" stroke={HAIRLINE} strokeWidth={2} />
      <path d="M 150 110 L 150 130" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="144,122 150,132 156,122" fill={BLUE} />
      <rect x={80} y={132} width={140} height={40} rx={6} fill={showPrashna ? `${BLUE}18` : `${INK_MUTED}15`} stroke={showPrashna ? BLUE : HAIRLINE} />
      <text x={150} y={152} textAnchor="middle" fill={showPrashna ? BLUE : INK_MUTED} fontSize={10} fontWeight={600}>Praśna-derived</text>
      <text x={150} y={166} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>low cost, run early</text>

      {/* Tara branch */}
      <path d="M 310 84 L 310 150" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="304,142 310,152 316,142" fill={PURPLE} />
      <rect x={240} y={154} width={140} height={40} rx={6} fill={showTara ? `${PURPLE}18` : `${INK_MUTED}15`} stroke={showTara ? PURPLE : HAIRLINE} />
      <text x={310} y={174} textAnchor="middle" fill={showTara ? PURPLE : INK_MUTED} fontSize={10} fontWeight={600}>Janma Tāra</text>
      <text x={310} y={188} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>cheap general check</text>

      {/* Nadiamsa branch */}
      <path d="M 310 84 L 310 110" stroke={HAIRLINE} strokeWidth={2} />
      <path d="M 310 110 L 470 110" stroke={HAIRLINE} strokeWidth={2} />
      <path d="M 470 110 L 470 130" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="464,122 470,132 476,122" fill={showNadiamsa ? VERMILION : INK_MUTED} />
      <rect x={400} y={132} width={140} height={40} rx={6} fill={showNadiamsa ? `${VERMILION}18` : `${INK_MUTED}15`} stroke={showNadiamsa ? VERMILION : HAIRLINE} />
      <text x={470} y={152} textAnchor="middle" fill={showNadiamsa ? VERMILION : INK_MUTED} fontSize={10} fontWeight={600}>Nāḍiāṁśa</text>
      <text x={470} y={166} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>{showNadiamsa ? "degrees trusted" : "wait"}</text>

      <text x={310} y={215} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        {scenario === "vikram" ? "All three fit their proper places" : "Some methods are deferred, not rejected"}
      </text>
    </svg>
  );
}

function CitationProfileSvg() {
  return (
    <svg viewBox="0 0 620 200" role="img" aria-label="Citation honesty profiles of the three methods" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={600} height={180} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      <text x={310} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        Sourcing profile is part of the assessment
      </text>

      {/* Strongest */}
      <rect x={40} y={60} width={170} height={100} rx={6} fill={`${GREEN}10`} stroke={GREEN} />
      <text x={125} y={85} textAnchor="middle" fill={GREEN} fontSize={11} fontWeight={600}>Janma Tāra</text>
      <text x={125} y={105} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>BPHS-adjacent</text>
      <text x={125} y={120} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>Muhūrta Cintāmaṇi</text>
      <text x={125} y="140" textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>via T1-07 16.6.4</text>

      {/* Middle */}
      <rect x={225} y={60} width={170} height={100} rx={6} fill={`${GOLD}10`} stroke={GOLD} />
      <text x={310} y={85} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>Nāḍiāṁśa</text>
      <text x={310} y={105} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>Modern compilation</text>
      <text x={310} y={120} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>Tamil Nāḍi tradition</text>
      <text x={310} y={140} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>Santhanam / Raman</text>

      {/* Extension */}
      <rect x={410} y={60} width={170} height={100} rx={6} fill={`${PURPLE}10`} stroke={PURPLE} />
      <text x={495} y={85} textAnchor="middle" fill={PURPLE} fontSize={11} fontWeight={600}>Praśna-derived</text>
      <text x={495} y={105} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>Disclosed extension</text>
      <text x={495} y={120} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>of T2-15 overlay</text>
      <text x={495} y={140} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>applied to BTR</text>
    </svg>
  );
}

export function SecondaryMethodsStrengthsLimitsEvaluator() {
  const [activeTab, setActiveTab] = useState<TabKey>("limits");
  const [scenario, setScenario] = useState<ScenarioKey>("vikram");

  const reset = () => {
    setActiveTab("limits");
    setScenario("vikram");
  };

  return (
    <div data-interactive="secondary-methods-strengths-limits-evaluator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Secondary methods · Chapter 5</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Strengths and limits evaluator
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compare three genuinely different shapes of limitation — silence, fragility, and a hard ceiling — and derive when each method is worth reaching for.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            Reset
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

      {activeTab === "limits" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Shapes of limitation</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              Three methods, three distinct limits
            </h3>
            <LimitShapesSvg />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Method cards</p>
            <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {Object.values(METHODS).map((m) => (
                <div key={m.name} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${m.color}55`, background: `${m.color}10` }}>
                  <p style={{ margin: "0 0 0.35rem", color: m.color, fontSize: "0.8rem", fontWeight: 600 }}>{m.shape.toUpperCase()}</p>
                  <h4 style={{ margin: "0 0 0.5rem", color: m.color, fontSize: "1.05rem", fontWeight: 600 }}>{m.name}</h4>
                  <p style={{ margin: "0 0 0.5rem", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.95rem" }}>
                    <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>Cause:</span> {m.cause}
                  </p>
                  <p style={{ margin: "0 0 0.5rem", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.95rem" }}>
                    <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>Response:</span> {m.response}
                  </p>
                  <p style={{ margin: 0, color: INK_MUTED, lineHeight: 1.5, fontSize: "0.9rem" }}>
                    <span style={{ fontWeight: 600 }}>When to use:</span> {m.when}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === "decision" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Decision rule</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>
              Choose the case type and see what the rule recommends
            </h3>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={scenario === key} onClick={() => setScenario(key)} style={buttonStyle(scenario === key, key === "vikram" ? GREEN : key === "rough" ? GOLD : BLUE)}>
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
            <DecisionFlowSvg scenario={scenario} />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Recommendation</p>
            <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10`, marginBottom: "0.75rem" }}>
              <p style={{ margin: "0 0 0.5rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: GREEN, fontWeight: 600 }}>Situation:</span> {SCENARIOS[scenario].situation}
              </p>
            </div>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {SCENARIOS[scenario].recommendations.map((rec, i) => (
                <div key={i} style={{ padding: "0.6rem 0.75rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{rec}</p>
                </div>
              ))}
            </div>
            {SCENARIOS[scenario].avoid && (
              <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Avoid:</span> {SCENARIOS[scenario].avoid}
                </p>
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === "citation" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Sourcing as a dimension</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              How a method is cited belongs in the strengths-and-limits account
            </h3>
            <CitationProfileSvg />
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: BLUE, fontWeight: 600 }}>Disclosure, not dismissal.</span> None of these profiles makes a method unusable. Each shapes how confidently a finding can be stated to a client.
              </p>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Profiles</p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Janma Tāra:</span> strongest textual footing — BPHS-adjacent Muhūrta Cintāmaṇi tradition, taught in T1-07 16.6.4.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GOLD, fontWeight: 600 }}>Nāḍiāṁśa:</span> genuinely usable, but sourced through 20th-century compilations of Tamil Nāḍi material — a different kind of authority claim, disclosed honestly.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}55`, background: `${PURPLE}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: PURPLE, fontWeight: 600 }}>Praśna-derived:</span> this module&apos;s own disclosed extension of T2-15&apos;s cross-system RP overlay — once removed from its original KP-native use.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "summary" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Chapter 5 case file</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              What each method contributed
            </h3>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: BLUE, fontWeight: 600 }}>Praśna-derived:</span> consultation-moment RP overlay {`{Moon, Saturn, Sun, Venus}`} — silent non-confirmation, honestly recorded.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Nāḍiāṁśa:</span> A → Leo/Sun; B → Scorpio/Mars; C → Sagittarius/Jupiter. Real discrimination, same-root with Chapter 4&apos;s sub-lord finding.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}55`, background: `${PURPLE}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: PURPLE, fontWeight: 600 }}>Janma Tāra:</span> Pūrva Aṣāḍhā to Chitrā = Kṣema, favourable — identical for A/B/C, confirmatory only.
                </p>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Overall verdict</p>
            <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: GREEN, fontWeight: 600 }}>Texture, not a final decision.</span> The three secondary methods add three different kinds of evidence to Chapter 6&apos;s triangulation. None is asked to carry the verdict alone.
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
