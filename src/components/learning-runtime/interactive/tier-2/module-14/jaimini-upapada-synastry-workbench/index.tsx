"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  GitCompare,
  RefreshCw,
  Route,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type FocusKey = "anshUl" | "bhavnaUl" | "darakaraka" | "convergence";
type ViewKey = "compute" | "crosscheck" | "synthesis";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const FOCI: Record<FocusKey, { label: string; result: string; body: string; caution: string; icon: ReactNode; color: string }> = {
  anshUl: {
    label: "Ansh UL",
    result: "Libra -> Virgo 12th -> Mercury in Aries -> UL Scorpio",
    body: "Ansh's UL lands on Scorpio, exactly where Bhavna's natal Mars sits.",
    caution: "This direction is real, but it is not enough by itself. Compute Bhavna's UL too.",
    icon: <Route size={16} />,
    color: BLUE,
  },
  bhavnaUl: {
    label: "Bhavna UL",
    result: "Cancer -> Gemini 12th -> Mercury in Libra -> UL Aquarius",
    body: "Bhavna's UL lands on Aquarius, exactly where Ansh's natal Saturn sits.",
    caution: "This is the return direction; it had to be computed independently.",
    icon: <Route size={16} />,
    color: ACCENT,
  },
  darakaraka: {
    label: "Darakaraka check",
    result: "Ansh DK Jupiter own-sign; Bhavna DK Saturn own-sign",
    body: "Both spouse-significators are independently dignified, supporting the UL exchange without being the same finding.",
    caution: "Do not conflate Bhavna's DK Saturn in Capricorn with Ansh's Saturn in Aquarius.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  convergence: {
    label: "Stream convergence",
    result: "Jaimini UL exchange + Parashari Mars-Saturn cross-aspect",
    body: "Two independent techniques converge on the same Mars-Saturn axis.",
    caution: "This strengthens confidence, but it is not a final verdict on the whole relationship.",
    icon: <GitCompare size={16} />,
    color: VERMILION,
  },
};

const FOCUS_ORDER: FocusKey[] = ["anshUl", "bhavnaUl", "darakaraka", "convergence"];

export function JaiminiUpapadaSynastryWorkbench() {
  const [focus, setFocus] = useState<FocusKey>("convergence");
  const [view, setView] = useState<ViewKey>("crosscheck");
  const [computeBothUl, setComputeBothUl] = useState(true);
  const [separateTechniques, setSeparateTechniques] = useState(true);
  const [darakarakaChecked, setDarakarakaChecked] = useState(true);
  const [limitsNamed, setLimitsNamed] = useState(true);

  const active = FOCI[focus];
  const methodReady = computeBothUl && separateTechniques && darakarakaChecked && limitsNamed;

  const feedback = useMemo(() => {
    if (!computeBothUl) return "Repair: compute both partners' ULs independently. One direction does not imply the other.";
    if (!separateTechniques) return "Repair: UL exchange is Jaimini arudha-to-graha coincidence; cross-aspect is Parashari drishti.";
    if (!darakarakaChecked) return "Repair: T1-17 requires Darakaraka triangulation, not UL alone.";
    if (!limitsNamed) return "Repair: name the convergence and its limits. Strong evidence is not a marriage-outcome verdict.";
    return "Clean Jaimini synastry: both ULs computed, both cross-directions checked, Darakarakas triangulated, and stream convergence stated without overclaiming.";
  }, [computeBothUl, darakarakaChecked, limitsNamed, separateTechniques]);

  return (
    <div data-interactive="jaimini-upapada-synastry-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Jaimini Upapada synastry</p>
            <h2 style={headingStyle}>Compute both ULs, then test the Mars-Saturn convergence</h2>
            <p style={bodyStyle}>
              Use the unchanged double-count method, check both cross-directions, and keep the Jaimini finding separate from the Parashari cross-aspect it corroborates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFocus("convergence");
              setView("crosscheck");
              setComputeBothUl(true);
              setSeparateTechniques(true);
              setDarakarakaChecked(true);
              setLimitsNamed(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 560px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <p style={eyebrowStyle}>UL exchange map</p>
            <div style={segmentedStyle}>
              <ViewButton view={view} target="compute" onSelect={setView} label="Compute" />
              <ViewButton view={view} target="crosscheck" onSelect={setView} label="Check" />
              <ViewButton view={view} target="synthesis" onSelect={setView} label="Synthesis" />
            </div>
          </div>
          <UpapadaDiagram focus={focus} view={view} methodReady={methodReady} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: active.color }}>
            {active.icon}
            <p style={eyebrowStyle}>{active.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{active.result}</h3>
          <p style={bodyStyle}>{active.body}</p>
          <div style={{ ...noticeStyle(active.color), marginTop: "1rem" }}>
            <Scale size={18} />
            <span>{active.caution}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Check selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {FOCUS_ORDER.map((key) => (
              <button key={key} type="button" onClick={() => setFocus(key)} aria-pressed={focus === key} style={focusButtonStyle(focus === key, FOCI[key].color)}>
                <span style={{ color: FOCI[key].color }}>{FOCI[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{FOCI[key].label}</span>
                  <span style={smallTextStyle}>{FOCI[key].result}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Triangulation guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={computeBothUl} onChange={setComputeBothUl} label="Compute both ULs" body="Ansh -> Scorpio and Bhavna -> Aquarius are independent checks." icon={<Route size={16} />} />
            <ToggleRow checked={separateTechniques} onChange={setSeparateTechniques} label="Keep streams separate" body="UL exchange and cross-aspect are different computations." icon={<GitCompare size={16} />} />
            <ToggleRow checked={darakarakaChecked} onChange={setDarakarakaChecked} label="Triangulate Darakarakas" body="Both DKs are own-sign dignified, supporting but not duplicating UL." icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={limitsNamed} onChange={setLimitsNamed} label="Name limits" body="Strong convergence is not a full relationship verdict." icon={<BadgeCheck size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {methodReady ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Synastry result</p>
            <h3 style={{ ...panelTitleStyle, color: methodReady ? GREEN : VERMILION }}>{methodReady ? "Multi-technique convergence is clean" : "Repair the triangulation"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default JaiminiUpapadaSynastryWorkbench;

function UpapadaDiagram({ focus, view, methodReady }: { focus: FocusKey; view: ViewKey; methodReady: boolean }) {
  const active = FOCI[focus];
  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="Jaimini Upapada synastry convergence diagram" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <Node x={170} y={156} label="Ansh UL" body="Scorpio" color={BLUE} active={focus === "anshUl"} />
      <Node x={610} y={156} label="Bhavna UL" body="Aquarius" color={ACCENT} active={focus === "bhavnaUl"} />
      <Node x={170} y={292} label="Bhavna Mars" body="Scorpio" color={VERMILION} active={focus === "convergence"} />
      <Node x={610} y={292} label="Ansh Saturn" body="Aquarius" color={GREEN} active={focus === "convergence"} />
      <path d="M 222 156 C 310 112, 470 112, 558 156" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 7" />
      <path d="M 170 216 L 170 232" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
      <path d="M 610 216 L 610 232" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
      <path d="M 235 292 C 315 350, 465 350, 545 292" fill="none" stroke={methodReady ? GREEN : VERMILION} strokeWidth="3" />
      <rect x="250" y="34" width="280" height="50" rx="8" fill={methodReady ? "#E8F5E9" : "#F9E8E3"} stroke={methodReady ? GREEN : VERMILION} strokeWidth="1.5" />
      <text x="390" y="55" textAnchor="middle" fill={methodReady ? GREEN : VERMILION} fontSize="13" fontWeight="500">{viewCopy(view)}</text>
      <text x="390" y="73" textAnchor="middle" fill={INK_SECONDARY} fontSize="10">{active.label}: {active.result}</text>
      <rect x="248" y="196" width="284" height="62" rx="8" fill={softFill(active.color)} stroke={active.color} strokeWidth="1.5" />
      <text x="390" y="222" textAnchor="middle" fill={active.color} fontSize="14" fontWeight="500">{focus === "darakaraka" ? "DK dignity supports" : "Mars-Saturn axis"}</text>
      <text x="390" y="244" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">{focus === "darakaraka" ? "Jupiter and Saturn own-sign" : "Jaimini UL + Parashari drishti"}</text>
    </svg>
  );
}

function Node({ x, y, label, body, color, active }: { x: number; y: number; label: string; body: string; color: string; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="58" fill={active ? softFill(color) : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.4 : 1.2} />
      <text x={x} y={y - 4} textAnchor="middle" fill={active ? color : INK_PRIMARY} fontSize="14" fontWeight="500">{label}</text>
      <text x={x} y={y + 18} textAnchor="middle" fill={INK_MUTED} fontSize="11">{body}</text>
    </g>
  );
}

function ViewButton({ view, target, onSelect, label }: { view: ViewKey; target: ViewKey; onSelect: (view: ViewKey) => void; label: string }) {
  const active = view === target;
  return <button type="button" aria-pressed={active} onClick={() => onSelect(target)} style={viewButtonStyle(active)}>{label}</button>;
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

function viewCopy(view: ViewKey): string {
  if (view === "compute") return "double-count method unchanged";
  if (view === "synthesis") return "two streams converge, limits named";
  return "both cross-directions checked";
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const twoColumnStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", gap: "1rem" };
const segmentedStyle: CSSProperties = { display: "inline-grid", gridTemplateColumns: "repeat(3, minmax(82px, 1fr))", border: `1px solid ${HAIRLINE}`, borderRadius: 8, overflow: "hidden", background: SURFACE };
const eyebrowStyle: CSSProperties = { margin: 0, color: ACCENT, textTransform: "uppercase", letterSpacing: 0, fontSize: "0.78rem", fontWeight: 500 };
const headingStyle: CSSProperties = { margin: "0.25rem 0 0", color: INK_PRIMARY, fontSize: "1.35rem", lineHeight: 1.25, fontWeight: 500 };
const panelTitleStyle: CSSProperties = { margin: "0.4rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", lineHeight: 1.3, fontWeight: 500 };
const bodyStyle: CSSProperties = { margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.94rem" };
const smallTextStyle: CSSProperties = { margin: "0.2rem 0 0", color: INK_MUTED, lineHeight: 1.4, fontSize: "0.84rem" };
const softButtonStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.58rem 0.72rem", background: SURFACE, color: INK_PRIMARY, cursor: "pointer", font: "inherit", fontSize: "0.9rem", fontWeight: 500 };

function viewButtonStyle(active: boolean): CSSProperties {
  return { border: 0, borderRight: `1px solid ${HAIRLINE}`, background: active ? softFill(ACCENT) : SURFACE, color: active ? INK_PRIMARY : INK_SECONDARY, padding: "0.55rem 0.7rem", cursor: "pointer", font: "inherit", fontSize: "0.86rem", fontWeight: 500 };
}

function focusButtonStyle(active: boolean, color: string): CSSProperties {
  return { border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? softFill(color) : SURFACE, color: INK_PRIMARY, padding: "0.72rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.65rem", alignItems: "start", textAlign: "left", cursor: "pointer", font: "inherit" };
}

function toggleStyle(checked: boolean): CSSProperties {
  return { border: `1px solid ${checked ? ACCENT : HAIRLINE}`, borderRadius: 8, background: checked ? softFill(ACCENT) : SURFACE, color: checked ? INK_PRIMARY : INK_MUTED, padding: "0.7rem", display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto", gap: "0.62rem", alignItems: "center" };
}

function noticeStyle(color: string): CSSProperties {
  return { border: `1px solid ${color}55`, borderRadius: 8, background: softFill(color), color, padding: "0.7rem", display: "flex", gap: "0.5rem", alignItems: "center", fontWeight: 500 };
}

function softFill(color: string): string {
  if (color === ACCENT) return "#FDF4E3";
  if (color === GREEN) return "#E8F5E9";
  if (color === BLUE) return "#E3EEF9";
  if (color === VERMILION) return "#F9E8E3";
  return SURFACE;
}
