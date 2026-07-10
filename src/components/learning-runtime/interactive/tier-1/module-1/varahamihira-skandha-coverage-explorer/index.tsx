/**
 * Varāhamihira Skandha Coverage Explorer — Lesson 2.3's §4 explorer.
 *
 * Full-width single-column manuscript scroll showing Varāhamihira's
 * three-skandha-spanning codification. Top: date-anchor hero card.
 * Middle: three skandha plates (Horā/Saṁhitā/Gaṇita) with chapter
 * coverage, click-to-expand for detail + curriculum cross-refs. Bottom:
 * the both-anchors framework comparison (Parāśara | Varāhamihira) as a
 * 7-row dimension diptych.
 */

"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Star } from "lucide-react";
import {
  SKANDHA_TEXTS,
  PRIOR_SIDDHANTAS,
  BOTH_ANCHORS,
  DATING_METHOD_STEPS,
  FRAMEWORK_SUMMARY,
  type SkandhaText,
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

export function VarahamihiraSkandhaCoverageExplorer() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      data-interactive="varahamihira-skandha-coverage-explorer"
      style={{ display: "flex", flexDirection: "column", gap: "22px" }}
    >
      {/* ─── Date-anchor hero ─── */}
      <div
        className="gl-surface-twilight-glass"
        style={{ padding: "26px 28px", textAlign: "center" }}
      >
        <p
          className="uppercase"
          style={{
            color: GOLD,
            letterSpacing: "0.22em",
            fontWeight: 700,
            fontSize: "12px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
            marginBottom: "10px",
          }}
        >
          The date-anchor of classical Jyotiṣa
        </p>
        <p
          lang="sa"
          style={{
            fontFamily: "var(--font-devanagari), serif",
            fontSize: "28px",
            color: GOLD_DEEP,
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          वराहमिहिर
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "20px",
            color: INK_PRIMARY,
            fontWeight: 500,
            margin: 0,
            marginTop: "4px",
          }}
        >
          Varāhamihira
        </p>
        <div
          style={{
            marginTop: "16px",
            display: "inline-flex",
            alignItems: "center",
            gap: "16px",
            padding: "10px 22px",
            background: `linear-gradient(135deg, ${VERMILION}1f, ${GOLD}1f)`,
            border: `1px solid ${VERMILION}55`,
            borderRadius: "999px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "22px",
              fontWeight: 700,
              color: VERMILION_DEEP,
            }}
          >
            505 – 587 CE
          </span>
          <span aria-hidden style={{ color: GOLD_DEEP, opacity: 0.5 }}>·</span>
          <span
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "14px",
              color: INK_SECONDARY,
              fontWeight: 600,
            }}
          >
            astronomical anchor: ~575 CE
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "16px",
            color: INK_PRIMARY,
            lineHeight: 1.6,
            margin: 0,
            marginTop: "20px",
            maxWidth: "720px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          The most-reliably-dateable classical Jyotiṣa author — and the only
          one to produce major texts across all three skandhas (horā, saṁhitā,
          gaṇita). His dating is established by internal astronomical
          observations back-calculated against modern ephemerides; every other
          classical author is dated <em>relative</em> to him.
        </p>
      </div>

      {/* ─── Three skandha plates ─── */}
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
          Three texts, three skandhas — unique single-author breadth
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
          No other classical Jyotiṣa author covers this much ground. Most
          specialised within a single skandha (Kalyāṇavarmā, Mantreśvara —
          horā only). Varāhamihira&apos;s three-skandha codification is
          structurally unusual and pedagogically central. Tap any plate to
          read its chapter coverage and curriculum cross-references.
        </p>
      </div>

      {SKANDHA_TEXTS.map((text, idx) => {
        const isOpen = openSlug === text.slug;
        return (
          <article
            key={text.slug}
            style={{
              background: "linear-gradient(180deg, rgba(255, 249, 234, 0.96) 0%, rgba(252, 240, 210, 0.88) 100%)",
              border: `1px solid ${text.color}55`,
              borderLeft: `4px solid ${text.color}`,
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: isOpen
                ? `0 8px 20px ${text.color}22, 0 1px 0 rgba(255,255,255,0.6) inset`
                : `0 1px 2px rgba(74, 56, 24, 0.08), 0 1px 0 rgba(255,255,255,0.6) inset`,
              transition: reducedMotion ? "none" : "box-shadow 240ms ease",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenSlug(isOpen ? null : text.slug)}
              aria-expanded={isOpen}
              aria-label={`${text.skandhaLabel} — ${text.textName}. ${isOpen ? "Collapse" : "Expand"} full detail.`}
              className="gl-focus-ring"
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: "20px",
                width: "100%",
                padding: "22px 26px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                alignItems: "center",
              }}
            >
              {/* Skandha numeral */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${text.color}22, ${text.color}55)`,
                  border: `2px solid ${text.color}aa`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    color: text.colorDeep,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Skandha
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: text.colorDeep,
                    lineHeight: 1,
                    marginTop: "-2px",
                  }}
                >
                  {idx === 0 ? "I" : idx === 1 ? "II" : "III"}
                </span>
              </div>

              {/* Centre: skandha + text title + summary */}
              <div>
                <p
                  className="uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    color: text.colorDeep,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    margin: 0,
                  }}
                >
                  {text.skandhaLabel} · {text.skandhaDescription}
                </p>
                <p
                  lang="sa"
                  style={{
                    fontFamily: "var(--font-devanagari), serif",
                    fontSize: "22px",
                    color: GOLD_DEEP,
                    lineHeight: 1.2,
                    margin: 0,
                    marginTop: "4px",
                  }}
                >
                  {text.textNameDevanagari}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: INK_PRIMARY,
                    lineHeight: 1.2,
                    margin: 0,
                    marginTop: "2px",
                  }}
                >
                  {text.textName}{" "}
                  <span style={{ fontStyle: "italic", color: INK_MUTED, fontSize: "16px", fontWeight: 400 }}>
                    — {text.englishLabel}
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
                    maxWidth: "640px",
                  }}
                >
                  {text.summary}
                </p>
              </div>

              {/* Right: chapter count + chevron */}
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
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: text.colorDeep,
                    margin: 0,
                  }}
                >
                  {text.chapterCount}
                </p>
                <span aria-hidden style={{ color: text.colorDeep }}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </div>
            </button>

            {isOpen && (
              <div
                style={{
                  borderTop: `1px dashed ${text.color}55`,
                  padding: "20px 28px",
                  background: `linear-gradient(180deg, rgba(255, 251, 240, 0.6) 0%, rgba(252, 240, 210, 0.4) 100%)`,
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.5fr) minmax(280px, 1fr)",
                  gap: "24px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                      color: text.colorDeep,
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
                      fontSize: "15px",
                      color: INK_PRIMARY,
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {text.detail}
                  </p>

                  {/* Pañcasiddhāntikā gets the 5-siddhāntas sub-table */}
                  {text.slug === "pancasiddhantika" && (
                    <div
                      style={{
                        padding: "12px 14px",
                        background: "rgba(255, 251, 240, 0.65)",
                        border: `1px dashed ${text.color}55`,
                        borderRadius: "8px",
                        marginTop: "4px",
                      }}
                    >
                      <p
                        className="uppercase"
                        style={{
                          fontSize: "10.5px",
                          letterSpacing: "0.18em",
                          color: text.colorDeep,
                          fontWeight: 700,
                          fontFamily: "var(--font-sans), system-ui, sans-serif",
                          marginBottom: "10px",
                        }}
                      >
                        The 5 siddhāntas summarised
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                        {PRIOR_SIDDHANTAS.map((s) => (
                          <li
                            key={s.slug}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "auto 1fr",
                              gap: "10px",
                              alignItems: "baseline",
                            }}
                          >
                            <span
                              lang="sa"
                              style={{
                                fontFamily: "var(--font-devanagari), serif",
                                fontSize: "15px",
                                color: text.colorDeep,
                                flexShrink: 0,
                              }}
                            >
                              {s.nameDevanagari}
                            </span>
                            <span
                              style={{
                                fontFamily: "var(--font-cormorant), serif",
                                fontSize: "13.5px",
                                color: INK_SECONDARY,
                                lineHeight: 1.5,
                              }}
                            >
                              <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{s.name}</strong>{" "}
                              <em style={{ color: INK_MUTED }}>— {s.origin}.</em> {s.influence}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Coverage list */}
                  <div
                    style={{
                      padding: "13px 15px",
                      background: "rgba(255, 251, 240, 0.85)",
                      border: `1px solid ${text.color}55`,
                      borderLeft: `3px solid ${text.color}`,
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    <p
                      className="uppercase"
                      style={{
                        fontSize: "10.5px",
                        letterSpacing: "0.18em",
                        color: text.colorDeep,
                        fontWeight: 700,
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                        marginBottom: "8px",
                      }}
                    >
                      Major content areas
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "5px" }}>
                      {text.coverage.map((c, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "flex-start",
                            fontFamily: "var(--font-cormorant), serif",
                            fontSize: "13.5px",
                            color: INK_PRIMARY,
                            lineHeight: 1.5,
                          }}
                        >
                          <span style={{ color: text.color, flexShrink: 0 }}>·</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Default edition */}
                  <div
                    style={{
                      padding: "12px 14px",
                      background: `${JADE}10`,
                      borderLeft: `3px solid ${JADE}`,
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    <p
                      className="uppercase"
                      style={{
                        fontSize: "10.5px",
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
                      <BookOpen size={11} /> Curriculum default edition
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "12.5px",
                        color: INK_SECONDARY,
                        lineHeight: 1.55,
                        margin: 0,
                      }}
                    >
                      {text.defaultEdition}
                    </p>
                  </div>

                  {/* Curriculum cites */}
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
                        letterSpacing: "0.16em",
                        color: GOLD_DEEP,
                        fontWeight: 700,
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                        marginBottom: "5px",
                      }}
                    >
                      Where the curriculum cites this
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "12.5px",
                        color: INK_SECONDARY,
                        lineHeight: 1.55,
                        margin: 0,
                      }}
                    >
                      {text.curriculumCites}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}

      {/* ─── Astronomical-position dating methodology ─── */}
      <div
        className="gl-surface-twilight-glass"
        style={{
          padding: "22px 26px",
          background: `linear-gradient(135deg, rgba(255, 249, 234, 0.95) 0%, rgba(252, 240, 210, 0.85) 100%)`,
          border: `1px solid ${VERMILION}55`,
        }}
      >
        <header style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <Star size={18} style={{ color: VERMILION }} />
          <p
            className="uppercase"
            style={{
              color: VERMILION,
              letterSpacing: "0.20em",
              fontWeight: 700,
              fontSize: "13px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              margin: 0,
            }}
          >
            Astronomical-position dating methodology
          </p>
        </header>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "15.5px",
            color: INK_PRIMARY,
            lineHeight: 1.65,
            margin: "0 0 18px",
          }}
        >
          Why Varāhamihira&apos;s dating is so secure: <em>Pañcasiddhāntikā</em> contains internally-dateable
          astronomical observations. The methodology, operationalised by Neugebauer & Pingree (1970-1971):
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {DATING_METHOD_STEPS.map((s) => (
            <div
              key={s.step}
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                gap: "14px",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${VERMILION}22, ${VERMILION}55)`,
                  border: `1.5px solid ${VERMILION}`,
                  color: VERMILION_DEEP,
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  marginTop: "2px",
                }}
              >
                {s.step}
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: INK_PRIMARY,
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "14.5px",
                    color: INK_SECONDARY,
                    lineHeight: 1.6,
                    margin: 0,
                    marginTop: "4px",
                  }}
                >
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Both-anchors framework — diptych comparison ─── */}
      <div
        className="gl-surface-twilight-glass"
        style={{ padding: "22px 26px" }}
      >
        <header style={{ textAlign: "center", marginBottom: "20px" }}>
          <p
            className="uppercase"
            style={{
              color: GOLD,
              letterSpacing: "0.22em",
              fontWeight: 700,
              fontSize: "13px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            The both-anchors framework
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "16px",
              color: INK_SECONDARY,
              lineHeight: 1.6,
              margin: 0,
              maxWidth: "720px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Parāśara at the origin-tradition end. Varāhamihira at the
            historical-codification end. Both anchors honoured, never
            collapsed into one.
          </p>
        </header>

        {/* Diptych column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(140px, 200px) 1fr 1fr",
            gap: "12px",
            paddingBottom: "10px",
            borderBottom: `2px solid ${GOLD}55`,
            marginBottom: "8px",
          }}
        >
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
            Dimension
          </p>
          <p
            className="uppercase"
            style={{
              fontSize: "12px",
              letterSpacing: "0.18em",
              color: INDIGO_DEEP,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              margin: 0,
            }}
          >
            Parāśara · lineage authority
          </p>
          <p
            className="uppercase"
            style={{
              fontSize: "12px",
              letterSpacing: "0.18em",
              color: VERMILION_DEEP,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              margin: 0,
            }}
          >
            Varāhamihira · evidence authority
          </p>
        </div>

        {/* Diptych rows */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {BOTH_ANCHORS.map((d, idx) => (
            <div
              key={d.slug}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(140px, 200px) 1fr 1fr",
                gap: "12px",
                padding: "12px 0",
                borderBottom: idx < BOTH_ANCHORS.length - 1 ? `1px dashed ${GOLD}33` : "none",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  fontSize: "14px",
                  color: INK_PRIMARY,
                  fontWeight: 600,
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {d.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "13.5px",
                  color: INDIGO_DEEP,
                  lineHeight: 1.55,
                  margin: 0,
                  paddingLeft: "10px",
                  borderLeft: `2px solid ${INDIGO}55`,
                }}
              >
                {d.parashara}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "13.5px",
                  color: VERMILION_DEEP,
                  lineHeight: 1.55,
                  margin: 0,
                  paddingLeft: "10px",
                  borderLeft: `2px solid ${VERMILION}55`,
                }}
              >
                {d.varahamihira}
              </p>
            </div>
          ))}
        </div>

        {/* Framework summary */}
        <div
          style={{
            marginTop: "18px",
            padding: "16px 20px",
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
              color: INK_PRIMARY,
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {FRAMEWORK_SUMMARY.body}
          </p>
        </div>
      </div>
    </div>
  );
}
