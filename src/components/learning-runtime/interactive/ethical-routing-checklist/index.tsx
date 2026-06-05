"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, GitCompare, HeartPulse, RotateCcw, ShieldCheck } from "lucide-react";
import { useLessonSlug } from "../rashi-attribute-wheel";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const D60_SLUG = "d60-honest-handling-substrate-not-destiny";

type ScenarioKey = "vigilance" | "catastrophe" | "mortality" | "symptoms";
type TimingState = "none" | "possible" | "active";
type ChartState = "strong" | "mixed" | "strained";

const SCENARIOS: Record<ScenarioKey, {
  label: string;
  unsafe: string;
  domain: string;
  safeLead: string;
  referral: string;
}> = {
  vigilance: {
    label: "D30 health signal",
    unsafe: "Your D30 shows disease in this area.",
    domain: "routine health and vitality",
    safeLead: "This area may benefit from extra attention and routine care",
    referral: "For health concerns, please consult a qualified medical professional.",
  },
  catastrophe: {
    label: "Catastrophic phrasing",
    unsafe: "You will get this disease.",
    domain: "the indicated vulnerability domain",
    safeLead: "The chart suggests a tendency to watch, not a fixed event",
    referral: "Keep the guidance practical: check symptoms with a doctor, not astrology.",
  },
  mortality: {
    label: "Mortality question",
    unsafe: "When will I die?",
    domain: "longevity and mortality",
    safeLead: "I will not give a mortality prediction from D30 or any single factor",
    referral: "I can redirect this toward constructive health support and appropriate care.",
  },
  symptoms: {
    label: "Symptoms described",
    unsafe: "Tell me astrologically what illness this is.",
    domain: "current symptoms",
    safeLead: "Current symptoms need medical assessment first",
    referral: "Please contact a doctor or urgent-care service according to severity.",
  },
};

const BOUNDARY_COPY = [
  { key: "diagnosis", label: "No diagnosis", text: "Do not name a specific medical condition from D30." },
  { key: "catastrophe", label: "No catastrophising", text: "No fixed disease or doom statement." },
  { key: "mortality", label: "No mortality from D30", text: "Do not read death timing from one varga." },
  { key: "referral", label: "No bypassing care", text: "Route health questions to professionals." },
] as const;

type BoundaryKey = (typeof BOUNDARY_COPY)[number]["key"];

export function EthicalRoutingChecklist() {
  const slug = useLessonSlug();
  if (slug === D60_SLUG) return <D60EthicalRoutingChecklist />;
  return <D30EthicalRoutingChecklist />;
}

function D30EthicalRoutingChecklist() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("vigilance");
  const [boundaries, setBoundaries] = useState<Record<BoundaryKey, boolean>>({
    diagnosis: true,
    catastrophe: true,
    mortality: true,
    referral: true,
  });
  const [timing, setTiming] = useState<TimingState>("possible");
  const [chartState, setChartState] = useState<ChartState>("mixed");
  const [showTemplate, setShowTemplate] = useState(true);

  const scenario = SCENARIOS[scenarioKey];
  const passedCount = Object.values(boundaries).filter(Boolean).length;
  const allBoundariesPassed = passedCount === BOUNDARY_COPY.length;
  const dangerColor = allBoundariesPassed ? GREEN : VERMILION;
  const timingPhrase = timing === "active" ? "especially during supported dasha/transit periods" : timing === "possible" ? "if timing also supports it" : "without claiming present activation";
  const chartPhrase = chartState === "strong" ? "A strong D1/D9 may mitigate the concern." : chartState === "mixed" ? "The whole chart should be weighed before saying more." : "Because D1/D9 are strained, use extra care and keep the statement practical.";

  const generatedStatement = useMemo(() => {
    if (!allBoundariesPassed) {
      return "Pause the reading. A hard boundary is still open, so do not deliver a D30 health statement yet.";
    }
    if (scenarioKey === "mortality") {
      return `${scenario.safeLead}. D30 can support constructive vigilance, not a fear-based death verdict. ${chartPhrase} ${scenario.referral}`;
    }
    if (scenarioKey === "symptoms") {
      return `${scenario.safeLead}. Astrology is not a diagnostic tool; D30 can only frame vigilance after care is not delayed. ${scenario.referral}`;
    }
    return `${scenario.safeLead} in ${scenario.domain}, ${timingPhrase}. ${chartPhrase} ${scenario.referral}`;
  }, [allBoundariesPassed, chartPhrase, scenario, scenarioKey, timingPhrase]);

  const reset = () => {
    setScenarioKey("vigilance");
    setBoundaries({ diagnosis: true, catastrophe: true, mortality: true, referral: true });
    setTiming("possible");
    setChartState("mixed");
    setShowTemplate(true);
  };

  return (
    <div data-interactive="ethical-routing-checklist" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D30 ethical routing</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Turn risk language into vigilance support</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Walk a D30 health or misfortune signal through the four hard boundaries. The output is safe only when claim, disclaimer, and referral are all present.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Selected case</p>
              <h3 style={{ margin: "0.2rem 0 0", color: dangerColor, fontSize: "1.2rem" }}>{scenario.label}</h3>
            </div>
            <strong style={{ color: dangerColor }}>{passedCount}/4 boundaries</strong>
          </div>

          <EthicsFlowSvg passedCount={passedCount} allPassed={allBoundariesPassed} />

          <div style={{ border: `1px solid ${dangerColor}66`, borderRadius: 8, background: `${dangerColor}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Unsafe input</p>
            <h4 style={{ margin: "0.2rem 0", color: VERMILION, fontSize: "1.05rem" }}>&quot;{scenario.unsafe}&quot;</h4>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {allBoundariesPassed ? "Ready to reframe as a tendency with referral." : "Not ready. Complete the hard boundaries before speaking."}
            </p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Choose practice case" icon={<AlertTriangle size={18} />} color={VERMILION}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))", gap: "0.45rem" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setScenarioKey(key)} style={buttonStyle(scenarioKey === key, key === "mortality" || key === "symptoms" ? VERMILION : BLUE)}>
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Four hard boundaries" icon={<ShieldCheck size={18} />} color={dangerColor}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {BOUNDARY_COPY.map((item) => (
                <label key={item.key} style={checkRowStyle(boundaries[item.key], boundaries[item.key] ? GREEN : VERMILION)}>
                  <input
                    type="checkbox"
                    checked={boundaries[item.key]}
                    onChange={(event) => setBoundaries((current) => ({ ...current, [item.key]: event.target.checked }))}
                  />
                  <span>
                    <strong>{item.label}</strong>
                    <small style={{ display: "block", color: INK_MUTED, marginTop: 2 }}>{item.text}</small>
                  </span>
                </label>
              ))}
            </div>
          </Panel>

          <Panel title="Timing and whole chart" icon={<GitCompare size={18} />} color={GOLD}>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              {(["none", "possible", "active"] as TimingState[]).map((item) => (
                <button key={item} type="button" onClick={() => setTiming(item)} style={buttonStyle(timing === item, item === "active" ? VERMILION : item === "possible" ? GOLD : GREEN)}>
                  {item === "none" ? "No activation" : item === "possible" ? "Needs timing" : "Timing supports"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              {(["strong", "mixed", "strained"] as ChartState[]).map((item) => (
                <button key={item} type="button" onClick={() => setChartState(item)} style={buttonStyle(chartState === item, item === "strong" ? GREEN : item === "mixed" ? GOLD : VERMILION)}>
                  {item === "strong" ? "D1/D9 strong" : item === "mixed" ? "Mixed chart" : "D1/D9 strained"}
                </button>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        <Panel title="Vigilance statement" icon={<HeartPulse size={18} />} color={dangerColor}>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 600 }}>{generatedStatement}</p>
          <button type="button" onClick={() => setShowTemplate((value) => !value)} style={buttonStyle(showTemplate, BLUE)}>
            {showTemplate ? "Template shown" : "Show template"}
          </button>
          {showTemplate ? (
            <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}10`, padding: "0.8rem" }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
                &quot;This indicates a tendency that may benefit from extra care, not a diagnosis or certainty. Please consult a qualified professional for health concerns.&quot;
              </p>
            </div>
          ) : null}
        </Panel>

        <Panel title="Triple-care standard" icon={<BadgeCheck size={18} />} color={GREEN}>
          <CareRow active={allBoundariesPassed} label="Care in claim" body="Tendency, not destiny; no disease verdict." />
          <CareRow active={allBoundariesPassed} label="Care in disclaimer" body="D30 is one layer; timing and whole chart matter." />
          <CareRow active={boundaries.referral} label="Care in referral" body="Health questions go to medical professionals." />
        </Panel>
      </div>
    </div>
  );
}

function EthicsFlowSvg({ passedCount, allPassed }: { passedCount: number; allPassed: boolean }) {
  const nodes = [
    { label: "D30 signal", color: GOLD },
    { label: "Hard boundaries", color: passedCount === 4 ? GREEN : VERMILION },
    { label: "Timing + D1/D9", color: BLUE },
    { label: "Referral + disclaimer", color: allPassed ? GREEN : VERMILION },
  ];

  return (
    <svg viewBox="0 0 620 320" role="img" aria-label="D30 ethical routing flow" style={svgStyle}>
      <rect x="34" y="34" width="552" height="248" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="64" textAnchor="middle" fill={INK_MUTED} fontSize="12.5" fontWeight="750">D30 health signal must pass through duty-of-care gates</text>
      {nodes.map((node, index) => {
        const x = 64 + index * 132;
        const active = index === 1 ? passedCount < 4 : index === 3 ? allPassed : true;
        return (
          <g key={node.label}>
            {index > 0 ? <line x1={x - 48} y1="154" x2={x - 14} y2="154" stroke={active ? node.color : HAIRLINE} strokeWidth="4" strokeLinecap="round" /> : null}
            <rect x={x} y="104" width="108" height="100" rx="8" fill={`${node.color}16`} stroke={node.color} strokeWidth={active ? 3 : 1.2} />
            <circle cx={x + 54} cy="130" r="14" fill={node.color} opacity={active ? 1 : 0.55} />
            <text x={x + 54} y="135" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">{index + 1}</text>
            <text x={x + 54} y="168" textAnchor="middle" fill={node.color} fontSize="11.5" fontWeight="800">{node.label}</text>
            <text x={x + 54} y="188" textAnchor="middle" fill={INK_MUTED} fontSize="10">{index === 1 ? `${passedCount}/4 clear` : index === 3 ? (allPassed ? "safe wording" : "pause") : "context"}</text>
          </g>
        );
      })}
      <text x="310" y="246" textAnchor="middle" fill={allPassed ? GREEN : VERMILION} fontSize="12.5" fontWeight="800">
        {allPassed ? "Deliver vigilance-support, not fear." : "Pause: a hard boundary still needs attention."}
      </text>
    </svg>
  );
}

type D60CaseKey = "substrate" | "badKarma" | "pastLife" | "manipulation";
type SadhanaPath = "karma" | "bhakti" | "jnana" | "yoga";

const D60_SCENARIOS: Record<D60CaseKey, {
  label: string;
  unsafe: string;
  growthArea: string;
  safeLead: string;
}> = {
  substrate: {
    label: "D60 substrate finding",
    unsafe: "This D60 shows a bad karmic substrate.",
    growthArea: "the inherited pressure shown by the substrate",
    safeLead: "This substrate points to a growth-area worth conscious work",
  },
  badKarma: {
    label: "Bad-karma phrasing",
    unsafe: "Your karma is bad; you are spiritually doomed.",
    growthArea: "the fear-loaded karmic theme",
    safeLead: "The chart can describe inherited starting-conditions, not spiritual worth",
  },
  pastLife: {
    label: "Past-life claim",
    unsafe: "In a past life you did this, so now you suffer.",
    growthArea: "the question of meaning and accountability",
    safeLead: "I will not assert unverifiable past-life specifics; we can work with the present pattern",
  },
  manipulation: {
    label: "Manipulation risk",
    unsafe: "This is serious karma; you need more paid sessions to fix it.",
    growthArea: "the temptation to use D60 gravity as leverage",
    safeLead: "D60 language must empower and clarify, never extract emotion or money",
  },
};

const D60_MALPRACTICES = [
  { key: "catastrophe", label: "No catastrophising", text: "Do not call the substrate bad karma or spiritual doom." },
  { key: "determinism", label: "No false determinism", text: "Do not turn inherited ground into fixed destiny." },
  { key: "pastLife", label: "No past-life claims", text: "Do not assert unverifiable past-life causes." },
  { key: "manipulation", label: "No manipulation", text: "Do not use D60 gravity to extract emotion or money." },
] as const;

type D60BoundaryKey = (typeof D60_MALPRACTICES)[number]["key"];

const SADHANA_PATHS: Record<SadhanaPath, { label: string; body: string; color: string }> = {
  karma: { label: "Karma", body: "right action, service, duty, repair through conduct", color: BLUE },
  bhakti: { label: "Bhakti", body: "devotion, surrender, prayerful softening", color: VERMILION },
  jnana: { label: "Jnana", body: "study, discernment, truth-facing insight", color: "#7A5BA6" },
  yoga: { label: "Yoga", body: "discipline, embodied practice, steadiness", color: GREEN },
};

function D60EthicalRoutingChecklist() {
  const [caseKey, setCaseKey] = useState<D60CaseKey>("substrate");
  const [boundaries, setBoundaries] = useState<Record<D60BoundaryKey, boolean>>({
    catastrophe: true,
    determinism: true,
    pastLife: true,
    manipulation: true,
  });
  const [pathKey, setPathKey] = useState<SadhanaPath>("yoga");
  const [wholeChart, setWholeChart] = useState<"weighed" | "notWeighed">("weighed");
  const [showTemplate, setShowTemplate] = useState(true);

  const scenario = D60_SCENARIOS[caseKey];
  const passedCount = Object.values(boundaries).filter(Boolean).length;
  const allBoundariesPassed = passedCount === D60_MALPRACTICES.length;
  const dangerColor = allBoundariesPassed && wholeChart === "weighed" ? GREEN : VERMILION;
  const path = SADHANA_PATHS[pathKey];
  const generatedStatement = useMemo(() => {
    if (!allBoundariesPassed) return "Pause the reading. A D60 malpractice is still open, so do not deliver a substrate statement yet.";
    if (wholeChart !== "weighed") return "Pause the reading. D60 must be weighed with the whole chart before any substrate language is spoken.";
    return `${scenario.safeLead}: ${scenario.growthArea}. Frame this as inherited starting-conditions, not destiny. A constructive path can include ${path.label.toLowerCase()} practice: ${path.body}.`;
  }, [allBoundariesPassed, path, scenario, wholeChart]);

  const reset = () => {
    setCaseKey("substrate");
    setBoundaries({ catastrophe: true, determinism: true, pastLife: true, manipulation: true });
    setPathKey("yoga");
    setWholeChart("weighed");
    setShowTemplate(true);
  };

  return (
    <div data-interactive="ethical-routing-checklist" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D60 honest handling</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Convert substrate fear into agency</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Walk a D60 substrate statement through the four forbidden malpractices. The output is safe only when it names starting-conditions, preserves agency, and gives a constructive path.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Selected case</p>
              <h3 style={{ margin: "0.2rem 0 0", color: dangerColor, fontSize: "1.2rem" }}>{scenario.label}</h3>
            </div>
            <strong style={{ color: dangerColor }}>{passedCount}/4 filters</strong>
          </div>

          <D60EthicsFlowSvg passedCount={passedCount} allPassed={allBoundariesPassed && wholeChart === "weighed"} />

          <div style={{ border: `1px solid ${dangerColor}66`, borderRadius: 8, background: `${dangerColor}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Unsafe input</p>
            <h4 style={{ margin: "0.2rem 0", color: VERMILION, fontSize: "1.05rem" }}>&quot;{scenario.unsafe}&quot;</h4>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {allBoundariesPassed && wholeChart === "weighed" ? "Ready to reframe as modifiable substrate with a path." : "Not ready. Complete the ethical filters and whole-chart check first."}
            </p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Choose practice case" icon={<AlertTriangle size={18} />} color={VERMILION}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))", gap: "0.45rem" }}>
              {(Object.keys(D60_SCENARIOS) as D60CaseKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setCaseKey(key)} style={buttonStyle(caseKey === key, key === "substrate" ? BLUE : VERMILION)}>
                  {D60_SCENARIOS[key].label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Four forbidden malpractices" icon={<ShieldCheck size={18} />} color={dangerColor}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {D60_MALPRACTICES.map((item) => (
                <label key={item.key} style={checkRowStyle(boundaries[item.key], boundaries[item.key] ? GREEN : VERMILION)}>
                  <input
                    type="checkbox"
                    checked={boundaries[item.key]}
                    onChange={(event) => setBoundaries((current) => ({ ...current, [item.key]: event.target.checked }))}
                  />
                  <span>
                    <strong>{item.label}</strong>
                    <small style={{ display: "block", color: INK_MUTED, marginTop: 2 }}>{item.text}</small>
                  </span>
                </label>
              ))}
            </div>
          </Panel>

          <Panel title="Whole-chart and path" icon={<GitCompare size={18} />} color={wholeChart === "weighed" ? GREEN : VERMILION}>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              <button type="button" onClick={() => setWholeChart("weighed")} style={buttonStyle(wholeChart === "weighed", GREEN)}>Whole chart weighed</button>
              <button type="button" onClick={() => setWholeChart("notWeighed")} style={buttonStyle(wholeChart === "notWeighed", VERMILION)}>D60 alone</button>
            </div>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              {(Object.keys(SADHANA_PATHS) as SadhanaPath[]).map((key) => (
                <button key={key} type="button" onClick={() => setPathKey(key)} style={buttonStyle(pathKey === key, SADHANA_PATHS[key].color)}>
                  {SADHANA_PATHS[key].label}
                </button>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        <Panel title="Empowerment statement" icon={<HeartPulse size={18} />} color={dangerColor}>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 600 }}>{generatedStatement}</p>
          <button type="button" onClick={() => setShowTemplate((value) => !value)} style={buttonStyle(showTemplate, BLUE)}>
            {showTemplate ? "Template shown" : "Show template"}
          </button>
          {showTemplate ? (
            <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}10`, padding: "0.8rem" }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
                &quot;This substrate suggests a growth-area to work with consciously. It is inherited ground, not fixed destiny; the path is practical effort, sadhana, and agency.&quot;
              </p>
            </div>
          ) : null}
        </Panel>

        <Panel title="Triple-care standard" icon={<BadgeCheck size={18} />} color={GREEN}>
          <CareRow active={allBoundariesPassed} label="Care in claim" body="Substrate, not destiny; no doom verdict." />
          <CareRow active={wholeChart === "weighed"} label="Care in context" body="D60 is weighed with the whole chart and rectified time." />
          <CareRow active={allBoundariesPassed && wholeChart === "weighed"} label="Care in agency" body="Every statement leaves a path and never extracts fear." />
        </Panel>
      </div>
    </div>
  );
}

function D60EthicsFlowSvg({ passedCount, allPassed }: { passedCount: number; allPassed: boolean }) {
  const nodes = [
    { label: "D60 substrate", color: GOLD },
    { label: "4 malpractices", color: passedCount === 4 ? GREEN : VERMILION },
    { label: "Whole chart", color: BLUE },
    { label: "Agency path", color: allPassed ? GREEN : VERMILION },
  ];

  return (
    <svg viewBox="0 0 620 430" role="img" aria-label="D60 ethical routing flow" style={{ ...svgStyle, maxHeight: 460 }}>
      <rect x="34" y="34" width="552" height="350" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="800">
        <tspan x="310">D60 Substrate Must Empower</tspan>
        <tspan x="310" dy="21">Never Create Fear</tspan>
      </text>
      {nodes.map((node, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = 104 + col * 260;
        const y = 108 + row * 118;
        const active = index === 1 ? passedCount < 4 : index === 3 ? allPassed : true;
        return (
          <g key={node.label}>
            {index > 0 ? <line x1={index === 2 ? 310 : x - 54} y1={index === 2 ? y - 22 : y + 50} x2={index === 2 ? 310 : x - 16} y2={index === 2 ? y + 6 : y + 50} stroke={active ? node.color : HAIRLINE} strokeWidth="4" strokeLinecap="round" /> : null}
            <rect x={x} y={y} width="152" height="92" rx="8" fill={`${node.color}16`} stroke={node.color} strokeWidth={active ? 3 : 1.2} />
            <circle cx={x + 28} cy={y + 28} r="14" fill={node.color} opacity={active ? 1 : 0.55} />
            <text x={x + 28} y={y + 33} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">{index + 1}</text>
            <text x={x + 88} y={y + 32} textAnchor="middle" fill={node.color} fontSize="14" fontWeight="800">{node.label}</text>
            <text x={x + 88} y={y + 59} textAnchor="middle" fill={INK_PRIMARY} fontSize="12.5" fontWeight="750">{index === 1 ? `${passedCount}/4 clear` : index === 3 ? (allPassed ? "empower" : "pause") : "context"}</text>
          </g>
        );
      })}
      <text x="310" y="348" textAnchor="middle" fill={allPassed ? GREEN : VERMILION} fontSize="15" fontWeight="800">
        {allPassed ? "Deliver agency-centred substrate language." : "Pause: D60 language is not safe yet."}
      </text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
    </section>
  );
}

function CareRow({ active, label, body }: { active: boolean; label: string; body: string }) {
  const color = active ? GREEN : VERMILION;
  return (
    <div style={{ display: "flex", gap: "0.55rem", alignItems: "start", color: INK_SECONDARY }}>
      <BadgeCheck size={17} color={color} style={{ marginTop: 2, flexShrink: 0 }} aria-hidden="true" />
      <span>
        <strong style={{ color }}>{label}</strong>
        <span style={{ display: "block", marginTop: 2 }}>{body}</span>
      </span>
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.42rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 700,
    cursor: "pointer",
    minHeight: 38,
  };
}

function checkRowStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "start",
    gap: "0.55rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: INK_SECONDARY,
    padding: "0.62rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

const surfaceStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.78rem",
  fontWeight: 800,
};

const svgStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
  margin: "0.85rem 0",
};
