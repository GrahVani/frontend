"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Eye,
  GitCompare,
  HeartHandshake,
  ListChecks,
  MessageCircle,
  RefreshCw,
  Scale,
  ShieldAlert,
  Sprout,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type DirectionKey = "anshToBhavna" | "bhavnaToAnsh" | "both";
type PatternKey = "h1" | "jupiterH6" | "saturnOneWay";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const ANSH_TO_BHAVNA = [
  ["Sun", "H10"],
  ["Moon", "H1"],
  ["Mars", "H7"],
  ["Mercury", "H10"],
  ["Jupiter", "H6"],
  ["Venus", "H11"],
  ["Saturn", "H8"],
  ["Rahu", "H3"],
  ["Ketu", "H9"],
];

const BHAVNA_TO_ANSH = [
  ["Sun", "H11"],
  ["Moon", "H8"],
  ["Mars", "H2"],
  ["Mercury", "H1"],
  ["Jupiter", "H6"],
  ["Venus", "H10"],
  ["Saturn", "H4"],
  ["Rahu", "H3"],
  ["Ketu", "H9"],
];

const PATTERNS: Record<PatternKey, { label: string; kind: string; reading: string; caution: string; icon: ReactNode; color: string }> = {
  h1: {
    label: "Reciprocal H1 activation",
    kind: "Flattering reciprocal",
    reading: "Ansh's Moon lands in Bhavna's H1, and Bhavna's Mercury lands in Ansh's H1. Each partner activates the other's identity house.",
    caution: "Stronger than either direction alone because both directions independently converge on H1.",
    icon: <HeartHandshake size={16} />,
    color: GREEN,
  },
  jupiterH6: {
    label: "Mutual Jupiter in H6",
    kind: "Mixed reciprocal",
    reading: "Each partner's Jupiter lands in the other's H6, making meaning and perspective available through service, daily function, and practical problem-solving.",
    caution: "Report this honestly. A mixed reciprocal pattern is still a real finding.",
    icon: <Sprout size={16} />,
    color: ACCENT,
  },
  saturnOneWay: {
    label: "Saturn overlays",
    kind: "Two one-directional findings",
    reading: "Ansh's Saturn lands in Bhavna's H8; Bhavna's Saturn lands in Ansh's H4. Both matter, but they are not the same reciprocal pattern.",
    caution: "Do not inflate different Saturn houses into a reciprocal Saturn finding.",
    icon: <ShieldAlert size={16} />,
    color: VERMILION,
  },
};

export function HouseOverlaySynastryWorkbench() {
  const [direction, setDirection] = useState<DirectionKey>("both");
  const [patternKey, setPatternKey] = useState<PatternKey>("h1");
  const [bothDirections, setBothDirections] = useState(true);
  const [overlayLanguage, setOverlayLanguage] = useState(true);
  const [reportMixed, setReportMixed] = useState(true);
  const [separateComposite, setSeparateComposite] = useState(true);

  const pattern = PATTERNS[patternKey];
  const methodReady = bothDirections && overlayLanguage && reportMixed && separateComposite;

  const feedback = useMemo(() => {
    if (!bothDirections) return "Repair: run both overlay tables. A one-direction check can understate reciprocal patterns.";
    if (!overlayLanguage) return "Repair: phrase the finding as one real person's graha activating the other real person's house.";
    if (!reportMixed) return "Repair: report mutual Jupiter-in-H6 too. Selective flattering-only reporting is not synastry.";
    if (!separateComposite) return "Repair: do not use composite language. No averaged third chart is being read here.";
    return "Clean overlay discipline: both directions checked, reciprocal patterns separated from one-way findings, and mixed results reported honestly.";
  }, [bothDirections, overlayLanguage, reportMixed, separateComposite]);

  return (
    <div data-interactive="house-overlay-synastry-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>House-overlay synastry</p>
            <h2 style={headingStyle}>Compare two real charts in both directions</h2>
            <p style={bodyStyle}>
              Build the overlay tables, identify reciprocal patterns, and keep overlay language distinct from composite-chart language.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDirection("both");
              setPatternKey("h1");
              setBothDirections(true);
              setOverlayLanguage(true);
              setReportMixed(true);
              setSeparateComposite(true);
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
            <p style={eyebrowStyle}>Bidirectional overlay map</p>
            <div style={segmentedStyle}>
              <DirectionButton direction={direction} target="anshToBhavna" onSelect={setDirection} label="A on B" />
              <DirectionButton direction={direction} target="both" onSelect={setDirection} label="Both" />
              <DirectionButton direction={direction} target="bhavnaToAnsh" onSelect={setDirection} label="B on A" />
            </div>
          </div>
          <OverlayDiagram direction={direction} activePattern={patternKey} methodReady={methodReady} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: pattern.color }}>
            {pattern.icon}
            <p style={eyebrowStyle}>{pattern.kind}</p>
          </div>
          <h3 style={panelTitleStyle}>{pattern.label}</h3>
          <p style={bodyStyle}>{pattern.reading}</p>
          <div style={{ ...noticeStyle(pattern.color), marginTop: "1rem" }}>
            <Scale size={18} />
            <span>{pattern.caution}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Pattern selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(PATTERNS) as PatternKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setPatternKey(key)} aria-pressed={patternKey === key} style={patternButtonStyle(patternKey === key, PATTERNS[key].color)}>
                <span style={{ color: PATTERNS[key].color }}>{PATTERNS[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{PATTERNS[key].label}</span>
                  <span style={smallTextStyle}>{PATTERNS[key].kind}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Overlay guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={bothDirections} onChange={setBothDirections} label="Always check both directions" body="Chart A on B and Chart B on A are separate tables." icon={<GitCompare size={16} />} />
            <ToggleRow checked={overlayLanguage} onChange={setOverlayLanguage} label="Use overlay language" body="His graha activates her house; her graha activates his house." icon={<MessageCircle size={16} />} />
            <ToggleRow checked={reportMixed} onChange={setReportMixed} label="Report mixed reciprocals" body="Mutual Jupiter in H6 is real even when not flattering." icon={<ListChecks size={16} />} />
            <ToggleRow checked={separateComposite} onChange={setSeparateComposite} label="Keep composite separate" body="No third averaged chart is involved in house overlay." icon={<Eye size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {methodReady ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Synastry result</p>
            <h3 style={{ ...panelTitleStyle, color: methodReady ? GREEN : VERMILION }}>{methodReady ? "Overlay reading is complete enough to report" : "Repair before reporting"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HouseOverlaySynastryWorkbench;

function OverlayDiagram({ direction, activePattern, methodReady }: { direction: DirectionKey; activePattern: PatternKey; methodReady: boolean }) {
  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="Bidirectional house overlay synastry diagram" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <ChartNode x={185} y={180} label="MC1 Ansh" body="Libra houses" color={BLUE} active={direction !== "anshToBhavna"} />
      <ChartNode x={595} y={180} label="MC2 Bhavna" body="Cancer houses" color={ACCENT} active={direction !== "bhavnaToAnsh"} />
      {(direction === "anshToBhavna" || direction === "both") && (
        <path d="M 250 150 C 325 90, 455 90, 530 150" fill="none" stroke={BLUE} strokeWidth="3" strokeDasharray="7 7" />
      )}
      {(direction === "bhavnaToAnsh" || direction === "both") && (
        <path d="M 530 210 C 455 284, 325 284, 250 210" fill="none" stroke={ACCENT} strokeWidth="3" strokeDasharray="7 7" />
      )}
      <OverlayTable x={72} y={302} title="Ansh on Bhavna" rows={ANSH_TO_BHAVNA} active={direction !== "bhavnaToAnsh"} color={BLUE} activePattern={activePattern} />
      <OverlayTable x={422} y={302} title="Bhavna on Ansh" rows={BHAVNA_TO_ANSH} active={direction !== "anshToBhavna"} color={ACCENT} activePattern={activePattern} />
      <rect x="236" y="34" width="308" height="42" rx="8" fill={methodReady ? "#E8F5E9" : "#F9E8E3"} stroke={methodReady ? GREEN : VERMILION} strokeWidth="1.5" />
      <text x="390" y="60" textAnchor="middle" fill={methodReady ? GREEN : VERMILION} fontSize="13" fontWeight="500">
        {methodReady ? "both real charts compared directly" : "overlay discipline incomplete"}
      </text>
    </svg>
  );
}

function ChartNode({ x, y, label, body, color, active }: { x: number; y: number; label: string; body: string; color: string; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="70" fill={active ? softFill(color) : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
      <circle cx={x} cy={y} r="42" fill="none" stroke={active ? color : HAIRLINE} strokeWidth="1.2" />
      <path d={`M ${x - 42} ${y} L ${x + 42} ${y} M ${x} ${y - 42} L ${x} ${y + 42}`} stroke={active ? color : HAIRLINE} strokeWidth="1" />
      <text x={x} y={y - 2} textAnchor="middle" fill={active ? color : INK_PRIMARY} fontSize="14" fontWeight="500">{label}</text>
      <text x={x} y={y + 20} textAnchor="middle" fill={INK_MUTED} fontSize="11">{body}</text>
    </g>
  );
}

function OverlayTable({ x, y, title, rows, active, color, activePattern }: { x: number; y: number; title: string; rows: string[][]; active: boolean; color: string; activePattern: PatternKey }) {
  return (
    <g opacity={active ? 1 : 0.45}>
      <rect x={x} y={y} width="286" height="92" rx="8" fill={active ? softFill(color) : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth="1.5" />
      <text x={x + 16} y={y + 24} fill={color} fontSize="13" fontWeight="500">{title}</text>
      {rows.slice(0, 5).map(([graha, house], index) => {
        const highlight =
          (activePattern === "h1" && ((title.startsWith("Ansh") && graha === "Moon") || (title.startsWith("Bhavna") && graha === "Mercury"))) ||
          (activePattern === "jupiterH6" && graha === "Jupiter") ||
          (activePattern === "saturnOneWay" && graha === "Saturn");
        return (
          <g key={`${title}-${graha}`}>
            <text x={x + 16 + (index % 3) * 88} y={y + 50 + Math.floor(index / 3) * 22} fill={highlight ? color : INK_SECONDARY} fontSize="11" fontWeight={highlight ? "500" : "400"}>
              {graha} {house}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function DirectionButton({ direction, target, onSelect, label }: { direction: DirectionKey; target: DirectionKey; onSelect: (direction: DirectionKey) => void; label: string }) {
  const active = direction === target;
  return (
    <button type="button" aria-pressed={active} onClick={() => onSelect(target)} style={directionButtonStyle(active)}>
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
  gridTemplateColumns: "repeat(3, minmax(78px, 1fr))",
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

function directionButtonStyle(active: boolean): CSSProperties {
  return {
    border: 0,
    borderRight: `1px solid ${HAIRLINE}`,
    background: active ? softFill(ACCENT) : SURFACE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
    padding: "0.55rem 0.7rem",
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.86rem",
    fontWeight: 500,
  };
}

function patternButtonStyle(active: boolean, color: string): CSSProperties {
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
