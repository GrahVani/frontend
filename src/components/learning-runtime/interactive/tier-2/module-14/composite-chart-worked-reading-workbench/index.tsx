"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  GitCompare,
  HeartHandshake,
  ListChecks,
  MessageSquareText,
  Network,
  Orbit,
  RefreshCw,
  Scale,
  Sparkles,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type FindingKey = "h11" | "h7" | "mars" | "mercury" | "nodes";
type SortMode = "strength" | "house";
type ViewKey = "chart" | "tiers" | "statement";

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
    house: string;
    points: string;
    tier: "Moderate" | "Weak";
    strength: number;
    reading: string;
    caution: string;
    icon: ReactNode;
    color: string;
  }
> = {
  h11: {
    label: "H11 shared-aspiration cluster",
    house: "H11",
    points: "Sun, Moon, Venus in Gemini",
    tier: "Moderate",
    strength: 5,
    reading: "The relationship's identity, emotional centre, and affection bundle around shared hopes, friendship, networks, and social context.",
    caution: "Strongest composite-only signal, but still waits for Chapter 2 direct-synastry confirmation.",
    icon: <Network size={16} />,
    color: BLUE,
  },
  h7: {
    label: "H7 commitment cluster",
    house: "H7",
    points: "Jupiter, Saturn in Aquarius",
    tier: "Moderate",
    strength: 4,
    reading: "The relationship's commitment pattern combines meaning, growth, structure, and endurance in the partnership house itself.",
    caution: "Topically on-point and dignified, but two points rather than three.",
    icon: <HeartHandshake size={16} />,
    color: GREEN,
  },
  mars: {
    label: "Mars in H5",
    house: "H5",
    points: "Mars in Sagittarius",
    tier: "Weak",
    strength: 2,
    reading: "The relationship's drive may express through shared joy, creativity, romance, exploration, and principle.",
    caution: "Single-point texture, not a headline finding.",
    icon: <Sparkles size={16} />,
    color: ACCENT,
  },
  mercury: {
    label: "Mercury in H12",
    house: "H12",
    points: "Mercury in Cancer",
    tier: "Weak",
    strength: 1,
    reading: "The relationship's communication may process through emotional undertone, privacy, retreat, or what remains unspoken.",
    caution: "Name as a texture to watch, not as a problem verdict.",
    icon: <MessageSquareText size={16} />,
    color: VERMILION,
  },
  nodes: {
    label: "Rahu-Ketu H3/H9 axis",
    house: "H3/H9",
    points: "Rahu Libra / Ketu Aries",
    tier: "Weak",
    strength: 1,
    reading: "The relationship's growth edge runs through effort, skills, and active courage rather than belief-seeking.",
    caution: "Axis texture only; do not overstate it above the clusters.",
    icon: <Orbit size={16} />,
    color: ACCENT,
  },
};

const STRENGTH_ORDER: FindingKey[] = ["h11", "h7", "mars", "mercury", "nodes"];
const HOUSE_ORDER: FindingKey[] = ["h7", "nodes", "mars", "h11", "mercury"];

export function CompositeChartWorkedReadingWorkbench() {
  const [findingKey, setFindingKey] = useState<FindingKey>("h11");
  const [sortMode, setSortMode] = useState<SortMode>("strength");
  const [view, setView] = useState<ViewKey>("chart");
  const [leadClusters, setLeadClusters] = useState(true);
  const [tierLanguage, setTierLanguage] = useState(true);
  const [scopeCompositeOnly, setScopeCompositeOnly] = useState(true);
  const [forwardLink, setForwardLink] = useState(true);

  const finding = FINDINGS[findingKey];
  const readingReady = leadClusters && tierLanguage && scopeCompositeOnly && forwardLink && sortMode === "strength";
  const orderedKeys = sortMode === "strength" ? STRENGTH_ORDER : HOUSE_ORDER;

  const feedback = useMemo(() => {
    if (sortMode !== "strength") return "Repair: house-number order hides the reading's real centre of gravity. Lead with the strongest clusters.";
    if (!leadClusters) return "Repair: Sun-Moon-Venus/H11 and Jupiter-Saturn/H7 are the headline findings.";
    if (!tierLanguage) return "Repair: name the two clusters Moderate and the single-point notes Weak.";
    if (!scopeCompositeOnly) return "Repair: this is a composite-only reading, not the complete compatibility answer.";
    if (!forwardLink) return "Repair: close by naming Chapter 2 direct synastry as the next convergence check.";
    return "Clean worked reading: ordered by strength, tiered honestly, scoped as composite-only, and linked forward to direct synastry.";
  }, [forwardLink, leadClusters, scopeCompositeOnly, sortMode, tierLanguage]);

  return (
    <div data-interactive="composite-chart-worked-reading-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Worked composite reading</p>
            <h2 style={headingStyle}>Order the reading by strength, not by house number</h2>
            <p style={bodyStyle}>
              Read MC1+MC2 end to end: lead with clustered Moderate findings, keep single-point notes brief, and close with the direct-synastry check still ahead.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFindingKey("h11");
              setSortMode("strength");
              setView("chart");
              setLeadClusters(true);
              setTierLanguage(true);
              setScopeCompositeOnly(true);
              setForwardLink(true);
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
            <p style={eyebrowStyle}>Composite chart emphasis map</p>
            <div style={segmentedStyle}>
              <ViewButton view={view} target="chart" onSelect={setView} label="Chart" />
              <ViewButton view={view} target="tiers" onSelect={setView} label="Tiers" />
              <ViewButton view={view} target="statement" onSelect={setView} label="Statement" />
            </div>
          </div>
          <WorkedReadingDiagram activeKey={findingKey} view={view} readingReady={readingReady} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: finding.color }}>
            {finding.icon}
            <p style={eyebrowStyle}>{finding.house} finding</p>
          </div>
          <h3 style={panelTitleStyle}>{finding.label}</h3>
          <p style={bodyStyle}>{finding.points}</p>
          <div style={{ ...noticeStyle(finding.tier === "Moderate" ? GREEN : ACCENT), marginTop: "1rem" }}>
            <Scale size={18} />
            <span>{finding.tier} confidence</span>
          </div>
          <p style={bodyStyle}>{finding.reading}</p>
          <p style={smallTextStyle}>{finding.caution}</p>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <p style={eyebrowStyle}>Reading order</p>
            <div style={smallSegmentStyle}>
              <button type="button" onClick={() => setSortMode("strength")} aria-pressed={sortMode === "strength"} style={smallSegmentButtonStyle(sortMode === "strength")}>
                Strength
              </button>
              <button type="button" onClick={() => setSortMode("house")} aria-pressed={sortMode === "house"} style={smallSegmentButtonStyle(sortMode === "house")}>
                House
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {orderedKeys.map((key, index) => (
              <button key={key} type="button" onClick={() => setFindingKey(key)} aria-pressed={findingKey === key} style={findingButtonStyle(findingKey === key, FINDINGS[key].color)}>
                <span style={rankStyle(findingKey === key, FINDINGS[key].color)}>{index + 1}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{FINDINGS[key].label}</span>
                  <span style={smallTextStyle}>{FINDINGS[key].tier} · {FINDINGS[key].points}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Client-ready guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={leadClusters} onChange={setLeadClusters} label="Lead with the two clusters" body="The H11 and H7 clusters carry the reading's centre of gravity." icon={<ListChecks size={16} />} />
            <ToggleRow checked={tierLanguage} onChange={setTierLanguage} label="Use tier language" body="Moderate for clusters, Weak for single-point texture." icon={<Scale size={16} />} />
            <ToggleRow checked={scopeCompositeOnly} onChange={setScopeCompositeOnly} label="Scope as composite-only" body="Do not sell this as the full compatibility verdict." icon={<BadgeCheck size={16} />} />
            <ToggleRow checked={forwardLink} onChange={setForwardLink} label="Disclose the next check" body="Chapter 2 direct synastry confirms, complicates, or diverges." icon={<GitCompare size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {readingReady ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Synthesis statement</p>
            <h3 style={{ ...panelTitleStyle, color: readingReady ? GREEN : VERMILION }}>{readingReady ? "Worked reading is correctly scoped" : "Repair the reading order or scope"}</h3>
            <p style={bodyStyle}>{readingReady ? synthesisStatement : feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CompositeChartWorkedReadingWorkbench;

const synthesisStatement =
  "The composite chart gives two Moderate findings: the stronger Sun-Moon-Venus H11 cluster around shared aspiration and the Jupiter-Saturn H7 cluster around structured commitment. Mars/H5, Mercury/H12, and the Rahu-Ketu H3/H9 axis remain Weak textural notes. This is a useful composite-only reading, not the final compatibility answer; Chapter 2 direct synastry is the next convergence check.";

function WorkedReadingDiagram({ activeKey, view, readingReady }: { activeKey: FindingKey; view: ViewKey; readingReady: boolean }) {
  const active = FINDINGS[activeKey];
  const positions: Record<FindingKey, { x: number; y: number }> = {
    h11: { x: 386, y: 92 },
    h7: { x: 588, y: 220 },
    mars: { x: 236, y: 320 },
    mercury: { x: 190, y: 92 },
    nodes: { x: 388, y: 342 },
  };

  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="Worked composite chart reading emphasis map" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <circle cx="390" cy="220" r="142" fill="#FFFCF2" stroke={HAIRLINE} strokeWidth="2" />
      <circle cx="390" cy="220" r="72" fill={softFill(ACCENT)} stroke={HAIRLINE} strokeWidth="1.2" />
      <text x="390" y="215" textAnchor="middle" fill={ACCENT} fontSize="15" fontWeight="500">Leo Lagna</text>
      <text x="390" y="238" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">relationship face</text>
      {Object.entries(positions).map(([key, position]) => {
        const typedKey = key as FindingKey;
        const item = FINDINGS[typedKey];
        const isActive = typedKey === activeKey;
        const radius = item.tier === "Moderate" ? (typedKey === "h11" ? 42 : 36) : 28;
        return (
          <g key={key}>
            <circle cx={position.x} cy={position.y} r={radius} fill={isActive ? softFill(item.color) : SURFACE} stroke={isActive ? item.color : HAIRLINE} strokeWidth={isActive ? 2.6 : 1.3} />
            <text x={position.x} y={position.y - 3} textAnchor="middle" fill={isActive ? item.color : INK_PRIMARY} fontSize="13" fontWeight="500">{item.house}</text>
            <text x={position.x} y={position.y + 16} textAnchor="middle" fill={INK_MUTED} fontSize="10">{item.tier}</text>
          </g>
        );
      })}
      <path d="M 350 118 C 330 160, 330 280, 365 314" fill="none" stroke={BLUE} strokeWidth="2" strokeDasharray="6 6" opacity="0.65" />
      <path d="M 548 220 C 500 220, 468 220, 430 220" fill="none" stroke={GREEN} strokeWidth="2" strokeDasharray="6 6" opacity="0.65" />
      <rect x="88" y="362" width="604" height="42" rx="8" fill={readingReady ? "#E8F5E9" : "#F9E8E3"} stroke={readingReady ? GREEN : VERMILION} strokeWidth="1.5" />
      <text x="390" y="388" textAnchor="middle" fill={readingReady ? GREEN : VERMILION} fontSize="13" fontWeight="500">{viewCopy(view, active)}</text>
    </svg>
  );
}

function viewCopy(view: ViewKey, finding: (typeof FINDINGS)[FindingKey]): string {
  if (view === "tiers") return `${finding.label}: ${finding.tier} because strength score ${finding.strength}`;
  if (view === "statement") return "Lead clusters, brief textures, forward-link to direct synastry";
  return `${finding.points} · ${finding.caution}`;
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
  gridTemplateColumns: "repeat(3, minmax(86px, 1fr))",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  overflow: "hidden",
  background: SURFACE,
};

const smallSegmentStyle: CSSProperties = {
  display: "inline-grid",
  gridTemplateColumns: "repeat(2, minmax(76px, 1fr))",
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

function smallSegmentButtonStyle(active: boolean): CSSProperties {
  return {
    border: 0,
    borderRight: `1px solid ${HAIRLINE}`,
    background: active ? softFill(ACCENT) : SURFACE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
    padding: "0.5rem 0.65rem",
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.84rem",
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

function rankStyle(active: boolean, color: string): CSSProperties {
  return {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? softFill(color) : SURFACE,
    color: active ? color : INK_MUTED,
    fontWeight: 500,
    fontSize: "0.85rem",
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
