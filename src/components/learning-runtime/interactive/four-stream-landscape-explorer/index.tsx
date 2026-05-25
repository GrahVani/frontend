/**
 * Four-Stream Landscape Explorer — L2.6 §4 explorer.
 *
 * Closes Chapter 2 by completing the multi-stream landscape. The §4 surface:
 *  - Hero diptych: classical-foundational (gold + indigo) ⇄ modern-primary
 *    (jade + crimson) — equal-weight 4-column landscape.
 *  - Modern-primary vs modern-revival distinction card.
 *  - K.S. Krishnamurti founder plate + 5 KP contribution plates (jade accent).
 *  - Pandit Roop Chand Joshi founder plate + 6 Lal Kitab contribution plates
 *    (crimson accent).
 *  - Three modern-primary status criteria card with per-stream evidence.
 */

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, BookOpen } from "lucide-react";
import {
  MODERN_AUTHORSHIP_KINDS,
  MODERN_PRIMARY_CRITERIA,
  STREAM_FOUNDERS,
  KP_CONTRIBUTIONS,
  LAL_KITAB_CONTRIBUTIONS,
} from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const JADE = "#3A8C5A";
const JADE_DEEP = "#1F5A37";
const CRIMSON = "#8B2D4E";
const CRIMSON_DEEP = "#5E1A33";
const VERMILION = "#A23A1E";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

export function FourStreamLandscapeExplorer() {
  const [openContribSlug, setOpenContribSlug] = useState<string | null>(null);
  const [showCriteriaSlug, setShowCriteriaSlug] = useState<number | null>(1);

  const kpFounder = STREAM_FOUNDERS.find((f) => f.streamSlug === "kp")!;
  const lkFounder = STREAM_FOUNDERS.find((f) => f.streamSlug === "lal-kitab")!;

  return (
    <div
      data-interactive="four-stream-landscape-explorer"
      style={{ display: "flex", flexDirection: "column", gap: "22px" }}
    >
      {/* ─── HERO: four-stream landscape banner ─── */}
      <div className="gl-surface-twilight-glass" style={{ padding: "22px 26px" }}>
        <p
          className="uppercase"
          style={{
            color: VERMILION,
            letterSpacing: "0.22em",
            fontWeight: 700,
            fontSize: "13px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          The four-stream classical landscape
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "16.5px",
            color: INK_SECONDARY,
            lineHeight: 1.6,
            margin: "0 auto",
            textAlign: "center",
            maxWidth: "760px",
            marginBottom: "22px",
          }}
        >
          Two classical-foundational streams + two modern-primary streams.
          All four real classical-equivalents within their own framework —
          complementary, not competing.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          {[
            { label: "Parāśari", deva: "पाराशरी", color: GOLD, colorDeep: GOLD_DEEP, classification: "Classical-foundational", subtitle: "BPHS · Bṛhat Jātaka" },
            { label: "Jaiminī", deva: "जैमिनि", color: INDIGO, colorDeep: INDIGO_DEEP, classification: "Classical-foundational", subtitle: "Jaiminī Sūtra" },
            { label: "KP", deva: "कृष्णमूर्ति पद्धति", color: JADE, colorDeep: JADE_DEEP, classification: "Modern primary", subtitle: "K.S. Krishnamurti · 1963" },
            { label: "Lal Kitab", deva: "लाल किताब", color: CRIMSON, colorDeep: CRIMSON_DEEP, classification: "Modern primary", subtitle: "Roop Chand Joshi · 1939" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: "16px 14px",
                background: `linear-gradient(135deg, ${s.color}12 0%, ${s.color}28 100%)`,
                border: `1px solid ${s.color}66`,
                borderTop: `4px solid ${s.color}`,
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <p
                lang="sa"
                style={{
                  fontFamily: "var(--font-devanagari), serif",
                  fontSize: "18px",
                  color: s.colorDeep,
                  lineHeight: 1.2,
                  margin: 0,
                  marginBottom: "4px",
                }}
              >
                {s.deva}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: s.colorDeep,
                  margin: 0,
                  marginBottom: "8px",
                  lineHeight: 1.2,
                }}
              >
                {s.label}
              </p>
              <p
                className="uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.16em",
                  color: s.color,
                  fontWeight: 700,
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  margin: 0,
                  marginBottom: "4px",
                }}
              >
                {s.classification}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  fontSize: "12.5px",
                  color: INK_SECONDARY,
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {s.subtitle}
              </p>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "13.5px",
            color: INK_MUTED,
            textAlign: "center",
            margin: 0,
            paddingTop: "10px",
            borderTop: `1px dashed ${VERMILION}33`,
          }}
        >
          Lessons 2.2-2.5 covered the first two streams.{" "}
          <strong style={{ color: VERMILION, fontWeight: 600 }}>
            This lesson completes the landscape with the two modern primaries.
          </strong>
        </p>
      </div>

      {/* ─── Modern-Primary vs Modern-Revival distinction ─── */}
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
            marginBottom: "10px",
          }}
        >
          The modern-primary doctrine
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "15.5px",
            color: INK_PRIMARY,
            lineHeight: 1.7,
            margin: "0 0 18px",
          }}
        >
          Modern Jyotiṣa authorship divides into two kinds. The distinction is
          load-bearing — citation discipline, authority basis, and engagement
          strategy all follow from it.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {MODERN_AUTHORSHIP_KINDS.map((k) => {
            const isMP = k.slug === "modern-primary";
            const accent = isMP ? VERMILION : GOLD;
            const accentDeep = isMP ? "#7A2A14" : GOLD_DEEP;
            return (
              <div
                key={k.slug}
                style={{
                  padding: "18px 20px",
                  background: `linear-gradient(135deg, ${accent}10 0%, ${accent}22 100%)`,
                  border: `1px solid ${accent}66`,
                  borderLeft: `4px solid ${accent}`,
                  borderRadius: "10px",
                }}
              >
                <p
                  className="uppercase"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    color: accentDeep,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    margin: 0,
                    marginBottom: "6px",
                  }}
                >
                  {k.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "14.5px",
                    color: INK_PRIMARY,
                    lineHeight: 1.65,
                    margin: 0,
                    marginBottom: "12px",
                  }}
                >
                  {k.definition}
                </p>
                <div style={{ paddingTop: "10px", borderTop: `1px dashed ${accent}55`, marginBottom: "10px" }}>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: "0.16em",
                      color: INK_MUTED,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      margin: 0,
                      marginBottom: "4px",
                    }}
                  >
                    Example
                  </p>
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
                    {k.example}
                  </p>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    background: `${accent}08`,
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.14em",
                      color: accentDeep,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      margin: 0,
                      marginBottom: "3px",
                    }}
                  >
                    Citation discipline
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "12.5px",
                      color: INK_PRIMARY,
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {k.citationDiscipline}
                  </p>
                </div>
                <div style={{ padding: "10px 12px", background: `${accent}08`, borderRadius: "8px" }}>
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.14em",
                      color: accentDeep,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      margin: 0,
                      marginBottom: "3px",
                    }}
                  >
                    Authority basis
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "12.5px",
                      color: INK_PRIMARY,
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {k.authorityBasis}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Stream 3: KP Founder + Contributions ─── */}
      <FounderPlate founder={kpFounder} accent={JADE} accentDeep={JADE_DEEP} />
      <ContributionStrip
        title="Five distinctive KP contributions"
        contributions={KP_CONTRIBUTIONS}
        accent={JADE}
        accentDeep={JADE_DEEP}
        openSlug={openContribSlug}
        onToggle={(slug) => setOpenContribSlug(openContribSlug === slug ? null : slug)}
      />

      {/* ─── Stream 4: Lal Kitab Founder + Contributions ─── */}
      <FounderPlate founder={lkFounder} accent={CRIMSON} accentDeep={CRIMSON_DEEP} />
      <ContributionStrip
        title="Six distinctive Lal Kitab contributions"
        contributions={LAL_KITAB_CONTRIBUTIONS}
        accent={CRIMSON}
        accentDeep={CRIMSON_DEEP}
        openSlug={openContribSlug}
        onToggle={(slug) => setOpenContribSlug(openContribSlug === slug ? null : slug)}
      />

      {/* ─── Three Modern-Primary Status Criteria ─── */}
      <div className="gl-surface-twilight-glass" style={{ padding: "22px 26px" }}>
        <p
          className="uppercase"
          style={{
            color: VERMILION,
            letterSpacing: "0.20em",
            fontWeight: 700,
            fontSize: "13px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            margin: 0,
            marginBottom: "8px",
          }}
        >
          The three modern-primary status criteria
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "15px",
            color: INK_SECONDARY,
            lineHeight: 1.6,
            margin: 0,
            marginBottom: "18px",
          }}
        >
          The bar for modern-primary status is HIGH — all three criteria
          required. Many modern Jyotiṣa authors fall short of all three.
          The two unambiguous modern-primaries in 20th-century Vedic-astrology:
          KP and Lal Kitab.
        </p>

        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {MODERN_PRIMARY_CRITERIA.map((c) => {
            const isActive = c.number === showCriteriaSlug;
            return (
              <button
                key={c.number}
                type="button"
                onClick={() => setShowCriteriaSlug(c.number)}
                className="gl-focus-ring"
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  background: isActive
                    ? `linear-gradient(135deg, ${VERMILION}20 0%, ${VERMILION}38 100%)`
                    : "transparent",
                  border: `1.5px solid ${isActive ? VERMILION : `${GOLD}44`}`,
                  borderRadius: "10px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "32px",
                    fontWeight: 700,
                    color: isActive ? VERMILION : INK_MUTED,
                    lineHeight: 1,
                    marginBottom: "4px",
                  }}
                >
                  {c.number}
                </div>
                <p
                  className="uppercase"
                  style={{
                    fontSize: "10.5px",
                    letterSpacing: "0.14em",
                    color: isActive ? VERMILION : INK_MUTED,
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    margin: 0,
                  }}
                >
                  {c.shortName}
                </p>
              </button>
            );
          })}
        </div>

        {(() => {
          const c = MODERN_PRIMARY_CRITERIA.find((x) => x.number === showCriteriaSlug)!;
          return (
            <div>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: INK_PRIMARY,
                  lineHeight: 1.3,
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                {c.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "14.5px",
                  color: INK_PRIMARY,
                  lineHeight: 1.65,
                  margin: 0,
                  marginBottom: "16px",
                }}
              >
                {c.description}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div
                  style={{
                    padding: "14px 16px",
                    background: `linear-gradient(135deg, ${JADE}10 0%, ${JADE}22 100%)`,
                    border: `1px solid ${JADE}66`,
                    borderLeft: `3px solid ${JADE}`,
                    borderRadius: "8px",
                  }}
                >
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: "0.16em",
                      color: JADE_DEEP,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      margin: 0,
                      marginBottom: "5px",
                    }}
                  >
                    ✓ KP evidence
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "13px",
                      color: INK_PRIMARY,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {c.kpEvidence}
                  </p>
                </div>
                <div
                  style={{
                    padding: "14px 16px",
                    background: `linear-gradient(135deg, ${CRIMSON}10 0%, ${CRIMSON}22 100%)`,
                    border: `1px solid ${CRIMSON}66`,
                    borderLeft: `3px solid ${CRIMSON}`,
                    borderRadius: "8px",
                  }}
                >
                  <p
                    className="uppercase"
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: "0.16em",
                      color: CRIMSON_DEEP,
                      fontWeight: 700,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      margin: 0,
                      marginBottom: "5px",
                    }}
                  >
                    ✓ Lal Kitab evidence
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "13px",
                      color: INK_PRIMARY,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {c.lalKitabEvidence}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ──────────── Sub-component: founder biographical plate ──────────── */

function FounderPlate({
  founder,
  accent,
  accentDeep,
}: {
  founder: (typeof STREAM_FOUNDERS)[number];
  accent: string;
  accentDeep: string;
}) {
  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "22px 26px",
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "4px 12px",
          background: `${accent}15`,
          border: `1px solid ${accent}55`,
          borderRadius: "999px",
          marginBottom: "10px",
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
            margin: 0,
          }}
        >
          Modern-primary stream · {founder.streamLabel}
        </p>
      </div>

      <p
        lang="sa"
        style={{
          fontFamily: "var(--font-devanagari), serif",
          fontSize: "26px",
          color: accentDeep,
          lineHeight: 1.2,
          margin: 0,
          marginBottom: "2px",
        }}
      >
        {founder.founderDevanagari}
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "30px",
          fontWeight: 600,
          color: accentDeep,
          lineHeight: 1.15,
          margin: 0,
          marginBottom: "8px",
        }}
      >
        {founder.founderName}
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "13px",
          color: INK_MUTED,
          lineHeight: 1.5,
          margin: 0,
          marginBottom: "16px",
        }}
      >
        {founder.meaningOfName}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          padding: "14px 0",
          borderTop: `1px solid ${accent}33`,
          borderBottom: `1px solid ${accent}33`,
          marginBottom: "14px",
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
              marginBottom: "3px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Calendar size={11} /> Lifespan
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "13.5px",
              color: INK_PRIMARY,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            <strong style={{ color: accentDeep, fontWeight: 600 }}>Born:</strong>{" "}
            {founder.born}
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "13.5px",
              color: INK_PRIMARY,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            <strong style={{ color: accentDeep, fontWeight: 600 }}>Died:</strong>{" "}
            {founder.died}
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "13.5px",
              color: INK_SECONDARY,
              lineHeight: 1.5,
              margin: 0,
              marginTop: "4px",
            }}
          >
            <strong style={{ color: accentDeep, fontWeight: 600 }}>Location:</strong>{" "}
            {founder.primaryLocation}
          </p>
        </div>
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
              marginBottom: "3px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <BookOpen size={11} /> Primary corpus
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "13.5px",
              color: INK_PRIMARY,
              lineHeight: 1.55,
              margin: 0,
              marginBottom: "4px",
            }}
          >
            {founder.primaryCorpus}
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "12.5px",
              color: INK_SECONDARY,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Language: {founder.language}
          </p>
        </div>
      </div>

      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "13.5px",
          color: INK_SECONDARY,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        <strong style={{ color: accentDeep, fontWeight: 600, fontStyle: "normal" }}>
          Publication arc:
        </strong>{" "}
        {founder.publicationArc}
      </p>
    </div>
  );
}

/* ──────────── Sub-component: contribution strip ──────────── */

function ContributionStrip({
  title,
  contributions,
  accent,
  accentDeep,
  openSlug,
  onToggle,
}: {
  title: string;
  contributions: (typeof KP_CONTRIBUTIONS)[number][];
  accent: string;
  accentDeep: string;
  openSlug: string | null;
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "18px 24px 14px" }}>
      <p
        className="uppercase"
        style={{
          color: accent,
          letterSpacing: "0.20em",
          fontWeight: 700,
          fontSize: "13px",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          margin: 0,
          marginBottom: "8px",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "15px",
          color: INK_PRIMARY,
          lineHeight: 1.6,
          margin: 0,
          marginBottom: "14px",
        }}
      >
        Tap any contribution for the full operational definition + its
        classical-antecedent status (derivable from classical sources, or not).
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {contributions.map((c) => {
          const isOpen = openSlug === c.slug;
          const isClassicallyDerivable = c.classicalAntecedent.startsWith("PARTIAL");
          return (
            <article
              key={c.slug}
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 249, 234, 0.96) 0%, rgba(252, 240, 210, 0.88) 100%)",
                border: `1px solid ${accent}55`,
                borderLeft: `4px solid ${accent}`,
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: isOpen
                  ? `0 8px 20px ${accent}22, 0 1px 0 rgba(255,255,255,0.6) inset`
                  : `0 1px 2px rgba(74, 56, 24, 0.08), 0 1px 0 rgba(255,255,255,0.6) inset`,
                transition: "box-shadow 240ms ease",
              }}
            >
              <button
                type="button"
                onClick={() => onToggle(c.slug)}
                aria-expanded={isOpen}
                aria-label={`${c.name}. ${isOpen ? "Collapse" : "Expand"}.`}
                className="gl-focus-ring"
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: "14px",
                  width: "100%",
                  padding: "16px 20px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: `${accent}20`,
                    border: `1.5px solid ${accent}66`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: accentDeep,
                    }}
                  >
                    {c.number}
                  </span>
                </div>
                <div>
                  {c.sanskritOrDevanagari && (
                    <p
                      lang="sa"
                      style={{
                        fontFamily: "var(--font-devanagari), serif",
                        fontSize: "16px",
                        color: accentDeep,
                        lineHeight: 1.2,
                        margin: 0,
                        marginBottom: "2px",
                      }}
                    >
                      {c.sanskritOrDevanagari}
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: INK_PRIMARY,
                      lineHeight: 1.3,
                      margin: 0,
                      marginBottom: "4px",
                    }}
                  >
                    {c.name}
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
                    {c.shortDescription}
                  </p>
                </div>
                <span aria-hidden style={{ color: accentDeep, flexShrink: 0 }}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {isOpen && (
                <div
                  style={{
                    borderTop: `1px dashed ${accent}55`,
                    padding: "18px 22px",
                    background: `linear-gradient(180deg, rgba(255, 251, 240, 0.6) 0%, rgba(252, 240, 210, 0.4) 100%)`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div>
                    <p
                      className="uppercase"
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.16em",
                        color: accentDeep,
                        fontWeight: 700,
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                        marginBottom: "5px",
                      }}
                    >
                      Full operational definition
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "14px",
                        color: INK_PRIMARY,
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {c.fullDescription}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "12px 14px",
                      background: isClassicallyDerivable
                        ? `${GOLD}10`
                        : `${VERMILION}10`,
                      borderLeft: `3px solid ${isClassicallyDerivable ? GOLD : VERMILION}`,
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    <p
                      className="uppercase"
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.16em",
                        color: isClassicallyDerivable ? GOLD_DEEP : VERMILION,
                        fontWeight: 700,
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                        marginBottom: "5px",
                      }}
                    >
                      Classical-antecedent status
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
                      {c.classicalAntecedent}
                    </p>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
