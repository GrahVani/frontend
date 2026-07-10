"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  Ban,
  BookOpenCheck,
  GitBranch,
  ListChecks,
  Lock,
  NotebookPen,
  RotateCcw,
  Scale,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import { grahas, ink, streams as learningStreams } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "../lib/layouts";

type PatternKey = "saturnVerdict" | "marsPseudo" | "dharmaAbsence";
type PatternType = "genuine" | "categoryError" | "absence";
type Destination = "client" | "notes" | "scope";

interface Pattern {
  key: PatternKey;
  title: string;
  short: string;
  type: PatternType;
  planet: string;
  color: string;
  source: string;
  description: string;
  stakes: number;
  depth: number;
  direction: number;
  destination: Destination;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = ink.goldAccent;
const SHANI = grahas.shani.primary;
const MARS = grahas.mangala.primary;
const GREEN = learningStreams.tajika.primary;
const RED = learningStreams["lal-kitab"].primary;
const PURPLE = learningStreams.jaimini.primary;

const PATTERNS: Pattern[] = [
  {
    key: "saturnVerdict",
    title: "Saturn verdict split",
    short: "Genuine divergence",
    type: "genuine",
    planet: "Saturn",
    color: SHANI,
    source: "Lessons 13.6.2 §4.4",
    description: "Parashara gives weak-to-moderate; KP gives clean YES. Same marriage question, two independent systems, confirmed real.",
    stakes: 3,
    depth: 3,
    direction: 2,
    destination: "client",
  },
  {
    key: "marsPseudo",
    title: "Mars exaltation vs Nek/Bad",
    short: "Category-error pseudo-divergence",
    type: "categoryError",
    planet: "Mars",
    color: MARS,
    source: "Lesson 13.5.1 §4.4; T2-09 9.3.1",
    description: "Classical exaltation asks dignity; Lal Kitab Nek/Bad asks sign-match. Different questions, not a conflict to referee.",
    stakes: 1,
    depth: 1,
    direction: 0,
    destination: "notes",
  },
  {
    key: "dharmaAbsence",
    title: "Dharma-thread absences",
    short: "Structural absence",
    type: "absence",
    planet: "Scope",
    color: PURPLE,
    source: "Lesson 13.6.4 §4.1; Lesson 13.5.3 §4.4",
    description: "Parashara/KP were never run on the dharma question; Nadi fails the Recommend gate. Absence is not a dissenting vote.",
    stakes: 1,
    depth: 0,
    direction: 0,
    destination: "scope",
  },
];

const TYPE_META: Record<PatternType, { label: string; color: string; rule: string; icon: ReactNode }> = {
  genuine: {
    label: "Genuine cross-system divergence",
    color: RED,
    rule: "Rank it on stakes, structural depth, and directionality.",
    icon: <GitBranch size={16} />,
  },
  categoryError: {
    label: "Category-error pseudo-divergence",
    color: GOLD,
    rule: "Explain the two questions; do not rank it as an open disagreement.",
    icon: <Ban size={16} />,
  },
  absence: {
    label: "Structural absence",
    color: PURPLE,
    rule: "Record the scope limit; never count it as a soft dissent.",
    icon: <Lock size={16} />,
  },
};

export function DivergencePatternRanker() {
  const [activeKey, setActiveKey] = useState<PatternKey>("saturnVerdict");
  const [typed, setTyped] = useState<Record<PatternKey, PatternType | "untyped">>({
    saturnVerdict: "genuine",
    marsPseudo: "categoryError",
    dharmaAbsence: "absence",
  });
  const [attemptMarsClient, setAttemptMarsClient] = useState(false);
  const [showAbsenceAsVote, setShowAbsenceAsVote] = useState(false);

  const active = PATTERNS.find((pattern) => pattern.key === activeKey) ?? PATTERNS[0];
  const activeType = typed[active.key];
  const meta = activeType === "untyped" ? null : TYPE_META[activeType];

  const ranked = useMemo(() => {
    return [...PATTERNS]
      .filter((pattern) => typed[pattern.key] === "genuine")
      .sort((a, b) => scorePattern(b) - scorePattern(a));
  }, [typed]);

  const feedback = useMemo(() => {
    if (attemptMarsClient) {
      return "Blocked: the Mars finding is a category-error distinction and is off the marriage-question scope. Keep it in working notes.";
    }
    if (showAbsenceAsVote) {
      return "Blocked: structural absence is not weak disagreement. It has zero evidentiary weight in either direction.";
    }
    if (active.type !== activeType) {
      return "Review the pattern type before ranking. The score only matters after the finding is typed correctly.";
    }
    if (active.type === "genuine") {
      return "This is the one pattern that belongs prominently in the client-facing marriage synthesis, phrased as same-direction, different-strength.";
    }
    if (active.type === "categoryError") {
      return "This belongs in practitioner notes or teaching content, not as a client-facing disagreement line.";
    }
    return "This belongs as a scope note: not consulted, and why. It is not a vote.";
  }, [active, activeType, attemptMarsClient, showAbsenceAsVote]);

  return (
    <div data-interactive="divergence-pattern-ranker" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY, fontFamily: fontFamilies.body }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Divergence ranking view</p>
            <h2 style={{ margin: "0.22rem 0 0", color: SHANI, fontSize: "1.28rem", fontWeight: 600 }}>
              Type the pattern first, then decide whether it belongs in synthesis
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Separate genuine divergence from category-error pseudo-divergence and structural absence, then rank only what remains.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveKey("saturnVerdict");
              setTyped({ saturnVerdict: "genuine", marsPseudo: "categoryError", dharmaAbsence: "absence" });
              setAttemptMarsClient(false);
              setShowAbsenceAsVote(false);
            }}
            style={softButtonStyle}
          >
            <RotateCcw size={16} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Pattern map</p>
              <h3 style={{ margin: "0.16rem 0 0", color: active.color, fontSize: "1.1rem", fontWeight: 600 }}>{active.title}</h3>
            </div>
            <span style={pillStyle(meta?.color ?? INK_MUTED)}>
              {meta?.icon ?? <ListChecks size={15} />}
              {meta?.label ?? "Untyped"}
            </span>
          </div>

          <PatternMap activeKey={activeKey} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "0.65rem", marginTop: "0.8rem" }}>
            {PATTERNS.map((pattern) => (
              <button key={pattern.key} type="button" onClick={() => setActiveKey(pattern.key)} aria-pressed={activeKey === pattern.key} style={patternCardStyle(activeKey === pattern.key, pattern.color)}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.42rem", color: pattern.color, fontWeight: 600 }}>{patternIcon(pattern.type)}{pattern.title}</span>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.4 }}>{pattern.short}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.8rem", flex: "1 1 310px" }}>
          <Panel title="Pattern typing" icon={<ListChecks size={18} />} color={meta?.color ?? GOLD}>
            <div style={{ display: "grid", gap: "0.48rem" }}>
              {(Object.keys(TYPE_META) as PatternType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={activeType === type}
                  onClick={() => setTyped((current) => ({ ...current, [active.key]: type }))}
                  style={choiceStyle(activeType === type, TYPE_META[type].color)}
                >
                  {TYPE_META[type].icon}
                  {TYPE_META[type].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{meta?.rule ?? "Choose a pattern type before ranking."}</p>
          </Panel>

          <Panel title="Mistake guards" icon={<AlertTriangle size={18} />} color={attemptMarsClient || showAbsenceAsVote ? RED : GOLD}>
            <button type="button" aria-pressed={attemptMarsClient} onClick={() => setAttemptMarsClient((value) => !value)} style={toggleButtonStyle(attemptMarsClient, RED)}>
              Add Mars to client statement
            </button>
            <button type="button" aria-pressed={showAbsenceAsVote} onClick={() => setShowAbsenceAsVote((value) => !value)} style={toggleButtonStyle(showAbsenceAsVote, RED)}>
              Count absence as soft dissent
            </button>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Three-axis ranking</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "0.75rem", marginTop: "0.8rem" }}>
          <AxisCard icon={<Target size={18} />} title="Stakes" value={active.stakes} color={GREEN} body="Asked question versus incidental thread." />
          <AxisCard icon={<Scale size={18} />} title="Structural depth" value={active.depth} color={GOLD} body="Independent systems versus internal rule distinction." />
          <AxisCard icon={<SlidersHorizontal size={18} />} title="Directionality" value={active.direction} color={active.type === "genuine" ? SHANI : INK_MUTED} body="Opposite direction or same direction, different strength." />
        </div>
        <div style={{ marginTop: "0.85rem", border: `1px solid ${active.type === "genuine" ? GREEN : GOLD}66`, borderRadius: 8, padding: "0.78rem", background: "rgba(255,255,255,0.22)" }}>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{active.description}</p>
          <p style={{ margin: "0.45rem 0 0", color: INK_MUTED, fontSize: "0.86rem" }}>{active.source}</p>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Ranked synthesis priority</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.75rem" }}>
            {ranked.length ? ranked.map((pattern, index) => (
              <div key={pattern.key} style={{ border: `1px solid ${pattern.color}55`, borderRadius: 8, padding: "0.7rem", background: `color-mix(in srgb, ${pattern.color} 8%, transparent)` }}>
                <div style={{ color: pattern.color, fontWeight: 600 }}>{index + 1}. {pattern.title}</div>
                <p style={{ margin: "0.32rem 0 0", color: INK_SECONDARY, lineHeight: 1.42 }}>Score {scorePattern(pattern)}: client-facing, but phrase as agreement in direction and difference in strength.</p>
              </div>
            )) : (
              <p style={bodyTextStyle}>No genuine divergence is typed yet, so nothing should be ranked for client synthesis.</p>
            )}
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: attemptMarsClient || showAbsenceAsVote || active.type !== activeType ? RED : GREEN }}>
          <p style={eyebrowStyle}>Placement decision</p>
          <h3 style={{ margin: "0.2rem 0 0", color: attemptMarsClient || showAbsenceAsVote || active.type !== activeType ? RED : GREEN, fontSize: "1.08rem", fontWeight: 600 }}>
            {destinationLabel(active.destination)}
          </h3>
          <p style={bodyTextStyle}>{feedback}</p>
        </section>
      </div>
    </div>
  );
}

function PatternMap({ activeKey }: { activeKey: PatternKey }) {
  const points: Record<PatternKey, { x: number; y: number }> = {
    saturnVerdict: { x: 120, y: 76 },
    marsPseudo: { x: 400, y: 92 },
    dharmaAbsence: { x: 260, y: 190 },
  };
  return (
    <svg viewBox="0 0 520 250" role="img" aria-label="Three divergence pattern map" style={{ width: "100%", minHeight: 235, display: "block", marginTop: "0.8rem" }}>
      <rect x="8" y="8" width="504" height="234" rx="8" fill="rgba(255,255,255,0.22)" stroke={HAIRLINE} />
      <path d="M120 76 C190 34, 330 42, 400 92" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 6" />
      <path d="M120 76 C150 160, 215 198, 260 190" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 6" />
      <path d="M400 92 C360 164, 310 198, 260 190" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 6" />
      {PATTERNS.map((pattern) => {
        const point = points[pattern.key];
        const active = pattern.key === activeKey;
        const meta = TYPE_META[pattern.type];
        return (
          <g key={pattern.key}>
            <circle cx={point.x} cy={point.y} r={active ? 38 : 31} fill="var(--gl-card-surface-solid)" stroke={active ? meta.color : `${meta.color}99`} strokeWidth={active ? 3 : 2} />
            <text x={point.x} y={point.y - 2} textAnchor="middle" fill={pattern.color} fontSize="12" fontWeight="500">{pattern.planet}</text>
            <text x={point.x} y={point.y + 15} textAnchor="middle" fill={INK_MUTED} fontSize="9">{pattern.short}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}55`, borderRadius: 8, background: SURFACE, padding: "0.95rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.72rem" }}>{children}</div>
    </section>
  );
}

function AxisCard({ icon, title, value, color, body }: { icon: ReactNode; title: string; value: number; color: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${color}55`, borderRadius: 8, padding: "0.75rem", background: `color-mix(in srgb, ${color} 7%, transparent)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.42rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ display: "flex", gap: "0.24rem", marginTop: "0.55rem" }}>
        {[1, 2, 3].map((dot) => <span key={dot} style={{ width: 24, height: 8, borderRadius: 999, background: dot <= value ? color : "rgba(156,122,47,0.18)" }} />)}
      </div>
      <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.42 }}>{body}</p>
    </div>
  );
}

function scorePattern(pattern: Pattern) {
  return pattern.type === "genuine" ? pattern.stakes + pattern.depth + pattern.direction : 0;
}

function destinationLabel(destination: Destination) {
  if (destination === "client") return "Client synthesis statement";
  if (destination === "notes") return "Practitioner notes";
  return "Scope note";
}

function patternIcon(type: PatternType) {
  if (type === "genuine") return <GitBranch size={16} aria-hidden="true" />;
  if (type === "categoryError") return <BookOpenCheck size={16} aria-hidden="true" />;
  return <NotebookPen size={16} aria-hidden="true" />;
}

function pillStyle(color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${color}`,
    borderRadius: 999,
    padding: "0.4rem 0.62rem",
    color,
    background: `color-mix(in srgb, ${color} 8%, transparent)`,
    fontSize: "0.78rem",
    fontWeight: 500,
  };
}

function patternCardStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "rgba(255,255,255,0.24)",
    color: INK_PRIMARY,
    padding: "0.72rem",
    minHeight: 102,
    display: "grid",
    gap: "0.4rem",
    textAlign: "left",
  };
}

function choiceStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.68rem",
    textAlign: "left",
    fontWeight: 500,
  };
}

function toggleButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    width: "100%",
    marginTop: "0.55rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.68rem",
    fontWeight: 500,
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  fontSize: "0.72rem",
  fontWeight: 500,
};

const bodyTextStyle: CSSProperties = {
  margin: "0.58rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const buttonResetStyle: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
};

const softButtonStyle: CSSProperties = {
  ...buttonResetStyle,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_SECONDARY,
  padding: "0.54rem 0.72rem",
  fontWeight: 500,
};
