"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Compass,
  HeartHandshake,
  LifeBuoy,
  PhoneCall,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ScenarioKey = "concerning" | "hopeful";
type FocusKey = "intake" | "authorities" | "eighth" | "direction" | "statement";

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

const FOCI: Record<FocusKey, { label: string; body: string; color: string; icon: ReactNode }> = {
  intake: { label: "Slow the pace", body: "Confirm what is known, what has been done, and what the querent hopes the reading can help with.", color: BLUE, icon: <HeartHandshake size={16} /> },
  authorities: { label: "Authorities first", body: "Confirm real missing-person authorities are already involved or being contacted. The reading is supplementary.", color: GREEN, icon: <PhoneCall size={16} /> },
  eighth: { label: "8th-house caution", body: "A concerning 8th-house signal is communicated as general concern, never as a claim about fate.", color: VERMILION, icon: <ShieldAlert size={16} /> },
  direction: { label: "Direction as one input", body: "Direction can be offered as a careful, supplementary search cue, not as a substitute for professional search work.", color: GOLD, icon: <Compass size={16} /> },
  statement: { label: "Final statement", body: "Both hopeful and difficult readings preserve action, care, and uncertainty. No life-or-death verdict is delivered.", color: PURPLE, icon: <LifeBuoy size={16} /> },
};

export function KpHoraryMissingPersonCareWorkbench() {
  const [scenario, setScenario] = useState<ScenarioKey>("concerning");
  const [focus, setFocus] = useState<FocusKey>("intake");
  const [slowPace, setSlowPace] = useState(true);
  const [authoritiesFirst, setAuthoritiesFirst] = useState(true);
  const [noLifeDeathClaim, setNoLifeDeathClaim] = useState(true);
  const [directionSupplementary, setDirectionSupplementary] = useState(true);
  const [supportAwareness, setSupportAwareness] = useState(true);

  const active = FOCI[focus];
  const ready = slowPace && authoritiesFirst && noLifeDeathClaim && directionSupplementary && supportAwareness;
  const concerning = scenario === "concerning";

  const feedback = useMemo(() => {
    if (!slowPace) return "Repair: missing-person questions require slower pacing and context confirmation before any chart language.";
    if (!authoritiesFirst) return "Repair: actual missing-person authorities are the primary, load-bearing action.";
    if (!noLifeDeathClaim) return "Repair: never deliver a chart-derived life-or-death verdict, regardless of technical findings.";
    if (!directionSupplementary) return "Repair: direction is one supplementary input, not a substitute for real search work.";
    if (!supportAwareness) return "Repair: watch for acute distress and keep the consultation inside its competence boundary.";
    return concerning
      ? "Responsible framing: the chart can show general concern, but the response stays anchored in authorities, search action, and support for the querent."
      : "Responsible framing: a favourable indication can be shared as hope, never as a guarantee or a reason to relax real-world action.";
  }, [authoritiesFirst, concerning, directionSupplementary, noLifeDeathClaim, slowPace, supportAwareness]);

  return (
    <div data-interactive="kp-horary-missing-person-care-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP missing-person horary care frame</p>
            <h2 style={headingStyle}>Hold the technique inside the do-no-harm boundary</h2>
            <p style={bodyStyle}>
              Extend lost-object logic carefully: add explicit 8th-house attention, keep authorities primary, and never convert a chart signal into a life-or-death claim.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenario("concerning");
              setFocus("intake");
              setSlowPace(true);
              setAuthoritiesFirst(true);
              setNoLifeDeathClaim(true);
              setDirectionSupplementary(true);
              setSupportAwareness(true);
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
            <p style={eyebrowStyle}>Care-before-verdict map</p>
            <div style={segmentedStyle}>
              <ScenarioButton active={scenario === "concerning"} onClick={() => setScenario("concerning")} label="Concerning signal" color={VERMILION} />
              <ScenarioButton active={scenario === "hopeful"} onClick={() => setScenario("hopeful")} label="Hopeful signal" color={GREEN} />
            </div>
          </div>
          <CareDiagram focus={focus} concerning={concerning} ready={ready} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: active.color }}>
            {active.icon}
            <p style={eyebrowStyle}>{active.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{focus === "eighth" ? "Read caution without pronouncement" : focus === "authorities" ? "Primary action is real-world contact" : "Trauma-informed handling"}</h3>
          <p style={bodyStyle}>{active.body}</p>
          <div style={{ ...noticeStyle(active.color), marginTop: "1rem" }}>
            <ShieldCheck size={18} />
            <span>{concerning ? "Difficult findings are held as concern plus action, not fate." : "Hopeful findings are hope plus action, not guarantee."}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Consultation focus</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(FOCI) as FocusKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setFocus(key)} aria-pressed={focus === key} style={choiceButtonStyle(focus === key, FOCI[key].color)}>
                <span style={{ color: FOCI[key].color }}>{FOCI[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{FOCI[key].label}</span>
                  <span style={smallTextStyle}>{FOCI[key].body}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Safety gates</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={slowPace} onChange={setSlowPace} label="Slow the consultation" body="Confirm context before interpreting technique." icon={<HeartHandshake size={16} />} />
            <ToggleRow checked={authoritiesFirst} onChange={setAuthoritiesFirst} label="Confirm authorities" body="The reading never delays or replaces missing-person authorities." icon={<PhoneCall size={16} />} />
            <ToggleRow checked={noLifeDeathClaim} onChange={setNoLifeDeathClaim} label="No life-or-death verdict" body="Even a clear 8th-house signal is not translated into fate." icon={<ShieldAlert size={16} />} />
            <ToggleRow checked={directionSupplementary} onChange={setDirectionSupplementary} label="Direction is supplementary" body="Use direction only alongside real search resources." icon={<Compass size={16} />} />
            <ToggleRow checked={supportAwareness} onChange={setSupportAwareness} label="Watch for acute distress" body="Keep the reading inside its competence boundary." icon={<LifeBuoy size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Communication boundary</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "The reading stays trauma-informed" : "Repair before continuing"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default KpHoraryMissingPersonCareWorkbench;

function CareDiagram({ focus, concerning, ready }: { focus: FocusKey; concerning: boolean; ready: boolean }) {
  const nodes: { key: FocusKey; x: number; y: number }[] = [
    { key: "intake", x: 120, y: 130 },
    { key: "authorities", x: 280, y: 130 },
    { key: "eighth", x: 440, y: 130 },
    { key: "direction", x: 600, y: 130 },
    { key: "statement", x: 410, y: 304 },
  ];

  return (
    <svg viewBox="0 0 820 430" role="img" aria-label="Missing person horary trauma informed consultation map" style={{ width: "100%", minHeight: 350, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Technique is held inside action, care, and no-fate boundaries</text>
      <path d="M 166 130 L 234 130 M 326 130 L 394 130 M 486 130 L 554 130 M 600 178 C 572 242, 510 282, 464 300 M 120 178 C 170 250, 284 296, 356 304" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      {nodes.map((node) => {
        const item = FOCI[node.key];
        const active = focus === node.key;
        return (
          <g key={node.key}>
            <circle cx={node.x} cy={node.y} r={node.key === "statement" ? 62 : 48} fill={active ? softFill(item.color) : "#FFFFFF"} stroke={active ? item.color : HAIRLINE} strokeWidth={active ? 2 : 1.2} />
            <text x={node.x} y={node.y - 4} textAnchor="middle" fill={active ? item.color : INK_SECONDARY} fontSize="11" fontWeight="500">{item.label}</text>
            <text x={node.x} y={node.y + 16} textAnchor="middle" fill={INK_MUTED} fontSize="8.5">{node.key === "eighth" ? "no fate claim" : node.key === "authorities" ? "primary action" : node.key === "statement" ? "careful framing" : "required"}</text>
          </g>
        );
      })}
      <rect x="246" y="360" width="328" height="38" rx="8" fill={ready ? "#E8F5E9" : "#F9E8E3"} stroke={ready ? GREEN : VERMILION} strokeWidth="1.4" />
      <text x="410" y="384" textAnchor="middle" fill={ready ? GREEN : VERMILION} fontSize="12" fontWeight="500">
        {ready ? (concerning ? "Concern is communicated without pronouncement" : "Hope is communicated without guarantee") : "Safety gate missing"}
      </text>
    </svg>
  );
}

function ScenarioButton({ active, onClick, label, color }: { active: boolean; onClick: () => void; label: string; color: string }) {
  return <button type="button" aria-pressed={active} onClick={onClick} style={viewButtonStyle(active, color)}>{label}</button>;
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function softFill(color: string) {
  if (color === GREEN) return "#E8F5E9";
  if (color === BLUE) return "#EAF1F8";
  if (color === VERMILION) return "#F9E8E3";
  if (color === PURPLE) return "#F0EDF8";
  return "#F7F0E1";
}

const cardStyle: CSSProperties = { background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "1rem", boxShadow: "0 10px 26px rgba(90, 62, 18, 0.07)" };
const eyebrowStyle: CSSProperties = { margin: 0, color: ACCENT, textTransform: "uppercase", letterSpacing: 0, fontSize: "0.78rem", fontWeight: 500 };
const headingStyle: CSSProperties = { margin: "0.35rem 0 0", color: INK_PRIMARY, fontSize: "clamp(1.35rem, 2vw, 1.85rem)", lineHeight: 1.2, fontWeight: 500 };
const panelTitleStyle: CSSProperties = { margin: "0.45rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", lineHeight: 1.25, fontWeight: 500 };
const bodyStyle: CSSProperties = { margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.95rem" };
const smallTextStyle: CSSProperties = { display: "block", marginTop: 3, color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.35 };
const softButtonStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, background: "#FFFFFF", color: INK_PRIMARY, borderRadius: 8, padding: "0.6rem 0.85rem", display: "inline-flex", gap: "0.45rem", alignItems: "center", cursor: "pointer", fontWeight: 500 };
const segmentedStyle: CSSProperties = { display: "inline-flex", gap: 4, padding: 4, border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "#FFFFFF" };
const twoColumnStyle: CSSProperties = { display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" };

function viewButtonStyle(active: boolean, color: string): CSSProperties {
  return { border: `1px solid ${active ? color : "transparent"}`, background: active ? softFill(color) : "transparent", color: active ? color : INK_SECONDARY, borderRadius: 7, padding: "0.45rem 0.7rem", cursor: "pointer", fontWeight: 500 };
}

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", textAlign: "left", display: "grid", gridTemplateColumns: "22px 1fr", gap: "0.65rem", alignItems: "start", border: `1px solid ${active ? color : HAIRLINE}`, background: active ? softFill(color) : "#FFFFFF", color: INK_PRIMARY, borderRadius: 8, padding: "0.72rem", cursor: "pointer" };
}

function toggleStyle(checked: boolean): CSSProperties {
  return { display: "grid", gridTemplateColumns: "22px 1fr auto", gap: "0.65rem", alignItems: "start", border: `1px solid ${checked ? ACCENT : HAIRLINE}`, background: checked ? "#F7F0E1" : "#FFFFFF", borderRadius: 8, padding: "0.7rem", color: INK_PRIMARY };
}

function noticeStyle(color: string): CSSProperties {
  return { display: "grid", gridTemplateColumns: "22px 1fr", gap: "0.55rem", alignItems: "start", border: `1px solid ${color}`, background: softFill(color), borderRadius: 8, padding: "0.75rem", color, lineHeight: 1.45, fontSize: "0.9rem" };
}
