"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  Compass,
  GitCompare,
  Lock,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

type StrengthKey = "strong" | "moderate" | "weak";
type FieldKey = "authority" | "technical" | "teaching" | "creative";
type ReportMode = "synthesis" | "pickD1" | "pickD10";

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

const STRENGTHS = {
  strong: { label: "Strong", color: GREEN, score: 88, note: "well-supported, dignified, and coherent" },
  moderate: { label: "Moderate", color: GOLD, score: 58, note: "present but mixed or conditional" },
  weak: { label: "Weak", color: VERMILION, score: 28, note: "strained, afflicted, or under-resourced" },
} as const;

const FIELDS = {
  authority: { label: "Authority / management", color: BLUE, note: "visibility, rank, command, administration" },
  technical: { label: "Technical / systems", color: PURPLE, note: "engineering, tools, analytics, structured skill" },
  teaching: { label: "Teaching / counsel", color: GREEN, note: "guidance, learning, mentoring, advisory roles" },
  creative: { label: "Creative / public-facing", color: GOLD, note: "design, media, aesthetics, performance, outreach" },
} as const;

export function D1D10ConvergenceWorkbench() {
  const [d1Strength, setD1Strength] = useState<StrengthKey>("strong");
  const [d10Strength, setD10Strength] = useState<StrengthKey>("strong");
  const [d1Field, setD1Field] = useState<FieldKey>("authority");
  const [d10Field, setD10Field] = useState<FieldKey>("authority");
  const [vargottama, setVargottama] = useState(true);
  const [reportMode, setReportMode] = useState<ReportMode>("synthesis");
  const [activePattern, setActivePattern] = useState<"convergence" | "strongD1WeakD10" | "weakD1StrongD10" | "fieldDivergence">("convergence");

  const pattern = useMemo(() => {
    if (d1Field !== d10Field) return "fieldDivergence";
    if (d1Strength === "strong" && d10Strength === "weak") return "strongD1WeakD10";
    if (d1Strength === "weak" && d10Strength === "strong") return "weakD1StrongD10";
    return "convergence";
  }, [d10Field, d10Strength, d1Field, d1Strength]);

  const d1Score = STRENGTHS[d1Strength].score;
  const d10Score = STRENGTHS[d10Strength].score;
  const confidence = Math.max(8, Math.min(98, Math.round(d1Score * 0.42 + d10Score * 0.52 + (vargottama ? 12 : 0) - (pattern === "fieldDivergence" ? 18 : 0))));
  const patternColor = pattern === "convergence" ? GREEN : pattern === "strongD1WeakD10" ? VERMILION : pattern === "weakD1StrongD10" ? BLUE : PURPLE;
  const pickError = reportMode !== "synthesis" && pattern !== "convergence";

  const synthesis = useMemo(() => {
    const d1 = `D1 foundation: ${STRENGTHS[d1Strength].label.toLowerCase()} career promise pointing toward ${FIELDS[d1Field].label.toLowerCase()}.`;
    const d10 = `D10 refinement: ${STRENGTHS[d10Strength].label.toLowerCase()} career delivery pointing toward ${FIELDS[d10Field].label.toLowerCase()}.`;
    const varga = vargottama ? " Vargottama adds the strongest same-sign convergence." : " No vargottama reinforcement is selected.";
    const verdict =
      pattern === "convergence"
        ? "Verdict: convergence raises confidence, especially when both charts support the same field and level."
        : pattern === "strongD1WeakD10"
          ? "Verdict: good promise with weaker refined delivery; outcome may underdeliver relative to the D1."
          : pattern === "weakD1StrongD10"
            ? "Verdict: modest promise with strong refinement; career may rise above first impressions."
            : "Verdict: field divergence; the D10 refines the actual professional type rather than cancelling the D1.";
    const discipline = pickError ? " Reporting only one flattering chart is the error this lesson forbids." : " Both charts are retained: D1 as foundation, D10 with heavy career-outcome weight.";
    return `${d1} ${d10}${varga} ${verdict}${discipline}`;
  }, [d10Field, d10Strength, d1Field, d1Strength, pattern, pickError, vargottama]);

  return (
    <div data-interactive="d1-d10-convergence-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D1-D10 comparison workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Compare promise and refined delivery without picking favourites
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              D1 gives the career foundation. D10 carries heavy weight for career outcome. Convergence raises confidence; divergence becomes information.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setD1Strength("strong");
              setD10Strength("strong");
              setD1Field("authority");
              setD10Field("authority");
              setVargottama(true);
              setReportMode("synthesis");
              setActivePattern("convergence");
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Two-chart vector</p>
              <h3 style={{ margin: "0.15rem 0 0", color: patternColor, fontSize: "1.2rem" }}>{patternTitle(pattern)}</h3>
            </div>
            <strong style={{ color: patternColor, fontWeight: 700 }}>{confidence}% confidence</strong>
          </div>
          <ComparisonSvg pattern={pattern} d1Score={d1Score} d10Score={d10Score} vargottama={vargottama} d1Field={d1Field} d10Field={d10Field} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Compass size={16} />} title="D1" body="foundation / promise" color={BLUE} />
            <MiniFact icon={<BriefcaseBusiness size={16} />} title="D10" body="career outcome weight" color={GREEN} />
            <MiniFact icon={<Sparkles size={16} />} title="Vargottama" body={vargottama ? "strongest convergence" : "off"} color={GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Pattern presets" icon={<GitCompare size={18} />} color={patternColor}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <PresetButton active={activePattern === "convergence"} color={GREEN} onClick={() => { setD1Strength("strong"); setD10Strength("strong"); setD1Field("authority"); setD10Field("authority"); setVargottama(true); setActivePattern("convergence"); }}>
                Convergence
              </PresetButton>
              <PresetButton active={activePattern === "strongD1WeakD10"} color={VERMILION} onClick={() => { setD1Strength("strong"); setD10Strength("weak"); setD1Field("authority"); setD10Field("authority"); setVargottama(false); setActivePattern("strongD1WeakD10"); }}>
                Strong D1 / weak D10
              </PresetButton>
              <PresetButton active={activePattern === "weakD1StrongD10"} color={BLUE} onClick={() => { setD1Strength("weak"); setD10Strength("strong"); setD1Field("technical"); setD10Field("technical"); setVargottama(false); setActivePattern("weakD1StrongD10"); }}>
                Weak D1 / strong D10
              </PresetButton>
              <PresetButton active={activePattern === "fieldDivergence"} color={PURPLE} onClick={() => { setD1Strength("strong"); setD10Strength("strong"); setD1Field("authority"); setD10Field("technical"); setVargottama(false); setActivePattern("fieldDivergence"); }}>
                Different field
              </PresetButton>
            </div>
          </Panel>

          <Panel title="Report discipline" icon={pickError ? <AlertTriangle size={18} /> : <Lock size={18} />} color={pickError ? VERMILION : GREEN}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={reportMode === "synthesis"} onClick={() => setReportMode("synthesis")} style={smallChipStyle(reportMode === "synthesis", GREEN)}>
                Synthesize both
              </button>
              <button type="button" aria-pressed={reportMode === "pickD1"} onClick={() => setReportMode("pickD1")} style={smallChipStyle(reportMode === "pickD1", VERMILION)}>
                Pick D1
              </button>
              <button type="button" aria-pressed={reportMode === "pickD10"} onClick={() => setReportMode("pickD10")} style={smallChipStyle(reportMode === "pickD10", VERMILION)}>
                Pick D10
              </button>
            </div>
            <p style={bodyTextStyle}>{pickError ? "Divergence must be analysed, not resolved by desire or preference." : "Correct: the reading keeps D1 and D10 in conversation."}</p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <ChartControl title="D1 foundation" icon={<Target size={18} />} color={BLUE} strength={d1Strength} field={d1Field} onStrength={setD1Strength} onField={setD1Field} />
        <ChartControl title="D10 refinement" icon={<BriefcaseBusiness size={18} />} color={GREEN} strength={d10Strength} field={d10Field} onStrength={setD10Strength} onField={setD10Field} />
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Convergence marker</p>
          <button type="button" aria-pressed={vargottama} onClick={() => setVargottama((value) => !value)} style={togglePanelStyle(vargottama, GOLD)}>
            <BadgeCheck size={18} aria-hidden="true" />
            <span>
              <strong style={{ fontWeight: 700 }}>Vargottama career significator</strong>
              <span>{vargottama ? "Same sign in D1 and D10: the clearest two-yes across charts." : "No same-sign reinforcement selected."}</span>
            </span>
          </button>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.85rem" }}>
            <PatternRow active={pattern === "convergence"} color={GREEN} title="Convergence" body="Both charts agree; confidence rises." />
            <PatternRow active={pattern === "strongD1WeakD10"} color={VERMILION} title="Strong D1 / weak D10" body="Promise is real, but refined delivery may underperform." />
            <PatternRow active={pattern === "weakD1StrongD10"} color={BLUE} title="Weak D1 / strong D10" body="Career may exceed a modest foundation." />
            <PatternRow active={pattern === "fieldDivergence"} color={PURPLE} title="Different field" body="D10 sharpens or redirects the professional type." />
          </div>
        </section>

        <section style={{ ...cardStyle, borderColor: pickError ? `${VERMILION}66` : `${patternColor}66`, background: pickError ? `${VERMILION}0F` : `${patternColor}0F` }}>
          <p style={eyebrowStyle}>Synthesis output</p>
          <h3 style={{ margin: "0.15rem 0 0", color: pickError ? VERMILION : patternColor, fontSize: "1.18rem" }}>
            {pickError ? "Pick-a-favourite error" : patternTitle(pattern)}
          </h3>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function ChartControl({ title, icon, color, strength, field, onStrength, onField }: { title: string; icon: ReactNode; color: string; strength: StrengthKey; field: FieldKey; onStrength: (value: StrengthKey) => void; onField: (value: FieldKey) => void }) {
  return (
    <Panel title={title} icon={icon} color={color}>
      <ControlGroup label="Strength">
        {(Object.keys(STRENGTHS) as StrengthKey[]).map((key) => (
          <button key={key} type="button" aria-pressed={strength === key} onClick={() => onStrength(key)} style={smallChipStyle(strength === key, STRENGTHS[key].color)}>
            {STRENGTHS[key].label}
          </button>
        ))}
      </ControlGroup>
      <ControlGroup label="Field signal">
        {(Object.keys(FIELDS) as FieldKey[]).map((key) => (
          <button key={key} type="button" aria-pressed={field === key} onClick={() => onField(key)} style={smallChipStyle(field === key, FIELDS[key].color)}>
            {FIELDS[key].label}
          </button>
        ))}
      </ControlGroup>
      <ScoreBar score={STRENGTHS[strength].score} color={STRENGTHS[strength].color} />
      <p style={bodyTextStyle}>{STRENGTHS[strength].note}; field cue: {FIELDS[field].note}.</p>
    </Panel>
  );
}

function ComparisonSvg({ pattern, d1Score, d10Score, vargottama, d1Field, d10Field }: { pattern: string; d1Score: number; d10Score: number; vargottama: boolean; d1Field: FieldKey; d10Field: FieldKey }) {
  const patternColor = pattern === "convergence" ? GREEN : pattern === "strongD1WeakD10" ? VERMILION : pattern === "weakD1StrongD10" ? BLUE : PURPLE;
  const d1Y = 210 - d1Score;
  const d10Y = 210 - d10Score;
  const sameField = d1Field === d10Field;
  return (
    <svg viewBox="0 0 560 300" role="img" aria-label="D1 and D10 convergence comparison" style={{ width: "100%", maxHeight: 380, margin: "0.55rem auto 0.8rem", display: "block" }}>
      <rect x="24" y="34" width="512" height="214" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      <line x1="110" y1="220" x2="450" y2="220" stroke={`${GOLD}77`} strokeWidth="2" />
      <line x1="110" y1="72" x2="450" y2="72" stroke={`${GREEN}33`} strokeWidth="2" strokeDasharray="8 8" />
      <line x1="110" y1="145" x2="450" y2="145" stroke={`${GOLD}44`} strokeWidth="2" strokeDasharray="8 8" />
      <path d={`M 160 ${d1Y} C 245 ${d1Y}, 275 ${d10Y}, 360 ${d10Y}`} fill="none" stroke={patternColor} strokeWidth="5" strokeLinecap="round" />
      <circle cx="160" cy={d1Y} r="36" fill={BLUE} stroke="#fff" strokeWidth="3" />
      <text x="160" y={d1Y - 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">D1</text>
      <text x="160" y={d1Y + 15} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">promise</text>
      <circle cx="360" cy={d10Y} r="36" fill={GREEN} stroke="#fff" strokeWidth="3" />
      <text x="360" y={d10Y - 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">D10</text>
      <text x="360" y={d10Y + 15} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">delivery</text>
      <circle cx="260" cy="146" r={vargottama ? 44 : 30} fill={vargottama ? `${GOLD}22` : "#FFF9EA"} stroke={vargottama ? GOLD : HAIRLINE} strokeWidth={vargottama ? 4 : 2} strokeDasharray={vargottama ? "7 7" : undefined} />
      <text x="260" y="141" textAnchor="middle" fill={vargottama ? GOLD : INK_MUTED} fontSize="13" fontWeight="700">VARGA</text>
      <text x="260" y="159" textAnchor="middle" fill={vargottama ? GOLD : INK_MUTED} fontSize="13" fontWeight="700">{vargottama ? "YES" : "OFF"}</text>
      {!sameField ? <path d="M 160 254 C 226 284, 315 284, 360 254" fill="none" stroke={PURPLE} strokeWidth="4" strokeDasharray="8 7" /> : null}
      <text x="160" y="276" textAnchor="middle" fill={FIELDS[d1Field].color} fontSize="13" fontWeight="700">{FIELDS[d1Field].label}</text>
      <text x="360" y="276" textAnchor="middle" fill={FIELDS[d10Field].color} fontSize="13" fontWeight="700">{FIELDS[d10Field].label}</text>
      <text x="280" y="26" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="700">D1 foundation plus D10 outcome-weight</text>
    </svg>
  );
}

function PatternRow({ active, color, title, body }: { active: boolean; color: string; title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : "transparent", padding: "0.65rem" }}>
      <strong style={{ color, fontWeight: 700 }}>{title}</strong>
      <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.4 }}>{body}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "grid", gap: "0.45rem", marginBottom: "0.7rem" }}>
      <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>{children}</div>
    </div>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function PresetButton({ active, color, onClick, children }: { active: boolean; color: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={smallChipStyle(active, color)}>
      {children}
    </button>
  );
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ height: 12, borderRadius: 8, background: `${GOLD}22`, border: `1px solid ${HAIRLINE}`, overflow: "hidden", margin: "0.35rem 0 0.65rem" }}>
      <div style={{ width: `${score}%`, height: "100%", background: color, transition: "width 220ms ease" }} />
    </div>
  );
}

function patternTitle(pattern: string) {
  if (pattern === "strongD1WeakD10") return "Promise with caveat";
  if (pattern === "weakD1StrongD10") return "Rises above origins";
  if (pattern === "fieldDivergence") return "Field divergence";
  return "Two-yes convergence";
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
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
