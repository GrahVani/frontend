/**
 * Jyotiṣa-vs-Western-vs-Pop Comparator — Lesson 3's §4 explorer.
 *
 * Mirrors L1's VedangaBodyMap and L2's VedangaRelationshipDiagram spatial
 * pattern: 2-column composition (image LEFT + paired interactive RIGHT)
 * inside ONE Client Component. The bespoke triptych painting has no
 * baked-in visible affordances → clicks live on the RIGHT card as visible
 * dimension chips (L2 pattern per constitution §32.4 rule 9).
 *
 * LEFT card: triptych illumination of three astrology texts on a scholar's
 *            desk (Vedic palm-leaf + Western codex + modern newspaper).
 *            Purely contemplative — no clicks.
 * RIGHT card: eyebrow + tagline + 6 dimension chips (clickable) + three
 *             stacked tradition cards updating with the selected dimension's
 *             content + convergence/divergence callouts.
 *
 * Constitutional invariants honoured:
 *   - gl-focus-ring on every clickable
 *   - prefers-reduced-motion respected
 *   - All sizes from the chrome token universe
 *   - No internal h3 inside the interactive (h4 + eyebrow labels only)
 *   - No Devanāgarī śloka quotation inside the interactive
 */

"use client";

import { useEffect, useState } from "react";
import {
  DIMENSIONS,
  TRADITIONS,
  type DimensionSlug,
} from "./data";
import { TraditionsWheelDiagram } from "./TraditionsWheelDiagram";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const VERMILION = "#A23A1E";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const JADE = "#3A8C5A";
const INK_ON_CREAM_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_ON_CREAM_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_ON_CREAM_MUTED = "var(--gl-ink-on-cream-muted)";

export function JyotishaVsWesternVsPopComparator() {
  const [activeDimension, setActiveDimension] = useState<DimensionSlug>(
    "zodiac-frame",
  );
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const dimension = DIMENSIONS.find((d) => d.slug === activeDimension)!;

  const handleChipKey = (e: React.KeyboardEvent, idx: number) => {
    const len = DIMENSIONS.length;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActiveDimension(DIMENSIONS[(idx + 1) % len].slug);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActiveDimension(DIMENSIONS[(idx - 1 + len) % len].slug);
    }
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 items-stretch"
      data-interactive="jyotisha-vs-western-vs-pop-comparator"
    >
      {/* ────────── LEFT: bespoke triptych painting (contemplative) ────────── */}
      <div
        className="gl-surface-twilight-glass p-6 flex flex-col items-center"
        style={{ minHeight: "640px" }}
      >
        <p
          className="uppercase mb-4"
          style={{
            color: GOLD,
            letterSpacing: "0.16em",
            fontWeight: 700,
            fontSize: "12px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          The same sky, three frames
        </p>

        <TraditionsWheelDiagram />

        <p
          className="text-center italic mt-3 mb-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: INK_ON_CREAM_SECONDARY,
            maxWidth: "420px",
            fontSize: "15px",
            lineHeight: 1.55,
            margin: "14px auto 18px",
          }}
        >
          The same central sun, read through three frames. Vedic sidereal
          (outer, gold) and Western tropical (middle, indigo) sit{" "}
          <strong style={{ fontWeight: 600, color: VERMILION, fontStyle: "normal" }}>
            24°
          </strong>{" "}
          apart — Sun-sign popular astrology (inner) inherits the Western
          frame at simplified depth.
        </p>

        {/* ─── Orientation guide — teaches the diagram's visual grammar ─── */}
        <div
          style={{
            width: "100%",
            padding: "14px 16px",
            background: "rgba(255, 252, 240, 0.55)",
            border: `1px dashed ${GOLD}44`,
            borderRadius: "10px",
            marginBottom: "14px",
          }}
        >
          <p
            className="uppercase mb-2"
            style={{
              fontSize: "12px",
              letterSpacing: "0.20em",
              color: VERMILION,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "12px",
            }}
          >
            Where to look first
          </p>
          <ol
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "11px",
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "15px",
              color: INK_ON_CREAM_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            {[
              <>
                Find the{" "}
                <span style={{ color: GOLD_DEEP, fontWeight: 600 }}>gold ★</span>{" "}
                at the very top — Lahiri ayanāṁśa, the Vedic sidereal anchor at 0°.
              </>,
              <>
                Find the{" "}
                <span style={{ color: INDIGO_DEEP, fontWeight: 600 }}>
                  indigo sun-and-horizon glyph
                </span>{" "}
                just clockwise from it — the vernal equinox, Western tropical anchor.
              </>,
              <>
                The angular gap between the two markers IS the{" "}
                <strong style={{ color: VERMILION, fontWeight: 600, fontStyle: "normal" }}>
                  ~24° drift
                </strong>{" "}
                — the single difference this lesson teaches.
              </>,
            ].map((node, i) => (
              <li
                key={i}
                style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: `${GOLD}1f`,
                    border: `1px solid ${GOLD}66`,
                    color: GOLD_DEEP,
                    fontSize: "12px",
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

        {/* ─── Enhanced tradition legend — anchors at the bottom of the LEFT card ─── */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "14px",
            width: "100%",
            borderTop: `1px dashed ${GOLD}55`,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {TRADITIONS.map((t) => {
            const anchorText =
              t.slug === "vedic"
                ? "Anchored at the gold ★ (Lahiri sidereal 0°)"
                : t.slug === "western"
                  ? "Anchored at the indigo equinox glyph (24° clockwise)"
                  : "Inherits the Western tropical frame at simplified depth";
            return (
              <div
                key={t.slug}
                style={{
                  display: "grid",
                  gridTemplateColumns: "12px 1fr",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: t.color,
                    boxShadow: `0 0 6px ${t.color}66`,
                    marginTop: "6px",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "15px",
                      color: INK_ON_CREAM_SECONDARY,
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    <strong
                      style={{
                        color: t.colorDeep,
                        fontWeight: 600,
                        fontStyle: "normal",
                        marginRight: "6px",
                      }}
                    >
                      {t.name}
                    </strong>
                    <em>{t.tagline}</em>
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontStyle: "italic",
                      fontSize: "13.5px",
                      color: INK_ON_CREAM_MUTED,
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    {anchorText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ────────── RIGHT: paired interactive — dimension explorer ────────── */}
      <aside
        className="gl-surface-twilight-glass p-6 flex flex-col gap-4"
        aria-live="polite"
        style={{ minHeight: "640px" }}
      >
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
            Compare across six dimensions
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
            Pick a dimension to see how each tradition handles it. Notice
            where two of the three converge — and where one diverges.
          </p>
        </header>

        {/* Dimension chip grid — the clickable surface */}
        <div
          role="tablist"
          aria-label="Comparison dimensions"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "6px",
          }}
        >
          {DIMENSIONS.map((d, idx) => {
            const isActive = activeDimension === d.slug;
            return (
              <button
                key={d.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveDimension(d.slug)}
                onKeyDown={(e) => handleChipKey(e, idx)}
                className="gl-focus-ring gl-clickable"
                style={{
                  padding: "8px 10px",
                  textAlign: "left",
                  background: isActive
                    ? `linear-gradient(180deg, rgba(255, 248, 230, 0.96) 0%, rgba(252, 240, 210, 0.92) 100%)`
                    : "rgba(255, 251, 240, 0.55)",
                  border: isActive
                    ? `1.5px solid ${GOLD}`
                    : `1.5px solid rgba(156, 122, 47, 0.30)`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontFamily: "var(--font-cormorant), serif",
                  color: isActive ? (INK_ON_CREAM_PRIMARY as string) : INK_ON_CREAM_SECONDARY,
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  lineHeight: 1.3,
                  transition: reducedMotion
                    ? "none"
                    : "background 160ms ease, border-color 160ms ease",
                  boxShadow: isActive
                    ? `0 4px 10px ${GOLD}33, 0 1px 0 rgba(255,255,255,0.7) inset`
                    : "0 1px 0 rgba(255,255,255,0.55) inset",
                }}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        {/* Active dimension — three tradition cards stacked */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p
            className="uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              color: VERMILION,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              margin: 0,
            }}
          >
            {dimension.label} · {dimension.teaser}
          </p>

          {TRADITIONS.map((t) => {
            const v = dimension.values[t.slug];
            return (
              <div
                key={t.slug}
                style={{
                  padding: "10px 12px",
                  background: "rgba(255, 251, 240, 0.7)",
                  border: `1px solid ${t.color}66`,
                  borderLeft: `3px solid ${t.color}`,
                  borderRadius: "0 8px 8px 0",
                }}
              >
                <p
                  className="uppercase"
                  style={{
                    fontSize: "10.5px",
                    letterSpacing: "0.14em",
                    color: t.colorDeep,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    marginBottom: "3px",
                  }}
                >
                  {t.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: INK_ON_CREAM_PRIMARY,
                    lineHeight: 1.35,
                    marginBottom: "4px",
                  }}
                >
                  {v.headline}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "12.5px",
                    color: INK_ON_CREAM_SECONDARY,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {v.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Convergence + divergence callouts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
          <div
            style={{
              padding: "10px 12px",
              background: "rgba(58, 140, 90, 0.10)",
              borderLeft: `3px solid ${JADE}`,
              borderRadius: "0 8px 8px 0",
            }}
          >
            <p
              className="uppercase"
              style={{
                fontSize: "10.5px",
                letterSpacing: "0.14em",
                color: "#1F5A37",
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginBottom: "3px",
              }}
            >
              ✓ Convergence
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "12.5px",
                color: INK_ON_CREAM_PRIMARY,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {dimension.convergence}
            </p>
          </div>
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
                letterSpacing: "0.14em",
                color: VERMILION,
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginBottom: "3px",
              }}
            >
              ✕ Divergence
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "12.5px",
                color: INK_ON_CREAM_PRIMARY,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {dimension.divergence}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
