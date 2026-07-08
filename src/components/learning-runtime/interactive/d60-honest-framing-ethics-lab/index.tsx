"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, Ban, HeartHandshake, MessageSquareText, RotateCcw, Route, Scale, ShieldCheck, Sparkles } from "lucide-react";

type RiskKey = "catastrophe" | "determinism" | "pastLife" | "manipulation";
type PanelKey = "risks" | "rewrite" | "routing";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const RISKS: Record<RiskKey, { label: string; short: string; trigger: string; correction: string; icon: ReactNode; color: string }> = {
  catastrophe: {
    label: "Catastrophising",
    short: "Bad karma framing",
    trigger: "your karma is bad / heavy / cursed",
    correction: "Report the finding as bounded, descriptive, and non-final.",
    icon: <AlertTriangle size={16} />,
    color: VERMILION,
  },
  determinism: {
    label: "False determinism",
    short: "Path foreclosure",
    trigger: "you are destined / you will never / this explains everything",
    correction: "Name uncertainty and keep the future open to agency and practice.",
    icon: <Ban size={16} />,
    color: GOLD,
  },
  pastLife: {
    label: "Past-life claim",
    short: "Unverifiable story",
    trigger: "what you did in a past life",
    correction: "Decline specifics and redirect to what can be worked with now.",
    icon: <MessageSquareText size={16} />,
    color: PURPLE,
  },
  manipulation: {
    label: "Manipulation",
    short: "Gravity used for leverage",
    trigger: "only I can fix this / buy more sessions",
    correction: "Avoid dependency pressure and keep competence boundaries visible.",
    icon: <Scale size={16} />,
    color: BLUE,
  },
};

const PANELS: Record<PanelKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  risks: {
    label: "Risks",
    title: "One sentence can carry several malpractices",
    body: "The risky Saturn sentence mixes unsupported quality, explanatory finality, and negative charge. Detect all layers before rewriting.",
    icon: <ShieldCheck size={16} />,
    color: VERMILION,
  },
  rewrite: {
    label: "Rewrite",
    title: "Close with empowerment",
    body: "A D60 reading must not end with karma as the final word. It closes with practice, remedies, conscious choice, and agency.",
    icon: <HeartHandshake size={16} />,
    color: GREEN,
  },
  routing: {
    label: "Routing",
    title: "Preview the mental-health boundary",
    body: "This lesson previews Chapter 6. Active crisis signs require competence routing, not more D60 interpretation.",
    icon: <Route size={16} />,
    color: BLUE,
  },
};

export function D60HonestFramingEthicsLab() {
  const [panelKey, setPanelKey] = useState<PanelKey>("risks");
  const [catastrophe, setCatastrophe] = useState(true);
  const [determinism, setDeterminism] = useState(true);
  const [pastLife, setPastLife] = useState(false);
  const [manipulation, setManipulation] = useState(false);
  const [empowermentClose, setEmpowermentClose] = useState(true);
  const [referOutReady, setReferOutReady] = useState(true);

  const activeRisks = useMemo(() => {
    return [
      catastrophe ? "catastrophe" : null,
      determinism ? "determinism" : null,
      pastLife ? "pastLife" : null,
      manipulation ? "manipulation" : null,
    ].filter(Boolean) as RiskKey[];
  }, [catastrophe, determinism, manipulation, pastLife]);

  const panel = PANELS[panelKey];

  const status = useMemo(() => {
    if (activeRisks.length > 0) return { label: `${activeRisks.length} risk${activeRisks.length === 1 ? "" : "s"} detected`, color: VERMILION };
    if (!empowermentClose) return { label: "empowerment missing", color: GOLD };
    if (!referOutReady) return { label: "routing boundary hidden", color: GOLD };
    return { label: "ethical framing ready", color: GREEN };
  }, [activeRisks.length, empowermentClose, referOutReady]);

  const response = useMemo(() => {
    if (activeRisks.length > 0) {
      return "Pause before delivering the sentence. Remove fatalistic, unverifiable, or pressure-based language before any D60 framing reaches the client.";
    }
    if (!empowermentClose) return "Add an empowerment close: practice, remedies, conscious choice, and what remains inside the client agency.";
    if (!referOutReady) return "Keep the Chapter 6 preview visible: identity-and-meaning distress can cross into a domain that needs referral or support.";
    return "Corrected frame: Saturn at D60 index 55 is a descriptive outlier, cross-referenced with established Saturn facts, and closed with practice-based agency rather than destiny.";
  }, [activeRisks.length, empowermentClose, referOutReady]);

  return (
    <div data-interactive="d60-honest-framing-ethics-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>D60 honest framing</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Inspect spiritual-path phrasing before it becomes fatalism
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Identify the four D60 malpractices, remove unsupported claims, and rebuild the statement with empowerment and routing boundaries visible.
            </p>
          </div>
          <span
            style={{
              border: `1px solid ${status.color}`,
              color: status.color,
              borderRadius: 999,
              padding: "0.42rem 0.68rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              background: "color-mix(in srgb, currentColor 8%, transparent)",
              whiteSpace: "nowrap",
            }}
          >
            {status.label}
          </span>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.82fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Risk sentence inspector</p>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.9rem", marginTop: "0.7rem", background: "rgba(255,255,255,0.32)" }}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Your Saturn D60 is unusually late, so this suggests old heavy karma you are still working through, which explains why your spiritual path has been so difficult.
            </p>
          </div>
          <MalpracticeFlow activeRisks={activeRisks} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.7rem", marginTop: "0.9rem" }}>
            {(Object.keys(RISKS) as RiskKey[]).map((key) => {
              const risk = RISKS[key];
              const active = activeRisks.includes(key);
              return (
                <article key={key} style={{ border: `1px solid ${active ? risk.color : HAIRLINE}`, borderRadius: 8, padding: "0.8rem", background: active ? "color-mix(in srgb, white 80%, var(--gl-card-surface-solid))" : "transparent" }}>
                  <p style={{ margin: 0, color: risk.color, display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.76rem", fontWeight: 600 }}>
                    {risk.icon}
                    {risk.label}
                  </p>
                  <h3 style={{ margin: "0.3rem 0", fontSize: "0.96rem", fontWeight: 600, color: INK_PRIMARY }}>{risk.short}</h3>
                  <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.86rem", lineHeight: 1.45 }}>{risk.correction}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Phrase toggles</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={catastrophe} onChange={setCatastrophe} label="Uses heavy-karma language" icon={<AlertTriangle size={16} />} />
            <ToggleRow checked={determinism} onChange={setDeterminism} label="Explains difficulty as final" icon={<Ban size={16} />} />
            <ToggleRow checked={pastLife} onChange={setPastLife} label="Adds past-life specifics" icon={<MessageSquareText size={16} />} />
            <ToggleRow checked={manipulation} onChange={setManipulation} label="Uses D60 gravity for pressure" icon={<Scale size={16} />} />
            <ToggleRow checked={empowermentClose} onChange={setEmpowermentClose} label="Closes with agency" icon={<HeartHandshake size={16} />} />
            <ToggleRow checked={referOutReady} onChange={setReferOutReady} label="Keeps routing boundary visible" icon={<Route size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setPanelKey("risks");
              setCatastrophe(true);
              setDeterminism(true);
              setPastLife(false);
              setManipulation(false);
              setEmpowermentClose(true);
              setReferOutReady(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.6rem" }}>
          {(Object.keys(PANELS) as PanelKey[]).map((key) => {
            const item = PANELS[key];
            const active = key === panelKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPanelKey(key)}
                style={{
                  ...buttonReset,
                  border: `1px solid ${active ? item.color : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? "color-mix(in srgb, white 78%, var(--gl-card-surface-solid))" : "transparent",
                  color: active ? item.color : INK_SECONDARY,
                  padding: "0.75rem",
                  minHeight: 94,
                }}
                aria-pressed={active}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.38rem", fontSize: "0.78rem", fontWeight: 600 }}>
                  {item.icon}
                  {item.label}
                </span>
                <span style={{ display: "block", marginTop: "0.4rem", color: active ? INK_PRIMARY : INK_SECONDARY, lineHeight: 1.35 }}>{item.title}</span>
              </button>
            );
          })}
        </div>
        <p style={{ margin: "0.85rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{panel.body}</p>
      </section>

      <section style={{ ...cardStyle, borderColor: status.color }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <span style={{ color: status.color, marginTop: "0.1rem" }}>{status.color === GREEN ? <Sparkles size={20} /> : <AlertTriangle size={20} />}</span>
          <div>
            <p style={eyebrowStyle}>Safe close</p>
            <p style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, lineHeight: 1.58 }}>{response}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        border: `1px solid ${checked ? GREEN : HAIRLINE}`,
        borderRadius: 8,
        padding: "0.62rem 0.7rem",
        color: checked ? INK_PRIMARY : INK_MUTED,
        cursor: "pointer",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem" }}>
        {icon}
        {label}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function MalpracticeFlow({ activeRisks }: { activeRisks: RiskKey[] }) {
  const keys = Object.keys(RISKS) as RiskKey[];
  return (
    <svg viewBox="0 0 520 144" role="img" aria-label="D60 malpractice risk flow" style={{ width: "100%", height: "auto", marginTop: "0.9rem" }}>
      <rect x="8" y="8" width="504" height="128" rx="8" fill="rgba(255,255,255,0.35)" stroke={HAIRLINE} />
      <line x1="72" y1="72" x2="448" y2="72" stroke={HAIRLINE} strokeWidth="2" />
      {keys.map((key, index) => {
        const risk = RISKS[key];
        const active = activeRisks.includes(key);
        const x = 72 + index * 125;
        return (
          <g key={key}>
            <circle cx={x} cy="72" r={active ? 24 : 19} fill={active ? risk.color : SURFACE} stroke={risk.color} strokeWidth="2" />
            <text x={x} y="76" textAnchor="middle" fontSize="12" fontWeight="600" fill={active ? "white" : risk.color}>
              {index + 1}
            </text>
            <text x={x} y="113" textAnchor="middle" fontSize="10" fill={active ? risk.color : INK_MUTED}>
              {risk.short}
            </text>
          </g>
        );
      })}
      <text x="260" y="34" textAnchor="middle" fontSize="12" fill={INK_MUTED}>
        detect before delivering the D60 statement
      </text>
    </svg>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 600,
};

const buttonReset: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
  textAlign: "left",
};

const softButtonStyle: CSSProperties = {
  ...buttonReset,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_SECONDARY,
  padding: "0.55rem 0.72rem",
  fontSize: "0.86rem",
  fontWeight: 600,
};
