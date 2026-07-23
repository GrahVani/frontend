"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Building2, CircleDot, Compass, Home, LandPlot, Moon, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";

type ScenarioId = "chartP1" | "moonError" | "educationThread" | "weakExample" | "overstatedMars";
type FocusMode = "thread" | "method" | "chart" | "karakas" | "synthesis";
type Strength = "strong" | "mixed" | "weak";
type KarakaMode = "property" | "moon" | "education" | "vehicle";

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
    lordStrength: Strength;
    occupantStrength: Strength;
    aspectStrength: Strength;
    karakaStrength: Strength;
    karakaMode: KarakaMode;
    qualitativeConvergence: boolean;
    processComplication: boolean;
    color: string;
    context: string;
  }
> = {
  chartP1: {
    label: "Chart P1",
    title: "Strong property capacity with process friction",
    lordStrength: "mixed",
    occupantStrength: "strong",
    aspectStrength: "strong",
    karakaStrength: "strong",
    karakaMode: "property",
    qualitativeConvergence: true,
    processComplication: true,
    color: GOLD,
    context: "Libra lagna gives Capricorn as the 4th. Mars is exalted in the 4th, Moon and Jupiter aspect from the 10th, while Saturn as 4th lord sits in the 8th.",
  },
  moonError: {
    label: "Moon error",
    title: "The mother and comfort thread is being used for land",
    lordStrength: "mixed",
    occupantStrength: "strong",
    aspectStrength: "strong",
    karakaStrength: "mixed",
    karakaMode: "moon",
    qualitativeConvergence: true,
    processComplication: true,
    color: VERMILION,
    context: "The Moon is generally important for the 4th, but a property question routes to Mars and Saturn, not the mother and comfort thread.",
  },
  educationThread: {
    label: "Education",
    title: "The right house, wrong live thread",
    lordStrength: "mixed",
    occupantStrength: "mixed",
    aspectStrength: "mixed",
    karakaStrength: "mixed",
    karakaMode: "education",
    qualitativeConvergence: false,
    processComplication: false,
    color: BLUE,
    context: "Mercury belongs to the education facet of the 4th. It should not drive a land-and-property reading unless the question changes.",
  },
  weakExample: {
    label: "Weak chart",
    title: "Weak occupant, weak lord, little support",
    lordStrength: "weak",
    occupantStrength: "weak",
    aspectStrength: "weak",
    karakaStrength: "weak",
    karakaMode: "property",
    qualitativeConvergence: false,
    processComplication: true,
    color: PURPLE,
    context: "This mirrors the lesson's second example: debilitated Saturn in the 4th, no benefic support, and a poorly placed 4th lord.",
  },
  overstatedMars: {
    label: "Double-count",
    title: "Mars convergence is treated as a numeric doubling",
    lordStrength: "mixed",
    occupantStrength: "strong",
    aspectStrength: "strong",
    karakaStrength: "strong",
    karakaMode: "property",
    qualitativeConvergence: false,
    processComplication: false,
    color: GREEN,
    context: "Mars as both occupant and karaka is a real qualitative convergence. It is not a literal two-times multiplier.",
  },
};

const FOCUS_COPY: Record<FocusMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  thread: {
    label: "Thread",
    title: "One house, different questions",
    body: "The 4th can speak to comfort, mother, education, vehicles, and property. The question selects the live thread.",
    icon: <Compass size={16} />,
    color: BLUE,
  },
  method: {
    label: "Method",
    title: "Use the four-step property method",
    body: "Read the 4th sign and lord, occupants, aspects, then Mars and Saturn as property karakas.",
    icon: <CircleDot size={16} />,
    color: GOLD,
  },
  chart: {
    label: "Chart P1",
    title: "Capricorn 4th with exalted Mars",
    body: "Mars in the 4th and benefic aspects show real property capacity, while Saturn in the 8th complicates process.",
    icon: <Home size={16} />,
    color: GREEN,
  },
  karakas: {
    label: "Karakas",
    title: "Mars primary, Saturn secondary",
    body: "For land, isolate Mars and Saturn. Moon, Mercury, and Venus belong to other 4th-house facets unless the question asks for them.",
    icon: <LandPlot size={16} />,
    color: PURPLE,
  },
  synthesis: {
    label: "Synthesis",
    title: "Do not collapse the mixed picture",
    body: "Strong Mars and benefic aspects are real; Saturn's 8th-house lordship complication is also real.",
    icon: <ShieldCheck size={16} />,
    color: VERMILION,
  },
};

export function FourthHousePropertyWorkbench() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("chartP1");
  const [focusMode, setFocusMode] = useState<FocusMode>("thread");
  const [lordStrength, setLordStrength] = useState<Strength>("mixed");
  const [occupantStrength, setOccupantStrength] = useState<Strength>("strong");
  const [aspectStrength, setAspectStrength] = useState<Strength>("strong");
  const [karakaStrength, setKarakaStrength] = useState<Strength>("strong");
  const [karakaMode, setKarakaMode] = useState<KarakaMode>("property");
  const [qualitativeConvergence, setQualitativeConvergence] = useState(true);
  const [processComplication, setProcessComplication] = useState(true);

  const scenario = SCENARIOS[scenarioId];
  const propertyScore = Math.max(
    6,
    Math.min(
      96,
      strengthScore(lordStrength) +
        strengthScore(occupantStrength) +
        strengthScore(aspectStrength) +
        strengthScore(karakaStrength) +
        (karakaMode === "property" ? 14 : -24) +
        (qualitativeConvergence ? 8 : -14) -
        (processComplication ? 10 : 0),
    ),
  );

  const verdict = useMemo(() => {
    if (karakaMode !== "property") return { label: "wrong 4th-house thread", color: VERMILION };
    if (!qualitativeConvergence && occupantStrength === "strong" && karakaStrength === "strong") return { label: "convergence needs calibration", color: GOLD };
    if (propertyScore >= 74 && processComplication) return { label: "strong capacity, complicated process", color: GOLD };
    if (propertyScore >= 74) return { label: "strong property support", color: GREEN };
    if (propertyScore >= 46) return { label: "mixed property picture", color: BLUE };
    return { label: "difficult property picture", color: PURPLE };
  }, [karakaMode, karakaStrength, occupantStrength, processComplication, propertyScore, qualitativeConvergence]);

  const statement = useMemo(() => {
    if (karakaMode !== "property") return "Repair the routing: property questions use Mars as primary karaka and Saturn as secondary karaka, not the Moon, Mercury, or Venus by default.";
    if (!qualitativeConvergence && occupantStrength === "strong" && karakaStrength === "strong") {
      return "Name Mars as a qualitative convergence because it is both occupant and land karaka, but do not turn that into a numeric doubling rule.";
    }
    if (propertyScore >= 74 && processComplication) {
      return "This supports substantial property capacity or desire, while Saturn's process-level complication points to paperwork, title, delay, inheritance, or completion friction.";
    }
    if (propertyScore >= 74) return "The four-step picture is broadly supportive for property, with house, aspects, and karaka condition agreeing.";
    if (propertyScore >= 46) return "The property reading is mixed. State the supportive and complicating factors separately before synthesizing.";
    return "The property indicators lean difficult. Frame it as a harder road requiring practical supports, not a fixed verdict.";
  }, [karakaMode, karakaStrength, occupantStrength, processComplication, propertyScore, qualitativeConvergence]);

  function loadScenario(id: ScenarioId) {
    const next = SCENARIOS[id];
    setScenarioId(id);
    setLordStrength(next.lordStrength);
    setOccupantStrength(next.occupantStrength);
    setAspectStrength(next.aspectStrength);
    setKarakaStrength(next.karakaStrength);
    setKarakaMode(next.karakaMode);
    setQualitativeConvergence(next.qualitativeConvergence);
    setProcessComplication(next.processComplication);
  }

  return (
    <div data-interactive="fourth-house-property-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>4th house property workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.28rem", fontWeight: 600 }}>
              Isolate the property thread, then weigh Chart P1 in four steps
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Route the question to Mars and Saturn, inspect the 4th house container, and hold strong property capacity alongside process friction when both are present.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusMode("thread"); loadScenario("chartP1"); }} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button key={id} type="button" aria-pressed={scenarioId === id} onClick={() => loadScenario(id)} style={buttonStyle(scenarioId === id, SCENARIOS[id].color)}>
              <Building2 size={16} aria-hidden="true" />
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

      <div style={chartWorkbenchGridStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Chart P1 property map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <span style={{ color: verdict.color, fontWeight: 600 }}>{propertyScore}% support</span>
          </div>
          <PropertyChartSvg
            lordStrength={lordStrength}
            occupantStrength={occupantStrength}
            aspectStrength={aspectStrength}
            karakaMode={karakaMode}
            processComplication={processComplication}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="4th lord" body={lordStrength} color={strengthColor(lordStrength)} icon={<CircleDot size={16} />} />
            <MiniFact title="Occupant" body={occupantStrength} color={strengthColor(occupantStrength)} icon={<LandPlot size={16} />} />
            <MiniFact title="Aspects" body={aspectStrength} color={strengthColor(aspectStrength)} icon={<Moon size={16} />} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Four-step controls</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <StrengthPicker title="4th lord condition" value={lordStrength} onChange={setLordStrength} />
            <StrengthPicker title="4th-house occupant" value={occupantStrength} onChange={setOccupantStrength} />
            <StrengthPicker title="Aspects on the 4th" value={aspectStrength} onChange={setAspectStrength} />
            <StrengthPicker title="Mars and Saturn condition" value={karakaStrength} onChange={setKarakaStrength} />
          </div>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Question-thread router</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            <KarakaButton mode="property" active={karakaMode === "property"} color={GREEN} icon={<LandPlot size={18} />} title="Property: Mars plus Saturn" body="Land and home-as-asset thread." onClick={() => setKarakaMode("property")} />
            <KarakaButton mode="moon" active={karakaMode === "moon"} color={VERMILION} icon={<Moon size={18} />} title="Moon: mother and comfort" body="Wrong default for property questions." onClick={() => setKarakaMode("moon")} />
            <KarakaButton mode="education" active={karakaMode === "education"} color={BLUE} icon={<Compass size={18} />} title="Mercury: education" body="Right for T2-08, wrong for land." onClick={() => setKarakaMode("education")} />
            <KarakaButton mode="vehicle" active={karakaMode === "vehicle"} color={PURPLE} icon={<Building2 size={18} />} title="Venus: vehicles and comforts" body="Related but distinct from land." onClick={() => setKarakaMode("vehicle")} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Synthesis discipline</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={qualitativeConvergence} color={qualitativeConvergence ? GREEN : GOLD} icon={<ShieldCheck size={18} />} title="Mars convergence calibrated" body={qualitativeConvergence ? "Occupant and karaka agree qualitatively." : "Convergence is being mishandled."} onClick={() => setQualitativeConvergence((value) => !value)} />
            <Toggle active={processComplication} color={processComplication ? GOLD : BLUE} icon={<TriangleAlert size={18} />} title="Saturn process complication" body={processComplication ? "4th lord in 8th is named honestly." : "Process friction is being minimized."} onClick={() => setProcessComplication((value) => !value)} />
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

function PropertyChartSvg({
  lordStrength,
  occupantStrength,
  aspectStrength,
  karakaMode,
  processComplication,
}: {
  lordStrength: Strength;
  occupantStrength: Strength;
  aspectStrength: Strength;
  karakaMode: KarakaMode;
  processComplication: boolean;
}) {
  const karakaColor = karakaMode === "property" ? GREEN : VERMILION;
  return (
    <svg viewBox="0 0 760 420" role="img" aria-label="Chart P1 fourth house property reading map" style={{ width: "100%", minHeight: 390, margin: "0.8rem 0", display: "block" }}>
      <rect x="18" y="18" width="724" height="384" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="54" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="600">CHART P1: FOURTH HOUSE PROPERTY THREAD</text>

      <rect x="260" y="92" width="240" height="150" rx="8" fill={`${GREEN}10`} stroke={GREEN} strokeWidth="3" />
      <text x="380" y="126" textAnchor="middle" fill={GREEN} fontSize="18" fontWeight="600">Capricorn 4th</text>
      <text x="380" y="152" textAnchor="middle" fill={INK_SECONDARY} fontSize="14">home, land, property container</text>
      <circle cx="380" cy="190" r="34" fill={`${strengthColor(occupantStrength)}18`} stroke={strengthColor(occupantStrength)} strokeWidth="3" />
      <text x="380" y="186" textAnchor="middle" fill={strengthColor(occupantStrength)} fontSize="14" fontWeight="600">Mars</text>
      <text x="380" y="205" textAnchor="middle" fill={INK_MUTED} fontSize="12">exalted occupant</text>

      <rect x="64" y="112" width="148" height="88" rx="8" fill={`${strengthColor(lordStrength)}12`} stroke={strengthColor(lordStrength)} />
      <text x="138" y="140" textAnchor="middle" fill={strengthColor(lordStrength)} fontSize="14" fontWeight="600">4th lord Saturn</text>
      <text x="138" y="163" textAnchor="middle" fill={INK_MUTED} fontSize="12">{lordStrength} signal</text>
      <text x="138" y="183" textAnchor="middle" fill={INK_MUTED} fontSize="12">8th-house process</text>
      <path d="M 213 156 C 238 150, 244 144, 260 136" fill="none" stroke={strengthColor(lordStrength)} strokeWidth="4" strokeLinecap="round" />

      <rect x="548" y="112" width="148" height="88" rx="8" fill={`${strengthColor(aspectStrength)}12`} stroke={strengthColor(aspectStrength)} />
      <text x="622" y="140" textAnchor="middle" fill={strengthColor(aspectStrength)} fontSize="14" fontWeight="600">Moon + Jupiter</text>
      <text x="622" y="163" textAnchor="middle" fill={INK_MUTED} fontSize="12">{aspectStrength} aspect</text>
      <text x="622" y="183" textAnchor="middle" fill={INK_MUTED} fontSize="12">from the 10th</text>
      <path d="M 548 156 C 522 150, 516 144, 500 136" fill="none" stroke={strengthColor(aspectStrength)} strokeWidth="4" strokeLinecap="round" />

      <rect x="140" y="292" width="210" height="58" rx="8" fill={`${karakaColor}12`} stroke={karakaColor} />
      <text x="245" y="316" textAnchor="middle" fill={karakaColor} fontSize="14" fontWeight="600">Live karaka thread</text>
      <text x="245" y="337" textAnchor="middle" fill={INK_MUTED} fontSize="12">{karakaLabel(karakaMode)}</text>

      <rect x="410" y="292" width="210" height="58" rx="8" fill={`${processComplication ? GOLD : BLUE}12`} stroke={processComplication ? GOLD : BLUE} />
      <text x="515" y="316" textAnchor="middle" fill={processComplication ? GOLD : BLUE} fontSize="14" fontWeight="600">Synthesis note</text>
      <text x="515" y="337" textAnchor="middle" fill={INK_MUTED} fontSize="12">{processComplication ? "capacity plus friction" : "friction minimized"}</text>

      <text x="380" y="382" textAnchor="middle" fill={INK_SECONDARY} fontSize="14">Property is centered on the 4th house, read through its lord, occupants, aspects, and Mars/Saturn.</text>
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

function KarakaButton({
  active,
  color,
  icon,
  title,
  body,
  onClick,
}: {
  mode: KarakaMode;
  active: boolean;
  color: string;
  icon: ReactNode;
  title: string;
  body: string;
  onClick: () => void;
}) {
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

const chartWorkbenchGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
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
  if (value === "strong") return 22;
  if (value === "mixed") return 13;
  return 4;
}

function strengthColor(value: Strength) {
  if (value === "strong") return GREEN;
  if (value === "mixed") return GOLD;
  return VERMILION;
}

function karakaLabel(value: KarakaMode) {
  if (value === "property") return "Mars primary, Saturn secondary";
  if (value === "moon") return "Moon: comfort and mother";
  if (value === "education") return "Mercury: education";
  return "Venus: vehicle and comfort";
}
