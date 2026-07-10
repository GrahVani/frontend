/**
 * BPHS Recension Comparator — Lesson 2.2's §4 explorer.
 *
 * The bespoke visual anchor for L2.2: a full-width scroll of the 10 major
 * prakaraṇa-divisions of the Bṛhat Parāśara Horā Śāstra, each rendered as
 * a manuscript-plate with Sanskrit name + IAST + Santhanam adhyāya range +
 * topic summary + curriculum cross-references. Clickable to expand for
 * detail prose + recension-variation note + curriculum citation hints.
 *
 * Above the plates: the Parāśara DUALITY framing — pre-classical ṛṣi side
 * (indigo) vs medieval-recension side (vermilion), the central pedagogical
 * insight of the lesson rendered as a visual diptych.
 *
 * Pattern: same manuscript-plate aesthetic as L2.1's HistoricalTimeline.
 * Full-width single column with inline expansion.
 */

"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Sparkles } from "lucide-react";
import {
  PRAKARANA_PLATES,
  RECENSIONS,
  PARASHARA_DUALITY,
  BPHS_CITATION_FRAMING,
  type PrakaranaPlate,
} from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const GOLD_PALE = "#E6C97A";
const VERMILION = "#A23A1E";
const VERMILION_DEEP = "#7A2A14";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const JADE = "#3A8C5A";
const PARCHMENT = "#FFF6E6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

export function BphsRecensionComparator() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      data-interactive="bphs-recension-comparator"
      style={{ display: "flex", flexDirection: "column", gap: "22px" }}
    >
      {/* ─── Parāśara duality diptych ─── */}
      <div
        className="gl-surface-twilight-glass"
        style={{ padding: "22px 26px 24px" }}
      >
        <p
          className="uppercase"
          style={{
            color: GOLD,
            letterSpacing: "0.20em",
            fontWeight: 700,
            fontSize: "13px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          The Parāśara duality
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "16px",
            color: INK_SECONDARY,
            lineHeight: 1.6,
            margin: "0 auto",
            textAlign: "center",
            maxWidth: "720px",
            marginBottom: "20px",
          }}
        >
          One name spans two layers — the pre-classical ṛṣi-figure tradition
          attests, and the medieval-recensional text we actually read. Both
          are real; both must be cited honestly.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "0",
            alignItems: "stretch",
          }}
        >
          {/* LEFT: pre-classical ṛṣi */}
          <div
            style={{
              padding: "18px 22px",
              background: `linear-gradient(135deg, ${INDIGO}10 0%, ${INDIGO}20 100%)`,
              border: `1px solid ${INDIGO}55`,
              borderRight: "none",
              borderRadius: "10px 0 0 10px",
            }}
          >
            <p
              className="uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                color: PARASHARA_DUALITY.preClassical.colorDeep,
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginBottom: "8px",
              }}
            >
              Traditional · Pre-classical
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "22px",
                fontWeight: 600,
                color: INDIGO_DEEP,
                lineHeight: 1.25,
                margin: 0,
                marginBottom: "10px",
              }}
            >
              {PARASHARA_DUALITY.preClassical.label}
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
              {PARASHARA_DUALITY.preClassical.description}
            </p>
          </div>

          {/* CENTER: connecting strait */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 12px",
              minWidth: "100px",
              background: `linear-gradient(to right, ${INDIGO}20, ${GOLD}40, ${VERMILION}20)`,
              borderTop: `1px solid ${GOLD}66`,
              borderBottom: `1px solid ${GOLD}66`,
            }}
          >
            <Sparkles size={20} style={{ color: GOLD_DEEP }} />
            <p
              className="uppercase"
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.18em",
                color: GOLD_DEEP,
                fontWeight: 700,
                marginTop: "6px",
                textAlign: "center",
              }}
            >
              Two<br />layers
            </p>
          </div>

          {/* RIGHT: medieval recension */}
          <div
            style={{
              padding: "18px 22px",
              background: `linear-gradient(135deg, ${VERMILION}10 0%, ${VERMILION}20 100%)`,
              border: `1px solid ${VERMILION}55`,
              borderLeft: "none",
              borderRadius: "0 10px 10px 0",
            }}
          >
            <p
              className="uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                color: VERMILION_DEEP,
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginBottom: "8px",
              }}
            >
              Academic · Medieval-recension
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "22px",
                fontWeight: 600,
                color: VERMILION_DEEP,
                lineHeight: 1.25,
                margin: 0,
                marginBottom: "10px",
              }}
            >
              {PARASHARA_DUALITY.medievalRecension.label}
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
              {PARASHARA_DUALITY.medievalRecension.description}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Section header for the prakaraṇa scroll ─── */}
      <div className="gl-surface-twilight-glass" style={{ padding: "18px 24px 14px" }}>
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
          BPHS structural overview — ten prakaraṇa-divisions
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
          Each plate below is a major prakaraṇa-division of BPHS in the
          Santhanam (1996) numbering — the curriculum&apos;s default
          recension. Tap any plate to read the full coverage, recension-
          variation note, and where the curriculum cites it. The{" "}
          <span style={{ color: VERMILION, fontWeight: 700 }}>vermilion-marked</span>{" "}
          plates carry the highest citation density in modern practice.
        </p>
      </div>

      {/* ─── Ten prakaraṇa plates ─── */}
      {PRAKARANA_PLATES.map((plate, idx) => {
        const isOpen = openSlug === plate.slug;
        const accent = plate.isMostCited ? VERMILION : GOLD;
        const accentDeep = plate.isMostCited ? VERMILION_DEEP : GOLD_DEEP;
        return (
          <article
            key={plate.slug}
            style={{
              background: "linear-gradient(180deg, rgba(255, 249, 234, 0.96) 0%, rgba(252, 240, 210, 0.88) 100%)",
              border: `1px solid ${accent}55`,
              borderLeft: `4px solid ${accent}`,
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: isOpen
                ? `0 8px 20px ${accent}22, 0 1px 0 rgba(255,255,255,0.6) inset`
                : `0 1px 2px rgba(74, 56, 24, 0.08), 0 1px 0 rgba(255,255,255,0.6) inset`,
              transition: reducedMotion ? "none" : "box-shadow 240ms ease",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenSlug(isOpen ? null : plate.slug)}
              aria-expanded={isOpen}
              aria-label={`${plate.iast} — ${plate.englishLabel}. ${isOpen ? "Collapse" : "Expand"} full detail.`}
              className="gl-focus-ring"
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: "20px",
                width: "100%",
                padding: "20px 24px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                alignItems: "center",
              }}
            >
              {/* Plate numeral */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${accent}22, ${accent}44)`,
                  border: `2px solid ${accent}88`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    color: accentDeep,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  Plate
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: accentDeep,
                    lineHeight: 1,
                    marginTop: "-2px",
                  }}
                >
                  {romanise(idx + 1)}
                </span>
              </div>

              {/* Center: name + summary */}
              <div>
                <p
                  lang="sa"
                  style={{
                    fontFamily: "var(--font-devanagari), serif",
                    fontSize: "22px",
                    color: GOLD_DEEP,
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {plate.devanagari}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "17px",
                    fontWeight: 600,
                    color: INK_PRIMARY,
                    lineHeight: 1.3,
                    margin: 0,
                    marginTop: "2px",
                  }}
                >
                  {plate.iast}{" "}
                  <span style={{ fontStyle: "normal", color: INK_MUTED, fontSize: "14.5px", fontWeight: 400 }}>
                    — {plate.englishLabel}
                  </span>
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "14.5px",
                    color: INK_SECONDARY,
                    lineHeight: 1.55,
                    margin: 0,
                    marginTop: "8px",
                    maxWidth: "680px",
                  }}
                >
                  {plate.summary}
                </p>
              </div>

              {/* Right: santhanam range + most-cited badge + chevron */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "8px",
                  flexShrink: 0,
                  textAlign: "right",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: accentDeep,
                      lineHeight: 1.2,
                      margin: 0,
                    }}
                  >
                    {plate.santhanamRange}
                  </p>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.16em",
                      color: INK_MUTED,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      margin: 0,
                      marginTop: "2px",
                    }}
                  >
                    Santhanam
                  </p>
                </div>
                {plate.isMostCited && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "4px 11px",
                      borderRadius: "999px",
                      background: `${VERMILION}1f`,
                      border: `1px solid ${VERMILION}66`,
                      fontSize: "10.5px",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: VERMILION,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                    }}
                  >
                    Most-cited
                  </span>
                )}
                <span aria-hidden style={{ color: accentDeep }}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </div>
            </button>

            {/* Expanded detail */}
            {isOpen && (
              <div
                style={{
                  borderTop: `1px dashed ${accent}55`,
                  padding: "20px 28px",
                  background: `linear-gradient(180deg, rgba(255, 251, 240, 0.6) 0%, rgba(252, 240, 210, 0.4) 100%)`,
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.7fr) minmax(280px, 1fr)",
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
                      color: accentDeep,
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
                    {plate.detail}
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
                      {plate.curriculumCites}
                    </p>
                  </div>
                </div>

                {/* Right: recension variation note */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div
                    style={{
                      padding: "13px 15px",
                      background: "rgba(255, 251, 240, 0.85)",
                      border: `1px solid ${accent}55`,
                      borderLeft: `3px solid ${accent}`,
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    <p
                      className="uppercase"
                      style={{
                        fontSize: "10.5px",
                        letterSpacing: "0.18em",
                        color: accentDeep,
                        fontWeight: 700,
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                        marginBottom: "8px",
                      }}
                    >
                      Recension variation
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontStyle: "italic",
                        fontSize: "13.5px",
                        color: INK_PRIMARY,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {plate.recensionNote}
                    </p>
                  </div>

                  {/* Mini-table: 3 recensions */}
                  <div
                    style={{
                      padding: "12px 14px",
                      background: "rgba(255, 251, 240, 0.55)",
                      border: `1px dashed ${GOLD}55`,
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      className="uppercase"
                      style={{
                        fontSize: "10.5px",
                        letterSpacing: "0.18em",
                        color: GOLD_DEEP,
                        fontWeight: 700,
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                        marginBottom: "8px",
                      }}
                    >
                      Across three recensions
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                      {RECENSIONS.map((r) => (
                        <li
                          key={r.slug}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontFamily: "var(--font-cormorant), serif",
                            fontSize: "13px",
                            color: INK_SECONDARY,
                            lineHeight: 1.4,
                          }}
                        >
                          <span
                            aria-hidden
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: r.color,
                              flexShrink: 0,
                            }}
                          />
                          <span>
                            <strong style={{ color: r.colorDeep, fontWeight: 600 }}>{r.shortLabel}</strong>{" "}
                            <em style={{ color: INK_MUTED }}>· {r.language}</em>
                            {r.curriculumDefault && (
                              <span
                                style={{
                                  marginLeft: "6px",
                                  fontSize: "9.5px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.12em",
                                  color: JADE,
                                  fontWeight: 700,
                                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                                }}
                              >
                                · curriculum default
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}

      {/* ─── BPHS citation framing footer ─── */}
      <div
        className="gl-surface-twilight-glass"
        style={{
          padding: "20px 24px",
          border: `1px solid ${GOLD}66`,
          background: `linear-gradient(135deg, ${GOLD}10 0%, ${VERMILION}10 100%)`,
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
            marginBottom: "10px",
          }}
        >
          Honest-citation discipline · applied to BPHS
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
          {BPHS_CITATION_FRAMING}
        </p>
      </div>
    </div>
  );
}

/** Roman numeral converter — for plate numerals I, II, III, IV, V, VI, VII, VIII, IX, X. */
function romanise(n: number): string {
  const numerals: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  let remaining = n;
  for (const [value, sym] of numerals) {
    while (remaining >= value) {
      result += sym;
      remaining -= value;
    }
  }
  return result;
}
