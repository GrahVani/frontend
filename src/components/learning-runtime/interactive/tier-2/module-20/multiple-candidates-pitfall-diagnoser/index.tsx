"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  Binoculars,
  ChevronRight,
  LayoutList,
  RefreshCcw,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "types" | "diagnose" | "evaluate";
type PitfallType = 1 | 2 | 3;
type ScenarioKey = "vikram" | "differentSigns" | "reviewer";
type DiagnoseStep = 0 | 1 | 2 | 3;
type ResponseKey = "selfDoubt" | "moreEvents" | "blind" | "force";

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

const TABS: Record<TabKey, { label: string; icon: typeof LayoutList }> = {
  types: { label: "Three types", icon: LayoutList },
  diagnose: { label: "Diagnostic flow", icon: Binoculars },
  evaluate: { label: "Evaluate responses", icon: Scale },
};

const TYPES: Record<PitfallType, { title: string; subtitle: string; cause: string; fix: string; color: string; example: string }> = {
  1: {
    title: "Structural indistinguishability",
    subtitle: "Type 1",
    cause: "Surviving candidates share the discriminating structure (e.g., the same Lagna sign).",
    fix: "Use a different kind of signal — D60, vāra, or sub-lord — sensitive to what they actually differ on.",
    color: BLUE,
    example: "Vikram's A/B tie: both Virgo Lagna, so house-lordship tests always agree.",
  },
  2: {
    title: "Coincidental multi-fit",
    subtitle: "Type 2",
    cause: "A small sample of events happens to fit more than one structurally different candidate.",
    fix: "Gather one more genuinely independent event and re-test.",
    color: GOLD,
    example: "Two candidates in different signs both fit the one event checked so far.",
  },
  3: {
    title: "Confirmation bias",
    subtitle: "Type 3",
    cause: "A practitioner scores ambiguous fits generously for a favoured candidate and strictly for others.",
    fix: "Procedural fix: blind second reviewer or fixed written criteria.",
    color: VERMILION,
    example: "A tie breaks in favour of the suspected candidate after an unblind re-scoring.",
  },
};

const SCENARIOS: Record<ScenarioKey, { label: string; setup: string; type: PitfallType; sharedSign: boolean; detail: string }> = {
  vikram: {
    label: "Vikram's A/B tie",
    setup: "Candidates A and B both have Virgo Lagna and pass both event tests identically.",
    type: 1,
    sharedSign: true,
    detail: "Shared Lagna sign means house-lordship evidence cannot discriminate them in principle. The fix is a different signal, not more events.",
  },
  differentSigns: {
    label: "Two events, two fits",
    setup: "Two candidates in different signs both fit the single marriage event checked so far.",
    type: 2,
    sharedSign: false,
    detail: "They do not share structure, so the tie is likely a small-sample coincidence. One more independent event should break it.",
  },
  reviewer: {
    label: "Reviewer disagreement",
    setup: "The practitioner sees a tie, but a blind second reviewer scores a clear winner from the same evidence.",
    type: 3,
    sharedSign: false,
    detail: "The evidence is structurally distinguishable, yet the tie disappeared only when re-scored. This suggests the original scoring was biased.",
  },
};

const RESPONSES: Record<ResponseKey, { label: string; response: string; diagnosis: string; correct: boolean }> = {
  selfDoubt: {
    label: "Self-doubt",
    response: "'The tie means I lack experience. I'll keep interviewing until one candidate wins.'",
    diagnosis: "Mischaracterises a Type 1 structural tie as a personal skill gap. The fix is a different method, not more interviews.",
    correct: false,
  },
  moreEvents: {
    label: "More events",
    response: "'Two candidates fit. I'll gather one more independent event before deciding.'",
    diagnosis: "Correct for Type 2, but wrong if the candidates share the Lagna sign. Diagnose structure first.",
    correct: false,
  },
  blind: {
    label: "Blind re-score",
    response: "'The tie broke in favour of my hunch. I'll have a second reviewer score the same evidence without knowing my preference.'",
    diagnosis: "Correct procedural discipline for Type 3: remove the scorer's knowledge of which candidate is favoured.",
    correct: true,
  },
  force: {
    label: "Force a winner",
    response: "'Two candidates is uncomfortable. I'll choose the one that feels more likely.'",
    diagnosis: "Forces a single-method verdict the evidence does not support — exactly the trap this lesson warns against.",
    correct: false,
  },
};

function TypesSvg({ active }: { active: PitfallType }) {
  const positions: Record<PitfallType, { x: number; color: string; label: string }> = {
    1: { x: 80, color: BLUE, label: "Type 1" },
    2: { x: 230, color: GOLD, label: "Type 2" },
    3: { x: 380, color: VERMILION, label: "Type 3" },
  };
  return (
    <svg viewBox="0 0 460 160" role="img" aria-label="Three types of multiple-candidate ties" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={440} height={140} rx={8} fill={`${positions[active].color}08`} stroke={HAIRLINE} />
      {(Object.keys(positions) as unknown as PitfallType[]).map((t) => {
        const p = positions[t];
        const isActive = t === active;
        return (
          <g key={t}>
            <circle cx={p.x} cy={70} r={isActive ? 34 : 28} fill={isActive ? p.color : `${p.color}33`} stroke={p.color} strokeWidth={3} />
            <text x={p.x} y={75} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={600}>{p.label}</text>
            {t < active && (
              <line x1={p.x + 36} y1={70} x2={positions[(t + 1) as PitfallType].x - 36} y2={70} stroke={HAIRLINE} strokeWidth={2} />
            )}
          </g>
        );
      })}
      <text x={230} y={125} textAnchor="middle" fill={positions[active].color} fontSize={12} fontWeight={600}>
        {TYPES[active].title}
      </text>
    </svg>
  );
}

function DiagnosticFlowSvg({ step }: { step: DiagnoseStep }) {
  const nodes = [
    { label: "Share Lagna sign?", detail: "Structural check" },
    { label: "More events", detail: "Add one independent event" },
    { label: "Tie persists?", detail: "Re-test" },
    { label: "Blind review", detail: "Check for bias" },
  ];
  return (
    <svg viewBox="0 0 620 160" role="img" aria-label="Diagnostic sequence for multiple surviving candidates" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={600} height={140} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      {nodes.map((n, i) => {
        const x = 90 + i * 145;
        const active = i <= step;
        return (
          <g key={n.label}>
            <circle cx={x} cy={60} r={26} fill={active ? (i === 0 ? BLUE : i === 1 ? GOLD : i === 2 ? VERMILION : PURPLE) : `${INK_MUTED}33`} stroke={active ? (i === 0 ? BLUE : i === 1 ? GOLD : i === 2 ? VERMILION : PURPLE) : HAIRLINE} strokeWidth={3} />
            <text x={x} y={65} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>{i + 1}</text>
            <text x={x} y={100} textAnchor="middle" fill={active ? INK_PRIMARY : INK_MUTED} fontSize={10} fontWeight={600}>{n.label}</text>
            <text x={x} y={115} textAnchor="middle" fill={INK_MUTED} fontSize={9}>{n.detail}</text>
            {i < 3 && (
              <line x1={x + 30} y1={60} x2={x + 115} y2={60} stroke={active ? (i === 0 ? BLUE : i === 1 ? GOLD : i === 2 ? VERMILION : PURPLE) : HAIRLINE} strokeWidth={active ? 3 : 2} strokeDasharray={active ? undefined : "6 4"} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function VikramSvg() {
  return (
    <svg viewBox="0 0 460 180" role="img" aria-label="Vikram candidates A and B share Virgo Lagna" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={160} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      <circle cx={120} cy={90} r={40} fill={GREEN} />
      <text x={120} y={84} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={600}>Candidate A</text>
      <text x={120} y={102} textAnchor="middle" fill="#fff" fontSize={11}>05:48</text>

      <circle cx={340} cy={90} r={40} fill={GREEN} />
      <text x={340} y={84} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={600}>Candidate B</text>
      <text x={340} y={102} textAnchor="middle" fill="#fff" fontSize={11}>06:00</text>

      <rect x={170} y={70} width={120} height={40} rx={6} fill={`${BLUE}22`} stroke={BLUE} />
      <text x={230} y={95} textAnchor="middle" fill={BLUE} fontSize={12} fontWeight={600}>Virgo Lagna</text>

      <text x={230} y={145} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>Same sign → identical house lordships</text>
    </svg>
  );
}

export function MultipleCandidatesPitfallDiagnoser() {
  const [activeTab, setActiveTab] = useState<TabKey>("types");
  const [activeType, setActiveType] = useState<PitfallType>(1);
  const [scenario, setScenario] = useState<ScenarioKey>("vikram");
  const [diagnoseStep, setDiagnoseStep] = useState<DiagnoseStep>(0);
  const [response, setResponse] = useState<ResponseKey | null>(null);

  const reset = () => {
    setActiveTab("types");
    setActiveType(1);
    setScenario("vikram");
    setDiagnoseStep(0);
    setResponse(null);
  };

  const currentScenario = SCENARIOS[scenario];

  const typeSynthesis = useMemo(() => {
    const t = TYPES[activeType];
    return `${t.title}: ${t.cause} ${t.fix}`;
  }, [activeType]);

  const diagnosisResult = useMemo(() => {
    if (diagnoseStep === 0) return "Start by asking whether the surviving candidates share the Lagna sign — the structure the gathered evidence actually tests.";
    if (diagnoseStep === 1) {
      return currentScenario.sharedSign
        ? "Yes — they share the Lagna sign. This is Type 1 structural indistinguishability. More same-kind events cannot help; reach for D60 or vāra."
        : "No — they do not share the Lagna sign. The tie may be coincidental. Gather one more independent event and re-test.";
    }
    if (diagnoseStep === 2) {
      return currentScenario.sharedSign
        ? "Type 1 confirmed. The candidates differ only in degree within the sign, not in house lordship."
        : "After the new event, if the tie breaks, it was Type 2. If it persists, proceed to check for bias.";
    }
    return currentScenario.type === 3
      ? "Because the evidence is structurally distinguishable but the tie only appeared under one scorer, suspect Type 3 confirmation bias and use a blind reviewer."
      : "For this scenario, the diagnostic already resolves at an earlier step.";
  }, [currentScenario, diagnoseStep]);

  return (
    <div data-interactive="multiple-candidates-pitfall-diagnoser" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Multiple plausible candidates · Chapter 2</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Pitfall diagnoser
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Not every tie is the same. Learn to distinguish three reasons multiple candidates survive, and match each to the right fix.
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

      {activeTab === "types" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Compare types</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Three different reasons, three different fixes</h3>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              {(Object.keys(TYPES) as unknown as PitfallType[]).map((t) => (
                <button key={t} type="button" aria-pressed={activeType === t} onClick={() => setActiveType(t)} style={buttonStyle(activeType === t, TYPES[t].color)}>
                  {TYPES[t].subtitle}
                </button>
              ))}
            </div>
            <TypesSvg active={activeType} />
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${TYPES[activeType].color}55`, background: `${TYPES[activeType].color}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{typeSynthesis}</p>
            </div>
          </section>

          <div style={workbenchTwoColumnStyle}>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Cause</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: TYPES[activeType].color, fontSize: "1.15rem", fontWeight: 600 }}>{TYPES[activeType].title}</h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{TYPES[activeType].cause}</p>
            </section>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Correct fix</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>What to do</h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{TYPES[activeType].fix}</p>
            </section>
          </div>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Example</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>What it looks like in practice</h3>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{TYPES[activeType].example}</p>
          </section>
        </>
      )}

      {activeTab === "diagnose" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Scenario</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Choose a multiple-candidates case</h3>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                  <button key={key} type="button" aria-pressed={scenario === key} onClick={() => { setScenario(key); setDiagnoseStep(0); }} style={buttonStyle(scenario === key, BLUE)}>
                    {SCENARIOS[key].label}
                  </button>
                ))}
              </div>
            </div>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{currentScenario.setup}</p>
            <VikramSvg />
          </section>

          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Diagnostic sequence</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Step through the diagnosis</h3>
              </div>
              <button type="button" onClick={() => setDiagnoseStep((s) => (s + 1) % 4 as DiagnoseStep)} style={buttonStyle(false, BLUE)}>
                <ChevronRight size={15} aria-hidden="true" /> Next step
              </button>
            </div>
            <DiagnosticFlowSvg step={diagnoseStep} />
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{diagnosisResult}</p>
            </div>
            {diagnoseStep === 0 && currentScenario.sharedSign && (
              <div style={{ marginTop: "0.65rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Shortcut:</span> because this scenario shares the Lagna sign, the diagnostic resolves to Type 1 immediately.
                </p>
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === "evaluate" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Evaluate practitioner responses</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Which response handles the tie correctly?</h3>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {(Object.keys(RESPONSES) as ResponseKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={response === key}
                  onClick={() => setResponse(key)}
                  style={responseCardStyle(response === key, RESPONSES[key].correct ? GREEN : VERMILION)}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 600, color: response === key ? (RESPONSES[key].correct ? GREEN : VERMILION) : INK_PRIMARY }}>
                    {RESPONSES[key].correct ? <ShieldCheck size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
                    {RESPONSES[key].label}
                  </span>
                  <span style={{ display: "block", marginTop: "0.35rem", color: INK_SECONDARY, lineHeight: 1.5, fontStyle: "italic" }}>
                    {RESPONSES[key].response}
                  </span>
                </button>
              ))}
            </div>
            {response && (
              <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${RESPONSES[response].correct ? GREEN : VERMILION}55`, background: `${RESPONSES[response].correct ? GREEN : VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: RESPONSES[response].correct ? GREEN : VERMILION, fontWeight: 600 }}>{RESPONSES[response].correct ? "Correct discipline." : "Problematic."}</span>{" "}
                  {RESPONSES[response].diagnosis}
                </p>
              </div>
            )}
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Key takeaway</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>A tie is information, not failure</h3>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Reporting &quot;events-based rectification narrows the field to two candidates; a further method is needed&quot; is a complete, correct result. The trap is forcing a single-method verdict the evidence does not support, or misdiagnosing a Type 1 structural tie as a personal skill gap.
            </p>
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

function responseCardStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    padding: "0.85rem",
    borderRadius: 8,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}10` : SURFACE,
    cursor: "pointer",
  };
}
