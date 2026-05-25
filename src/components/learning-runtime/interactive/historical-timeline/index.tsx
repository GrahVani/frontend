/**
 * Historical Timeline — Lesson 2.1's §4 explorer (manuscript-plate style).
 *
 * REDESIGNED 2026-05-25 (third pass): full-width single-column manuscript
 * scroll. Each author/text is a substantial "plate" — gold-filigree
 * ornamental left flourish, large serif author name, era-coloured stream
 * chip, calligraphic dates. Click any plate → it expands INLINE with the
 * full detail (dating divergence, recension note, detail prose, curriculum
 * cross-references). Era headers are full-width banners with central
 * Vedic ornament + serif label.
 *
 * Why full-width inline-expand: the lesson is a SCROLL THROUGH HISTORY —
 * the experience IS the chronological progression. A separate detail
 * panel on the right empties when the reader scrolls (cream void). Inline
 * expansion preserves narrative flow AND uses the whole canvas.
 *
 * Visual register: illuminated-manuscript "plates", not database rows.
 * Each plate carries enough decorative weight that students remember
 * each scholar as a distinct figure, not a row.
 */

"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import {
  TIMELINE_ENTRIES,
  STREAMS,
  RECENSION_DISPLAY,
  CITATION_DISCIPLINE_MOVES,
  type TimelineEntry,
  type StreamSlug,
} from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const GOLD_PALE = "#E6C97A";
const VERMILION = "#A23A1E";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const JADE = "#3A8C5A";
const PARCHMENT = "#FFF6E6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

function streamConfig(slug: StreamSlug) {
  return STREAMS.find((s) => s.slug === slug)!;
}

interface EraGroup {
  slug: string;
  label: string;
  yearLabel: string;
  description: string;
  entries: TimelineEntry[];
  /** Ornament SVG path for the era header centre-piece. */
  ornament: "lotus" | "sun" | "manuscript" | "modern";
}

function groupByEra(): EraGroup[] {
  const get = (slug: string) => TIMELINE_ENTRIES.find((e) => e.slug === slug)!;
  return [
    {
      slug: "pre-classical",
      label: "Pre-classical",
      yearLabel: "Before the common era",
      description:
        "Vedic-era foundations — ritual-timing astronomy that precedes the natal-chart discipline.",
      entries: [get("lagadha-vedanga-jyotisha")],
      ornament: "sun",
    },
    {
      slug: "classical",
      label: "Classical",
      yearLabel: "3rd – 7th century CE",
      description:
        "The Indo-Hellenistic transmission and the systematic codifiers — where the natal-chart discipline crystallises into the recognisable Vedic form.",
      entries: [
        get("jaimini-sutras"),
        get("sphujidhvaja-yavanajataka"),
        get("varahamihira-corpus"),
      ],
      ornament: "manuscript",
    },
    {
      slug: "medieval",
      label: "Medieval",
      yearLabel: "8th – 17th century CE",
      description:
        "Long codification arc — recensions of older material, commentary traditions, Kerala-school refinements, regional specialisations (Tājika, Praśna).",
      entries: [
        get("kalyanavarma-saravali"),
        get("parashara-bphs"),
        get("mantresvara-phaladipika"),
        get("vaidyanatha-jataka-parijata"),
        get("nilakantha-tajika-nilakanthi"),
        get("panchanana-prasna-marga"),
      ],
      ornament: "lotus",
    },
    {
      slug: "modern-primary",
      label: "Modern primary",
      yearLabel: "20th century CE",
      description:
        "The carve-out — two genuinely new authoritative traditions emerge in the 20th century, with substantial methodological innovation and large practitioner communities.",
      entries: [get("joshi-lal-kitab"), get("krishnamurti-kp-reader")],
      ornament: "modern",
    },
  ];
}

/* ────────────────────── Decorative ornaments ─────────────────────── */

function EraOrnament({ kind, color }: { kind: EraGroup["ornament"]; color: string }) {
  const SIZE = 48;
  switch (kind) {
    case "sun":
      return (
        <svg viewBox="0 0 48 48" width={SIZE} height={SIZE} aria-hidden>
          {Array.from({ length: 12 }, (_, i) => {
            const angle = i * 30;
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={24 + 14 * Math.cos(rad)}
                y1={24 + 14 * Math.sin(rad)}
                x2={24 + 22 * Math.cos(rad)}
                y2={24 + 22 * Math.sin(rad)}
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={24} cy={24} r={11} fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx={24} cy={24} r={5} fill={color} />
        </svg>
      );
    case "lotus":
      return (
        <svg viewBox="0 0 48 48" width={SIZE} height={SIZE} aria-hidden>
          {Array.from({ length: 8 }, (_, i) => {
            const angle = i * 45;
            const rad = (angle * Math.PI) / 180;
            const cx = 24 + 12 * Math.cos(rad);
            const cy = 24 + 12 * Math.sin(rad);
            return (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx={5}
                ry={9}
                fill="none"
                stroke={color}
                strokeWidth="1.2"
                transform={`rotate(${angle} ${cx} ${cy})`}
              />
            );
          })}
          <circle cx={24} cy={24} r={4} fill={color} />
        </svg>
      );
    case "manuscript":
      return (
        <svg viewBox="0 0 48 48" width={SIZE} height={SIZE} aria-hidden>
          <rect x={8} y={14} width={32} height={22} fill="none" stroke={color} strokeWidth="1.5" rx={1} />
          <line x1={24} y1={14} x2={24} y2={36} stroke={color} strokeWidth="1.2" />
          {[18, 22, 26, 30].map((y) => (
            <g key={y}>
              <line x1={11} y1={y} x2={21} y2={y} stroke={color} strokeWidth="0.8" opacity="0.6" />
              <line x1={27} y1={y} x2={37} y2={y} stroke={color} strokeWidth="0.8" opacity="0.6" />
            </g>
          ))}
        </svg>
      );
    case "modern":
      return (
        <svg viewBox="0 0 48 48" width={SIZE} height={SIZE} aria-hidden>
          <circle cx={24} cy={24} r={18} fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx={24} cy={24} r={12} fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 2" />
          <circle cx={24} cy={24} r={5} fill={color} />
          <line x1={24} y1={6} x2={24} y2={12} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1={24} y1={36} x2={24} y2={42} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

/** Decorative left flourish for each author plate — stream-coloured. */
function PlateInitial({ stream, isOpen }: { stream: ReturnType<typeof streamConfig>; isOpen: boolean }) {
  return (
    <div
      style={{
        width: "84px",
        flexShrink: 0,
        background: `linear-gradient(180deg, ${stream.color}22 0%, ${stream.color}44 100%)`,
        borderRight: `1.5px solid ${stream.color}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 8px",
        position: "relative",
      }}
    >
      <svg viewBox="0 0 60 60" width="48" height="48" aria-hidden>
        {/* Corner filigree top-left */}
        <path
          d="M 6 16 Q 6 6 16 6"
          fill="none"
          stroke={stream.colorDeep}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Corner filigree bottom-right */}
        <path
          d="M 54 44 Q 54 54 44 54"
          fill="none"
          stroke={stream.colorDeep}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Central diamond rotated square */}
        <rect
          x={20}
          y={20}
          width={20}
          height={20}
          fill="none"
          stroke={stream.color}
          strokeWidth="1.5"
          transform="rotate(45 30 30)"
        />
        {/* Inner small circle */}
        <circle cx={30} cy={30} r={5} fill={stream.color} />
        {/* Eight radial dots */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = i * 45;
          const rad = (angle * Math.PI) / 180;
          return (
            <circle
              key={i}
              cx={30 + 14 * Math.cos(rad)}
              cy={30 + 14 * Math.sin(rad)}
              r={1.5}
              fill={stream.colorDeep}
            />
          );
        })}
      </svg>
      <div
        style={{
          marginTop: "8px",
          fontSize: "11px",
          color: stream.colorDeep,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>
    </div>
  );
}

/* ────────────────────── Main component ────────────────────────────── */

export function HistoricalTimeline() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [showTraditional, setShowTraditional] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const eras = groupByEra();

  return (
    <div
      data-interactive="historical-timeline"
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      {/* ─── Header + intro + toggle ─── */}
      <div
        className="gl-surface-twilight-glass"
        style={{ padding: "20px 24px 18px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "10px",
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
            From Lagadha to Krishnamurti — three millennia
          </p>
          <button
            type="button"
            onClick={() => setShowTraditional((v) => !v)}
            aria-pressed={showTraditional}
            className="gl-clickable gl-focus-ring"
            style={{
              background: showTraditional ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "transparent",
              color: showTraditional ? "#1A1408" : GOLD_DEEP,
              border: `1.5px solid ${showTraditional ? GOLD : `${GOLD}88`}`,
              borderRadius: "999px",
              padding: "8px 16px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Traditional dating: {showTraditional ? "on" : "off"}
          </button>
        </div>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "16px",
            color: INK_PRIMARY,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Twelve major authors and texts, arranged across four eras. Each plate is a
          named figure in the Indian Jyotiṣa tradition — tap to read the full
          context, the recension status, the dating divergences, and where the
          curriculum cites this scholar.
        </p>
      </div>

      {/* ─── Era-grouped plates ─── */}
      {eras.map((era) => {
        const eraOrnamentColor =
          era.slug === "pre-classical"
            ? GOLD_DEEP
            : era.slug === "classical"
              ? VERMILION
              : era.slug === "medieval"
                ? GOLD
                : INDIGO_DEEP;
        return (
          <section
            key={era.slug}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Era banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "18px 24px",
                background:
                  "linear-gradient(180deg, rgba(255, 249, 234, 0.7) 0%, rgba(250, 239, 216, 0.55) 100%)",
                border: `1px solid ${eraOrnamentColor}33`,
                borderTop: `2px solid ${eraOrnamentColor}66`,
                borderBottom: `2px solid ${eraOrnamentColor}66`,
                borderRadius: "12px",
                position: "relative",
              }}
            >
              {/* Decorative left ornament */}
              <div style={{ flexShrink: 0 }}>
                <EraOrnament kind={era.ornament} color={eraOrnamentColor} />
              </div>

              {/* Filigree connector line */}
              <div
                aria-hidden
                style={{
                  flex: 1,
                  height: "1px",
                  background: `linear-gradient(to right, ${eraOrnamentColor}88, ${eraOrnamentColor}11)`,
                  maxWidth: "60px",
                  marginRight: "-4px",
                }}
              />

              {/* Era label + description */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  className="uppercase"
                  style={{
                    color: eraOrnamentColor,
                    letterSpacing: "0.22em",
                    fontWeight: 700,
                    fontSize: "13px",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    margin: 0,
                    marginBottom: "2px",
                  }}
                >
                  {era.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "22px",
                    fontWeight: 500,
                    color: INK_PRIMARY,
                    lineHeight: 1.2,
                    margin: 0,
                    marginBottom: "6px",
                  }}
                >
                  {era.yearLabel}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "14.5px",
                    color: INK_SECONDARY,
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {era.description}
                </p>
              </div>

              {/* Right corner ornament — small */}
              <div style={{ flexShrink: 0, opacity: 0.65 }}>
                <EraOrnament kind={era.ornament} color={eraOrnamentColor} />
              </div>
            </div>

            {/* Author plates within this era */}
            {era.entries.map((entry) => {
              const stream = streamConfig(entry.stream);
              const recension = RECENSION_DISPLAY[entry.recension];
              const isOpen = openSlug === entry.slug;
              const hasDivergence =
                entry.traditionalYear !== undefined &&
                Math.abs(entry.traditionalYear - entry.academicYear) > 200;
              return (
                <article
                  key={entry.slug}
                  style={{
                    background: PARCHMENT,
                    border: `1px solid ${stream.color}55`,
                    borderLeft: `4px solid ${stream.color}`,
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: isOpen
                      ? `0 8px 20px ${stream.color}22, 0 1px 0 rgba(255,255,255,0.6) inset`
                      : `0 1px 2px rgba(74, 56, 24, 0.08), 0 1px 0 rgba(255,255,255,0.6) inset`,
                    transition: reducedMotion ? "none" : "box-shadow 240ms ease",
                  }}
                >
                  {/* Clickable summary header — full plate */}
                  <button
                    type="button"
                    onClick={() => setOpenSlug(isOpen ? null : entry.slug)}
                    aria-expanded={isOpen}
                    aria-label={`${entry.author} — ${entry.text}. ${isOpen ? "Collapse" : "Expand"} full detail.`}
                    className="gl-focus-ring"
                    style={{
                      display: "flex",
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {/* Decorative initial flourish */}
                    <PlateInitial stream={stream} isOpen={isOpen} />

                    {/* Main content */}
                    <div
                      style={{
                        flex: 1,
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: "16px",
                        padding: "18px 22px",
                        alignItems: "center",
                      }}
                    >
                      {/* Author + text + one-liner */}
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-cormorant), serif",
                            fontStyle: "italic",
                            fontSize: "14px",
                            color: stream.colorDeep,
                            fontWeight: 600,
                            margin: 0,
                            letterSpacing: "0.03em",
                          }}
                        >
                          {entry.author}
                        </p>
                        <h4
                          style={{
                            fontFamily: "var(--font-cormorant), serif",
                            fontSize: "26px",
                            fontWeight: 500,
                            color: INK_PRIMARY,
                            lineHeight: 1.2,
                            margin: 0,
                            marginTop: "2px",
                          }}
                        >
                          {entry.text}
                        </h4>
                        <p
                          style={{
                            fontFamily: "var(--font-cormorant), serif",
                            fontStyle: "italic",
                            fontSize: "14.5px",
                            color: INK_SECONDARY,
                            lineHeight: 1.55,
                            margin: 0,
                            marginTop: "8px",
                            maxWidth: "640px",
                          }}
                        >
                          {entry.oneLiner}
                        </p>
                      </div>

                      {/* Right side: dates + chips stack */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          alignItems: "flex-end",
                          flexShrink: 0,
                          textAlign: "right",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontFamily: "var(--font-cormorant), serif",
                              fontSize: "16px",
                              color: VERMILION,
                              fontWeight: 700,
                              margin: 0,
                              lineHeight: 1.2,
                            }}
                          >
                            {entry.academicDateLabel}
                          </p>
                          <p
                            className="uppercase"
                            style={{
                              fontSize: "9.5px",
                              letterSpacing: "0.14em",
                              color: INK_MUTED,
                              fontWeight: 700,
                              fontFamily: "var(--font-sans), system-ui, sans-serif",
                              marginTop: "2px",
                              margin: 0,
                            }}
                          >
                            Academic dating
                          </p>
                        </div>
                        {showTraditional && hasDivergence && entry.traditionalDateLabel && (
                          <div>
                            <p
                              style={{
                                fontFamily: "var(--font-cormorant), serif",
                                fontStyle: "italic",
                                fontSize: "14px",
                                color: INDIGO_DEEP,
                                fontWeight: 600,
                                margin: 0,
                                lineHeight: 1.3,
                              }}
                            >
                              {entry.traditionalDateLabel}
                            </p>
                            <p
                              className="uppercase"
                              style={{
                                fontSize: "9.5px",
                                letterSpacing: "0.14em",
                                color: INK_MUTED,
                                fontWeight: 700,
                                fontFamily: "var(--font-sans), system-ui, sans-serif",
                                marginTop: "2px",
                                margin: 0,
                              }}
                            >
                              Traditional dating
                            </p>
                          </div>
                        )}
                        <div style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "4px 11px",
                              borderRadius: "999px",
                              background: `${stream.color}1f`,
                              border: `1px solid ${stream.color}66`,
                              fontSize: "11px",
                              textTransform: "uppercase",
                              letterSpacing: "0.14em",
                              color: stream.colorDeep,
                              fontWeight: 700,
                              fontFamily: "var(--font-sans), system-ui, sans-serif",
                            }}
                          >
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: stream.color }} />
                            {stream.label}
                          </span>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "4px 11px",
                              borderRadius: "999px",
                              background: `${recension.color}14`,
                              border: `1px solid ${recension.color}55`,
                              fontSize: "11px",
                              textTransform: "uppercase",
                              letterSpacing: "0.14em",
                              color: recension.color,
                              fontWeight: 700,
                              fontFamily: "var(--font-sans), system-ui, sans-serif",
                            }}
                          >
                            {recension.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail (inline) */}
                  {isOpen && (
                    <div
                      style={{
                        borderTop: `1px dashed ${stream.color}55`,
                        padding: "20px 28px",
                        background: `linear-gradient(180deg, rgba(255, 251, 240, 0.6) 0%, rgba(252, 240, 210, 0.4) 100%)`,
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1.8fr) minmax(280px, 1fr)",
                        gap: "24px",
                      }}
                    >
                      {/* Left: detail prose */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <p
                          className="uppercase"
                          style={{
                            fontSize: "11px",
                            letterSpacing: "0.18em",
                            color: stream.colorDeep,
                            fontWeight: 700,
                            fontFamily: "var(--font-sans), system-ui, sans-serif",
                            margin: 0,
                          }}
                        >
                          The full plate
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
                          {entry.detail}
                        </p>
                        <div
                          style={{
                            padding: "12px 14px",
                            background: `${JADE}10`,
                            borderLeft: `3px solid ${JADE}`,
                            borderRadius: "0 8px 8px 0",
                            marginTop: "auto",
                          }}
                        >
                          <p
                            className="uppercase"
                            style={{
                              fontSize: "11px",
                              letterSpacing: "0.16em",
                              color: "#1F5A37",
                              fontWeight: 700,
                              fontFamily: "var(--font-sans), system-ui, sans-serif",
                              marginBottom: "5px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <BookOpen size={11} /> Where the curriculum cites this
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-cormorant), serif",
                              fontSize: "13.5px",
                              color: INK_SECONDARY,
                              lineHeight: 1.55,
                              margin: 0,
                            }}
                          >
                            {entry.curriculumCites}
                          </p>
                        </div>
                      </div>

                      {/* Right: dating + recension */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div
                          style={{
                            padding: "13px 15px",
                            background: "rgba(255, 251, 240, 0.85)",
                            border: `1px solid ${stream.color}55`,
                            borderLeft: `3px solid ${stream.color}`,
                            borderRadius: "0 8px 8px 0",
                          }}
                        >
                          <p
                            className="uppercase"
                            style={{
                              fontSize: "10.5px",
                              letterSpacing: "0.18em",
                              color: stream.colorDeep,
                              fontWeight: 700,
                              fontFamily: "var(--font-sans), system-ui, sans-serif",
                              marginBottom: "5px",
                            }}
                          >
                            Academic-Indology dating
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-cormorant), serif",
                              fontSize: "15px",
                              color: VERMILION,
                              fontWeight: 700,
                              lineHeight: 1.4,
                              margin: 0,
                            }}
                          >
                            {entry.academicDateLabel}
                          </p>
                          {hasDivergence && entry.traditionalDateLabel && (
                            <>
                              <p
                                className="uppercase"
                                style={{
                                  fontSize: "10.5px",
                                  letterSpacing: "0.18em",
                                  color: INDIGO_DEEP,
                                  fontWeight: 700,
                                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                                  marginTop: "12px",
                                  marginBottom: "5px",
                                }}
                              >
                                Traditional dating
                              </p>
                              <p
                                style={{
                                  fontFamily: "var(--font-cormorant), serif",
                                  fontSize: "14px",
                                  color: INDIGO_DEEP,
                                  fontWeight: 600,
                                  lineHeight: 1.4,
                                  margin: 0,
                                }}
                              >
                                {entry.traditionalDateLabel}
                              </p>
                              <p
                                style={{
                                  fontFamily: "var(--font-cormorant), serif",
                                  fontStyle: "italic",
                                  fontSize: "12.5px",
                                  color: INK_MUTED,
                                  lineHeight: 1.5,
                                  margin: 0,
                                  marginTop: "6px",
                                }}
                              >
                                The two chronologies diverge by{" "}
                                <strong style={{ color: VERMILION, fontWeight: 700, fontStyle: "normal" }}>
                                  ~{Math.abs(entry.traditionalYear! - entry.academicYear).toLocaleString()} years
                                </strong>{" "}
                                — hold both honestly.
                              </p>
                            </>
                          )}
                        </div>

                        <div
                          style={{
                            padding: "13px 15px",
                            background: `${recension.color}10`,
                            border: `1px solid ${recension.color}55`,
                            borderLeft: `3px solid ${recension.color}`,
                            borderRadius: "0 8px 8px 0",
                          }}
                        >
                          <p
                            className="uppercase"
                            style={{
                              fontSize: "10.5px",
                              letterSpacing: "0.18em",
                              color: recension.color,
                              fontWeight: 700,
                              fontFamily: "var(--font-sans), system-ui, sans-serif",
                              marginBottom: "5px",
                            }}
                          >
                            {recension.label}
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-cormorant), serif",
                              fontStyle: "italic",
                              fontSize: "13.5px",
                              color: INK_PRIMARY,
                              lineHeight: 1.55,
                              margin: 0,
                            }}
                          >
                            {recension.note}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        );
      })}

      {/* ─── Stream legend + citation discipline ─── */}
      <div
        className="gl-surface-twilight-glass"
        style={{
          padding: "20px 24px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)",
          gap: "24px",
        }}
      >
        <div>
          <p
            className="uppercase"
            style={{
              fontSize: "12px",
              letterSpacing: "0.18em",
              color: GOLD_DEEP,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "12px",
            }}
          >
            The seven streams
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "10px 18px",
            }}
          >
            {STREAMS.map((s) => (
              <div key={s.slug} style={{ display: "grid", gridTemplateColumns: "12px 1fr", gap: "10px", alignItems: "baseline" }}>
                <span
                  aria-hidden
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: s.color,
                    boxShadow: `0 0 6px ${s.color}66`,
                    marginTop: "5px",
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "14px",
                    color: INK_SECONDARY,
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  <strong style={{ color: s.colorDeep, fontWeight: 600 }}>{s.label}</strong>{" "}
                  <em style={{ color: INK_MUTED }}>{s.description}</em>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p
            className="uppercase"
            style={{
              fontSize: "12px",
              letterSpacing: "0.18em",
              color: VERMILION,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "12px",
            }}
          >
            The honest-citation discipline
          </p>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            {CITATION_DISCIPLINE_MOVES.map((move, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "14px",
                  color: INK_SECONDARY,
                  lineHeight: 1.5,
                }}
              >
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
                <span>{move}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
