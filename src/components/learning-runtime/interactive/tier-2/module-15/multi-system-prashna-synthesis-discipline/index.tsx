"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  GitCompare,
  Layers3,
  ListChecks,
  MapPinned,
  RefreshCw,
  Route,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type StepKey = "route" | "weight" | "classify" | "check" | "resolve" | "rank";
type ScenarioKey = "lagnaMismatch" | "sharedLagna" | "compound";

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

const STEPS: Record<StepKey, { label: string; detail: string; icon: ReactNode; color: string }> = {
  route: { label: "Route", detail: "Test lagna source before comparing houses.", icon: <Route size={16} />, color: BLUE },
  weight: { label: "Weight", detail: "Usually inert unless the prashna is compound.", icon: <Scale size={16} />, color: GOLD },
  classify: { label: "Classify", detail: "Primary systems bear verdicts; RP overlay corroborates only.", icon: <ListChecks size={16} />, color: GREEN },
  check: { label: "Check", detail: "Re-examine divergences caused by different ascendants.", icon: <ShieldCheck size={16} />, color: PURPLE },
  resolve: { label: "Resolve", detail: "Frame the actionable synthesis without stream leakage.", icon: <GitCompare size={16} />, color: VERMILION },
  rank: { label: "Rank", detail: "Order findings by stakes and directionality.", icon: <Layers3 size={16} />, color: BLUE },
};

const SCENARIOS: Record<ScenarioKey, { label: string; kpLagna: string; momentLagna: string; matter: string; message: string; compound: boolean }> = {
  lagnaMismatch: {
    label: "KP number 90 vs moment chart",
    kpLagna: "Leo",
    momentLagna: "Sagittarius",
    matter: "10th house career comparison",
    message: "KP 10th is Taurus; Parashari/Tajika 10th is Virgo. Direct house-number comparison is unsafe.",
    compound: false,
  },
  sharedLagna: {
    label: "Matched lagna source",
    kpLagna: "Sagittarius",
    momentLagna: "Sagittarius",
    matter: "Single job question",
    message: "The route flag clears; compare each system's method while preserving its evidence rules.",
    compound: false,
  },
  compound: {
    label: "Job plus relocation",
    kpLagna: "Leo",
    momentLagna: "Sagittarius",
    matter: "Job result and relocation requirement",
    message: "Weight becomes active: one sub-question uses job houses; the other needs travel/relocation logic.",
    compound: true,
  },
};

export function MultiSystemPrashnaSynthesisDiscipline() {
  const [activeStep, setActiveStep] = useState<StepKey>("route");
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("lagnaMismatch");
  const [routeFirst, setRouteFirst] = useState(true);
  const [weightOnlyIfCompound, setWeightOnlyIfCompound] = useState(true);
  const [rpCorroboratingOnly, setRpCorroboratingOnly] = useState(true);
  const [checkArtefacts, setCheckArtefacts] = useState(true);

  const scenario = SCENARIOS[scenarioKey];
  const step = STEPS[activeStep];
  const lagnaMismatch = scenario.kpLagna !== scenario.momentLagna;
  const ready = routeFirst && weightOnlyIfCompound && rpCorroboratingOnly && checkArtefacts;

  const feedback = useMemo(() => {
    if (!routeFirst) return "Repair: run the lagna-source Route test before comparing house findings.";
    if (!weightOnlyIfCompound) return "Repair: Weight is usually inert; activate it only for a genuinely compound prashna.";
    if (!rpCorroboratingOnly) return "Repair: RP overlay is corroborating only, never a fourth verdict-bearing stream.";
    if (!checkArtefacts) return "Repair: divergence caused by different ascendants belongs in Check before Resolve.";
    return scenario.message;
  }, [checkArtefacts, routeFirst, rpCorroboratingOnly, scenario.message, weightOnlyIfCompound]);

  return (
    <div data-interactive="multi-system-prashna-synthesis-discipline" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Multi-system prashna synthesis</p>
            <h2 style={headingStyle}>Run Route before comparison, then classify the RP overlay correctly</h2>
            <p style={bodyStyle}>
              Adapt T2-13&apos;s six-step sequence to one prashna moment: KP may use a number-derived lagna while Parashari and Tajika use the moment-cast lagna.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveStep("route");
              setScenarioKey("lagnaMismatch");
              setRouteFirst(true);
              setWeightOnlyIfCompound(true);
              setRpCorroboratingOnly(true);
              setCheckArtefacts(true);
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
            <p style={eyebrowStyle}>Six-step sequence</p>
            <div style={segmentedStyle}>
              {(Object.keys(STEPS) as StepKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setActiveStep(key)} aria-pressed={activeStep === key} style={viewButtonStyle(activeStep === key)}>
                  {STEPS[key].label}
                </button>
              ))}
            </div>
          </div>
          <SynthesisDiagram activeStep={activeStep} scenario={scenario} mismatch={lagnaMismatch} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: step.color }}>
            {step.icon}
            <p style={eyebrowStyle}>{step.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{step.detail}</h3>
          <p style={bodyStyle}>{scenario.message}</p>
          <div style={{ ...noticeStyle(lagnaMismatch ? VERMILION : GREEN), marginTop: "1rem" }}>
            <MapPinned size={18} />
            <span>{lagnaMismatch ? "Lagna-source mismatch: translate before comparing house numbers." : "Lagna source matches; comparison can proceed with method boundaries intact."}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Scenario selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setScenarioKey(key)} aria-pressed={scenarioKey === key} style={choiceButtonStyle(scenarioKey === key, SCENARIOS[key].compound ? GOLD : BLUE)}>
                <Route size={16} />
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{SCENARIOS[key].label}</span>
                  <span style={smallTextStyle}>{SCENARIOS[key].matter}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Lagna-source test</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.85rem" }}>
            <LagnaCard label="KP horary" value={scenario.kpLagna} body="Number-derived ascendant" color={BLUE} />
            <LagnaCard label="Parashari / Tajika" value={scenario.momentLagna} body="Moment-cast ascendant" color={GREEN} />
          </div>
          <div style={{ ...noticeStyle(lagnaMismatch ? VERMILION : GREEN), marginTop: "0.85rem" }}>
            <GitCompare size={18} />
            <span>{lagnaMismatch ? "Different house-1 seats can make the same house number point to different signs." : "Same lagna source removes this specific Route artefact."}</span>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline safeguards</p>
        <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
          <ToggleRow checked={routeFirst} onChange={setRouteFirst} label="Route before comparison" body="Never compare Nth-house findings before checking lagna source." icon={<Route size={16} />} />
          <ToggleRow checked={weightOnlyIfCompound} onChange={setWeightOnlyIfCompound} label="Use Weight only when compound" body="A screened prashna usually has one bounded matter." icon={<Scale size={16} />} />
          <ToggleRow checked={rpCorroboratingOnly} onChange={setRpCorroboratingOnly} label="RP overlay is corroborating only" body="It enters Classify, not as a fourth verdict-bearing stream." icon={<BadgeCheck size={16} />} />
          <ToggleRow checked={checkArtefacts} onChange={setCheckArtefacts} label="Check lagna artefacts" body="A divergence from different ascendants may not be a true disagreement." icon={<ShieldCheck size={16} />} />
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Synthesis discipline check</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "Six-step prashna adaptation held cleanly" : "Repair the synthesis discipline"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MultiSystemPrashnaSynthesisDiscipline;

function SynthesisDiagram({ activeStep, scenario, mismatch }: { activeStep: StepKey; scenario: (typeof SCENARIOS)[ScenarioKey]; mismatch: boolean }) {
  const keys = Object.keys(STEPS) as StepKey[];
  return (
    <svg viewBox="0 0 820 470" role="img" aria-label="Multi-system prashna six-step synthesis diagram" style={{ width: "100%", minHeight: 370, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="450" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Route, Weight, Classify, Check, Resolve, Rank for one prashna moment</text>
      {keys.map((key, index) => {
        const step = STEPS[key];
        const active = key === activeStep;
        const x = 66 + index * 123;
        return (
          <g key={key}>
            <rect x={x} y="88" width="104" height="68" rx="8" fill={active ? softFill(step.color) : "#FFFFFF"} stroke={active ? step.color : HAIRLINE} strokeWidth={active ? 1.8 : 1.1} />
            <text x={x + 52} y="116" textAnchor="middle" fill={active ? step.color : INK_SECONDARY} fontSize="11" fontWeight="500">{step.label}</text>
            <text x={x + 52} y="136" textAnchor="middle" fill={INK_MUTED} fontSize="9">{index + 1}</text>
            {index < keys.length - 1 && <path d={`M${x + 104} 122 L${x + 123} 122`} stroke={HAIRLINE} strokeWidth="1.6" strokeDasharray="5 5" />}
          </g>
        );
      })}
      <rect x="116" y="232" width="242" height="86" rx="8" fill={softFill(BLUE)} stroke={BLUE} />
      <text x="237" y="262" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="500">KP number-derived lagna</text>
      <text x="237" y="286" textAnchor="middle" fill={INK_MUTED} fontSize="10">{scenario.kpLagna}</text>
      <rect x="462" y="232" width="242" height="86" rx="8" fill={softFill(GREEN)} stroke={GREEN} />
      <text x="583" y="262" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="500">Moment-cast lagna</text>
      <text x="583" y="286" textAnchor="middle" fill={INK_MUTED} fontSize="10">{scenario.momentLagna}</text>
      <path d="M358 276 L462 276" stroke={mismatch ? VERMILION : GREEN} strokeWidth="2.4" strokeDasharray="6 7" />
      <rect x="242" y="378" width="336" height="36" rx="8" fill={mismatch ? softFill(VERMILION) : softFill(GREEN)} stroke={mismatch ? VERMILION : GREEN} />
      <text x="410" y="400" textAnchor="middle" fill={mismatch ? VERMILION : GREEN} fontSize="11.5" fontWeight="500">{mismatch ? "Route flag: translate before comparison" : "Route clear: compare with method boundaries"}</text>
    </svg>
  );
}

function LagnaCard({ label, value, body, color }: { label: string; value: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, background: softFill(color), padding: "0.75rem" }}>
      <p style={{ margin: 0, color, fontSize: "0.82rem", fontWeight: 500 }}>{label}: {value}</p>
      <p style={{ ...smallTextStyle, margin: "0.25rem 0 0" }}>{body}</p>
    </div>
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
