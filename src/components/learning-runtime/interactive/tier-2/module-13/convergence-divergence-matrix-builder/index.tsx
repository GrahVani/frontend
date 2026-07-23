"use client";

import { Fragment, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CircleDot,
  Eye,
  EyeOff,
  Filter,
  GitBranch,
  Grid3X3,
  Link2,
  Lock,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { grahas, ink, streams as learningStreams } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from '@/components/learning-runtime/interactive/lib/layouts';

type StreamKey = "parashara" | "kp" | "jaimini" | "lal-kitab" | "tajika" | "nadi";
type ColumnKey = "substrate" | "verdict" | "timing";
type CellState = "full" | "partial" | "corroboration" | "empty" | "warning";

interface MatrixCell {
  state: CellState;
  title: string;
  body: string;
  source: string;
}

interface MatrixRow {
  key: StreamKey;
  stream: string;
  method: string;
  cells: Record<ColumnKey, MatrixCell>;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHANI = grahas.shani.primary;
const GOLD = ink.goldAccent;
const GREEN = learningStreams.tajika.primary;
const BLUE = learningStreams.kp.primary;
const RED = learningStreams["lal-kitab"].primary;
const PURPLE = learningStreams.jaimini.primary;

const COLUMNS: Record<ColumnKey, { label: string; short: string; note: string }> = {
  substrate: {
    label: "Central significator / substrate",
    short: "Substrate",
    note: "Which graha or mechanism the stream names as central.",
  },
  verdict: {
    label: "Verdict",
    short: "Verdict",
    note: "Only streams structurally able to render a judgement should fill this cell.",
  },
  timing: {
    label: "Timing signal",
    short: "Timing",
    note: "Dasha, annual-return, or period-specific contribution where the stream actually gives one.",
  },
};

const MATRIX: MatrixRow[] = [
  {
    key: "parashara",
    stream: "Parashara",
    method: "7th lordship and dasha context",
    cells: {
      substrate: {
        state: "full",
        title: "Saturn",
        body: "7th lord, dusthana-placed in Cancer, enemy sign, with no benefic aspect reaching either point.",
        source: "Lesson 13.2.3 §4.1",
      },
      verdict: {
        state: "partial",
        title: "Weak-to-moderate",
        body: "The marriage promise leans weak rather than cleanly strong.",
        source: "Lesson 13.2.3",
      },
      timing: {
        state: "partial",
        title: "15 June 2026",
        body: "Saturn's 19-year Mahadasha begins; salience rises, but this alone does not confirm the outcome.",
        source: "Lesson 13.2.3",
      },
    },
  },
  {
    key: "kp",
    stream: "KP",
    method: "7th-cuspal sub-lord test",
    cells: {
      substrate: {
        state: "full",
        title: "Saturn",
        body: "7th-cuspal sub-lord through direct 7th-house ownership.",
        source: "Lesson 13.3.1",
      },
      verdict: {
        state: "full",
        title: "Clean YES",
        body: "The margin remains robust under both Krishnamurti and Lahiri ayanamsha checks.",
        source: "Lesson 13.3.3 §4.4",
      },
      timing: {
        state: "empty",
        title: "No dasha timing",
        body: "KP's cuspal test answers the promise; it is not itself a dasha-based timing mechanism here.",
        source: "Lesson 13.3.3",
      },
    },
  },
  {
    key: "jaimini",
    stream: "Jaimini",
    method: "Cara-karaka ranking",
    cells: {
      substrate: {
        state: "full",
        title: "Saturn",
        body: "Darakaraka by lowest degree among the seven cara-karakas, independent of lordship and cuspal degree.",
        source: "Lesson 13.4.1 §4.1",
      },
      verdict: {
        state: "corroboration",
        title: "Corroboration only",
        body: "Jaimini contributes a real marriage-thread corroboration, not an independent whether verdict.",
        source: "Lesson 13.4.1",
      },
      timing: {
        state: "empty",
        title: "No timing signal",
        body: "This Jaimini layer does not produce a period-specific timing cell for this thread.",
        source: "Lesson 13.4.1",
      },
    },
  },
  {
    key: "lal-kitab",
    stream: "Lal Kitab",
    method: "Teva box cross-validation",
    cells: {
      substrate: {
        state: "full",
        title: "Saturn",
        body: "Teva box 4, built mechanically from the natal sign, cross-validates the same Saturn thread.",
        source: "Lesson 13.5.1 §4.3",
      },
      verdict: {
        state: "corroboration",
        title: "Cross-validates",
        body: "Confirms the Parashari tier as a remedy-augmentation layer; it does not independently re-derive a verdict.",
        source: "Lesson 13.5.1 §4.3",
      },
      timing: {
        state: "empty",
        title: "No timing signal",
        body: "The Lal Kitab layer contributes validation and remedy context, not a timing mechanism here.",
        source: "Lesson 13.5.1",
      },
    },
  },
  {
    key: "tajika",
    stream: "Tajika",
    method: "Year-specific Varshaphala layer",
    cells: {
      substrate: {
        state: "partial",
        title: "Saturn candidate",
        body: "Saturn is a guaranteed Varshesha candidate for the age-42 varsha; the final office remains unresolved.",
        source: "Lesson 13.5.2 §4.2",
      },
      verdict: {
        state: "empty",
        title: "Not rendered",
        body: "Varshesha candidacy is a partial finding, not a marriage-promise verdict.",
        source: "Lesson 13.5.2 §4.2",
      },
      timing: {
        state: "full",
        title: "3 August 2026",
        body: "Muntha lands in the 7th house; the solar return comes forty-nine days after the Mahadasha onset.",
        source: "Lesson 13.5.2 §4.3",
      },
    },
  },
  {
    key: "nadi",
    stream: "Nadi",
    method: "Documented absence",
    cells: {
      substrate: {
        state: "empty",
        title: "Not consulted",
        body: "Nadi remains present as a checked absence rather than disappearing from the matrix.",
        source: "Lesson 13.5.3 §4.4",
      },
      verdict: {
        state: "empty",
        title: "Not consulted",
        body: "The Recommend gate fails under the Tier 1 three-question test.",
        source: "Lesson 13.5.3 §4.4",
      },
      timing: {
        state: "empty",
        title: "Not consulted",
        body: "No Nadi timing cell is created because the stream is intentionally not used here.",
        source: "Lesson 13.5.3 §4.4",
      },
    },
  },
];

export function ConvergenceDivergenceMatrixBuilder() {
  const [activeColumn, setActiveColumn] = useState<ColumnKey>("substrate");
  const [activeStream, setActiveStream] = useState<StreamKey>("parashara");
  const [hideEmpty, setHideEmpty] = useState(false);
  const [showSources, setShowSources] = useState(true);
  const [scopeAttempt, setScopeAttempt] = useState(false);

  const activeRow = MATRIX.find((row) => row.key === activeStream) ?? MATRIX[0];
  const activeCell = activeRow.cells[activeColumn];

  const visibleRows = useMemo(() => {
    if (!hideEmpty) return MATRIX;
    return MATRIX.filter((row) => row.cells[activeColumn].state !== "empty");
  }, [activeColumn, hideEmpty]);

  const counts = useMemo(() => {
    const cells = MATRIX.map((row) => row.cells[activeColumn]);
    return {
      full: cells.filter((cell) => cell.state === "full").length,
      partial: cells.filter((cell) => cell.state === "partial").length,
      corroboration: cells.filter((cell) => cell.state === "corroboration").length,
      empty: cells.filter((cell) => cell.state === "empty").length,
    };
  }, [activeColumn]);

  const columnReading = useMemo(() => {
    if (activeColumn === "substrate") {
      return "Four streams fully converge on Saturn, while Tajika adds an honest partial fifth thread. Nadi is a documented absence.";
    }
    if (activeColumn === "verdict") {
      return "Only Parashara and KP render independent verdicts. They both lean affirmative, but one is hedged and the other is a clean yes.";
    }
    return "Parashara and Tajika converge on the same 2026 window through independent timing systems, forty-nine days apart.";
  }, [activeColumn]);

  return (
    <div data-interactive="convergence-divergence-matrix-builder" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY, fontFamily: fontFamilies.body }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chart MD1 marriage-promise matrix</p>
            <h2 style={{ margin: "0.22rem 0 0", color: SHANI, fontSize: "1.28rem", fontWeight: 600 }}>
              Populate the six-row matrix from already verified stream findings
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Click columns and cells to see why full convergence, partial convergence, corroboration, and documented absence are different kinds of honest evidence.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveColumn("substrate");
              setActiveStream("parashara");
              setHideEmpty(false);
              setShowSources(true);
              setScopeAttempt(false);
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
              <p style={eyebrowStyle}>Convergence map</p>
              <h3 style={{ margin: "0.16rem 0 0", color: columnColor(activeColumn), fontSize: "1.1rem", fontWeight: 600 }}>
                {COLUMNS[activeColumn].label}
              </h3>
            </div>
            <span style={pillStyle(columnColor(activeColumn))}>
              <Grid3X3 size={15} aria-hidden="true" />
              {counts.full} full · {counts.partial} partial · {counts.empty} empty
            </span>
          </div>
          <ConvergenceSvg activeColumn={activeColumn} activeStream={activeStream} />
          <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{columnReading}</p>
        </section>

        <section style={{ display: "grid", gap: "0.8rem", flex: "1 1 300px" }}>
          <Panel title="Column lens" icon={<Filter size={18} />} color={columnColor(activeColumn)}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(Object.keys(COLUMNS) as ColumnKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={activeColumn === key} onClick={() => setActiveColumn(key)} style={chipStyle(activeColumn === key, columnColor(key))}>
                  {COLUMNS[key].short}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{COLUMNS[activeColumn].note}</p>
          </Panel>

          <Panel title="View controls" icon={hideEmpty ? <EyeOff size={18} /> : <Eye size={18} />} color={GOLD}>
            <ToggleLine checked={hideEmpty} onChange={setHideEmpty} label="Hide empty cells in active column" />
            <ToggleLine checked={showSources} onChange={setShowSources} label="Show source lesson tags" />
            <p style={bodyTextStyle}>
              Hiding empty cells is useful for focus, but the lesson’s discipline is to restore them before writing the final matrix.
            </p>
          </Panel>

          <Panel title="Scope test" icon={scopeAttempt ? <AlertTriangle size={18} /> : <Lock size={18} />} color={scopeAttempt ? RED : GREEN}>
            <button type="button" aria-pressed={scopeAttempt} onClick={() => setScopeAttempt((value) => !value)} style={scopeButtonStyle(scopeAttempt)}>
              Try adding Karakamsa to Jaimini verdict
            </button>
            <p style={bodyTextStyle}>
              {scopeAttempt
                ? "Scope warning: Karakamsa belongs to the separate dharma-path thread, not this marriage-promise verdict cell."
                : "This cell accepts only findings scoped to Chart MD1's marriage-promise matrix."}
            </p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ overflowX: "auto", paddingBottom: "0.2rem" }}>
          <div style={{ minWidth: 820, display: "grid", gridTemplateColumns: "160px repeat(3, minmax(190px, 1fr))", gap: "0.48rem" }} role="table" aria-label="Populated convergence divergence matrix">
            <CellHeader>Stream</CellHeader>
            {(Object.keys(COLUMNS) as ColumnKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setActiveColumn(key)} aria-pressed={activeColumn === key} style={matrixHeaderButtonStyle(activeColumn === key, columnColor(key))}>
                {COLUMNS[key].label}
              </button>
            ))}
            {visibleRows.map((row) => (
              <Fragment key={row.key}>
                <button type="button" onClick={() => setActiveStream(row.key)} aria-pressed={activeStream === row.key} style={streamHeaderStyle(activeStream === row.key, streamColor(row.key))}>
                  <span>{row.stream}</span>
                  <small>{row.method}</small>
                </button>
                {(Object.keys(COLUMNS) as ColumnKey[]).map((column) => {
                  const cell = row.cells[column];
                  const active = activeStream === row.key && activeColumn === column;
                  return (
                    <button key={`${row.key}-${column}`} type="button" onClick={() => { setActiveStream(row.key); setActiveColumn(column); }} style={matrixCellStyle(active, cell)} aria-pressed={active}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: stateColor(cell.state), fontWeight: 600 }}>
                        {stateIcon(cell.state)}
                        {cell.title}
                      </span>
                      <span style={{ marginTop: "0.32rem", display: "block", color: INK_SECONDARY, lineHeight: 1.38 }}>{cell.body}</span>
                      {showSources ? <small style={{ marginTop: "0.36rem", display: "block", color: INK_MUTED }}>{cell.source}</small> : null}
                    </button>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, borderColor: stateColor(activeCell.state) }}>
          <p style={eyebrowStyle}>Selected cell</p>
          <h3 style={{ margin: "0.2rem 0 0", color: stateColor(activeCell.state), fontSize: "1.12rem", fontWeight: 600 }}>
            {activeRow.stream}: {COLUMNS[activeColumn].short}
          </h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
            {activeCell.body}
          </p>
          <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, display: "inline-flex", gap: "0.4rem", alignItems: "center" }}>
            <Link2 size={15} aria-hidden="true" />
            {activeCell.source}
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Matrix discipline</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
            <MiniRule icon={<BadgeCheck size={17} />} color={GREEN} title="Full convergence" body="Same thread, same column, independent stream mechanism." />
            <MiniRule icon={<GitBranch size={17} />} color={GOLD} title="Partial or corroborating" body="Real contribution, but not rounded up into a verdict or full convergence." />
            <MiniRule icon={<ShieldCheck size={17} />} color={PURPLE} title="Empty cell" body="A cited methodological absence. It is a finding, not missing homework." />
          </div>
        </section>
      </div>
    </div>
  );
}

function ConvergenceSvg({ activeColumn, activeStream }: { activeColumn: ColumnKey; activeStream: StreamKey }) {
  const points: Record<StreamKey, { x: number; y: number }> = {
    parashara: { x: 80, y: 70 },
    kp: { x: 95, y: 210 },
    jaimini: { x: 250, y: 285 },
    "lal-kitab": { x: 420, y: 210 },
    tajika: { x: 435, y: 70 },
    nadi: { x: 255, y: 28 },
  };
  const center = { x: 260, y: 152 };

  return (
    <svg viewBox="0 0 520 320" role="img" aria-label="Saturn convergence diagram" style={{ width: "100%", minHeight: 260, display: "block", marginTop: "0.8rem" }}>
      <defs>
        <radialGradient id="saturnGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SHANI} stopOpacity="0.18" />
          <stop offset="100%" stopColor={SHANI} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="8" y="8" width="504" height="304" rx="8" fill="rgba(255,255,255,0.22)" stroke={HAIRLINE} />
      <circle cx={center.x} cy={center.y} r="88" fill="url(#saturnGlow)" />
      {MATRIX.map((row) => {
        const cell = row.cells[activeColumn];
        const point = points[row.key];
        const active = row.key === activeStream;
        const color = stateColor(cell.state);
        const dash = cell.state === "empty" ? "5 7" : cell.state === "partial" || cell.state === "corroboration" ? "9 5" : undefined;
        return (
          <g key={row.key}>
            <line x1={point.x} y1={point.y} x2={center.x} y2={center.y} stroke={color} strokeWidth={active ? 4 : 2} strokeOpacity={cell.state === "empty" ? 0.42 : 0.78} strokeDasharray={dash} />
            <circle cx={point.x} cy={point.y} r={active ? 29 : 24} fill="var(--gl-card-surface-solid)" stroke={active ? color : `${color}99`} strokeWidth={active ? 3 : 2} />
            <text x={point.x} y={point.y + 4} textAnchor="middle" fill={color} fontSize="10" fontWeight="500">{row.stream}</text>
          </g>
        );
      })}
      <circle cx={center.x} cy={center.y} r="46" fill="var(--gl-card-surface-solid)" stroke={SHANI} strokeWidth="2.5" />
      <CircleDot x={center.x - 14} y={center.y - 27} size={28} color={SHANI} aria-hidden="true" />
      <text x={center.x} y={center.y + 10} textAnchor="middle" fill={SHANI} fontSize="18" fontWeight="500">Saturn</text>
      <text x={center.x} y={center.y + 28} textAnchor="middle" fill={INK_MUTED} fontSize="10">central thread</text>
      {activeColumn === "timing" ? (
        <g>
          <path d="M 168 258 C 222 230, 310 230, 362 258" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
          <circle cx="168" cy="258" r="6" fill={GOLD} />
          <circle cx="362" cy="258" r="6" fill={GREEN} />
          <text x="265" y="248" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">49 days apart in 2026</text>
          <text x="168" y="280" textAnchor="middle" fill={INK_MUTED} fontSize="10">15 Jun</text>
          <text x="362" y="280" textAnchor="middle" fill={INK_MUTED} fontSize="10">3 Aug</text>
        </g>
      ) : null}
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

function ToggleLine({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", border: `1px solid ${checked ? GREEN : HAIRLINE}`, borderRadius: 8, padding: "0.58rem 0.65rem", color: checked ? INK_PRIMARY : INK_SECONDARY, cursor: "pointer", marginBottom: "0.5rem" }}>
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function CellHeader({ children }: { children: ReactNode }) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.65rem", color: INK_MUTED, background: "rgba(255,255,255,0.28)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {children}
    </div>
  );
}

function MiniRule({ icon, color, title, body }: { icon: ReactNode; color: string; title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${color}55`, borderRadius: 8, padding: "0.7rem", background: `color-mix(in srgb, ${color} 8%, transparent)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.42 }}>{body}</p>
    </div>
  );
}

function columnColor(column: ColumnKey) {
  if (column === "substrate") return SHANI;
  if (column === "verdict") return BLUE;
  return GREEN;
}

function streamColor(stream: StreamKey) {
  return stream === "nadi" ? learningStreams.nadi.primary : learningStreams[stream].primary;
}

function stateColor(state: CellState) {
  if (state === "full") return GREEN;
  if (state === "partial") return GOLD;
  if (state === "corroboration") return PURPLE;
  if (state === "warning") return RED;
  return INK_MUTED;
}

function stateIcon(state: CellState) {
  if (state === "full") return <BadgeCheck size={15} aria-hidden="true" />;
  if (state === "partial") return <CircleDot size={15} aria-hidden="true" />;
  if (state === "corroboration") return <GitBranch size={15} aria-hidden="true" />;
  if (state === "warning") return <AlertTriangle size={15} aria-hidden="true" />;
  return <ShieldCheck size={15} aria-hidden="true" />;
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

function chipStyle(active: boolean, color: string): CSSProperties {
  return {
    appearance: "none",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 12%, transparent)` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.48rem 0.65rem",
    font: "inherit",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function matrixHeaderButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 11%, transparent)` : "rgba(255,255,255,0.28)",
    color: active ? color : INK_SECONDARY,
    padding: "0.65rem",
    minHeight: 52,
    fontSize: "0.82rem",
    fontWeight: 500,
  };
}

function streamHeaderStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderLeft: `4px solid ${color}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "rgba(255,255,255,0.26)",
    color: INK_PRIMARY,
    padding: "0.65rem",
    textAlign: "left",
    display: "grid",
    gap: "0.24rem",
    alignContent: "start",
  };
}

function matrixCellStyle(active: boolean, cell: MatrixCell): CSSProperties {
  const color = stateColor(cell.state);
  return {
    ...buttonResetStyle,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderTop: `3px solid ${color}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 9%, transparent)` : cell.state === "empty" ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.28)",
    color: INK_PRIMARY,
    padding: "0.68rem",
    minHeight: 136,
    textAlign: "left",
    fontSize: "0.82rem",
  };
}

function scopeButtonStyle(active: boolean): CSSProperties {
  return {
    ...buttonResetStyle,
    width: "100%",
    border: `1px solid ${active ? RED : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${RED} 10%, transparent)` : "transparent",
    color: active ? RED : INK_SECONDARY,
    padding: "0.62rem 0.7rem",
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
  margin: "0.6rem 0 0",
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
