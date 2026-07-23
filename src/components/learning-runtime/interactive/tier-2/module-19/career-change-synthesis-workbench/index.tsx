"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type Domain = "marriage" | "career";
type ClassifierKey = "cat1" | "vedha" | "ashtakavarga" | "cat2" | "cat3";
type ClassifierValue = "general" | "specific";
type MistakeKey = "wrongSignificators" | "karakaDiscrepancy" | "recomputeGeneral" | "sameBecauseStrong";

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

const COMPARISON_ROWS = [
  {
    label: "Category 2 target",
    marriage: "Split: 7th-lord's natal sign (Libra) hit twice; 7th-house sign (Capricorn) untouched.",
    career: "Collapsed: one point (Aries), hit once cleanly — 10th house and 10th lord coincide.",
  },
  {
    label: "Category 3 kāraka coverage",
    marriage: "Jupiter (the kāraka) untouched — a disclosed gap.",
    career: "Both candidate kārakas (Sun, Saturn) touched — no gap.",
  },
  {
    label: "Vedha / Ashtakavarga (Trigger 1)",
    marriage: "Contested / BAV≈6, SAV≈27 — unchanged.",
    career: "Same, unchanged — domain-independent.",
  },
  {
    label: "Center of gravity",
    marriage: "Jupiter-centred (AD lord = kāraka).",
    career: "Saturn-centred (self-return + two special aspects landing on career points).",
  },
];

const CLASSIFIER_ITEMS: Record<ClassifierKey, { label: string; correct: ClassifierValue; detail: string }> = {
  cat1: { label: "Category 1 — MD/AD lords' natal positions", correct: "general", detail: "Tests whether the period itself is active, regardless of the question." },
  vedha: { label: "Vedha status", correct: "general", detail: "Grades whether the transit is obstructed, not what it is about." },
  ashtakavarga: { label: "Ashtakavarga grade", correct: "general", detail: "Grades the transit's own bindu-strength, not its domain relevance." },
  cat2: { label: "Category 2 — house and lord touched", correct: "specific", detail: "Depends on which house/lord the question asks about." },
  cat3: { label: "Category 3 — kāraka touched", correct: "specific", detail: "Depends on which kāraka the question's domain uses." },
};

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  wrongSignificators: {
    label: "Use the new domain's own significators",
    heldText: "Held: career uses 10th house/lord, Sun, Saturn — not the marriage reading's 7th house and Jupiter.",
    releasedText: "Warning: relabeling marriage significators as career produces a confident-sounding but meaningless result.",
  },
  karakaDiscrepancy: {
    label: "Disclose the T1-06 / T2-03 kāraka difference as a convention choice",
    heldText: "Held: both sources are real and defensible; this lesson follows T2-03 and says so.",
    releasedText: "Warning: treating a convention difference as a factual error misrepresents the source landscape.",
  },
  recomputeGeneral: {
    label: "Do not re-compute domain-independent findings",
    heldText: "Held: vedha and Ashtakavarga grade the transit itself; they carry over unchanged.",
    releasedText: "Warning: re-running them 'for career' duplicates work and suggests they are domain-specific.",
  },
  sameBecauseStrong: {
    label: "Do not stop at 'both readings are strong'",
    heldText: "Held: the point is the different mechanism (Jupiter-centred vs Saturn-centred), not the shared strength.",
    releasedText: "Warning: collapsing the comparison to 'both strong' misses why the window must be re-earned per domain.",
  },
};

function CareerSignificatorSvg() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 260" style={{ maxWidth: 420 }}>
      {/* Aries / 10th house-lord */}
      <circle cx="70" cy="130" r={36} fill={`${VERMILION}12`} stroke={VERMILION} strokeWidth={2} />
      <text x="70" y="126" fontSize="11" fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">Aries</text>
      <text x="70" y="142" fontSize="9" fill={INK_MUTED} textAnchor="middle">10th house + lord</text>

      {/* Cancer / Sun + Lagna */}
      <circle cx="180" cy="50" r={36} fill={`${GOLD}12`} stroke={GOLD} strokeWidth={2} />
      <text x="180" y="46" fontSize="11" fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">Cancer</text>
      <text x="180" y="62" fontSize="9" fill={INK_MUTED} textAnchor="middle">Sun / Lagna</text>

      {/* Libra / natal Saturn + transiting Saturn */}
      <circle cx="290" cy="130" r={42} fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth={2} />
      <text x="290" y="126" fontSize="11" fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">Libra</text>
      <text x="290" y="142" fontSize="9" fill={INK_MUTED} textAnchor="middle">natal Saturn + transit</text>

      {/* 7th aspect Libra → Aries */}
      <line x1="250" y1="130" x2="106" y2="130" stroke={PURPLE} strokeWidth={2} markerEnd="url(#arrowPurple)" />
      <text x="178" y="122" fontSize="9" fill={PURPLE} fontWeight={600} textAnchor="middle">7th aspect</text>

      {/* 10th aspect Libra → Cancer */}
      <path d="M 260 100 Q 220 70, 190 86" fill="none" stroke={PURPLE} strokeWidth={2} strokeDasharray="5 3" markerEnd="url(#arrowPurpleDashed)" />
      <text x="235" y="82" fontSize="9" fill={PURPLE} fontWeight={600} textAnchor="middle">10th aspect</text>

      <defs>
        <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={PURPLE} />
        </marker>
        <marker id="arrowPurpleDashed" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={PURPLE} />
        </marker>
      </defs>

      <text x="180" y="240" fontSize="10" fill={INK_MUTED} textAnchor="middle">
        Transiting Saturn in Libra touches all three career-relevant points through two different aspects.
      </text>
    </svg>
  );
}

export function CareerChangeSynthesisWorkbench() {
  const [domain, setDomain] = useState<Domain>("career");
  const [classifiers, setClassifiers] = useState<Record<ClassifierKey, ClassifierValue | null>>({
    cat1: "general",
    vedha: "general",
    ashtakavarga: "general",
    cat2: "specific",
    cat3: "specific",
  });
  const [relocationStep, setRelocationStep] = useState<"significators" | "hierarchy" | null>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    wrongSignificators: true,
    karakaDiscrepancy: true,
    recomputeGeneral: true,
    sameBecauseStrong: true,
  });

  const allClassifiersCorrect = (Object.keys(CLASSIFIER_ITEMS) as ClassifierKey[]).every(
    (key) => classifiers[key] === CLASSIFIER_ITEMS[key].correct
  );
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setDomain("career");
    setClassifiers({ cat1: "general", vedha: "general", ashtakavarga: "general", cat2: "specific", cat3: "specific" });
    setRelocationStep(null);
    setMistakes({ wrongSignificators: true, karakaDiscrepancy: true, recomputeGeneral: true, sameBecauseStrong: true });
  }

  function setClassifier(key: ClassifierKey, value: ClassifierValue) {
    setClassifiers((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div data-interactive="career-change-synthesis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Chapter 5</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Career-change synthesis workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Reframe the identical transit window through career significators, compare it with the marriage reading, and see which findings carry over unchanged.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Domain selector</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Same window, different question
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button type="button" aria-pressed={domain === "marriage"} onClick={() => setDomain("marriage")} style={buttonStyle(domain === "marriage", PURPLE)}>
            Marriage reading
          </button>
          <button type="button" aria-pressed={domain === "career"} onClick={() => setDomain("career")} style={buttonStyle(domain === "career", GREEN)}>
            Career reading
          </button>
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            borderRadius: 8,
            background: domain === "career" ? `${GREEN}10` : `${PURPLE}10`,
            border: `1px solid ${domain === "career" ? GREEN : PURPLE}55`,
            color: INK_SECONDARY,
            lineHeight: 1.55,
          }}
        >
          {domain === "career"
            ? "Career significators (T2-03): 10th house Aries, 10th lord Mars, Sun (karma-kāraka), Saturn (profession-kāraka). Saturn's transit is Saturn-centred."
            : "Marriage significators: 7th house Capricorn, 7th lord Saturn in Libra, Jupiter (marriage-kāraka). The reading is Jupiter-centred."}
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Comparison table</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Marriage vs career on one window
          </h3>
          <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
            <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Finding</th>
                  <th style={thStyle}>Marriage reading</th>
                  <th style={thStyle}>Career reading</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td style={tdStyle}>{row.label}</td>
                    <td style={{ ...tdStyle, color: domain === "marriage" ? INK_PRIMARY : INK_MUTED }}>{row.marriage}</td>
                    <td style={{ ...tdStyle, color: domain === "career" ? INK_PRIMARY : INK_MUTED }}>{row.career}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Career significator map</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>
            How Saturn connects the career points
          </h3>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <CareerSignificatorSvg />
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
            Saturn&apos;s 7th aspect hits Aries (10th house + lord). Its 10th aspect hits Cancer (Sun / Lagna). Saturn also conjoins its own natal place, touching the profession-kāraka set.
          </p>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>General vs specific classifier</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Which findings carry over unchanged?
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(CLASSIFIER_ITEMS) as ClassifierKey[]).map((key) => {
            const item = CLASSIFIER_ITEMS[key];
            const chosen = classifiers[key];
            const correct = chosen === item.correct;
            return (
              <div key={key} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${chosen ? (correct ? GREEN : VERMILION) : HAIRLINE}`, background: chosen ? (correct ? `${GREEN}08` : `${VERMILION}08`) : SURFACE }}>
                <div style={{ color: INK_PRIMARY, fontWeight: 600, fontSize: "0.95rem" }}>{item.label}</div>
                <div style={{ color: INK_SECONDARY, fontSize: "0.85rem", marginTop: "0.35rem", lineHeight: 1.5 }}>{item.detail}</div>
                <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.55rem" }}>
                  <button type="button" aria-pressed={chosen === "general"} onClick={() => setClassifier(key, "general")} style={smallChipStyle(chosen === "general", MOON)}>
                    Carries over
                  </button>
                  <button type="button" aria-pressed={chosen === "specific"} onClick={() => setClassifier(key, "specific")} style={smallChipStyle(chosen === "specific", GOLD)}>
                    Re-derive
                  </button>
                </div>
                {chosen && (
                  <div style={{ marginTop: "0.45rem", color: correct ? GREEN : VERMILION, fontSize: "0.85rem", fontWeight: 600 }}>
                    {correct ? "Correct" : "Try again — consider what the finding actually measures"}
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
            ? "All classifiers correct. You can tell which findings carry over and which must be re-derived."
            : "Some classifiers are still set incorrectly. Use the feedback on each card."}
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Third-question mini-scenario</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Relocation abroad — what is the first step?
          </h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            A client asks about relocation abroad during the same window. Before testing hierarchy-touch, what must come first?
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.65rem" }}>
            <button type="button" aria-pressed={relocationStep === "significators"} onClick={() => setRelocationStep("significators")} style={smallChipStyle(relocationStep === "significators", GREEN)}>
              Establish relocation significators
            </button>
            <button type="button" aria-pressed={relocationStep === "hierarchy"} onClick={() => setRelocationStep("hierarchy")} style={smallChipStyle(relocationStep === "hierarchy", VERMILION)}>
              Run hierarchy test immediately
            </button>
          </div>
          {relocationStep && (
            <div
              style={{
                marginTop: "0.65rem",
                padding: "0.75rem",
                borderRadius: 8,
                background: relocationStep === "significators" ? `${GREEN}12` : `${VERMILION}12`,
                border: `1px solid ${relocationStep === "significators" ? GREEN : VERMILION}55`,
                color: INK_SECONDARY,
                lineHeight: 1.55,
              }}
            >
              {relocationStep === "significators"
                ? "Correct. The 12th house (foreign residence), 9th house (long journeys), their lords, and relevant kārakas must be identified first — otherwise hierarchy testing uses the wrong targets."
                : "Incorrect. Testing hierarchy-touch before establishing the question's own significators would produce a confident-sounding but meaningless result."}
            </div>
          )}
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Career client statement</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>
            Scope-honest wording
          </h3>
          <div style={{ marginTop: "0.55rem", padding: "0.85rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}44`, color: INK_SECONDARY, lineHeight: 1.65 }}>
            Looking at the same major life-period through your career significators: Saturn — which governs disciplined, structured work — is both returning to a position of real strength and directly engaging both your career house and your public-standing significator at once, through two different classical aspect relationships. That&apos;s a coherent, multiply-reinforced signal. The same open technical question from the marriage reading applies here too, since it concerns the same Saturn transit. This looks like a genuinely well-supported window for a real shift, most concentrated in the same roughly 2-3 month settling period — worth watching as a season of change.
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
            ? "All discipline commitments are held. The window is re-earned through career significators, not copy-pasted."
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

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.55rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_MUTED,
  fontWeight: 700,
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle: CSSProperties = {
  padding: "0.55rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_SECONDARY,
  verticalAlign: "top",
};
