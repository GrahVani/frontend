"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Layers,
  ListChecks,
  RotateCcw,
  Scale,
  ShieldAlert,
} from "lucide-react";
import {
  CHAPTER_INTEGRATION,
  DO_NO_HARM_FORMS,
  LAYERS,
  OVERCLAIM_FRAMINGS,
  SCENARIOS,
  WORKFLOW_SUMMARY,
  getDoNoHarmForm,
  getOverclaim,
  verdictColor,
  verdictLabel,
  type DoNoHarmKey,
  type LayerDescription,
  type OverclaimKey,
  type Scenario,
  type Verdict,
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

export function NumerologyHonestHandlingInspector() {
  const [activeTab, setActiveTab] = useState<TabKey>("inspector");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("inspector");
  };

  return (
    <div data-interactive="numerology-honest-handling-inspector" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 21.4.4 — Numerology Honest-Handling</p>
            <h2 style={{ margin: "0.2rem 0 0", color: TEAL, fontSize: "1.35rem" }}>
              Honest-Handling Inspector
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Practise distinguishing the empirical-kernel from the over-claim layer, identifying the eight
              refused framings, applying the five do-no-harm forms, and reaching discipline-compliant verdicts.
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
        {activeTab === "inspector" && <InspectorTab />}
        {activeTab === "layers" && <LayersTab />}
        {activeTab === "forms" && <FormsTab />}
        {activeTab === "integration" && <IntegrationTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Inspector Tab ───────────────────────── */

function InspectorTab() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [empiricalKernel, setEmpiricalKernel] = useState<boolean | null>(null);
  const [selectedOverclaims, setSelectedOverclaims] = useState<OverclaimKey[]>([]);
  const [selectedForms, setSelectedForms] = useState<DoNoHarmKey[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const scenario = SCENARIOS[scenarioIndex];

  const toggleOverclaim = (key: OverclaimKey) => {
    setSelectedOverclaims((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleForm = (key: DoNoHarmKey) => {
    setSelectedForms((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const resetScenario = () => {
    setShowAnswer(false);
    setEmpiricalKernel(null);
    setSelectedOverclaims([]);
    setSelectedForms([]);
    setVerdict(null);
  };

  const goToScenario = (idx: number) => {
    setScenarioIndex(idx);
    resetScenario();
  };

  const empiricalCorrect = empiricalKernel === scenario.empiricalKernelPresent;

  const overclaimsCorrect =
    selectedOverclaims.length === scenario.expectedOverclaims.length &&
    scenario.expectedOverclaims.every((k) => selectedOverclaims.includes(k));

  const formsCorrect =
    selectedForms.length === scenario.expectedFormsViolated.length &&
    scenario.expectedFormsViolated.every((k) => selectedForms.includes(k));

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
          <div style={{ fontSize: "0.85rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Step 1 — Is there a legitimate empirical-kernel present?</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button type="button" onClick={() => setEmpiricalKernel(true)} style={buttonStyle(empiricalKernel === true, GREEN)}>
              Yes — preserve the symbolic-layer content
            </button>
            <button type="button" onClick={() => setEmpiricalKernel(false)} style={buttonStyle(empiricalKernel === false, VERMILION)}>
              No — only over-claim
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Step 2 — Which over-claim framings are present? (select all that apply)</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {OVERCLAIM_FRAMINGS.map((oc) => (
              <button
                key={oc.key}
                type="button"
                onClick={() => toggleOverclaim(oc.key)}
                style={{
                  ...buttonStyle(selectedOverclaims.includes(oc.key), VERMILION),
                  fontSize: "0.82rem",
                  opacity: selectedOverclaims.includes(oc.key) ? 1 : 0.75,
                }}
              >
                {oc.number}. {oc.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Step 3 — Which do-no-harm forms are violated? (select all that apply)</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {DO_NO_HARM_FORMS.map((form) => (
              <button
                key={form.key}
                type="button"
                onClick={() => toggleForm(form.key)}
                style={{
                  ...buttonStyle(selectedForms.includes(form.key), GOLD),
                  fontSize: "0.82rem",
                  opacity: selectedForms.includes(form.key) ? 1 : 0.75,
                }}
              >
                ({form.letter}) {form.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Step 4 — Choose discipline-compliant verdict</div>
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
                <span style={{ color: empiricalCorrect ? GREEN : VERMILION, fontWeight: 400 }}>Empirical-kernel: {empiricalCorrect ? "match" : "mismatch"}</span>
                <span style={{ color: INK_MUTED }}>·</span>
                <span style={{ color: overclaimsCorrect ? GREEN : VERMILION, fontWeight: 400 }}>Over-claim framings: {overclaimsCorrect ? "match" : "mismatch"}</span>
                <span style={{ color: INK_MUTED }}>·</span>
                <span style={{ color: formsCorrect ? GREEN : VERMILION, fontWeight: 400 }}>Do-no-harm forms: {formsCorrect ? "match" : "mismatch"}</span>
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

/* ───────────────────────── Layers Tab ───────────────────────── */

function LayersTab() {
  return (
    <section style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Layers size={18} color={TEAL} />
          <span style={{ fontWeight: 400, color: TEAL, fontSize: "1rem" }}>Three-layer holding</span>
        </div>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Honest numerology practice distinguishes the empirical-kernel and symbolic layer from the over-claim
          layer. Preserve the first two; refuse the third structurally.
        </p>
      </div>

      {LAYERS.map((layer) => (
        <article
          key={layer.key}
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderLeft: `4px solid ${layerColor(layer.key)}`,
            borderRadius: 8,
            background: SURFACE,
            padding: "1rem",
            display: "grid",
            gap: "0.35rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "1rem" }}>{layer.label}</div>
            <div style={{ fontSize: "0.72rem", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.06em", color: layerColor(layer.key) }}>
              {layer.key === "over-claim" ? "Refuse" : "Preserve / acknowledge"}
            </div>
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.87rem" }}>{layer.description}</p>
          <p style={{ margin: 0, color: layerColor(layer.key), lineHeight: 1.45, fontSize: "0.84rem", fontWeight: 400 }}>{layer.stance}</p>
        </article>
      ))}
    </section>
  );
}

function layerColor(key: LayerDescription["key"]): string {
  if (key === "empirical-kernel") return GREEN;
  if (key === "symbolic-layer") return BLUE;
  return VERMILION;
}

/* ───────────────────────── Forms Tab ───────────────────────── */

function FormsTab() {
  return (
    <section style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <AlertTriangle size={18} color={TEAL} />
          <span style={{ fontWeight: 400, color: TEAL, fontSize: "1rem" }}>Five operational forms of do-no-harm</span>
        </div>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          The five rules are conjunctive protections against the eight over-claim framings. Skipping any one
          leaves the corresponding over-claim unrefused.
        </p>
      </div>

      {DO_NO_HARM_FORMS.map((form) => (
        <article
          key={form.key}
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderLeft: `4px solid ${TEAL}`,
            borderRadius: 8,
            background: SURFACE,
            padding: "1rem",
            display: "grid",
            gap: "0.35rem",
          }}
        >
          <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "1rem" }}>
            ({form.letter}) {form.label}
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.87rem" }}>{form.description}</p>
        </article>
      ))}
    </section>
  );
}

/* ───────────────────────── Integration Tab ───────────────────────── */

function IntegrationTab() {
  return (
    <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <ListChecks size={18} color={TEAL} />
        <span style={{ fontWeight: 400, color: TEAL, fontSize: "1rem" }}>Chapter 1-4 integration into one coherent practice</span>
      </div>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {CHAPTER_INTEGRATION.map((row, i) => (
          <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.75rem", background: SURFACE }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: TEAL, color: "#fff", fontWeight: 400, fontSize: "0.8rem", flexShrink: 0 }}>
              {i + 1}
            </span>
            <div>
              <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "0.95rem", marginBottom: "0.15rem" }}>{row.chapter}</div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.84rem" }}>
                <span style={{ color: INK_PRIMARY }}>Refusals:</span> {row.refusals}
              </p>
              <p style={{ margin: "0.15rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.84rem" }}>
                <span style={{ color: INK_PRIMARY }}>Integration:</span> {row.integration}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.75rem", display: "grid", gap: "0.5rem" }}>
        <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "0.95rem" }}>Integrated workflow summary</div>
        {WORKFLOW_SUMMARY.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start" }}>
            <ChevronRight size={14} color={TEAL} style={{ flexShrink: 0, marginTop: 3 }} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.84rem" }}>
              <span style={{ color: INK_PRIMARY }}>{step.title}:</span> {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Tabs ───────────────────────── */

type TabKey = "inspector" | "layers" | "forms" | "integration";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "inspector", label: "Inspector", icon: <Scale size={16} /> },
  { key: "layers", label: "Layers", icon: <Layers size={16} /> },
  { key: "forms", label: "Do-No-Harm", icon: <AlertTriangle size={16} /> },
  { key: "integration", label: "Integration", icon: <ListChecks size={16} /> },
];

const VERDICTS: Verdict[] = ["proceed", "revise", "refuse", "mixed"];

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
