/**
 * Four-Stream Synthesis Dojo — L2.6 §7 flagship + Chapter-2 capstone.
 *
 * Two-tab composition:
 *  Tab 1 — Stream Landscape Matrix: 4-column side-by-side comparison.
 *          Filter by classification (all / classical-foundational only /
 *          modern-primary only). Topic deep-dive: choose any of 4 cross-stream
 *          topics and see how each stream treats it.
 *
 *  Tab 2 — Evaluative Reasoning Drill: 5 scenarios testing the modern-primary
 *          doctrine, multi-stream-honesty, and cross-stream-evaluation
 *          discipline. The chapter-capstone Bloom-level (Evaluate) practice.
 */

"use client";

import { useState } from "react";
import { Check, X, ArrowRight, ArrowLeft, Sparkles, Filter as FilterIcon } from "lucide-react";
import { FOUR_STREAM_PROFILES, type StreamProfile } from "../four-stream-landscape-explorer/data";
import { EVALUATIVE_SCENARIOS, CROSS_STREAM_TOPICS, FRAMEWORK_SUMMARY } from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const VERMILION = "#A23A1E";
const JADE = "#3A8C5A";
const JADE_DEEP = "#1F5A37";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

type Tab = "landscape" | "drill";
type FilterMode = "all" | "classical-foundational" | "modern-primary";

export function FourStreamSynthesisDojo() {
  const [tab, setTab] = useState<Tab>("landscape");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [topicIdx, setTopicIdx] = useState(0);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const filteredProfiles = FOUR_STREAM_PROFILES.filter(
    (p) => filter === "all" || p.classification === filter,
  );
  const currentTopic = CROSS_STREAM_TOPICS[topicIdx];
  const currentScenario = EVALUATIVE_SCENARIOS[scenarioIdx];
  const currentAnswerId = answers[currentScenario.id];
  const currentAnswerOption = currentAnswerId
    ? currentScenario.options.find((o) => o.id === currentAnswerId)
    : null;

  return (
    <div
      data-interactive="four-stream-synthesis-dojo"
      style={{ display: "flex", flexDirection: "column", gap: "22px" }}
    >
      {/* Tab switcher */}
      <div
        className="gl-surface-twilight-glass"
        style={{ padding: "8px", display: "flex", gap: "6px" }}
      >
        {(
          [
            { id: "landscape", label: "Stream Landscape Matrix", subtitle: "Side-by-side across 4 streams" },
            { id: "drill", label: "Evaluative Reasoning Drill", subtitle: "5 scenarios — chapter-capstone Bloom-Evaluate" },
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
                  ? `linear-gradient(135deg, ${VERMILION}20 0%, ${VERMILION}35 100%)`
                  : "transparent",
                border: isActive ? `1px solid ${VERMILION}66` : "1px solid transparent",
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
                  color: isActive ? VERMILION : INK_MUTED,
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

      {tab === "landscape" && (
        <>
          {/* Filter chips */}
          <div
            className="gl-surface-twilight-glass"
            style={{ padding: "14px 22px", display: "flex", alignItems: "center", gap: "12px" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11.5px",
                letterSpacing: "0.16em",
                color: INK_MUTED,
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                textTransform: "uppercase",
              }}
            >
              <FilterIcon size={12} /> Filter
            </span>
            {(
              [
                { id: "all", label: "All four streams", count: 4 },
                { id: "classical-foundational", label: "Classical-foundational", count: 2 },
                { id: "modern-primary", label: "Modern-primary", count: 2 },
              ] as const
            ).map((f) => {
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className="gl-focus-ring"
                  style={{
                    padding: "6px 14px",
                    background: isActive
                      ? `linear-gradient(135deg, ${GOLD}25 0%, ${GOLD}40 100%)`
                      : "transparent",
                    border: `1px solid ${isActive ? GOLD : `${GOLD}44`}`,
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "13.5px",
                    color: isActive ? GOLD_DEEP : INK_SECONDARY,
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {f.label} ({f.count})
                </button>
              );
            })}
          </div>

          {/* Stream matrix */}
          <div className="gl-surface-twilight-glass" style={{ padding: "22px 26px" }}>
            <p
              className="uppercase"
              style={{
                color: VERMILION,
                letterSpacing: "0.20em",
                fontWeight: 700,
                fontSize: "13px",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                margin: 0,
                marginBottom: "16px",
              }}
            >
              {filteredProfiles.length} stream{filteredProfiles.length === 1 ? "" : "s"} ·
              side-by-side
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${filteredProfiles.length}, 1fr)`,
                gap: "12px",
              }}
            >
              {filteredProfiles.map((s) => (
                <StreamMatrixColumn key={s.slug} stream={s} />
              ))}
            </div>
          </div>

          {/* Cross-stream topic deep-dive */}
          <div className="gl-surface-twilight-glass" style={{ padding: "22px 26px" }}>
            <p
              className="uppercase"
              style={{
                color: GOLD,
                letterSpacing: "0.20em",
                fontWeight: 700,
                fontSize: "13px",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                margin: 0,
                marginBottom: "8px",
              }}
            >
              Cross-stream topic deep-dive
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "14.5px",
                color: INK_SECONDARY,
                lineHeight: 1.6,
                margin: 0,
                marginBottom: "16px",
              }}
            >
              Pick a topic. See how each of the four streams treats it. The
              streams complement at different doctrinal-layers — not compete
              at the same layer.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {CROSS_STREAM_TOPICS.map((t, i) => {
                const isActive = i === topicIdx;
                return (
                  <button
                    key={t.topic}
                    type="button"
                    onClick={() => setTopicIdx(i)}
                    className="gl-focus-ring"
                    style={{
                      padding: "8px 14px",
                      background: isActive
                        ? `linear-gradient(135deg, ${VERMILION}20 0%, ${VERMILION}35 100%)`
                        : "transparent",
                      border: `1px solid ${isActive ? VERMILION : `${GOLD}44`}`,
                      borderRadius: "999px",
                      cursor: "pointer",
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "13.5px",
                      color: isActive ? VERMILION : INK_SECONDARY,
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {t.topic}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              {[
                { profile: FOUR_STREAM_PROFILES[0], treatment: currentTopic.parashari },
                { profile: FOUR_STREAM_PROFILES[1], treatment: currentTopic.jaimini },
                { profile: FOUR_STREAM_PROFILES[2], treatment: currentTopic.kp },
                { profile: FOUR_STREAM_PROFILES[3], treatment: currentTopic.lalKitab },
              ].map(({ profile, treatment }) => (
                <div
                  key={profile.slug}
                  style={{
                    padding: "14px 16px",
                    background: `linear-gradient(135deg, ${profile.color}10 0%, ${profile.color}22 100%)`,
                    border: `1px solid ${profile.color}66`,
                    borderLeft: `3px solid ${profile.color}`,
                    borderRadius: "8px",
                  }}
                >
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: "0.16em",
                      color: profile.colorDeep,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      margin: 0,
                      marginBottom: "6px",
                    }}
                  >
                    {profile.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "13px",
                      color: INK_PRIMARY,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {treatment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Framework summary */}
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
                color: JADE_DEEP,
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginBottom: "10px",
              }}
            >
              ✓ {FRAMEWORK_SUMMARY.headline}
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "15px",
                color: INK_PRIMARY,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {FRAMEWORK_SUMMARY.body}
            </p>
          </div>
        </>
      )}

      {tab === "drill" && (
        <>
          {/* Scenario nav */}
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
                  color: VERMILION,
                  margin: 0,
                }}
              >
                {scenarioIdx + 1} / {EVALUATIVE_SCENARIOS.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setScenarioIdx((i) => Math.min(EVALUATIVE_SCENARIOS.length - 1, i + 1))
              }
              disabled={scenarioIdx === EVALUATIVE_SCENARIOS.length - 1}
              className="gl-focus-ring"
              style={{
                padding: "6px 12px",
                background: "transparent",
                border: `1px solid ${GOLD}55`,
                borderRadius: "8px",
                cursor: scenarioIdx === EVALUATIVE_SCENARIOS.length - 1 ? "not-allowed" : "pointer",
                opacity: scenarioIdx === EVALUATIVE_SCENARIOS.length - 1 ? 0.4 : 1,
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
                color: VERMILION,
                letterSpacing: "0.20em",
                fontWeight: 700,
                fontSize: "12px",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginBottom: "4px",
              }}
            >
              {currentScenario.title}
            </p>
            <p
              className="uppercase"
              style={{
                fontSize: "10.5px",
                letterSpacing: "0.18em",
                color: INK_MUTED,
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginBottom: "10px",
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
                marginBottom: "14px",
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

/* ──────────── Sub-component: stream matrix column ──────────── */

function StreamMatrixColumn({ stream }: { stream: StreamProfile }) {
  return (
    <div
      style={{
        padding: "16px 14px",
        background: `linear-gradient(135deg, ${stream.color}10 0%, ${stream.color}22 100%)`,
        border: `1px solid ${stream.color}66`,
        borderTop: `4px solid ${stream.color}`,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={{ textAlign: "center", paddingBottom: "10px", borderBottom: `1px dashed ${stream.color}55` }}>
        <p
          lang="sa"
          style={{
            fontFamily: "var(--font-devanagari), serif",
            fontSize: "17px",
            color: stream.colorDeep,
            lineHeight: 1.2,
            margin: 0,
            marginBottom: "2px",
          }}
        >
          {stream.devanagari}
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "18px",
            fontWeight: 700,
            color: stream.colorDeep,
            lineHeight: 1.2,
            margin: 0,
            marginBottom: "4px",
          }}
        >
          {stream.label}
        </p>
        <p
          className="uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.14em",
            color: stream.color,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
          }}
        >
          {stream.classification === "classical-foundational"
            ? "Classical-foundational"
            : "Modern-primary"}
        </p>
      </div>

      <MatrixCell label="Era" body={stream.era} colorDeep={stream.colorDeep} />
      <MatrixCell label="Foundational text(s)" body={stream.foundationalText} colorDeep={stream.colorDeep} />
      <MatrixCell label="Language" body={stream.foundationalLanguage} colorDeep={stream.colorDeep} />
      <MatrixCell label="Primary distinctive" body={stream.primaryDistinctive} colorDeep={stream.colorDeep} />
      <MatrixCell label="Analytical unit" body={stream.analyticalUnit} colorDeep={stream.colorDeep} />
      <MatrixCell label="Citation discipline" body={stream.citationDiscipline} colorDeep={stream.colorDeep} />
    </div>
  );
}

function MatrixCell({
  label,
  body,
  colorDeep,
}: {
  label: string;
  body: string;
  colorDeep: string;
}) {
  return (
    <div>
      <p
        className="uppercase"
        style={{
          fontSize: "10px",
          letterSpacing: "0.16em",
          color: colorDeep,
          fontWeight: 700,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          margin: 0,
          marginBottom: "3px",
          opacity: 0.85,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "12.5px",
          color: INK_PRIMARY,
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  );
}
