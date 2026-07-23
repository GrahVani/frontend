"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Compass,
  HeartHandshake,
  Layers3,
  RefreshCw,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ScenarioKey = "confirmed" | "timing" | "apparent" | "genuine" | "replacement" | "dependency";

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

const SCENARIOS: Record<ScenarioKey, { label: string; natal: string; prashna: string; result: string; color: string; icon: ReactNode }> = {
  confirmed: {
    label: "Confirmed sharpening",
    natal: "Strong 7th-house promise",
    prashna: "This specific match reads favourable",
    result: "Natal explains general promise; prashna answers this one, now.",
    color: GREEN,
    icon: <HeartHandshake size={16} />,
  },
  timing: {
    label: "Timing refinement",
    natal: "Promise active but timing broad",
    prashna: "Live decision point narrows the window",
    result: "No contradiction: prashna sharpens timing resolution.",
    color: BLUE,
    icon: <Timer size={16} />,
  },
  apparent: {
    label: "Apparent tension",
    natal: "Marriage possible in life",
    prashna: "This proposal reads unfavourable",
    result: "Scopes differ; the natal chart was not asked about this proposal.",
    color: GOLD,
    icon: <Compass size={16} />,
  },
  genuine: {
    label: "Genuine tension",
    natal: "Weak domain promise",
    prashna: "Specific instance reads favourable",
    result: "Both facts are reported: weak general promise and favourable bounded question.",
    color: PURPLE,
    icon: <AlertTriangle size={16} />,
  },
  replacement: {
    label: "Replacement failure",
    natal: "Life-domain analysis needed",
    prashna: "One bounded chart is stretched too wide",
    result: "Route back to natal work; the prashna chart cannot answer a whole life-domain.",
    color: VERMILION,
    icon: <Layers3 size={16} />,
  },
  dependency: {
    label: "Dependency risk",
    natal: "Durable self-understanding needed",
    prashna: "Repeated minor-decision horaries",
    result: "Answer legitimate questions while building natal literacy over time.",
    color: BLUE,
    icon: <ShieldCheck size={16} />,
  },
};

export function PrashnaNatalOverlayDiscipline() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("confirmed");
  const [readAgainstNatal, setReadAgainstNatal] = useState(true);
  const [scopeFirst, setScopeFirst] = useState(true);
  const [noReplacement, setNoReplacement] = useState(true);
  const [empowerment, setEmpowerment] = useState(true);

  const scenario = SCENARIOS[scenarioKey];
  const ready = readAgainstNatal && scopeFirst && noReplacement && empowerment;

  const feedback = useMemo(() => {
    if (!readAgainstNatal) return "Repair: when a reliable natal chart exists, prashna is read against the natal promise, not in isolation.";
    if (!scopeFirst) return "Repair: distinguish general life-domain promise from a specific live question before calling it a contradiction.";
    if (!noReplacement) return "Repair: a bounded prashna chart cannot replace natal analysis of a whole life-domain.";
    if (!empowerment) return "Repair: repeated prashna should build natal literacy, not dependence on fresh momentary readings.";
    return scenario.result;
  }, [empowerment, noReplacement, readAgainstNatal, scenario.result, scopeFirst]);

  return (
    <div data-interactive="prashna-natal-overlay-discipline" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Prashna over natal, not instead of natal</p>
            <h2 style={headingStyle}>Read the live question against the life-domain promise</h2>
            <p style={bodyStyle}>
              Sort confirmed sharpening, timing refinement, apparent tension, genuine tension, replacement failure, and dependency risk without flattening the scope.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenarioKey("confirmed");
              setReadAgainstNatal(true);
              setScopeFirst(true);
              setNoReplacement(true);
              setEmpowerment(true);
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
          <p style={eyebrowStyle}>Scope overlay map</p>
          <OverlayDiagram scenario={scenario} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: scenario.color }}>
            {scenario.icon}
            <p style={eyebrowStyle}>{scenario.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{scenario.result}</h3>
          <p style={bodyStyle}>Natal: {scenario.natal}. Prashna: {scenario.prashna}.</p>
          <div style={{ ...noticeStyle(scenario.color), marginTop: "1rem" }}>
            <Compass size={18} />
            <span>First compare scope, then compare verdicts.</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Scenario selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setScenarioKey(key)} aria-pressed={scenarioKey === key} style={choiceButtonStyle(scenarioKey === key, SCENARIOS[key].color)}>
                {SCENARIOS[key].icon}
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{SCENARIOS[key].label}</span>
                  <span style={smallTextStyle}>{SCENARIOS[key].result}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Discipline safeguards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={readAgainstNatal} onChange={setReadAgainstNatal} label="Read against natal promise" body="Do not isolate prashna when reliable natal data exists." icon={<Layers3 size={16} />} />
            <ToggleRow checked={scopeFirst} onChange={setScopeFirst} label="Scope before contradiction" body="A specific proposal can fail while marriage remains promised generally." icon={<Compass size={16} />} />
            <ToggleRow checked={noReplacement} onChange={setNoReplacement} label="No replacement reading" body="One prashna chart cannot answer a whole life-domain." icon={<AlertTriangle size={16} />} />
            <ToggleRow checked={empowerment} onChange={setEmpowerment} label="Empowerment over dependency" body="Use repeated questions to build natal literacy over time." icon={<ShieldCheck size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Overlay discipline check</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "Prashna stays a bounded overlay" : "Repair the natal-prashna boundary"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrashnaNatalOverlayDiscipline;

function OverlayDiagram({ scenario }: { scenario: (typeof SCENARIOS)[ScenarioKey] }) {
  return (
    <svg viewBox="0 0 820 430" role="img" aria-label="Prashna as overlay on natal work diagram" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Natal reads general promise; prashna reads one bounded live matter</text>
      <circle cx="318" cy="204" r="116" fill={softFill(BLUE)} stroke={BLUE} strokeWidth="1.8" />
      <text x="318" y="184" textAnchor="middle" fill={BLUE} fontSize="13" fontWeight="500">Natal promise</text>
      <text x="318" y="208" textAnchor="middle" fill={INK_MUTED} fontSize="10">{scenario.natal}</text>
      <circle cx="502" cy="204" r="86" fill={softFill(scenario.color)} stroke={scenario.color} strokeWidth="1.8" />
      <text x="502" y="188" textAnchor="middle" fill={scenario.color} fontSize="13" fontWeight="500">Prashna question</text>
      <text x="502" y="210" textAnchor="middle" fill={INK_MUTED} fontSize="9.5">{scenario.prashna}</text>
      <path d="M392 298 C420 328, 474 328, 502 298" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 7" />
      <rect x="226" y="348" width="368" height="38" rx="8" fill={softFill(scenario.color)} stroke={scenario.color} />
      <text x="410" y="372" textAnchor="middle" fill={scenario.color} fontSize="11.5" fontWeight="500">{scenario.label}</text>
    </svg>
  );
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
