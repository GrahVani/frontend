"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  GitCompare,
  HeartHandshake,
  MessageSquareText,
  Orbit,
  RefreshCw,
  Scale,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Timer,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type FindingKey = "h7" | "h11" | "venus8" | "mars6" | "dasha" | "health";
type ViewKey = "scope" | "confidence" | "phrase";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const FINDINGS: Record<
  FindingKey,
  {
    label: string;
    finding: string;
    transfers: boolean;
    confidence: "Weak" | "Moderate" | "No-Prediction";
    relational: string;
    repair: string;
    icon: ReactNode;
    color: string;
  }
> = {
  h7: {
    label: "Jupiter + Saturn in H7",
    finding: "Composite Jupiter and Saturn both land in Aquarius/H7.",
    transfers: true,
    confidence: "Moderate",
    relational: "The relationship's own centre of gravity leans toward structure and shared meaning around commitment.",
    repair: "Do not turn this into a destiny verdict. Weigh it beside direct synastry and Upapada.",
    icon: <HeartHandshake size={16} />,
    color: GREEN,
  },
  h11: {
    label: "Sun + Moon + Venus in H11",
    finding: "Composite Sun, Moon, and Venus cluster in Gemini/H11.",
    transfers: true,
    confidence: "Moderate",
    relational: "The relationship's identity, emotional core, and affection principle emphasise shared hopes, networks, and social context.",
    repair: "Do not say either partner is personally an H11 person from the composite alone.",
    icon: <Orbit size={16} />,
    color: BLUE,
  },
  venus8: {
    label: "Venus in H8",
    finding: "A hypothetical composite Venus sits in H8.",
    transfers: true,
    confidence: "Weak",
    relational: "The relationship's affection-and-value principle may centre on shared depth, intensity, and joint resources.",
    repair: "Keep it as a standalone weak-to-moderate signal until convergence appears.",
    icon: <Sparkles size={16} />,
    color: ACCENT,
  },
  mars6: {
    label: "Mars in H6",
    finding: "Composite Mars sits in H6.",
    transfers: true,
    confidence: "Moderate",
    relational: "The relationship's energy may surface through friction, daily conflict, or direct problem-solving.",
    repair: "The H6 health claim does not transfer. Keep the surviving meaning at the relationship-friction level.",
    icon: <ShieldAlert size={16} />,
    color: VERMILION,
  },
  dasha: {
    label: "Composite dasha",
    finding: "A practitioner wants to time the relationship through a composite dasha.",
    transfers: false,
    confidence: "No-Prediction",
    relational: "No valid composite reading: dasha sequencing needs a real birth moment.",
    repair: "Block the claim. A midpoint Moon has no elapsed birth balance behind it.",
    icon: <Timer size={16} />,
    color: VERMILION,
  },
  health: {
    label: "Individual health claim",
    finding: "Composite Mars in H6 is framed as one partner's health struggle.",
    transfers: false,
    confidence: "No-Prediction",
    relational: "No individual health prediction follows from a composite placement.",
    repair: "Repair both errors: stop individual misattribution and block health/longevity machinery.",
    icon: <Stethoscope size={16} />,
    color: VERMILION,
  },
};

const FINDING_ORDER: FindingKey[] = ["h7", "h11", "venus8", "mars6", "dasha", "health"];

export function CompositeChartRelationalArtifactWorkbench() {
  const [findingKey, setFindingKey] = useState<FindingKey>("h7");
  const [view, setView] = useState<ViewKey>("scope");
  const [nameModern, setNameModern] = useState(true);
  const [relationalLanguage, setRelationalLanguage] = useState(true);
  const [tierAttached, setTierAttached] = useState(true);
  const [convergenceNamed, setConvergenceNamed] = useState(true);

  const finding = FINDINGS[findingKey];
  const phraseReady = nameModern && relationalLanguage && tierAttached && convergenceNamed && finding.transfers;

  const feedback = useMemo(() => {
    if (!finding.transfers) return finding.repair;
    if (!nameModern) return "Repair: disclose that the composite chart is a modern technique, not a classical Vedic method.";
    if (!relationalLanguage) return "Repair: restate the finding as the relationship's own centre of gravity, not either partner's individual trait.";
    if (!tierAttached) return "Repair: attach a specific confidence tier. Standalone composite findings usually sit weak-to-moderate.";
    if (!convergenceNamed) return "Repair: point toward direct synastry or Upapada convergence before raising confidence.";
    return "Clean phrasing discipline: origin named, relationship register clear, confidence calibrated, and convergence treated as the next check.";
  }, [convergenceNamed, finding, nameModern, relationalLanguage, tierAttached]);

  return (
    <div data-interactive="composite-chart-relational-artifact-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Relational artifact reading</p>
            <h2 style={headingStyle}>Scope the finding before you phrase it</h2>
            <p style={bodyStyle}>
              Decide what transfers from natal reading, calibrate confidence, and turn the finding into relationship-level client language.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFindingKey("h7");
              setView("scope");
              setNameModern(true);
              setRelationalLanguage(true);
              setTierAttached(true);
              setConvergenceNamed(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 560px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <p style={eyebrowStyle}>Transfer boundary map</p>
            <div style={segmentedStyle}>
              <ViewButton view={view} target="scope" onSelect={setView} label="Scope" />
              <ViewButton view={view} target="confidence" onSelect={setView} label="Tier" />
              <ViewButton view={view} target="phrase" onSelect={setView} label="Phrase" />
            </div>
          </div>
          <RelationalDiagram findingKey={findingKey} view={view} phraseReady={phraseReady} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: finding.color }}>
            {finding.icon}
            <p style={eyebrowStyle}>{finding.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{finding.transfers ? "Transfers with scope" : "Does not transfer"}</h3>
          <p style={bodyStyle}>{finding.finding}</p>
          <div style={{ ...noticeStyle(finding.transfers ? GREEN : VERMILION), marginTop: "1rem" }}>
            {finding.transfers ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{finding.confidence} confidence</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Finding selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {FINDING_ORDER.map((key) => (
              <button key={key} type="button" onClick={() => setFindingKey(key)} aria-pressed={findingKey === key} style={findingButtonStyle(findingKey === key, FINDINGS[key].color)}>
                <span style={{ color: FINDINGS[key].color }}>{FINDINGS[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{FINDINGS[key].label}</span>
                  <span style={smallTextStyle}>{FINDINGS[key].transfers ? "relationship-level signal" : "birth-event or individual misattribution risk"}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Four-part phrasing discipline</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={nameModern} onChange={setNameModern} label="Name modern technique" body="Avoid implying a classical Sanskrit source for composite construction." icon={<FileIcon />} />
            <ToggleRow checked={relationalLanguage} onChange={setRelationalLanguage} label="Use relationship-as-entity language" body="Say what the relationship emphasises, not what either partner is." icon={<HeartHandshake size={16} />} />
            <ToggleRow checked={tierAttached} onChange={setTierAttached} label="Attach a confidence tier" body="Standalone composite readings default weak-to-moderate." icon={<Scale size={16} />} />
            <ToggleRow checked={convergenceNamed} onChange={setConvergenceNamed} label="Point toward convergence" body="Direct synastry or Upapada checks can raise confidence." icon={<GitCompare size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {phraseReady ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Client phrasing result</p>
            <h3 style={{ ...panelTitleStyle, color: phraseReady ? GREEN : VERMILION }}>
              {phraseReady ? "Correctly scoped composite statement" : "Repair the scope before speaking"}
            </h3>
            <p style={bodyStyle}>{phraseReady ? phrasedFinding(finding) : feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CompositeChartRelationalArtifactWorkbench;

function RelationalDiagram({ findingKey, view, phraseReady }: { findingKey: FindingKey; view: ViewKey; phraseReady: boolean }) {
  const finding = FINDINGS[findingKey];
  const activeX = view === "scope" ? 170 : view === "confidence" ? 390 : 610;
  const activeColor = view === "scope" ? BLUE : view === "confidence" ? ACCENT : GREEN;

  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="Composite relational artifact transfer and phrasing diagram" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 225 155 C 285 110, 335 110, 370 155" fill="none" stroke={HAIRLINE} strokeWidth="2.5" />
      <path d="M 445 155 C 505 110, 555 110, 590 155" fill="none" stroke={HAIRLINE} strokeWidth="2.5" />
      <StageNode x={170} y={168} label="Scope" body="transfer test" color={BLUE} active={view === "scope"} />
      <StageNode x={390} y={168} label="Confidence" body="weak to moderate" color={ACCENT} active={view === "confidence"} />
      <StageNode x={610} y={168} label="Phrase" body="relationship language" color={GREEN} active={view === "phrase"} />
      <path d={`M ${activeX} 232 L ${activeX} 275`} stroke={activeColor} strokeWidth="3" strokeLinecap="round" />
      <rect x={activeX - 126} y="275" width="252" height="74" rx="8" fill={softFill(activeColor)} stroke={activeColor} strokeWidth="2" />
      <text x={activeX} y="301" textAnchor="middle" fill={activeColor} fontSize="14" fontWeight="500">{finding.label}</text>
      <text x={activeX} y="324" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">{viewLabel(view, finding)}</text>
      <rect x="142" y="372" width="496" height="34" rx="8" fill={phraseReady ? "#E8F5E9" : "#F9E8E3"} stroke={phraseReady ? GREEN : VERMILION} strokeWidth="1.5" />
      <text x="390" y="394" textAnchor="middle" fill={phraseReady ? GREEN : VERMILION} fontSize="13" fontWeight="500">
        {phraseReady ? "origin + relational register + tier + convergence" : "scope, tier, or transfer boundary missing"}
      </text>
    </svg>
  );
}

function StageNode({ x, y, label, body, color, active }: { x: number; y: number; label: string; body: string; color: string; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="62" fill={active ? softFill(color) : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
      <text x={x} y={y - 4} textAnchor="middle" fill={active ? color : INK_PRIMARY} fontSize="15" fontWeight="500">{label}</text>
      <text x={x} y={y + 18} textAnchor="middle" fill={INK_MUTED} fontSize="11">{body}</text>
    </g>
  );
}

function ViewButton({ view, target, onSelect, label }: { view: ViewKey; target: ViewKey; onSelect: (view: ViewKey) => void; label: string }) {
  const active = view === target;
  return (
    <button type="button" aria-pressed={active} onClick={() => onSelect(target)} style={viewButtonStyle(active)}>
      {label}
    </button>
  );
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function FileIcon() {
  return <MessageSquareText size={16} />;
}

function viewLabel(view: ViewKey, finding: (typeof FINDINGS)[FindingKey]): string {
  if (view === "scope") return finding.transfers ? "valid, if relational" : "does not transfer";
  if (view === "confidence") return `${finding.confidence} confidence`;
  return finding.transfers ? "client-ready after guardrails" : "blocked claim";
}

function phrasedFinding(finding: (typeof FINDINGS)[FindingKey]): string {
  return `Looking at the relationship's composite chart as a modern relational technique, ${finding.relational} I would treat this as a ${finding.confidence.toLowerCase()}-confidence signal and check it against direct synastry or Upapada before raising the claim.`;
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
};

const segmentedStyle: CSSProperties = {
  display: "inline-grid",
  gridTemplateColumns: "repeat(3, minmax(76px, 1fr))",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  overflow: "hidden",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: 0,
  fontSize: "0.78rem",
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.35rem",
  lineHeight: 1.25,
  fontWeight: 500,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.4rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  lineHeight: 1.3,
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.94rem",
};

const smallTextStyle: CSSProperties = {
  margin: "0.2rem 0 0",
  color: INK_MUTED,
  lineHeight: 1.4,
  fontSize: "0.84rem",
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.58rem 0.72rem",
  background: SURFACE,
  color: INK_PRIMARY,
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.9rem",
  fontWeight: 500,
};

function viewButtonStyle(active: boolean): CSSProperties {
  return {
    border: 0,
    borderRight: `1px solid ${HAIRLINE}`,
    background: active ? softFill(ACCENT) : SURFACE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
    padding: "0.55rem 0.7rem",
    minHeight: 38,
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.86rem",
    fontWeight: 500,
  };
}

function findingButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : SURFACE,
    color: INK_PRIMARY,
    padding: "0.72rem",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    font: "inherit",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: checked ? softFill(ACCENT) : SURFACE,
    color: checked ? INK_PRIMARY : INK_MUTED,
    padding: "0.7rem",
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gap: "0.62rem",
    alignItems: "center",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 8,
    background: softFill(color),
    color,
    padding: "0.7rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    fontWeight: 500,
  };
}

function softFill(color: string): string {
  if (color === ACCENT) return "#FDF4E3";
  if (color === GREEN) return "#E8F5E9";
  if (color === BLUE) return "#E3EEF9";
  if (color === VERMILION) return "#F9E8E3";
  return SURFACE;
}
