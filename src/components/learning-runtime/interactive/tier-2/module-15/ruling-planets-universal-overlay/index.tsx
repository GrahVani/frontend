"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  Eye,
  GitCompare,
  Layers3,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type PrimarySystem = "parashari" | "tajika";
type OverlayMode = "confirming" | "silent";

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

const ROLES = [
  { role: "Lagna sign-lord", planet: "Mercury", origin: "System-neutral", icon: <Layers3 size={16} />, color: BLUE },
  { role: "Lagna star-lord", planet: "Mars", origin: "System-neutral", icon: <Sparkles size={16} />, color: BLUE },
  { role: "Moon sign-lord", planet: "Venus", origin: "System-neutral", icon: <Moon size={16} />, color: BLUE },
  { role: "Moon star-lord", planet: "Saturn", origin: "System-neutral", icon: <Sparkles size={16} />, color: BLUE },
  { role: "Day-lord", planet: "Friday: Venus", origin: "System-neutral", icon: <CalendarDays size={16} />, color: BLUE },
  { role: "Lagna sub-lord", planet: "Mercury", origin: "KP-native", icon: <GitCompare size={16} />, color: VERMILION },
];

export function RulingPlanetsUniversalOverlay() {
  const [primarySystem, setPrimarySystem] = useState<PrimarySystem>("parashari");
  const [overlayMode, setOverlayMode] = useState<OverlayMode>("confirming");
  const [showDisclosure, setShowDisclosure] = useState(true);
  const [confirmOnly, setConfirmOnly] = useState(true);
  const [reportSilent, setReportSilent] = useState(true);
  const [markSubLord, setMarkSubLord] = useState(true);

  const primaryLabel = primarySystem === "parashari" ? "Parashari" : "Tajika";
  const primaryTechnique = primarySystem === "parashari" ? "two-tier procedure" : "ithasala or isarpha test";
  const overlayLabel = overlayMode === "confirming" ? "confirming" : "non-confirming";
  const ready = showDisclosure && confirmOnly && reportSilent && markSubLord;

  const disclosure = `This ${primaryLabel} verdict was reached entirely through ${primaryLabel}'s own native ${primaryTechnique}. A Ruling Planet overlay, a KP-native cross-check applied here by explicit choice and disclosed as such, additionally shows ${overlayLabel} evidence.`;

  const feedback = useMemo(() => {
    if (!markSubLord) return "Repair: the lagna sub-lord is KP-native and must be visually separated from the five system-neutral inputs.";
    if (!showDisclosure) return "Repair: outside KP, the RP overlay needs the disclosure sentence attached.";
    if (!confirmOnly) return "Repair: RPs confirm or stay silent; they do not override or re-grade the primary verdict.";
    if (!reportSilent) return "Repair: non-confirmation is a valid reported outcome, not something to suppress.";
    return overlayMode === "confirming"
      ? "Overlay confirms without changing the native verdict's grade."
      : "Overlay is non-confirming; the native verdict still stands on its own method.";
  }, [confirmOnly, markSubLord, overlayMode, reportSilent, showDisclosure]);

  return (
    <div data-interactive="ruling-planets-universal-overlay" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Ruling planets universal overlay</p>
            <h2 style={headingStyle}>Use RPs as a disclosed cross-check, never as the primary verdict</h2>
            <p style={bodyStyle}>
              Separate the five moment-based inputs from the KP-native sub-lord, then test confirmation without overriding Parashari or Tajika technique.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPrimarySystem("parashari");
              setOverlayMode("confirming");
              setShowDisclosure(true);
              setConfirmOnly(true);
              setReportSilent(true);
              setMarkSubLord(true);
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
            <p style={eyebrowStyle}>Six RP inputs</p>
            <div style={segmentedStyle}>
              <ModeButton active={primarySystem === "parashari"} onClick={() => setPrimarySystem("parashari")} label="Parashari" />
              <ModeButton active={primarySystem === "tajika"} onClick={() => setPrimarySystem("tajika")} label="Tajika" />
            </div>
          </div>
          <OverlayDiagram system={primarySystem} mode={overlayMode} markSubLord={markSubLord} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: overlayMode === "confirming" ? GREEN : GOLD }}>
            <Eye size={16} />
            <p style={eyebrowStyle}>Overlay result</p>
          </div>
          <h3 style={panelTitleStyle}>{overlayMode === "confirming" ? "RP overlay confirms" : "RP overlay is silent"}</h3>
          <p style={bodyStyle}>
            The {primaryLabel} verdict remains grounded in its own {primaryTechnique}. RP evidence is reported beside it, not folded into it.
          </p>
          <div style={{ ...noticeStyle(overlayMode === "confirming" ? GREEN : GOLD), marginTop: "1rem" }}>
            <ShieldCheck size={18} />
            <span>{overlayMode === "confirming" ? "Confirmation is extra corroboration only." : "Non-confirmation does not invalidate the native verdict."}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Role origin cards</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {ROLES.map((role) => (
              <RoleCard key={role.role} role={role} markSubLord={markSubLord} />
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Outcome controls</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.85rem" }}>
            <button type="button" onClick={() => setOverlayMode("confirming")} aria-pressed={overlayMode === "confirming"} style={choiceButtonStyle(overlayMode === "confirming", GREEN)}>
              <BadgeCheck size={16} />
              <span><span style={{ display: "block", fontWeight: 500 }}>Confirming overlay</span><span style={smallTextStyle}>RPs include the primary system&apos;s key significator.</span></span>
            </button>
            <button type="button" onClick={() => setOverlayMode("silent")} aria-pressed={overlayMode === "silent"} style={choiceButtonStyle(overlayMode === "silent", GOLD)}>
              <AlertTriangle size={16} />
              <span><span style={{ display: "block", fontWeight: 500 }}>Non-confirming overlay</span><span style={smallTextStyle}>RPs omit the key significators; report RP-silent.</span></span>
            </button>
          </div>
          <div style={{ ...noticeStyle(PURPLE), marginTop: "0.85rem" }}>
            <GitCompare size={18} />
            <span>Five inputs are shared moment facts. The lagna sub-lord is the one KP-native refinement.</span>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Disclosure preview</p>
        <div style={{ border: `1px solid ${showDisclosure ? GREEN : VERMILION}`, borderRadius: 8, background: showDisclosure ? softFill(GREEN) : softFill(VERMILION), padding: "0.85rem", marginTop: "0.75rem" }}>
          <p style={{ margin: 0, color: showDisclosure ? INK_SECONDARY : VERMILION, lineHeight: 1.55 }}>
            {showDisclosure ? disclosure : "Disclosure hidden: the RP finding now appears to belong to the primary system, which is exactly the lesson's warning."}
          </p>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Overlay safeguards</p>
        <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
          <ToggleRow checked={markSubLord} onChange={setMarkSubLord} label="Mark sub-lord as KP-native" body="Only the sixth role depends on KP's 249-fold subdivision." icon={<GitCompare size={16} />} />
          <ToggleRow checked={showDisclosure} onChange={setShowDisclosure} label="Attach disclosure sentence" body="Outside KP, the RP set is a disclosed overlay by choice." icon={<ShieldCheck size={16} />} />
          <ToggleRow checked={confirmOnly} onChange={setConfirmOnly} label="Confirm, do not override" body="RPs cannot re-grade a Parashari or Tajika verdict." icon={<BadgeCheck size={16} />} />
          <ToggleRow checked={reportSilent} onChange={setReportSilent} label="Report non-confirmation" body="RP-silent is an honest outcome, not a finding to hide." icon={<AlertTriangle size={16} />} />
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Cross-system overlay check</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "Overlay discipline preserved" : "Repair the disclosure discipline"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RulingPlanetsUniversalOverlay;

function OverlayDiagram({ system, mode, markSubLord }: { system: PrimarySystem; mode: OverlayMode; markSubLord: boolean }) {
  const nativeColor = system === "parashari" ? GREEN : BLUE;
  return (
    <svg viewBox="0 0 820 470" role="img" aria-label="Ruling planets cross-system overlay diagram" style={{ width: "100%", minHeight: 370, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="450" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Native verdict first; RP overlay second; disclosure always attached</text>
      <rect x="72" y="92" width="210" height="104" rx="8" fill={softFill(nativeColor)} stroke={nativeColor} />
      <text x="177" y="128" textAnchor="middle" fill={nativeColor} fontSize="13" fontWeight="500">{system === "parashari" ? "Parashari verdict" : "Tajika verdict"}</text>
      <text x="177" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="10">{system === "parashari" ? "two-tier procedure" : "ithasala / isarpha"}</text>
      <rect x="306" y="92" width="208" height="104" rx="8" fill={softFill(GOLD)} stroke={GOLD} />
      <text x="410" y="128" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="500">Disclosure gate</text>
      <text x="410" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="10">KP-native overlay named</text>
      <rect x="538" y="92" width="210" height="104" rx="8" fill={softFill(mode === "confirming" ? GREEN : GOLD)} stroke={mode === "confirming" ? GREEN : GOLD} />
      <text x="643" y="128" textAnchor="middle" fill={mode === "confirming" ? GREEN : GOLD} fontSize="13" fontWeight="500">{mode === "confirming" ? "Confirming" : "Non-confirming"}</text>
      <text x="643" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="10">reported, not overriding</text>
      <path d="M282 144 L306 144 M514 144 L538 144" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 6" />
      {ROLES.map((role, index) => {
        const x = 92 + (index % 3) * 218;
        const y = 254 + Math.floor(index / 3) * 72;
        const isSub = role.role.includes("sub");
        const color = isSub && markSubLord ? VERMILION : BLUE;
        return (
          <g key={role.role}>
            <rect x={x} y={y} width="176" height="50" rx="8" fill={softFill(color)} stroke={color} />
            <text x={x + 88} y={y + 19} textAnchor="middle" fill={color} fontSize="10.5" fontWeight="500">{role.role}</text>
            <text x={x + 88} y={y + 35} textAnchor="middle" fill={INK_MUTED} fontSize="9">{isSub && markSubLord ? "KP-native" : "system-neutral"}</text>
          </g>
        );
      })}
    </svg>
  );
}

function RoleCard({ role, markSubLord }: { role: (typeof ROLES)[number]; markSubLord: boolean }) {
  const isSub = role.role.includes("sub");
  const color = isSub && markSubLord ? VERMILION : role.color;
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, background: softFill(color), padding: "0.7rem", display: "flex", gap: "0.65rem", alignItems: "start" }}>
      <span style={{ color }}>{role.icon}</span>
      <span>
        <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{role.role}: {role.planet}</span>
        <span style={smallTextStyle}>{isSub && markSubLord ? "KP-native sub-division role" : role.origin}</span>
      </span>
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
    padding: "0.7rem",
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
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1rem",
};
