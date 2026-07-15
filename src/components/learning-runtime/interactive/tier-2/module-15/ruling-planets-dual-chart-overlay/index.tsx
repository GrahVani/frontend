"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  GitCompare,
  Layers3,
  Link2Off,
  RefreshCw,
  ShieldCheck,
  Split,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type FocusKey = "parashari" | "tajika" | "both";

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

const READINGS = {
  parashari: {
    label: "Parashari career chart",
    verdict: "Favourable with caveat",
    overlay: "Full confirmation",
    rpSet: "Jupiter, Venus, Moon, Saturn, Mercury, Rahu, Ketu",
    keyPlanets: "Mercury, Saturn, Jupiter all present",
    nodeStatus: "Rahu and Ketu qualify via tenancy",
    special: "Venus especially strong",
    disclosure: "This Parashari verdict, favourable-with-caveat, was reached entirely through Parashari's own native technique. A Ruling Planet overlay, a KP-native cross-check computed for an assigned Wednesday moment and disclosed as such, additionally shows full confirmation: Mercury, Saturn, and Jupiter are all Ruling Planets, with Rahu and Ketu qualifying by tenancy. It does not change the original verdict.",
    color: GREEN,
  },
  tajika: {
    label: "Tajika marriage chart",
    verdict: "Qualified yes-trending",
    overlay: "Two-significator confirmation",
    rpSet: "Mercury, Moon, Mars, Ketu, Jupiter",
    keyPlanets: "Mercury and Jupiter both present",
    nodeStatus: "Node check unavailable; placements not established",
    special: "Moon especially strong",
    disclosure: "This Tajika verdict, qualified yes-trending, was reached entirely through Tajika's own native technique. A Ruling Planet overlay, a KP-native cross-check computed for an assigned Thursday moment and disclosed as such, additionally shows confirmation: Mercury and Jupiter are both Ruling Planets. The node-qualification check is unavailable, not faked. It does not change the original verdict.",
    color: BLUE,
  },
};

export function RulingPlanetsDualChartOverlay() {
  const [focus, setFocus] = useState<FocusKey>("both");
  const [includeDisclosure, setIncludeDisclosure] = useState(true);
  const [keepSeparate, setKeepSeparate] = useState(true);
  const [respectNodeGap, setRespectNodeGap] = useState(true);
  const [preserveVerdicts, setPreserveVerdicts] = useState(true);

  const ready = includeDisclosure && keepSeparate && respectNodeGap && preserveVerdicts;
  const feedback = useMemo(() => {
    if (!includeDisclosure) return "Repair: the disclosure sentence is part of the final deliverable, not training scaffolding.";
    if (!keepSeparate) return "Repair: do not average Parashari and Tajika confirmations into one combined score.";
    if (!respectNodeGap) return "Repair: the Tajika node check stays unavailable because the chart never fixed node placements.";
    if (!preserveVerdicts) return "Repair: RP confirmation does not reopen or regrade either primary verdict.";
    return "Both overlays confirm, but each remains attached to its own system's verdict texture.";
  }, [includeDisclosure, keepSeparate, preserveVerdicts, respectNodeGap]);

  return (
    <div data-interactive="ruling-planets-dual-chart-overlay" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>RP overlay dual-chart capstone</p>
            <h2 style={headingStyle}>Confirm both charts without merging their verdicts</h2>
            <p style={bodyStyle}>
              Compare the Chapter 4 Parashari and Chapter 5 Tajika flagship readings side by side, with each RP overlay disclosed in its own terms.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFocus("both");
              setIncludeDisclosure(true);
              setKeepSeparate(true);
              setRespectNodeGap(true);
              setPreserveVerdicts(true);
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
            <p style={eyebrowStyle}>Two completed overlays</p>
            <div style={segmentedStyle}>
              <ModeButton active={focus === "both"} onClick={() => setFocus("both")} label="Both" />
              <ModeButton active={focus === "parashari"} onClick={() => setFocus("parashari")} label="Parashari" />
              <ModeButton active={focus === "tajika"} onClick={() => setFocus("tajika")} label="Tajika" />
            </div>
          </div>
          <DualDiagram focus={focus} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: ready ? GREEN : VERMILION }}>
            {ready ? <BadgeCheck size={16} /> : <AlertTriangle size={16} />}
            <p style={eyebrowStyle}>Capstone rule</p>
          </div>
          <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "Two confirmations, no merged score" : "Repair the final report"}</h3>
          <p style={bodyStyle}>{feedback}</p>
          <div style={{ ...noticeStyle(PURPLE), marginTop: "1rem" }}>
            <Split size={18} />
            <span>Side-by-side does not mean averaged. Each system keeps its own texture.</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <ReadingCard reading={READINGS.parashari} visible={focus === "both" || focus === "parashari"} />
        <ReadingCard reading={READINGS.tajika} visible={focus === "both" || focus === "tajika"} />
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Disclosure deliverables</p>
        <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
          <DisclosureBlock title="Parashari wording" text={READINGS.parashari.disclosure} active={includeDisclosure} color={GREEN} />
          <DisclosureBlock title="Tajika wording" text={READINGS.tajika.disclosure} active={includeDisclosure} color={BLUE} />
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Final-report safeguards</p>
        <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
          <ToggleRow checked={includeDisclosure} onChange={setIncludeDisclosure} label="Keep disclosure in final text" body="The framing sentence is part of the deliverable itself." icon={<ShieldCheck size={16} />} />
          <ToggleRow checked={keepSeparate} onChange={setKeepSeparate} label="Do not average systems" body="Report two confirmed overlays in their own system terms." icon={<Link2Off size={16} />} />
          <ToggleRow checked={respectNodeGap} onChange={setRespectNodeGap} label="Respect Tajika node gap" body="Unavailable is not the same as negative, and it is not patched." icon={<AlertTriangle size={16} />} />
          <ToggleRow checked={preserveVerdicts} onChange={setPreserveVerdicts} label="Primary verdicts remain fixed" body="Favourable-with-caveat and qualified yes-trending are not rewritten." icon={<Layers3 size={16} />} />
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Dual-chart overlay check</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "Capstone protocol held cleanly" : "Repair the capstone protocol"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RulingPlanetsDualChartOverlay;

function DualDiagram({ focus }: { focus: FocusKey }) {
  const showP = focus === "both" || focus === "parashari";
  const showT = focus === "both" || focus === "tajika";
  return (
    <svg viewBox="0 0 820 470" role="img" aria-label="Dual RP overlay comparison diagram" style={{ width: "100%", minHeight: 370, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="450" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Native verdicts stay fixed; RP overlays are disclosed beside them</text>
      <SystemColumn x={74} y={92} title="Parashari" verdict="Favourable with caveat" overlay="Full confirmation" node="Nodes resolved" color={GREEN} active={showP} />
      <SystemColumn x={470} y={92} title="Tajika" verdict="Qualified yes-trending" overlay="Confirmation" node="Node check unavailable" color={BLUE} active={showT} />
      <path d="M344 180 C382 160, 438 160, 476 180" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 7" />
      <rect x="278" y="386" width="264" height="36" rx="8" fill="#F7F0E1" stroke={GOLD} />
      <text x="410" y="408" textAnchor="middle" fill={GOLD} fontSize="11.5" fontWeight="500">No combined confidence score</text>
    </svg>
  );
}

function SystemColumn({ x, y, title, verdict, overlay, node, color, active }: { x: number; y: number; title: string; verdict: string; overlay: string; node: string; color: string; active: boolean }) {
  const opacity = active ? 1 : 0.35;
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width="276" height="244" rx="8" fill={softFill(color)} stroke={color} />
      <text x={x + 138} y={y + 34} textAnchor="middle" fill={color} fontSize="13" fontWeight="500">{title}</text>
      <MiniRow x={x + 34} y={y + 68} label="Native verdict" value={verdict} color={color} />
      <MiniRow x={x + 34} y={y + 126} label="RP overlay" value={overlay} color={GREEN} />
      <MiniRow x={x + 34} y={y + 184} label="Node status" value={node} color={node.includes("unavailable") ? GOLD : BLUE} />
    </g>
  );
}

function MiniRow({ x, y, label, value, color }: { x: number; y: number; label: string; value: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width="208" height="42" rx="8" fill="#FFFFFF" stroke={color} />
      <text x={x + 104} y={y + 17} textAnchor="middle" fill={INK_MUTED} fontSize="9">{label}</text>
      <text x={x + 104} y={y + 31} textAnchor="middle" fill={color} fontSize="10" fontWeight="500">{value}</text>
    </g>
  );
}

function ReadingCard({ reading, visible }: { reading: typeof READINGS.parashari; visible: boolean }) {
  return (
    <div style={{ ...cardStyle, opacity: visible ? 1 : 0.45 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: reading.color }}>
        <GitCompare size={16} />
        <p style={eyebrowStyle}>{reading.label}</p>
      </div>
      <h3 style={panelTitleStyle}>{reading.verdict}</h3>
      <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.8rem" }}>
        <InfoLine label="Overlay" value={reading.overlay} color={reading.color} />
        <InfoLine label="RP set" value={reading.rpSet} color={GOLD} />
        <InfoLine label="Key planets" value={reading.keyPlanets} color={GREEN} />
        <InfoLine label="Node status" value={reading.nodeStatus} color={reading.nodeStatus.includes("unavailable") ? GOLD : BLUE} />
        <InfoLine label="Special repeat" value={reading.special} color={PURPLE} />
      </div>
    </div>
  );
}

function InfoLine({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, background: softFill(color), padding: "0.6rem" }}>
      <span style={{ display: "block", color, fontSize: "0.78rem", fontWeight: 500 }}>{label}</span>
      <span style={smallTextStyle}>{value}</span>
    </div>
  );
}

function DisclosureBlock({ title, text, active, color }: { title: string; text: string; active: boolean; color: string }) {
  return (
    <div style={{ border: `1px solid ${active ? color : VERMILION}`, borderRadius: 8, background: active ? softFill(color) : softFill(VERMILION), padding: "0.8rem" }}>
      <p style={{ margin: 0, color, fontSize: "0.84rem", fontWeight: 500 }}>{title}</p>
      <p style={{ margin: "0.35rem 0 0", color: active ? INK_SECONDARY : VERMILION, lineHeight: 1.55 }}>
        {active ? text : "Disclosure omitted: the RP overlay now appears as if it were native to the primary system."}
      </p>
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
