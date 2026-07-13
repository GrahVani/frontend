"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  RefreshCw,
  RotateCcw,
  Sun,
  User,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type StepKey = 1 | 2 | 3 | 4 | 5 | 6;
type ConclusionKey = "afflicted" | "neutral" | "triumph";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_SHORT = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
const SIGN_COLORS = [
  "#A23A1E", "#B88421", "#2F7D55", "#356CAB", "#A23A1E", "#B88421",
  "#2F7D55", "#356CAB", "#A23A1E", "#B88421", "#2F7D55", "#356CAB",
];

const CHANDRA_LAGNA = 10; // Aquarius
const NINTH_HOUSE = 6; // Libra
const ANSH_LAGNA = 6; // Libra

const STEPS = [
  { key: 1, title: "Count the 9th house", color: BLUE },
  { key: 2, title: "Identify the occupant", color: VERMILION },
  { key: 3, title: "Karaka-bhava convergence", color: PURPLE },
  { key: 4, title: "Cross-reference Ansh", color: BLUE },
  { key: 5, title: "Neecha-bhaṅga check", color: GREEN },
  { key: 6, title: "State the finding", color: ACCENT },
];

export function NinthFromChildPaternalRegisterWorkbench() {
  const [step, setStep] = useState<StepKey>(1);
  const [countIndex, setCountIndex] = useState(0);
  const [showKarakaAmplification, setShowKarakaAmplification] = useState(false);
  const [condition1, setCondition1] = useState(false);
  const [condition2, setCondition2] = useState(false);
  const [conclusion, setConclusion] = useState<ConclusionKey | null>(null);

  const reset = () => {
    setStep(1);
    setCountIndex(0);
    setShowKarakaAmplification(false);
    setCondition1(false);
    setCondition2(false);
    setConclusion(null);
  };

  const canAdvance = () => {
    if (step === 1) return countIndex === 8;
    if (step === 2) return true;
    if (step === 3) return showKarakaAmplification;
    if (step === 4) return true;
    if (step === 5) return condition1 && condition2;
    if (step === 6) return conclusion !== null;
    return true;
  };

  const advance = () => {
    if (step < 6) setStep((s) => (s + 1) as StepKey);
  };

  const back = () => {
    if (step > 1) setStep((s) => (s - 1) as StepKey);
  };

  return (
    <div data-interactive="ninth-from-child-paternal-register-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>9th-from-child paternal register</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 500 }}>
              Read the child&apos;s own chart for the child&apos;s own father
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Step from Chandra&apos;s Lagna to his 9th house, identify the debilitated occupant, and apply neecha-bhaṅga honestly.
            </p>
          </div>
          <button type="button" onClick={reset} style={softButtonStyle}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Progress</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.75rem" }}>
          {STEPS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStep(s.key as StepKey)}
              style={stepChipStyle(step === s.key, step >= s.key, s.color)}
            >
              {s.key}. {s.title}
            </button>
          ))}
        </div>
      </section>

      {step === 1 ? <StepOneCount countIndex={countIndex} setCountIndex={setCountIndex} /> : null}
      {step === 2 ? <StepTwoOccupant /> : null}
      {step === 3 ? <StepThreeKaraka active={showKarakaAmplification} setActive={setShowKarakaAmplification} /> : null}
      {step === 4 ? <StepFourCrossReference /> : null}
      {step === 5 ? (
        <StepFiveNeechaBhanga
          condition1={condition1}
          setCondition1={setCondition1}
          condition2={condition2}
          setCondition2={setCondition2}
        />
      ) : null}
      {step === 6 ? <StepSixConclusion conclusion={conclusion} setConclusion={setConclusion} /> : null}

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <button type="button" onClick={back} disabled={step === 1} style={{ ...softButtonStyle, opacity: step === 1 ? 0.5 : 1 }}>
            <ChevronLeft size={16} />
            Back
          </button>
          <button type="button" onClick={advance} disabled={!canAdvance()} style={primaryButtonStyle(canAdvance())}>
            {step === 6 ? "Finish" : "Next step"}
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}

function StepOneCount({ countIndex, setCountIndex }: { countIndex: number; setCountIndex: (n: number) => void }) {
  const lagna = CHANDRA_LAGNA;
  const reachedSign = (lagna + countIndex) % 12;

  return (
    <div style={workbenchDiagramLayoutStyle}>
      <section style={{ ...cardStyle, flex: "2 1 460px" }}>
        <p style={eyebrowStyle}>Step 1 — count the 9th house from Chandra&apos;s Lagna</p>
        <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.15rem", fontWeight: 500 }}>
          {countIndex === 8 ? `Reached: ${SIGNS[NINTH_HOUSE]}` : `Counting ${countIndex} house${countIndex === 1 ? "" : "s"} forward`}
        </h3>
        <ZodiacStepWheel lagna={lagna} current={reachedSign} target={NINTH_HOUSE} />
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button type="button" onClick={() => setCountIndex(Math.max(0, countIndex - 1))} disabled={countIndex === 0} style={softButtonStyle}>
            <ChevronLeft size={16} /> Back one
          </button>
          <button type="button" onClick={() => setCountIndex(Math.min(8, countIndex + 1))} disabled={countIndex === 8} style={softButtonStyle}>
            Forward one <ChevronRight size={16} />
          </button>
        </div>
      </section>
      <section style={{ ...cardStyle, flex: "1 1 280px" }}>
        <MiniFact icon={<User size={16} />} title="Chandra's Lagna" body={SIGNS[CHANDRA_LAGNA]} color={BLUE} />
        <div style={{ marginTop: "0.75rem" }}>
          <MiniFact icon={<GraduationCap size={16} />} title="9th house" body={countIndex === 8 ? SIGNS[NINTH_HOUSE] : "?"} color={countIndex === 8 ? GREEN : INK_MUTED} />
        </div>
        <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Count whole signs forward from Aquarius. The 9th sign is Libra.
        </p>
      </section>
    </div>
  );
}

function StepTwoOccupant() {
  return (
    <div style={workbenchTwoColumnStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Step 2 — identify the occupant</p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${VERMILION}22`, border: `2px solid ${VERMILION}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sun size={28} color={VERMILION} />
          </div>
          <div>
            <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500 }}>Sun in Libra</p>
            <p style={{ margin: "0.2rem 0 0", color: VERMILION, fontWeight: 500 }}>Debilitated</p>
          </div>
        </div>
        <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          The Sun is the natural father-karaka. Here it sits in the 9th house of father in its own sign of debilitation — a real difficulty in the paternal register.
        </p>
      </section>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>What this means first</p>
        <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Before any cancellation is checked, the raw signification is strained. A practitioner who stops here and reports &quot;cursed&quot; has skipped the next step.
        </p>
        <div style={{ ...noticeStyle(VERMILION), marginTop: "0.85rem" }}>
          <AlertTriangle size={18} />
          <span>Do not report debilitation alone. Always check neecha-bhaṅga.</span>
        </div>
      </section>
    </div>
  );
}

function StepThreeKaraka({ active, setActive }: { active: boolean; setActive: (v: boolean) => void }) {
  return (
    <div style={workbenchTwoColumnStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Step 3 — karaka-bhava convergence</p>
        <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          The Sun is both the natural significator (kāraka) for father and the occupant of the 9th house of father. This convergence amplifies the house&apos;s condition.
        </p>
        <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.85rem" }}>
          <button type="button" aria-pressed={active} onClick={() => setActive(true)} style={togglePanelStyle(active, PURPLE)}>
            <CheckSquare size={18} aria-hidden="true" />
            <span>
              <strong style={{ fontWeight: 600 }}>Show amplification</strong>
              <span>The karaka occupying its own house amplifies the condition, here a difficulty.</span>
            </span>
          </button>
          <button type="button" aria-pressed={!active} onClick={() => setActive(false)} style={togglePanelStyle(!active, VERMILION)}>
            <AlertTriangle size={18} aria-hidden="true" />
            <span>
              <strong style={{ fontWeight: 600 }}>Wrong: treat convergence as automatically good</strong>
              <span>A kāraka in its own house is not always favourable; it amplifies whatever condition is there.</span>
            </span>
          </button>
        </div>
      </section>
      <section style={{ ...cardStyle, borderColor: active ? `${PURPLE}66` : `${VERMILION}66`, background: active ? `${PURPLE}0F` : `${VERMILION}0F` }}>
        <p style={eyebrowStyle}>Result</p>
        <p style={{ margin: "0.5rem 0 0", color: active ? INK_PRIMARY : VERMILION, lineHeight: 1.55 }}>
          {active
            ? "Sun-as-karaka in the 9th house amplifies the debilitation: the paternal register carries real, amplified structural difficulty."
            : "This shortcut would wrongly assume the convergence cancels the debilitation by itself."}
        </p>
      </section>
    </div>
  );
}

function StepFourCrossReference() {
  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Step 4 — cross-reference against Ansh&apos;s chart</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "0.85rem" }}>
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.85rem", background: SURFACE }}>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase" }}>Chandra&apos;s 9th house</p>
          <p style={{ margin: "0.35rem 0 0", color: SIGN_COLORS[NINTH_HOUSE], fontSize: "1.2rem", fontWeight: 500 }}>{SIGNS[NINTH_HOUSE]}</p>
          <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY }}>Contains debilitated Sun</p>
        </div>
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.85rem", background: SURFACE }}>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase" }}>Ansh&apos;s Lagna</p>
          <p style={{ margin: "0.35rem 0 0", color: SIGN_COLORS[ANSH_LAGNA], fontSize: "1.2rem", fontWeight: 500 }}>{SIGNS[ANSH_LAGNA]}</p>
          <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY }}>Same sign</p>
        </div>
        <div style={{ border: `1px solid ${GREEN}66`, borderRadius: 8, padding: "0.85rem", background: `${GREEN}0F` }}>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase" }}>Point of contact</p>
          <p style={{ margin: "0.35rem 0 0", color: GREEN, fontWeight: 500 }}>Genuine resonance</p>
          <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY }}>Anchors the relationship specifically, but does not resolve the difficulty.</p>
        </div>
      </div>
    </section>
  );
}

function StepFiveNeechaBhanga({
  condition1,
  setCondition1,
  condition2,
  setCondition2,
}: {
  condition1: boolean;
  setCondition1: (v: boolean) => void;
  condition2: boolean;
  setCondition2: (v: boolean) => void;
}) {
  const both = condition1 && condition2;

  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Step 5 — check neecha-bhaṅga conditions</p>
      <p style={{ margin: "0.35rem 0 0.75rem", color: INK_SECONDARY }}>
        Toggle each condition to verify whether it is satisfied from Chandra&apos;s Aquarius Lagna.
      </p>
      <div style={workbenchTwoColumnStyle}>
        <button type="button" aria-pressed={condition1} onClick={() => setCondition1(!condition1)} style={togglePanelStyle(condition1, GREEN)}>
          <CheckSquare size={18} aria-hidden="true" />
          <span>
            <strong style={{ fontWeight: 600 }}>Condition 1 — dispositor in kendra</strong>
            <span>Venus (lord of Libra) sits in Taurus, the 4th house from Aquarius Lagna — a kendra.</span>
          </span>
        </button>
        <button type="button" aria-pressed={condition2} onClick={() => setCondition2(!condition2)} style={togglePanelStyle(condition2, GREEN)}>
          <CheckSquare size={18} aria-hidden="true" />
          <span>
            <strong style={{ fontWeight: 600 }}>Condition 2 — exaltation lord in kendra</strong>
            <span>Mars (lord of Aries, where Sun exalts) sits in Leo, the 7th house from Aquarius Lagna — a kendra.</span>
          </span>
        </button>
      </div>
      <div style={{ ...noticeStyle(both ? GREEN : ACCENT), marginTop: "0.85rem" }}>
        {both ? <BadgeCheck size={18} /> : <RefreshCw size={18} />}
        <span>
          {both
            ? "Both conditions are independently satisfied — a doubly-confirmed neecha-bhaṅga. The debility is neutralised, not automatically triumphant."
            : "Verify both conditions to see the cancellation outcome."}
        </span>
      </div>
    </section>
  );
}

function StepSixConclusion({
  conclusion,
  setConclusion,
}: {
  conclusion: ConclusionKey | null;
  setConclusion: (v: ConclusionKey) => void;
}) {
  const options: { key: ConclusionKey; label: string; body: string; color: string }[] = [
    {
      key: "afflicted",
      label: "Afflicted / cursed",
      body: "Reports the debilitated Sun as an uncomplicated curse, skipping cancellation.",
      color: VERMILION,
    },
    {
      key: "neutral",
      label: "Neutralised difficulty",
      body: "A real difficulty in the paternal register, substantially redeemed by double cancellation.",
      color: GREEN,
    },
    {
      key: "triumph",
      label: "Automatically triumphant",
      body: "Overclaims cancellation as guaranteeing extraordinary paternal success.",
      color: VERMILION,
    },
  ];

  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Step 6 — choose the correctly-scoped statement</p>
      <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            aria-pressed={conclusion === opt.key}
            onClick={() => setConclusion(opt.key)}
            style={togglePanelStyle(conclusion === opt.key, opt.color)}
          >
            {conclusion === opt.key ? <BadgeCheck size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
            <span>
              <strong style={{ fontWeight: 600 }}>{opt.label}</strong>
              <span>{opt.body}</span>
            </span>
          </button>
        ))}
      </div>
      {conclusion ? (
        <div style={{ ...noticeStyle(conclusion === "neutral" ? GREEN : VERMILION), marginTop: "0.85rem" }}>
          {conclusion === "neutral" ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
          <span>
            {conclusion === "neutral"
              ? "Correct. Chandra's paternal register carries real structural difficulty that is doubly neutralised by classical cancellation, specifically anchored to Ansh's own Lagna sign."
              : conclusion === "afflicted"
                ? "Incorrect. This skips the satisfied neecha-bhaṅga conditions and overstates affliction."
                : "Incorrect. Cancellation neutralises debility; it does not automatically grant triumph."}
          </span>
        </div>
      ) : null}
    </section>
  );
}

function ZodiacStepWheel({ lagna, current, target }: { lagna: number; current: number; target: number }) {
  const radius = 100;
  const center = 130;

  return (
    <svg viewBox="0 0 260 240" role="img" aria-label="Zodiac wheel counting from Lagna to 9th house" style={{ width: "100%", maxHeight: 280, display: "block", margin: "0.85rem auto 0" }}>
      <circle cx={center} cy={center} r={radius} fill="none" stroke={HAIRLINE} strokeWidth="1.5" />
      <circle cx={center} cy={center} r={radius - 32} fill="none" stroke={HAIRLINE} strokeWidth="1" />
      {SIGNS.map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = center + (radius - 32) * Math.cos(angle);
        const y1 = center + (radius - 32) * Math.sin(angle);
        const x2 = center + radius * Math.cos(angle);
        const y2 = center + radius * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={HAIRLINE} strokeWidth="1" />;
      })}
      {SIGNS.map((sign, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = center + (radius - 16) * Math.cos(angle);
        const y = center + (radius - 16) * Math.sin(angle);
        const isLagna = i === lagna;
        const isCurrent = i === current;
        const isTarget = i === target;
        return (
          <g key={sign}>
            {(isLagna || isCurrent || isTarget) ? (
              <circle cx={x} cy={y} r={20} fill={isLagna ? `${BLUE}22` : isTarget ? `${GREEN}22` : `${ACCENT}18`} stroke={isLagna ? BLUE : isTarget ? GREEN : ACCENT} strokeWidth="2" />
            ) : null}
            <text x={x} y={y - 3} textAnchor="middle" fill={isLagna || isCurrent || isTarget ? INK_PRIMARY : INK_MUTED} fontSize="11" fontWeight={isLagna || isCurrent || isTarget ? 600 : 500}>{SIGN_SHORT[i]}</text>
            <text x={x} y={y + 10} textAnchor="middle" fill={isLagna || isCurrent || isTarget ? INK_SECONDARY : INK_MUTED} fontSize="9">{i + 1}</text>
          </g>
        );
      })}
      <text x={center} y={center - 6} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Chandra</text>
      <text x={center} y={center + 14} textAnchor="middle" fill={INK_MUTED} fontSize="11">Aquarius Lagna</text>
    </svg>
  );
}

function MiniFact({ icon, title, body, color }: { icon: React.ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function stepChipStyle(active: boolean, completed: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : completed ? `${color}66` : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : completed ? `${color}14` : "transparent",
    color: active ? "#fff" : completed ? color : INK_MUTED,
    padding: "0.42rem 0.62rem",
    fontWeight: 500,
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

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 8,
    background: `${color}14`,
    color,
    padding: "0.75rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "start",
    fontWeight: 500,
    lineHeight: 1.45,
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.55rem 0.75rem",
  background: SURFACE,
  color: INK_PRIMARY,
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.9rem",
  fontWeight: 500,
};

function primaryButtonStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? GREEN : HAIRLINE}`,
    borderRadius: 8,
    padding: "0.55rem 0.85rem",
    background: active ? GREEN : SURFACE,
    color: active ? "#fff" : INK_MUTED,
    cursor: active ? "pointer" : "not-allowed",
    font: "inherit",
    fontSize: "0.9rem",
    fontWeight: 500,
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontSize: "0.78rem",
  fontWeight: 600,
};

export default NinthFromChildPaternalRegisterWorkbench;
