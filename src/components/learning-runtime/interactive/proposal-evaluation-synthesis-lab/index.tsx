"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, GitCompare, HeartHandshake, Layers3, RotateCcw, Scale, ShieldCheck, TriangleAlert, Users } from "lucide-react";
import { workbenchTwoColumnStyle, workbenchDiagramLayoutStyle } from "../lib/layouts";

type ScenarioId = "soundProposal" | "divergentConcern" | "singleNumberError" | "manglikScare" | "scopeRoute";
type ViewMode = "promises" | "compatibility" | "manglik" | "divergence" | "frame";

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

const SCENARIOS: Record<
  ScenarioId,
  {
    label: string;
    title: string;
    bothPromises: boolean;
    bhakutaCancelled: boolean;
    manglikCancelled: boolean;
    divergence: boolean;
    singleNumber: boolean;
    scopeFlag: boolean;
    color: string;
    context: string;
  }
> = {
  soundProposal: {
    label: "Sound proposal",
    title: "Both promises and cancellations support the match",
    bothPromises: true,
    bhakutaCancelled: true,
    manglikCancelled: true,
    divergence: false,
    singleNumber: false,
    scopeFlag: false,
    color: GREEN,
    context: "Her promise is strong, his is sound, 19/36 is improved by Bhakuta cancellation, and Manglik is cancelled twice.",
  },
  divergentConcern: {
    label: "Divergent case",
    title: "Good compatibility but natal/partner concern",
    bothPromises: false,
    bhakutaCancelled: true,
    manglikCancelled: true,
    divergence: true,
    singleNumber: false,
    scopeFlag: false,
    color: GOLD,
    context: "The compatibility looks fine, but D9/Venus and partner-significations raise a real concern that must be named.",
  },
  singleNumberError: {
    label: "Score verdict",
    title: "The 19/36 number is misused as verdict",
    bothPromises: true,
    bhakutaCancelled: false,
    manglikCancelled: true,
    divergence: false,
    singleNumber: true,
    scopeFlag: false,
    color: VERMILION,
    context: "The practitioner treats 19/36 as borderline instead of reading distribution and cancelled Bhakuta.",
  },
  manglikScare: {
    label: "Manglik scare",
    title: "Manglik is declared before cancellations",
    bothPromises: true,
    bhakutaCancelled: true,
    manglikCancelled: false,
    divergence: false,
    singleNumber: false,
    scopeFlag: false,
    color: VERMILION,
    context: "Mars in the 7th from Moon is used to frighten the family while own-sign and mutual cancellations are skipped.",
  },
  scopeRoute: {
    label: "Scope route",
    title: "Disclosure pauses the proposal analysis",
    bothPromises: true,
    bhakutaCancelled: true,
    manglikCancelled: true,
    divergence: false,
    singleNumber: false,
    scopeFlag: true,
    color: PURPLE,
    context: "If coercion, abuse, crisis, or severe distress is disclosed, the analysis pauses and routes to appropriate support.",
  },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  promises: {
    label: "Promises",
    title: "Both natal promises come first",
    body: "Two independently sound marriage promises are the foundation for a robust pairing assessment.",
    icon: <Users size={16} />,
    color: BLUE,
  },
  compatibility: {
    label: "Score",
    title: "Read the score by distribution and cancellations",
    body: "The 19/36 number understates the match when Bhakuta is cancelled and Graha-Maitri is full.",
    icon: <Scale size={16} />,
    color: GOLD,
  },
  manglik: {
    label: "Manglik",
    title: "Check cancellations before speaking",
    body: "Own-sign Mars and both-Manglik mutual cancellation defuse the Manglik concern in the worked case.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  divergence: {
    label: "Divergence",
    title: "Good compatibility cannot hide a real natal concern",
    body: "When layers diverge, name both sides, lower confidence, and avoid both scare and rubber-stamp.",
    icon: <GitCompare size={16} />,
    color: PURPLE,
  },
  frame: {
    label: "Agency",
    title: "Return the decision to the couple",
    body: "The output is a qualitative, multi-dimensional assessment, not compatible/incompatible as a decree.",
    icon: <HeartHandshake size={16} />,
    color: VERMILION,
  },
};

export function ProposalEvaluationSynthesisLab() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("soundProposal");
  const [viewMode, setViewMode] = useState<ViewMode>("compatibility");
  const [bothPromises, setBothPromises] = useState(true);
  const [readDistribution, setReadDistribution] = useState(true);
  const [bhakutaCancelled, setBhakutaCancelled] = useState(true);
  const [manglikCancelled, setManglikCancelled] = useState(true);
  const [nameDivergence, setNameDivergence] = useState(false);
  const [agencyFrame, setAgencyFrame] = useState(true);
  const [singleNumberVerdict, setSingleNumberVerdict] = useState(false);
  const [scopeFlag, setScopeFlag] = useState(false);

  const scenario = SCENARIOS[scenarioId];
  const methodOk = bothPromises && readDistribution && bhakutaCancelled && manglikCancelled && agencyFrame && !singleNumberVerdict && !scopeFlag;
  const scoreMeaning = readDistribution && bhakutaCancelled ? "effective strong" : "raw 19 only";
  const cancellations = [bhakutaCancelled, manglikCancelled].filter(Boolean).length;

  const verdict = useMemo(() => {
    if (scopeFlag) return { label: "route before proposal verdict", color: PURPLE };
    if (singleNumberVerdict || !readDistribution) return { label: "single-number warning", color: VERMILION };
    if (!manglikCancelled) return { label: "Manglik cancellation missing", color: VERMILION };
    if (!bothPromises || nameDivergence) return { label: "mixed proposal picture", color: GOLD };
    if (methodOk) return { label: "sound workable match", color: GREEN };
    return { label: "method repair needed", color: BLUE };
  }, [bothPromises, manglikCancelled, methodOk, nameDivergence, readDistribution, scopeFlag, singleNumberVerdict]);

  const statement = useMemo(() => {
    if (scopeFlag) return "Pause the compatibility analysis and route the client to appropriate safety, legal, or mental-health support.";
    if (singleNumberVerdict || !readDistribution) return "Repair the reading: 19/36 is not the verdict. Read distribution, Graha-Maitri, Yoni, Gana, and Bhakuta cancellation.";
    if (!manglikCancelled) return "Pause: Manglik cannot be discussed before checking own-sign and mutual cancellation in this case.";
    if (!bothPromises || nameDivergence) return "Mixed synthesis: compatibility may look fine, but a natal or partner-signification concern lowers confidence. Name both sides and return agency.";
    return "Final assessment: both promises are sound, effective compatibility is strong despite the raw 19, Manglik is cancelled twice, and the pairing looks workable with agency returned.";
  }, [bothPromises, manglikCancelled, nameDivergence, readDistribution, scopeFlag, singleNumberVerdict]);

  function loadScenario(id: ScenarioId) {
    const next = SCENARIOS[id];
    setScenarioId(id);
    setBothPromises(next.bothPromises);
    setReadDistribution(!next.singleNumber);
    setBhakutaCancelled(next.bhakutaCancelled);
    setManglikCancelled(next.manglikCancelled);
    setNameDivergence(next.divergence);
    setAgencyFrame(true);
    setSingleNumberVerdict(next.singleNumber);
    setScopeFlag(next.scopeFlag);
  }

  return (
    <div data-interactive="proposal-evaluation-synthesis-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked synthesis: proposal evaluation</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 700 }}>Assess the pairing, not a single number</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Compare both natal promises, read compatibility by distribution and cancellations, clear Manglik properly, then frame a qualitative assessment with agency.
            </p>
          </div>
          <button type="button" onClick={() => { setViewMode("compatibility"); loadScenario("soundProposal"); }} style={buttonStyle(false, PURPLE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button key={id} type="button" aria-pressed={scenarioId === id} onClick={() => loadScenario(id)} style={buttonStyle(scenarioId === id, SCENARIOS[id].color)}>
              <HeartHandshake size={16} aria-hidden="true" />
              {SCENARIOS[id].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${scenario.color}55`, borderRadius: 8, background: `${scenario.color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: scenario.color, fontSize: "1.08rem", fontWeight: 700 }}>{scenario.title}</h3>
          <p style={bodyTextStyle}>{scenario.context}</p>
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
          <h3 style={{ margin: 0, color: VIEW_COPY[viewMode].color, fontSize: "1.05rem", fontWeight: 700 }}>{VIEW_COPY[viewMode].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[viewMode].body}</p>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Proposal synthesis</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 700 }}>{verdict.label}</h3>
            </div>
            <span style={{ color: verdict.color, fontWeight: 700 }}>{cancellations}/2 cancellations</span>
          </div>
          <ProposalSynthesisSvg bothPromises={bothPromises} readDistribution={readDistribution} bhakutaCancelled={bhakutaCancelled} manglikCancelled={manglikCancelled} methodOk={methodOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Promises" body={bothPromises ? "both sound" : "mixed"} color={bothPromises ? GREEN : GOLD} icon={<Users size={16} />} />
            <MiniFact title="Score" body={scoreMeaning} color={readDistribution ? GREEN : VERMILION} icon={<Scale size={16} />} />
            <MiniFact title="Manglik" body={manglikCancelled ? "cancelled" : "unchecked"} color={manglikCancelled ? GREEN : VERMILION} icon={<ShieldCheck size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Worked-case layers" icon={<Layers3 size={18} />} color={verdict.color}>
            <LayerRow label="Her promise" body="Strong, as established in the prior timing synthesis." color={GREEN} />
            <LayerRow label="His promise" body="Sound: 7th-lord well placed, Venus reasonable, D9 7th supported." color={GREEN} />
            <LayerRow label="Ashta-kuta" body="Raw 19/36; Graha-Maitri full; Bhakuta loss cancelled by friendly rashi lords." color={bhakutaCancelled ? GREEN : VERMILION} />
            <LayerRow label="Manglik" body="Mars in 7th from Moon, cancelled by own sign and mutual Manglik." color={manglikCancelled ? GREEN : VERMILION} />
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Method controls</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={bothPromises} color={bothPromises ? GREEN : GOLD} icon={<Users size={18} />} title="Both promises checked" body={bothPromises ? "Both charts are assessed independently." : "One promise layer is weak or skipped."} onClick={() => setBothPromises((value) => !value)} />
            <Toggle active={readDistribution} color={readDistribution ? GREEN : VERMILION} icon={<Scale size={18} />} title="Read score distribution" body={readDistribution ? "Graha-Maitri and Bhakuta cancellation are visible." : "Raw number is being overused."} onClick={() => setReadDistribution((value) => !value)} />
            <Toggle active={bhakutaCancelled} color={bhakutaCancelled ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="Bhakuta cancellation applied" body={bhakutaCancelled ? "Friendly rashi lords modify the raw score." : "Point-loss is left unmodified."} onClick={() => setBhakutaCancelled((value) => !value)} />
            <Toggle active={manglikCancelled} color={manglikCancelled ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Manglik cancellations checked" body={manglikCancelled ? "Own-sign and mutual cancellation applied." : "Manglik scare is not defused."} onClick={() => setManglikCancelled((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Framing and divergence</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={nameDivergence} color={nameDivergence ? GOLD : GREEN} icon={<GitCompare size={18} />} title="Name divergence" body={nameDivergence ? "Mixed layers are presented honestly." : "No divergence in clean case."} onClick={() => setNameDivergence((value) => !value)} />
            <Toggle active={agencyFrame} color={agencyFrame ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="Agency frame" body={agencyFrame ? "Decision remains with the couple." : "Reading is becoming a decree."} onClick={() => setAgencyFrame((value) => !value)} />
            <Toggle active={singleNumberVerdict} color={singleNumberVerdict ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Single-number verdict" body={singleNumberVerdict ? "Error active: score is the verdict." : "No pass/fail number."} onClick={() => setSingleNumberVerdict((value) => !value)} />
            <Toggle active={scopeFlag} color={scopeFlag ? PURPLE : GREEN} icon={<TriangleAlert size={18} />} title="Scope disclosure" body={scopeFlag ? "Pause and route before continuing." : "No scope interruption."} onClick={() => setScopeFlag((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdict.color}66`, background: `${verdict.color}10` }}>
        <p style={eyebrowStyle}>Practice statement</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 700 }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
      </section>
    </div>
  );
}

function ProposalSynthesisSvg({ bothPromises, readDistribution, bhakutaCancelled, manglikCancelled, methodOk }: { bothPromises: boolean; readDistribution: boolean; bhakutaCancelled: boolean; manglikCancelled: boolean; methodOk: boolean }) {
  const nodes = [
    { label: "Promises", active: bothPromises, x: 95, color: BLUE },
    { label: "19/36", active: readDistribution, x: 245, color: GOLD },
    { label: "Bhakuta", active: bhakutaCancelled, x: 395, color: GREEN },
    { label: "Manglik", active: manglikCancelled, x: 545, color: PURPLE },
    { label: "Agency", active: methodOk, x: 695, color: VERMILION },
  ];
  return (
    <svg viewBox="0 0 790 390" role="img" aria-label="Proposal evaluation synthesis flow" style={{ width: "100%", minHeight: 300, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="754" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="395" y="52" textAnchor="middle" fill={GOLD} fontSize="15" fontWeight="700">BOTH PROMISES PLUS CANCELLATIONS BEFORE ASSESSMENT</text>
      <line x1="95" y1="145" x2="695" y2="145" stroke={HAIRLINE} strokeWidth="4" />
      {nodes.map((node, index) => {
        const stroke = node.active ? node.color : VERMILION;
        return (
          <g key={node.label}>
            {index < nodes.length - 1 ? <path d={`M ${node.x + 46} 145 L ${nodes[index + 1].x - 52} 145`} stroke={stroke} strokeWidth="3" opacity="0.55" /> : null}
            <circle cx={node.x} cy="145" r="42" fill={OPAQUE_LIGHT_FILL[stroke]} stroke={stroke} strokeWidth="2.5" />
            <text x={node.x} y="141" textAnchor="middle" fill={stroke} fontSize="14" fontWeight="700">{node.label}</text>
            <text x={node.x} y="162" textAnchor="middle" fill={INK_MUTED} fontSize="13">{node.active ? "read" : "repair"}</text>
          </g>
        );
      })}
      <rect x="92" y="240" width="250" height="60" rx="8" fill={OPAQUE_LIGHT_FILL[readDistribution ? GREEN : VERMILION]} stroke={readDistribution ? GREEN : VERMILION} />
      <text x="217" y="263" textAnchor="middle" fill={readDistribution ? GREEN : VERMILION} fontSize="15" fontWeight="700">Compatibility layer</text>
      <text x="217" y="285" textAnchor="middle" fill={INK_MUTED} fontSize="13">{readDistribution && bhakutaCancelled ? "effective reading is strong" : "raw score is misleading"}</text>
      <rect x="452" y="240" width="250" height="60" rx="8" fill={OPAQUE_LIGHT_FILL[methodOk ? GREEN : GOLD]} stroke={methodOk ? GREEN : GOLD} />
      <text x="577" y="263" textAnchor="middle" fill={methodOk ? GREEN : GOLD} fontSize="15" fontWeight="700">Final output</text>
      <text x="577" y="285" textAnchor="middle" fill={INK_MUTED} fontSize="13">{methodOk ? "sound workable match" : "confidence adjusted"}</text>
      <text x="395" y="332" textAnchor="middle" fill={INK_SECONDARY} fontSize="14">The decision is returned to the couple; astrology supplies dimensions, not a decree.</text>
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

function LayerRow({ label, body, color }: { label: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.7rem" }}>
      <span style={{ color, fontWeight: 600 }}>{label}</span>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.4 }}>{body}</p>
    </div>
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
