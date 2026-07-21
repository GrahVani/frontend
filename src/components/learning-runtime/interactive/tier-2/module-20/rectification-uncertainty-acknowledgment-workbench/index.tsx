"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeftRight,
  CheckCircle2,
  Circle,
  CircleDot,
  CircleSlash,
  MessageSquare,
  RotateCcw,
  Scale,
  ShieldCheck,
  Target,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

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

const TIER_STEPS = [
  {
    key: "strong",
    match: "3+",
    label: "Strong indication",
    layer: "Near clear-chart-fact",
    action: "Report the rectified time directly, with routine chart-reading humility.",
    color: GREEN,
  },
  {
    key: "moderate",
    match: "2",
    label: "Moderate indication",
    layer: "Probabilistic tendency",
    action: "Report the favoured candidate hedged; name the alternative; state what would raise confidence.",
    color: GOLD,
  },
  {
    key: "weak",
    match: "1",
    label: "Weak / possibility only",
    layer: "Near silent/under-determined",
    action: "Report as a lead only; do not build further chart-work without more data.",
    color: BLUE,
  },
  {
    key: "none",
    match: "0 / contradictory",
    label: "No defensible prediction",
    layer: "Silent/under-determined",
    action: "Report BTR inconclusive; name the divergence if present; do not force a pick.",
    color: VERMILION,
  },
] as const;

type Direction = "silent" | "towardA" | "towardB";
type Scenario = "vikram" | "priya" | "custom";

const METHODS: { id: "events" | "tattva"; label: string; note: string }[] = [
  { id: "events", label: "Events-based", note: "Ch2 · antardaśā-lord discrimination" },
  { id: "tattva", label: "Tattva-śuddhi", note: "Ch3 · elemental coherence" },
];

const SCENARIOS: Record<Scenario, { label: string; body: string; directions: [Direction, Direction] }> = {
  vikram: {
    label: "Vikram: limited convergence",
    body: "One method is silent; the other independently discriminates toward B. This is moderate, not divergence.",
    directions: ["silent", "towardB"],
  },
  priya: {
    label: "Priya: genuine divergence",
    body: "Two independent methods point in opposite directions. Per the contradiction-lowers rule, this is no defensible prediction.",
    directions: ["towardA", "towardB"],
  },
  custom: {
    label: "Custom case",
    body: "Set the direction of each method yourself and watch the tier and the honest response update.",
    directions: ["silent", "silent"],
  },
};

export function RectificationUncertaintyAcknowledgmentWorkbench() {
  const [scenario, setScenario] = useState<Scenario>("vikram");
  const [method1, setMethod1] = useState<Direction>("silent");
  const [method2, setMethod2] = useState<Direction>("towardB");
  const [thirdMethod, setThirdMethod] = useState(false);
  const [response, setResponse] = useState<"inflated" | "deflecting" | "honest" | null>(null);

  const pickScenario = (key: Scenario) => {
    const [d1, d2] = SCENARIOS[key].directions;
    setScenario(key);
    setMethod1(d1);
    setMethod2(d2);
    setThirdMethod(false);
    setResponse(null);
  };

  const directions = useMemo(() => {
    return [method1, method2].map((d) => (d === "silent" ? null : d === "towardA" ? "A" : "B"));
  }, [method1, method2]);

  const active = useMemo(() => directions.filter(Boolean) as string[], [directions]);
  const allSame = useMemo(() => active.length > 0 && active.every((d) => d === active[0]), [active]);
  const contradiction = useMemo(() => active.length > 1 && !allSame, [active, allSame]);
  const count = useMemo(() => active.length + (thirdMethod && allSame ? 1 : 0), [active, thirdMethod, allSame]);

  const tierKey = useMemo(() => {
    if (contradiction || count === 0) return "none";
    if (count === 1) return "weak";
    if (count === 2) return "moderate";
    return "strong";
  }, [contradiction, count]);

  const tier = TIER_STEPS.find((t) => t.key === tierKey) ?? TIER_STEPS[3];
  const thirdAvailable = active.length > 0 && allSame;

  const reset = () => {
    pickScenario("vikram");
  };

  return (
    <div data-interactive="rectification-uncertainty-acknowledgment-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Divergence, uncertainty, and honest response</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Distinguish limited convergence from genuine divergence, then choose the honest response
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Vikram&apos;s case is limited convergence, not divergence. Priya&apos;s case is genuine divergence. The practitioner response depends on the tier — not on the client&apos;s preference.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            <div>
              <p style={eyebrowStyle}>Case diagram</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tier.color, fontSize: "1.2rem", fontWeight: 600 }}>
                {SCENARIOS[scenario].label}
              </h3>
            </div>
            <span style={{ color: tier.color, fontWeight: 600 }}>{tier.label}</span>
          </div>
          <DivergenceSvg method1={method1} method2={method2} contradiction={contradiction} allSame={allSame} tierColor={tier.color} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem", marginTop: "0.85rem" }}>
            <MiniFact icon={<ArrowLeftRight size={16} />} title="Divergence?" body={contradiction ? "Yes — contradiction" : "No — not contradicting"} color={contradiction ? VERMILION : GREEN} />
            <MiniFact icon={<Target size={16} />} title="Active threads" body={String(active.length)} color={GREEN} />
            <MiniFact icon={<Scale size={16} />} title="Honest tier" body={tier.label} color={tier.color} />
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{SCENARIOS[scenario].body}</p>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px", alignContent: "start" }}>
          <Panel title="Scenario" icon={<Scale size={18} />} color={GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {(Object.keys(SCENARIOS) as Scenario[]).map((key) => (
                <button key={key} type="button" aria-pressed={scenario === key} onClick={() => pickScenario(key)} style={smallChipStyle(scenario === key, GOLD)}>
                  {SCENARIOS[key].label.split(":")[0]}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>Select a preset or build your own case with Custom.</p>
          </Panel>

          <Panel title="Method directions" icon={<ArrowLeftRight size={18} />} color={PURPLE}>
            <div style={{ display: "grid", gap: "0.6rem" }}>
              <MethodDirectionControl
                label={METHODS[0].label}
                note={METHODS[0].note}
                value={method1}
                onChange={setMethod1}
              />
              <MethodDirectionControl
                label={METHODS[1].label}
                note={METHODS[1].note}
                value={method2}
                onChange={setMethod2}
              />
            </div>
          </Panel>

          <button
            type="button"
            aria-pressed={thirdMethod}
            disabled={!thirdAvailable}
            onClick={() => setThirdMethod((value) => !value)}
            style={{
              ...togglePanelStyle(thirdMethod && thirdAvailable, GREEN),
              opacity: thirdAvailable ? 1 : 0.55,
            }}
          >
            <CircleDot size={18} aria-hidden="true" />
            <span>
              <span style={{ fontWeight: 600, display: "block" }}>Add a hypothetical third independent method</span>
              <span>{thirdAvailable ? (thirdMethod ? "Count rises to 3 → strong indication" : "Only available when the first two agree") : "Disabled until two methods agree on one candidate"}</span>
            </span>
          </button>
        </section>
      </div>

      <div style={responsiveThreeColumnStyle}>
        <Panel title="T2-01 tier → T1-24 layer" icon={<Scale size={18} />} color={GOLD}>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {TIER_STEPS.map((step) => {
              const active = step.key === tierKey;
              return (
                <div
                  key={step.key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr",
                    gap: "0.6rem",
                    border: `1px solid ${active ? step.color : HAIRLINE}`,
                    borderRadius: 8,
                    background: active ? `${step.color}14` : "transparent",
                    padding: "0.55rem 0.65rem",
                  }}
                >
                  <span style={{ color: active ? step.color : INK_MUTED, fontWeight: 600, fontSize: "0.85rem" }}>{step.match}</span>
                  <span style={{ color: active ? step.color : INK_SECONDARY, fontWeight: active ? 600 : 400, fontSize: "0.85rem" }}>{step.layer}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Practitioner action" icon={<ShieldCheck size={18} />} color={tier.color}>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {TIER_STEPS.map((step) => {
              const active = step.key === tierKey;
              return (
                <div
                  key={step.key}
                  style={{
                    display: "flex",
                    gap: "0.6rem",
                    alignItems: "start",
                    opacity: active ? 1 : 0.55,
                  }}
                >
                  <span style={{ color: step.color, fontWeight: 600, fontSize: "0.85rem", minWidth: 50 }}>{step.label}</span>
                  <span style={{ color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.85rem" }}>{step.action}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Direction matters" icon={<AlertCircle size={18} />} color={VERMILION}>
          <div style={{ display: "grid", gap: "0.55rem", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
            <p style={{ margin: 0 }}>Two threads <em>agreeing</em> toward one candidate produces a real tier.</p>
            <p style={{ margin: 0 }}>Two threads <em>contradicting</em> each other does not average to moderate — it collapses to no defensible prediction.</p>
            <p style={{ margin: 0 }}>A client&apos;s preference for more confidence is never evidence.</p>
          </div>
        </Panel>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Client pushback · §6 Example 2</p>
            <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem", fontWeight: 600 }}>
              Vikram says: &ldquo;Can&apos;t you just pick B and tell me it&apos;s confirmed?&rdquo;
            </h3>
          </div>
          <span style={{ color: GOLD, fontSize: "0.85rem", fontWeight: 600 }}>Current tier: {tier.label}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "0.65rem", marginTop: "0.85rem" }}>
          <button
            type="button"
            aria-pressed={response === "inflated"}
            onClick={() => setResponse("inflated")}
            style={responseCardStyle(response === "inflated", VERMILION)}
          >
            <span style={{ fontWeight: 600, color: VERMILION }}>Inflated</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.85rem" }}>
              &ldquo;Sure — Candidate B is confirmed. You can act on it as fact.&rdquo;
            </p>
          </button>
          <button
            type="button"
            aria-pressed={response === "deflecting"}
            onClick={() => setResponse("deflecting")}
            style={responseCardStyle(response === "deflecting", BLUE)}
          >
            <span style={{ fontWeight: 600, color: BLUE }}>Deflecting</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.85rem" }}>
              &ldquo;I can&apos;t answer that question right now.&rdquo;
            </p>
          </button>
          <button
            type="button"
            aria-pressed={response === "honest"}
            onClick={() => setResponse("honest")}
            style={responseCardStyle(response === "honest", GREEN)}
          >
            <span style={{ fontWeight: 600, color: GREEN }}>Honest + compassionate</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.85rem" }}>
              &ldquo;I understand the appeal of a clean answer, and I want to be straight with you rather than tell you what&apos;s easier to hear...&rdquo;
            </p>
          </button>
        </div>

        {response ? (
          <div
            style={{
              marginTop: "0.85rem",
              border: `1px solid ${response === "honest" ? GREEN : response === "deflecting" ? GOLD : VERMILION}55`,
              borderRadius: 8,
              background: `${response === "honest" ? GREEN : response === "deflecting" ? GOLD : VERMILION}10`,
              padding: "0.85rem",
              display: "flex",
              gap: "0.6rem",
              alignItems: "start",
            }}
          >
            {response === "honest" ? <CheckCircle2 size={18} color={GREEN} /> : response === "deflecting" ? <MessageSquare size={18} color={GOLD} /> : <AlertCircle size={18} color={VERMILION} />}
            <div style={{ color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
              {response === "honest" ? (
                <>
                  <strong style={{ color: GREEN, fontWeight: 600 }}>Correct.</strong> This holds the moderate tier and addresses the client&apos;s discomfort through T1-24&apos;s agency-restoration discipline: truth paired with compassion and an actionable next step.
                </>
              ) : response === "deflecting" ? (
                <>
                  <strong style={{ color: GOLD, fontWeight: 600 }}>Partial.</strong> Avoiding the question protects the practitioner but misses the chance to give the client an honest, actionable response.
                </>
              ) : (
                <>
                  <strong style={{ color: VERMILION, fontWeight: 600 }}>Incorrect.</strong> A client&apos;s preference is not evidence. Inflating the tier commits the more serious error that Lesson 20.1.1 §4.3 warns against: every downstream reading silently inherits the wrong birth time.
                </>
              )}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function MethodDirectionControl({
  label,
  note,
  value,
  onChange,
}: {
  label: string;
  note: string;
  value: Direction;
  onChange: (value: Direction) => void;
}) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.65rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem" }}>
        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{label}</span>
        <span style={{ fontSize: "0.75rem", color: INK_MUTED }}>{note}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
        <button type="button" aria-pressed={value === "silent"} onClick={() => onChange("silent")} style={smallChipStyle(value === "silent", INK_MUTED)}>
          <CircleSlash size={13} /> Silent
        </button>
        <button type="button" aria-pressed={value === "towardA"} onClick={() => onChange("towardA")} style={smallChipStyle(value === "towardA", BLUE)}>
          <Circle size={13} /> Toward A
        </button>
        <button type="button" aria-pressed={value === "towardB"} onClick={() => onChange("towardB")} style={smallChipStyle(value === "towardB", GREEN)}>
          <CircleDot size={13} /> Toward B
        </button>
      </div>
    </div>
  );
}

function DivergenceSvg({
  method1,
  method2,
  contradiction,
  allSame,
  tierColor,
}: {
  method1: Direction;
  method2: Direction;
  contradiction: boolean;
  allSame: boolean;
  tierColor: string;
}) {
  return (
    <svg viewBox="0 0 560 240" role="img" aria-label="Two independent methods showing whether they converge, diverge, or stay silent" style={{ width: "100%", maxHeight: 320, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="10" y="10" width="540" height="220" rx={8} fill={SURFACE} stroke={HAIRLINE} />

      {/* Candidate labels */}
      <text x="70" y="40" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Candidate A</text>
      <text x="490" y="40" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Candidate B</text>

      {/* Method 1 lane: events-based */}
      <MethodLane y={90} method="Events-based" direction={method1} />

      {/* Method 2 lane: tattva-śuddhi */}
      <MethodLane y={170} method="Tattva-śuddhi" direction={method2} />

      {/* Center verdict indicator */}
      <circle cx="280" cy="130" r="38" fill={tierColor} fillOpacity={0.10} stroke={tierColor} strokeWidth={2} />
      <text x="280" y="124" textAnchor="middle" fill={tierColor} fontSize="10" fontWeight="600">Verdict</text>
      <text x="280" y="140" textAnchor="middle" fill={tierColor} fontSize="11" fontWeight="600">{contradiction ? "Divergent" : allSame ? "Convergent" : "Limited"}</text>
    </svg>
  );
}

function MethodLane({ y, method, direction }: { y: number; method: string; direction: Direction }) {
  const boxColor = direction === "silent" ? INK_MUTED : direction === "towardA" ? BLUE : GREEN;
  const label = direction === "silent" ? "silent" : direction === "towardA" ? "toward A" : "toward B";

  return (
    <g>
      <rect x="230" y={y - 18} width="100" height="36" rx={8} fill={boxColor} fillOpacity={0.10} stroke={boxColor} strokeWidth={1.5} />
      <text x="280" y={y - 3} textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="600">{method}</text>
      <text x="280" y={y + 8} textAnchor="middle" fill={boxColor} fontSize="9">{label}</text>

      {direction === "towardA" ? (
        <>
          <line x1="230" y1={y} x2="120" y2={y} stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
          <polygon points="128,196 120,192 128,188" transform={`translate(0, ${y - 192})`} fill={BLUE} />
        </>
      ) : direction === "towardB" ? (
        <>
          <line x1="330" y1={y} x2="440" y2={y} stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
          <polygon points="432,188 440,192 432,196" transform={`translate(0, ${y - 192})`} fill={GREEN} />
        </>
      ) : (
        <line x1="240" y1={y} x2="320" y2={y} stroke={INK_MUTED} strokeWidth="2" strokeDasharray="5 4" />
      )}
    </g>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.55rem",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.85rem",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

function responseCardStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.35rem",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}10` : "transparent",
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const responsiveThreeColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
