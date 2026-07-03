"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, ArrowRight, BadgeCheck, BriefcaseBusiness, Clock3, RotateCcw, SatelliteDish, Scale, ShieldCheck, TimerReset } from "lucide-react";

type ViewMode = "twoYes" | "rulingPlanets" | "notRipe" | "roles";
type Scenario = "greenWindow" | "promisedNotRipe";

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

const CAREER_SIGNIFICATORS = ["Mars", "Saturn"];
const RP_ROLES = [
  { role: "Day lord", planet: "Saturn", color: BLUE },
  { role: "Moon sign lord", planet: "Mars", color: VERMILION },
  { role: "Moon star lord", planet: "Mercury", color: GREEN },
  { role: "Moon sub lord", planet: "Saturn", color: BLUE },
  { role: "Asc sign lord", planet: "Venus", color: PURPLE },
  { role: "Asc star lord", planet: "Mars", color: VERMILION },
  { role: "Asc sub lord", planet: "Rahu", color: PURPLE },
];

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  twoYes: {
    label: "Two yes",
    title: "Career timing needs both confirmations",
    body: "The running dasha/bhukti/antara lords should be career significators, and the ruling planets of the moment should confirm them.",
    icon: <BadgeCheck size={16} />,
    color: GREEN,
  },
  rulingPlanets: {
    label: "RPs",
    title: "Ruling planets are the live lords of the moment",
    body: "Use day lord plus Moon and rising-point sign, star, and sub lords. A strongly involved node can join the RP set.",
    icon: <SatelliteDish size={16} />,
    color: BLUE,
  },
  notRipe: {
    label: "Not ripe",
    title: "Good promise is not the same as current timing",
    body: "A favourable CSL can promise career growth, but without the dasha window and RP resonance the move is not strongly timed now.",
    icon: <TimerReset size={16} />,
    color: VERMILION,
  },
  roles: {
    label: "Roles",
    title: "Keep judge, agents, and timers separate",
    body: "CSL judges favourability; significators are the agents; dasha and ruling planets time when the agent delivers.",
    icon: <Scale size={16} />,
    color: GOLD,
  },
};

export function KpCareerRulingPlanetsTimingWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("twoYes");
  const [scenario, setScenario] = useState<Scenario>("greenWindow");
  const [dashaWindow, setDashaWindow] = useState(true);
  const [rpConfirmation, setRpConfirmation] = useState(true);
  const [staticPromise, setStaticPromise] = useState(true);
  const [kpSettings, setKpSettings] = useState(true);
  const [standaloneRp, setStandaloneRp] = useState(false);

  const rpMatches = rpConfirmation ? ["Saturn", "Mars"] : ["Venus", "Mercury"];
  const dashaLords = dashaWindow ? ["Saturn", "Mars"] : ["Jupiter", "Venus"];
  const twoYes = dashaWindow && rpConfirmation && kpSettings && !standaloneRp;
  const warning = !kpSettings || standaloneRp || (!dashaWindow && rpConfirmation);

  const score = Math.max(5, Math.min(98, 20 + (staticPromise ? 15 : 0) + (dashaWindow ? 30 : 0) + (rpConfirmation ? 30 : 0) - (!kpSettings ? 45 : 0) - (standaloneRp ? 28 : 0)));

  const synthesis = useMemo(() => {
    if (!kpSettings) return "Invalid timing setup: compute ruling planets in KP settings with the correct sunrise-based vara transition before judging the window.";
    if (standaloneRp) return "Lonely-signal warning: ruling planets confirm a window, but they do not time a major career move by themselves.";
    if (dashaWindow && rpConfirmation) return "Timed now: Saturn/Mars are career significators, the running period lords match them, and the ruling planets also repeat them. This is the lesson's green two-yes window.";
    if (staticPromise && !dashaWindow && !rpConfirmation) return "Promised but not ripe: the CSL promise can be good, but neither the dasha-significator window nor RP resonance is present now.";
    if (!dashaWindow && rpConfirmation) return "Partial signal only: the RPs are lively, but the period lords are not career significators, so do not green-light the move yet.";
    return "One confirmation is missing. Keep the career promise separate from the timing call and wait for the period lords and RPs to agree.";
  }, [dashaWindow, kpSettings, rpConfirmation, standaloneRp, staticPromise]);

  return (
    <div data-interactive="kp-career-ruling-planets-timing-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP ruling planets for career timing</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>Ask whether the career move is timed now</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compare career significators, running dasha lords, and the ruling planets of the consultation moment before calling the window green.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("twoYes");
              setScenario("greenWindow");
              setDashaWindow(true);
              setRpConfirmation(true);
              setStaticPromise(true);
              setKpSettings(true);
              setStandaloneRp(false);
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
          <h3 style={{ margin: 0, color: VIEW_COPY[viewMode].color, fontSize: "1.12rem", fontWeight: 600 }}>{VIEW_COPY[viewMode].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[viewMode].body}</p>
        </div>
      </section>

      <div style={diagramLayoutStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Timing vector</p>
              <h3 style={{ margin: "0.15rem 0 0", color: twoYes ? GREEN : warning ? VERMILION : GOLD, fontSize: "1.2rem", fontWeight: 600 }}>
                {twoYes ? "Timed now" : warning ? "Discipline warning" : "Not strongly timed now"}
              </h3>
            </div>
            <span style={{ color: twoYes ? GREEN : warning ? VERMILION : GOLD, fontWeight: 600 }}>{score}% timing signal</span>
          </div>
          <TimingSvg dashaWindow={dashaWindow} rpConfirmation={rpConfirmation} staticPromise={staticPromise} twoYes={twoYes} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Agents" body={CAREER_SIGNIFICATORS.join(" + ")} color={BLUE} icon={<BriefcaseBusiness size={16} />} />
            <MiniFact title="Dasha" body={dashaLords.join(" / ")} color={dashaWindow ? GREEN : VERMILION} icon={<Clock3 size={16} />} />
            <MiniFact title="RPs" body={rpMatches.join(" + ")} color={rpConfirmation ? GREEN : GOLD} icon={<SatelliteDish size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Worked scenario" icon={<BriefcaseBusiness size={18} />} color={scenario === "greenWindow" ? GREEN : VERMILION}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={scenario === "greenWindow"} onClick={() => {
                setScenario("greenWindow");
                setDashaWindow(true);
                setRpConfirmation(true);
                setStaticPromise(true);
              }} style={buttonStyle(scenario === "greenWindow", GREEN)}>
                Green window
              </button>
              <button type="button" aria-pressed={scenario === "promisedNotRipe"} onClick={() => {
                setScenario("promisedNotRipe");
                setDashaWindow(false);
                setRpConfirmation(false);
                setStaticPromise(true);
              }} style={buttonStyle(scenario === "promisedNotRipe", VERMILION)}>
                Promised, not ripe
              </button>
            </div>
            <p style={bodyTextStyle}>
              The green case repeats Saturn/Mars across career significators, period lords, and RPs. The not-ripe case keeps promise but removes both timing confirmations.
            </p>
          </Panel>

          <Panel title="Ruling planets of the moment" icon={<SatelliteDish size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {RP_ROLES.map((item) => {
                const match = rpConfirmation && CAREER_SIGNIFICATORS.includes(item.planet);
                return (
                  <div key={item.role} style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${match ? GREEN : HAIRLINE}`, borderRadius: 8, padding: "0.55rem", background: match ? `${GREEN}10` : "transparent" }}>
                    <span style={{ color: INK_MUTED, fontSize: "0.82rem", fontWeight: 500 }}>{item.role}</span>
                    <span style={{ color: match ? GREEN : item.color, fontWeight: 600 }}>{item.planet}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Two-yes switches</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={staticPromise} color={staticPromise ? GREEN : GOLD} icon={<Scale size={18} />} title="Static career promise" body={staticPromise ? "CSL promise is favourable, but it does not time the move." : "Promise is uncertain, so timing should be handled cautiously."} onClick={() => setStaticPromise((value) => !value)} />
            <Toggle active={dashaWindow} color={dashaWindow ? GREEN : VERMILION} icon={<Clock3 size={18} />} title="Dasha-significator window" body={dashaWindow ? "Running lords are career significators." : "Running lords are not career significators."} onClick={() => setDashaWindow((value) => !value)} />
            <Toggle active={rpConfirmation} color={rpConfirmation ? GREEN : GOLD} icon={<SatelliteDish size={18} />} title="RP confirmation" body={rpConfirmation ? "RPs repeat the career significators." : "RPs do not overlap the career significators."} onClick={() => setRpConfirmation((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Discipline guards</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={kpSettings} color={kpSettings ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="KP settings" body={kpSettings ? "KP ayanamsha and sunrise-based vara are assumed." : "Wrong settings can produce wrong ruling planets."} onClick={() => setKpSettings((value) => !value)} />
            <Toggle active={standaloneRp} color={standaloneRp ? VERMILION : GREEN} icon={<AlertTriangle size={18} />} title="Use RPs alone" body={standaloneRp ? "Error active: RPs are being treated as a standalone oracle." : "Correct: RPs confirm significators and dasha."} onClick={() => setStandaloneRp((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: twoYes ? `${GREEN}66` : warning ? `${VERMILION}66` : `${GOLD}66`, background: twoYes ? `${GREEN}10` : warning ? `${VERMILION}0F` : `${GOLD}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <ArrowRight size={20} color={twoYes ? GREEN : warning ? VERMILION : GOLD} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>KP timing answer</p>
            <h3 style={{ margin: "0.15rem 0 0", color: twoYes ? GREEN : warning ? VERMILION : GOLD, fontSize: "1.16rem", fontWeight: 600 }}>
              {twoYes ? "Green window for the career move" : warning ? "Fix the method before judging" : "Promised is not the same as ripe"}
            </h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TimingSvg({ dashaWindow, rpConfirmation, staticPromise, twoYes }: { dashaWindow: boolean; rpConfirmation: boolean; staticPromise: boolean; twoYes: boolean }) {
  const color = twoYes ? GREEN : VERMILION;
  const cx = 360;
  const cy = 270;
  const r = 86;
  return (
    <svg viewBox="0 0 720 400" role="img" aria-label="KP career timing two yes diagram" style={{ width: "100%", minHeight: 300, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="364" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <Stage x={110} y={110} title="Career significators" body="10 / 6 / 7 / 2 / 11" color={BLUE} active />
      <Stage x={340} y={110} title="Dasha window" body={dashaWindow ? "Saturn / Mars" : "not career lords"} color={dashaWindow ? GREEN : VERMILION} active={dashaWindow} />
      <Stage x={570} y={110} title="RP confirmation" body={rpConfirmation ? "RPs repeat agents" : "no resonance"} color={rpConfirmation ? GREEN : GOLD} active={rpConfirmation} />
      <path d="M 210 110 L 240 110" stroke={dashaWindow ? GREEN : HAIRLINE} strokeWidth="3" markerEnd="url(#arrowTiming)" />
      <path d="M 440 110 L 470 110" stroke={rpConfirmation ? GREEN : HAIRLINE} strokeWidth="3" markerEnd="url(#arrowTiming)" />
      <circle cx={cx} cy={cy} r={r} fill={OPAQUE_LIGHT_FILL[color] || `${color}16`} stroke={color} strokeWidth="3" />
      <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="18" fontWeight="600">{twoYes ? "TIMED NOW" : "NOT RIPE"}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="middle" fill={INK_MUTED} fontSize="14">{staticPromise ? "promise checked separately" : "promise uncertain"}</text>
      <path d={`M 340 165 C 340 200, 310 225, ${cx - r * Math.cos(Math.PI / 3)} ${cy - r * Math.sin(Math.PI / 3)}`} stroke={dashaWindow ? GREEN : HAIRLINE} strokeWidth="2.5" fill="none" markerEnd="url(#arrowTiming)" />
      <path d={`M 570 165 C 570 200, 480 225, ${cx + r * Math.cos(Math.PI / 3)} ${cy - r * Math.sin(Math.PI / 3)}`} stroke={rpConfirmation ? GREEN : HAIRLINE} strokeWidth="2.5" fill="none" markerEnd="url(#arrowTiming)" />
      <defs>
        <marker id="arrowTiming" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={GREEN} />
        </marker>
      </defs>
    </svg>
  );
}

function Stage({ x, y, title, body, color, active }: { x: number; y: number; title: string; body: string; color: string; active: boolean }) {
  return (
    <g>
      <rect x={x - 100} y={y - 55} width="200" height="110" rx="8" fill={active ? `${color}14` : "transparent"} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2 : 1} />
      <circle cx={x} cy={y - 20} r="15" fill={active ? color : "transparent"} stroke={color} strokeWidth="2" />
      <text x={x} y={y - 15} textAnchor="middle" fill={active ? "#fff" : color} fontSize="16" fontWeight="600">{active ? "Y" : "-"}</text>
      <text x={x} y={y + 12} textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="600">{title}</text>
      <text x={x} y={y + 34} textAnchor="middle" fill={INK_MUTED} fontSize="15">{body}</text>
    </g>
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
