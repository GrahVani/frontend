/**
 * Jyotiṣa Citation Dojo — Lesson 2.1's §7 flagship interactive.
 *
 * Two-tab synthesis layer (constitution §10.1):
 *
 *   - Tab 1 "Dating Divergence Atlas" : lollipop-style viz showing per-text
 *                                       academic vs traditional dating, with
 *                                       the gap-years made visually explicit.
 *                                       Particularly stark for BPHS (4200-
 *                                       year gap) and Jaiminī Sūtras (3000-
 *                                       year gap) where lineage tradition
 *                                       claims pre-classical authorship and
 *                                       academic dating points medieval.
 *
 *   - Tab 2 "Citation Drill"          : five citation-discipline scenarios
 *                                       (3 adapted from L2.1 §6's Recognition
 *                                       cases, 2 invented for full coverage
 *                                       of the four citation-discipline
 *                                       moves). Tests L2.1's central skill.
 *
 * Distinct from §4's HistoricalTimeline (which is the per-author chronology
 * explorer). §7 = synthesise the dating-divergence problem + drill the
 * citation discipline.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Compass } from "lucide-react";
import {
  DIVERGENCE_POINTS,
  DRILL_SCENARIOS,
  FRAMEWORK_SUMMARY,
  type DrillScenario,
} from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const VERMILION = "#A23A1E";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const JADE = "#3A8C5A";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

type Tab = "divergence" | "drill";

export function JyotishaCitationDojo() {
  const [tab, setTab] = useState<Tab>("divergence");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{ padding: "20px 22px 22px" }}
      data-interactive="jyotisha-citation-dojo"
    >
      <div
        role="tablist"
        aria-label="Synthesis modes"
        style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}
      >
        <TabButton
          active={tab === "divergence"}
          onClick={() => setTab("divergence")}
          label="Dating Divergence Atlas"
          sublabel="see where traditional and academic chronologies disagree"
          icon={<Compass size={14} />}
        />
        <TabButton
          active={tab === "drill"}
          onClick={() => setTab("drill")}
          label="Citation Discipline Drill"
          sublabel="drill the four honest-citation moves"
          icon={<BookOpen size={14} />}
        />
      </div>

      {tab === "divergence" ? (
        <DivergenceView reducedMotion={reducedMotion} />
      ) : (
        <DrillView reducedMotion={reducedMotion} />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  sublabel,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="gl-clickable gl-focus-ring"
      style={{
        flex: "1 1 260px",
        padding: "10px 14px",
        background: active
          ? "linear-gradient(180deg, rgba(255, 248, 230, 0.96) 0%, rgba(252, 240, 210, 0.92) 100%)"
          : "rgba(255, 251, 240, 0.55)",
        border: active ? `1.5px solid ${GOLD}` : "1.5px solid rgba(156, 122, 47, 0.30)",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow: active
          ? `0 6px 14px ${GOLD}33, 0 1px 0 rgba(255,255,255,0.7) inset`
          : "0 1px 0 rgba(255,255,255,0.55) inset",
      }}
    >
      <span
        style={{
          width: "28px",
          height: "28px",
          flexShrink: 0,
          borderRadius: "50%",
          background: active ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)",
          color: active ? "#1A1408" : GOLD_DEEP,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "17px", fontWeight: 600, color: INK_PRIMARY }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "12.5px", color: INK_SECONDARY, marginTop: "2px" }}>
          {sublabel}
        </span>
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
 * TAB 1 — Dating Divergence Atlas (full-width manuscript plates)
 * ═══════════════════════════════════════════════════════════════════════ */

/** Per-text plate subtitles (presentation-only, not in data file). */
const PLATE_CONTEXT: Record<
  string,
  { plateNumeral: string; traditional: { label: string; context: string }; academic: { label: string; context: string } }
> = {
  "lagadha-vedanga-jyotisha": {
    plateNumeral: "Plate I",
    traditional: { label: "~1400-1200 BCE", context: "Late Vedic era — contemporaneous with the saṁhitās" },
    academic: { label: "~1200 to ~400 BCE", context: "Pingree's range — linguistic + astronomical-data analysis" },
  },
  "parashara-bphs": {
    plateNumeral: "Plate II",
    traditional: { label: "~3000 BCE", context: "Pre-classical Vedic ṛṣi — Mahābhārata-era figure" },
    academic: { label: "10th-14th c. CE", context: "Recensional form (Pingree) — core doctrine likely older" },
  },
  "jaimini-sutras": {
    plateNumeral: "Plate III",
    traditional: { label: "Pre-classical", context: "Maharṣi Jaiminī — contemporary of Parāśara within tradition" },
    academic: { label: "Classical-era composition", context: "Classical era — commentaries medieval" },
  },
};

function DivergenceView({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Section header */}
      <header style={{ padding: "0 4px" }}>
        <p
          className="uppercase"
          style={{
            color: GOLD,
            letterSpacing: "0.18em",
            fontWeight: 700,
            fontSize: "13px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
            marginBottom: "10px",
          }}
        >
          Where the chronologies disagree
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "16px",
            color: INK_PRIMARY,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Three texts where lineage tradition and academic-Indology disagree —
          sometimes by centuries, sometimes by millennia. The honest move is
          not to pick one chronology and dismiss the other; it is to cite
          both, and let the disagreement be visible.
        </p>
      </header>

      {/* Three manuscript plates */}
      {DIVERGENCE_POINTS.map((p) => {
        const ctx = PLATE_CONTEXT[p.slug];
        return (
          <article
            key={p.slug}
            style={{
              background: "linear-gradient(180deg, rgba(255, 249, 234, 0.92) 0%, rgba(252, 240, 210, 0.85) 100%)",
              border: `1px solid ${GOLD}55`,
              borderRadius: "14px",
              padding: "0",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 4px 12px rgba(74, 56, 24, 0.10), 0 1px 0 rgba(255,255,255,0.6) inset",
            }}
          >
            {/* Top gold-leaf strip */}
            <div
              aria-hidden
              style={{
                height: "3px",
                background: `linear-gradient(to right, transparent 4%, ${GOLD_LIGHT} 18%, ${GOLD} 50%, ${GOLD_LIGHT} 82%, transparent 96%)`,
              }}
            />

            {/* Plate header — numeral + author + text */}
            <div
              style={{
                padding: "18px 28px 14px",
                display: "flex",
                alignItems: "baseline",
                gap: "16px",
                flexWrap: "wrap",
                borderBottom: `1px dashed ${GOLD}55`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  fontSize: "14px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: GOLD_DEEP,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {ctx.plateNumeral}
              </span>
              <span aria-hidden style={{ flex: 1, height: "1px", background: `${GOLD}55`, maxWidth: "60px" }} />
              <h4
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: INK_PRIMARY,
                  lineHeight: 1.2,
                  margin: 0,
                  flex: 1,
                  minWidth: "200px",
                }}
              >
                {p.label}
              </h4>
            </div>

            {/* 3-column data section */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: "0",
                alignItems: "stretch",
                padding: "24px 28px",
                position: "relative",
              }}
            >
              {/* LEFT: TRADITIONAL */}
              <div
                style={{
                  paddingRight: "20px",
                  borderRight: `1px dashed ${INDIGO}44`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.20em",
                    color: INDIGO_DEEP,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                  }}
                >
                  Traditional dating
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "28px",
                    fontWeight: 600,
                    color: INDIGO_DEEP,
                    lineHeight: 1.15,
                    margin: 0,
                  }}
                >
                  {ctx.traditional.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "14px",
                    color: INK_SECONDARY,
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {ctx.traditional.context}
                </p>
              </div>

              {/* CENTER: GIANT GAP-YEARS */}
              <div
                style={{
                  padding: "0 28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  position: "relative",
                  minWidth: "180px",
                }}
              >
                {/* Diverging arrows decoration */}
                <div
                  aria-hidden
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: VERMILION,
                    fontSize: "16px",
                    opacity: 0.6,
                    marginBottom: "-2px",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>←</span>
                  <span style={{ width: "20px", height: "1px", background: VERMILION }} />
                  <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>→</span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "56px",
                    fontWeight: 600,
                    color: VERMILION,
                    lineHeight: 1,
                    margin: 0,
                    letterSpacing: "-0.02em",
                    textAlign: "center",
                    transition: reducedMotion ? "none" : "color 280ms ease",
                  }}
                >
                  {p.gapYears < 1000 ? `~${p.gapYears}` : `~${p.gapYears.toLocaleString()}`}
                </p>
                <p
                  className="uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.20em",
                    color: VERMILION,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    margin: 0,
                  }}
                >
                  years of disagreement
                </p>
              </div>

              {/* RIGHT: ACADEMIC */}
              <div
                style={{
                  paddingLeft: "20px",
                  borderLeft: `1px dashed ${VERMILION}44`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  alignItems: "flex-end",
                  textAlign: "right",
                }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.20em",
                    color: VERMILION,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                  }}
                >
                  Academic-Indology
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "28px",
                    fontWeight: 600,
                    color: VERMILION,
                    lineHeight: 1.15,
                    margin: 0,
                  }}
                >
                  {ctx.academic.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "14px",
                    color: INK_SECONDARY,
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {ctx.academic.context}
                </p>
              </div>
            </div>

            {/* Scholarly note */}
            <div
              style={{
                margin: "0 28px 22px",
                padding: "14px 18px",
                background: `${GOLD}10`,
                borderLeft: `3px solid ${GOLD}`,
                borderRadius: "0 8px 8px 0",
              }}
            >
              <p
                className="uppercase"
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "0.18em",
                  color: GOLD_DEEP,
                  fontWeight: 700,
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  marginBottom: "5px",
                }}
              >
                What the divergence means
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  fontSize: "15px",
                  color: INK_PRIMARY,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {p.note}
              </p>
            </div>
          </article>
        );
      })}

      {/* Framework summary callout */}
      <div
        style={{
          padding: "20px 24px",
          background: `linear-gradient(135deg, ${JADE}10 0%, ${GOLD}10 100%)`,
          border: `1px solid ${JADE}66`,
          borderRadius: "12px",
        }}
      >
        <p
          className="uppercase"
          style={{
            fontSize: "13px",
            letterSpacing: "0.20em",
            color: "#1F5A37",
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "10px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>✓</span> {FRAMEWORK_SUMMARY.headline}
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "15.5px",
            color: INK_PRIMARY,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {FRAMEWORK_SUMMARY.body}
        </p>
      </div>

      {/* Convergence note — about the other 9 texts */}
      <div
        style={{
          padding: "14px 20px",
          border: `1px dashed ${GOLD}55`,
          borderRadius: "10px",
          background: "rgba(255, 252, 240, 0.45)",
        }}
      >
        <p
          className="uppercase"
          style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: GOLD_DEEP,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "5px",
          }}
        >
          The other nine major texts
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "14px",
            color: INK_SECONDARY,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Sphujidhvaja, Varāhamihira, Kalyāṇavarmā, Mantreśvara, Vaidyanātha,
          Nīlakaṇṭha, Praśna Mārga, Lal Kitab, and KP — these nine have
          academic and traditional dating <em>largely converging</em>, so
          they aren&apos;t plated here. The three above are the disagreements
          that matter most for citation discipline.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
 * TAB 2 — Citation Discipline Drill (radio-select reveal)
 * ═══════════════════════════════════════════════════════════════════════ */

function DrillView({ reducedMotion }: { reducedMotion: boolean }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [pickedById, setPickedById] = useState<Record<string, string | null>>({});
  const [submittedById, setSubmittedById] = useState<Record<string, boolean>>({});

  const scenario = DRILL_SCENARIOS[scenarioIdx];
  const picked = pickedById[scenario.id] ?? null;
  const submitted = submittedById[scenario.id] ?? false;
  const isCorrect = picked === scenario.correctId;

  function pick(id: string) {
    if (submitted) return;
    setPickedById((prev) => ({ ...prev, [scenario.id]: id }));
  }
  function submit() {
    if (!picked) return;
    setSubmittedById((prev) => ({ ...prev, [scenario.id]: true }));
  }
  function reset() {
    setPickedById((prev) => ({ ...prev, [scenario.id]: null }));
    setSubmittedById((prev) => ({ ...prev, [scenario.id]: false }));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 items-stretch">
      <div className="flex flex-col gap-4" style={{ minHeight: "520px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <p
            className="uppercase"
            style={{
              color: GOLD,
              letterSpacing: "0.16em",
              fontWeight: 700,
              fontSize: "12px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              margin: 0,
            }}
          >
            Scenario {scenarioIdx + 1} of {DRILL_SCENARIOS.length}
          </p>
          <div style={{ display: "flex", gap: "6px" }}>
            {DRILL_SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScenarioIdx(i)}
                aria-label={`Go to scenario ${i + 1}: ${s.title}`}
                aria-current={i === scenarioIdx}
                className="gl-focus-ring"
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: `1.5px solid ${i === scenarioIdx ? GOLD : "rgba(156, 122, 47, 0.35)"}`,
                  background:
                    i === scenarioIdx ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "transparent",
                  color: i === scenarioIdx ? "#1A1408" : GOLD_DEEP,
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </header>

        <h4
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "20px",
            fontWeight: 500,
            color: INK_PRIMARY,
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {scenario.title}
        </h4>

        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "15.5px",
            color: INK_SECONDARY,
            lineHeight: 1.6,
            margin: 0,
            padding: "12px 14px",
            background: "rgba(255, 251, 240, 0.7)",
            border: `1px solid ${GOLD}33`,
            borderRadius: "8px",
          }}
        >
          {scenario.prompt}
        </p>

        <div role="radiogroup" aria-label="Pick the correct citation-discipline framing" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {scenario.options.map((opt) => {
            const isPicked = picked === opt.id;
            const isCorrectOption = opt.id === scenario.correctId;
            let borderColor = "rgba(156, 122, 47, 0.30)";
            let bg = "rgba(255, 251, 240, 0.55)";
            let textColor: string = INK_PRIMARY;
            let badge: { label: string; color: string } | null = null;
            if (submitted) {
              if (isPicked && isCorrectOption) {
                borderColor = JADE;
                bg = "rgba(58, 140, 90, 0.10)";
                textColor = "#1F5A37";
                badge = { label: "✓ correct", color: JADE };
              } else if (isPicked && !isCorrectOption) {
                borderColor = VERMILION;
                bg = "rgba(162, 58, 30, 0.10)";
                textColor = VERMILION;
                badge = { label: "not this", color: VERMILION };
              } else if (!isPicked && isCorrectOption) {
                borderColor = JADE;
                bg = "rgba(58, 140, 90, 0.06)";
                badge = { label: "correct answer", color: JADE };
              }
            } else if (isPicked) {
              borderColor = GOLD;
              bg = "linear-gradient(180deg, rgba(255, 248, 230, 0.96) 0%, rgba(252, 240, 210, 0.92) 100%)";
            }
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isPicked}
                disabled={submitted}
                onClick={() => pick(opt.id)}
                className="gl-clickable gl-focus-ring"
                style={{
                  padding: "11px 14px",
                  textAlign: "left",
                  background: bg,
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: "8px",
                  cursor: submitted ? "default" : "pointer",
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "14.5px",
                  color: textColor,
                  lineHeight: 1.5,
                  fontWeight: isPicked ? 500 : 400,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  transition: reducedMotion ? "none" : "background 160ms ease, border-color 160ms ease",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    border: `2px solid ${borderColor}`,
                    background: isPicked ? borderColor : "transparent",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                />
                <span style={{ flex: 1 }}>{opt.label}</span>
                {badge && (
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: badge.color,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      whiteSpace: "nowrap",
                      marginTop: "3px",
                    }}
                  >
                    {badge.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {!submitted ? (
            <button
              type="button"
              onClick={submit}
              disabled={!picked}
              className="gl-clickable gl-focus-ring"
              style={{
                padding: "8px 18px",
                background: !picked ? "rgba(156, 122, 47, 0.18)" : `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                color: !picked ? INK_MUTED : "#1A1408",
                border: `1.5px solid ${!picked ? "rgba(156, 122, 47, 0.30)" : GOLD}`,
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                cursor: !picked ? "not-allowed" : "pointer",
                boxShadow: !picked ? "none" : `0 4px 12px ${GOLD}55`,
              }}
            >
              Reveal
            </button>
          ) : (
            <button
              type="button"
              onClick={reset}
              className="gl-clickable gl-focus-ring"
              style={{
                padding: "8px 18px",
                background: "transparent",
                color: GOLD_DEEP,
                border: `1.5px solid ${GOLD}88`,
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          )}
        </div>
      </div>

      <aside aria-live="polite" className="flex flex-col gap-3" style={{ minHeight: "520px" }}>
        {!submitted ? <DrillGuidance /> : <DrillFeedback scenario={scenario} isCorrect={isCorrect} />}
      </aside>
    </div>
  );
}

function DrillGuidance() {
  return (
    <div
      style={{
        flex: 1,
        padding: "14px 16px",
        border: "1px dashed rgba(156, 122, 47, 0.32)",
        borderRadius: "10px",
        background: "rgba(255, 252, 240, 0.45)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <p
        className="uppercase"
        style={{
          fontSize: "12px",
          letterSpacing: "0.20em",
          color: GOLD_DEEP,
          fontWeight: 700,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        The four citation moves
      </p>
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14px",
          color: INK_SECONDARY,
          lineHeight: 1.5,
        }}
      >
        {[
          "Which CLASSICAL SOURCE? — name the specific text.",
          "What DATE? — academic dating; note traditional where it differs.",
          "What RECENSION? — especially for BPHS, name the manuscript family.",
          "What MODERN TRANSLATOR? — name the translator-edition.",
        ].map((m, i) => (
          <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span
              style={{
                flexShrink: 0,
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: `${GOLD}1f`,
                border: `1px solid ${GOLD}66`,
                color: GOLD_DEEP,
                fontSize: "11px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginTop: "1px",
              }}
            >
              {i + 1}
            </span>
            <span>{m}</span>
          </li>
        ))}
      </ol>

      <p
        style={{
          marginTop: "auto",
          paddingTop: "12px",
          borderTop: `1px dashed ${GOLD}55`,
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "13.5px",
          color: INK_MUTED,
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        For each scenario, identify which of the four moves the framing
        gets wrong (or right). Reveal shows the rationale and which
        discipline move the correct answer demonstrates.
      </p>
    </div>
  );
}

function DrillFeedback({ scenario, isCorrect }: { scenario: DrillScenario; isCorrect: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "14px 16px",
        background: isCorrect ? "rgba(58, 140, 90, 0.08)" : "rgba(255, 251, 240, 0.75)",
        border: `1px solid ${isCorrect ? "#3A8C5A55" : `${GOLD}55`}`,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <p
        className="uppercase"
        style={{
          fontSize: "11px",
          letterSpacing: "0.18em",
          color: isCorrect ? "#1F5A37" : VERMILION,
          fontWeight: 700,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        {isCorrect ? "✓ Citation discipline confirmed" : "Rationale"}
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14px",
          color: INK_PRIMARY,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {scenario.rationale}
      </p>
      <div
        style={{
          marginTop: "auto",
          padding: "10px 12px",
          background: `${VERMILION}10`,
          borderLeft: `3px solid ${VERMILION}aa`,
          borderRadius: "0 8px 8px 0",
        }}
      >
        <p
          className="uppercase"
          style={{
            fontSize: "10.5px",
            letterSpacing: "0.16em",
            color: VERMILION,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "4px",
          }}
        >
          The discipline move
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "13px",
            color: INK_PRIMARY,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {scenario.disciplineMove}
        </p>
      </div>
    </div>
  );
}
