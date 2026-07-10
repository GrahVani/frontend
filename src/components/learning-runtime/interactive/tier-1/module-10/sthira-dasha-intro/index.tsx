"use client";

/**
 * SthiraDashaIntro — Jaimini Sthira Daśā Introduction
 *
 * §7 interactive for Lesson 10.6.2.
 *
 * Awareness-level reference table contrasting Cara and Sthira:
 * both rāśi-based Jaimini daśās, different computation rules.
 * Full computation deferred to the Jaimini module (T1-17).
 */

import { useState, useMemo } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  RASHIS,
  MODALITY_META,
  buildCaraSequence,
  buildSthiraSequence,
  COMPARISON_ROWS,
} from "./data";
import {
  ArrowRightLeft,
  BookOpen,
  GitCompare,
  Layers,
  MapPin,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const CARA_COLOR = "#6B5AA8";
const STHIRA_COLOR = "#356CAB";

/* ─── Sub-components ───────────────────────────────────────────────────── */

function SequenceStrip({
  title,
  titleIAST,
  items,
  color,
  total,
}: {
  title: string;
  titleIAST: string;
  items: { rashi: (typeof RASHIS)[number]; years: number }[];
  color: string;
  total: number;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        background: SURFACE,
        border: `1.5px solid ${color}40`,
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
        <Layers size={15} style={{ color }} />
        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color,
          }}
        >
          {title} <span style={{ fontWeight: 500 }}>(<IAST>{titleIAST}</IAST>)</span>
        </span>
        <span style={{ fontSize: "0.72rem", color: INK_MUTED, marginLeft: "auto" }}>
          Total: ~{total} yr
        </span>
      </div>

      <div style={{ display: "grid", gap: "0.25rem" }}>
        {items.map((item, i) => (
          <div
            key={`${item.rashi.index}-${i}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 0.5rem",
              borderRadius: 6,
              background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                background: `${item.rashi.color}18`,
                border: `1.5px solid ${item.rashi.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.6rem",
                fontWeight: 950,
                color: item.rashi.color,
                flexShrink: 0,
              }}
            >
              {item.rashi.name.slice(0, 2)}
            </span>
            <span
              style={{
                flex: 1,
                fontSize: "0.8rem",
                fontWeight: 700,
                color: item.rashi.color,
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              <IAST>{item.rashi.nameIAST}</IAST>
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                color: MODALITY_META[item.rashi.modality].color,
                background: MODALITY_META[item.rashi.modality].bg,
                padding: "0.08rem 0.3rem",
                borderRadius: 4,
                textTransform: "uppercase",
              }}
            >
              {MODALITY_META[item.rashi.modality].label.slice(0, 3)}
            </span>
            <span style={{ fontSize: "0.75rem", color: INK_PRIMARY, fontWeight: 700, minWidth: 32, textAlign: "right" }}>
              {item.years}y
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export function SthiraDashaIntro() {
  const [ascendantIndex, setAscendantIndex] = useState(0);

  const caraSeq = useMemo(() => buildCaraSequence(ascendantIndex), [ascendantIndex]);
  const sthiraSeq = useMemo(() => buildSthiraSequence(ascendantIndex), [ascendantIndex]);
  const caraTotal = useMemo(() => caraSeq.reduce((s, it) => s + it.years, 0), [caraSeq]);
  const sthiraTotal = useMemo(() => sthiraSeq.reduce((s, it) => s + it.years, 0), [sthiraSeq]);

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
      data-interactive="sthira-dasha-intro"
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
          Jaimini Sthira daśā interactive
        </p>
        <h2
          className="text-lg font-semibold mt-1"
          style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}
        >
          <IAST>Sthira</IAST> Daśā: The "Fixed" Jaimini Sign-Daśā
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          Cara and Sthira are both rāśi-based Jaimini systems — but they use different computation rules.
        </p>
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
            Ascendant — same chart, different sequences
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
                {r.name} ({r.nameIAST})
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Side-by-side sequence strips */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
          gap: "0.85rem",
          marginBottom: "1rem",
        }}
      >
        <SequenceStrip
          title="Cara"
          titleIAST="Cara"
          items={caraSeq}
          color={CARA_COLOR}
          total={caraTotal}
        />
        <SequenceStrip
          title="Sthira"
          titleIAST="Sthira"
          items={sthiraSeq}
          color={STHIRA_COLOR}
          total={sthiraTotal}
        />
      </div>

      {/* Comparison table */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
          overflowX: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
          <GitCompare size={16} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Cara vs Sthira comparison
          </span>
        </div>

        <table style={{ width: "100%", minWidth: 500, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.5rem 0.6rem",
                  fontSize: "0.7rem",
                  fontWeight: 950,
                  color: INK_MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderBottom: `2px solid ${HAIRLINE}`,
                }}
              >
                Feature
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.5rem 0.6rem",
                  fontSize: "0.7rem",
                  fontWeight: 950,
                  color: CARA_COLOR,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderBottom: `2px solid ${CARA_COLOR}40`,
                }}
              >
                Cara
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.5rem 0.6rem",
                  fontSize: "0.7rem",
                  fontWeight: 950,
                  color: STHIRA_COLOR,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderBottom: `2px solid ${STHIRA_COLOR}40`,
                }}
              >
                Sthira
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <td
                  style={{
                    padding: "0.55rem 0.6rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: INK_PRIMARY,
                  }}
                >
                  {row.feature}{" "}
                  <span style={{ fontWeight: 500, color: INK_MUTED }}>(<IAST>{row.featureIAST}</IAST>)</span>
                </td>
                <td
                  style={{
                    padding: "0.55rem 0.6rem",
                    fontSize: "0.8rem",
                    color: INK_SECONDARY,
                    lineHeight: 1.5,
                    background:
                      row.highlight === "cara" || row.highlight === "both"
                        ? `${CARA_COLOR}08`
                        : "transparent",
                  }}
                >
                  {row.caraValue}
                </td>
                <td
                  style={{
                    padding: "0.55rem 0.6rem",
                    fontSize: "0.8rem",
                    color: INK_SECONDARY,
                    lineHeight: 1.5,
                    background:
                      row.highlight === "sthira" || row.highlight === "both"
                        ? `${STHIRA_COLOR}08`
                        : "transparent",
                  }}
                >
                  {row.sthiraValue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Jaimini family banner */}
      <div
        style={{
          borderRadius: 12,
          background: `${CARA_COLOR}10`,
          border: `1.5px solid ${CARA_COLOR}40`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
          <MapPin size={16} style={{ color: CARA_COLOR }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: CARA_COLOR,
            }}
          >
            Jaimini family placement
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
            gap: "0.5rem",
          }}
        >
          {[
            {
              label: "Parāśarī stream",
              labelIAST: "Pārāśarī",
              items: "Vimśottarī · Aṣṭottarī · Yoginī",
              color: GOLD_ACCENT,
            },
            {
              label: "Jaimini stream",
              labelIAST: "Jaiminī",
              items: "Cara daśā · Sthira daśā · Rāśi-dṛṣṭi · Argalā",
              color: CARA_COLOR,
            },
          ].map((family) => (
            <div
              key={family.label}
              style={{
                borderRadius: 10,
                background: `${family.color}10`,
                border: `1.5px solid ${family.color}35`,
                padding: "0.75rem",
              }}
            >
              <div style={{ fontWeight: 800, color: family.color, fontSize: "0.85rem" }}>
                {family.label} <span style={{ fontWeight: 500 }}>(<IAST>{family.labelIAST}</IAST>)</span>
              </div>
              <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, marginTop: "0.25rem" }}>
                {family.items}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deferral banner */}
      <div
        style={{
          borderRadius: 10,
          background: `${STHIRA_COLOR}10`,
          border: `1.5px solid ${STHIRA_COLOR}40`,
          padding: "0.85rem 1rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        <BookOpen size={16} style={{ color: STHIRA_COLOR, flexShrink: 0, marginTop: 2 }} />
        <div>
          <span style={{ fontSize: "0.8rem", fontWeight: 800, color: STHIRA_COLOR }}>
            Computation deferred to the Jaimini module (T1-17)
          </span>
          <span style={{ fontSize: "0.78rem", color: INK_SECONDARY, display: "block", marginTop: "0.15rem", lineHeight: 1.5 }}>
            At Tier-1, hold the <strong>principle</strong> — both are rāśi-based Jaimini daśās with different rules.
            The exact step-by-step computation of Sthira belongs to the dedicated Jaimini module.
            Do not improvise the method from a half-remembered rule.
          </span>
        </div>
      </div>

      {/* Key recognition points */}
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
          <ShieldAlert size={15} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Recognition checklist
          </span>
        </div>

        <div style={{ display: "grid", gap: "0.4rem" }}>
          {[
            "Cara and Sthira are BOTH rāśi (sign) daśās — not planet-based.",
            "Cara uses modality + Lagna-distance; Sthira uses a different fixed-pattern.",
            "Both are Jaimini-stream tools, useful as mutual cross-checks.",
            "Full computation for both is in the Jaimini module (T1-17).",
          ].map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.4rem",
                padding: "0.5rem 0.7rem",
                borderRadius: 8,
                background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: `${GOLD_ACCENT}18`,
                  border: `1.5px solid ${GOLD_ACCENT}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 950,
                  color: GOLD_ACCENT,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "0.82rem", color: INK_SECONDARY, lineHeight: 1.5 }}>{point}</span>
            </div>
          ))}
        </div>
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
