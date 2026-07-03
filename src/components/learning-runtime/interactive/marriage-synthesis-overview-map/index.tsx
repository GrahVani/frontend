"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CalendarClock, GitCompare, HeartHandshake, HelpCircle, Layers3, RotateCcw, Scale, ShieldCheck, TriangleAlert } from "lucide-react";

type StepId = "question" | "promise" | "streams" | "compatibility" | "timing" | "synthesise" | "frame" | "scope";
type QuestionMode = "timing" | "proposal" | "quality";
type ConfidenceMode = "convergent" | "mixed" | "divergent";

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

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [BLUE]: "#E3EEF9",
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FDF4E3",
  [VERMILION]: "#F9E8E3",
  [PURPLE]: "#EDE9F6",
};

const STEPS: Record<StepId, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  question: {
    label: "Question",
    title: "Read what is actually being asked",
    body: "Timing, proposal evaluation, and marriage quality weight different layers. The first failure mode is answering the wrong question.",
    icon: <HelpCircle size={16} />,
    color: BLUE,
  },
  promise: {
    label: "Promise",
    title: "Promise before timing",
    body: "Establish the natal marriage promise through the 7th, D9, Venus, UL, and KP 7th CSL before timing anything.",
    icon: <ShieldCheck size={16} />,
    color: PURPLE,
  },
  streams: {
    label: "Streams",
    title: "Take each stream as its own verdict",
    body: "Parashari, Venus, Jaimini, and KP each produce a confidence-bearing reading. They are weighed, not averaged.",
    icon: <Layers3 size={16} />,
    color: GOLD,
  },
  compatibility: {
    label: "Proposal",
    title: "Compatibility and dosha belong to proposal questions",
    body: "Ashta-kuta is read by distribution and cancellations; Manglik is checked with full cancellations before any verdict.",
    icon: <HeartHandshake size={16} />,
    color: GREEN,
  },
  timing: {
    label: "Timing",
    title: "Use marriage-significator dasha plus transit",
    body: "Venus, 7th-lord, UL-lord, KP 2-7-11, transit confirmation, and annual year refinement produce a window.",
    icon: <CalendarClock size={16} />,
    color: BLUE,
  },
  synthesise: {
    label: "Synthesis",
    title: "Weight convergence and name divergence",
    body: "Convergence raises confidence. Divergence is named honestly and lowers confidence rather than being forced flat.",
    icon: <GitCompare size={16} />,
    color: PURPLE,
  },
  frame: {
    label: "Frame",
    title: "Deliver with agency",
    body: "The output is a confidence-classified window or proposal reading, never a fatalistic decree or single-number verdict.",
    icon: <BadgeCheck size={16} />,
    color: GREEN,
  },
  scope: {
    label: "Scope",
    title: "Route safety, legal, and psychological concerns",
    body: "Scope is part of the method. If crisis or harm appears, pause the technical reading and route to real support.",
    icon: <TriangleAlert size={16} />,
    color: VERMILION,
  },
};

export function MarriageSynthesisOverviewMap() {
  const [activeStep, setActiveStep] = useState<StepId>("question");
  const [questionMode, setQuestionMode] = useState<QuestionMode>("timing");
  const [promiseFirst, setPromiseFirst] = useState(true);
  const [streamsWeighted, setStreamsWeighted] = useState(true);
  const [compatibilityNeeded, setCompatibilityNeeded] = useState(false);
  const [timingTwoYes, setTimingTwoYes] = useState(true);
  const [confidenceMode, setConfidenceMode] = useState<ConfidenceMode>("convergent");
  const [agencyFrame, setAgencyFrame] = useState(true);
  const [scopeFlag, setScopeFlag] = useState(false);
  const [fatalisticOutput, setFatalisticOutput] = useState(false);

  const proposalQuestion = questionMode === "proposal";
  const methodReady = promiseFirst && streamsWeighted && timingTwoYes && agencyFrame && !fatalisticOutput && !scopeFlag;
  const confidence = useMemo(() => {
    if (scopeFlag) return { label: "route before synthesis", color: VERMILION };
    if (fatalisticOutput || !agencyFrame) return { label: "framing repair needed", color: VERMILION };
    if (!promiseFirst) return { label: "promise missing", color: GOLD };
    if (!streamsWeighted) return { label: "stream weighting missing", color: GOLD };
    if (confidenceMode === "divergent") return { label: "moderate or cautious verdict", color: GOLD };
    if (confidenceMode === "mixed") return { label: "moderate confidence verdict", color: BLUE };
    if (methodReady) return { label: "strong synthesis map", color: GREEN };
    return { label: "method partly complete", color: PURPLE };
  }, [agencyFrame, confidenceMode, fatalisticOutput, methodReady, promiseFirst, scopeFlag, streamsWeighted]);

  const statement = useMemo(() => {
    if (scopeFlag) return "Pause and route: safety, legal, psychological, crisis, or abuse concerns exceed the astrology workflow.";
    if (fatalisticOutput || !agencyFrame) return "Repair the frame: no never-marry decree, no single-number proposal verdict, and no exact-date pressure.";
    if (!promiseFirst) return "The method is out of order. Establish the marriage promise before timing or proposal judgment.";
    if (!streamsWeighted) return "The streams are being averaged. Weight each stream by clarity and support, then name convergence or divergence.";
    if (!timingTwoYes && questionMode === "timing") return "Timing needs the two-yes: significator dasha plus transit, with annual chart used for year refinement.";
    if (proposalQuestion && !compatibilityNeeded) return "This is a proposal question, so add the compatibility and dosha layer before synthesis.";
    if (confidenceMode === "divergent") return "Name the divergence, lean toward the better-supported streams, and lower the confidence rather than forcing agreement.";
    return "The eight moves are in order: parse the question, promise first, stream verdicts, proposal layer if needed, timing, weighted synthesis, agency frame, and scope check.";
  }, [agencyFrame, compatibilityNeeded, confidenceMode, fatalisticOutput, promiseFirst, proposalQuestion, questionMode, scopeFlag, streamsWeighted, timingTwoYes]);

  function reset() {
    setActiveStep("question");
    setQuestionMode("timing");
    setPromiseFirst(true);
    setStreamsWeighted(true);
    setCompatibilityNeeded(false);
    setTimingTwoYes(true);
    setConfidenceMode("convergent");
    setAgencyFrame(true);
    setScopeFlag(false);
    setFatalisticOutput(false);
  }

  return (
    <div data-interactive="marriage-synthesis-overview-map" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Marriage synthesis overview</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 700 }}>Turn the whole module into one ordered method</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Move from question parsing to promise, stream verdicts, proposal layers, timing, weighted synthesis, ethical framing, and scope routing.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, PURPLE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(STEPS) as StepId[]).map((id) => (
            <button key={id} type="button" aria-pressed={activeStep === id} onClick={() => setActiveStep(id)} style={buttonStyle(activeStep === id, STEPS[id].color)}>
              {STEPS[id].icon}
              {STEPS[id].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${STEPS[activeStep].color}55`, borderRadius: 8, background: `${STEPS[activeStep].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: STEPS[activeStep].color, fontSize: "1.05rem", fontWeight: 700 }}>{STEPS[activeStep].title}</h3>
          <p style={bodyTextStyle}>{STEPS[activeStep].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Eight-move method map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: confidence.color, fontSize: "1.12rem", fontWeight: 700 }}>{confidence.label}</h3>
            </div>
            <span style={{ color: confidence.color, fontWeight: 700 }}>{confidenceLabel(confidenceMode)}</span>
          </div>
          <SynthesisMapSvg activeStep={activeStep} scopeFlag={scopeFlag} fatalisticOutput={fatalisticOutput || !agencyFrame} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Question type" body={questionMode} color={questionColor(questionMode)} icon={<HelpCircle size={16} />} />
            <MiniFact title="Confidence" body={confidenceMode} color={confidenceMode === "convergent" ? GREEN : confidenceMode === "mixed" ? BLUE : GOLD} icon={<Scale size={16} />} />
            <MiniFact title="Scope" body={scopeFlag ? "route now" : "inside bounds"} color={scopeFlag ? VERMILION : GREEN} icon={<TriangleAlert size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Question router" icon={<HelpCircle size={18} />} color={questionColor(questionMode)}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))", gap: "0.5rem" }}>
              {(["timing", "proposal", "quality"] as QuestionMode[]).map((mode) => (
                <button key={mode} type="button" aria-pressed={questionMode === mode} onClick={() => { setQuestionMode(mode); setCompatibilityNeeded(mode === "proposal"); }} style={stateButtonStyle(questionMode === mode, questionColor(mode))}>
                  <span style={{ fontWeight: 700 }}>{mode}</span>
                  <span>{questionNote(mode)}</span>
                </button>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Method order checks</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={promiseFirst} color={promiseFirst ? GREEN : GOLD} icon={<ShieldCheck size={18} />} title="Promise before timing" body={promiseFirst ? "Natal marriage promise is established first." : "Timing is being attempted too early."} onClick={() => setPromiseFirst((value) => !value)} />
            <Toggle active={streamsWeighted} color={streamsWeighted ? GREEN : GOLD} icon={<Layers3 size={18} />} title="Streams are weighted" body={streamsWeighted ? "Confidence weighting is active." : "Streams are being averaged."} onClick={() => setStreamsWeighted((value) => !value)} />
            <Toggle active={compatibilityNeeded} color={proposalQuestion === compatibilityNeeded ? GREEN : GOLD} icon={<HeartHandshake size={18} />} title="Proposal layer included" body={compatibilityNeeded ? "Compatibility and Manglik checks included." : "Proposal layer is omitted."} onClick={() => setCompatibilityNeeded((value) => !value)} />
            <Toggle active={timingTwoYes} color={timingTwoYes ? GREEN : GOLD} icon={<CalendarClock size={18} />} title="Timing uses two-yes" body={timingTwoYes ? "Dasha, transit, and annual refinement are sequenced." : "Timing confirmation is incomplete."} onClick={() => setTimingTwoYes((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Synthesis and scope</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Panel title="Convergence mode" icon={<GitCompare size={18} />} color={confidenceMode === "convergent" ? GREEN : confidenceMode === "mixed" ? BLUE : GOLD}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(["convergent", "mixed", "divergent"] as ConfidenceMode[]).map((mode) => (
                  <button key={mode} type="button" aria-pressed={confidenceMode === mode} onClick={() => setConfidenceMode(mode)} style={buttonStyle(confidenceMode === mode, mode === "convergent" ? GREEN : mode === "mixed" ? BLUE : GOLD)}>
                    {mode}
                  </button>
                ))}
              </div>
            </Panel>
            <Toggle active={agencyFrame} color={agencyFrame ? GREEN : VERMILION} icon={<BadgeCheck size={18} />} title="Agency frame" body={agencyFrame ? "No fear, no fatalism, no single-number verdict." : "Frame has become deterministic."} onClick={() => setAgencyFrame((value) => !value)} />
            <Toggle active={fatalisticOutput} color={fatalisticOutput ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Fatalistic output" body={fatalisticOutput ? "Error active: repair the verdict language." : "No fatalistic output."} onClick={() => setFatalisticOutput((value) => !value)} />
            <Toggle active={scopeFlag} color={scopeFlag ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Safety/legal/psych flag" body={scopeFlag ? "Route before continuing." : "No scope interruption."} onClick={() => setScopeFlag((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${confidence.color}66`, background: `${confidence.color}10` }}>
        <p style={eyebrowStyle}>Practice statement</p>
        <h3 style={{ margin: "0.15rem 0 0", color: confidence.color, fontSize: "1.12rem", fontWeight: 700 }}>{confidence.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
      </section>
    </div>
  );
}

function SynthesisMapSvg({ activeStep, scopeFlag, fatalisticOutput }: { activeStep: StepId; scopeFlag: boolean; fatalisticOutput: boolean }) {
  const ids = Object.keys(STEPS) as StepId[];
  return (
    <svg viewBox="0 0 820 430" role="img" aria-label="Eight move marriage synthesis method map" style={{ width: "100%", minHeight: 320, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="784" height="394" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="52" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="700">ONE ORDERED FLOW, NOT A PILE OF TECHNIQUES</text>
      {ids.map((id, index) => {
        const row = index < 4 ? 0 : 1;
        const column = index % 4;
        const x = 105 + column * 202;
        const y = row === 0 ? 140 : 280;
        const selected = id === activeStep;
        const color = id === "scope" && scopeFlag ? VERMILION : id === "frame" && fatalisticOutput ? VERMILION : STEPS[id].color;
        const next = ids[index + 1];
        return (
          <g key={id}>
            {next && index !== 3 ? <path d={`M ${x + 54} ${y} L ${x + 148} ${y}`} stroke={color} strokeWidth={selected ? 4 : 2.5} opacity={selected ? 1 : 0.45} /> : null}
            {index === 3 ? <path d={`M ${x} ${y + 54} C ${x} ${y + 98}, ${105} ${y + 98}, ${105} ${y + 86}`} fill="none" stroke={HAIRLINE} strokeWidth="2.5" strokeDasharray="7 7" /> : null}
            <rect x={x - 54} y={y - 38} width="108" height="76" rx="8" fill={OPAQUE_LIGHT_FILL[color]} stroke={color} strokeWidth={selected ? 4 : 2} />
            <text x={x} y={y - 5} textAnchor="middle" fill={color} fontSize="11" fontWeight="700">{index + 1}. {STEPS[id].label}</text>
            <text x={x} y={y + 17} textAnchor="middle" fill={INK_MUTED} fontSize="9.5">{id === "scope" && scopeFlag ? "route" : id === "frame" && fatalisticOutput ? "repair" : "move"}</text>
          </g>
        );
      })}
      <text x="410" y="370" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">Promise first, weigh streams, name divergence, frame with agency, and route what exceeds astrology.</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>{title}</h3>
      </div>
      <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 700 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.65rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color }}>
        {icon}
        <span style={{ fontSize: "0.86rem", fontWeight: 700 }}>{title}</span>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 600,
};

const bodyTextStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.92rem",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.75rem",
    minHeight: 38,
    display: "inline-flex",
    gap: "0.45rem",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
  };
}

function stateButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: active ? color : INK_PRIMARY,
    padding: "0.7rem",
    display: "grid",
    gap: "0.35rem",
    textAlign: "left",
    cursor: "pointer",
    minHeight: 84,
    fontWeight: 400,
  };
}

function questionColor(mode: QuestionMode) {
  if (mode === "timing") return BLUE;
  if (mode === "proposal") return GREEN;
  return PURPLE;
}

function questionNote(mode: QuestionMode) {
  if (mode === "timing") return "Weight timing and two-yes.";
  if (mode === "proposal") return "Add compatibility and dosha.";
  return "Weight quality and support.";
}

function confidenceLabel(mode: ConfidenceMode) {
  if (mode === "convergent") return "convergence";
  if (mode === "mixed") return "mixed support";
  return "named divergence";
}
