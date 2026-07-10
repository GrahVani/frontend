"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Activity, HeartPulse, Orbit, RotateCcw, ShieldCheck, Stethoscope, Swords, TriangleAlert } from "lucide-react";

type ScenarioId = "chartH1" | "strongLord" | "weakLord" | "occupantError" | "medicalConcern";
type FocusMode = "double" | "inversion" | "scorecard" | "occupants" | "boundary";
type Strength = "strong" | "mixed" | "weak";
type OccupantTone = "supportive" | "mixed" | "stressed";

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

const SCENARIOS: Record<
  ScenarioId,
  {
    label: string;
    title: string;
    houseStrength: Strength;
    lordStrength: Strength;
    occupantTone: OccupantTone;
    inversionApplied: boolean;
    acuteChronicGuard: boolean;
    medicalRoute: boolean;
    occupantDecisive: boolean;
    color: string;
    context: string;
  }
> = {
  chartH1: {
    label: "Chart H1",
    title: "Mixed 6th lord, honest recovery reading",
    houseStrength: "mixed",
    lordStrength: "weak",
    occupantTone: "mixed",
    inversionApplied: true,
    acuteChronicGuard: true,
    medicalRoute: true,
    occupantDecisive: false,
    color: GOLD,
    context: "Mars rules the 6th and sits angular in the 1st, but combustion and enemy-sign dignity make the recovery testimony mixed rather than effortless.",
  },
  strongLord: {
    label: "Strong lord",
    title: "Strong dusthana lord inverts favorably",
    houseStrength: "strong",
    lordStrength: "strong",
    occupantTone: "supportive",
    inversionApplied: true,
    acuteChronicGuard: true,
    medicalRoute: true,
    occupantDecisive: false,
    color: GREEN,
    context: "A well-dignified, unafflicted 6th lord describes capacity to meet struggle well. The difficulty is managed, not magically removed.",
  },
  weakLord: {
    label: "Weak lord",
    title: "Susceptibility needs careful wording",
    houseStrength: "weak",
    lordStrength: "weak",
    occupantTone: "stressed",
    inversionApplied: true,
    acuteChronicGuard: true,
    medicalRoute: true,
    occupantDecisive: false,
    color: VERMILION,
    context: "Weak house and weak lord testimony lean toward slower recovery or recurring strain. The output still remains tendency language, never diagnosis.",
  },
  occupantError: {
    label: "Occupant error",
    title: "One 6th-house planet is over-weighted",
    houseStrength: "mixed",
    lordStrength: "strong",
    occupantTone: "stressed",
    inversionApplied: true,
    acuteChronicGuard: true,
    medicalRoute: true,
    occupantDecisive: true,
    color: PURPLE,
    context: "A stressed occupant is vivid, but the lesson says occupants modulate. They do not settle the disease and recovery reading by themselves.",
  },
  medicalConcern: {
    label: "Medical concern",
    title: "A symptom question must be routed out",
    houseStrength: "strong",
    lordStrength: "strong",
    occupantTone: "supportive",
    inversionApplied: true,
    acuteChronicGuard: false,
    medicalRoute: false,
    occupantDecisive: false,
    color: BLUE,
    context: "The client asks about a real symptom or undiagnosed condition. The chart can provide context only after medical assessment, not instead of it.",
  },
};

const FOCUS_COPY: Record<FocusMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  double: {
    label: "Double role",
    title: "The 6th is disease and resistance",
    body: "Read susceptibility and immunity together. A dusthana is a struggle register, not an automatic defeat verdict.",
    icon: <Swords size={16} />,
    color: BLUE,
  },
  inversion: {
    label: "Inversion",
    title: "A strong 6th lord can be favorable",
    body: "Strength in the lord of the 6th often means the chart meets the 6th-house difficulty well.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  scorecard: {
    label: "Scorecard",
    title: "House and lord must converge or diverge honestly",
    body: "Assess 6th house testimony, 6th lord dignity, and affliction before giving valence.",
    icon: <Orbit size={16} />,
    color: GOLD,
  },
  occupants: {
    label: "Occupants",
    title: "Occupants modulate the reading",
    body: "Planets in the 6th add tone to susceptibility and recovery. They are never the whole answer.",
    icon: <Activity size={16} />,
    color: PURPLE,
  },
  boundary: {
    label: "Boundary",
    title: "No diagnosis, no acute or chronic prediction",
    body: "Acute versus chronic language is contextual vocabulary for medically known conditions, not a forecast for a hypothetical illness.",
    icon: <Stethoscope size={16} />,
    color: VERMILION,
  },
};

export function SixthHouseDiseaseRecoveryWorkbench() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("chartH1");
  const [focusMode, setFocusMode] = useState<FocusMode>("double");
  const [houseStrength, setHouseStrength] = useState<Strength>("mixed");
  const [lordStrength, setLordStrength] = useState<Strength>("weak");
  const [occupantTone, setOccupantTone] = useState<OccupantTone>("mixed");
  const [inversionApplied, setInversionApplied] = useState(true);
  const [acuteChronicGuard, setAcuteChronicGuard] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);
  const [occupantDecisive, setOccupantDecisive] = useState(false);

  const scenario = SCENARIOS[scenarioId];
  const recoveryScore = Math.max(
    4,
    Math.min(
      96,
      strengthScore(houseStrength) +
        strengthScore(lordStrength) +
        occupantScore(occupantTone) +
        (inversionApplied ? 16 : -26) +
        (acuteChronicGuard ? 10 : -28) +
        (medicalRoute ? 10 : -32) -
        (occupantDecisive ? 24 : 0),
    ),
  );

  const susceptibilityScore = Math.max(4, Math.min(96, 100 - recoveryScore + (occupantTone === "stressed" ? 12 : 0)));

  const verdict = useMemo(() => {
    if (!medicalRoute || !acuteChronicGuard) return { label: "scope repair needed", color: VERMILION };
    if (!inversionApplied) return { label: "dusthana inversion missing", color: VERMILION };
    if (occupantDecisive) return { label: "occupant over-weighted", color: GOLD };
    if (recoveryScore >= 72) return { label: "strong recovery capacity tendency", color: GREEN };
    if (recoveryScore >= 44) return { label: "mixed susceptibility and recovery", color: GOLD };
    return { label: "more effortful recovery tendency", color: BLUE };
  }, [acuteChronicGuard, inversionApplied, medicalRoute, occupantDecisive, recoveryScore]);

  const statement = useMemo(() => {
    if (!medicalRoute) return "Route the health concern to medical assessment first. The 6th-house reading cannot diagnose, triage symptoms, or replace care.";
    if (!acuteChronicGuard) return "Repair the scope: acute versus chronic is contextual language for known medical facts, not a prediction for an unknown future condition.";
    if (!inversionApplied) return "Apply the dusthana-lord inversion. A strong 6th lord often describes better ability to overcome the 6th-house struggle.";
    if (occupantDecisive) return "Reduce the occupant weight. A planet in the 6th modulates the reading, while house and lord testimony still carry the structure.";
    if (recoveryScore >= 72) return "This supports a tendency toward meeting struggle well: immunity and recovery capacity are emphasized, while disease absence is not guaranteed.";
    if (recoveryScore >= 44) return "This is a mixed 6th-house picture. Name the supportive and stressed factors without smoothing the divergence.";
    return "This leans toward more effortful recovery or susceptibility. Keep the language gentle, contextual, and medically deferential.";
  }, [acuteChronicGuard, inversionApplied, medicalRoute, occupantDecisive, recoveryScore]);

  function loadScenario(id: ScenarioId) {
    const next = SCENARIOS[id];
    setScenarioId(id);
    setHouseStrength(next.houseStrength);
    setLordStrength(next.lordStrength);
    setOccupantTone(next.occupantTone);
    setInversionApplied(next.inversionApplied);
    setAcuteChronicGuard(next.acuteChronicGuard);
    setMedicalRoute(next.medicalRoute);
    setOccupantDecisive(next.occupantDecisive);
  }

  return (
    <div data-interactive="sixth-house-disease-recovery-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>6th house health workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GREEN, fontSize: "1.28rem", fontWeight: 600 }}>
              Read disease, immunity, and recovery without crossing into diagnosis
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Build the 6th-house scorecard, apply the strong-dusthana-lord inversion, and keep every output in medically deferential tendency language.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusMode("double"); loadScenario("chartH1"); }} style={buttonStyle(false, GREEN)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button key={id} type="button" aria-pressed={scenarioId === id} onClick={() => loadScenario(id)} style={buttonStyle(scenarioId === id, SCENARIOS[id].color)}>
              <Activity size={16} aria-hidden="true" />
              {SCENARIOS[id].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${scenario.color}55`, borderRadius: 8, background: `${scenario.color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: scenario.color, fontSize: "1.06rem", fontWeight: 600 }}>{scenario.title}</h3>
          <p style={bodyTextStyle}>{scenario.context}</p>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS_COPY) as FocusMode[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={focusMode === mode} onClick={() => setFocusMode(mode)} style={buttonStyle(focusMode === mode, FOCUS_COPY[mode].color)}>
              {FOCUS_COPY[mode].icon}
              {FOCUS_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${FOCUS_COPY[focusMode].color}55`, borderRadius: 8, background: `${FOCUS_COPY[focusMode].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: FOCUS_COPY[focusMode].color, fontSize: "1.05rem", fontWeight: 600 }}>{FOCUS_COPY[focusMode].title}</h3>
          <p style={bodyTextStyle}>{FOCUS_COPY[focusMode].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Susceptibility and recovery balance</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <span style={{ color: verdict.color, fontWeight: 600 }}>{recoveryScore}% recovery tendency</span>
          </div>
          <SixthHouseSvg
            recoveryScore={recoveryScore}
            susceptibilityScore={susceptibilityScore}
            lordStrength={lordStrength}
            occupantTone={occupantTone}
            safeFrame={medicalRoute && acuteChronicGuard && inversionApplied && !occupantDecisive}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="6th house" body={houseStrength} color={strengthColor(houseStrength)} icon={<Orbit size={16} />} />
            <MiniFact title="6th lord" body={lordStrength} color={strengthColor(lordStrength)} icon={<ShieldCheck size={16} />} />
            <MiniFact title="Occupants" body={occupantTone} color={occupantColor(occupantTone)} icon={<Activity size={16} />} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Scorecard controls</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <StrengthPicker title="6th house testimony" value={houseStrength} onChange={setHouseStrength} />
            <StrengthPicker title="6th lord strength" value={lordStrength} onChange={setLordStrength} />
            <OccupantPicker value={occupantTone} onChange={setOccupantTone} />
          </div>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Interpretive discipline</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={inversionApplied} color={inversionApplied ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Strong dusthana lord inversion" body={inversionApplied ? "Strong 6th lord supports recovery capacity." : "Strong 6th lord is being read as simply bad."} onClick={() => setInversionApplied((value) => !value)} />
            <Toggle active={!occupantDecisive} color={!occupantDecisive ? GREEN : GOLD} icon={<Activity size={18} />} title="Occupants modulate only" body={!occupantDecisive ? "House and lord still carry the structure." : "One occupant is deciding the reading."} onClick={() => setOccupantDecisive((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Medical boundary</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={acuteChronicGuard} color={acuteChronicGuard ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Acute and chronic guard" body={acuteChronicGuard ? "Contextual only, not a future illness forecast." : "Acute or chronic is being predicted."} onClick={() => setAcuteChronicGuard((value) => !value)} />
            <Toggle active={medicalRoute} color={medicalRoute ? GREEN : VERMILION} icon={<HeartPulse size={18} />} title="Medical assessment routed" body={medicalRoute ? "Symptoms and diagnosis stay medical." : "Chart is replacing medical care."} onClick={() => setMedicalRoute((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdict.color}66`, background: `${verdict.color}10` }}>
        <p style={eyebrowStyle}>Practice statement</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
      </section>
    </div>
  );
}

function SixthHouseSvg({
  recoveryScore,
  susceptibilityScore,
  lordStrength,
  occupantTone,
  safeFrame,
}: {
  recoveryScore: number;
  susceptibilityScore: number;
  lordStrength: Strength;
  occupantTone: OccupantTone;
  safeFrame: boolean;
}) {
  const recoveryWidth = Math.max(28, recoveryScore * 4.4);
  const susceptibilityWidth = Math.max(28, susceptibilityScore * 4.4);
  return (
    <svg viewBox="0 0 760 410" role="img" aria-label="Sixth house disease immunity and recovery balance" style={{ width: "100%", minHeight: 310, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="724" height="374" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="52" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">6TH HOUSE: STRUGGLE REGISTER AND RECOVERY REGISTER</text>

      <circle cx="190" cy="150" r="54" fill={`${VERMILION}14`} stroke={VERMILION} strokeWidth="3" />
      <text x="190" y="145" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight="600">Susceptibility</text>
      <text x="190" y="166" textAnchor="middle" fill={INK_MUTED} fontSize="11">disease and struggle</text>

      <circle cx="570" cy="150" r="54" fill={`${GREEN}14`} stroke={GREEN} strokeWidth="3" />
      <text x="570" y="145" textAnchor="middle" fill={GREEN} fontSize="13" fontWeight="600">Recovery</text>
      <text x="570" y="166" textAnchor="middle" fill={INK_MUTED} fontSize="11">immunity and resistance</text>

      <line x1="250" y1="150" x2="510" y2="150" stroke={HAIRLINE} strokeWidth="5" />
      <path d="M 260 150 C 330 94, 430 94, 500 150" fill="none" stroke={lordStrength === "strong" ? GREEN : lordStrength === "mixed" ? GOLD : VERMILION} strokeWidth="5" strokeLinecap="round" />
      <text x="380" y="102" textAnchor="middle" fill={strengthColor(lordStrength)} fontSize="12" fontWeight="600">6th lord: {lordStrength}</text>

      <rect x="138" y="244" width={susceptibilityWidth} height="34" rx="8" fill={`${VERMILION}20`} stroke={VERMILION} />
      <text x="148" y="266" fill={VERMILION} fontSize="12" fontWeight="600">susceptibility {susceptibilityScore}%</text>
      <rect x="138" y="294" width={recoveryWidth} height="34" rx="8" fill={`${GREEN}20`} stroke={GREEN} />
      <text x="148" y="316" fill={GREEN} fontSize="12" fontWeight="600">recovery {recoveryScore}%</text>

      <rect x="468" y="244" width="170" height="84" rx="8" fill={`${occupantColor(occupantTone)}12`} stroke={occupantColor(occupantTone)} />
      <text x="553" y="272" textAnchor="middle" fill={occupantColor(occupantTone)} fontSize="12" fontWeight="600">Occupants</text>
      <text x="553" y="294" textAnchor="middle" fill={INK_MUTED} fontSize="11">{occupantTone} modulation</text>
      <text x="553" y="314" textAnchor="middle" fill={INK_MUTED} fontSize="11">not decisive alone</text>

      <text x="380" y="362" textAnchor="middle" fill={safeFrame ? GREEN : VERMILION} fontSize="12" fontWeight="600">
        {safeFrame ? "Output: tendency language with medical boundary intact" : "Output: repair the scope before reading"}
      </text>
    </svg>
  );
}

function StrengthPicker({ title, value, onChange }: { title: string; value: Strength; onChange: (value: Strength) => void }) {
  return (
    <div style={{ border: `1px solid ${strengthColor(value)}44`, borderRadius: 8, background: `${strengthColor(value)}10`, padding: "0.7rem" }}>
      <span style={{ color: strengthColor(value), fontWeight: 600 }}>{title}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.55rem" }}>
        {(["strong", "mixed", "weak"] as Strength[]).map((mode) => (
          <button key={mode} type="button" aria-pressed={value === mode} onClick={() => onChange(mode)} style={buttonStyle(value === mode, strengthColor(mode))}>
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}

function OccupantPicker({ value, onChange }: { value: OccupantTone; onChange: (value: OccupantTone) => void }) {
  return (
    <div style={{ border: `1px solid ${occupantColor(value)}44`, borderRadius: 8, background: `${occupantColor(value)}10`, padding: "0.7rem" }}>
      <span style={{ color: occupantColor(value), fontWeight: 600 }}>6th-house occupants</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.55rem" }}>
        {(["supportive", "mixed", "stressed"] as OccupantTone[]).map((mode) => (
          <button key={mode} type="button" aria-pressed={value === mode} onClick={() => onChange(mode)} style={buttonStyle(value === mode, occupantColor(mode))}>
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.65rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color }}>
        {icon}
        <span style={{ fontSize: "0.86rem", fontWeight: 600 }}>{title}</span>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 600,
};

const bodyTextStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.92rem",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.75rem",
    minHeight: 38,
    display: "inline-flex",
    gap: "0.45rem",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
  };
}

function strengthScore(value: Strength) {
  if (value === "strong") return 24;
  if (value === "mixed") return 14;
  return 4;
}

function strengthColor(value: Strength) {
  if (value === "strong") return GREEN;
  if (value === "mixed") return GOLD;
  return VERMILION;
}

function occupantScore(value: OccupantTone) {
  if (value === "supportive") return 20;
  if (value === "mixed") return 12;
  return 4;
}

function occupantColor(value: OccupantTone) {
  if (value === "supportive") return GREEN;
  if (value === "mixed") return PURPLE;
  return VERMILION;
}
