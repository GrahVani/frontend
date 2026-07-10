"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Car, CircleDot, Gem, Home, Landmark, Layers3, RotateCcw } from "lucide-react";

type ScenarioId = "chartP1" | "saturnDoubleCount" | "venusFolded" | "afflictedVenus" | "lateAncestral";
type FocusMode = "saturn" | "venus" | "synthesis" | "counting" | "reference";
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
    houseSupport: Strength;
    marsCapacity: Strength;
    saturnProcess: Strength;
    venusComfort: Strength;
    countSaturnOnce: boolean;
    keepVenusSeparate: boolean;
    ancestralFlavor: boolean;
    color: string;
    context: string;
  }
> = {
  chartP1: {
    label: "Chart P1",
    title: "Strong land capacity, one process caution, strong comforts",
    houseSupport: "strong",
    marsCapacity: "strong",
    saturnProcess: "mixed",
    venusComfort: "strong",
    countSaturnOnce: true,
    keepVenusSeparate: true,
    ancestralFlavor: true,
    color: GREEN,
    context: "Mars, the house, and Moon/Jupiter support property capacity. Saturn gives one consistent process caution. Venus separately supports vehicles and comforts.",
  },
  saturnDoubleCount: {
    label: "Double count",
    title: "Saturn is counted as two independent findings",
    houseSupport: "strong",
    marsCapacity: "strong",
    saturnProcess: "mixed",
    venusComfort: "strong",
    countSaturnOnce: false,
    keepVenusSeparate: true,
    ancestralFlavor: true,
    color: GOLD,
    context: "Saturn is both 4th lord and secondary land karaka, but it is the same planet in the same place. It confirms one finding; it does not create two.",
  },
  venusFolded: {
    label: "Venus folded",
    title: "Vehicles and luxury are merged into land",
    houseSupport: "strong",
    marsCapacity: "strong",
    saturnProcess: "mixed",
    venusComfort: "strong",
    countSaturnOnce: true,
    keepVenusSeparate: false,
    ancestralFlavor: true,
    color: VERMILION,
    context: "Venus is a 4th-house-related karaka, but it speaks to vehicles and material comforts, not land itself.",
  },
  afflictedVenus: {
    label: "Variant",
    title: "Venus weakens only the comfort thread",
    houseSupport: "strong",
    marsCapacity: "strong",
    saturnProcess: "mixed",
    venusComfort: "weak",
    countSaturnOnce: true,
    keepVenusSeparate: true,
    ancestralFlavor: true,
    color: PURPLE,
    context: "If Venus were afflicted, the vehicles/luxury thread would shift without rewriting the land-specific Mars and Saturn findings.",
  },
  lateAncestral: {
    label: "Ancestral",
    title: "Saturn flavor is emphasized",
    houseSupport: "mixed",
    marsCapacity: "mixed",
    saturnProcess: "strong",
    venusComfort: "mixed",
    countSaturnOnce: true,
    keepVenusSeparate: true,
    ancestralFlavor: true,
    color: BLUE,
    context: "A strong Saturn secondary-karaka pattern can color property toward ancestral homes, inherited land, or later-life settlement.",
  },
};

const FOCUS_COPY: Record<FocusMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  saturn: {
    label: "Saturn",
    title: "Secondary land karaka with ancestral flavor",
    body: "Saturn colors land toward ancestral homes, aging-related property, delayed settling, and maturing over time.",
    icon: <Landmark size={16} />,
    color: BLUE,
  },
  venus: {
    label: "Venus",
    title: "Vehicles and comforts, not land itself",
    body: "Venus belongs to vehicles, luxury, taste, and material comfort. It is related to the 4th but separate from land.",
    icon: <Car size={16} />,
    color: PURPLE,
  },
  synthesis: {
    label: "Synthesis",
    title: "One account without erasing distinctness",
    body: "The final property picture holds capacity, process caution, and comfort thread together as distinct findings.",
    icon: <Layers3 size={16} />,
    color: GREEN,
  },
  counting: {
    label: "Counting",
    title: "Same Saturn twice is one consistent finding",
    body: "Chart P1's Saturn is the same planet in the same sign and house, read through two roles. Count it once.",
    icon: <CircleDot size={16} />,
    color: GOLD,
  },
  reference: {
    label: "P1 spec",
    title: "Chart P1 becomes the standing reference",
    body: "This lesson fixes the complete Chart P1 specification for later D4, KP, timing, and synthesis chapters.",
    icon: <Home size={16} />,
    color: VERMILION,
  },
};

export function SecondaryPropertyIndicatorsSynthesisLab() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("chartP1");
  const [focusMode, setFocusMode] = useState<FocusMode>("saturn");
  const [houseSupport, setHouseSupport] = useState<Strength>("strong");
  const [marsCapacity, setMarsCapacity] = useState<Strength>("strong");
  const [saturnProcess, setSaturnProcess] = useState<Strength>("mixed");
  const [venusComfort, setVenusComfort] = useState<Strength>("strong");
  const [countSaturnOnce, setCountSaturnOnce] = useState(true);
  const [keepVenusSeparate, setKeepVenusSeparate] = useState(true);
  const [ancestralFlavor, setAncestralFlavor] = useState(true);

  const scenario = SCENARIOS[scenarioId];
  const landScore = Math.max(
    4,
    Math.min(
      96,
      strengthScore(houseSupport) +
        strengthScore(marsCapacity) +
        strengthScore(saturnProcess) +
        (countSaturnOnce ? 12 : -20) +
        (keepVenusSeparate ? 10 : -18) +
        (ancestralFlavor ? 4 : 0),
    ),
  );
  const comfortScore = Math.max(4, Math.min(96, strengthScore(venusComfort) + (keepVenusSeparate ? 30 : 2)));

  const verdict = useMemo(() => {
    if (!countSaturnOnce) return { label: "corroboration counting error", color: GOLD };
    if (!keepVenusSeparate) return { label: "thread separation warning", color: VERMILION };
    if (landScore >= 74 && saturnProcess !== "strong") return { label: "strong capacity with process caution", color: GREEN };
    if (venusComfort === "weak") return { label: "land strong, comforts strained", color: PURPLE };
    if (ancestralFlavor && saturnProcess === "strong") return { label: "ancestral or later-settling flavor", color: BLUE };
    if (landScore >= 50) return { label: "mixed but coherent property picture", color: GOLD };
    return { label: "property picture needs caution", color: VERMILION };
  }, [ancestralFlavor, countSaturnOnce, keepVenusSeparate, landScore, saturnProcess, venusComfort]);

  const statement = useMemo(() => {
    if (!countSaturnOnce) return "Repair the count: Saturn as 4th lord and Saturn as secondary land karaka is one consistent fact, not two independent data points.";
    if (!keepVenusSeparate) return "Separate the threads: Venus can strengthen vehicles and material comfort without becoming a land-acquisition indicator.";
    if (venusComfort === "weak") return "The land picture can stay strong while the comfort or vehicle thread weakens. Do not let Venus rewrite Mars and Saturn.";
    if (ancestralFlavor && saturnProcess === "strong") return "Saturn colors land toward ancestral property, inherited homes, delayed settling, or aging-related property themes.";
    return "Chart P1 synthesizes as strong property capacity from Mars and the 4th, one Saturn-sourced process caution, and a separate strong Venus comfort thread.";
  }, [ancestralFlavor, countSaturnOnce, keepVenusSeparate, saturnProcess, venusComfort]);

  function loadScenario(id: ScenarioId) {
    const next = SCENARIOS[id];
    setScenarioId(id);
    setHouseSupport(next.houseSupport);
    setMarsCapacity(next.marsCapacity);
    setSaturnProcess(next.saturnProcess);
    setVenusComfort(next.venusComfort);
    setCountSaturnOnce(next.countSaturnOnce);
    setKeepVenusSeparate(next.keepVenusSeparate);
    setAncestralFlavor(next.ancestralFlavor);
  }

  return (
    <div data-interactive="secondary-property-indicators-synthesis-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Secondary property indicators</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Add Saturn and Venus without flattening the threads
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Compare Saturn&apos;s secondary land signal with Venus&apos;s vehicle and comfort thread, then assemble Chart P1 without double-counting the same fact.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusMode("saturn"); loadScenario("chartP1"); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button key={id} type="button" aria-pressed={scenarioId === id} onClick={() => loadScenario(id)} style={buttonStyle(scenarioId === id, SCENARIOS[id].color)}>
              <Layers3 size={16} aria-hidden="true" />
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
              <p style={eyebrowStyle}>Chapter 1 synthesis map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <span style={{ color: verdict.color, fontWeight: 600 }}>{landScore}% land / {comfortScore}% comfort</span>
          </div>
          <SynthesisSvg
            houseSupport={houseSupport}
            marsCapacity={marsCapacity}
            saturnProcess={saturnProcess}
            venusComfort={venusComfort}
            countSaturnOnce={countSaturnOnce}
            keepVenusSeparate={keepVenusSeparate}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Land capacity" body={marsCapacity} color={strengthColor(marsCapacity)} icon={<LandPlotIcon />} />
            <MiniFact title="Process" body={saturnProcess} color={strengthColor(saturnProcess)} icon={<Landmark size={16} />} />
            <MiniFact title="Comforts" body={venusComfort} color={strengthColor(venusComfort)} icon={<Car size={16} />} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Factor controls</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <StrengthPicker title="4th house and aspects" value={houseSupport} onChange={setHouseSupport} />
            <StrengthPicker title="Mars land capacity" value={marsCapacity} onChange={setMarsCapacity} />
            <StrengthPicker title="Saturn process flavor" value={saturnProcess} onChange={setSaturnProcess} />
            <StrengthPicker title="Venus comforts thread" value={venusComfort} onChange={setVenusComfort} />
          </div>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Counting discipline</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={countSaturnOnce} color={countSaturnOnce ? GREEN : GOLD} icon={<CircleDot size={18} />} title="Count Saturn once" body={countSaturnOnce ? "One fact, two roles." : "Same Saturn is being double-counted."} onClick={() => setCountSaturnOnce((value) => !value)} />
            <Toggle active={keepVenusSeparate} color={keepVenusSeparate ? GREEN : VERMILION} icon={<Car size={18} />} title="Keep Venus separate" body={keepVenusSeparate ? "Vehicles and comforts stay distinct." : "Venus is being folded into land."} onClick={() => setKeepVenusSeparate((value) => !value)} />
            <Toggle active={ancestralFlavor} color={ancestralFlavor ? BLUE : GOLD} icon={<Landmark size={18} />} title="Saturn ancestral flavor" body={ancestralFlavor ? "Inheritance, family home, later settling." : "Saturn flavor muted."} onClick={() => setAncestralFlavor((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Chart P1 reference</p>
          <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.75rem" }}>
            <ReferenceRow label="Mars" value="Capricorn 18, exalted, 4th house" color={GREEN} />
            <ReferenceRow label="Saturn" value="Taurus 11, friend sign, 8th house" color={GOLD} />
            <ReferenceRow label="Venus" value="Libra 25, own sign, 1st house" color={PURPLE} />
            <ReferenceRow label="Birth data" value="4 Mar 2007, 22:34:48 IST, Jaipur" color={BLUE} />
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

function SynthesisSvg({
  houseSupport,
  marsCapacity,
  saturnProcess,
  venusComfort,
  countSaturnOnce,
  keepVenusSeparate,
}: {
  houseSupport: Strength;
  marsCapacity: Strength;
  saturnProcess: Strength;
  venusComfort: Strength;
  countSaturnOnce: boolean;
  keepVenusSeparate: boolean;
}) {
  return (
    <svg viewBox="0 0 760 430" role="img" aria-label="Chart P1 chapter one property synthesis map" style={{ width: "100%", minHeight: 330, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="724" height="394" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="52" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">CHART P1: ONE ACCOUNT WITHOUT ERASING DISTINCTNESS</text>
      <FactorNode x={128} y={150} title="4th house" body={houseSupport} color={strengthColor(houseSupport)} />
      <FactorNode x={296} y={150} title="Mars" body={marsCapacity} color={strengthColor(marsCapacity)} />
      <FactorNode x={464} y={150} title="Saturn" body={saturnProcess} color={strengthColor(saturnProcess)} />
      <FactorNode x={632} y={150} title="Venus" body={venusComfort} color={strengthColor(venusComfort)} />

      <path d="M 128 202 C 198 268, 258 268, 318 316" fill="none" stroke={strengthColor(houseSupport)} strokeWidth="4" strokeLinecap="round" />
      <path d="M 296 202 C 320 252, 332 278, 340 316" fill="none" stroke={strengthColor(marsCapacity)} strokeWidth="4" strokeLinecap="round" />
      <path d="M 464 202 C 440 252, 428 278, 420 316" fill="none" stroke={strengthColor(saturnProcess)} strokeWidth="4" strokeLinecap="round" />
      <path d={keepVenusSeparate ? "M 632 202 C 608 260, 608 286, 608 316" : "M 632 202 C 560 258, 500 286, 440 316"} fill="none" stroke={keepVenusSeparate ? PURPLE : VERMILION} strokeWidth="4" strokeLinecap="round" />

      <rect x="252" y="316" width="258" height="54" rx="8" fill={`${countSaturnOnce ? GREEN : GOLD}12`} stroke={countSaturnOnce ? GREEN : GOLD} />
      <text x="381" y="338" textAnchor="middle" fill={countSaturnOnce ? GREEN : GOLD} fontSize="12" fontWeight="600">Land picture</text>
      <text x="381" y="357" textAnchor="middle" fill={INK_MUTED} fontSize="11">{countSaturnOnce ? "capacity plus one Saturn process caution" : "Saturn is being counted twice"}</text>

      <rect x="538" y="316" width="150" height="54" rx="8" fill={`${keepVenusSeparate ? PURPLE : VERMILION}12`} stroke={keepVenusSeparate ? PURPLE : VERMILION} />
      <text x="613" y="338" textAnchor="middle" fill={keepVenusSeparate ? PURPLE : VERMILION} fontSize="12" fontWeight="600">Comfort thread</text>
      <text x="613" y="357" textAnchor="middle" fill={INK_MUTED} fontSize="11">{keepVenusSeparate ? "separate Venus" : "folded into land"}</text>

      <text x="380" y="402" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">Saturn confirms one process finding; Venus speaks to vehicles and comforts separately.</text>
    </svg>
  );
}

function FactorNode({ x, y, title, body, color }: { x: number; y: number; title: string; body: string; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="46" fill={`${color}14`} stroke={color} strokeWidth="3" />
      <text x={x} y={y - 5} textAnchor="middle" fill={color} fontSize="12" fontWeight="600">{title}</text>
      <text x={x} y={y + 16} textAnchor="middle" fill={INK_MUTED} fontSize="11">{body}</text>
    </g>
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

function ReferenceRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.65rem" }}>
      <span style={{ color, fontWeight: 600 }}>{label}</span>
      <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{value}</p>
    </div>
  );
}

function LandPlotIcon() {
  return <Gem size={16} />;
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
