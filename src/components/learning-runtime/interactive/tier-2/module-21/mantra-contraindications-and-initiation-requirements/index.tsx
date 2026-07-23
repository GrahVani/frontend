"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Lock,
  Moon,
  RotateCcw,
  ShieldCheck,
  Unlock,
  UserCheck,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type InitiationKey = "open" | "gated" | "uncertain";
type StageKey = "initiation" | "timing" | "health";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const CREAM = "#FAF5E8";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const STAGES: Record<StageKey, { label: string; icon: React.ReactNode; color: string }> = {
  initiation: { label: "Initiation Status", icon: <Lock size={16} aria-hidden="true" />, color: BLUE },
  timing: { label: "Timing / Purity", icon: <Moon size={16} aria-hidden="true" />, color: GOLD },
  health: { label: "Health / Intensity", icon: <HeartPulse size={16} aria-hidden="true" />, color: GREEN },
};

const INITIATION: Record<InitiationKey, { label: string; detail: string; cleared: boolean | null }> = {
  open: {
    label: "Open namaskāra / devotional",
    detail: "A simple salutation form such as Oṁ [devatā]-ya Namaḥ, recited without a lineage-specific bīja sequence.",
    cleared: true,
  },
  gated: {
    label: "Gated — bīja / tantra / guru-required",
    detail: "A multi-syllable bīja form, tantra-sourced mantra, or anything reported as requiring a guru.",
    cleared: false,
  },
  uncertain: {
    label: "Uncertain — needs referral",
    detail: "When you cannot confirm the form, refer to a qualified teacher rather than guess.",
    cleared: false,
  },
};

interface StageState {
  initiation: InitiationKey;
  timingSustainable: boolean;
  timingNoConflict: boolean;
  healthLowIntensity: boolean;
  healthNoCondition: boolean;
  relyingOnResemblance: boolean;
}

const DEFAULT_STATE: StageState = {
  initiation: "open",
  timingSustainable: true,
  timingNoConflict: true,
  healthLowIntensity: true,
  healthNoCondition: true,
  relyingOnResemblance: false,
};

function StagePipeline({ cleared }: { cleared: Record<StageKey, boolean> }) {
  const stepFill = "#FDFAF2";
  const stepStroke = HAIRLINE;
  const passColor = GREEN;
  const failColor = VERMILION;

  const stages: StageKey[] = ["initiation", "timing", "health"];

  return (
    <svg width="100%" height="100%" viewBox="0 0 720 140" style={{ maxWidth: 720 }}>
      {stages.map((key, idx) => {
        const x = 40 + idx * 240;
        const isCleared = cleared[key];
        const color = isCleared ? passColor : failColor;
        return (
          <g key={key}>
            <rect x={x} y={30} width={200} height={80} rx={8} fill={stepFill} stroke={color} strokeWidth={2} />
            <text x={x + 100} y={58} fontSize={12} fill={color} fontWeight={600} textAnchor="middle">
              {STAGES[key].label}
            </text>
            <text x={x + 100} y={78} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">
              {isCleared ? "Cleared" : "Flag raised"}
            </text>
            <text x={x + 100} y={96} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">
              {isCleared ? "Screening question answered" : "Needs review before prescribing"}
            </text>
            {isCleared ? (
              <CheckCircle2 x={x + 90} y={100} size={18} color={passColor} />
            ) : (
              <AlertTriangle x={x + 90} y={100} size={18} color={failColor} />
            )}
          </g>
        );
      })}

      <line x1={240} y1={70} x2={280} y2={70} stroke={stepStroke} strokeWidth={2} />
      <polygon points="280,70 270,65 270,75" fill={stepStroke} />
      <line x1={480} y1={70} x2={520} y2={70} stroke={stepStroke} strokeWidth={2} />
      <polygon points="520,70 510,65 510,75" fill={stepStroke} />
    </svg>
  );
}

function FormVsResemblanceDiagram({
  initiation,
  resemblance,
}: {
  initiation: InitiationKey;
  resemblance: boolean;
}) {
  const isOpen = initiation === "open";
  const gateColor = isOpen ? GREEN : VERMILION;
  const fillColor = isOpen ? "#E8F5E9" : "#FBE9E7";

  return (
    <svg width="100%" height="100%" viewBox="0 0 720 180" style={{ maxWidth: 720 }}>
      {/* Left mantra block */}
      <rect x={20} y={40} width={180} height={100} rx={8} fill={CREAM} stroke={HAIRLINE} strokeWidth={2} />
      <text x={110} y={72} fontSize={12} fill={INK_MUTED} fontWeight={600} textAnchor="middle">Observed mantra</text>
      <text x={110} y={92} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">
        {initiation === "open" ? "Namaskāra form" : "Bīja-prefixed form"}
      </text>
      <text x={110} y={112} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">
        {initiation === "open" ? "Shares devatā name" : "Looks devotional"}
      </text>

      {/* Arrow to gate */}
      <line x1={200} y1={90} x2={280} y2={90} stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="280,90 270,85 270,95" fill={HAIRLINE} />

      {/* Decision gate */}
      <rect x={300} y={30} width={120} height={120} rx={8} fill={fillColor} stroke={gateColor} strokeWidth={2} />
      <text x={360} y={62} fontSize={12} fill={gateColor} fontWeight={600} textAnchor="middle">The actual test</text>
      <text x={360} y={85} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">
        {isOpen ? "Open" : "Gated"}
      </text>
      <text x={360} y={108} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">
        {resemblance ? "Resemblance used" : "Form checked"}
      </text>
      {isOpen ? (
        <Unlock x={345} y={120} size={18} color={GREEN} />
      ) : (
        <Lock x={345} y={120} size={18} color={VERMILION} />
      )}

      {/* Arrow to outcome */}
      <line x1={420} y1={90} x2={500} y2={90} stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="500,90 490,85 490,95" fill={HAIRLINE} />

      {/* Outcome block */}
      <rect x={520} y={40} width={180} height={100} rx={8} fill={CREAM} stroke={gateColor} strokeWidth={2} />
      <text x={610} y={72} fontSize={12} fill={INK_MUTED} fontWeight={600} textAnchor="middle">Prescription status</text>
      <text x={610} y={92} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">
        {isOpen ? "May proceed" : "Refer / do not prescribe"}
      </text>
      <text x={610} y={112} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">
        {resemblance ? "Resemblance is not the test" : "Based on form, not looks"}
      </text>
    </svg>
  );
}

function StageToggle({
  held,
  onToggle,
  label,
  detail,
}: {
  held: boolean;
  onToggle: () => void;
  label: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        ...togglePanelStyle(held, held ? GREEN : GOLD),
        width: "100%",
        textAlign: "left",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {held ? <CheckCircle2 size={18} color={GREEN} /> : <XCircle size={18} color={GOLD} />}
        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{label}</span>
      </span>
      <span style={{ color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5, marginTop: "0.3rem" }}>
        {held ? detail : <span style={{ color: GOLD }}>Pending — click to confirm.</span>}
      </span>
    </button>
  );
}

export function MantraContraindicationsAndInitiationRequirements() {
  const [state, setState] = useState<StageState>(DEFAULT_STATE);

  const setInitiation = (value: InitiationKey) => setState((prev) => ({ ...prev, initiation: value }));
  const toggle = (key: "timingSustainable" | "timingNoConflict" | "healthLowIntensity" | "healthNoCondition" | "relyingOnResemblance") =>
    setState((prev) => ({ ...prev, [key]: !prev[key] }));

  const initiationCleared = state.initiation === "open";
  const timingCleared = state.timingSustainable && state.timingNoConflict;
  const healthCleared = state.healthLowIntensity && state.healthNoCondition;

  const allCleared = initiationCleared && timingCleared && healthCleared;
  const hasFlags = !allCleared;

  const stageCleared: Record<StageKey, boolean> = {
    initiation: initiationCleared,
    timing: timingCleared,
    health: healthCleared,
  };

  const runRohanCase = () => {
    setState({
      initiation: "open",
      timingSustainable: true,
      timingNoConflict: true,
      healthLowIntensity: true,
      healthNoCondition: true,
      relyingOnResemblance: false,
    });
  };

  const runBijaCase = () => {
    setState({
      initiation: "gated",
      timingSustainable: true,
      timingNoConflict: true,
      healthLowIntensity: false,
      healthNoCondition: true,
      relyingOnResemblance: false,
    });
  };

  const runNewParentCase = () => {
    setState({
      initiation: "open",
      timingSustainable: false,
      timingNoConflict: true,
      healthLowIntensity: true,
      healthNoCondition: true,
      relyingOnResemblance: false,
    });
  };

  const reset = () => setState(DEFAULT_STATE);

  return (
    <div data-interactive="mantra-contraindications-and-initiation-requirements" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Mantra contraindications and initiation requirements</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              From three cautions to three answered screening questions
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Naming a contraindication is not the same as answering it for a specific client and mantra. Complete the remaining three stages of the mantra safety-check.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={{ ...cardStyle, background: CREAM }}>
        <p style={eyebrowStyle}>Safety-check pipeline</p>
        <div style={workbenchDiagramLayoutStyle}>
          <StagePipeline cleared={stageCleared} />
        </div>
      </section>

      <section style={{ ...cardStyle, background: CREAM }}>
        <p style={eyebrowStyle}>Form vs. surface resemblance</p>
        <div style={workbenchDiagramLayoutStyle}>
          <FormVsResemblanceDiagram initiation={state.initiation} resemblance={state.relyingOnResemblance} />
        </div>
        <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => toggle("relyingOnResemblance")}
            style={smallChipStyle(state.relyingOnResemblance, VERMILION)}
          >
            <AlertTriangle size={14} aria-hidden="true" />
            {state.relyingOnResemblance ? "Relying on resemblance" : "Use the resemblance trap"}
          </button>
          <span style={{ color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
            {state.relyingOnResemblance
              ? "Resemblance to an open mantra does not clear initiation status. Check the actual form."
              : "The form test checks whether a lineage-specific bīja sequence is present."}
          </span>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Stage 1 — Initiation Status</p>
          <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
            Does this specific mantra, in this specific form, require dīkṣā?
          </p>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {(Object.keys(INITIATION) as InitiationKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setInitiation(key)}
                style={{
                  ...rowStyle,
                  borderColor: state.initiation === key ? INITIATION[key].cleared === false ? VERMILION : GREEN : HAIRLINE,
                  background: state.initiation === key ? (INITIATION[key].cleared === false ? `${VERMILION}08` : `${GREEN}08`) : SURFACE,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600, color: INK_PRIMARY }}>
                  {state.initiation === key ? (
                    <CheckCircle2 size={16} color={INITIATION[key].cleared === false ? VERMILION : GREEN} />
                  ) : (
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${HAIRLINE}` }} />
                  )}
                  {INITIATION[key].label}
                </span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1.5px solid ${HAIRLINE}`, background: CREAM }}>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.82rem", fontWeight: 600 }}>Selected form</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_PRIMARY, fontSize: "0.95rem", lineHeight: 1.5 }}>
              {INITIATION[state.initiation].detail}
            </p>
          </div>
          {state.initiation === "gated" && (
            <div style={{ marginTop: "0.75rem", padding: "0.65rem", borderRadius: 8, background: "#FBE9E7", border: `1.5px solid ${VERMILION}` }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: VERMILION, fontWeight: 600, fontSize: "0.9rem" }}>
                <AlertTriangle size={16} aria-hidden="true" />
                Initiation flag raised
              </span>
              <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                Prescribe only after confirmed initiation from a qualified teacher. Do not rely on resemblance.
              </p>
            </div>
          )}
          {state.initiation === "uncertain" && (
            <div style={{ marginTop: "0.75rem", padding: "0.65rem", borderRadius: 8, background: `${PURPLE}08`, border: `1.5px solid ${PURPLE}` }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: PURPLE, fontWeight: 600, fontSize: "0.9rem" }}>
                <UserCheck size={16} aria-hidden="true" />
                Referral required
              </span>
              <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                Uncertainty is itself a contraindication. Refer to a qualified teacher before proceeding.
              </p>
            </div>
          )}
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <div style={cardStyle}>
            <p style={eyebrowStyle}>Stage 2 — Timing / Purity</p>
            <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              Can this client sustain the practice conventions that come with this mantra?
            </p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <StageToggle
                held={state.timingSustainable}
                onToggle={() => toggle("timingSustainable")}
                label="Practice schedule is sustainable"
                detail="The client can realistically maintain the recommended timing."
              />
              <StageToggle
                held={state.timingNoConflict}
                onToggle={() => toggle("timingNoConflict")}
                label="No purity convention conflicts"
                detail="Fasting or pre-dawn windows do not clash with the client's life circumstances."
              />
            </div>
            {!timingCleared && (
              <p style={{ margin: "0.75rem 0 0", color: GOLD, fontSize: "0.85rem", lineHeight: 1.5 }}>
                <AlertTriangle size={14} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
                Adjust timing guidance so the client can succeed rather than prescribing a schedule set up to fail.
              </p>
            )}
          </div>

          <div style={cardStyle}>
            <p style={eyebrowStyle}>Stage 3 — Health / Intensity</p>
            <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              Does the client's condition interact with the intensity of this practice?
            </p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <StageToggle
                held={state.healthLowIntensity}
                onToggle={() => toggle("healthLowIntensity")}
                label="Mantra is low-intensity devotional recitation"
                detail="A namaskāra form, not an intensive sādhana."
              />
              <StageToggle
                held={state.healthNoCondition}
                onToggle={() => toggle("healthNoCondition")}
                label="No medical condition cautions"
                detail="No pregnancy, illness, or medication interaction that intensive practice would aggravate."
              />
            </div>
            {!healthCleared && (
              <p style={{ margin: "0.75rem 0 0", color: VERMILION, fontSize: "0.85rem", lineHeight: 1.5 }}>
                <AlertTriangle size={14} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
                Match the caution to its own conditions: pregnancy, illness, or medication interactions with intensive practice.
              </p>
            )}
          </div>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Case presets</p>
          <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
            Load a case and watch the three stages respond.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button type="button" onClick={runRohanCase} style={buttonStyle(false, GREEN)}>
              <ShieldCheck size={15} aria-hidden="true" />
              Rohan — fully cleared
            </button>
            <button type="button" onClick={runBijaCase} style={buttonStyle(false, VERMILION)}>
              <Lock size={15} aria-hidden="true" />
              Bīja form — initiation flag
            </button>
            <button type="button" onClick={runNewParentCase} style={buttonStyle(false, GOLD)}>
              <Moon size={15} aria-hidden="true" />
              New parent — timing flag
            </button>
          </div>
          {state.initiation === "open" && timingCleared && healthCleared && (
            <p style={{ margin: "0.75rem 0 0", color: GREEN, fontSize: "0.85rem" }}>
              <CheckCircle2 size={14} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
              Rohan's Oṁ Bṛhaspataye Namaḥ is fully cleared. Both pronunciation and contraindications are closed.
            </p>
          )}
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <p style={eyebrowStyle}>Clearance report</p>
          <div style={{ padding: "0.75rem", borderRadius: 8, border: `1.5px solid ${allCleared ? GREEN : VERMILION}`, background: allCleared ? "#E8F5E9" : "#FBE9E7" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {allCleared ? <CheckCircle2 size={20} color={GREEN} /> : <AlertTriangle size={20} color={VERMILION} />}
              <span style={{ fontWeight: 600, color: allCleared ? GREEN : VERMILION }}>
                {allCleared ? "Fully Cleared & Compliant" : "Flags Raised — Refer Before Prescribing"}
              </span>
            </div>
            <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
              {allCleared
                ? "All three screening questions are answered for this specific client and mantra. The prescription is finished."
                : "At least one stage is still flagged. Resolve it before the mantra becomes a finished prescription."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: "var(--gl-card-surface-solid)",
  border: "1.5px solid var(--gl-gold-hairline)",
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "var(--gl-gold-accent)",
  margin: 0,
};

const buttonStyle = (active: boolean, color: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.45rem 0.75rem",
  borderRadius: 8,
  border: `1.5px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_PRIMARY,
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.85rem",
});

const smallChipStyle = (active: boolean, color: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.4rem 0.65rem",
  borderRadius: 8,
  border: `1.5px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_PRIMARY,
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.82rem",
});

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.65rem 0.75rem",
  borderRadius: 8,
  border: `1.5px solid ${HAIRLINE}`,
  background: "var(--gl-card-surface-solid)",
  textAlign: "left",
  cursor: "pointer",
};

const togglePanelStyle = (active: boolean, color: string): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
  padding: "0.75rem",
  borderRadius: 8,
  border: `1.5px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}08` : "transparent",
  cursor: "pointer",
});

MantraContraindicationsAndInitiationRequirements.displayName = "MantraContraindicationsAndInitiationRequirements";
