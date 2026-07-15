"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Home,
  Info,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

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

type Direction = "east" | "north" | "south" | "west";
type Assessment = "yes" | "no" | "not-sure";
type Concern = "none" | "disclosed" | "not-disclosed";
type VerdictStatus = "clear" | "acceptable" | "neutral" | "attention" | "concern";

interface DirectionMeta {
  label: string;
  sanskrit: string;
  tier: string;
  color: string;
  note: string;
}

const DIRECTIONS: Record<Direction, DirectionMeta> = {
  east: { label: "East", sanskrit: "Indra", tier: "most-auspicious", color: GREEN, note: "Most auspicious entry direction" },
  north: { label: "North", sanskrit: "Kubera", tier: "acceptable", color: BLUE, note: "Second-choice, wealth-associated" },
  south: { label: "South", sanskrit: "Yama", tier: "concern", color: VERMILION, note: "Yama-dvāra — explicitly named concern" },
  west: { label: "West", sanskrit: "Varuṇa", tier: "neutral", color: INK_MUTED, note: "Neutral in this lesson" },
};

function verdictFor(direction: Direction, assessment: Assessment, concern: Concern): { status: VerdictStatus; title: string; body: string } {
  if (direction === "south") {
    let body = `South-facing main entry is the yama-dvāra — a named concern per T1-22. The practitioner should disclose this directly, refer the family to a qualified Vāstu consultant or T1-22's own remediation chapters, and still provide the best-available gṛha-praveśa-timing recommendation independently.`;
    if (concern === "not-disclosed") body += ` A known concern must be disclosed to the family as a separate matter before finalising the timing.`;
    if (assessment === "no" || assessment === "not-sure") body += ` Encourage a broader Vāstu assessment beyond entry-direction.`;
    return { status: "concern", title: "Concern surfaced — timing still provided independently", body };
  }

  if (assessment === "no" || assessment === "not-sure") {
    return {
      status: "attention",
      title: "Complete the intake before finalising timing",
      body: `Confirm whether the property has undergone, or the family intends, a broader Vāstu assessment beyond entry-direction. The timing recommendation proceeds on its own terms once the intake is complete.`,
    };
  }

  if (concern === "not-disclosed") {
    return {
      status: "attention",
      title: "Disclose the known concern separately",
      body: `A known Vāstu concern must be disclosed to the family as a separate question from the gṛha-praveśa-timing recommendation. The timing recommendation itself still proceeds independently.`,
    };
  }

  if (direction === "east") {
    return {
      status: "clear",
      title: "Overlay clears",
      body: `East-facing entry, broader Vāstu assessment addressed, and no undisclosed concern. The gṛha-praveśa-timing recommendation proceeds on its own terms, strengthened by this favourable overlay finding.`,
    };
  }

  if (direction === "north") {
    return {
      status: "acceptable",
      title: "Overlay acceptable",
      body: `North-facing entry is the acceptable second-choice; broader Vāstu assessment is addressed and no concern is undisclosed. Timing proceeds independently.`,
    };
  }

  return {
    status: "neutral",
    title: "Neutral entry direction",
    body: `West-facing entry is neutral in this lesson's overlay. Confirm the broader Vāstu assessment and disclosure checklist are complete before finalising the timing recommendation.`,
  };
}

function statusColor(status: VerdictStatus): string {
  switch (status) {
    case "clear":
      return GREEN;
    case "acceptable":
      return BLUE;
    case "concern":
      return VERMILION;
    case "attention":
      return GOLD;
    default:
      return INK_MUTED;
  }
}

function ScopeSvg() {
  return (
    <svg viewBox="0 0 720 140" role="img" aria-label="Muhurta timing and Vastu remediation are independent questions" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x="40" y="20" width="280" height="64" rx="8" fill={`${GOLD}10`} stroke={GOLD} strokeWidth={1} />
      <text x="180" y="48" textAnchor="middle" fontSize="13" fill={INK_PRIMARY} fontWeight={600}>
        Muhūrta-timing question
      </text>
      <text x="180" y="68" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>
        When to perform gṛha-praveśa?
      </text>

      <rect x="400" y="20" width="280" height="64" rx="8" fill={`${PURPLE}10`} stroke={PURPLE} strokeWidth={1} />
      <text x="540" y="48" textAnchor="middle" fontSize="13" fill={INK_PRIMARY} fontWeight={600}>
        Vāstu-remediation question
      </text>
      <text x="540" y="68" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>
        Does the space itself need correction?
      </text>

      <line x1="180" y1={84} x2="180" y2={110} stroke={GOLD} strokeWidth={2} />
      <line x1="540" y1={84} x2="540" y2={110} stroke={PURPLE} strokeWidth={2} />
      <polygon points="175,105 180,115 185,105" fill={GOLD} />
      <polygon points="535,105 540,115 545,105" fill={PURPLE} />

      <rect x="220" y="100" width="280" height="34" rx="8" fill={`${GREEN}08`} stroke={GREEN} />
      <text x="360" y="122" textAnchor="middle" fontSize="11" fill={GREEN} fontWeight={600}>
        Two independent inputs to the same recommendation
      </text>
    </svg>
  );
}

function FloorPlanSvg({ direction, onSelect }: { direction: Direction; onSelect: (d: Direction) => void }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const half = 80;

  const sides: { key: Direction; x: number; y: number; width: number; height: number; labelX: number; labelY: number; label: string }[] = [
    { key: "north", x: cx - half, y: cy - half - 28, width: half * 2, height: 28, labelX: cx, labelY: cy - half - 38, label: "North" },
    { key: "south", x: cx - half, y: cy + half, width: half * 2, height: 28, labelX: cx, labelY: cy + half + 42, label: "South" },
    { key: "east", x: cx + half, y: cy - half, width: 28, height: half * 2, labelX: cx + half + 42, labelY: cy, label: "East" },
    { key: "west", x: cx - half - 28, y: cy - half, width: 28, height: half * 2, labelX: cx - half - 42, labelY: cy, label: "West" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Click a side of the floor plan to set the main entry direction" style={{ width: "100%", maxWidth: 320 }}>
        <rect x={cx - half} y={cy - half} width={half * 2} height={half * 2} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />
        <text x={cx} y={cy} textAnchor="middle" fontSize={12} fill={INK_MUTED} fontWeight={500}>
          dwelling
        </text>
        {sides.map((side) => {
          const active = direction === side.key;
          const meta = DIRECTIONS[side.key];
          return (
            <g key={side.key}>
              <rect
                x={side.x}
                y={side.y}
                width={side.width}
                height={side.height}
                rx={4}
                fill={active ? `${meta.color}25` : `${meta.color}08`}
                stroke={active ? meta.color : HAIRLINE}
                strokeWidth={active ? 2 : 1}
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(side.key)}
              />
              <text x={side.labelX} y={side.labelY} textAnchor="middle" fontSize={11} fill={active ? meta.color : INK_SECONDARY} fontWeight={600}>
                {side.label}
              </text>
              {active ? (
                <>
                  <circle cx={side.x + side.width / 2} cy={side.y + side.height / 2} r={6} fill={meta.color} />
                  <text x={side.x + side.width / 2} y={side.y + side.height / 2 + 3} textAnchor="middle" fontSize={8} fill="#fff" fontWeight={700}>
                    ENTRY
                  </text>
                </>
              ) : null}
            </g>
          );
        })}
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: DIRECTIONS[direction].color }}>
          {DIRECTIONS[direction].label} — {DIRECTIONS[direction].tier}
        </div>
        <div style={{ fontSize: "0.75rem", color: INK_SECONDARY }}>{DIRECTIONS[direction].note}</div>
      </div>
    </div>
  );
}

function ToggleGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { key: T; label: string; color: string }[];
  onChange: (key: T) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          aria-pressed={value === opt.key}
          onClick={() => onChange(opt.key)}
          style={{
            padding: "0.35rem 0.65rem",
            borderRadius: 6,
            border: `1px solid ${value === opt.key ? opt.color : HAIRLINE}`,
            background: value === opt.key ? `${opt.color}15` : "transparent",
            color: value === opt.key ? opt.color : INK_SECONDARY,
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function MistakeCard({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ ...cardStyle, borderColor: `${VERMILION}50`, background: `${VERMILION}08` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: VERMILION, marginBottom: "0.35rem" }}>
        <AlertTriangle size={12} />
        Common mistake
      </div>
      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: INK_PRIMARY, marginBottom: "0.25rem" }}>{title}</div>
      <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}

export function VastuPurificationOverlayWorkbench() {
  const [direction, setDirection] = useState<Direction>("east");
  const [assessment, setAssessment] = useState<Assessment>("yes");
  const [concern, setConcern] = useState<Concern>("none");
  const [showMistakes, setShowMistakes] = useState(false);

  const verdict = useMemo(() => verdictFor(direction, assessment, concern), [direction, assessment, concern]);
  const color = statusColor(verdict.status);

  function loadPreset(name: "sharma" | "south") {
    if (name === "sharma") {
      setDirection("east");
      setAssessment("yes");
      setConcern("none");
    } else {
      setDirection("south");
      setAssessment("no");
      setConcern("not-disclosed");
    }
  }

  function handleReset() {
    setDirection("east");
    setAssessment("yes");
    setConcern("none");
    setShowMistakes(false);
  }

  return (
    <div data-interactive="vastu-purification-overlay-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Vāstu purification overlay</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.25rem", fontWeight: 600 }}>
              Run the gṛha-praveśa Vāstu-intake checklist without conflating it with timing
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`This workbench applies T1-22's entry-direction doctrine as a timing overlay and keeps muhūrta-timing and Vāstu-remediation as two independent questions.`}
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.5rem",
            borderRadius: 4,
            background: `${BLUE}10`,
            color: BLUE,
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          <BookOpen size={10} />
          Source: T1-22 Lesson 22.2.1 entry-direction doctrine, reused as overlay
        </div>
      </section>

      <section style={cardStyle}>
        <ScopeSvg />
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 360px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>1. Entry direction</p>
          <FloorPlanSvg direction={direction} onSelect={setDirection} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
            <LegendDot color={GREEN} label="East — most auspicious" />
            <LegendDot color={BLUE} label="North — acceptable" />
            <LegendDot color={INK_MUTED} label="West — neutral" />
            <LegendDot color={VERMILION} label="South — concern" />
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <p style={eyebrowStyle}>2. Overlay checklist</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: INK_PRIMARY }}>Main entry faces</span>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as Direction)}
              style={selectStyle}
            >
              {(Object.keys(DIRECTIONS) as Direction[]).map((key) => (
                <option key={key} value={key}>
                  {DIRECTIONS[key].label} — {DIRECTIONS[key].tier}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: INK_PRIMARY }}>
              {`Has a broader Vāstu assessment been done or intended?`}
            </span>
            <ToggleGroup
              value={assessment}
              onChange={setAssessment}
              options={[
                { key: "yes", label: "Yes", color: GREEN },
                { key: "no", label: "No", color: VERMILION },
                { key: "not-sure", label: "Not sure", color: GOLD },
              ]}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: INK_PRIMARY }}>
              {`If a concern is known, has it been disclosed separately from timing?`}
            </span>
            <ToggleGroup
              value={concern}
              onChange={setConcern}
              options={[
                { key: "none", label: "No known concern", color: GREEN },
                { key: "disclosed", label: "Disclosed", color: BLUE },
                { key: "not-disclosed", label: "Not disclosed", color: VERMILION },
              ]}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", paddingTop: "0.5rem" }}>
            <button type="button" onClick={() => loadPreset("sharma")} style={buttonStyle(false, GREEN)}>
              <Home size={14} />
              Sharma family
            </button>
            <button type="button" onClick={() => loadPreset("south")} style={buttonStyle(false, VERMILION)}>
              <AlertTriangle size={14} />
              Hypothetical south
            </button>
          </div>
        </section>
      </div>

      <div
        style={{
          ...cardStyle,
          borderColor: color,
          background: `${color}10`,
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
        }}
      >
        {verdict.status === "concern" || verdict.status === "attention" ? <AlertTriangle size={22} color={color} /> : <CheckCircle2 size={22} color={color} />}
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 600, color }}>{verdict.title}</div>
          <div style={{ fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.6, marginTop: "0.25rem" }}>{verdict.body}</div>
        </div>
      </div>

      <div style={cardStyle}>
        <button
          type="button"
          onClick={() => setShowMistakes((v) => !v)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            background: "transparent",
            border: "none",
            color: INK_PRIMARY,
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Info size={16} color={PURPLE} />
            {showMistakes ? "Hide common mistakes" : "Show common mistakes"}
          </span>
          <ChevronDown size={14} color={INK_MUTED} style={{ transform: showMistakes ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
        </button>
        {showMistakes ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
            <MistakeCard
              title="Blocking timing because of a Vāstu concern"
              body="The two questions proceed independently. A south-facing entry is disclosed and referred; the family still receives the best-available timing recommendation."
            />
            <MistakeCard
              title="Practitioner oversteps into full Vāstu diagnosis"
              body="This overlay is an intake question, not a diagnostic service. Deeper Vāstu assessment and remediation belong to T1-22 and qualified consultants."
            />
            <MistakeCard
              title="Skipping the intake because the client did not raise it"
              body="The three intake questions are asked every time, regardless of whether the client mentions Vāstu first."
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: INK_SECONDARY }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const buttonStyle = (active: boolean, color: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.45rem 0.85rem",
  borderRadius: 6,
  border: `1px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_PRIMARY,
  fontSize: "0.85rem",
  fontWeight: 500,
  cursor: "pointer",
});

const selectStyle: CSSProperties = {
  width: "100%",
  padding: "0.45rem 0.6rem",
  borderRadius: 6,
  border: `1px solid ${HAIRLINE}`,
  background: "transparent",
  color: INK_PRIMARY,
  fontSize: "0.85rem",
  fontWeight: 500,
  appearance: "none",
  cursor: "pointer",
};
