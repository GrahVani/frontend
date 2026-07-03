"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BriefcaseBusiness,
  Calculator,
  CheckCircle2,
  Compass,
  FileText,
  GitCompare,
  RotateCcw,
  Route,
  Scale,
  TimerReset,
} from "lucide-react";

type StepKey = "d1" | "construct" | "compare" | "tier";
type ScenarioKey = "worked" | "vargottama" | "field";
type VerdictMode = "honest" | "d1Only" | "d10Only";

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

const STEPS: Array<{ key: StepKey; label: string; color: string; icon: ReactNode }> = [
  { key: "d1", label: "A. Read D1 promise", color: BLUE, icon: <BriefcaseBusiness size={17} /> },
  { key: "construct", label: "B. Construct D10", color: GOLD, icon: <Calculator size={17} /> },
  { key: "compare", label: "C. Compare charts", color: PURPLE, icon: <GitCompare size={17} /> },
  { key: "tier", label: "D. Honest tier", color: GREEN, icon: <Scale size={17} /> },
];

const SCENARIOS = {
  worked: {
    label: "Lesson chart",
    color: VERMILION,
    headline: "Strong D1 / weak D10",
    d1: "Aries Lagna; Saturn is 10th lord in own sign Capricorn in the 10th, with strong Sun status support.",
    construct: "Saturn 8deg Capricorn -> 3rd dashamsha. Capricorn is even, so start from 9th-from-Capricorn: Virgo. The 3rd from Virgo is Scorpio.",
    d10: "Saturn lands in Scorpio in the D10, weaker than its own-sign D1 position; D10 Lagna lord and 10th lord are moderate, with no vargottama.",
    verdict: "Moderate, caveated: real structured career promise, but actual attainment may underdeliver or become harder-won.",
    tier: 58,
  },
  vargottama: {
    label: "Vargottama contrast",
    color: GREEN,
    headline: "Convergent strong tier",
    d1: "D1 10th lord is strong, dignified, and clearly career-supportive.",
    construct: "The constructed D10 places the same 10th lord in the same sign as D1, making it vargottama.",
    d10: "D10 10th and its lord are also strong; promise and refined delivery agree.",
    verdict: "Strong: the same process now yields a higher tier because both charts confirm each other.",
    tier: 88,
  },
  field: {
    label: "Field divergence",
    color: PURPLE,
    headline: "D10 refines the type",
    d1: "D1 10th suggests commerce, communication, and Mercury-flavoured work.",
    construct: "D10 construction is verified first, then the D10 career core is read.",
    d10: "D10 points toward service or healing, possibly through a 6th-house, Saturn, or Moon signature.",
    verdict: "Field-refinement: likely communication or commerce inside a service/healing context, rather than picking one chart and discarding the other.",
    tier: 66,
  },
} as const;

const CONSTRUCTION_PATH = [
  { label: "Capricorn", count: 1 },
  { label: "Aquarius", count: 2 },
  { label: "Pisces", count: 3 },
  { label: "Aries", count: 4 },
  { label: "Taurus", count: 5 },
  { label: "Gemini", count: 6 },
  { label: "Cancer", count: 7 },
  { label: "Leo", count: 8 },
  { label: "Virgo", count: 9 },
];

const D10_COUNT = [
  { label: "Virgo", count: 1 },
  { label: "Libra", count: 2 },
  { label: "Scorpio", count: 3 },
];

export function D10CareerQuestionWorkbench() {
  const [step, setStep] = useState<StepKey>("d1");
  const [scenario, setScenario] = useState<ScenarioKey>("worked");
  const [constructionOpen, setConstructionOpen] = useState(true);
  const [carryForward, setCarryForward] = useState(true);
  const [verdictMode, setVerdictMode] = useState<VerdictMode>("honest");

  const current = SCENARIOS[scenario];
  const stepIndex = STEPS.findIndex((item) => item.key === step);
  const pickError = verdictMode !== "honest" && scenario === "worked";
  const tier = pickError ? (verdictMode === "d1Only" ? 84 : 22) : current.tier;

  const synthesis = useMemo(() => {
    if (pickError && verdictMode === "d1Only") {
      return "This overstates the reading by reporting the strong D1 promise as the final verdict and ignoring the weaker D10 delivery.";
    }
    if (pickError && verdictMode === "d10Only") {
      return "This understates the reading by declaring failure from the weaker D10 and discarding the real D1 foundation.";
    }
    const carry = carryForward
      ? " Carry this chapter output into AmK, KP, profession yogas, and dasha timing."
      : " If you stop here, the promise/refinement picture has not yet been timed or cross-checked.";
    return `${current.verdict}${carry}`;
  }, [carryForward, current.verdict, pickError, verdictMode]);

  return (
    <div data-interactive="d10-career-question-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked D10 career question</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Run construct, read, compare, and tier on one career case
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Follow the chapter process from a strong D1 promise through Saturn{"'"}s D10 construction into an honest moderate-with-caveat verdict.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("d1");
              setScenario("worked");
              setConstructionOpen(true);
              setCarryForward(true);
              setVerdictMode("honest");
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Workflow rail</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))", gap: "0.6rem", marginTop: "0.75rem" }}>
          {STEPS.map((item, index) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={step === item.key}
              onClick={() => setStep(item.key)}
              style={{
                border: `1px solid ${step === item.key ? item.color : HAIRLINE}`,
                borderRadius: 8,
                background: step === item.key ? `${item.color}18` : "transparent",
                color: step === item.key ? item.color : INK_SECONDARY,
                padding: "0.75rem",
                cursor: "pointer",
                textAlign: "left",
                fontWeight: 600,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>{item.icon}{item.label}</span>
              <span style={{ display: "block", marginTop: "0.45rem", color: INK_MUTED, fontSize: "0.78rem" }}>
                {index <= stepIndex ? "Included in current synthesis" : "Next step"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Case diagram</p>
              <h3 style={{ margin: "0.15rem 0 0", color: current.color, fontSize: "1.2rem" }}>{current.headline}</h3>
            </div>
            <strong style={{ color: tier >= 80 ? GREEN : tier <= 35 ? VERMILION : GOLD, fontWeight: 700 }}>{tier}% tier signal</strong>
          </div>
          <CaseFlowSvg step={step} scenario={scenario} tier={tier} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Compass size={16} />} title="D1 promise" body={scenario === "worked" ? "strong Saturn" : scenario === "vargottama" ? "strong" : "commerce cue"} color={BLUE} />
            <MiniFact icon={<Calculator size={16} />} title="D10 check" body={scenario === "worked" ? "Capricorn -> Scorpio" : "verified"} color={GOLD} />
            <MiniFact icon={<Scale size={16} />} title="Tier" body={tier >= 80 ? "strong" : tier <= 35 ? "weak" : "moderate"} color={tier >= 80 ? GREEN : tier <= 35 ? VERMILION : GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Scenario lens" icon={<FileText size={18} />} color={current.color}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={scenario === key} onClick={() => { setScenario(key); setVerdictMode("honest"); }} style={smallChipStyle(scenario === key, SCENARIOS[key].color)}>
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{current.headline}: {current.verdict}</p>
          </Panel>

          <Panel title="Verdict discipline" icon={pickError ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />} color={pickError ? VERMILION : GREEN}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={verdictMode === "honest"} onClick={() => setVerdictMode("honest")} style={smallChipStyle(verdictMode === "honest", GREEN)}>
                Honest synthesis
              </button>
              <button type="button" aria-pressed={verdictMode === "d1Only"} onClick={() => setVerdictMode("d1Only")} style={smallChipStyle(verdictMode === "d1Only", VERMILION)}>
                Report D1 only
              </button>
              <button type="button" aria-pressed={verdictMode === "d10Only"} onClick={() => setVerdictMode("d10Only")} style={smallChipStyle(verdictMode === "d10Only", VERMILION)}>
                Report D10 only
              </button>
            </div>
            <p style={bodyTextStyle}>{pickError ? "The worked chart requires a moderate caveated verdict, not a one-chart report." : "Both charts are retained and weighted."}</p>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Step evidence</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: STEPS[stepIndex].color, fontSize: "1.18rem" }}>{STEPS[stepIndex].label}</h3>
          <EvidencePanel step={step} scenario={scenario} constructionOpen={constructionOpen} setConstructionOpen={setConstructionOpen} />
        </section>

        <section style={{ ...cardStyle, borderColor: pickError ? `${VERMILION}66` : `${current.color}66`, background: pickError ? `${VERMILION}0F` : `${current.color}0F` }}>
          <p style={eyebrowStyle}>Chapter output</p>
          <h3 style={{ margin: "0.15rem 0 0", color: pickError ? VERMILION : current.color, fontSize: "1.18rem" }}>
            {pickError ? "Discipline warning" : current.headline}
          </h3>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
          <button type="button" aria-pressed={carryForward} onClick={() => setCarryForward((value) => !value)} style={{ ...togglePanelStyle(carryForward, GREEN), marginTop: "0.85rem" }}>
            <TimerReset size={18} aria-hidden="true" />
            <span>
              <strong style={{ fontWeight: 700 }}>Carry forward to timing and overlays</strong>
              <span>{carryForward ? "D1-D10 is the chapter output, not the finished prediction." : "Turn this back on to preserve the module workflow."}</span>
            </span>
          </button>
        </section>
      </div>
    </div>
  );
}

function EvidencePanel({ step, scenario, constructionOpen, setConstructionOpen }: { step: StepKey; scenario: ScenarioKey; constructionOpen: boolean; setConstructionOpen: (value: boolean) => void }) {
  const current = SCENARIOS[scenario];
  if (step === "d1") {
    return <StepText icon={<BriefcaseBusiness size={18} />} color={BLUE} title="D1 10th sets the promise" body={current.d1} />;
  }
  if (step === "compare") {
    return <StepText icon={<GitCompare size={18} />} color={PURPLE} title="Compare promise with refined delivery" body={current.d10} />;
  }
  if (step === "tier") {
    return <StepText icon={<Scale size={18} />} color={GREEN} title="Assign the honest confidence tier" body={current.verdict} />;
  }
  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <button type="button" aria-pressed={constructionOpen} onClick={() => setConstructionOpen(!constructionOpen)} style={togglePanelStyle(constructionOpen, GOLD)}>
        <Calculator size={18} aria-hidden="true" />
        <span>
          <strong style={{ fontWeight: 700 }}>Verify Saturn{"'"}s D10 before reading</strong>
          <span>{current.construct}</span>
        </span>
      </button>
      {constructionOpen && scenario === "worked" ? (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <CountStrip title="Find 9th from Capricorn" items={CONSTRUCTION_PATH} active="Virgo" color={GOLD} />
          <CountStrip title="Count 3rd from Virgo" items={D10_COUNT} active="Scorpio" color={GREEN} />
        </div>
      ) : null}
      {scenario !== "worked" ? <StepText icon={<Route size={18} />} color={GOLD} title="Construction remains mandatory" body={current.construct} /> : null}
    </div>
  );
}

function CaseFlowSvg({ step, scenario, tier }: { step: StepKey; scenario: ScenarioKey; tier: number }) {
  const activeIndex = STEPS.findIndex((item) => item.key === step);
  const current = SCENARIOS[scenario];
  const nodes = [
    { x: 70, y: 110, label: "D1", sub: "promise", color: BLUE },
    { x: 205, y: 110, label: "D10", sub: "construct", color: GOLD },
    { x: 340, y: 110, label: "Compare", sub: "pattern", color: PURPLE },
    { x: 475, y: 110, label: "Tier", sub: "verdict", color: tier >= 80 ? GREEN : tier <= 35 ? VERMILION : GOLD },
  ];
  return (
    <svg viewBox="0 0 560 260" role="img" aria-label="Full D10 worked example process" style={{ width: "100%", maxHeight: 330, margin: "0.45rem auto 0.8rem", display: "block" }}>
      <rect x="24" y="34" width="512" height="180" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      {nodes.slice(0, -1).map((node, index) => (
        <path key={node.label} d={`M ${node.x + 36} ${node.y} C ${node.x + 72} ${node.y - 46}, ${nodes[index + 1].x - 72} ${nodes[index + 1].y - 46}, ${nodes[index + 1].x - 36} ${nodes[index + 1].y}`} fill="none" stroke={index < activeIndex ? current.color : `${GOLD}55`} strokeWidth={index < activeIndex ? 5 : 3} strokeLinecap="round" />
      ))}
      {nodes.map((node, index) => {
        const active = index === activeIndex;
        const done = index < activeIndex;
        return (
          <g key={node.label}>
            <circle cx={node.x} cy={node.y} r={active ? 42 : 34} fill={active || done ? node.color : "#FFF9EA"} stroke={active ? "#fff" : HAIRLINE} strokeWidth={active ? 4 : 2} />
            <text x={node.x} y={node.y - 4} textAnchor="middle" fill={active || done ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="950">{node.label}</text>
            <text x={node.x} y={node.y + 14} textAnchor="middle" fill={active || done ? "#fff" : INK_MUTED} fontSize="10" fontWeight="850">{node.sub}</text>
          </g>
        );
      })}
      <rect x="178" y="170" width="204" height="28" rx="8" fill={scenario === "worked" ? `${VERMILION}18` : `${current.color}18`} stroke={`${current.color}66`} />
      <text x="280" y="189" textAnchor="middle" fill={current.color} fontSize="12" fontWeight="700">{current.headline}</text>
      <rect x="414" y="174" width="76" height="16" rx="8" fill={`${GOLD}22`} stroke={HAIRLINE} />
      <rect x="414" y="174" width={Math.max(8, Math.min(76, tier * 0.76))} height="16" rx="8" fill={tier >= 80 ? GREEN : tier <= 35 ? VERMILION : GOLD} />
    </svg>
  );
}

function CountStrip({ title, items, active, color }: { title: string; items: Array<{ label: string; count: number }>; active: string; color: string }) {
  return (
    <div>
      <strong style={{ color, fontWeight: 700 }}>{title}</strong>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.45rem" }}>
        {items.map((item) => (
          <span key={`${title}-${item.label}`} style={{ border: `1px solid ${item.label === active ? color : HAIRLINE}`, borderRadius: 8, background: item.label === active ? `${color}18` : "transparent", color: item.label === active ? color : INK_SECONDARY, padding: "0.45rem 0.55rem", fontWeight: 600 }}>
            {item.count}. {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function StepText({ icon, color, title, body }: { icon: ReactNode; color: string; title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.8rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{body}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 700 }}>{icon}{title}</div>
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
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 600,
    cursor: "pointer",
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
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
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
