"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRightLeft,
  CheckCircle2,
  Copy,
  RefreshCw,
  Scale,
  ShieldAlert,
  Target,
  XCircle
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "comparison" | "rule" | "scope" | "cases";
type CaseView = "kavya-converge" | "kavya-diverge" | "meera";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const COMPARISON_ROWS = [
  { aspect: "Chart frame", tajika: "Lagna-based solar-return chart", lalKitab: "Fixed-Aries Teva" },
  { aspect: "Defining engine", tajika: "Muntha + Varṣeśa", lalKitab: "Planetary states (blind / sleeping / burning)" },
  { aspect: "Sensitive points", tajika: "Sahams", lalKitab: "None of this kind" },
  { aspect: "Aspect model", tajika: "Ithasāla / Eesarphā within deeptāṁśa orbs", lalKitab: "Attribute interactions" },
  { aspect: "Orientation", tajika: "Analysis-forward (material detail)", lalKitab: "Remedy-forward (upāya)" }
];

const MISSING_MACHINERY = [
  { step: "Recast natal points onto fixed-Aries Teva", inScope: false },
  { step: "Classify each planet's state (blind / sleeping / burning)", inScope: false },
  { step: "Read through Lal Kitab attribute redefinitions", inScope: false },
  { step: "Name the year's upāya", inScope: false }
];

const CASES: Record<CaseView, { title: string; scenario: string; result: string; reasoning: string; color: string }> = {
  "kavya-converge": {
    title: "Kavya — hypothetical convergence",
    scenario: "A colleague's Lal Kitab reading also flags domestic/wealth themes for the year.",
    result: "Highest-confidence case",
    reasoning: "Two independently-built systems, sharing no machinery, agree. Report as strong corroboration of this module's Tājika Venus finding, not as two unrelated opinions.",
    color: GREEN
  },
  "kavya-diverge": {
    title: "Kavya — hypothetical divergence",
    scenario: "A colleague's Lal Kitab reading flags travel, with no reference to domestic/wealth themes.",
    result: "Resolve by tool-selection",
    reasoning: "Do not average. For the material question, trust this module's Tājika analysis. For the remedial question, the Lal Kitab upāya would be the trustworthy layer — if genuinely computed.",
    color: BLUE
  },
  "meera": {
    title: "Meera — hypothetical convergence with an open year-lord",
    scenario: "Meera's Tājika Varṣeśa tie-break is still open; a Lal Kitab reading flags a theme that matches one candidate's likely significations.",
    result: "Independent corroboration, not a tie-breaker",
    reasoning: "Lal Kitab machinery does not depend on Meera's Varṣeśa tie-break, but it also cannot adjudicate it. Convergence corroborates a theme, not a specific candidate's technical qualification.",
    color: PURPLE
  }
};

export function LalKitabCrossStreamAcknowledgmentWorkbench() {
  const [tab, setTab] = useState<TabKey>("comparison");
  const [caseView, setCaseView] = useState<CaseView>("kavya-converge");
  const [copied, setCopied] = useState(false);

  const summaryText = "Lal Kitab varṣphala and Tājika varṣaphala share the same goal — read the coming year — but use entirely different machinery. This module is scoped to Tājika; it acknowledges Lal Kitab honestly without constructing a Teva it was never built to teach.";

  function reset() {
    setTab("comparison");
    setCaseView("kavya-converge");
    setCopied(false);
  }

  function copySummary() {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div data-interactive="lal-kitab-cross-stream-acknowledgment-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lal Kitab cross-stream acknowledgment</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Same goal, entirely different machinery
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compare the two annual-chart systems, practise the convergence/divergence decision rule, and see precisely what a genuine Lal Kitab varṣphala would require — and why this module deliberately stops short.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {[
          { key: "comparison", label: "System comparison", icon: ArrowRightLeft },
          { key: "rule", label: "Decision rule", icon: Scale },
          { key: "scope", label: "Scope boundary", icon: ShieldAlert },
          { key: "cases", label: "Case practice", icon: Target }
        ].map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as TabKey)}
              style={{ ...smallChipStyle(active, active ? GOLD : INK_MUTED), height: "44px", padding: "0 1rem", fontSize: "13px", display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {tab === "comparison" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Tājika vs Lal Kitab varṣphala</p>
                <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.18rem" }}>Same goal, different machinery</h3>
              </div>
              <button type="button" onClick={copySummary} style={buttonStyle(false, GOLD)}>
                {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </section>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", border: `1px solid ${HAIRLINE}`, borderRadius: "8px", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: `${GOLD}12` }}>
                  <th style={{ ...tableCellStyle, color: GOLD, textAlign: "left" }}>Aspect</th>
                  <th style={{ ...tableCellStyle, color: BLUE, textAlign: "left" }}>Tājika varṣaphala (this module)</th>
                  <th style={{ ...tableCellStyle, color: PURPLE, textAlign: "left" }}>Lal Kitab varṣphala</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={row.aspect} style={{ background: idx % 2 === 0 ? "transparent" : `${GOLD}05` }}>
                    <td style={{ ...tableCellStyle, color: INK_PRIMARY, fontWeight: 600 }}>{row.aspect}</td>
                    <td style={tableCellStyle}>{row.tajika}</td>
                    <td style={tableCellStyle}>{row.lalKitab}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${VERMILION}` }}>
            <p style={eyebrowStyle}>Core caution</p>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              The cognate names varṣaphala and varṣphala do not mean the two systems are the same technique. Same goal, completely different machinery — never conflate the toolkits.
            </p>
          </section>
        </>
      )}

      {tab === "rule" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>T1-18 convergence/divergence rule</p>
            <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
              If both systems are genuinely run on the same native, use this rule. This lesson does not itself run a Lal Kitab chart; it teaches the methodological principle.
            </p>
          </section>

          <div style={workbenchTwoColumnStyle}>
            <section style={{ ...cardStyle, borderTop: `4px solid ${GREEN}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <CheckCircle2 size={18} color={GREEN} />
                <h3 style={{ margin: 0, color: GREEN, fontSize: "1.15rem" }}>Convergence</h3>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
                Both systems point the same way. This is the highest-confidence case precisely because their machinery shares nothing.
              </p>
              <div style={{ marginTop: "0.75rem", padding: "0.55rem 0.75rem", borderRadius: "8px", background: `${GREEN}08`, border: `1px solid ${GREEN}40` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                  Report as strong corroboration, not as two separate opinions.
                </p>
              </div>
            </section>

            <section style={{ ...cardStyle, borderTop: `4px solid ${BLUE}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <ArrowRightLeft size={18} color={BLUE} />
                <h3 style={{ margin: 0, color: BLUE, fontSize: "1.15rem" }}>Divergence</h3>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
                Do not average. Choose the tool suited to the question.
              </p>
              <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.45rem" }}>
                <div style={{ padding: "0.55rem 0.75rem", borderRadius: "8px", background: `${BLUE}08`, border: `1px solid ${BLUE}40` }}>
                  <span style={{ color: BLUE, fontWeight: 700, fontSize: "0.85rem" }}>Material question</span>
                  <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>Trust Tājika.</p>
                </div>
                <div style={{ padding: "0.55rem 0.75rem", borderRadius: "8px", background: `${PURPLE}08`, border: `1px solid ${PURPLE}40` }}>
                  <span style={{ color: PURPLE, fontWeight: 700, fontSize: "0.85rem" }}>Remedial question</span>
                  <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>Trust Lal Kitab upāya, if genuinely computed.</p>
                </div>
              </div>
            </section>
          </div>

          <section style={{ ...cardStyle, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={eyebrowStyle}>Decision flow</p>
            <svg viewBox="0 0 520 220" role="img" aria-label="If both systems agree, report convergence. If they diverge, use Tājika for material questions and Lal Kitab for upāya." style={{ width: "100%", maxHeight: 260, marginTop: "0.5rem" }}>
              <rect x="20" y="20" width="480" height="180" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />

              <rect x="170" y="36" width="180" height="44" rx="8" fill={SURFACE} stroke={GOLD} strokeWidth="2" />
              <text x="260" y="64" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>Both systems run?</text>

              <path d="M 260 80 L 260 110" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
              <path d="M 260 110 L 130 110" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
              <path d="M 260 110 L 390 110" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
              <path d="M 130 110 L 130 140" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
              <path d="M 390 110 L 390 140" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />

              <rect x="50" y="140" width="160" height="48" rx="8" fill={`${GREEN}15`} stroke={GREEN} strokeWidth="2" />
              <text x="130" y="162" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={700}>Agree</text>
              <text x="130" y="178" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>Report convergence</text>

              <rect x="310" y="140" width="160" height="48" rx="8" fill={`${BLUE}15`} stroke={BLUE} strokeWidth="2" />
              <text x="390" y="162" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight={700}>Diverge</text>
              <text x="390" y="178" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>Tool-selection</text>
            </svg>
          </section>
        </>
      )}

      {tab === "scope" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <ShieldAlert size={18} color={VERMILION} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>What this lesson deliberately does not do</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Constructing a genuine Lal Kitab varṣphala for Kavya or Meera would require four steps this module was never scoped to teach. The checklist below marks each as outside this module&apos;s scope.
            </p>
          </section>

          <div style={{ display: "grid", gap: "0.65rem" }}>
            {MISSING_MACHINERY.map((item, idx) => (
              <section key={item.step} style={{ ...cardStyle, borderLeft: `4px solid ${VERMILION}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${VERMILION}15`, color: VERMILION, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                      {idx + 1}
                    </span>
                    <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{item.step}</span>
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: VERMILION, fontWeight: 700, fontSize: "0.85rem" }}>
                    <XCircle size={16} />
                    Not in this module
                  </span>
                </div>
              </section>
            ))}
          </div>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${GOLD}` }}>
            <p style={eyebrowStyle}>Why stopping short is honest</p>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              This module is a Tājika module. Lal Kitab&apos;s own annual system is taught in full in T1-18 Chapter 5. Building even one Teva here would require an apparatus this lesson&apos;s 12-minute, Understand-level scope cannot responsibly carry.
            </p>
          </section>
        </>
      )}

      {tab === "cases" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Practise the decision rule</p>
            <p style={{ margin: "0 0 0.65rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
              These are hypothetical cases — no real Lal Kitab Teva was cast. They let you apply the convergence/divergence rule methodologically.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {([
                { key: "kavya-converge", label: "Kavya converges" },
                { key: "kavya-diverge", label: "Kavya diverges" },
                { key: "meera", label: "Meera open year-lord" }
              ] as { key: CaseView; label: string }[]).map(({ key, label }) => (
                <button key={key} type="button" aria-pressed={caseView === key} onClick={() => setCaseView(key)} style={smallChipStyle(caseView === key, CASES[key].color)}>
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section style={{ ...cardStyle, borderLeft: `4px solid ${CASES[caseView].color}` }}>
            <h3 style={{ margin: "0 0 0.5rem", color: CASES[caseView].color, fontSize: "1.18rem" }}>{CASES[caseView].title}</h3>
            <p style={{ margin: "0 0 0.65rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
              <span style={{ color: INK_MUTED, fontWeight: 700 }}>Scenario:</span> {CASES[caseView].scenario}
            </p>
            <div style={{ padding: "0.65rem 0.85rem", borderRadius: "8px", background: `${CASES[caseView].color}10`, border: `1px solid ${CASES[caseView].color}40`, marginBottom: "0.65rem" }}>
              <span style={{ color: CASES[caseView].color, fontWeight: 700, fontSize: "0.9rem" }}>{CASES[caseView].result}</span>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>{CASES[caseView].reasoning}</p>
          </section>
        </>
      )}
    </div>
  );
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
    cursor: "pointer"
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
    cursor: "pointer"
  };
}

const tableCellStyle: CSSProperties = {
  padding: "0.75rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_SECONDARY,
  fontSize: "0.9rem",
  lineHeight: 1.5
};

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem"
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase"
};
