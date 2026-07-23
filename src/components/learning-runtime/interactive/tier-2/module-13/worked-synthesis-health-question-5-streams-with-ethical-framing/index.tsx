"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  ClipboardCheck,
  FileText,
  GitMerge,
  HeartPulse,
  LockKeyhole,
  Orbit,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  Sun,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type RouteTier = "tier4" | "symptom" | "activeConcern";
type StageKey = "gate" | "route" | "maheshvara" | "rudra" | "parashari" | "lal" | "compose";
type FindingKey = "sun" | "mars" | "rudra" | "mercuryBox6" | "ketuBox1" | "kpTajika";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const STAGES: Record<StageKey, { label: string; title: string; body: string; icon: ReactNode }> = {
  gate: {
    label: "Step 0",
    title: "Medical routing check runs first",
    body: "Only a Tier 4 general wellbeing question may proceed. Symptoms or active concerns route out before technique.",
    icon: <Stethoscope size={16} />,
  },
  route: {
    label: "Route",
    title: "Use health-relevant structures",
    body: "Lagna, 6th, 8th, 12th, Maheshvara, Rudra, and Lal Kitab box 6 are routed to the question.",
    icon: <ClipboardCheck size={16} />,
  },
  maheshvara: {
    label: "Maheshvara",
    title: "Sun converges with the Lagna lord",
    body: "The 8th from AK Mars in Capricorn is Leo; Leo's lord is Sun, independently the Lagna lord in its own sign.",
    icon: <Sun size={16} />,
  },
  rudra: {
    label: "Rudra",
    title: "A genuine tie stays unresolved",
    body: "Mercury and Jupiter are both own-sign candidates; fuller strength comparison is required before choosing.",
    icon: <GitMerge size={16} />,
  },
  parashari: {
    label: "Parashari",
    title: "Non-alarmist house reading",
    body: "Exalted Mars in the 6th reads as capacity to meet struggle, not automatic vulnerability.",
    icon: <HeartPulse size={16} />,
  },
  lal: {
    label: "Lal Kitab",
    title: "Texture plus deliberate silence",
    body: "Mercury in box 6 adds attentive health-management texture; Ketu in box 1 is computed but not interpreted.",
    icon: <Orbit size={16} />,
  },
  compose: {
    label: "Compose",
    title: "Ethical framing is load-bearing",
    body: "The statement stays in general constitutional tendencies and never becomes diagnosis, prognosis, or reassurance for symptoms.",
    icon: <FileText size={16} />,
  },
};

const STAGE_ORDER: StageKey[] = ["gate", "route", "maheshvara", "rudra", "parashari", "lal", "compose"];

const FINDINGS: Record<FindingKey, { label: string; finding: string; role: string; color: string }> = {
  sun: {
    label: "Sun",
    finding: "Lagna lord in Leo, independently computed as Maheshvara.",
    role: "strong convergence",
    color: ACCENT,
  },
  mars: {
    label: "Mars",
    finding: "Exalted in Capricorn in the 6th house.",
    role: "capacity, not alarm",
    color: VERMILION,
  },
  rudra: {
    label: "Rudra",
    finding: "Mercury and Jupiter are both own-sign candidates.",
    role: "partial, tied",
    color: BLUE,
  },
  mercuryBox6: {
    label: "Mercury box 6",
    finding: "Detail-attentive, information-seeking health-management texture.",
    role: "texture-adding",
    color: GREEN,
  },
  ketuBox1: {
    label: "Ketu box 1",
    finding: "Computed, then deliberately not interpreted.",
    role: "interpretation-restraint",
    color: VERMILION,
  },
  kpTajika: {
    label: "KP + Tajika",
    finding: "Fresh cuspal/varsha computation is required.",
    role: "scoped out",
    color: INK_MUTED,
  },
};

export function WorkedSynthesisHealthQuestion5StreamsWithEthicalFraming() {
  const [routeTier, setRouteTier] = useState<RouteTier>("tier4");
  const [stage, setStage] = useState<StageKey>("gate");
  const [finding, setFinding] = useState<FindingKey>("sun");
  const [interpretKetu, setInterpretKetu] = useState(false);
  const [forceRudra, setForceRudra] = useState(false);
  const [showScopedRows, setShowScopedRows] = useState(true);
  const [ethicalFrame, setEthicalFrame] = useState(true);

  const gateCleared = routeTier === "tier4";
  const methodOk = gateCleared && !interpretKetu && !forceRudra && showScopedRows && ethicalFrame;
  const selectedStage = STAGES[stage];
  const selectedFinding = FINDINGS[finding];

  const statement = useMemo(() => {
    if (!gateCleared) {
      return "Stop before technique: this is not a Tier 4 wellbeing question. Route toward appropriate medical care or scope support before any chart reading.";
    }
    if (interpretKetu) {
      return "Repair: Ketu in box 1 is computed, but its vitality-facing interpretation is deliberately withheld in this Tier 4 context.";
    }
    if (forceRudra) {
      return "Repair: Rudra is a genuine Mercury-Jupiter tie. Do not break it without fuller strength computation.";
    }
    if (!showScopedRows) {
      return "Repair: KP and Tajika must remain visible as scoped-out rows, not quietly omitted.";
    }
    if (!ethicalFrame) {
      return "Repair: the ethical frame is not a closing formality; it controls what this health statement may say.";
    }
    return "Tier 4 gate cleared. The Sun converges as Lagna lord and Maheshvara, Mars exalted in the 6th is read non-alarmistically, Rudra remains honestly tied, Mercury in Lal Kitab box 6 adds attentive texture, and Ketu box 1 is deliberately not interpreted. This is a general tendencies statement only.";
  }, [ethicalFrame, forceRudra, gateCleared, interpretKetu, showScopedRows]);

  return (
    <div data-interactive="worked-synthesis-health-question-5-streams-with-ethical-framing" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Worked synthesis: health question</p>
            <h2 style={headingStyle}>Open the reading with an ethical gate, then build only what the gate permits</h2>
            <p style={bodyStyle}>
              Route the consultation first, then test Maheshvara, Rudra, Parashari health houses, Lal Kitab texture, and interpretation-restraint.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setRouteTier("tier4");
              setStage("gate");
              setFinding("sun");
              setInterpretKetu(false);
              setForceRudra(false);
              setShowScopedRows(true);
              setEthicalFrame(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Step 0 routing gate</p>
        <div style={gateGridStyle}>
          <GateButton
            active={routeTier === "tier4"}
            color={GREEN}
            title="Tier 4 wellbeing"
            body="General vitality question; no symptom or diagnosis in play."
            onClick={() => setRouteTier("tier4")}
          />
          <GateButton
            active={routeTier === "symptom"}
            color={VERMILION}
            title="Undiagnosed symptom"
            body="Stop the matrix and route toward appropriate care."
            onClick={() => setRouteTier("symptom")}
          />
          <GateButton
            active={routeTier === "activeConcern"}
            color={VERMILION}
            title="Active medical concern"
            body="Do not offer chart reassurance in place of evaluation."
            onClick={() => setRouteTier("activeConcern")}
          />
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <p style={eyebrowStyle}>Gated synthesis diagram</p>
          <HealthSynthesisDiagram gateCleared={gateCleared} stage={stage} interpretKetu={interpretKetu} forceRudra={forceRudra} methodOk={methodOk} />
          <div style={stageGridStyle}>
            {STAGE_ORDER.map((key, index) => (
              <button key={key} type="button" aria-pressed={stage === key} onClick={() => setStage(key)} style={stageButtonStyle(stage === key, gateCleared || key === "gate")} disabled={!gateCleared && key !== "gate"}>
                <span style={stepNumberStyle}>{index}</span>
                {STAGES[key].label}
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 310px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: gateCleared ? ACCENT : VERMILION }}>
            {selectedStage.icon}
            <p style={eyebrowStyle}>{selectedStage.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{gateCleared || stage === "gate" ? selectedStage.title : "Technique paused by Step 0"}</h3>
          <p style={bodyStyle}>{gateCleared || stage === "gate" ? selectedStage.body : "The lesson's own discipline is that health-touching technique waits until the routing check clears."}</p>
          <div style={{ ...noticeStyle(methodOk ? GREEN : VERMILION), marginTop: "1rem" }}>
            {methodOk ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{methodOk ? "Health statement stays in scope" : "Statement needs repair"}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Findings and classifications</p>
          <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.8rem" }}>
            {(Object.keys(FINDINGS) as FindingKey[]).map((key) => {
              if (!showScopedRows && key === "kpTajika") return null;
              return (
                <button key={key} type="button" onClick={() => setFinding(key)} aria-pressed={finding === key} style={findingButtonStyle(finding === key, FINDINGS[key].color, gateCleared)} disabled={!gateCleared}>
                  <span>
                    <span style={{ display: "block", color: gateCleared ? FINDINGS[key].color : INK_MUTED, fontWeight: 500 }}>{FINDINGS[key].label}</span>
                    <span style={smallTextStyle}>{FINDINGS[key].role}</span>
                  </span>
                  {key === "ketuBox1" || key === "kpTajika" ? <LockKeyhole size={16} /> : <ClipboardCheck size={16} />}
                </button>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected finding</p>
          <div style={factPanelStyle}>
            <h3 style={{ ...panelTitleStyle, color: gateCleared ? selectedFinding.color : INK_MUTED }}>{gateCleared ? selectedFinding.label : "Gate not cleared"}</h3>
            <p style={bodyStyle}>{gateCleared ? selectedFinding.finding : "Select Tier 4 wellbeing in Step 0 before any matrix cell can populate."}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow
              checked={!interpretKetu}
              onChange={(checked) => setInterpretKetu(!checked)}
              label="Do not interpret Ketu box 1"
              body="The placement is computed, but the vitality-facing reading is withheld."
              icon={<LockKeyhole size={16} />}
              disabled={!gateCleared}
            />
            <ToggleRow
              checked={!forceRudra}
              onChange={(checked) => setForceRudra(!checked)}
              label="Leave Rudra as a genuine tie"
              body="Mercury and Jupiter both own-sign; fuller strength work is required."
              icon={<GitMerge size={16} />}
              disabled={!gateCleared}
            />
            <ToggleRow
              checked={showScopedRows}
              onChange={setShowScopedRows}
              label="Show KP and Tajika scoped out"
              body="Fresh cuspal or varsha computation is not invented."
              icon={<ShieldCheck size={16} />}
              disabled={!gateCleared}
            />
            <ToggleRow
              checked={ethicalFrame}
              onChange={setEthicalFrame}
              label="Keep ethical framing active"
              body="General tendencies only; never diagnosis, prognosis, or medical replacement."
              icon={<Stethoscope size={16} />}
              disabled={!gateCleared}
            />
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Statement preview</p>
          <div style={statementPanelStyle(methodOk)}>
            {methodOk ? <Sun size={22} color={ACCENT} /> : <AlertTriangle size={22} color={VERMILION} />}
            <h3 style={{ ...panelTitleStyle, color: methodOk ? ACCENT : VERMILION }}>
              {methodOk ? "Reassuring, bounded, non-medical" : "Repair before stating"}
            </h3>
            <p style={bodyStyle}>{statement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WorkedSynthesisHealthQuestion5StreamsWithEthicalFraming;

function HealthSynthesisDiagram({ gateCleared, stage, interpretKetu, forceRudra, methodOk }: { gateCleared: boolean; stage: StageKey; interpretKetu: boolean; forceRudra: boolean; methodOk: boolean }) {
  const activeIndex = STAGE_ORDER.indexOf(stage);
  return (
    <svg viewBox="0 0 760 390" role="img" aria-label="Health synthesis Step 0 gated diagram" style={{ width: "100%", minHeight: 320, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="740" height="370" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <rect x="56" y="48" width="170" height="64" rx="8" fill={gateCleared ? "#E8F5E9" : "#F9E8E3"} stroke={gateCleared ? GREEN : VERMILION} strokeWidth="2" />
      <text x="141" y="75" textAnchor="middle" fill={gateCleared ? GREEN : VERMILION} fontSize="15" fontWeight="500">Step 0 gate</text>
      <text x="141" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">{gateCleared ? "Tier 4 cleared" : "route out"}</text>
      <path d="M 226 80 L 300 80" stroke={gateCleared ? GREEN : HAIRLINE} strokeWidth="3" strokeDasharray={gateCleared ? undefined : "6 7"} />
      <Node x={365} y={80} label="Sun" body="Maheshvara + Lagna lord" color={ACCENT} active={gateCleared && activeIndex >= 2} />
      <Node x={560} y={80} label="Rudra" body={forceRudra ? "forced" : "Mercury/Jupiter tie"} color={forceRudra ? VERMILION : BLUE} active={gateCleared && activeIndex >= 3} />
      <path d="M 365 138 C 350 178, 340 200, 380 230" stroke={gateCleared ? ACCENT : HAIRLINE} strokeWidth="2.5" fill="none" />
      <path d="M 560 138 C 534 178, 502 200, 450 230" stroke={gateCleared ? BLUE : HAIRLINE} strokeWidth="2.5" fill="none" strokeDasharray={forceRudra ? "0" : "7 7"} />
      <Node x={260} y={250} label="Mars 6th" body="exalted capacity" color={VERMILION} active={gateCleared && activeIndex >= 4} />
      <Node x={500} y={250} label="Box 6" body="Mercury texture" color={GREEN} active={gateCleared && activeIndex >= 5} />
      <rect x="86" y="292" width="210" height="42" rx="8" fill={interpretKetu ? "#F9E8E3" : SURFACE} stroke={interpretKetu ? VERMILION : HAIRLINE} />
      <text x="191" y="310" textAnchor="middle" fill={interpretKetu ? VERMILION : INK_SECONDARY} fontSize="12" fontWeight="500">Ketu box 1</text>
      <text x="191" y="327" textAnchor="middle" fill={INK_MUTED} fontSize="11">{interpretKetu ? "over-interpreted" : "computed, silent"}</text>
      <circle cx="380" cy="250" r="60" fill={methodOk ? "#E8F5E9" : "#F9E8E3"} stroke={methodOk ? GREEN : VERMILION} strokeWidth="3" />
      <text x="380" y="244" textAnchor="middle" fill={methodOk ? GREEN : VERMILION} fontSize="17" fontWeight="500">Statement</text>
      <text x="380" y="267" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">{methodOk ? "bounded" : "repair"}</text>
    </svg>
  );
}

function Node({ x, y, label, body, color, active }: { x: number; y: number; label: string; body: string; color: string; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="58" fill={active ? color : SURFACE} fillOpacity={active ? 0.1 : 1} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
      <text x={x} y={y - 5} textAnchor="middle" fill={active ? color : INK_MUTED} fontSize="15" fontWeight="500">{label}</text>
      <text x={x} y={y + 17} textAnchor="middle" fill={INK_MUTED} fontSize="11">{body}</text>
    </g>
  );
}

function GateButton({ active, color, title, body, onClick }: { active: boolean; color: string; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={gateButtonStyle(active, color)}>
      <span style={{ display: "flex", gap: "0.48rem", alignItems: "center", color }}>
        {active ? <BadgeCheck size={16} /> : <Stethoscope size={16} />}
        <span style={{ fontWeight: 500 }}>{title}</span>
      </span>
      <span style={smallTextStyle}>{body}</span>
    </button>
  );
}

function ToggleRow({ checked, onChange, label, body, icon, disabled }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode; disabled?: boolean }) {
  return (
    <label style={toggleStyle(checked, Boolean(disabled))}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} disabled={disabled} />
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

const gateGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
  gap: "0.7rem",
  marginTop: "0.8rem",
};

const stageGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(105px, 1fr))",
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

const stepNumberStyle: CSSProperties = {
  width: "1.35rem",
  height: "1.35rem",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${HAIRLINE}`,
  fontSize: "0.78rem",
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

const factPanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.85rem",
  marginTop: "0.8rem",
  background: SURFACE,
  minHeight: "10rem",
};

function gateButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : SURFACE,
    padding: "0.78rem",
    textAlign: "left",
    display: "grid",
    gap: "0.3rem",
    cursor: "pointer",
    font: "inherit",
  };
}

function stageButtonStyle(active: boolean, enabled: boolean): CSSProperties {
  return {
    ...softButtonStyle,
    justifyContent: "flex-start",
    borderColor: active ? ACCENT : HAIRLINE,
    color: enabled ? (active ? INK_PRIMARY : INK_SECONDARY) : INK_MUTED,
    opacity: enabled ? 1 : 0.54,
    cursor: enabled ? "pointer" : "not-allowed",
  };
}

function findingButtonStyle(active: boolean, color: string, enabled: boolean): CSSProperties {
  return {
    border: `1px solid ${active && enabled ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active && enabled ? `${color}12` : SURFACE,
    color: enabled ? INK_PRIMARY : INK_MUTED,
    padding: "0.68rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.8rem",
    textAlign: "left",
    cursor: enabled ? "pointer" : "not-allowed",
    font: "inherit",
    opacity: enabled ? 1 : 0.58,
  };
}

function toggleStyle(checked: boolean, disabled: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: SURFACE,
    color: checked ? INK_PRIMARY : INK_MUTED,
    padding: "0.7rem",
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gap: "0.62rem",
    alignItems: "center",
    opacity: disabled ? 0.58 : 1,
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 8,
    background: `${color}12`,
    color,
    padding: "0.7rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    fontWeight: 500,
  };
}

function statementPanelStyle(ok: boolean): CSSProperties {
  return {
    border: `1px solid ${ok ? ACCENT : VERMILION}`,
    borderRadius: 8,
    background: ok ? `${ACCENT}12` : "#F9E8E3",
    padding: "1rem",
    marginTop: "0.8rem",
    minHeight: "13rem",
  };
}
