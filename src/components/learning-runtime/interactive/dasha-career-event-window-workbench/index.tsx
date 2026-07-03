"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, BriefcaseBusiness, Clock3, Gauge, GitBranch, RotateCcw, SatelliteDish, ShieldCheck, Sparkles, Timer } from "lucide-react";

type Significator = "tenth" | "amk" | "kp" | "yoga" | "sixth" | "seventh" | "disruptive" | "unrelated";
type ViewMode = "significators" | "window" | "eventType" | "twoYes";

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

const SIGNIFICATORS: Record<Significator, { label: string; event: string; color: string; note: string }> = {
  tenth: { label: "10th lord", event: "promotion / status rise", color: GREEN, note: "Direct Parashari career carrier." },
  amk: { label: "AmK", event: "work function matures", color: PURPLE, note: "Jaimini career doer." },
  kp: { label: "KP 10th sig.", event: "career delivery window", color: BLUE, note: "KP agent of the career house." },
  yoga: { label: "Yoga lord", event: "yoga fruit / elevation", color: GOLD, note: "Raja, Sarasvati, or PMP planet fires its yoga." },
  sixth: { label: "6th sig.", event: "job / service change", color: BLUE, note: "Employment, service, competition." },
  seventh: { label: "7th sig.", event: "business / partnership", color: PURPLE, note: "Independent work, public dealing, partnership." },
  disruptive: { label: "8th/12th", event: "disruption / foreign shift", color: VERMILION, note: "Transformation, break, relocation, retreat." },
  unrelated: { label: "Unrelated", event: "not career-timed", color: VERMILION, note: "Period activates other matters, not the career promise." },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  significators: {
    label: "Significators",
    title: "Career events run in career-significator periods",
    body: "Use the 10th lord, AmK, KP significators, and career-yoga lords as the planets whose dasha periods carry career events.",
    icon: <BriefcaseBusiness size={16} />,
    color: BLUE,
  },
  window: {
    label: "Window",
    title: "Mahadasha sets era, bhukti activates, antara refines",
    body: "Set the MD-bhukti window first. Refine to antara only when the data and question warrant it.",
    icon: <Clock3 size={16} />,
    color: GOLD,
  },
  eventType: {
    label: "Event type",
    title: "The significator and houses name the event",
    body: "10th and raja-yoga periods lift status; 6th periods change job/service; 7th periods develop business; 8th/12th periods disrupt or relocate.",
    icon: <GitBranch size={16} />,
    color: PURPLE,
  },
  twoYes: {
    label: "Two yes",
    title: "Dasha is necessary, not sufficient",
    body: "The dasha opens the window. Transit or ruling-planet confirmation supplies the trigger for a confident date.",
    icon: <SatelliteDish size={16} />,
    color: GREEN,
  },
};

export function DashaCareerEventWindowWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("window");
  const [selected, setSelected] = useState<Significator>("tenth");
  const [staticPromise, setStaticPromise] = useState(true);
  const [mdCareer, setMdCareer] = useState(true);
  const [bhuktiCareer, setBhuktiCareer] = useState(true);
  const [antaraRefined, setAntaraRefined] = useState(false);
  const [periodStrong, setPeriodStrong] = useState(true);
  const [transitConfirm, setTransitConfirm] = useState(false);
  const [falsePrecision, setFalsePrecision] = useState(false);

  const current = SIGNIFICATORS[selected];
  const careerPeriod = selected !== "unrelated" && mdCareer && bhuktiCareer;
  const windowOpen = staticPromise && careerPeriod;
  const twoYes = windowOpen && transitConfirm;
  const score = Math.max(5, Math.min(98, (staticPromise ? 22 : -12) + (careerPeriod ? 34 : -8) + (periodStrong ? 18 : 4) + (transitConfirm ? 18 : 0) + (antaraRefined ? 4 : 0) - (falsePrecision ? 18 : 0)));

  const verdict = useMemo(() => {
    if (!staticPromise) return "No-manufacturing rule: dasha cannot time a career event the static chart does not promise.";
    if (selected === "unrelated" || !careerPeriod) return "Not strongly timed now: the running period lords are not career significators, so the career promise remains latent.";
    if (!periodStrong) return `Window open but muted: the ${current.label} period can activate ${current.event}, but weak capacity underdelivers.`;
    if (falsePrecision) return "Precision warning: settle the MD-bhukti career window before drilling into fine sub-periods or exact dates.";
    if (twoYes) return `Two-yes timing: dasha opens a strong ${current.event} window and transit confirms the trigger.`;
    return `Dasha window open: ${current.label} activates ${current.event}; await transit confirmation before giving a confident date.`;
  }, [careerPeriod, current, falsePrecision, periodStrong, selected, staticPromise, twoYes]);

  return (
    <div data-interactive="dasha-career-event-window-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Dasha timing for career events</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Find the window, then wait for the trigger</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Match running periods to career significators, read the likely event, grade capacity, and require transit confirmation for a date.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("window");
              setSelected("tenth");
              setStaticPromise(true);
              setMdCareer(true);
              setBhuktiCareer(true);
              setAntaraRefined(false);
              setPeriodStrong(true);
              setTransitConfirm(false);
              setFalsePrecision(false);
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

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Timing pipeline</p>
              <h3 style={{ margin: "0.15rem 0 0", color: twoYes ? GREEN : windowOpen ? GOLD : VERMILION, fontSize: "1.2rem" }}>
                {twoYes ? "Window and trigger agree" : windowOpen ? "Career window open" : "Career not timed now"}
              </h3>
            </div>
            <span style={{ color: twoYes ? GREEN : windowOpen ? GOLD : VERMILION, fontWeight: 600 }}>{score}% timing confidence</span>
          </div>
          <TimingSvg staticPromise={staticPromise} careerPeriod={careerPeriod} periodStrong={periodStrong} transitConfirm={transitConfirm} falsePrecision={falsePrecision} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Window" body={windowOpen ? "open" : "closed"} color={windowOpen ? GOLD : VERMILION} icon={<Clock3 size={16} />} />
            <MiniFact title="Event" body={current.event} color={current.color} icon={<BriefcaseBusiness size={16} />} />
            <MiniFact title="Trigger" body={transitConfirm ? "confirmed" : "awaiting transit"} color={transitConfirm ? GREEN : GOLD} icon={<SatelliteDish size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Select the period lord" icon={<Timer size={18} />} color={current.color}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.5rem" }}>
              {(Object.keys(SIGNIFICATORS) as Significator[]).map((key) => {
                const item = SIGNIFICATORS[key];
                return (
                  <button key={key} type="button" aria-pressed={selected === key} onClick={() => setSelected(key)} style={periodButtonStyle(selected === key, item.color)}>
                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                    <span>{item.event}</span>
                  </button>
                );
              })}
            </div>
            <p style={bodyTextStyle}>{current.note}</p>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Window controls</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={staticPromise} color={staticPromise ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Static promise exists" body={staticPromise ? "Chart promises the career event." : "No promise: dasha cannot manufacture it."} onClick={() => setStaticPromise((value) => !value)} />
            <Toggle active={mdCareer} color={mdCareer ? GREEN : VERMILION} icon={<Clock3 size={18} />} title="Mahadasha is career-significator" body={mdCareer ? "Broad era supports career activation." : "Broad era is unrelated to career."} onClick={() => setMdCareer((value) => !value)} />
            <Toggle active={bhuktiCareer} color={bhuktiCareer ? GREEN : VERMILION} icon={<BadgeCheck size={18} />} title="Bhukti is career-significator" body={bhuktiCareer ? "Active period engages the career promise." : "Bhukti does not activate the career event."} onClick={() => setBhuktiCareer((value) => !value)} />
            <Toggle active={antaraRefined} color={antaraRefined ? GREEN : GOLD} icon={<GitBranch size={18} />} title="Antara refinement" body={antaraRefined ? "Fine window added after MD-bhukti is set." : "Broad window only; no false precision."} onClick={() => setAntaraRefined((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Delivery and confirmation</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={periodStrong} color={periodStrong ? GREEN : GOLD} icon={<Gauge size={18} />} title="Period lord capacity strong" body={periodStrong ? "Event can be well delivered." : "Weak lord activates a muted version."} onClick={() => setPeriodStrong((value) => !value)} />
            <Toggle active={transitConfirm} color={transitConfirm ? GREEN : GOLD} icon={<SatelliteDish size={18} />} title="Transit confirmation" body={transitConfirm ? "Trigger confirms the dasha window." : "Necessary but not sufficient: await trigger."} onClick={() => setTransitConfirm((value) => !value)} />
            <Toggle active={falsePrecision} color={falsePrecision ? VERMILION : GREEN} icon={<AlertTriangle size={18} />} title="False precision" body={falsePrecision ? "Error active: exact date from dasha alone." : "Correct: no exact date without trigger."} onClick={() => setFalsePrecision((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: twoYes ? `${GREEN}66` : windowOpen ? `${GOLD}66` : `${VERMILION}66`, background: twoYes ? `${GREEN}10` : windowOpen ? `${GOLD}10` : `${VERMILION}0F` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <Sparkles size={20} color={twoYes ? GREEN : windowOpen ? GOLD : VERMILION} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Career timing statement</p>
            <h3 style={{ margin: "0.15rem 0 0", color: twoYes ? GREEN : windowOpen ? GOLD : VERMILION, fontSize: "1.16rem" }}>
              {twoYes ? "Confident event trigger" : windowOpen ? "Window open, trigger pending" : "Promise latent"}
            </h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{verdict}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TimingSvg({ staticPromise, careerPeriod, periodStrong, transitConfirm, falsePrecision }: { staticPromise: boolean; careerPeriod: boolean; periodStrong: boolean; transitConfirm: boolean; falsePrecision: boolean }) {
  const stages = [
    { label: "Promise", active: staticPromise, color: GREEN },
    { label: "Dasha", active: careerPeriod, color: GOLD },
    { label: "Capacity", active: periodStrong, color: BLUE },
    { label: "Transit", active: transitConfirm, color: PURPLE },
  ];
  return (
    <svg viewBox="0 0 720 390" role="img" aria-label="Dasha career timing window diagram" style={{ width: "100%", minHeight: 340, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {stages.map((stage, index) => {
        const x = 95 + index * 180;
        return (
          <g key={stage.label}>
            {index < stages.length - 1 ? <path d={`M ${x + 50} 130 L ${x + 130} 130`} stroke={stage.active ? stage.color : HAIRLINE} strokeWidth="3" markerEnd="url(#arrowDasha)" /> : null}
            <circle cx={x} cy="130" r="50" fill={stage.active ? OPAQUE_LIGHT_FILL[stage.color] || `${stage.color}18` : "transparent"} stroke={stage.active ? stage.color : HAIRLINE} strokeWidth={stage.active ? 3 : 1.5} />
            <text x={x} y="126" textAnchor="middle" fill={stage.active ? stage.color : INK_MUTED} fontSize="18" fontWeight="600">{stage.active ? "YES" : "NO"}</text>
            <text x={x} y="152" textAnchor="middle" fill={INK_MUTED} fontSize="14">{stage.label}</text>
          </g>
        );
      })}
      <rect x="120" y="270" width="480" height="54" rx="8" fill={falsePrecision ? OPAQUE_LIGHT_FILL[VERMILION] : OPAQUE_LIGHT_FILL[GOLD]} stroke={falsePrecision ? VERMILION : GOLD} />
      <text x="360" y="293" textAnchor="middle" fill={falsePrecision ? VERMILION : GOLD} fontSize="17" fontWeight="600">{falsePrecision ? "false precision warning" : "dasha gives the window"}</text>
      <text x="360" y="314" textAnchor="middle" fill={INK_MUTED} fontSize="14">transit confirms the trigger</text>
      <defs>
        <marker id="arrowDasha" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={GOLD} />
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
    fontWeight: 600,
    cursor: "pointer",
  };
}

function periodButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonStyle(active, color),
    alignItems: "start",
    flexDirection: "column",
    gap: "0.2rem",
    textAlign: "left",
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
