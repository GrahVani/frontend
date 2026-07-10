"use client";

/**
 * KalachakraOverview — Kālacakra Daśā: the Most Complex Classical System
 *
 * §7 interactive for Lesson 10.6.3.
 *
 * Awareness-level overview: shows the 108 pāda concept, savya/apasavya
 * direction rules, and illustrative sign sequences. Exact computation deferred.
 */

import { useState, useMemo } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  NAKSHATRAS,
  isSavya,
  isApasavya,
  getDirection,
  buildKalachakraSequence,
  KALA_SIGN_SEQUENCE,
} from "./data";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  Compass,
  RotateCcw,
  ShieldAlert,
  Zap,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const SAVYA_COLOR = "#2F7D55";
const APASAVYA_COLOR = "#A23A1E";

/* ─── Sub-components ───────────────────────────────────────────────────── */

function NakshatraGrid({
  selectedNum,
  onSelect,
}: {
  selectedNum: number;
  onSelect: (num: number) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
        gap: "0.4rem",
      }}
    >
      {NAKSHATRAS.map((n) => {
        const dir = getDirection(n.num);
        const isSelected = selectedNum === n.num;
        const dirColor = dir === "savya" ? SAVYA_COLOR : APASAVYA_COLOR;
        return (
          <button
            key={n.num}
            type="button"
            onClick={() => onSelect(n.num)}
            style={{
              padding: "0.5rem 0.4rem",
              borderRadius: 8,
              border: `1.5px solid ${isSelected ? dirColor : HAIRLINE}`,
              background: isSelected ? `${dirColor}15` : dir === "savya" ? `${SAVYA_COLOR}08` : `${APASAVYA_COLOR}08`,
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.15s ease",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 950,
                color: isSelected ? dirColor : INK_SECONDARY,
              }}
            >
              {n.num}
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: isSelected ? dirColor : INK_PRIMARY,
                fontFamily: "var(--font-cormorant), serif",
                marginTop: "0.1rem",
              }}
            >
              <IAST>{n.name}</IAST>
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 800,
                color: dirColor,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                marginTop: "0.2rem",
              }}
            >
              {dir}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function PadaSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (pada: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "0.4rem" }}>
      {[1, 2, 3, 4].map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: 8,
            border: `1.5px solid ${value === p ? GOLD_ACCENT : HAIRLINE}`,
            background: value === p ? `${GOLD_ACCENT}15` : "transparent",
            color: value === p ? GOLD_ACCENT : INK_SECONDARY,
            fontWeight: 800,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          Pāda {p}
        </button>
      ))}
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export function KalachakraOverview() {
  const [nakshatraNum, setNakshatraNum] = useState(1);
  const [pada, setPada] = useState(1);

  const selectedNakshatra = NAKSHATRAS.find((n) => n.num === nakshatraNum)!;
  const direction = getDirection(nakshatraNum);
  const dirColor = direction === "savya" ? SAVYA_COLOR : APASAVYA_COLOR;
  const DirIcon = direction === "savya" ? ArrowRight : ArrowLeft;

  const sequence = useMemo(
    () => buildKalachakraSequence(nakshatraNum, pada),
    [nakshatraNum, pada]
  );

  const savyaCount = NAKSHATRAS.filter((n) => isSavya(n.num)).length;
  const apasavyaCount = NAKSHATRAS.filter((n) => isApasavya(n.num)).length;

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
      data-interactive="kalachakra-overview"
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
          Kālacakra daśā interactive
        </p>
        <h2
          className="text-lg font-semibold mt-1"
          style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}
        >
          <IAST>Kālacakra</IAST> Overview: Wheel of Time
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          Pāda-derived sign daśā — 108 starting points, savya/apasavya directions. Awareness level.
        </p>
      </div>

      {/* 108 pāda banner */}
      <div
        style={{
          borderRadius: 12,
          background: `${GOLD_ACCENT}10`,
          border: `1.5px solid ${GOLD_ACCENT}40`,
          padding: "1rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: `${GOLD_ACCENT}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Zap size={22} style={{ color: GOLD_ACCENT }} />
        </div>
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: GOLD_ACCENT, fontFamily: "var(--font-cormorant), serif" }}>
            108 possible starting points
          </div>
          <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, marginTop: "0.15rem", lineHeight: 1.5 }}>
            27 nakṣatras × 4 pādas each = <strong>108</strong> distinct birth keys. Each pāda maps to a different sign-sequence and duration set.
          </div>
        </div>
      </div>

      {/* Nakṣatra selector */}
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
          <Compass size={15} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Select a nakṣatra
          </span>
          <span style={{ fontSize: "0.72rem", color: INK_MUTED, marginLeft: "auto" }}>
            <span style={{ color: SAVYA_COLOR, fontWeight: 800 }}>{savyaCount} savya</span> ·{" "}
            <span style={{ color: APASAVYA_COLOR, fontWeight: 800 }}>{apasavyaCount} apasavya</span>
          </span>
        </div>

        <NakshatraGrid selectedNum={nakshatraNum} onSelect={setNakshatraNum} />

        {/* Selected detail */}
        <div
          style={{
            marginTop: "0.75rem",
            paddingTop: "0.75rem",
            borderTop: `1px dashed ${HAIRLINE}`,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: INK_PRIMARY,
              fontFamily: "var(--font-cormorant), serif",
            }}
          >
            <IAST>{selectedNakshatra.name}</IAST>
          </span>
          <span style={{ fontSize: "0.75rem", color: INK_MUTED }}>
            Ruler: {selectedNakshatra.ruler}
          </span>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 950,
              color: dirColor,
              background: `${dirColor}15`,
              padding: "0.15rem 0.5rem",
              borderRadius: 5,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {direction} {direction === "savya" ? "(direct)" : "(reverse)"}
          </span>
        </div>
      </div>

      {/* Pāda selector */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.4rem" }}>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: INK_MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Pāda (quarter) of <IAST>{selectedNakshatra.name}</IAST>
          </span>
        </label>
        <PadaSelector value={pada} onChange={setPada} />
      </div>

      {/* Sequence result */}
      <div
        style={{
          borderRadius: 12,
          background: `${dirColor}10`,
          border: `2px solid ${dirColor}45`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
          <DirIcon size={16} style={{ color: dirColor }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: dirColor,
            }}
          >
            Illustrative sign sequence — {direction}
          </span>
        </div>

        <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, marginBottom: "0.5rem" }}>
          Starting from <strong style={{ color: dirColor }}><IAST>{sequence.startSign.nameIAST}</IAST></strong> ·{" "}
          {direction === "savya" ? "Forward (savya) through the zodiac" : "Reverse (apasavya) through the zodiac"}
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {sequence.sequence.map((sign, i) => (
            <div key={sign.index} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <div
                style={{
                  padding: "0.35rem 0.6rem",
                  borderRadius: 8,
                  background: i === 0 ? `${sign.color}20` : `${sign.color}10`,
                  border: `1.5px solid ${i === 0 ? sign.color : `${sign.color}35`}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: sign.color,
                    fontFamily: "var(--font-cormorant), serif",
                  }}
                >
                  <IAST>{sign.nameIAST}</IAST>
                </div>
                {i === 0 && (
                  <div
                    style={{
                      fontSize: "0.55rem",
                      fontWeight: 950,
                      color: sign.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    }}
                  >
                    start
                  </div>
                )}
              </div>
              {i < sequence.sequence.length - 1 && (
                <ChevronRight
                  size={12}
                  style={{
                    color: INK_MUTED,
                    transform: direction === "apasavya" ? "rotate(180deg)" : "none",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Complexity breakdown */}
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
          <AlertTriangle size={15} style={{ color: APASAVYA_COLOR }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: APASAVYA_COLOR,
            }}
          >
            Why it is complex
          </span>
        </div>

        <div style={{ display: "grid", gap: "0.4rem" }}>
          {[
            {
              icon: <ArrowRight size={14} />,
              title: "Savya / Apasavya direction-rules",
              desc: "Sequence runs forward or reverse depending on the nakṣatra-pāda — 12 direct, 15 reverse.",
            },
            {
              icon: <Clock size={14} />,
              title: "Variable durations per sign per pāda",
              desc: "Years per sign vary by pāda — no fixed table like Vimśottarī.",
            },
            {
              icon: <ShieldAlert size={14} />,
              title: "Boundary-case handling",
              desc: "Special rules at pāda boundaries make hand-computation error-prone.",
            },
            {
              icon: <Zap size={14} />,
              title: "108 starting points",
              desc: "27 nakṣatras × 4 pādas = 108 possible sequences, each unique.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                padding: "0.5rem 0.7rem",
                borderRadius: 8,
                background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)",
              }}
            >
              <span style={{ color: APASAVYA_COLOR, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: INK_PRIMARY }}>{item.title}</div>
                <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, marginTop: "0.1rem", lineHeight: 1.5 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System comparison */}
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
          <Clock size={15} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            How it compares
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "0.5rem" }}>
          {[
            { name: "Vimśottarī", basis: "Planet (nakṣatra-lord)", inputs: "Moon's nakṣatra", total: "120 years (fixed)", complexity: "Straightforward" },
            { name: "Cara", basis: "Sign (rāśi)", inputs: "Lagna", total: "~84–96 years (variable)", complexity: "Moderate" },
            { name: "Kālacakra", basis: "Sign (rāśi)", inputs: "Moon's nakṣatra-pāda", total: "Variable (per pāda)", complexity: "Most intricate" },
          ].map((sys) => (
            <div
              key={sys.name}
              style={{
                borderRadius: 10,
                background: sys.name === "Kālacakra" ? `${APASAVYA_COLOR}08` : "transparent",
                border: `1.5px solid ${sys.name === "Kālacakra" ? `${APASAVYA_COLOR}35` : HAIRLINE}`,
                padding: "0.75rem",
              }}
            >
              <div style={{ fontWeight: 800, color: sys.name === "Kālacakra" ? APASAVYA_COLOR : INK_PRIMARY, fontSize: "0.85rem" }}>
                {sys.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: INK_SECONDARY, marginTop: "0.3rem", lineHeight: 1.6 }}>
                <div><strong>Basis:</strong> {sys.basis}</div>
                <div><strong>Input:</strong> {sys.inputs}</div>
                <div><strong>Total:</strong> {sys.total}</div>
                <div><strong>Complexity:</strong> {sys.complexity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deferral banner */}
      <div
        style={{
          borderRadius: 10,
          background: `${APASAVYA_COLOR}10`,
          border: `1.5px solid ${APASAVYA_COLOR}40`,
          padding: "0.85rem 1rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        <BookOpen size={16} style={{ color: APASAVYA_COLOR, flexShrink: 0, marginTop: 2 }} />
        <div>
          <span style={{ fontSize: "0.8rem", fontWeight: 800, color: APASAVYA_COLOR }}>
            Computation deferred — awareness level only
          </span>
          <span style={{ fontSize: "0.78rem", color: INK_SECONDARY, display: "block", marginTop: "0.15rem", lineHeight: 1.5 }}>
            The exact step-by-step computation of Kālacakra (savya/apasavya rules, duration tables,
            boundary handling) belongs to dedicated study or a trusted engine. At Tier-1, hold the
            <strong>principle</strong>: pāda-derived, sign-based, direction-governed, highly intricate.
            Do not improvise the method from a half-remembered rule.
          </span>
        </div>
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => { setNakshatraNum(1); setPada(1); }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            backgroundColor: "var(--gl-surface-2, #F5EDD8)",
            color: INK_SECONDARY,
            border: `1px solid ${HAIRLINE}`,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
}
