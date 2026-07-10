"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  GitBranch,
  ListChecks,
  Lock,
  RotateCcw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import { grahas, ink, streams as learningStreams } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "../lib/layouts";

type StepKey = "route" | "weight" | "classify" | "check" | "resolve" | "rank";
type ResolveMode = "none" | "falseCertainty" | "paralysis" | "actionable";

interface Step {
  key: StepKey;
  label: string;
  verb: string;
  source: string;
  question: string;
  output: string;
  color: string;
  icon: ReactNode;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = ink.goldAccent;
const SHANI = grahas.shani.primary;
const GREEN = learningStreams.tajika.primary;
const BLUE = learningStreams.kp.primary;
const RED = learningStreams["lal-kitab"].primary;
const PURPLE = learningStreams.jaimini.primary;

const STEPS: Step[] = [
  {
    key: "route",
    label: "1. Route",
    verb: "Find native fit",
    source: "Lesson 13.4.2",
    question: "Which stream apparatus is purpose-built for this exact question?",
    output: "Parashara and KP are genuinely comparable on the 7th-house/cusp marriage thread.",
    color: BLUE,
    icon: <Target size={17} />,
  },
  {
    key: "weight",
    label: "2. Weight",
    verb: "Split sub-questions",
    source: "Lesson 13.3.2",
    question: "Does the question bundle several sub-questions that need different stream weights?",
    output: "Whether is KP-weighted; what-is-it-like is Parashara-weighted.",
    color: GOLD,
    icon: <Scale size={17} />,
  },
  {
    key: "classify",
    label: "3. Classify",
    verb: "Type contributions",
    source: "Lessons 13.5.1, 13.5.2, 13.6.1",
    question: "Is each stream verdict-bearing, corroborating, timing-only, or absent?",
    output: "Parashara/KP verdict-bearing; Jaimini/Lal Kitab corroborating; Tajika timing plus partial; Nadi absent.",
    color: PURPLE,
    icon: <ListChecks size={17} />,
  },
  {
    key: "check",
    label: "4. Check",
    verb: "Find denominator",
    source: "Lessons 13.6.1, 13.6.2",
    question: "Among verdict-bearing streams, what is the true denominator and does divergence survive re-examination?",
    output: "True denominator is two; Parashara and KP diverge; re-examination confirms the divergence is real.",
    color: RED,
    icon: <ShieldCheck size={17} />,
  },
  {
    key: "resolve",
    label: "5. Resolve",
    verb: "Frame honestly",
    source: "This lesson §4.4",
    question: "What actionable framing avoids both picking a winner and refusing to say anything useful?",
    output: "Report both findings with weights named; state timing support; name what would sharpen the picture.",
    color: GREEN,
    icon: <GitBranch size={17} />,
  },
  {
    key: "rank",
    label: "6. Rank",
    verb: "Place in statement",
    source: "Lesson 13.6.3",
    question: "What belongs prominently in the client statement versus working notes?",
    output: "The marriage verdict divergence is high-stakes and structurally deep, so it belongs prominently.",
    color: SHANI,
    icon: <BadgeCheck size={17} />,
  },
];

const STEP_ORDER: StepKey[] = STEPS.map((step) => step.key);

export function ConflictResolutionSequenceWalkthrough() {
  const [activeStep, setActiveStep] = useState<StepKey>("route");
  const [completed, setCompleted] = useState<Record<StepKey, boolean>>({
    route: false,
    weight: false,
    classify: false,
    check: false,
    resolve: false,
    rank: false,
  });
  const [attemptJump, setAttemptJump] = useState(false);
  const [resolveMode, setResolveMode] = useState<ResolveMode>("none");

  const activeIndex = STEP_ORDER.indexOf(activeStep);
  const active = STEPS[activeIndex];
  const nextLocked = activeIndex > 0 && !STEP_ORDER.slice(0, activeIndex).every((key) => completed[key]);

  const completedCount = STEP_ORDER.filter((key) => completed[key]).length;

  const resolutionFeedback = useMemo(() => {
    if (resolveMode === "falseCertainty") {
      return { color: RED, title: "False certainty blocked", body: "This quietly picks one stream and hides the real divergence. Step 5 cannot make disagreement disappear." };
    }
    if (resolveMode === "paralysis") {
      return { color: RED, title: "Synthesis-paralysis blocked", body: "This refuses to give a usable framing even though the sequence has produced one." };
    }
    if (resolveMode === "actionable") {
      return { color: GREEN, title: "Resolution accepted", body: "This reports both findings, names timing support, and gives a client something honest to use." };
    }
    return { color: GOLD, title: "Choose a resolution mode", body: "Step 5 tests the middle path between over-certainty and non-commitment." };
  }, [resolveMode]);

  function completeActiveStep() {
    setCompleted((current) => ({ ...current, [activeStep]: true }));
    const next = STEP_ORDER[activeIndex + 1];
    if (next) setActiveStep(next);
  }

  function chooseStep(step: StepKey) {
    const index = STEP_ORDER.indexOf(step);
    const prerequisitesMet = STEP_ORDER.slice(0, index).every((key) => completed[key]);
    if (!prerequisitesMet) {
      setAttemptJump(true);
      setActiveStep(step);
      return;
    }
    setAttemptJump(false);
    setActiveStep(step);
  }

  return (
    <div data-interactive="conflict-resolution-sequence-walkthrough" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY, fontFamily: fontFamilies.body }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Conflict-resolution sequence</p>
            <h2 style={{ margin: "0.22rem 0 0", color: active.color, fontSize: "1.28rem", fontWeight: 600 }}>
              Route, weight, classify, check, resolve, rank
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Walk the six rules in order on Chart MD1&apos;s marriage question, then test what Step 5 means by an honest resolution.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveStep("route");
              setCompleted({ route: false, weight: false, classify: false, check: false, resolve: false, rank: false });
              setAttemptJump(false);
              setResolveMode("none");
            }}
            style={softButtonStyle}
          >
            <RotateCcw size={16} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 540px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Ordered procedure</p>
              <h3 style={{ margin: "0.16rem 0 0", color: active.color, fontSize: "1.1rem", fontWeight: 600 }}>{active.label}: {active.verb}</h3>
            </div>
            <span style={pillStyle(nextLocked || attemptJump ? RED : active.color)}>
              {nextLocked || attemptJump ? <Lock size={15} aria-hidden="true" /> : <CheckCircle2 size={15} aria-hidden="true" />}
              {completedCount} of 6 complete
            </span>
          </div>

          <SequenceSvg activeStep={activeStep} completed={completed} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 155px), 1fr))", gap: "0.55rem", marginTop: "0.85rem" }}>
            {STEPS.map((step) => (
              <button key={step.key} type="button" onClick={() => chooseStep(step.key)} aria-pressed={activeStep === step.key} style={stepCardStyle(activeStep === step.key, completed[step.key], step.color)}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.36rem", color: step.color, fontWeight: 600 }}>{step.icon}{step.label}</span>
                <small style={{ color: INK_SECONDARY }}>{step.verb}</small>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.8rem", flex: "1 1 310px" }}>
          <Panel title="Current step" icon={active.icon} color={active.color}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{active.question}</p>
            <p style={{ ...bodyTextStyle, color: INK_PRIMARY }}>{active.output}</p>
            <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, fontSize: "0.84rem" }}>{active.source}</p>
            <button type="button" onClick={completeActiveStep} style={{ ...toggleButtonStyle(false, active.color), marginTop: "0.75rem" }}>
              Mark step complete
            </button>
          </Panel>

          <Panel title="Order guard" icon={<AlertTriangle size={18} />} color={nextLocked || attemptJump ? RED : GREEN}>
            <p style={bodyTextStyle}>
              {nextLocked || attemptJump
                ? "Run the earlier steps first. Each step's output is the next step's required input."
                : "The sequence is currently in usable order. Familiar charts still get every step confirmed."}
            </p>
            <button type="button" onClick={() => chooseStep("check")} style={toggleButtonStyle(attemptJump, RED)}>
              Try jumping to Check
            </button>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Matrix cells touched</p>
          <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.75rem" }}>
            <MatrixTouch title="Route + Weight" body="7th house and 7th cusp are comparable, but the whether and quality sub-questions receive different weights." color={activeStep === "route" || activeStep === "weight" ? BLUE : GOLD} active={activeStep === "route" || activeStep === "weight"} />
            <MatrixTouch title="Classify" body="Parashara/KP verdict-bearing; Jaimini/Lal Kitab corroborating; Tajika timing-only plus partial substrate; Nadi absent." color={PURPLE} active={activeStep === "classify"} />
            <MatrixTouch title="Check" body="True verdict denominator is two. The divergence survives re-examination." color={RED} active={activeStep === "check"} />
            <MatrixTouch title="Resolve + Rank" body="Report the two-part finding prominently, with timing support and the sharpening lever named." color={GREEN} active={activeStep === "resolve" || activeStep === "rank"} />
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: resolutionFeedback.color }}>
          <p style={eyebrowStyle}>Resolve tester</p>
          <h3 style={{ margin: "0.2rem 0 0", color: resolutionFeedback.color, fontSize: "1.08rem", fontWeight: 600 }}>{resolutionFeedback.title}</h3>
          <p style={bodyTextStyle}>{resolutionFeedback.body}</p>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button type="button" aria-pressed={resolveMode === "falseCertainty"} onClick={() => setResolveMode("falseCertainty")} style={choiceStyle(resolveMode === "falseCertainty", RED)}>
              Pick KP and hide Parashara
            </button>
            <button type="button" aria-pressed={resolveMode === "paralysis"} onClick={() => setResolveMode("paralysis")} style={choiceStyle(resolveMode === "paralysis", RED)}>
              Refuse to make any statement
            </button>
            <button type="button" aria-pressed={resolveMode === "actionable"} onClick={() => setResolveMode("actionable")} style={choiceStyle(resolveMode === "actionable", GREEN)}>
              Two-part actionable framing
            </button>
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: completed.rank && resolveMode === "actionable" ? GREEN : HAIRLINE }}>
        <div style={{ display: "flex", gap: "0.7rem", alignItems: "start" }}>
          <span style={{ color: completed.rank && resolveMode === "actionable" ? GREEN : GOLD, marginTop: "0.1rem" }}>
            {completed.rank && resolveMode === "actionable" ? <BadgeCheck size={20} /> : <SlidersHorizontal size={20} />}
          </span>
          <div>
            <p style={eyebrowStyle}>Accepted synthesis frame</p>
            <p style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, lineHeight: 1.58 }}>
              Chart MD1 shows a real Saturn thread: KP gives a clean yes to the whether-question, while Parashara keeps the promise weak-to-moderate in strength. The current period is worth watching because the dasha onset and annual chart converge in 2026, but the statement should not collapse the divergence into a single unqualified tier.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SequenceSvg({ activeStep, completed }: { activeStep: StepKey; completed: Record<StepKey, boolean> }) {
  return (
    <svg viewBox="0 0 660 220" role="img" aria-label="Six step conflict resolution sequence" style={{ width: "100%", minHeight: 210, display: "block", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="644" height="204" rx="8" fill="rgba(255,255,255,0.22)" stroke={HAIRLINE} />
      <line x1="82" y1="110" x2="578" y2="110" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />
      {STEPS.map((step, index) => {
        const x = 82 + index * 99;
        const active = step.key === activeStep;
        const done = completed[step.key];
        return (
          <g key={step.key}>
            {index < STEPS.length - 1 ? <line x1={x + 24} y1="110" x2={x + 75} y2="110" stroke={completed[step.key] ? step.color : HAIRLINE} strokeWidth="5" strokeLinecap="round" /> : null}
            <circle cx={x} cy="110" r={active ? 31 : 25} fill="var(--gl-card-surface-solid)" stroke={active || done ? step.color : HAIRLINE} strokeWidth={active ? 3 : 2} />
            <text x={x} y="105" textAnchor="middle" fill={active || done ? step.color : INK_MUTED} fontSize="10" fontWeight="500">{index + 1}</text>
            <text x={x} y="121" textAnchor="middle" fill={active || done ? step.color : INK_SECONDARY} fontSize="9">{done ? "done" : step.key}</text>
            <text x={x} y="158" textAnchor="middle" fill={active ? step.color : INK_MUTED} fontSize="10">{step.verb}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}55`, borderRadius: 8, background: SURFACE, padding: "0.95rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.72rem" }}>{children}</div>
    </section>
  );
}

function MatrixTouch({ title, body, color, active }: { title: string; body: string; color: string; active: boolean }) {
  return (
    <div style={{ border: `1px solid ${active ? color : HAIRLINE}`, borderLeft: `4px solid ${color}`, borderRadius: 8, padding: "0.7rem", background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "rgba(255,255,255,0.2)" }}>
      <div style={{ color, fontWeight: 600 }}>{title}</div>
      <p style={{ margin: "0.34rem 0 0", color: INK_SECONDARY, lineHeight: 1.42 }}>{body}</p>
    </div>
  );
}

function pillStyle(color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${color}`,
    borderRadius: 999,
    padding: "0.4rem 0.62rem",
    color,
    background: `color-mix(in srgb, ${color} 8%, transparent)`,
    fontSize: "0.78rem",
    fontWeight: 500,
  };
}

function stepCardStyle(active: boolean, done: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    border: `1px solid ${active || done ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "rgba(255,255,255,0.22)",
    color: active || done ? color : INK_SECONDARY,
    padding: "0.62rem",
    display: "grid",
    gap: "0.24rem",
    textAlign: "left",
  };
}

function choiceStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.68rem",
    textAlign: "left",
    fontWeight: 500,
  };
}

function toggleButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    width: "100%",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.68rem",
    fontWeight: 500,
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  fontSize: "0.72rem",
  fontWeight: 500,
};

const bodyTextStyle: CSSProperties = {
  margin: "0.58rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const buttonResetStyle: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
};

const softButtonStyle: CSSProperties = {
  ...buttonResetStyle,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_SECONDARY,
  padding: "0.54rem 0.72rem",
  fontWeight: 500,
};
