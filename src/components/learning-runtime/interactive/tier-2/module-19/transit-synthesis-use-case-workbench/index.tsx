"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type DomainKey = "marriage" | "career" | "health" | "education" | "property" | "travel" | "litigation" | "wealth";
type StepKind = "independent" | "specific";
type DisagreementKind = "error" | "divergence" | "convention" | null;
type MistakeKey = "skipComputation" | "improviseSignificators" | "flattenDisagreement";

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
  kind: StepKind;
  detail: string;
}

const STEPS: StepData[] = [
  { title: "1. Active daśā period", kind: "independent", detail: "Any relevant Tier-2 module's dasha-selection method." },
  { title: "2. Transit triggers", kind: "independent", detail: "Chapter 2 methods: sign-changes, stations, nodal-axis shifts." },
  { title: "3. Domain significators", kind: "specific", detail: "House(s), lord(s), kāraka(s) from the relevant domain module." },
  { title: "4. Hierarchy test", kind: "specific", detail: "T2-01 1.1.4's 3-category test against those significators." },
  { title: "5. Vedha status", kind: "independent", detail: "Chapter 3 routine — domain-independent, computed once." },
  { title: "6. Ashtakavarga grade", kind: "independent", detail: "Chapter 4 routine — also domain-independent." },
  { title: "7. Convergence verdict", kind: "independent", detail: "Lesson 19.4.4's format, assembled once." },
  { title: "8. Precision + statement", kind: "independent", detail: "Lesson 19.5.1 and §4.6 client-statement format." },
];

const DOMAINS: Record<DomainKey, { label: string; module: string; houses: string; karakas: string }> = {
  marriage: { label: "Marriage", module: "T2-04 (M18)", houses: "7th", karakas: "Jupiter (gender-differentiated)" },
  career: { label: "Career", module: "T2-03", houses: "10th", karakas: "Sun, Saturn (profession set)" },
  health: { label: "Health", module: "T2-07", houses: "1st, 6th, 8th, 12th", karakas: "Saturn, Mars, 6th lord" },
  education: { label: "Education", module: "T2-08", houses: "4th, 5th, 9th", karakas: "Jupiter, Mercury" },
  property: { label: "Property", module: "T2-09", houses: "4th", karakas: "Mars" },
  travel: { label: "Travel / foreign residence", module: "T2-10", houses: "3rd, 9th, 12th", karakas: "Rāhu" },
  litigation: { label: "Litigation", module: "T2-11", houses: "6th", karakas: "Mars-Saturn dynamics" },
  wealth: { label: "Wealth", module: "T2-05", houses: "2nd, 11th", karakas: "Per T2-05's own treatment" },
};

const DISAGREEMENTS: { text: string; correct: DisagreementKind }[] = [
  {
    text: "T1-06 and T2-03 give different primary naisargika kārakas for the 10th house (Saturn vs Sun). Both are defensible framings of an unusually broad house.",
    correct: "convention",
  },
  {
    text: "The natal-vs-transit vedha-occupancy question in Chapter 3 produces two defensible readings; neither is an error.",
    correct: "divergence",
  },
  {
    text: "A source states Saturn is exalted in Libra when another module's own research shows that statement rested on a mistake.",
    correct: "error",
  },
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  skipComputation: {
    label: "Do not use the checklist to skip the hierarchy test",
    heldText: "Held: step 4 must be actually recomputed for each domain; the workflow organises, it does not replace, the work.",
    releasedText: "Warning: a strong window for one domain is never assumed strong for another.",
  },
  improviseSignificators: {
    label: "Consult the domain's own module, don't improvise significators",
    heldText: "Held: every domain's significators are sourced from its established curriculum module, even when they feel obvious.",
    releasedText: "Warning: an uncited, plausible-sounding significator choice is an unfounded claim.",
  },
  flattenDisagreement: {
    label: "Diagnose the kind of cross-module disagreement",
    heldText: "Held: factual errors, genuine multi-tradition divergences, and convention differences each need a different response.",
    releasedText: "Warning: flattening all disagreements into one category misrepresents what is actually going on.",
  },
};

function WorkflowSvg() {
  const rows = 4;
  const cols = 2;
  const w = 360;
  const h = 260;
  const padX = 32;
  const padY = 28;
  const cellW = (w - 2 * padX) / (cols - 1);
  const cellH = (h - 2 * padY) / (rows - 1);

  const pos = (i: number) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = padX + col * cellW;
    const y = padY + row * cellH;
    return { x, y };
  };

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} style={{ maxWidth: 420 }}>
      {STEPS.map((_, i) => {
        if (i === 0) return null;
        const p1 = pos(i - 1);
        const p2 = pos(i);
        return <line key={`line-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={HAIRLINE} strokeWidth={2} />;
      })}
      {STEPS.map((step, i) => {
        const p = pos(i);
        const color = step.kind === "independent" ? MOON : GOLD;
        return (
          <g key={step.title}>
            <circle cx={p.x} cy={p.y} r={18} fill={`${color}18`} stroke={color} strokeWidth={2} />
            <text x={p.x} y={p.y + 4} fontSize={10} fill={color} fontWeight={700} textAnchor="middle">{i + 1}</text>
            <text x={p.x} y={p.y + 32} fontSize={9} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">
              {step.title.replace(/^\d+\.\s*/, "")}
            </text>
            <text x={p.x} y={p.y + 46} fontSize={8} fill={INK_MUTED} textAnchor="middle">
              {step.kind === "independent" ? "reusable" : "per domain"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function TransitSynthesisUseCaseWorkbench() {
  const [domain, setDomain] = useState<DomainKey>("health");
  const [classifier, setClassifier] = useState<Record<number, StepKind | null>>(() => {
    const init: Record<number, StepKind | null> = {};
    STEPS.forEach((_, i) => { init[i] = null; });
    return init;
  });
  const [disagreements, setDisagreements] = useState<DisagreementKind[]>([null, null, null]);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    skipComputation: true,
    improviseSignificators: true,
    flattenDisagreement: true,
  });

  const d = DOMAINS[domain];
  const allClassifiersCorrect = STEPS.every((s, i) => classifier[i] === s.kind);
  const allDisagreementsCorrect = disagreements.every((v, i) => v === DISAGREEMENTS[i].correct);
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setDomain("health");
    const init: Record<number, StepKind | null> = {};
    STEPS.forEach((_, i) => { init[i] = null; });
    setClassifier(init);
    setDisagreements([null, null, null]);
    setMistakes({ skipComputation: true, improviseSignificators: true, flattenDisagreement: true });
  }

  function setStepClassifier(i: number, value: StepKind) {
    setClassifier((prev) => ({ ...prev, [i]: value }));
  }

  function setDisagreement(i: number, value: DisagreementKind) {
    setDisagreements((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  return (
    <div data-interactive="transit-synthesis-use-case-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Chapter 5</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Transit-synthesis use-case workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Generalise the T-D-V workflow across life domains and learn to spot which steps carry over and which must be redone.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Generalised workflow</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Eight steps: reusable vs per-domain
          </h3>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <WorkflowSvg />
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.55rem", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: MOON }} />
              <span style={{ color: INK_SECONDARY }}>Domain-independent</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: GOLD }} />
              <span style={{ color: INK_SECONDARY }}>Domain-specific</span>
            </div>
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Domain module lookup</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Pick a life-domain question
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.45rem", marginTop: "0.65rem" }}>
            {(Object.keys(DOMAINS) as DomainKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={domain === key} onClick={() => setDomain(key)} style={smallChipStyle(domain === key, PURPLE)}>
                {DOMAINS[key].label}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: `${PURPLE}10`,
              border: `1px solid ${PURPLE}55`,
              color: INK_PRIMARY,
              lineHeight: 1.55,
            }}
          >
            <div><span style={{ color: PURPLE, fontWeight: 600 }}>Source module:</span> {d.module}</div>
            <div style={{ marginTop: "0.35rem" }}><span style={{ color: PURPLE, fontWeight: 600 }}>Houses:</span> {d.houses}</div>
            <div style={{ marginTop: "0.35rem" }}><span style={{ color: PURPLE, fontWeight: 600 }}>Kārakas:</span> {d.karakas}</div>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Step classifier</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Mark each step as reusable or per-domain
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
          {STEPS.map((step, i) => {
            const chosen = classifier[i];
            const correct = chosen === step.kind;
            return (
              <div key={i} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${chosen ? (correct ? GREEN : VERMILION) : HAIRLINE}`, background: chosen ? (correct ? `${GREEN}08` : `${VERMILION}08`) : SURFACE }}>
                <div style={{ color: INK_PRIMARY, fontWeight: 600, fontSize: "0.95rem" }}>{step.title}</div>
                <div style={{ color: INK_SECONDARY, fontSize: "0.85rem", marginTop: "0.3rem", lineHeight: 1.5 }}>{step.detail}</div>
                <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.55rem" }}>
                  <button type="button" aria-pressed={chosen === "independent"} onClick={() => setStepClassifier(i, "independent")} style={smallChipStyle(chosen === "independent", MOON)}>
                    Reusable
                  </button>
                  <button type="button" aria-pressed={chosen === "specific"} onClick={() => setStepClassifier(i, "specific")} style={smallChipStyle(chosen === "specific", GOLD)}>
                    Per domain
                  </button>
                </div>
                {chosen && (
                  <div style={{ marginTop: "0.45rem", color: correct ? GREEN : VERMILION, fontSize: "0.85rem", fontWeight: 600 }}>
                    {correct ? "Correct" : "Check again — what does this step actually depend on?"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            padding: "0.55rem 0.75rem",
            borderRadius: 8,
            background: allClassifiersCorrect ? `${GREEN}12` : `${GOLD}12`,
            border: `1px solid ${allClassifiersCorrect ? GREEN : GOLD}55`,
            color: allClassifiersCorrect ? GREEN : GOLD,
            fontWeight: 600,
          }}
        >
          {allClassifiersCorrect
            ? "All steps classified correctly. Six are reusable; only steps 3 and 4 must be redone per domain."
            : "Some steps are still classified incorrectly. Use the feedback on each card."}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Cross-module disagreement classifier</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          What kind of disagreement is this?
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0.75rem", marginTop: "0.75rem" }}>
          {DISAGREEMENTS.map((item, i) => {
            const chosen = disagreements[i];
            const correct = chosen === item.correct;
            return (
              <div key={i} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${chosen ? (correct ? GREEN : VERMILION) : HAIRLINE}`, background: chosen ? (correct ? `${GREEN}08` : `${VERMILION}08`) : SURFACE }}>
                <div style={{ color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>{item.text}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.35rem", marginTop: "0.55rem" }}>
                  <button type="button" aria-pressed={chosen === "error"} onClick={() => setDisagreement(i, "error")} style={smallChipStyle(chosen === "error", VERMILION)}>
                    Factual error
                  </button>
                  <button type="button" aria-pressed={chosen === "divergence"} onClick={() => setDisagreement(i, "divergence")} style={smallChipStyle(chosen === "divergence", PURPLE)}>
                    Multi-tradition
                  </button>
                  <button type="button" aria-pressed={chosen === "convention"} onClick={() => setDisagreement(i, "convention")} style={smallChipStyle(chosen === "convention", GOLD)}>
                    Convention
                  </button>
                </div>
                {chosen && (
                  <div style={{ marginTop: "0.45rem", color: correct ? GREEN : VERMILION, fontSize: "0.85rem", fontWeight: 600 }}>
                    {correct ? "Correct category" : "Try the other category — consider whether one side is wrong, both are valid, or the house is unusually broad."}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            padding: "0.55rem 0.75rem",
            borderRadius: 8,
            background: allDisagreementsCorrect ? `${GREEN}12` : `${GOLD}12`,
            border: `1px solid ${allDisagreementsCorrect ? GREEN : GOLD}55`,
            color: allDisagreementsCorrect ? GREEN : GOLD,
            fontWeight: 600,
          }}
        >
          {allDisagreementsCorrect
            ? "All disagreement categories identified correctly."
            : "Some categories are still incorrect. Use the feedback on each card."}
        </div>
      </section>

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
            ? "All discipline commitments are held. The workflow generalises; the verdict does not."
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
