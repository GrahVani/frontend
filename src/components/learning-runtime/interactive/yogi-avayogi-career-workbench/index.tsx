"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, BadgeCheck, BriefcaseBusiness, Clock3, Info, RotateCcw, Scale, ShieldCheck, SunMoon } from "lucide-react";

type ViewMode = "derive" | "career" | "dasha" | "honesty";
type CoreReading = "strong" | "weak";

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

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  derive: {
    label: "Derive",
    title: "Yogi and Avayogi come from a Sun-Moon derived point",
    body: "Software computes the exact point; the lesson needs the identities of the supportive Yogi and obstructive Avayogi planets.",
    icon: <SunMoon size={16} />,
    color: GOLD,
  },
  career: {
    label: "Career",
    title: "For career, weight the connection to the 10th",
    body: "A Yogi or Avayogi matters for profession when it rules, occupies, aspects, or relates to the 10th or the 10th lord.",
    icon: <BriefcaseBusiness size={16} />,
    color: BLUE,
  },
  dasha: {
    label: "Dasha",
    title: "The lift or drag concentrates in its own period",
    body: "A 10th-connected Yogi gives the most visible support in its dasha; a 10th-connected Avayogi gives the most caution in its dasha.",
    icon: <Clock3 size={16} />,
    color: GREEN,
  },
  honesty: {
    label: "Honesty",
    title: "Modern-systematised supplement, not a master key",
    body: "Use the technique as practised and useful, but supplementary. It shades the core reading; it does not overturn it.",
    icon: <Info size={16} />,
    color: PURPLE,
  },
};

export function YogiAvayogiCareerWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("career");
  const [coreReading, setCoreReading] = useState<CoreReading>("strong");
  const [yogiTenth, setYogiTenth] = useState(true);
  const [avayogiTenth, setAvayogiTenth] = useState(false);
  const [yogiDasha, setYogiDasha] = useState(true);
  const [avayogiDasha, setAvayogiDasha] = useState(false);
  const [honestFrame, setHonestFrame] = useState(true);
  const [overClaim, setOverClaim] = useState(false);

  const yogiLift = yogiTenth ? (yogiDasha ? 18 : 8) : 2;
  const avayogiDrag = avayogiTenth ? (avayogiDasha ? 18 : 8) : 2;
  const coreScore = coreReading === "strong" ? 64 : 34;
  const score = Math.max(5, Math.min(96, coreScore + yogiLift - avayogiDrag - (honestFrame ? 0 : 12) - (overClaim ? 22 : 0)));
  const net = yogiLift - avayogiDrag;

  const verdict = useMemo(() => {
    if (!honestFrame) return "Method warning: state that Yogi/Avayogi is modern-systematised and supplementary before applying it predictively.";
    if (overClaim) return "Over-claim warning: this layer cannot turn a weak core career into brilliance or a strong core into ruin.";
    if (coreReading === "weak" && yogiTenth) return "Weak core reading with a Yogi lift: the Yogi adds a modest supportive window, especially in its dasha, but the career remains weak-to-moderate overall.";
    if (coreReading === "strong" && avayogiTenth && avayogiDasha) return "Strong core reading with active Avayogi drag: keep the favourable career promise, but caution the current period for friction, delay, or setbacks.";
    if (coreReading === "strong" && yogiTenth && yogiDasha) return "Strong core reading plus active 10th-connected Yogi: the period is especially well-supported for advancement and relative ease.";
    if (!yogiTenth && !avayogiTenth) return "Neither planet is clearly tied to the 10th, so the Yogi/Avayogi career effect is slight.";
    return "Use the net lift-or-drag as a small timing and confidence adjustment after the core career analysis.";
  }, [avayogiDasha, avayogiTenth, coreReading, honestFrame, overClaim, yogiDasha, yogiTenth]);

  return (
    <div data-interactive="yogi-avayogi-career-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Yogi and Avayogi career overlay</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Apply lift and drag without over-claiming</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Read the Yogi as supportive and the Avayogi as obstructive only after checking 10th connection, dasha, and the core career promise.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("career");
              setCoreReading("strong");
              setYogiTenth(true);
              setAvayogiTenth(false);
              setYogiDasha(true);
              setAvayogiDasha(false);
              setHonestFrame(true);
              setOverClaim(false);
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
              <p style={eyebrowStyle}>Lift-drag balance</p>
              <h3 style={{ margin: "0.15rem 0 0", color: score > 65 ? GREEN : score > 42 ? GOLD : VERMILION, fontSize: "1.2rem" }}>
                {net > 8 ? "Supportive lift active" : net < -8 ? "Career drag active" : "Small adjustment only"}
              </h3>
            </div>
            <span style={{ color: score > 65 ? GREEN : score > 42 ? GOLD : VERMILION, fontWeight: 600 }}>{score}% adjusted career tone</span>
          </div>
          <LiftDragSvg yogiTenth={yogiTenth} avayogiTenth={avayogiTenth} yogiDasha={yogiDasha} avayogiDasha={avayogiDasha} coreReading={coreReading} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Core" body={coreReading === "strong" ? "favourable" : "weak"} color={coreReading === "strong" ? GREEN : GOLD} icon={<Scale size={16} />} />
            <MiniFact title="Yogi" body={yogiDasha ? "lift active" : "lift latent"} color={yogiTenth ? GREEN : GOLD} icon={<ArrowUp size={16} />} />
            <MiniFact title="Avayogi" body={avayogiDasha ? "drag active" : "drag latent"} color={avayogiTenth ? VERMILION : GOLD} icon={<ArrowDown size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Core reading first" icon={<Scale size={18} />} color={coreReading === "strong" ? GREEN : GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={coreReading === "strong"} onClick={() => setCoreReading("strong")} style={buttonStyle(coreReading === "strong", GREEN)}>
                Strong core
              </button>
              <button type="button" aria-pressed={coreReading === "weak"} onClick={() => setCoreReading("weak")} style={buttonStyle(coreReading === "weak", GOLD)}>
                Weak core
              </button>
            </div>
            <p style={bodyTextStyle}>The overlay shades the core. It does not create the career promise by itself.</p>
          </Panel>

          <Panel title="Worked presets" icon={<BadgeCheck size={18} />} color={GREEN}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" onClick={() => {
                setCoreReading("strong");
                setYogiTenth(true);
                setYogiDasha(true);
                setAvayogiTenth(false);
                setAvayogiDasha(false);
                setHonestFrame(true);
                setOverClaim(false);
              }} style={buttonStyle(false, GREEN)}>
                Yogi lift
              </button>
              <button type="button" onClick={() => {
                setCoreReading("weak");
                setYogiTenth(true);
                setYogiDasha(true);
                setAvayogiTenth(false);
                setAvayogiDasha(false);
                setHonestFrame(true);
                setOverClaim(true);
              }} style={buttonStyle(false, VERMILION)}>
                Over-claim trap
              </button>
              <button type="button" onClick={() => {
                setCoreReading("strong");
                setYogiTenth(false);
                setYogiDasha(false);
                setAvayogiTenth(true);
                setAvayogiDasha(true);
                setHonestFrame(true);
                setOverClaim(false);
              }} style={buttonStyle(false, GOLD)}>
                Avayogi caution
              </button>
            </div>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>10th connection</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={yogiTenth} color={yogiTenth ? GREEN : GOLD} icon={<ArrowUp size={18} />} title="Yogi connected to 10th" body={yogiTenth ? "Supportive planet can lift career." : "Career effect is slight without 10th connection."} onClick={() => setYogiTenth((value) => !value)} />
            <Toggle active={avayogiTenth} color={avayogiTenth ? VERMILION : GOLD} icon={<ArrowDown size={18} />} title="Avayogi connected to 10th" body={avayogiTenth ? "Obstructive planet can drag career." : "Avayogi is not strongly career-applied."} onClick={() => setAvayogiTenth((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Dasha weighting and honesty</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={yogiDasha} color={yogiDasha ? GREEN : GOLD} icon={<Clock3 size={18} />} title="Yogi period running" body={yogiDasha ? "Lift is active in the current period." : "Yogi support is present but not strongly timed."} onClick={() => setYogiDasha((value) => !value)} />
            <Toggle active={avayogiDasha} color={avayogiDasha ? VERMILION : GOLD} icon={<Clock3 size={18} />} title="Avayogi period running" body={avayogiDasha ? "Drag is active in the current period." : "Avayogi caution is less immediate."} onClick={() => setAvayogiDasha((value) => !value)} />
            <Toggle active={honestFrame} color={honestFrame ? GREEN : VERMILION} icon={<Info size={18} />} title="Modern-systematised frame stated" body={honestFrame ? "Technique is framed as supplementary and proportionate." : "Status is hidden or overstated."} onClick={() => setHonestFrame((value) => !value)} />
            <Toggle active={overClaim} color={overClaim ? VERMILION : GREEN} icon={<AlertTriangle size={18} />} title="Over-claim from overlay" body={overClaim ? "Error active: overlay is overriding the core reading." : "Correct: overlay only shades timing and confidence."} onClick={() => setOverClaim((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: score > 65 ? `${GREEN}66` : score > 42 ? `${GOLD}66` : `${VERMILION}66`, background: score > 65 ? `${GREEN}10` : score > 42 ? `${GOLD}10` : `${VERMILION}0F` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <ShieldCheck size={20} color={score > 65 ? GREEN : score > 42 ? GOLD : VERMILION} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Proportionate career statement</p>
            <h3 style={{ margin: "0.15rem 0 0", color: score > 65 ? GREEN : score > 42 ? GOLD : VERMILION, fontSize: "1.16rem" }}>
              {overClaim || !honestFrame ? "Repair the framing" : net > 8 ? "Supplementary lift" : net < -8 ? "Supplementary caution" : "Minor overlay"}
            </h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{verdict}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function LiftDragSvg({ yogiTenth, avayogiTenth, yogiDasha, avayogiDasha, coreReading }: { yogiTenth: boolean; avayogiTenth: boolean; yogiDasha: boolean; avayogiDasha: boolean; coreReading: CoreReading }) {
  const coreColor = coreReading === "strong" ? GREEN : GOLD;
  return (
    <svg viewBox="0 0 720 390" role="img" aria-label="Yogi and Avayogi career lift-drag diagram" style={{ width: "100%", minHeight: 340, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 204 102 C 235 120, 268 145, 288 163" fill="none" stroke={yogiTenth ? GREEN : HAIRLINE} strokeWidth={yogiDasha ? 4 : 2} markerEnd="url(#arrowLift)" />
      <path d="M 516 102 C 485 120, 452 145, 432 163" fill="none" stroke={avayogiTenth ? VERMILION : HAIRLINE} strokeWidth={avayogiDasha ? 4 : 2} markerEnd="url(#arrowDrag)" />
      <circle cx="360" cy="178" r="74" fill={OPAQUE_LIGHT_FILL[coreColor] || `${coreColor}12`} stroke={coreColor} strokeWidth="3" />
      <text x="360" y="172" textAnchor="middle" fill={coreColor} fontSize="21" fontWeight="600">Core career</text>
      <text x="360" y="198" textAnchor="middle" fill={INK_MUTED} fontSize="16">{coreReading === "strong" ? "favourable base" : "weak base"}</text>

      <circle cx="150" cy="102" r="54" fill={OPAQUE_LIGHT_FILL[GREEN]} stroke={yogiTenth ? GREEN : HAIRLINE} strokeWidth="3" />
      <text x="150" y="98" textAnchor="middle" fill={yogiTenth ? GREEN : INK_MUTED} fontSize="19" fontWeight="600">Yogi</text>
      <text x="150" y="121" textAnchor="middle" fill={INK_MUTED} fontSize="14">{yogiDasha ? "dasha active" : "latent"}</text>

      <circle cx="570" cy="102" r="54" fill={OPAQUE_LIGHT_FILL[VERMILION]} stroke={avayogiTenth ? VERMILION : HAIRLINE} strokeWidth="3" />
      <text x="570" y="98" textAnchor="middle" fill={avayogiTenth ? VERMILION : INK_MUTED} fontSize="19" fontWeight="600">Avayogi</text>
      <text x="570" y="121" textAnchor="middle" fill={INK_MUTED} fontSize="14">{avayogiDasha ? "dasha active" : "latent"}</text>

      <rect x="180" y="300" width="360" height="40" rx="8" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={PURPLE} />
      <text x="360" y="325" textAnchor="middle" fill={PURPLE} fontSize="15" fontWeight="600">supplementary, dasha-weighted, never standalone</text>
      <defs>
        <marker id="arrowLift" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={GREEN} />
        </marker>
        <marker id="arrowDrag" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={VERMILION} />
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
