/**
 * Karma Typology Explorer — Lesson 4's §4 explorer.
 *
 * The bespoke visual anchor for L4 is the karma CYCLE diagram itself — an
 * SVG diamond of four nodes (saṁcita top, prārabdha left, kriyamāṇa right,
 * āgāmī bottom) connected by directional flow arrows. Cycles are SVG's
 * native medium; same precedent as L3's concentric zodiac wheels.
 *
 * Pattern: 2-column composition (image LEFT, paired interactive RIGHT) per
 * constitution §32.4 rule 8. The 4 karma nodes are visibly clickable (per
 * §32.4 rule 9 the LEFT card carries the interactive surface — same as
 * L1's painted-glyph affordances, but rendered geometrically).
 *
 * Constitutional invariants honoured:
 *   - gl-focus-ring + gl-clickable on clickables
 *   - prefers-reduced-motion respected
 *   - All sizes from chrome token universe
 *   - No internal h3, no embedded śloka
 */

"use client";

import { useEffect, useState } from "react";
import {
  KARMA_NODES,
  CYCLE_FLOWS,
  type KarmaSlug,
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

/** Per-node tint based on agent control (visual encoding of agency-window). */
function nodeTint(slug: KarmaSlug): { fill: string; stroke: string; ink: string } {
  switch (slug) {
    case "samcita":
      return { fill: "rgba(156, 122, 47, 0.10)", stroke: GOLD, ink: GOLD_DEEP };
    case "prarabdha":
      return { fill: "rgba(162, 58, 30, 0.08)", stroke: VERMILION, ink: VERMILION };
    case "kriyamana":
      return { fill: "rgba(58, 140, 90, 0.10)", stroke: JADE, ink: "#1F5A37" };
    case "agami":
      return { fill: "rgba(79, 111, 168, 0.10)", stroke: INDIGO, ink: INDIGO_DEEP };
  }
}

export function KarmaTypologyExplorer() {
  const [activeSlug, setActiveSlug] = useState<KarmaSlug | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const active = activeSlug ? KARMA_NODES.find((n) => n.slug === activeSlug) ?? null : null;

  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    const len = KARMA_NODES.length;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveSlug(KARMA_NODES[idx].slug);
    } else if (e.key === "Escape") {
      setActiveSlug(null);
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSlug(KARMA_NODES[(idx + 1) % len].slug);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSlug(KARMA_NODES[(idx - 1 + len) % len].slug);
    }
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 items-stretch"
      data-interactive="karma-typology-explorer"
    >
      {/* ──────── LEFT: bespoke SVG karma-cycle diagram ──────── */}
      <div
        className="gl-surface-twilight-glass p-6 flex flex-col items-center"
        style={{ minHeight: "640px" }}
      >
        <p
          className="uppercase mb-3"
          style={{
            color: GOLD,
            letterSpacing: "0.16em",
            fontWeight: 700,
            fontSize: "12px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          The four-fold karma cycle
        </p>

        <svg
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          style={{ width: "100%", maxWidth: "440px", height: "auto", display: "block", margin: "0 auto" }}
          role="img"
          aria-label="A diamond-shaped cycle showing four karma types: Saṁcita at the top (the accumulated stock), Prārabdha on the left (the operative portion), Kriyamāṇa on the right (current-action), and Āgāmī at the bottom (future-bearing). Directional flow arrows connect them in a cycle."
        >
          <defs>
            <radialGradient id="karma-halo" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor={GOLD_LIGHT} stopOpacity="0" />
              <stop offset="85%" stopColor={GOLD_LIGHT} stopOpacity="0.25" />
              <stop offset="100%" stopColor={GOLD_LIGHT} stopOpacity="0" />
            </radialGradient>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={GOLD} />
            </marker>
          </defs>

          {/* Background halo */}
          <circle cx={CENTRE} cy={CENTRE} r={180} fill="url(#karma-halo)" />

          {/* ──── Flow arrows (drawn first, behind nodes) ──── */}
          {CYCLE_FLOWS.map((flow, i) => {
            const from = KARMA_NODES.find((n) => n.slug === flow.from)!;
            const to = KARMA_NODES.find((n) => n.slug === flow.to)!;
            // Curve the path slightly so it doesn't pass through the centre
            const midX = (from.position.x + to.position.x) / 2;
            const midY = (from.position.y + to.position.y) / 2;
            // Pull control point toward the centre for a gentle inward curve
            const cx = midX + (CENTRE - midX) * 0.25;
            const cy = midY + (CENTRE - midY) * 0.25;
            // Trim endpoints so the line ends at the node edge, not centre
            const nodeR = 56;
            const dx = to.position.x - from.position.x;
            const dy = to.position.y - from.position.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / len;
            const uy = dy / len;
            const startX = from.position.x + ux * nodeR;
            const startY = from.position.y + uy * nodeR;
            const endX = to.position.x - ux * nodeR;
            const endY = to.position.y - uy * nodeR;
            return (
              <g key={`flow-${i}`}>
                <path
                  d={`M ${startX} ${startY} Q ${cx} ${cy} ${endX} ${endY}`}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth="1.75"
                  opacity="0.75"
                  markerEnd="url(#arrow)"
                />
                {/* Flow label at the midpoint */}
                <text
                  x={cx}
                  y={cy - 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "11.5px",
                    fill: GOLD_DEEP,
                  }}
                >
                  {flow.label}
                </text>
              </g>
            );
          })}

          {/* Centre annotation — the agent */}
          <g>
            <circle cx={CENTRE} cy={CENTRE} r="42" fill={PARCHMENT} stroke={`${GOLD}66`} strokeWidth="1" strokeDasharray="3 3" />
            <text
              x={CENTRE}
              y={CENTRE - 6}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "13px",
                fill: GOLD_DEEP,
                fontWeight: 600,
              }}
            >
              the agent
            </text>
            <text
              x={CENTRE}
              y={CENTRE + 12}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "10.5px",
                fill: INK_ON_CREAM_MUTED,
              }}
            >
              within the cycle
            </text>
          </g>

          {/* ──── Karma nodes (visibly clickable) ──── */}
          {KARMA_NODES.map((n, idx) => {
            const isActive = activeSlug === n.slug;
            const tint = nodeTint(n.slug);
            return (
              <g
                key={n.slug}
                style={{ cursor: "pointer" }}
                role="button"
                tabIndex={0}
                aria-label={`${n.iast} — ${n.shortGloss}`}
                aria-pressed={isActive}
                onClick={() => setActiveSlug(n.slug)}
                onKeyDown={(e) => handleKey(e as unknown as React.KeyboardEvent, idx)}
              >
                {/* Outer ring for active emphasis */}
                {isActive && (
                  <circle
                    cx={n.position.x}
                    cy={n.position.y}
                    r="64"
                    fill="none"
                    stroke={tint.stroke}
                    strokeWidth="2"
                    strokeDasharray="3 4"
                    opacity="0.7"
                  />
                )}
                <circle
                  cx={n.position.x}
                  cy={n.position.y}
                  r={isActive ? 58 : 54}
                  fill={tint.fill}
                  stroke={tint.stroke}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  style={{
                    transition: reducedMotion ? "none" : "all 220ms cubic-bezier(0.32,0.72,0.24,1)",
                  }}
                />
                <text
                  x={n.position.x}
                  y={n.position.y - 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  lang="sa"
                  style={{
                    fontFamily: "var(--font-devanagari), serif",
                    fontSize: "20px",
                    fill: tint.ink,
                    pointerEvents: "none",
                  }}
                >
                  {n.devanagari}
                </text>
                <text
                  x={n.position.x}
                  y={n.position.y + 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "14px",
                    fill: tint.ink,
                    fontWeight: 600,
                    pointerEvents: "none",
                  }}
                >
                  {n.iast}
                </text>
              </g>
            );
          })}
        </svg>

        <p
          className="text-center italic mt-4 mb-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: INK_ON_CREAM_SECONDARY,
            maxWidth: "420px",
            fontSize: "14.5px",
            lineHeight: 1.55,
            margin: "16px auto 18px",
          }}
        >
          The four karma types form a cycle around the agent at its centre.
          Tap any node to read what it is, what Jyotiṣa sees of it, and what
          agency the agent has over it.
        </p>

        {/* Predictive-scope legend */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "14px",
            width: "100%",
            borderTop: `1px dashed ${GOLD}55`,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px 16px",
          }}
        >
          {KARMA_NODES.map((n) => {
            const tint = nodeTint(n.slug);
            return (
              <div
                key={`legend-${n.slug}`}
                style={{ display: "grid", gridTemplateColumns: "10px 1fr", gap: "8px", alignItems: "flex-start" }}
              >
                <span
                  aria-hidden
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: tint.stroke,
                    boxShadow: `0 0 6px ${tint.stroke}66`,
                    marginTop: "5px",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "13.5px",
                      color: INK_ON_CREAM_SECONDARY,
                      lineHeight: 1.4,
                      margin: 0,
                    }}
                  >
                    <strong style={{ color: tint.ink, fontWeight: 600, marginRight: "4px" }}>
                      {n.iast}
                    </strong>
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontStyle: "italic",
                      fontSize: "11.5px",
                      color: INK_ON_CREAM_MUTED,
                      lineHeight: 1.35,
                      margin: 0,
                    }}
                  >
                    {n.scopeLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ──────── RIGHT: paired interactive — guidance or active detail ──────── */}
      <aside
        className="gl-surface-twilight-glass p-6 flex flex-col"
        aria-live="polite"
        style={{ minHeight: "640px" }}
      >
        {active ? (
          <ActiveKarmaDetail node={active} onClose={() => setActiveSlug(null)} />
        ) : (
          <KarmaGuidance />
        )}
      </aside>
    </div>
  );
}

/* ────────────────────── Guidance panel (idle) ───────────────────────── */

function KarmaGuidance() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <header>
        <p
          className="uppercase"
          style={{
            color: GOLD,
            letterSpacing: "0.16em",
            fontWeight: 700,
            fontSize: "12px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "8px",
          }}
        >
          Four types, one substrate
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "16px",
            lineHeight: 1.5,
            color: INK_ON_CREAM_PRIMARY,
            margin: 0,
          }}
        >
          Classical Vedānta distinguishes four kinds of karma — each at a
          different temporal scope. Jyotiṣa inherits the framework and reads
          mainly <em>one</em> of them.
        </p>
      </header>

      {/* TRY THIS callout — mirror L1 + L3 patterns */}
      <div
        style={{
          padding: "12px 14px",
          background: "rgba(232, 199, 114, 0.12)",
          borderLeft: `3px solid ${VERMILION}`,
          borderRadius: "0 8px 8px 0",
        }}
      >
        <p
          className="uppercase mb-1"
          style={{
            color: VERMILION,
            letterSpacing: "0.12em",
            fontWeight: 700,
            fontSize: "11px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "4px",
          }}
        >
          Try this
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "14.5px",
            color: INK_ON_CREAM_PRIMARY,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          Tap{" "}
          <strong style={{ fontStyle: "normal", color: VERMILION, fontWeight: 600 }}>
            Prārabdha
          </strong>{" "}
          first — it is the karma the natal chart most directly reads. Then
          tap{" "}
          <strong style={{ fontStyle: "normal", color: "#1F5A37", fontWeight: 600 }}>
            Kriyamāṇa
          </strong>{" "}
          to see the agency window the chart CANNOT touch.
        </p>
      </div>

      {/* EACH TAP REVEALS schema */}
      <div
        aria-hidden
        style={{
          padding: "12px 14px",
          border: "1px dashed rgba(156, 122, 47, 0.32)",
          borderRadius: "10px",
          background: "rgba(255, 252, 240, 0.45)",
        }}
      >
        <p
          className="uppercase"
          style={{
            fontSize: "11px",
            color: INK_ON_CREAM_SECONDARY,
            letterSpacing: "0.18em",
            fontWeight: 700,
            marginBottom: "8px",
            textAlign: "center",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          Each tap reveals
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {[
            ["definition", "what this karma type is"],
            ["properties", "3-4 key invariants of the type"],
            ["jyotiṣa-sees", "what the chart can read here"],
            ["agency", "how much the agent controls"],
          ].map(([label, gloss]) => (
            <li
              key={label}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(80px, 88px) 1fr",
                gap: "10px",
                fontSize: "13px",
                lineHeight: 1.45,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  color: INK_ON_CREAM_SECONDARY,
                  textAlign: "right",
                  fontSize: "13px",
                }}
              >
                {label}
              </span>
              <span style={{ color: INK_ON_CREAM_SECONDARY, fontFamily: "var(--font-cormorant), serif" }}>
                {gloss}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cross-cultural note */}
      <div
        style={{
          marginTop: "auto",
          padding: "12px 14px",
          background: `${INDIGO}10`,
          borderLeft: `3px solid ${INDIGO}`,
          borderRadius: "0 8px 8px 0",
        }}
      >
        <p
          className="uppercase"
          style={{
            color: INDIGO_DEEP,
            letterSpacing: "0.14em",
            fontWeight: 700,
            fontSize: "10.5px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "4px",
          }}
        >
          Cross-cultural framing
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "13px",
            color: INK_ON_CREAM_SECONDARY,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          You can engage with this framework <em>operationally</em> — as the
          doctrinal substrate Jyotiṣa reads against — without being required
          to adopt it as personal metaphysics. Recognition, not conversion.
        </p>
      </div>
    </div>
  );
}

/* ────────────────────── Active karma detail ───────────────────────── */

function ActiveKarmaDetail({
  node,
  onClose,
}: {
  node: ReturnType<typeof getKarmaForType>;
  onClose: () => void;
}) {
  const tint = nodeTint(node.slug);
  return (
    <div className="flex flex-col gap-3 h-full">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close and return to guidance"
          className="gl-clickable gl-focus-ring"
          style={{
            background: "transparent",
            border: `1px solid ${GOLD}66`,
            color: GOLD_DEEP,
            borderRadius: "999px",
            padding: "5px 12px",
            fontSize: "11px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            cursor: "pointer",
          }}
        >
          ← All four
        </button>
        <span
          style={{
            padding: "3px 10px",
            borderRadius: "999px",
            background: `${tint.stroke}1f`,
            border: `1px solid ${tint.stroke}66`,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: tint.ink,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          {node.scopeLabel}
        </span>
      </header>

      <div>
        <p
          className="uppercase"
          style={{
            fontSize: "11px",
            letterSpacing: "0.16em",
            color: tint.ink,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "4px",
          }}
        >
          {node.etymology}
        </p>
        <h4
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "22px",
            fontWeight: 500,
            color: INK_ON_CREAM_PRIMARY,
            lineHeight: 1.2,
            marginBottom: "4px",
          }}
        >
          {node.iast}{" "}
          <span
            lang="sa"
            style={{
              fontFamily: "var(--font-devanagari), serif",
              fontSize: "20px",
              color: tint.ink,
              marginLeft: "8px",
              fontWeight: 400,
            }}
          >
            {node.devanagari}
          </span>
        </h4>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "15px",
            color: INK_ON_CREAM_PRIMARY,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {node.definition}
        </p>
      </div>

      <section>
        <p
          className="uppercase"
          style={{
            fontSize: "10.5px",
            letterSpacing: "0.16em",
            color: GOLD_DEEP,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "6px",
          }}
        >
          Key properties
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {node.properties.map((p, i) => (
            <li
              key={i}
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "13.5px",
                color: INK_ON_CREAM_SECONDARY,
                lineHeight: 1.5,
                display: "flex",
                gap: "8px",
              }}
            >
              <span style={{ color: tint.stroke, flexShrink: 0 }}>·</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <div
        style={{
          padding: "12px 14px",
          background: `${tint.stroke}10`,
          borderLeft: `3px solid ${tint.stroke}`,
          borderRadius: "0 8px 8px 0",
        }}
      >
        <p
          className="uppercase"
          style={{
            fontSize: "10.5px",
            letterSpacing: "0.16em",
            color: tint.ink,
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "4px",
          }}
        >
          What Jyotiṣa sees
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "13.5px",
            color: INK_ON_CREAM_PRIMARY,
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {node.jyotishaSees}
        </p>
      </div>

      <div
        style={{
          marginTop: "auto",
          padding: "10px 12px",
          border: `1px solid ${tint.stroke}55`,
          borderRadius: "8px",
          background: tint.fill,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          aria-hidden
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: tint.stroke,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <p
            className="uppercase"
            style={{
              fontSize: "10px",
              letterSpacing: "0.14em",
              color: tint.ink,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              margin: 0,
            }}
          >
            Agent control
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "13.5px",
              color: INK_ON_CREAM_PRIMARY,
              fontWeight: 600,
              fontStyle: "italic",
              margin: 0,
              marginTop: "1px",
            }}
          >
            {node.agentControlLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper type alias
type _KarmaNode = (typeof KARMA_NODES)[number];
function getKarmaForType(): _KarmaNode {
  return KARMA_NODES[0];
}
