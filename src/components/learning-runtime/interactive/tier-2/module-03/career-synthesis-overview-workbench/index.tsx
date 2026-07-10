"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, BriefcaseBusiness, Clock3, GitMerge, Layers3, RotateCcw, Scale, ShieldCheck } from "lucide-react";
import { workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

type StreamId = "parashari" | "jaimini" | "kp" | "yogas";
type Verdict = "yes" | "mixed" | "no";
type Clarity = "clear" | "marginal";
type ViewMode = "template" | "weighting" | "divergence" | "output";

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

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [BLUE]: "#E3EEF9",
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FDF4E3",
  [VERMILION]: "#F9E8E3",
  [PURPLE]: "#EDE9F6",
};

const STREAMS: Record<StreamId, { label: string; role: string; color: string }> = {
  parashari: { label: "Parashari", role: "10th/lord + D10 primary frame", color: GOLD },
  jaimini: { label: "Jaimini", role: "AmK corroborates function", color: PURPLE },
  kp: { label: "KP", role: "cusp/significators sharpen verdict", color: BLUE },
  yogas: { label: "Yogas", role: "profession type and elevation", color: GREEN },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  template: {
    label: "Template",
    title: "House depth to timing to synthesis",
    body: "Gather 10th/D10, AmK, KP, yogas, and timing layers separately before combining them.",
    icon: <Layers3 size={16} />,
    color: GOLD,
  },
  weighting: {
    label: "Weight",
    title: "Strong streams outweigh marginal streams",
    body: "A clear reading has more weight than a vague one. Streams are not equal votes regardless of quality.",
    icon: <Scale size={16} />,
    color: BLUE,
  },
  divergence: {
    label: "Divergence",
    title: "Name tension; do not average it away",
    body: "A strong yes and a marginal no is a qualified yes with a tension, not a bland arithmetic maybe.",
    icon: <AlertTriangle size={16} />,
    color: VERMILION,
  },
  output: {
    label: "Output",
    title: "Verdict = confidence tier + timing window + ethical frame",
    body: "The final answer states what, how sure, when, and with what agency-preserving framing.",
    icon: <BadgeCheck size={16} />,
    color: GREEN,
  },
};

export function CareerSynthesisOverviewWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("template");
  const [verdicts, setVerdicts] = useState<Record<StreamId, Verdict>>({
    parashari: "yes",
    jaimini: "yes",
    kp: "yes",
    yogas: "yes",
  });
  const [clarity, setClarity] = useState<Record<StreamId, Clarity>>({
    parashari: "clear",
    jaimini: "clear",
    kp: "clear",
    yogas: "clear",
  });
  const [streamsIndependent, setStreamsIndependent] = useState(true);
  const [timingTwoYes, setTimingTwoYes] = useState(true);
  const [ethicalFrame, setEthicalFrame] = useState(true);
  const [averageMode, setAverageMode] = useState(false);

  const weightedScore = useMemo(() => {
    return (Object.keys(STREAMS) as StreamId[]).reduce((sum, stream) => {
      const base = verdicts[stream] === "yes" ? 1 : verdicts[stream] === "mixed" ? 0 : -1;
      const weight = clarity[stream] === "clear" ? 2 : 1;
      return sum + base * weight;
    }, 0);
  }, [clarity, verdicts]);

  const clearYesCount = (Object.keys(STREAMS) as StreamId[]).filter((stream) => verdicts[stream] === "yes" && clarity[stream] === "clear").length;
  const clearNoCount = (Object.keys(STREAMS) as StreamId[]).filter((stream) => verdicts[stream] === "no" && clarity[stream] === "clear").length;
  const hasDivergence = clearYesCount > 0 && (Object.keys(STREAMS) as StreamId[]).some((stream) => verdicts[stream] === "no" || verdicts[stream] === "mixed");
  const methodWarning = averageMode || !streamsIndependent || !ethicalFrame;

  const tier = useMemo(() => {
    if (methodWarning) return "method warning";
    if (clearYesCount >= 3 && clearNoCount === 0 && weightedScore >= 6 && timingTwoYes) return "strong";
    if (weightedScore >= 3 && clearNoCount === 0) return "moderate";
    if (weightedScore >= 1 || hasDivergence) return "weak / qualified";
    return "no-prediction";
  }, [clearNoCount, clearYesCount, hasDivergence, methodWarning, timingTwoYes, weightedScore]);

  const synthesis = useMemo(() => {
    if (!streamsIndependent) return "Contamination warning: read each stream in its own setting first, then compare. Convergence only matters when the readings were independent.";
    if (averageMode) return "Averaging warning: do not flatten convergence and divergence into a numerical mean. Weight clarity and name the tension.";
    if (!ethicalFrame) return "Framing warning: the final career verdict needs agency, scope honesty, and no fear-based certainty.";
    if (tier === "strong") return "Strong-confidence career verdict: the streams clearly converge and timing has the dasha + transit two-yes.";
    if (tier === "moderate") return "Moderate-confidence verdict: most signals support the reading, with some qualification or incomplete timing.";
    if (tier === "weak / qualified") return "Weak or qualified verdict: a real tension or marginality remains, so name it instead of smoothing it away.";
    return "No-prediction is the disciplined answer when the streams are genuinely contradictory or insufficient.";
  }, [averageMode, ethicalFrame, streamsIndependent, tier]);

  return (
    <div data-interactive="career-synthesis-overview-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Career synthesis capstone overview</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Combine streams by confidence, not arithmetic</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Gather each stream separately, weight its clarity, name convergence or divergence, then time and frame the final verdict.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("template");
              setVerdicts({ parashari: "yes", jaimini: "yes", kp: "yes", yogas: "yes" });
              setClarity({ parashari: "clear", jaimini: "clear", kp: "clear", yogas: "clear" });
              setStreamsIndependent(true);
              setTimingTwoYes(true);
              setEthicalFrame(true);
              setAverageMode(false);
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(VIEW_COPY) as ViewMode[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={viewMode === mode} onClick={() => setViewMode(mode)} style={buttonStyle(viewMode === mode, VIEW_COPY[mode].color)}>
              {VIEW_COPY[mode].icon}
              {VIEW_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${VIEW_COPY[viewMode].color}55`, borderRadius: 8, background: `${VIEW_COPY[viewMode].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: VIEW_COPY[viewMode].color, fontSize: "1.12rem" }}>{VIEW_COPY[viewMode].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[viewMode].body}</p>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Synthesis pipeline</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier), fontWeight: 600 }}>weight {weightedScore}</strong>
          </div>
          <SynthesisSvg verdicts={verdicts} clarity={clarity} tier={tier} timingTwoYes={timingTwoYes} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Convergence" body={`${clearYesCount} clear yes`} color={clearYesCount >= 3 ? GREEN : GOLD} icon={<GitMerge size={16} />} />
            <MiniFact title="Divergence" body={hasDivergence ? "named tension" : "none"} color={hasDivergence ? VERMILION : GREEN} icon={<AlertTriangle size={16} />} />
            <MiniFact title="Timing" body={timingTwoYes ? "two-yes" : "missing"} color={timingTwoYes ? GREEN : GOLD} icon={<Clock3 size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Stream verdicts" icon={<BriefcaseBusiness size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {(Object.keys(STREAMS) as StreamId[]).map((stream) => {
                const item = STREAMS[stream];
                return (
                  <div key={stream} style={{ border: `1px solid ${item.color}44`, borderRadius: 8, padding: "0.65rem", background: `${item.color}0D` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                      <div>
                        <strong style={{ color: item.color }}>{item.label}</strong>
                        <p style={{ ...bodyTextStyle, marginTop: "0.25rem" }}>{item.role}</p>
                      </div>
                      <button type="button" onClick={() => setClarity((current) => ({ ...current, [stream]: current[stream] === "clear" ? "marginal" : "clear" }))} style={buttonStyle(clarity[stream] === "clear", item.color)}>
                        {clarity[stream]}
                      </button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.55rem" }}>
                      {(["yes", "mixed", "no"] as Verdict[]).map((verdict) => (
                        <button key={verdict} type="button" aria-pressed={verdicts[stream] === verdict} onClick={() => setVerdicts((current) => ({ ...current, [stream]: verdict }))} style={buttonStyle(verdicts[stream] === verdict, verdictColor(verdict))}>
                          {verdict}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Synthesis discipline</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={streamsIndependent} color={streamsIndependent ? GREEN : VERMILION} icon={<Layers3 size={18} />} title="Streams read independently" body={streamsIndependent ? "Each stream keeps its own setting before comparison." : "Contamination: one stream is nudged to match another."} onClick={() => setStreamsIndependent((value) => !value)} />
            <Toggle active={averageMode} color={averageMode ? VERMILION : GREEN} icon={<Scale size={18} />} title="Average the streams" body={averageMode ? "Error active: averaging erases convergence/divergence." : "Correct: weight by confidence, do not average."} onClick={() => setAverageMode((value) => !value)} />
            <Toggle active={timingTwoYes} color={timingTwoYes ? GREEN : GOLD} icon={<Clock3 size={18} />} title="Timing two-yes" body={timingTwoYes ? "Dasha window and transit trigger are present." : "Static verdict is not fully timed yet."} onClick={() => setTimingTwoYes((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Final output</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={ethicalFrame} color={ethicalFrame ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Ethical frame included" body={ethicalFrame ? "Agency, scope, and likelihood are stated." : "Missing agency or scope honesty."} onClick={() => setEthicalFrame((value) => !value)} />
            <div style={{ border: `1px solid ${tierColor(tier)}66`, borderRadius: 8, background: `${tierColor(tier)}10`, padding: "0.85rem" }}>
              <p style={eyebrowStyle}>Integrated statement</p>
              <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SynthesisSvg({ verdicts, clarity, tier, timingTwoYes }: { verdicts: Record<StreamId, Verdict>; clarity: Record<StreamId, Clarity>; tier: string; timingTwoYes: boolean }) {
  const streamList = Object.keys(STREAMS) as StreamId[];
  return (
    <svg viewBox="0 0 720 390" role="img" aria-label="Career synthesis confidence pipeline" style={{ width: "100%", minHeight: 340, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {streamList.map((stream, index) => {
        const item = STREAMS[stream];
        const x = 85 + index * 170;
        const verdict = verdicts[stream];
        return (
          <g key={stream}>
            <path d={`M ${x} 162 C ${x} 205, ${x < 360 ? 310 : 410} 225, 360 186`} fill="none" stroke={verdictColor(verdict)} strokeWidth={clarity[stream] === "clear" ? 3 : 1.5} strokeDasharray={clarity[stream] === "clear" ? undefined : "5 5"} />
            <circle cx={x} cy="110" r={clarity[stream] === "clear" ? 50 : 40} fill={OPAQUE_LIGHT_FILL[verdictColor(verdict)]} stroke={verdictColor(verdict)} strokeWidth={clarity[stream] === "clear" ? 3 : 1.5} />
            <text x={x} y="106" textAnchor="middle" fill={verdictColor(verdict)} fontSize="16" fontWeight="600">{item.label}</text>
            <text x={x} y="130" textAnchor="middle" fill={INK_MUTED} fontSize="13">{verdict} / {clarity[stream]}</text>
          </g>
        );
      })}
      <circle cx="360" cy="250" r="64" fill={OPAQUE_LIGHT_FILL[tierColor(tier)]} stroke={tierColor(tier)} strokeWidth="3" />
      <text x="360" y="243" textAnchor="middle" fill={tierColor(tier)} fontSize="19" fontWeight="600">Tier</text>
      <text x="360" y="267" textAnchor="middle" fill={INK_MUTED} fontSize="14">{tier}</text>
      <rect x="530" y="245" width="160" height="44" rx="8" fill={timingTwoYes ? OPAQUE_LIGHT_FILL[GREEN] : OPAQUE_LIGHT_FILL[GOLD]} stroke={timingTwoYes ? GREEN : GOLD} />
      <text x="610" y="271" textAnchor="middle" fill={timingTwoYes ? GREEN : GOLD} fontSize="15" fontWeight="600">{timingTwoYes ? "timed" : "untimed"}</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{title}</h3>
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <strong style={{ fontWeight: 600 }}>{title}</strong>
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
        <strong style={{ fontSize: "0.86rem", fontWeight: 600 }}>{title}</strong>
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

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(360px, 1.25fr) minmax(320px, 1fr)",
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

function verdictColor(verdict: Verdict): string {
  if (verdict === "yes") return GREEN;
  if (verdict === "mixed") return GOLD;
  return VERMILION;
}

function tierColor(tier: string): string {
  if (tier === "strong") return GREEN;
  if (tier === "moderate") return BLUE;
  if (tier === "weak / qualified") return GOLD;
  return VERMILION;
}

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
    fontWeight: 600,
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
  };
}
