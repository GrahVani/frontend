"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, ClipboardCheck, LockKeyhole, RotateCcw, ShieldAlert, Split, UserCheck } from "lucide-react";

type GateKey = "recommend" | "refuse" | "defer";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const GATES: Record<GateKey, { label: string; title: string; detail: string; icon: ReactNode }> = {
  recommend: {
    label: "Recommend?",
    title: "Fails for Chart MD1",
    detail: "No real client asks for Nadi, no Nadi decision point is named, and no standalone Nadi advisory is requested. The ordered test stops here.",
    icon: <UserCheck size={16} />,
  },
  refuse: {
    label: "Refuse?",
    title: "Not reached",
    detail: "Refuse is considered only after Recommend passes. Chart MD1 never reaches this gate.",
    icon: <ShieldAlert size={16} />,
  },
  defer: {
    label: "Defer?",
    title: "Not reached",
    detail: "Defer to a specialist only after a recommendation is in scope and no red line blocks it.",
    icon: <LockKeyhole size={16} />,
  },
};

const DISCLOSURES = ["Verification open", "Quality varies", "Ordinary explanations exist", "Scam risk exists", "Never first recommendation"];
const CORE_FIVE = ["Parasari", "KP", "Jaimini", "Lal Kitab", "Tajika"];

export function NadiAccessLimitsDecisionLab() {
  const [gate, setGate] = useState<GateKey>("recommend");
  const [clientTrigger, setClientTrigger] = useState(false);
  const [fabricateReading, setFabricateReading] = useState(false);
  const [nadiAsFifth, setNadiAsFifth] = useState(false);
  const [legitimacyJudgement, setLegitimacyJudgement] = useState(false);

  const selected = GATES[gate];

  const status = useMemo(() => {
    if (clientTrigger || fabricateReading || nadiAsFifth || legitimacyJudgement) return { label: "access claim needs repair", icon: <ShieldAlert size={18} /> };
    return { label: "no Nadi row is correct", icon: <BadgeCheck size={18} /> };
  }, [clientTrigger, fabricateReading, legitimacyJudgement, nadiAsFifth]);

  const outputLine = useMemo(() => {
    if (clientTrigger) return "Repair: Chart MD1 is a pedagogical chart, not a real client with a Nadi trigger.";
    if (fabricateReading) return "Repair: do not invent an illustrative Nadi reading. Real Nadi requires real access, reader, leaf, and client context.";
    if (nadiAsFifth) return "Repair: the tracked five are Parasari, KP, Jaimini, Lal Kitab, and Tajika. Nadi is a real sixth consideration outside that count.";
    if (legitimacyJudgement) return "Repair: absence of a Nadi row is not a judgment against Nadi. It is this context failing the Recommend gate.";
    return "Decision output: Chart MD1 receives no Nadi row. The Recommend gate fails, so Refuse and Defer are not reached. The core five-stream synthesis remains complete without Nadi while Nadi remains a legitimate sixth consideration when a real client context calls for it.";
  }, [clientTrigger, fabricateReading, legitimacyJudgement, nadiAsFifth]);

  return (
    <div data-interactive="nadi-access-limits-decision-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Nadi access-limits decision lab</p>
            <h2 style={headingStyle}>Let the framework produce the absence of a row</h2>
            <p style={bodyStyle}>Apply the ordered Nadi decision test to Chart MD1 and keep the core five-stream count precise.</p>
          </div>
          <span style={statusPillStyle}>{status.icon}{status.label}</span>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Ordered decision gate</p>
          <DecisionDiagram active={gate} />
          <div style={buttonGridStyle}>
            {(Object.keys(GATES) as GateKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setGate(key)} style={choiceStyle(gate === key)} aria-pressed={gate === key}>
                {GATES[key].icon}{GATES[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected gate</p>
          <div style={factPanelStyle}>
            <span style={{ color: ACCENT }}>{selected.icon}</span>
            <p style={panelTitleStyle}>{selected.title}</p>
            <p style={smallTextStyle}>{selected.detail}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Five disclosures</p>
          <div style={pillGridStyle}>
            {DISCLOSURES.map((item) => <span key={item} style={softPillStyle}><ClipboardCheck size={14} />{item}</span>)}
          </div>
          <p style={{ ...smallTextStyle, marginTop: "0.8rem" }}>These are required before any real Nadi recommendation; Chart MD1 never reaches that stage.</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Core five correction</p>
          <div style={pillGridStyle}>
            {CORE_FIVE.map((item) => <span key={item} style={softPillStyle}><BadgeCheck size={14} />{item}</span>)}
          </div>
          <p style={{ ...smallTextStyle, marginTop: "0.8rem" }}>Nadi is outside this count, not below it.</p>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={!clientTrigger} onChange={(checked) => setClientTrigger(!checked)} label="No real client trigger added" icon={<UserCheck size={16} />} />
            <ToggleRow checked={!fabricateReading} onChange={(checked) => setFabricateReading(!checked)} label="No illustrative Nadi reading fabricated" icon={<LockKeyhole size={16} />} />
            <ToggleRow checked={!nadiAsFifth} onChange={(checked) => setNadiAsFifth(!checked)} label="Nadi not counted as core fifth" icon={<Split size={16} />} />
            <ToggleRow checked={!legitimacyJudgement} onChange={(checked) => setLegitimacyJudgement(!checked)} label="No legitimacy judgment implied" icon={<ShieldAlert size={16} />} />
          </div>
          <button type="button" onClick={() => { setGate("recommend"); setClientTrigger(false); setFabricateReading(false); setNadiAsFifth(false); setLegitimacyJudgement(false); }} style={{ ...softButtonStyle, marginTop: "0.9rem" }}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Decision output</p>
          <p style={bodyStyle}>{outputLine}</p>
        </div>
      </section>
    </div>
  );
}

function DecisionDiagram({ active }: { active: GateKey }) {
  const keys: GateKey[] = ["recommend", "refuse", "defer"];
  return (
    <svg viewBox="0 0 680 210" role="img" aria-label="Nadi recommend refuse defer decision gate" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="194" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {keys.map((key, index) => {
        const x = 70 + index * 205;
        const selected = active === key;
        return (
          <g key={key}>
            {index > 0 ? <path d={`M ${x - 62} 88 L ${x - 26} 88`} stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" /> : null}
            <rect x={x} y="56" width="150" height="64" rx="8" fill={SURFACE} stroke={selected ? ACCENT : HAIRLINE} strokeWidth={selected ? 2 : 1} />
            <text x={x + 75} y="82" textAnchor="middle" fontSize="12" fill={INK_PRIMARY}>{GATES[key].label}</text>
            <text x={x + 75} y="101" textAnchor="middle" fontSize="10" fill={key === "recommend" ? ACCENT : INK_MUTED}>{key === "recommend" ? "fails here" : "not reached"}</text>
          </g>
        );
      })}
      <text x="340" y="164" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>Ordered test: once Recommend fails, there is no Nadi row to refuse, defer, or fabricate.</text>
    </svg>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem" }}>{icon}{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const twoColumnStyle: CSSProperties = { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.72fr)", gap: "1rem" };
const buttonGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" };
const pillGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" };
const factPanelStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.9rem", minHeight: "9.8rem", background: SURFACE };
const eyebrowStyle: CSSProperties = { margin: 0, fontSize: "0.78rem", letterSpacing: 0, textTransform: "uppercase", color: ACCENT, fontWeight: 500 };
const headingStyle: CSSProperties = { margin: "0.25rem 0 0", fontSize: "1.35rem", lineHeight: 1.22, color: INK_PRIMARY, fontWeight: 500 };
const bodyStyle: CSSProperties = { margin: "0.48rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.95rem" };
const smallTextStyle: CSSProperties = { margin: "0.28rem 0 0", color: INK_MUTED, lineHeight: 1.45, fontSize: "0.86rem" };
const panelTitleStyle: CSSProperties = { margin: "0.4rem 0 0", color: INK_PRIMARY, fontSize: "1rem", lineHeight: 1.32, fontWeight: 500 };
const statusPillStyle: CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 999, padding: "0.45rem 0.7rem", color: INK_SECONDARY, background: SURFACE, fontSize: "0.86rem", whiteSpace: "nowrap" };
const softButtonStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.58rem 0.72rem", background: SURFACE, color: INK_PRIMARY, cursor: "pointer", font: "inherit", fontSize: "0.9rem" };
const softPillStyle: CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.42rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.52rem 0.6rem", color: INK_SECONDARY, background: SURFACE, fontSize: "0.84rem" };

function choiceStyle(active: boolean): CSSProperties {
  return { ...softButtonStyle, justifyContent: "flex-start", borderColor: active ? ACCENT : HAIRLINE, color: active ? INK_PRIMARY : INK_SECONDARY };
}

function toggleStyle(checked: boolean): CSSProperties {
  return { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", border: `1px solid ${checked ? ACCENT : HAIRLINE}`, borderRadius: 8, padding: "0.62rem 0.72rem", background: SURFACE, color: checked ? INK_PRIMARY : INK_MUTED };
}

