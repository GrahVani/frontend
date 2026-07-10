"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CalendarClock, GitCompare, HeartHandshake, HelpCircle, Layers3, RotateCcw, Scale, ShieldCheck, TriangleAlert } from "lucide-react";
import { workbenchTwoColumnStyle, workbenchDiagramLayoutStyle } from "../lib/layouts";

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

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Eight-move method map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: confidence.color, fontSize: "1.12rem", fontWeight: 700 }}>{confidence.label}</h3>
            </div>
            <span style={{ color: confidence.color, fontWeight: 700 }}>{confidenceLabel(confidenceMode)}</span>
          </div>
          <SynthesisMapSvg
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            scopeFlag={scopeFlag}
            fatalisticOutput={fatalisticOutput || !agencyFrame}
            promiseFirst={promiseFirst}
            streamsWeighted={streamsWeighted}
            compatibilityNeeded={compatibilityNeeded}
            timingTwoYes={timingTwoYes}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Question type" body={questionMode} color={questionColor(questionMode)} icon={<HelpCircle size={16} />} />
            <MiniFact title="Confidence" body={confidenceMode} color={confidenceMode === "convergent" ? GREEN : confidenceMode === "mixed" ? BLUE : GOLD} icon={<Scale size={16} />} />
            <MiniFact title="Scope" body={scopeFlag ? "route now" : "inside bounds"} color={scopeFlag ? VERMILION : GREEN} icon={<TriangleAlert size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
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

      <div style={workbenchTwoColumnStyle}>
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

interface SynthesisMapSvgProps {
  activeStep: StepId;
  setActiveStep: (step: StepId) => void;
  scopeFlag: boolean;
  fatalisticOutput: boolean;
  promiseFirst: boolean;
  streamsWeighted: boolean;
  compatibilityNeeded: boolean;
  timingTwoYes: boolean;
}

function SynthesisMapSvg({
  activeStep,
  setActiveStep,
  scopeFlag,
  fatalisticOutput,
  promiseFirst,
  streamsWeighted,
  compatibilityNeeded,
  timingTwoYes,
}: SynthesisMapSvgProps) {
  const [hoveredNode, setHoveredNode] = useState<StepId | null>(null);

  const cx = 410;
  const cy = 240;

  const outerSteps: {
    id: StepId;
    cx: number;
    cy: number;
    textX: number;
    textY: number;
    textAnchor: "start" | "end" | "middle";
    label: string;
    sub: string;
    color: string;
  }[] = [
    { id: "question", cx: 410, cy: 80, textX: 410, textY: 42, textAnchor: "middle", label: "1. Question", sub: "Parse query type", color: BLUE },
    { id: "promise", cx: 549, cy: 160, textX: 580, textY: 158, textAnchor: "start", label: "2. Promise", sub: "Natal potential", color: PURPLE },
    { id: "streams", cx: 549, cy: 320, textX: 580, textY: 318, textAnchor: "start", label: "3. Streams", sub: "Weigh 4 streams", color: GOLD },
    { id: "compatibility", cx: 410, cy: 400, textX: 410, textY: 438, textAnchor: "middle", label: "4. Proposal", sub: "Match & Dosha", color: GREEN },
    { id: "timing", cx: 271, cy: 320, textX: 238, textY: 318, textAnchor: "end", label: "5. Timing", sub: "Dasha & Gochara", color: BLUE },
    { id: "scope", cx: 271, cy: 160, textX: 238, textY: 158, textAnchor: "end", label: "8. Scope", sub: "Safety checks", color: VERMILION },
  ];

  // Colors for Core Hub
  const synthesisColor = PURPLE;
  const frameColor = fatalisticOutput ? VERMILION : GREEN;

  return (
    <svg
      viewBox="0 0 820 480"
      role="img"
      aria-label="Eight-move Vedic Synthesis Mandala Map"
      style={{ width: "100%", minHeight: 380, margin: "0.5rem 0" }}
    >
      <style>{`
        .mandala-node-group {
          cursor: pointer;
          transition: filter 0.25s ease;
        }
        .pulse-warning {
          animation: warning-pulse 2s infinite ease-in-out;
          transform-origin: 410px 240px;
        }
        @keyframes warning-pulse {
          0% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.03); opacity: 0.6; }
          100% { transform: scale(1); opacity: 0.25; }
        }
        .pulse-scope {
          animation: scope-pulse 1.8s infinite ease-in-out;
          transform-origin: 271px 160px;
        }
        @keyframes scope-pulse {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.4; }
        }
      `}</style>

      <defs>
        {/* Glow Filters */}
        <filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#356CAB" floodOpacity="0.65" />
        </filter>
        <filter id="glow-purple" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#6B5AA8" floodOpacity="0.65" />
        </filter>
        <filter id="glow-gold" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#B88421" floodOpacity="0.65" />
        </filter>
        <filter id="glow-green" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#2F7D55" floodOpacity="0.65" />
        </filter>
        <filter id="glow-vermilion" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#A23A1E" floodOpacity="0.85" />
        </filter>

        {/* Planet Radial Gradients (Normal state) */}
        <radialGradient id="grad-blue" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F0F4FA" />
          <stop offset="40%" stopColor="#7DA4D1" />
          <stop offset="100%" stopColor="#356CAB" />
        </radialGradient>
        <radialGradient id="grad-purple" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F6F4FA" />
          <stop offset="40%" stopColor="#9C8ECB" />
          <stop offset="100%" stopColor="#6B5AA8" />
        </radialGradient>
        <radialGradient id="grad-gold" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FDFBF7" />
          <stop offset="40%" stopColor="#DCB86A" />
          <stop offset="100%" stopColor="#B88421" />
        </radialGradient>
        <radialGradient id="grad-green" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F4FAF6" />
          <stop offset="40%" stopColor="#66B386" />
          <stop offset="100%" stopColor="#2F7D55" />
        </radialGradient>
        <radialGradient id="grad-vermilion" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FAF5F4" />
          <stop offset="40%" stopColor="#CC7B66" />
          <stop offset="100%" stopColor="#A23A1E" />
        </radialGradient>

        {/* Active Node Gradients */}
        <radialGradient id="grad-blue-active" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#AECBEF" />
          <stop offset="70%" stopColor="#356CAB" />
          <stop offset="100%" stopColor="#1E4472" />
        </radialGradient>
        <radialGradient id="grad-purple-active" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#C9BFE9" />
          <stop offset="70%" stopColor="#6B5AA8" />
          <stop offset="100%" stopColor="#413470" />
        </radialGradient>
        <radialGradient id="grad-gold-active" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#EED9AC" />
          <stop offset="70%" stopColor="#B88421" />
          <stop offset="100%" stopColor="#7E5811" />
        </radialGradient>
        <radialGradient id="grad-green-active" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#9CD5B4" />
          <stop offset="70%" stopColor="#2F7D55" />
          <stop offset="100%" stopColor="#194B31" />
        </radialGradient>
        <radialGradient id="grad-vermilion-active" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#EDBAB0" />
          <stop offset="70%" stopColor="#A23A1E" />
          <stop offset="100%" stopColor="#691F0B" />
        </radialGradient>

        {/* Synthesis Hub Gradients */}
        <radialGradient id="synthesisGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F9F6FF" />
          <stop offset="60%" stopColor="#D4C8FA" />
          <stop offset="100%" stopColor="#8A75D3" />
        </radialGradient>
        <radialGradient id="synthesisGradActive" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#BBA9FF" />
          <stop offset="80%" stopColor="#6C53C7" />
          <stop offset="100%" stopColor="#3C2A8A" />
        </radialGradient>
      </defs>

      {/* Card Border & Faint Grid Background */}
      <rect x="18" y="18" width="784" height="444" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      
      {/* Astrological Chart Geometrical Division Lines (Faint aspect grid) */}
      <line x1={cx - 190} y1={cy} x2={cx + 190} y2={cy} stroke={GOLD} strokeWidth="0.8" opacity="0.12" />
      <line x1={cx} y1={cy - 190} x2={cx} y2={cy + 190} stroke={GOLD} strokeWidth="0.8" opacity="0.12" />
      <line x1={cx - 134} y1={cy - 134} x2={cx + 134} y2={cy + 134} stroke={GOLD} strokeWidth="0.8" opacity="0.08" />
      <line x1={cx - 134} y1={cy + 134} x2={cx + 134} y2={cy - 134} stroke={GOLD} strokeWidth="0.8" opacity="0.08" />

      {/* Faint Starry Details for Vedic Aesthetic */}
      <path d="M 300 100 L 302 105 L 307 107 L 302 109 L 300 114 L 298 109 L 293 107 L 298 105 Z" fill={GOLD} opacity="0.25" />
      <path d="M 520 100 L 522 105 L 527 107 L 522 109 L 520 114 L 518 109 L 513 107 L 518 105 Z" fill={GOLD} opacity="0.25" />
      <path d="M 520 380 L 522 385 L 527 387 L 522 389 L 520 394 L 518 389 L 513 387 L 518 385 Z" fill={GOLD} opacity="0.25" />
      <path d="M 300 380 L 302 385 L 307 387 L 302 389 L 300 394 L 298 389 L 293 387 L 298 385 Z" fill={GOLD} opacity="0.25" />

      {/* Orbit Rings */}
      <circle cx={cx} cy={cy} r={160} fill="none" stroke={HAIRLINE} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.25" />
      <circle cx={cx} cy={cy} r={120} fill="none" stroke={HAIRLINE} strokeWidth="1" strokeDasharray="4 6" opacity="0.15" />

      {/* Chart Title */}
      <text x="410" y="48" textAnchor="middle" fill={GOLD} fontSize="11" fontWeight="700" letterSpacing="0.1em">
        VEDIC SYNTHESIS MANDALA
      </text>

      {/* Sequential Flow Paths (Outer Rings) */}
      <g>
        {/* Arc 1 -> 2 (Question to Promise) */}
        <path d="M 410 80 A 160 160 0 0 1 549 160" fill="none" stroke={BLUE} strokeWidth={activeStep === 'question' ? 4.5 : 2} opacity={activeStep === 'question' ? 0.9 : 0.4} filter={activeStep === 'question' ? "url(#glow-blue)" : ""} />
        {/* Arc 2 -> 3 (Promise to Streams) */}
        <path d="M 549 160 A 160 160 0 0 1 549 320" fill="none" stroke={PURPLE} strokeWidth={activeStep === 'promise' ? 4.5 : 2} opacity={activeStep === 'promise' ? 0.9 : 0.4} filter={activeStep === 'promise' ? "url(#glow-purple)" : ""} />
        {/* Arc 3 -> 4 (Streams to Proposal) */}
        <path d="M 549 320 A 160 160 0 0 1 410 400" fill="none" stroke={GOLD} strokeWidth={activeStep === 'streams' ? 4.5 : 2} opacity={activeStep === 'streams' ? 0.9 : 0.4} filter={activeStep === 'streams' ? "url(#glow-gold)" : ""} />
        {/* Arc 4 -> 5 (Proposal to Timing) */}
        <path d="M 410 400 A 160 160 0 0 1 271 320" fill="none" stroke={GREEN} strokeWidth={activeStep === 'compatibility' ? 4.5 : 2} opacity={activeStep === 'compatibility' ? 0.9 : 0.4} filter={activeStep === 'compatibility' ? "url(#glow-green)" : ""} />
        {/* Arc 5 -> 8 (Timing to Scope) */}
        <path d="M 271 320 A 160 160 0 0 1 271 160" fill="none" stroke={BLUE} strokeWidth={activeStep === 'timing' ? 4.5 : 1.5} opacity={activeStep === 'timing' ? 0.8 : 0.3} />
        {/* Arc 8 -> 1 (Scope to Question) */}
        <path d="M 271 160 A 160 160 0 0 1 410 80" fill="none" stroke={VERMILION} strokeWidth={activeStep === 'scope' ? 4.5 : 2} opacity={activeStep === 'scope' ? 0.9 : 0.4} filter={activeStep === 'scope' ? "url(#glow-vermilion)" : ""} />
      </g>

      {/* Dynamic Analytical Connections (Inward Flows) */}
      <g>
        {/* 1. Streams to Synthesis Core */}
        <line 
          x1={549} y1={320} x2={410 + 64 * Math.cos(Math.PI / 6)} y2={240 + 64 * Math.sin(Math.PI / 6)}
          stroke={GOLD} 
          strokeWidth={streamsWeighted ? 3.5 : 1.5} 
          strokeDasharray={streamsWeighted ? "none" : "4 4"}
          opacity={streamsWeighted ? 0.9 : 0.5} 
        />
        {!streamsWeighted && (
          <g transform="translate(508, 296) rotate(30)">
            <rect x="-24" y="-7" width="48" height="14" rx="2" fill="#FAF3E0" stroke={GOLD} strokeWidth="0.5" />
            <text x="0" y="3" fill={GOLD} fontSize="7" fontWeight="700" textAnchor="middle">AVERAGED</text>
          </g>
        )}

        {/* 2. Proposal to Synthesis Core */}
        <line 
          x1={410} y1={400} x2={410} y2={240 + 74}
          stroke={GREEN} 
          strokeWidth={compatibilityNeeded ? 3.5 : 1} 
          strokeDasharray={compatibilityNeeded ? "none" : "3 3"}
          opacity={compatibilityNeeded ? 0.9 : 0.4} 
        />

        {/* 3. Timing to Synthesis Core */}
        <line 
          x1={271} y1={320} x2={410 - 64 * Math.cos(Math.PI / 6)} y2={240 + 64 * Math.sin(Math.PI / 6)}
          stroke={BLUE} 
          strokeWidth={timingTwoYes ? 3.5 : 1.5} 
          strokeDasharray={timingTwoYes ? "none" : "4 4"}
          opacity={timingTwoYes ? 0.9 : 0.5} 
        />
        {!timingTwoYes && (
          <g transform="translate(312, 296) rotate(-30)">
            <rect x="-30" y="-7" width="60" height="14" rx="2" fill="#E8EEF5" stroke={BLUE} strokeWidth="0.5" />
            <text x="0" y="3" fill={BLUE} fontSize="7" fontWeight="700" textAnchor="middle">NO TRANSIT</text>
          </g>
        )}

        {/* 4. Scope Interruptor Line */}
        <line 
          x1={271} y1={160} x2={410 - 64 * Math.cos(Math.PI / 6)} y2={240 - 64 * Math.sin(Math.PI / 6)}
          stroke={VERMILION} 
          strokeWidth={scopeFlag ? 4.5 : 1} 
          strokeDasharray={scopeFlag ? "none" : "5 5"}
          opacity={scopeFlag ? 1 : 0.25} 
        />
      </g>

      {/* Promise to Timing Wide Aspect Arch (Sequential Check) */}
      <g>
        <path 
          d="M 549 160 A 175 175 0 0 1 271 320" 
          fill="none" 
          stroke={promiseFirst ? "#319795" : VERMILION} 
          strokeWidth={promiseFirst ? 2 : 4} 
          strokeDasharray={promiseFirst ? "4 4" : "none"} 
          opacity={promiseFirst ? 0.8 : 0.95} 
        />
        {!promiseFirst && (
          <g transform="translate(467, 338)">
            <filter id="badge-shadow">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.25" />
            </filter>
            <rect x="-44" y="-10" width="88" height="20" rx="4" fill={VERMILION} stroke="#FDFBF7" strokeWidth="1.2" filter="url(#badge-shadow)" />
            <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700">PROMISE MISSING</text>
          </g>
        )}
      </g>

      {/* CENTRAL CORE: Synthesis & Counseling Frame */}
      <g>
        {/* Fatalistic Pulsing Ring */}
        {fatalisticOutput && (
          <circle cx={cx} cy={cy} r={60} fill="none" stroke={VERMILION} strokeWidth="26" className="pulse-warning" />
        )}

        {/* Scope Interruption Shield Block */}
        {scopeFlag && (
          <>
            <circle cx={cx} cy={cy} r={82} fill="none" stroke={VERMILION} strokeWidth="6" strokeDasharray="6 3" filter="url(#glow-vermilion)" />
            <g transform="translate(410, 142)">
              <rect x="-45" y="-10" width="90" height="20" rx="4" fill={VERMILION} stroke="#FDFBF7" strokeWidth="1" />
              <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="800" letterSpacing="0.05em">CRITICAL ROUTE</text>
            </g>
          </>
        )}

        {/* STEP 7: Frame Ring */}
        <g
          className="mandala-node-center"
          onClick={() => setActiveStep("frame")}
          onMouseEnter={() => setHoveredNode("frame")}
          onMouseLeave={() => setHoveredNode(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Active Highlight Border */}
          <circle 
            cx={cx} 
            cy={cy} 
            r={60} 
            fill="none" 
            stroke={activeStep === 'frame' ? (fatalisticOutput ? VERMILION : GREEN) : "transparent"} 
            strokeWidth={activeStep === 'frame' ? 28 : 0} 
            opacity={0.25}
          />
          {/* Main Frame Ring */}
          <circle 
            cx={cx} 
            cy={cy} 
            r={60} 
            fill="none" 
            stroke={frameColor} 
            strokeWidth={activeStep === 'frame' ? 24 : 18} 
            opacity={activeStep === 'frame' ? 1 : 0.8}
            style={{ transition: "stroke-width 0.2s, opacity 0.2s" }}
            filter={activeStep === 'frame' ? (fatalisticOutput ? "url(#glow-vermilion)" : "url(#glow-green)") : ""}
          />
          {/* Frame Ring Text */}
          <text 
            x={cx} 
            y={cy - 57} 
            textAnchor="middle" 
            fill="#FFFFFF" 
            fontSize="9" 
            fontWeight="800"
            style={{ pointerEvents: "none" }}
          >
            7. FRAME
          </text>
        </g>

        {/* STEP 6: Synthesis Center Sphere (The core Bindu) */}
        <g
          className="mandala-node-center"
          onClick={() => setActiveStep("synthesise")}
          onMouseEnter={() => setHoveredNode("synthesise")}
          onMouseLeave={() => setHoveredNode(null)}
          style={{ cursor: "pointer" }}
        >
          <circle 
            cx={cx} 
            cy={cy} 
            r={36} 
            fill={activeStep === 'synthesise' ? "url(#synthesisGradActive)" : "url(#synthesisGrad)"} 
            stroke={synthesisColor} 
            strokeWidth={activeStep === 'synthesise' ? 3 : 1.5} 
            filter={activeStep === 'synthesise' ? "url(#glow-purple)" : ""}
            style={{ transition: "stroke-width 0.2s, fill 0.2s" }}
          />
          <text 
            x={cx} 
            y={cy - 2} 
            textAnchor="middle" 
            fill={activeStep === 'synthesise' ? "#1E1B4B" : "#4A3E7D"} 
            fontSize="10" 
            fontWeight="800"
            style={{ pointerEvents: "none" }}
          >
            6. FUSION
          </text>
          <text 
            x={cx} 
            y={cy + 10} 
            textAnchor="middle" 
            fill={activeStep === 'synthesise' ? "#312E81" : "#5C4E9C"} 
            fontSize="8.5" 
            fontWeight="600"
            style={{ pointerEvents: "none" }}
          >
            Synthesis
          </text>
        </g>
      </g>

      {/* OUTER STATIONS (6 Nodes) */}
      <g>
        {outerSteps.map((node) => {
          const active = activeStep === node.id;
          const isHovered = hoveredNode === node.id;
          const scale = isHovered ? 1.08 : 1;
          const transformStr = `translate(${node.cx}, ${node.cy}) scale(${scale}) translate(${-node.cx}, ${-node.cy})`;
          
          let fillVal = `url(#grad-${node.id === "compatibility" ? "green" : node.id === "scope" ? "vermilion" : node.id === "streams" ? "gold" : node.id === "question" ? "blue" : node.id === "promise" ? "purple" : "blue"})`;
          if (active) {
            fillVal = `url(#grad-${node.id === "compatibility" ? "green" : node.id === "scope" ? "vermilion" : node.id === "streams" ? "gold" : node.id === "question" ? "blue" : node.id === "promise" ? "purple" : "blue"}-active)`;
          }

          let strokeColor = node.color;
          if (node.id === "scope" && scopeFlag) {
            strokeColor = VERMILION;
          }

          const hasGlow = active ? `url(#glow-${node.id === "compatibility" ? "green" : node.id === "scope" ? "vermilion" : node.id === "streams" ? "gold" : node.id === "question" ? "blue" : node.id === "promise" ? "purple" : "blue"})` : "";

          return (
            <g 
              key={node.id} 
              className={`mandala-node-group ${node.id === "scope" && scopeFlag ? "pulse-scope" : ""}`}
              onClick={() => setActiveStep(node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              transform={transformStr}
              style={{ transition: "transform 0.15s ease" }}
            >
              {/* Generous Hit-Detector Circle */}
              <circle cx={node.cx} cy={node.cy} r={32} fill="transparent" />

              {/* Main Sphere Node */}
              <circle 
                cx={node.cx} 
                cy={node.cy} 
                r={22} 
                fill={fillVal} 
                stroke={strokeColor} 
                strokeWidth={active ? 3.5 : 1.5}
                filter={hasGlow}
                style={{ transition: "stroke-width 0.2s, stroke 0.2s" }}
              />

              {/* Lucide Icon via foreignObject */}
              <foreignObject 
                x={node.cx - 9} 
                y={node.cy - 9} 
                width={18} 
                height={18} 
                style={{ pointerEvents: "none" }}
              >
                <div style={{ 
                  color: active ? "#0F172A" : node.color, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  width: "100%",
                  height: "100%"
                }}>
                  {STEPS[node.id].icon}
                </div>
              </foreignObject>

              {/* Node Labels */}
              <g style={{ pointerEvents: "none" }}>
                <text 
                  x={node.textX} 
                  y={node.textY} 
                  textAnchor={node.textAnchor} 
                  fill={active ? strokeColor : INK_PRIMARY} 
                  fontSize="11.5" 
                  fontWeight="700"
                >
                  {node.label}
                </text>
                <text 
                  x={node.textX} 
                  y={node.textY + 12} 
                  textAnchor={node.textAnchor} 
                  fill={active ? `${strokeColor}bb` : INK_MUTED} 
                  fontSize="9.2"
                >
                  {node.sub}
                </text>
              </g>
            </g>
          );
        })}
      </g>
      
      {/* Central Guide Footer Text inside the SVG */}
      <text x="410" y="450" textAnchor="middle" fill={INK_MUTED} fontSize="11" style={{ letterSpacing: "0.02em" }}>
        {scopeFlag 
          ? "CRITICAL HALT: Ethical routing triggered. Pausing astrological workflow."
          : fatalisticOutput 
            ? "WARNING: deterministic decree active. Repair the frame to open counseling channels."
            : "Question → Promise → Streams → Proposal → Timing → Fusion core. Tap nodes to explore."
        }
      </text>
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
