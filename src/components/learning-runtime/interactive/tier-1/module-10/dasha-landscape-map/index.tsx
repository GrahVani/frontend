"use client";

/**
 * DashaLandscapeMap — The Honest State of Daśās: Doctrinal Pluralism
 *
 * §7 interactive for Lesson 10.7.5.
 *
 * Lays out the ~14 daśā systems by class, overlays the five-point discipline,
 * and provides honest-framing sentence templates. Closes Module 10.
 */

import { useState } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  DASHA_SYSTEMS,
  DISCIPLINE_STEPS,
  HONEST_FRAMES,
  CLASS_META,
  type DashaClass,
} from "./data";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Layers,
  MapPin,
  MessageSquare,
  RotateCcw,
  Shield,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";

/* ─── Sub-components ───────────────────────────────────────────────────── */

function SystemCard({ system }: { system: (typeof DASHA_SYSTEMS)[number] }) {
  const meta = CLASS_META[system.class];
  const streamColor =
    system.stream === "parashari"
      ? "#B88421"
      : system.stream === "jaimini"
        ? "#6B5AA8"
        : system.stream === "kp"
          ? "#356CAB"
          : INK_MUTED;

  return (
    <div
      style={{
        borderRadius: 10,
        background: SURFACE,
        border: `1.5px solid ${meta.color}35`,
        padding: "0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: meta.color,
            fontFamily: "var(--font-cormorant), serif",
          }}
        >
          <IAST>{system.nameIAST}</IAST>
        </span>
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 950,
            color: streamColor,
            background: `${streamColor}15`,
            padding: "0.08rem 0.3rem",
            borderRadius: 4,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          {system.stream}
        </span>
        {system.totalYears && (
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 800,
              color: INK_MUTED,
              marginLeft: "auto",
            }}
          >
            {system.totalYears} yr
          </span>
        )}
      </div>
      <div style={{ fontSize: "0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>{system.basis}</div>
      <div style={{ fontSize: "0.72rem", color: INK_MUTED, lineHeight: 1.45, marginTop: "0.1rem" }}>
        {system.note}
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export function DashaLandscapeMap() {
  const [activeClass, setActiveClass] = useState<DashaClass | "all">("all");
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  const filtered =
    activeClass === "all" ? DASHA_SYSTEMS : DASHA_SYSTEMS.filter((d) => d.class === activeClass);

  const grouped = {
    default: filtered.filter((d) => d.class === "default"),
    alternative: filtered.filter((d) => d.class === "alternative"),
    conditional: filtered.filter((d) => d.class === "conditional"),
  };

  const selectedFrame = HONEST_FRAMES.find((f) => f.id === selectedFrameId);

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
      data-interactive="dasha-landscape-map"
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
          Module 10 closure interactive
        </p>
        <h2
          className="text-lg font-semibold mt-1"
          style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}
        >
          The Daśā Landscape: Doctrinal Pluralism
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          ~14 systems, one discipline. Complementarity, not confusion.
        </p>
      </div>

      {/* Pluralism banner */}
      <div
        style={{
          borderRadius: 12,
          background: `${GOLD_ACCENT}10`,
          border: `1.5px solid ${GOLD_ACCENT}40`,
          padding: "1rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.6rem",
        }}
      >
        <Layers size={18} style={{ color: GOLD_ACCENT, flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: GOLD_ACCENT, fontFamily: "var(--font-cormorant), serif" }}>
            Doctrinal pluralism = complementarity, not confusion
          </div>
          <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, marginTop: "0.2rem", lineHeight: 1.5 }}>
            Each daśā is a different lens on life-timing — like specialised instruments for different organ systems.
            The abundance is a <strong>resource</strong>, not a defect — provided you use it with discipline.
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        {(["all", "default", "alternative", "conditional"] as const).map((cls) => {
          const label = cls === "all" ? "All ~14" : CLASS_META[cls].label;
          const meta = cls === "all" ? null : CLASS_META[cls];
          const active = activeClass === cls;
          return (
            <button
              key={cls}
              type="button"
              onClick={() => setActiveClass(cls)}
              style={{
                padding: "0.4rem 0.7rem",
                borderRadius: 8,
                border: `1.5px solid ${active ? (meta?.color ?? GOLD_ACCENT) : HAIRLINE}`,
                background: active ? (meta ? `${meta.color}15` : `${GOLD_ACCENT}15`) : "transparent",
                color: active ? (meta?.color ?? GOLD_ACCENT) : INK_SECONDARY,
                fontSize: "0.78rem",
                fontWeight: active ? 800 : 700,
                cursor: "pointer",
              }}
            >
              {label}
              {cls !== "all" && (
                <span style={{ marginLeft: "0.3rem", fontSize: "0.7rem", color: INK_MUTED }}>
                  ({DASHA_SYSTEMS.filter((d) => d.class === cls).length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System grid */}
      <div style={{ marginBottom: "1rem" }}>
        {(activeClass === "all" || activeClass === "default") && grouped.default.length > 0 && (
          <div style={{ marginBottom: "0.75rem" }}>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 950,
                color: CLASS_META.default.color,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.4rem",
              }}
            >
              {CLASS_META.default.label} — {CLASS_META.default.description}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))", gap: "0.5rem" }}>
              {grouped.default.map((s) => (
                <SystemCard key={s.id} system={s} />
              ))}
            </div>
          </div>
        )}

        {(activeClass === "all" || activeClass === "alternative") && grouped.alternative.length > 0 && (
          <div style={{ marginBottom: "0.75rem" }}>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 950,
                color: CLASS_META.alternative.color,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.4rem",
              }}
            >
              {CLASS_META.alternative.label}s — {CLASS_META.alternative.description}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))", gap: "0.5rem" }}>
              {grouped.alternative.map((s) => (
                <SystemCard key={s.id} system={s} />
              ))}
            </div>
          </div>
        )}

        {(activeClass === "all" || activeClass === "conditional") && grouped.conditional.length > 0 && (
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 950,
                color: CLASS_META.conditional.color,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.4rem",
              }}
            >
              {CLASS_META.conditional.label}s — {CLASS_META.conditional.description}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))", gap: "0.5rem" }}>
              {grouped.conditional.map((s) => (
                <SystemCard key={s.id} system={s} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Five-point discipline */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
          <Shield size={15} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            The five-point discipline
          </span>
        </div>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          {DISCIPLINE_STEPS.map((step, i) => (
            <div
              key={step.step}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.6rem",
                padding: "0.6rem 0.8rem",
                borderRadius: 10,
                background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `${GOLD_ACCENT}18`,
                  border: `2px solid ${GOLD_ACCENT}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontWeight: 950,
                  color: GOLD_ACCENT,
                  fontSize: "0.85rem",
                }}
              >
                {step.step}
              </div>
              <div>
                <div style={{ fontWeight: 800, color: INK_PRIMARY, fontSize: "0.85rem" }}>
                  {step.title} <span style={{ fontWeight: 500, color: INK_MUTED }}>(<IAST>{step.titleIAST}</IAST>)</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, marginTop: "0.15rem", lineHeight: 1.5 }}>
                  {step.description}
                </div>
              </div>
              {i < DISCIPLINE_STEPS.length - 1 && (
                <ChevronRight
                  size={14}
                  style={{ color: INK_MUTED, alignSelf: "center", flexShrink: 0, transform: "rotate(90deg)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Honest framing */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
          <MessageSquare size={15} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Practise honest framing
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
          {HONEST_FRAMES.map((frame) => (
            <button
              key={frame.id}
              type="button"
              onClick={() => setSelectedFrameId(frame.id)}
              style={{
                padding: "0.4rem 0.65rem",
                borderRadius: 8,
                border: `1.5px solid ${selectedFrameId === frame.id ? GOLD_ACCENT : HAIRLINE}`,
                background: selectedFrameId === frame.id ? `${GOLD_ACCENT}15` : "transparent",
                color: selectedFrameId === frame.id ? INK_PRIMARY : INK_SECONDARY,
                fontSize: "0.75rem",
                fontWeight: selectedFrameId === frame.id ? 800 : 700,
                cursor: "pointer",
              }}
            >
              {frame.systems.length === 1 ? "Single" : frame.systems.length === 2 ? "Double" : "Triple"} —{" "}
              {frame.id}
            </button>
          ))}
        </div>

        {selectedFrame && (
          <div
            style={{
              borderRadius: 10,
              background: `${GOLD_ACCENT}10`,
              border: `1.5px solid ${GOLD_ACCENT}40`,
              padding: "0.85rem 1rem",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", marginBottom: "0.3rem" }}>
              Template
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: INK_PRIMARY,
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 600,
                lineHeight: 1.45,
                marginBottom: "0.5rem",
              }}
            >
              {selectedFrame.template}
            </div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", marginBottom: "0.2rem" }}>
              Example
            </div>
            <div style={{ fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.55, fontStyle: "italic" }}>
              "{selectedFrame.example}"
            </div>
          </div>
        )}
      </div>

      {/* Meta-pattern banner */}
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
        <BookOpen size={16} style={{ color: "#6B5AA8", flexShrink: 0, marginTop: 2 }} />
        <div>
          <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#6B5AA8" }}>
            Multi-stream honesty — a curriculum meta-pattern
          </span>
          <span style={{ fontSize: "0.78rem", color: INK_SECONDARY, display: "block", marginTop: "0.15rem", lineHeight: 1.5 }}>
            Where traditions differ, disclose which you used and why — never present one stream's output
            with false, unnamed authority. This pattern recurs across aspect-doctrines, friendship-systems,
            drekkāṇa-systems, and now daśā-systems. Pluralism handled this way is a <strong>strength</strong> of jyotiṣa.
          </span>
        </div>
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setActiveClass("all");
            setSelectedFrameId(null);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            backgroundColor: "var(--gl-surface-2, #F5EDD8)",
            color: INK_SECONDARY,
            border: `1px solid ${HAIRLINE}`,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={14} />
          Reset map
        </button>
      </div>
    </div>
  );
}
