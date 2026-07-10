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
  CATEGORIES,
  OVERCLAIM_LAYERS,
  SCENARIOS,
  WORKFLOW_STEPS,
  getCategory,
  verdictLabel,
  verdictColor,
  type CategoryKey,
  type OverclaimLayer,
  type Scenario,
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

export function NameCorrectionRationaleEvaluator() {
  const [activeTab, setActiveTab] = useState<TabKey>("evaluator");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("evaluator");
  };

  return (
    <div data-interactive="name-correction-rationale-evaluator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 21.4.1 — Name-Correction Rationale</p>
            <h2 style={{ margin: "0.2rem 0 0", color: TEAL, fontSize: "1.35rem" }}>
              Name-Change Rationale Evaluator
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Practise categorising name-change rationales, detecting over-claim layers, applying the convergent-independent-grounds test,
              and reaching discipline-compliant verdicts.
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
        {activeTab === "evaluator" && <EvaluatorTab />}
        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "workflow" && <WorkflowTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Evaluator Tab ───────────────────────── */

function EvaluatorTab() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([]);
  const [selectedOverclaim, setSelectedOverclaim] = useState<OverclaimLayer[]>([]);
  const [operationalTest, setOperationalTest] = useState<"yes" | "no" | "partial" | null>(null);

  const scenario = SCENARIOS[scenarioIndex];

  const toggleCategory = (key: CategoryKey) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleOverclaim = (key: OverclaimLayer) => {
    setSelectedOverclaim((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const resetScenario = () => {
    setShowAnswer(false);
    setSelectedCategories([]);
    setSelectedOverclaim([]);
    setOperationalTest(null);
  };

  const goToScenario = (idx: number) => {
    setScenarioIndex(idx);
    resetScenario();
  };

  const categoryCorrect =
    selectedCategories.length === scenario.categories.length &&
    scenario.categories.every((k) => selectedCategories.includes(k));

  const overclaimCorrect =
    selectedOverclaim.length === scenario.overclaim.length &&
    scenario.overclaim.every((k) => selectedOverclaim.includes(k));

  const testCorrect = operationalTest === scenario.operationalTest;

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
          "{scenario.quote}"
        </blockquote>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Step 1 — Categorise the rationale</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => toggleCategory(cat.key)}
                style={{
                  ...buttonStyle(selectedCategories.includes(cat.key), categoryColor(cat.compliant)),
                  fontSize: "0.82rem",
                  opacity: selectedCategories.includes(cat.key) ? 1 : 0.75,
                }}
              >
                {cat.number > 0 ? `${cat.number}. ` : ""}{cat.shortLabel}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Step 2 — Identify over-claim layers (if any)</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {OVERCLAIM_LAYERS.map((layer) => (
              <button
                key={layer.key}
                type="button"
                onClick={() => toggleOverclaim(layer.key)}
                style={{
                  ...buttonStyle(selectedOverclaim.includes(layer.key), VERMILION),
                  fontSize: "0.82rem",
                  opacity: selectedOverclaim.includes(layer.key) ? 1 : 0.75,
                }}
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Step 3 — Operational test: would they consider this WITHOUT numerology?</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {(["yes", "no", "partial"] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setOperationalTest(val)}
                style={{
                  ...buttonStyle(operationalTest === val, val === "yes" ? GREEN : val === "no" ? VERMILION : GOLD),
                  fontSize: "0.82rem",
                  textTransform: "capitalize",
                }}
              >
                {val === "yes" ? "Yes — independent grounds" : val === "no" ? "No — numerology alone" : "Partial — mixed"}
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

            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.75rem", display: "grid", gap: "0.35rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your selections vs. model answer</div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", fontSize: "0.85rem" }}>
                <span style={{ color: categoryCorrect ? GREEN : VERMILION, fontWeight: 400 }}>Categories: {categoryCorrect ? "match" : "mismatch"}</span>
                <span style={{ color: INK_MUTED }}>·</span>
                <span style={{ color: overclaimCorrect ? GREEN : VERMILION, fontWeight: 400 }}>Over-claim layers: {overclaimCorrect ? "match" : "mismatch"}</span>
                <span style={{ color: INK_MUTED }}>·</span>
                <span style={{ color: testCorrect ? GREEN : VERMILION, fontWeight: 400 }}>Operational test: {testCorrect ? "match" : "mismatch"}</span>
              </div>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}

function categoryColor(compliant: string): string {
  if (compliant === "legitimate") return GREEN;
  if (compliant === "conditional") return GOLD;
  return VERMILION;
}

/* ───────────────────────── Categories Tab ───────────────────────── */

function CategoriesTab() {
  return (
    <section style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <BookOpen size={18} color={TEAL} />
          <span style={{ fontWeight: 400, color: TEAL, fontSize: "1rem" }}>Six-rationale-category framework</span>
        </div>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Categories 1-5 are life-circumstance grounds. Category 6 is legitimate only when convergent with 1-5. Over-claim has no independent ground.
        </p>
      </div>

      {CATEGORIES.map((cat) => (
        <article
          key={cat.key}
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderLeft: `4px solid ${categoryColor(cat.compliant)}`,
            borderRadius: 8,
            background: SURFACE,
            padding: "1rem",
            display: "grid",
            gap: "0.35rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "1rem" }}>
              {cat.number > 0 ? `${cat.number}. ` : ""}{cat.label}
            </div>
            <div style={{ fontSize: "0.72rem", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.06em", color: categoryColor(cat.compliant) }}>
              {cat.compliant === "legitimate" ? "Legitimate ground" : cat.compliant === "conditional" ? "Conditional / confirmatory" : "Over-claim"}
            </div>
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.87rem" }}>{cat.description}</p>
        </article>
      ))}

      <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, background: `${VERMILION}0A`, padding: "0.85rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
          <AlertTriangle size={18} color={VERMILION} />
          <span style={{ fontWeight: 400, color: VERMILION, fontSize: "0.95rem" }}>Over-claim layers to refuse</span>
        </div>
        <div style={{ display: "grid", gap: "0.3rem" }}>
          {OVERCLAIM_LAYERS.map((layer) => (
            <div key={layer.key} style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start" }}>
              <ChevronRight size={14} color={VERMILION} style={{ flexShrink: 0, marginTop: 3 }} />
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.84rem" }}>
                <span style={{ color: VERMILION }}>{layer.label}:</span> {layer.description}
              </p>
            </div>
          ))}
        </div>
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
        <span style={{ fontWeight: 400, color: TEAL, fontSize: "1rem" }}>Rationale-evaluation workflow</span>
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

type TabKey = "evaluator" | "categories" | "workflow";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "evaluator", label: "Evaluator", icon: <Scale size={16} /> },
  { key: "categories", label: "Categories", icon: <BookOpen size={16} /> },
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
