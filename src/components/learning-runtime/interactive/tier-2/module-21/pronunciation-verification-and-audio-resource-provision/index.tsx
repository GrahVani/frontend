"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  CheckCircle2,
  Headphones,
  Lock,
  Music,
  Repeat,
  RotateCcw,
  ShieldCheck,
  Volume2,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type StepKey = "recite" | "repeat" | "correct" | "reverify" | "audio";
type RigorKey = "vaidika" | "namaskara";
type CommitmentKey = "clientNotPractitioner" | "noSelfReport" | "traditionRigor";

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

const TEACH_BACK_STEPS: Record<StepKey, { label: string; detail: string; icon: React.ReactNode }> = {
  recite: {
    label: "Practitioner recites clearly",
    detail: "At a natural pace, ideally more than once, so the client has a clean model.",
    icon: <Volume2 size={18} aria-hidden="true" />,
  },
  repeat: {
    label: "Client repeats back",
    detail: "Syllable by syllable if needed, especially for unfamiliar words.",
    icon: <Music size={18} aria-hidden="true" />,
  },
  correct: {
    label: "Practitioner corrects specific errors",
    detail: "Consonants, dropped syllables, anusvāra — not an approximate match.",
    icon: <Repeat size={18} aria-hidden="true" />,
  },
  reverify: {
    label: "Client repeats until stable",
    detail: "Stable across at least two consecutive attempts.",
    icon: <ShieldCheck size={18} aria-hidden="true" />,
  },
  audio: {
    label: "Provide take-home audio resource",
    detail: "So the client can self-correct after the session ends.",
    icon: <Headphones size={18} aria-hidden="true" />,
  },
};

const RIGOR: Record<RigorKey, { label: string; detail: string; bar: string; example: string }> = {
  vaidika: {
    label: "Vaidika",
    detail: "Strict svara (Vedic pitch-accent) is part of the sound itself.",
    bar: "Exact pitch-accent, consonants, syllable-count, and pace.",
    example: "Gāyatrī — requires precise svara.",
  },
  namaskara: {
    label: "Devotional / namaskāra",
    detail: "More forgiving of pitch, exacting on consonants and syllable-count.",
    bar: "Correct syllables and consonants, steady unhurried pace.",
    example: "Oṁ Bṛhaspataye Namaḥ — no Vedic svara required.",
  },
};

const COMMITMENTS: Record<CommitmentKey, { label: string; detail: string }> = {
  clientNotPractitioner: {
    label: "Client-correctness is the independent fact to verify",
    detail: "The practitioner being correct is necessary for teaching; it is not sufficient for confirming the client learned it.",
  },
  noSelfReport: {
    label: "An unverified \"yes\" is not verification",
    detail: "Only an actual, corrected, repeated-back reproduction counts.",
  },
  traditionRigor: {
    label: "Rigor is tradition-appropriate",
    detail: "Strict svara for Vaidika; correct syllables/consonants and steady pace for devotional namaskāra forms.",
  },
};

function GapDiagram({ stepsComplete }: { stepsComplete: boolean }) {
  const stepFill = "#FDFAF2";
  const bridgeColor = stepsComplete ? GREEN : GOLD;
  const bridgeFill = stepsComplete ? "#E8F5E9" : "#FFF8E1";

  return (
    <svg width="100%" height="100%" viewBox="0 0 720 180" style={{ maxWidth: 720 }}>
      {/* Practitioner block */}
      <rect x={20} y={40} width={180} height={100} rx={8} fill={stepFill} stroke={HAIRLINE} strokeWidth={2} />
      <text x={110} y={75} fontSize={12} fill={INK_MUTED} fontWeight={600} textAnchor="middle">Practitioner</text>
      <text x={110} y={95} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">Recites correctly</text>
      <text x={110} y={115} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">Necessary, not sufficient</text>
      <CheckCircle2 x={95} y={125} size={18} color={GREEN} />

      {/* Bridge */}
      <rect x={240} y={55} width={240} height={70} rx={8} fill={bridgeFill} stroke={bridgeColor} strokeWidth={2} />
      <text x={360} y={80} fontSize={12} fill={bridgeColor} fontWeight={600} textAnchor="middle">Teach-back bridge</text>
      <text x={360} y={100} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">
        {stepsComplete ? "All 5 steps held" : "Steps incomplete"}
      </text>
      <text x={360} y={116} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">
        {stepsComplete ? "Client reproduction verified" : "Verification gap open"}
      </text>

      {/* Client block */}
      <rect x={520} y={40} width={180} height={100} rx={8} fill={stepFill} stroke={stepsComplete ? GREEN : HAIRLINE} strokeWidth={2} />
      <text x={610} y={75} fontSize={12} fill={INK_MUTED} fontWeight={600} textAnchor="middle">Client</text>
      <text x={610} y={95} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">
        {stepsComplete ? "Reproduces correctly" : "Reproduction unverified"}
      </text>
      <text x={610} y={115} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">
        {stepsComplete ? "Pronunciation cleared" : "Teach-back required"}
      </text>
      {stepsComplete ? (
        <CheckCircle2 x={595} y={125} size={18} color={GREEN} />
      ) : (
        <Lock x={595} y={125} size={18} color={GOLD} />
      )}
    </svg>
  );
}

function StepCard({
  stepKey,
  done,
  onToggle,
}: {
  stepKey: StepKey;
  done: boolean;
  onToggle: () => void;
}) {
  const step = TEACH_BACK_STEPS[stepKey];
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        ...togglePanelStyle(done, done ? GREEN : GOLD),
        width: "100%",
        textAlign: "left",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ color: done ? GREEN : GOLD }}>{step.icon}</span>
        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{step.label}</span>
        <span style={{ marginLeft: "auto" }}>
          {done ? <CheckCircle2 size={18} color={GREEN} /> : <XCircle size={18} color={GOLD} />}
        </span>
      </span>
      <span style={{ color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5, marginTop: "0.3rem" }}>
        {done ? step.detail : <span style={{ color: GOLD }}>Pending — click to hold.</span>}
      </span>
    </button>
  );
}

function CommitmentToggle({
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
        ...togglePanelStyle(held, held ? GREEN : VERMILION),
        width: "100%",
        textAlign: "left",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {held ? <CheckCircle2 size={18} color={GREEN} /> : <XCircle size={18} color={VERMILION} />}
        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{label}</span>
      </span>
      <span style={{ color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5, marginTop: "0.3rem" }}>
        {held ? detail : <span style={{ color: VERMILION }}>Released — discipline gap open.</span>}
      </span>
    </button>
  );
}

export function PronunciationVerificationAndAudioResourceProvision() {
  const [steps, setSteps] = useState<Record<StepKey, boolean>>({
    recite: false,
    repeat: false,
    correct: false,
    reverify: false,
    audio: false,
  });
  const [rigor, setRigor] = useState<RigorKey>("namaskara");
  const [commitments, setCommitments] = useState<Record<CommitmentKey, boolean>>({
    clientNotPractitioner: true,
    noSelfReport: true,
    traditionRigor: true,
  });

  const stepsComplete = Object.values(steps).every(Boolean);

  const toggleStep = (key: StepKey) => {
    setSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const runRohanCase = () => {
    setSteps({ recite: true, repeat: true, correct: true, reverify: true, audio: true });
    setRigor("namaskara");
  };

  const reset = () => {
    setSteps({ recite: false, repeat: false, correct: false, reverify: false, audio: false });
    setRigor("namaskara");
    setCommitments({ clientNotPractitioner: true, noSelfReport: true, traditionRigor: true });
  };

  return (
    <div data-interactive="pronunciation-verification-and-audio-resource-provision" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Pronunciation verification and audio-resource provision</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Practitioner-correctness does not prove client-correctness
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The teach-back method closes the gap: recite, repeat, correct, re-verify, then provide a take-home audio resource.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={{ ...cardStyle, background: CREAM }}>
        <p style={eyebrowStyle}>Verification gap</p>
        <div style={workbenchDiagramLayoutStyle}>
          <GapDiagram stepsComplete={stepsComplete} />
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Teach-back method</p>
          <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
            Hold all five steps to verify the client&apos;s pronunciation and close this safety dimension.
          </p>
          <div style={{ display: "grid", gap: "0.65rem" }}>
            {(Object.keys(TEACH_BACK_STEPS) as StepKey[]).map((key) => (
              <StepCard key={key} stepKey={key} done={steps[key]} onToggle={() => toggleStep(key)} />
            ))}
          </div>

          <div style={{ marginTop: "0.85rem", padding: "0.75rem", borderRadius: 8, border: `1.5px solid ${HAIRLINE}`, background: SURFACE }}>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.82rem", fontWeight: 600 }}>Current status</p>
            <p style={{ margin: "0.35rem 0 0", color: stepsComplete ? GREEN : VERMILION, fontSize: "0.95rem", fontWeight: 600 }}>
              {stepsComplete ? "Pronunciation dimension cleared" : "Pronunciation dimension pending"}
            </p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
              {stepsComplete
                ? "All five teach-back steps held. The client can reproduce the mantra and has a take-home audio resource."
                : "Complete the remaining steps to close the pronunciation gap."}
            </p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <div style={cardStyle}>
            <p style={eyebrowStyle}>Tradition-appropriate rigor</p>
            <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              Select the tradition to see the correct verification bar.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button
                type="button"
                aria-pressed={rigor === "vaidika"}
                onClick={() => setRigor("vaidika")}
                style={smallChipStyle(rigor === "vaidika", PURPLE)}
              >
                Vaidika
              </button>
              <button
                type="button"
                aria-pressed={rigor === "namaskara"}
                onClick={() => setRigor("namaskara")}
                style={smallChipStyle(rigor === "namaskara", BLUE)}
              >
                Devotional / namaskāra
              </button>
            </div>
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1.5px solid ${HAIRLINE}`, background: CREAM }}>
              <p style={{ margin: 0, color: RIGOR[rigor].color, fontWeight: 600 }}>{RIGOR[rigor].label}</p>
              <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>{RIGOR[rigor].detail}</p>
              <p style={{ margin: "0.4rem 0 0", color: INK_PRIMARY, fontSize: "0.85rem" }}>
                <span style={{ fontWeight: 600 }}>Bar: </span>{RIGOR[rigor].bar}
              </p>
              <p style={{ margin: "0.4rem 0 0", color: INK_MUTED, fontSize: "0.82rem" }}>
                <span style={{ fontWeight: 600 }}>Example: </span>{RIGOR[rigor].example}
              </p>
            </div>
          </div>

          <div style={cardStyle}>
            <p style={eyebrowStyle}>Rohan&apos;s Guru mantra</p>
            <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              Oṁ Bṛhaspataye Namaḥ is a devotional namaskāra form. Run the full teach-back.
            </p>
            <div style={{ padding: "0.75rem", borderRadius: 8, border: `1.5px solid ${HAIRLINE}`, background: CREAM, marginBottom: "0.75rem" }}>
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.75rem", fontWeight: 600 }}>Mantra</p>
              <p style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.15rem" }}>Oṁ Bṛhaspataye Namaḥ</p>
              <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
                Check the <span style={{ fontWeight: 600 }}>Bṛ-has-pa-ta-ye</span> syllables specifically.
              </p>
            </div>
            <button type="button" onClick={runRohanCase} style={buttonStyle(false, GOLD)}>
              <Volume2 size={15} aria-hidden="true" />
              Run Rohan&apos;s teach-back
            </button>
            {stepsComplete && rigor === "namaskara" && (
              <p style={{ margin: "0.75rem 0 0", color: GREEN, fontSize: "0.85rem" }}>
                <CheckCircle2 size={14} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
                Rohan&apos;s pronunciation check is cleared. Contraindications remain pending.
              </p>
            )}
          </div>

          <div style={{ ...cardStyle, borderColor: VERMILION, background: "#FBE9E7" }}>
            <p style={eyebrowStyle}>Safety dimensions still pending</p>
            <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
              Pronunciation is only half of the mantra safety-check. Lesson 21.2.3 covers initiation status, timing/purity, and medical/health screening.
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline commitments</p>
        <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
          Hold these three guards while verifying pronunciation.
        </p>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {(Object.keys(COMMITMENTS) as CommitmentKey[]).map((key) => (
            <CommitmentToggle
              key={key}
              held={commitments[key]}
              onToggle={() => setCommitments((prev) => ({ ...prev, [key]: !prev[key] }))}
              label={COMMITMENTS[key].label}
              detail={COMMITMENTS[key].detail}
            />
          ))}
        </div>
      </section>
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

PronunciationVerificationAndAudioResourceProvision.displayName = "PronunciationVerificationAndAudioResourceProvision";
