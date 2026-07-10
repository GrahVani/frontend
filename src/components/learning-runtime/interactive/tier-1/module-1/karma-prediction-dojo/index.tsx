/**
 * Karma-Prediction Dojo — Lesson 4's §7 flagship interactive.
 *
 * Two-tab synthesis layer (constitution §10.1):
 *
 *   - Tab 1 "Visibility vs Agency": an inverse-axis bar visualisation. For each
 *                                   of the four karma types, two mirrored bars
 *                                   grow from the centre — "what Jyotiṣa sees"
 *                                   (vermilion, left) and "what the agent
 *                                   controls" (jade, right), driven by the
 *                                   OVERLAYS intensities (jyotisha-sees +
 *                                   agency-window). Showing both at once makes
 *                                   L4's central pedagogy visible: the chart
 *                                   reads prārabdha most strongly; the agent
 *                                   acts most freely in kriyamāṇa — inverse axes.
 *
 *   - Tab 2 "Indication Translator": five deterministic statements ("you
 *                                   will get the promotion Friday", "Friday
 *                                   is your lucky day", etc.) — user picks
 *                                   the doctrinally-correct indication-with-
 *                                   confidence-tier framing. Tests L4's
 *                                   core practitioner skill.
 *
 * Distinct from §4's KarmaTypologyExplorer (which is per-karma definitional
 * exploration). §7 = synthesise the predictive scope + drill the translation
 * skill.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, BookOpen, Eye, Hand } from "lucide-react";
import {
  KARMA_NODES,
  CYCLE_FLOWS,
} from "../karma-typology-explorer/data";
import {
  OVERLAYS,
  TRANSLATION_SCENARIOS,
  FRAMEWORK_SUMMARY,
  type CycleOverlay,
  type TranslationScenario,
} from "./data";

const VIEWBOX = 500;
const CENTRE = VIEWBOX / 2;

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const VERMILION = "#A23A1E";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const JADE = "#3A8C5A";
const PARCHMENT = "#FFF6E6";
const INK_ON_CREAM_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_ON_CREAM_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_ON_CREAM_MUTED = "var(--gl-ink-on-cream-muted)";

type Tab = "cycle" | "drill";

export function KarmaPredictionDojo() {
  const [tab, setTab] = useState<Tab>("cycle");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{ padding: "20px 22px 22px" }}
      data-interactive="karma-prediction-dojo"
    >
      {/* Tab switcher */}
      <div
        role="tablist"
        aria-label="Synthesis modes"
        style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}
      >
        <TabButton
          active={tab === "cycle"}
          onClick={() => setTab("cycle")}
          label="Visibility vs Agency"
          sublabel="what the chart sees vs what the agent controls"
          icon={<Eye size={14} />}
        />
        <TabButton
          active={tab === "drill"}
          onClick={() => setTab("drill")}
          label="Indication Translator"
          sublabel="drill the deterministic-to-indication move"
          icon={<BookOpen size={14} />}
        />
      </div>

      {tab === "cycle" ? (
        <CycleInMotionView reducedMotion={reducedMotion} />
      ) : (
        <TranslatorView reducedMotion={reducedMotion} />
      )}
    </div>
  );
}

/* ────────────────────── Tab switcher button ───────────────────────── */

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
        <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "17px", fontWeight: 600, color: INK_ON_CREAM_PRIMARY }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "12.5px", color: INK_ON_CREAM_SECONDARY, marginTop: "2px" }}>
          {sublabel}
        </span>
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
 * TAB 1 — Cycle in Motion
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * Per-karma tint for the inverse-axis bar viz. Same colours as §4's cycle
 * nodes so the karma-type identity carries across both sections.
 */
function karmaTint(slug: string) {
  switch (slug) {
    case "samcita":
      return { stroke: GOLD, ink: GOLD_DEEP, fill: "rgba(156, 122, 47, 0.32)" };
    case "prarabdha":
      return { stroke: VERMILION, ink: VERMILION, fill: "rgba(162, 58, 30, 0.30)" };
    case "kriyamana":
      return { stroke: JADE, ink: "#1F5A37", fill: "rgba(58, 140, 90, 0.32)" };
    case "agami":
    default:
      return { stroke: INDIGO, ink: INDIGO_DEEP, fill: "rgba(79, 111, 168, 0.30)" };
  }
}

function CycleInMotionView({ reducedMotion }: { reducedMotion: boolean }) {
  // Per-karma visibility (chart-reading reach) and agency (agent control level).
  // Derived from the OVERLAYS data — illustrative intensities, not precise claims.
  const visibility = OVERLAYS.find((o) => o.slug === "jyotisha-sees")!.highlight;
  const agency = OVERLAYS.find((o) => o.slug === "agency-window")!.highlight;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 items-stretch">
      {/* LEFT: inverse-axis bar visualisation */}
      <div className="flex flex-col" style={{ minHeight: "520px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "10px",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}
        >
          <p
            className="uppercase"
            style={{
              color: GOLD,
              letterSpacing: "0.18em",
              fontWeight: 700,
              fontSize: "13px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              margin: 0,
            }}
          >
            Inverse axes — the same karma, two lenses
          </p>
        </header>

        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "16.5px",
            color: INK_ON_CREAM_PRIMARY,
            lineHeight: 1.6,
            margin: "0 0 22px",
          }}
        >
          For each karma type, two bars grow outward from the centre: the{" "}
          <span style={{ color: VERMILION, fontWeight: 700 }}>vermilion bar</span>{" "}
          to the left shows how much of that karma <em>Jyotiṣa can read</em>;
          the <span style={{ color: "#1F5A37", fontWeight: 700 }}>jade bar</span>{" "}
          to the right shows how much of it the <em>agent controls</em>. The
          inversion is the lesson.
        </p>

        {/* Column eyebrow headers */}
        <div
          aria-hidden
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(140px, 160px) minmax(0, 1fr)",
            gap: "10px",
            alignItems: "baseline",
            marginBottom: "10px",
            paddingBottom: "8px",
            borderBottom: `1px dashed ${GOLD}33`,
          }}
        >
          <p
            className="uppercase"
            style={{
              color: VERMILION,
              letterSpacing: "0.14em",
              fontWeight: 700,
              fontSize: "12px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              textAlign: "right",
              margin: 0,
              display: "inline-flex",
              gap: "6px",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Eye size={13} />← What Jyotiṣa sees
          </p>
          <p
            className="uppercase"
            style={{
              color: GOLD_DEEP,
              letterSpacing: "0.16em",
              fontWeight: 700,
              fontSize: "12px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              textAlign: "center",
              margin: 0,
            }}
          >
            karma
          </p>
          <p
            className="uppercase"
            style={{
              color: "#1F5A37",
              letterSpacing: "0.14em",
              fontWeight: 700,
              fontSize: "12px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              textAlign: "left",
              margin: 0,
              display: "inline-flex",
              gap: "6px",
              alignItems: "center",
            }}
          >
            <Hand size={13} />Agent controls →
          </p>
        </div>

        {/* Four karma rows with mirrored bars */}
        <div
          role="img"
          aria-label="Inverse-axis bar chart. For each of the four karma types, two bars: chart visibility on the left, agent agency on the right. Prārabdha has the highest chart visibility and lowest agency. Kriyamāṇa has the lowest chart visibility and highest agency. The two axes are inverse — what the chart reads, the agent does not control; what the agent controls, the chart cannot read."
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {KARMA_NODES.map((n) => {
            const tint = karmaTint(n.slug);
            const visPct = Math.round(visibility[n.slug as keyof typeof visibility] * 100);
            const agnPct = Math.round(agency[n.slug as keyof typeof agency] * 100);
            return (
              <div
                key={n.slug}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(140px, 160px) minmax(0, 1fr)",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                {/* LEFT: visibility bar (vermilion-tinted, right-anchored) */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    height: "44px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "15px",
                      color: VERMILION,
                      fontWeight: 700,
                      marginRight: "10px",
                      flexShrink: 0,
                    }}
                  >
                    {visPct}%
                  </span>
                  <div
                    style={{
                      width: `${visPct}%`,
                      height: "26px",
                      background: `linear-gradient(to left, ${VERMILION}cc, ${VERMILION}55)`,
                      border: `1.5px solid ${VERMILION}`,
                      borderRadius: "0 4px 4px 0",
                      transition: reducedMotion
                        ? "none"
                        : "width 420ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                    }}
                  />
                </div>

                {/* CENTRE: karma label */}
                <div
                  style={{
                    textAlign: "center",
                    padding: "8px 12px",
                    background: tint.fill,
                    border: `1.5px solid ${tint.stroke}`,
                    borderRadius: "999px",
                  }}
                >
                  <p
                    lang="sa"
                    style={{
                      fontFamily: "var(--font-devanagari), serif",
                      fontSize: "18px",
                      color: tint.ink,
                      margin: 0,
                      lineHeight: 1.1,
                    }}
                  >
                    {n.devanagari}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontStyle: "italic",
                      fontSize: "14px",
                      color: tint.ink,
                      fontWeight: 600,
                      margin: 0,
                      marginTop: "3px",
                      lineHeight: 1.1,
                    }}
                  >
                    {n.iast}
                  </p>
                </div>

                {/* RIGHT: agency bar (jade-tinted, left-anchored) */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: "44px",
                  }}
                >
                  <div
                    style={{
                      width: `${agnPct}%`,
                      height: "26px",
                      background: `linear-gradient(to right, ${JADE}cc, ${JADE}55)`,
                      border: `1.5px solid ${JADE}`,
                      borderRadius: "4px 0 0 4px",
                      transition: reducedMotion
                        ? "none"
                        : "width 420ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "15px",
                      color: "#1F5A37",
                      fontWeight: 700,
                      marginLeft: "10px",
                      flexShrink: 0,
                    }}
                  >
                    {agnPct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom annotation — the inversion claim */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "12px",
            borderTop: `1px dashed ${GOLD}33`,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "14.5px",
              color: INK_ON_CREAM_SECONDARY,
              lineHeight: 1.6,
              margin: 0,
              flex: 1,
            }}
          >
            What the chart reads <strong style={{ color: VERMILION, fontWeight: 700, fontStyle: "normal" }}>most</strong>{" "}
            (prārabdha) is what the agent controls <strong style={{ color: "#1F5A37", fontWeight: 700, fontStyle: "normal" }}>least</strong>. What the agent controls{" "}
            <strong style={{ color: "#1F5A37", fontWeight: 700, fontStyle: "normal" }}>most</strong>{" "}
            (kriyamāṇa) is what the chart reads <strong style={{ color: VERMILION, fontWeight: 700, fontStyle: "normal" }}>least</strong>. The two axes are inverse — and that is the doctrinal claim.
          </p>
        </div>
      </div>

      {/* RIGHT: per-karma reading legend + framework summary */}
      <aside className="flex flex-col gap-3" aria-live="polite" style={{ minHeight: "520px" }}>
        <p
          className="uppercase"
          style={{
            color: GOLD,
            letterSpacing: "0.18em",
            fontWeight: 700,
            fontSize: "12px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
            marginBottom: "4px",
          }}
        >
          How to read the bars
        </p>
        {KARMA_NODES.map((n) => {
          const tint = karmaTint(n.slug);
          const visPct = Math.round(visibility[n.slug as keyof typeof visibility] * 100);
          const agnPct = Math.round(agency[n.slug as keyof typeof agency] * 100);
          const reading =
            n.slug === "samcita"
              ? "Vast latent stock — chart can't see most of it; agent didn't accumulate it intentionally."
              : n.slug === "prarabdha"
                ? "The primary subject matter of natal chart-reading — but committed, so the agent can't change it."
                : n.slug === "kriyamana"
                  ? "Pure agency window. The chart cannot foreclose what hasn't yet been chosen."
                  : "Partial-visibility, partial-agency. Formation patterns visible; specifics depend on choices.";
          return (
            <div
              key={`legend-${n.slug}`}
              style={{
                padding: "10px 12px",
                background: "rgba(255, 251, 240, 0.6)",
                border: `1px solid ${tint.stroke}55`,
                borderLeft: `3px solid ${tint.stroke}`,
                borderRadius: "0 6px 6px 0",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "15px",
                  color: INK_ON_CREAM_PRIMARY,
                  lineHeight: 1.45,
                  margin: 0,
                  marginBottom: "4px",
                }}
              >
                <strong style={{ color: tint.ink, fontWeight: 700, fontSize: "16px" }}>{n.iast}</strong>{" "}
                <span style={{ color: VERMILION, fontWeight: 700 }}>vis {visPct}%</span>
                <span style={{ color: INK_ON_CREAM_MUTED, margin: "0 6px" }}>·</span>
                <span style={{ color: "#1F5A37", fontWeight: 700 }}>agn {agnPct}%</span>
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  fontSize: "13.5px",
                  color: INK_ON_CREAM_SECONDARY,
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {reading}
              </p>
            </div>
          );
        })}

        {/* Framework summary callout */}
        <div
          style={{
            marginTop: "auto",
            padding: "14px 16px",
            background: `linear-gradient(135deg, ${JADE}10 0%, ${GOLD}10 100%)`,
            border: `1px solid ${JADE}66`,
            borderRadius: "10px",
          }}
        >
          <p
            className="uppercase"
            style={{
              fontSize: "12px",
              letterSpacing: "0.18em",
              color: "#1F5A37",
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "8px",
            }}
          >
            ✓ {FRAMEWORK_SUMMARY.headline}
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "14.5px",
              color: INK_ON_CREAM_PRIMARY,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {FRAMEWORK_SUMMARY.body}
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
 * TAB 2 — Indication Translator
 * ═══════════════════════════════════════════════════════════════════════ */

function TranslatorView({ reducedMotion }: { reducedMotion: boolean }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [pickedById, setPickedById] = useState<Record<string, string | null>>({});
  const [submittedById, setSubmittedById] = useState<Record<string, boolean>>({});

  const scenario = TRANSLATION_SCENARIOS[scenarioIdx];
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
      {/* LEFT: deterministic prompt + translation options */}
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
            Scenario {scenarioIdx + 1} of {TRANSLATION_SCENARIOS.length}
          </p>
          <div style={{ display: "flex", gap: "6px" }}>
            {TRANSLATION_SCENARIOS.map((s, i) => (
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

        {/* Deterministic statement card */}
        <div
          style={{
            padding: "14px 16px",
            background: `${VERMILION}10`,
            borderLeft: `4px solid ${VERMILION}`,
            borderRadius: "0 8px 8px 0",
          }}
        >
          <p
            className="uppercase"
            style={{
              color: VERMILION,
              letterSpacing: "0.16em",
              fontWeight: 700,
              fontSize: "11px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "6px",
            }}
          >
            Deterministic statement
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "17px",
              color: INK_ON_CREAM_PRIMARY,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            &ldquo;{scenario.deterministic}&rdquo;
          </p>
        </div>

        <p
          className="uppercase"
          style={{
            color: GOLD,
            letterSpacing: "0.16em",
            fontWeight: 700,
            fontSize: "11px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
          }}
        >
          Pick the doctrinally-correct indication framing
        </p>

        {/* Options */}
        <div role="radiogroup" aria-label="Translation options" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {scenario.options.map((opt) => {
            const isPicked = picked === opt.id;
            const isCorrectOption = opt.id === scenario.correctId;
            let borderColor = "rgba(156, 122, 47, 0.30)";
            let bg = "rgba(255, 251, 240, 0.55)";
            let textColor: string = INK_ON_CREAM_PRIMARY;
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

        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          {!submitted ? (
            <button
              type="button"
              onClick={submit}
              disabled={!picked}
              className="gl-clickable gl-focus-ring"
              style={{
                padding: "8px 18px",
                background: !picked ? "rgba(156, 122, 47, 0.18)" : `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
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

      {/* RIGHT: rationale or guidance */}
      <aside className="flex flex-col gap-3" aria-live="polite" style={{ minHeight: "520px" }}>
        {!submitted ? (
          <TranslatorGuidance />
        ) : (
          <TranslatorFeedback scenario={scenario} isCorrect={isCorrect} />
        )}
      </aside>
    </div>
  );
}

function TranslatorGuidance() {
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
        How to translate
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14.5px",
          color: INK_ON_CREAM_SECONDARY,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        A doctrinally-correct indication framing typically does four things:
        names a <em>confidence tier</em> (strong / moderate / weak), gives a{" "}
        <em>realistic time window</em> rather than a specific day, cites the{" "}
        <em>technical apparatus</em> the indication reads (daśā, transit,
        bhāva), and <em>preserves the agent&apos;s agency</em> over
        kriyamāṇa choices.
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14.5px",
          color: INK_ON_CREAM_SECONDARY,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        The wrong options carry subtle but real mistakes — too vague, too
        deterministic still, refusing entirely when the chart CAN read,
        overclaiming when it cannot.
      </p>

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
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "7px" }}>
          {TRANSLATION_SCENARIOS.map((s, i) => (
            <li key={s.id} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: "10px", alignItems: "flex-start" }}>
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
              <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "13.5px", color: INK_ON_CREAM_SECONDARY, lineHeight: 1.45, fontStyle: "italic" }}>
                {s.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TranslatorFeedback({
  scenario,
  isCorrect,
}: {
  scenario: TranslationScenario;
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
        {isCorrect ? "✓ Indication translation correct" : "Rationale"}
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
          {scenario.primaryKarma === "beyond-scope" ? "Beyond chart scope" : "Primary karma read"}
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "13px",
            color: INK_ON_CREAM_PRIMARY,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {scenario.primaryKarma === "beyond-scope" ? (
            "The honest framing here is refusal — outcomes like these sit outside what the chart claims to read, so no karma type gives it honest access. Naming the limit IS the correct indication."
          ) : (
            <>
              The correct indication framing primarily reads{" "}
              <strong style={{ fontWeight: 600 }}>{scenario.primaryKarma}</strong> — that is the karma type the chart can honestly access.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
