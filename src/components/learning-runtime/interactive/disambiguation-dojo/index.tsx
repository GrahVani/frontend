/**
 * Disambiguation Dojo — Lesson 3's §7 flagship interactive.
 *
 * Two-tab synthesis layer for the disambiguation discipline (constitution
 * §10.1 — §7 Primary Simulator):
 *
 *   - Tab 1 "Indo-Hellenistic Lineage" : a chronological timeline of the
 *                                        Hellenistic-to-Indian transmission
 *                                        (Pingree's documented exchange),
 *                                        a shared-concepts panel showing
 *                                        what Vedic and Western actually
 *                                        share, and an ayanāṁśa drift
 *                                        slider that visualises how the
 *                                        ~24° drift produces different
 *                                        rāśi assignments.
 *
 *   - Tab 2 "Disambiguation Drill"     : five real-world scenarios where
 *                                        the learner identifies which
 *                                        tradition is being referenced.
 *                                        Feedback paragraphs cite the
 *                                        §4.4 practitioner-discipline
 *                                        moves. Tests the disambiguation
 *                                        skill viscerally — not just
 *                                        comprehension.
 *
 * Distinct from §4's JyotishaVsWesternVsPopComparator (dimension explorer).
 * §7 = synthesise the lineage + exercise the discipline. §4 = explore each
 * dimension across the three traditions.
 *
 * Constitutional invariants honoured:
 *   - gl-focus-ring on every clickable
 *   - prefers-reduced-motion respected
 *   - All sizes from the chrome token universe
 *   - No internal h3 inside the interactive (h4 + eyebrows only)
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, BookOpen, Compass, Clock } from "lucide-react";
import {
  TIMELINE_EVENTS,
  SHARED_CONCEPTS,
  DRIFT_TIMELINE,
  DRILL_SCENARIOS,
  HONEST_FRAMING,
  type DrillScenario,
  type TraditionSlug,
} from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const VERMILION = "#A23A1E";
const JADE = "#3A8C5A";
const INDIGO = "#4F6FA8";
const INK_ON_CREAM_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_ON_CREAM_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_ON_CREAM_MUTED = "var(--gl-ink-on-cream-muted)";

type Tab = "lineage" | "drill";

export function DisambiguationDojo() {
  const [tab, setTab] = useState<Tab>("lineage");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{ padding: "20px 22px 22px" }}
      data-interactive="disambiguation-dojo"
    >
      {/* Tab switcher — two clearly-separated modes (matches JyotishaSangaHub) */}
      <div
        role="tablist"
        aria-label="Synthesis modes"
        style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}
      >
        <TabButton
          active={tab === "lineage"}
          onClick={() => setTab("lineage")}
          label="Indo-Hellenistic Lineage"
          sublabel="see the shared roots and the divergences"
          icon={<Compass size={14} />}
        />
        <TabButton
          active={tab === "drill"}
          onClick={() => setTab("drill")}
          label="Disambiguation Drill"
          sublabel="exercise the practitioner discipline"
          icon={<BookOpen size={14} />}
        />
      </div>

      {tab === "lineage" ? (
        <LineageView reducedMotion={reducedMotion} />
      ) : (
        <DrillView reducedMotion={reducedMotion} />
      )}
    </div>
  );
}

/* ────────────────────── Tab button (compact) ───────────────────────── */

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
        flex: "1 1 240px",
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
        transition: "background 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
      }}
    >
      <span
        style={{
          width: "28px",
          height: "28px",
          flexShrink: 0,
          borderRadius: "50%",
          background: active
            ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`
            : "rgba(156, 122, 47, 0.15)",
          color: active ? "#1A1408" : GOLD_DEEP,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: active ? `0 2px 6px ${GOLD}44` : "none",
        }}
      >
        {icon}
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "17px",
            fontWeight: 600,
            color: INK_ON_CREAM_PRIMARY,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "12.5px",
            color: INK_ON_CREAM_SECONDARY,
            marginTop: "2px",
          }}
        >
          {sublabel}
        </span>
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
 * TAB 1 — Indo-Hellenistic Lineage
 * ═══════════════════════════════════════════════════════════════════════ */

function LineageView({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeEventIdx, setActiveEventIdx] = useState<number | null>(null);
  const [driftIdx, setDriftIdx] = useState(DRIFT_TIMELINE.length - 1); // default to current year
  const activeDrift = DRIFT_TIMELINE[driftIdx];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 items-stretch">
      {/* LEFT: timeline + ayanāṁśa drift slider */}
      <div className="flex flex-col gap-5" style={{ minHeight: "560px" }}>
        <header>
          <p
            className="uppercase"
            style={{
              color: GOLD,
              letterSpacing: "0.16em",
              fontWeight: 700,
              fontSize: "12px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "6px",
            }}
          >
            The transmission timeline
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "15px",
              lineHeight: 1.5,
              color: INK_ON_CREAM_PRIMARY,
              margin: 0,
            }}
          >
            Hellenistic astrology and Vedic Jyotiṣa share substantive lineage
            — well-documented in Pingree&apos;s academic work. Click any event
            to read the context.
          </p>
        </header>

        {/* Timeline — vertical with side indicators */}
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            borderLeft: `2px solid ${GOLD}55`,
            paddingLeft: "16px",
            position: "relative",
          }}
        >
          {TIMELINE_EVENTS.map((evt, idx) => {
            const isActive = activeEventIdx === idx;
            const sideColor =
              evt.side === "west" ? INDIGO : evt.side === "east" ? GOLD : VERMILION;
            return (
              <li key={idx} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setActiveEventIdx(isActive ? null : idx)}
                  aria-expanded={isActive}
                  className="gl-focus-ring gl-clickable"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: isActive ? "rgba(232, 199, 114, 0.10)" : "transparent",
                    border: "none",
                    padding: "8px 10px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    transition: reducedMotion ? "none" : "background 160ms ease",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "-23px",
                      top: "14px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: sideColor,
                      border: `2px solid var(--gl-bg-twilight-glass, #FFFCF0)`,
                      boxShadow: isActive ? `0 0 8px ${sideColor}88` : "none",
                    }}
                  />
                  <span
                    className="uppercase"
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: "0.16em",
                      color: sideColor,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                    }}
                  >
                    {evt.date}
                    {evt.side === "shared" && " · shared lineage"}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: INK_ON_CREAM_PRIMARY,
                      lineHeight: 1.3,
                    }}
                  >
                    {evt.title}
                  </span>
                  {isActive && (
                    <div style={{ marginTop: "4px" }}>
                      <p
                        style={{
                          fontFamily: "var(--font-cormorant), serif",
                          fontSize: "13.5px",
                          color: INK_ON_CREAM_SECONDARY,
                          lineHeight: 1.55,
                          margin: 0,
                        }}
                      >
                        {evt.description}
                      </p>
                      {evt.source && (
                        <p
                          style={{
                            fontFamily: "var(--font-cormorant), serif",
                            fontStyle: "italic",
                            fontSize: "11.5px",
                            color: INK_ON_CREAM_MUTED,
                            margin: 0,
                            marginTop: "4px",
                          }}
                        >
                          — {evt.source}
                        </p>
                      )}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        {/* Ayanāṁśa drift slider */}
        <div
          style={{
            padding: "14px 16px",
            background: "rgba(255, 251, 240, 0.7)",
            border: `1px solid ${GOLD}55`,
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "auto",
          }}
        >
          <header
            style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}
          >
            <p
              className="uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                color: GOLD_DEEP,
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                margin: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Clock size={11} />
              Ayanāṁśa drift over time
            </p>
            <span
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "13px",
                color: INK_ON_CREAM_SECONDARY,
                fontStyle: "italic",
              }}
            >
              Year {activeDrift.year >= 0 ? activeDrift.year : `${Math.abs(activeDrift.year)} BCE`}
            </span>
          </header>

          <input
            type="range"
            min={0}
            max={DRIFT_TIMELINE.length - 1}
            step={1}
            value={driftIdx}
            onChange={(e) => setDriftIdx(parseInt(e.target.value, 10))}
            aria-label="Slide through history to see ayanāṁśa drift at different dates"
            style={{
              width: "100%",
              accentColor: GOLD,
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "13.5px",
                color: INK_ON_CREAM_PRIMARY,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {activeDrift.label}
            </p>
            <span
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "26px",
                fontWeight: 600,
                color: VERMILION,
                lineHeight: 1,
                letterSpacing: "-0.5px",
              }}
            >
              {activeDrift.driftDegrees.toFixed(1)}°
            </span>
          </div>

          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "12px",
              color: INK_ON_CREAM_MUTED,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Lahiri ayanāṁśa, approximate. A planet at tropical {activeDrift.driftDegrees.toFixed(1)}° Aries
            (Western) sits at sidereal 0° Aries (Vedic) — shifting rāśi assignments accordingly.
          </p>
        </div>
      </div>

      {/* RIGHT: shared concepts + honest framing */}
      <aside
        className="flex flex-col gap-4"
        style={{ minHeight: "560px" }}
      >
        <section>
          <p
            className="uppercase"
            style={{
              color: GOLD,
              letterSpacing: "0.16em",
              fontWeight: 700,
              fontSize: "12px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "10px",
            }}
          >
            Shared concepts
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {SHARED_CONCEPTS.map((c, i) => (
              <li
                key={i}
                style={{
                  padding: "8px 10px",
                  background: "rgba(255, 251, 240, 0.6)",
                  border: `1px solid ${GOLD}33`,
                  borderRadius: "6px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "13.5px",
                    color: INK_ON_CREAM_PRIMARY,
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                >
                  <strong style={{ color: GOLD_DEEP, fontWeight: 600 }}>{c.vedic}</strong>
                  {" ↔ "}
                  <strong style={{ color: INDIGO, fontWeight: 600 }}>{c.western}</strong>
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "12px",
                    color: INK_ON_CREAM_SECONDARY,
                    lineHeight: 1.5,
                    margin: 0,
                    marginTop: "2px",
                  }}
                >
                  {c.note}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Honest framing callout */}
        <div
          style={{
            padding: "12px 14px",
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
            ✓ {HONEST_FRAMING.title}
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "13px",
              color: INK_ON_CREAM_PRIMARY,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            {HONEST_FRAMING.body}
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
 * TAB 2 — Disambiguation Drill
 * ═══════════════════════════════════════════════════════════════════════ */

function DrillView({ reducedMotion }: { reducedMotion: boolean }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [pickedBySlug, setPickedBySlug] = useState<Record<string, string | null>>({});
  const [submittedBySlug, setSubmittedBySlug] = useState<Record<string, boolean>>({});

  const scenario = DRILL_SCENARIOS[scenarioIdx];
  const picked = pickedBySlug[scenario.id] ?? null;
  const submitted = submittedBySlug[scenario.id] ?? false;
  const isCorrect = picked === scenario.correctSlug;

  function pick(slug: string) {
    if (submitted) return;
    setPickedBySlug((prev) => ({ ...prev, [scenario.id]: slug }));
  }

  function submit() {
    if (!picked) return;
    setSubmittedBySlug((prev) => ({ ...prev, [scenario.id]: true }));
  }

  function reset() {
    setPickedBySlug((prev) => ({ ...prev, [scenario.id]: null }));
    setSubmittedBySlug((prev) => ({ ...prev, [scenario.id]: false }));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 items-stretch">
      {/* LEFT: scenario presentation */}
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
                aria-label={`Go to scenario ${i + 1}`}
                aria-current={i === scenarioIdx}
                className="gl-focus-ring"
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: `1.5px solid ${i === scenarioIdx ? GOLD : "rgba(156, 122, 47, 0.35)"}`,
                  background:
                    i === scenarioIdx
                      ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`
                      : "transparent",
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

        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "17px",
            color: INK_ON_CREAM_PRIMARY,
            lineHeight: 1.55,
            margin: 0,
            padding: "12px 14px",
            background: "rgba(255, 251, 240, 0.7)",
            border: `1px solid ${GOLD}33`,
            borderRadius: "8px",
          }}
        >
          {scenario.prompt}
        </p>

        {/* Options — radio-like single-select */}
        <div
          role="radiogroup"
          aria-label="Which tradition is being referenced?"
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        >
          {scenario.options.map((opt) => {
            const isPicked = picked === opt.slug;
            const isCorrectOption = opt.slug === scenario.correctSlug;
            let borderColor = "rgba(156, 122, 47, 0.30)";
            let bg = "rgba(255, 251, 240, 0.55)";
            let textColor = INK_ON_CREAM_PRIMARY;
            if (submitted) {
              if (isPicked && isCorrectOption) {
                borderColor = JADE;
                bg = "rgba(58, 140, 90, 0.10)";
                textColor = "#1F5A37";
              } else if (isPicked && !isCorrectOption) {
                borderColor = VERMILION;
                bg = "rgba(162, 58, 30, 0.10)";
                textColor = VERMILION;
              } else if (!isPicked && isCorrectOption) {
                borderColor = JADE;
                bg = "rgba(58, 140, 90, 0.06)";
              }
            } else if (isPicked) {
              borderColor = GOLD;
              bg = "linear-gradient(180deg, rgba(255, 248, 230, 0.96) 0%, rgba(252, 240, 210, 0.92) 100%)";
            }
            return (
              <button
                key={opt.slug}
                type="button"
                role="radio"
                aria-checked={isPicked}
                disabled={submitted}
                onClick={() => pick(opt.slug)}
                className="gl-focus-ring gl-clickable"
                style={{
                  padding: "10px 14px",
                  textAlign: "left",
                  background: bg,
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: "8px",
                  cursor: submitted ? "default" : "pointer",
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "14.5px",
                  color: textColor as string,
                  lineHeight: 1.4,
                  fontWeight: isPicked ? 600 : 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: reducedMotion
                    ? "none"
                    : "background 160ms ease, border-color 160ms ease",
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
                  }}
                />
                <span style={{ flex: 1 }}>{opt.label}</span>
                {submitted && isPicked && isCorrectOption && (
                  <span
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: JADE,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                    }}
                  >
                    ✓ correct
                  </span>
                )}
                {submitted && isPicked && !isCorrectOption && (
                  <span
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: VERMILION,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                    }}
                  >
                    not this
                  </span>
                )}
                {submitted && !isPicked && isCorrectOption && (
                  <span
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: JADE,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                    }}
                  >
                    correct answer
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          {!submitted ? (
            <button
              type="button"
              onClick={submit}
              disabled={!picked}
              className="gl-clickable gl-focus-ring"
              style={{
                padding: "8px 18px",
                background: !picked
                  ? "rgba(156, 122, 47, 0.18)"
                  : `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                color: !picked ? INK_ON_CREAM_MUTED : "#1A1408",
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

      {/* RIGHT: feedback / rationale */}
      <aside aria-live="polite" className="flex flex-col gap-3" style={{ minHeight: "520px" }}>
        {!submitted ? (
          <DrillGuidance />
        ) : (
          <DrillFeedback scenario={scenario} isCorrect={isCorrect} />
        )}
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
        How to use this drill
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "15px",
          color: INK_ON_CREAM_SECONDARY,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        For each scenario, read the prompt carefully and pick which tradition
        is being referenced. <em>Reveal</em> shows the correct answer,
        rationale, and the practitioner-discipline move from §4.4 that
        applies.
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "15px",
          color: INK_ON_CREAM_SECONDARY,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        Tradition classification is by <em>format and depth</em>, not just
        terminology. Western planet names appearing in pop-format content
        does not make that content traditional Western — it makes it pop
        using Western vocabulary.
      </p>

      {/* Scenarios at a glance — fills the bottom of the right panel */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "12px",
          borderTop: `1px dashed ${GOLD}55`,
        }}
      >
        <p
          className="uppercase"
          style={{
            fontSize: "11px",
            letterSpacing: "0.20em",
            color: GOLD_DEEP,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "10px",
          }}
        >
          The five scenarios
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "7px",
          }}
        >
          {DRILL_SCENARIOS.map((s, i) => (
            <li
              key={s.id}
              style={{
                display: "grid",
                gridTemplateColumns: "22px 1fr",
                gap: "10px",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: "20px",
                  height: "20px",
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
              <span
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "13.5px",
                  color: INK_ON_CREAM_SECONDARY,
                  lineHeight: 1.45,
                  fontStyle: "italic",
                }}
              >
                {s.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DrillFeedback({
  scenario,
  isCorrect,
}: {
  scenario: DrillScenario;
  isCorrect: boolean;
}) {
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
        {isCorrect ? "✓ Disambiguation confirmed" : "Rationale"}
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14px",
          color: INK_ON_CREAM_PRIMARY,
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
            color: INK_ON_CREAM_PRIMARY,
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
