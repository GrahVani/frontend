"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, BriefcaseBusiness, Building2, Clock3, Crown, Gauge, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

type PmpKey = "ruchaka" | "bhadra" | "hamsa" | "malavya" | "shasha";
type ViewMode = "formation" | "flavour" | "tenth" | "dasha";

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

const PMP_DATA: Record<PmpKey, { yoga: string; planet: string; field: string; short: string; color: string }> = {
  ruchaka: { yoga: "Ruchaka", planet: "Mars", field: "command, defence, engineering, surgery, athletics", short: "command", color: VERMILION },
  bhadra: { yoga: "Bhadra", planet: "Mercury", field: "commerce, communication, analysis, writing, scholarship", short: "analysis", color: GREEN },
  hamsa: { yoga: "Hamsa", planet: "Jupiter", field: "teaching, law, counsel, finance, ethics", short: "counsel", color: GOLD },
  malavya: { yoga: "Malavya", planet: "Venus", field: "art, beauty, luxury, design, relationships", short: "aesthetics", color: PURPLE },
  shasha: { yoga: "Shasha", planet: "Saturn", field: "administration, masses, organisation, labour, long-built authority", short: "organisation", color: BLUE },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; color: string; icon: ReactNode }> = {
  formation: {
    label: "Formation",
    title: "Both conditions are required",
    body: "A PMP yoga forms only when Mars, Mercury, Jupiter, Venus, or Saturn is own/exalted and in a kendra. One condition alone is not enough.",
    color: GOLD,
    icon: <BadgeCheck size={16} />,
  },
  flavour: {
    label: "Flavour",
    title: "The planet names the career distinction",
    body: "Each yoga lends the profession a planetary style: Mars commands, Mercury analyses, Jupiter teaches, Venus refines, Saturn administers.",
    color: BLUE,
    icon: <Sparkles size={16} />,
  },
  tenth: {
    label: "10th tie",
    title: "Career-directness depends on relation to the 10th",
    body: "In, ruling, aspecting, or relating to the 10th makes the yoga career-directing. Another kendra without 10th relation is more personality-tied.",
    color: GREEN,
    icon: <BriefcaseBusiness size={16} />,
  },
  dasha: {
    label: "Dasha",
    title: "The distinction flowers in the PMP planet's period",
    body: "Even a genuine PMP yoga is latent off its planet's dasha. Its rise becomes visible in that planet's period.",
    color: PURPLE,
    icon: <Clock3 size={16} />,
  },
};

export function PanchaMahapurushaCareerWorkbench() {
  const [selected, setSelected] = useState<PmpKey>("shasha");
  const [viewMode, setViewMode] = useState<ViewMode>("formation");
  const [ownOrExalted, setOwnOrExalted] = useState(true);
  const [inKendra, setInKendra] = useState(true);
  const [tenthRelation, setTenthRelation] = useState(true);
  const [capacityClear, setCapacityClear] = useState(true);
  const [dashaActive, setDashaActive] = useState(true);
  const [streamConfirm, setStreamConfirm] = useState(true);

  const pmp = PMP_DATA[selected];
  const genuine = ownOrExalted && inKendra;
  const careerDirect = genuine && tenthRelation;
  const score = Math.max(5, Math.min(98, (genuine ? 34 : 8) + (capacityClear ? 18 : -8) + (tenthRelation ? 20 : 4) + (dashaActive ? 16 : -8) + (streamConfirm ? 10 : -6)));

  const verdict = useMemo(() => {
    if (!genuine) return `No genuine ${pmp.yoga}: both own/exalted dignity and kendra placement are required before career meaning is read.`;
    if (!capacityClear) return `${pmp.yoga} is technically formed, but affliction, combustion, or weak varga support mutes the great-person promise.`;
    if (!tenthRelation) return `${pmp.yoga} is real and significant, but without a 10th relation it is personality-distinction more than a direct profession label.`;
    if (!dashaActive) return `${pmp.yoga} directly shapes career, but it is latent now because the ${pmp.planet} period is not running.`;
    if (!streamConfirm) return `${pmp.yoga} is career-directed and active, but still needs proportion with the 10th/D10, AmK, and KP voices.`;
    return `${pmp.yoga} is genuine, strong, tied to the 10th, and active in ${pmp.planet} dasha: a distinguished ${pmp.short}-flavoured career is strongly indicated.`;
  }, [capacityClear, dashaActive, genuine, pmp, streamConfirm, tenthRelation]);

  function loadPreset(kind: "shashaCareer" | "malavyaPersonality" | "partial") {
    if (kind === "shashaCareer") {
      setSelected("shasha");
      setOwnOrExalted(true);
      setInKendra(true);
      setTenthRelation(true);
      setCapacityClear(true);
      setDashaActive(true);
      setStreamConfirm(true);
    } else if (kind === "malavyaPersonality") {
      setSelected("malavya");
      setOwnOrExalted(true);
      setInKendra(true);
      setTenthRelation(false);
      setCapacityClear(true);
      setDashaActive(false);
      setStreamConfirm(true);
    } else {
      setSelected("bhadra");
      setOwnOrExalted(true);
      setInKendra(false);
      setTenthRelation(false);
      setCapacityClear(true);
      setDashaActive(false);
      setStreamConfirm(false);
    }
  }

  return (
    <div data-interactive="pancha-mahapurusha-career-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Pancha Mahapurusha for career</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>Test the five great-person yogas as profession indicators</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Confirm genuine formation, map the planetary career flavour, judge the 10th relation, and time the distinction by dasha.
            </p>
          </div>
          <button type="button" onClick={() => { setViewMode("formation"); loadPreset("shashaCareer"); }} style={buttonStyle(false, GOLD)}>
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
              <p style={eyebrowStyle}>Formation-to-career vector</p>
              <h3 style={{ margin: "0.15rem 0 0", color: genuine ? (careerDirect ? GREEN : GOLD) : VERMILION, fontSize: "1.2rem", fontWeight: 600 }}>
                {genuine ? (careerDirect ? `${pmp.yoga} career-directing` : `${pmp.yoga} personality-tied`) : "Partial, not PMP"}
              </h3>
            </div>
            <span style={{ color: score > 72 ? GREEN : score > 45 ? GOLD : VERMILION, fontWeight: 600 }}>{score}% distinction signal</span>
          </div>
          <PmpSvg pmp={pmp} ownOrExalted={ownOrExalted} inKendra={inKendra} tenthRelation={tenthRelation} dashaActive={dashaActive} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Formation" body={genuine ? "genuine PMP" : "not formed"} color={genuine ? GREEN : VERMILION} icon={<BadgeCheck size={16} />} />
            <MiniFact title="10th tie" body={tenthRelation ? "career-direct" : "indirect"} color={tenthRelation ? GREEN : GOLD} icon={<BriefcaseBusiness size={16} />} />
            <MiniFact title="Dasha" body={dashaActive ? `${pmp.planet} active` : "latent"} color={dashaActive ? GREEN : VERMILION} icon={<Clock3 size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Choose one of the five" icon={<Crown size={18} />} color={pmp.color}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 130px), 1fr))", gap: "0.5rem" }}>
              {(Object.keys(PMP_DATA) as PmpKey[]).map((key) => {
                const item = PMP_DATA[key];
                return (
                  <button key={key} type="button" aria-pressed={selected === key} onClick={() => setSelected(key)} style={pmpButtonStyle(selected === key, item.color)}>
                    <span style={{ fontWeight: 600 }}>{item.yoga}</span>
                    <span>{item.planet}</span>
                  </button>
                );
              })}
            </div>
            <p style={bodyTextStyle}>{pmp.field}</p>
          </Panel>

          <Panel title="Worked presets" icon={<Building2 size={18} />} color={careerDirect ? GREEN : GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" onClick={() => loadPreset("shashaCareer")} style={buttonStyle(false, BLUE)}>Shasha in 10th</button>
              <button type="button" onClick={() => loadPreset("malavyaPersonality")} style={buttonStyle(false, PURPLE)}>Malavya in 4th</button>
              <button type="button" onClick={() => loadPreset("partial")} style={buttonStyle(false, VERMILION)}>Partial mistake</button>
            </div>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Formation and strength</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={ownOrExalted} color={ownOrExalted ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Own sign or exaltation" body={ownOrExalted ? "Dignity condition is satisfied." : "Missing dignity: no PMP yoga."} onClick={() => setOwnOrExalted((value) => !value)} />
            <Toggle active={inKendra} color={inKendra ? GREEN : VERMILION} icon={<Building2 size={18} />} title="In a kendra" body={inKendra ? "Angular condition is satisfied." : "Missing kendra: partial configuration only."} onClick={() => setInKendra((value) => !value)} />
            <Toggle active={capacityClear} color={capacityClear ? GREEN : GOLD} icon={<Gauge size={18} />} title="Capacity clear" body={capacityClear ? "No heavy affliction/combustion penalty active." : "Actual strength is muted despite technical formation."} onClick={() => setCapacityClear((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Career directness and timing</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={tenthRelation} color={tenthRelation ? GREEN : GOLD} icon={<BriefcaseBusiness size={18} />} title="Relation to the 10th" body={tenthRelation ? "In/ruling/aspecting/related to the 10th: career-direct." : "Other kendra only: personality distinction."} onClick={() => setTenthRelation((value) => !value)} />
            <Toggle active={dashaActive} color={dashaActive ? GREEN : VERMILION} icon={<Clock3 size={18} />} title={`${pmp.planet} dasha active`} body={dashaActive ? "The distinction is flowering now." : "Off the PMP planet's period, the yoga is latent."} onClick={() => setDashaActive((value) => !value)} />
            <Toggle active={streamConfirm} color={streamConfirm ? GREEN : GOLD} icon={<Sparkles size={18} />} title="Streams confirm" body={streamConfirm ? "10th/D10, AmK, and KP support proportion." : "Do not make the yoga the whole career answer."} onClick={() => setStreamConfirm((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: score > 72 ? `${GREEN}66` : score > 45 ? `${GOLD}66` : `${VERMILION}66`, background: score > 72 ? `${GREEN}10` : score > 45 ? `${GOLD}10` : `${VERMILION}0F` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <AlertTriangle size={20} color={score > 72 ? GREEN : score > 45 ? GOLD : VERMILION} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Career reading</p>
            <h3 style={{ margin: "0.15rem 0 0", color: score > 72 ? GREEN : score > 45 ? GOLD : VERMILION, fontSize: "1.16rem", fontWeight: 600 }}>
              {genuine ? (careerDirect ? "Distinction directly shapes profession" : "Distinction colours life and career indirectly") : "Do not call this a great-person yoga"}
            </h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{verdict}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PmpSvg({ pmp, ownOrExalted, inKendra, tenthRelation, dashaActive }: { pmp: { yoga: string; planet: string; color: string }; ownOrExalted: boolean; inKendra: boolean; tenthRelation: boolean; dashaActive: boolean }) {
  const cx = 360;
  const cy = 255;
  const r = 72;
  const nodeR = 42;
  const nodes = [
    { x: 110, label: "own/exalted", active: ownOrExalted, color: GREEN },
    { x: 285, label: "kendra", active: inKendra, color: BLUE },
    { x: 460, label: "10th relation", active: tenthRelation, color: GOLD },
    { x: 635, label: "dasha", active: dashaActive, color: PURPLE },
  ];
  return (
    <svg viewBox="0 0 720 390" role="img" aria-label="Pancha Mahapurusha career formation diagram" style={{ width: "100%", minHeight: 290, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {nodes.slice(0, -1).map((node, index) => (
        <path key={index} d={`M ${node.x + nodeR} 110 L ${nodes[index + 1].x - nodeR} 110`} stroke={node.active ? node.color : HAIRLINE} strokeWidth="3" markerEnd="url(#arrowPmp)" />
      ))}
      <path d={`M ${cx} ${110 + nodeR} L ${cx} ${cy - r}`} stroke={ownOrExalted && inKendra ? pmp.color : HAIRLINE} strokeWidth="3" markerEnd="url(#arrowPmp)" />
      {nodes.map((node) => (
        <CheckNode key={node.label} x={node.x} y={110} label={node.label} active={node.active} color={node.color} />
      ))}
      <circle cx={cx} cy={cy} r={r} fill={OPAQUE_LIGHT_FILL[pmp.color] || `${pmp.color}16`} stroke={ownOrExalted && inKendra ? pmp.color : HAIRLINE} strokeWidth="3" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={ownOrExalted && inKendra ? pmp.color : INK_MUTED} fontSize="22" fontWeight="600">{pmp.yoga}</text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill={INK_MUTED} fontSize="16">{pmp.planet} career flavour</text>
      <defs>
        <marker id="arrowPmp" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={GREEN} />
        </marker>
      </defs>
    </svg>
  );
}

function CheckNode({ x, y, label, active, color }: { x: number; y: number; label: string; active: boolean; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="42" fill={active ? OPAQUE_LIGHT_FILL[color] || `${color}18` : "transparent"} stroke={active ? color : HAIRLINE} strokeWidth={active ? 3 : 1.5} />
      <text x={x} y={y - 2} textAnchor="middle" fill={active ? color : INK_MUTED} fontSize="18" fontWeight="600">{active ? "YES" : "NO"}</text>
      <text x={x} y={y + 54} textAnchor="middle" fill={INK_MUTED} fontSize="15" fontWeight="600">{label}</text>
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

function pmpButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonStyle(active, color),
    alignItems: "start",
    flexDirection: "column",
    gap: "0.2rem",
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
