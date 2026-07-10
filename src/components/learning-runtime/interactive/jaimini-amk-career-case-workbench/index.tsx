"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  Crown,
  GitCompare,
  Layers,
  RotateCcw,
  Route,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

type StepKey = "identify" | "read" | "crossCheck" | "tier";
type ScenarioKey = "convergence" | "divergence";
type VerdictMode = "honest" | "pickField";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const STEPS: Array<{ key: StepKey; label: string; color: string; icon: ReactNode }> = [
  { key: "identify", label: "A. Identify AmK", color: GOLD, icon: <Crown size={17} /> },
  { key: "read", label: "B. Read AmK", color: GREEN, icon: <Layers size={17} /> },
  { key: "crossCheck", label: "C. Cross-check", color: PURPLE, icon: <GitCompare size={17} /> },
  { key: "tier", label: "D. Assign tier", color: BLUE, icon: <Scale size={17} /> },
];

const DEGREES = [
  { planet: "Mercury", degree: 27, role: "AK", color: GREEN },
  { planet: "Saturn", degree: 23, role: "AmK", color: PURPLE },
  { planet: "Venus", degree: 18, role: "BK", color: GOLD },
  { planet: "Moon", degree: 14, role: "MK", color: BLUE },
  { planet: "Mars", degree: 9, role: "PK", color: VERMILION },
  { planet: "Jupiter", degree: 6, role: "GK", color: GREEN },
  { planet: "Sun", degree: 2, role: "DK", color: VERMILION },
];

const SCENARIOS = {
  convergence: {
    label: "Lesson convergence",
    color: GREEN,
    headline: "AmK is the 10th lord",
    identify: "7-karaka scheme: Mercury 27deg is AK; Saturn 23deg is AmK. With Aries Lagna, Capricorn is the 10th and Saturn is also the 10th lord.",
    read: "Saturn as AmK sits in the 10th house in Capricorn, its own sign. Navamsha is strong, and Saturn aspects the 10th from Karakamsha Lagna.",
    cross: "The same strong Saturn is both Jaimini's minister and Parashari's career ruler: the strongest convergence.",
    verdict: "Strong, unified career voice: disciplined, structured work such as administration, law, organisation, service, or governance.",
    tier: 90,
  },
  divergence: {
    label: "Divergence variant",
    color: PURPLE,
    headline: "Moon AmK vs Mercury 10th lord",
    identify: "AmK is Moon by degree, while the structural 10th lord is Mercury. They are different planets.",
    read: "Moon AmK points toward caring, public, responsive, or nurturing work; Mercury points toward commerce and communication.",
    cross: "The cross-check finds field divergence, not convergence. The reading must combine, reframe, or name tension.",
    verdict: "Moderate/caveated field: communication or commerce may operate inside a caring/public vocation, or the two fields may pull against each other.",
    tier: 62,
  },
} as const;

export function JaiminiAmkCareerCaseWorkbench() {
  const [step, setStep] = useState<StepKey>("identify");
  const [scenario, setScenario] = useState<ScenarioKey>("convergence");
  const [schemeDeclared, setSchemeDeclared] = useState(true);
  const [includeNavamsha, setIncludeNavamsha] = useState(true);
  const [includeCarryForward, setIncludeCarryForward] = useState(true);
  const [verdictMode, setVerdictMode] = useState<VerdictMode>("honest");

  const current = SCENARIOS[scenario];
  const stepIndex = STEPS.findIndex((item) => item.key === step);
  const pickError = scenario === "divergence" && verdictMode === "pickField";
  const warning = pickError || !schemeDeclared || !includeNavamsha;
  const tier = pickError ? 38 : current.tier;

  const synthesis = useMemo(() => {
    const method = schemeDeclared ? "Scheme is stated, so the AmK identification is reproducible." : "State the 7-karaka scheme before trusting the reading.";
    const amkDepth = includeNavamsha ? "Placement, navamsha, and Karakamsha are all included." : "Skipping navamsha/Karakamsha leaves the AmK reading incomplete.";
    const verdict = pickError ? "Picking one field on the divergence variant violates the chapter discipline." : current.verdict;
    const carry = includeCarryForward ? " Carry this Jaimini-Parashari row to KP, the capstone synthesis, and dasha timing." : " Do not stop here; this is career nature and strength, not a dated event.";
    return `${method} ${amkDepth} ${verdict}${carry}`;
  }, [current.verdict, includeCarryForward, includeNavamsha, pickError, schemeDeclared]);

  return (
    <div data-interactive="jaimini-amk-career-case-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked Jaimini AmK case</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Identify, read, cross-check, and tier the AmK career voice
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Rebuild the lesson case where Saturn is both AmK and 10th lord, then contrast it with a Moon/Mercury field divergence.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("identify");
              setScenario("convergence");
              setSchemeDeclared(true);
              setIncludeNavamsha(true);
              setIncludeCarryForward(true);
              setVerdictMode("honest");
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Four-step process</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "0.6rem", marginTop: "0.75rem" }}>
          {STEPS.map((item, index) => (
            <button key={item.key} type="button" aria-pressed={step === item.key} onClick={() => setStep(item.key)} style={stepButtonStyle(step === item.key, item.color)}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>{item.icon}{item.label}</span>
              <span style={{ display: "block", color: INK_MUTED, fontSize: "0.78rem", marginTop: "0.4rem" }}>
                {index <= stepIndex ? "in synthesis" : "next"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Case vector</p>
              <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : current.color, fontSize: "1.2rem" }}>{current.headline}</h3>
            </div>
            <span style={{ color: tier >= 80 ? GREEN : tier <= 40 ? VERMILION : GOLD, fontWeight: 700 }}>{tier}% tier</span>
          </div>
          <CaseSvg scenario={scenario} step={step} tier={tier} warning={warning} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Crown size={16} />} title="AK" body={scenario === "convergence" ? "Mercury 27deg" : "variant chart"} color={GREEN} />
            <MiniFact icon={<BriefcaseBusiness size={16} />} title="AmK" body={scenario === "convergence" ? "Saturn 23deg" : "Moon"} color={scenario === "convergence" ? PURPLE : BLUE} />
            <MiniFact icon={<Target size={16} />} title="Cross-check" body={scenario === "convergence" ? "same planet" : "field split"} color={current.color} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Scenario" icon={<Layers size={18} />} color={current.color}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={scenario === key} onClick={() => { setScenario(key); setVerdictMode("honest"); }} style={smallChipStyle(scenario === key, SCENARIOS[key].color)}>
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{current.headline}: {current.verdict}</p>
          </Panel>

          <Panel title="Verdict discipline" icon={pickError ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />} color={pickError ? VERMILION : GREEN}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={verdictMode === "honest"} onClick={() => setVerdictMode("honest")} style={smallChipStyle(verdictMode === "honest", GREEN)}>
                Honest tier
              </button>
              <button type="button" aria-pressed={verdictMode === "pickField"} onClick={() => setVerdictMode("pickField")} style={smallChipStyle(verdictMode === "pickField", VERMILION)}>
                Pick one field
              </button>
            </div>
            <p style={bodyTextStyle}>{pickError ? "A field divergence is combination, reframing, or tension; do not pick one field." : "The cross-check result sets the tier."}</p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Step evidence</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: STEPS[stepIndex].color, fontSize: "1.18rem" }}>{STEPS[stepIndex].label}</h3>
          <StepEvidence step={step} scenario={scenario} />
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Method guards</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button type="button" aria-pressed={schemeDeclared} onClick={() => setSchemeDeclared((value) => !value)} style={togglePanelStyle(schemeDeclared, GOLD)}>
              <BadgeCheck size={18} aria-hidden="true" />
              <span>
                <span style={{ display: "block", fontWeight: 700 }}>State 7-karaka scheme</span>
                <span>{schemeDeclared ? "Sun through Saturn; no Rahu in the worked ranking." : "Without the scheme, the AmK assignment is not reproducible."}</span>
              </span>
            </button>
            <button type="button" aria-pressed={includeNavamsha} onClick={() => setIncludeNavamsha((value) => !value)} style={togglePanelStyle(includeNavamsha, GREEN)}>
              <Sparkles size={18} aria-hidden="true" />
              <span>
                <span style={{ display: "block", fontWeight: 700 }}>Include navamsha and Karakamsha</span>
                <span>{includeNavamsha ? "Step B is complete." : "Skipping refinement weakens the Jaimini reading."}</span>
              </span>
            </button>
            <button type="button" aria-pressed={includeCarryForward} onClick={() => setIncludeCarryForward((value) => !value)} style={togglePanelStyle(includeCarryForward, BLUE)}>
              <Route size={18} aria-hidden="true" />
              <span>
                <span style={{ display: "block", fontWeight: 700 }}>Carry to KP, capstone, and dasha</span>
                <span>{includeCarryForward ? "This is a stream voice, not final timing." : "The module workflow still needs later layers."}</span>
              </span>
            </button>
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: warning ? `${VERMILION}66` : `${current.color}66`, background: warning ? `${VERMILION}0F` : `${current.color}0F` }}>
        <p style={eyebrowStyle}>Final synthesis</p>
        <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : current.color, fontSize: "1.18rem" }}>
          {warning ? "Discipline warning" : scenario === "convergence" ? "Strong converged voice" : "Moderate caveated voice"}
        </h3>
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
      </section>
    </div>
  );
}

function StepEvidence({ step, scenario }: { step: StepKey; scenario: ScenarioKey }) {
  const current = SCENARIOS[scenario];
  if (step === "identify") {
    return (
      <div style={{ display: "grid", gap: "0.6rem" }}>
        <p style={bodyTextStyle}>{current.identify}</p>
        {scenario === "convergence" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))", gap: "0.45rem" }}>
            {DEGREES.map((item, index) => (
              <div key={item.planet} style={{ border: `1px solid ${index < 2 ? item.color : HAIRLINE}`, borderRadius: 8, background: index < 2 ? `${item.color}12` : "transparent", padding: "0.6rem" }}>
                <span style={{ color: item.color, fontWeight: 700 }}>{item.role}</span>
                <p style={{ margin: "0.25rem 0 0", color: INK_PRIMARY, fontWeight: 700 }}>{item.planet}</p>
                <p style={{ margin: "0.15rem 0 0", color: INK_MUTED, fontSize: "0.82rem" }}>{item.degree}deg</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
  if (step === "read") return <EvidenceCard icon={<Layers size={18} />} color={GREEN} title="Placement, navamsha, Karakamsha" body={current.read} />;
  if (step === "crossCheck") return <EvidenceCard icon={<GitCompare size={18} />} color={PURPLE} title="AmK vs 10th lord" body={current.cross} />;
  return <EvidenceCard icon={<Scale size={18} />} color={BLUE} title="Confidence tier" body={current.verdict} />;
}

function CaseSvg({ scenario, step, tier, warning }: { scenario: ScenarioKey; step: StepKey; tier: number; warning: boolean }) {
  const stepIndex = STEPS.findIndex((item) => item.key === step);
  const nodes = [
    { label: "Identify", sub: scenario === "convergence" ? "Saturn AmK" : "Moon AmK", color: GOLD },
    { label: "Read", sub: scenario === "convergence" ? "strong AmK" : "public/care", color: GREEN },
    { label: "Cross", sub: scenario === "convergence" ? "same planet" : "field split", color: PURPLE },
    { label: "Tier", sub: tier >= 80 ? "strong" : "caveated", color: tier >= 80 ? GREEN : GOLD },
  ];
  return (
    <svg viewBox="0 0 560 300" role="img" aria-label="Jaimini AmK worked case flow" style={{ width: "100%", maxHeight: 380, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="24" y="38" width="512" height="202" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      {nodes.map((node, index) => {
        const x = 85 + index * 130;
        const active = index === stepIndex;
        const done = index < stepIndex;
        return (
          <g key={node.label}>
            {index < nodes.length - 1 ? <path d={`M ${x + 42} 130 C ${x + 72} 80, ${x + 88} 80, ${x + 130 - 42} 130`} fill="none" stroke={done ? node.color : `${GOLD}55`} strokeWidth={done ? 5 : 3} strokeLinecap="round" /> : null}
            <circle cx={x} cy="130" r={active ? 46 : 38} fill={active || done ? node.color : "#FFF9EA"} stroke={active ? "#fff" : HAIRLINE} strokeWidth={active ? 4 : 2} />
            <text x={x} y="125" textAnchor="middle" fill={active || done ? "#fff" : INK_PRIMARY} fontSize="14" fontWeight="700">{node.label}</text>
            <text x={x} y="146" textAnchor="middle" fill={active || done ? "#fff" : INK_MUTED} fontSize="12" fontWeight="600">{node.sub}</text>
          </g>
        );
      })}
      {scenario === "convergence" ? (
        <circle cx="280" cy="210" r="40" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="4" />
      ) : (
        <path d="M 238 210 C 260 236, 300 236, 322 210" fill="none" stroke={warning ? VERMILION : PURPLE} strokeWidth="5" strokeDasharray="8 7" />
      )}
      <text x="280" y="216" textAnchor="middle" fill={scenario === "convergence" ? GREEN : warning ? VERMILION : PURPLE} fontSize="13" fontWeight="700">
        {scenario === "convergence" ? "AmK = 10L" : "Field divergence"}
      </text>
      <rect x="216" y="256" width="128" height="14" rx="7" fill={`${GOLD}22`} stroke={HAIRLINE} />
      <rect x="216" y="256" width={Math.max(8, Math.min(128, tier * 1.28))} height="14" rx="7" fill={tier >= 80 ? GREEN : tier <= 40 ? VERMILION : GOLD} />
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function EvidenceCard({ icon, color, title, body }: { icon: ReactNode; color: string; title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.8rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{body}</p>
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function stepButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}18` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: 600,
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
