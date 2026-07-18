"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type Scenario = "kavya" | "second";
type StatementMode = "honest" | "overclaiming";
type YesNoMode = "tiered" | "binary";
type MistakeKey = "rederive" | "inventDate" | "dropUncertainty" | "templateVerdict";

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

interface StepData {
  title: string;
  kavya: string;
  second: string;
}

const STEPS: StepData[] = [
  {
    title: "1. Active daśā period",
    kavya: "Moon Mahādaśā / Jupiter antardaśā — M18's marriage-question demonstration period. Jupiter is the female native's marriage-kāraka and is the running AD lord.",
    second: "Same Moon MD / Jupiter AD period, but this client's own birth chart and kāraka placement must still be checked individually.",
  },
  {
    title: "2. Transit triggers",
    kavya: "Three triggers: Saturn → Libra, Jupiter → Gemini, nodal-axis reversal onto natal Moon.",
    second: "Similarly-shaped double-transit plus nodal axis, but the specific signs and points depend on this client's chart.",
  },
  {
    title: "3. Hierarchy-relevance",
    kavya: "Saturn touches 7th lord's own return and Moon; Jupiter is the AD lord itself; nodes touch natal Moon with three independent mechanisms.",
    second: "Assuming a comparable hierarchy result, the triggers touch relevant marriage points — but the count and quality are chart-specific.",
  },
  {
    title: "4. Vedha status",
    kavya: "Jupiter clear; Saturn contested (transit-only stands, natal-inclusive obstructed); nodes unreachable — no classical nodal vedha table.",
    second: "Vedha is clear and unambiguous on both slow-planet triggers because no natal planet occupies either vedha-point sign.",
  },
  {
    title: "5. Ashtakavarga grade",
    kavya: "Saturn BAV(h4)≈6 strong, SAV(h4)≈27 strong; Jupiter BAV(h12)≈5 strong, SAV(h12)≈26 strong; nodes have no BAV, mixed SAV.",
    second: "Ashtakavarga is weak (BAV 2-3) rather than strong — the strength-check that supported Kavya's Trigger 1 is not available here.",
  },
  {
    title: "6. Convergence verdict",
    kavya: "Jupiter unambiguously T-D-V-Strong; Saturn conditionally Strong-or-Weak; nodes T-D-[V undetermined]. Multi-part, not a single number.",
    second: "Clear vedha is a point in this client's favour, but weak Ashtakavarga is a point against. The same structured format applies with different values.",
  },
  {
    title: "7. Precision ceiling",
    kavya: "Honest window: roughly 2-3 months anchored on the later of Saturn's and Jupiter's settling points, within the AD span.",
    second: "Same workflow applies, but the weaker Ashtakavarga may temper how strongly the 2-3 month window can be described.",
  },
  {
    title: "8. Client statement",
    kavya: "A structured statement naming the period, the configuration, the open technical question, and the calibrated window — span, not date, not a guarantee.",
    second: "Same statement structure, with content adjusted: vedha is clean, Ashtakavarga is weak, overall verdict is weaker than Kavya's.",
  },
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  rederive: {
    label: "Assemble prior findings, do not re-derive them",
    heldText: "Held: a capstone synthesis cites and assembles steps already completed in earlier lessons.",
    releasedText: "Warning: re-deriving from scratch wastes time and misses the point of a synthesis workflow.",
  },
  inventDate: {
    label: "Do not invent a specific calendar date for the settling window",
    heldText: "Held: the window is described relative to the triggers' own settling points, not a fabricated date.",
    releasedText: "Warning: naming a specific month/year this teaching case cannot support is false precision.",
  },
  dropUncertainty: {
    label: "Carry every disclosed uncertainty into the client statement",
    heldText: "Held: compression that drops the contested vedha or unreachable Trigger 3 loses hard-won information.",
    releasedText: "Warning: a cleaner-sounding statement that hides uncertainty is less honest, not more useful.",
  },
  templateVerdict: {
    label: "Do not treat Kavya's verdict as a template",
    heldText: "Held: the workflow generalises; the verdict's content is entirely chart-specific.",
    releasedText: "Warning: expecting every chart to produce the same findings is a memorisation failure, not synthesis.",
  },
};

function WorkflowDiagram({ activeStep, onSelect }: { activeStep: number; onSelect: (i: number) => void }) {
  const count = STEPS.length;
  const startY = 24;
  const endY = 392;
  const cyFor = (i: number) => startY + (i * (endY - startY)) / (count - 1);

  return (
    <svg width="60" height="100%" viewBox="0 0 60 420" style={{ minHeight: 420, maxHeight: 480 }}>
      <line x1="30" y1={startY} x2="30" y2={endY} stroke={HAIRLINE} strokeWidth={2} />
      {STEPS.map((_, i) => {
        const active = i === activeStep;
        return (
          <g key={i} style={{ cursor: "pointer" }} onClick={() => onSelect(i)}>
            <circle cx="30" cy={cyFor(i)} r={active ? 10 : 7} fill={active ? GOLD : "transparent"} stroke={active ? GOLD : HAIRLINE} strokeWidth={2} />
            <text x="30" y={cyFor(i) + 4} fontSize={active ? 10 : 9} fill="#fff" fontWeight={600} textAnchor="middle">
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function MarriageTimingSynthesisWorkbench() {
  const [scenario, setScenario] = useState<Scenario>("kavya");
  const [activeStep, setActiveStep] = useState(0);
  const [statementMode, setStatementMode] = useState<StatementMode>("honest");
  const [yesNoMode, setYesNoMode] = useState<YesNoMode>("tiered");
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    rederive: true,
    inventDate: true,
    dropUncertainty: true,
    templateVerdict: true,
  });

  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setScenario("kavya");
    setActiveStep(0);
    setStatementMode("honest");
    setYesNoMode("tiered");
    setMistakes({ rederive: true, inventDate: true, dropUncertainty: true, templateVerdict: true });
  }

  const honestStatement = scenario === "kavya"
    ? "Your current major life-period is genuinely significant for marriage prospects — it's built around Jupiter, which is your own chart's marriage-significator, actively running as the operative sub-period. Within it, I can point to a specific window: a season when two independent, slow-moving planetary shifts — Saturn returning to a sign it holds real strength in, and Jupiter moving into your marriage house directly — both become active and settled together. That combination is well-supported by several traditional measures; on one specific technical point (whether a particular placement in your birth chart affects one of these two signals) the reading is genuinely divided between two defensible interpretations, which I want to be upfront about. A third signal, involving the lunar nodes, is the single most strongly-connected indicator by one measure, though it's not one I can fully cross-check by a second classical method. Put together: this is a meaningfully well-supported season for this to move forward, most sharply defined as roughly a 2-3 month stretch once both main signals have fully settled into place — not a single date, and not a guarantee, but a genuinely narrowed, honestly-reasoned window rather than a vague 'sometime in the next year or two.'"
    : "Your current period also shows a double-transit pattern, and the obstruction question is cleaner than in some charts — there is no contested vedha point blocking either slow-planet trigger. However, the Ashtakavarga strength-check comes out weak here, which is a real point against. The same structured workflow therefore produces a more cautious verdict: a window can still be identified, but it should be described as weaker overall than a case where both vedha and Ashtakavarga line up strongly.";

  return (
    <div data-interactive="marriage-timing-synthesis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Chapter 5 capstone</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Marriage timing synthesis workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Run the complete T-D-V workflow from a client&apos;s marriage question to a calibrated, honest window statement.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Scenario selector</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Same workflow, different chart-specific verdict
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button type="button" aria-pressed={scenario === "kavya"} onClick={() => { setScenario("kavya"); setActiveStep(0); }} style={buttonStyle(scenario === "kavya", PURPLE)}>
            Kavya (contested vedha, strong Ashtakavarga)
          </button>
          <button type="button" aria-pressed={scenario === "second"} onClick={() => { setScenario("second"); setActiveStep(0); }} style={buttonStyle(scenario === "second", MOON)}>
            Second client (clear vedha, weak Ashtakavarga)
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "0 0 auto", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <WorkflowDiagram activeStep={activeStep} onSelect={setActiveStep} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={eyebrowStyle}>Eight-step workflow</p>
            <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
              Click a step to inspect
            </h3>
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.45rem" }}>
              {STEPS.map((step, i) => {
                const active = i === activeStep;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveStep(i)}
                    style={{
                      textAlign: "left",
                      border: `1px solid ${active ? GOLD : HAIRLINE}`,
                      borderRadius: 8,
                      background: active ? `${GOLD}10` : "transparent",
                      padding: "0.55rem 0.75rem",
                      color: active ? INK_PRIMARY : INK_SECONDARY,
                      fontWeight: active ? 600 : 400,
                      cursor: "pointer",
                    }}
                  >
                    {step.title}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Step detail</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            {STEPS[activeStep].title}
          </h3>
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.85rem",
              borderRadius: 8,
              background: scenario === "kavya" ? `${PURPLE}10` : `${MOON}10`,
              border: `1px solid ${scenario === "kavya" ? PURPLE : MOON}55`,
              color: INK_PRIMARY,
              lineHeight: 1.6,
            }}
          >
            {scenario === "kavya" ? STEPS[activeStep].kavya : STEPS[activeStep].second}
          </div>
          {activeStep === 7 && (
            <div style={{ marginTop: "0.75rem" }}>
              <p style={{ color: INK_SECONDARY, margin: "0 0 0.45rem" }}>Statement mode:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <button type="button" aria-pressed={statementMode === "honest"} onClick={() => setStatementMode("honest")} style={smallChipStyle(statementMode === "honest", GREEN)}>
                  Scope-honest
                </button>
                <button type="button" aria-pressed={statementMode === "overclaiming"} onClick={() => setStatementMode("overclaiming")} style={smallChipStyle(statementMode === "overclaiming", VERMILION)}>
                  Overclaiming
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Client-facing statement</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            {statementMode === "honest" ? "Scope-honest version" : "Overclaiming version"}
          </h3>
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.85rem",
              borderRadius: 8,
              background: statementMode === "honest" ? `${GREEN}10` : `${VERMILION}10`,
              border: `1px solid ${statementMode === "honest" ? GREEN : VERMILION}55`,
              color: INK_SECONDARY,
              lineHeight: 1.65,
            }}
          >
            {statementMode === "honest" ? honestStatement : "This is an extremely high-confidence period for a major favourable event. Three independent techniques confirm it."}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>The &ldquo;yes or no&rdquo; question</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Answer in tiers, not a false binary
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.55rem" }}>
            <button type="button" aria-pressed={yesNoMode === "tiered"} onClick={() => setYesNoMode("tiered")} style={smallChipStyle(yesNoMode === "tiered", GREEN)}>
              Tiered response
            </button>
            <button type="button" aria-pressed={yesNoMode === "binary"} onClick={() => setYesNoMode("binary")} style={smallChipStyle(yesNoMode === "binary", VERMILION)}>
              False binary
            </button>
          </div>
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: yesNoMode === "tiered" ? `${GREEN}10` : `${VERMILION}10`,
              border: `1px solid ${yesNoMode === "tiered" ? GREEN : VERMILION}55`,
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            {yesNoMode === "tiered"
              ? "It's not a guarantee, but it's meaningfully more than a neutral period. Multiple classical measures point the same direction for this specific window, which is real support, even with the one open technical question. I'd call this a moderate-to-strong indication concentrated in that 2-3 month window, rather than either a certainty or a coin flip."
              : "Yes — this is the period."}
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
            ? "All discipline commitments are held. The workflow is applied, not memorised, and the statement is honestly scoped."
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
