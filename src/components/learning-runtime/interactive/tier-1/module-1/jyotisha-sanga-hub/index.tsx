/**
 * Jyotiṣa-Sāṅga Synthesis Hub — Lesson 2's §7 flagship interactive.
 *
 * Two-tab synthesis layer (constitution §10.1 — §7 Primary Simulator):
 *   - Tab 1 "Jyotiṣa Hub"        : SVG hub-and-spoke. Jyotiṣa at centre,
 *                                  five Vedāṅga nodes around it, animated
 *                                  spoke-lines. Click a node → the spoke
 *                                  lights, the right panel reveals the
 *                                  interlock detail (mantra / citation /
 *                                  ritual-timing / etymology / metre).
 *                                  Modern-practice overlay toggle re-tints
 *                                  the nodes by operational-vs-occasional.
 *                                  Sāṅga panel toggle reveals Pāṇinīya
 *                                  Śikṣā 42's closing verse.
 *   - Tab 2 "Sāṅga Scenarios"    : Three Vedic-life tasks. Pick which
 *                                  Vedāṅgas are involved → submit → green
 *                                  for the correctly identified, vermilion
 *                                  for misses. Rationale paragraph
 *                                  reveals on submission. The "sāṅga"
 *                                  mental-model viscerally tested.
 *
 * This is distinct from §4's VedangaRelationshipDiagram (which is the
 * explore-each-petal row panel). §7 is the synthesize-the-system flagship.
 *
 * Constitutional invariants honoured:
 *   - gl-focus-ring on every clickable
 *   - prefers-reduced-motion respected
 *   - No internal h3 inside the interactive (only h4 + eyebrows)
 *   - Sizes from the chrome token universe
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, BookOpen, Sigma } from "lucide-react";
import {
  HUB_POSITIONS,
  HUB_SPOKES,
  SANGA_VERSE,
  SCENARIOS,
  type InterlockSpoke,
  type SangaScenario,
  type VedangaSlug,
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

type Tab = "hub" | "scenarios";

const ALL_VEDANGAS: { slug: VedangaSlug; iast: string; devanagari: string }[] = [
  { slug: "shiksha",   iast: "Śikṣā",     devanagari: "शिक्षा" },
  { slug: "kalpa",     iast: "Kalpa",     devanagari: "कल्प" },
  { slug: "vyakarana", iast: "Vyākaraṇa", devanagari: "व्याकरण" },
  { slug: "nirukta",   iast: "Nirukta",   devanagari: "निरुक्त" },
  { slug: "chandas",   iast: "Chandas",   devanagari: "छन्दस्" },
  { slug: "jyotisha",  iast: "Jyotiṣa",   devanagari: "ज्योतिष" },
];

export function JyotishaSangaHub() {
  const [tab, setTab] = useState<Tab>("hub");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{ padding: "20px 22px 22px" }}
      data-interactive="jyotisha-sanga-hub"
    >
      {/* Tab switcher — two clearly-separated modes */}
      <div
        role="tablist"
        aria-label="Synthesis modes"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <TabButton
          active={tab === "hub"}
          onClick={() => setTab("hub")}
          label="Jyotiṣa Hub"
          sublabel="visualise the five interlocks"
          icon={<Sigma size={14} />}
        />
        <TabButton
          active={tab === "scenarios"}
          onClick={() => setTab("scenarios")}
          label="Sāṅga Scenarios"
          sublabel="test the with-all-limbs habit"
          icon={<BookOpen size={14} />}
        />
      </div>

      {tab === "hub" ? (
        <HubView reducedMotion={reducedMotion} />
      ) : (
        <ScenariosView reducedMotion={reducedMotion} />
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
        flex: "1 1 220px",
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
 * TAB 1 — Jyotiṣa Hub
 * ═══════════════════════════════════════════════════════════════════════ */

function HubView({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeSlug, setActiveSlug] = useState<InterlockSpoke["slug"] | null>(null);
  const [modernPracticeOverlay, setModernPracticeOverlay] = useState(false);
  const [sangaOpen, setSangaOpen] = useState(false);

  const active = activeSlug ? HUB_SPOKES.find((s) => s.slug === activeSlug) ?? null : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6 items-stretch">
      {/* LEFT: SVG hub-and-spoke */}
      <div className="flex flex-col items-center" style={{ minHeight: "480px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            width: "100%",
            marginBottom: "14px",
            gap: "12px",
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
            Five active interlocks
          </p>
          <button
            type="button"
            onClick={() => setModernPracticeOverlay((v) => !v)}
            aria-pressed={modernPracticeOverlay}
            className="gl-clickable gl-focus-ring"
            style={{
              background: modernPracticeOverlay
                ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`
                : "transparent",
              color: modernPracticeOverlay ? "#1A1408" : GOLD_DEEP,
              border: `1.5px solid ${modernPracticeOverlay ? GOLD : `${GOLD}88`}`,
              borderRadius: "999px",
              padding: "5px 11px",
              fontSize: "10.5px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              boxShadow: modernPracticeOverlay ? `0 4px 10px ${GOLD}44` : "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              whiteSpace: "nowrap",
            }}
          >
            <Sparkles size={10} />
            Practice {modernPracticeOverlay ? "on" : "off"}
          </button>
        </header>

        <svg
          viewBox="0 0 400 400"
          style={{
            width: "100%",
            maxWidth: "420px",
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
          role="img"
          aria-label="Jyotiṣa at the centre, five Vedāṅga interlock nodes around it. Click a node to read its coupling."
        >
          {/* Faint backdrop circle around the hub */}
          <circle cx="200" cy="200" r="158" fill="none" stroke={`${GOLD}22`} strokeWidth="1" strokeDasharray="3 6" />

          {/* Spokes — drawn first so nodes sit on top */}
          {HUB_SPOKES.map((s) => {
            const pos = HUB_POSITIONS[s.slug];
            const isActive = activeSlug === s.slug;
            return (
              <line
                key={`spoke-${s.slug}`}
                x1={200}
                y1={200}
                x2={pos.x}
                y2={pos.y}
                stroke={isActive ? VERMILION : `${GOLD}88`}
                strokeWidth={isActive ? 3 : 1.5}
                strokeLinecap="round"
                style={{
                  transition: reducedMotion ? "none" : "stroke 220ms ease, stroke-width 220ms ease",
                }}
              />
            );
          })}

          {/* Centre node — Jyotiṣa (jade) */}
          <g>
            <circle
              cx={200}
              cy={200}
              r={48}
              fill="rgba(255, 251, 240, 0.95)"
              stroke={JADE}
              strokeWidth={2.5}
              style={{
                filter: reducedMotion
                  ? "none"
                  : "drop-shadow(0 0 12px rgba(58, 140, 90, 0.25))",
              }}
            />
            <text
              x={200}
              y={196}
              textAnchor="middle"
              style={{
                fontFamily: "var(--font-devanagari), serif",
                fontSize: "22px",
                fill: GOLD_DEEP,
                pointerEvents: "none",
              }}
            >
              ज्योतिष
            </text>
            <text
              x={200}
              y={216}
              textAnchor="middle"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "13px",
                fontStyle: "italic",
                fill: JADE,
                fontWeight: 600,
                pointerEvents: "none",
              }}
            >
              Jyotiṣa
            </text>
          </g>

          {/* Surrounding nodes */}
          {HUB_SPOKES.map((s) => {
            const pos = HUB_POSITIONS[s.slug];
            const isActive = activeSlug === s.slug;
            const tint = modernPracticeOverlay
              ? s.modernPractice === "operational"
                ? "#3A8C5A"
                : "#C28220"
              : GOLD;
            return (
              <g
                key={`node-${s.slug}`}
                style={{ cursor: "pointer" }}
                onClick={() => setActiveSlug(s.slug)}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 40 : 34}
                  fill={isActive ? "rgba(255, 248, 230, 1)" : "rgba(255, 251, 240, 0.92)"}
                  stroke={isActive ? VERMILION : tint}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{
                    transition: reducedMotion
                      ? "none"
                      : "r 220ms ease, stroke 220ms ease, stroke-width 220ms ease",
                  }}
                />
                <text
                  x={pos.x}
                  y={pos.y - 4}
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-devanagari), serif",
                    fontSize: "16px",
                    fill: GOLD_DEEP,
                    pointerEvents: "none",
                  }}
                >
                  {s.devanagari}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 12}
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "12px",
                    fontStyle: "italic",
                    fill: tint,
                    fontWeight: 600,
                    pointerEvents: "none",
                  }}
                >
                  {s.iast}
                </text>
              </g>
            );
          })}

          {/* Invisible larger hit regions for accessibility */}
          {HUB_SPOKES.map((s, idx) => {
            const pos = HUB_POSITIONS[s.slug];
            return (
              <circle
                key={`hit-${s.slug}`}
                cx={pos.x}
                cy={pos.y}
                r={42}
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={`${s.iast} — Jyotiṣa-${s.interlockLabel} interlock. ${s.interlockBrief}`}
                aria-pressed={activeSlug === s.slug}
                onClick={() => setActiveSlug(s.slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveSlug(s.slug);
                  } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveSlug(HUB_SPOKES[(idx + 1) % HUB_SPOKES.length].slug);
                  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveSlug(
                      HUB_SPOKES[(idx - 1 + HUB_SPOKES.length) % HUB_SPOKES.length].slug,
                    );
                  } else if (e.key === "Escape") {
                    setActiveSlug(null);
                  }
                }}
                style={{ cursor: "pointer", outline: "none" }}
              />
            );
          })}
        </svg>

        <p
          className="text-center italic mt-3"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: INK_ON_CREAM_SECONDARY,
            maxWidth: "360px",
            fontSize: "13.5px",
            lineHeight: 1.5,
          }}
        >
          Click any of the five surrounding Vedāṅgas to see how Jyotiṣa
          interlocks with it in modern practice.
        </p>
      </div>

      {/* RIGHT: side panel — interlock detail or sāṅga */}
      <aside className="flex flex-col gap-3" aria-live="polite" style={{ minHeight: "480px" }}>
        <button
          type="button"
          onClick={() => setSangaOpen((v) => !v)}
          aria-pressed={sangaOpen}
          className="gl-clickable gl-focus-ring"
          style={{
            alignSelf: "stretch",
            padding: "10px 14px",
            background: sangaOpen
              ? `linear-gradient(135deg, ${INDIGO}1f, ${INDIGO}2f)`
              : "rgba(255, 251, 240, 0.55)",
            border: `1.5px solid ${sangaOpen ? INDIGO : `${GOLD}55`}`,
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textAlign: "left",
          }}
        >
          <span
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              background: sangaOpen ? INDIGO : "rgba(79, 111, 168, 0.15)",
              color: sangaOpen ? "#FFFCF0" : INDIGO,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <BookOpen size={13} />
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span
              className="uppercase"
              style={{
                fontSize: "10.5px",
                letterSpacing: "0.16em",
                color: sangaOpen ? INDIGO : GOLD_DEEP,
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
              }}
            >
              Sāṅga panel
            </span>
            <span
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "12.5px",
                color: INK_ON_CREAM_SECONDARY,
                marginTop: "1px",
              }}
            >
              {sangaOpen ? "showing Pāṇinīya Śikṣā 42" : "Pāṇinīya Śikṣā 42 (tap to open)"}
            </span>
          </span>
        </button>

        {sangaOpen && <SangaPanel />}

        {active ? (
          <InterlockDetail node={active} />
        ) : (
          !sangaOpen && <HubGuidance />
        )}
      </aside>
    </div>
  );
}

function HubGuidance() {
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
        gap: "10px",
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
        }}
      >
        How to use this
      </p>
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14px",
          color: INK_ON_CREAM_SECONDARY,
          lineHeight: 1.5,
        }}
      >
        {[
          <>
            <strong style={{ color: INK_ON_CREAM_PRIMARY as string, fontWeight: 600 }}>
              Click a surrounding node
            </strong>
            . The spoke to Jyotiṣa lights vermilion and the coupling appears here.
          </>,
          <>
            <strong style={{ color: INK_ON_CREAM_PRIMARY as string, fontWeight: 600 }}>
              Toggle &ldquo;Practice on&rdquo;
            </strong>{" "}
            (top-right) to see which interlocks are <em>operational</em>{" "}
            (jade) vs <em>occasional</em> (bronze) in modern practice.
          </>,
          <>
            <strong style={{ color: INK_ON_CREAM_PRIMARY as string, fontWeight: 600 }}>
              Open the Sāṅga panel
            </strong>{" "}
            above to read Pāṇinīya Śikṣā 42&apos;s closing verse — the classical name for the with-all-limbs discipline.
          </>,
        ].map((node, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
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
            <span>{node}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function InterlockDetail({ node }: { node: InterlockSpoke }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "14px 16px",
        background: "rgba(255, 251, 240, 0.75)",
        border: `1px solid ${GOLD}55`,
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
          color: VERMILION,
          fontWeight: 700,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        Jyotiṣa &times; {node.iast} interlock
      </p>
      <h4
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "20px",
          fontWeight: 500,
          color: INK_ON_CREAM_PRIMARY,
          lineHeight: 1.25,
          margin: 0,
        }}
      >
        {node.interlockLabel}{" "}
        <span
          lang="sa"
          style={{
            fontFamily: "var(--font-devanagari), serif",
            fontSize: "16px",
            color: GOLD_DEEP,
            marginLeft: "6px",
            fontWeight: 400,
          }}
        >
          {node.devanagari}
        </span>
      </h4>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14px",
          color: INK_ON_CREAM_PRIMARY,
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {node.interlockDetail}
      </p>
      <span
        style={{
          alignSelf: "flex-start",
          marginTop: "auto",
          padding: "3px 10px",
          borderRadius: "999px",
          background: node.modernPractice === "operational" ? "rgba(58, 140, 90, 0.15)" : "rgba(194, 130, 32, 0.18)",
          border: `1px solid ${node.modernPractice === "operational" ? "#3A8C5A66" : "#C2822066"}`,
          color: node.modernPractice === "operational" ? "#1F5A37" : "#7A5212",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontWeight: 700,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        {node.modernPractice} in modern practice
      </span>
    </div>
  );
}

function SangaPanel() {
  return (
    <div
      style={{
        padding: "14px 16px",
        background: `linear-gradient(135deg, ${INDIGO}10 0%, ${GOLD}10 100%)`,
        border: `1px solid ${INDIGO}55`,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <p
        className="uppercase"
        style={{
          fontSize: "11px",
          letterSpacing: "0.18em",
          color: INDIGO,
          fontWeight: 700,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        Pāṇinīya Śikṣā 42 — closing verse
      </p>
      <p
        lang="sa"
        style={{
          fontFamily: "var(--font-devanagari), serif",
          fontSize: "22px",
          color: INK_ON_CREAM_PRIMARY,
          lineHeight: 1.45,
          margin: 0,
        }}
      >
        {SANGA_VERSE.devanagari}
      </p>
      <p
        lang="sa-Latn"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "15px",
          color: INK_ON_CREAM_SECONDARY,
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {SANGA_VERSE.iast}
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14px",
          color: INK_ON_CREAM_PRIMARY,
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {SANGA_VERSE.english}
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "11.5px",
          color: INK_ON_CREAM_MUTED,
          margin: 0,
          marginTop: "2px",
        }}
      >
        — {SANGA_VERSE.source}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
 * TAB 2 — Sāṅga Scenarios
 * ═══════════════════════════════════════════════════════════════════════ */

function ScenariosView({ reducedMotion }: { reducedMotion: boolean }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selectedBySlug, setSelectedBySlug] = useState<Record<string, Set<VedangaSlug>>>(
    {},
  );
  const [submittedBySlug, setSubmittedBySlug] = useState<Record<string, boolean>>({});

  const scenario = SCENARIOS[scenarioIdx];
  const selected = selectedBySlug[scenario.id] ?? new Set<VedangaSlug>();
  const submitted = submittedBySlug[scenario.id] ?? false;

  const correctSet = useMemo(
    () => new Set(scenario.correctSlugs),
    [scenario.correctSlugs],
  );

  function toggle(slug: VedangaSlug) {
    if (submitted) return;
    setSelectedBySlug((prev) => {
      const next = new Set(prev[scenario.id] ?? new Set<VedangaSlug>());
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return { ...prev, [scenario.id]: next };
    });
  }

  function submit() {
    setSubmittedBySlug((prev) => ({ ...prev, [scenario.id]: true }));
  }

  function reset() {
    setSelectedBySlug((prev) => ({ ...prev, [scenario.id]: new Set() }));
    setSubmittedBySlug((prev) => ({ ...prev, [scenario.id]: false }));
  }

  const allCorrect =
    submitted &&
    selected.size === correctSet.size &&
    [...correctSet].every((s) => selected.has(s));

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6 items-stretch">
      {/* LEFT: scenario presentation */}
      <div className="flex flex-col gap-4" style={{ minHeight: "480px" }}>
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
            Scenario {scenarioIdx + 1} of {SCENARIOS.length}
          </p>
          <div style={{ display: "flex", gap: "6px" }}>
            {SCENARIOS.map((s, i) => (
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
                  border: `1.5px solid ${
                    i === scenarioIdx ? GOLD : "rgba(156, 122, 47, 0.35)"
                  }`,
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

        <h4
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "22px",
            fontWeight: 500,
            color: INK_ON_CREAM_PRIMARY,
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {scenario.title}
        </h4>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "16px",
            color: INK_ON_CREAM_SECONDARY,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {scenario.prompt}
        </p>

        {/* Chips — six Vedāṅgas, multi-select */}
        <div
          role="group"
          aria-label="Pick the operationally-involved Vedāṅgas"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "10px",
          }}
        >
          {ALL_VEDANGAS.map((v) => {
            const isSelected = selected.has(v.slug);
            const isCorrect = correctSet.has(v.slug);
            let chipColor = GOLD;
            let chipBg = "rgba(255, 251, 240, 0.7)";
            let chipText = INK_ON_CREAM_PRIMARY;
            if (submitted) {
              if (isSelected && isCorrect) {
                chipColor = JADE;
                chipBg = "rgba(58, 140, 90, 0.18)";
                chipText = "#1F5A37";
              } else if (isSelected && !isCorrect) {
                chipColor = VERMILION;
                chipBg = "rgba(162, 58, 30, 0.12)";
                chipText = VERMILION;
              } else if (!isSelected && isCorrect) {
                chipColor = JADE;
                chipBg = "rgba(58, 140, 90, 0.10)";
                chipText = "#1F5A37";
              } else {
                chipColor = "rgba(156, 122, 47, 0.35)";
                chipBg = "rgba(255, 251, 240, 0.45)";
                chipText = INK_ON_CREAM_MUTED as string;
              }
            } else if (isSelected) {
              chipColor = GOLD;
              chipBg = `linear-gradient(180deg, rgba(255, 248, 230, 0.96) 0%, rgba(252, 240, 210, 0.92) 100%)`;
            }
            return (
              <button
                key={v.slug}
                type="button"
                onClick={() => toggle(v.slug)}
                aria-pressed={isSelected}
                disabled={submitted}
                className="gl-focus-ring gl-clickable"
                style={{
                  padding: "10px 12px",
                  background: chipBg,
                  border: `1.5px solid ${chipColor}`,
                  borderRadius: "8px",
                  cursor: submitted ? "default" : "pointer",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  transition: reducedMotion
                    ? "none"
                    : "background 160ms ease, border-color 160ms ease",
                  opacity: submitted && !isSelected && !isCorrect ? 0.55 : 1,
                }}
              >
                <span
                  lang="sa"
                  style={{
                    fontFamily: "var(--font-devanagari), serif",
                    fontSize: "18px",
                    color: GOLD_DEEP,
                  }}
                >
                  {v.devanagari}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: chipText,
                  }}
                >
                  {v.iast}
                </span>
                {submitted && isSelected && isCorrect && (
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
                {submitted && isSelected && !isCorrect && (
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
                    not this one
                  </span>
                )}
                {submitted && !isSelected && isCorrect && (
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
                    missed
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
              disabled={selected.size === 0}
              className="gl-clickable gl-focus-ring"
              style={{
                padding: "8px 18px",
                background:
                  selected.size === 0
                    ? "rgba(156, 122, 47, 0.18)"
                    : `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                color: selected.size === 0 ? INK_ON_CREAM_MUTED : "#1A1408",
                border: `1.5px solid ${selected.size === 0 ? "rgba(156, 122, 47, 0.30)" : GOLD}`,
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                cursor: selected.size === 0 ? "not-allowed" : "pointer",
                boxShadow: selected.size === 0 ? "none" : `0 4px 12px ${GOLD}55`,
              }}
            >
              Submit
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

      {/* RIGHT: feedback panel */}
      <aside aria-live="polite" className="flex flex-col gap-3" style={{ minHeight: "480px" }}>
        {!submitted ? (
          <ScenarioGuidance />
        ) : (
          <ScenarioFeedback
            scenario={scenario}
            allCorrect={allCorrect}
          />
        )}
      </aside>
    </div>
  );
}

function ScenarioGuidance() {
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
        gap: "10px",
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
        }}
      >
        How to use this
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14.5px",
          color: INK_ON_CREAM_SECONDARY,
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        For each scenario, pick the Vedāṅgas that are{" "}
        <em>operationally</em> involved — the ones whose specific competence
        the learner would actually draw on. Multi-select is expected.
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14.5px",
          color: INK_ON_CREAM_SECONDARY,
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        Submit when ready. A rationale paragraph will reveal what the sāṅga
        habit looks like in practice — and why the picked Vedāṅgas matter
        for this specific task.
      </p>
    </div>
  );
}

function ScenarioFeedback({
  scenario,
  allCorrect,
}: {
  scenario: SangaScenario;
  allCorrect: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: "14px 16px",
        background: allCorrect
          ? "rgba(58, 140, 90, 0.08)"
          : "rgba(255, 251, 240, 0.75)",
        border: `1px solid ${allCorrect ? "#3A8C5A55" : `${GOLD}55`}`,
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
          color: allCorrect ? "#1F5A37" : VERMILION,
          fontWeight: 700,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        {allCorrect ? "Sāṅga reasoning — confirmed" : "Sāṅga reasoning"}
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
        {scenario.rationale}
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "12.5px",
          color: INK_ON_CREAM_MUTED,
          lineHeight: 1.5,
          margin: 0,
          marginTop: "auto",
        }}
      >
        The with-all-limbs habit isn&apos;t about invoking every Vedāṅga; it
        is about recognising which limbs the current task actually rests
        on.
      </p>
    </div>
  );
}
