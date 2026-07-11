"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  ClipboardList,
  FileText,
  GitCompare,
  LockKeyhole,
  RefreshCw,
  Scale,
  ShieldCheck,
  Split,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type StepKey = "route" | "weight" | "classify" | "check" | "resolve" | "rank";
type StreamKey = "parashara" | "kp" | "jaimini" | "lalKitab" | "tajika" | "nadi";
type StatementKey = "context" | "indicators" | "confidence" | "caveats" | "ethics" | "followup";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const STEPS: Record<StepKey, { label: string; target: StatementKey; title: string; body: string; icon: ReactNode; color: string }> = {
  route: {
    label: "Route",
    target: "context",
    title: "All five streams are genuinely on the marriage question",
    body: "Parashari and KP target the 7th; Jaimini, Lal Kitab, and Tajika route to the same Saturn-centered substrate.",
    icon: <ClipboardList size={16} />,
    color: ACCENT,
  },
  weight: {
    label: "Weight",
    target: "indicators",
    title: "Different sub-questions get different weights",
    body: "KP is weighted for whether; Parashari is weighted for what-is-it-like. Corroborating streams do not become votes.",
    icon: <Scale size={16} />,
    color: BLUE,
  },
  classify: {
    label: "Classify",
    target: "indicators",
    title: "Verdict, substrate, timing, and absence are separated",
    body: "Parashari and KP are verdict-bearing; Jaimini and Lal Kitab corroborate; Tajika is partial timing; Nadi is framework-produced absence.",
    icon: <Split size={16} />,
    color: GREEN,
  },
  check: {
    label: "Check",
    target: "confidence",
    title: "The verdict divergence survives re-examination",
    body: "True denominator two: Parashari weak-to-moderate and KP clean yes. Substrate converges strongly; timing converges within 49 days.",
    icon: <GitCompare size={16} />,
    color: VERMILION,
  },
  resolve: {
    label: "Resolve",
    target: "followup",
    title: "The speakable takeaway is birth-time confirmation",
    body: "Report both readings by name, keep the current period as supported, and name tighter birth-time confirmation as the sharpening lever.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  rank: {
    label: "Rank",
    target: "confidence",
    title: "Prominence follows stakes and traceability",
    body: "Verdict divergence belongs in Confidence; substrate supports Indicators; timing is support, not a new outcome promise.",
    icon: <FileText size={16} />,
    color: BLUE,
  },
};

const STEP_ORDER: StepKey[] = ["route", "weight", "classify", "check", "resolve", "rank"];

const STREAMS: Record<StreamKey, { label: string; claim: string; role: string; color: string }> = {
  parashara: {
    label: "Parashari",
    claim: "7th lord Saturn: weak-to-moderate, leaning weak, on quality and ease.",
    role: "verdict-bearing",
    color: ACCENT,
  },
  kp: {
    label: "KP",
    claim: "7th cuspal sub-lord: clean YES, margin real but not spacious.",
    role: "verdict-bearing",
    color: BLUE,
  },
  jaimini: {
    label: "Jaimini",
    claim: "Darakaraka names Saturn by the lowest-degree cara-karaka route.",
    role: "corroborating substrate",
    color: GREEN,
  },
  lalKitab: {
    label: "Lal Kitab",
    claim: "Teva box-4 reading keeps Saturn in the shared substrate picture.",
    role: "corroborating substrate",
    color: VERMILION,
  },
  tajika: {
    label: "Tajika",
    claim: "Muntha and solar-return timing provide a partial year-specific thread.",
    role: "partial substrate + timing",
    color: GREEN,
  },
  nadi: {
    label: "Nadi",
    claim: "Correctly absent by the module decision framework.",
    role: "framework-produced absence",
    color: INK_MUTED,
  },
};

const STATEMENT_SECTIONS: Record<StatementKey, { label: string; summary: string; color: string }> = {
  context: {
    label: "Chart context",
    summary: "Chart MD1, marriage-promise question, disclosed Parashari and KP settings.",
    color: ACCENT,
  },
  indicators: {
    label: "Indicators",
    summary: "Saturn is named by four full mechanisms plus one partial Tajika thread.",
    color: GREEN,
  },
  confidence: {
    label: "Confidence",
    summary: "Two verdict-bearing streams genuinely bifurcate; timing support is real but bounded.",
    color: VERMILION,
  },
  caveats: {
    label: "Caveats",
    summary: "Two sub-questions, KP margin, partial Tajika, dharma thread excluded, Nadi absent.",
    color: BLUE,
  },
  ethics: {
    label: "Ethical framing",
    summary: "No false single number; the bifurcation is the honest shape of the evidence.",
    color: ACCENT,
  },
  followup: {
    label: "Follow-up",
    summary: "Birth-time confirmation is the highest-value next step; dasha-level timing remains open.",
    color: GREEN,
  },
};

export function WorkedSynthesisMarriageQuestion5Streams() {
  const [step, setStep] = useState<StepKey>("check");
  const [stream, setStream] = useState<StreamKey>("parashara");
  const [showProbability, setShowProbability] = useState(false);
  const [collapseVerdicts, setCollapseVerdicts] = useState(false);
  const [hideNadiAbsence, setHideNadiAbsence] = useState(false);
  const [birthTimeTakeaway, setBirthTimeTakeaway] = useState(true);

  const selectedStep = STEPS[step];
  const selectedStream = STREAMS[stream];
  const targetSection = STATEMENT_SECTIONS[selectedStep.target];
  const methodOk = !showProbability && !collapseVerdicts && !hideNadiAbsence && birthTimeTakeaway;

  const statement = useMemo(() => {
    if (showProbability) {
      return "Repair: no stream produces a numeric probability. A percentage would turn qualitative bifurcation into false precision.";
    }
    if (collapseVerdicts) {
      return "Repair: Parashari quality and KP whether are not one verdict. Report both by name and weight.";
    }
    if (hideNadiAbsence) {
      return "Repair: Nadi is not forgotten. Its absence is produced by the framework and belongs in caveats.";
    }
    if (!birthTimeTakeaway) {
      return "Repair: Resolve needs a concrete client-facing next step. Here that is tighter birth-time confirmation.";
    }
    return "Camera-ready shape: Saturn is the shared substrate, Parashari and KP remain honestly bifurcated on two sub-questions, the year has modest timing support, and the practical takeaway is birth-time confirmation rather than a forced percentage.";
  }, [birthTimeTakeaway, collapseVerdicts, hideNadiAbsence, showProbability]);

  return (
    <div data-interactive="worked-synthesis-marriage-question-5-streams" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Worked synthesis: marriage question</p>
            <h2 style={headingStyle}>Trace every statement line back to the six-step sequence</h2>
            <p style={bodyStyle}>
              Run Route, Weight, Classify, Check, Resolve, and Rank on Chart MD1&apos;s marriage question, then watch each step populate the client-ready statement.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("check");
              setStream("parashara");
              setShowProbability(false);
              setCollapseVerdicts(false);
              setHideNadiAbsence(false);
              setBirthTimeTakeaway(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 540px" }}>
          <p style={eyebrowStyle}>Sequence-to-statement map</p>
          <MarriageSynthesisDiagram step={step} methodOk={methodOk} collapseVerdicts={collapseVerdicts} showProbability={showProbability} />
          <div style={stepGridStyle}>
            {STEP_ORDER.map((key, index) => (
              <button key={key} type="button" aria-pressed={step === key} onClick={() => setStep(key)} style={stepButtonStyle(step === key, STEPS[key].color)}>
                <span style={stepNumberStyle}>{index + 1}</span>
                {STEPS[key].label}
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 310px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: selectedStep.color }}>
            {selectedStep.icon}
            <p style={eyebrowStyle}>{selectedStep.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{selectedStep.title}</h3>
          <p style={bodyStyle}>{selectedStep.body}</p>
          <div style={{ ...targetPanelStyle(targetSection.color), marginTop: "1rem" }}>
            <span style={{ color: targetSection.color }}>{targetSection.label}</span>
            <p style={smallTextStyle}>{targetSection.summary}</p>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Stream roles</p>
          <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.8rem" }}>
            {(Object.keys(STREAMS) as StreamKey[]).map((key) => {
              if (hideNadiAbsence && key === "nadi") return null;
              return (
                <button key={key} type="button" onClick={() => setStream(key)} aria-pressed={stream === key} style={streamButtonStyle(stream === key, STREAMS[key].color)}>
                  <span>
                    <span style={{ display: "block", color: STREAMS[key].color, fontWeight: 500 }}>{STREAMS[key].label}</span>
                    <span style={smallTextStyle}>{STREAMS[key].role}</span>
                  </span>
                  {key === "nadi" ? <LockKeyhole size={16} /> : <ClipboardList size={16} />}
                </button>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected stream</p>
          <div style={factPanelStyle}>
            <h3 style={{ ...panelTitleStyle, color: selectedStream.color }}>{selectedStream.label}</h3>
            <p style={bodyStyle}>{selectedStream.claim}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow
              checked={!showProbability}
              onChange={(checked) => setShowProbability(!checked)}
              label="Block numeric probability"
              body="No 70 percent edit; this curriculum uses qualitative tiers."
              icon={<AlertTriangle size={16} />}
            />
            <ToggleRow
              checked={!collapseVerdicts}
              onChange={(checked) => setCollapseVerdicts(!checked)}
              label="Keep two sub-questions visible"
              body="Parashari quality and KP whether are calibrated differently."
              icon={<GitCompare size={16} />}
            />
            <ToggleRow
              checked={!hideNadiAbsence}
              onChange={(checked) => setHideNadiAbsence(!checked)}
              label="Show Nadi as framework-produced absence"
              body="Absence is a documented result, not an omission."
              icon={<LockKeyhole size={16} />}
            />
            <ToggleRow
              checked={birthTimeTakeaway}
              onChange={setBirthTimeTakeaway}
              label="Keep birth-time confirmation takeaway"
              body="Resolve ends in a concrete action, not just a caveat."
              icon={<BadgeCheck size={16} />}
            />
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Statement preview</p>
          <div style={statementPanelStyle(methodOk)}>
            {methodOk ? <ShieldCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
            <h3 style={{ ...panelTitleStyle, color: methodOk ? GREEN : VERMILION }}>
              {methodOk ? "Auditable bifurcation" : "Repair before delivery"}
            </h3>
            <p style={bodyStyle}>{statement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WorkedSynthesisMarriageQuestion5Streams;

function MarriageSynthesisDiagram({ step, methodOk, collapseVerdicts, showProbability }: { step: StepKey; methodOk: boolean; collapseVerdicts: boolean; showProbability: boolean }) {
  const activeIndex = STEP_ORDER.indexOf(step);
  return (
    <svg viewBox="0 0 780 400" role="img" aria-label="Marriage synthesis sequence and statement diagram" style={{ width: "100%", minHeight: 330, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="380" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {STEP_ORDER.map((key, index) => {
        const x = 72 + index * 118;
        const active = index <= activeIndex;
        return (
          <g key={key}>
            {index > 0 ? <path d={`M ${x - 54} 86 L ${x - 18} 86`} stroke={active ? STEPS[key].color : HAIRLINE} strokeWidth="2.5" strokeDasharray="6 7" /> : null}
            <rect x={x - 38} y="54" width="76" height="64" rx="8" fill={active ? softFill(STEPS[key].color) : SURFACE} stroke={active ? STEPS[key].color : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <text x={x} y="80" textAnchor="middle" fill={active ? STEPS[key].color : INK_MUTED} fontSize="13" fontWeight="500">{STEPS[key].label}</text>
            <text x={x} y="101" textAnchor="middle" fill={INK_MUTED} fontSize="11">{STATEMENT_SECTIONS[STEPS[key].target].label}</text>
          </g>
        );
      })}
      <path d="M 190 186 C 260 142, 310 142, 380 186" fill="none" stroke={collapseVerdicts ? VERMILION : HAIRLINE} strokeWidth="3" />
      <Node x={170} y={218} label="Parashari" body="quality tier" color={ACCENT} active={activeIndex >= 3} />
      <Node x={365} y={218} label="KP" body="whether yes" color={BLUE} active={activeIndex >= 3} />
      <Node x={560} y={218} label="Substrate" body="Saturn convergence" color={GREEN} active={activeIndex >= 2} />
      <circle cx="365" cy="318" r="54" fill={methodOk ? "#E8F5E9" : "#F9E8E3"} stroke={methodOk ? GREEN : VERMILION} strokeWidth="3" />
      <text x="365" y="312" textAnchor="middle" fill={methodOk ? GREEN : VERMILION} fontSize="16" fontWeight="500">{showProbability ? "70%?" : "Statement"}</text>
      <text x="365" y="334" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">{methodOk ? "qualitative" : "repair"}</text>
      <path d="M 520 274 C 560 310, 600 318, 646 318" fill="none" stroke={activeIndex >= 4 ? GREEN : HAIRLINE} strokeWidth="2.5" />
      <rect x="632" y="292" width="92" height="52" rx="8" fill={activeIndex >= 4 ? "#E8F5E9" : SURFACE} stroke={activeIndex >= 4 ? GREEN : HAIRLINE} />
      <text x="678" y="313" textAnchor="middle" fill={activeIndex >= 4 ? GREEN : INK_MUTED} fontSize="12" fontWeight="500">Resolve</text>
      <text x="678" y="331" textAnchor="middle" fill={INK_MUTED} fontSize="10">birth time</text>
    </svg>
  );
}

function Node({ x, y, label, body, color, active }: { x: number; y: number; label: string; body: string; color: string; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="54" fill={active ? softFill(color) : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
      <text x={x} y={y - 5} textAnchor="middle" fill={active ? color : INK_MUTED} fontSize="14" fontWeight="500">{label}</text>
      <text x={x} y={y + 17} textAnchor="middle" fill={INK_MUTED} fontSize="11">{body}</text>
    </g>
  );
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
};

const stepGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(112px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: 0,
  fontSize: "0.78rem",
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.35rem",
  lineHeight: 1.25,
  fontWeight: 500,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.4rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  lineHeight: 1.3,
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.94rem",
};

const smallTextStyle: CSSProperties = {
  margin: "0.2rem 0 0",
  color: INK_MUTED,
  lineHeight: 1.4,
  fontSize: "0.84rem",
};

const stepNumberStyle: CSSProperties = {
  width: "1.35rem",
  height: "1.35rem",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${HAIRLINE}`,
  fontSize: "0.78rem",
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.58rem 0.72rem",
  background: SURFACE,
  color: INK_PRIMARY,
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.9rem",
  fontWeight: 500,
};

const factPanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.85rem",
  marginTop: "0.8rem",
  background: SURFACE,
  minHeight: "10rem",
};

function stepButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...softButtonStyle,
    justifyContent: "flex-start",
    borderColor: active ? color : HAIRLINE,
    background: active ? softFill(color) : SURFACE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
  };
}

function streamButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : SURFACE,
    color: INK_PRIMARY,
    padding: "0.68rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.8rem",
    textAlign: "left",
    cursor: "pointer",
    font: "inherit",
  };
}

function targetPanelStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 8,
    background: softFill(color),
    padding: "0.7rem",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: SURFACE,
    color: checked ? INK_PRIMARY : INK_MUTED,
    padding: "0.7rem",
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gap: "0.62rem",
    alignItems: "center",
  };
}

function statementPanelStyle(ok: boolean): CSSProperties {
  return {
    border: `1px solid ${ok ? GREEN : VERMILION}`,
    borderRadius: 8,
    background: ok ? "#E8F5E9" : "#F9E8E3",
    padding: "1rem",
    marginTop: "0.8rem",
    minHeight: "13rem",
  };
}

function softFill(color: string): string {
  if (color === ACCENT) return "#FDF4E3";
  if (color === GREEN) return "#E8F5E9";
  if (color === BLUE) return "#E3EEF9";
  if (color === VERMILION) return "#F9E8E3";
  return SURFACE;
}
