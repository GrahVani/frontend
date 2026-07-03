"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Baby, Brain, HeartPulse, Lightbulb, Orbit, RotateCcw, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type ScenarioId = "favourable" | "delayed" | "overNarrowed" | "medicalConcern" | "distressPause";
type ViewMode = "wholeFifth" | "lord" | "occupants" | "references" | "ethics";
type LordStrength = "strong" | "mixed" | "stressed";

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
    lordStrength: LordStrength;
    beneficOccupants: boolean;
    jupiterAspect: boolean;
    maleficAffliction: boolean;
    moonReference: boolean;
    jupiterReference: boolean;
    medicalRoute: boolean;
    distressPause: boolean;
    color: string;
    context: string;
  }
> = {
  favourable: {
    label: "Strong 5th",
    title: "Favourable santana indication",
    lordStrength: "strong",
    beneficOccupants: true,
    jupiterAspect: true,
    maleficAffliction: false,
    moonReference: true,
    jupiterReference: true,
    medicalRoute: true,
    distressPause: true,
    color: GREEN,
    context: "5th lord in own sign in a kendra, Jupiter aspecting the 5th, no malefic affliction, and cross-references echo support.",
  },
  delayed: {
    label: "Delay pattern",
    title: "Stressed 5th read as challenge, not foreclosure",
    lordStrength: "mixed",
    beneficOccupants: false,
    jupiterAspect: false,
    maleficAffliction: true,
    moonReference: true,
    jupiterReference: false,
    medicalRoute: true,
    distressPause: true,
    color: GOLD,
    context: "Affliction stresses the putra-bhava, but the correct reading is challenge or delay with graded confidence.",
  },
  overNarrowed: {
    label: "Children only",
    title: "The 5th house is over-narrowed",
    lordStrength: "strong",
    beneficOccupants: true,
    jupiterAspect: false,
    maleficAffliction: false,
    moonReference: false,
    jupiterReference: false,
    medicalRoute: true,
    distressPause: true,
    color: BLUE,
    context: "The 5th is being treated only as children, while buddhi, creativity, romance, speculation, and purva-punya are ignored.",
  },
  medicalConcern: {
    label: "Clinical concern",
    title: "Fertility or pregnancy concern exceeds astrology",
    lordStrength: "mixed",
    beneficOccupants: false,
    jupiterAspect: true,
    maleficAffliction: true,
    moonReference: true,
    jupiterReference: true,
    medicalRoute: false,
    distressPause: true,
    color: VERMILION,
    context: "A client asks about difficulty conceiving or pregnancy risk. This must be routed to a fertility specialist or physician.",
  },
  distressPause: {
    label: "Visible distress",
    title: "Grief or despair pauses the technical reading",
    lordStrength: "mixed",
    beneficOccupants: true,
    jupiterAspect: false,
    maleficAffliction: true,
    moonReference: true,
    jupiterReference: true,
    medicalRoute: true,
    distressPause: false,
    color: PURPLE,
    context: "A client reacts with grief, loss, or despair. The reading pauses for care before any further technical analysis.",
  },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  wholeFifth: {
    label: "Whole 5th",
    title: "The 5th is wider than children",
    body: "Read progeny together with purva-punya, intelligence, creativity, romance, and speculation before locating the santana signal.",
    icon: <Lightbulb size={16} />,
    color: BLUE,
  },
  lord: {
    label: "Lord",
    title: "The 5th lord is the best single signature",
    body: "Dignity, house placement, combustion, and strength of the 5th lord carry the core predictive weight.",
    icon: <Orbit size={16} />,
    color: GOLD,
  },
  occupants: {
    label: "Influences",
    title: "Occupants and aspects modify the promise",
    body: "Jupiter and benefics support; malefic affliction can stress or delay, especially without benefic relief.",
    icon: <Sparkles size={16} />,
    color: GREEN,
  },
  references: {
    label: "References",
    title: "Confirm from Moon and Jupiter",
    body: "Read the 5th from Lagna, the 5th from Moon, and the 5th from Jupiter before forming confidence.",
    icon: <Baby size={16} />,
    color: PURPLE,
  },
  ethics: {
    label: "Care",
    title: "Indication, not foreclosure",
    body: "Never decree childlessness or make medical claims. Route clinical concerns and pause for visible distress.",
    icon: <HeartPulse size={16} />,
    color: VERMILION,
  },
};

export function SantanaFifthHouseProfileWorkbench() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("favourable");
  const [viewMode, setViewMode] = useState<ViewMode>("wholeFifth");
  const [lordStrength, setLordStrength] = useState<LordStrength>("strong");
  const [beneficOccupants, setBeneficOccupants] = useState(true);
  const [jupiterAspect, setJupiterAspect] = useState(true);
  const [maleficAffliction, setMaleficAffliction] = useState(false);
  const [moonReference, setMoonReference] = useState(true);
  const [jupiterReference, setJupiterReference] = useState(true);
  const [readWholeFifth, setReadWholeFifth] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);
  const [distressPause, setDistressPause] = useState(true);
  const [foreclosureClaim, setForeclosureClaim] = useState(false);

  const scenario = SCENARIOS[scenarioId];
  const crossReferences = [moonReference, jupiterReference].filter(Boolean).length;
  const supportScore = Math.max(
    5,
    Math.min(
      96,
      (lordStrength === "strong" ? 32 : lordStrength === "mixed" ? 16 : 4) +
        (beneficOccupants ? 12 : 0) +
        (jupiterAspect ? 20 : 0) -
        (maleficAffliction ? 16 : 0) +
        crossReferences * 10 +
        (readWholeFifth ? 8 : -12) +
        (medicalRoute ? 6 : -22) +
        (distressPause ? 6 : -20) -
        (foreclosureClaim ? 35 : 0),
    ),
  );

  const verdict = useMemo(() => {
    if (foreclosureClaim) return { label: "foreclosure warning", color: VERMILION };
    if (!medicalRoute) return { label: "medical routing missing", color: VERMILION };
    if (!distressPause) return { label: "care pause missing", color: PURPLE };
    if (!readWholeFifth) return { label: "5th house over-narrowed", color: BLUE };
    if (supportScore >= 74) return { label: "favourable santana indication", color: GREEN };
    if (supportScore >= 45) return { label: "mixed or delayed indication", color: GOLD };
    return { label: "stressed indication, handle gently", color: VERMILION };
  }, [distressPause, foreclosureClaim, medicalRoute, readWholeFifth, supportScore]);

  const statement = useMemo(() => {
    if (foreclosureClaim) return "Repair the frame: never say the chart forecloses children. Read indications with graded confidence.";
    if (!medicalRoute) return "Pause: conception, pregnancy, fertility, and child-health concerns belong with a fertility specialist or physician.";
    if (!distressPause) return "Pause the technical reading and respond to grief or distress before continuing.";
    if (!readWholeFifth) return "Read the 5th whole first, then locate the santana register through the 5th, Jupiter, references, and later D7.";
    if (supportScore >= 74) return "This is a favourable santana indication: strong 5th lord, Jupiter support, clean influences, and cross-reference confirmation.";
    if (supportScore >= 45) return "This suggests challenge or delay rather than denial. State the tendency gently and keep medical matters routed.";
    return "The 5th is stressed, so lower confidence and speak carefully: challenge, delay, and need for support, not a decree.";
  }, [distressPause, foreclosureClaim, medicalRoute, readWholeFifth, supportScore]);

  function loadScenario(id: ScenarioId) {
    const next = SCENARIOS[id];
    setScenarioId(id);
    setLordStrength(next.lordStrength);
    setBeneficOccupants(next.beneficOccupants);
    setJupiterAspect(next.jupiterAspect);
    setMaleficAffliction(next.maleficAffliction);
    setMoonReference(next.moonReference);
    setJupiterReference(next.jupiterReference);
    setReadWholeFifth(id !== "overNarrowed");
    setMedicalRoute(next.medicalRoute);
    setDistressPause(next.distressPause);
    setForeclosureClaim(false);
  }

  return (
    <div data-interactive="santana-fifth-house-profile-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>5th house santana profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>Read the putra-bhava as indication, not decree</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Build the children indication from the 5th lord, occupants, aspects, Jupiter, and Moon/Jupiter cross-references while keeping medical and care boundaries intact.
            </p>
          </div>
          <button type="button" onClick={() => { setViewMode("wholeFifth"); loadScenario("favourable"); }} style={buttonStyle(false, PURPLE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button key={id} type="button" aria-pressed={scenarioId === id} onClick={() => loadScenario(id)} style={buttonStyle(scenarioId === id, SCENARIOS[id].color)}>
              <Baby size={16} aria-hidden="true" />
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
              <p style={eyebrowStyle}>Prediction profile</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <span style={{ color: verdict.color, fontWeight: 600 }}>{supportScore}% support</span>
          </div>
          <SantanaProfileSvg lordStrength={lordStrength} jupiterAspect={jupiterAspect} maleficAffliction={maleficAffliction} moonReference={moonReference} jupiterReference={jupiterReference} safeFrame={!foreclosureClaim && medicalRoute && distressPause} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="5th lord" body={lordStrength} color={lordColor(lordStrength)} icon={<Orbit size={16} />} />
            <MiniFact title="Jupiter" body={jupiterAspect ? "supports" : "not confirming"} color={jupiterAspect ? GREEN : GOLD} icon={<Sparkles size={16} />} />
            <MiniFact title="References" body={`${crossReferences}/2 confirm`} color={crossReferences === 2 ? GREEN : GOLD} icon={<Baby size={16} />} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>5th house controls</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Panel title="5th lord condition" icon={<Orbit size={18} />} color={lordColor(lordStrength)}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(["strong", "mixed", "stressed"] as LordStrength[]).map((mode) => (
                  <button key={mode} type="button" aria-pressed={lordStrength === mode} onClick={() => setLordStrength(mode)} style={buttonStyle(lordStrength === mode, lordColor(mode))}>
                    {mode}
                  </button>
                ))}
              </div>
            </Panel>
            <Toggle active={beneficOccupants} color={beneficOccupants ? GREEN : GOLD} icon={<Lightbulb size={18} />} title="Benefic occupants/support" body={beneficOccupants ? "Benefics support the 5th register." : "No occupant support is counted."} onClick={() => setBeneficOccupants((value) => !value)} />
            <Toggle active={jupiterAspect} color={jupiterAspect ? GREEN : GOLD} icon={<Sparkles size={18} />} title="Jupiter aspect/support" body={jupiterAspect ? "Santana-karaka supports the 5th." : "Jupiter does not confirm."} onClick={() => setJupiterAspect((value) => !value)} />
            <Toggle active={maleficAffliction} color={maleficAffliction ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Malefic affliction" body={maleficAffliction ? "Stress or delay must be weighed." : "No major affliction counted."} onClick={() => setMaleficAffliction((value) => !value)} />
          </div>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Cross-reference checks</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={readWholeFifth} color={readWholeFifth ? GREEN : BLUE} icon={<Brain size={18} />} title="Read the 5th whole" body={readWholeFifth ? "Children, merit, intelligence, creativity are all held." : "House is over-narrowed to children only."} onClick={() => setReadWholeFifth((value) => !value)} />
            <Toggle active={moonReference} color={moonReference ? GREEN : GOLD} icon={<Baby size={18} />} title="5th from Moon checked" body={moonReference ? "Moon reference confirms or qualifies." : "Moon reference skipped."} onClick={() => setMoonReference((value) => !value)} />
            <Toggle active={jupiterReference} color={jupiterReference ? GREEN : GOLD} icon={<Baby size={18} />} title="5th from Jupiter checked" body={jupiterReference ? "Karaka reference included." : "Jupiter reference skipped."} onClick={() => setJupiterReference((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Care and scope</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={medicalRoute} color={medicalRoute ? GREEN : VERMILION} icon={<HeartPulse size={18} />} title="Medical routing intact" body={medicalRoute ? "Clinical concerns go to specialists." : "Chart is replacing medical care."} onClick={() => setMedicalRoute((value) => !value)} />
            <Toggle active={distressPause} color={distressPause ? GREEN : PURPLE} icon={<HeartPulse size={18} />} title="Pause for visible distress" body={distressPause ? "Care comes before technique." : "Reading is continuing through distress."} onClick={() => setDistressPause((value) => !value)} />
            <Toggle active={foreclosureClaim} color={foreclosureClaim ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Childlessness decree" body={foreclosureClaim ? "Error active: forbidden foreclosure." : "No foreclosure claim."} onClick={() => setForeclosureClaim((value) => !value)} />
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

function SantanaProfileSvg({
  lordStrength,
  jupiterAspect,
  maleficAffliction,
  moonReference,
  jupiterReference,
  safeFrame,
}: {
  lordStrength: LordStrength;
  jupiterAspect: boolean;
  maleficAffliction: boolean;
  moonReference: boolean;
  jupiterReference: boolean;
  safeFrame: boolean;
}) {
  const nodes = [
    { label: "5th lord", active: lordStrength !== "stressed", x: 98, color: lordColor(lordStrength) },
    { label: "Occupants", active: true, x: 248, color: BLUE },
    { label: "Jupiter", active: jupiterAspect, x: 398, color: GREEN },
    { label: "Refs", active: moonReference && jupiterReference, x: 548, color: PURPLE },
    { label: "Care", active: safeFrame, x: 698, color: VERMILION },
  ];
  return (
    <svg viewBox="0 0 795 390" role="img" aria-label="Santana fifth house profile workflow" style={{ width: "100%", minHeight: 300, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="759" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="398" y="52" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">LORD, INFLUENCES, REFERENCES, CAREFUL FRAME</text>
      <line x1="98" y1="145" x2="698" y2="145" stroke={HAIRLINE} strokeWidth="4" />
      {nodes.map((node, index) => {
        const stroke = node.active ? node.color : VERMILION;
        return (
          <g key={node.label}>
            {index < nodes.length - 1 ? <path d={`M ${node.x + 42} 145 L ${nodes[index + 1].x - 48} 145`} stroke={stroke} strokeWidth="3" opacity="0.55" /> : null}
            <circle cx={node.x} cy="145" r="38" fill={`${stroke}16`} stroke={stroke} strokeWidth="2.5" />
            <text x={node.x} y="142" textAnchor="middle" fill={stroke} fontSize="11" fontWeight="600">{node.label}</text>
            <text x={node.x} y="162" textAnchor="middle" fill={INK_MUTED} fontSize="10">{node.active ? "read" : "repair"}</text>
          </g>
        );
      })}
      <rect x="92" y="240" width="250" height="56" rx="8" fill={`${maleficAffliction ? GOLD : GREEN}12`} stroke={maleficAffliction ? GOLD : GREEN} />
      <text x="217" y="263" textAnchor="middle" fill={maleficAffliction ? GOLD : GREEN} fontSize="12" fontWeight="600">Indication quality</text>
      <text x="217" y="283" textAnchor="middle" fill={INK_MUTED} fontSize="11">{maleficAffliction ? "stress or delay" : "favourable trend"}</text>
      <rect x="452" y="240" width="250" height="56" rx="8" fill={`${safeFrame ? GREEN : VERMILION}12`} stroke={safeFrame ? GREEN : VERMILION} />
      <text x="577" y="263" textAnchor="middle" fill={safeFrame ? GREEN : VERMILION} fontSize="12" fontWeight="600">Output frame</text>
      <text x="577" y="283" textAnchor="middle" fill={INK_MUTED} fontSize="11">{safeFrame ? "indication with care" : "boundary repair"}</text>
      <text x="398" y="330" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">A chart indicates tendencies; medicine, grief, and wellbeing receive their own care.</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{title}</h3>
      </div>
      <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>{children}</div>
    </section>
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

function lordColor(mode: LordStrength) {
  if (mode === "strong") return GREEN;
  if (mode === "mixed") return GOLD;
  return VERMILION;
}
