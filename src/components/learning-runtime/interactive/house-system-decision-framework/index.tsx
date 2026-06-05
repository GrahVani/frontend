"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, Compass, GitCompare, Layers, RotateCcw, TriangleAlert } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";

type ScenarioKey = "ordinary" | "boundary" | "strength" | "kp" | "polar" | "lalKitab" | "cross";

const SCENARIOS: Record<ScenarioKey, {
  label: string;
  situation: string;
  primary: string;
  secondary: string;
  avoid: string;
  reason: string;
  color: string;
}> = {
  ordinary: {
    label: "Ordinary Parashari",
    situation: "Standard Parashari reading, planets comfortably placed away from boundaries.",
    primary: "Whole-sign",
    secondary: "None needed",
    avoid: "Adding cusp systems without a reason",
    reason: "Whole-sign is the Tier-1 default and keeps the life-domain reading clear.",
    color: GREEN,
  },
  boundary: {
    label: "Boundary planet",
    situation: "Saturn sits about 1 degree from a sign edge.",
    primary: "Whole-sign base",
    secondary: "Bhava Chalita check",
    avoid: "Pretending the boundary is clean",
    reason: "Use the default first, then use Bhava Chalita to resolve cusp and sandhi sensitivity.",
    color: GOLD,
  },
  strength: {
    label: "Bhava-bala",
    situation: "You need to judge how strongly an occupant contributes to a house.",
    primary: "Bhava Chalita / Sripati",
    secondary: "Whole-sign context",
    avoid: "Treating all occupants as equally strong",
    reason: "House-strength depends on distance from cusp/madhya and sandhi.",
    color: GOLD,
  },
  kp: {
    label: "KP work",
    situation: "You are reading a KP chart or a KP practitioner's house claim.",
    primary: "Placidus",
    secondary: "KP sub-lord chain",
    avoid: "Judging KP by Parashari whole-sign rules",
    reason: "Placidus is mandatory inside KP, and KP adds cuspal sub-lords.",
    color: BLUE,
  },
  polar: {
    label: "Extreme latitude",
    situation: "Birth is beyond roughly 66 degrees latitude.",
    primary: "Whole-sign or equal-house",
    secondary: "State why Placidus is avoided",
    avoid: "Forcing Placidus",
    reason: "Placidus can distort or fail near the polar circles.",
    color: VERMILION,
  },
  lalKitab: {
    label: "Lal Kitab",
    situation: "You are applying Lal Kitab rules or remedies.",
    primary: "Fixed-Aries framework",
    secondary: "Name it as Lal Kitab",
    avoid: "Mixing Lal Kitab houses into a standard Parashari reading",
    reason: "Lal Kitab uses its own fixed framework and should be handled as a stream convention.",
    color: VERMILION,
  },
  cross: {
    label: "Cross-validation",
    situation: "A KP reading says Mars in the 11th while a Parashari reading says Mars in the 10th.",
    primary: "Label both systems",
    secondary: "Compare without crowning a winner",
    avoid: "Unlabelled switching",
    reason: "The difference is methodological. Naming the system turns contradiction into comparison.",
    color: BLUE,
  },
};

const FLOW_STEPS = [
  { label: "Start with question", detail: "What kind of reading is this?" },
  { label: "Choose system", detail: "Default or special-case convention." },
  { label: "Name result", detail: "Attach the method to every house claim." },
  { label: "Cross-check carefully", detail: "Disagreement is a flag, not a failure." },
];

export function HouseSystemDecisionFramework() {
  const [scenario, setScenario] = useState<ScenarioKey>("ordinary");
  const [labelsOn, setLabelsOn] = useState(true);
  const [useCrossCheck, setUseCrossCheck] = useState(false);

  const active = SCENARIOS[scenario];
  const specialCase = scenario !== "ordinary";
  const risky = !labelsOn || scenario === "polar" || scenario === "lalKitab";

  const verdict = useMemo(() => {
    if (!labelsOn) {
      return "Unsafe framing: the house claim is not checkable because the system is not named.";
    }
    if (scenario === "cross") {
      return "Good reconciliation: keep both claims, label each system, and treat the difference as methodological.";
    }
    if (scenario === "ordinary" && useCrossCheck) {
      return "Cross-checking is allowed, but it should not replace the default. Whole-sign remains the primary Tier-1 reading.";
    }
    return `${active.primary} is the right choice here. ${active.reason}`;
  }, [active.primary, active.reason, labelsOn, scenario, useCrossCheck]);

  return (
    <div data-interactive="house-system-decision-framework" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>House-system decision framework</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Choose by situation, then name the system
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Pick a reading situation and see which house system belongs there, what to cross-check, and what mistake to avoid.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenario("ordinary");
              setLabelsOn(true);
              setUseCrossCheck(false);
            }}
            style={buttonStyle(false, BLUE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(330px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Decision map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>{active.label}</h3>
            </div>
            <strong style={{ color: specialCase ? active.color : GREEN }}>{specialCase ? "Special case" : "Tier-1 default"}</strong>
          </div>

          <DecisionSvg scenario={scenario} labelsOn={labelsOn} useCrossCheck={useCrossCheck} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            <ResultCard title="Primary use" value={active.primary} color={active.color} note={active.reason} />
            <ResultCard title="Secondary lens" value={active.secondary} color={useCrossCheck || scenario !== "ordinary" ? BLUE : GOLD} note="Use only when the situation calls for it." />
            <ResultCard title="Avoid" value={active.avoid} color={VERMILION} note="This is where multi-system confusion enters." />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Choose the situation" icon={<Compass size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setScenario(key)} style={buttonStyle(scenario === key, BLUE)}>
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{active.situation}</p>
          </Panel>

          <Panel title="Naming discipline" icon={<BadgeCheck size={18} />} color={labelsOn ? GREEN : VERMILION}>
            <button type="button" aria-pressed={labelsOn} onClick={() => setLabelsOn((value) => !value)} style={buttonStyle(labelsOn, labelsOn ? GREEN : VERMILION)}>
              {labelsOn ? "System labels on" : "System labels off"}
            </button>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {labelsOn ? "Every house claim names its method." : "Claims like Mars in the 1st become ambiguous and hard to compare."}
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <Panel title="Cross-validation" icon={<GitCompare size={18} />} color={useCrossCheck ? BLUE : GOLD}>
          <button type="button" aria-pressed={useCrossCheck} onClick={() => setUseCrossCheck((value) => !value)} style={buttonStyle(useCrossCheck, BLUE)}>
            {useCrossCheck ? "Cross-check on" : "Primary system only"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {useCrossCheck ? "Use additional systems as labelled comparison layers, not as silent replacements." : "A clean primary reading is enough unless a specific question asks for another layer."}
          </p>
        </Panel>

        <Panel title="Framework spine" icon={<Layers size={18} />} color={GOLD}>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {FLOW_STEPS.map((step, index) => (
              <div key={step.label} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: "0.55rem", alignItems: "start" }}>
                <span style={{ width: 24, height: 24, borderRadius: 999, background: index === 2 && labelsOn ? GREEN : `${GOLD}22`, border: `1px solid ${index === 2 && labelsOn ? GREEN : HAIRLINE}`, color: index === 2 && labelsOn ? "#fff" : GOLD, display: "grid", placeItems: "center", fontWeight: 950, fontSize: 12 }}>{index + 1}</span>
                <span>
                  <strong style={{ display: "block", color: INK_PRIMARY }}>{step.label}</strong>
                  <span style={{ color: INK_MUTED, lineHeight: 1.35 }}>{step.detail}</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <section style={{ border: `1px solid ${risky ? VERMILION : GOLD}66`, borderRadius: 8, background: `${risky ? VERMILION : GOLD}12`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: risky ? VERMILION : GOLD, fontWeight: 950 }}>
            <TriangleAlert size={18} />
            Decision verdict
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{verdict}</p>
        </section>
      </div>
    </div>
  );
}

function DecisionSvg({ scenario, labelsOn, useCrossCheck }: { scenario: ScenarioKey; labelsOn: boolean; useCrossCheck: boolean }) {
  const active = SCENARIOS[scenario];
  const nodes = [
    { key: "whole", label: "Whole-sign", x: 104, y: 80, color: GREEN },
    { key: "chalita", label: "Bhava Chalita", x: 290, y: 80, color: GOLD },
    { key: "placidus", label: "Placidus / KP", x: 476, y: 80, color: BLUE },
    { key: "equal", label: "Whole/equal", x: 198, y: 210, color: GREEN },
    { key: "lal", label: "Lal Kitab fixed", x: 384, y: 210, color: VERMILION },
  ];
  const activeNode = scenario === "kp" || scenario === "cross" ? "placidus" : scenario === "boundary" || scenario === "strength" ? "chalita" : scenario === "polar" ? "equal" : scenario === "lalKitab" ? "lal" : "whole";

  return (
    <svg viewBox="0 0 620 320" role="img" aria-label="House-system decision map" style={{ width: "100%", maxHeight: 370, margin: "0.6rem auto 0.9rem", display: "block" }}>
      <rect x="34" y="34" width="552" height="252" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="56" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900">Select a tool for the job</text>
      <path d="M104 106 C130 145, 172 170, 198 184" fill="none" stroke={`${GOLD}66`} strokeWidth="2" />
      <path d="M290 108 C276 150, 244 176, 198 194" fill="none" stroke={`${GOLD}66`} strokeWidth="2" />
      <path d="M476 108 C450 146, 418 176, 384 194" fill="none" stroke={`${GOLD}66`} strokeWidth="2" />
      <path d="M290 108 C320 148, 350 176, 384 194" fill="none" stroke={`${GOLD}66`} strokeWidth="2" />
      {nodes.map((node) => {
        const isActive = activeNode === node.key;
        const isComparison = useCrossCheck && (node.key === "whole" || node.key === "chalita" || node.key === "placidus");
        return (
          <g key={node.key}>
            <circle cx={node.x} cy={node.y} r={isActive ? 42 : 34} fill={`${node.color}${isActive ? "2B" : "16"}`} stroke={isActive || isComparison ? node.color : HAIRLINE} strokeWidth={isActive ? 4 : 2} />
            <text x={node.x} y={node.y - 2} textAnchor="middle" fill={isActive ? node.color : INK_PRIMARY} fontSize="12" fontWeight="950">{labelsOn ? node.label : "House claim"}</text>
            <text x={node.x} y={node.y + 15} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="850">{isActive ? "chosen" : isComparison ? "check" : "available"}</text>
          </g>
        );
      })}
      <rect x="170" y="264" width="280" height="30" rx="8" fill={`${active.color}16`} stroke={`${active.color}66`} />
      <text x="310" y="284" textAnchor="middle" fill={active.color} fontSize="12" fontWeight="950">
        {labelsOn ? `${active.primary}: named result` : "Unlabelled result: unsafe"}
      </text>
    </svg>
  );
}

function ResultCard({ title, value, color, note }: { title: string; value: string; color: string; note: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.75rem" }}>
      <div style={{ color, fontWeight: 950 }}>{title}</div>
      <strong style={{ display: "block", marginTop: "0.45rem", color: INK_PRIMARY }}>{value}</strong>
      <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, lineHeight: 1.4 }}>{note}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
    </section>
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
    padding: "0.52rem 0.68rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
