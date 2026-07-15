"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  ChevronsRight,
  Clock3,
  Layers3,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ScenarioKey = "caveat" | "disagree" | "samePlanet" | "noKaraka";
type Signal = "favourable" | "unfavourable" | "absent";

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

const SCENARIOS: Record<ScenarioKey, {
  label: string;
  matter: string;
  lord: Signal;
  karaka: Signal;
  occupant: Signal;
  aspect: Signal;
  dashaAligned: boolean;
  samePlanet: boolean;
  verdict: string;
  detail: string;
  color: string;
}> = {
  caveat: {
    label: "Example 1 caveat",
    matter: "Career",
    lord: "favourable",
    karaka: "favourable",
    occupant: "unfavourable",
    aspect: "absent",
    dashaAligned: true,
    samePlanet: false,
    verdict: "Favourable with complication",
    detail: "Primary tier agrees; the debilitated malefic occupant becomes a named caveat, not a reversal.",
    color: GREEN,
  },
  disagree: {
    label: "Primary disagreement",
    matter: "Marriage",
    lord: "favourable",
    karaka: "unfavourable",
    occupant: "favourable",
    aspect: "favourable",
    dashaAligned: false,
    samePlanet: false,
    verdict: "Mixed; secondary tier decides",
    detail: "When lord and karaka disagree, occupants and aspects move from refinement to decision.",
    color: GOLD,
  },
  samePlanet: {
    label: "Same planet special",
    matter: "Litigation",
    lord: "favourable",
    karaka: "favourable",
    occupant: "absent",
    aspect: "favourable",
    dashaAligned: true,
    samePlanet: true,
    verdict: "Single strong primary read",
    detail: "Mars serves as both 6th lord and litigation karaka, so it is doubly-weighted but not double-counted.",
    color: BLUE,
  },
  noKaraka: {
    label: "No karaka case",
    matter: "Lost object",
    lord: "favourable",
    karaka: "absent",
    occupant: "unfavourable",
    aspect: "favourable",
    dashaAligned: false,
    samePlanet: false,
    verdict: "Mixed; four lines carry the case",
    detail: "No dedicated lost-object karaka exists here, so the blank primary line is reported honestly.",
    color: PURPLE,
  },
};

const SIGNAL_COPY: Record<Signal, { label: string; color: string }> = {
  favourable: { label: "Favourable", color: GREEN },
  unfavourable: { label: "Unfavourable", color: VERMILION },
  absent: { label: "Not applicable", color: GOLD },
};

export function ParashariPrashnaWeighingProcedure() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("caveat");
  const [preserveHierarchy, setPreserveHierarchy] = useState(true);
  const [singleCaveatOnly, setSingleCaveatOnly] = useState(true);
  const [samePlanetFlag, setSamePlanetFlag] = useState(true);
  const [dashaAsTiming, setDashaAsTiming] = useState(true);

  const scenario = SCENARIOS[scenarioKey];
  const primaryClear = scenario.lord === scenario.karaka && scenario.karaka !== "absent";
  const primaryMixed = scenario.lord !== scenario.karaka || scenario.karaka === "absent";
  const ready = preserveHierarchy && singleCaveatOnly && samePlanetFlag && dashaAsTiming;

  const feedback = useMemo(() => {
    if (!preserveHierarchy) return "Repair: do not vote-count all five lines. House-lord and karaka form the primary tier.";
    if (!singleCaveatOnly) return "Repair: one secondary affliction against a strong primary tier is a caveat, not an automatic reversal.";
    if (!samePlanetFlag) return "Repair: when one planet serves both roles, label it as one doubly-weighted primary read.";
    if (!dashaAsTiming) return "Repair: dasha-bhukti answers timing and near-term support; it does not flatten the verdict hierarchy.";
    return scenario.detail;
  }, [dashaAsTiming, preserveHierarchy, samePlanetFlag, scenario.detail, singleCaveatOnly]);

  return (
    <div data-interactive="parashari-prashna-weighing-procedure" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Parashari weighing procedure</p>
            <h2 style={headingStyle}>Primary tier frames the verdict; secondary tier refines or decides</h2>
            <p style={bodyStyle}>
              Work the five evidence lines as a hierarchy: house-lord and karaka first, occupants and aspects second, dasha for timing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenarioKey("caveat");
              setPreserveHierarchy(true);
              setSingleCaveatOnly(true);
              setSamePlanetFlag(true);
              setDashaAsTiming(true);
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
            <p style={eyebrowStyle}>Two-tier flow</p>
            <div style={segmentedStyle}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setScenarioKey(key)} aria-pressed={scenarioKey === key} style={viewButtonStyle(scenarioKey === key)}>
                  {SCENARIOS[key].label}
                </button>
              ))}
            </div>
          </div>
          <WeighingDiagram scenario={scenario} primaryClear={primaryClear} primaryMixed={primaryMixed} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: scenario.color }}>
            <Layers3 size={16} />
            <p style={eyebrowStyle}>{scenario.matter}</p>
          </div>
          <h3 style={panelTitleStyle}>{scenario.verdict}</h3>
          <p style={bodyStyle}>{scenario.detail}</p>
          <div style={{ ...noticeStyle(scenario.color), marginTop: "1rem" }}>
            <Scale size={18} />
            <span>{primaryClear ? "Primary tier gives a directional lean before refinement." : "Primary tier is mixed, so secondary evidence becomes decisive."}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Evidence panel</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            <EvidenceRow tier="Primary" label="House-lord condition" signal={scenario.lord} />
            <EvidenceRow tier="Primary" label={scenario.samePlanet ? "Karaka condition: same planet" : "Karaka condition"} signal={scenario.karaka} />
            <EvidenceRow tier="Secondary" label="Occupants of matter-house" signal={scenario.occupant} />
            <EvidenceRow tier="Secondary" label="Aspects received" signal={scenario.aspect} />
            <div style={timingStyle(scenario.dashaAligned)}>
              <Clock3 size={16} />
              <span>
                <span style={{ display: "block", fontWeight: 500 }}>{scenario.dashaAligned ? "Dasha aligned" : "Dasha not aligned"}</span>
                <span style={smallTextStyle}>{scenario.dashaAligned ? "Near-term support appears." : "No near-term timing support is added."}</span>
              </span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Scenario notes</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            <NoteCard color={GREEN} icon={<Sparkles size={16} />} title="Convergent primary" body="If lord and karaka agree, secondary evidence refines the already-set lean." />
            <NoteCard color={GOLD} icon={<ChevronsRight size={16} />} title="Mixed primary" body="If the primary tier disagrees or karaka is absent, secondary evidence decides." />
            <NoteCard color={BLUE} icon={<ShieldCheck size={16} />} title="Same planet" body="One planet carrying both labels is a single strong read, not two independent votes." />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Stream-honesty safeguards</p>
        <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
          <ToggleRow checked={preserveHierarchy} onChange={setPreserveHierarchy} label="Preserve hierarchy" body="Avoid flat five-line vote-counting; primary tier has priority." icon={<Layers3 size={16} />} />
          <ToggleRow checked={singleCaveatOnly} onChange={setSingleCaveatOnly} label="Single secondary affliction stays a caveat" body="It complicates a favourable primary tier unless severity becomes multi-line." icon={<AlertTriangle size={16} />} />
          <ToggleRow checked={samePlanetFlag} onChange={setSamePlanetFlag} label="Flag same-planet roles" body="Do not inflate one planet into two independent confirmations." icon={<BadgeCheck size={16} />} />
          <ToggleRow checked={dashaAsTiming} onChange={setDashaAsTiming} label="Keep dasha as timing tier" body="Dasha can show near-term manifestation without flattening the judgement." icon={<Clock3 size={16} />} />
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Procedure check</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "Hierarchy kept visible" : "Repair the weighing procedure"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ParashariPrashnaWeighingProcedure;

function WeighingDiagram({ scenario, primaryClear, primaryMixed }: { scenario: (typeof SCENARIOS)[ScenarioKey]; primaryClear: boolean; primaryMixed: boolean }) {
  return (
    <svg viewBox="0 0 820 470" role="img" aria-label="Parashari prashna two-tier weighing procedure diagram" style={{ width: "100%", minHeight: 370, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="450" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Hierarchical weighing, not a flat five-line tally</text>
      <TierBlock x={72} y={90} width={300} title="Primary tier" subtitle="house-lord plus karaka" color={scenario.color} />
      <TierBlock x={448} y={90} width={300} title="Secondary tier" subtitle={primaryMixed ? "decides the mixed case" : "refines the established lean"} color={primaryMixed ? GOLD : BLUE} />
      <SignalPill x={106} y={172} label="House-lord" signal={scenario.lord} />
      <SignalPill x={230} y={172} label={scenario.samePlanet ? "Karaka same" : "Karaka"} signal={scenario.karaka} />
      <SignalPill x={486} y={172} label="Occupants" signal={scenario.occupant} />
      <SignalPill x={610} y={172} label="Aspects" signal={scenario.aspect} />
      <path d="M372 178 C408 178, 416 178, 448 178" fill="none" stroke={primaryClear ? GREEN : GOLD} strokeWidth="2.2" strokeDasharray="6 7" />
      <rect x="250" y="276" width="320" height="64" rx="8" fill={softFill(scenario.color)} stroke={scenario.color} strokeWidth="1.5" />
      <text x="410" y="303" textAnchor="middle" fill={scenario.color} fontSize="13" fontWeight="500">{scenario.verdict}</text>
      <text x="410" y="323" textAnchor="middle" fill={INK_MUTED} fontSize="10">{scenario.samePlanet ? "same planet is labelled, not double-counted" : primaryClear ? "secondary finding becomes caveat or confidence" : "secondary evidence decides the lean"}</text>
      <rect x="306" y="384" width="208" height="36" rx="8" fill={scenario.dashaAligned ? "#E8F5E9" : "#FFFFFF"} stroke={scenario.dashaAligned ? GREEN : HAIRLINE} />
      <text x="410" y="406" textAnchor="middle" fill={scenario.dashaAligned ? GREEN : INK_MUTED} fontSize="11" fontWeight="500">{scenario.dashaAligned ? "Dasha adds near-term timing" : "Dasha adds no timing support"}</text>
      <path d="M410 340 L410 384" stroke={HAIRLINE} strokeWidth="1.5" strokeDasharray="5 6" />
    </svg>
  );
}

function TierBlock({ x, y, width, title, subtitle, color }: { x: number; y: number; width: number; title: string; subtitle: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height="148" rx="8" fill={softFill(color)} stroke={color} />
      <text x={x + width / 2} y={y + 30} textAnchor="middle" fill={color} fontSize="13" fontWeight="500">{title}</text>
      <text x={x + width / 2} y={y + 50} textAnchor="middle" fill={INK_MUTED} fontSize="10">{subtitle}</text>
    </g>
  );
}

function SignalPill({ x, y, label, signal }: { x: number; y: number; label: string; signal: Signal }) {
  const meta = SIGNAL_COPY[signal];
  return (
    <g>
      <rect x={x} y={y} width="104" height="42" rx="8" fill="#FFFFFF" stroke={meta.color} />
      <text x={x + 52} y={y + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="9.5" fontWeight="500">{label}</text>
      <text x={x + 52} y={y + 31} textAnchor="middle" fill={meta.color} fontSize="9">{meta.label}</text>
    </g>
  );
}

function EvidenceRow({ tier, label, signal }: { tier: string; label: string; signal: Signal }) {
  const meta = SIGNAL_COPY[signal];
  return (
    <div style={{ border: `1px solid ${meta.color}`, borderRadius: 8, background: softFill(meta.color), padding: "0.7rem", display: "grid", gap: "0.25rem" }}>
      <span style={{ color: INK_MUTED, fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 600 }}>{tier}</span>
      <span style={{ color: INK_PRIMARY, fontWeight: 500 }}>{label}</span>
      <span style={{ color: meta.color, fontSize: "0.84rem" }}>{meta.label}</span>
    </div>
  );
}

function NoteCard({ color, icon, title, body }: { color: string; icon: ReactNode; title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, background: softFill(color), padding: "0.7rem", display: "flex", gap: "0.6rem", alignItems: "start" }}>
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{title}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
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

function timingStyle(active: boolean): CSSProperties {
  const color = active ? GREEN : GOLD;
  return {
    border: `1px solid ${color}`,
    borderRadius: 8,
    background: softFill(color),
    padding: "0.7rem",
    display: "flex",
    gap: "0.6rem",
    alignItems: "start",
    color,
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
