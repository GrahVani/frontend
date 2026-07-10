"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, BriefcaseBusiness, Clock3, Crown, GitMerge, Link2, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

type Formation = "dharmaKarma" | "tenthTrikona" | "trikonaInTenth" | "vipareeta";
type ViewMode = "formation" | "capacity" | "cancellation" | "dasha";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [GREEN]: "#E8F5E9",
  [BLUE]: "#E3F2FD",
  [VERMILION]: "#FFEBEE",
  [GOLD]: "#FFF3E0",
};

const FORMATIONS: Record<Formation, { label: string; title: string; body: string; color: string }> = {
  dharmaKarma: {
    label: "9th + 10th",
    title: "Dharma-karmadhipati",
    body: "The 9th lord and 10th lord connect: fortune and action fuse into the premier career raja-yoga.",
    color: GOLD,
  },
  tenthTrikona: {
    label: "10th + trikona",
    title: "10th lord with a trikona lord",
    body: "The 10th lord associates with the 1st, 5th, or 9th lord, lifting professional standing.",
    color: BLUE,
  },
  trikonaInTenth: {
    label: "Trikona in 10th",
    title: "Placement-based career elevation",
    body: "A trikona lord occupies the 10th, or the 10th lord occupies a trikona, placing rise directly into career.",
    color: GREEN,
  },
  vipareeta: {
    label: "Vipareeta",
    title: "Rise through adversity",
    body: "Dusthana lords associating in dusthanas are not a classic kendra-trikona rise; they indicate reversal through difficulty.",
    color: VERMILION,
  },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  formation: {
    label: "Formation",
    title: "Career raja-yoga needs kendra-trikona association involving the 10th",
    body: "Conjunction, mutual aspect, exchange, or one occupying the other's house can form the association.",
    icon: <Link2 size={16} />,
    color: GOLD,
  },
  capacity: {
    label: "Capacity",
    title: "The rise is only as good as the forming planets",
    body: "Strong and dignified lords deliver a potent rise; weak or debilitated lords make the promise muted and obstructed.",
    icon: <BadgeCheck size={16} />,
    color: BLUE,
  },
  cancellation: {
    label: "Bhanga",
    title: "Cancellation changes the promise",
    body: "Afflicted planets, fallen lords, or broken delivery undermine a raja-yoga. Vipareeta is a different rise-through-adversity logic.",
    icon: <ShieldCheck size={16} />,
    color: VERMILION,
  },
  dasha: {
    label: "Dasha",
    title: "Career elevation flowers in the forming planets' periods",
    body: "A strong yoga off-dasha is latent. The actual rise peaks in the 9th- or 10th-lord period, or the forming planets' bhukti.",
    icon: <Clock3 size={16} />,
    color: GREEN,
  },
};

export function RajaYogaTenthCareerWorkbench() {
  const [formation, setFormation] = useState<Formation>("dharmaKarma");
  const [viewMode, setViewMode] = useState<ViewMode>("formation");
  const [strongLords, setStrongLords] = useState(true);
  const [uncancelled, setUncancelled] = useState(true);
  const [tenthInvolved, setTenthInvolved] = useState(true);
  const [dashaActive, setDashaActive] = useState(true);
  const [streamFieldReady, setStreamFieldReady] = useState(true);

  const classic = formation !== "vipareeta";
  const validCareerYoga = classic && tenthInvolved;
  const score = Math.max(5, Math.min(98, (validCareerYoga ? 32 : 10) + (strongLords ? 22 : -8) + (uncancelled ? 18 : -18) + (dashaActive ? 18 : -8) + (streamFieldReady ? 8 : -4)));

  const verdict = useMemo(() => {
    const item = FORMATIONS[formation];
    if (!classic) return "Vipareeta is career-relevant as rise through adversity, but do not confuse it with a direct kendra-trikona raja-yoga.";
    if (!tenthInvolved) return "Raja-yoga may be present, but without the 10th it is not a career-height indicator in this lesson's sense.";
    if (!strongLords) return `${item.title} is present but muted: weak or debilitated forming lords indicate elevation obstructed or delivered below the yoga's name.`;
    if (!uncancelled) return `${item.title} is broken by bhanga conditions, so the rise should not be read at full strength.`;
    if (!dashaActive) return `${item.title} is strong and career-relevant, but latent now because the forming planets' dasha is not active.`;
    if (!streamFieldReady) return `${item.title} gives career height, but the field still has to come from the 10th/D10, AmK, KP, PMP, or Sarasvati layers.`;
    return `${item.title} is strong, uncancelled, 10th-related, and active by dasha: a confident rise to high professional standing is indicated.`;
  }, [classic, dashaActive, formation, streamFieldReady, strongLords, tenthInvolved, uncancelled]);

  function loadPreset(kind: "potent" | "weak" | "vipareeta") {
    if (kind === "potent") {
      setFormation("dharmaKarma");
      setStrongLords(true);
      setUncancelled(true);
      setTenthInvolved(true);
      setDashaActive(true);
      setStreamFieldReady(true);
    } else if (kind === "weak") {
      setFormation("dharmaKarma");
      setStrongLords(false);
      setUncancelled(true);
      setTenthInvolved(true);
      setDashaActive(false);
      setStreamFieldReady(true);
    } else {
      setFormation("vipareeta");
      setStrongLords(true);
      setUncancelled(true);
      setTenthInvolved(false);
      setDashaActive(true);
      setStreamFieldReady(false);
    }
  }

  return (
    <div data-interactive="raja-yoga-tenth-career-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>10th-house raja-yoga career height</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Judge career elevation through formation, capacity, bhanga, and dasha</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Build a 10th-related raja-yoga, then decide whether it gives a direct rise, a muted promise, or a latent elevation.
            </p>
          </div>
          <button type="button" onClick={() => { setViewMode("formation"); loadPreset("potent"); }} style={buttonStyle(false, GOLD)}>
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
              <p style={eyebrowStyle}>Career-height bridge</p>
              <h3 style={{ margin: "0.15rem 0 0", color: score > 72 ? GREEN : score > 45 ? GOLD : VERMILION, fontSize: "1.2rem" }}>
                {score > 72 ? "High-standing rise active" : score > 45 ? "Elevation qualified" : "Do not overstate the rise"}
              </h3>
            </div>
            <span style={{ color: score > 72 ? GREEN : score > 45 ? GOLD : VERMILION, fontWeight: 600 }}>{score}% elevation signal</span>
          </div>
          <RajaYogaSvg formation={formation} strongLords={strongLords} uncancelled={uncancelled} tenthInvolved={tenthInvolved} dashaActive={dashaActive} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Formation" body={classic ? FORMATIONS[formation].label : "vipareeta"} color={FORMATIONS[formation].color} icon={<Crown size={16} />} />
            <MiniFact title="Capacity" body={strongLords ? "strong lords" : "muted"} color={strongLords ? GREEN : VERMILION} icon={<BadgeCheck size={16} />} />
            <MiniFact title="Dasha" body={dashaActive ? "active now" : "latent"} color={dashaActive ? GREEN : GOLD} icon={<Clock3 size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Formation selector" icon={<GitMerge size={18} />} color={FORMATIONS[formation].color}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.5rem" }}>
              {(Object.keys(FORMATIONS) as Formation[]).map((key) => {
                const item = FORMATIONS[key];
                return (
                  <button key={key} type="button" aria-pressed={formation === key} onClick={() => setFormation(key)} style={formationButtonStyle(formation === key, item.color)}>
                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
            <p style={bodyTextStyle}>{FORMATIONS[formation].body}</p>
          </Panel>

          <Panel title="Worked presets" icon={<BriefcaseBusiness size={18} />} color={score > 72 ? GREEN : GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" onClick={() => loadPreset("potent")} style={buttonStyle(false, GREEN)}>Strong 9th-10th</button>
              <button type="button" onClick={() => loadPreset("weak")} style={buttonStyle(false, GOLD)}>Weak lords</button>
              <button type="button" onClick={() => loadPreset("vipareeta")} style={buttonStyle(false, VERMILION)}>Vipareeta contrast</button>
            </div>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Capacity and cancellation</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={tenthInvolved} color={tenthInvolved ? GREEN : GOLD} icon={<BriefcaseBusiness size={18} />} title="10th involved" body={tenthInvolved ? "The yoga speaks directly to career height." : "No 10th link: do not make it this lesson's career raja-yoga."} onClick={() => setTenthInvolved((value) => !value)} />
            <Toggle active={strongLords} color={strongLords ? GREEN : VERMILION} icon={<BadgeCheck size={18} />} title="Forming lords strong" body={strongLords ? "Strong and dignified lords can deliver the rise." : "Weak/debilitated lords obstruct delivery."} onClick={() => setStrongLords((value) => !value)} />
            <Toggle active={uncancelled} color={uncancelled ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="No bhanga" body={uncancelled ? "Cancellation check is clear." : "Broken yoga: elevation must be heavily qualified."} onClick={() => setUncancelled((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Timing and proportion</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={dashaActive} color={dashaActive ? GREEN : GOLD} icon={<Clock3 size={18} />} title="Forming-planet dasha active" body={dashaActive ? "Elevation is flowering in the current period." : "Strong promise, but latent off-dasha."} onClick={() => setDashaActive((value) => !value)} />
            <Toggle active={streamFieldReady} color={streamFieldReady ? GREEN : GOLD} icon={<Sparkles size={18} />} title="Field supplied by streams" body={streamFieldReady ? "Raja-yoga gives height; other streams give field." : "Do not turn career-height into the whole career answer."} onClick={() => setStreamFieldReady((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: score > 72 ? `${GREEN}66` : score > 45 ? `${GOLD}66` : `${VERMILION}66`, background: score > 72 ? `${GREEN}10` : score > 45 ? `${GOLD}10` : `${VERMILION}0F` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <AlertTriangle size={20} color={score > 72 ? GREEN : score > 45 ? GOLD : VERMILION} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Career elevation reading</p>
            <h3 style={{ margin: "0.15rem 0 0", color: score > 72 ? GREEN : score > 45 ? GOLD : VERMILION, fontSize: "1.16rem" }}>
              {score > 72 ? "Rise to high standing is well supported" : score > 45 ? "Rise indicated with qualifications" : "Formation should not be read at full value"}
            </h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{verdict}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function RajaYogaSvg({ formation, strongLords, uncancelled, tenthInvolved, dashaActive }: { formation: Formation; strongLords: boolean; uncancelled: boolean; tenthInvolved: boolean; dashaActive: boolean }) {
  const color = FORMATIONS[formation].color;
  const classic = formation !== "vipareeta";
  return (
    <svg viewBox="0 0 720 390" role="img" aria-label="10th raja-yoga career elevation diagram" style={{ width: "100%", minHeight: 340, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 226 120 L 304 120" stroke={classic ? color : HAIRLINE} strokeWidth="3" strokeDasharray="7 5" markerEnd="url(#arrowRaja)" />
      <path d="M 416 120 L 494 120" stroke={tenthInvolved ? GREEN : HAIRLINE} strokeWidth="3" markerEnd="url(#arrowRaja)" />
      <circle cx="170" cy="120" r="56" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={classic ? GOLD : HAIRLINE} strokeWidth="3" />
      <text x="170" y="116" textAnchor="middle" fill={classic ? GOLD : INK_MUTED} fontSize="18" fontWeight="600">Trikona</text>
      <text x="170" y="138" textAnchor="middle" fill={INK_MUTED} fontSize="14">1 / 5 / 9</text>
      <circle cx="360" cy="120" r="56" fill={OPAQUE_LIGHT_FILL[BLUE]} stroke={classic ? BLUE : HAIRLINE} strokeWidth="3" />
      <text x="360" y="116" textAnchor="middle" fill={classic ? BLUE : INK_MUTED} fontSize="18" fontWeight="600">Kendra</text>
      <text x="360" y="138" textAnchor="middle" fill={INK_MUTED} fontSize="14">1 / 4 / 7 / 10</text>
      <circle cx="550" cy="120" r="56" fill={OPAQUE_LIGHT_FILL[GREEN]} stroke={tenthInvolved ? GREEN : HAIRLINE} strokeWidth="3" />
      <text x="550" y="116" textAnchor="middle" fill={tenthInvolved ? GREEN : INK_MUTED} fontSize="18" fontWeight="600">10th</text>
      <text x="550" y="138" textAnchor="middle" fill={INK_MUTED} fontSize="14">career height</text>
      <rect x="90" y="270" width="540" height="68" rx="8" fill={OPAQUE_LIGHT_FILL[color] || `${color}10`} stroke={color} />
      <text x="360" y="299" textAnchor="middle" fill={color} fontSize="20" fontWeight="600">{FORMATIONS[formation].title}</text>
      <text x="360" y="324" textAnchor="middle" fill={INK_MUTED} fontSize="15">
        {strongLords && uncancelled && dashaActive ? "strong, uncancelled, active" : "capacity / bhanga / dasha qualified"}
      </text>
      <defs>
        <marker id="arrowRaja" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
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

function formationButtonStyle(active: boolean, color: string): CSSProperties {
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
