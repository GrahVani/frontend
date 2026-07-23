"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  ClipboardCheck,
  FileText,
  GitCompare,
  ListChecks,
  RefreshCw,
  Scale,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type SymptomKey = "caveats" | "treadmill" | "flight";
type ViewKey = "inside" | "client" | "fix";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const SYMPTOMS: Record<SymptomKey, { label: string; feeling: string; client: string; fix: string; icon: ReactNode; color: string }> = {
  caveats: {
    label: "Caveats creep",
    feeling: "I am just adding enough context so nothing sounds overstated.",
    client: "The useful finding is hidden in Caveats, and Confidence says almost nothing.",
    fix: "Audit each Caveats line: real exclusion stays; disguised finding moves to Confidence.",
    icon: <FileText size={16} />,
    color: ACCENT,
  },
  treadmill: {
    label: "Rule-out treadmill",
    feeling: "One more re-check might make the divergence settle cleanly.",
    client: "The statement is delayed or never lands, even though the protocol already produced a result.",
    fix: "Run re-examination once in full; stop unless new information arrives.",
    icon: <TimerReset size={16} />,
    color: BLUE,
  },
  flight: {
    label: "Flight to the bottom",
    feeling: "The lowest confidence tier feels safest if the client later asks what happened.",
    client: "Earned findings are downgraded into vagueness or insufficient-data language.",
    fix: "Draft Confidence before Caveats, anchored to Check's actual result.",
    icon: <Scale size={16} />,
    color: VERMILION,
  },
};

const SYMPTOM_ORDER: SymptomKey[] = ["caveats", "treadmill", "flight"];

export function SynthesisParalysisDiagnosticWorkbench() {
  const [symptom, setSymptom] = useState<SymptomKey>("caveats");
  const [view, setView] = useState<ViewKey>("inside");
  const [protocolRunOnce, setProtocolRunOnce] = useState(true);
  const [caveatsAudited, setCaveatsAudited] = useState(true);
  const [confidenceFirst, setConfidenceFirst] = useState(true);
  const [overcorrect, setOvercorrect] = useState(false);

  const selected = SYMPTOMS[symptom];
  const methodOk = protocolRunOnce && caveatsAudited && confidenceFirst && !overcorrect;

  const feedback = useMemo(() => {
    if (overcorrect) {
      return "Repair: dropping real caveats or skipping re-examination trades synthesis-paralysis for false certainty.";
    }
    if (!protocolRunOnce) {
      return "Repair: the protocol has a hard stop. Re-running confirmed evidence without new information is the treadmill.";
    }
    if (!caveatsAudited) {
      return "Repair: audit Caveats line by line. Findings hiding there belong in Confidence.";
    }
    if (!confidenceFirst) {
      return "Repair: draft Confidence before Caveats so Check's result is stated before caution erodes it.";
    }
    return "Good discipline: re-examination runs once, Caveats names real exclusions, Confidence states the earned finding, and the fix does not overcorrect into false certainty.";
  }, [caveatsAudited, confidenceFirst, overcorrect, protocolRunOnce]);

  return (
    <div data-interactive="synthesis-paralysis-diagnostic-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Synthesis-paralysis diagnostic</p>
            <h2 style={headingStyle}>Catch the moment diligence turns into a non-answer</h2>
            <p style={bodyStyle}>
              Diagnose caveats creep, the rule-out treadmill, and confidence-tier flight to the bottom, then apply the matching avoidance practice without cutting the sequence.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSymptom("caveats");
              setView("inside");
              setProtocolRunOnce(true);
              setCaveatsAudited(true);
              setConfidenceFirst(true);
              setOvercorrect(false);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 540px" }}>
          <p style={eyebrowStyle}>Inside feeling vs client landing</p>
          <ParalysisDiagram symptom={symptom} view={view} methodOk={methodOk} overcorrect={overcorrect} />
          <div style={viewGridStyle}>
            <button type="button" aria-pressed={view === "inside"} onClick={() => setView("inside")} style={choiceButtonStyle(view === "inside", ACCENT)}>
              Inside feeling
            </button>
            <button type="button" aria-pressed={view === "client"} onClick={() => setView("client")} style={choiceButtonStyle(view === "client", BLUE)}>
              Client landing
            </button>
            <button type="button" aria-pressed={view === "fix"} onClick={() => setView("fix")} style={choiceButtonStyle(view === "fix", GREEN)}>
              Avoidance fix
            </button>
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 310px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: selected.color }}>
            {selected.icon}
            <p style={eyebrowStyle}>{selected.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{view === "inside" ? "How it feels" : view === "client" ? "How it lands" : "How to stop it"}</h3>
          <p style={bodyStyle}>{view === "inside" ? selected.feeling : view === "client" ? selected.client : selected.fix}</p>
          <div style={{ ...noticeStyle(methodOk ? GREEN : VERMILION), marginTop: "1rem" }}>
            {methodOk ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{methodOk ? "usable statement path" : "paralysis or overcorrection risk"}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Symptom selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {SYMPTOM_ORDER.map((key) => (
              <button key={key} type="button" onClick={() => setSymptom(key)} aria-pressed={symptom === key} style={symptomButtonStyle(symptom === key, SYMPTOMS[key].color)}>
                <span style={{ color: SYMPTOMS[key].color }}>{SYMPTOMS[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{SYMPTOMS[key].label}</span>
                  <span style={smallTextStyle}>{SYMPTOMS[key].fix}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Avoidance discipline</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow
              checked={protocolRunOnce}
              onChange={setProtocolRunOnce}
              label="Hard stop after one re-examination"
              body="Run the protocol fully once; repeat only with new information."
              icon={<GitCompare size={16} />}
            />
            <ToggleRow
              checked={caveatsAudited}
              onChange={setCaveatsAudited}
              label="Audit Caveats for disguised findings"
              body="Specific exclusions stay; findings move to Confidence."
              icon={<ListChecks size={16} />}
            />
            <ToggleRow
              checked={confidenceFirst}
              onChange={setConfidenceFirst}
              label="Draft Confidence before Caveats"
              body="Anchor to Check before hedging can erode the result."
              icon={<ClipboardCheck size={16} />}
            />
            <ToggleRow
              checked={!overcorrect}
              onChange={(checked) => setOvercorrect(!checked)}
              label="Do not cut steps to sound decisive"
              body="The fix is exact matching, not bravado."
              icon={<ShieldCheck size={16} />}
            />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {methodOk ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Diagnostic result</p>
            <h3 style={{ ...panelTitleStyle, color: methodOk ? GREEN : VERMILION }}>{methodOk ? "Paralysis avoided without overcorrection" : "Repair the drafting process"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SynthesisParalysisDiagnosticWorkbench;

function ParalysisDiagram({ symptom, view, methodOk, overcorrect }: { symptom: SymptomKey; view: ViewKey; methodOk: boolean; overcorrect: boolean }) {
  const selected = SYMPTOMS[symptom];
  const activeX = view === "inside" ? 160 : view === "client" ? 390 : 620;
  const activeColor = view === "inside" ? ACCENT : view === "client" ? BLUE : GREEN;
  return (
    <svg viewBox="0 0 780 390" role="img" aria-label="Synthesis paralysis diagnostic diagram" style={{ width: "100%", minHeight: 320, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="370" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 210 140 C 270 104, 320 104, 340 140" fill="none" stroke={HAIRLINE} strokeWidth="2.5" strokeDasharray="6 7" />
      <path d="M 440 140 C 500 104, 550 104, 570 140" fill="none" stroke={HAIRLINE} strokeWidth="2.5" strokeDasharray="6 7" />
      <StageNode x={160} y={150} label="Inside" body="feels diligent" color={ACCENT} active={view === "inside"} />
      <StageNode x={390} y={150} label="Client" body="gets vagueness" color={BLUE} active={view === "client"} />
      <StageNode x={620} y={150} label="Fix" body="specific practice" color={GREEN} active={view === "fix"} />
      <path d={`M ${activeX} 210 L ${activeX} 258`} stroke={activeColor} strokeWidth="3" strokeLinecap="round" />
      <rect x={activeX - 120} y="258" width="240" height="68" rx="8" fill={softFill(activeColor)} stroke={activeColor} strokeWidth="2" />
      <text x={activeX} y="284" textAnchor="middle" fill={activeColor} fontSize="14" fontWeight="500">{selected.label}</text>
      <text x={activeX} y="306" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">{view === "inside" ? "good instinct over-applied" : view === "client" ? "not useful enough" : "matched discipline"}</text>
      <circle cx="390" cy="342" r="22" fill={methodOk ? "#E8F5E9" : "#F9E8E3"} stroke={methodOk ? GREEN : VERMILION} strokeWidth="2" />
      <text x="390" y="347" textAnchor="middle" fill={methodOk ? GREEN : VERMILION} fontSize="18">{overcorrect ? "!" : methodOk ? "✓" : "!"}</text>
    </svg>
  );
}

function StageNode({ x, y, label, body, color, active }: { x: number; y: number; label: string; body: string; color: string; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="58" fill={active ? softFill(color) : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
      <text x={x} y={y - 5} textAnchor="middle" fill={active ? color : INK_MUTED} fontSize="15" fontWeight="500">{label}</text>
      <text x={x} y={y + 17} textAnchor="middle" fill={INK_MUTED} fontSize="11">{body}</text>
    </g>
  );
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
};

const viewGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: 0,
  fontSize: "0.78rem",
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.35rem",
  lineHeight: 1.25,
  fontWeight: 500,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.4rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  lineHeight: 1.3,
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.94rem",
};

const smallTextStyle: CSSProperties = {
  margin: "0.2rem 0 0",
  color: INK_MUTED,
  lineHeight: 1.4,
  fontSize: "0.84rem",
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.58rem 0.72rem",
  background: SURFACE,
  color: INK_PRIMARY,
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.9rem",
  fontWeight: 500,
};

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : SURFACE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
    padding: "0.55rem 0.7rem",
    minHeight: 40,
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.9rem",
    fontWeight: 500,
  };
}

function symptomButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : SURFACE,
    color: INK_PRIMARY,
    padding: "0.72rem",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    font: "inherit",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: checked ? softFill(ACCENT) : SURFACE,
    color: checked ? INK_PRIMARY : INK_MUTED,
    padding: "0.7rem",
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gap: "0.62rem",
    alignItems: "center",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 8,
    background: softFill(color),
    color,
    padding: "0.7rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    fontWeight: 500,
  };
}

function softFill(color: string): string {
  if (color === ACCENT) return "#FDF4E3";
  if (color === GREEN) return "#E8F5E9";
  if (color === BLUE) return "#E3EEF9";
  if (color === VERMILION) return "#F9E8E3";
  return SURFACE;
}
