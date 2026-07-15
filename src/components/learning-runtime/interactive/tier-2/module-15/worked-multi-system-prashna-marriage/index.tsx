"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  GitCompare,
  HeartHandshake,
  Layers3,
  RefreshCw,
  Route,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type FocusKey = "all" | "tajika" | "parashari" | "kp" | "rp";
type KpMode = "number90" | "hypothetical";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const VERMILION = "var(--gl-vermilion-accent)";
const PURPLE = "#6B5AA8";

const PANELS = {
  tajika: {
    label: "Tajika",
    verdict: "Qualified yes-trending",
    body: "Vartamana Ithasala plus Ikkavala forms the bond, tempered by Manaau asymmetry and an unsupportive Punya Saham.",
    color: BLUE,
  },
  parashari: {
    label: "Parashari",
    verdict: "Favourable, decided by secondary tier",
    body: "Jupiter as 7th lord is weak; Venus as karaka is strong. Saturn's favourable special aspect decides the disagreement.",
    color: GREEN,
  },
  kp: {
    label: "KP",
    verdict: "Clean strongly favourable YES",
    body: "Number 90 gives Leo lagna. Mercury CSL chain has supporting occupancy and ownership touches with no negating touch.",
    color: GOLD,
  },
  rp: {
    label: "RP overlay",
    verdict: "Tajika confirmed; Parashari partial with tension",
    body: "Virgo-lagna RP set confirms Mercury and Jupiter for Tajika; Parashari gets Jupiter only, with negating-house tension.",
    color: PURPLE,
  },
};

export function WorkedMultiSystemPrashnaMarriage() {
  const [focus, setFocus] = useState<FocusKey>("all");
  const [kpMode, setKpMode] = useState<KpMode>("number90");
  const [nameRoute, setNameRoute] = useState(true);
  const [parashariDisagreement, setParashariDisagreement] = useState(true);
  const [rpScope, setRpScope] = useState(true);
  const [noMergedScore, setNoMergedScore] = useState(true);

  const kpConverges = kpMode === "number90";
  const ready = nameRoute && parashariDisagreement && rpScope && noMergedScore;

  const synthesis = useMemo(() => {
    if (!nameRoute) return "Repair: name the KP Leo lagna versus shared Virgo lagna before synthesis.";
    if (!parashariDisagreement) return "Repair: Parashari's weak lord versus strong karaka must be named before Saturn decides it.";
    if (!rpScope) return "Repair: the Virgo-lagna RP overlay belongs only to Parashari/Tajika, not the KP Leo lagna.";
    if (!noMergedScore) return "Repair: do not blend three system verdicts and one overlay into a single score.";
    if (!kpConverges) return "Hypothetical number creates divergence: switch from single-verdict framing to two-part-resolved framing.";
    return "Three verdict-bearing systems converge favourably, with distinct texture and a disclosed RP tension caveat.";
  }, [kpConverges, nameRoute, noMergedScore, parashariDisagreement, rpScope]);

  return (
    <div data-interactive="worked-multi-system-prashna-marriage" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Worked multi-system marriage prashna</p>
            <h2 style={headingStyle}>Four panels stay visible; one synthesis preserves their textures</h2>
            <p style={bodyStyle}>
              Rebuild the capstone: Tajika reused, Parashari decided by secondary tier, KP read from number 90, and RP overlay scoped to the shared Virgo lagna.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFocus("all");
              setKpMode("number90");
              setNameRoute(true);
              setParashariDisagreement(true);
              setRpScope(true);
              setNoMergedScore(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 620px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <p style={eyebrowStyle}>System panels</p>
            <div style={segmentedStyle}>
              <ModeButton active={focus === "all"} onClick={() => setFocus("all")} label="All" />
              <ModeButton active={focus === "tajika"} onClick={() => setFocus("tajika")} label="Tajika" />
              <ModeButton active={focus === "parashari"} onClick={() => setFocus("parashari")} label="Parashari" />
              <ModeButton active={focus === "kp"} onClick={() => setFocus("kp")} label="KP" />
              <ModeButton active={focus === "rp"} onClick={() => setFocus("rp")} label="RP" />
            </div>
          </div>
          <MarriageDiagram focus={focus} kpConverges={kpConverges} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: ready ? GREEN : VERMILION }}>
            {ready ? <BadgeCheck size={16} /> : <AlertTriangle size={16} />}
            <p style={eyebrowStyle}>Composed reading</p>
          </div>
          <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{kpConverges ? "Single-verdict convergence" : "Two-part-resolved divergence"}</h3>
          <p style={bodyStyle}>{synthesis}</p>
          <div style={{ ...noticeStyle(kpConverges ? GREEN : GOLD), marginTop: "1rem" }}>
            <HeartHandshake size={18} />
            <span>{kpConverges ? "Direction converges; texture stays distinct." : "Hypothetical KP divergence must be reported, not averaged away."}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        {(Object.keys(PANELS) as Array<keyof typeof PANELS>).map((key) => (
          <SystemCard key={key} panel={PANELS[key]} visible={focus === "all" || focus === key} />
        ))}
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>KP number sensitivity</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.85rem" }}>
            <button type="button" onClick={() => setKpMode("number90")} aria-pressed={kpMode === "number90"} style={choiceButtonStyle(kpMode === "number90", GREEN)}>
              <BadgeCheck size={16} />
              <span><span style={{ display: "block", fontWeight: 500 }}>Actual number 90</span><span style={smallTextStyle}>Clean supporting-only KP YES.</span></span>
            </button>
            <button type="button" onClick={() => setKpMode("hypothetical")} aria-pressed={kpMode === "hypothetical"} style={choiceButtonStyle(kpMode === "hypothetical", GOLD)}>
              <AlertTriangle size={16} />
              <span><span style={{ display: "block", fontWeight: 500 }}>Hypothetical negating number</span><span style={smallTextStyle}>Forces two-part-resolved synthesis mode.</span></span>
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Route snapshot</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            <InfoLine label="KP lagna" value="Leo, number-derived from 90" color={GOLD} />
            <InfoLine label="Parashari / Tajika lagna" value="Virgo, moment-cast" color={BLUE} />
            <InfoLine label="RP overlay scope" value="Virgo lagna only; not applied to KP" color={PURPLE} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Six-step safeguards</p>
        <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
          <ToggleRow checked={nameRoute} onChange={setNameRoute} label="Name lagna-source split" body="KP Leo and moment-cast Virgo are different house-1 seats." icon={<Route size={16} />} />
          <ToggleRow checked={parashariDisagreement} onChange={setParashariDisagreement} label="Do not smooth Parashari disagreement" body="Weak Jupiter lord and strong Venus karaka must both be named." icon={<GitCompare size={16} />} />
          <ToggleRow checked={rpScope} onChange={setRpScope} label="Block Virgo RP overlay from KP" body="KP's native RP check would use the number-derived lagna." icon={<ShieldCheck size={16} />} />
          <ToggleRow checked={noMergedScore} onChange={setNoMergedScore} label="No blended confidence score" body="Convergence is reported with distinct system texture." icon={<Layers3 size={16} />} />
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Capstone synthesis check</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "Worked marriage synthesis held cleanly" : "Repair the synthesis protocol"}</h3>
            <p style={bodyStyle}>{synthesis}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WorkedMultiSystemPrashnaMarriage;

function MarriageDiagram({ focus, kpConverges }: { focus: FocusKey; kpConverges: boolean }) {
  const columns = [
    { key: "tajika", x: 58, label: "Tajika", result: "Qualified yes", color: BLUE },
    { key: "parashari", x: 238, label: "Parashari", result: "Secondary decides", color: GREEN },
    { key: "kp", x: 418, label: "KP", result: kpConverges ? "Clean YES" : "Hypothetical NO", color: kpConverges ? GOLD : VERMILION },
    { key: "rp", x: 598, label: "RP overlay", result: "Corroborating", color: PURPLE },
  ] as const;
  return (
    <svg viewBox="0 0 820 470" role="img" aria-label="Worked multi-system prashna marriage synthesis diagram" style={{ width: "100%", minHeight: 370, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="450" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">One real moment, two lagna conventions, four visible panels</text>
      {columns.map((column) => {
        const active = focus === "all" || focus === column.key;
        return (
          <g key={column.key} opacity={active ? 1 : 0.35}>
            <rect x={column.x} y="90" width="148" height="184" rx="8" fill={softFill(column.color)} stroke={column.color} />
            <text x={column.x + 74} y="122" textAnchor="middle" fill={column.color} fontSize="12" fontWeight="500">{column.label}</text>
            <text x={column.x + 74} y="150" textAnchor="middle" fill={INK_MUTED} fontSize="9.5">{column.result}</text>
            <circle cx={column.x + 74} cy="210" r="30" fill="#FFFFFF" stroke={column.color} />
            <text x={column.x + 74} y="215" textAnchor="middle" fill={column.color} fontSize="10" fontWeight="500">{column.key === "rp" ? "overlay" : "verdict"}</text>
          </g>
        );
      })}
      <path d="M132 302 C250 344, 550 344, 672 302" fill="none" stroke={kpConverges ? GREEN : GOLD} strokeWidth="2" strokeDasharray="6 7" />
      <rect x="232" y="382" width="356" height="36" rx="8" fill={softFill(kpConverges ? GREEN : GOLD)} stroke={kpConverges ? GREEN : GOLD} />
      <text x="410" y="404" textAnchor="middle" fill={kpConverges ? GREEN : GOLD} fontSize="11.5" fontWeight="500">{kpConverges ? "Converged favourable direction; no blended score" : "Divergence requires two-part-resolved framing"}</text>
    </svg>
  );
}

function SystemCard({ panel, visible }: { panel: (typeof PANELS)[keyof typeof PANELS]; visible: boolean }) {
  return (
    <div style={{ ...cardStyle, opacity: visible ? 1 : 0.45 }}>
      <p style={eyebrowStyle}>{panel.label}</p>
      <h3 style={{ ...panelTitleStyle, color: panel.color }}>{panel.verdict}</h3>
      <p style={bodyStyle}>{panel.body}</p>
    </div>
  );
}

function InfoLine({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, background: softFill(color), padding: "0.65rem" }}>
      <span style={{ display: "block", color, fontSize: "0.8rem", fontWeight: 500 }}>{label}</span>
      <span style={smallTextStyle}>{value}</span>
    </div>
  );
}

function ModeButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return <button type="button" aria-pressed={active} onClick={onClick} style={viewButtonStyle(active)}>{label}</button>;
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} style={{ marginLeft: "auto", accentColor: ACCENT }} />
    </label>
  );
}

function softFill(color: string) {
  if (color.startsWith("#")) return `${color}18`;
  return "rgba(184, 132, 33, 0.12)";
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-card-shadow-soft)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.76rem",
  fontWeight: 600,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.35rem",
  fontWeight: 600,
  lineHeight: 1.25,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  fontWeight: 600,
  lineHeight: 1.3,
};

const bodyStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  maxWidth: 920,
};

const smallTextStyle: CSSProperties = {
  color: INK_MUTED,
  fontSize: "0.82rem",
  lineHeight: 1.45,
};

const softButtonStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "#FFFFFF",
  color: INK_SECONDARY,
  padding: "0.55rem 0.8rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  cursor: "pointer",
  fontWeight: 500,
};

const segmentedStyle: CSSProperties = {
  display: "flex",
  gap: "0.35rem",
  flexWrap: "wrap",
  alignItems: "center",
};

function viewButtonStyle(active: boolean): CSSProperties {
  return {
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "#F7F0E1" : "#FFFFFF",
    color: active ? ACCENT : INK_SECONDARY,
    padding: "0.46rem 0.68rem",
    cursor: "pointer",
    fontWeight: 500,
  };
}

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : "#FFFFFF",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
    display: "flex",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: checked ? "#F7F0E1" : "#FFFFFF",
    padding: "0.7rem",
    display: "flex",
    gap: "0.65rem",
    alignItems: "center",
    cursor: "pointer",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}`,
    borderRadius: 8,
    background: softFill(color),
    color,
    padding: "0.75rem",
    display: "flex",
    alignItems: "start",
    gap: "0.55rem",
    lineHeight: 1.45,
    fontSize: "0.9rem",
  };
}

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "1rem",
};
