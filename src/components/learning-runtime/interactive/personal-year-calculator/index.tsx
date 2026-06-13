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
  CalendarDays,
} from "lucide-react";
import {
  computePersonalYear,
  computeNineYearCycle,
  getResultForConvention,
  getRegister,
  getDevelopmentalFraming,
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
const TEAL = "#2E7D7B";

export function PersonalYearCalculator() {
  const [activeTab, setActiveTab] = useState<TabKey>("calculator");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("calculator");
  };

  return (
    <div data-interactive="personal-year-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 21.3.4 — Personal Year Number Computation</p>
            <h2 style={{ margin: "0.2rem 0 0", color: TEAL, fontSize: "1.35rem" }}>
              Personal Year Number Calculator
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Compute the year-specific graha-aṅka register from birth-date + target calendar year. See the 9-year cycle,
              developmental framing, caveats, and the year-as-determinant refusal layer.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

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
              border: `1px solid ${activeTab === tab.key ? TEAL : HAIRLINE}`,
              borderRadius: 8,
              background: activeTab === tab.key ? TEAL : "transparent",
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
        {activeTab === "cycle" && <CycleTab />}
        {activeTab === "examples" && <ExamplesTab />}
        {activeTab === "workflow" && <WorkflowTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Calculator Tab ───────────────────────── */

function CalculatorTab() {
  const [day, setDay] = useState<string>("15");
  const [month, setMonth] = useState<string>("8");
  const [targetYear, setTargetYear] = useState<string>("2026");
  const [convention, setConvention] = useState<Convention>("flexible");

  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(targetYear, 10);

  const isValid =
    !Number.isNaN(dayNum) && dayNum >= 1 && dayNum <= 31 &&
    !Number.isNaN(monthNum) && monthNum >= 1 && monthNum <= 12 &&
    !Number.isNaN(yearNum) && yearNum >= 1000 && yearNum <= 9999;

  const result = isValid ? computePersonalYear(dayNum, monthNum, yearNum) : null;
  const finalResult = result ? getResultForConvention(result, convention) : null;
  const register = finalResult !== null ? getRegister(finalResult) : null;
  const framing = finalResult !== null ? getDevelopmentalFraming(finalResult) : null;

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "end" }}>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Birth day</label>
            <input type="number" min={1} max={31} value={day} onChange={(e) => setDay(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Birth month</label>
            <input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Target year</label>
            <input type="number" min={1000} max={9999} value={targetYear} onChange={(e) => setTargetYear(e.target.value)} style={{ ...inputStyle, width: 100 }} />
          </div>

          <div style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Convention</span>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button type="button" onClick={() => setConvention("strict")} style={{ ...buttonStyle(convention === "strict", PURPLE), fontSize: "0.82rem" }}>
                Strict (preserve)
              </button>
              <button type="button" onClick={() => setConvention("flexible")} style={{ ...buttonStyle(convention === "flexible", BLUE), fontSize: "0.82rem" }}>
                Flexible (reduce)
              </button>
            </div>
          </div>
        </div>

        {!isValid && (
          <div style={{ color: VERMILION, fontSize: "0.85rem", fontWeight: 850 }}>
            Enter a valid birth day (1-31), month (1-12), and target year (1000-9999).
          </div>
        )}
      </div>

      {result && finalResult !== null && register && (
        <>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Calculator size={18} color={TEAL} />
              <span style={{ fontWeight: 950, color: TEAL, fontSize: "1rem" }}>Computation steps</span>
            </div>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              {result.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: `${TEAL}18`, color: TEAL, fontWeight: 950, fontSize: "0.72rem", flexShrink: 0, marginTop: 1 }}>
                    {i + 1}
                  </span>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.87rem" }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
            <div style={{ border: `1px solid ${convention === "strict" ? PURPLE : HAIRLINE}`, borderRadius: 8, background: convention === "strict" ? `${PURPLE}0A` : SURFACE, padding: "1rem", display: "grid", gap: "0.3rem" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: convention === "strict" ? PURPLE : INK_MUTED, fontWeight: 900 }}>Personal Year {targetYear}</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 950, color: convention === "strict" ? PURPLE : BLUE, lineHeight: 1 }}>{finalResult}</div>
              <div style={{ fontSize: "0.85rem", color: INK_SECONDARY, fontWeight: 850 }}>{convention === "strict" ? "Strict preservation" : "Flexibility (reduce)"}</div>
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

            {framing && (
              <div style={{ border: `1px solid ${TEAL}44`, borderRadius: 8, background: `${TEAL}0A`, padding: "1rem", display: "grid", gap: "0.3rem" }}>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: TEAL, fontWeight: 900 }}>Developmental framing</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 950, color: TEAL, lineHeight: 1.2 }}>{framing.framing}</div>
                <div style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>{framing.register}</div>
              </div>
            )}
          </div>

          {"caveat" in register && register.caveat && (
            <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, background: `${VERMILION}0A`, padding: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <ShieldAlert size={18} color={VERMILION} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
                <strong style={{ color: VERMILION }}>Caveat:</strong> {register.caveat}
              </p>
            </div>
          )}

          <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, background: `${VERMILION}0A`, padding: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <ShieldAlert size={18} color={VERMILION} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
              <strong style={{ color: VERMILION }}>Year-as-determinant refusal:</strong> Personal Year is rhythm-context chart-input, not a guarantee of year-outcomes. Refuse *PY1 guarantees success / PY7 guarantees difficulty / PY8 guarantees material gain* framings. Major-life-decisions still require convergent independent grounds.
            </p>
          </div>

          <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, background: `${GREEN}0A`, padding: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
              <strong style={{ color: GREEN }}>Cross-system identity:</strong> Personal Year is identical across Chaldean, Pythagorean, and Vedic systems because it is date-derived (birth-date + current-year), not letter-table-derived. System-selection is irrelevant for Personal Year computation.
            </p>
          </div>
        </>
      )}
    </section>
  );
}

/* ───────────────────────── Cycle Tab ───────────────────────── */

function CycleTab() {
  const [day, setDay] = useState<string>("15");
  const [month, setMonth] = useState<string>("8");
  const [startYear, setStartYear] = useState<string>("2026");

  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const startYearNum = parseInt(startYear, 10);

  const isValid =
    !Number.isNaN(dayNum) && dayNum >= 1 && dayNum <= 31 &&
    !Number.isNaN(monthNum) && monthNum >= 1 && monthNum <= 12 &&
    !Number.isNaN(startYearNum) && startYearNum >= 1000 && startYearNum <= 9999;

  const cycle = isValid ? computeNineYearCycle(dayNum, monthNum, startYearNum) : [];

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "end" }}>
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Birth day</label>
          <input type="number" min={1} max={31} value={day} onChange={(e) => setDay(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Birth month</label>
          <input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Start year</label>
          <input type="number" min={1000} max={9999} value={startYear} onChange={(e) => setStartYear(e.target.value)} style={{ ...inputStyle, width: 100 }} />
        </div>
      </div>

      {!isValid && (
        <div style={{ color: VERMILION, fontSize: "0.85rem", fontWeight: 850 }}>
          Enter a valid birth day, month, and start year to see the 9-year cycle.
        </div>
      )}

      {isValid && (
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <CalendarDays size={18} color={TEAL} />
            <span style={{ fontWeight: 950, color: TEAL, fontSize: "1rem" }}>9-year personal cycle from {startYearNum}</span>
          </div>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {cycle.map((cy, i) => (
              <div
                key={cy.year}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 60px 1fr",
                  gap: "0.75rem",
                  alignItems: "center",
                  padding: "0.6rem 0.75rem",
                  borderRadius: 8,
                  border: `1px solid ${HAIRLINE}`,
                  background: i === 0 ? `${TEAL}0A` : SURFACE,
                  borderLeft: `4px solid ${i === 0 ? TEAL : HAIRLINE}`,
                }}
              >
                <div style={{ fontWeight: 950, color: INK_PRIMARY }}>{cy.year}</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 950, color: BLUE }}>{cy.personalYear}</div>
                <div>
                  <div style={{ fontWeight: 850, color: GOLD, fontSize: "0.9rem" }}>{cy.register}</div>
                  <div style={{ fontSize: "0.82rem", color: INK_SECONDARY, lineHeight: 1.4 }}>{cy.framing}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>
            The cycle resets after PY9. First row highlighted = selected start year.
          </p>
        </div>
      )}
    </section>
  );
}

/* ───────────────────────── Examples Tab ───────────────────────── */

function ExamplesTab() {
  return (
    <section style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <BookOpen size={18} color={TEAL} />
          <span style={{ fontWeight: 950, color: TEAL, fontSize: "1rem" }}>Worked examples</span>
        </div>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Personal Year computations covering harmony-responsibility, mastery-material with Sade-Sati refusal, and new-beginnings with success-guarantee refusal.
        </p>
      </div>

      {WORKED_EXAMPLES.map((ex) => (
        <article key={ex.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.55rem" }}>
          <div style={{ fontWeight: 950, color: INK_PRIMARY, fontSize: "1rem" }}>
            {ex.label} — {String(ex.day).padStart(2, "0")}-{String(ex.month).padStart(2, "0")} / {ex.targetYear}
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
            <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "0.5rem 0.7rem", flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: "0.68rem", color: GOLD, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Register</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 950, color: GOLD }}>{ex.register}</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.3rem" }}>
            {ex.notes.map((note, i) => (
              <div key={i} style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start" }}>
                <ChevronRight size={14} color={TEAL} style={{ flexShrink: 0, marginTop: 3 }} />
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.84rem" }}>{note}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

/* ───────────────────────── Workflow Tab ───────────────────────── */

function WorkflowTab() {
  return (
    <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <ListChecks size={18} color={TEAL} />
        <span style={{ fontWeight: 950, color: TEAL, fontSize: "1rem" }}>Discipline-compliant Personal Year reading workflow</span>
      </div>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {WORKFLOW_STEPS.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.75rem", background: SURFACE }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: TEAL, color: "#fff", fontWeight: 950, fontSize: "0.8rem", flexShrink: 0 }}>
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

/* ───────────────────────── Tabs ───────────────────────── */

type TabKey = "calculator" | "cycle" | "examples" | "workflow";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "calculator", label: "Calculator", icon: <Calculator size={16} /> },
  { key: "cycle", label: "9-year cycle", icon: <CalendarDays size={16} /> },
  { key: "examples", label: "Examples", icon: <BookOpen size={16} /> },
  { key: "workflow", label: "Workflow", icon: <ListChecks size={16} /> },
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

const inputStyle: CSSProperties = {
  width: 80,
  padding: "0.55rem 0.7rem",
  borderRadius: 8,
  border: `1px solid ${HAIRLINE}`,
  background: SURFACE,
  color: INK_PRIMARY,
  fontSize: "1rem",
  fontWeight: 850,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
