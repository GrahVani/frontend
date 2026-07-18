"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type FailureKey = "noDashaVedha" | "noPosition" | "noVedha" | "noStrength" | "noDomain";
type MistakeKey = "accuracyClaim" | "dismissConcern" | "mandatoryDepth";

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

interface FailureItem {
  key: FailureKey;
  label: string;
  detail: string;
}

const FAILURES: FailureItem[] = [
  { key: "noDashaVedha", label: "T without D and V", detail: "No daśā context and no vedha check — a bare transit treated as the whole analysis." },
  { key: "noPosition", label: "No position-from-Moon", detail: "'In your sign' collapses twelve different classical readings into one undifferentiated verdict." },
  { key: "noVedha", label: "No vedha check", detail: "Even a favourable transit can be obstructed; even a difficult one can be tempered." },
  { key: "noStrength", label: "No strength grading", detail: "The same placement lands with different force depending on the chart's own bindu support." },
  { key: "noDomain", label: "Domain-blind", detail: "'Expect hardship' never says in what, relative to which significators." },
];

const CHAPTERS = [
  { title: "Chapter 1", added: "T-D-V model + three failure modes" },
  { title: "Chapter 2", added: "Trigger identification at depth + factual-error correction" },
  { title: "Chapter 3", added: "Vedha integration + disclosed-default open question" },
  { title: "Chapter 4", added: "Ashtakavarga grading + structural vs contingent gaps" },
  { title: "Chapter 5", added: "Precision ceiling + cross-domain generalisation" },
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  accuracyClaim: {
    label: "The bar is discipline, not tested superior accuracy",
    heldText: "Held: this curriculum has not tested predictive accuracy against outcomes; the bar is disclosure and precision-matching.",
    releasedText: "Warning: reading the module as a proof of greater accuracy misrepresents its actual claim.",
  },
  dismissConcern: {
    label: "Engage a client's pop-astrology concern, don't dismiss it",
    heldText: "Held: validate the underlying instinct while precisely naming what the generic claim is missing.",
    releasedText: "Warning: rejection without explanation forfeits the chance to teach the discipline.",
  },
  mandatoryDepth: {
    label: "Depth scales to stakes; discipline does not",
    heldText: "Held: a quick read can still name daśā context, flag vedha, and state a season rather than a date.",
    releasedText: "Warning: insisting on full 8-step depth for every question confuses rigour with scalability.",
  },
};

function LiteracyMeter({ count }: { count: number }) {
  const total = FAILURES.length;
  const pct = (count / total) * 100;
  return (
    <svg width="100%" height="40" viewBox="0 0 400 40" style={{ maxWidth: 480 }}>
      <rect x="0" y="10" width="400" height="20" rx="10" fill={`${VERMILION}18`} stroke={HAIRLINE} />
      <rect x="0" y="10" width={(pct / 100) * 400} height="20" rx={10} fill={pct === 100 ? GREEN : pct >= 60 ? GOLD : VERMILION} />
      <text x="200" y="25" fontSize="11" fill="#fff" fontWeight={600} textAnchor="middle">
        {count}/{total} checks applied
      </text>
    </svg>
  );
}

function ChapterArc({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const cx = 60;
  const gap = 70;

  return (
    <svg width="100%" height="100" viewBox="0 0 380 100" style={{ maxWidth: 420 }}>
      <line x1={cx} y1="50" x2={cx + (CHAPTERS.length - 1) * gap} y2="50" stroke={HAIRLINE} strokeWidth={2} />
      {CHAPTERS.map((c, i) => {
        const x = cx + i * gap;
        const isActive = i === active;
        return (
          <g key={c.title} style={{ cursor: "pointer" }} onClick={() => onSelect(i)}>
            <circle cx={x} cy="50" r={isActive ? 18 : 12} fill={isActive ? GOLD : "transparent"} stroke={isActive ? GOLD : HAIRLINE} strokeWidth={2} />
            <text x={x} y="55" fontSize={isActive ? 11 : 9} fill={isActive ? "#fff" : INK_MUTED} fontWeight={600} textAnchor="middle">
              {i + 1}
            </text>
            <text x={x} y="88" fontSize="9" fill={INK_MUTED} textAnchor="middle">
              {c.title}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function TransitSynthesisLiteracyBar() {
  const [checks, setChecks] = useState<Record<FailureKey, boolean>>({
    noDashaVedha: false,
    noPosition: false,
    noVedha: false,
    noStrength: false,
    noDomain: false,
  });
  const [activeChapter, setActiveChapter] = useState(0);
  const [depthMode, setDepthMode] = useState<"quick" | "full">("quick");
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    accuracyClaim: true,
    dismissConcern: true,
    mandatoryDepth: true,
  });

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setChecks({ noDashaVedha: false, noPosition: false, noVedha: false, noStrength: false, noDomain: false });
    setActiveChapter(0);
    setDepthMode("quick");
    setMistakes({ accuracyClaim: true, dismissConcern: true, mandatoryDepth: true });
  }

  function toggleCheck(key: FailureKey) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div data-interactive="transit-synthesis-literacy-bar" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Closing capstone</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Transit-synthesis literacy bar
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              See what separates T-D-V-literate practice from a generic pop-astrology transit claim, and trace the five-chapter arc that built the bar.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>The generic claim</p>
          <h3 style={{ margin: "0.15rem 0 0", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
            &ldquo;Saturn is transiting your sign — expect hardship.&rdquo;
          </h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            This is the reference pop-astrology claim. Click each missing check below to see how far it is from a T-D-V-literate statement.
          </p>
          <div style={{ marginTop: "0.85rem" }}>
            <LiteracyMeter count={checkedCount} />
          </div>
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: checkedCount === 5 ? `${GREEN}12` : `${GOLD}12`,
              border: `1px solid ${checkedCount === 5 ? GREEN : GOLD}55`,
              color: checkedCount === 5 ? GREEN : GOLD,
              fontWeight: 600,
            }}
          >
            {checkedCount === 5
              ? "All five literacy checks applied. The claim is now framed as a T-D-V-literate, domain-specific, precision-matched statement."
              : `${5 - checkedCount} check(s) still missing. A generic claim cannot stand without them.`}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>The five checks</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            What the generic claim skips
          </h3>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            {FAILURES.map((f) => {
              const checked = checks[f.key];
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={checked}
                  onClick={() => toggleCheck(f.key)}
                  style={togglePanelStyle(checked, checked ? GREEN : VERMILION)}
                >
                  {checked ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
                  <span>
                    <span style={{ fontWeight: 600 }}>{f.label}</span>
                    <span style={{ color: checked ? INK_SECONDARY : VERMILION }}> — {f.detail}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Module arc</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          What each chapter added to the literacy bar
        </h3>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
          <ChapterArc active={activeChapter} onSelect={setActiveChapter} />
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.85rem",
            borderRadius: 8,
            background: `${GOLD}10`,
            border: `1px solid ${GOLD}55`,
            color: INK_PRIMARY,
            lineHeight: 1.55,
          }}
        >
          <span style={{ color: GOLD, fontWeight: 600 }}>{CHAPTERS[activeChapter].title}:</span>{" "}
          {CHAPTERS[activeChapter].added}.
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Depth vs discipline</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Scale the depth, keep the discipline
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.55rem" }}>
          <button type="button" aria-pressed={depthMode === "quick"} onClick={() => setDepthMode("quick")} style={buttonStyle(depthMode === "quick", MOON)}>
            Quick T-D-V-literate read
          </button>
          <button type="button" aria-pressed={depthMode === "full"} onClick={() => setDepthMode("full")} style={buttonStyle(depthMode === "full", PURPLE)}>
            Full 8-step analysis
          </button>
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            padding: "0.75rem",
            borderRadius: 8,
            background: depthMode === "quick" ? `${MOON}10` : `${PURPLE}10`,
            border: `1px solid ${depthMode === "quick" ? MOON : PURPLE}55`,
            color: INK_SECONDARY,
            lineHeight: 1.55,
          }}
        >
          {depthMode === "quick"
            ? "A quick read still names the daśā context, flags whether vedha is a live question, and states a season rather than a date. Discipline is preserved; only depth is scaled back."
            : "A full analysis adds trigger identification, hierarchy testing, full vedha and Ashtakavarga grading, convergence verdict, and precision calibration. Both modes share the same underlying discipline."}
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
            ? "All discipline commitments are held. The literacy bar is about honesty under complexity, not proven accuracy."
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
