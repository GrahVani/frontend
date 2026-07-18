"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type MistakeKey = "singleMethodEnough" | "overPrecision" | "forcedCommitment";

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

interface MethodConfig {
  number: number;
  name: string;
  claim: string;
  anchor: string;
  chapter: string;
}

const METHODS: MethodConfig[] = [
  { number: 1, name: "Events-based rectification", claim: "Which candidate time's daśā-antardaśā and lordship story best explains dated life events?", anchor: "Modern BTR literature; T1-10/T2-18 daśā fluency", chapter: "Chapter 2" },
  { number: 2, name: "Tattva-śuddhi", claim: "Does the elemental quality of the consultation or candidate moment cohere with the chart under test?", anchor: "T2-02 2.2.1 diagnostic use, extended here", chapter: "Chapter 3" },
  { number: 3, name: "KP Ruling Planets (RPP)", claim: "Does the candidate birth moment's five-role RP set cohere with documented life-events?", anchor: "T1-16 Chapter 5", chapter: "Chapter 4" },
  { number: 4, name: "Modern KP RPP refinement", claim: "A tightened, modern-institute variant of method 3, applied at finer resolution.", anchor: "Modern KP institutes", chapter: "Chapter 4" },
  { number: 5, name: "Praśna-derived rectification", claim: "Can a chart cast for the consultation moment help corroborate or narrow a candidate birth time?", anchor: "Disclosed extension of T2-15 Chapter 6", chapter: "Chapter 5" },
  { number: 6, name: "Nāḍiāṁśa method", claim: "A classical fine-division method selecting whichever candidate's fine chart best fits documented events.", anchor: "Classical Nāḍiāṁśa references — verification pending", chapter: "Chapter 5" },
  { number: 7, name: "Janma Tāra method", claim: "Does a candidate time's natal-nakṣatra tāra-bala pattern cohere with the documented life-pattern?", anchor: "Classical Janma Tāra references", chapter: "Chapter 5" },
];

const TRAPS = [
  { key: "single", label: "Single-method over-confidence", detail: "A clean events-based match is a lead, not a verdict." },
  { key: "precision", label: "Over-precision in output", detail: "Report only as finely as the underlying methods actually support." },
  { key: "forced", label: "Forced commitment", detail: "When methods disagree, 'inconclusive' is a legitimate professional output." },
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  singleMethodEnough: {
    label: "Do not treat a single clean method as sufficient",
    heldText: "Held: a candidate time is called rectified only when independent methods converge.",
    releasedText: "Warning: a plausible single-method match can be produced by more than one nearby candidate.",
  },
  overPrecision: {
    label: "Match reported precision to actual support",
    heldText: "Held: report the rectified time only as finely as the data and methods justify.",
    releasedText: "Warning: reporting to the second when only minute-level confidence exists is false precision.",
  },
  forcedCommitment: {
    label: "Allow an honest 'inconclusive' verdict",
    heldText: "Held: a forced low-confidence rectification infects every downstream reading with unreported error.",
    releasedText: "Warning: picking the best-looking candidate despite disagreement is worse than admitting uncertainty.",
  },
};

function MethodWheel({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) {
  const cx = 180;
  const cy = 180;
  const hubR = 46;
  const orbitR = 128;

  return (
    <svg width="100%" height="100%" viewBox="0 0 360 360" style={{ maxWidth: 360 }}>
      <circle cx={cx} cy={cy} r={hubR} fill={`${GOLD}18`} stroke={GOLD} strokeWidth={2} />
      <text x={cx} y={cy - 6} fontSize={11} fill={GOLD} fontWeight={700} textAnchor="middle">Triangulate</text>
      <text x={cx} y={cy + 10} fontSize={9} fill={INK_MUTED} textAnchor="middle">never one method</text>

      {METHODS.map((m, i) => {
        const angle = (i * 360) / METHODS.length - 90;
        const rad = (angle * Math.PI) / 180;
        const x = cx + orbitR * Math.cos(rad);
        const y = cy + orbitR * Math.sin(rad);
        const isSelected = i === selected;
        return (
          <g key={m.number} style={{ cursor: "pointer" }} onClick={() => onSelect(i)}>
            <line x1={cx + hubR * Math.cos(rad)} y1={cy + hubR * Math.sin(rad)} x2={x - 20 * Math.cos(rad)} y2={y - 20 * Math.sin(rad)} stroke={HAIRLINE} strokeWidth={1} />
            <circle cx={x} cy={y} r={22} fill={isSelected ? `${PURPLE}20` : `${MOON}10`} stroke={isSelected ? PURPLE : HAIRLINE} strokeWidth={2} />
            <text x={x} y={y + 4} fontSize={12} fill={isSelected ? PURPLE : INK_MUTED} fontWeight={700} textAnchor="middle">{m.number}</text>
            <text x={x} y={y + 38} fontSize={9} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle" style={{ maxWidth: 80 }}>{m.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function SevenMethodBtrExplorer() {
  const [selected, setSelected] = useState(0);
  const [traps, setTraps] = useState<Record<string, boolean>>({ single: true, precision: true, forced: true });
  const [scenario, setScenario] = useState<"yes" | "no" | null>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    singleMethodEnough: true,
    overPrecision: true,
    forcedCommitment: true,
  });

  const method = METHODS[selected];
  const allTrapsHeld = Object.values(traps).every(Boolean);
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setSelected(0);
    setTraps({ single: true, precision: true, forced: true });
    setScenario(null);
    setMistakes({ singleMethodEnough: true, overPrecision: true, forcedCommitment: true });
  }

  return (
    <div data-interactive="btr-protocol-overview-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 20 · Chapter 1</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Seven-method BTR explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Meet the seven Birth Time Rectification methods and the triangulation discipline that prevents trusting any one of them alone.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>The seven methods</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Click a method to inspect it
          </h3>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "0.75rem" }}>
            <MethodWheel selected={selected} onSelect={setSelected} />
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Method detail</p>
          <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
            {method.number}. {method.name}
          </h3>
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.85rem",
              borderRadius: 8,
              background: `${PURPLE}10`,
              border: `1px solid ${PURPLE}55`,
              color: INK_PRIMARY,
              lineHeight: 1.55,
            }}
          >
            <span style={{ color: PURPLE, fontWeight: 600 }}>Claim:</span>{" "}{method.claim}
          </div>
          <div style={{ marginTop: "0.55rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            <span style={{ color: INK_MUTED, fontWeight: 600 }}>Primary anchor:</span>{" "}{method.anchor}
          </div>
          <div style={{ marginTop: "0.35rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            <span style={{ color: INK_MUTED, fontWeight: 600 }}>Developed in:</span>{" "}{method.chapter}
          </div>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Triangulation discipline</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Three safeguards to hold
          </h3>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            {TRAPS.map((t) => {
              const held = traps[t.key];
              return (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={held}
                  onClick={() => setTraps((prev) => ({ ...prev, [t.key]: !prev[t.key] }))}
                  style={togglePanelStyle(held, held ? GREEN : VERMILION)}
                >
                  {held ? <CheckCircle2 size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
                  <span>
                    <span style={{ fontWeight: 600 }}>{t.label}</span>
                    <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? t.detail : "Safeguard released — this trap is now unguarded."}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.55rem 0.75rem",
              borderRadius: 8,
              background: allTrapsHeld ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${allTrapsHeld ? GREEN : VERMILION}55`,
              color: allTrapsHeld ? GREEN : VERMILION,
              fontWeight: 600,
            }}
          >
            {allTrapsHeld
              ? "All triangulation safeguards held. A candidate time needs independent convergence before it can be called rectified."
              : `${TRAPS.length - Object.values(traps).filter(Boolean).length} safeguard(s) released. Review the warnings above.`}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Vikram&apos;s case</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Approximate birth time, three candidates
          </h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            Family recall: &ldquo;around sunrise, roughly 6am.&rdquo; Honest window: <strong>05:45–06:15</strong>.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.55rem", marginTop: "0.75rem" }}>
            {["05:48", "06:00", "06:12"].map((t, i) => (
              <div key={t} style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, textAlign: "center", background: SURFACE }}>
                <div style={{ color: PURPLE, fontWeight: 600, fontSize: "1.1rem" }}>{t}</div>
                <div style={{ color: INK_MUTED, fontSize: "0.8rem", marginTop: "0.25rem" }}>
                  {i === 0 ? "before sunrise" : "after sunrise"}
                </div>
              </div>
            ))}
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>
            Even this 30-minute spread can move the Lagna enough to change rising sign in some cases. Which candidate the evidence supports is Chapter 2&apos;s question.
          </p>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Triangulation check</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Is one clean events-based match enough?
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Events-based rectification finds that 06:00 explains both a documented marriage and a documented career change cleanly, while 05:48 and 06:12 explain them less well.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.65rem" }}>
          <button type="button" aria-pressed={scenario === "yes"} onClick={() => setScenario("yes")} style={buttonStyle(scenario === "yes", VERMILION)}>
            Yes — declare 06:00 rectified
          </button>
          <button type="button" aria-pressed={scenario === "no"} onClick={() => setScenario("no")} style={buttonStyle(scenario === "no", GREEN)}>
            No — it is only a lead
          </button>
        </div>
        {scenario && (
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: scenario === "no" ? `${GREEN}12` : `${VERMILION}12`,
              border: `1px solid ${scenario === "no" ? GREEN : VERMILION}55`,
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            {scenario === "no"
              ? "Correct. A single clean method is where triangulation starts, not where it ends. Independent methods — KP RPP, Tattva-śuddhi, D60 sensitivity — must also converge on 06:00 before it can be called rectified."
              : "Incorrect. A nearby candidate may explain the same coarse events almost as well once other data is considered. Single-method over-confidence is triangulation trap #1."}
          </div>
        )}
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
            ? "All discipline commitments are held. BTR proceeds by triangulation, with proportionate precision and honest inconclusiveness when needed."
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
