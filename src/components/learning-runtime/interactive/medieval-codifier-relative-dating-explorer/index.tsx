/**
 * Medieval Codifier Relative-Dating Explorer — L2.4 §4 explorer.
 *
 * Full-width manuscript-scroll layout. Top: 3-layer Parāśari-tradition
 * lineage hero. Middle: 4 medieval-codifier plates with dating brackets,
 * citation evidence, contribution, and click-to-expand detail. Bottom:
 * compounding-uncertainty visualisation showing why dating brackets
 * widen with citation-chain length.
 */

"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, ArrowDown } from "lucide-react";
import {
  MEDIEVAL_CODIFIERS,
  LINEAGE_LAYERS,
  UNCERTAINTY_BANDS,
  FRAMEWORK_SUMMARY,
  type MedievalCodifier,
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

export function MedievalCodifierRelativeDatingExplorer() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      data-interactive="medieval-codifier-relative-dating-explorer"
      style={{ display: "flex", flexDirection: "column", gap: "22px" }}
    >
      {/* ─── Three-layer lineage hero ─── */}
      <div
        className="gl-surface-twilight-glass"
        style={{ padding: "22px 26px" }}
      >
        <p
          className="uppercase"
          style={{
            color: GOLD,
            letterSpacing: "0.22em",
            fontWeight: 700,
            fontSize: "13px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          The three-layer Parāśari-tradition lineage
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
            marginBottom: "22px",
          }}
        >
          Three cumulative layers of authority — each building on the prior,
          none displacing it. The medieval codifiers occupy the third layer.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {LINEAGE_LAYERS.map((layer, idx) => (
            <div key={layer.slug}>
              <div
                style={{
                  padding: "16px 20px",
                  background: `linear-gradient(135deg, ${layer.color}10 0%, ${layer.color}25 100%)`,
                  border: `1px solid ${layer.color}55`,
                  borderLeft: `4px solid ${layer.color}`,
                  borderRadius: "10px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${layer.color}44, ${layer.color}88)`,
                    border: `2px solid ${layer.colorDeep}`,
                    color: "#FFFCF0",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: 700,
                    fontFamily: "var(--font-cormorant), serif",
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                      color: layer.colorDeep,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      margin: 0,
                      marginBottom: "2px",
                    }}
                  >
                    Layer {idx + 1} · {layer.authorityKind}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "19px",
                      fontWeight: 600,
                      color: INK_PRIMARY,
                      lineHeight: 1.25,
                      margin: 0,
                    }}
                  >
                    {layer.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontStyle: "italic",
                      fontSize: "13.5px",
                      color: INK_SECONDARY,
                      lineHeight: 1.55,
                      margin: 0,
                      marginTop: "4px",
                    }}
                  >
                    {layer.description}
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "13px",
                    color: layer.colorDeep,
                    fontWeight: 600,
                    lineHeight: 1.45,
                    margin: 0,
                    textAlign: "right",
                    flexShrink: 0,
                    maxWidth: "240px",
                  }}
                >
                  {layer.members}
                </p>
              </div>
              {idx < LINEAGE_LAYERS.length - 1 && (
                <div aria-hidden style={{ textAlign: "center", padding: "4px 0", color: GOLD_DEEP, opacity: 0.5 }}>
                  <ArrowDown size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Section header for the codifier plates ─── */}
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
          The four medieval codifiers
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
          Four major post-Varāhamihira authors — each with distinctive
          contribution and bracketed dating against the 575 CE anchor. Tap
          any plate to read full context, citation evidence, and curriculum
          cross-references.
        </p>
      </div>

      {/* ─── Four codifier plates ─── */}
      {MEDIEVAL_CODIFIERS.map((codifier, idx) => {
        const isOpen = openSlug === codifier.slug;
        return (
          <article
            key={codifier.slug}
            style={{
              background: "linear-gradient(180deg, rgba(255, 249, 234, 0.96) 0%, rgba(252, 240, 210, 0.88) 100%)",
              border: `1px solid ${codifier.color}55`,
              borderLeft: `4px solid ${codifier.color}`,
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: isOpen
                ? `0 8px 20px ${codifier.color}22, 0 1px 0 rgba(255,255,255,0.6) inset`
                : `0 1px 2px rgba(74, 56, 24, 0.08), 0 1px 0 rgba(255,255,255,0.6) inset`,
              transition: reducedMotion ? "none" : "box-shadow 240ms ease",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenSlug(isOpen ? null : codifier.slug)}
              aria-expanded={isOpen}
              aria-label={`${codifier.author} — ${codifier.text}. ${isOpen ? "Collapse" : "Expand"}.`}
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
              {/* Plate numeral */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${codifier.color}22, ${codifier.color}55)`,
                  border: `2px solid ${codifier.color}aa`,
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
                    color: codifier.colorDeep,
                    fontWeight: 700,
                  }}
                >
                  Codifier
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: codifier.colorDeep,
                    lineHeight: 1,
                    marginTop: "-2px",
                  }}
                >
                  {idx === 0 ? "I" : idx === 1 ? "II" : idx === 2 ? "III" : "IV"}
                </span>
              </div>

              {/* Centre: author + text + contribution */}
              <div>
                <p
                  lang="sa"
                  style={{
                    fontFamily: "var(--font-devanagari), serif",
                    fontSize: "20px",
                    color: GOLD_DEEP,
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {codifier.authorDevanagari}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: codifier.colorDeep,
                    lineHeight: 1.3,
                    margin: 0,
                    marginTop: "3px",
                  }}
                >
                  {codifier.author}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: INK_PRIMARY,
                    lineHeight: 1.2,
                    margin: 0,
                    marginTop: "6px",
                  }}
                >
                  {codifier.text}{" "}
                  <span style={{ fontStyle: "italic", color: INK_MUTED, fontSize: "15px", fontWeight: 400 }}>
                    — {codifier.englishLabel}
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
                  {codifier.contribution}
                </p>
              </div>

              {/* Right: dating bracket + uncertainty + chevron */}
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
                      color: codifier.colorDeep,
                      lineHeight: 1.2,
                      margin: 0,
                    }}
                  >
                    {codifier.dateRange}
                  </p>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.14em",
                      color: INK_MUTED,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      marginTop: "3px",
                      margin: 0,
                    }}
                  >
                    Bracket
                  </p>
                </div>
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
                  ± {codifier.bracketYears} yr
                </span>
                <span aria-hidden style={{ color: codifier.colorDeep }}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </div>
            </button>

            {isOpen && (
              <div
                style={{
                  borderTop: `1px dashed ${codifier.color}55`,
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
                      color: codifier.colorDeep,
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
                    {codifier.detail}
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
                      {codifier.curriculumCites}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Citation evidence */}
                  <div
                    style={{
                      padding: "13px 15px",
                      background: "rgba(255, 251, 240, 0.85)",
                      border: `1px solid ${codifier.color}55`,
                      borderLeft: `3px solid ${codifier.color}`,
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    <p
                      className="uppercase"
                      style={{
                        fontSize: "10.5px",
                        letterSpacing: "0.18em",
                        color: codifier.colorDeep,
                        fontWeight: 700,
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                        marginBottom: "8px",
                      }}
                    >
                      Citation evidence
                    </p>
                    <div style={{ marginBottom: "10px" }}>
                      <p
                        className="uppercase"
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.14em",
                          color: INDIGO_DEEP,
                          fontWeight: 700,
                          fontFamily: "var(--font-sans), system-ui, sans-serif",
                          marginBottom: "4px",
                        }}
                      >
                        Cites as predecessor (post-them)
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "3px" }}>
                        {codifier.citesAsPredecessor.map((p, i) => (
                          <li
                            key={i}
                            style={{
                              fontFamily: "var(--font-cormorant), serif",
                              fontSize: "13px",
                              color: INK_SECONDARY,
                              lineHeight: 1.4,
                              display: "flex",
                              gap: "6px",
                            }}
                          >
                            <span style={{ color: INDIGO, flexShrink: 0 }}>↑</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p
                        className="uppercase"
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.14em",
                          color: VERMILION,
                          fontWeight: 700,
                          fontFamily: "var(--font-sans), system-ui, sans-serif",
                          marginBottom: "4px",
                        }}
                      >
                        Cited by (post-this-text)
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "3px" }}>
                        {codifier.citedBy.map((c, i) => (
                          <li
                            key={i}
                            style={{
                              fontFamily: "var(--font-cormorant), serif",
                              fontSize: "13px",
                              color: INK_SECONDARY,
                              lineHeight: 1.4,
                              display: "flex",
                              gap: "6px",
                            }}
                          >
                            <span style={{ color: VERMILION, flexShrink: 0 }}>↓</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Default edition */}
                  <div
                    style={{
                      padding: "10px 12px",
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
                        marginBottom: "4px",
                      }}
                    >
                      Curriculum default edition
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
                      {codifier.defaultEdition}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}

      {/* ─── Compounding uncertainty visualisation ─── */}
      <div
        className="gl-surface-twilight-glass"
        style={{
          padding: "22px 26px",
          background: `linear-gradient(135deg, rgba(255, 249, 234, 0.95) 0%, rgba(252, 240, 210, 0.85) 100%)`,
          border: `1px solid ${VERMILION}55`,
        }}
      >
        <p
          className="uppercase"
          style={{
            color: VERMILION,
            letterSpacing: "0.20em",
            fontWeight: 700,
            fontSize: "13px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "10px",
          }}
        >
          Compounding uncertainty along the citation chain
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "15.5px",
            color: INK_PRIMARY,
            lineHeight: 1.65,
            margin: "0 0 18px",
          }}
        >
          Dating uncertainty grows the further the citation chain extends
          from Varāhamihira&apos;s secure anchor. The widening brackets are
          visible below.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {UNCERTAINTY_BANDS.map((band, idx) => {
            // Compute bar width from bracket years for visual comparison
            const maxBracket = 300;
            const numericBracket = parseInt(band.uncertaintyBracket.match(/\d+/)?.[0] ?? "0", 10);
            const widthPct = Math.max(8, (numericBracket / maxBracket) * 100);
            return (
              <div
                key={band.author}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(140px, 180px) 1fr",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: INK_PRIMARY,
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {band.author}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontStyle: "italic",
                      fontSize: "12px",
                      color: INK_MUTED,
                      lineHeight: 1.3,
                      margin: 0,
                      marginTop: "2px",
                    }}
                  >
                    {band.citationChainLength}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: `${widthPct}%`,
                      maxWidth: "100%",
                      height: "22px",
                      background: `linear-gradient(to right, ${VERMILION}88, ${VERMILION}33)`,
                      border: `1.5px solid ${VERMILION}`,
                      borderRadius: "4px",
                      transition: "width 320ms ease",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: VERMILION,
                      flexShrink: 0,
                    }}
                  >
                    {band.uncertaintyBracket}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "13.5px",
            color: INK_MUTED,
            lineHeight: 1.6,
            margin: 0,
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: `1px dashed ${VERMILION}33`,
          }}
        >
          Notice Vaidyanātha&apos;s bracket (±50 yr) is tighter than
          Mantreśvara&apos;s (±300 yr) despite being further down the chain
          — that&apos;s because a tight CEILING (17th-c. citation network) can
          compensate for a long FLOOR (chain length from anchor).
        </p>
      </div>

      {/* ─── Framework summary ─── */}
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
            color: "#1F5A37",
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
            fontSize: "15.5px",
            color: INK_PRIMARY,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {FRAMEWORK_SUMMARY.body}
        </p>
      </div>
    </div>
  );
}
