/**
 * BPHS Citation Dojo — Lesson 2.2's §7 flagship interactive.
 *
 * Two-tab synthesis:
 *   - Tab 1 "Verse Cross-Reference" : the canonical Vimśottarī starting-
 *                                     daśā rule (BPHS Daśākramaprakaraṇa
 *                                     46.1 in Santhanam) shown as a full-
 *                                     width manuscript-style verse plate,
 *                                     with cross-references to the Sitaram
 *                                     Jha and Devacandra Jha recensions.
 *   - Tab 2 "Citation Drill"        : five citation-discipline scenarios
 *                                     specific to BPHS. Tests the four-
 *                                     move discipline applied to the
 *                                     curriculum's most-cited classical
 *                                     text.
 */

"use client";

import { useEffect, useState } from "react";
import { BookOpen, ScrollText } from "lucide-react";
import {
  VIMSHOTTARI_VERSE,
  DRILL_SCENARIOS,
  FRAMEWORK_SUMMARY,
  type DrillScenario,
} from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const VERMILION = "#A23A1E";
const VERMILION_DEEP = "#7A2A14";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const JADE = "#3A8C5A";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

type Tab = "verse" | "drill";

export function BphsCitationDojo() {
  const [tab, setTab] = useState<Tab>("verse");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{ padding: "20px 22px 22px" }}
      data-interactive="bphs-citation-dojo"
    >
      <div
        role="tablist"
        aria-label="Synthesis modes"
        style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}
      >
        <TabButton
          active={tab === "verse"}
          onClick={() => setTab("verse")}
          label="Verse Cross-Reference"
          sublabel="see one canonical verse across all three recensions"
          icon={<ScrollText size={14} />}
        />
        <TabButton
          active={tab === "drill"}
          onClick={() => setTab("drill")}
          label="Citation Discipline Drill"
          sublabel="drill the four-move discipline on BPHS scenarios"
          icon={<BookOpen size={14} />}
        />
      </div>

      {tab === "verse" ? (
        <VerseCrossReferenceView />
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
 * TAB 1 — Verse Cross-Reference
 * ═══════════════════════════════════════════════════════════════════════ */

function VerseCrossReferenceView() {
  const v = VIMSHOTTARI_VERSE;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <header>
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
          One verse, three recensions
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
          BPHS&apos;s most-cited single verse — the rule for the starting
          mahā-daśā lord. The DOCTRINE is stable across all three modern
          BPHS recensions. The CITATION REFERENCE differs.
        </p>
      </header>

      {/* The canonical verse plate */}
      <article
        style={{
          background: "linear-gradient(180deg, rgba(255, 249, 234, 0.95) 0%, rgba(252, 240, 210, 0.85) 100%)",
          border: `1px solid ${GOLD}66`,
          borderLeft: `4px solid ${GOLD}`,
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: `0 4px 14px rgba(74, 56, 24, 0.10), 0 1px 0 rgba(255,255,255,0.6) inset`,
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

        {/* Plate header */}
        <div
          style={{
            padding: "20px 28px 14px",
            borderBottom: `1px dashed ${GOLD}55`,
            textAlign: "center",
          }}
        >
          <p
            className="uppercase"
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontStyle: "italic",
              fontSize: "12px",
              letterSpacing: "0.20em",
              color: GOLD_DEEP,
              fontWeight: 700,
              margin: 0,
              marginBottom: "6px",
            }}
          >
            {v.santhanamCitation}
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "13px",
              color: INK_MUTED,
              margin: 0,
            }}
          >
            {v.santhanamPage}
          </p>
        </div>

        {/* Verse body */}
        <div style={{ padding: "26px 36px", textAlign: "center" }}>
          {/* Devanāgarī */}
          <p
            lang="sa"
            style={{
              fontFamily: "var(--font-devanagari), serif",
              fontSize: "26px",
              color: INK_PRIMARY,
              lineHeight: 1.7,
              margin: 0,
              whiteSpace: "pre-line",
            }}
          >
            {v.sanskritDevanagari}
          </p>
          {/* IAST */}
          <p
            lang="sa-Latn"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "17px",
              color: GOLD_DEEP,
              lineHeight: 1.65,
              margin: 0,
              marginTop: "16px",
              whiteSpace: "pre-line",
            }}
          >
            {v.iastTransliteration}
          </p>
          {/* English */}
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "16px",
              color: INK_PRIMARY,
              lineHeight: 1.7,
              margin: 0,
              marginTop: "16px",
              maxWidth: "640px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {v.englishTranslation}
          </p>
        </div>

        {/* Doctrinal point callout */}
        <div
          style={{
            margin: "0 28px 22px",
            padding: "14px 18px",
            background: `${VERMILION}10`,
            borderLeft: `3px solid ${VERMILION}`,
            borderRadius: "0 8px 8px 0",
          }}
        >
          <p
            className="uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              color: VERMILION,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "5px",
            }}
          >
            Why this verse matters
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "14.5px",
              color: INK_PRIMARY,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {v.doctrinalPoint}
          </p>
        </div>
      </article>

      {/* Three-recension cross-reference */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <p
          className="uppercase"
          style={{
            color: GOLD,
            letterSpacing: "0.20em",
            fontWeight: 700,
            fontSize: "12px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
            marginBottom: "4px",
          }}
        >
          Across three recensions
        </p>
        {v.crossReferences.map((cr, idx) => {
          const isCurriculumDefault = idx === 0;
          const tintColor = idx === 0 ? GOLD : idx === 1 ? INDIGO : VERMILION;
          const tintDeep = idx === 0 ? GOLD_DEEP : idx === 1 ? INDIGO_DEEP : VERMILION_DEEP;
          return (
            <div
              key={idx}
              style={{
                padding: "16px 20px",
                background: "rgba(255, 251, 240, 0.7)",
                border: `1px solid ${tintColor}55`,
                borderLeft: `4px solid ${tintColor}`,
                borderRadius: "0 10px 10px 0",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  className="uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.16em",
                    color: tintDeep,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    margin: 0,
                    marginBottom: "4px",
                  }}
                >
                  {cr.recension}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: tintDeep,
                    lineHeight: 1.3,
                    margin: 0,
                    marginBottom: "6px",
                  }}
                >
                  {cr.citation}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "13.5px",
                    color: INK_SECONDARY,
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {cr.notes}
                </p>
              </div>
              {isCurriculumDefault && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 12px",
                    borderRadius: "999px",
                    background: `${JADE}1f`,
                    border: `1px solid ${JADE}66`,
                    fontSize: "10.5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#1F5A37",
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  ✓ Curriculum default
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Framework summary */}
      <div
        style={{
          padding: "18px 22px",
          background: `linear-gradient(135deg, ${JADE}10 0%, ${GOLD}10 100%)`,
          border: `1px solid ${JADE}66`,
          borderRadius: "12px",
        }}
      >
        <p
          className="uppercase"
          style={{
            fontSize: "12px",
            letterSpacing: "0.20em",
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
            color: INK_PRIMARY,
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {FRAMEWORK_SUMMARY.body}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
 * TAB 2 — Citation Discipline Drill
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

        <div role="radiogroup" aria-label="Pick the correct citation framing" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
        BPHS citation moves
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
          "Name the PRAKARAṆA-DIVISION — e.g., Daśākramaprakaraṇa.",
          "Name the CHAPTER:VERSE in Santhanam-numbering — e.g., 46.1.",
          "Name the TRANSLATOR-EDITION — Santhanam 1996, Vol II, p. 1024.",
          "Acknowledge the MEDIEVAL-RECENSIONAL layer separating text from pre-classical core.",
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
