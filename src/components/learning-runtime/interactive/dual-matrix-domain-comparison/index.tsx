"use client";

import { Fragment, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpenCheck,
  GitCompare,
  Grid3X3,
  Layers3,
  Lock,
  Mars,
  Orbit,
  RotateCcw,
  SplitSquareHorizontal,
} from "lucide-react";
import { grahas, ink, streams as learningStreams } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "../lib/layouts";

type MatrixKey = "marriage" | "dharma";
type CompareKey = "process" | "columns" | "denominator" | "convergence" | "divergence" | "empty";

interface MatrixCell {
  substrate: string;
  verdict?: string;
  timing?: string;
  character?: string;
  note?: string;
}

interface MatrixRow {
  stream: string;
  color: string;
  cells: MatrixCell;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = ink.goldAccent;
const SHANI = grahas.shani.primary;
const MARS_COLOR = grahas.mangala.primary;
const GREEN = learningStreams.tajika.primary;
const BLUE = learningStreams.kp.primary;
const RED = learningStreams["lal-kitab"].primary;
const PURPLE = learningStreams.jaimini.primary;

const MARRIAGE_ROWS: MatrixRow[] = [
  { stream: "Parashara", color: learningStreams.parashara.primary, cells: { substrate: "Saturn", verdict: "Weak-to-moderate", timing: "15 Jun 2026" } },
  { stream: "KP", color: learningStreams.kp.primary, cells: { substrate: "Saturn", verdict: "Clean YES", timing: "No timing cell" } },
  { stream: "Jaimini", color: learningStreams.jaimini.primary, cells: { substrate: "Saturn", verdict: "Corroboration only", timing: "Empty" } },
  { stream: "Lal Kitab", color: learningStreams["lal-kitab"].primary, cells: { substrate: "Saturn", verdict: "Cross-validates", timing: "Empty" } },
  { stream: "Tajika", color: learningStreams.tajika.primary, cells: { substrate: "Saturn candidate", verdict: "Not rendered", timing: "3 Aug 2026" } },
  { stream: "Nadi", color: learningStreams.nadi.primary, cells: { substrate: "Not consulted", verdict: "Not consulted", timing: "Not consulted" } },
];

const DHARMA_ROWS: MatrixRow[] = [
  {
    stream: "Jaimini",
    color: learningStreams.jaimini.primary,
    cells: {
      substrate: "Mars",
      character: "Outward teaching-flavoured current held with an inward renunciate pull.",
    },
  },
  {
    stream: "Lal Kitab",
    color: learningStreams["lal-kitab"].primary,
    cells: {
      substrate: "Mars",
      character: "Box 10 career/status reading; Nek/Bad adds friction texture, not a contradiction.",
    },
  },
  {
    stream: "Tajika",
    color: learningStreams.tajika.primary,
    cells: {
      substrate: "Punya Saham",
      character: "10th-house general-fortune resonance; thematic support, not a new graha.",
    },
  },
  {
    stream: "Parashara",
    color: learningStreams.parashara.primary,
    cells: {
      substrate: "Not run",
      character: "Worked-sequence scoping choice; not a claim that Parashara cannot address dharma.",
    },
  },
  {
    stream: "KP",
    color: learningStreams.kp.primary,
    cells: {
      substrate: "Not run",
      character: "Worked-sequence scoping choice; KP was applied only to the 7th-cusp marriage question here.",
    },
  },
  {
    stream: "Nadi",
    color: learningStreams.nadi.primary,
    cells: {
      substrate: "Not consulted",
      character: "Framework-produced absence: Recommend gate fails.",
    },
  },
];

const COMPARISON: Record<CompareKey, { label: string; marriage: string; dharma: string; rule: string; color: string }> = {
  process: {
    label: "Construction process",
    marriage: "Extract significator, verdict, timing; cite empty cells.",
    dharma: "Same process, applied fresh to a different question.",
    rule: "Process transfers.",
    color: GREEN,
  },
  columns: {
    label: "Column design",
    marriage: "Three columns: substrate, verdict, timing.",
    dharma: "Two columns: substrate and characterisation.",
    rule: "Shape does not transfer.",
    color: GOLD,
  },
  denominator: {
    label: "True denominator",
    marriage: "Five for substrate: four full plus one partial.",
    dharma: "Three populated contributors; Parashara/KP are scoped out.",
    rule: "Count eligible streams, not table height.",
    color: BLUE,
  },
  convergence: {
    label: "Convergence type",
    marriage: "Same-point convergence on Saturn.",
    dharma: "Register-level convergence: Mars plus 10th-house resonance.",
    rule: "Use the right vocabulary.",
    color: SHANI,
  },
  divergence: {
    label: "Divergence",
    marriage: "Real Parashara/KP verdict divergence.",
    dharma: "No cross-stream divergence; Jaimini has an internal polarity.",
    rule: "Do not invent a cross-stream split.",
    color: RED,
  },
  empty: {
    label: "Empty-row discipline",
    marriage: "Empty cells are cited methodological absences.",
    dharma: "Distinguish scoping choice from framework-produced absence.",
    rule: "Empty does not mean one thing everywhere.",
    color: PURPLE,
  },
};

export function DualMatrixDomainComparison() {
  const [activeMatrix, setActiveMatrix] = useState<MatrixKey>("dharma");
  const [activeCompare, setActiveCompare] = useState<CompareKey>("columns");
  const [forceTemplate, setForceTemplate] = useState(false);
  const [equateConvergence, setEquateConvergence] = useState(false);

  const activeComparison = COMPARISON[activeCompare];
  const templateWarning = forceTemplate
    ? "Template warning: forcing verdict and timing onto the dharma matrix creates repeated not-applicable cells instead of respecting the question shape."
    : "The dharma matrix drops verdict and timing because the question is characterisation-shaped.";
  const convergenceWarning = equateConvergence
    ? "Vocabulary warning: the dharma finding is register-level convergence, not three streams naming Mars."
    : "Same-point and register-level convergence are both real, but they are not the same claim.";

  const matrixRows = activeMatrix === "marriage" ? MARRIAGE_ROWS : DHARMA_ROWS;

  const summary = useMemo(() => {
    if (activeMatrix === "marriage") return "Marriage asks a promise-testing question, so verdict and timing have real work to do.";
    return "Dharma asks a characterisation question, so the honest matrix is shorter and differently shaped.";
  }, [activeMatrix]);

  return (
    <div data-interactive="dual-matrix-domain-comparison" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY, fontFamily: fontFamilies.body }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Dual-matrix comparison</p>
            <h2 style={{ margin: "0.22rem 0 0", color: activeMatrix === "marriage" ? SHANI : MARS_COLOR, fontSize: "1.28rem", fontWeight: 600 }}>
              Same chart, two questions, two honest matrix shapes
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Compare the marriage-thread matrix with the dharma-thread matrix and see which parts of the method transfer.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveMatrix("dharma");
              setActiveCompare("columns");
              setForceTemplate(false);
              setEquateConvergence(false);
            }}
            style={softButtonStyle}
          >
            <RotateCcw size={16} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 540px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Domain map</p>
              <h3 style={{ margin: "0.16rem 0 0", color: activeMatrix === "marriage" ? SHANI : MARS_COLOR, fontSize: "1.1rem", fontWeight: 600 }}>{summary}</h3>
            </div>
            <span style={pillStyle(activeComparison.color)}>
              <GitCompare size={15} aria-hidden="true" />
              {activeComparison.rule}
            </span>
          </div>

          <DomainSvg activeMatrix={activeMatrix} activeCompare={activeCompare} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))", gap: "0.65rem", marginTop: "0.8rem" }}>
            <button type="button" onClick={() => setActiveMatrix("marriage")} aria-pressed={activeMatrix === "marriage"} style={domainCardStyle(activeMatrix === "marriage", SHANI)}>
              <SaturnIcon />
              <span>Marriage matrix</span>
              <small>Promise-testing shape</small>
            </button>
            <button type="button" onClick={() => setActiveMatrix("dharma")} aria-pressed={activeMatrix === "dharma"} style={domainCardStyle(activeMatrix === "dharma", MARS_COLOR)}>
              <Mars size={18} aria-hidden="true" />
              <span>Dharma matrix</span>
              <small>Characterisation shape</small>
            </button>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.8rem", flex: "1 1 310px" }}>
          <Panel title="Comparison row" icon={<SplitSquareHorizontal size={18} />} color={activeComparison.color}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {(Object.keys(COMPARISON) as CompareKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setActiveCompare(key)} aria-pressed={activeCompare === key} style={choiceStyle(activeCompare === key, COMPARISON[key].color)}>
                  {compareIcon(key)}
                  {COMPARISON[key].label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Template stress test" icon={<AlertTriangle size={18} />} color={forceTemplate || equateConvergence ? RED : GOLD}>
            <button type="button" aria-pressed={forceTemplate} onClick={() => setForceTemplate((value) => !value)} style={toggleButtonStyle(forceTemplate, RED)}>
              Force marriage columns onto dharma
            </button>
            <button type="button" aria-pressed={equateConvergence} onClick={() => setEquateConvergence((value) => !value)} style={toggleButtonStyle(equateConvergence, RED)}>
              Call dharma same-point convergence
            </button>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>{activeMatrix === "marriage" ? "Marriage-thread matrix" : "Dharma-thread matrix"}</p>
        <div style={{ overflowX: "auto", marginTop: "0.8rem" }}>
          <div style={{ minWidth: activeMatrix === "marriage" || forceTemplate ? 820 : 640, display: "grid", gridTemplateColumns: activeMatrix === "marriage" || forceTemplate ? "150px repeat(3, minmax(170px, 1fr))" : "150px repeat(2, minmax(220px, 1fr))", gap: "0.48rem" }}>
            <CellHeader>Stream</CellHeader>
            <CellHeader>Significator / substrate</CellHeader>
            {activeMatrix === "marriage" || forceTemplate ? <CellHeader>{activeMatrix === "dharma" ? "Verdict forced" : "Verdict"}</CellHeader> : null}
            {activeMatrix === "marriage" || forceTemplate ? <CellHeader>{activeMatrix === "dharma" ? "Timing forced" : "Timing"}</CellHeader> : <CellHeader>Characterisation</CellHeader>}
            {matrixRows.map((row) => (
              <Fragment key={row.stream}>
                <div style={{ ...cellStyle, borderLeft: `4px solid ${row.color}`, color: INK_PRIMARY }}>{row.stream}</div>
                <MatrixCell color={row.color}>{row.cells.substrate}</MatrixCell>
                {activeMatrix === "marriage" || forceTemplate ? (
                  <MatrixCell color={activeMatrix === "dharma" ? RED : row.color}>{row.cells.verdict ?? "Not applicable"}</MatrixCell>
                ) : null}
                {activeMatrix === "marriage" || forceTemplate ? (
                  <MatrixCell color={activeMatrix === "dharma" ? RED : row.color}>{row.cells.timing ?? "Not applicable"}</MatrixCell>
                ) : (
                  <MatrixCell color={row.color}>{row.cells.character}</MatrixCell>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>{activeComparison.label}</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
            <CompareCard title="Marriage thread" body={activeComparison.marriage} color={SHANI} icon={<SaturnIcon />} />
            <CompareCard title="Dharma thread" body={activeComparison.dharma} color={MARS_COLOR} icon={<Mars size={16} />} />
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: forceTemplate || equateConvergence ? RED : GREEN }}>
          <p style={eyebrowStyle}>Method rule</p>
          <h3 style={{ margin: "0.2rem 0 0", color: forceTemplate || equateConvergence ? RED : GREEN, fontSize: "1.08rem", fontWeight: 600 }}>
            {activeComparison.rule}
          </h3>
          <p style={bodyTextStyle}>{templateWarning}</p>
          <p style={bodyTextStyle}>{convergenceWarning}</p>
        </section>
      </div>
    </div>
  );
}

function DomainSvg({ activeMatrix, activeCompare }: { activeMatrix: MatrixKey; activeCompare: CompareKey }) {
  const marriageActive = activeMatrix === "marriage";
  const dharmaActive = activeMatrix === "dharma";
  const compare = COMPARISON[activeCompare];
  return (
    <svg viewBox="0 0 560 270" role="img" aria-label="Dual matrix comparison diagram" style={{ width: "100%", minHeight: 250, display: "block", marginTop: "0.8rem" }}>
      <rect x="8" y="8" width="544" height="254" rx="8" fill="rgba(255,255,255,0.22)" stroke={HAIRLINE} />
      <line x1="280" y1="42" x2="280" y2="226" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="7 7" />

      <g>
        <rect x="38" y="48" width="190" height="150" rx="8" fill={`color-mix(in srgb, ${SHANI} ${marriageActive ? 15 : 7}%, transparent)`} stroke={marriageActive ? SHANI : `${SHANI}88`} strokeWidth={marriageActive ? 3 : 1.5} />
        <circle cx="132" cy="88" r="26" fill="var(--gl-card-surface-solid)" stroke={SHANI} strokeWidth="2" />
        <SaturnIcon x={122} y={78} />
        <text x="132" y="130" textAnchor="middle" fill={SHANI} fontSize="15" fontWeight="500">Marriage</text>
        <text x="132" y="149" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">substrate / verdict / timing</text>
        <text x="132" y="171" textAnchor="middle" fill={INK_MUTED} fontSize="10">same-point Saturn</text>
      </g>

      <g>
        <rect x="332" y="48" width="190" height="150" rx="8" fill={`color-mix(in srgb, ${MARS_COLOR} ${dharmaActive ? 15 : 7}%, transparent)`} stroke={dharmaActive ? MARS_COLOR : `${MARS_COLOR}88`} strokeWidth={dharmaActive ? 3 : 1.5} />
        <circle cx="427" cy="88" r="26" fill="var(--gl-card-surface-solid)" stroke={MARS_COLOR} strokeWidth="2" />
        <Mars x={417} y={78} size={20} color={MARS_COLOR} aria-hidden="true" />
        <text x="427" y="130" textAnchor="middle" fill={MARS_COLOR} fontSize="15" fontWeight="500">Dharma</text>
        <text x="427" y="149" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">substrate / characterisation</text>
        <text x="427" y="171" textAnchor="middle" fill={INK_MUTED} fontSize="10">register-level Mars + 10th</text>
      </g>

      <path d="M228 122 C248 102, 310 102, 332 122" fill="none" stroke={compare.color} strokeWidth="4" strokeLinecap="round" />
      <circle cx="280" cy="102" r="25" fill="var(--gl-card-surface-solid)" stroke={compare.color} strokeWidth="2.5" />
      <text x="280" y="107" textAnchor="middle" fill={compare.color} fontSize="11" fontWeight="500">{compare.label}</text>
      <text x="280" y="232" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">{compare.rule}</text>
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

function CellHeader({ children }: { children: ReactNode }) {
  return <div style={{ ...cellStyle, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.76rem" }}>{children}</div>;
}

function MatrixCell({ color, children }: { color: string; children: ReactNode }) {
  return <div style={{ ...cellStyle, borderTop: `3px solid ${color}`, background: `color-mix(in srgb, ${color} 6%, transparent)` }}>{children}</div>;
}

function CompareCard({ title, body, color, icon }: { title: string; body: string; color: string; icon: ReactNode }) {
  return (
    <div style={{ border: `1px solid ${color}55`, borderRadius: 8, padding: "0.7rem", background: `color-mix(in srgb, ${color} 7%, transparent)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>{body}</p>
    </div>
  );
}

function SaturnIcon(props: { x?: number; y?: number }) {
  return <Orbit x={props.x} y={props.y} size={20} color={SHANI} aria-hidden="true" />;
}

function compareIcon(key: CompareKey) {
  if (key === "process") return <BookOpenCheck size={16} aria-hidden="true" />;
  if (key === "columns") return <Grid3X3 size={16} aria-hidden="true" />;
  if (key === "denominator") return <Layers3 size={16} aria-hidden="true" />;
  if (key === "convergence") return <BadgeCheck size={16} aria-hidden="true" />;
  if (key === "divergence") return <AlertTriangle size={16} aria-hidden="true" />;
  return <Lock size={16} aria-hidden="true" />;
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

function domainCardStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "rgba(255,255,255,0.24)",
    color: active ? color : INK_SECONDARY,
    padding: "0.72rem",
    display: "grid",
    gap: "0.24rem",
    justifyItems: "start",
    textAlign: "left",
    fontWeight: 500,
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

const cellStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,255,255,0.24)",
  padding: "0.65rem",
  color: INK_SECONDARY,
  minHeight: 56,
  display: "grid",
  alignContent: "center",
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
