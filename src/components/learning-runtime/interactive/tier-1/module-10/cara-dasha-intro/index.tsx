"use client";

/**
 * CaraDashaIntro — Jaimini Cara Daśā Introduction
 *
 * §7 interactive for Lesson 10.6.1.
 *
 * Side-by-side contrast of Vimśottarī (planet-based, fixed) vs Cara
 * (sign-based, variable). Shows the 12 rāśi Cara sequence with modality
 * colouring, and demonstrates cross-validation concept.
 */

import { useState, useMemo } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  RASHIS,
  MODALITY_META,
  buildCaraSequence,
  VIMSHOTTARI_LORDS,
  VIMSHOTTARI_TOTAL,
  type RashiModality,
} from "./data";
import {
  ArrowRightLeft,
  Globe,
  MoveRight,
  Orbit,
  RotateCcw,
  Star,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";

/* ─── Helpers ──────────────────────────────────────────────────────────── */

function ModalityBadge({ modality }: { modality: RashiModality }) {
  const meta = MODALITY_META[modality];
  return (
    <span
      style={{
        fontSize: "0.62rem",
        fontWeight: 950,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: meta.color,
        background: meta.bg,
        padding: "0.12rem 0.35rem",
        borderRadius: 4,
      }}
    >
      {meta.label}
    </span>
  );
}

/* ─── Sub-components ───────────────────────────────────────────────────── */

function VimshottariStrip() {
  return (
    <div
      style={{
        borderRadius: 12,
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
        <Orbit size={16} style={{ color: GOLD_ACCENT }} />
        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: GOLD_ACCENT,
          }}
        >
          Vimśottarī
        </span>
        <span style={{ fontSize: "0.72rem", color: INK_MUTED, marginLeft: "auto" }}>
          Total: {VIMSHOTTARI_TOTAL} years
        </span>
      </div>

      <div style={{ display: "grid", gap: "0.3rem" }}>
        {VIMSHOTTARI_LORDS.map((lord, i) => {
          const cumulative = VIMSHOTTARI_LORDS.slice(0, i + 1).reduce((s, l) => s + l.years, 0);
          return (
            <div
              key={lord.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.4rem 0.6rem",
                borderRadius: 8,
                background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: `${lord.color}18`,
                  border: `1.5px solid ${lord.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: 950,
                  color: lord.color,
                  flexShrink: 0,
                }}
              >
                {lord.abbr}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: lord.color,
                  fontFamily: "var(--font-cormorant), serif",
                }}
              >
                <IAST>{lord.nameIAST}</IAST>
              </span>
              <span style={{ fontSize: "0.78rem", color: INK_PRIMARY, fontWeight: 700, minWidth: 50, textAlign: "right" }}>
                {lord.years}y
              </span>
              <span style={{ fontSize: "0.68rem", color: INK_MUTED, minWidth: 40, textAlign: "right" }}>
                → {cumulative}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "0.5rem",
          paddingTop: "0.5rem",
          borderTop: `1px dashed ${HAIRLINE}`,
          fontSize: "0.75rem",
          color: INK_MUTED,
        }}
      >
        Planet-based · Fixed durations · 9 lords
      </div>
    </div>
  );
}

function CaraStrip({ ascendantIndex }: { ascendantIndex: number }) {
  const sequence = useMemo(() => buildCaraSequence(ascendantIndex), [ascendantIndex]);
  const total = useMemo(() => sequence.reduce((s, item) => s + item.years, 0), [sequence]);

  return (
    <div
      style={{
        borderRadius: 12,
        background: SURFACE,
        border: `1.5px solid ${GOLD_ACCENT}40`,
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
        <MoveRight size={16} style={{ color: GOLD_ACCENT }} />
        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: GOLD_ACCENT,
          }}
        >
          Cara daśā
        </span>
        <span style={{ fontSize: "0.72rem", color: INK_MUTED, marginLeft: "auto" }}>
          Total: ~{total} years
        </span>
      </div>

      <div style={{ display: "grid", gap: "0.3rem" }}>
        {sequence.map((item, i) => {
          const cumulative = sequence.slice(0, i + 1).reduce((s, it) => s + it.years, 0);
          return (
            <div
              key={item.rashi.index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.4rem 0.6rem",
                borderRadius: 8,
                background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: `${item.rashi.color}18`,
                  border: `1.5px solid ${item.rashi.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: 950,
                  color: item.rashi.color,
                  flexShrink: 0,
                }}
              >
                {item.rashi.name.slice(0, 2)}
              </span>
              <span style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: item.rashi.color,
                    fontFamily: "var(--font-cormorant), serif",
                  }}
                >
                  <IAST>{item.rashi.nameIAST}</IAST>
                </span>
                <span style={{ marginLeft: "0.35rem" }}>
                  <ModalityBadge modality={item.rashi.modality} />
                </span>
              </span>
              <span style={{ fontSize: "0.78rem", color: INK_PRIMARY, fontWeight: 700, minWidth: 50, textAlign: "right" }}>
                {item.years}y
              </span>
              <span style={{ fontSize: "0.68rem", color: INK_MUTED, minWidth: 40, textAlign: "right" }}>
                → {cumulative}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "0.5rem",
          paddingTop: "0.5rem",
          borderTop: `1px dashed ${HAIRLINE}`,
          fontSize: "0.75rem",
          color: INK_MUTED,
        }}
      >
        Sign-based · Variable durations · 12 rāśis · ≈84–96 yr total
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export function CaraDashaIntro() {
  const [ascendantIndex, setAscendantIndex] = useState(0);

  const caraSequence = useMemo(() => buildCaraSequence(ascendantIndex), [ascendantIndex]);

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: "20px",
        color: INK_PRIMARY,
      }}
      data-interactive="cara-dasha-intro"
    >
      {/* Header */}
      <div className="mb-4">
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: INK_MUTED,
          }}
        >
          Jaimini Cara daśā interactive
        </p>
        <h2
          className="text-lg font-semibold mt-1"
          style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}
        >
          <IAST>Cara</IAST> Daśā: Sign-Based, Variable, Jaimini
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          Signs — not planets — rule the periods. Durations vary by sign-modality and distance-to-lord.
        </p>
      </div>

      {/* Contrast banner */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1.5px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
          <Orbit size={18} style={{ color: GOLD_ACCENT, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 800, color: GOLD_ACCENT, fontSize: "0.85rem" }}>Vimśottarī</div>
            <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Planet-based · 9 lords · Fixed 120-year cycle
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
          <MoveRight size={18} style={{ color: "#6B5AA8", flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 800, color: "#6B5AA8", fontSize: "0.85rem" }}>Cara daśā</div>
            <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Sign-based · 12 rāśis · Variable ~84–96 year total
            </div>
          </div>
        </div>
      </div>

      {/* Ascendant selector */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block" }}>
          <span
            style={{
              display: "block",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: INK_MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "0.35rem",
            }}
          >
            Ascendant (Lagna) — changes the Cara sequence start
          </span>
          <select
            value={ascendantIndex}
            onChange={(e) => setAscendantIndex(Number(e.target.value))}
            className="w-full rounded-lg px-2.5 py-2 text-sm"
            style={{
              background: "var(--gl-surface-2, #F5EDD8)",
              border: `1px solid ${HAIRLINE}`,
              color: INK_PRIMARY,
              fontWeight: 700,
            }}
          >
            {RASHIS.map((r) => (
              <option key={r.index} value={r.index}>
                {r.name} ({r.nameIAST}) — {MODALITY_META[r.modality].label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Side-by-side strips */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
          gap: "0.85rem",
          marginBottom: "1rem",
        }}
      >
        <VimshottariStrip />
        <CaraStrip ascendantIndex={ascendantIndex} />
      </div>

      {/* Cross-check panel */}
      <div
        style={{
          borderRadius: 12,
          background: `${GOLD_ACCENT}10`,
          border: `1.5px solid ${GOLD_ACCENT}40`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
          <ArrowRightLeft size={16} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Cross-validation at a glance
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
            gap: "0.6rem",
          }}
        >
          {[
            { age: "Age 0–7", vim: "Ketu MD", cara: `${caraSequence[0].rashi.name} daśā` },
            { age: "Age 7–27", vim: "Venus MD", cara: `${caraSequence[1].rashi.name} daśā` },
            { age: "Age 27–33", vim: "Sun MD", cara: `${caraSequence[2].rashi.name} daśā` },
            { age: "Age 33–43", vim: "Moon MD", cara: `${caraSequence[3].rashi.name} daśā` },
          ].map((row) => (
            <div
              key={row.age}
              style={{
                borderRadius: 8,
                background: SURFACE,
                border: `1px solid ${HAIRLINE}`,
                padding: "0.6rem 0.8rem",
              }}
            >
              <div style={{ fontSize: "0.72rem", fontWeight: 950, color: INK_MUTED, textTransform: "uppercase" }}>
                {row.age}
              </div>
              <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, marginTop: "0.2rem" }}>
                <span style={{ color: GOLD_ACCENT }}>{row.vim}</span>
                <span style={{ color: INK_MUTED, margin: "0 0.3rem" }}>+</span>
                <span style={{ color: "#6B5AA8" }}>{row.cara}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modality legend */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
          <Star size={15} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Sign modality drives duration
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))",
            gap: "0.5rem",
          }}
        >
          {(["movable", "fixed", "dual"] as RashiModality[]).map((mod) => {
            const meta = MODALITY_META[mod];
            const examples = RASHIS.filter((r) => r.modality === mod);
            return (
              <div
                key={mod}
                style={{
                  borderRadius: 10,
                  background: meta.bg,
                  border: `1.5px solid ${meta.color}35`,
                  padding: "0.75rem",
                }}
              >
                <div style={{ fontWeight: 800, color: meta.color, fontSize: "0.85rem" }}>{meta.label}</div>
                <div style={{ fontSize: "0.75rem", color: INK_SECONDARY, marginTop: "0.2rem" }}>
                  Typical range: {meta.typicalRange}
                </div>
                <div style={{ fontSize: "0.72rem", color: INK_MUTED, marginTop: "0.3rem" }}>
                  {examples.map((r) => r.name).join(", ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key takeaway */}
      <div
        style={{
          borderRadius: 10,
          background: `${"#6B5AA8"}10`,
          border: `1.5px solid ${"#6B5AA8"}40`,
          padding: "0.85rem 1rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        <Globe size={16} style={{ color: "#6B5AA8", flexShrink: 0, marginTop: 2 }} />
        <span style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
          <strong style={{ color: "#6B5AA8" }}>Jaimini context.</strong>{" "}
          Cara is the primary timing tool of the Jaimini system, used alongside Vimśottarī for cross-validation. Full computation (chara-kārakas, rāśi-dṛṣṭi, argalā) is developed in the Jaimini module (T1-17).
        </span>
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setAscendantIndex(0)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            backgroundColor: "var(--gl-surface-2, #F5EDD8)",
            color: INK_SECONDARY,
            border: `1px solid ${HAIRLINE}`,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={14} />
          Reset to Aries
        </button>
      </div>
    </div>
  );
}
