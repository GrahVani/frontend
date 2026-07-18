"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  GitCompare,
  Landmark,
  Lock,
  RefreshCcw,
  ShieldCheck,
  Timer,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type CandidateKey = "A" | "B" | "C";
type StepKey = 1 | 2 | 3 | 4;
type UseMode = "test" | "read";

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

const CANDIDATES: Record<CandidateKey, { time: string; sign: string; d60Index: number; d60Position: string; note: string }> = {
  A: { time: "05:48", sign: "Virgo", d60Index: 50, d60Position: "50th of Virgo", note: "before sunrise" },
  B: { time: "06:00", sign: "Virgo", d60Index: 56, d60Position: "56th of Virgo", note: "designed true" },
  C: { time: "06:12", sign: "Libra", d60Index: 2, d60Position: "2nd of Libra", note: "different sign" },
};

const STEPS: Record<StepKey, { label: string; t1: string; extension: string; color: string }> = {
  1: { label: "Collect dated events", t1: "Collect dated life events.", extension: "Cross-reference with Chapter 2's events-based method; one inventory serves both.", color: BLUE },
  2: { label: "Compute each D60", t1: "Compute the D60 for each candidate time.", extension: "Compute the D60 index of every rashi-level point that differs across candidates — in practice, the Lagna.", color: GOLD },
  3: { label: "Select best fit", t1: "Select the candidate whose D60 best explains the events.", extension: "Apply T1-09 9.7.1-9.7.2's construction-and-reading skill to each candidate's placement.", color: PURPLE },
  4: { label: "Triangulate", t1: "(not in T1-09 preview)", extension: "Treat the result as one input to triangulation; no single method, however clean, is a standalone verdict.", color: GREEN },
};

const USE_MODES: Record<UseMode, { label: string; verdict: string; color: string; detail: string }> = {
  test: {
    label: "Test candidates during rectification",
    verdict: "Legitimate use",
    color: GREEN,
    detail: "Compute D60 for several candidates and compare each against independently dated events. No single candidate's D60 is trusted alone.",
  },
  read: {
    label: "Read D60 on a 'best guess' time",
    verdict: "False precision",
    color: VERMILION,
    detail: "The D60 is the most time-sensitive standard divisional chart. Reading it on an unrectified guess is the worst place to skip verification.",
  },
};

function CircularitySvg({ broken }: { broken: boolean }) {
  return (
    <svg viewBox="0 0 560 240" role="img" aria-label="D60 rectification circularity and its resolution" style={{ width: "100%", maxHeight: 300, display: "block" }}>
      <rect x={20} y={20} width={520} height={200} rx={8} fill={`${broken ? GREEN : VERMILION}08`} stroke={HAIRLINE} />

      <circle cx={150} cy={120} r={48} fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth={3} />
      <text x={150} y={114} textAnchor="middle" fill={PURPLE} fontSize={13} fontWeight={600}>D60</text>
      <text x={150} y={132} textAnchor="middle" fill={INK_PRIMARY} fontSize={11}>needs trust</text>

      <circle cx={410} cy={120} r={48} fill={`${BLUE}18`} stroke={BLUE} strokeWidth={3} />
      <text x={410} y={114} textAnchor="middle" fill={BLUE} fontSize={13} fontWeight={600}>Birth time</text>
      <text x={410} y={132} textAnchor="middle" fill={INK_PRIMARY} fontSize={11}>needs D60</text>

      {broken ? (
        <>
          <path d="M 198 120 C 250 60, 310 60, 362 120" fill="none" stroke={VERMILION} strokeWidth={4} strokeLinecap="round" strokeDasharray="10 8" />
          <path d="M 198 120 C 250 180, 310 180, 362 120" fill="none" stroke={GREEN} strokeWidth={5} strokeLinecap="round" />
          <polygon points="350,128 362,120 350,112" fill={GREEN} />
          <rect x={240} y={150} width={80} height={30} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
          <text x={280} y={170} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>events</text>
          <text x={280} y={96} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontWeight={600}>loop broken</text>
          <text x={280} y={206} textAnchor="middle" fill={GREEN} fontSize={12} fontWeight={600}>Independent events are the fixed point outside the circle</text>
        </>
      ) : (
        <>
          <path d="M 198 120 C 250 60, 310 60, 362 120" fill="none" stroke={VERMILION} strokeWidth={4} strokeLinecap="round" />
          <path d="M 198 120 C 250 180, 310 180, 362 120" fill="none" stroke={VERMILION} strokeWidth={4} strokeLinecap="round" />
          <polygon points="350,128 362,120 350,112" fill={VERMILION} />
          <polygon points="210,112 198,120 210,128" fill={VERMILION} />
          <text x={280} y={96} textAnchor="middle" fill={VERMILION} fontSize={12} fontWeight={600}>apparent circularity</text>
          <text x={280} y={206} textAnchor="middle" fill={INK_MUTED} fontSize={12} fontWeight={600}>Seems circular when one candidate&apos;s D60 is treated as ground truth</text>
        </>
      )}
    </svg>
  );
}

function SensitivitySvg({ nudge }: { nudge: number }) {
  const markerX = 62 + (nudge / 4) * 472;
  return (
    <svg viewBox="0 0 620 160" role="img" aria-label="D60 half-degree sensitivity" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={20} y={20} width={580} height={120} rx={8} fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x={310} y={48} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>One sign split into 60 parts of 0°30&apos; each</text>

      <line x1={62} y1={85} x2={534} y2={85} stroke={HAIRLINE} strokeWidth={4} strokeLinecap="round" />
      {Array.from({ length: 5 }).map((_, i) => {
        const x = 62 + i * 118;
        return (
          <g key={i}>
            <line x1={x} y1={75} x2={x} y2={95} stroke={HAIRLINE} strokeWidth={2} />
            <text x={x} y={110} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontWeight={600}>{i * 2}°00&apos;</text>
          </g>
        );
      })}

      <line x1={markerX} y1={60} x2={markerX} y2={110} stroke={VERMILION} strokeWidth={3} strokeLinecap="round" />
      <circle cx={markerX} cy={85} r={7} fill={VERMILION} />
      <text x={markerX} y={132} textAnchor="middle" fill={VERMILION} fontSize={12} fontWeight={600}>+{nudge} min ≈ +{formatArc(nudge)}</text>

      <text x={310} y={155} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontWeight={600}>Roughly one minute of birth-time error can cross a shashtyamsha boundary</text>
    </svg>
  );
}

function formatArc(minutes: number) {
  const deg = Math.floor(minutes / 2);
  const min = (minutes % 2) * 30;
  if (deg === 0) return `${min}'`;
  if (min === 0) return `${deg}°00'`;
  return `${deg}°${min}'`;
}

export function D60SensitivityRectificationVerifier() {
  const [selectedStep, setSelectedStep] = useState<StepKey>(1);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateKey>("B");
  const [nudge, setNudge] = useState(1);
  const [broken, setBroken] = useState(false);
  const [useMode, setUseMode] = useState<UseMode>("test");
  const [triangulationHeld, setTriangulationHeld] = useState(true);

  const candidate = CANDIDATES[selectedCandidate];
  const step = STEPS[selectedStep];
  const mode = USE_MODES[useMode];

  function reset() {
    setSelectedStep(1);
    setSelectedCandidate("B");
    setNudge(1);
    setBroken(false);
    setUseMode("test");
    setTriangulationHeld(true);
  }

  return (
    <div data-interactive="d60-sensitivity-rectification-verifier" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 20 · Chapter 1</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              D60 sensitivity rectification verifier
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Extend T1-09&apos;s 3-step D60-BTR preview into this module&apos;s 4-step procedure, break the circularity, and see why the same computation is either a rigorous test or false precision.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 440px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Procedure</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
                From T1-09&apos;s 3 steps to this module&apos;s 4 steps
              </h3>
            </div>
            <strong style={{ color: selectedStep === 4 ? GREEN : GOLD, fontWeight: 600 }}>{selectedStep === 4 ? "Module 20 addition" : "T1-09 9.7.3"}</strong>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem", marginTop: "0.65rem" }}>
            {([1, 2, 3, 4] as StepKey[]).map((s) => (
              <button key={s} type="button" aria-pressed={selectedStep === s} onClick={() => setSelectedStep(s)} style={stepChipStyle(selectedStep === s, STEPS[s].color)}>
                <span style={{ fontSize: "0.85rem", opacity: 0.85 }}>Step {s}</span>
                <span style={{ fontSize: "0.9rem" }}>{STEPS[s].label}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: "0.75rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${step.color}55`, background: `${step.color}10` }}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              <span style={{ color: step.color, fontWeight: 600 }}>T1-09 says:</span>{" "}{step.t1}
            </p>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              <span style={{ color: selectedStep === 4 ? GREEN : GOLD, fontWeight: 600 }}>This module extends:</span>{" "}{step.extension}
            </p>
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <p style={eyebrowStyle}>Circularity</p>
          <h3 style={{ margin: "0.15rem 0 0", color: broken ? GREEN : VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
            {broken ? "Circularity broken" : "Apparent circularity"}
          </h3>
          <CircularitySvg broken={broken} />
          <button type="button" aria-pressed={broken} onClick={() => setBroken((v) => !v)} style={togglePanelStyle(broken, broken ? GREEN : VERMILION)}>
            {broken ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
            <span>
              <span style={{ fontWeight: 600 }}>{broken ? "Independent events compared" : "Single D60 trusted alone"}</span>
              <span style={{ color: INK_SECONDARY, display: "block" }}>
                {broken
                  ? "Several candidates are compared against dated events that do not depend on any D60."
                  : "Trusting one candidate's D60 as ground truth makes D60 need a rectified time first."}
              </span>
            </span>
          </button>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Vikram&apos;s candidates</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Three candidate times, three distinct D60 indices
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          The test is worth running only because the candidates produce genuinely separable results.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => {
            const c = CANDIDATES[key];
            const active = selectedCandidate === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedCandidate(key)}
                style={{
                  ...cardStyle,
                  textAlign: "left",
                  cursor: "pointer",
                  borderColor: active ? GOLD : HAIRLINE,
                  background: active ? `${GOLD}10` : SURFACE,
                  padding: "0.85rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: GOLD, fontWeight: 600, fontSize: "1.1rem" }}>Candidate {key}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.8rem" }}>{c.time}</span>
                </div>
                <div style={{ marginTop: "0.4rem", color: INK_PRIMARY, fontWeight: 600 }}>{c.sign} Lagna</div>
                <div style={{ marginTop: "0.25rem", color: c.d60Index >= 50 ? VERMILION : BLUE, fontWeight: 600 }}>{c.d60Position}</div>
                <div style={{ marginTop: "0.35rem", color: INK_MUTED, fontSize: "0.8rem" }}>{c.note}</div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: "0.65rem", padding: "0.65rem 0.85rem", borderRadius: 8, background: `${BLUE}12`, border: `1px solid ${BLUE}55`, color: INK_SECONDARY, lineHeight: 1.55 }}>
          <span style={{ color: BLUE, fontWeight: 600 }}>Selected:</span>{" "}
          Candidate {selectedCandidate} ({candidate.time}) places the Lagna in the {candidate.d60Position}. This lesson defers fine sign/dignity reading to T1-09 9.7.1-9.7.2 rather than reconstructing a classical table from memory.
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Sensitivity</p>
          <h3 style={{ margin: "0.15rem 0 0", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
            Roughly one minute crosses a boundary
          </h3>
          <SensitivitySvg nudge={nudge} />
          <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 600, marginTop: "0.5rem" }}>
            Birth-time nudge: +{nudge} minute{nudge === 1 ? "" : "s"}
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={nudge}
              onChange={(event) => setNudge(Number(event.target.value))}
              style={{ width: "100%", accentColor: VERMILION }}
            />
          </label>
          <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>
            The D60 changes faster, for a given time error, than almost anything else this curriculum teaches. That fragility is what makes it a strong rectification signal.
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Two uses of the same tool</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Test candidates vs read a best guess
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.55rem" }}>
            <button type="button" aria-pressed={useMode === "test"} onClick={() => setUseMode("test")} style={buttonStyle(useMode === "test", GREEN)}>
              <GitCompare size={16} aria-hidden="true" /> Test candidates
            </button>
            <button type="button" aria-pressed={useMode === "read"} onClick={() => setUseMode("read")} style={buttonStyle(useMode === "read", VERMILION)}>
              <Landmark size={16} aria-hidden="true" /> Read best guess
            </button>
          </div>
          <div style={{ marginTop: "0.65rem", padding: "0.75rem", borderRadius: 8, background: `${mode.color}12`, border: `1px solid ${mode.color}55` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: mode.color, fontWeight: 600 }}>
              {useMode === "test" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              {mode.verdict}
            </div>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{mode.detail}</p>
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${GREEN}66`, background: `${GREEN}0A` }}>
        <div style={{ display: "flex", alignItems: "start", gap: "0.65rem" }}>
          <ShieldCheck size={20} style={{ color: GREEN, flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, color: GREEN, fontWeight: 600 }}>Step 4 check</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              Even a clean D60 fit is one input to triangulation. Hold the guard to remember that no single method is a standalone verdict.
            </p>
            <button
              type="button"
              aria-pressed={triangulationHeld}
              onClick={() => setTriangulationHeld((v) => !v)}
              style={{ ...togglePanelStyle(triangulationHeld, triangulationHeld ? GREEN : VERMILION), marginTop: "0.65rem" }}
            >
              {triangulationHeld ? <Lock size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
              <span>
                <span style={{ fontWeight: 600 }}>{triangulationHeld ? "Triangulation guard held" : "Triangulation guard released"}</span>
                <span style={{ color: INK_SECONDARY, display: "block" }}>
                  {triangulationHeld
                    ? "D60 result must converge with at least one independent method before a candidate is called rectified."
                    : "Warning: a single clean D60 match is a lead, not a verdict."}
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>

      <section style={{ ...cardStyle, borderColor: `${BLUE}66`, background: `${BLUE}0A` }}>
        <div style={{ display: "flex", alignItems: "start", gap: "0.65rem" }}>
          <Timer size={20} style={{ color: BLUE, flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, color: BLUE, fontWeight: 600 }}>Critical insight</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              The same computation — a D60 for a given time — is either a rigorous diagnostic tool or a textbook example of false precision, depending entirely on whether it is being compared across candidates or read as a conclusion. The arithmetic does not change; what you do with the result does.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function stepChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    gap: "0.15rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.65rem",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
  };
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
    width: "100%",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
