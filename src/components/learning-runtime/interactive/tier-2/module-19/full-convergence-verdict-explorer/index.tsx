"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TriggerKey = "jupiter" | "saturn" | "nodes";
type LensKey = "hierarchy" | "vedha" | "ashtakavarga";
type MistakeKey = "compoundConfidence" | "cautionDevaluesWork" | "falsePrecision";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const MOON = "#5A6B8A";
const GREY = "#9A8E7D";

interface TriggerConfig {
  key: TriggerKey;
  label: string;
  short: string;
  verdict: string;
  color: string;
  detail: string;
}

const TRIGGERS: TriggerConfig[] = [
  {
    key: "jupiter",
    label: "Trigger 2: Jupiter → Gemini",
    short: "Jupiter",
    verdict: "T-D-V-Strong, unambiguous",
    color: GREEN,
    detail: "Jupiter is the running AD lord itself, giving the tightest possible daśā connection. Its transit is very favourable, vedha is clear, and both BAV and SAV are strong. It supplies hierarchy-relevance only indirectly via aspects.",
  },
  {
    key: "saturn",
    label: "Trigger 1: Saturn → Libra",
    short: "Saturn",
    verdict: "Conditionally Strong or Weak-with-defect",
    color: PURPLE,
    detail: "Saturn's transit is favourable and exalted, with a real hierarchy-touch on the 7th lord. Ashtakavarga is the chapter's strongest signal (BAV≈6, SAV≈27). The vedha reading is still contested: Strong under transit-only, Weak-with-vedha-defect under natal-inclusive.",
  },
  {
    key: "nodes",
    label: "Trigger 3: Nodal-axis reversal",
    short: "Nodes",
    verdict: "T-D-[V undetermined]",
    color: VERMILION,
    detail: "The nodal axis carries the single highest hierarchy-convergence found in this module — three independent mechanisms touching natal Moon. Vedha cannot be assessed from available sources, and Ashtakavarga provides only a mixed, planet-agnostic SAV picture (h6 moderate, h12 strong).",
  },
];

const LENSES: Record<LensKey, { label: string; color: string; question: string }> = {
  hierarchy: { label: "Hierarchy touch", color: MOON, question: "Does the transit geometry touch a sensitive point?" },
  vedha: { label: "Vedha status", color: VERMILION, question: "Is the transit obstructed?" },
  ashtakavarga: { label: "Ashtakavarga grade", color: GOLD, question: "Is the sign / planet bindu-strong?" },
};

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  compoundConfidence: {
    label: "Do not compound confidence as if checks were independent",
    heldText: "Held: the three checks are complementary views of the same configuration, not independent witnesses.",
    releasedText: "Warning: multiplying confidence across non-independent checks invents precision the reasoning does not support.",
  },
  cautionDevaluesWork: {
    label: "The caution does not devalue the checks themselves",
    heldText: "Held: hierarchy, vedha, and Ashtakavarga are real and worth doing carefully; only the multiplicative arithmetic is corrected.",
    releasedText: "Warning: treating the caution as a dismissal loses the real support the checks do provide.",
  },
  falsePrecision: {
    label: "Do not invent a confidence percentage",
    heldText: "Held: a structured qualitative verdict is comparable without a misleadingly precise number.",
    releasedText: "Warning: a percentage implies independence and precision that the analysis does not justify.",
  },
};

function LensDiagram({ active }: { active: Record<LensKey, boolean> }) {
  const cx = 160;
  const cy = 110;
  const lensPositions: Record<LensKey, { x: number; y: number }> = {
    hierarchy: { x: 60, y: 40 },
    vedha: { x: 260, y: 40 },
    ashtakavarga: { x: 160, y: 190 },
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 320 240" style={{ maxWidth: 360 }}>
      <circle cx={cx} cy={cy} r={52} fill={`${GOLD}12`} stroke={GOLD} strokeWidth={2} />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill={INK_PRIMARY} fontWeight={600}>
        Same transit
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fill={INK_PRIMARY} fontWeight={600}>
        configuration
      </text>

      {(Object.keys(LENSES) as LensKey[]).map((key) => {
        const pos = lensPositions[key];
        const isActive = active[key];
        const color = LENSES[key].color;
        return (
          <g key={key}>
            <line x1={cx} y1={cy} x2={pos.x} y2={pos.y} stroke={isActive ? color : GREY} strokeWidth={isActive ? 2 : 1} strokeDasharray={isActive ? undefined : "4 3"} />
            <circle cx={pos.x} cy={pos.y} r={34} fill={isActive ? `${color}18` : `${GREY}10`} stroke={isActive ? color : GREY} strokeWidth={2} />
            <text x={pos.x} y={pos.y - 4} textAnchor="middle" fontSize="10" fill={isActive ? color : GREY} fontWeight={600}>
              {LENSES[key].label}
            </text>
            <text x={pos.x} y={pos.y + 10} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
              {isActive ? "active" : "off"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function FullConvergenceVerdictExplorer() {
  const [selected, setSelected] = useState<TriggerKey>("jupiter");
  const [activeLenses, setActiveLenses] = useState<Record<LensKey, boolean>>({
    hierarchy: true,
    vedha: true,
    ashtakavarga: true,
  });
  const [analogy, setAnalogy] = useState<"correct" | "misleading">("correct");
  const [spanMode, setSpanMode] = useState<"season" | "date">("season");
  const [statementMode, setStatementMode] = useState<"honest" | "overclaiming">("honest");
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    compoundConfidence: true,
    cautionDevaluesWork: true,
    falsePrecision: true,
  });

  const trigger = TRIGGERS.find((t) => t.key === selected)!;
  const allLensesActive = Object.values(activeLenses).every(Boolean);
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setSelected("jupiter");
    setActiveLenses({ hierarchy: true, vedha: true, ashtakavarga: true });
    setAnalogy("correct");
    setSpanMode("season");
    setStatementMode("honest");
    setMistakes({ compoundConfidence: true, cautionDevaluesWork: true, falsePrecision: true });
  }

  function toggleLens(key: LensKey) {
    setActiveLenses((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div data-interactive="full-convergence-verdict-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Chapter 4 capstone</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Full convergence verdict explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Assemble Kavya&apos;s final verdict, see why the classical checks are complementary rather than independent, and apply the span-not-a-date closing discipline.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Verdict stack</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Three triggers, three different statuses
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem", marginTop: "0.75rem" }}>
          {TRIGGERS.map((t) => {
            const isSelected = selected === t.key;
            return (
              <button
                key={t.key}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(t.key)}
                style={{
                  textAlign: "left",
                  border: `1px solid ${isSelected ? t.color : HAIRLINE}`,
                  borderRadius: 8,
                  background: isSelected ? `${t.color}10` : SURFACE,
                  padding: "0.85rem",
                  cursor: "pointer",
                }}
              >
                <div style={{ color: t.color, fontWeight: 600, fontSize: "1.05rem" }}>{t.label}</div>
                <div style={{ marginTop: "0.35rem", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.45 }}>
                  {t.verdict}
                </div>
                {isSelected && <div style={{ marginTop: "0.45rem", color: INK_MUTED, fontSize: "0.78rem" }}>Click another card to compare</div>}
              </button>
            );
          })}
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "1 1 340px" }}>
          <p style={eyebrowStyle}>Three lenses, one configuration</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Turn classical checks on and off
          </h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            Each lens asks a different question about the same underlying transit. They are complementary, not independent sources of evidence.
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <LensDiagram active={activeLenses} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem", marginTop: "0.75rem" }}>
            {(Object.keys(LENSES) as LensKey[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={activeLenses[key]}
                onClick={() => toggleLens(key)}
                style={smallChipStyle(activeLenses[key], LENSES[key].color)}
              >
                {activeLenses[key] ? <CheckCircle2 size={14} aria-hidden="true" /> : <MinusCircle size={14} aria-hidden="true" />}
                {LENSES[key].label}
              </button>
            ))}
          </div>
          {!allLensesActive && (
            <div style={{ marginTop: "0.65rem", color: INK_MUTED, fontSize: "0.85rem" }}>
              Try turning lenses back on to see how each check adds a non-redundant angle on the same configuration.
            </div>
          )}
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 340px" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Selected trigger detail</p>
            <h3 style={{ margin: "0.15rem 0 0", color: trigger.color, fontSize: "1.15rem", fontWeight: 600 }}>
              {trigger.label}
            </h3>
            <div
              style={{
                marginTop: "0.55rem",
                padding: "0.75rem",
                borderRadius: 8,
                background: `${trigger.color}12`,
                border: `1px solid ${trigger.color}55`,
                color: INK_PRIMARY,
                lineHeight: 1.55,
              }}
            >
              <span style={{ color: trigger.color, fontWeight: 600 }}>{trigger.verdict}.</span>{" "}
              {trigger.detail}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Analogy check</p>
            <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
              Complementary checks vs independent evidence
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.55rem" }}>
              <button type="button" aria-pressed={analogy === "correct"} onClick={() => setAnalogy("correct")} style={smallChipStyle(analogy === "correct", GREEN)}>
                Car inspection
              </button>
              <button type="button" aria-pressed={analogy === "misleading"} onClick={() => setAnalogy("misleading")} style={smallChipStyle(analogy === "misleading", VERMILION)}>
                Independent witnesses
              </button>
            </div>
            <div
              style={{
                marginTop: "0.65rem",
                padding: "0.75rem",
                borderRadius: 8,
                background: analogy === "correct" ? `${GREEN}12` : `${VERMILION}12`,
                border: `1px solid ${analogy === "correct" ? GREEN : VERMILION}55`,
                color: INK_SECONDARY,
                lineHeight: 1.55,
              }}
            >
              {analogy === "correct"
                ? "Engine, transmission, and brakes are three genuinely different checks on the same car. Each catches problems the others miss, but their agreement is not the same as three unrelated witnesses confirming the same event."
                : "Three separate people claiming they saw the same accident is independent evidence that multiplies confidence. Classical checks are not like this — they inspect the same transit configuration through different rule-systems."}
            </div>
          </section>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Span discipline</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Season, not a date
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.55rem" }}>
            <button type="button" aria-pressed={spanMode === "season"} onClick={() => setSpanMode("season")} style={smallChipStyle(spanMode === "season", GREEN)}>
              A season
            </button>
            <button type="button" aria-pressed={spanMode === "date"} onClick={() => setSpanMode("date")} style={smallChipStyle(spanMode === "date", VERMILION)}>
              On the 14th
            </button>
          </div>
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: spanMode === "season" ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${spanMode === "season" ? GREEN : VERMILION}55`,
              color: INK_PRIMARY,
              lineHeight: 1.55,
            }}
          >
            {spanMode === "season"
              ? "Honest: this window licenses a strengthened statement about a season. It is more defensible than a vague 'sometime this year,' but it does not become a date."
              : "Overreach: even with all three steps converged, T2-01 1.1.4 §4.5 forbids naming a specific day. This would be invented precision."}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Client-facing statement</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Choose the wording
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.55rem" }}>
            <button type="button" aria-pressed={statementMode === "honest"} onClick={() => setStatementMode("honest")} style={smallChipStyle(statementMode === "honest", GREEN)}>
              Scope-honest
            </button>
            <button type="button" aria-pressed={statementMode === "overclaiming"} onClick={() => setStatementMode("overclaiming")} style={smallChipStyle(statementMode === "overclaiming", VERMILION)}>
              Overclaiming
            </button>
          </div>
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: statementMode === "honest" ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${statementMode === "honest" ? GREEN : VERMILION}55`,
              color: INK_SECONDARY,
              lineHeight: 1.6,
            }}
          >
            {statementMode === "honest"
              ? "This window shows a well-supported transit picture by several different classical measures: Jupiter's own transit is cleanly confirmed on every check performed; Saturn's transit is strong by most measures with one specific, disclosed point of classical ambiguity still open; and a third, nodal-based signal is the most strongly-connected of all by one measure, though it cannot be fully checked by another. Together, this is meaningfully more supported than a single favourable transit alone would be — though these are complementary checks on the same configuration, not independent proofs, and the precise timing this points to is a season, not a date."
              : "Three independent astrological techniques all confirm this is an extremely high-confidence period for a major favourable event."}
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const held = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={held}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !held }))}
                style={togglePanelStyle(held, held ? GREEN : VERMILION)}
              >
                {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <span style={{ fontWeight: 600 }}>{MISTAKES[key].label}</span>
                  <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? MISTAKES[key].heldText : MISTAKES[key].releasedText}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 8,
            background: allMistakesHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allMistakesHeld ? GREEN : VERMILION}55`,
            color: allMistakesHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allMistakesHeld
            ? "All discipline commitments are held. The verdict is structured, honest, and appropriately scoped."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
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
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.4rem 0.6rem",
    fontSize: "0.9rem",
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

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
