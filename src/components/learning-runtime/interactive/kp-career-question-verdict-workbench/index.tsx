"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, BriefcaseBusiness, Clock3, GitMerge, RotateCcw, Scale, ShieldCheck, Users } from "lucide-react";

type StepId = "csl" | "agents" | "timing" | "verdict";
type Scenario = "converged" | "notRipe";

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
  [GREEN]: "#E8F5E9",
  [BLUE]: "#E3F2FD",
  [PURPLE]: "#EDE7F6",
  [VERMILION]: "#FFEBEE",
  [GOLD]: "#FFF3E0",
};

const STEPS: Record<StepId, { label: string; title: string; body: string; color: string; icon: ReactNode }> = {
  csl: {
    label: "A. CSL",
    title: "The judge promises a favourable salaried change",
    body: "10th CSL signifies 10, 6, 11 and the 6th CSL signifies 6, 10, 2. The 6th is prominent, so the type is salaried/service rather than business.",
    color: GOLD,
    icon: <Scale size={16} />,
  },
  agents: {
    label: "B. Agents",
    title: "Mercury, Saturn, and Rahu carry the work field",
    body: "The strongest 10th/6th significators are Mercury and Saturn, with Rahu as a powerful agent. The field reads structured, analytical, service-oriented, with a technological or unconventional edge.",
    color: BLUE,
    icon: <Users size={16} />,
  },
  timing: {
    label: "C. Timing",
    title: "Dasha window plus ruling planets decide now or not",
    body: "Saturn/Mercury running periods are career significators, and the ruling planets include Mercury, Saturn, and Rahu. In the variant, both timing confirmations are absent.",
    color: GREEN,
    icon: <Clock3 size={16} />,
  },
  verdict: {
    label: "D. Verdict",
    title: "The KP voice is crisp, but still one cross-checking voice",
    body: "A complete KP answer separates promise from timing and then carries the result to the four-stream capstone instead of overriding other streams.",
    color: PURPLE,
    icon: <GitMerge size={16} />,
  },
};

export function KpCareerQuestionVerdictWorkbench() {
  const [activeStep, setActiveStep] = useState<StepId>("csl");
  const [scenario, setScenario] = useState<Scenario>("converged");
  const [cslPromise, setCslPromise] = useState(true);
  const [agentsBuilt, setAgentsBuilt] = useState(true);
  const [dashaWindow, setDashaWindow] = useState(true);
  const [rpConfirm, setRpConfirm] = useState(true);
  const [kpSettings, setKpSettings] = useState(true);
  const [layerVoice, setLayerVoice] = useState(true);

  const timingNow = dashaWindow && rpConfirm;
  const completeMethod = cslPromise && agentsBuilt && kpSettings && layerVoice;
  const converged = completeMethod && timingNow;
  const warning = !kpSettings || !agentsBuilt || !layerVoice;
  const score = Math.max(6, Math.min(98, 18 + (cslPromise ? 20 : 0) + (agentsBuilt ? 18 : 0) + (dashaWindow ? 20 : 0) + (rpConfirm ? 20 : 0) - (!kpSettings ? 40 : 0) - (!layerVoice ? 18 : 0)));

  const synthesis = useMemo(() => {
    if (!kpSettings) return "Invalid process: the worked example must stay in KP ayanamsha, Placidus cusps, and the correct ruling-planet settings.";
    if (!agentsBuilt) return "Incomplete process: the CSL has judged promise, but the significator agents have not been built, so the field and timing lords are not grounded.";
    if (!layerVoice) return "Layering warning: the KP verdict is the fourth cross-checking voice. It should not override Parashari 10th/D10 or Jaimini AmK.";
    if (cslPromise && timingNow) return "Full KP verdict: favourable salaried job change is promised, Mercury/Saturn/Rahu carry the field, and the Saturn/Mercury period plus confirming RPs make it timed now.";
    if (cslPromise && !timingNow) return "Variant verdict: favourable salaried job change is promised, but it is not timed now. This is promised but not ripe.";
    return "The static promise is weak or uncertain, so do not force a favourable career verdict even if a timing signal appears.";
  }, [agentsBuilt, cslPromise, kpSettings, layerVoice, timingNow]);

  return (
    <div data-interactive="kp-career-question-verdict-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Full KP career question</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>Build the verdict from judge, agents, and timing</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Walk the lesson example from CSL promise through significators and ruling planets, then compare it with the promised-but-not-ripe variant.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveStep("csl");
              setScenario("converged");
              setCslPromise(true);
              setAgentsBuilt(true);
              setDashaWindow(true);
              setRpConfirm(true);
              setKpSettings(true);
              setLayerVoice(true);
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
          {(Object.keys(STEPS) as StepId[]).map((step) => (
            <button key={step} type="button" aria-pressed={activeStep === step} onClick={() => setActiveStep(step)} style={buttonStyle(activeStep === step, STEPS[step].color)}>
              {STEPS[step].icon}
              {STEPS[step].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${STEPS[activeStep].color}55`, borderRadius: 8, background: `${STEPS[activeStep].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: STEPS[activeStep].color, fontSize: "1.12rem", fontWeight: 600 }}>{STEPS[activeStep].title}</h3>
          <p style={bodyTextStyle}>{STEPS[activeStep].body}</p>
        </div>
      </section>

      <div style={diagramLayoutStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Verdict pipeline</p>
              <h3 style={{ margin: "0.15rem 0 0", color: converged ? GREEN : warning ? VERMILION : GOLD, fontSize: "1.2rem", fontWeight: 600 }}>
                {converged ? "Favourable and timed now" : warning ? "Method guard active" : "Promised but not ripe"}
              </h3>
            </div>
            <span style={{ color: converged ? GREEN : warning ? VERMILION : GOLD, fontWeight: 600 }}>{score}% KP coherence</span>
          </div>
          <PipelineSvg activeStep={activeStep} cslPromise={cslPromise} agentsBuilt={agentsBuilt} dashaWindow={dashaWindow} rpConfirm={rpConfirm} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="CSL" body="10/6/11 and 6/10/2" color={GOLD} icon={<Scale size={16} />} />
            <MiniFact title="Agents" body="Mercury + Saturn + Rahu" color={BLUE} icon={<Users size={16} />} />
            <MiniFact title="Timing" body={timingNow ? "two yes" : "not ripe"} color={timingNow ? GREEN : VERMILION} icon={<Clock3 size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Load worked variant" icon={<BriefcaseBusiness size={18} />} color={scenario === "converged" ? GREEN : VERMILION}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={scenario === "converged"} onClick={() => {
                setScenario("converged");
                setCslPromise(true);
                setAgentsBuilt(true);
                setDashaWindow(true);
                setRpConfirm(true);
              }} style={buttonStyle(scenario === "converged", GREEN)}>
                Converged verdict
              </button>
              <button type="button" aria-pressed={scenario === "notRipe"} onClick={() => {
                setScenario("notRipe");
                setCslPromise(true);
                setAgentsBuilt(true);
                setDashaWindow(false);
                setRpConfirm(false);
              }} style={buttonStyle(scenario === "notRipe", VERMILION)}>
                Promised, not ripe
              </button>
            </div>
            <p style={bodyTextStyle}>Both variants keep the same favourable CSL promise. Only the timing confirmations change.</p>
          </Panel>

          <Panel title="Lesson answer" icon={<BadgeCheck size={18} />} color={converged ? GREEN : GOLD}>
            <p style={bodyTextStyle}>{synthesis}</p>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Process switches</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={cslPromise} color={cslPromise ? GREEN : VERMILION} icon={<Scale size={18} />} title="CSL promise" body={cslPromise ? "10th and 6th CSLs promise salaried job change." : "Promise is weak; do not force a favourable verdict."} onClick={() => setCslPromise((value) => !value)} />
            <Toggle active={agentsBuilt} color={agentsBuilt ? GREEN : VERMILION} icon={<Users size={18} />} title="Significator agents" body={agentsBuilt ? "Mercury, Saturn, and Rahu define the field and timing lords." : "Agents skipped; the method is incomplete."} onClick={() => setAgentsBuilt((value) => !value)} />
            <Toggle active={dashaWindow} color={dashaWindow ? GREEN : GOLD} icon={<Clock3 size={18} />} title="Dasha window" body={dashaWindow ? "Running Saturn/Mercury are career significators." : "Running lords are not career significators."} onClick={() => setDashaWindow((value) => !value)} />
            <Toggle active={rpConfirm} color={rpConfirm ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="RP confirmation" body={rpConfirm ? "RPs include Mercury, Saturn, and Rahu." : "RPs do not overlap the career agents."} onClick={() => setRpConfirm((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Reading discipline</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={kpSettings} color={kpSettings ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="KP settings throughout" body={kpSettings ? "KP ayanamsha, Placidus, and correct vara are preserved." : "Wrong settings invalidate CSL, agents, and RPs."} onClick={() => setKpSettings((value) => !value)} />
            <Toggle active={layerVoice} color={layerVoice ? GREEN : VERMILION} icon={<GitMerge size={18} />} title="Fourth cross-checking voice" body={layerVoice ? "KP is layered with Parashari, D10, and Jaimini." : "Error: KP is being treated as the sole authority."} onClick={() => setLayerVoice((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: converged ? `${GREEN}66` : warning ? `${VERMILION}66` : `${GOLD}66`, background: converged ? `${GREEN}10` : warning ? `${VERMILION}0F` : `${GOLD}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <AlertTriangle size={20} color={converged ? GREEN : warning ? VERMILION : GOLD} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Final KP voice</p>
            <h3 style={{ margin: "0.15rem 0 0", color: converged ? GREEN : warning ? VERMILION : GOLD, fontSize: "1.16rem", fontWeight: 600 }}>
              {converged ? "Favourable salaried job change, timed now" : warning ? "Repair the method before presenting" : "Favourable, but not timed now"}
            </h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PipelineSvg({ activeStep, cslPromise, agentsBuilt, dashaWindow, rpConfirm }: { activeStep: StepId; cslPromise: boolean; agentsBuilt: boolean; dashaWindow: boolean; rpConfirm: boolean }) {
  const nodes = [
    { id: "csl" as StepId, x: 100, label: "CSL judge", body: cslPromise ? "favourable job" : "weak promise", color: cslPromise ? GOLD : VERMILION, active: cslPromise },
    { id: "agents" as StepId, x: 275, label: "Agents", body: agentsBuilt ? "Mercury Saturn Rahu" : "not built", color: agentsBuilt ? BLUE : VERMILION, active: agentsBuilt },
    { id: "timing" as StepId, x: 450, label: "Timing", body: dashaWindow && rpConfirm ? "two yes" : "not ripe", color: dashaWindow && rpConfirm ? GREEN : GOLD, active: dashaWindow && rpConfirm },
    { id: "verdict" as StepId, x: 625, label: "KP voice", body: cslPromise && agentsBuilt && dashaWindow && rpConfirm ? "timed now" : "separate timing", color: PURPLE, active: true },
  ];
  const halfW = 80;
  return (
    <svg viewBox="0 0 720 350" role="img" aria-label="Full KP career verdict pipeline" style={{ width: "100%", minHeight: 280, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="314" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {nodes.slice(0, -1).map((node, index) => (
        <path key={`${node.id}-line`} d={`M ${node.x + halfW} 148 L ${nodes[index + 1].x - halfW} 148`} stroke={node.active ? node.color : HAIRLINE} strokeWidth="3" markerEnd="url(#arrowVerdict)" />
      ))}
      {nodes.map((node) => (
        <g key={node.id}>
          <rect x={node.x - halfW} y="80" width={halfW * 2} height="116" rx="8" fill={activeStep === node.id ? OPAQUE_LIGHT_FILL[node.color] || `${node.color}1F` : OPAQUE_LIGHT_FILL[node.color] || `${node.color}10`} stroke={activeStep === node.id ? node.color : HAIRLINE} strokeWidth={activeStep === node.id ? 3 : 1} />
          <circle cx={node.x} cy="110" r="16" fill={node.active ? node.color : "transparent"} stroke={node.color} strokeWidth="2" />
          <text x={node.x} y="115" textAnchor="middle" fill={node.active ? "#fff" : node.color} fontSize="16" fontWeight="600">{node.active ? "Y" : "-"}</text>
          <text x={node.x} y="145" textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="600">{node.label}</text>
          <text x={node.x} y="168" textAnchor="middle" fill={INK_MUTED} fontSize="15">{node.body}</text>
        </g>
      ))}
      <rect x="160" y="240" width="400" height="42" rx="8" fill={`${GOLD}10`} stroke={HAIRLINE} />
      <text x="360" y="267" textAnchor="middle" fill={INK_SECONDARY} fontSize="15">Keep promise, agents, and timing as separate judgments</text>
      <defs>
        <marker id="arrowVerdict" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={GREEN} />
        </marker>
      </defs>
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
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
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
        <span style={{ fontSize: "0.86rem", fontWeight: 600 }}>{title}</span>
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
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
  gap: "1rem",
};

const diagramLayoutStyle: CSSProperties = {
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
    fontWeight: 500,
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
