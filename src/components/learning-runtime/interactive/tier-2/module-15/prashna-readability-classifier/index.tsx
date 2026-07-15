"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type VerdictKey = "readable" | "unreadable" | "investigate";
type CategoryKey = "1" | "2" | "3" | "4" | "5" | null;

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const PURPLE = "#6B5AA8";

const PROPERTIES = [
  { key: "bounded", label: "Bounded", description: "A specific matter with a discoverable endpoint." },
  { key: "specific", label: "Specific", description: "Maps onto a house or house-set the tradition knows how to read." },
  { key: "genuine", label: "Genuine", description: "Sincerely and spontaneously asked, not rehearsed or repeated." },
  { key: "actionable", label: "Actionable", description: "The querent could act differently depending on the answer." },
];

const CATEGORIES: { key: CategoryKey; label: string; color: string; description: string }[] = [
  { key: "1", label: "Category 1 — Indefinite future", color: BLUE, description: "Fails boundedness (e.g. 'will I ever...')." },
  { key: "2", label: "Category 2 — Poorly-defined matter", color: PURPLE, description: "Fails specificity (e.g. 'am I happy?')." },
  { key: "3", label: "Category 3 — Non-consenting third party", color: VERMILION, description: "Fails consent; T2-14 doctrine applies." },
  { key: "4", label: "Category 4 — Death date/manner", color: VERMILION, description: "Fails do-no-harm; redirect instead." },
  { key: "5", label: "Category 5 — Stacked/compound", color: GOLD, description: "Fails boundedness and specificity; unbundle." },
];

interface Scenario {
  id: string;
  question: string;
  verdict: VerdictKey;
  category: CategoryKey;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "job-app",
    question: "Will my job application, submitted this week, be accepted within the next two months?",
    verdict: "readable",
    category: null,
    explanation: "Bounded (this application, two-month window), specific (job house-set), genuine (assumed), actionable (search strategy can adjust).",
  },
  {
    id: "true-love",
    question: "Will I ever find true love?",
    verdict: "unreadable",
    category: "1",
    explanation: "Fails boundedness: 'ever' has no endpoint. Reformulate to a definite window.",
  },
  {
    id: "partner-leave",
    question: "Is my business partner secretly planning to leave the company?",
    verdict: "unreadable",
    category: "3",
    explanation: "A non-consenting third party's private intention. At most Tier C/general tendency; intrusive private reading is declined.",
  },
  {
    id: "job-children-parents",
    question: "Should I take the new job — and if I do, will my children adjust, and will my parents' health hold up?",
    verdict: "unreadable",
    category: "5",
    explanation: "Three stacked questions wearing one sentence. Unbundle into separate praśna questions.",
  },
  {
    id: "passport",
    question: "I think I left my passport at the hotel three nights ago — where is it?",
    verdict: "investigate",
    category: null,
    explanation: "Ordinary investigation (a phone call) should be tried first. Only if that fails does it become a legitimate lost-object praśna.",
  },
  {
    id: "grandfather-death",
    question: "What is the exact date my grandfather, who is gravely ill, will pass away?",
    verdict: "unreadable",
    category: "4",
    explanation: "Fails do-no-harm. Redirect toward supportive guidance and appropriate referral, not a chart-derived date.",
  },
  {
    id: "sister-surgery",
    question: "Will the surgery my sister is having next week go well?",
    verdict: "readable",
    category: null,
    explanation: "Readable with a Category 3 consent cap: the subject is the sister, so depth is limited, and the answer concerns the querent's own concern rather than a medical verdict.",
  },
];

export function PrashnaReadabilityClassifier() {
  const [answers, setAnswers] = useState<Record<string, { verdict: VerdictKey | null; category: CategoryKey }>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const setVerdict = (id: string, verdict: VerdictKey) => {
    setAnswers((prev) => ({ ...prev, [id]: { verdict, category: prev[id]?.category ?? null } }));
    setShowFeedback(false);
  };

  const setCategory = (id: string, category: CategoryKey) => {
    setAnswers((prev) => ({ ...prev, [id]: { verdict: prev[id]?.verdict ?? null, category } }));
    setShowFeedback(false);
  };

  const reset = () => {
    setAnswers({});
    setShowFeedback(false);
  };

  const answeredCount = SCENARIOS.filter((s) => {
    const a = answers[s.id];
    if (!a) return false;
    if (a.verdict === "unreadable") return a.category !== null;
    return a.verdict !== null;
  }).length;

  const allAnswered = answeredCount === SCENARIOS.length;
  const allCorrect = allAnswered && SCENARIOS.every((s) => {
    const a = answers[s.id];
    if (!a) return false;
    return a.verdict === s.verdict && (s.verdict !== "unreadable" || a.category === s.category);
  });

  return (
    <div data-interactive="prashna-readability-classifier" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Praśna readability classifier</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Sort questions before fixing a moment
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              A readable question is bounded, specific, genuine, and actionable. Unreadable questions fail one or more of these — or cross an ethical line.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Flow diagram + reference */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <p style={eyebrowStyle}>Decision flow</p>
          <ReadabilityFlowSvg />
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <section style={{ ...cardStyle, borderColor: GREEN }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.55rem" }}>
              <CheckCircle2 size={18} style={{ color: GREEN }} />
              <p style={{ margin: 0, color: GREEN, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Readable properties</p>
            </div>
            <div style={{ display: "grid", gap: "0.4rem" }}>
              {PROPERTIES.map((p) => (
                <div key={p.key} style={{ padding: "0.45rem", borderRadius: 6, background: `${GREEN}08`, border: `1px solid ${GREEN}` }}>
                  <span style={{ color: GREEN, fontWeight: 600, fontSize: "0.85rem" }}>{p.label}</span>
                  <p style={{ margin: "0.15rem 0 0", color: INK_SECONDARY, fontSize: "0.78rem" }}>{p.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ ...cardStyle, borderColor: VERMILION }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.55rem" }}>
              <XCircle size={18} style={{ color: VERMILION }} />
              <p style={{ margin: 0, color: VERMILION, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Unreadable categories</p>
            </div>
            <div style={{ display: "grid", gap: "0.4rem" }}>
              {CATEGORIES.map((c) => (
                <div key={c.key} style={{ padding: "0.45rem", borderRadius: 6, background: `${c.color}08`, border: `1px solid ${c.color}` }}>
                  <span style={{ color: c.color, fontWeight: 600, fontSize: "0.8rem" }}>{c.label}</span>
                  <p style={{ margin: "0.15rem 0 0", color: INK_SECONDARY, fontSize: "0.75rem" }}>{c.description}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>

      {/* Scenario classifier */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Scenario classifier</p>
            <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem" }}>
              Decide each question&apos;s status
            </h3>
          </div>
          <span style={{ color: INK_MUTED, fontSize: "0.85rem", fontWeight: 600 }}>
            {answeredCount} / {SCENARIOS.length}
          </span>
        </div>

        <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.65rem" }}>
          {SCENARIOS.map((scenario) => {
            const answer = answers[scenario.id];
            const isAnswered = answer?.verdict && (answer.verdict !== "unreadable" || answer.category !== null);
            const showThisFeedback = showFeedback && isAnswered;
            const isCorrect = showThisFeedback && answer.verdict === scenario.verdict && (scenario.verdict !== "unreadable" || answer.category === scenario.category);
            return (
              <div key={scenario.id} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${showThisFeedback ? (isCorrect ? GREEN : VERMILION) : HAIRLINE}`, background: showThisFeedback ? (isCorrect ? `${GREEN}08` : `${VERMILION}08`) : SURFACE }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", alignItems: "start" }}>
                  <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.9rem", lineHeight: 1.55 }}>{scenario.question}</p>
                  {showThisFeedback && (isCorrect ? <BadgeCheck size={18} style={{ color: GREEN, flexShrink: 0 }} /> : <AlertTriangle size={18} style={{ color: VERMILION, flexShrink: 0 }} />)}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.55rem" }}>
                  <button type="button" aria-pressed={answer?.verdict === "readable"} onClick={() => setVerdict(scenario.id, "readable")} style={smallChipStyle(answer?.verdict === "readable", GREEN)}>
                    Readable
                  </button>
                  <button type="button" aria-pressed={answer?.verdict === "unreadable"} onClick={() => setVerdict(scenario.id, "unreadable")} style={smallChipStyle(answer?.verdict === "unreadable", VERMILION)}>
                    Unreadable
                  </button>
                  <button type="button" aria-pressed={answer?.verdict === "investigate"} onClick={() => setVerdict(scenario.id, "investigate")} style={smallChipStyle(answer?.verdict === "investigate", GOLD)}>
                    Investigate first
                  </button>
                </div>
                {answer?.verdict === "unreadable" && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.45rem" }}>
                    {CATEGORIES.map((c) => (
                      <button key={c.key} type="button" aria-pressed={answer.category === c.key} onClick={() => setCategory(scenario.id, c.key)} style={smallChipStyle(answer.category === c.key, c.color)}>
                        {c.key}
                      </button>
                    ))}
                  </div>
                )}
                {showThisFeedback && (
                  <div style={{ marginTop: "0.55rem", color: isCorrect ? GREEN : VERMILION, fontSize: "0.85rem", lineHeight: 1.55 }}>
                    {scenario.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button type="button" onClick={() => setShowFeedback(true)} style={{ ...buttonStyle(false, BLUE), marginTop: "0.75rem" }}>
          <ShieldCheck size={15} aria-hidden="true" />
          Check classifications
        </button>

        {showFeedback && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: allCorrect ? `${GREEN}10` : `${VERMILION}10`, border: `1px solid ${allCorrect ? GREEN : VERMILION}`, color: allCorrect ? GREEN : VERMILION, fontSize: "0.9rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {allCorrect ? <BadgeCheck size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
              <span style={{ fontWeight: 600 }}>{allCorrect ? "All classifications match the readability framework." : "Some classifications need correction — review the feedback above."}</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ReadabilityFlowSvg() {
  return (
    <svg viewBox="0 0 560 220" role="img" aria-label="Praśna readability decision flow: check four properties, then readable, unreadable by category, or investigate first" style={{ width: "100%", maxHeight: 280, margin: "0.4rem auto 0", display: "block" }}>
      <rect x="12" y="12" width="536" height="196" rx="8" fill={`${ACCENT}08`} stroke={HAIRLINE} />

      {/* Start */}
      <rect x="220" y="24" width="120" height="32" rx="6" fill={SURFACE} stroke={INK_MUTED} />
      <text x="280" y="45" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>Question arrives</text>

      {/* Four properties */}
      {[
        { label: "Bounded", x: 80 },
        { label: "Specific", x: 190 },
        { label: "Genuine", x: 300 },
        { label: "Actionable", x: 410 },
      ].map((p) => (
        <g key={p.label}>
          <rect x={p.x - 40} y="78" width="80" height="28" rx="6" fill={`${GREEN}10`} stroke={GREEN} />
          <text x={p.x} y="97" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight={600}>{p.label}</text>
        </g>
      ))}

      <line x1="280" y1="56" x2="280" y2="70" stroke={HAIRLINE} strokeWidth="2" />
      <line x1="80" y1="70" x2="410" y2="70" stroke={HAIRLINE} strokeWidth="2" />
      {["80", "190", "300", "410"].map((x) => (
        <line key={x} x1={x} y1="70" x2={x} y2="78" stroke={HAIRLINE} strokeWidth="2" />
      ))}

      {/* Readable branch */}
      <rect x="60" y="138" width="100" height="36" rx="6" fill={`${GREEN}10`} stroke={GREEN} />
      <text x="110" y="155" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight={700}>All four yes</text>
      <text x="110" y="168" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Readable</text>
      <line x1="110" y1="106" x2="110" y2="138" stroke={GREEN} strokeWidth="2" />

      {/* Investigate branch */}
      <rect x="230" y="138" width="100" height="36" rx="6" fill={`${GOLD}10`} stroke={GOLD} />
      <text x="280" y="155" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight={700}>Ordinary check first</text>
      <text x="280" y="168" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Investigate</text>
      <line x1="280" y1="106" x2="280" y2="138" stroke={GOLD} strokeWidth="2" />

      {/* Unreadable branch */}
      <rect x="400" y="138" width="100" height="36" rx="6" fill={`${VERMILION}10`} stroke={VERMILION} />
      <text x="450" y="155" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight={700}>Any property no</text>
      <text x="450" y="168" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Unreadable</text>
      <line x1="450" y1="106" x2="450" y2="138" stroke={VERMILION} strokeWidth="2" />
    </svg>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

function buttonStyle(primary: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${primary ? color : HAIRLINE}`,
    background: primary ? color : SURFACE,
    color: primary ? "#fff" : color,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.35rem 0.6rem",
    borderRadius: 999,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}12` : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
