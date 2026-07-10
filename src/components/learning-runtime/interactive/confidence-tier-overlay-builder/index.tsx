"use client";

import { Fragment, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Ban,
  Calculator,
  CheckCircle2,
  GitBranch,
  Grid3X3,
  Layers3,
  Lock,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { grahas, ink, streams as learningStreams } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "../lib/layouts";

type ColumnKey = "substrate" | "verdict" | "timing";
type ProtocolStep = "settings" | "data" | "reasoning" | "report";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = ink.goldAccent;
const SHANI = grahas.shani.primary;
const GREEN = learningStreams.tajika.primary;
const RED = learningStreams["lal-kitab"].primary;

const COLUMNS: Record<ColumnKey, {
  label: string;
  trueDenominator: number;
  naiveDenominator: number;
  numerator: number;
  classification: string;
  color: string;
  note: string;
}> = {
  substrate: {
    label: "Substrate",
    trueDenominator: 5,
    naiveDenominator: 5,
    numerator: 4,
    classification: "4-of-5, strong",
    color: GREEN,
    note: "Four full Saturn convergences plus one genuine Tajika partial. Strong, with the partial fifth thread named.",
  },
  verdict: {
    label: "Verdict",
    trueDenominator: 2,
    naiveDenominator: 5,
    numerator: 0,
    classification: "Re-examine",
    color: RED,
    note: "Only Parashara and KP render independent verdicts, and those two diverge. Do not label this 2-of-5 weak.",
  },
  timing: {
    label: "Timing",
    trueDenominator: 2,
    naiveDenominator: 5,
    numerator: 2,
    classification: "Minor timing support",
    color: GOLD,
    note: "Parashara and Tajika converge on the 2026 window. This supports timing, not the marriage verdict itself.",
  },
};

const MATRIX_ROWS = [
  { stream: "Parashara", substrate: "Saturn", verdict: "Weak-to-moderate", timing: "15 Jun 2026", color: learningStreams.parashara.primary },
  { stream: "KP", substrate: "Saturn", verdict: "Clean YES", timing: "No timing cell", color: learningStreams.kp.primary },
  { stream: "Jaimini", substrate: "Saturn", verdict: "Corroboration only", timing: "Empty", color: learningStreams.jaimini.primary },
  { stream: "Lal Kitab", substrate: "Saturn", verdict: "Cross-validates", timing: "Empty", color: learningStreams["lal-kitab"].primary },
  { stream: "Tajika", substrate: "Saturn candidate", verdict: "Not rendered", timing: "3 Aug 2026", color: learningStreams.tajika.primary },
  { stream: "Nadi", substrate: "Not consulted", verdict: "Not consulted", timing: "Not consulted", color: learningStreams.nadi.primary },
] as const;

const PROTOCOL: Record<ProtocolStep, { title: string; body: string; outcome: string }> = {
  settings: {
    title: "1. Rule out settings error",
    body: "KP's cuspal sub-lord margin was checked under both Krishnamurti and Lahiri ayanamshas.",
    outcome: "No settings artefact found.",
  },
  data: {
    title: "2. Check the data",
    body: "Chart MD1 uses full stated birth precision and no rectification flag is raised in Chapters 2-5.",
    outcome: "No obvious data-quality suspect.",
  },
  reasoning: {
    title: "3. Recheck reasoning",
    body: "Parashara's weak-to-moderate result and KP's clean YES each hold on their own method.",
    outcome: "Both derivations survive recheck.",
  },
  report: {
    title: "4. Report honestly",
    body: "The divergence is real, examined, and unresolved. State both findings side by side.",
    outcome: "Do not blend into one tier.",
  },
};

export function ConfidenceTierOverlayBuilder() {
  const [activeColumn, setActiveColumn] = useState<ColumnKey>("substrate");
  const [denominatorOverride, setDenominatorOverride] = useState(false);
  const [protocolStep, setProtocolStep] = useState<ProtocolStep>("settings");
  const [attemptAverage, setAttemptAverage] = useState(false);
  const [showNaiveCount, setShowNaiveCount] = useState(false);

  const column = COLUMNS[activeColumn];
  const denominator = activeColumn === "verdict" && !denominatorOverride ? column.naiveDenominator : column.trueDenominator;

  const classification = useMemo(() => {
    if (activeColumn === "verdict" && !denominatorOverride) {
      return { label: "Naive 2-of-5 weak is blocked", color: RED, body: "This denominator treats three non-verdict streams as if they refused to agree. Turn on the true denominator." };
    }
    if (activeColumn === "verdict") {
      return { label: "0-of-2 agreement: re-examine", color: RED, body: "The column is a head-to-head divergence, so the re-examination protocol is the right tool." };
    }
    return { label: column.classification, color: column.color, body: column.note };
  }, [activeColumn, column, denominatorOverride]);

  const assembledStatement = attemptAverage
    ? "Blocked: strong substrate and divergent verdict are not values on one scale. A blended moderate tier would be invented."
    : "Chart MD1 has a strong, still-partially-open Saturn substrate; a real, re-examined Parashara/KP verdict divergence; and minor 2026 timing support.";

  return (
    <div data-interactive="confidence-tier-overlay-builder" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY, fontFamily: fontFamilies.body }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Tier overlay view</p>
            <h2 style={{ margin: "0.22rem 0 0", color: SHANI, fontSize: "1.28rem", fontWeight: 600 }}>
              Classify each matrix column by its true denominator
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 940 }}>
              Apply the five-stream tier table where it fits, route true divergence to re-examination, and block the tempting average into one vague tier.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveColumn("substrate");
              setDenominatorOverride(false);
              setProtocolStep("settings");
              setAttemptAverage(false);
              setShowNaiveCount(false);
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
              <p style={eyebrowStyle}>Column classification board</p>
              <h3 style={{ margin: "0.16rem 0 0", color: classification.color, fontSize: "1.1rem", fontWeight: 600 }}>
                {classification.label}
              </h3>
            </div>
            <span style={pillStyle(classification.color)}>
              <Calculator size={15} aria-hidden="true" />
              denominator {denominator}
            </span>
          </div>

          <TierOverlaySvg activeColumn={activeColumn} denominatorOverride={denominatorOverride} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))", gap: "0.65rem", marginTop: "0.8rem" }}>
            {(Object.keys(COLUMNS) as ColumnKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setActiveColumn(key)} aria-pressed={activeColumn === key} style={columnCardStyle(activeColumn === key, COLUMNS[key].color)}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.42rem", color: COLUMNS[key].color, fontWeight: 600 }}>
                  {key === "verdict" ? <GitBranch size={16} /> : key === "timing" ? <Layers3 size={16} /> : <Grid3X3 size={16} />}
                  {COLUMNS[key].label}
                </span>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.4 }}>{COLUMNS[key].classification}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.8rem", flex: "1 1 300px" }}>
          <Panel title="True denominator" icon={<Calculator size={18} />} color={classification.color}>
            <p style={bodyTextStyle}>{classification.body}</p>
            {activeColumn === "verdict" ? (
              <button type="button" aria-pressed={denominatorOverride} onClick={() => setDenominatorOverride((value) => !value)} style={toggleButtonStyle(denominatorOverride, GREEN)}>
                {denominatorOverride ? "Using true denominator: 2" : "Use true denominator: 2"}
              </button>
            ) : (
              <p style={smallNoteStyle}>This column can use its count directly because the eligible denominator is already clear.</p>
            )}
            <label style={checkLineStyle}>
              <input type="checkbox" checked={showNaiveCount} onChange={(event) => setShowNaiveCount(event.target.checked)} />
              Show naive N-of-5 comparison
            </label>
          </Panel>

          <Panel title="Averaging guard" icon={attemptAverage ? <Ban size={18} /> : <Lock size={18} />} color={attemptAverage ? RED : GOLD}>
            <button type="button" aria-pressed={attemptAverage} onClick={() => setAttemptAverage((value) => !value)} style={toggleButtonStyle(attemptAverage, RED)}>
              Attempt one combined tier
            </button>
            <p style={bodyTextStyle}>{assembledStatement}</p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Tier overlay table</p>
        <div style={{ overflowX: "auto", marginTop: "0.8rem" }}>
          <div style={{ minWidth: 760, display: "grid", gridTemplateColumns: "150px repeat(3, minmax(170px, 1fr))", gap: "0.48rem" }}>
            <CellHeader>Stream</CellHeader>
            {(Object.keys(COLUMNS) as ColumnKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setActiveColumn(key)} aria-pressed={activeColumn === key} style={headerButtonStyle(activeColumn === key, COLUMNS[key].color)}>
                {COLUMNS[key].label}
                <small>{key === "verdict" && !denominatorOverride ? "recheck denominator" : COLUMNS[key].classification}</small>
              </button>
            ))}
            {MATRIX_ROWS.map((row) => (
              <Fragment key={row.stream}>
                <div style={{ ...cellStyle, borderLeft: `4px solid ${row.color}`, color: INK_PRIMARY }}>{row.stream}</div>
                <MatrixCell active={activeColumn === "substrate"} color={GREEN}>{row.substrate}</MatrixCell>
                <MatrixCell active={activeColumn === "verdict"} color={row.stream === "Parashara" || row.stream === "KP" ? RED : INK_MUTED}>{row.verdict}</MatrixCell>
                <MatrixCell active={activeColumn === "timing"} color={row.timing.includes("2026") ? GOLD : INK_MUTED}>{row.timing}</MatrixCell>
              </Fragment>
            ))}
          </div>
        </div>
        {showNaiveCount ? (
          <div style={{ marginTop: "0.85rem", border: `1px solid ${RED}55`, borderRadius: 8, padding: "0.75rem", background: `color-mix(in srgb, ${RED} 7%, transparent)`, color: INK_SECONDARY, lineHeight: 1.5 }}>
            Naive count check: the verdict column looks like 2-of-5 only if corroboration and absence are mistaken for verdicts. The lesson blocks that move and asks for the true denominator first.
          </div>
        ) : null}
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Re-examination protocol</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            {(Object.keys(PROTOCOL) as ProtocolStep[]).map((key) => (
              <button key={key} type="button" onClick={() => setProtocolStep(key)} aria-pressed={protocolStep === key} style={protocolButtonStyle(protocolStep === key)}>
                <CheckCircle2 size={16} aria-hidden="true" />
                {PROTOCOL[key].title}
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: RED }}>
          <p style={eyebrowStyle}>Selected protocol step</p>
          <h3 style={{ margin: "0.2rem 0 0", color: RED, fontSize: "1.1rem", fontWeight: 600 }}>{PROTOCOL[protocolStep].title}</h3>
          <p style={bodyTextStyle}>{PROTOCOL[protocolStep].body}</p>
          <p style={{ ...bodyTextStyle, color: INK_PRIMARY }}>
            <ShieldCheck size={16} aria-hidden="true" style={{ display: "inline", marginRight: "0.35rem", verticalAlign: "-0.16rem", color: GREEN }} />
            {PROTOCOL[protocolStep].outcome}
          </p>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: attemptAverage ? RED : GREEN }}>
        <div style={{ display: "flex", gap: "0.7rem", alignItems: "start" }}>
          <span style={{ color: attemptAverage ? RED : GREEN, marginTop: "0.1rem" }}>{attemptAverage ? <AlertTriangle size={20} /> : <BadgeCheck size={20} />}</span>
          <div>
            <p style={eyebrowStyle}>Final confidence statement</p>
            <p style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, lineHeight: 1.58 }}>{assembledStatement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TierOverlaySvg({ activeColumn, denominatorOverride }: { activeColumn: ColumnKey; denominatorOverride: boolean }) {
  const xFor = { substrate: 110, verdict: 260, timing: 410 } as const;
  const activeX = xFor[activeColumn];
  return (
    <svg viewBox="0 0 520 250" role="img" aria-label="Confidence tier overlay diagram" style={{ width: "100%", minHeight: 235, display: "block", marginTop: "0.8rem" }}>
      <rect x="8" y="8" width="504" height="234" rx="8" fill="rgba(255,255,255,0.22)" stroke={HAIRLINE} />
      <line x1="70" y1="176" x2="450" y2="176" stroke={HAIRLINE} strokeWidth="2" />
      {(Object.keys(COLUMNS) as ColumnKey[]).map((key) => {
        const column = COLUMNS[key];
        const x = xFor[key];
        const active = key === activeColumn;
        const height = key === "substrate" ? 112 : key === "verdict" ? 76 : 90;
        const label = key === "verdict" && !denominatorOverride ? "blocked" : column.classification;
        return (
          <g key={key}>
            <rect x={x - 44} y={176 - height} width="88" height={height} rx="8" fill={`color-mix(in srgb, ${column.color} ${active ? 18 : 9}%, transparent)`} stroke={active ? column.color : `${column.color}88`} strokeWidth={active ? 3 : 1.5} />
            <text x={x} y={198} textAnchor="middle" fill={active ? column.color : INK_SECONDARY} fontSize="13" fontWeight="500">{column.label}</text>
            <text x={x} y={214} textAnchor="middle" fill={INK_MUTED} fontSize="10">{label}</text>
          </g>
        );
      })}
      <path d={`M ${activeX - 58} 42 C ${activeX - 20} 24, ${activeX + 20} 24, ${activeX + 58} 42`} fill="none" stroke={COLUMNS[activeColumn].color} strokeWidth="3" strokeLinecap="round" />
      <circle cx={activeX} cy="42" r="24" fill="var(--gl-card-surface-solid)" stroke={COLUMNS[activeColumn].color} strokeWidth="2.5" />
      <text x={activeX} y="46" textAnchor="middle" fill={COLUMNS[activeColumn].color} fontSize="12" fontWeight="500">{activeColumn === "verdict" ? "2" : COLUMNS[activeColumn].trueDenominator}</text>
      <text x={activeX} y="78" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">true denominator</text>
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

function MatrixCell({ active, color, children }: { active: boolean; color: string; children: ReactNode }) {
  return <div style={{ ...cellStyle, borderTop: `3px solid ${color}`, background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "rgba(255,255,255,0.24)" }}>{children}</div>;
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

function columnCardStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "rgba(255,255,255,0.24)",
    color: INK_PRIMARY,
    padding: "0.72rem",
    minHeight: 104,
    display: "grid",
    gap: "0.42rem",
    textAlign: "left",
  };
}

function headerButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "rgba(255,255,255,0.24)",
    color: active ? color : INK_SECONDARY,
    padding: "0.65rem",
    display: "grid",
    gap: "0.22rem",
    fontWeight: 500,
  };
}

function toggleButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonResetStyle,
    width: "100%",
    marginTop: "0.7rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${color} 10%, transparent)` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.6rem 0.7rem",
    fontWeight: 500,
  };
}

function protocolButtonStyle(active: boolean): CSSProperties {
  return {
    ...buttonResetStyle,
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? RED : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `color-mix(in srgb, ${RED} 9%, transparent)` : "transparent",
    color: active ? RED : INK_SECONDARY,
    padding: "0.62rem 0.7rem",
    textAlign: "left",
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
  minHeight: 54,
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

const smallNoteStyle: CSSProperties = {
  margin: "0.65rem 0 0",
  color: INK_MUTED,
  fontSize: "0.86rem",
  lineHeight: 1.45,
};

const checkLineStyle: CSSProperties = {
  marginTop: "0.65rem",
  display: "flex",
  alignItems: "center",
  gap: "0.45rem",
  color: INK_SECONDARY,
  fontSize: "0.9rem",
  cursor: "pointer",
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
