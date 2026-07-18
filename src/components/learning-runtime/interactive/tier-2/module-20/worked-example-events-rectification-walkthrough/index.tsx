"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  CheckCircle2,
  ChevronRight,
  ListChecks,
  MessageSquareQuote,
  Mic,
  RefreshCcw,
  Route,
  Scale,
  Search,
  ShieldCheck,
  Table2,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "process" | "table" | "statement";
type StepKey = 0 | 1 | 2 | 3 | 4;
type StatementPartKey = "excluded" | "narrowed" | "remain" | "next";

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

const TABS: Record<TabKey, { label: string; icon: typeof Route }> = {
  process: { label: "End-to-end process", icon: Route },
  table: { label: "Match table + audit", icon: Table2 },
  statement: { label: "Client statement", icon: MessageSquareQuote },
};

const STEPS: Record<StepKey, { title: string; detail: string; icon: typeof Mic; color: string }> = {
  0: { title: "Interview", detail: "Open questions first, then narrow to timing. Two usable, independent events: marriage and career change.", icon: Mic, color: BLUE },
  1: { title: "Matching", detail: "Run the four-part test on all three candidates against both events. Candidate C fails; A and B fit strongly.", icon: Search, color: PURPLE },
  2: { title: "Pitfall diagnosis", detail: "A and B share Virgo Lagna — Type 1 structural indistinguishability. More house-lordship events will not help.", icon: Scale, color: GOLD },
  3: { title: "Interim verdict", detail: "Candidate C is excluded with confidence. Candidates A and B remain tied. Window narrowed from 30 minutes to 12 minutes.", icon: ShieldCheck, color: GREEN },
  4: { title: "Client statement", detail: "Lead with the confident exclusion, then the open question, in proportion to actual evidentiary strength.", icon: MessageSquareQuote, color: BLUE },
};

const MATCH_TABLE = [
  { candidate: "A", time: "05:48", lagna: "Virgo", marriage: "strong", career: "strong" },
  { candidate: "B", time: "06:00", lagna: "Virgo", marriage: "strong", career: "strong" },
  { candidate: "C", time: "06:12", lagna: "Libra", marriage: "weak", career: "none" },
];

const AUDIT_ITEMS = [
  { event: "Marriage", candidate: "A", check: "7th lord Jupiter = Jupiter antardaśā lord" },
  { event: "Marriage", candidate: "B", check: "7th lord Jupiter = Jupiter antardaśā lord" },
  { event: "Marriage", candidate: "C", check: "7th lord Mars = Mars mahādaśā lord only" },
  { event: "Career", candidate: "A", check: "10th lord Mercury = Mercury antardaśā lord" },
  { event: "Career", candidate: "B", check: "10th lord Mercury = Mercury antardaśā lord" },
  { event: "Career", candidate: "C", check: "10th lord Moon; Mercury antardaśā rules 9th" },
];

const STATEMENT_PARTS: Record<StatementPartKey, { label: string; text: string; order: number; color: string }> = {
  excluded: {
    label: "Confident exclusion",
    text: "We can say with real confidence that you were not born as late as 6:12am; the astrological story at that time doesn't match either event you described.",
    order: 1,
    color: GREEN,
  },
  narrowed: {
    label: "Progress made",
    text: "What we have so far already rules out a third of your original window with confidence, and narrows the rest to two closely-spaced candidates rather than an open range.",
    order: 3,
    color: BLUE,
  },
  remain: {
    label: "Open question",
    text: "Between the two remaining possibilities — roughly 5:48am and 6:00am — both currently fit equally well using this method alone.",
    order: 2,
    color: GOLD,
  },
  next: {
    label: "Next step",
    text: "To narrow further between these two specific times, we'll need to bring in one more kind of check, which we'll walk through next.",
    order: 4,
    color: PURPLE,
  },
};

function ProcessFlowSvg({ step }: { step: StepKey }) {
  const items = Object.values(STEPS);
  return (
    <svg viewBox="0 0 620 140" role="img" aria-label="End-to-end events-based rectification process" style={{ width: "100%", maxHeight: 160, display: "block" }}>
      <rect x={10} y={10} width={600} height={120} rx={8} fill={`${STEPS[step].color}08`} stroke={HAIRLINE} />
      {items.map((s, i) => {
        const x = 70 + i * 110;
        const active = i <= step;
        return (
          <g key={s.title}>
            <circle cx={x} cy={60} r={24} fill={active ? s.color : `${INK_MUTED}33`} stroke={active ? s.color : HAIRLINE} strokeWidth={3} />
            <text x={x} y={65} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600}>{i + 1}</text>
            <text x={x} y={100} textAnchor="middle" fill={active ? INK_PRIMARY : INK_MUTED} fontSize={9} fontWeight={600}>{s.title}</text>
            {i < 4 && (
              <line x1={x + 28} y1={60} x2={x + 82} y2={60} stroke={active ? s.color : HAIRLINE} strokeWidth={active ? 3 : 2} strokeDasharray={active ? undefined : "6 4"} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function NarrowingSvg() {
  return (
    <svg viewBox="0 0 460 160" role="img" aria-label="Birth time window narrowing" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={440} height={140} rx={8} fill={`${GREEN}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Window narrowing</text>

      {/* Before */}
      <rect x={40} y={60} width={120} height={32} rx={6} fill={`${INK_MUTED}33`} stroke={HAIRLINE} />
      <text x={100} y={81} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>30 minutes</text>
      <text x={100} y={112} textAnchor="middle" fill={INK_MUTED} fontSize={10}>3 candidates</text>

      <path d="M 170 76 L 210 76" stroke={HAIRLINE} strokeWidth={3} markerEnd="url(#arrow-narrow)" />
      <defs>
        <marker id="arrow-narrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M 0 0 L 8 4 L 0 8 z" fill={GREEN} />
        </marker>
      </defs>

      {/* After */}
      <rect x={230} y={64} width={80} height={24} rx={6} fill={GREEN} />
      <text x={270} y={80} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>12 minutes</text>
      <text x={270} y={112} textAnchor="middle" fill={INK_MUTED} fontSize={10}>2 candidates</text>

      <text x={350} y={80} textAnchor="middle" fill={VERMILION} fontSize={11} fontWeight={600}>C excluded</text>
      <text x={350} y={112} textAnchor="middle" fill={INK_MUTED} fontSize={10}>with confidence</text>
    </svg>
  );
}

function StatementOrderSvg({ order }: { order: StatementPartKey[] }) {
  return (
    <svg viewBox="0 0 460 120" role="img" aria-label="Client statement ordering" style={{ width: "100%", maxHeight: 140, display: "block" }}>
      <rect x={10} y={10} width={440} height={100} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      {order.map((key, i) => {
        const x = 60 + i * 100;
        return (
          <g key={key}>
            <circle cx={x} cy={50} r={24} fill={STATEMENT_PARTS[key].color} />
            <text x={x} y={55} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>{i + 1}</text>
            <text x={x} y={90} textAnchor="middle" fill={INK_SECONDARY} fontSize={9} fontWeight={600}>{STATEMENT_PARTS[key].label}</text>
            {i < 3 && (
              <line x1={x + 28} y1={50} x2={x + 72} y2={50} stroke={HAIRLINE} strokeWidth={2} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function WorkedExampleEventsRectificationWalkthrough() {
  const [activeTab, setActiveTab] = useState<TabKey>("process");
  const [step, setStep] = useState<StepKey>(0);
  const [auditChecks, setAuditChecks] = useState<Record<number, boolean>>({});
  const [statementOrder, setStatementOrder] = useState<StatementPartKey[]>(["excluded", "remain", "narrowed", "next"]);
  const [showGoodOrder, setShowGoodOrder] = useState<boolean>(true);

  const reset = () => {
    setActiveTab("process");
    setStep(0);
    setAuditChecks({});
    setStatementOrder(["excluded", "remain", "narrowed", "next"]);
    setShowGoodOrder(true);
  };

  const toggleAudit = (index: number) => {
    setAuditChecks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const auditComplete = AUDIT_ITEMS.every((_, i) => auditChecks[i]);

  const orderedCorrectly = useMemo(() => {
    return statementOrder.every((key, i) => STATEMENT_PARTS[key].order === i + 1);
  }, [statementOrder]);

  const movePart = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index > 0) {
      const newOrder = [...statementOrder];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      setStatementOrder(newOrder);
    } else if (direction === "right" && index < 3) {
      const newOrder = [...statementOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setStatementOrder(newOrder);
    }
  };

  return (
    <div data-interactive="worked-example-events-rectification-walkthrough" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked example · Chapter 2</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Events-based rectification walkthrough
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Assemble the full chapter on Vikram&apos;s case: interview, matching, pitfall diagnosis, interim verdict, and the honest client-facing statement.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(Object.keys(TABS) as TabKey[]).map((key) => {
          const TabIcon = TABS[key].icon;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={activeTab === key}
              onClick={() => setActiveTab(key)}
              style={tabChipStyle(activeTab === key, key === activeTab ? GOLD : INK_MUTED)}
            >
              <TabIcon size={15} aria-hidden="true" />
              {TABS[key].label}
            </button>
          );
        })}
      </div>

      {activeTab === "process" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Process</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Step {step + 1} of 5: {STEPS[step].title}</h3>
              </div>
              <button type="button" onClick={() => setStep((s) => ((s + 1) % 5) as StepKey)} style={buttonStyle(false, BLUE)}>
                <ChevronRight size={15} aria-hidden="true" /> Next step
              </button>
            </div>
            <ProcessFlowSvg step={step} />
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${STEPS[step].color}55`, background: `${STEPS[step].color}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{STEPS[step].detail}</p>
            </div>
          </section>

          <div style={workbenchTwoColumnStyle}>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Window</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>Real progress, honestly framed</h3>
              <NarrowingSvg />
            </section>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Routing</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>Where the case goes next</h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                The A/B tie is Type 1 structural. The case is handed to Chapter 3 (Tattva-śuddhi) and later to D60 or vāra methods — not to more interviewing.
              </p>
            </section>
          </div>
        </>
      )}

      {activeTab === "table" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Match table</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Full matching result</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Candidate</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Time</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Lagna</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Marriage (7th)</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Career (10th)</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {MATCH_TABLE.map((row) => {
                    const combined = row.marriage === "strong" && row.career === "strong" ? "survives" : row.career === "none" ? "excluded" : "weak";
                    return (
                      <tr key={row.candidate} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                        <td style={{ padding: "0.6rem", color: INK_PRIMARY, fontWeight: 600 }}>{row.candidate}</td>
                        <td style={{ padding: "0.6rem", color: INK_SECONDARY }}>{row.time}</td>
                        <td style={{ padding: "0.6rem", color: INK_SECONDARY }}>{row.lagna}</td>
                        <td style={{ padding: "0.6rem", color: row.marriage === "strong" ? GREEN : GOLD }}>{row.marriage === "strong" ? "Strong" : "Weak"}</td>
                        <td style={{ padding: "0.6rem", color: row.career === "strong" ? GREEN : VERMILION }}>{row.career === "strong" ? "Strong" : "None"}</td>
                        <td style={{ padding: "0.6rem", color: combined === "survives" ? GREEN : combined === "excluded" ? VERMILION : GOLD, fontWeight: 600 }}>
                          {combined === "survives" ? "Survives" : combined === "excluded" ? "Excluded" : "Weak"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Audit</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Confirm every cell was checked</h3>
              </div>
              <span style={{ color: auditComplete ? GREEN : INK_MUTED, fontWeight: 600, fontSize: "0.9rem" }}>
                {Object.values(auditChecks).filter(Boolean).length} / {AUDIT_ITEMS.length}
              </span>
            </div>
            <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.65rem" }}>
              {AUDIT_ITEMS.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  aria-pressed={auditChecks[i]}
                  onClick={() => toggleAudit(i)}
                  style={auditRowStyle(auditChecks[i])}
                >
                  <span style={{ color: auditChecks[i] ? GREEN : INK_MUTED }}>
                    {auditChecks[i] ? <CheckCircle2 size={16} aria-hidden="true" /> : <ListChecks size={16} aria-hidden="true" />}
                  </span>
                  <span style={{ color: INK_SECONDARY, fontSize: "0.9rem" }}>
                    <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{item.event} · Candidate {item.candidate}:</strong>{" "}
                    {item.check}
                  </span>
                </button>
              ))}
            </div>
            {auditComplete && (
              <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Audit complete.</span> All six activation checks are accounted for; nothing in the synthesis was skipped.
                </p>
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === "statement" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Statement builder</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Order the client-facing statement</h3>
              </div>
              <button type="button" onClick={() => setShowGoodOrder((v) => !v)} style={buttonStyle(false, BLUE)}>
                {showGoodOrder ? "Show correct order" : "Let me reorder"}
              </button>
            </div>
            <StatementOrderSvg order={showGoodOrder ? ["excluded", "remain", "narrowed", "next"] : statementOrder} />
            {!showGoodOrder && (
              <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
                {statementOrder.map((key, i) => (
                  <div key={key} style={{ display: "flex", gap: "0.5rem", alignItems: "center", padding: "0.65rem", borderRadius: 8, border: `1px solid ${STATEMENT_PARTS[key].color}55`, background: `${STATEMENT_PARTS[key].color}10` }}>
                    <span style={{ color: STATEMENT_PARTS[key].color, fontWeight: 700, minWidth: 24 }}>{i + 1}</span>
                    <span style={{ flex: 1, color: INK_SECONDARY, fontSize: "0.9rem" }}>
                      <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{STATEMENT_PARTS[key].label}:</strong>{" "}
                      {STATEMENT_PARTS[key].text}
                    </span>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button type="button" onClick={() => movePart(i, "left")} disabled={i === 0} style={smallButtonStyle(i === 0)}>←</button>
                      <button type="button" onClick={() => movePart(i, "right")} disabled={i === 3} style={smallButtonStyle(i === 3)}>→</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!showGoodOrder && (
              <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${orderedCorrectly ? GREEN : GOLD}55`, background: `${orderedCorrectly ? GREEN : GOLD}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  {orderedCorrectly
                    ? "Correct order: confident exclusion first, then the open question, then the progress summary, then the next step."
                    : "Current order does not follow the recommended proportion. Try leading with the confident exclusion before the open question."}
                </p>
              </div>
            )}
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Full statement</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>What the client actually hears</h3>
            <blockquote style={{ margin: 0, padding: "0.85rem", borderRadius: 8, borderLeft: `4px solid ${GREEN}`, background: `${GREEN}08`, color: INK_SECONDARY, lineHeight: 1.6, fontStyle: "italic" }}>
              {showGoodOrder
                ? "Based on the two life events you've shared with us — your marriage and your career change — we've been able to narrow your birth-time window significantly. We can say with real confidence that you were not born as late as 6:12am; the astrological story at that time doesn't match either event you described. Between the two remaining possibilities — roughly 5:48am and 6:00am — both currently fit equally well using this method alone. To narrow further, between these two specific times, we'll need to bring in one more kind of check, which we'll walk through next. What we have so far already rules out a third of your original window with confidence, and narrows the rest to two closely-spaced candidates rather than an open range."
                : "Re-order the parts above to assemble the recommended client-facing statement."}
            </blockquote>
          </section>

          <div style={workbenchTwoColumnStyle}>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Do</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>Lead with earned confidence</h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                State Candidate C&apos;s exclusion first — it is the strongest, most certain finding. Then state the open A/B question proportionately.
              </p>
            </section>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Don&apos;t</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>Force a single answer</h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                Do not name only 05:48 or 06:00 as the rectified time, and do not bury the real progress by leading with the unresolved tie.
              </p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? color : SURFACE,
    color: active ? "#fff" : INK_PRIMARY,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.92rem",
  };
}

function tabChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 0.85rem",
    borderRadius: 20,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.92rem",
  };
}

function auditRowStyle(checked: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textAlign: "left",
    padding: "0.55rem",
    borderRadius: 6,
    border: `1px solid ${checked ? GREEN : HAIRLINE}`,
    background: checked ? `${GREEN}10` : SURFACE,
    cursor: "pointer",
  };
}

function smallButtonStyle(disabled: boolean): CSSProperties {
  return {
    width: 28,
    height: 28,
    borderRadius: 6,
    border: `1px solid ${disabled ? HAIRLINE : BLUE}`,
    background: disabled ? `${HAIRLINE}55` : SURFACE,
    color: disabled ? INK_MUTED : BLUE,
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600,
    fontSize: "0.85rem",
  };
}
