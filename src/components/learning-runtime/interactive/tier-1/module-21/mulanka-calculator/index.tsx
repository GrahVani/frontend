"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ListChecks,
  RotateCcw,
  ShieldAlert,
  Table,
} from "lucide-react";
import {
  computeMulanka,
  getResultForConvention,
  getRegister,
  DAY_REFERENCE_TABLE,
  WORKED_EXAMPLES,
  WORKFLOW_STEPS,
  type Convention,
} from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6B4C8C";

export function MulankaCalculator() {
  const [activeTab, setActiveTab] = useState<TabKey>("calculator");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("calculator");
  };

  return (
    <div data-interactive="mulanka-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 21.3.1 — Mūlāṅka Computation</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Birth-Day Root-Number Calculator
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Compute Mūlāṅka from the birth-day-of-month alone. See both strict-preservation and flexibility results, the graha-aṅka register, and discipline-compliant caveats.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            aria-pressed={activeTab === tab.key}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              border: `1px solid ${activeTab === tab.key ? BLUE : HAIRLINE}`,
              borderRadius: 8,
              background: activeTab === tab.key ? BLUE : "transparent",
              color: activeTab === tab.key ? "#fff" : INK_SECONDARY,
              padding: "0.52rem 0.85rem",
              fontWeight: 850,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div key={resetKey}>
        {activeTab === "calculator" && <CalculatorTab />}
        {activeTab === "table" && <TableTab />}
        {activeTab === "workflow" && <WorkflowTab />}
        {activeTab === "examples" && <ExamplesTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Calculator Tab ───────────────────────── */

function CalculatorTab() {
  const [dayInput, setDayInput] = useState<string>("25");
  const [convention, setConvention] = useState<Convention>("flexible");

  const dayNum = parseInt(dayInput, 10);
  const isValid = !Number.isNaN(dayNum) && dayNum >= 1 && dayNum <= 31;
  const result = isValid ? computeMulanka(dayNum) : null;
  const finalResult = result ? getResultForConvention(result, convention) : null;
  const register = finalResult !== null ? getRegister(finalResult) : null;

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      {/* Input panel */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "end" }}>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <label htmlFor="birth-day" style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Birth day of month
            </label>
            <input
              id="birth-day"
              type="number"
              min={1}
              max={31}
              value={dayInput}
              onChange={(e) => setDayInput(e.target.value)}
              style={{
                width: 120,
                padding: "0.55rem 0.7rem",
                borderRadius: 8,
                border: `1px solid ${isValid ? HAIRLINE : VERMILION}`,
                background: SURFACE,
                color: INK_PRIMARY,
                fontSize: "1rem",
                fontWeight: 850,
              }}
            />
          </div>

          <div style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Convention</span>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button
                type="button"
                onClick={() => setConvention("strict")}
                style={{
                  ...buttonStyle(convention === "strict", PURPLE),
                  fontSize: "0.82rem",
                }}
              >
                Strict (preserve)
              </button>
              <button
                type="button"
                onClick={() => setConvention("flexible")}
                style={{
                  ...buttonStyle(convention === "flexible", BLUE),
                  fontSize: "0.82rem",
                }}
              >
                Flexible (reduce)
              </button>
            </div>
          </div>
        </div>

        {!isValid && (
          <div style={{ color: VERMILION, fontSize: "0.85rem", fontWeight: 850 }}>
            Enter a day between 1 and 31.
          </div>
        )}
      </div>

      {result && finalResult !== null && register && (
        <>
          {/* Computation steps */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Calculator size={18} color={BLUE} />
              <span style={{ fontWeight: 950, color: BLUE, fontSize: "1rem" }}>Computation steps</span>
            </div>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              {result.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: `${BLUE}18`, color: BLUE, fontWeight: 950, fontSize: "0.72rem", flexShrink: 0, marginTop: 1 }}>
                    {i + 1}
                  </span>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.87rem" }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Result cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
            <div style={{ border: `1px solid ${convention === "strict" ? PURPLE : HAIRLINE}`, borderRadius: 8, background: convention === "strict" ? `${PURPLE}0A` : SURFACE, padding: "1rem", display: "grid", gap: "0.3rem" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: convention === "strict" ? PURPLE : INK_MUTED, fontWeight: 900 }}>Selected result</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 950, color: convention === "strict" ? PURPLE : BLUE, lineHeight: 1 }}>{finalResult}</div>
              <div style={{ fontSize: "0.85rem", color: INK_SECONDARY, fontWeight: 850 }}>
                {convention === "strict" ? "Strict preservation" : "Flexibility (reduce)"}
              </div>
            </div>

            <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "1rem", display: "grid", gap: "0.3rem" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: GOLD, fontWeight: 900 }}>Graha-aṅka register</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 950, color: GOLD, lineHeight: 1.2 }}>
                {"graha" in register ? register.graha : register.baseGraha}
              </div>
              <div style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>
                {"graha" in register ? `Digit ${register.digit}` : `Master ${register.master} intensifies ${register.baseGraha}`}
              </div>
            </div>
          </div>

          {/* Caveats */}
          {"caveat" in register && register.caveat && (
            <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, background: `${VERMILION}0A`, padding: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <ShieldAlert size={18} color={VERMILION} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
                <strong style={{ color: VERMILION }}>Caveat:</strong> {register.caveat}
              </p>
            </div>
          )}

          {/* Cross-system identity note */}
          <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, background: `${GREEN}0A`, padding: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
              <strong style={{ color: GREEN }}>Cross-system identity:</strong> Mūlāṅka {finalResult} is identical in Chaldean, Pythagorean, and Vedic systems because it is birth-day-derived, not name-derived. System-selection is irrelevant for Mūlāṅka.
            </p>
          </div>
        </>
      )}
    </section>
  );
}

/* ───────────────────────── Table Tab ───────────────────────── */

function TableTab() {
  return (
    <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
        <Table size={18} color={BLUE} />
        <span style={{ fontWeight: 950, color: BLUE, fontSize: "1rem" }}>Mūlāṅka reference table (all 31 days)</span>
      </div>
      <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
        Days 11, 22, and 29 have strict-preservation master-number alternatives. All other days are identical under both conventions.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Day</th>
              <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Flexible</th>
              <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Graha</th>
              <th style={{ textAlign: "left", padding: "0.5rem 0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.72rem" }}>Strict alternate</th>
            </tr>
          </thead>
          <tbody>
            {DAY_REFERENCE_TABLE.map((row) => (
              <tr key={row.day} style={{ borderBottom: `1px solid ${HAIRLINE}44` }}>
                <td style={{ padding: "0.45rem 0.6rem", color: INK_PRIMARY, fontWeight: 850 }}>{row.day}</td>
                <td style={{ padding: "0.45rem 0.6rem", color: INK_SECONDARY }}>{row.flexible}</td>
                <td style={{ padding: "0.45rem 0.6rem", color: INK_SECONDARY }}>{row.graha}</td>
                <td style={{ padding: "0.45rem 0.6rem", color: row.strictAlternate !== "—" ? PURPLE : INK_MUTED, fontWeight: row.strictAlternate !== "—" ? 850 : 400 }}>
                  {row.strictAlternate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ───────────────────────── Workflow Tab ───────────────────────── */

function WorkflowTab() {
  return (
    <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <ListChecks size={18} color={BLUE} />
        <span style={{ fontWeight: 950, color: BLUE, fontSize: "1rem" }}>Discipline-compliant Mūlāṅka reading workflow</span>
      </div>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {WORKFLOW_STEPS.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.75rem", background: SURFACE }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: BLUE, color: "#fff", fontWeight: 950, fontSize: "0.8rem", flexShrink: 0 }}>
              {i + 1}
            </span>
            <div>
              <div style={{ fontWeight: 950, color: INK_PRIMARY, fontSize: "0.95rem", marginBottom: "0.15rem" }}>{step.title}</div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Examples Tab ───────────────────────── */

function ExamplesTab() {
  return (
    <section style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <BookOpen size={18} color={BLUE} />
          <span style={{ fontWeight: 950, color: BLUE, fontSize: "1rem" }}>Worked examples</span>
        </div>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Four clients covering each edge-case category and convention-choice impact.
        </p>
      </div>

      {WORKED_EXAMPLES.map((ex) => (
        <article key={ex.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.55rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ fontWeight: 950, color: INK_PRIMARY, fontSize: "1rem" }}>
              {ex.client} — born on the {ex.day}
              {ex.day === 1 ? "st" : ex.day === 2 ? "nd" : ex.day === 3 ? "rd" : "th"}
            </div>
            <span style={{ fontSize: "0.78rem", padding: "2px 10px", borderRadius: 999, background: `${BLUE}18`, color: BLUE, fontWeight: 850 }}>
              {ex.computation}
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ border: `1px solid ${PURPLE}33`, borderRadius: 8, background: `${PURPLE}0A`, padding: "0.5rem 0.7rem" }}>
              <div style={{ fontSize: "0.68rem", color: PURPLE, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Strict</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 950, color: PURPLE }}>{ex.strictResult}</div>
            </div>
            <div style={{ border: `1px solid ${BLUE}33`, borderRadius: 8, background: `${BLUE}0A`, padding: "0.5rem 0.7rem" }}>
              <div style={{ fontSize: "0.68rem", color: BLUE, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Flexible</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 950, color: BLUE }}>{ex.flexibleResult}</div>
            </div>
            <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "0.5rem 0.7rem", flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: "0.68rem", color: GOLD, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Register</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 950, color: GOLD }}>{ex.register}</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.3rem" }}>
            {ex.caveats.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start" }}>
                <ChevronRight size={14} color={VERMILION} style={{ flexShrink: 0, marginTop: 3 }} />
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.84rem" }}>{c}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

/* ───────────────────────── Tabs ───────────────────────── */

type TabKey = "calculator" | "table" | "workflow" | "examples";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "calculator", label: "Calculator", icon: <Calculator size={16} /> },
  { key: "table", label: "31-Day Table", icon: <Table size={16} /> },
  { key: "workflow", label: "Workflow", icon: <ListChecks size={16} /> },
  { key: "examples", label: "Examples", icon: <BookOpen size={16} /> },
];

/* ───────────────────────── Helpers ───────────────────────── */

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
