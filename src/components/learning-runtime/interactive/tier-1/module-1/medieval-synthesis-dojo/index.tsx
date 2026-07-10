/**
 * Medieval Synthesis Dojo — Lesson 2.4's §7 flagship interactive.
 *
 * Single-purpose drill: 5 scenarios on medieval-codifier dating + citation
 * discipline. The drill builds on the §4 explorer's content — testing
 * compounding uncertainty, codifier-role honesty, ceiling-vs-floor citation
 * bracketing, and the three-layer lineage structure.
 */

"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import {
  DRILL_SCENARIOS,
  FRAMEWORK_SUMMARY,
  type DrillScenario,
} from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const VERMILION = "#A23A1E";
const JADE = "#3A8C5A";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

export function MedievalSynthesisDojo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [pickedById, setPickedById] = useState<Record<string, string | null>>({});
  const [submittedById, setSubmittedById] = useState<Record<string, boolean>>({});
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

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
    <div
      className="gl-surface-twilight-glass"
      style={{ padding: "20px 22px 22px" }}
      data-interactive="medieval-synthesis-dojo"
    >
      <header style={{ marginBottom: "18px" }}>
        <p
          className="uppercase"
          style={{
            color: GOLD,
            letterSpacing: "0.20em",
            fontWeight: 700,
            fontSize: "13px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
            marginBottom: "10px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <BookOpen size={14} /> Codifier Discipline Drill
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
          Five scenarios testing the medieval-codifier discipline: relative-
          dating bracketing, codifier-role honesty, ceiling-vs-floor
          citation evidence, and the three-layer lineage structure.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 items-stretch">
        <div className="flex flex-col gap-4" style={{ minHeight: "520px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
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
                    background: i === scenarioIdx ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "transparent",
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

          <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.3, margin: 0 }}>
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

          <div role="radiogroup" aria-label="Pick the correct framing" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
          {!submitted ? (
            <DrillGuidance />
          ) : (
            <DrillFeedback scenario={scenario} isCorrect={isCorrect} />
          )}

          {/* Always-visible framework summary */}
          <div
            style={{
              padding: "14px 16px",
              background: `linear-gradient(135deg, ${JADE}10 0%, ${GOLD}10 100%)`,
              border: `1px solid ${JADE}66`,
              borderRadius: "10px",
              marginTop: "auto",
            }}
          >
            <p
              className="uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                color: "#1F5A37",
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginBottom: "6px",
              }}
            >
              ✓ {FRAMEWORK_SUMMARY.headline}
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "13.5px",
                color: INK_PRIMARY,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {FRAMEWORK_SUMMARY.body}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DrillGuidance() {
  return (
    <div
      style={{
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
        What this drill tests
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14.5px",
          color: INK_SECONDARY,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        Four areas: (1) citation-network bracketing methodology, (2) compounding
        uncertainty along the citation chain, (3) the codifier-role distinction
        (refining/synthesising vs originating), and (4) recension-burden
        appropriateness (medieval-codifier texts are more stable than BPHS).
      </p>
    </div>
  );
}

function DrillFeedback({ scenario, isCorrect }: { scenario: DrillScenario; isCorrect: boolean }) {
  return (
    <div
      style={{
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
        {isCorrect ? "✓ Discipline confirmed" : "Rationale"}
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
