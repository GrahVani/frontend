"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Activity, HeartPulse, Orbit, RotateCcw, ShieldCheck, Sun, TriangleAlert } from "lucide-react";

type ScenarioId = "chartH1" | "strongLagnaWeakLord" | "weakLagnaStrongSun" | "healthGuarantee" | "medicalConcern";
type ViewMode = "constitution" | "lagna" | "lord" | "sun" | "boundary";
type Strength = "strong" | "mixed" | "weak";

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
    lagnaStrength: Strength;
    lordStrength: Strength;
    sunStrength: Strength;
    sunCoincides: boolean;
    medicalConcern: boolean;
    guaranteeClaim: boolean;
    color: string;
    context: string;
  }
> = {
  chartH1: {
    label: "Chart H1",
    title: "Convergent steady constitution",
    lagnaStrength: "mixed",
    lordStrength: "strong",
    sunStrength: "mixed",
    sunCoincides: true,
    medicalConcern: false,
    guaranteeClaim: false,
    color: GREEN,
    context: "Gemini lagna, Mercury in the 9th unafflicted, and Sun in the 1st. Clean, steady, mutually supportive testimony.",
  },
  strongLagnaWeakLord: {
    label: "Divergent lord",
    title: "Strong lagna but compromised lagna lord",
    lagnaStrength: "strong",
    lordStrength: "weak",
    sunStrength: "mixed",
    sunCoincides: false,
    medicalConcern: false,
    guaranteeClaim: false,
    color: GOLD,
    context: "The body register looks supported, but the lagna lord is poorly placed or afflicted, so the reading must name tension.",
  },
  weakLagnaStrongSun: {
    label: "Strong Sun",
    title: "Weak lagna pattern with Sun support",
    lagnaStrength: "weak",
    lordStrength: "mixed",
    sunStrength: "strong",
    sunCoincides: false,
    medicalConcern: false,
    guaranteeClaim: false,
    color: BLUE,
    context: "The lagna/lord are not clean, but the natural health significator is strong. This is a mixed constitution reading, not a diagnosis.",
  },
  healthGuarantee: {
    label: "Guarantee error",
    title: "Strong lagna is misread as no illness",
    lagnaStrength: "strong",
    lordStrength: "strong",
    sunStrength: "strong",
    sunCoincides: false,
    medicalConcern: false,
    guaranteeClaim: true,
    color: VERMILION,
    context: "The practitioner turns constitutional strength into a health guarantee, which the lesson explicitly forbids.",
  },
  medicalConcern: {
    label: "Medical concern",
    title: "A symptom or health question needs medical assessment",
    lagnaStrength: "strong",
    lordStrength: "mixed",
    sunStrength: "mixed",
    sunCoincides: false,
    medicalConcern: true,
    guaranteeClaim: false,
    color: PURPLE,
    context: "The client asks whether a real symptom is serious. A constitutional reading cannot replace medical assessment.",
  },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  constitution: {
    label: "Constitution",
    title: "The 1st house is vitality, not diagnosis",
    body: "Lagna shows baseline resilience, recovery capacity, and general constitutional tone. It does not name disease.",
    icon: <Activity size={16} />,
    color: BLUE,
  },
  lagna: {
    label: "Lagna",
    title: "Read the lagna itself",
    body: "The sign, occupants, and aspects on the ascendant form the direct body-register testimony.",
    icon: <Orbit size={16} />,
    color: PURPLE,
  },
  lord: {
    label: "Lord",
    title: "Trace the lagna lord",
    body: "Dignity, placement, combustion, affliction, and cancellation checks shape the constitutional reading.",
    icon: <ShieldCheck size={16} />,
    color: GOLD,
  },
  sun: {
    label: "Sun",
    title: "Sun is read alongside the lagna",
    body: "The Sun is the natural health significator. If it coincides with lagna or lagna lord, count it once.",
    icon: <Sun size={16} />,
    color: GREEN,
  },
  boundary: {
    label: "Boundary",
    title: "Constitution is not a medical verdict",
    body: "No disease naming, no health guarantee, no timing of illness or death, and no override of medical care.",
    icon: <HeartPulse size={16} />,
    color: VERMILION,
  },
};

export function FirstHouseVitalityPhysiqueWorkbench() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("chartH1");
  const [viewMode, setViewMode] = useState<ViewMode>("constitution");
  const [lagnaStrength, setLagnaStrength] = useState<Strength>("mixed");
  const [lordStrength, setLordStrength] = useState<Strength>("strong");
  const [sunStrength, setSunStrength] = useState<Strength>("mixed");
  const [sunCoincides, setSunCoincides] = useState(true);
  const [countSunOnce, setCountSunOnce] = useState(true);
  const [constitutionalFrame, setConstitutionalFrame] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);
  const [guaranteeClaim, setGuaranteeClaim] = useState(false);

  const scenario = SCENARIOS[scenarioId];
  const score = Math.max(
    5,
    Math.min(
      96,
      strengthScore(lagnaStrength) +
        strengthScore(lordStrength) +
        strengthScore(sunStrength) +
        (sunCoincides && !countSunOnce ? -18 : 0) +
        (constitutionalFrame ? 12 : -22) +
        (medicalRoute ? 8 : -28) -
        (guaranteeClaim ? 35 : 0),
    ),
  );

  const verdict = useMemo(() => {
    if (guaranteeClaim || !constitutionalFrame) return { label: "scope warning", color: VERMILION };
    if (!medicalRoute) return { label: "medical boundary missing", color: VERMILION };
    if (sunCoincides && !countSunOnce) return { label: "double-counting warning", color: GOLD };
    if (score >= 72) return { label: "resilient constitutional tendency", color: GREEN };
    if (score >= 45) return { label: "mixed constitutional tendency", color: GOLD };
    return { label: "fragile baseline tendency", color: BLUE };
  }, [constitutionalFrame, countSunOnce, guaranteeClaim, medicalRoute, score, sunCoincides]);

  const statement = useMemo(() => {
    if (guaranteeClaim || !constitutionalFrame) return "Repair the frame: strong lagna means resilience tendency, not disease absence or a health guarantee.";
    if (!medicalRoute) return "Pause: symptoms, diagnosis, treatment, and medical risk belong with a physician.";
    if (sunCoincides && !countSunOnce) return "Count the Sun once. When karaka and lagna/lord coincide, it is one witness, not two independent confirmations.";
    if (score >= 72) return "This indicates a generally resilient constitutional baseline, useful as context for later health houses, but not a medical verdict.";
    if (score >= 45) return "The constitution picture is mixed. Name both supportive and stressed factors, and avoid turning it into diagnosis.";
    return "The baseline looks more effortful or fragile, so speak gently and keep all medical questions routed to medical assessment.";
  }, [constitutionalFrame, countSunOnce, guaranteeClaim, medicalRoute, score, sunCoincides]);

  function loadScenario(id: ScenarioId) {
    const next = SCENARIOS[id];
    setScenarioId(id);
    setLagnaStrength(next.lagnaStrength);
    setLordStrength(next.lordStrength);
    setSunStrength(next.sunStrength);
    setSunCoincides(next.sunCoincides);
    setCountSunOnce(true);
    setConstitutionalFrame(!next.guaranteeClaim);
    setMedicalRoute(!next.medicalConcern);
    setGuaranteeClaim(next.guaranteeClaim);
  }

  return (
    <div data-interactive="first-house-vitality-physique-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>1st house vitality</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>Read constitution without turning it into diagnosis</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Inspect lagna, lagna lord, and Sun as constitutional witnesses, then keep the boundary between vitality tendency and medical assessment clear.
            </p>
          </div>
          <button type="button" onClick={() => { setViewMode("constitution"); loadScenario("chartH1"); }} style={buttonStyle(false, PURPLE)}>
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
          <h3 style={{ margin: 0, color: scenario.color, fontSize: "1.08rem", fontWeight: 600 }}>{scenario.title}</h3>
          <p style={bodyTextStyle}>{scenario.context}</p>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(VIEW_COPY) as ViewMode[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={viewMode === mode} onClick={() => setViewMode(mode)} style={buttonStyle(viewMode === mode, VIEW_COPY[mode].color)}>
              {VIEW_COPY[mode].icon}
              {VIEW_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${VIEW_COPY[viewMode].color}55`, borderRadius: 8, background: `${VIEW_COPY[viewMode].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: VIEW_COPY[viewMode].color, fontSize: "1.05rem", fontWeight: 600 }}>{VIEW_COPY[viewMode].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[viewMode].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Constitution scorecard</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <span style={{ color: verdict.color, fontWeight: 600 }}>{score}% tendency</span>
          </div>
          <VitalitySvg lagnaStrength={lagnaStrength} lordStrength={lordStrength} sunStrength={sunStrength} safeFrame={constitutionalFrame && medicalRoute && !guaranteeClaim} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Lagna" body={lagnaStrength} color={strengthColor(lagnaStrength)} icon={<Orbit size={16} />} />
            <MiniFact title="Lagna lord" body={lordStrength} color={strengthColor(lordStrength)} icon={<ShieldCheck size={16} />} />
            <MiniFact title="Sun" body={sunStrength} color={strengthColor(sunStrength)} icon={<Sun size={16} />} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Witness controls</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <StrengthPicker title="Lagna itself" value={lagnaStrength} onChange={setLagnaStrength} />
            <StrengthPicker title="Lagna lord" value={lordStrength} onChange={setLordStrength} />
            <StrengthPicker title="Sun as health significator" value={sunStrength} onChange={setSunStrength} />
          </div>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Counting discipline</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={sunCoincides} color={sunCoincides ? GOLD : BLUE} icon={<Sun size={18} />} title="Sun coincides with lagna/lord" body={sunCoincides ? "Count it as one witness." : "Sun is a separate witness."} onClick={() => setSunCoincides((value) => !value)} />
            <Toggle active={countSunOnce} color={countSunOnce ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Count Sun once when coincident" body={countSunOnce ? "No double-counting." : "Sun is being over-counted."} onClick={() => setCountSunOnce((value) => !value)} />
            <Toggle active={constitutionalFrame} color={constitutionalFrame ? GREEN : VERMILION} icon={<Activity size={18} />} title="Constitutional framing" body={constitutionalFrame ? "Resilience tendency, not diagnosis." : "Reading is becoming medicalized."} onClick={() => setConstitutionalFrame((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Health boundary</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={medicalRoute} color={medicalRoute ? GREEN : VERMILION} icon={<HeartPulse size={18} />} title="Medical assessment routed" body={medicalRoute ? "Symptoms and diagnosis stay medical." : "Chart is replacing medical care."} onClick={() => setMedicalRoute((value) => !value)} />
            <Toggle active={guaranteeClaim} color={guaranteeClaim ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Health guarantee claim" body={guaranteeClaim ? "Error active: strong lagna means no illness." : "No disease-absence guarantee."} onClick={() => setGuaranteeClaim((value) => !value)} />
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

function VitalitySvg({ lagnaStrength, lordStrength, sunStrength, safeFrame }: { lagnaStrength: Strength; lordStrength: Strength; sunStrength: Strength; safeFrame: boolean }) {
  const nodes = [
    { label: "Lagna", value: lagnaStrength, x: 110, color: strengthColor(lagnaStrength) },
    { label: "Lord", value: lordStrength, x: 280, color: strengthColor(lordStrength) },
    { label: "Sun", value: sunStrength, x: 450, color: strengthColor(sunStrength) },
    { label: "Frame", value: safeFrame ? "safe" : "repair", x: 620, color: safeFrame ? GREEN : VERMILION },
  ];
  return (
    <svg viewBox="0 0 760 390" role="img" aria-label="First house vitality scorecard flow" style={{ width: "100%", minHeight: 300, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="724" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="52" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">CONSTITUTIONAL WITNESSES, NOT DIAGNOSIS</text>
      <line x1="110" y1="145" x2="620" y2="145" stroke={HAIRLINE} strokeWidth="4" />
      {nodes.map((node, index) => (
        <g key={node.label}>
          {index < nodes.length - 1 ? <path d={`M ${node.x + 45} 145 L ${nodes[index + 1].x - 50} 145`} stroke={node.color} strokeWidth="3" opacity="0.55" /> : null}
          <circle cx={node.x} cy="145" r="40" fill={`${node.color}16`} stroke={node.color} strokeWidth="2.5" />
          <text x={node.x} y="142" textAnchor="middle" fill={node.color} fontSize="11" fontWeight="600">{node.label}</text>
          <text x={node.x} y="163" textAnchor="middle" fill={INK_MUTED} fontSize="10">{node.value}</text>
        </g>
      ))}
      <rect x="98" y="240" width="250" height="56" rx="8" fill={`${strengthColor(lagnaStrength)}12`} stroke={strengthColor(lagnaStrength)} />
      <text x="223" y="263" textAnchor="middle" fill={strengthColor(lagnaStrength)} fontSize="12" fontWeight="600">Body register</text>
      <text x="223" y="283" textAnchor="middle" fill={INK_MUTED} fontSize="11">lagna plus lagna lord</text>
      <rect x="420" y="240" width="250" height="56" rx="8" fill={`${safeFrame ? GREEN : VERMILION}12`} stroke={safeFrame ? GREEN : VERMILION} />
      <text x="545" y="263" textAnchor="middle" fill={safeFrame ? GREEN : VERMILION} fontSize="12" fontWeight="600">Output boundary</text>
      <text x="545" y="283" textAnchor="middle" fill={INK_MUTED} fontSize="11">{safeFrame ? "tendency only" : "scope repair"}</text>
      <text x="380" y="330" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">Strong vitality is useful context; clinical reality always belongs to medical assessment.</text>
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
