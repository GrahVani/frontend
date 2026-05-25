/**
 * Jaiminī Second-Tradition Dojo — L2.5 §7 flagship.
 *
 * Two-tab synthesis:
 *  Tab 1 ("Doctrinal-Pair Atlas") — 6 cross-tradition pair plates with
 *  Parāśari and Jaiminī side-by-side, including the genuinely-unique-to-
 *  Jaiminī (ārūḍha) and the unique-to-Parāśari (bhāva-lordships) cases.
 *
 *  Tab 2 ("Tradition-Attribution Drill") — 5 scenarios where the learner
 *  identifies which tradition a claim belongs to (or both, or neither)
 *  and exercises the multi-stream-honesty citation discipline.
 */

"use client";

import { useState } from "react";
import { Check, X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { DOCTRINAL_PAIR_ATLAS, ATTRIBUTION_SCENARIOS } from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const VERMILION = "#A23A1E";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const JADE = "#3A8C5A";
const JADE_DEEP = "#1F5A37";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

type Tab = "atlas" | "drill";

export function JaiminiSecondTraditionDojo() {
  const [tab, setTab] = useState<Tab>("atlas");
  const [activePairSlug, setActivePairSlug] = useState<string>(DOCTRINAL_PAIR_ATLAS[0].slug);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const activePair = DOCTRINAL_PAIR_ATLAS.find((p) => p.slug === activePairSlug)!;
  const currentScenario = ATTRIBUTION_SCENARIOS[scenarioIdx];
  const currentAnswerId = answers[currentScenario.id];
  const currentAnswerOption = currentAnswerId
    ? currentScenario.options.find((o) => o.id === currentAnswerId)
    : null;

  const relColor =
    activePair.relationship === "unique-to-jaimini"
      ? INDIGO
      : activePair.relationship === "unique-to-parashari"
      ? GOLD
      : VERMILION;
  const relLabel =
    activePair.relationship === "unique-to-jaimini"
      ? "Unique to Jaiminī"
      : activePair.relationship === "unique-to-parashari"
      ? "Unique to Parāśari"
      : "Parallel — different mechanisms";

  return (
    <div
      data-interactive="jaimini-second-tradition-dojo"
      style={{ display: "flex", flexDirection: "column", gap: "22px" }}
    >
      {/* Tab switcher */}
      <div
        className="gl-surface-twilight-glass"
        style={{ padding: "8px", display: "flex", gap: "6px" }}
      >
        {(
          [
            { id: "atlas", label: "Doctrinal-Pair Atlas", subtitle: "Pair-by-pair side-by-side" },
            { id: "drill", label: "Attribution Drill", subtitle: "5 scenarios" },
          ] as const
        ).map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="gl-focus-ring"
              style={{
                flex: 1,
                padding: "12px 16px",
                background: isActive
                  ? `linear-gradient(135deg, ${GOLD}25 0%, ${GOLD}40 100%)`
                  : "transparent",
                border: isActive ? `1px solid ${GOLD}66` : "1px solid transparent",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <p
                className="uppercase"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  fontWeight: 700,
                  color: isActive ? GOLD_DEEP : INK_MUTED,
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  margin: 0,
                }}
              >
                {t.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "12.5px",
                  fontStyle: "italic",
                  color: isActive ? INK_PRIMARY : INK_MUTED,
                  margin: 0,
                  marginTop: "2px",
                }}
              >
                {t.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {tab === "atlas" && (
        <>
          {/* Pair selector chips */}
          <div className="gl-surface-twilight-glass" style={{ padding: "18px 22px" }}>
            <p
              className="uppercase"
              style={{
                color: GOLD,
                letterSpacing: "0.20em",
                fontWeight: 700,
                fontSize: "12px",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginBottom: "12px",
              }}
            >
              Six cross-tradition pairs — choose a predictive purpose
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {DOCTRINAL_PAIR_ATLAS.map((p) => {
                const isActive = p.slug === activePairSlug;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => setActivePairSlug(p.slug)}
                    className="gl-focus-ring"
                    style={{
                      padding: "8px 14px",
                      background: isActive
                        ? `linear-gradient(135deg, ${VERMILION}20 0%, ${VERMILION}35 100%)`
                        : "transparent",
                      border: isActive ? `1px solid ${VERMILION}66` : `1px solid ${GOLD}44`,
                      borderRadius: "999px",
                      cursor: "pointer",
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "13.5px",
                      color: isActive ? VERMILION : INK_SECONDARY,
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {p.purpose.replace(/\s*\(.*\)\s*/, "")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active pair diptych */}
          <div className="gl-surface-twilight-glass" style={{ padding: "22px 26px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                background: `${relColor}15`,
                borderRadius: "999px",
                border: `1px solid ${relColor}55`,
                marginBottom: "10px",
              }}
            >
              <p
                className="uppercase"
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "0.18em",
                  color: relColor,
                  fontWeight: 700,
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  margin: 0,
                }}
              >
                {relLabel}
              </p>
            </div>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "18px",
                color: INK_PRIMARY,
                lineHeight: 1.4,
                margin: 0,
                marginBottom: "16px",
                fontWeight: 600,
              }}
            >
              {activePair.purpose}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
                marginBottom: "16px",
              }}
            >
              {/* Parāśari plate */}
              <div
                style={{
                  padding: "18px 20px",
                  background:
                    activePair.relationship === "unique-to-jaimini"
                      ? `linear-gradient(135deg, rgba(180,180,180,0.10) 0%, rgba(180,180,180,0.18) 100%)`
                      : `linear-gradient(135deg, ${GOLD}10 0%, ${GOLD}22 100%)`,
                  border:
                    activePair.relationship === "unique-to-jaimini"
                      ? `1px dashed ${GOLD}55`
                      : `1px solid ${GOLD}66`,
                  borderRadius: "10px",
                  opacity: activePair.relationship === "unique-to-jaimini" ? 0.7 : 1,
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
                    marginBottom: "4px",
                  }}
                >
                  Parāśari
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: GOLD_DEEP,
                    lineHeight: 1.25,
                    margin: 0,
                    marginBottom: "10px",
                  }}
                >
                  {activePair.parashari}
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
                  {activePair.parashariMechanism}
                </p>
              </div>

              {/* Jaiminī plate */}
              <div
                style={{
                  padding: "18px 20px",
                  background:
                    activePair.relationship === "unique-to-parashari"
                      ? `linear-gradient(135deg, rgba(180,180,180,0.10) 0%, rgba(180,180,180,0.18) 100%)`
                      : `linear-gradient(135deg, ${INDIGO}10 0%, ${INDIGO}22 100%)`,
                  border:
                    activePair.relationship === "unique-to-parashari"
                      ? `1px dashed ${INDIGO}55`
                      : `1px solid ${INDIGO}66`,
                  borderRadius: "10px",
                  opacity: activePair.relationship === "unique-to-parashari" ? 0.7 : 1,
                }}
              >
                <p
                  className="uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    color: INDIGO_DEEP,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    marginBottom: "4px",
                  }}
                >
                  Jaiminī
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: INDIGO_DEEP,
                    lineHeight: 1.25,
                    margin: 0,
                    marginBottom: "10px",
                  }}
                >
                  {activePair.jaimini}
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
                  {activePair.jaiminiMechanism}
                </p>
              </div>
            </div>

            <div
              style={{
                padding: "14px 16px",
                background: `${VERMILION}10`,
                borderLeft: `3px solid ${VERMILION}`,
                borderRadius: "0 8px 8px 0",
              }}
            >
              <p
                className="uppercase"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.16em",
                  color: VERMILION,
                  fontWeight: 700,
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  marginBottom: "5px",
                }}
              >
                Multi-stream takeaway
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "14px",
                  color: INK_PRIMARY,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {activePair.takeaway}
              </p>
            </div>
          </div>
        </>
      )}

      {tab === "drill" && (
        <>
          {/* Scenario nav + counter */}
          <div
            className="gl-surface-twilight-glass"
            style={{
              padding: "14px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              type="button"
              onClick={() => setScenarioIdx((i) => Math.max(0, i - 1))}
              disabled={scenarioIdx === 0}
              className="gl-focus-ring"
              style={{
                padding: "6px 12px",
                background: "transparent",
                border: `1px solid ${GOLD}55`,
                borderRadius: "8px",
                cursor: scenarioIdx === 0 ? "not-allowed" : "pointer",
                opacity: scenarioIdx === 0 ? 0.4 : 1,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "12.5px",
                color: GOLD_DEEP,
              }}
            >
              <ArrowLeft size={14} /> Previous
            </button>
            <div style={{ textAlign: "center" }}>
              <p
                className="uppercase"
                style={{
                  fontSize: "10.5px",
                  letterSpacing: "0.18em",
                  color: INK_MUTED,
                  fontWeight: 700,
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  margin: 0,
                }}
              >
                Scenario
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: GOLD_DEEP,
                  margin: 0,
                }}
              >
                {scenarioIdx + 1} / {ATTRIBUTION_SCENARIOS.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setScenarioIdx((i) => Math.min(ATTRIBUTION_SCENARIOS.length - 1, i + 1))}
              disabled={scenarioIdx === ATTRIBUTION_SCENARIOS.length - 1}
              className="gl-focus-ring"
              style={{
                padding: "6px 12px",
                background: "transparent",
                border: `1px solid ${GOLD}55`,
                borderRadius: "8px",
                cursor: scenarioIdx === ATTRIBUTION_SCENARIOS.length - 1 ? "not-allowed" : "pointer",
                opacity: scenarioIdx === ATTRIBUTION_SCENARIOS.length - 1 ? 0.4 : 1,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "12.5px",
                color: GOLD_DEEP,
              }}
            >
              Next <ArrowRight size={14} />
            </button>
          </div>

          {/* Scenario body */}
          <div className="gl-surface-twilight-glass" style={{ padding: "22px 26px" }}>
            <p
              className="uppercase"
              style={{
                color: GOLD,
                letterSpacing: "0.20em",
                fontWeight: 700,
                fontSize: "12px",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginBottom: "8px",
              }}
            >
              The situation
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "15px",
                color: INK_PRIMARY,
                lineHeight: 1.7,
                margin: 0,
                marginBottom: "16px",
              }}
            >
              {currentScenario.setup}
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "16px",
                fontStyle: "italic",
                color: INK_PRIMARY,
                fontWeight: 600,
                lineHeight: 1.5,
                margin: 0,
                marginBottom: "16px",
                paddingLeft: "12px",
                borderLeft: `3px solid ${VERMILION}`,
              }}
            >
              {currentScenario.claim}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentScenario.options.map((opt) => {
                const isSelected = currentAnswerId === opt.id;
                const showFeedback = !!currentAnswerId;
                const isCorrect = opt.isCorrect;
                let optColor = GOLD;
                if (showFeedback && isSelected) optColor = isCorrect ? JADE : VERMILION;
                else if (showFeedback && isCorrect) optColor = JADE;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      !currentAnswerId &&
                      setAnswers((a) => ({ ...a, [currentScenario.id]: opt.id }))
                    }
                    disabled={!!currentAnswerId}
                    className="gl-focus-ring"
                    style={{
                      padding: "14px 16px",
                      background: showFeedback
                        ? isSelected
                          ? `${optColor}15`
                          : isCorrect
                          ? `${JADE}10`
                          : "transparent"
                        : "transparent",
                      border: `1.5px solid ${showFeedback ? optColor : GOLD}55`,
                      borderRadius: "10px",
                      cursor: currentAnswerId ? "default" : "pointer",
                      textAlign: "left",
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: showFeedback
                          ? isSelected || isCorrect
                            ? optColor
                            : "transparent"
                          : "transparent",
                        border: `1.5px solid ${optColor}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      {showFeedback && isSelected && (isCorrect ? <Check size={13} color="#fff" /> : <X size={13} color="#fff" />)}
                      {showFeedback && !isSelected && isCorrect && <Check size={13} color="#fff" />}
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "14.5px",
                        color: INK_PRIMARY,
                        lineHeight: 1.55,
                        margin: 0,
                        fontWeight: showFeedback && (isSelected || isCorrect) ? 600 : 500,
                      }}
                    >
                      {opt.label}
                    </p>
                  </button>
                );
              })}
            </div>

            {currentAnswerOption && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px 16px",
                  background: currentAnswerOption.isCorrect ? `${JADE}12` : `${VERMILION}12`,
                  borderLeft: `3px solid ${currentAnswerOption.isCorrect ? JADE : VERMILION}`,
                  borderRadius: "0 8px 8px 0",
                }}
              >
                <p
                  className="uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.16em",
                    color: currentAnswerOption.isCorrect ? JADE_DEEP : VERMILION,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    marginBottom: "5px",
                  }}
                >
                  {currentAnswerOption.isCorrect ? "✓ Correct" : "✗ Reconsider"}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "14px",
                    color: INK_PRIMARY,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {currentAnswerOption.feedback}
                </p>
              </div>
            )}

            {currentAnswerOption && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "14px 16px",
                  background: `linear-gradient(135deg, ${GOLD}10 0%, ${GOLD}20 100%)`,
                  border: `1px solid ${GOLD}55`,
                  borderRadius: "10px",
                }}
              >
                <p
                  className="uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.16em",
                    color: GOLD_DEEP,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    marginBottom: "5px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Sparkles size={13} /> Synthesis takeaway
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "14px",
                    color: INK_PRIMARY,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {currentScenario.synthesis}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
