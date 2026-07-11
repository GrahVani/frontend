"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CircleDot,
  Compass,
  FileText,
  GitMerge,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Split,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type FocusKey = "gate" | "poles" | "frames" | "sannyasa" | "statement";
type PoleKey = "outward" | "inward";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const FOCUS: Record<FocusKey, { label: string; title: string; body: string; color: string; icon: ReactNode }> = {
  gate: {
    label: "Step 0",
    title: "Capacity, never prescription",
    body: "Every finding is framed as orientation and capacity. The chart does not choose the life expression for the native.",
    color: ACCENT,
    icon: <ShieldCheck size={16} />,
  },
  poles: {
    label: "Dual finding",
    title: "Both poles are independently corroborated",
    body: "Outward vocation has Jaimini, Lal Kitab, and Tajika support. Inward pull has Jaimini D9 and Parashari D1 support.",
    color: GREEN,
    icon: <GitMerge size={16} />,
  },
  frames: {
    label: "Frame check",
    title: "Two different ninth houses",
    body: "D1 9th from Lagna has Ketu; D9 9th from Karakamsha has Mercury. Same ordinal language, different reference frames.",
    color: BLUE,
    icon: <Compass size={16} />,
  },
  sannyasa: {
    label: "Sannyasa test",
    title: "Core formation cleanly absent",
    body: "The four-or-more-grahas conjunction threshold is not approached; Chart MD1 has no sign with more than one point.",
    color: VERMILION,
    icon: <CircleDot size={16} />,
  },
  statement: {
    label: "Compose",
    title: "Characterisation, not promise mode",
    body: "Confidence reports evidentiary strength per pole, not single-verdict, two-part-resolved, or insufficient-data promise modes.",
    color: GREEN,
    icon: <FileText size={16} />,
  },
};

const FOCUS_ORDER: FocusKey[] = ["gate", "poles", "frames", "sannyasa", "statement"];

const POLES: Record<PoleKey, { label: string; mechanisms: string[]; color: string; summary: string }> = {
  outward: {
    label: "Outward pole",
    mechanisms: ["Jaimini Karakamsha", "Lal Kitab box 10 Mars", "Tajika Punya Saham in 10th"],
    color: GREEN,
    summary: "Vocation, action, public dharma expression, and career-world engagement are real.",
  },
  inward: {
    label: "Inward pole",
    mechanisms: ["Jaimini D9 Saturn + Ketu", "Parashari D1 Ketu in 9th"],
    color: BLUE,
    summary: "Detachment, direct spiritual experience, and non-institutional dharma pull are also real.",
  },
};

const CHART_POINTS = ["Sun Leo", "Mercury Virgo", "Rahu Libra", "Jupiter Sagittarius", "Mars Capricorn", "Ketu Aries", "Moon Taurus", "Venus Gemini", "Saturn Cancer"];

export function WorkedSynthesisSpiritualPathQuestion5Streams() {
  const [focus, setFocus] = useState<FocusKey>("poles");
  const [pole, setPole] = useState<PoleKey>("inward");
  const [gateCleared, setGateCleared] = useState(true);
  const [keepFramesSeparate, setKeepFramesSeparate] = useState(true);
  const [separateSannyasa, setSeparateSannyasa] = useState(true);
  const [dualFindingMode, setDualFindingMode] = useState(true);
  const [avoidPrescription, setAvoidPrescription] = useState(true);

  const selectedFocus = FOCUS[focus];
  const selectedPole = POLES[pole];
  const methodOk = gateCleared && keepFramesSeparate && separateSannyasa && dualFindingMode && avoidPrescription;

  const feedback = useMemo(() => {
    if (!gateCleared || !avoidPrescription) {
      return "Repair: spiritual-path language must stay capacity-not-prescription. Do not turn orientation into destiny or instruction.";
    }
    if (!keepFramesSeparate) {
      return "Repair: D1 9th-from-Lagna and D9 9th-from-Karakamsha are different reference frames, not a contradiction.";
    }
    if (!separateSannyasa) {
      return "Repair: absence of the narrow Sannyasa-yoga core formation does not weaken the broader inward-disposition finding.";
    }
    if (!dualFindingMode) {
      return "Repair: this is not a promise-question mode. Report a dual characterisation, not a forced single verdict.";
    }
    return "Calibrated statement: both outward and inward poles are reported at earned strength, the Sannyasa-yoga test is cleanly absent as a separate narrow finding, and expression remains the native's choice.";
  }, [avoidPrescription, dualFindingMode, gateCleared, keepFramesSeparate, separateSannyasa]);

  return (
    <div data-interactive="worked-synthesis-spiritual-path-question-5-streams" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Worked synthesis: spiritual path</p>
            <h2 style={headingStyle}>Compose a dual finding without prescribing a life</h2>
            <p style={bodyStyle}>
              Bring Parashari into the dharma thread, keep D1 and D9 frames distinct, test the narrow Sannyasa-yoga claim, and report both poles without collapse.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFocus("poles");
              setPole("inward");
              setGateCleared(true);
              setKeepFramesSeparate(true);
              setSeparateSannyasa(true);
              setDualFindingMode(true);
              setAvoidPrescription(true);
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
          <p style={eyebrowStyle}>Dual-pole synthesis map</p>
          <SpiritualPathDiagram focus={focus} pole={pole} methodOk={methodOk} />
          <div style={focusGridStyle}>
            {FOCUS_ORDER.map((key) => (
              <button key={key} type="button" aria-pressed={focus === key} onClick={() => setFocus(key)} style={choiceButtonStyle(focus === key, FOCUS[key].color)}>
                {FOCUS[key].icon}
                {FOCUS[key].label}
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 310px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: selectedFocus.color }}>
            {selectedFocus.icon}
            <p style={eyebrowStyle}>{selectedFocus.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{selectedFocus.title}</h3>
          <p style={bodyStyle}>{selectedFocus.body}</p>
          <div style={{ ...noticeStyle(methodOk ? GREEN : VERMILION), marginTop: "1rem" }}>
            {methodOk ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{methodOk ? "dual finding in scope" : "statement needs repair"}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Pole evidence</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(POLES) as PoleKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setPole(key)} aria-pressed={pole === key} style={poleButtonStyle(pole === key, POLES[key].color)}>
                <span>
                  <span style={{ display: "block", color: POLES[key].color, fontWeight: 500 }}>{POLES[key].label}</span>
                  <span style={smallTextStyle}>{POLES[key].mechanisms.length} mechanisms</span>
                </span>
                <Split size={16} />
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Selected pole</p>
          <div style={factPanelStyle}>
            <h3 style={{ ...panelTitleStyle, color: selectedPole.color }}>{selectedPole.label}</h3>
            <p style={bodyStyle}>{selectedPole.summary}</p>
            <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.75rem" }}>
              {selectedPole.mechanisms.map((item) => (
                <span key={item} style={miniPillStyle(selectedPole.color)}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Sannyasa-yoga formation check</p>
          <div style={chartGridStyle}>
            {CHART_POINTS.map((point) => (
              <span key={point} style={chartPointStyle}>{point}</span>
            ))}
          </div>
          <div style={{ ...noticeStyle(VERMILION), marginTop: "0.8rem" }}>
            <CircleDot size={18} />
            <span>Maximum conjunction size: 1. Core four-graha threshold: absent.</span>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={gateCleared && avoidPrescription} onChange={(checked) => { setGateCleared(checked); setAvoidPrescription(checked); }} label="Capacity-not-prescription gate" body="Indication, not destiny or life instruction." icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={keepFramesSeparate} onChange={setKeepFramesSeparate} label="Keep D1 and D9 ninths separate" body="No contradiction: different chart and reference point." icon={<Compass size={16} />} />
            <ToggleRow checked={separateSannyasa} onChange={setSeparateSannyasa} label="Keep Sannyasa absence separate" body="Narrow no does not weaken broad disposition." icon={<LockKeyhole size={16} />} />
            <ToggleRow checked={dualFindingMode} onChange={setDualFindingMode} label="Use dual-finding characterisation" body="Do not force promise-question confidence modes." icon={<GitMerge size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {methodOk ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Statement preview</p>
            <h3 style={{ ...panelTitleStyle, color: methodOk ? GREEN : VERMILION }}>{methodOk ? "Dual finding, ethically bounded" : "Repair before delivery"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WorkedSynthesisSpiritualPathQuestion5Streams;

function SpiritualPathDiagram({ focus, pole, methodOk }: { focus: FocusKey; pole: PoleKey; methodOk: boolean }) {
  return (
    <svg viewBox="0 0 780 400" role="img" aria-label="Spiritual path dual finding synthesis diagram" style={{ width: "100%", minHeight: 330, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="380" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <rect x="78" y="48" width="190" height="54" rx="8" fill={focus === "gate" ? softFill(ACCENT) : SURFACE} stroke={focus === "gate" ? ACCENT : HAIRLINE} />
      <text x="173" y="70" textAnchor="middle" fill={focus === "gate" ? ACCENT : INK_SECONDARY} fontSize="13" fontWeight="500">Step 0 gate</text>
      <text x="173" y="88" textAnchor="middle" fill={INK_MUTED} fontSize="11">capacity, not prescription</text>
      <path d="M 268 75 L 340 75" stroke={HAIRLINE} strokeWidth="2.5" strokeDasharray="6 7" />
      <DualNode x={285} y={205} label="Outward" body="3 mechanisms" color={GREEN} active={pole === "outward" || focus === "poles"} />
      <DualNode x={495} y={205} label="Inward" body="2 mechanisms" color={BLUE} active={pole === "inward" || focus === "poles"} />
      <path d="M 340 205 C 372 170, 408 170, 440 205" fill="none" stroke={focus === "poles" ? ACCENT : HAIRLINE} strokeWidth="3" />
      <rect x="555" y="58" width="146" height="66" rx="8" fill={focus === "frames" ? softFill(BLUE) : SURFACE} stroke={focus === "frames" ? BLUE : HAIRLINE} />
      <text x="628" y="83" textAnchor="middle" fill={focus === "frames" ? BLUE : INK_SECONDARY} fontSize="12" fontWeight="500">Two 9ths</text>
      <text x="628" y="103" textAnchor="middle" fill={INK_MUTED} fontSize="10">D1 Ketu / D9 Mercury</text>
      <rect x="94" y="308" width="190" height="46" rx="8" fill={focus === "sannyasa" ? "#F9E8E3" : SURFACE} stroke={focus === "sannyasa" ? VERMILION : HAIRLINE} />
      <text x="189" y="327" textAnchor="middle" fill={focus === "sannyasa" ? VERMILION : INK_SECONDARY} fontSize="12" fontWeight="500">Sannyasa core</text>
      <text x="189" y="344" textAnchor="middle" fill={INK_MUTED} fontSize="10">cleanly absent</text>
      <circle cx="620" cy="318" r="48" fill={methodOk ? "#E8F5E9" : "#F9E8E3"} stroke={methodOk ? GREEN : VERMILION} strokeWidth="3" />
      <text x="620" y="312" textAnchor="middle" fill={methodOk ? GREEN : VERMILION} fontSize="13" fontWeight="500">Statement</text>
      <text x="620" y="333" textAnchor="middle" fill={INK_MUTED} fontSize="10">{methodOk ? "dual finding" : "repair"}</text>
    </svg>
  );
}

function DualNode({ x, y, label, body, color, active }: { x: number; y: number; label: string; body: string; color: string; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="62" fill={active ? softFill(color) : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
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

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const twoColumnStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", gap: "1rem" };
const focusGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" };
const chartGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem", marginTop: "0.85rem" };
const eyebrowStyle: CSSProperties = { margin: 0, color: ACCENT, textTransform: "uppercase", letterSpacing: 0, fontSize: "0.78rem", fontWeight: 500 };
const headingStyle: CSSProperties = { margin: "0.25rem 0 0", color: INK_PRIMARY, fontSize: "1.35rem", lineHeight: 1.25, fontWeight: 500 };
const panelTitleStyle: CSSProperties = { margin: "0.4rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", lineHeight: 1.3, fontWeight: 500 };
const bodyStyle: CSSProperties = { margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.94rem" };
const smallTextStyle: CSSProperties = { margin: "0.2rem 0 0", color: INK_MUTED, lineHeight: 1.4, fontSize: "0.84rem" };
const softButtonStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.58rem 0.72rem", background: SURFACE, color: INK_PRIMARY, cursor: "pointer", font: "inherit", fontSize: "0.9rem", fontWeight: 500 };
const factPanelStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.85rem", marginTop: "0.8rem", background: SURFACE, minHeight: "12rem" };
const chartPointStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.55rem", color: INK_SECONDARY, fontSize: "0.86rem", textAlign: "center" };

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return { border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? softFill(color) : SURFACE, color: active ? INK_PRIMARY : INK_SECONDARY, padding: "0.55rem 0.7rem", minHeight: 40, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", cursor: "pointer", font: "inherit", fontSize: "0.9rem", fontWeight: 500 };
}

function poleButtonStyle(active: boolean, color: string): CSSProperties {
  return { border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? softFill(color) : SURFACE, color: INK_PRIMARY, padding: "0.72rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.8rem", textAlign: "left", cursor: "pointer", font: "inherit" };
}

function miniPillStyle(color: string): CSSProperties {
  return { border: `1px solid ${color}55`, borderRadius: 8, background: softFill(color), color: INK_SECONDARY, padding: "0.42rem 0.55rem", fontSize: "0.82rem" };
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
