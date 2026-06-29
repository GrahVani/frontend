"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ListChecks,
  RotateCcw,
  Scale,
  ShieldAlert,
} from "lucide-react";
import {
  COST_CATEGORIES,
  FAILURE_MODES,
  FOUR_TESTS,
  SCENARIOS,
  WORKFLOW_STEPS,
  getFailureMode,
  getTest,
  verdictColor,
  verdictLabel,
  type FailureModeKey,
  type Scenario,
  type TestKey,
  type Verdict,
  type CostCategory,
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
const TEAL = "#2E7D7B";

export function NameCorrectionCautionScreener() {
  const [activeTab, setActiveTab] = useState<TabKey>("screener");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("screener");
  };

  return (
    <div data-interactive="name-correction-caution-screener" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 21.4.3 — Name-Correction Cautions</p>
            <h2 style={{ margin: "0.2rem 0 0", color: TEAL, fontSize: "1.35rem" }}>
              Name-Correction Caution Screener
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Practise applying the four-test screen, identifying commercial-numerology failure modes,
              surfacing real-cost categories, and reaching discipline-compliant verdicts.
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
              fontWeight: 400,
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
        {activeTab === "screener" && <ScreenerTab />}
        {activeTab === "costs" && <CostsTab />}
        {activeTab === "catalogue" && <CatalogueTab />}
        {activeTab === "workflow" && <WorkflowTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Screener Tab ───────────────────────── */

function ScreenerTab() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [testResults, setTestResults] = useState<Record<TestKey, boolean | null>>({
    "empirical-kernel": null,
    "demolition-prohibition": null,
    "cost-benefit": null,
    "over-claim": null,
  });
  const [selectedFailures, setSelectedFailures] = useState<FailureModeKey[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const scenario = SCENARIOS[scenarioIndex];

  const setTest = (key: TestKey, value: boolean) => {
    setTestResults((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFailure = (key: FailureModeKey) => {
    setSelectedFailures((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const resetScenario = () => {
    setShowAnswer(false);
    setTestResults({
      "empirical-kernel": null,
      "demolition-prohibition": null,
      "cost-benefit": null,
      "over-claim": null,
    });
    setSelectedFailures([]);
    setVerdict(null);
  };

  const goToScenario = (idx: number) => {
    setScenarioIndex(idx);
    resetScenario();
  };

  const testsCorrect = FOUR_TESTS.every((t) => testResults[t.key] === scenario.expectedTests[t.key]);

  const failuresCorrect =
    selectedFailures.length === scenario.expectedFailures.length &&
    scenario.expectedFailures.every((k) => selectedFailures.includes(k));

  const verdictCorrect = verdict === scenario.verdict;

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goToScenario(i)}
            style={{
              ...buttonStyle(scenarioIndex === i, scenarioIndex === i ? TEAL : BLUE),
              fontSize: "0.82rem",
            }}
          >
            Scenario {i + 1}
          </button>
        ))}
      </div>

      <article style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Scale size={18} color={TEAL} />
          <span style={{ fontWeight: 400, color: TEAL, fontSize: "1rem" }}>Scenario {scenario.id}: {scenario.client}</span>
        </div>
        <blockquote style={{ margin: 0, padding: "0.75rem", borderLeft: `4px solid ${GOLD}`, background: `${GOLD}0A`, borderRadius: 8, fontStyle: "italic", color: INK_PRIMARY, lineHeight: 1.55 }}>
          &ldquo;{scenario.quote}&rdquo;
        </blockquote>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.87rem", lineHeight: 1.55 }}>
          <span style={{ color: INK_PRIMARY }}>Context:</span> {scenario.context}
        </p>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Step 1 — Apply the four-test screen</div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {FOUR_TESTS.map((t) => (
              <div key={t.key} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.65rem", background: SURFACE }}>
                <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "0.9rem", marginBottom: "0.35rem" }}>{t.label}</div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setTest(t.key, true)}
                    style={buttonStyle(testResults[t.key] === true, GREEN)}
                  >
                    PASS — {t.passQuestion}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTest(t.key, false)}
                    style={buttonStyle(testResults[t.key] === false, VERMILION)}
                  >
                    FAIL — {t.failQuestion}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Step 2 — Identify commercial failure modes (if any)</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {FAILURE_MODES.map((fm) => (
              <button
                key={fm.key}
                type="button"
                onClick={() => toggleFailure(fm.key)}
                style={{
                  ...buttonStyle(selectedFailures.includes(fm.key), VERMILION),
                  fontSize: "0.82rem",
                  opacity: selectedFailures.includes(fm.key) ? 1 : 0.75,
                }}
              >
                {fm.number}. {fm.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Step 3 — Choose discipline-compliant verdict</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {VERDICTS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVerdict(v)}
                style={{
                  ...buttonStyle(verdict === v, verdictColor(v)),
                  fontSize: "0.82rem",
                }}
              >
                {verdictLabel(v)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button type="button" onClick={() => setShowAnswer(true)} style={buttonStyle(true, TEAL)}>
            Reveal discipline-compliant verdict
          </button>
          <button type="button" onClick={resetScenario} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={14} aria-hidden="true" />
            Reset scenario
          </button>
        </div>

        {showAnswer && (
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <div style={{ border: `1px solid ${verdictColor(scenario.verdict)}44`, borderRadius: 8, background: `${verdictColor(scenario.verdict)}0A`, padding: "1rem", display: "grid", gap: "0.35rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {scenario.verdict === "refuse" ? <ShieldAlert size={18} color={verdictColor(scenario.verdict)} /> : <CheckCircle2 size={18} color={verdictColor(scenario.verdict)} />}
                <span style={{ fontWeight: 400, color: verdictColor(scenario.verdict), fontSize: "1rem" }}>{verdictLabel(scenario.verdict)}</span>
              </div>
              <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.55, fontSize: "0.9rem" }}>{scenario.explanation}</p>
            </div>

            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.85rem", display: "grid", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertTriangle size={18} color={GOLD} />
                <span style={{ fontWeight: 400, color: GOLD, fontSize: "0.95rem" }}>Model practitioner response</span>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.87rem", fontStyle: "italic" }}>
                &ldquo;{scenario.practitionerResponse}&rdquo;
              </p>
            </div>

            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.75rem", display: "grid", gap: "0.35rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your selections vs. model answer</div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", fontSize: "0.85rem" }}>
                <span style={{ color: testsCorrect ? GREEN : VERMILION, fontWeight: 400 }}>Four tests: {testsCorrect ? "match" : "mismatch"}</span>
                <span style={{ color: INK_MUTED }}>·</span>
                <span style={{ color: failuresCorrect ? GREEN : VERMILION, fontWeight: 400 }}>Failure modes: {failuresCorrect ? "match" : "mismatch"}</span>
                <span style={{ color: INK_MUTED }}>·</span>
                <span style={{ color: verdictCorrect ? GREEN : VERMILION, fontWeight: 400 }}>Verdict: {verdictCorrect ? "match" : "mismatch"}</span>
              </div>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}

/* ───────────────────────── Costs Tab ───────────────────────── */

function CostsTab() {
  return (
    <section style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <AlertTriangle size={18} color={TEAL} />
          <span style={{ fontWeight: 400, color: TEAL, fontSize: "1rem" }}>Three real-cost categories of legal name-change</span>
        </div>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Documentation, social-friction, and identity-continuity costs COMPOUND. Single-numerology-framing alone
          cannot pass cost-benefit because there is no convergent-ground benefit to outweigh them.
        </p>
      </div>

      {COST_CATEGORIES.map((cost) => (
        <article
          key={cost.key}
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderLeft: `4px solid ${costColor(cost.key)}`,
            borderRadius: 8,
            background: SURFACE,
            padding: "1rem",
            display: "grid",
            gap: "0.35rem",
          }}
        >
          <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "1rem" }}>
            {cost.number}. {cost.label}
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.87rem" }}>{cost.description}</p>
          <div style={{ display: "grid", gap: "0.25rem" }}>
            {cost.examples.map((ex, i) => (
              <div key={i} style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start" }}>
                <ChevronRight size={14} color={costColor(cost.key)} style={{ flexShrink: 0, marginTop: 3 }} />
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.84rem" }}>{ex}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

function costColor(key: CostCategory["key"]): string {
  if (key === "documentation") return BLUE;
  if (key === "social-friction") return GOLD;
  return VERMILION;
}

/* ───────────────────────── Catalogue Tab ───────────────────────── */

function CatalogueTab() {
  return (
    <section style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <BookOpen size={18} color={TEAL} />
          <span style={{ fontWeight: 400, color: TEAL, fontSize: "1rem" }}>Commercial-numerology over-claim refusal catalogue</span>
        </div>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Refuse all six failure modes regardless of legitimate-looking surface presentation. Often two or more
          appear layered together.
        </p>
      </div>

      {FAILURE_MODES.map((fm) => (
        <article
          key={fm.key}
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderLeft: `4px solid ${VERMILION}`,
            borderRadius: 8,
            background: SURFACE,
            padding: "1rem",
            display: "grid",
            gap: "0.35rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "1rem" }}>
              {fm.number}. {fm.label}
            </div>
            <div style={{ fontSize: "0.72rem", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.06em", color: VERMILION }}>
              Refuse
            </div>
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.87rem" }}>{fm.description}</p>
        </article>
      ))}

      <div style={{ border: `1px solid ${TEAL}44`, borderRadius: 8, background: `${TEAL}0A`, padding: "0.85rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
          <Scale size={18} color={TEAL} />
          <span style={{ fontWeight: 400, color: TEAL, fontSize: "0.95rem" }}>Practitioner ethical position</span>
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
          Provide information + apply discipline + respect client decision. Refuse pressure in BOTH directions:
          do not pressure toward name-change (commercial-numerologist failure mode) and do not pressure away
          from name-change (over-cautious paternalism failure mode). The decision rests with the client.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── Workflow Tab ───────────────────────── */

function WorkflowTab() {
  return (
    <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <ListChecks size={18} color={TEAL} />
        <span style={{ fontWeight: 400, color: TEAL, fontSize: "1rem" }}>Chapter 4 integrated refusal-discipline flow</span>
      </div>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {WORKFLOW_STEPS.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.75rem", background: SURFACE }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: TEAL, color: "#fff", fontWeight: 400, fontSize: "0.8rem", flexShrink: 0 }}>
              {i + 1}
            </span>
            <div>
              <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "0.95rem", marginBottom: "0.15rem" }}>{step.title}</div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Tabs ───────────────────────── */

type TabKey = "screener" | "costs" | "catalogue" | "workflow";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "screener", label: "Screener", icon: <Scale size={16} /> },
  { key: "costs", label: "Real Costs", icon: <AlertTriangle size={16} /> },
  { key: "catalogue", label: "Catalogue", icon: <BookOpen size={16} /> },
  { key: "workflow", label: "Workflow", icon: <ListChecks size={16} /> },
];

const VERDICTS: Verdict[] = ["proceed", "preview", "revise", "refuse"];

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
    fontWeight: 400,
    cursor: "pointer",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 400,
};
