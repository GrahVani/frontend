"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CalendarClock, GitMerge, HeartHandshake, ListChecks, RotateCcw, Scale, ShieldCheck, Timer, TriangleAlert, UsersRound } from "lucide-react";
import { workbenchTwoColumnStyle, workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

type StepId = "promise" | "delivery" | "timing" | "combine" | "writeup";
type Scenario = "strong" | "obstructed";

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

const STEPS: Record<StepId, { label: string; title: string; body: string; color: string; icon: ReactNode }> = {
  promise: {
    label: "Promise",
    title: "7th CSL judges the marriage promise",
    body: "The main case has 2-7-11 with a minor 6th touch: promised, qualified-positive. The variant has 1-6-10 obstruction.",
    color: PURPLE,
    icon: <Scale size={16} />,
  },
  delivery: {
    label: "Delivery",
    title: "Strong 2-7-11 significators deliver",
    body: "Build the four-fold significators, filter for 2-7-11, and check Rahu/Ketu as agents before timing.",
    color: BLUE,
    icon: <ListChecks size={16} />,
  },
  timing: {
    label: "Timing",
    title: "Significator dasha plus ruling planets gives the window",
    body: "The coming bhukti of a chief marriage significator is yes one. Ruling planets and transit confirming is yes two.",
    color: GREEN,
    icon: <Timer size={16} />,
  },
  combine: {
    label: "Combine",
    title: "KP corroborates the Parashari, Venus, and Jaimini streams",
    body: "Convergence raises confidence. Divergence is named as a qualification instead of being flattened or turned into fear.",
    color: GOLD,
    icon: <GitMerge size={16} />,
  },
  writeup: {
    label: "Write-up",
    title: "State confidence, agency, and timing limits",
    body: "The final note includes promise, delivery, timing, stream comparison, confidence tier, and a window rather than a fixed date.",
    color: BLUE,
    icon: <CalendarClock size={16} />,
  },
};

export function KpMarriageQuestionVerdictLab() {
  const [activeStep, setActiveStep] = useState<StepId>("promise");
  const [scenario, setScenario] = useState<Scenario>("strong");
  const [cslPromise, setCslPromise] = useState(true);
  const [agentsBuilt, setAgentsBuilt] = useState(true);
  const [dashaWindow, setDashaWindow] = useState(true);
  const [rpTransitConfirm, setRpTransitConfirm] = useState(true);
  const [streamsCombined, setStreamsCombined] = useState(true);
  const [agencyFrame, setAgencyFrame] = useState(true);
  const [windowLanguage, setWindowLanguage] = useState(true);
  const [refuseCruelDecree, setRefuseCruelDecree] = useState(true);

  const timed = dashaWindow && rpTransitConfirm;
  const methodOk = agentsBuilt && streamsCombined && agencyFrame && windowLanguage && refuseCruelDecree;
  const strongVerdict = cslPromise && timed && methodOk;
  const warning = !methodOk || (!cslPromise && dashaWindow);
  const score = Math.max(
    5,
    Math.min(
      98,
      18 +
        (cslPromise ? 22 : -16) +
        (agentsBuilt ? 15 : -18) +
        (dashaWindow ? 16 : -5) +
        (rpTransitConfirm ? 16 : -8) +
        (streamsCombined ? 10 : -14) +
        (agencyFrame ? 8 : -18) +
        (windowLanguage ? 7 : -18) +
        (refuseCruelDecree ? 6 : -22),
    ),
  );

  const verdict = useMemo(() => {
    if (!methodOk) return "method warning";
    if (strongVerdict) return "strong confirmed window";
    if (!cslPromise) return "qualified obstruction";
    if (!timed) return "promised but not timed";
    return "qualified reading";
  }, [cslPromise, methodOk, strongVerdict, timed]);

  const statement = useMemo(() => {
    if (!agentsBuilt) return "Pause: the CSL promise has been read, but the delivery agents have not been built. List the 2-7-11 significators and include node agency before timing.";
    if (!streamsCombined) return "Pause: KP is being used as a single-stream verdict. Combine it with the Parashari, Venus, and Jaimini readings.";
    if (!refuseCruelDecree) return "Pause: obstruction must not become a permanent denial statement. Use delay, obstruction, or non-standard path language.";
    if (!agencyFrame) return "Pause: the client-facing statement needs agency and care, not fear.";
    if (!windowLanguage) return "Pause: the timing is becoming an exact-date decree. State a bhukti or antara span as a likelihood window.";
    if (!cslPromise) return "KP shows obstruction or delay through the 7th CSL, with weaker delivery and qualified timing. Name the qualification, compare the other streams, and frame it as patience and care rather than finality.";
    if (!timed) return "The KP promise is positive, but the dasha/ruling-planet two-yes is not complete. Marriage is supported, but this is not the clean timing window.";
    return "KP gives a qualified-positive promise, strong 2-7-11 delivery agents, and a significator bhukti confirmed by ruling planets and transit. Since the other streams converge, present a strong window of likelihood with a minor effort note.";
  }, [agencyFrame, agentsBuilt, cslPromise, refuseCruelDecree, streamsCombined, timed, windowLanguage]);

  return (
    <div data-interactive="kp-marriage-question-verdict-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Full KP marriage question</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Build promise, delivery, timing, and the final write-up</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Walk the chapter capstone: 7th CSL promise, 2-7-11 significators, DBA plus ruling planets, stream comparison, and agency-framed timing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveStep("promise");
              setScenario("strong");
              setCslPromise(true);
              setAgentsBuilt(true);
              setDashaWindow(true);
              setRpTransitConfirm(true);
              setStreamsCombined(true);
              setAgencyFrame(true);
              setWindowLanguage(true);
              setRefuseCruelDecree(true);
            }}
            style={buttonStyle(false, PURPLE)}
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
          <h3 style={{ margin: 0, color: STEPS[activeStep].color, fontSize: "1.12rem" }}>{STEPS[activeStep].title}</h3>
          <p style={bodyTextStyle}>{STEPS[activeStep].body}</p>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>KP case verdict</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdictColor(verdict), fontSize: "1.2rem" }}>{verdict}</h3>
            </div>
            <strong style={{ color: verdictColor(verdict) }}>{score}% coherence</strong>
          </div>
          <MarriageKpPipelineSvg activeStep={activeStep} cslPromise={cslPromise} agentsBuilt={agentsBuilt} dashaWindow={dashaWindow} rpTransitConfirm={rpTransitConfirm} streamsCombined={streamsCombined} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Promise" body={cslPromise ? "2-7-11 + minor 6th" : "1-6-10 obstruction"} color={cslPromise ? GREEN : GOLD} icon={<Scale size={16} />} />
            <MiniFact title="Delivery" body={agentsBuilt ? "2-7-11 agents" : "missing agents"} color={agentsBuilt ? BLUE : VERMILION} icon={<UsersRound size={16} />} />
            <MiniFact title="Timing" body={timed ? "two yes" : "not complete"} color={timed ? GREEN : GOLD} icon={<Timer size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Load worked case" icon={<HeartHandshake size={18} />} color={scenario === "strong" ? GREEN : GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={scenario === "strong"} onClick={() => {
                setScenario("strong");
                setCslPromise(true);
                setAgentsBuilt(true);
                setDashaWindow(true);
                setRpTransitConfirm(true);
              }} style={buttonStyle(scenario === "strong", GREEN)}>
                Strong main case
              </button>
              <button type="button" aria-pressed={scenario === "obstructed"} onClick={() => {
                setScenario("obstructed");
                setCslPromise(false);
                setAgentsBuilt(true);
                setDashaWindow(false);
                setRpTransitConfirm(false);
              }} style={buttonStyle(scenario === "obstructed", GOLD)}>
                Obstructed variant
              </button>
            </div>
            <p style={bodyTextStyle}>The main case is promised and well-timed. The variant demonstrates obstruction/delay with agency, not fear.</p>
          </Panel>

          <Panel title="Case answer" icon={<BadgeCheck size={18} />} color={verdictColor(verdict)}>
            <p style={bodyTextStyle}>{statement}</p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>KP workflow switches</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={cslPromise} color={cslPromise ? GREEN : GOLD} icon={<Scale size={18} />} title="7th CSL promise" body={cslPromise ? "Supportive 2-7-11 with minor effort note." : "Obstruction/delay path is active."} onClick={() => setCslPromise((value) => !value)} />
            <Toggle active={agentsBuilt} color={agentsBuilt ? GREEN : VERMILION} icon={<ListChecks size={18} />} title="Significators built" body={agentsBuilt ? "Chief 2-7-11 agents and nodes are checked." : "Delivery layer is missing."} onClick={() => setAgentsBuilt((value) => !value)} />
            <Toggle active={dashaWindow} color={dashaWindow ? GREEN : GOLD} icon={<Timer size={18} />} title="Significator bhukti/antara" body={dashaWindow ? "Running period belongs to chief marriage agent." : "Running period is not a clean marriage window."} onClick={() => setDashaWindow((value) => !value)} />
            <Toggle active={rpTransitConfirm} color={rpTransitConfirm ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="RP and transit confirm" body={rpTransitConfirm ? "Two-yes timing is met." : "Second yes is absent."} onClick={() => setRpTransitConfirm((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Presentation guardrails</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={streamsCombined} color={streamsCombined ? GREEN : VERMILION} icon={<GitMerge size={18} />} title="Combined with streams" body={streamsCombined ? "Parashari, Venus, and Jaimini are included." : "KP is being used alone."} onClick={() => setStreamsCombined((value) => !value)} />
            <Toggle active={refuseCruelDecree} color={refuseCruelDecree ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Cruel decree refused" body={refuseCruelDecree ? "Obstruction is delay or qualification, not permanence." : "Obstruction is being phrased harmfully."} onClick={() => setRefuseCruelDecree((value) => !value)} />
            <Toggle active={windowLanguage} color={windowLanguage ? GREEN : VERMILION} icon={<CalendarClock size={18} />} title="Window, not date" body={windowLanguage ? "Timing is presented as a span of likelihood." : "False precision date is active."} onClick={() => setWindowLanguage((value) => !value)} />
            <Toggle active={agencyFrame} color={agencyFrame ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="Agency frame" body={agencyFrame ? "The statement informs without fear." : "The statement is losing care."} onClick={() => setAgencyFrame((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdictColor(verdict)}66`, background: `${verdictColor(verdict)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {warning ? <TriangleAlert size={20} color={verdictColor(verdict)} aria-hidden="true" /> : <HeartHandshake size={20} color={verdictColor(verdict)} aria-hidden="true" />}
          <div>
            <p style={eyebrowStyle}>Final write-up voice</p>
            <h3 style={{ margin: "0.15rem 0 0", color: verdictColor(verdict), fontSize: "1.16rem" }}>{verdict}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MarriageKpPipelineSvg({ activeStep, cslPromise, agentsBuilt, dashaWindow, rpTransitConfirm, streamsCombined }: { activeStep: StepId; cslPromise: boolean; agentsBuilt: boolean; dashaWindow: boolean; rpTransitConfirm: boolean; streamsCombined: boolean }) {
  const nodes = [
    { id: "promise" as StepId, x: 82, label: "Promise", body: cslPromise ? "2-7-11" : "1-6-10", color: cslPromise ? GREEN : GOLD, active: cslPromise },
    { id: "delivery" as StepId, x: 232, label: "Delivery", body: agentsBuilt ? "agents built" : "missing", color: agentsBuilt ? BLUE : VERMILION, active: agentsBuilt },
    { id: "timing" as StepId, x: 382, label: "Timing", body: dashaWindow && rpTransitConfirm ? "two yes" : "qualified", color: dashaWindow && rpTransitConfirm ? GREEN : GOLD, active: dashaWindow && rpTransitConfirm },
    { id: "combine" as StepId, x: 532, label: "Streams", body: streamsCombined ? "converge" : "isolated", color: streamsCombined ? PURPLE : VERMILION, active: streamsCombined },
    { id: "writeup" as StepId, x: 682, label: "Write-up", body: "window", color: GOLD, active: true },
  ];
  return (
    <svg viewBox="0 0 780 460" role="img" aria-label="Full KP marriage promise delivery timing and write-up pipeline" style={{ width: "100%", minHeight: 360, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="424" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {nodes.slice(0, -1).map((node, index) => (
        <path key={`${node.id}-line`} d={`M ${node.x + 64} 165 L ${nodes[index + 1].x - 64} 165`} stroke={node.active ? node.color : HAIRLINE} strokeWidth="4" strokeDasharray={node.active ? "0" : "8 8"} />
      ))}
      {nodes.map((node) => (
        <g key={node.id}>
          <rect x={node.x - 66} y="105" width="132" height="120" rx="8" fill={activeStep === node.id ? OPAQUE_LIGHT_FILL[node.color] : "transparent"} stroke={activeStep === node.id ? node.color : HAIRLINE} strokeWidth={activeStep === node.id ? 3 : 1.2} />
          <circle cx={node.x} cy="138" r="19" fill={node.active ? node.color : "transparent"} stroke={node.color} strokeWidth="2.5" />
          <text x={node.x} y="145" textAnchor="middle" fill={node.active ? "#fff" : node.color} fontSize="15" fontWeight="700">{node.active ? "Y" : "-"}</text>
          <text x={node.x} y="177" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="700">{node.label}</text>
          <text x={node.x} y="201" textAnchor="middle" fill={INK_SECONDARY} fontSize="12.5" fontWeight="600">{node.body}</text>
        </g>
      ))}
      <rect x="114" y="315" width="552" height="44" rx="8" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={GOLD} strokeWidth="2" />
      <text x="390" y="343" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="700">Promise to delivery to timing to stream comparison to write-up</text>
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
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <strong style={{ fontWeight: 700 }}>{title}</strong>
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
        <strong style={{ fontSize: "0.86rem", fontWeight: 700 }}>{title}</strong>
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

function verdictColor(verdict: string): string {
  if (verdict === "strong confirmed window") return GREEN;
  if (verdict === "qualified obstruction") return GOLD;
  if (verdict === "promised but not timed") return GOLD;
  if (verdict === "qualified reading") return BLUE;
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
  };
}
