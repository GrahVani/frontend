/**
 * Parāśari ⇄ Jaiminī Parallel-Tradition Explorer — L2.5 §4 explorer.
 *
 * Full-width side-by-side diptych across four lineage layers + sūtra-vs-
 * verse genre comparison + 5 distinctive Jaiminī doctrines. The signature
 * visual: two equal columns running down the page (Parāśari LEFT in gold,
 * Jaiminī RIGHT in indigo) — the parallelism is the lesson.
 */

"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight, ArrowLeft } from "lucide-react";
import {
  TRADITION_LAYERS,
  GENRE_COMPARISON,
  JAIMINI_DOCTRINES,
  IDENTITY_QUESTION,
  FRAMEWORK_SUMMARY,
} from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const VERMILION = "#A23A1E";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const JADE = "#3A8C5A";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

export function ParashariJaiminiParallelTraditionExplorer() {
  const [openDoctrineSlug, setOpenDoctrineSlug] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      data-interactive="parashari-jaimini-parallel-tradition-explorer"
      style={{ display: "flex", flexDirection: "column", gap: "22px" }}
    >
      {/* ─── Two-tradition diptych hero ─── */}
      <div className="gl-surface-twilight-glass" style={{ padding: "22px 26px" }}>
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
          Two traditions, parallel through three millennia
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
          Parāśari and Jaiminī run alongside each other throughout classical
          history — structurally parallel, doctrinally complementary. Neither
          subordinates the other.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "0", alignItems: "stretch" }}>
          {/* PARĀŚARI LEFT */}
          <div
            style={{
              padding: "20px 22px",
              background: `linear-gradient(135deg, ${GOLD}10 0%, ${GOLD}25 100%)`,
              border: `1px solid ${GOLD}66`,
              borderRight: "none",
              borderRadius: "12px 0 0 12px",
            }}
          >
            <p
              className="uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                color: GOLD_DEEP,
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginBottom: "6px",
              }}
            >
              First tradition
            </p>
            <p
              lang="sa"
              style={{
                fontFamily: "var(--font-devanagari), serif",
                fontSize: "26px",
                color: GOLD_DEEP,
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              पाराशरी
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "22px",
                fontWeight: 600,
                color: GOLD_DEEP,
                lineHeight: 1.2,
                margin: 0,
                marginTop: "4px",
              }}
            >
              Parāśari
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "14.5px",
                color: INK_PRIMARY,
                lineHeight: 1.65,
                margin: 0,
                marginTop: "12px",
              }}
            >
              Encyclopaedic-verse style. Graha-aspect-centred. Vimśottarī
              time-engine. Fixed naisargika kārakas. The most-cited classical
              tradition in modern global practice.
            </p>
          </div>

          {/* CENTER: parallel bridge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 12px",
              minWidth: "70px",
              background: `linear-gradient(to right, ${GOLD}30, ${INDIGO}30)`,
              borderTop: `1px solid ${GOLD}55`,
              borderBottom: `1px solid ${INDIGO}55`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
              <ArrowLeft size={16} style={{ color: GOLD_DEEP }} />
              <ArrowRight size={16} style={{ color: INDIGO_DEEP }} />
            </div>
            <p
              className="uppercase"
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.18em",
                color: VERMILION,
                fontWeight: 700,
                marginTop: "8px",
                textAlign: "center",
              }}
            >
              Parallel<br />not<br />subordinate
            </p>
          </div>

          {/* JAIMINĪ RIGHT */}
          <div
            style={{
              padding: "20px 22px",
              background: `linear-gradient(135deg, ${INDIGO}10 0%, ${INDIGO}25 100%)`,
              border: `1px solid ${INDIGO}66`,
              borderLeft: "none",
              borderRadius: "0 12px 12px 0",
              textAlign: "right",
            }}
          >
            <p
              className="uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                color: INDIGO_DEEP,
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                marginBottom: "6px",
              }}
            >
              Second tradition
            </p>
            <p
              lang="sa"
              style={{
                fontFamily: "var(--font-devanagari), serif",
                fontSize: "26px",
                color: INDIGO_DEEP,
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              जैमिनि
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "22px",
                fontWeight: 600,
                color: INDIGO_DEEP,
                lineHeight: 1.2,
                margin: 0,
                marginTop: "4px",
              }}
            >
              Jaiminī
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "14.5px",
                color: INK_PRIMARY,
                lineHeight: 1.65,
                margin: 0,
                marginTop: "12px",
              }}
            >
              Sūtra-style composition. Rāśi-aspect-centred. Cara rāśi-daśās.
              Variable cara kārakas. Ārūḍha lagna. Distinctive yoga catalogue.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Four-layer parallel comparison ─── */}
      <div className="gl-surface-twilight-glass" style={{ padding: "22px 26px" }}>
        <p
          className="uppercase"
          style={{
            color: GOLD,
            letterSpacing: "0.20em",
            fontWeight: 700,
            fontSize: "13px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
            marginBottom: "16px",
          }}
        >
          The four lineage layers — side by side
        </p>

        {/* Column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(160px, 200px) 1fr 1fr",
            gap: "16px",
            paddingBottom: "10px",
            borderBottom: `2px solid ${GOLD}55`,
            marginBottom: "12px",
          }}
        >
          <p
            className="uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              color: INK_MUTED,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              margin: 0,
            }}
          >
            Layer
          </p>
          <p
            className="uppercase"
            style={{
              fontSize: "12px",
              letterSpacing: "0.18em",
              color: GOLD_DEEP,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              margin: 0,
            }}
          >
            Parāśari
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
            Jaiminī
          </p>
        </div>

        {/* Four layer rows */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {TRADITION_LAYERS.map((layer, idx) => (
            <div
              key={layer.slug}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(160px, 200px) 1fr 1fr",
                gap: "16px",
                padding: "14px 0",
                borderBottom: idx < TRADITION_LAYERS.length - 1 ? `1px dashed ${GOLD}33` : "none",
                alignItems: "flex-start",
              }}
            >
              <div>
                <p
                  className="uppercase"
                  style={{
                    fontSize: "10.5px",
                    letterSpacing: "0.16em",
                    color: INK_MUTED,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    margin: 0,
                  }}
                >
                  Layer {idx + 1}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: INK_PRIMARY,
                    lineHeight: 1.3,
                    margin: 0,
                    marginTop: "2px",
                  }}
                >
                  {layer.label}
                </p>
              </div>
              <div
                style={{
                  paddingLeft: "12px",
                  borderLeft: `2px solid ${GOLD}55`,
                }}
              >
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "3px", marginBottom: "6px" }}>
                  {layer.parashari.authors.map((a, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: GOLD_DEEP,
                        lineHeight: 1.4,
                      }}
                    >
                      {a}
                    </li>
                  ))}
                </ul>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "13px",
                    color: INK_SECONDARY,
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {layer.parashari.signature}
                </p>
              </div>
              <div
                style={{
                  paddingLeft: "12px",
                  borderLeft: `2px solid ${INDIGO}55`,
                }}
              >
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "3px", marginBottom: "6px" }}>
                  {layer.jaimini.authors.map((a, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: INDIGO_DEEP,
                        lineHeight: 1.4,
                      }}
                    >
                      {a}
                    </li>
                  ))}
                </ul>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "13px",
                    color: INK_SECONDARY,
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {layer.jaimini.signature}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Sūtra-vs-verse genre comparison ─── */}
      <div className="gl-surface-twilight-glass" style={{ padding: "22px 26px" }}>
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
          The genre difference — sūtra vs encyclopaedic verse
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "15.5px",
            color: INK_PRIMARY,
            lineHeight: 1.6,
            margin: "0 0 18px",
          }}
        >
          The two traditions are composed in fundamentally different Sanskrit
          textual genres. The genre difference is itself part of what
          distinguishes them.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {[GENRE_COMPARISON.parashari, GENRE_COMPARISON.jaimini].map((g, i) => (
            <div
              key={i}
              style={{
                padding: "16px 18px",
                background: `linear-gradient(135deg, ${g.color}10 0%, ${g.color}22 100%)`,
                border: `1px solid ${g.color}66`,
                borderLeft: `4px solid ${g.color}`,
                borderRadius: "10px",
              }}
            >
              <p
                lang="sa"
                style={{
                  fontFamily: "var(--font-devanagari), serif",
                  fontSize: "20px",
                  color: g.colorDeep,
                  lineHeight: 1.2,
                  margin: 0,
                  marginBottom: "2px",
                }}
              >
                {g.sanskrit}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "19px",
                  fontWeight: 700,
                  color: g.colorDeep,
                  margin: 0,
                  marginBottom: "10px",
                }}
              >
                {g.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "14px",
                  color: INK_PRIMARY,
                  lineHeight: 1.65,
                  margin: 0,
                  marginBottom: "10px",
                }}
              >
                {g.description}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  fontSize: "12.5px",
                  color: INK_MUTED,
                  lineHeight: 1.5,
                  margin: 0,
                  paddingTop: "8px",
                  borderTop: `1px dashed ${g.color}55`,
                }}
              >
                {g.examples}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Five distinctive Jaiminī doctrines ─── */}
      <div className="gl-surface-twilight-glass" style={{ padding: "18px 24px 14px" }}>
        <p
          className="uppercase"
          style={{
            color: INDIGO_DEEP,
            letterSpacing: "0.20em",
            fontWeight: 700,
            fontSize: "13px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
            marginBottom: "8px",
          }}
        >
          Five distinctive Jaiminī doctrines
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
          Each Jaiminī doctrine has either a different Parāśari counterpart
          (different mechanism for the same predictive purpose) or NO
          Parāśari counterpart (genuinely unique). Tap any plate for the
          operational distinction.
        </p>
      </div>

      {JAIMINI_DOCTRINES.map((d) => {
        const isOpen = openDoctrineSlug === d.slug;
        return (
          <article
            key={d.slug}
            style={{
              background: "linear-gradient(180deg, rgba(255, 249, 234, 0.96) 0%, rgba(252, 240, 210, 0.88) 100%)",
              border: `1px solid ${INDIGO}55`,
              borderLeft: `4px solid ${INDIGO}`,
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: isOpen
                ? `0 8px 20px ${INDIGO}22, 0 1px 0 rgba(255,255,255,0.6) inset`
                : `0 1px 2px rgba(74, 56, 24, 0.08), 0 1px 0 rgba(255,255,255,0.6) inset`,
              transition: reducedMotion ? "none" : "box-shadow 240ms ease",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenDoctrineSlug(isOpen ? null : d.slug)}
              aria-expanded={isOpen}
              aria-label={`${d.jaiminiTerm}. ${isOpen ? "Collapse" : "Expand"}.`}
              className="gl-focus-ring"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "16px",
                width: "100%",
                padding: "18px 22px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  lang="sa"
                  style={{
                    fontFamily: "var(--font-devanagari), serif",
                    fontSize: "20px",
                    color: INDIGO_DEEP,
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {d.jaiminiDevanagari}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: INK_PRIMARY,
                    lineHeight: 1.2,
                    margin: 0,
                    marginTop: "3px",
                  }}
                >
                  {d.jaiminiTerm}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "13.5px",
                    color: INK_SECONDARY,
                    lineHeight: 1.55,
                    margin: 0,
                    marginTop: "6px",
                  }}
                >
                  Parāśari counterpart:{" "}
                  <strong style={{ color: GOLD_DEEP, fontWeight: 600 }}>{d.parashariCounterpart}</strong>
                </p>
              </div>
              <span aria-hidden style={{ color: INDIGO_DEEP, flexShrink: 0 }}>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>

            {isOpen && (
              <div
                style={{
                  borderTop: `1px dashed ${INDIGO}55`,
                  padding: "18px 24px",
                  background: `linear-gradient(180deg, rgba(255, 251, 240, 0.6) 0%, rgba(252, 240, 210, 0.4) 100%)`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.16em",
                      color: INDIGO_DEEP,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      marginBottom: "5px",
                    }}
                  >
                    What it is
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
                    {d.description}
                  </p>
                </div>
                <div
                  style={{
                    padding: "12px 14px",
                    background: `${VERMILION}10`,
                    borderLeft: `3px solid ${VERMILION}`,
                    borderRadius: "0 8px 8px 0",
                  }}
                >
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.16em",
                      color: VERMILION,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      marginBottom: "5px",
                    }}
                  >
                    Parāśari vs Jaiminī — the operational distinction
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "13.5px",
                      color: INK_PRIMARY,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {d.operationalNote}
                  </p>
                </div>
              </div>
            )}
          </article>
        );
      })}

      {/* ─── Same-Jaiminī identity question ─── */}
      <div
        className="gl-surface-twilight-glass"
        style={{
          padding: "20px 24px",
          background: `linear-gradient(135deg, rgba(255, 249, 234, 0.95) 0%, rgba(252, 240, 210, 0.85) 100%)`,
          border: `1px solid ${GOLD}66`,
        }}
      >
        <p
          className="uppercase"
          style={{
            color: GOLD,
            letterSpacing: "0.20em",
            fontWeight: 700,
            fontSize: "12px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "10px",
          }}
        >
          The same-Jaiminī identity question
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "16px",
            color: INK_PRIMARY,
            lineHeight: 1.55,
            margin: 0,
            marginBottom: "10px",
            fontWeight: 600,
          }}
        >
          {IDENTITY_QUESTION.question}
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "14.5px",
            color: INK_SECONDARY,
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {IDENTITY_QUESTION.framing}
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
